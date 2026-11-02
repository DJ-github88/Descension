# Mythrill Class HeadQ — Evidence-Label Correction Addendum

**Date:** 2026-11-02  
**Context:** Three-Class Resource Display Correction (Covenbane, Exorcist, Dreadnaught)  
**Parent Report:** [`REPORT.md`](./REPORT.md)  
**Status:** REVISED AUDIT LABELS — PRESERVING HISTORICAL WITNESSES WHILE CORRECTING CLASSIFICATIONS

---

## 1. Purpose of this Addendum

An independent integration review revealed a subtle integration defect affecting **Covenbane, Exorcist, and Dreadnaught**:
- Production generic resource actions (`initializeClassResource`, `gainClassResource`, `consumeClassResource` in `vtt-react/src/store/characterSlices/resourceSlice.js`) update the canonical `current` field.
- The dedicated HUD displays (`CovenbaneResourceDisplay`, `ExorcistResourceDisplay`, and `DreadnaughtResourceDisplay`) evaluated class-specific aliases (`charges`, `sanctity`, `psi`) before or in place of `current`.
- As a result, live resource gains and expenditures did not update the dedicated displays, even though earlier test passes and browser reports claimed full verification.

This addendum audits all previously submitted verification claims from the 2026-11-01 campaign (`REPORT.md`, `audit-results.json`, `browser-verification.json`, and associated screenshots). It explicitly reclassifies past evidence into four precise categories to maintain complete transparency, document exact test boundaries, and ensure earlier evidence is not mistakenly cited as proving the live store integration fix.

---

## 2. Reclassification of Historical Evidence

### 2.1 Category 1: Isolated Component Checks (Non-Store Harness)
These checks mounted React components in isolation using synthetic test props. They confirmed DOM structure, SVG element composition, CSS layout, and accessibility tags, but **did not** exercise production Zustand store actions or verify dynamic update propagation from `vtt-react/src/store/characterSlices/resourceSlice.js`.

* **`/component-mount-test` (`vtt-react/verification/30-class-delivery-20261101/entry.jsx`):**
  - *Method:* Mounted components on a dedicated test route.
  - *Evidence Type:* **Isolated component state check only.**
  - *Limitation:* `/component-mount-test` used local React component state and static prop dictionaries, **not production gain/consume actions**. It did not test live store dispatch or reactive synchronization.
* **`vtt-react/src/components/hud/__tests__/targetClassesResourceDisplays.test.jsx`:**
  - *Method:* Rendered `CovenbaneResourceDisplay`, `ExorcistResourceDisplay`, and `DreadnaughtResourceDisplay` directly with handcrafted prop dictionaries (e.g., `resource={{ charges: 3 }}`, `resource={{ sanctity: 5 }}`, `resource={{ psi: 75 }}`).
  - *Limitation:* Passed exclusively because manually constructed alias properties matched the display components' alias-first chains. Did not pass `current` or simulate generic store mutation.
* **`vtt-react/verification/30-class-delivery-20261101/run-browser-witness.cjs` (Parts 1 & 2):**
  - *Method:* Headless Chrome / Playwright harness navigating to `/component-mount-test`.
  - *Screenshots Produced:* `hud-mounted-desktop-*.png` (1280px) and `hud-mounted-mobile-*.png` (390px) for all 7 target classes.
  - *Audits Verified:* Verified 0 duplicate DOM IDs across mounted SVG elements; verified `role="img"`, `aria-label`, `<title>`, and `<desc>` accessibility tags across 60 SVG nodes.
  - *Limitation:* Props were statically provided via JSX literals (`resource={{ charges: 3 }}`, `resource={{ sanctity: 5 }}`, `resource={{ psi: 45 }}`). No store dispatch, no mutation, no reactive re-render testing.

### 2.2 Category 2: Mocked / Store Round-Trips (Node / Headless Environment)
These tests validated data schema integrity, calculations, and state transformations in Jest/Node environments without mounting the React presentation layer or testing live visual synchronization.

* **Class Integration & Progression Suites:**
  - `covenbaneIntegration.test.js`, `exorcistIntegration.test.js`, `dreadnaughtIntegration.test.js`
  - `covenbaneRoundTripAndProgression.test.js`, `exorcistRoundTripAndProgression.test.js`, `dreadnaughtRoundTripAndProgression.test.js`
  - *Scope:* Verified JSON serializability, class progression curves (ranks, talents, level stat scaling), and data consistency.
  - *Limitation:* Tested data records in memory. Did not mount or assert HUD components or verify that `gainClassResource` triggered visual updates.
