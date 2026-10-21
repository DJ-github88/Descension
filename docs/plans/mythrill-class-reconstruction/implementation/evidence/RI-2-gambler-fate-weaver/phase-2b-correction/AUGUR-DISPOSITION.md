# Augur disposition summary

**Class:** Augur (`augur`)  
**Status:** Data-only merger assessment for Phase 2B (bounded correction)  
**Manifest:** `augur-disposition.json`  
**Rows:** 382  
**Decision:** every legacy Augur row is `keep`; no `adapt` destination is invented.

This file supersedes the review-era `phase-2b/AUGUR-DISPOSITION.md`, which described 380 rows and three resources. The original remains the historical review artifact.

## Coverage

| Source owner | Source type | Rows |
|---|---|---:|
| `AUGUR_DATA.spells` / `exampleSpells` | `spell` | 45 |
| `AUGUR_DATA.spellPools` | `spell-pool-entry` | 44 |
| `AUGUR_AUSPICE`, `AUGUR_HARBINGER`, `AUGUR_HIEROPHANT` | `talent-node` | 57 |
| Tree `maxRanks` | `talent-rank` | 150 |
| Tree node grant identity | `materialized-talent` | 57 |
| `AUGUR_DATA.subraceVariants` | `subrace-variant` | 11 |
| Nereid compatibility alias | `class-alias` | 1 |
| `HERITAGE_TRADITIONS` Augur edges | `heritage-edge` | 9 |
| Legacy resource surface | `resource` | 5 |
| `AUGUR_DATA.specializations.specs` | `specialization` | 3 |
| **Total** | | **382** |

## Decision rule

- `keep`: exact legacy Augur identity, saved-state meaning and resource behavior are preserved. `destinationClassId` is `augur` and `destinationId` is `null`.
- `adapt` is not used. No exact `cr1_fate_weaver_*` crosswalk is authored for an Augur record, and the assignment forbids guessed destinations.
- `automaticConversion` is `false` on every row.
- No legacy `augur_*`, `talent-spell-*`, tree, variant, heritage or resource ID is renamed, deleted or collapsed into a Fate Weaver ID.

## Protected content

- All 45 active spells and all 44 pool entries remain available under Augur.
- All 57 nodes, 150 rank rows and 57 materialized grants remain unchanged.
- All 11 subrace variants remain, including `deepling_myrathil`; `Nereid Myrathil Augur` keeps its alias.
- All 9 heritage edges remain: `skald_human`, `vashir_astril`, `silath_astril`, `kessen_neth`, `marked_vreken`, `korr_solari`, `deepling_myrathil`, `shoreling_myrathil`, `riverling_myrathil`.
- All five legacy resources remain: `omens`, `benediction`, `malediction`, `omenDebt` and `benediction-malediction`. Fate Weaver imports none of them and has no Omen Debt bank.
- All three specializations remain: `auspex`, `harbinger`, `hierophant`. Fate Weaver's `covenant`, `severance` and `tapestry` trees are separate.

## Boundary

Auspex, sign/material-focus reading, Ill Omen and Hierophant content are preserved rather than discarded for a Fate Weaver tree quota. Fate Weaver receives no fourth tree, no Augur native edge and no automatic migration. The legacy Augur resource surface remains the sole owner of the Benediction/Malediction dual bank and the Omen Debt runtime reference.
