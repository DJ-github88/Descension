# 30-Class Roster Implementation Ledger

**Date:** 2026-10-30  
**Status:** Approved HeadQ Baseline and Implementation Ledger  
**Baseline:** `master` / `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`, clean with respect to class integrations, pre-existing concurrent work preserved.  
**Roster Target:** 30 Player-Facing Classes (24 currently complete and selectable; 5 returning classes blocked pending content reconstruction; 1 proposed class direction).

---

## 1. Executive Summary & Roster Accounting

HeadQ has established an approved target roster of **30 player-facing classes**. In accordance with the Settled HeadQ Decisions and the core integration rule:
> *"Integrate each class only when its package is complete enough for the existing character-creation and character-sheet paths. A class is not complete merely because its name appears in a selector. Stop at a precise class/package boundary if a required approved lore decision or source record is missing; finish independent work and report the exact blocker rather than registering a partial or misleading class."*

### Roster Status Breakdown

| Category | Count | Classes |
|---|---|---|
| **Complete & Selectable** | **26** | Animist, Arcanoneer, Berserker, Chaos Weaver, Chronarch, Covenbane, Crusader, Deathcaller, Doomsayer, Dreadnaught, Druid, Exorcist, False Prophet, Fate Weaver, Gambler, Hunter, Lichborne, Lunarch, Martyr, Minstrel, Oracle, Plaguebringer, Pyrofiend, Spellguard, Toxicologist, Warden |
| **Returning Classes (Blocked)** | **3** | Bladedancer, Inscriptor, Witch Doctor |
| **Proposed Class (Proposal-Only)** | **1** | Totemist |
| **Total Target Roster** | **30** | — |
| **Retired Identities (Load/Edit Preserved)** | **7** | Gambit (`gambit`), Augur (`augur`), Harbinger (`harbinger`), Apex (`apex`), Shaper (`shaper`), Revenant (`revenant`), Inquisitor (`inquisitor`) |

---

## 2. Settled HeadQ Decisions Ledger

1. **Animist vs. Totemist:**
   - **Animist** remains a distinct, selectable player-facing class. Its full existing package (49 spells across pools 1–10, 3 full 50-point talent trees `ANIMIST_THORNWARDEN`, `ANIMIST_SPIRIT_BINDER`, `ANIMIST_STORMSCRIBE`, SVG resource bar, and provenance) is fully preserved.
   - **Totemist** is a new, creator-approved class direction. It has zero authored historical code or modules in the repository history. It must NOT copy, rename, replace, merge, or overwrite Animist's data, trees, spells, IDs, or cultural roots.
2. **Covenbane & Exorcist vs. Inquisitor:**
   - **Covenbane** and **Exorcist** return as independent classes.
   - **Inquisitor** is retired from new character creation, but preserved for existing character inspection, loading, and editing without automatic or silent conversion.
3. **Dreadnaught vs. Martyr:**
   - **Dreadnaught** returns as an independent class.
   - **Martyr** remains independent. Martyr's `ironclad` tree (`MARTYR_IRONCLAD`, IDs `icl_t1_*`–`icl_t7_*`) is strictly preserved and must NOT be reallocated or stripped from existing Martyr characters.
4. **Bladedancer, Inscriptor, and Witch Doctor:**
   - Return as independent classes once their complete modern packages are reconstructed and approved.
5. **Permanently Retired / Merged Identities:**
   - **Titan**, **Formbender**, and **Huntress** do not return as separate player-facing classes.
   - **Augur** is merged into **Fate Weaver**; **Oracle** remains independent.
   - **Revenant** is retired, split between **Deathcaller** and **Lichborne**; no combined Revenant class is restored.
   - **Shaper** is superseded by **Druid** (transformation identity, no generic D&D nature assumptions).
   - **Apex** is superseded by **Hunter** (independent, companion optional).
   - **Doomsayer** is the approved player-facing name; **Harbinger** remains legacy material.
   - **Chaos Weaver** remains independent.

---

## 3. Class-by-Class Implementation Ledger

### Cohort A: Currently Complete & Selectable Classes (25)

