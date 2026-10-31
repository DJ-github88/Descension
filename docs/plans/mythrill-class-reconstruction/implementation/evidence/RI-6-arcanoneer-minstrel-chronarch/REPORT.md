# RI-6 — Arcanoneer + Minstrel + Chronarch implementation evidence

**Date:** 2026-10-27  
**Status:** implementation complete and locally verified; retained legacy roster content, explicit progression added. No commit, push or deploy.  
**Content lock:** [CONTENT-LOCK.md](CONTENT-LOCK.md) and [CONTENT-LOCK.json](CONTENT-LOCK.json)

## Scope and decisions

RI-6 was the next unimplemented cohort in the documented roster order after RI-1 through RI-5 and RI-8. These three classes already had full authored spell libraries, three trees, resource systems, guides and HUDs; they lacked an explicit progression policy, manifests and integration evidence. This cohort adds those without rebuilding, truncating, renaming or converting the classes or their saves.

Preserved:

- Arcanoneer 43 spells, Minstrel 51 spells, Chronarch 49 spells; all existing level pools.
- Three 50-point trees per class (57 authored nodes each, 150 ranks).
- Existing resource systems, bars, guides, specializations, native lists and class identity.
- Legacy known spells, stats, resources and IDs; no automatic migration.
- RI-1 through RI-5 and RI-8 completed work.

Authored progression policy for each class:

| Class | Starting picks | Per level | Core grants | Random start | Auto top-up |
|---|---:|---:|---|---|---|
| Arcanoneer | 3 | 1 | none | false | false |
| Minstrel | 3 | 1 | none | false | false |
| Chronarch | 3 | 1 | none | false | false |

Existing characters keep their known spell lists; new characters choose three level-1 options and one optional per level. Level pools are not truncated.

## Exact changed paths and SHA-256

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/arcanoneerData.js` | `be0672abe42748f603d75327fd602b0a1dd61e8b342e938a7f4a653b3c856972` |
| `vtt-react/src/data/classes/minstrelData.js` | `fc767e97a3447daf15d98c1cb6dc2913df2fd5ad014fee146d1b8346987f2d94` |
| `vtt-react/src/data/classes/chronarchData.js` | `a7ec12939a6e2273c9d99b5c3c6d65587fadf70e0c5130a36d69543e403b00d9` |
| `vtt-react/src/data/classes/__tests__/arcanoneerIntegration.test.js` | `258d716d45a5955718e4fbc2a51c578fdab102c8b915e6556a31ee0449e3a371` |
| `vtt-react/src/data/classes/__tests__/minstrelIntegration.test.js` | `c7febb2fa66779a4ceb3ef6640eb8627738a1a7f3525b478278c96c8bc523d9b` |
| `vtt-react/src/data/classes/__tests__/chronarchIntegration.test.js` | `11d1084a056f90a728365e96782c33d8ab3585b2dd95a79478db394a17d24bd1` |
| `vtt-react/src/data/classes/__tests__/ri6RosterStoreIntegration.test.jsx` | `98dacc4649f08f29094280b2a4d0bf7ddaf40a5ecc8ba8a7a83aa0642ce6f1ef` |
| `vtt-react/src/utils/classIconUtils.js` | `9116f97987d3db072ccb514da882bfec87067a8d0f50fce73a520b63630b0e32` |
| `vtt-react/src/components/account/CharacterManagement.jsx` | `7f79a80fa0b536ebd3b412dfaa7621b37df0fbb718ade5a3158f79f411420c99` |
| `vtt-react/src/components/account/AccountDashboard.jsx` | `194917dfdf1b573560938f69649c12aced0c334883b6e65d3aa6359541bc1ffc` |
| `vtt-react/src/contexts/InspectionContext.jsx` | `1bc2823674884f83b79ca24baff9d1a0f00d3d9312a2c510d25bd214d473a471` |
| `vtt-react/src/store/characterSlices/__tests__/chaosWeaverProgression.test.js` | `c905aa51d4fd98cdc63fffe84470d430e8d5fb39d6a316352989abde894b5240` |
| `vtt-react/src/data/classes/__tests__/doomsayerIntegration.test.js` | `f91e987d16e3c4043876dae0ef96a558403abe7f69ebbde7a0f682ab41fadaa3` |
| `vtt-react/src/data/classes/__tests__/oracleIntegration.test.js` | `f536da14b5ea7e669387e5fb476339888d05ed986204f0d42e05bbbd3c32abe7` |
| `vtt-react/src/data/classes/__tests__/druidIntegration.test.js` | `3863b7581724991c27a8a1a8e676e9fdbd0d10f92fd3a27cd78690bfba554d1e` |
| `vtt-react/src/data/classes/__tests__/hunterIntegration.test.js` | `5a140eebf01a9b8ca838a0de3d8911135cc720ef7bd0a6b4f28eff4f23fbc8e3` |
| `vtt-react/src/data/classes/__tests__/deathcallerLichborneIntegration.test.js` | `14699bff559415e90ba7b178a16b23efafad4c675a5e6fe85a4b9d781424e05d` |
| `docs/plans/mythrill-class-reconstruction/26_COMPLETION_AND_CONTINUATION.md` | `c81d3e48acb665b576a7bde71928b6b7ebb8382a4918b953817cdbddd7cb7261` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CARRY-FORWARD-shared-wizard-view.md` | `131e0ab2495577c27cda5426dc141d192db80decaf4c7daf4b29668d148a7832` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-6-arcanoneer-minstrel-chronarch/CONTENT-LOCK.json` | `47eb0d2e6a2fa6ecb9c23190f8a77f8669b36455233ef845e1feffa6d28d53f9` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-6-arcanoneer-minstrel-chronarch/CONTENT-LOCK.md` | `029907a345a73b63d9c8d0b4798cdc3073151a0fe7d345ea0339f9d5fca36fe3` |

