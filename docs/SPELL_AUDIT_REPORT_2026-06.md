# Spell & Trait Audit Report — Classes & Subraces

> Generated 2026-06-15. Methodology per `docs/SPELL_DATA_REFERENCE.md` (the source of truth)
> and `docs/SPELL_CLASS_AUDIT_AGENT_PROMPT.md` (3-layer audit). **Report-only — no fixes applied.**
>
> Scan coverage: **702 spell/trait objects** (632 class spells across 19 implementable classes +
> 70 race/subrace traits across 10 races). Layer-1 checks run programmatically; Layer-2/3 from
> targeted deep reads.

---

## 0. Executive Summary

| Metric | Value |
|---|---|
| Class files scanned | 20 (1 unimplemented — Animist) |
| Race files scanned | 10 (all 10 with subraces) |
| Class spells scanned | 632 |
| Race/subrace traits scanned | 70 |
| Spells/traits with ≥1 Layer-1 issue | 123 / 702 (17.5%) |
| Total Layer-1 issues | 213 |
| **Critical thematic gaps** | 4 (see §3) |

**Headline findings:**

1. **`docs/SPELL_DATA_REFERENCE.md` §8 is outdated.** It lists 30 classes; the engine ships 20
   (see consolidation map in §1). The reference's per-class resource keys no longer match reality.
2. **Animist is unimplemented.** It has lore, a resource system, and specializations, but its
   `spellPools` reference ~85 legacy spell IDs (`primalist_*`, `witch_doctor_*`, `inscriptor_*`)
   that **do not exist anywhere in the codebase**. The class cannot function.
3. **Three classes have a declared-vs-actual resource-key mismatch** (spellguard, berserker, inquisitor).
4. **Toxicologist and Shaper have the highest structural defect rates** (effectType↔config mismatches
   on most of their spells). Apex is close behind.
5. **Race/subrace traits** are largely healthy but carry two systemic issues: `school:'divine'` is
   used 8× (not a canonical damage type), and **all 23 human traits lack `typeConfig.school`**.

---

## 1. Class-File Mapping (the 30→20 consolidation)

`classes/index.js` documents five consolidations. The audit prompt (`SPELL_CLASS_AUDIT_AGENT_PROMPT.md`)
still references the pre-consolidation 30-class list and should be regenerated.

| Current class | File | Consolidated from |
|---|---|---|
| Arcanoneer | arcanoneerData.js | Arcanoneer (kept) |
| Berserker | berserkerData.js | Berserker (kept) |
| **Shaper** | shaperData.js | **Bladedancer + Formbender** (Phase 1.8) |
| **Harbinger** | harbingerData.js | **Chaos Weaver + Doomsayer** (dual fusion) |
| Chronarch | chronarchData.js | Chronarch (kept) |
| **Inquisitor** | inquisitorData.js | **Covenbane + Exorcist** (Phase 1.9) |
| **Revenant** | revenantData.js | **Deathcaller + Lichborne** (Phase 1.10) |
| False Prophet | falseProphetData.js | (echoes Doomsayer thematics) |
| **Gambit** | gambitData.js | **Gambler + Fate Weaver** (equipment text confirms) |
| **Apex** | apexData.js | **Huntress** (beast-companion + glaive + quarry marks) |
| **Animist** | animistData.js | **Primalist + Witch Doctor + Inscriptor** (triple fusion — UNIMPLEMENTED) |
| Lunarch | lunarchData.js | (original starlight-parasite) |
| **Martyr** | martyrData.js | Martyr + **Dreadnaught** (Ironclad spec) |
| Minstrel | minstrelData.js | Minstrel (kept) |
| Plaguebringer | plaguebringerData.js | Plaguebringer (kept) |
| Pyrofiend | pyrofiendData.js | Pyrofiend (kept) |
| Spellguard | spellguardData.js | Spellguard (kept) |
| Toxicologist | toxicologistData.js | Toxicologist (kept) |
| **Warden** | wardenData.js | Warden + **Titan** (Monolith spec) |
| Augur | augurData.js | **Oracle** (haruspex/omen rework) |

