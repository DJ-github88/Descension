# MYTHRILL NEXT PHASE

**Agent G — final cross-audit reconciliation and execution roadmap**  
**Verified:** 2026-10-04 against the local worktree in `D:\VTT`  
**Repository:** Descension · **Product:** Mythrill  
**Status:** synthesis and implementation specifications; no production implementation performed.

> **The decision:** make the existing table trustworthy, connect a small part of the already-authored game to real consequences, and publish one coherent first-table experience. Stop broad auditing. Execute one bounded project at a time.

This document supersedes earlier audits **as the next-work ordering**, not as a replacement for their evidence or for the creator's canon. Proposed product policies are identified as such. Nothing here authorizes deleting creative material, resetting the dirty worktree, or implementing ten projects in one pass.

## 1. Executive Decision

Mythrill needs **less new architecture and more reliable completion of existing intent**.

The most important technical boundary is:

**Accepted shared-room state → one honest, complete, recoverable checkpoint → silent reconstruction of that same state.**

The most important gameplay boundary is:

**A chosen, supported creature ability → explicit target and adjudicated result → one accepted actor consequence.**

The first action is Project 1, **Production Socket Contract Restoration**. It is a short enabling repair, not permission to replace networking. Projects 2–3 address the most severe demonstrated user harm: room data can be discarded, failed persistence acknowledged as saved, and resumed collections duplicated. Personal draft protection and privacy proceed alongside that foundation where files do not conflict.

Then complete one creature action, followed by the equivalent supported character-spell path. Publish the rules these paths actually execute. Keep unsupported mechanics visible and manually adjudicable.

### Five governing conclusions

1. **The functioning VTT is valuable. Preserve it.** Vision, map editing, 2D/2.5D rendering, spatial inventory, class-resource contracts and setting authorship are assets, not rewrite targets.
2. **Green suites do not establish durable multiplayer.** Eight fresh failure probes reproduced consequential defects while the full existing suites passed.
3. **Room authority must have one writer.** GM adjudication, player-owned sheets and personal caches can coexist; competing authoritative snapshots of the same live room cannot.
4. **Do not build the universal World Effect Engine. Do not start with Burning Ground.** Complete the smaller actor/action boundary first. Revisit a zone only after it solves a demonstrated table need.
5. **Do not redesign 21 class economies from a resource-bar resemblance.** Several classes share pressure motifs, but banks, recipes, phase clocks, pack outcomes and latched consequences are materially different decision structures.

### A coherent first public product

An **invited, free, desktop-first Mythrill table** for one GM and a small cooperative group:

- Owned characters, their actual inventory and class-resource tracking.
- GM-created maps, tokens, fog/vision, AP combat, chat and dice.
- Permanent rooms with visible cloud-save status and tested restart/resume.
- A clearly identified supported subset of creature actions and character spells that changes the correct target once.
- Manual adjudication for the rest of the RPG, with honest cards and usable physical-table instructions.
- Private planning/journal surfaces within the tested persistence scope; public codex/world reference as a separate read-only experience.
- One first-session package demonstrating the game's identity and the VTT's supported boundaries.

This first version does not promise autonomous monsters, fully executed spellcrafting, material simulation, confidential state against hostile members of the same table, collaborative worldbuilding, unlimited offline sync, every bestiary entry being approved canon, or subscription service. Those are scope decisions, not evidence that the existing product is worthless.

**The ten projects produce the core release candidate. Passing them is not automatic permission for external beta or payment:** the proportionate operational gates in §20 still apply. The intended initial audience is cooperative, invited tables, not a public marketplace.

## 2. Current Product / Architecture Reality

Mythrill is a **browser-hosted tabletop workspace with a rich original RPG/content layer, a cooperative multiplayer session host, and several persistence generations**. It is not yet a single fully executed rules engine.

Current topology:

- `vtt-react/`: React 18/CRA/CRACO application, Zustand stores, Firebase browser SDK, Socket.IO client, canvas and Three.js presentation. Routes combine character creation, the VTT, rules, atlas and account tools.
- `server/`: Express/Socket.IO, verified socket identity, in-memory `rooms`/`players`, domain handlers, movement coalescing and batched Firebase Admin writes. It validates parts of authority and stores/relays state; it generally does not calculate the entire RPG.
- Firebase: Auth, Firestore documents and Storage integration. Browser-owned personal content writes and server-owned live-room writes overlap in some places. Local source does not prove what is deployed.
- `functions/`: quota and destructive cascade-cleanup triggers. Their source exists; deployment and operational ownership remain unverified.
- Content: 21 base classes with compatibility aliases, culture-first heritage/access contracts, **193 runtime creature definitions and 526 abilities**, separate bestiary prose, 436 lexicon entries, authored rules, regional lore and a substantial franchise asset archive.
- Local persistence: localStorage and IndexedDB, ad hoc migrations, per-user Firestore runtime snapshots and canonical character documents. A memory fallback prevents a crash; it does not make an edit durable.

The strongest distinction is between **authored rules, implemented trackers, executed consequences and presentation**. Many trackers work. Many elaborate ability/trigger descriptions do not yet execute. Both facts must be true in the product's explanation.

## 3. Evidence and Verification Method

### Primary documents consumed in full

| Key | Report | Use in this synthesis |
|---|---|---|
| A | `docs/MYTHRILL_MASTER_AUDIT.md` | Runtime topology, contracts, drift/debt, protected systems and giant files |
| B | `docs/MYTHRILL_GAME_AND_IP_REVIEW.md` | Game identity, physical play, live rules/canon contradictions and design hypotheses |
| C | `docs/ASSET_ARCHAEOLOGY.md` | Runtime/canon/archive distinction and delivery evidence |
| D | `docs/CREATURE_SYSTEM_EVOLUTION.md` | Authoring/runtime gap, both passes and explicit corrections |
| E | `docs/WORLD_EFFECT_ENGINE.md` | Proposed small-domain composition, reuse limits and prerequisites |
| F | `docs/COMMERCIAL_READINESS.md` | Failure reproductions, privacy, recovery and launch gates |
| Δ | `docs/POST_AUDIT_IMPLEMENTATION_CHANGELOG.md` | Bridge to the dirty worktree, including limitations and newly introduced risks |

Supporting material was used selectively: `LORE_IMPLEMENTATION_STATUS.md`, the current core lore framework, particular live lexicon/class passages, runtime contracts, test sources and deployment configuration. No new asset census, whole-repository archaeology, balance audit or broad lore audit was conducted.

### Worktree snapshot

| Item | Verified baseline before creating this document |
|---|---|
| HEAD recovery checkpoint | `307684543ffdfcbe792c3a99e51c1a97eb771810`, 2026-09-25, modular road/path and level-editor work |
| Grouped `git status --porcelain=v1` | **517 entries** |
| Expanded untracked-file status | **944 entries: 334 tracked dirty entries and 610 untracked files** |
| Content diff using normal Git line-ending semantics | **333 files, +12,147 / −4,636 lines** |
| Extra tracked status entry | `vtt-react/src/store/dialogueStore.js` has no content diff under those semantics; it is not evidence of a new dialogue implementation |
| Bridge comparison | The substantive tracked diff totals match Δ. Expanded untracked counts include directory contents and must not be compared to grouped status as if they were the same census. |
| Selected modification times | Socket registry 10-03 14:55; effect service 10-03 21:25; map authorization tests 10-03 21:58; character persistence hook 10-02 22:21; class/source samples predate Δ. No substantive post-bridge change was identified in the consequential paths inspected. |

HEAD is not the development boundary. Modified and untracked implementations were included. No clean-worktree requirement was imposed.

### Evidence precedence

Executed behavior → currently tested source → current source → Δ → specialist evidence → current design documentation → historical documentation → labeled inference.

“Resolved” below means the named code/behavior finding is closed at its stated scope. It does **not** also mean the feature is deployed, tested with real Firebase, or complete in every sibling path.

### Fresh checks

| Check | Result and limitation |
|---|---|
| Full server suite | **250 passing**, 6 seconds. Executed Mocha's existing `tests/**/*.test.js` with the package timeout. An external preload disabled disk logger initialization/cleanup and `.env` credential loading; cloud credentials were removed from the test process. No production cloud was contacted. |
| Full frontend suite | **179 passed / 1 skipped suites; 2,313 passed / 3 skipped tests**, 111 seconds. `react-scripts test --watchAll=false --runInBand --silent --no-cache`, `CI=true`. |
| Why Δ says 174 / 2,295 | Δ filtered paths to `__tests__`. This full discovery includes five passing suites and 18 passing tests outside that naming convention. This is a coverage-selection difference, not evidence of post-report implementation. |
| Production-function probes | Eight confirmed failures, listed below. Real functions/wrappers; in-memory Firebase/logger/socket external boundaries. No application mutation or cloud write. |
| Playwright | Existing local `/rules` mounted; actual Inventory and Talent Points pages inspected through accessibility snapshots. The wrong pack orientation/axis and **1 Talent Point** text are still rendered. Zero console errors and seven existing warnings during these checks. No combat, room, moderation or persistence action was performed. |
| Current served static data | 193 creatures, 526 abilities, **zero authored priority ranges, zero trigger conditions, zero creature tactics fields** in those shipped library artifacts; 436 lexicon records. Counts were parsed from current local responses. |

**Fresh failure probes:**

- **R1:** Inline `gameState` with maps/combat, no split fragments → `getRoomData()` returned `{}`.
- **R2:** `updateRoomGameState() === false` → one batch attempt, empty pending queue.
- **R3:** Resume a snapshot against itself → drawing/object/turn-order lengths doubled.
- **R4:** Compose current sanitization → validation → rate-limit registration wrappers → handler acknowledgement argument `undefined`.
- **R5:** Validate `token_moved` → `roomId`, `mapId`, `actionId` removed.
- **R6:** Validate reconnect join → `isReconnect` removed; supplied `userId` also removed.
- **R7:** Room A `sync_tokens` targeting a room B player → delivery to room B's socket.
- **R8:** Explicit room save with false persistence result → `room_state_saved` emitted.

The probes assert the **observed failures**, not desired behavior. They are external analysis artifacts, not regression tests installed in the repository.

### Current-source anchor index

These anchors support the matrices without repeating long paths in every cell:

| Anchor | Inspected source / consequence |
|---|---|
| S1 | `server/services/rateLimitService.js:185–229`; `validationService.js:22–28,53–87,219–324`; `sanitizationService.js:127–175`; `server/server.js:125–180`: composed event envelope |
| S2 | `server/services/firebaseService.js:91–190,200–277,337–438`; `syncService.js:18–107`; `handlers/syncHandlers.js:117–130`: room reads, writes and false success |
| S3 | `server/handlers/roomHandlers.js:138–195`; `roomLifecycleHandlers.js:81–168`; client `roomJoinHandler.js:1262`, `gameStateManager.js:20–35,471–519`, `roomService.js:500–522`; `useRoomPersistence.js:162–218`: competing snapshots/resume |
| S4 | `server/handlers/syncHandlers.js:26–102`; `tokenHandlers.js:100–181`; `environmentHandlers.js:57–115`; `sessionHandlers.js:57–149`; `roomLifecycleHandlers.js:287–365`: recipients, mutation and join gaps |
| S5 | `firestore.rules:20–31,124–166,257–259,293–295,334–337,662+`; `storage.rules`; `functions/cascadeCleanup.js:20–88,138–174`; `uploadService.js:305–337`: access vs operational policy |
| S6 | `useCharacterPersistence.js:131–156,217–228,249–269`; `characterStateService.js:34–112`; `characterHelpers.js:45–47`; `coreSlice.js:1340–1394`: personal saves and unscoped cache |
| S7 | `PersistenceProvider.jsx:123–226`; `campaignService.js:228–283`; `useCampaignPersistence.js:87–108`; `offlineService.js:312–386`; `storageUtils.js:64–94,202–231`: drafts, hydration and offline claims |
| S8 | `CreatureToken.jsx:1388–1479`; `creatureStore.js:369–418`; `tokenHandlers.js:138–181`; `creatureAbilityUtils.js`; `scripts/extract-data.mjs:65–97`: creature execution/envelopes/provenance |
| S9 | `ActionBar.jsx:1760–1969`; `SpellActionBar.jsx` casting/roll paths; client `socketHandlers/combatHandlers.js:134–150`; `utils/spellEffects.js` callers; `effectProcessingService.js:66–136,141–341,425–529`: fragmented effects |
| S10 | `conditionStore.js:65–102,536–570`; server `characterHandlers.js:309–359`; client `conditionHandlers.js:7–40`; `combatStore.js:295–549`; client combat handler `:65–107`: condition payloads/clocks/hydration |
| S11 | `classResourceContracts.js`, `classResourceBanks.js`, Pyrofiend/Lunarch/Apex/Toxicologist/Harbinger contracts; current class tests: distinct economies |
| S12 | `characterUtils.js:869–939`; `inventoryStore.js:256–317`; `talentSystem.mjs:46–59`; `rules.json:1682–1692,5187–5191,8289,8367`; live browser pages: rules/runtime contradiction |
| S13 | `lore.json` entries `the_deepening`, `the_breach`, `house_viridane`, `viridian`; `arcanoneerData.js:57,139,157,197`; `shaperData.js:128–138`; `minstrelData.js:195`; core framework §1/§3: live canon collisions |
| S14 | `server/tests/helpers/integrationServer.js:26–125`; `tests/integration.test.js:22–63`; `.github/workflows/deploy.yml:38–59`; `netlify.toml:1–16,36`: test/deployment scope |
| S15 | Server `combatHandlers.js:261–273`; client `inventoryHandlers.js:16–24`: room-wide delivery is not inventory privacy |

Short frontend basenames refer to their existing paths under `vtt-react/src/` as identified in the audits. Lines are verification-time anchors, not permanent API names.

### Material uncertainty remaining

No production console or credentials were used. Deployed rules, userProfiles backfill, Storage provisioning, Cloud Functions activation, provider backups/PITR, the active Netlify build path, real room sizes and actual class play experience remain **UNKNOWN**. Context7 tools were unavailable; no external-library integration was implemented. The existing graph was absent; no graph rebuild was performed.

Those uncertainties become named acceptance gates. They do not justify another broad audit.

## 4. What Changed Since the Audits

The audits overlapped implementation. Some “post-audit” work was already present when A/F were finalized. Counting every change as a later fix would misrepresent the timeline.

### Completed wiring to preserve

Current registration/source and freshly passing suites support these bounded closures:

- GM-tools handlers, GM gating, list/settings round trips, kick notifications, mute flag and chat enforcement.
- Spell/dice/typing relays; dice-visibility handling; corrected cursor listener.
- Session launch/response and full-sync event-name alignment; client socket-error recovery attempts.
- Quest offers/responses/reward relays and journal handout registration.
- Private user document / public-profile service separation at source level.
- Campaign persistence **consolidation**: the active hook uses the root `campaignService`; the removed Firebase campaign module is not the intended active path.
- Journal no-clobber behavior and visible save status; returned combat/chat/condition fields in personal room snapshots.
- User creature/item/map edit detection, inventory hydration, marginalia reaching canonical character autosave.
- Named listener cleanup, timer/cache guards, HTML-sink sanitization and additional math/resource/authorization tests.
- Class acquisition/body-state round trips, bank/resource contracts, heritage access/trait selection and portions of the canon program.

These are not recommendations to implement again. Preserve their tests and interfaces while repairing underlying contracts.

### Fixes with unresolved surrounding guarantees

| Improvement | What it does not establish |
|---|---|
| Owner gate on permanent resume | Legacy rooms without `gmId` pass; the in-memory branch changes activity/GM character before the gate. No complete fail-before-mutation test was found. |
| Invitation existence gate | Recipient/expiry/capacity policy is not unified with direct joins. Invitations are not an implemented room-level invite-only setting. |
| Token ownership/delegation | Explicit legacy fail-open remains; alternate creature/condition paths still differ. Stable ownership and session socket IDs are not interchangeable. |
| Journal status pattern | Character autosave has not adopted it. A global “saved” badge must not infer character durability from a journal result. |
| Campaign hook no-clobber | Login provider still unconditionally hydrates campaigns; the cloud non-empty array replaces local work. |
| Worldbuilding dirty guard | Flags are not uid-scoped; it is not cross-device conflict resolution. Dirty clearing must require actual save success. |
| Offline character corruption removed | Queued writes are now no-ops and cache entries are marked synced. That is safer than the old schema write, but not successful synchronization. |
| Inventory listener ignores foreign characters | It prevents accidental local application; **the server still sends inventory data to all room peers**. Δ's privacy conclusion is too strong. |
| Private upload rules/copy-on-publish | Live Storage operation is unverified, copy failures retain the original URL, and existing download-link/revocation semantics are not proven. |
| Broad unit/handler coverage | It does not prove real Firestore rules, false-save behavior or non-default-map acknowledgements. |

Content migration remains **file/section-specific**. The implementation-status document explicitly says so. It must not be read as certification that all live lexicon and class prose agrees.

## 5. Cross-Audit Convergence

High-confidence convergence:

1. **A/F/E/Δ agree on the room persistence failures.** R1–R3/R8 independently reproduce them now. This is the highest-confidence data-loss cluster.
2. **A/D/E/Δ agree that creature authoring exceeds execution.** Current quick-use confirms costs and chat, not targets/consequences. The current library has no behavior bands to execute automatically.
3. **A/D/E distinguish a spell relay from effect resolution.** The new relay exists; its receiver remains presentation. Completing it means an accepted consequence, not another broadcast.
4. **B/D/E agree on tabletop equivalence and GM control.** No autonomous turn execution or renderer-driven rules belongs in this phase.
5. **B/C agree that lore/art are franchise assets.** Runtime reachability is not a deletion criterion.
6. **A/F/Δ agree that personal/cloud/session state needs clearer boundaries.** Consolidation and dirty guards improve particular paths without closing all authority or data-loss cases.
7. **A/B/E protect asymmetric class contracts.** Similar infrastructure should not erase distinct gameplay.

Convergence raises confidence when the observations are independent. E also read earlier reports; its agreement alone is not a new reproduction. Current source and the fresh probes provide that additional evidence.

