# World Effect Engine — Architectural Investigation

**Status:** completed research/design document; **nothing implemented**.

**Last source verification:** 2026-10-04, current on-disk Descension/Mythrill worktree.

**Decision:** **do not build a universal World Effect Engine.** Investigate a small zone runtime, supported by reusable spatial queries, explicit timing boundaries, bounded predicates, and consequence adapters. Existing domains retain their rules, authoring, state, and decision structures. Stateful experimentation depends on reliability fixes described below.

> **DON'T SIMULATE THE RPG CATEGORY. SIMULATE THE FANTASY THAT PRODUCED THE CATEGORY.**
>
> Represent burning ground because it burns, a broken wing because it cannot support flight, and a declared threat because players can respond. Sharing bookkeeping does not make these phenomena the same mechanic.

## Reading basis and evidence limits

The following completed investigations were read in full and used to focus source verification:

- [MYTHRILL_MASTER_AUDIT.md](MYTHRILL_MASTER_AUDIT.md): runtime map, protected architecture, giant-file risks, multiplayer/persistence drift, TD-001/002/003/006/008/009/012.
- [MYTHRILL_GAME_AND_IP_REVIEW.md](MYTHRILL_GAME_AND_IP_REVIEW.md): tabletop physicality, class identity, rules/runtime contradictions, the resource-rhythm hypothesis, and systems that must never be genericized.
- [CREATURE_SYSTEM_EVOLUTION.md](CREATURE_SYSTEM_EVOLUTION.md): existing authoring/consumers, optional anatomy and behavior proposals, corrected provenance findings, and its explicit do-not-absorb list.
- [COMMERCIAL_READINESS.md](COMMERCIAL_READINESS.md): P0-1/2/3/4 and relevant P1 findings, production-middleware coverage gaps, persistence tiers and recovery.
- [ASSET_ARCHAEOLOGY.md](ASSET_ARCHAEOLOGY.md): presentation assets and archive constraints; no asset cleanup is implied.

`docs/POST_AUDIT_IMPLEMENTATION_CHANGELOG.md` was absent when checked. Absence is not proof that no work occurred: relevant current files were inspected independently. These reports describe their audit-time worktrees, not deployed production. A reported fix, a passing isolated test, or a source comment does not establish end-to-end reliability.

**Evidence vocabulary:** **SHIPPED / EXECUTED** = wired into an application runtime path; **PARTIAL** = a working subset with gaps; **CONFIGURATION OR DATA ONLY** = authored/displayed without verified execution; **DORMANT / UNREFERENCED** = implementation without a verified runtime caller; **LEGACY** = historical/compatibility generation; **UNKNOWN** = insufficient evidence. Source-wired status does not claim deployed or playtested behavior.

**Verification performed here:** direct reads of relevant production paths and their registration/consumers; focused reference searches; comparison against the audits; a Playwright accessibility check of the existing `/game` AoE menu, `Place on Grid` arming, and Escape cancellation. No template was committed, combat run, room created, or cloud state deliberately changed. No new zone behavior or multiplayer/recovery path was executed. Prior audits' test totals are their evidence, not tests run for this document. Context7 tools were unavailable; this proposal does not introduce external-library APIs.

Full paths below are repository-relative. Shortened frontend paths are relative to `vtt-react/src/`; server basenames refer to their already-cited `server/handlers/` or `server/services/` paths. Line ranges identify the inspected revision and may move with development. **UNUSED BY APPLICATION != SAFE TO DELETE.** Dormant machinery, old data and assets retain potential creative value.

---

## CURRENT REUSABLE INFRASTRUCTURE

### Existing systems that should be reused

| Machinery | Current status and source evidence | Reuse boundary |
|---|---|---|
| Live AoE placement | **SHIPPED / EXECUTED.** `vtt-react/src/store/spellAoEStore.js:48–139`; `components/grid/SpellAoEPanel.jsx`; `components/Grid.jsx:3693–3706` mounts `SpellAoEOverlay`. Browser arming/cancellation observed. | Reuse its placement interaction and shape vocabulary. It is a local tool with **one** committed `placement`, not a collection of persistent zones. |
| Spatial geometry | **SHIPPED.** `vtt-react/src/utils/AoETemplates.js:19–227`: cone/circle/line/cube construction, polygon intersection, center-point token inclusion. Overlay calls these at `:134–179`. | Reuse geometry/query functions, with explicit units, map scope and mechanical geometry policy. Do not reproduce four shape generators. |
| Target selection | **SHIPPED, limited validation.** `vtt-react/src/store/targetingStore.js:67–131,206–238`: target/history/multi-selection; range and LOS use supplied `distance`/`hasLineOfSight`. | UI target selection adapter. It does not itself calculate trustworthy range/LOS or authorize a target. Current creature quick-use does not consume it. |
| Actor buffs/debuffs | **SHIPPED / PARTIAL.** `vtt-react/src/store/conditionStore.js:65–102,104–167,227–285,439–506`: source, target, stacking, duration, DOT/HOT metadata and token projection. | Keep actor conditions here. Zones invoke actor-condition operations through an adapter when a rule actually applies an actor condition; zones themselves are not buffs. |
| Manual condition markers | **SHIPPED.** `vtt-react/src/components/conditions/ConditionsWindow.jsx:196–230` writes directly to creature/character token `state.conditions`; token components mount the picker. | Retain manual adjudication and physical markers. These records are not automatically DOT/HOT records in `conditionStore`. |
| Over-time effect application | **SHIPPED / PARTIAL.** `vtt-react/src/services/effectProcessingService.js:141–310,317–369,425–534`; `App.jsx:1226–1243` starts realtime processing; `combatStore.nextTurn` invokes turn/round processing. | Reuse verified damage/healing/stat concepts and application endpoints. The service combines randomness, store lookups, resistance math, mutations and chat; it cannot be imported as a pure universal resolver unchanged. |
| Effect authoring/presets | **SHIPPED authoring.** `vtt-react/src/components/modals/BuffDebuffCreatorModal.jsx:338–413` builds numeric duration, formula, element, target and tick settings; `store/effectPresetStore.js:128–237` supplies Burning and other presets. | Reuse formula/element/duration controls and preset definitions where meanings match. Add a contained zone binding surface, not a second spell wizard. |
| Combat boundaries | **SHIPPED / PARTIAL.** `vtt-react/src/store/combatStore.js:295–586`: outgoing `turn_end`, condition decrement, cooldown processing, incoming `turn`, then `round` ticks; effects are deferred through `setTimeout`. | Combat owns turn order, AP and rounds. A narrow accepted-transition adapter supplies timing facts; new effects do not own or redefine combat progression. |
| Spell authoring | **SHIPPED authoring; execution varies.** `vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx` mounts `Step7Triggers`; `context/spellWizardContext.js` retains `triggerConfig`; `components/steps/Step8Channeling.jsx:362–397` authors aura/field/beam; `Step10Review.jsx:478–535` emits channeling/persistent fields. | Normalize supported authored targeting/duration/effect fields into runtime bindings. Preserve unsupported content with an honest manual-only explanation. |
| Character cast/resource workflows | **SHIPPED cost/confirmation paths.** `vtt-react/src/components/ui/ActionBar.jsx` uses class-resource plans, cooldown slots and emits `spell_cast` at `:1905–1927`; `components/character-sheet/SpellActionBar.jsx:885+` checks/spends costs and offers dice/cards/coins. | The cast domain owns costs, recipes, availability and cast lifecycle. A successful, explicit supported action may create a zone; the zone runtime never re-charges its cost. |
| Creature authoring and card adapters | **SHIPPED authoring/display; behavior execution missing.** `vtt-react/src/components/creature-wizard/components/steps/Step3Abilities.jsx:35–44,177–193,450+` stores priority bands and trigger conditions; `utils/creatureAbilityUtils.js:184–281` adapts abilities for cards. | Preserve original bands, `triggerCondition`, tactics and spell-shaped abilities. Card transformation is a presentation adapter, not a lossless runtime normalization contract. |
| Creature token state/application | **SHIPPED.** `vtt-react/src/store/creatureStore.js:364–409` merges state and emits updates; `components/grid/CreatureToken.jsx:1408–1479` confirms abilities, spends AP/mana and logs. | Creature instance facts remain on the token; definition facts remain on the creature. Consequence adapters address instances, never mutate the shared library definition. |
| Terrain/environment storage | **SHIPPED map/editor machinery; many mechanics DATA ONLY.** `vtt-react/src/store/levelEditorStore.js:312–1079,1922–1934,4624+`; `TerrainSystem.jsx` and `objects/ObjectSystem.jsx` consume map content. | Terrain/object identities and placement stay in their domain. Explicit mechanical attachments reference them without replacing textures or converting every tile into an actor. |
| Vision, coordinates, memory | **SHIPPED.** `vtt-react/src/utils/InfiniteGridSystem.js`, `ProjectionSystem.js`, `VisibilityCalculations.js`, `WallSpatialIndex.js`; `components/level-editor/MemorySnapshotManager.jsx`; `three/fogVisibility.js`. | Use coordinate/vision services and existing per-player memory discipline. Zone occupancy is world-space, not screen-space or camera visibility. |
| Three.js world presentation | **SHIPPED renderer.** `vtt-react/src/components/level-editor/three/ThreeDWorldLayer.jsx:184–204,495–710` coordinates prop/terrain/wall/light managers and fog inputs; `Grid.jsx:3761–3768` mounts world layers. | A downstream visual adapter; preserve orthographic projection, fresh canvas/WebGL guard, asset cache and shadow dirty flags. |
| Atmospherics/audio | **SHIPPED presentation.** `vtt-react/src/components/level-editor/AtmosphericEffectsManager.jsx:334–407` renders rain/snow/fog/storm/embers; mounted by `App.jsx` and `components/multiplayer/GameSurface.jsx`. `store/audioStore.js`, `services/audioEngine.js`, `server/handlers/audioHandlers.js` own sound. | Borrow visual-family vocabulary and scheduling intent. Screen-wide weather particles are not a world-space hazard renderer. Audio remains downstream and optional. |
| Multiplayer session infrastructure | **SHIPPED / PARTIAL.** `server/server.js` → `handlers/socketHandlers.js:603–655` → domain handlers; client `components/multiplayer/socketHandlers/registerAllHandlers.js`. Token ownership/delegation checks exist; token delta is flag-gated. | Reuse session identity, membership, routing, acknowledgements and broadcast infrastructure after relevant defects are fixed. Do not create another socket or transport. |
| Persistence and recovery lanes | **SHIPPED / PARTIAL.** `server/services/syncService.js` batches writes through `firebaseService.js`; client `hooks/useRoomPersistence.js`, `services/firebase/roomStateService.js`, `services/gameStateManager.js` serialize snapshots. | Reuse the corrected canonical room lane. Personal/device snapshots must not become a competing authority for shared zones. |