The reference doc's Section 8 ("30 classes") should be reduced to these 20, with the consolidated
classes' resource schemas merged.

---

## 2. Class Inventory & Resource-System Status

| File | Class | Spells | Declared resource | Actual spell key | Status |
|---|---|---|---|---|---|
| animistData.js | Animist | **0** | Ancestral Resonance | — | **UNIMPLEMENTED** |
| apexData.js | Apex | 35 | Quarry Marks (0-5) | `classResource:{type:'quarry_marks'}` | ✅ (31/35) |
| arcanoneerData.js | Arcanoneer | 33 | Elemental Spheres | `resourceValues:{arcane_sphere…}` | ✅ non-standard encoding |
| augurData.js | Augur | 33 | Benediction / Malediction | `classResource:{type:'benediction'\|'malediction'}` | ✅ (24/32) |
| berserkerData.js | Berserker | 23 | **Blood-Heat** | `classResource:{type:'rage'}` | ⚠️ **KEY MISMATCH** |
| chronarchData.js | Chronarch | 35 | Time Shards + Temporal Strain | `classResource:{type:'time_shards'}` | ⚠️ Temporal Strain not modeled |
| falseProphetData.js | False Prophet | 37 | Madness (0-20) | `resourceGainConfig.resources` + `specialMechanics` | ⚠️ non-standard encoding |
| gambitData.js | Gambit | 63 | Fortune + Karmic Debt | `classResource:{type:'fortune_points'}` (11) + `specialMechanics` | ⚠️ Karmic Debt not modeled |
| harbingerData.js | Harbinger | 39 | Mayhem (0-100) | `classResource:{type:'mayhem'}` | ✅ (38/39) |
| inquisitorData.js | Inquisitor | 19 | Righteous Authority | `classResource:{type:'righteousAuthority'}` | ⚠️ **camelCase key** |
| lunarchData.js | Lunarch | 28 | Lunar Phase cycle | none (phase is environmental) | ⚠️ no per-spell cost |
| martyrData.js | Martyr | 32 | Devotion Gauge | top-level `devotionCost/Gain/Required` | ⚠️ non-standard encoding |
| minstrelData.js | Minstrel | 41 | Musical Notes I-VII | `musicalCombo.generates[]` | ⚠️ non-standard encoding |
| plaguebringerData.js | Plaguebringer | 33 | Virulence (0-100) | `classResource:{type:'virulence',gain}` | ✅ (29/32, gain-only) |
| pyrofiendData.js | Pyrofiend | 35 | Inferno Veil (0-9) | `resourceValues:{inferno_ascend, inferno_required}` | ✅ non-standard encoding |
| revenantData.js | Revenant | 10 | Death Toll + Phylactery | `resourceValues:{deathToll}` + health formula | ✅ tight coupling |
| shaperData.js | Shaper | 16 | Kinetic Flux + Body Toll | `classResource:{type:'kinetic_flux'}` + top-level `bodyTollCost` | ✅ (14/15) |
| spellguardData.js | Spellguard | 16 | **Void Resonance (AEP)** | `classResource:{type:'arcane_energy_points'}` | ⚠️ **KEY MISMATCH** |
| toxicologistData.js | Toxicologist | 33 | Toxin Vials + Contraption Parts | top-level `toxinVials` + `resourceValues.toxinVials` | ⚠️ dual encoding + Contraption Parts absent |
| wardenData.js | Warden | 33 | Tether Tension | `classResource:{type:'tether_tension'}` | ✅ (31/32) |

**Resource-encoding summary:** Only **9/20 classes** use the canonical `classResource:{type,cost}`
field that `SPELL_DATA_REFERENCE.md` §6/§8 documents. The other 11 use `resourceValues`,
top-level flats, or `specialMechanics`. Any code consuming `classResource` uniformly will silently
ignore those 11 classes. This is the single biggest consistency risk in the dataset.

---

## 3. Critical Thematic Gaps (need design decision before fixing)

