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

### Evidence (2026-10-27)

- Focused automated verification: **18 suites / 85 tests passed**.
- Scoped ESLint: **0 errors** (pre-existing unrelated warnings only).
- Production build: **exit 0**, compiled successfully.
- Live browser round-trip on saved guest `char_1792754680486_r3rj9hueb`: view opens; edit opens with `Starting Spells 1 of 1 chosen` and `Ability Scores — All points spent`; update succeeds; saved payload has base `stats`/`baseStats`; roster and view both report HP 50/72, MP 25/79, speed 25 ft, 3 spells / 3 skills.

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
