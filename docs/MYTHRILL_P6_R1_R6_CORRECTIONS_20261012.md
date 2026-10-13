# P6 R1–R6 — bounded corrections and independent re-review handoff

2026-10-12. **P6 corrections implemented, awaiting independent acceptance.**
The last independent verdict is **BLOCK**. This report supplies implementation
and verification evidence; it does not accept P6. P5 retains **33 accepted / 0
source BLOCK / 9 environment-blocked / 0 inconclusive**.

## Checkout and source identity

- Actual checkout: `D:/VTT`.
- Actual HEAD before and after corrections:
  `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
- All changes remain uncommitted. No commit, push, deployment, P7 work or general
  P5 audit was performed.
- Before correction, **all 2,347 reviewed hashes matched** the independent
  `after.json`; no reviewed source drift existed. The verification script was the
  only new artifact when this comparison was made.
- Initial worktree: the reported 16 modified tracked / 12 untracked files,
  including existing P5 evidence, P6 source/witnesses and `ClassCodex.css`.
- During correction, concurrent work added an import to
  `components/spellcrafting-wizard/styles/pathfinder/all-spellwizard-styles.css`
  and introduced `spell-wizard-calm.css`. Those edits are preserved.
  `ClassCodex.css` remains byte-identical to its independent reviewed hash
  `a0406c34078720c4f96ac8ea5f89843bb9e61c94fc614fb51bdc35ea01106e5d`.
- Reviewed and corrected **full SHA256s for all eleven correction source/test
  files** are in
  [`source-hashes.md`](../vtt-react/verification/p6/evidence/source-hashes.md).
  Full relevant worktree, 2,347 final reviewed-file hashes, witness hashes and
  evidence hashes: `vtt-react/verification/p6/evidence/final-identity.json`.
  The old and final hashes identify uncommitted bytes, not just HEAD.
- `correction-only.patch` compares the nine existing changed production modules
  with the frozen reviewed source. Inspect the new codec and strengthened P6
  test separately; their exact hashes are in the same table. The ordinary
  `git diff` also includes the inherited pre-correction P6/P5 work.

## Independent evidence preserved exactly

Complete original report in the existing repository documentation location:

`D:/VTT/docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md`

Its original reviewed identities, BLOCK conclusions and simulation limitations
are intact. Supporting original evidence is copied byte-for-byte into:

`D:/VTT/vtt-react/verification/p6/evidence/independent-20261012/`

This includes `review.md`, `reviewed-hashes.md`, `before.json`, `interim.json`,
`after.json`, `supplemental.cjs`, `supplemental-results.json`, `supplemental.log`,
`evidence-summary.json`, regression/lint/P5/P6 logs and both original build
attempts. The external originals remain under
`D:/AppData/Temp/opencode/p6-independent-20261012/`.

The accepted P5 independent report and its two browser witness files remain
byte-identical to their reviewed versions. The P6 frozen contract is unchanged.
The prior P6 implementation report has only a historical-status banner; its
original evidence is retained below that banner.

## Permanent RED before any production correction

`vtt-react/verification/p6/regressions-browser.cjs --red` reuses the exact
independent supplement and original production browser harness. It extracts
`evidence/reviewed-source.json.gz` to an isolated temporary snapshot and compiles
the original production modules unchanged. It never resets or overwrites the
working tree. Installed dependencies are resolved from the checkout.

- Snapshot: **268 files**, SHA256
  `340b007680f2e6b456fa35a9414fb726f6e5c4bf0b3517569f055d96b056aa11`.
- RED result: `verification/p6/evidence/red/supplemental-results.json`.
- The RED module manifest exactly equals the original independent supplement's
  manifest. Six specific defects reproduced; four original positive controls
  also completed. Exit 0 means the reproduction assertions succeeded.
- Production corrections started only after this RED execution completed.

## R1–R6: original RED → correction → exact GREEN

GREEN evidence for every named scenario below:
`vtt-react/verification/p6/evidence/green.json` (`results[].name`).
Console summary: `evidence/corrections-browser.txt`.

| Failure | Frozen original RED | Bounded correction | Exact GREEN witness |
|---|---|---|---|
| **R1** | Production `addItem` authors `ordinary-blade`, position `{row:0,col:0}`, `shape.cells:[[true]]`; canonical/runtime both refuse it and no item-bearing payload reaches either character destination. | Reuse the sanitizer's JSON inner-row convention through a small, lossless **known boolean shape matrix** codec. Encode at canonical/runtime writes; decode canonical/runtime reads and runtime application, including realtime data. Keep the sanitizer change-detection guards. | `R1-ordinary-production-inventory-save-load-recovery-import`: both lanes confirm; canonical/runtime service loads reproduce the complete item exactly; mounted import retains it; rejected saves plus a real document/module reload recover HP8 and the exact item, then healed retries confirm. `control-valid-combined-import-and-production-custom-matrix` also preserves a production-authored 2×2 custom matrix and item lore. |
| **R2** | After the real failed 2,000ms autosaves settle, importing notes `older exported draft` / HP19 replaces notes `newer work to preserve` / HP7 and both retained candidates without an alert. | Refuse any different unsaved lane before staging or application. Current candidates remain intact; the unchanged import file stays in the file input/on disk. The alert tells the user to retry/download current work first. | `R2-older-import-protects-newer-work`: notes, HP7, roster and both exported candidates equal their pre-import values; visible unsaved-work refusal; the selected File's exact text still equals the old JSON. |
| **R3** | Runtime-only HP5 / `imported-blade` is replaced synchronously by the old HP21 / empty inventory projection, with no alert. | A conflicting runtime-only import is visibly refused. Clean supported imports go through the owning persistence hook's existing synchronous application guard. Clear only the validated import's old timers; genuine subsequent edits still stage normally. | `R3-runtime-only-conflicting-import-visibly-refused`: HP21 and both current candidates survive, exact HP5/item file remains available. `control-valid-runtime-import-subscriptions-and-subsequent-edit`: clean mounted import applies HP5/item and retains its exact runtime JSON through unrelated character/inventory notifications; retry/load preserves it; a real HP4 edit becomes pending and then saves. |
| **R4** | Wrapper c-a / embedded canonical id c-b mutates the only roster record to c-b while selection remains c-a. | Validate wrapper version/owner/target and both lanes' embedded identities, owners, supported versions and consumed payload structures **before any staging or mutation**. Reuse canonical validation. | `R4-embedded-canonical-identity-rejected-before-mutation`: visible identity refusal, identical selection/roster/drafts. `control-import-validation-all-lanes-before-any-mutation`: eight wrapper/owner/target/runtime-id/version/structure cases refuse with unchanged roster, live resources/items/notes and both candidates, including a valid canonical lane paired with an invalid runtime lane. |
| **R5** | Held A session update rejects after A→B; A-private stat marker is persisted in B's real scoped offline queue. | Capture origin in the production core caller and carry it through session work, dynamic sync import, failure continuation and queueing. The queue uses the established P5 scope/generation fence. A retired continuation returns false; its exact private change stays in the origin-owned session cache, marked pending/memory-retained. Session reads/cache admission are owner-fenced. | `R5-held-session-failure-account-switch`: B queue/raw storage contain no A marker; original session still contains the exact marker and the call returns false. `R5-held-session-failure-generation-switch` proves same-UID retirement also refuses. |
| **R6** | After held A canonical read returns under live B, loader attempts `metadata.lastPlayedAt` on A's character; only then outer sync rejects. | Loader captures generation and live principal and checks before its read, before its metadata write and before returning. Sync passes its source-current predicate into that loader, preserving the existing outer/save fences. | `R6-held-sync-read-account-switch`: after releasing the stale read there are **zero character write attempts**, and the call rejects. `R6-held-sync-read-generation-switch` proves the same for a retired same-UID generation. All attempts record live UID before simulated admission/rejection. Legitimate new-generation P5 publications during handoff are recorded separately while the old read is still held. |

Successful same-owner composition:
`control-same-owner-session-failure-heals-and-sync-confirms` holds/rejects a real
session write, retains one A change, heals through real sync (`synced:1,
failed:0`, empty queue, canonical HP9), then confirms another same-owner session
update. This exercises both the caller and callee.

Unsupported content remains honest:
`control-unsupported-candidate-remains-exact-and-refused` retains unknown
`futureNested:[[1,2],[3]]` and prevents its canonical submission. Original
cyclic/BigInt memory-retention/export refusal tests remain green. The codec does
not remove shape fields, flatten matrices irreversibly or disable guards.

## Changed correction files and user behavior

Paths below are relative to `vtt-react/src`:

- `utils/characterShapeCodec.js` — new bounded shape-row codec.
- `services/firebase/characterPersistenceService.js` — canonical codec and
  side-effecting loader fences; existing validator exported for import reuse.
- `services/firebase/characterStateService.js` — full runtime codec/decoding,
  matching inventory/equipment writer conventions and bulk-read decoding.
- `persistence/characterSaveOutcome.js` — all-lane preflight and no-clobber import
  refusal; owner-scoped retention mechanisms remain in use.
- `hooks/useCharacterPersistence.js` — owning import application, synchronous
  subscription suppression for that application only, exact runtime projection
  after legacy canonical initialization, and realtime shape decoding.
- `components/providers/CharacterPersistenceProvider.jsx` and
  `components/character-sheet/CharacterSaveStatus.jsx` — mounted file input uses
  the owning hook; successful imports clear prior errors; refusals use the
  existing alert.
- `store/characterSlices/coreSlice.js`,
  `services/firebase/characterSessionService.js`,
  `services/firebase/characterSyncService.js` — origin propagation, queue fences
  and nested loader predicate.
- `persistence/__tests__/p6CharacterSave.production.test.jsx` — retain its 23
  production-path cases; strengthen the sync test to assert no attempted writes,
  and make the recovery/import test expect refusal for differing unsaved derived
  recovery work while preserving exact equivalent reimport.

Users can save/recover ordinary inventory. Selecting an old/conflicting or
contradictory file no longer changes their current work. Valid clean canonical,
runtime-only and combined imports remain supported and pending until explicit
confirmed retry. No general reconciliation UI/system was added.

New permanent infrastructure: `verification/p6/freeze-reviewed.cjs`,
`regressions-browser.cjs`, `finalize-evidence.cjs` and their evidence directory.
The original P6 production/browser and P5 witnesses are retained.

## Exact verification commands and results

From `D:/VTT/vtt-react`:

```powershell
node verification/p6/regressions-browser.cjs --red
node verification/p6/regressions-browser.cjs
node verification/p6/character-save-browser.cjs
node verification/p5-01/character-preservation-browser.cjs
```

- Frozen RED: six exact failures reproduced (plus four independent controls).
- Corrected browser: **14/14 GREEN**, including all six and the focused controls.
- Existing P6 browser: all five named witnesses PASS.
- P5 preservation browser: **pending-edit / failed-preservation / marker-failure
  3/3 GREEN**, zero retirement submissions, required preservation holds and exact
  recovery intact. Logs: `evidence/p6-browser.txt`, `evidence/p5-browser.txt`.

Exact affected P5 **16-suite / 99-test** boundary, plus the existing P6 and closure
suites; unchanged selection:

```powershell
$env:CI='true'
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js src/persistence/__tests__/waveB_closureAcceptance.test.js
```

**Exit 0; 18/18 suites, 134/134 tests, no failures/skips; 23.651s.** Log:
`evidence/regressions.txt`. PowerShell 5.1 formats Jest's stderr PASS output as
`NativeCommandError` text in that log; the actual process exit is 0 and the suite
summary passes. UTF-16 redirect originals are preserved as `.txt.raw`; readable
UTF-8 evidence is a mechanical encoding conversion, not an edited result.

```powershell
npx --no-install eslint --no-eslintrc --config .eslintrc.js src/persistence/characterSaveOutcome.js src/hooks/useCharacterPersistence.js src/store/characterHelpers.js src/store/characterStore.js src/store/characterSlices/coreSlice.js src/store/characterSlices/resourceSlice.js src/store/inventoryStore.js src/services/firebase/characterStateService.js src/services/firebase/characterPersistenceService.js src/services/firebase/characterSessionService.js src/services/firebase/characterSyncService.js src/services/firebase/persistenceService.js src/services/offlineService.js src/persistence/privateStorageRegistry.js src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/components/character-sheet/CharacterSaveStatus.jsx src/components/providers/CharacterPersistenceProvider.jsx src/utils/characterShapeCodec.js verification/p6/character-save-browser.cjs verification/p6/regressions-browser.cjs verification/p6/freeze-reviewed.cjs
npx --no-install eslint --no-eslintrc --config .eslintrc.js verification/p6/finalize-evidence.cjs verification/p6/regressions-browser.cjs
git diff --check
```

Targeted lint: **0 errors / 0 warnings**. Diff check: exit 0 (Git's LF→CRLF
notices are not whitespace failures). Mechanical UI detector: `[]`.
Playwright MCP independently exercised the mounted file input/refusal, both
retry buttons and a valid HP5/item runtime import. Accessibility snapshots:
`evidence/mcp-import-refusal.yml`, `evidence/mcp-valid-runtime-import.yml`.
Only the expected injected network failures were logged.

Detached production build, original CRACO configuration with only output/cache
isolation via the retained independent `build.config.cjs`:

```powershell
Test-Path -LiteralPath "D:/AppData/Temp/opencode"
Start-Process -FilePath "cmd.exe" -ArgumentList '/d','/v:on','/c','set NODE_OPTIONS=--max-old-space-size=8192&&set CI=true&&set BUILD_PATH=D:/AppData/Temp/opencode/p6-corrections-build&&npx --no-install craco build --config D:/AppData/Temp/opencode/p6-independent-20261012/build.config.cjs > D:/AppData/Temp/opencode/p6-corrections-build.log 2>&1 & echo !ERRORLEVEL! > D:/AppData/Temp/opencode/p6-corrections-build.exit' -WorkingDirectory "D:/VTT/vtt-react" -PassThru -WindowStyle Hidden
```

**Compiled successfully / exit 0.** External log/exit retained and copied to
`evidence/build.txt` / `evidence/build.exit`. Output stays outside the checkout.
No foreground raw build was run.

Final evidence integrity command:

```powershell
node verification/p6/finalize-evidence.cjs
```

It verifies frozen RED identities, all 14 GREEN results, every final GREEN
production module hash, preserved P5 report/browser and ClassCodex bytes, passing
logs/build, then records final identity and correction-only diffs.

### Verification corrections encountered

The first corrected positive canonical import exposed the old-debounce snapshot
refresh; this was fixed before final GREEN. A same-UID sync control initially
counted a legitimate P5 new-generation publication during handoff as a stale
read write; the witness now records handoff and read-release phases separately,
with zero relevant attempts from release onward. The first 18-suite run found
an overly strict principal requirement on the local queue and the old P6 test's
destructive-import expectation. The queue now reuses the P5 local scope fence;
the P6 test asserts protected refusal. No P5 test expectation was changed.
Those runs are not counted as final success. Only affected checks were repeated
for these concrete failures and final bounded confirmation.

## Simulation limits and remaining items

### Demonstrated source closure

No R1–R6 failure remains demonstrated by these final witnesses. Independent
acceptance is still required. A different unsaved import is intentionally a
visible refusal; its source file and current candidate both survive.

R5's retired session continuation is **refused with private in-memory session
retention**, not represented as cloud saved or reload-durable. The witness
proves the exact source remains and is not put into B's queue. This bounded
choice avoids adding a new offline replay/persistence system.

### Deferred source defect

`characterBackupService.restoreFromBackup` still has the reversed save
signature. Its reviewed source is unchanged. No new mounted P6 production
reachability was established, so it remains deferred.

### Evidence gaps / external boundaries

- Real Chrome, installed React/Zustand, actual production stores/gate/coordinator,
  mounted provider/status/file input, real localStorage/Web Locks and real
  document/module reload execute. Production bodies are Babel-compiled unchanged.
- Auth/config/admission and Firestore transport are simulated. Attempted writes
  record path/value/live UID **before** holding, rejection or backend admission.
  The corrected fixture also rejects raw nested arrays, rather than pretending
  Firestore Standard can store the matrix directly. It does not implement owner
  fencing, outcomes, queue routing or save ordering.
- Fixture cloud records survive reload only in fixture sessionStorage. The R1
  recovery witness explicitly reinstates both transport refusal flags after
  reload before mounting; it does not mistake the fixture for production
  recovery storage.
- No full App/router/provider-shell acceptance, real SDK transport/security
  rules/backend admission or staged second-device durability is claimed.
  Unrelated routing/icons/graphics/audio modules are inert; socket transport is
  unavailable/unused. Jest's backup boundary remains mocked; browser production
  backup creation executes, but backup restoration does not.
- No universal conflict resolution, room reconciliation, schema rewrite or
  generic offline gameplay replay was undertaken.

### Environment gates

P5-05/07/09/10/11/12/13/31/32 remain outstanding. Client simulations do not close
them. P5's independently accepted classification stays **33 / 0 / 9 / 0**.

## Bounded independent re-review

1. Read the retained complete BLOCK report, unchanged roadmap/P6 contract, this
   correction report, source-hash table and final identity. Confirm the actual
   worktree bytes against both reviewed and corrected identities.
2. Re-run `--red` against the frozen snapshot and the corrected browser command.
   Inspect exact payloads, both candidates and real mounted file-input alerts,
   rather than relying on scenario names or arbitrary exceptions.
3. Inspect R5's captured caller→session→queue context and retained origin source;
   inspect R6 attempted-write arrays before backend simulation. A rejection after
   an unsafe submission is a failure. Keep same-UID and same-owner controls.
4. Re-run the unchanged 18-suite selection, original P6 browser, all three P5
   browser controls, targeted lint, diff check and detached build as needed for
   the independently reviewed source identity. Keep simulation gaps and the nine
   environment gates separate from source acceptance.
5. Return an independent disposition for **R1–R6 only**. P6 remains BLOCKED until
   that review accepts it. Stop at P6; do not commit, push, deploy or begin P7.
