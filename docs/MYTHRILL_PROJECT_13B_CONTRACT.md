# P13B — collection and bounded Riposte delivered; wider reactions conditional

2026-10-19 · **W §1.1 FROZEN and authorized for implementation by the creator.** D13-6b full8s/no normal
early close; D13-11 private pre-cutoff correction/withdrawal with retained revisions/one current intent
per card/occurrence; D13-10 explicit interrupted/unavailable manual takeover, same-deadline reconnect,
no grace/pause/extension. These approve no prices, refunds, resolution order or reaction execution.
**W handoff complete:** implemented, bounded independent source review plus final delta review accepted,
integrated Build3/App4 verified. [§11](#11-w-implementation-and-integrated-handoff--2026-10-19) records
exact identities, workflow and limits. **E1a was subsequently authorized and delivered:** §12 is its
frozen original Riposte contract; [§13](#13-e1a-implementation-and-verification--2026-10-19) records the
completed bounded review/build/App workflow. Broader E1/other-card automation remains future.
Read with the compact [creator packet](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md)
and [ownership/dependencies](MYTHRILL_CROSS_TRACK_COORDINATION.md). This replaces the *planning*
assumptions in roadmap §6/§9 where they conflict; it changes no published Laws. Historical proposed
execution behaviour below is not a claim about the implemented collector.

## 1. Confirmed direction versus current capability

**Confirmed direction (not questions):** eight urgent seconds to **declare**, not roll; nobody must
answer every action; no eligible trigger means no window; no mandatory Pass; no priority by click speed;
reactions can create authored opportunities, including the same player's Parry → Riposte. Choices may
be urgent/imperfect, not a coordinated optimization lobby. Executed reactions pay their full price,
even when made unnecessary. Hide declarations until their appropriate reveal. GM-controlled choices
must be irrevocably committed before the GM can see player declarations. Declaration, execution,
cancellation and accepted consequence are distinct narration phases.

**Current execution:** P7 exact actor refs/revisions/receipts; P9 immediate ACTION damage/healing and
three named typed homes; P12A basic strike; P12B owner blocking/HP/wear. None is a reaction scheduler,
arbitrary interrupt, redirect, counterspell, hand escrow or resource-reservation adapter. P12B blocking
approval is not a paid Raise Shield reaction. P13A currently consumes accepted consequences only.
**W now implements private collection only**, through existing room authority/rejoin infrastructure;
its lifecycle narration uses the existing queue model separately from the accepted-result feed.
Preview fixtures remain authored examples, not reaction execution or approved payment policy.

Source/evidence baseline is the actual dirty checkout at HEAD
`8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`; see [B2 §2](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#2-actual-checkout-and-evidence-boundary)
for retained closure and uncommitted-work reconciliation. Earlier P12/B2 acceptance is reused unchanged;
W's focused verification and completed handoff are in §11.

### Delivered bounded collection slice

**P13B-W: one server-timed private declaration opportunity, then a GM manual handoff.** No named
Parry/Counterspell/Intervene execution pilot is required for this collector. Their existing cases remain
manual examples, not mandatory arithmetic decisions. This narrowing supersedes broader W requirements
below where those would require scheduling/resolving/charging reactions. W and original E1a were
separately authorized and delivered; broader E1 remains separate.

### 1.1 Declaration-only first slice — conditional change contract

**Frozen W implementation boundary:** the recommendations D13-6b/11/10 below are now approved exactly
as recorded at the top. Other proposals remain conditional. GM opens and seals in one authenticated
operation; only closed collections expose player history to that same current GM. Owners see only their
own invited ref/intents; unrelated observers receive no window or response traffic. Safe owner narration
uses fixed moment/status words, no source/target/card names from the GM's private trigger or bundle.
GM-attested authored/manual eligibility remains explicitly manual; no authored definition is installed.

Technical budget: private WeakMap state per exact room/authority epoch, outside gameState/checkpoints;
64 windows retained per epoch (no silent eviction), up to16 invited primary refs,32KiB immutable request/
revision history per owner/window,8KiB request cap, labels120/notes500 characters. Capacity refuses only
the affected private request or new GM opening; no public early-close/count/status side channel or
tabletop use cap. Status carries a viewer-private monotonic sequence to reject stale replies. Lost ACK
and retries use identical IDs/bytes; expected intent revision serializes races across tabs.

| Item | Exact proposed boundary |
|---|---|
| Open | Current authenticated GM prepares one exact causal occurrence and moment, exact source/recipient refs and entitled owner audience. Identify an eligible authored trigger **or explicitly label a GM-declared/manual moment**. Missing card ownership/range/affordability predicates require GM attestation; do not claim automatic eligibility. No generic window after every action |
| Moment | Keep targeting, before-roll, after-roll, on-hit, after-damage and follow-up moments distinct. GM holds the base action at the right moment manually; W neither pauses a pending P7 command nor rewinds accepted damage. No roll is required inside the countdown |
| GM commitment | Server stores the exact GM-controlled bundle (including explicit none) **before opening/admitting players**. After player admission it cannot be changed. No GM access to players' sealed bytes/counts while collecting; role/GM transfer interrupts collection, never permits retroactive sealing |
| Time | Server stamps `openedAt` and `deadlineAt = openedAt + 8000ms`. New-request cutoff is **server admission** strictly before deadline, after fresh authority awaits and immediately before installation; wire arrival/client click alone is not acceptance. Delayed callbacks do not extend it, and no in-flight request may append after close/reveal. ACK/status retry of an existing intent remains possible after close. Countdown anchors server-reported remaining time conservatively with measured transit time; client zero does not itself close or resolve anything |
| Player choice | Authenticated owner records an exact private intent for their named reactor/window/trigger and card reference or GM-manual label; bounded notes/role-labelled refs, not a resource operation. Immutable request bytes/IDs and duplicate prevention; owner sees own ACK or unknown status only. Changes/withdrawals are D13-11 below, not implicit replacement through new IDs |
| Silence | No message and no Pass requirement. Do not publish eligible/answered/pending counts, arrival order or hidden-holder cues. A private local dismiss, if supplied, is not a server Pass or permission to close early |
| Reveal / handoff | After collection closes and the prior GM seal is verified, GM receives the private review projection. Players do not receive others' losing/invalid declarations. GM may authorize safe manual-resolution narration; no automatic execution order, payment, eligibility success, receipt or public dump of sealed cards |
| Reconnect | Same server epoch: retrieve the **same window/deadline and own intent status** through the existing rejoin bus. Elapsed time stays elapsed; after expiry show closed status. No fresh8s, new intent, automatic grace, roll or payment from reconnect |
| Narration | Clear owner countdown and “declaration recorded — execution/payment not confirmed”; entitled opening/closing/manual-review/interrupted status. Reuse the presentation queue through a distinct lifecycle input, never an `accepted:true` fake consequence. No private card/count leak in text, ARIA, history, replay or logs |
| Resources/effects | **W makes no reservation, payment, refund, roll or effect change.** This is a software boundary, **not** a ruling that declarations are free. Exact listed cost may be shown as unverified/manual reference. Existing outside/manual payments remain separate; no generic class scalar, A1b admission or P9 resource hold |
| State/privacy | Collection only: GM seal-and-open → open → closed/GM private review, plus interrupted/unavailable. Private records stay server-only/owner-scoped, outside public room snapshots/checkpoints. Approved live-only scope: restart/authority change is unavailable/manual takeover, not a reconstructed window or fresh timer |
| Follow-up | GM may prepare a distinct authored/manual child occurrence after an attested result, including the same player's Parry→Riposte. No automatic chain engine, success inference or tabletop chain cap. Parent occurrence IDs prevent duplicate openings |
| Future write boundary | Existing room authority/writer and authoritative event routing; one bounded opportunity service/handler plus scoped client custody/status and the existing narration presenter/rejoin bus. Exact module assignments/schemas/byte-retention limits are HQ freeze details before any code. Existing single `room_joined` listener stays single; no class/Wizard/A1a/P7-payment edits assigned |

**Answered W collection decisions, approved 2026-10-19 — not remaining questions:**

| ID | Original example / choice | Approved W boundary |
|---|---|---|
| **D13-6b** early close | GM wants to move on with3s left: full8s, or a GM early-close control? | **Keep the full8s.** No automatic “everyone finished” close or status checklist. Serious interruption is separate D13-10 |
| **D13-11** revise/withdraw | Rocko notices a mistaken Intervene declaration before cutoff | **Both correction and withdrawal approved before deadline**, retaining immutable revisions/tombstones and one current intent per exact card/occurrence. After close request GM handling. GM's sealed bundle stays immutable |
| **D13-10** interruption scope | Connection returns after expiry: show the existing closed window. For a serious outage, is GM manual takeover enough, or must W implement pause/extend? | **Fixed deadline for ordinary lag/reconnect; explicit interrupted/manual takeover for serious outage or restart.** Live-only first; no pause/extend/grace or reopened old window in this subset. Interruption does not declare any reaction cancelled/free or undo manual payments |

These three decisions are implemented, not open defaults. No payment, simultaneous resolution order,
own-turn or card-arithmetic rule was settled by W. Those remain explicitly manual under §1.2.

**Implemented W integration seam:** bounded
`server/services/reactionWindows.js` and `server/handlers/reactionWindowHandlers.js` register
through existing `server/handlers/socketHandlers.js` (both authoritative event routing and payload-room
rules) and `server/services/rateLimitService.js`. Reuse the current exact membership/session/authority
pattern demonstrated by `actorConsequenceHandlers.js:15–45`, not another authority service. Private
same-runtime records must stay outside `room.gameState`/public checkpoint serialization. Client
`services/reactionWindowService.js` plus a bounded HUD collector use current custody/scope helpers,
`roomRejoinBus` and the existing narration presenter. No direct socket `room_joined` registration.
Actual UI/retention limits are recorded in §11; this is not another creator game-rule questionnaire.
Capacity must not reveal secret choice volume through public early-close/
countdown/status changes, silently evict retryable IDs, or become a tabletop reaction limit.

### 1.2 Decisions deliberately left to GM adjudication

| Domain | Still unresolved; not a blocker for this collector |
|---|---|
| Trigger timing / own turn | GM names the actual moment and attests eligibility, including unresolved own-turn permission D13-3. Parry before/after seeing rolls, Intervene targeting vs assigned damage, exact Counterspell card and hit vs damage all remain card-specific. No blanket own-turn permission or one universal timing window |
| Ordering | D13-2a/2b precedence, initiative ties, interrupts and simultaneous resolution remain GM-recorded order/reason **after** sealed collection. Neither receipt order nor display order gives priority. No redirects-first, counter-first, LIFO or initiative default |
| Payment | D13-1/J4 unexecuted/withdrawn-declaration cost remains GM-decided; no automatic zero/full fee. Full cost for actually executed reactions remains confirmed, including later-unnecessary execution. Card AP/mana/typed prices, competing resources and any manual evidence are checked separately; no reservation/release claim |
| Comparison / outcomes | Parry ties/faces/totals, Riposte modifier/DR arithmetic, Intervene rewards and Counterspell saves/AEP remain manual. W's “declared” or “closed” status certifies none of them |

Declaration → possible later execution → accepted consequence are distinct records and narration
phases. W ends at manual review; a GM-attested tabletop performance is labelled manual, not an accepted
P7 effect. Separately submitted P7 commands remain separate supported consequences, not one atomic exchange.

**P13B-E1 (separate later freeze): named Parry/Riposte execution bridge through existing P7 admission.**
It would bind the declaration, exact price and recorded rolls to the current GM-authorized command;
record success/trigger consumption synchronously with installation, then open the child opportunity.
Requires the card rulings below and a narrowly reviewed binder/state extension. Current P12A's 2-AP
basic-strike binder cannot stand in for a 1-AP Riposte. No automatic reaction is authorized by W.

Intervene/Counterspell are worked contract cases below, **not E1 support claims**. Each needs its own
reviewed timing/effect/payment adapter. A timer reaching zero never enables an unsupported effect.

## 2. Authored trigger inventory: moments are not interchangeable

Paths are under `vtt-react/src/` unless prefixed `server/`. These are source observations, not new rules.

| Card / evidence | Authored trigger and exact listed data | Missing decision / execution boundary |
|---|---|---|
| `data/universalCombatSpells.js:100–147` Parry; `weaponActionSpells.js:1836–1862` main-hand Parry | Incoming attack, compare weapon roll against attacker's roll; self;1 AP. Main-hand prose says melee and “higher”, nested text says “meets” | Post-roll comparison is required, but whether declaration occurs before/after knowing the roll, face vs total and tie need D13-5. General Laws also mention ranged Parry; do not grant that to a melee-only card implicitly |
| `universalCombatSpells.js:386–429` Riposte | After **your successful Parry**, enemy within5ft;1 AP; weapon die, `addAttributeModifier:false`; ignores passive DR/Defend soak | Laws narrows this to flat DR and Defend doubling, not equipment die. Laws example adds modifier, conflicting with card; D13-5b. Generated `mh_riposte` uses weapon-derived range, not always5ft |
| Dodge / Raise Shield / Shield Bash in same file | Dodge incoming strike2 AP; Raise Shield incoming damage1 AP; Bash after your successful Raise Shield1 AP, enemy5ft, STR vs CON, stun | Dodge/Evasion, exact declaration timing, Raise Shield wording/success/wear, saves and conditions remain manual. Do not add them to E1 through tags |
| `universal_interpose` | Ally attacked within10ft;1 AP; push5ft, take hit, Strength easy die d6 / prone | Not Martyr Intervene. Laws adds distance surcharge wording; movement/save/recipient replacement not supported |
| `data/classes/martyrData.js:980–1039` Intervene | Intercept attack meant for ally; single ally30ft;1 AP +4 mana, verbal. Description:10+ damage grants damage/10 min1 Devotion; smaller hit restores1d4 mana | No precise targeted-vs-assigned-damage trigger; narrative elsewhere15ft; structured `devotionGain:2` and nested gain2 conflict with description. No redirect/reward adapter. D13-12a |
| `data/testSpells.js:897–968` TEST: Counterspell | Test-only REACTION, enemy casts,60ft/LoS;0 AP +25 mana, cooldown3 | Test data is not the universal Counterspell rule or an admitted executable definition |
| `spellguardData.js:777–798` Spell Break | Enemy casting within30ft;1 AP,0 mana; “detonating a ward charge”, fail at source; cooldown2 | Unpriced ward-charge prose / save config: manual, not an alternative chosen silently |
| `spellguardData.js:1288–1354` Silence Suppression (Counter Spell effect) | Interrupt enemy casting within60ft;1 AP +10 mana +15 AEP; Intelligence save (data DC14), fail counters, gain AEP spell level×10 | Actual counter with success/failure branches; AEP home/gain/save/admission unsupported by P9. D13-12b pins the case's card, not an invented universal price |
| `spellguardData.js:1816–1830` Spell Riposte | **On a spell hit** to self/ally15ft; target caster/enemy40ft;1 AP +10 mana, AEP gain prose10; damage+silence/save | On-hit, not after HP loss or any spell declaration. Mixed effects and AEP encoding are manual |
| Wizard `core/data/triggerTypes.js:564–630,769–803` | `damage_taken`, `damage_dealt`, `critical_hit`, `parry`, `block`, `spell_cast`, `spell_interrupted`, `counterspell` | Structured authoring vocabulary exists, not a live causal event feed. Notably trigger ID `counterspell` means **when a spell is countered**, not permission to counter a cast |

### Moment-specific evidence contract

| Moment | Facts a matching declaration may use | What must not have happened / be inferred |
|---|---|---|
| Declaration/targeting | Published cast/attack identity, exact known source and original recipient, permitted visible card facts | No future roll, hit or damage; no opponent's sealed reaction |
| Before a roll | Bound upcoming roll identity and known targeting facts | No result may be revealed first; do not admit an after-roll declaration retroactively as pre-roll |
| After a roll | Retained original faces/total and GM-ruled comparison context | No reroll for stale state; whether an attack hit may still await adjudication |
| On a hit | Explicit confirmed hit event and its exact recipient | Zero HP loss does not mean no hit; on-hit does not automatically equal after-damage |
| After damage | Accepted applied damage (or explicitly labelled GM-attested manual loss), with exact causal event | Never pre-damage proposed amounts or a floating animation; no rollback of an accepted hit |
| After another reaction | Its recorded success/accepted execution identity and authored follow-up relation | No blanket ban on responding to your own successful reaction; no follow-up from another character's success |

No supported pilot card must be assigned to all six moments. W uses an explicit GM-attested named
moment where current data cannot prove it; that attestation is visible as manual, not fabricated server
knowledge. A source action may pause at several **different eligible moments**, not a universal
after-roll window for everyone. Missing card wording stays manual until its entry is reviewed.

**Targeting/propagation addition:** [B2 §9–§13](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix)
inventories actual chain/bounce/seeking/explosion/spreading/forking and legacy/prose recipient profiles.
Initial choice, first delivery, propagation and application/timing are separate. A later executor needs
only the **actual eligible authored** initial/intermediate/impact/hit/damage opportunities; no timer per
hop by default, and a compulsory spread trigger is not a player's reaction declaration. A valid repeat
visit in a bounce must have a distinct causal occurrence (branch/hop/step identity in the future named
capability); never suppress it just because the actor appeared earlier, or create it from an animation.
Roll/payment frequency, stopping/retargeting and reaction moments remain per-card decisions, not P13B
universal rules. No map path extends P7 actor count or makes sequential commits atomic.

## 3. Authority, identities and lifecycle (proposed technical contract)

### 3.1 Owner and transport

Combat/Main HQ extends the existing authoritative room lifecycle, current-owner/GM checks, room writer,
P7 staging/receipt identity and P5/P6 private custody patterns. W's window is a
**collection/causal record**, not an automatic scheduler, authority or money ledger. No new client flag can admit a
card. Authored-definition trust, if needed, belongs to A1a and a separately frozen integration; A1b is
parked. No class-specific authority port or bypass through a direct local cast.

Authenticated owner declares for their exact primary character; GM declares for exact GM-controlled
actors, not by impersonating the player. Recheck current room/player/socket generation, permission,
binding and eligibility after every authority await and immediately before installation. New APIs need
the existing authoritative-event/rate-limit routing, scoped status/list and fail-closed validation.

### 3.2 Stable conceptual records (field names proposed, not accepted P7 schema)

| Identity | Binding / duplicate rule |
|---|---|
| `exchangeId` | UUID, room+encounter+actionEpoch, exact original action/command intent ID; survives client reconnect, never keyed by token name/time alone |
| `triggerId` | Exact parent action/reaction ID + named moment + occurrence ordinal + exact source/recipient refs; duplicate delivery/hydration cannot create another occurrence |
| `windowId` / revision | One eligible opportunity for that trigger; parent link, eligible recipient records, server open/deadline, status, immutable policy/card versions |
| `declarationId` / request ID / content hash | Immutable owner intent, window+trigger+exact reactor+reaction definition/version+role-labelled target refs+exact price/typed choices+source revisions; same ID/bytes returns status, changed bytes conflict |
| `stepId`, P7 `commandId`, approval ID | One scheduled execution and its exact prepared bytes; command identity registered against the existing cross-capability ID gate. Retrying never allocates a new payment |
| follow-up occurrence | Parent **successful reaction step**, recipient reactor and authored follow-up card; duplicate success delivery cannot re-open it |

For **W §1.1**, card/version/price are authored references or explicit GM-manual attestations, not
trusted installed definitions or payment consent. `stepId`/P7 commands and typed execution choices are
E1/later records only; W creates no commands or execution claims. If D13-11 permits correction, each
revision/withdrawal is a new immutable request linked to the original intent, not changed bytes under
one ID. One current intent is not a one-reaction-per-turn or per-player cap across different cards.

Retain both **original attacked actor** and **current pending recipient**, plus reactor, protected ally,
hostile caster/attacker and follow-up recipient. A redirect is an explicit adjudicated rebind of pending
targeting, not name-based retargeting of every declaration. Deleted/reincarnated actors invalidate old
refs; never substitute the new token with the same ID. Revision changes revalidate retained evidence,
not redraw/reroll. Whether a changed recipient preserves another card's eligibility follows that card.

Prevent a second live declaration of the **same reactor + exact card + trigger occurrence**, across two
tabs/sockets. Reject new IDs for a consumed occurrence unless an approved card rule allows another use;
withdrawn-occurrence replacement follows the pending D13-11 policy, never erases the prior identity.
This is duplicate prevention, **not** one reaction per round or one declaration
per player for all cards. Any cap on different cards declared together needs an explicit policy.

### 3.3 States and deadline

**E1/later execution sequence** (W stops at the collection/manual-review states in §1.1):

`prepared moment → GM choices sealed → open → closed/sealed → ordered → resolving → settled`

with explicit `manual`, `interrupted` and `outcome_unknown` branches. Declaration states are
`recorded`, `withdrawn`, `invalid-before-execution`, `executing-unknown`, `executed`, `cancelled-unexecuted`.
“Executed” requires an accepted supported command or a separately labelled GM-attested tabletop
execution; selecting a declaration and starting an animation are not execution.

- Open only if at least one **actual card holder** matches the exact moment, recipient, permissions,
  prerequisites and payable price (or a GM explicitly attests an unresolved manual predicate).
  Missing authoritative hand/resource/geometry evidence cannot be called automatically eligible.
- Server owns `openedAt`/`deadlineAt` (8 seconds) and window state. W has no pause/extension/grace;
  its conservative server-time estimate reaching zero only requests status, never closes/executes locally.
  Fresh admission before deadline is independent of timer callback lateness; same-request status recovery
  remains possible later. Approved D13-10 sends serious interruption to manual takeover.
- No eligible holder → advance with no timer. Silence needs no message. No public answered/eligible/
  pending count, checkmarks or click-order feed. No Pass button; dismissing W's local lifecycle announcement
  does not withdraw an intent or end collection. Approved D13-6b gives the full8s, no normal early close.
- Dice happen after declaration at an appropriate phase; countdown is not a roll-speed contest.
  Original and reaction rolls are retained before sending/revealing and never replaced after reconnect.
- Closing collects choices only. GM order/adjudication is required wherever policy/effect support is
  unresolved. Never manufacture a pass, a successful counter or a paid reaction from timeout.

### 3.4 GM commitment and private/public projections

Before player declarations are admitted, current GM seals an exact bundle of GM-controlled declarations
**or an explicit no-declaration bundle** for this trigger. Bind bytes, refs, prices and policy revision
server-side. This does not ask players to Pass. GM cannot change the bundle after player admission;
new real child triggers require new bundles, committed before their player choices too.

During open collection: each owner sees only their own choice/receipt status. GM sees its own sealed
bundle and operational status, **not player declarations**. After close and verified GM seal, GM gets
the adjudication projection. Other players receive only the reveal permitted for an executing/resolved
step, not every losing hand/card or invalid private choice. The approved “owner and GM know” direction
does not entitle the GM to change creature tactics after reading a player's response.

Do not publish small-choice hashes (enumeration leaks), reservations, private payment details, client
telemetry, eligible counts or deadline changes that encode hidden choices. Public text, ARIA, history,
chat and replay use the same viewer whitelist and hidden-actor filtering as P13A. Hidden triggering
actors/card names are exposed only as the rules/GM reveal authorizes; no window to unrelated players
that gives away a hidden holder. GM switching/authority loss interrupts collection instead of allowing
the next GM to inspect choices and then seal retroactively.

Server-only/private persistence is a **missing prerequisite** for durable secret windows. Putting sealed
choices into the ordinary room checkpoint/snapshot readable by all members does not hide them.
W may be explicitly live-only with restart interruption; a durable variant needs Main HQ's reviewed
private projection/storage boundary beside the existing checkpoint writer, not a new cloud ledger.

### 3.5 Narration lifecycle projection

Reuse the existing narration queue/presenter with a small, explicitly separate lifecycle-event input;
do not feed declarations to P13A's accepted-consequence adapter with `accepted:true`. Key lifecycle
events by exchange/step/phase so ACK+broadcast/rejoin cannot announce them twice. No replay animation.

| Phase | Permitted wording / audience |
|---|---|
| Declaration | During collection: owner only, “Intervene declared — execution/payment not confirmed”. W separately states that it performs no automatic reservation/payment; do not assert nothing was spent after any manual command submission. Public original action may be named only to entitled viewers |
| Execution | After authorized reveal/execution evidence: “Counterspell executed; its check failed” or “Intervene executed”. A table-only execution explicitly says **GM-recorded/manual**, not applied by VTT |
| Cancelled / invalid | “Intervene did not execute; trigger cancelled” / “source binding changed”; reveal only authorized public facts, no private card/hand leak or unapproved no-cost assertion |
| Accepted consequence | P7 receipt only: exact applied AP/mana/HP/wear; current P13A revision/visibility/dedup rules. An exchange's success sentence cannot substitute for a missing receipt |
| Unknown | “Step outcome unknown — checking the same command”; no damage/payment float or release assertion |

## 4. Payment, reservations, withdrawal and sequential commits

### Existing adapters versus missing capabilities

| Need | Current evidence | Smallest missing boundary / owner |
|---|---|---|
| AP/mana exact payment | `server/services/spellPayments.js:141–162,217–267` temp-first + current pools; P12 binders | Named reaction approval/binder linked to P7 admission; Combat. Cannot route a reaction through P9 ACTION support |
| Typed component banks | `classResourceBanks.js:65–152`, managed class planners; server P9 `DOMAINS` spheres/notes/Devotion | Reuse exact domain price/conservation. These plan before/after, **do not reserve** bank contents |
| Hard reservation, even AP | No reservation operation in P7 validation or current P9 adapter | If required, a narrow claim checked by **all competing spend paths** at the existing staging boundary; Combat scheduling + Class per-domain validate/consume/release. Window-local UI subtraction is not a lock |
| Cards/hands, wagers, tile IDs | No admitted server escrow/hold/release operation | Class owns reviewed conservation/private projection; Main HQ supplies shared boundary. Do not say “card reserved” now |
| Links, companions, summons, transformations, delayed state | Exact refs alone do not supply lifecycle/trait/movement authority | Named domain follow-ons, not generic numerical bars or universal resource operations |

**W reserves and pays nothing automatically.** The implemented form accepts an unverified card ID or
GM-agreed reference and private note; it does not look up/certify prices. Any cost reference is manual.
A declaration is not an escrow. At manual resolution the GM verifies payment with
existing controls and records evidence; it cannot certify automated conservation or atomic payment/effect.
Do not promise resources that another admitted command may spend first.

Multiple same-window declarations competing for the same resource must not acquire priority by which
request reached a reservation first. **W detects no resource conflicts**: GM identifies and orders
them manually after reveal. A future
hard-hold design must state how incompatible claims are admitted/selected under the approved order,
without revealing the other sealed claim. Mere first-arrival locking would violate the no-click-speed
direction. Availability of each individual price is not proof that all declarations can execute together.

For E1 or later supported cards, proposed execution sequence:

1. Freeze/reveal order under the approved policy (or explicit manual GM order); no arrival-time priority.
2. Revalidate this step against current actors, card version, trigger, prerequisites, resources and any
   actual typed reservation. Retain original evidence. Unsupported or ambiguous effect → manual, not a
   generic GM bypass disguised as approved automated execution.
3. Prepare one existing-path P7 command for the supported consequence group, with its owner approval,
   exact full price, current CAS revisions and recorded roll. Validate before/after authority awaits.
4. Admission installs payment/effect and consumed declaration/trigger linkage synchronously, or refuses
   without either. This coupling is a **required P7 scheduler/binder extension**, not a feature today.
5. Record its receipt, then advance to the next declaration or a new authored child trigger. Recompute
   affordability/eligibility; do not prepare all steps using the same stale before-state.

An exchange is **sequential, not atomic**. If steps1–2 accepted and step3 fails,1–2 stay executed and
paid. No compensating refund or pretend rollback. No interleaving of scheduler steps while a prior
command's outcome is unknown. Up to two actors per current P7 group; a three/four-owner redirect or
link requires its own bounded extension if atomic coupling matters. Per-target commands are not an
equivalent all-or-nothing substitute.

**Unexecuted declaration cost (D13-1): unresolved.** Recommend no charge, and release a genuine reservation
only after definitive non-execution. Full-price or a specifically authored commitment cost are alternatives;
never invent a fee or price missing from the card. If creator chooses a declaration cost, it needs a
separately approved typed commitment through the same authority, not a local debit. An accepted setup
such as a class wager is already an executed setup under its own rules, not a free-cancellable declaration.

**Withdrawal/correction (D13-11, approved for W):** §1.1 permits private
correction/withdrawal before the unchanged deadline, with immutable linked revisions and no public
status/arrival priority. It supersedes the earlier proposed blanket “no replacement” restriction; the
creator approved both. GM bundle remains immutable after player
admission. After close request GM handling. Payment stays unresolved/manual under D13-1. E1/later must
separately handle submitted/unknown execution and accepted steps; W has no such command to undo.

## 5. Ordering and causal opportunities (D13-2 still open)

**Proposed order:** respect actual trigger chronology first. A pre-cast interrupt resolves while the cast
is pending; an on-hit defence cannot be resolved before a hit exists; after-damage is after accepted damage.
For declarations truly eligible at the **same moment**, recommend a reviewed card-specific precedence
relation: pending-cast cancellation/check before a redirect of that cast, then revalidate survivors.
This is a proposal, not “redirects, defences, then the rest”. Counterspell has a defined place only when
its own timing is pinned. No blanket LIFO stack or universal category hierarchy is inferred.

Independent tie proposal (D13-2b): current encounter initiative, captured at window opening; ambiguous
or missing/equal entries → GM-recorded order. This favours initiative, not defender side or click speed.
It remains unapproved. While unresolved, show GM-recorded order/reason as **manual ruling**. An invalidated
declaration does not simply move to another moment/recipient to rescue its usefulness.

Each executed reaction can create another authored trigger. Successful Parry creates a fresh Riposte
opportunity for that parrier; announcing Riposte may create a new incoming-attack moment for its opponent.
Use parent/child IDs and current resources. Do not apply the withdrawn “nobody reacts to their own
reaction” restriction. Technical budget proposals in §7 suspend automation for GM continuation, not rights.

## 6. Four worked cases

### A. Marcus targeted; Rocko Intervenes and Marcus declares Counterspell

**Concrete data used:** Rocko holds `martyr_intervene` (1 AP +4 mana, ally30ft); Marcus's “Counterspell”
is explicitly the authored **Silence Suppression `sg_void_suppression`** (1 AP +10 mana +15 AEP,
enemy60ft, Intelligence save; counter on failure). This does not assume Marcus's real class/loadout or
promote that card to supported execution. TEST: Counterspell's0 AP/25 mana is not substituted, nor is
the unresolved Spell Reaction2-AP wrapper added. A universal Counterspell needs a pinned actual card.

Setup: visible enemy caster casts one targeted spell at Marcus; caster within60ft of Marcus; Rocko
within30ft of Marcus. Both have the listed resources/components; geometry/ownership are GM-confirmed.
Original cast has stable intent E0; no attack/damage/save result is known yet.

**Timing qualification:** Intervene says intercept an attack but does not settle whether it is declared
at targeting or only when damage is assigned. To examine the requested **same-opportunity** case, assume
the GM/creator explicitly permits its declaration at targeting, with reward computed only if actual damage
is intercepted (D13-12a). This is a labelled conditional ruling. If its true trigger is assigned damage,
Rocko cannot submit an eligible Intervene at the earlier cast window: it waits for a later moment. W must
not quietly move an on-damage card into Counterspell's window to reproduce a fixture.

| Stage | Known / hidden / checks |
|---|---|
| Open W0 | Known: permitted cast identity, original target Marcus, visible relative positions, each player's own cards/resources. No future damage/Intelligence save result. GM already sealed creature responses or explicit none |
| Declarations | Marcus records D-C against exact enemy caster/E0; Rocko records D-I protecting exact Marcus/E0. Each sees only their own ACK. Other player's reaction, typed price/choices and GM bundle remain hidden; no answered count |
| Admission | Verify respective primary owners, current versions, payable1AP/10mana/15AEP versus1AP/4mana, components, timing and exact ally/enemy roles. AEP/Devotion reservations are not currently supported. W labels them manual/unreserved; an automated extension cannot claim they are held |
| Proposed resolution | After collection closes, resolve the counter's check **before** a not-yet-executed interception of this cast; then revalidate D-I. Card-specific precedence/tie policy remains D13-2, not approved |

**Counter succeeds (enemy fails the authored save, GM-adjudicated).** Counter **executed**, full1 AP,
10 mana and15 AEP paid under the selected card; any level×10 AEP gain is separately explicit/manual
until its domain adapter exists. Pending spell cancelled; no HP consequence from that cast. D-I is
**cancelled-unexecuted** if it never performed its interception: no movement, self-damage, Devotion or
small-hit mana loop. A cancelled spell is not an intercepted zero-damage hit. D-I's payment is exactly
the open D13-1 question; recommend no charge/release a genuine hold, but do not call that approved.

**Counter fails (enemy succeeds the save).** Counter still **executed** and paid in full. Original cast
continues with its retained original result; revalidate D-I's original protected actor, Rocko's control,
range, payability and pending cast. If valid and the timing ruling permits, Intervene **executes**, pays
1 AP +4 mana and changes the pending damage recipient to Rocko. Redirection, actual damage, Devotion/
mana-loop reward and any modified card/heritage behaviour remain GM-resolved, not P7 capabilities today.
Intervene reward conflicts must be ruled, not simultaneously grant nested+2 and damage/10. If invalid,
D-I is unexecuted (case D); do not hit a new Rocko incarnation or refund the failed Counterspell.

**If Intervene had already executed before the counter** under a different approved/manual timing order,
it remains executed and fully paid even if the later counter cancels the spell. This is case C, distinct
from an intention that merely sat in the declaration list. Narration must make the distinction visible:
“Rocko declared Intervene” is not “Rocko intervened”. The choice of ordering changes outcomes and costs;
the worked order does not settle it.

### B. Successful Parry creates Riposte

Use **`universal_parry` → `universal_riposte`**, not an arbitrary weapon special/free-Riposte variant.
Ilse has2 AP; bandit is5ft away and attacks her. Recorded attacker face4/total7; Ilse's d6 Parry records
6 then4 =10. Both comparison interpretations yield a win here, so this example does not decide face vs
total or tie rules. GM attests Parry success; its1 AP is paid, leaving1. No attack HP is applied.

That **actual successful step** generates a new trigger with parent Parry step ID, distinct window W1,
recipient **Ilse alone for her Riposte**, exact original opponent and current5-ft range. Fresh eight
seconds; Ilse may remain silent. The same player caused the parent reaction and may take this follow-up.
A bandit parrying Ilse would unlock only the bandit's own authored follow-up, never Ilse's.

Ilse declares Riposte1 AP. The card uses her weapon die, no modifier (`addAttributeModifier:false`);
take a noncritical face3 for a card-payload3, with **modifier interpretation explicitly unresolved**
against the Laws example. Ignore flat DR/Defend doubling as published; equipment die still applies.
Exact damage/Evasion/special defenses remain GM-adjudicated; no basic-strike2-AP route.

Declaring this counter-attack can itself create the opponent's incoming-attack opportunity, if the
opponent actually holds/payably matches Parry or another matching card. Its own-turn eligibility is
D13-3; do not silently allow/forbid it because the bandit is the active combatant. A successful opponent
Parry could in turn unlock its own Riposte. No universal window for uninvolved players, no second
follow-up from re-delivering the original success, and no forced Pass from Ilse.

### C. Executed reaction becomes unnecessary

Conditional ordering example, not an ordering approval: at the table's explicitly recorded order Rocko
**executes** an early Intervene against the pending spell. Its full1 AP +4 mana payment and interception
are recorded. Marcus then executes his eligible counter; it succeeds and cancels the still-pending spell.
Rocko receives no damage from that now-cancelled spell, but his executed reaction **still cost1 AP and
4 mana**. Do not refund it, downgrade it to a declaration, or fabricate a Devotion/low-damage gain.
If that late counter is not eligible under the final trigger wording, this sequence is unavailable;
the general rule still holds for any legal executed reaction later made redundant.

For a currently playable manual witness, the GM records both executions/payments with existing controls
and labels all effects manual. A future automated witness must identify accepted step receipts before
claiming payment. An animation/selected queue position is insufficient execution evidence.

### D. Declaration invalid before execution

Rocko records D-I while Marcus is an eligible ally30ft away. Before D-I's step begins, a separate accepted
event retires/rebinds Rocko's source attachment (or Marcus moves beyond the chosen range). Retain original
E0/W0/D-I, exact old refs, card/version, declared price/choices, timestamps, any recorded dice, current
revision/refusal reason and the independent event evidence. Do not silently bind the new token or roll anew.

Revalidation refuses D-I; no redirect, damage, Devotion, mana-loop or reaction consequence occurs.
Status: **invalid before execution**, distinct from failed-but-executed counter. Propose releasing a real
typed hold only once server non-execution is definitive. In W **there is no such hold to release**.
Whether this unexecuted declaration pays nothing, full cost or a specifically authored commitment cost
is unresolved D13-1; no automatic debit/refund is implied. If a command was already submitted and its
ACK lost, it is **unknown**, not this definitive invalid case: retain custody and check before releasing.

## 7. Reconnect, restart, unknown outcomes and manual continuation

| Failure / control | Required technical behaviour; policy proposals remain labelled |
|---|---|
| Same-runtime reconnect | Re-read scoped exchange/window/declaration status and exact command receipt; no timer restart, new declaration, reroll or payment. Use `onRoomRejoined` through production `registerRoomJoinedListener`, never add a second `room_joined` listener |
| Duplicate / lost ACK | Same IDs/bytes return prior status/receipt. Different bytes conflict. Preserve private prepared command before emission; no new command until definitive refusal or GM reconciliation |
| Deadline / disconnected holder | Same-runtime reconnect returns to the existing deadline, no fresh clock. W's approved D13-10 is serious-interruption/manual takeover; pause/extend would require a separately chosen larger variant. No timeout spend, invented Pass, effect or free-declaration ruling |
| Server restart | Current approvals and W live-only secrets are not restart-durable. Change epoch; interrupt open/unresolved windows. Recover retained P7 receipts first; never replay an old secret declaration or reconstruct it from public history |
| Unknown partial exchange | List accepted step receipts and exact pending/unknown command separately; accepted steps stay paid. Pruned/no receipt is not proof of non-execution. Keep any genuine holds quarantined until reconciliation, do not automatically release on disconnect |
| Manual continuation | GM sees last known step, pending original action, exact retained rolls/choices and missing capabilities. Record ruling/order/reason and any separate GM P7 commands explicitly. Manual event is labelled attested; unsupported effects do not acquire an “accepted” flag |
| Capacity / chain safety | Proposal D13-9: yield automation after8 scheduled windows or a bounded work/record budget, stop admitting before storage is exhausted, preserve all pending identities. GM may continue the **same** chain in another technical segment or play it manually. No forced tabletop end, lost Parry→Riposte or one-follow-up-per-player rule |

**W narrowing:** no automatic chain or execution-custody recovery in this slice. The fixed same-runtime
deadline on reconnect and D13-10 live-only serious-interruption/manual takeover are approved/implemented.
No pause/extend functionality was selected. Interrupted/unavailable status is not a cancellation/refund
or restart-durability rule. Do not reconstruct sealed choices from public history. All command/partial-exchange rows above
apply only to separate actual executions, not a mere declaration ACK.

W's exact byte/count/time budgets and live-only/private audit treatment are recorded in §11; broader
execution tombstone/replay/continuation behaviour still needs its own freeze. Safety limits protect memory/event loops;
they cannot decide the number of reactions a character is allowed. No silent eviction of a still-retryable
identity. Restart/unknown recovery is fail-closed for automation, not an invented tabletop cancellation rule.

## 8. Class-track inputs and owning extensions

Read current [handoff33](plans/mythrill-class-reconstruction/33_CLASS_DELIVERY_RESET_AND_ENGINE_HANDOFF.md),
[cohorts34](plans/mythrill-class-reconstruction/34_ROSTER_INTEGRATION_COHORTS.md),
[RI-1](plans/mythrill-class-reconstruction/implementation/RI-1-CHAOS-WEAVER-INTEGRATION.md),
[R1 timing/schema29](plans/mythrill-class-reconstruction/29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md),
[CR-L1](plans/mythrill-class-reconstruction/implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md),
[Chaos Weaver C1](plans/mythrill-class-reconstruction/implementation/CLASS-C1-CHAOS-WEAVER.md) and its
[current implementer report](plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/report.md).

- Handoff33 assigns shared authority/execution/persistence to Main HQ; A1b is parked. Corrected A1a
  final evidence is **correction plus verification**, not fresh independent review of untouched code.
- R1/CR-L1 remain **proposed**, not reviewed execution/payment schemas. Their requirements identify
  finite cards/wagers, typed banks, links, entities, transformations and deferred state; not one scalar.
- **Class update, 2026-10-19:**33's workshop-only delivery strategy is superseded by34/RI-1 normal class
  catalogue/detail/learning/talent/HUD integration. RI-1's latest parent checkpoint records independent
  BLOCK/corrections pending for its class HUD/detail/progression work; this is not new shared payment support or acceptance of C1's original
  independent BLOCK. Preserve its source and parent-space checkpoint. C1's optional continuation ID
  is kept out of the sample; declining can return
  that unused option, never primary spent tiles. That class-local convention is not a universal
  unexecuted-reaction refund rule. C1's derived continuation explicitly does not create a new reaction.
- No current document read supplies reviewed live reaction reservations for these candidate domains.
  Before freezing typed payment, Class HeadQ must identify exact reviewed card/domain versions and
  semantics; Main HQ then names the smallest P7/private-state extension. W can retain manual domains;
  it cannot certify generic reservation support by citing prototype JSON.

Combat owns windows, time, identity, scoped transport, binder/receipt integration and manual bridge.
Class owns card wording, per-domain planners/validators, resource representations and presenters;
map/multiplayer owners co-review geometry/lifecycle seams. Before code, list exact shared writes in
coordination. Proposed new scheduler module(s) must plug into existing room authority/writer, not create
an admission/payment service competing with P7/P9/A1a. Private persistence and N-actor lifecycle are
separate named follow-ons, not hidden requirements implemented inside a reaction task.

## 9. Acceptance selection (W completed; wider execution remains future)

**W-only acceptance selection:** exact authored/GM-manual moment and entitled audience; GM bundle
sealed before any player admission and never amended; private choices with no count/arrival leaks;
server8s cutoff/countdown and exact same-deadline reload/rejoin; chosen D13-6b/11/10 branches and lost-ACK
idempotency; correct manual/lifecycle narration; no payment/reservation/roll/effect/accepted-consequence
emission; independent owner/GM/observer privacy and zero resource mutation. A manually attested child
occurrence may be opened without a no-own-reaction restriction; **automatic** Parry→Riposte generation,
ordering, payment and consumption assertions in the wider table below are E1/later, not W acceptance.
W used production handlers/helpers, scoped tests and an optimized App witness after authorization (§11).
B2 and earlier closure acceptance were reused unchanged. Rows that require execution/payment/automatic
eligibility remain future E1 coverage, not claims closed by a declaration collector.

| ID | Required evidence after authorization |
|---|---|
| R1 | No eligible trigger → no window; pre-roll, post-roll, hit, damage and follow-up moments stay distinct; no ordinary ACTION becomes off-turn |
| R2 | Server deadline survives client lag/reload; late/new request refused; same-ID status works; no effect from countdown alone |
| R3 | Reverse arrival orders yield the same approved order; GM bundle fixed before any player choice can be read; premature GM reads/amendments denied |
| R4 | Owner/GM/observer and hidden actor projections: no sealed choices/counts/hash-enumeration leaks in events, snapshots, ARIA, history, logs or checkpoints |
| R5 | Parry success opens exactly one fresh Riposte opportunity for its actor, including same-player follow-up; opponent follow-up chain remains possible; wrong actor/range/card refused |
| R6 | Each A–D branch distinguishes declared/executed/invalid/unknown; full executed costs; unexecuted policy is versioned and explicit; unsupported gains/effects stay manual |
| R7 | Two tabs duplicate declaration, competing spends, stale/rebound targets, lost approval/command ACK and partial exchange: no duplicate consequence or invented reservation/refund |
| R8 | Rejoin uses single production listener; restart/new epoch/pruned receipt unknown never replays; manual continuation preserves accepted steps and pending evidence |
| R9 | Capacity/chain yield stops automation only; GM can continue same causal chain with card-named follow-up intact; no technical cap becomes a round rule |
| R10 | W creates no automatic resource/effect mutations; any E1 command couples accepted payment/effect/consumption under P7, not separate optimistic writes |

**W is frozen and delivered** under approved D13-6b/11/10 and §11's exact scope/limits.
D13-1/2/3 and all card arithmetic stay explicitly GM-adjudicated;
no per-round/card-use cap may be disguised as a technical storage bound. E1 requires Parry/Riposte wording and the
small binder coupling review; further cards need their own approved capability. Published Laws/card
updates follow creator answers in a separately authorized content change. Source/browser review does
not close latency on physical second devices, human urgency/fairness playtest or deployment gates.

## 10. Preparation history

Roadmap's prior8-window/one-follow-up cap, GM-readable in-window declarations, and batch1's proposed
“redirects, defences, rest”/Pass defaults were planning suggestions, never approval. This draft replaces
those assumptions with explicit conditional boundaries and the current HQ secrecy/follow-up direction.
During preparation no application, card, Laws or class-package implementation was changed to make the
examples work. Subsequent W implementation is recorded below; the examples still do not certify execution.

## 11. W implementation and integrated handoff — 2026-10-19

**Bounded handoff complete.** Collection is implemented and verified; reaction resolution is not automated.
**Creator acknowledgement, 2026-10-19:** collector completion is carried forward at this accepted
boundary. E1a contract preparation does not repeat its review/build or add execution authority to W.

### Supported workflow and deliberately manual steps

1. GM opens **Prepare private declaration window** in the combat-owned HUD section, supplies an exact
   causal action/occurrence, one named moment and bound trigger source, and checks eligible primary
   owners. The HUD uses **GM-manual attestation**, not automatic authored-trigger or card-ownership
   detection. API also accepts an authored-attested basis; neither installs/trusts a live definition.
2. GM seals explicit none, or one selected GM-controlled reactor's private bundled note in the HUD,
   then **Seal GM choices and open 8 seconds**. Server admission stores that immutable bundle before
   any owner can declare. The bounded API can bind multiple controlled refs; the HUD's one-reactor
   form is the supported UI. GM must hold the underlying action manually at the correct moment.
3. Invited owners see a generic named-moment countdown, their own ref/intents and no other players'
   choices/counts/hidden source or GM card text. Enter an exact card ID or GM-agreed reference and a
   private note. Declare, correct or withdraw before cutoff; history remains and one current intent
   per exact card reference/occurrence is enforced. Card holding, components, range, affordability and
   semantic aliases are **not certified**. Silence is sufficient; there is no Pass control.
4. Server enforces a full8s monotonic cutoff at installation after all authority awaits. No normal
   early closure, click priority, grace, pause or extension. The client conservatively subtracts measured
   transit time from its estimate and asks the server at zero; client zero does not close a window.
5. Same-runtime rejoin reads the existing ID/deadline/current history, never re-emits a choice. Unknown
   ACK keeps exact bytes/ID for explicit status/exact retry. Binding/role/sequence/issue-order/epoch
   fences reject stale success **and failure** responses. A late failure cannot erase reconciled state.
6. After cutoff the current owning GM receives private review, including withdrawn revisions. Owners
   still see only their own intent; an unrelated observer receives no opportunity/choice notification
   and its own list is empty. All open windows remain reachable; a native picker reaches every retained
   closed review. Neither list/display order nor a declared status supplies resolution priority.
7. GM resolves eligibility, ordering, rolls, prices, outcomes and any supported consequences **manually**.
   W does not execute, mark success, pay, reserve, release, refund, apply HP/conditions, stop/rewind an
   attack, or submit a P7 command. Lifecycle narration is distinct from accepted-consequence narration.
   There is no W execution/payment-recording button: tabletop resolution and independent existing
   resource/consequence controls do not become a certified reaction step merely because GM reviewed it.
8. A real interruption explicitly switches to manual takeover; incomplete player choices are not
   revealed to GM. A GM-attested follow-up is a separate linked window after a closed parent, not an
   inferred Parry success or automatic chain. Restart/authority change is unavailable, not recovery
   of the old secret window. Verified unavailable pending requests retain exact private evidence in
   the client manual-handoff audit and release the active slot; this asserts no execution/cancellation/fee.

**Limits:** server live-only private WeakMap,64 windows/epoch,16 invited primary refs,32KiB owner/window
revision/request budget,8KiB request,120-character labels/500-character notes; no silent eviction. Client
unavailable audit retains up to64 records per current principal in memory, **not reload durability**;
capacity does not become a tabletop use limit or disclose response volume. No card chooser/trusted
definition/price engine, typed class operation, reservation or A1b integration. GM cannot amend its
sealed bundle. No execution automation or public dump of private review. Earlier B2/P12/rejoin boundaries
remain intact. Live Firebase/rules, physical second-device, restart durability, human urgency/fairness
and deployment gates remain separate; no commit/push/deployment was made.

### Independent review and retained verification

- Original **one bounded independent review**: R1–R4 initially BLOCK; related stale-failure/custody/
  test-fixture repair findings were closed. Original report: `p13b-review/review.md`.
- Its **same-review final delta closure** reviewed only the three changed client runtime files/service
  regression and reconciled the retained witness/evidence. Verdict **BOUNDED DELTA ACCEPTANCE, no
  remaining blockers**, carrying the source verdict forward to the final integrated bytes. **3/3 new
  delta probes PASS**; no old server/App/build/B2/class checks repeated. Original RED probes preserved.
- Retained server **9/9 PASS** (7 deterministic clock tests +2 registered-stack tests, including the
  authority-await cutoff race); latest implementation client **3 suites/14 tests PASS** (including the
  unchanged layer regression; overlaps the review's earlier12 client checks). Original final repair
  probes **5/5 PASS**; delta3 are separate new edge coverage, not another audit. Scoped lint/syntax/
  whitespace pass; UI detector `[]`.
- Final detached optimized **Build3 exit0/drift[]**; current W client runtime **build mismatches `[]`**.
  Actual production **GM/owner/observer App4 PASS**, desktop1440 and narrow820×700. Verified real
  transport disconnect/reconnect, same member/window/deadline/revision4, no duplicate declaration,
  exactly one persistent `room_joined` listener, private reveal/manual handoff and distinct child/interrupt.
- Computed h3/h4 `rgb(43,33,22)`, disc markers inside20px padding, narrow panel scrollWidth438 =
  clientWidth438, enabled controls keyboard-focusable/scrollable/hittable; updated screenshots inspected.
- **No resource/typed-class change, no P7 receipt (0→0), private marker strings absent from raw gameState.**
  Every other gameState byte comparison passed after excluding **only** root/map `actorProjection.cut`.
  Earlier failed witness attempts remain preserved. A live-socket `join_room` created a fresh membership
  assignment; the corrected witness uses real disconnect/reconnect/member-ID reclaim and owner-last
  fixture setup for JSON insertion order. No membership/map field is ignored or normalized.
- App uses the retained provider/ownership/lease/cloud fixture. Three intentionally refused Firebase
  `Failed to fetch` page errors (one/principal) are recorded; no other page-error type. This is not a
  zero-error/live-service/deployment claim.

### Integrated identity (uncommitted; bulky evidence outside Git)

HEAD `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`. All artifact paths below are under
`D:/AppData/Temp/opencode/`. No full-repository snapshots or copied evidence asset trees.

| Evidence | SHA-256 |
|---|---|
| `p13b-closeout-identity.json` — final14 runtime/test/witness hashes unchanged after documentation handoff; source/build mismatches `[]` | `32930d12d85e24650531733b9f3aebb30b4cb9f6c79124eff9b829e93afa332c` |
| `p13b-review/delta-review.md` — completed independent verdict | `7cbf8744b207a396a58aaeb05fcb899a33a61d8cd6ecd7c62769e2d01e3478cf` |
| `p13b-review/delta-integrated-hashes.json` — exact reviewed runtime/test/witness + retained evidence | `b27c5a5860271be9e6e82837dbbcd8097ed64e287096b4c35a4685ce606881d2` |
| `p13b-20261019-build3/build.json` — input manifest/exit/drift | `0045e09e20aa66605ff3724ee126d2a221471148907b824435a1ae28b252df4b` |
| Build3/App4 asset manifest | `84547e1ea7d908471eda1aee12d76cc833b48e1b9e56cb815b8acf482e5bbe01` |
| `p13b-20261019-app4/result.json` — retained full-App result | `53b1c1e44627d3e33f66ed1fa81d7dfa66ea77c220116c0f1c187722bef32fa7` |

Key final runtime source identities (full set/tests/witness in the integrated hash artifact):

| Repository path | SHA-256 |
|---|---|
| `server/services/reactionWindows.js` | `195e01aa115371b7a68df779d4d9bf6c21a6a12d340e9333bc3cb50630799c90` |
| `server/handlers/reactionWindowHandlers.js` | `811eb82131a57624503ec38d00a93e0058ff5b760c7cf446727584ec17ab124e` |
| `vtt-react/src/services/reactionWindowService.js` | `66dbc1e579c26ca3d5a9469a8dffb51e76e52bb1b922680e29facae08fe213ed` |
| `vtt-react/src/components/hud/ReactionWindowPanel.jsx` | `eb7910559f471255ae9fa8d638094f21f0151f7916d5f2930818961a8310eb59` |
| `vtt-react/src/components/hud/ReactionWindowPanel.css` | `7f2ef4aa4e58b8c31409c45418368274447ec568814b7b96869b87a0e283eba7` |
| `vtt-react/src/components/hud/PartyHUD.jsx` | `e88b0e3c2b13c1aa3685d20144f0c0b200fe330ec4e1cc63f67160b8f6d87430` |
| `vtt-react/verification/p13/window-app-browser.cjs` | `5959826c578d4b994267b754e4d8baa7ef016c052d14668bb1faec7466b26d72` |

The original report's pending-build/App wording is historical; the delta report explicitly reconciles
the final Build3/App4 bytes. This handoff edits documentation/status only after review, not runtime.

<a id="12-smallest-next-execution-candidate--e1a-not-authorized"></a>
## 12. E1a universal Riposte — frozen implementation contract

**FROZEN and implementation authorized by HQ, 2026-10-19.** One exact primary PC
counter-attacks the particular attacking creature after a GM-attested successful, paid universal Parry.
Original attacker only is an **implementation ceiling**, not a new rule forbidding other tabletop targets.
No Parry automation, generic reaction executor, resource reservation, class migration or A1b installation.
Implementation/verification complete at §13. Future-tense requirements below are the frozen contract,
not permission to widen the profile or claims that arithmetic/trigger integration is automated.

### 12.1 Pinned original card and manual boundary

| Field | Required identity/behaviour |
|---|---|
| Definition | `universal_riposte`, original `vtt-react/src/data/universalCombatSpells.js:386–429`, `REACTION`, damage, one enemy within5ft |
| Source SHA-256 | `89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab` (whole authored source file; also pins original `universal_parry:100–147`) |
| Named capability | Proposed `p13b-riposte:v1`; definition version/hash binds that capability, the exact source SHA and `universal_riposte`. Client ID/hash claims alone confer no authority |
| Riposte price | **Exactly1 AP**, temp-first using existing payment helper; no mana, class price or Spell Reaction surcharge. Never basic strike's2 AP. No Parry debit in this command |
| Rolls/rules | Card says weapon die, `addAttributeModifier:false`, and passive-DR/Defend bypass. Conflicting modifier examples, criticals, mitigation/Evasion/equipment and timing/ordering remain explicit GM rulings, **not new automatic formulas** |

### 12.2 Two entry points, one fresh opportunity and execution path

**A — existing collector declaration:** use a server-held, same-runtime, **closed fresh `follow_up` W**
opened for this particular successful Parry, exact parrier and original opponent. Select its final
non-withdrawn `universal_riposte` intent/revision. Authenticated GM must separately attest the attack,
Parry success/prior payment and that this fresh choice followed that Parry. If binding an already-closed
manual window, chronology is **GM-attested**, not retroactively server-verified; stamp the attestation
now, never rewrite the window's opening/deadline or sealed bundle. A Parry declaration's own old window,
an unrelated window, a label/alias or arbitrary imported text cannot be promoted automatically.

**B — manually opened Parry follow-up:** GM explicitly chooses **Attest Parry and offer Riposte**. The
server registers the structured attestation and opens a fresh W through the **existing collector**, with
its GM precommit/explicit-none rule and the full approved8s. The owner may declare, correct, withdraw or
remain silent. After close, use exactly path A. This is a manual opener, not automatic trigger integration.

Both entries resolve to **one server-owned `opportunityId`** for the same canonical
`(room/action epoch, attack occurrence, Parry occurrence, exact parrier incarnation, pinned Riposte)`.
Duplicate opens/adoptions return that opportunity's status, not another timer or another right to execute.
The actual closed intent/hash is attached, never copied into a newly manufactured declaration. Silence,
withdrawal or an interrupted/missing W yields manual handling, not an invented Riposte.

**Timing:** successful Parry offers a fresh **choice**, not an automatic counter-attack. The8s starts at
the actual follow-up opening, not retroactively at a guessed Parry time. It is time to **declare**, not
complete rolls, approve damage or execute. No extra execution deadline, grace, same-window carry-over
or renewed8s is invented. GM attests current timing/own-turn legality and revalidates after changes.

### 12.3 Bound records and consent (private except executed-result projection)

| Record | Immutable bindings required |
|---|---|
| Triggering attack | Particular server-known command/offer/occurrence ID if available; otherwise a server-issued **GM-manual occurrence**, exact creature attacker and PC defender refs/incarnations, retained attack-roll reference and explicit manual provenance. No pretend automatic attack feed |
| Parry attestation | Server-issued attestation ID/revision/hash; exact attack occurrence, `universal_parry`, exact parrier/opponent; `success = GM-attested`, `priorPayment = GM-attested-paid`, payment note/optional existing receipt locator. Server stamps current authenticated GM/session/authority epoch/time; never trust a client-supplied GM UID/checkbox alone |
| Payment provenance | UI/history: **“Parry success and prior payment: GM-attested; Parry not charged by E1a.”** Optional generic AP receipt can support a debit but does not automatically prove it was this Parry. GM reconciles prior payment with authoritative room pools using existing controls before consenting to Riposte; E1a never repairs or repeats that debit |
| Opportunity | Opaque server ID + canonical cause key, current room/action epoch, attestation hash, exact source/target, W epoch/ID and final non-withdrawn intent revision/hash, card identity, status. A closed W alone proves neither Parry success nor payment. Same cause through A/B is one opportunity |
| Owner approval | Exact primary owner/session, opportunity/attestation/definition hashes, **1 AP**, exact creature target/incarnation and weapon/roll snapshot. Fresh consent on material change; no generic “allow reactions” flag. Approval records no payment/hold. One active consent per opportunity, not one reaction per player/turn |
| Roll/GM command | Retain physical/digital mode, exact die model/faces and recorded weapon context in private custody **at roll time, before emission**. Reuse supported P12A roll recording, not its damage/proficiency assumptions or extra mandatory rolls. GM signs hit/miss and nonnegative final damage/ruling; miss requires0 damage. Exact command ID/bytes retained before submission |

Reuse P12A's8KiB approval/chosen-result bounds and GM final-damage range0–100000; reject malformed or
unknown fields. Capacity refusal is explicit/manual, never silent history loss or a tabletop reaction cap.
Canonical manual parent provenance is server-issued and origin-epoch bound, not the GM's descriptive
reference text. Register through `actor_riposte_parent`; offer must present that live parent ID/nonce/
origin epoch. Current transport epochs cannot renew old canonical parents, including via a newly opened
window. New manual-event registration is explicit, never a retry. Original-epoch registration bytes are
retained before emission and never rewritten after reconnect/restart. Existing closed-window adoption
must identify a real same-runtime follow-up; unknown old canonical cause IDs are not imported as new labels.
Unsupported weapon/dice models remain manual. No new die, explosion, proficiency roll or miss percentage
is invented. Existing recorded evidence survives targeting, consent, stale-state and recovery changes;
an incompatible old weapon/context is preserved as unusable/manual evidence, not silently rerolled.
Recording a roll proves neither payment nor non-execution at the table. GM distinguishes prepared
evidence from a separately performed reaction; any already incurred manual cost remains adjudicated.
Do not reuse basic-strike withdrawal wording to claim Riposte was free or erase an executed attempt.
Source/target legality,5ft, sight/obstruction, modifier/mitigation and original paid-success facts are
GM-adjudicated. A hidden/non-entitled target is outside this first UI's execution support, not a new
tabletop blindness rule. No private parent roll, losing declaration, GM plan or payment note goes public.

### 12.4 One P7 admission, one consumption

1. Reuse the current P12A/P9 owner-approval transport, strict hashes/ID collision checks and GM-only
   `actor_consequence` path. **Known exact receipt first**, before live-opportunity/epoch checks on retry.
   Current P12A cannot execute this by swapping its price: its binder fixes2 AP, `derive`, proficiency
   and defense rules. Add a strict **named E1a branch**, never an owner-controlled generic AP override.
   A command claiming E1a's definition/opportunity must require that branch's approval/proof; omitting
   approval cannot downgrade it to permissive GM admission. Generic manual adjustments neither consume
   the opportunity nor receive an accepted-Riposte label.
2. After all authority awaits, recheck current GM/member/owner, exact actor refs/CAS, pinned card,
   structured attestation, closed W/intent, consent/roll hashes, current manual ruling and unconsumed
   opportunity. No await may separate final checks, admission and consumption. No automatic ordering.
3. Derive only the1-AP temp-first debit and approved damage's temp-HP-first/clamped HP result. One
   staged P7 command contains exactly **source AP + target HP**. No healing, mana/class operation,
   condition/buff/debuff, wear, movement, reward, proc or extra recipient. Reject extra operations;
   show unsupported extras explicitly **unapplied**, including weapon critical/fumble follow-ons.
4. Stage the receipt's opaque opportunity-consumption identity **with those AP/HP values** in the
   existing P7 `next`/receipt, then install through the existing admission/writer. The receipt is the
   authoritative consumed record; synchronously close consent/opportunity bookkeeping in the same
   non-yielding turn, before reply. Refusal installs neither cost, HP nor consumption. Accepted paid miss
   still consumes the attempt and costs1 AP. Already accepted outcomes cannot become cancellation/refund.

Reserve bookkeeping/tombstone capacity before admitting an opportunity (not resources). Keep a
never-evicted consumed/cancelled identity for the live epoch, including after ordinary receipt pruning;
different approval/command IDs or entry A/B cannot reuse it. Two tabs have one active prepared attempt;
stale replans may use a new command ID only after the old attempt is definitively not installed and
its consent is closed. Unknown outcomes cannot be bypassed with another ID. Preserve existing P9/P12B
cross-capability ID guards. No second payment ledger or independent cloud ledger.

Full attestation/parent proof stays GM/owner-private. Do not put it in `chosenResult`: current
`publicReceipt` copies that string. Define an E1a executed-result whitelist with only the opaque
unpredictable opportunity ID, actual Riposte AP/HP/result and manual/unapplied labels; no private cause
IDs/notes/GM choices. Protect proof hashes against enumeration with private unpredictable binding data;
do not expose a hash of guessable sealed choices. Receipt history/P13A must say **accepted Riposte** only
after its receipt, not merely on declaring/reviewing. E1a does not verify the prior Parry automatically.

### 12.5 Cancellation and failure contract

| Situation | Required behaviour; no new tabletop fee/timing policy |
|---|---|
| Before cutoff | W correction/withdrawal rules unchanged. Only the final non-withdrawn intent may bind. Closing/silence submits no execution |
| Owner withdraws execution consent / GM declines before admission | Close that approval, retain rolls/bytes; no E1a mutation. This revokes execution consent, not the closed W declaration or any manual debt. After cutoff GM handles timing/cost. Reconsent for a corrected still-valid attempt uses the **same opportunity**, not a fresh declaration or reroll |
| GM cancels opportunity / takes over manually | Terminal for this opportunity's E1a path; retain audit. Close it before manually performing Riposte elsewhere. Independent manual adjustments are not certified E1a execution. Any unexecuted-declaration fee stays manual, not ruled free |
| Cancellation races execution | At the synchronous admission point either cancellation wins and command refuses, or receipt wins and cancel/status returns accepted. Never refund/undo an installed step; prior Parry remains paid |
| Stale AP/HP, changed geometry or rulings | Refuse/no mutation; retain original rolls and old immutable command. Refresh/revalidate with GM. Same exact actors/weapon and usable evidence can be reconsented without reroll after definitive refusal. No auto-resubmit when resources return; no extra execution clock |
| Rebound source/target, incompatible weapon or invalid cause | Do not transfer to a replacement incarnation, target or another Parry. Preserve old evidence; stop for manual handling. No new window/roll to salvage the old attempt |
| Lost approval/command ACK, duplicate or delayed delivery | Check same ID/bytes/scoped status. Exact known receipt returns once; changed bytes conflict. Unknown is not refusal/non-execution and must not free the opportunity for another command |
| Same-runtime reconnect/reload | Restore private scoped custody and re-read via existing single-listener rejoin bus; no auto submission/roll/payment/new timer. Original W may be closed while rolls/adjudication continue. A recovered receipt is history, not a replayed animation |
| Restart / authority or GM-principal change | Live attestation/opportunity/consent cannot be reconstructed from free text, public history or a client blob. Recover exact retained/checkpoint-confirmed P7 receipt first; if missing/pruned/unknown, stop for GM reconciliation. **No execution/reissue of the pre-restart opportunity**, new IDs or fresh8s as a retry. Live-only acceptance is not crash durability |

### 12.6 Existing seams and future write coordination

- `strikeApprovals.js:51–108,202–245` / `actorConsequenceHandlers.js:430–525`: reuse approval registry/
  authenticated-owner consent/withdrawal/list/collision machinery with strict capability discrimination;
  a small named Riposte validator/attestation helper is permitted, not a new engine. Separate opportunity
  lanes must not let basic-strike pending custody impose a new no-own-turn/one-follow-up rule.
- `actorConsequences.js:247–272,339–354` / handler `:222–265`: named binder, existing receipt-first
  recovery, single P7 AP/HP installation and synchronous close. Opportunity consumption is a receipt
  identity plus bounded live bookkeeping, not a separately committed resource effect.
- `weaponStrikeService.js`, `weaponStrikeCustody.js`, `spellConsequenceCustody.js` and
  `actorConsequenceService.js`: reuse scope fencing, retained-roll/prepared-command helpers, scoped native
  storage and existing request/submit/status. Use a capability-separated sibling custody lane; do not
  overwrite/migrate accepted basic-strike records or create an offline replay queue.
- Existing `reactionWindows.js` gets a **read-only closed-intent lookup / same collector opener** for
  the bridge; W's public events, cutoff, seal and completed identity remain protected. New GM attestation
  registration uses existing actor handler authority checks and authoritative event/room-payload/rate
  routing; owner card text is never its substitute.
- Future affected shared owners: Combat P7/approval/controller/custody + W host; multiplayer single
  rejoin bus; P13A named receipt presentation. Announce exact file writes before any code. Universal
  card bytes stay read-only; any content change needs an agreed Main/Class HQ handoff. Class retains
  class content, typed domains and RI-1 corrections; no Wizard, authored-ID/save migration or A1b work.

### 12.7 Blockers, future acceptance and broader roadmap

**No new arithmetic, mitigation, ordering or fee answer blocks this GM-adjudicated contract.** It still
has explicit HQ approval/freeze and execution-code authorization for this slice only. The named attestation/opportunity
gate, strict consent branch, coupled receipt/consumption and privacy projection are required engineering
work, **not capabilities already provided by W or by reusing a basic-strike button**. If any cannot be
coupled at existing P7 admission, stop instead of shipping sequential cost/damage/consumption commands.

After authorization, focused tests must exercise both origins/duplicate-cause convergence, fake name-only
and wrong-parent/no-approval rejection, fresh8s choice without auto execution, no second Parry debit, exact1-AP/HP
and paid miss, consent/cancel/authority races, stale retained rolls, lost ACK/two tabs, scoped rejoin,
restart/pruned-receipt fail-closed and no private proof in projections. Use production handlers, a bounded
App witness/build and one independent slice review; reuse unchanged collector/P12A/P9 evidence.

| Broader track | Remains future, not an E1a support claim |
|---|---|
| Eligible-card highlighting + actual triggers | Reviewed per-card predicates, real causal attack/hit/damage events and entitled hand/card UI; no automatic eligibility from names/tags |
| Counterspell/Intervene + later chains | Exact moment/variant, saves/redirect/rewards/typed prices and later reaction opportunities; no universal priority or automatic chain |
| Shared condition/buff/debuff lifecycle | Existing P7 record operations are not common turn/round/expiry/proc/stacking automation; E1a extras remain unapplied |
| Obstruction + broader propagation | B2 §14 authoritative LoS/LoE/cover/elevation and §9–13 per-profile chain/bounce/seeking/spread/lifecycle work remain separate; advisory geometry is not traversal or validation |

## 13. E1a implementation and verification — 2026-10-19

**Implemented, bounded independently source-accepted, optimized App verified.** Original
`universal_riposte` only, one owner primary PC → its particular attacking creature. Explicit
owner-consented/GM-adjudicated execution, not automatic Parry, eligibility, ordering or a reaction engine.

**Creator records E1a complete at this boundary, 2026-10-20.** Shared-condition contract preparation
reuses these identities/evidence unchanged: no repeated E1a acceptance/review/build and no backfilled
condition effects. P14-C1 is separate proposed integration, not a widening of Riposte.

### Actual player/GM workflow

1. GM opens **Riposte execution — structured opportunity**. Enter descriptive attack/Parry references,
   exact parrier/original creature attacker, explicit success/paid/timing confirmations, private payment
   note and optional receipt ID. Server issues canonical originating-epoch parent IDs/nonce. References
   are not execution authority; changing transport epochs cannot renew an old canonical parent.
2. **Fresh opener B:** attest and offer opens the existing collector's fresh8s follow-up, sealing explicit
   no additional GM declarations. Owner chooses `universal_riposte` or silence; corrections/withdrawal
   and cutoff remain W's rules. No cost, parent debit or automatic counter-attack from offer/closure.
3. **Closed-entry A:** select a real same-runtime closed fresh follow-up whose source/audience/cause
   match the parrier, with final non-withdrawn `universal_riposte`. Its structured GM parent attestation
   binds to the same gate **without** a second window. Legacy human-reference chronology remains
   GM-attested; unknown old canonical cause IDs cannot be imported into a new current-runtime window.
4. Owner opens the same execution panel, records physical/digital weapon faces once, then explicitly
   approves the exact original target and1 AP. Only supported P12A weapon/roll encodings are reused;
   **no proficiency roll or basic-strike damage/mitigation formula is imported**. The unmodified universal
   profile is the support boundary; variant/extra typed prices remain manual/outside it.
5. GM selects hit/paid miss and final damage and confirms current eligibility/arithmetic/mitigation.
   **Execute approved Riposte —1 AP and HP once** uses the shared strike approval/P7 command path.
   Admission couples1-AP temp-first debit, target temp-HP-first/clamped HP and opaque once-only
   opportunity consumption; paid miss costs1 AP and changes no HP. Unsupported extras stay visibly
   unapplied. Prior Parry success/payment stays **GM-attested**, never mechanically certified or debited again.
6. Exact command/approval IDs and bytes are retained before emission. Unknown outcomes permit same-ID
   checking only; reconnect reads status without resubmission. Stale affordability/positions/ruling require
   explicit GM revalidation/new owner consent with the **same** retained faces. No execution timer is added.
7. Consumed/cancelled opportunities cannot be reused through aliases, duplicate attestations, new windows,
   the other entry path or a replacement command. Restart discards live authorizations: retained exact
   P7 receipts recover first; unknown/pruned old provenance stops for manual reconciliation, not a new
   parent/opportunity. New explicit manual-event registration is not replay of old canonical provenance.

**Manual:** actual trigger/Parry truth, prior payment semantics, card ownership,5ft/enemy/obstruction,
hit/miss, modifier/critical/mitigation/equipment interpretation, order, own-turn permission and unexecuted
fees remain GM rulings. Optional receipt is checked for existence/room/parrier linkage; that does not
prove which tabletop action it paid. GM must reconcile source pools before consenting to Riposte.
E1a neither stops/rewinds the original attack nor applies conditions, buffs/debuffs, wear, movement,
ammunition, class gains or later procs. The collector remains a separate collection/history display;
only explicit E1a execution has an accepted AP/HP result. No A1b/class migration was installed.

### Engineering safeguards exercised

- Current-GM attestation after fresh authority checks, immutable originating-epoch manual parent IDs/
  nonce and canonical actor incarnations. Wrong parent/actor, name-only aliases, old provenance with
  refreshed transport epochs and imported old canonical IDs are refused.
- Parent/attack/window indexes plus private canonical receipt fingerprints prevent duplicate executable
  rights across attestations/windows/origins. Full parent notes/proofs never enter public receipts or
  narration. Public E1a receipt whitelist excludes private keys/offer hash/command and approval hashes;
  inconsistent generic/manual E1 claims refuse and old inconsistent proof projections are withheld.
- Per-principal/opportunity preparation serialization **and** strict actual custody boundary: unknown/
  accepted ID replacement or changed bytes refuses, omitted family entries survive, archived old refused
  attempts stay immutable (16 history bound, no eviction). A user-only scoped-native sibling family
  preserves basic-strike custody; no save migration/offline replay queue.
- Existing P7 known-receipt-first recovery, authority/owner/CAS checks, shared approval namespace,
  receipt/consumption installation and synchronous close; no sequential cost/damage/consumption commands.
- Pre-cutoff GM opportunity polling reveals no intent revision/count. Retired binding/role/scope and
  stale response/failure fences preserve current consent/custody. Basic P12A stays2 AP.

### Verification and independent review

| Check | Observed result |
|---|---|
| E1a server | **14 PASS**:10 deterministic unit +4 registered-stack cases; both entries, refreshed/pruned restart, duplicate parents, wrong actors, bad receipt, insufficient AP, paid miss, cancel, stale reapproval, privacy |
| Affected server regressions | **44 PASS**: P12A13 +P9 9 +P12B22; **58 total distinct server checks** with E1a. Existing completed project acceptance is reused, not re-audited |
| Client | **6 suites/27 PASS**: RP execution/service/real custody/UI, accepted feed and retained strike rolls. Scoped lint0 errors/0 warnings |
| One bounded independent review | Initial3High BLOCK (restart provenance, concurrent custody replacement, generic downgrade) repaired; residual custody/history removal blocker repaired; **final ACCEPT**, original RED evidence preserved |
| Same-review identity handoff | **Carry existing ACCEPT**,21 original accepted inputs stable;15 runtime/9 test path coverage + witness/support/evidence hashes. No new tests/build/App audit in this reconciliation |
| Production build | Detached direct optimized **Build1 exit0/drift[]**, external output, no source snapshot/copied evidence asset tree |
| Real App | **App2 PASS**, GM/owner/observer1440 and owner820 bounds; real fresh-opener B/closed-entry A, exact1-AP payment, HP/absorbed float +P13A narration, missing-ACK/reconnect/retry and paid miss |

**Concrete App evidence:** independent manual P7 prior-Parry payment occurs before each attestation;
E1a hit changes temporary AP2→1 with normal AP2 unchanged, target temp HP4→0 and HP30→27 for GM
damage7. Live feedback is `−3 HP` and `4 absorbed`; one P13A history entry says Riposte, AP−1 and those
deltas. Both GM ACK and accepted-handler delivery were dropped; real GM transport rejoin retains exact
command bytes and one persistent room_joined listener; explicit retry returns the same command at
commitSequence3, no second payment. Closed-entry adoption adds no window. After a competing AP spend,
refusal creates no receipt; explicit revalidation/new consent retains digital `[7]`; paid miss takes
AP2→1 and leaves HP27/tempHP0. Captured owner/observer RP/accepted payloads contain none of the private
parent markers. No unrelated observer execution control is exposed.

App1 is retained as a locator failure (two accepted-text elements); the corrected locator scopes the
exact opportunity without production changes/assertion weakening. Screenshots/ARIA were inspected.
Three deliberately refused Firebase fetch errors (one/principal) remain recorded; no zero-error/live claim.

### Exact source/build identity and coverage

Concurrent commits advanced the checkout from initial `8ba81efb…` to recorded build HEAD
**`f9527d315f0a5fd338bc29bc0efee493285e58d7`**. This agent made no commit/push/reset/deployment and
preserved other writers' changes. Exact reviewed working-tree hashes, not HEAD alone, identify E1a.
Artifact base: `D:/AppData/Temp/opencode/` (all bulky output external).

| Artifact | SHA-256 |
|---|---|
| `e1a-closeout-identity.json` — current15 runtime hashes, source/test/witness identities, build/Git-source reconciliation and results | `6896b1781e20300c992696c88ea042294ac2f108a41f12f40c0fd481a3e5e217` |
| `e1a-review/final-review.md` | `613f12b447681ebcd2fb8c224145fc54a21c5bafbc073738bba9217023a9c4e4` |
| `e1a-review/integrated-review.md` | `f4fe21c0e1dd077cc55ae783f8bc328ab01dd183d61ce80204b0760e413540a4` |
| `e1a-review/final-integrated-hashes.json` | `742186e52cd6569d5864e4cb18da0815a7b1c826f1c310de621a583338c48e18` |
| `e1a-20261019-build1/build.json` | `f18f027368916444eaff16e35421676340bf1d34b652da571994b3c50570c5eb` |
| Build1/App2 asset manifest | `d696977c4e08b288e38740a8608b1474c6e55bf04fe6b108ac0aca99b20f64f4` |
| `e1a-20261019-app2/result.json` | `8fa8bddca8167bf21ec8c7ae9e1efa7a5c5d03280d47e347dfd3c2d3aca29868` |

The existing build runner hashes changed/untracked paths plus fixed dependencies, not a full tree.
The reviewer records three clean client sources absent from that list: RP pure execution,
privateStorageRegistry and acceptedResultFeed. Identity-only closeout matches their raw Git blobs at
recorded HEAD (commit20:44Z, before build21:15Z) to current/reviewed bytes; the other five E1a client
runtime paths match build.before/after. No reviewed source drift. This augments the older report's
coverage limit; it is **not full-repository reproducible-build equivalence or acceptance of concurrent
class/race edits**. The witness hash is recorded at handoff; its historical result does not itself
cryptographically record a witness-source hash at execution.

### Remaining limits / broader roadmap

Live-only parent/attestation/collection state remains bounded; device command/roll custody is existing
private recovery, not live cloud/private restart durability. GM manual statements are not independent
proof of a physical event or prior payment. A new explicit manual event is not permission to replay old
canonical provenance. No automatic card inventory, trigger highlighting, comparison/mitigation,
ordering, refund or full chain. P13A feedback is receipt-based; RP execution and collection history
remain separate displays. Captured wire assertions are the RP/accepted-event subset, not all-network audit.

Provider identity/canonical ownership/leases/cloud persistence are fixture boundaries; manual pool setup
and human Parry adjudication are inputs.820px checks are bounds/overflow, not physical-device/exhaustive
responsive validation. Live Firebase/rules, human urgency/fairness, private restart durability,
second-device and deployment gates remain separate. The broader roadmap in §12.7 stays future.
