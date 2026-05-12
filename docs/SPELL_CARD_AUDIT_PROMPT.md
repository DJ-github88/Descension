# Spell Card Accuracy Audit — Per-Class Verification

## Your Mission

You are auditing **every spell** across **30 class data files** (1,678 spells total) to ensure each spell's **data object** accurately and completely describes the spell, and that the **UnifiedSpellCard** will render it faithfully. The goal is: when a player views a spell card, every detail from the spell's `description` text is properly backed by structured data fields that the card actually renders.

## What "Accurate" Means

For each spell, you must verify:

1. **Description ↔ Data Alignment**: Every mechanic mentioned in the `description` field has a corresponding structured data field (e.g., if description says "deals 3d6 fire damage and burns for 1d4/round for 3 rounds", then `damageConfig.formula` = `'3d6'`, `damageConfig.damageTypes` = `['fire']`, `damageConfig.dotConfig.enabled` = `true`, `damageConfig.dotConfig.damagePerTick` = `'1d4'`, `damageConfig.dotConfig.duration` = `3`)
2. **Effect Configs Match effectTypes**: Every type in `effectTypes` has a corresponding config, and every config has its type in `effectTypes`
3. **Card-Renderable Data**: Every mechanic has data in fields the card actually reads (not orphaned in a field the card ignores)
4. **Required Fields Present**: `level`, `spellType` (UPPERCASE), `typeConfig.school`, `targetingConfig`, `resourceCost.actionPoints`, `cooldownConfig` with `cooldownType`/`cooldownValue`, `resolution` in effect configs
5. **No Phantom Mechanics**: No data fields that imply mechanics not described (e.g., a `dotConfig` on a spell that doesn't mention burning/DoT in its description)

## How the Card Renders Spells

The card reads spells through this pipeline:

**Pipeline A (Wizard → Preview)**: `mapWizardStateToPreviewState()` in Step10Review.jsx → `UnifiedSpellCard` `spell` prop
**Pipeline B (Library → Card)**: `normalizeSpell()` → `transformSpellForCard()` → `UnifiedSpellCard` `spell` prop

Both pipelines preserve all fields end-to-end (verified by round-trip test: 115/115 top-level keys survive, 35/35 critical fields pass). The normalizer does a deep copy, the transformer does a deep copy — no fields are dropped except `cooldownConfig.type`/`cooldownConfig.value` (renamed to `cooldownType`/`cooldownValue`).

### Key Card Rendering Locations (UnifiedSpellCard.jsx)

The card renders these sections in order. For each spell, verify the data feeds the right section:

- **Header**: `name`, `level`, `icon`, `spellType`, `school` (from `typeConfig.school`)
- **Badges row**: `resolution`, `effectTypes`, `triggerRole.mode` (shows "Auto-Cast" if not CONDITIONAL), `targetingTags`
- **Casting info**: `castTime`, `range`/`rangeDistance`, `targetingConfig`, `actionPoints`, `resourceCost`
- **Cooldown**: `cooldownConfig` (reads both `cooldownType`/`cooldownValue` and legacy `type`/`value`)
- **Duration**: `durationConfig`, `persistentConfig`
- **Damage section**: `damageConfig.formula`, `damageTypes`, `criticalConfig`, `dotConfig`, `savingThrow`
- **Healing section**: `healingConfig.formula`, `hotConfig`, `shieldConfig`
- **Buff/Debuff sections**: `buffConfig.effects[]`, `debuffConfig.effects[]`
- **Control section**: `controlConfig`
- **Summon/Transform**: `summoningConfig`, `transformationConfig`
- **Channeling**: `channelingConfig` with `stages[]` (renders stage bullets)
- **Propagation**: `propagation` (chain/bounce/explosion)
- **Trap**: `trapConfig`
- **Trigger Chain**: `triggerConfig.conditionalEffects`, `triggerConfig.buffDebuffTriggers`
- **Combo Effects**: `combinedEffects`
- **Mechanics**: `mechanicsConfig` (cards, combos, coins, stateRequirements)
- **Prophecy**: `prophecyConfig` (renders via `ProphecySummary` component)
- **Status Effects**: `statusEffectsConfig`
- **Rollable Table**: `rollableTable`
- **Per-effect resolution**: `effectResolutions` (shows badge like `[CARDS]` next to effect name)
- **Per-effect targeting**: `effectTargeting`, `targetingTags`

### Resolution Systems

The card handles these resolution types:
- `DICE`: Standard dice formula display
- `CARDS`: Card-draw display with `cardConfig`
- `COINS`: Coin-flip display with `coinConfig`
- `PROPHECY`: Prophecy resolution with `prophecyConfig` (rangeDice vs resolutionDie)
- `SAVE`: Saving throw display
- `NONE`/`AUTOMATIC`: No roll

### Mechanics Systems

These class-specific mechanics render on the card:
- **Cards** (`mechanicsConfig.cards`): Draw count, suit effects
- **Combos** (`mechanicsConfig.combos`): Min cards, bonus multiplier
- **Coins** (`mechanicsConfig.coins`): Flip count, heads/tails effects
- **State Requirements** (`mechanicsConfig.stateRequirements`): Required states
- **Channeling Stages** (`channelingConfig.stages[]`): Progressive channeling with tick/formula/description

### Class-Specific Flat Fields

These are extracted by `classSpellGenerator.js` per-class processors and also preserved by the normalizer:
- **Pyrofiend**: `infernoRequired`, `infernoAscend`, `infernoDescend`
- **Martyr**: `devotionRequired`, `devotionCost`, `devotionGain`
- **Chronarch**: `timeShardGenerate`, `timeShardCost`, `temporalStrainGain`, `temporalStrainReduce`
- **Minstrel**: `musicalCombo`
- **Arcanoneer**: `sphereCost`

## The 30 Class Files

All files are in `D:\VTT\vtt-react\src\data\classes\`:

| # | File | Spells | Notes |
|---|------|--------|-------|
| 1 | arcanoneerData.js | ~90 | Sphere cost mechanics |
| 2 | augurData.js | ~48 | Augur subdirectory with augurSpells |
| 3 | berserkerData.js | ~78 | Rage/fury mechanics |
| 4 | bladedancerData.js | ~72 | Combo/strike chains |
| 5 | chaosWeaverData.js | ~26 | Chaos/entropy mechanics |
| 6 | chronarchData.js | ~52 | Time shards, temporal flux |
| 7 | covenbaneData.js | ~91 | Anti-magic, witch hunting |
| 8 | deathcallerData.js | ~56 | Death/necromancy |
| 9 | doomsayerData.js | ~52 | Prophecy mechanics, doom |
| 10 | dreadnaughtData.js | ~61 | Tank/defense |
| 11 | exorcistData.js | ~59 | Holy/purification |
| 12 | falseProphetData.js | ~46 | Deception, false miracles |
| 13 | fateWeaverData.js | ~30 | Fate manipulation, coin flips |
| 14 | formbenderData.js | ~101 | Shapeshifting, transformation |
| 15 | gamblerData.js | ~33 | Dice/cards/coins mechanics |
| 16 | huntressData.js | ~37 | Traps, ranged attacks |
| 17 | inscriptorData.js | ~61 | Rune magic, inscription |
| 18 | lichborneData.js | ~76 | Undead/lich mechanics |
| 19 | lunarchData.js | ~45 | Moon/lunar phases |
| 20 | martyrData.js | ~51 | Self-sacrifice, devotion |
| 21 | minstrelData.js | ~60 | Musical combos, buffs |
| 22 | oracleData.js | ~54 | Divination, prophecy |
| 23 | plaguebringerData.js | ~52 | Disease/plague, DoT |
| 24 | primalistData.js | ~82 | Shapeshifting, nature |
| 25 | pyrofiendData.js | ~46 | Inferno escalation, fire DoT |
| 26 | spellguardData.js | ~50 | Defensive magic, wards |
| 27 | titanData.js | ~1 (imports titanSpells.js with ~45) | Celestial devotion |
| 28 | toxicologistData.js | ~51 | Poisons, debuffs |
| 29 | wardenData.js | ~52 | Nature, barriers |
| 30 | witchDoctorData.js | ~65 | Voodoo, hexes |

**Note**: titanData.js imports spells from `titan/titanSpells.js`. Augur, berserker, doomsayer, plaguebringer, primalist, pyrofiend, spellguard, toxicologist, and warden also have subdirectories with additional files.

## Audit Process — Per Class

For each class file, do the following:

### Step 1: Read the Full File
Read the entire class data file (and any spell subdirectory files). Understand the class's mechanics and specializations.

### Step 2: For Each Spell, Check These Items

#### Required Fields Check
- [ ] `id`: unique, lowercase, underscores
- [ ] `name`: proper spell name
- [ ] `description`: flavorful AND mechanically accurate
- [ ] `level`: 1-9 integer
- [ ] `spellType`: UPPERCASE (`ACTION`, `CHANNELED`, `PASSIVE`, `REACTION`, `TRAP`, `STATE`)
- [ ] `icon`: valid icon path
- [ ] `typeConfig.school`: valid damage type ID (fire, frost, etc. — NOT D&D school names)
- [ ] `typeConfig.icon`: matches top-level `icon`
- [ ] `targetingConfig`: has `targetingType`, `rangeType`, `rangeDistance` (for ranged), `targetRestrictions`
- [ ] `resourceCost.actionPoints`: ALWAYS set (1-5)
- [ ] `cooldownConfig`: has `cooldownType` and `cooldownValue`
- [ ] `tags`: array of relevant tags

#### Description ↔ Data Alignment
- [ ] Every damage amount in description → `damageConfig.formula` or `healingConfig.formula`
- [ ] Every damage type mentioned → `damageTypes` array
- [ ] Every DoT/Hot mentioned → `dotConfig`/`hotConfig` with correct values
- [ ] Every buff/debuff effect mentioned → `buffConfig`/`debuffConfig` with effects
- [ ] Every control effect (stun, root, etc.) → `controlConfig`
- [ ] Every summon/transform → `summoningConfig`/`transformationConfig`
- [ ] Every duration mentioned → `durationConfig` with matching values
- [ ] Every range/Area mentioned → `targetingConfig` with matching values
- [ ] Every cooldown/recharge mentioned → `cooldownConfig` with matching values
- [ ] Every resource cost mentioned → `resourceCost` with matching values
- [ ] Every saving throw → `savingThrow` inside the effect config
- [ ] Every crit effect → `criticalConfig` with correct values
- [ ] Every chain/bounce/propagation → `propagation` with correct values
- [ ] Every trap mechanic → `trapConfig`
- [ ] Every channeling effect → `channelingConfig` with stages
- [ ] Every prophecy effect → `prophecyConfig` or `prophecyOptions`
- [ ] Every card/coin mechanic → `cardConfig`/`coinConfig` or `mechanicsConfig`
- [ ] Every status effect → `statusEffectsConfig`
- [ ] Class-specific resources (inferno, devotion, etc.) → `resourceCost.resourceValues` + flat fields

#### Effect Types Consistency
- [ ] Every type in `effectTypes` has a matching config (damage→damageConfig, etc.)
- [ ] Every config has its type in `effectTypes`
- [ ] `resolution` is set in each effect config or at top level (UPPERCASE)

#### Resource Cost Integrity
- [ ] Every non-PASSIVE spell costs at least one primary resource (mana, HP, or class-specific resource) — NEVER just AP with no resource
- [ ] `resourceCost.actionPoints` is ALWAYS set (0 for PASSIVE, 1–5 for everything else)
- [ ] `resourceCost` uses wizard format: `resourceTypes`, `resourceValues`, `actionPoints`, `components`
- [ ] Class-specific resource is present in `resourceCost.resourceValues` or as a flat top-level field (see table below)
- [ ] Mana cost is appropriate for spell level (roughly: L1=3–6, L2=5–10, L3=8–15, L4=12–18, L5=15–22, L6=18–26, L7=22–30, L8=26–35, L9=30–40, L10=35–45)
- [ ] PASSIVE spells may have `resourceValues: { mana: 0 }` but MUST still include `actionPoints: 0` and the class resource where applicable (e.g., `devotionRequired`, `infernoRequired`)
- [ ] No orphaned `uses` or `requirement` strings in resourceCost — use `cooldownConfig` and flat top-level fields instead

**Class Resource Table** — every spell in these classes MUST reference their class resource:

| Class | Resource | Where in Spell Data | Required Fields |
|---|---|---|---|
| Arcanoneer | Elemental Spheres | `resourceCost.resourceValues` | `arcane_energy_points` or sphere costs |
| Augur | Benediction / Malediction | Spell-level cost fields | Benediction/Malediction cost per spell |
| Berserker | Rage | `resourceCost.resourceValues` or flat fields | `rageCost`, `rageGain`, `rageRequired` |
| Bladedancer | Momentum / Flourish | `resourceCost.resourceValues` or flat fields | `momentumCost`, `momentumGain` |
| Chaos Weaver | Mayhem / Chaos Spheres | `resourceCost.resourceValues` | `chaos_sphere`, mayhem cost |
| Chronarch | Time Shards / Temporal Strain | `resourceCost.resourceValues` | `time_shards_generate`, `time_shards_cost`, `temporal_strain_gain`, `temporal_strain_reduce` |
| Covenbane | Hexbreaker Charges | `resourceCost.resourceValues` or flat fields | Hex charge cost/gain |
| Deathcaller | Blood Tokens / HP | `resourceCost.resourceValues` or flat fields | `bloodTokens`, HP cost (via `resourceValues.hp`) |
| Doomsayer | Havoc | `resourceCost.classResource` | `{ type: 'havoc', cost: N }` |
| Dreadnaught | Dark Resilience Points | `resourceCost.resourceValues` or flat fields | DRP cost/gain |
| Exorcist | Dominance Dice | `resourceCost.resourceValues` or flat fields | Dominance dice cost |
| False Prophet | Madness Points | `resourceCost.resourceValues` or flat fields | `madnessCost`, `madnessGain` |
| Fate Weaver | Threads of Destiny | `specialMechanics.threadsOfDestiny` | `threads_spend`, `threads_generate` |
| Formbender | Wild Instinct | `resourceCost.resourceValues` or flat fields | Wild Instinct cost/gain |
| Gambler | Fortune Points | `specialMechanics.fortunePoints` or `resourceCost` | Fortune Point cost/gain |
| Huntress | Quarry Marks | `resourceCost.resourceValues` or flat fields | Quarry Mark cost/gain |
| Inscriptor | Runic Resonance | `resourceCost.resourceValues` or flat fields | Resonance cost, rune cost |
| Lichborne | HP (Aura Mode) / Phylactery | `resourceCost.resourceValues` | `hp` cost in Aura mode, phylactery cost |
| Lunarch | Moon Phase | Flat fields or `resourceCost` | Phase requirement, mana to shift |
| Martyr | Devotion Gauge | Flat top-level props | `devotionRequired`, `devotionGain`, `devotionCost` |
| Minstrel | Musical Notes / Combos | `musicalCombo` or `specialMechanics` | `notes`, `cadenceName`, `cadenceNotes` |
| Oracle | Prophetic Visions | `resourceCost.resourceValues` or flat fields | Vision cost/gain |
| Plaguebringer | Virulence / Afflictions | `effectMechanicsConfigs` | Affliction application |
| Primalist | Totemic Synergy | `resourceCost.resourceValues` or flat fields | Synergy cost/gain |
| Pyrofiend | Inferno Veil | `resourceCost.resourceValues` | `inferno_ascend`, `inferno_descend`, `inferno_required` |
| Spellguard | Arcane Energy Points | `resourceCost.resourceValues` | AEP cost/gain |
| Titan | Celestial Devotion | Flat top-level field | `devotionRequired: 'Solara'` (or Lunara/Astraeus/Terranox/Zephyra) |
| Toxicologist | Toxin Vials / Contraption Parts | `resourceCost.resourceValues` or `effectMechanicsConfigs` | Vial cost, part cost |
| Warden | Vengeance Points | `resourceCost.resourceValues` or flat fields | VP cost/gain |
| Witch Doctor | Voodoo Essence | `resourceCost.resourceValues` or flat fields | Essence cost/gain |

**Valid resource cost examples:**
```javascript
// Standard mana + AP spell
resourceCost: {
  resourceTypes: ['mana'],
  resourceValues: { mana: 15 },
  actionPoints: 1,
  components: ['verbal', 'somatic']
}

// Mana + class resource (Pyrofiend)
resourceCost: {
  resourceTypes: ['mana', 'inferno_ascend'],
  resourceValues: { mana: 6, inferno_ascend: 1, inferno_required: 3 },
  actionPoints: 2,
  components: ['verbal']
}

// HP cost instead of mana (Lichborne Aura mode)
resourceCost: {
  resourceTypes: ['hp'],
  resourceValues: { hp: 10 },
  actionPoints: 1,
  components: ['somatic']
}

// Passive with devotion requirement (Titan)
resourceCost: {
  resourceTypes: ['mana'],
  resourceValues: { mana: 0 },
  actionPoints: 0,
  components: []
},
devotionRequired: 'Solara'

// Class resource via classResource shorthand (Doomsayer)
resourceCost: {
  actionPoints: 1,
  mana: 6,
  classResource: { type: 'havoc', cost: 3 }
}
```

**INVALID resource costs (flag and fix):**
```javascript
// WRONG: Only AP, no mana or class resource
resourceCost: { actionPoints: 2, components: ['verbal'] }

// WRONG: Empty resourceCost
resourceCost: { components: ['verbal'] }

// WRONG: Simple mana format without resourceTypes/resourceValues
resourceCost: { mana: 0, actionPoints: 2 }

// WRONG: Non-standard requirement field
resourceCost: { mana: 0, requirement: 'Devotion to Solara' }
// FIX: Use flat top-level field devotionRequired + wizard format resourceCost
```

#### Data Accuracy
- [ ] Formulas are valid dice notation (e.g., `3d6 + intelligence/3`)
- [ ] Numeric values are numbers, not strings
- [ ] `damageTypes` is ALWAYS an array
- [ ] Buff/debuff effects are objects (not strings)
- [ ] No `type`/`value` in cooldownConfig (use `cooldownType`/`cooldownValue`)
- [ ] No singular `damageType` as top-level spell property (only valid inside config objects)

### Step 3: Fix Issues Found

For each issue found, fix it directly in the class data file. Common fixes:

```javascript
// ADD missing effectType
effectTypes: ['damage', 'healing'],  // was missing 'healing' despite having healingConfig

// FIX singular damageType
damageTypes: ['fire'],  // was: damageType: 'fire'

// FIX missing resolution
damageConfig: { formula: '3d6', damageTypes: ['fire'], resolution: 'DICE' },

// FIX cooldownConfig keys
cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 },  // was: type/value

