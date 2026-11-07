# CLASS HEADQ — CLASS FANTASY, RESOURCE AND TABLETOP IDENTITY AUDIT
## Evidence Reconciliation and Design Follow-up Report (Corrected Edition)

**Status:** Focused First-Pass Design Audit & Evidence Reconciliation (Read-Only Forensic Assessment of Listed Cohort and Related Classes)  
*Note: This is a focused first-pass audit of the specified cohort and predecessor relationships, not a completed identity audit of all 30 selectable classes.*  
**Date:** 2026-11-03  
**Auditor:** Antigravity (Class HeadQ Design Auditor)  
**Workspace:** `d:\VTT`  
**Current HEAD:** `00c4319a915d9025cfc35a122ac28dca516405c9` (Tue Nov 3 21:31:35 2026 +0100)  
**Branch Status:** `master` (Tracked commit `00c4319a`; concurrent unstaged modifications from parallel engineering tracks strictly preserved)  
**Reference Snapshots:**
- Prior Audit Snapshot HEAD: `bdd75bb00cf5794f2f2caa7c493a424071d54e8b` (Tue Nov 3 21:26:41 2026 +0100)
- Public Master Snapshot: `7e6361256736fe5f23235b8b7278ffe67f3861a8` (Mon Nov 2 22:06:12 2026 +0100)
- Pre-Consolidation Snapshot: `aa54e9df07f1137a48da950a8cd13fda643041e5` (Mon Jun 8 09:25:54 2026 +0200)
- Consolidation Commit: `fc0966276431eaa60c675a72df1625061287627e` (Thu Jun 11 22:28:08 2026 +0200)

---

## Section A: Scope, Authority, and Roster Status

### A.1 Authority and Change Boundaries

All findings and classifications in this document strictly enforce the Creator’s hierarchical boundaries:
1. **`[CREATOR-APPROVED direction]`** takes absolute precedence over older repository planning documents, audit reports, and already-coded implementations. No conflict has been silently reconciled by selecting whatever rule is already implemented in code.
2. **Explicit Verification and Authority Distinctions Applied Throughout:**
   - **`[CREATOR-APPROVED direction]`**: Authoritative, binding creative directions established directly by the game creator.
   - **`[HISTORICAL DRAFT]`**: Historical repository text or records proving a mechanic once existed at an exact Git revision; does not establish creator approval, unique ownership, or permission to restore.
   - **`[RECONSTRUCTION PROPOSAL]`**: Unapproved intermediate design proposals, notes, or briefs generated during reconstruction passes.
   - **`[CURRENT AUTHORED CONTENT]`**: Exact authored data, records, guides, or cards currently living in `vtt-react/src/data/classes/`.
   - **`[IMPLEMENTED]`**: Modules, components, or stores currently committed in the working tree.
   - **`[TEST COVERAGE]`**: Validated by a named automated unit/integration test (e.g. Jest schema or level-pruning test), with exact assertions stated.
   - **`[MOCK / BROWSER-PREVIEW EVIDENCE]`**: Observed in isolated test harnesses, standalone scripts, or mock-SVG preview witnesses; **distinct from production React component browser verification**.
   - **`[PRODUCTION COMPONENT VERIFICATION]`**: Verified in the live, integrated application UI running real React components with full state stores.
   - **`[ACCEPTED]`**: Formally accepted within a stated project contract milestone.
   - **`[DEPLOYMENT]`**: Integrated and bundled into staging or production builds.
   - **`[OPEN / unresolved]`**: Blocked pending creative authority or reconciliation.
   - **`[UNVERIFIED / REPORTED]`**: Where the report lacks a directly inspected test, screenshot, build identity, source line, or Git revision, the claim is labeled as reported or unverified rather than upgraded.
3. **Preservation Invariant:** Stable class IDs, legacy character data, concurrent user work, class selectors, and heritage registry access remain 100% untouched. No application code, class mechanics, spell libraries, talent trees, Laws, migrations, selectors, assets, or saves were modified.
4. **Non-Acceptance Notice:** Passing tests, complete spell counts, three-tree structures, SVG resource bars, and successful builds do not establish tabletop identity fidelity. **No class has been accepted for identity by this audit.** This report represents a focused first-pass audit of the listed cohort and related classes, not a completed identity audit of all 30 selectable classes.

---

### A.2 Selectable Roster Accounting and Selector Reconciliation

In `vtt-react/src/data/classes/classDisplayData.js` (SHA-256: `76417a6a3ccb30419fb535bf09bcb3b1b0ea4c1720b7b04c1a09c227b9c23690`):
- Line 666 contains a **stale historical comment**: `// Approved player-facing canonical roster (23 classes).`
- `CLASS_DISPLAY_ENTRIES` contains **40 raw top-level display entries**.
- Three (3) entries are **Nereid compatibility aliases** defined in `CLASS_COMPATIBILITY_ALIASES` (`vtt-react/src/data/classHeritageRegistry.js`):
  `'Nereid Myrathil Apex'`, `'Nereid Myrathil Animist'`, and `'Nereid Myrathil Augur'`.
- `CLASS_DISPLAY_DATA` filters out these 3 aliases, yielding **37 registered base class entries**.
- Seven (7) entries are explicitly listed in `RETIRED_OR_SUPERSEDED_CLASS_NAMES`:
  `'Gambit'`, `'Augur'`, `'Harbinger'`, `'Apex'`, `'Shaper'`, `'Revenant'`, and `'Inquisitor'`.
- The real selector filtering in `classDisplayData.js:667–675`:
  ```javascript
  export const CANONICAL_ROSTER_DATA = CLASS_DISPLAY_DATA.filter(
      entry => !RETIRED_OR_SUPERSEDED_CLASS_NAMES.includes(entry.name)
  );
  export const getSelectableClassNames = () => getCanonicalClassNames();
  ```
- **Selectable Roster Computation:**
  $$\mathbf{40}\text{ (raw entries)} - \mathbf{3}\text{ (Nereid aliases)} - \mathbf{7}\text{ (retired/superseded)} = \mathbf{30}\text{ Selectable Class Names}$$
- Verified by Jest test `vtt-react/src/data/classes/__tests__/characterClassSelectors.test.js:48–78`, which asserts that `getSelectableClassNames()` returns **30 unique names**. This test validates selector array filtering only; it cannot establish that all 30 classes are creator-approved or identity-accepted.

---

### A.3 Audited Cohort Status Matrix

