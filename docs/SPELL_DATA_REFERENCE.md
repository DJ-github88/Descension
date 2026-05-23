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


### buffType Values (46 observed)

| buffType | Description |
|---|---|
| `"statEnhancement"` | Flat/dice stat increase |
| `"statusEffectBuff"` | Grants a status effect (resistance, immunity) |
| `"triggeredEffect"` | Buff that triggers on events (damage redirect, retaliation) |
| `"combatAdvantage"` | Grants advantage or bonus to attack/damage |
| `"damageMitigation"` | Reduces incoming damage |
| `"damageIncrease"` | Increases outgoing damage |
| `"movementBuff"` | Increases movement speed or grants movement immunity |
| `"auraEffect"` | Radiates an effect to nearby units |
| `"shield"` | Grants a shield or temp HP |
| `"temporaryHP"` | Grants temporary hit points |
| `"cheat_death"` | Prevents death once |
| `"immunity"` | Grants condition immunity |
| `"link"` | Links targets (damage sharing) |
| `"retaliation"` | Reflects damage to attackers |
| `"proficiency"` | Grants temporary proficiency |
| `"damage_reduction"` | Reduces damage by percent or flat amount |
| `"empowerment"` | Empowers abilities |
| `"invulnerability"` | Complete damage immunity |
| `"immortality"` | Cannot die |
| `"protection"` | General protection |
| `"transformation"` | Transformation-related buff |

### Example: triggeredEffect (damage redirect / empathetic link)

```javascript
buffConfig: {
  buffType: 'triggeredEffect',
  effects: [
    {
      id: 'stitch_link_source',
      name: 'Stitch of Suffering (Ally)',
      description: '30% of incoming damage redirected to linked enemy.',
      mechanicsText: 'Linked ally redirects 30% of incoming damage to bonded enemy as psychic for 3 rounds.',
    },
  ],
  durationValue: 3,
  durationType: 'rounds',
  durationUnit: 'rounds',
  concentrationRequired: false,
  canBeDispelled: true,
  stackingRule: 'replace',
}
```

### Example: retaliation (reflect damage)

