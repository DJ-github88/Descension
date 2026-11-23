# Mythrill Release Preflight (`tools/release-preflight/`)

One read-only command that tells the release owner whether a proposed Mythrill release matches its reviewed source, build, and gameplay evidence without modifying source files, builds, or acceptance records.

## Command

Run from `D:\VTT` (requires Node `>=20` and `tar` on `PATH` when passing `.tgz` archives):

```powershell
node tools/release-preflight/release-preflight.cjs `
  --packet <packet-dir> [--packet <packet-dir> ...] `
  --source <dir-or-tgz> `
  [--capture <tgz>] `
  [--build-identity <json>] `
  [--build-dir <dir>] `
  [--witness <json> ...] `
  [--require-gameplay <spec> ...] `
  [--repo-root <dir>] `
  [--skip-composition-gate] `
  [--json] `
  [--help]
```

### Options

- `--packet <dir>` (required, repeatable): Reviewed packet directory (e.g. `handoff/direct-damage-save-combined-20261117` or `handoff/hunter-flow-isolated-20261117`).
- `--source <dir-or-tgz>` (required): Supplied source tree directory or `.tgz`/`.tar.gz` capture archive. Archives are extracted read-only to a temporary directory and cleaned up on exit; directory sources are staged in a separate temp directory when running the composition gate so `--source` is never written to.
- `--capture <tgz>`: Optional capture archive when `--source` is a directory, verifying directory-to-capture equivalence against `BUILD_IDENTITY.json`.
- `--build-identity <json>`: Explicit `BUILD_IDENTITY.json` path (auto-discovered when exactly one supplied `--packet` contains it).
- `--build-dir <dir>`: Compiled build directory (`index.html`, `asset-manifest.json`, `static/...`) to verify on disk. When omitted, falls back to `isolatedBuildOutput` if recorded by `BUILD_IDENTITY.json`.
- `--witness <json>` (repeatable): Additional witness JSON files alongside auto-discovered `<packet>/app-verified/` final witness results (`result.json`, `app-witness-result.json`, `*-journey.json`). Auxiliary `progress.json` and `scenarios.json` files are reported separately and never treated as passing evidence.
- `--require-gameplay <spec>` (repeatable): Named gameplay requirement matched strictly against mechanic-specific structural witness proofs (`direct-save`, `component-trigger`, `spellbook-registration`, or bare `cast`/`actual-cast`). A witness for an unrelated mechanic (such as `component-trigger` when `direct-save:cast` is required) leaves the requirement `UNVERIFIED`. Startup, bundle string checks, and unit tests cannot satisfy a named requirement.
- `--repo-root <dir>`: Repository root for locating `server/tests/helpers/runCompositionGate.cjs` and resolving `isolatedBuildOutput` (defaults to `D:\VTT`).
- `--skip-composition-gate`: Skip `runCompositionGate.cjs`; marks Source Verification as `UNVERIFIED` (exit `2` if nothing else fails).
- `--json`: Print machine-readable JSON instead of the text report.

### Exit Codes & Separate Pillar Reporting

Source Verification, Build Verification, and Gameplay Evidence are always evaluated and reported independently using three states: `PASS`, `FAIL`, `UNVERIFIED`.

- `0` (`PASS`): all three pillars are `PASS`.
- `1` (`FAIL`): at least one pillar is `FAIL` (hash/deletion mismatch, manifest conflict, failed check, wrong build, failed witness, startup-only gameplay, or a gameplay requirement whose matching witness failed or has a wrong build).
- `2` (`UNVERIFIED`): zero `FAIL`s, at least one missing link or skipped gate (`BUILD_IDENTITY.json` missing, `capture.sha256` missing, directory `--source` without `--capture`, `--skip-composition-gate`, or a named gameplay requirement lacking a witness for that specific mechanic).

### Existing Checks Reused

- `server/tests/helpers/runCompositionGate.cjs` (`runCompositionGate({ stageRoot })` with `compositionStageGuard.cjs` isolation).
- `<source>/server/scripts/sync-shared.js --check` (client/server shared mirror verification inside the supplied source tree).
- Read-only `asset-manifest.json` / `index.html` / `mainJs` / `mainCss` integrity checks matching `vtt-react/verification/witness-preflight.cjs` invariants (replicated read-only rather than calling `witness-preflight.cjs::run()`, which writes a temporary `.tmp` probe and does not export `checkBuild`).

---

## Demonstrated Cases (Actual Outputs)

### 1. Valid Case (`direct-damage-save-combined-20261117` + `postinstall.tgz`, exit `0`)

```powershell
node tools/release-preflight/release-preflight.cjs `
  --packet handoff/direct-damage-save-combined-20261117 `
  --source scratch/direct-save-capture-20261116/postinstall.tgz `
  --require-gameplay direct-save:cast `
  --require-gameplay spellbook-registration `
  --require-gameplay component-trigger:cast
```

