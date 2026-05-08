# Spell Data Structure Reference & AI Generation Guide

> **Definitive reference for creating, validating, and generating spells in Mythrill VTT.**
> Replaces `SPELL_WIZARD_TO_SPELLCARD_TEMPLATE.md`.

---

## INSTRUCTIONS FOR AI SESSIONS

When a user asks you to create, edit, fix, or generate spells for Mythrill VTT:

1. **Read this file first**: `D:\VTT\docs\SPELL_DATA_REFERENCE.md`
2. **Follow the Pre-Generation Checklist** (Part 1, Section 1.1) for every spell
3. **Use the Golden Rule** (Part 1, Section 1.2) for description vs mechanicsText
4. **Copy the correct pattern** from Part 10 (Examples) or Part 12 (Quick Reference) as your starting point
5. **Look up the class** in Part 9 (28-Class Reference) to get the correct `classResource.type` and any class-specific fields (e.g., `infernoVeil`, `devotionLevel`, `musicalNotes`, `specialMechanics`)
6. **Validate every field** against the Master Schema (Part 2) and Enumerations (Part 3) before outputting
7. **Never use deprecated patterns**: bare strings in `effects[]`, `statModifiers[]` instead of `effects[]`, `damageType` (string) instead of `damageTypes` (array), lowercase spell types

**Key files involved in spell creation:**
- This reference: `D:\VTT\docs\SPELL_DATA_REFERENCE.md`
- Normalizer (ensures any spell object renders correctly): `D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\spellNormalizer.js`
- Spell card renderer: `D:\VTT\vtt-react\src\components\spellcrafting-wizard\components\common\UnifiedSpellCard.jsx`
- Library manager (auto-categorizes + persists): `D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\libraryManager.js`
- Effect formatter (review display): `D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\formatSpellEffectsForReview.js`

---

# TABLE OF CONTENTS

