# Druid — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

**DESIGN INTENT — player-facing name Druid is approved; Metamorph is rejected. Bodily transformation/adaptation remains core. Anatomy, specializations and native assignments are PROPOSED under HeadQ review. No conventional Druid mechanics, worship, companion requirement or heritage inheritance is imported. Preserve Shaper IDs/compatibility until explicit migration approval.** See [creator naming decision](../31_CREATOR_NAMING_DECISION_DRUID.md). Retained technical keys/IDs are internal R1 proposal handles, not player-facing labels or approved application IDs.

## Fantasy and repeated decisions

Transform your actual body into the capabilities the moment requires, accepting what that anatomy cannot do.

**Repeated decisions:** Which two anatomical slots to occupy; which weapon, tool or sense to give up; when to recover by suspending a real trait; when to become predator, bastion or mimic.

**Role, complexity and weaknesses:** Medium-high complexity adaptive hybrid/explorer. Mutually exclusive anatomy, transition/recovery tempo and vulnerable references constrain it; no automatic GM control handoff.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "metamorph-body",
  "slots": [
    "locomotion",
    "offense",
    "defense",
    "senses"
  ],
  "activeMax": 2,
  "preparedLoadouts": [
    "predator",
    "bastion",
    "mimic"
  ],
  "unrecoveredTransitions": {
    "min": 0,
    "max": 3
  },
  "suspensions": "active-trait-ID until next ownTurnCounter",
  "mimicPattern": null,
  "platePreventionUsedOwnTurnId": null,
  "brace": null
}
```

1. Requires an actual compatible plastic/mineral/co-sculpting interface and training. At a completed long rest prepare three explicit known loadouts, return to default body and clear strain/suspension. Encounter changes or reload never reset it.

2. Predator occupies locomotion (climbing pads:20ft climb within ordinary movement) and offense (natural1d8 Slicing weapon). Bastion occupies defense (layered plating) and senses (moving ground-vibration trace within10ft of contact, not hidden identity omniscience). Mimic occupies locomotion (softened gait, no extra AP/speed) and senses (surface-anatomy reference). These are defined traits, not all creature abilities.

3. Adopt1 AP replaces active anatomy with a different prepared loadout and adds one transition. At strain3, further transitions are refused until paid recovery. No extra threshold power, forced feral state or loss of character control.

4. Recover1 AP suspends one active unsuspended trait until next own turn and reduces strain by1; strain must be≥1. Empty/already suspended traits cannot pay. A due trait returns only if still part of the active loadout, not as an old form stacked onto a new body.

5. Layered plating prevents2 assigned damage from the first eligible ordinary damage event each own-turn window, before temp HP. Living Brace1 AP needs active plating and unused plate budget: prevent4 INSTEAD of2, one use, once/own turn, movement0 while braced. Movement/trait loss ends it. Brace consumption uses that window’s plate budget; no extra armor score or double subtraction.

6. Pursuit Morph2 AP adopts Predator, adds one transition and strikes once for1d8+2 adjacent Slicing. Requires a different prior loadout and strain<3. Rejected validation leaves prior anatomy/AP unchanged.

7. Shed1 AP removes one eligible mundane grapple/loose rope by suspending one actual active trait until next turn. It does not reduce strain or escape rigid fitted manacles, magical bindings or surgery.

8. Borrowed Outline1 AP needs both Mimic slots active and a10-minute studied pattern of the same size, height change≤10%. It lasts1 minute and ends on positive applied HP/temp damage, loadout change or required-trait suspension. Copy surface anatomy/gait only; no equipment, memories, racial rules, class spells or legal authority.

9. The power physically changes anatomy, not a weapon pose. Groven mineral reshaping and Mimir plasticity share finite capabilities without making every body flesh. Reference loss disrupts only its defined edge, not biological life or every class action.

10. Gear is not copied, automatically equipped or silently removed by a form. Flexible gear may remain; rigid fitted armor that conflicts with a prepared loadout must be explicitly doffed using the table’s equipment procedure before adoption. Natural-weapon attacks need their required free anatomy. The example uses no conflicting armor; mimicry never supplies another person’s clothing or credentials.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| predator / Predator | Trade armor/awareness for a body that reaches and strikes. | Pursuit Morph combines one paid transition and strike for2 AP; locomotion/offense displace defense/senses. | Must actually change anatomy and pay strain; cannot stack all forms. | Later: specific natural weapons/movement traits and one bounded hybrid, not free Giant mechanics. |
| adaptive-bastion / Adaptive Bastion | Hold adapted anatomy still and choose the impact to resist. | Living Brace replaces plating2 with4 for one event, at mobility/plate-budget cost. | Requires active trait/position; no brace after plate budget was spent. | Later: specific impact adaptations and rescue after reaction approval. |
| mimic / Mimic | Prepare a studied physical outline and occupy both slots with infiltration. | Borrowed Outline changes body/gait but forgoes Predator/plating and breaks on damage/trait loss. | Study, size, finite reference and duration; no stolen stats/memories/spells. | Later: defined utility anatomies and bounded infiltration, not unrestricted creature copying. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Adaptive Bastion; Living Brace learned with11/15 talent points. Three prepared loadouts, default body/strain0, legal adjacent target. No heritage edge/other mitigation/temp in arithmetic.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Adopt Predator1 AP, then ordinary natural-weapon Attack2 AP (d8=5, GM final5). | 4−1−2=1 | Default0 slots→locomotion/offense2; strain0→1. Attack uses actual talon, not another tree’s signature. |
| T2 | Adopt Bastion1 AP; Living Brace1 AP. Later enemy assigned damage8 arrives. | 4−1−1=2 | Strain1→2; talon/climb lost, defense/senses active. Brace prevents4, not2+4; applied4 and plate budget used. |
| T3 | Start resets plate budget. Recover1 AP suspends vibration senses; Living Brace1 AP with plating still active. | 4−1−1=2 | Strain2→1; defense active/senses suspended untilT4 start. No free new form, HP reset or control handoff. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Physical climbing/rescue, a studied same-size infiltration body, one loose-restraint escape and practical anatomical tasks. Neither all creature forms nor ordinary Monk discipline.

## Native origins and acquisition — recommended, not current canon

shaping_interface + transformation_training + self_reference_training. All four native recommendations have actual plasticity/reclamation/transmission evidence. Cromyx E acquisition needs real living substrate/regrowth; Florae needs an actual co-sculpting school.

**Institution, founder/transmission and current crisis:** Preserve living Veyra/Form-Convergence, Torin’s reclamation/Shaping Hall at Frostmaw and Sylvanus’s later kinetic mastery. Use era-relative chronology. Druid is the approved player-facing name only; investigate Monk/Bladedancer separately.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| morgh_groven / Vat-Sculpted | With Bastion active, hold one person-sized loose beam/door in a load-bearing posture for one own turn without another slot. | Remain stationary and make no attack that turn; chosen load/recoil risk persists. Not extra DR or immunity. | Old vat conditioning echoes overload, but reclamation remains voluntary. |
| ithran_groven / Span-Dancer | Once/rest use a prepared bridge-route’s actual support knowledge for advantage on one associated noncombat load/route check while changing locomotion form. | Requires known maintained architecture; bracing/restraint interrupts the route edge. No free Flux or transition refund. | Failing Ancestor-Spans make old routes unreliable. |
| veiled_mimir / Form-Locked | Once/rest a maintained heirloom reference grants advantage on a noncombat self-identification/recognition check during a physical form change. | Reference care/exposure; cannot reshape the heirloom or make mask loss fatal. | Inherited archive and chosen self can conflict. |
| tethered_mimir / Sentinel-Shifter | During Mimic one predeclared willing ally can recognize your chosen self/Mote signal without guessing the disguise. | Displaying it also exposes it to anyone already knowing that signal; ordinary transition strain remains. No compulsory mask. | Misleading fog challenges vigil without revoking unmasked selfhood. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [metamorph R1 JSON](manifests/metamorph-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_metamorph_adopt_loadout / Adopt Loadout | 1 / class-feature | 1/0 | body.adopt: 1 AP; unrecovered transitions+1, requires currentvalue<3. | Replace your active anatomy with a prepared two-slot loadout. Every actual transition adds one unrecovered transition; at three you must recover rather than surrender character control. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_metamorph_recover_self / Recover the Self | 1 / class-feature | 1/0 | body.recover: 1 AP and temporary loss ofone real active trait. | Suspend one active, unsuspended adaptation until your next own turn to recover one transition. The trait grants no benefit or ability prerequisite during recovery. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_metamorph_shed_snare / Shed the Snare | 2 / spell-pick | 1/0 | body.shed: 1 AP and loss ofone active unsuspended adaptation until next ownturn. | Distort your active anatomy out of one mundane grapple or loose rope binding. Suspend one active adaptation as the cost. This does not escape rigid fitted restraints, magical bindings or surgery. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_metamorph_pursuit_morph / Pursuit Morph | 3 / talent-signature / predator | 2/0 | body.pursuit: 2 AP; one transition, requires strain<3 and different prior loadout. | Shift into a prepared Predator loadout and immediately strike with the new natural weapon. The transition and attack are one paid operation, not a free extra stance switch. Target {"targetingType":"single","rangeType":"melee","rangeDistance":5,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_metamorph_living_brace / Living Brace | 3 / talent-signature / adaptive-bastion | 1/0 | body.brace: 1 AP; movement0 whilebraced; defense slot mustremainactive. | With layered plating active, hold your altered body immobile to resist one impact. Prevent up to four assigned damage from the next event instead of plating’s ordinary two, then the brace ends. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_metamorph_borrowed_outline / Borrowed Outline | 3 / talent-signature / mimic | 1/0 | body.mimic: 1 AP; both active slots alreadyoccupied byMimic, foregoingPredator/Plating benefits. | While your prepared Mimic anatomy occupies locomotion and senses, reshape your actual face, skin and gait into one studied same-size outline. You copy no memories, equipment, ancestry traits or spells. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"minutes","durationValue":1,"durationUnit":"minutes"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Optional natural strike/utility choices |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Additional physical utility beyond Shed |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes/prerequisites |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Trait prerequisite/defense choices |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | New known adaptations, not extra active slots |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Rescue/exploration anatomy choices |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Study/mimic constraints and options |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Counter-transformation/condition choices |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Finite hybrid commitments |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Capstones retaining reviewed slot/transition rules |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Trait catalogue/slots/prepared loadouts, exact active prerequisites, transition/recovery/suspension and body-interface gate; strike/brace/outline bounds. Not a renamed Flux bar.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-T1-traits-body. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Four slot glyphs with at most two active, three recovery stitches and a suspended-trait/brace cue. Show what capability was lost. Expand body material, interface/reference and expiry.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

Druid is approved as the player-facing name only. Preserve all56 Shaper spells, six forms, Flux0–20/Body Toll0–10, old talent IDs, saves and art paths. No application ID, ruleset, resource or character migration is approved. Existing R1 metamorph/metamorph-body/cr1_metamorph_* handles are provisional internal proposal keys, not player-facing names or selected final IDs. Any later anatomical conversion requires a separately approved preview/reselection; it is not a numerical conversion or permission to import conventional Druid rules.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Monk discipline and Bladedancer weapon rhythm do not replace anatomy. Lichborne changes existence through finite undeath/anchor; Druid equips its actual body for current functions. Neither inherits Flux merely for code reuse.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Metamorph — proposed transformation successor

**DESIGN INTENT:** Shaper identity retired, body transformation retained; Formbender is not an approved replacement. **PROPOSED recommended name:** Metamorph. **Status: design draft; full content and culture review incomplete.**

## Evidence and naming

Current Shaper has56 spells and Flow Master/Iron Dancer/Primal Shadow. Its actual contract distinguishes Flux0–20, Body Toll0–10 and six named forms, with toll treated as risk and control-handoff marker at10 (`shaperResourceContract.js:3–18,32–44`). Tracking that marker does not execute movement loss, identity erosion or GM control transfer. Historical Formbender had36 spells and Metamorph/Form Thief/Primordial trees. Historical Bladedancer had16 spells and Flow Master/Duelist/Shadow Dancer. Exact transfer still needs mapping.

Metamorph covers mineral and flesh bodies without implying grotesque mutilation. Shapeshifter is the clearest familiar fallback; Fleshweaver/Fleshshaper/Skinweaver emphasize anatomy horror and fit Groven less naturally. Introduction: “Your body is your equipment. Grow the means to cross a chasm, withstand a charge or pass unnoticed—but you cannot keep every advantage at once.” Combat: adaptive role-switcher. Noncombat: locomotion, senses, infiltration and survival. Complexity medium-high; weakness is mutually exclusive anatomy and recovery windows, not generic damage vulnerability on a colored thermometer.

## Proposed anatomical loadout resource

- Four typed slots: `locomotion`, `offense`, `defense`, `senses`. One adaptation per slot; default body is not an adaptation. Each adaptation has explicit slot, interface requirements, benefits and limitations.
- At most **two active adaptations** in the low-level prototype. Prepare a known adaptation catalogue and three named two-slot loadouts at rest; preparation does not grant every catalogue ability as a spell pick.
- Transition1 AP: replace up to two active adaptations with one prepared loadout. Increment `unrecoveredTransitions`0→1→2→3. At3, further transitions are refused until recovery; no automatic loss of character control.
- Recover1 AP: choose one active adaptation to suspend until next own-turn boundary; reduce unrecoveredTransitions by1. A suspended adaptation grants nothing and cannot satisfy a form-required ability. Cannot recover for free from an already empty slot.
- No ordinary weapon attack generates adaptation energy. No global Flux spending layer in the target prototype. Flux/Body Toll remain in legacy Shaper state and require a deliberate mapping/reselection, not division into a new meter.
- Long rest resets transitions and selects prepared loadouts through the class's actual body-interface practice. Save/reload cannot reset transition debt. Changing race/body state revalidates compatibility; it cannot erase recorded identity anchors.

## Three trees

| Tree | Behavior/resource variation | Signature | Targeting/utility/defense | Weakness/capstone |
|---|---|---|---|---|
| Predator | Spend locomotion+offense slots to pursue and strike | Pursuit Morph gives a specific natural weapon and climbing/leaping mode | Reach the vulnerable position; limited scouting | No simultaneous armored/sensory package; one finite hybrid predator capstone |
| Adaptive Bastion | Occupy defense plus a supporting slot; choose what to withstand | Living Brace is a declared impact adaptation, not an untyped armor score | Interpose/support only through approved reaction rules; rescue/labor utility | Slower or immobile while braced; capstone one guarded adaptation swap |
| Mimic | Reserve senses/locomotion and a studied superficial pattern | Borrowed Outline changes appearance within explicit size/body constraints | Infiltration and unusual movement; no stolen spell lists or memories | Weak offense/defense slots, observation requirement; bounded mimicry capstone |

Different bodies express the same slot contract with different materials. A Groven's stone-scale and a Mimir's plastic tissue need not use identical art or biology. No adaptation grants another heritage's full racial traits, permanent immunity or unlimited body mass.

## Three-turn example

Initial default form, active slots0/2, transitions0/3.

1. **T1:** Adopt Predator loadout (1 AP): locomotion climbing pads + offense natural blade, active2/2, transitions1. Use a form-required strike (2 AP). The equipped anatomy is the requirement; not an invisible damage stance.
2. **T2:** Threatened by a heavy charge, adopt Bastion loadout (1 AP): defense layered plating + senses ground vibration, replace both prior traits, transitions2. Climbing/natural-blade abilities become unavailable immediately. Brace under its explicit action rules.
3. **T3:** Recover (1 AP), suspend ground vibration until next own turn, transitions2→1; defense remains. Choose to tolerate limited perception rather than switch again. At next own turn the suspended trait recovers, but no refunded AP or free new adaptation is created.

Tree demonstrations remain to expand into three separate numerical sequences and complete50-point node maps. Six ability briefs: Adopt Loadout, Recover the Self, Pursuit Morph, Living Brace, Borrowed Outline, Shed the Snare. Full structured spells and exact progression1–10 remain outstanding.

## Heritage review

**CONFIRMED current native:** Morgh Groven, Amordjin Groven, Arch Mimir, Broken Mimir. Registry requires a real shaping interface/training and blocks fixed bodies without such an interface. Groven have chosen reclamation/alchemical practices; Shaping Hall/Torin is directly authored (`groven.js:143–146`). Mimir have native plasticity, but Arch masks are archives and Broken Motes anchor chosen selfhood. A mask is not universal biological life support (`mimir.js:29–55`).

**PROPOSED direction, not final assignment:** retain investigation of all four rather than copying their rows automatically. Morgh load-bearing transformation, Amordjin span/mobility adaptation, Arch archive-stabilized identity and Broken self-chosen adaptation deserve distinct variant mechanics. Each needs one bounded advantage/cost: fixed posture for brace, limited span anchoring, archive-care dependency, or actual Mote disruption respectively. None makes missing mask disable all class spells or makes the Groven humanoid a mechanically Giant creature.

Current Form-Convergence and living Veyra can be preserved as institutional continuity if approved; Torin is the reclamation pioneer, Veyra living Broken Mimir synthesizer, Sylvanus later kinetic master (`classHeritageRegistry.js:61,91`). Keep era-relative chronology. Founder/current leader/headquarters/crisis and final native variant payloads still require full cross-lore verification.

## Monk separation

Monk's proposed discipline is footwork/striking/breath and self-mastery while remaining one's body. It must not inherit anatomical slots, Flux or Body Toll to reuse components. Bladedancer likewise needs a sequence/weapon-movement audit. Neither is a dumping ground for every Shaper talent with martial vocabulary.

## UI/runtime

SVG articulated silhouette with four slot glyphs; active2/2 and three transition stitches. Distinct stone/tissue interpretation in expanded view without different mechanics. Compact display identifies current loadout, suspended trait and recovery availability. Wizard edits slot requirements/transition/active trait actions. Runtime needs exact trait permissions/restrictions, body compatibility, duration/recovery boundary, persistence and authoritative operation support. No current P9 transformation support is implied.

</details>
