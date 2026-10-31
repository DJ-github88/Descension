# HeadQ corrections — consolidated RI-1–RI-8 findings

**Date:** 2026-10-30  
**Status:** implementation and focused verification complete; no commit, push, deploy, migration or user-character change.  
**Baseline:** `master` / `89cddc2b43ce80c1af00c73cbfc402c66233f4ff`, upstream in sync (`+0 -0`), pre-existing dirty worktree preserved.  
**Evidence:** `HEADQ-baseline-and-hashes.txt`, `HEADQ-focused-tests.log`, `HEADQ-directory-tests.log`, `HEADQ-eslint.log`, `HEADQ-build.log`.

## Scope confirmation

- The registry exposes **30 base classes**; the 20 correction targets are the RI-1–RI-8 cohort: Chaos Weaver, Gambler, Fate Weaver, Deathcaller, Lichborne, Druid, Hunter, Doomsayer, Oracle, Plaguebringer, Arcanoneer, Minstrel, Chronarch, Berserker, Martyr, Warden, Crusader, Inquisitor, Spellguard and Toxicologist. No 21st target class was added.
- The decision register leaves roster size open and retains existing identities; this pass did not add, remove, convert or migrate a class.
- No class-data file was edited in this pass. RI-6/7/8 class source hashes still match their content locks; the recorded starting-pick quantities are unchanged.

## Protected concurrent work

The two files named by the latest audit were hashed before any edit and after verification; both are byte-identical to the entry baseline:

- `vtt-react/src/persistence/scopedStoreStorage.js` — `a9bd2e2941f78a3a65ecf0ad6184928ebbc61b0b6e9207df240c6d2f70acb9db`
- `vtt-react/src/persistence/__tests__/waveB_b1b5Corrections.test.js` — `5bfe461e20994562c8c5553f834d218e23b9baec3d410c27fa2ab7a7f885e7e4`

The separate persistence/combat playable-candidate delta was not edited.

## Corrections implemented

### 1. Level-down talent pruning (10 retained classes)

`progressionSlice.pruneTalentsForChange` now routes Arcanoneer, Minstrel, Chronarch, Berserker, Martyr, Warden, Crusader, Inquisitor, Spellguard and Toxicologist through their own authored nodes with the shared CR1 prerequisite/level/budget pruner. Chaos Weaver-specific allocation order is never used. Retained nodes that embed a projected `spell` now report the same `talent-spell-*` grant identity used by the single-node refund, so dependent grants are pruned too. A calling change with no authored tree clears ranks instead of inheriting the old class's allocation.

Regression: `classLevelDownPruning.test.js` — legal level-10 50-point builds for all ten classes, level-1 budget/prerequisite checks, no `cw1_*` IDs, dependent-grant removal, and the production `updateCharacterInfo('level')` path.

### 2. Edit after legal spell advancement (all 20 classes)

Starting selections are separated from earned `levelUpHistory.spellId` picks through `utils/classSpellProgression.js`; the wizard validation, Step1 picker and Step9 summary use that separation. Reopening preserves both lists and does not charge earned earlier-pool spells against the starting quota. A class change strips old-calling spell picks from `levelUpHistory` while retaining health, mana and attribute gains.

Regression: `CharacterWizardContext.test.js` — one-pick Gambler and three-pick Inquisitor families, all 20 cohort classes, and edit-load retention of `levelUpHistory`.

### 3. Earned HP/MP

`utils/characterResourceSnapshot.js` includes `levelUpHistory.healthIncrease` and `manaIncrease` in the canonical maximum used by roster cards, store recalculation, creation persistence, the character panel and the character view. Advancement, canonical save/reopen, recalculation and level-down are covered while preserving valid current resources.

Regression: `characterResourceAgreement.test.js` and `characterLoadResourceDefaults.test.js`.

### 4. Explicit zero on load

`coreSlice.savedCurrentResource` and the canonical snapshot distinguish an absent current value from a saved `0`. A saved zero HP or MP remains zero; only absent/`null`/empty values use the effective maximum.