- [Part 1: AI Spell Generation Protocol](#part-1-ai-spell-generation-protocol)
- [Part 2: Master Spell Data Structure](#part-2-master-spell-data-structure)
- [Part 3: All Enumerations & Lookup Tables](#part-3-all-enumerations--lookup-tables)
- [Part 4: Effect Configuration Deep Dives](#part-4-effect-configuration-deep-dives)
- [Part 5: Resolution Systems (DICE/CARDS/COINS/PROPHECY)](#part-5-resolution-systems-dicecardscoinsprophecy)
- [Part 6: Trigger & Conditional System](#part-6-trigger--conditional-system)
- [Part 7: Advanced Mechanics Systems](#part-7-advanced-mechanics-systems)
- [Part 8: Channeling System](#part-8-channeling-system)
- [Part 9: 28-Class Reference](#part-9-28-class-reference)
- [Part 10: Complete Spell Examples](#part-10-complete-spell-examples)
- [Part 11: Save Pipeline & Persistence](#part-11-save-pipeline--persistence)
- [Part 12: Quick Reference Cards](#part-12-quick-reference-cards)

---

# Part 1: AI Spell Generation Protocol

## 1.1 Pre-Generation Checklist

Before generating ANY spell, verify these rules:

- [ ] **`effectTypes` array** — Contains ONLY effect types that have corresponding `*Config` objects
- [ ] **Effect configs exist** — Each effect in `effectTypes` has its config (e.g., `effectTypes: ['damage']` requires `damageConfig: {...}`)
- [ ] **`effects[]` array for buff/debuff/control** — Use `effects[]` array with `{id, name, description}` objects, NOT bare strings and NOT `statModifiers[]`
- [ ] **`durationUnit` matches `durationType`** — Both must be identical (e.g., both `'rounds'`)
- [ ] **`actionPoints` is set** — `resourceCost.actionPoints` must be an explicit number (1-5)
- [ ] **Concrete values** — All amounts are specific numbers, never vague descriptions like "some damage"
- [ ] **Valid damage type IDs** — Use exact IDs from the enumeration: `fire`, `frost`, `lightning`, `arcane`, `nature`, `force`, `necrotic`, `radiant`, `poison`, `psychic`, `chaos`, `void`, `bludgeoning`, `piercing`, `slashing`
- [ ] **Valid targeting IDs** — Use exact IDs: `single`, `multi`, `area`, `chain`, `cone`, `line`, `self`, `smart`, `nearest`
- [ ] **Valid duration IDs** — Use exact IDs: `instant`, `rounds`, `turns`, `minutes`, `hours`, `concentration`, `permanent`
- [ ] **Valid cooldown IDs** — Use exact IDs: `turn_based`, `short_rest`, `long_rest`, `real_time`, `conditional`, `charge_based`, `encounter`, `dice_based`
- [ ] **Valid spell type IDs** — Use exact IDs: `ACTION`, `CHANNELED`, `PASSIVE`, `REACTION`, `TRAP`, `STATE`
- [ ] **`damageConfig.damageTypes` is an array** — Always `damageTypes: ['fire']`, never `damageType: 'fire'` (at top level)
- [ ] **`typeConfig` exists** — Contains at minimum `{ school: '<damageType>' }` for damage spells
- [ ] **Description vs mechanicsText** — Info goes in ONE place (see Golden Rule below)

## 1.2 The Golden Rule: description vs mechanicsText

```
┌─────────────────────────────────────────────────────────────────────────┐
│  IF the effect's description HAS the info → mechanicsText MUST BE EMPTY  │
│  IF the effect's description IS empty         → mechanicsText HAS info   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Effect Type | `description` field | `mechanicsText` field |
|-------------|---------------------|----------------------|
| **Damage** (instant/DoT) | Empty or trigger info only | `"2d6 + intelligence Fire Damage"` |
| **Healing** (instant/HoT/shield) | Empty or trigger info only | `"2d8 + spirit Healing"` |
| **Buff** (status/stat) | `"Gain +2 Strength for 3 rounds"` | **ALWAYS EMPTY** |
| **Debuff** (status/stat) | `"Slowed · DC 14 Con save · 2 rounds"` | **ALWAYS EMPTY** |
| **Control** | `"Stunned · DC 15 Con · 1 round"` | Movement distance, restraint details |
| **Summoning** | `"Medium undead · Mental (60ft)"` | `"HP: 20 · Armor: 12"` |
| **Utility** | `"Teleport up to 30 feet"` | Speed, distance details |
| **Purification** | `"Removes poison effects"` | Effects list, strength |
| **Restoration** | `"Restores mana over time"` | Formula, timing |
| **Transformation** | `"Physical · Self · 5 rounds"` | Special effects |

## 1.3 Step-by-Step Generation Workflow

### Step 1: Determine spell identity
```
name, description, level (1-9), school, icon, spellType, tags
```

### Step 2: Select spell type — determines wizard flow
```
ACTION     → Steps 1-6, 7 (mechanics), 9 (balance), 10 (review)
CHANNELED  → Steps 1-6, 8 (channeling), 9, 10
PASSIVE    → Steps 1-6, 7 (triggers), 9, 10
REACTION   → Steps 1-6, 7 (triggers), 9, 10
TRAP       → Steps 1-6, 7 (trap-placement), 9, 10
STATE      → Steps 1-6, 7 (mechanics), 9, 10
```

### Step 3: Select effect types — each adds a `*Config`
```
damage       → damageConfig
healing      → healingConfig
buff         → buffConfig
debuff       → debuffConfig
utility      → utilityConfig
control      → controlConfig
summoning    → summoningConfig
transformation → transformationConfig
purification  → purificationConfig
restoration   → restorationConfig
```

### Step 4: Configure targeting
```
targetingConfig: {
  targetingType, rangeType, rangeDistance,
  areaShape (if area/cone/line), areaSize,
  targetRestrictions, propagation (if chain)
}
```

### Step 5: Set resources
```
resourceCost: {
  actionPoints, mana, health, stamina, focus,
  classResource: { type, cost },
  reagents: [{ name, quantity, consumed }]
}
```

### Step 6: Configure cooldown
```
cooldownConfig: {
  cooldownType, cooldownValue,
  charges (if charge_based), chargeRecoveryRate,
  cooldownDice (if dice_based)
}
```

### Step 7 (conditional): Type-specific configs
```
CHANNELED  → channelingConfig
PASSIVE    → triggerConfig
REACTION   → triggerConfig
TRAP       → trapConfig
Any        → mechanicsConfig (rollable tables, procs, combo)
```

### Step 8: Validate against checklist (Section 1.1)

## 1.4 Common Mistakes

| Mistake | Fix |
|---------|-----|
| `effectTypes: ['damage']` but no `damageConfig` | Add `damageConfig: { formula, damageTypes, ... }` |
| `damageType: 'fire'` (string) | Use `damageTypes: ['fire']` (array) |
| `durationType: 'rounds'` but `durationUnit: 'turns'` | Both MUST match: `'rounds'` / `'rounds'` |
| `resourceCost: {}` (missing actionPoints) | Always set `actionPoints: <number>` |
| Using `statModifiers[]` in buffConfig | Use `effects[]` array with `{name, description, statModifier}` |
| Bare strings in `effects[]` like `"Stunned"` | Use `{ id: 'stun', name: 'Stunned', description: '...' }` |
| `spellType: 'active'` | Use `spellType: 'ACTION'` (uppercase) |
| Missing `typeConfig` | Add `typeConfig: { school: '<damageType>' }` |
| `school: 'Evocation'` (D&D name) | Use damage type ID: `school: 'fire'` |
| Description AND mechanicsText both have info | Pick ONE (see Golden Rule) |

---

# Part 2: Master Spell Data Structure

## 2.1 Complete Spell Object Schema

```javascript
{
  // ═══════════════════════════════════════════════
  // REQUIRED FIELDS
  // ═══════════════════════════════════════════════
  id: 'spell_fireball_001',          // Unique ID (auto-generated if omitted)
  name: 'Fireball',                   // Display name (string)
  spellType: 'ACTION',               // UPPERCASE enum (see §3.1)
  effectTypes: ['damage'],           // Array of effect IDs (see §3.2)

  // ═══════════════════════════════════════════════
  // BASIC INFO (recommended)
  // ═══════════════════════════════════════════════
  description: 'Hurls a ball of fire...', // Flavor text
  level: 3,                          // 1-9
  school: 'fire',                    // Damage type ID or school name
  icon: 'spell_fire_fireball02',     // WoW icon name (zamimg.com)
  source: 'class',                   // 'class' | 'general' | 'wizard' | 'community'
  tags: ['damage', 'aoe', 'fire'],   // Array of string tags

  // ═══════════════════════════════════════════════
  // TYPE CONFIG (required for damage/buff/debuff)
  // ═══════════════════════════════════════════════
  typeConfig: {
    school: 'fire',                  // Primary school/damage type
    castTime: '1 action',            // Cast time display text
    range: '120 feet',               // Range display text
    rangeType: 'ranged',             // 'melee' | 'ranged' | 'self' | 'touch'
    castTimeType: 'action',          // 'action' | 'bonus' | 'reaction' | 'free' | 'concentration'
    triggersGlobalCooldown: true,     // boolean
    usableWhileMoving: true,          // boolean
    requiresLoS: true,                // boolean
    interruptible: true               // boolean
  },

  // ═══════════════════════════════════════════════
  // TARGETING
  // ═══════════════════════════════════════════════
  targetingConfig: {
    targetingType: 'area',           // See §3.4
    rangeType: 'ranged',             // 'melee' | 'ranged' | 'self' | 'touch'
    rangeDistance: 120,              // Number (feet)
    areaShape: 'circle',             // See §3.4 (for area/cone/line)
    areaSize: 20,                   // Radius/dimensions in feet
    targetRestrictions: 'enemies',   // 'enemies' | 'allies' | 'self' | 'all' | 'none'
    maxTargets: 1,                  // Number (for multi targeting)
    lineOfSightRequired: true,       // boolean
    selectionMethod: 'manual',       // 'manual' | 'auto' | 'random'
    propagation: {                   // ONLY for chain targeting
      chainCount: 3,                 // Max chains
      chainRange: 15,               // Distance between targets (feet)
      chainDamageFalloff: 0.8,      // Multiplier per chain (0.0-1.0)
      canRetarget: false            // Can chain back to original
    }
  },

  // ═══════════════════════════════════════════════
  // DURATION
  // ═══════════════════════════════════════════════
  durationConfig: {
    durationType: 'instant',         // See §3.6
    durationValue: 0,               // Number
    durationUnit: 'instant',         // MUST match durationType
    requiresConcentration: false,    // boolean
    concentrationDC: null            // Number (if concentration)
  },

  // ═══════════════════════════════════════════════
  // RESOURCES
  // ═══════════════════════════════════════════════
  resourceCost: {
    actionPoints: 2,                // ALWAYS required (1-5)
    mana: 8,                        // Number or 0
    health: 0,                      // HP cost (Deathcaller style)
    stamina: 0,
    focus: 0,
    energy: 0,
    rage: 0,
    components: ['V', 'S'],         // Verbal, Somatic, Material
    materialComponents: 'Bat guano and sulfur',
    somaticText: 'Complex gestures',
    verbalText: 'Ancient incantation',
    classResource: {                // Class-specific resource
      type: 'inferno',              // Resource ID
      cost: 2                       // Amount
    },
    reagents: [{                    // Consumable reagents
      name: 'Bat Guano',
      quantity: 1,
      consumed: true
    }]
  },

  // ═══════════════════════════════════════════════
  // COOLDOWN
  // ═══════════════════════════════════════════════
  cooldownConfig: {
    cooldownType: 'turn_based',     // See §3.7
    cooldownValue: 3,              // Number (turns/rests/etc)
    charges: 0,                    // Max charges (if charge_based)
    chargeRecoveryRate: 'short_rest', // Recovery timing
    cooldownDice: '1d4',           // Dice formula (if dice_based)
    cooldownCategory: 'short',     // 'short' | 'long' | 'shared_elemental' | etc
    sharedCooldownWith: []         // Array of spell IDs
  },

  // ═══════════════════════════════════════════════
  // DAMAGE CONFIG (if effectTypes includes 'damage')
  // ═══════════════════════════════════════════════
  damageConfig: {
    formula: '8d6',                 // Dice formula string
    damageTypes: ['fire'],          // Array of damage type IDs (see §3.3)
    resolution: 'DICE',             // 'DICE' | 'CARDS' | 'COINS'
    diceConfig: {                   // If resolution === 'DICE'
      diceNotation: '8d6',
      diceCount: 8,
      diceSides: 6,
      modifier: 0,
      flatBonus: 0
    },
    cardConfig: {                   // If resolution === 'CARDS'
      drawCount: 3,
      successCondition: 'pair',
      damagePerCard: 4,
      suitBonus: { hearts: 2, spades: 0 }
    },
    coinConfig: {                   // If resolution === 'COINS'
      coinCount: 3,
      headsDamage: '2d6',
      tailsDamage: '1d4',
      allHeadsBonus: '3d6'
    },
    criticalConfig: {               // Critical hit settings
      enabled: true,
      critMultiplier: 2,
      critRange: [20],             // e.g., [19, 20] for expanded crit
      critBonusDamage: '2d6',
      critEffect: {                 // Additional effect on crit
        description: 'Target ignites',
        damage: '1d6',
        damageType: 'fire'
      }
    },
    savingThrow: {                  // Saving throw config
      ability: 'dexterity',         // 'strength'|'agility'|'constitution'|'intelligence'|'spirit'|'charisma'
      difficultyClass: 15,
      saveOutcome: 'half_damage',   // 'negates'|'half_damage'|'no_effect'|'damage_on_fail'
      successEffect: null,
      failureEffect: null
    },
    difficultyClass: 15,            // Shorthand DC (alternative to savingThrow object)
    chainConfig: {                  // Chain lightning style
      enabled: true,
      chainCount: 3,
      chainRange: 15,
      damageFalloff: 0.7
    },
    dotConfig: {                    // Damage over time
      enabled: true,
      damagePerTick: '1d6',
      damageType: 'fire',
      tickFrequency: 'round',       // 'round' | 'turn'
      duration: 3,                  // Number of ticks
      canStack: false,
      maxStacks: 1,
      spreading: false,
      spreadRange: 0,
      spreadChance: 0
    }
  },

  // ═══════════════════════════════════════════════
  // HEALING CONFIG (if effectTypes includes 'healing')
  // ═══════════════════════════════════════════════
  healingConfig: {
    formula: '2d8 + spirit',
    healingType: 'direct',          // 'direct'|'regeneration'|'vampiric'|'conditional'|'resurrection'|'spirit'
    resolution: 'DICE',             // 'DICE'|'CARDS'|'COINS'
    diceConfig: {
      diceNotation: '2d8',
      diceCount: 2,
      diceSides: 8,
      modifier: 'spirit'
    },
    cardConfig: {                   // If CARDS
      drawCount: 2,
      healingPerCard: 6
    },
    coinConfig: {                   // If COINS
      coinCount: 3,
      headsHealing: '2d8',
      tailsHealing: '1d4'
    },
    shieldConfig: {                 // Absorption shield
      enabled: true,
      shieldAmount: '3d8 + spirit',
      shieldDuration: 3,
      shieldDurationType: 'rounds',
      shieldType: 'standard'        // 'standard'|'fortified'|'regenerating'|'reactive'|'elemental'
    },
    hotConfig: {                    // Heal over time
      enabled: true,
      healingPerTick: '1d6',
      tickFrequency: 'round',
      duration: 3,
      canStack: false,
      maxStacks: 1,
      scalesWith: null              // Optional scaling stat
    },
    chainConfig: {
      enabled: true,
      chainCount: 3,
      chainRange: 20,
      healingFalloff: 0.8
    },
    criticalConfig: {
      enabled: true,
      critMultiplier: 2,
      critBonusHealing: '2d8',
      critEffect: {
        description: 'Also removes one negative status effect'
      }
    },
    savingThrow: {
      ability: 'constitution',
      difficultyClass: 15,
      saveOutcome: 'negates'
    }
  },

  // ═══════════════════════════════════════════════
  // BUFF CONFIG (if effectTypes includes 'buff')
  // ═══════════════════════════════════════════════
  buffConfig: {
    buffType: 'statEnhancement',    // 'statEnhancement'|'damageIncrease'|'damageMitigation'|
                                    // 'statusEffectBuff'|'combatAdvantage'|'auraEffect'|
                                    // 'movementBuff'|'triggeredEffect'
    effects: [                      // ⚠️ PRIMARY: Use effects[] array
      {
        id: 'str_boost',
        name: 'Strength Boost',
        description: '+2 Strength for 3 rounds',  // ALL info here
        mechanicsText: '',          // EMPTY when description has info
        statModifier: {
          stat: 'strength',
          magnitude: 2,
          magnitudeType: 'flat'     // 'flat'|'percentage'
        }
      },
      {
        id: 'resistance_fire',
        name: 'Fire Resistance',
        description: 'Resistance to fire damage',
        mechanicsText: '',
        statModifier: {
          stat: 'fire_resistance',
          magnitude: 50,
          magnitudeType: 'percentage'
        }
      },
      {
        id: 'haste',
        name: 'Haste',
        description: '+10 movement speed, +1 action point',
        mechanicsText: '',
        statModifier: [
          { stat: 'movement_speed', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'action_points', magnitude: 1, magnitudeType: 'flat' }
        ]
      }
    ],
    // Alternative: displayEffects (simpler, for display only)
    displayEffects: ['+2 Strength', '+10 Speed'],
    // Legacy: statBonuses[] / statModifiers[] (AVOID - use effects[])
    statusEffects: [               // Status effects applied
      { id: 'haste', level: 1 },
      { id: 'resistance', level: 2 }
    ],
    stackingRule: 'replace',        // 'replace'|'highest'|'cumulative'|'selfStacking'|'progressive'
    maxStacks: 1,
    durationType: 'rounds',         // See §3.6
    durationValue: 3,
    durationUnit: 'rounds',         // MUST match durationType
    concentrationRequired: false,
    savingThrow: null,              // Optional: { ability, difficultyClass, saveOutcome }
    aoeRadius: 0,                  // For aura effects
    conditionalTriggers: null       // For triggeredEffect type
  },

  // ═══════════════════════════════════════════════
  // DEBUFF CONFIG (if effectTypes includes 'debuff')
  // ═══════════════════════════════════════════════
  debuffConfig: {
    debuffType: 'statusEffect',     // 'statPenalty'|'damageVulnerability'|'movementImpairment'|
                                    // 'fullControl'|'damageOverTime'|'spreadingEffect'|
                                    // 'curse'|'mentalEffect'|'abilityDisable'
    effects: [                      // ⚠️ PRIMARY: Use effects[] array
      {
        id: 'slow',
        name: 'Slow',
        description: 'Movement speed reduced by 15 feet',
        mechanicsText: ''
      }
    ],
    displayEffects: ['Slowed'],
    statusEffects: [
      { id: 'slowed', level: 1 }
    ],
    statPenalties: [                // Alternative to effects[] for stat-based debuffs
      { stat: 'movement_speed', magnitude: -15, magnitudeType: 'flat' }
    ],
    savingThrow: {
      ability: 'constitution',
      difficultyClass: 14,
      saveOutcome: 'negates'        // 'negates'|'half'|'reduced_duration'
    },
    difficultyClass: 14,
    stackingRule: 'refreshing',     // 'none'|'additive'|'independent'|'diminishing'|'refreshing'
    maxStacks: 1,
    canBeDispelled: true,
    dispelDifficulty: 'normal',     // 'easy'|'normal'|'hard'|'very_hard'|'special'
    durationType: 'rounds',
    durationValue: 2,
    durationUnit: 'rounds',
    concentrationRequired: false,
    spreading: false,
    spreadRange: 0,
    spreadChance: 0,
    charmType: null,                // For charm effects: 'dominate'|'suggest'|'fear'
    charmRestrictions: null,        // Restrictions on charmed target
    charmCommandComplexity: null    // 'simple'|'moderate'|'complex'
  },

  // ═══════════════════════════════════════════════
  // UTILITY CONFIG (if effectTypes includes 'utility')
  // ═══════════════════════════════════════════════
  utilityConfig: {
    utilityType: 'movement',        // 'movement'|'control'|'environment'|'illusion'|
                                    // 'transformation'|'divination'|'conjuration'|'enchantment'
    utilitySubtype: 'teleport',    // See §3.5 for all subtypes
    selectedEffects: [              // Array of effect descriptions
      {
        id: 'teleport',
        name: 'Teleport',
        description: 'Teleport up to 30 feet',
        mechanicsText: '30 feet'
      }
    ],
    effects: [                      // Alternative format
      'Teleport up to 30 feet',
      { name: 'Invisibility', description: 'Become invisible for 1 minute' }
    ],
    duration: 1,
    durationType: 'minutes',
    difficultyClass: null,
    concentration: false,
    abilitySave: null,              // Optional: { ability, dc }
    parameters: {}                  // Subtype-specific parameters
  },

  // ═══════════════════════════════════════════════
  // CONTROL CONFIG (if effectTypes includes 'control')
  // ═══════════════════════════════════════════════
  controlConfig: {
    controlType: 'stunned',         // 'stunned'|'immobilized'|'restrained'|'prone'|
                                    // 'blinded'|'charmed'|'frightened'|'silenced'|
                                    // 'paralyzed'|'knocked_back'|'pulled'|'pushed'|
                                    // 'grappled'|'incapacitated'|'confused'|'taunted'
    strength: 'full',              // 'full'|'partial'|'minor'
    duration: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    savingThrow: {
      ability: 'constitution',
      difficultyClass: 15,
      saveOutcome: 'negates'
    },
    difficultyClass: 15,
    effects: [
      {
        id: 'stun',
        name: 'Stunned',
        description: 'Stunned for 1 round',
        mechanicsText: ''
      }
    ],
    displayEffects: ['Stunned'],
    canBeDispelled: true,
    concentrationRequired: false
  },

  // ═══════════════════════════════════════════════
  // SUMMONING CONFIG (if effectTypes includes 'summoning')
  // ═══════════════════════════════════════════════
  summoningConfig: {
    summonType: 'creature',         // 'creature'|'spirit'|'construct'|'elemental'|'undead'|'familiar'
    creatureType: 'elemental',
    creatureName: 'Fire Elemental',
    creatureLevel: 3,
    creatureStats: {
      hp: 30,
      armor: 15,
      damage: '2d6',
      damageType: 'fire',
      speed: 30,
      abilities: ['Fire Touch', 'Flame Aura']
    },
    duration: 10,
    durationType: 'minutes',
    maxSummons: 1,
    controlType: 'direct',          // 'direct'|'independent'|'semi'
    commandable: true,
    sharesInitiative: true,
    summonCount: 1                  // Number summoned
  },

  // ═══════════════════════════════════════════════
  // TRANSFORMATION CONFIG
  // ═══════════════════════════════════════════════
  transformationConfig: {
    transformationType: 'polymorph', // 'polymorph'|'shapeshift'|'elemental'|'undead'|'construct'
    targetForm: 'Wolf',
    duration: 10,
    durationType: 'minutes',
    retainsAbilities: false,
    savingThrow: {
      ability: 'wisdom',
      difficultyClass: 15,
      saveOutcome: 'negates'
    },
    difficultyClass: 15,
    newStats: {                     // Stats while transformed
      hp: null,                     // null = keep original
      armor: 14,
      speed: 40,
      damage: '1d6 + 3',
      damageType: 'piercing'
    },
    grantedAbilities: ['Bite', 'Pack Tactics']
  },

  // ═══════════════════════════════════════════════
  // PURIFICATION CONFIG
  // ═══════════════════════════════════════════════
  purificationConfig: {
    purificationType: 'dispel',     // 'dispel'|'cleanse'|'remove_curse'|'remove_disease'|
                                    // 'restore_senses'|'purify_food'|'sanctify'|'exorcise'
    targetEffects: ['poison', 'disease', 'curse'],  // What to remove
    strength: 'full',               // 'full'|'partial'|'conditional'
    checkRequired: false,           // Whether a check is needed
    checkDC: null,
    healAmount: null                // Optional: also heal
  },

  // ═══════════════════════════════════════════════
  // RESTORATION CONFIG
  // ═══════════════════════════════════════════════
  restorationConfig: {
    restorationType: 'resurrect',   // 'resurrect'|'revive'|'restore_resources'|'restore_mana'|
                                    // 'restore_health'|'restore_stamina'|'restore_all'
    targetState: 'dead',            // 'dead'|'unconscious'|'exhausted'|'depleted'
    restoredHealth: '1d4',          // HP restored on revive
    restoredMana: 0,
    removesConditions: ['poison', 'disease'],
    castingTime: '1 action',
    requiresBody: true,
    timeLimit: null,                // e.g., '10 minutes' for resurrection
    materialCost: 'Diamond worth 500gp',
    penaltyOnRevive: null           // e.g., '-1 to all checks for 1 hour'
  },

  // ═══════════════════════════════════════════════
  // CHANNELING CONFIG (if spellType === 'CHANNELED')
  // ═══════════════════════════════════════════════
  channelingConfig: {
    maxDuration: 6,                 // Max rounds of channeling
    tickFrequency: 1,               // Effects apply every N rounds
    tickScaling: 'linear',          // 'linear'|'increasing'|'decreasing'
    breakEffect: 'none',            // 'none'|'partial'|'backlash'|'explosion'
    breakDamage: null,              // Damage on break (if backlash)
    concentrationDC: null,          // DC to maintain concentration
    concentrationRequired: false,
    perRoundFormulas: {             // Effects per tick
      damage: '2d6',               // Damage per tick
      damageType: 'fire',
      healing: null,               // Healing per tick
      manaCost: 2,                // Mana cost per tick
      dotDamage: null              // DoT per tick
    },
    movementRestriction: 'none',   // 'none'|'slow'|'immobile'
    completionEffect: null,        // Effect on full channel
    interruptionEffect: null       // Effect on interruption
  },

  // ═══════════════════════════════════════════════
  // TRIGGER CONFIG (if spellType === 'PASSIVE'|'REACTION')
  // ═══════════════════════════════════════════════
  triggerConfig: {
    global: {                       // Global trigger conditions
      logicType: 'AND',             // 'AND'|'OR'|'NOT'|'XOR'
      compoundTriggers: [
        {
          type: 'damage_taken',     // See §3.8 for all trigger types
          conditions: {
            operator: 'greater_than',
            value: 10,
            damageType: 'physical'
          }
        },
        {
          type: 'health_threshold',
          conditions: {
            operator: 'less_than',
            value: 0.5              // 50% HP
          }
        }
      ]
    },
    triggerRole: {
      mode: 'auto',                 // 'auto'|'manual'|'toggle'
      activationDelay: 'immediate', // 'immediate'|'start_of_turn'|'end_of_turn'|number
      requiresLOS: false
    },
    effectTriggers: {},             // Per-effect triggers
    conditionalEffects: [],         // Conditional effect chains
    buffDebuffTriggers: {},         // Buff/debuff specific triggers
    requiredConditions: []          // Prerequisites before trigger fires
  },

  // ═══════════════════════════════════════════════
  // TRAP CONFIG (if spellType === 'TRAP')
  // ═══════════════════════════════════════════════
  trapConfig: {
    trapType: 'explosive',          // 'explosive'|'snare'|'alarm'|'debuff'|'summon'|'teleport'
    triggerRadius: 10,              // Feet
    triggerCondition: 'proximity',   // 'proximity'|'pressure'|'timer'|'manual'
    armTime: 1,                     // Rounds to arm
    duration: 'until_triggered',
    charges: 1,                     // Max triggers
    disarmDC: 15,
    detectDC: 13,
    canBeDetected: true,
    visibleToAllies: true,
    effects: []                     // What happens when triggered
  },

  // ═══════════════════════════════════════════════
  // MECHANICS CONFIG (advanced systems)
  // ═══════════════════════════════════════════════
  mechanicsConfig: {
    // Rollable Table
    rollableTable: {
      enabled: true,
      tableName: 'Wild Magic Surge',
      description: 'Roll on this table for chaotic effects',
      diceFormula: '1d20',
      resolutionType: 'DICE',
      resolutionConfig: {},
      entries: [
        { min: 1, max: 5, effect: 'Fireball centered on self', weight: 5 },
        { min: 6, max: 10, effect: 'Heal 2d8 HP', weight: 5 },
        { min: 11, max: 20, effect: '+2d6 bonus damage', weight: 10 }
      ]
    },
    // Combo Point System
    comboPoints: {
      enabled: true,
      maxPoints: 5,
      generateOnHit: true,
      generateOnCrit: 2,
      spendOnAbility: 3,
      finishingMove: {
        name: 'Eviscerate',
        damagePerPoint: '1d4',
        description: 'Deal damage based on combo points spent'
      }
    },
    // Chance on Hit / Proc
    procConfig: {
      enabled: true,
      procChance: 25,              // Percentage (0-100)
      triggerCondition: 'on_hit',   // 'on_hit'|'on_crit'|'on_kill'|'on_damage_taken'
      effects: [
        {
          name: 'Burning',
          description: '1d6 fire damage over 3 rounds',
          damage: '1d6',
          damageType: 'fire',
          duration: 3,
          durationType: 'rounds'
        }
      ],
      displayText: '25% chance on hit to apply Burning (1d6 fire, 3 rounds)',
      internalCooldown: 0
    },
    // Critical Hit System
    criticalConfig: {
      enabled: true,
      critRange: [20],
      critMultiplier: 2,
      critBonusDamage: '2d6',
      critEffect: null
    },
    // Stance/Form Requirements
    formRequirements: {
      requiredForm: 'Dancing Blade',  // Name of required stance
      requiredResource: 0,            // Additional resource cost
      formBonus: '+1d6 damage while in Dancing Blade stance'
    },
    // Toxic/Poison System
    toxicConfig: {
      enabled: true,
      maxStacks: 5,
      damagePerStack: '1d4',
      damageType: 'poison',
      durationPerStack: 2,
      applicationChance: 100,
      spreadingEnabled: false
    },
    // Card System
    cardSystem: {
      enabled: true,
      deckType: 'standard',
      drawCount: 5,
      handSize: 5,
      successCondition: 'pair',
      effectPerCard: '1d6 damage'
    },
    // Coin System
    coinSystem: {
      enabled: true,
      coinCount: 3,
      headsOutcome: { damage: '3d6', description: 'Full damage' },
      tailsOutcome: { damage: '1d6', description: 'Reduced damage' },
      allHeadsBonus: { damage: '5d6', description: 'Jackpot!' },
      allTailsPenalty: { damage: 0, description: 'Fizzle' }
    }
  },

  // ═══════════════════════════════════════════════
  // METADATA (auto-populated by library)
  // ═══════════════════════════════════════════════
  dateCreated: '2026-04-10T12:00:00.000Z',
  lastModified: '2026-04-10T12:00:00.000Z',
  source: 'wizard',                 // 'wizard'|'class'|'general'|'community'
  isCustom: false,
  isShared: false,
  authorId: null,
  categoryId: null,
  specialization: null,            // e.g., 'inferno', 'wildfire', 'hellfire'
  category: 'offensive',           // Auto-categorized by libraryManager

  // ═══════════════════════════════════════════════
  // CLASS-SPECIFIC MECHANICS (preserved by normalizer)
  // ═══════════════════════════════════════════════
  specialMechanics: {},            // Class-specific mechanic data
  infernoVeil: null,               // Pyrofiend: { level: 0-9 }
  temporalMechanics: null,         // Chronarch: { timeShards, temporalStrain }
  devotionLevel: null,             // Martyr: 0-6
  chaosSphere: null,               // Chaos Weaver
  fateThreads: null,               // Fate Weaver
  musicalNotes: null,              // Minstrel: { I: 0, II: 0, III: 0, IV: 0, V: 0, VI: 0, VII: 0 }
  sphereCosts: null,               // Arcanoneer
  necroticPath: null               // Deathcaller
}
```

## 2.2 Field Priority Guide

| Priority | Fields | Notes |
|----------|--------|-------|
| **REQUIRED** | `name`, `spellType`, `effectTypes`, `resourceCost.actionPoints` | Spell is invalid without these |
| **HIGHLY RECOMMENDED** | `id`, `description`, `level`, `icon`, `typeConfig`, matching `*Config` | Needed for proper display |
| **RECOMMENDED** | `targetingConfig`, `cooldownConfig`, `durationConfig`, `school`, `tags` | Needed for gameplay |
| **OPTIONAL** | `source`, `dateCreated`, `lastModified`, `category`, `specialization` | Metadata |
| **CONDITIONAL** | `channelingConfig`, `triggerConfig`, `trapConfig`, `mechanicsConfig` | Only for specific spell types |

---

# Part 3: All Enumerations & Lookup Tables

## 3.1 Spell Types

| ID | Name | Description | Additional Required Fields |
|----|------|-------------|--------------------------|
| `ACTION` | Action | Standard castable spell | None |
| `CHANNELED` | Channeled | Effect over multiple rounds | `channelingConfig` |
| `PASSIVE` | Passive | Always-on or conditional effect | `triggerConfig` |
| `REACTION` | Reaction | Responds to specific triggers | `triggerConfig` |
| `TRAP` | Trap | Placed and triggered by enemies | `trapConfig` |
| `STATE` | State | Persistent state/stance change | `mechanicsConfig` |

**Colors**: ACTION=#dc2626, PASSIVE=#16a34a, REACTION=#2563eb, CHANNELED=#9333ea, TRAP=#ea580c, STATE=#6b7280

## 3.2 Effect Types

| ID | Name | Category | Config Object | AP Cost |
|----|------|----------|----------------|---------|
| `damage` | Damage | offensive | `damageConfig` | 2 |
| `healing` | Healing | supportive | `healingConfig` | 2 |
| `buff` | Buff | supportive | `buffConfig` | 1 |
| `debuff` | Debuff | offensive | `debuffConfig` | 1 |
| `utility` | Utility | utility | `utilityConfig` | 1 |
| `control` | Control | tactical | `controlConfig` | 2 |
| `summoning` | Summoning | conjuration | `summoningConfig` | 3 |
| `transformation` | Transformation | alteration | `transformationConfig` | 2 |
| `purification` | Purification | supportive | `purificationConfig` | 2 |
| `restoration` | Restoration | supportive | `restorationConfig` | 2 |

## 3.3 Damage Types

| ID | Name | Category | Icon | Common Resistance | Common Vulnerability |
|----|------|----------|------|-------------------|---------------------|
| `bludgeoning` | Bludgeoning | physical | `inv_mace_2h_blacksmithing_01` | Heavy armor | Constructs |
| `piercing` | Piercing | physical | `inv_sword_33` | Medium armor | Unarmored |
| `slashing` | Slashing | physical | `ability_warrior_cleave` | Plate armor | Cloth armor |
| `fire` | Fire | elemental | `spell_fire_fire` | Red dragons, fire elementals | Undead, plants, ice creatures |
| `frost` | Frost | elemental | `spell_frost_frostbolt02` | Ice elementals, white dragons | Fire creatures, water elementals |
| `lightning` | Lightning | elemental | `spell_lightning_lightningbolt01` | Blue dragons, air elementals | Metal armor, water creatures |
| `arcane` | Arcane | arcane | `spell_arcane_arcanepotency` | Arcane golems | Non-magical creatures |
| `nature` | Nature | elemental | `spell_nature_naturetouchgrow` | Nature-aligned, druids | Undead, constructs |
| `force` | Force | arcane | `spell_arcane_blast` | Arcane golems | Ethereal creatures |
| `necrotic` | Necrotic | otherworldly | `spell_shadow_deathcoil` | Undead, constructs | Living creatures, plants |
| `radiant` | Radiant | otherworldly | `spell_holy_holysmite` | Celestials, light elementals | Undead, fiends, shadows |
| `poison` | Poison | elemental | `ability_rogue_poisonousanimosity` | Undead, constructs, plants | Beasts, humanoids |
| `psychic` | Psychic | otherworldly | `spell_shadow_mindtwisting` | Mindless creatures, constructs | Intelligent creatures |
| `chaos` | Chaos | otherworldly | `spell_shadow_charm` | Order-aligned, constructs | Chaos-aligned |
| `void` | Void | otherworldly | `spell_shadow_shadowwordpain` | Void-touched, shadow beings | Light-aligned, radiant |

**Saving throw ability mapping**: `dexterity` → `agility`, `wisdom` → `spirit` (code handles conversion)

## 3.4 Targeting Types & AOE Shapes

### Targeting Types

| ID | Name | Description | Additional Fields |
|----|------|-------------|------------------|
| `single` | Single Target | One target | None |
| `multi` | Multiple Target | N targets | `maxTargets` |
| `area` | Area of Effect | All in zone | `areaShape`, `areaSize` |
| `chain` | Chain | Bounces between targets | `propagation` |
| `cone` | Cone | Cone-shaped area | `areaSize` (length) |
| `line` | Line | Line-shaped area | `areaSize` (length) |
| `self` | Self | Caster only | None |
| `smart` | Smart | Auto-selects best target | None |
| `nearest` | Nearest | Closest target(s) | `maxTargets` |

### AOE Shapes

| ID | Description |
|----|-------------|
| `circle` | Circle with radius |
| `square` | Square with side length |
| `cone` | Cone (angle defaults to 90°) |
| `line` | Line (width defaults to 5ft) |
| `cube` | 3D cube |
| `sphere` | 3D sphere |
| `cylinder` | Cylinder (radius + height) |
| `wall` | Wall (length + thickness) |
| `trail` | Path behind moving target |
| `none` | No AOE shape |

### Propagation (Chain Targeting)

```javascript
propagation: {
  chainCount: 3,            // Max targets in chain
  chainRange: 15,           // Max distance between targets (feet)
  chainDamageFalloff: 0.8,  // Damage multiplier per bounce (0.0-1.0)
  canRetarget: false        // Can chain back to already-hit targets
}
```

## 3.5 Utility Subtypes

| Utility Type | Subtypes |
|-------------|----------|
| `movement` | `teleport`, `flight`, `speed`, `phasing`, `wall_walking` |
| `control` | `pull`, `push`, `barrier`, `gravity` |
| `environment` | `terrain`, `hazard`, `light`, `weather` |
| `illusion` | `visual`, `sound`, `complex`, `disguise` |
| `transformation` | `animal`, `element`, `size`, `object`, `phase_shift` |
| `divination` | `detection`, `scrying`, `identification`, `prediction`, `truesight` |
| `conjuration` | `creature`, `object`, `element`, `portal` |
| `enchantment` | `weapon`, `armor`, `item`, `sentience` |

## 3.6 Duration Types

| ID | Name | Description | AP Modifier |
|----|------|-------------|-------------|
| `instant` | Instant | One-time effect | 0 |
| `rounds` | Rounds | N combat rounds | 1 |
| `turns` | Turns | N combat turns | 1 |
| `minutes` | Minutes | N game minutes | 2 |
| `hours` | Hours | N game hours | 3 |
| `concentration` | Concentration | Until concentration breaks | 1 |
| `permanent` | Permanent | Until dispelled | 4 |

## 3.7 Cooldown Types

| ID | Name | Additional Fields |
|----|------|------------------|
| `turn_based` | Turn-Based | `cooldownValue` (turns) |
| `short_rest` | Short Rest | `cooldownValue` (always 1) |
| `long_rest` | Long Rest | `cooldownValue` (always 1) |
| `real_time` | Real Time | `cooldownValue` (seconds) |
| `conditional` | Conditional | Custom condition logic |
| `charge_based` | Charge-Based | `charges`, `chargeRecoveryRate` |
| `encounter` | Per Encounter | `cooldownValue` (always 1) |
| `dice_based` | Dice-Based | `cooldownDice` (e.g., `'1d4'` turns) |

## 3.8 Trigger Types

### Proximity Triggers
| ID | Description |
|----|-------------|
| `enter_range` | Target enters range |
| `exit_range` | Target exits range |
| `line_of_sight` | Line of sight gained/lost |
| `proximity_to_terrain` | Near specific terrain |

### Status Triggers
| ID | Description |
|----|-------------|
| `status_applied` | Status effect applied |
| `status_removed` | Status effect removed |
| `health_threshold` | HP above/below threshold |
| `stun_break` | Breaking free from stun |

### Combat Triggers
| ID | Description |
|----|-------------|
| `damage_taken` | Taking damage |
| `damage_dealt` | Dealing damage |
| `critical_hit` | Scoring a critical hit |
| `dodge` | Successfully dodging |
| `parry` | Successfully parrying |
| `block` | Successfully blocking |
| `attack_miss` | Attack misses |

### Resource Triggers
| ID | Description |
|----|-------------|
| `mana_threshold` | Mana above/below threshold |
| `resource_spent` | Resource spent |
| `resource_gained` | Resource gained |
| `combo_points` | Combo points threshold |

### Turn-Based Triggers
| ID | Description |
|----|-------------|
| `turn_start` | Start of turn |
| `turn_end` | End of turn |
| `round_start` | Start of round |
| `round_end` | End of round |
| `nth_turn` | Every Nth turn |

### Movement Triggers
| ID | Description |
|----|-------------|
| `movement_start` | Beginning movement |
| `movement_stop` | Ending movement |
| `jump` | Jumping |
| `fall_damage` | Taking fall damage |
| `distance_traveled` | Traveled X feet |

### Spell-Based Triggers
| ID | Description |
|----|-------------|
| `spell_cast` | Any spell cast |
| `spell_reflected` | Spell reflected |
| `spell_interrupted` | Spell interrupted |
| `counterspell` | Counterspell attempt |
| `dispel` | Dispel attempt |

### Trigger Operators
| ID | Meaning |
|----|---------|
| `equals` | Value equals X |
| `not_equals` | Value does not equal X |
| `greater_than` | Value > X |
| `less_than` | Value < X |
| `contains` | Value contains X |
| `not_contains` | Value does not contain X |
| `between` | Value between X and Y |
| `percentage_above` | HP/resource above X% |

## 3.9 Status Effects

### Positive Status Effects
| ID | Name | Description |
|----|------|-------------|
| `inspired` | Inspired | +1 to all checks |
| `blessed` | Blessed | +1d4 to saving throws |
| `regeneration` | Regeneration | Heal X HP per round |
| `invisible` | Invisible | Cannot be seen |
| `haste` | Haste | +2 speed, +1 AP |
| `resistance` | Resistance | Resist one damage type |
| `flying` | Flying | Can fly |
| `truesight` | Truesight | See through illusions |
| `energized` | Energized | +1 spell damage |
| `shielded` | Shielded | Temporary HP shield |
| `empowered` | Empowered | +2 to primary stat |

### Negative Status Effects
| ID | Name | Description |
|----|------|-------------|
| `blinded` | Blinded | Cannot see |
| `charmed` | Charmed | Controlled by caster |
| `frightened` | Frightened | Disadvantage near source |
| `paralyzed` | Paralyzed | Cannot move or act |
| `poisoned` | Poisoned | Disadvantage on attacks |
| `restrained` | Restrained | Reduced speed, attack disadvantage |
| `silenced` | Silenced | Cannot cast spells |

### Combat Advantages
| ID | Effect |
|----|--------|
| `attackers_advantage_buff` | Enemies have advantage against target |
| `attackers_disadvantage` | Enemies have disadvantage against target |
| `advantage_attack` | Target has advantage on attacks |
| `critical_improved` | Expanded crit range |
| `damage_bonus` | +X bonus damage |
| `extra_action` | +1 action point |
| `damage_resistance` | Resist X damage |
| `saving_throw_advantage` | Advantage on saves |
| `lifesteal` | Heal X% of damage dealt |

## 3.10 Stat Modifiers

### Primary Stats
| ID | Name | Category |
|----|------|----------|
| `strength` | Strength | primary |
| `agility` | Agility | primary |
| `constitution` | Constitution | primary |
| `intelligence` | Intelligence | primary |
| `spirit` | Spirit | primary |
| `charisma` | Charisma | primary |

### Combat Stats
| ID | Name | Category |
|----|------|----------|
| `initiative` | Initiative | combat |
| `armor` | Armor | combat |
| `lifesteal` | Lifesteal | combat |
| `damage_reflection` | Damage Reflection | combat |

### Damage Type Spell Power
| ID | Category |
|----|----------|
| `fire_spell_power` | damage_type |
| `frost_spell_power` | damage_type |
| `lightning_spell_power` | damage_type |
| `arcane_spell_power` | damage_type |
| `nature_spell_power` | damage_type |
| `necrotic_spell_power` | damage_type |
| `radiant_spell_power` | damage_type |
| `poison_spell_power` | damage_type |
| `psychic_spell_power` | damage_type |
| `chaos_spell_power` | damage_type |
| `void_spell_power` | damage_type |

### Resistance Modifiers
| ID | Name |
|----|------|
| `damage_immunity` | Damage Immunity |
| `damage_reduction` | Damage Reduction |
| `physical_resistance` | Physical Resistance |
| `fire_resistance` | Fire Resistance |
| `frost_resistance` | Frost Resistance |
| `lightning_resistance` | Lightning Resistance |
| `arcane_resistance` | Arcane Resistance |
| `nature_resistance` | Nature Resistance |
| `necrotic_resistance` | Necrotic Resistance |
| `radiant_resistance` | Radiant Resistance |
| `poison_resistance` | Poison Resistance |
| `psychic_resistance` | Psychic Resistance |

### Utility Stats
| ID | Name |
|----|------|
| `movement_speed` | Movement Speed |
| `swim_speed` | Swim Speed |
| `vision_range` | Vision Range |
| `carrying_capacity` | Carrying Capacity |
| `mana_cost_reduction` | Mana Cost Reduction |

### Recovery Stats
| ID | Name |
|----|------|
| `hp_regen` | HP Regen |
| `mp_regen` | Mana Regen |
| `healing_power` | Healing Power |

## 3.11 Formula Variables

### Character Stats (use in formulas)
| Variable | Description |
|----------|-------------|
| `strength` | Strength score |
| `agility` | Agility score |
| `constitution` | Constitution score |
| `intelligence` | Intelligence score |
| `spirit` | Spirit score |
| `charisma` | Charisma score |
| `level` | Character level |
| `maxHealth` | Max HP |
| `currentHealth` | Current HP |
| `maxMana` | Max Mana |
| `currentMana` | Current Mana |
| `maxActionPoints` | Max AP |
| `currentActionPoints` | Current AP |
| `damage` | Current damage stat |
| `spellDamage` | Spell damage stat |
| `healingPower` | Healing power stat |
| `armor` | Armor class |
| `healthRegen` | HP regen rate |
| `manaRegen` | Mana regen rate |
| `moveSpeed` | Movement speed |

### Dice Variables
| Variable | Example Output |
|----------|---------------|
| `1d4` | 1-4 |
| `1d6` | 1-6 |
| `1d8` | 1-8 |
| `1d10` | 1-10 |
| `1d12` | 1-12 |
| `1d20` | 1-20 |
| `2d6` | 2-12 |
| `3d6` | 3-18 |
| `3d8` | 3-24 |

### Card Variables (for CARDS resolution)
| Variable | Description |
|----------|-------------|
| `CARD_VALUE` | Numeric value of drawn card |
| `FACE_CARDS` | Number of face cards drawn |
| `PAIRS` | Number of pairs in hand |
| `SAME_SUIT` | Number of same-suit cards |
| `FLUSH` | Boolean: all same suit |
| `STRAIGHT` | Boolean: consecutive values |
| `ROYAL_FLUSH` | Boolean: 10-J-Q-K-A same suit |
| `POKER_HAND_RANK` | Poker hand rank (0-9) |

### Coin Variables (for COINS resolution)
| Variable | Description |
|----------|-------------|
| `HEADS_COUNT` | Number of heads flipped |
| `TAILS_COUNT` | Number of tails flipped |
| `ALL_HEADS` | Boolean: all heads |
| `ALL_TAILS` | Boolean: all tails |
| `HEADS_RATIO` | Ratio of heads to total |
| `CONSECUTIVE_HEADS` | Longest consecutive heads streak |

### Math Functions
| Function | Example |
|----------|---------|
| `MAX(a, b)` | `MAX(3d6, 10)` |
| `MIN(a, b)` | `MIN(1d4, 2)` |
| `FLOOR(x)` | `FLOOR(3.7)` = 3 |
| `CEIL(x)` | `CEIL(3.2)` = 4 |
| `ROUND(x)` | `ROUND(3.5)` = 4 |
| `ABS(x)` | `ABS(-5)` = 5 |

---

# Part 4: Effect Configuration Deep Dives

## 4.1 Damage Configuration

### Minimal Damage Spell
```javascript
{
  name: "Fire Bolt",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "fire", range: "120 feet", rangeType: "ranged" },
  damageConfig: {
    formula: "2d6 + intelligence",
    damageTypes: ["fire"],
    resolution: "DICE"
  },
  resourceCost: { actionPoints: 2, mana: 5 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 120 }
}
```

### Damage with DoT
```javascript
damageConfig: {
  formula: "3d6",
  damageTypes: ["poison"],
  resolution: "DICE",
  dotConfig: {
    enabled: true,
    damagePerTick: "1d6",
    damageType: "poison",
    tickFrequency: "round",
    duration: 3,
    canStack: false,
    maxStacks: 1
  }
}
```

### Damage with Saving Throw
```javascript
damageConfig: {
  formula: "8d6",
  damageTypes: ["fire"],
  resolution: "DICE",
  savingThrow: {
    ability: "dexterity",
    difficultyClass: 15,
    saveOutcome: "half_damage"
  }
}
```

### Damage with Chain
```javascript
damageConfig: {
  formula: "6d6",
  damageTypes: ["lightning"],
  resolution: "DICE",
  chainConfig: {
    enabled: true,
    chainCount: 3,
    chainRange: 15,
    damageFalloff: 0.7
  }
}
```

### Damage with Critical Hit Config
```javascript
damageConfig: {
  formula: "2d6 + strength",
  damageTypes: ["slashing"],
  resolution: "DICE",
  criticalConfig: {
    enabled: true,
    critMultiplier: 2,
    critRange: [19, 20],
    critBonusDamage: "2d6",
    critEffect: {
      description: "Target bleeds",
      damage: "1d4",
      damageType: "slashing"
    }
  }
}
```

## 4.2 Healing Configuration

### Minimal Healing Spell
```javascript
{
  name: "Healing Word",
  spellType: "ACTION",
  effectTypes: ["healing"],
  typeConfig: { school: "healing", range: "60 feet", rangeType: "ranged" },
  healingConfig: {
    formula: "1d4 + spirit",
    healingType: "direct",
    resolution: "DICE"
  },
  resourceCost: { actionPoints: 2, mana: 5 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60 }
}
```

### Healing with Shield
```javascript
healingConfig: {
  formula: "2d8 + spirit",
  healingType: "direct",
  resolution: "DICE",
  shieldConfig: {
    enabled: true,
    shieldAmount: "3d8 + spirit",
    shieldDuration: 3,
    shieldDurationType: "rounds",
    shieldType: "standard"
  }
}
```

### Heal over Time (HoT)
```javascript
healingConfig: {
  formula: "1d8",
  healingType: "direct",
  resolution: "DICE",
  hotConfig: {
    enabled: true,
    healingPerTick: "1d8",
    tickFrequency: "round",
    duration: 3,
    canStack: false,
    maxStacks: 1
  }
}
```

### Chain Healing
```javascript
healingConfig: {
  formula: "4d8 + spirit",
  healingType: "direct",
  resolution: "DICE",
  chainConfig: {
    enabled: true,
    chainCount: 4,
    chainRange: 20,
    healingFalloff: 0.8
  }
}
```

## 4.3 Buff Configuration

### ⚠️ CRITICAL: Always use `effects[]` array

```javascript
buffConfig: {
  buffType: "statEnhancement",
  effects: [
    {
      id: "str_boost",
      name: "Strength Boost",
      description: "+2 Strength for 3 rounds",
      mechanicsText: "",
      statModifier: { stat: "strength", magnitude: 2, magnitudeType: "flat" }
    }
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  stackingRule: "replace",
  maxStacks: 1
}
```

### Multi-Stat Buff
```javascript
buffConfig: {
  buffType: "statEnhancement",
  effects: [
    {
      id: "combat_buff",
      name: "Battle Fury",
      description: "+2 Strength, +1 Armor, +10 Speed for 5 rounds",
      mechanicsText: "",
      statModifier: [
        { stat: "strength", magnitude: 2, magnitudeType: "flat" },
        { stat: "armor", magnitude: 1, magnitudeType: "flat" },
        { stat: "movement_speed", magnitude: 10, magnitudeType: "flat" }
      ]
    }
  ],
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds"
}
```

### Damage Resistance Buff
```javascript
buffConfig: {
  buffType: "damageMitigation",
  effects: [
    {
      id: "fire_resist",
      name: "Fire Ward",
      description: "50% fire resistance for 10 minutes",
      mechanicsText: "",
      statModifier: { stat: "fire_resistance", magnitude: 50, magnitudeType: "percentage" }
    }
  ],
  durationType: "minutes",
  durationValue: 10,
  durationUnit: "minutes"
}
```

### Status Effect Buff
```javascript
buffConfig: {
  buffType: "statusEffectBuff",
  effects: [
    { id: "haste", name: "Haste", description: "+10 speed, +1 AP for 1 minute", mechanicsText: "" }
  ],
  statusEffects: [{ id: "haste", level: 1 }],
  durationType: "minutes",
  durationValue: 1,
  durationUnit: "minutes"
}
```

### Stacking Rules
| Rule | Behavior |
|------|----------|
| `replace` | New buff replaces old |
| `highest` | Keeps highest magnitude |
| `cumulative` | Adds magnitudes |
| `selfStacking` | Same caster can stack |
| `progressive` | Each stack adds different effect |

## 4.4 Debuff Configuration

### ⚠️ CRITICAL: Always use `effects[]` array

### Simple Debuff
```javascript
debuffConfig: {
  debuffType: "statusEffect",
  effects: [
    { id: "slowed", name: "Slow", description: "Movement speed reduced by 15 feet", mechanicsText: "" }
  ],
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  canBeDispelled: true
}
```

### Debuff with Save
```javascript
debuffConfig: {
  debuffType: "statusEffect",
  effects: [
    { id: "poisoned", name: "Poisoned", description: "Disadvantage on attacks · DC 14 Con save", mechanicsText: "" }
  ],
  savingThrow: {
    ability: "constitution",
    difficultyClass: 14,
    saveOutcome: "negates"
  },
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  canBeDispelled: true,
  dispelDifficulty: "normal"
}
```

### Stat Penalty Debuff
```javascript
debuffConfig: {
  debuffType: "statPenalty",
  effects: [
    { id: "weaken", name: "Weaken", description: "-2 Strength and Armor", mechanicsText: "" }
  ],
  statPenalties: [
    { stat: "strength", magnitude: -2, magnitudeType: "flat" },
    { stat: "armor", magnitude: -2, magnitudeType: "flat" }
  ],
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds"
}
```

### Charm Effect (Enhanced)
```javascript
debuffConfig: {
  debuffType: "mentalEffect",
  effects: [
    {
      id: "charm",
      name: "Charm Person",
      description: "Charmed · Cannot attack caster · DC 15 Spirit save",
      mechanicsText: ""
    }
  ],
  savingThrow: { ability: "spirit", difficultyClass: 15, saveOutcome: "negates" },
  charmType: "suggest",
  charmRestrictions: ["cannot_attack_caster", "cannot_flee"],
  charmCommandComplexity: "simple",
  durationType: "minutes",
  durationValue: 10,
  durationUnit: "minutes"
}
```

### Spreading Debuff
```javascript
debuffConfig: {
  debuffType: "spreadingEffect",
  effects: [
    { id: "plague", name: "Plague", description: "1d6 poison damage per round, spreads to adjacent", mechanicsText: "" }
  ],
  spreading: true,
  spreadRange: 10,
  spreadChance: 50,
  durationType: "rounds",
  durationValue: 5,
  durationUnit: "rounds"
}
```

## 4.5 Control Configuration

```javascript
controlConfig: {
  controlType: "stunned",
  strength: "full",
  duration: 1,
  durationType: "rounds",
  durationUnit: "rounds",
  savingThrow: {
    ability: "constitution",
    difficultyClass: 15,
    saveOutcome: "negates"
  },
  effects: [
    { id: "stun", name: "Stunned", description: "Stunned for 1 round · DC 15 Con save", mechanicsText: "" }
  ],
  canBeDispelled: true
}
```

### Control Types
| ID | Effect |
|----|--------|
| `stunned` | Cannot act, auto-fail STR/DEX saves |
| `immobilized` | Cannot move |
| `restrained` | Reduced speed, disadvantage on attacks |
| `prone` | Disadvantage on attacks, advantage on melee against |
| `blinded` | Cannot see, auto-fail sight checks |
| `charmed` | Cannot attack caster |
| `frightened` | Disadvantage near source, cannot approach |
| `silenced` | Cannot cast spells with verbal component |
| `paralyzed` | Cannot move or act, auto-crit |
| `knocked_back` | Pushed X feet |
| `pulled` | Pulled toward caster |
| `pushed` | Pushed away from caster |
| `grappled` | Speed 0 |
| `incapacitated` | Cannot act or react |
| `confused` | Random action each turn |
| `taunted` | Must attack taunter |

## 4.6 Utility Configuration

```javascript
utilityConfig: {
  utilityType: "movement",
  utilitySubtype: "teleport",
  effects: [
    { id: "teleport", name: "Blink", description: "Teleport up to 30 feet", mechanicsText: "30 feet" }
  ],
  duration: 0,
  durationType: "instant",
  difficultyClass: null,
  concentration: false
}
```

### More Utility Examples
```javascript
// Detection
{ utilityType: "divination", utilitySubtype: "detection",
  effects: [{ id: "detect_magic", name: "Detect Magic", description: "Sense magical auras within 30 feet", mechanicsText: "30 feet" }] }

// Barrier
{ utilityType: "control", utilitySubtype: "barrier",
  effects: [{ id: "wall", name: "Wall of Force", description: "Create a 10ft wall", mechanicsText: "10ft wall, 30 HP" }] }

// Disguise
{ utilityType: "illusion", utilitySubtype: "disguise",
  effects: [{ id: "disguise", name: "Disguise Self", description: "Change appearance for 1 hour", mechanicsText: "" }],
  duration: 1, durationType: "hours", concentration: true }
```

## 4.7 Summoning Configuration

```javascript
summoningConfig: {
  summonType: "elemental",
  creatureType: "elemental",
  creatureName: "Fire Elemental",
  creatureLevel: 3,
  creatureStats: {
    hp: 30,
    armor: 15,
    damage: "2d6",
    damageType: "fire",
    speed: 30,
    abilities: ["Fire Touch", "Flame Aura"]
  },
  duration: 10,
  durationType: "minutes",
  maxSummons: 1,
  controlType: "direct",
  commandable: true,
  sharesInitiative: true,
  summonCount: 1
}
```

## 4.8 Transformation Configuration

```javascript
transformationConfig: {
  transformationType: "shapeshift",
  targetForm: "Dire Wolf",
  duration: 10,
  durationType: "minutes",
  retainsAbilities: false,
  savingThrow: { ability: "spirit", difficultyClass: 15, saveOutcome: "negates" },
  newStats: { hp: null, armor: 14, speed: 40, damage: "1d6 + 3", damageType: "piercing" },
  grantedAbilities: ["Bite Attack", "Pack Tactics"]
}
```

## 4.9 Purification Configuration

```javascript
purificationConfig: {
  purificationType: "cleanse",
  targetEffects: ["poison", "disease"],
  strength: "full",
  checkRequired: false,
  healAmount: "2d8"
}
```

## 4.10 Restoration Configuration

```javascript
restorationConfig: {
  restorationType: "resurrect",
  targetState: "dead",
  restoredHealth: "1d4",
  restoredMana: 0,
  removesConditions: ["poison", "disease"],
  castingTime: "1 action",
  requiresBody: true,
  timeLimit: "10 minutes",
  materialCost: "Diamond worth 500gp",
  penaltyOnRevive: "-1 to all checks for 1 hour"
}
```

---

# Part 5: Resolution Systems (DICE/CARDS/COINS/PROPHECY)

## 5.1 DICE Resolution

Standard dice-based resolution. Used by most spells.

```javascript
damageConfig: {
  formula: "3d8 + intelligence",
  damageTypes: ["fire"],
  resolution: "DICE",
  diceConfig: {
    diceNotation: "3d8",
    diceCount: 3,
    diceSides: 8,
    modifier: "intelligence",
    flatBonus: 0
  }
}
```

**Formula patterns**: `2d6`, `3d8 + 5`, `1d12 + strength`, `4d6 + intelligence`, `2d10 + 2d4`

## 5.2 CARDS Resolution

Card draw mechanics. Outcomes determined by poker-like hand evaluation.

```javascript
damageConfig: {
  formula: "CARD_VALUE * 2",
  damageTypes: ["arcane"],
  resolution: "CARDS",
  cardConfig: {
    drawCount: 5,
    successCondition: "pair",       // 'pair'|'flush'|'straight'|'full_house'|'royal_flush'
    damagePerCard: 4,
    suitBonus: {
      hearts: 2,                    // +2 per heart card
      spades: 0,
      clubs: 0,
      diamonds: 1
    }
  }
}
```

### Card Hand Ranks
| Hand | Description | Multiplier |
|------|-------------|------------|
| `high_card` | No matches | 1x |
| `pair` | Two of same value | 2x |
| `two_pair` | Two different pairs | 3x |
| `three_kind` | Three of same value | 4x |
| `straight` | Five consecutive | 5x |
| `flush` | Five same suit | 6x |
| `full_house` | Three + pair | 7x |
| `four_kind` | Four of same value | 8x |
| `straight_flush` | Straight + flush | 9x |
| `royal_flush` | 10-J-Q-K-A same suit | 10x |

## 5.3 COINS Resolution

Coin flip mechanics. Outcomes based on heads/tails combinations.

```javascript
damageConfig: {
  formula: "COIN_RESULT",
  damageTypes: ["force"],
  resolution: "COINS",
  coinConfig: {
    coinCount: 3,
    headsDamage: "2d6 per head",
    tailsDamage: "1d4 per tail",
    allHeadsBonus: "3d6 additional",
    allTailsPenalty: "spell fizzles"
  }
}
```

### Coin Outcome Patterns
| Pattern | Effect |
|---------|--------|
| All heads | Maximum bonus effect |
| All tails | Minimum/fizzle effect |
| Mixed | Scaled by HEADS_COUNT / coinCount |

## 5.4 PROPHECY Resolution (Doomsayer)

Prophecy resolution uses a dynamic range created by rolling 2 dice, then a resolution die is rolled against that range. Three possible outcomes exist: **Prophesied** (inside range), **Base** (on boundary), and **Outside** (miss range).

### Critical PROPHECY Rules

1. **`resolution` must be `"PROPHECY"`** — This tells the card renderer to use the Prophecy Summary component and skip the normal damage block.
2. **Use `mechanicsConfig` with `system: "PROPHECY"`** — The prophecy data goes inside `mechanicsConfig[].prophecy`, NOT as a top-level `prophecyConfig`.
3. **`effectTypes` must match actual config objects** — If debuff effects are described inside prophecy outcomes (not in a standalone `debuffConfig`), do NOT include `'debuff'` in `effectTypes`. Including it without a `debuffConfig` creates an empty block on the card.
4. **`damageConfig` is optional but recommended** — Setting `damageConfig.damageTypes` ensures the damage type badge shows in the header. Set `damageConfig.resolution: "PROPHECY"` so the card knows damage is prophecy-based.

### Correct PROPHECY Pattern

```javascript
{
  name: "Doom Bolt",
  spellType: "ACTION",
  effectTypes: ["damage"],  // ⚠️ Only include types with actual *Config objects
  resolution: "PROPHECY",
  typeConfig: { school: "necrotic", castTime: "1 action", castTimeType: "action" },
  targetingConfig: { targetingType: "single", rangeDistance: 60, targetRestrictions: ["enemies"] },
  resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "havoc", cost: -3 } },
  damageConfig: {
    formula: "2d8",           // Base damage (displayed in header badge area)
    damageTypes: ["necrotic"],
    resolution: "PROPHECY"    // ⚠️ Required so damage section knows it's prophecy
  },
  mechanicsConfig: [         // ⚠️ Prophecy goes here, NOT top-level prophecyConfig
    {
      enabled: true,
      system: "PROPHECY",
      prophecy: {
        rangeDice: ["d8", "d6"],      // 2 dice that form the range (lower = Low, higher = High)
        resolutionDie: "d6",          // Die rolled AGAINST the range
        prophesied: {
          damage: "4d8",            // Enhanced damage when result is INSIDE range
          effect: {                  // Optional effect applied on prophesied
            name: "Weakened",
            duration: 2,
            unit: "rounds",
            statModifiers: [{ stat: "ALL ROLLS", value: -2 }],
            description: "-2 to all rolls for 2 rounds"
          },
          havocGain: 3,             // Havoc resource gained
          description: "Deals 4d8 necrotic and -2 to all rolls for 2 rounds"
        },
        base: {
          damage: "2d8",            // Standard damage when result equals a boundary
          havocGain: 1,
          description: "Deals 2d8 necrotic damage"
        },
        outside: {
          backlash: "1d8 necrotic to self",  // Penalty when result is OUTSIDE range
          havocGain: 0,
          description: "Backfire: 1d8 necrotic damage to you"
        }
      }
    }
  ],
  tags: ["damage", "necrotic", "prophecy"]
}
```

### PROPHECY with Debuff Effects Inside Outcomes

If debuff effects are part of prophecy outcomes (not a standalone `debuffConfig`):

```javascript
{
  effectTypes: ["damage"],   // ✅ NOT ["damage", "debuff"] — no debuffConfig exists
  resolution: "PROPHECY",
  mechanicsConfig: [{
    enabled: true,
    system: "PROPHECY",
    prophecy: {
      rangeDice: ["d6", "d4"],
      resolutionDie: "d4",
      prophesied: {
        damage: "8d10",
        effect: {
          name: "Soul Wound",
          duration: 5,
          unit: "rounds",
          healingBlock: true,
          description: "No healing + 1d6 necrotic/round for 5 rounds"
        },
        havocGain: 6
      },
      base: { damage: "5d10", havocGain: 3 },
      outside: { backlash: "3d10 necrotic to self", havocGain: 0 }
    }
  }],
  damageConfig: { formula: "5d10", damageTypes: ["necrotic"], resolution: "PROPHECY" }
}
```

### PROPHECY with Roll Table

```javascript
{
  effectTypes: ["damage"],
  resolution: "PROPHECY",
  mechanicsConfig: [{
    enabled: true,
    system: "PROPHECY",
    prophecy: {
      rangeDice: ["d10", "d8"],
      resolutionDie: "d8",
      prophesied: {
        damage: "6d8 fire + 3d8 necrotic",
        effect: { name: "Burning Ground", duration: 3, unit: "rounds" },
        havocGain: 4
      },
      base: { damage: "4d8 fire + 2d8 necrotic", havocGain: 3 },
      outside: { backlash: "2d8 to self", havocGain: 0 }
    }
  }],
  tableConfig: {              // Optional rollable table (renders inside Prophecy Summary)
    name: "Rain Table",
    rolls: [
      { roll: "1-2", effect: "1d6 fire damage" },
      { roll: "3-4", effect: "1d6 force damage + knocked prone" },
      { roll: "5", effect: "1d8 psychic damage" },
      { roll: "6", effect: "4d6 force damage" }
    ]
  },
  damageConfig: { formula: "4d8+2d8", damageTypes: ["fire", "necrotic"], resolution: "PROPHECY" }
}
```

### PROPHECY with Escalating/Delayed Effects (Endbringer)

```javascript
{
  effectTypes: ["damage"],   // ✅ NOT ["damage", "debuff"] — debuffs are in prophecy outcomes
  resolution: "PROPHECY",
  durationConfig: { durationValue: 5, durationUnit: "rounds", concentrationRequired: true },
  mechanicsConfig: [{
    enabled: true,
    system: "PROPHECY",
    prophecy: {
      rangeDice: ["d8", "d6"],
      resolutionDie: "d6",
      tickDamage: { formula: "1d8", scaling: "+1d6 per round", damageTypes: ["force"] },
      prophesied: {
        damage: "4d10",
        effect: {
          name: "Devastating Detonation",
          duration: 2,
          unit: "rounds",
          damagePerRound: "2d6",
          damageType: "force",
          statModifiers: [{ stat: "ALL ROLLS", value: -2 }],
          description: "2d6 force/round and -2 all rolls for 2 rounds"
        },
        havocGain: 5
      },
      base: { damage: "2d10", havocGain: 2 },
      outside: { backlash: "1d10 self", havocGain: 0 }
    }
  }],
  tableConfig: { name: "Detonation Table", rolls: [...] },
  triggerConfig: {
    triggers: [
      { id: "aura_havoc", name: "Havoc Siphon", triggerType: "end_of_turn", action: "Gain 1 Havoc per enemy within aura" }
    ]
  },
  damageConfig: { formula: "1d8", damageTypes: ["force"], resolution: "PROPHECY" }
}
```

### Common PROPHECY Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Top-level `prophecyConfig` instead of `mechanicsConfig` | Prophecy block doesn't render | Use `mechanicsConfig: [{ system: "PROPHECY", prophecy: {...} }]` |
| `effectTypes: ['damage', 'debuff']` but no `debuffConfig` | Empty block between description and prophecy table | Only include types with matching `*Config` objects |
| Missing `damageConfig.resolution: "PROPHECY"` | Damage section may render redundantly | Set `resolution: "PROPHECY"` on damageConfig |
| Missing `damageConfig.damageTypes` | No damage type badge in header | Always include `damageTypes: ['necrotic']` etc. |

---

# Part 6: Trigger & Conditional System

## 6.1 Global Triggers (for PASSIVE/REACTION spells)

```javascript
triggerConfig: {
  global: {
    logicType: "AND",          // How multiple triggers combine
    compoundTriggers: [
      {
        type: "damage_taken",
        conditions: {
          operator: "greater_than",
          value: 10,
          damageType: "physical"
        }
      },
      {
        type: "health_threshold",
        conditions: {
          operator: "less_than",
          value: 0.5            // 50% HP
        }
      }
    ]
  },
  triggerRole: {
    mode: "auto",               // 'auto'|'manual'|'toggle'
    activationDelay: "immediate",
    requiresLOS: false
  }
}
```

### Logic Types
| Type | Behavior |
|------|----------|
| `AND` | All conditions must be true |
| `OR` | Any condition must be true |
| `NOT` | Condition must be false |
| `XOR` | Exactly one condition must be true |

## 6.2 Trigger Examples

### When Attacked (Reaction Shield)
```javascript
triggerConfig: {
  global: {
    logicType: "AND",
    compoundTriggers: [
      { type: "damage_taken", conditions: { operator: "greater_than", value: 0 } }
    ]
  },
  triggerRole: { mode: "manual", activationDelay: "reaction", requiresLOS: false }
}
```

### When HP Below 50% (Passive Enrage)
```javascript
triggerConfig: {
  global: {
    logicType: "AND",
    compoundTriggers: [
      { type: "health_threshold", conditions: { operator: "less_than", value: 0.5 } }
    ]
  },
  triggerRole: { mode: "auto", activationDelay: "immediate" }
}
```

### On Critical Hit (Burst Effect)
```javascript
triggerConfig: {
  global: {
    logicType: "AND",
    compoundTriggers: [
      { type: "critical_hit", conditions: {} }
    ]
  },
  triggerRole: { mode: "auto", activationDelay: "immediate" }
}
```

### On Kill (Resource Generator)
```javascript
triggerConfig: {
  global: {
    logicType: "AND",
    compoundTriggers: [
      { type: "turn_start", conditions: {} }
    ]
  },
  triggerRole: { mode: "auto", activationDelay: "start_of_turn" }
}
```

## 6.3 Conditional Effects

Effects that change based on circumstances:

```javascript
triggerConfig: {
  global: { logicType: "AND", compoundTriggers: [{ type: "damage_dealt", conditions: {} }] },
  conditionalEffects: [
    {
      condition: { operator: "greater_than", value: 20, stat: "damage" },
      effect: { description: "+2d6 bonus damage on heavy hits", damage: "2d6" }
    }
  ]
}
```

---

# Part 7: Advanced Mechanics Systems

## 7.1 Rollable Tables

Used for unpredictable spell outcomes (Chaos Weaver, Gambler).

```javascript
mechanicsConfig: {
  rollableTable: {
    enabled: true,
    tableName: "Wild Magic Surge",
    description: "Roll 1d20 for a chaotic effect",
    diceFormula: "1d20",
    resolutionType: "DICE",
    entries: [
      { min: 1, max: 2, effect: "Fireball centered on self", weight: 2 },
      { min: 3, max: 5, effect: "Allies heal 2d8 HP", weight: 3 },
      { min: 6, max: 10, effect: "+2d6 bonus damage", weight: 5 },
      { min: 11, max: 15, effect: "Target pushed 15 feet", weight: 5 },
      { min: 16, max: 18, effect: "Caster teleports 30 feet", weight: 3 },
      { min: 19, max: 20, effect: "Cast again with no cost", weight: 2 }
    ]
  }
}
```

## 7.2 Chance on Hit / Proc System

```javascript
mechanicsConfig: {
  procConfig: {
    enabled: true,
    procChance: 25,
    triggerCondition: "on_hit",
    effects: [
      {
        name: "Burning",
        description: "1d6 fire damage over 3 rounds",
        damage: "1d6",
        damageType: "fire",
        duration: 3,
        durationType: "rounds"
      }
    ],
    displayText: "25% chance on hit to apply Burning (1d6 fire, 3 rounds)",
    internalCooldown: 0
  }
}
```

### Trigger Conditions
| Condition | When |
|-----------|------|
| `on_hit` | Any successful hit |
| `on_crit` | Critical hit only |
| `on_kill` | Killing blow |
| `on_damage_taken` | Taking damage |

## 7.3 Combo Point System

```javascript
mechanicsConfig: {
  comboPoints: {
    enabled: true,
    maxPoints: 5,
    generateOnHit: true,
    generateOnCrit: 2,
    spendOnAbility: 3,
    finishingMove: {
      name: "Eviscerate",
      damagePerPoint: "1d4",
      description: "Deal 1d4 damage per combo point"
    }
  }
}
```

## 7.4 Stance/Form Requirements

```javascript
mechanicsConfig: {
  formRequirements: {
    requiredForm: "Dancing Blade",
    requiredResource: 0,
    formBonus: "+1d6 damage while in Dancing Blade stance"
  }
}
```

## 7.5 Toxic/Poison Stacking System

```javascript
mechanicsConfig: {
  toxicConfig: {
    enabled: true,
    maxStacks: 5,
    damagePerStack: "1d4",
    damageType: "poison",
    durationPerStack: 2,
    applicationChance: 100,
    spreadingEnabled: false
  }
}
```

---


# Part 8: Channeling System

Used when `spellType === 'CHANNELED'`.

```javascript
{
  name: "Blizzard",
  spellType: "CHANNELED",
  effectTypes: ["damage"],
  channelingConfig: {
    maxDuration: 6,
    tickFrequency: 1,
    tickScaling: "linear",
    breakEffect: "none",
    concentrationDC: null,
    perRoundFormulas: {
      damage: "2d6",
      damageType: "frost",
      healing: null,
      manaCost: 2,
      dotDamage: null
    },
    movementRestriction: "immobile",
    completionEffect: {
      description: "Enemies in area are frozen for 1 round",
      effect: { controlType: "immobilized", duration: 1 }
    },
    interruptionEffect: null
  },
  damageConfig: {
    formula: "2d6",
    damageTypes: ["frost"],
    resolution: "DICE"
  },
  resourceCost: { actionPoints: 2, mana: 4 },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 20 }
}
```

### Channeling Fields
| Field | Type | Description |
|-------|------|-------------|
| `maxDuration` | number | Max rounds of channeling |
| `tickFrequency` | number | Effects apply every N rounds |
| `tickScaling` | string | `'linear'` / `'increasing'` / `'decreasing'` |
| `breakEffect` | string | `'none'` / `'partial'` / `'backlash'` / `'explosion'` |
| `perRoundFormulas.damage` | string | Damage formula per tick |
| `perRoundFormulas.damageType` | string | Damage type per tick |
| `perRoundFormulas.healing` | string | Healing formula per tick |
| `perRoundFormulas.manaCost` | number | Mana cost per tick |
| `movementRestriction` | string | `'none'` / `'slow'` / `'immobile'` |
| `completionEffect` | object | Bonus effect on full channel |
| `interruptionEffect` | object | Penalty effect on interrupt |

---

# Part 9: 28-Class Reference

## Resource Architecture Patterns

| Pattern | Classes | Key Feature |
|---------|---------|-------------|
| Multi-Currency Inventory | Arcanoneer, Minstrel | Manage multiple resource types simultaneously |
| Escalating Gauge | Berserker, Pyrofiend, False Prophet | Bar fills with risk at high levels |
| Dual Resource | Bladedancer, Chronarch, Toxicologist, Witch Doctor | Two interconnected resources |
| Token Pool | Fate Weaver, Oracle, Warden, Huntress | Accumulate and spend tokens |
| Charge-Based | Covenbane | Finite charges from specific triggers |
| Health-as-Resource | Deathcaller | Sacrifice HP to cast |
| Damage-to-Power | Dreadnaught, Spellguard | Convert incoming damage |
| Depleting Dice Chain | Exorcist | Dice degrade through use |
| Toggle + Stored | Lichborne | Active toggle + safety net pool |
| Cyclical State | Lunarch | Auto-cycling through phases |
| Escalating Tiers | Martyr | Cumulative thresholds unlock tiers |
| Zone-Based | Inscriptor, Primalist | Place physical objects on battlefield |
| Stacking Debuff Evolution | Plaguebringer | Apply and evolve debuffs |

## 9.1 Arcanoneer

**Resource**: Elemental Spheres (8 types: arcane, holy, shadow, fire, ice, nature, healing, chaos)
**Damage**: All elements (depends on sphere combo)
**Specializations**: Prism Mage, Sphere Architect, Entropy Weaver
**Unique Mechanics**: Roll 4d8 at start of each turn (1-8 maps to elements). Combine 2-4 spheres via 8x8 combination matrix. Spheres bank between turns. All spheres lost at combat end.

```javascript
// Arcanoneer spell example
{
  name: "Infernal Convergence",
  spellType: "ACTION",
  effectTypes: ["damage"],
  description: "Combine Fire + Fire + Shadow spheres for devastating damage",
  typeConfig: { school: "fire" },
  damageConfig: {
    formula: "4d8",
    damageTypes: ["fire", "necrotic"],
    resolution: "DICE"
  },
  resourceCost: {
    actionPoints: 2,
    mana: 10,
    classResource: { type: "elemental_spheres", cost: "2 fire + 1 shadow" }
  },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 15 }
}
```

## 9.2 Berserker

**Resource**: Rage (0-100)
**Damage**: Physical (melee)
**Specializations**: Savage, Juggernaut, Warlord
**Unique Mechanics**: +1d6 rage per attack, +2d6 on crit. 8 Rage States: Smoldering (0-20), Frenzied (21-40), Primal (41-60), Carnage (61-80), Cataclysm (81-100), Obliteration (101-124), Annihilation (125-149), Apocalypse (150+). Overheat at 101+ = 2d6 self-damage + reset. -5/round if no rage-generating actions.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "rage", cost: 0 }  // Generates rage, doesn't cost
}
```

## 9.3 Bladedancer

**Resource**: Momentum (0-20) + Flourish (persistent tokens)
**Damage**: Physical (melee)
**Specializations**: Flow Master, Duelist, Shadow Dancer
**Unique Mechanics**: 6 stances (Flowing Water, Striking Serpent, Whirling Wind, Rooted Stone, Dancing Blade, Shadow Step). +1 momentum per hit, +2 per crit. Transitions cost 2-4 momentum.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "momentum", cost: 3 }
},
mechanicsConfig: {
  formRequirements: {
    requiredForm: "Dancing Blade",
    formBonus: "+1d6 damage while in Dancing Blade stance"
  }
}
```

## 9.4 Chaos Weaver

**Resource**: Mayhem (generate/spend dual)
**Damage**: Force, Chaos
**Specializations**: Reality Bending, Entropy Control, Chaos Dice
**Unique Mechanics**: Rollable tables with multiple outcomes. Mayhem can be generated OR spent per spell. Multi-level spell pools by character level.

```javascript
mechanicsConfig: {
  rollableTable: {
    enabled: true,
    tableName: "Prismatic Chaos",
    diceFormula: "1d33",
    entries: [
      { min: 1, max: 3, effect: "Fireball (3d6 fire)", weight: 3 },
      { min: 4, max: 6, effect: "Heal self 2d8", weight: 3 },
      { min: 7, max: 9, effect: "Teleport 30ft randomly", weight: 3 },
      { min: 10, max: 33, effect: "Various effects", weight: 24 }
    ]
  }
},
resourceCost: {
  actionPoints: 2,
  classResource: { type: "mayhem", cost: -3 }  // Negative = generates
}
```

## 9.5 Chronarch

**Resource**: Time Shards (0-10) + Temporal Strain (0-10)
**Damage**: Force
**Specializations**: Arc of Stasis, Arc of Displacement, Arc of Rewinding
**Unique Mechanics**: Strain decays -1/turn if no Flux abilities. At 10 Strain: lose next turn + 4d6 force damage + reset. Flux abilities freeze, rewind, teleport, resurrect.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 12,
  classResource: { type: "time_shards", cost: 3 }
},
// Store temporal strain separately
specialMechanics: {
  temporalStrain: 2  // This ability adds 2 strain
}
```

## 9.6 Covenbane

**Resource**: Hexbreaker Charges (0-6)
**Damage**: Radiant, Necrotic
**Specializations**: Shadowbane, Spellbreaker, Demonhunter
**Unique Mechanics**: +1 charge per weapon hit on evil magic user, +2 per kill. Anti-Magic Field (4 charges) = 15ft magic-null zone. Execute Hex (3 charges) = instant death on low HP.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "hexbreaker_charges", cost: 4 }
}
```

## 9.7 Deathcaller

**Resource**: HP + Blood Tokens (0-20) + Necrotic Ascension Paths (7)
**Damage**: Necrotic
**Specializations**: Blood Mage, Spectral Lord, Void Walker
**Unique Mechanics**: Spells cost mana AND HP (1d6, 2d8). Blood Tokens enhance necrotic damage +1d6 per token. 7 Ascension Paths grant boons but inflict permanent curses.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 10,
  health: "1d6",  // HP cost to cast
  classResource: { type: "blood_tokens", cost: 3 }
}
```

## 9.8 Dreadnaught

**Resource**: Dark Resilience Points / DRP (0-50)
**Damage**: Necrotic, Physical
**Specializations**: Shadow Fortress, Wraith Knight, Unholy Titan
**Unique Mechanics**: +1 DRP per 5 damage taken. At 10+ DRP: +1 HP/10 DRP per turn. Shadow Shield (2:1 absorption). Wraith Strike (+1d6 necrotic per 5 DRP). Dark Rebirth: auto-trigger at 0 HP.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "dark_resilience_points", cost: 15 }
}
```

## 9.9 Exorcist

**Resource**: Dominance Die per demon (d12→d10→d8→d6→0)
**Damage**: Force, Demon-dependent
**Specializations**: Demonologist, Demon Lord, Possessed
**Unique Mechanics**: Each demon action degrades DD 1 step. Special abilities degrade 2 steps. At DD=0: demon save or escape (33% flee, 33% attack, 33% turn hostile). Pre-combat binding rituals required.

```javascript
resourceCost: {
  actionPoints: 1,
  mana: 5,
  classResource: { type: "dominance_die", cost: 1 }  // 1 step degradation
}
```

## 9.10 False Prophet

**Resource**: Madness Points (0-20)
**Damage**: Shadow, Psychic
**Specializations**: Voidcaller, Deceiver, Cultist
**Unique Mechanics**: +1 shadow damage per Madness Point. Temptation abilities unlock at thresholds (6, 9, 12). At 20: Insanity Convulsion (roll 1d6 on chaotic self-effect table). Madness-spending spells consume rolled amounts.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "madness_points", cost: -4 }  // Generates madness
}
// Or spending:
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "madness_points", cost: 6 }   // Spends madness
}
```

## 9.11 Fate Weaver

**Resource**: Threads of Destiny (0-13)
**Damage**: Variable (card-determined)
**Specializations**: Card Master, Destiny Shaper, Fate's Hand
**Unique Mechanics**: Spend 2 Threads to call specific card. Poker hand mechanics (5-card draw). Blackjack mechanics. Failures generate Threads.

```javascript
damageConfig: {
  formula: "CARD_VALUE * 2",
  damageTypes: ["force"],
  resolution: "CARDS",
  cardConfig: { drawCount: 5, successCondition: "pair", damagePerCard: 4 }
},
resourceCost: {
  actionPoints: 2,
  mana: 10,
  classResource: { type: "threads_of_destiny", cost: 3 }
}
```

## 9.12 Formbender

**Resource**: Wild Instinct / WI (0-15)
**Damage**: Physical (claw/bite/talon)
**Specializations**: Metamorph, Form Thief, Primordial
**Unique Mechanics**: 4 Wild Forms: Nightstalker (stealth/burst), Ironhide (tank/+20 HP), Skyhunter (aerial/dive), Frostfang (pack tactics). First transform FREE, subsequent = 1 WI.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "wild_instinct", cost: 3 }
},
mechanicsConfig: {
  formRequirements: {
    requiredForm: "Nightstalker",
    formBonus: "+2d6 ambush damage while in Nightstalker form"
  }
}
```

## 9.13 Gambler

**Resource**: Fortune Points (0-20)
**Damage**: Variable (force, magical)
**Specializations**: Fortune's Favor, High Roller, Card Sharp
**Unique Mechanics**: Spend Fortune to adjust roll results by +/-1 per point. Rollable tables: Jackpot (3d20), Fate's Coin (6 coins), Death Roll (5d20 competitive).

```javascript
mechanicsConfig: {
  rollableTable: {
    enabled: true,
    tableName: "Jackpot",
    diceFormula: "3d20",
    entries: [
      { min: 3, max: 10, effect: "Lose 2 Fortune Points", weight: 8 },
      { min: 11, max: 40, effect: "Deal 3d6 force damage", weight: 30 },
      { min: 41, max: 55, effect: "Deal 6d6 force damage", weight: 15 },
      { min: 56, max: 60, effect: "JACKPOT: 10d6 force damage", weight: 5 }
    ]
  }
},
resourceCost: {
  actionPoints: 2,
  classResource: { type: "fortune_points", cost: 5 }
}
```

## 9.14 Huntress

**Resource**: Quarry Marks (0-10)
**Damage**: Shadow, Physical (melee)
**Specializations**: Shadow Blade, Beast Master, Wind Runner
**Unique Mechanics**: Shadow Glaive chains to enemies within 5ft. Companion acts independently. 1 QM = enhance companion, 3 QM = companion special, 5 QM = ultimate.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "quarry_marks", cost: 2 }
}
```

