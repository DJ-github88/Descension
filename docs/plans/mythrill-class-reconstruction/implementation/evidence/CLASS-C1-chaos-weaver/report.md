# CLASS-C1 Chaos Weaver implementation evidence report (2026-10-18)

Implementer report for `implementation/CLASS-C1-CHAOS-WEAVER.md` under the issued DeepSeek
instruction (§11). This report claims **structural, class-local, manual-tabletop implementation
only**. No engine work, no class registration, no live spell grants, no save migration, no
character/library/room writes, no server calls and no commits were made. Nothing here is a working
shared cast, trusted randomness or a persistence guarantee; no balance/tuning acceptance is claimed.

## 1. Deliverables

10 new files + 2 modified files (the exact 12-path writable set). Hashes, line counts and
entry-comparison data: `new-source-hashes.json`. Working-tree diff of the two modified files:
`classesdisplay-edits.patch`.

| File | SHA-256 | Status |
| --- | --- | --- |
| `vtt-react/src/data/classes/chaosWeaverData.js` | `ad768b4d…` | new |
| `vtt-react/src/data/classes/chaosWeaverRules.js` | `105159e5…` | new |
| `vtt-react/src/data/talentTrees/chaosWeaver.js` | `8c8e7d5d…` | new |
| `vtt-react/src/components/hud/ChaosWeaverResourceDisplay.jsx` | `72f07d97…` | new |
| `vtt-react/src/components/rules/chaos-weaver/ChaosWeaverWorkshop.jsx` | `acb9a8ac…` | new |
| `vtt-react/src/components/rules/chaos-weaver/ChaosWeaverWorkshop.css` | `257aabd7…` | new |
| `vtt-react/src/data/classes/__tests__/chaosWeaverPackage.test.js` | `72c1a58c…` | new |
| `vtt-react/src/data/classes/__tests__/chaosWeaverRules.test.js` | `24171a96…` | new |
| `vtt-react/src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx` | `2d902e41…` | new |
| `vtt-react/src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx` | `51192670…` | new |
| `vtt-react/src/components/rules/ClassesDisplay.jsx` | `092d30e6…` (entry `a996fd0d…`) | modified |
| `vtt-react/src/components/rules/__tests__/ClassesDisplay.test.jsx` | `9ccbe4c2…` (HEAD `e196f227…`) | modified |

Manifest / capacity / path proofs: `content-index.json` (49 active + 48 passive record index, 54
nodes) and `planning-validation.json` (40/3/6/48/97 counts; 54 nodes; three trees × 50 capacity;
**three 50-point capstone proofs** — `cw1_ps_n18`, `cw1_ab_n18`, `cw1_ca_n18`, signature at point 11
earliest L3 each). The implementation tests re-derive these against the code under test
(`chaosWeaverPackage.test.js`, `chaosWeaverRules.test.js`).

## 2. Defects found and fixed during implementation (honest record)

1. **Fold range bug (production code):** `comboForTileIds` required `tileIds.length` to equal the
   descriptor's single count, and the Fold tileRule `{anyOf,minCount:1,maxCount:2}` had no `count`,
   so a two-tile Fold was impossible. Fixed with `descriptorCountRange` (min/max), max-based
   `tileRuleTotalCount`, `minCount..maxCount` expansion in `legalSymbolCombos`, and range-accepting
   `comboForTileIds`. Regression-guarded by the Fold tests.
2. **Continuation double charge (production code, fixed earlier in the same implementation):**
   accept originally paid the 3-AP cost a second time and double-transitioned zones. Spec line 334
   makes the commit itself the single charge; accept pays 0 extra; the workshop button label was
   corrected accordingly (previously said "pay again").
3. **Zero-count records carried a non-null `zoneTo` (production data):** `cw1_20` and
   `cw1_dismiss_anomaly` failed the closed-profile certification (`zoneTo` must be `null` when
   `count === 0`), which also made every exported packet fail `importPacket` and cascaded into the
   authoring panel ("Package problems detected"). Root-caused by the round-trip tests, fixed in the
   `activeRecord` factory.
