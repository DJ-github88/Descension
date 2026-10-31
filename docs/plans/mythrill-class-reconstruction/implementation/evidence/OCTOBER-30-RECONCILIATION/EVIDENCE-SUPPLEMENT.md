# Mythrill Class HeadQ — October 30 Delivery Evidence Supplement

**Date:** October 31, 2026  
**Auditor:** Class Implementation & Verification Agent (Gemini Flash 3.8 High)  
**Status:** Read-Only Evidence Supplement — **No class is accepted by this report.**  
**Branch / HEAD:** `master` @ `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`  
**Preservation:** Application code, existing evidence, and previous reports are preserved without overwrite.

---

## 1. Null Strike Rules-Authority Analysis

### 1.1 Exact Quoted Text

**From `vtt-react/public/data/rules.json` (lines 5256–5258):**
```json
{
  "title": "Concentration",
  "content": "The most powerful sustained spells demand constant focus. While **concentrating**, your mind is divided, maintaining the spell's weave even as the world tries to shatter it.\n\n- **One at a time**: You can only concentrate on one spell simultaneously. Casting a new concentration spell immediately ends the previous one.\n- **Damage breaks focus**: Each time you take damage while concentrating, make a **Constitution save** (challenging die, d10). The GM may step this up to d12 or d20 for massive blows.\n- **Succeed**: the spell holds. **Fail**: concentration ends and the spell collapses.\n\nProtecting a concentrating ally is often more valuable than landing an extra attack."
}
```

**Complete Authored Record from `vtt-react/src/data/classes/covenbaneData.js` (lines 74–102):**
```javascript
export const COVENBANE_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_covenbane_null_strike',
    name: 'Null Strike',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('1d8 + strength', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Strike with cold bog-iron. Deal weapon damage (slashing/bludgeoning). If target is concentrating on a spell, they make their concentration check with disadvantage.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, charges: 0 },
      effects: [effect('anti_magic.null_strike', {}, 'Disadvantage on enemy concentration checks.')],
      executable: false
    },
    sourceRefs: ['Covenbane Content Lock']
  },
  // ...
];
```

### 1.2 Explicit Rule vs. Inference Analysis

| Question | Explicitly Defined in Authored Rules? | Authored Ground Truth | Inferred / Undefined Elements |
| :--- | :--- | :--- | :--- |
| **When a concentration check occurs** | **PARTIALLY DEFINED** | `rules.json:5257`: *"Damage breaks focus: Each time you take damage while concentrating, make a Constitution save..."* Dealing damage via Null Strike triggers this general rule. | **Undefined:** Does an attack that misses, or deals 0 damage (e.g. completely absorbed by physical DR or magical barrier), trigger a concentration check? The spell description implies the disadvantage applies to the check, but does not state whether a check occurs if 0 damage is dealt. |
| **What is rolled and against what** | **PARTIALLY DEFINED** | `rules.json:5257`: Roll a *"Constitution save (challenging die, d10). The GM may step this up to d12 or d20 for massive blows."* In the Ladder of Trials (`rules.json:1451`), the character rolls the difficulty die and adds skill/attribute modifiers. | **Undefined:** The target number or DC for the Constitution save is **never defined** in `rules.json`. It does not specify whether success requires rolling a specific minimum face (e.g., $\ge 5$), exceeding half the damage taken, or meeting a GM-set DC. |
| **What disadvantage means in this context** | **DEFINED** | `rules.json:1459–1460`: *"When the shadows lengthen or the footing is treacherous (Disadvantage), roll two and use the lower."* | In the context of the Ladder of Trials, rolling two difficulty dice and taking the lower result naturally increases the likelihood of rolling low (or rolling a critical failure on a 1). |

### 1.3 Small Creator-Decision Proposal
To turn this prompt into a fully authored tabletop and engine rule without inventing unapproved mechanics:
> **Proposal:** Creator formally ratifies:  
> 1. *Trigger:* Concentration saves require taking $\ge 1$ point of unmitigated damage from Null Strike.  
> 2. *Check Resolution:* The concentrating creature rolls two difficulty dice (standard d10, or escalated die for massive damage) taking the lower die result, and adds their Constitution modifier against a standard Tabletop Target DC (e.g. DC 10, or half damage taken, whichever is higher).  
> 3. *Automation Scope:* Remained tagged `executable: false` until the combat engine implements concentration tracking.

