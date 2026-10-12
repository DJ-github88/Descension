# MYTHRILL P5 — WAVE C IMPLEMENTATION AND VERIFICATION

**Current P5-01 implementation status — 2026-10-11:** SOL corrected the five independently demonstrated character completion/recovery failures below, reproduced them RED before correction, and verified the corrected production paths GREEN. Final related regressions: **15 suites / 91 tests passed**; targeted lint **0 errors / 0 warnings**; final detached production build **compiled successfully / exit 0**. This is implementation evidence, **not independent acceptance**. The latest independent P5-01 BLOCK remains the review baseline until bounded independent verification. Current readiness: **32 previously independently accepted cases / 1 corrected case awaiting independent verification (P5-01) / 9 environment-blocked cases**. The historical sections and their earlier completion claims are superseded for P5-01 by the SOL section below.

Date: 2026-10-09, updated 2026-10-10 (S9 closure run, S10 final five-case evidence closure, the post-independent-review bounded journal lifecycle/timing corrections for P5-02/P5-03/P5-04, the final two-case source-evidence closure for P5-01/P5-38, and the second bounded mounted-integration correction for the four failures re-reproduced by the latest independent review). Scope: S8 conversion/reconciliation, S9/S10 final verification, the bounded journal lifecycle correction, the bounded P5-01/P5-38 production-path closure, and the mounted-integration correction.

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
| P5-01 | A logout → B login: No A draft content in B UI, working memory, selectors or cloud writes, including pre-hydration interval | BootstrapPrivacyGate, PrivateProjectionBoundary, handoff coordinator | Production-store Playwright + mounted production UI | CORRECTED — RED→GREEN (final character ownership/preservation correction 2026-10-11), pending single-case bounded independent acceptance | Final two-case closure (2026-10-10): real authStore→gate binding→coordinator with all production participants (`initStoreRegistry`); A authored all five surfaces through production actions; five real mounted production UI consumers (CharacterManagement, BookManager, PlayerJournalWindow, InventoryWindow, CampaignManager) inside the real PrivateProjectionBoundary observed continuously by rAF frames + samplers through the delayed-reset interval, delayed B hydration and late A callbacks (canonical run: 150 frames / 258 samples; 22 pre-switch positive frames with A content; 94 in-window frames with 0 A-content frames; held post-flush interval sample empty); actual character working selectors (`characters`, `getActiveCharacter`, `currentCharacterId`) asserted; scoped engine reads `NO_ACTIVE_SCOPE`; A raw content retained; B saw only B-owned cloud + authored data; late A books/journal/character continuations refused under B; B uploads contained no A payload; A restored on return. One reproduced pre-correction stale UI frame was fixed (defect 12, synchronous boundary isolation) with a permanent RED→GREEN regression. **Second mounted-integration correction (2026-10-10):** the three failures re-reproduced by the latest independent review are corrected — the production `/account` AccountDashboard route element now mounts the real PrivateProjectionBoundary; private portal windows (PlayerJournalWindow/Inventory/CharacterSheet/CampaignManager/Library) are hidden synchronously and unmounted during isolation; the character working projection is flushed to the retained owner's scoped record and cleared at isolation start (selectors expose nothing during preservation); the boundary consumes the cached gate snapshot through `useSyncExternalStore` so an activation between render and subscription is never missed. See “MOUNTED-INTEGRATION CORRECTION — 2026-10-10”. | Virtual Firebase auth/Firestore boundary; socket transport; icon/layout/routing stubs; no live backend. The mounted correction witness uses the actual AccountDashboard route element and real consumers; App-level providers around the route are not part of the mount |
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
| P5-38 | Multiplayer account handoff: A socket/UI retired; late A packet ignored; B uses fresh verified socket | Auth/socket retirement and admission | Two-tab production-socket Playwright + mounted MultiplayerApp | CORRECTED — RED→GREEN, pending bounded independent acceptance | Final two-case closure (2026-10-10): two real tabs each running production `setupSocketConnection`, `setupAuthChangeHandler` and `registerAllSocketHandlers` (real `room_joined`/`room_created`/`player_joined` listeners registered on both sockets); A's room state delivered by firing `room_joined` into the production listener and admitted by the actual client continuation `handleJoinRoom` (Room A applied, projection active, presence/party set in both tabs); cross-tab A→B retired both sockets through the production paths (retired, disconnected, listeners 0, presence/gameStore cleared, projection exited, suspension released, pending/nav keys retired, room projection removed); a late A `room_joined` on the retired socket was ignored (0 listeners, no pending data, no projection; `registerAllSocketHandlers` refuses retired sockets; manual reconnect emits no rejoin); a held stale A admission continuation and a held stale A token-refresh continuation both failed to reactivate under B; B created a fresh socket through the production lifecycle and its own production admission installed Room B with the A socket rejected by the same guard; no `leave_room`/`leave_party`/revoke/kick emissions. **Second mounted-integration correction (2026-10-10):** the mounted `MultiplayerApp` now re-establishes the destination socket automatically — the setup effect depends on the eligible principal (`useEligibleSocketPrincipal`, which waits for the handoff to settle and requires the active matching gate scope); A's setup is disposed first; B's fresh socket registers the production listeners, completes the existing admission continuation and is bound to presence; the retirement path emits no `leave_room` for the retired socket; ordinary rerenders create no duplicates. See “MOUNTED-INTEGRATION CORRECTION — 2026-10-10”. | Socket transport simulated (in-page wire); server-driven `room_joined` round trip not executed against a live server; no live authenticated deployment claim |
| P5-39 | Membership after handoff: Session retirement does not revoke durable entitlement | P4 membership versus client session retirement | Existing P4 fixture | PASS | Server P4 boundary fixtures; client p4Corrections | None for locked-fixture method |
| P5-40 | P3/P4 regression preservation: Canonical ID, checkpoint revision, authority fences, privacy and scratch no-clobber still hold | Existing checkpoint/resume, authority and admission stack | Existing locked suites | PASS | Server 555 passing/1 pending; applicable client regressions green | One pre-existing server test pending; no deployment evidence |
| P5-41 | Registry/cleanup completeness: Every registered private family uses declared adapter/reset contract; generic cleanup cannot remove it | Private storage registry and scoped adapters | Source audit + tests | PASS | Registry/cleanup tests; added conflict hint uses scopedNativeFamily; changed-source inspection | No new unrelated storage mechanism |
| P5-42 | Pure global cache/preferences: Public defaults survive; private mixed content cannot leak through global exceptions | globalAllowlist and private adapters | Unit + browser | PASS | WA bootstrap/cleanup and WB mixed-store tests; S9C-14: real browser classify + cleanup: allowlisted preference removed/rebuilt freely, registered private and mixed keys `PROTECTED`, unregistered and P5-scoped keys refused, private content survived the generic cleanup run, allowlist integrity check passed | Classification/cleanup boundary exercised on real localStorage |

Totals after the 2026-10-10 S10 final five-case closure: **33 PASS, 9 BLOCKED BY ENVIRONMENT, 0 NOT YET VERIFIED, 0 reproduced remaining FAIL**. These are case classifications, not test counts. After the independent P5-19 acceptance the record stood at 28 independently supported PASS / 9 BLOCKED / 5 NOT YET VERIFIED / 0 FAIL; the S10 run re-verified exactly those five (P5-01, P5-20, P5-21, P5-36, P5-38) against the real production components. The earlier S9C claims for those five used scoped-engine reads/writes, a manually assigned upload source or a manually supplied socket and were therefore superseded, not counted; the S9C results for the other nine cases they covered remain as recorded. P5-32 remains BLOCKED BY ENVIRONMENT because its combined browser→real-P3-stack sequence needs an isolated durable Firestore backend and this machine cannot run the emulator (no Java). Emulator-blocked cases (P5-05, 07, 09, 10, 11, 12, 13, 31) are unchanged.

**Independent-review override (2026-10-10, post-S10):** the bounded read-only independent review corrected this matrix to **28 PASS / 9 BLOCKED / 2 NOT YET VERIFIED / 3 reproduced FAIL**. P5-01 and P5-38 were downgraded to NOT YET VERIFIED (the S10 harnesses did not mount the production room packet handlers and did not observe the pre-activation private-UI interval); P5-02, P5-03 and P5-04 were reopened by direct new production-path journal witnesses. P5-19 remains independently accepted PASS; P5-20, P5-21 and P5-36 remained PASS under that review. The bounded correction below addresses exactly the three FAILs; the corrected cases await bounded independent acceptance and are not self-classified as independently accepted.

**Independent-review override 2 (2026-10-10, latest bounded review):** the follow-up read-only review accepted P5-04 (failed-capture fail-closed behavior) and re-blocked exactly P5-02 and P5-03 in two production timing windows the first hook-level correction did not cover: the provider/store hydration continuation and the coordinator `stopNewWork` preservation interval. Canonical classification at that point: **29 PASS (P5-04 included) / 9 BLOCKED BY ENVIRONMENT / 2 NOT YET VERIFIED (P5-01, P5-38) / 2 reproduced FAIL (P5-02, P5-03)**. The second bounded correction below addresses exactly those two windows; P5-04 was not reopened. Current corrected standings: **29 independently supported PASS / 2 corrected pending bounded independent acceptance (P5-02, P5-03) / 9 BLOCKED BY ENVIRONMENT / 2 NOT YET VERIFIED (P5-01, P5-38) / 0 currently reproduced FAIL**.

