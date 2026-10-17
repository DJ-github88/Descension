# P11 independent review — Skill and Weapon Proficiency Foundations

**Verdict: PASS-WITH-FIXES.** Nothing blocks. There are three should-fix items and four notes.

## What was checked

- **Q1 storage.** Store, inspection and wizard writes now go only to per-weapon keys.
  - `infoSlice.js:1005-1015`, `InspectionContext.jsx:288-311` and Step7 `withRank` all go through `withWeaponRank`, which spreads the existing map and adds one key. A Weapon Mastery write without a known type or rank returns `null` and changes nothing.
  - Step7's init effect no longer seeds `weaponMastery: 'UNTRAINED'` (Step7:192-193).
  - No write path in the packet creates or overwrites `skillRanks.weaponMastery`. The legacy key is kept as-is by every spread and is only read by `getLegacySharedWeaponRank`, which drives the notice and the explicit "Use for" button.
  - `resolveWeaponRank` keeps the old per-weapon thresholds byte-equal (0/1/3/6/9/11/12, same walk from the top rank down).
  - One intended consequence: characters whose shared value was `'UNTRAINED'` used to skip quest progress, because the value was truthy. They now reach the per-weapon quest fallback. This is the contract's fix, not a regression.
- **Q2 budget.** `skillPointSystem.js` is byte-identical to the starting version, and `calculatePointsSpent` counts every key, so per-weapon keys are charged.
  - Every Step7 path is charged: class-skill select, upgrade, picker switch then upgrade, and deselect/reselect with a different weapon (a new Novice is charged each time).
  - Granted skills seeded over budget surface the warning. `validateCurrentStep` blocks a new character on the Skills step and on the Summary step's all-steps validation. Create/Update is gated by `state.isValid` on the last step only (`CharacterCreationWizard.jsx:205,305`).
  - Edit mode (`originalCalling` set) never gets the validation error, and the note does not change ranks.
- **Q3 wording and arithmetic.** Wizard and sheet copy agree with the P10 Laws (`SkillsDisplay.jsx:768,775,803,825,1048`) and contract §1. The die ladder is derived correctly from `WEAPON_TYPE_TIERS`.
  - The Skills.jsx diff changes only labels. `getSkillModifierBreakdown`, the dice quantities and `DiceRollingSystem` are untouched.
  - The weapon roll now uses the selected weapon's own rank instead of the shared rank. That is the intended change in Slice A, not an arithmetic change.
- **Q4 tests.** All new suites use the real production modules: the real store, the real `validateCurrentStep`, the real Step7 with only the context mocked, and the real Skills with the real stores.
  - Against the starting bytes they fail as they should:
    - **A1/A3 store and sheet:** the shared key gets overwritten, and Sword shows Adept.
    - **A7:** there is no `budget-reason-*`, warning or validation error.
    - **A8:** there is no picker label.
  - No vacuous assertions found.
- **Q5 P7–P10.** `Step7SkillsLanguages.test.jsx` and `waveB_characterRosterIsolation.test.js` are unchanged. The Laws pages are untouched. See finding 1 for one P-accepted invariant that is now broken.

## Findings

1. **should-fix — Summary checklist says "ready" while Create is disabled by the new skill-budget error.**
   - **Where:** `Step9CharacterSummary.jsx:364-373` and `:550`, triggered by the new error at `CharacterWizardContext.js:500-511`.
   - **Problem:** The checklist has no Skills row. `allComplete` ignores `validationErrors.skillPoints`. The code comment at `:358-359` states the accepted invariant: "the UI never claims 'ready' while Create is disabled".
   - **Scenario:** A new character spends 10/10 points, then lowers Intelligence (or switches background) in Step 1, and completes every other item.
     - On Summary, Create is disabled and the red banner lists "Skill training is over budget by N…".
     - The completion badge is still green: "Your hero is ready! Click 'Create Character' to begin."
   - **Fix:** Add a checklist row, for example `{ label: 'Skill training within budget', done: !validationErrors.skillPoints }`.
2. **should-fix — Edit mode: a class skill cannot be re-selected once the character is over the starting budget.**
   - **Where:** `Step7SkillsLanguages.jsx:128`, `:226`, `:271-275`.
   - **Problem:** `canAffordSelection` applies in edit mode too, even though §4 makes the budget informational there ("does not block saving or alter ranks").
   - **Scenario:** A player edits an existing character whose story-raised ranks total 30 against a 12-point budget, and clicks the selected class skill (say Stealth).
     - The click deselects it, and the existing code resets Stealth to Untrained (pre-existing).
     - The card now shows "Needs 1 point to select" and cannot be re-selected.
     - Update is still allowed, so the character saves with no class skill and loses that rank.
     - Before P11, re-selecting was possible (at Novice).
   - **Fix:** Skip the affordability gate when `isEditingCharacter` is true. Alternatively, get an explicit HQ ruling that edit mode is also gated.
