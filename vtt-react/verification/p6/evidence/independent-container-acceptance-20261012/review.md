# Independent bounded acceptance — P6 container compatibility — 2026-10-12

## Final P6 verdict: PASS — source acceptance

The sole remaining R1 container compatibility blocker is closed. Carry forward independent PASS for R2/R3/R4/R5/R6 and the unrelated-annotation correction; refreshed affected controls show no concrete regression. This accepts the reviewed P6 source within its frozen boundary, not deployment readiness.

## Reviewed identity and evidence integrity

- Checkout: D:/VTT; branch master; execution directory D:/VTT/vtt-react.
- HEAD: 620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b. Acceptance concerns the explicitly hashed, uncommitted worktree source rather than HEAD alone.
- Read the complete independent container BLOCK and correction handoff, original roadmap Project 6, frozen contract, codec, permanent container/remaining runners and the relevant production producer/conversion/consumer/save/load/import/recovery composition.
- Before/after inventories cover 12,175 repository files, including tracked/untracked files and the full verification tree. No surveyed repository file changed or was added. Full source/witness/document hashes are in before.json and after.json; focal before/after identities are in focal-hashes.md and the integrity decision in integrity-summary.json.
- Codec SHA256 matches the requested correction: ddbd6d694e62a8a14709d058be69b14b0fcce20d32364be69564dd8303a83b37.
- Permanent container-browser.cjs SHA256: 706e4f964b6a89612044ffc9e15f354b18118b375b985d24b191aadaac7003c4, matching the handoff and freeze runner identity.
- Independently verified all 97 retained container artifact-manifest entries and all 38 preserved independent-review artifacts. The preserved BLOCK report is included. No original evidence was overwritten.
- Independently verified both compressed snapshot SHA256s, every embedded file hash, and every file against its corresponding retained independent source inventory: 269/269 files each. Pre-container-correction RED snapshot: f087a576076a97e47e982253a64fac7eba86a41b8c11625ae74a7030b0d83b0e. Earlier historical compatibility snapshot: 0afa985b4679640c7ae945f14af17296f7004f29db9c1ad65b2d6e1653088be3.
- Fresh RED manifest equals freeze-complete.json. Fresh historical manifest equals both the retained original independent container-historical.json and correction historical.json. Only utils/characterShapeCodec.js differs among the 266 production dependencies between fresh RED and GREEN. Current dependencies match the retained correction GREEN. Roadmap, frozen contract, accepted P5 report and retained witness sources remain byte-identical to their prior independent inventory.

## Specific observations

Executed these exact runner commands from D:/VTT/vtt-react, with fresh writes redirected externally through an fs-write shim and unchanged scenarios, assertions and production bodies:

```text
node verification/p6/container-browser.cjs --red
node verification/p6/container-browser.cjs --historical
node verification/p6/container-browser.cjs
```

### RED: both exact failures reproduced

- Actual production containerShapeFromCells authors [[true,false],[true,true]] at item.containerProperties.shape.cells. Actual inventoryStore.addItemFromLibrary(...,{preserveProperties:true,preserveId:true}) adds shaped-pack with a separate full rectangular 2x2 outer footprint.
- Canonical status becomes error with "Character storage would change preserved data"; runtime success is false with the corresponding runtime storage refusal. No shaped-pack payload reaches either destination.
- Explicit established legacy interior rows ["[true,false]","[true,true]"] remain strings through both production loaders.
- Actual getContainerShapeCells, which invokes isContainerCellFloor, yields [[true,true],[true,true]] in both lanes: the upper-right blocked floor cell is lost.
- RED exit 0 means these failure-reproduction assertions succeeded. Independent observations.cjs rechecks the saved values and identity rather than accepting the runner label or exit alone. Zero page errors.

### Historical: original compatibility confirmed

- Canonical status saved; runtime success true; authored payload writes reach characters/c-a and users/u-a/characterStates/c-a.
- Both freshly saved and explicitly legacy documents load the exact interior shape object and topology. The actual floor consumer yields [[true,false],[true,true]].
- Separate outer footprint remains [[true,true],[true,true]]. Full source manifest matches the retained independent historical witness. Zero page errors.

### Corrected GREEN: exact R1 behavior passes

- Both authored saves confirm and publish to their proper destinations. The recorded raw destination payloads independently show the interior encoded as JSON rows and the footprint independently encoded as full rectangular rows.
- Both loaders preserve the complete authored interior and footprint objects for fresh saves and explicit legacy rows. The production floor consumer retains the upper-right false cell in each lane.
- Eight supplemental controls pass: distinct footprint/interior; nested containers; legacy inventory.containers[].items[]; standard/legacy equipment and accessories; literal annotations; mounted combined file import; rejected-save/real document reload recovery; healed retries.
- Complete lane inventories and tested equipment items remain exact across mounted import, successful loads, rejected saves, retained reload recovery and healed retries. Recovery retains canonical notes "container recovery" and runtime HP8.
- Unrelated futureAnnotation.shape.cells remains ["[true]"] at root, item and container-annotation locations. Existing remaining-browser controls also cover unrelated fake inventory records and preserved custom/body/acquisition content.
- Final real-browser ARIA snapshot shows both "Cloud saved · Device draft retained" statuses. Zero page errors. Raw evidence and independent cross-checks are in container-red.json, container-historical.json, container-green.json, observations.json and container-final.yml.

## Producer/conversion/consumer inspection and R1 decision

The producer and its consumers are established production paths:

- ContainerWizard.jsx:117-138 writes containerProperties.shape with containerShapeFromCells and stores children in containerProperties.items.
- ItemLibrary.jsx:728-786 preserves that interior for creation/editing.
- inventoryStore.js:775-789 preserves the library properties; 837 and 894-895 maintain direct footprint/container properties separately. addItem creates the independent outer footprint.
- ContainerWindow.jsx:114-117 reads the explicit interior and calls isContainerCellFloor; containerShapeUtils.js:3-24 interprets individual floor booleans.
- characterShapeCodec.js:11-40 maps item.shape and explicit item.containerProperties.shape independently. The existing bounded item traversal reaches top-level inventory items, legacy container children, nested containerProperties.items, supported equipment slots/aliases and accessories. Unknown fields are not recursively decoded.
- Canonical transformForStorage/transformFromStorage, runtime save/load/update/load-all, import preflight and owning applyRuntime use this same codec. Sanitizer change-detection guards and validate-all-lanes-before-stage/application ordering are unchanged.

These producer/conversion/consumer files are unchanged from the prior independent review. The witness executes the actual shape authoring helper, conversion, stores, save/load services and floor helper. It does not mount the full Wizard/ItemLibrary forms or full ContainerWindow drag/drop UI. A new full-Wizard gate is not required by the frozen contract, and this composition is not full-App acceptance.

**Independent R1 container compatibility decision: PASS within the frozen supported-location/legacy boundary.** The demonstrated legitimate-save refusal and lossy legacy floor interpretation are closed; no concrete correction-related regression was found.

## Retained acceptance and affected regressions

Carry forward independent R2/R3/R4/R5/R6 and the unrelated-annotation correction. The shared codec is a dependency of the save/load/import paths, so the bounded recorded regression selection and affected browser controls were refreshed instead of opening a general P5/P6 audit:

| Check | Fresh result |
|---|---|
| remaining-browser.cjs | 4/4 GREEN; 17 malformed consumed-type refusals |
| regressions-browser.cjs | 14/14 GREEN |
| Original character-save-browser.cjs | 5/5 named witnesses PASS |
| Original P5 character-preservation-browser.cjs | 3/3 PASS |
| Retained supplemental controls | 4/4 PASS |
| Recorded affected Jest selection | 18/18 suites, 134/134 tests, no failures/skips; 32.414 seconds |
| Targeted codec/permanent-runner ESLint | Exit 0; empty output, no errors/warnings |
| Scoped git diff --check | Exit 0; only informational LF/CRLF warnings |

The 18-suite selection retains the accepted 16-suite P5 boundary plus P6/closure suites. The same test paths/behavioral flags were invoked via the installed react-scripts entry point, with only an external Jest cache directory added. Verbatim invocation is in regressions.exit.json; output in regressions.utf8.log.

Refreshed controls preserve later-edit/old-token truthfulness, canonical/runtime serialization, rejected imports before mutation, legitimate exact imports/subsequent edits, same-owner healing, account/same-UID generation retirement, memory-only export refusal and retained reconciliation without false completed sync. Original P5 pending-edit, roster-refusal and marker-refusal witnesses pass; their source manifests were checked. Retained independent findings and limits are reused for unchanged source rather than reaudited.

## Compilation and final integrity

- Fresh detached CRACO production build: **Compiled successfully**, build.exit **0**. It was required because the retained earlier build's codec identity predates this correction.
- build.cmd runs the installed CRACO entry point against an external config that reuses the project's original configuration and disables filesystem/Babel/ESLint caches. BUILD_PATH and caches are external. Build process PID23236 completed; no dev server or long-running review process remains.
- The complete reviewed worktree inventory, including all focal production/witness files, is byte-identical before/after. All 266 fresh behavioral manifest dependencies match both inventories. Frozen roadmap/contract, repository verification evidence and concurrent renderer/style work are preserved. HEAD and worktree status are unchanged.
- Build log and generated assets are external. Compilation confirms source integration for these unchanged bytes; it does not establish full-App behavioral acceptance or cloud deployment readiness.

## Simulation limits and outstanding environment gates

Real Chrome, installed React/Zustand, unchanged Babel-compiled production module bodies, actual stores/coordinator/privacy gates, mounted provider/status/file input, browser localStorage/Web Locks and real document/module reload execute. Auth/config, Firestore transport and backend admission are simulated. Fixtures record write attempts and reject nested arrays; fixture cloud documents survive reload in sessionStorage, with refusal flags explicitly restored before recovery mount.

No actual Firebase SDK/backend rules/admission, staged deployment, second-device durability or full App/router-shell interactive acceptance is established. Build compilation does not establish those gates. Backup restoration remains deferred. R5's accepted private same-page origin-memory retention remains non-reload-durable. This review closes no P5 environment gate.

P5 remains **33 accepted / 0 source BLOCK / 9 environment-blocked / 0 inconclusive**. P5-05/07/09/10/11/12/13/31/32 remain outstanding.

## Read-only effects and stop

All fresh scripts, logs, browser observations, snapshots, caches and build output are under D:/AppData/Temp/opencode/p6-container-independent-20261012. Historical runner extraction occurs only in external p6-container-replay-* temporary directories. Existing repository evidence is read-only. Setup/indexing/summarizer corrections are recorded in setup-notes.md; production bodies and permanent runner assertions were unchanged.

Final before/after comparison confirms **no repository files changed or added**; concurrent renderer/style work was preserved. No fix, commit, push, deployment or P7 work was performed.

**Independent R1 decision: PASS. Final P6 verdict: PASS (source).** Nine P5 environment gates remain outstanding. Stop after this verdict.
