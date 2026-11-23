# Player Wizard + Private GM Review Acceptance Journey

Reusable acceptance test runner for the combined player authoring, local library export/import, private Player -> GM review, and room execution release.

## Files
- `room-host.cjs` — Production socket stack host (`productionStackServer` + real `actorConsequences`, `spellPayments`, `installedDefinitionRegistry`, and `authoredReviewRequests` when present) serving an already-built `APP_BUILD_DIR` over HTTP.
- `accept-journey.cjs` — Three-browser Playwright acceptance journey (`acct-gm`, `acct-player-a`, `acct-player-b`) executing all 17 steps through the normal UI.

## Two Unseen Test Recipes
1. **`Cinder Glass`** — Immediate `Ember` damage (`2d6+1`), Single Target Ranged `30 ft`, `1 AP`, explicit **`0 mana`**. Player B later edits local copy to `4d6+2` / `4 mana`.
2. **`Glacier Snare`** — Immediate `Rime` damage (`1d8+2`) + timed movement rider **`Permafrost Drag`** (`-15 ft`, `target-next-end`), Single Target Ranged `30 ft`, `1 AP`, `2 mana`. Player B later edits local copy to `3d8+2` / `Permafrost Drag -25 ft` / `5 mana`.

## Launch Commands (PowerShell)

### Known Baseline (`arcane-beam-release-composition-20261121`)
```powershell
$env:STAGE_ROOT='D:\VTT'; $env:APP_BUILD_DIR='D:\VTT\handoff\arcane-beam-release-composition-20261121\build-out'; $env:EVIDENCE_DIR='D:\VTT\handoff\player-wizard-gm-review-acceptance-20261122\evidence-baseline'; $env:VERDICT_LABEL='known-baseline'; node D:\VTT\vtt-react\verification\player-wizard-gm-review\accept-journey.cjs
```

### Partial Player-Wizard Preflight Probe (`player-spell-wizard-isolated-20261121`)
```powershell
$env:STAGE_ROOT='D:\AppData\Temp\opencode\player-spell-wizard-isolated-20261121\root'; $env:APP_BUILD_DIR='D:\AppData\Temp\opencode\player-spell-wizard-isolated-20261121\build-patched\app'; $env:EVIDENCE_DIR='D:\VTT\handoff\player-wizard-gm-review-acceptance-20261122\evidence-probe-player-wizard'; $env:VERDICT_LABEL='partial-player-wizard-probe'; node D:\VTT\vtt-react\verification\player-wizard-gm-review\accept-journey.cjs
```

### Release Candidate Verdict (point `STAGE_ROOT` and `APP_BUILD_DIR` at the exact candidate)
```powershell
$env:STAGE_ROOT='<CANDIDATE_STAGE_ROOT>'; $env:APP_BUILD_DIR='<CANDIDATE_BUILD_DIR>'; $env:EVIDENCE_DIR='D:\VTT\handoff\player-wizard-gm-review-acceptance-20261122\evidence-candidate'; $env:VERDICT_LABEL='opus-1-candidate'; node D:\VTT\vtt-react\verification\player-wizard-gm-review\accept-journey.cjs
```

## Disclosed Fixture Limits
- Room bootstrap, user authentication (`authStore.setUser` + test auth tokens), character sheet loading, and actor bindings are seeded via fixtures in `room-host.cjs` and `connectClient` (with Firebase network endpoints stubbed).
- Deterministic physical dice faces are typed into the normal `Supported spell cast` dialog (`d6 face 1/2`, `d8 face 1`).
- Every player and GM workflow action under test (Wizard authoring, saving, Library Export/Import, dragging to action bar, Request GM review, local editing, GM approval/decline, combat start/turn advance/end, casting, GM adjudication, and reconnects) runs through the normal UI and production socket stack.