```text
MYTHRILL RELEASE PREFLIGHT (READ-ONLY)
Overall : PASS (exit 0)
Packets : handoff/direct-damage-save-combined-20261117
Source  : scratch/direct-save-capture-20261116/postinstall.tgz (archive, sha256=bbf6d8af73d4c73061bebf967a3141c8498224d9dce44d9d934521e1a53b861d)

[1/3] SOURCE VERIFICATION: PASS
  Final hashes       : 31/31 matched (expected deletions ABSENT: 1/1)
  Pinned dependencies: 10/10 matched
  Review             : [PASS] handoff/direct-damage-save-combined-20261117 — REVIEW.md records Verdict: ACCEPT
  INSTALLED.json     : handoff/direct-damage-save-combined-20261117 [PASS] (matches FINAL.sha256)
  sync-shared --check: [PASS] server/shared is up to date
  Composition gate   : [PASS] 20 passing, 0 failing, 2 optional/pending

[2/3] BUILD VERIFICATION: PASS
  BUILD_IDENTITY.json: handoff/direct-damage-save-combined-20261117/BUILD_IDENTITY.json (kind=direct-damage-save-combined-build-identity)
  Source capture link: [PASS] Supplied capture archive SHA-256 matches BUILD_IDENTITY.json capture.sha256
  Embedded final map : [PASS] All 31 embedded final entries match packet FINAL.sha256 and supplied source
  Build dir on disk  : [NOT_CHECKED_ON_DISK] (none) — NOT checked on disk (no --build-dir supplied and no isolatedBuildOutput); recorded BUILD_IDENTITY.json links verified only
      unchecked recorded artifacts: index.html, asset-manifest.json, static/js/main.b9217462.js, static/css/main.8293f898.css
  Witness build links: [PASS] 3/3 completed witness(es) match BUILD_IDENTITY.json

[3/3] GAMEPLAY EVIDENCE: PASS
  Summary: 3 witness(es) — gameplay-cast=2, gameplay-workflow=1, startup-and-bundle-only=0, insufficient=0, failed=0
  - handoff/direct-damage-save-combined-20261117/app-verified/component-trigger/result.json: class=gameplay-cast, mechanics=[component-trigger], passed=true, steps=15, casts=5, buildLink=PASS
  - handoff/direct-damage-save-combined-20261117/app-verified/direct-save/result.json: class=gameplay-cast, mechanics=[direct-save], passed=true, steps=8, casts=4, buildLink=PASS
  - handoff/direct-damage-save-combined-20261117/app-verified/spellbook-registration/app-witness-result.json: class=gameplay-workflow, mechanics=[spellbook-registration], passed=true, steps=9, casts=0, buildLink=PASS
  Auxiliary non-final files (not counted as gameplay evidence): handoff/direct-damage-save-combined-20261117/app-verified/component-trigger/progress.json (intermediate-progress), handoff/direct-damage-save-combined-20261117/app-verified/component-trigger/scenarios.json (auxiliary-scenarios), handoff/direct-damage-save-combined-20261117/app-verified/component-trigger-run1-harness-timeout/progress.json (intermediate-progress)
  Named gameplay requirements:
    - [PASS] direct-save:cast: Satisfied by handoff/direct-damage-save-combined-20261117/app-verified/direct-save/result.json (gameplay-cast, mechanics=[direct-save]) (build-linked)
    - [PASS] spellbook-registration: Satisfied by handoff/direct-damage-save-combined-20261117/app-verified/spellbook-registration/app-witness-result.json (gameplay-workflow, mechanics=[spellbook-registration]) (build-linked)
    - [PASS] component-trigger:cast: Satisfied by handoff/direct-damage-save-combined-20261117/app-verified/component-trigger/result.json (gameplay-cast, mechanics=[component-trigger]) (build-linked)

DISCLOSED LIMITS:
  - Read-only preflight: performs no live edits, builds, Playwright runs, re-pinning, or deployment.
  - No --build-dir was supplied and BUILD_IDENTITY.json has no isolatedBuildOutput; compiled bundle files on disk were not re-hashed.
```