### Authored/configured is not executed

1. **Creature decision data:** the inspected quick-use path spends resources and writes chat; it does not score `priorityRange`, evaluate `triggerCondition`, select targets, resolve saves or apply attack damage. `Step3Abilities` authors richer data than that path executes. The creature report's zero-band/zero-trigger counts for the shipped library are useful audit evidence; they are not grounds to synthesize behavior for every creature.
2. **General trigger implementations:** `vtt-react/src/components/spellcrafting-wizard/core/mechanics/triggerSystem.js:583–845` has listeners, callbacks and timers, but focused consumer searches found no external runtime caller. Its `gameState.entities` assumptions do not match current stores consistently. `vtt-react/src/data/triggerUtils.js:215–275` produces effect descriptions/results; no verified runtime consumer. **DORMANT**, not two ready-to-run engines.
3. **Casting/channeling:** `castTimeSystem.js` exports initiation/progression/interruption functions, with configuration UI consumers; no live progression integration was found. `channelingSystem.js:1153–1171` damage/healing/status application helpers return placeholder success/results. Its expected `channelConfig`/concentration model also differs from emitted `channelingConfig`. **PARTIAL authoring, DORMANT/STUBBED runtime**, not an automatic lifecycle service.
4. **Cooldowns:** `cooldownSystem.js:1026–1064` is called by combat and `handleRest` by game state, while `ActionBar.jsx:1930+` separately maintains slot cooldowns and `gameStore` records. Some machinery runs; a single unified cooldown clock is not established. World effects must not create a third cooldown model.
5. **Terrain mechanics:** the professional registry includes `lava.damage = '2d6 fire'`, `acid.damage = '1d6 acid'` and `movementCost`; another registry describes different lava behavior in prose. The inspected `GridPathfinder.js` consumes walls/elevation/occupancy, not terrain damage or `movementCost`; `combatStore.validateMovement` does not apply terrain damage. Those fields are authoring evidence, not proof of executed hazards. Do not silently promote contradictory terrain descriptions into rules.
6. **Spell broadcasts:** `server/handlers/combatHandlers.js:280–301` relays casts; client `components/multiplayer/socketHandlers/combatHandlers.js:134–150` logs them and has an explicit effect-application TODO. The independent `vtt-react/src/utils/spellEffects.js:117–167` returns calculated results (including heritage events); tests call it, but no live application caller was found. Do not confuse that function with a shipped shared damage pipeline.

Specific stat/passive integrations can still evaluate limited conditions, for example health-threshold logic in `characterSlices/statsSlice.js:903+`. The conclusion is **fragmented execution**, not “Mythrill has no working conditions or triggers.”

### Audit claims checked against current source

| Prior evidence | Current check / correction | Design consequence |
|---|---|---|
| Master TD-002; Commercial P0-1: inline room state discarded | `server/services/firebaseService.js:128–138` still clears `gameState` before its fallback. | Reliable restart/resume is a prerequisite. Do not claim generic serialization fixes the reader. |
| Master TD-003; Commercial P0-2: false write accepted | `server/services/syncService.js:78–106` still ignores the boolean returned by `firebaseService.updateRoomGameState`, whose error path returns `false` at `:384–386`. | A resolution must distinguish live acceptance from durable save. Current batch success is not a durability receipt. |
| Commercial P0-3: resume duplicates arrays | `server/handlers/roomHandlers.js:159–167,182` still concatenates map arrays and turn order. | Replay/resume must be idempotent before timed consequences are enabled. |
| Master TD-001/009: acknowledgements/routing lost | `server/services/rateLimitService.js:185–226` wraps one `data` argument; `validationService.js:53–86` lacks current token routing/action fields. | Test the composed production middleware; do not attach damage to a packet that can be misrouted or never acknowledged. |
| Creature proposal §8: GM-side evaluation | Token and combat handlers validate/store/relay rather than simulate; `combatAuthority.js` remains opt-in. | Preserve GM adjudication, but distinguish **GM semantic evaluation** from **server commit/order authority**. Add no independent client authority for durable shared effects. |
| Creature proposal §9: persistence “tolerates unknown fields” | `vtt-react/src/services/firebase/roomStateService.js:51–76,118–141` explicitly enumerates saved/loaded fields. Missing arrays default safely; unknown new zone fields do **not** round-trip automatically. | Extend and test every selected serializer and snapshot applier explicitly. |
| Creature pass I: state deep merge | Pass II corrects it; `creatureStore.js:374–376` merges one level of `state`. Server `tokenHandlers.js:164–168` merges update fields into the token root. | Nested aspect/state updates need an agreed adapter/envelope; an arbitrary new nested object is not safely synchronized “for free.” |
| Conditions classified as shipped | `vtt-react/src/store/conditionStore.js:561–570` serializes duration from `endTime` and filters positive results, but round records do not get `endTime` at `:97–99`. Undefined-time arithmetic can filter those round records out. | Shipped application/ticking does not prove round-effect reload fidelity. Add that exact round-trip case before sharing expiry/persistence machinery. |
| Master protected data pipeline; Creature provenance correction | `scripts/extract-data.mjs` names removed creature sources; the creature report distinguishes shipped JSON from a functioning generator. | Protect version/cache behavior, but do not assume regeneration works. The slice need not regenerate the bestiary. |
| Game/IP resource-rhythm critique | Current `classResourceContracts.js:1–19` delegates to distinct contracts/banks, with special Martyr semantics at `:21–26`; `chronarchResourceContract.js` has distinct pools. | Treat convergence as a design hypothesis, not a mandate. Protect those domain contracts; shared consequences do not reshape class economies. |
| Master/Commercial room visibility and cross-room relay | `firestore.rules:133–135` still allows broad authenticated parent reads; `server/handlers/syncHandlers.js:58–101` searches global players for targeted recipients. | A new hidden-state feature cannot claim confidentiality through UI filtering. Correct delivery/storage access before using secrets. |

---

## PROPOSED BOUNDARIES

### Reject the universal entity-engine hypothesis; retain useful vocabulary

`ENTITY / STATE / TRIGGER / CONDITION / EFFECT / DURATION / SOURCE / VISIBILITY` is a useful explanatory checklist, **not a replacement object model or eight new mandatory stores**.

- **Entity** means a typed reference to an existing runtime instance, not an ECS migration.
- **State** means facts owned by that domain. `burning`, `wet`, `broken`, and ritual progress are not interchangeable numeric modifiers.
- **Trigger** is a discrete occurrence: entering an area, an accepted turn ending, or an explicit exposure. **Condition/predicate** decides whether its consequence applies. An actor status condition is a separate concept.
- **Effect/consequence** is an approved domain operation. It does not imply a universal mutation language.
- **Duration** is bookkeeping with a named clock and expiry boundary. **Source** records provenance/controller/definition, not authority by assertion.
- **Visibility** separates information entitlement, current perception, and remembered information. It is not a single hidden boolean.

Prefer this limited composition:

```text
Existing creature / spell / GM / encounter authoring
                    ↓ supported-field adapters
             Immutable resolution inputs
                    ↓
      Spatial query + boundary + bounded predicate
                    ↓
           Domain consequence proposal
                    ↓ validated, ordered commit
          Existing domain state + receipt
                    ↓
       2D / 2.5D / VFX / audio / tooltip adapters
```

**No universal `EffectManager`.** Share functions/contracts only when two actual consumers need the same semantics. A zone runtime may compose them without becoming their owner.

### Proposed shared primitives

| Primitive | Responsibility | Explicit exclusion |
|---|---|---|
| Typed instance reference and facts snapshot | Resolve exact target/source/map/encounter and versioned facts; missing facts report `unknown`. | No central copy of every creature, sheet, spell, object or lore entity. |
| Spatial query | World-space area membership and explicit contact queries, reusing AoE/grid/visibility math. | No pathfinding, movement/AP cost calculation, fluid flow, mesh collisions or renderer raycasts as game rules. |
| Boundary/expiry descriptor | Match accepted turn/round boundaries or declared cancellation; find due work once. | No universal time manipulation, per-effect animation timers, cooldown ownership or timeline-history editing. |
| Small predicate evaluator | Bounded comparisons, state membership, approved `all`/`any`/`not` over a supplied snapshot; return explanation/unknowns. | No arbitrary property-path evaluator, script callbacks or implicit proximity scans for every effect. |
| Consequence envelope and receipt | Identify source, target, prior revision, operation, resolved randomness and causal event; domain adapter validates/applies. | No generic unrestricted patch of the whole world; no class-resource/attack/anatomy logic inside the envelope. |
| Local reaction lookup | Match explicit susceptibilities on the contacted entity/state/profile. Initially one-step transformation. | No all-elements-by-all-materials matrix or ambient scan for possible reactions. |

