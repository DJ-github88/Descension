# Independent, read-only Mythrill P7 source acceptance — 2026-10-13

## Verdict: BLOCK

The original bounded P7 contract and coordinator C1–C6 dispositions are not demonstrated. Seven concrete source failures below prevent PASS. Green permanent runners demonstrate useful portions of the implementation, but miss these failing paths. No fix, repository edit, commit, push, deployment, P8 or P9 work was performed.

All independent artifacts are under `D:/AppData/Temp/opencode/p7-independent-20261013/`.

## 1. Actual source identity and integrity

- Actual checkout `D:/VTT`, branch `master`, HEAD `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b` throughout. This is an extensively dirty worktree; HEAD alone does not identify the reviewed implementation.
- Independent initial inventory: 12,204 tracked/untracked nonignored paths. Final inventory: 12,206 paths. Complete SHA256 inventories and Git status are in `before.json` and `after.json`.
- Initially all 35 focal production/test hashes matched `changed-files.md`. All permanent witness scripts remained unchanged. The final 34 other focal hashes still match; TargetHUD changed concurrently as described below. `focal-hashes.md` records every focal before/after hash and permanent-runner hash.
- Independently verified all 55 entries of the retained P7 artifact manifest directly against disk, including ignored logs: zero mismatches. An initial inventory-only comparison incorrectly treated ignored logs as absent; that diagnostic was corrected externally, not by changing any retained artifact.
- All 2,134 embedded starting-source files match both their embedded hashes and the implementation's starting inventory. Historical observations therefore execute against identified starting bytes, not merely a claimed old HEAD.
- Frozen F1–F6 are byte-identical to the current contract's F1–F6. The later executable-profile clarifications cannot supersede them or the original roadmap requirements.
- Source dependency comparison finds eight changed entries among P6's accepted behavioral manifest: characterHelpers, coreSlice, multiplayerSlice, characterTokenStore, creatureStore, conditionStore, useCharacterPersistence, and authStore. The first seven are P7 integration changes; authStore has a separate admin-storage quota fallback change. New bytes were inspected and exercised; they do not inherit the old acceptance by preservation of evidence.
- At the completed-validation cutoff, six paths had changed through concurrent UI work: `src/styles/calm-shared.css`, `src/components/hud/TargetHUD.jsx`, ApexResourceBar.jsx, AugurResourceBar.jsx, and newly added HudStatBar.css/HudStatBar.jsx. Further concurrent changes to Animist/Harbinger/Inquisitor/Lunarch/Martyr/Minstrel resource-bar components and calm-shared.css were detected while sealing the report. They were preserved and recorded in the final inventory; subsequent ambient nonfocal drift (including Plaguebringer) is separately recorded in seal.json. The reviewer made no repository changes; a claim that the entire worktree was byte-identical during concurrent editing would be false.
- TargetHUD initial SHA256: `69ff3727692174324550293eb4c6760518c30b6473d43b708d9d7bf284a7cd10`; final: `89e4dc69ff55c78f5245ebeff092e2f475092b15b331cf7fe5f5a62584090bfd`. The four P7 routing/notice changes remain; concurrent work replaces Modular bars with HudStatBar/StatVial presentation. Initial original browser witness passed; the old selector subsequently failed. An external witness adaptation exercised the current mounted context-menu path successfully.
- Fresh build input identity is recorded in `build-start.json`; no inventoried frontend source/public/config input drifted between build start and the completed-validation cutoff (`after-validation.json`). Fresh production build compiled successfully, exit 0 for that identified source. Later concurrent non-P7 resource-bar/style edits are recorded, not claimed compilation-accepted by this earlier build. Stable P7 source findings do not depend on those later edits.
- All 214 inventoried retained P5/P6 verification files independently match the prior accepted inventory, with zero drift (`seal.json`).

## 2. Governing contract and alignment

Read completely: original roadmap P7, its dependency/authority/non-goal sections, P7 contract, implementation report, engineering state, changed-files table and artifact manifest. Also read P3's checkpoint freeze, P4's final approved policy, and the retained final independent P6 acceptance.

