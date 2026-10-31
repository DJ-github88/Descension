# RI-7 — Berserker + Martyr + Warden + Crusader implementation evidence

**Date:** 2026-10-27  
**Status:** implementation complete and locally verified; retained legacy roster content, explicit progression added. Shared max-HP/MP mismatch closed. No commit, push or deploy.  
**Content lock:** [CONTENT-LOCK.md](CONTENT-LOCK.md) and [CONTENT-LOCK.json](CONTENT-LOCK.json)

## Shared max-HP/max-MP mismatch — fixed

`utils/characterResourceSnapshot.js` is now the single source of truth for effective attributes and maximum health/mana. It normalizes base/current stats, applies heritage + origin + ancestry through the shared derived-stat calculation, and returns the canonical health/mana maxima.

Consumers updated:

- `store/characterSlices/resourceSlice.js` recalculates resources from the snapshot.
- `components/account/CharacterManagement.jsx` roster cards use the snapshot.
- `components/account/AccountDashboard.jsx` uses the snapshot.
- `contexts/InspectionContext.jsx` uses the snapshot.
- `components/character-sheet/CharacterPanel.jsx` displays the snapshot maxima instead of its own separate breakdown; missing concurrent locals (`current`, `healingBreakdown`, `manaRegenBreakdown`) were restored.

Regression coverage: `src/utils/__tests__/characterResourceAgreement.test.js` covers:

- Minstrel Merryn (the failing +6 HP/+5 MP case).
- Chronarch Tessic (the second failing case).
- Arcanoneer Nethien as a control where values already agreed.

For each fixture it compares the persisted resource values, roster snapshot maxima and the store/view source after `recalculateResources`. All three agree.

## RI-7 scope and content lock

Retained legacy classes had full spell libraries, trees, resource systems, guides and HUDs but no explicit progression/manifest layer. This cohort adds that layer and evidence without rebuilding, truncating, renaming or converting any class or save.

| Class | Authored spells | Pools (L1…L10) | Trees | Nodes | Ranks | Resource |
|---|---:|---|---:|---:|---:|---|
| Berserker | 47 | 9/4/4/4/4/4/4/4/4/4 | 3 | 54 | 150 | Rage / Blood-Heat |
| Martyr | 48 | 7/8/4/4/4/4/4/4/4/4 | 4 | 73 | 200 | Devotion |
| Warden | 46 | 5/8/4/4/4/4/4/4/4/4 | 4 | 77 | 200 | Tension / Vengeance |
| Crusader | 41 | 5/4/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | Fervor |

Every policy uses three starting picks, one optional per level, no core grants, no random starting spells and no automatic top-up. Martyr Ironclad and the Warden fourth tree are preserved.

## Exact changed paths and SHA-256

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/berserkerData.js` | `4d78b3a422f1a750db03fa5cad9d8f98797e18bdc0639165d1af8fa61f324a16` |
| `vtt-react/src/data/classes/martyrData.js` | `f155d790bea08c7deda5436ecffa6e500f62edae76efb4e95658a59dbc43f403` |
| `vtt-react/src/data/classes/wardenData.js` | `0ae9c927ae1940017caed17a9ca8ee9d91179f1c96fd6745da273e070c6bcc0b` |
| `vtt-react/src/data/classes/crusaderData.js` | `838be38fa592fb1e02a98e9d01100b41ddf49c51f139f13fb9d42111b210342c` |
| `vtt-react/src/data/classes/__tests__/berserkerIntegration.test.js` | `c06bdad7107f95be6f7d1bc71833843e0ae4e95cde910a0db6d2df5287ddc40b` |
| `vtt-react/src/data/classes/__tests__/martyrIntegration.test.js` | `5967466fe3125b92d21517ba48c8beb66fa3e014203160e0ba339539a419bcb7` |
| `vtt-react/src/data/classes/__tests__/wardenIntegration.test.js` | `b14f7bbdf6638d448add17078635f7e85ab7cdbd3dedc70b9e6e0c83119dc250` |
| `vtt-react/src/data/classes/__tests__/crusaderIntegration.test.js` | `604290b9e604b28ac42dc499707ed8fa5400b78a4916aa8dcb3f5499a8966b55` |
| `vtt-react/src/data/classes/__tests__/ri7RosterStoreIntegration.test.jsx` | `c0a469aaa04adfa19480937bdf05cbacdf09ecd95d1813e7f05e53a49ef97155` |
| `vtt-react/src/utils/characterResourceSnapshot.js` | `52efd525bf68b40fae11782cc384572522672c180ffbcf1e28f36f3708d65f56` |
| `vtt-react/src/utils/__tests__/characterResourceAgreement.test.js` | `2685d51ee1b2b169bc2bbf1b3e5af14bf7bc6feaaec222a923b347f3c4f98362` |
| `vtt-react/src/components/character-sheet/CharacterPanel.jsx` | `b0244dbc4117b18e5c82876ea171743293ae5c7caad4ff01423416206001d32f` |
| `vtt-react/src/components/account/CharacterManagement.jsx` | `27e81944cef21cd9eece9aa14458064c00c3b94735805a5d86177f9e36b4b792` |
| `vtt-react/src/components/account/AccountDashboard.jsx` | `08464644568a22fc7ce9351dae8fd1436a99b9f0006f9dffc04c988b4d016891` |
| `vtt-react/src/contexts/InspectionContext.jsx` | `7fdaf5003c5fba655ce932a28167e8ba85abea15531b8684c1dcdf67ca4f799b` |
| `vtt-react/src/store/characterSlices/resourceSlice.js` | `a9cf24532f270bc90660a4e62c45660005d5b03cd6e4dd4ef6db06db27417489` |
| `vtt-react/src/components/character-creation-wizard/steps/__tests__/Step9P11SkillChecklist.test.jsx` | `2b265cffb4aeed7f17f6c695c82f82913aa469f24ebc586f8b9adbda22d88528` |
| `vtt-react/src/store/characterSlices/__tests__/chaosWeaverProgression.test.js` | `54878b706bff07970be03d33d1bdc4c121dd84c0bb0087bac1fca430fdcd46da` |
| `docs/plans/mythrill-class-reconstruction/26_COMPLETION_AND_CONTINUATION.md` | `8322403b06f0fdb88324415f2b2bdffe4380ad33bcff8bd68d6ff64adeb31a31` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CARRY-FORWARD-shared-wizard-view.md` | `0cf754b610cee5d5605a0dd937ba5cbb911396970350f03d687221547fc14b8a` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-7-berserker-martyr-warden-crusader/CONTENT-LOCK.json` | `0bb61175ce46cd3ac6dff62d0b47a8e7ebde15bc438729f390d789320e864c48` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-7-berserker-martyr-warden-crusader/CONTENT-LOCK.md` | `18b8070cec5fe48ccbb16f2fc5cccb7335848ce673addcc63f60daaf32ca9ac3` |

