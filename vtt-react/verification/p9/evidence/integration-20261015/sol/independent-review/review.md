# Independent review — bounded integration corrections

- **task_id:** `independent-integration-review-20261015-completion` (local review identifier)
- **Reviewer role:** independent reviewer; this session did not implement the corrections.
- **Repository:** `D:\VTT`
- **Review date:** 2026-10-15
- **Fresh probe run:** 2026-10-15T19:17:44.470Z–19:17:45.929Z; later build completion observed before final sealing.
- **Disposition:** **Review completed; combined integration acceptance INCOMPLETE.** The interrupted task itself was not treated as completed review evidence.

## Verdicts

| Bounded correction | Verdict | Basis |
|---|---|---|
| 1. `featherSlash.js` explicit `1.4.0` + `1.5.0` allowlist and affected tests | **PASS** | Exact minimal source delta verified; raw execution shape remains closed; original capability, plans, receipt interpretation and retained-command custody are preserved. Fresh independent VM checks passed. |
| 2. Existing `ActionBar.jsx` `migrateBlockId` import and legacy test | **PASS** | Exactly one import versus the accepted snapshot. The mounted regression passes with it and the saved in-memory import-removal negative control fails specifically with the missing-name ReferenceError. |
| 3. `PartyHUD.jsx` host class and appended right-edge CSS | **INCOMPLETE** | Source delta and desktop CSS fixture pass. A complete current full-App P9 pointer-click-to-receipt witness is absent from the specified latest replay: run 7 failed before GM acceptance. The static fixture is not a replacement for that witness. Responsive limitations are recorded below. |

**No scoped source BLOCK is established by the evidence inspected.** Correction 3 is withheld for an incomplete integration witness, not diagnosed as the cause of the replay's source-pool assertion. These verdicts concern only the three corrections, not renewed P7/P8/P9 acceptance or a broader audit.

## Scope and method

Read `D:\VTT\AGENTS.md` and the named interrupted-review artifacts: `invariants.json`, `custody-probe.json`, `import-negative.json`/`.log`, `focused-command.json`/`focused.log`, `evidence-check.json`, `layout-probe-v3.json`, `narrow-diffs.json`, and `start-focal-hashes.json`. Also inspected their relevant probe implementations, the six scoped current source/test files, local migration helper and host/CSS context, the three `sol/accepted-*` snapshots, and decoded scoped entries from `sol/starting-source.json`.

Fresh verification is captured in **`completion-check.cjs` and `completion-check.json`**. It:

1. Rehashes all 16 source/data/dependency entries in `start-focal-hashes.json` and checks that each current raw hash still matches.
2. Reconstructs the exact Feather Slash change from the starting packet; reconstructs the ActionBar import and PartyHUD class changes from the accepted copies; checks the accepted CSS remains an intact prefix followed by one rule and its comment.
3. Checks the starting Feather Slash copies against the decoded packet and verifies that the existing ActionBar repair, legacy test, PartyHUD class and CSS already existed byte-for-byte in the integration starting packet.
4. Re-executes the reviewed invariant, custody and provenance probes with unchanged probe source. A narrow `fs.writeFileSync` facade redirects each probe's one exclusive-create output to a **new** `completion-*` report artifact. Current production function bodies execute in the probes; source files are not rewritten.
5. Checks that its historical review inputs and focal source hashes are unchanged after execution.

This was independent review of the available evidence plus fresh bounded checks. The earlier independent Jest/layout runs are explicitly identified as saved runs below, not represented as newly launched runs in this session.

## Source identity

SHA-256 values are raw bytes unless a column explicitly says LF-normalized. The full 16-entry identity set and before/after evidence hashes are in `completion-check.json`.

Paths below are relative to `vtt-react/`.

