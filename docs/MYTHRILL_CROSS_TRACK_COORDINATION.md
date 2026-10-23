# Mythrill cross-track coordination: file ownership and dependencies

**One shared coordination document for the combat track, the class/authoring track (Class HeadQ) and Main
HQ.** Created 2026-10-18 by the combat track. It records who owns which files, which accepted identities
other work relies on, and which capabilities depend on another track. It approves nothing. A row changes owner
only by agreement recorded here.

- **Combat** owns execution infrastructure: P7 consequence authority, approvals and receipts, targeting,
  presentation of accepted results, reaction windows, area execution.
- **Class/authoring** owns class mechanics, heritage, resource schemas, content, the Spell Wizard, authored
  definitions and migration recommendations (`docs/plans/mythrill-class-reconstruction/`).
- **Main HQ / combat HQ** owns shared execution/authority/persistence decisions and freezes cross-track
  contracts. Historical CR-A1b stays **parked outside delivered P14-A1**; the newly reconciled bounded
  [authored pilot](MYTHRILL_PROJECT_14_A1_CONTRACT.md) is implemented/accepted, not the old draft wholesale. Class HeadQ's current
   handoff is [33](plans/mythrill-class-reconstruction/33_CLASS_DELIVERY_RESET_AND_ENGINE_HANDOFF.md),
   with class delivery superseded by [34](plans/mythrill-class-reconstruction/34_ROSTER_INTEGRATION_COHORTS.md)
   and [RI-1](plans/mythrill-class-reconstruction/implementation/RI-1-CHAOS-WEAVER-INTEGRATION.md).

## 1. Standing rules

1. **No second engine.** Class resources stay with the existing class-owned owners (`classResourceContracts.js`,
   `classResourceBanks.js`, resourceSlice, ClassResourceBar/ResourceTooltip). Payment, approval and receipt stay
   on the existing P7/P9/P12 paths. P14-A1 uses unchanged `authoredSpellDefinitions.js` (A1a) with the
   existing P7 handler/writer and a thin installed lookup. Neither track builds a parallel engine.
2. **No stable-ID changes or save migrations** come from class roster directions. Existing class IDs (Gambit,
   Revenant and Shaper compatibility included) stay until an approved migration exists.
3. **Accepted authoring fixes are preserved.** Combat does not edit the CR-W1a/W1b files and does not add
   server-side default prices that could mask authoring loss.
4. Historical **parked** `CR-A1b-LIVE-INTEGRATION.md` retains investigated seams, not blanket permission.
   Main HQ reconciled/froze/delivered only [P14-A1](MYTHRILL_PROJECT_14_A1_CONTRACT.md). Wider authored
   combinations/new bindings still need named extensions. Class design/content does not wait for them.
5. **Before freezing a reaction-payment (P13B) or expanded-consequence (P14 or follow-on) contract**, combat reads
   and cites the class package's *reviewed* requirements. Candidate schemas (R1 opcodes, `classResourceProgram`,
   lifecycle envelopes) are proposals until Class HeadQ marks them reviewed.
6. **Before writing a shared file**, the writer compares the device bytes with the base it edited from and
   merges any later change. Combat records shared-file edits in §5 before they reach the device.
7. "Supported" means an exercised production path; otherwise a feature is a stated manual fallback or a
   scheduled future capability.

## 2. File ownership

| Area | Files | Owner | Notes |
|---|---|---|---|
| P7 consequence authority | `server/services/actorConsequences.js`, `server/handlers/actorConsequenceHandlers.js`, `server/services/actorProjection.js` | Combat | Parked A1b investigated `stage`/handler seams; no selected integration or edit assignment |
| Combat approvals | `server/services/spellPayments.js`, `strikeApprovals.js`, `blockApprovals.js` and their tests | Combat | Preserve accepted paths. Parked A1b's additive-module suggestion is investigation history, not a frozen architecture |
| Private declaration collection | `server/services/reactionWindows.js`, `handlers/reactionWindowHandlers.js`, `services/reactionWindowService.js`, `ReactionWindowPanel.*` and focused tests | Combat | W delivered/reviewed; existing authoritative routing/limits/sanitizer; no payment/reservation/effect/accepted-consequence path |
| Client consequence services | `actorConsequenceService.js`, `spellConsequenceService.js`, `weaponStrikeService.js`, `blockingService.js`, `featherSlashCustody.js`, custody modules | Combat | Reuse custody/approval patterns for separately approved work; no A1b implementation assignment |
| Result presentation | `acceptedResultFeed.js`, `components/combat/*` | Combat | Class-resource presenters plug in through one hook (row 3) |
| Targeting | `store/targetingStore.js`, `services/targetPick.js`, `components/grid/TargetPickOverlay.*` | Combat | |
| Casting entry points | `SpellActionBar.jsx`, `ActionBar.jsx`, `SpellCastConfirmation.jsx`, `manualActionGate.js` | **Shared** | Combat: routing and manual gate. Class: card content and costs |
| Party HUD | `PartyHUD.jsx` | **Shared** | Class: ClassResourceBar/domain presenters, now RI-1 normal-HUD integration; progress is not shared execution acceptance. RI-1 keeps PartyHUD read-only unless separately amended. Combat: actor-consequence layer (`ActorConsequenceLayer.jsx`) |
| Socket lifecycle | `components/multiplayer/socketHandlers/*`, `useSocketConnection`, `services/roomRejoinBus.js` | **Shared** (multiplayer) | Exactly one `room_joined` listener per socket, registered only through `registerRoomJoinedListener`; services subscribe with `onRoomRejoined`, never to the socket event |
| Tokens and map | `CreatureToken.jsx`, `CharacterToken.jsx`, `Grid.jsx` | Shared with map/UI work | Combat adds mounts only |
| Spell Wizard | `components/spellcrafting-wizard/**` (incl. `Step5Resources.jsx`, `resourceManager.js`, `spellSerializer.js`) | Class/authoring | W1 resource editor/manager/serializer protected. P14-A1's explicitly coordinated narrow timing/range/whole-draft/reopen/library writes are recorded in §5 |
| Authored definitions | `server/services/authoredSpellDefinitions.js` and its test and fixture | Class/authoring | A1a compiler/planner unchanged and syntax descriptor execution-disabled; P14-A1 adds installed authority outside it |
| Installed authored capability | `installedAuthoredAbilities.js`, shared `authoredAbility.js`, P9/P7 bounded extensions, library/controller/cache | Main HQ/shared with Class producer mapping | P14-A1 delivered/review ACCEPT/Build4/App7 PASS. No parallel payment/persistence owner; new bindings/producers require coordination |
| Class resources and data | `classResourceContracts.js`, `classResourceBanks.js`, `ClassResourceBar.jsx`, `ResourceTooltip.jsx`, `data/classes/**`, resourceSlice | Class | Combat makes no edits |
| Universal reaction source (read-only dependency) | `data/universalCombatSpells.js` | Shared coordination; no content write assignment here | Combat pins original Parry/Riposte bytes; any content correction needs agreed Main/Class HQ handoff. No ID migration or generated-variant support implied |
| Shared condition integration | `conditionsData.js`, `conditionStore.js`, condition normalizer/editor, sheet/GM/manual-card adapters; closed profile/predicate | **Shared**: Combat authority/mechanics; Class content/source mapping and sheet/casting compatibility | P14-C1 manual PC Defending delivered/reviewed; exact §6 identities. Preserve class/race work. No A1b/spell-wide execution |
| Shared checkpoint helpers | `server/services/roomCheckpoint.js` | Combat (persistence) | A1a reuses it read-only (`3eea1acb…`) |
| Area-preview owners | `store/spellAoEStore.js`, `components/grid/SpellAoEOverlay.jsx`, `utils/AoETemplates.js`; map transforms | Combat with map/UI co-review | B2 reuses existing picker/geometry; authored schema corrections remain Class-owned. Current free tool is not action-bound/rule-authoritative |

