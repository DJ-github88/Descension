# Mythrill Class HeadQ — Bounded Covenbane Package Verification & Delivery Report

**Date:** 2026-10-30  
**Status:** IMPLEMENTED & BOUNDED VERIFICATION COMPLETE (AWAITING HEADQ REVIEW)  
**Package:** Covenbane (`covenbane`)  
**Active Selectable Roster:** 24 Canonical Classes (expanded from 23)  
**Baseline HEAD:** `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`  
**Fresh Production Build:** Exit Code `0` | SHA-256 `8fd56a717420b8970f5f1f8945ec5452eedcfae3f48643718d8a7c5b2c4a367d`  
**Automated Tests:** 197 / 197 PASSING across 10 test suites  
**Evidence Directory:** [`docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/)  

---

## 1. Actual Character Round-Trip Verification

Personally executed in [`covenbaneRoundTripAndProgression.test.js`](file:///D:/VTT/vtt-react/src/data/classes/__tests__/covenbaneRoundTripAndProgression.test.js) (Test 1) using isolated disposable storage:

### Round-Trip Flow Exercised:
1. **Isolated Baseline & Guest Safety:**
   - Pre-existing guest character (`Warden`, ID `guest_char_prior`) pre-loaded into store.
2. **Creation & Pick Validation:**
   - Wizard Step 1 initialized with Covenbane calling, Thalren Human ancestry, and verified Barbed Vow acquisition qualification.
   - Core grants automatically populated: `cr1_covenbane_null_strike` and `cr1_covenbane_draw_null_salt`.
   - Optional pick chosen: `cov_salt_ward` (Level 1).
   - Validated that picking 0 optional spells fails (`"Please select exactly 1 starting spell"`).
   - Validated that picking 2 optional spells fails (`"Please select exactly 1 starting spell"`).
   - Validated that exactly 1 pick + 2 core grants succeeds with zero errors.
3. **Save to Storage:**
   - Character persisted to isolated store state as `covenbane_char_01`.
   - Verified that pre-existing guest character remained **100% untouched and identical**.
   - Verified stored records:
     - Canonical IDs: `cr1_covenbane_null_strike`, `cr1_covenbane_draw_null_salt`, `cov_salt_ward`.
     - AP & Resource costs: `actionPoints: 1` on all three; `hexbreakerCharges: 1` on `cov_salt_ward`.
     - Types: All marked `spellType: 'ACTION'`, `manualOnly: true`, `executionEnabled: false`.
     - Known spells array length: Exactly 3.
     - Final stats: Agility 14, Spirit 14, Constitution 12, Strength 10, Intelligence 10, Charisma 8.
     - Class resource initialized: `type: 'hexbreaker_charges'`, `charges: 0`, `max: 6`.
4. **View Active Character:**
   - Loaded into store active selection pointer; verified HUD snapshot and stat resolution.
5. **Reopen Edit in Wizard:**
   - Deserialized via `characterWizardReducer(initialState, { type: LOAD_CHARACTER, payload })`.
   - Validated that previously chosen optional pick does not re-prompt or block Step 1 validation.
6. **Modify & Resave:**
   - Modified character name to `'Kaelen the Still-Handed'`, re-saved to store.
   - Verified guest character still untouched; Covenbane updated cleanly.

---

## 2. Talent and Progression Behavior

Personally executed in [`covenbaneRoundTripAndProgression.test.js`](file:///D:/VTT/vtt-react/src/data/classes/__tests__/covenbaneRoundTripAndProgression.test.js) (Tests 2 & 3), [`characterClassSwitch.test.js`](file:///D:/VTT/vtt-react/src/store/__tests__/characterClassSwitch.test.js), [`classLevelDownPruning.test.js`](file:///D:/VTT/vtt-react/src/store/characterSlices/__tests__/classLevelDownPruning.test.js), and [`talentRefundSharedOwnership.test.js`](file:///D:/VTT/vtt-react/src/store/characterSlices/__tests__/talentRefundSharedOwnership.test.js):

### A. Point Gates, Prerequisites, Signatures, & Capstones
- **Tier Gates:** Tier 2 requires 5 tree points; Tier 3 requires 10; Tier 4 requires 15; Tier 5 requires 20; Tier 6 requires 25; Tier 7 (Capstone) requires 45 same-tree points.
- **Prerequisites:** All node chains enforce direct predecessor completion.
- **Signatures (Level 3):**
  - `cov_sig_null_shroud` (Shadowbane): 1 AP, 2 Charges, 3 rounds, manual-only action.
  - `cov_sig_leyline_cleaver` (Spellbreaker): 2 AP, 2 Charges, instant, manual-only action.
  - `cov_sig_purge_the_unclean` (Demonhunter): 2 AP, 2 Charges, instant, manual-only action.
- **Capstones (Level 10):**
  - `cov_cap_aegis_of_bog_iron` (Shadowbane): 2 AP, 4 Charges, 2 rounds, 1 long rest cooldown.
  - `cov_cap_absolute_severance` (Spellbreaker): 3 AP, 5 Charges, instant, 1 long rest cooldown.
  - `cov_cap_banishing_execution` (Demonhunter): 3 AP, 5 Charges, instant, 1 long rest cooldown.

### B. Progression Pruning, Respec, & Class Switch
- **Level-Down Pruning:**
  - Pruning a 50-point Level 10 build down to Level 1 prunes capstones and higher tiers, enforcing the 5-point Level 1 budget.
  - Pruning down to Level 3 enforces the 15-point budget, pruning capstones while allowing valid signatures.
- **Respec & Reset All:**
  - Revokes derived talent grant spells (`cov_sig_null_shroud`) from known spells upon rank refund.
  - Shared grant preservation verified: If another character in the roster requires the grant, the shared copy is preserved; it is only purged when the sole owner resets.
  - Unrelated / custom known spells (`custom_unrelated_spell`) remain completely untouched.
- **Class-Switch Cleanup:**
  - Switching from Covenbane to another class (e.g. `Druid`) clears all Covenbane talent ranks, revokes Covenbane active grants, resets specialization, and initializes the target class resource (`druid-body`), leaving core attributes intact.

---

## 3. Content Consistency & Authority Audit

Audited all 96 records against [`covenbane-content-lock.json`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/covenbane-content-lock.json) and production exports:

### A. 96-Record Inventory Breakdown
- **2 Core Grants:** `cr1_covenbane_null_strike` (1 AP), `cr1_covenbane_draw_null_salt` (1 AP, +1 Charge).
- **40 Optional Spells (Levels 1–10):** Exactly 4 per level, with $\ge 2$ non-damage options at every level (22 non-damage, 18 damage spells total).
- **6 Talent Actives:** 3 Signatures (Level 3), 3 Capstones (Level 10).
- **48 Talent Passives:** 16 passives per tree across 3 trees. All 48 passives define explicit `rankValues` with concrete numeric scaling across 3 ranks ({v} scalar substitution) and `manualMechanics.executable: false`.
- **Zero Combat Automation:** All 96 records specify `manualOnly: true`, `executionEnabled: false`, and `developmentStatus: 'development'`.

### B. System Authority for "Concentration Disadvantage" on Null Strike
- **Repository Authority Identified:**
  1. `vtt-react/public/data/rules.json` (section "Advantage & Disadvantage"):
     *"Advantage/Disadvantage uses two dice, keeps higher/lower. When the shadows lengthen or the footing is treacherous (Disadvantage), roll two and use the lower."*
  2. `vtt-react/public/data/rules.json` (section "Concentration"):
     *"Damage breaks focus: Each time you take damage while concentrating, make a **Constitution save** (challenging die, d10). The GM may step this up to d12 or d20 for massive blows. Succeed: the spell holds. Fail: concentration ends and the spell collapses."*
  3. Precedent in `rules.json` (Madness table: *"disadvantage on concentration checks"*) and `toxicologistData.js` (*"Disadvantage on all mental checks and concentration saves"*).
- **Exact Design Discrepancy:**
  - D&D 5e defines an automated "concentration check" with DC = $\max(10, \lfloor\text{damage}/2\rfloor)$.
  - Mythrill does NOT use D&D DC formulas; it uses Constitution saves against a difficulty die (default d10).
  - Mythrill has no automated concentration subsystem.
  - **Resolution / Tabletop Grounding:** The effect is properly understood and documented as manual tabletop Disadvantage on the target's Constitution save to maintain concentration (the player/GM rolls two difficulty dice and takes the lower result).

### C. Fiend-Expulsion Boundaries: Covenbane vs Exorcist Loops
- **Covenbane (Occult Hunter / Spellbreaker / Executioner):**
  - *Class Loop:* Martial striker / hunter-killer. Tracks occult spoor, closes distance, builds Hexbreaker Charges by interrupting spells and parrying, and strikes to sever planar anchors and physically execute abominations (`demonhunter` tree: `cov_banishing_strike`, `cov_cap_banishing_execution`).
  - Covenbane treats fiends as dangerous apex magical targets for destruction and severance. Covenbane does not bind fiends, does not cleanse vessels, and does not care for victims.
- **Exorcist (Sacred Cleanser / Host Protector / Sin-Eater):**
  - *Class Loop:* Defensive / protective host stewardship. Focuses on drawing spiritual corruption into oneself (sin-eating), sanctifying consecrated ground, shielding innocent souls, and safely casting malevolent spirits out of possessed mortal vessels without harming the host.
  - Exorcist treats fiends as spiritual taints possessing innocent hosts that must be extracted and banished to save lives.
- *Distinction:* Covenbane kills the fiend and severs the weave; Exorcist saves the host and cleanses the soul.

---

## 4. Integrated SVG HUD Verification

Personally exercised in real browser automation via Playwright ([`covenbane-browser-witness.cjs`](file:///D:/VTT/vtt-react/verification/covenbane/covenbane-browser-witness.cjs)) across desktop (1280px) and mobile (390px) viewports:

### States Verified & Assertions:
1. **0 Charges:** Empty socket rendering, cold muted border (`0/6`).
2. **Partial (3 Charges):** 3 cold bog-iron spikes filled with slate wash and iron strike centers, 3 empty sockets (`3/6`).
3. **Full (6 Charges):** All 6 spikes active with iron strike centers (`6/6`).
4. **Missing / Malformed State Fallbacks:**
   - `null` / `undefined` gracefully falls back to `0/6`.
   - String `NaN` / corrupted input gracefully falls back to `0/6`.
   - Negative values (`-4`) clamped cleanly to `0/6`.
   - Overflow (`10`) clamped cleanly to hard cap `6/6`.
5. **Multiple Mounted Instances:**
   - 3 party member HUD bars mounted simultaneously on the same screen (Token Alpha with 1 charge, Token Beta with 4 charges, Token Gamma with 6 charges).
   - **Assertion `zero-duplicate-dom-ids`:** Passed with 0 duplicate DOM IDs anywhere on the page.
6. **Accessibility & Contrast:**
   - **Assertion `svg-accessibility-labels`:** Passed on all 9 mounted SVG instances (`role="img"`, accessible `aria-label`, `<title>`, and `<desc>` present).

### Visual Screenshots Captured (12 Images):
- [`01-covenbane-hud-desktop-empty.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/01-covenbane-hud-desktop-empty.png)
- [`02-covenbane-hud-desktop-partial.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/02-covenbane-hud-desktop-partial.png)
- [`03-covenbane-hud-desktop-full.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/03-covenbane-hud-desktop-full.png)
- [`04-covenbane-hud-desktop-malformed.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/04-covenbane-hud-desktop-malformed.png)
- [`05-covenbane-hud-desktop-multi-instance.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/05-covenbane-hud-desktop-multi-instance.png)
- [`06-covenbane-hud-mobile-partial.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/06-covenbane-hud-mobile-partial.png)
- [`07-covenbane-hud-mobile-multi-instance.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/07-covenbane-hud-mobile-multi-instance.png)
- [`08-rules-covenbane-overview-desktop.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/08-rules-covenbane-overview-desktop.png)
- [`09-rules-covenbane-overview-mobile.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/09-rules-covenbane-overview-mobile.png)
- [`10-rules-covenbane-spells-desktop.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/10-rules-covenbane-spells-desktop.png)
- [`11-rules-covenbane-specializations-desktop.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/11-rules-covenbane-specializations-desktop.png)
- [`12-rules-covenbane-resource-guide-desktop.png`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/screenshots/12-rules-covenbane-resource-guide-desktop.png)