| Coordinator disposition | Independent finding |
|---|---|
| C1 exact map/token/incarnation/owner/canonical character; one primary per room | Registered resolution and explicit binding work for the tested supported actors. Same-name and same-UID different characters, replacement and deletion/reuse are covered. Creation metadata authenticity fails B4; stale snapshot downgrade fails B5. |
| C2 bounded final common pools; future typed/economically validated payment | Common-pool/condition-only strict command is implemented. Class payment/economic validation is not implemented or credited. Real P2 admission executes. Post-acceptance error semantics fail B3. |
| C3 no new PC temp-payment policy | No PC casting payment policy or P8/P9 controller was added to P7. Final splits are pre-adjudicated. Existing class/casting suites remain separate. |
| C4 GM foreign adjudication; owner/delegate edits; cooperative advancement separate | Permission and lease/CAS checks execute, and cooperative advancement does not authorize foreign resources. Normal GM proposal/result delivery fails B1. |
| C5 exact records/clocks/modifiers; shared timing manual | Round zero, absolute 0/1000, authored −10 and distinct defending records survive tested paths; private raw fields are positively projected out. Required record fields are not enforced (B6); foreign conditions leak into personal runtime (B7). |
| C6 same checkpoint state/receipt/floor; bounded replay; fresh runtime epoch | Persistent-room staged snapshot, actual writer revision, codec round trip, prefix pruning and old-epoch refusal are demonstrated in source simulation. Blanket temporary-room capability loss is B2. Real backend/restart/device durability remains unproved. |

### Nonpersistent/local scope conflict

The production writer's `shouldPersist` predicate admits only permanent rooms or rooms with a persistentRoomId. P7 witnesses replace it with `() => true` while seeding ordinary nonpersistent room shapes. This override hides the real capability restriction.

The original roadmap and accepted P2/P3 boundaries preserve temporary-room live/local-only behavior and existing manual use. Frozen P7 requires supported manual controls and explicitly separates cloud durability from live acceptance; it does not approve disabling every protected edit in temporary shared rooms. The implementation-profile sentence about `room_not_persistent` is not sufficient authority to narrow that scope.

Local sandbox still uses explicit local entry/load/save paths and `isInMultiplayer === false`; the actual local round counter still decrements 3→2. Temporary cooperative Socket.IO rooms have `isInMultiplayer === true`, however, and are blocked from binding while legacy protected writes are also denied. Ordinary movement/presentation can remain available; common-pool/condition capability cannot. B2 reports that exact conflict without treating cloud persistence as a local-play requirement.

## 3. Harness validity and simulation boundaries

Inspected permanent server tests, historical runners, browser builder, browser scenarios, preserved-output shim and dependency runners before executing them.

### Real paths that execute

- Real Socket.IO server/client transport and registration; sanitizer, schema validator, rate limiter, authenticated socket middleware and authoritative event wrapper.
- Real actor reference resolution, canonical-owner boundary invocation, authorization/delegation decisions, originating lease service, staging, actor CAS, ledger, content hashing, receipt pruning, typed condition/public receipt projection.
- Real FirebaseBatchWriter `_enqueue`, tracked/retained capacity checks, snapshot capture, P7 admission and P3 codec encode/decode.
- Real Chrome, installed React/Zustand, production module bodies, Target HUD, attachment controls, mounted personal provider/status/file import, stores, private scope/coordinator, save/load codecs and reconciliation.
- Historical server assertions inspect root HP219 versus nested HP250, absent actor metadata, omitted clock/modifier fields, missing admission API and actual capacity refusal. Historical frontend assertion inspects the actual partializer discarding a round3 record. RED exit 0 means those specific broken behaviors reproduced.
- The separately replayed starting-source import body preserves forged attachment metadata and receipt sequence99. Its body and full source hash match the retained historical import observation (`historical-import.json`).

### Every substituted boundary relevant to this review