| Class | Creator Approval Status | Historical Evidence | Current Authored Content | Implementation State | Verification State | Identity Fidelity Verdict |
|---|---|---|---|---|---|---|
| **Doomsayer** | `[CREATOR-APPROVED direction]` Two-dice prophecy boundary function mandatory ($L < R < H$, doubles never Prophesied) | `[HISTORICAL DRAFT]` `historical-definitions.json` (35 spells; Havoc 0–15 is historical draft, not settled rule) | `[CURRENT AUTHORED CONTENT]` 96 `cr1_doomsayer_*` records, Calamity clocks (0 dice) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema & level-pruning in `doomsayerIntegration.test.js` | **RECOVER & EVALUATE**: Calamities replaced prophecy; must restore two-dice system; exchange rates & topology open |
| **Exorcist** | `[CREATOR-APPROVED direction]` Ritual demon binding, command/control, extermination | `[HISTORICAL DRAFT]` Pre-consolidation `exorcistData.js` (`aa54e9df`), Dominance Die evidence to evaluate | `[CURRENT AUTHORED CONTENT]` 96 `cr1_exorcist_*` records, Sanctity (0–10), Sin-Eating; retains containment records | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `exorcistIntegration.test.js`; `[MOCK / PREVIEW]` Mock-SVG preview witness (not production React verification) | **RECOVER & EVALUATE**: Current Sin-Eating/Sanctity diverges from approved direction; historical Dominance Die is evidence to evaluate |
| **Druid** | `[CREATOR-APPROVED direction]` Whole-body shapeshifting, form boons, living-world magic | `[HISTORICAL DRAFT]` `formbenderData.js` (`aa54e9df`, 3,643 lines), `shaperData.js` (`fc096627`) | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_druid_*` records, Anatomical Loadouts (authored proposal, not approved solution) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `druidIntegration.test.js` | **CLARIFY & EVALUATE**: Modular loadouts conflict with whole-body shapeshifting; resource & limits open |
| **Fate Weaver** | `[CREATOR-APPROVED direction]` Tarot identity preferred; cards central; distinct from Gambler/Oracle | `[HISTORICAL DRAFT]` Pre-consolidation `fateWeaverData.js` (`aa54e9df`), merged in `fc096627` | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_fate_weaver_*` records, 3 thread tokens (not accepted as final identity; 0 cards) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `fateWeaverIntegration.test.js` | **EVALUATE & REDESIGN**: Thread tokens not accepted as final identity; Root/Turning/Consequence is unapproved proposal |
| **False Prophet** | `[CREATOR-APPROVED direction]` Charismatic manipulation, hubris, movement-building; practitioners believe in a calling (source may be unknown/misidentified) | `[HISTORICAL DRAFT]` `falseProphetData.js` pre-consolidation (`aa54e9df`) | `[CURRENT AUTHORED CONTENT]` 40+ spells, Madness (0–20), random dice increments | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Roster filtering in `characterClassSelectors.test.js` | **CLARIFY & REDESIGN**: Calling is not asserted to be objectively real or apocalyptic; Convulsion stun loop incoherent |
| **Dreadnaught** | `[CREATOR-APPROVED direction]` Ultimate defensive anchor; culturally varied expressions of surviving pressure approved; distinct from Martyr | `[HISTORICAL DRAFT]` Pre-consolidation `dreadnaughtData.js` (`aa54e9df`) | `[CURRENT AUTHORED CONTENT]` 96 `cr1_dreadnaught_*` records, Furnace Pressure (0–100 PSI) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` State validation in `dreadnaughtIntegration.test.js` (`psi: 90` valid state); `[MOCK / PREVIEW]` Mock-SVG preview witness | **CLARIFY**: Industrial expression may remain but not imposed on all cultures; 90 vs 91 PSI Overheat unresolved |
| **Covenbane** | `[CREATOR-APPROVED direction]` Independent occult/anti-magic hunter | `[HISTORICAL DRAFT]` Pre-consolidation `covenbaneData.js` (`aa54e9df`), Hexbreaker Charges | `[CURRENT AUTHORED CONTENT]` 96 `cr1_covenbane_*` records, Hexbreaker (0–6), null-salt/cold iron | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `covenbaneIntegration.test.js`; `[MOCK / PREVIEW]` Mock-SVG preview witness | **KEEP**: High fidelity to anti-magic / hexbreaking fantasy; distinct records from Exorcist |
| **Bladedancer** | `[RECONSTRUCTION PROPOSAL]` Returning class package | `[HISTORICAL DRAFT]` Pre-consolidation `bladedancerData.js` (49.5KB, Momentum) | `[CURRENT AUTHORED CONTENT]` 96 `cr1_bladedancer_*` records, Momentum (0–10), Italian tempos, `+2 AC` | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `bladedancerIntegration.test.js` | **ASSESS FIT**: Assess Italian tempo terms and `+2 AC` record for compatibility with Mythrill rules |
| **Inscriptor** | `[RECONSTRUCTION PROPOSAL]` Returning class package | `[HISTORICAL DRAFT]` Pre-consolidation `inscriptorData.js` (93KB, Runic Resonance) | `[CURRENT AUTHORED CONTENT]` 96 `cr1_inscriptor_*` records, Runic Resonance (0–10), bone stylus | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `inscriptorIntegration.test.js` | **CLARIFY**: Stationary terrain carving vs portable slate tablets unresolved proposal |
| **Witch Doctor** | `[RECONSTRUCTION PROPOSAL]` Returning class package | `[HISTORICAL DRAFT]` Pre-consolidation `witchDoctorData.js` (116KB, Voodoo Essence) | `[CURRENT AUTHORED CONTENT]` 96 `cr1_witch_doctor_*` records, Bog Tallow (0–100%), poppets | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `witchDoctorIntegration.test.js` | **CLARIFY**: Bog Tallow lore and tradition naming are unapproved proposals; distinct records from Animist |
| **Totemist** | `[CREATOR-APPROVED direction]` Distinct from Animist | `[HISTORICAL DRAFT]` Zero (0) records in git history | `[CURRENT AUTHORED CONTENT]` 96 `cr1_totemist_*` records, Conduit Attunement (0–10), 3 Pylon Slots (authored proposals) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `totemistIntegration.test.js` | **CLARIFY**: Physical pylons, conduit slots, zoning, and Conduit Attunement are authored proposals |
| **Animist** | `[CREATOR-APPROVED direction]` Distinct class; living-memorial medium & spirit communion | `[HISTORICAL DRAFT]` Pre-consolidation `animistData.js` (49 spells, 3 trees) | `[CURRENT AUTHORED CONTENT]` Retained complete package, Resonance / Spirits | `[IMPLEMENTED]` Complete in registry | `[TEST COVERAGE]` Roster filtering in `characterClassSelectors.test.js` | **KEEP**: Autonomous identity; distinct mechanics from Totemist |
| **Hunter** | `[CREATOR-APPROVED direction]` Preferred successor to Apex; solo pursuit | `[HISTORICAL DRAFT]` `apexData.js` (Marks, Companion, Glaive Dancer) | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_hunter_*` records, Quarry & Evidence | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `hunterIntegration.test.js` | **KEEP**: Solo pursuit and optional companion succeed Apex cleanly |
| **Gambler** | `[CREATOR-APPROVED direction]` Wagering class; cards & dice | `[HISTORICAL DRAFT]` Pre-consolidation `gamblerData.js` (`aa54e9df`), merged in `gambitData.js` | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_gambler_*` records, Hand & Fortune (20 cards, hand 5) | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `gamblerIntegration.test.js` | **KEEP / CLARIFY**: High fidelity wagering identity; must surrender tarot ground to Fate Weaver |
| **Oracle** | `[CREATOR-APPROVED direction]` Independent finite forecasts; distinct from Fate Weaver | `[HISTORICAL DRAFT]` `oracleData.js` pre-consolidation | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_oracle_*` records, Forecasts (2 slots), no debt | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `oracleIntegration.test.js` | **KEEP**: Distinct prepared forecast records and mechanics; separate from Fate Weaver and Doomsayer |
| **Deathcaller** | `[CREATOR-APPROVED direction]` Command of the dead (finite muster, public commands) | `[HISTORICAL DRAFT]` Part of pre-consolidation `revenantData.js` | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_deathcaller_*` records, Dead Muster | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `deathcallerLichborneIntegration.test.js` | **KEEP**: Distinct muster commander records; separate gameplay loop from Exorcist |
| **Lichborne** | `[CREATOR-APPROVED direction]` Anchor mage / controller; continuity bound to vessel | `[HISTORICAL DRAFT]` Part of pre-consolidation `revenantData.js` (Anchor) | `[CURRENT AUTHORED CONTENT]` 40+ `cr1_lichborne_*` records, Lich Anchor Integrity | `[IMPLEMENTED]` Data, trees, HUD bar | `[TEST COVERAGE]` Schema in `deathcallerLichborneIntegration.test.js` | **KEEP**: Direct conceptual successor to Revenant vessel anchor |

---

## Section B: Cohort Evidence Map

### B.1 Focal File Baseline and Hashes
The local working tree was verified at HEAD `00c4319a915d9025cfc35a122ac28dca516405c9`:

| File Path | SHA-256 Hash | Repository Role |
|---|---|---|
| `vtt-react/src/data/classes/classDisplayData.js` | `76417a6a3ccb30419fb535bf09bcb3b1b0ea4c1720b7b04c1a09c227b9c23690` | Active selector filter; 40 raw entries, 3 aliases, 7 retired, 30 selectable names |
| `vtt-react/src/data/classHeritageRegistry.js` | `cf633df94ccc87b2c00920d89a26f6ee4562e27a43c69b6384ef859bb686f888` | Central heritage eligibility and compatibility alias definitions |
| `vtt-react/src/data/classes/classReconstructionCompatibility.js` | `13b6334bd75378dc216cae6778751910f20599324443e5bfc163e506063deada` | Roster compatibility matrix; 0 automatic conversions |
| `vtt-react/src/data/classes/doomsayerData.js` | `774ecc324fe7ed0113a1e0b5f6cbba7dd0d7aab071e0d18a700a0f349f3dc706` | Authored Doomsayer spells and calamity definitions |
| `vtt-react/src/data/classes/exorcistData.js` | `adc36b7a04593462e2ccef8932fd8184094a67b4f4c05ff217fc0533b3d8f576` | Authored Exorcist purification/sin-eating records |
| `vtt-react/src/data/classes/covenbaneData.js` | `2b26b623fcdd3c3fd09c4fbde19527dce83a0734781f28a0e8322126f3099518` | Authored Covenbane anti-magic records |
| `vtt-react/src/data/classes/dreadnaughtData.js` | `0cf962c98a4604407c6a8084aad3bf5becffa79bd15e4907853a2883643ae7dd` | Authored Dreadnaught furnace records |
| `vtt-react/src/data/classes/druidData.js` | `4ad2d6d6ba199b234712fed0538e43ff5e3e2ff8e6c7016fe4cd28ecb377744d` | Authored Druid anatomical loadout records |
| `vtt-react/src/data/classes/fateWeaverData.js` | `f88ecd15694dcf3acc1ee0e2a2a83da77bef6f92e03bc59e24ecaaa4eca9e2a5` | Authored Fate Weaver thread link records |
| `vtt-react/src/data/classes/falseProphetData.js` | `009c96cc08a93de17b53b393c4f5bc5068dce22e112bdac8fc078f158bfccff6` | Authored False Prophet madness records |
| `vtt-react/src/data/classes/gamblerData.js` | `939a9dfc56b1add499e238c323c701f0efa49886d072e6393a50158fb4b6f39b` | Authored Gambler hand & fortune records |
| `vtt-react/src/data/classes/hunterData.js` | `b12ef900fa82ffa8c9324cadb6131590ef23a631491e8974751299d840cf1d0e` | Authored Hunter quarry & evidence records |
| `vtt-react/src/data/classes/deathcallerData.js` | `57d5501325eb2819dfd3d3dd2b7de2514208b1f2ccc097f708a1e3cc1e4ce3f8` | Authored Deathcaller dead muster records |
| `vtt-react/src/data/classes/lichborneData.js` | `00f04efeca9e937dab5d997e407a7d536f8309bb9b1d387c715c0eed8a49af92` | Authored Lichborne anchor records |
| `vtt-react/src/data/classes/oracleData.js` | `b0169b25ec96e1af2c98ba5466ff5b4d457bf49b37fb0861f01236a0904bdba0` | Authored Oracle forecast records |
| `vtt-react/src/data/classes/bladedancerData.js` | `10fe9cb44bd2656db463fe5809783065abdd3f84b7e5498a279c69c14137a1ab` | Authored Bladedancer momentum records |
| `vtt-react/src/data/classes/inscriptorData.js` | `41393960e6d43e8c612b655199bc5b1b09408dfef70d50e9047d99daca101dea` | Authored Inscriptor runic resonance records |
| `vtt-react/src/data/classes/witchDoctorData.js` | `96cacb91aeaa3411d3682d4f340253dfc0cb027b981bc1b37786d27de4aff2ed` | Authored Witch Doctor bog tallow records |
| `vtt-react/src/data/classes/totemistData.js` | `eb28e6b556fd9e6b481aa910fe586c23f576cf69dc25d7bb0560ce54d1f7422d` | Authored Totemist pylon conduit records |
| `vtt-react/src/data/classes/animistData.js` | `97cb0bcc520a3bf88fb2564401ce8e76de09726a57322ea70a21d8589168c15c` | Preserved Animist resonance records |
| `vtt-react/src/data/classes/martyrData.js` | `6e0991a127f81a038e93ee03b53b15d0c402bcdbfa24976c9c25b1f4895cde22` | Preserved Martyr devotion records (4 trees) |
| `vtt-react/src/data/classes/inquisitorData.js` | `72212b3d6bdc3087679fe42088d75534066437b2a120ee488a23df380d30e28a` | Preserved legacy Inquisitor records |
| `vtt-react/src/data/classes/revenantData.js` | `30c67fe51dc3aadc4d5c796ac24b73604985f7fd0b566b0a05babbef6471c425` | Preserved legacy Revenant records |
| `vtt-react/src/data/classes/shaperData.js` | `9db9b8cf1cc748e1be9303c105320733667390fa6086ceee3e863c6352a76d46` | Preserved legacy Shaper records |
| `vtt-react/src/data/classes/apexData.js` | `01dfe635bca2b15b7e3f093602f35c98e183af49de4bde7d05bdb56c8c4ee828` | Preserved legacy Apex records |
| `vtt-react/src/data/classes/gambitData.js` | `e4eb3ef2b664fc4ebbdca45163fa56ac0b39fd5c19227d155280ccf9aef7671d` | Preserved legacy Gambit records |
| `vtt-react/src/data/classes/harbingerData.js` | `994f08c86a6782553399026f6b245a85d3c6f5010180bba7f862d176a5750380` | Preserved legacy Harbinger records |
| `vtt-react/src/data/classes/augurData.js` | `68a6e87e874c8933b007caf851c3bd3862aead27effebdb32b684ce8c9195c61` | Preserved legacy Augur records |

---

### B.2 Historical Git Provenance Reconciliation

1. **Doomsayer Provenance:**
   - **Verification Result:** The file `vtt-react/src/data/classes/doomsayerData.js` **did not exist** in Git at pre-consolidation snapshot `aa54e9df07f1137a48da950a8cd13fda643041e5`.
   - **Actual Source:** Historical Doomsayer definitions exist as an authored JSON recovery artifact at `docs/plans/mythrill-class-reconstruction/evidence/historical-definitions.json` (blob SHA `1bd8c3aec7784e4cec488b3e883548510215ed85`, committed in `78cab7d0b711e8f0c6520563da1fb96513e67a1a` on Sat Oct 17 22:31:12 2026). This JSON file is a later-created evidence artifact compiling pre-consolidation class payloads; the artifact itself did not exist as a Git file at the June 8, 2026 `aa54e9df` snapshot.
   - Exact historical fields in `historical-definitions.json`:
     - Under `classes.Doomsayer.resourceSystem`: Havoc is described as 0–15 (`[HISTORICAL DRAFT]`; this range is historical evidence, not an approved current rule). Range dice generate a Low–High range; targets roll against it; strictly inside = Prophesied, on boundary = Base, outside = Negative/Fizzle/Backlash.
     - Spells show varied die profiles and spell-specific Havoc gains:
       - `doomsayer_doom_bolt`: `rangeDice: ["d8", "d6"]`, `resolutionDie: "d6"`, `prophesied: { havocGain: 3, damage: "4d8" }`, `base: { havocGain: 1, damage: "2d8" }`, `outside: { havocGain: 0, backlash: "1d8 psychic to self" }`.
       - `doomsayer_doom_whisper`: `rangeDice: ["d4", "d4"]`, `resolutionDie: "d4"`, `prophesied: { havocGain: 2, damage: "2d6" }`, `base: { havocGain: 1, damage: "1d6" }`, `outside: { havocGain: 0, backlash: "1d4 psychic to self" }`.
       - `doomsayer_death_mark`: `rangeDice: ["d4", "d4"]`, `resolutionDie: "d4"`, `prophesied: { havocGain: 0, damage: "6d8" }`, `base: { havocGain: 0, damage: "3d8" }`, `outside: { havocGain: 0, backlash: "2d8 necrotic to self" }`. (Note: Havoc gain is 0).
       - `doomsayer_rain_of_doom`: `rangeDice: ["d6", "d6"]`, `resolutionDie: "d6"`, `prophesied: { havocGain: 4, damage: null }` (applies a d6 table of conditions, no direct damage).
     - Havoc effects are spell-specific. Prophesied outcomes do not uniformly deal direct damage or grant Havoc.
   - Survival in peripheral schemas: Preserved in Spellcrafting Wizard UI schemas (`ProphecyStep.jsx`, `ProphecyRollTable.jsx`) and server validation (`server/shared/services/authoredAbility.js:14–45`).
   - Git tree appearance: First introduced to `vtt-react/src/data/classes/` in commit `562d958d2b150c48779e7198987c1ae9f8df7f56` (Sun Oct 25 21:32:57 2026, RI-5), where prophecy mechanics were stripped in favor of finite public calamities.
   - Open parameters: Die denominations, range-widening exchange rates, mathematical probabilities, Havoc costs and caps, specialization selection (`Forewarner` vs `Cataclysm` vs hybrid), and countdown topology remain open questions.

2. **Exorcist Provenance:**
   - Pre-consolidation file: `vtt-react/src/data/classes/exorcistData.js` **did exist** at `aa54e9df` (1,588 lines, commit `c8d8a2af` / `aa54e9df`).
   - Exact text citations at `aa54e9df`:
     - Section `classResource` (lines 73, 80): `Divine Dominance (Dominance Dice: d12 down to d6 per bound demon, up to 4 demons simultaneously)`. Poetic overview mentions: `Every command or strike of pain degrades this leash. Let the die hit zero, and the demon breaks free...`
     - Section `resourceSystem.generationTable` (lines 198–209):
       - `Standard Command`: `-1 Step` ("Simple attacks or movement")
       - `Demon Takes Damage`: `-1 Step` ("Pain fuels their resistance against your chains")
       - `Special Ability`: `-2 Steps` ("High-power demonic maneuvers")
       - `Scourge of Submission`: `+1 Step` ("Quick corrective discipline (costs 1d4 caster HP)")
       - `Shackles of Searing Iron`: `+2 Steps` ("Reinforcing the sacred bonds (costs 1d6 caster HP)")
       - `Iron Yoke of Calamity`: `→ Reset to Max` ("Total divine reset (costs 2d8 caster HP and -3 Max HP)")
     - Section `resourceSystem.overheatRules` ("The Breaking Point", lines 216–228):
       - "When a demon's Dominance Die reaches 0, the divine chains shatter. The demon immediately makes a **Rebellion Save** (DC varies by demon type)."
       - Success: demon remains bound but stays at d6 DD.
       - Failure: demon escapes. Roll 1d6: 1–2 flees; 3–4 attacks caster once, then flees; 5–6 turns fully hostile (attacks caster and allies).
     - Section `resourceSystem.rageStatesTable` ("Dominance Thresholds", lines 230–239):
       - d12: Absolute Submission
       - d10: Guarded Obedience
       - d8: Restless Defiance
       - d6: Hair-Trigger Rebellion (Only basic attacks obeyed; each command has 25% chance to fail; demon deals 1d4 radiant backlash to caster)
       - 0: The Breaking Point (No commands accepted; Rebellion Save triggered)
     - Section `specializations` (lines 315–329):
       - `EXORCIST_POSSESSED`: "You track an Internal Dominance Die (starts at d10) that degrades when you cast spells or take damage. If it reaches 0, the demon seizes control for 1 turn and you take 3d6 psychic damage."
     - Starting dice for bound fiends: Minor Imp (d12, line 630/653), Shadow Hound (d10, line 950/974), Weeping Wraith (d10, line 1069/1093), Abyssal Brute (d8, line 1181/1205), Balor flame-fiend (d6, line 1284/1308), Arch-Demon Prince (d6, line 1417/1441).
     - Exact authored rules vs. interpretation: In the structured table, the die degrades when the *demon* takes damage (`Demon Takes Damage: -1 Step`), whereas overview prose notes `strike of pain degrades this leash`. The exact die-step rules, starting sizes, and save DCs in `aa54e9df` are `[HISTORICAL DRAFT]` evidence to evaluate, not approved final rules.
   - Consolidation: Deprecated at `fc096627`, merged into Inquisitor.
   - Target restoration: Commit `3f352efd` authored 96 `cr1_exorcist_*` records around Sin-Eating and Purification Sanctity (0–10). However, binding-adjacent containment records remain in current authored content: `cr1_exorcist_cinder_leash` (line 462), `cr1_exorcist_chains_of_chastisement` (line 616), `Salt Brand`, `Circle of Absolute Salt`, `Consecrate Threshold`. Active demon pet summoning and commanding were stripped in current packages.

3. **Fate Weaver, Gambler, and Gambit Provenance:**
   - At `aa54e9df`:
     - `vtt-react/src/data/classes/fateWeaverData.js` existed (2,212 lines):
       - Section `classResource`: `Fate Reserve` (baseline capacity 4 cards, scaling to 7) and `Karmic Debt` (0–13 gauge).
       - Section `utility`: "Absolute, un-debatable d20 outcome overrides. They possess the exclusive, hard-coded domain capacity to replace active dice results at the table with pre-drawn card values, completely bypassing standard RNG checks for critical successes or saving throws."
       - Section `quickOverview`: "Bank pre-drawn cards into Fate Reserve (0-4 cards) → Force overrides on d20 rolls (Face/Ace = 14-18, Numbered = Face Value) → Accumulate Karmic Debt (0-13)... Reaching 13 debt triggers immediate Tapestry Collapse (6d10 psychic damage and 1-round incapacitation)."
       - Passive `fate_weaver_fates_wrath` ("Karmic Strain"): Level 1 passive accumulating 1 debt stack per override, +5% vulnerability and 1d4 psychic strain per stack.
       - Spells `fate_weaver_hand_of_destiny`, `hand-of-fate`: Replacing d20 rolls with card values.
     - `vtt-react/src/data/classes/gamblerData.js` existed (1,993 lines):
       - Section `classResource`: `Fortune Points` (FP) generated through coin flips, dice throws, and card siphoning; spent to adjust active d20 rolls by $\pm 1$ per point after rolling.
       - Section `Debtor's Tax`: "Every single time you gain or bank a Fortune Point... suffer 1 immediate, unpreventable HP damage".
       - Spells `gambler_fortune_reversal`, `gambler_all_in`, `gambler_divine_jackpot`.
   - At `fc096627`: Both files were deleted and merged into `gambitData.js` (4,305 lines), fusing Jax (the Wager) and Lyra (the Clause) with Fortune (0–7) and Karmic Debt (0–13).
   - At RI-2: Split into Gambler (`gamblerData.js`, retaining cards & wagers) and Fate Weaver (`fateWeaverData.js`, given 3 thread tokens); Augur (`augurData.js`, omen reading/debt) merged into Fate Weaver.
   - Ownership finding: Cards, d20 overrides, and Karmic Debt appeared across multiple drafts; neither uniquely belonged to Fate Weaver by filename. Current thread tokens are not accepted as the final identity (and are not formally rejected by existing creator decisions), remaining present in current authored code pending creative direction.