| Scoped file | Current raw SHA-256 | Raw SHA-256 decoded from `starting-source.json` |
|---|---|---|
| `src/services/featherSlash.js` | `ad2b3134998a8585906bbb82a1ac3878dafecac92070a9ad81f659ed1812669a` | `1a4418f1a900b29f58efc79de091cfb59dd694d42110cecf087ef6a0e481b3ae` |
| `src/services/__tests__/featherSlash.test.js` | `43eaf32fb3a87bf38cda145e9c7afc29bfbfda4f83f53585f376abd1acc2bcb9` | `6f2b32cbc753181403688a3b53e69262e3d5194fd2c72c453c4d17e72ceaf1ed` |
| `src/components/ui/ActionBar.jsx` | `7a04ec3302561ae91cd495bddce4d5596235bd5b8c5916f58686b767f9000d33` | same as current |
| `src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx` | `98e8afbef304b1359da67d136ae2f38e43fc002846dcee247df500d5466dbb73` | same as current |
| `src/components/hud/PartyHUD.jsx` | `c5f2e9381c18fae3e68ec47f3f8bf2c02bca8e3be48ea72a8f6179e9e07db5d9` | same as current |
| `src/components/hud/SpellConsequencePanel.css` | `2f936ff2ff5bdc3f610c2c24c49015a1b935bd835a3f8f4e1dfeb2837682a68b` | same as current |

`ActionBar.jsx` current LF-normalized hash is `7585d93b5b7184cca6a7a210c8e8666c205cf39f57c8924edfd913db69b72c81`; its raw and LF hashes differ due to line endings. The other five scoped files have identical raw/LF hashes.

### Accepted baseline provenance

Fresh `completion-evidence-check.json` verifies the copied manifest against `review2/p9-identity-lf-sha256.txt` read directly from the accepted archive using `tar -xOf`; it also compares the three accepted copies with the original sealed packet's decoded entries.

| Accepted copy | Raw SHA-256 | Accepted LF-normalized SHA-256 |
|---|---|---|
| `sol/accepted-PartyHUD.jsx` | `22db5eccba547e4e1ad4196e93589d9ff491acd15db6c3f59ea8a3562f2679fd` | same |
| `sol/accepted-ActionBar.jsx` | `cab09fe14f154d71b7cdc11b318e6d33f70b4696cc8bb0feec723cefeea0b965` | `ded1292fe423aa9fd513e57aab7895f48e55a7f53819df9449bbc9df743db3fe` |
| `sol/accepted-SpellConsequencePanel.css` | `84c3693e9b78bd1c13557de355363c9560fcd33c2ec2bc3f8d7517aa6e04ac54` | same |

Additional provenance:

- `sol/starting-source.json`: `933ca5ec21454024f75f523881a0da7e3b4920a2e531176a7f3e8b25a09089e4`.
- Accepted independent archive `vtt-react/verification/p9/evidence/independent-review/independent-cycle1-and-cycle2.tar.gz`: `ca13d2191a6390aba2e286ea1d99ff2537e7de38e9e38fc7411ae887e781815f`.
- Copied/archived accepted manifest: `a5a75dc33f836c61023be634f92c81c0b72fec7676f54141201debb22e0a050c`.
- Accepted report `docs/MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md`: `d379b925bb4dcb811b103d6879df10e1be5ea0188dec9b4aa66c80207cb777a5`.

## 1. Feather Slash allowlist — PASS

### Source finding

`src/services/featherSlash.js:5–24` differs from the starting implementation only by the explanatory comment and replacement of the single-version equality with `['1.4.0', '1.5.0'].includes(DATA_VERSIONS.abilities)`. It does not accept a range, prefix, coerced number or future version.

`FEATHER_CAPABILITY` remains exactly `feather-slash:v1/abilities:1.4.0`. The executable shape checks, planner, payment, exact actor binding, GM adjudication and receipt reader bodies are otherwise unchanged. Execution still requires Grimmstalk and the complete reviewed nested shapes. The existing metadata policy for top-level name/description/level/icon/tags is unchanged; accepting changes to those fields predates this correction.

The fresh invariant probe re-read the hash-verified accepted P8 gzip packet at `D:/AppData/Temp/opencode/p8-20261014/independent/final-cycle2/accepted-source.json.gz`, SHA-256 `b53b919df7f944dfbe58a7ec380c46b0af99097b437ce7d21dd01a3c58e74a0c`. The decoded Grimmstalk ability group and creature record equal current content. Existing decoded ability groups/creatures are unchanged; the four recorded additions are unrelated entries. This is **decoded JSON content equality**, not whole-data-file byte identity.

### Verification