| Class | Historical Source | Current Codebase Presence | Preserved Records & IDs | Reconstructed / Authored Content | UI & Progression Integration | Readiness Status |
|---|---|---|---|---|---|---|
| **Animist** | Pre-consolidation `animistData.js`, `animist.js` | Complete (`animistData.js`, `talentTrees/animist.js`, `resourceSystems/animistResourceGuide.js`) | 49 spells (pools 1–10), 3 trees (`ANIMIST_THORNWARDEN`, `ANIMIST_SPIRIT_BINDER`, `ANIMIST_STORMSCRIBE`), IDs `animist_*` | Preserved complete; level-1 spell icon override `animist_bone_reading` | Creation selector, wizard Step 1/Step 9, rules detail, talent viewer, ClassResourceBar, level-up choices | **Complete** |
| **Arcanoneer** | `arcanoneerData.js`, `arcanoneer.js` | Complete (`arcanoneerData.js`, `talentTrees/arcanoneer.js`, `resourceSystems/arcanoneerResourceGuide.js`) | 40+ spells (pools 1–10), 3 trees (`ARCANONEER_SIEGE_MAGE`, `ARCANONEER_SPELLSLINGER`, `ARCANONEER_AETHER_ENGINEER`) | Full 50-pt trees, Elemental Spheres (12 spheres combination system), level-down talent pruning | Creation, wizard, rules detail, talent viewer, ArcanoneerResourceBar, level-down tests | **Implemented (Selectable)** |
| **Berserker** | `berserkerData.js`, `berserker.js` | Complete (`berserkerData.js`, `talentTrees/berserker.js`, `resourceSystems/berserkerResourceGuide.js`) | 40+ spells, 3 trees (`BERSERKER_JUGGERNAUT`, `BERSERKER_FRENZY`, `BERSERKER_WARCRY`), Rage bar | Full 50-pt trees, Rage mechanic (0–100), level-down talent pruning | Creation, wizard, rules detail, talent viewer, RageBarResourceBar, level-down tests | **Complete** |
| **Chaos Weaver** | RI-1 reconstruction package | Complete (`chaosWeaverData.js`, `talentTrees/chaosWeaver.js`, `resourceSystems/chaosWeaverResourceGuide.js`) | 49 active / 48 passive / 54 nodes, fixed six Possibility Tile IDs (`cw1_01`–`cw1_06`, `cw_tile_*`) | Possibility Tile economy, 4 zones, 50-pt trees | Creation, wizard, rules detail, talent viewer, ChaosWeaverResourceDisplay, progression slice | **Complete** |
| **Chronarch** | `chronarchData.js`, `chronarch.js` | Complete (`chronarchData.js`, `talentTrees/chronarch.js`, `resourceSystems/chronarchResourceGuide.js`) | 40+ spells, 3 trees (`CHRONARCH_TIME_KEEPER`, `CHRONARCH_RIFT_WALKER`, `CHRONARCH_PARADOX`) | Full 50-pt trees, Time Shards & Strain, level-down talent pruning | Creation, wizard, rules detail, talent viewer, TimeShardsStrainResourceBar | **Complete** |
| **Covenbane** | Pre-consolidation `covenbaneData.js`, `covenbane.js` | Complete (`covenbaneData.js`, `talentTrees/covenbane.js`, `resourceSystems/covenbaneResourceGuide.js`, `hud/CovenbaneResourceDisplay.jsx`) | 96 records (2 core, 40 optional, 6 talent actives, 48 passives), 3 trees (`shadowbane`, `spellbreaker`, `demonhunter`), 54 nodes, Hexbreaker Charges (0–6) | Complete CR1 package; 4/level (levels 1-10) with >=2 non-damage; zero Inquisitor collision | Creation selector, wizard Step 1/Step 4/Step 9, rules detail, talent viewer, ClassResourceBar, progressionSlice level-down pruning | **Complete & Verified** |
| **Crusader** | `crusaderData.js`, `crusader.js` | Complete (`crusaderData.js`, `talentTrees/crusader.js`, `resourceSystems/crusaderResourceGuide.js`) | 40+ spells, 3 trees (`CRUSADER_JUSTICIAR`, `CRUSADER_BASTION`, `CRUSADER_ZEALOT`), Fervor (0–100) | Full 50-pt trees, Consecrated Ground, level-down talent pruning | Creation, wizard, rules detail, talent viewer, CrusaderResourceBar | **Complete** |
| **Deathcaller** | Pre-consolidation / RI-3 package | Complete (`deathcallerData.js`, `talentTrees/deathcaller.js`, `resourceSystems/deathcallerResourceGuide.js`) | Dead Muster resource, finite muster slots, 40+ spells, 3 trees | Complete RI-3 reconstruction, manual command action tracking | Creation, wizard, rules detail, talent viewer, DeathcallerResourceDisplay | **Complete** |
| **Doomsayer** | Historical Harbinger / RI-5 package | Complete (`doomsayerData.js`, `talentTrees/doomsayer.js`, `resourceSystems/doomsayerResourceGuide.js`) | Calamities & Havoc (0–15), 40+ spells, 3 trees | Replaced Harbinger Mayhem with two public calamities | Creation, wizard, rules detail, talent viewer, DoomsayerResourceDisplay | **Complete** |
| **Dreadnaught** | Pre-consolidation `dreadnaughtData.js`, `dreadnaught.js` | Complete (`dreadnaughtData.js`, `talentTrees/dreadnaught.js`, `resourceSystems/dreadnaughtResourceGuide.js`, `hud/DreadnaughtResourceDisplay.jsx`) | 96 records (2 core, 40 optional, 6 talent actives, 48 passives), 3 trees (`siegebastion`, `furnaceengine`, `juggernaut`), 54 nodes, Furnace Pressure (0–100 PSI) | Complete CR1 package; 4/level (levels 1-10) with >=2 non-damage; hydraulic pistons and firebox boiler; strict Martyr Ironclad (`icl_*`) separation | Creation selector, wizard Step 1/Step 9, rules detail, talent viewer, ClassResourceBar, progressionSlice level-down pruning | **Complete & Verified** |
| **Druid** | Historical Shaper / RI-4 package | Complete (`druidData.js`, `talentTrees/druid.js`, `resourceSystems/druidResourceGuide.js`) | Anatomical Loadout, 3 bodies, 2 active slots, 40+ spells, 3 trees | Transformation adaptation, transition costs, no D&D nature assumptions | Creation, wizard, rules detail, talent viewer, DruidResourceDisplay, infoSlice reconciliation | **Complete** |
| **Exorcist** | Pre-consolidation `exorcistData.js`, `exorcist.js` | Complete (`exorcistData.js`, `talentTrees/exorcist.js`, `resourceSystems/exorcistResourceGuide.js`, `hud/ExorcistResourceDisplay.jsx`) | 96 records (2 core, 40 optional, 6 talent actives, 48 passives), 3 trees (`liturgist`, `sineater`, `purger`), 54 nodes, Purification Sanctity (0–10) | Complete CR1 package; 4/level (levels 1-10) with >=2 non-damage; host protection and sin-eating; fiend binding rejected; zero Inquisitor collision | Creation selector, wizard Step 1/Step 9, rules detail, talent viewer, ClassResourceBar, progressionSlice level-down pruning | **Complete & Verified** |
| **False Prophet** | `falseProphetData.js`, `falseprophet.js` | Complete (`falseProphetData.js`, `talentTrees/falseprophet.js`, `resourceSystems/falseProphetResourceGuide.js`) | Madness resource, 40+ spells, 3 trees (`FALSE_PROPHET_DECEIVER`, `FALSE_PROPHET_ZEALOT`, `FALSE_PROPHET_HERETIC`) | Full 50-pt trees, Congregation mechanics, Madness scaling | Creation, wizard, rules detail, talent viewer, MadnessGaugeResourceBar | **Complete** |
| **Fate Weaver** | Historical Augur / RI-2 package | Complete (`fateWeaverData.js`, `talentTrees/fateWeaver.js`, `resourceSystems/fateWeaverResourceGuide.js`) | Fate Links (3 threads), 40+ spells, 3 trees | Consensual links, thread severance, absorbed Augur material | Creation, wizard, rules detail, talent viewer, FateWeaverResourceDisplay | **Complete** |
| **Gambler** | Historical Gambit / RI-2 package | Complete (`gamblerData.js`, `talentTrees/gambler.js`, `resourceSystems/gamblerResourceGuide.js`) | Hand & Fortune (20 cards, hand 5, bank 7), 40+ spells, 3 trees | Committed stakes, finite hand, absorbed Gambit material | Creation, wizard, rules detail, talent viewer, GamblerResourceDisplay | **Complete** |
| **Hunter** | Historical Apex / RI-4 package | Complete (`hunterData.js`, `talentTrees/hunter.js`, `resourceSystems/hunterResourceGuide.js`) | Quarry & Evidence, 40+ spells, 3 trees | Solo pursuit tracking, optional companion path, no forced pet | Creation, wizard, rules detail, talent viewer, HunterResourceDisplay, infoSlice reconciliation | **Complete** |
| **Lichborne** | Historical Revenant / RI-3 package | Complete (`lichborneData.js`, `talentTrees/lichborne.js`, `resourceSystems/lichborneResourceGuide.js`) | Lich Anchor & Vessel Integrity, 40+ spells, 3 trees | Explicit anchor stages, cold control, absorbed Revenant material | Creation, wizard, rules detail, talent viewer, LichborneResourceDisplay | **Complete** |
| **Lunarch** | `lunarchData.js`, `lunarch.js` | Complete (`lunarchData.js`, `talentTrees/lunarch.js`, `resourceSystems/lunarchResourceGuide.js`) | Lunar Phases (New, Waxing, Full, Waning), 40+ spells, 3 trees | Full 50-pt trees, Phase transition shock, gravity fields | Creation, wizard, rules detail, talent viewer, LunarchResourceBar | **Complete** |
| **Martyr** | `martyrData.js`, `martyr.js`, `martyrIronclad.js` | Complete (`martyrData.js`, `talentTrees/martyr.js`, `resourceSystems/martyrResourceGuide.js`) | Devotion (Tiers 1–6), 40+ spells, 4 trees (including `MARTYR_IRONCLAD`, `icl_t1_*`–`icl_t7_*`) | Preserved 4 trees; level-down talent pruning | Creation, wizard, rules detail, talent viewer, MartyrResourceBar, level-down tests | **Complete** |
| **Minstrel** | `minstrelData.js`, `minstrel.js` | Complete (`minstrelData.js`, `talentTrees/minstrel.js`, `resourceSystems/minstrelResourceGuide.js`) | Notes & Chords, 40+ spells, 3 trees (`MINSTREL_BALLADEER`, `MINSTREL_VIRTUOSO`, `MINSTREL_SKALD`) | Full 50-pt trees, 7-note compositions, level-down talent pruning | Creation, wizard, rules detail, talent viewer, MinstrelResourceBar | **Complete** |
| **Oracle** | RI-5 reconstruction package | Complete (`oracleData.js`, `talentTrees/oracle.js`, `resourceSystems/oracleResourceGuide.js`) | Forecasts (2 slots), 40+ spells, 3 trees | Independent prophecy, bounded forecast outcomes, no debt | Creation, wizard, rules detail, talent viewer, OracleResourceDisplay | **Complete** |
| **Plaguebringer** | `plaguebringerData.js`, `plaguebringer.js` | Complete (`plaguebringerData.js`, `talentTrees/plaguebringer.js`, `resourceSystems/plaguebringerResourceGuide.js`) | Virulence (0–100), 40+ spells, 3 trees (`PLAGUEBRINGER_CONTAGION`, `PLAGUEBRINGER_MIASMA`, `PLAGUEBRINGER_OUTBREAK`) | Full 50-pt trees, host infection rules, pathogen vectors | Creation, wizard, rules detail, talent viewer, PlaguebringerResourceBar | **Complete** |
| **Pyrofiend** | `pyrofiendData.js`, `pyrofiend.js` | Complete (`pyrofiendData.js`, `talentTrees/pyrofiend.js`, `resourceSystems/pyrofiendResourceGuide.js`) | Heat & Overheat (0–100), 40+ spells, 3 trees (`PYROFIEND_HELLFIRE`, `PYROFIEND_COMBUSTION`, `PYROFIEND_ASH`) | Full 50-pt trees, thermal self-damage, firestorm zones | Creation, wizard, rules detail, talent viewer, PyrofiendResourceBar | **Complete** |
| **Spellguard** | `spellguardData.js`, `spellguard.js` | Complete (`spellguardData.js`, `talentTrees/spellguard.js`, `resourceSystems/spellguardResourceGuide.js`) | Aegis Energy (0–100), 40+ spells, 3 trees (`SPELLGUARD_AEGIS`, `SPELLGUARD_ABJURATION`, `SPELLGUARD_NULLIFICATION`) | Full 50-pt trees, magic interception, venting, level-down talent pruning | Creation, wizard, rules detail, talent viewer, SpellguardResourceBar | **Complete** |
| **Toxicologist** | `toxicologistData.js`, `toxicologist.js` | Complete (`toxicologistData.js`, `talentTrees/toxicologist.js`, `resourceSystems/toxicologistResourceGuide.js`) | Toxin Vials (0–6), 40+ spells, 3 trees (`TOXICOLOGIST_VENOM`, `TOXICOLOGIST_MIXTURE`, `TOXICOLOGIST_ANTIDOTE`) | Full 50-pt trees, prepared chemical concoctions, level-down talent pruning | Creation, wizard, rules detail, talent viewer, ToxicologistResourceBar | **Complete** |
| **Warden** | `wardenData.js`, `warden.js` | Complete (`wardenData.js`, `talentTrees/warden.js`, `resourceSystems/wardenResourceGuide.js`) | Gaol Tension & Chains, 40+ spells, 4 trees (`WARDEN_GAOLER`, `WARDEN_JUSTICIAR`, `WARDEN_SENTINEL`, `WARDEN_VERDANT`) | Preserved 4 trees, captive tension mechanics, level-down talent pruning | Creation, wizard, rules detail, talent viewer, GaolerResourceBar | **Complete** |