4. **Druid, Formbender, and Shaper Provenance:**
   - At `aa54e9df`: `shaperData.js` was **absent**. Instead, `vtt-react/src/data/classes/formbenderData.js` existed (3,643 lines) with whole-body transformations (Nightstalker, Ironhide, Skyhunter, Frostfang), `Wild Instinct (0–15)`, `Humanity Erosion (0–10)`, and Morgh Groven founder Torin.
   - At `fc096627`: `formbenderData.js` was deleted; `shaperData.js` was added with Flux (0–100) and stance switching.
   - At Reconstruction: Player-facing name settled as Druid (CD01, Metamorph rejected). Authors created "Finite Anatomical Loadouts" in `druidData.js` (4-slot modular traits), which represents current authored proposal, not an approved solution.

---

## Section C: Class-by-Class Forensic Verdict

### 1. Doomsayer
- **Verdict:** **RECOVER & EVALUATE**
- **Player Fantasy:** An entropic herald who names the exact numerical boundaries of impending doom, forcing reality to resolve between catastrophe, base fate, or violent backlash.
- **Creator-Approved Mechanics (Binding Invariant):**
  - Two boundary dice ($B_1, B_2$) are cast and sorted into low ($L$) and high ($H$).
  - Resolution roll ($R$) is compared against $L$ and $H$.
  - Strictly inside ($L < R < H$): **Prophesied outcome**.
  - On either boundary ($R = L$ or $R = H$): **Base outcome**.
  - Outside ($R < L$ or $R > H$): **Failure / Backlash outcome**.
  - Equal boundaries ($L = H$, natural doubles) possess zero interior and **never produce a Prophesied outcome**, including after widening.
  - Havoc generation and expenditure must maintain a meaningful operational relationship with fulfilled prophecies.
