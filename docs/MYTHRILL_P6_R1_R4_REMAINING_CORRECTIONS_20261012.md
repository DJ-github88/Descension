# Two remaining P6 corrections implemented, awaiting independent acceptance

2026-10-12. **P6 remains BLOCK pending independent re-review.** This is an
implementation/evidence handoff, not acceptance. The independently accepted
R2/R3/R5/R6 behavior is retained. P5 remains **33 accepted / 0 source BLOCK /
9 environment-blocked / 0 inconclusive**, with all nine environment gates open.

## Actual source identity

- Checkout: `D:/VTT`.
- HEAD before/after: `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
- Corrections remain uncommitted. At start, all **11,993** tracked/nonignored
  untracked file hashes matched the independent re-review's `after.json`.
- Full before/after hashes, worktree, witness manifests, concurrent drift and
  evidence identity are in `verification/p6/evidence/remaining/final-identity.json`.
  Full five focal source/witness hashes are in `remaining/source-hashes.md`.
  Exact task-added files and existing-file modifications are in
  `remaining/file-changes.json`.
- `remaining/correction-only.patch` compares the three production files with
  the verified reviewed snapshot, rather than HEAD's inherited P5/P6 work.

Paths above and below under `verification` are relative to `vtt-react`.

## Independent reports preserved as historical evidence

The complete new independent BLOCK report was copied byte-for-byte to:

- `docs/MYTHRILL_P6_INDEPENDENT_REREVIEW_BLOCK_20261012.md`
- `verification/p6/evidence/independent-rereview-20261012/review.md`

All **27** external re-review supporting artifacts were preserved byte-for-byte
under that same evidence directory, including `gaps.json`, `observations.json`,
`mcp-invalid-import.yml`, full before/after hashes, original scripts and logs.
`preserved-manifest.json` records SHA256s for those copies. External originals
remain at `D:/AppData/Temp/opencode/p6-rereview-20261012`.

The earlier `MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md`, its
`evidence/independent-20261012` artifacts, original six-defect snapshot, correction
report and original final identity are unchanged. Frozen P6 contract, accepted
P5 report and original P5/P6 witness files are unchanged.

## Exact RED frozen before production correction

Permanent witness: `verification/p6/remaining-browser.cjs`.

```powershell
node verification/p6/remaining-browser.cjs --freeze
node verification/p6/remaining-browser.cjs --red
```

Before any production correction, the complete snapshot froze **269** files,
each verified against the independent re-review's hashes. Compressed SHA256:
`0afa985b4679640c7ae945f14af17296f7004f29db9c1ad65b2d6e1653088be3`.
Archive: `remaining/reviewed-source-complete.json.gz`.
`remaining/reviewed-witness.cjs` preserves the exact pre-correction runner;
`--red` replays that runner against the isolated snapshot, even as GREEN controls
are refined. Installed dependencies come from the checkout. No worktree reset
or source overwrite is involved.

Both specific original failures reproduced, exit 0:

1. **R1** — real production inventory add, canonical store save and runtime
   candidate save both confirm. Raw documents retain unrelated
   `futureAnnotation.shape.cells: ["[true]"]`, but canonical and runtime production
   loads return `[[true]]`. Ordinary item matrix also remains `[[true]]`.
2. **R4** — clean matching mounted file-input import containing
   `canonical.class: {invalid: "object"}` and `runtime:null` changes roster class,
   live class and retained canonical class to that object. Imported notes replace
   the baseline; no alert. The exact input file is retained.

`remaining/first-red.json` preserves the first successful pre-correction
observations. `remaining/red.json` and `final-red-replay.log` verify the same
immutable reproduction after correction. RED's manifest exactly equals the frozen
manifest. Exit 0 means those particular reproduction assertions succeeded.

The initial 268-file freeze omitted the config file required by the harness's
virtual-module resolver and failed before browser scenarios. That attempt and
log are retained; it is not counted as RED. The separate complete snapshot and
successful exact RED were created before production changes. No frozen archive
was overwritten.

## R1 — item-path-bounded codec

Changed production file: `src/utils/characterShapeCodec.js`.

The codec no longer walks arbitrary nested properties named `shape`. It maps
only direct item footprints at the supported production locations:

- `inventory.items[]`
- `inventory.containers[].items[]` (container store records)
- item `containerProperties.items[]`, including nested containers
  (ContainerWizard/ItemLibrary persisted representation)
- canonical equipment slots from existing `EQUIPMENT_SLOT_KEYS`, supported
  legacy aliases `weapon/armor/shield/main_hand/off_hand`, and `accessories[]`

Only each item's own `shape.cells` boolean matrix is encoded/decoded. Unrelated
root annotations, item lore, container annotations and unknown fields remain
untouched. Non-record data passes through unchanged rather than being converted
to an empty object. The existing JSON inner-row representation is retained;
legacy rows and newly encoded rows use the same compatible format. Legacy items
with width/height and no shape remain valid. No field is removed, and the
canonical/runtime sanitizer change-detection guards are unchanged.

**GREEN:** canonical/runtime production save-load now return the exact literal
`["[true]"]` annotation. Both lanes preserve ordinary 1x1 and custom 2x2 shapes,
nested contained items, equipped items/aliases, unknown item lore and unrelated
fake-inventory records. Production loaders accept JSON rows and width/height-only
items. Mounted combined import, explicit retry, rejected writes, real document
reload and healed retry preserve the retained inventory and annotations in both
candidates.

## R4 — consumed-type validation before mutation

Changed production files:

- `src/services/firebase/characterPersistenceService.js`: reused validator now
  checks required `name/race/class` as nonempty strings and stats/resources as
  records. It does not require catalogue membership.
- `src/persistence/characterSaveOutcome.js`: preflight validates fields directly
  interpreted by the existing canonical loader, owning runtime application and
  item consumers: optional text/numeric fields, canonical root resources, known
  record/list fields, known-spell IDs, progression-history entries, inventory
  positions/dimensions/shapes/containers/currency, supported equipment items and
  condition/quest records. Supported item JSON rows are decoded for validation
  at owned paths only; the imported payload itself is not rewritten.

Both lanes still validate before any staging/application. Existing owner/identity,
all-lane validation and differing-unsaved-candidate refusal are preserved. Unknown
fields that these consumers do not interpret remain exact. Class-specific banks
and custom acquisition/body content are not forced into a new universal schema.

**GREEN:** the exact class object visibly refuses with:

`Import failed: Invalid class type: expected a non-empty string`

Roster, selection, live character resources/equipment/skills/banks, inventory,
conditions/quests and both recovery candidates remain unchanged. Input File text
is exact. The permanent witness records before/after projections and an ARIA
snapshot; a separate Playwright MCP mounted input check independently confirms
unchanged state/file and the visible alert (`remaining/mcp-class-refusal.yml`).

**17 consumer-derived malformed controls** refuse without mutation: name, race,
class-array, subrace, level, acquisition record, known-spell list, progression
history, root resource value, runtime temporary resource, inventory position,
item matrix, currency, equipment item, quest entry, condition entry and lore
notes. Positive mounted controls retain valid existing data and custom strings
`Custom Hero / Custom Kin / Custom Calling`, custom acquisition/body content,
unknown annotations, equipped/contained items and exact runtime import content.

The owning hook, core store, queue/session origin propagation and loader fences
were not changed by these corrections. Their accepted controls were re-executed.

## Final verification

From `D:/VTT/vtt-react`:

```powershell
node verification/p6/remaining-browser.cjs --red
node verification/p6/remaining-browser.cjs
$env:NODE_OPTIONS='--require=D:/VTT/vtt-react/verification/p6/remaining-output.cjs'
node verification/p6/regressions-browser.cjs
$env:NODE_OPTIONS=''
node verification/p6/character-save-browser.cjs
node verification/p5-01/character-preservation-browser.cjs
```

- Exact historical RED: **2/2 reproduced**, no page errors.
- Focused GREEN: **4/4 scenarios**, including both exact corrections,
  **17 malformed controls**, and compatibility/import/recovery.
- Unchanged accepted R1–R6 browser controls: **14/14 GREEN**; R2/R3/R5/R6 account,
  same-UID, subsequent-edit and same-owner healing controls retained.
  `remaining-output.cjs` redirects only this run's `evidence/green.json` write to
  `remaining/accepted-r1-r6-green.json`, preserving the earlier evidence bundle.
- Original P6 browser: all **five witnesses PASS**.
- Original P5 browser: pending-edit, failed-preservation and marker-failure
  **3/3 GREEN**, including preservation holds, zero retirement submissions and
  exact recovery.
- Four original supplemental controls rerun against final source: persisted
  canonical/runtime ordering, later-edit/old-token protection, cyclic/BigInt
  memory/export refusal, and retained reconciliation/no false completed sync.
- Exact existing **18-suite selection** from the prior correction report,
  retaining the prior **16-suite/99-test P5 boundary** plus P6/closure:
  **18/18 suites, 134/134 tests, no failures/skips; 21.331s**.
  Full verbatim command/results: `remaining/final-regressions.log`.

```powershell
npx --no-install eslint --no-eslintrc --config .eslintrc.js src/utils/characterShapeCodec.js src/persistence/characterSaveOutcome.js src/services/firebase/characterPersistenceService.js verification/p6/remaining-browser.cjs verification/p6/remaining-output.cjs
git diff --check
```

Targeted lint: **exit 0, 0 errors/warnings**. Diff check: exit 0; existing Git
LF-to-CRLF notices are not whitespace failures.

Final production build used the existing original-CRACO external configuration,
changing only output/cache isolation:

```powershell
Test-Path -LiteralPath "D:/AppData/Temp/opencode/p6-remaining-corrections-20261012"
Start-Process -FilePath "cmd.exe" -ArgumentList '/d','/v:on','/c','set NODE_OPTIONS=--max-old-space-size=8192&&set CI=true&&set BUILD_PATH=D:/AppData/Temp/opencode/p6-remaining-corrections-20261012/build-final&&npx --no-install craco build --config D:/AppData/Temp/opencode/p6-independent-20261012/build.config.cjs > D:/AppData/Temp/opencode/p6-remaining-corrections-20261012/build-final.log 2>&1 & echo !ERRORLEVEL! > D:/AppData/Temp/opencode/p6-remaining-corrections-20261012/build-final.exit' -WorkingDirectory "D:/VTT/vtt-react" -PassThru -WindowStyle Hidden
```

Polled in brief intervals. **Compiled successfully / exit 0**. The final three
correction-source hashes are identical at build start/end and in every final
GREEN manifest. This is a full frontend compilation, including the named
ClassCodex/spell-wizard/App/calm-shared presentation present at its start; it is
not a behavioral-only miniature build.

Concurrent resource-bar presentation continued changing during compilation.
`build-final-before.json` / `build-final-after.json` record five build-time drift
paths (MadnessGauge, TimeShardsStrain and Minstrel renderer/styles). Additional
Harbinger/Pyrofiend presentation changes occurred later. Therefore the build
proves final correction compilation, but does not certify the exact latest bytes
of every concurrently edited renderer. No extra build was launched merely to
chase unrelated presentation work. All those edits are preserved, and none is
in the bounded production witness manifests. ClassCodex, spell-wizard and App
remain byte-identical to task start; calm-shared gained concurrent class-tooltip/
menu presentation before the final build and was preserved.

The first build also succeeded. A final codec plain-record guard required the
second build and final affected checks. Early GREEN witness refinements settled
the real baseline debounce before the multi-case loop and compared authored
canonical data separately from its existing observational `updatedAt` metadata;
no production lossless-save guard or accepted R3 expectation was weakened.

## Limits, remaining gaps and independent handoff

Real Chrome, installed React/Zustand, unchanged compiled production bodies,
actual stores/coordinator/gates, mounted controls, localStorage/Web Locks and
document/module reload execute. Auth/config and Firestore transport/admission
are simulated. Writes are observed before fixture admission/refusal; nested
arrays are rejected by the corrected fixture. Cloud Maps survive reload only
in fixture sessionStorage; refusal flags are reinstated before recovery mount.
No real backend rules/admission, staged operation, second-device durability or
full App/router-shell interactive acceptance is claimed. The existing deferred
backup-restore observation is unchanged and was not reopened.

No remaining R1/R4 source defect is demonstrated by the final bounded witnesses.
Independent re-review is still required. The build identity limitation for
ongoing unrelated presentation is explicit above. P5-05/07/09/10/11/12/13/31/32
remain environment-blocked; their status is not changed by simulation.

New correction evidence is under `verification/p6/evidence/remaining`; external
working logs, isolated build outputs and verification scripts remain under
`D:/AppData/Temp/opencode/p6-remaining-corrections-20261012`. Before/after manifests
distinguish these intended corrections from concurrent presentation changes.
No commit, push, deployment, general audit, persistence rewrite or P7 work occurred.

**Disposition: two remaining P6 corrections implemented, awaiting independent acceptance.**