## 6. Cross-Audit Contradictions

### Mandatory contradiction / convergence matrix

Claims below are compressed statements of each report, not invented positions. **N/A** means no material position used. Source anchors and §7 give verification scope.

| Topic | A claim | B claim | C claim | D claim | E claim | F claim | Post-audit change | Current source verdict | Decision |
|---|---|---|---|---|---|---|---|---|---|
| Multiplayer authority | Room memory; cooperative flags; scoped controls | N/A | N/A | GM-client behavior | GM semantics, server commit/order | Cooperative trust acceptable; soft edges explicit | GM/self/delegate checks added | Mixed authority, legacy bypasses; S4/S15 | Preserve cooperative rules; enforce identity/scope and single commit |
| Room persistence | Split/inline drift; false success | N/A | N/A | Extend both tiers | Correct canonical lane first | P0-1/2/3 reproduced | No underlying repair | R1/R2/R3/R8 still fail | P2/P3 before durable shared effects |
| Client/server truth | Server room plus browser writers/mirrors | N/A | N/A | Definition/token/telegraph owners; multiple serializers | Personal snapshots are caches | Two lanes unreconciled | Personal hydration improved | Live GM autosave and server still compete; S3 | One server checkpoint owner; explicit local scope |
| Security/privacy | Broad room reads, recipient and category gaps | N/A | N/A | New mutations reuse controls | No hidden-state claim from UI | Privacy/beta blockers | PII/rating/moderation/upload tightening | Parent reads open; inventories broadcast; rules deployment unknown | P4; privacy claims follow tests/delivery |
| Character persistence | Canonical vs runtime documents | N/A | N/A | Token consequences | Stable actor mapping essential | Silent autosave/quota failures | Inventory and new-field hydration | Failures not surfaced; localOnly can be success; S6 | P6; P7 reconciles active-room projection |
| Campaign persistence | D13; duplicated UIs | N/A | N/A | N/A | N/A | Single doc + login loss | Paths consolidated; hook guard | Consolidation closed; login overwrite remains; S7 | P5; no UI consolidation now |
| Offline behavior | Dirty guard/echo protections worth keeping | N/A | N/A | N/A | Hydration is not a trigger | Promise exceeds queue | Character queued writes disabled | Cache marks synced without upload; shared-browser flags | Honest device-draft guarantee; no offline combat replay |
| Creature execution | Shipped token/authoring infrastructure | Bestiary ahead of encounters | Art/archive not disposable | Targets/damage/behavior absent | Supported action adapters | N/A | No resolver added | Cost/chat only; S8 | P8 immediate action first |
| Spell/effect execution | Describes local effect pieces/relay | Rich magic/damage vocabulary | N/A | `applySpellEffects` has no runtime caller | Fragmented execution; adapters | N/A | Relay and cost contracts | Empty target IDs; receiver TODO; DOT works as separate path | P9 supported binding; no new spell schema |
| Conditions | Object/array drift | Status bookkeeping burden | Icon manifests | Three vocabularies; shipped application | Round serialization and mitigation unsafe | Mutations too broadly trusted | Store/resource cleanup | Typed payload not persisted as expected; rounds can disappear; S10 | P7 boundary codec, target identity, round preservation |
| Zones | Existing AoE | N/A | N/A | AoE reusable | Small zone candidate | Durability prerequisites | Research only | One local AoE placement; no durable zone domain | Choose D: defer until action execution stronger |
| Telegraphs | N/A | N/A | N/A | Dedicated store + lifecycle | Domain declaration, shared area/timing | N/A | None | Advisory AoE; no threat lifecycle | Later one declaration; no separate universal engine |
| Environmental interactions | Terrain/environment data | Tangible consequences fit game | Visual families available | Wet/aspect predicates proposed | Explicit recipient susceptibilities | N/A | None | No general execution; textures are not rules | Later authored, one-step interactions only |
| Anatomy/aspects | N/A | Body/history identity | Preserve art masters | Optional multi-track wyrm slice | Creature-owned capability facts | N/A | Character `bodyStates` added | Character body metadata is not creature aspect execution | Later selected wing archetype; no 193-creature conversion |
| Class identity | Protect resource contracts/banks | Thermometer convergence concern | Old roster is archive | N/A | Hypothesis; preserve asymmetry | N/A | Many domain contracts/tests | Distinct recipes/clocks/receipts/latches; S11 | PARTIALLY TRUE; small playtest, no mass redesign |
| Inventory | Working geometry/equipment | Strong; nested/axis/bonus concerns | N/A | N/A | Keep domain-specific | Peer-trusted | Hydration + echo-safe listener | Spatial system works; docs wrong; transport privacy false | Protect system; P4/P6 fix boundaries; design choices explicit |
| Rules/runtime drift | AP/aliases/legacy representations | Live talent/inventory/resource contradictions | N/A | Old creature docs stale | Damage shapes/aliases conflict | Unknown-field narrowing | Contract/content changes | Wrong rules rendered now; S12 | P10 plus reviewed supported damage adapter |
| Assets/storage | Duplicate trees; accounting/cleanup risk | Visual grammar is IP | Hybrid storage, no LFS now; optimize maps | Reuse existing art | Downstream presentation | Provisioning/accounting/cleanup unknown | Private paths/shared copies | Runtime tree distinct; fail-soft publish; deployed operations unknown | No archive/delivery project in ten; safety gate in P4 |
| Testing | Middleware helper bypasses | Static review, not balance playtest | Reference-scan limitations | Strong slice tests proposed | Composed/fault/reconnect tests | Existing tests miss failure paths | More math/auth tests | 250/2313 green beside 8 failures; one real-server test exists | Add relevant failure assertions, not more broad suite counting |
| Deployment/recovery | Independent pipelines/functions unknown | N/A | Firebase integrated | N/A | Restart proof prerequisite | Env/build ambiguity, restore absent | CSP/script tightened | Repo config improved; live status unknown; S14 | Stage gates; rehearse same room checkpoint restore |
| Giant files | Mixed risk; targeted extraction | First wizard step overloaded | Large assets may be intentional | Do not absorb behavior | Do not absorb gameplay into renderers | Maintainability secondary | Bounded edits, no main rewrite | Size alone not a demonstrated blocker | §29; extraction only for named projects |
| Product readiness | Working but partial | World ahead of rulebook | Archive is separate product value | GM-assist evolution | Experiment earns infrastructure | Beta/paid gates | Many dead relays closed | Functioning prototype with verified trust defects | First-table product; paid later |
| AI maintainability | Owner maps/contracts | Canon distinctions | Manifest before cleanup | Evidence and corrections | Narrow contracts/adapters | Dormant safety ≠ protection | Factual Δ bridge | Comments overclaim deep merges/privacy/coverage | Small operational docs + contract fixtures; audits become background |
| Lore/canon | Multiple content representations | Live hidden-key/founder conflicts | Archive need not match canon | Prose/stat schemas distinct | Do not infer rules from lore | N/A | Foundational canon/registry pass | Old and new claims coexist in live records; S13 | P10 selected live collisions; archive untouched |

### Decisions resolving actual disagreements

**A's protected extraction pipeline vs D's provenance finding:** preserve the loader, cache and version behavior; do not claim the generator works. Current `extract-data.mjs` names missing creature sources. The checked-in runtime JSON is the practical current source for those definitions. Do not run regeneration as a routine step for P8.

**D's deep-merge/automatic serialization implication vs E:** E is correct. Client state merges one level; server `token_updated` merges at the token root; personal serializers enumerate fields. New nested state is not safely replicated “for free.” P7 proves the exact envelope.

**A/F/Δ's blanket middleware-test characterization:** too broad. `tests/helpers/integrationServer.js` bypasses real wrappers; `tests/integration.test.js` boots the real server and installs them. Its assertions do not cover acknowledgements, map/action fields, canonical persistence faults or complete authorization. Preserve it and add the missing assertions.

**Δ's inventory-privacy conclusion:** reject the confidentiality claim. Ignoring a received packet is not preventing disclosure. The server's `socket.to(room.id).emit('inventory_update', ...)` delivers the payload first. P4 addresses delivery as well as attribution.

**F's strong direct-join capacity description:** incomplete. Current direct join counts `Object.values(room.players)` even though `room.players` is a Map, yielding zero for that representation. Invitation joins separately skip the capacity path. P4 tests a populated real Map and shares the join gate.

**F/Δ guest statements:** tokenless sockets may connect, but ordinary `join_room` is wrapped by `requireAuth` and rejects them. Verified Firebase tokens, including possible anonymous identities, are a different case. Do not expand `join_room`'s accepted `userId` field and thereby revive identity fallback. Guest product policy remains a human choice.

**B's class-convergence claim:** its “nearly every class” wording overstates what source establishes. Similar pressure fiction is real; sameness of player decisions is not established. §17 gives the narrower verdict.

**D's weighted bands and E's caution:** preserve absolute authored bands. Converting width to weights and redistributing a d20 is not the same behavior, especially with overlaps/gaps. No default weight 10 is warranted for a library carrying zero bands.

**D's proposed dragon slice vs E's Burning Ground:** both are too early as first execution work. The dragon bundles weighting, multiple aspects, saves, telegraphing and an unauthored wet interaction. Burning Ground adds clock/replay/zone state. A current one-target creature action proves the common consequence seam with less new fiction and state.

**E's universal-engine rejection:** accepted. Its small zone domain is a reasonable later candidate, not an immediate requirement. Some proposed primitives also wait until an actual consumer needs them.

**B's inventory exploit/rebalance prescriptions:** failure to recurse into nested contents is a source fact; “therefore add weight” is not established in a bulk-based game. Decide container external bulk/capacity and nesting policy first. Similarly, outer-zone STR/CON bonuses are a design question, not permission for engineering to remove them.

## 7. Current Finding Status Matrix

The chain is **original claim → Δ claim → current source → current test/reproduction → final status**. Deployment status is separate.

| Finding | Original audit → Δ | Current source | Current tests / reproduction | Final status |
|---|---|---|---|---|
| Inline room state discarded | A TD-002 / F P0-1 → unchanged | S2 fallback resets state first | R1 | **STILL PRESENT** |
| False writes dropped / save falsely succeeds | A TD-003 / F P0-2 → unchanged | S2 ignores false; unavailable DB can return true | R2/R8; suite does not assert failure | **STILL PRESENT** |
| Resume duplicates collections | F P0-3 → unchanged | S3 array concatenation | R3; old merge tests only happy cases | **STILL PRESENT** |
| Split write can mix versions | F integrity → unchanged | Sequential core/global/maps writes; differing thresholds | Source verified; live partial-write test not run | **STILL PRESENT** |
| Browser/server room writers compete | A D1 / E → unchanged | GM join starts browser autosave; per-user remote-wins also applies | S3 caller trace; no full fault/reconnect experiment | **STILL PRESENT** |
| Acknowledgements dropped | A TD-001 → uid limiter improvement, defect retained | S1 single-argument wrapper | R4 composed wrappers | **STILL PRESENT** |
| Routing/action/reconnect stripped | A TD-009 → unchanged | S1 schemas omit fields | R5/R6 | **STILL PRESENT** |
| Cross-room targeted sync | A TD-008 / F P1-8 → unchanged | S4 global recipient lookup | R7 | **STILL PRESENT** |
| Missing GM tools and relays | Earlier integration gaps → implemented | Current registry/handlers exist | Fresh GM/relay/session/quest suites pass | **RESOLVED** at handler/wiring scope |
| Quest durable recovery | D/A ephemeral relay → still ephemeral | Relay is not canonical shared quest persistence | Handler tests, not reconnect durability | **STILL PRESENT** as unsupported guarantee, not missing relay |
| Permanent-room takeover | Prior security finding → owner gate | Recorded owner rejected; legacy/early side effects remain | Gate source verified; complete negative lifecycle test absent | **PARTIALLY RESOLVED** |
| Room privacy | A TD-006 / F P0-4 → unchanged | S5 authenticated non-member parent reads allowed | No current rules-emulator proof | **STILL PRESENT** in local rules; deployment **UNKNOWN** |
| Private user/public profile split | PII finding → split/backfill claim | Owner private doc and public projection calls exist | Source verified; deployed backfill not established | **PARTIALLY RESOLVED** end-to-end |
| Token controls | Prior member-wide edits → owner/delegate gates | S4 denies owned foreign tokens; legacy fail-open | Explicit fail-open test still passes | **PARTIALLY RESOLVED** |
| Inventory privacy | Δ says private listener | S15 sends all inventories to room peers | Server/client source contradicts confidentiality claim | **STILL PRESENT**; listener application/echo repair **RESOLVED** |
| Category/shared-content permission gaps | A/F → rating/admin improvement | Category any-auth writes remain | Source; no emulator coverage | **PARTIALLY RESOLVED** broader cluster |
| Storage privacy/copy publish | Δ says source correct, ops unverified | Owner SDK rules; failed copy retains URL | No live Storage/rule/revocation check | **PARTIALLY RESOLVED**; operability **UNKNOWN** |
| Admin cascade deletion | A TD-005 / F → unchanged | URL-derived path deletion lacks owner-path guard | Source verified; deployment unknown | **STILL PRESENT** code risk; activation **UNKNOWN** |
| Campaign multiple active services | A D13 → consolidated | Hook delegates root service; old module removed | Source/import contract checked | **SUPERSEDED** old dual-path finding; consolidation **RESOLVED** |
| Campaign offline/login clobber | F P1-5 → hook guarded only | S7 provider hydrates unconditionally | Source trace, not real-cloud fault test | **PARTIALLY RESOLVED**; dangerous login path remains |
| Character silent autosave | F P1-6 → no fix | S6 failure returned/logged; no user status | Fresh transform tests pass but do not close hook UX | **STILL PRESENT** |
| Journal no-clobber/save status | Earlier gap → implemented | Load-null/status behavior present | Fresh journal/store suites pass | **RESOLVED** named paths, not all personal saves |
| Offline character schema corruption | Earlier flat write → no-op | S7 stops wrong write | Source verifies no write | **SUPERSEDED** corruption path; false-sync promise **STILL PRESENT** |
| Account-scoped local drafts | F P1-10 → flags added | Shared character/campaign/inventory/dirty keys | S6/S7; no account-handoff proof | **STILL PRESENT** |
| Creature target/consequence execution | D/E missing → no implementation | S8 cost/chat only | Fan/card/resource tests, no consequence path | **STILL PRESENT** execution gap |
| Creature bands/triggers/tactics evaluator | D config-only → none | Zero library fields; authored UI not runtime | Current JSON counts and consumer verification | **STILL PRESENT** authoring gap |
| Complete spell effect execution | A's broad description narrowed by D/E → relay fixed | S9 relay and planners; no shared effect application | Resource suites pass; target receiver remains TODO | **PARTIALLY RESOLVED** casting, execution still incomplete |
| Condition shape/round persistence | A D5 / E → unchanged | S10 type/data vs token/buff; NaN round serialization | Source verified; meaningful round-trip tests missing | **STILL PRESENT** |
| Creature alias always empty | A contradictory comment → flagged | Current setters mirror `creatureTokens` into `tokens` | S8 reads/setters verified | **SUPERSEDED** as blanket claim; root/nested payload ambiguity remains |
| Rules/canon collisions | B → selected content migration | S12/S13 contradicted live records remain | Playwright pack/talent checks; targeted source checks | **PARTIALLY RESOLVED** content program |
| Test coverage | A/F old totals → added suites | Existing tests substantial; fault assertions missing | Fresh 250 / 2,313 and R1–R8 | **PARTIALLY RESOLVED** |
| CSP/rules/Functions deployed correctly | F/Δ operational claims | Config changes present | Local worktree cannot establish live rollout | **UNKNOWN** |

**REGRESSED:** no issue in this synthesis is assigned this label without a verified formerly-working path and a current failure. Some changes introduce new risk (no-op sync, shared dirty flags, fail-soft copies); risk is not proof of a temporal regression.

## 8. Systems We Should Protect

- **Culture-first peoples and acquisition routes:** distinctions between native training, qualified outsider evidence and incompatible body states; preserved legacy IDs are compatibility, not permission to rename identities.
- **Minstrel cadence grammar and Arcanoneer sphere composition:** the contents of the bank matter, not merely its total.
- **Martyr's damage/earned/spent ledger, Pyrofiend's latched Debt Call, Lunarch's phases, Apex's resolved pack outcomes and Chronarch's own temporal costs.** No common-meter rewrite.
- **Physical inventory, shaped items, collision/rotation and die-step durability.** Correct contract/text discrepancies without replacing the tactile system with kilograms or D&D encumbrance.
- **Existing AP/initiative/movement machinery and active-defense intent.** Make timing and supported adjudication explicit; do not insert AC or standard saves for architectural convenience.
- **Room memory, movement coalescing, handler domains, owned/delegated controls and echo guards.** Repair contracts rather than replacing Socket.IO.
- **Character write-token conflict handling and seeded-record preservation of custom campaign edits.** New code must not equate a refreshed default with permission to overwrite user canon.
- **Map/editor, wall/elevation/FOV/vision/memory and 2D/2.5D render discipline.** Facing zero is meaningful; remembered information is not current information; WebGL is optional to the rules.
- **Table-ready ordinary life, layered truth/doctrine/rumor, creature provenance and strict anatomical/visual grammar.** These differentiate the franchise more than another engine subsystem would.

Protect existing per-field conflict policies as tested tools, but **do not promote HP=min/AP=max into the universal policy for every accepted action**. Healing, refunds and successive turns have different semantics. Ordered revisioned actions and a delta merge heuristic are different contracts.

## 9. Systems That Are Actually Broken

### Broken now: correctness and trust

1. The eight reproduced room/transport/recipient failure paths.
2. False or ambiguous save outcomes, including success-with-localOnly and memory fallback being mistaken for durable save.
3. Local campaign work can be replaced by login hydration; unscoped caches/flags can cross accounts.
4. Room reads and inventory delivery exceed the claimed privacy boundary.
5. Conditions can relay without being represented correctly in room persistence; round conditions can be filtered out on local serialization.
6. Creature flat `stateUpdates` can land on the server token root instead of its `state`. A changing HUD is not proof the resumed token has the same HP.
7. `sharedCampaignService` still calls boolean `isFirebaseConfigured()` as a function. The published-campaign feature remains outside the first supported product until a bounded repair is deliberately scheduled.

