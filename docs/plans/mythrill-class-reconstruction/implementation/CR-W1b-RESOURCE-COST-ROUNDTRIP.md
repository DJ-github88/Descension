# CR-W1b — preserve resourceCost in canonical serialization/templates

**Status: FROZEN correction contract, ready for separately authorized implementation. No code changes authorized here.** Independent of W1a/A1a. No migration or executable-spell admission.

Preflight: read root AGENTS/CLAUDE, refresh branch/HEAD/status and [focused source hashes](../evidence/frozen-handoff-source.json). Preserve the current dirty tree and concurrent work. No reset/stash/clean or silently expanding scope if a caller has changed; report/reconcile semantic drift first.

## 1. Goal and evidence

Losslessly preserve the authored JSON `resourceCost` through the **identified** serializer/template paths, including explicit0, exact typed ingredients/counts, costs/gains and unknown JSON extensions. Preserve intentional behavior for actually missing values; do not synthesize prices.

Root cause: `spellSerializer.cleanConfigForSerialization:618–632` deep-copies then deletes the entire resourceCost. Both `serializeSpell` and `createSpellTemplate` use it. `generateSpellFromTemplate:89–117` shallow-copies the template, so a dotted modification of resourceCost can mutate its nested source object. These two local ownership issues are in scope.

The prior isolated browser reproduction confirms serialize→deserialize/template→instantiate price loss. Source-only distinction: main save (`SpellwizardApp:277–280`) and Review outer record preserve resourceCost; Review secondary serializedData invokes the lossy serializer. `libraryManager.exportLibrary:97–107` exports the raw library object, not that cleaner. **Do not claim every export is broken.**

## 2. Exact writable files

1. `vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js` — only canonical cleaner/template cloning behavior described below.
2. New `vtt-react/src/components/spellcrafting-wizard/core/utils/__tests__/spellSerializer.resourceRoundTrip.test.js`.
3. Implementation evidence under this package's `implementation/evidence/CR-W1b/`.

Main/Review save/load, libraryManager, Wizard provider, resource calculators, book normalizers, cards, all class data and execution/persistence files remain read-only. If another caller needs a change, report a separately bounded amendment.

## 3. Frozen serialization semantics

- `serializeSpell(config)` → `deserializeSpell(result)` retains a JSON-equivalent exact copy of every supplied resourceCost field, including AP0, mana0, components, typed collections, secondary costs/gains, formulas and unknown nested JSON extension fields.
- `createSpellTemplate(config)` retains that same price while adding its existing template metadata.
- `generateSpellFromTemplate(template,{})` retains it while removing only the existing four template metadata fields.
- Deep-copy the template **before** nested modifications, so changing `resourceCost.actionPoints` or `resourceCost.notes` cannot mutate the template or original spell.
- Preserve the existing whole-object replacement semantics for an explicit `modifications.resourceCost`. Do not introduce a deep-merge/JSON-patch language. Preserve existing one-dot modification behavior; deeper path support is not this task.
- Do not rename/generate IDs, rebalance costs, change formula strings, sort/deduplicate arrays, expand recipes or validate/evaluate class programs here.
- Unknown non-private JSON namespaces (including a proposed classResourceProgram) round-trip as data only; their presence grants no execution.

### Missing/present table

| Input | Result |
|---|---|
| resourceCost absent | Remains absent; no AP1/mana0 injection |
| resourceCost:{} | Remains{} |
| resourceCost:null | Remains null; not silently made free or defaulted |
| actionPoints:0 or mana:0 | Exact numeric0 preserved |
| Legacy signed costs/note encodings or conflicting encodings | Preserve exact JSON data; admission/validation remains separate |
| Unknown nested JSON resource fields | Preserve them |
| Non-JSON/undefined/Date/functions | No new preservation guarantee; keep current serializer error/JSON semantics, never execute values |

Keep the current **top-level underscore-prefixed private-field removal policy**. Do not broaden it into recursive stripping or redesign it to save unrelated private legacy fields. Removing resourceCost is the erroneous “calculated field” deletion; that object is authored data. Existing calculated recommendations/game-code output remain separate views.

## 4. Regression fixtures and paths

1. AP0/mana0 and AP0/mana4 exact deep equality.
2. Sphere multiset such as `["arcane","arcane","rime"]`: multiplicity/order survive.
3. Seven-note counts and signed legacy note values remain exact.
4. Class cost/gain/secondary state objects and unrelated materials/formulas survive.
5. Non-private unknown resource extension and unknown-version classResourceProgram survive serialization **without being supported/admitted**.
6. Missing/empty/null cases above stay distinct.
7. Two serialize/deserialize cycles are stable and do not mutate input.
8. Template→instantiate, including a serialized template string, preserves price.
9. Dotted AP change to0 affects only the new instance; a second instance/template/original is unchanged.
10. Whole resourceCost replacement retains existing intentional replacement behavior; no merged phantom old cost.
11. Existing four template metadata removals and top-level private cleanup remain unchanged.
12. Actual Review caller’s secondary serializedData retains the outer record’s exact resourceCost; raw-library JSON export is a positive control.

Use actual production helpers, not test reimplementations. A supplied valid0 fixture makes this independent of W1a's current UI bug. When checking Review, seed the exact price into isolated state; do not use live personal storage. Prior malformed template-option lists are unrelated and must not be repaired here.

## 5. Verification and acceptance

From `D:\VTT\vtt-react` after implementation:

```powershell
$env:CI='true'; npm test -- --watchAll=false --runInBand --runTestsByPath src/components/spellcrafting-wizard/core/utils/__tests__/spellSerializer.resourceRoundTrip.test.js
```

Run the isolated serializer browser witness and the actual Review-secondary/raw-library controls. Record source hashes, exact input/output equality and exclusions. No full build required for a pure utility change unless a real integration concern appears; follow detached-build rules if one becomes necessary.

**Acceptance:** supplied authored price survives all named paths; no input/template alias mutation; genuine missing values get no guessed price; public function names/error returns/template ID semantics stay compatible; no execution/admission/P9/P12/source-data changes.

## 6. Migration, exclusions, rollback, output

No mass migration or load-time reconstruction. If an old outer library record retains its price, it remains authoritative read data; a serialized-only payload that lost it cannot be repaired by guessing. A future load/admission adapter must flag missing price; **this task does not add that UI or adapter**.

Exclude `generateGameCode` redesign, general numeric validation, all Wizard load/reducer changes, book resourceCosts schema conversion, new resource editors and runtime capabilities.

Rollback only scoped helper changes; preserve exact-price records already saved, template originals and unknown JSON. Never delete libraries or strip the restored price back out. Expected output: utility patch, focused regression suite, named caller/browser evidence, before/after source hashes and honest remaining caller limitations.
