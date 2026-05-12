# Spell Data Structure Reference & AI Generation Guide

> **THE single source of truth for creating, validating, and formatting spells in Mythrill VTT.**
> This file unifies ALL formatting rules, wizard step mappings, card rendering expectations,
> and class-specific patterns into ONE easy-to-follow reference.

---

## HOW TO USE THIS FILE

1. **New spell?** → Follow the 5-Minute Spell Template (Section 1)
2. **Fixing a spell?** → Run the Audit Checklist (Section 7)
3. **Adding triggers?** → See Trigger System (Section 12)
4. **Adding mechanics?** → See Mechanics System (Section 14)
5. **Channeling spell?** → See Channeling System (Section 15)
6. **Status effects?** → See Status Effects (Section 16)
7. **Rollable table?** → See Rollable Tables (Section 17)
8. **Trap spell?** → See Trap Config (Section 18)
9. **Per-effect targeting?** → See Per-Effect Targeting (Section 19)
10. **Saving throws?** → See Saving Throws (Section 20)
11. **Class-specific resources?** → See Class Resources (Section 8)
12. **Not sure about a field?** → Look up the Field Map (Section 4)

---

# Section 1: The 5-Minute Spell Template

Copy this. Fill it in. Done.

```javascript
{
  // ━━━ IDENTITY (required) ━━━
  id: 'unique_spell_id',              // lowercase, underscores
  name: 'Spell Name',
  description: 'Flavor text here.',
  level: 1,                           // 1-9
  spellType: 'ACTION',                // UPPERCASE: ACTION | CHANNELED | PASSIVE | REACTION | TRAP | STATE
  icon: 'Category/Icon Name',         // e.g., 'Fire/Fire Bolt', 'Healing/Golden Heart'

  // ━━━ EFFECTS (required) ━━━
  effectTypes: ['damage'],            // ONLY list types that have a *Config below

  // ━━━ TYPE CONFIG (required) ━━━
  typeConfig: {
    school: 'fire',                   // MUST be a damage type ID, NOT a D&D school name
    icon: 'Fire/Fire Bolt',           // same as top-level icon
    tags: ['fire', 'damage'],
    castTime: 1,
    castTimeType: 'IMMEDIATE'
  },

  // ━━━ TARGETING (required) ━━━
  targetingConfig: {
    targetingType: 'single',          // single | area | self | chain | cone | line
    rangeType: 'ranged',              // melee | ranged | self | touch | self_centered
    rangeDistance: 60,                 // feet (number)
    targetRestrictions: ['enemies'],   // ['enemies'] | ['ally'] | ['self'] | ['any']
    // areaShape: 'circle',           // only if targetingType is area/cone/line
    // areaSize: 20,                  // only if targetingType is area/cone/line
  },

  // ━━━ RESOURCES (required) ━━━
  resourceCost: {
    actionPoints: 1,                  // ALWAYS set this (1-5)
    mana: 5,                          // number, 0 if free
    components: ['verbal', 'somatic'], // optional
  },

  // ━━━ COOLDOWN (required) ━━━
  cooldownConfig: {
    cooldownType: 'turn_based',       // turn_based | short_rest | long_rest | charge_based | encounter
    cooldownValue: 0,                 // number of turns (0 = no cooldown)
  },

  // ━━━ DURATION (if not instant) ━━━
  // durationConfig: {
  //   durationType: 'rounds',
  //   durationValue: 3,
  //   durationUnit: 'rounds',       // MUST match durationType
  // },

  // ━━━ EFFECT CONFIGS (add ONLY what effectTypes lists) ━━━
  damageConfig: {
    formula: '2d6 + intelligence/3',  // dice formula string
    damageTypes: ['fire'],            // ALWAYS an array, NEVER a string
    resolution: 'DICE',               // DICE | CARDS | COINS | PROPHECY
    // dotConfig: { ... },            // only for damage-over-time
    // savingThrow: { ... },          // only if there's a save
    // criticalConfig: { ... },       // only if crits are special
  },

  tags: ['fire', 'damage']
}
```

---

# Section 2: The 7 Unbreakable Rules

These rules are NON-NEGOTIABLE. Breaking them causes rendering bugs.

## Rule 1: `effectTypes` must match actual configs

```
effectTypes: ['damage']  →  damageConfig MUST exist
effectTypes: ['healing'] →  healingConfig MUST exist
effectTypes: ['buff']    →  buffConfig MUST exist
effectTypes: ['debuff']  →  debuffConfig MUST exist
```

If you have a config but no effectType, the card won't render that effect.
If you have an effectType but no config, the card shows empty/broken.

## Rule 2: `damageTypes` is ALWAYS an array

```javascript
// CORRECT:
damageTypes: ['fire']
damageTypes: ['fire', 'necrotic']

// WRONG — will not render damage type badge:
damageType: 'fire'           // singular, deprecated
damageTypes: 'fire'          // string, not array
```

## Rule 3: `school` goes in `typeConfig` using damage type IDs

```javascript
// CORRECT:
typeConfig: { school: 'fire' }
typeConfig: { school: 'necrotic' }

// WRONG:
school: 'Evocation'          // D&D school name
school: 'fire'               // top-level (should be in typeConfig)
typeConfig: { school: 'Fire' }  // capitalized
```

Valid school IDs: `fire`, `frost`, `lightning`, `arcane`, `nature`, `force`,
`necrotic`, `radiant`, `poison`, `psychic`, `chaos`, `void`, `bludgeoning`,
`piercing`, `slashing`, `physical`, `holy`, `shadow`, `cold`, `ice`, `thunder`, `acid`

## Rule 4: `actionPoints` is ALWAYS set

```javascript
resourceCost: {
  actionPoints: 1,    // ALWAYS a number (0 for free, 1-5 normal)
  mana: 5,
}
```

## Rule 5: `resolution` goes INSIDE the effect config

```javascript
// CORRECT:
damageConfig: { formula: '2d6', damageTypes: ['fire'], resolution: 'DICE' }
damageConfig: { formula: '2d6', damageTypes: ['fire'], resolution: 'PROPHECY' }

// ALSO ACCEPTABLE (top-level is read by some paths):
resolution: 'DICE',
damageConfig: { formula: '2d6', damageTypes: ['fire'] }

// WRONG (will confuse the card):
resolution: 'dice'           // must be UPPERCASE
```

Valid values: `DICE`, `CARDS`, `COINS`, `PROPHECY`, `SAVE`, `NONE`, `AUTOMATIC`

## Rule 6: `cooldownConfig` uses consistent keys

```javascript
// THE ONE PATTERN TO USE:
cooldownConfig: {
  cooldownType: 'turn_based',
  cooldownValue: 3
}

// DO NOT USE (inconsistent across codebase):
cooldownConfig: { type: 'turn_based', value: 3 }      // different key names
cooldownConfig: { cooldown: 3, charges: 1 }            // yet another pattern
```

## Rule 7: Buff/Debuff effects use objects, not strings

```javascript
// CORRECT:
buffConfig: {
  effects: [
    { id: 'str_boost', name: 'Strength Boost', description: '+2 Strength for 3 rounds', mechanicsText: '' }
  ]
}

// WRONG:
buffConfig: {
  effects: ['Strength Boost']        // bare string
}
buffConfig: {
  statModifiers: [{ stat: 'str', magnitude: 2 }]   // old format, prefer effects[]
}
```

---

# Section 3: Effect Config Reference

Each effect type has its own config. Only include configs for types in `effectTypes`.

## damageConfig

