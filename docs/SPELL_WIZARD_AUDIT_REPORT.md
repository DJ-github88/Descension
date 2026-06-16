# Spellcrafting Wizard Comprehensive Audit Report

> Generated from a thorough analysis of every component, data file, and utility
> connected to the spell wizard, cross-referenced against `SPELL_DATA_REFERENCE.md`.

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [The Naming Mismatch Problem (Root Cause)](#2-the-naming-mismatch-problem-root-cause)
3. [CRITICAL Bugs (Data Loss & Crashes)](#3-critical-bugs-data-loss--crashes)
4. [Spec Violations by Component](#4-spec-violations-by-component)
5. [Damage Type Taxonomy Conflict](#5-damage-type-taxonomy-conflict)
6. [UnifiedSpellCard Renderer Issues](#6-unifiedspellcard-renderer-issues)
7. [Rendering Pipeline Issues](#7-rendering-pipeline-issues)
8. [Data File Mismatches](#8-data-file-mismatches)
9. [Dead Code & Technical Debt](#9-dead-code--technical-debt)
10. [Prioritized Fix List](#10-prioritized-fix-list)

---

## 1. System Architecture Overview

```
SpellWizardWrapper.jsx (providers + window event bridge)
  └─ SpellwizardApp.jsx (orchestrator, 1342 lines)
       ├─ spellWizardContext.js (state, 1484 lines, ~70 action types)
       │    └─ Steps: Step1 → Step2 → Step3 → Step4 → Step5 → Step6 →
       │             Step7Triggers → Step7Mechanics → Step8Channeling → Step9Balance
       ├─ SpellLibraryContext.js (localStorage persistence, 530 lines)
       └─ ExternalLivePreview.jsx (live preview, duplicates Step10Review logic)

Rendering Pipeline:
  Any spell ──► UnifiedSpellCard.jsx (14,723 lines)
                    └─ normalizeSpell() [spellNormalizer.js, 818 lines]
                         └─ reads every field with defensive fallbacks

Secondary transformers (NOT in main render path):
  - spellCardTransformer.js (579 lines) — used by SampleSpellsLoader, SpellLibraryPopup
  - spellTransformers.js (259 lines) — LEGACY duplicate, used by creature-wizard only
  - spellSerializer.js (932 lines) — used by Step10Review (orphaned), targets OLD schema
```

**Key insight:** There is no single "save → render" contract. The wizard writes one shape,
the normalizer tries to fix it, the renderer reads with fallbacks, and the serializer reads
a completely different schema. This is why so many bugs exist.

---

## 2. The Naming Mismatch Problem (Root Cause)

The single most damaging issue: **state field names don't match spec/serializer names.**

| Wizard State Field | Spec / Serializer Field | Impact |
|---|---|---|
| `summonConfig` | `summoningConfig` | Save reads wrong field → **data lost** |
| `transformConfig` | `transformationConfig` | Save reads wrong field → **data lost** |

**Location:** `spellWizardContext.js:124-125` (state) vs `SpellwizardApp.jsx:295-296` (save).

This mismatch propagates:
- `UPDATE_SUMMONING_CONFIG` / `UPDATE_TRANSFORMATION_CONFIG` action types are declared but **never handled** by the reducer (dead code that throws if dispatched)
- Action creators `updateSummoningConfig` actually dispatch `UPDATE_SUMMON_CONFIG` (without "-ing")
- `REMOVE_EFFECT_TYPE` matches `'summoning'`/`'transformation'` but the rest of the code uses `'summon'`/`'transform'`
- `Step7Mechanics.jsx:104,115` reads `state.summonConfig`/`state.transformConfig` while `Step3Effects` writes `summoningConfig`/`transformationConfig`
- `SpellwizardApp.jsx` default `cooldownConfig` and `resourceCost` use forbidden patterns

---

## 3. CRITICAL Bugs (Data Loss & Crashes)

### 3.1 Silent Data Loss on Save (HIGHEST PRIORITY)
**File:** `SpellwizardApp.jsx:295-296`
```javascript
summoningConfig: wizardState.summoningConfig || null,        // always null
transformationConfig: wizardState.transformationConfig || null, // always null
```
Wizard state uses `summonConfig` and `transformConfig`. Every saved spell loses its
summoning and transformation configuration.

### 3.2 Renderer Drops Effect Sections (Branch 1 Bug)
**File:** `UnifiedSpellCard.jsx:9180`
When `hasEffectsToWrap` is true (spell has global triggers AND damage/healing), the
renderer enters Branch 1 which only renders damage, healing, and mechanics. **All of these
are silently skipped:** buff, debuff, utility, control, summoning, transformation,
purification, restoration, status effects, rollable tables, and prophecy.

### 3.3 Crash: `.push()` on String
**File:** `spellTransformers.js:103` — `.push()` on string `damageTypes` causes TypeError
for any spell with `damageTypes: 'fire'` (string instead of array).

### 3.4 Crash: Null Property Access
**File:** `spellNormalizer.js:550` — accesses `.statModifier.stat` without `?.`, throws if
any buff effect has `statModifier: null`.

### 3.5 Damage Step Permanently Blocks Advancement
**File:** `Step3Effects.jsx:313-318` — `isEffectConfigured('damage')` checks
`damageConfig.primaryElement`, but `initializeConfigurations('damage')` sets `elementType`.
Damage effects always validate as false, permanently disabling the Next button.

### 3.6 Hardcoded Step Indices (Wrong Validation)
- `Step6Cooldown.jsx:11-12` hardcodes step `5` but actual step is `6`
- `Step7Triggers.jsx:123-124` hardcodes step `6` but actual step is `'triggers'`

Both produce incorrect `isCompleted`/`isActive` values.

### 3.7 Channeling Config Temporal Dead Zone
**File:** `Step8Channeling.jsx:161,405,477` — `initializePerRoundFormulas()` references
`channelingConfig` inside `useState` initializer before it's defined.

### 3.8 UnifiedSpellCard Encoding Corruption (Mojibake)
**File:** `UnifiedSpellCard.jsx` — ~60 lines have corrupted Unicode characters:
- Suit symbols (hearts/diamonds/clubs/spades) are empty at lines 8678-8701
- `≤` corrupted to `=` in ~9 trigger-condition tags (visible bug)
- `◆` diamond corrupted to `?` in ~12 locations
- `×` corrupted to `�` in ~5 locations
- Musical clef glyphs corrupted to `??`

### 3.9 Duplicate Object Keys (Real Bugs)
- `resourceTypes.js:299-302` — `havoc` resource has `affectedBy`/`formula` declared twice
- `statModifier.js:254&272` — `damage_reduction` defined twice
- `formulaVariables.js:183&186` — `STRAIGHT` defined twice (different examples)
- `formulaVariables.js:184&193` — `ROYAL_FLUSH` defined twice
- `formulaVariables.js:203&207` — `CONSECUTIVE_HEADS` defined twice
- `triggerIcons.js:92&113` — `timer` key collision with **different** values (trap timer overwritten)

### 3.10 Logic Bugs
- `extractDamageTypeFromResistanceName` (`UnifiedSpellCard.jsx:596`) maps `arcane` → `storm` (copy-paste bug)
- `durationTypes.js:82-101` — `calculateDurationTime` missing `turns` case
- `healingTypes.js:525` — `Math.floor` precedence error in `calculateDirectHealing`
- `debuffTypes.js:1025-1028` — `calculateDiminishedValue` returns 0 for first stack
- `cooldownTypes.js:432-435` — redundant `isValidDiceNotation(baseValue) ? isValidDiceNotation(baseValue) : baseValue`

---

## 4. Spec Violations by Component

### Rule 1: effectTypes must match configs
- **Step3Effects** does not enforce reverse (effectType with no config)

### Rule 2: damageTypes is ALWAYS an array
- **Step3Effects / DamageEffects.jsx** writes `elementType`/`secondaryElementType` (singular strings)
- **spellCardTransformer.js:175-186** reads `damageConfig.elementType` (non-spec)

### Rule 3: school in typeConfig using damage type IDs
- **spellWizardContext.js:109** — top-level `school: ''` field (spec forbids)
- **Step1BasicInfo.jsx:23-33** — uses `ember, rime, storm, primal, blight, wyrd, divine` instead of spec IDs
- **spellCardTransformer.js:188-192** — unconditionally pushes `typeConfig.school` into `damageTypes` even for non-damage spells

### Rule 4: actionPoints is ALWAYS set
- **Step5Resources.jsx:423-431** — only sets actionPoints if user explicitly selects it
- **SpellwizardApp.jsx:276-282** — default resourceCost omits actionPoints
- **spellCardTransformer.js:305** — defaults actionPoints to 0 (should be 1)
- **spellTransformers.js:124** — same, defaults to 0

### Rule 5: resolution goes INSIDE the effect config
- **spellCardTransformer.js** sets resolution at top-level only, not inside damageConfig/healingConfig

### Rule 6: cooldownConfig uses {cooldownType, cooldownValue}
- **Step6Cooldown.jsx:16-20,140-162** — writes `{type, value, charges, recovery}`
- **SpellwizardApp.jsx:284-287** — default uses `{cooldown, charges}`
- **spellCardTransformer.js:317-326** — default uses `{type, value}`
- **spellNormalizer.js:129** — default uses `{cooldown, charges}` (third pattern!)
- **spellNormalizer.js:812** — `createEmptySpell()` correctly uses `{cooldownType, cooldownValue}` (inconsistent with line 129)

### Rule 7: Buff/Debuff effects use objects
- **BuffEffects.jsx:414-415** writes `statModifiers[]` + `statusEffects[]` instead of spec's `effects[]`
- **DebuffEffects.jsx** writes `statPenalties[]` + `statusEffects[]` instead of `effects[]`
- **BuffEffects.jsx** never sets `buffType` (spec requires it)
- **DebuffEffects.jsx** never sets `debuffType`

---

## 5. Damage Type Taxonomy Conflict

**The codebase has TWO conflicting damage type systems:**

| Source | IDs Used |
|---|---|
| `damageTypes.js` (NEW) | `physical, ember, rime, storm, arcane, primal, blight, wyrd, healing` |
| `SPELL_DATA_REFERENCE.md` (SPEC) | `fire, frost, lightning, arcane, nature, force, necrotic, radiant, poison, psychic, chaos, void, bludgeoning, piercing, slashing, physical, holy, shadow, cold, ice, thunder, acid` |
| `statModifier.js` (OLD) | `fire, frost, lightning, nature, force, necrotic, radiant, poison, psychic, chaos, void` (spell_power keys) |

**Consequence:** A spell with `school: 'ember'` (from wizard) won't find `ember_spell_power`
in statModifier.js (which only has `fire_spell_power`). A spell with `school: 'fire'` (per
spec) will be silently rewritten by `spellNormalizer.js` LEGACY_DAMAGE_TYPE_MAP.

The `LEGACY_DAMAGE_TYPE_MAP` in `spellNormalizer.js:22-25` makes this worse:
```
cold → rime, ice → rime, shadow → blight, holy → ember,
acid → blight, thunder → storm, viscera → primal, electric → storm
```
These rewrites silently change spec-valid IDs into new IDs with no warning.

**Resolution needed:** Decide on ONE canonical taxonomy and update ALL files.

---

## 6. UnifiedSpellCard Renderer Issues

**File size:** 14,723 lines (docs say ~5,700 — stale).
**Paren balance:** 5972 open / 5971 close (docs say 5730/5729 — stale).

### Structural Bugs
- **Branch 1 drops most effect types** (see §3.2) — entire effect list is duplicated across two branches
- **`propTypes` missing `rules` variant** — referenced ~10× in body but absent from enum (line 14703)
- **`const` declarations inside unbraced `switch` cases** — lines 1660, 1765, 1810, 1824

### Resistance Mapping Inverted
Lines 11840-11867: Debuff resistance penalties map magnitude 0 → 'immune', which means
"no penalty" reads as "target is immune" — misleading.

### Hard-coded Magic Strings
Choice-config path (line 12449) and chance-on-hit branches embed hard-coded percentages
("23%", "8%", "25%") instead of computing from config.

### Stale Spec
The spec says `triggerRole{}` and `channelingConfig.stages[]` are NOT rendered, but the
code DOES render them. Spec needs updating.

---

## 7. Rendering Pipeline Issues

### Three Transformers, No Consistency
| File | actionPoints default | cooldownConfig default | damageTypes default | buff/debuff conversion |
|---|---|---|---|---|
| `spellNormalizer.js` | `1` ✓ | `{cooldown, charges}` ✗ | `['arcane']` | Yes ✓ |
| `spellCardTransformer.js` | `0` ✗ | `{type, value}` ✗ | pushes school always ✗ | No ✗ |
| `spellTransformers.js` | `0` ✗ | `{type, value}` ✗ | crashes on string ✗ | No ✗ |

**Recommendation:** Consolidate to ONE transformer. Delete `spellTransformers.js`.
Update `creature-wizard/` imports to use `spellCardTransformer.js` or `spellNormalizer.js`.

### spellSerializer.js Targets Wrong Schema
Uses `diceNotation` (spec: `formula`), `useCriticalEffect` (spec: `criticalConfig.enabled`),
`useChainEffect`/`chainConfig` (spec: `propagation`), `useAbsorptionShield` (spec: `shieldConfig`),
`statModifiers` as object map (spec: array). Produces wrong output for any normalized spell.

---

## 8. Data File Mismatches

### `buffTypes.js`
Defines only **8** of spec's **46** buffTypes. Missing: `shield`, `temporaryHP`,
`cheat_death`, `immunity`, `link`, `retaliation`, `proficiency`, `damage_reduction`,
`empowerment`, `invulnerability`, `immortality`, `protection`, `transformation`, `custom`.
`BUFF_SYNERGIES` references nonexistent buff IDs.

### `debuffTypes.js`
Missing `statusEffect` (spec's most common), plus `combined`, `mark`, `brand`, `aura`,
`disease`, `plague`, `sabotage`, `system_failure`. Dead imports.

### `utilityTypes.js`
Missing **18** of spec's **22** utilityTypes. Only `movement`, `environment`,
`conjuration`, `transformation` match.

### `resourceTypes.js`
Uses wrong class names (`harrow, zealot, apex, monk, hexer, harbinger`) vs spec's 30
Mythrill classes. Only `augur` and `dreadnaught` match. Missing resource definitions for
~22 of 30 spec classes.

### `triggerTypes.js`
Missing entire **Health**, **Trap**, and **Environment** trigger categories from spec.
Uses non-spec trigger IDs (`spell_reflected` vs spec `spell_reflect`, `movement_stop` vs
spec `movement_end`, etc.). **Duplicates entire targeting types system** from
`targetingTypes.js` (lines 1-486). Class-specific triggers use D&D classes not in spec.

### `triggerIcons.js`
Uses spec-conformant names (unlike `triggerTypes.js`), so the two files are out of sync.
Trap timer icon overwritten by time timer icon (key collision).

### `formulaVariables.js`
Missing `HIGHEST_CARD`, `LONGEST_STREAK`. Uses `FACE_CARDS` (spec: `FACE_CARD_COUNT`),
`ACE_COUNT` (spec: `ACES`). Multiple duplicate keys (see §3.9).

### `standardEffectStructure.js`
Default formulas use `INT` and `HEA` which are NOT defined variables (should be
`intelligence`, `healingPower`). Duplicates effect type list from `effectTypes.js`.

### `statusEffects.js`
Missing `stunned`, `burning`, `combat_advantage`, `lifelink`, `damage_shield`,
`elemental_infusion`, `empower_next`, `temporary_hp`, `luck`, `skill_mastery`.
`petrified` uses a completely different schema than every other status effect.

### `cooldownTypes.js`
Adds 3 extra types not in spec (`real_time`, `conditional`, `dice_based`).
Class modifiers reference D&D classes (`wizard, fighter, rogue, cleric`).

### `healingTypes.js`
Missing `hot` as top-level type. Has extra `resurrection`, `spirit`. `HEALING_CATEGORIES`
references nonexistent type IDs (`absorption`, `shield`, `chain`, `aoe`, `smart`).

### `durationTypes.js`
`calculateDurationTime` switch missing `turns` case — returns 0 silently.

---

## 9. Dead Code & Technical Debt

### Orphaned Files (never imported)
- `Step7Review.jsx` (13 lines) — wrapper, never imported
- `Step10Review.jsx` (3039 lines) — never imported by wizard, superseded by `ExternalLivePreview.jsx`
- `Step9Balance` — imported but never reachable in `determineWizardFlow`

### Duplicate Code
- `spellTransformers.js` is legacy duplicate of `spellCardTransformer.js`
- `triggerTypes.js` lines 1-486 duplicate entire `targetingTypes.js`
- `standardEffectStructure.js:392-405` duplicates `EFFECT_TYPES` from `effectTypes.js`
- `BuffEffects.jsx:661-705` shadows imported `RESISTANCE_MODIFIERS` with inline redefinition
- Damage-type extraction logic duplicated in `SpellwizardApp.jsx`, `ExternalLivePreview.jsx`, `SpellLibrary.jsx`, `Step10Review.jsx`

### Dead State / Functions
- `Step5Resources`: `showAdvancedOptions` state never used
- `Step7Mechanics`: `errors` state never set
- `Step3Effects`: `validateEffectCombinations`, `updateResourceCost` never called
- `spellSerializer.js`: `camelCase()`, `slugify()` never used
- `SpellWizardWrapper.jsx:37-42`: `__reactInternalInstance$` removed in React 18
- `spellWizardContext.js`: `UPDATE_SUMMONING_CONFIG`, `UPDATE_TRANSFORMATION_CONFIG` never handled
- `spellWizardContext.js`: `SET_EFFECT_TYPES` handled but never declared

### Debug Logging Left In Production
Excessive `console.log` statements across:
- `Step4Targeting` (lines 230-232, 361, 366, 706)
- `Step7Triggers` (lines 890, 899, 912, 924, 944, 982)
- `Step8Channeling` (lines 73, 81, 276, 293, 406, 516, 624, 641, 661, 673, 815)
- `DamageEffects.jsx` (lines 533, 549, 567, 1588, 1605)
- `HealingEffects.jsx` (lines 189, 387, 741, 789-792, 957, 974, 980, 1018)
- `ControlEffects.jsx` (lines 379, 436-437, 448)
- `SummoningEffects.jsx` (line 215)

### Other Issues
- `SpellwizardApp.jsx:669,682,692` — `img src` set to literal string `"getIconUrl(...)"` instead of calling the function (broken images)
- `SpellwizardApp.jsx:1120-1135` — QuickSpell damageTypes array has duplicate entries
- `SpellWizardWrapper.jsx:21-42` — triple-dispatches spell load (redundant, may double-load)
- `SpellwizardApp.jsx:104` — `activeTab` state declared but never used

---

## 10. Prioritized Fix List

### Priority 1: Data Loss & Crashes (Fix Immediately)
1. **Fix summon/transform naming** — unify on `summoningConfig`/`transformationConfig` across state, reducer, action creators, serializer, and all step components
2. **Fix UnifiedSpellCard Branch 1** — render all effect types regardless of `hasEffectsToWrap`
3. **Fix Step3Effects validation** — change `primaryElement` check to `elementType`
4. **Fix spellTransformers.js crash** — coerce damageTypes to array before `.push()`
5. **Fix spellNormalizer.js:550** — add `?.` guard on statModifier access
6. **Fix hardcoded step indices** — Step6Cooldown (5→6), Step7Triggers (6→'triggers')
7. **Fix mojibake** — re-save UnifiedSpellCard.jsx with correct UTF-8 encoding

### Priority 2: Spec Compliance (Core Wizard Output)
8. **Fix cooldownConfig keys** — Step6Cooldown, SpellwizardApp, all transformers: use `{cooldownType, cooldownValue}`
9. **Fix actionPoints** — Step5Resources always set it; transformers default to 1 not 0
10. **Fix damageTypes** — Step3Effects/DamageEffects write `damageTypes: [...]` array, not `elementType`
11. **Fix buff/debuff shape** — BuffEffects/DebuffEffects write `effects[]` with objects + `buffType`/`debuffType`
12. **Fix school placement** — remove top-level `school` from wizard state
13. **Fix Step1BasicInfo damage type IDs** — use spec-valid IDs or update spec to match new taxonomy

### Priority 3: Taxonomy Unification (Architectural Decision)
14. **Decide on ONE damage type taxonomy** — either update spec to new IDs (ember/rime/storm) or update code to old IDs (fire/frost/lightning)
15. **Update statModifier.js** to match chosen taxonomy
16. **Remove or fix LEGACY_DAMAGE_TYPE_MAP** in spellNormalizer.js
17. **Update resourceTypes.js** class names to match spec's 30 classes
18. **Sync triggerTypes.js and triggerIcons.js** trigger ID names

### Priority 4: Code Cleanup
19. **Delete spellTransformers.js** — update creature-wizard imports
20. **Delete Step7Review.jsx, Step10Review.jsx** (or rewire Step10Review as actual review step)
21. **Delete dead state/functions** (see §9)
22. **Remove all debug console.logs**
23. **Fix duplicate object keys** (see §3.9)
24. **Fix duplicate dropdown options** in SummoningEffects and QuickSpell
25. **Refactor spellSerializer.js** to match current schema or mark deprecated

### Priority 5: Robustness
26. **Make reducer default no-op** instead of throwing (both contexts)
27. **Fix useEffect dependency arrays** across effect components
28. **Replace window event bridges** with proper React context/state
29. **Fix propTypes** — add `rules` variant to UnifiedSpellCard
30. **Add XSS protection** — RollableTableSummary uses `dangerouslySetInnerHTML`

---

*End of Spell Wizard Audit Report*
