# P6 — implementation evidence and bounded Sol handoff

> Historical pre-correction implementation evidence. The independent review
> returned **BLOCK** for R1–R6; its complete report is retained in
> [MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md](MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md).
> Current bounded corrections and re-review handoff:
> [MYTHRILL_P6_R1_R6_CORRECTIONS_20261012.md](MYTHRILL_P6_R1_R6_CORRECTIONS_20261012.md).
> P6 remains unaccepted. Original evidence follows unchanged.

Date: 2026-10-12. **P6 implemented, awaiting independent acceptance.**
This is implementation evidence, not self-acceptance or deployment readiness.
Authority and pre-code freeze: [MYTHRILL_PROJECT_6_CONTRACT.md](MYTHRILL_PROJECT_6_CONTRACT.md).

## 1. Current position

Actual checkout: `D:/VTT`. HEAD remained
`620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`. All P6 changes are uncommitted.
Starting P5 test refinements, replay document and both P5 browser files were
preserved. A concurrent `vtt-react/src/components/rules/ClassCodex.css` edit
appeared during execution and was left untouched. AGENTS.md and CLAUDE.md were
read; CLAUDE.md's `D:/Mythrill/Descension` path is historical, not this checkout.
No newer P6 implementation/report was found. Mind was used as an evidence index.

No commit, push, deployment, P7–P14 implementation or gameplay/Prism/ROAD change.

## 2. P5 evidence preserved before P6 source edits

- Exact complete independent report copied into the existing `docs/` evidence
  location: `docs/MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md`.
- Compared with `D:/AppData/Temp/opencode/p5-01-independent-acceptance-20261012.md`
  using `git diff --no-index -- <original> <retained>`: exit 0, no content diff.
  The reviewed HEAD, hashes, commands and simulation limits are intact.
- `docs/ENGINEERING_STATE.md` is the concise current ledger.
- `docs/MYTHRILL_PROJECT_5_WAVE_C_VERIFICATION.md` has a superseded-status banner;
  historical evidence remains below it without broad rewriting.
- Existing P5 replay, mounted reconnection report and two verification runners
  remain present. P6 uses its own separate browser runner.

Canonical P5: **33 independently accepted / 0 source BLOCK / 9
environment-blocked / 0 inconclusive**; **P5-01 PASS**, F1/F2 independently closed.
Journal, privacy, socket and other accepted cases carry forward. Outstanding:
**P5-05/07/09/10/11/12/13/31/32**. Later P6 source is not covered by the P5 PASS.

## 3. Frozen contract and production composition

The original roadmap §26 P6 is the boundary: per-owner/per-character canonical
and personal runtime statuses; confirmed latest writes only; retained device
draft vs memory-only; visible pending/saving/failure; bounded selected retry,
recovery and download; no offline no-op synchronization claims.

Canonical path:
`infoSlice` / `resourceSlice` / inventory → `triggerCharacterAutoSave` → captured
character payload → `saveCurrentCharacter` / `updateCharacter` → P5 roster and
required marker → serialized `characterPersistenceService.saveCharacter(data,
userId, {isCurrent})` → actual `updateDoc` outcome.

Runtime path:
mounted `PersistenceProvider` → **real `CharacterPersistenceProvider`** →
**real `useCharacterPersistence`** subscriptions/forceSave → **real
`persistenceService`** size/quota facade → **real `characterStateService`** →
actual `setDoc` outcome. Hook load/realtime continuations update the actual
character/inventory/condition/quest stores with owner and selection fences.

The small UI surface is mounted once by the existing character provider, inside
the real private projection boundary, for the active owned character. It shows
**Canonical character** and **Personal runtime** independently, with retry,
selected JSON download/import and accessible status/error announcements.
It is a provider surface; no sheet/account-page rewrite was needed.

Device retention means a confirmed P5 scoped write, not SDK cache or memory.
Cloud saved means that lane's latest edit received its actual backend-write
confirmation. Personal runtime is `users/{uid}/characterStates/{id}`; it is
neither canonical `characters/{id}` nor an accepted room/session checkpoint.
Latest identity is a captured payload plus monotonic candidate revision under
owner/account-generation/character/lane. Older outcomes cannot clear it.

## 4. Implementation

- **`persistence/characterSaveOutcome.js`**: character-specific result/draft
  adapter over existing P5 scoped primitives and persistenceStatusStore. One
  latest private candidate per owner/character/lane; immutable capture; fenced
  completion; actual device-write accounting; in-flight retry coalescing;
  owner-bound recovery and versioned selected-character export/import. Quota and
  serialization refusal retain the exact private source. Non-exportable data
  reports an export failure and stays in memory instead of becoming a partial
  recovery document. SDK timestamp metadata retains seconds/nanoseconds; known
  previously confirmed work is not replayed over newer cloud after a generation.
- **Registry**: one explicit retained `character.saveDraft` family, with
  character/lane locators; no global private-key inference or cleanup exemption.