3. **should-fix — Sheet weapon face mapping is still presented as a rule without the `[Open]` label.**
   - **Where:** `Skills.jsx:451-465` (the "With Mod … / Max Standard … / Surge / Upgrade [n–20]" chips) and the per-face stunt list from `renderWeaponStuntTechniques`.
   - **Problem:** Contract §5 requires `[Open]` on "mapping onto faces 1–20" where the sheet presents it as a rule. `SKILL_OPEN_RULES.weaponFaces` exists but is rendered only in the wizard (`SkillRulesReference.jsx:80`), never on the sheet.
   - **Scenario:** On the sheet, Weapon Mastery → Sword shows "Max Standard: [n] …" and the "Surge" ranges as settled. The header's `rollFormula` label covers modifier and explosion, but not face mapping.
   - **Fix:** Render `SKILL_OPEN_RULES.weaponFaces` beside the range summary or under the `weapon-proficiency-note`.
4. **note — Readers outside the packet were not checked.**
   - Within the packet, no reader of `skillRanks.weaponMastery` misbehaves:
     - `Skills.jsx` resolves per weapon.
     - `DiceRollingSystem` receives the rank from Skills.
     - `useCharacterPersistence:50,84` and `characterHelpers:205` copy the map wholesale.
   - Readers outside the packet, such as `data/skillAbilitiesData.isSkillProficient('weaponMastery', …)` or ability gating, would now see "not proficient" for new characters, because the shared key no longer exists. Grep the full repo before merging.
5. **note — Edit mode double-counts weapon ranks in the informational total.**
   - **Where:** `Step7SkillsLanguages.jsx:115-118`, `:441-443`.
   - **Scenario:** A legacy `weaponMastery: ADEPT` copied to two weapons via "Use for…" counts 10 + 10 + 10 points in the edit-mode note.
   - **Impact:** Display only, since edit mode is never blocked.
6. **note — The A5 test does not cover the apply step.** It checks runtime save → `loadCharacterState`, not the apply into the store (`useCharacterPersistence.js:84`). Risk is low because `skillRanks` is copied wholesale, and the browser check covered canonical assemble → `loadCharacter`.
7. **note — The wizard applies class-skill Novice to the remembered weapon.**
   - **Scenario:** The player picks Weapon Mastery from its card while another skill is being inspected, so the weapon picker is hidden. The class-skill Novice goes to the last-picked weapon (default Sword).
   - **Impact:** The card click then inspects Weapon Mastery, so the result becomes visible right away. This is consistent with §3 ("the picked weapon").

## Limits

There is no `node_modules`, so I re-ran nothing. Jest, eslint and browser results are taken as reported (`browser-results.json`: 28/28). The full repo is not in the packet, so finding 4 is unverified.

## Re-review of the three should-fix items (fixed bytes in /mnt/user-data/outputs/p11fix/)

I compared only the three files against the reviewed `after/` versions. Each diff is exactly the stated change and nothing else. Line endings are kept: Skills.jsx and Step9 stay all-CRLF, and Step7 stays all-LF.

1. **Fixed.**
   - **Change:** `Step9CharacterSummary.jsx:371` adds `{ label: 'Skill Training (within budget)', done: !validationErrors.skillPoints }`.
   - **Effect:** `allComplete` and `missingCount` now include the skill-budget error, so the badge can no longer say "ready" while Create is disabled by it.
   - **Edit mode:** never sets `skillPoints`, so the row is always complete there.
2. **Fixed.**
   - **Change:** `Step7SkillsLanguages.jsx:128-129` makes `canAffordSelection` return true when `isEditingCharacter` is set. That flag is declared earlier, at :112.
   - **Edit mode:** `isSkillDisabled` and `selectionBlockedByBudget` no longer gate on the budget, so a class skill can be re-selected and no reason is shown.
   - **New characters:** behaviour is unchanged, and A7 still holds for them.
3. **Fixed.**
   - **Change:** `Skills.jsx:1060` renders `SKILL_OPEN_RULES.weaponFaces` as `[Open]` text in the weapon-proficiency note.
   - **Scope:** the note sits only in the Weapon Mastery panel, above the face-mapping chips.
   - **Arithmetic:** unchanged.

**Note 4 resolved:** the coordinator grepped the full repo and reports no other reader of the shared rank. I did not verify that grep myself; I accept it as reported, along with the new tests passing and lint matching the baseline.

**Final verdict: PASS.** No blocking or should-fix items remain. Notes 5–7 stand as non-blocking.
