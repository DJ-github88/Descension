# Seven-candidate review rules and canonical serialization proposal — R1

**PROPOSED for Class HeadQ review. Not current Prism canon or application implementation.** This R1 and the R1 sections in the seven dossiers replace their archived investigation-v0 mechanics. Keep v0 as decision history; do not mix its limits, names or examples into R1. Animist/other candidates remain in the continuing plan.

**Approved naming exception:** the bodily-transformation class is **Druid**, not Metamorph. Only its player-facing name and selective familiar-naming principle are approved; economy, specializations and natives remain proposals. Existing `metamorph`/`metamorph-body`/`cr1_metamorph_*` references below and in JSON are retained provisional technical identifiers, not player-facing names or approved final application IDs. Shaper compatibility is preserved. [Decision scope](31_CREATOR_NAMING_DECISION_DRUID.md).

## Shared assumptions for legal examples

- Current first-table **4 base AP** per own turn; examples have no temporary AP, no off-turn spending, no automatic heritage AP additions and no carried AP. Each row starts4 and records actual expenditure/remaining AP. Other resources carry exactly as shown.
- Each example is a level3 character with one primary tree, its representative signature learned at a tier requiring10 points in that tree plus its1-point node (11/15 points). It does not borrow all three signatures. Individual remaining50-point trees are later content, not implicitly granted here.
- Core resource-management actions explicitly marked **class features** are granted outside the one-spell-pick-per-level pool. Optional choices and talent grants are separate. A class must not need to spend its sole level1 pick on recovery merely to become usable.
- All42 representative abilities cost explicit AP and **0 mana** in this prototype; mana is not a disguised common class resource. This is proposed tuning, not a change to existing catalogue costs.
- Every example assumes targets/path/range are GM-confirmed legal, sufficient HP and no active mitigation/temp buffers unless stated. It uses ordinary noncritical recorded faces. New weapon-class actions follow Prism's adjudicated weapon/Evasion/critical procedure, not AC; the fixed damage expression is the authored ability payload, not inferred proficiency arithmetic.
- Formation range is measured in feet using the table's approved procedure; future automation must name a geometry policy. No new universal diagonal/LoS rule is invented here. Gate unsupported geometry with explicit GM confirmation.

## Timing and reset convention

An `ownTurnId` is a stable room/encounter/actor-turn identity. Start boundary order: release due recovering items/temporary suppression; clear that turn's usage counters; apply any named class upkeep; AP is restored by existing combat rules. End-boundary expiry is separate. Repeated hydration or duplicate turn messages never repeat these operations. A duration “end of second subsequent own turn” created in turnT expires at endT+2; not immediately on turnT and not on an observer's local round counter.

**Long rest** means an explicit completed rest event approved by the table and uniquely recorded. Starting/ending initiative, reloading a sheet, changing map/class, disconnect or a short rest is never a refill. Gambler/Chaos reset finite collections only at that rest. Fate links close at encounter end only after pending consequences settle; threads recover. Deathcaller manifestations end at encounter closure, but defeated prepared patterns recover only at a completed long rest. Lichborne anchor integrity never refills merely because a rest occurred: only its once-per-rest reagent repair. Druid's proposed strain resets on completed long rest or paid recovery actions. Hunter evidence clears at encounter closure.

Encounter closure and rest while an action is outcome-unknown wait for exact recovery or explicit GM reconciliation. Closing an encounter cannot erase an escrow, redraw or undo accepted damage.

The representative payloads encode one-turn start-boundary effects as `durationValue:1,durationUnit:'next_caster_turn_start'`; two-turn links/zones use `durationValue:2,durationUnit:'subsequent_caster_turn_end'`. Do not flatten those into the same local round timer. An instantaneous creation/branch action can create an object or branch-specific temporary effect whose exact lifetime is in its typed args; cards/editors display both rather than overriding it with “instant”.

Noncombat investigation/physical utility uses explicit GM-adjudicated activity time and real finite contents/uses; it does not synthesize free own-turn refreshes outside an encounter. AP prices are exact when using combat/action accounting. Repair the Vessel is the explicit exception: an instantaneous ritual result at one completed long-rest event, not an in-combat0-AP invocation. These proposals do not replace the project's unresolved universal skill/exploration clock rules.

Granted5ft Shift/Cascade movement uses remaining legal movement, not a free extra movement pool. Movement penalties reduce remaining allowance to a minimum0, never refund prior travel. Primary Shift movement is an original voluntary event; the optional Cascade continuation is explicitly derived and cannot generate fresh resources/reactions/zones in R1. Anomaly/Returning Path match original voluntary movement only, not forced movement or derived continuations. This is a declared R1 limit, not an implicit new general reaction engine.