- **Historical Evidence vs. Current Authored Content:** Current RI-5 content (`doomsayerData.js`, 96 records) stripped the two-dice prophecy engine and substituted "Finite Public Calamities" (1–3 turn clocks). Historical source `historical-definitions.json` (35 spells) shows prophecy dice per spell.
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Selection of the 3rd specialization identity (`Forewarner` vs `Cataclysm` vs hybrid) and Calamity topology (whether delayed calamities serve as containers detonated by prophecy dice or operate as an independent parallel track).
  - Delegated Design Scope: Modeling exact Havoc widening exchange rates, mathematical probability curves, and natural doubles widening restrictions. Havoc caps and exact numbers remain open.

---

### 2. Exorcist
- **Verdict:** **RECOVER & EVALUATE**
- **Player Fantasy:** A grim spiritual tradesman who forcibly binds conceptual fiends with iron and holy salt, commanding them with a fraying command leash while risking catastrophic rebellion.
- **Creator-Approved Direction:** Broad identity of ritual demon binding, command/control, and extermination. Reconstruction's "no demon binding or summoning" direction is superseded. Historical individual Dominance Dice are evidence to evaluate—not approved final rules.
- **Historical Evidence vs. Current Authored Content:**
  - Historical `aa54e9df` (`exorcistData.js`): Individual Dominance Die per fiend (d12 down to d6). Die degrades on command actions and incoming strikes against the demon. Reaching 0 triggers a Rebellion Save. Reinforcement abilities restore die steps at health/blood cost. Internal possession tracks an Internal Dominance Die (d10).
  - Current authored `exorcistData.js`: Replaced demon pets with Sin-Eating and Purification Sanctity (0–10), which diverges from approved direction. However, binding-adjacent containment records remain in current data (`Cinder Leash`, `Chains of Chastisement`, `Salt Brand`, `Circle of Absolute Salt`, `Consecrate Threshold`).
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Direction on command leash architecture (evaluating the historical individual Dominance Die model from `aa54e9df` vs an alternate command leash structure). Does not replace Sin-Eater with Demonologist or authorize new fiend archetypes prior to creator decision.
  - Delegated Design Scope: Degradation triggers, die ladder steps, command action economy, and reinforcement health costs.