## 3. Accepted identities other work relies on (verified on the device 2026-10-18)

| Item | File | SHA-256 (working tree) | Note |
|---|---|---|---|
| CR-A1a | `server/services/authoredSpellDefinitions.js` | `48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003` | Matches the reported, reviewed F1/F2-corrected identity |
| CR-A1a | `server/tests/authoredSpellDefinitions.test.js` | `6a2f58f23d9217fc8eddf6af81d6de7f63f2232d29b519156f05fbca74037aa4` | Matches |
| CR-A1a | `server/tests/fixtures/crA1aDefinitionVectors.json` | `e6a98a497308b8535538b9887435c9189127afa768b60cd8e01af31cd3c55bdb` | Byte-identical to the frozen fixture |
| CR-W1a | `.../steps/Step5Resources.jsx` | `6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431` | Matches the corrected manifest of 2026-10-18T11:10Z |
| CR-W1a | `.../mechanics/resourceManager.js` | `ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605` | Matches |
| CR-W1b | `.../utils/spellSerializer.js` | `b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f` | Matches |

**Later difference, inspected.** HEAD `8ba81efb` contains the *pre-correction* A1a (service `b2bc0c7e…`, test
`ea549fae…`). The working tree adds only the reviewed F1/F2 checks: 3 service lines rejecting own symbol keys
and non-`Array.prototype` arrays, plus 183 test lines. The reviewed identity is the working tree, not HEAD.
A1a is unhooked: only its own test requires it.

**Takeover recheck, 2026-10-18:** HEAD remains
`8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`; A1a service and all three W1a/W1b file hashes above match.
Current class handoff33 corrects the evidence label: A1a's final F1/F2 result is **correction plus
verification** (reviewer applied fixes), not a fresh independent review of untouched implementation.
Original BLOCK/probes stay retained. No live registry installation/casting is established by A1a.

**Combat's merge with concurrent commits.** Commit `120ea382` removed the `room_joined` listeners from
`blockingService.js` and `weaponStrikeService.js`. The combat slices' versions of those files keep that removal;
a three-way merge reproduces them exactly. The combat slices' other 25 base files were byte-identical on the
device before write-back.

## 4. Dependency table

| # | Capability needed | Existing implementation | Proposed extension | Owning track | Prerequisite decision | Affected files |
|---|---|---|---|---|---|---|
| 1 | Feedback for accepted HP / temp-HP changes | **Supported (P13A)**: accepted P7 receipts → exact-revision deltas → floats, narration, history, announcements, visibility-filtered | None. New actions get it by producing accepted P7 receipts | Combat | — | `acceptedResultFeed.js`, `components/combat/*` |
| 2 | Feedback for AP, mana, wear | **Narration/history only** (P13A) | Floats if approved | Combat | F1 | `acceptedResultFeed.js` |
| 3 | Feedback for typed class-resource changes | None in the feed; the class HUD shows the personal home | Per-domain presenter (doc 15 view-model adapter) behind one feed hook; private contents never reach public text | Class (presenter); Combat (hook) | Domain reviewed by Class HeadQ; F1 for any float | `acceptedResultFeed.js` (hook); class-owned HUD files |
| 4 | Exact single-target selection | **Supported (P12C-B1)** for P8, P9, P12A | None | Combat | — | targeting files |
| 5 | Selecting linked actors, companions, summons, endpoints | Pick session takes exact P7 refs plus a refusal reason; one ref per session | Role-labelled picks returning exact refs; legality and execution stay with controller and server | Combat (picker); Class (roles) | CR-L1 reviewed; summon actors admitted (row 9) | targeting files; future controllers |
| 6 | Positional relationships (path, zone entry, adjacency, authoritative range/LoE) | Advisory planar centre distance only; no authoritative movement-trigger feed | Separate geometry/movement-event capability; B2 preview (row19) does not supply authority | Combat with map/UI | Approved range/LoE/elevation/movement rules; no silent tool-default adoption | future movement/authority files |
| 7 | Named reaction payment / reservations | **E1a original Riposte1-AP execution supported**, not a hold. All reservations and other reaction-payment adapters remain missing; P9 planners/P12B pending are not escrow | W still pays/reserves nothing. Other named binders need exact consent/P7; hard holds need per-domain conservation across competing spend paths | Combat/Main HQ (timing/P7); Class (reviewed typed domains) | D13-1 fees manual; collection withdrawal is no refund rule. R1/CR-L1 not payment approval | Shared strike/P7 E1a branch; future typed domain work separately coordinated |
| 8 | Atomic multi-actor consequence (candidate cap ≤4) | P7: source + at most one target | Proposed bounded N ≤4 plan per approved capability, or per-target commands only where genuinely equivalent; link coupling is not equivalent | Combat | D14-3 choice; domain-specific atomic coupling review | `actorConsequences.js`, handlers |
| 9 | Entity lifecycle (summons, pattern vitality, anchor object) | Creature actors with exact refs | Admitted creation/removal; narrow class-object projection | Combat (infra); Class (rules) | CR-L1 reviewed | follow-on project |
| 10 | Own-turn, rest, encounter boundaries | Manual | Once-only boundary event records | Combat | R1 boundary rules reviewed | follow-on project |
| 11 | Durable cooldowns | None | Durable cooldown records | Combat | P14 contract | P14 |
| 12 | Body/form trait permissions | Authored config only | Trait-permission adapter | Class (rules); Combat (seam) | Druid/Lichborne mechanics approved | follow-on project |
| 13 | Private hand/deck/bag | P5/P6 private custody; P7 private intents | Server-only domain projection | Class (domain); Combat (transport) | Gambler/Chaos Weaver domains approved | follow-on project |
| 14 | Authored Wizard abilities become executable | **P14-A1 delivered**, repaired independent source/evidence ACCEPT, Build4/App7 PASS: real Wizard/library/versioned GM admission → existing P9 exact owner consent/roll → GM final → P7 AP/mana+HP/recovery | Wider producers/bindings/mechanics remain separate named extensions; historical A1b draft not implemented wholesale | Main HQ/Combat execution; Class authored records/requirements | Creator authorized/frozen bounded A1, not every custom/class/ancestral mechanic | A1 contract/acceptance; unchanged A1a plus existing P7/P9 owners and thin installed lookup |
| 15 | Authoring prerequisite: explicit 0 AP preserved | **CR-W1a accepted** (§3) | — | Class | — | Wizard files |
| 16 | Authoring prerequisite: `resourceCost` survives serialization/export/templates | **CR-W1b accepted** (§3) | — | Class | — | `spellSerializer.js` |
| 17 | Fallback for unsupported actions | **Manual (P12C-B1 §3)**: shared rooms post a notice and spend nothing | Optional "pay listed costs" through existing resource controls | Combat (gate); Class (costs) | Creator decision | casting entry points |
| 18 | Heritage edge effects and paired costs | Advisory named routes | Closed per-edge consumers | Class | Class HeadQ review | class-owned |
| 19 | Action-bound area preview | **B2 §8.1 implemented, bounded source review accepted; final production build3/App7 PASS**: original Radiant Burst10ft circle/20ft reach, selected channel, square grid; exact evidence B2 §15 | Wider shapes/spells/modes remain conditional. One transient interaction, token-gated visible geometric markers; no roll/cost/proposal/chat/effect | Combat (interaction/geometry); map/UI (transforms); Class (authored data) | **G1/G3/G3a/G5 approved** and §8.1 authorized; G1b/G3b/G4 remain independent, G2/G6/manual recipient conflict retained | `targetingStore`, `spellAoEStore`, existing `SpellAoEOverlay`, `ActionAreaPreview`, `TokenAreaCandidate`, shared confirmation entry; no Class edits |
| 20 | Private timed declarations / manual handoff | **P13B-W implemented; independent source+final delta acceptance, Build3/App4 PASS.**8s, immutable GM precommit, private revisions/withdrawal, GM-only closed review, silence/same-deadline reconnect; declarations still pay/execute nothing | E1a original Riposte separately delivered (row25); no automatic Parry or wider reaction engine | Combat/Main HQ; Class retains card/domain semantics | W D13-6b/11/10 approved; other rule interpretations stay GM-adjudicated | W accepted boundary §11; named E1a §13 |
| 21 | Durable secret reaction/card state | W uses private server WeakMap and scoped in-memory pending/unavailable audit, not gameState/public snapshots; same-runtime recovery only | Durable private restart storage is **not delivered**; current restart/authority change hands off manually, never reopens old timer | Main HQ/Combat (storage/transport); Class (domain privacy) | Separate private durability contract if wanted; W capacity is technical, not a card/use cap | Existing checkpoint/projection owners; no new independent cloud ledger |
| 22 | Targeting/propagation authoring preservation | Whole-draft JSON retains fields; outer saves/normalizers alter zero range/count; legacy propagation fields and per-effect updates can disagree; game-code export is lossy | **Inventory prepared** in B2 §9–§11. Separate bounded preservation/mapping contract, not silent schema/rule conversion or a W1 resource-cost rewrite | Class/authoring; Combat co-reviews descriptors | Exact schema/profile mapping and parity contract + separate implementation authorization | Wizard Step4/context/APP/Review/serializer/normalizer; no edits assigned here |
| 23 | Multiple selections / propagation path aids and execution | Local selectedTargets array, Wizard dummy chains/branches and B1 one-ref picker; no shared propagation executor | Proposed later role-labelled list or one named path using existing interaction. Execution stays P14/named follow-on; intermediate opportunities only when actually eligible, via P13B | Combat (selection/path/consequence); Class (card rules); map/UI (segments) | Profile-specific chooser, range basis, count/revisits/filter/each-segment LoE/stops/roll/cost/reaction/invalidation; atomicity choice | Existing targeting/AoE owners and future named P7 binder/domain seams, not a new engine |
| 24 | Obstruction-aware aiming and later enforcement | Separate sight/movement flags, wall endpoints/index and visual object bounds; B1 aim is advisory. Door state/identity encodings differ; actor CAS does not version movement | **Conditional boundary prepared, B2 §14**: clear/blocked/partial/unknown per diagnostic; visible-only feedback; exact GM ruling; later server check at existing P7 stage/binder, with settled spatial evidence | Combat/Main HQ + map/multiplayer; Class supplies exact authored exceptions | Separate spatial profile/state parity/freshness/override freeze and authorization; no automatic conversion of movement/sight flags to LoE, cover or blast rules | Existing geometry/target overlay, map/movement writers and P7 stage/handlers (future only); no assigned source writes |
| 25 | Named universal Riposte execution | **E1a delivered/review ACCEPT/Build1-App2 PASS.** Typed GM parent/paid attestation +server origin provenance, fresh follow-up/closed intent, owner1-AP consent/retained roll, GM damage; one P7 AP/HP+consumption receipt | No Parry auto-comparison, highlighting, generic trigger feed, ordering, condition lifecycle or other-card execution | Combat (shared approval/binder/custody/W bridge); Class (content/domain compatibility) | §12 HQ frozen/authorized; rules/fees remain manual. Exact identities/limits in §13; no A1b/class migration | Named helpers/shared strike/P7/routing; additive user-only custody; RP UI/receipt feed; original2-AP basic path preserved |
| 26 | One shared condition definition/write/read path | **P14-C1 delivered/review ACCEPT/Build3 C1 parity/App11 PASS**: one PC Defending profile/controller/editor and P7, token↔sheet, real2×/no-wear/retained-face correction and exact recovery | Manual expiry/prior-action cost. Stunned full action gate, creature Defend and lifecycle remain separate | Combat +Class/source/UI coordination | HQ authorized frozen PC/manual scope; exact evidence/limits P14-C1 §6 | Shared profile/service/custody/editor and existing P7/condition/token/sheet/manual-card/block adapters |

