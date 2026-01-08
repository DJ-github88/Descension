# SpellWizard to SpellCard Comprehensive Formatting Template

This document provides a complete mapping of EVERY field from the SpellWizard (Steps 1-10) to how it appears on the UnifiedSpellCard. This is intended as a reference for AI-generated spell creation prompts to ensure all fields are properly configured and formatted.

---

# 🚀 AI QUICK REFERENCE (READ THIS FIRST)

> **This section is a condensed summary. Detailed documentation follows below.**

## Pre-Generation Validation Checklist

Before generating any spell, verify:

- [ ] **effectTypes array** - Contains ONLY effect types that have corresponding config objects
- [ ] **Effect configs exist** - Each effect in `effectTypes` has its `*Config` object (damageConfig, buffConfig, etc.)
- [ ] **effects[] array** - For buff/debuff/control: use `effects[]` array (NOT deprecated `statModifiers[]`)
- [ ] **durationUnit matches** - `durationUnit` MUST match `durationType` (e.g., both = 'rounds')
- [ ] **actionPoints set** - `resourceCost.actionPoints` is explicitly set (not undefined)
- [ ] **Concrete values** - All amounts are specific numbers, not vague descriptions
- [ ] **Valid damage types** - Use D&D types: `fire`, `cold`, `lightning`, `acid`, `thunder`, `force`, `necrotic`, `poison`, `psychic`, `radiant`, `bludgeoning`, `piercing`, `slashing` (NOT "physical")
- [ ] **No redundancy** - Information appears in EITHER description OR mechanicsText, never both

## The Golden Rule: description vs mechanicsText

```
┌─────────────────────────────────────────────────────────────────────────┐
│  IF description HAS the info  →  mechanicsText MUST BE EMPTY            │
│  IF description IS empty      →  mechanicsText HAS the formula/details  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Quick Reference Table

| Effect Type | `description` field | `mechanicsText` field |
|-------------|---------------------|----------------------|
| **Damage** (instant/DoT) | Empty or trigger info | `"2d6 + INT Fire Damage"` |
| **Healing** (instant/HoT/shield) | Empty or trigger info | `"2d8 + Spirit Healing"` |
| **Buff** (status/stat) | `"Gain +2 Strength for 3 rounds"` | **ALWAYS EMPTY** |
| **Debuff** (status/stat) | `"Slowed • DC 14 Con save • 2 rounds"` | **ALWAYS EMPTY** |
| **Control** | `"Stunned • DC 15 Con • 1 round"` | Movement distance, restraint details |
| **Summoning** | `"Medium undead • Mental (60ft)"` | `"HP: 20 • Armor: 12"` |
| **Utility** | `"Teleport up to 30 feet"` | Speed, distance details |
| **Purification** | `"Removes poison effects"` | Effects list, strength |
| **Restoration** | `"Restores mana over time"` | Formula, timing |
| **Transformation** | `"Physical • Self • 5 rounds"` | Special effects |

## Minimal Working Examples

### Damage Spell (Simplest)
```javascript
{
  name: "Fire Bolt",
  effectTypes: ['damage'],
  typeConfig: { school: 'fire' },
  damageConfig: {
    formula: '2d6 + intelligence',
    damageType: 'direct',
    elementType: 'fire'
  },
  resourceCost: { actionPoints: 2, resourceTypes: ['mana'], resourceValues: { mana: 8 } }
}
```

### Buff Spell (Status Effect)
```javascript
{
  name: "Protection",
  effectTypes: ['buff'],
  buffConfig: {
    buffType: 'statEnhancement',
    effects: [{  // ⚠️ REQUIRED: Must use effects[] array
      id: 'armor_boost',
      name: 'Armor Boost',
      description: 'Gain +2 armor for 3 rounds',  // ALL INFO HERE - mechanicsText will be empty
      statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' }
    }],
    durationValue: 3,
    durationType: 'rounds',
    durationUnit: 'rounds'  // ⚠️ MUST match durationType
  },
  resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 6 } }
}
```

### Debuff Spell (With Save)
```javascript
{
  name: "Slow",
  effectTypes: ['debuff'],
  debuffConfig: {
    debuffType: 'statusEffect',
    effects: [{  // ⚠️ REQUIRED: Must use effects[] array
      id: 'slow',
      name: 'Slow',
      description: 'Movement speed reduced by 15 feet'  // Concrete amount, not "reduced"
    }],
    durationValue: 2,
    durationType: 'rounds',
    durationUnit: 'rounds',  // ⚠️ MUST match durationType
    saveDC: 14,
    saveType: 'constitution',
    saveOutcome: 'negates'
  },
  resourceCost: { actionPoints: 2, resourceTypes: ['mana'], resourceValues: { mana: 10 } }
}
```

### Control Spell (Forced Movement)
```javascript
{
  name: "Repelling Blast",
  effectTypes: ['control'],
  controlConfig: {
    controlType: 'forcedMovement',
    duration: 0,
    durationUnit: 'instant',
    saveDC: 12,
    saveType: 'strength',
    effects: [{  // ⚠️ REQUIRED: Must use effects[] array
      id: 'push',
      name: 'Push',
      description: 'Pushes target away from caster',
      config: { movementType: 'push', distance: 15 }
    }]
  },
  resourceCost: { actionPoints: 1 }
}
```

## Common Mistakes to Avoid

| ❌ WRONG | ✅ CORRECT |
|----------|-----------|
| `damageType: 'physical'` | `damageType: 'bludgeoning'` (or piercing/slashing) |
| `durationType: 'rounds'` without `durationUnit` | Add `durationUnit: 'rounds'` |
| `statModifiers: [...]` | `effects: [{ statModifier: {...} }]` |
| Missing `actionPoints` in resourceCost | Always include `actionPoints: N` |
| `description: "Movement reduced"` | `description: "Movement speed reduced by 15 feet"` |
| Same info in description AND mechanicsText | Put in ONE field only |
| `effectTypes: ['buff']` without buffConfig | Always add the config object |
| Custom effect IDs like `primal_terror` | Use predefined IDs: `fear`, `stun`, `push` |
| Description contains "DC 14 Con save negates" | Put DC/save in config fields, not description |
| `controlType: 'knockdown'` with `id: 'stun'` | Use correct type: `controlType: 'incapacitation'` |

## ⚠️ CRITICAL: Valid Effect IDs (Combat-Ready Data)

**Descriptions should NOT contain mechanical data like DC, save type, or duration - these should be in config fields so the combat system can process them.**

### Control Effect Types & Valid IDs

| controlType | Valid effect IDs | Notes |
|-------------|------------------|-------|
| `forcedMovement` | `push`, `pull`, `slide`, `teleport` | Config needs `movementType` and `distance` |
| `restraint` | `bind`, `slow`, `snare`, `web` | For speed reduction/root effects |
| `knockdown` | `trip`, `stagger`, `repel`, `throw` | For prone/knockback effects |
| `incapacitation` | `sleep`, `stun`, `paralyze`, `daze` | For stun/paralyze - NOT knockdown |
| `mind_control` | `command`, `confuse`, `dominate`, `fear` | For fear/charm effects |
| `restriction` | `actions`, `reactions`, `attack_types`, `damage_types` | Action denial effects |

### Buff Status Effect IDs

| Category | Valid IDs |
|----------|-----------|
| `combat_advantage` | `attack_rolls`, `damage_rolls`, `healing_rolls`, `saving_throws`, `initiative` |
| `skill_mastery` | `physical`, `mental`, `social` |
| `empower_next` | `spell`, `heal`, `weapon` |
| `damage_shield` | `physical`, `magical`, `complete` |
| `haste` | `movement`, `action`, `reaction` |
| `elemental_infusion` | `fire`, `frost`, `lightning` |
| `invisibility` | `partial`, `complete`, `greater` |

### ❌ BAD: Descriptive strings (not combat-ready)
```javascript
controlConfig: {
  controlType: 'mind_control',
  effects: [{
    id: 'primal_terror',  // ❌ Custom ID - combat system won't recognize
    name: 'Primal Terror',
    description: 'Enemies flee in blind panic. DC 14 Con save negates'  // ❌ DC in description
  }]
}
```

### ✅ GOOD: Data-driven structure (combat-ready)
```javascript
controlConfig: {
  controlType: 'mind_control',
  duration: 2,
  durationUnit: 'rounds',
  saveDC: 14,  // ✅ DC as data field
  saveType: 'constitution',  // ✅ Save type as data field
  savingThrow: true,
  effects: [{
    id: 'fear',  // ✅ Valid predefined ID
    name: 'Primal Terror',  // Display name can be custom
    description: 'Enemies flee in blind panic',  // ✅ No mechanical data
    config: {
      fearStrength: 'moderate'  // ✅ Effect-specific config
    }
  }]
}
```

## Wizard Steps Quick Map

| Step | Primary Config Fields |
|------|----------------------|
| 1. Basic Info | `name`, `description`, `typeConfig.school`, `typeConfig.secondaryElement`, `typeConfig.icon`, `typeConfig.tags` |
| 2. Spell Type | `spellType` (ACTION/CHANNELED/PASSIVE/REACTION/TRAP/STATE/ZONE), `typeConfig.*` |
| 3. Effects | `effectTypes[]`, `damageConfig`, `healingConfig`, `buffConfig`, `debuffConfig`, `controlConfig`, `utilityConfig`, `summonConfig`, `transformationConfig`, `purificationConfig`, `restorationConfig` |
| 4. Targeting | `targetingConfig`, `targetingMode`, `effectTargeting`, `propagation` |
| 5. Resources | `resourceCost.resourceTypes[]`, `resourceCost.resourceValues`, `resourceCost.actionPoints`, `resourceCost.components` |
| 6. Cooldown | `cooldownConfig.type`, `cooldownConfig.value`, `cooldownConfig.charges` |
| 7. Triggers | `triggerConfig.global`, `triggerConfig.effectTriggers`, `triggerConfig.requiredConditions` |
| 7. Mechanics | `effectMechanicsConfigs`, `mechanicsConfig` |
| 8. Channeling | `channelingConfig` (for CHANNELED spells) |
| 9. Balance | Auto-calculated, suggestions only |
| 10. Review | Final preview, save to library |

---

# DETAILED DOCUMENTATION

> **Everything below provides comprehensive details. The Quick Reference above covers 90% of use cases.**

---

## ⚠️ Critical Display Rules

### Unconfigured Fields Handling
**IMPORTANT**: The `UnifiedSpellCard` component automatically hides unconfigured/null/undefined fields. To ensure clean spell card previews in the wizard:

1. **Only include configured fields**: Don't set fields to `null` or empty objects unless they're intentionally disabled
2. **Conditional rendering**: Fields are only displayed if:
   - The effect type is in `effectTypes` array
   - The configuration object exists and has meaningful data
   - Arrays have length > 0
   - Boolean flags are explicitly `true`

3. **Default values**: The component uses sensible defaults for missing fields:
   - Missing `targetingConfig` → defaults to "Touch" range, single target
   - Missing `resourceCost` → defaults to 1 action point
   - Missing `cooldownConfig` → defaults to no cooldown
   - Missing effect configs → effect section is hidden

### Targeting Display Rules
**Proper targeting display requires**:
- `targetingConfig` object must exist with:
  - `targetingType`: 'single', 'area', 'ground', 'cone', 'line', 'self'
  - `rangeType`: 'touch', 'ranged', 'sight', 'unlimited', 'self_centered'
  - `rangeDistance`: number (for ranged)
  - `aoeShape`: 'circle', 'square', 'cone', 'line', etc. (for area effects)
  - `aoeParameters`: object with shape-specific parameters
  - `targetRestrictions`: array (e.g., ['enemy', 'ally'])
  - `maxTargets`: number

- **Effect-specific targeting** (when `targetingMode === 'tagged'`):
  - `effectTargeting[effectType]` must exist for each effect
  - Each effect's targeting config follows same structure as unified targeting

- **Propagation** (optional):
  - Only shown if `propagation.method !== 'none'`
  - Requires `propagation.parameters` with appropriate values

### ⚠️ CRITICAL: Description vs MechanicsText Rules

**IMPORTANT**: The UnifiedSpellCard uses two separate fields for displaying effect information:

1. **`description`** - Shown in grey/italic text, contains the main effect information (but NOT damage formulas)
2. **`mechanicsText`** - Shown below description, contains additional mechanical details

**Key Rules for All Effect Types:**

#### Status Effects (Buff/Debuff)
- **Description contains**: Effect description + Save info + Duration (e.g., "Movement speed reduced by 10 feet • DC 12 Constitution save (negates) • for 1 round")
- **Description must be CONCRETE**: Specify exact amounts (e.g., "Movement speed reduced by 10 feet" not "Movement speed reduced" or "target's movement speed is reduced")
- **Description must explain gameplay mechanics**: For status effects like blinded, explain what it means (e.g., "cannot see, automatically fails sight-based checks, disadvantage on attack rolls (roll two d20s and take the lower result when attacking)")
- **mechanicsText should be EMPTY** - All information is in the description (except for damage formulas which go in mechanicsText for bold formatting)
- **DO NOT** add duration, save DC, or save outcome to mechanicsText for status effects
- **DO NOT** add redundant mechanics like "Movement speed reduced by 50%" when description already has "Movement speed reduced by 10 feet"
- **DO NOT** repeat information (e.g., "Movement speed reduced by 10 feet - target's movement speed is reduced by 10 feet" is redundant)

#### ⚠️ CRITICAL: Stat Modifier Display Rules (Buff/Debuff Effects)
- **NO SEPARATE STAT MODIFIER TEXT**: Stat modifier values (like "+1 ActionPoints", "+2 RageDecay") are NEVER displayed as separate black text
- **ALL INFORMATION IN DESCRIPTION**: All stat modifier information must be written in natural language within the grey description text
- **Description Format**: Use natural, complete sentences with exact amounts and durations
  - ✅ **GOOD**: "1 Extra action point from adrenaline surge, but your rage decays by 2 per round for 2 rounds"
  - ✅ **GOOD**: "Gain +2 armor for 3 rounds"
  - ✅ **GOOD**: "Your rage decays by 2 points per round for 2 rounds"
  - ❌ **BAD**: "Extra action points from adrenaline surge, but rage decays faster" (missing amounts and duration)
  - ❌ **BAD**: "Adrenaline causes rage to decay 2 points per round" (missing duration)
- **Include Duration**: Always specify the duration in the description (e.g., "for 2 rounds", "for 1 minute")
- **Include Exact Amounts**: Always specify exact numerical values (e.g., "1 Extra action point", "2 points per round", "+2 armor")
- **mechanicsText is ALWAYS EMPTY**: UnifiedSpellCard automatically suppresses stat modifier display - descriptions must contain everything

#### Control Effects
- **Description contains**: Effect name + Duration + Save DC (if applicable)
- **mechanicsText contains**: Effect-specific mechanical details (e.g., control type, range, restrictions)
- **DO NOT** duplicate duration/save info in mechanicsText

#### Utility Effects
- **Description contains**: Effect name + Duration (if applicable)
- **mechanicsText contains**: Effect-specific utility details (e.g., flight speed, teleport distance)
- **DO NOT** duplicate duration in mechanicsText

#### Purification Effects
- **Description contains**: Purification type + Target effects
- **mechanicsText contains**: Specific effects removed, strength level
- **DO NOT** duplicate information between description and mechanicsText

#### Summoning Effects
- **Description contains**: Creature name + Quantity + Control type
- **mechanicsText contains**: Creature-specific stats, abilities, or special rules
- **DO NOT** duplicate creature name/quantity in mechanicsText

#### Restoration Effects
- **Description contains**: Restoration type + Resource type
- **mechanicsText contains**: Formula, restoration amount, timing details
- **DO NOT** duplicate resource type in mechanicsText

**General Rule**: If information appears in the description, it should NOT appear in mechanicsText. The description is the primary display, mechanicsText is for supplementary details only.

### Best Practices for Clean Previews

1. **Effect Types**: Only include effect types that have been configured:
   ```javascript
   effectTypes: ['damage', 'healing'] // Only if both are configured
   ```

2. **Config Objects**: Only include config objects if they have data:
   ```javascript
   damageConfig: hasDamage ? { formula: '2d6', ... } : null
   ```

3. **Arrays**: Ensure arrays are populated or empty (not undefined):
   ```javascript
   targetRestrictions: restrictions.length > 0 ? restrictions : []
   ```

4. **Conditional Fields**: Use conditional logic for optional features:
   ```javascript
   triggerConfig: hasTriggers ? { ... } : null
   rollableTable: enabled ? { ... } : null
   ```

5. **Targeting**: Always provide complete targeting config:
   ```javascript
   targetingConfig: {
     targetingType: 'area',
     rangeType: 'ranged',
     rangeDistance: 30,
     aoeShape: 'circle',
     aoeParameters: { radius: 20 },
     targetRestrictions: ['enemy'],
     maxTargets: 5
   }
   ```

### Fallback Behavior When Effects Arrays Are Missing

**⚠️ CRITICAL - Effects Array Requirements:**

The UnifiedSpellCard component **requires properly structured effects arrays** for detailed effect display. When these are missing, the component falls back to generic placeholders:

**Buff Effects:**
- **Missing `buffConfig.effects[]`**: Shows "BUFF EFFECT - {duration} Configure stat modifiers or status effects below"
- **Missing `buffConfig` entirely**: Shows "Buff Effect - Effect details not configured"

**Debuff Effects:**
- **Missing `debuffConfig.effects[]`**: Only shows saving throw information, no actual debuff effects
- **Missing `debuffConfig` entirely**: Shows "Debuff Effect - Effect details not configured"

**Control Effects:**
- **Missing `controlConfig.effects[]`**: Shows "Control Effect - Effect details not configured"
- **Missing `controlConfig` entirely**: Shows "Control Effect - Effect details not configured"

**⚠️ COMMON ISSUE - Frost Nova Example:**

The Frost Nova spell has this structure:
```javascript
debuffConfig: {
  debuffType: 'statusEffect',
  durationValue: 2,
  durationType: 'rounds',
  saveDC: 14,
  saveType: 'constitution'
  // MISSING: effects: [{ id: 'slow', name: 'Slow', description: 'Movement speed reduced' }]
}
```

**Result**: Only shows "DC 14 Constitution save" with no actual "Slow" effect details.

**Correct Structure**:
```javascript
debuffConfig: {
  debuffType: 'statusEffect',
  durationValue: 2,
  durationType: 'rounds',
  saveDC: 14,
  saveType: 'constitution',
  effects: [{
    id: 'slow',
    name: 'Slow',
    description: 'Movement speed reduced by half',
    // Additional status effect configuration
  }]
}
```

### Preview in Wizard (Step 10)
The `Step10Review` component uses `mapWizardStateToPreviewState()` to transform wizard state into preview format. This function:
- Filters out unconfigured fields
- Provides defaults for required fields
- Ensures proper structure for `UnifiedSpellCard`
- Handles both unified and effect-specific targeting modes

**Result**: The preview shows exactly what will appear in the final spell card, with no unconfigured placeholders or "undefined" text.

## Table of Contents
1. [Step 1: Basic Information](#step-1-basic-information)
2. [Step 2: Spell Type](#step-2-spell-type)
3. [Step 3: Effects](#step-3-effects)
4. [Step 4: Targeting & Propagation](#step-4-targeting--propagation)
5. [Step 5: Resources](#step-5-resources)
6. [Step 6: Cooldown](#step-6-cooldown)
7. [Step 7: Triggers](#step-7-triggers)
8. [Step 7: Mechanics](#step-7-mechanics)
9. [Step 8: Channeling](#step-8-channeling)
10. [Step 9: Balance](#step-9-balance)
11. [Step 10: Review](#step-10-review)

---

## Step 1: Basic Information

### Fields Configured:
- **name** (string, required)
- **description** (string, required)
- **typeConfig.school** (string) - Primary damage/healing type
- **typeConfig.secondaryElement** (string) - Secondary damage/healing type ⚠️ **IMPORTANT: Set this for spells with multiple damage types!**
- **typeConfig.icon** (string) - WoW icon identifier
- **typeConfig.tags** (array) - Array of tag strings

**⚠️ CRITICAL - Multiple Damage Types:**
- **You can set up to 2 damage types per spell** using `typeConfig.school` (primary) and `typeConfig.secondaryElement` (secondary)
- **If your spell deals multiple types of damage** (e.g., "Fire and Cold" or "Lightning and Thunder"), you **MUST** set both:
  - `typeConfig.school` = First damage type (e.g., "fire")
  - `typeConfig.secondaryElement` = Second damage type (e.g., "cold")
- **The spell card will display both types** as separate badges: "Fire" and "Cold"
- **The damage formula will show**: "2d6 Fire and Cold Damage"
- **If you only set `school`**, the spell will only show one damage type badge

### SpellCard Display Mapping:

#### Name
- **Location**: Card header, main title
- **Format**: `{spell.name || 'Unnamed Spell'}`
- **CSS Class**: `pf-spell-name`

#### Description
- **Location**: Card body, description section
- **Format**: Raw text display
- **CSS Class**: `pf-spell-description`
- **Conditional**: Only shown if `showDescription={true}`

#### Icon
- **Location**: Card header, left side
- **Format**: `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`
- **Fallback**: `inv_misc_questionmark`
- **CSS Class**: `pf-spell-icon`

#### Damage Types (School + Secondary Element)
- **Location**: Card header, right side badges
- **Format Logic**:
  ```
  Primary: typeConfig.school || damageConfig.elementType || damageTypes[0]
  Secondary: typeConfig.secondaryElement (if exists)
  ```
- **Display**:
  - Badge format: "Fire" (primary), "Cold" (secondary if exists)
  - Color-coded badges
  - Maximum 2 damage types displayed
- **⚠️ HOW TO SET MULTIPLE DAMAGE TYPES:**
  1. In Step 1 (Basic Info), select your **Primary** damage type from the element selector
  2. **Then select a SECOND element** - this will automatically become your **Secondary** damage type
  3. Both will appear as separate badges on the spell card
  4. The damage formula will show both types: "2d6 Fire and Cold Damage"
  5. **If you want only one damage type**, only select the primary element
- **⚠️ CRITICAL - Valid Damage Types (D&D 5e Standard + Custom):**
  - Physical: `bludgeoning`, `piercing`, `slashing` (use one of these, NOT "physical")
  - Elemental: `acid`, `cold`, `fire`, `lightning`, `thunder`
  - Magical: `force`, `necrotic`, `poison`, `psychic`, `radiant`
  - Custom: `chaos` (unpredictable magic that defies categorization)
  - Healing: `healing` (for positive effects)
  - **Normalization Rules:**
    - `ice/frost` → `cold`
    - `electric` → `lightning`
    - `holy` → `radiant`
    - `shadow` → `necrotic`
    - `magical` → `force` (default)
  - **Invalid/Non-Standard Types:** `physical`, `ice`, `frost`, `electric`, `holy`, `shadow`, `arcane`, `nature`, `void`, etc.
  - **⚠️ IMPORTANT:** "physical" is NOT a valid damage type. Use `bludgeoning`, `piercing`, or `slashing` instead.

#### Tags
- **Location**: Card footer
- **Format**: Badge list, max 6 tags
- **Source**: `typeConfig.tags || spell.tags || effectTypes`
- **Filtered**: Removes 'debuff' from effectTypes tags
- **CSS Class**: `spell-tag`

---

## Step 2: Spell Type

### Fields Configured:
- **spellType** (enum: 'ACTION', 'CHANNELED', 'PASSIVE', 'REACTION', 'TRAP', 'STATE', 'ZONE')
  - **CHANNELED**: For spells that require concentration and last multiple rounds (e.g., Fiery Aura, Demonic Empowerment)
  - **PASSIVE**: For always-active abilities
  - **ACTION**: Default for most offensive spells
- **typeConfig** (object) - Type-specific configuration

### SpellCard Display Mapping:

#### Spell Type Badge
- **Location**: Card header, icon badge (spellbook variant only)
- **Format**: `{spell.spellType || 'ACTION'}`
- **CSS Class**: `spell-type-badge`

#### Cast Time (formatCastTime function)
- **Location**: Card header meta
- **Format Logic**:
  ```
  CHANNELED → "Channeled"
  REACTION → "Reaction"
  PASSIVE → "Passive"
  TRAP → "Trap"
  STATE → "State"
  ZONE → "Zone"
  ACTION with castTime > 0:
    - IMMEDIATE: "1 Turn" or "N Turns"
    - START_OF_TURN: "N Turns (start of turn)"
    - END_OF_TURN: "N Turns (end of turn)"
  Default: "Instant"
  ```
- **Source Fields**:
  - `spell.castTime`
  - `spell.castingTime`
  - `spell.typeConfig.castTime`
  - `spell.typeConfig.castTimeType`

#### Type-Specific Configuration Bullets (formatTypeSpecificBullets function)

**ACTION:**
- `typeConfig.castTime` (number) - Cast time in turns
- `typeConfig.castTimeType` (enum: 'IMMEDIATE', 'START_OF_TURN', 'END_OF_TURN') - When cast time applies
- If `castTimeType !== 'IMMEDIATE'` → Bullet: "{castTimeType.replace(/_/g, ' ').toLowerCase()}"

**CHANNELED:**
- Duration: `"Up to {maxChannelDuration} {durationUnit.toLowerCase()}"`
- Interruptible: `"Can be interrupted"` or `"Cannot be interrupted"` (if `interruptible` is defined)
- Movement: `"Can move while channeling"` or `"Must stand still"` (if `movementAllowed` is defined)
- Concentration DC: `"DC {concentrationDC} {dcType}"` (if `concentrationDC` is defined)
- Tick Frequency: `"{tickFrequency.replace(/_/g, ' ').toLowerCase()}"` (if `tickFrequency` exists)
- Break Effect: `"break: {breakEffect}"` (if `breakEffect` exists and not 'none')

**Fields Used:**
- `typeConfig.maxChannelDuration` (number) - Maximum channel duration
- `typeConfig.durationUnit` (enum: 'TURNS', 'ROUNDS') - Duration unit
- `typeConfig.interruptible` (boolean) - Whether channeling can be interrupted
- `typeConfig.movementAllowed` (boolean) - Whether caster can move while channeling
- `typeConfig.concentrationDC` (number) - Base concentration DC (default: 10)
- `typeConfig.dcType` (enum: 'CONSTITUTION', 'STRENGTH', 'AGILITY', 'INTELLIGENCE', 'SPIRIT', 'CHARISMA') - Stat used for concentration checks
- `typeConfig.tickFrequency` (enum: 'START_OF_TURN', 'END_OF_TURN', 'CONTINUOUS') - Effect frequency
- `typeConfig.breakEffect` (string) - Effect when channeling is broken (default: 'none')

**REACTION:**
- Availability: `"{availabilityType.replace(/_/g, ' ').toLowerCase()}"` (default: "always available")
- Uses Per Turn: `"{usesPerTurn}/turn"` (if `limitUsesPerTurn === true`)
- Reaction Window: `"{reactionWindow} window"` (if `reactionWindow` exists and not 'immediate')
- Cooldown: `"{cooldownAfterTrigger} {cooldownUnit} cooldown"` or `"no cooldown"` (if `cooldownAfterTrigger === 0`)
- Max Triggers: 
  - `-1` → `"unlimited triggers"`
  - `1` → `"single use"`
  - `>1` → `"max {maxTriggers} triggers"`

**Fields Used:**
- `typeConfig.availabilityType` (enum: 'ALWAYS', 'PREPARED', 'CONDITIONAL') - When reaction is available
- `typeConfig.limitUsesPerTurn` (boolean) - Whether to limit uses per turn
- `typeConfig.usesPerTurn` (number) - Number of uses per turn (if `limitUsesPerTurn === true`)
- `typeConfig.reactionWindow` (string) - Reaction window type (default: 'immediate')
- `typeConfig.cooldownAfterTrigger` (number) - Cooldown after trigger (0 = no cooldown)
- `typeConfig.cooldownUnit` (string) - Cooldown unit (default: 'seconds')
- `typeConfig.maxTriggers` (number) - Maximum triggers (-1 = unlimited)

**TRAP:**
- Placement Time: `"{placementTime} turns to place"` (if `placementTime > 1`)
- Visibility:
  - `"hidden"` → `"hidden"`
  - `"magical"` → `"magical aura"`
  - `"visible"` → `"visible to all"`
- Cooldown: `"{cooldownAfterTrigger} {cooldownUnit} cooldown"` or `"no cooldown"` (if `cooldownAfterTrigger === 0`)
- Max Triggers: Same logic as REACTION

**Fields Used:**
- `typeConfig.placementTime` (number) - Turns to place trap (default: 1)
- `typeConfig.visibility` (enum: 'hidden', 'visible', 'magical') - Trap visibility
- `typeConfig.cooldownAfterTrigger` (number) - Cooldown after trigger (0 = no cooldown)
- `typeConfig.cooldownUnit` (string) - Cooldown unit (default: 'seconds')
- `typeConfig.maxTriggers` (number) - Maximum triggers (-1 = unlimited)
- `trapConfig.placementPosition` (object) - `{ x: number, y: number }` - Grid position
- `trapConfig.placementRadius` (number) - Trap size in feet
- `trapConfig.detectionMethod` (enum: 'perception', 'investigation', 'arcana', 'detect_magic', 'true_sight')
- `trapConfig.disarmMethod` (enum: 'thieves_tools', 'arcana', 'strength', 'agility', 'dispel_magic', 'specific_item')
- `trapConfig.detectionDC` (number) - Difficulty to detect (5-30)
- `trapConfig.disarmDC` (number) - Difficulty to disarm (5-30)
- `trapConfig.trapDuration` (enum: 'permanent', 'timed', 'conditional')
- `trapConfig.durationValue` (number) - Duration amount (if timed)
- `trapConfig.durationUnit` (enum: 'turns', 'rounds', 'minutes', 'hours', 'days')
- `trapConfig.conditionType` (enum) - For conditional duration: 'combat_end', 'dawn', 'dusk', 'short_rest', 'long_rest', 'area_cleared', 'caster_leaves'
- `trapConfig.resetTime` (number) - Time before trap can trigger again in seconds (0 = no reset)

**STATE:**
- Visibility: Same logic as TRAP
- Cooldown: Same logic as REACTION/TRAP
- Max Triggers: Same logic as REACTION/TRAP

**Fields Used:**
- `typeConfig.stateVisibility` (enum: 'visible', 'self_only', 'hidden') - State visibility
- `typeConfig.cooldownAfterTrigger` (number) - Cooldown after trigger (0 = no cooldown)
- `typeConfig.cooldownUnit` (string) - Cooldown unit (default: 'seconds')
- `typeConfig.maxTriggers` (number) - Maximum triggers (-1 = unlimited, default: -1)

**ZONE:**
- Duration: `"{zoneDuration} {zoneDurationUnit}"`
- Trail: `"leaves trail"` (if `leaveTrail === true`)
- Trail Duration: `"trail: {trailDuration} {trailDurationUnit}"` (if `leaveTrail === true`)

**Fields Used:**
- `typeConfig.zoneDuration` (number) - Duration value for how long the zone persists
- `typeConfig.zoneDurationUnit` (enum: 'seconds', 'minutes', 'hours', 'days', 'weeks', 'rounds', 'turns') - Unit for zone duration
- `typeConfig.leaveTrail` (boolean) - Whether the zone leaves a trail as it moves
- `typeConfig.trailDuration` (number) - Duration for how long each trail segment remains active
- `typeConfig.trailDurationUnit` (enum: 'seconds', 'minutes', 'hours', 'days', 'weeks', 'rounds', 'turns') - Unit for trail duration

**PASSIVE:**
- Toggleable: Displayed as part of the spell tags (if `toggleable === true`), not as a separate bullet

**Fields Used:**
- `typeConfig.toggleable` (boolean) - Whether the passive effect can be turned on and off
- **⚠️ IMPORTANT:** When `toggleable === true`, it **MUST** be included in the spell's `tags` array (e.g., `tags: ['passive', 'toggleable', ...]`) to appear in the tag display. The toggleable property will NOT appear as a separate bullet point in the type-specific bullets section.

---

## Step 3: Effects

### Effect Types Available:
- **damage** - Damage effects
- **healing** - Healing effects
- **buff** - Buff effects
- **debuff** - Debuff effects
- **utility** - Utility effects
- **control** - Control effects
- **summoning** - Summoning effects
- **transformation** - Transformation effects
- **purification** - Purification effects
- **restoration** - Resource restoration effects

### SpellCard Display Mapping:

#### Damage Effects (formatDamage function)

**⚠️ FORMATTING RULE**: Damage formulas are displayed in the `mechanicsText` field (bold plain text), never in `description`.

**Damage Type Suffix Logic:**
- **Priority**: `damageTypes[]` array → `typeConfig.school` + `typeConfig.secondaryElement` → `damageConfig.elementType`
- **Multiple Types**: "Cold and Lightning Damage" (joined with "and")
  - **To get multiple types**: Set both `typeConfig.school` AND `typeConfig.secondaryElement` in Step 1
  - Example: `school: "fire"` + `secondaryElement: "cold"` → "Fire and Cold Damage"
- **Single Type**: "Fire Damage" (capitalized)
  - **To get single type**: Only set `typeConfig.school` in Step 1
- **Normalization**: `ice/frost` → `cold`, `electric` → `lightning`, `holy` → `radiant`, `shadow` → `necrotic`
- **⚠️ REMINDER**: If your spell should deal multiple damage types, make sure to set BOTH `school` and `secondaryElement` in Step 1!

**Instant Damage:**
```
Resolution = DICE:
  "{cleanedFormula}{damageTypeSuffix}"
  Example: "2d6 + Intelligence Fire Damage"
  
  With Chance On Hit:
  "{cleanedFormula}{damageTypeSuffix} • {chanceInfo}"
  Example: "2d6 + Intelligence Fire Damage • 15% chance on hit: Target is stunned"

