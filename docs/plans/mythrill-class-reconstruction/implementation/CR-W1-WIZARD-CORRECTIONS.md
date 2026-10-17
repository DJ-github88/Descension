# CR-W1a / CR-W1b — bounded Wizard correction proposals

## Current frozen handoff — supersedes the proposal below

- [CR-W1a-ZERO-AP.md](CR-W1a-ZERO-AP.md): exact AP/default precedence, existing missing-value fallback1, no AP waiver on deselection, scoped files/regressions/rollback.
- [CR-W1b-RESOURCE-COST-ROUNDTRIP.md](CR-W1b-RESOURCE-COST-ROUNDTRIP.md): lossless price/template data, no missing-price synthesis, isolated deep-copy modification semantics.
- [CR-A1a-DEFINITION-INFRASTRUCTURE.md](CR-A1a-DEFINITION-INFRASTRUCTURE.md): independently preparable server-only definition/descriptor/transition infrastructure; real Wizard acceptance still needs exact-price integration.

These are independently executable **contracts after separate implementation authorization**, not implemented repairs. In particular the earlier proposal's missing-PASSIVE default0 and deselect-to-zero behavior below are **not** in the frozen W1a contract: they would change current defaults/common AP semantics.

<details>
<summary>Historical correction proposal and original reproductions — retained, not the current implementation specification</summary>

**Status: PROPOSED correction contracts for HeadQ review. Application implementation not authorized.** These two repairs can be executed independently after approval; neither admits new spell execution.

## Reproductions and exact scope

Isolated server: `evidence/headq-wizard-witness-server.cjs`. It compiles the actual unmodified Step5Resources component, resourceManager and serializer/dependencies with installed Babel, mounts real React18/ReactDOM, and supplies a memory-only state/dispatch context. Icons/bootstrap/visual children are inert; the actual provider's validation, library saves, storage and backend are not exercised. Exact inputs/mocks: [witness inputs](../evidence/headq-wizard-witness-inputs.json). No application build is involved.

1. Start the isolated server from repo root with Node in a detached process; its ephemeral localhost URL is written to `evidence/headq-wizard-witness-ready.json`.
2. Open that URL in a separate browser context/tab. `selected-zero` starts with both `actionPoints:0` and `resourceValues.actionPoints:0`.
3. After the actual Step5 effect, the numeric input still shows0 but the emitted patch and parent state contain **AP1**. [Observed JSON](../evidence/headq-wizard-selected-zero.json).
4. `unselected-zero` and `passive-zero` also produce AP1. Unselected case simultaneously displays **“This spell has no resource costs”**. [Unselected/export evidence](../evidence/headq-wizard-unselected-and-export.json), [passive evidence](../evidence/headq-wizard-passive-zero.json).
5. `selected-two` preserves2, demonstrating the defect is zero/default semantics, not every update. Then filling its actual AP spinbutton with0 again emits/stores1 while the input shows0. [Positive control](../evidence/headq-wizard-positive-control.json), [actual edit-to-zero](../evidence/headq-wizard-edit-zero.json).
6. Call the actual `deserializeSpell(serializeSpell(initial))`, `createSpellTemplate(initial)` and `generateSpellFromTemplate(template,{})` through the fixture buttons/APIs. All lose **the whole resourceCost object**, including explicit0 AP, mana4 and two exact Arcane ingredients; original input remains unchanged.

Source root causes: Step5 `:425–427` uses `||1`; selecting resources also initializes falsey zero at `:464–465`; summary `:667–669` uses falsey fallback. Serializer `cleanConfigForSerialization:618–632` explicitly deletes resourceCost.

**Do not overstate the export defect:** current main library save explicitly includes resourceCost (`SpellwizardApp:277+`), Review save includes it (`Step10Review:2665–2672,2729+`) but its secondary `serializedData` calls the lossy serializer (`:2630`). `libraryManager.exportLibrary:97–107` JSON-exports the library object directly. This investigation does not claim every library export or reopen loses prices. Template APIs are directly reproduced; no current mounted UI caller of createSpellTemplate was established beyond its import.

## CR-W1a — preserve explicit AP zero

**Goal:** canonical AP field, selected fixed-value editor, summary and save payload agree for0, positive integers and missing defaults.

**Exact proposed files:** `vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx`; new adjacent `__tests__/Step5Resources.zeroAP.test.jsx`. If source-provider integration exposes another cause, report it and freeze a separate amendment rather than broadening silently.

**Preserve:** all class editors/keys, component text/costs, current provider/reducer contracts, existing user work and spell IDs.