1. Firebase ID-token verification uses an in-memory token/provider map; browser auth/current user and Firebase configuration are fixtures.
2. Canonical character-owner lookup, room-member persistence/revocation, root/list reads, room draft/deletion and membership-compensation storage are in-memory external Firebase boundaries in the server fixture.
3. Lease backend acquire/renew/release/validate and documents are simulated; the lease service and its decisions execute.
4. P7 writer cloud transport returns false, delayed promises or `{outcome:'confirmed'}`. Browser durability is a cloned snapshot plus revision, not Firestore publication. Independent nonpersistent probes reuse the real production eligibility/capture/authority hooks.
5. Browser Firestore functions use an in-memory document map persisted in fixture sessionStorage, controllable delayed/rejected saves and no-op onSnapshot listeners. Transactions/batches are fixture implementations; Firebase backend/rules admission is not established.
6. Browser outbound transport is HTTP fetch → real fixture Socket.IO client. Browser socket `on/off` are no-ops in the original P7 witness; incoming events are normally applied directly through production service methods. Thus it is not a two-browser live subscription witness. The independent GM-delivery probe uses actual server/client event listeners.
7. Server realtime sync/event batching are no-op fixture services. MovementDebouncer itself executes. Silent test logging/credential dotenv loading is isolated; disk log destinations are redirected externally.
8. React router navigation/location/Link, UUID generation, CSS imports, Firebase Storage/analytics/performance are fixture adapters.
9. The inherited browser builder uses inert external-library adapters for dice-roller, fast-json-patch, fuse.js, howler, perfect-freehand, polygon-clipping, rbush, roughjs, three, GLTFLoader, SkeletonUtils, visibility-polygon, Font Awesome icon/component packages, prop-types and react-icons/fa. These are presentation/unused-library substitutions, not actor/staging/receipt/reconciliation mocks. The lack of actual dice execution is also confirmed by source tracing, not just an RNG counter.
10. Browser localStorage, sessionStorage, privacy gate, document/module behavior and actual timers execute. Poll/decrement/overtime checks call real callbacks explicitly; no fake shared scheduler is used. External filesystem output shims redirect only artifacts/logs and baseline locations, not production reads or gameplay decisions.
11. The publication-failure probe injects one throw at Socket.IO broadcast emission after live installation. The capacity probe changes an exposed writer cap through its real pressure-status callback. These faults do not replace the invariant logic under test.

### Important evidence limitations

- `shouldPersist: () => true` is more than a harmless cloud-write mock when used to claim room-mode compatibility; it hides B2.
- The original browser witness seeds party-member canonical IDs itself rather than exercising full App/roomJoin orchestration. It does not establish all mounted join/peer arrivals.
- A server test manually adjudicates using the submitter ACK's proposal ID, which masks the absent GM notification (B1).
- Durable restart is simulated by replacing the room with the captured last-confirmed state. This proves source recovery semantics, not a deployed process/Firestore/device restart.
- Bounds-edit invalidation, unknown-newer record read-only behavior and every frontend legacy receiver permutation are not exhaustively established by the existing green runners. These gaps are not converted into PASS claims; already-demonstrated blockers determine the verdict.

## 4. Concrete source BLOCKs

### B1 — Normal GM receives neither pending proposal nor accepted actor broadcast

**Sequence:** Construct a room through real roomHandlers; join a verified member; bind an actor; member submits a foreign one-actor proposal. Attach real GM socket listeners before submission.

**Expected:** Member receives pending status; current entitled GM receives the immutable proposal so the mounted authorization UI can act. GM observers also receive accepted actor projections.

**Observed:** `actor_propose` returns `awaiting_authorization` and a proposal ID/hash, but GM listener receives no `actor_proposal_pending`. GM accepted-result listener also receives no event. Production room construction stores `room.gm` and the `players` registry GM session as separate objects; their IDs/socket binding are valid, but object equality is false. The new delivery filters require that equality or ordinary room.players membership.