---

## 2. Dreadnaught Threshold Accounting & Exhaustive Audit

### 2.1 Exact Threshold Expressions Across All Sources

| Module / Source | Exact Expression / Authored Text | Value Stated | Semantics |
| :--- | :--- | :--- | :--- |
| `classResources.js:785` | `"Exceeding 90 PSI enters Overheat."` | $> 90$ PSI | **91+ PSI** |
| `dreadnaughtData.js:1095` | `"Overheat at 91+ PSI requires venting or inflicts 2d6 self-burn."` | $\ge 91$ PSI | **91+ PSI** |
| `dreadnaughtData.js:1111` | `"reaching 91+ PSI risks boiler Overheat."` | $\ge 91$ PSI | **91+ PSI** |
| `dreadnaughtResourceGuide.js:9` | `{ icon: 'fa-triangle-exclamation', label: 'Overheat (91-100 PSI)' }` | 91–100 PSI | **91+ PSI** |
| `dreadnaughtResourceGuide.js:28, 48` | `"Boiler Overheat at 91+ PSI"`, `"Overheat Tier (91-100 PSI)"` | 91–100 PSI | **91+ PSI** |
| `DreadnaughtResourceDisplay.jsx:20` | `const isOverheat = psi >= 90;` | $\ge 90$ PSI | **90+ PSI** |
| `DreadnaughtResourceDisplay.jsx:30` | `descText: "...Safe venting range 0-90 PSI."` | $\le 90$ PSI | **90 PSI is ceiling of safe** |
| `talentTrees/dreadnaught.js:89` | Node `steam_turbine`: `"Reaching 90+ PSI grants +{v} temporary AP..."` | $\ge 90$ PSI | **90+ PSI** |
| `talentTrees/dreadnaught.js:90` | Node `furnaceengine_mastery`: `"Overheat threshold rises to 95 PSI."` | 95 PSI | **95 PSI modified** |
| `dreadnaughtData.js:702, 794` | `resourceCost: { furnacePressure: 80 }` | 80 PSI | **Cost of Tremor Slam & Magma Vent** |
| Content Lock Dossier `38_TARGET_CLASSES...md:186, 195` | `"4 distinct tiers: 0–30 Idle, 31–60 Working, 61–90 Supercharged, 91–100 Overheat"`, `"91–100 PSI (Overheat)"` | 91–100 PSI | **91+ PSI** |
| Jest Test `targetClassesResourceDisplays.test.jsx:47` | `test('renders critical overheat state at 95 PSI')` | 95 PSI | Tested at 95 PSI |

### 2.2 Finding on "80 PSI"
**80 PSI does NOT exist as an Overheat threshold in any source file, guide, talent tree, or test.**  
The appearance of "80 PSI Overheat threshold" in the previous report was **solely a reporting error**. The author erroneously conflated the `80 PSI` resource cost of high-tier spells (*Tremor Slam* and *Magma Vent*) with the overheat trigger threshold.

### 2.3 Precise State Trajectory: 89, 90, 91, and 100 PSI

- **At 89 PSI:**
  - *HUD Display:* `psi >= 61 && psi < 90` $\rightarrow$ `isSupercharged = true`, `isOverheat = false`. Displays status `SUPERCHARGED` in amber (`WARN`). Safe frame border. No overheat warning.
  - *Guide & Mechanics:* In Supercharged tier (61–90 PSI). Grants $+10$ ft Speed and $+1\text{d}6$ Fire damage on melee strikes. No self-burn risk.
- **At 90 PSI (The Code/Guide Discrepancy Point):**
  - *HUD Display:* Evaluates `psi >= 90` $\rightarrow$ `isOverheat = true`. The status switches to `OVERHEAT` in red (`BRICK`), the outer border turns red, and the SVG displays `VENT REQUIRED`.
  - *Talent Tree:* `steam_turbine` triggers bonus AP on the next turn.
  - *Resource Guide & Class Data:* Categorizes 90 PSI as the maximum safe ceiling of the Supercharged tier. Overheat is stated to begin at 91+ PSI.
  - *Summary:* At exactly 90 PSI, the HUD visually alarms for Overheat, while the written rules treat it as the peak safe Supercharged value.
