# Deathcaller — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Prepare real named dead patterns, manifest a finite force and spend your own actions to command it.

**Repeated decisions:** Which dead to prepare; two retainers or one capacity-two guardian; move, strike, guard or question instead of doing everything; preserve or risk a vulnerable manifestation.

**Role, complexity and weaknesses:** High-complexity commander/control and mortuary witness specialist. Setup, caster AP, orders, limited capacity and finite pattern vitality constrain it.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "dead-muster",
  "preparedPatterns": 3,
  "pattern": {
    "id": "named/provenance/version",
    "vitalityMin": 0,
    "vitalityMax": 10,
    "exhaustedUntilRest": false,
    "questionRestId": null,
    "questionsUsed": 0,
    "questionCountMaxIncludingOptionalEdge": 2
  },
  "capacityMax": 2,
  "ordersPerOwnTurn": 2,
  "manifestationsMax": 2,
  "actorActionMaxPerCasterOwnTurn": 1,
  "templates": [
    "cr1_dead_retainer:v1",
    "cr1_ossuary_guardian:v1"
  ]
}
```

1. Three prepared patterns have actual anchor/remains/witness provenance. A living creature-library copy or invented spirit is invalid. Preparation/replacement at a completed long rest restores10 vitality each, once. Historical records are knowledge, not extra active capacity.

2. Manifest costs1 AP and one pattern/capacity. A retainer has at most10 HP and starts at that pattern’s remaining vitality. It has no creation attack, inventory or autonomous AP. Dismiss costs1 AP; encounter closure also dismisses. Neither heals the pattern. Re-manifesting a damaged pattern retains its damage.

3. Orders refresh to2 once per own-turn start. Every order also spends caster AP. Each manifestation acts at most once in that window, including strike, move, guard or testimony. Order range is30ft; strike range5ft. Retainer command movement10ft, guardian5ft. No independent pet turns or reactions.

4. Damage changes actor HP and underlying pattern vitality together. Vitality0 exhausts the pattern until a completed long rest; accepted defeat removes the manifestation and releases capacity. Reload cannot create a fresh body or restore vitality.

5. Bone Bastion costs2 AP, two distinct unexhausted patterns and both capacity in one guardian. Its current HP equals their remaining vitality sum, maximum20. Allocate guardian damage to the lexicographically first component pattern first. Dismissal preserves those remainders; defeat exhausts both. Merging never heals or duplicates bodies.

6. Coordinated Muster costs2 AP and both orders, and uses two different unused capacity-one retainers. Each may reposition5ft and strike the same enemy. Only two legal hits apply the5ft movement penalty. Veil Escort costs1 AP/order and the actor’s action for ward3 instead of attacking.

7. Last Testimony costs2 AP/order and that actor’s action, once per prepared pattern per completed rest. It asks what the actual witness knew. Dismissal, re-manifestation or a renamed question cannot refresh its limit.

8. Encounter closure dismisses manifestations without vitality restoration. Resolve unknown creation/command intents first. Long rest cannot refresh patterns while their old manifestations remain active.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| grave-marshal / Grave Marshal | Position two modest bodies and commit both orders to a surround. | Coordinated Muster includes a legal5ft reposition before each strike; both hits impair movement. | One actor dead, used or unable to reach denies the coordinated action. | Later: finite formation orders and explicit lane control, never free actors/AP. |
| soul-shepherd / Soul Shepherd | Trade a witness’s action for protection or actual testimony. | Veil Escort1 AP/order gives ward3 and no attack; questions are bounded by actual knowledge. | Lower damage and real anchor/reciprocity obligations. | Later: witness rescue/carry rites and finite protection clauses, not omniscience. |
| ossuary-architect / Ossuary Architect | Commit both capacity and two patterns to one heavy guardian. | Bone Bastion has at most20 HP,1d8 Smashing and5ft command movement, but only one action. | One expensive actor exposes both patterns to defeat. | Later: explicit guardian loadouts and tradeoffs, not armies or free world walls. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Grave Marshal; Coordinated Muster learned with11/15 talent points. Prepared A/B/C vitality10 each; no actors. Legal adjacent spaces and surround; enemy has sufficient HP.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Manifest A1 AP and B1 AP; Grave Order A strike1 AP (d6=4), then B move1 AP. | 4−1−1−1−1=0 | Capacity0→1→2; orders2→1→0; both actor actions used. Assigned damage4; no creation attacks. |
| T2 | Start restores orders2/actions. Coordinated Muster2 AP/orders2: both reposition legally and hit (d6=4,3). Enemy later defeats B. | 4−2=2 | Orders2→0; assigned damage7 and enemy movement−5ft. Capacity2→1 after accepted defeat; B vitality0/exhausted. |
| T3 | Start restores orders2. Manifest C1 AP; order A strike1 AP; order C move1 AP. | 4−1−1−1=1 | Capacity1→2; orders2→1→0. C uses its own10 vitality, not a resurrected B. Each actor acts once. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Last Testimony asks what the particular witness observed. Dead porters, burial care and archive custody are finite actual tasks, not invented testimony or extra autonomous turns outside combat.

## Native origins and acquisition — recommended, not current canon

mortuary_apprenticeship + named_dead_anchor + command_release_training. Actual dead-pattern custody differs from an Animist advisory presence or Lichborne self-anchor.

**Institution, founder/transmission and current crisis:** PROPOSED mortuary fellowship within the existing Twice-Born coalition, taught by Bedel crypt keepers and Nethien filed-witness practitioners. Kora is dead with preserved voice; Kor-Vasseth may coordinate the coalition, not own every summon. Cold Hearth/Bryngloom remains a real regional seat.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| clean_vreken / Lantern Marshal | Once per completed long rest, a named Deep-Glow witness may answer one additional concise yes/no question about something it actually saw. | The second question still pays Last Testimony’s AP/order/action on a later turn. The invocation broadcasts light/voice120ft and records a reciprocity obligation; no extra capacity. | Kora’s preserved voice and uncommanded waking graves challenge who is calling the dead. |
| velun_neth / Ledger Marshal | On a paid Last Testimony, a precise archive citation identifies whether this witness matches its filed identity before the question; once/rest it can prevent a wrong-witness answer. | A bad citation must be resolved before that file is used again. It never refunds paid consequences or grants free orders. | Rejected/forged entries make provenance important without granting an omniscient archive. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [deathcaller R1 JSON](manifests/deathcaller-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_deathcaller_manifest_retainer / Manifest Retainer | 1 / class-feature | 1/0 | dead.manifest: 1 AP; one unexhausted prepared pattern and capacity1 reserved. | Manifest one prepared named dead pattern in an adjacent legal space. It occupies one of two capacity and cannot attack just because it appeared. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":5,"targetRestrictions":["legal-empty-space"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_deathcaller_grave_order / Grave Order | 1 / class-feature | 1/0 | dead.order: 1 AP and one of two orders; exact actor must have action unused. | Spend an order and your own AP to command one manifested actor to strike an adjacent enemy or move up to its template’s command distance. An actor acts at most once per your own turn. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["own-manifestation","enemy-or-legal-path"],"maxTargets":2}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_deathcaller_last_testimony / Last Testimony | 2 / spell-pick | 2/0 | dead.testimony: 2 AP, one order and this actor’s action; one question/pattern/completed rest. | Ask a manifested named witness one concise question about something it actually observed. The answer does not include hidden information the witness never had. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["own-named-witness"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_deathcaller_coordinated_muster / Coordinated Muster | 3 / talent-signature / grave-marshal | 2/0 | dead.coordinate: 2 AP, both orders, action of each of two different unused actors. | Command two different manifested retainers into a declared surround. Each may reposition up to5ft then strike the same quarry; if both legal strikes land, its next movement allowance is reduced5ft. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["two-own-retainers","enemy"],"maxTargets":3}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_deathcaller_veil_escort / Veil Escort | 3 / talent-signature / soul-shepherd | 1/0 | dead.escort: 1 AP, one order, manifestation’s action; no attack. | Use a witness’s action to guard a nearby willing ally instead of attacking. A three-point one-use ward lasts until your next own turn. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["own-manifestation","willing-ally"],"maxTargets":2}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_deathcaller_bone_bastion / Bone Bastion | 3 / talent-signature / ossuary-architect | 2/0 | dead.bastion: 2 AP, two unexhausted patterns, capacity2; one actor, not two actors worth of turns. | Manifest one ossuary guardian from two prepared dead patterns. It occupies both capacity, moves slowly and remains dependent on your orders rather than gaining independent turns. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":5,"targetRestrictions":["legal-empty-space"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Alternative dead-pattern/command choices |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Witness/labor/exploration choices |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes and validated templates |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Release/defense/counter-summon options |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Guardian loadout and finite muster options |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Noncombat specialist dead patterns |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Bounded formation orders |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Entity/command counterplay |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | High-level named orders |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Capstones without free actor AP |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Named pattern/template versions, capacity, vitality-to-creation-HP mapping, caster AP/orders, per-actor action gate, defeat/dismissal and witness knowledge/expiry. No arbitrary creature JSON or free independent AP.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-S1-summon-lifecycle. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Two capacity seals and two order ticks; real manifestation HP/status; prepared/exhausted pattern indicators. Expanded provenance, action-used, vitality, exact binding and dismissal.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

Preserve44 Revenant spells, Toll/phylactery/Death Shroud and all old trees. Sanguine Harvest minion prose is reuse evidence, not an existing admitted roster. No phylactery reserve becomes orders. Owners select qualified patterns and new talents; blood-predator content may remain compatibility/archive rather than being forced into summoning.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Animist communes through a real presence/medium without this command economy; Lichborne transforms the self. Deathcaller repeatedly decides who acts, where and how under finite orders, not a soul meter.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Deathcaller — commanded dead entities

**DESIGN INTENT:** restore independently from Revenant; summoning/command is central. **PROPOSED:** the new design. **Status: design draft, incomplete roster/content/heritage contracts.**

## Evidence and identity

**HISTORICAL:** old Deathcaller primarily spent HP/mana, generated volatile Blood Tokens and chose seven irreversible Ascension Paths. Its three trees were Blood Reaver, Spectral Master and Void Caller. The creator's intended summoner is therefore a redesign, not simply restoring that old module. **CONFIRMED current:** Revenant has finite Death-Toll and Phylactery contracts; Sanguine Harvest's authored passive raises dead enemies as short-lived minions, but that prose does not prove summons execute.

Recommended name Deathcaller; alternatives Necromancer, Gravecaller, Spirit Marshal, Bonecaller. “Necromancer” is a familiar valid alternate, not rejected for being conventional. Introduction: “The dead do not become a fuel bar. They become the witnesses, bearers and soldiers you must direct. Decide who manifests, what you ask of them and when to let them go.” Combat: minion commander/control. Noncombat: recover testimony, burial assistance and finite dead-labor tasks. Complexity high. Weakness: setup, limited orders, vulnerable manifestations and obligations to named dead.

## Proposed exact prototype resource

- A persistent **Muster** of three prepared named dead patterns, selected at rest from known/qualified records. A pattern is a template with version and actual provenance, not an arbitrary copied creature stat block.
- **Manifestation capacity 2**, maximum two active summoned actors, each occupying one capacity. No unlimited army or free creature-library imports. Roster size and active actors are separate.
- **Orders 2 per own turn**, replenished once from server turn identity. Each summon can execute at most one order per own-turn window. Every order also spends **1 caster AP**; summons have no separate autonomous AP refresh in the prototype.
- Manifest (1 AP): create one prepared actor in a legal adjacent unoccupied location, consume one capacity, no attack on creation. New actor identity/incarnation is bound to caster and template version.
- Basic spectral actor prototype: 10 HP, one 1d6 Wyrd strike at 5 ft, no equipment/inventory, no implicit independent reactions; exact defenses/checks require a frozen template.
- Command: consume one order and 1 caster AP, perform that actor's one named supported action. No resource gain from killing an enemy. Dismiss (1 AP) or actor defeat releases capacity only after accepted removal; cannot undo that actor's already accepted consequences.
- Manifestations last until encounter closure or explicit dismissal/defeat. Muster remains; own-turn order refresh does not heal actors or re-summon defeated ones. A defeated pattern is unavailable until a rest preparation. Rest processing must be authoritative before automation claims.

## Three trees

| Tree | Tactical behavior | Resource changes | Signature / utility / support | Weakness | Capstone direction |
|---|---|---|---|---|---|
| Grave Marshal | Move two modest bodies to control lanes, command in sequence | Two capacity-one manifestations; no extra AP | Coordinated Muster orders two *different* actors, paying both AP/orders | Split attention, fragile summons | One finite formation order with explicit actor list |
| Soul Shepherd | Manifest a witness as protection/knowledge rather than an attacker | One reserved capacity shelters a named spirit; orders become aid/retrieval | Last Testimony asks only what the witness actually knew; Veil Escort guards one ally | Less damage and no omniscient answers | Carry one threatened witness through a scene under finite bond rules |
| Ossuary Architect | Invest both capacity in one constructed undead guardian | One capacity-two actor; same two-order budget, actor still one action/turn unless a specific approved talent changes it | Bone Bastion braces a choke point, carries equipment only if explicitly templated | One target, poor repositioning and meaningful loss on defeat | One finite guardian transformation with clear vulnerability |

No tree grants arbitrary extra turns merely by adding minions. Full 50-point nodes, prerequisites, template progression and exact capstones remain to author.

## Three-turn numerical example

Initial Muster A/B/C, capacity 0/2, orders2; caster 4 AP illustrative.

1. **T1:** Manifest A (1 AP): capacity1/2. Manifest B (1 AP): capacity2/2. Command A strike (1 AP, order2→1): recorded 1d6=4, GM resolves the supported attack. Command B move (1 AP, order1→0). Each creation/move/attack is an explicit action; no summoning attack bonus.
2. **T2:** Orders refresh0→2. Command A guard ally (1 AP, orders2→1), B strike (1 AP, orders1→0). Enemy later defeats B; accepted removal releases capacity2→1, Muster B is exhausted until rest.
3. **T3:** Orders0→2. Choose Manifest C for1 AP (capacity1→2), then command C reposition (orders2→1) and A strike (orders1→0), paying2 additional AP. The player replaces a role rather than harvesting B's death into a generic soul meter.

Tree example contrasts: Marshal manifests/positions/coordinates two bodies; Shepherd prepares/escorts/questions one witness; Architect builds/braces/relocates one expensive guardian. Final per-tree numerical examples remain required.

## World and native review

**CONFIRMED leads:** Bedel crypt culture preserves named dead and lit fungal shrouds (`vreken.js:18–28`); current Revenant Bedel edge calls a named spirit but charges finite reserve; Nethien archive requests and Merryn maintained mortuary ink are separate practices. None means every Revenant-native heritage becomes a native Deathcaller.

Native roster/prohibitions remain **UNRESOLVED** until full 25-heritage review. Proposed acquisition: qualified mortuary apprenticeship, an actual named remains/witness anchor and demonstrated command/release discipline. A dead entity is not created by storytelling or collective belief. Proposed institution is a mortuary command branch negotiated with current Twice-Born/crypt orders, not an assertion that Kor-Vasseth automatically leads both successors. Kora's preserved voice can be relevant evidence without resurrecting her as a living founder.

Candidate variant briefs, conditional on assignment: Bedel Lantern Marshal uses a visible named spirit channel with exposure/reciprocity cost; Merryn Wake Captain transports a witness in maintained ink with salt/record upkeep. Neither receives free capacity or automatic resurrection. New institution, leader, headquarters and exact bounded edge rows remain approval items.

## SVG and surfaces

Compact soul muster ledger: two capacity seals with actual actor statuses and two order ticks. Distinguish absent, manifested, defeated and unavailable; never represent minion HP as the caster's soul count. Expanded roster lists template/version/provenance, current actors/HP, order used, exact binding and dismissal. Wizard edits template choice/capacity, caster AP/order price, supported command and duration. Observer summary reveals only public manifestations, not private witness knowledge.

## Runtime, persistence and progression

Requires authoritative summoned-actor lifecycle, spatial placement, turn ownership, template validation, caster AP plus summon order plus target effect conservation, recovery and removal. This can require more actors than P7 currently permits. Do not emulate summons by decorative token creation and claim command authority. Muster lives in personal state; manifestations/orders/bindings in room state; reopening a personal save cannot duplicate an existing manifestation.

Progression direction: manifestation/command1, witness aid2, differentiated templates3, lane command4, tree transformation5, counter-summon/release6, advanced muster7–8, finite sovereign order9–10. Six briefs: Call the Witness, Manifest Retainer, Grave Order, Coordinated Muster, Veil Escort, Bone Bastion. Full structured spell library and final unlock tables remain outstanding.

</details>