## 9.15 Inscriptor

**Resource**: Runes (0-8 base, varies by spec) + Runic Resonance (0-10) + Inscriptions (0-3 base, varies by spec)
**Damage**: Force, Arcane
**Specializations**: Runebinder (10 runes/3 inscriptions), Enchanter (6 runes/5 inscriptions), Glyphweaver (8 runes/4 inscriptions)
**Unique Mechanics**: Min 3 runes to form a zone. Each rune placed generates +1 Runic Resonance (max 10). Spend Resonance at thresholds: 3=free inscription, 5=+2d6 spell damage in zone, 7=zone-wide detonation. At 10 Resonance (passive): all runes refresh, Resonance resets to 0. Rune cost: 3-4 mana per rune depending on type.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "runic_wrapping", cost: 1 }  // 1 rune placed
}
```

## 9.16 Lichborne

**Resource**: Eternal Frost Aura (toggle) + Phylactery HP
**Damage**: Frost
**Specializations**: Frost Revenant, Phylactery Guardian, Ice Wraith
**Unique Mechanics**: Aura: +1d6 frost to all spells, drain 1d6 HP/turn. Enemies save DC 15 Con or -10ft speed. Phylactery auto-triggers at 0 HP.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "frost_aura", cost: 1 }  // Toggle cost
},
// Phylactery managed separately
specialMechanics: {
  phylacteryHP: 30
}
```

