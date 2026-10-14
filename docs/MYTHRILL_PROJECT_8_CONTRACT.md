# Original P8 — Branvig Feather Slash execution slice

**FROZEN V1 before production implementation, 2026-10-14.** User authorization
is original Project 8 only. Implementation checks and independent acceptance
are separate. No commit, push, deployment, P9 or broader combat architecture.

## Authority and verified starting position

Original roadmap `MYTHRILL_NEXT_PHASE.md:1088–1136`, H8/H9 (625–626), physical
equivalence and release gates govern. P7 frozen F1–F6 and independent acceptance
remain intact; P5/P6 historical acceptance stays attached to reviewed hashes.
P5-05/07/09/10/11/12/13/31/32 remain outstanding.

Starting HEAD is `8ee079fa41714890099e3db82b06efa0701bb0cc`, branch `master`,
with concurrent presentation/content work preserved. All **42** entries of P7's
accepted final seal match current raw bytes. Source-only comparison and 22-path
P8 starting snapshot are in
`D:/AppData/Temp/opencode/p8-20261014/starting-source-1791982361946.json`.
P7 acceptance was not replayed or its retained evidence copied.

## F8.1 — actual authored data and production entry

- Definition ID **`grimmstalk`**, current display name **Branvig**. No canon/ID rename.
- Original ability **`grimmstalk_feather_slash`**, name **Feather Slash**:
  `spellType:ACTION`, `typeConfig.castTimeType:IMMEDIATE`, single target, melee
  **10 ft**, `targetRestrictions:[enemies]`, **1 AP / 0 mana**, somatic,
  `damageConfig.formula:"2d8 + 5"`, `damageTypes:[slicing]`, `resolution:DICE`,
  turn-based cooldownValue0. Current abilities data version `1.4.0`.
- Verified original source: `vtt-react/public/data/abilities.json:483–535`;
  creature `creatures.json:255–324`. Embedded creature Skull Stare is not this
  action source. `initCreatureStore` overlays original ability data into the
  creature library. The fan already supplies the original object as callback
  argument three; mapped card data is presentation, never execution semantics.
- Real entry: `Grid` renders each placed `CreatureToken`; GM hover fan bubble
  invokes quick-use. Extract only quick-use control into a focused module/child.
  Token remains input/presentation. Preserve fan/tooltip/camera behavior.
- Supported execution is a positively validated, versioned Feather Slash
  capability. A materially different formula/cost/target/effect shape is visibly
  manual-only, not silently converted into this capability.
- Unsupported abilities retain manual cards/use with an explicit **notice-only /
  no target consequence** label. No phantom control/summon/passive/channel success.

## F8.2 — exact source and target

- Source is the explicit placed Branvig instance, not its definition or nearest
  token. Capture P7 room/map/kind/token/incarnation/ref and expected revision.
- Target is explicitly selected, distinct from source, bound, same current room
  and map; creature instance or primary PC attachment with exact owner/canonical
  character/incarnation. No local-sheet alias, UID/name fallback, foreign room,
  cross-map lookup or secondary-PC mutation. Show identity and binding diagnosis.
- Two placed instances of the same definition must remain distinct. An unbound
  source/target needs existing explicit binding controls, never lazy trust.
- Enemy legality, reach, line of effect, defense and mitigation are GM rulings.
  Show authored 10-ft range and measured geometry only where validated positions/
  current calibration make that diagnostic meaningful. Missing/uncertain geometry
  says **GM adjudication required**, not zero range or automatically legal.
  Measurement is advisory, not new diagonal/reach/defense law.

## F8.3 — one roll and explicit adjudication

- After explicit target selection, one digital **two d8 faces + 5** result or
  supported physical entry of **two integer faces 1–8**, showing faces and total
  **7–21**. Reject nonfinite/malformed/out-of-bound values; no eval/general parser.
- Opening the fan/card does not roll the supported action. No hidden flavor roll,
  render-time roll, observer roll or automatic reroll on retries/rejoin.
- Retain that recorded result with the pinned raw definition identity/version or
  canonical hash. Physical entry is recorded as physical, not represented as a
  VTT-generated roll. Changing target invalidates preparation before acceptance.
- GM must explicitly confirm range/enemy/legality/defense/mitigation and enter a
  finite nonnegative **final damage amount**. No prechecked adjudication or silent
  assumption that mitigation is absent. Record the adjustment/explanation; a
  changed raw total requires a reason. No automated armor/evasion/resistance/
  vulnerability/location/durability/reaction/critical rule is approved.
- Preserve authored slicing identity. Existing mitigation code is not adopted:
  it uses local-sheet/store assumptions and lacks independently reviewed exact-
  actor meaning. Manual final-amount adjudication is the supported owning seam.

## F8.4 — preparation and atomic acceptance

- Reuse/extract the existing creature **temporary AP/mana first** arithmetic.
  Independently recheck affordability before preparing the command, not just a
  disabled button. Insufficient combined current+temp resources refuse; no
  clamp-to-zero success. Final costs remain authored 1 AP / 0 mana.
- Target HP depletion follows existing temp-HP-first resource bookkeeping using
  the GM's already-final amount. It does not calculate mitigation. Preserve other
  resources, conditions, class/build/private data; HP floor0 follows the current
  depletion path. PC target payment policy is not being introduced.
- Prepare exactly one strict P7 command: source final AP/current-temp (mana only
  if relevant authored cost), target final HP/current-temp, both expected revisions,
  exact source/target refs, same room action epoch/base sequence and one UUID.
- Use P7's existing scalar `adjudication` fields. Pin action ID plus original
  version/hash, serialize recorded faces/mode/total and adjudication context into
  `chosenResult`, and store finalAmount/adjustmentReason. No new action schema or
  changes to P7 actor-entry/receipt semantics.