// FIX missing actionPoints
resourceCost: { actionPoints: 1, mana: 5 },  // was missing actionPoints

// ADD missing dotConfig if description mentions burning
dotConfig: { enabled: true, damagePerTick: '1d4', damageTypes: ['fire'], tickFrequency: 'round', duration: 3 }

// FIX description to match data (if data is correct but description is vague)
description: 'Hurl a bolt of fire dealing 3d6 fire damage. Target burns for 1d4 fire damage per round for 3 rounds.'
```

### Step 4: Report

After completing each class, report:
1. **Spells audited**: X/Y
2. **Issues found**: list each with spell name and what was wrong
3. **Issues fixed**: what you changed
4. **Issues requiring human judgment**: anything ambiguous (e.g., description is vague and could match multiple data interpretations)

## Critical Reference Files

- **`D:\VTT\docs\SPELL_DATA_REFERENCE.md`** — THE comprehensive reference (1,501 lines, 21 sections). Read Sections 1-7 first, then consult specific sections as needed.
- **`D:\VTT\vtt-react\src\components\spellcrafting-wizard\components\common\UnifiedSpellCard.jsx`** — The sole rendering engine (~14,240 lines). Search for specific field names to see how they render.
- **`D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\spellNormalizer.js`** — Normalization logic (~792 lines)
- **`D:\VTT\vtt-react\src\components\spellcrafting-wizard\core\utils\spellCardTransformer.js`** — Display defaults (~567 lines)
- **`D:\VTT\vtt-react\src\data\classSpellGenerator.js`** — Class-specific spell processing (~853 lines)

## Wizard Output Format Reference

The spell crafting wizard produces these exact data structures. When auditing class spells, compare against these formats — class spells should produce equivalent data that the card can render.

### damageConfig (Step 3: Effects → Damage)

```javascript
damageConfig: {
  damageType: 'direct',             // 'direct' | 'dot'
  elementType: 'fire',              // primary element from typeConfig.school
  secondaryElementType: null,       // optional secondary element
  formula: '2d6 + intelligence',    // DICE formula
  resolution: 'DICE',               // 'DICE' | 'CARDS' | 'COINS'

  // Card resolution sub-config (when resolution='CARDS')
  cardConfig: {
    drawCount: 3,                   // 1-10 cards drawn
    formula: 'CARD_VALUE + POKER_HAND_RANK * 3'
  },

  // Coin resolution sub-config (when resolution='COINS')
  coinConfig: {
    flipCount: 4,                   // 1-10 coins flipped
    formula: 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
  },

  // DoT sub-config (when hasDotEffect=true or damageType='dot')
  hasDotEffect: false,
  dotConfig: {
    duration: 3,                    // rounds of DoT
    tickFrequency: 'round',         // 'round' | 'turn'
    scalingType: 'flat',            // 'flat' | 'increasing' | 'decreasing'
    dotFormula: '1d4 + intelligence/2',
    progressiveStages: [],          // array of { round, formula, description }
    cardConfig: { drawCount, formula },  // nested for CARDS DoT
    coinConfig: { flipCount, formula }   // nested for COINS DoT
  },

  // Critical hit sub-config
  criticalConfig: {
    enabled: false,
    critType: 'dice',               // 'dice' | 'cards' | 'coins'
    critMultiplier: 2,
    critDiceOnly: false,            // true = multiply only dice, not modifiers
    extraDice: '',                  // e.g., '2d6' bonus crit dice
    explodingDice: false,
    explodingDiceType: 'reroll_add', // 'reroll_add' | 'double_value' | 'add_max'
    critEffects: [],                // additional effects on crit
    cardCritRule: 'face_cards',     // 'face_cards' | 'aces' | 'specific_suit'
    cardCritResolution: 'draw_add', // 'draw_add' | 'multiply_value' | 'double_damage'
    extraCardDraw: 2,
    coinCritRule: 'all_heads',      // 'all_heads' | 'sequence' | 'pattern'
    coinCritResolution: 'flip_add',
    extraCoinFlips: 3,
    spellEffect: null,              // linked spell from library
    critOnlyEffect: false,
    useRollableTable: false
  },

  // Chance-on-hit (proc) sub-config
  chanceOnHitConfig: {
    enabled: false,
    procType: 'dice',               // 'dice' | 'cards' | 'coins'
    procChance: 15,                 // percentage
    diceThreshold: 18,              // d20 threshold for dice procs
    cardProcRule: 'face_cards',     // 'face_cards' | 'aces' | 'specific_suit' | 'pairs' | 'red_cards' | 'black_cards'
    coinProcRule: 'all_heads',      // 'all_heads' | 'sequence' | 'pattern'
    coinCount: 3,
    procSuit: 'hearts',
    spellEffect: null,              // linked spell from library
    customEffects: [],
    useRollableTable: false
  },

  // Saving throw sub-config
  savingThrow: {                    // null if no save
    enabled: true,
    savingThrowType: 'agility',     // 'strength' | 'agility' | 'constitution' | 'intelligence' | 'spirit' | 'charisma'
    difficultyClass: 15,
    partialEffect: false,
    partialEffectFormula: 'damage/2',
    directDamageFormula: 'damage/2',
    dotDamageFormula: 'dot_damage/2'
  }
}
```

### healingConfig (Step 3: Effects → Healing)

```javascript
healingConfig: {
  healingType: 'direct',            // 'direct' | 'hot' | 'regeneration' | 'vampiric' | 'conditional'
  resolution: 'DICE',               // 'DICE' | 'CARDS' | 'COINS'
  formula: '1d8 + spirit',

  // Heal-over-time sub-config (when hasHotEffect=true)
  hasHotEffect: false,
  hotFormula: '1d4 + spirit/2',
  hotDuration: 3,
  hotTickType: 'round',
  hotApplication: 'start',          // 'start' | 'end'
  hotScalingType: 'flat',           // 'flat' | 'increasing' | 'decreasing' | 'frontloaded' | 'backloaded'
  hotTriggerType: 'periodic',       // 'periodic' | 'trigger' | 'channeled'
  isProgressiveHot: false,
  hotProgressiveStages: [],

  // Shield sub-config (when hasShieldEffect=true)
  hasShieldEffect: false,
  shieldFormula: '2d6 + spirit',
  shieldDuration: 3,
  shieldDamageTypes: 'all',         // 'all' | 'physical' | 'magical' | specific type
  shieldOverflow: 'dissipate',      // 'dissipate' | 'convert_to_healing'
  shieldBreakBehavior: 'fade',      // 'fade' | 'shatter'
  shieldBreakEffect: null,          // linked spell on shield break
  shieldExpireEffect: null,         // linked spell on shield expire

  // Critical and proc sub-configs (same structure as damageConfig)
  criticalConfig: { /* same as damageConfig.criticalConfig */ },
  chanceOnHitConfig: { /* same as damageConfig.chanceOnHitConfig */ }
}
```

### buffConfig (Step 3: Effects → Buff)

```javascript
buffConfig: {
  buffType: 'statEnhancement',      // 'statEnhancement' | 'damageIncrease' | 'damageMitigation' |
                                     // 'statusEffectBuff' | 'combatAdvantage' | 'auraEffect' |
                                     // 'movementBuff' | 'triggeredEffect' | 'custom'
  effects: [
    {
      id: 'str_boost',
      name: 'Strength Boost',
      description: '+2 Strength for 3 rounds',
      mechanicsText: '',
      statModifier: {
        stat: 'strength',           // stat name
        magnitude: 2,
        magnitudeType: 'flat'       // 'flat' | 'percentage'
      }
    }
  ],
  statModifiers: [],                 // alternative/additional stat modifiers
  statusEffects: [],                 // status effects applied with buff
  durationValue: 1,
  durationType: 'rounds',
  durationUnit: 'rounds',
  restType: 'short',
  canBeDispelled: true,
  concentrationRequired: false,
  stackingRule: 'replace',           // 'replace' | 'stack' | 'refresh'
  maxStacks: 1,
  magnitude: 2,
  magnitudeType: 'flat',
  isProgressive: false,
  progressiveStages: []              // array of { threshold, effects, description }
}
```

### debuffConfig (Step 3: Effects → Debuff)

```javascript
debuffConfig: {
  debuffType: 'statusEffect',        // 'statPenalty' | 'statusEffect' | 'damageOverTime' |
                                      // 'movementImpairment' | 'fullControl' | 'curse' | 'mentalEffect'
  effects: [
    {
      id: 'slowed',
      name: 'Slowed',
      description: 'Movement speed reduced by 15 feet',
      mechanicsText: '',
      statPenalty: {
        stat: 'movement_speed',
        magnitude: -15,
        magnitudeType: 'flat'
      }
    }
  ],
  statPenalties: [],
  statusEffects: [],
  durationValue: 1,
  durationType: 'rounds',
  durationUnit: 'rounds',
  restType: 'short',
  canBeDispelled: true,
  concentrationRequired: false,
  stackingRule: 'replace',
  maxStacks: 1,
  magnitude: 2,
  magnitudeType: 'flat',
  isProgressive: false,
  progressiveStages: [],
  difficultyClass: 15,
  savingThrow: 'constitution',       // ability name for save
  saveOutcome: 'negates'             // 'negates' | 'half_damage' | 'no_effect' | 'reduced_duration'
}
```

### controlConfig (Step 3: Effects → Control)

```javascript
controlConfig: {
  controlType: 'incapacitation',     // 'forcedMovement' | 'illusion' | 'mind_control' |
                                      // 'zone' | 'incapacitation' | 'battlefield_control' | 'restraint'
  effects: [
    {
      id: 'stun',
      controlType: 'incapacitation',
      name: 'Stunned',
      icon: 'icon/path',
      description: 'Cannot act for 1 round',
      config: {
        duration: 1,                 // null = inherit from global
        durationUnit: 'rounds',
        strength: 'moderate',        // 'light' | 'moderate' | 'strong'
        savingThrow: null,
        savingThrowType: 'constitution',
        difficultyClass: 15,
        customName: 'Stunned',
        customDescription: 'Cannot act for 1 round',
        statModifiers: [],
        // Type-specific fields:
        // forced_movement: distance, movementType, movementFlavor
        // restraint: restraintType
        // mind_control: controlLevel, mentalApproach
        // battlefield_control: areaSize, areaShape
        // incapacitation: durationType, recoveryMethod
      }
    }
  ],
  duration: null,
  durationUnit: 'rounds',
  savingThrow: null,
  savingThrowType: 'strength',
  difficultyClass: 15,
  concentration: false,
  distance: 10                       // for forced movement
}
```

### utilityConfig (Step 3: Effects → Utility)

```javascript
utilityConfig: {
  utilityType: 'enhancement',        // 'movement' | 'protection' | 'fate_manipulation' | 'enhancement' | 'detection' | 'creation'
  duration: 3,
  durationUnit: 'minutes',
  concentration: false,
  selectedEffects: [
    {
      id: 'teleport',
      name: 'Teleport',
      description: 'Teleport up to 30 feet',
      customName: 'Teleport',
      customDescription: '',
      potency: 'moderate',
      statModifiers: [],
      icon: 'icon/path'
    }
  ]
}
```

### summoningConfig (Step 3: Effects → Summoning)

```javascript
summoningConfig: {
  creatures: [
    {
      quantity: 1,
      duration: 10,
      durationUnit: 'minutes',
      hasDuration: true,
      concentration: false,
      controlType: 'verbal',          // 'verbal' | 'mental' | 'bound'
      controlRange: 60,
      attachedEffects: {}             // effects attached to summoned creature
    }
  ],
  duration: 10,
  durationUnit: 'minutes',
  hasDuration: true,
  concentration: true,
  quantity: 1,
  maxQuantity: 4,
  controlRange: 60,
  controlType: 'verbal',
  difficultyLevel: 'easy',
  waitForTrigger: false
}
```

### transformationConfig (Step 3: Effects → Transformation)

```javascript
transformationConfig: {
  transformType: 'beast_form',        // 'beast_form' | 'elemental' | 'celestial' | 'divine' | etc.
  formId: null,                       // linked form ID
  targetType: 'self',
  duration: 10,
  durationUnit: 'minutes',
  concentration: true,
  maintainEquipment: false,
  difficultyClass: 15,
  difficultyCr: 'moderate',
  saveType: 'spirit',
  grantedAbilities: [],
  formula: '1d6',
  isCustom: false
}
```

### purificationConfig (Step 3: Effects → Purification)

```javascript
purificationConfig: {
  purificationType: 'dispel',         // 'dispel' | 'cleanse' | 'exorcise' | 'resurrection' | 'sanctify'
  duration: 'instant',
  durationUnit: 'instant',
  difficultyClass: 15,
  abilitySave: 'spi',
  difficulty: 'moderate',
  selectedEffects: [
    {
      id: 'remove_curse',
      name: 'Remove Curse',
      icon: 'icon/path',
      description: 'Removes curse effects',
      customDuration: 60,
      customEffects: 1,
      purificationType: 'dispel',
      specificEffectTypes: []
    }
  ],
  resolution: 'DICE',
  resurrectionFormula: '2d8 + SPI'
}
```

### restorationConfig (Step 3: Effects → Restoration)

```javascript
restorationConfig: {
  resourceType: 'mana',               // 'mana' | 'health' | 'action_points' | class resource types
  resolution: 'DICE',
  formula: '1d8 + INT',
  duration: 'instant',
  tickFrequency: 'round',
  application: 'start',
  scalingType: 'flat',
  isOverTime: false,
  overTimeFormula: '1d4 + INT/2',
  overTimeDuration: 3,
  overTimeTriggerType: 'periodic',    // 'periodic' | 'trigger'
  isProgressiveOverTime: false,
  overTimeProgressiveStages: []
}
```

### mechanicsConfig / effectMechanicsConfigs (Mechanics Step)

Per-effect mechanics (keyed by `effect_damage`, `effect_healing`, etc.):

```javascript
effectMechanicsConfigs: {
  effect_damage: {
    enabled: false,
    system: 'COMBO_POINTS',           // 'COMBO_POINTS' | 'PROC_SYSTEM' | 'STATE_REQUIREMENTS' |
                                       // 'FORM_SYSTEM' | 'TOXIC_SYSTEM' | 'CHORD_SYSTEM' | 'PROPHECY_SYSTEM'
    type: 'builder',                  // varies by system
    thresholdValue: 1,

    comboOptions: {
      generationMethod: 'sinister_strike',
      consumptionRule: 'all',
      visualStyle: 'points'
    },
    procOptions: {
      procType: 'critical_strike',
      procChance: 15,
      effectType: 'damage',
      triggerLimit: 1,
      spellId: null
    },
    stateOptions: {
      resourceType: 'health',
      thresholdValue: 20,
      thresholdType: 'below',
      valueType: 'percentage',
      modifiedFormula: ''
    },
    formOptions: {
      formType: 'bear_form',
      requiresForm: false,
      bonusType: 'damage',
      bonusAmount: 20,
      formSpellId: null
    },
    toxicOptions: {
      selectedToxicTypes: {},
      duration: 3,
      durationType: 'rounds',
      consumptionRule: 'all',
      modifiedFormula: ''
    },
    chordOptions: {
      chordFunction: 'tonic',
      isWildcard: false,
      extendDuration: 0,
      recipe: '',
      improvisationWindow: 2,
      graduatedEffects: {},
      partialMatchType: 'count'
    },
    prophecyOptions: {
      rangeDice: 'd8+d6',
      resolutionDie: 'd6',
      prophesiedHavoc: 3,
      baseHavoc: 1,
      outsideBacklash: '1d6 necrotic to self',
      outsideHavoc: 0
    }
  }
}
```

Global mechanics (top-level `mechanicsConfig`):

```javascript
mechanicsConfig: {
  cards: { generatesCards: true, requiredCards: 3, cardTypes: ['major'], consumeCards: true },
  combos: { type: 'generator', points: 1, scaling: {} },
  coins: { flipCount: 5, effectOnHeads: '', effectOnTails: '' },
  stateRequirements: [],
  stateOptions: { thresholds: [] }
}
```

### rollableTable (Rollable Table Step)

```javascript
rollableTable: {
  enabled: false,
  name: '',
  description: '',
  resolutionType: 'DICE',             // 'DICE' | 'CARDS' | 'COINS'
  resolutionConfig: {
    diceType: 'd100',                  // for DICE
    cardCount: 3,                      // for CARDS
    coinCount: 5                       // for COINS
  },
  entries: [
    {
      id: 'entry_1',
      range: { min: 1, max: 20 },     // DICE: dice range
      customName: 'Minor Effect',
      effect: '1d8 force damage',
      modifiesBaseSpell: false,
      spellReference: null,
      effectModifications: {},
      formulaOverrides: {}
    }
  ]
}
```

### prophecyOptions (Prophecy Step)

```javascript
prophecyOptions: {
  rangeDice: 'd8+d6',
  resolutionDie: 'd6',
  prophesied: {
    damage: '', effectName: '', duration: 0, durationUnit: 'rounds',
    damagePerRound: '', damagePerRoundType: '',
    statModifiers: [],
    healingBlock: false,
    bonusDamageTaken: '', bonusDamageType: '',
    saveDC: 0, saveType: 'Constitution',
    instantKill: false, instantKillThreshold: 0,
    cascadeDamage: '', cascadeRange: 0,
    description: '',
    havocGain: 3
  },
  base: {
    // same fields as prophesied, havocGain: 1
  },
  outside: {
    // same fields as prophesied, havocGain: 0,
    backlash: '1d6 necrotic to self'
  }
}
```

### channelingConfig (Channeling Step — CHANNELED only)

```javascript
channelingConfig: {
  type: 'power_up',                   // 'power_up' | 'area_expand' | 'defensive'
  maxDuration: 4,
  durationUnit: 'turns',
  interruptible: true,
  movementAllowed: false,
  costValue: 5,                       // resource cost per tick
  costType: 'mana',                   // 'mana' | 'rage' | 'energy' | 'focus' | 'health'
  costTrigger: 'per_turn',            // 'per_turn' | 'per_round' | 'atStart' | 'atEnd'

  perRoundFormulas: {
    dot_damage: [
      { round: 1, formula: '2d6', description: 'Round 1' },
      { round: 2, formula: '3d6', description: 'Round 2' }
    ]
  },

  // Area expand sub-config (type='area_expand')
  initialRadius: 5,
  maxRadius: 30,
  expansionRate: 5,
  expansionType: 'linear',

  // Defensive sub-config (type='defensive')
  damageReduction: 10,
  maxDamageReduction: 50,
  resistanceType: 'physical',

  // Persistent sub-config
  persistentEffectType: 'aura',
  persistentRadius: 10,
  persistentDescription: '',
  fromTargeting: true,

  stages: [
    { threshold: 1, effect: 'Damage', description: 'Base damage' },
    { threshold: 2, effect: 'Stun', description: 'Adds stun' },
    { threshold: 3, effect: 'Dispel', description: 'Adds dispel' }
  ]
}
```

### triggerConfig (Triggers Step)

```javascript
triggerConfig: {
  global: {
    logicType: 'AND',                 // 'AND' | 'OR'
    compoundTriggers: []              // array of compoundTrigger objects
  },
  effectTriggers: {
    damage: { logicType: 'AND', compoundTriggers: [] }
  },
  conditionalEffects: {
    damage: {
      isConditional: true,
      defaultEnabled: false,
      conditionalFormulas: {
        'health_below_30': '2d6 + INT',
        'default': '1d6 + INT/2'
      }
    }
  },
  buffDebuffTriggers: {
    buff: { triggers: [], triggersEffect: 'restoration' }
  },
  requiredConditions: {
    enabled: false,
    logicType: 'AND',
    conditions: []
  },
  triggerRole: { mode: 'CONDITIONAL' },

  // Legacy format (used by class spells):
  triggers: [
    {
      id: 'escalation_tick',
      name: 'Doom Escalation',
      triggerType: 'start_of_turn',
      action: 'Increase bonus damage by 1d6'
    }
  ]
}
```

---

## Card Rendering Pitfalls (MUST CHECK)

These are real bugs found during auditing. They are caused by mismatches between how data is written and how the normalizer/card actually reads it.

### Pitfall 1: `school` must match actual damage types

The normalizer (`spellNormalizer.js` line 250) reads `typeConfig.school` as the **primary** damage type and **stops there** — it never reaches `damageConfig.damageTypes` if `typeConfig.school` is already set. So if a spell deals fire + necrotic damage but has `school: 'force'`, the card will only show a force badge.

**Rule**: `typeConfig.school` MUST be the spell's primary damage type. NEVER use `'force'` as a generic placeholder unless the spell actually deals force damage.

```javascript
// WRONG — spell deals fire + necrotic but school says force
typeConfig: { school: 'force' }
damageConfig: { damageTypes: ['fire', 'necrotic'] }
// Card shows: only "force" badge