---

### 3. Druid
- **Verdict:** **CLARIFY & EVALUATE**
- **Player Fantasy:** A primal shapeshifter who completely assumes the bodies of living beasts and entities, altering capabilities, physical boons, and sensory envelopes while weaving living-world spells.
- **Creator-Approved Direction:** Whole-body shapeshifting, form-dependent capabilities and boons, and ordinary living-world magic (e.g. entangling roots). Working heritages: Briaren, Ondine, Ordu, Morgh.
- **Historical Evidence vs. Current Authored Content:**
  - Historical `formbenderData.js` (`aa54e9df`): Full animal forms (Nightstalker, Ironhide, Skyhunter, Frostfang), Wild Instinct (0–15), Humanity Erosion (0–10).
  - Historical `shaperData.js` (`fc096627`): Flux (0–100) and stance switching.
  - Current authored `druidData.js`: "Finite Anatomical Loadouts" (2 of 4 modular slots). Current authorship, not an approved solution.
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Settling the core transformation resource paradigm (if any; e.g. Primal Vigor, Instinct, Body Toll, or cooldowns/slots).
  - Delegated Design Scope: Evaluating whole-body form categories and living-world magic structures without authoring unapproved form manifests, mandatory weapon restrictions, prepared-form rules, or resources.

---

### 4. Fate Weaver
- **Verdict:** **EVALUATE & REDESIGN**
- **Player Fantasy:** A solemn cartomancer of destiny who lays out the tapestry of fate in a tarot spread, committing possibility cards to anchor outcomes and cutting doomed threads before consequence falls.
- **Creator-Approved Direction:** Cards are central; creator preference is a tarot identity. Kept distinct from Gambler and Oracle. The current 3-thread token link system is not accepted as the final identity (not formally rejected; remains present in authored code pending creative direction).
- **Evaluation of Proposed Root / Turning / Consequence Spread (Unapproved Proposal):**
  - *Structure:* 3-position spread representing Root, Turning, and Consequence. (Treating these as Past, Present, and Future is a new proposal, not historical or approved canon).
  - *Readability & Agency:* Cards physically placed on the table offer bounded tactical options without tracking abstract counters.
  - *Distinction:* Gambler plays wagers and poker hands for payouts; Fate Weaver commits archetypal tarot cards to alter state changes; Oracle prepares static if/then forecasts.
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Creative direction on tarot medium and formal evaluation of the Root / Turning / Consequence spread proposal (and whether to evaluate temporal interpretations).
  - Delegated Design Scope: Card catalog exploration and spread renewal concepts without authoring a full unapproved tarot lexicon.

---

