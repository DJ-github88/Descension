# RI-1 correction report (bounded)

**Disposition:** Corrections 1-5 plus the HeadQ-authorized bounded scope amendment are **ACCEPTED** by the read-only RI-1 final review ([FINAL-REVIEW.md](FINAL-REVIEW.md), 2026-10-19). The final amendment batch passes 17/17 suites (232 tests), ESLint is clean on the five amendment paths, all 15 source hashes match, and the live class route renders no unapproved edge. Acceptance remains limited to the manual-tabletop integration and the documented automation limits in the final review.

## 1. Level-2 policy pick (7 options)

- `LevelUpChoiceModal.jsx:963` bypasses the legacy `currentLevel === 2` three-option random slice when the class has `progression.policy`.
- Regression `components/modals/__tests__/LevelUpChoiceModal.test.jsx` wraps the production modal in `SpellLibraryProvider`, asserts the 7 authored IDs by rendered portal icons, selects Sideways Spark, spends health/mana, confirms, and checks the emitted `onChoiceSelected` payload. A legacy Minstrel case still asserts exactly 3 random icons.
- Live at 1280px on the real class route with a CW store fixture: 7 icons — Sideways Spark, Survey the Seam, Fracture Brace, Lancing Variance, Chosen Crosscurrent, Read Instability, Counterweight. Screenshot `correction-levelup-1280.png`; result `correction-live-checks.json`.

## 2. Canonical talent-grant actives

- `talentTreeData.js:315-347` attaches `CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID[grantId]` to grant nodes, mirrors `resourceCost.actionPoints` to top-level `actionPoints`, and keeps synthetic PASSIVE records only for non-grant nodes.
- `TalentTreeContent.jsx:485-537` bypasses the legacy converter when a canonical grant exists; the applied record keeps canonical id/type/AP/targeting/`specialMechanics.chaosWeaver` and `source:'talent'`.
- Regression in `TalentTreeContent.test.jsx` clicks Bias the Draw and asserts `cr1_chaos_weaver_bias_draw`, ACTION, AP 2, talent linkage, and typed mechanics.
- Independent probe result (`independent-results.json`, `grants`): all six grants match authored type/AP/typed record and canonical ids; legacy converter output is retained as `legacyConverter*` for transparency.

## 3. Level-down / class-switch reconciliation

- `progressionSlice.js`: `pruneTalentsForChange`, `derivedTalentGrantIds`, `removedTalentGrantIds`, and `removeTalentGrantSpells`; `updateLevel` prunes on level decrease and cleans removed grants.
- `infoSlice.js`: level-down and class-switch paths prune allocations, compute removed grants, rewrite `newState.talents`, and clean spellbook/library only when the grant is not still required by another roster character.
- Canonical class field is `class`; precedence is `state.class || state.characterClass`.
- Regressions in `chaosWeaverProgression.test.js`: level reduction (5/5 points, grants removed) and class switch with another character retaining the shared grant.

## 4. Deterministic pending HUD

- `ChaosWeaverResourceDisplay.jsx:85-107` guards non-array tile/face fields and renders `Deterministic result <ids> recorded — no physical face; settle to finish.` without indexing null faces or inventing a face.
- Regression in `ChaosWeaverResourceDisplay.test.jsx`; independent probe `deterministicDisplay: "rendered"`.
- Live component mount at 1280px rendered the exact deterministic line (see `correction-live-checks.json`).

## 5. Heritage baseline (22nd class, bounded amendment)

- `classHeritageRegistry.test.js` deliberately expects 22 provenance/base classes, 550 combinations, CW native `['drall_fexric']`, and preserves the 25-heritage/102-native checks.
- `heritageEdgeContract.js` does **not** contain `Chaos Weaver|drall_fexric`; the approved native access remains in the registry, while the mechanical edge is explicitly pending. `heritageEdgeContract.test.js` expects 21 authored edge classes.
- `heritageRosterCoverage.test.js` asserts the exact pending pair, a null mechanical edge, and `heritageEffectsImplemented === false`, while continuing to require authored edges for every other native pair.
- The obsolete workshop decline case is retired without `test.skip`; the original test and failure are retained in `retained-ChaosWeaverWorkshop.test.jsx.txt` and `retained-workshop-decline-failure.log`. Supported decline behavior remains covered by `chaosWeaverRules.test.js`.