// CORRECT
typeConfig: { school: 'fire', secondaryElement: 'necrotic' }
damageConfig: { damageTypes: ['fire', 'necrotic'] }
// Card shows: fire + necrotic badges
```

### Pitfall 2: Dual-damage-type spells need `secondaryElement`

For spells with TWO damage types, you MUST set `typeConfig.secondaryElement` to the second type. Without it, the second type is invisible to the card.

```javascript
typeConfig: {
  school: 'fire',
  secondaryElement: 'necrotic',  // REQUIRED for dual-type
  icon: 'Fire/Fire Storm'
}
```

### Pitfall 3: Prophecy DoT effects must use `damagePerRound`

The `ProphecySummary` component (line 98) reads `prophesied.effect.damagePerRound` to render DoT. It does NOT read `dotFormula`.

```javascript
// WRONG — ProphecySummary ignores this
prophesied: {
  effect: { name: 'Ignited', dotFormula: '2d6', duration: 3 }
}

// CORRECT — ProphecySummary renders "2d6 per round"
prophesied: {
  effect: { name: 'Ignited', damagePerRound: '2d6 fire', duration: 3, unit: 'rounds' }
}
```

### Pitfall 4: Never use `formula: 'SPECIAL'`

The card renders `formula` as literal text. `'SPECIAL'` displays as "SPECIAL necrotic damage" — confusing and useless. Use descriptive notation with `conditionalEffects`:

```javascript
// CORRECT
damageConfig: { formula: '2d8 × active_prophecies', damageTypes: ['necrotic'], resolution: 'AUTOMATIC' }
```

### Pitfall 5: Prophecy descriptions must have actual numbers

Descriptions like `"Deals massive dual damage"` are useless on a spell card. Every prophecy outcome description must include exact formulas:

```javascript
// WRONG
prophesied: { description: 'Deals massive dual damage and burns enemies.' }

