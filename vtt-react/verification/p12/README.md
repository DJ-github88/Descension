# P12A verification

Frozen scope: `docs/MYTHRILL_PROJECT_12_CONTRACT.md` revision3a. Production test modules:
`server/tests/p12aWeaponStrike.production.test.js` and
`src/services/__tests__/weaponStrike.test.js`.

Run from `server`:

```powershell
npx mocha tests/p12aWeaponStrike.production.test.js tests/p9SpellConsequences.production.test.js tests/p7Consequences.production.test.js tests/p7Bounds.production.test.js tests/p7Lifecycle.production.test.js --reporter dot --exit
```

Run from `vtt-react` (no dependency installation required):

```powershell
$env:CI='true'
node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --testPathPattern='weaponStrike|weaponProficiency|p11WeaponRanks|p11SkillBudgetValidation|Step7P11|Step9P11|SkillsP11|CharacterWizardContext|Step7SkillsLanguages|spellConsequence|featherSlash|ActionBarP9|SpellActionBarP9|p7BoundsConsumers|firstTableLaws|FirstTableLawsRendered'
```

## Production build / App

Always launch builds detached under AGENTS.md. `snapshot-build.cjs` copies the current frontend,
public files and unmodified configuration into an **external** directory, junctions installed
dependencies, parses the copied source and performs one production compile. Its manifest identifies
the exact inputs, snapshot drift and later concurrent live drift. Environment configuration stays
only in the external workspace; it is never included in the hash manifest.

```powershell
$env:P12_BUILD_OUTPUT='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN'
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'node verification\p12\snapshot-build.cjs > D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN-launch.log 2>&1' -WorkingDirectory 'D:\VTT\vtt-react' -PassThru -WindowStyle Hidden
```

After `build.json` records exit0:

```powershell
$env:APP_BUILD_DIR='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN\build'
$env:P12_OUTPUT='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN\app'
node verification/p12/app-browser.cjs
$env:P12_OUTPUT='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN\stale-recovery'
node verification/p12/recovery-browser.cjs
$env:P12_OUTPUT='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN\p11-device-save'
node verification/p12/p11-save-reload.cjs
$env:APP_OUTPUT='D:\AppData\Temp\opencode\p12a-YOUR-UNIQUE-RUN\p8-p9-app'
node verification/p9/integration/app-browser.cjs
```

Browser witnesses use Chrome, the optimized App, real stores/services and registered Socket.IO
handlers. They run sequentially because the fixture serves port4180. Provider identity, canonical
owner documents, lease storage and cloud transport are external fixtures. Deliberately blocked
Firebase requests remain reported page errors. No production component is replaced or re-mounted.
Compiled-export aliases in `app-browser.cjs` identify the manifested build; if webpack export names
change, update only the test aliases after inspecting that build. Wizard fixture data enters through
the mounted production reducer, not a replacement provider. `P11_ONLY=1` limits the main witness to
P11 App closure when troubleshooting that part. All bulk output must stay outside Git.

`defense_data_audit.py` is the retained read-only preparation audit, not a rule authority.

## P12B-thin (frozen contract revision 4 §3)

Production tests: `server/tests/p12bBlockWear.production.test.js`; client
`src/services/__tests__/blockingCustody.test.js`, `equipmentBlocking.test.js`,
`src/store/__tests__/itemStoreBreakPath.test.js`, `blockingCustodyPersistence.test.js`.

```powershell
# server
npx mocha tests/p12bBlockWear.production.test.js tests/p12aWeaponStrike.production.test.js tests/p9SpellConsequences.production.test.js tests/p7Consequences.production.test.js tests/p7Bounds.production.test.js tests/p7Lifecycle.production.test.js --reporter dot --exit
# vtt-react
$env:CI='true'
node node_modules/react-scripts/bin/react-scripts.js test --watchAll=false --runInBand --silent --testPathPattern='blockingCustody|equipmentBlocking|itemStoreBreakPath'
```

App witness (after a production build; output outside Git):

```powershell
$env:APP_BUILD_DIR='D:\AppData\Temp\opencode\p12b-YOUR-RUN\build'
$env:P12B_OUTPUT='D:\AppData\Temp\opencode\p12b-YOUR-RUN\app'
node verification/p12/p12b-app-browser.cjs
```

`CHROMIUM_PATH` selects a local Chromium instead of the Chrome channel. In a sandbox without access to
external font/CDN hosts, preload a boundary that fulfils those requests empty; the 2026-10-16 run's
preload is retained with the evidence, never in Git.
