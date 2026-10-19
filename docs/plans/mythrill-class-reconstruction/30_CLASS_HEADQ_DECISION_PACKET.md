# Class HeadQ decision packet — seven priority candidates, R1

**Current continuation supersession (2026-10-18):** this R1 packet is retained research. Class HeadQ has parked A1b/shared engine integration under Main Mythrill HeadQ and resumed complete class content. Latest settled decisions: Druid; Augur into Fate Weaver with useful content preserved; Harbinger becomes Doomsayer; Oracle independent. [Class-first reset](33_CLASS_DELIVERY_RESET_AND_ENGINE_HANDOFF.md), [first complete Chaos Weaver package](implementation/CLASS-C1-CHAOS-WEAVER.md). Older open naming/merger questions and infrastructure-first gates below are superseded, not application migrations.

**Milestone: coherent design package prepared for HeadQ review.** **DESIGN INTENT: Druid's player-facing name and the selective familiar-naming principle are approved.** The anatomical economy, specializations, native additions and other game designs below remain **PROPOSED**, not an approved final roster. Application implementation remains unauthorized. The original master assignment remains incomplete.

**Later HeadQ result:** seven core directions are accepted for prototype development, not exact tuning/abilities/trees/natives. [32](32_FROZEN_HANDOFF_AND_PROTOTYPE_ACCEPTANCE.md) now contains the frozen W1a/W1b/A1a handoff and exact dependency boundary. This does not authorize code or migration.

Read this packet first, then the seven dossiers and [shared R1 timing/serialization rules](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). The earlier investigation-v0 material is preserved in each dossier but is not an alternative active specification.

## 1. Compact comparison and recommendations

| Candidate | Repeated player decision | Exact R1 economy | Three playstyles | Recommended native origins |
|---|---|---|---|---|
| [Gambler](classes/gambler.md) | Which card/stake to commit before the result; retain a pair or wager it |20-card short deck, hand≤5, Fortune0–7, one escrow; base stake1–2, High Roller3; no depletion catastrophe | High Roller / Card Sharp / Odds Broker | Merryn, Alchemite; separate actual House initiation |
| [Fate Weaver](classes/fate-weaver.md) | Which lives to connect, which threads to occupy, when to cut/re-anchor |3 reusable free/reserved/recovering tokens; bounded one/two-use links; transfer≤3 original assigned damage | Covenant Weaver / Severer / Tapestry Keeper | Weft obligation-web school, not all Gambit natives |
| [Chaos Weaver](classes/chaos-weaver.md) | Choose visible odds and exhausted options, or reserve a place/continuation |6 unique Surge/Shift/Fracture tiles; declare sample before draw, spend every committed tile; paid recovery | Probability Sculptor / Anomaly Binder / Cascade Weaver | Alchemite anomaly-containment school, distinct from House wagers |
| [Deathcaller](classes/deathcaller.md) | Which dead actors to manifest and command with your own actions |3 prepared named patterns, capacity2, orders2/own turn, caster AP, one actor action; pattern vitality persists | Grave Marshal / Soul Shepherd / Ossuary Architect | Bedel named crypt dead; Nethien filed-witness command discipline |
| [Lichborne](classes/lichborne.md) | Advance personal undeath or preserve/protect a finite anchor |Integrity0–12, stage0–2, two prepared trait/vulnerability pairs; advance costs2; return costs6 and is dormant, not a combat reset | Rime Sovereign / Phylactery Keeper / Veil Scholar | Nethien Cold Hearth frost rite; Tessic finite keystone discipline |
| [Hunter](classes/hunter.md), working name | Read/move/pressure one quarry; solo, pack or committed glaive route |Read/Angle/Pressure are distinct evidence; one NEW tag/own turn; actual companion optional for core loop | Stalker / Beastmaster / Trailblade | Individually verified Skald, Ordu, Arch/Broken Mimir, Cromyx, Anhur, Nereid hunt traditions |
| [Druid](classes/transformation-class.md), creator-approved player-facing name | Which two body capabilities to keep and which to suspend/change |4 anatomical slot types, active≤2, unrecovered transitions0–3; paid recovery removes a real trait temporarily | Predator / Adaptive Bastion / Mimic | Morgh/Amordjin reclamation and Arch/Broken Mimir plasticity/training |