## 5. Shared-file edits by the 2026-10-17 combat slices

**P14-A6 authorized/frozen (2026-10-23), before runtime edits:** [A6 contract](MYTHRILL_PROJECT_14_A6_CONTRACT.md).
Exact admitted creature self-healing reuses existing merged one-actor P7 payment/HP path. Shared writes:
installed source predicate, spell validation/handler pending baseline, controller/panel and focused
tests/witnesses/help/docs. No new engine/storage/DTO; A1/A5 consent routes protected. A5 runtime51/53
match; remaining2 are concurrent loot additions in socket registration/Inspect, preserved alongside
Class/map/touch/settings work. Protected7 match. Current-tree build identity will be measured anew.

**P14-A5 Main HQ-authorized delta (2026-10-22):** frozen scope in
[A5 contract](MYTHRILL_PROJECT_14_A5_CONTRACT.md). Combat edits existing installed source predicate,
spell validation, P12B offer/approval/binder, P7 public-proof redaction, existing spell/block controllers
and panels, accepted-result healing wording and Laws. Existing two-actor operation/wear writer and
custody families remain owners; no new engine/storage. A1a/W1/Class/Heritage and unrelated UI protected.
Entry master14b21cfe includes dirty accepted A4 fixes and concurrent Class/UI work, with fresh-context
patches preserving them. Later RulesPage/ClassDetailDisplay/talent-tree/class-icon work is unrelated
concurrent drift. [Final A5 acceptance](MYTHRILL_PROJECT_14_A5_ACCEPTANCE.md) records79 server/47 client,
Build5/App6 PASS and same-review repaired qualified ACCEPT; gate269f83e2… binds53 runtime/protected7/
recorded client inputs. Independent static hashes/evidence appraisal, zero independent target execution;
four fetch errors and provider/cloud/live-only/device limits retained. Class semantics remain separately
owned and unreviewed by this execution slice despite their current bytes being included in Build5.
Late map/drawing/touch work is also preserved: handoff drift6f23010f… at07:18:56Z names9 recorded
client inputs plus unlisted additions, with A5 runtime53/protected7 unchanged. Full-current-tree build
parity is not claimed; same reviewer independently confirmed the late-drift addendum.

**P14-A4 implementation handoff, 2026-10-22:** source/payment/recovery freeze above is implemented.
Same single bounded reviewer repaired **ACCEPT**, final optimized **Build4/App10 PASS** with scoped43
runtime/frozen-client parity and protected7 match; five fetch errors and concurrent Class drift qualified.
Actual placement additionally required tokenHandlers detached association/defenses capture and positive
numeric roomAccess projection for custom-token reload; GM-only lookup keeps raw whole drafts private.
Shared actor projection/feed retain absent unused pools without suppressing exact HP feedback.
Source-admission request history stays in existing protected P7 ledger, not a new permissions store;
creature-only installed versions cannot inherit PC permission from compiler syntax. Existing P9 custody,
shared command custody, writer/receipt and C2 gates remain owners. Source, tests, optimized App/build,
same-review repair/evidence provenance and concurrent external Git drift are in
[A4 acceptance](MYTHRILL_PROJECT_14_A4_ACCEPTANCE.md). No Class/Heritage/RI-2/ancestral or overflow/progression
edits by this agent. [Next creature→PC preparation](MYTHRILL_PROJECT_14_A5_CREATURE_PC_PREPARATION.md) reuses
P12B owner consent/block/wear; healing policy remains an explicit decision. No implementation assigned.

