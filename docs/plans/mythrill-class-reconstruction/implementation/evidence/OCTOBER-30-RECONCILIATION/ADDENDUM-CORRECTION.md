# Mythrill Class HeadQ — October 30 Delivery Reconciliation Addendum & Corrections

**Date:** October 31, 2026  
**Auditor:** Class Implementation & Verification Agent (Gemini Flash 3.8 High)  
**Status:** Read-Only Reconciliation Addendum — **No class is accepted by this report.**  
**Branch / HEAD:** `master` @ `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`  
**Preservation:** Application code, existing evidence, and the initial October 30 reconciliation report are preserved without overwrite.

---

## 1. Correction of Intended Compatibility Relationships

### 1.1 Correct Intended Successor Mappings
As established by creator decisions, the intended compatibility relationships are:
- **`Augur` → `Fate Weaver`** (Augur merges into Fate Weaver; Oracle is independent)
- **`Apex` → `Hunter`** (Apex is superseded by Hunter as the preferred class direction)
- **`Shaper` → `Druid`** (Shaper is superseded by Druid as the approved bodily transformation identity)
- **`Revenant` → `Lichborne`** (Revenant is superseded by Deathcaller and Lichborne; Lichborne carries the phylactery/anchor stasis lineage)

*Correction of Previous Report:* The initial reconciliation report erroneously mapped Augur to Oracle, Apex to Berserker, Shaper to Chaos Weaver, and Revenant exclusively to Deathcaller. Those mappings were incorrect and are hereby formally retracted.

### 1.2 Ground Truth Code Audit & Discrepancies
Inspection of actual production source files reveals the following:

| Source File | Line Range | Hash (SHA-256) | Code Status / Discrepancy |
| :--- | :--- | :--- | :--- |
| `vtt-react/src/data/classes/classDisplayData.js` | 573–581 | `d15399603bb92ee5abbb8d8ee29b24a964099205574570c41e913ee287ca7942` | In `RETIRED_OR_SUPERSEDED_CLASS_NAMES`:<br>• Line 575: `'Augur', // -> Fate Weaver` *(matches intended)*<br>• Line 577: `'Apex', // -> Hunter` *(matches intended)*<br>• Line 578: `'Shaper', // -> Druid` *(matches intended)*<br>• Line 579: `'Revenant', // retired; no successor` *(**Discrepancy**: comment claims "no successor", whereas creator intent links to Lichborne/Deathcaller)* |
| `vtt-react/src/data/classHeritageRegistry.js` | 80–84 | `d25b763ca2f78658479f8cfb3450e6376dab7a7c293cca2f3782ea5b1976e177` | `CLASS_COMPATIBILITY_ALIASES` defines narrow cultural mappings:<br>• `'Nereid Myrathil Apex'` → `Apex`<br>• `'Nereid Myrathil Animist'` → `Animist`<br>• `'Nereid Myrathil Augur'` → `Augur` |
| `docs/plans/mythrill-class-reconstruction/04_RETIRED_CLASS_MIGRATION.md` | 7–13 | `2dbe90a6117ffe12da914181f36e781f17037c798b2edcb7d35be113d1e323a3` | Explicitly lists destination candidates:<br>• `gambit` → Gambler, Fate Weaver, Chaos Weaver<br>• `revenant` → Deathcaller, Lichborne<br>• `shaper` → Druid<br>• `apex` → Provisional Hunter |

### 1.3 Compatibility Non-Conversion Boundary
**CRITICAL:** These compatibility relationships do **NOT** authorize automatic save conversion, character rewriting, or migration. Legacy characters retain their exact saved data, class IDs, and resource contracts (`augurResourceContract.js`, `apexResourceContract.js`, `shaperResourceContract.js`, `revenantResourceContract.js`) without mutation.

---

## 2. Recount of Actual Class Packages from Production Imports

