# P7 B1–B7 corrections — bounded independent re-review handoff

**P7 corrections implemented, awaiting independent acceptance. P7 remains BLOCK.**
This is an implementation report. It neither supersedes the independent verdict
nor accepts the source, deployment, backend durability, P8 or P9.

## Actual source identity and custody

- Reviewed and correction-start checkout: `D:/VTT`, `master`, HEAD
  `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`, extensively dirty. All **35 focal
  hashes matched the independent final hashes**, including current styled
  TargetHUD `89e4dc69ff55c78f5245ebeff092e2f475092b15b331cf7fe5f5a62584090bfd`.
- External concurrent commits subsequently moved HEAD through `4d60e5d3` to
  `6552db470bc850595b8891721208fe77c2c2c8ee`, incorporating existing work and
  corrections already in progress. **This agent issued no commit, push or deploy
  command.** No reset or rollback of those external commits was attempted.
- Final actual HEAD/worktree/focal SHA256s and reviewed-to-final deltas:
  `vtt-react/verification/p7/evidence/corrections-20261013/final-identity.json`
  and `changed-files.md`. Concurrent non-P7 changes are identified separately.
  HEAD alone is not the implementation identity.
- Complete independent `review.md`, raw probes, browser probes, validation ledger,
  focal hashes, failed setup logs, source comparisons and historical results are
  retained under `evidence/independent-block-20261013/`, with a direct-byte
  `retention-manifest.json`. Generated build/extracted baseline/diff-input trees
  remain at their original external location; their omission from the retained
  copy is explicit. Nothing in the independent report was rewritten.
- `before.json` and `reviewed-source.json.gz` freeze the actual reviewed source.
  Replay verifies every embedded source hash before execution. Original P7
  `starting-source.json.gz` and earlier negative reports remain intact.
  `historical-documents.json.gz` retains document bytes before the current status
  annotations. F1–F6 remain byte-identical to `evidence/frozen-contract.md`.
- The retained P5/P6 evidence and witness bytes are hash-checked again. Historical
  P6 PASS stays attached to its original identity. It does not accept the changed
  P7 integration dependencies.

## Changed files attributable to this correction

Production:

1. `server/handlers/actorConsequenceHandlers.js`
2. `server/services/actorConsequences.js`
3. `server/handlers/socketHandlers.js`
4. `vtt-react/src/services/actorConsequenceService.js`
5. `vtt-react/src/services/silentRoomHydration.js`
6. `vtt-react/src/store/characterTokenStore.js`
7. `vtt-react/src/components/hud/ActorConsequenceControls.jsx`

Permanent tests: new `server/tests/p7Blockers.production.test.js`; existing
`p7Consequences.production.test.js` now constructs a persistent room for its
checkpoint witnesses instead of hiding temporary eligibility behind a writer
override. Its A1–A11 assertions remain.

Evidence runners under `vtt-react/verification/p7/`: `correction-custody.cjs`,
`correction-run.cjs`, `correction-output.cjs`, `correction-browser.cjs`,
`correction-red-replay.cjs`, `correction-ui-baseline.cjs`, `correction-seal.cjs`.
This report, the contract erratum, historical-report annotation and engineering
ledger are the documentation changes. Current TargetHUD, class presentation,
styles and original P5/P6 browser runner bodies were preserved.

## Specific RED → correction → GREEN

RED means the exact defective observation reproduced, not a passing capability.
Initial live RED observations were recorded before production correction.
`correction-red-replay.cjs` subsequently reproduces them from hash-verified
reviewed bytes. Registered handlers, real room construction, authenticated
registry sessions, real writer eligibility/admission and mounted production
stores/provider/hydration execute.

