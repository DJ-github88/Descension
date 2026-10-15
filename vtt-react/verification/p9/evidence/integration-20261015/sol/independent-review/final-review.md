# Independent review addendum — 2026-10-15, production-App run 8

**Verdict: PASS within the bounded desktop integration scope. The prior CSS evidence gap is closed.**

- **task_id:** `independent-integration-review-20261015-run8-addendum` (local review identifier)
- **Repository:** `D:\VTT`
- **Role:** independent reviewer; no implementation changes made.
- **Earlier report preserved:** `review.md`, SHA-256 `73041ec53cc44f8dc0acbe6ac8e9ea6143bc1c48e67db6c24597b393a3dccd71`.
- **New evidence:** `sol/app-replay-8/`, the corrected witness source, actual `build-current` manifest/CSS, and fresh `run8-addendum-check.json`.

This addendum updates the earlier INCOMPLETE verdict based on newly completed evidence; it does not alter the earlier report or convert failed attempts into passes.

## Updated bounded verdicts

| Correction | Current verdict | Basis |
|---|---|---|
| Feather Slash explicit dataset allowlist and affected tests | **PASS, retained** | All prior focal bytes unchanged; earlier independent invariant/custody/test findings continue to apply. |
| Existing ActionBar migration import and legacy regression | **PASS, retained** | Source/test bytes unchanged; earlier positive and import-removal negative controls continue to apply. |
| PartyHUD host class and appended right-edge CSS | **PASS — bounded desktop** | Actual production-App GM acceptance control hit-tests successfully, receives a normal Playwright pointer click, and reaches matching accepted receipt/server/owner outcomes. Desktop host positions are retained at 1440 and 1024 widths. |

There is no remaining scoped BLOCK or INCOMPLETE item from the earlier report. This is not a new broad P9 audit, all-viewports certification, cloud durability acceptance, or acceptance of a future snapshot replay.

## 1. Independently inspected run 8

`sol/app-replay-8/result.json`:

- SHA-256: **`8c08a6889d10053f8ec3a9921af1745a5fca2706c54e4dbee9c68f2a8982a3f1`**.
- Recorded command: `node D:\VTT\vtt-react\verification\p9\integration\app-browser.cjs`.
- Started **2026-10-15T19:23:18.807Z**, ended **19:23:44.410Z**.
- `passed: true`, no `failure`, both `witnesses.P8` and `witnesses.P9` present.
- Build: **`build-current`**; manifest SHA-256 **`bbb9bd30ce56dd1b8ba27d6d4a8be3f29acd17cdabc5667427e5e7994a5087bb`**, independently matched against the manifest on disk.

### Actual interaction and outcome

The witness serves the production build from disk. Its webpack runtime access is used for fixture principals, stores, exact actors, room connection and handler setup. The reviewed P8/P9 interaction sequence does not call the cast/adjudication functions directly to bypass their controls.

1. **P8:** token hover → actual Feather Slash fan click → adjudication dialog → recorded physical faces `[3,5]` → GM ruling of 10 → confirmation → accepted receipt. Receipt command ID **`894c934f-1794-4948-9681-0f94c02b2b33`**; source AP **1**, target HP **24**, target temporary HP **0**. The original `feather-slash:v1/abilities:1.4.0` capability remains in the receipt.
2. **P9:** explicit external drop payload on the actual HUD action slot → actual slot click → owner dialog → physical face **6**, interpreted total **10** → owner price approval → pending GM card → GM adjudication checkbox, final **7**, reason **GM mitigation** → actual acceptance-button pointer click → owner and GM accepted states.
3. The acceptance button's `elementFromPoint` check is **true**, rectangle **x1026/y528, 184.75×27** at the 1440×1000 interaction viewport. The subsequent call is the locator's normal `.click()`, not a forced click, DOM `.click()` or direct service call.
4. P9 receipt command ID **`463b34cc-90cf-42b0-81f1-40061b8f7bf9`**, owner approval **`6c9909cc-de23-434c-8e17-425bbdf6e565`**, authorization **`owner-approval-gm`**. Both receipt and installed server token record show **mana 9 + 0 temp, AP 2 + 0 temp, spheres `["ember"]`, target HP 17**. The physical roll and GM final 7 are retained in adjudication.

