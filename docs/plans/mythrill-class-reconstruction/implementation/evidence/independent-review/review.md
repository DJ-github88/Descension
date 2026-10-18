# Independent CR-W1a / CR-W1b review

Reviewed 2026-10-18 on `master`, HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`.

## Verdict

**Combined W1 acceptance withheld. CR-W1a requires a bounded correction. CR-W1b accepted within its frozen serializer/template and named-caller scope.** Application code and the original three suites were read-only throughout this review. Earlier implementation acceptance is evidence, not the independent verdict.

Read the frozen W1a/W1b/A1a contracts, retained source/diff manifests, actual production changes, all three new suites, the implementation acceptance report and both retained witness implementations/results. No class audit, broad App build, combat suite or unrelated repair was performed.

## 1. AP precedence: direct production-function observations

These are **pre-Step5** conflicting payloads passed directly to the actual `calculateTotalResources`, not state already reconciled by Step5's effect. The fixture's unchanged recommendation is 1. Complete values are in `witness-results.json` (`conflicts`).

| Canonical AP | Editor AP / selection | Actual total | Actual additional fixed AP row | Contract result |
|---|---|---:|---:|---|
| 2 | 0 / selected, fixed | 2 | 0 | Calculator common AP remains 2; additional row must not present a different fixed price |
| 0 | 2 / selected, fixed | 0 | 2 | Calculator common AP remains 0; additional row must not present a different fixed price |
| absent | 0 / selected, fixed | 0 | 0 | 0: pass |
| absent | stale 0 / deselected | 0 | no row | Existing recommendation 1; deselected stale editor must not supply the price |
| absent | stale 0 / selected, formula mode | 0 | formula `1d6`, placeholder 0 | Existing total recommendation 1; a formula-mode stale fixed value is not a selected fixed encoding. Preserve the formula row/string; do not evaluate it |

The implementation summary's blanket “editor → canonical → fallback” is inaccurate for the total: `resourceManager.js:750–754` is canonical-first. However, it unconditionally falls back to `resourceValues.actionPoints`, without selection or fixed-mode checks. The added helper at `:729–740`, used by the additional row at `:773–776`, is editor-first, so conflicting imports produce contradictory total/row prices. Step5's intentional editor precedence must not become calculator precedence.

### Step5 mounted production-component observations

The actual `SpellwizardApp` renders the actual Step5 with the real Wizard provider/reducer. After the Step5 save effect settles:

| Input | Canonical AP after effect | AP input / selected summary | Result |
|---|---:|---|---|
| canonical 2 / selected fixed editor 0 | 0 | 0 / 0 | Correct intentional edit |
| canonical 0 / selected fixed editor 2 | 2 | 2 / 2 | Correct intentional edit |
| canonical absent / selected fixed editor 0 | 0 | 0 / 0 | Correct |
| canonical absent / deselected stale editor 0 | 0 | no AP input/row | **Incorrect: Step5 fallback must be 1** |

`Step5Resources.jsx:89–91` returns the unselected stale editor after finding no canonical value. `:447–459` then materializes that stale zero as canonical instead of using the authoring fallback 1. This is not the incumbent free-cast warning.

### Batched edit / deselect

Starting canonical/editor 2, invoke the actual mounted input's production `onChange` with 0 and the actual AP option's `onClick` within one `ReactDOM.unstable_batchedUpdates`. Canonical remains **2**, not 0, after deselection. This exercises real handler closures, with a deliberately simulated same-batch event schedule; it is not a claim that separate human clicks always batch this way.

Locations: `Step5Resources.jsx:517–522` queues local editor state; `:463–513` removes row data using the old render's values; `:447–460` later falls back to the old canonical value. The frozen contract explicitly requires a just-entered zero to survive batched deselection. The retained test only deselects/reselects an already-committed zero and does not cover this case.

## 2. Witness coverage and repaired evidence gap

### Retained implementation witnesses

- `CR-W1a/witness-server.cjs:100–115`: `mainSaveRecord`, `reviewRecord` and `reopenFrom` **copy selected expressions**. They do not import/mount the App or Review component or invoke those save/load handlers. Real Step5, real Wizard provider/reducer and real serializer are exercised. The saved-record chain is simulated.
- `CR-W1b/witness-server.cjs:92–94`: the alleged Review secondary path is a direct call to the real serializer on a fixture, not the Review save handler. Its serializer/template and `libraryManager.exportLibrary` controls are real utility calls.
- `spellSerializer.resourceRoundTrip.test.js:191–200` similarly calls the serializer directly. This cannot independently establish Review-handler acceptance.
- The retained “two cycles” test/witness serializes the same original twice; it does not feed one deserialize result into the next cycle. The new bounded witness adds two actual successive cycles.

These artifacts are useful helper/component evidence, but copied expressions alone do not meet the frozen production-handler requirement.

### New bounded witness

`witness-server.cjs` compiles **full unchanged production modules**, rather than extracting or rewriting their expressions:

- `SpellwizardApp.jsx` / actual `AppContent` save and `handleLoadSpell` paths.
- `Step10Review.jsx` / actual save handler, including secondary `serializedData`.
- Step5, Wizard provider/reducer, library provider/reducer, serializer, resource manager, preview helper and library manager.

`witness-run.js` clicks the App's actual Finalize button and Review's actual Save to Library button. Reopen delivers the production `internalLoadSpell` event handled by the mounted App. The real library reducer receives each handler's action. Exact full `resourceCost` equality passes for:

1. main outer saved record;
2. main save → actual App reopen → Step5 remount;
3. Review outer saved record;
4. Review secondary deserialized `serializedData`;
5. Review save → actual App reopen → Step5 remount.

AP0/mana4, components/materials, repeated spheres, seven typed note counts, signed legacy note value, costs/gains, formulas and unknown nested/program data survive. No execution/admission is inferred.

**Simulated boundaries:** Review is independently composed under the same real providers; current App step mapping does not mount Step10Review, and this witness does not prove an App-to-Review navigation route. Other Wizard steps, sample loader, library visual UI, cards, formula-help/components-selector children, icon/bootstrap presentation and visual metadata adapters are mocked. `spellLibraryScopedStorage` alone is replaced with a memory adapter; production provider/library-manager calls still run. No personal storage, network backend, shared room or account writes occur. Full browser/persistence integration and cast behavior are not claimed.

Final successful run: `http://127.0.0.1:15344/`, process 11756 stopped after capture. `witness-console.txt`: 0 errors, 0 warnings. During fixture setup, an initial mock-only PropTypes problem was corrected before the final clean run; no application change was involved. Snapshots: `production-save-reopen-snapshot.md` and earlier bounded `production-step5-snapshot.md`.