The only proposed new stateful domain initially is **zone instances**. Predicate, spatial and timing primitives are libraries; networking and persistence remain session services. Receipts and a bounded replay guard are session metadata, not a new event-sourcing platform.

### Existing systems that should not be absorbed

| Keep outside | Why / permitted boundary |
|---|---|
| Combat/AP/initiative, attack/save rules, movement budgets | `combatStore` owns its decisions. Consume accepted boundaries; invoke an existing/verified damage adapter. Do not replace Mythrill's strike or Ladder of Trials with conventional attack/DC rules. |
| Class resource contracts, banks, heritage gates, talents | Pyrofiend's latch, Minstrel cadences, Arcanoneer recipes, Martyr bank and Chronarch pools remain distinct. A consequence may notify a domain-specific listener; it never grants resource generically. |
| Creature weighted behavior and tactics | Creature behavior chooses/suggests abilities. World facts only inform its predicates. No autonomous turns, universal “aggression” or replacement weight schema. |
| Anatomy/creature aspects | Creature domain owns track thresholds, targeting, overflow, repair and disabled abilities. Shared references/predicates can address aspects. |
| Spellcrafting, cast costs/timing, channel upkeep, cooldowns | Authoring and specialized lifecycle stay there. Supported runtime bindings can create/remove a zone. No reinterpretation of all channeled spells as hazards. |
| Conditions/stat calculation | Actor conditions retain their store and derived-stat integrations. A world-state tag is not a buff/debuff by default. |
| Terrain, map/editor, wall/elevation, fog/vision/memory | Keep map identities, projection and information models. Read them through adapters. A temporary surface state does not rewrite terrain assets. |
| Encounter decision rules; travel weather/clock; lore timelines | Encounter transitions are encounter logic; travel and lore history retain separate clocks. Shared bookkeeping does not merge their domains. |
| Inventory, containers, equipment/durability, crafting | Spatial packing and die-step durability already have their own engines. Only an explicitly adjudicated object interaction needs a consequence boundary. |
| Audio/VFX/rendering | Downstream consumers; loss of sound/WebGL/animation cannot change a result. |
| Auth, rooms, persistence, subscriptions, social, worldbuilding graph | Infrastructure remains infrastructure. `universalEntityService.js` is a lore/search graph, not a combat instance registry. |

**When to use existing systems instead:** use a condition for Burning on a character; the AoE tool for a one-shot blast/measurement; terrain paint for appearance; atmospheric weather for ambience; the creature ability flow for GM choice/costs; existing cooldown UI for spell availability; an encounter tracker for a ritual. A persistent spatial rule earns a zone only when membership/lifecycle actually matter.

### Domain-specific logic that must remain outside

- **Creature integration:** adapt existing `triggerCondition` into supported facts rather than copying it into a parallel behavior definition. Creature evaluation retains original d20 bands, card/coin choices and tactics. Missing/unsupported conditions produce “GM check required,” not invented eligibility. Do not automatically redistribute bands or turn a missing band into equal weights.
- **Wing example:** creature definition declares Healthy → Injured → Broken thresholds and consequences; token instance tracks damage/state. Creature rules disable Flight/Wing Buffet and set Dive Bomb eligibility/weight to zero. The behavior evaluator reads these facts. Applying Grounded uses an actor-condition adapter only if it is an authored mechanical condition; otherwise it remains a creature capability/state fact. Whether loss of flight cancels a pending dive is declared by that action, not guessed by the shared layer.
- **Chronarch owns time:** round counters/expiry are administrative. Borrowing future AP, arbitrary rewind, acceleration/deceleration and timeline manipulation remain explicit Chronarch mechanics. A later Chronarch rule may request rescheduling an eligible pending effect through a validated capability; there is no general `rewindWorld` or user-editable time multiplier.
- **Plague, ritual, bridge and flood:** cultivation stages, meaningful ritual acts, collapse thresholds and rising-water rules are separate authored phenomena. Shared state/events enable them without prescribing the same build/vent rhythm or converting all four into damage ticks.

The Game/IP review's convergence hypothesis is a warning against homogenization. This proposal does not redesign classes. Infrastructure may be symmetric; gameplay need not be.

### Generic zones: a bounded domain

A zone is **a map-scoped region with a lifecycle and explicit rules**. GM-drawn and supported ability-created zones use the same runtime instance format; existing spell/ability authoring remains authoritative for their mechanics.

Required concepts: shape/area, source, duration/expiry, state/tags, enter/leave/start-turn/end-turn bindings, readable tooltip, and visibility. Trigger slots without an authored rule do nothing. A decorative circle is not automatically a zone.

| Policy | Proposed semantics / decision boundary |
|---|---|
| Area/shape | Reuse circle/cone/line/cube footprints; square/cube and sphere/circle authoring aliases normalize explicitly. Reject unsupported 3D volumes as automated input rather than flatten silently. Polygon drawing is later. |
| Units | Existing AoE geometry is world pixels with feet/grid conversion. Persist the chosen world-space geometry and map/grid calibration; do not store camera coordinates. A pixel-scale/grid edit pauses affected mechanics pending explicit rebase. |
| Membership | Slice uses center/anchor inclusion, matching `getTokensInAoE`. Boundary points count as inside under an explicit tested rule. Large footprints, flying height, holes and grid-cell inclusion need separate decisions/adapters. |
| Enter/leave | Real transitions at **accepted committed movement**, not drag previews. A later traversal policy uses the accepted path; start/end positions alone cannot detect crossing through and exiting. Teleport/place/delete/reposition are separately classified, not automatically entry damage. |
| Zone edits | Creation under an occupied token or resizing onto it establishes membership without synthetic movement-entry damage by default; other behavior requires an explicit rule. End-turn still checks current membership. |
| Turn triggers | Incoming actor's start / outgoing actor's end are distinct bindings. Do not use generic `round` ticking as a substitute for each actor's turn. |
| Duration | Named expiry boundary, e.g. the third round end after creation. Not “18 browser seconds”; actor buff rounds currently decrement on that target's turn end and are not the same clock. |
| Walls/doors | Separate authored propagation from player vision. Some ground hazards cross no walls; others ignore them. Slice commits a footprint once, without wall clipping. Dynamic door-driven re-clipping is later and explicit. |
| Overlap | Independent zones remain independent. Explicit stacking keys and caps decide repeated consequences; no automatic merge, global strongest-element contest or order by z-index. |
| Lifecycle/source | Active, awaiting adjudication if needed, expired/cancelled. Source deletion/death does not implicitly cancel a persistent phenomenon; authored source-bound/channel rules decide. |
| State | Burning → Steam replaces the hazard profile in place while retaining identity/geometry/source. It does not repaint the base map or create a second damage zone. |

Current AoE caveats matter: `clipAoEAgainstWalls` flattens polygon rings, and `getTokensInAoE` unions membership across them; hole semantics are not preserved. Overlay `buildTemplate` retains the unclipped polygon when clipping returns empty and the helper falls back on clipping exceptions. Fine for an advisory tool does not mean suitable for authoritative hazards. Its committed affected list is placement-time data; resolution must query current positions. Its portal overlay has no general player-fog entitlement filter. Reuse functions with explicit mechanical/error policies, not the component's advisory defaults.

### Explicit susceptibilities, not a universal elemental matrix

**Ownership:** a material/entity or its current mechanical profile declares its reactions. Oil declares Ember ignition; water declares Rime freezing; a wet *conductive* surface declares Storm electrification; Frozen declares Smashing shatter and Ember melting; a wooden structure declares ignition. A damage type does not declare every material's response.

**Exposure is not damage.** Water is a medium/contact fact, not a new damage school; FIRE is a visual family, not proof of Ember damage. Storm damage may be concussive rather than electrically conductive in a particular authored ability. A damaging spell must explicitly advertise the physical interaction it produces; the renderer's theme cannot emit exposure.

| Recipient/profile | Explicit input | Tangible output | Necessary authored scope |
|---|---|---|---|
| Oil | Ember ignition exposure | Burning Oil | Which patch/object is contacted; burn duration and hazards. |
| Water | Rime freezing exposure | Frozen | The bounded region frozen, support/load rule if any; no ocean simulation. |
| Wet Conductive Surface | Storm electrical exposure | Electrified | Conductivity and region must be declared; no global connected-water propagation. |
| Frozen | Smashing contact | Shattered | What is broken, what remains; not automatic bonus damage to everyone. |
| Frozen | Ember heating exposure | Water / Melt | Which frozen material melts and whether its support changes. |
| Wooden Structure | Ember ignition exposure | Burning | Explicit ignition condition and integrity rules, not all wooden-looking props. |

These are investigation examples, **not new canon** or new rules for all instances of those substances.

**Precedence and conflict policy:**

1. Select only recipient-local reactions matching the input, current state and approved predicates. No unrelated entity scan.
2. Specific instance override *replaces* the named profile rule; it does not add a hidden extra reaction. Current-state rules take precedence over a base material fallback. Authored priority resolves competing rules within a declared exclusive group, such as `surface.phase`.
3. A unique highest-priority transform wins. Equal-priority exclusive transforms are an authoring error; runtime returns a GM-adjudication conflict with no automatic mutation. Rule IDs order independent operations for repeatability, not to silently decide conflicting fiction.
4. Concurrent inputs are serialized by the room authority and evaluated against the latest committed state. A genuine composite action declares its ordering/combined resolution; a tie in arrival timestamps is not an elemental law.
5. Explain the chosen/suppressed rules and consumption policy in a receipt. Unknown interactions do nothing automatically and remain manually adjudicable.