Resolution = CARDS:
  "Draw {drawCount} cards: {cleanedFormula}{damageTypeSuffix}"
  Example: "Draw 3 cards: CARD_VALUE + POKER_HAND_RANK * 3 Fire Damage"
  
  With Chance On Hit:
  "Draw {drawCount} cards: {cleanedFormula}{damageTypeSuffix} • {chanceInfo}"
  Example: "Draw 3 cards: CARD_VALUE + POKER_HAND_RANK * 3 Fire Damage • 25% chance (Face Cards): Target burns"

Resolution = COINS:
  "Flip {flipCount} coins: {cleanedFormula}{damageTypeSuffix}"
  Example: "Flip 4 coins: HEADS_COUNT * 6 + LONGEST_STREAK * 2 Fire Damage"
  
  With Chance On Hit:
  "Flip {flipCount} coins: {cleanedFormula}{damageTypeSuffix} • {chanceInfo}"
  Example: "Flip 4 coins: HEADS_COUNT * 6 + LONGEST_STREAK * 2 Fire Damage • 15% chance (All Heads): Target is stunned"
```

**Note**: Chance on hit is integrated directly into the instant damage mechanics text with a bullet separator (•), not shown as a separate "Chance Effect" entry.

**DoT (Damage Over Time):**
```
Standard DoT:
  "{formula} {damageType} per {tickFrequency} for {duration} {tickFrequency}s"
  Example: "1d4 + Intelligence/2 Fire per round for 3 rounds"

Progressive DoT:
  "{formula1} → {formula2} → {formula3} over {duration} {tickFrequency}s"
  Each stage: "{formula} ({spellEffect})" if special effect exists

Card-based DoT:
  "Draw {drawCount} cards: {formula} per {tickFrequency} for {duration} {tickFrequency}s"

Coin-based DoT:
  "Flip {flipCount} coins: {formula} per {tickFrequency} for {duration} {tickFrequency}s"
```

**Combined Instant + DoT:**
```
Same resolution + same formula:
  "Draw {count} cards: {formula} (instant + DoT for {duration})"

Different formulas:
  instant: "{formula1}"
  dot: "{formula2} per round for {duration} rounds"
```

**Fields Used:**
- `damageConfig.formula`
- `damageConfig.elementType` / `damageConfig.secondaryElementType`
- `damageConfig.damageType` ('direct', 'dot', 'area')
- `damageConfig.hasDotEffect`
- `damageConfig.dotConfig.duration`
- `damageConfig.dotConfig.tickFrequency`
- `damageConfig.dotConfig.dotFormula`
- `damageConfig.dotConfig.isProgressiveDot`
- `damageConfig.dotConfig.progressiveStages[]`
- `damageConfig.dotConfig.cardConfig.formula` / `damageConfig.dotConfig.coinConfig.formula`
- `damageConfig.areaShape` ('circle', 'square', 'cone', 'line') - For area damage
- `damageConfig.areaParameters` (object) - Area dimensions: `{ radius: 5 }`, `{ width: 10, length: 20 }`, etc.
- `damageConfig.triggerCondition` (string) - When damage occurs: 'area_entry', 'damage_taken', etc.
- `damageConfig.triggerDescription` (string) - Description of trigger condition
- `damageConfig.description` (string) - General damage effect description
- `damageConfig.chanceOnHitConfig` (object) - Chance-based additional effects (integrated into instant damage display)
- `cardConfig.formula` / `cardConfig.drawCount`
- `coinConfig.formula` / `coinConfig.flipCount`
- `resolution` ('DICE', 'CARDS', 'COINS')

**Area Damage:**
```
"Area Damage: {formula} {damageType} - {triggerDescription}"
Example: "Area Damage: 1d6 Fire - Creatures that enter or start their turn in flame areas take 1d6 fire damage"
```

**Critical Hit Configuration:**
- `damageConfig.criticalConfig.enabled` (boolean) - Enable critical hits
- `damageConfig.criticalConfig.critType` (enum: 'dice', 'cards', 'coins') - Resolution method for crits
- `damageConfig.criticalConfig.critOnlyEffect` (boolean) - Effect-only crits (no damage bonus)
- `damageConfig.criticalConfig.useRollableTable` (boolean) - Use rollable table for crit effects
- `damageConfig.criticalConfig.spellEffect` (string | null) - Reference to spell from library
- `damageConfig.criticalConfig.critEffects` (array) - Additional effects: 'knockback', 'stun', 'burning', 'shock', 'freeze', 'disarm'

**Dice-Based Critical Hits:**
- `damageConfig.criticalConfig.critMultiplier` (number) - Multiplier for crit damage (1-10, default: 2)
- `damageConfig.criticalConfig.critDiceOnly` (boolean) - Multiply only dice, not modifiers
- `damageConfig.criticalConfig.extraDice` (string) - Extra dice on crit (e.g., "2d6")
- `damageConfig.criticalConfig.explodingDice` (boolean) - Enable exploding dice
- `damageConfig.criticalConfig.explodingDiceType` (enum: 'reroll_add', 'double_value', 'add_max')

**Card-Based Critical Hits:**
- `damageConfig.criticalConfig.cardCritRule` (enum: 'face_cards', 'aces', 'specific_suit', 'red_cards', 'black_cards', 'pairs')
- `damageConfig.criticalConfig.critSuit` (enum: 'hearts', 'diamonds', 'clubs', 'spades') - For specific_suit
- `damageConfig.criticalConfig.cardCritResolution` (enum: 'draw_add', 'multiply_value', 'double_damage')
- `damageConfig.criticalConfig.extraCardDraw` (number) - Extra cards to draw (1-10)

**Coin-Based Critical Hits:**
- `damageConfig.criticalConfig.coinCritRule` (enum: 'all_heads', 'all_tails', 'sequence', 'majority')
- `damageConfig.criticalConfig.coinCount` (number) - Number of coins (1-10)
- `damageConfig.criticalConfig.coinCritResolution` (enum: 'flip_add', 'multiply_value', 'double_damage')
- `damageConfig.criticalConfig.extraCoinFlips` (number) - Extra coins to flip (1-10)

**Display**: Shown as "Critical: {multiplier}x" badge if enabled, with details in effect description
**Legacy Support**: Also supports `damageConfig.canCrit`, `damageConfig.critMultiplier`, `damageConfig.critDiceOnly`

**Saving Throw Configuration:**
- `damageConfig.savingThrowConfig.enabled` (boolean)
- `damageConfig.savingThrowConfig.savingThrowType` (enum: 'strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma')
- `damageConfig.savingThrowConfig.difficultyClass` (number) - DC (5-30, default: 15)
- `damageConfig.savingThrowConfig.partialEffect` (boolean) - Enable partial effect on successful save
- `damageConfig.savingThrowConfig.partialEffectFormula` (string) - Formula for reduced effect on save (e.g., 'damage/2', 'damage/4', '0', 'MAX(damage/2, 1)')
- `damageConfig.savingThrowConfig.saveOutcome` (enum: 'negates', 'halves', 'none') - What happens on successful save
- **Format**: `"DC {dc} {saveType} ({outcome})"`
- **Display Location**: Below damage text
- **Legacy Support**: Also supports `damageConfig.savingThrow`, `damageConfig.difficultyClass`, `damageConfig.partialEffect`, `damageConfig.partialEffectFormula`

**⚠️ CRITICAL - Saving Throw Display Rules:**

**For Damage Effects:**
- Saving throws are **integrated into the damage mechanics text**, not shown as separate effects
- They appear as part of the damage description: `"DC {dc} {saveType} ({outcome})"`
- Example: `"3d6 Cold Damage • DC 14 Constitution (halves)"`

**For Debuff/Control Effects:**
- Saving throws are **shown as separate "Saving Throw" effect entries**
- Format: `"Saving Throw - DC {dc} {saveType} save • {outcome}"`
- Example: `"Saving Throw - DC 14 Constitution save • negates"`

**For Buff Effects:**
- Saving throws are **not typically used** for buff effects (buffs are beneficial)
- If present, they follow the same rules as debuff/control effects

#### Healing Effects (formatHealing function)

**Direct Healing:**
```
Resolution = DICE:
  "{formula} Healing"
  Example: "2d8 + Spirit Healing"

Resolution = CARDS:
  "Draw {drawCount} cards: {formula} Healing"
  Example: "Draw 3 cards: CARD_VALUE + POKER_HAND_RANK * 3 Healing"

Resolution = COINS:
  "Flip {flipCount} coins: {formula} Healing"
  Example: "Flip 4 coins: HEADS_COUNT * 6 Healing"
```

**HoT (Healing Over Time):**
```
Standard HoT:
  "{formula} per {tickFrequency} for {duration} {tickFrequency}s"
  Example: "1d4 + Spirit/2 per round for 3 rounds"

Progressive HoT:
  "Round {turn1}: {formula1} → Round {turn2}: {formula2}"
  Example: "Round 1: 1d4 + INT/2 → Round 2: 2d4 + INT → Round 3: 3d4 + INT"

Card-based HoT:
  "Draw {drawCount} cards: {formula} per {tickFrequency} for {duration} {tickFrequency}s"

Coin-based HoT:
  "Flip {flipCount} coins: {formula} per {tickFrequency} for {duration} {tickFrequency}s"
```

**Shield Healing:**
```
Base Format:
  "{formula} absorption for {shieldDuration} round(s)"

With damage types:
  "{formula} absorption (Fire only) for 3 rounds"

Bullet points added:
  - "{damageType} only" (if not 'all')
  - "Excess → Healing" (if overflow === 'convert_to_healing')
  - "Shatters" (if breakBehavior === 'shatter')
  - "Fades" (if breakBehavior === 'fade')
```

**Combined Healing (Direct + HoT + Shield):**
```
Format: "{direct}. {hot}. {shield}"`
Example: "2d8 + Spirit Healing. 1d4 + Spirit/2 per round for 3 rounds. 2d6 + Spirit absorption for 3 rounds"
```

**Fields Used:**
- `healingConfig.formula`
- `healingConfig.healingType` ('direct', 'instant', 'hot', 'shield')
- `healingConfig.hotFormula`
- `healingConfig.hotDuration`
- `healingConfig.hotTickType` ('round', 'turn')
- `healingConfig.isProgressiveHot`
- `healingConfig.hotProgressiveStages[]`
- `healingConfig.shieldFormula`
- `healingConfig.shieldDuration`
- `healingConfig.shieldDamageTypes`
- `healingConfig.shieldOverflow`
- `healingConfig.shieldBreakBehavior`
- `healingConfig.cardConfig.formula` / `healingConfig.hotCardConfig.formula` / `healingConfig.shieldCardConfig.formula`
- `healingConfig.coinConfig.formula` / `healingConfig.hotCoinConfig.formula` / `healingConfig.shieldCoinConfig.formula`
- `healingConfig.hasHotEffect` (boolean)
- `healingConfig.hasShieldEffect` (boolean)

#### Buff Effects

**Display Format Logic:**
- **If `buffConfig` exists**: Shows detailed buff effects based on configuration
- **If `buffConfig` missing but 'buff' in `effectTypes`**: Shows generic "Buff Effect - Effect details not configured"

**Stat Enhancements:**
```
"+{magnitude} {statName}" or "+{magnitude}% {statName}"
Example: "+2 Strength" or "+10% Intelligence"
```

**Status Effects:**
```
"{effectName}: {effectDescription}"
Example: "Haste: +1 action per turn"
```

**Temporary HP:**
```
"{formula} Temporary Hit Points"
Example: "1d6 + Constitution Temporary Hit Points"
```

**Progressive Buffs:**
```
"Round 1: {formula1} → Round 2: {formula2}"
Example: "Round 1: +1 Strength → Round 2: +2 Strength → Round 3: +3 Strength"
```

**Duration Display:**
```
Instant: "Instant"
Permanent: "Permanent (Dispellable)" or "Permanent (Cannot be dispelled)"
Rounds: "{durationValue} rounds"
Turns: "{durationValue} turns"
Rest: "until {restType} rest"
Minutes/Hours: "{durationValue} {unit}s"
Concentration: "{duration} ({durationUnit}) (Concentration)"
```

**Fields Used:**
- `buffConfig.buffType` ('statEnhancement', 'temporaryHP', 'statusEffect', 'progressive', 'custom')
- `buffConfig.effects[]` - **REQUIRED**: Array of effect objects (preferred structure)
- `buffConfig.statModifiers[]` - **DEPRECATED**: Legacy array of stat modifier objects (use `effects` instead)
- `buffConfig.durationValue` / `buffConfig.duration` - **REQUIRED**: Duration value
- `buffConfig.durationType` - **REQUIRED**: 'instant', 'rounds', 'turns', 'minutes', 'hours', 'permanent', etc.
- `buffConfig.durationUnit` (string) - **REQUIRED**: Must match durationType (e.g., 'rounds', 'turns', 'minutes')
- `buffConfig.concentrationRequired` (boolean)
- `buffConfig.canBeDispelled` (boolean)
- `buffConfig.isProgressive` (boolean)
- `buffConfig.progressiveStages[]` - Array of stage objects for progressive buffs
- `buffConfig.maxStacks` (number)
- `buffConfig.stackingRule` ('replace', 'stack', 'refresh')
- `buffConfig.customDescription` (string)

**⚠️ CRITICAL - buffConfig.effects Array Structure:**

The `buffConfig.effects[]` array is the **REQUIRED** structure for all buff effects. Each effect object can have:

**For Stat Enhancement Effects:**
```javascript
buffConfig: {
  buffType: 'statEnhancement',
  effects: [{
    id: 'strength_boost',
    name: 'Strength Boost',
    description: 'Increases target strength', // Optional
    statModifier: {
      stat: 'strength', // Required: stat name (no underscores, use 'armor' not 'armor_class')
      magnitude: 2, // Required: enhancement amount
      magnitudeType: 'flat' // Required: 'flat' or 'percentage'
    }
  }],
  durationValue: 3,
  durationType: 'rounds',
  durationUnit: 'rounds', // ⚠️ Required!
  concentrationRequired: false,
  canBeDispelled: true
}
```

**Display Format:**
- Effect Name: "{effect.name}" (e.g., "Strength Boost")
- Description: "{description with complete natural language including amounts and duration}" (e.g., "Gain +2 Strength for 3 rounds")
- Mechanics: **ALWAYS EMPTY** - All information must be in the description
- **⚠️ CRITICAL - Stat Modifier Display Rules**:
  - **NO SEPARATE STAT MODIFIER TEXT**: Stat modifier values (like "+1 ActionPoints", "+2 RageDecay") are NEVER displayed as separate black text
  - **ALL INFORMATION IN DESCRIPTION**: All stat modifier information must be written in natural language within the grey description text
  - **Description Format**: Use natural, complete sentences with exact amounts and durations
    - ✅ **GOOD**: "1 Extra action point from adrenaline surge, but your rage decays by 2 per round for 2 rounds"
    - ✅ **GOOD**: "Gain +2 armor for 3 rounds"
    - ✅ **GOOD**: "Your rage decays by 2 points per round for 2 rounds"
    - ❌ **BAD**: "Extra action points from adrenaline surge, but rage decays faster" (missing amounts and duration)
    - ❌ **BAD**: "Adrenaline causes rage to decay 2 points per round" (missing duration)
  - **Include Duration**: Always specify the duration in the description (e.g., "for 2 rounds", "for 1 minute")
  - **Include Exact Amounts**: Always specify exact numerical values (e.g., "1 Extra action point", "2 points per round", "+2 armor")
  - **UnifiedSpellCard automatically suppresses stat modifier display** - descriptions must contain everything

**⚠️ STAT NAMING CONVENTIONS:**
- Use single words without underscores: `strength`, `armor`, `defense`, `damage_resistance`
- Common stat names: `strength`, `constitution`, `agility` (not dexterity), `intelligence`, `spirit` (not wisdom), `charisma`, `armor`, `saving_throws`, `damage_resistance`, `damage_immunity`, etc.
- Avoid: `armor_class` (use `armor`), `saving_throw_advantage` (use `saving_throws`)
- **Variable references**: Use camelCase without underscores: `drpSpent` (not `drp_spent`), `healthCost` (not `health_cost`)

