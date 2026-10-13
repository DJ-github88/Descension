# Original P7 — implementation and independent-acceptance handoff

> **Historical implementation report.** Independent review subsequently returned
> **BLOCK (B1–B7)**. The original report below remains historical evidence, not
> acceptance. Current correction evidence and handoff:
> [MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md](MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md).
> The temporary-room restriction described below was unauthorized and is corrected
> by an explicitly live-only path; it is not a new durability promise. P7 remains
> BLOCK pending independent acceptance. Original document bytes and hashes are
> retained in `verification/p7/evidence/corrections-20261013/historical-documents.json.gz`.

**Verdict: implemented source, awaiting independent acceptance.** This is an
implementation-agent report, not an independent PASS or deployment approval.
The frozen V1 contract is [MYTHRILL_PROJECT_7_CONTRACT.md](MYTHRILL_PROJECT_7_CONTRACT.md),
F1–F6. Original roadmap Projects 7–9 and coordinator C1–C6 govern scope.

## Source identity and preservation

- Checkout `D:/VTT`, branch `master`, HEAD
  `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b` throughout.
- Starting tracked/untracked nonignored inventory: **12,147 files**;
  `vtt-react/verification/p7/evidence/before.json` records every SHA256 and the
  starting dirty status. `starting-source.json.gz` preserves starting production
  and test bytes. HEAD alone does not identify this worktree.
- The **266 accepted P6 behavioral dependencies matched at start**. P6 acceptance
  remains attached to its original reviewed hashes and immutable report. New
  helper/hook/core/token/personal-projection dependencies require P7 independent
  review; their new bytes are not described as already P6-accepted.
- Exact P7 behavioral/witness paths and before/final SHA256s:
  `verification/p7/evidence/changed-files.md`, `source-freeze.json` and
  `final-identity.json` (paths relative to `vtt-react/`). The behavioral set is
  **27 production files**, plus eight server/client witness dependencies.
- Concurrent styling continued during execution. No P7 stylesheet or class
  economy/casting-controller edits were made. The final inventory records
  concurrent non-P7 drift separately; it is not attributed to P7.
- **214 inventoried retained P5/P6 verification files are byte-preserved** against
  the independently reviewed inventory. Retained witnesses execute unchanged as
  Node main modules; only output destinations are redirected to P7 evidence.

The final exact file table is authoritative. In addition to the originally
listed seams, production tracing required `characterHelpers`, `coreSlice`,
`multiplayerSlice` for canonical-load/save/presentation boundaries, and the P3
creation-import adapter to quarantine client-supplied attachment/receipt metadata.
Those changes are within original P7 identity/reconciliation/bypass scope.

## Frozen decisions and implemented profile

1. **Exact actors:** map/token-backed refs include kind, room, map, placed token,
   incarnation, and PC owner/canonical-character identity. Metadata and revision
   are server-authored at `state.actorContract`; conditions at `state.conditions`.
   Creature common pools live under `state`; PC common pools under `character`.
   Root, party, GM, combat and client map/token views are derived projections.
2. **Primary PC attachment:** one per room/owner/canonical character. Additional
   tokens are visible but unsupported for protected mutation. Explicit replacement
   invalidates the old incarnation and broadcasts that invalidation. Deletion
   clears scoped delegation; cross-map rebinding requires explicit lifecycle.
   There is no cross-room owner lock or resource-sharing rule.
3. **Atomic admission:** all actor changes, conditions and receipt are prepared
   before publication. `FirebaseBatchWriter.admitConsequence` prepares the actual
   writer revision, performs P3 preflight plus the P4 fence budget, and succeeds
   through real tracked/retained-capacity admission before one synchronous room
   installation. There is no await between actor/receipt publication, refund or
   retry-generated UUID. Backend failure afterward retains the same snapshot and
   reports accepted-live/unsaved truth.