**Recursion and loop prevention:** the slice is one-step only. A transform emits a state-change receipt, **not another elemental exposure**. Chaining later requires an explicit emitted input, carrying root cause and visited `(recipient, rule, input)` keys, a depth limit (proposed 4), total-operation budget (proposed 32), and no-op detection. Re-entering a visited key or exceeding the budget stops before further commits and requests GM adjudication. Authoring checks identify cycles; runtime guards remain necessary for cross-instance interactions. No synchronous callback recursion and no “repeat until stable” world solver.

**Complexity:** sparse recipient-local lists cost approximately the number of actually contacted profiles/rules, not materials × elements × states × spells. Profiles are references/templates with small explicit overrides, not copied reaction lists in hundreds of spells. Growth is controlled by restricting automatic reactions to table-readable phenomena and refusing generic spread/chemistry. Discovery is a visible reaction line on the object's/zone's card (or GM-private if intentionally unknown), with “why did this change?” traces.

### Telegraphs: declared threats composed with area and scheduling

A telegraph is **player information about a pending action**, even with animation disabled. A timed zone alone is insufficient when the action has a source, cancellation predicates, target-lock policy, costs and mitigation options.

Compare options:

- **Timed effect/zone:** enough for a fixed delayed ground eruption; shares geometry and expiry/due-time descriptors.
- **Declared action + optional zone:** best fit for Dragon Breath. Action owns Charging/Resolved/Cancelled, source/ability, due boundary, lock/retarget policy and interruption; area is a linked spatial footprint. A non-spatial threat needs no zone.
- **Encounter event:** appropriate for “portal opens after fourth successful rite,” owned by the encounter domain.
- **Independent universal telegraph entity/engine:** not justified. An ID for a pending declaration is useful; a new universal hierarchy and scheduler are not.

**Recommendation:** compose a domain-owned pending declaration with the same spatial/timing primitives used by zones. Reuse the creature report's telegraph *concept*, but avoid its proposed telegraph store becoming a duplicate zone geometry/clock engine. A domain-specific threat view/record may still exist; shared helpers do not require all threats to be damage zones.

Example: Dragon Breath is Charging; its declared cone resolves at end of the dragon's next turn. Players see timing, area policy and possible responses: leave, interrupt, protect an ally, disable the gland/wing if the action declares it relevant, or manipulate terrain. At due time the GM adjudicates the action; the domain rechecks its source/capabilities and current targets. Cost paid at declaration is not paid again. Retargeting, interruption cost/refund and whether an injured source cancels require authored rules. No AP/reaction eligibility is granted by the threat layer.

### Encounter state / momentum

Treat an encounter as a **scoped state owner**, not a creature with HP and not the owner of every battlefield datum. No verified live encounter-state evaluator was found in the inspected combat/session paths.

| Fact | Recommended owner |
|---|---|
| Combat round/current turn | Existing combat/session domain; encounter reads it. No duplicate authoritative round. |
| Ritual progress, flood level, boss phase | Optional encounter-domain state, if a concrete encounter needs it. |
| Bridge structural integrity | Object/structure instance; encounter may observe its collapse. |
| Broken wing | Creature aspect instance; encounter observes it for a phase transition. |
| Weather | Reference existing travel/map/room weather with an explicit encounter override policy. `weather_update` currently drives atmospherics, not flood/damage rules. |
| Pressure/momentum | Add only for an authored scenario with named gains/losses, meaningful choices and a physical tracker. No default global meter. |

`vtt-react/src/store/timelineStore.js` holds lore eras/events and causal history, not accepted combat scheduling; `combatStore.combatTimeline` is a projected turn display. Neither should become a durable action scheduler by analogy of names.

Transitions remain scenario-specific: accepted round ≥3 raises flood level once; an actual ritual act raises progress, progress crossing 4 opens the portal; wing Broken changes a boss phase; integrity crossing zero collapses a bridge. Each transition declares once/rearm semantics and uses domain commands. “Collapse” includes encounter/object/movement adjudication, not only a generic minus-HP operation. Multiple encounters need separate IDs/clocks/scopes; a one-combat room model is not proof of simultaneous encounter support.

### Presentation boundary and parametric VFX

```text
RULE / AUTHORED MECHANIC
          ↓
DOMAIN RESOLUTION + WORLD-INTERACTION HELPERS
          ↓
COMMITTED STATE / RECEIPT
          ↓
PRESENTATION ADAPTERS
          ↓
2D / 2.5D / VFX / AUDIO / TOOLTIP
```

Presentation families are **FIRE, WATER, RIME, STORM, FOG, SHADOW, ARCANE, BLIGHT, LIGHT, WIND**. They are not damage types or a required renderer implementation list. FIRE can depict Ember flame, a mundane torch or harmless ritual fire; SHADOW/LIGHT/WIND do not create new resistance categories.

Gameplay selects a family/preset and semantic phase (charging/active/changed/expired). The visual adapter owns shape/radius/height, intensity, opacity, direction, pulse, animation speed, decorative duration, particle budgets and platform fallback. Mechanical duration remains authoritative even when decorative animation finishes early. Reuse existing color/icon assets and atmospheric techniques where appropriate; there is no verified complete world-space VFX family engine today.

Slice FIRE can be an existing-style orange translucent area with a shared restrained pulse/badge. A Steam label/neutral fill communicates the changed state without requiring a second particle family. Later Three.js decoration follows the same footprint and fog mask. No per-spell animation catalogue, one point light per flame, network particle packets or model collision rules.

**Protected-component conflict:** putting listeners, reaction switches or damage application in `ProfessionalVTTEditor`, `Grid`, `CreatureToken`, `CharacterToken`, `ObjectSystem` or `ThreeDWorldLayer` would increase coupling at the Master Audit's high-risk surfaces. Limit integration to a small child/view mount and input/state adapters. Zone resolution subscribes to accepted domain events outside render components. `combatStore` does not gain zone simulation, `levelEditorStore` does not gain a spell engine, and `conditionStore` does not become a material registry. File size alone is not the objection; mixed responsibility and consumer fan-out are.

**Fog/visibility:** independently filter entitlement (public/GM-only), current perception (existing LOS/FOV/fog) and historical memory. A remembered tile must not reveal current hazard transformation/expiry through a fresh tooltip, audio or name in chat. Use existing memory semantics and a static last-known description if supported; otherwise hide dynamic state outside current vision. Mechanical membership remains active regardless of whether a client renders it. A Steam visual does not obstruct LOS unless an authored rule invokes the vision domain. Strict confidential traps depend on server-filtered delivery/storage, not CSS.

### Authoring UX: connect existing authoring to execution

GM flow: **draw/select area → choose a supported effect/preset → bind timing → read rule summary → publish**. A contained area-binding panel reuses current AoE placement and effect creator controls. Supported spell/ability configuration enters the same adapter; authors do not retype its formula/duration into a second engine editor.

```text
BURNING GROUND                  Area: drawn circle
Duration: 3 rounds              Expires: named round-end boundary
On Enter: 1d6 Ember             End Turn: 1d6 Ember
Leaves: no consequence          Start Turn: no consequence
State: Burning                 Visibility: public, respects vision
Reaction: Water contact → Steam (replace Burning profile)
Visual: FIRE                    [Preview rule card] [Publish]
```

This is a possible full authoring target, not the initial slice's supported set. The UI must display which features execute, which require GM adjudication, who resolves them, and the exact duration boundary. Unsupported enter/path/shape options remain visibly manual-only until implemented; never show an enabled automation checkbox backed only by prose.

The reaction editor offers **recipient profile + explicit input + one resulting state/profile**, conflict validation and a plain-language explanation. Advanced authoring is not JavaScript or a giant Boolean-rule canvas. Store the authoritative preset/binding once, show its generated tabletop card and tooltip, and keep provenance/version when a live instance snapshots it. Editing a source definition does not retroactively change ongoing instances without an explicit update.

### Tabletop equivalence

| Mechanic | Physical representation and adjudication |
|---|---|
| Zone/area | Template, colored outline or sketched region. State plainly whether the mini's center, footprint or occupied cells count. |
| Enter/leave/start/end trigger | One sentence on its card; check when the mini moves or named turn boundary happens. A rule needing exact unseen drag interpolation is rejected. |
| Duration | Die/counter and expiry note, e.g. “remove after end of round 4.” No stopwatch substitution for combat rounds. |
| Damage/condition | Roll the written dice; use existing Mythrill resistance/condition rules and mark HP/status. No new universal attack mechanic. |
| Susceptibility | Explicit line on relevant material/zone card; replace the card/marker when the named exposure is adjudicated. Conflicts go to the GM. |
| Telegraph | Face-up declared-action card, optional cone/template and due note; players can respond before it resolves. |
| Creature aspect | Track/boxes on creature sheet; cross out disabled abilities and adjust that creature's behavior table. |
| Encounter state | Visible flood/ritual/phase tracker; change it only on listed events. No hidden generic momentum meter. |
| Source/stacking | Labeled markers identify source and stacking group; printed rule states whether overlaps stack. |
| Visibility/memory | GM screen/covered marker for secrets; known threat cards for players; remembered map notes stay last-known. |
| VFX/audio | Optional mini/marker/color/sound cue; remove it and all information/rules remain available in text. |

Unbounded fluid conduction, continuous fire/ecological spread, hundreds of hidden interactions, and recursive “equilibrate until stable” systems fail this test. The VTT may reduce bookkeeping; it may not introduce an opaque videogame simulation.

