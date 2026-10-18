# CR-W1a re-review after bounded correction

Recorded 2026-10-18. Base: retained independent review `review.md` (2026-10-18, withheld W1a; accepted W1b).
This session applied the review's bounded correction to the two writable W1a files, added the required
regressions, and re-ran both focused suites plus the retained actual-handler witness.

## Verdict

- **CR-W1a corrected findings pass.** All six concrete defects from `review.md` §1 are resolved with direct
  regression coverage and the retained actual-handler witness.
- **CR-W1b remains accepted, bytes unchanged** (`spellSerializer.js` = `b9608629…dfaa5f`, review-era and corrected run).
- **Combined W1a/W1b bounded acceptance recorded** per the retained witness + focused suites. Witness limitations
  are preserved verbatim (see below); no App-to-Review navigation claim.

## Corrected source (before → after)

| File | Review-era | Corrected |
| --- | --- | --- |
| `Step5Resources.jsx` | `52e0e899…167cd` | `6120e2b6…37431` |
| `resourceManager.js` | `0fc160b7…30cf0b` | `ea27eb2c…8b4605` |

Diff: `../diff-W1a-W1b-corrected.patch`. Only these two application files differ between the review-era and corrected
witness compilations (full witness hash sets diffed; no other module changed).

## Defect → resolution map (review §1)

| Review defect | Resolution | Verified by |
| --- | --- | --- |
| Additional fixed AP row editor-first: canonical2/editor0 → total2/row0 | `resolveFixedActionPoints` is canonical-first; editor consulted only when canonical absent **and** AP selected **and** not in formula mode | Witness conflicts 1–3 (total 2/0/0 with matching rows 2/0/0); suite `resourceManager.zeroAP` conflicting-value tests |
| Canonical0/editor2 → total0/row2 contradiction | Same canonical-first row; whole-view consistency | Witness conflict 2 (total 0, row 0); suite test |
| Total fallback accepts deselected stale editor 0 (absent canonical) | Editor fallback requires `resourceTypes` includes `actionPoints` | Witness conflict 4 (total = recommendation 1, no row); suite test |
| Total fallback accepts formula-mode stale editor 0 | Editor fallback requires `useFormulas.actionPoints` falsey; formula row/string preserved, not evaluated | Witness conflict 5 (total 1; row formula `1d6`, placeholder 0, `useFormula:true`); suite test |
| Step5 `getResolvedAPDraft` used unselected stale editor when canonical absent | Unselected editor branch removed; deselected stale editor → authoring fallback 1 | Witness step5 case 4 (canonical 1, no input); mounted suite test |
| Batched edit0+deselect lost the just-entered 0 (canonical stayed 2) | `latestAPEditorValueRef` records the just-entered value synchronously; AP toggling commits a valid pending editor value to canonical in the same dispatch (before row data removal); selection tracked via `selectedResourcesRef` to avoid stale-closure overwrites; handler uses functional editor update | Witness `batchedEditDeselect` = 0; mounted suite: batched edit/deselect = 0, batched edit/deselect/reselect = 0 with input and summary `0` |

Frozen semantics preserved: selected-fixed-editor → canonical → fallback 1 (Step5); canonical-first calculator views;
positive 2 stable; malformed drafts still omitted (never defaulted); explicit PASSIVE/FREE_ACTION 0 unchanged;
non-AP behavior and AP formula configuration untouched; trailing whitespace at former line 458 removed.

## Regressions added (review §4 requirements)

- Direct conflicting-value assertions: canonical2/editor0 and canonical0/editor2 (total **and** additional fixed row), absent/selected-fixed 0, absent/deselected stale 0, absent/formula-mode stale 0 — `resourceManager.zeroAP.test.js`.
- Corrected the mislabeled “selected fixed editor” fixture that omitted `resourceTypes: ['actionPoints']`; it now asserts a selected conflict and cannot bless a deselected stale fallback.
- Mounted real-provider Step5 assertions asserting canonical numeric values, input and summary: deselected-stale-editor fallback 1; batched `onChange(0)` + real option `onClick` (edit/deselect = 0; edit/deselect/reselect = 0) via actual production handler closures inside `ReactDOM.unstable_batchedUpdates`.

## Verification results

- Focused W1a suites: 2 suites / **29 tests pass**.
- Full three focused suites: 3 suites / **43 tests pass** (Step5 13, resourceManager 16, serializer 14).
- Scoped `git diff --check`: clean (trailing whitespace removed).
- Scoped `npx eslint`: 0 errors; only pre-existing warnings.
- Retained actual-handler witness rerun (corrected source): port `17301`, pid `17244` stopped after capture.
  - `conflicts`: all 5 match the frozen expectations (2/0/0/1/1).
  - `step5`: canonical/input/summary `0/'0'/['0']`, `2/'2'/['2']`, `0/'0'/['0']`, `1/no input/neutral copy`.
  - `batchedEditDeselect`: canonical `0` (expected 0).
  - `productionPaths`: main outer, main reopen, Review outer, Review secondary, Review reopen — all exact `resourceCost` preservation = true (5/5).
  - `serializer`: two actual cycles, template/string-template, dotted isolation, whole replacement, raw library export — 9/9 true.
  - Console: 0 errors, 0 warnings. Results: `witness-results-corrected.json`; snapshot: `production-save-reopen-snapshot-corrected.md`; hashes refreshed in `witness-source-hashes.json` (review-era preserved as `witness-source-hashes-review-era.json`).

## Witness boundaries (preserved from review, unchanged)

Review is independently composed under the same real providers; current App step mapping does not mount Step10Review, and
this witness does not prove an App-to-Review navigation route. Other Wizard steps, sample loader, library visual UI, cards,
formula-help/components-selector children, icon/bootstrap presentation and visual metadata adapters are mocked.
`spellLibraryScopedStorage` alone is replaced with a memory adapter; production provider/library-manager calls still run.
No personal storage, network backend, shared room or account writes occur. Full browser/persistence integration and cast
behavior are not claimed.

## Preservation

- W1b bytes: `spellSerializer.js` `b9608629…` unchanged; its suite unchanged (14 tests).
- Protected files (context, App, Review, libraryManager, storage registry, class index, package.json, P9/P12 service samples): all re-hashed, UNCHANGED vs `../../evidence/frozen-handoff-source.json`.
- Unrelated concurrent work (class display/rules data) untouched.

## Remaining defects

- None in the corrected W1a scope against the retained review.
- Incumbent non-regressions intentionally unrepaired: stale free-cast warning when AP is fallback-materialized at mount (pre-existing display-only behavior, out of scope), and pre-existing lint warnings in `Step5Resources.jsx`.
- A1a target files remain absent; A1a implementation instruction issued separately (`../../CR-A1a-DEEPSEEK-IMPLEMENTATION-INSTRUCTION.md`).
