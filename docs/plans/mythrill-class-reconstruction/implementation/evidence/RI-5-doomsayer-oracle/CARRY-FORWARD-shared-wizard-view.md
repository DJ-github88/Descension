# Carry-forward — shared Mythrill wizard/view defects

**Owner:** shared Mythrill wizard/view and persistence owner, not a class package.
**Source:** RI-8 Plaguebringer character round-trip, 2026-10-25.
**Status:** implemented and verified 2026-10-27 by the shared wizard/view owner. Original reproduction is retained below; do not reopen the four defects without new evidence.

## Resolution (2026-10-27)

All four defects are fixed in the shared paths. No class-local workaround, duplicate save path or automatic class/identity migration was added.

1. **Edit load restores picks.** `CharacterWizardContext.js` `LOAD_CHARACTER` now restores `class_spells` and `selectedAbility`. Reopening the saved witness shows `Starting Spells 1 of 1 chosen` and the known class spells survive edit/save.
2. **Base stats and derived final stats are separated.** The wizard now persists the canonical base point-buy allocation in `stats`, plus `baseStats`; `finalStats` is derived from base + heritage + origin (racial and background modifiers). Legacy wizard payloads without `baseStats` are interpreted once in memory by subtracting the heritage modifiers before display and are not rewritten on load. Non-wizard/placeholder payloads without wizard markers are treated as base stats.
3. **Guest identity and roster family agree.** `isGuestUser()` now derives from the same P5 scope mapping as the bootstrap gate, so an anonymous Firebase principal reads and writes the guest roster family even if a later auth callback drops the `isGuest` wrapper. `loadRoster(true)` recovers a guest character previously mis-filed under the same-scope user family as a read-only source; the next save writes the canonical guest family.
4. **Deep links and roster surfaces agree.** `loadCharacters` waits briefly for the private scope, and placeholder creation is suppressed until a verified scope exists. `/account/characters/view/:id` and `/account/characters/edit/:id` retry roster hydration on bootstrap-gate changes instead of reporting a false `Character not found`. Roster surfaces (`CharacterManagement`, `AccountDashboard`, `InspectionContext`, `recalculateResources`) pass race/subrace into `calculateDerivedStats` and count known class spells/trained skills, so HP/MP max, speed and ability counts agree with the character view.

### Four-fix evidence (2026-10-27)

- Focused automated verification: **18 suites / 85 tests passed**.
- Scoped ESLint: **0 errors** (pre-existing unrelated warnings only).
- Production build: **exit 0**, compiled successfully.
- Live browser round-trip on saved guest `char_1792754680486_r3rj9hueb`: view opens; edit opens with `Starting Spells 1 of 1 chosen` and `Ability Scores — All points spent`; update succeeds; saved payload has base `stats`/`baseStats`; roster and view both report HP 50/72, MP 25/79, speed 25 ft, 3 spells / 3 skills.

## Additional shared reliability fix (2026-10-27, RI-4 verification)

The first Druid create/save flow exposed a shared persistence race: `createCharacter` started the scoped roster write without awaiting it, while the creation page immediately reloaded the roster. The reload could read the previous roster and overwrite the just-created character. `createCharacter` now awaits the scoped roster write before returning, so create → save → reopen is stable. Verified with both the Druid and Hunter create flows. This is a shared persistence fix, not a class package.

### RI-4 batch evidence (2026-10-27)

- Focused automated verification: **39 suites / 334 tests passed** for the RI-4 batch.
- Scoped ESLint: **0 errors** (pre-existing unrelated warnings only).
- Production build: **Compiled successfully**, static output generated.
- Live browser round-trips: Druid `char_1793091281455_gpzllxro3` and Hunter `char_1793091383367_w4g3vnycd` both created, saved, viewed, reopened in the editor and updated again; base/final stats and class-spell lists survived; roster and view agreed.
- Desktop 1280×800 and narrow 390×844 class-detail/view checks showed no horizontal overflow.

### RI-6 shared notes (2026-10-27)

- Restored `hasClassPixelArt` in `vtt-react/src/utils/classIconUtils.js`; concurrent class-detail/catalogue work imported it but the helper was missing, breaking detail rendering and tests.
- Roster and inspection derived-resource calculations now pass `ancestry` to `calculateDerivedStats` alongside race/subrace.
- **Max HP/MP mismatch closed (RI-7 follow-up):** `utils/characterResourceSnapshot.js` is now the shared source of truth for effective attributes and maximum resources. Store recalc, roster cards, inspection and the character panel consume it; the panel display uses the snapshot maxima instead of its own breakdown. Regression coverage: `src/utils/__tests__/characterResourceAgreement.test.js` covers Minstrel Merryn, Chronarch Tessic and an already-agreeing Arcanoneer Nethien control, comparing persisted, roster snapshot and store/view source.
- Concurrent CharacterPanel edits had lost `current`, `healingBreakdown` and `manaRegenBreakdown` locals; restored them while preserving the concurrent layout changes.
- Prior cohort tests (Doomsayer/Oracle/Druid/Hunter/Deathcaller/Lichborne) now accept the concurrent registry provenance records while still asserting `heritageEffectsImplemented === false` and no native access.
- RI-6 focused evidence: **28 suites / 195 tests passed**, scoped ESLint 0 errors, production build compiled successfully. Evidence at `implementation/evidence/RI-6-arcanoneer-minstrel-chronarch/`.
- RI-7 focused evidence: **34 suites / 230 tests passed**, scoped ESLint 0 errors, production build compiled successfully. Evidence at `implementation/evidence/RI-7-berserker-martyr-warden-crusader/`.

### Limits

- Guest/local persistence only. Account/cloud persistence, sync conflict handling and multi-device behavior were **not** tested or claimed.
- Legacy payload interpretation happens in memory for editing; existing stored legacy records are not automatically migrated. A legacy record is rewritten only when the user explicitly saves it.
- No independent Sol review/acceptance is claimed.
- No combat automation is implied by these fixes.

## Original reproduction (2026-10-25, retained for provenance)

These defects blocked clean edit/reopen and character-view verification for any class. RI-5 did not modify these shared paths and did not claim account/cloud persistence.

### 1. Edit load drops `class_spells`

`CharacterWizardContext.js` `LOAD_CHARACTER` did not restore `class_spells`, while `Step1CoreDraft.jsx` reads `characterData.class_spells.known_spells`. Reopening a saved character therefore showed `Starting Spells 0 of 1 chosen` even when the saved payload had known spells.

### 2. Saved final stats were reused as base stats

The edit-load path loaded persisted `stats` as both `baseStats` and `finalStats`; the UI then reapplied racial/background modifiers. Reopening double-applied modifiers, could drive Strength below 5 and reported overspent points. Creation persisted final stats in the payload `stats` field while background modifiers were omitted from the derived value used by the rest of the app.

### 3. Character view route could not resolve the saved guest character

`/account/characters/view/char_1792754680486_r3rj9hueb` returned `Character not found` for the saved guest-scoped character.

### 4. Guest-local, not account/cloud

The created witness was guest-scoped (`scopeKind:"guest"`, `scopeId:"local-guest"`, `dirty:true`, `cloudBinding:null`). Roster surfaces also disagreed with the saved payload on HP/MP max, speed and ability count. Account/cloud persistence and a clean save/reopen pass were unverified at that time.

## Boundary

- The four defects above are closed for the shared wizard/view owner scope described in this ledger.
- Guest-local versus account/cloud persistence must still be reported separately.
- No class-local workaround, duplicate save path or automatic migration is permitted for these defects.
- Sol's comprehensive class-package review remains a separate, deferred gate.
