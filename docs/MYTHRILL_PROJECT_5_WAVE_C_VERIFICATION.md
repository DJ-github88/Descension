# MYTHRILL P5 — WAVE C IMPLEMENTATION AND VERIFICATION

Date: 2026-10-09, updated 2026-10-10 (S9 closure run, S10 final five-case evidence closure, and the post-independent-review bounded journal lifecycle correction for P5-02/P5-03/P5-04). Scope: S8 conversion/reconciliation, S9/S10 final verification, and the bounded journal lifecycle correction.

**S8 client implementation is present and its focused regressions pass. The 2026-10-10 S9 closure run executed the 15 outstanding matrix cases; independent review subsequently accepted the P5-19 queued-edit correction (PASS) but held five of those S9C claims (P5-01, P5-20, P5-21, P5-36, P5-38) as NOT YET VERIFIED because those browser scenarios read/wrote scoped storage engines — or assigned an upload source / supplied a socket manually — instead of exercising the production working stores, hydration schedulers, journal continuation, projection entry/exit and socket handlers. The S10 run below re-verified exactly those five cases against the real production components and they are PASS; one genuine source defect was reproduced and fixed (journal owner fence). P5-32 is BLOCKED by the missing isolated durable P3 backend; the eight emulator-blocked cases are unchanged. No commit, push or deployment occurred.**

**2026-10-10 bounded journal lifecycle correction (post-independent-review):** the follow-up independent bounded review (read-only, `D:/AppData/Temp/opencode/s10-independent-focused.cjs/.log`) corrected the S10 matrix: P5-01 and P5-38 were downgraded to NOT YET VERIFIED (their harnesses did not mount the production room packet handlers or the pre-activation private UI interval), and P5-02, P5-03 and P5-04 were reopened as three reproduced production-path journal failures. All three were corrected in `vtt-react/src/hooks/useJournalPersistence.js` with focused RED→GREEN regressions and real-Chrome production-path re-verification (see “BOUNDED JOURNAL LIFECYCLE CORRECTION — 2026-10-10” below). The corrected cases await bounded independent acceptance; P5-01 and P5-38 remain NOT YET VERIFIED; the nine environment-blocked cases are unchanged. No commit, push or deployment occurred.

## S8 CONVERSION STATE MACHINE

`LOCAL SOURCE → PRESERVED → REQUESTED → AWAITING_CONFIRMATION → CONFIRMED`

- The scoped transfer records owner/account generation, source room, source draft/revision and destination.
- The local source and transfer remain recoverable before confirmation. Lobby navigation does not consume them.
- Retries reuse the recorded persistent destination. A different destination is refused.
- Request emission, `room_created` acknowledgment and `room_joined` admission are separate steps. Admission requests the existing P3 server checkpoint with `save_room_state_request`; no browser snapshot is sent by this save request.
- The confirmation flow accepts only `room_state_saved` for the captured destination and echoed `reason: 'local_room_conversion'`, after admission/request, with `cloudSaved === true` and a positive safe-integer `confirmedRevision`.
- Failure/timeout retains pending state and an error. Old account-generation continuations are rejected.
- A confirmed transfer is retained if local source-completion persistence fails. The production callback awaits local registry persistence before retiring the transfer. LocalRoomIndicator can finish a retained confirmed receipt without creating another remote room.
- Source rooms are marked converted, not deleted. Their authored content remains available.

## P3 CHECKPOINT CONFIRMATION EVIDENCE

The existing `server/handlers/syncHandlers.js` explicit-save handler calls the P3 writer's `saveNow` and emits success only for its confirmed outcome. Its payload contains destination room ID, `cloudSaved` and `confirmedRevision`. The client uses that boundary; neither metadata creation nor admission is substituted for it.

Existing P3/P4 server fixtures validate import into uninitialized rooms, initialized-room nonreplacement, checkpoint authority/revision and confirmed-save signaling. The new client tests validate consumption of those signals. Browser tests simulate the socket boundary; no run yet proves a browser-to-real-P3 conversion round trip. P5-32 therefore remains without its complete frozen method and is classified **BLOCKED BY ENVIRONMENT** (no isolated durable backend; see the S9 section).

## SOURCE / TRANSFER RECOVERY

Failure, timeout, cancellation and handoff retain the transfer/source. Source retirement failure retains a CONFIRMED receipt. Wrong-room and unproven acknowledgments do not confirm. Real-browser reload checks proved transfer retention and successful-conversion source marking using isolated browser storage and simulated socket confirmation.

## S8 CONFLICT UI AND RESOLUTION

`CampaignConflictResolver.jsx` is mounted in the account CampaignManager and uses the existing Mythrill conflict-modal styles.

- Identifies the local candidate, pending changes, cloud baseline and preserved local draft.
- Offers continue with cloud/current newer-tab version, keep the local alternative as a separate scoped draft, explicit local publication through campaign CAS, and cancel/resolve later.
- Cancel defers the prompt without deleting either candidate; identity survives reload.
- Ordinary autosave is blocked while reconciliation is pending. Publication requires the explicit resolution path.
- Expected epoch/revision is retained; CAS refusal keeps candidates. Failed cloud reads cannot resolve the conflict as absence.
- New edits invalidate stale decisions; account-generation changes invalidate async continuations and dismiss the old owner's UI.
- Newer dirty work is not cleared by an older acknowledgment. No automatic merge or P6 character conflict UX was added.

## LOCAL/CLOUD NO-CLOBBER REGRESSIONS

Focused suites: 16 conversion tests and 13 campaign reconciliation tests. They cover confirmed/failing/timeout conversion, generation changes, wrong destination/save reason, retries, restart, no browser checkpoint snapshot writes, divergent local/cloud work, stale-tab writes, preservation failure, CAS refusal, conflict restart, account handoff, edit-during-resolution, cancellation and captured-revision confirmation.

## S9 CANONICAL 42-CASE MATRIX

Canonical source: the **ACCEPTANCE TEST MATRIX** in the original PROJECT 5 ARCHITECTURE FREEZE REVIEW, recovered from its retained session/tool output. IDs, scenarios and assertions below reproduce that list. It was not replaced with a new 42-case specification.

**Result policy:** a passing unit double is partial evidence when the frozen method also requires an emulator or a browser workflow. NOT YET VERIFIED means the complete stated scenario was not executed; BLOCKED BY ENVIRONMENT identifies the emulator gate. PASS is bounded to the evidence shown, never a deployment claim.

Evidence abbreviations:

- **WA**: executed `waveA_handoff`, `waveA_guestAndSocket`, `waveA_localCoordination`, `waveA_protectedStorage`, `waveA_blockerCorrections`, `waveA_rCorrections` client suites.
- **WB**: executed Wave B scoped-consumer/store, continuation, core/closure, B1–B11 and R1–R4 correction suites.
- **CAS**: executed `waveB_campaignCloudCas`, `waveB_campaignCloudHydration`, `waveB_campaignService`, `waveB_firestoreRulesContract` suites; these are not emulator tests.
- **S8A/S8B**: new `waveC_s8ConversionDurability` / `waveC_s8ConflictResolution` suites.
- **BR**: eight Playwright browser-native scenarios in `D:/AppData/Temp/opencode/wavec-browser-verify.cjs`; real Chrome/localStorage/Web Locks/tabs/reloads, simulated Firebase/socket boundaries.
- **S9C**: fourteen Playwright browser-native scenarios in `D:/AppData/Temp/opencode/wavec-s9-browser-verify.cjs` (extended harness `wavec-s9-browser-server.cjs`; log `wavec-s9-browser.log`); real Chrome contexts, real localStorage/IndexedDB, real Web Locks (including a no-Web-Locks context), real tabs, real reloads, real quota exhaustion; simulated Firebase auth/firestore and socket payload transport where stated per case.
- **S10**: five Playwright browser-native production-path scenarios in `D:/AppData/Temp/opencode/wavec-s10-verify.cjs` (server `wavec-s10-browser-server.cjs`; log `wavec-s10-browser.log`); real Chrome; **unmodified production modules compiled from disk** (no hand-built store operations): real authStore→gate binding→handoff coordinator with all production participants registered via `initStoreRegistry`, real working stores (campaignService, shareableStore, inventoryStore, bookStore, characterStore/characterScopedStorage), the real mounted PersistenceProvider hydration/upload scheduler, the real `useJournalPersistence` continuation, the real `silentRoomHydration.applyRoomSnapshot` + `exitRoomProjection`, and the real `setupSocketConnection`/`setupAuthChangeHandler` in two real tabs. Only Firebase auth (cross-tab localStorage broadcast), Firestore (localStorage-backed, per-path deferred reads, write log) and the socket.io transport (in-page fake wire) are virtualized at their narrow network boundaries.
- **UI**: real Playwright resolver rendering and snapshots on an isolated localhost harness, including cancel/reload, CAS refusal, account switch and 390px overflow check. Simulated Firestore boundary.
- **P3/P4**: executed full server suite, including `roomCheckpoint*.test.js`, `roomAccessBoundary`, `roomAccessPrivacyProjection`, `p4CorrectionBoundary`, `c5RoomAuthority` and production socket/save fixtures; also executed client room hydration/boundary/P4 regressions.
- **ENV**: Java unavailable on PATH, Firebase CLI 14.15.1 present, `@firebase/rules-unit-testing` absent from frontend dependencies; rules runner explicitly returned BLOCKED.