// CORRECT
prophesied: { description: 'Deals 6d8 fire + 6d8 necrotic damage and ignites all enemies for 2d6 fire damage per round for 3 rounds.' }
```

---

## Important Context

- The pipeline was audited and fixed: ALL fields survive the normalizer → transformer → card pipeline (115/115 top-level keys, 35/35 critical fields verified)
- Two dead formatting engines were deleted. UnifiedSpellCard.jsx is the SOLE renderer.
- The normalizer handles legacy format conversion automatically (damageType→damageTypes, cooldownConfig key renames, resolution defaults, etc.)
- However, the normalizer cannot fix WRONG values — only structural issues. If a spell says "3d6" in description but has `formula: '2d6'` in data, the normalizer won't catch that. That's what this audit is for.
- Class spells use legacy `triggers[]` array format; wizard creates `compoundTriggers[]` format — both are accepted by the card
- Some classes have subdirectories with additional spell files (e.g., `titan/titanSpells.js`, `augur/augurSpells.js`). Always check for these.
- **Work one class at a time.** Don't try to batch fixes across files. Complete each class fully before moving to the next.

## Suggested Order

Start with simpler/smaller classes first to calibrate your judgment, then tackle larger ones:

1. titanData.js (1 spell in main file, ~45 in subdirectory)
2. gamblerData.js (~33 spells)
3. chaosWeaverData.js (~26 spells)
4. fateWeaverData.js (~30 spells)
5. huntressData.js (~37 spells)
6. falseProphetData.js (~46 spells)
7. pyrofiendData.js (~46 spells)
8. lunarchData.js (~45 spells)
9. augurData.js (~48 spells)
10. (continue with remaining 20 classes in any order)

## Example Audit Entry

```
SPELL: pyro_ember_spark (Ember Spark) — pyrofiendData.js