**Naming:** Hunter remains a working name. **Druid is approved**, superseding Metamorph and earlier naming alternatives. Bodily transformation/adaptation remains core; no conventional Druid rules, nature worship, companion requirements or heritage assignments follow from the name. Existing Shaper IDs/compatibility stay intact pending explicit migration approval. [Decision and identifier scope](31_CREATOR_NAMING_DECISION_DRUID.md).

## 2. What this milestone now contains

- Current-source reconciliation, including newer local P12A/P12B versus the still-bounded P9: [source report](27_HEADQ_SOURCE_RECONCILIATION.md).
- Reviewed all25 heritage records in five bounded cohorts, all102 current native variants/edges with raw/effective access, requirements, institutions and capability/cost status. [Cultural report and complete matrix](28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).
- Seven updated R1 dossiers: exact limits/operations/reset/failure rules, three concrete specialization behaviors, a legal level3 three-turn example with explicit4-AP arithmetic, noncombat use, origins, Wizard/runtime/HUD and compatibility treatment.
- **42 fully structured proposed representative abilities**, six per class, one signature per tree: [combined JSON](evidence/headq-seven-abilities.json), split under `classes/manifests/`. These are review-schema records, not current executable app definitions.
- Level1–10 progression outlines and explicit remaining-content requirements; no complete library production around unapproved mechanics.
- Full relevant legacy spell IDs, talent/node/materialized talent-spell IDs, parent resource engines and heritage lists: [compatibility index](evidence/headq-priority-compatibility.json). Disposition remains preserve/no automatic remap.
- Exact isolated reproductions and bounded proposed corrections for AP0 and serializer/template cost loss: [CR-W1a/b](implementation/CR-W1-WIZARD-CORRECTIONS.md).
- Validated authoring-to-admission-to-execution path proposal and authoritative lifecycle requirements: [CR-A1](implementation/CR-A1-AUTHORED-SPELL-ADMISSION.md), [CR-L1](implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md).

## 3. Contradictions resolved in the active recommendation

1. **No cross-tree theft in examples:** level3 has15 talent points; each example uses at most its own11-point signature gate. Card Sharp no longer stakes3 using High Roller’s rule.
2. **No zero-resource soft lock:** Gambler can recover a first Fortune by a paid real-card Recut; Chaos can recover spent tiles; core management features do not consume a mandatory level1 spell pick. Ordinary universal actions remain available.
3. **No free base Chaos exchange:** removed from base R1. The Alchemite exception is once/rest, consumes a real spare part and imposes5ft movement loss; it costs0 additional AP but conserves all6 IDs and never selects an outcome. This material/position price makes it useful without an unlimited free loop.
4. **No dismiss-to-heal summons:** pattern vitality carries through dismissal/re-manifestation/guardian merges. Defeated patterns are not reset by encounter/UI changes.
5. **No infinitely renewed links:** re-anchor retains uses/expiry; one link wins per original event; transferred burden cannot chain or be mitigated/warded a second time. Assigned versus clamped applied damage is distinguished.
6. **No double body prevention:** Brace4 replaces, rather than adds to, plating2 and consumes that window’s prevention budget. Suspended/removed traits grant no permissions.
7. **No Hunter companion tax:** every Stalker requirement has a real solo generator; all sources share one generation budget. Old sensory Trades/companions remain intact in compatibility.
8. **No immortal reset:** Lich return requires actual confirmed death, finite reserve and intact anchor; dormant recovery has no immediate HP/AP/turn/AoE reward. Suppressing undeath also suppresses return.
9. **No blanket heritage inheritance:**19 recommended pairings follow specific school/interface evidence; e.g. Merryn mortuary ink does not automatically make them Deathcallers, and Riven severance does not make them liches.
10. **No editor-equals-executor claim:** current load/serialization/admission and missing authority/lifecycle capabilities are separately specified.