**For Status Effects:**
```javascript
buffConfig: {
  buffType: 'statusEffect',
  effects: [{
    id: 'haste',
    name: 'Haste',
    description: 'Increases action speed',
    statusType: 'haste', // Optional: status effect type
    level: 'moderate', // Optional: severity level
    // Can include status-specific configs (speedMultiplier, actionBonus, etc.)
  }],
  durationValue: 2,
  durationType: 'rounds',
  durationUnit: 'rounds', // ⚠️ Required!
  concentrationRequired: true,
  canBeDispelled: false
}
```

**Display Format:**
- Effect Name: "{effect.name}" (e.g., "Haste")
- Description: "{description} • {durationValue} {durationType}"
- Mechanics: **EMPTY** - All information is in the description
- **⚠️ CRITICAL**: **mechanicsText MUST be empty** for status effects - description contains all information

**For Temporary HP:**
```javascript
buffConfig: {
  buffType: 'temporaryHP',
  effects: [{
    id: 'temp_hp',
    name: 'Temporary Hit Points',
    description: 'Grants temporary health',
    tempHPFormula: '1d6 + constitution', // Formula for temp HP
    tempHPType: 'standard' // 'standard', 'barrier', 'shield'
  }],
  durationValue: 1,
  durationType: 'hours',
  durationUnit: 'hours', // ⚠️ Required!
  concentrationRequired: false,
  canBeDispelled: false
}
```

**Display Format:**
- Effect Name: "{effect.name}" (e.g., "Temporary Hit Points")
- Description: "{description} • {durationValue} {durationType}"
- Mechanics: "{tempHPFormula} Temporary Hit Points" (e.g., "1d6 + Constitution Temporary Hit Points")

**For Progressive Buffs:**
```javascript
buffConfig: {
  buffType: 'progressive',
  isProgressive: true,
  progressiveStages: [{
    round: 1,
    formula: '+1',
    description: 'Minor enhancement'
  }, {
    round: 2,
    formula: '+2',
    description: 'Moderate enhancement'
  }, {
    round: 3,
    formula: '+3',
    description: 'Major enhancement'
  }],
  durationValue: 3,
  durationType: 'rounds',
  durationUnit: 'rounds', // ⚠️ Required!
  concentrationRequired: false,
  canBeDispelled: true
}
```

**Display Format:**
- Shows progressive enhancement over time
- "Round 1: +1 enhancement → Round 2: +2 enhancement → Round 3: +3 enhancement"

**⚠️ IMPORTANT**:
- Always configure `buffConfig.effects[]` array when 'buff' is in `effectTypes`
- Always include `durationValue` and `durationType` (even if instant)
- Always include `durationUnit` that matches `durationType`
- The component will show "BUFF EFFECT - {duration} Configure stat modifiers or status effects below" if `effects` array is missing or empty
- Use `buffConfig.effects[]` instead of deprecated `statModifiers[]` array for new spells

**⚠️ CRITICAL - Damage Reduction and Protection Buffs:**

When creating buffs that provide damage reduction or protection, you **MUST** include complete details and clearly specify the mechanic type:

1. **Use `effects` array** (preferred format):
```javascript
buffConfig: {
  buffType: 'statEnhancement',
  effects: [{
    id: 'unique_id_for_this_modifier',
    name: 'Display Name',  // e.g., "Heat Shield", "Protective Aura"
    description: 'Reduces incoming damage by 2 (flat reduction)',  // ⚠️ CRITICAL: Description must clearly specify the mechanic type
    statModifier: {
      stat: 'damage_reduction',  // Use 'damage_reduction' for flat damage reduction
      magnitude: 2,  // The amount of damage reduction
      magnitudeType: 'flat'  // 'flat' for fixed amount, 'percentage' for %
    }
  }],
  durationValue: 2,
  durationType: 'rounds',
  durationUnit: 'rounds',  // ⚠️ MUST be included and match durationType
  concentrationRequired: false,
  canBeDispelled: true
}
```