| Blocker | Frozen RED | Correction | GREEN observation |
|---|---|---|---|
| **B1 normal GM delivery** | Normal `room.gm` and registry session are different objects; pending and accepted listeners receive nothing. Pristine mounted GM has no room.players mirror, consumes no proposal, and stays HP40 while server installs HP28. | Resolve current connected authenticated registry session using room, session ID, GM socket and verified canonical GM UID; check current ordinary member identity by exact registry object. Reject revoked/replaced access. Functional browser on/off subscriptions forward actually received Socket.IO events to registered production consumers. | Pristine mounted GM consumes the immutable command/hash, clicks **Authorize this immutable result**, and observes delivered HP28. No direct service application or submitter ACK supplies this proof. Separate registered tests exclude replaced GM and revoked member delivery/read access. |
| **B2 temporary capability** | Actual production `shouldPersist` is false; bind refuses `room_not_persistent`; legacy HP also refuses. No supported protected path. | Explicit temporary live-only path retains auth, lease, validation, CAS, atomic actors/conditions/receipt and bounded receipts. Persistent admission remains unchanged. | Bind succeeds with live-only classification; final HP20 plus manual unknown condition installs atomically, exact retry returns the same receipt, foreign direct mutation refuses, 256 pending session receipts refuse capacity, retained persistent snapshot is null. |
| **B3 post-install transport failure** | Broadcast throw reports `invalid_consequence` while HP20 and a receipt exist; exact server retry returns acceptance. Mounted client drops same-command custody. A separately frozen ACK-only failure also overwrites delivered acceptance with unknown and has no pending command to retry. | Installed outcomes use guarded publication and accepted/delivery status; receipt lookup responses cannot become transport rejections. In-flight originating command observes a delivered acceptance even if its independent ACK is lost. Only matching authenticated submitter receipts settle its custody. | Broadcast failure returns accepted-live with `delivery:'partial'`. ACK-only failure retains the received accepted result. Failure of both deliveries retains **unknown + original UUID**; mounted **Check same command** sends byte-equivalent command twice, obtains original receipt and causes one revision/mutation. Pre-install invalid bounds and real capacity refusal remain atomic. |
| **B4 creation metadata** | Registered creature creation installs, echoes and snapshots client incarnation `client-authority`/revision91. | Registered creature/token/PC-token creation rejects authority metadata recursively before installation/relay. Existing explicit import quarantine remains intact. | Forged creature is absent from state and snapshot; token/PC-token sibling injections refuse without mutation. Ordinary creation still works, exact creature adapter binds server incarnation/revision0 and exposes valid server metadata. |
| **B5 metadata-less downgrade** | Mounted confirmed HP11 → old unbound HP49 hydrates successfully, erases actorContract and removes owner projection. | Compare incoming same room/map/kind/token entries against established bindings even when metadata is absent. Refuse that downgrade and retain complete competing snapshot as read-only reconciliation data. Explicit recovery cannot install an unbound candidate as authority. | HP11, binding and owner projection remain; HP49 candidate is retained; RNG0/outbound0. Authoritative deletion, explicitly recreated/rebound incarnation, unbound legacy hydration and room changes still apply. |
| **B6 condition completeness** | Strict registered acceptance admits a record missing original name, provenance and target display binding. | Require valid matching individual IDs, original name, name/type/kind, exact target, matching targetId/targetType, authored nonempty scalar source, manual shared timing and valid required clocks. `conditionKey` remains optional. | Missing mandatory fields and contradictory target binding/source refuse before mutation. Known slowed/round-zero/−10, unknown manual-name/no conditionKey and legacy-manual records all pass registered paths. Existing raw private recovery is preserved. |
| **B7 unmatched personal scope** | Remote round3/−10 condition → select unmatched c-other → room condition hydration → mounted Retry writes u-b/c-b record and c-a recovery into `users/u-a/characterStates/c-other`. | Selected UID/canonical-character scoping executes before the no-attachment return and at the actual collect/stage/save boundary. Foreign recovery candidates cannot follow the selection. Ambiguous unbound records remain original-byte manual recovery data. | Observed attempted/saved c-other payload excludes the foreign condition and c-a candidates. Legitimate explicitly selected local condition survives. Ambiguous record with unknown private data is absent from executable personal conditions and preserved unchanged in recovery. |

Primary raw observations: `server-red.json`, `server-green.json`,
`reviewed-replay-server-red.json`, `reviewed-replay-browser-red.json`,
`browser-green.json`, `browser-ack-only-red.json` and
`retry-replay-browser-ack-only-red.json`. The ACK-only secondary pre-fix source is
`retry-before-source.json.gz`; it has its own hashes and is not mislabeled as the
initial reviewed source.

### Related bounded findings encountered by these paths

- The currently mounted HUD calls `characterTokenStore.cleanupExpiredConditions`.
  Its real callback dropped round-zero shared records. The permanent witness
  records before/after on reviewed source, then restores the observation input to
  continue other controls. Shared cleanup now returns without mutation; actual
  local bookkeeping still decrements round3→2. Under slow RED execution, an
  explicit production refresh/reconciliation restores the known snapshot before
  the subsequent control. Real timer callbacks remain in use.
- First delivered creature acceptance materialized zero temporary pools while an
  equal-revision server snapshot omitted them, causing a spurious conflict.
  Binding now installs the same validated explicit zero temp fields as receipts.
  Pristine mounted delivery followed by refresh is covered. No payment policy or
  maximum is invented by this normalization.

## Temporary-room capability and durability distinction

The old checkpoint-only restriction was unauthorized. Its correction restores
supported temporary manual/cooperative use; **it introduces no durability promise**.

| Persistent room | Temporary shared room |
|---|---|
| Real P2 retained-capacity/P3 checkpoint preflight before installation | Explicit validated synchronous in-memory installation |
| Receipt carries actual allocated checkpoint revision | Receipt carries `checkpointRevision:null` |
| Accepted-live until independently confirmed checkpoint | Always accepted-live / `durability:'live-only'` |
| Only confirmed oldest receipt prefix may prune | Unconfirmed session receipts cannot prune to fit new work |
| Backend failure retains the admitted snapshot | No persistent writer or queued checkpoint is claimed |

