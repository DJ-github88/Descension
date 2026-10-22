# P14-C4 — authenticated shared turn-boundary expiry

2026-10-21 · **FROZEN / creator-authorized bounded lifecycle implementation.** C1–C3 acceptance is
reused. This does not implement general buffs/debuffs, recurring effects or ancestry execution.

## Baseline / focused investigation

Entry `master/9e653fc45f632eda984914a051cd5f319a507a41`. Dirty C3 service/editor/P7 corrections,
contracts/ledger/priorities/coordination/witnesses remain the baseline. Concurrent Class/Fate Weaver,
race/progression, account/room/spell-card changes remain owned by their writers. No reset/commit/migration.
Read C1 §6, C2/C3 implementation records, roadmap, Class handoff33, heritage12/28 and current sources.
No new loadout directive file exists; its supplied requirements and capability map are recorded in
coordination §8, not a competing roadmap. Completed heritage cultural/access review is not repeated.

### Verified pre-C4 capability table

| Surface / source | Stored metadata / countdown | Authoritative expiry | Local mutation / recurrence |
|---|---|---|---|
| Token ConditionsWindow + normalizer | Generic duration/round fields; C1/C2 named records and manual labels | Exact P7 edits only; no automatic shared expiry | Sandbox presets mutate locally; shared named editor/controller owns accepted records |
| Shared controller/editor/custody | Exact refs/UUIDs, canonical profiles, source-specific manual timing; retained commands | P7 admission, CAS, receipts/recovery; manual removals | No timer or overtime executor (`sharedConditionService`, `sharedConditionProfile`) |
| Sheet buff/debuff wrappers → conditionStore | `endTime`, `remainingRounds`; `getRemainingTime` has legacy rounds×6 presentation | None from countdown; shared update/decrement functions return early | Sandbox countdown/decrement/removal and structured local modifiers; no shared recurring executor |
| GM attachment condition controls | Same editor/records and C3 named source adapter | Same P7 manual correction/removal | No independent condition engine |
| Turn/round advancement | Server `combat` index/order/round; client timers and AP proposals | `combatHandlers:169–230` accepts requested index/round; flag-dependent cooperative authority, no occurrence ID, therefore not an expiry event | `combatStore:372–412` shared branch submits separately authorized resource proposals, returns before local overtime/decrement |
| Local sandbox timers | App:1249+, HUD timers, conditionStore:350+, characterTokenStore:570+, creatureStore:493+ | Local only | Sandbox seconds/round decrement and `effectProcessingService` local ticks remain functional |
| Shared-room timers | Metadata retained; named HUD labels suppress fake countdown | None before C4 | conditionStore timer/decrement/updateAll, both token cleanups and `processEffectTick:141–142` refuse shared mutation/ticks |
| Scheduled creature cleanup | App/HUD invoke creature cleanup every second | None in shared rooms; early guard at creatureStore:495 | Local `appliedAt+duration` / round-zero filtering only |
| Checkpoint/reload/reconnect | P3 checkpoint retains canonical maps/global combat; silent hydration does not replay turns; P7 custody retains exact commands | Restored metadata alone is not an event | Existing clock has no authoritative occurrence; C4 must establish one without replay/RNG/resource/timer effects |

Relevant guarded cleanup is already present. Preserve it and prove it; do not remove sandbox behavior.
Wizard duration/recovery fields and Creature/Item Wizard ability data are definitions, not execution.

## Selected timing slice

GM explicitly enables **authenticated turn expiry** against the current server combat snapshot. Every
roster entry must be an exact current bound actor, with unique refs/token entries and a valid current
index/round. Server assigns a combat UUID, sequence0 and roster identity; adoption is not a new turn and
does not retroactively arm/expire existing records. Roster cap and existing P7 operation bounds are
technical limits, not game rules. Any unsupported/missing binding keeps combat/effects GM-managed.

Only GM-confirmed **advance to the next roster entry** can create a boundary. Request binds exact
combat snapshot/hash, combat UUID/sequence, P7 epoch/base sequence and retained command UUID. The server
computes the successor/index/round; it does not accept proposed boundary facts from a cooperative request.
Each transition ends sequence N's current actor occurrence and starts sequence N+1. No wall-clock mapping.

- New **strict canonical PC Defending** added during that PC's current authenticated turn expires at its
  strictly next start occurrence. Manual payment/own-turn action adjudication remains separate. Out-of-
  turn correction, key-only/legacy data and pre-adoption records stay manual; no retroactive inference.
- New **named C3 Shield Bash Stunned** expires on departure from the target's strictly next start
  occurrence. If applied during its ongoing turn, current turn end is too early. C3 prose/structured
  conflict remains disclosed. Generic C2 Stunned duration selection is not silently installed as C3.
