# P10 integration verification

Scope/verdict: `docs/MYTHRILL_P10_INTEGRATION_20261016.md`. Relevant source/build/results identity: `integration-identity.json`.

Outputs default to `D:/AppData/Temp/opencode/p10-integration-20261016`; use a fresh `P10_OUTPUT` for replay. No builds, copied assets or browser dumps are published in this directory.

From `D:/VTT/vtt-react`:

```powershell
$env:P10_OUTPUT='D:\AppData\Temp\opencode\p10-integration-20261016'
node verification/p10/run.cjs tests
node verification/p10/run.cjs lint
node verification/p10/lint-baseline.cjs
```

`run.cjs` selects the implementation report's affected test families, records exact expanded command and relevant before/after hashes. Raw lint returns the actual exit code; baseline comparison identifies incumbent versus added diagnostics without changing rules or files.

Build detached only, after checking the output parent exists:

```powershell
Test-Path -LiteralPath "D:\AppData\Temp\opencode\p10-integration-20261016"
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList 'D:\VTT\vtt-react\verification\p10\run.cjs','build' -WorkingDirectory "D:\VTT\vtt-react" -PassThru -WindowStyle Hidden
```

Poll/read external `build.json` and `build.log`. It runs the existing CRACO production config directly against current frontend inputs with external `BUILD_PATH`; no source mirror or snapshot tree.

```powershell
$env:APP_BUILD_DIR='D:\AppData\Temp\opencode\p10-integration-20261016\build'
$env:APP_OUTPUT='D:\AppData\Temp\opencode\p10-integration-20261016\app-smoke'
node verification/p9/integration/app-browser.cjs
$env:P10_BROWSER_RUN='laws-browser-5'
node verification/p10/laws-browser.cjs
node verification/p10/final-check.cjs
```

The Laws runner normally owns/closes the existing fixture server. `P10_URL=http://127.0.0.1:4180` uses an already-running server instead. The recorded run used that option while Playwright MCP inspected the same build. Use a fresh browser-run directory; earlier failed witness attempts remain external. `P10_BROWSER_RESULT` selects a different result path for `final-check.cjs`.

The final check requires the inspected bundle/extracted `p10.diff` and `starting-identity.json` in the evidence root. It verifies all relevant built input hashes, reverse-checks the reviewed diff, checks the retained original review bytes, and publishes a small generated identity/result record. It deliberately does not inventory assets. On another baseline, replace this session's original-input verification with the new integration's inspected inputs.

Browser proof: actual optimized App/router/CSS/IndexedDB and UI controls; actor/principal/provider/cloud seams use the established bounded fixture. Cloud refusals/page errors are recorded. This is not live Firebase, deployed restart, physical-table or second-device proof.