## 9.17 Lunarch

**Resource**: Phase Shift (4 lunar phases, 3-round cycles)
**Damage**: Radiant
**Specializations**: Moonlight Sentinel, Starfall Invoker, Moonwell Guardian
**Unique Mechanics**: Auto-cycles: New Moon→Waxing→Full→Waning→repeat (3 rounds each). Manual shift costs 8 mana. Full Moon: +2d6 radiant, crit 19-20. Waxing: enhanced healing.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "phase_shift", cost: 0 }  // Phase-based, not spent
},
specialMechanics: {
  phaseRequirement: "full_moon",  // Only available during Full Moon
  phaseBonus: "+2d6 radiant damage during Full Moon"
}
```

## 9.18 Martyr

**Resource**: Devotion Gauge (Levels 1-6, cumulative damage thresholds)
**Damage**: Radiant
**Specializations**: Redemption, Zealot, Ascetic
**Unique Mechanics**: Thresholds: 10/20/40/60/80/100 damage = Levels 1-6. L1: +1 AC allies, L3: +2 AC + 1d6 HP/turn aura. Amplified spells cost Devotion Levels.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 10,
  classResource: { type: "devotion_gauge", cost: 3 }  // Spend 3 levels
},
devotionLevel: 4  // Current devotion level (set by damage taken)
```

