# Lichborne — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Choose prepared forms of your own undeath, accepting vulnerabilities while protecting a finite real anchor.

**Repeated decisions:** Spend integrity advancing yourself or preserve it for survival; activate a trait with its cost; defend the actual anchor; accept a temporary mortal window without keeping undead protection.

**Role, complexity and weaknesses:** High-complexity Rime/self-undeath controller. Finite anchor, prepared vulnerabilities, expensive advancement and dormant recovery constrain it; death is not an immediate tactical reset.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "lich-anchor",
  "integrity": {
    "min": 0,
    "max": 12,
    "initialAfterAcquisition": 12
  },
  "anchor": {
    "id": "actualphysicalobject",
    "status": [
      "intact",
      "destroyed"
    ],
    "location": "validated",
    "ward": null
  },
  "stage": {
    "min": 0,
    "max": 2
  },
  "preparedTraits": [
    "rime-mantle",
    "veil-foot"
  ],
  "activeTraitSlotsByStage": [
    0,
    1,
    2
  ],
  "suppressedUntilOwnTurn": null,
  "lifeState": [
    "active",
    "dormant",
    "dead"
  ],
  "usage": [
    "advance-ownTurnId",
    "repair-restId"
  ]
}
```

1. Acquisition creates one actual finite physical anchor and integrity12. No automatic kill gain, soul harvest, encounter reset or ordinary rest refill. Integrity changes belong to that anchor’s revisioned state.

2. Veil Unbound costs1 AP. Advance exactly one stage for2 integrity, at most once per own turn; choose one prepared trait at stage1, both at stage2. Veil mode costs1 AP and returns to stage0 without refund. Neither advance nor veil is permitted during mortality suppression.

3. Rime Mantle permits Winter Edict and blocks ordinary HP healing while active. Veil Foot permits one legal5ft passage through an unoccupied gap at least1ft wide per own turn, using5ft remaining movement, but forbids blocking while active. It cannot enter walls/occupied cells or copy racial rules.

4. Cold Touch costs2 AP for1d6 Rime while Veiled or otherwise active. Winter Edict costs2 AP and requires unsuppressed Mantle:2d6 Rime and5ft movement penalty at stage1,10ft at stage2, until next caster turn. No general stage damage multiplier.

5. Anchor Ward costs1 AP and2 integrity for a one-use ward4 on the actual anchor within30ft, until next own turn. Enemy assigned damage reduces integrity after ward; enemy damage reaching0, or any positive enemy assigned damage while already at0, destroys the physical anchor. Self-spending to0 exhausts it without physical destruction.

6. Repair costs0 combat AP but is legal only at a completed long rest: consume one exact reagent for+4 integrity, cap12, once per rest ID, intact anchor only. A destroyed anchor needs a separate actual reacquisition/rebinding, not a free cast.

7. Borrowed Mortality costs1 AP and suppresses all trait permissions AND restrictions until next own turn. Ordinary warmth/pulse/healing eligibility returns, but finite-return eligibility is disabled. Stage and integrity remain unchanged; no copied face or traits and no stage changes during the window.

8. Innate Return to the Anchor is not an attack or routine HP0 trigger. On GM-confirmed death, intact anchor/integrity≥6/no mortality suppression permits one6-integrity payment and a dormant state at the anchor. No immediate HP/AP reset, freeze or new turn. After a completed long rest there, return at HP1/temp0/stage0; destruction before recovery ends this return. Paid once/rest reagent repair is a separate operation.

9. An active preservation covenant is not automatically incompatible. Only a recorded actual anchor-rejection/interface state blocks this method. Nethien still undergo a real threshold rite; racial preservation is not free undeath.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| rime-sovereign / Rime Sovereign | Advance early to express the prepared Rime trait and control movement. | Winter Edict requires Mantle/healing lock; stage2 increases restraint, not the bank. | Less integrity remains for return and ordinary healing is blocked while Mantle is active. | Later: discrete Rime interactions and one finite area edict after geometry support. |
| phylactery-keeper / Phylactery Keeper | Keep a low stage, defend the actual anchor and reserve6 integrity. | Anchor Ward spends2 of the same survival budget to prevent up to4 next anchor damage. | Range and finite reserve matter; no geography-sized phylactery. | Later: finite anchor alarms/repair choices; a second anchor requires separate approval. |
| veil-scholar / Veil Scholar | Trade every current undead permission for a mundane mortal window. | Borrowed Mortality suppresses powers/costs AND return until next turn. | Can receive ordinary healing but cannot keep Winter Edict, blocking exemption or return. | Later: careful preservation/identity utility with genuine vulnerability windows, not Mimic anatomy. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Rime Sovereign; Winter Edict learned with11/15 talent points and Cold Touch selected at level1. Integrity12/intact anchor, Veiled, both prepared traits, no optional heritage edge. Each target is in legal range.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Advance1 AP/2 integrity, choose Mantle. Winter Edict2 AP,2d6=3+4. | 4−1−2=1 | Integrity12→10; stage0→1; Mantle/healing lock active; assigned Rime7 and target−5ft untilT2 start. |
| T2 | Advance1 AP/2 integrity, add Veil Foot. Winter Edict2 AP,2d6=2+4. | 4−1−2=1 | Integrity10→8; stage1→2; both paired restrictions active; assigned Rime6 and target−10ft untilT3 start. |
| T3 | Veil mode1 AP removes traits; Cold Touch2 AP,d6=3. | 4−1−2=1 | Integrity stays8; stage2→0; assigned Rime3. A later legal return would cost6, not become a freeT3 action. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Actual preservation, forbidden scholarship, paid repair, Veil Foot gaps with blocking cost and Scholar mortality windows. No omniscient death archive or free biological impersonation.

## Native origins and acquisition — recommended, not current canon

threshold_transition + finite_soul_anchor + cold_hearth_training, with actual interface/covenant compatibility. Bedel, Weft, Riven and Corali legacy Revenants are not forcibly converted or automatically native.

**Institution, founder/transmission and current crisis:** PROPOSED separate Cold Hearth discipline within Twice-Born, based on Vesper’s actual frost method and Tessic node instruction. Kor-Vasseth’s coalition oversight is not a newly approved lich sovereign. Rime does not imply compulsory allegiance to Keth.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| velun_neth / Cold Archivist | A filed anchor/citation lets a paid Anchor Ward expose an altered visible ownership seal; once/rest the archive can confirm its known custody chain. | Old First Contract obligations continue. Filing is not new life, another reserve or permission to ignore an existing covenant. | Use female Vesper/frost-stasis from registry; raw he/his is a discrepancy. |
| tessen_human / Keystone Lich | Once/rest within5ft of its prepared keep-node, a paid Anchor Ward can prevent2 additional assigned anchor damage. | Remain stationary until next own turn; moving ends the extra2. No whole-keep immortality or unlimited reserve. | Failing keeps and threatened nodes create dynastic/portability choices. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [lichborne R1 JSON](manifests/lichborne-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_lichborne_veil_unbound / Veil Unbound | 1 / class-feature | 1/0 | lich.stage: 1 AP; advance costs integrity2, veil costs0 and returns none. | Advance exactly one undeath stage, paying two anchor integrity, or return to Veiled without refund. Choose only the prepared trait slots the new stage permits. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_lichborne_repair_vessel / Repair the Vessel | 1 / class-feature | 0/0 | anchor.repair: 0 combat AP; one completed rest opportunity and one real reagent quantity consumed. | At a completed long rest use one exact anchor reagent to repair four integrity. This is a ritual feature, not a free in-combat cast or automatic rest refill. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_lichborne_cold_touch / Cold Touch | 1 / spell-pick | 2/0 | lich.touch: 2 AP; no integrity. | Deliver a modest Rime touch without advancing your undeath. Remaining Veiled preserves anchor integrity and the option to act as an ordinary vulnerable body. Target {"targetingType":"single","rangeType":"melee","rangeDistance":5,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_lichborne_winter_edict / Winter Edict | 3 / talent-signature / rime-sovereign | 2/0 | lich.edict: 2 AP; no new integrity cost, but active trait’s healing lock remains. | While Rime Mantle is active, strike one enemy with Rime and impair its next movement. Higher stage widens the declared restraint, not your anchor bank. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_lichborne_anchor_ward / Anchor Ward | 3 / talent-signature / phylactery-keeper | 1/0 | anchor.ward: 1 AP, integrity2. | Spend finite integrity to place a four-point one-use ward on the actual anchor within reach. Protecting the anchor uses the same survival reserve you would need to return. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["own-physical-anchor"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_lichborne_borrowed_mortality / Borrowed Mortality | 3 / talent-signature / veil-scholar | 1/0 | lich.mortality: 1 AP; forgo all active trait powers and return protection until next own turn. | Suppress every active undeath trait and its paired restrictions until your next own turn. You lose their permissions and finite-return eligibility during that window, gaining ordinary warmth/pulse for a mundane task. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Alternative Rime/utility/defense choices |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Preservation/exploration choices |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes/prerequisites |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Prepared trait/vulnerability alternatives |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Finite anchor alarm/repair options |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Specific spectral utility |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Rime control variants |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Anchor/death counterplay |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Forbidden mastery choices |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Finite capstones using approved return rules |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Stage/one-step advancement, integrity costs, prepared trait plus vulnerability, suppression, exact anchor/ward, completed rest/reagent and death-confirmed dormant return. Return is a lifecycle transition, not executable damage-trigger prose.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-T1-traits-anchor. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Twelve integrity marks, actual anchor/condition, three-stage indicator and active vulnerability. Expand prepared pairs, return eligibility/reserve, reagent and pending dormancy. No resurrection animation before acceptance.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

Preserve Revenant Toll0–20, phylactery0–50 and talent-bonus states. Do not rescale50/75 HP into12 integrity without an approved preview/mapping; choose a real qualified anchor. Frost Sovereign/Phylactery Anchor are reuse candidates, not global renames. Death Shroud/old return rules stay legacy until new lifecycle approval.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Personal existence/finite anchor differs from Deathcaller’s commanded actors and Druid’s anatomical equipment. Rime/forbidden preservation express that economy without another Toll bar.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Lichborne — chosen undeath and finite anchors

**DESIGN INTENT:** independent restoration; self-transformation and finite survival. **PROPOSED:** mechanics below. **Status: design draft; survival/heritage/content require approval.**

## Historical and current evidence

**HISTORICAL:** 33 top-level Lichborne spells; Normal Mana/Aura HP casting, Eternal Frost, kill-charged phylactery; Frostbound Tyrant, Spectral Reaper, Phylactery Guardian. **CONFIRMED current contract:** Revenant Toll 0–20, finite phylactery default50, Death Shroud, blood-token compatibility fields (`revenantResourceContract.js`). It does not establish automatic resurrection, applied Rime bonuses or full transformation execution.

Recommended Lichborne. Alternatives Lich, Deathless, Undying, Frost Lich. Introduction: “You have made your own continued existence a work of forbidden craft. Choose what remains mortal, what becomes unyielding and where you leave the one thing that can still end you.” Combat: Rime/Arcane self-transforming controller. Noncombat: preservation, forbidden scholarship, endurance through an actual maintained anchor. High complexity. Weakness: prepared vulnerabilities, exposed anchor and a finite recovery budget; not an unkillable player character.

## Proposed exact prototype state

- **Anchor integrity 0–12**; unique physical anchor ID, location/access record, version and condition. Persistent, never created by class selection alone. No generic soul-harvest currency and no automatic kill recharge.
- Two prepared **undeath traits** from a known catalogue, each paired with one actual vulnerability. One active trait at low level; unlocking a second active slot requires an explicit progression rule. Trait pairs are recorded, not improvised prose.
- Three encounter **manifestation stages**: Veiled (0), Unbound (1), Sovereign (2). Advancing one step costs1 AP and2 integrity, at most once per own turn; cannot skip a stage. Stage unlocks *prepared* traits rather than a global percentage damage bonus. Returning to Veiled costs1 AP, recovers no integrity and does not erase committed drawbacks until the documented boundary.
- Example trait pair: Rime Mantle permits a specifically authored chill action; vulnerability forbids ordinary self-healing while it is active. Another: Spectral Step permits one5-ft passage through a specifically allowed obstacle; vulnerability prevents blocking during the same window. Collision/terrain and healing-lock semantics require approval.
- Repair: proposed long-rest ritual restores4 integrity at cost of one finite named reagent; no repeated rest toggle or infinite repair without consumption. Actual reagent/item integration is a dependency.
- **Return from defeat is proposed, not approved:** if integrity≥6 and anchor intact/reachable under the agreed rule, consume6 and enter a dormant recovery state at the anchor after the scene. No immediate full-HP reset, area freeze, fresh turn or return to a previous accepted combat revision. If those conditions fail, ordinary death rules apply. The exact threshold/recovery/consent rules require creator decision.

## Three trees

| Tree | Behavior/resource variation | Signature/role | Positioning and utility | Weakness | Capstone direction |
|---|---|---|---|---|---|
| Rime Sovereign | Commit stages early to expose prepared Rime traits | Winter Edict: one declared chill/freeze interaction with explicit check | Control space using personal presence; preserve material records | Less integrity available for survival, no broad Rime immunity | One finite Rime dominion, not unlimited area freezing |
| Phylactery Keeper | Keep low stage and protect the actual anchor | Anchor Ward: reserve integrity to defend a named anchor operation | Defensive preparation and recovery planning | Anchor obligations, lower burst | One bounded alternate anchor with no duplicate immortality |
| Veil Scholar | Change which prepared trait is expressed, paying AP/integrity | Borrowed Mortality: suppress a trait and accept its ordinary-body limits for a utility task | Infiltration, knowledge and constrained spectral traversal | Vulnerability windows; no free shapeshifting into any creature | One carefully bounded identity/undeath transformation |

This preserves Rime and anchor mastery without making Lichborne a Deathcaller who spends the same souls. Exact50-point nodes and rank effects remain required.

## Three-turn numerical example

Initial integrity12, Veiled, Rime Mantle prepared; 4 AP illustrative.

1. **T1:** Advance to Unbound (1 AP, integrity12→10), activate Rime Mantle, accept healing lock. Use its authored chill action (2 AP). No kill-generated anchor gain.
2. **T2:** Enemy closes. Advance to Sovereign (1 AP, integrity10→8), gaining the second stage's explicitly listed permission. Use a control action; decide to retain8 rather than spend further because proposed return costs6.
3. **T3:** Return to Veiled (1 AP), integrity remains8; stop exposing the active trait after its documented window. Choose a mundane defensive action instead of more forbidden power. If later defeated, any return is a separately resolved finite-anchor procedure, not an automatic death-trigger animation.

Tree contrasts: Sovereign invests12→10→8 for control; Keeper stays12 and reserves6 while defending anchor; Scholar pays to suppress/re-express one prepared pair over three turns. Full approved numerical tree demonstrations remain outstanding.

## World and heritage

**CONFIRMED leads:** Nethien Vesper frost-stasis, Tessic maintained keep keystones, finite native threshold rites and named anchors (`classHeritageRegistry.js:60,90`; heritage edge rows; neth/human records). Current provenance states Vesper is a female Athien in frost-stasis; Kora is dead with preserved voice. Do not turn either into an ordinary immortal living leader.

Native assignments remain **UNRESOLVED**. Nethien preservation is not automatically lichdom; Tessic defense architecture is not a geography-sized phylactery. Proposed acquisition requires an actual threshold transformation, finite maintained anchor and forbidden-mastery training. Body/pact compatibility must be checked against racial preservation and current incompatible states. Strong Rime affinity need not imply Keth allegiance: current world lore also anchors Rime in Selunis.

Candidate variant briefs conditional on approval: Nethien Frost Archivist files a finite anchor with provenance but keeps old obligations; Tessic Keystone Lich stabilizes one prepared local node but loses the extra benefit when away from it. No infinite keep resurrection. Institution could preserve a Twice-Born frost branch, with a separately reviewed current leader/headquarters/crisis; not automatically grant both restored classes the whole order.

## SVG/UI/wizard/runtime

Compact frost seal: integrity12 marks around one anchor symbol, stage as three discrete notches, active trait glyph and visible vulnerability. No animated frost/glow; hatch damaged integrity. Expanded: anchor identity/state/location visibility, prepared pairs, stage, recovery budget, repair requirements. Wizard must author stages, trait prerequisites, sacrifice/repair and finite survival operation, with explicit unsupported-execution status.

Persist anchor/traits privately where appropriate; room owns stage and accepted integrity mutations. Changing equipment or losing anchor must not regenerate it on reload. Requires transformation state, healing/block restrictions, finite item custody, death/recovery rules and exact-command support beyond current P9. Six ability briefs: Veil Unbound, Winter Edict, Anchor Ward, Borrowed Mortality, Repair the Vessel, Return to the Anchor. Full structured records, exact progression1–10 and player/tabletop death edge cases remain incomplete.

</details>