The initial reconciliation report erroneously claimed each class package contained *"48 nodes; 16 nodes per tree; 2 signatures per tree and 1 capstone per tree"*. That claim was incorrect.

Auditing production imports and exports across `covenbaneData.js`, `exorcistData.js`, `dreadnaughtData.js` and their corresponding talent tree modules establishes the exact architecture:

### 2.1 Authoritative 96-Record Distribution (Spells & Passives)
Every delivered class authors exactly **96 records**:
- **Core Active Records:** **2** (granted at level 1; `startingSpellPicks: 1` + 2 core grants)
- **Optional Active Records:** **40** (4 per level across levels 1–10; each level has `≥ 2` non-damage options)
- **Talent Signature Records:** **3** (exactly 1 active signature per specialization tree)
- **Talent Capstone Records:** **3** (exactly 1 active capstone per specialization tree)
- **Passive Records:** **48** (16 passive records per specialization tree across 3 trees)
- **Formula:** `2 (core) + 40 (optional) + 3 (signature) + 3 (capstone) = 48 active spells` + `48 passive records` = **96 total records**.

### 2.2 Authoritative Talent Tree Structure
- **Number of Specialization Trees:** **3**
- **Nodes per Tree:** **18 nodes** (**54 nodes total**, not 48)
- **Node Breakdown per Tree:**
  - 16 Passive Nodes (each with `maxRanks: 3` → $16 \times 3 = 48$ ranks)
  - 1 Signature Active Node (`maxRanks: 1` → 1 rank)
  - 1 Capstone Active Node (`maxRanks: 1` → 1 rank)
- **Rank Capacity per Tree:** $48 + 1 + 1 =$ **50 ranks**
- **Total Rank Capacity across 3 Trees:** $3 \times 50 =$ **150 ranks**
- **Character Talent Point Cap:** **50 points** (enforced across levels 1–10)

This exact structure is verified in production integration tests:
- `covenbaneIntegration.test.js:48-67`
- `exorcistIntegration.test.js:46-65`
- `dreadnaughtIntegration.test.js:46-65`

---

## 3. Resolution of Specific Unanswered Questions

### 3.1 What authored Mythrill rule defines Null Strike’s concentration check and disadvantage?
- **Source Location:** `vtt-react/src/data/classes/covenbaneData.js` (lines 76–102, `cr1_covenbane_null_strike`).
- **Authored Description:** *"Strike with cold bog-iron. Deal weapon damage (slashing/bludgeoning). If target is concentrating on a spell, they make their concentration check with disadvantage."*
- **Authored Mythrill Rule Ground Truth:**
  - In `vtt-react/public/data/rules.json` (lines 5256–5258), **Concentration** is defined:
    > *"Damage breaks focus: Each time you take damage while concentrating, make a Constitution save (challenging die, d10). The GM may step this up to d12 or d20 for massive blows. Succeed: the spell holds. Fail: concentration ends and the spell collapses."*
  - In `vtt-react/public/data/rules.json` (lines 1459–1460), **Advantage & Disadvantage** is defined:
    > *"When the shadows lengthen or the footing is treacherous (Disadvantage), roll two and use the lower."*
  - In `vtt-react/public/data/rules.json` (line 3353), existing precedent states: *"Ghastly Whispers... suffer a -1 penalty to Spirit and have disadvantage on concentration checks."*
- **Finding & Decision Flag:** There is **NO automated combat engine hook or trigger system** for Null Strike. In `covenbaneData.js`, the structured fields specify `effectTypes: ['damage', 'anti_magic', 'concentration_disruption']`, `conditions: []`, and `manualMechanics: { executable: false }`.
- **Verdict:** Null Strike's disadvantage text is an authored prompt for **manual tabletop adjudication** using the general rules of `rules.json:5256` and `rules.json:1459`. **Flagged for Creator/Rules Decision:** If automated combat resolution is ever authorized, an explicit engine specification for concentration disruption checks must be authored.

