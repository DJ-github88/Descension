# CR-W1a + CR-W1b Acceptance Report

Captured: 2026-10-17 (HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`, dirty tree preserved)

## Result

- CR-W1a (authored zero AP preserved through Step5 editor, canonical state, summaries, save/reopen): implemented and verified.
- CR-W1b (authored `resourceCost` preserved through canonical serialization and templates): implemented and verified.
- No A1a, Wizard-end-to-end, class data, persistence, migration, or deployment claims.

## Changed files

| File | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `vtt-react/.../components/steps/Step5Resources.jsx` | `725019cb…a3548` | `52e0e899…167cd` |
| `vtt-react/.../core/mechanics/resourceManager.js` | `22e58294…e7163` | `0fc160b7…30cf0b` |
| `vtt-react/.../core/utils/spellSerializer.js` | `15de741c…eb499c` | `b9608629…dfaa5f` |

New focused suites (untracked, full hashes in `source-diff-manifest.json`):

- `components/steps/__tests__/Step5Resources.zeroAP.test.jsx` (11 tests)
- `core/mechanics/__tests__/resourceManager.zeroAP.test.js` (13 tests)
- `core/utils/__tests__/spellSerializer.resourceRoundTrip.test.js` (13 tests)

Diff: `evidence/diff-W1a-W1b.patch`.

## Behavior deltas

- Step5Resources.jsx: AP draft resolution (selected fixed editor → canonical → fallback 1) treats presence-safe validity as "not null/undefined/NaN/negative/fractional/non-numeric-string"; malformed values no longer become valid defaults; save effect omits `actionPoints` for malformed drafts (does not clobber canonical), emits resolved value otherwise, including `0`; toggle initialization copies canonical (including malformed) and falls back to 1 only when genuinely missing; summary/input render the same resolved fixed price and label invalid drafts; free-cast copy is neutral while a common AP price remains.
- resourceManager.js: total AP and additional-AP row both resolve fixed editor value → canonical authored value → existing recommendation calculators. `0` is preserved everywhere.
- spellSerializer.js: serializer retains authored `resourceCost` (previously deleted); template instantiation deep-copies the template so dotted modifications cannot mutate the source template; private-field stripping, try/catch→null semantics, and metadata removals unchanged.

## Verification

Tests (final combined run):

```
PASS Step5Resources.zeroAP.test.jsx
PASS spellSerializer.resourceRoundTrip.test.js
PASS resourceManager.zeroAP.test.js
Test Suites: 3 passed, 3 total
Tests:       37 passed, 37 total
```

Command: `$env:CI='true'; npm test -- --watchAll=false --runInBand --runTestsByPath <3 suite paths>` (workdir `vtt-react`).

Lint (scoped): `npx eslint` over the 3 source files + 3 suites → 0 errors, 19 warnings. All warnings are pre-existing style noise (unused imports/handlers, BOM) plus 2 informational `react-hooks/exhaustive-deps` notes for the Step5 save-effect closure and the test SeedGate effect; no new correctness findings.

### Mounted witnesses

CR-W1a (`evidence/CR-W1a/`, real provider + real Step5 + verbatim production save/review/reopen expressions, port 10698, pid stopped):

- selected-editor-zero → 0; editor-missing-canonical-zero → 0; editor-zero over canonical 2 commits 0; typing → 2; deselect/reselect retains 0; both-missing → 1; PASSIVE explicit 0 → 0; PASSIVE missing → 1; malformed null → stays null + "(invalid)" + empty input; positive two stable through mana edit; reselect initializes from canonical.
- Save → Step10Review → main save → reopen chain preserves 0 at every layer (outer AP 0, secondary serialized AP 0, reopen 0).
- Evidence: `witness-results.json`, `witness-source-hashes.json`, `witness-snapshot-zero-ap.md`; 0 console errors.

CR-W1b (`evidence/CR-W1b/`, real serializer + real `libraryManager.exportLibrary`, port 10901, pid stopped):

- 14/14 cases pass: AP0/mana0, AP0/mana4 exact, sphere multiset, seven-note counts, class/secondary/materials/formulas, unknown extensions, missing/empty/null distinct, two-cycle stability, template round-trip, dotted-change isolation, whole replacement, private cleanup, Review secondary serialized path, raw export positive control.
- Evidence: `witness-verdict.json`, `witness-evaluate-results.json` (full per-case values), `witness-source-hashes.json`, `witness-snapshot.md`; 0 console errors.

### Witness boundaries and mocks

- Both harnesses compile real project modules with Babel and mount real production components/functions; copied expressions are verbatim from `SpellwizardApp.jsx`, `Step10Review.jsx`, and `libraryManager.js`.
- W1a mocks: visual-only children (`SimpleFormulaHelp`, `SpellComponentsSelector`), react-bootstrap/icons.
- W1b mocks: `persistence/spellLibraryScopedStorage` (never exercised by `exportLibrary`); no storage, network, account, or shared-room writes.
- In-memory only; no personal account or library data touched.

## W1b independence

Secondary save path (`Step10Review` `serializedData: serializeSpell(spellState)`) previously dropped `resourceCost` via `cleanConfigForSerialization`. W1b fixes it in place; the W1b witness exercises the exact serialization path, and the W1a witness confirms the outer record fields. Neither correction depends on the other.

## Incumbent issues observed (not repaired)

- Stale free-cast warning text remains when AP is fallbacked from both-missing encodings at mount (warning effect deps exclude canonical) — pre-existing display behavior, non-regression, recorded as-is.
- Pre-existing unused-var/BOM lint warnings in Step5Resources.jsx.
- `git status` limited to the task footprint: 3 modified source files + 4 new `__tests__`/evidence directories.

## Protected files confirmation

`spellWizardContext.js`, `SpellwizardApp.jsx`, `Step10Review.jsx`, `libraryManager.js`, `privateStorageRegistry.js`, `data/classes/index.js`, `vtt-react/package.json` — all re-hashed, all UNCHANGED vs `evidence/frozen-handoff-source.json`.

## Rollback

W1b rollback: re-delete the `resourceCost` cleanup line in `cleanConfigForSerialization` and revert `generateSpellFromTemplate` to in-place dotted modification. W1a rollback: revert Step5 to the frozen `725019cb…` and resourceManager to the frozen `22e58294…` bytes. All source is uncommitted in the working tree; nothing has been committed.
