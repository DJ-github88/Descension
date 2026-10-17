# CR-A1 — validated path for newly Wizard-authored spells

## Current bounded freeze

**[CR-A1a-DEFINITION-INFRASTRUCTURE.md](CR-A1a-DEFINITION-INFRASTRUCTURE.md) is the frozen A1a contract.** It resolves module placement to server-only CJS, scope to an exact room, pilot formulas to one stat-independent dice group±constant, authority to a required server-code port and persistence to a validated registry codec/transition plans only. No UI, endpoint, live installation or casting is in A1a. The prior broader A1a proposal below is superseded; do not implement its frontend/shared-package scope.

[W1a](CR-W1a-ZERO-AP.md) and [W1b](CR-W1b-RESOURCE-COST-ROUNDTRIP.md) are independent corrections. A1a fixtures/infrastructure can be prepared without them, but **real Wizard→admitted/executed acceptance cannot**. Live A1b transport/install/persistence/actor integration must be separately frozen and authorized. No existing P9/P12 changes or new class domains are authorized here.

<details>
<summary>Historical path proposal — architectural context, not competing A1a scope</summary>

**PROPOSED sequence after HeadQ review. No application implementation authorized.** This closes the gap between authoring controls and actual execution. Preserve original P9 support/definition guards; do not make any arbitrary library object executable by giving it an old ID.

## Current evidence

`supportSpell` resolves an original class entry and rejects altered mechanics; the Wizard's library records are not that source. P9 server validates owner-approved typed payment/shape, not arbitrary new rules. `SpellwizardApp.handleLoadSpell:482–596` enumerates fields and would discard a new top-level program. Serializer/AP correction contracts are prerequisites for trustworthy exact prices, not sufficient execution admission.

## Proposed full path

1. **Draft:** owner authors a canonical JSON definition in Wizard with a schema/ruleset version. Save as draft even when execution is unsupported; preview does not mutate resources or call RNG.
2. **Validate/compile:** a pure closed capability compiler checks schema, domain/opcode/argument bounds, target roles, prices, formulas, timing and required engine capabilities. It produces a deterministic execution descriptor or a precise manual/unsupported reason. No JavaScript, arbitrary JSON paths or prose execution.
3. **Review/admit:** GM explicitly admits an immutable definition into that campaign's definition registry. Review is of game mechanics/ownership/support, not a global trust flag on every imported spell. Store canonical bytes/hash and permitted class/ruleset, not a mutable personal-library pointer.
4. **Pin:** action uses `(campaignId,definitionId,definitionVersion,definitionHash,compilerVersion,capabilityId)` and exact actor/class home. Server resolves its own immutable definition; client cannot supply a forged after-state or lower price. Learnt/unlocked/talent/acquisition conditions are checked separately.
5. **Approve/execute:** reuse existing owner approval, exact refs/revisions, recorded choices/results, GM final adjudication and actor-consequence staging/admission/receipt. A new named binder/capability supports only its frozen scope. No local pre-spend and no bypass through P9's original resolver.
6. **Project/persist:** accepted result updates authoritative state, public/private summaries and matching personal home; custody supports same-intent recovery. Library edits make a new draft/version; no retroactive definition edits to a pending/accepted action.

Definitions can be revoked for new actions. Already accepted receipts remain unchanged; pending committed actions retain their exact pinned bytes and require an explicit finish/void/reconcile decision under their authored phase, never silently recompile against “latest”.

## Proposed immutable definition record

```text
{
 version:1,campaignId,definitionId,definitionVersion,
 canonicalSchemaVersion,definitionHash,
 canonicalDefinition:JSON,
 compilerVersion,capabilityId,
 permittedClassId,permittedRulesetVersion,
 admission:{gmUid,acceptedSequence,status:"admitted"|"revoked"},
 requiredCapabilities:[closed IDs],
 publicSummary:JSON
}
```

IDs are campaign-scoped, immutable and distinct from a display name, action-slot copy and retired class ID. Hash canonical JSON deterministically; compare full identity as existing commands do. Server stores the approved record through the established checkpoint/persistence admission owner. No field in a client-authored object can self-assert GM admission.

## CR-A1a — next bounded contract to prepare/freeze after HeadQ

**Goal:** canonical draft↔review↔immutable admitted-record flow and deterministic descriptor for exactly one simple shape; no seven-class domain runtime yet.

**Pilot shape:** ACTION, immediate, one exact target, exactly direct DICE damage **or** direct healing, explicit integer AP/mana including0, current approved formula vocabulary restricted to the five canonical attributes; no class program/resource, duration, save, critical effect, area, reaction, summon, link, movement or transformation. A descriptor is not yet a paid cast. This deliberately proves admission identity/serialization first.