### 2. Missing Mechanic Witness (`direct-save/result.json` removed, `component-trigger/result.json` kept, exit `2`)

When `app-verified/direct-save/result.json` is absent from a temporary copy of `handoff/direct-damage-save-combined-20261117`, `component-trigger` evidence cannot satisfy `direct-save:cast`:

```text
MYTHRILL RELEASE PREFLIGHT (READ-ONLY)
Overall : UNVERIFIED (exit 2)
...
[1/3] SOURCE VERIFICATION: PASS
...
[2/3] BUILD VERIFICATION: PASS
...
[3/3] GAMEPLAY EVIDENCE: UNVERIFIED
  Summary: 2 witness(es) — gameplay-cast=1, gameplay-workflow=1, startup-and-bundle-only=0, insufficient=0, failed=0
  - <packet-copy>/app-verified/component-trigger/result.json: class=gameplay-cast, mechanics=[component-trigger], passed=true, steps=15, casts=5, buildLink=PASS
  - <packet-copy>/app-verified/spellbook-registration/app-witness-result.json: class=gameplay-workflow, mechanics=[spellbook-registration], passed=true, steps=9, casts=0, buildLink=PASS
  ...
  Named gameplay requirements:
    - [UNVERIFIED] direct-save:cast: No build-linked gameplay-cast witness proves mechanic "direct-save" (present witnesses only cover: component-trigger, spellbook-registration); requirement stays unverified
    - [PASS] component-trigger:cast: Satisfied by <packet-copy>/app-verified/component-trigger/result.json (gameplay-cast, mechanics=[component-trigger]) (build-linked)
    - [PASS] spellbook-registration: Satisfied by <packet-copy>/app-verified/spellbook-registration/app-witness-result.json (gameplay-workflow, mechanics=[spellbook-registration]) (build-linked)
```

### 3. Changed Dependency (`triggerOfferService.js` drifted in supplied directory, exit `1`)

```powershell
node tools/release-preflight/release-preflight.cjs `
  --packet handoff/direct-damage-save-combined-20261117 `
  --source <staged-source-dir> `
  --capture scratch/direct-save-capture-20261116/postinstall.tgz `
  --require-gameplay direct-save:cast
```

```text
[1/3] SOURCE VERIFICATION: FAIL
  Pinned dependencies: 9/10 matched
  Source mismatches (1):
    - [hash-mismatch] vtt-react/src/services/triggerOfferService.js (role: dependency, packet: handoff/direct-damage-save-combined-20261117, manifest: DEPENDENCIES.sha256)
        expected: 0ecef08082d50b769f9d3efdc5edf7950eda1408a48ec9806282913824c5519e
        observed: a9aa658791f40f23c3e3c711492ebcd085d4b0176bdba4b9e75b2a97dd396b7f

[2/3] BUILD VERIFICATION: FAIL
  Source capture link: [FAIL] Supplied source directory diverges from verified capture archive (1 file diff(s))
      expected: bbf6d8af73d4c73061bebf967a3141c8498224d9dce44d9d934521e1a53b861d
      observed: 1 file difference(s) vs capture
      diff (content-differs-from-capture): vtt-react/src/services/triggerOfferService.js (expected=0ecef08082d50b769f9d3efdc5edf7950eda1408a48ec9806282913824c5519e, observed=a9aa658791f40f23c3e3c711492ebcd085d4b0176bdba4b9e75b2a97dd396b7f)

[3/3] GAMEPLAY EVIDENCE: PASS
```