**Final two-case closure (2026-10-10, this run):** the two remaining NOT YET VERIFIED cases (P5-01, P5-38) were re-verified against the exact frozen methods on the real production paths (see “FINAL TWO-CASE SOURCE-EVIDENCE CLOSURE — 2026-10-10 (P5-01, P5-38)” below). P5-01 now includes real mounted production UI consumers, actual character working selectors, the delayed pre-activation interval and late A continuations; P5-38 now includes the production room-state listeners (`registerAllSocketHandlers` → `room_joined`), the actual client admission continuation (`handleJoinRoom`) and its verified-principal guard in two real tabs. One genuine source defect was reproduced and corrected during the run (defect 12: the production `PrivateProjectionBoundary` could paint one pre-commit frame of the previous owner's private UI during a handoff; corrected with synchronous DOM isolation and a permanent RED→GREEN regression). Canonical classification after this run: **33 PASS / 9 BLOCKED BY ENVIRONMENT / 0 NOT YET VERIFIED / 0 reproduced FAIL**; the P5-01 boundary hardening is an implementation-agent RED→GREEN correction and both closures await final bounded independent source acceptance. The nine environment-blocked cases and the external gates are unchanged.

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

## BOUNDED JOURNAL TIMING CORRECTION — 2026-10-10 (P5-02, P5-03)

Scope: correct exactly the two production timing defects re-blocked by the latest bounded independent review, after P5-04 was independently accepted. No broad audit, no P5-04 reopening, no P6, no unrelated refactor, no commit/push/deployment by the implementation agent. Input witnesses: the reviewer's own real-Chrome harness `D:/AppData/Temp/opencode/p5-journal-independent-acceptance.cjs` and log `p5-journal-independent-acceptance-final.log` (real mounted `PersistenceProvider`, real `useJournalPersistence`, real `shareableStore`/scoped engine/coordinator; Firebase auth/Firestore simulated only at the external boundary).

### Exact defect reproductions (independent witnesses, pre-correction)

- **P5-02 (`PROVIDER_READ_EDIT_RACE`):** A saves a baseline; A→B→A restores it; both production journal cloud reads are held; A authors `NEW UNSENT DURING READ` (dirty:true, local revision 3, durable record retains the marker); releasing the older reads reverted the working journal to the older cloud content, advanced the scoped revision to 4 without the new note, left `recoveryKeys:[]`, and the hydration response was treated as applied.
- **P5-03 (`SAVE_DURING_PRESERVATION`, three modes):** A starts a real save; the coordinator holds `stopNewWork` preservation while the retained scoped owner guard still reports A current (gate scope `u-a`, generation 3, `handoffPending:true`) but the live auth principal is already B. Releasing A's save set shared journal status `saving → saved` on success and `saving → error` + a `Journal save failed` notification on returned and thrown failure; the status persisted after B activation (generation 4).

### Root causes

- **P5-02:** `PersistenceProvider` checks `engine.__isDirty()` only before starting hydration; the sibling production path `shareableStore.hydrateFromCloud` applied the resolved cloud document after its `await` with only an owner-guard check, without re-validating dirty state, pending scoped writes or the local revision. The hook's previously corrected guard could not protect the sibling provider/store path.
- **P5-03:** `useJournalPersistence.saveJournal` required only the captured scoped owner guard after the await. During `stopNewWork` preservation the gate intentionally keeps the old scope/generation current, so the guard still passed while the live principal had already changed; the continuation then mutated the new account's shared status, saved-state reference and notifications.

### Correction (files and functions)

- `vtt-react/src/store/shareableStore.js` → `hydrateFromCloud`: capture the owner-scoped local revision/draft id and dirty/pending/refused state (`loadScopedDraft` plus the real engine accessors) before the cloud read; after the read re-validate the owner guard and compare the same state; any movement or unsynced work refuses hydration (returns `false`, never a successful apply), keeps the authored working state and scoped record, and leaves the cloud copy to the owner's existing sync path. Validation and the `set()` run in one synchronous block, so no edit can interleave between check and apply. The provider's pre-check remains as a fast path, and `AccountJournalManager`'s direct `hydrateFromCloud` caller is covered by the same store fence.
- `vtt-react/src/hooks/useJournalPersistence.js` → `loadJournal`: the same pre-read capture plus post-read revalidation (owner + live principal, dirty/pending/refused, revision/draft-id movement) replaces the previous dirty-only check, so every production journal hydration application honors the same contract.
- `vtt-react/src/hooks/useJournalPersistence.js` → `saveJournal`: `canTouchSharedState()` = captured scoped guard current **and** the live non-guest auth principal still `startedForUid`. All shared mutations (`saving`, `saved`, `lastSavedStateRef`, error status, notifications) require it on success, returned-failure and thrown paths; the legitimate A-owned result object is still returned to its caller, and the in-flight persistence operation is never cancelled.

No new hydration framework, sync engine, storage format or Firebase path. Existing owner guards, account generations, scoped CAS/revision/dirty contract and P5-19 queued-edit behavior are unchanged.

### RED → GREEN

Permanent Jest regressions in `vtt-react/src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js` (real gate/coordinator/scoped engine/shareableStore/status+notification stores; only `persistenceService`, `journalService` and the auth store are controlled doubles):

- **RED (pre-correction working tree):** focused command → **1 suite failed / 1 passed, 4 failed / 12 passed of 16**. Precisely: the store hydration race applied (`hydrateFromCloud` returned `true` and persisted the older cloud state over the newer note); preservation success left status `saved` under live B; returned failure left status `error`; thrown failure left status `error`. Controls passed (clean store hydration, same-owner saved/error).
- **GREEN (post-correction):** same command → **2 suites, 16/16 passed**, including the existing owner-fence suite. Protection controls included: clean store hydration still applies; same-owner save success updates `saved`; same-owner failure reports `error` + notification; clean hook hydration; failed read leaves working state untouched; existing in-flight read/owner fences.

Real Chrome production-path GREEN (`D:/AppData/Temp/opencode/p5-journal-timing-corrections-verify.cjs`, log `p5-journal-timing-corrections.log`; S10 harness compiles the unmodified on-disk modules; Firebase auth/Firestore and socket transport remain narrow-boundary simulations):

- `P5_02_READ_EDIT_RACE_GREEN`: restored baseline `["OLDER CLOUD JOURNAL"]` (dirty:false, generation 5); `before` `["OLDER CLOUD JOURNAL","NEW UNSENT DURING READ"]` dirty:true revision 3; `after` retains `NEW UNSENT DURING READ` in working state and in the durable scoped record, `recoveryKeys:["mythrill:p5:user:u-a:journal.shareable"]`, the cloud baseline kept, and the newer edit pushed forward by the owner's dirty-local sync path (revision 4 carries it; dirty cleared only after acknowledgment).
- `P5_03_SAVE_DURING_PRESERVATION_GREEN` × success/returned-failure/thrown-failure: live `u-b`, gate `u-a` generation 3 `handoffPending:true`; the save result is preserved per mode; status remained `saving` (never `saved`/`error`), `notifications:[]`, working titles intact; A's durable scoped record still contains `A SAVE PAYLOAD` before and after B activation (generation 4, scope `u-b`).
- `JOURNAL_POSITIVE_CONTROLS`: clean cloud hydration, same-owner `saved` status, failed read preserves durable bytes, pending scoped write refuses hook hydration (`local-dirty-preserved`) with the cloud untouched.

### Verification run for this correction

- Focused Jest as above: RED 4/16 failing → GREEN 16/16.
- Directly related suites (`shareableStore`, `waveA_handoff`, `waveB_scopedStoreStorage`, `waveB_scopedConsumer`, `waveB_b1b5Corrections`, `characterPersistence`): **6 suites, 45/45 passed** (no flake this run).
- Targeted ESLint on both changed source files and the regression file: **0 errors**; the only warning (`shareableStore.js:999 no-loop-func`) is identical at `HEAD` and pre-existing. The first lint pass exposed a new `react-hooks/exhaustive-deps` warning introduced by the live-principal closure; it was corrected by adding the stable `useAuthStore` dependency before the final run (final: 0 errors, 1 inherited warning).
- Production build (`craco build`, detached): recorded in BUILD / LINT below.
- Repository-state note: while this correction was in progress external concurrent process(es) committed the working tree (`e14350cd` 20:14:14 +0200, `6c23a9dd` 20:27:36 +0200, author Dj) including the bounded P5-02/P5-03 edits, the regressions and the lint dependency fix, plus unrelated concurrent class/UI work. The implementation agent issued **no** commit, push or deployment. Independent acceptance must account for these external commits.

### Limitations

- Firebase authentication and Firestore remain narrow-boundary simulations; no live-backend claim is made.
- Full React UI rendering was not repeated; the production provider/hook/store continuations, working store and durable scoped records were asserted.
- The corrected cases are implementation-agent RED→GREEN results and are **not** self-classified as independently accepted. P5-04 remains independently accepted PASS and was not reopened. P5-01 and P5-38 remain NOT YET VERIFIED; the nine environment-blocked cases are unchanged.

## FINAL TWO-CASE SOURCE-EVIDENCE CLOSURE — 2026-10-10 (P5-01, P5-38)

Scope: execute the exact frozen methods of the last two NOT YET VERIFIED cases on the real production paths and close the specific evidence gaps identified by the bounded independent review (S10 outstanding note lines and the final two-case brief): P5-01 must use real production auth handoff, registered private stores, actual character working selectors and **mounted relevant private UI consumers**, observed **through the pre-activation interval** (including immediately after the live auth change and before reset/hydration completes); P5-38 must register the **production room-state listeners** (`registerAllSocketHandlers`) and exercise the **actual client admission continuation**, not a manually supplied socket or a standalone guard call. No P6, no unrelated feature work, no commit/push/deployment. One genuine source defect was reproduced and corrected (defect 12).

### Method

New runner `D:/AppData/Temp/opencode/p5-final-verify.cjs` on the extended harness server `p5-final-browser-server.cjs` (derived from the S10 server; it Babel-compiles the **unmodified on-disk production modules** and serves them to system Chrome). Font/icon/routing libraries and two layout libraries (`react-resizable`, `react-draggable` + `clsx`) are resolved at their narrow boundaries; `react-resizable`/`react-draggable` are the real packages from the project's own `node_modules`; JSON data modules are served as data. Only Firebase auth (cross-tab `localStorage` broadcast + deferred `getIdToken`), Firestore (localStorage documents with equality/orderBy query support and per-path/per-query deferred gates) and the socket.io transport (in-page fake wire preserving the production socket API) are virtualized network boundaries. Log: `p5-final-verify.log` (canonical) and `p5-final-verify-run2.log`/`run3.log`; results `p5-final-verify.results.json`.

### P5-01 result (PASS, bounded)

Production entry points exercised: real `authStore.initializeAuth` → `installAuthBootstrapGate` → `coordinateAuthPrincipalChange` with all registered production participants (`initStoreRegistry` → `registerAllScopedStoreHandoffs`: 24 scoped stores, closure hints, character handoff); real `campaignService`, `bookStore`, `shareableStore`, `inventoryStore`, `characterStore` + `characterScopedStorage`; real `loadCharacters` cloud query (Firestore `where`/`orderBy` boundary) and real `setActiveCharacter`; real cloud uploads (`syncToCloud`) under B. Five real production UI consumers (**CharacterManagement, BookManager, PlayerJournalWindow, InventoryWindow, CampaignManager**) were mounted before the transition inside the real `PrivateProjectionBoundary`.

Frozen assertions and evidence:

- A authored all five private-surface families through production actions (`createBook`, `addNote`, `addItem`, scoped roster/pointer, `createCampaign`); every mounted consumer rendered its A marker (per-consumer positive controls, journal Notes surface opened through the real tab control).
- The transition was observed continuously (rAF frames + 8 ms sampler + synchronous hook samples). Canonical run: **150 frames / 258 samples; 22 pre-switch frames all containing A content (positive control); 94 in-window frames with 0 A-content frames; 163 in-window samples**. Immediately-after-auth-change and pre-activation coverage is explicit: in-window samples carry live uid B with `handoffPending:true` while the gate is `retiring`, and the sampler covers both the retired phase and B activation.
- Deliberate delays: a held late handoff participant keeps the gate in `retiring` after every registered production reset completed (post-flush sample asserted: no resolved scope, empty character selectors, empty five surfaces, mounted UI empty); B's cloud books/journal documents and the B `characters` query are gated (B pre-hydration interval asserted A-free); A's books/journal `hydrateFromCloud` and A `loadCharacters` are held and released under B.
- Scoped engine reads during the interval return `NO_ACTIVE_SCOPE`; an interval engine write creates no B record and is not queued; A's scoped records retain all five authored markers through the interval and are **byte-identical across the entire B session** (`interval.rawNow` deep-equal `after-B rawA`).
- Real character working selectors: during the retired interval `characters=[]`, `getActiveCharacter()=null`, `currentCharacterId=null`; under B only `B HERO` (active `B HERO`); under A return only `A HERO`.
- Late A continuations under B: books hydrate returned `false`, journal hydrate returned `false`, and the released A `loadCharacters` installed no A roster; no A cloud content entered B working state or B UI.
- B cloud-upload source: B `syncToCloud` writes contained none of the seven A markers; B documents held B content only; A documents were byte-content-unchanged during the B session.
- Return to A recovered all five authored surfaces; no B content was visible under A.

### P5-01 reproduced source defect and correction (defect 12)

- **RED witness (browser):** with the five real mounted consumers under the production boundary, a real rAF frame was painted during the retired pre-activation interval (`phase: retiring`, `handoffPending: true`, live uid B) showing A's private draft content (`CAMPAIGN OF A` from the mounted CampaignManager's local state) before React committed the boundary fallback. Reproduced 1/95 and 1/128 frames in consecutive runs; the isolated-boundary probe reproduced the same race (boundary commit at +1.5–4 ms vs first BeginFrame).
- **Violated assertion:** P5-01 “No account-A private draft content in B UI … including the pre-hydration interval.”
- **RED regression:** `vtt-react/src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js` (new, permanent) — 3/3 failed before the correction (the rendered private projection was not hidden synchronously when the handoff was marked pending; `retirePrivateScope` likewise).
- **Correction (smallest within the P5 contract):** `vtt-react/src/persistence/PrivateProjectionBoundary.jsx` now keeps its rendered host (`data-p5-private-projection`) and, in the synchronous gate-notification callback, applies inline `display:none` + `aria-hidden="true"` before React's asynchronous fallback commit (and restores `display:contents` on release). The React fallback replacement is unchanged, so the committed tree still removes the children. No gate/coordinator/store/socket redesign.
- **GREEN:** the 3 focused tests pass; the browser scenario passes with **0 A-content frames out of 94 in-window frames** across 4 consecutive runs; the 44-suite/340-test client regression run, lint (0 errors/0 warnings) and the detached production build (exit 0) all pass.