### Partially working

Casting costs/resource plans, conditions, overtime effects, personal cloud sync and reconnect each have working subsets. None warrants the label “all effects execute reliably.” In particular, DOT uses local-player aliases, numeric-percentage assumptions and browser timers; character resistances use structured multipliers. Unsupported shapes can produce bad arithmetic and wrong-recipient application. This is verified source risk, not an executed multi-client damage-loss claim.

### Designed but not executed

Creature priority/trigger/tactics rules, general spell triggers, complete channel progression, source-bound telegraphs, terrain hazards/material reactions and creature aspects. Their absence is not a bug in functioning manual play. Their presentation as automation would be a product defect.

### Debt and future concerns

Duplicated campaign UIs, dynamic imports, large renderer files and dormant experiments are maintainability concerns. Single-document worldbuilding, chat retention, multi-process room ownership and bandwidth become capacity/operations concerns. Billing, complete account erasure and recovery promises are commercial gates. These categories must not displace the demonstrated correctness failures.

### Drift classification

| Kind | Consequential example | Decision |
|---|---|---|
| **PLAYER-FACING RULE CONTRADICTION** | Pack axes/STR expansion, talent points/availability, advancement and quick-resource summaries | P10 must teach the selected rule that tested play actually supports; disputed balance stays a human decision |
| **RUNTIME-CONTRACT CONTRADICTION** | Token root/state updates, condition type/data vs persisted records, round/absolute clocks and resistance shapes | P1/P3/P7 repair the boundary with real producer/consumer/serializer fixtures |
| **CANON/LORE CONTRADICTION** | Live hidden seventh key, summit mechanism, First Contract founder, Veyra status and Minstrel provenance | Reconcile named live records to approved author truth, preserving attributed doctrine/rumor and custom worlds |
| **ARCHIVE-ONLY CONTRADICTION** | Old class rosters, retired creature-generation docs, historical art and lore alternatives | Retain as historical/franchise material; it need not match current canon |
| **COSMETIC STALENESS** | Dormant AP component table, whitespace-heavy class lore index, historical naming in unconsumed experiments | Leave unless a named supported consumer is actually affected |

Named legacy damage aliases are not automatically cosmetic: when a live damage adapter gives Shadow/Necrotic a different canonical school than another live path, it changes resistance and must be explicitly supported or diagnosed. An archive's old vocabulary alone needs no migration.

## 10. Systems Richer in Authoring Than Execution

| Domain | Authored/configured today | Executed today | Completion boundary |
|---|---|---|---|
| Creature abilities | Spell-shaped damage/heal/control/buff data; optional bands/triggers/tactics | Cards, local flavor rolls, cost confirmation and chat; manual HP controls | Supported immediate action through target/adjudication/commit |
| Spells | Targeting/effect/duration/channel/cooldown/trigger data; class-specific prices | Payment plans, rolls/cards/coins, some cooldowns, cast relay; separate overtime service | Supported adapter, explicit unsupported reasons, one consequence receipt |
| Conditions | Manual markers, buff/debuff records, effect presets, durations/tick settings | Icons, derived modifiers and local ticking | Stable target IDs, lossless records and one selected execution owner |
| Terrain/environment | Damage/movement fields and descriptive hazards | Painting, objects, walls, weather presentation and map sync | Explicit opted-in domain rule; no inference from texture/prose |
| Creature behavior | Priority bands/trigger picker/tactics | Inspection only | Read-only GM band/eligibility assistance after action completion |
| Lore/encounters | Ecology, institutions, hooks, provenance, crises | Codex/worldbuilding presentation; some quest/travel relays | One curated playable scenario, not automated world simulation |

The missing work is usually **binding existing intent to a tested path**, not inventing more authoring fields.

## 11. Source-of-Truth Map

“After boundary” is the target policy for the named projects. It is not a claim that current source already satisfies it.

| State | Authoritative source / intended boundary | Runtime representation | Persistence representation | Multiplayer representation | Presentation representation | Legacy/duplicates and judgment |
|---|---|---|---|---|---|---|
| Room/session | Live server `room.gameState`; one committed checkpoint after P3 | Server room Map; map-scoped state | Current inline or split; after P3 one versioned split checkpoint convention | Accepted mutations and server-selected snapshots | Browser stores/Grid/lobby | GM browser writes and personal remote-wins snapshots are **dangerous competing authorities** |
| Combat | Accepted table transition; GM adjudicates under chosen cooperative policy | `combatStore`, server combat object | Included in room checkpoint | Combat events and silent snapshot adapter | Timeline/AP/movement indicators | `currentTurn`, `currentTurnIndex`, `isActive`, `isInCombat` need boundary mapping; do not replay turns to hydrate |
| Character canonical data | Owner's `characters/{id}` through `characterPersistenceService` | Sliced character store when editing | Nested canonical document | Room's character projection, not ownership transfer | Sheet/creation/account views | Runtime doc is legitimate separate scope; overlap in live resources requires explicit reconciliation |
| Character runtime | Active room actor record for accepted table consequences; owner for personal/off-table edits | Health/mana/AP/class-resource state and token mapping | Room checkpoint plus owner `characterStates/{id}` and canonical save as appropriate | Stable actor ref + revision/receipt; owner applies matching personal update | Sheet/token/HUD | `'player'`/`'current-player'` remain local aliases only; never shared persistent addresses |
| Inventory | Owner `inventoryStore` for actual carried items; room containers separately owned | Shapes/positions/currency; equipment projection | Canonical character inventory / owner runtime snapshot | Same-owner delivery or explicit GM share; no room-wide private payload | Pack/container/equipment windows | Character inventory copy is a serialization projection, not a second packing engine |
| Campaigns | Root `campaignService` planning model | Campaign array/current ID | `users/{uid}/worldbuilding/campaigns`; account-bound local draft after P5 | No collaborative campaign editor implied | Account/window managers | Deleted Firebase path is superseded; two UIs do not justify two persistence authorities |
| Worldbuilding | User-owned domain stores; current framework/default seeds separate from campaign edits | Books/worlds/factions/timelines/etc. | Category singleton docs; uid-bound drafts/dirty state after P5 | Personal cloud sync; deliberate sharing only | Codex/editor/boards | Same-account two-device overwrite remains a conflict-policy concern; seeded custom records must survive |
| Creature definitions | Current runtime JSON/custom creature definition; prose bestiary is narrative authority only | `creatureStore.creatures`, cached library | `public/data/creatures.json`, `abilities.json`; custom `userCreatures` | Referenced/snapshotted definition attached to instance/action | Cards/wizard/inspect | Missing generator sources are **provenance break**, not proof JSON is invalid; prose/stat schemas legitimately coexist |
| Creature instances | Accepted map token, state under `token.state` after P7 | `creatureTokens` array; server token dictionaries | Room map snapshot | Scoped token/actor changes | Tokens/HUD | `tokens` alias usually mirrors correctly; root/state updates and `map.creatures` are **dangerous ambiguity** |
| Conditions | Individual actor-bound records plus explicitly separate manual markers | `conditionStore` arrays; token icon projection | Room actor/condition codec and clock-preserving personal serialization after P7 | Add/remove/update operations keyed by record/actor identity | Rings/icons/creator/HUD | Singular token-keyed server record vs type/data client protocol is **real contract bug**; authoring/display vocabularies may remain with a mapper |
| Spells/effects | Existing spell definition/class price contract; supported meaning identified by adapter | Transient plan, existing owner trackers; accepted consequence | Existing libraries plus result/state checkpoint | Proposal → GM adjudication where needed → one committed result | Cards, rolls, cooldown bars, chat | Authoring/card schema and runtime plan are legitimate projections; dormant `applySpellEffects` is not canonical live execution |
| Zones | **No new authoritative zone domain in this phase** | Current local `spellAoEStore.placement` | No durability claim for that advisory singleton | No zone commit protocol promised | Current AoE overlay | Measurement template is not a hazard; future zone instances must earn their own domain |
| Assets | Canonical source/master and owner-approved art provenance | Runtime copies/delivery derivatives | Git/runtime tree; Storage user files if operable; later archive manifest | URLs/asset references, not visual rule state | Images/models/audio | Root `public` is not deployed; duplicate/source/archive copies are often legitimate, not automatic cleanup |
| Lore/canon | Creator-approved blueprint/current core framework; labeled doctrine/rumor; user-world overrides | Registry/default datasets and lexicon | Source documents/live content JSON; campaign edits separately | Explicit handouts/world sharing | Rules/lore/world map | Live contradictory author-truth passages must reconcile; archive-only disagreement is allowed |

### Dangerous drift to fix vs coexistence to keep

Fix competing room writers, incompatible actor IDs/update envelopes, condition serialization and live rule claims. Keep canonical vs runtime character scopes, creature prose vs stat blocks, content definitions vs pinned live instances, local viewport vs shared map layout, and franchise masters vs runtime derivatives.

Do not “normalize everything” merely because names recur. Scope and meaning, not aesthetic uniformity, determine whether two representations conflict.

## 12. Multiplayer Authority Model

The cooperative policy is **server acceptance and routing, GM adjudication, player ownership, downstream presentation**. It is not an anti-cheat rewrite.

| Mutation class | Intended authority | Current difference / required boundary |
|---|---|---|
| Room identity/membership/GM moderation | **SERVER AUTHORITATIVE** identity/role/capacity; GM chooses moderation/settings | Resume legacy gate, early side effects, invitation joins and Map capacity need tests. Kick is removal, not a durable ban; mute reconnect semantics must be stated. |
| Movement | Owner/delegate/GM proposes; **SERVER AUTHORITATIVE** actor/map/scope acceptance | Preserve coalescing; restore route/action fields. Table legality/path/AP is domain/GM adjudication, not universal server anti-cheat. |
| HP/mana/AP accepted table change | **GM AUTHORITATIVE / ADJUDICATED** result or permitted self change; server validates target/revision and commits | Current root/state and alternate mutation paths disagree. P7 must close bypasses for the supported fields. |
| Character build and class resources | **PLAYER-OWNED** canonical sheet; class contract owns price/transition; GM adjudicates effects | Server does not re-derive the class. Accepted session costs/results must apply once and reconcile to the matching owner/character. |
| Inventory | **PLAYER-OWNED** personal state; explicit owner-approved GM sharing | Current room-wide relay leaks contents and accepts supplied identity. Fix delivery; no server simulation of packing required. |
| Creature action | **GM AUTHORITATIVE / ADJUDICATED**, optionally delegated later; server commits source cost/target consequence | Current use spends and logs only. No creature AI takes its turn. |
| Spell cast | Player proposes and plans owned price; GM confirms uncertain/cross-actor consequences; server commits | Cast relay is a notice, not authority to subtract HP on every peer. Keep recipe/payment ownership in cast domain. |
| Environment/walls/weather/doors | GM owns persistent environmental edits; door interactions may be explicitly delegated | Current some member-level paths differ from GM-only wall/light/fog paths. Do not silently decide all player door interaction is forbidden. |
| Zones | Future GM-authored domain rules; server commits when/if enabled | No first-phase automatic zone authority or timer election. |
| Quests | GM owns offers/reward adjudication; players own acceptance/progress response | Relay now exists; offered quest durability/rejoin not established. Do not pay rewards again during recovery. |
| Journal handouts | Owner/GM deliberately publishes projection; server checks share entitlement | Private journal persistence and public handout are distinct; no automatic full-journal disclosure. |
| Campaign planning | **PLAYER-OWNED** GM account data | No live co-GM editing guarantee. Cloud hydration may not silently erase a local dirty draft. |
| Dice outcomes | **PEER-TRUSTED BY DESIGN**, identity/visibility enforced by server | Physical dice/manual results acceptable; no cryptographic fairness project. Store chosen results with accepted consequences. |
| Cursors, typing, animations, cameras | **CLIENT-PRESENTATION-ONLY**; identity/routing checks where relayed | No durable action consequence derived from particles, animation completion or cursor packets. Viewport need not be room authority. |
| Local sandbox/table play | **LOCAL-ONLY**, same domain calculations where supported | Explicit local scope; local snapshots never impersonate server acceptance or cloud durability. |

**Shared state ordering:** a new supported action uses stable room/map/actor references, expected revisions and a retry-stable command ID. The server accepts once; peers display the same result. A receipt is a bounded confirmation record, not an infinite event log.

**GM absence:** continue manual cooperative table use according to room policy; pause new cross-actor automated adjudication. Do not elect whichever browser has a running timer. Whether combat itself continues is a product decision, not a scheduler implementation detail.

**Privacy:** member-only room access protects against other accounts/tables. It does not by itself make GM secrets secure against an authorized member inspecting received snapshots. Promise only the tested entitlement/delivery boundary. Fog and memory still matter for normal presentation.

## 13. Game Runtime Architecture Recommendation

Use this small path:

**Existing authoring → supported-field adapter → domain proposal/adjudication → bounded actor commit → state/receipt → presentation.**

### Shared infrastructure worth adding or reusing

1. **Event envelopes and compatibility fixtures:** stable IDs, optional routing, explicit errors and acknowledgements. Fix existing middleware, not another transport.
2. **Room checkpoint codec and revision contract:** shared canonical serialization, honest outcomes, silent hydration, preserved unknown supported data. Local and personal caches have explicit scope.
3. **Actor addressing/application:** character/creature adapters resolving exact room/map/token/owner identities. Admit only needed HP/mana/AP and condition operations; validate finite values and per-target revisions.
4. **Bounded command receipts:** keep the result and enough replay information for current checkpoint/retry windows; reject too-old revisions/epochs instead of retaining endless history.
5. **Condition aliases and duration codec:** map existing authored/display names at the boundary; retain round counters as counters and absolute expiry as absolute expiry.
6. **Pure damage/mitigation calculations where meanings are actually reviewed:** existing numeric creature percentages, character multipliers and mitigation/conversion cannot be interpreted as the same number by accident. GM-adjusted final outcomes remain supported.
7. **Existing geometry/targeting UI:** reuse for explicit selection. `targetingStore`'s supplied distance/LOS fields are not proof it calculates legal range itself.

A reusable abstraction should have **two demonstrated consumers** or a concrete imminent second consumer. Creature and character immediate actions satisfy that test for actor consequences. Ritual progress, wings, cultivation and surface chemistry do not yet establish one generic engine.

### Systems that remain domain-specific

- Class-resource plans, recipes, banks, debt, phase transitions, eligible damage and costs.
- Combat initiative/AP restoration, movement budgets, active defense and the Ladder of Trials.
- Creature eligibility, tactics, d20 bands, aspects, repair and disabled capabilities.
- Spell casting/channeling/cooldowns, support diagnostics and source lifecycle.
- Actor conditions, their stacking and any damage tick policy.
- Inventory/container geometry and durability.
- Scenario/ritual/flood progress, travel clocks and lore history.
- Zone lifecycle/susceptibility if later built.
- Fog/memory/entitlement and renderer-specific visual behavior.

### Things this architecture must not do

No global entity registry replacing every store; no unrestricted state-patch operation; no rules DSL/eval/property-path engine; no recursive triggers; no duplicate client/server simulation; no “generic resource” gains; no shader/particle callbacks determining rules.

**Critical sequencing:** first make manual, explicit actor mutations unambiguous. Add the chosen immediate action. Only then add any automatic timing-driven consequence. Current overtime processing must not be promoted to shared automatic resolution until owner/target/mitigation/replay semantics are proven.

## 14. Creature System Decision

### Verdicts

- **Should actions resolve targets/damage/effects? Yes, incrementally.** P8 starts with immediate single-target damage, a GM-confirmed defense/mitigation result and one receipt. Unsupported control/summon/channel/passive branches remain manual.
- **Should weighted behavior be implemented? Yes, as a later opt-in GM aid if the action slice proves useful.** First implement authored band matching and supported eligibility, not a replacement weighting ontology. It is not a launch blocker or one of the first ten.
- **GM suggestion only? Yes.** The GM chooses, overrides and explains. No autonomous action, movement, target choice or turn advancement.
- **Execute triggers? Evaluate a tiny supported subset for suggestions/eligibility:** HP threshold, AP/mana affordability and known conditions against a read-only snapshot. Unknown/missing facts produce “GM check required.” Do not turn an eligibility predicate into automatic casting.
- **Aspects/anatomy? Yes, selectively, later.** Begin with one creature archetype and one tangible wing track. Healthy → Injured → Broken should visibly remove Flight/Wing Buffet/Dive Bomb eligibility as authored. It should not require every creature to acquire an anatomy schema.
- **Consume shared state through adapters.** Behavior reads committed actor HP, conditions, map facts and accepted timing; it does not own those facts or become a universal effect system.

### Smallest worthwhile action slice

Use the already-authored **Grimmstalk — Feather Slash** (`grimmstalk_feather_slash`):

- Single enemy target, 10-ft melee range, `2d8 + 5` Slicing, 1 AP, zero mana.
- Source and target are selected explicitly; range is measured/previewed and the GM adjudicates uncertain legality/defense.
- GM sees the actual roll and final adjudicated mitigation/result before acceptance.
- Acceptance changes the source AP and correct target HP once, logs the result and survives snapshot/rejoin without reapplication.
- First acceptance fixture uses two creature instances; P7's character addressing and P9's owner reconciliation then prove the character case.

This is a proof of **execution plumbing**, not a claim that a slicing damage formula is uniquely Mythrill. Its class/creature-specific fiction and Mythrill defense rules remain in their domains. The next anatomy experiment proves the tangible fantasy that a broken wing changes available choices.

### Why the proposed wyrm is too large first

D's slice bundles three aspects including an abstract Will track, multiple state transitions, new wet interactions, weights, saves and telegraph cancellation. Its example bands overlap and its weighting conversion changes their meaning. The source has no wet runtime contract. Those are multiple design hypotheses, not one bounded first proof.