**Allowed:** replace falsey defaulting at the three identified AP/value paths with explicit absence handling; keep number0; validate finite nonnegative integers without coercing blank/invalid input to a valid paid action. A temporary blank draft may remain invalid until corrected. Missing AP uses an explicit default1 for ordinary ACTION and0 for PASSIVE/FREE_ACTION; explicit0 always wins. Unselecting AP sets canonical0 and removes its selected cost encoding; reselecting can restore an explicit draft value, including0. No existing loaded0 is silently charged.

**Prohibited:** change resource balance, other domain semantics, author free class casting, widen P9 or rewrite all Wizard state.

**Regression fixtures:** selected0, unselected0, PASSIVE0, FREE_ACTION0, positive2, missing ACTION, missing PASSIVE, deselect/reselect, unrelated mana edit with AP0, malformed negative/NaN/fraction, reopen0. Assert actual emitted reducer payload and summary/input, not only DOM input. Mount with actual provider once at integration to check cost-only validation; isolate existing unrelated provider failures honestly.

**Acceptance:**0 remains0 through resource edit→review→main/Review save→reopen; malformed input blocks valid publication rather than defaulting; positive2 unchanged. No storage migration required. Old accidentally saved1 cannot be safely inferred back to0; leave it unless owner corrects it.

**Verification:** from vtt-react, `CI=true` equivalent PowerShell plus `npm test -- --watchAll=false --runInBand --runTestsByPath src/components/spellcrafting-wizard/components/steps/__tests__/Step5Resources.zeroAP.test.jsx`; real-browser fixture and main/Review round trip; scoped lint/diff. Test path is a proposed new file, not a currently existing suite.

**Rollback:** restore only reviewed code; retain any correctly authored0 saves and unknown fields. Expected output: targeted patch, fixture results, actual provider/browser evidence, no execution boundary change. Creator choice: none for preserving explicit0; approval is still required to implement.

## CR-W1b — lossless canonical resource serialization

**Goal:** serializer/template round trips preserve authored prices, typed contents, gains, explicit zeros and supported versioned class programs.

**Exact proposed files:** `core/utils/spellSerializer.js`; new `core/utils/__tests__/spellSerializer.resourceRoundTrip.test.js`. The existing main/Review callers stay unchanged unless a distinct defect is demonstrated; future new-program load support belongs to CR-A1, not this repair.

**Allowed:** stop deleting authored resourceCost; define/remove only demonstrably calculated UI fields, preserving unknown authored extensions and canonical class operation metadata. Template metadata stays distinct; template instantiation must not lose resourceCost. Never reconstruct a missing exact ingredient list from a total or from prose.

**Schema:** retain original resourceCost keys (AP/mana/components/resourceTypes/resourceValues/resourceFormulas/useFormulas/spheres/notes/classResource). Preserve any newly approved namespaced program as JSON; unknown future versions round-trip but remain non-executable. Reject non-JSON/invalid publishable content in validation, not silently rewrite it during export. Calculated recommendations belong outside this object.

**Checks:** deep equality for typed sphere multiset, seven-note counts, secondary costs/gains, negative legacy encodings preserved as read data, AP0/mana0, all42 proposed fixture records once schema approved; serialize/deserialize twice idempotent; template→instantiate equality except explicit metadata/ID choices; library raw export is a positive control; original input not mutated. Test duplicate/conflicting encodings at validation rather than silently deduplicating on export.

**Migration:** previously saved outer library record may still contain price—prefer its canonical object when reopening. A payload with only lossy serializedData is incomplete; show “resource configuration missing—review required”, preserve original, do not guess free/AP1/class resource values. No mass migration of existing libraries.

**Verification:** focused proposed serializer test path, actual serializer browser API repro, Review secondary serializedData equality and raw-library export/import positive control. Existing helper imports contain template-option mismatches (empty options in witness); record separately rather than fix unrelated template metadata here.

**Acceptance:** exact price/program survives all declared paths; no accidental admission of imported/custom spells; unsupported versions remain preserved/manual. Rollback only correction code; never strip saved typed price data back out. Expected output: bounded patch/tests/evidence and honest caller coverage. Dependencies: implementation approval; canonical new-program schema only for the later extension test cases.

## Next contract after these repairs

[CR-A1: reviewed authored-spell admission](CR-A1-AUTHORED-SPELL-ADMISSION.md) must be prepared/frozen after HeadQ mechanics review. Editing resource controls or merely fixing exports does not make a newly authored spell executable.

</details>
