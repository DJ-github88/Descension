# Handoff: Batch Ability Compatibility Checker (`ability-compatibility`)

## 1. Exact Commands to Run the Tool

### Run on the Representative HQ Batch (Default)
Prints the concise terminal summary and writes `vtt-react/verification/ability-compatibility/representative-report.json`:
```bash
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs
```

### Run on a Specific Class or the Entire Class Catalogue
```bash
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --class Arcanoneer
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --class Berserker
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --class Doomsayer
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --class all --json vtt-react/verification/ability-compatibility/all-classes-report.json
```

### Run on a Specific Authored File / Module
```bash
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --file vtt-react/src/data/classes/martyrData.js
```

### Run the First-Campaign Ability Readiness Batch (12 Abilities Across Arcanoneer, Minstrel, Martyr [Provisional Reference])
Prints the readiness summary and writes `vtt-react/verification/ability-compatibility/first-campaign-readiness-batch.json` (paired with `vtt-react/verification/ability-compatibility/FIRST_CAMPAIGN_READINESS_HANDOFF.md`):
```bash
node vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs --first-campaign
```

### Run the Focused Verification Test Suite
```bash
node --test vtt-react/verification/ability-compatibility/abilityCompatibility.test.cjs
```

---

## 2. Files Added

All files are strictly isolated inside `vtt-react/verification/ability-compatibility/`:
- `vtt-react/verification/ability-compatibility/checkAbilityCompatibility.cjs` — CLI checker and reusable programmatic API (`checkRecord`, `checkCollection`, `checkClassByName`, `buildValidatorIdentity`, `formatTerminalSummary`).
- `vtt-react/verification/ability-compatibility/representativeBatch.cjs` — Representative batch loader covering all 7 required categories across live Class HQ records and canonical Wizard-authored records.
- `vtt-react/verification/ability-compatibility/abilityCompatibility.test.cjs` — Focused `node:test` verification suite (8 test suites).
- `vtt-react/verification/ability-compatibility/representative-report.json` — Machine-readable JSON report for the 25-record representative batch.
- `vtt-react/verification/ability-compatibility/HANDOFF.md` — Standalone handoff summary for Sol and Class HQ.

No shared runtime files, package manifests, class data files, Wizards, or shared ledger files were modified.

---

## 3. Test Results

`node --test vtt-react/verification/ability-compatibility/abilityCompatibility.test.cjs` — **8 / 8 passed**:
1. Compatible records are recognized across `p9-spell:v1`, `authored-immediate:v1`, `authored-condition:v1`, and `authored-effect:v1`.
2. Unsupported secondary effects prevent a misleading compatibility result (whole-record inspection).
3. Explicit zero values (`0` AP, `0` mana, `0` range) survive unchanged without normalization.
4. Ambiguous/conflicting schemas remain unresolved (`ambiguous_or_conflicting`).
5. Source/target route restrictions are distinguished from definition shape (e.g., `authored-effect:v1` targeting a PC vs creature; zero-range self-healing on creature self vs distinct target).
6. Input records are never mutated (verified with deep-frozen records and pre/post canonical SHA-256 hashes).
7. Repeated runs produce byte-identical output and capture cryptographic validator/source identity hashes.
8. Scales cleanly to full Class HQ modules without labeling valid unsupported content as broken.

---

## 4. Representative Compatibility Summary (25 Records)

- **`compatible` (9 records):**
  - `p9-spell:v1` (4 Class HQ records):
    - `arc_spark_bolt` (`vtt-react/src/data/classes/arcanoneerData.js:2150`)
    - `martyr_restorative_prayer` (`vtt-react/src/data/classes/martyrData.js:926`)
    - `minstrel_opening_chord` (`vtt-react/src/data/classes/minstrelData.js:1346`, explicit `0` mana preserved)
    - `minstrel_harmonic_strike` (`vtt-react/src/data/classes/minstrelData.js:1402`)
  - `authored-immediate:v1` (2 Wizard records):
    - `wizard_immediate_ember_lance` (explicit `0` AP and `0` mana preserved)
    - `wizard_creature_self_mend` (explicit `0` range and `self` restriction, compatible via `creatureSelfHealing` route `creature -> self`)
  - `authored-condition:v1` (1 Wizard record):
    - `wizard_canonical_stun_bind` (canonical Stunned with `gm-manual` expiry bound to `arcanoneer`)
  - `authored-effect:v1` (2 Wizard records):
    - `wizard_a10_stun_shock` (composable Stunned + `1d6+2` storm damage with `target-next-end` expiry on distinct creature target)
    - `wizard_a10_kinetic_shove` (composable `-10 ft` movement modifier + `1d4+1` rime damage with `target-next-start` expiry on distinct creature target)
