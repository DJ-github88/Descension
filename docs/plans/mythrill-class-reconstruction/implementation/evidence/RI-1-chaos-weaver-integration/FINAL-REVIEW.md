# RI-1 Chaos Weaver — final bounded review

**Verdict: ACCEPT** (2026-10-19)

**Scope:** RI-1 integration acceptance after the HeadQ-authorized bounded amendment. This is not acceptance of the original C1 workshop, whose independent corrected-source review remains **BLOCK**. It is also not acceptance of automated combat, balance, multiplayer authority or Wizard targeting/export.

This review was read-only. No application or test code was changed, and no commit, push or deploy was performed.

## Basis

- Reviewed `RI-1-CHAOS-WEAVER-INTEGRATION.md`, `RI-1-SCOPE-AMENDMENT.md`, `CORRECTION-REPORT.md`, `independent-review.md`, `report.md`, the amendment logs and `amendment-live-check.json`.
- Re-read the actual modal, heritage registry/contract/coverage tests and evidence. Rechecked the 15-source hash ledger in `CORRECTION-REPORT.md`.
- Confirmed the only amendment path still uncommitted at review time is `LevelUpChoiceModal.test.jsx`; `amendment-live-check.json` is untracked evidence.
- Unrelated concurrent `server/`, riposte and documentation changes are outside this acceptance and were not modified.

## Blocking findings — dispositions

| Finding | Disposition | Evidence |
| --- | --- | --- |
| B1 level-2 learning used a random three-option slice | Resolved | `LevelUpChoiceModal.jsx` bypasses the legacy level-2 slice when `progression.policy` exists; modal regression asserts seven CW IDs and a legacy Minstrel three-option control. |
| B2 paid talent grants materialized as PASSIVE / 0 AP | Resolved | `talentTreeData.js` projects the canonical authored grant; `TalentTreeContent.jsx` applies canonical id/type/AP/targeting/mechanics. Grant regression passes. |
| B3 ranks/grants survived level reduction and class switching | Resolved | `progressionSlice` and `infoSlice` prune allocation and remove earned grants; level-down and class-switch regressions pass. |
| B4 deterministic pending crashed the resource HUD | Resolved | `ChaosWeaverResourceDisplay.jsx` handles deterministic `face-recorded` pendings without indexing null faces. HUD regression and live mount pass. |
| B5 heritage baseline was not updated for the 22nd class | Resolved | Registry tests assert 22 provenance/base classes, 550 combinations, 25 traditions and 102 native relationships. |
| Workshop decline test was an unsupported-path failure | Retired with retained evidence | The obsolete case was removed without `test.skip`; the original failure is retained in `retained-ChaosWeaverWorkshop.test.jsx.txt` and `retained-workshop-decline-failure.log`. Supported decline behavior is covered by `chaosWeaverRules.test.js:216-233`. |

## Acceptance criteria

1. **Heritage:** `Chaos Weaver -> ['drall_fexric']` native access is registered; `Chaos Weaver|drall_fexric` has no authored mechanical edge; `heritageEffectsImplemented` is `false`; every other native pair still has an authored edge. **PASS**
2. **Workshop retirement:** no `test.skip`; retained failure evidence exists; the supported integrated decline behavior remains covered. **PASS**
3. **Level-2 policy:** the production modal renders all seven legal current-or-earlier CW options, not a random three; a legacy no-policy class still gets three. **PASS**
4. **Evidence integrity:** all 15 source hashes match; 17/17 suites and 232/232 tests pass; ESLint is clean on the five amendment paths; the live class route has no unapproved heritage edge, no horizontal overflow and no console errors. **PASS**
5. **Scope:** only the five authorized amendment paths were changed; unrelated work is untouched; no commit, push or deploy occurred. **PASS**

## Evidence ledger

- Hashes: **15/15 matched** the SHA-256 ledger in `CORRECTION-REPORT.md` (`TOTAL=15 FAIL=0`).
- Tests: `amendment-regressions.log` — **17 suites passed, 232 tests passed, 0 failed**; final review log `D:\AppData\Temp\opencode\ri1-final-review-tests.log` — `17 passed`, `232 passed`, `Time: 17.869 s`.
- ESLint: `amendment-eslint.log` — `eslint exit: 0`; **0 errors, 0 warnings** on the five amendment paths.
- Live route: `amendment-live-check.json` — `/rules?category=character-creation&sub=classes&class=Chaos%20Weaver`, 1280x900, `overviewVisible:true`, `hasTrainedHeritageHeading:false`, `hasDrall:false`, `horizontalOverflow:false`, `consoleErrors:0`. A prior capture noted one console warning; no error was present.
- Workshop retention: `retained-workshop-decline-failure.log` preserves the original failure; the completed suite contains no skipped decline case.
- Worktree: HEAD `f9527d31`; `LevelUpChoiceModal.test.jsx` is the only uncommitted amendment path; concurrent server/riposte work is not attributed to RI-1.

## Limits of this acceptance

- Chaos Weaver native access is approved, but its mechanical heritage edge/effects are explicitly pending and are not displayed as implemented or executed.
- Authenticated creation-wizard and character-sheet routes were not exercisable because of the auth redirect. Grant materialization is evidenced by the real-component regression and applied-record probe.
- The 360px `/game` resource HUD is gated by PhoneGate; deterministic HUD behavior was verified through a live component mount and unit regression.
- All class effects remain **manual-tabletop only**. This acceptance does not claim AP/HP/movement execution, combat automation, balance, multiplayer durability, room authority or Wizard export preservation.
- Legacy Gambit, Augur (including Nereid alias), Harbinger, Revenant, Shaper and Apex fixtures remain loadable; no automatic conversion or resource refill is authorized.

## Handoff

RI-1 is accepted as a development integration. The next cohort is RI-2: **Gambler first**, then **Fate Weaver incorporating Augur**. Build no new standalone workshop. Wizard targeting/export preservation remains a separate workstream.