**Proposed exact files:** new shared pure `vtt-react/src/components/spellcrafting-wizard/core/utils/authoredSpellDefinition.js` and its adjacent tests; new `server/services/authoredSpellDefinitions.js` with server tests; Wizard `SpellwizardApp.jsx`, `Step10Review.jsx` and `spellWizardContext.js` for explicit canonical namespace/validation preservation; new small review adapter/panel rather than extending every resource editor. Freeze shared code placement after checking server/client module interoperability; no second formula engine.

**Schema/mechanics:** record above; canonical payload has stable versioned ID and lossless price. Compiler refuses unknown keys/capabilities and produces `{supported,reason?,descriptor:{kind,formula,ap,mana,targetShape,capabilityId}}` only for the pilot shape. It reuses existing approved formula reading/normalization where semantically compatible. Unsupported class programs round-trip as drafts without a runnable descriptor.

**Preserve/prohibit:** retain all originals and P9-v1, both current producer paths, P12A/B binders, class resources/talents/heritage and persistence privacy. No changes to GM damage/defense rules, N-actor limits or legacy source IDs. No global “trusted spell” boolean, client hash-only admission or unreviewed widening of `supportShape`.

**Tests:** canonical bytes/hash stable after two save/reopens; explicit0 survives; modified content under same version/hash refused; unauthorized admission refused; same admitted ID cannot be overwritten; class/ruleset mismatch; unsupported R1 opcode remains draft; raw export positive control; revocation affects future descriptor requests only. Check resource-only edits trigger validation, and new namespace survives enumerated load.

**Concurrent consumer to account for at freeze:** the newly observed BookSpellPickerModal projection/forge uses a different `ap`/`manaCost`/plural-resource schema and can save library entries. Inventory that current path before freezing targets; a book block should reference an immutable admitted definition, not become a second mechanics source. Preserve unsupported program bytes/definition refs or visibly keep the block as a presentation draft. Do not broaden CR-W1a/b into unrelated book redesign, and do not infer automatic execution from a spell picker.

**Acceptance/output:** one reviewed record and exact deterministic descriptor survive reload/campaign scope; still visibly “admitted definition, runtime pilot pending”. Output patch/tests/record schema/repro evidence and a bounded CR-A1b runtime contract. No source file is called a new authoritative executor yet.

**Rollback/migration:** remove feature entry/adapter behind its named gate; keep canonical drafts/admission history. No old spell/class save conversion and no accepted consequences to refund. Dependencies: HeadQ core review; approval to implement; CR-W1a/b for exact prices. No creator decision is needed to preserve explicit zeros/identity, but game balance/admission of a particular spell stays the table's review.

## CR-A1b — subsequent execution pilot (contract outline, not frozen)

Add one named `authored-immediate:v1` binder/owner approval flow for the admitted pilot record, using the existing `actor_consequence` command/receipt path. Candidate seams: `actorConsequences.stage:259–272` binder selection/cross-domain identity reservation and `actorConsequenceHandlers:218–258` admission/consumption; a new authored approval handler/service; client authored action controller/private custody/panel and producer routing. Do not copy the whole combat system or silently route to direct GM consequence.

Before coding freeze exact binder interfaces for get/closed/consumed/bind/close and shared identity capacity, server definition lookup after awaits, revoked/pending behavior, private recovery families and client error/receipt projection. The pilot retains source+one-target, no new class state. Server recomputes admitted price/shape, binds one recorded roll/GM final amount and stages AP/mana plus HP once. Two simultaneous actions cannot spend the same pools; rejected command has no partial cost. Exact lost-ACK check returns receipt or honest unknown, never an automatic new cast.

Witness: Wizard author→save/reopen→GM admit→owner exact approval→GM result→one existing-authority receipt→HUD/personal save→second-client reconnect, including0 AP, insufficient resources, wrong class, changed definition, duplicated command, stale actor, revoked new action and unsupported program. This is the first genuine proof a newly Wizard-authored spell enters an executable path.

## Later seven-domain admission

Only after a domain's [lifecycle/authority contract](CR-L1-AUTHORITATIVE-LIFECYCLES.md), private state and strict opcode compiler exist can its42 representative definitions be admitted. A schema-valid link or summon still remains manual if atomic/entity support is missing. Capability availability is checked at admission **and** execution; neither an SVG nor a resource editor closes that gate.

</details>