4. **ClassesDisplay gate placement (production code):** the first wiring attempt anchored the
   early-return inside the `filteredClasses.map` callback, so opening the workshop rendered one
   workshop per class card (21 duplicate headings). Caught by the component test and confirmed in
   the mounted browser; the gate now sits after all hooks and before the main return.
5. **Lint hygiene:** `removeRank` no-loop-func (refactored via `pruneUnmetPredecessors`), unused
   import/helper removal in `chaosWeaverRules.js`, and a test-helper extraction in
   `chaosWeaverRules.test.js`.

No production behavior was weakened to make tests pass; no test expectation was relaxed beyond
replacing one ambiguous text query with a `getAllByText` length check.

## 3. Commands run and observed results

From `D:\VTT\vtt-react`:

```powershell
$env:CI='true'; npx react-scripts test --watchAll=false --runInBand --runTestsByPath `
  src/data/classes/__tests__/chaosWeaverPackage.test.js `
  src/data/classes/__tests__/chaosWeaverRules.test.js `
  src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx `
  src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx `
  src/components/rules/__tests__/ClassesDisplay.test.jsx
# Test Suites: 5 passed, 5 total; Tests: 45 passed, 45 total   (log: test-run.log)

npx eslint <the 12 paths>          # exit 0, zero errors, zero warnings
git diff --check <the 12 paths>    # clean; only note in repo is a pre-existing blank line at EOF
                                   # in docs/MYTHRILL_P11_P14_ROADMAP.md (outside this scope)
```

Playwright against the real dev server (`http://localhost:3000`, existing process; no foreground
build was run): route `/codex/character-creation/classes` (the actual RulesPage seam that mounts
`ClassesDisplay`). 0 console errors across the whole session; the only warning is the pre-existing
app warning `Scoped character save not persisted: NO_ACTIVE_SCOPE`, unrelated to this feature.

The JS suites mock nothing except `jest.fn()` callbacks; they mount the real production
components. The browser pass used the real entry, real tabs and real SVG with no mocks.

## 4. Acceptance matrix coverage map

| Check | Evidence |
| --- | --- |
| Content completeness | `chaosWeaverPackage.test.js` — 97 unique records, 40/3/6/48, four optionals per level with ≥2 nondamage, slot 07 R1 stable ID `cr1_chaos_weaver_read_instability`, closed profile, references resolve |
| Rank/build legality | package suite (18/50 per tree, 54 nodes, 150 capacity, gate schedule, six grants, no cycles); rules suite (signature impossible before L3, hybrid signature, 45-point capstone within 50) |
| Pure-state conservation | rules suite validates six IDs / unchanged symbols after every valid and invalid path, no recovery, no double settle (`expectConservation`) |
| Odds | rules suite — mapping fixed before face (2/3/4 IDs), uniform weights pair 1/2, bias 2/3–1/3, triad 1/3; damage dice remain separate by construction |
| Costs/downside | rules suite (Split charge/spend, Fold paid recovery, Second Possibility one 3-AP charge, decline returns only reservation, dismiss 1 AP, void spends all, no refill); package suite (every Fracture branch keeps explicit downside; native 0/0) |
| Lifecycle worksheets | rules suite (anomaly trigger/expiry/dismiss → spent, rest refuses unresolved draw/anomaly, rest needs new label); workshop suite mounts the flows |
| Natives | rules suite (Prepared Exchange needs part/different symbols/once per rest; no auto-execution); package suite (native stays proposed, free, non-automatic) |
| Rank effects | package suite (tuples expanded, absolute highest-rank values, capstone gating); workshop suite (rank up/down preview, reset leaves allocation untouched) |
| Round trip | rules suite — export→import→export exact, explicit zeros preserved, malformed/unknown drafts retained but not certified; original records never overwritten |
| Mounted UI | Playwright screenshots 01–06 + workshop suite (all tabs, commit→mapping→face→settle, continuation decline, inspector Escape + focus return, authoring import restores worksheet) |
| Compatibility | ClassesDisplay suite — original catalogue and `onSelectClass` behavior unchanged, entry is local state, no callback routing; no registration/grants/writes/calls by construction |
| Preservation | `preservation-check.json` — 21/25 entry-listed sources byte-identical; 3 server files are concurrent work outside this scope (mtimes 15:00:07–08 vs implementation files 15:11+); 1 by-design ClassesDisplay change; scoped patch only touches the 12 paths |

