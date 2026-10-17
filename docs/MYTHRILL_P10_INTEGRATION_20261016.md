# P10 integration and Sol closure — 2026-10-16

## Result

**Sol's bounded source/build/App closure is complete. P10 is integrated and verified in `D:/VTT`.** The reviewed P10 runtime patch applied unchanged. The later session hook was reconciled by retaining its committed current implementation, adding a focused regression and obtaining one bounded independent PASS. No further production behavior was introduced.

Current ledger: [ENGINEERING_STATE.md](ENGINEERING_STATE.md). Claude's implementation account and preserved creator-open/follow-up details: [MYTHRILL_PROJECT_10_IMPLEMENTATION.md](MYTHRILL_PROJECT_10_IMPLEMENTATION.md). Operational release gates remain in [MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md](MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md).

## Starting position and guarded application

- Entry/final HEAD: `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`, branch `master`. Entry worktree changes were unrelated class icons; retained. No commit, push, deployment, reset or destructive cleanup.
- Read root AGENTS, live engineering ledger, P9 integration follow-through, original P10 roadmap scope, archive tooling/data/diff/inventory/reports and router material. Archive contains the main independent review; later skills/weapons verdicts are recorded in Claude's implementation report, without separate full review files in the archive.
- Bundle `p10bundle-final.tgz` SHA-256 `7eff31ec8f8aaf7e0d1b3a4df29e186448cac82bafefd9bb46d1cedb88be6c9e`. Extracted outside Git at `D:/AppData/Temp/opencode/p10-integration-20261016/p10/`.
- Inspected Python/imported edit data before execution. Its replacements/new-file guards collect failures before writes; JSON `set`/`insert` operations do not verify all original values. Compensating starting check: every existing one of the **38 target paths** matched HEAD content, including the full rules/lore inputs.
- `--check` passed; guarded apply ran once and passed. No failed guard, partial-apply retry, force overwrite or source conflict. `git apply --reverse --check --ignore-space-change p10.diff` passes on all integrated outputs, confirming the reviewed diff. Three new constants/test files are included.
- Added five `docs/ai` routers, release checklist, implementation report and original main review. Merged live status; no isolated-workspace engineering ledger replaced the live ledger. Original main review is byte-identical to the archive.

## Sol source reconciliation and reused evidence

The old frozen source packet was hash-verified (`e9aed032…bc1cbf9` from the P9 follow-through). Only the specific hook delta and eleven relevant P8/P9 data/runtime/config dependencies were compared; no asset inventory or repository snapshot was created.

- `useSessionManagement.js` frozen SHA-256 `94a7a11d2252b8894857d503aa0f3a5fddf812b5ef4a582d5e7b901161e81a91`; retained current `8ef6fe27a74ec53995191091979bdc8ce6daef7d20b03b1cc8cf41cc3f0abb46`.
- Current hook restyles the warning, updates countdown text without replacing button nodes, and explicitly cancels the warning timeout on extend/logout. Room/game bypass, auth/persistence boundaries and combat are unchanged. Hook source was already committed at entry and was not rewritten.
- [Bounded independent review](MYTHRILL_SESSION_CLOSURE_BOUNDED_REVIEW_20261016.md): **PASS**, corrected regression **4/4**. First test assumed renewal one second too early; fixed the test to account for the incumbent activity throttle and added post-logout deadline coverage. The reviewer also records pre-existing active-warning teardown/tick-clock limits; they were not expanded into repairs.
- The eleven compared P8/P9 dependencies match the prior frozen bytes exactly, including complete abilities/creatures JSON, Feather Slash, P9 service, actor consequence service, ActionBar, PartyHUD/CSS, package/lock/CRACO. Existing accepted server, isolated rejoin and lifecycle evidence therefore carries forward. No historic RED/catalogue replay or merchant detour.
- Abilities stays **1.5.0**, explicitly admitted alongside **1.4.0**. No version gate or capability identity was changed. Rules/lore alone move to **2.3.0**.

## Verification executed

Evidence root (external): `D:/AppData/Temp/opencode/p10-integration-20261016/`. Reusable runners: `vtt-react/verification/p10/`. Small source/result manifest: `vtt-react/verification/p10/integration-identity.json` (**60 relevant paths**, not a whole-tree seal).