Both use authenticated authority, exact actors/revisions, strict bounded commands,
atomic consequences and bounded retry receipts. Temporary process loss remains
loss of unconfirmed memory. No legacy protected-write bypass was introduced.

## Bounds-edit invalidation evidence

The inspected registered token/build/character/bulk seams reject protected maximum
replacement. Concrete witness: foreign HP20 proposal at max50 → registered nested
max10 edit refuses with zero bound change → registered deletion/recreation at max10
and explicit bind produce a new incarnation → old immutable proposal adjudication
refuses with zero new receipt/mutation. Raw `server-green.json.bounds` includes
old/new refs, maximum10 and refusal. The same control already passes reviewed
source. **No demonstrated bounds gap was corrected.** This proves the supported
explicit lifecycle/fail-closed paths; it is not a claim of newly added in-place
maximum editing.

## Commands, controls, lint and build

Ordinary cwd: `D:/VTT/vtt-react`; server suite cwd: `D:/VTT/server`.
`correction-run.cjs <name> <cwd> node <arguments>` records the exact outer/inner
command, exit and log, isolating dotenv credentials and redirecting fresh artifacts
without overwriting original evidence. The command ledger retains failed setup,
intermediate failing GREEN and initial lint errors alongside final results.

| Command | Actual result |
|---|---|
| `node verification/p7/correction-red-replay.cjs` | Reviewed-source server and mounted RED observations reproduce, exit0 |
| `node verification/p7/correction-red-replay.cjs retry` | Hash-verified ACK-only secondary RED reproduces, exit0 |
| `node node_modules/mocha/bin/mocha.js tests/p7Blockers.production.test.js tests/p7Consequences.production.test.js tests/p7ImportMetadata.production.test.js --timeout 15000 --exit` | **25 passing**, exit0 |
| `node verification/p7/correction-browser.cjs` | Mounted B1/B3/B5/B7 + affected A1/A6–A10, zero page errors, exit0; accessible Health vial/context-menu selector tolerates current styling |
| `node verification/p7/checks.cjs server` | **580 passing / 2 pending / 0 failing**, exit0; actual registered P4/authority/privacy dependencies included |
| `node verification/p7/checks.cjs focused` | Exact recorded affected P5/P6 + combat selection: **19 suites / 144 tests**, exit0 |
| `node verification/p7/run-preserved.cjs p5` / `p6` | Untouched original **3 / 5 browser controls** pass, exit0 |
| `node verification/p7/run-preserved.cjs container` / `remaining` / `regressions` | **8 container controls**, **4 + 17 malformed refusals**, **14 regression controls**, exit0 |
| `node verification/p7/checks.cjs frontend` | **231 suites / 2732 tests pass; 5 suites/tests fail; 2 suites/4 tests skipped**, exit1; separate presentation findings below |
| `node verification/p7/correction-ui-baseline.cjs` | Original starting-source counterparts of six styling suites: **37 tests pass**, exit0 |
| `node verification/p7/baseline-test.cjs` | Wrapper exit0; actual original starting-source Pyrofiend test **exit1, one failed/six passed** |

Final installed server ESLint on changed production/tests: **0 errors/warnings**.
Frontend lint on changed modules plus actual HUD/hook/registration: **0 errors,
6 warnings** — five unchanged TargetHUD unused-variable warnings and the hydration
anonymous-default-export warning. Initial server indentation/curly errors were
fixed and their failed log is retained. Scoped reviewed-to-final whitespace check
reports no whitespace errors; Git's LF→CRLF conversion warnings are retained
separately in `final-identity.json`. No blanket whole-worktree cleanup is claimed.

Detached final build uses `p7-correction-final-build.cmd`, original CRACO config,
external BUILD_PATH, disabled caches and max-old-space-size8192. Log/exit/config,
input inventory and any ambient drift are retained. Final completion is identified
in `final-identity.json`: **Compiled successfully, exit0**. P7 frontend bytes did
not drift during the final build window; concurrent styling drift (including
`calm-shared.css`) is identified separately in the final inventory.
Compilation of those later styling bytes is not established by this artifact.
Earlier successful build is not substituted for the final
client custody change. No foreground synchronous build was run. Build's existing
large-bundle advisory remains a size advisory, not a fabricated lint warning.

**A11 remains bounded:** original already-adjudicated Feather Slash, Slug and
Restorative Prayer final common-pool/condition fixtures pass. Sphere/Martyr/class
banks and casting economics are untouched. No dice/controller/payment execution,
PC temp-payment rule, physical table playtest or P8/P9 acceptance is claimed.