---

## SCHEMA

### Authoritative data flow and representations

The schema below is a **design contract**, not a new production schema or proposed bulk data rewrite. Use existing authored fields first; add only genuinely missing binding/reaction metadata to the owning domain after a human decision.

| Datum | Authoritative source | Runtime representation | Persisted representation | Presentation | Legacy/migration |
|---|---|---|---|---|---|
| Spell/ability consequence | Existing selected definition (`damageConfig`, `targetingConfig`, `durationConfig`, etc.) plus supported explicit binding | Immutable normalized plan with definition ID/version/hash and provenance | Small instantiated rule snapshot on the live zone/declaration; original definition remains in its library | Generated card/tooltip, not re-parsed rules text | Boundary adapter maps supported old fields; unsupported meanings stay manual-only |
| GM-authored hazard | One GM preset/configuration using reused effect controls + area/trigger binding | Same normalized plan as an ability-created hazard | One owned definition and one instance snapshot; not two editable schemas | Form projection and physical card | No auto-conversion of all terrain prose/presets |
| Zone geometry/state | Accepted creation/transform command | ID, map, scope, committed geometry, active state/profile, revision, expiry | Same serializable instance in canonical room map state | Projected shape + permitted state text/VFX preset | Existing AoE singleton remains a measurement tool unless explicitly promoted |
| Character/creature HP and actor conditions | Existing actor-domain instance state, resolved through identity adapter | Existing stores/session actor records; no zone-local HP copy | Existing corrected canonical actor lane; personal sheet snapshot remains distinct | HUD/token/condition ring | Map aliases such as `player`/`current-player` only at local boundary, never durable shared IDs |
| Material/object/tile facts | Existing object/terrain identity plus explicit mechanical attachment if opted in | State/profile reference; sparse overrides only | Owning domain instance/attachment | Readable local reaction card | Never infer oil/wood/conductivity from texture/name |
| Creature aspect/behavior | Creature definition and token instance respectively | Domain-owned aspect facts; transient suggestions | Definition + token aspect state via verified adapter | Anatomy/behavior view | Preserve bands/triggers/tactics; no second behavior-authoring grammar |
| Encounter facts | Scenario definition + encounter instance | Scoped counters/phase, reading combat round | Encounter-owned state in canonical room lane if later needed | Tracker, conditional event explanation | No migration of lore timeline into combat clock |
| Resolution | Accepted command and bounded validated receipt | Commit revision, root cause, applied operations and resolved rolls | Receipt/replay guard + matching state checkpoint | Chat/trace projected by visibility | No reroll/reapplication on snapshot import |

Normalization is a read/compile boundary, not a second authoring system. A live rule snapshot pins semantics so content updates do not change yesterday's ongoing effect; it is not editable independently from the instance's explicit override/update workflow.

### Minimum instance contract (illustrative)

```json
{
  "schemaVersion": 1,
  "id": "zone-17",
  "scope": { "roomId": "room-A", "mapId": "map-A", "encounterId": "encounter-A" },
  "source": { "kind": "gm-preset", "definitionId": "burning-ground", "definitionVersion": 1 },
  "revision": 1,
  "geometry": {
    "shape": "circle",
    "space": "world-px",
    "center": { "x": 500, "y": 500 },
    "radiusFeet": 10,
    "calibration": { "gridSize": 50, "feetPerTile": 5, "gridType": "square" },
    "membership": "center",
    "propagation": "committed-footprint"
  },
  "state": { "profileId": "burning-ground", "phase": "burning", "tags": ["burning"] },
  "lifetime": {
    "clock": "encounter-round-end",
    "createdRound": 1,
    "expiresAfterRoundEnd": 4,
    "onCombatEnd": "pause"
  },
  "bindings": [
    {
      "id": "end-turn-burn",
      "trigger": "actor.turn.end",
      "target": "actor-in-area",
      "operation": { "kind": "actor.damage", "formula": "1d6", "damageType": "ember" }
    }
  ],
  "reactions": [
    {
      "id": "water-quench",
      "input": "medium.water.contact",
      "requiresPhase": "burning",
      "exclusiveGroup": "surface.phase",
      "priority": 10,
      "resultProfileId": "steam-marker"
    }
  ],
  "visibility": { "audience": "public", "perception": "current-vision", "memory": "last-known" },
  "presentation": { "presetId": "ground-fire", "family": "FIRE" }
}
```

This shape describes the narrow slice. Committed polygons, if used, include world-space rings and explicit topology rather than a fake spherical volume. Definition/profile payloads are pinned to the instance's version and preserved in the snapshot; referenced IDs alone must not depend on a future client having the old definition. Optional fields must not be treated as secretly implemented features.

**Three rounds example:** created during round 1; round ends 2, 3 and 4 are the three counted complete boundaries; expire after round-end 4. The partial creation round is not counted. This is an explicit prototype convention, not a declaration of existing Mythrill canon. If the human design selects inclusive creation-round counting instead, change the card and adapter together before implementation.

**References:** character/creature addresses identify runtime token and owner/character mapping; an aspect adds an aspect ID to its creature-token reference; a tile uses map ID plus grid type/cell key; objects use their placed object ID. A spell is usually a *source definition*, not a damageable entity. Environment is scoped data, not an omniscient actor. Unsupported entity kinds report unsupported, not default to the local player.

**Predicate contract:** support a tiny allowlist needed by actual consumers (`phase is`, `has state`, numeric threshold, membership supplied by spatial query). Bounded `all/any/not` can be shared with future creature adapters. Missing facts are unknown and require adjudication; no `eval`, callback serialization, giant entity map or arbitrary deep paths. Do not silently equate `statusEffects`, `state.conditions`, a material profile and a visual condition name.

**Operation contract:** initially `actor.damage` and `zone.transformProfile`. Each goes through its owning adapter. Actor-condition application, object-state change and encounter transitions are later typed domain commands, not dozens of generic effect-type booleans. Formula validation accepts the supported dice grammar and limits count/sides/length; unrecognized formulas are not parsed as zero damage.

**Damage/resistance readiness:** `effectProcessingService.js:66–136` expects numeric percentage resistance, while character slices use `{level,multiplier}` and creature displays support named levels (`DamageResistanceDisplay.jsx:57–79`). The DOT service ignores vulnerabilities and handles some aliases differently: `data/damageTypes.js:106–108` maps shadow/necrotic/void to Wyrd, while wizard `core/data/damageTypes.js:135–137` and DOT map them to Blight. Character DR/soak, conversion/absorption and magical-assistance suppression are separate concerns. Do not silently choose a canon or blindly divide these records by 100. A versioned domain adapter must document the accepted shape and applicable mitigation rules; unsupported records stop automation. The slice uses canonical Ember and an explicitly validated numeric creature-resistance subset, not a claim to complete combat damage.

---

## EVENT FLOW

### Accepted-boundary resolution

1. **Authoring to plan:** existing spell/ability/GM configuration passes a supported-field adapter; preview/card lists executed/manual-only semantics and pinned source version. GM publishes an explicit zone-create command.
2. **Creation commit:** session authority validates scope, controller, bounded geometry/formula/profile and expected revision. It assigns stable ID/revision and records the zone. Membership is initialized without treating hydration/creation as movement.
3. **Accepted event:** a combat transition or committed movement supplies previous/next state and a stable boundary/move ID. Spatial queries use world positions on that map; predicates see one immutable snapshot. Local store rerenders and drag frames are not triggers.
4. **Proposal:** the GM evaluator finds matching bindings, computes the relevant actors, obtains resolved dice once and asks the actor/zone domain adapters for a bounded consequence plan. Conflicts/unknowns return explanations rather than mutation.
5. **Commit:** server validates expected revisions and replay key, applies the approved operation batch in order and emits **one receipt plus state changes**. A stale plan is rejected and rebuilt; old rolls/results are retained unless the action is explicitly cancelled and re-declared.
6. **Persistence:** the existing corrected room writer records affected state with receipt/replay metadata at the same committed revision. A live acceptance and a durable checkpoint are distinct statuses.
7. **Presentation:** peers apply committed state without rolling or resolving. Tooltip/chat/FIRE adapter project only permitted information. Rendering failure cannot retry damage.

For zone end-turn effects: outgoing actor end → its due consequences → named round-end consequences/expiry if wrapping → new round/start-turn consequences. Actor-domain existing condition/cooldown order is preserved until a human-approved boundary contract defines the cross-domain order. A simple subscription to `combatStore.round` would see already-mutated state and miss this causality; subscribing to network arrival alone is also insufficient without previous state/IDs.

**Susceptibility flow:** GM adjudicates that Water contacted the Burning Ground region → explicit exposure command references that zone/revision → recipient-local `water-quench` rule replaces the Burning profile with inert Steam → preserve ID/geometry/expiry/source, remove damage bindings, record the transform → presentation changes label/fill. No automatic second exposure, actor wetness, blindness, flood or area spread follows.

**Telegraph flow:** creature chooses/suggests action → GM declares Charging and optional footprint → players respond through existing rules → interruption updates/cancels that declaration → named due boundary prompts creature-domain resolution → recheck eligibility and current targets → one committed result. Scheduling bookkeeping never chooses the creature's behavior.

---

## FAILURE MODES

### Failure modes / god-engine risks