I read `p9-gm-prepared.aria.yml`, `p9-gm-accepted.aria.yml`, `p9-owner-prepared.aria.yml` and `p9-owner-accepted.aria.yml`. They corroborate the pending card with checked adjudication/final 7, both accepted live-only statuses, and the owner's changed pools. The owner snapshot also shows a repeat approval disabled because the paid arcane spheres are no longer available.

Both receipts have **`checkpointRevision: null`**. These are live-only temporary-room results, not proof of crash recovery or confirmed cloud persistence.

### Desktop layout evidence

| Saved production-App observation | Host rectangle | Finding |
|---|---|---|
| `layout-1440.json`, viewport 1440×1000 | x1004/y84, 420×176, right1424/bottom260 | Fixed, 16px from right, wholly inside viewport. |
| `layout-1024.json`, viewport 1024×768 | x588/y84, 420×200, right1008/bottom284 | Fixed, 16px from right, wholly inside viewport. |

These layout captures are **after acceptance**. The pointer-hit/click-to-receipt witness is at **1440×1000**; I do not claim a second active-card acceptance click was performed at 1024. The earlier independent desktop pending-card CSS fixture remains supporting evidence, accurately limited as described in `review.md`.

The actual emitted CSS contains the reviewed rule in `/static/css/common.ea5b6b4a.chunk.css`, SHA-256 **`24840136e8a81b289db9223f3a8fc807a89cc62758f5614f280eb080129e06ee`**. The optimizer combines the shared border/color declarations with `.p9-chip` and retains a separate host rule containing fixed position, top84/right16, width420 and scrollable height cap. Thus this witness exercises the compiled correction, not only the static source fixture.

## 2. Witness corrections reviewed

Inspected current `verification/p9/integration/app-browser.cjs` and `app-server.cjs`, their Git diffs, and the narrow unchanged production context needed to interpret the corrections.

- **Run 7's overbroad comparison:** the earlier assertion compared the entire serialized character. The corrected witness compares health/mana/AP objects and their temporary pools, using fresh reads from the currently installed room map before and after owner approval. It still asserts that those common resource pools are unchanged before GM acceptance. This is a meaningful retained no-pre-spend assertion, not deletion of that check.
- **Why class metadata may legitimately change:** `spellConsequenceService.js:61–72,88–91` publishes the owner class home if needed before sending approval. `actorConsequences.js:282–297` mirrors that class value into `token.character.classResource`. Adding class metadata can therefore invalidate whole-character equality without spending the resource pools. Run 7 did not retain its actual comparison operands, so its exact old field delta cannot be retrospectively reconstructed from that result alone; the stated explanation is supported by this source path and the corrected passing assertion.
- **Run 6's stale map reference:** `actorConsequences.js:247` stages a clone, and `actorConsequenceHandlers.js:59–60` installs a replacement `room.gameState`. The corrected post-acceptance assertions re-read `host.room.gameState.maps['app-hall']` rather than the earlier `hall` reference. This matches the existing copy-on-write behavior and preserves all expected final pool/class/target assertions.
- **Drop payload:** `src/polyfills.js:185–199` can alias `DragEvent` to `MouseEvent`. The explicit bubbling/cancelable `Event('drop')` with a defined `dataTransfer` property supplies the external fixture payload without depending on that constructor alias. It dispatches to the real `.action-bar-assembly .action-slot`; subsequent visible slot, owner dialog and accepted-state evidence corroborate execution of React `onDrop`/`onClick`. This is synthetic external payload injection, not an OS drag-gesture/second-device claim.
- The server's `APP_BUILD` selection changes which intact build directory is served. It does not rewrite response bundle/CSS bodies.

The focal source recheck below found **no production correction edits** accompanying these witness changes. Failed replay directories and the earlier report were retained; fresh checking found no mutations to their existing files.

## 3. Identity and preservation

Fresh `run8-addendum-check.cjs` rehashed **all 16** previously sealed source/data/dependency files and checked each against `completion-final-state.json`. All match. It also checked those hashes against `build-current/command.json`'s before/after entries, preserved prior report/check hashes and original historical inputs, and compared every existing file in failed attempts `app-replay/` and `app-replay-2/` through `app-replay-7/`, plus run 8, before/after the check.

