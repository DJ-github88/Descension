# RI-2 Phase 2B Fate Weaver â€” second correction report

**Disposition: the seven review findings have implemented corrections and focused verification. Independent re-review is required. This is not an acceptance claim.**

Re-review basis: `ri2-phase2b-correction-rereview-block-20261021`. Reviewed baseline: `9e653fc45f632eda984914a051cd5f319a507a41`. All evidence from `phase-2b/` and `phase-2b-correction/` is retained unchanged; this report lives only in `phase-2b-correction-2/`.

## Repository context

- During this pass, concurrent commits advanced HEAD from the reviewed baseline `9e653fc` to `2f61dfac` and then `ad93fd78`. The final correction source is committed at `ad93fd78`; no source edits remain in the worktree. Those commits were not created by this pass.
- The committed source includes the Fate-scoped level-prune bypass with non-Fate pruning preserved, and previous-allocation grant cleanup in `setTalents`. All hashes in `current-hashes.json` describe HEAD `ad93fd78`.
- No commit, push, deploy, admission, or playtest acceptance was performed by this pass. The concurrent `ad93fd78` commit included four artifacts from this directory (`complete-manifest.json`, `correction.diff`, `eslint-correction.json`, `build-correction.exit`); the remaining evidence files are untracked.

## Findings and corrections

| Review finding | Correction | Primary paths |
|---|---|---|
| Guide and HUD still described next-turn-start expiry, immediate Cut recovery, recovery to the caster, and long-rest refill. | Corrected transfer destination to the chosen bearer, Tie expiry to the end of the second subsequent caster turn, Cut recovery to the owning caster's next own turn, 30 ft formation / 60 ft maintenance, and removed rest/reconnect/initiative refill wording. | `fateWeaverResourceGuide.js`, `fateWeaverData.js`, `FateWeaverResourceDisplay.jsx` |
| Projection lost R1 targeting, duration, and thread price. | Projection now emits `multi` for Tie, defaults signature durations to `instant`, reads `threadReservation` / `tokens` / `threadPrice`, and safely handles malformed containers. | `fateWeaverData.js` |
| Validator accepted one-sided consent, alias contradictions, duplicate reservations, missing link back-references, and use overflow. | Consent aliases require both sides without contradiction; reservation aliases and token-ID aliases are conflict-checked; `usesRemaining` cannot exceed `uses`; link reservations are unique; every reserved/recovering token must back-reference its link. | `fateWeaverData.js` |
| Known signature/capstone grants survived level reduction and Reset All. | `removeTalentGrantSpells` now filters `class_spells.known_spells` while respecting spells still needed by another character or library. Level-up, `adjustLevel`, info-level changes, class switches, and `setTalents` route through reconciliation. Non-Fate level pruning is preserved. | `progressionSlice.js`, `infoSlice.js` |
| HUD crashed or invented valid state for malformed token containers. | Projection guards non-array token/link data; the HUD reports â€œFate Link state needs reviewâ€ and renders no fabricated thread counts. | `fateWeaverData.js`, `FateWeaverResourceDisplay.jsx`, HUD tests |
| A prior recorded optional pick could be selected again if `known_spells` was stale. | The level-up guard now rejects any optional spell already present in `levelUpHistory`, atomically. | `progressionSlice.js` |
| Correction evidence omitted explicit seven-ledger reconciliation and current-manifest truth. | Added `LEDGER-RECONCILIATION.md`, a fresh `complete-manifest.json` generated from current code, and `manifest-audit.json`. | this directory |

The three-thread economy, three-link cap, manual/execution boundary, three trees, 96 authored records, 40 optional records, six talent actives, 54 nodes, and all six R1 `classResourceProgram` payloads remain unchanged. The six R1 payloads are exactly equal as JSON values to `classes/manifests/fate-weaver-review-r1.json` in the current manifest audit.

## Verification

- Jest correction batch: **13/13 suites, 144/144 tests passed** (`jest-correction.log`), exit 0. Includes Fate integration/corrections/HUD, Augur dispositions/resource contract/resource bar, Gambler integration/HUD, class resource contracts, spell-cast resource contracts, level-up modal, Chaos Weaver progression, and mounted Talent Tree Reset All.
- Retained external harness: **16/17 passed** (`sol-harness.log`). The sole failure is the intentional line-80 comparison against immutable `phase-2b/complete-manifest.json`. The Jest equality test short-circuits lines 81â€“82, so they were not executed; no claim is made that they ran. `manifest-audit.json` separately audits the current correction manifest: 96 authored, 96 projected, 3 trees, 54 nodes, 40 optional, 2 core, 6 talent actives, 382 Augur rows, all six R1 programs exact, and all records manual/non-executing.
- ESLint on 8 correction paths: **0 errors, 1 warning** (`eslint-correction.json`). The warning is the pre-existing UTF-8 BOM in `fateWeaverData.js`.
- `git diff --check`: clean.
- Detached production build: **Compiled successfully, exit 0** (`build-correction.log`, `build-correction.exit`). Compilation only; no browser or runtime acceptance is claimed.
- Source diff against `9e653fc`: 8 correction paths, 768 insertions / 98 deletions (`correction.diff`).

## Evidence inventory

- `jest-correction.log` â€” 13-suite run with current manifest export.
- `sol-harness.log` â€” retained 17-check harness; one expected old-artifact failure.
- `eslint-correction.json`, `build-correction.log`, `build-correction.exit`, `correction.diff`.
- `complete-manifest.json` â€” generated from current modules by the integration suite with `RI2_EVIDENCE_EXPORT=1`.
- `manifest-audit.json` â€” independent audit of counts, R1 payload equality, projected terms, and manual boundary.
- `LEDGER-RECONCILIATION.md` â€” explicit seven-path reconciliation and byte-history limitation.
- `current-hashes.json` â€” final source, evidence, and immutable-evidence hashes.

## Limitations

- The old `phase-2b` artifact remains intentionally unchanged, so its equality probe fails by design. The current truth is `complete-manifest.json` in this directory.
- Four intermediate byte histories for unrelated ledger files are not fully reconstructible from available evidence; no hashes or authorship are invented. See `LEDGER-RECONCILIATION.md`.
- No browser route, persistence, migration, combat automation, or playtest acceptance is claimed.
- Capstone once-per-long-rest use cooldowns remain; no resource rule performs a long-rest token refill.