- **`unsupported_capability` (12 records):**
  - `stasis_field` (`chronarchData.js:908`) — `debuffConfig`, `Time Shards` payment domain.
  - `minstrel_resolving_strike` (`minstrelData.js:1730`) — passes `supportShape` and `readFormula`, but `classResource` requires `resolvesCadence: true` which P9 does not execute.
  - `temporal_flux_speed` (`chronarchData.js:1730`) — `buffConfig`, `triggerConfig`, `permanentCost` max HP erosion, `Time Shards` + `Temporal Strain`.
  - `cr1_doomsayer_doom_bolt` (`doomsayerData.js:102`) — R1 `manualOnly: true` envelope, structured `durationConfig`, `classResourceProgram` (`doom-calamities`).
  - `berserk_obliterating_strike` (`berserkerData.js:1750`) — mixed `damage` + self-recoil `debuffConfig` + `triggerConfig` execute + `50 Rage` cost.
  - `temporal_fracture` (`chronarchData.js:1805`) — mixed `damage` + reaction-lock `debuffConfig` + `canCrit`/`critMultiplier` + `Time Shards`.
  - `arc_frost_touch` (`arcanoneerData.js:2205`) — mixed `damage` + slow `debuffConfig`.
  - `arc_fire_bolt` (`arcanoneerData.js:2750`) — single-target primary damage with `propagation` chain/bounce.
  - `arc_steam_burst` (`arcanoneerData.js:2497`) — `area` targeting + `damage` + `debuffConfig`.
  - `bsk_caldera_slam` (`berserkerData.js:574`) — `area` targeting + `damage` + unprofiled `controlConfig` + `Rage` cost.
  - `berserk_avatar_of_slaughter` (`berserkerData.js:3827`) — `self` targeting + `transformationConfig` + 3-round `buffConfig` + `80 Rage` cost.
  - `cr1_druid_adopt_loadout` (`druidData.js:72`) — R1 `manualOnly: true` envelope + `self` targeting + `utility` loadout state + `classResourceProgram`.
- **`ambiguous_or_conflicting` (2 records):**
  - `arc_arcane_missile` (`arcanoneerData.js:2350`) — `Sphere recipe encodings disagree (explicit list vs typed sphere counts); creator resolution required` (plus `autoHit`).
  - `cr1_doomsayer_calamity_zone` (`doomsayerData.js:133`) — `effectTypes` is `['control']` (omitting `'damage'`), but record attaches a non-null `damageConfig` (`1d4 blight`).
- **`descriptive_or_passive_outside_profiles` (2 records):**
  - `berserk_calloused_hide` (`berserkerData.js:748`, `PASSIVE`)
  - `chrono_frailty` (`chronarchData.js:783`, `PASSIVE`)
- **`invalid_for_profile` (0 records in default representative batch; verified in test suite for route violations and malformed profile records).**

---

## 5. Most Common Missing Capabilities Grouped by Reusable Engine Requirement

Across both the 25-record representative batch and a full scan of all **1,992 records** in `CLASS_DATA_MAP` (`4` compatible, `1,495` unsupported capability, `62` ambiguous/conflicting, `0` invalid, `431` passive/descriptive):

1. **`class-resource-room-payment-home`** (10 in representative batch; **1,309** in full catalogue)
   - Class resource spend/gain/threshold/state-machine mechanics outside the 3 P9 revisioned room domains (`elementalSpheres`, `musicalNotes`, `devotionGauge`), including `Rage`, `Time Shards / Temporal Strain`, `Inferno / Veil`, `Blood / Heat`, `Resonance`, `Malediction`, `Quarry Marks`, `Benediction`, `Fortune`, `Virulence`, `Fervor`, `Mayhem`, `Death-Toll`, `AEP`, `Doom Calamities`, `Chaos Dice`, `Momentum`, `Form / Wildshape`, `permanentCost` max HP taxes, and Minstrel `resolvesCadence`.
2. **`area-chain-and-multi-target-routing`** (6 in representative batch; **937** in full catalogue)
   - Non-single targeting (`area`, `cone`, `circle`, `line`, `self`, `point`, `multi`, `chain`, `maxTargets > 1`, and `propagation`).
3. **`turn-and-duration-lifecycle`** (3 in representative batch; **750** in full catalogue)
   - Multi-round/turn `durationConfig`, `CHANNELED`/`STATE`/`ZONE` spell types, `channelingConfig`, non-immediate cast times, and CR1 structured instant duration objects (`{ durationType: 'instant', durationValue: 0, durationUnit: 'instant' }`).