`REPORT.md` is excluded from its own table.

## Shared fixes made during this cohort

1. **Missing class icon helper.** `ClassDetailDisplay` and catalogue tests imported `hasClassPixelArt` from `classIconUtils.js`, but the export did not exist, breaking all class-detail renders. Restored a static transparent-asset check.
2. **Roster ancestry.** `CharacterManagement`, `AccountDashboard` and `InspectionContext` now pass `character.ancestry` into `calculateDerivedStats` with race/subrace.
3. **Concurrent provenance reconciliation.** Prior cohort tests now accept the heritage registry's concurrent provenance records while continuing to require `heritageEffectsImplemented === false` and no native access.
4. **Legacy progression control test.** The non-policy control in `chaosWeaverProgression` now uses Berserker instead of Minstrel, because Minstrel now has an explicit policy.

## Verification

### Automated

| Check | Result |
|---|---|
| Focused RI-6 batch | **28 suites / 195 tests passed** |
| Scoped ESLint | **0 errors**, 10 pre-existing warnings |
| Production build | **Compiled successfully** |
| Content lock | Arcanoneer 43 spells / 57 nodes / 150 ranks; Minstrel 51 / 57 / 150; Chronarch 49 / 57 / 150 |

Evidence files: [focused-tests.log](focused-tests.log), [eslint-results.txt](eslint-results.txt), [build.log](build.log), [browser-results.json](browser-results.json). The focused batch includes the three new class integration suites, the shared progression store suite, the character-creation wizard suites, class detail, talent tree, prior cohort integration tests, character store slices and the P6 character-save production suite.

A broader `src/data/classes/__tests__` run also touches concurrent work that is currently inconsistent (`classCatalogueConsistency` expects fields/talent keys not present in its current form). That suite is not used as RI-6 evidence; no attempt was made to rewrite its concurrent expectations.

### Live browser round-trips

| Class | Witness | Id | Result |
|---|---|---|---|
| Arcanoneer | Arc Proof, Nethien Athien, Scholar | `char_1793129543370_wm1przddl` | Created, saved, viewed, reopened in edit, saved again |
| Minstrel | Song Proof, Merryn Human, Scholar | `char_1793129648624_zoknsvz2p` | Created, saved, viewed, reopened in edit, saved again |
| Chronarch | Time Proof, Tessic Human, Scholar | `char_1793129687431_ww44530m0` | Created, saved, viewed, reopened in edit, saved again |

Persisted after the second save:

- Arcanoneer: `arc_aetheric_lantern`, `arc_spark_bolt`, `arc_frost_touch`; base `stats`/`baseStats` `15/5/5/5/5/5`; resource `elementalSpheres`.
- Minstrel: `minstrel_opening_chord`, `minstrel_harmonic_strike`, `minstrel_inspiring_rhythm`; base `stats`/`baseStats` `15/6/6/5/5/5`; resource `musicalNotes`.
- Chronarch: `chrono_slow_fall`, `chrono_bolt`, `temporal_mend`; base `stats`/`baseStats` `15/6/6/5/5/5`; resource `timeShardsStrain`.
- Edit mode showed `Starting Spells — 3 of 3 chosen` and `Ability Scores — All points spent` for all three.

### Desktop and narrow checks

- 1280×800: Arcanoneer/Minstrel/Chronarch class detail and resource guides rendered; Chronarch specializations (Stasis, Displacement, Rewinding) rendered; roster cards showed HP/MP/speed/abilities; no horizontal overflow.
- 390×844: all three character views, class details and roster rendered with no horizontal overflow.
- Guest roster limit: the Adventurer account allows three characters. The disposable guest test roster was backed up to `previous-guest-roster.json` and cleared to make room for the three RI-6 witnesses.

## Remaining shared issue and limits

- **Roster/view max-resource mismatch:** for Minstrel and Chronarch, the character view stat tab reports max HP/MP `48/54`, `25/40` and `50/56`, `25/55`, while the persisted roster resources and roster cards report `48/48`, `25/35` and `50/50`, `25/50`. Arcanoneer agrees. This is logged as a shared ancestry/derived-stat discrepancy; no class-specific workaround was added.
- Guest/local persistence only; account/cloud persistence, multi-device sync and conflict handling were not tested or claimed.
- Manual/class content only; no combat automation, balance validation, migration or deployment claim.
- No commit, push, deploy or Sol acceptance.
