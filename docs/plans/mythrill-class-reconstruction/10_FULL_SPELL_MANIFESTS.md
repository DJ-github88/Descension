# Spell manifests and completeness

**HeadQ R1 update:** [42 structured representative records](evidence/headq-seven-abilities.json) now cover the seven priorities, with one signature/tree and explicit AP/resource/effect/authoring/runtime/test fields. They follow the proposed [R1 schema](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md), not the currently admitted app schema. Full libraries are deliberately not produced before HeadQ approves core mechanics. Original authored census below is preserved.

> **AUTHORED** census of the working tree on 2026-10-17T17:58:33.651Z. Source hashes: [current-census.json](evidence/current-census.json). Counts do not establish execution.

## Current complete authored inventory

[authored-spells.json](evidence/authored-spells.json) retains every current base-class spell in full, not only examples. Stable IDs are unique across the 1,026 extracted records. It contains original fields plus className, authored:true and executionVerified:false. The snapshot is evidence, not a proposed import artifact.

| Class | Total | Damage | Healing | Control | Explicit utility | Reactions | Non-damage proxy | Unpooled |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arcanoneer | 43 | 28 | 1 | 7 | 3 | 0 | 15 | 1 |
| Berserker | 47 | 19 | 0 | 10 | 7 | 1 | 28 | 2 |
| Shaper | 56 | 18 | 2 | 4 | 16 | 4 | 38 | 2 |
| Harbinger | 45 | 32 | 0 | 3 | 7 | 1 | 13 | 0 |
| Chronarch | 49 | 9 | 7 | 3 | 16 | 4 | 40 | 4 |
| Inquisitor | 46 | 15 | 1 | 17 | 16 | 1 | 31 | 0 |
| Revenant | 44 | 24 | 5 | 14 | 9 | 1 | 20 | 0 |
| False Prophet | 54 | 17 | 3 | 14 | 7 | 0 | 37 | 2 |
| Gambit | 65 | 22 | 5 | 4 | 15 | 5 | 43 | 6 |
| Apex | 54 | 24 | 0 | 5 | 17 | 2 | 30 | 2 |
| Animist | 49 | 19 | 8 | 10 | 8 | 0 | 30 | 0 |
| Lunarch | 43 | 23 | 3 | 10 | 6 | 0 | 20 | 3 |
| Martyr | 48 | 13 | 13 | 0 | 9 | 2 | 35 | 1 |
| Minstrel | 51 | 23 | 10 | 6 | 7 | 0 | 28 | 3 |
| Plaguebringer | 50 | 25 | 3 | 8 | 11 | 0 | 25 | 2 |
| Pyrofiend | 52 | 28 | 1 | 5 | 11 | 0 | 24 | 3 |
| Spellguard | 48 | 19 | 1 | 7 | 19 | 7 | 29 | 2 |
| Toxicologist | 50 | 20 | 2 | 9 | 13 | 1 | 30 | 3 |
| Warden | 46 | 21 | 0 | 15 | 8 | 1 | 25 | 1 |
| Augur | 45 | 17 | 8 | 4 | 14 | 2 | 28 | 1 |
| Crusader | 41 | 18 | 3 | 7 | 3 | 3 | 23 | 0 |

## Level coverage