- Both reviewed versions support the unchanged shape and preserve the original plan and interpreted receipt.
- **28 execution mutations per version** are refused at support, planning and receipt-reading boundaries: identity/type/effects/priority, nested type/targeting/resource/cooldown/damage keys and values, and a new summon configuration.
- **11 unreviewed version values** are refused: `1.3.0`, `1.4.1`, `1.5.1`, `1.6.0`, `2.0.0`, `1.5`, `1.5.0-beta`, empty string, null, undefined and numeric `1.5`.
- Input/receipt objects remain unchanged. The probe's `originalPlanByteEquivalent` label is backed by deep object equality; the affected Jest test separately asserts serialized plan equality. Neither is described here as a whole-file binary comparison.
- Fresh custody re-execution preserves serialized unknown drafts and command bytes across the version switch and acceptance; refuses replacement while unresolved; prevents an unrelated receipt from replacing the retained unknown command; deduplicates repeated receipt notifications; refuses consumption at `1.6.0`; and respects owner generation/room isolation. Storage/auth/store dependencies are explicit in-memory seams, so this is not independent device-reload durability proof.

### Affected tests

`src/services/__tests__/featherSlash.test.js:17–47` covers both allowed versions, selected shape mutations, disallowed versions, retained draft/plan/receipt identity, tampered resource cost and refusal at `1.6.0`, with version restoration after each test. Existing resource/identity/GM checks remain in the file. The parameterized test at lines 22–26 says “receipt interpretation” in its title but only directly asserts support/planning; receipt refusal is asserted for `1.6.0` in the next test and for all 11 values by the independent probe. This is a minor test-description/coverage precision note, not a production failure.

## 2. ActionBar import and legacy test — PASS

The only normalized source difference from `accepted-ActionBar.jsx` is:

```js
import { migrateBlockId } from '../../utils/arcanoneerMigration';
```

The referenced helper exists as a named export at `src/utils/arcanoneerMigration.js:61`. `ActionBar.jsx:1789–1812` already calls it when collecting and matching legacy spheres. The import fixes the missing binding without changing routing or resource behavior.

The existing regression mounts ActionBar, opens the cast dialog and clicks Cast with an `arcane_sphere: 0` legacy key. That key deliberately reaches the non-bank branch and evaluates `migrateBlockId` even though its sphere count is zero. It asserts no window error and the actual local mana/AP update calls. The test is byte-identical to the integration starting packet; it was not added by this reviewer.