The Anomaly Binder's Fracture is the explicit timing exception: it lasts through the **end of the caster's next own turn**, because it often triggers off-turn; expiring at the next start would make its supposed cost disappear before it could matter. Ordinary own-turn Split/Bias/Cascade Fracture still lasts until next own-turn start. The branch-specific expiry is serialized separately from the anomaly object's2-turn lifetime.

## Declaration, cancellation and outcomes

Preview performs no writes/RNG. Before accepted commitment, cancellation is free. At accepted commitment, AP and required typed contents/reservations are locked with one immutable action identity before any visible random outcome. Failed validation mutates nothing. After that commitment, withdrawal cannot obtain a new roll or return costs; a delayed wager/link/anomaly has its explicitly specified closure rule. A GM can void an unexecuted prepared intent with a recorded reason; accepted effects never auto-refund.

An interrupted randomness/choice phase retains the exact committed items and any recorded result. Resume/check the same action. Do not automatically pick a favorable outcome, reroll after stale state or make the UI's timeout resolve a consequence. A server-confirmed “not committed” differs from “outcome unknown”.

For finite random collections, current runtime has no trusted server deck/bag service. **PROPOSED:** server-owned order/draw and privately scoped outcomes, with a physical-dice mode where the GM attests the exact declared sample/face. This is not a claim of cryptographically proving physical honesty. Random results are retained with the action before presentation.

## Fate transfer rule recommended for review

The original attack's GM-confirmed **post-mitigation, pre-temp-HP** assigned damage isD. Ordering: original raw damage after its own critical computation, plus any flat Underwrite raw bonus (not multiplied again) → ordinary mitigation → original target's one-use ward/anatomical prevention →D → fate partition → each recipient's temp HP/HP. The eligible link assigns `B=min(3,D)` to the consenting bearer and `A=D-B` to the protected actor. Transferred burden is not a new attack: no second mitigation, ward, anatomical prevention, link, wager gain, hit response or command applies to it. Both actors' temp HP absorb their assigned portion; actual loss can be smaller due to overkill/clamping, so receipts distinguish **assigned** from **applied** values. Attacker payment, HP/temp changes and link-use mutation must be one atomic authorized plan. P7's two-actor bound cannot generally do this; no hidden sequential substitute is recommended.

Only one link applies per original event. Earliest accepted creation sequence breaks a cross-caster tie; only that link consumes a use. Invalid/dead/retired/out-of-range endpoint invalidates the link before routing; original damage follows its normal plan, no new roll. Endpoint consent can be withdrawn before a triggering event begins. This avoids requiring a generic player reaction timer for the base link; later reactive talent variants would still require their own timing contract.

## Canonical proposed ability envelope

The complete machine-readable42 records are [headq-seven-abilities.json](evidence/headq-seven-abilities.json), also split by class under `classes/manifests/`. They are fully structured **under this proposed review schema**, not validated/admitted by the current application's old schema. Each wrapper carries evidence/status/content-role/dependencies/tests; only its `spell` object is the proposed canonical authoring payload.

```text
spell = {
 id: stable cr1_* ID,
 classId: one of seven new/restored identities,
 rulesetVersion: "cr-review-r1",
 name, description, level: 1..10,
 specialization: null | stable proposed tree ID,
 spellType: ACTION | PASSIVE,
 icon: existing reusable icon key (art suitability still separate),
 typeConfig: {school, castTimeType:"IMMEDIATE", tags[]},
 resourceCost: {actionPoints, mana:0, resourceTypes[], resourceValues,
   useFormulas:{}, components[], somaticText},
 targetingConfig: {targetingType, rangeType, rangeDistance,
   targetRestrictions[], maxTargets},
 effectTypes[], resolution:"RESOURCE_PROGRAM",
 damageConfig: null | {formula, damageTypes[], resolution:"DICE"},
 durationConfig: {durationType, durationValue, durationUnit},
 cooldownConfig: {cooldownType, cooldownValue},
 classResourceProgram: {version:1, domain, op, args},
 reactionTiming:null, savingThrow:null,
 conditions[], area:null | typed shape
}
```

**New fields/enum changes are explicit:** classId/rulesetVersion, classResourceProgram, RESOURCE_PROGRAM resolution, own-turn duration/cooldown terms and typed program-condition/area payloads need validator/editor/normalizer/card/compiler support. The current P9 whitelist correctly refuses them. Current `SpellwizardApp.handleLoadSpell` enumerates fields and would drop a new top-level program; adding a control alone is insufficient. Preserve the approved extension namespace across LOAD_SPELL, both saves, exports/templates and reopen.

