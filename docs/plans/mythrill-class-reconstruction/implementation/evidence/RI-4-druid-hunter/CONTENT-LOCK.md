# RI-4 — Druid + Hunter complete content lock

**Date:** 2026-10-27  
**Status:** IMPLEMENTED — manual tabletop content; not combat automation, not cloud persistence, not Sol acceptance.  
**Ruleset:** `cr-review-r1`  
**Machine-readable lock:** [CONTENT-LOCK.json](CONTENT-LOCK.json)  
**Evidence report:** [REPORT.md](REPORT.md)

## Scope and decisions

This cohort delivers the two remaining priority classes that had no implementation: **Druid** (approved player-facing name for the transformation class) and **Hunter** (working successor direction for Apex/Huntress). The implementation follows the established integrated class pattern: authored class data, projected spells, complete level pools, three 50-point trees, resource contract, resource guide, HUD display, catalogue/detail/specialization/creation/level-up registration, and preservation of the legacy Shaper/Apex records.

- Druid uses the dossier's anatomical-slot economy: four slots, at most two active traits, three prepared loadouts, a 0–3 transition track, plating 2, Living Brace 4 once, and bounded mimicry.
- Hunter uses the dossier's quarry-evidence economy: one exact quarry, three distinct tags (Read/Angle/Pressure), one new tag per own turn, two-own-turn contact expiry, an optional real companion, and a committed glaive route.
- Neither class registers a native heritage edge. The dossier pairings remain recommendations only; acquisition must be recorded.
- Shaper and Apex remain fully loadable. Compatibility rows point to Druid/Hunter with `automaticConversion: false` and no ID migration.

## Counts

| Class | Core | Optional | Signatures | Capstones | Passive records | Unique records | Trees | Nodes | Ranks |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Druid | 2 | 40 (4/level) | 3 | 3 | 48 | 96 | 3 | 54 | 150 |
| Hunter | 3 | 40 (4/level) | 3 | 3 | 48 | 97 | 3 | 54 | 150 |

Every level has exactly four optional records and at least two non-damage options. Talent budget is 5/level with a global cap of 50; each tree is 18 nodes and 50 ranks (16 three-rank passives + signature + capstone). Signatures require level 3 and 10 same-tree points; capstones require level 10 and 45 same-tree points.

## Druid — `druid`

**Identity:** Adaptive Hybrid / Explorer; primary Constitution, secondary Agility; icon `Nature/Leaf`; shared provisional art `/assets/icons/classes/shaper.png`.  
**Resource:** `druid-body` — **Anatomical Loadout**. Four slots (`locomotion`, `offense`, `defense`, `senses`), at most two active traits, three prepared loadouts (`predator`, `bastion`, `mimic`), transitions 0–3. Adopt 1 AP (+1 transition); Recover the Self 1 AP suspends one active trait until the next own turn and reduces transitions by 1. Plating prevents 2 from the first eligible event each own-turn window; Living Brace prevents 4 once and pins movement to 0. A completed long rest returns the default body and clears the track; reconnect/initiative/scene change does not.

**Core:** `cr1_druid_adopt_loadout` (Adopt Loadout), `cr1_druid_recover_self` (Recover the Self).

**Optional pools (4 per level):**

| Level | Records |
|---:|---|
| 1 | Rending Claw, Chitin Plate, Soft-Step, Taste the Air |
| 2 | Shed the Snare, Lashing Tail, Stonehide Stance, Predator's Leap |
| 3 | Crushing Pounce, Vibration Sense, Mending Molt, Ambush Instinct |
| 4 | Guardian Carapace, Hooked Tendril, Burrowing Retreat, Venom Spur |
| 5 | Twin Talons, Camouflage Skin, Reinforced Joints, Chameleon Gait |
| 6 | Spined Back, Anchoring Root, Regenerative Bloom, Scent Map |
| 7 | Apex Lunge, Mimic Voice, Warding Shell, Slip the Coil |
| 8 | Bonebreaker Bite, Living Wall, Adaptive Hide, Echo Location |
| 9 | Rending Frenzy, Perfect Disguise, Unbreakable Plating, Earthmeld |
| 10 | World-Serpent Strike, Chimeric Form, Crown of Horns, Return to Self |

**Trees:**