| Failure | Prevention / boundary |
|---|---|
| Another parallel spell/material/condition schema | Existing authoring → supported adapter → transient plan. Only missing metadata added by its domain; no bulk conversion of prose. |
| Giant switch for every class/spell/creature | Thin typed consequence adapters; domain-specific modules retain meaning. Shared helpers never match class or creature names. |
| Boolean proliferation (`isFire`, `isWet`, `isTelegraph`, etc.) | Named domain state/profile and typed trigger/operation; avoid combinations of feature flags describing fiction. |
| Trigger storm / chained transformation cycle | No implicit exposure from state changes; local subscriptions, causal IDs, visited keys, depth/operation bounds and explicit GM stop. |
| Wrong actor is damaged | Stable typed references and owner/token mapping. Never serialize `player` as a shared actor or use `targetType === 'player'` to select whichever local sheet is open. |
| Double tick: zone plus condition timers plus peers | Zone duration/trigger has one owner. Applying a condition is explicit; do not materialize an end-turn zone tick as a realtime DOT too. Peers only apply receipts. |
| Missed crossing or false entry during drag/reconnect | Accepted movement classification/path, not visual frames; hydration initializes membership without triggers. Slice avoids entry automation. |
| Stale turn / duplicate button / reordered packets | Encounter epoch + monotonic boundary IDs, expected revisions and idempotency keys; no tick from round/index equality alone. |
| Wrong walls/hole membership / different client geometry | Commit mechanical geometry/policy; make empty/error/hole behavior explicit. Never accept advisory unclipped fallback as authoritative. |
| Secret state leaks via tooltip/audio/last-known map | Entitlement filtering plus existing perception/memory rules; never let active VFX reveal a GM-private reaction. |
| “Saved” zone vanishes / expired zone resurrects | Correct room persistence/reload; terminal receipt/tombstone and bounded replay checkpoint; no array concatenation or old personal snapshot overwrite. |
| Late action changes all prior instances | Pin definition/profile version per instance; explicit instance update only. |
| Renderer decides a reaction | Renderer consumes state; it emits neither exposure nor timing. |
| Capability grows until it owns the RPG | Reject a feature needing shared resource loops, movement solver, ecology, anatomy scoring or lore clocks; place it in its domain or keep it manual. |

**Smallness test:** a new fictional phenomenon should usually add a small domain profile/rule and reuse an operation, not add branches to the shared layer. A new operation is admitted only with a named owning adapter, an existing/needed consumer, bounded inputs, a physical-table rule and tests. No plugin marketplace, embedded scripting language or arbitrary world-property write API is needed.

### Prerequisite reliability fixes

These are dependencies for automated shared state, not implementation instructions carried out by this research. Audit priorities are retained even where the two reports assign different labels.

| Gate | Current evidence | Required proof before this runtime |
|---|---|---|
| Room read/write truth (Master TD-002; Commercial P0-1) | `server/services/firebaseService.js:128–160,337–386`; client `vtt-react/src/services/roomService.js:500–522` still writes a whole room snapshot | Inline and split rooms survive save/load/restart with one authority and matching revision. Client snapshot cannot overwrite newer server-owned zone state. |
| Honest failed writes (TD-003; P0-2) | `syncService.js:78–106` clears pending batch and accepts false returns; `syncHandlers.js:117–129` may emit save success after a false result | Failure retained/retried under bounded policy, visible to GM, durable success distinguished from live commit; injected false/throw/unavailable paths tested. |
| Idempotent resume (P0-3) | `roomHandlers.js:159–167,182` concatenates arrays | Repeated resume produces identical collection/order/state size and never repeats consequences. |
| Acknowledgements and explicit routing (TD-001/009) | `rateLimitService.js:185–226`; `validationService.js:53–86` | Current payload/ack survives sanitization → validation → rate limit → handler. Non-default-map actions preserve scope and command IDs. |
| Snapshot/reconnect completeness | `syncHandlers.js:26–47` omits map-zone state; serializers whitelist known fields; combat sync has imperative replay branches | Full sync/resume applies snapshots without calling `nextTurn`, rerolling initiative, rebroadcasting or emitting triggers. All selected serializers/appliers explicitly round-trip new state. |
| Actor update/condition contracts (TD-012 and creature corrections) | Root vs nested token merges; client condition event shape differs from token-keyed server persistence | Tested typed actor application and condition round-trip; identity aliases never resolve to another player's local character. Round conditions must survive local/persistent serialization. |
| Resistance/rules reconciliation | Numeric/string/object resistance representations and conflicting legacy aliases | A reviewed domain damage contract, supported-input declaration and tests. No silent mitigation bypass or NaN health. |
| Information/recipient authority (TD-006/008; Commercial P0-4/P1-8) | Broad room parent reads; global targeted recipient lookup | Room-scoped snapshot delivery; current rules verified/tested. Confidential-zone claims require actual per-audience data isolation. Public-only slice still must reject foreign-room mutations. |
| Production-path test coverage | Audits describe middleware-bypassing integration helpers | Real handler tests composed with actual middleware and persistence fault injection; passing isolated relay tests alone is insufficient. |

The slice does not require billing or a general platform refactor. It does require the integrity/routing/recovery gates relevant to its claims. Backups/restore and deployment compatibility become mandatory before treating this as durable campaign automation. Fixing these gates benefits the existing VTT whether or not world effects are ever built.

---

## PERFORMANCE CONCERNS

**Not benchmarked.** Use event-driven bounded work; do not add a per-frame simulation or a timer per zone/effect.

| Scale case | Expected reasoning / failure test |
|---|---|
| 10 zones, one moving actor | Query zone bounds then exact membership for candidate regions; one accepted movement/boundary, not every pointer event. Simple scan is acceptable initially if measured. |
| 50 zones | Cache committed polygons/bounds and membership by map/revision. Round expiry checks only that encounter's instances. Add spatial indexing only when profiling justifies it; existing `WallSpatialIndex`/RBush is a pattern, not a zone index already built. |
| 500 active effects | Index bindings by scope + trigger + target; evaluate only candidates. No all-effects × all-tokens scan on every render, or implicit rebuilding of vision/geometry. Bound receipt history and active rules. |
| 193 creatures, 21 classes, hundreds of spells | Loaded catalogue size is not active resolution workload. Compile only active supported definitions; creature choices/class economies stay separate. No shared per-definition switch cases. |
| Multiple encounters/maps | Partition IDs, clocks, candidate sets and state delivery. The current room has one combat object: concurrent clocks need separate encounter work, not a global round retrofit. |
| Years of content/reconnects | Version-pinned definitions, finite active instances, bounded replay receipts/tombstones and snapshot-based recovery. No growing raw event history in every map document. |

Specific concerns:

- Polygon Boolean operations/LOS are more expensive than point membership; perform on creation or explicit geometry changes, cache by wall/grid revision, not every render/tick. Do not compute player-FOV independently for each zone.
- Existing movement debouncing in `server/services/syncService.js:150–158` coalesces positions and loses intermediate path points. Preserve it for visual motion; future mechanical crossing requires an explicit accepted path/commit lane, not disabling throttling.
- Realtime DOT has a local `lastTickTimes` map; it is not a durable replay ledger or room scheduler. Do not scale that pattern into hundreds of browser timers.
- Keep definitions, rule snapshots and geometry bounded. Measure serialized bytes; large room/map fragments already deep-clone/write whole structures and have size limits. Server batching's deep merge can retain omitted dictionary entries; deletion needs explicit removal/tombstone semantics, not omission from a map object.
- Budget particles/lights globally, not per spell. No shadow-map dirty refresh for decorative pulses, per-frame Zustand writes or network animation packets. WebGL-off/reduced-motion fallbacks keep text/area boundaries visible.
- Proposed measurement scenarios: 10/50 zones; 500 effects over an explicit actor count; crowded overlap; repeated joins; failure/retry; two map scopes. Record candidate count, resolution latency, receipt bytes, persistence bytes, memory and frame time. Numeric budgets are set from measured target hardware, not asserted by this document.

---

## MULTIPLAYER IMPLICATIONS

### Multiplayer authority model

**Recommended cooperative model:** the **GM is the semantic evaluator/adjudicator**; the **server is authoritative for scope, order, accepted state changes and replay protection**. Players propose actions through their owning domains. Spectators/peer renderers never execute consequences.

This sharpens the creature report's “GM-client engine” recommendation without replacing its behavior system. It does not move all RPG simulation onto the server. A zone evaluator can remain on the GM client; a validated server commit prevents two clients, reconnects or duplicate ticks from each changing HP. GM dice/adjudication are trusted table outcomes, not an anti-cheat RNG claim. Fully server-derived damage later would be a separate decision using the same domain calculation, not a parallel resolver.

| Operation | Who proposes / who commits |
|---|---|
| Create/edit/delete GM zone | GM proposes; server verifies role/scope/revision and commits. |
| Ability-created zone | Owning spell/creature action declares it after its cost/eligibility flow; slice remains GM-only. Broader owner/delegate permission is explicit, not inferred from `source`. |
| Enter/end-turn consequence | GM evaluator consumes accepted session event, submits bounded plan; server commits once. No peer-side tick. |
| Susceptibility exposure | GM confirms contact in slice; later an accepted domain action can publish a supported exposure. Server checks authorized source, recipient scope and profile transition. |
| Force resolve/cancel/correct | GM command with reason and revision; server receipt. A correction is a new domain action, not global rewind. |
| Snapshot/resume | Server-selected canonical revision; clients apply silently. |

Keep `COMBAT_AUTHORITY_ENFORCEMENT` and the existing cooperative combat default intact. Effect automation has its own explicit single-GM evaluation ownership. It must not infer permission to apply cross-player damage from the permissive combat-turn flag. Delegation/source ownership follows existing token controls; socket IDs alone are not durable actor identity.