4. **`stat-buff-debuff-and-status-effects`** (7 in representative batch; **617** in full catalogue)
   - `buffConfig` and `debuffConfig` stat modifiers, resistances, armor/DR bypass, haste/slow, and status effects outside canonical Stunned / A10 movement.
5. **`summon-transformation-zone-and-utility-primitives`** (2 in representative batch; **567** in full catalogue)
   - `utilityConfig`, `summoningConfig`, `transformationConfig`, `purificationConfig`, `restorationConfig`, and simultaneous `damage + healing`.
6. **`manual-tabletop-envelope-and-catalog-metadata`** (3 in representative batch; **434** in full catalogue)
   - R1 (`cr-review-r1`) and legacy-roster (`RI-*`) catalogue flags (`manualOnly: true`, `authoredOnly: true`, `executionEnabled: false`, `applicationMode: 'manual-tabletop'`) and delegated `manualMechanics` effects.
7. **`control-and-forced-movement-primitives`** (2 in representative batch; **244** in full catalogue)
   - Class-spell `controlConfig` and `conditions` arrays not authored with a canonical Wizard `authored-condition:v1` or `authored-effect:v1` profile.
8. **`reaction-and-event-trigger-windows`** (2 in representative batch; **210** in full catalogue)
   - `spellType === 'REACTION'` / `'TRAP'`, `triggerConfig`, `triggers`, `reactionTiming`, and conditional on-hit/on-cast/start-of-turn hooks.
9. **`critical-auto-hit-and-alt-resolution`** (2 in representative batch; **151** in full catalogue)
   - `criticalConfig`, `canCrit`, `critMultiplier`, `autoHit`, `chanceOnHitConfig`, `rollableTable`, and non-`DICE` (`CARDS`, `COINS`, `NONE`, `AUTOMATIC`) resolution.
10. **`saving-throw-and-partial-mitigation`** (0 in representative batch after null filtering; **130** in full catalogue)
    - `damageConfig.savingThrow`, `savingThrowConfig`, and top-level `savingThrow` DC/attribute/partial-damage resolution.
11. **`formula-and-scaling-vocabulary`** (**72** in full catalogue)
    - Formulas with multiplication (`6d8 + strength * 2`), parentheses/dynamic state scaling (`3d8 + (Flux Expended * 1d4)`), percentages (`50% max_hp`), or dice-less constants (`40`), plus attribute terms inside Wizard `authored-*` formulas.
12. **`periodic-dot-hot-and-absorption-shields`** (**56** in full catalogue)
    - `hasDotEffect` / `dotConfig`, `hasHotEffect` / `healingType: 'hot'`, and `hasShieldEffect` / `shieldConfig` / `overhealBecomesShield`.

---

## 6. Validator Interfaces That Could Not Be Safely Reused in Offline Batch Mode

- **`server/services/installedAuthoredAbilities.js` (`checkApproval`, `checkInstalledState`, `planInstalledExecution`, `applyInstalledExecution`):**
  - Requires a live seeded multiplayer room (`room.combatState`, `room.tokens`, `room.characterStates`, `room.players`, `room.authoredAbilityApprovals`, `room.installedDefinitionRegistry`) and active socket/turn-clock context.
  - **What was reused instead:** Its pure definition, formula, effect, compiler, and self-healing validators (`authoredAbility.definitionFromWizard`, `authoredAbility.readFormula`, `authoredAbility.creatureSelfHealing`, `authoredEffect`, `installedDefinitionRegistry.compileDefinition`, `authoredSpellDefinitions.compileDefinition`, `sharedConditionProfile.validMovementFeet`) are reused directly.
- **`vtt-react/src/services/spellConsequence.js` (`planSpellCommand`, `buildApproval`, `affordable`, and `resolveOriginalSpell` for runtime `authored:` IDs):**
  - Requires live browser Zustand stores (`gameStore`, `characterStore`, `combatStore`, `partyStore`), placed map tokens, `roomRevision`, and owner dice roll state.
  - **What was reused instead:** Its pure shape, payment, formula, hash, and class-catalogue validators (`supportShape`, `planClassPayment`, `readFormula`, `supportSpell`, `definitionHash`, plus `classResourceContracts`) are reused directly.
- **`vtt-react/src/services/itemAuthoredAbility.js` (`resolveGrantedSpell`, `collectGrantedSpells`):**
  - Requires live character inventory state and room-admitted definition maps in `gameStore.admittedDefinitionsById`.
- **Unsupported mechanic categories (AoE, saves, buffs/debuffs, DoT/HoT/shields, summons/transforms, reactions/triggers, passives):**
  - No production execution validator exists because Mythrill intentionally gates these mechanics as manual tabletop resolution. Per instructions, no competing execution validator or engine was built.