Preserve the wyrm proposal as research. Start later with **one wing, manual state changes and explicit disabled abilities**, then add one declared breath response window if play demonstrates value. No bestiary-wide conversion.

## 15. Spell / Effect System Decision

### What actually exists

Spell/ability authoring already carries `damageConfig`, `healingConfig`, `targetingConfig`, `resourceCost`, duration/cooldown/type/effect data, and richer trigger/channel structures. Class contracts are consumed in both sheet and HUD casting. Dice/cards/coins are real player roll paths.

But current `ActionBar` casts can emit empty target arrays, and remote cast handling logs a notice with an effect TODO. `utils/spellEffects.js` has test callers without a verified live application caller. The overtime service is another path, not evidence all spell-wizard output executes.

### Decision

P9 binds **immediate single-target DICE damage or healing** to the P7 consequence boundary. It uses existing spell fields and existing class-price planners. A small support adapter returns either a supported plan or an explicit manual-only reason. Do not create another spell schema or use card display transformation as a lossy runtime compiler.

Creature and character actions share actor references, result receipts, finite-value validation, target-state application and presentation of the result. They **do not** share acquisition, class resources, behavior bands, anatomy, active-defense eligibility, cooldown policy, channel progression or targeting fiction.

### `effectProcessingService` policy

**Reuse and narrow, do not crown it the engine.** Extract/test only the needed calculation/application seam. Leave overtime scheduling in the condition domain. Review numeric creature resistance, named levels, character `{level,multiplier}`, vulnerabilities, absorption/inversion and alias conflicts explicitly. Unsupported mitigation returns manual adjudication, never NaN or a silently unmitigated default.

The current local-player shortcut must not be serialized into a room-wide target. Existing realtime effects remain a separately labeled capability; automatic shared ticks wait for a single evaluator and accepted boundary/receipt tests. Neither P8 nor P9 secretly completes all DOT, channeling, reactions or heritage passives.

## 16. World Effects / Zone Decision

**Choose D: DEFER IT UNTIL CREATURE/SPELL EXECUTION IS STRONGER.**

E is correct to reject a universal World Effect Engine. Its conditional small zone domain may eventually be useful. It is still premature as the next implementation project.

Reasons:

1. One immediate action already lacks trustworthy target/state/persistence binding. Repairing that benefits the entire table.
2. A persistent zone adds a new state owner, an accepted timing boundary, expiry, replay guards, spatial membership and reconnect behavior.
3. Current AoE is one local committed measurement template; it is not durable hazards. Reuse geometry, not that mistaken guarantee.
4. Burning Ground's Water → Steam is a candidate authored interaction requiring a human rule, not established universal element chemistry.

**Better first slice:** Feather Slash, then one supported character spell. It proves identity, costs, adjudication, consequences and recovery with no new clock or area domain.

After P7–P9 and an actual table trial, revisit whether a persistent area card plus an existing condition/consequence adapter is enough. If yes, stop there. If membership/lifecycle genuinely needs a zone, E's single circle/end-turn/public/creature-only experiment is reasonable. Remove Water → Steam from its first proof unless that interaction is the table's actual need; add the reaction as a second bounded validation.

A later zone must use committed map geometry/current positions, a named boundary, one adjudicator and one canonical checkpoint. No drag-frame triggers, renderer-dependent damage, secret-state claims, simultaneous-material solver or general temporal scheduler.

## 17. Class / Resource Identity Decision

**Classification: PARTIALLY TRUE; gameplay sameness REQUIRES PLAYTEST. It is not a confirmed 21-class design problem.**

| Current example | Actual decision distinction | What is not proven |
|---|---|---|
| Minstrel | Exact I–VII recipe contents; wrong pitches cannot pay; gains do not fund the same cast | Cadence usefulness and encounter pacing |
| Arcanoneer | Eight typed elements, rolled acquisition and combination grammar | Every recipe/spec's balance |
| Martyr | Eligible damage bank, earned/spent/bonus Devotion; spending does not erase the damage history | All automatic eligible-damage classification |
| Pyrofiend | Peak can latch a terminal call before a combined vent; lowering Veil does not undo it | Full combat-owner clock/terminal consequence wiring |
| Lunarch | Four phases and phase-specific access; not a spendable scalar | Complete automatic phase pacing in all play paths |
| Apex | Resolved pack-outcome receipts and per-own-turn generation cap; solo cast is not a hit | Full automatic capture of every outcome |
| Toxicologist | Prep/rest-limited Vials and Parts; no generic gain/vent cost plan | Preparation's table value |
| Harbinger / Berserker / Spellguard | Different sources and prices, but genuine escalating-pressure meters | Whether players experience these as the same optimization loop |

The smallest design validation is **two short encounters using Harbinger, Berserker and Spellguard, with Minstrel or Apex as a control**, plus physical tracking cards. Keep comparable encounter pressure, vary the fictional situations that should distinguish each class, and record the decisions players make: what generates power, what changes their target/action choice, when they spend, what the price prevents, and whether the other character could make the same decision for the same reason.

This is a design/playtest task after the supported action path, not a new implementation campaign. If only the bar presentation converges, adjust explanations/affordances. If one class's choices truly collapse into another's, change **one small rule in one class** and retest. No mass rewrite.

Also reject B's implied exclusive maritime replacement for Minstrel. Native acoustic traditions can include sea, stage, ancestral voice and other approved media. Reconcile unsupported “dying universes” headline claims to **embodied resonance and cadence construction**, preserving native variations and beautiful as well as dangerous music.

Chronarch owns manipulation of time. Duration counters, rounds and expiry are bookkeeping, not permission for universal future-AP borrowing, rewinds or temporal currencies.

## 18. Tabletop Equivalence

For every supported gameplay feature, require the same choices and outcomes with the VTT removed.

| Architecture recommendation | How it works without the VTT | Acceptance rule |
|---|---|---|
| Immediate creature/spell action | Read the existing ability, name the target, roll its dice, adjudicate defense, mark AP/mana and HP | One result; no hidden targeting or mitigation law |
| Actor consequences/receipts | GM records “this attack already resolved”; sheets/markers reflect it | Retry/reconnect cannot mean a second attack |
| Conditions | Named token/card plus written effect; round die or expiry note | Marker and numerical effect are distinguished; one stated clock |
| Behavior bands/eligibility | Printed d20 table and visible “if” lines; GM chooses among eligible results | Gaps/overlaps stay explicit; no invisible redistribution |
| Broken wing | Healthy/Injured/Broken boxes; cross out Flight and linked attacks when broken | Concrete capability loss, not merely a generic −2 |
| Telegraph | Face-up action card and optional cone/template, due note and interruption options | Players can perceive and respond; costs paid once |
| Future persistent area | Drawn patch/template and duration die; check written membership at named boundary | No unseen drag interpolation or per-frame hazard |
| Susceptibility | Explicit authored line on the object's/zone's card; flip its state marker | Water or Storm only causes the interaction that is actually written |
| Ritual/encounter progress | Visible tracker advanced by the listed meaningful fictional act | No generic momentum currency or elapsed-animation trigger |
| Inventory | Printed pack grid/item shapes and container cards | Same bulk/nesting policy and collision footprint |
| Class resources | Notes, elemental counters, ledgers, phase die and class-specific cards | A common tracker library does not create common gameplay |
| Visuals/audio | Optional colors, miniature/template and description | Turning them off cannot change eligibility, timing, result or information entitlement |

**Deliberately do not automate:** GM intent/fictional contact, uncertain line-of-effect/defense rulings, social meaning, plot/canon truth, creature tactical choice, all environmental chemistry, every heritage trigger, or correction of a past result as universal rewind.

Bookkeeping can be fast and rich. The rules must remain explainable on the physical card.

## 19. Asset / Archive Strategy

**No asset archaeology, mass cleanup, LFS migration or delivery-system project belongs in the first ten.** Access/cleanup safety for user uploads is part of P4's trust boundary, not an archive optimization program.

Adopt four lifecycle categories now as policy:

1. **Runtime product:** delivered files needed by current interfaces.
2. **Franchise canon:** approved source/master art and lore with an owner and provenance.
3. **Development archive:** retired concepts, alternate rosters, prototypes and production sources.
4. **Disposable generated output:** confirmed regenerable captures/logs, never assumed from an unreferenced filename.

C's byte counts are useful audit-time evidence, not newly measured totals. In particular, ignored `.gemini`/Playwright disk weight is not Netlify delivery or Git clone weight. Root `public/` is a legacy tree, not another currently shipped deployment root. Deleting it has little immediate player benefit.

**Retain `Mythril.jpeg` and other high-resolution canonical map sources.** Interactive cartography may need their detail. If measured load cost becomes a first-session blocker, generate bounded delivery derivatives, progressive/multiresolution tiles or a runtime copy; preserve source dimensions, canonical geometry/calibration and deep-zoom fidelity. Do not casually resize the master or invalidate authored coordinates.

Later: a small manifest for selected delivery families and build-time inclusion/exclusion, preserving dynamic icon conventions. Do not create a repository-wide manifest bureaucracy before a delivery change needs it. Firebase's integration is not proof Storage is currently provisioned; externalizing canonical assets is deferred until operation, backup and link semantics are proven.

## 20. Commercial Readiness Gates

These gates separate current development from user-facing promises. They are not six months of enterprise infrastructure inserted before a local action prototype.

| Stage | Minimum gate | May wait |
|---|---|---|
| **PRIVATE DEVELOPMENT** | Preserve local work/recovery copies; use explicit local-only status; production identity must not be impersonated; prototypes use test/local data; keep known cloud failures visible | Billing, scale orchestration, marketplace, automated fleet operations |
| **CLOSED ALPHA** | P1–P7 reliability/identity boundaries for advertised features; owner-approved room policy; tested real-middleware contracts; rules emulator negative cases; actual staged deployment/config smoke; room false-write/restart/resume proof; recoverable snapshot/export and a basic restore rehearsal; offline/save wording true; supported private data isolated across accounts | Full effects, zones/anatomy, mass content conversion, subscriptions, co-GMs, distributed ownership |
| **EXTERNAL BETA** | P8–P10 coherent first-table experience; repeated two-client/reconnect scenarios; durable operations actually deployed; size-limit failures visible; operator backup freshness/restore and rollback procedures; documented supported versions; dependable personal data export and a verified erasure procedure for beta accounts, whether manual/operator-assisted or automated; published scope/support/privacy commitments | Payment processor, premium entitlements, marketplace monetization, multi-region, full offline conflict merging |
| **PAID LAUNCH** | Beta gates plus server-verified billing/entitlement/grace policy; comprehensive account erasure and user export for all sold surfaces; campaign/room/asset backups and tested restore; safe deletion/accounting; size/retention strategy for measured valuable data; documented ownership/succession expectations; deploy/schema rollback; support and minimum abuse controls | Full simulation, bespoke VFX catalogue, global audit logs for every pointer event, multi-region absent need |
| **MEANINGFUL SCALE** | Measured load/soak ceilings, room placement/single-owner policy across processes, quota reconciliation/cost controls, bounded state/receipt/chat retention and operational alerting | Distributed architecture until actual concurrency exceeds one-owner limits |

**No payment while known campaign-data-loss paths remain.** A cloud console setting not present in Git may already provide backups; verify it, do not claim absence from the provider solely because the repo lacks config.

For the first release candidate, use built-in assets and keep upload/community publish unavailable if Storage/copy/privacy gates cannot be demonstrated. The source's current fail-soft URL behavior is not a successful public-publish guarantee. Destructive Functions must be verified safe before activation or reliance, even if quota automation otherwise seems convenient.

Choose one authoritative frontend build/deploy path and explicitly record Firebase configuration for the delivered bundle. A local dev route and a static-site curl are insufficient. Frontend, server, rules and Functions can deploy independently; compatibility and rollback must be documented together.

The first ten do not implement billing, complete account erasure across the franchise/platform, arbitrary large-data sharding or marketplace integrity. These become bounded follow-up work when the corresponding gate is selected. They do not block a local creature action proof.

## 21. Human Decisions Required

Recommendations are defaults for discussion, not silently established product law.

| ID / question | Why engineering cannot choose alone | Options and tradeoffs | Recommendation | Project blocked? |
|---|---|---|---|---|
| H1. Who may discover/read/join a room? | Campaign privacy, community discovery and ease of joining are product expectations | Open/password, invitation-only, or mixed; discovery metadata can be public while state stays private | Member/GM-only durable state; keep explicit password joining initially; add real invite-only mode only if desired | **P4 policy/rollout**; P1 unaffected |
| H2. Are guests/anonymous accounts supported at public tables? | Ease/accessibility vs durable ownership and account recovery | Signed-in accounts only, temporary guests, Firebase anonymous identities | Signed-in accounts for first durable version; preserve local guest sandbox | P4 release policy; no need to weaken P1 identity |
| H3. What may “saved” mean? | Trust promise governs acceptable recovery loss | Local/device, accepted live server, confirmed cloud checkpoint | Show all three distinctly; “Cloud saved” only for confirmed revision | P2/P6 wording acceptance; no reasonable case for false success |
| H4. How to reconcile contradictory legacy room snapshots? | Revisionless candidates can contain different valuable creative work | Choose server fragments, inline copy, manual comparison/import | Preserve both, export candidates, GM chooses where precedence cannot be established; never timestamp-guess away data | P3 **migration of ambiguous live rooms**, not codec implementation |
| H5. What are offline guarantees? | “Automatic sync” implies conflict/replay commitments | Device drafts/retry, full offline personal sync, offline shared combat | Account-bound personal drafts with visible pending/error and explicit reconciliation; no offline combat replay | P5/P6 published contract; full queue deferred |
| H6. How do inventory containers represent bulk and nesting? | Weight/bulk are game rules, not storage formats | Fixed external bulk with finite capacity; contents alter bulk; restricted nesting; special magical containers | Bulk-first, explicit finite container capacity and nesting policy; do not add a universal mass rule from audit rhetoric | **P10 explanation** if claiming nesting rules; no inventory-engine rewrite in ten |
| H7. Are outer-zone STR/CON bonuses and equipment exceptions intentional? | Existing physical fantasy may value a slow “lumbering wall” | Preserve actual stat modifiers, restrict them to certain checks, remove after testing | Document current behavior and test one deliberate overpacking case before changing balance | P10 definitive rule wording; preserves current code pending choice |
| H8. Which attack/defense/AP rules are intended for first-table play? | Live rules disagree, and automation must not decide canon | Existing initiative-restoration modes vs fixed AP; current active defense/soak/crit descriptions | Publish configured AP behavior; keep GM-confirmed defense/final outcome in initial action slice; approve wider mitigation separately | P8/P9 auto-mitigation scope and P10 combat text; P7 final-amount commit can proceed |
| H9. Can combat continue without GM / who advances turns? | Table style and continuity, not anti-cheat preference | Cooperative turn owner, GM-only, manual continuation with automation paused | Cooperative table policy explicit; one GM adjudicator for new cross-actor consequences | P7–P9 multiplayer acceptance policy |
| H10. Exact duration, telegraph and susceptibility semantics? | Partial-round counting, retargeting, water contact, visibility and stacking are fiction/rules | Named boundary variants; whole/partial contact; lock/follow cone; public/secret knowledge | Decide one printed rule per later slice; no inferred Water/Storm matrix | **No first-ten blocker**; blocks later timed/zone/aspect automation |
| H11. Do the pressure classes feel too alike? | Only players' decisions establish this | Preserve, improve presentation, alter one class after a comparison trial | Small matched playtest (§17), no 21-class overhaul | No foundation blocker; later design evidence |
| H12. What is retained/deleted on account removal, including published content? | User IP/publication/retention expectations determine the policy | Delete, anonymize public copies, transfer room/campaign ownership | Export first; erase private data; state published-content policy explicitly; never silently abandon shared campaigns | External-beta erasure procedure and paid gate, not P1 |
| H13. What is being sold and who owns operations? | Price, promises, entitlements, recovery objectives and deploy authority are business decisions | Free invited tool first; subscriptions later; self-hosted/product hybrid | Free first-table release; appoint one deploy/recovery owner before external testing | P10 release signoff / operations gate; billing later |
| H14. Who can see/share private uploaded art and inventories? | Consent and revocable sharing cannot be inferred from a URL or GM status | Owner-only; explicit GM share; community copies; bearer-link sharing | Private by default, explicit audience/copy publication; distinguish download-link sharing from authenticated SDK access | P4 delivery/privacy acceptance; built-ins fallback permitted |

**No human decision blocks Project 1.** Its scope restores existing technical contracts and prevents wrong-room delivery. Do not confuse preserving a routing field with trusting a client-provided identity.

## 22. NOW

The action queue is **P1 → P2 → P3** for transport and room integrity. P4–P6 can progress on non-conflicting personal/privacy surfaces under the dependency rules. Do not open all six simultaneously merely because they are NOW.

| Lane | NOW work | Why it belongs here |
|---|---|---|
| **1 — Foundational reliability** | P1 event envelopes; P2 honest saves/retained work; P3 canonical checkpoint; P5 personal draft handoff; P6 character save outcomes | Demonstrated correctness/data-loss risk and leverage across existing systems |
| **2 — Core RPG execution** | Specify P7's narrow actor identity/consequence contract against known failure fixtures | Needed by creature/spell execution; avoid feature implementation over wrong actors/state |
| **3 — Multiplayer/collaboration** | P1 same-room recovery; P4 verified identity/access boundaries | Stops wrong-table injection and privacy overclaims |
| **4 — Game/IP consistency** | Freeze authoritative source for the specific P10 live rules/canon corrections; identify H6–H9 decisions | Prevents implementing disputed rules as an accident of code reuse |
| **5 — Asset/delivery infrastructure** | Preserve source masters and classification; no optimization project | No demonstrated foundation dependency; archive work has lower immediate leverage |
| **6 — Commercial/operations** | Record actual deployed services/build owner and recovery prerequisites for staged testing | A bounded release fact, not another commercial audit or billing program |

Severity, likelihood and user harm put room/personal data ahead of cosmetic cleanup. P1 precedes the highest-harm persistence changes because its small real-path contract fixture enables reliable acknowledgements/testing; it must remain small. If P1 expands into a protocol replacement, stop.