**Description Guidelines for Damage Reduction:**
- ✅ **Good**: "Reduces incoming damage by 2 (flat reduction)"
- ✅ **Good**: "Provides 2 flat damage reduction per hit"
- ✅ **Good**: "Reduces all incoming damage by 2 points"
- ❌ **Bad**: "Provides protection" (too vague)
- ❌ **Bad**: "Creates a shield" (implies absorption/barrier)
- ❌ **Bad**: "Absorbs damage" (unless it's actually absorption that breaks)

2. **Common stat values for protection:**
   - `'damage_reduction'` - **Flat damage reduction** (e.g., "Reduces incoming damage by 2 (flat reduction)")
     - This is a **flat reduction** that applies to each hit
     - **NOT** an absorption pool that breaks
     - **NOT** a barrier that shatters
     - Description should explicitly state "flat reduction" to avoid confusion
   - `'armor'` - Armor class bonus (e.g., "+2 Armor Class")
   - `'resistance'` - Damage resistance percentage (use `magnitudeType: 'percentage'`)
     - Description: "Reduces incoming damage by 25% (resistance)"
   - `'temporary_hp'` - Temporary hit points (use formula in magnitude)
     - Description: "Grants 1d6 + Constitution temporary hit points"

3. **Always include:**
   - ✅ `effects[].id` - Unique identifier
   - ✅ `effects[].name` - Display name
   - ✅ `effects[].statModifier.stat` - The stat being modified
   - ✅ `effects[].statModifier.magnitude` - The amount
   - ✅ `effects[].statModifier.magnitudeType` - 'flat' or 'percentage'
   - ✅ `effects[].description` - Clear description of the effect
   - ✅ `durationUnit` - Must match `durationType` (e.g., if `durationType: 'rounds'`, then `durationUnit: 'rounds'`)

4. **Example - Complete Damage Reduction Buff (Pyrofiend Heat Shield):**
```javascript
{
  id: 'pyro_heat_shield',
  name: 'Heat Shield',
  description: 'Create a weak barrier of heat around yourself, providing minor protection.',
  effectTypes: ['buff'],
  resourceCost: {
    resourceTypes: ['mana'],
    resourceValues: { mana: 6 },
    actionPoints: 1,  // ⚠️ Weaker utility spell = 1 AP
    components: ['V', 'S']
  },
  buffConfig: {
    buffType: 'statEnhancement',
    effects: [{
      id: 'heat_shield_damage_reduction',
      name: 'Heat Shield',
      // ⚠️ CRITICAL: Description must specify this is flat reduction, not absorption
      description: 'Reduces incoming damage by 2 (flat reduction per hit)',
      statModifier: {
        stat: 'damage_reduction',  // Use 'damage_reduction' for flat damage reduction
        magnitude: 2,  // The amount of damage reduction
        magnitudeType: 'flat'  // 'flat' for fixed amount, 'percentage' for %
      }
    }],
    durationValue: 2,
    durationType: 'rounds',
    durationUnit: 'rounds',  // ⚠️ Required!
    concentrationRequired: false,
    canBeDispelled: true
  }
}
```

**Example - Pyrofiend Spell with Inferno Ascend:**
```javascript
{
  id: 'pyro_hellfire_bolt',
  name: 'Hellfire Bolt',
  description: 'A bolt of demonic fire that burns enemies and increases your Inferno Level.',
  effectTypes: ['damage'],
  resourceCost: {
    resourceTypes: ['mana', 'inferno_ascend'],  // ⚠️ Include in resourceTypes
    resourceValues: {
      mana: 8,
      inferno_ascend: 2  // ⚠️ CRITICAL: Must be in resourceValues
    },
    actionPoints: 2,  // ⚠️ Most Pyrofiend spells = 2 AP
    components: ['V', 'S']
  },
  damageConfig: {
    formula: '3d10',
    elementType: 'fire',
    damageType: 'direct'
  }
}
```

**⚠️ IMPORTANT**:
- Always configure `buffConfig.effects[]` array when 'buff' is in `effectTypes`
- Always include `durationValue` and `durationType` (even if instant)
- Always include `durationUnit` that matches `durationType`
- The component will show "BUFF EFFECT - {duration} Configure stat modifiers or status effects below" if `effects` array is missing or empty
- **Never leave damage reduction or protection effects without complete details** - always include `effects` with full information including `description` and ensure `durationUnit` matches `durationType`.
- **For damage reduction**: Always specify in the description that it's a "flat reduction" (not absorption/barrier) to avoid confusion.
- **For Pyrofiend spells**: Always include `actionPoints` (2 for most spells, 1 for weaker utility spells) and include `inferno_ascend`/`inferno_descend` in `resourceTypes` and `resourceValues` when applicable.
- **For Deathcaller spells**: Always use formulas for health costs (`useFormulas.health = true`), include `bloodTokens` in `resourceTypes` if spell can spend tokens for bonus damage, and include `ascension_required` as string values (e.g., "crimson_pact").
- **For Dreadnaught spells**: Always include `drp` in `resourceTypes` and `resourceValues` for spells that consume Dark Resilience Points. DRP is generated at 1 point per 5 damage taken (maximum 50).
- **For summoning effects**: Use `summonConfig` with a `creatures` array containing complete creature objects (not the legacy `summoningConfig` format).
- **For advanced targeting**: Include `targetSelectionMethod`, `requiresLineOfSight`, `propagationMethod`, and `propagationBehavior` for sophisticated spell targeting behavior.
- **For effect-specific targeting**: Use `targetingMode: 'effect'` and `effectTargeting` object when different effects in the same spell need different targeting (e.g., damage targets enemies while healing targets self).
- Use `buffConfig.effects[]` instead of deprecated `statModifiers[]` array for new spells

#### Debuff Effects

**Display Format Logic:**
- **If `debuffConfig` exists**: Shows detailed debuff effects based on configuration
- **If `debuffConfig` missing but 'debuff' in `effectTypes`**: Shows generic "Debuff Effect - Effect details not configured"

**Stat Reductions:**
```
"-{magnitude} {statName}" or "-{magnitude}% {statName}"
Example: "-2 Strength" or "-10% Intelligence"
```

**Status Effects:**
```
"{effectName}: {effectDescription}"
Example: "Slow: -10 feet movement speed"
```

**Progressive Debuffs:**
```
"Round 1: {formula1} → Round 2: {formula2}"
```

**Saving Throw Display:**
```
"DC {difficultyClass} {savingThrow} ({saveOutcome})"
Example: "DC 15 Constitution (negates)" or "DC 14 Strength (halves)"
```

**Fields Used:**
- `debuffConfig.debuffType` ('statReduction', 'statusEffect', 'progressive', 'custom')
- `debuffConfig.effects[]` - **REQUIRED**: Array of effect objects (preferred structure)
- `debuffConfig.statPenalties[]` - **DEPRECATED**: Legacy array of stat penalty objects (use `effects` instead)
- `debuffConfig.statModifiers[]` - **DEPRECATED**: Legacy array of stat modifier objects (use `effects` instead)
- `debuffConfig.statusEffects[]` - **DEPRECATED**: Legacy array of status effect objects (use `effects` instead)
- `debuffConfig.durationValue` / `debuffConfig.duration` - **REQUIRED**: Duration value
- `debuffConfig.durationType` - **REQUIRED**: 'instant', 'rounds', 'turns', 'minutes', 'hours', 'permanent', etc.
- `debuffConfig.difficultyClass` (number) - Alternative to `saveDC`
- `debuffConfig.saveDC` (number) - Alternative to `difficultyClass`
- `debuffConfig.savingThrow` (stat name) - Alternative to `saveType` or `savingThrowType`
- `debuffConfig.saveType` (stat name) - Alternative to `savingThrow` or `savingThrowType`
- `debuffConfig.savingThrowType` (stat name) - Alternative to `saveType` or `savingThrow`
- `debuffConfig.saveOutcome` ('negates', 'halves_effects', 'ends_early', etc.)
- `debuffConfig.canBeDispelled` (boolean)
- `debuffConfig.concentrationRequired` (boolean)
- `debuffConfig.isProgressive` (boolean)
- `debuffConfig.progressiveStages[]` - Array of stage objects
- `debuffConfig.restType` ('short', 'long')
- `debuffConfig.stackingRule`
- `debuffConfig.maxStacks`

**⚠️ CRITICAL - debuffConfig.effects Array Structure:**

The `debuffConfig.effects[]` array is the **REQUIRED** structure for all debuff effects. Each effect object can have:

**For Stat Reduction Effects:**
```javascript
debuffConfig: {
  debuffType: 'statReduction',
  effects: [{
    id: 'weakened',
    name: 'Weakened',
    description: 'Reduces target strength', // Optional
    statModifier: {
      stat: 'strength', // Required: stat name
      magnitude: 2, // Required: reduction amount
      magnitudeType: 'flat' // Required: 'flat' or 'percentage'
    }
  }],
  durationValue: 4,
  durationType: 'rounds',
  saveDC: 14, // or difficultyClass
  saveType: 'constitution' // or savingThrowType
}
```

**Display Format:**
- Effect Name: "{effect.name}" (e.g., "Weakened")
- Description: "{description} • DC {saveDC} {saveType} save • {durationValue} {durationType}"
- Mechanics: "-{magnitude}{%} {statName}" (e.g., "-2 Strength")

**For Status Effects:**
```javascript
debuffConfig: {
  debuffType: 'statusEffect',
  effects: [{
    id: 'slow',
    name: 'Slow',
    description: 'Reduces movement speed',
    statusType: 'slow', // Optional: status effect type
    level: 'moderate', // Optional: severity level
    // Can include status-specific configs (charmType, fearStrength, etc.)
  }],
  durationValue: 3,
  durationType: 'rounds',
  durationUnit: 'rounds', // ⚠️ REQUIRED: Must match durationType
  saveDC: 15,
  saveType: 'constitution',
  saveOutcome: 'negates' // ⚠️ RECOMMENDED: Specify save outcome ('negates', 'halves', etc.)
}
```

**Display Format:**
- Effect Name: "{effect.name}" (e.g., "Slow")
- Description: "{description} • DC {saveDC} {saveType} save ({saveOutcome}) • for {durationValue} {durationType}"
- Mechanics: **EMPTY** - All information is in the description
- **⚠️ CRITICAL**: 
  - Save information is integrated into the description - NO separate "Saving Throw" effect is created
  - **mechanicsText MUST be empty** for status effects - description contains all information
  - **DO NOT** add redundant mechanics like "Movement speed reduced by 50%" when description already has "Movement speed reduced by 10 feet"

**⚠️ IMPORTANT**: 
- Always configure `debuffConfig.effects[]` array when 'debuff' is in `effectTypes`
- Always include `durationValue` and `durationType` (even if instant)
- The component will show "DEBUFF EFFECT - {duration} Configure stat penalties or status effects below" if `effects` array is missing or empty
- Use `debuffConfig.effects[]` instead of deprecated `statPenalties[]`, `statModifiers[]`, or `statusEffects[]` arrays

#### Status Effect Detailed Configurations

Status effects (both buffs and debuffs) can have detailed configurations:

**Status Effect Levels:**
- `level` (enum: 'minor', 'moderate', 'major', 'severe', 'extreme') - Severity/strength of effect
- Display: Shows level in description (e.g., "Charmed (moderate)")

**Status Effect Save Configurations:**
Each status effect can have its own save configuration:
- `saveType` (enum: 'strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma', 'none')
  - **⚠️ IMPORTANT**: Use `agility` (not `dexterity` or `dex`) and `spirit` (not `wisdom` or `wis`)
- `saveDC` (number) - Difficulty class for this specific effect
- `saveOutcome` (enum):
  - 'negates' - Negates the effect completely
  - 'halves_duration' - Halves the duration
  - 'ends_early' - Ends at end of turn
  - 'reduces_level' - Reduces effect level/severity
  - 'partial_immunity' - Partial immunity
- `saveTrigger` (enum):
  - 'none' - No additional saves beyond initial
  - 'harmful' - When given harmful command (for charmed)
  - 'turn' - Each turn
  - 'damage' - When taking damage
- `saveFrequency` (enum):
  - 'initial' - Initial save only
  - 'end_of_turn' - End of each turn
  - 'when_damaged' - When taking damage
  - 'out_of_sight' - When fear source out of sight (fear-specific)
  - 'ally_help' - When ally helps
  - 'special_trigger' - Special trigger condition

**Specific Status Effect Parameters:**

**Charmed:**
- `charmType` (enum: 'friendly', 'dominated', 'infatuated')
- `canAttackCharmer` (boolean)
- `canSelfHarm` (boolean)
- `retainsMemory` (boolean)
- `commandComplexity` (enum: 'simple', 'moderate', 'complex', 'any')
- `maxCommands` (number)

**Frightened:**
- `fearStrength` (string)
- `fearRadius` (number)

**Burning/Frozen:**
- `damagePerTick` (string) - Dice formula
- `tickFrequency` (string)

**Silenced:**
- `silenceRadius` (number) - 0 for targeted, >0 for area
- `affectsVerbalSpells` (boolean)
- `affectsSoundEffects` (boolean)

**Slowed:**
- `speedReduction` (number) - Percentage
- `affectsActionPoints` (boolean)

#### Lifelink Configuration

Lifelink creates sympathetic bonds that transfer resources between entities.

**Fields Configured:**
- `lifelinkConfig.enabled` (boolean)
- `lifelinkConfig.direction` (enum):
  - 'caster_to_target' - Caster to Target
  - 'target_to_caster' - Target to Caster
  - 'bidirectional' - Both directions
- `lifelinkConfig.sourceResource` (string) - Resource type to transfer from (e.g., 'hp', 'mana')
- `lifelinkConfig.targetResource` (string) - Resource type to transfer to
- `lifelinkConfig.calculationType` (enum):
  - 'percentage' - Percentage of source resource
  - 'fixed' - Fixed amount
  - 'dice' - Dice formula
  - 'per_amount' - Per amount of source
- `lifelinkConfig.conversionRate` (number) - Percentage (for percentage type)
- `lifelinkConfig.fixedAmount` (number) - Fixed amount (for fixed type)
- `lifelinkConfig.diceCount` (number) - Dice count (for dice type)
- `lifelinkConfig.diceType` (string) - Dice type (e.g., 'd6')
- `lifelinkConfig.perAmount` (number) - Per amount value (for per_amount type)

**Lifelink Types:**
- `hp_to_hp` - Health to Health (share damage/healing)
- `mana_to_mana` - Mana to Mana (share mana)
- `hp_to_mana` - Health to Mana (convert HP to mana)
- `mana_to_hp` - Mana to Health (convert mana to HP)
- `damage_to_healing` - Damage Dealt to Healing (vampiric)
- `healing_to_damage` - Healing Done to Bonus Damage

**SpellCard Display:**
- **Location**: Card body, buff effects section
- **Format**: 
  - "Lifelink: [Source Resource] → [Target Resource]"
  - Shows direction and conversion details
  - Example: "Lifelink: Health → Health (bidirectional, 25% conversion)"

#### Utility Effects

**Display Format:**
```
"{utilityType} - {subtype}"
Example: "Movement - Teleport" or "Information - Detect Magic"

With description:
  "{utilityType} - {subtype}: {description}"
```

**Fields Used:**
- `utilityConfig.utilityType` ('movement', 'information', 'transformation', 'creation', etc.)
- `utilityConfig.subtype` (specific utility subtype)
- `utilityConfig.description` (string)
- `utilityConfig.selectedEffects[]` - Array of selected utility effects
- `utilityConfig.power` ('minor', 'moderate', 'major')
- `utilityConfig.duration`
- `utilityConfig.durationUnit`

#### Control Effects

**Display Format Logic:**
- **If `controlConfig` exists**: Shows detailed control effects based on configuration
- **If `controlConfig` missing but 'control' in `effectTypes`**: Shows generic "Control Effect - Effect details not configured"

**Display Format:**
```
Effect Name: "{effect.name}" (e.g., "Stun")
Description: "{description} • {duration} {durationUnit} • DC {saveDC} {saveType} save"
Mechanics: Effect-specific mechanical details (e.g., movement distance, restraint type) - **DO NOT duplicate duration/save info**
```

**Fields Used:**
- `controlConfig.controlType` ('forcedMovement', 'restraint', 'incapacitation', 'mind_control', 'knockdown', 'restriction')
- `controlConfig.strength` ('weak', 'moderate', 'strong')
- `controlConfig.duration` (number) - Duration in rounds (0 for instant)
- `controlConfig.durationUnit` (string) - **REQUIRED**: 'instant', 'rounds', 'turns', etc. (must match duration)
- `controlConfig.saveDC` (number) - Difficulty class for saving throw (alternative to `difficultyClass`)
- `controlConfig.difficultyClass` (number) - Difficulty class for saving throw (alternative to `saveDC`)
- `controlConfig.saveType` (string) - Stat used for saving throw ('strength', 'agility', 'constitution', etc.) (alternative to `savingThrowType`)
- `controlConfig.savingThrowType` (string) - Stat used for saving throw (alternative to `saveType`)
- `controlConfig.savingThrow` (boolean) - Whether saving throw is required
- `controlConfig.effects[]` - **REQUIRED**: Array of effect objects with proper configuration

**⚠️ CRITICAL - Control Effects Configuration:**

For ALL control effects, you **MUST** use the `effects` array format. The `effects` array is **REQUIRED** for proper display.

**Forced Movement Configuration:**

For forced movement effects (push, pull, slide, teleport), use the `effects` array format:

```javascript
controlConfig: {
  controlType: 'forcedMovement',
  strength: 'weak', // or 'moderate', 'strong'
  duration: 0, // 0 for instant movement
  durationUnit: 'instant',
  saveDC: 12, // Difficulty class for saving throw
  saveType: 'strength', // Stat used for saving throw
  savingThrow: true, // Whether saving throw is required
  effects: [{
    id: 'pull', // 'pull', 'push', 'slide', or 'teleport'
    name: 'Pull', // Display name
    description: 'Pulls the target toward the caster', // Clear description
    config: {
      movementType: 'pull', // Must match id: 'pull', 'push', 'slide', or 'teleport'
      distance: 15 // Distance in feet
    }
  }]
}
```

**Common Movement Types:**
- `'pull'` - Pulls target toward caster
- `'push'` - Pushes target away from caster
- `'slide'` - Slides target in any direction
- `'teleport'` - Instantaneously relocates target

**Restraint Configuration:**

For restraint effects (bind, slow, snare, web), use the `effects` array format:

```javascript
controlConfig: {
  controlType: 'restraint',
  strength: 'moderate',
  duration: 2,
  durationUnit: 'rounds',
  saveDC: 14,
  saveType: 'strength',
  savingThrow: true,
  effects: [{
    id: 'bind', // 'bind', 'slow', 'snare', or 'web'
    name: 'Binding',
    description: 'Physically restrains the target, preventing movement',
    config: {
      restraintType: 'physical'
    }
  }]
}
```

**Common Restraint Types:**
- `'bind'` - Physically restrains target
- `'slow'` - Reduces movement speed
- `'snare'` - Roots target in place
- `'web'` - Entangles multiple targets

**Incapacitation Configuration:**

For incapacitation effects (sleep, stun, paralyze, daze), use the `effects` array format:

```javascript
controlConfig: {
  controlType: 'incapacitation',
  strength: 'moderate',
  duration: 1,
  durationUnit: 'rounds',
  saveDC: 14,
  saveType: 'constitution',
  savingThrow: true,
  effects: [{
    id: 'stun', // 'sleep', 'stun', 'paralyze', or 'daze'
    name: 'Stun',
    description: 'Leaves the target stunned, unable to act or react',
    config: {
      durationType: 'temporary',
      recoveryMethod: 'automatic'
    }
  }]
}
```

**Common Incapacitation Types:**
- `'sleep'` - Puts target to sleep
- `'stun'` - Stuns target (cannot act or react)
- `'paralyze'` - Paralyzes target
- `'daze'` - Dazes target

**Mind Control Configuration:**

For mind control effects (command, confuse, dominate, fear), use the `effects` array format:

```javascript
controlConfig: {
  controlType: 'mind_control',
  strength: 'moderate',
  duration: 3,
  durationUnit: 'rounds',
  saveDC: 15,
  saveType: 'charisma',
  savingThrow: true,
  effects: [{
    id: 'dominate', // 'command', 'confuse', 'dominate', or 'fear'
    name: 'Dominate',
    description: 'Target obeys your commands',
    config: {
      controlLevel: 'suggestion',
      mentalApproach: 'subtle'
    }
  }]
}
```

**⚠️ IMPORTANT:**
- **ALWAYS use the `effects` array format** for ALL control effects - it is REQUIRED
- Each effect must have `id`, `name`, `description`, and `config` with proper settings
- For forced movement, `config.movementType` must match the effect `id` ('pull', 'push', etc.)
- Always include `distance` in the config for forced movement effects
- **Never use `specialEffects` array** - always use `effects` array instead
- **Never leave control effects without the `effects` array** - spells will show "Effect details not configured" if missing
- **Match controlType to effect type**: 'stun' requires `controlType: 'incapacitation'`, not 'restraint'

#### Summoning Effects

**Display Format:**
```
Effect Name: "Summon {creatureName} (×{quantity})"
Description: "{size} {type} - {duration} {durationUnit} - {controlType} ({controlRange})"
Mechanics: "HP: {hp} • Armor: {armor} • {description}" - Creature stats and abilities
```

**Fields Used:**
- `summonConfig.creatures[]` - Array of creature objects with:
  - `id` (string) - Unique creature identifier
  - `name` (string) - Display name of the creature
  - `description` (string) - Creature description
  - `size` (string) - Creature size ('Small', 'Medium', 'Large', etc.)
  - `type` (string) - Creature type ('undead', 'elemental', 'beast', etc.)
  - `tokenIcon` (string) - WoW icon for the creature
  - `stats` (object) - Creature stats (maxHp, armor, maxMana, etc.)
  - `config` (object) - Individual creature configuration:
    - `quantity` (number) - How many of this creature to summon
    - `duration` (number) - Duration value
    - `durationUnit` (string) - Duration unit ('rounds', 'minutes', 'hours')
    - `hasDuration` (boolean) - Whether the summon has a duration limit
    - `concentration` (boolean) - Whether maintaining the summon requires concentration
    - `controlType` (string) - Control method ('verbal', 'mental', 'empathic', 'autonomous')
    - `controlRange` (number) - Maximum control distance in feet (0 = unlimited)
    - `attachedEffects` (object) - **OPTIONAL**: Effects that emanate from the summoned creature

**Attached Effects Structure:**
```javascript
attachedEffects: {
  auraDamage: {  // Damage effect in area around creature
    effectType: 'damage',
    formula: '2d6',
    elementType: 'force',
    damageType: 'direct',
    areaShape: 'circle',
    areaRadius: 15,
    targetType: 'enemy',  // 'enemy', 'ally', or 'all'
    tickRate: 1,  // How often effect triggers (1 = every round)
    tickUnit: 'rounds'
  },
  auraHealing: {  // Healing effect in area around creature
    effectType: 'healing',
    formula: '1d8',
    healingType: 'direct',
    areaShape: 'circle',
    areaRadius: 15,
    targetType: 'ally',
    tickRate: 1,
    tickUnit: 'rounds'
  },
  auraBuff: {  // Buff effect in area around creature
    effectType: 'buff',
    buffType: 'statusEffect',
    effects: [{
      name: 'Aura Buff',
      description: 'Enhanced by aura',
      statusType: 'empowerment',
      statModifier: { stat: 'damage', magnitude: 2, magnitudeType: 'flat' }
    }],
    durationValue: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    targetType: 'ally',
    areaShape: 'circle',
    areaRadius: 15
  }
}
```

**⚠️ CRITICAL - Summoning Format:**
- **Use `summonConfig`, not `summoningConfig`** - The spell wizard uses `summonConfig` with a `creatures` array
- **Each creature needs a complete creature object** - Include `id`, `name`, `description`, `size`, `type`, `tokenIcon`, `stats`, and `config`
- **Creature stats should be dynamic** - Use formulas like `'health_sacrificed'` for HP that scales with spell mechanics
- **Individual configuration per creature** - Each creature in the array can have different settings
- **Legacy format supported** - `summoningConfig` with `creatureType`, `creatureStrength`, etc. still works for backward compatibility

**Example - Complete Summoning Spell:**
```javascript
summonConfig: {
  creatures: [{
    id: 'spectral_warrior',
    name: 'Spectral Warrior',
    description: 'A ghostly warrior bound by necrotic energy',
    size: 'Medium',
    type: 'undead',
    tokenIcon: 'ability_ghoulfrenzy',
    stats: {
      maxHp: 'health_sacrificed',  // Dynamic HP based on spell
      armor: 12,
      maxMana: 0
    },
    config: {
      quantity: 1,
      duration: 1,
      durationUnit: 'minutes',
      hasDuration: true,
      concentration: false,
      controlType: 'mental',
      controlRange: 60
    }
  }],
  duration: 1,        // Global duration fallback
  durationUnit: 'minutes',
  hasDuration: true,
  concentration: false,
  controlRange: 60,   // Global control range fallback
  controlType: 'mental'
}
```

**Display Result:**
```
Summon Spectral Warrior
Medium undead - 1 minutes - Mental Link (60ft)
HP: health_sacrificed • Armor: 12 • A ghostly warrior bound by necrotic energy
```

#### Transformation Effects

**Two Modes of Transformation:**

1. **Creature Library Mode**: Transform into a creature from the creature library (uses `selectedCreature` or `formId`)
2. **Custom Transformation Mode**: Custom self-enhancement or unique transformations (uses `transformationType` + `newForm`)

**Display Format Logic:**
- **If `selectedCreature` or `formId` exists**: Shows creature transformation with creature stats and granted abilities
- **If `isCustom` is true OR `transformationType` + `newForm`/`formName`/`customName` exists**: Shows custom transformation with enhanced details
- **If only `transformationType` exists**: Shows transformation type header
- **If `transformationConfig` missing but 'transformation' in `effectTypes`**: Shows generic "Transformation Effect - Effect details not configured"

---

**Enhanced Creature Library Transformation Display:**
```
Effect Name: "Transform into {creature.name}"
Description: "{creature.size} {creature.type} • {duration} {durationUnit} • {targetType}"
Mechanics: "{creature.description} • HP: {creature.stats.maxHp} • Armor: {creature.stats.armor} • AP: {creature.stats.maxAp}"
```

**Enhanced Custom Transformation Display:**
```
Effect Name: "{newForm || formName || customName} ({power})"
Description: "{formatted transformationType} • {duration} {durationUnit} • {targetType}"
Mechanics: "{description || enhanced form description}"
```

**Unwilling Target Saving Throw (when targetType = 'unwilling'):**
```
Effect Name: "Transformation Resistance"
Description: "{saveType} save DC {difficultyClass}"
Mechanics: "Target can resist transformation with a successful saving throw"
```

**Granted Abilities (enhanced for both modes):**
```
Effect Name: "Granted: {ability.name}"
Description: "{ability.category || 'Special Ability'}"
Mechanics: "{ability.description}"
```

**Transformation Mode Indicators:**
- **Creature Library**: Shows creature stats, type, and size
- **Custom Mode**: Shows transformation type, power level, and custom description
- **Equipment Handling**: Indicates if equipment is maintained or lost during transformation

---

**Fields Used for Creature Library Mode:**
- `transformationConfig.selectedCreature` (object) - Full creature data from library
- `transformationConfig.formId` (string) - Creature ID reference
- `transformationConfig.targetForm` (string) - Form name fallback
- `transformationConfig.targetType` ('self', 'willing', 'unwilling')
- `transformationConfig.duration` (number)
- `transformationConfig.durationUnit` ('rounds', 'minutes', 'hours')
- `transformationConfig.concentration` (boolean) - Requires concentration to maintain
- `transformationConfig.saveType` (string) - Save type for unwilling targets ('con', 'str', 'agi', 'int', 'spirit', 'cha')
- `transformationConfig.difficultyClass` (number) - DC for unwilling target saves
- `transformationConfig.maintainEquipment` (boolean) - Whether equipment is maintained during transformation
- `transformationConfig.retainsAbilities` (boolean) - Whether original abilities are retained
- `transformationConfig.grantedAbilities[]` - Array of {id, name, description, category}

**Fields Used for Custom Transformation Mode:**
- `transformationConfig.transformationType` ('physical', 'elemental', 'mental', 'spectral', 'ascended', 'demonic', 'divine', 'primal', 'shadow', 'arcane')
- `transformationConfig.newForm` or `formName` or `customName` (string) - The transformation name
- `transformationConfig.power` ('minor', 'moderate', 'major') - Power level of the transformation
- `transformationConfig.description` (string) - What the transformation does
- `transformationConfig.targetType` ('self', 'willing', 'unwilling')
- `transformationConfig.duration` (number)
- `transformationConfig.durationUnit` ('rounds', 'minutes', 'hours')
- `transformationConfig.concentration` (boolean) - Requires concentration to maintain
- `transformationConfig.isCustom` (boolean) - True for custom mode
- `transformationConfig.saveType` (string) - Save type for unwilling targets
- `transformationConfig.difficultyClass` (number) - DC for unwilling target saves
- `transformationConfig.grantedAbilities[]` - Array of {id, name, description, category}
- `transformationConfig.specialEffects[]` - Array of special effect strings
- `transformationConfig.maintainEquipment` (boolean) - Equipment handling during transformation

**⚠️ IMPORTANT**: Always configure `transformationConfig` when 'transformation' is in `effectTypes`. The component will show "Transformation Effect - Effect details not configured" if only the effect type is present without proper configuration.

**Example Custom Transformation (Berserker Style):**
```javascript
transformationConfig: {
  isCustom: true,
  transformationType: 'physical',
  targetType: 'self',
  duration: 3,
  durationUnit: 'rounds',
  concentration: false,
  power: 'major',
  newForm: 'Primal Apex',
  description: 'Your body swells with primal fury, muscles bulging beyond natural limits. Strength and resilience increase dramatically.',
  maintainEquipment: true,
  grantedAbilities: [{
    id: 'primal_power',
    name: 'Primal Power',
    description: 'Gain +8 damage bonus to all attacks and immunity to fear and stun effects.',
    category: 'combat'
  }, {
    id: 'feral_instincts',
    name: 'Feral Instincts',
    description: 'Enhanced senses and predatory awareness.',
    category: 'utility'
  }],
  specialEffects: ['rage_buildup', 'combat_focus']
}
```

**Example Creature Library Transformation (Druid Wild Shape):**
```javascript
transformationConfig: {
  selectedCreature: {
    id: 'bear_dire',
    name: 'Dire Bear',
    size: 'Large',
    type: 'beast',
    description: 'A massive, ferocious bear with incredible strength.',
    stats: { maxHp: 85, armor: 16, maxAp: 30 },
    tokenIcon: 'ability_druid_kingofthejungle'
  },
  formId: 'bear_dire',
  targetType: 'self',
  duration: 2,
  durationUnit: 'hours',
  concentration: false,
  maintainEquipment: false,
  retainsAbilities: false,
  grantedAbilities: [{
    id: 'natural_weapons',
    name: 'Natural Weapons',
    description: 'Powerful claws and bite attacks.',
    category: 'combat'
  }, {
    id: 'enhanced_senses',
    name: 'Enhanced Senses',
    description: 'Keen smell and hearing.',
    category: 'utility'
  }]
}
```

#### Purification Effects

**Display Format:**
```
Effect Name: "{purificationType}" (e.g., "Cleanse All")
Description: "{purificationType} - {targetType} • DC {saveDC} {saveType} save" (if save exists)
Mechanics: "Removes: {effectsList}" or "Removes all negative effects" - **DO NOT duplicate purification type**
```

**Fields Used:**
- `purificationConfig.purificationType` ('dispel', 'cleanse', 'remove_curse', 'banish')
- `purificationConfig.targetType` ('self', 'single', 'area')
- `purificationConfig.power` ('minor', 'moderate', 'major')
- `purificationConfig.duration` ('instant' or number)
- `purificationConfig.specialEffects[]`

#### Restoration Effects

**Display Format Logic:**
- **If `restorationConfig` exists**: Shows detailed restoration effects based on configuration
- **If `restorationConfig` missing but 'restoration' in `effectTypes`**: Shows generic "Restoration Effect - Effect details not configured"

**Instant Restoration:**
```
Effect Name: "{resourceDisplayName} Restoration"
Description: "" (empty - all info in mechanics)
Mechanics: "{cleanedFormula} {resourceName} Restored"
Example: "Mana Restoration" with mechanics "2d6 + Spirit Mana Restored"
```

**Over Time Restoration:**
```
Effect Name: "{resourceDisplayName} Over Time"
Description: "Every {frequency} for {duration} {frequency}s - {applicationText}"
Mechanics: "{cleanedFormula} {resourceName} per {frequency}"
```

**Resurrection Effects:**
```
Effect Name: "Resurrection"
Description: "Brings the dead back to life"
Mechanics: "Restores {restoredHealth} health • {restoredMana} mana • Removes: {removesConditions} • Casting time: {castingTime} {timeUnit} • Must be cast within {timeLimit} {limitUnit} of death • Penalty: {penalty.type} level {penalty.level}" (if applicable)
```

**Fields Used:**
- `restorationConfig.resourceType` ('mana', 'health', 'stamina', etc.)
- `restorationConfig.resolution` ('DICE', 'CARDS', 'COINS')
- `restorationConfig.formula`
- `restorationConfig.isOverTime` (boolean)
- `restorationConfig.overTimeFormula`
- `restorationConfig.overTimeDuration`
- `restorationConfig.tickFrequency`
- `restorationConfig.application` ('start', 'end', 'both')
- `restorationConfig.scalingType` ('flat', 'percentage')
- `restorationConfig.restorationType` ('resurrection', etc.)
- `restorationConfig.restoredHealth` / `restorationConfig.restoredMana`
- `restorationConfig.removesConditions[]`
- `restorationConfig.castingTime` / `restorationConfig.castingTimeUnit`
- `restorationConfig.timeLimit` / `restorationConfig.timeLimitUnit`
- `restorationConfig.penaltyOnRevive`

**⚠️ IMPORTANT**: Always configure `restorationConfig` when 'restoration' is in `effectTypes`. The component will show "Restoration Effect - Effect details not configured" if only the effect type is present without proper configuration.

---

## Step 4: Targeting & Propagation

### Fields Configured:
- **targetingConfig** (object)
- **propagation** (object)

### SpellCard Display Mapping:

#### Range (formatRange function)

**Format Logic:**
```
Self-targeting:
  "Self"

Range Types:
  touch → "Touch"
  ranged → "{rangeDistance} ft"
  sight → "Sight"
  unlimited → "Unlimited"
  self_centered → "Self"
  cone/line → "{rangeDistance} ft" or "{aoeSize} ft"

Area Effects:
  "{rangeDistance} ft ({aoeShape} {aoeSize}ft)"
  Example: "30 ft (Circle 10ft radius)"

Multi-target:
  "{rangeDistance} ft ({maxTargets} targets)"
  "{rangeDistance} ft ({maxTargets} {selectionMethod})"
  Example: "30 ft (3 Nearest)" or "30 ft (3 Random)"

Chain:
  "{rangeDistance} ft (Chain)"
```

**Fields Used:**
- `targetingConfig.targetingType` ('single', 'multi', 'area', 'ground', 'cone', 'line', 'chain', 'self')
- `targetingConfig.rangeType` ('touch', 'ranged', 'sight', 'unlimited', 'self_centered')
- `targetingConfig.rangeDistance` (number)
- `targetingConfig.aoeShape` ('circle', 'square', 'rectangle', 'line', 'cone', 'cylinder', 'sphere', 'wall')
- `targetingConfig.aoeParameters` (object with radius, size, width, height, length)
- `targetingConfig.maxTargets` (number)
- `targetingConfig.targetSelectionMethod` / `selectionMethod` ('manual', 'random', 'closest', 'furthest', 'lowest_health', 'highest_health')

#### AOE Shape Format (formatAoeShape function)
```
circle → "{radius}ft radius"
square → "{size}ft square"
rectangle → "{width}×{height}ft"
line → "{length}ft line"
cone → "{length}ft cone"
cylinder → "{radius}ft radius, {height}ft high"
sphere → "{radius}ft sphere"
wall → "{length}ft wall"
```

#### Targeting Type Display (formatTargetingType function)
```
single → "Single Target"
multi → "{maxTargets} Targets"
area/ground/cone/line → "Area Effect"
chain → "Chain Effect"
self → (not shown, already in range)

With selection method:
  "Single Target (Nearest)"
  "3 Targets (Random)"

With restrictions:
  "Single Target - Enemies"
  "3 Targets - Allies & Self"
```

**Fields Used:**
- `targetingConfig.targetRestrictions[]` - Array of ('enemy', 'ally', 'self', 'object', 'creature', 'undead', 'construct', 'elemental', 'demon', 'beast', 'friendly_player', 'hostile_player', etc.)
- `targetingConfig.targetSelectionMethod` - ('manual', 'random', 'nearest', 'farthest', 'lowest_health', 'highest_health')
- `targetingConfig.requiresLineOfSight` - (boolean) Whether spell requires line of sight to target
- `targetingConfig.propagationMethod` - ('none', 'chain', 'bounce', 'seeking', 'explosion', 'spreading', 'forking')
- `targetingConfig.propagationBehavior` - Behavior specific to propagation method (e.g., 'nearest', 'random', 'opportunistic', 'standard', 'contagion')

#### Propagation (formatPropagation function)

**Format:**
```
Chain: "Chain Effect x{count} {range}ft -{decay}%"
Bounce: "Bounce Effect x{count} {range}ft"
Seeking: "Seeking Effect {range}ft"
Explosion: "Explosion on Impact {secondaryRadius}ft"
Spreading: "Spreading Effect {spreadRate}ft/s"
Forking: "Forking Effect x{forkCount}"

With behavior:
  "Chain Effect x3 20ft (Nearest)"
  "Bounce Effect x5 15ft (Ricocheting)"
```

**Fields Used:**
- `propagation.method` ('none', 'chain', 'bounce', 'seeking', 'explosion', 'spreading', 'forking')
- `propagation.behavior` ('nearest', 'farthest', 'random', 'lowest_health', 'highest_health', 'ricocheting', 'accelerating', 'decelerating', 'smart', 'persistent', 'phase_through', 'delayed', 'instant', 'chain_reaction', 'radial', 'directional', 'viral', 'equal_power', 'diminishing', 'focused')
- `propagation.parameters.count` (number)
- `propagation.parameters.range` (number)
- `propagation.parameters.decay` (number, percentage)
- `propagation.parameters.secondaryRadius` (number)
- `propagation.parameters.spreadRate` (number)
- `propagation.parameters.forkCount` (number)

**Propagation Bullets (in formatTypeSpecificBullets):**
```
Chain:
  "chains to {count} targets"
  "{decay}% decay per jump" (if decay > 0)

Bounce:
  "bounces {count} times"

Explosion:
  "{secondaryRadius}ft explosion on impact"

Forking:
  "splits into {forkCount} forks"

Spreading:
  "spreads at {spreadRate}ft/s"

Seeking:
  "seeks targets within {range}ft"

Behavior-specific:
  "targets nearest/farthest/random/lowest HP/highest HP"
  "accelerates/slows with each bounce"
  "ricochets off surfaces"
```

---

## Step 5: Resources

### Fields Configured:
- **resourceCost** (object)

### ⚠️ CRITICAL REMINDERS FOR RESOURCE COSTS:

1. **Action Points (AP)**:
   - **Pyrofiend spells**: Most cost 2 AP, weaker utility spells cost 1 AP
   - **Always set explicitly**: Never leave `actionPoints` undefined
   - **Default for other classes**: Usually 1 AP unless specified otherwise

2. **Class-Specific Resources (Inferno, Devotion, etc.)**:
   - **MUST be in `resourceTypes` array**: Include `'inferno_ascend'`, `'inferno_descend'`, etc.
   - **MUST be in `resourceValues` object**: Set values like `resourceValues.inferno_ascend = 2`
   - **Example**: 
     ```javascript
     resourceCost: {
       resourceTypes: ['mana', 'inferno_ascend'],
       resourceValues: { mana: 8, inferno_ascend: 2 },
       actionPoints: 2
     }
     ```

3. **Damage Reduction Descriptions**:
   - **Always specify "flat reduction"**: Use descriptions like "Reduces incoming damage by 2 (flat reduction)"
   - **Avoid vague terms**: Don't use "protection" or "shield" without clarification
   - **Clarify mechanic type**: Make it clear it's not absorption/barrier unless it actually is

### SpellCard Display Mapping:

#### Resource Costs (formatResourceCosts function)

**Basic Resources:**
```
Action Points, Mana, Rage, Energy, Focus, Soul Shards, Holy Power, Astral Power
Format: "{icon} {amount}"
Example: "⚡ 2" or "💎 25"
```

**Class-Specific Resources:**

**Elemental Spheres (Arcanoneer):**
- `arcane_sphere`, `holy_sphere`, `shadow_sphere`, `fire_sphere`, `ice_sphere`, `nature_sphere`, `healing_sphere`, `chaos_sphere`
- Format: "{shortName} {amount}"
- Example: "AS 2" or "HS 1"

**Inferno Veil (Pyrofiend):**
- `inferno_required`: "Requires Inferno Level {amount}" - Must be set in `resourceValues.inferno_required`
- `inferno_ascend`: "Ascend Inferno +{amount}" - Must be set in `resourceValues.inferno_ascend`
- `inferno_descend`: "Descend Inferno -{amount}" - Must be set in `resourceValues.inferno_descend`
- **⚠️ CRITICAL REQUIREMENTS FOR ALL PYROFIEND SPELLS**:
  - **ALWAYS include `actionPoints`** (2 for most spells, 1 for weaker utility spells like Flame Step)
  - **ALWAYS include inferno resources in BOTH `resourceTypes` AND `resourceValues`** when applicable
  - **Example - Standard damage spell:**
    ```javascript
    resourceCost: {
      resourceTypes: ['mana', 'inferno_ascend'], // Include in resourceTypes array
      resourceValues: {
        mana: 8,
        inferno_ascend: 2  // Ascends by 2 Inferno Levels
      },
      actionPoints: 2  // Most Pyrofiend spells cost 2 AP
    }
    ```
  - **Example - Utility spell (Flame Step):**
    ```javascript
    resourceCost: {
      resourceTypes: ['mana', 'inferno_ascend'], // Even utility spells include inferno resources
      resourceValues: {
        mana: 12,
        inferno_ascend: 1  // Utility spells typically ascend by 1
      },
      actionPoints: 1  // Weaker utility spells cost 1 AP
    }
    ```
  - **Example - Spell that descends Inferno (Cooling Ember):**
    ```javascript
    resourceCost: {
      resourceTypes: ['mana', 'inferno_descend'],
      resourceValues: {
        mana: 5,
        inferno_descend: 3  // Descends by 3 Inferno Levels
      },
      actionPoints: 2  // Even descending spells cost AP
    }
    ```
- **Utility Effect Formatting for Pyrofiend Spells:**
  - For teleportation effects, use detailed `selectedEffects` configuration instead of `enhancementType`
  - Include distance, line of sight requirements, and other teleport parameters in the effect object
  - If the spell leaves damaging effects (like flames), include `'damage'` in `effectTypes` and configure `damageConfig`
  - **Example - Flame Step utility configuration:**
    ```javascript
    effectTypes: ['utility', 'damage'],  // Include damage if spell leaves damaging effects

    utilityConfig: {
      utilityType: 'Teleport',
      selectedEffects: [{
        id: 'teleport',                  // Special ID for teleport effects
        name: 'Teleport',                // Display name
        distance: 30,                    // Distance in feet
        needsLineOfSight: true            // Line of sight requirement
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },

    damageConfig: {                      // For flames left behind
      formula: '1d6',
      elementType: 'fire',
      damageType: 'area',
      description: 'Flames left at departure and arrival points deal 1d6 fire damage to creatures that enter or start their turn in those areas',
      areaShape: 'circle',
      areaParameters: { radius: 5 },
      duration: 1,
      durationUnit: 'rounds'
    }
    ```
  - **Display Result**: Shows "Teleport" with "Teleport up to 30 ft (requires line of sight)" and separate "Area Damage" effects showing "1d6 fire damage - Creatures that enter or start their turn in flame areas take 1d6 fire damage"

**Musical Notes (Minstrel):**
- `note_i`, `note_ii`, `note_iii`, `note_iv`, `note_v`, `note_vi`, `note_vii`
- Format: "{note} {+/-}{amount}"
- Example: "I +1" or "V -2"

**Temporal Mechanics (Chronarch):**
- `time_shard_generate`: "Time Shards +{amount}"
- `time_shard_cost`: "Time Shards -{amount}"
- `temporal_strain_gain`: "Temporal Strain +{amount}"
- `temporal_strain_reduce`: "Temporal Strain -{amount}"

**Devotion Gauge (Martyr):**
- `devotion_required`: "Requires Devotion Level {amount}"
- `devotion_cost`: "Devotion Level -{amount}"
- `devotion_gain`: "Devotion Level +{amount}"

**Necrotic Ascension (Deathcaller):**
- `bloodTokens`: "Blood Tokens {amount}" - Number of Blood Tokens that can be spent (0-20, each adds +1d6 necrotic damage)
- `ascension_required`: "Requires {ascensionPath}" - Ascension Path required to cast (e.g., "shrouded_veil", "crimson_pact")
- `health`: "Health Cost {formula}" - Health sacrifice formula (e.g., "1d6", "2d8", "level * 3")
- **⚠️ CRITICAL REQUIREMENTS FOR DEATHCALLER SPELLS**:

**Dark Resilience Points (Dreadnaught):**
- `drp`: "DRP {amount}" - Dark Resilience Points consumed by the spell (0-50)
- **⚠️ CRITICAL REQUIREMENTS FOR DREADNAUGHT SPELLS**:
  - **DRP is ALWAYS required for active abilities** - All spells that consume DRP must include `drp` in `resourceTypes` and `resourceValues`
  - **DRP generation**: Players gain 1 DRP per 5 damage taken (maximum 50 DRP)
  - **DRP costs**: Typical costs range from 5-50 DRP depending on spell power
  - **Passive benefits**: At 10+ DRP, gain damage resistance and HP regeneration
  - **Dark Rebirth**: Automatic revival at 0 HP, spending all DRP for 2× DRP healing
  - **Example - Basic DRP spell:**
    ```javascript
    resourceCost: {
      resourceTypes: ['drp'],
      resourceValues: { drp: 10 },
      useFormulas: {},
      actionPoints: 1,
      components: ['verbal', 'somatic']
    }
    ```
  - **Example - Variable DRP spell (Shadow Shield):**
    ```javascript
    resourceCost: {
      resourceTypes: ['drp'],
      resourceValues: { drp: 'variable' }, // Player chooses how many DRP to spend
      useFormulas: {},
      actionPoints: 1,
      components: ['somatic']
    }
    ```
  - **Health costs ALWAYS use formulas** - Set `useFormulas.health = true` and provide formula in `resourceFormulas.health`
  - **Blood Tokens are optional** - Only include `bloodTokens` in `resourceTypes` if the spell can spend tokens for bonus damage
  - **Ascension requirements are string values** - Use path names like "shrouded_veil", "crimson_pact", etc.
  - **Example - Basic necrotic spell:**
    ```javascript
    resourceCost: {
      resourceTypes: [],  // No special resources needed
      resourceValues: {},
      useFormulas: {
        health: true
      },
      resourceFormulas: {
        health: '1d6'  // Basic health cost
      },
      actionPoints: 1
    }
    ```
  - **Example - Blood Token enhanced spell:**
    ```javascript
    resourceCost: {
      resourceTypes: ['bloodTokens'],
      resourceValues: { bloodTokens: 3 },  // Can spend up to 3 tokens
      useFormulas: {
        health: true
      },
      resourceFormulas: {
        health: '2d8'
      },
      actionPoints: 1
    }
    ```
  - **Example - Ascension path required:**
    ```javascript
    resourceCost: {
      resourceTypes: ['ascension_required'],
      resourceValues: { ascension_required: 'crimson_pact' },
      useFormulas: {
        health: true
      },
      resourceFormulas: {
        health: '1d8'
      },
      actionPoints: 1
    }
    ```

**Chaos Mechanics (Chaos Weaver):**
- `mayhem_generate`: "Mayhem Modifiers +{amount}"
- `mayhem_spend`: "Mayhem Modifiers -{amount}"

**Fate Mechanics (Fate Weaver):**
- `threads_generate`: "Threads of Destiny +{amount}"
- `threads_spend`: "Threads of Destiny -{amount}"

**Rage States (Berserker):**
- `rage_state`: "Requires [{stateName}]"
- States: Smoldering (0-20), Frenzied (21-40), Primal (41-60), Carnage (61-80), Cataclysm (81-100), Obliteration (101+)
- **Display**: Shows the required rage state name in brackets
- **Format**: Clean state requirement display
- **Example**: "Requires [Carnage]"

**Formulas:**
- If `useFormulas[resourceType] === true`, display the formula instead of fixed value
- Format: "{icon} {formula}"
- Example: "💎 level * 5"

**Channeling Frequency:**
- For CHANNELED spells with `channelingFrequency`:
  - `per_round` → "/round"
  - `per_turn` → "/turn"
  - `per_second` → "/sec"
  - `atStart` → " (at start)"
  - `atEnd` → " (at end)"
- **Display Location**: Shown next to resource costs when `resourceCost.channelingFrequency` is set
- **Format**: Resource cost badge with frequency suffix (e.g., "💎 25/round")

**Fields Used:**
- `resourceCost.resourceTypes[]` - Array of selected resource types (e.g., `['mana', 'inferno_ascend']`)
- `resourceCost.resourceValues{}` - Object mapping resource types to values
  - **⚠️ CRITICAL**: For class-specific resources (Inferno, Devotion, etc.), values MUST be in `resourceValues`:
    ```javascript
    resourceValues: {
      mana: 8,
      inferno_ascend: 2,      // Pyrofiend: Ascends Inferno
      inferno_descend: 3,     // Pyrofiend: Descends Inferno
      inferno_required: 5,    // Pyrofiend: Requires Inferno Level
      devotion_required: 3,   // Martyr: Requires Devotion Level
      // etc.
    }
    ```
- `resourceCost.resourceFormulas{}` - Object mapping resource types to formulas
- `resourceCost.useFormulas{}` - Object mapping resource types to boolean
- `resourceCost.actionPoints` (number) - **⚠️ IMPORTANT**: 
  - **Default**: Most spells cost 1 AP
  - **Pyrofiend spells**: Most cost 2 AP, weaker utility spells cost 1 AP
  - **Powerful spells**: May cost 2-3 AP depending on class and spell power
  - **Always specify**: Never leave `actionPoints` undefined - always set explicitly
- `resourceCost.mana` (number) - Legacy support, prefer `resourceValues.mana`
- `resourceCost.channelingFrequency` (string, CHANNELED spells only)
- `resourceCost.components[]` - Array of component strings ('V', 'S', 'M')
- `resourceCost.materialComponents` (string)
- `resourceCost.verbalText` (string)
- `resourceCost.somaticText` (string)

**⚠️ CRITICAL - Action Points for Pyrofiend Spells:**
- **Most Pyrofiend spells**: `actionPoints: 2` (standard cost)
- **Weak utility spells**: `actionPoints: 1` (e.g., Heat Shield, Cooling Ember)
- **Never omit**: Always explicitly set `actionPoints` in `resourceCost`

**Spell Components Display:**
```
V - Verbal (shown as icon/badge)
S - Somatic (shown as icon/badge)
M - Material (shown as icon/badge with tooltip showing materialComponents text)

If verbalText or somaticText provided:
  Tooltip shows the custom text
```

---

## Step 6: Cooldown

### Fields Configured:
- **cooldownConfig** (object)

### SpellCard Display Mapping:

#### Cooldown (formatCooldown function)

**Turn-Based:**
```
"{value} turn" or "{value} turns"
Example: "3 turns"
No cooldown: "No cooldown"
```

**Short Rest:**
```
"{value} use(s)/short rest"
Example: "2 uses/short rest"
```

**Long Rest:**
```
"{value} use(s)/long rest"
Example: "1 use/long rest"
```

**Charge-Based:**
```
"{charges} charge(s) ({recovery} turn(s)/charge)"
Example: "3 charges (2 turns/charge)"
```

**Dice-Based:**
```
"{value} cooldown"
Example: "1d4 cooldown"
```

**Fields Used:**
- `cooldownConfig.type` (enum: 'turn_based', 'short_rest', 'long_rest', 'charge_based', 'dice_based')
- `cooldownConfig.value` (number) - Cooldown value (turns, uses, or dice formula)
- `cooldownConfig.charges` (number) - Maximum charges (charge_based only)
- `cooldownConfig.recovery` (number) - Turns to recover 1 charge (charge_based only)
- `cooldownConfig.sharesCooldown` (boolean) - Whether this spell shares cooldown with other spells
- `cooldownConfig.cooldownGroup` (string) - Group identifier for shared cooldowns

**Location**: Card footer, cooldown badge

---

## Step 7: Triggers

### Fields Configured:
- **triggerConfig** (object)

### ⚠️ Key Concepts - Understanding Trigger Types:

**Three Types of Triggers:**

1. **Global Triggers** (`triggerConfig.global`):
   - Apply to the **entire spell**
   - Used for REACTION, PASSIVE, TRAP, and STATE spell types
   - Determine when the spell itself activates
   - Displayed as a header section before all effects

2. **Effect-Specific Triggers** (`triggerConfig.effectTriggers`):
   - Apply to **specific effects** (damage, healing, buff, etc.)
   - Determine **when** a specific effect activates
   - Can be stored under base types (`damage`, `healing`) OR subtypes (`damage_direct`, `healing_hot`, etc.)
   - **Integrated into each effect item** - displayed below the effect mechanics text with a divider
   - When conditional formulas exist: triggers are shown with their formulas (e.g., "If below 25% health: 3d6 Necrotic Damage")
   - When no conditional formulas: triggers appear as standalone text below the effect (e.g., "If below 50% health")
   - Format uses intuitive "If..." style (e.g., "If below 50% health" instead of "Low Health")

3. **Conditional Effects** (`triggerConfig.conditionalEffects`):
   - Modify **how** an effect works based on triggers
   - Maps trigger IDs to different formulas/settings
   - Displayed **below** the main effect text as "If {trigger}: {formula}"
   - Requires both `effectTriggers` (for trigger definitions) and `conditionalFormulas` (for formula mappings)

**Important Relationships:**
- Effect-specific triggers can exist **without** conditional effects (just determines when effect activates)
- Conditional effects **require** effect-specific triggers (to get trigger IDs and formatting)
- Both check all possible subtypes when looking for triggers/configs

### SpellCard Display Mapping:

#### Trigger Configuration

**Global Triggers:**
- Used for REACTION, PASSIVE, TRAP, and STATE spell types
- Displayed in a "Spell Triggers" section at the top when they don't have conditional formulas
- When conditional formulas exist: triggers are shown with their formulas in the effect sections (not as standalone)
- Format: Clear "Spell Triggers" header with trigger conditions in intuitive "If..." format

**Trigger Role:**
- `mode`: 'CONDITIONAL', 'AUTO_CAST', 'BOTH'
- `activationDelay`: seconds before auto-cast
- `requiresLOS`: boolean
- `maxRange`: number or null
- `cooldownAfterTrigger`: number
- `resourceModifier`: number (1.0 = normal cost)

**Fields Used:**

**Global Triggers:**
- `triggerConfig.global.enabled` (boolean) - Whether global triggers are enabled
- `triggerConfig.global.logicType` ('AND', 'OR') - How multiple triggers are combined
- `triggerConfig.global.compoundTriggers[]` - Array of trigger objects with:
  - `id` (string) - Trigger type identifier (e.g., 'health_threshold', 'damage_taken', 'combat_start')
  - `category` (string) - Trigger category ('combat', 'movement', 'health', 'status', 'environment', 'time', 'trap')
  - `name` (string) - Human-readable trigger name
  - `parameters` (object) - Trigger-specific parameters:
    - `percentage` (number) - For health/resource thresholds
    - `amount` (number) - For damage/health change amounts
    - `distance` (number) - For movement/proximity triggers
    - `comparison` (string) - 'less_than', 'greater_than', 'equal', 'not_equal'
    - `threshold_type` (string) - 'percentage' or 'flat' for resource thresholds
    - `resource_type` (string) - 'health', 'mana', 'energy', 'rage', 'inferno'
    - `perspective` (string) - 'self', 'target', 'ally', 'enemy'
    - `target_type` (string) - 'self', 'ally', 'enemy', 'any'
    - `damage_type` (string) - Specific damage type for damage triggers
    - `effect_type` (string) - Specific effect type for status triggers
    - `stack_count` (number) - Stack count for effect stack triggers
    - `duration` (number) - Duration in rounds for duration triggers
    - `is_percent` (boolean) - Whether amount is percentage
    - `whose_turn` (string) - 'self', 'ally', 'enemy' for turn triggers
    - `creature_type` (string) - For trap triggers
    - `interaction_type` (string) - For interaction triggers
    - `weather_type` (string) - For weather triggers
    - `terrain_type` (string) - For terrain triggers
    - `is_day` (boolean) - For day/night triggers
    - `object_type` (string) - For object interaction triggers
    - `ability_id` (string) - For cooldown ready triggers
    - `time` (number) - For timer triggers (seconds)
    - `weight_threshold` (number) - For weight/pressure triggers
    - `magic_type` (string) - For magical trigger
    - `damage_threshold` (number) - For trap damage triggers

**Required Conditions:**
- `triggerConfig.requiredConditions.enabled` (boolean) - Whether required conditions are enabled
- `triggerConfig.requiredConditions.logicType` ('AND', 'OR') - How multiple conditions are combined
- `triggerConfig.requiredConditions.conditions[]` - Array of trigger objects that must be met before spell can be cast

**Effect-Specific Triggers:**
- `triggerConfig.effectTriggers{}` - Object mapping effect types/subtypes to trigger configs
- **⚠️ CRITICAL - Subtype Support**: Triggers can be stored under base types OR subtypes:
  - **Damage subtypes**: `damage`, `damage_direct`, `damage_dot`, `damage_area`, `damage_combined`
  - **Healing subtypes**: `healing`, `healing_direct`, `healing_hot`, `healing_shield`
  - The spellcard checks ALL possible subtypes when looking for triggers
  - Example: Triggers configured for "Direct Damage" are stored as `effectTriggers.damage_direct`
- Each trigger config contains:
  - `logicType` ('AND' | 'OR') - How multiple triggers are combined
  - `compoundTriggers[]` - Array of trigger objects (same structure as global triggers)
  - `targetingOverride` (string, optional) - Override targeting for this effect when triggered (e.g., 'nearest', 'farthest', 'lowest_health')
- **Display Behavior**:
  - Effect-specific triggers are **integrated into each effect item** (not shown as separate headers)
  - They appear **below** the effect mechanics text with a divider (border-top styling)
  - When conditional formulas exist: triggers are shown with their formulas (e.g., "If below 25% health: 3d6 Necrotic Damage")
  - When no conditional formulas: triggers appear as standalone text (e.g., "If below 50% health")
  - Format uses `formatTriggerForConditionalDisplay()` for intuitive "If..." style
  - Health thresholds are more concrete (e.g., "If below 50% health" instead of "Low Health")
- **Trigger Detection Logic**:
  - The spellcard uses `getEffectTriggersForType()` to find triggers
  - Checks subtypes in order: base type first, then specific subtypes
  - For damage: checks `damage` → `damage_direct` → `damage_dot` → `damage_area` → `damage_combined`
  - For healing: checks `healing` → `healing_direct` → `healing_hot` → `healing_shield`
  - Returns the **first** subtype found that has triggers (does not combine multiple subtypes)
  - This means if you configure triggers for both `damage` and `damage_direct`, only one will be used

**Conditional Effects:**
- `triggerConfig.conditionalEffects{}` - Object mapping effect types/subtypes to conditional configs
- **⚠️ CRITICAL - Subtype Support**: Conditional effects can be stored under base types OR subtypes (same as effect-specific triggers)
- **Relationship with Effect-Specific Triggers**:
  - Effect-specific triggers (`effectTriggers`) determine **when** an effect activates
  - Conditional effects (`conditionalEffects`) determine **how** an effect changes based on triggers
  - They work together: `conditionalFormulas` maps trigger IDs to formulas, and looks up trigger details from `effectTriggers`
  - Effect-specific triggers display as headers **even if** the effect is not conditional
  - Conditional formulas display **below** the main effect text when triggers modify the formula
- Each conditional config contains:
  - `conditionalEffects[effectType].isConditional` (boolean) - Whether this effect is conditional
  - `conditionalEffects[effectType].defaultEnabled` (boolean) - Whether effect is enabled by default (when no trigger conditions are met)
  - `conditionalEffects[effectType].baseFormula` (string) - Base formula for the effect (from Step 3)
  - `conditionalEffects[effectType].baseSettings` (object) - Base settings for the effect (from Step 3):
    - For damage: `{ damageType, elementType, ... }`
    - For healing: `{ healingType, hasHotEffect, hasShieldEffect, ... }`
    - For buff: `{ duration, statAffected, ... }`
    - For debuff: `{ duration, durationUnit, difficultyClass, savingThrow, ... }`
    - For control: `{ duration, savingThrow, difficultyClass, controlType, effects, ... }`
    - For restoration: `{ resourceType, resolution, isOverTime, overTimeFormula, ... }`
  - `conditionalEffects[effectType].conditionalFormulas{}` - Map of trigger ID to formula:
    - Key: trigger ID (e.g., 'health_threshold_30', 'damage_taken', 'enter_area', 'default')
    - Value: formula string (e.g., '2d6 + INT', 'damage * 1.5')
    - Special key 'default' contains the base formula
    - **Trigger ID Matching**: The trigger ID in `conditionalFormulas` must match a trigger `id` in `effectTriggers[effectType].compoundTriggers[]`
  - `conditionalEffects[effectType].conditionalSettings{}` - Map of trigger ID to settings object:
    - Key: trigger ID
    - Value: settings object that can override baseSettings for that trigger
    - Can include: `statModifiers[]`, `statPenalties[]`, `damageType`, `elementType`, `duration`, etc.

**Buff/Debuff Triggers:**
- `triggerConfig.buffDebuffTriggers{}` - Triggers attached to effects created by this spell:
  - `buffDebuffTriggers.buff` - Triggers for buff effects created by spell
  - `buffDebuffTriggers.debuff` - Triggers for debuff effects created by spell
  - Each contains: `triggers[]`, `triggersEffect` (string | null)

**Trigger Role:**
- `triggerConfig.triggerRole.mode` ('CONDITIONAL') - Always CONDITIONAL (auto-cast removed)
- Note: Auto-cast functionality has been removed; triggers now only modify effects

**Trigger Categories and Types:**

The wizard supports 7 trigger categories with multiple trigger types each:

1. **Combat** (`combat`):
   - `damage_taken`, `damage_dealt`, `critical_hit`, `critical_hit_taken`
   - `miss`, `dodge`, `parry`, `block`
   - `spell_reflect`, `spell_interrupt`, `spell_resist`
   - `combat_start`, `combat_end`, `first_strike`, `last_stand`

2. **Movement** (`movement`):
   - `movement_start`, `movement_end`, `distance_moved`
   - `enter_area`, `leave_area`, `proximity`
   - `forced_movement`, `high_ground`, `falling`

3. **Health, Resources & Death** (`health`):
   - `health_threshold`, `health_change`, `resource_threshold`
   - `ally_health`, `on_death`, `on_revival`, `near_death`
   - `death_save_success`, `death_save_failure`, `full_health`, `overhealing`

4. **Status Effects** (`status`):
   - `effect_applied`, `effect_removed`, `effect_duration`
   - `effect_stack`, `dispel`, `cleanse`, `immunity`

5. **Environment** (`environment`):
   - `weather_change`, `terrain_type`, `day_night`
   - `object_interaction`, `environmental_damage`
   - `underwater`, `in_darkness`, `in_bright_light`

6. **Time & Turns** (`time`):
   - `turn_start`, `turn_end`, `round_start`, `round_end`
   - `timer`, `cooldown_ready`, `duration_threshold`

7. **Trap Triggers** (`trap`):
   - `proximity`, `stepped_on`, `interaction`, `line_of_sight`
   - `detection_attempt`, `disarm_attempt`, `timer`
   - `weight_pressure`, `magical_trigger`, `trap_chain`, `trap_damage`

**Display Format:**

**Global Triggers:**
- **Location**: Displayed in a "Spell Triggers" section at the top (only when no conditional formulas use these triggers)
- **Format**:
  ```
  Spell Triggers
  If {trigger1}
  If {trigger2}
  ```
- **Example**:
  ```
  Spell Triggers
  If take 50 pts of damage
  If below 50% health
  ```
- **Note**: When global triggers have conditional formulas, they are shown with their formulas in the effect sections instead of as standalone triggers

**Required Conditions:**
- **Location**: Displayed as a header section before all effects
- **Format**:
  ```
  Required - ALL (or ANY if logicType === 'OR')
  When {condition1}
  When {condition2}
  ```
- **Example**:
  ```
  Required - ALL
  When combat starts
  When I have at least 50 mana
  ```

**Effect-Specific Triggers:**
- **Location**: **Integrated into each effect item** - displayed below the effect mechanics text with a divider
- **Format**:
  - When conditional formulas exist: Triggers shown with formulas
  - When no conditional formulas: Triggers shown as standalone text below effect
- **Example for Damage with Conditional Formulas**:
  ```
  INSTANT DAMAGE
  2d6 Fire Damage
  
  If below 25% health: 3d6 Necrotic Damage
  If target starts moving: 4d6 Fire Damage
  ```
- **Example for Damage without Conditional Formulas**:
  ```
  INSTANT DAMAGE
  2d6 Fire Damage
  
  If below 50% health
  If target starts moving
  ```
- **Example for Healing**:
  ```
  Healing
  2d8 + Spirit Healing
  
  If below 30% health: 4d8 + Spirit Healing
  ```
- **Note**: 
  - Effect-specific triggers are found by checking all subtypes:
    - For damage: checks `damage`, `damage_direct`, `damage_dot`, `damage_area`, `damage_combined`
    - For healing: checks `healing`, `healing_direct`, `healing_hot`, `healing_shield`
  - Uses the first subtype found that has triggers
  - Triggers use `formatTriggerForConditionalDisplay()` for intuitive formatting
  - Health thresholds show concrete percentages (e.g., "If below 50% health" instead of "Low Health")

**Conditional Effects (Conditional Formulas):**
- **Location**: Displayed **below** the main effect mechanics text, separated by a border
- **Format**:
  ```
  If {trigger}: {formattedFormula} {damageType/healingType}
  ```
- **Note**: 
  - Trigger text uses `formatTriggerForConditionalDisplay()` for intuitive "If..." format
  - Health thresholds are more concrete (e.g., "If below 50% health" instead of "Low Health")
  - Triggers are integrated into the effect item, not shown as separate headers
- **Example**:
  ```
  INSTANT DAMAGE
  2d6 Fire Damage
  
  If take 50 pts of damage: 4d6 Fire Damage
  If below 50% health: 3d6 Necrotic Damage
  ```
- **Display Logic**:
  - Only shown if `conditionalEffects[effectType].conditionalFormulas` exists
  - Maps trigger IDs from `conditionalFormulas` to trigger objects from `effectTriggers`
  - Uses `formatTriggerForConditionalDisplay()` to format each trigger (more intuitive than `formatTriggerText()`)
  - Uses `formatFormulaToPlainEnglish()` to format the formula
  - When conditional formulas exist, standalone triggers are NOT shown (triggers are shown with their formulas)

**Trigger Text Formatting:**

The spell card uses two formatting functions for triggers:

1. **`formatTriggerText()`** - Basic trigger formatting (used for required conditions and legacy displays)
2. **`formatTriggerForConditionalDisplay()`** - Intuitive conditional formatting (used for effect-specific triggers and conditional formulas)

**formatTriggerForConditionalDisplay()** provides more intuitive formatting:
- Converts "When" to "If" for conditional display
- Makes health thresholds concrete (e.g., "If below 50% health" instead of "Low Health")
- Simplifies trigger text for better readability
- Handles all trigger types with consistent "If..." format

**formatTriggerText()** - Basic trigger formatting (legacy/required conditions):

- **Damage Triggers**:
  - `damage_taken`: "When {perspective} takes {amount} pts of {damageType} damage"
  - `damage_dealt`: "When {perspective} deals {amount} pts of {damageType} damage"
  - `critical_hit`: "When {perspective} lands a critical hit"
  - `critical_hit_taken`: "When {perspective} receives a critical hit"

- **Movement Triggers**:
  - `enter_area`: "When {perspective} enters {areaType}"
  - `leave_area`: "When {perspective} leaves {areaType}"
  - `proximity`: "When {entityType} comes within {distance} ft"
  - `movement_start`: "When {perspective} starts moving"
  - `movement_end`: "When {perspective}'s movement stops"

- **Health/Resource Triggers**:
  - `health_threshold`: 
    - `formatTriggerText()`: "When {perspective}'s health {comparison} {percentage}%"
    - `formatTriggerForConditionalDisplay()`: "If {comparison} {percentage}% health" (for self) or "If {target} {comparison} {percentage}% health" (for others)
  - `resource_threshold`: "When {resourceType} {comparison} {threshold}%"
  - `low_health`: "When below {threshold}% health"

- **Combat Triggers**:
  - `combat_start`: "When combat starts"
  - `combat_end`: "When combat ends"
  - `turn_start`: "When {perspective}'s turn starts"
  - `turn_end`: "When {perspective}'s turn ends"

- **Status Triggers**:
  - `effect_applied`: "When {perspective} gains {effectType}"
  - `effect_removed`: "When {perspective} loses {effectType}"

- **Spell Triggers**:
  - `spell_cast`: "When {perspective} casts {spellName} (or level {spellLevel} spell)"
  - `spell_interrupt`: "When a spell {perspective} casts is interrupted"

**Perspective Mapping:**
- `'self'` → "I" / "my" / "me"
- `'target'` → "my target" / "target's"
- `'ally'` → "an ally" / "ally's"
- `'enemy'` → "an enemy" / "enemy's"
- `'any'` → "anyone" / "anyone's"

**Comparison Mapping:**
- `'less_than'` or `'below'` → "falls below"
- `'greater_than'` or `'above'` → "rises above"
- `'equal'` or `'equals'` → "equals"

---

## Step 7: Mechanics

### Fields Configured:
- **mechanicsConfig** (object)
- **effectMechanicsConfigs{}** (object) - Per-effect mechanics

### SpellCard Display Mapping:

#### Mechanics Display (formatMechanics function)

**Resolution Methods:**
- `resolution`: 'DICE', 'CARDS', 'COINS'
- Displayed as badge: "Dice" / "Cards" / "Coins"

**Card Mechanics:**
```
"Draw {drawCount} cards"
"Card Value + {stat} + {bonus}"
"Poker Hand: {handType} (+{bonus})"
"Same Suit Bonus: +{bonus}"
```

**Coin Mechanics:**
```
"Flip {flipCount} coins"
"Heads Count × {multiplier}"
"Longest Streak: {streakFormula}"
"All Heads Bonus: +{bonus}"
```

**Dice Mechanics:**
```
"Roll {diceFormula}"
"Advantage" / "Disadvantage"
"Reroll {condition}"
```

**State Requirements:**
```
"Requires: {stateName} Level {level}"
"Gains: {stateName} +{amount}"
"Loses: {stateName} -{amount}"
```

**Combo Systems:**
```
"Combo Points: {points}"
"Spend {points} for {effect}"
```

**Fields Used:**
- `mechanicsConfig.cards` (object)
- `mechanicsConfig.coins` (object)
- `mechanicsConfig.combos` (object)
- `mechanicsConfig.stateRequirements[]` - Array of state requirement objects
- `effectMechanicsConfigs[effectId]` - Per-effect mechanics configs
- `resolution` ('DICE', 'CARDS', 'COINS')
- `cardConfig.formula` / `cardConfig.drawCount`
- `coinConfig.formula` / `coinConfig.flipCount`
- `diceConfig.formula`

**Display Location**: Mechanics section below effects, formatted as bullet points or structured text

---

## Step 8: Channeling

### Fields Configured:
- **channelingConfig** (object)

### SpellCard Display Mapping:

#### Channeling Configuration

**Channeling Types:**
```
"Power Up" - Damage/healing increases over time
"Persistent" - Constant damage/healing while channeling
"Staged" - Different effects at different stages
```

**Power Up Display:**
```
"Channeling Power Up: {baseFormula} → {maxFormula}"
"Increases every {tickFrequency}"
"Max power at {maxDuration}"
```

**Persistent Display:**
```
"Channeling: {formula} per {tickFrequency}"
"Continues while channeling"
```

**Staged Display:**
```
"Stage 1 ({duration1}): {effect1}"
"Stage 2 ({duration2}): {effect2}"
"Stage 3 ({duration3}): {effect3}"
```

**Fields Used:**
- `channelingConfig.type` (enum: 'power_up', 'persistent', 'staged') - Channeling type
- `channelingConfig.baseFormula` (string) - Starting formula for power_up, or constant formula for persistent
- `channelingConfig.maxFormula` (string) - Maximum formula for power_up type
- `channelingConfig.tickFrequency` (string) - How often effects apply (e.g., 'round', 'turn')
- `channelingConfig.maxDuration` (number) - Maximum channeling duration (for power_up)
- `channelingConfig.scalingType` (enum: 'linear', 'exponential', 'diminishing') - How power_up scales
- `channelingConfig.stages[]` (array) - Array of stage configs for staged type:
  - `round` (number) - Which round this stage applies to
  - `formula` (string) - Formula for this stage
  - `description` (string) - Description of stage
  - `areaInfo` (object) - Area expansion info (if applicable)
- `channelingConfig.perRoundFormulas{}` (object) - Map of effect ID to array of per-round formulas
- `channelingConfig.areaExpansion` (object) - Area expansion configuration:
  - `enabled` (boolean) - Whether area expands
  - `initialRadius` (number) - Starting radius
  - `expansionRate` (number) - How much radius increases per round
  - `maxRadius` (number) - Maximum radius

**Display Location**: Integrated with DoT/HoT effects or shown as separate section

---

## Step 9: Balance

### Fields Configured:
- Balance analysis (read-only, computed)
- Balance recommendations

### SpellCard Display Mapping:

**Note**: Balance step doesn't directly add fields to the spell card. It provides recommendations that can be applied to other steps.

---

## Most Common Spell Configuration Issues & Fixes

### Issue 1: Status Effects (Slow, Stun, etc.) Not Showing - Only Saving Throws Display

**Problem**: Spells like Frost Nova show "DC 14 Constitution save" but no actual "Slow" or "Stun" effect details.

**Root Cause**: Missing `effects` array in `debuffConfig` or `controlConfig`.

**Incorrect Structure (Frost Nova)**:
```javascript
debuffConfig: {
  debuffType: 'statusEffect',
  durationValue: 2,
  durationType: 'rounds',
  saveDC: 14,
  saveType: 'constitution'
  // MISSING: effects array!
}
```

**Correct Structure**:
```javascript
debuffConfig: {
  debuffType: 'statusEffect',
  durationValue: 2,
  durationType: 'rounds',
  durationUnit: 'rounds', // REQUIRED!
  saveDC: 14,
  saveType: 'constitution',
  effects: [{
    id: 'slow',
    name: 'Slow',
    description: 'Movement speed reduced by half',
    // Additional status effect configuration
  }]
}
```

### Issue 2: Control Effects Not Showing Effect Details

**Problem**: Control spells show generic "Control Effect" instead of specific effects like "Pull" or "Stun".

**Root Cause**: Using deprecated `specialEffects` array instead of `effects` array.

**Incorrect Structure**:
```javascript
controlConfig: {
  controlType: 'forcedMovement',
  specialEffects: ['pull'] // WRONG!
}
```

**Correct Structure**:
```javascript
controlConfig: {
  controlType: 'forcedMovement',
  duration: 0,
  durationUnit: 'instant',
  saveDC: 12,
  saveType: 'strength',
  savingThrow: true,
  effects: [{
    id: 'pull',
    name: 'Pull',
    description: 'Pulls the target toward the caster',
    config: {
      movementType: 'pull',
      distance: 15
    }
  }]
}
```

### Issue 3: Debuff Effects Missing Stat Changes

**Problem**: Debuff spells show only duration/save info but no stat reduction details.

**Root Cause**: Missing `effects` array with `statModifier` configurations.

**Incorrect Structure**:
```javascript
debuffConfig: {
  debuffType: 'statReduction',
  durationValue: 3,
  durationType: 'rounds',
  saveDC: 15,
  saveType: 'constitution'
  // MISSING: effects array with statModifier!
}
```

**Correct Structure**:
```javascript
debuffConfig: {
  debuffType: 'statReduction',
  durationValue: 3,
  durationType: 'rounds',
  durationUnit: 'rounds', // REQUIRED!
  saveDC: 15,
  saveType: 'constitution',
  effects: [{
    id: 'weakened',
    name: 'Weakened',
    description: 'Reduces target strength',
    statModifier: {
      stat: 'strength',
      magnitude: 2,
      magnitudeType: 'flat'
    }
  }]
}
```

### Issue 4: Buff Effects Not Showing

**Problem**: Buff spells show generic "Buff Effect" instead of specific stat enhancements.

**Root Cause**: Missing `effects` array in `buffConfig`.

**Solution**: Always include `effects` array with proper effect objects (see Buff Effects section above).

### Issue 5: Duration Unit Missing

**Problem**: Effects show duration but with missing or incorrect units.

**Root Cause**: Missing `durationUnit` field that matches `durationType`.

**Solution**: Always include both `durationValue` and `durationUnit`:
```javascript
durationValue: 2,
durationType: 'rounds',
durationUnit: 'rounds' // Must match durationType
```

### Quick Fix Checklist

- ✅ **Debuff Effects**: Include `effects: [{ id: 'slow', name: 'Slow', description: '...' }]`
- ✅ **Control Effects**: Use `effects` array, not `specialEffects`
- ✅ **Buff Effects**: Include `effects` array with `statModifier` or status effect configs
- ✅ **Duration**: Always include `durationUnit` matching `durationType`
- ✅ **Saving Throws**: For damage effects, they're integrated into damage text; for debuff/control, they're separate effects

---

## Step 10: Review

### Display Mapping:

The Review step shows a preview of the complete spell card using the UnifiedSpellCard component with `variant="wizard"`.

**All previously configured fields are displayed here** in their final formatted state.

---

## Formula Formatting

### Formula Syntax and Math Operators

Formulas support rich mathematical expressions using character stats, dice rolls, and operators. This makes spells scale with character progression and creates interesting gameplay mechanics.

#### Basic Math Operators

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `+` | Addition | Adds two values together | `strength + 5` | If strength is 15, result is 20 |
| `-` | Subtraction | Subtracts the second value from the first | `maxHealth - currentHealth` | If maxHealth is 100 and currentHealth is 75, result is 25 |
| `*` | Multiplication | Multiplies two values | `intelligence * 2` | If intelligence is 12, result is 24 |
| `/` | Division | Divides the first value by the second | `spellDamage / 3` | If spellDamage is 30, result is 10 |

#### Comparison Operators

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `>` | Greater Than | Returns true if first value is greater than second | `strength > 15 ? 10 : 5` | If strength is 18, returns 10. If strength is 12, returns 5 |
| `<` | Less Than | Returns true if first value is less than second | `currentHealth < 50 ? 20 : 0` | If currentHealth is 30, returns 20. If currentHealth is 80, returns 0 |
| `>=` | Greater Than or Equal | Returns true if first value is greater than or equal to second | `level >= 10 ? 15 : 10` | If level is 10 or higher, returns 15. Otherwise returns 10 |
| `<=` | Less Than or Equal | Returns true if first value is less than or equal to second | `exhaustionLevel <= 2 ? 0 : 5` | If exhaustionLevel is 2 or less, returns 0. Otherwise returns 5 |
| `==` | Equal To | Returns true if both values are equal | `currentMana == maxMana ? 25 : 15` | If mana is full, returns 25. Otherwise returns 15 |

#### Conditional Logic

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `? :` | Ternary (If-Then-Else) | If condition is true, use first value, otherwise use second | `strength > intelligence ? strength : intelligence` | Uses whichever stat is higher |
| `&&` | Logical AND | Both conditions must be true | `strength > 15 && agility > 12 ? 20 : 10` | Returns 20 only if both strength > 15 AND agility > 12 |
| `\|\|` | Logical OR | At least one condition must be true | `fireDamage > 0 \|\| frostDamage > 0 ? 15 : 10` | Returns 15 if you have any fire or frost damage |

#### Math Functions

| Function | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `MAX(a, b)` | Maximum | Returns the larger of two values | `MAX(strength, intelligence)` | If strength is 15 and intelligence is 18, returns 18 |
| `MIN(a, b)` | Minimum | Returns the smaller of two values | `MIN(currentHealth, 50)` | If currentHealth is 75, returns 50. If currentHealth is 30, returns 30 |
| `ROUND(a)` | Round | Rounds to the nearest whole number | `ROUND(intelligence / 3)` | If intelligence is 16, result is ROUND(5.33) = 5 |
| `FLOOR(a)` | Floor | Rounds down to the nearest whole number | `FLOOR(spellDamage / 4)` | If spellDamage is 23, result is FLOOR(5.75) = 5 |
| `CEIL(a)` | Ceiling | Rounds up to the nearest whole number | `CEIL(healingPower / 6)` | If healingPower is 25, result is CEIL(4.17) = 5 |

#### Available Character Stats

**Primary Attributes:**
- `strength` - Physical power and melee damage
- `agility` - Agility, reflexes, and ranged accuracy (use `agility`, not `dexterity` or `dex`)
- `constitution` - Health, stamina, and physical resilience
- `intelligence` - Magical power, knowledge, and spell effectiveness
- `spirit` - Willpower, spiritual energy, and mana regeneration
- `charisma` - Social influence, leadership, and divine magic

**Combat Stats:**
- `level` - Character level
- `currentHealth` - Current hit points
- `maxHealth` - Maximum hit points
- `currentMana` - Current mana
- `maxMana` - Maximum mana
- `currentActionPoints` - Current action points
- `maxActionPoints` - Maximum action points

#### Formula Examples

**Simple Scaling:**
```javascript
formula: '1d6 + intelligence/3'  // Base 1d6, plus 1/3 of intelligence
formula: '2d8 + intelligence'     // Base 2d8, plus full intelligence
formula: '3d6 + intelligence * 1.5' // Base 3d6, plus 1.5x intelligence
```

**Conditional Scaling:**
```javascript
formula: 'strength > 20 ? (strength - 20) * 2 + 15 : 15'
// Base 15 damage, plus 2 extra damage for each point of strength above 20

formula: 'currentHealth < (maxHealth / 2) ? 25 : 10'
// Deal 25 damage if below half health, otherwise 10 damage
```

**Multi-Stat Scaling:**
```javascript
formula: 'MAX(strength, intelligence) + MIN(agility, spirit)'
// Use your highest physical/mental stat plus your lowest utility stat

formula: 'intelligence + spirit/2'
// Intelligence plus half of spirit
```

**Resource-Based Scaling:**
```javascript
formula: 'currentMana >= 50 ? spellDamage * 1.5 : spellDamage'
// Deal 50% more spell damage if you have at least 50 mana
```

#### Best Practices

1. **Use stat modifiers for scaling**: Instead of flat damage, use formulas like `1d6 + intelligence/3` to make spells scale with character stats
2. **Keep formulas readable**: Use clear stat names and simple operations when possible
3. **Balance appropriately**: Lower level spells should use smaller modifiers (e.g., `/3`, `/4`) while higher level spells can use larger ones (e.g., `* 1.5`, `* 2`)
4. **Use division for fractional scaling**: `intelligence/3` is better than `intelligence * 0.33` for readability
5. **Consider DoT formulas**: DoT effects can also use formulas: `dotFormula: '1d4 + intelligence/4'`

### Formula Cleaning (cleanFormula function)

**Process:**
1. Replace underscores with spaces: `_` → ` `
2. Handle camelCase: `camelCase` → `camel Case`
3. Replace resource variables with proper names:
   - `action_points` → `Action Points`
   - `max_mana` → `Max Mana`
   - `current_health` → `Current Health`
   - `strength` → `Strength`
   - `intelligence` → `Intelligence`
   - `spirit` → `Spirit`
   - etc.

### Formula to Plain English (formatFormulaToPlainEnglish function)

**Handles:**
- Dice notation: `2d6` → `2d6`
- Stat names: `int` → `Intelligence`
- Card variables: `CARD_VALUE` → `card values`
- Coin variables: `HEADS_COUNT` → `heads flipped`
- Conditional expressions: `(condition ? value1 : value2)` → readable text
- Complex formulas with operators

---

## Complete Spell Data Structure

```javascript
{
  // Step 1: Basic Information
  id: string,
  name: string,
  description: string,
  level: number,
  icon: string,
  typeConfig: {
    school: string,              // Primary damage/healing type
    secondaryElement: string,     // Secondary damage/healing type
    icon: string,
    tags: string[],
    // Type-specific configs below
  },
  
  // Step 2: Spell Type
  spellType: 'ACTION' | 'CHANNELED' | 'PASSIVE' | 'REACTION' | 'TRAP' | 'STATE' | 'ZONE',
  
  // Step 3: Effects
  effectTypes: string[],         // ['damage', 'healing', 'buff', etc.]
  damageConfig: {
    formula: string,
    elementType: string,
    secondaryElementType: string,
    damageType: 'direct' | 'dot',
    canCrit: boolean,
    critMultiplier: number,
    critDiceOnly: boolean,
    hasDotEffect: boolean,
    dotConfig: {
      duration: number,
      tickFrequency: string,
      dotFormula: string,
      isProgressiveDot: boolean,
      progressiveStages: array,
      cardConfig: object,
      coinConfig: object
    },
    savingThrowConfig: object,
    cardConfig: object,
    coinConfig: object
  },
  healingConfig: {
    formula: string,
    healingType: 'direct' | 'hot' | 'shield',
    hasHotEffect: boolean,
    hotFormula: string,
    hotDuration: number,
    hotTickType: string,
    isProgressiveHot: boolean,
    hotProgressiveStages: array,
    hasShieldEffect: boolean,
    shieldFormula: string,
    shieldDuration: number,
    shieldDamageTypes: string,
    shieldOverflow: string,
    shieldBreakBehavior: string,
    cardConfig: object,
    hotCardConfig: object,
    shieldCardConfig: object,
    coinConfig: object,
    hotCoinConfig: object,
    shieldCoinConfig: object
  },
  buffConfig: {
    buffType: string,
    effects: array,
    durationValue: number,
    durationType: string,
    concentrationRequired: boolean,
    canBeDispelled: boolean,
    maxStacks: number
  },
  debuffConfig: {
    debuffType: string,
    effects: array,
    durationValue: number,
    durationType: string,
    difficultyClass: number,
    savingThrow: string,
    saveOutcome: string,
    isProgressive: boolean,
    progressiveStages: array
  },
  utilityConfig: {
    utilityType: string,
    selectedEffects: array,
    enhancementType: string,
    enhancementValue: number,
    duration: number,
    durationUnit: string,
    concentration: boolean,
    power: string
  },
  controlConfig: {
    controlType: string,
    strength: string,
    duration: number,
    durationUnit: string, // REQUIRED: 'instant', 'rounds', 'turns', etc.
    saveDC: number,
    saveType: string,
    savingThrow: boolean,
    effects: [{ // REQUIRED: Array of effect objects
      id: string, // Effect identifier
      name: string, // Display name
      description: string, // Effect description
      config: { // Effect-specific configuration
        // movementType, distance, restraintType, etc.
      }
    }]
  },
  summoningConfig: {
    creatureType: string,
    creatureStrength: string,
    duration: number,
    minions: number,
    controlType: string,
    controlRange: number
  },
  transformationConfig: {
    transformationType: string,
    targetType: string,
    duration: number,
    power: string,
    specialEffects: array
  },
  purificationConfig: {
    purificationType: string,
    targetType: string,
    power: string,
    duration: string | number,
    specialEffects: array
  },
  restorationConfig: {
    resourceType: string,
    resolution: string,
    formula: string,
    isOverTime: boolean,
    overTimeFormula: string,
    overTimeDuration: number,
    tickFrequency: string,
    application: string,
    scalingType: string,
    restorationType: string,
    restoredHealth: number,
    restoredMana: number,
    removesConditions: array,
    castingTime: number,
    castingTimeUnit: string,
    timeLimit: number,
    timeLimitUnit: string,
    penaltyOnRevive: object
  },
  
  // Step 4: Targeting & Propagation
  targetingConfig: {
    targetingType: string,
    rangeType: string,
    rangeDistance: number,
    aoeShape: string,
    aoeParameters: object,
    maxTargets: number,
    targetSelectionMethod: string,
    targetRestrictions: array
  },
  propagation: {
    method: string,
    behavior: string,
    parameters: object
  },
  
  // Step 5: Resources
  resourceCost: {
    resourceTypes: string[],
    resourceValues: object,
    resourceFormulas: object,
    useFormulas: object,
    actionPoints: number,
    components: string[],
    materialComponents: string,
    verbalText: string,
    somaticText: string,
    channelingFrequency: string
  },
  
  // Step 6: Cooldown
  cooldownConfig: {
    type: string,
    value: number,
    charges: number,
    recovery: number
  },
  
  // Step 7: Triggers
  triggerConfig: {
    global: object,
    effectTriggers: object,
    conditionalEffects: object,
    triggerRole: object
  },
  
  // Step 7: Mechanics
  resolution: 'DICE' | 'CARDS' | 'COINS',
  mechanicsConfig: {
    cards: object,
    coins: object,
    combos: object,
    stateRequirements: array
  },
  effectMechanicsConfigs: object,
  cardConfig: object,
  coinConfig: object,
  diceConfig: object,
  
  // Step 8: Channeling
  channelingConfig: {
    type: string,
    baseFormula: string,
    maxFormula: string,
    tickFrequency: string,
    stages: array
  },
  
  // Additional metadata
  tags: string[],
  damageTypes: string[],
  durationConfig: object,
  trapConfig: object
}
```

---

## Additional Wizard Features & Systems

### Rollable Tables

Rollable tables allow spells to have random effects based on dice rolls, card draws, or coin flips.

#### Fields Configured:
- **rollableTable.enabled** (boolean)
- **rollableTable.name** (string) - Table name (e.g., "Wild Magic Surge")
- **rollableTable.description** (string) - Table description
- **rollableTable.resolutionType** (enum: 'DICE', 'CARDS', 'COINS')
- **rollableTable.resolutionConfig** (object):
  - For DICE: `{ diceType: 'd20', diceCount: 1 }`
  - For CARDS: `{ cardCount: 3 }`
  - For COINS: `{ coinCount: 5 }`
- **rollableTable.entries** (array) - Array of table entries

#### Table Entry Structure:
```javascript
{
  id: string,
  range: { min: number, max: number }, // For DICE
  roll: number, // For DICE (single roll value, alternative to range)
  cardPattern: string, // For CARDS (e.g., "Hearts", "Ace of Spades")
  coinPattern: string, // For COINS (e.g., "All Heads", "Majority Tails")
  customName: string, // Entry name
  name: string, // Entry name (alternative to customName)
  effect: string, // **CRITICAL: Detailed description of effect with concrete mechanics**
  description: string, // Alternative to effect field
  modifiesBaseSpell: boolean,
  spellReference: string | null, // Reference to another spell
  effectModifications: object, // Modifications to base spell
  formulaOverrides: object, // Formula overrides
  effectConfig: {
    damageFormula: string,
    damageType: string,
    healingFormula: string,
    creatureType: string,
    quantity: number,
    duration: number,
    controlType: string,
    summonLocation: string,
    buffType: string,
    buffDuration: number,
    creatures: array // For summoning - references creature library
  }
}
```

**⚠️ CRITICAL: Rollable Table Entry Effect Descriptions**

Rollable table entries MUST have detailed, concrete effect descriptions that explain:
- **What happens** (damage amount, healing amount, status effect, etc.)
- **Who it affects** (all targets, enemies only, allies only, etc.)
- **Saving throws** (if applicable: save type, DC, outcome)
- **Duration** (if applicable: rounds, minutes, etc.)
- **Mechanical details** (what "frozen" means, what "difficult terrain" does, etc.)

**BAD Examples:**
- ❌ "4d6 ice damage, freezes targets" - Too vague, what does "freezes" mean?
- ❌ "Blizzard" - No information at all
- ❌ "Provides utility benefits" - Meaningless

**GOOD Examples:**
- ✅ "4d6 cold damage to all targets in area. Targets must make Constitution save DC 15 for half damage. Targets that fail the save are frozen (paralyzed) for 1 round - cannot move or take actions, attacks against them have advantage."
- ✅ "All allies within 40ft radius are healed for 4d8 HP. This healing cannot exceed maximum HP. Allies also gain temporary HP equal to half the healing received (2d8 temp HP)."
- ✅ "4d6 fire damage to all targets in area. Targets must make Agility save DC 15 for half damage. Targets that fail the save are ignited, taking 1d6 fire damage at the start of each of their turns for 3 rounds (Constitution save DC 15 ends early)."

#### SpellCard Display:
- **Location**: Card body, special mechanics section
- **Format**: 
  - Shows table name and description
  - Displays resolution type (e.g., "Roll 1d8" or "Draw 3 Cards")
  - Lists all entries with their ranges/patterns and **detailed effect descriptions**
  - For DICE: Shows "On a roll of X: [Entry Name] - [Detailed Effect Description]"
  - For CARDS: Shows "When drawing [Pattern]: [Entry Name] - [Detailed Effect Description]"
  - For COINS: Shows "When pattern [Pattern]: [Entry Name] - [Detailed Effect Description]"
- **⚠️ CRITICAL**: Each entry's `effect` field must contain detailed, concrete mechanics (see "Rollable Table Entry Effect Descriptions" above)
- **Special Features**:
  - Entries can reference creatures from creature library
  - Entries can modify base spell effects
  - Entries can have their own damage/healing formulas
  - Entries can summon creatures with full configuration
- **⚠️ IMPORTANT**: Spells with rollable tables should NOT have utility components unless the utility is explicitly part of the spell description. If a spell's description only mentions the rollable table (e.g., "Roll 1d8 to determine the chaotic effect"), do NOT include utility in `effectTypes` or `utilityConfig`.

#### Card Patterns (CARDS):
- Suits: 'Hearts', 'Diamonds', 'Clubs', 'Spades'
- Colors: 'Red Cards', 'Black Cards'
- Types: 'Face Cards', 'Number Cards', 'Aces', 'Kings', 'Queens', 'Jacks'
- Specific: 'Ace of Spades', 'King of Hearts', etc.
- Groups: 'Red Face Cards', 'Black Face Cards', 'Odd Numbers', 'Even Numbers'
- Ranges: '2-5 (Low)', '6-9 (Mid)', '10-K (High)', 'Joker'

#### Coin Patterns (COINS):
- Simple: 'All Heads', 'All Tails'
- Majorities: 'Majority Heads (3+)', 'Majority Tails (3+)'
- Exact: 'Exactly 2 Heads', 'Exactly 2 Tails', etc.
- Sequences: 'Alternating Pattern (H-T-H-T)', 'Sequence: H-H-T'
- Mixed: 'Mixed (No Pattern)', 'Any Single Heads', 'Any Single Tails'

---

### Trap Placement Step

For TRAP spell types, a dedicated step configures trap placement and detection.

#### Fields Configured:
- **trapConfig.placementPosition** (object) - `{ x: number, y: number }` - Grid position
- **trapConfig.placementRadius** (number) - Trap size in feet
- **trapConfig.detectionMethod** (enum):
  - 'perception' - Perception Check
  - 'investigation' - Investigation Check
  - 'arcana' - Arcana Check
  - 'detect_magic' - Detect Magic spell
  - 'true_sight' - True Sight
- **trapConfig.disarmMethod** (enum):
  - 'thieves_tools' - Thieves' Tools
  - 'arcana' - Arcana Check
  - 'strength' - Strength Check
  - 'agility' - Agility Check
  - 'dispel_magic' - Dispel Magic
  - 'specific_item' - Specific Item
- **trapConfig.detectionDC** (number) - Difficulty to detect (5-30)
- **trapConfig.disarmDC** (number) - Difficulty to disarm (5-30)
- **trapConfig.visibility** (enum):
  - 'hidden' - Invisible until detected
  - 'visible' - Always visible
  - 'magical' - Shows magical aura
- **trapConfig.trapDuration** (enum):
  - 'permanent' - Until triggered or dispelled
  - 'timed' - Expires after duration
  - 'conditional' - Expires when condition met
- **trapConfig.durationValue** (number) - Duration amount (if timed)
- **trapConfig.durationUnit** (enum: 'turns', 'rounds', 'minutes', 'hours', 'days')
- **trapConfig.conditionType** (enum) - For conditional duration:
  - 'combat_end' - When combat ends
  - 'dawn' - Next dawn
  - 'dusk' - Next dusk
  - 'short_rest' - After short rest
  - 'long_rest' - After long rest
  - 'area_cleared' - Area cleared of enemies
  - 'caster_leaves' - Caster leaves area
- **trapConfig.maxTriggers** (number) - Maximum times trap can trigger (1-100)
- **trapConfig.resetTime** (number) - Time before trap can trigger again in seconds (0 = no reset)

#### SpellCard Display:
- **Location**: Card body, trap-specific section
- **Format**: 
  - "Trap Size: X ft radius"
  - "Detection: [Method] (DC X)"
  - "Disarm: [Method] (DC X)"
  - "Visibility: [Type]"
  - "Duration: [Type and details]"
  - "Triggers: [Single-use / X uses]"
  - Shows placement visualization if configured

---

### Creature Library Integration

The spell wizard integrates with the creature library for summoning and transformation effects.

#### Use Cases:

1. **Summoning Effects** (`Step3Effects` → `SummoningEffects`):
   - Can select multiple creatures from creature library
   - Each creature has individual configuration:
     - **quantity** (number) - How many to summon
     - **duration** (number) - Duration value
     - **durationUnit** (enum: 'rounds', 'minutes', 'hours')
     - **hasDuration** (boolean)
     - **concentration** (boolean) - Requires concentration
     - **controlType** (enum):
       - 'verbal' - Verbal Commands
       - 'mental' - Mental Link
       - 'empathic' - Empathic Bond
       - 'autonomous' - Autonomous behavior
     - **controlRange** (number) - Control range in feet (0 = unlimited)
   - Creature data includes: name, description, stats, tokenIcon, size, type

2. **Transformation Effects** (`Step3Effects` → `TransformationEffects`):
   - Can transform into creatures from library
   - Transformation preserves creature stats and abilities
   - Can configure transformation duration and limitations

3. **Rollable Table Entries** (`RollableTableStep` → `TableEntryEditor`):
   - Table entries can summon creatures
   - Uses `effectConfig.creatures` array with creature references

#### SpellCard Display:
- **Location**: Card body, effects section
- **Format**:
  - For summoning: Lists creature names, quantities, and control details
  - "Summons: [Quantity]x [Creature Name]"
  - Shows duration and control type
  - Displays creature stats if available
  - For transformations: Shows creature form name and capabilities

---

### Effect-Specific Targeting (Split Targeting)

Allows different effect types to target different entities with separate targeting configurations.

#### Fields Configured:
- **targetingMode** (enum):
  - 'unified' - All effects use same targeting (default)
  - 'effect' - Each effect type has separate targeting configuration
- **effectTargeting** (object) - **REQUIRED** when `targetingMode === 'effect'`: Map of effect type to full targeting config:
  ```javascript
  {
    damage: {
      targetingType: 'ground',
      rangeType: 'ranged',
      rangeDistance: 60,
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      targetRestrictions: ['enemy']
    },
    healing: {
      targetingType: 'ground',
      rangeType: 'ranged',
      rangeDistance: 60,
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      targetRestrictions: ['ally']
    },
    control: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 30,
      aoeShape: 'cone',
      aoeParameters: { length: 20 },
      targetRestrictions: ['enemy']
    }
  }
  ```

**Example - Life Leech (Deathcaller):**
  ```javascript
  targetingMode: 'effect',
  effectTargeting: {
    damage: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 40,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      targetSelectionMethod: 'manual',
      requiresLineOfSight: true,
      propagationMethod: 'chain',
      propagationBehavior: 'lowest_health'
    },
    healing: {
      targetingType: 'self'
    }
  }
  ```

**⚠️ CRITICAL - Effect-Specific Targeting Structure:**

Each effect type in `effectTargeting` must have a **complete targeting configuration** with:
- `targetingType` - 'single', 'area', 'ground', 'cone', 'line', 'self', etc.
- `rangeType` - 'touch', 'ranged', 'sight', 'unlimited', 'self_centered'
- `rangeDistance` - Number (for ranged)
- `aoeShape` - 'circle', 'square', 'cone', 'line', etc. (for area effects)
- `aoeParameters` - Object with shape-specific parameters (e.g., `{ radius: 30 }`, `{ length: 20 }`)
- `targetRestrictions` - Array of restrictions: `['enemy']`, `['ally']`, `['self']`, `['enemy', 'ally']`, etc.

**⚠️ AVOID REDUNDANCY**: When `targetingType: 'self'`, do NOT include `targetRestrictions: ['self']` or `rangeType: 'self'` - this creates redundant "self" references that can cause issues. Self-targeting only needs `targetingType: 'self'`.

**Note**: The wizard also uses `targetingTags` internally with `targetOption` ('target', 'self', 'both'), but the final spell structure uses `effectTargeting` with full targeting configs. The mapping function converts `targetingTags` to `effectTargeting` when saving.

#### SpellCard Display:
- **Location**: 
  - Header: Shows "Varies" for range when using effect-specific targeting
  - Individual effects: Each effect shows its own targeting badges (range, targeting type, restrictions)
- **Format**: 
  - If unified: Standard targeting display in header
  - If effect-specific: 
    - Header shows "Varies" for range
    - Each effect displays its own targeting badges:
      - Range badge (e.g., "60 ft")
      - Targeting type badge (e.g., "Area Effect", "Circle 30ft radius")
      - Restrictions badge (e.g., "Enemies", "Allies")
- **Example Display**:
  ```
  Range: Varies
  
  Instant Damage
  3d6 Cold Damage
  [60 ft] [Area Effect] [Circle 30ft radius] [Enemies]
  
  Healing
  4d8 Healing
  [60 ft] [Area Effect] [Circle 30ft radius] [Allies]
  
  Control Effect
  Frozen (DC 15 Constitution save)
  [60 ft] [Area Effect] [Circle 30ft radius] [Enemies]
  ```

---

### Proc Effects System

Proc effects are chance-based additional effects that trigger on specific conditions.

#### Fields Configured:
- **procConfig.enabled** (boolean)
- **procConfig.triggers** (array) - Array of trigger IDs:
  - 'critical_strike' - On critical hits
  - 'on_hit' - On successful hit
  - 'on_damage' - When dealing damage
  - 'on_heal' - When healing
  - 'periodic' - At regular intervals
  - 'on_cast' - When casting spell
  - 'on_dodge' - When dodging
  - 'on_block' - When blocking
  - 'on_kill' - When killing enemy
  - 'on_crit_received' - When receiving critical hit
  - And more (see `procSystem.js`)
- **procConfig.effects** (array) - Array of proc effects:
  ```javascript
  {
    type: 'damage_proc' | 'healing_proc' | 'buff_proc' | 'debuff_proc' | 
          'control_proc' | 'summon_proc' | 'area_effect_proc' | 'chain_effect_proc',
    description: string,
    // Type-specific config (damageType, healingAmount, buffType, etc.)
  }
  ```
- **procConfig.chanceType** (enum):
  - 'percentage_chance' - Flat percentage (0-100)
  - 'procs_per_minute' - PPM rate
  - 'guaranteed' - Always triggers
  - 'stacking_chance' - Increasing chance until success
  - 'conditional' - Based on conditions
- **procConfig.chanceValue** (number) - Chance value based on type

#### SpellCard Display:
- **Location**: Card body, special effects section
- **Format**:
  - "[Chance]% chance on [Trigger]: [Effect Description]"
  - Example: "15% chance on Critical Strike: Deals additional 40% fire damage"
  - Multiple procs shown as separate lines

---

### Mechanics Systems

Advanced mechanics that modify spell behavior based on character state or game systems.

#### Available Systems:

1. **Combo Points** (`COMBO_POINTS`):
   - Builders generate combo points
   - Spenders consume combo points for increased effect
   - Max points: 5
   - Thresholds: 1, 3, 5

2. **Proc System** (`PROC_SYSTEM`):
   - Chance-based procs
   - Configurable proc types and effects

3. **State Requirements** (`STATE_REQUIREMENTS`):
   - Health thresholds (below/above X%)
   - Resource thresholds (mana, health, etc.)
   - Combat state requirements

4. **Form System** (`FORM_SYSTEM`):
   - Requires specific form (bear, cat, tree, etc.)
   - Grants bonuses when in form
   - Can require form to use spell

5. **Toxic System** (`TOXIC_SYSTEM`):
   - Applies toxins/diseases
   - Consumes toxins for enhanced effects
   - 12 toxic types: disease, poison, curse, venom, blight, acid, necrosis, miasma, parasites, radiation, corruption, contagion
   - Max toxic points: 8
   - Thresholds: 2, 4, 6, 8

6. **Chord System** (`CHORD_SYSTEM`):
   - Music theory-based system
   - Chord functions: tonic, supertonic, mediant, subdominant, dominant, submediant, leading_tone
   - Recipes: Required chord sequence (e.g., "tonic-mediant-dominant")
   - Graduated effects for partial matches
   - Wildcard notes
   - Extender notes (extend improvisation window)
   - Max points: 8
   - Thresholds: 3, 5, 8

#### Fields Configured:

**Global Mechanics Config:**
- `mechanicsConfig.cards` (object) - Card-based resolution mechanics
- `mechanicsConfig.coins` (object) - Coin-based resolution mechanics
- `mechanicsConfig.combos` (object) - Combo system mechanics
- `mechanicsConfig.stateRequirements[]` (array) - Array of state requirement objects
- `mechanicsConfig.stateOptions.thresholds[]` (array) - Threshold configurations

**Per-Effect Mechanics Config:**
- `effectMechanicsConfigs[effectId]` (object) - Mechanics configuration for specific effect:
  ```javascript
  {
    enabled: boolean,
    system: 'COMBO_POINTS' | 'PROC_SYSTEM' | 'STATE_REQUIREMENTS' | 
            'FORM_SYSTEM' | 'TOXIC_SYSTEM' | 'CHORD_SYSTEM',
    type: string, // System-specific type
    thresholdValue: number,
    
    // Combo Points System
    comboOptions: {
      generationMethod: string, // How combo points are generated
      consumptionRule: 'all' | 'partial', // How combo points are consumed
      visualStyle: 'points' | 'bars' // Visual representation
    },
    
    // Proc System
    procOptions: {
      procChance: number, // Percentage chance (0-100)
      triggerLimit: number, // Maximum triggers per encounter
      spellId: string | null, // Reference to spell from library
      procType: string // Type of proc trigger
    },
    
    // State Requirements System
    stateOptions: {
      resourceType: string, // Resource to check (health, mana, etc.)
      thresholdValue: number, // Threshold value
      thresholdType: 'above' | 'below' | 'equal', // Comparison type
      modifiedFormula: string // Formula when threshold is met
    },
    
    // Form System
    formOptions: {
      formType: string, // Form type (bear_form, cat_form, etc.)
      requiresForm: boolean, // Whether form is required to cast
      bonusType: string, // Type of bonus when in form
      bonusAmount: number, // Bonus amount
      formSpellId: string | null // Reference to form spell
    },
    
    // Toxic System
    toxicOptions: {
      selectedToxicTypes: object, // Map of toxic type to count
      duration: number, // Duration of toxic effect
      durationType: 'rounds' | 'minutes' | 'hours', // Duration unit
      consumptionRule: 'all' | 'specific', // How toxins are consumed
      modifiedFormula: string, // Formula when consuming toxins
      toxicEffects: object // Effects per toxic type
    },
    
    // Chord System
    chordOptions: {
      chordFunction: string, // For note spells (tonic, mediant, etc.)
      isWildcard: boolean, // Whether note is a wildcard
      extendDuration: number, // Extend improvisation window (for extenders)
      recipe: string, // For chord spells (e.g., "tonic-mediant-dominant")
      improvisationWindow: number, // Time window for playing notes
      graduatedEffects: object, // Effects for partial matches
      requiredFunctions: object, // Specific functions for partial resolution
      partialMatchType: 'count' | 'specific' // How partial matches are resolved
    }
  }
  ```

#### SpellCard Display:
- **Location**: Card body, mechanics section
- **Format**:
  - **Combo Points**: 
    - Builder: "Generates X combo points"
    - Spender: "Consumes all combo points for X% increased effect" or "Consumes X combo points for enhanced effect"
  - **Proc System**: 
    - "[Chance]% chance on [Trigger]: [Effect Description]"
    - If spell reference: "Triggers spell: [Spell Name]"
  - **State Requirements**: 
    - "When [Resource] is [above/below] [Threshold]%: [Modified Formula]"
    - "Requires: [Condition]"
  - **Form System**: 
    - "Requires [Form]" (if `requiresForm === true`)
    - "Grants +[Bonus] [BonusType] when in [Form]" (if bonus configured)
  - **Toxic System**: 
    - Applier: "Applies [Toxic Types] for [Duration]"
    - Consumer: "Consumes [Toxic Types] for enhanced effect: [Modified Formula]"
  - **Chord System**: 
    - Note: "Plays [Chord Function] note" (e.g., "Plays Tonic note")
    - Wildcard: "Plays Wildcard note (any function)"
    - Extender: "Extends improvisation window by [Duration]"
    - Chord: "Requires recipe: [Recipe]" (e.g., "Requires recipe: tonic-mediant-dominant")
    - Partial matches: "Partial match (X/Y): [Effect]"

---

### Utility Effect Subtypes

Utility effects have extensive subtypes across 8 main categories with detailed parameters.

#### Main Utility Categories:

1. **Movement** (`movement`):
   - `teleport` - Instant movement (distance, needsLineOfSight, takesOthers)
   - `flight` - Flight ability (flightSpeed, maxAltitude, flightType)
   - `speed` - Speed boost (speedMultiplier, duration)
   - `phasing` - Phase through objects (phasingDuration, canAttack)
   - `wallWalking` - Walk on walls (duration, climbSpeed)

2. **Control** (`control`):
   - `pull` - Pull targets (pullDistance, allowSave)
   - `push` - Push targets (pushDistance, allowSave)
   - `barrier` - Create barriers (barrierType, barrierSize, barrierMaterial, barrierHP)
   - `gravity` - Gravity manipulation (gravityMultiplier, affectedArea)

3. **Environment** (`environment`):
   - `terrain` - Modify terrain (terrainType, areaShape, areaSize)
   - `hazard` - Create hazards (hazardType, areaShape, hazardDamage)
   - `light` - Light/darkness (lightType, intensity, radius)
   - `weather` - Weather effects (weatherType, intensity, radius)

4. **Illusion** (`illusion`):
   - `visual` - Visual illusions (illusionType, complexity, size)
   - `sound` - Sound illusions (soundType, volume, complexity)
   - `complex` - Complex illusions (sensesCovered, interactive)
   - `disguise` - Disguise/mimicry (disguiseType, quality, detectDC)

5. **Transformation** (`transformation`):
   - `animal` - Animal form (animalType, size, abilities)
   - `element` - Elemental form (elementType, transformPercent)
   - `size` - Size alteration (sizeMultiplier, statChanges)
   - `object` - Object transformation (objectType, size, awareness)
   - `phaseshift` - Phase shift (phaseType, corporeality)

6. **Divination** (`divination`):
   - `detection` - Detect entities (detectionType, range, detail)
   - `scrying` - View distant locations (scryRange, accuracy)
   - `identification` - Identify objects (idComplexity, revealCurses)
   - `prediction` - Predict future (predictionRange, accuracy)
   - `truesight` - True sight (truesightRange, planarVision)

7. **Conjuration** (`conjuration`):
   - `creature` - Summon creatures (creatureType, creatureLevel, duration)
   - `object` - Conjure objects (objectType, objectSize, permanence)
   - `element` - Elemental materials (elementType, quantity)
   - `portal` - Portal creation (portalRange, size, stability)

8. **Enchantment** (`enchantment`):
   - `weapon` - Weapon enchantment (enchantmentType, power, duration)
   - `armor` - Armor enchantment (enchantmentType, power)
   - `item` - Item enchantment (enchantmentType, charges)
   - `sentience` - Grant sentience (intelligence, personality)

#### SpellCard Display:
- **Location**: Card body, effects section
- **Format**: 
  - Shows utility subtype name and description
  - Lists key parameters (range, duration, area, etc.)
  - Example: "Teleport: Instantly move up to 30 feet without requiring line of sight"
  - For transformations: Shows form details and capabilities
  - For conjurations: Shows what is created and properties

---

### Graduated Recipe Effects

For mechanics that use recipes (like Chord System), spells can have graduated effects based on partial recipe matches.

#### Fields Configured:
- **graduatedEffects** (object) - Map of match level to effect:
  ```javascript
  {
    'partial_1': { // 1 function match
      effect: 'description',
      formulaModifier: '+1d4',
      bonusEffect: 'object'
    },
    'partial_2': { // 2 function matches
      effect: 'description',
      formulaModifier: '+2d6',
      bonusEffect: 'object'
    },
    'full': { // Complete recipe match
      effect: 'description',
      formulaModifier: '+4d8',
      bonusEffect: 'object'
    }
  }
  ```

#### SpellCard Display:
- **Location**: Card body, mechanics section
- **Format**: 
  - "Recipe: [Required sequence]"
  - "Partial match (1/3): [Effect]"
  - "Partial match (2/3): [Effect]"
  - "Full match: [Effect]"

---

### Critical Hit Configuration

Detailed critical hit configuration system for damage effects.

**Configuration Location**: `damageConfig.criticalConfig`

**Capabilities**:
- Configure critical mechanics using dice (d20), cards, or coins
- Apply damage multipliers (1-10x)
- Add extra dice on crit
- Enable exploding dice mechanics
- Apply additional effects (knockback, stun, burning, shock, freeze, disarm)
- Reference other spells from library
- Use rollable tables for randomized crit effects
- Option for effect-only crits (no damage bonus)

#### Fields Configured:
- **criticalConfig.enabled** (boolean)
- **criticalConfig.critOnlyEffect** (boolean) - Effect-only crits (no damage bonus)
- **criticalConfig.critType** (enum: 'dice', 'cards', 'coins')

#### Dice-Based Critical Hits:
- **criticalConfig.critMultiplier** (number) - Multiplier for crit damage (1-10, default 2)
- **criticalConfig.critDiceOnly** (boolean) - Multiply only dice, not modifiers
- **criticalConfig.extraDice** (string) - Extra dice on crit (e.g., "2d6")
- **criticalConfig.explodingDice** (boolean) - Enable exploding dice
- **criticalConfig.explodingDiceType** (enum):
  - 'reroll_add' - Reroll max values and add
  - 'double_value' - Double max values
  - 'add_max' - Add maximum value again

#### Card-Based Critical Hits:
- **criticalConfig.cardCritRule** (enum):
  - 'face_cards' - Face Cards (J, Q, K)
  - 'aces' - Aces
  - 'specific_suit' - Specific Suit
  - 'red_cards' - Red Cards
  - 'black_cards' - Black Cards
  - 'pairs' - Pairs
- **criticalConfig.critSuit** (enum: 'hearts', 'diamonds', 'clubs', 'spades') - For specific_suit
- **criticalConfig.cardCritResolution** (enum):
  - 'draw_add' - Draw additional cards and add values
  - 'multiply_value' - Multiply card values
  - 'double_damage' - Double final damage
- **criticalConfig.extraCardDraw** (number) - Extra cards to draw (1-10)

#### Coin-Based Critical Hits:
- **criticalConfig.coinCritRule** (enum):
  - 'all_heads' - All Heads
  - 'all_tails' - All Tails
  - 'sequence' - Specific Sequence
  - 'majority' - Majority (more than half)
- **criticalConfig.coinCount** (number) - Number of coins (1-10)
- **criticalConfig.coinCritResolution** (enum):
  - 'flip_add' - Flip additional coins and add values
  - 'multiply_value' - Multiply coin values
  - 'double_damage' - Double final damage
- **criticalConfig.extraCoinFlips** (number) - Extra coins to flip (1-10)

#### Critical Hit Effects:
- **criticalConfig.spellEffect** (string | null) - Reference to spell from library
- **criticalConfig.useRollableTable** (boolean) - Use rollable table for crit effects
- **criticalConfig.critEffects** (array) - Additional effects:
  - 'knockback' - Target pushed back 10 feet
  - 'stun' - Target stunned for 1 round
  - 'burning' - Target burns for 1d4 damage per round for 2 rounds
  - 'shock' - Target shocked, reducing action economy
  - 'freeze' - Target slowed by 50% for 1 round
  - 'disarm' - Target drops their weapon
  - 'life_drain' - Life drain effect (requires `lifeDrainConfig` for details)

**Life Drain Effect Configuration:**
- **criticalConfig.lifeDrainConfig** (object, optional) - Configuration for life drain effect:
  - `percentage` (number) - Percentage of critical damage restored as healing (e.g., 50 = 50% of crit damage)
  - `formula` (string) - Alternative formula for life drain (e.g., "critDamage / 2")
- **Display Format**: 
  - With percentage: "Life Drain (restores 50% of critical damage)"
  - With formula: "Life Drain (restores critDamage / 2 of critical damage)"
- **⚠️ IMPORTANT**: When using 'life_drain' in `critEffects`, always configure `lifeDrainConfig` to specify how much damage is restored

#### SpellCard Display:
- **Location**: Card body, damage section
- **Format**: 
  - "Critical Hit: [Details]"
  - Dice: "Max roll: [Multiplier]× damage [extra dice] [exploding details] + [Effects]"
  - Cards: "On [Rule]: [Resolution method] + [Effects]"
  - Coins: "On [Rule] with [Count] coins: [Resolution method] + [Effects]"
  - Effects: Lists additional effects with details (e.g., "Life Drain (restores 50% of critical damage)")
  - If using spell reference: "Triggers spell: [Spell Name]"
  - If using rollable table: "Uses rollable table: [Table Name]"
- **⚠️ IMPORTANT**: The `mechanicsText` field for Critical Hit effects is empty - all information is displayed in the `description` field. Do NOT add "Enhanced damage on critical" or similar text to `mechanicsText`.

---

### Chance On Hit Configuration

Chance-based additional effects that trigger when spell hits target.

**Configuration Location**: `damageConfig.chanceOnHitConfig` or `healingConfig.chanceOnHitConfig`

**Capabilities**:
- Configure chance mechanics using dice (d20), cards, or coins
- Apply custom effects (stun, burning, slow, knockback, shock, disarm)
- Reference other spells from library
- Use rollable tables for randomized effects
- Only applies to instant damage/healing (not DoT or area effects)

#### Fields Configured:
- **chanceOnHitConfig.enabled** (boolean)
- **chanceOnHitConfig.procType** (enum: 'dice', 'cards', 'coins')

#### Dice-Based Chance On Hit:
- **chanceOnHitConfig.diceThreshold** (number) - Threshold on d20 (1-20, default 18)
- **chanceOnHitConfig.procChance** (number) - Auto-calculated percentage based on threshold

#### Card-Based Chance On Hit:
- **chanceOnHitConfig.cardProcRule** (enum):
  - 'face_cards' - Face Cards (J, Q, K) (~23%)
  - 'aces' - Aces (~8%)
  - 'specific_suit' - Specific Suit (25%)
  - 'red_cards' - Red Cards (50%)
  - 'black_cards' - Black Cards (50%)
  - 'pairs' - Pairs (~6%)
- **chanceOnHitConfig.procSuit** (enum: 'hearts', 'diamonds', 'clubs', 'spades') - For specific_suit

#### Coin-Based Chance On Hit:
- **chanceOnHitConfig.coinProcRule** (enum):
  - 'all_heads' - All Heads
  - 'all_tails' - All Tails
  - 'sequence' - Specific Sequence
  - 'majority' - Majority (more than half)
- **chanceOnHitConfig.coinCount** (number) - Number of coins (1-10)
- **chanceOnHitConfig.procChance** (number) - Percentage chance (calculated from coin count)

#### Chance On Hit Effects:
- **chanceOnHitConfig.spellEffect** (string | null) - Reference to spell from library
- **chanceOnHitConfig.useRollableTable** (boolean) - Use rollable table for proc effects
- **chanceOnHitConfig.customEffects** (array) - Additional effects:
  - 'burning' - Target burns for fire damage over time
  - 'stun' - Target stunned (cannot take actions or reactions)
  - 'slow' - Target slowed (reduced movement speed)
  - 'knockback' - Target pushed back
  - 'shock' - Target shocked (reduces action economy)
  - 'freeze' - Target frozen (reduced movement speed)
  - 'disarm' - Target drops their weapon
  - 'fear' - Target frightened (reduced effectiveness, may flee)

**⚠️ CRITICAL - Custom Effect Configuration:**

When using custom effects, you **MUST** provide detailed configuration so players understand what the effect does. The spell card will automatically format effects with detailed descriptions:

**Burning Effect:**
- **chanceOnHitConfig.burningConfig** (object, optional):
  - `damagePerRound` (string) - Damage formula per round (default: '1d6')
  - `duration` (number) - Duration in rounds (default: 2)
  - `durationUnit` (string) - Duration unit (default: 'rounds')
  - `saveDC` (number) - Save DC to end early (optional)
  - `saveType` (string) - Save type (default: 'constitution')
- **Display Format**: "Burning (1d6 fire damage per round for 2 rounds, DC 15 Constitution save ends early)"

**Stun Effect:**
- **chanceOnHitConfig.stunConfig** (object, optional):
  - `duration` (number) - Duration in rounds (default: 1)
  - `durationUnit` (string) - Duration unit (default: 'round')
  - `saveDC` (number) - Save DC to negate (optional)
  - `saveType` (string) - Save type (default: 'constitution')
- **Display Format**: "Stun (cannot take actions or reactions for 1 round, DC 14 Constitution save negates)"

**Slow Effect:**
- **chanceOnHitConfig.slowConfig** (object, optional):
  - `speedReduction` (number) - Speed reduction amount (default: 30)
  - `speedReductionType` (enum: 'flat', 'percentage') - Whether reduction is flat (feet) or percentage (default: 'percentage')
  - `duration` (number) - Duration in rounds (default: 2)
  - `durationUnit` (string) - Duration unit (default: 'rounds')
  - `saveDC` (number) - Save DC (optional)
  - `saveType` (string) - Save type (default: 'constitution')
- **Display Format**: 
  - Flat: "Slow (15 feet speed reduction, 2 rounds, DC 14 Constitution save)"
  - Percentage: "Slow (30% speed reduction, 2 rounds, DC 14 Constitution save)"
- **⚠️ IMPORTANT**: Use `speedReductionType: 'flat'` for flat speed reduction in feet (e.g., "15 feet speed reduction"), or `speedReductionType: 'percentage'` for percentage-based reduction (e.g., "30% speed reduction")

**Knockback Effect:**
- **chanceOnHitConfig.knockbackConfig** (object, optional):
  - `distance` (number) - Push distance in feet (default: 10)
- **Display Format**: "Knockback (pushed back 10 feet)"

**Shock Effect:**
- **chanceOnHitConfig.shockConfig** (object, optional):
  - `duration` (number) - Duration in rounds (default: 1)
  - `durationUnit` (string) - Duration unit (default: 'round')
- **Display Format**: "Shock (reduces action economy for 1 round)"

**Freeze Effect:**
- **chanceOnHitConfig.freezeConfig** (object, optional):
  - `speedReduction` (number) - Speed reduction percentage (default: 50)
  - `duration` (number) - Duration in rounds (default: 1)
  - `durationUnit` (string) - Duration unit (default: 'round')
  - `saveDC` (number) - Save DC to negate (optional)
  - `saveType` (string) - Save type (default: 'constitution')
- **Display Format**: "Freeze (50% speed reduction for 1 round, DC 14 Constitution save negates)"

**Disarm Effect:**
- No additional config needed
- **Display Format**: "Disarm (target drops their weapon)"

**Fear Effect:**
- **chanceOnHitConfig.fearConfig** (object, optional):
  - `duration` (number) - Duration in rounds (default: 2)
  - `durationUnit` (string) - Duration unit (default: 'rounds')
  - `saveDC` (number) - Save DC to negate (optional)
  - `saveType` (string) - Save type (default: 'spirit')
- **Display Format**: "Fear (target is frightened for 2 rounds, DC 15 Spirit save negates)"

**⚠️ IMPORTANT**: If you don't provide effect-specific configs, the system will use sensible defaults. However, for clarity and proper gameplay, always configure:
- Damage amounts for burning
- Duration for all timed effects
- Save DCs and types when applicable
- Distance for knockback effects

#### SpellCard Display:
- **Location**: Integrated into Instant Damage mechanics text (not shown as separate effect)
- **Format**: 
  - For instant damage: "{damageFormula} • {chanceInfo}"
  - **Dice-based**: "{damageFormula} • Roll d20: {Threshold}+ ({Chance}%) {EffectWithDetails}"
    - Example: "3d6 + Intelligence Fire Damage • Roll d20: 18+ (15%) Burning (1d6 fire damage per round for 2 rounds)"
    - Example: "2d8 + Strength Bludgeoning Damage • Roll d20: 18+ (15%) Stun (cannot take actions or reactions for 1 round)"
  - **Card-based**: "{damageFormula} • Draw card: {Rule} ({Chance}) {EffectWithDetails}"
    - Example: "3d6 + Intelligence Fire Damage • Draw card: Face Cards (J,Q,K) (23%) Burning (1d6 fire damage per round for 2 rounds)"
  - **Coin-based**: "{damageFormula} • Flip {Count} coins: {Rule} ({Chance}) {EffectWithDetails}"
    - Example: "3d6 + Intelligence Fire Damage • Flip 3 coins: All Heads (12.5%) Knockback (pushed back 10 feet)"
  - **Spell reference**: "{damageFormula} • Roll d20: {Threshold}+ ({Chance}%) casts {Spell Name}"
  - **Rollable table**: "{damageFormula} • Roll d20: {Threshold}+ ({Chance}%) triggers rollable table"
- **⚠️ CRITICAL - Effect Details**: Custom effects are automatically formatted with detailed descriptions:
  - **Burning**: Shows damage per round, duration, and save info if configured
  - **Stun**: Shows duration and what it prevents (actions/reactions)
  - **Slow**: Shows speed reduction (flat in feet or percentage), duration, and save info
  - **Knockback**: Shows push distance
  - **Shock**: Shows duration and effect description
  - **Freeze**: Shows speed reduction, duration, and save info
  - **Disarm**: Shows what happens (target drops weapon)
  - **Fear**: Shows duration and save info
- **Note**: 
  - Chance on hit is appended to the instant damage mechanics text with a bullet separator (•), not shown as a separate "Chance Effect" entry
  - **Always configure effect details** - Don't just use the effect name, provide configs so players understand what happens
  - Only applies to instant damage (not DoT or area damage)

---

### Saving Throw Configuration

Allows targets to make saving throws to reduce or negate spell effects.

**Configuration Location**: `damageConfig.savingThrowConfig`, `debuffConfig`, `controlConfig`, or top-level `savingThrowConfig`

**Capabilities**:
- Configure saving throw type (Strength, Agility, Constitution, Intelligence, Spirit, Charisma)
- Set difficulty class (DC 5-30)
- Configure save outcomes (negate, halves, partial effect with formula)
- Apply to damage, debuff, control, or status effects
- Partial effects allow reduced damage/effect on successful save

#### Fields Configured:
- **savingThrow.enabled** (boolean)
- **savingThrow.savingThrowType** (enum):
  - 'strength' - Strength
  - 'agility' - Agility
  - 'constitution' - Constitution
  - 'intelligence' - Intelligence
  - 'spirit' - Spirit
  - 'charisma' - Charisma
- **savingThrow.difficultyClass** (number) - DC (5-30, default 15)
- **savingThrow.partialEffect** (boolean) - Enable partial effect on successful save
- **savingThrow.partialEffectFormula** (string) - Formula for reduced effect on save:
  - Examples: 'damage/2', 'damage/4', '0', 'MAX(damage/2, 1)'
- **savingThrow.saveOutcome** (enum):
  - 'negates' - Negates the effect completely
  - 'halves' - Halves the damage/effect
  - 'none' - No effect on save

#### SpellCard Display:
- **Location**: Card body, effects section (shown as separate effect entry)
- **Format**: 
  - **Name**: "Saving Throw"
  - **Description**: "{SaveType} save DC {DC}"
    - Example: "Constitution save DC 14"
  - **Mechanics Text**: "{Outcome}"
    - Examples: "negate", "halves", "ends next turn on save"
    - For partial effects: Shows the formula (e.g., "damage/2 on save")
- **Example Display**:
  ```
  Saving Throw - Constitution save DC 14
  negate
  ```
- **Note**: Saving throws are shown as a separate effect entry, not integrated into damage mechanics text

---

### Damage Over Time (DoT) Configuration

Damage that applies over multiple rounds/turns.

#### Fields Configured:
- **damageConfig.hasDotEffect** (boolean) - Enable DoT
- **damageConfig.dotConfig.duration** (number) - Duration in rounds/turns
- **damageConfig.dotConfig.tickFrequency** (enum: 'round', 'turn')
- **damageConfig.dotConfig.dotFormula** (string) - DoT damage formula (DICE)
- **damageConfig.dotConfig.cardConfig** (object) - Card-based DoT:
  - `drawCount` (number) - Cards drawn for DoT
  - `formula` (string) - Card-based DoT formula
- **damageConfig.dotConfig.coinConfig** (object) - Coin-based DoT:
  - `flipCount` (number) - Coins flipped for DoT
  - `formula` (string) - Coin-based DoT formula
- **damageConfig.dotConfig.isProgressiveDot** (boolean) - Enable progressive DoT
- **damageConfig.dotConfig.progressiveStages** (array) - Array of stage configs:
  ```javascript
  {
    turn: number, // Which turn this applies to
    formula: string, // Formula for this stage
    description: string // Description of stage
  }
  ```

#### SpellCard Display:
- **Location**: Card body, damage section
- **Format**: 
  - "Damage Over Time: [Formula] per [Tick Frequency] for [Duration] [Duration Type]"
  - Example: "Damage Over Time: 1d4 + Intelligence/2 fire damage per round for 3 rounds"
  - If progressive: Lists each stage with its formula
  - Example: "Turn 1: 1d4, Turn 2: 2d4, Turn 3: 3d4"

---

## Key Formatting Functions Reference

### UnifiedSpellCard Formatting Functions:

**Core Formatting Functions:**
1. **formatCastTime()** - Cast time display (handles IMMEDIATE, START_OF_TURN, END_OF_TURN, CHANNELED, REACTION, PASSIVE, etc.)
2. **formatRange()** - Range and targeting display (handles touch, ranged, sight, unlimited, self_centered, effect-specific targeting)
3. **formatAoeShape()** - AOE shape formatting (circle, square, rectangle, line, cone, cylinder, sphere, wall)
4. **formatEffectTargeting()** - Effect-specific targeting display (for split targeting mode)
5. **formatTargetingType()** - Targeting type description (single, multi, area, ground, cone, line, chain, self)
6. **formatPropagation()** - Propagation effect description (chain, bounce, seeking, explosion, spreading, forking)
7. **formatDuration()** - Duration display (instant, rounds, turns, minutes, hours, permanent, concentration)
8. **formatCooldown()** - Cooldown display (turn_based, short_rest, long_rest, charge_based, dice_based)
9. **formatResourceCosts()** - Resource cost badges (handles all resource types including class-specific)
10. **formatSpellComponents()** - Spell components display (V, S, M with custom text)
11. **formatMaterialComponentsText()** - Material components text formatting

**Effect Formatting Functions:**
12. **formatDamage()** - Damage effect text (instant, DoT, area, with all resolution types)
13. **formatHealing()** - Healing effect text (direct, HoT, shield, with all resolution types)
14. **formatBuffEffects()** - Buff effects display (stat enhancements, status effects, temporary HP, progressive)
15. **formatDebuffEffects()** - Debuff effects display (stat reductions, status effects, progressive)
16. **formatStatusEffectDetails()** - Detailed status effect formatting with all configurations
17. **formatCriticalHit()** - Critical hit display (dice, cards, coins, with effects and life drain)
18. **formatChanceOnHit()** - Chance on hit display (integrated into damage text)
19. **formatSavingThrow()** - Saving throw display (for damage, debuff, control effects)

**Mechanics Formatting Functions:**
20. **formatMechanics()** - Mechanics display (combo points, proc system, state requirements, form system, toxic system, chord system)
21. **formatGraduatedEffects()** - Graduated recipe effects (toxic system, chord system)
22. **processMechanicConfig()** - Process individual mechanic configurations

**Helper Functions:**
23. **cleanFormula()** - Formula cleaning (handles resource variables, camelCase, underscores)
24. **enhanceFormulaDisplay()** - Formula enhancement with damage type context
25. **formatFormulaToPlainEnglish()** - Converts technical formulas to readable text (from SpellCardUtils)
26. **getSpellTags()** - Tag extraction and filtering
27. **getDamageTypes()** - Damage type extraction (handles multiple types, normalization)
28. **getDamageTypeSuffix()** - Damage type suffix formatting ("Fire Damage", "Cold and Lightning Damage")
29. **formatResourceName()** - Resource name formatting (handles all class-specific resources)
30. **getResourceIcon()** - Resource icon retrieval
31. **getResourceColor()** - Resource color retrieval
32. **formatComponentName()** - Component name formatting (hyphenated to title case)
33. **formatTriggerText()** - Basic trigger text formatting (converts trigger objects to readable text, used for required conditions)
34. **formatTriggerForConditionalDisplay()** - Intuitive conditional trigger formatting (converts triggers to "If..." format, makes health thresholds concrete)
35. **formatTriggerId()** - Trigger ID formatting
36. **normalizeSaveType()** - Save type normalization (maps D&D names to system names)
37. **getEnhancedStatName()** - Enhanced stat name formatting with magnitude
38. **getStatType()** - Stat type determination
39. **getThematicResistanceDescription()** - Thematic resistance descriptions (vampiric, draining, siphoning, etc.)
40. **getInfernoStageName()** - Inferno stage name formatting (for Pyrofiend)
41. **getInfernoStageNameWithSuffix()** - Inferno stage name with suffix (for requirements)

**Special Display Functions:**
41. **formatCombinedHealing()** - Combined healing display (direct + HoT + shield)
42. **formatPurificationEffects()** - Purification effects display (dispel, cleanse, remove curse, banish)
43. **formatRestorationEffects()** - Restoration effects display (mana, health, stamina, resurrection)
44. **formatUtilityEffects()** - Utility effects display (movement, information, transformation, environment)
45. **formatSummoningEffects()** - Summoning effects display (creature summoning with stats and control)
46. **formatTransformationEffects()** - Transformation effects display (physical, mental, elemental, shapechange)
47. **formatControlEffects()** - Control effects display (forced movement, restraint, incapacitation, mind control)

### SpellCardUtils Functions:

1. **formatFormulaToPlainEnglish(formula, type)** - Converts technical formulas to readable text
2. **formatFormulaToReadableText(formula, drawCount)** - Legacy formula formatting
3. **formatDamageOrHealing(data)** - Damage/healing value formatting
4. **ensureReadableFormat(text)** - Ensures any text is properly formatted

---

## Important Notes for AI Generation

1. **Always set effectTypes array** - This determines which effects are active
2. **Provide both damageConfig and effectTypes** - Include 'damage' in effectTypes if using damage
3. **Use proper resolution format** - Set `resolution` field and corresponding `cardConfig`/`coinConfig`/`diceConfig`
4. **Formula format** - Use readable dice notation (`2d6`) or technical variables (`CARD_VALUE`, `HEADS_COUNT`)
5. **Duration consistency** - Use `durationValue` + `durationType` for consistent formatting
6. **Resource format** - Use `resourceTypes[]` + `resourceValues{}` for wizard format
7. **Normalize damage types** - Use lowercase, normalized names (fire, cold, lightning, etc.)
8. **Include all config objects** - Even if empty, provide the config object structure
9. **Tag format** - Use lowercase, hyphenated tag names
10. **School vs Damage Type** - `typeConfig.school` is for magic school, `damageTypes[]` is for damage type
11. **Class-specific resources extraction** - The spell normalizer automatically extracts class-specific resources from `resourceCost.resourceValues`:
    - **Pyrofiend**: `inferno_required`, `inferno_ascend`, `inferno_descend` → flattened to `infernoRequired`, `infernoAscend`, `infernoDescend`
    - **Martyr**: `devotion_required`, `devotion_cost`, `devotion_gain` → flattened to `devotionRequired`, `devotionCost`, `devotionGain`
    - **Chronarch**: `time_shard_generate`, `time_shard_cost`, `temporal_strain_gain`, `temporal_strain_reduce` → flattened to `timeShardGenerate`, `timeShardCost`, `temporalStrainGain`, `temporalStrainReduce`
    - **Deathcaller**: `bloodTokens`, `ascension_required` → flattened to `bloodTokens`, `ascensionRequired`
    - **Dreadnaught**: `drp` → flattened to `drp` (Dark Resilience Points)
    - **Action Points**: Always set `resourceCost.actionPoints` explicitly (not in resourceTypes/resourceValues)
    - The normalizer handles this automatically, so spells from class data files will display correctly in the library

---

## Example: Complete Spell Object

```javascript
{
  id: "example_fireball",
  name: "Fireball",
  description: "A sphere of fire explodes at the target location, dealing fire damage to all creatures within the area.",
  level: 3,
  icon: "spell_fire_fireball",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: {
    school: "fire",
    icon: "spell_fire_fireball",
    tags: ["attack", "aoe", "damage"],
    castTime: 1,
    castTimeType: "IMMEDIATE"
  },
  damageConfig: {
    formula: "8d6 + intelligence",
    elementType: "fire",
    damageType: "direct",
    canCrit: true,
    critMultiplier: 2,
    critDiceOnly: false
  },
  targetingConfig: {
    targetingType: "area",
    rangeType: "ranged",
    rangeDistance: 150,
    aoeShape: "sphere",
    aoeParameters: {
      radius: 20
    },
    targetRestrictions: ["enemy", "ally"]
  },
  resourceCost: {
    resourceTypes: ["mana"],
    resourceValues: {
      mana: 50
    },
    useFormulas: {},
    actionPoints: 1,
    components: ["V", "S", "M"]
  },
  cooldownConfig: {
    type: "turn_based",
    value: 3
  },
  resolution: "DICE",
  tags: ["attack", "aoe", "damage"],
  damageTypes: ["fire"]
}
```

This template provides complete mapping from every wizard step to every possible display format on the spell card. Use this as a reference when generating spells through prompts to ensure all fields are properly configured and will display correctly.

---

## UnifiedSpellCard Usage Locations

The `UnifiedSpellCard` component is used throughout the application in the following locations. All of these locations MUST use the same component and follow this template:

1. **Spell Wizard (Step 10: Review)**
   - Location: `vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx`
   - Variant: `wizard`
   - Purpose: Preview spell during creation

2. **Spell Library**
   - Location: `vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx`
   - Variant: `library`
   - Purpose: Display spells in the library browser

3. **Character Creation Wizard - Spell Selection (Step 4)**
   - Location: `vtt-react/src/components/character-creation-wizard/steps/Step4SpellSelection.jsx`
   - Variant: `library` or `compact`
   - Purpose: Select spells during character creation

4. **Character Creation Wizard - Race Selection (Step 2)**
   - Location: `vtt-react/src/components/character-creation-wizard/steps/Step2RaceSelection.jsx`
   - Variant: `compact` or `preview`
   - Purpose: Display racial spells/abilities

5. **Character Creation Wizard - Path Selection (Step 5)**
   - Location: `vtt-react/src/components/character-creation-wizard/steps/Step5PathSelection.jsx`
   - Variant: `compact` or `preview`
   - Purpose: Display path spells/abilities

6. **Spellbook Window**
   - Location: `vtt-react/src/components/windows/SpellbookWindow.jsx`
   - Variant: `spellbook`
   - Purpose: Display spells in character's spellbook

7. **Spell Selection Window**
   - Location: `vtt-react/src/components/windows/SpellSelectionWindow.jsx`
   - Variant: `library` or `compact`
   - Purpose: Select spells for various purposes

8. **Level Up Choice Modal**
   - Location: `vtt-react/src/components/modals/LevelUpChoiceModal.jsx`
   - Variant: `compact` or `preview`
   - Purpose: Display spells available on level up

9. **Rules Section**
   - Location: Various rule display components
   - Variant: `rules` or `compact`
   - Purpose: Display spell information in rules documentation

10. **Action Bar Hover Tooltips**
    - Location: Action bar components (via SpellTooltip)
    - Variant: `compact` or tooltip variant
    - Purpose: Show spell details on hover

---

## 📋 Quick Reference: Advanced Topics

> **💡 TIP**: For effect types and description/mechanicsText rules, see the **"AI QUICK REFERENCE"** section at the top of this document. This section covers **triggers, targeting, and resources** in detail.

### Trigger Types Summary

**Three Types of Triggers:**

1. **Global Triggers** (`triggerConfig.global`)
   - Apply to entire spell
   - Used for REACTION, PASSIVE, TRAP, STATE spell types
   - Displayed in "Spell Triggers" section at top (when no conditional formulas use these triggers)
   - When conditional formulas exist: shown with formulas in effect sections

2. **Effect-Specific Triggers** (`triggerConfig.effectTriggers`)
   - Apply to specific effects (damage, healing, etc.)
   - Can be stored under base types OR subtypes
   - **Integrated into each effect item** - displayed below effect mechanics text with divider
   - When conditional formulas exist: triggers shown with formulas (e.g., "If below 25% health: 3d6 Necrotic Damage")
   - When no conditional formulas: triggers shown as standalone text (e.g., "If below 50% health")
   - Format uses intuitive "If..." style with concrete health thresholds

3. **Required Conditions** (`triggerConfig.requiredConditions`)
   - Conditions that must be met before spell can be cast
   - Displayed as header before all effects
   - Format: "Required - ALL/ANY"

4. **Conditional Effects** (`triggerConfig.conditionalEffects`)
   - Modify how effects work based on triggers
   - Require effect-specific triggers to exist
   - Displayed below main effect text as "If {trigger}: {formula}"
   - Uses `formatTriggerForConditionalDisplay()` for intuitive formatting
   - Health thresholds show concrete percentages (e.g., "If below 50% health")

### Targeting Modes Summary

**Two Targeting Modes:**

1. **Unified Targeting** (`targetingMode: 'unified'`)
   - Single `targetingConfig` applies to all effects
   - Displayed in header only
   - Individual effects don't show targeting badges

2. **Effect-Specific Targeting** (`targetingMode: 'effect'`)
   - Each effect has its own `effectTargeting[effectType]` config
   - Each effect shows its own targeting badges
   - Header doesn't show unified targeting

**⚠️ CRITICAL**: When `targetingType: 'self'`, do NOT include `targetRestrictions: ['self']` or `rangeType: 'self'` - this creates redundancy.

### Resource Costs Summary

**Resource Types:**
- **Basic**: Action Points, Mana, Rage, Energy, Focus, etc.
- **Class-Specific**: Elemental Spheres, Inferno, Musical Notes, Temporal Mechanics, Devotion, Blood Tokens, DRP, Chaos, Fate, Rage States

**Resource Cost Structure:**
```javascript
resourceCost: {
  resourceTypes: ['mana', 'inferno_ascend'],  // Array of resource types
  resourceValues: {                           // Values for each type
    mana: 8,
    inferno_ascend: 2
  },
  resourceFormulas: {                         // Formulas (if useFormulas[type] === true)
    health: '1d6'
  },
  useFormulas: {                              // Which resources use formulas
    health: true
  },
  actionPoints: 2,                            // ⚠️ ALWAYS specify explicitly
  channelingFrequency: 'per_round',           // For CHANNELED spells only
  components: ['verbal', 'somatic', 'material'] // Spell components
}
```

**Spell Components:**
- `components[]`: Array of 'verbal', 'somatic', 'material'
- `verbalText`: Custom verbal component text
- `somaticText`: Custom somatic component text
- `materialComponents`: Material component description


---

**This template provides complete mapping from every wizard step to every possible display format on the spell card. Use this as a reference when generating spells through prompts to ensure all fields are properly configured and will display correctly.**

