# CR-L1 — authoritative lifecycle design contract

**PROPOSED technical contract for HeadQ review; not an implementation authorization.** These are named extensions of the existing room/actor consequence architecture, not a parallel combat system. Split implementation into domain/event cohorts after approval.

## Current boundary and source evidence

P7 validates at most two actors (`server/services/actorConsequences.js:118–178`), condition records with manual shared timing, and strict named P9/P12 extensions. P12B adds equipment declarations/wear; it does not add arbitrary objects, summons, links or automatic timers. `stage:259–272` selects a named approval binder and cross-domain identity gate; handler `actor_consequence:218–258` confirms authority, stages, admits, consumes approval synchronously and publishes accepted receipts. Reuse that ordering/custody.

## Proposed ownership and state envelope

```text
ClassDomainHome = {
 version:1, domain, rulesetVersion:"cr-review-r1",
 owner:{uid,characterId,primaryActorRef},
 revision:safeInteger, state:domain-specific JSON,
 lastOwnTurnId, lastCompletedRestId,
 pendingActionIds:[bounded exact IDs],
 lastAppliedEventIds:[bounded replay-safe IDs]
}
ClassEffectObject = {
 version:1, kind, objectId, instanceId, ownerActorRef,
 domainHomeRevision, sourceDefinition:{id,version,hash},
 createdCommitSequence, boundActorRefs[],
 payload:strict kind-specific JSON,
 remainingUses, expiry:{ownerActorRef,ownTurnCounter,boundary},
 status:"armed"|"triggering"|"consumed"|"expired"|"dismissed"
}
```

These are proposed **new typed structures**, not accepted P7 fields. Exact record-size/cap validation is mandatory; use domain limits rather than an unlimited effects array. Public presentation is derived; private deck order/hand and pending choice are absent from observer payloads, not hidden by CSS. Full server checkpoint privacy requires a server-only/private storage projection, not simply writing secret data into a Firestore room document every member can read.

While attached, room state owns resource contents, commitments, active effects and admitted actors. Personal state owns learned/prepared catalogue and outside-room snapshot. Accepted receipt updates the matching personal projection; concurrent sheet edits become recovery candidates as P9 already does. A stale personal snapshot cannot overwrite a newer room domain home. Switching character/account/map binds a new exact principal; it does not retarget pending actions.

## Proposed action/event identity

```text
Intent = {id,roomId,actionEpoch,sourceRef,definitionId/version/hash,
 sourceDomainRevision,targetRefs,declaredChoices,recordedOutcome?,phase}
Event = {id,roomId,actionEpoch,commitSequence,kind,
 originalActionId,sourceRef,targetRefs,beforeRevisions,afterRevisions,
 derived:false|true,causalityParent?,publicOutcome,privateOutcome?}
EffectUse = {originalEventId,effectObjectId,useOrdinal}
```

Effects match an actual admitted original event, never a local card click, notification, animation, raw broadcast or replayed dice widget. A derived burden or cascade is tagged and cannot create fresh resource events recursively. Duplicate effect-use keys are consumed in the same authoritative installation as the resulting state. Bounded dedup storage may prune only when its retry/replay floor makes old actions unexecutable; never evict a key while replay could spend again.

R1 Anomaly/Returning Path also exclude derived continuation movement. The primary Shift branch's paid legal movement is original; Cascade's optional ally follow-up is derived. Every movement step must carry that explicit classification—do not infer it from visible token displacement. Remaining movement is consumed and reduced no lower than0.

## Immediate versus deliberately staged actions

- Ordinary immediate actions can validate, select server RNG, stage costs/effects and install **one accepted result**; selected stake/cards still precede the unseen random selection. Do not introduce partial payment merely to animate a wager.
- A delayed Underwrite/anomaly/link is an **accepted setup action**, not a failed immediate cast: its AP/reservation is committed by the setup receipt, then a later exact original event consumes/settles it under its authored terms.
- Cascade has an explicit committed sample/result and optional post-result choice. If implemented as a staged action, its accepted commitment and immutable result survive interruption; declining the optional continuation never cancels/rerolls the primary. The UI must say “committed, result pending/choice pending”, not “failed—nothing spent”.
- Rejected precommit validation leaves all pools/contents/effects unchanged. No automatic refund after an accepted commitment or consequence. A technical unknown result is reconciled by the same intent ID, not by resetting the class.