```javascript
damageConfig: {
  formula: '3d6 + intelligence/3',     // required: dice formula
  damageTypes: ['fire'],                // required: always array
  resolution: 'DICE',                   // required: DICE | CARDS | COINS | PROPHECY

  // Optional: Damage over time
  dotConfig: {
    enabled: true,
    damagePerTick: '1d4',
    damageType: 'fire',
    tickFrequency: 'round',
    duration: 3,
    canStack: false,
    maxStacks: 1
  },

  // Optional: Saving throw
  savingThrow: {
    ability: 'agility',                 // strength | agility | constitution | intelligence | spirit | charisma
    difficultyClass: 14,
    saveOutcome: 'half_damage'          // negates | half_damage | no_effect | damage_on_fail
  },
  // Shorthand: difficultyClass: 14 (alternative to savingThrow object)

  // Optional: Critical hit
  criticalConfig: {
    enabled: true,
    critMultiplier: 2,
    critRange: [20],                    // e.g., [19, 20] for expanded crit
    critBonusDamage: '2d6'
  },

  // Optional: Chance on hit (proc)
  chanceOnHitConfig: {
    enabled: true,
    procChance: 15,                     // percentage
    effectType: 'buff',
    effectDetails: 'Burning: 1d6 fire for 2 rounds'
  },

  // Optional: Chain/lightning
  chainConfig: {
    enabled: true,
    chainCount: 3,
    chainRange: 15,
    damageFalloff: 0.7
  }
}
```

## healingConfig

```javascript
healingConfig: {
  formula: '2d8 + spirit',             // required
  healingType: 'direct',               // direct | hot | regeneration | vampiric | conditional
  resolution: 'DICE',                   // DICE | CARDS | COINS

  // Optional: Heal over time
  hotConfig: {
    enabled: true,
    healingPerTick: '1d6',
    tickFrequency: 'round',
    duration: 3
  },

  // Optional: Shield/absorption
  shieldConfig: {
    enabled: true,
    shieldAmount: '3d8 + spirit',
    shieldDuration: 3,
    shieldDurationType: 'rounds'
  },

  // Optional: Critical heals
  criticalConfig: {
    enabled: true,
    critMultiplier: 2,
    critBonusHealing: '2d8'
  }
}
```

## buffConfig

```javascript
buffConfig: {
  buffType: 'statEnhancement',         // statEnhancement | damageIncrease | damageMitigation |
                                        // statusEffectBuff | combatAdvantage | auraEffect |
                                        // movementBuff | triggeredEffect | custom
  effects: [                           // PRIMARY: always use this array
    {
      id: 'str_boost',
      name: 'Strength Boost',
      description: '+2 Strength for 3 rounds',    // ALL readable info here
      mechanicsText: '',                           // EMPTY when description has info
      statModifier: {
        stat: 'strength',
        magnitude: 2,
        magnitudeType: 'flat'            // flat | percentage
      }
    }
  ],
  durationType: 'rounds',               // MUST match durationUnit
  durationValue: 3,
  durationUnit: 'rounds',
  concentrationRequired: false,
  canBeDispelled: true
}
```

## debuffConfig

```javascript
debuffConfig: {
  debuffType: 'statusEffect',           // statPenalty | statusEffect | damageOverTime |
                                         // movementImpairment | fullControl | curse | mentalEffect
  effects: [
    {
      id: 'slowed',
      name: 'Slowed',
      description: 'Movement speed reduced by 15 feet. DC 14 Con save.',
      mechanicsText: ''
    }
  ],
  statPenalties: [                      // Alternative/addition to effects[]
    { stat: 'movement_speed', magnitude: -15, magnitudeType: 'flat' }
  ],
  savingThrow: {
    ability: 'constitution',
    difficultyClass: 14,
    saveOutcome: 'negates'              // negates | half | reduced_duration
  },
  durationType: 'rounds',
  durationValue: 2,
  durationUnit: 'rounds',
  canBeDispelled: true
}
```

## utilityConfig / controlConfig / summoningConfig / transformationConfig / purificationConfig / restorationConfig

```javascript
utilityConfig: {
  utilityType: 'movement',              // movement | protection | fate_manipulation | ...
  selectedEffects: [
    { id: 'teleport', name: 'Teleport', description: 'Teleport up to 30 feet' }
  ],
  duration: 1,
  durationUnit: 'rounds'
}

controlConfig: {
  controlType: 'incapacitation',        // forcedMovement | illusion | mind_control | zone | incapacitation
  effects: [
    { id: 'stun', name: 'Stunned', description: 'Cannot act for 1 round. DC 15 Con.', config: { duration: 1 } }
  ],
  savingThrow: { ability: 'constitution', difficultyClass: 15 },
  duration: 1,
  durationUnit: 'rounds'
}
```

---

# Section 4: Wizard Steps → Card Fields Map

This shows EXACTLY which wizard step creates which field, and whether the spell card actually renders it.

| Wizard Step | Field | Card Renders? | Notes |
|---|---|---|---|
| **1. Basic Info** | name, description, level, icon | YES | Header + body |
| **2. Spell Type** | spellType | YES | Badge in header |
| **2. Spell Type** | typeConfig.school | YES | Border color + damage badge |
| **2. Spell Type** | typeConfig.tags | YES | Tags footer |
| **3. Effects** | effectTypes[] | YES | Gates which sections render |
| **3. Effects** | damageConfig | YES | Damage section |
| **3. Effects** | healingConfig | YES | Healing section |
| **3. Effects** | buffConfig | YES | Buff section |
| **3. Effects** | debuffConfig | YES | Debuff section |
| **3. Effects** | utilityConfig | YES | Utility section |
| **3. Effects** | controlConfig | YES | Control section |
| **3. Effects** | summoningConfig | YES | Summoning section |
| **3. Effects** | transformationConfig | YES | Transformation section |
| **3. Effects** | purificationConfig | YES | Purification section |
| **3. Effects** | restorationConfig | YES | Restoration section |
| **3. Effects** | rollableTable | YES | Rollable Table Summary |
| **3b. Resolution** | effectResolutions{} | **NO** | Per-effect resolution ignored by card |
| **3c. Mechanics** | effectMechanicsConfigs{} | YES | Mechanics section (combo, toxic, chord, etc.) |
| **3d. Combined** | combinedEffects[] | **NO** | Not rendered by card |
| **3d. Combined** | mechanicsAvailableEffects[] | **NO** | Not rendered by card |
| **4. Targeting** | targetingConfig | YES | Range badge + targeting badge |
| **4. Targeting** | targetingMode: 'effect' | YES | Per-effect targeting badges |
| **4. Targeting** | effectTargeting{} | YES | Per-effect targeting (when mode='effect') |
| **4. Targeting** | targetingTags{} | **NO** | Not rendered by card |
| **4. Duration** | durationConfig | YES | Duration display |
| **4. Persistent** | persistentConfig{} | **NO** | Not rendered by card |
| **4. Propagation** | propagation{} | YES | Propagation badge + bullets |
| **5. Resources** | resourceCost | YES | Resource costs in header |
| **5. Resources** | resourceValues{} (class-specific) | YES | Flattened by normalizer for display |
| **6. Cooldown** | cooldownConfig | YES | Cooldown in footer |
| **7. Mechanics** | mechanicsConfig | YES | Cards/combos/coins/prophecy/etc. |
| **7. Mechanics** | prophecyOptions → prophecyConfig | YES | ProphecySummary component |
| **7b. Triggers** | triggerConfig.global | YES | "Spell Triggers" header |
| **7b. Triggers** | triggerConfig.effectTriggers{} | YES | Per-effect trigger inline |
| **7b. Triggers** | triggerConfig.conditionalEffects{} | YES | Conditional formulas inline |
| **7b. Triggers** | triggerConfig.requiredConditions{} | YES | "Required" section |
| **7b. Triggers** | triggerConfig.buffDebuffTriggers{} | **NO** | Not rendered by card |
| **7b. Triggers** | triggerConfig.triggerRole{} | **NO** | Not rendered by card |
| **7c. Trap** | trapConfig | YES | Trap-specific bullets |
| **8. Channeling** | channelingConfig (basic) | YES | Type-specific bullets |
| **8. Channeling** | channelingConfig.stages[] | **NO** | Individual stages not rendered |
| **Special** | propagation{} | YES | Badge + bullets (chain/bounce/explode) |