4. **Receipts/recovery:** authenticated submitter/UUID namespace, sorted-JSON
   SHA256 content binding, immutable result, room sequence, replay floor and
   actual checkpoint revision. Only a confirmed oldest prefix can be pruned.
   Known durable receipts are served before fresh-epoch/revision checks. Unknown
   old-epoch work is `outcome_unknown`. Unconfirmed process memory is not durable.
5. **Human authority:** own/exact-delegate permitted actor edits and GM foreign
   adjudication reuse existing policy. Cooperative turn advancement is preserved
   and confers no foreign-resource capability. Pending foreign manual/turn finals
   await a GM accepting their immutable proposal. A controller proposal is not
   labeled source-owner class-payment approval. Human permissions and the exact
   process lease are checked separately after asynchronous boundaries.
6. **Conditions:** individual IDs, exact clocks including round zero and absolute
   start/end, supported numeric modifiers, source and marker/effect distinction.
   Shared expiry/decrement/overtime are manual/paused; local sandbox timing remains
   local. Aliases identify/display only. Authored −10ft is not replaced by catalog
   half-speed. Unsupported/private legacy bytes are preserved as recovery data.
7. **Privacy:** public metadata, conditions and receipts use positive typed
   projections. Private legacy/raw recovery is owner-only for owned tokens; GM
   recovery is available for unowned legacy data. Legacy locators are exact
   room/map/kind/token reads, not mutation addresses. GM privilege does not create
   private-inventory consent. Client imports retain attachment/receipt bytes as
   private recovery evidence and cannot install server binding authority.
8. **Owner reconciliation:** an explicitly selected attachment must match UID,
   canonical character, room/incarnation and current P5 account generation.
   Other actors update their views, never the open sheet. Personal loads/imports,
   cached build loads and delayed saves cannot overwrite selected room fields.
   Older receipts do not roll back newer views. Competing post-restart projections
   remain preserved and require explicit selection of the server projection.

### Capability limits / deferred decisions

- Initial limits: source plus one target, **32 condition operations**, **64 KiB
  UTF-8 command**, **256 receipts / 512 KiB retained receipt JSON**, subordinate
  to P3's actual envelope. Unconfirmed receipts cannot be evicted to fit new work.
- Shared V1 publication requires an available **checkpoint-eligible P2 writer**.
  Temporary/nonpersistent room admission returns `room_not_persistent` before
  mutation; local guest/sandbox play remains available. This is a visible
  capability limit, not a new cross-room sharing law or a durability promise.
- Legacy/unbound/unknown identities, unsupported versions and unresolved root/
  nested candidates remain read-only/recovery cases. Bound maxima/build-resource
  changes require explicit lifecycle/reconciliation rather than legacy overwrite.
- Remote PC regen without owning-domain projected facts is visibly manual; AP
  proposals target the exact recipient. The open sheet is never a regen fallback.
- P7 executes only already-final HP/mana/AP splits and condition operations.
  **No class payment is implemented or claimed atomic.** P9 must define a named
  typed source-owned payment result, economic validation, and source-owner approval
  plus GM adjudication of the same immutable proposal. Identity/revision/type alone
  cannot prove economics.
- Creature temp-first behavior and both PC casting policies are preserved.
  PC temp affordability/consumption remains a P9 rule decision. Existing casting
  notices/local payment paths are not P7 target execution.
- No dice, targeting/range, mitigation, initiative-rule redesign, shared scheduler,
  P8/P9 controllers, P11–P14, commit, push or deployment.

## A1–A11 source verification

**PASS below means demonstrated source composition at the named layer. It does
not independently accept P7 or establish real-backend/staged durability.**