| Case ID | Frozen requirement | Production entry point | Test method | Result | Evidence | Remaining gap |
|---|---|---|---|---|---|---|
| P5-01 | A logout → B login: No A draft content in B UI, working memory, selectors or cloud writes, including pre-hydration interval | BootstrapPrivacyGate, PrivateProjectionBoundary, handoff coordinator | Production-store Playwright | PASS | S10-1: real authStore→gate binding→coordinator with all production participants; A authored all five surfaces; retired pre-activation interval observed with no resolved scope, `NO_ACTIVE_SCOPE` engine reads, reset working projections and byte-identical A records; B saw only B-owned data; delayed A book/journal cloud reads refused under B; B cloud writes contained no A payload; A restored on return. Auth boundary simulated | Virtual Firebase auth boundary; no live backend |
| P5-02 | Returning A: A’s unsent campaign/journal/inventory/worldbuilding/character work is recoverable | Scoped consumers and store engines; journal hook hydration fence | Browser + focused regression | CORRECTED — RED→GREEN, pending bounded independent acceptance | Independent review reproduced: returning A’s unsent journal was overwritten by an older delayed cloud read (working state, scoped record and every recovery record lost it). Correction: a dirty owner-scoped journal is never overwritten by cloud hydration. Focused Jest RED (defect witness) → GREEN; real-Chrome production-path `P5_02_RECOVERY_PRESERVED` (unsent marker retained in working state + scoped record, pushed to A’s cloud by the existing dirty-local policy). S9C-2 remains store-engine recovery evidence | Auth boundary simulated; bounded independent acceptance of the correction outstanding |
| P5-03 | Late A callback after B: Delayed hydration, save, status and timer callbacks produce no B mutation | Scoped contexts, async consumers, socket retirement; journal save continuation | Controlled async + focused regression | CORRECTED — RED→GREEN, pending bounded independent acceptance | Independent review reproduced: a delayed A save completion set live B’s journal status to `saved`. Correction: the save captures owner/generation before async work and fences both success and failure continuations. Focused Jest RED (resolve-success, resolve-failure, thrown-failure paths) → GREEN; real-Chrome `P5_03_LATE_SAVE_FENCED` (live B, status stays `saving`, A-owned result preserved). WA/WB/S8A/S8B/S10 delayed-continuation evidence unchanged | Auth boundary simulated; bounded independent acceptance of the correction outstanding |
| P5-04 | Same UID logout/login: Old generation remains invalid despite same UID | Account context and generation fences; journal load guard | Unit + focused regression | CORRECTED — RED→GREEN, pending bounded independent acceptance | Independent review reproduced: `!ownerGuard.ok || ownerGuard.isCurrent()` failed open — a read begun with no active scope (generation 5, failed-handoff hold) applied after same-UID logout/login (generation 7). Correction: a missing/invalid owner guard never authorizes application; the load defers, inspects `whenHandoffIdle()` (blocked → refuse), and requires same principal + same generation + a valid guard before the read. Focused Jest RED→GREEN; real-Chrome `P5_04_INVALID_GUARD_REJECTED` (loading/null-scope start, generation 8→10, refusal) and `P5_04_VALID_FENCE` | Auth boundary simulated; bounded independent acceptance of the correction outstanding |
| P5-05 | Empty/missing/error cloud: EMPTY_VALID, ABSENT, and FAILED remain distinct; no implicit upload | Campaign cloud classifier / campaignService | Unit + emulator | BLOCKED BY ENVIRONMENT | CAS classification green; ENV | Actual emulator evidence |
| P5-06 | Malformed/newer-version cloud: Raw candidate retained; no empty/default overwrite or normal update | Campaign cloud classifier / scoped safe reads | Unit | PASS | CAS, WB, storageContracts | None for unit method |
| P5-07 | Unversioned owned cloud upgrade: Exact source fingerprint preserved; concurrent change refuses upgrade | Campaign legacy upgrade CAS and Firestore rules | Emulator | BLOCKED BY ENVIRONMENT | CAS/rule source checks; ENV | Executed rule/transaction upgrade cases |
| P5-08 | Local/cloud divergence: Both alternatives retained; no timestamp choice or deletion resurrection | campaignService.pendingConflict and resolver | Unit + browser | PASS | CAS, S8B; UI divergent candidates/cancel/refusal/reload | Simulated cloud boundary; no live Firebase claim |
| P5-09 | Two tabs, stale campaign save: One expected baseline wins; losing local draft remains recoverable | Local campaign coordination and cloud CAS | Emulator + two-tab browser | BLOCKED BY ENVIRONMENT | S8B-2, BR two real tabs; ENV | Actual Firestore concurrent-save evidence |
| P5-10 | Firestore transaction retry: Retry keeps original expected baseline and rejects changed head | saveCampaignCloudCas transaction callback | Emulator | BLOCKED BY ENVIRONMENT | CAS fixed-baseline doubles; ENV | Actual emulator retry transaction; the existing 18-rule runner is not this test |
| P5-11 | Explicit absent creation race: Exactly one creator succeeds; loser retains draft | Campaign expected-ABSENT CAS | Emulator | BLOCKED BY ENVIRONMENT | CAS doubles; ENV | Actual emulator create race; not covered by the existing 18 upgrade/update scenarios |
| P5-12 | Campaign delete/recreate: Old epoch/baseline cannot update new document instance | Campaign cloudEpoch CAS | Emulator | BLOCKED BY ENVIRONMENT | CAS unit evidence; ENV | Actual emulator delete/recreate sequence |
| P5-13 | Effective rule overlap: Blind writes remain denied despite generic worldbuilding matches | firestore.rules campaign singleton | Rules emulator | BLOCKED BY ENVIRONMENT | Rule source checks; ENV | Effective allow/deny execution, including overlap |
| P5-14 | Room X / Room Y selector race: X state never writes into Y | localRoomService, roomStateService, working room selectors | Two-tab browser | PASS | S9C-7: two real tabs + reloads; stale same-room write refused (`STALE_REVISION`); cross-tab selector change invalidated the captured destination; writes landed only on the captured room; X/Y records contain no mixed snapshot | Plain tabs on one browser context; production localRoomService path |
| P5-15 | Working reference changes during collection: Old operation refuses/supersedes; no mixed-room snapshot | levelEditorPersistenceService and room snapshot guards | Unit | PASS | WB closure/destinations; gameStateManager.guard; multiplayer hook suite | None for unit method |
| P5-16 | Local compare/write race: Competing tabs cannot silently replace the same revision | localCoordination campaign collection | Browser | PASS | BR two real tabs with Web Locks; losing fork retained | None for this browser storage race |
| P5-17 | Web Locks unavailable: Fresh fork/refusal preserves both; no unsafe shared index update | no-lock localCoordination and scoped-store fallback | Unit + browser | PASS | WA/WB no-lock tests; S9C-8: real Chrome context with `navigator.locks` absent; two tabs both obtained independently unique forks, the shared identity stayed MISSING, and non-forkable requests returned `COORDINATION_UNAVAILABLE` | Lock absence simulated via shadowed `navigator.locks` in real Chrome; module availability check is production code |
| P5-18 | Lock wait/timeout/crash: Source retained; queued operation revalidates context | localCoordination lock wrapper | Browser | PASS | S9C-9: real lock timeout (`TIMEOUT`); context change while waiting refused (`CONTEXT_REFUSED`) with source untouched; retry after release succeeded; real tab close released the held lock and the queued operation completed with a validated context | Tab crash approximated by closing the real tab (browser releases its locks); no process-kill fixture |
| P5-19 | Dirty N / save N−1: Older success cannot clear newer dirty revision or payload | Draft confirmation and campaign sync | Unit | PASS | WA/WB; S8B-9 captured-revision acknowledgment; correction independently re-accepted 2026-10-10 (focused 4/4 plus consolidated 7 suites/74 tests; no remaining reproduced defect) | None for unit method |
| P5-20 | Cross-account worldbuilding dirty state: A dirty marker never skips B load or schedules A content to B | Worldbuilding scoped engines/cloud hydration | Production-store Playwright | PASS | S10-2: real mounted PersistenceProvider; A dirty worldbuilding record; B hydration decision observed clean at the exact decision point and B's cloud load applied; B's production upload wrote only B content; A's dirty work preserved and pushed to A's own doc after return; delayed A hydration refused under B | Engine/store-level composition under the real provider; auth boundary simulated |
| P5-21 | Missing B journal: No retained A journal becomes B working state or upload source | Journal/shareable scoped hydration | Production-store Playwright | PASS | S10-3: real `useJournalPersistence` + shareableStore under the mounted provider; delayed A journal load could no longer hydrate B after the owner-fence correction (RED witness `A CLOUD NOTE` in B → GREEN); no A journal scheduled as B upload; A restored on return | Fix added 2026-10-10 (owner fence); production cloud boundary simulated; full React UI not rendered |
| P5-22 | Guest sign-in failure: Guest and user authored sources remain unchanged | Guest scope and handoff coordinator | Unit + browser | PASS | WA guest/handoff tests; S9C-5: forced preservation failure failed closed (no scope activated); guest and user scoped records and raw sources byte-identical; retry after clearing the failure switched to the target account safely | Auth boundary simulated (handoff invoked with a simulated principal) |
| P5-23 | Guest logout/restart: Guest drafts retained; memory retired; user drafts inaccessible | Stable guest identity / gate retirement | Browser | PASS | WA guest retention tests; S9C-6: production `clearGuestSessionState` + gate logout, real reload: guest identity/transient keys retired, guest authored keys and guest scoped draft byte-identical, signed-out reads `NO_ACTIVE_SCOPE`, user B saw `MISSING` | Auth boundary simulated |
| P5-24 | Guest/anonymous UID changes: Same stable guest scope; no user-scope claim/adoption | guestSessionIdentity, auth principal binding | Unit | PASS | WA guest/scope tests | None for unit method |
| P5-25 | Unknown legacy ownership: Quarantine only; last-user marker does not authorize import/upload | Legacy ownership classifier/quarantine | Unit | PASS | storageContracts, bootstrapAndCleanup, WA/WB | None for unit method |
| P5-26 | Migration interruption: Interruption at every step retains raw source or verified recovery | Preservation/protected storage | Fault-injection | PASS | WA preservation/blocker and storageContracts fault cases | No migration restart or architectural changes made |
| P5-27 | Malformed legacy payload: Raw bytes preserved; default save cannot replace them | safeRead, preservation, scoped adapters | Unit | PASS | storageContracts and WA/WB malformed source cases | None for unit method |
| P5-28 | Existing IndexedDB custom maps: Raw payload retained; unowned global enumeration does not populate account state | customMapOwnership and subregionMaps | Browser fixture | PASS | S9C-10: real IndexedDB seeded + reload; owned mirror/full fingerprints match, orphan unowned (`UNKNOWN`), only the owned map survived filtering, B ownership references empty, full image bytes recoverable | Mirror/full comparison for a single owned map; no multi-map legacy migration run |
| P5-29 | Quota failure: No draft/backup/candidate purge; dirty revision and prior source retained | protectedStorage, scoped writers and handoff | Fault-injection + browser | PASS | WA/WB quota fault-injection; S9C-11: real localStorage filled to <1KB headroom; durable candidate write refused (`STORAGE_ERROR`) with prior value intact; scoped engine write refused honestly, prior source unchanged, candidate retained and retried successfully after space was freed; no P5 key purged | Real Chromium quota exhaustion; large 4MB payloads used to force refusal beyond the browser's residual allowance |
| P5-30 | Serialization failure: No partial logical replacement or source retirement | safeWrite/protected storage/transfer preservation | Unit | PASS | storageContracts, WA protected storage, S8 source-retirement refusal | None for unit method |
| P5-31 | Campaign size refusal: No upload/dirty clearing; source and edit remain recoverable | Campaign CAS envelope/size guard and rules | Unit + emulator | BLOCKED BY ENVIRONMENT | CAS size guards; ENV | Emulator size/refusal evidence |
| P5-32 | Safe empty-room conversion: Valid same-owner transfer retained until correlated confirmed checkpoint | RoomLobby → P3 save_room_state_request → conversion flow | Existing server fixture + browser | BLOCKED BY ENVIRONMENT | P3 local-import/confirmed-save fixtures; S8A; BR simulated checkpoint confirmation; 2026-10-10 recheck: production writer path is Firestore Admin SDK, no isolated durable backend available (`java -version` unavailable, emulator cannot spawn), production service account not used | One browser-to-real-P3-stack conversion/checkpoint/resume sequence with isolated durable backing |
| P5-33 | Conversion failure/timeout/handoff: No premature converted completion/source deletion | Conversion lifecycle and socket confirmation flow | Controlled async + browser | PASS | S8A failure/timeout/generation tests; BR pending and same-UID flows | Browser socket boundary simulated, clearly scoped evidence |
| P5-34 | Initialized-room nonreplacement: Local import cannot replace stored initialized state | P3 room reconstruction/import policy | Existing P3/P4 fixtures | PASS | Full server roomCheckpoint/authority fixtures; S8A no browser snapshot save request | None for locked-fixture method |
| P5-35 | Foreign/orphan target: Existing authorization/eligibility denial remains intact | P4 admission / room metadata eligibility | Existing P4 fixtures | PASS | Full server roomAccessBoundary/p4CorrectionBoundary/c5RoomAuthority | None for locked-fixture method |
| P5-36 | Sandbox/map projection preservation: Authored working copy preserved before server projection replaces stores | Silent room hydration and authored map adapters | Production-store Playwright | PASS | S10-4: real `applyRoomSnapshot` hydrated the real map/token/condition/interactiveMap stores under the production suspension boundary; raw authored scoped records byte-identical during projection; in-projection edits stayed memory-only; production `exitRoomProjection` restored the authored sandbox across three cycles, a real exit and an interrupted owner change; server projection never stored | Full store-graph multiplayer UI not rendered; entry/exit invoked as the production callers do |
| P5-37 | Hydration no-write-loop: Hydration/confirmation metadata does not increment authored dirty revision or echo-save | Scoped engines and silent hydration | Unit | PASS | WA/WB, silentRoomHydration, multiplayer persistence hook | None for unit method |
| P5-38 | Multiplayer account handoff: A socket/UI retired; late A packet ignored; B uses fresh verified socket | Auth/socket retirement and admission | Two-tab production-socket Playwright | PASS | S10-5: two real tabs each running production `setupSocketConnection` + `setupAuthChangeHandler`; cross-tab A→B transition retired the other tab's socket (listeners detached, disconnected, presence cleared, pending/navigation keys cleared, projection exited); a late A packet delivered on the retired socket restored nothing; a stale A token-refresh continuation did not reconnect; production code created B's fresh socket and the same admission lifetime fence accepted it under B and rejected the old socket; no leave/revoke emission | Socket transport simulated; server-driven `room_joined` admission sequence not executed end-to-end |
| P5-39 | Membership after handoff: Session retirement does not revoke durable entitlement | P4 membership versus client session retirement | Existing P4 fixture | PASS | Server P4 boundary fixtures; client p4Corrections | None for locked-fixture method |
| P5-40 | P3/P4 regression preservation: Canonical ID, checkpoint revision, authority fences, privacy and scratch no-clobber still hold | Existing checkpoint/resume, authority and admission stack | Existing locked suites | PASS | Server 555 passing/1 pending; applicable client regressions green | One pre-existing server test pending; no deployment evidence |
| P5-41 | Registry/cleanup completeness: Every registered private family uses declared adapter/reset contract; generic cleanup cannot remove it | Private storage registry and scoped adapters | Source audit + tests | PASS | Registry/cleanup tests; added conflict hint uses scopedNativeFamily; changed-source inspection | No new unrelated storage mechanism |
| P5-42 | Pure global cache/preferences: Public defaults survive; private mixed content cannot leak through global exceptions | globalAllowlist and private adapters | Unit + browser | PASS | WA bootstrap/cleanup and WB mixed-store tests; S9C-14: real browser classify + cleanup: allowlisted preference removed/rebuilt freely, registered private and mixed keys `PROTECTED`, unregistered and P5-scoped keys refused, private content survived the generic cleanup run, allowlist integrity check passed | Classification/cleanup boundary exercised on real localStorage |