| Tree | Signature | Capstone | Emphasis |
|---|---|---|---|
| `predator` — Predator | Pursuit Morph | Apex of the Hunt | locomotion + offense, reach and strike |
| `adaptive-bastion` — Adaptive Bastion | Living Brace | Unbroken Bastion | defense + senses, prevention and stability |
| `mimic` — Mimic | Borrowed Outline | Perfect Outline | locomotion + senses, studied surface anatomy |

**Heritage recommendations (not access):** `morgh_groven`, `ithran_groven`, `veiled_mimir`, `tethered_mimir`. Acquisition records: `shaping_interface`, `transformation_training`, `self_reference_training`, `trait_accounting`.

## Hunter — `hunter`

**Identity:** Pursuit / Precision; primary Agility, secondary Spirit; icon `Nature/Trap`; shared provisional art `/assets/icons/classes/huntress.png`.  
**Resource:** `hunter-evidence` — **Quarry & Evidence**. One exact quarry, up to three distinct tags (`read`, `angle`, `pressure`), each with a recorded source event and own turn. At most one new tag per own turn across all sources; duplicates do nothing. Evidence expires after two own turns without contact, or on quarry death/retirement/change. Companion is optional and spends its own action; no fabricated creature. Committed glaive path is at most 20 ft and expires on the second subsequent caster turn end.

**Core:** `cr1_hunter_mark_quarry` (Mark Quarry), `cr1_hunter_take_angle` (Take an Angle), `cr1_hunter_press_quarry` (Press the Quarry).

**Optional pools (4 per level):**

| Level | Records |
|---:|---|
| 1 | Hunter's Snare, Steady Aim, Trailcraft, Quick Draw |
| 2 | Crippling Shot, Read the Spoor, Evasive Step, Companion Whistle |
| 3 | Piercing Volley, Camouflage, Long Stride, Beast Bond |
| 4 | Hamstring Shot, Trackless Step, Snare Line, Focused Draw |
| 5 | Twin Shot, Hunter's Mark, Field Dressing, Silent Prowl |
| 6 | Barbed Arrow, Herding Call, Forage, Coordinated Strike |
| 7 | Skewering Shot, Trailblaze, Beast Guard, Vantage Point |
| 8 | Pinning Shot, Ghost Step, Beast Frenzy, Wilderness Ward |
| 9 | Heartseeker, Perfect Camouflage, Relentless Pursuit, Pack Tactics |
| 10 | Final Quarry, Master Tracker, Unerring Path, Alpha's Call |

**Trees:**

| Tree | Signature | Capstone | Emphasis |
|---|---|---|---|
| `stalker` — Stalker | Patient Ambush | Death from the Blind | solo Read + Angle ambush |
| `beastmaster` — Beastmaster | Cross the Scent | The Perfect Pack | real companion action, shared tag cap |
| `trailblade` — Trailblade | Returning Path | The Long Way Home | committed glaive route, quarry crossing |

**Heritage recommendations (not access):** `skald_human`, `ordan_human`, `veiled_mimir`, `tethered_mimir`, `marked_vreken`, `thrask_solari`, `deepling_myrathil`. Acquisition records: `field_apprenticeship`, `tracking_training`, `sensory_trade`, `companion_bond`.

## Preservation and compatibility

- Legacy `shaperData.js`, `apexData.js`, their spells, trees, resources and saves are untouched. Shaper still resolves `flux`; Apex still resolves `marks`.
- `classReconstructionCompatibility.js` keeps `shaper → druid` (`successor-name`) and `apex → hunter` (`successor-name`), both `legacyResolutionRetained: true`, `automaticConversion: false`.
- No legacy ID is remapped, converted or silently migrated.
- Druid hashes `metamorph_body` as a resource alias to `druid-body`; no Shaper Flux/Body Toll is reused.
- Hunter does not reuse Apex `quarryMarksCompanion` or `companionHP` state.

## Manual-only limits

- Every record, tree node and resource projection is marked `authoredOnly: true`, `executionEnabled: false`, `applicationMode: 'manual-tabletop'`, `automatedCapabilities: []`.
- No automatic transformation, slot, transition, recovery, evidence tag, contact, companion action, path, damage, prevention, movement or expiry.
- Effects requiring real actor custody, stat replacement, companion execution, condition lifecycle, or spatial events remain manual tabletop procedures.
- Guest/local save/reopen was verified. Account/cloud persistence was not tested and is not claimed.
- No balance validation, automated combat, deployment or Sol acceptance is claimed.