`classResourceProgram` is a **finite opcode**, not JavaScript, arbitrary JSON-path mutation or a general expression interpreter. Generic resourceCost contains AP/mana only; do not also encode class cost as a negative scalar or duplicated legacy field. Domain opcode planning owns the exact typed cost/gain/transition, and generic damageConfig is a card/compile input only—never a second independent effect execution.

## Opcode contracts and casting inputs

Every record's args are fixed authoring parameters validated against that opcode. Casting inputs are a separate immutable approval payload: chosen card/tile/pattern/link/entity IDs, allowed stake, exact target refs, legal positions and branch choice. They cannot rewrite authored maxima/outcomes. Unknown keys/version/opcode or mismatched class ownership are refused while preserving draft bytes.

| Domain | Closed opcodes in the42 records | Required state/input invariants |
|---|---|---|
| gambler-hand | wager.attack, hand.recut, table.read, wager.high-roll, hand.marked-pair, wager.underwrite |20 unique cards conserved across deck/hand/discard/wager; Fortune/escrow bounded; one unresolved wager; stake before result; valid pair; one Recut/own turn |
| fate-links | link.tie, link.cut, bond.read, link.covenant, link.sever, link.reanchor |Three tokens partition free/reserved/recovering; distinct exact endpoints; consent; range/expiry; finite uses; no recursive/copy transfer; sever only registered fate-link object |
| chaos-tiles | tiles.fold, possibility.split, instability.read, possibility.bias, anomaly.bind, possibility.cascade |Six unique S/M/F tiles in available/committed/bound/spent; published distribution; fracture included for amplified actions; one anomaly; one bounded follow-up |
| dead-muster | dead.manifest, dead.order, dead.testimony, dead.coordinate, dead.escort, dead.bastion |Three prepared named patterns; capacity2; orders2/own turn; caster AP; one action per actor/own turn; exact template version/identity, exhausted patterns not reusable |
| lich-anchor | lich.stage, anchor.repair, lich.touch, lich.edict, anchor.ward, lich.mortality |Integrity0..12 finite; real anchor; stage0..2; exact active trait/vulnerability; stage advances once/own turn; repair once/completed rest with reagent |
| hunter-evidence | quarry.mark, quarry.angle, quarry.press, quarry.ambush, quarry.cross-scent, quarry.return-path |One exact quarry; distinct Read/Angle/Pressure; at most one newly generated tag/own turn across every source; exact expenditure; actual companion for its actions; one delayed path |
| metamorph-body | body.adopt, body.recover, body.shed, body.pursuit, body.brace, body.mimic |Four slot types, at most2 active; defined prepared traits; strain0..3; suspended traits grant nothing; real shaping interface; no copied stats/memories/spells |

The exact args, choice bounds, amounts, target roles, duration, branches and failures are stored in each ability and its dossier. Validators cross-check the AP/target/effect envelope against opcode semantics; authors cannot label a harmful link as harmless utility to evade permission. Beyond these opcodes, later content requires another reviewed opcode or an explicit accepted parameterization—not prose parsing.

Damage opcodes explicitly pin an `attackProfile`: weapon/manifestation/natural-weapon strikes use `Prism-weapon-GM-adjudicated`; direct magical DICE payloads use `direct-DICE-GM-adjudicated`. No compiler infers a second hit roll, Evasion bypass, critical or immunity rule from the word “strike”. Existing exceptional defense/critical rulings still need the GM until their shared contract is frozen; the examples use confirmed ordinary hits.

## Heritage and talent interaction

Use the recommended19 native pairings in the cultural packet, each with a paired bounded edge. No current raw percentage/extra generation is copied into R1. The representative examples turn those optional edges off to show base arithmetic. A future executor applies selected native/method/body validation and one named edge/cost at its declared time, once. A UI label/advisory hook does not certify enforcement.

Representative signatures are talent grants, not three free choices from one pick. Hybrid builds can eventually learn signatures in other trees by paying their prerequisites; they still share the class's one state/caps. No tree increases base bank size in R1. Full node-by-node trees and all later talent modifiers remain original-assignment content after core review.

## Review acceptance versus implementation acceptance

Review-ready means state/operations/examples/origins/six representative records are internally consistent, alternatives are resolved to a recommendation and engine blockers are explicit. It does not mean balanced by playtesting, all class spells produced, full50-point trees written, canonical Laws published or any of these new opcodes implemented. Do not promote a prototype merely because its draft JSON parses.