**Sources:** `server/handlers/roomHandlers.js:165–171,270–289`; `server/handlers/actorConsequenceHandlers.js:31–35,205–208`. **Evidence:** `probes.json.gmDelivery`. This is a reachable source failure, not a Firebase/deployment gate.

### B2 — Temporary shared rooms lose protected manual capability

**Sequence:** Seed a normal signed-in temporary room. Use real createSyncServices eligibility/metadata/authority hooks on the writer used by the registered handler. Attempt `actor_bind`; then attempt the documented legacy HP update.

**Expected:** Supported temporary live/manual use remains available with honest nonpersistent status, or an explicitly approved capability amendment exists. Local/cloud durability must not be conflated.

**Observed:** `isPermanent:false`, no persistentRoomId; bind refuses `room_not_persistent` with zero mutation. Legacy HP update also refuses `actor_consequence_required`, even for an unbound actor. There is no working common-pool/condition path in that supported shared mode.

**Sources:** `server/services/syncService.js:539–540,1336–1349`; `server/handlers/actorConsequenceHandlers.js:52–59,163`; `server/handlers/socketHandlers.js:799–825`; client `actorConsequenceService.js:18`. **Evidence:** `probes.json.nonpersistent`. Local sandbox counter behavior passes separately.

### B3 — Broadcast failure is reported as rejection after state and receipt acceptance

**Sequence:** Bind a creature at HP40; join another current member so an actor broadcast is attempted; submit a final HP20 consequence. Inject one transport throw at `actor_consequence_accepted` emission, after admission/installation. Retry the exact command.

**Expected:** Once accepted, preserve the single outcome and communicate accepted/unknown delivery status. A definitive rejection must not coexist with installed actor/receipt state; the client must retain retry identity for uncertain accepted work.

**Observed:** First ACK is `{success:false,code:'invalid_consequence',error:'publication transport failure'}`. Live HP is nevertheless20; actor revision/receipt were installed and retained. Exact retry returns that accepted-live receipt with no second application. Client `retryActorCommand` treats this code as definitive, deletes pending command/origin and returns an error without the commandId needed by the same-command UI.

**Sources:** `server/handlers/actorConsequenceHandlers.js:61–63,180–183`; `vtt-react/src/services/actorConsequenceService.js:268–283`. **Evidence:** `probes.json.publicationFailure`. The injected failure is after installation; there is no naturally asynchronous gap between successful retention and the plain synchronous assignment. Pre-install capacity refusals are correctly atomic in the exercised paths.

### B4 — Legacy creature creation installs and publishes client-authored binding metadata

**Sequence:** Send registered `creature_added` for a new exact ID with a client-chosen `state.actorContract` containing `instanceId:'client-authority'`, revision91 and the current room/map/token identity; request actor snapshot.

**Expected:** Binding metadata is server-authored only. Client-imported metadata is refused or retained as private recovery evidence, not installed/projected as a supported binding.

**Observed:** Forged contract is stored unchanged at map.creatures, emitted on `creature_added`, and positively projected by actor_snapshot. Unlike token-created and creation-import paths, this producer does not quarantine/strip it. This probe does not claim a consequence successfully mutates a map.creatures actor: normal bound locate uses map.tokens. The defect is false binding authority/publication and blocked explicit adaptation of the pre-labelled entry.

**Sources:** `server/handlers/environmentHandlers.js:61–88`; `server/handlers/socketHandlers.js:799–802` (creation omitted from protected legacy set); `server/services/actorConsequences.js:180–184`. **Evidence:** `probes.json.creationMetadata`.

### B5 — Old unbound snapshot can erase a current binding and replace accepted token resources

**Sequence:** Mounted client explicitly selects pc-a; last-confirmed projection is HP11 with valid actorContract. Apply an older/pre-P7-shaped room snapshot for the same token without actorContract and with HP49 through production silentRoomHydration.

**Expected:** An older/unbound candidate cannot replace the protected view of a known current actor. Preserve it for explicit recovery/reconciliation; retain authoritative attachment/resources.

