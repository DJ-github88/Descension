# SpellWizard to SpellCard Comprehensive Formatting Template

This document provides a complete mapping of EVERY field from the SpellWizard (Steps 1-10) to how it appears on the UnifiedSpellCard. This is intended as a reference for AI-generated spell creation prompts to ensure all fields are properly configured and formatted.

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
- **typeConfig.secondaryElement** (string) - Secondary damage/healing type
- **typeConfig.icon** (string) - WoW icon identifier
- **typeConfig.tags** (array) - Array of tag strings

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
- **Normalization**: 
  - `ice/frost` → `cold`
  - `electric` → `lightning`
  - `holy` → `radiant`
  - `shadow` → `necrotic`

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
- Toggleable: `"toggleable"` (if `toggleable === true`)

**Fields Used:**
- `typeConfig.toggleable` (boolean) - Whether the passive effect can be turned on and off

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

**Damage Type Suffix Logic:**
- **Priority**: `damageTypes[]` array → `typeConfig.school` + `typeConfig.secondaryElement` → `damageConfig.elementType`
- **Multiple Types**: "Cold and Lightning Damage" (joined with "and")
- **Single Type**: "Fire Damage" (capitalized)
- **Normalization**: `ice/frost` → `cold`, `electric` → `lightning`, `holy` → `radiant`, `shadow` → `necrotic`

**Instant Damage:**
```
Resolution = DICE:
  "{cleanedFormula}{damageTypeSuffix}"
  Example: "2d6 + Intelligence Fire Damage"

Resolution = CARDS:
  "Draw {drawCount} cards: {cleanedFormula}{damageTypeSuffix}"
  Example: "Draw 3 cards: CARD_VALUE + POKER_HAND_RANK * 3 Fire Damage"

Resolution = COINS:
  "Flip {flipCount} coins: {cleanedFormula}{damageTypeSuffix}"
  Example: "Flip 4 coins: HEADS_COUNT * 6 + LONGEST_STREAK * 2 Fire Damage"
```

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

**Stat Modifiers:**
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

