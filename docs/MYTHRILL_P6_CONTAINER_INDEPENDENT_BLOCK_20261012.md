# Independent read-only acceptance — remaining P6 R1/R4 — 2026-10-12

## Final P6 verdict: BLOCK

The two exact reported symptoms are closed. R4 passes this bounded independent acceptance. R1 remains BLOCK because the changed codec traversal omits a real production container-grid shape path, causing a demonstrated save/load compatibility regression. R2/R3/R5/R6 acceptance is carried forward; their retained controls pass. No fixes or repository edits were made by this review.

## Reviewed identity and hash integrity

- Actual checkout: D:/VTT; execution directory: D:/VTT/vtt-react.
- HEAD before/after: 620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b. Corrections are uncommitted in an already dirty worktree.
- Read original MYTHRILL_NEXT_PHASE.md Project 6, frozen MYTHRILL_PROJECT_6_CONTRACT.md, independent re-review BLOCK report, remaining corrections handoff, source-hashes.md and file-changes.json. Documentation lives under D:/VTT/docs; verification paths live under vtt-react.
- Inspected all three changed production files, permanent remaining-browser/remaining-output runners, frozen historical witness, existing browser harnesses and retained supplemental runner. No graph exists; no repository graph was generated.
- All five focal SHA256s match the supplied final identity and remain identical before/after. Full hashes are recorded in focal-hashes.md and before.json/after.json. All 266 behavioral source dependencies in fresh browser manifests are unchanged during review.
- Independently verified all 269 frozen snapshot files against the preserved independent re-review after.json and their embedded hashes. Compressed snapshot SHA256: 0afa985b4679640c7ae945f14af17296f7004f29db9c1ad65b2d6e1653088be3. Frozen runner hash matches freeze-complete.json. Fresh exact RED manifest equals the frozen manifest.
- Verified all 39 recorded remaining evidence hashes and the preserved independent re-review artifact manifest. Preserved evidence and witnesses were not overwritten.
- Initial handoff drift was calm-shared.css and GambitResourceBar.jsx. During this review 19 existing ResourceBar component/style paths changed concurrently, recorded individually in integrity-summary.json. None is in the behavioral dependency set. No repository files were added. Concurrent styling was preserved.

## Exact historical RED validity

Executed node verification/p6/remaining-browser.cjs --red against the isolated immutable snapshot, using its frozen pre-correction witness. Both exact observations reproduced with no page errors:

1. R1: real production inventory authoring and canonical/runtime saves confirm. Both raw documents retain futureAnnotation.shape.cells as ["[true]"]. Both production loaders return [[true]] for that unrelated annotation; the ordinary item footprint also remains [[true]].
2. R4: a clean matching mounted file input with canonical.class={invalid:"object"}, runtime=null mutates roster class, live class and retained canonical class to that object, replaces live notes with INVALID CLASS MUST NOT APPLY and displays no alert. The file text remains exact.

Exit 0 means these reproduction assertions succeeded, not acceptance. red.json contains the actual observations, original inputs and mounted ARIA snapshot; identity was checked independently, not inferred from exit status.

## R1 — BLOCK

### Exact annotation defect: closed

Current canonical/runtime production loads preserve the exact original annotation. Focused and retained browser controls pass ordinary 1x1/custom 2x2 footprints, legacy footprint JSON rows, width/height-only items, contained items, nested container items, standard/legacy equipped items and accessories, unknown item lore/root/container annotations, fake unknown inventory records, combined mounted import, failed saves, real reload recovery and healed retries. The source is not rewritten on decode. Unsupported unrelated nested arrays and cyclic/BigInt refusal controls remain retained.

### Concrete regression in changed traversal

This is an actual existing production shape, not an invented unknown field:

- ContainerWizard.jsx:117-138 authors containerProperties.shape using containerShapeFromCells; the item list is containerProperties.items.
- ItemLibrary.jsx:728-786 preserves containerProperties.shape on container creation/editing.
- inventoryStore.js:775-789 and 894-895 preserve containerProperties during library-to-inventory conversion.
- containerShapeUtils.js:3-24 reads individual floor booleans; ContainerWindow imports/uses that production consumer.
- characterShapeCodec.js:16-30 maps the item's direct shape.cells and contained child items, but never the known containerProperties.shape.cells.

Independent external production-composition probe:

1. Create [[true,false],[true,true]] with the actual production containerShapeFromCells utility. Add the resulting ContainerWizard representation with actual inventoryStore.addItemFromLibrary(...,{preserveProperties:true,preserveId:true}). It returns shaped-pack; inventory contains the authored container and its separately generated outer footprint.
2. Save through actual core saveCurrentCharacter/canonical service and outcome/runtime service. Canonical status becomes error with "Character storage would change preserved data"; runtime returns success:false with its corresponding refusal. No shaped-pack payload reaches either character destination. The owned interior matrix remains raw, so sanitizer change detection refuses it.
3. Put the established JSON-row representation ["[true,false]","[true,true]"] at the known interior path in both documents. Both production loaders leave those rows as strings. The actual getContainerShapeCells consumer returns [[true,true],[true,true]], losing the blocked upper-right cell.
4. Execute the identical probe against the verified frozen historical snapshot. Canonical/runtime saves succeed, both destination writes occur, and both loaders/production floor consumer return the exact intended [[true,false],[true,true]]. Its source manifest exactly equals the frozen manifest.

Evidence: container-probe.json, container-probe-final.utf8.log, container-historical.json and container-historical.utf8.log. Both final probes have zero page errors. The initial external probe had an assertion expecting addItemFromLibrary to return a success object; inspection showed the API returns the added ID. Only that external assertion was corrected, and the unsuccessful initial log is retained.

