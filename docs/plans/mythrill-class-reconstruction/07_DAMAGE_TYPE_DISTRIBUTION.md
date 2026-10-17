# Damage-type distribution

> **AUTHORED** census of the working tree on 2026-10-17T17:58:33.651Z. Source hashes: [current-census.json](evidence/current-census.json). Counts do not establish execution.

## Method

Count each damageConfig.damageTypes member once per spell/type, canonicalized through data/damageTypes.js. Do not count typeConfig.school or thematic class damageTypes as damage execution. Multi-element spells contribute to multiple columns. Raw labels and noncanonical records remain in JSON; absent structured damage is not inferred from descriptions. Alternate nested/conditional payloads need separate review.

| Class | arcane | sacred | blight | ember | rime | primal | storm | wyrd | slicing | stabbing | smashing | Multi-magical | No damage effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arcanoneer | 3 | 0 | 5 | 12 | 10 | 2 | 10 | 4 | 0 | 0 | 0 | 11 | 15 |
| Berserker | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 12 | 9 | 16 | 0 | 28 |
| Shaper | 0 | 0 | 1 | 0 | 0 | 1 | 2 | 0 | 16 | 14 | 16 | 0 | 38 |
| Harbinger | 0 | 0 | 20 | 8 | 0 | 0 | 13 | 6 | 0 | 0 | 0 | 11 | 13 |
| Chronarch | 1 | 0 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | 0 | 0 | 0 | 40 |
| Inquisitor | 0 | 3 | 2 | 7 | 0 | 0 | 1 | 0 | 1 | 1 | 2 | 0 | 31 |
| Revenant | 0 | 0 | 18 | 0 | 12 | 0 | 0 | 1 | 2 | 0 | 0 | 7 | 20 |
| False Prophet | 0 | 0 | 4 | 0 | 0 | 0 | 0 | 13 | 0 | 0 | 0 | 0 | 37 |
| Gambit | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 7 | 0 | 0 | 0 | 1 | 43 |
| Apex | 0 | 0 | 4 | 0 | 1 | 1 | 1 | 1 | 16 | 11 | 10 | 0 | 30 |
| Animist | 0 | 0 | 6 | 3 | 0 | 8 | 4 | 0 | 0 | 0 | 4 | 2 | 30 |
| Lunarch | 3 | 18 | 0 | 1 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | 2 | 20 |
| Martyr | 0 | 0 | 0 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 35 |
| Minstrel | 0 | 0 | 1 | 7 | 0 | 0 | 11 | 4 | 1 | 1 | 1 | 1 | 28 |
| Plaguebringer | 0 | 0 | 20 | 0 | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 2 | 25 |
| Pyrofiend | 0 | 0 | 0 | 28 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 24 |
| Spellguard | 4 | 0 | 4 | 0 | 0 | 0 | 12 | 0 | 2 | 2 | 4 | 2 | 29 |
| Toxicologist | 0 | 0 | 17 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 30 |
| Warden | 0 | 0 | 5 | 0 | 0 | 0 | 0 | 0 | 12 | 13 | 13 | 0 | 25 |
| Augur | 0 | 0 | 0 | 6 | 0 | 0 | 0 | 14 | 0 | 0 | 0 | 3 | 28 |
| Crusader | 0 | 17 | 0 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 7 | 2 | 23 |
| TOTAL | 11 | 38 | 115 | 88 | 23 | 12 | 73 | 59 | 63 | 51 | 73 | — | — |

## Canonical semantics

Eight magical IDs: arcane, sacred, blight, ember, rime, primal, storm, wyrd. Physical: slicing, stabbing, smashing. Healing is a separate restorative category. Source: data/damageTypes.js:9–81,118–126 and classResourceBanks.js:4. These type labels do not prove a universal source of power. CORE_LORE_FRAMEWORK.md:31–33 explicitly rejects Wyrd as the origin of all native magic.

## Interpretation boundaries

Arcanoneer remains a generalist regardless of its column totals. Element underrepresentation must be interpreted against available player picks, effectiveness and runtime support, not just catalogue tags. Lichborne Rime, Titan Sacred/Arcane, Inscriptor Arcane, Primalist Primal and Exorcist Sacred are plausible thematic directions, pending individual designs, never balancing assignments made to equalize this table.

## Raw-label anomalies

| Class | Spell ID | Raw | Canonical |
| --- | --- | --- | --- |

Tree-specific damage bias is not complete until spell specialization/category ownership is reconciled with actual talent grants.