- **At 91 PSI:**
  - *Universal Agreement Across All Rules & Code:* All sources agree the character is in the **Overheat Tier (91–100 PSI)**.
  - *Tabletop Effects:* The character must vent steam within 1 round or suffer $2\text{d}6$ internal fire damage as valves blow. Melee damage dice are maximized.
  - *HUD Display:* Overheat display active with `VENT REQUIRED`.
- **At 100 PSI:**
  - Maximum boiler capacity. All incoming pressure generation is clamped to 100.
  - Overheat consequences continue.
  - Unlocks activation of the 100-PSI capstone `dread_cataclysmic_boiler_breach` ($10\text{d}10$ fire explosion; resets boiler to 0 PSI).

---

## 3. Comprehensive Acceptance Evidence (47 Verified Tests)

### 3.1 Personally Executed Test Breakdown
All 47 tests were personally executed via `react-scripts test ... --watchAll=false` and completed with exit code 0.

| Test Suite File | Command Executed | Tests Passed | Assertion Count | Scope & Behavioral Coverage |
| :--- | :--- | :--- | :--- | :--- |
| `covenbaneIntegration.test.js` | `npm test -- src/data/classes/__tests__/covenbaneIntegration.test.js` | **7 / 7** | 22 | **Inventory & Contract:** 96 records verified; optional spell level stratification (4/level, $\ge 2$ non-damage); 3 trees / 18 nodes / 54 total / 50 rank cap; zero Inquisitor collision; progression policy (1 pick, 2 core grants); talent level-down pruning; state validation. |
| `covenbaneRoundTripAndProgression.test.js` | `npm test -- src/data/classes/__tests__/covenbaneRoundTripAndProgression.test.js` | **5 / 5** | 18 | **Persistence & Store:** Create $\rightarrow$ pick optional $\rightarrow$ save $\rightarrow$ view $\rightarrow$ reopen $\rightarrow$ save round-trip; starting picks enforcement; talent point tier gates; class-switch cleanup without corrupting other characters. |
| `exorcistIntegration.test.js` | `npm test -- src/data/classes/__tests__/exorcistIntegration.test.js` | **7 / 7** | 40 | **Inventory & Rules:** 96 records verified; 4/level stratification; 3 trees / 54 nodes / 50 rank cap; zero Inquisitor/Covenbane collision; **CD09 demon binding rejection verified (0 demon/fiend mechanics)**; progression policy; level-down talent pruning. |
| `exorcistRoundTripAndProgression.test.js` | `npm test -- src/data/classes/__tests__/exorcistRoundTripAndProgression.test.js` | **7 / 7** | 71 | **Persistence & Progression:** Full round-trip persistence; Sanctity (0–10) initialization and bounds; signature/capstone prerequisites; tier point gates (0, 5, 10, 15, 20, 25, 30); **Sin-Eater tree boundary isolation**; class switch state reset. |
| `dreadnaughtIntegration.test.js` | `npm test -- src/data/classes/__tests__/dreadnaughtIntegration.test.js` | **7 / 7** | 43 | **Inventory & Rules:** 96 records verified; 4/level stratification; 3 trees / 54 nodes / 50 rank cap; **CD11 Martyr Ironclad separation verified (zero `icl_*` collisions)**; progression policy; level-down talent pruning; state validation. |
| `dreadnaughtRoundTripAndProgression.test.js` | `npm test -- src/data/classes/__tests__/dreadnaughtRoundTripAndProgression.test.js` | **4 / 4** | 49 | **Persistence & Progression:** Full round-trip persistence; Furnace Pressure (0–100, default 20) initialization; talent tier gates and prerequisite checks; capstone acquisition; class switch cleanup. |
| `targetClassesResourceDisplays.test.jsx` | `npm test -- src/components/hud/__tests__/targetClassesResourceDisplays.test.jsx` | **10 / 10** | 16 | **Production Component UI (RTL / jsdom):** Renders production React components: `<CovenbaneResourceDisplay />` (empty & 6 charges), `<ExorcistResourceDisplay />` (0 warning & positive sanctity), `<DreadnaughtResourceDisplay />` (working PSI & 95 PSI overheat), plus 4 remaining returning classes. |