## 9.19 Minstrel

**Resource**: Musical Notes (I-VII, max 5 each)
**Damage**: Thunder, Sonic
**Specializations**: Battlechoir, Soulsinger, Dissonance
**Unique Mechanics**: Builder spells generate notes. Cadences consume specific combos: Perfect Cadence (I-IV-V-I) = guaranteed crit, Deceptive Cadence (IV-VII-V-IV) = stun, Circle of Fifths (V-I-VI-V) = DoT.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 6,
  classResource: { type: "musical_notes", cost: "I+IV+V+I" }  // Perfect Cadence
},
musicalNotes: { I: 2, II: 1, III: 0, IV: 3, V: 2, VI: 0, VII: 0 }
```

## 9.20 Oracle

**Resource**: Prophetic Visions (0-10)
**Damage**: Psychic, Force
**Specializations**: Seer, Truthseeker, Fateseer
**Unique Mechanics**: Declare predictions (Simple +1 / Moderate +2 / Grand +3 Visions if correct). Fate's Whisper: +1 Vision per turn (only at ≤5 Visions). Witnessing Fate: +1 Vision on any Natural 20 or 1 within 30 ft. Forecast Dice: Roll 5 chosen dice at day start, spend to replace any roll. Fate's Burden: -1 to all d20 rolls per unused forecast die next day.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 10,
  classResource: { type: "prophetic_visions", cost: 5 }
}
```

## 9.21 Plaguebringer

**Resource**: Affliction Cultivation (multi-stage evolution)
**Damage**: Necrotic, Poison
**Specializations**: Pestilence, Blight Lord, Contagion
**Unique Mechanics**: Base afflictions → Category spells evolve them. Weaken→Torment→Fester→Amplify→Decay paths. Final forms can spread (contagion).

```javascript
// Base affliction
{
  name: "Curse of Agony",
  effectTypes: ["debuff"],
  debuffConfig: {
    debuffType: "damageOverTime",
    effects: [{ id: "curse", name: "Curse of Agony", description: "1d6 necrotic per round", mechanicsText: "" }],
    dotConfig: { enabled: true, damagePerTick: "1d6", damageType: "necrotic", duration: 3 }
  },
  specialMechanics: { afflictionStage: "base", evolutionPaths: ["weaken", "torment", "decay"] }
}
```

## 9.22 Primalist