**Observed:** Hydration returns `applied:true`; token HP becomes49, actorContract becomes null, and roomResourceProjection becomes null. The real server room is not changed by this probe; the browser's authoritative projection/fence is lost. Validation skips every incoming entry lacking refOf metadata, so it never compares the existing bound token.

**Sources:** `vtt-react/src/services/actorConsequenceService.js:372–386`; `vtt-react/src/services/silentRoomHydration.js:477–484` and replacement path. **Evidence:** `browser-probes.json.staleUnboundSnapshot`.

### B6 — Strict accepted condition schema does not require the frozen provenance/target fields

**Sequence:** Send an add operation whose record has version/id/recordId/name/type/kind/exact target/manual timing/durationType, but omits originalName, conditionKey, source, targetId and targetType.

**Expected:** Frozen mandatory individual-record fields are enforced before admission, or losslessly completed under an explicit approved adapter. A strict accepted record must not silently lose required provenance/target display fields.

**Observed:** Registered strict validation accepts it; actor revision increments and accepted-live receipt contains the incomplete public record unchanged. Unknown fields are rejected, but required-field presence is not enforced. Known typed private-blob exclusion and tested clocks/modifiers work; they do not establish schema completeness.

**Sources:** `server/services/actorConsequences.js:88–114,163–178`; `server/services/validationService.js:246–251`; frozen contract F4. **Evidence:** `probes.json.requiredConditionFields`.

### B7 — Unmatched selected personal character saves a foreign actor's condition

**Sequence:** In the mounted production provider, accept a round3 −10 movement condition on remote pc-b owned by u-b/c-b. Switch u-a's selected character to c-other, which does not match the selected pc-a attachment. Hydrate actual current room conditions; click the existing Retry runtime save control.

**Expected:** Room-wide/foreign actor conditions never enter the selected personal runtime lane, including when attachment matching is absent after character/generation changes.

**Observed:** Matching roomResourceProjection is null, yet the real personal runtime save path writes the foreign record into `users/u-a/characterStates/c-other.debuffs`, including target ownerUid u-b and characterId c-b. It also carries a recovery candidate for c-a into c-other. Cloud transport is simulated, but collected/staged/written payload and mounted control are production behavior.

**Sources:** `vtt-react/src/hooks/useCharacterPersistence.js:35–55,58–64`; `vtt-react/src/services/actorConsequenceService.js:67–73,366–370`. **Evidence:** `browser-probes.json.unmatchedPersonal.saved`. The early return on no matching attachment bypasses condition scoping.

## 5. Explicit A1–A11 decisions

Each BLOCK refers to the exact sequence/expectation/observation/source above; successful subcases are retained rather than discarded.