- Weapon-critical **one round**, arbitrary durations, creature Defend and recurring effects stay manual.

Timing is a separate server-owned `combat.effectLifecycle` sidecar keyed by exact actor/record identity,
record fingerprint and due sequence, not a rewrite of canonical C1/C2 record shapes. Existing
`sharedTiming:'manual'` continues fencing local/client timers. All surfaces use one shared timing label
to distinguish an authenticated schedule from manual fallback. Any explicit update cancels that exact
schedule even if fields are unchanged; removals remove its schedule. Unrelated actor resource revisions
do not cancel an effect. No stacking rule is invented; independent instances have independent anchors.

## Authority, atomicity and recovery

One bounded `actor_turn_boundary` route lives in the existing P7 handler/context/confirm/admit/publish
owner. It is not a separate admission/payment service. GM-only regardless of cooperative authority flag.
Adopt/advance use existing condition custody/history, principal fences and exact same-command retry.
Known receipt lookup precedes revalidation. P7 receipt/epoch/replay-floor rules apply; unknown/pruned
outcomes require reconciliation, never replay under a new ID.

For an advance, server derives due removals for at most the incoming and outgoing actor (P7's existing
two-actor bound). Current exact roster, combat hash/sequence, refs, current records and fingerprints are
revalidated after authority awaits. Expiry uses ordinary P7 stage operations and actor revisions; a
shared receipt-finalization helper handles administrative transitions without fake actor effects. The
new combat cursor and all due condition removals are staged in **one next gameState**, admitted once by
the existing writer, then installed/published. Admission failure installs neither turn nor removals.
Temporary rooms are explicitly accepted-live only; permanent admission is not synchronous cloud confirm.

Receipt delivery includes the current combat plus ordered actor snapshot. Reconnect/snapshot refresh
restores state, never calls nextTurn or ticks. Restored combat UUID/sequence/schedules survive checkpoint
codec; old request recovery follows P7 receipt rules, not an invented restart expiry. No elapsed-time or
encounter-end cleanup. Ending/resetting/restarting combat leaves conditions untouched and retires the old
clock: its instances are visibly manual. Missing/recreated actors or changed roster/current-state hash
refuse advance until GM corrects/re-adopts; no skipped occurrence or guessed boundary.

While authenticated mode is active, legacy `combat_turn_changed` refuses with an explicit reason; the
client ordinary Next Turn routes to the authenticated request, without resource restoration/regen.
Legacy start/end may retire the clock only for the current GM and never expire conditions. GM reset is
already GM-scoped and retires the clock. Imported local clock metadata is retained as recovery, not
admitted as authority. Generic legacy writes cannot inject/modify lifecycle authority metadata.

## UI / authoring boundary

Reuse existing shared condition editor/GM controls, not a timer panel. Show current roster actor,
combat/turn occurrence, enable/advance/refresh/check-original command and pending/accepted/failed/unknown
state; no optimistic activation/removal. Every named effect shows its exact tracked boundary or why
manual management is required. C3 result mode and existing HUD labels read the same timing descriptor.
Generic authoring fields remain retained/manual; labels buff/debuff do not define mechanics.

## Writable / protected scope

Before source writes, recorded in coordination §5. Server: new bounded `sharedEffectLifecycle.js`,
actorConsequences receipt-finalizer/protected metadata/add-update-remove scheduling hook, existing P7
handler route/snapshot payload and socketHandlers authority-set entry, combatHandlers legacy guard,
imported metadata preservation and gmActionHandlers current-session guard for tracked reset only. Client:
new pure `sharedEffectTiming.js`, additive sharedConditionService/custody reuse, same shared editor/
C3 form/GM controls, combatStore authenticated early route, silentRoomHydration retained clock field,
PartyHUD/TargetHUD pure timing-label mounts only; client combat lifecycle receiver metadata repair
(actual payload-less end event). Focused tests and one production-App witness/evidence
checker; existing ledger/priorities/roadmap/coordination and heritage12 cross-reference. Fresh context
checks preserve concurrent edits. Universal cards, Class/race grants/numbers/IDs, Wizard fixes, A1a,
A1b admission, resource engines, heritage/class selection and save migrations are protected.

## Acceptance

Real registered stack: correct versus earlier boundaries; duplicate adoption/advance; independent sources;
ongoing-target-turn Shield Bash; manual one-round; duration correction; stale/ref/order/current cursor;
member/legacy request refusal; authority-await race and admission failure with no partial transition;
checkpoint/reload/reconnect and old unknown commands. Local sandbox/guarded timers unchanged. Actual
P12B Defending face2→4/no wear before expiry and face2→2/wear only after confirmed expiry/revalidation;
Stunned restrictions persist until last applicable source removed. Focused client custody/presentation/
turn-routing checks; production build, one production-App witness and one bounded repaired independent
review. Bulky artifacts under `D:/AppData/Temp/opencode/`. C1–C3 historical acceptance is not repeated.