---

# Section 5: Resolution Systems

## DICE (default)
```javascript
damageConfig: { formula: '2d6 + intelligence/3', damageTypes: ['fire'], resolution: 'DICE' }
```

## CARDS (Fate Weaver)
```javascript
damageConfig: {
  formula: 'CARD_VALUE + FACE_CARD_COUNT * 5',
  damageTypes: ['arcane'],
  resolution: 'CARDS',
  cardConfig: { drawCount: 3, formula: 'CARD_VALUE + FACE_CARD_COUNT * 5' }
}
```
Card formula variables: `CARD_VALUE`, `FACE_CARD_COUNT`, `ACES`, `HIGHEST_CARD`, `RED_COUNT`, `BLACK_COUNT`, `SAME_SUIT`

## COINS (Gambler)
```javascript
damageConfig: {
  formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)',
  damageTypes: ['psychic'],
  resolution: 'COINS',
  coinConfig: { flipCount: 5, formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)' }
}
```
Coin formula variables: `HEADS_COUNT`, `TAILS_COUNT`, `ALL_HEADS`, `ALL_TAILS`, `LONGEST_STREAK`, `ALTERNATING_PATTERN`

## PROPHECY (Doomsayer)
```javascript
resolution: 'PROPHECY',
mechanicsConfig: [
  {
    enabled: true,
    system: 'PROPHECY',
    prophecy: {
      rangeDice: ['d8', 'd6'],           // dice to roll for range
      resolutionDie: 'd6',                // die that determines outcome
      prophesied: {                        // high roll = prophesied
        damage: '4d8',
        effect: { name: 'Weakened', duration: 2, statModifiers: [{ stat: 'ALL ROLLS', value: -2 }] },
        havocGain: 3,
        description: 'Deals 4d8 necrotic damage and imposes -2 to all rolls for 2 rounds.'
      },
      base: {                              // medium roll = base
        damage: '2d8',
        havocGain: 1,
        description: 'Deals 2d8 necrotic damage.'
      },
      outside: {                           // low roll = outside
        backlash: '1d8 necrotic to self',
        havocGain: 0,
        description: 'The prophecy backfires, dealing 1d8 to you.'
      }
    }
  }
],
damageConfig: { formula: '2d8', damageTypes: ['necrotic'], resolution: 'PROPHECY' }
```

---

# Section 6: resourceCost Patterns

## Standard (most classes)
```javascript
resourceCost: {
  actionPoints: 1,
  mana: 5,
  components: ['verbal', 'somatic']
}
```

## Class-Specific Resources (wizard format)
```javascript
resourceCost: {
  resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
  resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 2,
  components: ['verbal', 'somatic']
}
```

## Class Resource Shorthand
```javascript
resourceCost: {
  actionPoints: 1,
  mana: 6,
  classResource: { type: 'havoc', cost: 3 }    // Doomsayer
}
```

---

# Section 7: Audit Checklist

Run this against EVERY spell. Fix any violation.

- [ ] **`effectTypes` array exists** and lists ONLY types with matching `*Config`
- [ ] **Each effect type has its config** (damage→damageConfig, healing→healingConfig, etc.)
- [ ] **`damageTypes` is an array** (`['fire']` not `'fire'`)
- [ ] **`typeConfig.school` is set** to a damage type ID (not D&D school name)
- [ ] **`resourceCost.actionPoints` is a number** (not missing, not undefined)
- [ ] **`spellType` is UPPERCASE** (`'ACTION'` not `'action'`)
- [ ] **`resolution` is set** inside `damageConfig`/`healingConfig` (DICE/CARDS/COINS/PROPHECY)
- [ ] **`cooldownConfig` uses `{ cooldownType, cooldownValue }`** (not `{ type, value }`)
- [ ] **`durationType` matches `durationUnit`** (both `'rounds'` or both `'turns'`)
- [ ] **`icon` is set** (not missing)
- [ ] **`description` has flavor text** (not empty)
- [ ] **Buff/debuff `effects[]` uses objects** (`{id, name, description}` not bare strings)
- [ ] **PROPHECY spells use `mechanicsConfig`** with `system: 'PROPHECY'`
- [ ] **PROPHECY spells set `resolution: 'PROPHECY'`** in both top-level AND damageConfig
- [ ] **No duplicate info** in both `description` and `mechanicsText` (pick one)
- [ ] **`triggerConfig` compoundTriggers** have valid `id` from trigger type tables (Section 12)
- [ ] **`effectMechanicsConfigs` keys** are valid effect IDs (effect_damage, effect_healing, etc.)
- [ ] **Mechanics `system`** is one of: COMBO_POINTS, PROC_SYSTEM, STATE_REQUIREMENTS, FORM_SYSTEM, TOXIC_SYSTEM, CHORD_SYSTEM, PROPHECY_SYSTEM
- [ ] **Toxic type IDs** are from the valid list (Section 14), not free-text
- [ ] **Chord function IDs** are from the valid list (Section 14), not free-text
- [ ] **CHANNELED spells** have `channelingConfig.type` set to 'power_up', 'persistent', or 'staged'
- [ ] **Per-effect targeting** uses `targetingMode: 'effect'` with `effectTargeting` object
- [ ] **`savingThrow.ability`** uses valid ability name (strength/agility/constitution/intelligence/spirit/charisma)
- [ ] **`savingThrow.saveOutcome`** uses valid outcome (negates/half_damage/no_effect/damage_on_fail/reduced_duration)
- [ ] **Trap spells** have `spellType: 'TRAP'` and `trapConfig` with required fields
- [ ] **`typeConfig.school` matches actual damage types** — NOT `'force'` unless the spell actually deals force damage (normalizer stops at school, ignores damageConfig.damageTypes)
- [ ] **Dual-damage-type spells have `typeConfig.secondaryElement`** — without it, the second type is invisible to the card
- [ ] **No `formula: 'SPECIAL'`** — must be readable dice notation (e.g., `'2d8 × stacks'`)
- [ ] **Prophecy DoT effects use `damagePerRound`** — ProphecySummary reads `prophesied.effect.damagePerRound`, NOT `dotFormula`
- [ ] **Prophecy descriptions have exact numbers** — not vague text like "massive damage"

---

# Section 8: Class-Specific Resource Reference