### 3.2 Is Exorcist’s Litany of Purging a core grant, and does it require condition absorption?
- **Source Location:** `vtt-react/src/data/classes/exorcistData.js` (lines 111–140, `cr1_exorcist_litany_of_purging`).
- **Is it a core grant?** **YES.** It is one of the two baseline core records in `EXORCIST_CORE_RECORDS` granted automatically at level 1.
- **Does it require condition absorption?** **NO.**
  - Authored Description: *"Recite a focused rite of release toward an afflicted ally within 30 ft. Cleanses one active fear, charm, or psychic debuff, transferring the residual spiritual friction into ambient salt."*
  - Structured Mechanics: `manualMechanics: { price: { actionPoints: 1, mana: 0, sanctity: 1 }, effects: [effect('cleanse.purging_litany', { targetRange: 30 }, 'Cleanse 1 active fear, charm, or psychic debuff from an ally.')], executable: false }`.
  - The spiritual friction dissipates into **ambient salt**, causing zero damage or condition transfer to the Exorcist.
- **Reconciliation with Specialization-Only Sin-Eating:**
  - **Core Exorcist:** Universal expulsion cleanses allies and disperses corruption into physical consecrated salt without caster self-harm.
  - **Sin-Eater Specialization Tree (`sineater`):** Only characters who spec into the Sin-Eater tree absorb corruption directly into their own physical body/vessel (`exo_sympathetic_purge`: suffers 1d6 psychic damage to grant ally immunity; `exo_sig_sympathetic_transference`; `exo_cap_vessel_of_pure_cleansing`).
  - The previous report conflated the universal core salt cleanse with the specialization-only sin-eating tree.

### 3.3 What source controls Dreadnaught’s overheat threshold: 80, 90, or 91+?
An audit of all Dreadnaught-related modules reveals **conflicting threshold values** across the codebase:

| Source File | Exact Line(s) | Authored Value / Statement | Semantics |
| :--- | :--- | :--- | :--- |
| `vtt-react/src/data/classResources.js` | Line 785 | `"Exceeding 90 PSI enters Overheat."` | $> 90$ PSI (i.e., **91+ PSI**) |
| `vtt-react/src/data/classes/dreadnaughtData.js` | Line 1095 | `"Overheat at 91+ PSI requires venting or inflicts 2d6 self-burn."` | **91+ PSI** |
| `vtt-react/src/data/classes/dreadnaughtData.js` | Line 1111 | `"reaching 91+ PSI risks boiler Overheat."` | **91+ PSI** |
| `vtt-react/src/data/resourceSystems/dreadnaughtResourceGuide.js` | Line 9 | `"{ icon: 'fa-triangle-exclamation', label: 'Overheat (91-100 PSI)' }"` | **91–100 PSI** |
| `vtt-react/src/data/resourceSystems/dreadnaughtResourceGuide.js` | Lines 28, 48 | `"Boiler Overheat at 91+ PSI"`, `"Overheat Tier (91-100 PSI)"` | **91+ PSI** |
| `vtt-react/src/components/hud/DreadnaughtResourceDisplay.jsx` | Line 20 | `const isOverheat = psi >= 90;` | $\ge 90$ PSI (**90+ PSI**) |
| `vtt-react/src/data/talentTrees/dreadnaught.js` | Line 89 | Node `steam_turbine`: `"Reaching 90+ PSI grants +{v} temporary AP..."` | **90+ PSI** |
| `vtt-react/src/data/talentTrees/dreadnaught.js` | Line 90 | Node `furnaceengine_mastery`: `"Overheat threshold rises to 95 PSI."` | Modified threshold: **95 PSI** |
| `vtt-react/src/data/classes/dreadnaughtData.js` | Lines 702, 794 | `resourceCost: { furnacePressure: 80 }` | **80 PSI cost** (origin of report error) |