### 5. False Prophet
- **Verdict:** **CLARIFY & REDESIGN**
- **Player Fantasy:** A charismatic movement-builder and zealous preacher driven by belief in a calling (whether personal revelation, ancient whispers, or zeal), channeling fanatic fervor to wield overwhelming power.
- **Creator-Approved Direction:** Charismatic manipulation, fanaticism, hubris, and movement-building. Most practitioners believe in a calling, even when they embellish or exploit it; the source of the calling may be unknown or misidentified. The calling is not asserted to be objectively real, necessarily apocalyptic, or always sincere in the same way.
- **Tension in Current Content:**
  - Narrative: Current flavor text cynically characterizes them as con-artists selling manufactured lies, conflicting with the creator direction that most practitioners believe in their calling.
  - Mechanics: Current `falseProphetData.js` pairs random dice Madness increments (1d4/1d6) with flat spell damage scaling (+1 damage per Madness point). At 20 Madness, an "Insanity Convulsion" incapacitates the caster for 1 round, severely punishing players for engaging with the class resource.
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Resolving the thematic tension (sincere belief in a calling vs con-artist flavor) and deciding how the 20-point Convulsion consequence resolves without self-incapacitation.
  - Delegated Design Scope: Reconciling Madness accumulation pacing, damage scaling curves, and congregation mechanics.

---

### 6. Dreadnaught
- **Verdict:** **CLARIFY**
- **Player Fantasy:** The ultimate defensive anchor who absorbs catastrophic incoming kinetic force and converts it into defensive capacity and crushing counter-momentum.
- **Creator-Approved Direction:** Ultimate defensive anchor. Cultures express surviving pressure and turning it into defensive capacity differently. Kept strictly distinct from Martyr (whose Ironclad tree focuses on self-sacrificial pain absorption).
- **Fidelity Assessment:** Current authored `dreadnaughtData.js` expresses mechanics exclusively through coal-fired boilers, fireboxes, and steam valves. Furthermore, the Overheat danger boundary is ambiguous:
  - Authored content: `dreadnaughtData.js:1095, 1111` and `36_30_CLASS_IDENTITY_AND_CONTENT_DOSSIER.md:276` define Overheat as beginning at 91+ PSI.
  - Current test evidence: `vtt-react/src/data/classes/__tests__/dreadnaughtIntegration.test.js:103` explicitly asserts `expect(validateDreadnaughtState({ psi: 90 }).valid).toBe(true);`. This is current test suite evidence, not historical design.
  - The Overheat threshold (90 vs 91 PSI) remains an open, unresolved creator decision.
  - Core instruction: Do not settle the resource name or prescribe "de-industrialization": industrial expression may remain, but must not be imposed on every culture. Cultures can express the defensive-anchor practice differently.
- **Open Creative Decisions & Delegated Design Briefs:**
  - Creative Authority: Approving cultural framing of the defensive-anchor practice (allowing varied cultural expressions alongside industrial steam) and settling the Overheat danger boundary (90 vs 91 PSI).
  - Delegated Design Scope: Modeling tier boons and discharge actions under both 90 and 91 PSI threshold baselines.

---

### 7. Bladedancer
- **Verdict:** **ASSESS FIT**
- **Player Fantasy:** A high-agility martial artist who builds combat velocity and rhythm through continuous movement, strikes, and parries.
- **Evidence & Reconciliation:** Pre-consolidation `bladedancerData.js` (49.5KB, Momentum resource). Current authored `bladedancerData.js` (96 records) tracks Momentum (0–10). However, it incorporates D&D mechanics ("+2 AC" in `Fluid Pivot`) and unapproved Italian musical tempo terms (Adagio, Andante, Allegro, Presto).
- **Design Assessment Scope:** Current authored content includes Italian tempo terms and a `+2 AC` record; these represent authored content to assess for fit and compatibility with Mythrill's rules during class design evaluation, rather than automatically requiring a creator decision unless a conflict arises.

---

### 8. Inscriptor
- **Verdict:** **CLARIFY**
- **Player Fantasy:** A tactical battlefield calligrapher who carves enduring runes onto surfaces, establishing territorial dominance and protective lattices.
- **Evidence & Reconciliation:** Pre-consolidation `inscriptorData.js` (93KB, Runic Resonance). Current authored `inscriptorData.js` (96 records) tracks Runic Resonance (0–10). Reconstructed blueprint proposed a hybrid between stationary ground runes and portable slate tablets to solve historical immobility.
- **Open Design Proposals:** Assessment of the portable slate tablet hybrid proposal versus strict terrain carving.

---

### 9. Witch Doctor
- **Verdict:** **CLARIFY**
- **Player Fantasy:** A marshland occult practitioner who brews virulent concoctions and binds sympathetic wax poppets to curse and torment adversaries.
- **Evidence & Reconciliation:** Pre-consolidation `witchDoctorData.js` (116KB, Voodoo Essence). Current authored `witchDoctorData.js` (96 records) authored Bog Tallow (0–100%) and wax effigies. Demarcated from Animist spirit communion by separate mechanics and ability records.
- **Open Design Proposals:** Assessment of the Bog Tallow rendering and sympathetic poppet binding mechanics.

---

### 10. Totemist
- **Verdict:** **CLARIFY**
- **Player Fantasy:** An architectural conduit warden who deploys physical conduit pylons onto the tactical grid to form conductive aura networks.
- **Evidence & Reconciliation:** Zero (0) historical records in git history. Separation from Animist is creator-approved. Current authored `totemistData.js` (96 records) authored Conduit Attunement (0–10) and 3 physical pylon slots. Physical pylons, conduit slots, zoning, and Conduit Attunement are current authored proposals, not approved mechanics.
- **Open Creative Decisions:** Creator evaluation and approval of newly authored physical conduit pylon and zoning proposals.

---

### 11. Hunter
- **Verdict:** **KEEP**
- **Player Fantasy:** A master tracker who isolates a designated Quarry, gathers physical Evidence during combat, and executes lethal exploitation strikes with or without an animal companion.
- **Evidence & Reconciliation:** Preferred successor to Apex / Huntress (`apexData.js`). Preserves solo pursuit while offering an optional companion specialization (`beastmaster`).

---

### 12. Deathcaller & Lichborne
- **Verdict:** **KEEP**
- **Player Fantasy:**
  - *Deathcaller:* General of the fallen, managing a finite muster of named dead with strict 1-action command economies.
  - *Lichborne:* Anchor mage who tethers vitality to an external physical vessel, manipulating frost stasis and vessel integrity.
- **Evidence & Reconciliation:** Conceptual split of legacy Revenant (`revenantData.js`). Both classes preserve historical identities through distinct records and mechanics, eliminating unbounded minion bloat and infinite resurrection loops without claiming complete absence of conceptual overlap.

---

### 13. Oracle
- **Verdict:** **KEEP**
- **Player Fantasy:** A seer who prepares exact conditional forecasts ahead of time ("If target acts, then..."), triggering fate interventions.
- **Evidence & Reconciliation:** Independent candidate (`oracleData.js`). 2 finite forecast slots; zero debt mechanics; distinct prepared forecast records and mechanics separate from Fate Weaver and Doomsayer.

---

### 14. Chaos Weaver
- **Verdict:** **KEEP**
- **Player Fantasy:** A volatile reality-manipulator who balances four chaotic probability zones using six fixed Possibility Tiles.
- **Evidence & Reconciliation:** Delivered in RI-1 (`chaosWeaverData.js`). 49 active records, 6 Possibility Tiles (`cw1_01`–`cw1_06`), 4 probability zones. Fully independent of Gambit/Gambler.

---

## Section D: Priority Ranking and Abstract Tabletop Examples

