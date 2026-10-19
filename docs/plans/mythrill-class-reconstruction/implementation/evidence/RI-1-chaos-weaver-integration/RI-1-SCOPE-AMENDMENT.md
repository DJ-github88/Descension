# RI-1 bounded scope amendment

Date: 2026-10-19
Authorized by: HeadQ

This amendment resolves the three remaining independent-review findings without changing the five accepted functional corrections or unrelated work.

## Authorized writable paths recorded before editing

- `vtt-react/src/data/heritageEdgeContract.js` (remove the unapproved Chaos Weaver mechanical edge only)
- `vtt-react/src/data/__tests__/heritageEdgeContract.test.js` (restore the authored-class expectation)
- `vtt-react/src/data/__tests__/heritageRosterCoverage.test.js` (narrow pending-edge representation)
- `vtt-react/src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx` (retire only the obsolete decline case)
- `vtt-react/src/components/modals/__tests__/LevelUpChoiceModal.test.jsx` (retain and strengthen the production-modal regression)

No other application or engine path is in scope. No migration, combat change, commit, or deployment is authorized.

## Required distinctions

- **Native access:** `classHeritageRegistry` registers `Chaos Weaver -> ['drall_fexric']`. This remains approved and unchanged.
- **Authored mechanical edges:** `heritageEdgeContract` must not contain `Chaos Weaver|drall_fexric`; the mechanical edge is pending.
- **Executed heritage effects:** `CLASS_PROVENANCE['Chaos Weaver'].heritageEffectsImplemented` remains `false`; no edge may be displayed or executed as implemented.

## Dispositions

1. Remove only the two heritage-edge correction hunks. The registry's native-access registration stays.
2. Amend the roster-coverage test to assert the exact pending pair, its absent edge, and the false implementation flag while continuing to require authored edges for every other native pair.
3. Restore the workshop decline case long enough to retain its original failure in evidence, then remove that obsolete case with a retirement explanation. Do not use `test.skip`. Keep all other workshop tests and application behavior unchanged. The supported decline behavior remains covered by `chaosWeaverRules.test.js`.
4. Keep the modal regression, add assertions for the seven expected level-2 legal IDs, and preserve a legacy no-policy selection check.

## Verification

Run the affected heritage, workshop, modal, and RI-1 regressions. Refresh source hashes and preservation evidence. Reuse existing browser/functional evidence where the source is unchanged.
