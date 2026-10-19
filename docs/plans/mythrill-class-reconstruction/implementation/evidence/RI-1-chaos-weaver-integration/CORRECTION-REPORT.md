# RI-1 correction report (bounded)

**Disposition:** Corrections 1-5 implemented from the independent review's copy-ready instruction. Focused suites, independent probes, and live checks pass; retained unsupported paths are explicit. Ready for independent re-review.

## 1. Level-2 policy pick (7 options)

- `LevelUpChoiceModal.jsx:963` bypasses the legacy `currentLevel === 2` three-option random slice when the class has `progression.policy`.
- New regression `components/modals/__tests__/LevelUpChoiceModal.test.jsx` asserts the 7 authored IDs by rendered portal icons.
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

## 5. Heritage baseline (22nd class)

- `classHeritageRegistry.test.js` now deliberately expects 22 provenance/base classes, 550 combinations, CW native `['drall_fexric']`, and preserves the 25-heritage/102-native checks.
- Added the missing typed native edge `Chaos Weaver|drall_fexric` in `heritageEdgeContract.js` (finite stabilizing interface, equipment condition, maintenance cost) so `heritageRosterCoverage` and the edge contract agree with the approved 22nd class; `heritageEdgeContract.test.js` expects 22 authored classes.
- Retained workshop decline path is explicitly retired with `test.skip` and a reason comment; the assertion was not weakened.

## Test and probe results

- Focused Jest: **18 suites passed, 153 passed / 1 skipped, 0 failed** (`correction-focused-tests.log`).
- ESLint on 14 changed JS/JSX paths: **0 errors, 13 pre-existing warnings** (`correction-eslint.log`).
- Independent review probe: all four semantic checks true; `retainedProbeExceptions: []`; `deterministicDisplay: "rendered"`.
- Retained probes: 32 checks, 0 throws; the four formerly throwing probes now use repaired confirmation/input sequencing and are the only intentional payload drift. No app rules were relaxed.

## Source hashes (SHA-256)

```
ceb400a4ca68b8caa0ffe8de90fa61ccb3c7be933b53b1e8b79473685162c483  vtt-react/src/components/modals/LevelUpChoiceModal.jsx
6f617361ae1caf2daa4fc6b7a83d87b1aa8b5f454c0b05a4b63525081b6ef04c  vtt-react/src/components/modals/__tests__/LevelUpChoiceModal.test.jsx
dac5c1ec0b0aa2332d7c3c137c5718c9555333799d265f42ea837c6c24236c13  vtt-react/src/data/talentTreeData.js
32ec658020cd40652fb3f0e5419d278eb570d96c88640a5001f05addfd279b33  vtt-react/src/components/talent-tree/TalentTreeContent.jsx
e7486a7033b60a720d8be04f44acaebec437540cae50b26c070045ea0d2f3fba  vtt-react/src/components/talent-tree/__tests__/TalentTreeContent.test.jsx
4a605c1f0d710b3c56b35c0c17863d50e4f43c0d19c963dc0bf779b83dd3ee3b  vtt-react/src/store/characterSlices/progressionSlice.js
ba2690e9c0e594bfd1c91baba8d99bcdae677d7cd5a36052cb8a535506aab0d8  vtt-react/src/store/characterSlices/infoSlice.js
8ca463bb2f10e9722abee49a8ed71fc097570ecfa1fba0805213051300cc4ba4  vtt-react/src/store/characterSlices/__tests__/chaosWeaverProgression.test.js
4a1647b045df17b5590d70c998d0171b783b3ac52cad16bdffb786d43e932604  vtt-react/src/components/hud/ChaosWeaverResourceDisplay.jsx
04ffa9a7ba1e227be3019476318a65eab011c17cfea4d9f5460661a1bf254687  vtt-react/src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx
ae46f54d16fb2ebadb276d58c55c5a61d3f1dea1a3ad0e2d2a709f4f4db42e8f  vtt-react/src/data/heritageEdgeContract.js
94a60472a3d61abf641f88848e002f64d390080131f16b42c576e6b9b0bb9a2e  vtt-react/src/data/__tests__/heritageEdgeContract.test.js
4c4cbeb2ce094120cefd0beb77bedca2c3579746551804e38519934b6e3489bb  vtt-react/src/data/__tests__/classHeritageRegistry.test.js
0287cbc91f82c66b44c7a4d0384279d28069a42069095705cf9a20f1e4634891  vtt-react/src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx
```

## Remaining limitations

- Authenticated creation-wizard/character-sheet route was not exercisable (auth redirect), so grant materialization is evidenced by the real-component regression + applied-record probe rather than that route.
- 360px `/game` class-resource HUD is gated by PhoneGate; the deterministic HUD was verified through a live component mount and unit regression.
- No commit, push, or deploy performed; concurrent work and read-only seams untouched.