### D.1 Priority Ranking of Identity Mismatches
1. **Priority 1: Exorcist** — *Direct Creator Contradiction.* Current package completely stripped ritual demon binding. Must restore creator-approved ritual demon binding, command/control, and extermination (evaluating historical Dominance Die evidence vs other binding mechanics).
2. **Priority 2: Doomsayer** — *Engine Substitution.* Current package replaced Two-Dice Prophecy Boundary Engine with generic countdown clocks. Prophecy boundary function must be restored.
3. **Priority 3: Fate Weaver** — *Missing Core Medium.* Current package uses thread tokens with zero cards, violating creator tarot preference.
4. **Priority 4: Druid** — *Mechanical Misalignment.* Modular Anatomical Loadouts conflict with Whole-Body Shapeshifting fantasy.
5. **Priority 5: False Prophet** — *Thematic & Mechanical Contradiction.* Lore portrays prophets as cynical con-artists; 20-Madness stun loop punishes core playstyle.
6. **Priority 6: Dreadnaught** — *Cultural Framing & Threshold Ambiguity.* Literal boiler steam engine forced onto all lineages without cultural variation; 90 vs 91 PSI Overheat discrepancy.

---

### D.2 Abstract Tabletop Walkthroughs for Top Priorities

#### 1. Doomsayer: Two-Dice Prophecy Boundary Procedure
*(Creator-Approved Invariant Engine Walkthrough)*
- **Tabletop Setup:** Player has two Boundary Dice and a Resolution Die (denominations determined by spell), plus an authored Havoc tracker.
- **Step 1 (Cast Prophecy):** Caster casts a prophecy spell on a target. Rolls the two boundary dice.
  - Caster sorts the two rolls into Low Boundary ($L$) and High Boundary ($H$).
- **Step 2 (Optional Widening):** Caster may spend Havoc to widen the boundary window according to creator-approved exchange rules.
- **Step 3 (Resolution Roll):** Target or trigger event rolls the resolution die ($R$).
- **Step 4 (Evaluation):**
  - If $L < R < H$ (strictly inside): **Prophesied Outcome** triggers.
  - If $R = L$ or $R = H$ (on boundary): **Base Outcome** triggers.
  - If $R < L$ or $R > H$ (strictly outside): **Backlash / Failure Outcome** triggers.
  - *Invariant on Natural Doubles:* If boundary dice roll equal ($L = H$), there is zero interior space; doubles never produce Prophesied.

#### 2. Exorcist: Ritual Binding and Command Leash
*(Abstract Conceptual Walkthrough — Based on Creator-Approved Direction and Historical Draft Evidence)*
- **Conceptual Walkthrough (Subject to Design Evaluation):**
  - **Ritual Binding:** The practitioner forcibly binds a conceptual entity through sacred ritual tools (such as iron or holy salt).
  - **Command & Leash Strain:** The practitioner commands the bound entity in battle. In historical draft mechanics, issuing commands or the entity taking damage strained the command leash (historical Dominance Die).
  - **Disciplinary Rites:** The practitioner performs disciplinary rites, suffering personal strain or self-inflicted harm to reassert authority.
  - **Loss of Control Risk:** Complete breakdown of the binding creates high risk of the entity resisting commands or turning hostile.
  - **Open Scope:** The exact command economy, degradation triggers, reinforcement costs, and leash architecture are historical drafts to evaluate, not approved final rules.

#### 3. Druid: Whole-Body Shapeshifting
*(Creator-Approved Direction Walkthrough)*
- **Conceptual Walkthrough:**
  - **Form Shift:** The practitioner completely assumes the body of a living creature or primal entity rather than altering isolated limbs.
  - **Form Expression:** While transformed, the character embodies the physical capabilities, movement modes, and sensory boons inherent to that complete form.
  - **Living-World Magic:** The character can weave ordinary living-world magic (such as entangling roots or plant growth) alongside their transformed physical presence.
  - **Open Mechanics:** Form acquisition, shifting limits, operational resource (if any), and mechanical constraints remain open design areas pending creator guidance. Mandatory weapon restrictions, prepared-form rules, or specific resources are not prescribed.

#### 4. Fate Weaver: 3-Position Tarot Spread
*(Abstract Walkthrough under Unapproved Design Proposal)*
- **Tabletop Setup:** Player maintains a 3-position public spread: Root, Turning, Consequence.
- **Step 1 (Card Commitment):** Caster commits a visible card from a specific position to invoke a themed fate-weaving effect matching that aspect.
- **Step 2 (Resolution & Discard):** The card resolves and is discarded, leaving that spread position unoccupied.
- **Step 3 (Spread Renewal):** Caster performs an authored renewal action to replenish open spread positions from their deck.

#### 5. False Prophet: Charismatic Preaching and Madness Walkthrough
*(Creator-Approved Concept & Sourced Tension)*
- **Conceptual Walkthrough:**
  - **Charismatic Preaching:** The practitioner leads and rallies followers through impassioned preaching of their perceived calling (whether personal revelation, ancient whispers, or zeal), creating fervent devotion.
  - **Escalating Fervor (Authored Madness):** In current authored content, engaging with this fervor accumulates Madness points, which scale spell effectiveness.
  - **Cap Consequence Tension:** The authored 20-point Convulsion consequence currently incapacitates the player for 1 round. The open design challenge is ensuring this release expresses catastrophic power without disabling the player.

#### 6. Dreadnaught: Defensive Anchor Walkthrough
*(Creator-Approved Concept & Open Cultural Framing)*
- **Conceptual Walkthrough:**
  - **Defensive Anchor Role:** The character holds the frontline against overwhelming force, absorbing incoming kinetic violence to protect allies.
  - **Surviving Pressure:** The character converts the stress of sustained enemy assault into defensive capacity and counter-momentum.
  - **Culturally Varied Expressions:** In industrial cultures, this may be expressed as steam/furnace pressure (0–100 PSI); in other traditions, it may be framed through martial endurance, seismic grounding, or spiritual resilience.
  - **Open Mechanics:** Specific resource terminology, build/spend triggers, threshold boons, and the Overheat boundary (90 vs 91 PSI) remain open design proposals to be reconciled without imposing a single cultural framing.

---

## Section E: Creator Decision Register and Systems Questions

### E.1 Strategic Creator Decisions (Requiring Creative Authority)

The following items are the strategic creative decisions genuinely requiring creative authority:

#### Decision 1: Doomsayer Specialization Selection & Calamity Topology
- **Settled Baseline:** `Requiem` (single-target) and `Endbringer` (calamity scale) are established. Two-dice prophecy boundary engine ($B_1, B_2$ sorted low/high; interior = Prophesied, boundary = Base, exterior = Backlash) is mandatory. Doubles never produce Prophesied.
- **Open Choice for Creator:**
  - Settle the 3rd specialization: restore historical `Cataclysm` (area chaos), retain RI-5 `Forewarner` (public warning/ally defense), or author a hybrid.
  - Settle topology: whether delayed calamities serve as containers that detonate via prophecy dice, or operate as an independent parallel track.
- **Downstream Blocked Work:** Finalizing the 3rd talent tree in `talentTrees/doomsayer.js`.

#### Decision 2: Exorcist Command Leash Architecture
- **Settled Baseline:** Ritual demon binding, command/control, and extermination are creator-approved directions. Reconstruction's "no demon binding" direction is superseded. Historical individual Dominance Dice are evidence to evaluate.
- **Open Choice for Creator:**
  - Settle the command leash structure: whether to evaluate and adapt the historical individual Dominance Die per bound demon model from `aa54e9df` or adopt an alternate command leash architecture.
- **Downstream Blocked Work:** Evaluating Exorcist action records and specialization structure in `exorcistData.js`.