## 23. NEXT

- **P7:** stabilize actor application and condition serialization, including supported-field authority and silent snapshot behavior.
- **P8:** complete one GM creature action; prove source cost/target result/retry/rejoin.
- **P9:** connect the same bounded consequence to supported character spell entry points, preserving domain prices.
- **P10:** publish the first-table rules/execution contract and operational context, with actual physical/browser acceptance.

A local action prototype needs stable actor addressing/application, not production billing or a provisioned CDN. A multiplayer durability claim requires P1–P4/P7 and the staged recovery proof. Neither should be misstated as blocking every form of gameplay development.

## 24. LATER

Valuable work after the first-table boundary:

- Authored d20-band/eligibility GM suggestions following a successful action trial; physical behavior card included.
- One optional wing aspect, then one creature-owned telegraph if it changes player decisions.
- A small persistent-area binding if a real encounter needs membership/duration; Burning Ground remains a candidate, not destiny.
- The matched pressure-class playtest and one measured design revision if warranted.
- Per-book/per-campaign documents when measured size/conflict behavior warrants migration; explicit co-GM ownership/sharing if demanded.
- User-facing room/campaign/account export, complete erasure automation and stronger backup/restore tooling as beta/paid guarantees expand.
- Storage accounting single owner and reconciliation, fail-closed publish copying, reversible share semantics and retention after operation is established.
- Bounded dialogue relay, NPC persistence and shared-campaign boolean repair when those surfaces become supported release scope.
- Targeted asset derivatives/manifests/build filtering; no canonical master loss.
- Conditional load/soak work, lint truthfulness and dependency hygiene tied to the selected release pipeline.

These are **deferred good ideas**, not rejected because they lack value. They are not additional numbered implementation projects authorized by this document.

## 25. NOT YET

### Rejected recommendations / interpretations

| Idea to reject | Source/interpretation being challenged | Why |
|---|---|---|
| Universal World Effect/Entity engine | Universal hypothesis investigated by E | Creates another owner/schema before shared gameplay semantics exist |
| Redis transport implies scalable room authority | Possible inference from A/F topology | Each process still has its own room memory; no coherent distributed owner is supplied |
| One common resource mechanic for all classes | Overextension of B's convergence critique | Destroys authored recipes, banks, clocks, outcomes and costs |
| Rewrite all 21 classes from static analysis | B's hypothesis treated as a verdict | Player decision sameness is unproven |
| Convert/reweight every creature or synthesize default bands | D's default-weight/conversion proposal | Current library has no bands; absolute ranges, gaps and overlaps are not interchangeable with redistributed weights |
| Full proposed wyrm as first slice | D §11 | Bundles multiple unproven rules and execution domains |
| Dedicated universal telegraph engine with its own geometry/clock | D expanded into a platform | Threats belong to actions; geometry/timing helpers can be reused later |
| Restore conventional AC/standard D&D saves for uniformity | Convenience interpretation of missing resolution | Contradicts Mythrill's combat/fantasy; initial outcome can be adjudicated |
| Crit-die inversion is a confirmed bug requiring new crit rules | B §8 balance prescription | Probability is a fact; whether its tradeoff is wrong requires complete rules/playtest evidence |
| Add weight accounting or remove encumbrance bonuses without design choice | B §7 prescriptions | Bulk/body/load policy needs a physical rule; engineering cannot choose by taste |
| Minstrel must become exclusively maritime / rename Berserker now | B identity suggestions | Embodied cadence and culture variation are stronger boundaries; renaming has no demonstrated current leverage |
| Rewrite regional government templates for variety now | B broad IP suggestion | Creative expansion is not a trust/execution prerequisite |
| Mark inventory private because recipients ignore packets | Δ §12.4 | Disclosure occurs in transport before the UI filter |
| Treat cloud unavailable/localOnly/no-op queue as saved | Existing return/comment interpretations | Erases the meaning of durability and risks losing the only copy |
| Preserve all actor effects by simply adding optional fields | D pass-I implication | Current serializers and merge envelopes do not guarantee it |
| Put rules in Grid/token/Three.js for convenient access | Temptation identified by A/D/E | Renderer ownership hides authority and multiplies simulation |
| Destructive resizing/deduplication/history rewrite | Aggressive interpretation of C/A asset findings | Unreferenced does not mean disposable; masters and history carry franchise value |

### Premature even if attractive

General condition/material DSLs, recursive reactions, fluid/electrical/fire spread, automatic ecology, simultaneous encounter clocks, all 3D volumes/collisions, hundreds of spell animations, generic pressure/momentum currencies, future-AP borrowing outside Chronarch, network replacement, Zustand replacement, large component rewrites and blanket content normalization.

These must earn a concrete use case, tabletop rule and bounded failure proof before becoming work. No “Agent H” is needed to keep re-evaluating the same broad questions.

## 26. Ten Dependency-Ordered Implementation Projects

The following list contains **exactly ten** projects. Their numbers give a safe review/merge order, not a claim every earlier project blocks every later local activity. §27 defines actual dependencies.

Every project has a rollback boundary. A disabled adapter or prior code version may stop new automation; it must never erase persisted user work or undo already accepted HP changes by implication.

<!-- EXECUTION_PROJECTS_BEGIN -->

### Qualitative prioritization

These are judgments of failure consequence and bounded leverage, not a numerical ranking formula. High implementation risk increases review needs; it does not justify postponing confirmed data loss indefinitely.

| Project | Severity / likelihood and user impact | Dependency leverage / product value | Implementation risk / scope / proof value |
|---|---|---|---|
| P1 | High; deterministic when composed ack/routing path is used; blocked/misrouted actions | Very high leverage, immediate correct interaction | Low/medium; existing wrappers/schema/relay surface; direct real-path proof |
| P2 | Critical data trust; certain during writer failure; unsaved progress falsely reported saved | Very high; every durable room feature benefits | Medium; writer/outcome/one status path; false/throw/race fixtures |
| P3 | Critical data loss/corruption; normal repeated resume plus conditional outage path | Very high; permanent-table foundation | High; room checkpoint boundary only; restart/partial-write/legacy proof |
| P4 | High privacy/authority; current rules/delivery fail; destructive cleanup conditional on activation | High; invited external trust | High review sensitivity, bounded permission operations; negative emulator/recipient tests |
| P5 | High personal loss/misattribution; ordinary login/handoff scenarios can trigger it | High; existing planning/character use | Medium/high; explicit named local scopes, not all cloud models; handoff/failure proof |
| P6 | High save trust; routine quota/network failures; player progress at risk | High direct player value | Medium; existing personal save/status paths; visible failure/retry proof |
| P7 | High wrong-actor/state risk; current envelope mismatches deterministic on affected paths | Very high; two action consumers and existing manual controls | High contract sensitivity; selected actor fields/condition records; identity/replay proof |
| P8 | High functional gap but usable manual fallback; every current quick use lacks execution | High visible gameplay, cheap architectural proof | Medium; one existing ability/controller, no creature-system expansion |
| P9 | High advertised execution gap; supported cast otherwise remains notice/payment | High player value; second boundary consumer | Medium/high; two cast entry points, narrow effect support; cost/target proof |
| P10 | High coherence problem; wrong text is currently rendered on normal pages | High first-product and AI-maintenance value | Low/medium; named content/contracts, physical/browser validation; no broad redesign |

Projects 1–3 are short enabling repair, honest durability, then canonical recovery. Projects 4–6 protect the existing user's trust. Projects 7–9 turn already-authored play into correct consequences. Project 10 makes the result understandable and operational. No cleanup-only project earns a slot.

### Project 1 — Production Socket Contract Restoration

**Project number:** 1  
**Project name:** Production Socket Contract Restoration  
**Lane / horizon:** Foundational reliability + multiplayer / NOW

**Why now:** Small surface, deterministic failures and very high dependency leverage. Prevents blocked confirmations, wrong-map packets and wrong-table recovery delivery. Leverage: A, B, D and F from the product-leverage test.

**Problem being solved:** Middleware loses acknowledgement arguments; schemas strip legitimate scope/action/reconnect fields; movement does not carry an action ID through to its echo; targeted recovery resolves recipients globally.

**Audit evidence:** A TD-001/008/009 and §7; F P1-8; E reliability gates; Δ §§10/11/15.

**Current source verdict:** **STILL PRESENT**, S1/S4, reproduced by R4–R7. Existing handler/harness tests do not establish the missing contract.

**Dependencies:** None. P2/P3 consume the restored transport. No product decision blocks this repair.

**Exact in-scope behavior:**

1. Forward complete Socket.IO handler arguments through the existing wrappers; provide an explicit failure acknowledgement for rejected ack-bearing requests instead of letting the client wait indefinitely.
2. Preserve validated room/map/action fields for current token create/move and character movement payloads. Preserve informational reconnect fields; verified identity continues to come from the socket, never a supplied `userId`.
3. Carry a move's action ID through queue/coalescing/echo. A superseded drag position must not become a second mechanical action.
4. Scope recipients of all three targeted `sync_*` families to the sender's actual room; reject unknown/foreign recipients. Select the requested/current map correctly for server recovery rather than labelling legacy root tokens as a different map.
5. Add a fixture using real registered handlers with real sanitization, validation, rate limit and auth composition. Stub external token verification/persistence only. Keep existing integration harnesses for their legitimate purposes.

**Explicit non-goals:** Networking replacement, global protocol redesign, server-derived combat, distributed room ownership, full recovery schema migration, new gameplay, accepting arbitrary unvalidated payload fields.

**Likely files / subsystems:** `server/services/{rateLimitService,validationService,sanitizationService}.js`; `server/handlers/{tokenHandlers,syncHandlers}.js`; movement section of `syncService.js`; real-middleware test fixture and selected client token echo tests.

**Source of truth after completion:** A tested current event contract derived from actual producers/handlers; socket identity and membership determine scope. The field fixtures are operational contracts, not another giant event registry.

**Backward-compatibility requirements:** Current creature payload including token/creature/position continues to work. Missing optional map/action IDs keep documented legacy fallback. Legacy token-only shapes either map explicitly or receive a bounded actionable error; do not silently pretend they passed. Direct/token-delta mode remains compatible.

**Migration requirements:** None for stored rooms. Any incompatible legacy event rejection is documented with the client/server version boundary.

**Tests required:** Ack arrives once for valid create/map update; validation/rate-limit rejection acknowledges failure; non-default map survives all wrappers; action ID survives movement echo; reconnect information survives without identity trust; every cross-room targeted relay is denied; same-room authorized flow remains; old/new payload fixtures and both token capability modes.

**Manual verification required:** Two clients, two maps, one token create acknowledgement and one drag on the non-default map; reconnect and request sync. A separate room receives no crafted targeted recovery packet. Use snapshots plus state/network assertions.

**Success criteria:** The R4–R7 cases now fail against the old implementation and pass against the new one; actual valid acknowledgements resolve and observers on the right map receive the right state. Existing suites pass.

**Stop conditions:** A proposed fix disables validation globally, trusts payload owner IDs, changes token-delta semantics, or demands a transport rewrite. Stop and update the bounded contract instead.

**Risks:** Wrapper registration order, ack duplication and accidental schema broadening. Severity is high for routing; implementation risk is comparatively low if tests cover the real stack.

**Rollback boundary:** Revert the envelope/schema changes as one unit; retain the fixtures and known-bad status. No data migration or removal.

**What this unlocks:** Honest room-save notifications, reliable scoped snapshots and future accepted actor commands.

**Model routing recommendation:** **DeepSeek-level implementation agent**, followed by **Senior architecture review** of middleware order, routing and compatibility. Strongest-model review only if an unexpected trust-boundary change is proposed.

### Project 2 — Honest Room Saves and Retained Retry Work

**Project number:** 2  
**Project name:** Honest Room Saves and Retained Retry Work  
**Lane / horizon:** Foundational reliability + operations / NOW

**Why now:** Direct, demonstrated loss of session progress and false reassurance. High severity, routine failure likelihood under outage/quota, bounded implementation. Leverage: A, B and F.

**Problem being solved:** A false persistence result is treated as success, queued work disappears, no-DB fallbacks can report true, and explicit save emits “saved” without durable evidence.

**Audit evidence:** A TD-003; F P0-2/P1-6 analogy; E reliability gates; Δ §10.6/10.7.

**Current source verdict:** **STILL PRESENT**, S2, R2/R8. The batch writer clears pending work before trying the write; its retry only sees thrown errors.

**Dependencies:** P1 for a reliable user-facing transport verification. Queue/error unit work can begin independently; do not simultaneously edit the same persistence service with P3.

**Exact in-scope behavior:**

1. Define outcomes distinguishing confirmed cloud write, unavailable/local-only, retryable failure and permanent rejection. Transitional boolean callers must map false/unavailable to failure, never durable success.
2. Snapshot queued room data safely; serialize flushes per room. On failure retain the newest pending snapshot under bounded retry/backoff. A retry of older work cannot overwrite a newer success or resurrect a deleted entry.
3. Current registered batch-writer callers provide room snapshots, not arbitrary patches. Coalesce by latest snapshot/revision; do not concatenate fog arrays from two full snapshots. Verify this caller contract before changing it.
4. Bound retained work and expose pressure/error state. Reaching a cap produces a visible unsaved/recovery-needed condition, not an unannounced discard.
5. Explicit GM save uses the same selected writer outcome, is GM-gated, and reports accepted-live vs cloud-saved status accurately. Surface degraded-save/retry state through existing notification/status surfaces and a small operational failure counter.

**Explicit non-goals:** Canonical inline/split migration (P3), distributed queues, disk WAL/event sourcing, provider backup deployment, billing, new gameplay or guaranteeing crash recovery for an unconfirmed write.

**Likely files / subsystems:** `server/services/{firebaseService,syncService}.js`; `server/handlers/syncHandlers.js`; relevant socket/status handler and a small room save-status view in multiplayer; tests for writer concurrency and failure.

**Source of truth after completion:** Live room memory remains the accepted table. The writer reports the highest confirmed cloud checkpoint separately and retains newer unsaved work. “Saved” does not refer to an in-memory queue.

**Backward-compatibility requirements:** Existing handler calls remain valid; current clients receive existing success only on real success, plus an error/status path they can understand. Preserve batching and movement coalescing.

**Migration requirements:** No stored-data migration. Document transitional result types and any status-event addition; older clients must not receive false success to preserve their appearance.

**Tests required:** False, throw and unavailable outcomes; later recovery; exhausted bounded retries retain unsaved state; new write arriving during failure/flush; out-of-order completion; deletion in a later full snapshot; fog snapshots do not duplicate; explicit member save denied; GM save failure/success reported accurately; shutdown does not manufacture success.

**Manual verification required:** In test/staging, fault the writer while GM and observer keep a table open, edit a token/map, inspect degraded state, restore persistence and retry. Verify the latest snapshot, not an old one, is saved. Restart from the last confirmed checkpoint and show the actual durability limit.

**Success criteria:** R2/R8 are closed, queue and UI agree on outcome, and the exact newest retained state eventually saves without replaying gameplay. No unconfirmed revision is labelled cloud-saved.

**Stop conditions:** The fix silently drops on retry exhaustion, uses an unbounded queue, adds a generic event platform, or requires simultaneous redesign of room storage. Leave P3's shape decision separate.

**Risks:** Mutable references, async flush races, latest-snapshot replacement and honest local-only behavior. Persistence severity is critical; implementation risk is medium.

**Rollback boundary:** Writer/outcome/status change is one mergeable unit. If disabled, show unsaved status and preserve/export pending work; do not erase the queue or silently revert to false-success messages.

**What this unlocks:** Credible room migration/recovery tests and safe acceptance of later actor consequences.

**Model routing recommendation:** **DeepSeek-level implementation agent** for bounded implementation/fault tests; **Senior architecture review** for queue concurrency and newest-write retention. Use **Strongest-model review** only if durability semantics expand beyond this result/queue boundary.

### Project 3 — Single-Writer Room Checkpoints and Idempotent Resume

**Project number:** 3  
**Project name:** Single-Writer Room Checkpoints and Idempotent Resume  
**Lane / horizon:** Foundational reliability + multiplayer recovery / NOW

**Why now:** Highest demonstrated campaign-loss cluster; enables all durable shared gameplay. The scope is the room snapshot boundary, not the rest of persistence. Leverage: A, B, D and F.

**Problem being solved:** Inline data is discarded, stale fragments can compete with inline updates, split writes can mix versions, resume concatenates arrays, and live browser/personal snapshots can override room truth.

**Audit evidence:** A TD-002/D1; F P0-1/P0-3 and integrity/recovery sections; D/E serializer corrections; Δ §10.6.

**Current source verdict:** **STILL PRESENT**, S2/S3, R1/R3. GM room join actively initializes browser cloud autosave; personal remote-wins applies shared state too.

**Dependencies:** P1 and P2. H4 must be settled for migration of genuinely ambiguous production rooms. Engineering may choose the canonical physical format; the creator must choose between conflicting valuable unversioned contents.

**Exact in-scope behavior:**

1. Use one canonical **server-written, versioned split checkpoint convention**: room metadata plus existing global/map fragment domain, one schema version/checkpoint revision and declared map set. Room memory is live truth.
2. Publish a complete checkpoint atomically within Firestore batch/document limits. Preflight size/operation limits; outside the supported envelope, retain unsaved state and report failure. Do not implement a new chunking platform inside this project.
3. Read legacy inline-only and split-only rooms correctly. Detect dual candidates/partial or unsupported checkpoints; preserve the raw candidates and require explicit reconciliation where a safe precedence is unknowable.
4. Resume a complete selected snapshot by replacement of snapshot collections, not array concatenation or union that resurrects deleted tokens/maps. A live in-memory room with newer unsaved accepted state cannot be replaced by an older cloud snapshot merely because the GM rejoins.
5. Stop browser whole-room authoritative writes in active multiplayer. Keep local sandbox/draft persistence explicitly local. Personal room-state listeners may restore preferences/cache only, never overwrite accepted shared actors/maps/combat.
6. Route join/full-map/full-state recovery through one silent hydration adapter. Do not call `startCombat`/`nextTurn` to reconstruct a turn index. Preserve optional/unknown supported data without inventing gameplay.
7. Provide a bounded checkpoint export/restore fixture for a selected room and a staging recovery rehearsal. This supports migration rollback, not a complete account backup product.