* **Class Resource Contracts & Bank Tests:**
  - `classResourceBanks.test.js`, `classResourceContracts.test.js`
  - *Scope:* Verified initial resource bank shape returned by `initializeClassResource` (`type`, `current`, `max`, and initial aliases).
  - *Limitation:* Confirmed that `initializeClassResource` sets `charges: 0`, `sanctity: 3`, `psi: 20` alongside `current`. Masked the downstream defect because tests verified the bank object definition, not display consumption of subsequent updates to `current`.

### 2.3 Category 3: Actual Production UI Verification (Codex & Showcase)
These tests loaded the complete compiled application in real browser environments and navigated through production routes.

* **`run-browser-witness.cjs` (Part 3 — Rules Codex Pages):**
  - *Method:* Navigated Chrome to `/rules?category=character-creation&sub=classes&class=<Name>`.
  - *Interactions:* Clicked "Overview", "Resource System", "Spells", and "Specializations" tabs.
  - *Screenshots Produced:* `rules-*-overview-desktop.png`, `rules-*-resource-system-desktop.png`, `rules-*-spells-desktop.png`, `rules-*-specs-desktop.png`.
  - *Scope Verified:* The "Resource System" tab rendered the production `ClassResourceBar` component using `buildDemoClassResource()`.
  - *Limitation:* Previews tested static representative preview states, not an active gameplay character undergoing live gain/consume store updates.

### 2.4 Category 4: Incomplete or Overstated Historical Claims
The following claims in the 2026-11-01 report and witness runs are explicitly corrected:

1. **`REPORT.md` §2 Matrix Claim: "Real Browser UI Mounted (Cat. C) — PASS... READY FOR INDEPENDENT REVIEW":**
   - *Status:* **OVERSTATED**.
   - *Correction:* The pass was valid strictly for isolated synthetic prop mounting on `/component-mount-test`. Live HUD synchronization in an active gameplay session was not proven and was defective due to alias shadowing.
2. **`run-browser-witness.cjs` Part 4: "Production Character Creation & Storage Round-Trip in Browser":**
   - *Status:* **INCOMPLETE (STOPPED AT STEP 1) — DID NOT PASS**.
   - *Correction:* The earlier full lifecycle stopped at step 1; it did not pass. Part 4 injected a synthetic character directly into `localStorage.setItem('mythrill_characters', ...)`, navigated to `/account/characters/create`, and captured a screenshot of Step 1 (`wizard-step1-initial.png`). It **did not** complete the creation wizard (`creation → save → view → edit → save`), did not test live gain/consume controls, and bypassed the production authentication boundary.
3. **Guest Authentication Flow Execution:**
   - *Status:* **BLOCKED (Known Environment Defect in Unreconciled Run)**.
   - *Correction:* Ordinary user UI creation in a clean browser session was blocked by two existing production bugs in `vtt-react/src/store/authStore.js` when attempted without the network-layer mock harness:
     1. Line 782: `TypeError: actions.setIsAuthenticated is not a function` during `initializeAuth`.
     2. Line 349: `signInAsGuest()` self-rejects with `{ success: false, error: 'superseded-by-newer-auth' }` due to `beginAuthIntent()` firing during anonymous Firebase sign-in.
   - *Resolution for Ordinary Lifecycle Verification:* Used network-layer `mockFirebase` per auth handoff (`RECONCILIATION_NOTE.md` / `auth-harness-lib.cjs`) to execute the real UI journey cleanly without modifying `authStore.js` or bypassing router guards.
4. **Tooling & Linter Qualifications:**
   - *Status:* **QUALIFIED**.
   - *Correction:* Running `eslint --quiet` suppresses warnings and checks solely for error-level violations. It establishes **zero lint errors**, not zero warnings.

---

## 3. Scope and Details of the Bounded Correction (2026-11-02)

To resolve the defect without altering game balance, thresholds, or architectural boundaries:

