# Spell Wizard — current evidence and required reconstruction

## HeadQ R1 progress

The zero-AP and resourceCost serializer/template findings below have now been reproduced with unmodified production bodies on an isolated real-React browser page, including loading/actual edit0→1, passive/unselected0 and positive2 controls. [Correction contracts and exact paths](implementation/CR-W1-WIZARD-CORRECTIONS.md) record context/visual mocks and the distinction from raw library export. This is not a full-App save/provider/persistence witness.

The seven now have42 structured proposed programs. [R1 controls/fields](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md), [immutable admission path](implementation/CR-A1-AUTHORED-SPELL-ADMISSION.md) and [lifecycle blockers](implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) supersede the initial undefined extension direction. Existing `handleLoadSpell`'s enumerated map must explicitly preserve the new namespace; editor changes alone never admit execution.

## CONFIRMED source findings

| Finding | Evidence | Consequence |
|---|---|---|
| Resource step is a hardcoded category list with generic numbers/formulas | `Step5Resources.jsx:87–217,486–508` | Existing labels for historical classes are not proof of typed authoring support |
| Sphere editor exposes holy/shadow/fire/ice/nature/healing/chaos aliases, rather than the current eight-element vocabulary | `Step5Resources.jsx:106–120`; compare `classResourceBanks.js:4` | Need explicit canonical authoring and scoped read migration; never turn Arcanoneer into one element |
| AP zero is replaced with 1 in resource-step save effect | `Step5Resources.jsx:424–434` uses `|| 1` | Free actions/passives need a zero-preserving path; reproduce in mounted browser before fixing |
| Quarry helper says successful attacks generate Marks and permits a 0–10 hint | `Step5Resources.jsx:366–371` | Contradicts current companion-only 0–5 contract; labels must come from the domain |
| LOAD_SPELL replaces state with payload rather than merging defaults | `spellWizardContext.js:1255–1259` | Reopen fixtures must cover missing legacy sections and unknown future fields |
| Provider validation dependency projection omits resourceCost | `spellWizardContext.js:1295–1340` | Verify cost-only edits trigger complete validation, not merely local warnings |
| Serializer removes resourceCost as “calculated” | `core/utils/spellSerializer.js:618–632` | Export/template JSON loses authored resource configuration |
| Main library save explicitly includes resourceCost | `SpellwizardApp.jsx:255–280` | Do not claim all library saves lose costs; there are divergent paths |
| Review save retains state but also calls lossy serializer and generates ID from name | `Step10Review.jsx:2623–2632` | Library payload, serializedData and gameCode can disagree; edit-ID stability needs testing |
| Display normalizer uses legacy electric→lightning and viscera→necrotic map | `core/utils/spellNormalizer.js:22–32` | Conflicts with canonical damageTypes and sphere migration semantics; do not infer canonical runtime typing from cards |
| Original P9 only accepts original class definitions and strict supported shapes | `services/spellConsequence.js:69–73,130–181,258+` | Wizard-created custom spells are not automatically authoritative |

These began as source observations. The two cost defects now have the isolated reproduction above; the other observations and full provider/save/library integration remain source-only or unfinished. Never infer that every library export loses costs, and never repair a serializer without tracing its actual callers.

## PROPOSED authoring flow

1. Choose class/domain from actual available candidates; show production/preview/manual execution status separately.
2. Open the class-owned editor inside the existing resource step. Shared AP/mana inputs preserve explicit zero; materials and components remain part of authored data.
3. Author operations through structured controls: exact ingredients, pitch counts, wager stakes/outcomes, link endpoints/event, branch weights, summon capacity/order, anchor/traits, quarry evidence, anatomy slots, glyph sequence, impact vector.
4. Validate locally and in final review using the same pure domain schema. Invalid drafts remain editable; “save draft” and “publish valid spell” are distinct statuses.
5. Preview against a supplied resource-state fixture without mutating the character or consuming RNG. Show exact shortages, required forms/entities and unsupported runtime dependencies.
6. Save one canonical authored payload. Exports, templates, library records and review use the same serializer; game-code export is explicitly a different view only if it preserves a round-trippable canonical source.
7. Reopen by stable ID/version, decode old encodings explicitly, preserve unknown fields, and never silently drop an unsupported domain.
8. Spell cards render a pure domain summary; actual casts route only to supported existing-authority capabilities. An unsupported action remains visibly manual.

## Proposed editor contracts

| Editor | Required controls | Validation examples |
|---|---|---|
| Spheres | Canonical eight ingredients and gains, multiplicity | Recipe uses exact types; no untyped aggregate positive gain |
| Notes | Seven pitch counts; sequence only if a separately defined mechanic requires order | Per-pitch cap; distinguish multiset from ordered performance |
| Wager | Declared event, eligible roll, stake asset/amount, hand requirement, outcome table, expiry | No result-dependent stake edits; no negative escrow; probability weights valid |
| Fate link | Two distinct exact target slots, event, direction, amount, uses, duration | No self-loop/cycle; no redirect of cost or redirect-generated events |
| Chaos | Finite branch labels, weights, branch payloads, tile consumption, downside | Weights positive integers; visible distribution sums; branches bounded and nonrecursive |
| Dead roster | Creature template/version, capacity, order, AP source, duration, release | Named summon identity; no free actor turns or unbounded army |
| Undeath | Trait/stage, incompatibilities, sacrifice, anchor use and vulnerability | No free resurrection, duplicated anchor, unapproved max-HP rewrite |
| Quarry | Required evidence, generation source and timing, exact target, spend | Solo/companion mode is explicit and internally viable |
| Anatomy | Required/occupied slots, mutually exclusive traits, transition, recovery | No overlapping anatomy, impossible body interface or invisible penalty |

## Twelve-stage acceptance loop

For each domain: open → editor visible → author → validate → preview → save → reopen → card → cast support decision → accepted resource update → HUD → second-client convergence. Include negative cases at every boundary. Test both main save and Review save, raw JSON export/import, templates, duplicated spells, rename, edit-existing ID, zero costs, unknown versions, and rejected/unknown commands.

## Still incomplete

Full reducer/resource-manager/save/load consumer trace, mounted wizard fixtures, all 21 domain encodings, final extension schema and exact per-operation effect adapters. CR3 cannot be implemented from this document alone before CR1 settles the schema and CR2 provides validators.
