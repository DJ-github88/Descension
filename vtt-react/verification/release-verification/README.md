# Release Verification Tool (`verify-release.cjs`)

Single reusable verification command for checking a candidate Mythrill VTT app build against its matching server stage without rebuilding the fallback, modifying product source, or colliding on fixed ports/browser profiles.

## Command

```powershell
node D:\VTT\vtt-react\verification\release-verification\verify-release.cjs `
  --app <candidate-app-build-dir> `
  --server <matching-server-stage-root-or-server-dir> `
  --capability <player-journey[,dice-recast,channels,passives]|all> `
  --output <output-dir>
```

### Capabilities
- `player-journey` *(default)*: 17-step ordinary-player Spell Wizard authoring, export/import, private GM review, local editing, GM approval/decline, combat execution, reconnects, and privacy check (`vtt-react/verification/player-wizard-gm-review/accept-journey.cjs`).
- `dice-recast`: Physical/digital dice parity and installed recast without refresh (`handoff/dice-coin-playtest-candidate-20261122/journey/physical-dice-recast-journey.cjs`; optional `--dice-subcheck d100-coin|wound-surge|all`).
- `channels`: Player-authored channeled ally healing, tick resolution, max-HP cap, reconnects, out-of-range interruption, and zero-refresh recast (`handoff/channeled-ally-healing-isolated-20261122/journey/prove-channeled-ally-healing.cjs`; optional `--channel-subcheck arcane-beam-recast|arcane-beam-interruption|all`).
- `passives`: Passive own-turn boundary and movement-entry radius browser witnesses (`vtt-react/verification/passive-turn-boundary/verify-browser.cjs` + `vtt-react/verification/passive-movement-entry/verify-browser.cjs`).

## Guarantees
- **Preflight Identity & Stop-Before-Test:** Reuses `witness-preflight.cjs`, verifies `index.html`, `asset-manifest.json`, and build assets, checks required server stage files and `server/shared` sync parity, cross-checks `BUILD_IDENTITY.json` / `FINAL.sha256` when present, and validates protocol/source parity between the compiled app bundle and server stage. Missing files or mismatched app/server pairs stop at preflight (`ENVIRONMENT_FAILURE`) before launching any server or browser witness.
- **Isolation:** Forces ephemeral `127.0.0.1:0` ports and per-witness isolated temporary directories for Playwright browser profiles and redirected evidence artifacts, so fixed ports (`3000`, `3001`, `4180`) and existing handoff folders are never touched.
- **Distinct Failure Classification & Preserved Logs:** Distinguishes `ENVIRONMENT_FAILURE` from `GAMEPLAY_FAILURE` (reporting `firstPlayerVisibleFailure`), preserves full raw `logs/preflight.log` and `logs/<witness>.stdout.log` / `.stderr.log`, and writes `report.json` + `REPORT.md`.

## Tests

```powershell
node --test D:\VTT\vtt-react\verification\release-verification\verify-release.test.cjs
```