Saved independent positive run: 2026-10-15T18:50:18.063Z–18:50:25.720Z, exit **0**, seven suites/**87 tests passed**, including this regression. Its focal source hashes still match current bytes.

Saved independent negative control: 2026-10-15T18:52:09.385Z–18:52:22.910Z, exit **1 expected**, one suite/one test failed with **`ReferenceError: migrateBlockId is not defined`**. `without-import-transform.cjs` removes only the import in Jest's in-memory transform; source-before/source-after both equal `7a04ec3302561ae91cd495bddce4d5596235bd5b8c5916f58686b767f9000d33`. This is a discriminating reproducer rather than a test that passes irrespective of the import.

## 3. Host class and right-edge layout — INCOMPLETE

### Source/fixture findings that pass

- `PartyHUD.jsx:3678–3679`: the sole accepted-baseline change is `className="actor-consequence-layer"` on the existing direct child wrapping the same two controls. The controls' behavior and draggable member loop are unchanged.
- `SpellConsequencePanel.css:25–27`: the complete accepted stylesheet is preserved, followed by the dated comment and one direct-child rule: fixed position, top 84px/right 16px, z-index 2, width cap 420px, scrollable height cap `calc(100vh - 340px)` and existing panel palette.
- `party-hud.css:979–999`: the parent is fixed at the origin with `pointer-events: none` and z-index 1000; its direct children regain pointer events. The appended selector matches the new direct child and places it separately from the absolute draggable siblings. It does not require changing consequence logic.

Saved independent Playwright fixture command: `node .../independent-review/layout-probe.cjs`, cwd `D:\VTT`, 2026-10-15T18:53:42.921Z–18:53:44.750Z. `layout-probe-v3.json` reports **passed**, browser `155.0.8059.41`, four observations, zero page errors. Its source hashes still match current CSS. It loads both full source stylesheets and source-equivalent markup; it does **not** mount React/App/stores or submit a real consequence.

| Fixture viewport | Observed layer | Interpretation |
|---|---|---|
| 1365×900 | x929/y84, 420×421 | No default-frame overlap; attachment and GM controls hit-test successfully. |
| 1280×720 | x844/y84, 420×380 | No default-frame overlap; acceptance starts clipped, becomes reachable after scrolling. |
| 390×844 | x0/y84, 374×440 | Fits viewport but overlaps the fixture's party frame. |
| 844×390 | x408/y84, 420×50 | Scrollable strip only 50px high; acceptance reachable after scroll, not all controls visible together. |

All four observations record an actual fixture acceptance-button click and an outside canvas-control click. The accepted CSS baseline leaves the same host static at x0/y16 overlapping the fixture frame; this demonstrates the desktop positioning correction. Fixture clicks increment a local counter, not a production receipt.

### Missing current production-App witness

Inspected the specified latest **`sol/app-replay-7/result.json`**, SHA-256 **`91d05308a41c25cdeee7ec74b5d5c8aa01cfeb9f52834adc25dc08de9ced9040`**:

- Command: `node D:\VTT\vtt-react\verification\p9\integration\app-browser.cjs`.
- Started 2026-10-15T19:14:01.977Z; ended 2026-10-15T19:14:19.969Z.
- Build recorded: `build-final`; asset-manifest SHA-256 `4f3011ac2b71d108e8c162b8fa1f5393076e62ede1e09242d8a112db4516a61a`.
- P8 actual fan/adjudication witness exists: source AP 1, target HP 24/temp HP 0, receipt command `574b2ad0-a399-4c53-9d4e-2418eb9ed9dd`, live-only checkpoint revision null.
- **No `witnesses.P9` and no `passed: true`.** Failure is `AssertionError [ERR_ASSERTION]: approval never spends source pools` at `app-browser.cjs:96:12`.
- The failure accessibility snapshot does show the actual pending GM card and acceptance button. It does not prove pointer reachability or successful GM acceptance. The assertion compares a serialized entire character record; the result does not retain the actual before/after comparison values, so it does not establish which field changed or why.
- The replay records **two `Failed to fetch` page errors** and **23 deliberate network refusals** to Firebase installation/Firestore endpoints. Those counts must not be presented as zero runtime errors. Refused external services are a declared witness boundary, not by themselves a scoped correction defect.

Current witness source was inspected: the server serves the production build from disk, and the browser seeds principals/stores/exact actors via webpack runtime exports and uses real HUD/drop/owner/GM controls. Identity/provider verification, ownership/lease/cloud persistence are simulated boundaries; this is not live Firebase, rules, external provider, physical second-device or deployment evidence. I did not launch another App replay or diagnose/reopen P9.

**Reason for INCOMPLETE:** the supplied latest full-App run stops before the current GM click/receipt assertion. The independent static fixture plus passing component tests support the source/layout change, but cannot turn this failed supplemental run into end-to-end success. Earlier fixture-attempt failures were not accumulated as production defects or converted into passes.

### Residual source/layout limitations

1. **Responsive limitation:** the new rule has no viewport breakpoint; the saved fixture overlaps the party frame at 390px width, and the height formula leaves only 50px at 390px viewport height. Desktop default-frame non-overlap is supported; blanket mobile/landscape usability is not. The narrow fixture is not a complete production mobile layout witness.
2. **Empty offline host:** both child components return null outside shared rooms, but the wrapper remains styled. The fixture measures an empty 22×14px bordered/background box at x1327/y84 with pointer events enabled. This is a small residual presentation/pointer footprint from the unconditional rule, not a consequence-state mutation.
3. A fixed right edge is not guaranteed free of manually dragged party frames. The evidence establishes separation from default fixture frames, not all user-arranged overlays.

These findings do not establish an execution bug in the bounded CSS correction. They prevent a broader “all screen sizes/all placements verified” claim.

## Commands and evidence accounting

### Newly executed in this completion session

From `D:\VTT`:

```powershell
git status --short
if (Test-Path -LiteralPath "D:\VTT\vtt-react\verification\p9\evidence\integration-20261015\sol\independent-review") {
  node "vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/completion-check.cjs"
} else { throw 'Review output directory missing' }
```

- Status read succeeded and showed concurrent unrelated tracked changes plus integration fixture/evidence work. No cleanup was performed.
- First completion-run attempt exited **1** because my new report wrapper put its probe mode at the wrong argv index (`Choose start/end/invariants/tests`). It failed before any redirected probe output was written. I corrected only `completion-check.cjs` in this report directory.
- Second attempt exited **0**, 2026-10-15T19:17:44.470Z–19:17:45.929Z: exact-diff assertions, invariant/custody/provenance re-executions all passed; **sourceDrift `[]`**, historical input hashes unchanged.
- New outputs: `completion-check.json`, `completion-invariants.json`, `completion-custody-probe.json`, `completion-evidence-check.json`. The embedded probes use original probe bodies with output-only redirection; they were not run raw against existing `wx` logs.

### Saved independent Jest commands reviewed

Positive run, cwd `D:\VTT\vtt-react`:

```text
node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --testTimeout=20000 --runTestsByPath src/services/__tests__/featherSlash.test.js src/services/__tests__/spellConsequence.test.js src/components/grid/__tests__/CreatureAbilityFanOut.test.js src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx src/components/ui/__tests__/ActionBarP9Producer.test.jsx src/components/hud/__tests__/PartyHUD.test.jsx src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx
```

Result: exit 0; **7 suites, 87 tests passed**; no recorded focal drift. This independent run is separate from the implementer's earlier 7/87 run. Independent log SHA-256 `4408e0b1a267c655cea9fd70c33426878a43cf14f10ab087303552c86012b8b6`; command metadata SHA-256 `4b79790b7d782beb9d77c7450fa4eb3eb48037bb2473f4f43d89df6ec0afc8a4`.

Negative control uses the same Node/Jest entry with `--watchAll=false --runInBand --no-cache --testTimeout=20000 --runTestsByPath src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx` and the exact transform argument recorded in `import-negative.json`:

```json
{"^.+\\.(js|jsx|mjs|cjs|ts|tsx)$":"D:/VTT/vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/without-import-transform.cjs"}
```

Result: expected exit 1/missing `migrateBlockId`; negative log SHA-256 `155e39e1395e7f2338f02b6641dc506822c3d572c8c32acf58199d4492857365`.

### Implementer supplemental checks reviewed, not rerun

Fresh provenance re-execution confirms their command/log hashes, recorded exit status, no reported drift for these completed checks and no current focal hash mismatches:

| Command (cwd `vtt-react`) | Saved result |
|---|---|
| `node verification/p8/browser.cjs` | exit 0, 18:45:54–18:47:34Z; isolated P8 witness. |
| `node verification/p9/browser.cjs` | exit 0, 18:45:54–18:46:29Z; isolated P9 witness, not full-App run 7. |
| `node verification/p8/rejoin.cjs` | exit 0, 18:45:54–18:46:24Z. |
| `node verification/p7/lifecycle-browser.cjs` | exit 0, 17:25:20–17:26:15Z. |
| `node node_modules/@craco/craco/dist/bin/craco.js build` (`sol/build`) | exit 0, 17:25:20–17:27:58Z; drift `[]`; build-ready log. |
| `node node_modules/eslint/bin/eslint.js src/services/featherSlash.js src/services/__tests__/featherSlash.test.js src/components/ui/ActionBar.jsx src/components/hud/PartyHUD.jsx` | exit 0, 18:45:54–18:46:06Z; no focal mismatch. |

`sol/build-final/command.json` reports a later build exit **0**, 19:00:38–19:02:19Z, **with concurrent unrelated drift** in `classHeritageRegistry.js`, `classRacials.js`, `classes/wardenData.js`, `heritageEdgeContract.js` and `races/human.js`. It is not a no-drift current-source build seal.

At the fresh probe cutoff, `sol/build-current` contained `app/` and `output.log` but no `command.json` completion record. A final read found that it subsequently **completed**, 2026-10-15T19:15:03.148Z–19:18:03.380Z, exit **0**, signal null; `exit.json` agrees and the log reports the build directory ready. It also records unrelated concurrent drift in `src/components/world-map/InteractiveMapStudio.css` and `src/components/world-map/LoreSidebar.css`. This updates the pending observation in `completion-check.json`, rather than changing that historical artifact. It establishes a successful compilation, not whole-tree no-drift identity or a replacement P9 App witness. `completion-final-state.json` records this build metadata/hashes and verifies current focal identity against its recorded build inputs/outputs. No build was launched by this reviewer.

## Completion and custody statement

The required independent report now exists. The prior interruption is not the basis for any verdict. The current report contains two PASS decisions and one explicitly withheld INCOMPLETE integration decision with its concrete missing witness. Final report identity, current focal rehashes and historical-input checks are retained in `completion-final-state.json`, produced by `node vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/completion-seal.cjs` from `D:\VTT`.

Reviewer writes are limited to this directory's new report/check artifacts. No production source, accepted snapshots, original probe logs/results or historical acceptance evidence was edited; the fresh check verified its historical inputs unchanged. No reset, commit, push or deployment was performed. Concurrent unrelated work remains outside these verdicts.