| Witness | Result and permanent proof |
|---|---|
| A1 identity/lifecycle | Registered server exact creature/PC refs, same-name/same-UID distinct characters, non-default map, primary replacement and delete/reuse refusals; actual mounted Target HUD damages remote PC to HP25 while local HP30 stays unchanged. `server/tests/p7Consequences.production.test.js`; `browser-results.json` A1/A1MountedHud. |
| A2 authority/races | Owner/GM/exact delegate and random/revoked callers; immutable proposal hash, revoked delegation, replaced runtime, changed verified principal and fenced lease refuse without mutation. Real registration/auth/schema/rate/lease service; backend boundaries substituted. Source C5 regressions also retained. |
| A3 atomicity/admission | Two Feather Slash instances: source temp AP1→0, target HP250/temp4→239/temp0, condition and receipt in one actual retained snapshot. Bad target/record/revision/bounds/bytes and real in-flight writer capacity install nothing. P3 encode/decode round trip executes. |
| A4 retries/concurrency/pruning | Exact duplicate returns immutable receipt; changed content conflicts; simultaneous revision accepts one; 256 pending receipts refuse capacity; confirmed prefix prunes with floor1; retained known retry remains readable, pruned retry expires, unknown fresh-epoch retry never executes. |
| A5 sibling paths/imports | Flat/nested token/creature/resource/map/peer/condition/container-removal envelopes refuse; presentation edits remain. Browser creation-import metadata poisoning has a pre-fix negative and real production adapter GREEN, preserving raw data without binding/receipt authority. |
| A6 checkpoint/restart | Actual allocated writer revision and same snapshot state/conditions/receipt; real retained-capacity and UTF-8 byte pressure; false checkpoint remains unconfirmed. Mounted client keeps HP8 competing with restored confirmed HP11, requires explicit recovery selection, retains prior HP8 candidate, and reads durable old receipt without replay. |
| A7 records/clocks/privacy | Separate same-name IDs and defending marker/effect IDs; remove one leaves others; round3/zero, absolute0/1000 and −10 modifier survive. Unknown/private legacy raw recovery is readable to its owner and absent publicly. Scoped local/personal/room paths execute. |
| A8 remote turn/authorization | Real cooperative transition leaves foreign AP5 awaiting authorization; explicit GM accepts same AP2 result. Mounted remote PC receives AP1, local sheet remains AP2. Shared branch bypasses old wrong-sheet and consistency-repair paths. Missing remote regen facts remain manual. |
| A9 owner/personal | Mounted exact owner selection, actual file import, old/new delayed personal saves, visible failure, matching saved runtime, same-UID different selected character and generation retirement; latest room outcome retained. Original affected P6/P5 witnesses execute unchanged. |
| A10 silent/local | Repeated actual room hydration: RNG0 and outbound emits0; shared timer polling/decrement/overtime leave records/resources unchanged. Historical receipt cannot roll back. Actual local sandbox round3→2 still works. |
| A11 fixture consumers | Pre-adjudicated original Feather Slash, `arc_spark_bolt` and `martyr_restorative_prayer` common-pool fixtures, including exact PC refs and retained untouched sphere/Martyr data. Physical note says already resolved. No cast controller, dice or class-payment execution is asserted. |

Permanent raw observations and manifests: `vtt-react/verification/p7/evidence/`.
`server-results.json` and `browser-results.json` contain the actual values,
checkpoint/receipt sizes, ARIA snapshot, dependency hashes and zero page errors.

### Negative witnesses before fixes

- `P7_RED=1` server negative ran **before production changes**, demonstrating
  root HP219 versus nested HP250 with no revision/receipt, clock/modifier loss,
  no pre-publication admission API and actual retention refusal.
- Frontend negative ran before its fix: actual scoped partializer discarded the
  round3 record without `endTime`.
- `negative-import.json` freezes the real P3 creation-import function before its
  P7 metadata-custody correction; client-forged binding and sequence99 survived.
- `node verification/p7/red-replay.cjs` re-executes the immutable starting source
  and untouched negative witnesses; **2/2 negatives reproduce**. RED exit0 means
  expected broken behavior reproduced, not successful P7 operation.

## Commands and checks

All ordinary frontend commands use `D:/VTT/vtt-react`; server commands use
`D:/VTT/server`. Exact invocations, exits and logs are retained with the evidence.