- Real authenticated current GM authorizes this cross-actor action. A claimed
  client GM flag cannot bypass registered server entitlement/lease/CAS validation.
- No source-only spend followed by target write; no optimistic combat mirror,
  chat success, cooldown or damage before accepted receipt. P7 installs source,
  target, revision and receipt/checkpoint together or refuses all before mutation.
- Cancellation before submission spends nothing. Cancellation cannot undo an
  already-submitted unknown outcome; expose **check same command** instead.
  Rejection/stale revision spends nothing and requires explicit new preparation,
  not automatic rebase/re-roll. Repeated confirmation shares one in-flight command.

## F8.5 — custody, result and recovery

- Unknown/disconnected/ACK-loss outcomes retain the **same command bytes, UUID and
  recorded roll**. Rejoin/retry never constructs a new damage/payment command.
- Retain only a bounded latest Feather Slash draft/result per authenticated
  owner + room using existing scoped storage/preservation APIs; no general offline
  action queue. Account/generation/room fences refuse old callbacks/adoption.
  Storage/serialization refusal is visible and cannot claim reload-durable custody.
- Current authenticated rejoin can explicitly check retained command. P7 returns
  known durable receipt before old epoch/revision checks; unknown old-runtime work
  remains unknown/manual reconciliation, never automatically executed anew.
- Result card/chat derives source/target final state, recorded roll/adjudication
  and identity from accepted P7 receipt, not the pending calculation. Dedupe by
  receipt identity. GM and observer display the same result; observers do not
  roll, spend, apply independent damage or rebroadcast another result.
- Persistent acceptance: **accepted-live / checkpoint pending** until P7 writer
  confirmation; **checkpoint-confirmed** only from actual allocated/confirmed
  revision. Temporary rooms: **live-only**, null checkpoint revision, no crash-
  durability claim. Checkpoint restore/rejoin are silent receipt/state projection.
- Source proof includes exact retained P3/P7 checkpoint encode/load under new
  runtime and same-command result reconstruction. Real deployed crash/restart and
  live Firestore publication remain separate outstanding environment gates.
- Offline/no-room sandbox and unsupported actions stay explicitly manual; P8 does
  not invent an offline shared-combat authority. Local development uses a real
  temporary-room server with no cloud transport requirement.

## Frozen acceptance witnesses (mandatory, not a reduced test substitute)

| ID | Required production-path observation |
|---|---|
| W1 | Current original loader → real fan → extracted controller; exact raw identity/cost/formula/range/type; no fan-opening flavor roll; unsupported config/manual notice-only. |
| W2 | Two real placed instances of `grimmstalk`, explicit distinct source/target; one accepted 1AP payment + adjudicated HP result, definition/other instance untouched. |
| W3 | Bound nondefault map and exact-incarnation addressing; missing/foreign/wrong-map/self/unbound/retired target refuses without fallback or mutation. |
| W4 | Actual bound PC target with canonical owner/primary; both room observers converge and only explicitly selected matching owner's sheet reconciles; unrelated open sheet untouched. |
| W5 | Base-only, temp-only, mixed, insufficient AP and relevant mana checks; temp-first exact source and target depletion; no negative/NaN resource result or unrelated-field loss. |
| W6 | Cancel target/confirmation before acceptance; rejection after preparation including stale source/target/bounds, lost GM entitlement and writer pre-admission failure; all-or-none no spend/damage/success chat. |
| W7 | One digital faces/total or valid physical result; malformed/nonfinite formula/faces/final amount refuse; range diagnosis + explicit GM adjudication and reason persist in accepted receipt. |
| W8 | Double/repeated confirmation, duplicate server submission, ACK loss and result delivery loss: one immutable command/receipt, one roll/payment/consequence/result per consumer. |
| W9 | Real Socket.IO rejoin and actual page reload recover the same owner/room command/roll/result; old account/room callback cannot adopt; no reroll or respend. |
| W10 | Persistent writer admission/retention/confirmation and P3 checkpoint encode/load/new-runtime known retry preserve settled HP/AP/receipt; unknown lost live-only process work stays unknown, not replayed. |
| W11 | Mounted accepted result/chat on GM and observer, pending/refused/live-only/accepted-live/checkpoint-confirmed labels truthful; result from receipt, no projected pending success. |
| W12 | Printed physical rule card uses the same authored identity, dice/cost/target/GM ruling; recorded physical faces/final outcome reproduce the digital bookkeeping. Report actual human/two-device/deployed proof separately—fixture parity does not claim a performed tabletop playtest. |

Fixtures may replace provider ID verification/owner documents/lease backend/cloud
transport explicitly. They must execute real targeting/ref resolution, payment
planner/controller/UI, stores, real socket registration/authority/P7 commit/writer
and receipt consumers. Mounted fan/quick-use must execute, not just a direct helper.
Run affected P7/client identity/retry/manual-consumer controls and relevant scoped
custody/checkpoint/privacy dependencies. Reuse hash-matching P5–P7 acceptance; no
broad re-audit or copying prior accepted evidence.

Independent reviewer inspects source and executes W1–W12 evidence. One bounded
repair/re-review cycle is permitted; the same remaining invariant yields BLOCK.
On PASS preserve independent report and update engineering ledger; stop before P9.

## Protected scope

No broader combat-integration proposal, favored equipment, timed reactions or
Laws explanation is an approved runtime rule. No new mitigation/crit/defense
system, behavior/tactics, anatomy/zones/telegraphs, generic ability/schema engine,
class-payment economics, generator/static-data rewrite or custom VFX. Preserve
concurrent Claude Opus work and presentation edits; record conflicting file
ownership rather than overwriting them.
