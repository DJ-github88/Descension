# CR0-R — complete reconstruction research before application contracts

**Task type:** investigation/design coordination checklist. **Authorization:** creator's master reconstruction prompt, no application/canon changes. **Status:** NOT one executable implementation unit; split into bounded record/domain cohorts. Start with [CR0-H1](CR0-H1.md).

## Goal

Close the specific remaining source, history, heritage and authoring gaps in the existing planning package, then report which design contracts can actually be frozen. Preserve all current uncommitted work and final retirement decisions.

## Source evidence

- Root AGENTS/CLAUDE, current ENGINEERING_STATE, P11–P14 roadmap §11 and NEXT_SLICES_CONTRACT20261017.
- Current census/source hashes, authored-spells, historical-definitions/census, pre-consolidation index and asset-inventory under `../evidence/`.
- Baseline master HEAD8ea1abff; refresh before work. History pivot fc096627 and its parent. Package source observations are tied to the inspected working tree, not just HEAD.
- Creator decisions in `01_EXECUTIVE_DECISIONS.md` and durable Mind `class-reconstruction-creator-direction-20261017`.

## Exact allowed target files

Only `docs/plans/mythrill-class-reconstruction/**/*.md`, planning-only evidence JSON/text, and analysis/validation scripts under its `evidence/` directory. Create substantive missing dossiers/research appendices as needed. Existing application, canon, Laws, tests, assets and user files are read-only. No commit/push/reset/stash/clean/revert/delete/rename of application work.

## Preserve

All21 current class records,1,026 spell IDs,65 trees,25 heritage IDs/102 native pairings, Gambit/Revenant/Shaper compatibility implementations, current artwork and dirty P10–P12 work. Preserve original census artifacts or explicitly version a refreshed capture if concurrent source drift occurs; do not silently relabel an old test run as new-source evidence.

## Required research outputs

### R1 — all25 heritage review

Read all10 race modules and25 subrace records in full, with corresponding class variants, typed edges, origin/order/faction/NPC/location and current naming/lore authority. For each heritage record produce: retained natives, retiring natives/lost relationships, proposed restored natives with exact justification, rare routes/requirements, body incompatibilities, conditional advantage+paired cost and unresolved conflicts. Mark proposals; do not populate every possible pairing. Resolve current runtime display names versus stale canonical-document names explicitly.

### R2 — full genealogy and assets

Historical modules often use `exampleSpells`, not `spells`. Count both without double-counting, compare each ID/payload and every talent to current owners, classify rename/merge/inferred relationship, inspect earlier Huntress revisions and Chaos Weaver/Doomsayer transfers. Classify every historical icon basename into actual class/alias/art revision/placeholder with source evidence. Inventory spell icons/backgrounds and validate current279 class-illustration references for reuse. Do not delete archives.

### R3 — remaining lifecycle/runtime consumers

Complete all class initializers, turn/rest boundaries, generation event callers, talent passive/grant execution, level-up selection, class/race method/body compatibility, room projection, personal save/runtime overlay and Laws consumers. For every resource distinguish local bookkeeping from current authoritative capability. Recount P9 support using current bytes.

### R4 — wizard reproduction and schema trace

Inspect resourceManager/validation/reducer/load/save/library/template/export/normalizer/card paths in full. Reproduce AP0 and export-cost-loss in isolated browser fixtures without altering personal saves. Test both main and Review save, stable edit IDs, class extension preservation and cost-only validation. Confirm exact supported schema before writing representative examples. Existing localhost browser is convenient but not source-frozen acceptance; record that limit.

### R5 — complete candidate analysis

Finish the five-test comparison and substantive dossiers for remaining retained/historical candidates, especially Inscriptor, Titan, Exorcist/Covenbane/Inquisitor, Witch Doctor/Primalist, Dreadnaught/Martyr/Warden, Bladedancer/Monk and separate Oracle/Augur/Harbinger. Expand existing priority drafts into final proposed bounds, per-level1–10 progression, three complete50-point trees, numerical tree examples, real provenance/native variants and at least six fully structured spells each. Keep fixed creator decisions separate from proposed tuning.

### R6 — contract closure

Specify exact classResourceProgram placement/operation schemas, server conservation and effect dependencies, privacy, lifecycle/reset and rollback. Complete per-ID migration maps and full restored spell manifests. Freeze only bounded contracts whose required creative decisions and engine dependencies are explicit; report all others as blocked/incomplete.

## Data schema / mechanics

This contract changes planning schemas only. Source inventories retain source path, commit or working-copy hash, evidence label, field/count methodology, support level and unresolved interpretation. Proposed class/spell schemas must identify every new field and required editor/serializer/runtime/tooltip/SVG consumer. No prose execution or shared generic class scalar.

## UI requirements

Preserve Calm TTRPG; resource SVGs import current calmBarPalette; windows use adventure tokens. Read-only browser checks for current Codex/wizard; no account/logout or saved-character mutation. Future UI specifications include owner/GM/observer visibility, keyboard/touch and reduced motion.

## Verification commands

From `D:\VTT`, after verifying evidence parent exists:

```powershell
node docs/plans/mythrill-class-reconstruction/evidence/collect-current.cjs
node docs/plans/mythrill-class-reconstruction/evidence/collect-history.cjs
node docs/plans/mythrill-class-reconstruction/evidence/collect-assets.cjs
node docs/plans/mythrill-class-reconstruction/evidence/render-current.cjs
node docs/plans/mythrill-class-reconstruction/evidence/render-history.cjs
node docs/plans/mythrill-class-reconstruction/evidence/validate-package.cjs
```

Current collector files overwrite their generated evidence documents; compare hashes and preserve/version old captures when source has changed. Renderers overwrite generated02/03/07/08/10/12 sections, so keep human additions in appendices or deliberately update renderer sources. Planning-only helper scripts must not become application dependencies.

Focused existing6-suite command is recorded in `19_TESTING_AND_ACCEPTANCE.md`; run again only if needed for changed source/questions. No build required for research. Application implementation later follows detached-build AGENTS rules.

## Acceptance criteria

- All25 heritage rows have actual reviewed evidence and bounded proposed successor variants, or an explicit evidence conflict requiring creator decision.
- Every historical spell/talent/icon is classified with exact provenance; no “null spells means none” error.
- Every current resource has an actual producer→planner→mutation→display→save/sync path and an honest execution level.
- Wizard round-trip/schema contradictions are reproduced or precisely labeled source-only/unresolved.
- Every candidate merits a substantive dossier or a reasoned defer/combine decision; no empty placeholders.
- Full spell manifests or enumerated remaining content deliverables exist; six complete structured representative records per analyzed class are validated against the intended schema.
- Master index, decision register, contracts and completion ledger agree. Missing essentials prevent implementation-ready status.
- Git diff confirms only intended planning artifacts were written; unrelated baseline work is preserved.

## Migration / dependencies / rollback

No application migration. Dependencies are current source availability, local Git history and creator canon decisions where real conflicts remain. If a research conclusion is superseded, annotate it with replacement evidence rather than deleting source history. Rollback is removal/reversion of this task's own newly added planning edits only after preserving useful findings; never touch user implementation work.

## Expected output

Updated indexed planning package, complete evidence ledgers, finished dossiers/manifests or exact residual list, schema proposal and individually executable next contracts. Final report must state whether the master definition of done is met. If not, supply an exact continuation prompt and save Mind checkpoint/session summary.
