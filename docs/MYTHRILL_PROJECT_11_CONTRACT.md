# P11 — Skill and Weapon Proficiency Foundations (contract)

Authorized by HQ on 2026-10-16. Roadmap: [MYTHRILL_P11_P14_ROADMAP.md](MYTHRILL_P11_P14_ROADMAP.md).
Origin: the five skill-engine follow-ups recorded in
[MYTHRILL_PROJECT_10_IMPLEMENTATION.md](MYTHRILL_PROJECT_10_IMPLEMENTATION.md). This contract covers
items 1, 3 and 4 of that list plus the wording part of item 4; item 2 (conflicting
roll paths) and item 5 (combat wiring) are specified in §6 but **not implemented**.

## 1. Creator-confirmed rules this contract relies on

- Simple (Standard) skills: the player raises ranks through training and story; no
  level link, no GM approval.
- Advanced skills differ only in how ranks advance: authored tasks (Skill Quests).
- Initial allocation is point-buy; the budget and bonus policy stay **[Open]**.
- Proficiency die ladder: d4 Untrained, d6 Novice, d8 Trained, d10 Apprentice,
  d12 Adept, d20 Expert and Master.
- Attack card, proficiency rank with that weapon type, and that weapon's outcome
  table are three separate things. The mace example was illustrative only.
- Distinctive builds are preserved; no numerical homogenization.

## 2. Starting identity

HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`. Concurrent uncommitted presentation
work exists in the character-creation wizard (`Step1CoreDraft.jsx`,
`Step7SkillsLanguages.jsx` inline colour, `Step10EquipmentSelection.jsx`, wizard CSS)
and elsewhere. It is preserved. Every edited file is staged, checked for drift and
written back with a modification-time guard.

## 3. Slice A — per-weapon rank storage

**Defect.** `infoSlice.setSkillRank(skillId, rankKey)` ignores the weapon type the
sheet passes, so one `skillRanks.weaponMastery` value becomes every weapon's rank
and hides per-weapon quest progress.

**Storage.** One key per weapon type inside the existing `skillRanks` map:
`skillRanks["weaponMastery_<weaponType>"] = <RANK_KEY>`, where `<weaponType>` is a
`WEAPON_TYPE_META` key. This is the same key shape `skillProgress` already uses for
per-weapon quest progress. `skillRanks` already persists unchanged through the
canonical character document, the runtime character-state document, the P6 shape
codec and multiplayer sync, so no persistence code or schema changes.

**Resolution for weapon type T** (one pure owner: `utils/weaponProficiency.js`):
1. stored `skillRanks.weaponMastery_T` if it is a known rank;
2. otherwise the existing per-weapon quest thresholds over
   `skillProgress.weaponMastery_T` (unchanged behaviour);
3. otherwise Untrained.

**Legacy shared rank.** `skillRanks.weaponMastery` is never deleted, rewritten or
applied implicitly. When it holds a rank above Untrained, the Weapon Mastery panel
shows: which rank was stored, that it is kept unchanged, and a "Use for <weapon>"
action that copies it into the currently selected weapon's own key. The player may
use it for several weapons or none. An Untrained shared value (the old creation
default) carries no information and shows no notice.

**Writes.** `setSkillRank('weaponMastery', rank, weaponType)` writes only the
per-weapon key. A Weapon Mastery write without a valid weapon type, or an unknown
rank, is refused and changes nothing. The inspection context passes the weapon
type through and keeps its existing edit permission check.

**Character creation.** The wizard's Weapon Mastery inspector has a weapon-type
picker. Rank purchases apply to that weapon type's key and are charged with the
existing per-rank costs, one purchase per weapon type. The wizard no longer
creates a shared `weaponMastery` entry. Choosing Weapon Mastery as the class skill
starts the picked weapon at Novice (if affordable). Deselecting it keeps per-weapon
ranks, which the player lowers individually; this avoids erasing ranks when
editing an existing character.

## 4. Slice B — creation budget enforcement

Budget and costs stay exactly as configured in `constants/skillPointSystem.js`
(`calculateTotalSkillPoints`, `TOTAL_COST_TO_RANK`, `getUpgradeCost`).

- Selecting a class skill that is Untrained costs the Novice step; it is refused
  when that step is not affordable, with a visible reason on the card.
- Upgrades keep their existing affordability check.
- **New character:** if spending exceeds the budget (for example after lowering
  Intelligence or changing background), the step shows "Over budget by N" and the
  Skills step reports a validation error, so the character cannot be finished until
  a rank is lowered.
- **Editing an existing character:** sheet ranks raised later by training and story
  may exceed the starting budget. The wizard shows an informational note and does
  not block saving or alter ranks.

## 5. Slice C — skill-interface wording

Creation (`Step7SkillsLanguages.jsx`) and sheet (`Skills.jsx`) text must agree with
the P10 Laws and the confirmed rules:

- Standard advancement is player-set through training and story; remove "awarded by
  the GM".
- Advanced advancement is authored tasks; listed task unlocks are applied by the GM,
  not granted by the VTT.
- The die ladder is shown from the owning constants.
- Weapon Mastery is ranked per weapon type.
- Starting point-buy text states the actual costs, that background and class skills
  start at Novice **paid from the same points** (the old "for free" text was wrong),
  and that budget/bonuses are `[Open]`.
- Open items are labelled `[Open]` where the sheet currently presents them as rules:
  check resolution (fixed DC vs Difficulty Die), exploding maximum, rank check bonus,
  whether a modifier is added, mapping onto faces 1–20.
- A short "What the VTT does" line: it stores ranks and rolls the die you choose;
  it does not apply skill or weapon results in combat.

Sheet roll arithmetic is **not** changed; only its labels.

## 6. Slice D — proficiency → combat follow-up contract (documentation only)

Exact later changes, for P12 or a dedicated follow-up, after decisions D11-1…D11-5:

1. **Equipped weapon → weapon type.** A pure mapper from the equipped item
   (`subtype`, e.g. `SWORD`) to a `WEAPON_TYPE_META` key. Unmapped or ambiguous
   items return `manual` with a reason; no fallback to `sword` for combat.
2. **Rank read.** Combat reads `resolveWeaponRank()` from `utils/weaponProficiency.js`
   for that weapon type. It never reads the legacy shared rank.
3. **One roll owner.** Replace the conflicting paths (sheet Standard die+modifier,
   sheet Advanced/3D `weaponmastery_*_d8` tables) with one pure function
   `rollProficiency({rankKey, faces, decisions})` used by the sheet, 3D dice and the
   combat panel. Its modifier (D11-1), explosion (D11-2) and face mapping (D11-3)
   come from creator decisions, not code defaults.
4. **Outcome entry.** The weapon's authored 1–20 entry is displayed in the attack
   panel as GM-applied text. Only numeric damage deltas may later become typed
   amounts inside the GM-confirmed final amount; stunts, cleave, AP loss, sunder and
   "bonus action" faces stay manual until each is approved.
5. **Room projection and privacy.** The attacker's rank for the one weapon type used
   is copied into the attack proposal, not the full `skillRanks` map.
6. **Obsolete faces.** AC/to-hit/ignore-armor-DR outcome text is never parsed.
7. **Tests.** Mapper table; resolve precedence; one roll owner equivalence across
   sheet/3D/panel; decisions toggled; manual for unmapped items; privacy of the
   projection.

## 7. Files expected to change

- `vtt-react/src/utils/weaponProficiency.js` (new) — key, resolution, legacy detection.
- `vtt-react/src/store/characterSlices/infoSlice.js` — `setSkillRank` per-weapon write.
- `vtt-react/src/contexts/InspectionContext.jsx` — pass weapon type through.
- `vtt-react/src/components/character-sheet/Skills.jsx` — resolution, legacy notice, wording.
- `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx`
  — weapon picker, budget enforcement, wording.
- `vtt-react/src/components/character-creation-wizard/context/CharacterWizardContext.js`
  — Skills-step over-budget validation (creation only).
- `vtt-react/src/components/character-creation-wizard/steps/Step9CharacterSummary.jsx`
  — added by the review repair: Summary checklist row for the skill budget.
- New wording component(s) and focused tests; this contract, implementation report,
  roadmap, engineering ledger.

Not touched: Laws pages (`rules.json`, `SkillsDisplay.jsx`), cost/budget constants,
roll arithmetic, `DiceRollingSystem.jsx`, P7–P10 services, creature skills.

## 8. Acceptance checks

| ID | Check |
|---|---|
| A1 | Setting Sword Adept then Axe Novice leaves Sword Adept; a third type stays Untrained. |
| A2 | Per-weapon quest progress is honoured for a type with no stored rank, even when a legacy shared rank exists. |
| A3 | Legacy shared rank: bytes unchanged after load, display and per-weapon writes; notice offers per-weapon use; Untrained shared shows nothing. |
| A4 | Refusals: Weapon Mastery write without type or with an unknown rank/type changes nothing. |
| A5 | Persistence: per-weapon keys survive the canonical save → load path and the runtime save → apply path. |
| A6 | Isolation: switching characters/accounts does not carry per-weapon ranks across. |
| A7 | Budget: class-skill selection refused at 0 points; allowed at exactly the cost; upgrade boundary; over-budget after budget change blocks a new character and only warns in edit mode. |
| A8 | Wizard weapon purchases are charged per weapon type and write per-weapon keys only. |
| A9 | Rendered wizard and sheet show the corrected wording and no "awarded by the GM" / "for free" text. |
| A10 | Affected existing suites (Step7, P10 Laws/rendered, waveB roster isolation) still pass. |

Real-browser check: the actual wizard Skills step and sheet Skills panel rendered in
Chromium with the real stores. Live Firebase save/load across devices remains an
environment gate.

## 9. Rollback

Revert the listed files. Per-weapon keys already written stay in `skillRanks` and are
ignored by the old code (which reads only the shared key); nothing is deleted.