| Check | Result |
|---|---|
| Report-directed affected frontend selection | **48 suites / 477 tests PASS**, exit 0, relevant before/after drift `[]` |
| Included P10 Laws and actual RulesPage renders | Included above: **42 Laws/parse checks + 8 rendered views**, PASS |
| AP/combat/hydration/P8/P9 and overlaps | combatStore, silentRoomHydration/roomHydrationCorrections, featherSlash, spellConsequence, p7BoundsConsumers, ActionBar/SpellActionBar producers/legacy path, fan/tooltip/Bestiary/Settings/creation/talent/route tests, changed library/loot tests and all waveA/B/C named persistence families, PASS |
| Scoped lint under actual checkout config | Raw exit **1**: **33 errors / 209 warnings**. Same paths at HEAD: **33 errors / 210 warnings**. **Added diagnostics `[]`**; the 33 incumbent errors are CampaignManager (9) and CampaignManagerWindow (24), primarily import placement. No lint rules weakened. |
| Scoped whitespace | `git diff --check` PASS |
| Witness syntax | `node --check` for four P10 runners and the two parameterized P9 witnesses, PASS |
| Final production compilation | **Compiled successfully / exit 0**, direct integrated checkout, relevant drift `[]` |
| Actual production-App bounded P8/P9 smoke | **PASS** on that exact build; actual token fan, HUD producer, owner approval, GM pointer click and accepted receipts |
| Real Chrome Laws/cache/tracker | **PASS** on same optimized build; observations below |

Build: **2026-10-16 11:02:37–11:05:59 UTC**. Existing unmodified production CRACO config/dependencies; `NODE_OPTIONS=--max-old-space-size=8192`, `CI=''`, external `BUILD_PATH`. Asset manifest SHA-256:
`d66a6d77685a22b6dea2c1fb1b5d6b344ac2c2fe21d7d283e25ab8af9c6c5e3e`.

### Browser observations

- Seeded actual pre-P10 rules/lore into browser IndexedDB at versions 2.2.3/2.2.1. Reload fetched both shipped JSONs (HTTP 200); both cache entries became **2.3.0**, and the new First Table Reference rendered. No manual deletion of existing player records.
- Opened/clicked actual section tabs for First Table, Combat Basics, Attacks & Damage, Combat Tracker, Inventory, Talents and class resources. AP/card/manual-support/DR/Evasion/creature-open explanations render. No obsolete Armor-score/soak formula at these views.
- Skills: Standard manual narrative rank selection, point-buy with open budget/bonuses; Advanced as authored-task advancement with resolution conflict marked open; Weapon Mastery uses authored faces. Weapons: attack card/proficiency/type-specific table distinction, confirmed **d4/d6/d8/d10/d12/d20/d20**, open modifier/explosion/lookup and AC/to-hit faces. Both toggles exercised. No proficiency combat wiring was added.
- Actual creature tooltip rendered with no numerical Armor/AC. Included focused checks cover the other changed account/item/GM editor/stat/card surfaces and preserve legacy bytes without DR conversion.
- Actual tracker default radio is **Restore to Maximum**. Fixture PC starts **4/4 AP**, temporary AP **2**. Spend 2, use real **Next Turn** control: **4/4 AP**, same initiative **9** and d20 **9**, temp **2**. Saved maxima/config variants retain the reviewed no-migration behavior; shared-room AP still uses its existing authorization seam.
- P8 receipt command `a2f49337-d18d-4b0e-9472-f9571678161b`: physical `[3,5]+5=13`, GM final 10; source AP 1, target HP 24/tempHP 0.
- P9 receipt command `0b79738d-8dad-4162-a2bf-e8c489b242ce`: physical `6+4=10`, approval does not spend; GM final 7. Source mana 9/temp 0, AP 2/temp 0, spheres `['ember']`; target HP 17. GM acceptance hit-test and ordinary click pass.
- App run: **2 `Failed to fetch` page errors / 23 deliberate Firebase refusals**. Laws/navigation run: **11 corresponding fetch page errors / 20 deliberate Firebase installation refusals**. No zero-page-error claim. Both receipts remain live-only (`checkpointRevision: null`).