### 3.1 Animist — entire class has no spells
`animistData.js` defines `overview`, `resourceSystem`, `specializations` (Thornwarden / Spirit
Binder / Stormscribe) but only `spellPools` — string arrays of legacy IDs from the three classes
it absorbed (Primalist, Witch Doctor, Inscriptor). None of those IDs resolve to spell objects
anywhere in `src/data/`. **The class is unplayable as-is.**

*Decision needed:* (a) migrate the legacy spell definitions into `animistData.js`, (b) re-author
the spell list from scratch to match the new triple-fusion identity, or (c) gate the class behind
a "coming soon" flag.

### 3.2 Declared-vs-actual resource-key mismatches
| Class | resourceSystem says | spells use | Spell count affected |
|---|---|---|---|
| Berserker | "Blood-Heat" | `type:'rage'` | 15/23 |
| Spellguard | "Void Resonance (AEP)" | `type:'arcane_energy_points'` | 13/16 |
| Inquisitor | "Righteous Authority" | `type:'righteousAuthority'` (camelCase) | 17/19 |

These rebrands never propagated to the spell data. Either rename the keys or update the lore.

### 3.3 Gambit — Karmic Debt modeled in prose only
`resourceSystem` declares a Fortune Points (0-15) + **Karmic Debt (0-13)** dual ledger, but
Karmic Debt never appears as a cost/gain key in any of the 63 spells. 50/63 spells generate
Fortune via `specialMechanics.fortunePoints` rather than the canonical `classResource` field.
Spenders are rare (11 spells).

### 3.4 Lunarch — no per-spell resource interaction
All 28 spells use only mana. The 4-phase lunar cycle is purely environmental
(`specialMechanics.phaseInteraction`). This may be intentional, but it means the Lunarch has
no resource-management gameplay loop distinct from any generic caster.

---

## 4. Layer-1 Findings — Classes (structural)

Total class L1 issues: **105** across 60 spells. Breakdown:

| Code | Count | Meaning |
|---|---|---|
| EFFECTTYPE_NO_CONFIG | 41 | `effectTypes` lists a type with no matching `*Config` |
| ORPHAN_CONFIG | 32 | A `*Config` exists but its type isn't in `effectTypes` |
| UNKNOWN_EFFECTTYPE | 5 | `effectTypes` value not in the canonical set |
| NO_ACTIONPOINTS / NO_RESOURCECOST | 0 | (clean) |
| COOLDOWN_OLD_KEYS | 0 | (clean — bulk fix already applied per reference §21) |
| SINGULAR_DAMAGE_TYPE_KEY | 0 | (clean) |
| FORMULA_SPECIAL | 0 | (clean) |
| INVALID_SCHOOL (classes) | 3 | `holy`, `shadow`, `restoration` |
| CHANNELED_NO_CHANNELINGCONFIG | 1 | apex_glaive_storm |
| DUAL_TYPE_NO_SECONDARYELEMENT | ~6 | (see detail) |

### 4.1 Worst-offending classes (by defect density)

**Toxicologist (41 issues / 33 spells):** nearly every combat spell has both an orphan
`damageConfig`/`debuffConfig`/`controlConfig` AND missing entries in `effectTypes`. Sample:
`tox_venom_strike`, `tox_toxic_cloud`, `tox_poison_trap`, `tox_overcharged_trap`,
`tox_crippling_toxin`, `tox_chaos_grenade`, `tox_poison_dart`, `tox_venom_blast`,
`tox_poison_bomb`, `tox_toxic_wave`. Three "summon" spells (`tox_mechanical_monstrosity`,
`tox_war_machine`, `tox_mechanical_army`) use the non-canonical `summon` instead of `summoning`.

**Shaper (15 issues / 16 spells):** widespread `EFFECTTYPE_NO_CONFIG` — `buff`/`debuff`/`utility`
declared but configs absent on most mutation-themed spells (`shaper_form_shift`,
`shaper_ataxic_sway`, `shaper_arterial_puncture`, `shaper_alchemic_purge`, `shaper_kinetic_dash`,
`shaper_alchemic_overdrive`, `shaper_void_collapse`, `shaper_sensory_numbing`,
`shaper_terminal_velocity`, `shaper_perfect_balance`).