### 3.2 Evidence for Specific Functional Demarcations
1. **Exorcist Core Litany vs. Sin-Eater Absorption:**
   - *Evidence:* `exorcistData.js:111–140` (`cr1_exorcist_litany_of_purging`) has `effectTypes: ['cleanse', 'utility']` and transfers friction into ambient salt. `exorcistData.js:460–480` and `talentTrees/exorcist.js` restrict condition absorption to the `sineater` tree (`exo_sympathetic_purge`). Verified by `exorcistIntegration.test.js` and `exorcistRoundTripAndProgression.test.js`.
2. **Resource Generation, Spending, Recovery:**
   - *Covenbane:* Hexbreaker Charges 0–6. Initialized at 0. Generated by manual actions (`cr1_covenbane_draw_null_salt`), spent on strikes/wards, reset on long rest.
   - *Exorcist:* Sanctity 0–10. Initialized at 0. Generated by threshold prayer, spent on litanies/sanctuary, reset on rest.
   - *Dreadnaught:* Furnace Pressure 0–100. Initialized at 20. Generated by stoking/hits, spent on vents/slams, drops to 10 (short rest) or 0 (long rest).
   - *Status:* **Tabletop & sheet data complete.** (Combat automation integration is unbuilt by design).
3. **Signature & Capstone Materialization & Prices:**
   - Signatures are Tier 4/5 actives; Capstones are Tier 7 actives. Each is projected with canonical AP and resource costs via `classSpellGenerator.js`. Verified in `*RoundTripAndProgression.test.js`.
4. **Level-Down, Respec, Class-Switch & Multi-Character Grant Retention:**
   - Verified in `*RoundTripAndProgression.test.js`:
     - Level-down prunes high-tier talents and removes active grants from `class_spells.known_spells`.
     - Class-switch via `buildClassSwitchPatch` strips old class talents and grants, initializes the new class resource, and retains base character attributes.
     - Multi-character tests verify that editing a new class character does not alter or corrupt adjacent saved characters in mock localStorage.
5. **Production HUD Verification vs. Recreated Previews:**
   - **Production React Component:** Verified in `targetClassesResourceDisplays.test.jsx` by rendering `<CovenbaneResourceDisplay />`, `<ExorcistResourceDisplay />`, and `<DreadnaughtResourceDisplay />` using React Testing Library into jsdom.
   - **GAP:** The Playwright browser witness scripts (`dreadnaught-browser-witness.cjs`, etc.) used a standalone string helper (`renderDreadnaughtSvg`) rather than mounting the React component within the live Vite/Webpack application. Live in-browser verification of the mounted React component in a real browser session remains an unfulfilled test gap.

---

## 4. Compatibility Implementation Verification

| Target Relationship | Authoritative Creator Intent | Source File & Location | Hash (SHA-256) | Code Status / Discrepancy |
| :--- | :--- | :--- | :--- | :--- |
| **`Augur` $\rightarrow$ `Fate Weaver`** | Augur merges into Fate Weaver; Oracle is independent | `classDisplayData.js:575` | `d15399603bb92ee5abbb8d8ee29b24a964099205574570c41e913ee287ca7942` | **AGREES.** Coded as `'Augur', // -> Fate Weaver`. |
| **`Apex` $\rightarrow$ `Hunter`** | Apex is superseded by Hunter (preferred direction) | `classDisplayData.js:577` | `d15399603bb92ee5abbb8d8ee29b24a964099205574570c41e913ee287ca7942` | **AGREES.** Coded as `'Apex', // -> Hunter`. |
| **`Shaper` $\rightarrow$ `Druid`** | Shaper is superseded by Druid (transformation identity) | `classDisplayData.js:578` | `d15399603bb92ee5abbb8d8ee29b24a964099205574570c41e913ee287ca7942` | **AGREES.** Coded as `'Shaper', // -> Druid`. |
| **`Revenant` $\rightarrow$ `Lichborne`** | Revenant is superseded by Lichborne (and Deathcaller) | `classDisplayData.js:579` | `d15399603bb92ee5abbb8d8ee29b24a964099205574570c41e913ee287ca7942` | **DISCREPANCY.** Coded as `'Revenant', // retired; no successor`. Comment omits intended Lichborne/Deathcaller link. |

**Runtime Preservation:**
- All 7 retired classes remain registered in `ALL_CLASSES_DATA` and retain dedicated contracts (`augurResourceContract.js`, `apexResourceContract.js`, `shaperResourceContract.js`, `revenantResourceContract.js`).
- They are excluded from `getSelectableClassNames()` to prevent new character creation, but existing character saves load without modification. Zero automatic conversion is executed.