| Class | Resource | Where to Put It | Key Fields |
|---|---|---|---|
| **Pyrofiend** | Inferno Veil | `resourceCost.resourceValues` | `inferno_ascend`, `inferno_descend`, `inferno_required` |
| **Chronarch** | Time Shards / Temporal Strain | `resourceCost.resourceValues` | `time_shards_generate`, `time_shards_cost`, `temporal_strain_gain`, `temporal_strain_reduce` |
| **Martyr** | Devotion | Flat top-level props | `devotionRequired`, `devotionGain`, `devotionCost` |
| **Doomsayer** | Havoc | `resourceCost.classResource` | `{ type: 'havoc', cost: 3 }` |
| **Fate Weaver** | Threads of Destiny | `specialMechanics.threadsOfDestiny` | `threads_spend`, `threads_generate` |
| **Gambler** | Fortune Points | `specialMechanics.fortunePoints` | Various gambling mechanics |
| **Minstrel** | Musical Notes/Combos | `musicalCombo` or `specialMechanics.musicalCombo` | `notes`, `cadenceName`, `cadenceNotes` |
| **Chaos Weaver** | Chaos Spheres | `resourceCost.resourceValues` | `chaos_sphere` |
| **Arcanoneer** | Arcane Energy Points | `resourceCost.resourceValues` | `arcane_energy_points` |
| **Alchemist/Toxicologist** | Toxic System | `effectMechanicsConfigs` | `toxicOptions`, `graduatedEffects` |

---

# Section 9: Common Mistakes & Fixes

| Mistake | What Breaks on Card | Fix |
|---|---|---|
| `damageType: 'fire'` (string) | No damage type badge | Use `damageTypes: ['fire']` (array) |
| `school: 'Evocation'` | No border color | Use `typeConfig: { school: 'fire' }` |
| Missing `effectTypes` | No effects render at all | Add `effectTypes: ['damage']` |
| `effectTypes: ['damage']` but no `damageConfig` | Empty damage section | Add matching config |
| `resourceCost: { mana: 10 }` missing `actionPoints` | Shows "No Cost" | Add `actionPoints: 1` |
| `spellType: 'action'` (lowercase) | Badge shows wrong | Use `spellType: 'ACTION'` |
| `cooldownConfig: { type: 'turn_based', value: 3 }` | Inconsistent rendering | Use `{ cooldownType: 'turn_based', cooldownValue: 3 }` |
| `effects: ['Stunned']` (bare string) | May render incorrectly | Use `{ id: 'stun', name: 'Stunned', description: '...' }` |
| `statModifiers` instead of `effects` in buff | Old format, partially handled | Use `effects[]` with `statModifier` inside |
| Top-level `prophecyConfig` | Prophecy block may not render | Use `mechanicsConfig: [{ system: 'PROPHECY', prophecy: {...} }]` |
| Missing `resolution: 'PROPHECY'` in damageConfig | Card shows as DICE instead | Add `resolution: 'PROPHECY'` to both top-level AND damageConfig |
| `durationType: 'rounds'` but `durationUnit: 'turns'` | Wrong duration shown | Both MUST match |
| Both `description` AND `mechanicsText` have info | Duplicate info on card | Put info in ONE place only |

---

# Section 10: Complete Example Spells

## Example 1: Simple Damage Spell (Pyrofiend)
```javascript
{
  id: 'pyro_ember_spark',
  name: 'Ember Spark',
  description: 'Launch a malevolent spark that burrows into the target...',
  level: 1,
  spellType: 'ACTION',
  icon: 'Fire/Flame Burst',
  typeConfig: {
    school: 'fire',
    icon: 'Fire/Flame Burst',
    tags: ['fire', 'damage', 'dot'],
    castTime: 1,
    castTimeType: 'IMMEDIATE'
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 60,
    targetRestrictions: []
  },
  resourceCost: {
    resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
    resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
    useFormulas: {},
    actionPoints: 2,
    components: ['verbal', 'somatic']
  },
  effectTypes: ['damage'],
  damageConfig: {
    formula: '1d6',
    damageTypes: ['fire'],
    resolution: 'DICE',
    dotConfig: {
      enabled: true,
      damagePerTick: '1d4',
      damageType: 'fire',
      tickFrequency: 'round',
      duration: 2,
      canStack: false,
      maxStacks: 1
    }
  },
  durationConfig: { durationType: 'rounds', durationValue: 2, durationUnit: 'rounds' },
  cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
  tags: ['fire', 'damage', 'dot']
}
```

## Example 2: Healing + Buff Spell (Martyr)
```javascript
{
  id: 'martyr_divine_aegis',
  name: 'Divine Aegis',
  description: 'Surround an ally with divine protection.',
  level: 2,
  spellType: 'ACTION',
  icon: 'Radiant/Radiant Divinity',
  typeConfig: {
    school: 'radiant',
    icon: 'Radiant/Radiant Divinity',
    tags: ['healing', 'buff', 'radiant'],
    castTime: 1,
    castTimeType: 'IMMEDIATE'
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['ally']
  },
  resourceCost: {
    resourceTypes: ['mana'],
    resourceValues: { mana: 8 },
    useFormulas: {},
    actionPoints: 1,
    components: ['verbal', 'somatic']
  },
  resolution: 'DICE',
  effectTypes: ['healing', 'buff'],
  healingConfig: {
    formula: '2d6 + spirit',
    healingType: 'direct',
    resolution: 'DICE'
  },
  buffConfig: {
    buffType: 'damageMitigation',
    effects: [
      {
        id: 'radiant_shield',
        name: 'Radiant Shield',
        description: 'Reduces incoming damage by 25% for 2 rounds',
        mechanicsText: '',
        statModifier: { stat: 'damage_reduction', magnitude: 25, magnitudeType: 'percentage' }
      }
    ],
    durationType: 'rounds',
    durationValue: 2,
    durationUnit: 'rounds'
  },
  devotionRequired: 1,
  devotionGain: 1,
  cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
  tags: ['healing', 'buff', 'radiant', 'devotion amplifiable']
}
```

## Example 3: Prophecy Spell (Doomsayer)
```javascript
{
  id: 'doomsayer_doom_bolt',
  name: 'Doom Bolt',
  description: 'Place a prophecy of ruin on a target.',
  spellType: 'ACTION',
  icon: 'Necrotic/Skull Burst',
  school: 'necrotic',
  level: 1,
  effectTypes: ['damage'],
  typeConfig: { school: 'necrotic', castTime: '1 action', castTimeType: 'action' },
  targetingConfig: { targetingType: 'single', rangeDistance: 60, targetRestrictions: ['enemies'] },
  resourceCost: { actionPoints: 1, mana: 6, classResource: { type: 'havoc', cost: 3 } },
  resolution: 'PROPHECY',
  mechanicsConfig: [{
    enabled: true,
    system: 'PROPHECY',
    prophecy: {
      rangeDice: ['d8', 'd6'],
      resolutionDie: 'd6',
      prophesied: {
        damage: '4d8',
        effect: { name: 'Weakened', duration: 2, unit: 'rounds', statModifiers: [{ stat: 'ALL ROLLS', value: -2 }] },
        havocGain: 3,
        description: '4d8 necrotic damage, -2 to all rolls for 2 rounds.'
      },
      base: { damage: '2d8', havocGain: 1, description: '2d8 necrotic damage.' },
      outside: { backlash: '1d8 necrotic to self', havocGain: 0, description: 'Backfires: 1d8 necrotic to you.' }
    }
  }],
  damageConfig: { formula: '2d8', damageTypes: ['necrotic'], resolution: 'PROPHECY' },
  tags: ['damage', 'necrotic', 'prophecy']
}
```

---

# Section 11: Propagation (Chain/Bounce/Explosion)