Totals after the 2026-10-10 S10 final five-case closure: **33 PASS, 9 BLOCKED BY ENVIRONMENT, 0 NOT YET VERIFIED, 0 reproduced remaining FAIL**. These are case classifications, not test counts. After the independent P5-19 acceptance the record stood at 28 independently supported PASS / 9 BLOCKED / 5 NOT YET VERIFIED / 0 FAIL; the S10 run re-verified exactly those five (P5-01, P5-20, P5-21, P5-36, P5-38) against the real production components. The earlier S9C claims for those five used scoped-engine reads/writes, a manually assigned upload source or a manually supplied socket and were therefore superseded, not counted; the S9C results for the other nine cases they covered remain as recorded. P5-32 remains BLOCKED BY ENVIRONMENT because its combined browser→real-P3-stack sequence needs an isolated durable Firestore backend and this machine cannot run the emulator (no Java). Emulator-blocked cases (P5-05, 07, 09, 10, 11, 12, 13, 31) are unchanged.

**Independent-review override (2026-10-10, post-S10):** the bounded read-only independent review corrected this matrix to **28 PASS / 9 BLOCKED / 2 NOT YET VERIFIED / 3 reproduced FAIL**. P5-01 and P5-38 were downgraded to NOT YET VERIFIED (the S10 harnesses did not mount the production room packet handlers and did not observe the pre-activation private-UI interval); P5-02, P5-03 and P5-04 were reopened by direct new production-path journal witnesses. P5-19 remains independently accepted PASS; P5-20, P5-21 and P5-36 remained PASS under that review. The bounded correction below addresses exactly the three FAILs; the corrected cases await bounded independent acceptance and are not self-classified as independently accepted.

