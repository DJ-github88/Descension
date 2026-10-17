# CR-W1a — preserve explicitly authored zero AP

**Status: FROZEN correction contract, ready for a separately authorized implementation. This document does not authorize code changes.** Independent of CR-W1b and CR-A1a. No migration.

Preflight: read root AGENTS/CLAUDE, refresh branch/HEAD/status and the focused [handoff source hashes](../evidence/frozen-handoff-source.json). Work on the current dirty tree, not a reset HEAD. Preserve concurrent work; if a named behavior/seam has changed, record/reconcile it before applying the contract. No reset/stash/clean, asset/canon edits or unrelated repair.

## 1. Goal and source evidence

Make the fixed AP editor, canonical `resourceCost.actionPoints`, AP summaries and saved/reopened numeric price agree when the author chooses **0**. Preserve existing positive prices and intentional defaults for genuinely absent values.

Current source: `Step5Resources.jsx:422–436` uses `value || 1`; toggle initialization `:463–465` treats0 as absent; selected-resource summary `:667–669` also treats0 as absent. The provider's `UPDATE_RESOURCE_COST` merges the emitted patch (`spellWizardContext.js:1051–1059`). Its initial canonical AP is1 (`:165–173`). `resourceManager.calculateTotalResources:734–736` already preserves canonical0, but its additional-resource AP row uses falsey fallback (`:753–759`).

The isolated production-body/real-React reproduction and its limits are retained in `../evidence/headq-wizard-{selected-zero,edit-zero,passive-zero,positive-control,unselected-and-export}.json`. That earlier witness is evidence of the defect, not acceptance of a future correction.

## 2. Exact writable files

Relative to `D:\VTT`:

1. `vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx`.
2. `vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js` — **AP reading/display branch only**, not its recommendation/balance calculators.
3. New `vtt-react/src/components/spellcrafting-wizard/components/steps/__tests__/Step5Resources.zeroAP.test.jsx`.
4. New `vtt-react/src/components/spellcrafting-wizard/core/mechanics/__tests__/resourceManager.zeroAP.test.js`.
5. Implementation evidence under this planning package's `implementation/evidence/CR-W1a/` only.

All other source files, including reducer/provider, main/Review save handlers, serializer, normalization, books, combat and persistence are read-only for this task. If a required witness reveals another defect there, report the exact blocker; do not silently widen scope.

## 3. Frozen price/default semantics

**Missing** means property absent or `undefined`. Numeric0 is present. `null`, `false`, `''`, a numeric string, NaN, Infinity, a negative or fractional value is **not** missing and must not be converted into a valid fallback price by this correction. This is a zero/default repair, not a new universal input-validation or publishing policy.

### Step5 fixed-mode resolution

1. If AP is selected for editing and `resourceValues.actionPoints` is present, use that authored fixed value, including0.
2. Otherwise, if canonical `resourceCost.actionPoints` is present, retain it, including0 or a positive price.
3. Only if both are genuinely missing, retain the existing **1 AP** authoring fallback.

This fallback applies regardless of spell type: **do not introduce a new missing-PASSIVE/FREE_ACTION default0**. Explicit PASSIVE/FREE_ACTION0 remains0. A type-specific default change would be a separate rules decision.

When selecting an AP row whose editor value is missing, initialize from the canonical AP if present, otherwise1. Toggling off its editing row does **not** waive the common AP cost: retain the last authored canonical value before removing row-specific data. Thus deselect/reselect preserves0 or2; it does not invent0, reset1 or lose a just-entered0 through a stale state closure. The selected row is an editor control, not a second independent payer.

For an imported conflicting pair, an active fixed editor intentionally updates canonical AP from its current value; a deselected stale editor value cannot overwrite canonical AP. This does not make conflicting imported payloads trustworthy for admission—CR-A1a rejects missing/ambiguous canonical prices.

### Existing calculation behavior

- Keep `calculateActionPoints` recommendation arithmetic/minimum unchanged. An authored0 is not a reason to globally lower its recommendations.
- Keep the existing recommendation fallback in `calculateTotalResources` when **no authored AP encoding exists**. A legitimately estimated recommendation may exceed1.
- Where the total/additional AP view reads a supplied fixed AP encoding, preserve0; do not fall through to an estimated class-resource value. Canonical AP takes precedence in the total; a selected fixed editor is the fallback only if canonical AP is genuinely absent.
- Do not evaluate AP formulas or alter any non-AP resource formula, negative note encoding, sphere, cost, gain or default.