```javascript
// Chain (lightning bounce between targets)
propagation: { method: 'chain', behavior: 'bounce', count: 3, range: 15, decay: 0.8 }

// Explosion (AoE on impact)
propagation: { method: 'explosion', behavior: 'aoe', secondaryRadius: 10 }

// Forking (split into multiple projectiles)
propagation: { method: 'fork', behavior: 'split', forkCount: 2 }

// Seeking (homing projectile)
propagation: { method: 'seeking', behavior: 'homing' }
```

---

# Section 12: Trigger System

Triggers control when and how spell effects fire. The card renders most trigger sub-objects.

## `triggerConfig` Structure

```javascript
triggerConfig: {
  // ─── Global triggers (fire for the whole spell) ───
  global: {
    logicType: 'AND',           // 'AND' | 'OR'
    compoundTriggers: []        // array of compoundTrigger objects
  },

  // ─── Per-effect triggers (keyed by effect type) ───
  effectTriggers: {
    damage: { logicType: 'AND', compoundTriggers: [] },
    healing: { logicType: 'AND', compoundTriggers: [] },
    buff:    { logicType: 'AND', compoundTriggers: [] },
    // Keys can also be subtypes: damage_direct, damage_dot, damage_area,
    // damage_combined, healing_direct, healing_hot, healing_shield
  },

  // ─── Conditional formulas (replace base formula when trigger fires) ───
  conditionalEffects: {
    damage: {
      isConditional: true,
      defaultEnabled: false,
      conditionalFormulas: {
        'health_below_30': '2d6 + INT',   // trigger ID → alternate formula
        'default': '1d6 + INT/2'          // fallback
      }
    }
  },

  // ─── Required conditions (must be met BEFORE casting) ───
  requiredConditions: {
    enabled: false,
    logicType: 'AND',           // 'AND' | 'OR'
    conditions: []              // array of compoundTrigger objects
  },

  // ─── Buff/debuff trigger chains (NOT rendered on card) ───
  buffDebuffTriggers: {
    buff: { triggers: [...], triggersEffect: 'restoration' }
  },

  // ─── Trigger role mode (NOT rendered on card) ───
  triggerRole: { mode: 'CONDITIONAL' }
}
```

## `compoundTrigger` Object

Each item in `compoundTriggers` / `conditions` arrays:

```javascript
{
  id: 'damage_taken',             // trigger type ID (see tables below)
  category: 'combat',             // category for grouping
  name: 'Damage Taken',           // human-readable name
  parameters: {                   // varies by trigger type
    amount: 50,                   // numeric threshold
    damage_type: 'any',           // filter
    perspective: 'self',          // 'self' | 'target' | 'ally' | 'enemy' | 'any'
    comparison: 'less_than',      // 'less_than' | 'greater_than' | 'equal' | 'below' | 'above'
    percentage: 50                // percentage threshold
  }
}
```

## Class Data (Legacy) Trigger Format

Pre-built class spells use a simpler `triggers` array:

```javascript
triggerConfig: {
  triggers: [
    {
      id: 'escalation_tick',
      name: 'Doom Escalation',
      triggerType: 'start_of_turn',    // on_cast | start_of_turn | end_of_turn | passive_aura
      action: 'Increase bonus damage by 1d6'
    }
  ]
}
```

## All Valid Trigger Type IDs

### Combat Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `damage_taken` | Damage Taken | amount, damage_type, perspective |
| `damage_dealt` | Damage Dealt | amount, damage_type, perspective |
| `critical_hit` | Critical Hit | perspective |
| `critical_hit_taken` | Critical Hit Taken | perspective |
| `miss` | Attack Miss | perspective |
| `dodge` | Dodge | perspective |
| `parry` | Parry | perspective |
| `block` | Block | perspective |
| `spell_reflect` | Spell Reflection | perspective |
| `spell_interrupt` | Spell Interrupt | perspective |
| `spell_resist` | Spell Resist | perspective |
| `combat_start` | Combat Start | (none) |
| `combat_end` | Combat End | (none) |
| `first_strike` | First Strike | perspective |
| `last_stand` | Last Stand | (none) |

### Movement Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `movement_start` | Movement Start | perspective |
| `movement_end` | Movement End | perspective |
| `distance_moved` | Distance Moved | distance, perspective |
| `enter_area` | Enter Area | area_type, perspective |
| `leave_area` | Leave Area | area_type, perspective |
| `proximity` | Proximity | distance, entity_type |
| `forced_movement` | Forced Movement | perspective |
| `high_ground` | High Ground | perspective |
| `falling` | Falling | perspective |

### Health Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `health_threshold` | Health Threshold | percentage, comparison, perspective |
| `health_change` | Health Change | amount, is_percent, perspective |
| `resource_threshold` | Resource Threshold | resource_type, threshold_value, threshold_type, comparison, perspective |
| `ally_health` | Ally Health | percentage, comparison |
| `on_death` | On Death | target_type |
| `on_revival` | On Revival | target_type |
| `near_death` | Near Death | health_threshold, target_type |
| `death_save_success` | Death Save Success | target_type |
| `death_save_failure` | Death Save Failure | target_type |
| `full_health` | Full Health | perspective |
| `overhealing` | Overhealing | perspective |

### Status Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `effect_applied` | Effect Applied | effect_type, perspective |
| `effect_removed` | Effect Removed | effect_type, perspective |
| `effect_duration` | Effect Duration | effect_type, duration, perspective |
| `effect_stack` | Effect Stack | effect_type, stack_count, perspective |
| `dispel` | Dispel | effect_type, perspective |
| `cleanse` | Cleanse | effect_type, perspective |
| `immunity` | Immunity | effect_type, perspective |

### Trap Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `stepped_on` | Stepped On | creature_type |
| `interaction` | Interaction | interaction_type |
| `line_of_sight` | Line of Sight | creature_type |
| `detection_attempt` | Detection Attempt | (none) |
| `disarm_attempt` | Disarm Attempt | (none) |
| `timer` | Timer | time |
| `weight_pressure` | Weight/Pressure | weight_threshold |
| `magical_trigger` | Magical Trigger | magic_type |
| `trap_chain` | Trap Chain | (none) |

### Environment Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `weather_change` | Weather Change | weather_type |
| `terrain_type` | Terrain Type | terrain_type |
| `day_night` | Day/Night Cycle | is_day |
| `object_interaction` | Object Interaction | object_type |
| `environmental_damage` | Environmental Damage | damage_type |
| `underwater` | Underwater | (none) |
| `in_darkness` | In Darkness | (none) |
| `in_bright_light` | In Bright Light | (none) |

### Time Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `turn_start` | Turn Start | whose_turn |
| `turn_end` | Turn End | whose_turn |
| `round_start` | Round Start | (none) |
| `round_end` | Round End | (none) |
| `cooldown_ready` | Cooldown Ready | ability_id |
| `duration_threshold` | Duration Threshold | duration, comparison |

### Card Rendering Summary

| Trigger Sub-Object | Renders? | Where on Card |
|---|---|---|
| `global.compoundTriggers` | YES | "Spell Triggers" header before effects |
| `requiredConditions` | YES | "Required" section with logic badge (ALL/ANY) |
| `effectTriggers[effectType]` | YES | Inline above each effect section |
| `conditionalEffects[effectType]` | YES | Inline with effect formulas (trigger name + alternate formula) |
| `buffDebuffTriggers` | NO | Pipeline gap |
| `triggerRole` | NO | Pipeline gap |

---

# Section 13: Critical Hit Config

Each effect config (`damageConfig`, `healingConfig`) can include `criticalConfig`:

```javascript
criticalConfig: {
  enabled: true,
  critMultiplier: 2,            // damage/healing multiplier on crit (default 2)
  critRange: [20],              // which natural rolls crit: [20] standard, [19, 20] expanded
  critBonusDamage: '2d6',       // extra dice rolled on crit (damage only)
  critBonusHealing: '2d8',      // extra dice rolled on crit (healing only)
}
```

### Rules
- `critMultiplier` defaults to 2 if not specified
- `critRange` is always an array of integers. Standard: `[20]`. Expanded: `[19, 20]`. Wide: `[18, 19, 20]`
- `critBonusDamage` / `critBonusHealing` are optional dice formula strings added on top of multiplied damage
- Only set `criticalConfig` when crit behavior differs from default (natural 20 = 2x)

---

# Section 14: Mechanics System

The wizard has TWO mechanics structures that coexist:

1. **`effectMechanicsConfigs`** (per-effect, primary) — keyed by effect ID strings
2. **`mechanicsConfig`** (global, legacy) — card-level cards/combos/coins/prophecy

## Per-Effect Mechanics (`effectMechanicsConfigs`)

```javascript
effectMechanicsConfigs: {
  effect_damage: { enabled: true, system: 'COMBO_POINTS', type: 'builder', ... },
  effect_healing: { enabled: true, system: 'STATE_REQUIREMENTS', type: 'health_threshold', ... },
}
```

Valid effect ID keys: `effect_damage`, `effect_healing`, `effect_buff`, `effect_debuff`,
`effect_utility`, `effect_control`, `effect_summoning`, `effect_transformation`,
`effect_purification`, `effect_restoration`

## 7 Mechanics Systems

### COMBO_POINTS (Rogue/Warrior style)
```javascript
{
  enabled: true,
  system: 'COMBO_POINTS',
  type: 'builder',                    // 'builder' | 'spender'
  thresholdValue: 1,                  // points generated or required
  comboOptions: {
    generationMethod: 'sinister_strike',  // 'sinister_strike' | 'backstab' | 'mutilate'
    consumptionRule: 'all',               // 'all' | 'threshold' | 'none'
    visualStyle: 'points'
  }
}
```
Card renders: `"Generates 1 combo point"` or `"Requires N combo points (consumes all)"`

### PROC_SYSTEM (Chance-on-hit)
```javascript
{
  enabled: true,
  system: 'PROC_SYSTEM',
  type: 'critical_strike',            // 'critical_strike' | 'on_hit' | 'periodic'
  procOptions: {
    procType: 'critical_strike',
    procChance: 15,                   // 1-100 percentage
    effectType: 'damage',             // matches parent effect type
    triggerLimit: 1,                  // max triggers per round
    spellId: null                     // linked spell from library (optional)
  }
}
```
Card renders: `"15% chance to trigger {spell name} (max 1/round)"`

### STATE_REQUIREMENTS (Conditional power)
```javascript
{
  enabled: true,
  system: 'STATE_REQUIREMENTS',
  type: 'health_threshold',           // 'health_threshold' | 'resource_threshold' | 'combat_state'
  stateOptions: {
    resourceType: 'health',           // 'health' | 'mana' | 'energy' | 'rage' | 'focus'
    thresholdValue: 20,               // 1-100
    thresholdType: 'below',           // 'below' | 'above' | 'equal'
    valueType: 'percentage',          // 'percentage' | 'flat'
    modifiedFormula: '2d6 + INT',    // formula when threshold is met
    combatStateType: 'in_combat',     // 'in_combat' | 'out_of_combat' | 'first_round' | 'below_half_health'
    thresholds: [                     // multiple thresholds (advanced)
      { resourceType, thresholdType, value, valueType, formula, effectDescription }
    ]
  }
}
```
Card renders: `"Enhanced when target health is below 20% (formula becomes: 2d6 + INT)"`

### FORM_SYSTEM (Druid/Shapeshifter)
```javascript
{
  enabled: true,
  system: 'FORM_SYSTEM',
  type: 'bear_form',                  // 'bear_form' | 'cat_form' | 'tree_form' | 'moonkin_form'
  formOptions: {
    formType: 'bear_form',
    requiresForm: false,              // true = spell REQUIRES the form to cast
    bonusType: 'damage',              // 'damage' | 'healing' | 'armor' | 'defense'
    bonusAmount: 20,                  // 1-100 percentage bonus
    formSpellId: null                 // ID of the form spell from library
  }
}
```
Card renders: `"Enhanced by Bear Form (+20% damage)"` or `"Requires Bear Form"`

### TOXIC_SYSTEM (Alchemist/Toxicologist)
```javascript
{
  enabled: true,
  system: 'TOXIC_SYSTEM',
  type: 'toxic_applier',             // 'toxic_applier' | 'toxic_consumer'
  toxicOptions: {
    selectedToxicTypes: { poison: 2, disease: 1 },    // { toxicId: count }
    duration: 3,
    durationType: 'rounds',           // 'rounds' | 'minutes' | 'hours' | 'permanent' | 'until_cured'
    consumptionRule: 'all',           // 'all' | 'specific' | 'threshold'
    updateFormula: false,
    modifiedFormula: '',              // formula when toxics consumed
    graduatedEffects: {               // keyed by level number
      3: { requiredToxicTypes: { poison: 2 }, formula: '3d6+INT', description: '...' }
    }
  }
}
```
Valid toxic type IDs: `disease`, `poison`, `curse`, `venom`, `blight`, `acid`,
`necrosis`, `miasma`, `parasites`, `radiation`, `corruption`, `contagion`

Card renders: `"Applies 2x Poison, 1x Disease for 3 rounds"` (applier)
or `"Consumes 2x Poison for enhanced effects"` (consumer)

### CHORD_SYSTEM (Minstrel/Bard)
```javascript
{
  enabled: true,
  system: 'CHORD_SYSTEM',
  type: 'chord',                     // 'note' | 'chord' | 'wildcard' | 'extender'
  chordOptions: {
    chordFunction: 'tonic',          // 'tonic'|'supertonic'|'mediant'|'subdominant'|'dominant'|'submediant'|'leading_tone'
    isWildcard: false,
    extendDuration: 0,               // rounds to extend improvisation window
    recipe: 'tonic-mediant-dominant', // required note sequence
    recipeDisplay: [],               // [{ id, name, description, color }]
    improvisationWindow: 2,          // rounds to complete recipe
    graduatedEffects: {},            // keyed by level
    partialMatchType: 'count'        // 'count' | 'specific'
  }
}
```
Valid chord functions: `tonic` (I), `supertonic` (ii), `mediant` (iii), `subdominant` (IV),
`dominant` (V), `submediant` (vi), `leading_tone` (vii)

Card renders:
- note: `"Plays Tonic note"`
- chord: `"Requires chord: Tonic → Mediant → Dominant (2 rounds)"`
- wildcard: `"Wildcard note (any chord function)"`
- extender: `"Extends improvisation window by 2 round(s)"`

### PROPHECY_SYSTEM (Doomsayer)
```javascript
{
  enabled: true,
  system: 'PROPHECY_SYSTEM',
  type: 'prophecy_builder',          // 'prophecy_builder' | 'prophecy_detonator'
  prophecyOptions: {
    rangeDice: 'd8+d6',
    resolutionDie: 'd6',
    prophesiedHavoc: 3,
    prophesiedEffect: '',
    baseHavoc: 1,
    baseEffect: '',
    outsideBacklash: '1d6 necrotic to self',
    outsideHavoc: 0
  }
}
```
Card renders via `prophecyConfig` in Section 5 (not via `processMechanicConfig`).