### P5-38 result (PASS, bounded)

Production entry points exercised in two real browser tabs: production `setupSocketConnection` (fresh socket per lifecycle), production `setupAuthChangeHandler` (cross-tab principal change retirement), production `registerAllSocketHandlers` (which registers the real room-state listeners — evidence: both A sockets carried `room_joined`/`room_created`/`player_joined` listeners), room state delivered by firing `room_joined` into the production handler, and the actual client admission continuation `handleJoinRoom` (not a standalone guard).

Frozen assertions and evidence:

- A had an active room/session in both tabs: each production `room_joined` handler accepted the packet (pending room data), and the real `handleJoinRoom` admission installed Room A (server map `SERVER ROOM A` visible in the room projection, multiplayer socket installed, party member admitted, presence bound).
- Cross-tab A→B retired both sockets through the production paths: `isSocketRetired` true, disconnected, **0 listeners**, presence socket null, `gameStore.multiplayerSocket` null, `isInMultiplayer` false, room projection exited, scoped-write suspension released, `SERVER ROOM A` removed, current-room ref cleared, pending join/navigation keys retired.
- Late A `room_joined` on the retired socket: delivered to 0 listeners, no pending room data, no projection change, current room unchanged; re-running `registerAllSocketHandlers` on the retired socket registers nothing (production guard returns a no-op); a manual `connect()` produces no `join_room` re-admission and does not rebind presence or the multiplayer socket.
- Stale A continuations: a held admission continuation (released after B) and a held token-refresh continuation (released after B) both failed to reactivate; the retired socket stayed disconnected.
- B fresh socket through the production auth/socket lifecycle; B's own `room_joined` + `handleJoinRoom` admission installed Room B (`SERVER ROOM B`), presence and gameStore bound to the fresh socket; passing the **retired A socket** to the real `handleJoinRoom` continuation under B was rejected before any mutation (no room change, no projection change) and the production lifetime guard reports the old socket invalid under B while the fresh socket is valid.
- Durable membership: neither tab's outbox contains `leave_room`, `leave_party`, `revoke_membership` or `kick`; client retirement is session-only.

### External boundaries simulated (stated, not waived)

- P5-01: Firebase authentication and Firestore are narrow-boundary simulations; no live authenticated or live-backend claim. The mounted consumers are real production components, but this is the account-page component set in the harness, not the full application shell. Journal content renders through its production portal to `document.body`.
- P5-38: the socket transport is the in-page fake wire; the `room_joined` packet is delivered through the **production listener** but originates from the harness, not a live socket.io server; server-side admission (`roomJoinHandler` server side) is not executed. The real `handleJoinRoom` client continuation and the verified-principal/lifetime guards are executed. No claim of live authenticated end-to-end readiness.
- Neither closure claims deployment readiness; the nine environment-blocked cases and the external gates below are unchanged.

## MOUNTED-INTEGRATION CORRECTION — 2026-10-10 (P5-01, P5-38; second bounded run)

Scope: correct exactly the four independently reproduced failures in the two remaining source-blocked cases (P5-01: portal visibility, character selector exposure, missed boundary activation; P5-38: no fresh socket after handoff), using the actual production composition as the primary witness. No broad audit, no P6, no unrelated refactor, no commit/push/deployment by the implementation agent. The independent reproduction specification is the reviewer's own harnesses and logs (`p5-sol-dom-probes.cjs`, `p5-sol-mounted-socket.cjs`, `p5-sol-boundary-red-native.cjs`, `p5-sol-independent-run.cjs`) plus the retained final-run browser harness (`p5-final-browser-server.cjs`).

### Exact reproductions and corrections

| # | Reproduced failure (independent witness) | Correction (files / functions) | Permanent regression RED → GREEN |
|---|---|---|---|
| 1 | **P5-01 portal leak:** the mounted production `PlayerJournalWindow` renders through `MythrillWindow`'s portal to `document.body`, outside the boundary host. The host became `display:none` but the portal stayed visible (`A NOTE`, `checkVisibility:true`, 1152×704 rect) while the live principal was B and the handoff was pending. | `vtt-react/src/persistence/PrivateProjectionBoundary.jsx` → new `usePrivateWindowIsolation(nodeRef, enabled)` hook (synchronous inline hide on the gate notification + unmount while isolated); `MythrillWindow.jsx` → `privateProjection` prop + `privateIsolated` early return; marked `PlayerJournalWindow`, `CharacterSheetWindow`, `CampaignManagerWindow` (both windows), `LibraryWindow` and Navigation's inventory `MythrillWindow` wrapper; `AccountDashboard.jsx` now wraps its rendered content in the real `PrivateProjectionBoundary` (the production `/account` route previously had no boundary — the integration gap the reviewer flagged). | `MythrillWindow.privateProjection.test.jsx`: RED 1 failed / 1 passed (node `display:""` while B live) → GREEN 2/2, including the control that a non-private dialog is not hidden. |
| 2 | **P5-01 selector exposure:** with the production coordinator `stopNewWork` preservation deliberately held, live principal B, handoff pending, A's retained scope: raw `characters` = `['A HERO']`, `getActiveCharacter()` = `A HERO`, `currentCharacterId` = `c-a`. | `bootstrapPrivacyGate.js` → `isPrivateProjectionIsolated()`; `scopedStoreHandoffs.js` → `installCharacterProjectionIsolation()` (on isolation start: flush pending autosave to the retained owner's scoped record while its scope is still active, then replace the public working projection with the store's initial template); `characterHelpers.js` → `flushCharacterAutoSave()` + tracked pending autosave; `resourceSlice.js` → `getActiveCharacter()` isolation guard; `coreSlice.js` → `loadCharacters` early isolation refusal + post-await cloud guard, `updateCharacter` projection-install fence. A's data is retained in the owner-scoped records (roster + pointer), never in the public projection. | `characterProjectionIsolation.test.js`: RED 1 failed / 1 passed (raw `characters` = `['A HERO']` during the held interval) → GREEN 2/2 (held interval empty; A's scoped roster + pointer retained; B activation sees only B; return to A restores; same-UID logout/login case). |
| 3 | **P5-01 missed activation:** a valid `activatePrivateScope` landing between the boundary's initial render and its passive-effect subscription left the empty fallback through an ordinary parent rerender despite B being active with no handoff pending; only another gate notification restored the UI. | `bootstrapPrivacyGate.js` → cached frozen snapshot (stable identity until change, safe for `useSyncExternalStore`); `PrivateProjectionBoundary.jsx` → gate snapshot consumed through `useSyncExternalStore` (React re-checks after subscribing, so no notification can be missed); the synchronous pre-commit DOM isolation subscription is unchanged. | `PrivateProjectionBoundary.missedActivation.test.js`: RED 1 failed / 1 passed (fallback stuck through rerender) → GREEN 2/2. |
| 4 | **P5-38 mounted lifecycle:** the mounted `MultiplayerApp` created its socket in an effect depending only on `SOCKET_URL`; an A→B handoff retired A's socket and left `lobbySocket`/presence null through parent rerenders — B never reconnected through the production lifecycle (the earlier runner hid this by calling `setupTabSocket('TAB1B')` manually). | `useSocketConnection.js` → `computeEligibleSocketPrincipal()` + `useEligibleSocketPrincipal()` (waits for `whenHandoffIdle`, requires the live principal's scope to be the active, non-pending, non-held gate destination; re-evaluates on auth changes and every gate notification); `MultiplayerApp.jsx` → setup effect now depends on `[SOCKET_URL, eligibleSocketPrincipal]` and disposes A's setup before B's; `setupSocketConnection` cleanup skips `leave_room` for a socket already retired by the principal path (P4 session-retirement distinction). | `useSocketConnection.eligibility.test.js`: RED mounted `MultiplayerApp` setup call count 1 (expected 2) → GREEN 4/4, including the mounted-component test and the held-preservation control (no destination setup while pending). |

### Mounted browser verification (real Chrome; unmodified on-disk production modules)

Runner `D:/AppData/Temp/opencode/p5-corrections-verify.cjs` on the retained harness `p5-final-browser-server.cjs` (Babel-compiles the unmodified on-disk modules; only Firebase auth/Firestore and the socket.io transport are narrow-boundary simulations). Logs `p5-corrections-verify.log` (canonical) and `p5-corrections-verify-run2.log`; results JSONs `p5-corrections-dashboard.results.json`, `p5-corrections-activation.results.json`, `p5-corrections-socket.results.json`. **3/3 scenarios PASS on both consecutive runs.**

