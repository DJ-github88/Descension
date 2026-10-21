# P14-C3 — Shield Bash manual-result adapter

2026-10-21 · **FROZEN and implementation authorized by creator instruction.** This records a manually
adjudicated Stunned result; it is not Shield Bash execution. C1/C2 acceptance is carried forward.

## Source and baseline

`master`, entry HEAD `8d23e50bba40168c50ffb0bc41c68a125dc656cb`. Working-tree C2 corrections remain
in `server/handlers/characterHandlers.js`, C2/P9 tests, C2 documents and witness. Concurrent Class/race/
RI-2 Step1/LevelUp/compatibility/test/evidence edits and parent Mind checkpoint are preserved.
Only adapter dependencies inspected; no project audit.

Original `vtt-react/src/data/universalCombatSpells.js:431–480`, `universal_shield_bash`, REACTION,
authored1 AP: after successful Raise Shield, STR-v-CON; if opponent fails, Stunned until end of their
next turn. Prose and effect prose agree. Structured `duration:1,durationUnit:'rounds'` disagrees and
`recoveryMethod:'automatic'` is not an accepted lifecycle. Original source SHA256
`89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab` stays read-only.
This adapter explicitly records the prose end-target-next-turn outcome with GM confirmation; the
conflicting structured round field remains visibly GM-adjudicated, never silently executed/rewritten.

Current HUD/sheet actions route unsupported Shield Bash through manualActionGate/SpellCastConfirmation
and post a manual notice; they do not reliably supply an exact actor. Existing GM attachment controls
already mount the common shared condition editor. Add **Record Shield Bash result** there, with explicit
source and target selectors and no open-sheet/inspected-actor fallback. Casting/payment routes unchanged.

## Workflow / record identity

GM opens the existing shared condition dialog in a thin named result mode. Bound creatures and exact
primary PCs are supported sources/targets; no source action eligibility is inferred. GM explicitly
selects both refs and confirms the Stunned outcome occurred. Show source/target incarnations, authored
card identity, fixed timing and this boundary:

> Manual result: the GM has adjudicated Shield Bash. This records its Stunned effect only; rolls,
> costs and other effects are handled separately.

Expiry instruction: **Until the end of the target's next turn — GM removes.** Canonical record uses
C2's existing `shield-bash-target-end` timing/label; no clock conversion or scheduler. Initial save,
success/eligibility/range/order/price/prior payment, advantage and expiry remain manual. No implication
of free action or automatically verified prior payment. No resource/HP/wear/inventory/movement effects.

One UUID is result ID = condition instance ID = existing P7 command ID. `sourceEntityId` is the closed
`universal_shield_bash:<UUID>` attribution; `sourceActor` and target retain full exact refs. Existing
C2 record shape/origin/predicate are unchanged. Existing P7 adjudication carries the pinned original
definition ID/hash, exact source/target, result ID and GM confirmation as a strict manual-result subrecord.

Use `editSharedCondition`/existing condition custody, not another transport/store/payment/recovery path.
Persist complete immutable command before emission. Open/reopen selects retained results (including
existing custody history); accepted-but-removed results remain history and are never reapplied.
**Prepare separate later Shield Bash result** is explicit, creates a new UUID on recording, and does
not dedupe by source/target pair. Unknown named outcomes block new-result preparation. A draft captures
the prior target command ID; stale tabs refuse instead of replacing a newly prepared/accepted lane.
Concurrent preparation uses existing actor locks. Repeat status/retry uses exact retained command.
Receipt pruning/runtime change follows P7: unknown/unavailable requires manual reconciliation, never
new IDs to retry. No execution-opportunity or permanent secondary dedupe ledger.

## Authority / installation

Authenticated current GM **direct** P7 command only; owner/delegate or member proposal cannot install
this named result. Existing handlers recheck principal/room/authority after awaits. Shared P7 stage
strictly validates named prefix/adjudication binding, single target/add-only/no extra operations,
current exact source and target incarnations, result/command/instance IDs, canonical record and timing.
Known receipt lookup remains first, allowing recovery even if actors later disappear. No new socket
event/admission or save schema. Existing generic editor can correct timing/remove the exact accepted
instance; no named source identity can be changed implicitly. Other source stuns remain independent.

## Writable / protected scope (recorded before implementation)