---

### Cohort B: Returning Classes (3 — Proposed Packages Awaiting Creator Decisions)

| Class | Historical Source | Current Codebase Presence | Preserved Records & IDs | Content Authored | UI & SVG HUD Status | Open Decisions & Blockers | Status |
|---|---|---|---|---|---|---|---|
| **Bladedancer** | Pre-consolidation `bladedancerData.js` (49.5KB), `bladedancer.js` (12.1KB, 30 nodes) | None in production data | 16 historical spells (`bladedancer_*`), Momentum resource concept | Authored blueprint with 2 core, sample optional picks, 6 talent actives, 3 trees | `BladedancerResourceDisplay.jsx` preview component authored & tested | Italian tempo names and Skaldic origin are unapproved proposals; dual scimitars vs Twin Blades/Serrated Saber; demarcation from Monk/Hunter | **Proposed** (Pending Creator Decision) |
| **Inscriptor** | Pre-consolidation `inscriptorData.js` (93.0KB), `inscriptor.js` (13.4KB, 38 nodes) | None in production data | 37 historical spells (`inscriptor_*`), Runic Resonance resource | Authored blueprint with 2 core, sample optional picks, 3 trees | `InscriptorResourceDisplay.jsx` preview component authored & tested | Stationary terrain/body carving vs portable slate tablets; runic lexicon integration | **Proposed** (Pending Creator Decision) |
| **Witch Doctor** | Pre-consolidation `witchDoctorData.js` (116.4KB), `witchdoctor.js` (16.7KB, 41 nodes) | None in production data | 34 historical spells (`witch_doctor_*`), Voodoo Essence resource | Authored blueprint with 2 core, sample optional picks, 3 trees | `WitchDoctorResourceDisplay.jsx` preview component authored & tested | Bog Tallow and renamed traditions (Hexweaver, Bog Apothecary, Miasma Priest) are proposed; demarcation from Animist | **Proposed** (Pending Creator Decision) |