1. **Actual AccountDashboard route element + real private consumers + production journal portal** (scenario 1): the real `AccountDashboard` component (the `/account` route element App.jsx renders) mounted with the real `authStore` user and the real `CampaignManager` tab consumer, plus the real production `PlayerJournalWindow` (real portal topology to `document.body`). A authored a campaign, roster (`A HERO`, pointer `c-a`) and journal note through production actions. Evidence: pre-switch A content and journal visible; on the synchronous rAF frame after `signIn('u-b')` the boundary host is `display:none`, the journal portal is `display:none` (`checkVisibility:false`), selectors are `[]`/`null`/`null`, and A's scoped roster/pointer are retained; at the held preservation sample no A marker is visible and the journal stays hidden; after release and B activation the boundary host returns to `display:contents`, B's authored campaign renders, and the journal renders again; returning to A restores the roster, the active character through the production `loadActiveCharacter` path, the pointer record and the campaign.
2. **Activation between render and subscription** (scenario 2): the real boundary mounted while pending, activation performed in a layout effect before the passive subscription: authorized content is present immediately and through an ordinary parent rerender without any further gate notification (`before.contentPresent:true`, `afterRerender.contentPresent:true`).
3. **Mounted production MultiplayerApp** (scenario 3): A's socket admitted Room A through the production `room_joined` listener and the real `handleJoinRoom` continuation (projection active, `SERVER ROOM A`); after `signIn('u-b')` A's socket is retired (`isSocketRetired:true`) with **0 `leave_room` emissions**; a **fresh B socket is created automatically by the mounted component** (new id, connected, production `room_joined` listener registered, presence bound, exactly one replacement socket); B completes the same admission continuation into Room B (`SERVER ROOM B`); a late A `room_joined` on the retired socket restores nothing; an ordinary parent rerender creates no duplicate sockets.

### Independent RED probes re-run against the corrected source

- `p5-sol-dom-probes.cjs` now fails at its own RED assertion `journalVisible === true` (line 59) — the original portal leak no longer reproduces (the probe stops before its selector/activation assertions).
- `p5-sol-mounted-socket.cjs` now fails at its RED assertion `after.lobbySocket === null` (line 75) — actual is a fresh connected socket id; the original missing-B-connection failure no longer reproduces.
- GREEN variant `p5-sol-dom-probes-green.cjs` (same production modules/scenarios, corrected expectations): **2/2 PASS** — portal/selector isolation and the reconciled activation.

### Tests, lint and build

- Focused corrected set: **5 suites, 13/13 tests passed** (`PrivateProjectionBoundary.synchronousIsolation`, `PrivateProjectionBoundary.missedActivation`, `MythrillWindow.privateProjection`, `characterProjectionIsolation`, `useSocketConnection.eligibility`).
- Broader regression run (accepted 44-suite command plus the new window/socket/character suites): **52 suites, 366/366 tests passed** (19.6 s).
- Server suite (`npm test` in `server`): **555 passing, 1 pending** (unchanged; client-only change).
- Targeted ESLint on all changed files: the files changed only for this correction are clean (0 errors, 0 warnings). Remaining findings are pre-existing and byte-identical at `HEAD`: `CampaignManagerWindow.jsx` E24/W7 (verified via `git show HEAD:… | eslint --stdin`), `MultiplayerApp.jsx` 0E/51W (identical at HEAD), and legacy unused-vars/deps warnings in `Navigation.jsx`, `AccountDashboard.jsx`, `MythrillWindow.jsx`, `PlayerJournalWindow.jsx`, `LibraryWindow.jsx`. The two regression files were additionally cleaned of `import/first` and unused-var findings.
- Production build (`craco build`, detached): **Compiled successfully, exit code 0**; log `D:/AppData/Temp/opencode/p5-corrections-build.log`, exit file `p5-corrections-build.exit`.

### Remaining witnessed source defects

None in the four corrected assertions. Observation (not a P5-01 defect): the Firebase roster path in `loadCharacters` does not auto-apply the active pointer; production restores the active character through `loadActiveCharacter` (App/route path), which the mounted witness exercised. The nine environment-blocked cases and the external gates below are unchanged.

### External boundaries simulated (stated, not waived)

Firebase authentication (cross-tab localStorage broadcast, deferred `getIdToken`) and Firestore (localStorage-backed documents/queries) are narrow-boundary simulations; the socket transport is the in-page fake wire (production socket API, production listeners and continuations). The AccountDashboard witness mounts the actual route element and its real consumers; the App-level providers around the route are not part of the mount. No live authenticated, live-backend or deployment claim is made.

### Repository state

An external concurrent process committed the working tree mid-run (`3f58cc05` "Update character sheet, windows, tab overflow, and private projection isolation with tests") which includes the correction sources and the initial regressions; the two regression files carry further uncommitted refinements (import order, unused-var cleanup, the mounted `MultiplayerApp` test). The implementation agent issued **no** commit, push or deployment. The working tree also contains unrelated concurrent UI edits outside this task (App.jsx, RoomLobby.jsx, rules/race components, class icons and styles); none of them was modified by this correction.

### Updated acceptance readiness

Current standings: **31 independently accepted PASS / 2 source-corrected pending bounded independent acceptance (P5-01, P5-38) / 9 BLOCKED BY ENVIRONMENT / 0 currently reproduced FAIL.** The four corrected failures carry implementation-agent RED→GREEN evidence and mounted production-path browser witnesses; they are **not** self-classified as independently accepted. The nine environment-blocked cases, the Java/rules emulator gates and the live-backend/authenticated-socket deployment gates remain unexecuted with the exact blockers listed above.

## SOL P5-01 CHARACTER COMPLETION / RECOVERY CORRECTION — 2026-10-11

### Ownership, scope and source revision

SOL took implementation ownership of the five witnesses in `D:/AppData/Temp/opencode/p5-sol-independent-character-boundaries.cjs`, using the retained independent findings (`project-5-p5-01-character-correction-independent-block-2026-10-11`) and the existing F1/F2 implementation. Scope is P5-01 character completion and recovery. The previously accepted cases retain their existing classifications; P5-38 and P6 were not worked on.

Git base throughout this run: **`ef4082801513ff82630b22bdf88a330600a5397b`**. Corrections are uncommitted changes on top of the pre-existing working tree. Because that tree already contained the preceding character implementation and concurrent unrelated work, the final **exact source** is identified by these SHA-256 hashes (raw on-disk file bytes):

| File, relative to `vtt-react/` | SHA-256 |
|---|---|
| `src/persistence/characterHandoffPreservation.js` | `EB9950459CE0D4D7FCA27244F452CE3EB401366E444E8F09120253CE01CCB910` |
| `src/persistence/characterScopedStorage.js` | `A3859AFFF98D5F7E488FF31567F39CF39C1169E4E2EAB9FF8278F31D7948B894` |
| `src/services/firebase/characterPersistenceService.js` | `0B8F93B8FD0A13444BBC3B0DAC35C2EBF9897D964150D633953AD78510A86CEE` |
| `src/store/characterSlices/coreSlice.js` | `A0A8F946BE54B990A225984FA69BB14ABD88418FF85BE5F6BAA20CAC22D5518C` |
| `src/persistence/__tests__/characterHandoffPreservation.test.js` | `F625A0A483E76AFCEEFE1514059815315EE91EC49FB9F9248BAD0A40A50C7874` |

### Five actual root causes and RED → GREEN evidence

Before modifying production code, the **unmodified retained independent Chrome runner** was executed from `D:/VTT/vtt-react`: it assertion-verified **all five source failures**, plus its passing deferred-cloud-failure control. Permanent contract regressions were then added to the existing production-path character suite and run before correction: **5 failed / 5 original controls passed**. RED test log: `D:/AppData/Temp/opencode/p5-sol-implementation-red.log`. Original Chrome evidence: `p5-sol-independent-<mode>.json` and `p5-sol-independent-character-boundaries.results.json` in that same directory.

| Witness | Actual root cause | RED, reproduced in this run | GREEN, final corrected Chrome run |
|---|---|---|---|
| `late-normal-save` | `updateCharacter` cached `sameOwnerLive` before awaiting Firebase. Its completion used that stale Boolean to reinstall the captured whole A roster under active B. | B's empty roster became `A HERO`; production selection/save then wrote A's lore with `metadata.userId: u-b`. | B's roster stays empty, active pointer stays null, selection finds no A entry, and the cloud document remains owned by `u-a`; no B-attributed A write. |
| `same-uid-late-normal-save` | The cached authorization also bypassed the account-generation boundary; a whole-roster completion replaced a newer same-UID generation's authored successor. | Old-generation ACK replaced `NEW GENERATION EDIT` with the old A note. | Generations differ; working roster, working lore, scoped roster and final cloud retain `NEW GENERATION EDIT`. |
| `deferred-newer-edit` | Deferred and normal saves issued overlapping unconditional replacements; resume selected an old captured roster and retired recovery without revalidating its exact local revision/content. | Newer cloud/scoped content existed before release; the old deferred replacement became the cloud winner and a reload selected it. | Newer work is installed and persisted locally while the predecessor is held. Its cloud publication queues behind the predecessor; final cloud/scoped/working/reloaded content is `NEWER OWNER EDIT`. |
| `stale-owner-marker-clear` | Resume had no post-await authorization fence; `clearScopedNative` resolved the marker key from the **live** B scope instead of the captured A scope/expected marker. | Releasing A deleted B's recovery marker while A's marker remained. | Both captured A and B marker bytes are unchanged by A's stale completion. B's own unsent note is also restored as `B UNSENT`. |
| `marker-write-failure` | `ensureCharacterHandoffPreserved` ignored the required marker-write result after the roster succeeded and cached `{ok:true}`; reset released the hold and the coordinator activated B. | Marker-only storage refusal reported `blocked:false`, activated B and returned A's older baseline, despite raw A roster bytes retaining the unsent note. | Marker refusal reports `character-marker-preservation-STORAGE_ERROR`; handoff is blocked with A's scope retained, working selectors empty and the authored candidate held. Healed retry activates B, then returning A restores/publishes the exact unsent note. |

### Exact production corrections

