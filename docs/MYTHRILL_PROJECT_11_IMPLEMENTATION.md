# P11 — Skill and Weapon Proficiency Foundations (implementation report)

**Status: implemented; one bounded independent review — PASS after one repair cycle.**
Contract: [MYTHRILL_PROJECT_11_CONTRACT.md](MYTHRILL_PROJECT_11_CONTRACT.md).
Review: [MYTHRILL_P11_INDEPENDENT_REVIEW_20261016.md](MYTHRILL_P11_INDEPENDENT_REVIEW_20261016.md).
Roadmap: [MYTHRILL_P11_P14_ROADMAP.md](MYTHRILL_P11_P14_ROADMAP.md).
No commit, push, deployment or reset. HEAD stayed `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`.

## Local production closure addendum — 2026-10-16

**The formerly outstanding Windows production build and full-App smoke are complete.** They were
combined with the authorized P12A closure. Final frozen integrated production compile exit0 with
`mirrorDrift: []`; full optimized App/router/CSS witnesses verify independent Sword/Axe ranks,
explicit legacy recovery for Dagger, canonical working-payload reload, creation budget blocking,
Summary's incomplete budget checklist/disabled Create, and informational existing over-budget edit
mode without rank loss. A separate full-App witness exercises actual `saveCurrentCharacter` →
scoped device roster → page reload → actual `loadCharacters` / `loadCharacter`, retaining all
separate ranks and the original shared legacy value.

Evidence: `D:/AppData/Temp/opencode/p12a-frozen-final-20261016/`
(`build.json`, `accepted-app/result.json`, `p11-device-save/result.json`). Commands, exact build
identity and limits: [P12A implementation report](MYTHRILL_PROJECT_12A_IMPLEMENTATION.md).
The Summary badge's incumbent continuous animation required bypassing Playwright's stability wait
for its real pointer click; the production component was not replaced. Provider/cloud boundaries
are fixture-bound and deliberate external-fetch errors are retained. Cloud confirmation, live
Firebase/rules, physical second device and human/tabletop gates remain open. Later unrelated live
presentation/transition edits are outside the exact frozen-build identity.

The original implementation/limitation record below is retained as history, not a current build gap.

## What players and the GM can do now

- Set a separate rank for each weapon type on the sheet; the grid, selector and roll
  use that weapon's own rank. Per-weapon quest progress shows again for weapons
  without a stored rank.
- An old single Weapon Mastery rank stays stored, unchanged, and appears as a notice
  with "Use <rank> for <weapon>". It is never applied to every weapon again.
- At creation, buy Weapon Mastery per weapon type (picker in the inspector), each
  charged at the existing costs. A class skill can't be selected without the Novice
  point. A new character over budget sees "Over budget by N" and cannot be finished;
  the Summary checklist shows the same item. Editing an existing character only
  shows a note and never blocks or changes ranks.
- Creation and sheet text now say: Standard ranks are raised by the player through
  training and story; Advanced ranks advance by authored tasks whose unlocks the GM
  applies; the die ladder d4→d20; background/class skills are paid from the same
  points (the old "for free" was wrong); open rules are labelled `[Open]`; the VTT
  stores ranks and rolls dice but does not apply skill or weapon results in combat.

## Changed files (`vtt-react/src/`)

| File | Change |
|---|---|
| `utils/weaponProficiency.js` (new) | Owner: key `weaponMastery_<type>`, resolution (stored → own quests → Untrained), legacy detection, refusal of unknown type/rank. |
| `constants/skillProgressionCopy.js` (new) | Shared wording; die ladder read from `WEAPON_TYPE_TIERS`; point-buy text from `skillPointSystem.js`. |
| `components/character-creation-wizard/components/SkillRulesReference.jsx` (new) | Replaces two duplicated inline rules blocks in Step7. |
| `styles/skillProficiency.css` (new) | Notes/notice/picker styles (since restyled by concurrent presentation work; retained). |
| `store/characterSlices/infoSlice.js` | `setSkillRank(skill, rank, weaponType)` writes per-weapon only; refuses ambiguous writes. |
| `contexts/InspectionContext.jsx` | Passes weapon type through; same edit permission. |
| `components/character-sheet/Skills.jsx` | Per-weapon resolution, legacy notice, wording and `[Open]` labels. Roll arithmetic unchanged. |
| `components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` | Weapon picker, per-weapon purchases, budget enforcement, over-budget warning/note, wording. |
| `components/character-creation-wizard/context/CharacterWizardContext.js` | Skills-step over-budget validation (new characters only). |
| `components/character-creation-wizard/steps/Step9CharacterSummary.jsx` | Review fix: checklist row for skill budget. |

Not changed: budget/cost constants, Laws pages, `DiceRollingSystem.jsx`, P7–P10 services.
No persistence change was needed: `skillRanks` already round-trips through the
canonical character, runtime state, P6 codec and multiplayer sync.

## Verification

| Check | Result |
|---|---|
| New Jest suites (6): owner, budget validation, store + canonical/runtime persistence + isolation, Step7 rendered, sheet rendered, Summary checklist | **31 tests PASS** |
| Affected regressions: Step7SkillsLanguages, CharacterWizardContext, InspectionContext, waveB roster isolation, firstTableLaws, FirstTableLawsRendered, CharacterViewHeaderMounts, Step1CoreDraft ClassArt/Narrowing | **all PASS** (73 tests) |
| Scoped ESLint (react-app config) on changed files | 0 errors; warnings identical to HEAD baseline (Skills 4, Step7 1, Inspection 2, Step9 3) |
| Whitespace | `git diff --check` clean except Skills.jsx, whose working copy was already CRLF over an LF HEAD before P11 (content-identical); its content diff with CR ignored is clean |
| Real browser (Chromium, real Step7 in the real wizard provider, real sheet Skills with real stores) | **28/28 PASS**, zero page errors; reload persistence via `assembleCharacterWorkingData` → `loadCharacter`; second character isolated |

Browser witness: `vtt-react/verification/p11/` (`harness.jsx`, `build-harness.cjs`,
`browser.cjs`, README). Bundle and evidence (results JSON, run log, two screenshots)
are outside Git at `D:/AppData/Temp/opencode/p11-browser-20261016/`.

## Limitations

- No full production build was run: the device shell is a Linux VM (4 GB, 180 s per
  call, no detached processes) and cannot run the Windows detached CRA build from
  `AGENTS.md`. The changed modules compiled with the project's Babel preset inside the
  witness bundle. **A detached production build on the PC remains to be run.**
- Browser checks used a harness page, not the full App router; live Firebase, second
  device and human use are not shown.
- The sheet screenshot was skipped (remote fonts unreachable in the sandbox); the
  DOM assertions ran.
- Review notes (non-blocking): edit mode's informational total counts a legacy shared
  rank alongside per-weapon copies; the runtime test stops at load (apply copies
  `skillRanks` whole); choosing Weapon Mastery as class skill from its card while
  another skill is inspected gives Novice to the last-picked weapon (shown at once).
- Concurrent presentation edits landed during the work (`stats-combined` classes in
  Skills.jsx; restyled `skillProficiency.css`; wizard CSS/Step1/Step10). All preserved;
  every P11 write used a modification-time guard and none was rejected.

## Combat follow-up (not implemented)

Contract §6 specifies the later work: equipped item → weapon type mapper, combat
reads `resolveWeaponRank` (never the legacy rank), one roll owner replacing the
conflicting sheet/3D paths, GM-applied outcome entries, rank projection limited to the
weapon used, no parsing of AC/to-hit faces. It needs creator decisions D11-1…D11-5.