---

## 5. Evidence, Worktree Accounting, & Preservation

### A. SHA-256 Manifest of Authorized Files
Generated in [`covenbane-sha256-manifest.json`](file:///D:/VTT/docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/covenbane-sha256-manifest.json) (28 files):

| File Path | Status | Size | SHA-256 |
| :--- | :--- | :--- | :--- |
| `vtt-react/src/data/classes/covenbaneData.js` | NEW | 46,409 B | `2b26b623fcdd3c3fd09c4fbde19527dce83a0734781f28a0e8322126f3099518` |
| `vtt-react/src/data/talentTrees/covenbane.js` | NEW | 13,617 B | `b0b9cbe693c2402a4453f51b72ba12ca4c5c69c544d329fa9d112dc2ce6878a3` |
| `vtt-react/src/data/resourceSystems/covenbaneResourceGuide.js` | NEW | 4,057 B | `237e929e769df3039a93b16811344a61a4eb36a598dd1923907f2aa4ee91358a` |
| `vtt-react/src/components/hud/CovenbaneResourceDisplay.jsx` | NEW | 2,936 B | `5f1afd904172c03cbc04cdf74f059bd6d4e7a9f0e4dd0dcfcf27ea36f530e5f7` |
| `vtt-react/src/data/classes/__tests__/covenbaneIntegration.test.js` | NEW | 5,498 B | `2f54e9f77abdf7967a39cf222736e38c89d68b29e00d3682ec3b644ea82f9e54` |
| `vtt-react/src/data/classes/__tests__/covenbaneRoundTripAndProgression.test.js` | NEW | 16,616 B | `79cc952f60510455ac8c46acc23b65963d0e1b7b6ad6d5470f9e25ba95cd8e0a` |
| `vtt-react/verification/covenbane/covenbane-browser-witness.cjs` | NEW | 16,908 B | `85941e6dfcde38f3bbfb3b7c46d9de0990be696832a901f916a30ccd23dd7a5f` |
| `vtt-react/src/data/classes/classDisplayData.js` | MODIFIED | 37,041 B | `1a86fd2c89774040840dd5e4858e7356864dbf62f76f90805fe9aa0e5e499afb` |
| `vtt-react/src/data/classes/classFlavorProfiles.js` | MODIFIED | 25,270 B | `8a4badad579588bf5d5a91c4f8b5ff9cf1c899f59cc89ebfa8ccdcbb8a982355` |
| `vtt-react/src/data/classes/index.js` | MODIFIED | 4,102 B | `787054d602cf57d6e55436473d7b981dde358f8b3e0d3557352012e7fa00ef41` |
| `vtt-react/src/data/classSpellGenerator.js` | MODIFIED | 8,829 B | `753177651c6c59ce1a15a81e37bc21c107be6cb5098ffb4e803554b73b5df5fe` |
| `vtt-react/src/store/characterSlices/progressionSlice.js` | MODIFIED | 52,246 B | `9abf83c13ff98cb9b7ba48f4ea4c6ec43806fb41e42b2dd782488a10cc95ce19` |
| `vtt-react/src/data/classHeritageRegistry.js` | MODIFIED | 16,339 B | `b68eb4c6c5e263d91cf9cf0c9e6bb076dbf20c99db147986427807c4b4d6ae78` |
| `vtt-react/src/data/classSpellCategories.js` | MODIFIED | 2,752 B | `0dbe858f7028b1220a0069cf77006dd70d5a3746a5beba0786dfdf37a972fb1c` |
| `vtt-react/src/components/rules/RulesPage.jsx` | MODIFIED | 49,602 B | `e680dcaad90cb96264d8cc38d8f997cbcc6f6fa731efc1b489be98c36142750e` |
| `vtt-react/src/components/rules/ClassDetailDisplay.jsx` | MODIFIED | 29,268 B | `e1d4b1a45749ee767fc36d64eb0f95b359f42774da3867c4ec2352d19f565b98` |
| `vtt-react/src/components/hud/ClassResourceBar.jsx` | MODIFIED | 87,078 B | `33034f40f0c05988e404bfb8d5a2d652f418534010ee3a85b9b6e828fcab096f` |
| `vtt-react/src/data/classes/levelOneSpellIcons.js` | MODIFIED | 6,564 B | `6b978dfae82c2a0ff52cf8a0e35fbb9a8966838a16eeea19d8544a7f05353d26` |
| `vtt-react/src/data/resourceSystems/index.js` | MODIFIED | 1,460 B | `445bf7a1cf05c7429188e999c0d60d3d5fbf97f6c6d2c4883ea5c898c644c10a` |
| `vtt-react/src/data/classResources.js` | MODIFIED | 88,435 B | `1b135c3bbccb00b0808cf7cae9e03d406da234a742ce74ae877239388df6dafe` |
| `vtt-react/src/data/talentTreeData.js` | MODIFIED | 14,815 B | `d852a420b92db2c918a287dd46356779d722d3b41e3d36676cf47e9e4ce8c818` |
| `vtt-react/src/data/talentTrees/index.js` | MODIFIED | 1,577 B | `9fbfd254aa39c4a8dc382a9332e2b34a6efca0997e3cb7a8bdfd799d3e86c8d7` |
| `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` | MODIFIED | 196,482 B | `0379058b73f98297b4ec5168dbbaea1966a3d16298514a60064d1421a1158b04` |
| `vtt-react/src/components/account/CharacterManagement.jsx` | MODIFIED | 50,713 B | `5e6f6630f955d8a9df1aa8df20dd979d57a3e7e452ee23b2c6cf7c6fb51ddfbe` |
| `docs/plans/mythrill-class-reconstruction/35_30_CLASS_IMPLEMENTATION_LEDGER.md` | MODIFIED | 7,163 B | `f044bb7145719e7cf9335a12f558a74e7df6504a71c841d1aa980757d54238e8` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/covenbane-content-lock.json` | NEW | 32,235 B | `3255152a51d95015b61e27a7c5b6b8b09f7a5b3ee58db8204b7ea2fb44955a6d` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/COVENBANE-CONTENT-LOCK.md` | NEW | 19,412 B | `aeec0d03c6a4613ff16bc39a13093222dd8113fc22fa102ddb6452da6731e840` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/COVENBANE-INTEGRATION/REPORT.md` | NEW | 18,225 B | `a7959b343cb6825cbb37748439d54e0b04cba79d8c363d6b05adbe6cb50a6ae8` |

### B. Worktree Accounting
- **Baseline HEAD:** `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`
- **Authorized Covenbane Scope:** 28 files (10 new files, 18 integration touchpoints).
- **Concurrent Unrelated Changes:** 146 pre-existing modified files in working tree (covering P11-P14 roadmap, conditions editor, actor consequences, spell payments, minstrel pair, etc.) were **completely preserved and untouched**.
- **Working Proposals for Other 6 Classes:** Bladedancer, Dreadnaught, Exorcist, Inscriptor, Totemist, and Witch Doctor proposal files and HUD components remain intact in working tree.

### C. Specific Legacy Inquisitor Preservation Checks
- Inquisitor remains retired from new-character creation (`getSelectableClassNames()` does not include `Inquisitor`).
- Zero namespace collisions: Covenbane uses `cov_*` and `cr1_covenbane_*`; Inquisitor uses `inq_*` and `wh_*`.
- Existing Inquisitor characters load with 100% fidelity, using `Authority` (0–8) and `inquisitorData.js` without any automated conversion.
- Passing regression tests: `inquisitorIntegration.test.js` (10 tests) and `ri8RosterStoreIntegration.test.jsx` (9 tests) passed cleanly.

---

## 6. Correct Next-Class Descriptions for HeadQ Dossier

Pursuant to HeadQ guidance:
1. **Exorcist (`exorcist`):**
   - **Approved Broad Direction:** Sacred expulsion, cleansing spiritual taint, sanctifying areas, and protecting innocent hosts.
   - **Explicit Correction:** Exorcist does **NOT** bind fiends. Fiend binding is rejected.
   - **Specializations:** Sin-eating remains a creator-approved possible specialization.
2. **Totemist (`totemist`):**
   - **Creator-Approved Direction:** Primal spirit conduit, strictly separate from Animist.
   - **Explicit Correction:** Repository history did not contain an authored historical Totemist. The exact spirit/conduit/pylon mechanics proposed in draft dossiers are **NOT approved** simply because a preview component exists. They remain open creator decisions.

---

## 7. Delivery Status & Completion Gaps

Covenbane is now **implemented and verified** through automated tests, isolated character round-trip, production build compilation, and browser witness visual captures.

### Remaining Tabletop Gaps (Expected & Tabletop-Bounded):
1. **Manual Tabletop Resolution:** Covenbane features (bog-iron parrying, spell interruption, Hexbreaker Charge generation, dispelling) are designed for manual tabletop adjudication by players and GMs. There is intentionally **no automated combat resolution or automatic dispel engine**.
2. **No Git Commit / Push:** As instructed, all changes remain in the local worktree for review. No commit, push, or deployment has been executed.
3. **Next Class Implementation Blocked:** All other returning classes (Exorcist, Bladedancer, Dreadnaught, Inscriptor, Totemist, Witch Doctor) remain paused awaiting HeadQ's review and sign-off on Covenbane.
