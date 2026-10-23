# RI-3 Deathcaller + Lichborne — implementation evidence

**Date:** 2026-10-23  
**HEAD:** `a5d99e88`  
**Status:** implementation and focused verification complete; no commit, push or deploy.

## Scope

Implemented the authorized Deathcaller/Lichborne cohort through the existing class system:

- full 96-record package per class;
- class registry, catalogue/detail pages, character creation availability, level-up policy, talents, spell library, resource contracts and HUD previews;
- three specializations and 54 talent nodes per class, with 50-point trees and authored signature/capstone gates;
- manual-only Dead Muster and Lich Anchor resources;
- heritage recommendations only, with no eligibility/effect-edge changes.

Dossiers and manifests remain `PROPOSED` (`HeadQ-review-R1; not admitted by current app`). This report does not claim automated combat execution, balance validation or production admission.

## Content locks

| Class | Core | Optional | Signatures | Capstones | Passive records | Talent actives | Nodes | Ranks |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Deathcaller | 2 | 40 | 3 | 3 | 48 | 6 | 54 | 150 |
| Lichborne | 2 | 40 | 3 | 3 | 48 | 6 | 54 | 150 |

- Four optional records at every level 1–10; one legal pick per level.
- Five talent points per level, 50 total; signature at 10 same-tree points and level 3; capstone at 45 same-tree points and level 10.
- Six preserved R1 payloads per class deep-equal the reviewed manifests.
- Fresh resources remain uninitialized and never invent a manifestation or anchor.
- Lichborne prepares exactly two traits and cannot activate more traits than its stage.
- Runtime summon/anchor lifecycle, automatic resource application and combat execution remain manual.

## Implementation notes

- Added the two classes to `data/classes/index.js`, `classSpellGenerator.js`, `talentTreeData.js`, `classDisplayData.js`, `classSpellCategories.js`, `classResources.js`, `classResourceContracts.js`, `classResourceAliases.js`, `resourceSystems/index.js`, `useClassSpellLibrary.js`, `Step1CoreDraft.jsx` and character progression/resource store slices.
- Added `DeathcallerResourceDisplay.jsx` and `LichborneResourceDisplay.jsx`, plus `ClassResourceBar` routing for `dead_muster` and `lich_anchor`.
- Added the missing `CLASS_DATA_LOADERS` entries in `RulesPage.jsx`. Browser verification showed the detail pages initially fell back to “Tradition data … not yet available”; the loaders now resolve `deathcallerData` and `lichborneData`.
- Restored Deathcaller/Lichborne detail icons and corrected stale “merged into Revenant” comments in `RulesPage.jsx`, `ClassDetailDisplay.jsx` and `classSpellCategories.js`.
- Heritage registry counts were updated for two new base classes: 26 base, 29 all, 26 display. Provenance remains 24 and `specRows` 25; no effect edges were added.

## Verification

### Automated

| Check | Result | Evidence |
|---|---|---|
| Full `src/data` suite | 69 suites, 1,442 tests passed | `data-tests.log` |
| HUD suite | 14 suites, 82 tests passed | `hud-tests.log` |
| Rules/detail/talent component suites | 3 suites, 29 tests passed | `component-tests.log` |
| Scoped ESLint | 0 errors; 54 pre-existing warnings only | `eslint-results.json` |
| Production build | exit `0`, “Compiled successfully.” | `build.exit`, `build.log` |

The new CR-1 files added no ESLint warnings. Existing warnings remain in `ClassResourceBar.jsx`, `RulesPage.jsx` and a pre-existing test variable.

### Browser

Playwright checks against the running app at `http://localhost:3000`:

- Classes catalogue reports **“Showing 26 of 26 classes”**.
- Deathcaller detail resolves with role `Summoner / Commander`, three Muster specializations, resource preview, spell cards and a 50-capacity/11-tier tree containing the authored signature and capstone.
- Lichborne detail resolves with role `Anchor Mage / Controller`, three Vessel specializations, resource preview and a 50-capacity/11-tier tree containing the authored signature and capstone.
- Both resource tabs explicitly show the uninitialized/manual state.
- At 390×844 both detail and resource views had no horizontal overflow (`scrollWidth === innerWidth`).
- Console reported 0 errors and 1 unrelated scoped-save warning (`NO_ACTIVE_SCOPE`).

Snapshots and console output are stored beside this report.

## Not yet evidenced

- Character creation save/export/import, rest, respec and level-up were not exercised through the authenticated wizard route.
- No automated three-turn class sequence, damage/balance or server contract was run; resource behavior remains manual tabletop.
- Keyboard-focus and touch-target sweeps were not separately recorded beyond the narrow no-overflow checks.
- No commit, push or deploy was performed.