New pure Node/client `services/shieldBashResult.js`; additive named support in `sharedConditionService.js`
using unchanged `sharedConditionCustody.js`; thin `components/conditions/ShieldBashResultForm.jsx` in the
existing `SharedDefendingEditor.jsx` dialog, shared CSS, and GM-only `ActorConsequenceControls.jsx` entry.
`server/services/actorConsequences.js` gets the bounded named guard. Focused server/client tests,
one `verification/p14/shield-bash-app-browser.cjs` witness and evidence script; this contract and existing
ledger/priorities/coordination (roadmap pointer only if needed). Fresh exact-context writes preserve
concurrent changes. Protect universal card bytes, Wizard0-AP/resourceCost, A1a, Class/race/resources,
stable IDs/migrations and C1/C2 mechanics. A1b stays parked. No Git writes/deploy/dependency changes.

## Acceptance

Focused production-helper/registered-handler checks prove exact attributed canonical Stunned, fixed
timing, current GM-only/direct authority, stale/deleted/recreated refs, no resource/bank/HP/equipment/
inventory mutation, repeat UUID command recovery and strict malformed/extra-operation refusal.
Client controller checks duplicate async calls, stale draft predecessor, retained original ID/bytes,
lost ACK/unknown/no optimistic activation and explicit separate result. One production-App GM/owner/
observer witness: common token/sheet/GM same-instance, independent critical stun and later Shield Bash,
C2 movement/action restriction/removal, lost ACK/reload/reopen/reconnect fixed timing and same-command
recovery. Reuse unchanged C2 reaction/save/advantage evidence. One bounded independent review/repairs,
detached production build with input/output identity. Bulky artifacts outside Git under
`D:/AppData/Temp/opencode/`. No full C1/C2 reacceptance or full Shield Bash/P14 completion claim.

## Implementation and evidence

**Delivered at this manual-result boundary. One bounded review: repaired ACCEPT. Production Build1
compilation exit0 / C3 client mismatches `[]`; production-App2 PASS. C1/C2 acceptance is reused.**

### Delivered workflow and limits

GM opens **Record Shield Bash result** in the existing actor-consequence controls. The same shared
condition dialog hosts its thin named form. Explicit exact source/target selectors have no default;
GM confirms the adjudicated outcome and records it. Neither the ordinary card/manual-notice flow nor
the personal sheet becomes a new executor. Bound primary PCs and creature instances are supported.

One UUID is result/condition/command identity; original `universal_shield_bash` ID and pinned source hash
are recorded in strict adjudication. Existing C2 record identity, sourceActor, `shield-bash-target-end`
timing, predicates and condition custody are reused. No new socket, store, payment or recovery family.
Current GM direct P7 admission is required. An existing generic condition cannot be changed into a named
result using an update; accepted exact named instances still support ordinary correction/removal.

Accepted history is selectable even after its instance is removed. **Check original Shield Bash result**
checks exact retained bytes or refreshes historical state; it never mints a replacement. Unknown outcomes
block new named-result preparation. Stale drafts compare the captured predecessor command ID against
current custody; duplicate preparation uses the existing actor lock. A deliberately separate later result
gets a new UUID even for the same source/target pair. P7 receipt pruning/runtime-change unknowns remain
manual reconciliation, not a promise of an additional permanent result ledger.

The adapter applies **canonical Stunned only**. Its displayed instruction is **Until the end of the
target's next turn — GM removes.** It retains C2's canonical equivalent timing/label. The card's conflicting
structured one-round field is disclosed and unused. The GM handles initial rolls/save, successful Raise
Shield/eligibility/range/order and costs separately. Authored1 AP is not charged or automatically verified
here. Damage, movement, wear, class resources, inventory, automatic expiry/saves/advantage and broader
reaction execution remain outside this adapter. The effect activates only from accepted room state.

### Focused checks and verdict

- **Server6/6 production cases PASS:** original source hash, exact source/target/result identity,
  canonical timing, once-only exact receipt retry/history after removal, all resource/class-bank/HP/
  inventory/equipment bytes unchanged, independent critical and later Shield Bash sources, PC→creature
  direction, owner/member/proposal refusal, malformed/mixed-operation refusal, stale/recreated/deleted
  actors, source departure across an actual authority await, checkpoint codec/new-runtime known receipt.
- **Client controller9/9 PASS:**3 new C3 cases plus6 affected existing controller regressions. C3 covers
  persist-before-emission, unknown/rebind/exact retry without optimistic activation, history after removal,
  explicit independent later result, stale-tab predecessor, concurrent preparation, missing confirmation,
  stale source and role change across awaits. Review independently executed only the3 C3 cases.