- **`characterHelpers`, `characterStore`, `inventoryStore`, core/resource slices**:
  capture at authoring time, including synchronous post-Zustand-update refresh
  where existing slices schedule inside an updater. Debounces bind the edited
  character and owner rather than reading a changed selection later. Resource
  and inventory 100ms live-selection save races use the same bound path.
  Canonical callback observes the actual asynchronous result. P5 roster/marker,
  publication tails, completion fencing and failed-handoff hold remain intact.
- **`useCharacterPersistence`**: scoped runtime payload capture; synchronous
  store subscriptions; latest-edit completion; owner/generation/character load
  fences; dirty recovery before stale hydration; exact inventory hydration;
  reconnect retry and retained write-token echo suppression. The old hook's
  selected responsibilities were replaced in-place rather than introducing a
  second runtime hook or a persistence framework.
- **Runtime facade/service**: optional current-source predicate across quota
  awaits and per-document serialized writes. `localOnly` does not confirm cloud.
  Existing callers remain valid. Actual equipment slot maps, containers and
  runtime fields survive instead of being narrowed to legacy weapon/armor slots.
- **Canonical transform**: retained additional authored fields (including class
  banks) in an additive `preservedFields` projection; preserve nested equipment,
  inventory/lore fields and opaque source extensions. Bind current health/mana/AP
  into existing nested resources. No flat canonical upload or bulk migration.
  Both save lanes refuse a legacy sanitizer's lossy rewrite rather than certify
  changed unknown/nested data as saved; the exact draft remains downloadable.
- **Offline service**: character no-op work remains queued/pending; historical
  unproven `synced` cache metadata becomes pending/manual reconciliation without
  removing content. No revival of flat character writes or offline combat replay.
- **Reachable session-linked sync service**: load/save receive the captured
  owner and correct `(characterData, userId)` signature; actual false saves are
  failures. A retained newer canonical draft makes legacy queue work explicitly
  reconciliation-required instead of overwriting that draft.
- **`CharacterSaveStatus.jsx` / CSS / provider**: visible separate lane labels,
  bounded retries, selected download and owner/character-validated import; no
  anonymous global Saved badge or new backup/account-export UI.

## 5. Permanent witnesses and final verification

`vtt-react/src/persistence/__tests__/p6CharacterSave.production.test.jsx`:
**23 tests**, real canonical store/service, scoped writers, real gate and auth
store, mounted runtime provider/hook/status, real runtime facade/service and
reachable sync service. Controlled boundaries: Firebase SDK/config/principal,
Web Locks availability, browser storage refusals and automatic backup network
dependency (backup itself remains exercised by the P5 browser).

Witnesses include current canonical success; newer work during older success
and failure in both lanes; offline/network/healed retry; local storage refusal
with unchanged prior durable bytes and exact memory/export candidate;
serialization failure; real facade quota refusal; same-UID generation, account
and character switches; delayed read after a newer edit; selected export/import
fidelity and wrong-owner/character rejection; inventory/equipment/banks/unknown
fields; SDK timestamp capture; duplicate retry coalescing; token echo no-loop;
legacy synced-cache reclassification; reachable sync attribution and pending
draft reconciliation; lossy-sanitizer refusal.

Final command, from `D:/VTT/vtt-react`:

```powershell
$env:CI='true'
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js src/persistence/__tests__/waveB_closureAcceptance.test.js
```

**18 suites / 134 tests passed**, 23.704s, no failures/skips. This includes the
exact 16-suite affected independent P5 selection plus P6 and sync closure.
The pre-existing P5 character test refinements are preserved; P6 adds only its
adapter reset to that suite so independent scenarios do not share new memory.

```powershell
node verification/p6/character-save-browser.cjs
node verification/p5-01/character-preservation-browser.cjs
npx --no-install eslint --no-eslintrc --config .eslintrc.js src/persistence/characterSaveOutcome.js src/hooks/useCharacterPersistence.js src/store/characterHelpers.js src/store/characterStore.js src/store/characterSlices/coreSlice.js src/store/characterSlices/resourceSlice.js src/store/inventoryStore.js src/services/firebase/characterStateService.js src/services/firebase/characterPersistenceService.js src/services/firebase/characterSyncService.js src/services/firebase/persistenceService.js src/services/offlineService.js src/persistence/privateStorageRegistry.js src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/components/character-sheet/CharacterSaveStatus.jsx src/components/providers/CharacterPersistenceProvider.jsx verification/p6/character-save-browser.cjs
```

- P6 browser **PASS**: five explicit witnesses — mounted failure/retry, actual
  selected download, lane separation, newer runtime during old ACK, real reload
  recovery of HP 8 plus latest marginalia. Source is Babel-compiled unchanged.
  Final full JSON/source SHA256 manifest: `D:/AppData/Temp/opencode/p6-handoff-browser.log`.
- P5 browser **3/3 GREEN**: pending-edit, failed-preservation, required-marker
  refusal. Zero retirement cloud submissions; exactly one successful pending-edit
  roster save; failed storage/marker still blocks handoff and heals. Final JSON:
  `D:/AppData/Temp/opencode/p6-handoff-p5-browser.log`.