## S10 FINAL FIVE-CASE EVIDENCE CLOSURE — 2026-10-10

Independent review accepted the P5-19 queued-edit correction but downgraded five S9C claims (P5-01, P5-20, P5-21, P5-36, P5-38) to NOT YET VERIFIED: those scenarios verified real storage but replaced or bypassed the production behavior under test (engine reads/writes instead of working stores, a manually assigned upload source, a manually supplied socket, a single runtime page). Starting classification: 28 PASS / 9 BLOCKED / 5 NOT YET VERIFIED / 0 FAIL. S10 re-ran exactly those five against the production components.

### Method

`wavec-s10-browser-server.cjs` Babel-compiles the **unmodified on-disk production modules** and serves them to system Chrome with a tiny `require` runtime. Only narrow network boundaries are virtualized: Firebase auth (cross-tab `localStorage` broadcast + storage events, deferred `getIdToken`), Firestore (localStorage-backed documents, per-path deferred reads, write log, transactions), and the socket.io transport (in-page fake wire preserving the production socket API). React/zustand UMD come from the project's own `node_modules`. For the `PersistenceProvider` mount only, four unrelated network-heavy hook modules (`useRoomPersistence`, `useUserItemsPersistence`, `useUserCreaturesPersistence`, `useUserMapsPersistence`) and `CharacterPersistenceProvider` are substituted at the module boundary; the auth store, bootstrap gate, handoff coordinator, all worldbuilding/journal stores, the provider's hydration/upload scheduler and the journal hook are the real production modules. Log: `D:/AppData/Temp/opencode/wavec-s10-browser.log`; runner: `wavec-s10-verify.cjs`.

### Results (5/5 PASS, real Chrome)