- **Finding:**
  1. The initial report claimed "Overheat threshold at 80 PSI" because it conflated an 80-pressure ability cost with the overheat trigger.
  2. The HUD display triggers Overheat at **90 PSI inclusive** (`psi >= 90`).
  3. The written resource guides and class data text state Overheat begins at **91+ PSI** (`> 90 PSI`).
  4. Per HeadQ instructions, no value is unilaterally chosen here. This conflict is flagged for **Creator/Rules Resolution** to align either the HUD code to `psi > 90` or the guides to `90–100 PSI`.

---

## 4. Verification Claims Audit

### 4.1 Separation of Personally Executed Tests vs. Carried-Forward Claims
- **Personally Executed & Verified in this Session:**
  - `targetClassesResourceDisplays.test.jsx`: **10 tests passed** (verified via `react-scripts test`, exit code 0).
  - `covenbaneIntegration.test.js` (7 tests), `exorcistIntegration.test.js` (7 tests), `dreadnaughtIntegration.test.js` (7 tests): **21 tests passed** (verified via `react-scripts test`, exit code 0).
  - `covenbaneRoundTripAndProgression.test.js` (5 tests), `exorcistRoundTripAndProgression.test.js` (7 tests), `dreadnaughtRoundTripAndProgression.test.js` (4 tests): **16 tests passed** (verified via `react-scripts test`, exit code 0).
  - **Total Personally Executed Test Cases:** Exactly **47 tests** across 7 dedicated test suites.
- **Retraction of Prior Claims:**
  - The previous summary stated "206 automated tests passing". That number was an aggregate sum carried forward from prior delivery reports that conflated `expect(...)` assertion counts with test cases.
  - A background test task launched during the prior session hung/timed out and was terminated. It is formally recorded as **INCOMPLETE / CANCELED**.

### 4.2 Browser Witness Evaluation & Limitations
- **Investigation of `dreadnaught-browser-witness.cjs`:**
  - In lines 35–95, the witness script defines a standalone helper `renderDreadnaughtSvg(psiVal)` that generates mock raw HTML/SVG strings.
  - The script serves these strings to Playwright via `/dreadnaught-hud-test` to capture screenshots.
  - **Critical Finding:** The browser witness screenshots verify the **standalone recreated SVG string helper**, NOT the production React `<DreadnaughtResourceDisplay />` component.
  - The production React component was verified via Jest DOM testing in `targetClassesResourceDisplays.test.jsx`, not by the Playwright witness run.
  - Unverified assertions speculating why full-page browser navigation timed out are retracted.

---

## 5. Summary of Flagged Creator Decisions & Minimal Corrections

| Topic | Conflict / Open Question | Location | Minimal Proposed Correction |
| :--- | :--- | :--- | :--- |
| **Dreadnaught Thematic Framing** | Groven steam boiler / PSI identity is proposed, not creator-approved | `dreadnaughtData.js` | HeadQ decision to formally ratify Groven industrial steam framing or select an alternative identity before acceptance. |
| **Dreadnaught Overheat Boundary** | HUD checks `psi >= 90`; guides state `91+ PSI` | `DreadnaughtResourceDisplay.jsx:20` vs `dreadnaughtResourceGuide.js:9` | Align either HUD component (`psi > 90`) or guides/talents (`90–100 PSI`) once decided. |
| **Covenbane Concentration Rule** | Disadvantage on concentration checks has no automated combat engine rule | `covenbaneData.js:94, 98` | Retain as manual tabletop guidance; flag for rules codification if combat engine automation is added. |
| **Revenant Compatibility Metadata** | Code comment says "no successor", but HeadQ intended Lichborne/Deathcaller | `classDisplayData.js:579` | Update comment in `classDisplayData.js` to `// -> Lichborne / Deathcaller` during next authorized code edit. |

**Current Delivery Status:** **No class is accepted by this report.** Covenbane, Exorcist, and Dreadnaught remain unaccepted pending HeadQ review and resolution of the decisions listed above.