Therefore the exact unrelated-data fix works, but R1's requested production-location/legacy compatibility acceptance fails. A save refusal prevents lossy submission, yet refusal of a legitimate previously supported item and misinterpretation on load violate frozen contract #7 and roadmap backward compatibility. No fix was implemented.

## R4 — PASS within the reviewed consumed-type boundary

- Actual mounted import of canonical.class={invalid:"object"} visibly refuses with "Import failed: Invalid class type: expected a non-empty string".
- Selection, complete roster, live resources/equipment/class/notes/skills/banks, inventory, condition/quest projections and both recovery candidate payloads are identical before/after. Exact input file text remains intact. ARIA snapshot includes the alert.
- All 17 malformed controls refuse without mutation: name, race, class-array, subrace, level, acquisition record, known-spell list, progression history, canonical root resource value, runtime temporary resource, inventory position, item footprint matrix, currency, equipment item, quest entry, condition entry and lore notes.
- Both lanes are fully preflighted before staging; the owning hook starts canonical debounce retirement and projection application only after validation returns. Existing all-lane controls show invalid runtime data cannot apply a valid canonical lane.
- Legitimate existing data, exact runtime/combined imports, custom strings Custom Hero / Custom Kin / Custom Calling, custom acquisition/body content and preserved unknown annotations remain accepted. No catalogue membership or universal class-bank schema is imposed, and uninterpreted unknown fields are preserved.

The independent decision is based on production source ordering plus recorded mounted before/after observations, not only runner labels.

## Executed retained regression controls

All five requested commands executed from D:/VTT/vtt-react:

    node verification/p6/remaining-browser.cjs --red
    node verification/p6/remaining-browser.cjs
    node verification/p6/regressions-browser.cjs
    node verification/p6/character-save-browser.cjs
    node verification/p5-01/character-preservation-browser.cjs

- Exact historical RED: 2/2 valid reproductions; zero page errors.
- Focused GREEN: 4/4 scenarios, including 17 malformed refusals; zero page errors. This does not cover the independently demonstrated container-grid omission.
- Existing R1-R6 browser runner: 14/14 GREEN; retain R2/R3/R5/R6 acceptance, including account/same-UID retirement, exact runtime import, subsequent edits and same-owner healing.
- Original P6 browser: 5/5 named witnesses PASS.
- Original P5 browser: 3/3 PASS (pending-edit, failed-preservation, marker-failure), including preservation holds, zero retirement submissions and exact recovered notes.
- Four original supplemental retained controls pass: canonical/runtime write serialization, later edit/old-token protection, mounted cyclic export refusal and retained reconciliation/no false completed sync.
- Exact retained 18-suite selection was re-executed: 18/18 suites, 134/134 tests, no failures/skips; 20.658 seconds. It includes the unchanged 16-suite P5 command boundary previously accepted as 99 tests, plus P6/closure suites. Full verbatim command/results: regressions.utf8.log.

Runner output behavior was inspected first. Fresh JSON writes were redirected externally through NODE_OPTIONS/fs-write redirection; scenarios, production module bodies and assertions were unchanged. remaining-output.cjs was used with an outer external redirect for the retained runner. Original P5/P6 harnesses print results; their logs were redirected externally. No freeze/finalizer was run.

## Matching lint/build evidence

- Preserved targeted lint log is empty, matching the three unchanged correction files and two permanent runners; the handoff records exit 0 and 0 errors/warnings. Its artifact hash matches final identity.
- Preserved detached full frontend build says Compiled successfully, exit file 0. All three correction hashes match its before/after records and current reviewed bytes. Its external CRACO config reuses original configuration and disables caches; output was isolated externally.
- Build-time renderer drift remains explicitly recorded. This verifies correction compilation, not exact-current whole-checkout renderer build identity. No fresh whole-checkout build was needed to establish this bounded behavioral BLOCK.
- Fresh whole-worktree git diff --check reported concurrent InquisitorResourceBar.jsx:314 trailing whitespace, outside the behavioral set. It was not changed or treated as a P6 behavioral blocker.

## Simulation limits and remaining gates

Real Chrome, installed React/Zustand, unchanged compiled production bodies, actual stores/coordinator/gates, mounted provider/status/file input, localStorage/Web Locks and real document/module reload execute. Auth/config and Firestore transport/admission are simulated. Focused/retained/new container fixtures record write attempts before admission/refusal and reject nested arrays. Fixture cloud maps survive reload via sessionStorage; focused recovery restores both refusal flags before mount.

No actual Firebase SDK/backend rules/admission, full App/router-shell interactive acceptance, staged deployment or second-device durability proof. Backup creation is reachable in the browser; backup restoration remains deferred and unexpanded. R5 origin session memory remains private, same-page owner-return-accessible and not reload-durable; its prior accepted bounded limits are carried forward.

P5 remains 33 accepted / 0 source BLOCK / 9 environment-blocked / 0 inconclusive within its accepted scope. P5-05/07/09/10/11/12/13/31/32 remain outstanding. Passing simulation does not close them or establish deployment readiness.

## Read-only effects and stop

Fresh artifacts and authored verification scripts are exclusively under D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012; snapshot extraction uses external p6-remaining-reviewed-* and p6-container-reviewed-* directories. Full before/after hashes, focal hashes, dependency integrity, historical/corrected observations, logs and this report are saved there.

The review changed no production, repository evidence, contract, runner or other repository file. Observed repository changes are concurrent renderer/style work outside all 266 behavioral dependencies and are preserved. No repository additions occurred. No commit, push, deployment, implementation or P7 work occurred.

Final verdict: BLOCK. Stop after this verdict.