## Global Mechanics (`mechanicsConfig`)

Legacy structure used for prophecy and card/coin/combos at spell level:

```javascript
mechanicsConfig: {
  cards: { generatesCards: true, requiredCards: 3, cardTypes: ['major'], consumeCards: true },
  combos: { type: 'generator', points: 1, scaling: {} },
  coins: { flipCount: 5, effectOnHeads: '...', effectOnTails: '...' },
  stateRequirements: [],
  stateOptions: { thresholds: [] }
}
```

Also used for rollable tables (see Section 17).

---

# Section 15: Channeling System

Only used when `spellType: 'CHANNELED'`. Three sub-types:

## Common Fields
```javascript
channelingConfig: {
  type:              'power_up',     // 'power_up' | 'persistent' | 'staged'
  maxDuration:       3,              // rounds/turns
  durationUnit:      'turns',        // 'turns' | 'rounds' | 'seconds'
  interruptible:     true,           // boolean
  movementAllowed:   false,          // boolean
  costValue:         1,              // resource cost per tick
  costType:          'mana',         // derived from resourceCost
  costTrigger:       'per_turn',     // 'per_turn' | 'per_round' | 'per_second' | 'atStart' | 'atEnd'
}
```

## POWER_UP (Scaling damage/healing over time)
```javascript
channelingConfig: {
  type: 'power_up',
  maxDuration: 3,
  perRoundFormulas: {
    dot_damage: [
      { round: 1, formula: '2d6', description: 'Round 1 damage' },
      { round: 2, formula: '3d6', description: 'Round 2 damage' },
      { round: 3, formula: '4d6', description: 'Round 3 damage' }
    ]
  }
}
```

## PERSISTENT (AoE aura/field that persists)
```javascript
channelingConfig: {
  type: 'persistent',
  maxDuration: 3,
  baseFormula: '5d6 + intelligence',
  tickFrequency: 'round',
  initialRadius: 5,
  maxRadius: 30,
  expansionRate: 5,                   // feet per tick
  persistentRadius: 10,
  persistentEffectType: 'aura',       // 'aura' | 'field' | 'beam'
  maxDamageReduction: 50
}
```

## STAGED (Progressive effect thresholds)
```javascript
channelingConfig: {
  type: 'staged',
  maxDuration: 3,
  stages: [
    { threshold: 1, effect: 'Base Effect', description: 'Initial stage' },
    { threshold: 2, effect: 'Empowered Stage', description: 'Enhanced stage' },
    { threshold: 3, effect: 'Final Stage', description: 'Maximum power' }
  ]
}
```

### Card Rendering
- Header shows **"Channeled"** badge
- Bullets: `"Up to N rounds"`, `"Can be interrupted"` / `"Must stand still"`,
  `"Can move while channeling"` / `"Must stand still"`
- Resource cost shows frequency suffix (e.g. `"5/turn"`)
- `stages[]` individual entries are NOT rendered (pipeline gap)

---

# Section 16: Status Effects

Two locations for status effects on spells:

## A. Top-level `statusEffectsConfig` (separate section on card)

```javascript
statusEffectsConfig: [
  {
    name:          'Doom Aura',
    duration:      5,
    unit:          'rounds',          // default: 'rounds'
    description:   'Nearby enemies feel the crushing weight...',
    statModifiers: [
      { stat: 'ALL ROLLS', value: -2 }
    ]
  }
]
```
Renders as dedicated section with: name, `◆ N unit` badge, description, stat modifier badges.

## B. Inside `buffConfig.statusEffects` / `debuffConfig.statusEffects`

String form (quick):
```javascript
statusEffects: ['invisible']
```

Object form (full):
```javascript
statusEffects: [
  {
    id:          'lifelink',
    name:        'Lifelink',
    description: '...',
    option:      'hp_to_hp',        // sub-type
    // Plus type-specific fields (see table below)
  }
]
```

## Known Status Effect IDs & Their Fields

| Effect ID | Key Fields |
|---|---|
| `luck` | `luckType` ('bonus'/'reroll'/'minimum'/'choose'), `luckBonus`, `appliesTo`, `rerollCount` |
| `haste` | `speedMultiplier`, `extraActions`, `extraAttacks`, `hasLethargy` |
| `regeneration` | `calculationType` ('fixed'/'percentage'/'dice'), `healAmount`, `healPercentage`, `diceCount`, `diceType` |
| `shielded` / `shield` | `shieldAmount`, `shieldType` ('absorb'/'reflect'/'thorns') |
| `burning` | `diceCount`, `diceType`, `damageType`, `canSpread`, `extinguishDC` |
| `stunned` / `stun` | `stunLevel` ('full'/'partial'/'dazed') |
| `charmed` / `charm` | `charmLevel` ('dominated'/'friendly'/'suggestion'), `saveTrigger`, `canAttackCharmer` |
| `invisibility` / `invisible` | `invisibilityType` ('standard'/'greater'/'improved'/'partial'/'full'/'selective'), `breaksOnAttack` |
| `flight` / `flying` | `flySpeed`/`flightSpeed`, `maneuverability` |
| `combat_advantage` | `advantageType` ('attack'/'damage'/'healing'/'saving'/'initiative'/'super') |
| `resistance` | `resistanceType`, `resistanceAmount`/`magnitude` |
| `inspired` | `inspirationType`, `inspirationDie` |
| `blessed` | `blessType` ('protection'/'fortune'/'life') |
| `temporary_hp` | `temporaryHitPoints`/`amount` |
| `truesight` | `truesightRange` |
| `energized` | `bonusActionPoints` |
| `empowered` | `powerIncrease` |
| `lifelink` | `linkType`, `percentage`, `direction`, `sourceResource`, `targetResource`, `calculationType`, `maxTransfer` |
| `damage_shield` | `shieldType`, `hitCount`, `reductionPercent` |
| `elemental_infusion` | `element`, `bonusDamage` |
| `empower_next` | `empowerType` ('spell'/'heal'/'weapon'), `uses` |
| `attackers_disadvantage` | `attackType` |
| `skill_mastery` | `skillType` ('physical'/'mental'/'social') |

---

# Section 17: Rollable Tables

Used by Chaos Weaver, Gambler, Arcanoneer, Fate Weaver. Located at `spell.rollableTable` or `spell.mechanicsConfig.rollableTable`.

```javascript
rollableTable: {
  enabled:         true,
  tableName:       'Wild Surge Effects',
  description:     'Raw magic bleeds through...',
  diceFormula:     '1d6',                     // '1d6', '1d20', '2d10', etc.

  // Alternative resolution methods:
  resolutionType:  'DICE',                    // 'DICE' | 'CARDS' | 'COINS'
  resolutionConfig: {
    diceType:   'd100',       // for DICE
    cardCount:  3,            // for CARDS
    deckType:   'standard',   // 'standard' | 'tarot'
    coinCount:  5,            // for COINS
  },

  entries: [
    {
      range: { min: 1, max: 1 },              // DICE: dice range
      // CARDS: cardPattern: 'Ace of Spades'
      // COINS: coinPattern: 'HHHTT'
      customName: 'Arcane Spark',              // display name
      effect: '1d8 force damage to random enemy within 30ft',
      spellReference: 'spell_id',             // optional: link to another spell
      effectConfig: {                          // optional: structured data
        damageFormula: '1d8',
        damageType: 'force',
        randomTarget: true,
        range: 30
      }
    }
  ]
}
```