## Lifecycle matrix

| System | Authoritative owner/state | Trigger moment | Cancel/expiry | Dedup/reconnect/persistence |
|---|---|---|---|---|
| Fate links | Owner domain token ledger + exact linked object, endpoint consent/range/use/expiry | Original assigned damage after original mitigation and before both temp/HP assignments | Owner cut costs1 AP/recovery; consent withdrawal before trigger disables; invalid endpoint declines routing; natural expiry releases tokens | Consume originalEvent+link+use once; checkpoint full link/reservations; reconnect does not recreate/refresh it |
| Summons | Caster Muster/capacity/orders + admitted creature actor/incarnation/template + pattern vitality | Manifest/command; actor HP changes on any accepted attack also update its underlying pattern in the same stage | Paid dismissal/encounter closure releases capacity, retains vitality; defeat exhausts; no free re-summon HP | Creation ID cannot make two actors; command marks actor-used/caster AP/orders together; checkpoint identities/HP; never reconstruct from a HUD cache |
| Body transformation | Druid's proposed slot/trait/suspension/strain home; Lich trait/stage/anchor/vulnerability home | Accepted transition changes permissions before dependent attack/ward, or an explicit boundary | Paid recover/veil; required-trait loss cancels dependent permission; damage/expiry ends mimic; suppression expires at exact own turn | Snapshot includes exact active/suspended traits and costs; only Druid's name is approved, no lifecycle implementation or ID migration |
| Delayed Underwrite | Caster escrow/card + exact eligible ally event/expiry | Ally's next original single-d8 damage result, before assigned amount finalized | Cancelled/absent eligible action at expiry consumes stake; no new roll/refund | Stake chosen before face; original event pays once; retain private card/escrow across reconnect |
| Chaos anomaly | Two exact bound tile IDs + one visible finite zone/object | First original confirmed enemy voluntary entry; draw fixed declared set once | Trigger, endT+2 or paid1-AP dismissal sends bound tiles to spent; Fracture penalty persists through next caster turn END | Duplicate movement/hydration cannot trigger; draw retained; server geometry/visibility or GM-confirmed event required |
| Hunter return path | Exact quarry, named committed glaive, one finite segment and consumed tags | Bound quarry's first voluntary crossing only | EndT+2/dismiss/quarry retirement returns weapon, no evidence refund | Exact movement event+path consumed once; weapon instance cannot simultaneously be thrown/equipped in another action |
| Lich return | Actual anchor integrity/status plus life-state and paid return record | GM-confirmed death, not every HP0 update | Eligible return pays6 ->dormant; destroyed anchor/mortal window prevents it; completed rest at anchor returnsHP1/stage0 | One death event, one payment/return record; no replay revive, new turn or anchor duplication |

A reconstructed Lich body receives a fresh explicit actor attachment/incarnation at completed recovery; old corpse refs/approvals remain retired. The canonical character/anchor history persists, but old pending commands cannot target the returned body by name or reused token ID. This is a proposed recovery extension, not current P7 resurrection support.

## Atomic coupling requirements