## 4. Implementation/UI requirements

Use presence/null-safe **AP-only** logic; do not globally replace every `||` in the file. Initialize/render the AP input and selected AP summary from the same resolved fixed price. Keep explicit0 stable when an unrelated resource is edited or the step remounts.

If a supplied AP value is malformed, label it invalid in the AP view and retain its raw draft value. The automatic save effect omits an AP replacement in that case: an existing canonical2 stays2, an existing invalid canonicalnull staysnull, and neither becomes a newly inferred1. Other resource edits may still be saved. This task does not claim the whole Wizard blocks every malformed draft from saving and does not redesign its validation system or existing generic text-input parser. The malformed fixtures mean supplied/imported values, not a new parser policy. Strict executable admission validation belongs to CR-A1a and its later draft adapter.

The no-selected-resources message must not assert “free” merely because the row list is empty while a common AP price remains. A neutral “No additional resource costs selected” is allowed in that existing block. No layout, palette, resource-category, tooltip or other copy redesign.

## 5. Required regressions

| Case | Required result |
|---|---|
| Selected fixed editor0/canonical0 | Input, emitted patch, AP summary, total and saved value0 |
| Selected editor0/canonical2 | Intentional edit commits canonical0, not1 or2 |
| Selected editor missing/canonical0 or2 | Initialize/render that canonical value |
| AP row deselected/canonical0 or2 | Retain canonical value; no implicit waiver/reset |
| Both AP encodings absent/undefined | Step5 fallback1; no blanket zero |
| PASSIVE/FREE_ACTION explicit0 |0 remains0 |
| PASSIVE/FREE_ACTION genuinely missing | Existing fallback policy retained, not newly set0 |
| Positive2 | Remains2 through unrelated resource edits |
| Deselect/reselect after editing0 |0 retained, including batched updates |
| Missing price in total-resource estimator | Existing `calculateActionPoints` recommendation retained |
| Canonical0 in total/additional AP row |0, not estimate/class-resource fallback |
| Formula AP/non-AP formulas | Formula configuration unchanged; no new evaluator |
| Malformed supplied null/string/negative/fraction | Not treated as missing/default1 or certified executable |

Use actual component bodies and reducers for the focused fixture; assert emitted numeric values, not just the input DOM. One mounted real-provider save→review→main save and Review save→reopen witness is required using isolated memory/library fixtures, with no personal account or shared-room writes. Check canonical `resourceCost`, not only display text.

**Independence:** compare main/Review outer saved records for W1a. Do not require the known lossy `serializedData` path to pass until W1b; report that failure as W1b, not a W1a regression. Conversely W1b can use a supplied0 fixture without W1a installed.

## 6. Verification and acceptance

From `D:\VTT\vtt-react` after implementation:

```powershell
$env:CI='true'; npm test -- --watchAll=false --runInBand --runTestsByPath src/components/spellcrafting-wizard/components/steps/__tests__/Step5Resources.zeroAP.test.jsx src/components/spellcrafting-wizard/core/mechanics/__tests__/resourceManager.zeroAP.test.js
```

New test paths are deliverables, not currently existing suites. Use Playwright snapshots for the bounded mounted witness. Record exact source hashes, before/after values, actual save/reopen paths and any mocks. Run scoped lint/diff; no foreground Webpack build. A full-App build is needed only if later evidence requires it and must follow detached-build AGENTS rules.

**Acceptance:** all in-scope matrix rows pass; no numeric0→1 conversion; no positive/default policy drift; no non-AP resource behavior change; current P9/P12 production files byte-preserved; no serializer/runtime/admission changes. Existing unrelated Wizard defects are reported without speculative repair.

## 7. Migration, rollback and expected output

No data migration. Do not infer which old saved1 values were intended to be0. Roll back only the scoped code/UI changes; preserve existing user work and correctly saved0 records. Never delete libraries or restore old lossy prices.

Output: bounded patch, two focused suites, mounted observations, source/diff manifest and a short acceptance report explicitly separating W1b and existing failures. No new class/rules approval is required to preserve authored0; **implementation permission is still required**.