| Case | Decision | Evidence and boundary |
|---|---|---|
| A1 exact identity | BLOCK — B4/B5 | Real supported ref resolution, same names, two canonical characters under one UID, non-default map, primary replacement and delete/reuse pass permanent server checks. Mounted remote HUD HP25/localHP30 passes. Server-authored metadata and retained binding identity fail the additional creation/snapshot paths. |
| A2 authority | BLOCK — B1 | Owner/delegate/GM authorization, immutable hash approval, revoked membership/delegation, room/principal/lease races execute and pass. Normal GM proposal/result delivery fails. No unauthorized recovery/private-blob read was credited. |
| A3 admission/atomicity | BLOCK — B3 | Actual P2 capacity refusal, exact staged snapshot, actor/condition/receipt all-or-none preparation, measured P3 envelope and latest retained work pass. Callback capacity reduction refuses before install; delayed older failed write retains newer admitted snapshot. Post-acceptance transport error falsely reports rejection. |
| A4 receipts | BLOCK — B3 retry custody | Server authenticated namespace/hash, duplicate-before-stale, one concurrent revision winner, count/byte limits, confirmed-prefix pruning/floor and fresh-epoch unknown refusal are implemented and exercised. Old receipts do not re-execute. False rejection loses client same-command custody in the broadcast-fault path. |
| A5 bypass closure | BLOCK — B4/B5 | Registered flat/nested resource, map/bulk/peer and import tests pass; tested unrelated presentation edits remain. Creation metadata and old unbound snapshot downgrade remain reachable. Max/build-bound invalidation lacks the claimed complete witness. |
| A6 checkpoint/recovery | BLOCK — B2 capability conflict | Persistent admitted actors/conditions/ledger share actual retained snapshot/writer revision; real P3 codec round trip succeeds; failed cloud write remains unconfirmed; simulated last-confirmed HP11 versus unconfirmedHP8 is explicitly reconciled. Temporary shared protected capability is removed without frozen approval. Real backend/deployed restart remains a separate gate. |
| A7 conditions | BLOCK — B6/B7 | Exact same-name/defending IDs, remove-one behavior, round3/zero, absolute0/1000, authored−10 and owner raw recovery/privacy pass tested paths. Required fields can be omitted and foreign room conditions enter personal data. |
| A8 turn recipients | BLOCK — B1 | Actual shared nextTurn targets remote PC AP1 while localAP2 remains unchanged. Cooperative server transition leaves foreign AP5 pending; direct GM adjudication accepts AP2. Missing regen facts are visibly manual; local fallback/repair branches are bypassed. Normal GM pending-delivery failure prevents the intended authorization UI from completing foreign results. |
| A9 P6 reconciliation | BLOCK — B5/B7 | Matched mounted attachment, import, old/new delayed saves, failure/healing, sameUID/different character and retired generation controls pass. Unmatched selected runtime imports foreign conditions; old metadata-less snapshot drops the active authority fence. |
| A10 silent/local | BLOCK — B5 | Repeated valid hydration has RNG0/outbound0; shared decrement/poll/overtime cause no resource effects; older valid receipt cannot roll back; actual local round3→2 works. Metadata-less old snapshot still replaces protected resources/binding. Shared scope is the multiplayer flag, independent of connection availability; local scope does not arise merely from disconnection. |
| A11 consumer boundary | PASS — bounded source fixtures | Only pre-adjudicated Feather Slash, Slug and Restorative Prayer final common pools/condition fixtures are implemented. Sphere/Martyr data remain untouched by consequences. Physical-fixture already-resolved notation is present; no dice/casting controller/class-economic validation/PC temp-payment automation is credited. No real physical GM playtest is asserted. |

## 6. Commands and actual results

Commands below run as child invocations of external `run.cjs`, with `CI=true` and `NODE_OPTIONS=--require=D:/AppData/Temp/opencode/p7-independent-20261013/readonly-output.cjs`. The preload isolates dotenv credentials and redirects fresh artifact/disk-log destinations outside the repository. Original permanent runner bodies/assertions remain unchanged unless explicitly labelled external probe adaptation. `validation-summary.json`, individual command JSONs and their logs contain exact outer commands, directories, durations, flags and exits; `evidence/*-*.json` records inner suite commands.

### Server (`D:/VTT/server`)

```text
node node_modules/mocha/bin/mocha.js tests/p7Consequences.production.test.js tests/p7ImportMetadata.production.test.js --timeout 15000 --exit
```

18 passing, exit0. Real registration/import-layer tests; source defects above are additional cases outside these assertions.

```text
node node_modules/mocha/bin/mocha.js tests/roomSavePersistence.test.js --grep "reports unavailable instead of true" --timeout 10000 --exit
```

0 passing/1 pending, exit0: the existing no-DB probe self-skips because isPersistenceAvailable() is true in this initialized test process. This is no proof of real durability and leaves that conditional no-DB assertion unexecuted. Other writer false/unavailable/retry tests pass.

### Standard P7 frontend-directory runners (`D:/VTT/vtt-react`)

