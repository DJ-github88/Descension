# SpellWizard to SpellCard Comprehensive Formatting Template

This document provides a complete mapping of EVERY field from the SpellWizard (Steps 1-10) to how it appears on the UnifiedSpellCard. This is intended as a reference for AI-generated spell creation prompts to ensure all fields are properly configured and formatted.

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
- `typeConfig.castTimeType !== 'IMMEDIATE'` → Bullet: "{castTimeType} (lowercase)"

**CHANNELED:**
- Duration: `"Up to {maxChannelDuration} {durationUnit.toLowerCase()}"`
- Interruptible: `"Can be interrupted"` or `"Cannot be interrupted"`
- Movement: `"Can move while channeling"` or `"Must stand still"`
- Concentration DC: `"DC {concentrationDC} {dcType}"`
- Tick Frequency: `"{tickFrequency.replace(/_/g, ' ').toLowerCase()}"`
- Break Effect: `"break: {breakEffect}"` (if not 'none')

**REACTION:**
- Availability: `"{availabilityType.replace(/_/g, ' ').toLowerCase()}"` (default: "always available")
- Uses Per Turn: `"{usesPerTurn}/turn"` (if `limitUsesPerTurn === true`)
- Reaction Window: `"{reactionWindow} window"` (if not 'immediate')
- Cooldown: `"{cooldownAfterTrigger} {cooldownUnit} cooldown"` or `"no cooldown"` (if 0)
- Max Triggers: 
  - `-1` → `"unlimited triggers"`
  - `1` → `"single use"`
  - `>1` → `"max {maxTriggers} triggers"`

**TRAP:**
- Placement Time: `"{placementTime} turns to place"` (if > 1)
- Visibility:
  - `"hidden"` → `"hidden"`
  - `"magical"` → `"magical aura"`
  - `"visible"` → `"visible to all"`
- Cooldown: `"{cooldownAfterTrigger} {cooldownUnit} cooldown"` or `"no cooldown"`
- Max Triggers: Same logic as REACTION

**STATE:**
- Visibility: Same logic as TRAP
- Cooldown: Same logic as REACTION/TRAP
- Max Triggers: Same logic as REACTION/TRAP

**ZONE:**
- Duration: `"{zoneDuration} {zoneDurationUnit}"`
- Trail: `"leaves trail"` (if `leaveTrail === true`)
- Trail Duration: `"trail: {trailDuration} {trailDurationUnit}"`

**PASSIVE:**
- Toggleable: `"toggleable"` (if `toggleable === true`)

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

**Instant Damage:**
```
Resolution = DICE:
  "{formula} {damageType} Damage"
  Example: "2d6 + Intelligence Fire Damage"

Resolution = CARDS:
  "Draw {drawCount} cards: {formula} {damageType} Damage"
  Example: "Draw 3 cards: CARD_VALUE + POKER_HAND_RANK * 3 Fire Damage"

Resolution = COINS:
  "Flip {flipCount} coins: {formula} {damageType} Damage"
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
- `damageConfig.damageType` ('direct' or 'dot')
- `damageConfig.hasDotEffect`
- `damageConfig.dotConfig.duration`
- `damageConfig.dotConfig.tickFrequency`
- `damageConfig.dotConfig.dotFormula`
- `damageConfig.dotConfig.isProgressiveDot`
- `damageConfig.dotConfig.progressiveStages[]`
- `damageConfig.dotConfig.cardConfig.formula` / `damageConfig.dotConfig.coinConfig.formula`
- `cardConfig.formula` / `cardConfig.drawCount`
- `coinConfig.formula` / `coinConfig.flipCount`
- `resolution` ('DICE', 'CARDS', 'COINS')

**Critical Hit Configuration:**
- `damageConfig.canCrit` (boolean)
- `damageConfig.critMultiplier` (number, default: 2)
- `damageConfig.critDiceOnly` (boolean)
- **Display**: Shown as "Critical: {multiplier}x" badge if enabled

**Saving Throw Configuration:**
- `damageConfig.savingThrowConfig.enabled` (boolean)
- `damageConfig.savingThrowConfig.savingThrow` (stat name)
- `damageConfig.savingThrowConfig.difficultyClass` (number)
- `damageConfig.savingThrowConfig.saveOutcome` ('negates', 'halves', etc.)
- **Format**: `"DC {dc} {saveType} ({outcome})"`
- **Display Location**: Below damage text

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

**Display Format:**
```
Stat Modifiers:
  "+{magnitude} {statName}" or "+{magnitude}% {statName}"
  Example: "+2 Strength" or "+10% Intelligence"

Status Effects:
  "{effectName}: {effectDescription}"
  Example: "Haste: +1 action per turn"

Temporary HP:
  "{formula} Temporary Hit Points"
  Example: "1d6 + Constitution Temporary Hit Points"

Custom Description:
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
- `buffConfig.effects[]` - Array of effect objects
  - `effect.id` / `effect.name`
  - `effect.statModifier.stat`
  - `effect.statModifier.magnitude`
  - `effect.statModifier.magnitudeType` ('flat' or 'percentage')
  - `effect.description`