---

## 5. Concise Acceptance Matrix

| Requirement | Evidence | Personally Run / Inspected | Status (Pass / Gap / Decision) |
| :--- | :--- | :--- | :--- |
| **Selectable Roster Count (26)** | `classDisplayData.js:584`, `Step1CoreDraft.jsx:2412` | Inspected code & verified counts | **PASS** |
| **Target 30-Class Roster Intact** | Roster accounting docs; 4 target classes remain untouched | Inspected ledger & git status | **PASS** |
| **Animist / Totemist Separation** | Animist untouched; Totemist retained as separate planned package | Inspected `classDisplayData.js`, `animistData.js` | **PASS** |
| **Legacy Inquisitor Separation** | Zero ID or resource collision; `inq_*` and Authority untouched | `covenbaneIntegration.test.js`, `exorcistIntegration.test.js` | **PASS** (Personally Run) |
| **Covenbane 96 Records & 54 Nodes** | `covenbaneData.js`, `talentTrees/covenbane.js` (50 rank cap) | `covenbaneIntegration.test.js` | **PASS** (Personally Run) |
| **Covenbane Round-Trip Persistence** | Mock create $\rightarrow$ save $\rightarrow$ view $\rightarrow$ reopen $\rightarrow$ save | `covenbaneRoundTripAndProgression.test.js` | **PASS** (Personally Run) |
| **Null Strike Concentration Rule** | `rules.json:5256` defines save; DC and check on 0 damage undefined | Inspected `rules.json` & `covenbaneData.js` | **DECISION REQUIRED** (Creator DC/Trigger decision) |
| **Exorcist 96 Records & 54 Nodes** | `exorcistData.js`, `talentTrees/exorcist.js` (50 rank cap) | `exorcistIntegration.test.js` | **PASS** (Personally Run) |
| **Exorcist CD09 Compliance** | Zero demon binding, leashing, or fiend summoning mechanics | `exorcistIntegration.test.js` | **PASS** (Personally Run) |
| **Exorcist Litany vs Sin-Eating** | Core Litany cleanses into salt; absorption isolated to Sin-Eater | `exorcistRoundTripAndProgression.test.js` | **PASS** (Personally Run) |
| **Dreadnaught 96 Records & 54 Nodes** | `dreadnaughtData.js`, `talentTrees/dreadnaught.js` (50 rank cap) | `dreadnaughtIntegration.test.js` | **PASS** (Personally Run) |
| **Dreadnaught Martyr Ironclad Separation** | Zero collision with Martyr's `MARTYR_IRONCLAD` / `icl_*` tree | `dreadnaughtIntegration.test.js` | **PASS** (Personally Run) |
| **Dreadnaught Thematic Framing** | Groven spinal boiler / steam / PSI identity is proposed | Inspected `dreadnaughtData.js` | **DECISION REQUIRED** (Creator thematic ratifying) |
| **Dreadnaught Overheat Threshold** | Code sets `psi >= 90`; text guides state `91+ PSI` | Inspected HUD component & resource guide | **DECISION REQUIRED** (Creator 90 vs 91 PSI decision) |
| **Production React HUD Verification** | `<CovenbaneResourceDisplay />`, `<ExorcistResourceDisplay />`, `<DreadnaughtResourceDisplay />` | `targetClassesResourceDisplays.test.jsx` (RTL) | **PASS** (Personally Run) |
| **Live Browser Component Mounting** | Playwright witness scripts tested standalone mock SVG strings | Inspected `dreadnaught-browser-witness.cjs` | **GAP** (Live browser test mounted mock, not React DOM) |
| **Compatibility Mappings Verified** | Augur $\rightarrow$ Fate Weaver; Apex $\rightarrow$ Hunter; Shaper $\rightarrow$ Druid; Revenant $\rightarrow$ Lichborne | Inspected `classDisplayData.js:573` | **PASS / GAP** (Revenant comment needs updating to Lichborne) |
| **Zero Automatic Save Conversion** | Legacy contracts intact; no automatic migration executed | Inspected `coreSlice.js`, `characterClassSwitch.js` | **PASS** |

*Note: In accordance with HeadQ instructions, this report does not declare acceptance.*