---

### Cohort C: Proposed Class Direction (1 — Proposed Package Awaiting Creator Decision)

| Class | Historical Source | Current Codebase Presence | Preserved Records & IDs | Content Authored | UI & SVG HUD Status | Open Decisions & Blockers | Status |
|---|---|---|---|---|---|---|---|
| **Totemist** | None (0 historical records in repo history; new creator direction) | Mentioned in compatibility notes only | None | Authored blueprint with 2 core, sample optional picks, 3 trees | `TotemistResourceDisplay.jsx` preview component authored & tested | Physical ground-anchored conduit pylons with grid durability vs Animist ancestral spirits; entire mechanics/lore proposed | **Proposed** (Pending Creator Decision) |

---

## 4. Architectural Rules and Compatibility Verification

1. **Inquisitor Retirement & Non-Destructive Load:**
   - Inquisitor is registered in `RETIRED_OR_SUPERSEDED_CLASS_NAMES` in `classDisplayData.js`.
   - Excluded from `getSelectableClassNames()` and new character creation wizards.
   - Preserved in `CLASS_DISPLAY_DATA` and `inquisitorData.js` so that pre-existing Inquisitor characters load with their full stats, resources (Fervor/Condemnation), and spells without automatic conversion.
2. **Animist Preservation & Independence:**
   - Animist is registered as a canonical selectable class (23rd entry in active roster).
   - Removed from `RETIRED_OR_SUPERSEDED_CLASS_NAMES`.
   - `classReconstructionCompatibility.js` records Animist as `under-review` with `successors: []`, documenting that Animist is retained intact and Totemist is a separate future direction.
3. **Martyr & Dreadnaught Demarcation:**
   - Martyr retains `MARTYR_IRONCLAD` with its exact node IDs (`icl_t1_*` through `icl_t7_*`).
   - Dreadnaught will receive independent IDs (`dread_*`) and its own furnace/fortress trees upon implementation.
4. **Registration Gate:**
   - Classes remain in their respective blocked or proposal-only state until complete content locks are approved and full class packages (data, trees, resources, provenance, tests) are constructed. No partial or stub classes are registered into selectors.