**P14-A4 authorized/frozen, 2026-10-22 — before runtime writes:** exact GM-controlled placed
creature → distinct placed creature only. [A4 contract](MYTHRILL_PROJECT_14_A4_SOURCE_AUTHORITY_CONTRACT.md)
freezes source-incarnation/association admission under protected actorContract, existing installed
registry/P9 custody/payment/P7 atomic install and C2 rechecks. Shared writes: admission/controller/
planner/host, CreatureAbilityDetails and inspect mount, handler/payment/installed lookup/socket set,
focused tests/witnesses/Laws/status. A1a/W1/Class/Heritage/RI-2/overflow UI remain protected; no catalogue,
loadout, grant, economy or migration writes. Entry master/485c0bba, existing dirty contributions retained.

**P14-A3 authorized/frozen/delivered, 2026-10-22:** [contract](MYTHRILL_PROJECT_14_A3_CONTRACT.md)
records scope before edits; [acceptance](MYTHRILL_PROJECT_14_A3_ACCEPTANCE.md) pins final bytes. Main HQ
writes only shared compact form options, Creature Wizard/context/Step3 and whole-record preservation,
duplicate/placement/propagation isolation, inspect/manual status, tests/witness/status docs. No Spell
Wizard/export/W1/compiler/engine/Class/Heritage writes. Actual producer/admission delivered; no creature
cast. One review F1–F3 repairs accepted; Build1/App9 independently appraised. Concurrent external commits
and later overflow UI drift retained; no full current-tree build parity or deployment claim. §11 handoff.