1. Link routing generally involves attacker payment, protected actor, bearer and Weaver's link/home: **up to four actors/owners**. Recommend one bounded atomic N≤4 plan for this capability, with domain-effect object included. The current two-actor P7 cannot do it; sequential commands are not an equivalent fallback.
2. Retainer command couples caster AP/orders, manifested actor used/vitality and target consequence. Coordinated Muster can involve caster, two actors and target. Creation/removal must share capacity/pattern updates, not a later optimistic token_created event.
3. Generic attacks against a manifested actor must update pattern vitality before the same stage installs. A post-receipt listener is too late to preserve the invariant. This requires an owning-domain projection hook in the existing staging transaction, with a narrowly validated template relationship.
4. Lich physical anchor is an exact owned object/item instance with a validated location/status. It is not automatically a valid P7 actor kind. Define a narrow class-object projection/attack adapter before accepting anchor damage; do not invent an unreviewed general entity engine or fake it with an arbitrary creature token.
5. Movement and weapon commitments need typed ownership/geometry. Current map previews and manual token movement cannot prove an eligible authoritative event. Until supported, GM explicitly confirms the event and consequences stay manual.

## Turn, rest and object-boundary operation table

| Operation | Exact effect |
|---|---|
| own-turn start | Release due recovering threads/suspended traits; expire start-boundary wards/mortality; reset the actor's documented usage/order/evidence counters once; Gambler draws into up to2 empty sockets only |
| own-turn end | Expire end-boundary objects at their recorded counter; do not use client seconds to advance other actors' turns |
| completed long rest | Unique approved restID; apply only class-specific reset/repair; retain no unresolved action without explicit reconciliation |
| encounter close | Stop temporary manifestations/links/evidence according to class rules after settling pending operations; no Gambler/Chaos collection refill or Lich integrity refill |
| class change/migration | Wait for unresolved commitments/entities; preserve original save/home; explicit destination draft and fresh binding rather than overwrite |

Required chassis operations, separate from the42 authored representative spells: `dead.dismiss` (1 AP, retain pattern vitality), `anomaly.dismiss` (1 AP, bound→spent), `quarry.pathDismiss` (1 AP, return committed weapon/no tags), `hunter.basicCompanionOrder` (1 AP, one actual companion action/shared tag cap), `lich.veilFootMove` (one5ft legal gap/own turn while trait active), `lich.returnAfterDeath` and `lich.completeDormantRest`. They must have strict validators/records too; menus are not a permission bypass.

The proposed Alchemite Chaos edge adds a separately named `heritage.varianceSwap`: once/completed rest, before commitment, exchange one spent with one available differently-symbolled tile, consuming one actual spare part and applying movement−5ft until next own turn, at0 extra AP. It changes neither symbol/count nor committed/bound state. It requires the same owner/domain CAS plus typed inventory-cost support; the existing advisory heritage route cannot execute it. Other proposed native edges likewise require their own closed benefit/cost consumers.

## Cancellation and failure cases

Before acceptance: invalid target/resource/consent/geometry refuses without mutation. Accepted setup: its explicit expiry/withdrawal cost applies. Unknown acknowledgement: keep exact intent/result/remaining choice; retry same identity. Stale revision: revalidate old recorded facts, do not reroll/redraw. Lost authority/owner: stop admitting new steps, preserve committed state. Room restart: recover checkpointed commitments or report unresolvable unknown; never assume memory-only pending data was durable. Temporary rooms remain live-only as today.

If a target retires after an accepted commitment, settle/expire under the authored rule and record no-effect/invalid-target; do not silently choose another target or refund. An accepted attack already applied cannot be undone by severing its now-consumed link. GM override is another admitted correction with reason, not mutation of old receipts.

## Required verification before any capability is called supported

Each domain: exact positive transition; malformed/unknown opcode/version; full/incompatible/empty state; duplicate original event; simultaneous spend; stale target/trait/path; disconnect before/after commit and after RNG; lost ACK; private owner versus observer snapshot; checkpoint reload/restart; expiry replay; source/character/class switch; current P8/P9/P12 regressions. Link assigned/applied amounts and summon pattern vitality get conservation checks, not only visible bars.

Candidate code targets are existing actor consequence staging/handlers/projection/checkpoint/custody owners plus new domain-specific pure validators/planners and presenters. Exact implementation files are frozen per later bounded cohort, not by treating this multi-domain lifecycle contract as one giant coding task.