✅ id: pyro_ember_spark
✅ name: Ember Spark
✅ description: "Launch a malevolent spark..." — mentions 1d6 fire damage + 1d4/round DoT for 2 rounds
✅ level: 1, spellType: ACTION, icon: valid
✅ typeConfig.school: 'fire' ✓
✅ targetingConfig: single, ranged, 60ft ✓
✅ resourceCost.actionPoints: 2 ✓ (note: 2 AP, not 1 — this is intentional for this class)
✅ cooldownConfig: cooldownType: 'turn_based', cooldownValue: 0 ✓
✅ effectTypes: ['damage'] — matches damageConfig ✓
✅ damageConfig.formula: '1d6' — matches description ✓
✅ damageConfig.damageTypes: ['fire'] — array ✓
✅ damageConfig.resolution: 'DICE' ✓
✅ damageConfig.dotConfig: enabled, 1d4/tick, fire, round, 2 rounds — matches "1d4 per round for 2 rounds" in description ✓
✅ durationConfig: 2 rounds — matches DoT duration ✓
✅ tags: ['fire', 'damage', 'dot', 'starter'] ✓

RESULT: PASS — No issues found.
```

```
SPELL: pyro_smoldering_touch (Smoldering Touch) — pyrofiendData.js

⚠️ description mentions "lingering smolder that burns intensely" but no duration specified in description
✅ dotConfig exists with duration: 2 — but description doesn't specify duration
🔧 FIX: Updated description to "leaving a lingering smolder that burns for 2 rounds dealing 1d4 fire damage per round."

RESULT: FIXED — Description updated to match data.
```