**Resource**: Totemic Synergy (0-8 totems)
**Damage**: Nature
**Specializations**: Earthwarden, Stormbringer, Spiritcaller
**Unique Mechanics**: 8 totem types. At 4+ totems: Synergy Threshold triggers combos. Synergy costs 6 to activate. Totems provide passive effects in 10ft radius.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 8,
  classResource: { type: "totemic_synergy", cost: 2 }
}
```

## 9.23 Pyrofiend

**Resource**: Inferno Veil Level (0-9)
**Damage**: Fire
**Specializations**: Inferno, Wildfire, Hellfire
**Unique Mechanics**: +1 fire damage per Inferno Level (max +10). Sin-themed drawbacks at levels 2 (Greed), 5 (Wrath), 7 (Gluttony), 9 (Pride). Physical transformation at high levels.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 10,
  classResource: { type: "inferno", cost: 2 }  // Ascends 2 levels
},
infernoVeil: { level: 3, ascentRate: 2 }  // Current level 3, this spell ascends by 2
```

## 9.24 Spellguard

**Resource**: Arcane Energy Points / AEP (0-100)
**Damage**: Arcane, Force
**Specializations**: Arcane Warden, Spell Breaker, Mana Reaver
**Unique Mechanics**: Absorb magical damage at 0.5x rate. Spell Interception (10 AEP). Arcane Shield (15 AEP): 30 magical damage shield. Mana Drain: 1d4 mana per melee hit.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "arcane_energy_points", cost: 15 }
}
```

## 9.25 Titan

**Resource**: Celestial Devotion (daily choice of 5 deities)
**Damage**: Radiant, Physical
**Specializations**: Celestial Champion, Divine Conduit, Astral Warrior
**Unique Mechanics**: 5 Devotions: Solara (radiant), Lunara (moon/defensive), Astraeus (stars/mobile), Terranox (earth/immovable), Zephyra (wind/fast). Chosen once per day.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "celestial_devotion", cost: 1 }
},
specialMechanics: {
  activeDevotion: "Solara",
  devotionAbilities: ["Solar Flare", "Radiant Aura"]
}
```

## 9.26 Toxicologist

**Resource**: Toxin Vials (INT mod + 3) + Contraption Parts (0-5)
**Damage**: Poison, Acid, Fire
**Specializations**: Venomancer, Gadgeteer, Saboteur
**Unique Mechanics**: 8 poison types. 6 contraptions. Mid-combat crafting. Short rest recovery.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "toxin_vials", cost: 2 }
}
```

## 9.27 Warden

**Resource**: Vengeance Points / VP (0-10)
**Damage**: Physical, Shadow
**Specializations**: Justice Bringer, Shadow Hunter, Avatar of Vengeance
**Unique Mechanics**: VP tiers: 1=+1d6, 2=multi-glaive, 3=heal+resist, 5=cage trap, 10=Avatar transformation (4 rounds). Mark of the Hunt: +1 VP/attack.

```javascript
resourceCost: {
  actionPoints: 2,
  classResource: { type: "vengeance_points", cost: 5 }
}
```

## 9.28 Witch Doctor

**Resource**: Voodoo Essence (0-15) + precursors
**Damage**: Necrotic, Nature, Poison
**Specializations**: Bokor, Mambo, Houngan
**Unique Mechanics**: Loa invocations require Essence + precursors. 5 Loa: Baron Samedi (death), Erzulie (love/healing), Papa Legba (portals), Ogoun (war), Simbi (water). Curses/totems/poisons generate Essence.

```javascript
resourceCost: {
  actionPoints: 2,
  mana: 10,
  classResource: { type: "voodoo_essence", cost: 8 }
},
specialMechanics: {
  loaInvocation: "Baron Samedi",
  requiredPrecursors: ["3_cursed_enemies"]
}
```

---

## 9.29 Doomsayer

**Resource**: Havoc (0-15)
**Damage**: Fire, Necrotic, Psychic, Force
**Specializations**: Requiem, Endbringer, Cataclysm
**Unique Mechanics**: **Prophecy Range**: Spells use `mechanicsConfig` with `system: "PROPHECY"` for dynamic resolution ranges (Prophesied, Base, Outside). **Range Toggles**: Can shift resolution boundaries via Havoc spend. **Havoc Overflow**: Excess generation creates explosive backlashes. **IMPORTANT**: Debuff effects described inside prophecy outcomes do NOT get `'debuff'` in `effectTypes` — only include types that have a matching `*Config` object.

```javascript
// Doomsayer Prophecy Spell — CORRECT pattern
{
  name: "Doom Bolt",
  spellType: "ACTION",
  effectTypes: ["damage"],          // ✅ debuffs live inside prophecy outcomes, not standalone
  resolution: "PROPHECY",
  typeConfig: { school: "necrotic", castTime: "1 action", castTimeType: "action" },
  targetingConfig: { targetingType: "single", rangeDistance: 60, targetRestrictions: ["enemies"] },
  resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "havoc", cost: -3 } },
  damageConfig: {
    formula: "2d8",
    damageTypes: ["necrotic"],
    resolution: "PROPHECY"          // ✅ Tells damage section this is prophecy-based
  },
  mechanicsConfig: [{              // ✅ Prophecy goes in mechanicsConfig, NOT top-level
    enabled: true,
    system: "PROPHECY",
    prophecy: {
      rangeDice: ["d8", "d6"],
      resolutionDie: "d6",
      prophesied: { damage: "4d8", effect: { name: "Weakened", duration: 2, unit: "rounds", statModifiers: [{ stat: "ALL ROLLS", value: -2 }] }, havocGain: 3 },
      base: { damage: "2d8", havocGain: 1 },
      outside: { backlash: "1d8 necrotic to self", havocGain: 0 }
    }
  }],
  tags: ["damage", "necrotic", "prophecy"]
}
```

## 9.30 Augur

**Resource**: Benediction (Even rolls) & Malediction (Odd rolls)
**Damage**: Radiant, Psychic, Force
**Specializations**: Auspex, Harbinger, Hierophant
**Unique Mechanics**: **Omen Reading**: Every d20 roll within 60ft generates resources (Even = +1 Ben, Odd = +1 Mal). **Omen Debt**: Unused resources at day's end incur a -1 penalty to all rolls per point (cap -10). **Terrain Alteration**: Focuses on persistent zone effects and conditional debuffs.

```javascript
// Augur Omen Spell Example
{
  name: "Portent of Weakness",
  effectTypes: ["debuff"],
  targetingConfig: { targetingType: "single", rangeDistance: 40 },
  resourceCost: {
    actionPoints: 2,
    mana: 8,
    classResource: { type: "malediction", cost: 3 }
  },
  debuffConfig: {
    debuffType: "statusEffect",
    effects: [{ id: "weakened", name: "Weakened", description: "Disadvantage on attacks, -2 Armor" }],
    durationValue: 3,
    durationUnit: "rounds",
    concentrationRequired: true
  }
}
```

---

# Part 10: Complete Spell Examples

## 10.1 Minimal Damage Spell
```javascript
{
  id: "sp_fire_bolt",
  name: "Fire Bolt",
  description: "A bolt of flame streaks toward a target.",
  level: 1,
  school: "fire",
  icon: "spell_fire_firebolt",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "fire", range: "120 feet", rangeType: "ranged", castTime: "1 action", castTimeType: "action" },
  damageConfig: {
    formula: "2d6 + intelligence",
    damageTypes: ["fire"],
    resolution: "DICE"
  },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 120, targetRestrictions: "enemies" },
  durationConfig: { durationType: "instant", durationValue: 0, durationUnit: "instant" },
  resourceCost: { actionPoints: 2, mana: 5 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  tags: ["damage", "fire", "ranged", "single_target"]
}
```

## 10.2 Minimal Buff Spell
```javascript
{
  id: "sp_shield_of_faith",
  name: "Shield of Faith",
  description: "A shimmering field appears around the target.",
  level: 1,
  school: "radiant",
  icon: "spell_holy_devotionaura",
  spellType: "ACTION",
  effectTypes: ["buff"],
  typeConfig: { school: "radiant", range: "60 feet", rangeType: "ranged", castTime: "1 bonus action", castTimeType: "bonus" },
  buffConfig: {
    buffType: "statEnhancement",
    effects: [
      { id: "ac_boost", name: "Shield of Faith", description: "+2 Armor for 10 minutes", mechanicsText: "", statModifier: { stat: "armor", magnitude: 2, magnitudeType: "flat" } }
    ],
    durationType: "minutes", durationValue: 10, durationUnit: "minutes",
    stackingRule: "replace", maxStacks: 1, concentrationRequired: true
  },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: "allies" },
  resourceCost: { actionPoints: 1, mana: 8 },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  tags: ["buff", "defense", "concentration"]
}
```

## 10.3 Minimal Debuff Spell
```javascript
{
  id: "sp_ray_of_frost",
  name: "Ray of Frost",
  description: "A frigid beam of blue-white light streaks toward a creature.",
  level: 1,
  school: "frost",
  icon: "spell_frost_frostbolt",
  spellType: "ACTION",
  effectTypes: ["damage", "debuff"],
  typeConfig: { school: "frost", range: "60 feet", rangeType: "ranged", castTime: "1 action", castTimeType: "action" },
  damageConfig: {
    formula: "2d8",
    damageTypes: ["frost"],
    resolution: "DICE",
    savingThrow: { ability: "constitution", difficultyClass: 13, saveOutcome: "half_damage" }
  },
  debuffConfig: {
    debuffType: "movementImpairment",
    effects: [
      { id: "frost_slow", name: "Chilled", description: "Speed reduced by 10 feet for 1 round", mechanicsText: "" }
    ],
    durationType: "rounds", durationValue: 1, durationUnit: "rounds",
    canBeDispelled: true
  },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: "enemies" },
  resourceCost: { actionPoints: 2, mana: 5 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
  tags: ["damage", "debuff", "frost", "slow"]
}
```

## 10.4 Passive Spell (Aura)
```javascript
{
  id: "sp_burning_aura",
  name: "Burning Aura",
  description: "Enemies who start their turn near you take fire damage.",
  level: 3,
  school: "fire",
  icon: "spell_fire_incinerate",
  spellType: "PASSIVE",
  effectTypes: ["damage"],
  typeConfig: { school: "fire", range: "10 feet", rangeType: "self" },
  damageConfig: {
    formula: "1d6",
    damageTypes: ["fire"],
    resolution: "DICE"
  },
  triggerConfig: {
    global: {
      logicType: "AND",
      compoundTriggers: [
        { type: "turn_start", conditions: {} }
      ]
    },
    triggerRole: { mode: "auto", activationDelay: "start_of_turn", requiresLOS: false }
  },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 10, targetRestrictions: "enemies" },
  resourceCost: { actionPoints: 0, mana: 0 },
  cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
  tags: ["passive", "aura", "fire", "damage"]
}
```

## 10.5 Reaction Spell
```javascript
{
  id: "sp_absorb_elements",
  name: "Absorb Elements",
  description: "Absorb incoming elemental damage and convert it to a weapon bonus.",
  level: 2,
  school: "arcane",
  icon: "spell_arcane_arcaneresilience",
  spellType: "REACTION",
  effectTypes: ["buff", "debuff"],
  typeConfig: { school: "arcane", castTime: "1 reaction", castTimeType: "reaction" },
  buffConfig: {
    buffType: "damageIncrease",
    effects: [
      { id: "elemental_bonus", name: "Elemental Absorption", description: "+1d6 weapon damage of absorbed type for 1 round", mechanicsText: "" }
    ],
    durationType: "rounds", durationValue: 1, durationUnit: "rounds"
  },
  triggerConfig: {
    global: {
      logicType: "AND",
      compoundTriggers: [
        { type: "damage_taken", conditions: { operator: "greater_than", value: 0, damageType: "elemental" } }
      ]
    },
    triggerRole: { mode: "manual", activationDelay: "reaction", requiresLOS: false }
  },
  targetingConfig: { targetingType: "self" },
  resourceCost: { actionPoints: 0, mana: 5 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
  tags: ["reaction", "buff", "elemental"]
}
```

## 10.6 Channeled Spell
```javascript
{
  id: "sp_blizzard",
  name: "Blizzard",
  description: "Ice and wind sweep around you in a 20ft radius.",
  level: 5,
  school: "frost",
  icon: "spell_frost_icestorm",
  spellType: "CHANNELED",
  effectTypes: ["damage", "control"],
  typeConfig: { school: "frost", range: "self", rangeType: "self", castTime: "1 action", castTimeType: "action" },
  damageConfig: {
    formula: "2d6",
    damageTypes: ["frost"],
    resolution: "DICE"
  },
  controlConfig: {
    controlType: "immobilized",
    strength: "partial",
    duration: 1,
    durationType: "rounds",
    durationUnit: "rounds",
    savingThrow: { ability: "constitution", difficultyClass: 16, saveOutcome: "negates" },
    effects: [{ id: "freeze", name: "Frozen Ground", description: "Immobilized for 1 round · DC 16 Con save", mechanicsText: "" }]
  },
  channelingConfig: {
    maxDuration: 6,
    tickFrequency: 1,
    tickScaling: "linear",
    breakEffect: "none",
    perRoundFormulas: { damage: "2d6", damageType: "frost", manaCost: 3 },
    movementRestriction: "immobile",
    completionEffect: { description: "Enemies in area frozen for 1 round" }
  },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 20, targetRestrictions: "enemies" },
  resourceCost: { actionPoints: 2, mana: 6 },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  tags: ["channeled", "damage", "control", "frost", "aoe"]
}
```

## 10.7 Trap Spell
```javascript
{
  id: "sp_fire_trap",
  name: "Fire Trap",
  description: "Place an explosive trap that detonates when enemies approach.",
  level: 2,
  school: "fire",
  icon: "spell_fire_selfdestruct",
  spellType: "TRAP",
  effectTypes: ["damage"],
  typeConfig: { school: "fire" },
  damageConfig: {
    formula: "4d6",
    damageTypes: ["fire"],
    resolution: "DICE",
    savingThrow: { ability: "agility", difficultyClass: 14, saveOutcome: "half_damage" }
  },
  trapConfig: {
    trapType: "explosive",
    triggerRadius: 10,
    triggerCondition: "proximity",
    armTime: 1,
    duration: "until_triggered",
    charges: 1,
    disarmDC: 15,
    detectDC: 13,
    canBeDetected: true,
    visibleToAllies: true
  },
  targetingConfig: { targetingType: "self" },
  resourceCost: { actionPoints: 2, mana: 8 },
  cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
  tags: ["trap", "damage", "fire", "explosive"]
}
```

## 10.8 Card Resolution Spell (Fate Weaver)
```javascript
{
  id: "sp_hand_of_fate",
  name: "Hand of Fate",
  description: "Draw cards from the Deck of Destiny to determine your fate.",
  level: 3,
  school: "arcane",
  icon: "spell_arcane_arcanemissiles",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "arcane", range: "60 feet", rangeType: "ranged" },
  damageConfig: {
    formula: "CARD_VALUE * 2",
    damageTypes: ["force"],
    resolution: "CARDS",
    cardConfig: { drawCount: 5, successCondition: "pair", damagePerCard: 4, suitBonus: { spades: 2 } }
  },
  resourceCost: { actionPoints: 2, mana: 12, classResource: { type: "threads_of_destiny", cost: 2 } },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60 },
  tags: ["cards", "damage", "fate_weaver"]
}
```

## 10.9 Coin Resolution Spell (Gambler)
```javascript
{
  id: "sp_fortune_strike",
  name: "Fortune Strike",
  description: "Flip coins to determine damage.",
  level: 2,
  school: "arcane",
  icon: "inv_misc_coin_01",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "arcane", range: "melee", rangeType: "melee" },
  damageConfig: {
    formula: "COIN_RESULT",
    damageTypes: ["force"],
    resolution: "COINS",
    coinConfig: {
      coinCount: 3,
      headsDamage: "2d6 per head",
      tailsDamage: "1d4 per tail",
      allHeadsBonus: "3d6 additional",
      allTailsPenalty: "spell fizzles"
    }
  },
  resourceCost: { actionPoints: 2, mana: 8, classResource: { type: "fortune_points", cost: 3 } },
  targetingConfig: { targetingType: "single", rangeType: "melee" },
  tags: ["coins", "damage", "gambler"]
}
```

## 10.10 Rollable Table Spell (Chaos Weaver)
```javascript
{
  id: "sp_prismatic_chaos",
  name: "Prismatic Chaos",
  description: "Unleash unpredictable chaotic energy.",
  level: 4,
  school: "chaos",
  icon: "spell_shadow_charm",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "chaos" },
  mechanicsConfig: {
    rollableTable: {
      enabled: true,
      tableName: "Prismatic Chaos",
      description: "Roll 1d20 for chaotic effect",
      diceFormula: "1d20",
      entries: [
        { min: 1, max: 3, effect: "Fireball (3d6 fire) centered on self", weight: 3 },
        { min: 4, max: 6, effect: "Heal self 2d8", weight: 3 },
        { min: 7, max: 9, effect: "Teleport 30ft randomly", weight: 3 },
        { min: 10, max: 14, effect: "3d6 force damage to target", weight: 5 },
        { min: 15, max: 17, effect: "Target confused for 1d4 rounds", weight: 3 },
        { min: 18, max: 20, effect: "6d6 chaos damage + stun 1 round", weight: 3 }
      ]
    }
  },
  damageConfig: { formula: "3d6", damageTypes: ["chaos"], resolution: "DICE" },
  resourceCost: { actionPoints: 2, mana: 12, classResource: { type: "mayhem", cost: -3 } },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60 },
  tags: ["rollable_table", "chaos", "chaos_weaver"]
}
```

## 10.11 Multi-Effect Spell (Complex)
```javascript
{
  id: "sp_holy_nova",
  name: "Holy Nova",
  description: "A burst of divine light damages enemies and heals allies.",
  level: 4,
  school: "radiant",
  icon: "spell_holy_holy nova",
  spellType: "ACTION",
  effectTypes: ["damage", "healing", "debuff"],
  typeConfig: { school: "radiant", range: "self", rangeType: "self", castTime: "1 action", castTimeType: "action" },
  damageConfig: {
    formula: "4d8",
    damageTypes: ["radiant"],
    resolution: "DICE",
    savingThrow: { ability: "agility", difficultyClass: 16, saveOutcome: "half_damage" }
  },
  healingConfig: {
    formula: "2d8 + spirit",
    healingType: "direct",
    resolution: "DICE"
  },
  debuffConfig: {
    debuffType: "statusEffect",
    effects: [
      { id: "blinded", name: "Flash Blind", description: "Blinded for 1 round · DC 16 Con save", mechanicsText: "" }
    ],
    savingThrow: { ability: "constitution", difficultyClass: 16, saveOutcome: "negates" },
    durationType: "rounds", durationValue: 1, durationUnit: "rounds",
    canBeDispelled: true
  },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 20 },
  resourceCost: { actionPoints: 2, mana: 15 },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  tags: ["damage", "healing", "debuff", "radiant", "aoe", "multi_effect"]
}
```

## 10.12 Class-Specific: Pyrofiend Inferno Spell
```javascript
{
  id: "sp_inferno_rush",
  name: "Inferno Rush",
  description: "Ignite yourself and charge through enemies.",
  level: 3,
  school: "fire",
  icon: "spell_fire_flamestrike",
  spellType: "ACTION",
  effectTypes: ["damage"],
  typeConfig: { school: "fire", range: "self", rangeType: "self" },
  damageConfig: {
    formula: "4d6 + 2",
    damageTypes: ["fire"],
    resolution: "DICE",
    criticalConfig: { enabled: true, critMultiplier: 2, critRange: [19, 20], critBonusDamage: "2d6" }
  },
  targetingConfig: { targetingType: "area", areaShape: "line", areaSize: 30, targetRestrictions: "enemies" },
  resourceCost: { actionPoints: 2, mana: 10, classResource: { type: "inferno", cost: 2 } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  infernoVeil: { level: 3, ascentRate: 2 },
  tags: ["pyrofiend", "fire", "inferno", "aoe", "charge"]
}
```

## 10.13 Class-Specific: Martyr Devotion Spell
```javascript
{
  id: "sp_martyrs_intervention",
  name: "Martyr's Intervention",
  description: "Redirect damage from an ally to yourself. Healing scales with Devotion.",
  level: 3,
  school: "radiant",
  icon: "spell_holy_layonhands",
  spellType: "REACTION",
  effectTypes: ["healing"],
  typeConfig: { school: "radiant", castTime: "1 reaction", castTimeType: "reaction" },
  healingConfig: {
    formula: "2d8 + spirit + devotionLevel * 2d8",
    healingType: "direct",
    resolution: "DICE"
  },
  triggerConfig: {
    global: {
      logicType: "AND",
      compoundTriggers: [
        { type: "damage_taken", conditions: { operator: "greater_than", value: 0, target: "ally" } }
      ]
    },
    triggerRole: { mode: "manual", activationDelay: "reaction" }
  },
  targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: "allies" },
  resourceCost: { actionPoints: 0, mana: 10, classResource: { type: "devotion_gauge", cost: 2 } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
  devotionLevel: 3,
  tags: ["martyr", "reaction", "healing", "devotion", "protection"]
}
```

## 10.14 Class-Specific: Minstrel Chord Spell
```javascript
{
  id: "sp_perfect_cadence",
  name: "Perfect Cadence",
  description: "Play the Perfect Cadence (I-IV-V-I) for guaranteed critical hit on next attack.",
  level: 3,
  school: "thunder",
  icon: "inv_misc_drum_01",
  spellType: "ACTION",
  effectTypes: ["buff"],
  typeConfig: { school: "thunder", range: "self", rangeType: "self" },
  buffConfig: {
    buffType: "combatAdvantage",
    effects: [
      { id: "crit_buff", name: "Perfect Cadence", description: "Next attack is a guaranteed critical hit", mechanicsText: "" }
    ],
    statusEffects: [{ id: "critical_improved", level: 1 }],
    durationType: "rounds", durationValue: 1, durationUnit: "rounds",
    stackingRule: "replace"
  },
  resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "musical_notes", cost: "I+IV+V+I" } },
  cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
  musicalNotes: { I: 3, II: 1, III: 2, IV: 3, V: 3, VI: 1, VII: 0 },
  tags: ["minstrel", "buff", "chord", "critical", "musical"]
}
```

## 10.15 Summoning Spell
```javascript
{
  id: "sp_summon_fire_elemental",
  name: "Summon Fire Elemental",
  description: "Call forth a fire elemental from the elemental plane.",
  level: 5,
  school: "fire",
  icon: "spell_fire_elemental",
  spellType: "ACTION",
  effectTypes: ["summoning"],
  typeConfig: { school: "fire", range: "60 feet", rangeType: "ranged", castTime: "1 action", castTimeType: "action" },
  summoningConfig: {
    summonType: "elemental",
    creatureType: "elemental",
    creatureName: "Fire Elemental",
    creatureLevel: 5,
    creatureStats: {
      hp: 45, armor: 16, damage: "2d8", damageType: "fire", speed: 30,
      abilities: ["Fire Touch", "Flame Aura", "Fire Form"]
    },
    duration: 10, durationType: "minutes",
    maxSummons: 1, controlType: "direct", commandable: true, sharesInitiative: true, summonCount: 1
  },
  targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 10 },
  resourceCost: { actionPoints: 3, mana: 20 },
  cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
  tags: ["summoning", "fire", "elemental"]
}
```

---

# Part 11: Save Pipeline & Persistence

## 11.1 Data Flow

```
Wizard State (spellWizardContext)
    ↓ handleSaveSpell() in SpellwizardApp.jsx
    ↓ Builds complete spell object from all wizard steps
    ↓