1. **`store/characterSlices/coreSlice.js` — `updateCharacter` / `loadCharacters`:** authorization is a live predicate over the captured owner context, live principal and isolation state. The authored roster successor is installed before async work; ACKs never reinstall their captured whole roster. Local preservation is awaited under the captured scope kind/context before publication. Every user save establishes a required owner-scoped recovery marker, captures its exact marker and canonical scoped roster bytes, and uses those expectations through the publication and completion checks. Error/status mutation is also owner-fenced. Hydration rejects reads superseded by authored state; pending not-yet-saved working edits remain selected. Resume is conditioned on confirmed preservation, the initiating owner guard and unchanged authored working content.
2. **`services/firebase/characterPersistenceService.js` — `saveCharacter` / `persistCharacter`:** normal and deferred writes share a per-owner/character Promise tail. Tails survive account-generation changes and retire only by exact Promise identity. Queued P5 saves revalidate the supplied owner/source predicate both when admitted and **after the asynchronous backup**, immediately before `updateDoc`. A refused/stale queued save returns false and keeps its recovery source. Failure of a predecessor does not poison a successor.
3. **`persistence/characterHandoffPreservation.js`:** marker writes use the explicit captured owner context and require `OK` plus `persisted:true` before preservation succeeds. Markers retain their existing registered family and IDs, with an additive revision field that distinguishes replacement markers even within the same millisecond. Completion targets the captured owner's exact key and compares both the expected marker bytes and canonical scoped roster bytes (including draft identity/revision/content); only confirmed IDs are retired. Deferred resume chooses the current canonical scoped source, revalidates before/after awaits, keeps markers on failed/stale/changed-source completion, and deduplicates by owner/account generation with exact Promise cleanup.
4. **`persistence/characterScopedStorage.js` — `saveRoster`:** queued baseline lookups, baseline updates and fork preservation use the captured scope key/context throughout, instead of resolving a new account's scope while the write settles.
5. **`persistence/__tests__/characterHandoffPreservation.test.js`:** five permanent boundary regressions plus six focused recovery/ordering controls were added to the five existing F1/F2 controls. The character store/actions, Firebase character service, roster engine, marker mechanism, privacy gate and handoff coordinator are production implementations. Only external Firestore calls, Firebase principal and Storage writes are controlled at their boundaries.

Two additional **same-mechanism preservation-accounting failures** were verified while strengthening recovery assertions, and corrected in the preservation module: a new captured candidate reused a prior `NOTHING_TO_PRESERVE` success (separate focused RED → GREEN), and repeated isolation notifications treated the real template's display name `Character Name` as an authored roster, creating an empty destination record that forced the subsequent real handoff candidate into a stale fork (focused RED → GREEN plus B recovery in the original marker witness). A new candidate now invalidates the prior cached outcome; an empty display template does not create a candidate. These are P5-01 recovery fixes, not additional matrix-case reopenings.

The existing Option 1 owner scopes, account generations, registry, local coordination, character document format and recovery policy are retained. This correction introduces no character cloud CAS, transaction/version schema, conflict UX or P6 design. Serialization is within the existing browser runtime; no cross-tab character conflict-resolution claim is added.

### Exact browser witness re-execution and positive controls

Final GREEN runner: `D:/AppData/Temp/opencode/p5-sol-implementation-browser-green.cjs`. It executes the **same original independent scenario bodies and storage/network fault points**, with corrected-contract assertions. The production modules under test are Babel-compiled unmodified from disk by `p5-final-browser-server.cjs`; no substituted character/store/preservation implementation is used. System Chrome, localStorage and Web Locks are real. Firebase auth and Firestore remain narrow external-boundary simulations; the retained harness's unrelated provider/layout/routing substitutions remain as previously documented.

**Necessary scheduling adjustment, explicitly recorded:** in the same-UID and deferred-newer-edit scenarios, the runner starts the newer production save, inspects its authored/local successor, releases the held predecessor, then awaits the newer ACK. The original script awaited the newer ACK **before** releasing the predecessor, which would deadlock after the serialization correction. It is no longer possible for the newer cloud replacement to be confirmed ahead of its held predecessor. The GREEN runner asserts that ordering protection and the eventual newer cloud winner; it does not substitute save behavior or merely repair the cloud after a stale overwrite. The marker-failure scenario additionally exercises the production healed-storage retry.

- **Five original boundary failures:** **5/5 GREEN**. Per-witness JSONs: `p5-sol-implementation-green-<mode>.json`; summary: `p5-sol-implementation-green-character-boundaries.results.json`.
- **Deferred-cloud-failure/healed-retry control:** **1/1 GREEN**, in the same runner. Marker and exact local note survive failure; healed load publishes the owner's note and retires the marker.
- **Original F1/F2 positive controls:** unchanged retained `p5-sol-final-character-corrected.cjs` → **5/5 GREEN** (`pending-edit`, `delayed-release` held 2400 ms, `failed-preservation`/retry, `same-uid-generation`, `ordinary-save`). Results: `p5-corrected-character.results.json` and `p5-corrected-character-<mode>.json`.
- **Mounted privacy controls:** `p5-sol-dom-probes-green.cjs` → **2/2 GREEN** (portal hidden synchronously; selectors `[]`/null/null while live B has retained A scope; activation reconciles without another notification). Results: `p5-sol-dom-probes-green.results.json`.

### Final regression, lint and build results

The permanent character suite is **16/16 GREEN**: 5 original F1/F2 controls, the 5 failure regressions, and 6 additional controls (deferred cloud failure/retry, newer unsaved authored edit, queued-owner revalidation, exact same-owner replacement marker, new candidate after no-op preservation, default-template repeated isolation).

Final deduplicated related command, run from `D:/VTT/vtt-react` with `CI=true`:

```text
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx
```

**Result: 15 suites / 91 tests passed, 0 failures** (17.251 s). These preserve the relevant character, handoff, scoped-storage, journal, registry, boundary and portal controls. No server source was changed or server acceptance cases reopened. An initial mistyped window-test path produced ENOENT; the corrected final command above passed.

```text
npx --no-install eslint src/persistence/characterHandoffPreservation.js src/persistence/characterScopedStorage.js src/services/firebase/characterPersistenceService.js src/store/characterSlices/coreSlice.js src/persistence/__tests__/characterHandoffPreservation.test.js
```

**Result: 0 errors / 0 warnings.** Targeted `git diff --check` is clean. Production build ran detached with `NODE_OPTIONS=--max-old-space-size=8192`, `CI=true`, redirected output, and delayed-expansion exit capture (`cmd /d /v:on /c`, `npx --no-install craco build ... & echo !ERRORLEVEL! ...`). Final log: **`D:/AppData/Temp/opencode/p5-sol-implementation-final-build.log` — `Compiled successfully.`** Final exit file: **`p5-sol-implementation-final-build.exit` — `0`**. The final build followed the last character source correction. Concurrent book edits briefly interfered with compilation during work; they were left to their owning agent, as requested, and the final checks completed on the live working tree.

### Completion and acceptance boundary

**Remaining demonstrated P5-01 source defects in the executed witnesses: none.** The five failures and the associated recovery-accounting controls are corrected with production-path evidence. Independent acceptance is still outstanding; this report does not classify P5-01 as independently PASS. Earlier five-test F1/F2 success alone was insufficient and is now superseded by these completion/revision/marker regressions. Current readiness remains **32 previously independently accepted cases / 1 corrected case awaiting independent verification / 9 environment-blocked cases**.

**SOL IMPLEMENTATION COMPLETE — FIVE P5-01 FAILURES CORRECTED AND READY FOR INDEPENDENT VERIFICATION.**

## P5-01 CHARACTER HANDOFF PRESERVATION CORRECTION — 2026-10-11 (F1, F2; historical implementation evidence)