These are real optimized App/router/CSS/Chrome/IndexedDB/UI observations with established fixture principals, owner/lease/cloud boundaries and registered Socket.IO backend. They do **not** establish live Firebase/rules, staged deployment, deployed restart, physical tabletop or physical second-device durability.

### Exact commands and retained attempts

Working directory `D:/VTT/vtt-react`, except guarded apply/diff checks from `D:/VTT`:

```text
python D:/AppData/Temp/opencode/p10-integration-20261016/inspect.py
python D:/AppData/Temp/opencode/p10-integration-20261016/p10/p10_apply.py D:/VTT --check
python D:/AppData/Temp/opencode/p10-integration-20261016/p10/p10_apply.py D:/VTT
git apply --reverse --check --ignore-space-change D:/AppData/Temp/opencode/p10-integration-20261016/p10/p10.diff
node verification/p10/run.cjs tests
node verification/p10/run.cjs lint
node verification/p10/lint-baseline.cjs
```

`tests.json` retains the complete expanded 48-path Jest command (`test --watchAll=false --runInBand --silent --testTimeout=20000 --runTestsByPath …`), exact timings and hashes. `lint.json` retains exact checked paths; `lint-baseline.json` retains matched incumbent diagnostics.

```powershell
Test-Path -LiteralPath "D:\AppData\Temp\opencode\p10-integration-20261016"
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList 'D:\VTT\vtt-react\verification\p10\run.cjs','build' -WorkingDirectory "D:\VTT\vtt-react" -PassThru -WindowStyle Hidden
$env:APP_BUILD_DIR='D:\AppData\Temp\opencode\p10-integration-20261016\build'
$env:APP_OUTPUT='D:\AppData\Temp\opencode\p10-integration-20261016\app-smoke'
node verification/p9/integration/app-browser.cjs
$env:P10_URL='http://127.0.0.1:4180'
$env:P10_BROWSER_RUN='laws-browser-5'
node verification/p10/laws-browser.cjs
node verification/p10/final-check.cjs
```

Only one compiler run occurred. An initial new runner had an incorrect repository-root depth and exited before launching checks/compiler; corrected. The independent hook test's initial timing failure is retained in its report. Earlier external `laws-browser` through `laws-browser-4` are witness setup/assertion failures (missing Defend name in the pre-existing universal-card label-resolution path, display title assumption, icon-prefixed accessible toggle name, unregistered combatStore lookup). Corrected only the witness: actual descriptions and routes, regex toggle name, existing compiled store export. Final `laws-browser-5` passed. No production bypass or acceptance weakening.

## Concurrent work and remaining gates

Unrelated `AccountJournalManager.css` presentation appeared **11:18:38 UTC**, after compilation; `CharacterCreationWizard.css` presentation also changed during finalization. Both are preserved outside this build identity; neither changes P10 rules, the reconciled hook or supported ability definitions. All 60 relevant identified source/witness paths are checked; all built P10/hook/dependency bytes still match. Class icon work is retained. No whole-moving-worktree or later-style build claim is made, and unrelated presentation did not trigger another acceptance cycle. A broad final whitespace scan reported trailing whitespace in the concurrent wizard CSS; the exact integration-path/new-file whitespace check passes, with no cleanup of another owner's CSS.

Concurrent presentation continued in `AccountJournalManager.jsx` (targeted diff: colors/inline styling), `Step1CoreDraft.css` and `ClassIcon.css`. Those edits are likewise retained outside the tested build claim; no overlapping P10/hook/capability source was changed by them.

No integration-caused failure or unresolved rule decision blocks this bounded integration. Genuine release gates remain: creator Laws/canon confirmation, one GM/two-player physical and VTT session, H13 owner/release decision, P9 `<attr>/K`, P5-05/07/09/10/11/12/13/31/32, real services/rules, staged save/fault/rejoin/export/restore/rollback/restart and device evidence. Existing layout and warning-teardown limitations remain recorded at their original scope.

**Recommended next bounded task:** creator validation of the published First Table Reference/Laws and named canon, followed by the already-required first-table session. Keep the five recorded skill-engine issues as a separate approved follow-up; no P11–P14 or defense/reaction/elixir controller implementation follows from this closure.