## Implementation and evidence

**Delivered at this bounded opt-in boundary. One repaired independent ACCEPT; Build2 compilation exit0;
production-App4 PASS. C1–C3 acceptance remains carried forward.**

### What now expires / what stays manual

GM opens **Shared turn expiry** in existing actor-consequence controls, then enables tracking for the
exact active server roster. Only fresh strict canonical PC Defending on its own ongoing turn and fresh
named C3 Shield Bash are anchored. Defending expires at the actor's strictly next start; Shield Bash at
departure from the target's strictly next start. Adoption never invents a turn or retroactively arms an
old instance. Ordinary Next Turn routes to the authenticated command in this mode, with no local turn,
AP restoration, regeneration, cooldown or overtime mutation. GM can use the same shared editor to remove
or correct exact instances. Any accepted condition update cancels its old schedule.

Pre-adoption/out-of-own-turn Defending corrections, generic C2 Stunned, weapon-critical **one round**,
other durations, recurring effects and ancestry effects remain manual. Price/initial action/save/
eligibility/advantage remain at C1–C3 boundaries. Retiring combat never removes an effect; stale roster/
actor binding blocks advance instead of guessing. Client timers remain fenced in shared rooms and work
locally in sandbox. The pre-C4 source table above plus this delivered overlay is the current capability
map; there is no generic shared buff/debuff timer or recurrent executor.

