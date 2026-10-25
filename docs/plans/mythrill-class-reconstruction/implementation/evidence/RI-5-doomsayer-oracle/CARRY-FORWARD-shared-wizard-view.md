# Carry-forward — shared Mythrill wizard/view defects

**Owner:** shared Mythrill wizard/view and persistence owner, not a class package.
**Source:** RI-8 Plaguebringer character round-trip, 2026-10-25.
**Status:** reproduced context; not fixed by RI-5 and not patched inside Doomsayer/Oracle.

These defects block clean edit/reopen and character-view verification for any class. RI-5 does not modify the shared paths below and does not claim account/cloud persistence.

## 1. Edit load drops `class_spells`

`CharacterWizardContext.js` `LOAD_CHARACTER` does not restore `class_spells`, while `Step1CoreDraft.jsx` reads `characterData.class_spells.known_spells`. Reopening a saved character therefore shows `Starting Spells 0 of 1 chosen` even when the saved payload has known spells.

## 2. Saved final stats are reused as base stats

The edit-load path loads persisted `stats` as both `baseStats` and `finalStats`; the UI then reapplies racial/background modifiers. Reopening double-applies modifiers, can drive Strength below 5 and reports overspent points. Creation persists background-adjusted `finalStats` in the payload `stats` field while a separate `stats` field omits background modifiers.

## 3. Character view route cannot resolve the saved guest character

`/account/characters/view/char_1792754680486_r3rj9hueb` returns `Character not found` for the saved guest-scoped character.

## 4. Guest-local, not account/cloud

The created witness is guest-scoped (`scopeKind:"guest"`, `scopeId:"local-guest"`, `dirty:true`, `cloudBinding:null`). Roster surfaces also disagree with the saved payload on HP/MP max, speed and ability count. Account/cloud persistence and a clean save/reopen pass remain unverified.

## Boundary for RI-5

- Doomsayer/Oracle data, resource validators, HUD displays, catalogue/detail registration, talent trees and spell pools can be verified without the shared defects.
- Character creation can be exercised through the supported wizard, but edit/reopen and `/account/characters/view/:id` must be reported as blocked until the shared owner fixes these paths.
- Guest-local versus account/cloud persistence must be reported separately.
- No class-local workaround, duplicate save path or migration is added for these defects.
