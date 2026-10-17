# Hunter (working name) — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Read one quarry, obtain different evidence and spend the opening through solo stalking, a pack or a glaive route.

**Repeated decisions:** Keep or change quarry; use this turn’s evidence opportunity on Read, Angle or Pressure; move or strike; employ a real companion only when its playstyle fits.

**Role, complexity and weaknesses:** Medium-complexity mobile precision/control and survival tracker. Setup, one-target commitment, shared generation cap and lost contact constrain it.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "hunter-evidence",
  "quarryMax": 1,
  "evidence": [
    "read",
    "angle",
    "pressure"
  ],
  "distinctMax": 3,
  "newTagsPerOwnTurn": 1,
  "evidenceRecord": [
    "originalEventId",
    "source",
    "ownTurnId"
  ],
  "lostContactExpiry": "end-second-no-contact-own-turn",
  "companionOptional": true,
  "companionActionMaxPerOwnTurn": 1,
  "activeReturnPathMax": 1
}
```

1. One exact quarry ref, not an arbitrary name or hidden-identity lookup. Changing through Mark Quarry1 AP clears all old evidence and retires the old path. Investigating an unknown real trail can provide noncombat information without inventing an exact combat identity.

2. Mark1 AP designates/studies and grants Read if absent and the generation budget is unused. Take Angle1 AP uses10ft remaining legal movement and10ft displacement, ends within30ft of quarry, and grants Angle under the same cap. Ordinary UI movement grants none.

3. Press2 AP is one Prism-adjudicated hunting strike:1d8+2 Stabbing within30ft. Only an accepted original non-miss hit grants Pressure under the cap. A miss pays AP but gives none; stale/retry/damage-taken farming never generates evidence.

4. At most one NEW tag per own turn across all self/companion/heritage sources. Duplicate tags do nothing. Spending a tag does not refresh generation. Every tag retains its actual source event.

5. Ambush2 AP consumes Read+Angle for2d8 Slicing, grants no tags and needs no companion. Cross the Scent2 AP consumes Read+Pressure and one actual companion action for up to10ft movement and a1d8 Primal adjacent strike.

6. A Beastmaster has a positively bonded/trained companion, not a HUD-created pet. Its core command costs1 caster AP and that companion’s one action per caster turn: study for Read, or move up to10ft and make one adjacent1d6 Primal strike for Pressure on an accepted hit. Both share the one-tag cap. Cross the Scent uses the same action allowance. Missing companion disables these actions only.

7. Returning Path2 AP consumes Angle+Pressure and commits a named glaive to one≤20ft segment within30ft. Only the bound quarry’s first voluntary crossing triggers one1d8 Slicing strike. EndT+2 expiry,1-AP dismissal or quarry retirement returns the weapon but no evidence. No hidden multi-target attack.

8. Explicit observation/movement/hit operations or actual GM-confirmed track contact renew last contact. After two full own turns without contact, evidence expires. Quarry death/retirement/change clears it. Encounter closure clears evidence, not the companion bond or sensory Trade.

9. Field method requires field_apprenticeship/tracking_training. Quiet method also requires an actual sensory_trade/sensory_training. Beastmaster adds real companion bond/training. Renaming a legacy Apex does not restore hearing or delete its companion.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| stalker / Stalker | Study and approach alone, then choose when to reveal the strike. | Patient Ambush spends Read+Angle; both required generators are core and solo-viable. | At least two own-turn generation windows; changing prey forfeits evidence. | Later: line-of-approach/escape utility and one finite ambush commitment. |
| beastmaster / Beastmaster | Coordinate quarry/companion positions and spend caster actions on the pack. | Cross the Scent uses Read+Pressure and the companion’s actual action; basic command shares the cap. | Unavailable companion or blocked path denies the pack action, not the whole class economy. | Later: finite commands/bond defense, never free creature turns. |
| trailblade / Trailblade | Spend evidence and commit a weapon to a route the quarry can avoid. | Returning Path binds a named glaive and two tags to one delayed crossing strike. | Avoidance/retirement means no payoff/refund; geometry and voluntary movement matter. | Later: bounded route/wilderness-control variants after real event/area support. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Stalker; Patient Ambush learned with11/15 talent points; no companion. Quarry is visible and legal; each10ft path has remaining movement. Faces are non-miss/noncritical under GM adjudication.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Mark Quarry1 AP obtains Read. Press2 AP, recorded d8=5 non-miss. | 4−1−2=1 | QuarryE; Read only. No Pressure because Mark used the one-tag budget; assigned strike7. |
| T2 | Start resets generation budget. Take Angle1 AP/10ft movement; Patient Ambush2 AP,2d8=4+3. | 4−1−2=1 | Read+new Angle both consumed; evidence empty; assigned7. Ambush grants no Pressure. |
| T3 | Press2 AP, recorded5 non-miss, obtains Pressure. Take Angle1 AP/10ft for better position. | 4−2−1=1 | Pressure only: the second action moves but cannot grant Angle after generation was used. No companion required. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Track actual spoor, plan routes and survive. Study an unknown trail without magically naming the creature. Native techniques read specific substrates, not a universal map of hidden enemies.

## Native origins and acquisition — recommended, not current canon

Field or Quiet method as above. Each of the seven native recommendations has its own existing hunting variant evidence; other peoples need real field-school or acquired Quiet training.

**Institution, founder/transmission and current crisis:** Preserve Silent Hunt/Sylas/Still Blind near Greythorn for the Quiet method. Positively recognize local Skald, Ordu, Anhur and Nereid field teaching as the method proposal. Sylas remains living and deaf; no global Apex replacement.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| skald_human / Glacier-Stalker | Read age/direction of preserved-ice traces within the prepared field practice. | Warm/melted surfaces remove that extra record; ordinary tracking and core class remain. | Warming glaciers erase physical evidence. |
| ordan_human / Steppe-Scent | Read a real grass/scent/thermal-wind trail in open steppe. | Enclosed terrain removes this extended-medium edge; route/reference care still required. | False wind trails require verification. |
| veiled_mimir / Mask-Hunter | Use a maintained lineage archive to distinguish a known identity disturbance from an actual recorded track. | Care for the finite heirloom reference; it does not reveal unknown prey. | Mist evades old archive patterns. |
| tethered_mimir / Sentinel-Tracker | Read an observed incursion trace against a declared logged perimeter. | Maintain that actual perimeter and self/Mote reference; no lineage mask required. | Gaps and forged traces challenge the vigil. |
| marked_vreken / Mycelium-Scent | Read moving quarry through an actual nearby connected fungal substrate. | Stationary/disconnected prey needs ordinary tracking; invocation exposes glow/overload risk. | Damaged Root-Veil removes specific connections, not all tracking. |
| thrask_solari / Ash-Stalker | Read residual heat/direction in volcanic ash and scoria. | Wet/cold ground removes the favored trace; no heat/cold immunity. | Vigil contracts and sealed warm vents create choices. |
| deepling_myrathil / Trench-Stalker | Read current-shear/pressure traces using a prepared amphibious field focus. | Land trips require hydration/pressure care and, for pack actions, a supported actual companion; field actions still work. | Unknown trench signatures stalk the hunters. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [hunter R1 JSON](manifests/hunter-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_hunter_mark_quarry / Mark Quarry | 1 / class-feature | 1/0 | quarry.mark: 1 AP; changing quarry deliberately destroys previous tags. | Designate or study one exact quarry. A changed quarry loses all old evidence; a legal Study obtains Read only if your own-turn generation budget is unused. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":60,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_hunter_take_angle / Take an Angle | 1 / class-feature | 1/0 | quarry.angle: 1 AP and10ft of remaining legal movement. | Move ten feet along a legal pursuit path to change your attack position. If your evidence budget is unused, obtain Angle; ordinary movement alone does not manufacture it. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_hunter_press_quarry / Press the Quarry | 1 / class-feature | 2/0 | quarry.press: 2 AP; no evidence cost. | Make one authored hunting strike against the exact quarry. A resolved non-miss hit can generate Pressure; declaration, damage to a different enemy or a second event that turn cannot. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_hunter_patient_ambush / Patient Ambush | 3 / talent-signature / stalker | 2/0 | quarry.ambush: 2 AP, Read+Angle. | Consume Read and Angle for one carefully prepared precision strike against your quarry. A companion is not required to prepare or execute this attack. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_hunter_cross_scent / Cross the Scent | 3 / talent-signature / beastmaster | 2/0 | quarry.cross-scent: 2 AP, Read+Pressure, companion action for this own turn. | Consume Read and Pressure to send your actual trained companion along a short flanking route and strike the same quarry. This is a paid command, not a free extra pet turn. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["bonded-companion","quarry"],"maxTargets":2}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_hunter_returning_path / Returning Path | 3 / talent-signature / trailblade | 2/0 | quarry.return-path: 2 AP, Angle+Pressure; named glaive committed until trigger/expiry/dismissal. | Consume Angle and Pressure to commit a glaive return line. Your quarry’s first voluntary crossing triggers one slicing strike; it can avoid the route instead. No other creature is secretly attacked. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["quarry-and-legal-segment"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":2,"durationUnit":"subsequent_caster_turn_end"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Optional pursuit/defense choice pool |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Tracking/exploration and actual bond training |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes/prerequisites |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Reactions only after timing support |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Finite companion/route options |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Survival/support choices |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Advanced quarry counterplay |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Bounded terrain control |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Prepared escape/pursuit choices |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Capstones retaining solo viability and tag cap |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Exact quarry, distinct evidence, shared generation budget and resolved source; companion role/action; legal movement and one bound-quarry segment/expiry. Solo preview never requires a pet.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-H1-evidence-space, CR-E2-deferred-consequence, CR-G1-zone-membership. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Quarry plus three different Read/Angle/Pressure glyphs, generation-used cue and contact expiry. Show companion only in its actual mode; expand source events, committed weapon/path and pending action.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

All54 Apex spells, companion link, generation receipts and3/4 caps remain compatible. New Hunter ID/tag domain: never divide five Marks into tags or delete sensory loss/companion. Huntress may remain a title; Nereid Apex alias stays narrow until approved migration.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Warden holds a grafted territorial duel; Hunter obtains an opening and pursues. Solo and pack can share one class because each obtains/spends real evidence without forcing companion generation.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Hunter — Apex/Huntress reconstruction decision

**DESIGN INTENT:** Hunter is preferred provisionally; do not automatically rewrite Apex. **PROPOSED recommendation:** one Hunter with viable solo, companion and glaive/terrain paths, supported by a redesigned shared pursuit foundation.

## Evidence that changes the problem

The immediately pre-consolidation **Huntress was already companion-dependent**. Its overview explicitly says Quarry Marks come from coordinated companion attacks, not individual hits; three trees were Shadowblade, Bladestorm, Beastmaster. Thus the creator's remembered solitary stalking fantasy is a design direction to recover from earlier history or rebuild, not a fact proved by the latest historical Huntress file.

Current Apex is unambiguous: Marks0–5, own-turn generation cap3 or4 Beastmaster, pack events only; a solo hit gives none (`apexResourceContract.js:3–12,74–94`; `classResourceContracts.js:227–230`). Companion token identity/availability and resolved-event IDs matter. A Hunter name change alone leaves a solo specialization starved.

## Recommendation and alternatives

Use **Hunter**, retain “Huntress” as an available character title, and preserve Apex as compatibility. Alternatives: Ranger, Stalker, Huntmaster, Predator. Do not make two base classes unless playtesting demonstrates a genuinely distinct companion-command fantasy that cannot share pursuit decisions.

Core fantasy: identify prey, obtain real evidence, create a favorable approach and cash in the opening. Combat: mobile precision, companion optional, finite terrain preparation. Noncombat: tracking, survival, scouting, route planning. Medium complexity. Weakness: preparation against exact quarry; changing prey discards progress; no universal damage advantage against everything.

## Proposed resource: Quarry + Evidence

- One exact quarry ref, or null. Designate/change for1 AP; changing removes all old evidence.
- Three **distinct tags**, not three interchangeable marks: `read` (observed behavior/trail), `angle` (actual legal reposition), `pressure` (resolved accepted hit or coordinated pack event).
- Obtain at most one new evidence tag per own-turn window, regardless of source; duplicate tag does nothing. Default solo access: Study1 AP grants Read; a recorded10-ft reposition to a new approved angle grants Angle; a resolved hit grants Pressure. Movement/angle legality requires an approved spatial rule, not inferred screen pixels.
- A tactic consumes exactly its listed tags; one tag cannot pay twice. Evidence expires when quarry dies/is retired, target is deliberately changed, or at the end of two own turns without renewed contact. No generation at cast declaration.
- Companion scouting can supply Read or a pack hit Pressure using the same generation budget and caster AP cost, not an extra free generator. Solo mode has the same fundamental opportunities. Companion safety/bond is an additional playstyle choice rather than a universal access requirement.

## Three trees

| Tree | Player behavior | Resource changes | Signature | Weakness/capstone |
|---|---|---|---|---|
| Stalker | Observe and approach alone, choose when to reveal position | Read/Angle tactics with less dependence on a landed hit | Patient Ambush consumes Read+Angle for one precision strike | Setup can be disrupted; capstone one prepared escape/ambush exchange |
| Beastmaster | Coordinate distinct positions with one actual companion | Companion may create a tag under the same cap; no solo tax | Cross the Scent uses Read+Pressure for a named coordinated maneuver | Companion can be defeated/unavailable; finite command capstone |
| Glaive Warden (working title) | Place a return line and control a wilderness lane | Angle supports a marked finite line, not a generic AoE damage tree | Returning Path consumes Angle+Pressure to resolve a declared glaive route | Space/return geometry; capstone one finite pursuit corridor |

“Glaive Warden” collides with base Warden; stronger naming candidates are Trailblade, Glaive Stalker or Waylayer. Decide after the mechanics are validated. Existing Shadowblade/Bladestorm talents require an exact preservation map, not wholesale renaming.

## Three-turn example

Initial quarry null, no tags.

1. **T1:** Designate enemy E (1 AP). Study (1 AP), gain Read. Generation budget used, so a later hit this turn cannot also grant Pressure.
2. **T2:** Reposition10 ft into an approved new angle, gain Angle. Use Patient Ambush (2 AP), consuming Read+Angle. The attack's success cannot grant Pressure this same turn because the tag budget was already used. Tags now none; quarry remains E.
3. **T3:** Land an accepted basic attack, gain Pressure. The player can keep that tag for a later coordinated tactic or change quarry for1 AP and deliberately lose it. A solo Hunter functions throughout without a companion.

Each tree needs a final three-turn tactical example with actual AP/movement/tags. This base example proves only the proposed economy is solo-viable.

## Native tradition consequences

Current Apex has seven native heritage records: Skald, Ordu, Arch Mimir, Broken Mimir, Cromyx, Anhur and Nereid; use the matrix for exact IDs. Its provenance requires sensory Trade + training + bonded companion. **That must be revised deliberately** if the base Hunter permits solo play. Proposed method separation: Quiet-Traded Hunter and learned field Hunter, with independent requirement lists; native method and companion tree qualification cannot be inferred from a generic Hunter name.

Do not remove a legacy character's companion or sensory loss. Sylas remains the living Broken Mimir founder personally deaf through the Trade; renaming him or granting a restored sense is not part of public-name migration. New native assignments/methods and acquisition exceptions remain unresolved until all cultures and institutions are reviewed.

## Presentation and implementation

SVG tracking instrument shows quarry silhouette/initials and three differently shaped evidence symbols, not filled pips called Marks. Companion status appears only for its actual mode/tree. Expanded menu shows provenance/event ID/expiry for every tag, target-change loss warning and linked companion identity. Wizard authors exact tags, legal sources, generation timing and tactic costs. Runtime needs resolved-hit and spatial evidence, class method/version migration and existing-authority commands. Full Hunter spell library,50-point trees and per-native variants remain outstanding; current54 Apex spells stay intact.

</details>