**Explicit non-goals:** Per-campaign schema redesign, all account export/erasure, chat archive/retention program, multi-server authority, universal event sourcing, class logic, zones or level-editor rewrite.

**Likely files / subsystems:** `server/services/firebaseService.js`; selected writer integration in `syncService.js`; `handlers/{roomHandlers,roomLifecycleHandlers,syncHandlers}.js`; client `roomJoinHandler.js`, `gameStateManager.js`, `roomService.js`, `useRoomPersistence.js` and recovery appliers; a focused room checkpoint codec/test fixture.

**Source of truth after completion:** Server room + highest complete committed checkpoint revision. Client stores and personal snapshots are projections/caches; browser-created room metadata or a draft import is not a second live writer.

**Backward-compatibility requirements:** Old inline and split saves remain readable; unknown newer schema is preserved/read-only with an error, not rewritten empty. Legacy root token mirrors are derived compatibility projections until their consumers migrate. Existing local room use remains local and usable.

**Migration requirements:** Export legacy raw documents before conversion; choose a complete candidate; record schema/revision and provenance; migrate once on explicit save/restore; preserve rollback copies. Do not bulk rewrite every room. No inferred deletion/deduplication of authored strokes whose identity is unknown.

**Tests required:** Inline and split round trips; large→small→large legacy states; stale fragment vs newer checkpoint; partial save rejects mixed versions; absent vs failed read; repeated resume identical; removed token/map stays removed; newer live unsaved state wins on rejoin; personal cache cannot clobber; unknown version no rewrite; old/new payload fixtures; silent combat hydration with no RNG/resource/event side effects; restart and restore of one exported room.

**Manual verification required:** GM/observer use two maps containing drawings, fog, objects, tokens and combat. Save, disconnect, restart test server, resume twice and compare actual data/counts/revision. Restore the exported checkpoint into a scratch room. Inject a fragment failure and verify there is no falsely complete checkpoint.

**Success criteria:** R1/R3 closed; all selected state returns at one revision, arrays/order stable; the active GM browser cannot authoritatively replace shared state; save/load/restore tests preserve deletions and optional fields. Current gameplay is not replayed during hydration.

**Stop conditions:** Ambiguous legacy data would be guessed away; a map exceeds the supported storage envelope; atomicity requires an unplanned storage platform; unrelated stores/content are being migrated; rollback would delete the only candidate.

**Risks:** Critical data loss, partial versions, reset of stale owner/socket references and hidden consumers of root mirrors. High implementation risk; constrained rollout required.

**Rollback boundary:** Retained legacy exports and selected checkpoint version; disable new writes/read-only on unsupported rollback. Never imply a code rollback reverses already accepted table changes.

**What this unlocks:** Trustworthy permanent rooms, reconnect and later durable actors/actions; a foundation for modest backup/export tooling.

**Model routing recommendation:** **Senior architecture review** defines checkpoint/legacy precedence first; **DeepSeek-level implementation agent** implements the frozen bounded contract and tests; **Strongest-model review** of migration, atomicity and rollback before any live conversion.

### Project 4 — Room and Private-Data Access Boundary

**Project number:** 4  
**Project name:** Room and Private-Data Access Boundary  
**Lane / horizon:** Multiplayer + foundational privacy / NOW

**Why now:** Real wrong-audience access/delivery and conditional destructive-admin risk. It stabilizes the first invited-table contract, not enterprise anti-cheat. Leverage: A and F.

**Problem being solved:** Broad room reads/member fragment writes, weak join/resume lifecycle edges, legacy token fail-open, broadcast inventories, broad taxonomy writes and URL-driven cleanup without owner proof.

**Audit evidence:** A TD-005/006/015; F P0-4/P1-8/P2-1/2/3; Δ §§1/2/6/7/12.4; fresh corrections in §6.

**Current source verdict:** **PARTIALLY RESOLVED** controls around a **STILL PRESENT** access/delivery cluster, S4/S5/S15. Deployment is **UNKNOWN**.

**Dependencies:** P1 recipient/envelope contract; P3 server-only shared checkpoint writes and metadata persistence. H1/H2/H14 settle publication/join/sharing policy. P7 subsequently closes alternate supported actor-mutation paths; this project alone does not certify every RPG mutation.

**Exact in-scope behavior:**

1. Room parent/state reads follow selected GM/member policy; shared checkpoint writes are server/Admin-only after P3. Browser metadata edits are bounded GM operations. Existing lobby discovery uses a metadata projection/server list, not broad state queries.
2. Server records verified durable member UIDs when appropriate; a valid password join must not become unable to read its entitled projection after rules tightening. Run owner checks before in-memory resume side effects; unowned legacy rooms require explicit owner recovery.
3. Direct/invitation joins share role/capacity checks using actual Map members. New invitations bind intended recipient and expiry; ambiguous old invitations are visibly reissued, not accepted as unrestricted tickets.
4. Unowned legacy token mutation defaults to GM/explicit delegation; owner/control fields cannot be self-reassigned through arbitrary token updates. Preserve tested owned/delegated flows.
5. Inventory data is attributed to verified sender ownership and delivered only to the same authorized owner devices or an explicitly consented GM share. Never room-broadcast private contents. Preserve echo-safe application.
6. The four global category collections are admin-written; public profiles have the actual public field allowlist. Preserve owner-only private users and existing tier protection.
7. Rules emulator tests prove positive/negative operations. Destructive Storage cleanup proves an owner-bound path before any delete; unknown owner, foreign/shared/system path or unverified bucket is a no-delete result. Do not claim reference-counted orphan collection is solved.

**Explicit non-goals:** Invitation-only mode unless H1 selects it, inventory gameplay validation, cryptographic dice/anti-cheat, comprehensive account deletion, marketplace ratings architecture, storage quota reconciliation, archive migration or provisioning production services automatically.

**Likely files / subsystems:** `firestore.rules`, existing Storage rules tests, `server/handlers/{roomLifecycleHandlers,sessionHandlers,sessionInvitationHandlers,tokenHandlers,combatHandlers}.js`, targeted metadata helper, client inventory handler/lobby queries, `functions/cascadeCleanup.js` owner guard and rules/cleanup tests.

**Source of truth after completion:** Verified socket/auth UID + server membership/control records; cloud rules enforce the same durable access boundary. Publishing/sharing is an explicit projection, not a UI filter.

**Backward-compatibility requirements:** Existing owned rooms/tokens remain usable; old unowned content remains readable/recoverable by legitimate GM rather than assigned to a random player. Reissued invitations and denied legacy writes provide actionable errors. Built-in assets continue working even if private Storage is unavailable.

**Migration requirements:** No mass owner inference. Selected legacy owner/member recovery is exported and explicit. Seed taxonomy via Admin rather than weakening rules for normal clients. Verify deployed rule/version rollback separately; this task's analysis did not do so.

**Tests required:** Authenticated non-member room get/list denied; legitimate GM/member entitled reads; anonymous/tokenless policy cases; client shared-state writes denied; populated Map capacity on both join paths; wrong recipient/expired invitation; unauthorized resume has zero side effects; legacy token mutation denied to random member; delegated control accepted; foreign inventory attribution rejected and payload not delivered; public profile field rejection; category admin-only; cleanup cannot delete another owner's object.

**Manual verification required:** Two real staged accounts in separate rooms, join/rejoin/list/share flows, inventory network capture proving non-delivery, member rules/query compatibility. Verify deployed rules/Functions status and actual Storage capability before enabling uploads. Exercise legacy owner recovery with copied test data.

**Success criteria:** Privacy matches network/storage entitlement; normal member use still works; unowned or foreign data cannot be modified/deleted through covered paths; staging uses the tested rules. A local passing rule file alone is not rollout completion.

**Stop conditions:** Policy is unresolved, membership cannot be derived safely, a migration guesses ownership, or broad permissive rules are proposed to rescue a failed UI query. Unknown production cleanup deployment is a release gate, not a reason to touch user files speculatively.

**Risks:** Locking out legitimate members, recipient binding changes, saved socket IDs and asset bearer-link semantics. High-consequence security change, medium/high integration risk.

**Rollback boundary:** Known rule/handler version plus preserved recovery exports. A rollback may disable publishing/access-sensitive functions; it must not reopen broad state access as an unreviewed convenience.

**What this unlocks:** Invited external testing, credible private-room/inventory claims and safe new actor authority contracts.

**Model routing recommendation:** **DeepSeek-level implementation agent** for fixtures and bounded wiring; **Strongest-model review** for rules, recipient/ownership and destructive cleanup boundaries; **Senior architecture review** of join/metadata compatibility.

### Project 5 — Account-Bound Local Drafts and Campaign No-Clobber

**Project number:** 5  
**Project name:** Account-Bound Local Drafts and Campaign No-Clobber  
**Lane / horizon:** Foundational personal reliability / NOW

**Why now:** A normal login/account change can lose or misattribute valuable planning work. It is a local persistence-session boundary, not a migration of every cloud entity. Leverage: A, D and F.

**Problem being solved:** Shared campaign/character/inventory/journal/worldbuilding caches and dirty flags, in-flight old-account work, and unconditional campaign hydration.

**Audit evidence:** F P1-5/P1-10; A protected dirty guard and personal scopes; Δ §§8/9/16.

**Current source verdict:** Consolidation **RESOLVED**, draft/account protection **PARTIALLY RESOLVED**, login loss **STILL PRESENT**, S6/S7.

**Dependencies:** No room persistence dependency. P6 uses this scope. H5 defines the draft promise. Work in `PersistenceProvider`/auth/storage cannot run concurrently with another project editing those same handoff paths.

**Exact in-scope behavior:**

1. An explicit small registry scopes the supported private local keys: campaigns/current campaign, character roster/active ID, inventory, journal/shareable draft payloads, the ten provider worldbuilding stores and their dirty flags. Public static-data/asset caches remain global. Do not infer scope from an arbitrary prefix.
2. Auth handoff captures uid/generation, stops prior timers/listeners, loads only the new scope and ignores late old-scope hydration/save callbacks. Unsent drafts remain in the old owner's namespace; do not purge them on sign-out.
3. Campaign mutations record dirty/revision state locally. Login hydration cannot replace a dirty campaign array. Where cloud/local both contain conflicting work, preserve both and offer explicit reconciliation/export; no timestamp guess or automatic union of deleted campaigns.
4. Keep the ten-store dirty hydration/write-loop protection, now account-bound; clear only the exact successfully saved draft revision. This does not add collaborative merging to all ten domains.
5. Campaign size/write failures remain pending and become visible; preflight the singleton's supported size budget. Preserve the current cloud collection/path and expose a conflict/unsaved state in existing campaign surfaces.

**Explicit non-goals:** Per-campaign/per-book Firestore migration, all same-account concurrent editing semantics, general offline queue, broad raw localStorage cleanup, erasure policy, worldbuilding UI redesign, or rewriting seed canon.

**Likely files / subsystems:** `utils/storageUtils.js` and a small scope/key registry; auth handoff in `authStore.js`; `PersistenceProvider.jsx`; `campaignService.js`, `useCampaignPersistence.js`; `characterHelpers.js` local key lookup; named store hydrate/sync guards or storage adapters; journal/shareable draft adapter; focused account-switch/campaign tests.

**Source of truth after completion:** Each private draft belongs to an explicit uid/local scope and revision. Cloud planning docs are one selected saved version, not permission to overwrite a dirty draft. Current seeded/default canon stays separate from user modifications.

**Backward-compatibility requirements:** Preserve legacy shared-key payloads. Unknown ownership becomes a quarantined/importable legacy draft, not automatic upload under the next account. Guest/dev scopes remain distinct; compatible aliases, custom seeds and removed seed IDs survive.

**Migration requirements:** One-time copy/import with recorded owner choice where needed; retain old raw payload until recovery is confirmed. Never delete pre-existing keys opportunistically. Cloud schema remains unchanged apart from any bounded campaign revision metadata explicitly introduced.

**Tests required:** A→sign-out→B sees no A draft; delayed A read/write cannot update B; A returns and finds unsent work; failed campaign sync then login/reload preserves local; cloud-empty/missing/error distinguished; dirty revision changes during save not cleared; metadata-only change no write loop; quota failure visible; legacy owner unknown not auto-uploaded; same-account campaign conflict preserves both alternatives.

**Manual verification required:** Two staged accounts on one browser, campaign/journal/character/inventory/worldbuilding handoff; offline campaign edit, reload/login, reconnect and deliberate resolution. Confirm private data is not transiently visible before hydration. Include a large campaign hitting the supported size guard.

**Success criteria:** Named private scopes survive handoff without leak/clobber; failed/dirty campaign work survives login; no extra cloud write loop; every migration has a recoverable old copy. No claim of universal offline/collaborative sync is made.

**Stop conditions:** A private key lacks an owner/reset/serializer contract; the solution needs a wholesale store rewrite; conflicting drafts would be silently deleted; or every worldbuilding collection is being sharded “while here.” Update the scope registry/evidence rather than extending the project into another data model.

**Risks:** Import-time store hydration, callback races, singleton campaign service and account ownership of legacy data. High user impact; medium/high integration risk despite mostly mechanical key wiring.

**Rollback boundary:** Scoped adapter/key registry can be disabled only with explicit legacy import handling; retain namespaced copies. Never merge accounts back into one shared key automatically.

**What this unlocks:** Trustworthy personal drafts and character failure recovery; safe invited testing on ordinary account/session transitions.

**Model routing recommendation:** **Senior architecture review** freezes handoff/legacy ownership; **DeepSeek-level implementation agent** handles scoped wiring and race tests; **Strongest-model review** only for ambiguous migration/ownership cases.

### Project 6 — Truthful Character Save and Offline Status

**Project number:** 6  
**Project name:** Truthful Character Save and Offline Status  
**Lane / horizon:** Foundational character reliability / NOW

**Why now:** Players cannot tell if their active character progress is durable. Reuse the journal's proven status pattern rather than add a persistence framework. Leverage: A, C and F.

**Problem being solved:** Autosave failures/false outcomes are unobserved; localOnly success and memory fallback can be confused with cloud durability; offline cache entries claim synced without writing.

**Audit evidence:** F P1-6/P2-5; Δ §§9.3/10.4/10.5; A personal persistence map.

**Current source verdict:** Inventory hydration **RESOLVED**, save UX/sync promise **STILL PRESENT**, S6/S7. Canonical transform tests do not cover these hooks/outcomes.

**Dependencies:** P5 for uid-bound drafts and timer scope. No dependency on room checkpoint storage for personal-only verification. H3/H5 settle labels; P7 later defines active-room reconciliation.

**Exact in-scope behavior:**

1. Surface per-uid/per-character status for both canonical saves and runtime-state saves using the existing status/notification pattern. Await/observe the canonical autosave callback's actual result; a synchronous catch around an async write is insufficient.
2. “Cloud saved” requires the relevant latest edit's confirmed writes. Separate device draft, memory-only, pending, saving and failed outcomes; success from another character/account/lane cannot clear this one.
3. A save failure retains the draft and offers bounded retry and download of the **selected character draft**, not a complete account export product. Retrying uses the same owner/character state, with no class payment or gameplay replay.
4. Offline no-op queue processing may not mark character data synced. Reconnect retries the matching canonical personal save path where supported, or leaves an explicit pending/manual reconciliation state. Do not revive flat writes to `characters/{id}`.
5. Preserve inventory hydration and write-token echo guards; close character/account timer races. Browser unload remains best-effort, not the durability mechanism.

**Explicit non-goals:** Full offline action queue, generic conflict solver, room authority, class-resource redesign, whole character schema rewrite, all user-data export or backup UI.

**Likely files / subsystems:** `useCharacterPersistence.js`; canonical save callback path in `characterSlices/coreSlice.js` / `characterHelpers.js`; `characterStateService.js`; `offlineService.js`; existing `persistenceStatusStore.js`; small sheet/provider status surface; storage-result reporting for scoped character keys.

**Source of truth after completion:** Canonical document and owner runtime document have explicit outcomes; the account-bound device draft is retained recovery state. Offline-service cache metadata is never the authority for successful upload.

**Backward-compatibility requirements:** Existing nested fields, inventory, acquisition/body states and class banks retain round-trip behavior; no flat legacy upload. Existing callers that omit result handling still work while the autosave entry points gain observation.

**Migration requirements:** Reclassify unverifiable offline “synced” cache metadata as unconfirmed/pending where a draft exists; preserve content. No blanket overwrite of canonical documents and no bulk stat/resource conversion.

**Tests required:** Returned false and thrown save; localOnly vs cloud; pending newer edit during old success; stale account/character callback; quota memory fallback; retry closes status only on confirmation; offline edit never marked synced by no-op; selected draft export/import fidelity; inventory/notes/class banks preserved; write-token echo does not create a loop.

**Manual verification required:** Change HP, inventory and marginalia on a staged character, force failure, inspect visible status, switch character/account, return/retry and load on another device. Simulate local quota fallback and download the selected unsaved draft.

**Success criteria:** No covered autosave failure is console-only; no no-op/local-only outcome is described as cloud-saved; correct latest draft survives and can be retried/recovered. Journal behavior remains intact.

**Stop conditions:** The fix implements generic offline replay, changes canonical resource semantics, or drops unknown data to make a save pass. A conflict that cannot be safely reconciled remains visible and preserved.

**Risks:** Multiple personal save lanes, asynchronous result observation and transient false “saved” status. High user impact; bounded medium implementation risk.

**Rollback boundary:** Status/result/retry adapter; drafts retained. Disabling new retries leaves unsaved indicators instead of reverting to misleading success.

**What this unlocks:** Safe character participation in accepted room actions and credible personal/offline messaging.

**Model routing recommendation:** **DeepSeek-level implementation agent**; **Senior architecture review** of canonical/runtime status and races. No strongest-model review needed for routine UI/status wiring after the contract is fixed.