## 3. Preservation and focused checks

- Original three focused suites: **3 suites / 37 tests pass** with the frozen combined `npm test -- --watchAll=false --runInBand --runTestsByPath` command. Actual suite counts: Step5 10, resource manager 13, serializer 14 (the earlier report's 11/13/13 split is inaccurate).
- New browser checks: two successive serialize/deserialize cycles, exact template/string-template preservation, dotted AP/notes isolation, unchanged original/template/second instance, whole-object replacement and actual raw-library export all pass. Existing focused suite covers missing/empty/null distinctions and private cleanup.
- `manifest-verification.json`: all **13** retained implementation/protected/test entries match; all **20** protected source/document entries outside the three writable source files match the earlier frozen source manifest. In particular current P9/P12 services/handlers, room authority/checkpoint codec, Wizard/provider/save handlers, storage registry and class index are byte-identical to retained evidence.
- Current normalized three-source-file `git diff` equals `diff-W1a-W1b.patch` exactly. No recommendation arithmetic or non-AP formula/calculator code changed in that patch. Class display changes present at session start are unrelated existing work.
- Scoped `git diff --check` finds one trailing-whitespace line, `Step5Resources.jsx:458`. No broad lint/build/test run was justified.
- All three future A1a targets remain absent. No application source was changed by this review.

### Bounded W1b acceptance

The two serializer changes implement the frozen semantics: authored `resourceCost` is no longer removed by `cleanConfigForSerialization`; template state is deeply detached before nested modifications. Exact JSON preservation, genuine absence, private cleanup, four metadata removals, whole-object replacement, helper API/error behavior and named real callers are accepted within the frozen scope. No load-time price reconstruction, schema migration, executable admission or unrelated template-option defect repair is claimed.

## 4. Paste-ready bounded DeepSeek correction instruction

> Correct only the remaining CR-W1a contract failures described in `implementation/evidence/independent-review/review.md`; work from the current dirty tree and preserve all unrelated work. Read the frozen `CR-W1a-ZERO-AP.md` and retained manifests first. Writable application files remain only `Step5Resources.jsx` and the AP reading/display branch of `resourceManager.js`; update only the two W1a focused suites and W1a evidence as needed. W1b is independently accepted: preserve `spellSerializer.js` and its suite bytes. All main/Review/provider/library/persistence, P9/P12, class/rules data and other application files remain read-only.
>
> In `resourceManager.js:729–754,773–776`, make calculator fixed AP views canonical-first. Consult the editor only when canonical AP is absent/undefined **and** AP is selected **and** not in formula mode. Otherwise keep each existing recommendation fallback; do not change `calculateActionPoints`, its minimum, class-resource arithmetic or formula strings/placeholders. The additional fixed AP row must agree with the canonical fixed price rather than showing a different editor price. Never turn malformed present canonical data into a valid fallback.
>
> In `Step5Resources.jsx:80–92`, retain intentional selected-fixed-editor → canonical → fallback1 semantics; a deselected stale editor is ineligible, including when canonical is absent. In `:447–522`, ensure a just-entered 0 is retained canonically before removing AP editor data, including a same-batch edit/deselect and reselect. Avoid stale render/state-closure overwrites; preserve positive2, malformed-draft omission, explicit PASSIVE/FREE_ACTION0 and existing genuine-missing1 policy. Keep non-AP behavior and AP formula configuration unchanged. Remove the trailing whitespace at line458 while editing this file.
>
> Add direct conflicting-value assertions for canonical2/editor0 and canonical0/editor2 (total and additional fixed row), absent/selected fixed0, absent/deselected stale0, and absent/formula-mode stale0. Correct the existing test labeled “selected fixed editor” that currently omits `resourceTypes:['actionPoints']`; it must not bless a deselected stale fallback. Add mounted real-provider Step5 stale-editor and batched edit0/deselect/reselect assertions. Assert canonical numeric values, input and summary, not only DOM text. Use actual production components/handlers, not copied expressions. Preserve the bounded actual-handler save/reopen witness and rerun it against the corrected source; refresh its source hashes/results honestly.
>
> Run only the three focused suites from the frozen contracts, scoped lint/diff and the bounded browser witness. Return the patch, exact before/after hashes, updated matrix/evidence and any remaining blockers for independent re-review. Do not claim acceptance merely because the old 37 tests pass. **Do not repair the incumbent free-cast warning, alter serializer/runtime/admission, migrate data, implement A1a, or restart the class audit.**

## 5. A1a handoff finalization

Updated `CR-A1a-DEFINITION-INFRASTRUCTURE.md` with the two requested HeadQ clarifications:

- Validate and privately detach request **and full registry** synchronously before authorization is invoked/awaited; never reread caller-owned data after await. Deferred-authorizer mutation tests are required for both admit/revoke, without freezing/mutating caller objects.
- Validate complete legal registry histories, not just definitions: duplicate request IDs, gaps/out-of-order versions, invalid revocations, orphan/duplicate admits, inconsistent references/sequences/revision/request hashes must fail across codec/planners/describe. Valid individual definitions must not hide corrupt history.

Original freeze manifests/golden vectors are retained as historical evidence. The addendum's before/after identity is captured in `a1a-clarification-manifest.json`. A1a remains server-only, execution-disabled, uninstalled and unimplemented. Its separate implementation authorization is unchanged. Since combined W1 acceptance is withheld, no acceptance-conditioned A1a implementation release instruction is issued in this review. This does not change the contract's architectural independence from W1.