```text
node node_modules/mocha/bin/mocha.js tests/p7Consequences.production.test.js tests/p7ImportMetadata.production.test.js --timeout 15000 --exit
node verification/p7/browser.cjs
node verification/p7/red-replay.cjs
node verification/p7/checks.cjs server
node verification/p7/checks.cjs focused
node verification/p7/checks.cjs frontend
node verification/p7/run-preserved.cjs p6
node verification/p7/run-preserved.cjs p5
node verification/p7/run-preserved.cjs container
node verification/p7/run-preserved.cjs remaining
node verification/p7/run-preserved.cjs regressions
node verification/p7/baseline-test.cjs
```

- Focused P7 server: **18/18** meaningful registered/import-layer checks.
- Affected frontend regression selection: **19/19 suites, 144/144 tests**, including
  accepted P5/P6 selection plus combat. Required flags are recorded by `checks.cjs`.
- Unchanged retained browser witnesses: original P6 **5/5**; P5 **3/3**; P6
  regressions **14/14**; remaining **4/4 plus 17 malformed-type refusals**;
  container **eight controls** and exact fresh/legacy interior topology.
- Full frontend run: **234 passing suites / 2 skipped / 1 failed**;
  **2,731 passing tests / 4 skipped / 1 failed**. The sole Pyrofiend SVG assertion
  (expected four `.pyro-rune-fire`, received zero) reproduces identically from
  `starting-source.json.gz`; it is outside P7 and was not edited.
- Production and new server-witness ESLint: no errors. Focused new frontend
  modules: no errors. Broader touched HUD/hydration lint retains existing warnings.
- Scoped P7 `git diff --check`: **0**. Whole-worktree check exposed unrelated
  existing/concurrent trailing whitespace; no source/style cleanup was undertaken.
- Detached final CRACO build: **Compiled successfully, exit0**. Original project
  configuration is reused with external output and disabled caches. Final source
  identity is verified against the build/review freeze. Earlier build evidence
  is not substituted for later changed bytes.
- Latest full server suite: **573 passing / 2 pending / 0 failures**, exit0,
  `evidence/server-5.json` and `server-5.log`. The pending cases are the archived
  pre-fix P7 negative and the existing conditional no-DB probe. An intermediate
  strict-GM-principal fixture failure and its
  correction are retained; the trusted canonical GM UID/session is checked without
  trusting a payload UID or actor-name fallback.

## Simulation limits and outstanding gates

Real Chrome, installed React/Zustand, original provider/status/file input, actual
Target HUD, stores, private storage/coordinator, codecs, registered Socket.IO
middleware, actor resolution, authorization, staging, receipts, real P2 admission
and real lease service execute. Actor resolution/staging/reconciliation are not
mocked. Browser transport uses an HTTP bridge to a real verified fixture Socket.IO
client. Auth/config/browser Firebase SDK/admission, Firestore documents and lease
backend are fixtures. Clock/timer checks use actual browser callbacks and explicit
polling; no shared scheduler is introduced.

This is not real Firebase/rules/backend admission, a deployed server restart,
staged GM+two-account/two-device acceptance, full App/router visual acceptance or
a physical GM playtest. P5 gates **05/07/09/10/11/12/13/31/32 remain outstanding**.
Context7 tools were unavailable; existing library APIs and stdlib were reused.
Source presence and compilation do not close environment gates.

## Bounded independent handoff and stop

1. Read F1–F6, this report and the preserved P6 acceptance. Verify HEAD, dirty
   inventory, frozen contract, final 35-file focal hashes and source snapshots.
2. Independently replay the retained negatives, registered P7 checks and mounted
   witness. Focus on UID/incarnation/ref identity, writer refusal before live
   publication, prefix pruning/fresh epoch, protected sibling/import paths, manual
   shared clocks, remote authorization and exact personal reconciliation.
3. Review changed accepted P6 dependencies against retained focused regressions.
   Keep source PASS/BLOCK separate from the real-backend/staged gates above.
4. Report an independent P7 verdict at this bounded scope. On rollback, disable
   new mutation capability while preserving readable records/receipts/recovery;
   do not refund, reset HP or replay accepted commands.

**Stop after P7. No self-acceptance, P8/P9 controller work, P11–P14, commit, push or
deployment is authorized by this handoff.**