- **One bounded independent review:** original F1 BLOCK retained. A generic-marker→named-result update
  could omit named admission; repaired by requiring an already accepted canonical named identity for
  updates. Original independent production probe now refuses with unchanged state. Same-review repair
  verification:6 server cases +3 C3 controller cases +probe PASS, **ACCEPT / no outstanding findings**.
  A repair-verification continuation used the same report/evidence when session resumption was unavailable;
  no second broad review or C1/C2 acceptance was started.
- Changed editor/helper/controller scoped lint **0 errors /0 warnings**; UI detector `[]`; scoped
  whitespace check passes. Context7 React controlled-form documentation checked before UI implementation.
- **Production-App2 PASS:** real optimized App and registered backend, GM/owner/observer. Real GM entry/
  explicit refs/keyboard confirmation applies canonical Stunned, reads the same instance in GM target
  editor, token Conditions and sheet. The adapter's sole Stunned episode refuses actual basic-strike
  consent and voluntary movement. Removing its exact instance leaves an independent critical stun;
  removing the last source restores supported consent without payment. Reopening accepted history does
  not reapply. A separate later result survives withheld ACK+broadcast, reload/reopen, original-command
  retry and real reconnect without duplication; source/end-next-turn timing and all non-condition actor
  bytes persist. Unauthorized named submission refuses. Desktop1440×1000/tablet1024×768 captures use the
  scrollable existing dialog with no horizontal overflow.4 intentionally blocked-provider `Failed to
  fetch` errors retained. App1 passed before adding the adapter-alone refusal witness; App2 closes that
  evidence gap without runtime changes. Existing C2 E1a/save/advantage evidence is reused, not rerun.

### Exact identity and concurrent-work boundary

Entry branch/HEAD: `master/8d23e50bba40168c50ffb0bc41c68a125dc656cb`. A concurrent external commit
advanced HEAD to `9e653fc45f632eda984914a051cd5f319a507a41` before Build1 finished. This agent made no
commit, push, reset, deployment or Git write. Initial dirty C2 corrections and Class/race/RI-2 work were
preserved. Later concurrent account/room/spell UI/service edits are not accepted by this adapter's checks.

Build1 compiled successfully. All **6 C3 client runtime files match build inputs/outputs**. Full-build
drift is nonempty: concurrent `components/multiplayer/RoomLobby.jsx`; no whole-current-tree identity
claim. The final server update guard was independently checked before App runs; server is not bundled
by the frontend build. Protected W1a/W1b, corrected A1a and original universal-card hashes match the
accepted identities. Parent Class Mind checkpoint remains untouched.

All artifacts below live under `D:/AppData/Temp/opencode/`. Recheck current reviewed/build/App/protected
identities with `node vtt-react/verification/p14/record-shield-bash-evidence.cjs` from repo root.

| Artifact | SHA-256 |
|---|---|
| `p14c3-review1/REPORT.md` (7 runtime +2 test identities) | `b2c0d853fd88bfcb1235ff88543f21e72e78487c7dc97ce23d9257d4cefed026` |
| `p14c3-build1/build.json` | `5099f5c1456f4f33792cef405988d4c221c927efefc44c7f898e41e5e9d34038` |
| Build1 asset manifest | `9f3a704c451b5564b5bc626ef24757006395b752ef81501ba8265f98b87edd92` |
| `p14c3-app2/result.json` | `14e9c23e7bcd6771f07cc0fdb6f06d5165ea1a1eee4bd45ef4a5c6ce6fdd5eb2` |
| repo `verification/p14/shield-bash-app-browser.cjs` | `00a3cbd6952202023a5ce139addf32015603f8614bfb9ce19062a3c3d6b8fa1b` |

`p14c3-final-evidence.json` ties these to the exact reviewed bytes and protected sources. Provider,
ownership/lease and cloud are fixture boundaries; live Firebase, physical second device, human table
and deployed restart/durability gates remain open. No bulky build/screenshots/logs added to Git.

### Next smallest integration slice

No creator-rule question blocks this completed manual-result adapter. A similarly bounded **named
bludgeoning-critical manual-result adapter**, after GM-resolved moderate-d8 CON save and with separate
one-round metadata, is a useful next candidate requiring its own freeze/authorization. Actual Shield
Bash payment/reaction/save execution and authenticated expiry remain separate capabilities. **Neither
Shield Bash automation nor all P14 is complete.**
