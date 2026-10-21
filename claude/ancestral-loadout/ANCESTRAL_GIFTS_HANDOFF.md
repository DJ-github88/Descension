# Ancestral Gifts — implementation handoff (2026-10-20, 22:40)

Patch: `claude/ancestral-loadout/ancestral_gifts_wip.patch` (git diff against the live `D:\VTT` files as of 20 Oct, ~22:30; HEAD `f9527d31`). Apply with `git apply --check` first. Several files use CRLF line endings, so keep each file's endings.

**Do NOT apply without step 1 below.** The wizard requires gifts for Groven heritages; without the picker UI no new Morgh or Amordjin character can be created.

**Concurrent work warning.** On the PC, other uncommitted edits exist in all race files, Step1CoreDraft.jsx (Gambler class), CharacterPanel.jsx and progressionSlice.js. The patch does not touch race files, by design.

## Done (in patch)
- `data/ancestryLoadouts.js` (new): Groven loadouts (`ithran_groven`, `morgh_groven`), 6 new gift records, helpers `getResolvedAncestryLoadout`, `validateAncestry`, `buildAncestry`, `applyAncestryToTraits`, `emptyAncestryPicks`.
- `data/__tests__/ancestryLoadouts.test.js`: 8 tests.
- Granting: `getRacialSpells(race, subrace, class, ancestry)` / `getRacialStatModifiers(race, subrace, ancestry)` grant only core + picks; no matching ancestry = legacy (all traits).
- Callers threaded: coreSlice, infoSlice, statsSlice, CharacterPanel, CharacterStats, useCharacterSpells, SpellLibrary.
- Persistence: store initial state, characterHelpers save, coreSlice load, multiplayer sync, InspectionContext, validated in characterSaveOutcome.js. Not in runtime drafts.
- Wizard state: `characterData.ancestry`, `sealedAncestry`, `SET_ANCESTRY_PICK` / `setAncestryPick(rowId, giftId)`; heritage change clears picks; `errors.ancestry` blocks new characters; `handleComplete` stamps `finalizedAt`.

## Remaining, in order
1. Step 1 UI (`steps/Step1CoreDraft.jsx` + CSS): "Ancestral Gifts" launcher between Ability Scores and Starting Spells; drawer (core card + 3 rows of 2, detail pane with origin/requires/limits/counters, "Confirm Gifts (Need 3)"); read-only when sealed; Codex heritage section shows gifts.
2. `Step9CharacterSummary.jsx`: checklist row `Ancestral Gifts (one per row)`.
3. `calculateDerivedStats` (utils/characterUtils.js): trailing `ancestry = null` param, passed from CharacterPanel, CharacterStats, statsSlice, progressionSlice, resourceSlice.
4. Tests: wizard reducer tests + regressions (CharacterWizardContext.test, Step1CoreDraft*, Step7*, Step9P11*, firstTableLaws, FirstTableLawsRendered).
5. Browser check of Step 1.
6. Not started: server-side lock on `ancestry` once `finalizedAt` is set; Laws → Races lab; other 23 heritages; legacy migration.

## Open creator decisions
- All draft numbers.
- Ember damage as the regeneration counter.
- Legacy characters (decision #3).
- Sealed loadout when heritage changes during an edit (currently: new heritage is unsealed).