- `buffConfig.durationValue` / `buffConfig.duration`
- `buffConfig.durationType` ('instant', 'rounds', 'turns', 'permanent', 'rest', 'minutes', 'hours')
- `buffConfig.durationUnit`
- `buffConfig.concentrationRequired` (boolean)
- `buffConfig.canBeDispelled` (boolean)
- `buffConfig.maxStacks` (number)
- `buffConfig.stackingRule` ('replace', 'stack', 'refresh')
- `buffConfig.customDescription` (string)

#### Debuff Effects

**Display Format:**
Similar to Buff Effects but with negative values:
```
Stat Reductions:
  "-{magnitude} {statName}" or "-{magnitude}% {statName}"
  Example: "-2 Strength" or "-10% Intelligence"

Status Effects:
  "{effectName}: {effectDescription}"
  Example: "Slow: -10 feet movement speed"

Progressive Debuffs:
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

**Display Format:**
```
"{resourceType} Restoration: {formula}"

Over Time:
  "{formula} per {tickFrequency} for {duration} {tickFrequency}s"
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
- `inferno_required`: "Requires Inferno Level {amount}"
- `inferno_ascend`: "Ascend Inferno +{amount}"
- `inferno_descend`: "Descend Inferno -{amount}"

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

**Fields Used:**
- `resourceCost.resourceTypes[]` - Array of selected resource types
- `resourceCost.resourceValues{}` - Object mapping resource types to values
- `resourceCost.resourceFormulas{}` - Object mapping resource types to formulas
- `resourceCost.useFormulas{}` - Object mapping resource types to boolean
- `resourceCost.actionPoints` (number)
- `resourceCost.mana` (number)
- `resourceCost.channelingFrequency` (string, CHANNELED spells only)
- `resourceCost.components[]` - Array of component strings ('V', 'S', 'M')
- `resourceCost.materialComponents` (string)
- `resourceCost.verbalText` (string)
- `resourceCost.somaticText` (string)

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
- `cooldownConfig.type` ('turn_based', 'short_rest', 'long_rest', 'charge_based', 'dice_based')
- `cooldownConfig.value` (number)
- `cooldownConfig.charges` (number, charge_based only)
- `cooldownConfig.recovery` (number, charge_based only)

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
- `triggerConfig.global.logicType` ('AND', 'OR')
- `triggerConfig.global.compoundTriggers[]` - Array of trigger objects
- `triggerConfig.effectTriggers{}` - Object mapping effect types to trigger configs
- `triggerConfig.conditionalEffects{}` - Object tracking conditional activation
- `triggerConfig.triggerRole` (object)

**Display Format:**
```
"Triggers: {condition1} AND {condition2}"
"Auto-cast when: {conditions}"
"Conditional: {formula} when {condition} else {defaultFormula}"
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
- `channelingConfig.type` ('power_up', 'persistent', 'staged')
- `channelingConfig.baseFormula` (string)
- `channelingConfig.maxFormula` (string, power_up)
- `channelingConfig.tickFrequency` (string)
- `channelingConfig.stages[]` (array, staged type)
- `channelingConfig.maxDuration` (number, power_up)

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
  utilityConfig: object,
  controlConfig: object,
  summoningConfig: object,
  transformationConfig: object,
  purificationConfig: object,
  restorationConfig: object,
  
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
- **specialMechanics** (object):
  ```javascript
  {
    enabled: boolean,
    system: 'COMBO_POINTS' | 'PROC_SYSTEM' | 'STATE_REQUIREMENTS' | 
            'FORM_SYSTEM' | 'TOXIC_SYSTEM' | 'CHORD_SYSTEM',
    type: string, // System-specific type
    thresholdValue: number,
    
    // Combo system
    comboOptions: {
      generationMethod: string,
      consumptionRule: 'all' | 'partial',
      visualStyle: 'points' | 'bars'
    },
    
    // Toxic system
    toxicOptions: {
      selectedToxicTypes: object, // Map of toxic type to count
      duration: number,
      durationType: 'rounds' | 'minutes' | 'hours',
      consumptionRule: 'all' | 'specific',
      modifiedFormula: string,
      toxicEffects: object // Effects per toxic type
    },
    
    // Chord system
    chordOptions: {
      chordFunction: string, // For note spells
      isWildcard: boolean,
      extendDuration: number,
      recipe: string, // For chord spells (e.g., "tonic-mediant-dominant")
      improvisationWindow: number,
      graduatedEffects: object, // Effects for partial matches
      requiredFunctions: object, // Specific functions for partial resolution
      partialMatchType: 'count' | 'specific'
    }
  }
  ```

#### SpellCard Display:
- **Location**: Card body, mechanics section
- **Format**:
  - Combo Points: "Generates X combo points" or "Consumes all combo points for X% increased effect"
  - Toxic: "Applies [Toxic Types]" or "Consumes [Toxic Types] for enhanced effect"
  - Chord: "Plays [Chord Function] note" or "Requires recipe: [Recipe]"
  - Form: "Requires [Form]" or "Grants bonus when in [Form]"

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