### 4. Wrong Build (Hunter `build-out` supplied for `direct-damage-save-combined-20261117`, exit `1`)

```powershell
node tools/release-preflight/release-preflight.cjs `
  --packet handoff/direct-damage-save-combined-20261117 `
  --source scratch/direct-save-capture-20261116/postinstall.tgz `
  --build-dir handoff/hunter-flow-isolated-20261117/build-out `
  --require-gameplay direct-save:cast
```

```text
[1/3] SOURCE VERIFICATION: PASS
...
[2/3] BUILD VERIFICATION: FAIL
  BUILD_IDENTITY.json: handoff/direct-damage-save-combined-20261117/BUILD_IDENTITY.json (kind=direct-damage-save-combined-build-identity)
  Source capture link: [PASS] Supplied capture archive SHA-256 matches BUILD_IDENTITY.json capture.sha256
  Embedded final map : [PASS] All 31 embedded final entries match packet FINAL.sha256 and supplied source
  Build dir on disk  : [FAIL] handoff/hunter-flow-isolated-20261117/build-out (via cli) — Checked on disk (handoff/hunter-flow-isolated-20261117/build-out): 0 core artifact(s) verified, 2 missing on disk, 4 hash/path mismatch(es)
      - [missing-artifact] mainJs (static/js/main.b9217462.js): expected=50c8fdccfe0fcb8426ed92df778be74162eb6d1edcc607d48c051bdbb5e7ca7a, observed=ABSENT
      - [missing-artifact] mainCss (static/css/main.8293f898.css): expected=19a4196571929c2b5896742a110461302ed6a9abd9f29e556abccaf900f2202d, observed=ABSENT
      - [hash-mismatch] index.html: expected=22dfe90e70a15e10603798a3036e21343b19ae82c1373b2dd0c8e5ee79d3790e, observed=e8c13895f68d7f44278389d9e81d06b92d777aaa6b0948c0f711c83ce615ed11
      - [hash-mismatch] asset-manifest.json: expected=355d8675eda5b925033eb74da9cdb9cd3685a036058dfaa377d6718c869ed6e8, observed=8e484a3c83edda2d6c3d63e063acdf8192140580385ae34ad37c8452de2346ec
      - [path-mismatch] mainJs.path: expected=static/js/main.b9217462.js, observed=static/js/main.89fcbdf3.js
      - [path-mismatch] mainCss.path: expected=static/css/main.8293f898.css, observed=static/css/main.431c6a86.css
  Witness build links: [PASS] 3/3 completed witness(es) match BUILD_IDENTITY.json

[3/3] GAMEPLAY EVIDENCE: PASS
```

### 5. Hunter r2 Startup-Only Evidence (exit `1`)

```powershell
node tools/release-preflight/release-preflight.cjs `
  --packet handoff/hunter-flow-isolated-20261117 `
  --source scratch/direct-save-capture-20261116/live-r2.tgz `
  --require-gameplay quick-draw:cast
```

```text
MYTHRILL RELEASE PREFLIGHT (READ-ONLY)
Overall : FAIL (exit 1)
Packets : handoff/hunter-flow-isolated-20261117
Source  : scratch/direct-save-capture-20261116/live-r2.tgz (archive, sha256=0c47905ce09bb4ff43071ddd3275d22ddbfbca033376aa3b7a39ef587426c9dc)