Regression: `characterLoadResourceDefaults.test.js` (zero HP, zero MP, missing fallback) and `characterResourceAgreement.test.js` (explicit null fallback while zero is preserved).

### 5. Single-node talent refund

`removeTalentGrantSpells` is ownership-aware for both active and non-active roster characters: the refunding character loses the grant, while a spellbook/library copy survives when another roster character still owns or needs it. Reset All behavior is unchanged.

Regression: `TalentTreeContent.test.jsx` two-owner refund, plus `characterClassSwitch.test.js` inactive-target cleanup.

### 6. Class selectors and class changes

`CharacterPanel.jsx` and `Lore.jsx` now use `getSelectableClassNames()` from `classDisplayData` (30 registered base classes) instead of stale hardcoded lists. The wizard edit class-switch patch prunes old ranks, clears old specialization/selected ability, replaces the class resource, resets class-owned spell state and earned spell picks, and reports old grant IDs. `CharacterCreationPage` now invokes the ownership-aware cleanup after a successful save, including when the edited character is not the active sheet character.

Regression: `characterClassSelectors.test.js` (both components plus all 30 names), `characterClassSwitch.test.js` (all 30 targets, edit-switch, history reset and cleanup wiring), `classCatalogueConsistency.test.js`.

### 7. Druid/Hunter talent reconciliation

`infoSlice` reconciles Druid and Hunter in their own class branches, outside the Oracle-only branch. Set and reset paths are covered for both, and Oracle no longer reconciles either.

Regression: `druidHunterReconciliation.test.js`.

### 8. Level-1 spell icons

`levelOneSpellIcons.js` maps repeated/missing level-1 spell icons to existing shipped ability assets. Spell IDs and mechanics are untouched. All 20 cohort level-1 pools now have distinct, existing icons; no asset was invented.

Regression: `levelOneSpellIcons.test.js`.

## Regression intent (fail before the fix)

The new or strengthened regressions target the pre-fix behavior directly: retained-class builds previously stayed above the level-1 budget or lost no dependent grants; earned earlier-pool spells were previously counted against the starting quota; saved zero HP/MP previously fell through `||` defaults; bulk refunds previously ignored projected `talent-spell-*` copies; the two selectors previously carried stale hardcoded lists; and a wizard class change previously left old grant copies and earned spell IDs behind. No assertion was weakened to obtain a pass.

## Verification personally run

| Check | Result |
|---|---|
| Focused HeadQ batch (27 suites) | **336/336 tests passed** — `HEADQ-focused-tests.log` |
| Directory batch: `src/data/classes/__tests__`, `src/store/characterSlices/__tests__`, wizard | **54 suites / 493 tests passed** — `HEADQ-directory-tests.log` |
| Scoped ESLint on changed files | **exit 0** |
| Full `npm run lint` scope | **exit 0** — `HEADQ-eslint.log` |
| Production build (`npx craco build`, detached) | **Compiled successfully, exit 0** — `HEADQ-build.log` |

Logs from the earlier RI-6/7/8 cohorts and storage handoffs were inspected, not re-executed. No browser/Playwright witness was rerun in this pass.

## Remaining blockers and evidence gaps

1. **Legacy migration dispositions:** `classReconstructionCompatibility.js` still has empty `recordDispositions` for Revenant, Shaper, Formbender and Apex. No approved per-record mapping exists, so no disposition was invented. This is a HeadQ evidence gap.
2. **Stale "21 classes" copy:** `src/services/subscriptionService.js:124` still advertises "21 classes". The registry proves 30 base entries, but 21 may intentionally mean established blueprint classes rather than all 30 (9 are development/manual). The string was not changed without a HeadQ copy decision.
3. **Content-lock shared-source drift:** class data/content hashes match, but auxiliary `sourceHashes` for shared files have drifted since the RI-6/7 locks: RI-6 6/18 and RI-7 5/21 (RI-8 0/24). Frozen locks were not rewritten; this is recorded in `HEADQ-baseline-and-hashes.txt`.
4. **No whole-tree seal:** this pass covers the named findings and focused tests only. It does not claim full-repository parity, cloud durability, combat automation, playtest or release readiness, and does not reopen prior bounded acceptances.