## 5. The three manual witnesses (from the spec, §10)

These are the specified tabletop witnesses. Their transitions are exercised through the real
components by the mounted-UI suites (rules + workshop); they are **manual tabletop procedures, not
validated balance**:

- **Probability:** `Fold the Odds` 1 AP restores one or two spent IDs; `Bias the Draw` maps
  S1/S2/F1 → selects F1, d6=3; Split 2 AP publishes mapped faces and spends the pair; damage dice
  recorded separately. Covered by: mapping/odds tests, Fold tests, Split commit→face→settle
  workshop test.
- **Anomaly:** `Unsteady Ground` 2 AP binds M1/F1 as bound; Split S1/F2 selects S1; enemy entry
  settles bound IDs to spent with no avoided-trigger refund; dismissal spends 1 AP; Fold restores.
  Covered by: Unsteady Ground, dismissal, Fold tests, settle/spend assertions.
- **Cascade:** `Second Possibility` 3 AP with a reserved ID excluded from the sample; accept spends
  all three tiles on the single 3-AP charge; declined continuation returns only the unused
  reservation and preserves originals; interrupted continuation stays locked pending an explicit
  recorded choice. Covered by: Second Possibility accept/decline tests + workshop continuation test.

## 6. Mounted UI evidence (screenshots/)

| File | Content |
| --- | --- |
| `01-class-overview-1280.png` | real class catalogue at 1280px with the preview entry ("Open class workshop") |
| `02-workshop-rules-1280.png` | workshop Rules tab, local-rehearsal status, six-tile doctrine |
| `03-workshop-talents-1280.png` | Talents tab, three trees, points summary, per-node rank controls |
| `04-workshop-rehearsal-tiles-1280.png` | started rehearsal, pure SVG six tiles with live aria-label "6 available,…" |
| `05-workshop-rehearsal-360.png` | same rehearsal view at 360px |
| `06-class-overview-360.png` | catalogue + entry at 360px |

Browser-verified interactions beyond the screenshots: keyboard activation of the entry
(focus + Enter opens the workshop), `Back to classes` returns to the catalogue, rehearsal state
survives tab switches, and the tiles group aria-label stays accurate.

## 7. Explicit unsupported list

Not implemented and not claimed: live/engine execution of any kind; class registration or
selectability; live spell grants or talent-library writes; character/library/room persistence or
save migration; server cast/actor/payment/authority calls; socket or two-client persistence;
trusted randomness or hidden probability changes (all dice are entered by hand); automated map
movement, timers or effects; rest/encounter/talent refill automation; balance or numerical tuning
acceptance (institution/edge and tuning values are recommendations in the packet, not validated
claims). Engine requirements remain separate next-step work per spec §11.

## 8. Evidence directory contents

- `new-source-hashes.json` — 12-path hashes, entry comparisons, preservation summary
- `preservation-check.json` — 25 entry-listed source hashes vs current working copy
- `classesdisplay-edits.patch` — `git diff` of the two modified files
- `test-run.log` — final green run (5 suites, 45 tests)
- `screenshots/` — six browser captures (§6)
- `content-index.json`, `planning-validation.json`, `validate-content.cjs` — planning artifacts (entry)
- `report.md` — this report

No commits, pushes or deploys were made. The repo's pre-existing dirty state (including concurrent
P12 block-work changes) was preserved untouched.