| Scoped file, relative to `vtt-react/` | Unchanged raw SHA-256 |
|---|---|
| `src/services/featherSlash.js` | `ad2b3134998a8585906bbb82a1ac3878dafecac92070a9ad81f659ed1812669a` |
| `src/services/__tests__/featherSlash.test.js` | `43eaf32fb3a87bf38cda145e9c7afc29bfbfda4f83f53585f376abd1acc2bcb9` |
| `src/components/ui/ActionBar.jsx` | `7a04ec3302561ae91cd495bddce4d5596235bd5b8c5916f58686b767f9000d33` |
| `src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx` | `98e8afbef304b1359da67d136ae2f38e43fc002846dcee247df500d5466dbb73` |
| `src/components/hud/PartyHUD.jsx` | `c5f2e9381c18fae3e68ec47f3f8bf2c02bca8e3be48ea72a8f6179e9e07db5d9` |
| `src/components/hud/SpellConsequencePanel.css` | `2f936ff2ff5bdc3f610c2c24c49015a1b935bd835a3f8f4e1dfeb2837682a68b` |

Result: **source drift `[]`; historical/witness artifact changes `[]`**. Exact run-8 snapshot, witness-script and inspected source hashes are in `run8-addendum-check.json`.

## 4. Build status and environment limits

- `build-current` completed **exit 0**, 2026-10-15T19:15:03.148Z–19:18:03.380Z. Its recorded concurrent drift is the two unrelated world-map stylesheets `InteractiveMapStudio.css` and `LoreSidebar.css`. All 16 focal before/after hashes match current. Run 8 uses the matching manifest above. This is not claimed as an exact whole-live-tree no-drift build.
- At the fresh check around **19:30:30Z**, `build-snapshot/` contained **`app/`, `output.log`, `source.json.gz`**, but **no `command.json`**. Thus that build was **not independently verified complete at this cutoff**, and no snapshot replay is used by this verdict. The snapshot-build script was inspected: it copies frontend src/public/config to a temporary mirror, hashes non-`.env` inputs, uses the existing dependency junction, and intends to record mirror/live drift. Its packet archives selected source/config/data bytes plus hashes; successful completion and future replay are not inferred from the script's intent.
- Run 8 records **exactly two `Failed to fetch` page errors**, one per principal, and **20 deliberate Firebase installation/Firestore network refusals**. The expected refused-installation explanation is consistent with the retained error/network records; this is **not a zero-page-errors result**. The current route filters Firebase/Google API host patterns (with fonts allowed), not all possible outbound hosts.
- External identity/provider verification, canonical ownership, lease and cloud persistence remain explicit simulated boundaries. Real production App/router/components/styles, compiled library bodies, browser Socket.IO and the registered backend stack run within those boundaries. There is no live Firebase/rules/provider, physical second-device or deployment claim.

## 5. Residual source/layout limits remain

The earlier limitations are unchanged: the 390px-wide independent fixture overlaps the party frame; at 390px viewport height the `100vh - 340px` formula leaves a 50px scrolling strip; the unconditional empty offline wrapper retains a 22×14px presentation/pointer footprint; and manually dragged frames can occupy the fixed right edge. These remain outside the bounded desktop PASS and are not represented as fixed by run 8.

## 6. Actual review command and result

From `D:\VTT`:

```powershell
if (Test-Path -LiteralPath "D:\VTT\vtt-react\verification\p9\evidence\integration-20261015\sol\independent-review") {
  node "vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/run8-addendum-check.cjs"
} else { throw 'Review output directory missing' }
```

Final execution **exited 0** and wrote new `run8-addendum-check.json`. It checks recorded receipt/pool/sphere/target values, snapshot text, pointer hit, desktop bounds, build manifest and emitted CSS identity, focal hashes and preservation. Two preliminary executions of my new checker exited 1 because it selected only the optimizer's first shared selector block; allowing whitespace alone did not solve that. I corrected only the report checker to collect both relevant selector blocks. Those checker errors wrote no result artifact and are not product failures.

Final report identity and a further focal/historical/replay preservation check are recorded by `node vtt-react/verification/p9/evidence/integration-20261015/sol/independent-review/run8-addendum-seal.cjs` from `D:\VTT`, writing only new `run8-addendum-seal.json`.

I reviewed the supplied successful Playwright run; I did not launch a new browser, test suite, build or future snapshot replay. Reviewer writes are new artifacts in `independent-review/` only. The earlier `review.md`, failed attempts, accepted historical evidence and production source remain preserved. No reset, commit, push or deployment was performed.

**Completed decision:** the actual full-App desktop acceptance-control witness missing from `review.md` is now present and internally corroborated. **Correction 3 changes from INCOMPLETE to PASS within the stated desktop scope; corrections 1 and 2 remain PASS.**