Technical bounds: exact roster1–64 actors,256 tracked instances globally, and at most32 scheduled
removals per boundary (P7's existing atomic condition-operation capacity). Excess instances are **still
accepted and visible with GM-managed expiry**, not rejected or advertised as automatic. These are not
ancestry/game-use caps. At most incoming/outgoing actors are included in one expiry admission.

### Focused verification / one bounded review

- **Server8 cases PASS:**7 C4 lifecycle production cases +1 new C4 P12B integration case. Correct and
  earlier boundaries, ongoing-target-turn Bash, independent later source/manual critical, duplicate
  receipt/retry, no retrospective arming, source/target/roster/cursor identity, current-GM versus cooperative
  request, duration correction, authority-await race, actual writer rejection, checkpoint/new runtime,
  import metadata stripping and old unknown commands.33 effects demonstrate32 automatic+1 manual and
  an unblocked atomic boundary. Resource/HP/inventory/equipment bytes remain unchanged by expiry.
- **Client2 suites /15 tests PASS:**6 C4 controller/timing cases plus9 affected controller regressions.
  Same pre-emission custody, original unknown command, no optimistic cursor/removal, zero-actor receipt,
  stale/retired role, exact timing labels, local cleanup guards versus sandbox, ordinary Next Turn early
  routing, actual legacy start/payload-less-end receivers, no outbound reset and no-clock snapshot repair.
- **Independent review: initial BLOCK → repaired ACCEPT, same report.** F1:33 automatic effects could
  exceed P7's32-operation admission; scheduling now leaves excess sources manual before promising expiry.
  F2: legacy end/start and refresh left client clock metadata active; real receivers now use the existing
  silent owner, reset metadata clears, no-clock reads repair the ordinary-advance guard, retired receipts
  cannot restore labels. Supporting disconnect observation is closed: timing becomes unavailable without
  losing custody. Reviewer independently reran8 server/15 client cases plus2 server and2 client probes,
  including cursor+two-actor expiry in one admission. Original failures retained; no outstanding findings.
- Scoped new/changed condition/helper lint **0 errors /0 warnings**, UI detector `[]`. Existing large HUD/
  combat files are not declared globally lint-clean. No timer cleanup was removed or generalized.

### Real production-App4 witness

Real optimized App/router/components + registered backend, GM/owner/observer. The actual shared dialog
adopts the roster and shows exact occurrence. Token→sheet labels agree on automatic own-next-start
Defending. Real P12B d8 face2 gives reduction4/no wear. Ordinary production `nextTurn` changes no local
cursor before acceptance; earlier boundary preserves Defending. The due boundary removes it, even when
its ACK and actor broadcast to GM are withheld. Reload retains the original turn UUID/bytes and blocks
replacement; exact check recovers without another receipt/expiry. Original face2 remains in custody;
stale block interpretation refuses, fresh explicit interpretation gives reduction2 and d8→d6 wear.

At ongoing PC occurrence2, the real C3 result form creates a named Bash due at5. Reconnect preserves
anchor/instance. Occurrence3 current end and4 next start do not remove it; occurrence5 removes only Bash.
Independent one-round critical survives, still restricts movement and cannot be deleted by shared local
timer callbacks; explicit sheet removal restores the final source state. End/restart retires the clock,
preserves an out-of-turn manual Defending record and leaves no recursive reset. Desktop1440×1000 and
tablet1024×768 captured; same scrollable parchment/ink dialog, no horizontal overflow, keyboard sheet
entry works.4 deliberately blocked provider `Failed to fetch` errors retained.

App1's production-stripped console marker, App2's pre-existing timeline-over-sheet pointer interception,
and App3's fixture lookup of an unregistered combat store are retained as fixture history. App4 uses
the actual compiled combat singleton; no runtime source changed to accommodate those fixture repairs.
The real mounted SharedConditionHost consumes retirement and silent hydration in this fixture; legacy
receiver callbacks are separately production-module-tested, not claimed as an additional App mount.

### Identity, concurrent work and durable boundaries

Entry `master/9e653fc45f632eda984914a051cd5f319a507a41`; Build2 recorded HEAD
`f23bab5b23b220b435629672e6e7d2f42b866afe`; final checked HEAD
`ad93fd78048a49030f28af18e23bcf0e91a2aa85`. Concurrent external commits included working C4/Class/room
changes. **This agent issued no commit, push, reset, deployment or Git write.** Working-tree corrections,
Class/race/heritage grants, Wizard fixes, corrected A1a, original universal cards and unrelated account/
room/spell edits were preserved. Their presence in the App build is not acceptance of those tracks.

The18 reviewed runtime dependencies and4 focused test files match the repaired source manifest. All12
client dependencies match Build2's recorded dirty inputs or its recorded committed HEAD. One clean legacy
combat receiver has working CRLF versus committed LF: content identity is verified after newline
normalization and this raw-byte limitation is retained explicitly. Build2's recorded before/after drift
is `[]`; this is not a freeze of every concurrent source file or a deployed-current-tree claim.

All evidence below is outside Git under `D:/AppData/Temp/opencode/`. Reproduce current code/review/build/
App/protected-source matching with `node vtt-react/verification/p14/record-lifecycle-evidence.cjs`.

| Artifact | SHA-256 |
|---|---|
| `p14c4-review1/REPORT.md` | `12b24db2bf7e833ae0465830e2c546905ebf45be6d16058328fa8190b61cd963` |
| `p14c4-review1/source-hashes-and-results-repaired.json` | `c6002c96abc555bc7d642f581afd49fb73dbf45ea9f35dd919ab65db1be5549f` |
| `p14c4-build2/build.json` | `9ac727763d13802389de2cd68547c7e94ff76ece9457f58658af2e73c9132187` |
| Build2 asset manifest | `27fcd731b94cb8a70ca90c18538e69a22fb9f55c5244e991bbf6c36d3b1cf3bb` |
| `p14c4-app4/result.json` | `3377f14bf9cea8c040b8627a2b9544b6fb1846e231a31f83bfc639231b568bf5` |
| repo `verification/p14/lifecycle-app-browser.cjs` | `fa202f0d14786166e91e21aa3502c02486fcbf0e415ebec8c28582f148dd13fb` |

`p14c4-final-evidence.json` ties these records together. Permanent writer admission and checkpoint codec
are exercised; live cloud/provider/lease/second-device/deployed restart remain fixture/environment gates.
An admission refusal has no cursor/removal effect. An accepted-live transition can have uncertain cloud
durability/delivery; its original receipt and canonical snapshot, not a client countdown, establish state.
No independent durable turn store or paired-operation atomicity claim was introduced.

### Ancestry handoff / next smallest useful slice

[Coordination §8](MYTHRILL_CROSS_TRACK_COORDINATION.md#8-ancestral-loadout-directive--shared-capabilityinterface-handoff)
records the supplied25-heritage/core-plus-three-pairs/four-equipped/permanent-finalization directive and
the10-row reuse/missing/owner/follow-on map. Heritage12 links to it; the completed cultural audit was
not reopened. C4 supplies named timing infrastructure, **not** ancestry admission, numerical rules,
regeneration, suppression or passive execution. Current grants/IDs persist until explicit compatibility.
P13B is collection, P9 is named support, A1a is uninstalled groundwork and A1b remains parked.

Next smallest coordinated preparation: freeze the ancestry definition-set/version and pure permanent
loadout validator/finalization interface, including legacy-grant compatibility, before any named ability
is admitted. A turn-start regeneration adapter needs one settled authored profile and separate freeze;
do not turn C4's expiry transition into a general recurring-effect trigger. **P14 and ancestral execution
remain open; no175-ability authoring, racial numbers or migrations were implemented.**