| Scenario | Case | Production path exercised | Key assertions |
|---|---|---|---|
| S10-1 | P5-01 | Real `authStore` → `installAuthBootstrapGate` → handoff coordinator with all participants registered via `initStoreRegistry`/`registerAllScopedStoreHandoffs`; real campaignService/shareableStore/inventoryStore/bookStore/characterScopedStorage | A authored all five surfaces; during the retired pre-activation interval (observed by a deferred observer participant registered last): gate not active, no resolved scope, `NO_ACTIVE_SCOPE` reads, all five working projections reset, interval engine write not queued, A raw records byte-identical; B saw only B-owned surfaces; delayed A book/journal cloud reads (`hydrateFromCloud`) resolved under B and were refused by the production owner guards; B's cloud writes contained no A payload and A's cloud docs were byte-identical; returning to A restored all five surfaces |
| S10-2 | P5-20 | Real mounted `PersistenceProvider` scheduler (dirty check → hydrate; debounced `syncToCloud` + `__confirmSynced`) with real bookStore/engine | A dirty record set through the store; B hydration decision observed at the exact decision point: destination dirty false (A's marker invisible), B's gated cloud load applied; B's production upload wrote only B content to B's doc; A's dirty work survived, was restored and pushed to A's own doc after return; delayed A hydration refused under B |
| S10-3 | P5-21 | Real mounted provider + real `useJournalPersistence` hook + real shareableStore | RED first: a delayed A journal cloud read hydrated B's working store with `A CLOUD NOTE` (reproduced defect). After the owner-fence correction: no A journal in B working store or B upload writes; A restored on return. Focused RED→GREEN test added (`src/hooks/__tests__/useJournalPersistence.ownerFence.test.js`) |
| S10-4 | P5-36 | Real `silentRoomHydration.applyRoomSnapshot` (which internally enters the projection boundary) hydrating real mapStore/characterTokenStore/conditionStore/interactiveMapStore; production `exitRoomProjection` (as called by `useSocketConnection`/`MultiplayerApp`) | Authored sandbox authored through real store actions; during room projection the projection was visible in memory while raw scoped records stayed byte-identical and in-projection edits stayed memory-only; three entry/exit cycles, a real exit and an interrupted owner change never stored server projection content; authored map/tokens/conditions restored and the destination owner's first write auto-resumed after an interrupted projection |
| S10-5 | P5-38 | Two real tabs; each socket created by production `setupSocketConnection`, each tab running production `setupAuthChangeHandler`; cross-tab A→B transition via the auth boundary; retirement through the coordinator socket participant + handler | A's socket retired (listeners detached, disconnected, presence store cleared), pending join/navigation keys cleared, projection window exited; a late A `room_state` packet delivered on the retired socket restored nothing; a stale A token-refresh continuation (production handler, held at the deferred token) did not reconnect; B's fresh socket was created by production code and accepted by the same `createSocketLifetimeGuard` admission fence under B while the old socket was rejected; no `leave_room`/revoke emission (client session retirement only) |

### Reproduced source defect and correction

- **RED witness:** `src/hooks/useJournalPersistence.js` `loadJournal` awaited a cloud read and then wrote the whole journal slice into `useShareableStore` with no owner/generation fence. In S10-3 a slow A read resolved after the account switched to B and hydrated `A CLOUD NOTE` into B's working store; the store's real `syncToCloud`/aut-save paths could then schedule that content as B's upload. The focused Jest test reproduced the same leak deterministically.
- **Correction (smallest):** `loadJournal` now captures `captureOwnerGuard(user.uid)` before the read and, after the await, requires the live auth principal to still be the same non-guest UID and the captured owner context (when available) to still be current; the load effect now waits `whenHandoffIdle()` and re-verifies the live principal before invoking the load. No other behavior changed.
- **GREEN:** focused owner-fence test passes; S10-3 passes in the real browser; the deduplicated regression run below passes (42 suites, 322 tests). Targeted ESLint on both changed files: 0 errors, 0 warnings.

### S10 limitations (stated, not waived)

- Firebase authentication and Firestore remain narrow-boundary simulations; no live authenticated or live-backend claim is made.
- Socket transport is an in-page fake wire; the server-driven `room_joined` admission sequence was not executed end-to-end. B's fresh socket was validated by the production admission fence (`createSocketLifetimeGuard`, also used by `roomJoinHandler`) rather than by a live server admission.
- Full React UI rendering was not repeated for the five cases; the working-store/selector values and the module-level UI projections (gate, boundaries) were asserted instead.
- P5-32 and the emulator/deployment gates above are unchanged by S10.

## BOUNDED JOURNAL LIFECYCLE CORRECTION — 2026-10-10 (P5-02, P5-03, P5-04)

Scope: correct exactly the three independently reproduced production journal defects reopened by the bounded independent review. No broad audit, no P6, no unrelated feature work, no commit/push/deployment. The independent reproduction specification is the reviewer's own harness and log: `D:/AppData/Temp/opencode/s10-independent-focused.cjs` / `.log` (real mounted `PersistenceProvider`, real `useJournalPersistence`, real `shareableStore`/scoped engine, simulated Firebase auth/Firestore boundaries only).

### Exact defect reproductions (independent witnesses, pre-correction)

- **P5-02 (`REPRODUCED_JOURNAL_RECOVERY_LOSS`):** owner A authors and locally preserves `A BEFORE HANDOFF UNSENT`; A→B→A restores it; releasing an older delayed cloud read for A left the working store as `["GENERATION WITNESS"]`, `localRetains:false`, `recoveryKeys:[]` — the unsent writing survived nowhere and the subsequent autosave published the older state.
- **P5-03 (`REPRODUCED_A_SAVE_STATUS_UNDER_B`):** A starts a save (`saving`); the asynchronous continuation is held; the account switches to B; releasing the save set the shared journal status to `saved` while `liveUid:"u-b"`.
- **P5-04 (`JOURNAL_GENERATIONS.invalid*`):** a read began with `phase:"loading", scope:null, accountGeneration:5, holdReason:"handoff-retirement-failed"`; after same-UID logout/login (`accountGeneration:7`, active) the held read completed with `success:true` and its `GENERATION WITNESS` journal data was applied.

### Root causes

- **P5-02:** `loadJournal` fenced owner/generation but applied any resolved cloud document over the working store (and thus over the scoped record via the persist engine) without consulting the owner-scoped dirty/revision contract. The `PersistenceProvider` hydration loop already skips dirty stores; the hook bypassed that decision.
- **P5-03:** `saveJournal` set `persistenceStatusStore` `saving`/`saved`/`error`, `lastSavedStateRef` and error notifications after the awaited persistence call with no captured owner/generation check, so a stale A continuation mutated B’s shared status/UI.
- **P5-04:** `const ownerCurrent = !ownerGuard.ok || ownerGuard.isCurrent();` treated a failed guard capture as authorization. Additionally the load effect discarded the actual `whenHandoffIdle()` result (`catch { /* proceed */ }`), so a blocked/failed handoff could still start hydration.

### Correction (one coherent change set)

`vtt-react/src/hooks/useJournalPersistence.js` only:

1. **Save continuation fence (P5-03):** `saveJournal` captures `captureOwnerGuard(user.uid)` before async work; `saving`, `saved`, `lastSavedStateRef`, error status and error notification mutations all require `ownerGuard.ok && ownerGuard.isCurrent()` after the await (success, resolve-failure and thrown-failure paths). The A-owned result object is still returned to its caller but never applied to B.
2. **Fail-closed load guard (P5-04):** a missing guard is never permission. If capture fails, the load waits `whenHandoffIdle()`, refuses when the handoff result is `blocked`, and otherwise requires the same live principal AND the same captured account generation plus a freshly valid guard before starting the read. The completion check is now `ownerGuard.ok && ownerGuard.isCurrent()` (never fails open). The load effect also inspects the `whenHandoffIdle()` result and skips blocked handoffs.
3. **Dirty-local preservation (P5-02):** after the owner-fenced read resolves, an owner-scoped dirty local journal (`engine.__isDirty()`, pending scoped writes, or a durable envelope with `dirty:true` via `loadScopedDraft`) refuses hydration (`local-dirty-preserved`). The authored local version stays in working state and the scoped record; the existing dirty-local sync path pushes it to the owner’s cloud document; the cloud alternative is left untouched (never silently discarded, never marked saved or empty).

No new sync engine, storage format, Firebase path or persistence architecture was introduced. Existing owner guards, account generations, scoped preservation, revision/dirty contracts and the P5-19 queued-edit behavior are unchanged.

### RED → GREEN

- **Focused regressions:** `vtt-react/src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js` (new, permanent) reproduces the exact sequences with the real gate/coordinator/scoped engine/shareableStore and controlled persistence/auth doubles.
- **RED (pre-correction working tree):** 5 failed / 3 passed of 8 — P5-02 unsent overwritten; P5-03 `saved` under B; P5-03 `error` status + notification under B (resolve-failure and thrown-failure); P5-04 held read applied (`success:true`).
- **GREEN (post-correction):** 8/8 new tests plus the existing `useJournalPersistence.ownerFence.test.js` = **2 suites, 9/9 tests passed**. Protection tests included: clean cloud hydration applies; missing/failed cloud read leaves working state untouched; in-flight valid same-UID read refused after logout/login.
- **Real Chrome, production path:** `D:/AppData/Temp/opencode/p5-journal-corrections-verify.cjs` (log `.log`; harness `wavec-s10-browser-server.cjs` Babel-compiles the unmodified on-disk modules; only Firebase auth/Firestore and the socket transport are narrow-boundary simulations):
  - `P5_02_RECOVERY_PRESERVED`: `dirtyBefore:true`, `restored` and `afterRead` contain `A BEFORE HANDOFF UNSENT`, `localRetains:true`, recovery key retained, cloud push retains the authored marker.
  - `P5_03_LATE_SAVE_FENCED`: `liveUid:"u-b"`, `beforeCompletion:"saving"`, A result `{success:true,userId:"u-a"}`, `afterCompletion:"saving"` (no B mutation).
  - `P5_04_INVALID_GUARD_REJECTED`: start `loading`/`scope:null`/generation 8, end active generation 10, result `{success:false,reason:"owner-changed-during-load"}`; the held old read is never issued.
  - `P5_04_VALID_FENCE`: in-flight read under active A refused after same-UID logout/login (generation 2→4).

### Verification run for this correction

- New focused regressions + existing owner fence: 2 suites, 9/9.
- Directly related journal/account-generation/protection suites: `shareableStore`, `waveA_handoff`, `waveB_scopedStoreStorage`, `waveB_scopedConsumer`, `waveB_b1b5Corrections` (19/19 alone), `characterPersistence` — all pass. One combined-run timing flake was observed: `waveB_b1b5Corrections B1-8` (entity-graph subsystem, unrelated to journal) exceeded its 5 s default timeout once under combined load, then passed alone and in its suite rerun (19/19); reported as a load flake, not a source failure.
- Targeted ESLint on both changed files: **0 errors, 0 warnings**.
- Production build (`craco build`, detached): **compiled successfully, exit code 0**; log `D:/AppData/Temp/opencode/p5-journal-build.log`, exit file `p5-journal-build.exit`.
- Not run, for bounded-scope reasons: the 107-family storage audits and the previously accepted P5 wave suites beyond the directly related set above.

### Limitations

- Firebase authentication and Firestore remain narrow-boundary simulations; no live-backend claim is made.
- The hook-level fixes were verified with the real production store/engine/gate/coordinator; full React UI rendering was not repeated.
- `journalService.loadJournal` still returns `null` for both a genuinely absent document and a failed read, so the hook reports `No saved data found` for both (inherited classification; the API does not permit distinguishing them). A failed read never erases working data and never claims saved/empty content.
- The three corrected cases are implementation-agent RED→GREEN results; they are **not** self-classified as independently accepted. Bounded independent acceptance remains outstanding. P5-01 and P5-38 remain NOT YET VERIFIED; the nine environment-blocked cases are unchanged.

## S9 CLOSURE RUN — 2026-10-10

**Superseded note:** the S9C scenarios S9C-1, S9C-3, S9C-4, S9C-12 and S9C-13 (P5-01, P5-20, P5-21, P5-36, P5-38) exercised scoped storage engines, a manually assigned upload source or a manually supplied socket rather than the production working stores/continuations; their PASS claims were downgraded by independent review and are superseded by the S10 run above. The remaining nine S9C scenarios (P5-02, 14, 17, 18, 22, 23, 28, 29, 42) remain as recorded.

Scope: verify the 15 outstanding NOT YET VERIFIED cases, recheck the emulator gate, and close S8 regression/build status with minimal targeted execution. **No application source file was modified in this run.** The only new artifacts are temporary browser-verification harnesses and this report.

### Real-browser results (S9C)

`node D:/AppData/Temp/opencode/wavec-s9-browser-verify.cjs` → **14/14 scenarios passed** (log: `D:/AppData/Temp/opencode/wavec-s9-browser.log`). Harness server: `wavec-s9-browser-server.cjs` (extended copy of the Wave C harness; production modules only, Firebase auth/firestore and socket transport virtualized as before).

| Scenario | Case | What was executed in real Chrome |
|---|---|---|
| S9C-1 | P5-01 | Production handoff coordinator A→B with a deferred reset participant; pre-activation interval had no resolved scope, all private reads/writes refused; B saw empty campaign/journal/inventory/worldbuilding/character surfaces; B cloud sync did not alter A's simulated document |
| S9C-2 | P5-02 | Real reload, coordinator return to A: all five surfaces recovered; B content intact |
| S9C-3 | P5-20 | A books + dirty marker; B load not skipped, B wrote its own books; A intact on return |
| S9C-4 | P5-21 | B journal `MISSING`; A journal records byte-identical after B wrote; A restored |
| S9C-5 | P5-22 | Forced preservation failure during guest→user handoff; fail-closed gate; guest + user sources byte-identical; recovery retry clean |
| S9C-6 | P5-23 | `clearGuestSessionState` + logout + real reload; identity retired, guest authored sources and draft retained; signed-out reads and user-scope reads refused |
| S9C-7 | P5-14 | Two real tabs; stale same-room write `STALE_REVISION`; cross-tab selector change invalidated the capture; X/Y records stayed pure across reloads |
| S9C-8 | P5-17 | Real Chrome with `navigator.locks` absent: both tabs forked with unique ids, shared identity MISSING, non-forkable requests `COORDINATION_UNAVAILABLE` |
| S9C-9 | P5-18 | Real lock timeout; context-change refusal while waiting; retry success; real tab close released the lock and the queued operation completed |
| S9C-10 | P5-28 | Real IndexedDB + reload; ownership fingerprints, orphan unowned, only owned map in account state, full image bytes recoverable |
| S9C-11 | P5-29 | Real quota exhaustion (<1KB headroom); durable + engine writes refused honestly, prior source/backup/candidate retained, retry persisted after freeing space |
| S9C-12 | P5-36 | Production engine suspension boundary kept projection payload memory-only (raw storage byte-identical); owner change auto-resumed; authored map restored after reload |
| S9C-13 | P5-38 | Production socket retirement + lifetime guard: A socket retired/cleared, late packet rejected, navigation keys cleared, generation advanced, B fresh socket valid |
| S9C-14 | P5-42 | Real classify/cleanup: private/mixed/unregistered refused, allowlisted preference cleanly removed/rebuilt, private content survived generic cleanup |

Simulation boundaries (explicit): Firebase authentication is simulated (the production coordinator/gate receive a simulated principal); Firestore reads/writes for campaign cloud are the existing localStorage-backed fake; socket payload transport is a fixture. Real components: Playwright system Chrome contexts, localStorage, IndexedDB, Web Locks (and a real no-locks context), tabs, reloads and quota behavior.

### Firestore emulator gate recheck (2026-10-10)

Still **BLOCKED; 0 of the 18 rule scenarios executed**:

- `java -version` → command unavailable; `JAVA_HOME` empty; no JRE/JDK under the common install locations or bundled with the Firebase cache.
- `firebase emulators:exec --only firestore --project demo-mythrill-p5-campaigns "node server/tests/campaignRules.emulator.cjs"` → `Error: Could not spawn 'java -version'. Please make sure Java is installed and on your system PATH.`
- `@firebase/rules-unit-testing` still absent from `vtt-react` (and `server`); it is not in `package.json` dependencies. No system software or project dependencies were installed.
- `server/firebase-service-account.json` exists, so the server's Firestore persistence is available locally; it was **not** used for any verification and no production data was touched.

Required sequence once authorized (unchanged):

```powershell
# 1. Install an authorized supported Java runtime (e.g. Temurin 21 LTS) - requires approval
java -version
# 2. Add the rules-testing dependency
npm --prefix vtt-react install --save-dev @firebase/rules-unit-testing
# 3. Execute the 18 scenarios against a local-only emulator
firebase emulators:exec --only firestore --project demo-mythrill-p5-campaigns "node server/tests/campaignRules.emulator.cjs"
```

**Additional transaction scenarios still required beyond the existing 18** (none can be honestly counted as executed): (1) real transaction retry retaining the original expected baseline and rejecting a changed head (P5-10); (2) expected-ABSENT concurrent creation race with exactly one winner and the loser's draft retained (P5-11); (3) delete/recreate where a stale epoch/baseline cannot update the new document instance (P5-12); (4) size-refusal at the rules boundary (P5-31); (5) concurrent two-tab save where one expected baseline wins at the real backend (P5-09); (6) emulator read classification `EMPTY_VALID` / `ABSENT` / `FAILED` (P5-05). The existing 18 cover legacy-source validation/upgrades, ordinary successor/epoch/revision rules, owner isolation, blind legacy-writer refusal and an obsolete-upgrade loss — by themselves they do not establish items 1–6, and none of them has been executed here.

### Priority B — real P3 durable conversion

**BLOCKED BY ENVIRONMENT; no conversion was attempted against live data.** The production P3 checkpoint path is `server/handlers/syncHandlers.js` → `firebaseBatchWriter.saveNow` → `syncService.js` default `persist` → `firebaseService.updateRoomGameState` → Firestore Admin SDK. An isolated durable backend would be the Firestore emulator (Java) or another isolated Firestore; both are unavailable, and the production service account must not be used. A file-backed substitute writer would not be the P3 cloud checkpoint path, so it was deliberately not used to claim durability. P5-32 remains the only case without its complete frozen method.

### Regression / lint / build disposition (no source changes this run)

- The nine `import/first` errors in `vtt-react/src/components/account/CampaignManager.jsx` were re-linted on both the working tree and the exact `HEAD` pre-Wave-C file: **both produce the identical 18 problems (9 errors, 9 warnings)**. They are fully inherited legacy lint; the Wave C change to that file added only the resolver import and its JSX mount. Not release-blocking for P5 source acceptance; no unrelated legacy lint was "fixed" to make the report green.
- The one pending server test is `updateRoomGameState reports unavailable instead of true when no persistence is configured`, which self-skips (`this.skip()`) whenever Firestore persistence **is** available in the environment (the local service-account file makes it available here). It is an environment-conditional skip, not a failure or an unverified source path.
- No application source changed, so the previously accepted 40-suite/317-test client run, 555-passing/1-pending server suite and the production build remain the current evidence; they were not re-run merely to duplicate accepted results.
- **No new source defect was reproduced in this run.** Every scenario failure encountered while building the S9C harnesses was a harness defect (fake-store shape, argument passing, assertion over-strictness), corrected in the temporary harness only; no production module required a correction. There is therefore no new RED→GREEN block for this run.

## BROWSER VERIFICATION

Real Chrome through Playwright, isolated localhost storage, real Web Locks, two real tabs and real reloads. Eight native-module scenarios passed. The initial loader/fixture failures were corrected; they were harness defects, not counted as production RED→GREEN fixes.

Additional production-resolver browser checks: both candidates/actions visible; cancel retains conflict and local alternative; reload restores identity; publishing against a changed simulated cloud head is refused honestly; account switch removes old UI; 390px viewport has no horizontal overflow. Snapshot examples: `.playwright-mcp/page-2026-10-09T13-48-51-941Z.yml` (CAS refusal) and the inline account-switch snapshot (dialog absent).

This is module/component browser evidence, **not full-application or live Firebase acceptance**. The temporary harness, browser and server were closed at the end. The 2026-10-10 S9 closure run added fourteen more real-browser scenarios (see “S9 CLOSURE RUN — 2026-10-10”, 14/14 passed); the 2026-10-10 S10 run added five production-path scenarios (5/5 passed) that re-verified the five cases whose S9C evidence was superseded.

### Requested real-flow coverage

| Requested flow | This run |
|---|---|
| Account A → B → A | S10-1: real authStore→gate binding→coordinator with all production participants; real working stores for all five surfaces; retired interval, late A continuations, B isolation and A recovery asserted; simulated auth. (Supersedes S9C-1/S9C-2 for P5-01.) |
| Guest → registered without adoption | S9C-5: fail-closed sign-in failure keeps guest + user sources byte-identical, then clean retry; simulated auth |
| Same-UID logout/relogin pending operation | Real browser generation switch with simulated socket completion (BR); unchanged |
| Two tabs saving a draft | Real browser local campaign compare/write race (BR); S9C-7 added the real two-tab room X/Y race; S10-5 added the real two-tab socket/account handoff; Firebase race blocked |
| Refused save then account handoff | Resolver simulated CAS refusal + account switch (UI); live save/handoff not executed (Firestore gate) |
| Character creation/selection/restoration | S9C-2 roster + active pointer restored after real reload; S10-1 restored the roster/active pointer through the real characterStore handoff; store-level, not full UI |
| Worldbuilding/journal editing | S10-2 (books under the real provider scheduler) and S10-3 (real journal hook + store with the owner-fence fix) with cross-account isolation; simulated cloud boundary |
| Local-room creation/return | S9C-7 real rooms + per-room state across two tabs and reloads |
| Conversion/durable checkpoint | P5-32 BLOCKED: no isolated durable P3 backend (Java unavailable, emulator cannot spawn); browser lifecycle + server fixtures only, no durable claim |
| Campaign divergence/reconciliation | Real resolver browser controls and storage/reload verified against simulated cloud (unchanged) |
| Authored map preservation on multiplayer hydration | S10-4: real applyRoomSnapshot + real map/token/condition stores + production exitRoomProjection across cycles, exit and interrupted owner change. (Supersedes S9C-12.) |
| IndexedDB ownership/full-image recovery | S9C-10: new native IndexedDB fixture with reload; orphan refused, full image recoverable |
| Multiplayer account/socket handoff | S10-5: two real tabs, production socket creation and auth-change retirement; late packet and stale token continuation rejected; B fresh socket validated by the production admission fence. (Supersedes S9C-13.) |

## FIRESTORE EMULATOR RESULTS OR EXACT ENVIRONMENT BLOCKER

**BLOCKED; 0 of the 18 rule scenarios executed.**

- `java -version`: command unavailable on PATH. 2026-10-10 recheck: `firebase emulators:exec --only firestore ...` returned `Error: Could not spawn 'java -version'`.
- Firebase CLI available: **14.15.1**.
- `@firebase/rules-unit-testing`: not installed under `vtt-react` (nor server).
- Direct runner with a local-only emulator host returned `BLOCKED: @firebase/rules-unit-testing is not installed for vtt-react`.

After separately installing an authorized supported Java runtime (Java 21 LTS is a suitable choice), run from the repo root:

```powershell
java -version
npm --prefix vtt-react install --save-dev @firebase/rules-unit-testing
firebase emulators:exec --only firestore --project demo-mythrill-p5-campaigns "node server/tests/campaignRules.emulator.cjs"
```

No system-wide software was installed. No rules were deployed. The existing 18 scenarios cover legacy-source validation/upgrades, ordinary successor/epoch/revision rules, owner isolation and blind legacy writer refusal. They do **not**, by themselves, establish all frozen creation-race, delete/recreate or actual transaction-retry cases. Those remain explicit matrix gates.

## ACCOUNT / GUEST / TWO-TAB VERIFICATION

Captured-context/generation source suites pass. Real two-tab campaign local CAS and real browser same-UID-generation rejection pass. 2026-10-10: the multi-surface account A→B→A, guest failure/logout/restart, worldbuilding/journal isolation, real two-tab room X/Y race, real IndexedDB and real quota scenarios executed in the S9C browser harness (14/14). The Firebase authentication boundary remains simulated; the full authenticated login UI was not executed. No existing account data or production Firebase records were used.

## P1–P4 REGRESSION STATUS

`npm test` in `server`: **555 passing, 1 pending** (37 seconds). The pending `updateRoomGameState reports unavailable instead of true when no persistence is configured` test self-skips (`this.skip()`) when Firestore persistence IS available in the environment (true here because of the local service-account file); it is an environment-conditional skip, not a failure, and is not counted as PASS. It is not release-blocking.

The applicable client P4/room-service/hydration/socket/error-handler suites are included in the final client run. Authority, private visibility, membership, admission/join security and checkpoint/resume fixtures pass. Server authority/admission architecture was not changed.

## TEST COMMANDS AND RESULTS

Final deduplicated client run (PowerShell, working directory `vtt-react`):

```powershell
$env:CI='true'
$env:NODE_OPTIONS='--max-old-space-size=8192'
node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --silent --testPathPattern "persistence/.*test|waveB_|waveC_|socketHandlers/.*test|checkpoint|roomSave|roomAccess|p4|accountHandoff|roomHydrationCorrections|silentRoomHydration|roomService.boundary|gameStateManager.guard|useLevelEditorPersistence.multiplayer|characterPersistence.test|shareableStore|bookStore|inventoryStore|canonStores|syncStore|hooks/__tests__/useJournalPersistence"
```

**42 suites, 322 tests passed** (S10 post-fix run, 21.09 seconds). This includes the previously accepted S8 tests and the new focused owner-fence test; earlier subset runs are superseded by this deduplicated run.

- Server, working directory `server`: `npm test` → 555 passing, 1 pending (unchanged; the S10 source change is client-only).
- Browser harness (Wave C): `node D:/AppData/Temp/opencode/wavec-browser-verify.cjs` → 8/8 browser-native scenarios passed; simulated network boundaries.
- Browser harness (S9 closure): `node D:/AppData/Temp/opencode/wavec-s9-browser-verify.cjs` → 14/14 browser-native scenarios passed; log `D:/AppData/Temp/opencode/wavec-s9-browser.log` (see superseded note: five of these are superseded by S10).
- Browser harness (S10 production path): `node D:/AppData/Temp/opencode/wavec-s10-verify.cjs` → **5/5 production-path scenarios passed**; log `D:/AppData/Temp/opencode/wavec-s10-browser.log`.
- Bounded journal correction (2026-10-10), working directory `vtt-react`: `node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --silent --testPathPattern "hooks/__tests__/useJournalPersistence"` → **2 suites, 9/9 passed**; pre-correction RED was 5 failed / 3 passed of the new 8. Directly related set (`shareableStore`, `waveA_handoff`, `waveB_scopedStoreStorage`, `waveB_scopedConsumer`, `waveB_b1b5Corrections`, `characterPersistence`) → all pass; one unrelated entity-graph timing flake (`B1-8`, 5 s timeout) under combined load passed alone and in its suite rerun (19/19).
- Bounded journal correction browser: `node D:/AppData/Temp/opencode/p5-journal-corrections-verify.cjs` → **4/4 production-path scenarios passed** (`P5_04_VALID_FENCE`, `P5_02_RECOVERY_PRESERVED`, `P5_03_LATE_SAVE_FENCED`, `P5_04_INVALID_GUARD_REJECTED`); log `D:/AppData/Temp/opencode/p5-journal-corrections.log`; same S10 harness boundaries.
- Bounded journal correction build: detached `craco build` → **exit code 0**; log `D:/AppData/Temp/opencode/p5-journal-build.log`.
- Rules runner: blocked, no scenario PASS.

## BUILD / LINT

- Frontend production build via `npm run build` (`craco build`, detached): **compiled successfully, exit code 0** on the S10 source (which includes the owner-fence fix). Log: `D:/AppData/Temp/opencode/wavec-s10-build.log`; exit file `wavec-s10-build.exit`. The earlier 2026-10-09 build (`wavec-final-build.log`) remains the pre-fix baseline. Interrupted attempts are not counted as build success; earlier attempts through the wrong runner are not counted.
- Targeted S8 lint (new resolver, conversion modules, registry, campaign service and both new test suites): zero errors/warnings on the final check.
- S10 lint: `eslint src/hooks/useJournalPersistence.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js` → 0 errors, 0 warnings.
- Linting all touched legacy files additionally reports **9 pre-existing import/first errors in CampaignManager.jsx and legacy warnings**. Wave C added only the resolver import/mount in that file. These are not silently reported as lint PASS, nor corrected through unrelated refactoring.
- 2026-10-10 S9 recheck: linting the working-tree file and the exact `HEAD` pre-Wave-C file produced identical results (18 problems: 9 errors, 9 warnings). The errors are fully inherited; attribution is settled.
- Impeccable detector on the resolver returned `[]`.

## FILES CHANGED

Wave C changes only (other working-tree edits/assets predated or were outside this task):

- `vtt-react/src/persistence/localRoomConversionScoped.js`
- `vtt-react/src/persistence/localRoomConversionFlow.js` (new)
- `vtt-react/src/persistence/privateStorageRegistry.js`
- `vtt-react/src/services/localRoomService.js`
- `vtt-react/src/services/campaignService.js`
- `vtt-react/src/components/local-room/LocalRoomIndicator.jsx`
- `vtt-react/src/components/multiplayer/RoomLobby.jsx`
- `vtt-react/src/components/campaign/CampaignConflictResolver.jsx` (new)
- `vtt-react/src/components/account/CampaignManager.jsx`
- `vtt-react/src/persistence/__tests__/waveC_s8ConversionDurability.test.js` (new)
- `vtt-react/src/services/__tests__/waveC_s8ConflictResolution.test.js` (new)
- This report/matrix.

S10 changes (2026-10-10, the first application source change since the P5-19 correction):

- `vtt-react/src/hooks/useJournalPersistence.js` (owner fence on the delayed journal load; load effect waits for handoff idle and re-verifies the live principal).
- `vtt-react/src/hooks/__tests__/useJournalPersistence.ownerFence.test.js` (new focused regression).
- This report/matrix.

Bounded journal lifecycle correction changes (2026-10-10, post-independent-review; P5-02/P5-03/P5-04):

- `vtt-react/src/hooks/useJournalPersistence.js` (save continuation owner/generation fence; fail-closed load guard with `whenHandoffIdle()` result inspection and generation-stability requirement; dirty owner-scoped journal preservation against cloud hydration).
- `vtt-react/src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js` (new permanent focused regressions for the three exact sequences plus clean-hydration / failed-read / valid-fence protections).
- This report/matrix.
- Temporary verification artifacts only (not application code): `D:/AppData/Temp/opencode/p5-journal-corrections-verify.cjs`, `p5-journal-corrections.log`, `p5-journal-build.log`, `p5-journal-build.exit`.

Temporary browser/compiler/extraction harnesses live under `D:/AppData/Temp/opencode`; they are verification artifacts, not deployed application code. The S10 run added only `wavec-s10-browser-server.cjs`, `wavec-s10-verify.cjs`, `wavec-s10-browser.log`, `wavec-s10-build.log`, `wavec-s10-build.exit` and this report update. The S9 run added only `wavec-s9-browser-server.cjs`, `wavec-s9-browser-verify.cjs`, `wavec-s9-browser.log` and the earlier report update.

## DEMONSTRATED SOURCE DEFECTS

Focused production-module RED→GREEN witnesses:

1. **S8A-13:** a same-room saved packet before conversion admission/request prematurely retired the transfer. Added admission/request gating.
2. **S8A-14:** source-retirement callback failure still cleared the transfer. Now preserves the confirmed recovery receipt; production callback awaits successful local registry persistence.
3. **S8A-15:** account-generation switch before confirmation timeout detached the flow, then dereferenced null active state. Guarded the timer continuation.
4. **S8B-11:** ordinary campaign sync could write during pending reconciliation. Added explicit-resolution-only cloud publication while conflict is pending.
5. **S8A-16:** a same-destination checkpoint for another explicit save reason could confirm conversion. Required the existing P3 echoed `local_room_conversion` reason, as well as destination/admission/durable revision; no server contract change.
6. **S10-3 (P5-21, 2026-10-10):** `useJournalPersistence.loadJournal` awaited a cloud read and then wrote the whole journal slice into the working store with no owner fence. A slow A read resolving after an account switch to B hydrated A's cloud journal into B's working store, from where the real upload paths could publish it to B. RED witness: browser S10-3 (`A CLOUD NOTE` in B) plus the focused Jest test; correction: `captureOwnerGuard` captured before the read and revalidated after, and the load effect waits `whenHandoffIdle()` and re-checks the live principal. GREEN: focused test, S10-3, 42-suite/322-test regression run, lint clean, production build exit 0. This defect was independently reproduced after the P5-19 correction and is the only new application-source change in the S10 run.
7. **P5-02 (2026-10-10 bounded correction):** a delayed older cloud journal read overwrote returning owner A’s restored dirty local journal in working state and in the scoped record; no recovery record retained it. RED witness: independent `REPRODUCED_JOURNAL_RECOVERY_LOSS` plus focused Jest RED; correction: owner-fenced load refuses hydration while the owner-scoped journal is dirty (`__isDirty` / pending scoped writes / durable `dirty:true` envelope), keeping the authored local version and the existing dirty-local push policy. GREEN: focused Jest, real-Chrome `P5_02_RECOVERY_PRESERVED`, lint 0/0, build exit 0.
8. **P5-03 (2026-10-10 bounded correction):** a delayed A save continuation set the shared journal status to `saved` (and, on failure, `error` + notification) while B was the live account. RED witness: independent `REPRODUCED_A_SAVE_STATUS_UNDER_B` plus focused Jest RED; correction: owner/generation captured before the save await and revalidated before any status/ref/notification mutation on success and failure continuations. GREEN: focused Jest (three continuation paths), real-Chrome `P5_03_LATE_SAVE_FENCED`.
9. **P5-04 (2026-10-10 bounded correction):** `!ownerGuard.ok || ownerGuard.isCurrent()` failed open — a read begun with no active owner scope (generation 5, failed-handoff hold) applied its journal after same-UID logout/login (generation 7). RED witness: independent `JOURNAL_GENERATIONS.invalid*` plus focused Jest RED; correction: a missing guard is never authorization; defer, inspect the `whenHandoffIdle()` result (blocked → refuse), require same principal + same generation + a freshly valid guard before the read, and fence the completion with `ok && isCurrent()`. GREEN: focused Jest, real-Chrome `P5_04_INVALID_GUARD_REJECTED` and `P5_04_VALID_FENCE`.

Additional S8 implementation safeguards exercised by the passing suites: queued local persistence serialization, stale edit/owner checks, refusal retention, verified cloud reads before cloud continuation, preserved expected baseline after reload and newer local working-candidate selection after refused publication. These are not presented as independently witnessed RED→GREEN defects where no separate pre-fix witness was recorded.

**2026-10-10 S9 run: no new source defect was demonstrated.** All failures observed while building the S9C browser scenarios were harness defects corrected inside the temporary harness; no production module failed its assertion and no application source was modified.

## UNVERIFIED RELEASE GATES

Source-acceptance gates remaining:

1. **P5-32 only:** one browser→real-P3-stack conversion/checkpoint/restart sequence with isolated durable backing. Blocker: no isolated durable Firestore backend on this machine (`java -version` unavailable; emulator cannot spawn). Production data must not be used.

Deployment / environment gates explicitly listed (not silently waived):

2. Java + `@firebase/rules-unit-testing` prerequisites, execution of all 18 effective-rule scenarios.
3. Additional emulator transaction scenarios beyond the 18: real transaction retry (P5-10), expected-ABSENT creation race (P5-11), delete/recreate epoch fence (P5-12), size refusal (P5-31), real concurrent two-tab save (P5-09), emulator read classification (P5-05).
4. Full authenticated application UI flows against real Firebase auth/sockets and live-Firebase reconciliation. The S10 production-path flows still virtualize the Firebase auth/firestore and socket boundaries and do not execute the server-driven `room_joined` admission round trip.
5. Existing whole-file CampaignManager lint errors (inherited, identical at HEAD; disposition recorded in the S9 section) and the environment-conditional pending server test.

## P5 SOURCE ACCEPTANCE READINESS

Current corrected standings after the 2026-10-10 bounded journal lifecycle correction: **28 independently supported PASS / 3 corrected pending bounded independent acceptance (P5-02, P5-03, P5-04) / 9 BLOCKED BY ENVIRONMENT / 2 NOT YET VERIFIED (P5-01, P5-38) / 0 currently reproduced FAIL**. The three corrected cases carry implementation RED→GREEN focused regressions and real-Chrome production-path evidence but are not self-classified as independently accepted. P5-19 remains independently accepted PASS; P5-20, P5-21 and P5-36 remained PASS under the independent review; the S8 source and focused regressions are implemented; the locked server suites and bounded browser suites pass.

Bounded independent acceptance of the three corrections can proceed against this record. It cannot be represented as deployment readiness: P5-32's real durable P3 round trip, the P5-01/P5-38 frozen methods and the Java/rules emulator and live-backend/authenticated-socket deployment gates above remain unexecuted with the exact blockers listed.

**THREE JOURNAL DEFECTS CORRECTED — READY FOR BOUNDED INDEPENDENT ACCEPTANCE. P5-01/P5-38 REMAIN NOT YET VERIFIED; EXTERNAL DEPLOYMENT GATES REMAIN.**

No P6, unrelated feature work, commit, push or deployment. No remaining failing source test was demonstrated in this correction run; the single combined-run timeout was an unrelated entity-graph timing flake that passed in isolation and in its suite rerun.