## 4. Remaining HeadQ choices

These are genuinely creative/rules decisions, not source facts for HeadQ to rediscover.

| Choice | Recommendation | Consequence if selected |
|---|---|---|
| Core economy/tuning | Review the seven R1 economies with fixed prototype limits, not seven renamed meters | Enables bounded playtest/content work; amounts may later change through versioned tuning, not silent implementation guesses |
| Gambler short deck and reset |20 cards/5 ranks, completed-rest Fortune3/hand5, carry state between encounters | Legible finite hand/pair play and real wagers; less conventional than a52-card deck but far easier to track. Replacing deck size requires revisiting hand odds and every pattern |
| Fate transfer semantics | One≤3-point burden after original mitigation/ward, no second mitigation/chaining; earliest accepted eligible link wins | Requires atomic multi-actor support; avoids resistance/ward loops and retroactive receipt rewrites |
| Lich survival | Pay6 integrity for dormant post-scene/long-rest-at-anchor recovery, HP1, no new turn | Strong undeath fantasy without routine combat resurrection; physical anchor vulnerability matters. More immediate return would need a separate death/turn contract |
| Hunter source/method scope | One learned-field class plus actual Quiet-Traded method; Beastmaster requires real companion only for its actions | Familiar solo Hunter is viable; preserve Sylas’s Trade and every old character’s sacrifice rather than pretending the name change heals it |
| Hunter name | Hunter remains the recommended working name | Druid's name is already settled and must not be reopened here; no global Apex/Shaper replacement or ID migration is approved |
| Origins/institutions | Approve/revise the19 pairing recommendations and distinct proposed Thread Court/Variance Circle/mortuary/Cold Hearth teaching roles | New schools are explicitly proposed, not retroactively canonical; no new omniscient founder/current leader invented to fill a field |

Existing mandatory retirements/restorations, Animist retention, Monk investigation, Arcanoneer all-eight and Calm TTRPG are not reopened.

## 5. Technical blockers before authoritative class prototypes

1. **Authoring correctness:** preserve explicit0 AP and exact resourceCost; canonical program/version must survive enumerated App load, both saves, review, normalization, export/template and card display.
2. **Reviewed definition admission:** server resolves immutable admitted bytes/version/hash, supported opcode/compiler and learned class/ruleset. Personal edits cannot self-admit or overwrite old identity.
3. **Revisioned new domain homes:** none of these seven state models is a current P9 class home. Strict validation/conservation, not permissive clamping or HUD direct-set, owns mutations.
4. **Original event/turn/rest identity:** once-only boundary/generation/expiry and recorded RNG; no local timers, repeated notification hooks or reconnect refills.
5. **Atomic links/multi-actor commands:** P7 currently supports at most two actors. Link routing and coordinated summons can need up to four plus a typed effect object. No concealed sequential approximation.
6. **Entity/anchor/body lifecycle:** admitted summon creation/removal and pattern HP coupling; physical anchor/item projection/repair/death; trait permissions/restrictions/suppression; actual companion action and weapon commitment.
7. **Movement/zone legality:** an existing template preview or freely moved token is not proof of voluntary crossing, legal path, range/LoE or visibility. Use GM-confirmed events until an approved authoritative policy exists.
8. **Privacy/recovery/persistence:** server-only deck/bag/choice data, scoped owner/GM/observer projections, checkpoint-safe exact pending intents and personal-versus-room reconciliation.
9. **Heritage execution:** current named edge/cost layer is advisory; native incompatible-state adapter bypass must be fixed before any automatic effects. No raw unlimited variant benefits imported.

These are explicit dependencies on current P10–P14 owners and new named contracts, not an instruction to replace the engine or approve all future phases.

## 6. Verification performed for this return

