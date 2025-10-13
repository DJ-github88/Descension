# Spell Wizard Step-by-Step Guide

## Table of Contents

1. [Step 1: Basic Info](#step-1-basic-info)
2. [Step 2: Spell Type](#step-2-spell-type)
3. [Step 3: Effects](#step-3-effects)
4. [Step 4: Targeting](#step-4-targeting)
5. [Step 5: Resources](#step-5-resources)
6. [Step 6: Cooldown](#step-6-cooldown)
7. [Step 7: Mechanics](#step-7-mechanics)
8. [Step 7: Triggers](#step-7-triggers)
9. [Step 8: Channeling](#step-8-channeling)
10. [Step 9: Balance](#step-9-balance)
11. [Step 10: Review](#step-10-review)
12. [Rollable Tables](#rollable-tables)
13. [Trap Placement](#trap-placement)

---

## Step 1: Basic Info

### Purpose
Define the spell's identity, classification, and visual appearance.

### File Location
`vtt-react/src/components/spellcrafting-wizard/components/steps/Step1BasicInfo.jsx` (352 lines)

### State Properties Set
- `state.name` - Spell name
- `state.description` - Spell description
- `state.typeConfig.school` - Primary damage type/element
- `state.typeConfig.secondaryElement` - Secondary damage type
- `state.typeConfig.icon` - Spell icon ID
- `state.typeConfig.tags` - Array of spell tags

### Configuration Options

#### Spell Name
**Input:** Text field
**State Path:** `state.name`
**Spell Card Display:** Appears in card header as the spell title
**Example:**
```json
{
  "name": "Fireball"
}
```
**Card Output:** `<h2>Fireball</h2>`

#### Spell Description
**Input:** Textarea
**State Path:** `state.description`
**Spell Card Display:** Appears in card body as the main description
**Example:**
```json
{
  "description": "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame."
}
```
**Card Output:** `<p class="spell-description">A bright streak flashes...</p>`

#### Primary Damage Type (School)
**Input:** Dropdown selection
**State Path:** `state.typeConfig.school`
**Options:**
- **Physical:** bludgeoning, piercing, slashing
- **Elemental:** fire, cold, lightning, acid, thunder
- **Arcane:** force, psychic, radiant, arcane
- **Otherworldly:** necrotic, poison, void, shadow, nature

**Spell Card Display:**
- Determines card color theme
- Appears in damage effect descriptions
- Affects icon background color

**Example:**
```json
{
  "typeConfig": {
    "school": "fire"
  }
}
```
**Card Output:** 
- Card has fire-themed red/orange colors
- Damage displays as "Fire damage"

#### Secondary Element
**Input:** Dropdown selection (optional)
**State Path:** `state.typeConfig.secondaryElement`
**Spell Card Display:** Appears in damage type list if spell deals multiple damage types
**Example:**
```json
{
  "typeConfig": {
    "school": "fire",
    "secondaryElement": "radiant"
  }
}
```
**Card Output:** "Fire and Radiant damage"

#### Spell Icon
**Input:** Icon picker (WoW icon database)
**State Path:** `state.typeConfig.icon`
**Spell Card Display:** Appears in card header as spell icon
**Example:**
```json
{
  "typeConfig": {
    "icon": "spell_fire_flameshock"
  }
}
```
**Card Output:** `<img src="https://wow.zamimg.com/images/wow/icons/large/spell_fire_flameshock.jpg" />`

#### Spell Tags
**Input:** Multi-select checkboxes
**State Path:** `state.typeConfig.tags` (array)
**Available Tags:**
- attack
- healing
- buff
- debuff
- control
- summoning
- utility
- aoe
- single-target
- dot
- hot
- mobility
- defensive
- stealth
- ritual
- concentration

**Spell Card Display:** Appears as badge pills at bottom of card
**Example:**
```json
{
  "typeConfig": {
    "tags": ["attack", "aoe", "dot"]
  }
}
```
**Card Output:**
```html
<div class="spell-tags">
  <span class="tag tag-attack">Attack</span>
  <span class="tag tag-aoe">AOE</span>
  <span class="tag tag-dot">DoT</span>
</div>
```

### Formatting Functions in UnifiedSpellCard.jsx

**Lines 3154-3175:** Tag formatting
```javascript
// Format spell tags
const formatTags = () => {
  const tags = spell.typeConfig?.tags || spell.tags || [];
  if (tags.length === 0) return null;
  
  return tags.map(tag => (
    <span key={tag} className={`spell-tag tag-${tag}`}>
      {tag.replace('_', ' ').toUpperCase()}
    </span>
  ));
};
```

---

## Step 2: Spell Type

### Purpose
Define how the spell is cast, activated, and functions mechanically.

### File Location
`vtt-react/src/components/spellcrafting-wizard/components/steps/Step2SpellType.jsx` (734 lines)

### State Properties Set
- `state.spellType` - Spell type (ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE, ZONE)
- `state.typeConfig.*` - Type-specific configuration properties

### Spell Types

#### ACTION - Standard Cast-Time Spells

**State Path:** `state.spellType = 'ACTION'`

**Configuration Options:**

1. **Cast Time**
   - **Input:** Number field
   - **State Path:** `state.typeConfig.castTime`
   - **Default:** 1
   - **Range:** 1-10
   - **Spell Card Display:** "Cast Time: [castTime] Action[s]"

2. **Cast Time Type**
   - **Input:** Dropdown
   - **State Path:** `state.typeConfig.castTimeType`
   - **Options:**
     - `IMMEDIATE` - Cast immediately
     - `START_OF_TURN` - Cast at start of turn
     - `END_OF_TURN` - Cast at end of turn
   - **Spell Card Display:** Appears in parentheses after cast time

**Example:**
```json
{
  "spellType": "ACTION",
  "typeConfig": {
    "castTime": 1,
    "castTimeType": "IMMEDIATE"
  }
}
```

**Spell Card Output:**
```
Cast Time: 1 Action (Immediate)
```

**Formatting Function (UnifiedSpellCard.jsx lines 504-532):**
```javascript
const formatCastTime = () => {
  if (spell.spellType === 'ACTION') {
    const castTime = spell.typeConfig?.castTime || 1;
    const castTimeType = spell.typeConfig?.castTimeType || 'IMMEDIATE';
    const typeText = castTimeType === 'IMMEDIATE' ? 'Immediate' :
                     castTimeType === 'START_OF_TURN' ? 'Start of Turn' :
                     castTimeType === 'END_OF_TURN' ? 'End of Turn' : '';
    return `${castTime} Action${castTime > 1 ? 's' : ''} (${typeText})`;
  }
  // ... other spell types
};
```

#### CHANNELED - Sustained Spells

**State Path:** `state.spellType = 'CHANNELED'`

**Configuration Options:**

1. **Maximum Channel Duration**
   - **Input:** Number field
   - **State Path:** `state.typeConfig.maxChannelDuration`
   - **Default:** 4
   - **Range:** 1-10
   - **Spell Card Display:** "Channeled (up to [maxChannelDuration] [durationUnit])"

2. **Duration Unit**
   - **Input:** Dropdown
   - **State Path:** `state.typeConfig.durationUnit`
   - **Options:** 'TURNS', 'ROUNDS'
   - **Default:** 'TURNS'

3. **Tick Frequency**
   - **Input:** Dropdown
   - **State Path:** `state.typeConfig.tickFrequency`
   - **Options:** 'per_turn', 'per_round', 'per_second'
   - **Spell Card Display:** "Effects trigger [tickFrequency]"

4. **Concentration DC**
   - **Input:** Number field
   - **State Path:** `state.typeConfig.concentrationDC`
   - **Default:** 10
   - **Range:** 5-30
   - **Spell Card Display:** "Concentration: DC [concentrationDC] [dcType]"

5. **DC Type (Concentration Stat)**
   - **Input:** Dropdown
   - **State Path:** `state.typeConfig.dcType`
   - **Options:** STRENGTH, AGILITY, CONSTITUTION, INTELLIGENCE, SPIRIT, CHARISMA
   - **Default:** CONSTITUTION

6. **Interruptible**
   - **Input:** Checkbox
   - **State Path:** `state.typeConfig.interruptible`
   - **Default:** true
   - **Spell Card Display:** "Interruptible" or "Uninterruptible"

7. **Movement Allowed**
   - **Input:** Checkbox
   - **State Path:** `state.typeConfig.movementAllowed`
   - **Default:** false
   - **Spell Card Display:** "Movement Allowed" or "Movement Restricted"

**Example:**
```json
{
  "spellType": "CHANNELED",
  "typeConfig": {
    "maxChannelDuration": 4,
    "durationUnit": "TURNS",
    "tickFrequency": "per_turn",
    "concentrationDC": 12,
    "dcType": "CONSTITUTION",
    "interruptible": true,
    "movementAllowed": false
  }
}
```

**Spell Card Output:**
```
Cast Time: Channeled (up to 4 turns)
Concentration: DC 12 Constitution
Interruptible
Movement Restricted
```

#### PASSIVE - Always-Active Abilities

**State Path:** `state.spellType = 'PASSIVE'`

**Configuration Options:**

1. **Toggleable**
   - **Input:** Checkbox
   - **State Path:** `state.typeConfig.toggleable`
   - **Default:** false
   - **Spell Card Display:** "(Can be toggled)" or "(Always active)"

**Example:**
```json
{
  "spellType": "PASSIVE",
  "typeConfig": {
    "toggleable": true
  }
}
```

**Spell Card Output:**
```
Cast Time: Passive (Can be toggled)
```

#### REACTION - Triggered Responses

**State Path:** `state.spellType = 'REACTION'`

**Configuration Options:**

1. **Availability Type**
   - **Input:** Dropdown
   - **State Path:** `state.typeConfig.availabilityType`
   - **Options:**
     - `ALWAYS` - Always available
     - `PREPARED` - Must be prepared
     - `CONDITIONAL` - Conditional availability
   - **Default:** 'ALWAYS'

2. **Limit Uses Per Turn**
   - **Input:** Checkbox
   - **State Path:** `state.typeConfig.limitUsesPerTurn`
   - **Default:** false

3. **Uses Per Turn**
   - **Input:** Number field (only if limitUsesPerTurn is true)
   - **State Path:** `state.typeConfig.usesPerTurn`
   - **Default:** 1
   - **Range:** 1-5

**Example:**
```json
{
  "spellType": "REACTION",
  "typeConfig": {
    "availabilityType": "ALWAYS",
    "limitUsesPerTurn": true,
    "usesPerTurn": 1
  }
}
```

**Spell Card Output:**
```
Cast Time: Reaction
Availability: Always Available
Uses Per Turn: 1
```

---

## Step 3: Effects

### Purpose
Define what the spell actually does - damage, healing, buffs, etc.

### File Location
`vtt-react/src/components/spellcrafting-wizard/components/steps/Step3Effects.jsx` (687 lines)

### Overview
This step allows selection of multiple effect types. Each effect type has its own detailed configuration component.

### Effect Types Available

1. **damage** - Deal damage to targets
2. **healing** - Restore health to targets
3. **buff** - Apply positive status effects
4. **debuff** - Apply negative status effects
5. **control** - Crowd control effects (stun, immobilize, etc.)
6. **utility** - Movement, teleportation, invisibility, etc.
7. **summoning** - Summon creatures
8. **transformation** - Polymorph and transformation effects
9. **purification** - Cleansing, dispelling, resurrection
10. **restoration** - Restore resources (mana, stamina, etc.)

### State Properties Set
- `state.effectTypes` - Array of selected effect types
- `state.damageConfig` - Damage effect configuration
- `state.healingConfig` - Healing effect configuration
- `state.buffConfig` - Buff effect configuration
- `state.debuffConfig` - Debuff effect configuration
- `state.controlConfig` - Control effect configuration
- `state.utilityConfig` - Utility effect configuration
- `state.summoningConfig` - Summoning effect configuration
- `state.transformationConfig` - Transformation effect configuration
- `state.purificationConfig` - Purification effect configuration
- `state.restorationConfig` - Restoration effect configuration

### Effect Selection

**Input:** Multi-select cards
**State Path:** `state.effectTypes` (array)
**Spell Card Display:** Each effect type renders its own section on the spell card

**Example:**
```json
{
  "effectTypes": ["damage", "debuff"]
}
```

For detailed documentation on each effect type's configuration options, see [SPELL_WIZARD_EFFECTS_GUIDE.md](./SPELL_WIZARD_EFFECTS_GUIDE.md).

---

## Step 4: Targeting

### Purpose
Define who/what the spell affects, how it reaches targets, and area of effect.

### File Location
`vtt-react/src/components/spellcrafting-wizard/components/steps/Step4Targeting.jsx` (3,679 lines)

This is one of the most complex steps with extensive visualization and configuration options.

### State Properties Set
- `state.targetingConfig` - Complete targeting configuration
- `state.propagation` - Propagation method configuration

### Targeting Types

#### Single Target

**State Path:** `state.targetingConfig.targetingType = 'single'`

**Configuration Options:**

1. **Target Restrictions**
   - **Input:** Multi-select checkboxes
   - **State Path:** `state.targetingConfig.targetRestrictions` (array)
   - **Options:**
     - any, ally, enemy, self, creature, object, undead, construct, location,
     - friendly_player, friendly_npc, hostile_player, hostile_npc, elemental, demon, beast
   - **Spell Card Display:** "Target: [restrictions]"

2. **Selection Method**
   - **Input:** Dropdown
   - **State Path:** `state.targetingConfig.selectionMethod`
   - **Options:**
     - manual - Player selects target
     - nearest - Nearest valid target
     - farthest - Farthest valid target
     - random - Random valid target
     - lowest_health - Target with lowest health
     - highest_health - Target with highest health
   - **Spell Card Display:** Appears in targeting description

**Example:**
```json
{
  "targetingConfig": {
    "targetingType": "single",
    "targetRestrictions": ["enemy"],
    "selectionMethod": "manual"
  }
}
```

**Spell Card Output:**
```
Target: Single enemy
```

#### Multi-Target

**State Path:** `state.targetingConfig.targetingType = 'multi'`

**Additional Configuration:**

1. **Max Targets**
   - **Input:** Number field
   - **State Path:** `state.targetingConfig.maxTargets`
   - **Default:** 3
   - **Range:** 2-10
   - **Spell Card Display:** "Targets: Up to [maxTargets] [restrictions]"

**Example:**
```json
{
  "targetingConfig": {
    "targetingType": "multi",
    "targetRestrictions": ["ally"],
    "maxTargets": 3,
    "selectionMethod": "manual"
  }
}
```

**Spell Card Output:**
```
Targets: Up to 3 allies
```

#### Area Target (AOE)

**State Path:** `state.targetingConfig.targetingType = 'area'`

**Configuration Options:**

1. **AOE Shape**
   - **Input:** Shape selector
   - **State Path:** `state.targetingConfig.aoeShape`
   - **Options:**
     - circle - Circular area
     - cone - Cone-shaped area
     - line - Linear area
     - cube - Cubic area
     - sphere - Spherical area
     - cylinder - Cylindrical area
     - square - Square area
     - rectangle - Rectangular area
     - wall - Wall-shaped area
     - trail - Trail that follows movement
   - **Spell Card Display:** "[shape] ([parameters])"

2. **AOE Parameters** (vary by shape)

   **Circle/Sphere:**
   - `radius` (number, default: 20) - Radius in feet
   - **Spell Card Display:** "[radius]ft radius [shape]"

   **Square/Cube:**
   - `size` (number, default: 15) - Side length in feet
   - **Spell Card Display:** "[size]ft [shape]"

   **Cone:**
   - `range` (number, default: 15) - Cone range in feet
   - `angle` (number, default: 90) - Cone angle in degrees
   - **Spell Card Display:** "[range]ft cone ([angle]°)"

   **Line:**
   - `length` (number, default: 30) - Line length in feet
   - `width` (number, default: 5) - Line width in feet
   - **Spell Card Display:** "[length]ft × [width]ft line"

   **Cylinder:**
   - `radius` (number, default: 10) - Cylinder radius in feet
   - `height` (number, default: 20) - Cylinder height in feet
   - **Spell Card Display:** "[radius]ft radius, [height]ft high cylinder"

**Example:**
```json
{
  "targetingConfig": {
    "targetingType": "area",
    "aoeShape": "circle",
    "aoeParameters": {
      "radius": 20
    },
    "targetRestrictions": ["enemy"]
  }
}
```

**Spell Card Output:**
```
Area: 20ft radius circle
Targets: Enemies in area
```

**Formatting Function (UnifiedSpellCard.jsx lines 606-629):**
```javascript
const formatAoeShape = () => {
  const shape = spell.targetingConfig?.aoeShape;
  const params = spell.targetingConfig?.aoeParameters || {};

  if (shape === 'circle' || shape === 'sphere') {
    return `${params.radius || 20}ft radius ${shape}`;
  } else if (shape === 'square' || shape === 'cube') {
    return `${params.size || 15}ft ${shape}`;
  } else if (shape === 'cone') {
    return `${params.range || 15}ft cone (${params.angle || 90}°)`;
  } else if (shape === 'line') {
    return `${params.length || 30}ft × ${params.width || 5}ft line`;
  }
  // ... other shapes
};
```

### Range Configuration

**State Path:** `state.targetingConfig.rangeType`

**Options:**

1. **Touch**
   - **Value:** 'touch'
   - **Range:** 5 feet
   - **Spell Card Display:** "Range: Touch (5ft)"

2. **Ranged**
   - **Value:** 'ranged'
   - **Additional Config:** `state.targetingConfig.rangeDistance` (number)
   - **Default:** 30 feet
   - **Range:** 5-300 feet
   - **Spell Card Display:** "Range: [rangeDistance]ft"

3. **Sight**
   - **Value:** 'sight'
   - **Range:** 60 feet
   - **Spell Card Display:** "Range: Sight (60ft)"

4. **Unlimited**
   - **Value:** 'unlimited'
   - **Spell Card Display:** "Range: Unlimited"

5. **Self-Centered**
   - **Value:** 'self_centered'
   - **Range:** 0 feet (centered on caster)
   - **Spell Card Display:** "Range: Self"

**Example:**
```json
{
  "targetingConfig": {
    "rangeType": "ranged",
    "rangeDistance": 60
  }
}
```

**Spell Card Output:**
```
Range: 60ft
```

### Propagation Methods

**State Path:** `state.propagation.method`

Propagation defines how spells spread or jump between targets.

**Options:**

1. **None**
   - **Value:** 'none'
   - **No additional configuration**
   - **Spell Card Display:** No propagation text

2. **Chain**
   - **Value:** 'chain'
   - **Parameters:**
     - `count` (number) - Number of chain jumps
     - `range` (number) - Maximum jump distance in feet
     - `decay` (number) - Damage reduction per jump (percentage)
   - **Spell Card Display:** "Chains to [count] additional targets within [range]ft ([-decay]% per jump)"

3. **Bounce**
   - **Value:** 'bounce'
   - **Parameters:**
     - `count` (number) - Number of bounces
     - `range` (number) - Maximum bounce distance
   - **Spell Card Display:** "Bounces [count] times within [range]ft"

4. **Seeking**
   - **Value:** 'seeking'
   - **Parameters:**
     - `count` (number) - Number of seeking projectiles
     - `range` (number) - Seeking range
   - **Spell Card Display:** "Seeks [count] targets within [range]ft"

5. **Explosion**
   - **Value:** 'explosion'
   - **Parameters:**
     - `secondaryRadius` (number) - Explosion radius in feet
   - **Spell Card Display:** "Explodes in [secondaryRadius]ft radius on impact"

6. **Spreading**
   - **Value:** 'spreading'
   - **Parameters:**
     - `spreadRate` (number) - Spread rate in feet per round
   - **Spell Card Display:** "Spreads [spreadRate]ft per round"

7. **Forking**
   - **Value:** 'forking'
   - **Parameters:**
     - `forkCount` (number) - Number of forks
   - **Spell Card Display:** "Forks into [forkCount] projectiles"

**Example:**
```json
{
  "propagation": {
    "method": "chain",
    "parameters": {
      "count": 3,
      "range": 30,
      "decay": 25
    }
  }
}
```

**Spell Card Output:**
```
Chains to 3 additional targets within 30ft (-25% damage per jump)
```

**Formatting Function (UnifiedSpellCard.jsx lines 738-827):**
```javascript
const formatPropagation = () => {
  const method = spell.propagation?.method;
  if (!method || method === 'none') return null;

  const params = spell.propagation?.parameters || {};

  if (method === 'chain') {
    const count = params.count || 2;
    const range = params.range || 30;
    const decay = params.decay || 0;
    return `Chains to ${count} additional targets within ${range}ft${decay > 0 ? ` (-${decay}% per jump)` : ''}`;
  } else if (method === 'explosion') {
    const radius = params.secondaryRadius || 10;
    return `Explodes in ${radius}ft radius on impact`;
  }
  // ... other methods
};
```

---

## Step 5: Resources

### Purpose
Define the resource costs and spell components required to cast the spell.

### File Location
`vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx` (546 lines)

### State Properties Set
- `state.resourceCost` - Complete resource cost configuration

### Resource Types

**Available Resources:**
- actionPoints - Action points
- mana - Mana
- rage - Rage
- energy - Energy
- focus - Focus
- soul_shards - Soul shards
- holy_power - Holy power
- astral_power - Astral power
- health - Health (life cost)

### Configuration Options

1. **Resource Type Selection**
   - **Input:** Multi-select checkboxes
   - **State Path:** `state.resourceCost.resourceTypes` (array)
   - **Spell Card Display:** Each resource appears with its cost

2. **Resource Values**
   - **Input:** Number fields (one per selected resource)
   - **State Path:** `state.resourceCost.resourceValues` (object)
   - **Format:** `{ resourceType: value }`
   - **Spell Card Display:** "[value] [resourceType]"

3. **Use Formulas**
   - **Input:** Checkbox per resource
   - **State Path:** `state.resourceCost.useFormulas` (object)
   - **Format:** `{ resourceType: boolean }`
   - **If true, shows formula input instead of fixed value**

4. **Resource Formulas**
   - **Input:** Text fields (if useFormulas is true)
   - **State Path:** `state.resourceCost.resourceFormulas` (object)
   - **Format:** `{ resourceType: "formula" }`
   - **Example:** `"10 + INT/2"`
   - **Spell Card Display:** "[formula] [resourceType]"

**Example (Fixed Values):**
```json
{
  "resourceCost": {
    "resourceTypes": ["mana", "actionPoints"],
    "resourceValues": {
      "mana": 50,
      "actionPoints": 2
    },
    "useFormulas": {
      "mana": false,
      "actionPoints": false
    }
  }
}
```

**Spell Card Output:**
```
Cost: 50 Mana, 2 Action Points
```

**Example (With Formulas):**
```json
{
  "resourceCost": {
    "resourceTypes": ["mana"],
    "resourceValues": {},
    "resourceFormulas": {
      "mana": "30 + INT * 2"
    },
    "useFormulas": {
      "mana": true
    }
  }
}
```

**Spell Card Output:**
```
Cost: (30 + INT × 2) Mana
```

### Spell Components

**State Path:** `state.resourceCost.components`

**Component Types:**

1. **Verbal (V)**
   - **Input:** Checkbox
   - **State Path:** `state.resourceCost.components.verbal`
   - **Additional:** `state.resourceCost.verbalText` (optional custom text)
   - **Spell Card Display:** "V" badge or custom text

2. **Somatic (S)**
   - **Input:** Checkbox
   - **State Path:** `state.resourceCost.components.somatic`
   - **Additional:** `state.resourceCost.somaticText` (optional custom text)
   - **Spell Card Display:** "S" badge or custom text

3. **Material (M)**
   - **Input:** Checkbox
   - **State Path:** `state.resourceCost.components.material`
   - **Additional:** `state.resourceCost.materialComponents` (required text describing materials)
   - **Spell Card Display:** "M ([materialComponents])"

**Example:**
```json
{
  "resourceCost": {
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true
    },
    "materialComponents": "A tiny ball of bat guano and sulfur"
  }
}
```

**Spell Card Output:**
```
Components: V, S, M (A tiny ball of bat guano and sulfur)
```

**Formatting Function (UnifiedSpellCard.jsx lines 1443-1515):**
```javascript
const formatSpellComponents = () => {
  const components = [];
  const comp = spell.resourceCost?.components || {};

  if (comp.verbal) {
    components.push(spell.resourceCost?.verbalText || 'V');
  }
  if (comp.somatic) {
    components.push(spell.resourceCost?.somaticText || 'S');
  }
  if (comp.material) {
    const materials = spell.resourceCost?.materialComponents;
    components.push(materials ? `M (${materials})` : 'M');
  }

  return components.length > 0 ? `Components: ${components.join(', ')}` : null;
};
```

---

*Continued in next section...*