## Test and probe results

- Final amendment Jest batch: **17 suites passed, 232 tests passed, 0 failed** (`amendment-regressions.log`).
- ESLint on the five amendment paths: **0 errors, 0 warnings**, exit 0 (`amendment-eslint.log`). Earlier 14-path correction run retained: 0 errors, 13 pre-existing warnings (`correction-eslint.log`).
- Live Chaos Weaver overview at 1280x900: overview rendered, no `Trained heritage` heading, no `Drall`, no horizontal overflow, 0 console errors (`amendment-live-check.json`).
- Independent review probe: all four semantic checks true; `retainedProbeExceptions: []`; `deterministicDisplay: "rendered"`.
- Retained probes: 32 checks, 0 throws; the four formerly throwing probes now use repaired confirmation/input sequencing and are the only intentional payload drift. No app rules were relaxed.

## Source hashes (SHA-256)

```
ceb400a4ca68b8caa0ffe8de90fa61ccb3c7be933b53b1e8b79473685162c483  vtt-react/src/components/modals/LevelUpChoiceModal.jsx
b635ec0b50b81c7b5deea84f9b364f66f90bf79bbaa3dc1bf4b8a7858e682090  vtt-react/src/components/modals/__tests__/LevelUpChoiceModal.test.jsx
dac5c1ec0b0aa2332d7c3c137c5718c9555333799d265f42ea837c6c24236c13  vtt-react/src/data/talentTreeData.js
32ec658020cd40652fb3f0e5419d278eb570d96c88640a5001f05addfd279b33  vtt-react/src/components/talent-tree/TalentTreeContent.jsx
e7486a7033b60a720d8be04f44acaebec437540cae50b26c070045ea0d2f3fba  vtt-react/src/components/talent-tree/__tests__/TalentTreeContent.test.jsx
4a605c1f0d710b3c56b35c0c17863d50e4f43c0d19c963dc0bf779b83dd3ee3b  vtt-react/src/store/characterSlices/progressionSlice.js
ba2690e9c0e594bfd1c91baba8d99bcdae677d7cd5a36052cb8a535506aab0d8  vtt-react/src/store/characterSlices/infoSlice.js
8ca463bb2f10e9722abee49a8ed71fc097570ecfa1fba0805213051300cc4ba4  vtt-react/src/store/characterSlices/__tests__/chaosWeaverProgression.test.js
4a1647b045df17b5590d70c998d0171b783b3ac52cad16bdffb786d43e932604  vtt-react/src/components/hud/ChaosWeaverResourceDisplay.jsx
04ffa9a7ba1e227be3019476318a65eab011c17cfea4d9f5460661a1bf254687  vtt-react/src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx
35fe2d092893a51d081f6009d82a5a0c06579caacb56a1f8e88b5d1955c298b0  vtt-react/src/data/heritageEdgeContract.js
764b5071174d6502bd029acc896522206335764b02c4a290251ea850768d9a0d  vtt-react/src/data/__tests__/heritageEdgeContract.test.js
4c4cbeb2ce094120cefd0beb77bedca2c3579746551804e38519934b6e3489bb  vtt-react/src/data/__tests__/classHeritageRegistry.test.js
f2c61ce528e4b4b38c1cc0050d6965f791e9d1ee7060f054346d239145c91314  vtt-react/src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx
b8a918b10a9ad6144a977e5b60e52ac8b96010feb154a4bf6e788df47a99704c  vtt-react/src/data/__tests__/heritageRosterCoverage.test.js
```

## Remaining limitations

- Chaos Weaver native heritage access is approved, but its mechanical heritage edge/effects remain explicitly pending. No edge is authored, displayed as implemented, or executed.
- Authenticated creation-wizard/character-sheet route was not exercisable (auth redirect), so grant materialization is evidenced by the real-component regression + applied-record probe rather than that route.
- 360px `/game` class-resource HUD is gated by PhoneGate; the deterministic HUD was verified through a live component mount and unit regression.
- No commit, push, or deploy performed; concurrent work and read-only seams untouched.