### Project 7 — Actor Instance Consequence and Condition Contract

**Project number:** 7  
**Project name:** Actor Instance Consequence and Condition Contract  
**Lane / horizon:** Core RPG execution + multiplayer / NEXT

**Why now:** New gameplay is unsafe if the wrong actor is selected or the server persists HP in a field the reader ignores. This is the minimum common seam for P8/P9. Leverage: A, B, D and E.

**Problem being solved:** Local aliases leak into shared targeting; client state updates/server root merges disagree; alternate mutation paths bypass controls; condition event/storage shapes and round serialization do not round-trip.

**Audit evidence:** A TD-012/013; D pass-II merge/condition corrections; E actor/mitigation and replay gates; Δ unresolved drift.

**Current source verdict:** **STILL PRESENT**, S8/S10. `tokens` alias is not the primary defect; wrong addressing/envelopes and duration serialization are.

**Dependencies:** P1–P4 for multiplayer acceptance/checkpoint/authority; P6 for owner status/reconciliation. Pure local adapters/tests can begin after the contract review without cloud operation.

**Exact in-scope behavior:**

1. A stable typed actor reference maps room/map/token to the appropriate creature instance or owner/character projection. Missing/foreign/stale reference is an error, never a fallback to the local sheet.
2. One bounded accepted command applies explicit final HP/mana/AP changes and condition add/remove/update records, with expected actor revision, retry-stable command ID and stored result receipt. It performs **no dice roll, attack rule or class decision**.
3. Source/target updates for one action commit together in room memory/checkpoint. A receipt retry returns the same result. Retain a bounded replay window tied to checkpoint revision/epoch; reject ancient ambiguous retries instead of expanding an infinite log.
4. Creature resource state persists under `token.state`. Adapt legacy flat envelopes explicitly; sibling `creature_updated`/token/resource paths cannot overwrite protected fields outside the same authority contract. Owner/delegate/GM rules apply consistently.
5. Individual condition records preserve ID, source, target, polarity and clock. Map supported names through an explicit alias adapter; manual icon markers remain distinguishable from ticking effects. Round records retain `remainingRounds`; absolute-expiry records retain their clock. Decode ambiguous old records as preserved manual data, not guessed executable effects.
6. Use the actor adapter at the relevant existing turn-resource update/application seams so a remote character is not whichever local sheet is open. Snapshot apply is silent. Unsupported shared overtime/mitigation remains manual/paused with an explanation; no peer timer may create a new shared consequence merely by hydration.

**Explicit non-goals:** Universal action/entity engine, all class passives, damage balance, new condition authoring schema, full DOT/channel/scheduler migration, anatomy, zones, event sourcing or automatic historical replay.

**Likely files / subsystems:** Small proposed actor-reference/consequence/condition-codec modules; focused server handler/schema; `creatureStore.js`, character/token projection adapters, relevant `combatStore.js` application seams; `conditionStore.js`; server `tokenHandlers.js`, `characterHandlers.js`, alternate creature handler; client condition/resource/snapshot handlers; actor/round-trip tests.

**Source of truth after completion:** Accepted actor instance state/revision and individual condition records in the canonical room. Local aliases, token/HUD mirrors and owner-sheet persistence are projections at explicit boundaries. A library definition is never mutated to damage one instance.

**Backward-compatibility requirements:** Existing manual controls remain available; adapters accept documented old envelopes without recharging/re-emitting. Preserve additional definition/state fields; no blanket rename of condition vocabularies or creature data. Unknown executable semantics remain manual-only.

**Migration requirements:** Lazy versioned condition/token decoding with raw payload retention. Resolve explicit root/nested conflicts by provenance/revision or GM choice; do not guess current HP. No bestiary conversion. Older clients must not silently overwrite a new actor revision; negotiate/disable unsupported mutation capability.

**Tests required:** Correct creature vs PC vs foreign PC; owner/delegate/GM denial cases; root/state round trip; alternate mutation bypass denied; duplicate command no double delta; stale revision rejects; source/target acceptance all-or-none; disconnected/rejoining owner sees already-resolved state; two simultaneous instances of one definition stay distinct; multiple conditions per actor; round/local/cloud/room round trip; no NaN; old/new/unknown-version fixtures; snapshot does not roll/tick/advance/spend; remote turn actor does not mutate local player's resources.

**Manual verification required:** GM changes a creature and another account's character through supported controls; both clients converge. Add two conditions with different clocks, reload/rejoin, remove one. Repeat a command and apply an old personal snapshot; HP/conditions do not revert or duplicate. Local sandbox still works.

**Success criteria:** One accepted mutation produces the same correct actor state in stores, server checkpoint and restored view. Condition clocks survive. Existing aliases cannot select a different player. All supported mutation paths honor the same authority/revision contract.

**Stop conditions:** The command becomes unrestricted JSON patch, per-class rules enter shared code, timers require a general scheduler, or more than the selected fields/records are being migrated. Unsupported legacy data is a diagnostic/recovery case, not permission to redesign combat.

**Risks:** Foundational abstraction, old payloads and active-room/personal resource overlap. High leverage and high implementation risk; freeze fixtures/contract before wiring.

**Rollback boundary:** Disable new mutation capability and preserve readable state/receipts; retain manual adjudication. Rollback does not restore spent AP/HP automatically or discard new condition records.

**What this unlocks:** Safe creature/spell actions and future domain-specific timed consequences without a God engine.

**Model routing recommendation:** **Senior architecture review** of the small contract; **DeepSeek-level implementation agent** for adapters/fixtures/wiring; **Strongest-model review** of identity, replay and source-of-truth boundaries before integration.

### Project 8 — Grimmstalk Feather Slash Execution Slice

**Project number:** 8  
**Project name:** Grimmstalk Feather Slash Execution Slice  
**Lane / horizon:** Core RPG execution / NEXT

**Why now:** Completes an already-authored usable ability and cheaply proves the consequence boundary. Leverage: C, E and F; local development need not wait for billing or asset infrastructure.

**Problem being solved:** Creature ability use currently spends AP/mana and writes chat without resolving a target/consequence.

**Audit evidence:** D §§1/19; E execution/reuse limits; B encounter wiring; Δ confirms no resolver added.

**Current source verdict:** **STILL PRESENT**, S8. `grimmstalk_feather_slash` exists with single-target/melee/10-ft, `2d8 + 5` Slicing, 1 AP/0 mana.

**Dependencies:** P7 for local actor application; P1–P4 for the multiplayer/recovery acceptance claim. H8/H9 define adjudication. P6 required for any advertised PC personal-state recovery, not for the two-creature fixture.

**Exact in-scope behavior:**

1. Extend the existing GM quick-use flow with a thin controller: choose source instance, select one target, preview authored range/cost/formula and adjudicate uncertain target legality/defense.
2. Read the original ability's supported fields, not a lossy presentation card. Resolve or accept physical dice once; display faces/total and GM-confirmed final damage. Reuse a reviewed supported mitigation adapter; unsupported mitigation is explicit manual final-amount input.
3. Confirmation submits one P7 action changing source AP and target HP together. Cancel/rejection spends nothing; retry/reconnect neither rerolls nor spends again. Preserve temp-pool-first behavior.
4. Result chat/card is derived from accepted receipt. Keep a manual-use fallback for unsupported abilities and label what it does. No phantom success for control/summon/passive/channel data.
5. Extract only the quick-use controller from `CreatureToken` into a focused module/child; token remains input/presentation.

**Explicit non-goals:** Weighted behavior, triggers/tactics execution, anatomy, telegraphs, zones, all 526 abilities, save/DC/AC system, mass creature edits, generator restoration or custom VFX.

**Likely files / subsystems:** `CreatureAbilityConfirmDialog.jsx`, fan/quick-use controller, minimal `CreatureToken.jsx` integration, existing targeting UI and a small creature ability support adapter; P7 APIs; action/slice tests and physical rule card.

**Source of truth after completion:** Original authored ability plus instance facts → adjudicated proposal → accepted receipt/state. Creature definition remains unchanged; observer never rolls/applies independently.

**Backward-compatibility requirements:** Existing creatures without supported effects still have cards/manual use. Current authored cost semantics and temp pools are preserved. `tokens` alias remains a compatibility projection. No regeneration of missing-source static artifacts.

**Migration requirements:** None for 193 definitions. Add a capability/version marker for supported execution; old room data needs no fabricated ability plans. Active receipts remain readable on rollback.

**Tests required:** Exact Feather Slash fixture; two instances of one creature; insufficient AP; temp AP first; cancelled target/confirmation; invalid/foreign target; range diagnostics; finite formula bounds; one roll/cost/result on repeated confirmation; GM adjustment recorded; unsupported config manual-only; both observers agree; save/restart/rejoin retains HP/AP/receipt; source/target failure all-or-none.

**Manual verification required:** GM + observer run the two-creature action, then a supported PC target case once P7/P6 are ready. Repeat physically with the same printed ability and dice outcome. Compare target choice, defense/adjudication, cost and HP; reconnect observer and replay the same command ID.

**Success criteria:** This real existing ability changes the named target and source once and is reproducible without the VTT. The GM can explain every adjustment. Existing manual controls and unsupported cards remain usable.

**Stop conditions:** Implementing this requires new anatomy/behavior, a second spell schema, renderer rules, invented conventional defense or bestiary-wide conversion. Resolve the adapter gap, not a grand creature engine.

**Risks:** Incorrect card-to-runtime assumptions, double local flavor roll, cost before accepted target and changed mitigation meaning. Medium implementation risk with high proof value.

**Rollback boundary:** Disable supported execution controller and keep manual card/use mode; preserve already-accepted actor state/receipts. No data rollback by resetting tokens.

**What this unlocks:** Real creature action use; evidence for P9 and later advisory behavior/aspect work.

**Model routing recommendation:** **DeepSeek-level implementation agent**; **Senior architecture review** of action/receipt integration and creator review of the physical rule. Strongest-model review only if P7's authority contract unexpectedly changes.

### Project 9 — Supported Single-Target Spell Consequences

**Project number:** 9  
**Project name:** Supported Single-Target Spell Consequences  
**Lane / horizon:** Core RPG execution + player collaboration / NEXT

**Why now:** Makes the second real consumer of the actor boundary, closing an existing player-facing execution gap while protecting class identity. Leverage: B, C, D and F.

**Problem being solved:** Casting prices/rolls work, but supported effects are not consistently bound to targets; relay recipients log rather than converge on one consequence.

**Audit evidence:** A §9.4 narrowed by D §19/E; B magic/identity; Δ relay and resource-contract work.

**Current source verdict:** Casting **PARTIALLY RESOLVED**; shared consequences **STILL PRESENT** gap, S9/S11.

**Dependencies:** P7/P8 contract proof; P6 for personal ownership/save status; P1–P4 for multiplayer. H8/H9 adjudication remains explicit. This is not a replacement for class contracts.

**Exact in-scope behavior:**

1. One supported-field adapter accepts existing **immediate, single-target, DICE damage or healing** configs with bounded formulas and declared damage type. Preserve original definition/ID/version; return precise manual-only diagnostics for unsupported data.
2. Both sheet and HUD entry points use the same supported execution controller. Choose a real target before accepted payment; cancelled/rejected actions do not spend or start cooldowns.
3. Use existing class-resource payment plans, recipes and temp-pool rules unchanged. The accepted action records the actual source payment result and target consequence once; observed receipt application cannot charge again.
4. Cross-actor uncertain effects are GM-adjudicated; final accepted state uses P7. Owner personal reconciliation applies only to the matching uid/character/session revision, including reconnect. Other peers display, not execute.
5. Cast notice/result presentation is explicit. A notice alone must not imply HP changed. Existing manual dice/cards/coins and unsupported spells remain available under honest manual labels.

**Explicit non-goals:** Full spellcrafting execution, cards/coins automated effects, AoE damage, DOT/HOT lifecycle, channeling/casting scheduler, summons/control, reactions, class generation/passive automation, rebalancing spell prices or a new spell schema.

**Likely files / subsystems:** Small spell support/execution adapter; `ActionBar.jsx`, `SpellActionBar.jsx`, `SpellCastConfirmation.jsx` limited call sites; `useCharacterSpells.js` only if required; P7 command/receipt APIs; multiplayer cast/result handler; existing cost-contract tests and new effect fixtures. Reuse/narrow `effectProcessingService` calculation endpoints only with explicit semantics.

**Source of truth after completion:** Existing spell/class definition and payment contract own meaning; accepted actor receipt owns this cast's result. Personal sheet/store and chat are projections of the correct owner/session result.

**Backward-compatibility requirements:** Preserve legacy cost aliases and bank encodings already handled by contracts; no duplicate generic/dedicated costs; all existing resource suites remain passing. Unknown/unsupported effects remain manual without a lossy save rewrite.

**Migration requirements:** No bulk library conversion. Supported capability/version is additive; chosen live plan is pinned to its definition version. Old clients may display/manual-play, not silently execute or overwrite accepted new results.

**Tests required:** Supported damage and heal via both entry points; zero costs, temp pools, target cancel, insufficient resources, stale owner/actor; one payment/roll/result on retry; exact Minstrel pitch and Arcanoneer recipe cases; Martyr spent ledger; Pyrofiend peak/latch preserved; foreign-owner personal application denied; unsupported legacy shapes diagnosed; resistance object/numeric/name variants explicitly accepted or manual; no NaN/default local-player selection; rejoin preserves settled outcome and unsaved status if personal save fails.

**Manual verification required:** Two players and GM: one attack and one heal; cancel then confirm; use a bank-priced spell; retry after disconnect; view on another device and physically reproduce the action with a class tracking card. Confirm that a failed personal save is visible even when the room action was accepted.

**Success criteria:** Supported spells identify and affect the correct target once through both live cast surfaces. Costs remain class-specific; observer receipts never resimulate. Unsupported authoring is described truthfully.

**Stop conditions:** A supported adapter must reinterpret every effect type, changes resource economies, puts simulation in renderers, creates duplicate cast data or requires an unplanned scheduler. Shrink the supported set; do not finish spellcrafting “while here.”

**Risks:** Two casting entry points, legacy prices, payment timing and active-room/personal conflict. Medium/high integration risk; high product value.

**Rollback boundary:** Capability disables new automated casts while preserving manual use and accepted state. Do not refund/reapply all past casts as part of code rollback.

**What this unlocks:** A coherent player/GM immediate-action loop, meaningful encounter playtests and evidence for later effects or zones.

**Model routing recommendation:** **DeepSeek-level implementation agent**, with **Senior architecture review** of payment/result ordering and domain separation. **Strongest-model review** only for a newly discovered persistence/ownership ambiguity, not for mechanical fixture wiring.

### Project 10 — First-Table Rules and Execution Contract

**Project number:** 10  
**Project name:** First-Table Rules and Execution Contract  
**Lane / horizon:** Game/IP consistency + AI/first-release readiness / NEXT

**Why now:** A working table is not coherent if it teaches a different game or overstates supported automation. This publishes one operational truth for players and future agents. Leverage: C, D and F.

**Problem being solved:** Live inventory/talent/AP/resource summaries and selected canon passages disagree with tested behavior/current author truth; future agents ingest broad audits instead of bounded current contracts.

**Audit evidence:** B §§6/7/11; A drift/protected systems; D/E manual-only execution; Δ content-program limitations; fresh Playwright S12/S13.

**Current source verdict:** **PARTIALLY RESOLVED** content program; named live contradictions still present. No gameplay balance rewrite is authorized by documentation corrections.

**Dependencies:** P7–P9 settle the advertised support contract; P5/P6 settle persistence/offline wording. Data/copy drafts may begin earlier. H6–H9 must settle disputed rule wording; H13 and §20 govern release signoff.

**Exact in-scope behavior:**

1. Reconcile only named live starter-facing records: inventory axes/STR rows/zone effects; talent 5-per-level/50-point/level-10 talent economy and availability; contradictory advancement summaries; configured AP restoration vs fixed starting AP; Gambit/Spellguard/Pyrofiend quick-resource summaries where they contradict current contracts.
2. State supported P8/P9 execution versus manual rules in first-session/ability guidance. Do not remove depth or pretend unsupported authored branches vanished.
3. Fix selected live author-truth collisions using the already-approved canon: lexicon `the_deepening`, `the_breach`, `viridian`; Arcanoneer First Contract/Nomenclature attribution; Shaper founder state; Minstrel unsupported headline provenance. Preserve IDs, links, cultural traditions and custom-world overrides. Do not sweep every biography or archive.
4. Publish a compact first-session/physical reference: AP/defense adjudication, inventory layout, class tracking and the supported creature/spell examples. Use creator-approved fiction and one existing scenario, not a new franchise canon project.
5. Add the small AI routing/architecture/execution/testing documents in §30, derived from the contracts delivered by these projects. Audits remain background links.
6. A release checklist records actual build/rules/Storage/Functions ownership, supported capability versions, snapshot export/restore and rollback rehearsal evidence. Missing operational proof is an explicit failed gate, not an asserted completion.

**Explicit non-goals:** Full rulebook rewrite, crit/death/resurrection redesign, all class/heritage rebalancing, regional politics rewrite, all lore reconciliation, onboarding UI reconstruction, new adventure system, billing, account-erasure implementation or asset optimization.

**Likely files / subsystems:** Selected records in `public/data/rules.json`, `lore.json`, class display/guide data and named class prose; appropriate cache version; focused content-consumer fixtures; first-table reference/release notes; `docs/ai/` routing documents. Existing renderer only changes if a named summary cannot otherwise consume its authoritative value.

**Source of truth after completion:** Tested runtime contracts for current execution; creator-approved rule/canon decisions for intended tabletop meaning; one published support matrix. Data-derived summaries reference the owning constant/contract rather than invent independent ranges.

**Backward-compatibility requirements:** No saved character/class/heritage/token IDs changed; preserve links and aliases; no level/stat trimming of existing characters; no custom world canon overwrite. Revised text/cache version must actually reach the rendered codex.

