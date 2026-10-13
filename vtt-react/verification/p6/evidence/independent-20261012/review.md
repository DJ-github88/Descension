# Independent read-only acceptance — Mythrill Project 6

Date: 2026-10-12. **VERDICT: BLOCK.** Returned to the coordinator; no corrections authorized or performed.

## CURRENT POSITION

- Actual checkout: `D:/VTT`; actual HEAD before/interim/after: `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
- Worktree: 16 modified tracked files and 12 untracked files, including P6 implementation/evidence, prior P5 witnesses/report refinements, and the concurrent `ClassCodex.css` styling edit. Full status is in `before.json` and `after.json`.
- Reviewed implementation is the **uncommitted bytes**, not merely HEAD. SHA256 snapshots cover 2,347 files: all non-ignored frontend source, verification and docs, root operating instructions and relevant package/build/lint configuration. `reviewed-hashes.md` lists focal production, witnesses and supporting paths; `before.json`/`interim.json`/`after.json` contain the full snapshots.
- No source drift was detected. No evidence required rerunning against a changed production state. The supplied final P6 browser manifest, this review's browser manifest and supplemental manifest match the reviewed production hashes. The retained P5 report is byte-identical to its external original.
- Read AGENTS.md, CLAUDE.md and applicable Mind operating instructions, plus the complete roadmap, ENGINEERING_STATE, frozen P6 contract, implementation report and retained P5 acceptance. Mind was an evidence index, not acceptance authority. No existing graph was present; no graph generation or repository artifacts were created.

## CONTRACT ALIGNMENT

The original roadmap remains authoritative: `docs/MYTHRILL_NEXT_PHASE.md:987–1035`, with scope/authority distinctions in §§11–12, saved/offline promises H3/H5, and P5 dependency in §27.

The frozen contract aligns with that roadmap: independently confirmed latest canonical/runtime outcomes; owner/character/generation capture; honest device/memory/pending/failure distinctions; bounded selected retry/download/import; retained exact recovery; no false no-op sync; inventory/bank/body/acquisition compatibility; echo/timer fences. Import and per-document serialization make the original acceptance obligations more explicit. A provider status surface is compatible with the roadmap's permitted small sheet/provider surface; it is mounted by the real PersistenceProvider.

The implementation report's claim that nested arrays are simply unsupported cannot narrow acceptance. **Inventory shape matrices are ordinary authored production data**, including the default 1×1 item. Refusing these makes normal character saving fail, violating the roadmap's inventory compatibility and supported save/retry requirements. Cross-device conflict solving and room reconciliation were not added as requirements. Real staging/second-device verification remains separate, not satisfied by simulations.

## HARNESS VALIDITY

### Actual production composition

1. **Canonical:** `infoSlice`/`resourceSlice` and inventory authoring → `triggerCharacterAutoSave` and synchronous post-set snapshot refresh in `characterHelpers`/`characterStore`/`inventoryStore` → `saveCurrentCharacter`/`coreSlice.updateCharacter` → production P5 scoped roster and required marker → `characterSaveOutcome.saveCharacterDraft` → per-document canonical service tail → real transform/sanitizer logic → external `updateDoc` boundary. The save signature is `(characterData, userId, options)`.
2. **Runtime:** `PersistenceProvider.jsx:375–380` → real mounted CharacterPersistenceProvider → real `useCharacterPersistence` subscriptions, load/recovery and forceSave → real persistenceService size/quota facade → real serialized characterStateService → external `setDoc` boundary. It writes `users/{uid}/characterStates/{id}`, independently of canonical `characters/{id}` and room checkpoints.
3. **Outcome/retention:** real characterSaveOutcome adapter, persistenceStatusStore, explicit `character.saveDraft` registry family, real P5 native/scoped read/write/preservation/gate mechanisms.
4. **Mounted consumers:** production private boundary and CharacterSaveStatus lane labels, both retry buttons, actual browser download and file-import change handler. P5 browser separately mounts production CharacterManagement and PrivateProjectionBoundary.
5. **Reachable sync:** coreSlice.startCharacterSession/recordCharacterChange → characterSessionService.recordChange → dynamic characterSyncService.queueChange on local sessions or rejected session writes. The real sync method uses canonical load/save; its reachable composition includes loadCharacter's metadata write.

### What the witnesses prove and where they stop

- All three browser harness/runner files and P6/P5 unit witness sources were inspected before their results were relied on. Production module bodies are Babel-compiled unchanged. Ownership, generation fencing, payload capture, scoped retention, ordering, retries and outcome logic are production code.
- Browser Firestore fixtures record attempted operation/path/value/live UID **before** delay, rejection or simulated persistence. They do not enforce owner attribution or implement latest-edit ordering. Thus foreign-attribution attempts are observable rather than hidden by a mock entitlement guard.
- Browser runtime/canonical overlap supplements hold the older issued write, start the newer save while it is held, assert only the old payload has reached the boundary, release it and assert ordered exact final payloads. Old token delivery after a later HP edit preserves that exact later pending candidate.
- Unit SDK/config/auth and Web Locks boundaries are controlled. Automatic backup is mocked in the P6 unit suite; the browser runs the production backup path. Some original older-write unit doubles return only a delayed promise rather than materializing the old document, so they prove status fences but cannot alone establish persisted ordering. The overlapping browser supplements supply that missing evidence.
- The original export/import unit witness calls the adapter directly and checks returned JSON; it does **not** mount the import handler or protect newer work. The original P6 browser clicks download but never import. Its inventory edit is currency-only, and the normal fixture inventory is empty. These omissions allowed the reproduced import and ordinary-item defects to coexist with green checks.
- The original runtime echo witness modifies HP while retaining the same token and proves that token's echo is ignored. The supplement also creates a genuine later local edit, delivers the old token and verifies that the later edit remains pending, not saved.
- Real Chrome, installed React/Zustand, production gate/store registration, real browser localStorage/Web Locks, mounted status/actions, and full document/module reload execute. Firebase configuration/provider admission and Firestore transport are simulations. P6's cloud Map survives reload in fixture-only sessionStorage; this is not production recovery storage. Reload resets the injected network-refusal flags, so the supplied reload witness is not proof of a rejected cloud write after reload.
- Routing/CSS imports and unrelated icon/graphics/geometry/audio packages are inert; socket transport is unavailable/unused. Full App/router/provider shell, real Firebase SDK transport/admission/rules/backend durability, deployed operation and a second device are not exercised.
- The external supplement changes **only harness entry exposure and external transport observation/delay**: snapshot callbacks, held reads, and Firebase addDoc's missing DocumentReference.id are exposed. Production source bodies are unchanged. It does not supply any invariant being accepted.

## ACCEPTANCE RESULTS A–I

| Area | Decision | Evidence and qualification |
|---|---|---|
| **A — latest-edit truthfulness** | **PASS for tested canonical/runtime lanes** | P6 older-success/failure tests, existing canonical deferred/queued P5 tests, and supplementary canonical/runtime concurrent writes prove status fencing and actual write order. Canonical `old canonical` → `new canonical`; runtime HP18 → HP11, followed by HP6 remaining pending after old-token delivery. No predecessor confirms/discards a newer normal edit. Import defects are separately E/D. |
| **B — owner/generation/character fencing** | **BLOCK** | Ordinary canonical and mounted runtime fences pass account, same-UID generation and character controls. Reachable session failure nonetheless saves A's private candidate into B's scoped queue (R5); direct delayed sync load attempts A-document metadata under live B (R6). Embedded import identity is also unfenced (R4). |
| **C — canonical vs personal runtime outcomes** | **PASS at simulated write boundary** | Separate mounted lanes, real distinct destinations, independent pending/error/confirmed results, actual localOnly service result stays pending. Device retention uses confirmed P5 scoped writes; memory-only is labeled explicitly. Runtime confirmation is not presented as a saved room checkpoint. Backend deployment/durability remains unproven. |
| **D — failure and exact recovery** | **BLOCK as a complete acceptance claim** | Network, facade quota, device refusal/prior durable bytes, exact private-memory/export source and real reload HP8/latest notes controls pass. However mounted imports silently erase the newer or imported recovery candidate (R2/R3). Ordinary inventory also cannot complete a healed save (R1). These prevent accepting the full recovery promise. |
| **E — selected export/import** | **BLOCK** | Actual selected download proves c-a, latest marginalia, runtime HP14 and canonical currency23; unit wrapper owner/selected-character/version rejection passes. Mounted import silently replaces newer failed work, loses runtime content and accepts a contradictory embedded ID (R2–R4). Adapter-only fidelity is not mounted import acceptance. |
| **F — runtime serialization/token echo** | **PASS for covered path** | Real tail blocks HP11 submission until held HP18 finishes; final stored state is HP11. A later HP6 edit remains exact/pending after the old token. Canonical overlap is likewise ordered. Mounted cyclic export refusal demonstrates memory candidate retention and a visible download failure. No real second-device claim. |
| **G — reachable sync correction** | **BLOCK** | Correct canonical signature/owner argument and pending-local reconciliation refusal are present. Offline no-op queue/cache stays pending with content retained; reconciliation returns synced0/failed1 and preserves the candidate. But the production caller fails to capture origin across rejection (R5), and the callee's owner check is after a nested side-effecting load (R6). These are reachable P6 composition gaps. |
| **H — sanitizer refusal** | **BLOCK** | Unsupported nested-array and cyclic/BigInt refusal retains the original and prevents lossy cloud writes; mounted Download correctly reports failure for the cyclic memory candidate. The new refusal also rejects the default ordinary item matrix `[[true]]` in both lanes (R1). This cannot be deferred as unsupported unknown authored data. |
| **I — P5 guarantees** | **PASS for retained affected regression boundary** | Exact prior 16-suite selection is included unchanged in the 18-suite run; 3/3 original browser controls remain green: zero retirement submissions, one successful pending-edit roster write, roster/marker refusal holds, exact recovery, projection/privacy and mounted eligibility/journal regressions. No accepted F1/F2 or other P5 control failed. R5/R6 are newly demonstrated P6 reachable-composition gaps; the unchanged baseline P5 classification is not rewritten or generalized into a new full audit. |

## REPRODUCED SOURCE FAILURES RETURNED TO COORDINATOR

All paths below are relative to `D:/VTT/vtt-react/src`. Reproduction script: `D:/AppData/Temp/opencode/p6-independent-20261012/supplemental.cjs`; exact values/attempt attribution are in `supplemental-results.json` and `.log`. Exit0 means its evidence assertions completed and defects reproduced, **not P6 PASS**.

### R1 — Both lanes refuse an ordinary inventory item

**Sequence:** sign in A through production authStore/coordinator; select c-a; mount real provider; call production inventoryStore.addItem with `{id:'ordinary-blade', name:'Ordinary blade', type:'weapon', quality:'common', width:1, height:1}`; author notes `ordinary inventory authored`; run the real canonical save and runtime save path.

**Expected:** normal authored inventory remains round-trippable and both latest lanes can be confirmed after accepted persistence, without losing the item shape.

**Observed:** addItem succeeds and produces `shape.cells:[[true]]`, position `{row:0,col:0}`. Canonical becomes error (`Character storage would change preserved data`); runtime returns success:false (`Runtime storage would change preserved data`); both visible lanes fail with a retained device draft. No marker-bearing item payload reaches the cloud write boundary. The source remains exportable, but retrying unchanged ordinary content cannot heal it.

**Source:** inventoryStore.js:517–523; utils/itemShapeUtils.js:19–47; utils/firebaseUtils.js:36–68; characterPersistenceService.js:545–550; characterStateService.js:106–110. The new guards are in the P6 diff; the produced matrix is standard production data, not a fabricated unknown nested field. Shipped custom weapons also contain such matrices (`data/items/weapons/index.js:135–144`).

### R2 — Older import silently replaces newer unsaved work

**Sequence:** export selected c-a with notes `older exported draft` and HP19; author `newer work to preserve` and HP7; reject canonical/runtime writes; allow the real failed 2,000ms autosaves to complete (2,400ms wait); import the old JSON through the mounted file input.

**Expected:** retain the newer candidate or refuse/offer explicit reconciliation; choosing a file alone must not silently destroy newer work.

**Observed:** notes become `older exported draft`, HP becomes19; both currently retained/exported candidates contain the old values. No alert or reconciliation choice is shown. Status becomes pending, not falsely saved, but the newer recovery source is replaced.

**Source:** characterSaveOutcome.js:185–195 unconditionally stages imported lanes; CharacterSaveStatus.jsx:68–71 merges and reloads them. No revision/conflict check or retained alternate is provided. An immediate-import exploratory probe was accidentally rescued by the still-pending canonical snapshot refresh; the final reproduction explicitly waits for the real failed autosave to finish, and asserts the exact overwrite.

### R3 — Runtime-only import is silently discarded by mounted subscriptions

**Sequence:** selected c-a currently has HP21; import a valid matching version/owner/character document with canonical:null, runtime HP5 and an `imported-blade` inventory record using the actual mounted input.

**Expected:** preserve the intended imported runtime candidate and restore/retry that exact HP5/item, or visibly refuse without destroying it.

**Observed:** live HP remains21 and inventory remains empty. More importantly, the retained runtime draft itself becomes HP21/items[] again; the imported HP5/item is no longer the recovery candidate. No alert.

**Source:** CharacterSaveStatus.jsx:68–71 stages then mutates/reloads the character store; useCharacterPersistence.js:119–127 synchronous changed callback immediately re-stages the current live runtime state. The import handler never applies the runtime candidate through the hook's guarded remote/recovery application path.

### R4 — Wrapper character validation does not validate embedded canonical identity

**Sequence:** export c-a; keep wrapper version/owner/characterId=`c-a`, but set canonical.id=`c-b`; import through the mounted input.

**Expected:** reject the contradictory character identity before changing the selected roster/draft.

**Observed:** the only roster record becomes id c-b while currentCharacterId remains c-a; no alert. The selected character is no longer resolvable in its roster. This is a demonstrated local mutation gap, not a claim that a real rules backend permits a foreign cloud overwrite.

**Source:** characterSaveOutcome.js:188–193 checks wrapper identity only; CharacterSaveStatus.jsx:69–70 spreads imported payload over the existing character, including id. Existing canonical validation checks basic stats/resources later, not this identity before import mutation.

### R5 — Delayed session failure stores A's private change in B's queue

**Sequence:** start c-a's real character session as A; hold the external session update while calling real coreSlice.recordCharacterChange with stat_change `{stat:'privateMemo',value:'A PRIVATE DELAYED CHANGE'}`; switch through production authStore/coordinator to B; reject the old held session write; await the original call.

**Expected:** completion remains bound to A's origin generation/character; preserve under A or refuse, never save the content in B's private namespace.

**Observed:** B is active and `mythrill:p5:user:u-b:character.offlineChanges` contains c-a plus the exact A-private marker. The real B-scoped reader returns that entry. No mock owner gate creates or filters it.

**Source:** coreSlice.js:1550–1553 → characterSessionService.js:127–169, particularly awaited update then dynamic getSyncService and queueChange at154–156 → characterSyncService.js:131–149 resolves the current owner's queue. The caller never carries a captured origin through this continuation. This path is production reachable and cannot be deferred with backup restore. These functions were already present at HEAD; no unsupported temporal regression claim is made.

### R6 — Delayed sync read issues a foreign metadata write before its fence

**Sequence:** confirm c-a under A; start real syncCharacterChanges using A's captured context; hold getDoc(`characters/c-a`); switch A→B through production handoff; release the read returning A's document.

**Expected:** no write to A's character is submitted using B's live principal; stale read continuation is refused before every side effect.

**Observed:** Firestore boundary records updateDoc(`characters/c-a`, `{'metadata.lastPlayedAt':...}`) with live UID u-b. Only afterward sync rejects `Owner changed or newer character edit during sync`. Backend rules may reject the attempt; that would not establish the required client-origin fencing.

**Source:** characterSyncService.js:249–250 checks sourceCurrent only after awaiting canonical load; characterPersistenceService.js:344–361 performs the metadata update inside loadCharacter before returning. The existing P6 unit owner-switch test asserts the outer rejection but does not inspect this attempted write.

## REGRESSIONS — EXACT COMMANDS AND OUTCOMES

From `D:/VTT/vtt-react`:

```powershell
node verification/p6/character-save-browser.cjs
node verification/p5-01/character-preservation-browser.cjs
```

Both exit0: P6 five named witnesses PASS; P5 pending-edit/failed-preservation/marker-failure **3/3 GREEN**. Full fresh logs are `p6-browser.log` and `p5-browser.log`.

```powershell
$env:CI='true'
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js src/persistence/__tests__/waveB_closureAcceptance.test.js
```

**Exit0; 18/18 suites, 134/134 tests, no skips/failures; 18.263s.** This preserves the exact prior 16-suite /99-test boundary and adds P6/closure, without general test expansion. Log: `regressions.log`.

```powershell
npx --no-install eslint --no-eslintrc --config .eslintrc.js src/persistence/characterSaveOutcome.js src/hooks/useCharacterPersistence.js src/store/characterHelpers.js src/store/characterStore.js src/store/characterSlices/coreSlice.js src/store/characterSlices/resourceSlice.js src/store/inventoryStore.js src/services/firebase/characterStateService.js src/services/firebase/characterPersistenceService.js src/services/firebase/characterSyncService.js src/services/firebase/persistenceService.js src/services/offlineService.js src/persistence/privateStorageRegistry.js src/persistence/__tests__/p6CharacterSave.production.test.jsx src/persistence/__tests__/characterHandoffPreservation.test.js src/components/character-sheet/CharacterSaveStatus.jsx src/components/providers/CharacterPersistenceProvider.jsx verification/p6/character-save-browser.cjs
```

**Exit0, 0 errors/warnings**, fresh against reviewed source. `git diff --check` from D:/VTT also exit0 (Git emitted existing LF→CRLF notices, not whitespace failures). No eslint cache option was used. This is targeted lint, not whole-repository lint.

Reported build evidence `p6-handoff-build.log`/`.exit` genuinely says Compiled successfully/0. The final supplied browser source manifest matches the reviewed graph. To independently verify compilation without altering repository outputs/caches, a fresh production build used original craco.config.js through external `build.config.cjs`, changing only cache/output handling: Webpack cache off, Babel loader disk cache off, BUILD_PATH outside the repo.

```powershell
Test-Path -LiteralPath "D:/AppData/Temp/opencode/p6-independent-20261012"
Start-Process -FilePath "cmd.exe" -ArgumentList '/d','/v:on','/c','set NODE_OPTIONS=--max-old-space-size=8192&&set CI=true&&set BUILD_PATH=D:/AppData/Temp/opencode/p6-independent-20261012/build&&npx --no-install craco build --config D:/AppData/Temp/opencode/p6-independent-20261012/build.config.cjs > D:/AppData/Temp/opencode/p6-independent-20261012/build-retry.log 2>&1 & echo !ERRORLEVEL! > D:/AppData/Temp/opencode/p6-independent-20261012/build-retry.exit' -WorkingDirectory "D:/VTT/vtt-react" -PassThru -WindowStyle Hidden
```

Polled with brief 5s intervals. **Compiled successfully / exit0**; focal generated main/stores/services and CSS chunk filenames match the reported build. The first isolated launch was interrupted with exit1073807364 and no source compiler diagnostic; it is retained as `build.log`/`.exit` and not counted as success. The separately executed retry supplies the fresh successful check. No foreground raw build was run.

```powershell
node D:/AppData/Temp/opencode/p6-independent-20261012/supplemental.cjs
```

Final supplemental execution: **exit0, ten scenarios: six exact failures reproduced; four positive controls** (runtime ordering/later token, canonical ordering, mounted cyclic export refusal, retained reconciliation/no completed sync). Reconciliation's observation is explicitly synced0/failed1, not cloud completion. Early exploratory harness timing and missing simulated DocumentReference.id were corrected at the external fixture boundary; final evidence asserts specific failures, never labels an arbitrary scenario exception as acceptance proof.

## REMAINING ITEMS

### Source defects

R1–R6 above require coordinator disposition and bounded correction/review. No fixes were implemented. Green suites and build do not close these demonstrated failures.

### Missing or limited evidence

- No full App/router/shell integration acceptance; reachability is traced in source and the actual provider/control subtree is mounted.
- No real SDK transport/rules/admission or staged durability/second-device exercise. Simulated acknowledgements do not close these gaps.
- Original witnesses do not independently establish mounted import fidelity, ordinary item save compatibility, or complete reachable-session owner fencing; the supplements establish failures in those exact missing areas.
- No broad persistence audit, schema rewrite, offline combat replay or cross-device conflict solver was undertaken or required.

### Environment gates

The nine P5 gates remain **P5-05/07/09/10/11/12/13/31/32**. None is closed by simulated Firebase. The accepted baseline remains **33 accepted /0 source BLOCK /9 environment-blocked /0 inconclusive** within its prior reviewed scope. P6's current uncommitted state has its own **BLOCK** verdict.

### Deferred work

Source search finds characterBackupService.restoreFromBackup only in its service definition and test caller; no mounted production caller. Its reversed `saveCharacter(characterId, restoredCharacter)` remains deferred (`characterBackupService.js:307`) because the demonstrated P6 controls/sync/recovery do not call it. The similarly named characterMigrationService local restore is a different function. Automatic backup creation does not invoke backup restoration.

Cross-device conflict solving, room reconciliation/checkpoint authority, P7–P14 and deployment remain outside this review.

## VERDICT AND INTEGRITY

**BLOCK — P6 acceptance is not demonstrated.** Normal save ordering/status/retention and retained P5 controls have meaningful passing evidence, but ordinary inventory compatibility, mounted import and reachable owner-fencing failures violate P6's original acceptance boundary.

No repository files were changed by this review. HEAD, full status and all 2,347 recorded hashes match before/interim/after, including ClassCodex.css and every original verification file. All authored review scripts, reports, logs, hashes and build outputs are under `D:/AppData/Temp/opencode/p6-independent-20261012`. No commit, push, deployment, correction or P7 work occurred. Stop after this review.