| Exact invocation | Actual result |
|---|---|
| `node verification/p7/browser.cjs` | Initial reviewed-source run exit0; mounted HUD/owner/turn/recovery/silent/local values pass, zero page errors. Current concurrent HUD presentation later invalidates its old selector. |
| `node verification/p7/red-replay.cjs` | exit0; both specific frozen defect witnesses reproduce against verified starting source. |
| `node verification/p7/checks.cjs server` | Inner cwd D:/VTT/server; `node --require verification/p7/preload.cjs node_modules/mocha/bin/mocha.js tests/**/*.test.js --timeout 10000 --exit`; 573 passing/2 pending/0 failing, exit0. |
| `node verification/p7/checks.cjs focused` | 19 passing suites/144 passing tests/no skips, exit0; exact 19-path selection and flags retained in `evidence/focused-3.json`. |
| `node verification/p7/checks.cjs frontend` | 231 passing suites/4 failing/2 skipped; 2730 passing tests/4 failing/4 skipped, exit1. Class-resource/casting-domain tests included. |
| `node verification/p7/run-preserved.cjs p6` | Original five named P6 controls pass, exit0. |
| `node verification/p7/run-preserved.cjs p5` | Original three P5 controls pass, exit0. |
| `node verification/p7/run-preserved.cjs container` | Eight container controls/topology pass, exit0. |
| `node verification/p7/run-preserved.cjs remaining` | Four controls plus 17 malformed-type refusals pass, exit0. |
| `node verification/p7/run-preserved.cjs regressions` | Fourteen controls pass, exit0. |
| `node verification/p7/baseline-test.cjs` | Wrapper exit0; its actual isolated starting-source Pyrofiend test exits1: one failed/six passed, expected fire glyph count4/received0. The wrapper's exit alone is not the baseline decision. |

Full frontend inner command is `node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --no-cache`. Focused uses `--watchAll=false --runInBand --silent --runTestsByPath` with the 19 paths defined in the inspected checks.cjs; it adds combat to the retained accepted dependency selection.

### Independent concrete probes

- `node D:/AppData/Temp/opencode/p7-independent-20261013/probes.cjs` from D:/VTT/server: final exit0 means specific defective observations and valid admission controls reproduced. Raw results in probes.json. First setup attempt lacked a receiving member for the transport fault; that failed assertion is retained in concrete-probes.log, corrected only in the external probe.
- `node D:/AppData/Temp/opencode/p7-independent-20261013/browser-probes.cjs` from D:/VTT/vtt-react: final exit0, zero page errors; original mounted witness plus current frame-selector adaptation and B5/B7 additions. First attempt retained the old selector and timed out; later setup attempts hit the existing rate limit and a stale preexisting personal candidate. External setup waited for the normal rate window and mounted character load, then exercised actual room hydration and Retry runtime save. These setup failures are retained and are not counted as production findings.
- `node D:/AppData/Temp/opencode/p7-independent-20261013/historical-import.cjs` from D:/VTT/server: exit0, specific forged metadata/sequence99 starting behavior reproduced; captured historical source/body identity matches starting snapshot.
- Isolated starting-source test command from external baseline/vtt-react: `node D:/VTT/vtt-react/node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --no-cache --runTestsByPath src/data/classes/apex/__tests__/ApexResourceBar.test.jsx src/data/classes/augur/__tests__/AugurResourceBar.test.jsx src/components/account/__tests__/CharacterViewHeaderMounts.test.jsx`: three suites/21 tests pass, exit0.

### Lint/build

- Fresh installed ESLint on all 12 focal server modules and three new server tests: exit0, no errors/warnings. Exact path list in lint-server.json.
- Fresh installed frontend ESLint on all 15 focal frontend modules: exit0, zero errors/26 warnings. Existing HUD unused-vars/hook/a11y warnings and hydration default-export warning are recorded in lint-frontend.log; no cleanup performed.
- Retained scoped P7 diff-check evidence remains tied to its original focal bytes; no blanket whole-worktree whitespace claim is made. Concurrent TargetHUD bytes are covered by fresh lint and build.
- Detached command: `Start-Process cmd.exe /c D:\AppData\Temp\opencode\p7-independent-20261013\build.cmd`, working directory D:/VTT/vtt-react, PID11636. build.cmd invokes `node node_modules/@craco/craco/dist/bin/craco.js build --config D:/AppData/Temp/opencode/p7-independent-20261013/build.config.cjs`, NODE_OPTIONS max-old-space-size8192, external BUILD_PATH/Babel/ESLint destinations, caches disabled. Compiled successfully; build.exit0. No synchronous foreground build was run.