- Targeted lint **0 errors / 0 warnings**. `git diff --check` clean.
- Impeccable mechanical detector: `[]`. Playwright MCP accessibility snapshots
  show real separate failures, then confirmed lane statuses after clicking each
  retry. 390px viewport: scrollWidth 390, status width 374. Expected injected
  network errors were logged; no page runtime exceptions. MCP used the earlier
  compiled UI snapshot harness; final runner includes UTF-8 metadata and the
  final source manifest. UI code remained identical through final source checks.

Final production build is detached per AGENTS.md, from `vtt-react`:

```powershell
Test-Path -LiteralPath "D:/AppData/Temp/opencode"
Start-Process -FilePath "cmd.exe" -ArgumentList '/d','/v:on','/c','set NODE_OPTIONS=--max-old-space-size=8192&&set CI=true&&npx --no-install craco build > D:/AppData/Temp/opencode/p6-handoff-build.log 2>&1 & echo !ERRORLEVEL! > D:/AppData/Temp/opencode/p6-handoff-build.exit' -WorkingDirectory "D:/VTT/vtt-react" -PassThru -WindowStyle Hidden
```

Final handoff build after the last source guards: **Compiled successfully / exit
0**, `D:/AppData/Temp/opencode/p6-handoff-build.log` and `.exit`. Earlier P6 builds
also compiled successfully and are superseded by this final build. No foreground
raw compilation or server deployment.

Focal final P6 raw SHA256s (paths relative to `vtt-react/src`; complete manifest
in the separate final P6 browser log):

```text
persistence/characterSaveOutcome.js e6a31915a1aaea4520fc95fe92f52e21ebbc6b97257041a9dda5535fe509d80f
services/firebase/characterPersistenceService.js bb7e18c7d11746db0fca7bf1053efc7bf1556b78375f21cc91e04be3b16921be
services/firebase/characterStateService.js af863e08ffef83448f2d00a709b9812977b6e821ac4aadc4d412e73a0b559a3d
services/firebase/characterSyncService.js d83a7cdc52f3789ddaab6db619bc18fa10926437d15a4a825a0f9fd5b1ccb07f
services/offlineService.js 1309d31061accde8020f535ec7b388d1245167fd9b5d9fc8ba559f41e3283c09
store/characterStore.js 3b7f31857c80879b359c000307ca290835d33ff7fe1a2722f4b73a44cbe5b3ec
```

### Simulation limits and errors encountered

Browser: real Chrome, installed React/Zustand, all production registered handoff
participants, actual localStorage/Web Locks, mounted character provider/status,
real download and complete document/module reload. Firebase admission/config and
Firestore transport are simulated; backend fixture records survive reload in
fixture-only sessionStorage. Routing and unrelated graphics/icons are inert;
socket transport is unavailable/unused. App/router/full provider shell and real
second-device Firebase synchronization were not exercised. Jest uses narrow
SDK/auth/locks boundaries, not substituted outcome/store logic.

Initial fixture class was invalid for canonical validation and initial test
resource calls supplied the wrong argument shape; corrected to valid production
inputs. A browser reload initially erased its in-page simulated cloud Map; the
external fixture was corrected to retain backend records, not production save
code. One interrupted browser invocation, harness lint setup warnings and the
first copied-report hash typo were corrected; they are not counted as success or
production defect evidence. P5 recovery regressions also caught early adapter
integration errors before final correction; the final full selection is GREEN.

## 6. Remaining issues and bounded acceptance

- **Covered P6 source:** no demonstrated remaining failure in these witnesses.
  Independent acceptance remains required.
- **Deferred source observation:** `characterBackupService.restoreFromBackup`
  still calls `saveCharacter(characterId, restoredCharacter)`. No mounted
  production caller was found; the backup-restore UI/service work is deferred,
  not silently expanded into P6. Actual canonical signature is
  `(characterData, userId, options)`; session-linked sync was reachable and fixed.
- **Unsupported data:** shapes the legacy cloud sanitizer would change (for
  example unknown nested arrays) are retained and visibly refused, not rewritten
  to make a save pass. A lossless cloud codec for those shapes is separate work.
  Non-JSON/cyclic candidates are memory-only and export-refused honestly.
- **Environment/incomplete evidence:** no isolated staged auth/Firestore/rules
  backend or real second-device synchronization run; no production data used.
  P5-05/07/09/10/11/12/13/31/32 remain outstanding. Source PASS is not deployment
  readiness. Cross-tab/cross-device conflict solving and room reconciliation are
  outside P6, as are P7–P14 and whole-account export.

**Sol handoff:** independently run the exact commands above; inspect the actual
latest payloads, outcome/retention labels, live owner and account generations,
canonical/runtime write destinations, both lanes' pending-old-result races,
reload/export fidelity, quota/source refusal, echo suppression and reachable
sync refusal. Keep the 16 accepted P5 suites and three P5 browser controls as
the bounded regression selection. Review the final P6 source hashes against the
new runner manifest, not against the P5 acceptance hash list. Do not close the
nine environment gates or self-promote the verdict to deployed/accepted.

**Verdict: P6 implemented, awaiting independent acceptance.** Stop at P6.
