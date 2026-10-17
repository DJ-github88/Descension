# Prototype-direction acceptance and frozen handoff

## Current creator/HeadQ decision

**DESIGN INTENT:** the seven core directions—Gambler, Fate Weaver, Chaos Weaver, Deathcaller, Lichborne, Hunter and Druid—are accepted **for prototype development**. Exact tuning, individual abilities, specializations and native assignments remain provisional. Druid is the approved player-facing name; Shaper compatibility and old identifiers remain intact. This does not authorize application implementation or migration.

## Complete frozen contracts

1. [CR-W1a — preserve explicitly authored zero AP](implementation/CR-W1a-ZERO-AP.md).
2. [CR-W1b — lossless resourceCost serializer/template round trip](implementation/CR-W1b-RESOURCE-COST-ROUNDTRIP.md).
3. [CR-A1a — immutable definition/descriptor/admission-planning infrastructure](implementation/CR-A1a-DEFINITION-INFRASTRUCTURE.md).

“Frozen” means the task scope, behavior, interfaces, files and tests are specified for handoff. It is not permission to run the implementation. The earlier combined W1/A1 proposal documents remain historical evidence, not competing specifications.

## Recommended execution order after separate authorization

**W1a → W1b → A1a**, then separately freeze the live A1b/integration contract. W1a and W1b are independently testable/disjoint and may be scheduled independently. A1a's server-only explicit-price fixtures/module can also be prepared independently. Prefer the stated sequence for a single implementation agent because it repairs the authoring source before proving admission identity.

```text
W1a: fixed AP0/default preservation ─┐
                                  ├─ exact-price Wizard save/export/reopen gate ─┐
W1b: serializer/template retention ─┘                                           │
                                                                              ├─ later live admission/execution acceptance
A1a: strict DTO/hash/descriptor + authority-checked candidate-registry plans ─────┘
```

No arithmetic/hash unit test substitutes for that exact-price integration gate. A saved spell is a draft, a descriptor is a syntax result, a planned admission is not installed authority, and none is an executed cast.

## Architectural choices now resolved

- **Defaults:** current Step5 default1 stays when both authored AP encodings are genuinely absent; no new passive/free-action default policy. Explicit0 wins. AP-row deselection does not waive an existing common AP price. The total-resource estimator retains its genuine-missing recommendation fallback.
- **Serialization:** preserve resourceCost; retain existing intentional top-level private cleanup; deep-copy template state before dotted resource changes. No missing-price synthesis or migration.
- **Module boundary:** A1a is server-only CJS; no frontend/server shared-package/bundler refactor.
- **Pilot:** one immediate single-target direct DICE damage/heal descriptor, AP/mana only, no stats in its closed NdM±integer grammar and no new domain/entity/effect engine.
- **Scope/identity:** exact room scope, immutable UUID/version/hash, explicit `prism/cr-a1a-pilot-1` binding and canonical current class ID. Binding is a pilot policy tag, not a global ruleset/save conversion.
- **Authority:** required server-owned authorizer port for candidate transitions; current authenticated/bound room GM and authority, no authored trust flag. Output is always uninstalled/execution-disabled.
- **Persistence:** bounded validated registry codec/JSON reconstruction, not a new live storage owner/path. Live authoritative installation/transport/persistence/actor binding remain explicit blockers for A1b, not guesses for A1a.

There is no remaining architecture choice inside the frozen A1a scope. If live admission UI/storage/casting is demanded inside it, stop for an amended contract: those omitted integration choices would then be blockers, not permission to rewrite the engine.

## Current source reconciliation

Current branch/HEAD/status and focused source hashes are recorded in [frozen-handoff-source.json](evidence/frozen-handoff-source.json). Step5 falsey defaults, initial1 AP, serializer deletion and shallow template copy were checked against current source. P9 strict original-definition support and current P12 strike/block/wear seams remain protected. No production suite/build was rerun for this planning-only freeze.

Server golden contract vectors are [CR-A1a-definition-vectors.json](implementation/fixtures/CR-A1a-definition-vectors.json). They are data/identity expectations, not application implementation or approved playable content. The capture tool uses the existing pure checkpoint canonical/hash helpers and writes only planning evidence.

[Frozen handoff manifest](implementation/frozen-handoff-manifest.json) hashes the exact current contracts/data/index/decision/backlog bytes and records scope-limited source consistency. Validation commands from repo root: `node docs/plans/mythrill-class-reconstruction/evidence/validate-frozen-handoff.cjs`, then `node docs/plans/mythrill-class-reconstruction/evidence/validate-package.cjs`. These are planning checks, not the proposed implementation test commands. Preserve older HeadQ review manifests as historical checkpoint identities.

## Original reconstruction backlog remains open

See [HeadQ packet §7](30_CLASS_HEADQ_DECISION_PACKET.md#7-exact-unfinished-deliverables-from-the-original-assignment) and [completion ledger](26_COMPLETION_AND_CONTINUATION.md). Remaining27 candidate dossiers include Animist and the historical candidates/Monk; all full libraries,50-point talent trees, final variant/gear/lore work, archaeology/asset/element matrices, advanced runtime/UI/migration/Laws and playtest/release gates remain. Accepting seven core directions and freezing three infrastructure/correction contracts does not complete the class assignment.