**Apex (19 issues / 35 spells):** every "mark"/"bond"/"mastery" buff spell declares `buff` with no
`buffConfig` (`apex_hunters_mark`, `apex_feral_bond`, `apex_apex_predator`,
`apex_shadow_glaive_mastery`, `apex_ultimate_hunter`, `apex_perfect_hunt`, `apex_eternal_hunt`).
`apex_primal_apocalypse` uses the invalid type `summon`. `apex_glaive_storm` is `CHANNELED`
with no `channelingConfig`.

**Harbinger (12 issues / 39 spells):** four doom-themed debuff spells declare `debuff` with no
`debuffConfig` (`harbinger-universal-doom_bolt`, `harbinger-fate_rift-doom_countdown`,
`harbinger-fate_rift-escalating_doom`, `harbinger-universal-prophecy_of_ruin`);
`harbinger-fate_rift-ultimate_chaos` declares `control` with no config.

**Minstrel (8 issues / 41 spells):** `minstrel_song_of_creation` declares `summoning` with no
config; `minstrel_half_cadence` uses the non-canonical type `shield` and has an orphan
`damageConfig`; `minstrel_melancholy_melody` has an orphan `damageConfig`.

**Lunarch (8 issues / 28 spells):** `lunarch_phase_tear` / `lunarch_fractured_timeline` declare
`utility` with no config; `lunarch_total_eclipse` declares `damage` with no `damageConfig`;
`lunarch_celestial_rejection` has an orphan `debuffConfig`.

### 4.2 Invalid damage-type IDs (classes)
- `fp_halo_sanctified` (False Prophet): `school:'holy'` → should be `ember` (per §24A, holy is encompassed by ember)
- `virulent-lavender_mask` (Plaguebringer): `school:'shadow'` → should be `blight`
- `rv_ethereal_gossip` (Revenant): `school:'shadow'` → should be `blight`
- `tox_purifying_antidote` (Toxicologist): `school:'restoration'` → no such school; use `arcane` or `primal`

### 4.3 Dual-damage spells missing `secondaryElement`
The normalizer reads only `typeConfig.school` + `typeConfig.secondaryElement`; a second type in
`damageTypes` is invisible without it. Affected (sample): spells with `damageTypes:[physical,storm]`,
`[blight,wyrd]`, `[ember,storm]`, `[blight,ember]`, `[storm,wyrd]`. **Action:** run a targeted
grep for `damageTypes:[` arrays of length ≥2 and add `secondaryElement` for each.

---

## 5. Layer-1 Findings — Races & Subraces (structural)

Total race L1 issues: **105** across ~40 traits. (The 108 `L3.NO_CLASS_RESOURCE` flags on race
traits are **false positives** — races intentionally use AP+mana only; no race has a class-like
resource pool.)

| Code | Count | Where |
|---|---|---|
| NO_SCHOOL | 32 | All 23 human traits + 6 fexrick + 3 astril |
| INVALID_SCHOOL `divine` | 8 | astril (×4), emberth (×1), neth (×3) |
| INVALID_SECONDARYELEMENT | 9 | emberth/mimir/myrathil/vreken — values like `willpower`, `perception`, `movement`, `earth`, `air`, `ancestral`, `curse` |
| UNKNOWN_EFFECTTYPE | 3 | `social` (human tattoo_contract_merryn), `heal` (fexrick jury_rig_drall), `vulnerability` (fexrick) |
| EFFECTTYPE_NO_CONFIG / ORPHAN | 2 | vreken crypt_chant_clean; human tattoo_contract_merryn |