#### Decision 3: Fate Weaver Tarot Architecture & Spread Evaluation
- **Settled Baseline:** Cards are central; creator preference is a tarot identity. Kept distinct from Gambler and Oracle. The 3-thread token link system is not accepted as final identity.
- **Open Choice for Creator:**
  - Formally evaluate and approve the Root / Turning / Consequence 3-position Tarot Spread proposal.
  - Determine whether these three positions should be interpreted as temporal aspects (Past / Present / Future) or remain functional state anchors.
- **Downstream Blocked Work:** Structuring card mechanics in `fateWeaverData.js`.

#### Decision 4: Druid Core Transformation Resource Paradigm
- **Settled Baseline:** Whole-body shapeshifting and living-world magic are creator-approved; Metamorph was rejected; Anatomical Loadouts remain current authored content, not an approved solution.
- **Open Choice for Creator:**
  - Settle the core resource mechanism (if any; e.g. Primal Vigor, Instinct, Body Toll, or cooldown/slots). Resource remains open.
- **Downstream Blocked Work:** Structuring whole-body shapeshifting architecture in `druidData.js`.

#### Decision 5: False Prophet Convulsion Resolution & Calling Belief
- **Settled Baseline:** Charismatic manipulation, hubris, movement-building, and practitioner belief in a calling (source unknown or misidentified) are creator-approved.
- **Open Choice for Creator:**
  - Resolve the mechanical tension between Madness accumulation, flat damage scaling, and the 20-point Convulsion consequence without incapacitating the player character.
- **Downstream Blocked Work:** Reconciling `falseProphetData.js` lore and resource mechanics.

#### Decision 6: Dreadnaught Cultural Framing and Overheat Threshold
- **Settled Baseline:** Ultimate defensive anchor; distinct from Martyr. Culturally varied expressions of surviving pressure approved.
- **Open Choice for Creator:**
  - Approve cultural framing allowing varied cultural expressions of defensive pressure alongside industrial boilers (without prescribing "de-industrialization").
  - Settle the Overheat danger boundary: whether it begins at 90 PSI or 91 PSI. (Threshold remains open and unresolved).
- **Downstream Blocked Work:** Finalizing `dreadnaughtResourceGuide.js`.

---

### E.2 Technical & Systems Questions Delegated to Bounded Design Briefs
*(To be investigated and modeled in design briefs prior to creator determination)*

1. **Doomsayer Range-Widening Exchange Rate & Mathematical Modeling:**
   - Modeling exact Havoc expenditure curves to widen boundary dice.
   - Determining whether natural doubles allow widening the Base landing zone or lock out widening entirely.
2. **Exorcist Degradation & Reinforcement Balancing:**
   - Modeling degradation triggers (per command, on demon damage, on special abilities) and reinforcement health costs.
   - Reconciling internal possession mechanics without duplicating False Prophet madness.
3. **Fate Weaver Card Catalog & Renewal Economy:**
   - Exploring deck composition, card count concepts, and spread renewal action costs without authoring an unapproved lexicon.
4. **Druid Form Capability Profiles:**
   - Evaluating capability envelopes, movement modes, and action costs for whole-body animal and primal forms without authoring final form manifests.
5. **Bladedancer Compatibility Assessment:**
   - Assessing authored Italian tempo terminology and `+2 AC` record for compatibility with Mythrill's core rules and terminology standards.

---

## Section F: Bounded Follow-Up Briefs (Evidence & Design Scopes Only)

*Notice: These briefs define bounded evidence reconciliation and design evaluation scopes only. They do not authorize implementation, code edits, runtime modifications, or the authoring of unapproved content before creator approval. Implementation handoffs remain strictly blocked until creator decisions are settled.*

### Brief 1: Doomsayer Two-Dice Prophecy Specification
- **Scope:** Reconcile historical prophecy options from `historical-definitions.json` with the creator-mandated sorted-boundary procedure ($L < R < H$). Model mathematical probabilities and Havoc exchange rates.
- **Invariants:** Stable class ID `doomsayer`, stable `cr1_doomsayer_*` IDs.
- **Interface Seam:** Align with existing UI schemas in `ProphecyStep.jsx` and server authoring schemas in `authoredAbility.js:14–45`.
- **Deliverable:** Evidence and design evaluation brief only. No implementation handoff.

### Brief 2: Exorcist Command Leash and Binding Specification
- **Scope:** Reconcile historical Dominance Die degradation and rebellion rules from `aa54e9df` `exorcistData.js` against alternative binding/containment designs. Model degradation frequency, action economy, and disciplinary self-harm costs.
- **Invariants:** Stable class ID `exorcist`, stable `cr1_exorcist_*` IDs. Clean separation from `covenbaneData.js`.
- **Deliverable:** Evidence and design evaluation brief only. No new fiend archetypes, replacement specializations, or implementation-ready mechanics authorized before creator approval.

### Brief 3: Fate Weaver Tarot Architecture Evaluation
- **Scope:** Evaluate the Root / Turning / Consequence 3-position Tarot Spread proposal and explore tarot medium concepts.
- **Invariants:** Stable class ID `fate_weaver`, stable `cr1_fate_weaver_*` IDs, legacy `augur` compatibility.
- **Deliverable:** Evidence and design evaluation brief only. Does not author an unapproved tarot lexicon or implementation mechanics before creator approval.

### Brief 4: Druid Whole-Body Transformation Evaluation
- **Scope:** Evaluate whole-body shapeshifting paradigms and living-world magic structures against historical Formbender and Shaper material.
- **Invariants:** Stable class ID `druid`, stable `cr1_druid_*` IDs, legacy `shaper` compatibility.
- **Deliverable:** Evidence and design evaluation brief only. Does not author unapproved form manifests, mechanical constraints, or implementation packages before creator approval.

---

## Summary and Safe Next Steps

1. **Top Identity Problems to Address First:**
   - **Exorcist:** Recover creator-approved ritual demon binding, command/control, and extermination (evaluating historical Dominance Die evidence vs alternate leash mechanics), superseding the erroneous reconstruction removal.
   - **Doomsayer:** Restore the two-dice prophecy boundary function ($B_1, B_2$ sorted low/high; interior = Prophesied), relegating calamity countdowns to a complementary role.
   - **Fate Weaver:** Transition from thread tokens to a 3-position Tarot Spread (Root / Turning / Consequence).
   - **Druid:** Replace modular anatomical slot mechanics with whole-body shapeshifting.
   - **False Prophet:** Reconcile cynical fraud lore with practitioner belief in a calling, and rationalize the Madness/Convulsion loop.
   - **Dreadnaught:** Accommodate varied cultural expressions of defensive pressure alongside industrial steam, and resolve the 90 vs 91 PSI Overheat boundary.

2. **Creator Decisions Needed Next:**
   - Settle Strategic Decisions 1 through 6 in Section E.1.
   - Direct the execution of Bounded Follow-Up Briefs 1 through 4 in Section F for technical and systems evaluation.

3. **Safe Sequence for Later Design Work (Post-Decision):**
   - *Step 1:* Creator reviews and settles Strategic Decisions 1 through 6 in the Decision Register.
   - *Step 2:* Execute Bounded Follow-Up Briefs 1 through 4 to produce detailed design specifications.
   - *Step 3:* Author bounded class content manifests conforming to the settled decisions, preserving exact stable IDs.
   - *Step 4:* Update resource guides and HUD specifications to reflect approved mechanics.
   - *Step 5:* Prepare implementation handoffs only after creator direction is formally approved.

4. **Compliance Statement:**
   - **No application code, class rules, selectors, saves, migrations, or runtime behaviors were modified during this audit.**
   - **Concurrent work on branch `master` at commit `00c4319a915d9025cfc35a122ac28dca516405c9` remains fully preserved.**