- Fresh baseline comparison: previous136 inputs unchanged; current branch/HEAD/status and169 hash inputs preserved in a new capture.
- Concurrent book/spell-picker, camera and wall-editor status changes appeared later and were preserved. A narrow [follow-up](evidence/headq-concurrent-followup.json) records their extra projection/geometry consumers; captured authority inputs remain stable. This is not whole-current-App source acceptance.
- Fresh pure production P9 admission count still4 originals/three domains, while actual P12A strike/P12B declaration/wear source is recognized separately.
- All25 current cultural records/all102 normal native access rows and paired edges reviewed; new native assignments remain proposals.
- Isolated production-source/real-React Wizard witness: loaded/edited0 becomes1; PASSIVE/unselected0 also becomes1; positive2 remains2; actual serialize/template/instantiate lose cost, raw library export is a separate source path. No personal storage or main app save used.
- [Review validation](evidence/headq-review-validation.json):42 unique complete review records/21 signatures, AP equations, card/tile/token/order/integrity/evidence/body invariants, old-ID preservation, archived v0 hashes, actual repro outputs and source-drift checks. This is design consistency/math, **not** a production executor or full application acceptance.
- [Packet identity manifest](evidence/headq-packet-manifest.json) pins the exact proposal/document/record bytes for review. It is not a production-source build seal or approval.
- The earlier59 tests remain earlier checkpoint evidence, not falsely reported as a fresh full integration run. No production build required for planning-only work.

## 7. Exact unfinished deliverables from the original assignment

**Roster/dossiers:** complete independent review dossiers for Arcanoneer, Berserker, Harbinger, Chronarch, Inquisitor, False Prophet, Lunarch, Martyr, Minstrel, Plaguebringer, **Animist**, Pyrofiend, Spellguard, Toxicologist, Warden, Augur and Crusader; historical Inscriptor, Titan, Exorcist, Covenbane, Witch Doctor, Primalist, Dreadnaught, Bladedancer and Oracle; independent **Monk**. The34-candidate frontier is not an approved final roster. Doomsayer/Huntress/Formbender remain genealogical comparison cases.

**Priority content still not produced:** complete selectable spell libraries/pool choices1–10; every talent node/rank/prerequisite/full50-point build and hybrid behavior; separate full three-turn demonstrations for every tree beyond this milestone’s one legal class example; final starting equipment/proficiencies/features and high-level class content; final approved native variant prose/quotations, founders/orders/location/friction/NPC relationships and actual paired-cost execution. Six representative abilities are not a complete class.

**Archaeology/matrices:** complete historical spell/talent payload transfer table, earliest/alias/icon classification, earlier Huntress and Chaos/Doomsayer lineage, all art suitability and spell-icon/background inventory; nested/conditional damage and tree-specific element bias, full generator/spender/support completeness and cross-roster overlap tests. Current authored inventory/counts remain preserved.

**Technical completion:** approved runtime schemas/opcode compilers/authoring controls, every remaining current resource authoring path, real accepted execution/lifecycle/turn/rest/area/reaction capability work, all-class compact/expanded SVG/menu/card/tooltip specifications and browser/accessibility proof, exact versioned per-ID migration maps/persistence fixtures, independently executable implementation cohorts and verified regressions.

**Rules/release:** complete per-class separate Laws replacement chapters, render/print/cache consumer reconciliation, final canon review, creative roster selection and real playtests. Live backend/rules, deployed restart, physical two-device and human/tabletop gates are not closed by this design review.

## 8. Recommended next bounded contract after review

The handoff is now frozen: [CR-W1a](implementation/CR-W1a-ZERO-AP.md), [CR-W1b](implementation/CR-W1b-RESOURCE-COST-ROUNDTRIP.md), and [CR-A1a](implementation/CR-A1a-DEFINITION-INFRASTRUCTURE.md). A1a's server-only explicit-price definition/descriptor/transition infrastructure can be prepared independently. W1 corrections are prerequisites to **end-to-end Wizard** acceptance, followed by a separately frozen live A1b authority/install/cast witness. No new class domains/entities/reactions/areas are in A1a and no implementation is authorized by this packet.

That sequence proves a newly Wizard-authored spell can become a validated executable definition before seven advanced class editors are mistaken for a working rules engine. It does not authorize implementation now. After the pilot, choose one reviewed finite-state domain cohort; do not hand DeepSeek “implement the remaining classes”.