Normalization (spellNormalizer.js)
    ↓ 12-step normalization ensures consistent structure
    ↓ Fills defaults, converts legacy formats, ensures all fields
    ↓
Spell Library Context (SpellLibraryContext.js)
    ↓ addSpell action: auto-categorizes, generates ID, timestamps
    ↓
Library Manager (libraryManager.js)
    ↓ saveLibraryToStorage() → localStorage
    ↓ Auto-categorizes into 10 default categories
    ↓
Firebase (userSpellService.js / spellbookStore.js)
    ↓ Authenticated users: saveUserSpell() → Firestore
    ↓ Key: users/{userId}/user_spells/{spellId}
    ↓ Fallback: localStorage key 'spellbook-storage'
    ↓
Community Sharing (communitySpellService.js)
    ↓ shareSpellToCommunity() → community_spells collection
    ↓ Key: community_spells/{spellId}
    ↓ Sanitized via sanitizeForFirestore()
```

## 11.2 Normalization Process (12 Steps)

The `normalizeSpell()` function in `spellNormalizer.js` performs:

1. **Basic properties**: Ensure `id`, `name`, `description`, `level`, `spellType`, `icon` exist
2. **Effect types**: Normalize `effectTypes` array from various source formats
3. **Damage types**: Extract from `typeConfig`, `damageConfig`, or top-level
4. **TypeConfig**: Ensure `typeConfig` exists with defaults
5. **TargetingConfig**: Normalize with `aoeType`, `rangeType` defaults
6. **Effect configs**: Normalize all 10 `*Config` objects
6. **Legacy preservation**: Keep old `effects` object if present
7. **Resource cost**: Ensure `actionPoints` is set
8. **Cooldown/duration**: Ensure consistent format
9. **Tags**: Normalize to array
10. **Class mechanics**: Preserve class-specific fields (inferno, temporal, devotion, etc.)
11. **Specialization/category**: Preserve classification
12. **Special mechanics**: Preserve `specialMechanics` object

## 11.3 Auto-Categorization

The `categorizeSpell()` function in `libraryManager.js` auto-categorizes spells into:

| Category ID | Category Name | Criteria |
|-------------|---------------|----------|
| `offensive` | Offensive | Has fire/frost/lightning/arcane/necrotic/radiant/psychic/force/chaos/void damage |
| `defensive` | Defensive | Has buff with armor/resistance/haste/shield |
| `utility` | Utility | Has utility/transformation/purification/restoration effect |
| `healing` | Healing | Has healing effect |
| `general_actions` | General Actions | Name includes "Attack", "Move", "Dash", "Hide", etc. |
| `general_reactions` | General Reactions | spellType is REACTION |
| `general_skills` | General Skills | Non-combat utility actions |
| `general_enhancements` | General Enhancements | Buffs that aren't defensive |
| `favorites` | Favorites | User-marked |
| `uncategorized` | Uncategorized | Default fallback |

## 11.4 Community Sharing

```javascript
// Upload flow:
userSpellService.shareSpellToCommunity(userId, spellId)
  → Copies spell to community_spells collection
  → Removes user-specific fields (folderId, isCustom)
  → Adds community metadata (isPublic, isFeatured, rating, downloadCount)

// Download flow:
communitySpellService.downloadSpell(spellId)
  → Increments download count
  → Adds to local library with community-{id} prefix
  → source: 'community', originalId: originalSpellId
```

---

# Part 12: Quick Reference Cards

## 12.1 Spell Type → Required Fields

| Type | Required Additional Fields |
|------|---------------------------|
| ACTION | None beyond standard |
| CHANNELED | `channelingConfig` |
| PASSIVE | `triggerConfig.global` |
| REACTION | `triggerConfig.global` + `triggerConfig.triggerRole` |
| TRAP | `trapConfig` |
| STATE | `mechanicsConfig` |

## 12.2 Effect Type → Config Object

| Effect | Config Object |
|--------|---------------|
| damage | `damageConfig` |
| healing | `healingConfig` |
| buff | `buffConfig` |
| debuff | `debuffConfig` |
| utility | `utilityConfig` |
| control | `controlConfig` |
| summoning | `summoningConfig` |
| transformation | `transformationConfig` |
| purification | `purificationConfig` |
| restoration | `restorationConfig` |

## 12.3 All Damage Type IDs

```
bludgeoning, piercing, slashing, fire, frost, lightning, arcane, nature,
force, necrotic, radiant, poison, psychic, chaos, void
```

## 12.4 All Targeting Type IDs

```
single, multi, area, chain, cone, line, self, smart, nearest
```

## 12.5 All Duration Type IDs

```
instant, rounds, turns, minutes, hours, concentration, permanent
```

## 12.6 All Cooldown Type IDs

```
turn_based, short_rest, long_rest, real_time, conditional,
charge_based, encounter, dice_based
```

## 12.7 All Saving Throw Abilities

```
strength, agility, constitution, intelligence, spirit, charisma
```
Note: `dexterity` → `agility`, `wisdom` → `spirit` (auto-converted in code)

## 12.8 Save Outcome Values

```
negates, half_damage, no_effect, damage_on_fail, reduced_duration, half
```

## 12.9 Formula Quick Patterns

| Pattern | Meaning |
|---------|---------|
| `2d6` | Roll 2 six-sided dice |
| `3d8 + 5` | Roll 3d8, add 5 |
| `1d12 + strength` | Roll 1d12, add strength score |
| `2d10 + intelligence` | Roll 2d10, add intelligence score |
| `MAX(3d6, 10)` | Roll 3d6, take higher of result or 10 |

## 12.10 Common Patterns Cheat Sheet

### AOE Damage
```javascript
targetingConfig: { targetingType: "area", areaShape: "circle", areaSize: 20 },
damageConfig: { formula: "8d6", damageTypes: ["fire"], resolution: "DICE",
  savingThrow: { ability: "agility", difficultyClass: 15, saveOutcome: "half_damage" } }
```

### DoT Effect
```javascript
damageConfig: { formula: "3d6", damageTypes: ["poison"], resolution: "DICE",
  dotConfig: { enabled: true, damagePerTick: "1d6", damageType: "poison",
  tickFrequency: "round", duration: 3 } }
```

### Buff with Duration
```javascript
buffConfig: { buffType: "statEnhancement",
  effects: [{ id: "str_up", name: "STR Up", description: "+2 Strength for 3 rounds",
    mechanicsText: "", statModifier: { stat: "strength", magnitude: 2, magnitudeType: "flat" } }],
  durationType: "rounds", durationValue: 3, durationUnit: "rounds" }
```

### Debuff with Save
```javascript
debuffConfig: { debuffType: "statusEffect",
  effects: [{ id: "poisoned", name: "Poisoned", description: "Disadvantage on attacks · DC 14 Con save", mechanicsText: "" }],
  savingThrow: { ability: "constitution", difficultyClass: 14, saveOutcome: "negates" },
  durationType: "rounds", durationValue: 3, durationUnit: "rounds" }
```

### Chain Effect
```javascript
damageConfig: { formula: "6d6", damageTypes: ["lightning"], resolution: "DICE",
  chainConfig: { enabled: true, chainCount: 3, chainRange: 15, damageFalloff: 0.7 } }
```

### Passive Aura
```javascript
spellType: "PASSIVE",
triggerConfig: { global: { logicType: "AND", compoundTriggers: [{ type: "turn_start", conditions: {} }] },
  triggerRole: { mode: "auto" } }
```

### Reaction Shield
```javascript
spellType: "REACTION",
triggerConfig: { global: { logicType: "AND",
  compoundTriggers: [{ type: "damage_taken", conditions: { operator: "greater_than", value: 0 } }] },
  triggerRole: { mode: "manual", activationDelay: "reaction" } }
```

### Class Resource Cost
```javascript
resourceCost: { actionPoints: 2, mana: 10,
  classResource: { type: "<resource_id>", cost: <number> } }
```

### Rollable Table
```javascript
mechanicsConfig: { rollableTable: { enabled: true, tableName: "Name",
  diceFormula: "1d20", entries: [
    { min: 1, max: 10, effect: "Effect A", weight: 10 },
    { min: 11, max: 20, effect: "Effect B", weight: 10 }
  ] } }
```

---

# Part 13: Wizard Step → Spell Card Display Mapping

> **This section maps every Spell Wizard step to exactly what appears on the rendered spell card.**
> Use this when auditing or formatting existing spells — if a field is listed here, it WILL render on the card.

## 13.1 Card Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                   │
│ ┌──────┐  Name                     ┌──────────────────┐  │
│ │ ICON │  Resource Costs           │ Damage Type Badges│  │
│ │      │  (AP, Mana, Class)        │ V S M Components │  │
│ │ TYPE │                           └──────────────────┘  │
│ │BADGE │  Cast Time                                       │
│ └──────┘                                                  │
│                                                           │
│ [ACTION] [Range: 60ft] [Single Target] [Chain 3]         │
│ • Bullet 1  • Bullet 2  • Bullet 3                       │
├───────────────────────────────────────────────────────────┤
│ BODY                                                     │
│ "Description flavor text here."                           │
│                                                           │
│ ── Required Conditions / Spell Triggers ──                │
│ If HP < 50%                                               │
│                                                           │
│ Instant Damage                                            │
│   2d6 + Intelligence Fire Damage                          │
│   ┌─ 30ft ─┐ ┌─ Enemies ─┐ ┌─ Chain 3 ─┐                │
│                                                           │
│ If HP < 50%: 3d6 + 4 Fire Damage                         │
│                                                           │
│ Saving Throw                                              │
│   ◆ Dexterity save DC 15 (Half Damage)                    │
│                                                           │
│ Healing                                                   │
│   2d8 + Spirit Healing                                    │
│                                                           │
│ ── Buff/Debuff/Control/Utility/Summon/Transform ──        │
│ [mechanicsText or description from effects[]]             │
│                                                           │
│ ── Rollable Table ──                                      │
│ [Table name: dice formula, entries]                       │
│                                                           │
│ ── Mechanics (Procs, Combos, Stances, Toxic, etc.) ──    │
│ [mechanicsText from effectMechanicsConfigs]               │
├───────────────────────────────────────────────────────────┤
│ FOOTER                                                   │
│ [tag1] [tag2] [tag3]                        Cooldown: 3  │
└───────────────────────────────────────────────────────────┘
```

## 13.2 Step-by-Step Field → Card Mapping

### Step 1: Basic Info → Header + Footer

| Wizard Field | Card Location | How It Displays |
|---|---|---|
| `name` | Header, spell name | Large text, top-left |
| `description` | Body, top | Italic flavor text in `.item-description` |
| `level` | Not directly shown on card | Used for categorization and sort; shown in `rules` variant as "Level X" tag |
| `school` / `typeConfig.school` | Header, damage type badge | Color-coded badge (e.g., "Fire", "Frost") |
| `icon` | Header, spell icon | WoW icon image via zamimg.com |
| `tags[]` | Footer, tag badges | Small rounded badges at bottom-left |

**Key rule**: `school` determines the card's border color AND the damage type badge color. Use valid damage type IDs (see §3.3).

### Step 2: Spell Type → Header Badges + Bullets

| Wizard Field | Card Location | How It Displays |
|---|---|---|
| `spellType` | Header, action type badge | Colored badge: ACTION (red), PASSIVE (green), REACTION (blue), CHANNELED (purple), TRAP (orange), STATE (gray) |
| `typeConfig.castTime` | Header, meta row | "1 action", "1 bonus action", "1 reaction", "free" |
| `typeConfig.castTimeType` | Header, meta row | Determines cast time display format |
| `typeConfig.range` | Header, range badge | "120 feet", "60 feet", "self", "touch", "melee" |
| `typeConfig.rangeType` | Header, range badge | Determines range display style |

**Type-specific bullets** (appear below badges as `• bullet` items):

| Spell Type | Bullet Sources |
|---|---|
| CHANNELED | `typeConfig.maxChannelDuration` → "Up to X turns"; `typeConfig.interruptible`; `typeConfig.movementAllowed`; `typeConfig.concentrationDC`; `typeConfig.tickFrequency`; `typeConfig.breakEffect` |
| REACTION | `typeConfig.availabilityType` (if not ALWAYS); `typeConfig.limitUsesPerTurn` → "X/turn"; `typeConfig.reactionWindow`; `typeConfig.cooldownAfterTrigger`; `typeConfig.maxTriggers` |
| TRAP | `typeConfig.placementTime` (if >1); `typeConfig.visibility` → "hidden"/"magical aura"/"visible to all"; `typeConfig.cooldownAfterTrigger`; `typeConfig.maxTriggers`; `trapConfig.detectDC` → "Detect DC X"; `trapConfig.disarmDC` → "Disarm DC X" |
| PASSIVE | `typeConfig.durationType` → "While active"; `typeConfig.auraRadius` → "Xft aura" |
| STATE | `typeConfig.stanceName` → "Stance: X"; `typeConfig.durationType` |

### Step 3: Effects → Card Body (Main Content Area)

This is the largest section. Each effect type in `effectTypes[]` renders as a named block.

#### Damage Effects (`damage` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `damageConfig.formula` | Mechanics text: "2d6 + Intelligence Fire Damage" | Uses `cleanFormula()` + damage type suffix |
| `damageConfig.damageTypes[]` | Header damage type badges + formula suffix | e.g., "Fire", "Fire and Necrotic" |
| `damageConfig.resolution` | Determines prefix: "Draw X cards:", "Flip X coins:", or plain formula | `DICE` (default), `CARDS`, `COINS` |
| `damageConfig.diceConfig.formula` | Alternative formula source for DICE resolution | Used if `resolution === 'DICE'` |
| `damageConfig.cardConfig.drawCount` | "Draw X cards:" prefix | Only for CARDS resolution |
| `damageConfig.coinConfig.flipCount` | "Flip X coins:" prefix | Only for COINS resolution |
| `damageConfig.hasDotEffect` | Creates separate "Damage Over Time" entry | |
| `damageConfig.damageType === 'dot'` | Marks spell as pure DoT (no instant damage line) | |
| `damageConfig.dotConfig.dotFormula` | "X per round for Y rounds" | |
| `damageConfig.dotConfig.duration` | DoT duration in rounds | |
| `damageConfig.dotConfig.tickFrequency` | "per round" or "per turn" | |
| `damageConfig.dotConfig.progressiveStages` | "Formula1 → Formula2 → Formula3 over Y rounds" | Progressive DoT |
| `damageConfig.dotConfig.isProgressiveDot` | Enables progressive stage display | |
| `damageConfig.savingThrowConfig.enabled` | Creates "Saving Throw" entry | |
| `damageConfig.savingThrowConfig.saveType` | "Dexterity save" | |
| `damageConfig.savingThrowConfig.dc` | "DC 15" | |
| `damageConfig.savingThrowConfig.saveOutcome` | "(Half Damage)", "(Negates on fail)" | |
| `damageConfig.criticalConfig.enabled` | Creates "Critical Hit" entry | |
| `damageConfig.criticalConfig.critRange` | "19-20 crit range" | |
| `damageConfig.criticalConfig.critMultiplier` | "x2 damage" | |
| `damageConfig.criticalConfig.critBonusDamage` | "+2d6 bonus" | |
| `damageConfig.criticalConfig.critEffect` | "Target bleeds: 1d4 Slashing" | |
| `damageConfig.chanceOnHitConfig.enabled` | Appended to instant damage mechanics text | "25% chance to apply Burning" |
| `damageConfig.weaponDependent` | Adds attribute modifier to formula | "+ Strength" |
| `damageConfig.attributeModifier` | "Strength", "Intelligence", etc. | |

