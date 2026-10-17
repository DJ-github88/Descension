# Current class audit — registration and authored inventory

> **AUTHORED** census of the working tree on 2026-10-17T17:58:33.651Z. Source hashes: [current-census.json](evidence/current-census.json). Counts do not establish execution.

## Baseline

21 base classes, 24 class lookup keys, 1,026 unique authored class spell IDs, 65 registered trees and 1,219 wired talent nodes. All 25 heritage IDs are represented; there are **102 native class/heritage relationships**. Older memory claiming 56 relationships is stale.

| Class | Stable ID | Spells | Damage effect | Healing effect | Control effect | Utility effect | Reactions | Trees | Resource engine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arcanoneer | arcanoneer | 43 | 28 | 1 | 7 | 3 | 0 | 3 | elementalSpheres |
| Berserker | berserker | 47 | 19 | 0 | 10 | 7 | 1 | 3 | bloodHeat |
| Shaper | shaper | 56 | 18 | 2 | 4 | 16 | 4 | 3 | kineticFluxBodyToll |
| Harbinger | harbinger | 45 | 32 | 0 | 3 | 7 | 1 | 3 | mayhemGauge |
| Chronarch | chronarch | 49 | 9 | 7 | 3 | 16 | 4 | 3 | timeShardsStrain |
| Inquisitor | inquisitor | 46 | 15 | 1 | 17 | 16 | 1 | 3 | authority |
| Revenant | revenant | 44 | 24 | 5 | 14 | 9 | 1 | 3 | revenant-toll |
| False Prophet | false_prophet | 54 | 17 | 3 | 14 | 7 | 0 | 3 | madnessPoints |
| Gambit | gambit | 65 | 22 | 5 | 4 | 15 | 5 | 3 | fortunePoints |
| Apex | apex | 54 | 24 | 0 | 5 | 17 | 2 | 3 | quarryMarksCompanion |
| Animist | animist | 49 | 19 | 8 | 10 | 8 | 0 | 3 | ancestralResonance |
| Lunarch | lunarch | 43 | 23 | 3 | 10 | 6 | 0 | 3 | lunarPhases |
| Martyr | martyr | 48 | 13 | 13 | 0 | 9 | 2 | 4 | devotionGauge |
| Minstrel | minstrel | 51 | 23 | 10 | 6 | 7 | 0 | 3 | musicalNotes |
| Plaguebringer | plaguebringer | 50 | 25 | 3 | 8 | 11 | 0 | 3 | virulenceCultivation |
| Pyrofiend | pyrofiend | 52 | 28 | 1 | 5 | 11 | 0 | 3 | infernoVeil |
| Spellguard | spellguard | 48 | 19 | 1 | 7 | 19 | 7 | 3 | arcaneEnergyPoints |
| Toxicologist | toxicologist | 50 | 20 | 2 | 9 | 13 | 1 | 3 | toxinVialsContraptions |
| Warden | warden | 46 | 21 | 0 | 15 | 8 | 1 | 4 | vengeance-points |
| Augur | augur | 45 | 17 | 8 | 4 | 14 | 2 | 3 | benediction-malediction |
| Crusader | crusader | 41 | 18 | 3 | 7 | 3 | 3 | 3 | radiantFervor |

Categories overlap and follow explicit effectTypes/spellType, not inferred prose. Complete definitions are in [authored-spells.json](evidence/authored-spells.json).

## Current pure P9 support evaluation

| Class | Spell ID | Name | Payment domain | Affordable in level1/all-stats10 fixture |
| --- | --- | --- | --- | --- |
| Arcanoneer | arc_spark_bolt | Marrow-Piercing Slug | elementalSpheres | false |
| Martyr | martyr_restorative_prayer | Restorative Prayer | devotionGauge | true |
| Minstrel | minstrel_opening_chord | Opening Chord | musicalNotes | true |
| Minstrel | minstrel_harmonic_strike | Harmonic Strike | musicalNotes | true |

These four pass current original-definition/shape/payer/formula admission. This is not a new browser/server acceptance run. Support and affordability differ: the Arcanoneer fixture lacks recipe ingredients, while the action shape is supported. Full manual-refusal reasons per class are in the census.

## Structural results

| Class | Level/pool-reference issues | Advertised specs without tree | Wired trees absent from overview | Native pair without variant | Variant outside native roster | Unpooled spells |
| --- | --- | --- | --- | --- | --- | --- |
| Arcanoneer | 0 |  |  |  |  | 1 |
| Berserker | 0 |  |  |  | thrask_solari | 2 |
| Shaper | 0 |  |  |  | marked_vreken | 2 |
| Harbinger | 0 |  |  |  | thrask_solari | 0 |
| Chronarch | 0 |  |  |  |  | 4 |
| Inquisitor | 0 |  |  |  | clean_vreken | 0 |
| Revenant | 0 |  |  |  | marked_vreken, deepling_myrathil | 0 |
| False Prophet | 0 |  |  |  | tessen_human, clean_vreken | 2 |
| Gambit | 0 |  |  |  |  | 6 |
| Apex | 0 |  |  |  | clean_vreken, vashir_astril | 2 |
| Animist | 0 |  |  |  | skald_human, morgh_groven, thrask_solari | 0 |
| Lunarch | 0 |  |  |  | tethered_mimir, thalren_human | 3 |
| Martyr | 0 |  |  |  |  | 1 |
| Minstrel | 0 |  |  |  | clean_vreken | 3 |
| Plaguebringer | 0 |  |  |  |  | 2 |
| Pyrofiend | 0 |  |  |  |  | 3 |
| Spellguard | 0 |  |  |  |  | 2 |
| Toxicologist | 0 |  |  |  |  | 3 |
| Warden | 0 |  |  |  | clean_vreken, marked_vreken | 1 |
| Augur | 0 |  |  |  | tessen_human, clean_vreken | 1 |
| Crusader | 0 |  |  |  | skald_human, vashir_astril, korr_solari | 0 |

No missing/level-mismatched spell-pool references were found by this census; this does not verify level-up selection, unlocks, passives, talent execution or all runtime mutations. Native/variant mismatches above need individual lore review, not automatic deletion or access expansion.

## Full class metadata evidence

Each current-census classes[].metadata record includes identity, overview/origin, equipment, resources, specializations, restrictions, variants, living order, friction, spell pools and additional per-class structures without flattening them away. Each classes[].normalizedMetadataResource is a diagnostic normalization of definition metadata, **not a verified new-character initial state**.

## Incomplete human audit

Manual per-spell, per-talent, progression, lore/NPC/location, character lifecycle and browser reviews remain required. This document must not be described as a completed 21-class functional audit.