[1/3] SOURCE VERIFICATION: FAIL
  Final hashes       : 22/22 matched (expected deletions ABSENT: 0/0)
  Pinned dependencies: 0/1 matched
  Review             : [PASS] handoff/hunter-flow-isolated-20261117 — REVIEW.md records Verdict: ACCEPT
  INSTALLED.json     : handoff/hunter-flow-isolated-20261117 [PASS] (matches FINAL.sha256)
  sync-shared --check: [PASS] server/shared is up to date
  Composition gate   : [PASS] 20 passing, 0 failing, 2 optional/pending
  Source mismatches (1):
    - [hash-mismatch] vtt-react/src/services/triggerOfferService.js (role: dependency, packet: handoff/hunter-flow-isolated-20261117, manifest: BUILD_IDENTITY.json:triggerOfferServicePinnedReleased)
        expected: 0ecef08082d50b769f9d3efdc5edf7950eda1408a48ec9806282913824c5519e
        observed: a9aa658791f40f23c3e3c711492ebcd085d4b0176bdba4b9e75b2a97dd396b7f

[2/3] BUILD VERIFICATION: UNVERIFIED
  BUILD_IDENTITY.json: handoff/hunter-flow-isolated-20261117/BUILD_IDENTITY.json (kind=hunter-flow-slice-1-build-identity)
  Source capture link: [UNVERIFIED] BUILD_IDENTITY.json has no source capture hash (capture.sha256 missing); cannot prove recorded build came from supplied source
  Embedded final map : [UNVERIFIED] BUILD_IDENTITY.json omits per-file final hash map; boolean flags like equalsInstalledFinalComposition are not cryptographically verifiable
  Build dir on disk  : [PASS] handoff/hunter-flow-isolated-20261117/build-out (via isolatedBuildOutput) — Checked on disk: 4 core artifact(s) + 184 manifest asset(s) verified (0 missing, 0 mismatched)
      verified on disk: index.html, asset-manifest.json, mainJs (static/js/main.89fcbdf3.js), mainCss (static/css/main.431c6a86.css)
  Witness build links: [PASS] 1/1 completed witness(es) match BUILD_IDENTITY.json

[3/3] GAMEPLAY EVIDENCE: FAIL
  Summary: 1 witness(es) — gameplay-cast=0, gameplay-workflow=0, startup-and-bundle-only=1, insufficient=0, failed=0
  - handoff/hunter-flow-isolated-20261117/app-verified/hunter-flow-journey.json: class=startup-and-bundle-only, mechanics=[none], passed=absent, steps=0, casts=0, buildLink=PASS, nonGameplay=[enteredApp=true, rootHtmlLen=4452, bundleAssertions(hasAuthoredHunterFlowV1,hasQuickDrawId,hasHunterFlowHudControls)]
  Named gameplay requirements:
    - [FAIL] quick-draw:cast: No verified gameplay witness satisfies "quick-draw:cast"; only startup/bundle-only evidence found (handoff/hunter-flow-isolated-20261117/app-verified/hunter-flow-journey.json) — startup, bundle strings, and unit tests cannot satisfy a named gameplay requirement
```

---

## Limits

- **Format scope:** Supports only the manifest, `BUILD_IDENTITY.json`, and App witness formats used by `handoff/direct-damage-save-combined-20261117` and `handoff/hunter-flow-isolated-20261117` (Hunter r2); fails closed on unknown `BUILD_IDENTITY.json` `kind`s or malformed manifests.
- **Strictly read-only:** Performs no builds, no Playwright browser runs, no live edits, no automatic re-pinning, and no deployment.
- **On-disk bundle verification:** When `--build-dir` is omitted and `BUILD_IDENTITY.json` has no `isolatedBuildOutput` (such as `direct-damage-save-combined-20261117`, built in a separate Linux container), compiled bundle bytes on disk are not re-hashed (reported explicitly as `[NOT_CHECKED_ON_DISK]` with the unchecked artifact paths listed); only the recorded `BUILD_IDENTITY.json` <-> source capture <-> witness manifest hashes are checked.
- **No build reproducibility proof:** Does not re-compile source into a bundle or prove deterministic Webpack output beyond checking recorded capture and artifact hashes.
- **Archive tooling:** Requires `tar` on `PATH` when `--source` or `--capture` is a `.tgz` / `.tar.gz` archive.

## Tests

```powershell
node --test tools/release-preflight/release-preflight.test.cjs
```