**Server validates:** authenticated room membership/role and actual sender identity; explicit map/encounter/source/target existence and allowed cross-scope behavior; supported schema/profile versions; bounded geometry/formulas/predicates/operations/payload size; expected state revisions and clock epoch/boundary; allowed phase transitions; finite resource outcomes and required domain operation constraints; duplicate command/event key. Never accept unrestricted patches or client-supplied owner identity. In the trusted-GM model it does not pretend to verify fictional Water contact or the fairness of a physical die roll.

**Receipt fields:** stable command/receipt ID, causal/root event ID, scope, encounter epoch, accepted boundary ID, before/after revisions, target/source references, resolved dice faces/total, applicable mitigation/result, applied operations, transform/cancel reason, and visibility projection. Include the concrete result, not only a seed or formula. Peers apply the same stored result without rerolls. Domain calculation plus ordered inputs is deterministic; network arrival and `Date.now()` alone are not a rules clock.

**Duplicate protection:** key a binding execution by `(encounter epoch, boundary/move ID, zone ID, binding ID, actor instance ID)`; transforms have explicit command IDs and required phase/revision. A retry of an accepted command returns its previous receipt. Do not use a random ID generated afresh on each retry. Persist bounded replay checkpoints/terminal receipts with state; reject expired-epoch commands rather than keeping an infinite ledger. Current token deltas/conflict policies do not constitute this protection for zones.

**GM disconnect:** pause new automated zone resolution; store accepted incoming boundary facts as pending/due work under a bounded policy and visibly pause progression for this experiment. Do not elect arbitrary player clients to run timers. On reconnect the GM receives canonical pending/settled state and explicitly adjudicates unresolved work. If multiple GMs or continued combat without a GM are required, evaluate an explicit evaluator lease/server resolver later; the slice makes neither claim.

### Persistence / reconnect model

**Proposed canonical location:** map-scoped zone instances in the server's `room.gameState.maps[mapId]`, plus encounter/boundary/replay metadata in the canonical session scope. This is a future additive contract, not a statement that these keys currently exist. Object/aspect/actor state stays in its existing owning representation.

Persist:

- Zone ID, scope, geometry/calibration/policy, current phase/profile and pinned supported rule snapshot/source version.
- Creation/expiry/due boundary, encounter epoch, zone/state revision, explicit paused/pending state.
- Latest bounded committed receipts/replay checkpoint, resolved random outcomes and terminal transform/expiry/cancel records necessary to prevent reapplication/resurrection.
- A consistent checkpoint relating consequences to the affected actor state. HP mutation without its receipt, or receipt without matching HP, must not be advertised as durable.

Reconstruct:

- Candidate indices, membership caches (from committed positions), visual meshes/particles, tooltip strings and transient authoring preview.
- Due-work queries from the persisted clock/expiry descriptor. **Do not** reconstruct damage rolls or re-run every historic turn.
- Membership reconstruction is hydration, never an Enter trigger. Rendering receipt history is not applying it again.

**Delivery/resume:** extend/test `room_joined`, full-map/full-state sync, the selected client applier, canonical room serialization, and resume loading. Existing `request_full_sync` primarily sends legacy root token/map fields; it is not complete map-zone recovery today. Per-user `users/{uid}/roomStates` may cache the received revision, but cannot restore stale shared mechanics over the server. Local-only play uses an explicitly separate local scope/snapshot, not the current user's last multiplayer room state.

**Disconnected player:** while the GM/server continue, the actor-domain adapter commits consequences to that player's correct room instance. Rejoining receives already-resolved HP/state/zone revision and permitted receipt summary. Personal character-sheet persistence must reconcile that state through its domain adapter; remote DOT's current `targetType === 'player'` behavior is not sufficient. This broader actor guarantee is outside the creature-only slice until tested.

**Persistence fails:** live accepted state remains the server's current table; mark the checkpoint unsaved/degraded, retain bounded retry work and stop advancing automated durable consequences for the experiment until recovery or explicit GM manual adjudication. Do not reroll/reapply on retry, falsely send “saved,” or let old cloud state replace live memory. After a crash with no durable receipt, outcomes since the last confirmed checkpoint are unresolved, not magically recoverable; warn and require GM reconciliation. A transactional/revision-consistent checkpoint or equivalent proven mechanism is a prerequisite for durable claims, not a new database service to conceal existing defects.

**Versions/migrations:** negotiate the supported zone protocol before publishing; old servers/clients cannot silently execute or discard a new mechanic. Unknown major schema/profile version is read-only/manual, preserved without lossy rewrite. Additive older room data defaults to no zones. Migrate supported instances once at load via an explicit versioned transform with backups/round-trip tests; source-library upgrades do not alter ongoing rule snapshots. Protocol rollout must cover frontend and server deploy skew.

**Single-instance constraint:** current room authority is in-memory. Redis transport alone does not provide a single consistent room resolver across processes. Keep one process owning an encounter; multi-instance room ownership is later platform work. No distributed effect engine is justified for this experiment.

---

## TEST STRATEGY

### Verification for this document

Source/report claims were checked as above and existing AoE arm/cancel UI was observed through Playwright snapshots. Documentation checks passed for required section coverage, parsing the illustrative JSON, balanced code fences and whitespace; source anchors were checked during research and test-reference paths were spot-checked. No application implementation tests are claimed to validate this proposed runtime.

### Meaningful future tests and acceptance gates

1. **Normalization contracts:** existing effect creator/ability fixtures produce the same supported formula/type/duration/binding; unsupported channel/trigger/shape fields return explicit diagnostics. Preserve originals; card transformation is not used as a lossy compiler. Named/numeric/object resistance and conflicting aliases are explicit supported/rejected cases.
2. **Spatial semantics:** boundary point, off-map token, grid calibration, source/target moved since placement, polygon holes/empty clip/error and chosen large-token/height policy. Reuse current `utils/__tests__/AoETemplates.test.js` and `store/__tests__/spellAoEStore.test.js` patterns; a screenshot is not a membership assertion.
3. **Timing/idempotency:** end-turn burns outgoing actor once; three named round boundaries expire once; duplicate button/receipt/rejoin does not tick; turn reorder/removal does not reuse a boundary ID; zero/empty combat does not manufacture a boundary. Realtime browser timers do not advance a round zone.
4. **Local reactions:** Water quenches only Burning; repeat Water contact is no-op after Steam; unrelated input no-ops; equal-priority transform conflict is manual; optional later chains detect cycles/no-op/depth budget. Steam has no inherited damage binding.
5. **Actor operations:** creature HP/version and mitigation result agree across store/server snapshot; unsupported resistance rejects before mutation; no NaN and no duplicate local DOT. Later character tests cover owner/token aliases, personal sheet reconciliation, condition durations, DR/soak/conversion and suppression rules when applicable.
6. **Production transport:** real Socket.IO path composed with sanitization, Joi, rate limiting and auth; ack and command/map IDs preserved. Non-GM/foreign-room/stale revision/oversize/unknown version rejected; retries return one receipt. Test direct event mode first; zone support must not depend on token-only delta mode.
7. **Persistence faults/recovery:** inline and split snapshots; false return, thrown write, partial fragment save, restart after commit, GM/player rejoin, repeated resume, failed load, unknown version and old client overwrite. Assert state/receipt revision consistency, no duplicate expiry/damage and visible degraded-save state. Mock happy-path Firestore alone is not durability proof.
8. **Playwright two-client scenario:** GM publishes one zone; observer sees permitted area/tooltip; actor's accepted end-turn updates HP once on both; Water changes it to Steam; observer disconnect/rejoin restores current state; 2D/2.5D and WebGL-off/reduced-motion preserve the same rules and information. Use accessibility snapshots for controls/tooltips and state/network assertions for consequences.
9. **Physical playtest:** one GM and two players run the same written slice with a template, die counter and d6. Compare triggers, duration, quench and decisions with the VTT. If the card cannot explain the result without the app, the prototype fails regardless of passing code tests.

Existing relevant precedents include `vtt-react/src/store/__tests__/combatStore.test.js`, `utils/__tests__/creatureDamageTypes.test.js`, `server/tests/tokenHandlers.test.js`, `combatHandlers.test.js`, `combatSchemas.test.js`, `multiplayer.integration.test.js`. The audit warns that integration helpers bypass production middleware; composing it is a required new coverage boundary, not an assumption.

---

## MIGRATION STRATEGY

### Migration path

1. **Revalidate audit gates and choose ownership.** Fix/prove relevant reliability contracts first. This does not require implementation of world effects.
2. **Compile a tiny supported subset without execution.** Read existing authoring; show normalized rule/card and manual-only diagnostics. No second editable spell schema. One GM hazard binding is acceptable because spatial trigger metadata is currently missing.
3. **Pin the prototype preset/instance, not the entire bestiary.** Use a disposable local/test encounter definition, existing numeric creature state and Burning preset semantics; do not regenerate static creature data or convert every lava tile.
4. **Add opt-in zone execution after gates pass.** One map, one encounter, one GM evaluator, public-only zone, end-turn binding and direct validated commit/snapshot lane. Read-only/disabled clients must have a clear compatibility outcome.
5. **Prove persistence/rejoin and physical equivalence.** Only then expand to Enter/Leave with accepted-path semantics, character targets, source-bound/channel rules or additional profiles as individually supported adapters.
6. **Connect creature/spell execution incrementally.** Existing bands/triggers/tactics keep their original owners; existing authoring maps supported consequences into this boundary. No automatic reconstruction from descriptive text or global copy of behavior state.
7. **Version and rollback deliberately.** Disable future automation while retaining instances/receipts as readable manual records. Do not delete active zones or pretend rolling back code rolls back HP. Cleanup/expiry is explicit GM adjudication; exports/backups permit recovery.