## 7. Regressions, baseline failures, skips and environment gates

### Affected P4/P5/P6 dependencies

- P4: new actor events reuse existing registration/authority/privacy boundaries. Full C5/room-access/privacy/production-socket suites pass, but B1 and B4 expose new P7 audience/metadata defects that those tests miss. This is not acceptance of the new bytes solely by old evidence preservation.
- P5/P6: inspected new resource projection in characterHelpers, post-load reconciliation in coreSlice, resource removal from multiplayerSlice, exact UID/canonical token refresh, store routing, manual timing/codec changes, and hook collection/apply/import/save projection. Fresh focused suites and unchanged original browser controls pass off-table/account/handoff/container scenarios. B7 is a new mounted P7 integration failure in the P6 runtime lane; B5 removes the fence that protects that lane.
- authStore's separate quota-safe admin key accessors use localStorage→sessionStorage→memory fallback while existing set/handoff logic remains. Its current bytes were inspected and included in the fresh handoff regression selection; the historical P6 hash is not claimed to accept this separate change.

### Verified baseline failure

Pyrofiend SVG assertion reproduces on verified starting source: expected four `.pyro-rune-crucible.filled .pyro-rune-fire`, received zero. It is not attributed to P7. Starting-source test has six other passes. Both starting and fresh full-run outputs are preserved.

### Current UI regressions outside the P7 behavioral edit set

Fresh full run additionally fails Apex context-menu title, Augur button-order callback, and CharacterView header image-mount assertions. Their starting-source counterparts pass all 21 tests. These are current-worktree UI regressions associated with non-P7 presentation changes, not an identical baseline failure and not a claimed P7 actor-engine root cause. Concurrent source identity is explicitly recorded. No fix was made.

### Pending/skipped cases

- Server pending #1: archived P7 RED negative, intentionally disabled unless P7_RED=1. It is directly relevant historical evidence and was separately replayed successfully; it is not omitted GREEN acceptance coverage.
- Server pending #2: existing conditional no-DB probe, skipped on initialized persistence availability, including when isolated. It is relevant to unavailable persistence but unexecuted in this process; passing unavailable/false/failure-retention fixtures do not turn the skipped real boundary into a pass.
- Frontend skipped: P7 historical partializer negative (one test), separately replayed; WALL_PREVIEW opt-in artifact generator (three scenes), unrelated to P7 gameplay/acceptance. Two skipped suites/four skipped tests total.

### Outstanding environment gates

P5-05/07/09/10/11/12/13/31/32 remain outstanding. This review does not establish real Firebase/rules/backend admission, deployed authority/checkpoint behavior, second-device durability, full App/router integration, backup/restore readiness or physical table playtest. Context7 tools were not available; existing APIs were inspected/reused, no new library integration was introduced. Source BLOCK is independently established and is not merely ENVIRONMENT BLOCKED.

## 8. Artifact custody, read-only effects and stop

Complete hashes: before.json/after.json/focal-hashes.md; original artifact checks and snapshot provenance: after.json; command ledger: validation-summary.json; raw findings: probes.json/browser-probes.json; permanent observations: evidence/server-results.json, evidence/browser-results.json and retained runner outputs; fresh build/lint/runner logs all external.

The reviewer changed no repository source, tests, docs, evidence or styling. Existing uncommitted work and all concurrent UI changes were preserved. Consequently the correct integrity statement is **no reviewer repository changes**, with explicitly recorded concurrent drift, rather than pretending the entire worktree stayed identical. Final inventories retain the completed-validation/build cutoff as well as later ambient drift. No review browser/server remains running; detached build completed.

**Independent verdict: BLOCK. Stop at P7. No fixes or follow-on project work are authorized or performed.**