**Migration requirements:** Static content/cache revision only, with narrowly scoped version bump and rendered verification. No player-data migration. Keep historical documents as labeled evidence, not silently rewritten canon.

**Tests required:** Data-to-summary assertions for named units/ranges/layout; actual rendered selected rules assertions; link/ID integrity for changed lexicon records; cache revision/current text fixture; supported vs manual labels; previous contract suites stay green. Do not write tests that merely assert a duplicated literal everywhere.

**Manual verification required:** Creator validates disputed rules/canon; one GM/two-player first session physically and in VTT using the published reference. Playwright confirms actual pack/talent/resource/support text after cache refresh. Staged release smoke includes configured Firebase auth, socket handshake, acknowledged mutation, save/fault/rejoin and one scratch checkpoint restore; exercise reduced-motion/WebGL-off presentation without changing rules.

**Success criteria:** A new player can run the supported first table without contradictory instructions or requiring hidden simulation. A new implementation agent can route to the exact owner/test contract from a small index. Operational omissions are listed as gates, and the owner has a concrete first-release decision.

**Stop conditions:** Documentation work turns into balance/code redesign, automatic lore generation, archive reconciliation, a giant duplicated architecture manual or a claim of readiness without live evidence. Record the disputed decision; stop that edit rather than inventing canon.

**Risks:** Stale static cache, runtime treated as intended canon by accident, contradictory duplicated summaries and overclaiming release readiness. Low/medium implementation risk with high product coherence value; human review matters more than expensive code-model prestige.

**Rollback boundary:** Selected content/cache/docs publication; restore previous text if necessary without touching player data. Keep new contract/evidence history marked appropriately.

**What this unlocks:** Owner-approved first-table release candidate and progressive-context AI development. The broad audit cycle ends.

**Model routing recommendation:** **DeepSeek-level implementation agent** for bounded content edits, fixtures and factual docs; **Senior architecture review** of operational maps; creator review of rules/canon. No strongest-model pass unless a genuine foundational contradiction is newly uncovered.

<!-- EXECUTION_PROJECTS_END -->

## 27. Parallelization Map

### Actual dependency graph

| Project | Hard implementation/acceptance dependencies | Safe independent work |
|---|---|---|
| P1 | None | All unaffected personal/content specification work |
| P2 | P1 for real socket/user status acceptance | Pure failure/queue tests can be prepared during P1 |
| P3 | P1/P2; H4 for ambiguous live migration | Legacy fixture/export preparation without mutation |
| P4 | P1/P3 for integrated room rules/metadata; H1/H2/H14 | Emulator/cleanup/recipient fixtures and approved policy draft |
| P5 | H5 published draft policy | Independent of room/P1–P4 files except any shared auth/status integration; serialize those files |
| P6 | P5 | Status/fault fixtures against existing services can be prepared earlier |
| P7 | P1–P4/P6 for integrated multiplayer claims | Pure actor/condition adapters after contract freeze, with explicit local scope |
| P8 | P7; P1–P4 for durability claims | Existing ability fixture/physical card; no new execution before actor contract |
| P9 | P7/P8/P6 | Read-only support adapter fixtures preserving source; no simultaneous casting-controller edits |
| P10 | Delivered P5–P9 advertised behavior; H6–H9/H13 signoff | Named data/text/physical-reference drafts after authoritative values are established |

### Lane dependencies, not a fake all-blocking waterfall

- **Lane 1 → Lane 3:** event/checkpoint reliability enables accurate collaboration/recovery. Ordinary cooperative chat/dice can keep working while migration is designed.
- **Lane 1 + Lane 3 → durable Lane 2:** multiplayer consequences require scoped acceptance and recovery. A local pure resolver/GM card does not require deployed cloud/billing.
- **Lane 4 → Lane 2 semantics:** approve defense/duration/meaning before automating those rules. An explicit final-amount actor commit can be tested without deciding every future damage rule.
- **Lane 2 → Lane 4 validation:** a small executed action allows meaningful class/encounter playtests rather than assumptions from resource names.
- **Lane 5:** delivery/archives are largely independent. Storage access safety is a Lane 1/3/6 gate when uploads ship; mass archive cleanup unlocks no core execution dependency.
- **Lane 6:** staged environment/backup/rollback proof gates external promises. Payment infrastructure does not gate a local creature action. A zone advertised as durable cannot skip the recovery gate.

**Do not concurrently modify:** P2/P3 room writer; P3/P4 room metadata/rules rollout; P5/P6 auth/storage handoff; P7/P8 actor/token interfaces until frozen; P8/P9 shared execution controller until the slice is proven; any two agents in the same giant renderer/controller file.

If future parallel agents are explicitly authorized, pair **room reliability** with **personal draft protection** using disjoint file ownership, shared fixture contracts and one integration owner. Independent branches still merge in the numbered contract order. This synthesis used no delegated repository investigation.

## 28. Do-Not-Touch List

For this next phase:

1. **No mass asset deletion, resizing, moves, deduplication or history rewrite.** Protect root `public`, old class art/rosters, source maps, greenscreens, lore backups and prototypes. Reference absence is not disposal authorization.
2. **No replacement of Zustand, React/CRA, Socket.IO, Firebase or the rendering stack.** None is the verified root cause of the selected defects.
3. **No rewrite of Grid, the level editor, Three.js world layer, vision or memory.** Integrate a small child/adapter where a named project needs it. Preserve projection, wall/FOV/elevation and fog behavior.
4. **No universal class-resource redesign, cost rebalance or mass spell rewrite.** Preserve note/sphere contents, ledgers, latches, phases, outcome receipts, aliases and Chronarch exclusivity.
5. **No conversion of all 193 creatures, all 526 abilities or every effect vocabulary.** P8 consumes a fixture through a boundary. The bestiary's proposed/review status is not a mass migration instruction.
6. **No general creature AI, universal zone/telegraph engine, rules DSL or chemistry simulation.** No automatic choices from art, text keywords, VFX or timers.
7. **Do not activate dormant safety/gameplay machinery because it has a reassuring name.** `triggerSystem`, channel helpers, summon-duration helpers, lag compensation and recovery modules need a named consumer/contract first.
8. **Do not consolidate both campaign manager UIs during persistence repair.** Guard the shared service, then assess duplicated UI only when a concrete divergence hurts use.
9. **Do not run the broken static extractor as routine regeneration.** Preserve runtime JSON and version/cache behavior. Restoring provenance is a separate future bounded task.
10. **Do not remove legacy token/root mirrors or compatibility IDs opportunistically.** Migrate exact consumers behind P3/P7 fixtures before removal is even proposed.
11. **Do not erase unsynced local drafts on sign-out, quota pressure or migration.** Scope and preserve; deletion/retention is a separate explicit policy.
12. **Do not weaken rules to rescue an unadapted UI query.** Nor deploy destructive Functions whose owner/path behavior is unproven.
13. **Do not reconcile archive-only lore to current canon.** Change named live contradictions; preserve historical variants and deliberate user-world overrides.
14. **Do not turn a borrowed engineering concept into a generic player mechanic.** Duration/receipt/revision bookkeeping does not grant universal time manipulation, pressure currencies or resource gains.
15. **No opportunistic cleanup of adjacent modules.** A surprising file may be owner work. Verify, record and leave it outside the chosen project's scope.

## 29. Giant File Policy

Classification: **A — large but coherent; B — large and fragile; C — large and blocking development; D — large but leave alone for now.** Audited line counts are orientation only; no fresh size census was needed to choose work.

| File / group | Classification | Concrete policy for this roadmap |
|---|---|---|
| `components/Grid.jsx` (~4,243 lines) | **B** | Tactical input/overlays and broad fan-out. P8/P9 should need no rule logic here; a child mount only if unavoidable. No canvas rewrite. |
| `components/grid/CreatureToken.jsx` (~4,390) | **B** | Actual upcoming risk: cost/use logic is inside token UI. P8 extracts only quick-use controller/dialog integration and tests it; drag/vision/context menus stay put. |
| `components/grid/CharacterToken.jsx` (~3,169) | **B** | Actor projections/control are consequential. P7 uses a targeted identity/state adapter; no broad component split. |
| `components/hud/PartyHUD.jsx` / `TargetHUD.jsx` (~4,485 / ~3,241) | **B** | Multiple manual resource/condition entry points. Route covered fields through P7, preserving layout and unrelated menus. Do not duplicate another HP implementation. |
| Multiplayer join/snapshot orchestration (`MultiplayerApp.jsx`, `roomJoinHandler.js`, socket appliers) | **B** | P3/P7 extraction of one silent snapshot/actor application seam is useful. Leave unrelated lobby, map and UI orchestration alone. |
| `store/levelEditorStore.js` (~5,448) | **A** | Large registries plus cohesive map state and many consumers. P3 serializes it through the map boundary; do not split registries for cleanliness. |
| `components/level-editor/ProfessionalVTTEditor.jsx` (~4,166) | **D** | Working editing tools; no chosen project benefits from a main rewrite. |
| `level-editor/objects/ObjectSystem.jsx` (~3,987), terrain/render managers | **D** | Preserve working object/rendering behavior. No world rules added here. |
| `components/rules/RulesPage.jsx` (~7,074, many blank lines) | **B** | P10 changes named data/summary consumption. Extract a pure summary helper only if duplicate live arithmetic prevents correctness; do not rebuild the codex. |
| `CampaignManagerWindow.jsx` / account `CampaignManager.jsx` (~6,886 / ~6,664) | **B** | Two views can drift, but P5 fixes the service/handoff. One shared status/reconciliation affordance is permissible; UI consolidation waits. |
| `UnifiedSpellCard.jsx` (~6,406) | **A** | Broad, largely presentation-focused consumer. Reuse it; do not put execution/normalization into it or split by every effect now. |
| `Step1CoreDraft.jsx` (~3,779) | **D** | Onboarding overload is plausible, not a demonstrated foundation bug. Test first-session comprehension; preserve current acquisition validation. |
| `store/combatStore.js` (~1,515) | **B** | Turn math plus deferred resource/effect mutations. P3 silent hydrate and P7 correct actor application only; no scheduler/zone simulation absorbed. |
| `data/classes/*`, `classRacials.js`, `zoneData.js`, equipment/talent/creature data | **A** | Large content tables are not giant logic failures. Preserve creative content and edit only named facts/contracts. |
| `classLoreStore.js` (~5,471 lines, ~147 nonblank in A) | **D** | Whitespace/data oddity has no current product leverage. Leave it. |

**Category C:** no file-size-driven rewrite is established as necessary to unblock these bounded projects. A component that becomes blocking because an implementation insists on putting game logic inside it is a failed implementation approach, not evidence the whole component must be rewritten.

The rule is **extract the upcoming responsibility, not a file into aesthetically equal pieces**. Tests must prove the user-relevant behavior before and after extraction.

## 30. AI Development Operating Model

The audits become the evidence archive. This roadmap becomes the work-order layer. Tests and exact current source remain the implementation authority.

### Small authoritative operational set — created later by P10

Do not force seven large new manuals. Use:

| Proposed document | Small responsibility |
|---|---|
| `docs/ai/AGENT_RULES.md` | One-page router: read the named project, scope constraints, where to find owners/tests, stop protocol. Root `AGENTS.md` remains the entry instruction. |
| `docs/ai/PROJECT_CONTEXT.md` | Product boundary, tabletop principle, franchise/canon distinction, supported/manual capability summary. |
| `docs/ai/ARCHITECTURE_MAP.md` | Owner/state/serializer/event/test map and links to narrow subsystem contracts; concise current truth, not a second audit. |
| `docs/ai/IMPLEMENTATION_PROTOCOL.md` | One-project execution, compatibility/migration/rollback and relevant testing requirements. Include testing routing here rather than a redundant `TESTING_PROTOCOL.md`. |
| `docs/ai/CURRENT_PRIORITIES.md` | Delivered/pending project status, active gates and owner decisions; no copied speculative backlog. |

`DESIGN_PRINCIPLES` can be a short section of project context. Split testing/design pages only if the combined files become too large to route efficiently. This task creates none of these files.

### Progressive context

1. Read the small root/router instructions.
2. Read this document's executive decision, relevant map/policy and **one named project**.
3. Follow the owner map to that subsystem's event/serializer/test fixtures.
4. Read exact current producers, consumers and persistence paths before changing code.
5. Pull the relevant audit evidence only for a disputed claim; do not re-ingest the entire corpus routinely.

### Highest-leverage protections against AI errors

- State **who owns each datum and which representation is a projection**. Document active vs dormant execution, not only module names.
- Put transport, actor and checkpoint contracts beside meaningful fixtures. A test should fail when a wrong room, false save, replay, stale revision or old shape is mishandled.
- Separate supported authoring fields from displayed/manual-only fields. No executable meaning inferred from a card, a comment or lore.
- Replace false comments such as “deep merge,” “private because ignored,” and “sync succeeded” when a named implementation actually changes the contract. Do not do a repository-wide comment sweep.
- Require changed contracts to update their small owner map and tests in the same project. Exact non-goals and unsupported paths prevent “while here” expansion.
- Keep hand-tuned creative data and user overrides intact. Generated output must identify its source and cannot overwrite frozen JSON through a broken generator.
- Record meaningful final decisions/root causes in Mind, linking them to the roadmap. Session summaries remain evidence, not replacement canon.

### Model routing economics

Use cheaper large-context implementation for focused discovery, test fixtures, mechanical wiring, data/copy corrections and factual changelogs. Freeze risky contracts before that implementation begins. Pay for senior/strongest review at **migration, room authority, security and foundational actor boundaries**, not every JSX/status edit.

A strongest-model review should answer a narrow question with a concrete failure case. It should not restart a seventh broad audit. Human fiction/product choices stay human choices regardless of model cost.

## 31. Implementation Agent Protocol

Future implementation agents must:

1. Read `docs/MYTHRILL_NEXT_PHASE.md`, root agent instructions and the relevant operating/subsystem contract.
2. Implement **ONE named project only**. State its number/name and acceptance boundary.
3. Inspect the current local worktree and exact source before modifying it; do not assume this snapshot or HEAD is still current.
4. List exact intended files and behavior, including producers, server handlers, serializers and consumers touched.
5. Preserve the project's explicit non-goals, protected systems and required human decisions.
6. Do not refactor adjacent systems opportunistically. Extract only the responsibility required by this project.
7. Reuse existing helpers, infrastructure and installed dependencies. Add a dependency only when required and explained; check current framework docs before new external API use.
8. Do not rename/move/delete unrelated files, normalize creative content, clean the dirty worktree, or modify other agents' work.
9. Add/update meaningful failure and compatibility tests. Middleware composition matters; Firebase rules require emulator tests; game rules require the physical equivalence check.
10. Run the relevant suites and required manual scenarios. Report exact discovery/filter/skip scope. Do not replace real-path proof with a larger unit count.
11. Record migration, backward compatibility, unknown-version behavior and rollback. Preserve recovery copies before changing valuable data.
12. Report changed files, implemented behavior, actual tests/results, manual proof, remaining unsupported cases and unresolved gates.
13. Update only the relevant operational contract/project status and durable decision memory. Record a factual implementation delta, not an unverified “everything fixed” claim.
14. Stop after that project. **Do not automatically start the next item.** Do not commit/push/deploy without explicit task authorization.

**If a roadmap assumption proves wrong: STOP the affected implementation.** Capture the exact new evidence, affected scope and proposed decision. Preserve working data and ask for the bounded correction. Do not improvise a new architecture inside the project, continue into neighboring projects, or request a broad Agent H audit by default.

An implementation may discover a genuinely new unknown. The response is a focused evidence update and project amendment, not a new investigation of the entire repository.

## 32. Risks if We Ignore This Roadmap

- **Polish over disappearing campaigns:** users trust a save indicator while the writer drops progress or resume reconstructs empty state. New visuals make that trust breach worse.
- **Wrong-table/actor mutation:** stripped map fields, global recipient lookup and local-player aliases cause convincing but incorrect state. Automated damage amplifies the harm.
- **Replay-driven damage and bloat:** snapshot hydration re-executes turns, resume concatenates collections, and independent timers repeat consequences. More conditions/zones multiply the problem.
- **Privacy by CSS:** packets/storage expose private contents even though ordinary UI hides them. Same-browser drafts can leak/upload to another account.
- **Contract success mistaken for complete execution:** resource/cost tests pass while triggers, damage, defense or expiry remain manual. Players cannot tell which game they are actually playing.
- **Another elegant unowned engine:** a universal effect layer duplicates spell/condition/creature authoring and becomes a switch/DSL everyone must understand before changing one action.
- **Franchise erosion:** familiar mechanics introduced for code uniformity flatten cadences, bodies, debts and time into generic RPG counters; cleanup loses archival art/lore value.
- **AI repeats historical plans:** broad audits remain operational context, stale comments beat tested contracts, and new agents propose already-installed relays or broken regeneration.
- **False commercial readiness:** billing/features are marketed before reliable rooms, export/erasure, size limits and recovery are demonstrably operable.
- **Perpetual investigation:** another generalized audit postpones the same bounded repairs. The owner keeps paying for rediscovery instead of usable completion.

## 33. Product Thesis

**Mythrill is becoming a tabletop RPG where bodies, places and communities remember consequences, with a trustworthy VTT that makes those consequences visible, manageable and shared.**

This refines the earlier “world remembers, reacts and changes” thesis. It retains memory, reaction and change while avoiding the promise of an autonomous world simulator. “Bodies, places and communities” grounds the fantasy in things players can perceive, alter and track at a physical table; “trustworthy” makes remembered consequences depend on real persistence and authority rather than attractive presentation.

A future feature should either protect that trust, express a tangible authored consequence, or make an existing tabletop choice clearer. If it only adds generic engine breadth, invisible simulation or another renamed resource, it does not yet earn priority.

## 34. Immediate Next Action

**Hand Project 1 — Production Socket Contract Restoration — to one implementation agent with §31's one-project protocol and its exact acceptance cases.**

No human decision blocks it. Do not bundle room migration, class design or zone work into that task. After its focused verification and review, select the next bounded project using the actual dependencies above.

The synthesis is complete. Implementation has not begun.