**Custom Description:**
```
"{customDescription}" (if provided)
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
- `buffConfig.buffType` ('statEnhancement', 'temporaryHP', 'statusEffect', 'custom')
- `buffConfig.statModifiers[]` - **Array of stat modifier objects** (preferred format)
  - `statModifier.id` (string) - Unique identifier for the modifier
  - `statModifier.name` (string) - Display name (e.g., "Heat Shield", "Damage Reduction")
  - `statModifier.stat` (string) - Stat being modified (e.g., 'damage_reduction', 'armor', 'strength', 'intelligence')
  - `statModifier.value` (number) - The numeric value (same as magnitude, for clarity)
  - `statModifier.magnitude` (number | string) - The amount of change (number or dice formula like '2d6 + 4')
  - `statModifier.magnitudeType` ('flat' or 'percentage') - Whether the magnitude is flat or percentage
  - `statModifier.isPercentage` (boolean) - Whether this is a percentage modifier
  - `statModifier.description` (string, optional) - Human-readable description of what this modifier does
- `buffConfig.effects[]` - Alternative format (legacy, but still supported)
  - `effect.id` / `effect.name`
  - `effect.statModifier.stat`
  - `effect.statModifier.magnitude`
  - `effect.statModifier.magnitudeType` ('flat' or 'percentage')
  - `effect.description`
- `buffConfig.durationValue` / `buffConfig.duration` (number) - Duration value
- `buffConfig.durationType` ('instant', 'rounds', 'turns', 'permanent', 'rest', 'minutes', 'hours')
- `buffConfig.durationUnit` (string) - **REQUIRED**: Must match durationType (e.g., 'rounds', 'turns', 'minutes')
- `buffConfig.concentrationRequired` (boolean)
- `buffConfig.canBeDispelled` (boolean)
- `buffConfig.maxStacks` (number)
- `buffConfig.stackingRule` ('replace', 'stack', 'refresh')
- `buffConfig.customDescription` (string)

**⚠️ CRITICAL - Damage Reduction and Protection Buffs:**

When creating buffs that provide damage reduction or protection, you **MUST** include complete details and clearly specify the mechanic type:

1. **Use `statModifiers` array** (preferred format):
```javascript
buffConfig: {
  buffType: 'statEnhancement',
  statModifiers: [{
    id: 'unique_id_for_this_modifier',
    name: 'Display Name',  // e.g., "Heat Shield", "Protective Aura"
    stat: 'damage_reduction',  // Use 'damage_reduction' for flat damage reduction
    value: 2,  // The amount of damage reduction
    magnitude: 2,  // Same as value
    magnitudeType: 'flat',  // 'flat' for fixed amount, 'percentage' for %
    isPercentage: false,
    // ⚠️ CRITICAL: Description must clearly specify the mechanic type
    description: 'Reduces incoming damage by 2 (flat reduction)'  // OR
    description: 'Provides 2 flat damage reduction per hit'  // OR
    description: 'Reduces all incoming damage by 2 points (not absorption)'
    // DO NOT use vague terms like "protection" or "shield" without clarification
    // DO NOT imply absorption/barrier mechanics unless that's the actual mechanic
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
   - ✅ `statModifiers[].id` - Unique identifier
   - ✅ `statModifiers[].name` - Display name
   - ✅ `statModifiers[].stat` - The stat being modified
   - ✅ `statModifiers[].value` and `statModifiers[].magnitude` - The amount
   - ✅ `statModifiers[].magnitudeType` - 'flat' or 'percentage'
   - ✅ `statModifiers[].description` - Clear description of the effect
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
    statModifiers: [{
      id: 'heat_shield_damage_reduction',
      name: 'Heat Shield',
      stat: 'damage_reduction',
      value: 2,
      magnitude: 2,
      magnitudeType: 'flat',
      isPercentage: false,
      // ⚠️ CRITICAL: Description must specify this is flat reduction, not absorption
      description: 'Reduces incoming damage by 2 (flat reduction per hit)'
      // Alternative: 'Provides 2 flat damage reduction (not an absorption pool)'
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
- Always configure `buffConfig` when 'buff' is in `effectTypes`. The component will show "Buff Effect - Effect details not configured" if only the effect type is present without proper configuration.
- **Never leave damage reduction or protection effects without complete details** - always include `statModifiers` with full information including `description` and ensure `durationUnit` matches `durationType`.
- **For damage reduction**: Always specify in the description that it's a "flat reduction" (not absorption/barrier) to avoid confusion.
- **For Pyrofiend spells**: Always include `actionPoints` (2 for most spells, 1 for weaker utility spells) and include `inferno_ascend`/`inferno_descend` in `resourceTypes` and `resourceValues` when applicable.

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
- `debuffConfig.effects[]` - Array of effect objects (same structure as buff)
- `debuffConfig.durationValue` / `debuffConfig.duration`
- `debuffConfig.durationType`
- `debuffConfig.difficultyClass` (number)
- `debuffConfig.savingThrow` (stat name)
- `debuffConfig.saveOutcome` ('negates', 'halves_effects', 'ends_early', etc.)
- `debuffConfig.canBeDispelled` (boolean)
- `debuffConfig.concentrationRequired` (boolean)
- `debuffConfig.isProgressive` (boolean)
- `debuffConfig.progressiveStages[]` - Array of stage objects
- `debuffConfig.restType` ('short', 'long')
- `debuffConfig.stackingRule`
- `debuffConfig.maxStacks`

**⚠️ IMPORTANT**: Always configure `debuffConfig` when 'debuff' is in `effectTypes`. The component will show "Debuff Effect - Effect details not configured" if only the effect type is present without proper configuration.

#### Status Effect Detailed Configurations

Status effects (both buffs and debuffs) can have detailed configurations:

**Status Effect Levels:**
- `level` (enum: 'minor', 'moderate', 'major', 'severe', 'extreme') - Severity/strength of effect
- Display: Shows level in description (e.g., "Charmed (moderate)")

**Status Effect Save Configurations:**
Each status effect can have its own save configuration:
- `saveType` (enum: 'strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma', 'wisdom', 'none')
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

**Display Format:**
```
"{controlType} (DC {saveDC} {saveType} save)"
Example: "Forced Movement (DC 14 Strength save)"
```

**Fields Used:**
- `controlConfig.controlType` ('forcedMovement', 'restraint', 'mental', 'environmental')
- `controlConfig.strength` ('weak', 'moderate', 'strong')
- `controlConfig.duration` (number)
- `controlConfig.saveDC` (number)
- `controlConfig.saveType` (stat name)
- `controlConfig.specialEffects[]`

#### Summoning Effects

**Display Format:**
```
"Summon {creatureType} ({creatureStrength})"
"Duration: {duration} rounds"
"Minions: {minions}"
"Control: {controlType}"
```

**Fields Used:**
- `summoningConfig.creatureType` ('elemental', 'undead', 'beast', 'construct', etc.)
- `summoningConfig.creatureStrength` ('weak', 'moderate', 'strong')
- `summoningConfig.duration` (number)
- `summoningConfig.minions` (number)
- `summoningConfig.controlType` ('mental', 'pact', 'bound')

#### Transformation Effects

**Display Format:**
```
"{transformationType} Transformation"
"Target: {targetType}"
"Duration: {duration} rounds"
"Power: {power}"
```

**Fields Used:**
- `transformationConfig.transformationType` ('physical', 'mental', 'elemental', 'shapechange')
- `transformationConfig.targetType` ('self', 'target')
- `transformationConfig.duration` (number)
- `transformationConfig.power` ('minor', 'moderate', 'major')
- `transformationConfig.specialEffects[]`

#### Purification Effects

**Display Format:**
```
"{purificationType} - {targetType}"
"Power: {power}"
"Duration: {duration}"
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
"{resourceDisplayName} Restoration: {cleanedFormula} {resourceName} Restored"
Example: "Mana Restoration: 2d6 + Spirit Mana Restored"
```

**Over Time Restoration:**
```
"{resourceDisplayName} Over Time"
"Every {frequency} for {duration} {frequency}s - {applicationText}"
"{cleanedFormula} {resourceName} per {frequency}"
```

**Resurrection Effects:**
```
"Resurrection"
"Brings the dead back to life"
"Restores {restoredHealth} health • {restoredMana} mana • Removes: {removesConditions}"
"Casting time: {castingTime} {timeUnit}"
"Must be cast within {timeLimit} {limitUnit} of death"
"Penalty: {penalty.type} level {penalty.level}" (if applicable)
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

#### Utility Effects

**Display Format Logic:**
- **If `utilityConfig` exists**: Shows detailed utility effects based on configuration
- **If `utilityConfig` missing but 'utility' in `effectTypes`**: Shows generic "Utility Effect - Effect details not configured"

**Movement Effects:**
```
"Flight: {flightType} at {flightSpeed} ft/round, max altitude {maxAltitude} ft"
"Teleport: Teleport up to {distance} ft ({needsLineOfSight}, {takesOthers})"
```

**Information Effects:**
```
"Detect Magic: Reveals magical auras within {range} ft"
"True Sight: See through illusions and invisibility within {range} ft"
```

**Transformation Effects:**
```
"Water Breathing: Breathe underwater for the duration"
"Water Walking: Walk on water as if it were solid ground"
"Invisibility: Become invisible ({breaksOnAttack})"
```

**Environmental Effects:**
```
"Light: Create {lightType} light in {radius} ft radius"
"Darkness: Create magical darkness in {radius} ft radius"
```

**Fields Used:**
- `utilityConfig.utilityType` ('movement', 'information', 'transformation', 'environment', etc.)
- `utilityConfig.selectedEffects[]` - Array of utility effects
- `utilityConfig.enhancementType` / `utilityConfig.enhancementValue`
- `utilityConfig.duration` / `utilityConfig.durationUnit`
- `utilityConfig.concentration` (boolean)
- `utilityConfig.power` ('minor', 'moderate', 'major')

**⚠️ IMPORTANT**: Always configure `utilityConfig` when 'utility' is in `effectTypes`. The component will show "Utility Effect - Effect details not configured" if only the effect type is present without proper configuration.

#### Control Effects

**Display Format Logic:**
- **If `controlConfig` exists**: Shows detailed control effects based on configuration
- **If `controlConfig` missing but 'control' in `effectTypes`**: Shows generic "Control Effect - Effect details not configured"

**Forced Movement:**
```
"Forced Movement (DC {saveDC} {saveType} save)"
"Pull: Pulls target {distance} feet toward caster"
"Push: Pushes target {distance} feet away from caster"
"Slide: Slides target {distance} feet in any direction"
"Teleport: Teleports target up to {distance} feet"
```

**Restraint:**
```
"Restraint (DC {saveDC} {saveType} save)"
"Binding: Target cannot move or take reactions"
"Slow: Target's movement speed reduced"
"Snare: Target is rooted in place"
```

**Mental Control:**
```
"Mental Control (DC {saveDC} {saveType} save)"
"Charm: Target treats you as a friendly ally"
"Dominate: Target obeys your commands"
```

**Fields Used:**
- `controlConfig.controlType` ('forcedMovement', 'restraint', 'knockdown', 'incapacitation', 'mind_control', 'restriction')
- `controlConfig.strength` ('weak', 'moderate', 'strong')
- `controlConfig.duration` (number) - Duration in rounds (0 for instant)
- `controlConfig.durationUnit` (string) - 'instant', 'rounds', 'turns', etc.
- `controlConfig.saveDC` (number) - Difficulty class for saving throw
- `controlConfig.saveType` (string) - Stat name for saving throw ('strength', 'agility', 'constitution', etc.)
- `controlConfig.savingThrow` (boolean) - Whether a saving throw is required
- `controlConfig.effects[]` - **REQUIRED**: Array of effect objects with proper configuration

**⚠️ CRITICAL - Forced Movement Configuration:**

For forced movement effects (push, pull, slide, teleport), you **MUST** use the `effects` array format:

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

**Example - Complete Pull Effect:**
```javascript
{
  id: 'pyro_flame_lash',
  name: 'Flame Lash',
  effectTypes: ['damage', 'control'],
  controlConfig: {
    controlType: 'forcedMovement',
    strength: 'weak',
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
}
```

**⚠️ IMPORTANT**: 
- Always use the `effects` array format for control effects
- Each effect must have `id`, `name`, `description`, and `config` with proper settings
- For forced movement, `config.movementType` must match the effect `id` ('pull', 'push', etc.)
- Always include `distance` in the config for forced movement effects
- Never leave control effects without complete details in the `effects` array

#### Summoning Effects

**Display Format Logic:**
- **If `summoningConfig` exists**: Shows detailed summoning effects based on configuration
- **If `summoningConfig` missing but 'summoning' in `effectTypes`**: Shows generic "Summoning Effect - Effect details not configured"

**Creature Summoning:**
```
"Summon {creatureType} ({creatureStrength})"
"Minions: {minions}"
"Duration: {duration} rounds"
"Control: {controlType}"
```

**Elemental Summoning:**
```
"Summon {quantity}x {creatureType} Elementals"
"Power: {creatureStrength}"
"Control Range: {controlRange} ft"
```

**Fields Used:**
- `summoningConfig.creatureType` ('elemental', 'undead', 'beast', 'construct', etc.)
- `summoningConfig.creatureStrength` ('weak', 'moderate', 'strong')
- `summoningConfig.duration` (number)
- `summoningConfig.minions` (number)
- `summoningConfig.controlType` ('mental', 'pact', 'bound')
- `summoningConfig.controlRange` (number)

**⚠️ IMPORTANT**: Always configure `summoningConfig` when 'summoning' is in `effectTypes`. The component will show "Summoning Effect - Effect details not configured" if only the effect type is present without proper configuration.

#### Transformation Effects

**Display Format Logic:**
- **If `transformationConfig` exists**: Shows detailed transformation effects based on configuration
- **If `transformationConfig` missing but 'transformation' in `effectTypes`**: Shows generic "Transformation Effect - Effect details not configured"

**Physical Transformation:**
```
"Physical Transformation"
"Target: {targetType}"
"Duration: {duration} rounds"
"Power: {power}"
```

**Elemental Transformation:**
```
"Elemental Form: {elementType}"
"Transform {transformPercent}% into elemental essence"
"Duration: {duration} rounds"
```

**Shapechange:**
```
"Shapechange into {creatureType}"
"Size: {size}"
"Abilities: {abilities}"
```

**Fields Used:**
- `transformationConfig.transformationType` ('physical', 'mental', 'elemental', 'shapechange')
- `transformationConfig.targetType` ('self', 'target')
- `transformationConfig.duration` (number)
- `transformationConfig.power` ('minor', 'moderate', 'major')
- `transformationConfig.specialEffects[]`

**⚠️ IMPORTANT**: Always configure `transformationConfig` when 'transformation' is in `effectTypes`. The component will show "Transformation Effect - Effect details not configured" if only the effect type is present without proper configuration.

#### Purification Effects

**Display Format Logic:**
- **If `purificationConfig` exists**: Shows detailed purification effects based on configuration
- **If `purificationConfig` missing but 'purification' in `effectTypes`**: Shows generic "Purification Effect - Effect details not configured"

**Dispel Effects:**
```
"Dispel Magic"
"Removes {selectedEffects.length} magical effects"
"Power: {power}"
```

**Cleanse Effects:**
```
"Cleanse: Remove {selectedEffects.length} conditions"
"Conditions: {conditions.join(', ')}"
"Power: {power}"
```

**Banishment:**
```
"Banish {targetType}"
"Power: {power}"
"Duration: {duration}"
```

**Fields Used:**
- `purificationConfig.purificationType` ('dispel', 'cleanse', 'remove_curse', 'banish')
- `purificationConfig.targetType` ('self', 'single', 'area')
- `purificationConfig.power` ('minor', 'moderate', 'major')
- `purificationConfig.duration` ('instant' or number)
- `purificationConfig.specialEffects[]`

**⚠️ IMPORTANT**: Always configure `purificationConfig` when 'purification' is in `effectTypes`. The component will show "Purification Effect - Effect details not configured" if only the effect type is present without proper configuration.

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
- `targetingConfig.targetRestrictions[]` - Array of ('enemy', 'ally', 'self', 'object', 'creature')

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

**Chaos Mechanics (Chaos Weaver):**
- `mayhem_generate`: "Mayhem Modifiers +{amount}"
- `mayhem_spend`: "Mayhem Modifiers -{amount}"

**Fate Mechanics (Fate Weaver):**
- `threads_generate`: "Threads of Destiny +{amount}"
- `threads_spend`: "Threads of Destiny -{amount}"

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

### SpellCard Display Mapping:

#### Trigger Configuration

**Global Triggers:**
- Used for REACTION, PASSIVE, TRAP, and STATE spell types
- Displayed in spell description or as separate section
- Format: Condition-based text describing when spell activates

**Effect-Specific Triggers:**
- Conditional effects based on triggers
- Displayed with effect description

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
- `triggerConfig.effectTriggers{}` - Object mapping effect types to trigger configs:
  - `effectTriggers.damage` - Triggers for damage effects
  - `effectTriggers.healing` - Triggers for healing effects
  - `effectTriggers.buff` - Triggers for buff effects
  - `effectTriggers.debuff` - Triggers for debuff effects
  - `effectTriggers.utility` - Triggers for utility effects
  - `effectTriggers.control` - Triggers for control effects
  - Each contains:
    - `logicType` ('AND' | 'OR') - How multiple triggers are combined
    - `compoundTriggers[]` - Array of trigger objects
    - `targetingOverride` (string, optional) - Override targeting for this effect when triggered (e.g., 'nearest', 'farthest', 'lowest_health')

**Conditional Effects:**
- `triggerConfig.conditionalEffects{}` - Object mapping effect types to conditional configs:
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
    - Key: trigger ID (e.g., 'health_threshold_30', 'damage_taken', 'default')
    - Value: formula string (e.g., '2d6 + INT', 'damage * 1.5')
    - Special key 'default' contains the base formula
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
```
Global Triggers:
  "Triggers: {condition1} AND {condition2}"
  Displayed in spell description or as separate section

Required Conditions:
  "Requires: {condition1} AND {condition2}"
  Displayed before spell effects

Effect-Specific Triggers:
  "When {trigger}: {effect description with modified formula}"
  Displayed with individual effect descriptions

Conditional Effects:
  "{baseFormula} (or {conditionalFormula} when {trigger})"
  Displayed inline with effect descriptions
```

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
- `agility` - Dexterity, reflexes, and ranged accuracy
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
    saveDC: number,
    saveType: string,
    specialEffects: array
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
  cardPattern: string, // For CARDS (e.g., "Hearts", "Ace of Spades")
  coinPattern: string, // For COINS (e.g., "All Heads", "Majority Tails")
  customName: string, // Entry name
  effect: string, // Description of effect
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

#### SpellCard Display:
- **Location**: Card body, special mechanics section
- **Format**: 
  - Shows table name and description
  - Displays resolution type (e.g., "Roll 1d20" or "Draw 3 Cards")
  - Lists all entries with their ranges/patterns and effects
  - For DICE: Shows "On a roll of X-Y: Effect description"
  - For CARDS: Shows "When drawing [Pattern]: Effect description"
  - For COINS: Shows "When pattern [Pattern]: Effect description"
- **Special Features**:
  - Entries can reference creatures from creature library
  - Entries can modify base spell effects
  - Entries can have their own damage/healing formulas
  - Entries can summon creatures with full configuration

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

### Tag-Based Targeting

Allows different effect types to target different entities (split targeting mode).

#### Fields Configured:
- **targetingMode** (enum):
  - 'unified' - All effects use same targeting
  - 'tagged' - Each effect type has separate targeting
- **targetingTags** (object) - Map of effect type to targeting:
  ```javascript
  {
    damage: { targetOption: 'target' },
    healing: { targetOption: 'self' },
    buff: { targetOption: 'self' },
    debuff: { targetOption: 'target' }
  }
  ```
- **targetOption** (enum):
  - 'target' - Apply to spell's target
  - 'self' - Apply to caster
  - 'both' - Apply to both target and caster

#### SpellCard Display:
- **Location**: Card body, targeting section
- **Format**: 
  - If unified: Standard targeting display
  - If tagged: Shows split targeting:
    - "Damage: Targets enemy"
    - "Healing: Targets self"
    - "Buff: Targets self"

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

#### SpellCard Display:
- **Location**: Card body, damage section
- **Format**: 
  - "Critical Hit: [Details]"
  - Dice: "On crit: [Multiplier]× damage [extra dice] [exploding details]"
  - Cards: "On [Rule]: [Resolution method]"
  - Coins: "On [Rule] with [Count] coins: [Resolution method]"
  - Effects: Lists additional effects (knockback, stun, etc.)
  - If using spell reference: "Triggers spell: [Spell Name]"
  - If using rollable table: "Uses rollable table: [Table Name]"

---

### Chance On Hit Configuration

Chance-based additional effects that trigger when spell hits target.

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
  - 'burning' - Target burns for 1d4 damage per round for 2 rounds
  - 'stun' - Target stunned for 1 round (15% chance)
  - 'slow' - Target slowed by 30% for 2 rounds
  - 'knockback' - Target pushed back 10 feet
  - 'shock' - Target shocked, reducing action economy
  - 'disarm' - Target drops their weapon (10% chance)

#### SpellCard Display:
- **Location**: Card body, special effects section
- **Format**: 
  - "[Chance]% chance on hit: [Effect Details]"
  - Dice: "[Chance]% chance ([Threshold]+ on d20): [Effects]"
  - Cards: "[Chance]% chance ([Rule]): [Effects]"
  - Coins: "[Chance]% chance ([Rule] with [Count] coins): [Effects]"
  - If using spell reference: "Triggers spell: [Spell Name]"
  - If using rollable table: "Uses rollable table: [Table Name]"

---

### Saving Throw Configuration

Allows targets to make saving throws to reduce or negate spell effects.

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
- **Location**: Card body, effects section
- **Format**: 
  - "Saving Throw: [Type] DC [DC]"
  - "On save: [Outcome]" (e.g., "On save: Half damage" or "On save: No effect")
  - If partial effect: "On successful save: [Formula] (e.g., 'half damage', 'quarter damage')"

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

1. **formatCastTime()** - Cast time display
2. **formatRange()** - Range and targeting display
3. **formatAoeShape()** - AOE shape formatting
4. **formatTargetingType()** - Targeting type description
5. **formatPropagation()** - Propagation effect description
6. **formatDuration()** - Duration display
7. **formatCooldown()** - Cooldown display
8. **formatResourceCosts()** - Resource cost badges
9. **formatDamage()** - Damage effect text
10. **formatHealing()** - Healing effect text
11. **formatMechanics()** - Mechanics display
12. **formatTypeSpecificBullets()** - Type-specific configuration bullets
13. **getSpellTags()** - Tag extraction
14. **getDamageTypes()** - Damage type extraction
15. **cleanFormula()** - Formula cleaning
16. **enhanceFormulaDisplay()** - Formula enhancement

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

11. **Character Sheet**
    - Location: Character sheet spell display components
    - Variant: `compact` or `spellbook`
    - Purpose: Display known/prepared spells

**Important**: All these locations use the same `UnifiedSpellCard` component, ensuring consistent formatting across the entire application. Any changes to spell card formatting should be made in `UnifiedSpellCard.jsx` to maintain consistency.

