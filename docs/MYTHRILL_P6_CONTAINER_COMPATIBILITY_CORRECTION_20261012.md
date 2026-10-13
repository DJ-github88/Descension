# Container compatibility corrected, awaiting independent acceptance

2026-10-12. **P6 remains BLOCK pending independent acceptance.** R2/R3/R4/R5/R6
independent acceptance and the corrected unrelated-annotation behavior are
carried forward. P5 remains **33 accepted / 0 source BLOCK / 9 environment-blocked /
0 inconclusive**. P5-05/07/09/10/11/12/13/31/32 remain outstanding.

## Identity and scope

- Checkout `D:/VTT`, execution directory `D:/VTT/vtt-react`, branch `master`.
- HEAD `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`, unchanged.
- All five focal source/witness hashes matched the remaining independent review
  before work. Initial codec SHA256:
  `76c7261701e6d6a5a920ebfa9e31c38b24cb0bf3072d5bbc95c4c526222f1c58`.
- Only production file changed by this task: `src/utils/characterShapeCodec.js`.
  Final SHA256:
  `ddbd6d694e62a8a14709d058be69b14b0fcce20d32364be69564dd8303a83b37`.
- New permanent regression: `verification/p6/container-browser.cjs`, SHA256:
  `706e4f964b6a89612044ffc9e15f354b18118b375b985d24b191aadaac7003c4`.
- Added this handoff and the byte-exact independent BLOCK report at
  `docs/MYTHRILL_P6_CONTAINER_INDEPENDENT_BLOCK_20261012.md`.
- New evidence is under `vtt-react/verification/p6/evidence/container` and
  `D:/AppData/Temp/opencode/p6-container-correction-20261012`.
  Full before/after inventories, file changes and hashes accompany the evidence.
- No worktree reset, persistence redesign, commit, push, deployment or P7 work.
  Concurrent renderer/style changes are preserved and recorded separately in the
  integrity inventory.

Paths beginning `src/` or `verification/` below are relative to `vtt-react`.

## Independent BLOCK and exact evidence preserved

The complete original review at
`D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012/review.md` and all **38**
artifacts in that directory remain byte-identical. Byte-verified copies, including
`container-probe.json`, `container-historical.json`, original scripts, logs and
before/after records, are retained at:

`verification/p6/evidence/container/independent-remaining-20261012/`

Its `preserved-manifest.json` records every copied SHA256. Earlier repository
P5/P6 evidence, accepted reports, frozen contract, independent BLOCK reports and
immutable snapshots were not overwritten. Fresh outputs from existing runners
were redirected to the new external evidence directory.

## Permanent regression before correction

The independent production-composition probe was promoted to
`verification/p6/container-browser.cjs` **before changing the codec**. It uses
the existing production compiler harness, actual production stores/services,
actual `containerShapeFromCells`, and actual
`inventoryStore.addItemFromLibrary(..., {preserveProperties:true,preserveId:true})`.
The independent probe's authored representation and separate footprint are
retained without substituting a synthetic codec-only example.

The new complete pre-correction archive contains **269** individually verified
files. SHA256:

`f087a576076a97e47e982253a64fac7eba86a41b8c11625ae74a7030b0d83b0e`

`--red` reads this immutable archive, extracts it externally, verifies every
file and requires the exact frozen production manifest. No reset is involved.

### Exact RED → GREEN

| Observation | Before correction | After correction |
|---|---|---|
| Authored interior `[[true,false],[true,true]]` | Canonical status `error`; runtime `success:false`; both report storage would change preserved data | Canonical status `saved`; runtime `success:true`; both candidate lanes confirm |
| Authored destination writes | Zero shaped-pack payload writes | Payloads reach `characters/c-a` and `users/u-a/characterStates/c-a` |
| Both production loaders, freshly saved data | Save refused | Exact interior shape object and topology preserved |
| Both loaders, explicit legacy rows `['[true,false]','[true,true]']` | Interior rows remain strings | Interior boolean matrix restored |
| Actual production floor consumer | `[[true,true],[true,true]]`: upper-right blocked cell lost | `[[true,false],[true,true]]`: blocked cell retained |
| Separate outer footprint | Existing rectangular 2×2 footprint | Same complete rectangular footprint, distinct from interior |

Before correction, `--red` exited 0 for the **two valid failure reproductions**;
the ordinary expected-success invocation exited **1**, with observations saved
as `pre-correction-probe.json`. After correction the same expected-success
invocation exited **0**. RED was replayed from the permanent archived snapshot
after correction and still reproduced both exact failures.

`--historical` executed the retained earlier frozen source and confirmed both
saves, both destination writes, exact loader topology and floor compatibility.
Its entire manifest matches the original independent `container-historical.json`.
The earlier snapshot SHA256 remains:

`0afa985b4679640c7ae945f14af17296f7004f29db9c1ad65b2d6e1653088be3`

## Bounded schema inspection and fix

Read the codec and every caller: canonical transform/load, runtime save/load/
updates/load-all, import preflight, and owning recovery/application hook.
The directly relevant item/container inspection covered:

- `ContainerWizard.jsx:117–138`: authors interior with `containerShapeFromCells`
  at `containerProperties.shape`; contained items at `containerProperties.items`.
- `ItemLibrary.jsx:728–786`: preserves that interior on creation/editing.
- `inventoryStore.js:775–789, 837, 894–895`: conversion preserves container
  properties separately from the item footprint; addItem creates the footprint.