### Card Rendering
Compact view: `[icon] {tableName} ({resolution}) {N} entries [expand]`
Expanded: shows range, name, and effect text per entry (max 8 visible, then `+N more`).

---

# Section 18: Trap Config

Only used when `spellType: 'TRAP'`.

```javascript
trapConfig: {
  placementRadius:  5,             // trigger radius in feet
  detectionMethod:  'arcana',      // 'perception' | 'investigation' | 'arcana' | 'detect_magic' | 'true_sight'
  detectionDC:      18,
  disarmMethod:     'dispel_magic', // 'thieves_tools' | 'arcana' | 'strength' | 'agility' | 'dispel_magic' | 'specific_item'
  disarmDC:         18,
  visibility:       'magical',     // 'hidden' | 'visible' | 'magical'
  trapDuration:     'timed',       // 'permanent' | 'timed' | 'conditional'
  durationValue:    10,            // for 'timed'
  durationUnit:     'minutes',     // 'rounds' | 'minutes' | 'hours'
  conditionType:    'combat_end',  // 'combat_end' | 'dawn' | 'dusk' | 'short_rest' | 'long_rest' | 'area_cleared' | 'caster_leaves'
  maxTriggers:      1,             // 1=single-use, -1=unlimited, N=N uses
  resetTime:        0              // seconds between resets (0 = no reset)
}
```

### Card Rendering
Header: **"Trap"** badge. Bullets: visibility, cooldown, max triggers.

---

# Section 19: Per-Effect Targeting

When different effects target differently (e.g., damage hits enemies, healing hits allies in same AoE):

```javascript
{
  targetingMode: 'effect',         // 'unified' (default) | 'effect' | 'self'

  targetingConfig: {               // fallback/global config
    targetingType: 'area',
    rangeType: 'self_centered',
    aoeShape: 'circle',
    aoeParameters: { radius: 40 },
    targetRestrictions: ['enemy', 'ally']
  },

  effectTargeting: {               // per-effect overrides
    damage: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 40 },
      targetRestrictions: ['enemy']
    },
    healing: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 40 },
      targetRestrictions: ['ally']
    },
    buff: {
      targetingType: 'self'
    }
  }
}
```

### Card Rendering
- Header range shows **"Varies"** (not a single range)
- Each effect section renders its own targeting badges inline
- Header targeting badge and propagation badge are suppressed

### When to Use
Use `targetingMode: 'effect'` when:
- Damage hits enemies but healing/buff hits allies (common for AoE spells)
- Different effects have different ranges (melee damage + ranged buff)
- One effect is self-targeted while another targets enemies

---

# Section 20: Saving Throws

Can appear inside `damageConfig`, `debuffConfig`, or `controlConfig`:

```javascript
savingThrow: {
  ability: 'agility',              // 'strength' | 'agility' | 'constitution' | 'intelligence' | 'spirit' | 'charisma'
  difficultyClass: 14,             // target DC number
  saveOutcome: 'half_damage'       // what happens on successful save
}
```

### Valid Save Outcomes
| Outcome | Meaning |
|---|---|
| `negates` | Save completely avoids the effect |
| `half_damage` | Save reduces damage by half |
| `no_effect` | Save prevents all effects |
| `damage_on_fail` | Takes full damage on failed save |
| `reduced_duration` | Save reduces effect duration |

### Shorthand
You can also use just `difficultyClass: 14` as a direct property on the config (instead of the full `savingThrow` object). The normalizer handles both.

### Valid Abilities
`strength`, `agility`, `constitution`, `intelligence`, `spirit`, `charisma`

---

# Section 21: Known Issues & Pipeline Gaps

These are wizard features that the spell card does NOT currently render:

| Wizard Feature | Status | Impact |
|---|---|---|
| *(none remaining)* | All 8 previously-unrendered features now render | See rendering details below |

### Previously Unrendered — Now Fixed (May 2026)
| Feature | Renders As | Location on Card |
|---|---|---|
| `effectResolutions` | Resolution badge (e.g., `[CARDS]`) next to effect name | Inline with damage/healing effects |
| `combinedEffects` | "Combo" section with effect descriptions | Before Duration section |
| `persistentConfig` | "Persistent Effect" section with tick/trigger info | Before Duration section |
| `channelingConfig.stages[]` | Stage bullets (name, threshold, effect) + scaling formula | CHANNELED spell header bullets |
| `targetingTags` | Target restriction badge (Enemies/Allies/Self) | Inline with damage targeting badges |
| `buffDebuffTriggers` | "Trigger Chain" section showing source → target | Before Duration section |
| `mechanicsAvailableEffects` | "Available Effects" badge list | Before Duration section |
| `triggerRole` | "Auto-Cast" badge in header (when not CONDITIONAL) | Header badges row |

### Known Inconsistencies
- `restorationConfig` and `transformConfig` have full wizard+card support but zero class spells use them
- Class data files use legacy `triggers[]` array format; wizard creates `compoundTriggers[]` format — both are accepted by the card
- `prophecyConfig` preserved at top-level by normalizer instead of being moved into `mechanicsConfig` — both paths work for card rendering
- Pre-existing paren mismatch (5730 open, 5729 close) in UnifiedSpellCard.jsx — does not affect rendering

### Known Inconsistencies
- `restorationConfig` and `transformConfig` have full wizard+card support but zero class spells use them
- Class data files use legacy `triggers[]` array format; wizard creates `compoundTriggers[]` format — both are accepted
- `prophecyConfig` preserved at top-level by normalizer instead of being moved into `mechanicsConfig` — both paths work for card rendering

### Fixes Applied (May 2026)
- **Formatting unified**: Deleted two dead formatting engines (`formatSpellEffects.js` — 538 lines, zero imports; `formatSpellEffectsForReview.js` — 1,435 lines, one dead import in CollectionViewWindow.jsx). `UnifiedSpellCard.jsx` is now the SOLE rendering engine (25 consumers).
- **Normalizer hardened**: 9 previously-missing normalization cases added (spellType UPPERCASE, school migration, cooldownConfig key rename, duration cross-population, resolution default, actionPoints default, damageType→damageTypes, buff/debuff string→object)
- **Class spell data bulk-fixed**: 1,259 violations across 29 files (cooldownConfig keys, damageType singular, missing resolution)
- **Critical bugs fixed**:
  - `formatCooldown()` now reads both old (`type`/`value`) and new (`cooldownType`/`cooldownValue`) keys — was returning `null` for every normalized spell
  - `cleanFormula()` no longer garbles variable names — removed destructive second pass that re-lowercased Proper Case replacements
  - `level: 0` no longer coerced to `1` — cantrips/innate abilities now possible
  - `damageTypes` string no longer crashes `.push()` — array coercion added in transformer
  - `normalizeDamageConfig()` no longer overwrites legacy-extracted fields with partial `damageConfig` spread
  - `prophecyOptions` in transformer now reads from `transformedSpell` (deep copy) instead of original `spell`
  - `spell.effects` no longer preserved by reference — deep copied to prevent mutation
  - `schoolMap` expanded from 13 → 23 damage type mappings; duplicate `frost` key removed; now reads `typeConfig.school` first
  - Debug `console.log` statements removed from `spellCardTransformer.js`
  - Hard-coded spell name/ID matching removed from formatting code — CARDS/COINS determined solely by `spell.resolution`

---

*End of SPELL_DATA_REFERENCE.md — Updated May 2026 for Mythrill VTT spell system v2.1*