### 3.1 Canonical Resource Contract and Fallback Behavior
1. **Canonical Precedence:**
   - Canonical `resource.current` is the primary source of truth for all dynamic resource operations.
   - When `resource.current` is defined and numeric, it is used immediately.
   - **Explicit Zero Preserved:** Genuine `0` (`resource.current === 0`) evaluates to `0`. It does NOT fall back to legacy aliases or default starting values.
   - **Fractional Values Preserved:** Raw fractional values (such as Sanctity `0.5` or PSI `89.5`) are preserved exactly. Artificial rounding (`Math.floor` or `Math.round`) has been removed from `ExorcistResourceDisplay.jsx` and `DreadnaughtResourceDisplay.jsx`.
2. **Malformed Canonical Value Policy:**
   - If `resource.current` is present but malformed (`NaN`, non-numeric string, `null`), it resolves to `0`.
   - A stale or legacy alias is **never** used to mask corrupted canonical data.
3. **Legacy-Only Input Support:**
   - Class-specific aliases (`charges`, `sanctity`, `psi`, `pressure`, `value`) are evaluated **only** when `resource.current === undefined`.
   - If a legacy alias is present and validly numeric, it is accepted.
   - If a legacy alias is present but malformed (`NaN`, non-numeric string), it resolves to `0`.
4. **Default Fallback Starting Values:**
   - When neither `current` nor any alias is present, or when `resource` is null or undefined, the component applies its class default starting fallback:
     - Covenbane: `0` (charges min: 0, max: 6)
     - Exorcist: `3` (sanctity min: 0, max: 10)
     - Dreadnaught: `20` (psi min: 0, max: 100)
5. **Geometry and Layout Safety:**
   - Clamping (`Math.max(min, Math.min(max, value))`) is applied during visual rendering.
   - NaN guards ensure SVG dimensions, coordinates, arc paths, and progress bar widths never emit `NaN` or unparseable geometry.

### 3.2 File Changes
1. **`vtt-react/src/utils/classResourceUtils.js`:**
   - Implemented `resolveCanonicalResourceValue(resource, options)` adhering to the contract above.
   - Default `round = null`; preserves raw fractional numbers unless a rounding function is explicitly supplied.
2. **`vtt-react/src/components/hud/CovenbaneResourceDisplay.jsx`:**
   - Integrated `resolveCanonicalResourceValue`. Legacy aliases: `['charges', 'value']`.
3. **`vtt-react/src/components/hud/ExorcistResourceDisplay.jsx`:**
   - Integrated `resolveCanonicalResourceValue`. Removed `Math.floor`.
   - Legacy aliases: `['sanctity', 'value']`.
   - Sanctity `0.5` correctly displays `Purification Sanctity: 0.5/10`, salt circle remains lit, and false `SANCTITY DEPLETED` warning is avoided.
4. **`vtt-react/src/components/hud/DreadnaughtResourceDisplay.jsx`:**
   - Integrated `resolveCanonicalResourceValue`. Removed `Math.round`.
   - Legacy aliases: `['psi', 'pressure', 'value']`.
   - PSI `89.5` correctly displays `Furnace Pressure: 89.5 PSI (SUPERCHARGED)`. It does not prematurely cross the 90 PSI threshold into `OVERHEAT` or trigger `VENT REQUIRED`.
5. **`vtt-react/src/components/hud/ClassResourceBar.jsx`:**
   - **Reverted cleanly to git baseline** (0 semantic diff, LF line endings preserved).
   - Removed the temporary fallback ternary so caller behavior for null/undefined resources remains unchanged.

### 3.3 Test Verification
- **Focused Contract Suite (`threeClassResourceCanonicalContract.test.jsx`):**
  - **47 tests** passing cleanly.
  - Verifies production store actions (`initializeClassResource`, `gainClassResource`, `consumeClassResource`), conflicting alias precedence (`{ charges: 0, current: 4 }` -> 4, `{ sanctity: 3, current: 7 }` -> 7, `{ psi: 20, current: 75 }` -> 75), raw fractionals (Sanctity `0.5`, PSI `89.5`), malformed inputs, SVG non-NaN geometry, two independent mounted instances, mounted reactive updates, and production store save/reload serialization.
- **Reviewer Reproduction Matrix Reused:**
  - Original reviewer tests and observation matrices from `D:\AppData\Temp\opencode\three-class-independent-review\` preserved in `handoff/three-class-review-reproduction/` and directly verified.