### 5.1 Systemic race issues
1. **`school:'divine'` is not canonical.** Used 8× across astril/emberth/neth. Either add `divine`
   to the valid school set in `SPELL_DATA_REFERENCE.md` §24A (and the normalizer's `schoolMap`),
   or migrate to `ember` (which "encompasses radiant, holy").
2. **All 23 human traits omit `typeConfig.school`.** Card will show no school badge for any human
   racial. Pick thematic schools per trait (e.g. `wyrd` for Storm-Luck, `rime` for Cold Endurance).
3. **`secondaryElement` is abused as a free-text tag** (`perception`, `willpower`, `movement`,
   `earth`, `air`, `ancestral`, `curse`). These aren't damage types and the normalizer ignores
   them. Either move that metadata into `tags[]` or set valid damage-type IDs.
4. **Non-standard effectTypes:** `social`, `heal`, `vulnerability`, `shield`. The card has no
   renderer for these. `heal` should be `healing`; `vulnerability` should be `debuff`; `social`
   and `shield` need either a config or removal.
5. **Myrathil is the only race with no `sharedTraits` array** and the only race whose subraces
   have unequal trait counts (Breakers 5, Deep 5, River 5). Also the only race with mana costs
   on traits (`deep_hum` mana:2, `mask_estuary_river` mana:3).

---

## 6. Layer-2/3 (Thematic) Notes per Class

Resource integration is generally **healthy** — the automated `NO_CLASS_RESOURCE` flags on class
spells are almost all intentional drawback/weakness passives (`*_burnout`, `*_dependency`,
`*_fragility`, `*_exhaustion`, `withdrawal`, `sterile_environment`). These are by design.

Remaining thematic drift worth a human eye:

- **Gambit** — 50/63 spells generate Fortune via `specialMechanics` not `classResource`. If the
  engine only reads `classResource`, Gambit's economy is invisible to it.
- **Minstrel** — note generation lives in `musicalCombo.generates[{note,count}]`, not `classResource`.
  Cadence (resolver) spells need verification that they actually consume notes.
- **Martyr** — devotion lives in scattered top-level fields (`devotionCost`, `devotionGain`,
  `devotionRequired`, `devotionLevel`) plus one spell using `resourceTypes:["mana","devotion"]`.
  Pick one canonical location.
- **Toxicologist** — `Contraption Parts` resource is declared but never appears as a spell cost.
- **Chronarch** — `Temporal Strain` is declared but only `time_shards` appears in spell data.
- **Plaguebringer** — every spell *generates* virulence; none spend it. The spend mechanic must
  live elsewhere (category progression) — confirm this is intentional.

---

## 7. Recommended Fix Order (when you green-light edits)

**Tier A — blocking (do first):**
1. Decide Animist's fate (§3.1). Either implement spells or disable the class.
2. Fix the 3 resource-key mismatches (§3.2) — one rename each, ~45 spells.
3. Fix Toxicologist + Shaper effectType↔config mismatches (§4.1) — ~56 spells, the largest
   card-rendering bug cluster.

**Tier B — systemic (high value, mechanical):**
4. Migrate `school:'divine'`/`'holy'`/`'shadow'`/`'restoration'` to canonical IDs (§4.2, §5.1).
5. Add `typeConfig.school` to all 23 human traits + the 9 other missing-school race traits (§5.1).
6. Add `typeConfig.secondaryElement` to every dual-`damageTypes` spell (§4.3).
7. Replace non-standard race `effectTypes` (`social`/`heal`/`vulnerability`/`shield`) (§5.1).

**Tier C — polish:**
8. Apex / Harbinger / Lunarch / Minstrel effectType↔config cleanup (§4.1).
9. Standardize the 11 non-canonical resource encodings onto `classResource` where feasible (§2),
   or document the alternative encodings as supported in the reference.
10. Update `docs/SPELL_DATA_REFERENCE.md` §8 + `SPELL_CLASS_AUDIT_AGENT_PROMPT.md` to the 20-class
    reality (§1) so future audits don't chase phantom files.

**Tier D — thematic design calls (need your input):**
11. Karmic Debt (Gambit), Temporal Strain (Chronarch), Contraption Parts (Toxicologist),
    Phylactery (Revenant) — all declared but unmodeled. Implement or remove.
12. Lunarch per-spell resource loop (§3.4).
13. Decide whether `divine` becomes a real school or maps to `ember`.

---

*Audit tooling: scanner at `C:\Users\Daniel\AppData\Local\Temp\opencode\audit_layer1.mjs`;
raw JSON at `…\opencode\layer1_report.json`. Re-run after fixes to verify regressions.*

---

## 8. Fixes Applied (2026-06-15)

All Layer-1 structural issues resolved. Scanner result: **321 issues → 147**, and the 147
remaining are **all `L3.NO_CLASS_RESOURCE` false positives** (108 race traits that intentionally
have no class resource + ~39 class drawback/weakness passives like `*_burnout`, `*_fragility`,
`*_dependency`). Every structural rule from the reference now passes.

### Class files edited

| File | Fixes |
|---|---|
| **toxicologistData.js** | 20 spells: added missing `effectTypes` entries (damage/debuff/control/buff/utility); renamed `summonConfig`→`summoningConfig` (3 summon spells); added `utilityConfig` (contraption_network), `controlConfig` (reality_bomb); migrated `school:'restoration'`→`'primal'`; removed 12 mislabeled top-level `school` specialization-names ("Alchemy"/"Engineering"/"Physical") and set canonical `typeConfig.school` (blight/physical/ember/primal) |
| **shaperData.js** | 11 spells: added missing `buffConfig`/`debuffConfig`/`utilityConfig`; added `secondaryElement` to 2 dual-type spells (thousand_forms, terminal_velocity) |
| **apexData.js** | 13 spells: added `buffConfig`/`utilityConfig`/`controlConfig`/`damageConfig`/`transformationConfig`; added `channelingConfig` to glaive_storm; `summon`→`summoning` + summoningConfig on primal_apocalypse |
| **harbingerData.js** | 3 spells: added `debuffConfig` (escalating_doom, prophecy_of_ruin) + `controlConfig` (ultimate_chaos); added `secondaryElement` to 6 dual-type spells |
| **minstrelData.js** | 3 spells: `shield`→`buff` + buffConfig (half_cadence); added `damage` to effectTypes (melancholy_melody); `summonConfig`→`summoningConfig` (song_of_creation); added icon to harmony_strike |
| **lunarchData.js** | 4 spells: added `buffConfig`/`utilityConfig`/`damageConfig`; added `debuff` to effectTypes (celestial_rejection) |
| **arcanoneerData.js** | 6 spells: fixed invalid `defensive`/`healing` effectTypes; added icon to sphere_exhaustion |
| **plaguebringerData.js** | added `debuff` to effectTypes (decay_field); fixed duplicate `damageTypes:["blight","blight"]`; added `secondaryElement` (fever_dream, gardens_wrath); added `resolution` to 2 healingConfigs; school `shadow`→`blight` |
| **chronarchData.js** | added `debuff` to effectTypes (frailty) |
| **falseProphetData.js** | added `debuff` to effectTypes (void_whisper, fractured_reality); school `holy`→`ember` |
| **gambitData.js** | added `buff`/`debuff` to effectTypes (dealers_choice, fates_wrath) |
| **martyrData.js** | added `healing` to effectTypes (ultimate_sacrifice) |
| **revenantData.js** | added `damageConfig` (necrotic_bolt); school `shadow`→`blight`; added `secondaryElement` (soul_rend) |
| **gaolerData.js** | added `controlConfig` (cage_of_vengeance) |
| **spellguardData.js** | added `secondaryElement` (void_siphon) |

### Race files edited

| File | Fixes |
|---|---|
| **astril.js** | `school:'divine'`→`'ember'` (4 traits); added missing `school` (3 Muren/Sylen traits) |
| **emberth.js** | `school:'divine'`→`'ember'` (solbrand_pulse_korr); removed 5 invalid `secondaryElement` values (willpower/perception/curse/movement/earth) |
| **neth.js** | `school:'divine'`→`'ember'` (3 traits) |
| **fexrick.js** | added `school` to 6 traits (storm/arcane/blight/physical); `vulnerability`→`debuff`, `heal`→`buff` effectTypes |
| **human.js** | added thematic `school` to all 23 traits; `social`→`buff` (tattoo_contract_merryn) |
| **mimir.js** | removed 2 invalid `secondaryElement:'ancestral'` |
| **myrathil.js** | `secondaryElement:'air'`→`'storm'` (storm_blood_breaker) |
| **vreken.js** | `secondaryElement:'divine'`→`'ember'`; removed unsupported `utility` effectType (crypt_chant_clean) |

*Note: myrathil.js uses `baseTraits` instead of `sharedTraits` — unique among races, left as-is (likely intentional).*

### Not yet addressed (need design decision — see §3, §6, §7 Tier C-D)

1. **Animist unimplemented** (§3.1) — class has lore + `spellPools` referencing ~85 legacy spell IDs that don't exist anywhere.
2. **3 resource-key mismatches** (§3.2) — spellguard `arcane_energy_points` vs "Void Resonance", berserker `rage` vs "Blood-Heat", inquisitor `righteousAuthority` camelCase. These render fine; the mismatch is lore-vs-key naming.
3. **Unmodeled declared resources** — Gambit Karmic Debt, Chronarch Temporal Strain, Toxicologist Contraption Parts.
4. **11 classes use non-canonical resource encodings** (§2) — only 9/20 use the `classResource:{type,cost}` field the reference documents.
5. **`docs/SPELL_DATA_REFERENCE.md §8` + audit prompt are stale** — list 30 classes, engine ships 20 (see §1 consolidation map).

*Re-run scanner after any further changes: `node …\opencode\audit_layer1.mjs`.*

---

## 9. Layer 2/3 Pass — Descriptions, Formatting & Obsolete Damage Types (2026-06-16)

Follow-up pass focused on (a) eliminating obsolete damage-type references, (b) Section 22
description↔data alignment, (c) thematic description quality.

### Obsolete damage types — fully eliminated
Canonical set per §24A: `physical, ember, rime, storm, arcane, primal, blight, wyrd`. Anything
else is obsolete. Final scanner result: **0 data-field hits, 0 prose hits** across all 20 classes
+ 10 races.

| Work | Count |
|---|---|
| Prose replacements "<legacy> damage" → "<canonical> damage" in class descriptions | 349 |
| Prose replacements in race descriptions | 47 |
| `vulnerabilityType` data fixes (fire→ember, lightning→storm, necrotic→blight) | 4 |
| **Shape-word `damageTypes` bug** — `["direct"]`/`["area"]` were delivery-shape values misplaced into the element array; corrected to real elements from each spell's `elementType`/`school` | **38** (apex 19, minstrel 19) |
| School/data mismatches fixed (tox_toxic_wave school ember→blight; etc.) | 2 |

*(arcanoneer `damageTypes:["random"]` is an **intentional** "random damage type" marker inside a
`randomEffects` table — left as-is. `toxicologistSpells_new.js` is an unused orphan file — left.)*

### Section 22 description↔data alignment fixes
- All vague "massive damage"/"devastating damage" spell descriptions rewritten with **exact
  numbers** from each spell's `damageConfig` (apex Shadow Strike, arcanoneer Primal Cataclysm,
  berserker Primal Cataclysm, martyr Willing Vessel & Judgment Day, minstrel Magnum Opus &
  Legendary Performance, Warden Flayed Ascendancy).
- Description↔data contradictions corrected: chronarch (psychotic→arcane, necrotic→blight),
  False Prophet (psychic→wyrd, necrotic→blight), gambit (psychic/necrotic→wyrd/blight),
  harbinger (force→storm, fire→ember), lunarch (necrotic→blight), plaguebringer **Plague God**
  (removed false "immunity to poison and necrotic" claims not present in data), spellguard
  (bludgeoning→physical), pyrofiend (fire→ember).
- 24 thin Toxicologist spell descriptions enhanced to full Pathfinder-style prose with exact
  damage/DC/durations.

### Verification
- `formula:'SPECIAL'` anywhere: **0**
- Raw code tokens (`CARD_VALUE`, `HEADS_COUNT`, `INFERNO_STACKS`, etc.) in descriptions: **0**
- Non-canonical `damageTypes` arrays in live files: **0**
- Obsolete damage words in descriptions (fire/frost/necrotic/psychic/etc.): **0**
- All edited files pass `node --check`.