- `containerStore.js:7–17`: legacy container records have an `items` collection.
- `ContainerWindow.jsx:114–117`: consumes the explicit interior via
  `isContainerCellFloor`; `containerShapeUtils.js:3–24` consumes floor booleans.
- Supported equipment slots/aliases and existing item traversal/import boundary.

No additional omitted interpreted shape location was identified in this bounded
character item/container path inspection. This is not an inventory-wide audit.

The existing row conversion is factored into `mapShape`, called only for:

1. Each supported item's own `shape` (outer footprint).
2. That item's explicit `containerProperties.shape` (interior floor).

Existing item traversal applies both independently to `inventory.items[]`,
`inventory.containers[].items[]`, equipment slots/legacy aliases/accessories,
and recursively `containerProperties.items[]`, including nested containers.
Unknown fields are not recursively inspected. In particular,
`futureAnnotation.shape.cells: ['[true]']` remains literal at root, item and
container annotation locations. The canonical/runtime sanitizer change-detection
guards and import validator ordering are unchanged.

Only the codec differs among all **266** production dependencies between the
pre-correction RED and final container GREEN manifests.

## Verification commands and results

Initial capture and reproduction, before codec correction:

```powershell
$env:P6_CONTAINER_EVIDENCE='D:/AppData/Temp/opencode/p6-container-correction-20261012'
node verification/p6/container-browser.cjs --freeze
node verification/p6/container-browser.cjs --red
node verification/p6/container-browser.cjs --historical
node verification/p6/container-browser.cjs
```

Final commands (existing-runner JSON output redirected externally through the
archived `output.cjs`; logs/exit records captured with archived `run.cjs`):

```powershell
node verification/p6/container-browser.cjs
node verification/p6/container-browser.cjs --red
node verification/p6/remaining-browser.cjs --red
node verification/p6/remaining-browser.cjs
node verification/p6/regressions-browser.cjs
node verification/p6/character-save-browser.cjs
node verification/p5-01/character-preservation-browser.cjs
node verification/p6/evidence/remaining/retained-controls.cjs
node node_modules/eslint/bin/eslint.js src/utils/characterShapeCodec.js verification/p6/container-browser.cjs
```

- New container GREEN: saves/loads/legacy floor and **eight supplemental checks**
  pass, zero page errors. Exact inventory and annotations survive supported
  nested containers, legacy container items, standard/legacy equipped items and
  accessories, combined mounted file import, rejected saves, real document/module
  reload recovery and healed retries. Both lanes' complete interior/footprint
  objects remain distinct and intact.
- Focused existing codec/import browser: **4/4 GREEN**, including **17 malformed
  type refusals** and unchanged annotation/import/recovery controls.
- Retained R1–R6 browser: **14/14 GREEN**, preserving R2/R3/R4/R5/R6 acceptance.
- Original P6: **5/5 named witnesses PASS**.
- Original P5: **3/3 PASS** (pending-edit, failed-preservation, marker-failure).
- Retained supplemental: **4/4 PASS** (canonical/runtime serialization,
  later-edit/old-token protection, cyclic export refusal and retained sync).
- Exact retained Jest selection: **18/18 suites, 134/134 tests**, no skips or
  failures, **21.414 s**. Verbatim full command and output are retained in
  `regressions.utf8.log`; it includes the unchanged accepted 16-suite P5 boundary.
- Targeted lint: **exit 0**, empty output, no warnings/errors.
- Scoped `git diff --check`: **exit 0**.
- Separate Playwright MCP check asserts both `saved` statuses, exact interior
  and footprint, both destination encodings, unchanged literal annotation, and
  `isContainerCellFloor(shape,0,1) === false` in both lanes. ARIA snapshot shows
  both **Cloud saved · Device draft retained** statuses; evidence is
  `mcp-container.json` and `mcp-container.yml`.

Setup/artifact attempts are retained honestly: the first incomplete 268-file
freeze omitted the virtual config resolver's required file and failed before
scenarios; a separate complete archive was captured before the fix. A fresh
output-name collision between container and retained-runner JSON was discovered
by archival validation, fixed in the external redirect only, and both affected
runners were regenerated successfully. The initial MCP observation filtered
metadata-only writes too broadly; its observation filter was narrowed. An
external MCP output path was denied, so final MCP artifacts use the new allowed
repository evidence directory. None changed production code or original evidence.

## Simulation limits and acceptance boundary

Real Chrome, installed React/Zustand, unchanged compiled production bodies,
actual stores/coordinator/privacy gates, mounted provider/status/file input,
localStorage/Web Locks, and real document/module reload execute. Auth/config,
Firestore transport and backend admission are simulated; the container fixture
records attempts and rejects nested arrays. Simulated cloud documents survive
reload through sessionStorage; recovery flags are restored before mount.

Container authoring uses the actual production shape utility and wizard-authored
schema, followed by actual library-to-inventory conversion. The ContainerWizard
form and full ItemLibrary UI are not mounted. The actual production floor helper
is exercised; the full ContainerWindow drag/drop UI is not mounted. No actual
Firebase SDK/backend rules, full App/router-shell acceptance, deployment or
second-device durability proof is established. Backup restoration remains
deferred; R5's accepted private same-page, non-reload-durable origin-memory limit
is unchanged. Passing these simulations closes no P5 environment gate.

**container compatibility corrected, awaiting independent acceptance.**