`REPORT.md` is excluded from its own table.

## Verification

### Automated

| Check | Result |
|---|---|
| Focused RI-7 batch | **34 suites / 230 tests passed** |
| Scoped ESLint | **0 errors**, 23 pre-existing warnings |
| Production build | **Compiled successfully** |
| Shared-resource regression | 3/3 ancestry fixtures agree across persisted, roster and store/view source |

Evidence files: [focused-tests.log](focused-tests.log), [eslint-results.txt](eslint-results.txt), [build.log](build.log), [browser-results.json](browser-results.json).

The focused batch includes the four new class integration suites, the RI-7 progression/store suite, the shared resource regression, RI-6 integration/store suites, prior cohort tests, character-creation wizard, class detail, talent tree, character store slices and the P6 character-save production suite.

### Live browser round-trips

| Class | Witness | Id | Result |
|---|---|---|---|
| Berserker | Rage Proof, Skald Human, Scholar | `char_1793132685328_zju7hrv5f` | Created, saved, viewed, reopened in edit, saved again |
| Martyr | Faith Proof, Skald Human, Scholar | `char_1793134193930_gx08a2kjg` | Created, saved, viewed, reopened in edit, saved again |
| Warden | Chain Proof, Skald Human, Scholar | `char_1793134347515_0vb4gcn01` | Created, saved, viewed, reopened in edit, saved again |
| Crusader | Sun Proof, Anhur Solari, Scholar | `char_1793134566689_kow8ztapo` | Created, saved, viewed, reopened in edit, saved again |

All four showed `Starting Spells — 3 of 3 chosen` and `Ability Scores — All points spent` on reopen. Persisted class spells, base `stats`/`baseStats`, ancestry, origin and class resources survived the second save. Roster and view agreed:

- Berserker: HP 50/58, MP 25/34, speed 30 ft, 3 spells / 2 skills.
- Martyr: HP 50/58, MP 25/34, speed 30 ft, 3 spells / 2 skills.
- Warden: HP 50/58, MP 25/34, speed 30 ft, 3 spells / 2 skills.
- Crusader: HP 50/56, MP 25/46, speed 25 ft, 3 spells / 2 skills.

The existing guest character **Kira Goldmane** was preserved. Each RI-7 witness was deleted after verification to stay within the three-character account limit.

### Desktop and narrow checks

- 1280×800: all four class detail pages rendered with resource tabs; no horizontal overflow.
- 390×844: all four class detail pages rendered; no horizontal overflow.

## Known limits

- Guest/local persistence only; account/cloud persistence, sync conflict handling and multi-device behavior were not tested or claimed.
- Manual/class content only; no combat automation, balance validation, migration, deployment or Sol acceptance claim.
- No class-specific workaround was added for the shared resource calculation.
- No commit, push or deploy.