```javascript
buffConfig: {
  buffType: 'retaliation',
  effects: [
    {
      id: 'steam_backlash',
      name: 'Thermal Backlash',
      description: 'Release steam dealing fire damage equal to half damage taken back at attacker.',
      retaliationDamage: { formula: 'damage_taken / 2', damageType: 'fire' },
      mechanicsText: 'Reflect 50% of damage taken as fire damage to attacker.',
    },
  ],
  durationValue: 2,
  durationType: 'rounds',
  durationUnit: 'rounds',
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


### debuffType Values (18 observed)

| debuffType | Description |
|---|---|
| `"statusEffect"` | Generic status effect (most common) |
| `"statPenalty"` | Reduces stats |
| `"curse"` | Curse-style debuff |
| `"combined"` | Multiple debuff effects combined |
| `"movementImpairment"` | Slows or restricts movement |
| `"abilityDisable"` | Disables abilities |
| `"link"` | Links damage or effects |
| `"statReduction"` | Reduces a stat |
| `"mark"` | Marks target for effects |
| `"brand"` | Brands target |
| `"aura"` | Aura debuff |
| `"damageOverTime"` | DoT debuff |
| `"disease"` | Disease debuff |
| `"plague"` | Plague debuff |
| `"sabotage"` | Sabotage debuff |
| `"system_failure"` | System failure |

### debuffConfig effects[] nested patterns

Effects inside `debuffConfig.effects[]` can contain one of several nested mechanic objects:

| Pattern | Fields | Use When |
|---|---|---|
| `statModifier` | `{ stat, magnitude, magnitudeType }` | Direct stat modification |
| `statPenalty` (array) | `[{ stat, value, magnitudeType }]` | Multiple stat penalties |
| `statPenalty` (object) | `{ stat, value, magnitudeType }` | Single stat penalty |
| `statusEffects` (array) | `[{ id, name, option, vulnerabilityType, vulnerabilityPercent }]` | Complex status like vulnerability |
| `statusEffect` (object) | `{ type, vulnerabilityType, percentage }` | Simple status effect |
| `statusType` | `"blinded"\|"marked"\|...` | Simple string condition |

## utilityConfig

```javascript
utilityConfig: {
  utilityType: 'movement',              // See table below for ALL valid values
  selectedEffects: [
    { id: 'teleport', name: 'Teleport', description: 'Teleport up to 30 feet' }
  ],
  duration: 1,
  durationUnit: 'rounds',
  concentration: false,
  power: 'minor'                        // minor | major
}
```

### utilityType Values (22 observed)

| utilityType | Description |
|---|---|
| `"movement"` | Movement / teleport / reposition |
| `"protection"` | Protect / intercept damage for ally |
| `"fate_manipulation"` | Manipulate dice / fate outcomes |
| `"teleportation"` | Teleport self or others |
| `"reposition"` | Reposition on battlefield |
| `"trap"` | Place a trap |
| `"restoration"` | Restore resources or conditions |
| `"enhancement"` | Enhance abilities |
| `"environment"` | Environmental effect (darkness, silence zone) |
| `"special"` | Class-specific special utility |
| `"custom"` | Custom behavior |
| `"perception"` | Vision / detection / true sight |
| `"card_draw"` | Draw cards (Fate Weaver) |
| `"conjuration"` | Conjure objects |
| `"creation"` | Create something |
| `"summon"` | Summon utility items |
| `"cure"` | Cure conditions |
| `"cleanse"` | Cleanse debuffs |
| `"stance_change"` | Change combat stance |
| `"resource_drain"` | Drain resources from target |
| `"disruption"` | Disrupt enemies |
| `"reroll"` | Reroll dice |

---

## controlConfig

```javascript
controlConfig: {
  controlType: 'incapacitation',        // See table below for ALL valid values
  duration: 1,
  durationUnit: 'rounds',               // rounds | instant | minutes
  effects: [
    {
      id: 'stun',
      name: 'Stunned',
      description: 'Cannot act for 1 round. DC 15 Constitution save.',
      config: {                          // nested config varies by controlType
        saveType: 'constitution',
        saveDC: 15,
        duration: 1,
        durationUnit: 'rounds',
        // forcedMovement: distance: 15, movementType: 'pull' | 'push'
        // mind_control: confusionType: 'complete', controlType: 'full_control'
        // restraint: restraintType: 'physical', breakOnDamage: true, condition: 'restrained'
        // zone: zoneType: 'difficult_terrain'
        // incapacitation: executeThreshold: 30, executeThresholdType: 'percentage', instantKill: true
      },
    },
  ],
  savingThrow: {
    ability: 'constitution',             // constitution | spirit | strength | agility | intelligence | charisma
    difficultyClass: 15,
    saveOutcome: 'negates',              // negates | half_damage | reduced_duration
  },
}
```

### controlType Values (25 observed)

| controlType | Description | Key config Fields |
|---|---|---|
| `"knockdown"` | Knock target prone | `saveType, saveDC` |
| `"forcedMovement"` | Push / pull / drag target | `distance, movementType: 'pull'\|'push'` |
| `"incapacitation"` | Incapacitate / stun / kill | `executeThreshold, instantKill` |
| `"mind_control"` | Control target actions | `confusionType: 'complete', controlType: 'full'\|'full_control'\|'hostile_to_allies'` |
| `"zone"` | Create a control zone | `zoneType: 'difficult_terrain'` |
| `"restraint"` | Restrain target physically | `restraintType: 'physical', breakOnDamage: true, condition: 'restrained'` |
| `"fear"` | Cause fear | Standard save config |
| `"charm"` | Charm target | Standard save config |
| `"restrained"` | Restrained condition | Standard save config |
| `"incapacitated"` | Incapacitated condition | Standard save config |
| `"stunned"` | Stunned condition | Standard save config |
| `"silenced"` / `"silence"` | Silenced condition | Standard save config |
| `"lockdown"` | Lock target in place | Standard save config |
| `"mental"` | Mental control | Standard save config |
| `"frightened"` | Frightened condition | Standard save config |
| `"paralyze"` | Paralyze target | Standard save config |
| `"disoriented"` | Disoriented condition | Standard save config |

### Example: forcedMovement (pull enemies toward you)

```javascript
controlConfig: {
  controlType: 'forcedMovement',
  effects: [
    {
      id: 'seismic_drag',
      name: 'Seismic Drag',
      description: 'Enemies dragged 15 ft toward you.',
      config: { distance: 15, movementType: 'pull' },
    },
  ],
  duration: 0,
  durationUnit: 'instant',
}
```

### Example: mind_control (confuse enemies)

```javascript
controlConfig: {
  controlType: 'mind_control',
  duration: 2,
  durationUnit: 'rounds',
  effects: [
    {
      id: 'confused',
      name: 'Confused',
      description: 'Cannot distinguish friend from foe for 2 rounds.',
      config: { confusionType: 'complete', saveType: 'spirit', saveDC: 14 },
    },
  ],
  savingThrow: { ability: 'spirit', difficultyClass: 14, saveOutcome: 'negates' },
}
```

### Example: zone (difficult terrain)

```javascript
controlConfig: {
  controlType: 'zone',
  duration: 4,
  durationUnit: 'rounds',
  effects: [
    {
      id: 'difficult_terrain',
      name: 'Corrupted Ground',
      description: 'Area becomes difficult terrain.',
      config: { zoneType: 'difficult_terrain', duration: 4, durationUnit: 'rounds' },
    },
  ],
}
```

---

## summoningConfig

### Two valid patterns exist:

#### Pattern A: Flat config (simple creatures -- exorcist, falseProphet)

```javascript
summoningConfig: {
  summonType: 'temporary',               // 'temporary' | 'permanent'
  creatureName: 'Abyssal Servant',       // REQUIRED -- display name shown on card
  creatureType: 'Construct',             // Capitalized! 'Fiend' | 'Construct' | 'Undead' | 'Elemental' | 'Beast'
  quantity: 1,
  maxQuantity: 4,
  quantityFormula: '1d4',               // dice formula for random quantity
  statsFormula: '2d6 + 3',              // HP formula for summoned creature
  attackFormula: '1d6 + 2',             // attack damage formula
  duration: 4,
  durationUnit: 'rounds',               // 'rounds' | 'permanent'
  commandable: true,
  actionsPerTurn: 1,
  abilities: ['Abyssal Strike', 'Void Shield'],  // ability names
  difficultyLevel: 'moderate',           // 'easy' | 'moderate' | 'hard'
}
```

**IMPORTANT**: Pattern A requires `creatureName` (string, shown on card). Without it, the card renders "summoned creature" or "undefined". `creatureType` must be Capitalized (e.g., `"Construct"` not `"construct"`).

#### Pattern B: Creatures array (detailed creatures -- primalist, deathcaller)

```javascript
summoningConfig: {
  creatures: [
    {
      id: 'healing_totem_summon',
      name: 'Healing Totem',             // REQUIRED for Pattern B
      description: 'A splintered bone structure pulsing with raw sap.',
      size: 'Small',                      // 'Small' | 'Medium' | 'Large'
      type: 'construct',                  // creature type
      tokenIcon: 'spell_nature_healingtouch',
      stats: {
        maxHp: 10,
        armor: 12,
        maxMana: 0,
      },
      config: {
        quantity: 1,
        duration: 5,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlType: 'autonomous',        // 'autonomous' | 'verbal' | 'mental' | 'bound'
        controlRange: 0,
      },
    },
  ],
}
```

#### Pattern B variant: deathcaller (simpler creature array)

```javascript
summoningConfig: {
  creatures: [
    {
      quantity: 2,
      hp: 15,
      damagePerTurn: '1d6',
      damageType: 'necrotic',
      specialRules: ['Each wraith drains 1d4 HP from the caster at start of turn.'],
    },
  ],
  duration: 10,
  durationUnit: 'rounds',
  hasDuration: true,
  concentration: false,
  quantity: 2,
  maxQuantity: 2,
  controlRange: 60,
  controlType: 'verbal',
  difficultyLevel: 'easy',
}
```

---

## transformationConfig

### Two naming conventions exist:

#### Convention A: transformationType + newForm + grantedAbilities (berserker, deathcaller, dreadnaught, arcanoneer)

```javascript
transformationConfig: {
  transformationType: 'physical',        // See table below
  targetType: 'self',
  duration: 3,
  durationUnit: 'rounds',
  power: 'major',                        // 'major' | 'ultimate'
  newForm: 'Battle Incarnate',           // display name of form
  description: 'Transform into war itself...',
  concentration: true,
  maintainEquipment: true,
  grantedAbilities: [                    // abilities gained during transformation
    {
      id: 'incarnate_strike_bonus',
      name: 'Incarnate Fury',
      description: '+10 flat damage on all physical attacks.',
    },
    {
      id: 'incarnate_resilience',
      name: 'Unyielding Husk',
      description: '+6 flat Armor. Complete immunity to all conditions.',
    },
  ],
}
```

#### Convention B: transformType + statModifiers + specialAbilities (falseProphet, martyr)

```javascript
transformationConfig: {
  transformType: 'divine',               // See table below
  targetType: 'self',
  formName: 'Avatar of Sacrifice',       // display name (Convention B uses formName instead of newForm)
  formDescription: 'A glowing divine form...', // optional description
  duration: 5,
  durationUnit: 'rounds',
  concentration: true,
  maintainEquipment: true,
  statModifiers: [                       // actual stat changes during transformation
    { stat: 'intelligence', magnitude: 6, magnitudeType: 'flat' },
    { stat: 'spirit', magnitude: 6, magnitudeType: 'flat' },
    { stat: 'armor', magnitude: 5, magnitudeType: 'flat' },
    { stat: 'maxHp', magnitude: 50, magnitudeType: 'temporary' },
  ],
  specialAbilities: [                    // ability descriptions
    {
      name: 'Mind Shield',
      description: 'Immune to charm, fear, and confusion while transformed.',
    },
  ],
  grantedAbilities: [                    // can coexist with specialAbilities
    {
      id: 'mass_manipulation',
      name: 'Mass Manipulation',
      description: 'Charm or frighten all enemies within 30ft once.',
    },
  ],
}
```

**IMPORTANT**: Transformation spells that change stats MUST include `statModifiers` with actual magnitude values. Without it, the card says "enhances your physical form" with no details. If the transformation grants combat benefits (immunity, advantage, etc.), add `specialAbilities` to describe them. The spell's `effectTypes` should include `"buff"` if the transformation changes stats.

### transformationType / transformType Values (12 observed)

| Value | Convention | Description |
|---|---|---|
| `"physical"` | A | Physical transformation (berserker, deathcaller) |
| `"elemental"` | A/B | Elemental form (arcanoneer, deathcaller) |
| `"divine"` | A/B | Divine / holy form (covenbane, falseProphet, martyr) |
| `"shadow"` | A | Shadow form (dreadnaught, covenbane) |
| `"spectral"` | A | Spectral / ghost form (covenbane) |
| `"phaseshift"` | A | Phase shift form (deathcaller) |
| `"primal"` | A | Primal / beast form (formbender) |
| `"nature"` | A | Nature form (primalist) |
| `"parasitic"` | A | Parasitic form (lunarch) |
| `"celestial"` | A | Celestial form (lunarch) |

---

## purificationConfig

```javascript
purificationConfig: {
  purificationType: 'cleanse',          // dispel | cleanse | resurrection
  targetEffects: ['statusEffect', 'statPenalty'],
  effects: [
    { id: 'prismatic_cleanse', name: 'Prismatic Cleanse', description: 'Removes all non-permanent status effects.' }
  ],
  difficultyClass: 15,
  abilitySave: 'spirit'
}
```

---

## restorationConfig

```javascript
restorationConfig: {
  resourceType: 'mana',                 // mana | health | action_points | class resource types
  resolution: 'DICE',
  formula: '2d8 + intelligence',
  duration: 'instant',
  tickFrequency: 'round',
  application: 'start',
  scalingType: 'flat',
  isOverTime: false,
  overTimeFormula: '1d4 + intelligence/2',
  overTimeDuration: 3,
  overTimeTriggerType: 'periodic',
  isProgressiveOverTime: false,
  overTimeProgressiveStages: []
}
```

## Advantage and Disadvantage Conventions

For spells that grant **Advantage** or impose **Disadvantage** on specific sets of rolls or saves:
Use the standard numeric engine modifiers with a magnitude of `99` (for Advantage) or `-99` (for Disadvantage).

### Modifiers Structure
- **Disadvantage** is modeled as a stat penalty with `magnitude: -99` and `magnitudeType: "disadvantage"`.
- **Advantage** is modeled as a stat modifier with `magnitude: 99` and `magnitudeType: "advantage"`.

### Key Stats
- `attack_and_saves`: Affects both attack rolls and saving throws.
- `all_rolls`: Affects all d20 rolls (attacks, saves, checks).

#### Debuff Disadvantage Example
```javascript
debuffConfig: {
  debuffType: "statusEffect",
  effects: [
    {
      id: "house_advantage_stolen_luck",
      name: "Stolen Luck",
      description: "Disadvantage on attack rolls and saving throws."
    }
  ],
  statPenalties: [
    { stat: "attack_and_saves", magnitude: -99, magnitudeType: "disadvantage" }
  ]
}
```

#### Buff Advantage Example
```javascript
buffConfig: {
  buffType: "combatAdvantage",
  effects: [
    {
      id: "house_advantage_buff",
      name: "House Advantage",
      description: "Advantage on all rolls for the duration.",
      statModifier: { stat: "all_rolls", magnitude: 99, magnitudeType: "advantage" }
    }
  ]
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

In Mythrill VTT, each of the 30 classes utilizes its own unique thematic resource system. When creating or validating a spell, the class-specific resource must be configured in the spell data exactly as required by the card renderer and engine.

## Master Class Resource Table

The following table documents all 30 classes, their resource names, where to store them in the spell data, and the exact keys required:

````carousel
##### Page 1: Classes 1–10
| # | Class | Resource System | Where in Spell Data | Required Fields & Schema |
|---|---|---|---|---|
| 1 | **Arcanoneer** | Elemental Spheres | `resourceCost.resourceValues` or flat `sphereCost` | `arcane_energy_points` (number) or sphere cost fields (e.g. `arcane_sphere`, `fire_sphere`, `ice_sphere`, `holy_sphere`, `nature_sphere`, `shadow_sphere`, `healing_sphere`, `chaos_sphere`) |
| 2 | **Augur** | Benediction / Malediction | `resourceCost.resourceValues` or flat fields | `benedictionCost`, `benedictionGain`, `maledictionCost`, `maledictionGain` |
| 3 | **Berserker** | Rage | `resourceCost.resourceValues` or flat fields | `rageCost`, `rageGain`, `rageRequired` |
| 4 | **Bladedancer** | Momentum / Flourish | `resourceCost.resourceValues` or flat fields | `momentumCost`, `momentumGain`, `flourishRequired` |
| 5 | **Chaos Weaver** | Mayhem | `resourceCost.classResource` | Shorthand object: `{ type: 'mayhem', cost: N }` (Negative = generate, Positive = cost) |
| 6 | **Chronarch** | Time Shards / Temporal Strain | `resourceCost.resourceValues` or `specialMechanics.temporalFlux` | `timeShardGenerate` / `time_shard_generate`, `timeShardCost` / `time_shard_cost`, `temporalStrainGain` / `temporal_strain_gain`, `temporalStrainReduce` / `temporal_strain_reduce` |
| 7 | **Covenbane** | Hexbreaker Charges | `resourceCost.resourceValues` or flat fields | `hexbreakerCharges` (number), `hexChargeCost`, `hexChargeGain` |
| 8 | **Deathcaller** | Blood Tokens / HP Cost | `resourceCost.resourceValues` or flat fields | `bloodTokens` (number), `hp` (number - for direct HP cost) |
| 9 | **Doomsayer** | Havoc | `resourceCost.classResource` | Shorthand object: `{ type: 'havoc', cost: N }` |
| 10 | **Dreadnaught** | Furnace Pressure | `resourceCost.classResource` or `resourceCost.resourceValues` | `classResource: { type: 'furnace_pressure', cost: N }` (Positive = spend, Negative = generate). Also via `resourceValues: { furnace_pressure: N }` |
<!-- slide -->
##### Page 2: Classes 11–20
| # | Class | Resource System | Where in Spell Data | Required Fields & Schema |
|---|---|---|---|---|
| 11 | **Exorcist** | Dominance Dice | `resourceCost.resourceValues` or flat fields | `dominanceDiceCost`, `dominanceDiceGain` |
| 12 | **False Prophet** | Madness Points | `resourceCost.resourceValues` or flat fields | `madnessCost`, `madnessGain` |
| 13 | **Fate Weaver** | Threads of Destiny | `specialMechanics.threadsOfDestiny` or flat fields | `threads_spend` (number), `threads_generate` (number) |
| 14 | **Formbender** | Wild Instinct | `resourceCost.resourceValues` or flat fields | `wildInstinctCost`, `wildInstinctGain`, `wildInstinctRequired` |
| 15 | **Gambler** | Fortune Points | `specialMechanics.fortunePoints` or `resourceCost` | `fortunePointsCost`, `fortunePointsGain`, `fortune_points_cost` |
| 16 | **Huntress** | Quarry Marks | `resourceCost.resourceValues` or flat fields | `quarryMarkCost`, `quarryMarkGain`, `quarryRequired` |
| 17 | **Inscriptor** | Runic Resonance / Runes | `resourceCost.resourceValues` or flat fields | ` resonanceCost`, `resonanceGain`, `runesRequired` (array) |
| 18 | **Lichborne** | HP (Aura Mode) / Phylactery | `resourceCost.resourceValues` | `hp` (number - for active Aura drains), `phylacteryCharges` |
| 19 | **Lunarch** | Moon Phase | Flat fields or `resourceCost` | `phaseRequired` ('new_moon' \| 'waxing' \| 'full_moon' \| 'waning'), `manaToShift` |
| 20 | **Martyr** | Devotion Gauge | Flat top-level props or `resourceValues` | `devotionRequired` (number), `devotionGain` (number), `devotionCost` (number) |
<!-- slide -->
##### Page 3: Classes 21–30
| # | Class | Resource System | Where in Spell Data | Required Fields & Schema |
|---|---|---|---|---|
| 21 | **Minstrel** | Musical Notes / Combos | `musicalCombo` or `specialMechanics.musicalCombo` | `notes` (array of notes, e.g. `['C', 'E', 'G']`), `cadenceName`, `cadenceNotes` |
| 22 | **Oracle** | Prophetic Visions | `resourceCost.resourceValues` or flat fields | `visionCost`, `visionGain`, `visionRequired` |
| 23 | **Plaguebringer** | Virulence / Afflictions | `effectMechanicsConfigs` or flat fields | `virulenceCost`, `virulenceGain`, `afflictionType` |
| 24 | **Primalist** | Totemic Synergy | `resourceCost.resourceValues` or flat fields | `synergyCost`, `synergyGain`, `totemsRequired` |
| 25 | **Pyrofiend** | Inferno Veil | `resourceCost.resourceValues` or flat fields | `inferno_ascend` / `infernoAscend`, `inferno_descend` / `infernoDescend`, `inferno_required` / `infernoRequired` |
| 26 | **Spellguard** | Arcane Energy Points | `resourceCost.resourceValues` or flat fields | `aepCost`, `aepGain`, `aepRequired` |
| 27 | **Titan** | Celestial Devotion | Flat top-level field | `devotionRequired` (string: `'Solara'` \| `'Lunara'` \| `'Astraeus'` \| `'Terranox'` \| `'Zephyra'`) |
| 28 | **Toxicologist** | Toxin Vials / Contraptions | `resourceCost.resourceValues` or `effectMechanicsConfigs` | `toxinVialsCost`, `toxinVialsGain`, `contraptionParts` (number) |
| 29 | **Warden** | Vengeance Points | `resourceCost.resourceValues` or flat fields | `vengeanceCost`, `vengeanceGain`, `vengeanceRequired` |
| 30 | **Witch Doctor** | Voodoo Essence | `resourceCost.resourceValues` or flat fields | `voodooEssenceCost`, `voodooEssenceGain` |
````

---

## Class Resource Configurations & Code Examples

### A. Sphere-Based Systems (Arcanoneer)
Uses specific keys inside `resourceCost.resourceValues` to render specialized sphere badges:
```javascript
resourceCost: {
  resourceTypes: ['mana', 'arcane_sphere', 'fire_sphere'],
  resourceValues: { 
    mana: 4, 
    arcane_sphere: 1, 
    fire_sphere: 1 
  },
  actionPoints: 2,
  components: ['verbal', 'somatic']
}
```

### B. Gauge-Based Shorthands (Martyr & Pyrofiend)
These can be stored either as flat, top-level properties or nested in `resourceCost.resourceValues` (the normalizer flattens them for card rendering):
```javascript
// Martyr Example (Flat Props)
{
  id: 'martyr_sacred_mend',
  name: 'Sacred Mend',
  // ...
  resourceCost: {
    mana: 8,
    actionPoints: 1,
    components: ['verbal']
  },
  devotionRequired: 2,
  devotionGain: 1,
  devotionCost: 0
}

// Pyrofiend Example (resourceValues Map)
{
  id: 'pyro_scorch_wave',
  name: 'Scorch Wave',
  // ...
  resourceCost: {
    resourceTypes: ['mana', 'inferno_ascend'],
    resourceValues: { 
      mana: 6, 
      inferno_required: 2, 
      inferno_ascend: 1 
    },
    actionPoints: 2,
    components: ['verbal', 'somatic']
  }
}
```

### C. Shorthand ClassResource (Doomsayer & Chaos Weaver)
These classes use a specialized `classResource` object inside `resourceCost` to denote dynamic resource interactions.
* **Doomsayer** specifies cost (positive) for spending Havoc:
```javascript
// Doomsayer Havoc Cost Example
resourceCost: {
  actionPoints: 1,
  mana: 6,
  classResource: { 
    type: 'havoc', 
    cost: 3 
  },
  components: ['verbal']
}
```
* **Chaos Weaver** uses negative values to generate Mayhem and positive values to consume/require Mayhem:
```javascript
// Chaos Weaver Mayhem Generation Example
resourceCost: {
  actionPoints: 1,
  mana: 4,
  classResource: {
    type: 'mayhem',
    cost: -2
  },
  components: ['verbal', 'somatic']
}

// Chaos Weaver Mayhem Spending Example
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: {
    type: 'mayhem',
    cost: 4
  },
  components: ['verbal', 'somatic']
}
```

### D. Advanced Special Mechanics (Minstrel & Fate Weaver)
Some classes store resource interactions inside a nested `specialMechanics` or specific custom structures:
```javascript
// Minstrel Musical Note Cadence
{
  id: 'minstrels_song_of_valor',
  name: 'Song of Valor',
  // ...
  musicalCombo: {
    notes: ['C', 'E', 'G'],             // Notes generated/played
    cadenceName: 'Tonic Cadence',       // Name of combo
    cadenceNotes: ['C', 'E', 'G']       // Pattern completed
  }
}

// Fate Weaver Threads of Destiny
{
  id: 'fate_weaver_destiny_draw',
  name: 'Destiny Draw',
  // ...
  specialMechanics: {
    threadsOfDestiny: {
      threads_spend: 2,
      threads_generate: 1
    }
  }
}
```

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
| `spellType: 'PASSIVE'` with active-only `effectTypes` like `['debuff']` or `['buff']` but no config | Empty `.pf-spell-stats` container box rendered below the description | Change `effectTypes` to `['passive']` (or remove `debuff`/`buff` from it) |
| Missing `selectedEffects` in `purificationConfig` | Purification falls back to generic physical text instead of custom cleanse details | Custom cleanse details are now read from the fallback `purificationConfig.effects` array |
| CamelCase target effects in purification (e.g. `statusEffect`) | Improper casing/spacing in list | Spaced and title-cased automatically (e.g. `statusEffect` -> `Status Effect`), but prefer standard spacing where possible |
| Using standard `buff` type for full transformations | Cannot display duration, concentration, or form fields organically | Use `effectTypes: ['transformation']` with a standard `transformationConfig` object |
| High sphere resource cost badges overlapping right elements | Badges collide with V/S component badges in the header | CSS now wraps the badges container (`flex-wrap: wrap`), but always ensure the `resourceCost.spheres` array is fully populated to render them |

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

````carousel
##### Page 1: Combat & Movement Triggers

###### Combat Triggers
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

###### Movement Triggers
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

<!-- slide -->
##### Page 2: Health & Status Triggers

###### Health Triggers
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

###### Status Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `effect_applied` | Effect Applied | effect_type, perspective |
| `effect_removed` | Effect Removed | effect_type, perspective |
| `effect_duration` | Effect Duration | effect_type, duration, perspective |
| `effect_stack` | Effect Stack | effect_type, stack_count, perspective |
| `dispel` | Dispel | effect_type, perspective |
| `cleanse` | Cleanse | effect_type, perspective |
| `immunity` | Immunity | effect_type, perspective |

<!-- slide -->
##### Page 3: Trap, Environment & Time Triggers

###### Trap Triggers
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

###### Environment Triggers
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

###### Time Triggers
| ID | Name | Key Parameters |
|---|---|---|
| `turn_start` | Turn Start | whose_turn |
| `turn_end` | Turn End | whose_turn |
| `round_start` | Round Start | (none) |
| `round_end` | Round End | (none) |
| `cooldown_ready` | Cooldown Ready | ability_id |
| `duration_threshold` | Duration Threshold | duration, comparison |
````

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

# Section 13: Critical Hit & Chance on Hit (Proc) Systems

Each effect config (`damageConfig`, `healingConfig`) can include detailed rules for critical hits and chance-on-hit triggers.

## Critical Hit Config (`criticalConfig`)

Advanced critical hit mechanics go beyond simple 2x multipliers. The card and engine support exploding dice, card-drawing bonuses, and even rollable table procs.

```javascript
criticalConfig: {
  enabled: true,
  critType: 'dice',                    // 'dice' | 'cards' | 'coins'
  critMultiplier: 2,                   // multiplier applied (default 2)
  critRange: [20],                     // array of integers. Standard: [20]. Expanded: [19, 20]
  critDiceOnly: false,                 // true = multiply only dice, not flat modifiers
  
  // DICE-specific crit additions
  critBonusDamage: '2d6',              // extra dice rolled on crit (damage only)
  critBonusHealing: '2d8',             // extra dice rolled on crit (healing only)
  explodingDice: true,                 // dice that roll maximum value roll again
  explodingDiceType: 'reroll_add',     // 'reroll_add' (add together) | 'double_value' | 'add_max'

  // CARDS-specific crit rules
  cardCritRule: 'face_cards',          // 'face_cards' | 'aces' | 'specific_suit'
  cardCritResolution: 'draw_add',      // 'draw_add' | 'multiply_value' | 'double_damage'
  extraCardDraw: 2,                    // number of extra cards to draw on crit

  // COINS-specific crit rules
  coinCritRule: 'all_heads',           // 'all_heads' | 'sequence' | 'pattern'
  coinCritResolution: 'flip_add',      // 'flip_add'
  extraCoinFlips: 3,                   // number of extra coins to flip on crit

  // Custom effects on crit
  critEffects: ['stunned', 'knockback'], // array of effect IDs applied on crit
  spellEffect: 'linked_spell_id',      // optional: spell cast automatically on crit
  critOnlyEffect: false,               // true = spell only does something on crit
  useRollableTable: true               // roll on the spell's rollableTable on crit
}
```

### Critical Rules & Normalization
- **DC/Save outcome crits**: Normalizer translates standard natural 20s as double damage. Set `criticalConfig` only to override default multipliers, expand ranges, or add special effects.
- **Card-draw triggers**: Under CARDS resolution, drawing face cards or aces triggers critical card calculations based on `cardCritResolution`.

---

## Chance on Hit (Proc) Config (`chanceOnHitConfig` / `procConfig`)

A "proc" triggers extra effects, heals, controls, or custom spells when an action hits. The engine parses this in `chanceOnHitConfig` (wizard data) and normalizes it to `procConfig` for rendering.

```javascript
chanceOnHitConfig: {
  enabled: true,
  procType: 'dice',                    // 'dice' | 'cards' | 'coins'
  procChance: 15,                      // 1-100 percentage chance to trigger
  diceThreshold: 18,                   // d20 threshold required (e.g. 18+ to proc)
  
  // Card/Coin procs
  cardProcRule: 'face_cards',          // 'face_cards' | 'aces' | 'specific_suit' | 'pairs' | 'red_cards'
  procSuit: 'hearts',                  // suit required if cardProcRule is specific_suit
  coinProcRule: 'all_heads',           // 'all_heads' | 'sequence' | 'pattern'
  coinCount: 3,                        // coins needed to trigger

  // Proc outcome details
  effectType: 'debuff',                // 'buff' | 'debuff' | 'damage' | 'healing' | 'control' | 'utility'
  effectDetails: 'Burning: 1d6 fire',  // human-readable effect description
  effectDuration: 2,                   // duration of applied proc effect
  effectDurationUnit: 'rounds',        // rounds | turns | minutes
  
  // Specific flat values
  damageAmount: '2d6',                 // if effectType is 'damage'
  damageType: 'fire',
  healAmount: '1d8',                   // if effectType is 'healing'
  controlType: 'stun',                 // if effectType is 'control'

  // Advanced outcomes
  customEffects: ['burning_debuff'],   // list of custom effect IDs
  spellEffect: 'spell_id_to_proc',     // casts another spell from library
  useRollableTable: true               // rolls on rollable table when proc triggers
}
```

### Card Rendering
When a proc is enabled, the card displays a dedicated **"Chance on Hit"** description block, showing the trigger condition and the resulting effects:
- *Example (Dice)*: `Chance on Hit: Roll 18+ on d20 (15%): Debuff - Burning: 1d6 fire`
- *Example (Rollable Table)*: `Chance on Hit: Card draw (15%): Roll on Wild Surge table (d100)`

---

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

````carousel
##### Page 1: Defensive & Utility Status Effects
| Effect ID | Key Fields |
|---|---|
| `luck` | `luckType` ('bonus'/'reroll'/'minimum'/'choose'), `luckBonus`, `appliesTo`, `rerollCount` |
| `haste` | `speedMultiplier`, `extraActions`, `extraAttacks`, `hasLethargy` |
| `regeneration` | `calculationType` ('fixed'/'percentage'/'dice'), `healAmount`, `healPercentage`, `diceCount`, `diceType` |
| `shielded` / `shield` | `shieldAmount`, `shieldType` ('absorb'/'reflect'/'thorns') |
| `invisibility` / `invisible` | `invisibilityType` ('standard'/'greater'/'improved'/'partial'/'full'/'selective'), `breaksOnAttack` |
| `flight` / `flying` | `flySpeed`/`flightSpeed`, `maneuverability` |
| `resistance` | `resistanceType`, `resistanceAmount`/`magnitude` |
| `inspired` | `inspirationType`, `inspirationDie` |
| `blessed` | `blessType` ('protection'/'fortune'/'life') |
| `temporary_hp` | `temporaryHitPoints`/`amount` |
| `truesight` | `truesightRange` |
| `skill_mastery` | `skillType` ('physical'/'mental'/'social') |
<!-- slide -->
##### Page 2: Offensive, Control & Combat Status Effects
| Effect ID | Key Fields |
|---|---|
| `burning` | `diceCount`, `diceType`, `damageType`, `canSpread`, `extinguishDC` |
| `stunned` / `stun` | `stunLevel` ('full'/'partial'/'dazed') |
| `charmed` / `charm` | `charmLevel` ('dominated'/'friendly'/'suggestion'), `saveTrigger`, `canAttackCharmer` |
| `combat_advantage` | `advantageType` ('attack'/'damage'/'healing'/'saving'/'initiative'/'super') |
| `energized` | `bonusActionPoints` |
| `empowered` | `powerIncrease` |
| `lifelink` | `linkType`, `percentage`, `direction`, `sourceResource`, `targetResource`, `calculationType`, `maxTransfer` |
| `damage_shield` | `shieldType`, `hitCount`, `reductionPercent` |
| `elemental_infusion` | `element`, `bonusDamage` |
| `empower_next` | `empowerType` ('spell'/'heal'/'weapon'), `uses` |
| `attackers_disadvantage` | `attackType` |
````

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
  saveOutcome: 'half_damage',      // what happens on successful save
  
  // Advanced Custom Outcome Overrides (Wizard & Card v2.1)
  partialEffect: true,             // Enable custom partial scaling on successful save
  partialEffectFormula: 'damage/2', // Fallback custom scaling formula (e.g. 'damage/2')
  directDamageFormula: 'damage/2', // Custom scaling for direct damage component on save
  dotDamageFormula: 'dot_damage/2' // Custom scaling for DoT damage component on save
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

### Structure & Formats

The card renderer is extremely robust and supports three ways of defining saving throws:

1. **Structured Object (Standard)**: Recommended. Allows specifying the ability, DC, and specific outcome.
   ```javascript
   savingThrow: {
     ability: 'spirit',
     difficultyClass: 16,
     saveOutcome: 'negates'
   }
   ```
2. **Shorthand DC & String**: You can define `difficultyClass: 16` directly on the config, along with a string `savingThrow: 'spirit'` or `savingThrowType: 'spirit'`.
3. **Boolean Flag**: You can set `savingThrow: true` alongside separate DC and ability fields.

The normalizer resolves objects and strings to avoid runtime `toLowerCase` crashes.

### Valid Abilities
`strength`, `agility`, `constitution`, `intelligence`, `spirit`, `charisma`

### Advanced Custom Scaling on Save
For advanced spell components that require precise control over what happens on a successful save, the system provides standard fields to override the default half/negate logic:
- **`partialEffect`** (`boolean`): When set to `true`, the card renderer will read custom formulas to compute what happens on a successful save rather than relying on default outcomes.
- **`partialEffectFormula`** (`string`): Standard fallback formula applied on save (e.g., `'damage/2'`).
- **`directDamageFormula`** (`string`): Specifies the custom formula specifically for the instant/direct damage component when saved (e.g., `'damage/2'`).
- **`dotDamageFormula`** (`string`): Specifies the custom formula specifically for the Damage-over-Time component when saved (e.g., `'dot_damage/2'`).

*Note:* These formulas are cleaned up by the card renderer and appended dynamically as parenthetical notes in the stats block, e.g., `(damage/2 on save)`.

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

# Section 22: Description ↔ Data Alignment & Intended Effect Formatting Guide

To ensure high data quality, consistent rendering, and deep player immersion, natural language spell descriptions must perfectly align with the underlying structural spell configurations. When generating or editing spells, follow these three design pillars of data-description consistency.

## Pillar 1: The "No Raw Tokens in Play Text" Rule
Under no circumstances should raw database tokens or code-centric variables be exposed directly to players in the `description` or `mechanicsText` fields. A common pipeline violation is inserting raw variables like `CARD_VALUE` or `HEADS_COUNT` directly into natural text. Instead, express these numbers clearly as natural, thematic English descriptions. The game engine's card transformer and normalizer process the raw mathematical formulas in their designated configuration blocks (e.g. `formula`, `cardConfig`, or `coinConfig`) to perform calculations under the hood.

### Non-Compliant vs. Compliant Formatting Examples

| Bad Description (Exposes Code Tokens) | Good Description (Thematic Natural English) | Required Backend Config |
|---|---|---|
| Deals `CARD_VALUE` + `FACE_CARD_COUNT` * 3 fire damage. | Draw cards; deal fire damage equal to the total value of the cards drawn plus 3 additional damage for each Face card drawn. | `resolution: 'CARDS'`, `damageConfig: { formula: 'CARD_VALUE + FACE_CARD_COUNT * 3' }` |
| Heals the target for `HEADS_COUNT` * 7 health. | Flip coins; heal the target for 7 times the number of Heads flipped. | `resolution: 'COINS'`, `healingConfig: { formula: 'HEADS_COUNT * 7' }` |
| Sacrifices `HEALTH_SACRIFICED` to deal double damage. | Sacrifice a portion of your health to deal double damage based on the amount sacrificed. | `specialMechanics: { type: 'blood_token', cost: 'HEALTH_SACRIFICED' }` |

---

## Pillar 2: Strict Core Attribute Correspondence
Every structural limit or requirement in the spell data must correspond exactly to what is listed in the description. Avoid "phantom stats" (stats defined in the object but unmentioned in text) and "mystery requirements" (requirements described in text but absent from the JSON config).

### Key Core Attribute Mappings

1. **Action Points (`actionPoints`)**:
   - If the description describes the speed or action economy, it must align. For example, *"As an instantaneous reaction..."* implies `spellType: 'REACTION'` and `actionPoints: 0` (or appropriate reaction trigger config).
   - If the spell says *"Take a full turn to cast..."*, it must require the maximum action points (e.g., `actionPoints: 3` or similar).

2. **Range and AoE Shape (`rangeConfig` & `aoeConfig`)**:
   - If the text reads *"Strike a single foe within 30 feet..."*, the config must be:
     ```javascript
     rangeConfig: { value: 30, unit: 'feet', type: 'ranged' }
     ```
   - If the text reads *"Unleash a 15-foot cone of freezing wind..."*, the config must be:
     ```javascript
     aoeConfig: { type: 'cone', size: 15, unit: 'feet' }
     ```

3. **Duration and Persistence (`duration` & `cooldownConfig`)**:
   - If the text reads *"The barrier persists for 3 rounds..."*, the config must reflect:
     ```javascript
     duration: 3,
     durationUnit: 'rounds'
     ```
   - Cooldown text such as *"Can only be cast once every 2 rounds"* requires:
     ```javascript
     cooldownConfig: { cooldownType: 'rounds', cooldownValue: 2 }
     ```

---

## Pillar 3: Formatting Custom Calculations Thematically
When a spell uses dynamic, complex math scaling, do not use the uninformative `'SPECIAL'` string in the formula property. Instead, write clear, readable scaling formulas (e.g. `'2d8 × stacks'` or `'1.5 × intelligence'`). The card renderer is built to parse and display these expressions inside the interactive dice/healing badge beautifully, reinforcing the connection between mechanics and fantasy.

> [!TIP]
> **Pathfinder-Style Aesthetic Principle**
> Always write descriptions with high-quality, professional, and immersive Pathfinder-style prose. Use clear headers, capitalized damage types (e.g. *Fire*, *Frost*, *Slashing*), and bold keywords when referencing game mechanics (e.g. **Stunned**, **Burning**, **Saving Throw**).

### Before & After: Complete Spell Data Alignment Comparison

#### ❌ BAD: Disaligned, Exposes Code, and Uses "SPECIAL" Formula
```json
{
  "id": "pyro_combustion_blast",
  "name": "Combustion Blast",
  "spellType": "ACTION",
  "level": 3,
  "resourceCost": { "mana": 12, "actionPoints": 2 },
  "damageConfig": {
    "formula": "SPECIAL",
    "damageTypes": ["fire"]
  },
  "description": "Deals 2d8 * INFERNO_STACKS fire damage in a 15-ft cone. Targets must make a DC 15 Save. Stunned for 1 round if they fail.",
  "cooldownConfig": { "cooldownType": "rounds", "cooldownValue": 0 }
}
```
*Why this fails:*
- Description exposes `INFERNO_STACKS` (raw code-like token).
- `damageConfig.formula` is set to `"SPECIAL"`, rendering a vague, non-interactive badge.
- The description mentions a "15-ft cone" but `aoeConfig` is completely missing.
- The description mentions a "DC 15 Save" and "Stunned for 1 round", but the `savingThrow` and `controlConfig` blocks are absent from the structured JSON data.

####  GOOD: Perfectly Aligned, Thematic, and Fully Structured
```json
{
  "id": "pyro_combustion_blast",
  "name": "Combustion Blast",
  "spellType": "ACTION",
  "level": 3,
  "school": "fire",
  "damageTypes": ["fire"],
  "resourceCost": { 
    "mana": 12, 
    "actionPoints": 2 
  },
  "rangeConfig": { "value": 15, "unit": "feet", "type": "cone" },
  "aoeConfig": { "type": "cone", "size": 15, "unit": "feet" },
  "cooldownConfig": { "cooldownType": "rounds", "cooldownValue": 2 },
  "effectTypes": ["damage", "control"],
  "damageConfig": {
    "formula": "2d8 × stacks",
    "damageTypes": ["fire"]
  },
  "controlConfig": {
    "controlType": "incapacitation",
    "effects": [
      { "id": "stun", "name": "Stunned", "description": "Cannot act for 1 round." }
    ],
    "savingThrow": { "ability": "agility", "difficultyClass": 15 },
    "duration": 1,
    "durationUnit": "rounds"
  },
  "description": "Unleash a sweeping wave of flame in a 15-foot cone. Deal **Fire** damage equal to **2d8 per stack** of Inferno Veil. Enemies caught in the blast must succeed on a **DC 15 Agility Saving Throw** or become **Stunned** for 1 round.",
  "resourceCost.resourceValues": {
    "inferno_descend": 2
  }
}
```

---

# Section 23: Advanced Formula Syntax & Parsing Internals

To maximize the power of the Mythrill VTT rendering engine, authors should understand how mathematical formulas are processed by the system's core transformers (`spellCardTransformer.js`).

## 1. Formula Token Extraction & Regex Internals
When a spell card is loaded, the transformer automatically parses the `formula` property within `damageConfig` and `healingConfig` using the following exact regular expressions:

- **Dice Matcher**: `/(\d+d\d+)/`
  - Searches for standard dice notation (e.g. `1d4`, `2d6`, `3d12`).
  - The first matching sequence is extracted and assigned to `primaryDamage.dice` or `primaryHealing.dice` for rendering inside the prominent dice badge.
- **Flat Modifier Matcher**: `/\+\s*(\d+)/`
  - Searches for a plus sign followed by any amount of whitespace and an integer (e.g. `+ 4`, `+7`, `+ 12`).
  - The matched number is converted to a decimal integer and assigned to `primaryDamage.flat` or `primaryHealing.flat`.

### How the Engine Resolves Common Formula String Structures

| Input Formula | Extracted Dice | Extracted Flat | Resulting Card Rendering |
|---|---|---|---|
| `'2d6 + 4'` | `'2d6'` | `4` | Renders a primary badge displaying `2d6` and applies a `+4` flat modifier in calculations. |
| `'3d10'` | `'3d10'` | `0` | Renders a primary badge displaying `3d10`. |
| `'2d8 × stacks'` | `'2d8'` | `0` | Renders `2d8` in the dice badge. The multiplication is described thematically in the description text. |
| `'1.5 × spirit'` | `'1.5 × spirit'` | `0` | Since no standard dice notation matches, the entire string `'1.5 × spirit'` is used as the dice badge label, creating a highly customized stat-scaling badge. |
| `'SPECIAL'` | `'SPECIAL'` | `0` | Displays a vague `'SPECIAL'` label inside the badge. *Avoid using this.* |

---

## 2. Doomsayer Prophecy Outcome Builder Mappings
The Doomsayer class utilizes a unique resolution system where the outcome is determined by predicting where a rolled value falls relative to a Prophecy. In the spell data, these choices are defined within the structured `prophecyOptions` object. The card transformer parses this object and deep-maps it into the final `prophecyConfig` used by `UnifiedSpellCard.jsx` to render the multi-pane Prophecy outcome cards.

### prophecyOptions Schema Breakdown

The top-level `prophecyOptions` object supports three core configuration fields:
1. **`rangeDice`** (`string` \| `string[]` \| `number[]`): Defines the range of values that count as a successful prophecy. E.g., `[1, 2, 3]`, or `'1 + 2'` (automatically parsed by the transformer into an array).
2. **`resolutionDie`** (`string` \| `number`): The type of die rolled to determine the outcome (e.g., `'1d10'`, `'1d6'`).
3. **Outcome Sub-Objects**:
   - **`prophesied`**: The outcome triggered when the roll matches the prophecy range.
   - **`base`**: The standard outcome triggered when the roll is outside the prophecy but doesn't cause a backlash.
   - **`outside`**: The backlash outcome triggered under negative conditions (e.g., critical failure or completely missing the mark).

### Outcome Configuration Properties
The `prophesied` and `base` sub-objects support the following rich properties, which are converted into structural components on the outcome cards:

- **`damage`** (`string`): Direct damage formula for the outcome, e.g. `'3d10 + 6'`.
- **`havocGain`** (`number`): The amount of Havoc class resource gained (defaults to `3` for *prophesied*, `1` for *base*).
- **`description`** (`string`): Natural language description of this specific outcome's flavor and rules.
- **`effectName`** (`string`): The name of any status effect or debuff applied by this outcome (e.g. `'Doom'`). Setting this builds a structured sub-effect object with additional scaling:
  - `duration` (`number`): Duration in rounds (only included if > 0).
  - `durationUnit` (`string`): The time unit of the duration. If not `'rounds'`, it is stored in the `unit` field of the effect.
  - `damagePerRound` (`string`): Formula for Damage-over-Time inflicted by the effect.
  - `damagePerRoundType` (`string`): Damage type of the DoT (e.g. `'shadow'`, `'necrotic'`).
  - `statModifiers` (`array`): Custom stat reductions or boosts applied.
  - `healingBlock` (`boolean`): If `true`, prevents the target from receiving any healing while active.
  - `bonusDamageTaken` (`string` \| `number`): Multiplier or flat increase to damage taken.
  - `bonusDamageType` (`string`): Damage type vulnerable to the bonus damage.
  - `saveDC` (`number`) & `saveType` (`string`): Saving throw DC and attribute to resist or cure the effect.
  - `instantKill` (`boolean`) & `instantKillThreshold` (`number`): Execution mechanics if the target falls below a certain HP threshold.
  - `cascadeDamage` (`string`) & `cascadeRange` (`number`): Explosive trigger details that deal damage to nearby targets if this target dies.

The `outside` sub-object represents the backlash outcome and supports:
- **`backlash`** (`string`): Description or formula for damage or penalties inflicted upon the caster for a failed prophecy.
- **`havocGain`** (`number`): Gained or lost Havoc resource.
- **`description`** (`string`): Flavour and gameplay text explaining the failure's consequences.

---

### Copy-Pasteable Complete Prophecy Spell Example

Use this complete, compliant Doomsayer spell definition as a template when creating prophecy-based spells:

```javascript
{
  id: 'doom_whisper_prophecy',
  name: 'Whisper of Prophecy',
  spellType: 'ACTION',
  level: 4,
  school: 'void',
  damageTypes: ['void', 'necrotic'],
  resourceCost: {
    mana: 15,
    actionPoints: 2,
    classResource: { type: 'havoc', cost: 1 }
  },
  rangeConfig: { value: 60, unit: 'feet', type: 'ranged' },
  cooldownConfig: { cooldownType: 'rounds', cooldownValue: 3 },
  effectTypes: ['damage', 'debuff'],
  resolution: 'PROPHECY',
  
  prophecyOptions: {
    rangeDice: [1, 2, 3],
    resolutionDie: '1d10',
    
    prophesied: {
      damage: '4d10 + 6',
      havocGain: 4,
      description: 'Your prediction manifests with absolute accuracy. The target is engulfed in crushing shadow and marked for doom.',
      effectName: 'Unraveling Doom',
      duration: 3,
      durationUnit: 'rounds',
      damagePerRound: '2d6',
      damagePerRoundType: 'necrotic',
      healingBlock: true,
      saveDC: 16,
      saveType: 'spirit',
      cascadeDamage: '3d6',
      cascadeRange: 15
    },
    
    base: {
      damage: '2d10 + 3',
      havocGain: 1,
      description: 'The prophecy misses its peak, but still strikes the enemy with a surge of void energy.',
      effectName: 'Void Taint',
      duration: 2,
      durationUnit: 'rounds',
      damagePerRound: '1d6',
      damagePerRoundType: 'void'
    },
    
    outside: {
      backlash: '2d6 void damage to self',
      havocGain: -1,
      description: 'The prophecy is wildly inaccurate, tearing open a temporal rift that inflicts severe backlash upon the caster.'
    }
  },
  
  description: "Cast your sight into the near future, predicting the roll of fate. Deal massive **Void** damage and inflict **Unraveling Doom** on a correct prediction (1-3 on a 1d10). A standard roll deals minor damage, while rolling completely outside the prediction tears a rift, inflicting backlash damage upon yourself."
}
```

---

*End of SPELL_DATA_REFERENCE.md — Updated May 2026 for Mythrill VTT spell system v2.1*