Scope: correct exactly the two independently reproduced P5-01 source defects (F1 wrong-owner character upload; F2 failed preservation discards the unsent candidate). No P6, no broad audit, no persistence redesign, no commit/push/deployment by the implementation agent. Source revision used: `ef4082801513ff82630b22bdf88a330600a5397b` (the independent reviewers' recorded HEAD); the correction files are uncommitted working-tree changes and unrelated concurrent working-tree edits were left intact. Input witnesses: the independent reviewers' own runnable artifacts `D:/AppData/Temp/opencode/p5-sol-final-character-acceptance.cjs`, `p5-sol-final-character-pending-edit.json`, `p5-sol-final-character-failed-preservation.json`, `p5-sol-final-character.results.json`.

### F1 RED (pre-correction, exact retained witness re-executed against the pre-fix tree)

- `pending-edit`: `bExposed:true`, `bCloud:true`, `restored:false`; the recorded write log contained `characters/c-a` with `metadata.userId = u-b` and `lore.notes = "A UNSENT CHARACTER pending-edit"`, issued twice (pending flush + unconditional `saveCurrentCharacter`). Returning to A left the cloud query empty for A (`metadata.userId` had been rewritten to B) and the working store without the unsent edit.
- Focused Jest RED (`src/persistence/__tests__/characterHandoffPreservation.test.js`, new, permanent): **4 failed / 1 passed** pre-correction. Failed witnesses: the u-b-attributed write with the A marker during the held handoff; the deferred-publication record absent; the failed-preservation scenario activated B and reported success; the same-UID generation change lost the unsent edit on return. The ordinary same-owner save control passed (no regression intended).

### F1 root cause

`isolateCharacterWorkingProjection` (`scopedStoreHandoffs.js`) flushed the pending debounce *and* unconditionally called `saveCurrentCharacter()`, so the save ran twice; `updateCharacter` (`coreSlice.js`) derived the save owner from `getCurrentUserId()` — the *live* principal B — and issued the cloud write before the owner-scoped roster write; and `loadCharacters`' cloud hydration had no owner-scoped dirty/unsent reconciliation, so returning to A discarded the only local copy. The isolated working selectors were already hidden (accepted P5-01 correction), but the authored payload still reached B through the save pipeline.

### F1 correction (exact files/functions)

- `vtt-react/src/persistence/characterHandoffPreservation.js` (new): `captureCharacterHandoffCandidate` (stable authored snapshot + immutable owner context/generation, captured before any destructive clear), `ensureCharacterHandoffPreserved`, `getCharacterHandoffPreservationOutcome`, `clearCharacterHandoffPreservation`, `readCharacterDeferredPublication` / `markCharacterDeferredPublication` / `clearCharacterDeferredPublication`, `mergeRetainedCharacterCandidate`, `resumeDeferredCharacterPublication`.
- `vtt-react/src/persistence/scopedStoreHandoffs.js`: `isolateCharacterWorkingProjection` now captures the candidate and discards the debounce (instead of flushing + re-saving) before clearing the projection; the character participant's `stopNewWork` awaits the real preservation outcome; `resetProjection` releases the retained candidate only after a successful transition.
- `vtt-react/src/store/characterSlices/coreSlice.js`: `updateCharacter` captures the immutable origin owner context (explicit origin or live retained scope) and never re-attributes the payload to the live principal; the owner-scoped roster write runs **first**, before network work; cloud publication requires the live principal to derive to the same owner scope, a current captured context, no isolation and non-guest; when deferred, a durable owner-scoped deferred-publication marker is recorded only after the local write is confirmed; the working-projection install is fenced by the same-owner/current-context/isolation check. `saveCurrentCharacter` assembles the canonical payload through the shared helper and returns the save promise. `loadCharacters` merges the owner's retained candidates over the freshly loaded roster (cloud and scoped branches) and resumes publication under the authorized owner only.
- `vtt-react/src/store/characterHelpers.js`: `triggerCharacterAutoSave` captures the origin owner context at scheduling time; `consumeCharacterAutoSaveOriginContext`/`peekCharacterAutoSaveOriginContext`; `discardCharacterAutoSave`; shared `readInventoryWorkingData`/`assembleCharacterWorkingData`.
- `vtt-react/src/persistence/characterScopedStorage.js`: `saveRoster(isGuest, characters, options)` accepts the captured explicit owner context and enforces it through the existing coordination primitives.
- `vtt-react/src/persistence/privateStorageRegistry.js`: new registered family `character.deferredPublication` (family-native, owner-scoped, registry-classified; added to the frozen family-id list per the registry's exact-coverage contract).

### F2 RED (pre-correction, exact retained witness re-executed against the pre-fix tree)

- `failed-preservation`: authoring the unsent edit, refusing every marker-bearing storage write, then A→B produced `underB` gate scope `u-b` (destination activated despite the refused preservation), `restored:false`, `retainedKeys:[]` — no durable or in-memory recovery retained the edit; returning to A restored only `A BASELINE`.
- The focused Jest F2 witness failed pre-correction at the fail-closed assertion (gate activated B) and the honest-report assertion; after the correction both pass and a healed-storage retry preserves the candidate.

### F2 root cause

The isolation callback ignored the actual roster/offline write results, cleared the working projection anyway, and the character participant returned an unconditional `{ ok: true }` from `stopNewWork`. The coordinator therefore had no failure to act on and activated the destination, destroying the only remaining copy of the authored edit.

### F2 correction (fail closed, honest reporting, retry)

- The candidate is captured **before** the destructive clear and before the pending debounce is dropped; the retention hold is module-scoped and is never exposed through working selectors.
- The preservation write is awaited and its real status inspected (`OK` / `FORKED` / stale-with-fork are confirmed; anything else is a failure). An invoked or queued save is never treated as confirmed preservation.
- On failure the character `stopNewWork` returns `{ ok: false, reason: ... }`, so the coordinator's existing preservation-only path keeps the retained owner's scope active with `handoffPending: true` (private UI isolated, no destination activation), records the failure in `lastResult.failures`, and leaves `retryPendingHandoff()` as the recoverable retry path. A later retry re-attempts preservation from the retained candidate and only then proceeds.
- The durable deferred-publication marker is written only after the roster write is confirmed, so no success is claimed without a durable record; the offline cache is supplementary and best-effort.
- Returning the correct owner merges the retained candidate over the stale baseline (durable marker and/or memory hold) and resumes cloud publication under that owner's identity; the marker is cleared only after every publication is confirmed. Memory-only retention is a hold, never claimed as restart-safe recovery.

### Owner identity at each persistence boundary

| Boundary | Owner identity used |
|---|---|
| Debounced autosave origin | Gate context captured when the save was scheduled (origin scope + generation) |
| Owner-scoped roster write | Retained owner's explicit captured context (A), revalidated by `writeWithCoordination`; never the live principal |
| Cloud publication | Live principal only when it derives to the same owner scope and the captured context is current, not isolated, non-guest, Firebase configured |
| Deferred-publication marker | Owner-scoped (A) native record under the retained scope |
| Restore merge | Active owner scope only; candidate ids limited to the marker/hold |
| Resume publication | `captureOwnerGuard(owner)` revalidated before each write; marker cleared only after all confirmations |
| Late A continuations after B | Refused: context-current + isolation fence blocks install and publication |

### How immediate privacy isolation and async preservation coexist

The gate notification still runs synchronously inside `markHandoffPending(true)`: the authored snapshot is captured first, the pending debounce is discarded, preservation is started, and the public working projection is replaced with the store template in the same synchronous turn (selectors expose nothing to the new principal immediately). Preservation itself is asynchronous; the participant's `stopNewWork` awaits its real outcome before the coordinator may retire the old scope and activate the destination. Privacy isolation and data preservation are therefore separate requirements: isolation is synchronous and unconditional, while the destructive transition waits for confirmed preservation or fails closed.

### Duplicate-save prevention

The isolation callback no longer flushes-and-re-saves; it captures the authored state once and preserves it once. The pending debounce is discarded because its payload is inside the captured snapshot. During the held handoff the browser witness records **zero** cloud writes for `characters/c-a`; the deferred payload reaches the owner's cloud only once, after the owner returns. Concurrent resumes (activation hook plus explicit load) share one in-flight publication (`publicationInFlight`), so no duplicate publication is issued. Observation (not a defect): the pre-existing `ensureClassStarterSpells` activation path may issue one additional same-owner-authorized save of current content when a character is activated; this exists at `HEAD` and is unrelated to the handoff isolation.

### GREEN — focused browser and test evidence

- **Focused Jest (new permanent suite):** RED 4 failed / 1 passed → **GREEN 5/5** (`vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js`), covering F1 handoff, duplicate prevention, F2 fail-closed/retry, same-UID generation change and the ordinary same-owner save control.
- **Real-Chrome production-path runner:** `D:/AppData/Temp/opencode/p5-sol-final-character-corrected.cjs` (adapted from the retained independent witness; same harness server `p5-final-browser-server.cjs`, real authStore→gate→coordinator, real character store + autosave lifecycle, real scoped records, Firebase virtualized at the narrow boundary only) → **5/5 PASS**: `pending-edit`, `delayed-release` (held past the 2 s debounce — no late save), `failed-preservation`, `same-uid-generation`, `ordinary-save`. Results JSON `p5-corrected-character.results.json`, per-scenario evidence `p5-corrected-character-<mode>.json`.
- **Retained RED witness re-executed:** `p5-sol-final-character-acceptance.cjs` now fails its own reproduction assertion (`bExposed:false`, `bCloud:false`, `restored:true`) and `failed-preservation` (re-run in isolation) fails its destructive-activation assertion (`gate scope u-a`, `bCloud:false`, `restored:true`) — neither defect reproduces.
- **Directly related suites:** `characterHandoffPreservation`, `characterProjectionIsolation`, `waveB_characterRosterIsolation`, `waveA_handoff`, `waveB_scopedStoreStorage`, `waveB_scopedConsumer`, `waveB_b1b5Corrections`, `characterPersistence.test`, `registry`, `PrivateProjectionBoundary.*`, `MythrillWindow.privateProjection`, `useSocketConnection.eligibility` → **13 suites, 63/63 passed**.
- **Deduplicated regression run** (the accepted 44-suite command plus the new suite): **47 suites, 349/349 passed** (21.4 s). No server source was changed; the server suite was not re-run for that reason.
- **Lint:** `npx eslint` on all seven changed/added files → **0 errors, 0 warnings**.
- **Production build:** detached `craco build` → recorded in BUILD / LINT below.

### External boundaries simulated (stated, not waived)

Firebase authentication (cross-tab localStorage broadcast, deferred `getIdToken`) and Firestore (localStorage-backed documents/queries) remain narrow-boundary simulations; no live-backend or deployment claim is made. The deferred marker is written only for verified user scopes; the multi-tab stale-fork recovery of a concurrent handoff writer remains durable in the fork record but is not auto-merged on return (single-tab handoff scenarios are the reproduced defect scope).

### Remaining demonstrated source failure

None in either corrected assertion. The observation above about `ensureClassStarterSpells` is inherited `HEAD` behavior, same-owner authorized, and not a P5-01 defect. P5-38 remains independently accepted and was not touched. The nine environment-blocked cases (P5-05, 07, 09, 10, 11, 12, 13, 31, 32) and the Java/rules-emulator and live-backend deployment gates are unchanged.

### Final P5 acceptance readiness

P5-01 now carries a bounded implementation correction with permanent RED→GREEN regressions, real-Chrome production-path evidence for both exact failures, and the retained independent witnesses no longer reproducing. It is **not** self-classified as independently accepted: single-case bounded independent acceptance remains outstanding. Current standings after this run: **32 independently accepted PASS (including P5-38) / 1 source-corrected pending single-case independent acceptance (P5-01) / 9 BLOCKED BY ENVIRONMENT / 0 currently reproduced FAIL.**

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
- Bounded journal timing correction (2026-10-10, final), working directory `vtt-react`: `node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --silent --testPathPattern "hooks/__tests__/useJournalPersistence"` → RED **4 failed / 12 passed of 16** pre-correction (`p5-timing-red.log`), GREEN **2 suites, 16/16 passed** (`p5-timing-green.log`, `p5-timing-green2.log`). Directly related set (`shareableStore`, `waveA_handoff`, `waveB_scopedStoreStorage`, `waveB_scopedConsumer`, `waveB_b1b5Corrections`, `characterPersistence`) → **6 suites, 45/45 passed** (`p5-timing-related.log`).
- Bounded journal timing correction browser: `node D:/AppData/Temp/opencode/p5-journal-timing-corrections-verify.cjs` (workdir `vtt-react`) → **5/5 production-path scenarios passed** (`P5_02_READ_EDIT_RACE_GREEN`, `P5_03_SAVE_DURING_PRESERVATION_GREEN` × success/returned/throw, `JOURNAL_POSITIVE_CONTROLS`); log `D:/AppData/Temp/opencode/p5-journal-timing-corrections.log`; same S10 harness boundaries.
- Final two-case closure (2026-10-10), working directory `vtt-react`: `node D:/AppData/Temp/opencode/p5-final-verify.cjs` → **2/2 production-path scenarios passed** (`P5-01`, `P5-38`); canonical log `p5-final-verify.log` (P5-01 observation line: frames total 150 / in-window 94 / pre-window 22 / **violations 0** / samples 258; P5-38 evidence line: both tabs carry production room listeners and retire, late-packet listeners 0, B fresh socket admitted and old A socket rejected); stability reruns `p5-final-verify-run2.log` and `p5-final-verify-run3.log` also PASS. Runner `p5-final-verify.cjs`; server `p5-final-browser-server.cjs`.
- Final two-case focused boundary regression: `node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --silent --testPathPattern "PrivateProjectionBoundary.synchronousIsolation"` → RED pre-correction **3/3 failed**, GREEN **3/3 passed**.
- Final two-case directly related set (`PrivateProjectionBoundary|waveA_blockerCorrections|waveB_r1r4Corrections|waveA_handoff|waveB_scopedConsumer`): **5 suites, 48 tests passed**.
- Final two-case deduplicated client run (accepted 42-suite command plus the new boundary suite): **44 suites, 340 tests passed** (27.2 s).
- Final two-case server suite (`npm test` in `server`): **555 passing, 1 pending** (unchanged; client-only change).
- Rules runner: blocked, no scenario PASS.
- P5-01 character handoff preservation correction (2026-10-11), working directory `vtt-react`:
  - Focused new suite: `node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --silent --testPathPattern "characterHandoffPreservation"` → RED pre-correction **4 failed / 1 passed** → GREEN **1 suite, 5/5 passed**.
  - Directly related set (`characterHandoffPreservation|characterProjectionIsolation|waveB_characterRosterIsolation|waveA_handoff|waveB_scopedStoreStorage|waveB_scopedConsumer|waveB_b1b5Corrections|characterPersistence.test|persistence/__tests__/registry|PrivateProjectionBoundary|MythrillWindow.privateProjection|useSocketConnection.eligibility`): **13 suites, 63/63 passed**.
  - Deduplicated accepted run plus the new suite: **47 suites, 349/349 passed** (21.4 s).
  - Real-Chrome production-path runner: `node D:/AppData/Temp/opencode/p5-sol-final-character-corrected.cjs` → **5/5 scenarios PASS** (`pending-edit`, `delayed-release`, `failed-preservation`, `same-uid-generation`, `ordinary-save`); results `D:/AppData/Temp/opencode/p5-corrected-character.results.json`, evidence `D:/AppData/Temp/opencode/p5-corrected-character-<mode>.json`.
  - Retained independent RED witnesses re-executed: `p5-sol-final-character-acceptance.cjs` fails its reproduction assertion (`bExposed:false`, `bCloud:false`, `restored:true`); `p5-sol-final-character-failedmode-check.cjs` fails the destructive-activation assertion (`gate scope u-a`, `bCloud:false`, `restored:true`).
  - Targeted lint on all seven changed/added files: **0 errors, 0 warnings**.
  - Detached production build: recorded in BUILD / LINT (2026-10-11).

## BUILD / LINT

- Frontend production build via `npm run build` (`craco build`, detached): **compiled successfully, exit code 0** on the S10 source (which includes the owner-fence fix). Log: `D:/AppData/Temp/opencode/wavec-s10-build.log`; exit file `wavec-s10-build.exit`. The earlier 2026-10-09 build (`wavec-final-build.log`) remains the pre-fix baseline. Interrupted attempts are not counted as build success; earlier attempts through the wrong runner are not counted.
- Targeted S8 lint (new resolver, conversion modules, registry, campaign service and both new test suites): zero errors/warnings on the final check.
- S10 lint: `eslint src/hooks/useJournalPersistence.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js` → 0 errors, 0 warnings.
- Bounded journal timing correction lint (2026-10-10, final): `npx eslint src/store/shareableStore.js src/hooks/useJournalPersistence.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js` → **0 errors, 1 warning**; the warning (`shareableStore.js:999 no-loop-func`) is byte-identical at `HEAD` (pre-existing, verified via `git show HEAD:... | eslint --stdin`). The interim `react-hooks/exhaustive-deps` warning introduced by the live-principal closure was fixed before the final run.
- Bounded journal timing correction build: detached `craco build` → **Compiled successfully, exit code 0**; log `D:/AppData/Temp/opencode/p5-journal-timing-build.log`, exit file `D:/AppData/Temp/opencode/p5-journal-timing-build.exit`.
- Final two-case lint (2026-10-10): `npx eslint src/persistence/PrivateProjectionBoundary.jsx src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js` → **0 errors, 0 warnings**.
- Final two-case build: detached `craco build` → **Compiled successfully, exit code 0**; log `D:/AppData/Temp/opencode/p5-final-build.log`, exit file `D:/AppData/Temp/opencode/p5-final-build.exit`.
- P5-01 character handoff preservation correction (2026-10-11): targeted lint on all seven changed/added files (`characterHandoffPreservation.js`, `scopedStoreHandoffs.js`, `characterScopedStorage.js`, `privateStorageRegistry.js`, `characterHelpers.js`, `coreSlice.js`, `characterHandoffPreservation.test.js`) → **0 errors, 0 warnings** (one interim `no-unused-vars` on `coreSlice.js:711` was removed before the final run). Detached `craco build` on the final source state (which includes the last defensive `getStore` guard) → **Compiled successfully, exit code 0**; log `D:/AppData/Temp/opencode/p5-char-preservation-build2.log`, exit file `D:/AppData/Temp/opencode/p5-char-preservation-build2.exit` (the earlier `p5-char-preservation-build.log`/`.exit` also compiled successfully and is superseded by the final run).
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

Bounded journal timing correction changes (2026-10-10, final; P5-02 and P5-03 only; P5-04 untouched):

- `vtt-react/src/store/shareableStore.js` (`hydrateFromCloud` owner-scoped revision/dirty/pending/refused hydration fence, mirroring the accepted `bookStore` B5B contract).
- `vtt-react/src/hooks/useJournalPersistence.js` (`loadJournal` pre-read local capture + post-read revision/dirty revalidation; `saveJournal` live-principal/generation check alongside the scoped guard before all shared UI mutations; `useAuthStore` dependency added to the save callback).
- `vtt-react/src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js` (new permanent store-continuation race regression, preservation-window success/returned/throw regressions and same-owner controls; 7 new tests, 16 total in the file).
- This report/matrix.
- Temporary verification artifacts only (not application code): `D:/AppData/Temp/opencode/p5-journal-timing-corrections-verify.cjs`, `p5-journal-timing-corrections.log`, `p5-timing-red.log`, `p5-timing-green.log`, `p5-timing-green2.log`, `p5-timing-related.log`, `p5-timing-lint.log`, `p5-timing-lint2.log`, `p5-journal-timing-build.log`, `p5-journal-timing-build.exit`.
- External commit note as recorded in the timing-correction section (`e14350cd`): the implementation agent issued no commit/push/deployment.

Final two-case closure changes (2026-10-10; P5-01 source correction, P5-38 verification only):

- `vtt-react/src/persistence/PrivateProjectionBoundary.jsx` (defect 12: synchronous inline isolation of the rendered private projection on the gate-notification call, before React's asynchronous fallback commit; restored to `display:contents` on release; the React fallback replacement is unchanged).
- `vtt-react/src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js` (new, permanent; RED→GREEN focused regressions for synchronous hide/restore and the retiring phase).
- This report/matrix.
- Temporary verification artifacts only (not application code): `D:/AppData/Temp/opencode/p5-final-browser-server.cjs`, `p5-final-verify.cjs`, `p5-final-verify.log`, `p5-final-verify-run2.log`, `p5-final-verify-run3.log`, `p5-final-verify.results.json`, `p5-final-build.log`, `p5-final-build.exit`, and the diagnostic probes `p5-final-dep-probe.cjs`, `p5-ui-probe.cjs`, `p5-journal-probe.cjs`, `p5-boundary-probe.cjs`, `p5-commit-probe.cjs`.
- Repository-state note: the working tree also contained external concurrent edits outside this task (character-sheet/window style work: `CharacterViewPage.jsx`, `CharacterPanel.jsx`, `CharacterSheetWindow.jsx`, `Lore.jsx`, `SpellAoE.css`, `GlobalChatWindow.jsx`, `DraggableWindow.jsx`, `LibraryWindow.jsx`, `MythrillWindow.jsx`, `MythrillWindow.test.jsx`, `adventurer-windows.css`, `character-sheet.css` and new untracked style/test files). The implementation agent changed only the two files listed above; the verification run compiled the on-disk working tree as-is.
- The implementation agent issued **no** commit, push or deployment.

Mounted-integration correction changes (2026-10-10, second bounded run; P5-01 and P5-38):

- `vtt-react/src/persistence/bootstrapPrivacyGate.js` (cached frozen snapshot for `useSyncExternalStore`; `isPrivateProjectionIsolated()`).
- `vtt-react/src/persistence/PrivateProjectionBoundary.jsx` (`useSyncExternalStore` gate consumption; `usePrivateWindowIsolation` hook for portal-mounted private windows; synchronous isolation unchanged).
- `vtt-react/src/persistence/scopedStoreHandoffs.js` (`installCharacterProjectionIsolation()`/`resetCharacterProjectionIsolationForTests()`; registration from `registerCharacterHandoff`).
- `vtt-react/src/store/characterHelpers.js` (`flushCharacterAutoSave()` + tracked pending autosave).
- `vtt-react/src/store/characterSlices/resourceSlice.js` (`getActiveCharacter` isolation guard).
- `vtt-react/src/store/characterSlices/coreSlice.js` (`loadCharacters` isolation refusal + post-await guard; `updateCharacter` projection-install fence).
- `vtt-react/src/components/multiplayer/useSocketConnection.js` (`computeEligibleSocketPrincipal`, `useEligibleSocketPrincipal`; retired-socket `leave_room` guard in cleanup).
- `vtt-react/src/components/multiplayer/MultiplayerApp.jsx` (setup effect depends on the eligible principal).
- `vtt-react/src/components/windows/MythrillWindow.jsx` (`privateProjection` prop + isolation early return).
- `vtt-react/src/components/windows/PlayerJournalWindow.jsx`, `vtt-react/src/components/character-sheet/CharacterSheetWindow.jsx`, `vtt-react/src/components/windows/CampaignManagerWindow.jsx`, `vtt-react/src/components/windows/LibraryWindow.jsx`, `vtt-react/src/components/Navigation.jsx` (mark the private windows).
- `vtt-react/src/components/account/AccountDashboard.jsx` (production `/account` route content wrapped in the real `PrivateProjectionBoundary`).
- New permanent regressions: `vtt-react/src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js`, `vtt-react/src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx`, `vtt-react/src/persistence/__tests__/characterProjectionIsolation.test.js`, `vtt-react/src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js`.
- This report/matrix.
- Temporary verification artifacts only (not application code): `D:/AppData/Temp/opencode/p5-corrections-verify.cjs`, `p5-corrections-verify.log`, `p5-corrections-verify-run2.log`, `p5-corrections-dashboard.results.json`, `p5-corrections-activation.results.json`, `p5-corrections-socket.results.json`, `p5-corrections.results.json`, `p5-sol-dom-probes-green.cjs`, `p5-sol-dom-probes-green.log`, `p5-sol-dom-probes-postfix.log`, `p5-sol-mounted-socket-postfix.log`, `p5-corrections-build.log`, `p5-corrections-build.exit`, `p5-corrections-lint.json`, `p5-corrections-lint2.json`, `CMW-head-lint.json`, `MPA-head-lint.json`.

P5-01 character handoff preservation correction changes (2026-10-11; F1 and F2, uncommitted working-tree edits on `ef4082801513ff82630b22bdf88a330600a5397b`):

- `vtt-react/src/persistence/characterHandoffPreservation.js` (new: candidate capture/preservation, deferred-publication marker, retained-candidate merge, publication resume).
- `vtt-react/src/persistence/scopedStoreHandoffs.js` (isolation capture/discard/no-double-save; fail-closed `stopNewWork`; hold release on successful reset).
- `vtt-react/src/persistence/characterScopedStorage.js` (`saveRoster` explicit captured owner context).
- `vtt-react/src/persistence/privateStorageRegistry.js` (new `character.deferredPublication` family + frozen-id coverage).
- `vtt-react/src/store/characterHelpers.js` (autosave origin capture, discard, shared working-data assembly).
- `vtt-react/src/store/characterSlices/coreSlice.js` (`updateCharacter` origin-owner/fence/local-first pipeline; `saveCurrentCharacter` shared payload + promise; `loadCharacters` retained-candidate merge + resume).
- `vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js` (new permanent focused regressions).
- This report/matrix.
- Temporary verification artifacts only (not application code): `D:/AppData/Temp/opencode/p5-sol-final-character-corrected.cjs`, `p5-corrected-character.results.json`, `p5-corrected-character-<mode>.json`, `p5-sol-final-character-failedmode-check.cjs`, `make-failedmode-check.cjs`, `p5-char-preservation-build.log`, `p5-char-preservation-build.exit`, `p5-char-preservation-build2.log`, `p5-char-preservation-build2.exit`.

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
10. **P5-02 (2026-10-10 final timing correction):** the provider/store hydration continuation applied an older cloud journal after its dirty pre-check, destroying a newer unsent edit in working state and in the durable scoped record with no recovery retained. RED witness: independent `PROVIDER_READ_EDIT_RACE` (`p5-journal-independent-acceptance-final.log`) plus focused Jest RED (the store continuation returned `true` after clobbering). Correction: `shareableStore.hydrateFromCloud` captures and re-validates the owner-scoped revision/draft-id and dirty/pending/refused state around the read and refuses to apply changed or unsynced local work (returns `false`; validation + `set()` in one synchronous block); `useJournalPersistence.loadJournal` applies the same pre-read capture + post-read revalidation. GREEN: Jest 16/16, real-Chrome `P5_02_READ_EDIT_RACE_GREEN` (working and durable records retain `NEW UNSENT DURING READ`; the newer edit reached the cloud only through the owner's sync path), lint 0 errors, detached build exit 0.
11. **P5-03 (2026-10-10 final timing correction):** an old owner's save completion mutated the live account's shared journal status/notifications during coordinator `stopNewWork` preservation, because the retained scoped guard is intentionally still current while the live principal changed. RED witness: independent `SAVE_DURING_PRESERVATION` success/returned/throw plus focused Jest RED (`saved`/`error` applied under live B). Correction: `saveJournal` requires `canTouchSharedState()` — current scoped guard AND live non-guest principal equal to the captured owner — before any status/saved-reference/notification mutation on success, returned failure and thrown paths, while still returning A's honest result and never cancelling A-owned persistence. GREEN: Jest 16/16, real-Chrome `P5_03_SAVE_DURING_PRESERVATION_GREEN` × 3 (status stays `saving`, zero notifications, A durable record intact through B activation).
12. **P5-01 (2026-10-10 final two-case closure): the production `PrivateProjectionBoundary` hid private projections only through React's asynchronous re-render, so a real browser painted one pre-commit frame of the previous owner's private UI content during the A→B retirement interval** (mounted CampaignManager local state rendered `CAMPAIGN OF A` while the live principal was already B and the gate was `retiring`). RED witness: the final two-case browser run (1/95 and 1/128 in-window rAF frames) plus the focused RED regression `PrivateProjectionBoundary.synchronousIsolation.test.js` (3/3 failed pre-correction). Correction: the boundary now applies synchronous inline isolation (`display:none` + `aria-hidden`) to its rendered host inside the gate-notification call, before React commits the fallback (restored to `display:contents` on release); no gate/coordinator/store/socket change. GREEN: 3/3 focused tests, browser scenario 0 A-content frames across 4 runs, 44 suites/340 client tests, lint 0 errors/0 warnings, detached production build exit 0.

Additional S8 implementation safeguards exercised by the passing suites: queued local persistence serialization, stale edit/owner checks, refusal retention, verified cloud reads before cloud continuation, preserved expected baseline after reload and newer local working-candidate selection after refused publication. These are not presented as independently witnessed RED→GREEN defects where no separate pre-fix witness was recorded.

13. **P5-01 F1 (2026-10-11 final character correction): a pending unsent character edit was uploaded under the destination account's identity.** The handoff isolation flushed the debounce *and* re-saved, and `updateCharacter` derived the save owner from the live principal B, writing `characters/c-a` with `metadata.userId = u-b` and A's unsent lore; B's cloud query then installed A's character into B's working roster, and returning to A could not restore the edit. RED witnesses: the retained independent browser witness (`bExposed:true`, `bCloud:true`, `restored:false`, marker write ×2 with `u-b`) plus focused Jest RED (4 failed / 1 passed). Correction: immutable origin owner/generation capture; owner-scoped roster write first under the retained context; cloud publication fenced to the authorized same-owner live principal; deferred-publication marker; owner-scoped merge on return and owner-authorized publication resume. GREEN: focused Jest 5/5, real-Chrome `pending-edit` + `delayed-release` (zero cloud writes in the handoff window), retained witness no longer reproduces.
14. **P5-01 F2 (2026-10-11 final character correction): failed preservation destroyed the unsent candidate and the destination still activated.** The isolation callback ignored refused roster/offline writes, cleared the projection, and `stopNewWork` returned `{ ok: true }`, so the coordinator activated B while the only copy of the edit was gone (`retainedKeys:[]`). RED witnesses: the retained independent browser witness (`underB` gate scope `u-b`, `restored:false`) plus the focused Jest fail-closed witness. Correction: candidate captured before the destructive clear, awaited/inspected real preservation outcome, honest `{ ok: false }` on failure (coordinator preservation-only hold), retry path from the retained candidate, confirmed durable record before any success claim, exact edit restored on owner return. GREEN: focused Jest 5/5, real-Chrome `failed-preservation` (fail-closed gate, reported failure, healed-storage retry, exact restoration), retained witness no longer reproduces the destructive activation.

**2026-10-10 S9 run: no new source defect was demonstrated.** All failures observed while building the S9C browser scenarios were harness defects corrected inside the temporary harness; no production module failed its assertion and no application source was modified.

## UNVERIFIED RELEASE GATES

Source-acceptance gates remaining:

1. **P5-32 only:** one browser→real-P3-stack conversion/checkpoint/restart sequence with isolated durable backing. Blocker: no isolated durable Firestore backend on this machine (`java -version` unavailable; emulator cannot spawn). Production data must not be used.

Deployment / environment gates explicitly listed (not silently waived):

2. Java + `@firebase/rules-unit-testing` prerequisites, execution of all 18 effective-rule scenarios.
3. Additional emulator transaction scenarios beyond the 18: real transaction retry (P5-10), expected-ABSENT creation race (P5-11), delete/recreate epoch fence (P5-12), size refusal (P5-31), real concurrent two-tab save (P5-09), emulator read classification (P5-05).
4. Full authenticated application UI flows against real Firebase auth/sockets and live-Firebase reconciliation. The S10 and final two-case production-path flows still virtualize the Firebase auth/firestore and socket transport boundaries; P5-38 now executes the production `registerAllSocketHandlers` room-state listeners and the real client `handleJoinRoom` admission continuation, but the server-driven `room_joined` round trip against a live socket.io server is still not executed.
5. Existing whole-file CampaignManager lint errors (inherited, identical at HEAD; disposition recorded in the S9 section) and the environment-conditional pending server test.

## P5 SOURCE ACCEPTANCE READINESS

Current standings after the 2026-10-10 final two-case source-evidence closure: **33 PASS (P5-01 and P5-38 now included) / 9 BLOCKED BY ENVIRONMENT / 0 NOT YET VERIFIED / 0 reproduced FAIL**. P5-01 and P5-38 carry direct production-path browser evidence for their exact frozen methods (see the final two-case section): real mounted production UI consumers, actual character working selectors, continuous frame/sample observation through the delayed pre-activation interval and late A continuations for P5-01; the production room-state listeners, both real admission continuations and the retired-socket/late-packet/stale-continuation sequence for P5-38. One genuine source defect was reproduced and corrected in this run (defect 12, synchronous boundary isolation); the correction carries an implementation RED→GREEN focused regression and is **not** self-classified as independently accepted. The earlier corrected cases (P5-02, P5-03) and the P5-01 boundary hardening remain the only items awaiting bounded independent acceptance; P5-04, P5-19, P5-20, P5-21 and P5-36 remain independently accepted PASS; the S8 source and focused regressions are implemented; the locked server suites, the deduplicated client run and the bounded browser suites pass.

Bounded independent acceptance of the final closure (including defect 12) can proceed against this record. It cannot be represented as deployment readiness: P5-32's real durable P3 round trip, the nine environment-blocked cases, the Java/rules emulator gates and the live-backend/authenticated-socket deployment gates above remain unexecuted with the exact blockers listed.

**P5-01/38 VERIFIED — READY FOR FINAL BOUNDED INDEPENDENT SOURCE ACCEPTANCE.** EXTERNAL DEPLOYMENT GATES REMAIN.

**Superseded by the latest independent verdict and the second bounded mounted-integration correction (2026-10-10):** the final bounded independent review corrected this record to **31 independently accepted PASS / 9 environment-blocked / 2 source BLOCK with four reproduced failures (P5-01 ×3, P5-38 ×1) / 0 inconclusive** and demonstrated that the harness boundary was not present in the actual account route. The second bounded run above corrected exactly those four failures with permanent RED→GREEN regressions and mounted production-path browser witnesses (actual AccountDashboard route element + real consumers + production journal portal; mounted production MultiplayerApp). Current standings: **31 independently accepted PASS / 2 source-corrected pending bounded independent acceptance (P5-01, P5-38) / 9 BLOCKED BY ENVIRONMENT / 0 currently reproduced FAIL**. The corrections are implementation-agent results and are **not** self-classified as independently accepted. The nine environment-blocked cases, the Java/rules emulator gates, the live-backend/authenticated-socket deployment gates and the full-application provider composition remain unexecuted with the exact blockers listed above.

**Latest independent verdict and SOL completion readiness (2026-10-11):** the bounded independent character review retained **32 independently accepted PASS / 1 source BLOCK (P5-01) / 9 environment-blocked / 0 inconclusive**. The original F1/F2 implementation fixed its two exact witnesses but left the five completion/revision/marker failures reproduced by that review. SOL has now corrected and reverified those five production-path failures, as documented in the SOL section above. Current implementation readiness: **32 independently accepted PASS / 1 corrected case awaiting bounded independent verification (P5-01) / 9 BLOCKED BY ENVIRONMENT / 0 remaining demonstrated failures in the executed witnesses.** P5-01 is **not** self-classified as independently PASS.

No P6, unrelated feature work, commit, push or deployment by the implementation agent. Repository note: an external concurrent process committed the correction sources mid-run (`3f58cc05`); the two regression files carry further uncommitted refinements; unrelated concurrent UI edits remain in the working tree (see “MOUNTED-INTEGRATION CORRECTION — 2026-10-10”, Repository state). The 2026-10-11 character correction changes remain uncommitted working-tree edits on top of `ef4082801513ff82630b22bdf88a330600a5397b`.
