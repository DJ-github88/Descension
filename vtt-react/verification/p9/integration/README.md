# Bounded P8/P9 integration witnesses

Authority and final verdict: `docs/MYTHRILL_P9_INTEGRATION_FOLLOWTHROUGH_20261015.md`.
Historical P7/P8/P9 runners, reports and manifests are read-only inputs.

Evidence: `verification/p9/evidence/integration-20261015/sol/`.

- `identity.cjs before|<new-label>` inventories checkout bytes and preserves the
  starting focal source. The before recovery also verifies accepted raw definitions
  and historical P9 source. Existing evidence is never replaced.
- `run.cjs focused|lint|p8|p9|rejoin|lifecycle|build|build-final|build-current`
  captures exact command/exit/before-after identity. Outputs use exclusive creation;
  use fresh output directories for another session.
- `snapshot-build.cjs` copies current frontend src/public/config to a fresh
  `D:/AppData/Temp/opencode/` workspace, reuses installed dependencies by junction,
  archives source/config/data plus hashes, and builds the unmodified production
  configuration into `sol/build-snapshot/app`. `.env*` stays temporary and unarchived.
- **Builds must run detached**, e.g. from the repo root:

  ```powershell
  Test-Path -LiteralPath "D:\AppData\Temp\opencode"
  Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList 'D:\VTT\vtt-react\verification\p9\integration\snapshot-build.cjs' -WorkingDirectory "D:\VTT" -PassThru -WindowStyle Hidden
  ```

  Read the resulting `exit.json`/`command.json`; never infer completion from launch.
- `app-browser.cjs` starts a temporary registered backend and HTTP server, loads the
  intact optimized App, seeds fixture principals/exact room attachments through
  existing webpack exports, and uses real P8/P9 UI controls. Run from `vtt-react`
  with `APP_BUILD=build-snapshot` and a fresh `APP_RUN` evidence folder. It records
  accessibility snapshots, real receipts, hit testing and deliberate cloud refusals.
  Provider/ownership/lease/cloud seams are simulated. This is not live-backend,
  physical-device, OS drag-gesture or deployment proof. On completion it closes its
  browsers and servers.
- `seal.cjs` checks focal identities and preservation, retaining original/concurrent
  copies of the two already identified P7 generated-evidence changes. It is a
  session-specific seal, not a general restore command.
- `artifacts.cjs` records final report/witness/evidence identities.

Independent reports/checks are in `sol/independent-review/`. Earlier INCOMPLETE
reports and failed witness attempts remain historical evidence; the final snapshot
addendum is the completed bounded verdict. A later live hook edit is outside that
frozen verdict. Do not run retained P7 server suites here: they overwrite old
evidence JSON and require a disposable mirror.