No mass rewrite, tree move, normalization of creative content, asset deletion, general store replacement or schema migration is part of this document. Old authored mechanics continue as manual rules until their adapter is explicitly supported. Static-data cache/version behavior is preserved; the broken creature extractor is a separate provenance task, not a reason to invent a new content pipeline here.

---

## VERTICAL SLICE

### Smallest useful experiment: Burning Ground, end-turn only

**Why this slice:** existing AoE circle geometry/placement, Burning `1d6 Ember` preset, `turn_end` effect timing, creature HP update path and area overlays already exist. A source-bound dragon telegraph would also require unfinished behavior/anatomy/casting resolution. A GM-created public zone avoids pretending those dependencies are shipped.

| Dimension | Exact slice scope |
|---|---|
| One zone | One stationary circle on one square-grid map, center inclusion, committed footprint; no wall-propagation automation. |
| One duration | Three complete round-end boundaries after creation; explicit expiry label/counter; pause on combat end or GM disconnect. |
| One trigger | **End of the affected creature's turn**. Enter/Leave/Start Turn concepts are documented but not automated in the slice. |
| One effect | `1d6 Ember` to one supported creature-token instance currently inside. Use reviewed numeric-resistance subset, floor adjusted damage and clamp HP; unsupported mitigation is manual-only. |
| One authority path | GM proposes → server validates revision/scope/replay key → commits and broadcasts receipt/state. Observer does not roll/apply rules. |
| One persistence/reconnect path | Canonical corrected room checkpoint including zone, creature HP and receipt/replay revision → observer reconnect/server-resume snapshot with no trigger replay. Personal snapshots are cache only. |
| One susceptibility | Explicit GM Water-contact command transforms the entire selected Burning zone to inert Steam. Same ID/footprint/lifetime; damage binding removed. Partial patch contact is manual-only. |
| One tooltip | Name/phase, source, supported trigger/formula, exact expiry, Water reaction, committed result/status. Public zone still obeys current-vision presentation. |
| One reusable visual | FIRE footprint fill/badge and optional restrained pulse reused by any flame-zone preset; Steam neutral marker/text; 2D projection also works in 2.5D. |

The full Burning Ground authoring example can eventually have **Enter + End Turn**. Intentionally proving only End Turn first avoids the currently lossy drag/movement stream, reduces the first authority seam and still proves zone + duration + trigger + effect + sync + reconnect + reaction + visual. Enter is the next separately specified experiment, not a checkbox secretly omitted from a success claim.

**VTT script:**

1. GM selects Burning Ground, places a 10-ft-radius circle, sees a generated card, and publishes. Accepted state assigns the zone ID/version; observer sees the same permitted area and expiry.
2. A GM-controlled creature with supported Ember resistance ends its turn inside. One d6 result/mitigation/HP operation is committed; both clients display the same HP/receipt. Ending outside yields no consequence. Creation/dragging/hydration do not count as triggers.
3. Retry the same boundary/command: return its existing receipt, no new roll or HP loss.
4. Disconnect the observer; GM adjudicates Water contact; the accepted zone becomes Steam and loses damage bindings. Rejoin: Steam/HP/expiry are restored, no old Burning tick replayed.
5. Count the three complete round ends and expire once. Separately fault the persistence writer, verify degraded-save state and paused automation; restore/retry without duplicate result. Restart/resume test must use actual corrected canonical persistence.

**Physical card:**

```text
BURNING GROUND — draw/place a 10-ft-radius circle; mini center counts.
On creation: write the expiry round (current round + 3).
At end of a creature's turn, if inside: roll 1d6 Ember; apply its written resistance.
After the expiry round ends: remove the marker.
Water contact (GM adjudicates whole patch): flip marker to STEAM.
STEAM: no damage; keep the same area and expiry. It does not block vision.
No automatic Entry damage in this experiment. Combat ended? Pause and adjudicate.
```

This is an experimental rule card, not a canon change to Burning, water spells, Steam or round length.

**Success proves:** current authoring controls can feed a single normalized supported rule; spatial state and timing work without rendering logic; one consequence commits once; observers converge and recover; one local reaction changes a tangible state; VFX can be reused; a physical GM can reproduce the same decisions/results.

**Success does not prove:** full spell/creature combat resolution; character mitigation or sheet persistence; casting/channel upkeep; weighted creature behavior or aspects; Enter path crossings; telegraph interruption/retargeting; electrical conduction/spread; secret zones; arbitrary 3D volumes; all reaction chains; simultaneous encounters; old-client interoperability beyond the negotiated subset; distributed server authority; performance at 500 effects; production durability without reliability gates and deployed verification.

**Stop condition:** if this slice needs gameplay branches in `Grid`/`CreatureToken`/Three.js, duplicate spell definitions, broad world-state rewrites, or a replacement networking/persistence platform, reject that implementation approach and reassess the boundary. A smaller manual-first area card may be the right product.

---

## REASONS NOT TO BUILD THIS YET

### Things we should explicitly not build yet

- A universal entity/component model, an enormous `EffectManager`, scriptable generic rules DSL or new global effect-authoring wizard.
- A universal elemental/material matrix, connected-water conduction solver, automatic fire/plague/ecology simulation or recursive reaction engine.
- Full creature AI, rewritten priority bands, mandatory anatomy on every creature, or a second telegraph geometry/clock engine.
- Universal temporal manipulation, future AP borrowing, global rewind or generic class-resource loops.
- A generic Momentum/Pressure currency without an actual scenario and table rule.
- Hundreds of bespoke spell animations, gameplay in meshes/shaders, per-effect light/shadow/network animation systems.
- General 3D collision/volume mechanics, automated traversed-path damage, confidential hidden hazards, or multi-encounter/multi-server scheduling before their contracts are proven.
- Automatic conversion of dormant authoring, terrain prose, names/art themes or archived content into executable rules.

### Questions requiring human design decisions

1. Which authored artifact wins when resistance tiers/conversions, legacy aliases, armor rules and runtime differ? Define the damage adapter's reviewed scope before broad reuse.
2. How does “3 rounds” count the partial creation round; at which named boundary does it expire? What happens outside/after combat?
3. Center, footprint or grid-cell area membership? How are flying actors, large creatures, boundaries and holes adjudicated?
4. Which movement types trigger Entry: walk, shove, teleport, initial placement, GM correction, zone creation under an actor? Is traversal damage required?
5. Is Water contact whole-zone quench, partial footprint replacement or a GM ruling? Does Steam have a later mechanical effect? No new rule is inferred here.
6. Which exposures are physical/electrical/thermal versus a spell's damage school? Which explicit susceptibilities are public knowledge?
7. Is GM-confirmed semantic resolution the intended automation level, or should some reviewed consequences be server-derived? Can combat continue without the GM?
8. Do overlapped same-source hazards stack? Which conflicts are exclusive and which are independent? Each answer must fit the physical card.
9. For telegraphs, lock area or follow/retarget the source; cancellation predicates, costs/refunds, anatomy links, and timing? These belong to the action definition.
10. Does a concrete encounter require flood/progress/phase/pressure tracking now? Which domain owns each fact and how do multiple encounters relate to the existing single combat state?
11. Which canonical persistence shape/checkpoint policy and durability promise will be supported? How are client room snapshots prevented from overwriting server truth?
12. Which protocol versions and rollback behavior are supported? How are unknown ongoing effects preserved for manual play?

### Recommendation and reliability dependency

Mythrill already has substantial authored intent and useful primitives. The gap is **connecting a supported subset to trustworthy execution**, not inventing more configuration. Current source still supports the audits' material persistence/routing concerns. Do not attach automatic cross-client consequences to those unresolved contracts.

The reasonable next architectural decision is whether one table-readable zone rule is valuable enough to justify a small, gated experiment after reliability repair. No grand engine implementation is recommended or authorized by this document.

### REASONS TO REJECT THE WORLD EFFECT ENGINE ENTIRELY

1. **Most use cases may already fit their domains.** Actor conditions, advisory AoEs, creature declarations and a simple encounter tracker could solve actual play needs without a new world runtime.
2. **A narrow adapter may be sufficient.** If attaching existing effects to area/timing gives the required result, stop there. A branded “engine” adds ownership and maintenance obligations without adding fantasy.
3. **The reliability cost may exceed the benefit.** A tabletop GM can mark Burning Ground today; introducing durable automated damage before room integrity is trustworthy makes play less reliable.
4. **Shared semantics may not actually be shared.** If anatomy, ritual progress, cultivation and terrain require different targeting/timing/authority, forcing one schema increases exceptions and coupling. Use cooperating domain-specific modules instead.
5. **It may homogenize Mythrill.** If the abstraction pushes cadences, Rings, wings and rituals toward identical counters/ticks, it fails the IP/design test even if technically elegant.
6. **It may fail physical equivalence.** Emergence dependent on hidden simultaneous simulation, recursive chemistry or exact interpolation does not belong in a tabletop-first rules substrate.
7. **It may become a god engine under content growth.** If every new phenomenon needs another central operation, switch branch, predicate family or resource hook, the smallness test has failed. Reject or split the abstraction rather than expanding it indefinitely.
8. **There may be no demonstrated authoring/play need.** A hypothesis and attractive vocabulary are not evidence of demand. If the vertical slice does not reduce GM workload or produce clearer meaningful choices, keep the existing manual tools and invest in executing already-authored domain mechanics.

**Final verdict:** reject one universal World Effect Engine. Conditionally retain a small zone domain and reusable adapters/primitives only if the narrowly defined experiment proves value, preserves asymmetry, and passes the prerequisite reliability and tabletop tests.