| Class | L1 total/no-damage | L2 total/no-damage | L3 total/no-damage | L4 total/no-damage | L5 total/no-damage | L6 total/no-damage | L7 total/no-damage | L8 total/no-damage | L9 total/no-damage | L10 total/no-damage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arcanoneer | 7/3 | 4/0 | 4/0 | 4/1 | 4/2 | 4/4 | 4/0 | 4/2 | 4/2 | 4/1 |
| Berserker | 10/8 | 4/2 | 5/3 | 4/2 | 4/2 | 4/2 | 4/2 | 4/2 | 4/2 | 4/3 |
| Shaper | 15/13 | 8/7 | 4/2 | 4/1 | 4/2 | 4/2 | 5/5 | 4/1 | 4/3 | 4/2 |
| Harbinger | 6/3 | 6/2 | 5/1 | 4/0 | 4/1 | 4/1 | 4/1 | 4/2 | 4/1 | 4/1 |
| Chronarch | 9/8 | 6/6 | 5/5 | 4/3 | 4/4 | 4/3 | 4/3 | 4/4 | 4/1 | 5/3 |
| Inquisitor | 8/7 | 6/4 | 4/4 | 4/3 | 4/2 | 4/2 | 4/2 | 4/2 | 4/3 | 4/2 |
| Revenant | 6/5 | 6/5 | 4/0 | 4/1 | 4/1 | 4/2 | 4/2 | 4/2 | 4/1 | 4/1 |
| False Prophet | 10/7 | 6/5 | 6/5 | 5/4 | 7/4 | 4/3 | 4/2 | 4/2 | 4/2 | 4/3 |
| Gambit | 16/10 | 7/7 | 6/4 | 4/3 | 5/5 | 6/3 | 5/2 | 5/3 | 6/2 | 5/4 |
| Apex | 11/9 | 8/7 | 7/3 | 4/1 | 4/2 | 4/1 | 4/1 | 4/2 | 4/2 | 4/2 |
| Animist | 8/7 | 8/7 | 5/1 | 4/3 | 4/1 | 4/3 | 4/2 | 4/2 | 4/2 | 4/2 |
| Lunarch | 7/3 | 4/3 | 4/2 | 4/2 | 4/1 | 4/2 | 4/1 | 4/2 | 4/2 | 4/2 |
| Martyr | 8/6 | 8/7 | 4/2 | 4/4 | 4/2 | 4/2 | 4/3 | 4/3 | 4/2 | 4/4 |
| Minstrel | 11/8 | 5/2 | 7/4 | 4/3 | 4/1 | 4/2 | 4/2 | 4/2 | 4/3 | 4/1 |
| Plaguebringer | 8/5 | 6/4 | 6/4 | 4/1 | 4/2 | 4/2 | 6/1 | 4/2 | 4/2 | 4/2 |
| Pyrofiend | 10/7 | 5/2 | 6/2 | 5/2 | 5/2 | 4/1 | 4/2 | 5/2 | 4/3 | 4/1 |
| Spellguard | 10/7 | 6/5 | 4/3 | 4/2 | 4/1 | 4/2 | 4/2 | 4/3 | 4/2 | 4/2 |
| Toxicologist | 10/8 | 5/3 | 7/3 | 4/2 | 4/2 | 4/2 | 4/2 | 4/3 | 4/3 | 4/2 |
| Warden | 6/6 | 8/5 | 4/2 | 4/1 | 4/2 | 4/2 | 4/2 | 4/2 | 4/1 | 4/2 |
| Augur | 8/7 | 5/3 | 4/1 | 4/2 | 4/2 | 4/3 | 4/3 | 4/3 | 4/3 | 4/1 |
| Crusader | 5/3 | 4/2 | 4/2 | 4/2 | 4/2 | 4/3 | 4/2 | 4/2 | 4/2 | 4/3 |

These counts include all authored records at each level, not only selectable base-pool choices. noDamageEffect means effectTypes lacks damage; it does not prove useful noncombat coverage. Generator/spender counts require each domain planner and timing review; a negative generic cost is not sufficient evidence of resolved-outcome generation.

## Explicit remaining deliverables

- Every restored candidate needs a full ID-reserved manifest with level, base/tree ownership, AP/mana, exact typed resource operations, targeting, damage, durations, checks, conditions, reactions, cooldown, triggers and dependencies.
- The seven have six proposed structured representatives each. Current application schema/compiler/save/execution validation still awaits implementation approval. Other current/historical candidates still need their representative records.
- Each candidate still needs full selectable progression coverage; neither the seven six-record manifests nor their level1–10 remaining-content outlines are complete libraries.
- Map all existing spells and talent grants to retain/transfer/rebuild/archive, preserving each original payload and ID.
- Reconcile generation timing, unsupported effects and spell-card/wizard serialization round trips.
- Add per-spell heritage/talent modifications and meaningful acceptance witnesses.

**This section is not a complete reconstructed-roster manifest. Content implementation must not begin from an unspecified remainder.**