**Formula formatting rules** (via `cleanFormula()`):
- Dice formulas (`2d6`, `3d8 + 5`) displayed as-is
- Stat names capitalized: `intelligence` → `Intelligence`
- `+` and `-` surrounded by spaces
- `damageType` or `physical` filtered out from suffix (not specific enough)
- `direct` filtered out (not a real damage type)

#### Healing Effects (`healing` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `healingConfig.formula` | Mechanics text: "2d8 + Spirit Healing" | |
| `healingConfig.healingType` | Effect name: "Healing", "Healing Over Time", "Shield Absorption" | `direct`, `hot`, `shield` |
| `healingConfig.hasHotEffect` | Creates separate "Healing Over Time" entry | Additional to main heal |
| `healingConfig.hotFormula` | "X per round for Y rounds" | |
| `healingConfig.hotDuration` | HoT duration | |
| `healingConfig.hasShieldEffect` | Creates separate "Shield Absorption" entry | |
| `healingConfig.shieldFormula` | "X absorption" | |
| `healingConfig.shieldDuration` | "For Y rounds" | |
| `healingConfig.criticalConfig.enabled` | Creates "Critical Healing" entry | |

#### Buff Effects (`buff` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `buffConfig.effects[].name` | Effect name header | e.g., "Strength Boost" |
| `buffConfig.effects[].description` | ◆ description text | **This is what shows on the card** |
| `buffConfig.effects[].mechanicsText` | ◆ mechanics text | **EMPTY when description has info** (Golden Rule) |
| `buffConfig.effects[].statModifier.stat` | Used for stat display | e.g., "strength" |
| `buffConfig.effects[].statModifier.magnitude` | "+2" or "-2" | |
| `buffConfig.effects[].statModifier.magnitudeType` | "flat" or "percentage" | |
| `buffConfig.durationValue` + `durationType` | Duration display | "for 3 rounds", "for 10 minutes" |

**IMPORTANT**: The card renders `buffConfig.effects[].description` as the primary display text. If `description` is empty, it falls back to `mechanicsText`. Follow the Golden Rule (§1.2): put info in ONE place.

#### Debuff Effects (`debuff` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `debuffConfig.effects[].name` | Effect name header | e.g., "Poisoned" |
| `debuffConfig.effects[].description` | ◆ description text | **Primary display** |
| `debuffConfig.effects[].mechanicsText` | ◆ mechanics text | **EMPTY when description has info** |
| `debuffConfig.savingThrow.ability` | "Constitution save" | |
| `debuffConfig.savingThrow.difficultyClass` | "DC 14" | |
| `debuffConfig.savingThrow.saveOutcome` | "(Negates)", "(Half)" | |
| `debuffConfig.durationValue` + `durationType` | Duration display | |
| `debuffConfig.canBeDispelled` | May show dispel info | |

#### Control Effects (`control` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `controlConfig.controlType` | Effect name: "Stunned", "Immobilized", etc. | |
| `controlConfig.effects[].description` | ◆ description text | **Primary display** |
| `controlConfig.effects[].mechanicsText` | ◆ mechanics text | For movement distance, etc. |
| `controlConfig.savingThrow` | Save info appended | |
| `controlConfig.duration` + `durationType` | Duration | |
| `controlConfig.strength` | "full", "partial", "minor" | May affect display |

#### Utility Effects (`utility` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `utilityConfig.effects[].name` | Effect name | e.g., "Teleport" |
| `utilityConfig.effects[].description` | ◆ description text | **Primary display** |
| `utilityConfig.effects[].mechanicsText` | ◆ mechanics text | For distance, speed details |
| `utilityConfig.duration` + `durationType` | Duration | |

#### Summoning Effects (`summoning` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `summoningConfig.creatureName` | Summon name | |
| `summoningConfig.creatureStats.hp` | "HP: 30" | |
| `summoningConfig.creatureStats.armor` | "Armor: 15" | |
| `summoningConfig.creatureStats.damage` | "Damage: 2d6" | |
| `summoningConfig.creatureStats.speed` | "Speed: 30" | |
| `summoningConfig.creatureStats.abilities` | Ability list | |
| `summoningConfig.duration` + `durationType` | Duration | |
| `summoningConfig.summonCount` | Number summoned | |

#### Transformation Effects (`transformation` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `transformationConfig.targetForm` | "Transform into Wolf" | |
| `transformationConfig.newStats` | New stat values | |
| `transformationConfig.grantedAbilities` | Granted abilities list | |
| `transformationConfig.duration` + `durationType` | Duration | |

#### Purification Effects (`purification` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `purificationConfig.purificationType` | Effect name | "Cleanse", "Dispel", etc. |
| `purificationConfig.targetEffects[]` | What it removes | "poison, disease" |
| `purificationConfig.strength` | "full", "partial" | |
| `purificationConfig.healAmount` | Additional healing | |

#### Restoration Effects (`restoration` in `effectTypes`)

| Data Field | Card Display | Notes |
|---|---|---|
| `restorationConfig.restorationType` | Effect name | "Resurrect", "Revive", etc. |
| `restorationConfig.restoredHealth` | HP restored | |
| `restorationConfig.removesConditions[]` | Conditions removed | |

### Step 4: Targeting → Header Badges + Effect Targeting

| Wizard Field | Card Location | How It Displays |
|---|---|---|
| `targetingConfig.targetingType` | Header, targeting badge | "Single Target", "Area", "Multi Target", "Chain", "Cone", "Line", "Self", "Smart", "Nearest" |
| `targetingConfig.rangeType` + `rangeDistance` | Header, range badge | "120 feet", "60 feet", "Self", "Melee", "Touch" |
| `targetingConfig.areaShape` + `areaSize` | Per-effect targeting badge | "20ft circle", "30ft cone", "60ft line" |
| `targetingConfig.targetRestrictions` | Per-effect targeting badge | "Enemies", "Allies", "Self", "All" |
| `targetingConfig.maxTargets` | Targeting badge | "Up to 3 targets" |
| `targetingConfig.propagation.chainCount` | Header, propagation badge | "Chain 3" |
| `targetingConfig.propagation.chainRange` | Propagation badge detail | "15ft between" |
| `targetingConfig.propagation.chainDamageFalloff` | Propagation badge detail | "70% falloff" |

**Important**: Targeting info appears in TWO places:
1. **Header badges row** — general targeting (range, type, propagation)
2. **Per-effect targeting badges** — specific to each damage/healing effect (range, targeting, restrictions, propagation)

### Step 5: Resources → Header (Below Name)

| Wizard Field | Card Location | How It Displays |
|---|---|---|
| `resourceCost.actionPoints` | Below spell name | "2 AP" badge (always shown if > 0) |
| `resourceCost.mana` | Below spell name | "8 Mana" badge |
| `resourceCost.health` | Below spell name | "1d6 HP" badge |
| `resourceCost.stamina` | Below spell name | "3 Stamina" badge |
| `resourceCost.focus` | Below spell name | "2 Focus" badge |
| `resourceCost.energy` | Below spell name | "Energy" badge |
| `resourceCost.classResource.type` + `.cost` | Custom class resource badge | "3 Inferno", "2 Threads", "I+IV+V+I" |
| `resourceCost.components[]` | Below damage type badges | "V S M" badges (Verbal, Somatic, Material) |
| `resourceCost.materialComponents` | Tooltip on M component | "Bat guano and sulfur" |
| `resourceCost.channelingFrequency` | Appended to resource cost | "/round", "/turn" (CHANNELED spells) |
| `resourceCost.reagents[]` | Resource badges | Consumable reagents |

**Class resource special rendering** (each class has custom badge formatting):
- **Pyrofiend**: "Inferno Lv.3 +2" (current level + ascent)
- **Minstrel**: Musical note icons (I-VII) with count
- **Chronarch**: "3 Time Shards" with strain indicator
- **Chaos Weaver**: "Mayhem ±3" (generate or spend)
- **Fate Weaver**: "2 Threads" with generate/spend indicator
- **Martyr**: "Devotion Lv.3" with tier indicator
- **Deathcaller**: "1d6 HP + 3 Blood Tokens"
- **Dreadnaught**: "15 DRP"
- **Bladedancer**: "3 Momentum" with stance indicator
- **Warden**: "5 VP" with avatar threshold
- **Huntress**: "2 QM"
- **All others**: Resource name + cost number

### Step 6: Cooldown → Footer

| Wizard Field | Card Location | How It Displays |
|---|---|---|
| `cooldownConfig.cooldownType` | Footer, right side | Formatted text |
| `cooldownConfig.cooldownValue` | Footer, right side | Number value |

**Cooldown display by type**:
| Type | Display |
|---|---|
| `turn_based` | "X turns" |
| `short_rest` | "Short Rest" |
| `long_rest` | "Long Rest" |
| `encounter` | "Per Encounter" |
| `real_time` | "X seconds" |
| `charge_based` | "X charges (recover on short_rest)" |
| `dice_based` | "1d4 turns" |
| `conditional` | Custom condition text |

### Triggers Step → Card Body (Before Effects)

| Data Field | Card Location | How It Displays |
|---|---|---|
| `triggerConfig.global.compoundTriggers[]` | Body, "Spell Triggers" header | "When damage is taken", "If HP < 50%" |
| `triggerConfig.global.logicType` | Between triggers | "ALL" or "ANY" badge |
| `triggerConfig.requiredConditions.enabled` | Body, "Required" header | "HP < 50% ◆ ALL" |
| `triggerConfig.requiredConditions.conditions[]` | Under "Required" | Each condition formatted |
| `triggerConfig.effectTriggers.damage.compoundTriggers[]` | Under damage effect | Trigger-specific conditions |
| `triggerConfig.conditionalEffects.damage.conditionalFormulas` | Under damage effect | "If HP < 50%: 3d6 + 4 Fire Damage" |
| `triggerConfig.effectTriggers.healing.compoundTriggers[]` | Under healing effect | Healing-specific conditions |
| `triggerConfig.conditionalEffects.healing.conditionalFormulas` | Under healing effect | "If HP < 50%: 2d8 + Spirit Healing" |

**Trigger display logic**:
- If `conditionalFormulas` exist for a trigger → shown as "If [condition]: [formula]" inline with the effect
- If triggers exist but NO conditional formulas → shown as standalone "Spell Triggers" header above effects
- If `requiredConditions` exist → shown as "Required" header with ALL/ANY logic badge

### Channeling Step → Type-Specific Bullets + Resource Frequency

| Data Field | Card Location | How It Displays |
|---|---|---|
| `channelingConfig.maxDuration` | Bullet: "Up to X turns" | Also stored in `typeConfig.maxChannelDuration` |
| `channelingConfig.tickFrequency` | Bullet: "every round" | Also stored in `typeConfig.tickFrequency` |
| `channelingConfig.movementRestriction` | Bullet: "Must stand still" / "Can move while channeling" | Also stored in `typeConfig.movementAllowed` |
| `channelingConfig.breakEffect` | Bullet: "break: backlash" | Also stored in `typeConfig.breakEffect` |
| `channelingConfig.concentrationRequired` | Bullet: "DC X Spirit" | Also stored in `typeConfig.concentrationDC` |
| `channelingConfig.perRoundFormulas.manaCost` | Resource cost: "2 Mana/round" | Via `resourceCost.channelingFrequency` |

### Trap Placement Step → Type-Specific Bullets

| Data Field | Card Location | How It Displays |
|---|---|---|
| `trapConfig.triggerRadius` | May appear in description | |
| `trapConfig.triggerCondition` | Bullet or description | "proximity", "pressure", "timer" |
| `trapConfig.armTime` | Bullet: "X turns to place" | Via `typeConfig.placementTime` |
| `trapConfig.detectDC` | Bullet: "Detect DC 13" | |
| `trapConfig.disarmDC` | Bullet: "Disarm DC 15" | |
| `trapConfig.visibleToAllies` | Bullet: "visible to all" / "hidden" / "magical aura" | Via `typeConfig.visibility` |
| `trapConfig.charges` | Bullet: "single use" / "max X triggers" | Via `typeConfig.maxTriggers` |

### Mechanics Step → Card Body (After Effects)

| Data Field | Card Location | How It Displays |
|---|---|---|
| `mechanicsConfig.rollableTable.enabled` | "Rollable Table" section | Table name, dice formula, entries |
| `mechanicsConfig.comboPoints.enabled` | Mechanics section | Combo point info |
| `mechanicsConfig.procConfig.enabled` | Mechanics section | "25% on hit: Burning (1d6 fire, 3 rounds)" |
| `mechanicsConfig.criticalConfig.enabled` | Mechanics section | Crit range, multiplier, bonus |
| `mechanicsConfig.formRequirements.requiredForm` | Mechanics section | "Requires Dancing Blade stance" |
| `mechanicsConfig.toxicConfig.enabled` | Mechanics section | Toxic stacking info |
| `mechanicsConfig[*].system === "PROPHECY"` | **Prophecy Resolution** section | Range dice, outcomes, Havoc gain |
| `mechanicsConfig[*].prophecy.rangeDice` | Prophecy header | "d8+d6 vs d6" display |
| `mechanicsConfig[*].prophecy.prophesied` | Prophesied outcome | Damage, effect, havocGain |
| `mechanicsConfig[*].prophecy.base` | Base outcome | Damage, havocGain |
| `mechanicsConfig[*].prophecy.outside` | Outside outcome | Backlash, havocGain |
| `mechanicsConfig[*].prophecy.tickDamage` | Tick damage info | Formula, scaling (escalating) |
| `tableConfig` (with PROPHECY) | Roll table inside Prophecy Summary | Table name, roll entries |
| `effectMechanicsConfigs.*` | Mechanics section | Per-effect mechanic configs |

## 13.3 The Golden Rule (Quick Reference)

```
┌──────────────────────────────────────────────────────────────────────┐
│  For BUFF / DEBUFF / CONTROL / UTILITY effects:                      │
│                                                                      │
│  Put ALL readable info in effects[].description                      │
│  Leave effects[].mechanicsText EMPTY                                │
│                                                                      │
│  For DAMAGE / HEALING effects:                                       │
│                                                                      │
│  Leave effects[].description EMPTY (or trigger info only)            │
│  Put formula info in the damageConfig/healingConfig fields          │
│  (formula, damageTypes, savingThrow, etc.)                           │
│                                                                      │
│  The spell card auto-generates mechanics text from formulas.         │
└──────────────────────────────────────────────────────────────────────┘
```

## 13.4 Common Formatting Mistakes (Card Display Impact)

| Mistake | What Shows on Card | Fix |
|---|---|---|
| `description` has damage formula AND `mechanicsText` has it | Duplicate info shown | Put formula in ONE place only |
| `effects[]` uses bare strings like `"Stunned"` | May render incorrectly | Use `{ id, name, description, mechanicsText }` objects |
| `damageTypes: 'fire'` (string not array) | No damage type badge | Use `damageTypes: ['fire']` |
| `durationType: 'rounds'` but `durationUnit: 'turns'` | Missing/wrong duration | Both MUST match |
| `resourceCost.actionPoints` missing | No AP cost shown, spell looks free | Always set `actionPoints: <number>` |
| `school: 'Evocation'` | No border color, no badge | Use damage type ID: `school: 'fire'` |
| Empty `description` on buff with empty `mechanicsText` | Effect shows name only, no details | Put readable text in `description` |
| `savingThrow` at top level instead of inside `damageConfig` | Save info not shown | Nest inside `damageConfig.savingThrow` |
| `effectTypes: ['damage']` but no `damageConfig` | No damage displayed | Add matching `damageConfig` |
| `typeConfig` missing | No cast time, no range badge | Always include `typeConfig` |
| Top-level `prophecyConfig` instead of `mechanicsConfig` | Prophecy block doesn't render or renders wrong | Use `mechanicsConfig: [{ system: "PROPHECY", prophecy: {...} }]` |
| `effectTypes: ['damage', 'debuff']` but no `debuffConfig` (PROPHECY) | Empty block on card | Debuffs inside prophecy outcomes don't need `'debuff'` in effectTypes |

## 13.5 Quick Audit Checklist

When reviewing a spell for correct card display, verify:

- [ ] **Header**: Name, icon, spell type badge, school color all correct?
- [ ] **Resources**: AP cost shown? Mana/class resource displayed with correct badge?
- [ ] **Components**: V/S/M badges showing if configured?
- [ ] **Badges row**: Action type, range, targeting all correct?
- [ ] **Bullets**: Type-specific info (channeling duration, reaction limits, trap detect DC)?
- [ ] **Description**: Flavor text renders in body?
- [ ] **Damage**: Formula + damage type suffix showing? No duplicate info?
- [ ] **Healing**: Formula + "Healing" suffix showing?
- [ ] **Buff/Debuff**: `effects[].description` has readable text? Not empty?
- [ ] **Saving Throw**: Shows ability + DC + outcome?
- [ ] **Critical Hit**: Shows range + multiplier + bonus?
- [ ] **DoT**: Shows formula per tick + duration?
- [ ] **Triggers**: "Required" or "Spell Triggers" header shows? Conditional formulas inline?
- [ ] **Cooldown**: Footer shows correct cooldown text?
- [ ] **Tags**: Footer shows relevant tags?
- [ ] **PROPHECY spells**: `mechanicsConfig` with `system: "PROPHECY"` (not top-level `prophecyConfig`)? `effectTypes` only includes types with actual `*Config` objects? `damageConfig.resolution: "PROPHECY"` set?
- [ ] **PROPHECY with debuffs**: Debuff effects inside prophecy outcomes do NOT have `'debuff'` in `effectTypes` (no `debuffConfig` exists)?

---

*End of SPELL_DATA_REFERENCE.md — Updated May 2026 for Mythrill VTT spell system v2.1*