**P14-A1 closure, 2026-10-22:** [implementation/evidence](MYTHRILL_PROJECT_14_A1_CONTRACT.md#implementation-and-verification--2026-10-22),
[same-reviewer repaired ACCEPT](MYTHRILL_PROJECT_14_A1_ACCEPTANCE.md). Real Wizard2 definitions, explicit0
AP/mana/range and immutable versions, existing P9 consent/custody/GM final + P7 payment/HP; unsupported
whole records/manual preserved. Actual production library edit uses owner-guarded transient handoff;
free remote actions compare-and-set unchanged AP within existing P7 bounds.10 server cases; affected
seams and client checks pass; Build4 exit0/drift[]/16-client parity, App7 PASS/22-runtime parity. Reviewer
independently read source/evidence and measured hashes, did not execute runs. Seven protected identities
unchanged.3 fetch errors and provider/lease/cloud fixtures/live-only App limits retained. Entry/final
master/ad93fd78 unchanged; no Git writes or Class/heritage content/grant/ID/migration changes. §9 handoff.

**P14-A1 authorized/frozen, 2026-10-22 — before production writes:** user authorizes the bounded
Wizard-authored immediate ability pilot in [A1 contract](MYTHRILL_PROJECT_14_A1_CONTRACT.md).
Main HQ owns installed authority/execution. Narrow coordinated Class-owned writes: Review retains whole
draft and explicit range0; library mounts admission controls. W1 resource editor/manager/serializer and
A1a compiler/tests/fixtures remain protected. Existing P9 approval/payment/controller/custody and P7
handler/writer/receipt are extended, not copied into parallel binders. Additive pure adapter and installed
registry helper; access/import/legacy protections, socket authority set, existing result feed/panel,
focused tests/App/Laws/status docs. Initial dirty C4/status and RI-2 evidence remain preserved.
This supersedes A1b parking only for this frozen capability; historical draft remains retained.
Actual production Spellbook trace adds `ExternalLivePreview.jsx` (the visible Complete Spell save),
`SpellwizardApp.jsx` normal save/reopen identity, Step2 explicit immediate ACTION selection and Step4
range0 initializer/validation/control. These are narrow producer preservation/choice writes under the
same A1 authorization. No resource editor/manager/serializer rewrite or other export cleanup.
Production library→Wizard edit also needs a transient, owner-guarded request in the existing spellbook
UI store: the library tab unmounts the Wizard, so the old event-before-mount loses the edit. The same
normal reopen mapping consumes the request after mount; no persistence family or authority is added.

**P14-C4 closure, 2026-10-22:** [contract/evidence](MYTHRILL_PROJECT_14_C4_CONTRACT.md#implementation-and-evidence).
One GM-authenticated roster/occurrence chain, same P7 receipt/custody/writer; atomic cursor+due instance
removal, exact corrections and manual fallbacks. Fresh canonical own-turn PC Defending next-start and
named C3 Bash strictly-next-target-end only.8 server/15 client cases +4 independent probes; same-review
capacity/retirement repairs ACCEPT; Build2 compilation0/recorded drift[] and production-App4 PASS.
Source identity18 runtime/12 client dependencies, one clean receiver CRLF/LF caveat; external commits
advanced9e653fc4→f23bab5b→ad93fd78, not this agent's Git write. Existing sandbox guards preserved.
Ancestry directive/reuse/missing/owner/follow-on map in §8; heritage12 cross-link only. No grant/ID/number/
Wizard/A1a/card/resource/migration changes; no recurring executor, general racial timers or A1b.

**P14-C4 authorized/frozen, 2026-10-21 — before production writes:** creator authorizes bounded
authenticated turn expiry and ancestry interface handoff. [C4 contract](MYTHRILL_PROJECT_14_C4_CONTRACT.md)
records verified timer seams, strict GM adoption/next occurrence, canonical PC Defending and named C3
Shield Bash only, manual fallback/one-round preservation. Writable: new server sharedEffectLifecycle;
P7 actorConsequences/handler, combatHandlers legacy guard and imported metadata protection; shared pure
timing helper, additive sharedConditionService, existing shared editor/C3 form/GM controls, combatStore
early route/silent hydration clock metadata, PartyHUD/TargetHUD timing-label mounts only. Existing
writer/custody/admission reused; focused tests/App/evidence/status docs and heritage12 link. Fresh exact
contexts preserve concurrent Class/account/room/card edits. No Wizard/A1a/card/resource/ancestry grant
writes or A1b; ancestry directive/interface map is recorded below, not another roadmap.

C4 registration dependency: additive `socketHandlers.js` authoritative-event set entry for the bounded
P7 turn route; existing strict actor-prefix sanitization/default rate limiting remain owners.
Legacy GM reset dependency: `gmActionHandlers.js` gets only a current authenticated GM-session guard
when retiring an active lifecycle clock; no other GM administration/resource behavior is changed.
C4 review repair scope also includes `components/multiplayer/socketHandlers/combatHandlers.js`: consume
the existing payload-less combat-end event and retain the correct lifecycle metadata on start/end,
using the existing silent combat hydration owner; no recurring/resource behavior is added.

**P14-C3 closure, 2026-10-21:** [contract/evidence](MYTHRILL_PROJECT_14_C3_CONTRACT.md#implementation-and-evidence).
GM-only named manual result, explicit source/target, one result/record/P7-command UUID; same shared
controller/editor/custody/history, canonical C2 Stunned/end-target-next-turn manual expiry.6 production
cases +9 controller tests (3 C3); one bounded F1 update-transition BLOCK→repaired ACCEPT. Build1 exit0/
C3 six-client-file parity[]; production-App2 PASS,4 blocked-provider fetch errors retained. Current
`master/9e653fc4` advanced externally; unrelated RoomLobby build drift and concurrent Class/race/RI-2/
account/room/spell edits are outside acceptance. Protected W1/A1a/universal cards unchanged, parent
checkpoint preserved. C1/C2 acceptance reused. No new execution/payment/recovery path, A1b, agent Git
writes or full Shield Bash/P14 completion claim.

**P14-C3 authorized/frozen, 2026-10-21 — before writes:** creator authorizes named Shield Bash
manual-result adapter. [C3 contract](MYTHRILL_PROJECT_14_C3_CONTRACT.md) freezes result/condition/P7
command UUID identity, exact source/target and GM-only direct result administration. Writable: new pure
`shieldBashResult.js`, additive sharedConditionService, thin ShieldBashResultForm in existing shared
condition dialog/CSS, GM ActorConsequenceControls entry, P7 actorConsequences guard, focused tests/App/
evidence and status docs. Existing custody reused unchanged; no new event/store/payment/recovery engine.
Class/race/RI-2 edits and parent checkpoint preserved; W1/A1a/universal cards read-only. C1/C2 accepted
evidence reused; no automatic Shield Bash save/price/reaction/expiry or A1b.

**P14-C2 closure, 2026-10-21:** [contract/evidence](MYTHRILL_PROJECT_14_C2_CONTRACT.md#implementation--evidence).
Same C1 condition spine extended with strict source-specific Stunned; supported action/E1a/voluntary
movement gates, manual saves/advantage/expiry and GM relocation exceptions.6 new C2 server cases +46
affected regressions/client39; one bounded repaired ACCEPT; Build2 compilation/C2 client parity[] and
App5 PASS. Final server-only legacy-relay guard rechecked after App5. Full-build Class/test drift,
provider/cloud fixtures and4 blocked-fetch errors retained.29 reviewed runtime dependencies hashed;
current `master/8d23e50b` comes from a concurrent external commit, not this agent's Git write.
Class/race/RI-2 checkpoint and W1/A1a/card bytes preserved. P14/A1b/full lifecycle remain open.

**P14-C2 authorized/frozen, 2026-10-21 — before source edits:** creator directs bounded Stunned
implementation using C1. [C2 contract](MYTHRILL_PROJECT_14_C2_CONTRACT.md) names exact writable files:
closed profile/controller/editor/catalogue/token adapters; shared P7 stage/approval checks; token,
character and creature movement handlers plus post-await debouncer settlement; focused tests/App witness
and status documents. Existing sheet/GM entry mounts are reused. Current Class/race/RI-2 dirty bytes and
parent Mind checkpoint stay owned by Class HQ. No class/Wizard/resource/A1a/A1b or migration work.
Source occurrence-specific manual expiry and manual save/advantage adjudication remain explicit.

C2 App-driven repair scope: `conditionStore.js` protects canonical Stunned from custom-title replacement
and routes exact HUD removal through the same shared controller; `riposteService.js`,
`weaponStrikeService.js` and `spellConsequence.js` classify the new authoritative `actor_stunned`
refusal truthfully while retaining command/roll custody. These are bounded adapters, not execution paths.

**P14-C1 closure, 2026-10-21:** [§6](MYTHRILL_PROJECT_14_C1_CONTRACT.md#6-implementation-and-verification)
records one independent BLOCK→repair→ACCEPT review and final24-file identity. Adapter repairs hide/guard
the old token X and preserve canonical Defending on custom-title collision. 50 server/33 client tests;
final2 C1 restore/pruned-receipt cases pass. Build3 compilation exit0, C1 mismatches `[]`; concurrent
Class `Step1CoreDraft.jsx` drift is disclosed, not accepted. Real-App11 token↔sheet/GM/observer,
actual doubled/no-wear blocks, pending exact removal/retained face, lost ACK/reload/same-command,
reconnect and checkpoint-codec proof pass. Manual action/payment/expiry remains explicit. Class/race/
RI-2 work and E1a/W/B2 acceptance preserved; external evidence only, no commit/push/deployment.

**P14-C1 authorized/frozen, 2026-10-20 — source writes before edits:** Combat adds one shared pure
`services/sharedConditionProfile.js` +closed JSON definition, `sharedConditionService.js`/custody and
`SharedDefendingEditor.jsx`/entry/host with styles/tests. Existing P7 condition stage gets a strict named
profile guard; both Defending predicates delegate to the same pure implementation. Normalizer preserves
semantic/source identity, condition projections/cleanup preserve accepted shared records; registry adds
user-only custody with no migration. Thin token ConditionsWindow/CharacterToken props, GM controls,
sheet CharacterStats entry, and a read-only identity field in InspectionContext are **additive only**;
preserve concurrent class/race/stat/resource edits. Shared manual Defend card entry is result administration,
not a casting/payment adapter. HUD profile expiry labels reference the shared definition. No Stunned
gate, timed lifecycle, generic effects/A1b or class/authoring/resource-rule edits. Main owns the new
condition editor/P7 seams; Class HQ keeps all current character/race/class work. One bounded review,
focused regressions and external optimized-build/App evidence. No commit/push/deployment.

**Shared-condition contract preparation, 2026-10-20:** documentation only. Main adds one bounded
`MYTHRILL_PROJECT_14_C1_CONTRACT.md` (P14-C1, distinct from the old Class C1 workshop), and updates
this coordination file, ledger/priorities, roadmap/next-slices pointers and E1a's completion acknowledgement.
No production file assignment, migration, A1b or new generic effect engine. Proposed future shared
interfaces/condition content need Class HQ coordination before code; preserve active class/race work and
the accepted resource/E1a/W/B2 paths. E1a acceptance is carried forward, not re-reviewed or rebuilt.

**E1a completion, 2026-10-19:** the single bounded review is ACCEPT after provenance/custody/generic-
claim repairs and same-review identity handoff; original RED probes retained. Focused server58/client27,
optimized Build1 exit0/drift[] and real GM/owner/observer App2 PASS. Both origins, exact1 AP/no second
Parry debit, physical/digital retained rolls, AP competition/reapproval/paid miss, accepted HP floats/
narration and lost ACK/delivery→real reconnect→same-command receipt are verified. No new broad audit.
Exact15 runtime/test/witness/evidence hashes and explicit build coverage:
[P13B §13](MYTHRILL_PROJECT_13B_CONTRACT.md#13-e1a-implementation-and-verification--2026-10-19).
Concurrent commits advanced build HEAD to `f9527d31`; this agent made no commit/push/reset/deployment.
Class/race edits were preserved and are not accepted by E1a verification.

**E1a implementation authorized/frozen, 2026-10-19 — writable scope before edits:** Combat adds named
`server/services/riposteExecution.js` and focused tests, extends the existing `strikeApprovals.js`,
`actorConsequenceHandlers.js` and P7 named-binder/receipt guards in `actorConsequences.js`; additive
authoritative routing/rate limits in socketHandlers/rateLimitService. `reactionWindows.js` gains only
internal follow-up lookup/closed-intent bridge; accepted generic collection behaviour stays unchanged.
Client thin `riposteExecution.js`/`riposteService.js`/`riposteCustody.js`, `RipostePanel.jsx`/CSS and focused
tests reuse existing request/prepare/submit/custody/roll/P13A helpers; typed dispatch/filtering in strike
service/handler and one HUD mount, named accepted-feed parsing. One optimized-App witness under
`verification/p13/`. No basic-strike formula/cost change, A1b/authoring/class/heritage/Wizard edits or
migration. Preserve concurrent RI-1 files/checkpoint. Exactly one bounded independent E1a review;
bulky evidence/build outputs external. No commit/push/deployment.

E1a custody registration is additive in `src/persistence/privateStorageRegistry.js`: a user-only
recoverable sibling family for Riposte bytes, using existing scoped-native helpers. No legacy key
retirement, schema migration or change to basic-strike custody; focused registry checks only.

**Historical E1a contract preparation (superseded by explicit authorization/delivery), 2026-10-19:** Main HQ writes existing P13B §12, this coordination
document, ENGINEERING_STATE/CURRENT_PRIORITIES and the existing creator packet. Collector W remains
complete at §11's accepted identity; no review/build repeated. Proposed future shared writes are
bounded in §12; no application file is assigned for editing now. Class HQ retains card content,
private/domain semantics, Wizard/export work and RI-1 correction files/checkpoint. Universal card data
is read-only and hash-pinned; no stable IDs, save migration or A1b integration. Execution code needs
separate approval after this contract; other roadmap tracks remain visible, not delivered by E1a.

**P13B-W final handoff, 2026-10-19:** documentation/status writes only in this file, existing P13B
contract/creator packet, ENGINEERING_STATE/CURRENT_PRIORITIES, and top-level roadmap/next-slices pointers.
The existing independent review is completed by delta review, not a new broad audit. Reuse Build3/App4
and focused tests; record exact integrated runtime hashes and manual/live limits. No application edits,
payments/effects/A1b or Class RI-1 correction writes. E1a below is a proposal requiring separate go-ahead.

**Verdict/evidence:** the existing independent reviewer closed the final three runtime deltas and
service regression: **BOUNDED DELTA ACCEPTANCE, no remaining blockers**;3 targeted probes only.
Current W client bytes match retained Build3 (`exit0`, `drift[]`) and App4 (`PASS`) with asset manifest
`84547e1ea7d908471eda1aee12d76cc833b48e1b9e56cb815b8acf482e5bbe01`. Exact integrated source/tests/witness,
review and result hashes are centralized in [P13B §11](MYTHRILL_PROJECT_13B_CONTRACT.md#11-w-implementation-and-integrated-handoff--2026-10-19).
No runtime edits after that review; closure documentation updates do not alter the integrated bytes.

**P13B-W creator-approved implementation, 2026-10-19 — source writes announced before edits:**
new `server/services/reactionWindows.js`, `server/handlers/reactionWindowHandlers.js`, focused
`server/tests/p13bWindows*.test.js`; additive registration in `server/handlers/socketHandlers.js` and
event limits in `server/services/rateLimitService.js`. New client `services/reactionWindowService.js`,
`components/hud/ReactionWindowPanel.jsx`/CSS, focused service/panel tests; one ReactionWindowHost mount
in PartyHUD's combat-owned layer (class resource area unchanged). Reuse the existing narration queue
as a distinct lifecycle input; no accepted-receipt adapter changes. One production-App witness at
`verification/p13/window-app-browser.cjs`; external build/evidence only. D13-6b/11/10 approved, no
early close or clock extension/payment/reservation/execution/A1b/class writes. RI-1 owns ongoing class
HUD/detail/creation/progression edits; preserve them and its parent checkpoint. No B2 verification rerun.

W envelope integrity addition: `server/services/sanitizationService.js` extends its existing strict
changed-byte refusal from `actor_` to `reaction_window_`; private revisions cannot be silently rewritten
by sanitization. No sanitizer policy change for existing events. Covered by W production-stack tests.

**P13B declaration-only preparation, 2026-10-19:** documentation writes only: this coordination file,
existing P13B contract/creator packet, B2 acceptance acknowledgement and ENGINEERING_STATE/CURRENT_PRIORITIES.
Record the creator's completed B2 acceptance without widening or rerunning it. Narrow W's blocker list;
no application, A1b, resource reservation, class or Laws edits. Parent active checkpoint belongs to
RI-1 Phase2 (ClassResourceBar/detail/progression work); preserve its writable paths and recovery state.

**B2 §8.1 creator-authorized implementation, 2026-10-18 (announced before source edits):** Combat writes
`store/spellAoEStore.js`, `store/targetingStore.js` (one mutually exclusive map interaction),
`components/grid/SpellAoEOverlay.jsx` (existing mount routes the action mode), new
`components/grid/ActionAreaPreview.jsx`/CSS and `services/areaPreview.js` (bounded profile/geometry),
`components/ui/SpellCastConfirmation.jsx` (separate channel/preview entry), focused tests and one
`verification/p12/b2-app-browser.cjs` witness. Reuse existing AoE/targeting helpers. No Class/Wizard,
authored spell, server or accepted rejoin edits. G1/G3/G3a/G5 approved; recipient conflict/walls/height
manual. Reconcile the actual current source before each patch; all other concurrent work preserved.

**Bounded review repair R2:** `components/combat/FloatingCombatText.jsx` mounts the new static
`components/grid/TokenAreaCandidate.jsx` inside the existing token render gate. B2 candidate labels/
markers live with the visible token itself, not in a separately cached registry-derived overlay list.
The reviewer demonstrated stale overlay names before passive registry cleanup. Registry hook timing,
accepted receipt arithmetic, floats, narration, sockets and rejoin closure stay unchanged. Focused
visibility/feed regressions cover this narrow mount.

**B2 closure:** final identities/review/build/App are in B2 §15. Existing ledger/priorities are updated;
roadmap and next-slices receive only top-level current-status pointers. No new plan or wider authorization.

Each change is bounded as stated; none touches class data, class IDs, class-resource state, the Spell Wizard or
A1a.

| File | Change |
|---|---|
| `PartyHUD.jsx` | One line: mounts `<AcceptedResultNarration />` last in the actor-consequence layer; ClassResourceBar untouched |
| `SpellActionBar.jsx`, `ActionBar.jsx` | In a shared room, an action without P8/P9/P12A support posts a manual notice and returns before any spend; supported routing and local play unchanged |
| `SpellCastConfirmation.jsx` | Wording "Manual — the VTT applies nothing"; button "Post manual notice" |
| `CreatureToken.jsx`, `CharacterToken.jsx` | One mount of `TokenCombatFloats` |
| `Grid.jsx` | Mounts `TargetPickOverlay` beside the area-template overlay |
| `components/multiplayer/socketHandlers/roomLifecycleHandlers.js` (shared socket lifecycle) | Closure 2026-10-18: its `room_joined` listener is registered through `registerRoomJoinedListener` (join handling first, then the rejoin relay); no new listener |
| `PartyHUD.jsx` (again) | Closure: the layer `div` mount became `<ActorConsequenceLayer>` (bounded, collapsible); ClassResourceBar untouched |
| `SpellConsequencePanel.css` | Closure: layer height/width bounds, collapse styles |

**Historical documentation-only takeover, 2026-10-18 (superseded for B2 §8.1 and P13B-W only):** prepare B2/P13B drafts; revise the
existing batch1 creator packet (retain revision1 as collapsed history); update this shared table, ledger,
priorities, roadmap and next-slices pointers/status. No shared application-file edit is assigned or made.
The pre-existing dirty combat/class/source/assets and staged deletions remain concurrent work. This
entry records documentation scope before those shared coordination/status updates.

**Creator targeting/propagation addition:** extend the existing B2 document with one coverage matrix,
per-mode rule ledger, save-path findings, representative flows and phase sequence; add small cross-links/
status updates in P13B, packet, ledger/priorities/roadmap/next-slices and this table. Documentation only;
Class C1's concurrent correction files and main-space checkpoint remain owned by that track.

**Main HQ continuation, 2026-10-18:** documentation writes limited to this coordination document, B2,
the existing decision packet, ENGINEERING_STATE and CURRENT_PRIORITIES. Prepare one ranged-circle
freeze candidate (B2 §8.1), four immediate questions, and obstruction/revalidation/enforcement boundary
(B2 §14); no application writes assigned. Class HeadQ retains the range0/maxTargets0/export-preservation
investigation (row22): no semantics, correction or implementation handoff inferred. Main-space C1
checkpoint is preserved; concurrent Main HQ recovery uses `projects/mythrill-vtt/targeting-contracts`.

## 6. Phase map

- **P13A (done).** Generic HP feedback; class-resource presentation stays domain-specific (rows 2–3).
- **P12C.** B1 (done) picks exact refs; the picker can later serve row5, with no execution claimed.
  [B2 §8.1](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#15-first-slice-implementation-and-verification--2026-10-18)
  complete/accepted at retained identities (row19); wider B2 remains conditional.
  Its [complete targeting/propagation inventory](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix)
  keeps B2 static preview bounded; rows22–23 name authoring and later selection/path dependencies.
- **P13B.** [W declaration-only contract](MYTHRILL_PROJECT_13B_CONTRACT.md#11-declaration-only-first-slice--conditional-change-contract)
  delivered/reviewed/integrated under approved D13-6b/11/10 (rows7/20/21). **Collection, not automated
  reactions.** E1a original Riposte is subsequently delivered (row25/§13): both entries share one fresh
  opportunity and explicitly owner/GM-approved P7 execution. Parry truth/payment remains GM-attested.
  Four broader cases/automatic triggers stay manual; other typed execution still needs rule1.5.
- **P14.** Approved consequence capabilities, one at a time. **P14 completion does not mean every reconstructed
  class is automated.** Unready capabilities split into bounded follow-on projects:
  - FO-N: N-actor consequences (row 8);
  - FO-E: entity lifecycle (row 9);
  - FO-B: boundary events (row 10);
  - FO-P: private projections (row 13);
  - FO-T: trait adapters (row 12).
   A1b (row14) is parked under Main HQ. Until a class's capabilities exist, shared casting uses row17.
   Class-local content/workshops may be delivered independently of shared execution.

## 7. Open coordination points

1. **A1b parked (Main HQ):** retain investigated P7 binder/handler/persistence seams for future evaluation;
   no chosen live integration. W1/A1a remain preserved prerequisites, not an execution claim.
2. **HEAD versus reviewed A1a:** the reviewed F1/F2 correction is uncommitted; HEAD holds the earlier bytes.
3. **Concurrent commits:** writers re-check device bytes before every shared write (rule 1.6).
4. **Reviewed class requirements:** current33/34/RI-1 now supersede workshop-only delivery with normal
   class catalogue/detail/learning/talent/HUD integration. Its later [RI-1 FINAL-REVIEW](plans/mythrill-class-reconstruction/implementation/evidence/RI-1-chaos-weaver-integration/FINAL-REVIEW.md)
   is **ACCEPT for amended development/manual integration**, superseding the stale parent BLOCK
   checkpoint status; original C1 workshop BLOCK stays retained. RI-2 has a separate Gambler/Fate Weaver
   assignment and content-lock gate, not Main HQ work or shared execution. R1/CR-L1 remain
   proposals. No reviewed
   live card reservation adapter was found. Obtain exact Class HeadQ-reviewed versions before execution
   freeze; preserve cards/wagers, typed banks, links, summons/companions, body/loadouts and delayed state.
5. **Creator packet rev2:** [independent questions](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md)
   replace unapproved defaults; contact/gridless/source-anchor and own-turn/ordering/payment remain open.
6. **Propagation is per profile:** six Wizard methods/behaviours, alternative catalogue schemas,
    piercing/prose ricochet, persistent movement and future recipients are inventoried, not automated.
    A chain drawing supplies no multi-actor payment or atomicity. Class/movement/lifecycle follow-ons stay
    separate; no universal next-recipient, range, visit, collision, decay, roll or payment rule is chosen.
7. **Frozen/implemented first subset:** creator approved B2 §8.1 original ranged Radiant Burst
   circle/channel and G1/G3/G3a/G5; recipient conflict explicit. G1b/G3b/G4
   remain independent manual/out-of-subset decisions. B2 §14 prepares obstruction diagnostics and later
   server enforcement (row24), not wall/cover/elevation rules or implemented validation. Class C1 is
    concurrently under correction; its content/workshop work and parent-space checkpoint stay untouched.

## 8. Ancestral Loadout directive — shared capability/interface handoff

**Creator direction recorded 2026-10-21.** No saved loadout planning document was found during this
focused handoff. This records the supplied directive in the existing coordination structure; it is not
a competing roadmap or a repeat of the completed [all25 cultural review](plans/mythrill-class-reconstruction/28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

- 25 verified heritages, each with one core ability and three paired choices (seven definitions per
heritage); exactly one choice from each pair = three optional selections and four equipped abilities.
- Finalized choices are permanent. Creation, live play and Laws/Races simulation must share definitions
and selected-ability identity/version, with real authority for execution/passive triggers.
- Class/Heritage HQ owns authoring, unresolved numbers, pairing/finalization semantics and compatibility;
Combat owns shared authority/timing/consequences. This task does not author175 abilities or approve example
numbers. Stable heritage IDs and existing heritage/class grants remain until an explicit compatibility
decision; no production migration or automatic removal/replacement of existing grants.

| Capability | Reusable current boundary | Missing engine / ownership | Smallest bounded follow-on |
|---|---|---|---|
| Permanent loadout validation/finalization |25-row heritage registry; P5/P6 scoped drafts/save; existing grants/access contracts | No authoritative exactly-one-per-pair/permanent finalization receipt; **Class/Heritage +shared authority** | Freeze one definition-set/version and pure validator, then one immutable finalization command/compatibility decision; no backfill migration |
| Selected ability identity/version | Stable heritage IDs, authored definition/hash groundwork (A1a), P7 exact provenance | No installed trusted ancestry definition/loadout registry; **Class authoring +Combat admission** | Exact core/pair/choice IDs and content hash interface, preserving legacy grants; installed admission only under separate authorization |
| Active AP/HP consequences | P7 atomic actor CAS/receipts; named P9/P12/E1a paths and domain resource owners | No arbitrary ancestry execution; **Combat**, with **Class** authored prices/results | One named ability with exact consent, retained roll and typed price/result witnesses; no direct client HP write or racial payment service |
| Conditions/temporary effects | C1–C3 shared definitions/controller/records; C4 bounded authenticated timing (only after delivery) | Other effect profiles/durations/source admission; **Combat**, shared source contracts | One source-supported canonical condition adapter or one reviewed timing profile through the same P7/timing owner |
| Turn-triggered regeneration | P7 common-pool result admission; combatStore currently proposes manual resource results | No accepted exactly-once authored recurring trigger/price semantics; **Combat +Class rules** | One regeneration definition/occurrence/idempotent AP/HP command, separate from C4 expiry; no client tick claiming an authoritative trigger |
| Suppression/stacking | Structured effects and narrow Inquisitor assistance adapter; independent condition sources | No general suppression order/stack groups; **Class rules +Combat** | Freeze one named interaction and structured rule; presentation buff/debuff labels do not define stacking |
| Movement/environment predicates | Exact actor refs, C2 voluntary-movement guard, advisory B1/B2 geometry | No authoritative environment/LoE/water/light/terrain predicates; **map/Combat +Class** | One settled predicate with authoritative source/freshness and manual unknown state; no inferred racial bonuses |
| Uses/recharge | Typed class resource banks, P7/P9 approved domains; cooldown metadata | No general ancestry uses/rest/recharge boundaries; **Class resource domain +Combat events** | One finite counter with conservation and one approved recharge event; no separate racial timer or rest guesses |
| Reaction eligibility | P13B private collection; original E1a Riposte only | No general trigger detection/eligibility/order/reservation executor; **Combat**, **Class** source rules | One named authenticated parent/eligibility/consent/result adapter with explicit manual gaps |
| Simulator/live calculation parity | Shared pure rule/domain helpers where actually consumed; Laws/Races authored displays | No complete ancestry mechanical calculator/live admission parity; **Class/Heritage +shared** | One pure versioned capability calculation used by both simulation and admitted live profile, with parity tests; simulation alone proves no authority |

**Non-claims / protected boundaries:** P13B collection is not a general automatic reaction executor.
Original named P9 alone does not admit Wizard records; P14-A1 now installs only its bounded immediate
damage/healing shape. A1a compilation alone is not live authority; historical **A1b remains parked
outside P14-A1**. Current manual expiry cannot support automatic racial-effect expiry claims;
C4's exact named profiles do not automatically admit ancestry effects. Mitigation order, Evasion/caps
and environmental rules remain unresolved/manual where already documented, not implicit ancestry rules.
One shared definition/application/mechanics/timing/recurrence/presentation separation is required across
token, sheet, GM and Spell/Creature/Item Wizard authoring surfaces. Those authoring surfaces may retain
unsupported metadata but must not advertise it as executable. No second effects/admission/payment engine.

## 9. P14-A1 delivered shared-capability handoff

| Interface / owner | Delivered boundary | Future producer obligation |
|---|---|---|
| Preserved authoring record / Class producer | Whole Wizard draft + outer record; exact prices/range, inactive defaults explicitly checked, conflicts/manual reasons | Embedded editors preserve their complete source and positively map one admitted shape; never silently strip secondary effects |
| Pure capability mapping / shared Main+Class | `authoredAbility.definitionFromWizard(record,{roomId,definitionVersion,classId})`; `readFormula` yields existing roll input | Laws simulations reuse this pure vocabulary/calculation boundary, without granting authority or creating another resolver |
| Immutable definition / unchanged A1a | Exact room/UUID/sequential version/hash, existing binding IDs, strict compiler and validated registry history | New class/ancestry eligibility/bindings need separate reviewed contracts. Package inclusion, loadout selection and a display name do not admit execution |
| Installed authority / Main HQ | Current GM `actor_authored_admit/revoke/list` within existing P7 context/writer; protected room-owned registry | Reuse this installation/revocation/status interface. Local save and writer admission are separate transactions; do not claim cloud confirmation |
| Consent/execution / Main HQ | Existing P9 approval/roll/custody/adjudication plus P7 temp-first AP/mana+HP/receipt; exact primary PC source and one PC/creature target | Producers reuse installed refs and the same usable action surfaces. Acting-creature sources, typed new resources and additional recipients/components need named extensions |
| Result/recovery / existing P7/P9/P13A owners | Original-byte retries, epoch/receipt recovery, matching personal projection and accepted-only narration/HP feedback | Keep unknown blocking and owner privacy; no local fallback debit, automatic reconnect submission or parallel replay ledger |

**Producer extension delivered:** P14-A2 below adds Item Wizard authoring/access for the same shape and
existing source eligibility. Future damage+conditions, self-costs/multiple components, specified-duration periodic
changes, expiration outcomes, suppression/stacking/recharge, reaction chains, obstruction/propagation
and environmental/tile predicates remain in roadmap §14. Class/Heritage owns its content,175 potential
definitions, selection/finalization and legacy compatibility; Main HQ owns shared execution. No new
Gambler/Fate Weaver/Chaos Weaver/ancestry admission, racial numbers/regen/edge grants, ID rename or migration.

## 10. P14-A2 Item producer ownership and Creature Wizard handoff

[Frozen boundary, implementation and evidence](MYTHRILL_PROJECT_14_A2_CONTRACT.md) ·
[bounded independent acceptance](MYTHRILL_PROJECT_14_A2_ACCEPTANCE.md).

| Seam / owner | Delivered / protected boundary |
|---|---|
| Item producer / Main HQ | `ItemAbilityEditor` + pure `itemAuthoredAbility` helpers; complete detached Wizard record in `item.authoredAbility`, UUID retained, optional library-ID provenance only; no name substitution |
| Normal item persistence/access / Main HQ | ItemWizard/ItemLibrary save/reopen/manual-field preservation, exact detached inventory copies/no association stacking, keyboard selection and real Inventory item launcher; template/instance/definition/version/approval/command IDs distinct |
| Reused A1 interfaces / shared owners | `definitionFromWizard`, normal `AuthoredAdmission`, trusted installed room list/version/ref, exact canonical match and `routeSpellCast`; existing P9 consent/custody/retained rolls/P7 payment+HP/P13A feedback, no item-only engine/storage |
| Protected execution inputs / Main HQ +Class | A1a compiler/tests/fixtures, W1 resource editor/manager/serializer, A1 server authority/payment/installed registry/custody bodies unchanged; current primary owner/class/Stunned/revisions/installed-version checks remain authoritative |
| Class/Heritage and RI-2 owners | Content, compatibility, permanent ancestral selection, grants/IDs/resources remain their tracks; no additional reconstructed-class/ancestry binding, migration or tuning |
| Future Creature Wizard producer / separate bounded contract | Can reuse compact whole-Wizard record editor/snapshot and pure adapter/admission interfaces. This delivery still has an owner-PC source; creature-origin execution needs exact new source-authority validation, not a producer button |

Association is authoring/access only, **not possession/equipment/holding/charges/consumption entitlement**.
GM adjudicates unsupported item requirements/effects. Original mixed/passive/on-hit data remains intact/
manual; only an explicitly separate supported activated definition can enter A1. Edits require explicit
re-admission; installed history and other item copies do not silently change. Lost ACK uses shared custody.

One review repaired F1–F4 and accepted final bytes. Build3/App10 pass at recorded identities, qualified by
five fetch errors and unrelated persistent P13 disconnected notice visibly overlaying upper Inventory
after fixture rejoin. This does not close P13/live-network/physical-device/cloud/deployment gates or
reopen accepted phases. All initial concurrent Class/Heritage/RI-2/A1/C4 work is retained.

## 11. P14-A3 Creature producer and separate source-authority handoff

[Delivered producer](MYTHRILL_PROJECT_14_A3_CONTRACT.md) · [acceptance](MYTHRILL_PROJECT_14_A3_ACCEPTANCE.md).

| Seam / owner | Delivered / protected boundary |
|---|---|
| Whole-record producer / Main HQ | Optional creature.authoredAbility uses A2 snapshot schema/pure helpers/shared CompactForm. No item-specific entitlement, new format or legacy-ability conversion. Missing/duplicate Spell Library IDs visibly unselectable |
| Creature persistence / Main HQ narrow slice | Whole existing abilities/unknown/null/zero/malformed data retained on Edit/save; session drafts keyed by exact creature/account, Cancel removes them. No schema/catalogue migration; reload durability not added |
| Instance isolation / existing creature store | Duplicate/store-add/placement detach association; template updates retain unrelated propagation but exclude authoredAbility and token ID; placed Inspect explicitly reads instance including absence |
| A1 authority / shared Main+Class | Existing adapter/GM admission/version/hash and binding vocabulary unchanged. All22 reused A1 dependencies match accepted A2; seven protected identities match. No creature Cast/Use control, fake owner, local payment or partial execution |
| Class/Heritage/RI-2 / existing owners | Wizard/export targeting preservation, reconstructed classes, permanent ancestral selection, content/grants/IDs/resources remain those tracks; no maxTargets:0 or conflicting-schema reinterpretation |
| Follow-on source authority / Main HQ with Class compatibility | [A4 preparation only](MYTHRILL_PROJECT_14_A4_SOURCE_AUTHORITY_CONTRACT.md): exact placed-source GM permission, existing AP/mana/P7/P8/A1 custody; proposed creature-only first target subset; PC-owner blocking/consent separately frozen |

Build1/App9 prove bounded production workflow/no spend/no HP/no receipt/PC-only creature refusal;
same reviewer independently ran8 repair probes, appraised implementer build/App. Later unrelated
Inventory/CreatureToken/TargetHUD overflow edits are preserved, not accepted/built by this slice.
Fixture/live-only,1 fetch error and partly-scrolled horizontal viewport limits remain explicit.
