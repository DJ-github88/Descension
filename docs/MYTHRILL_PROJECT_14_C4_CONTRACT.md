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

Pending.