## Remaining findings, separated by ownership and evidence

### Corrected-source acceptance

No remaining B1–B7 failure is demonstrated in the corrected permanent witness
paths. This statement is bounded evidence, **not self-acceptance**. Independent
review must inspect changed P6 integration bytes (including the token cleanup and
personal scoping), authority audience and retry custody rather than inheriting
the historical P6 verdict. Original independent BLOCK findings stay historical
until a new independent disposition exists.

### Styling-owner handoff

No class/CharacterView presentation source or related test was edited by this
correction agent. Retain these exact independently identified cases:

| Exact test path / case | Independent reviewed-source finding | Current correction-session full run |
|---|---|---|
| `src/data/classes/apex/__tests__/ApexResourceBar.test.jsx`: “opens unified context menu on bar click and handles mark and companion HP adjustment” | Missing `The Silent Hunt: Pack Codex` assertion, line158 | Passes after concurrent styling changes; no P7 fix credited |
| `src/data/classes/augur/__tests__/AugurResourceBar.test.jsx`: “opens unified context menu on click and handles omen adjustments” | First gain-button callback fails expected `malediction,3`, line106 | Passes after concurrent styling changes; no P7 fix credited |
| `src/components/account/__tests__/CharacterViewHeaderMounts.test.jsx`: “renders bare heart, crystal and boot mounts flanking the class bar” | Missing `img.party-vial-icon`, line75 | Still fails |

Their original starting-source three-suite comparison is **21/21 passing** in the
independent report. Repeated verified starting-source comparison here, with three
additional current failures, is **six suites / 37 passing**. Additional current
presentation failures: Revenant “triggers Glacial Nova from the Tender modal”,
Gaoler “opens the Tension Ledger with spec choice, GM overrides, and a − / +
stepper”, and Minstrel “opens Cadence Spells modal when clicking cadence rosette,
showing draggable cards”. Exact paths/assertions and ambient source hashes are
in the retained full log and starting-comparison manifest. They were recorded for
the styling owner, not repaired here.

### Separate baseline failure and pending controls

Pyrofiend expected four `.pyro-rune-crucible.filled .pyro-rune-fire`, received zero,
reproduces on original starting source. Keep this **baseline** distinct from
current presentation regressions. Server pending: historical P7 RED opt-in and
conditional no-DB assertion on initialized persistence availability. Frontend
skips: historical P7 partializer RED (separately replayed previously) and the
opt-in wall preview scenes. Skips do not constitute durability evidence.

### Simulation limits and environment gates

Real production registration, Socket.IO transport/listeners, lease decisions,
actor resolution/staging, writer eligibility/retention/preflight, codecs,
React/Zustand stores, mounted controls/provider, storage and reconciliation run.
The new B1 delivery witness has working browser subscriptions to actually
received fixture-client socket events; no direct actor-service apply proves it.
Original A-controls still use some direct accepted-result application and fixture
party seeding. Outbound browser transport is HTTP→real Socket.IO; inbound bridge
uses Playwright delivery into the browser's functional subscription map. This is
not two independent browsers or full App/join/router integration.

Firebase ID-token verification, owner/member document boundaries, lease backend,
Firestore SDK/documents/rules/admission and cloud transport remain simulated.
Durable restoration is a cloned confirmed snapshot, not a deployed restart.
Inherited router/CSS/UUID and inert presentation-library adapters remain; unused
dice/rendering libraries do not establish physical execution. ACK/broadcast faults
are deliberate transport injections after observed installation. Timers are real,
with explicit callback witnesses; no new shared scheduler exists. Context7
corroborated the reused Socket.IO registry/on/off and Zustand setState/subscribe
APIs; no dependency or external library integration was introduced.

**P5-05/07/09/10/11/12/13/31/32 remain outstanding.** No real Firebase/rules
admission, staged authority/restart/device durability, backup/restore readiness,
full App integration or physical GM playtest gate is closed.

## Independent re-review and stop

1. Verify actual checkout/HEAD/dirty inventory, final focal hashes, retained
   independent report and frozen F1–F6. Account for external commits/ambient drift.
2. Replay initial reviewed RED and secondary ACK-only RED from their identified
   snapshots. Inspect GREEN registered and mounted observations, including
   pristine GM delivery, real temporary eligibility, both post-install faults,
   metadata quarantine and exact personal attempted payload.
3. Check unchanged A11, affected A1–A10 and recorded P4/P5/P6 selection; inspect
   newly changed integration bytes. Preserve historical P6 acceptance and separate
   all nine environment gates and styling-owner findings.
4. Issue an independent bounded P7 verdict. No self-acceptance, P8/P9, commit,
   push, deployment or general P5/P6 audit is authorized by this report.

**Stop at P7: corrections implemented, awaiting independent acceptance.**
