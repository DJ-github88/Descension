# P7 — Actor Instance Consequence and Condition Contract

**Status: FROZEN V1 — coordinator C1–C6 dispositions applied 2026-10-13.**
Implementation is authorized within the executable freeze below. Implementation
and independent acceptance are separate; this document does not self-accept P7.
Prepared 2026-10-13 in `D:/VTT`, branch `master`, HEAD
`620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`, against the intentionally dirty
worktree. This task preserves P6 acceptance and specifies the **original P7**.
No commit, push, deployment, P8/P9 controller or P11–P14 work is authorized.

## V1 executable freeze (supersedes proposal wording below)

The original proposal and source observations below remain historical evidence.
This section resolves its engineering choices before production edits. C1–C6 are
the coordinator's approvals, not newly inferred game rules.

### F1 — exact placement and lifecycle (C1)

- Creature: `gameState.maps[mapId].tokens[tokenId].state` owns current/temp
  HP/mana/AP. PC: `maps[mapId].characterTokens[tokenId].character` owns
  `health/mana/actionPoints.{current,max}` and the three `temp*` fields.
  Both own individual records at `state.conditions` and metadata at
  `state.actorContract = {version:1,instanceId,revision,kind,roomId,mapId,
  tokenId,ownerUid?,characterId?,primary?,bindingProvenance}`.
- Metadata is server-authored. Exact refs include every identity field;
  revisions are nonnegative safe integers, incremented once per changed actor.
  Definitions, room players, root mirrors, party and combat resources are views.
  Mirrors never originate resource writes. Maxima remain build/domain-owned.
- `actor_bind` explicitly binds an existing map token. PC canonical ownership
  is checked with the real `getCharacterOwner` boundary; legacy session/name
  guesses are insufficient. A content fingerprint fences asynchronous binding.
  Root/nested conflicting legacy values require explicit `selection` and raw
  recovery retention. `map.creatures` adapts only an exact selected ID without a
  collision; original bytes are retained as a recovery candidate.
- Exactly one primary per **room + owner + canonical character**. Extra PC
  tokens stay visible but cannot mutate protected fields (`secondary_attachment`).
  A new primary requires explicit replacement of the exact old primary ref;
  old metadata is invalidated. No cross-room lock or resource-sharing rule.
- Position movement retains identity/revision. Deletion invalidates the ref;
  token-ID reuse receives a new incarnation. Cross-map relocation/rebinding
  requires explicit removal/recreation/binding; no other-map lookup. Inactive
  owner projections remain token views and do not modify the open personal sheet.
  Owner reconciliation requires explicit active attachment selection; competing
  projections are preserved for selection, never auto-selected by UID/name.

### F2 — checkpoint/replay fields (C6)

`gameState.actorConsequences = {version:1,admissionEpoch,commitSequence,
replayFloor,receipts:[ReceiptV1...]}` is the only durable receipt container.
Each runtime uses a fresh UUID admission epoch tied to its exact room object and
process lease identity. Recovery never resets sequence/floor/retained receipts.
The fresh epoch is advertised for new proposals and written with the next
accepted snapshot. A known old durable receipt is looked up **before** fresh
epoch/revision checks, under current entitlement. Unknown old epoch commands
return `outcome_unknown`; they never execute. Live memory is not crash-durable.

`ReceiptV1 = {version:1,roomId,commandId,submitterUid,contentHash,
admissionEpoch,commitSequence,checkpointRevision,actors:[{ref,beforeRevision,
afterRevision,finalResources,conditions}],authorization:{kind,authorizerUid,
proposalId?},acceptedAt}`. Final resources are full common-pool projections;
conditions are resulting individual records. `checkpointRevision` is P2's actual
allocated snapshot revision, not actor/sequence/lease/P6 identity. Receipt bytes
are immutable. Confirmation is computed separately from writer confirmed revision
or the validated loaded checkpoint: `accepted-live` versus `checkpoint-confirmed`.

Receipts use `(roomId, authenticated submitterUid, commandId)` namespace.
Hash = SHA256 UTF-8 of recursively key-sorted JSON of the complete strict command,
with ordered arrays, all refs, revisions, epoch/base sequence and adjudication.
Unknown fields, coercion and sanitizer-induced content changes are refusals.
Command UUID is captured once before submission; timeout retains that proposal.
Authenticated owner proposals awaiting GM authorization are bounded process-memory
records; GM accepts their exact immutable hash, never substituted content. Source
permission and current GM authority are rechecked at acceptance.

At most 256 receipts / 512 KiB UTF-8 JSON of retained receipts, subordinate to P3.
Only a confirmed oldest prefix may be pruned. Pruning advances `replayFloor` to
the greatest removed sequence in the same staged checkpoint. Unknown current
epoch commands require `replayFloor <= baseCommitSequence <= commitSequence`;
below floor is `retry_window_expired`, future is `invalid_consequence`. An unknown
command inside the window is new admission; retained IDs conflict on changed
content. Never prune unconfirmed receipts to make a command fit; refuse
`receipt_capacity`. There is no wall-clock eviction/re-execution policy.

### F3 — real writer admission and atomicity (C2/C6)

The inspected P2 API is `queueWrite -> _enqueue`: clone, allocate revision,
tracked-room allocation, `_reserveRetainedSlot`, then retain. Serialization alone
does not reserve capacity. P7 adds a **consequence-specific synchronous admission**
method on the existing writer. It prepares the exact revision-bearing snapshot,
uses P3 `buildCheckpointDocuments` byte/operation checks (including the P4 fence
operation), and successfully retains it through `_enqueue` before installing
live state. Installation and status publication are synchronous with no await or
flush between them. Admission failure installs nothing. No general transaction
platform, reservation registry, WAL or separate receipt document.

Before this boundary, all actor resources/records/mirrors/receipt are staged and
validated. After every external await recheck exact room/player/principal,
membership/delegation, originating process lease and actor revisions. Async cloud
failure **after** acceptance retains the same snapshot and shows unsaved status;
it does not replay/refund the command. Backend metadata races or SDK rejection
remain honest post-acceptance checkpoint failures under P2/P3, not durable proof.

P7 executable actor entries accept **only** final HP/mana/AP current/temp and
condition operations, at most source plus one target / 32 operations / 64 KiB
UTF-8 serialized command. No arbitrary `classResource`/payment JSON. The staging
boundary is bounded actor-entry preparation before snapshot admission. Future
P9 must introduce a named typed source-owned payment result there, define economic
validation (shape/revision checks alone are insufficient), and bind source-owner
approval and GM adjudication to the same immutable proposal/checkpoint. Payment
atomicity is deferred and is not proved by P7. P7 chooses no payment order;
creature temp-first and both existing PC casting policies stay domain-owned.
PC temp affordability/consumption is explicitly a P9 product-rule decision.

### F4 — typed condition and receipt privacy (C5)

Accepted individual condition shape preserves existing authored fields:
`{version:1,id,recordId,conditionKey,originalName,name,type,kind,target,
targetId,targetType,source,sourceEntityId?,effectOrigin?,isMagical?,icon?,color?,
description?,effectSummary?,effects?,duration?,durationType,durationValue?,
remainingRounds?,startTime?,endTime?,stackable?,hasOverTimeEffect?,overTimeType?,
overTimeFormula?,overTimeElement?,tickFrequency?,tickFrequencyValue?,
tickFrequencyUnit?,clockBoundary?,sharedTiming:'manual'}`.
Ref-valued `target` is exact. Source is authored scalar provenance; actor
provenance may use separately typed `sourceActor`. Numeric modifier allowlist:
strength/agility/constitution/intelligence/spirit/charisma, armor,
damageReduction, movementSpeed, healthRegen/manaRegen, maxHp/maxMana/maxAP,
attackBonus/damageBonus/saveBonus. Unknown/private legacy fields are retained in
private `legacyRaw` recovery bytes, excluded from public records and receipts.
Unknown newer records stay preserved/read-only. Public icons use P4 approved
asset projection. Public records expose only the above typed fields and known
numeric modifiers; no private blob projection. Private recovery is available
only to matching owner/GM through an entitled explicit recovery read.

Aliases `slow/slowed`, `haste/hasted/hastened`, `defend/defending` identify/display
only; authored −10ft does not become catalog half-speed. Exact IDs drive updates
and removals; non-stackable replacement is explicit remove+add. Rounds (including
zero) and absolute start/end clocks are stored without conversion/reset/filter.
No shared timeout, overtime, expiry or round decrement; hydration uses setState,
never gameplay mutators. Local sandbox timers remain local.

Public receipts expose identity, authenticated authorization, final common pools,
typed public records, sequence and checkpoint status. They exclude legacyRaw,
private drafts/class banks/inventory/notes. Explicit private recovery reads are
separately entitled and never room broadcast.

### F5 — permissions, legacy capability and turns (C4)

GM authorizes new foreign-actor consequences. Verified owner/exact map delegate
may authorize permitted manual actor changes. Turn advancement remains under the
existing cooperative policy and `COMBAT_AUTHORITY_ENFORCEMENT` is unchanged.
Permission to advance is not permission to alter foreign resources. Turn-domain
final AP/regen results use exact refs; denied/unbound results are visibly
`awaiting_authorization`/`binding_required`, never presented as applied. Accepted
results update that recipient's token/party/combat projection; the open sheet only
updates for the explicitly active matching owner attachment/account generation.

Legacy flat/nested token/creature/PC resource/condition envelopes, full character
refresh, peer token collections, map/combat envelopes cannot replace protected
fields or metadata of a supported actor. Reject `actor_consequence_required`
before mutation/relay. Unrelated movement, portrait and build editing keep their
existing permissions. Adapt actual manual producers with a stable command and
expected revision; unsupported legacy clients receive a capability error.
Max/build edits invalidate pending proposals when their resource bounds change.

### F6 — frozen acceptance extensions and intended file boundary

The A1–A11 rows in §10 remain mandatory, with these concrete additions:

| Case | Required extension |
|---|---|
| A1 | Secondary PC token refuses; replacement/delete/reuse/move invalidates old refs; no global cross-room lock; ambiguous owner selection preserves both candidates. |
| A2 | Real registration plus immutable owner-proposal/GM hash binding; membership/delegate/principal/room/lease recheck after ownership/backend awaits; no unauthorized receipt/recovery delivery. |
| A3 | Real writer tracked/retained capacity refusal before live mutation; no source/target/receipt partial installation; bytes and P3 limits measured. |
| A4 | Per-principal namespace/hash conflict; confirmed-prefix pruning; pending receipt refusal; replay floor/future base; durable known retry versus fresh admission epoch unknown outcome. |
| A5 | Flat/nested sibling and peer hydration injection; portrait/movement still work; PC canonical ID refresh cannot adopt foreign attachment; bounds edit stale proposal. |
| A6 | Exact checkpoint fields and actual allocated writer revision; live/unconfirmed/restart/confirmed distinctions; P3 classified round trip and failed writer retention. |
| A7 | Typed public/private projection, authored −10ft, unknown raw recovery, exact record IDs, round zero/absolute clocks through local/room/personal paths. |
| A8 | Remote PC turn AP/regen and consistency repair; cooperative non-controller advancement leaves pending consequence; authorized recipient only. |
| A9 | Mounted exact active attachment selection; same UID different character/competing room; delayed personal load/save/import/account generation; preserve drafts and latest P6 status. |
| A10 | Shared condition hydration/polling/ticks/decrement produce zero resource/outbound effects; repeated receipt/snapshot cannot roll back newer actor; local sandbox remains functional. |
| A11 | Pre-adjudicated Feather Slash, Slug and Restorative Prayer final common pools only; explicit physical already-resolved note; no P8/P9 controller/payment claim. |

Starting checkout identity and immutable production snapshot:
`vtt-react/verification/p7/evidence/before.json`, `starting-source.json.gz`.
P6's 266 accepted behavioral dependencies match at start; concurrent styles and
document drift are recorded separately and preserved. P6 acceptance remains
attached to its reviewed hashes. New bytes require focused regressions/review.

Intended behavioral edits: server `services/{syncService,validationService,
sanitizationService,rateLimitService,roomAccessService,actorConsequences}.js`,
`handlers/{socketHandlers,tokenHandlers,characterHandlers,combatHandlers,
environmentHandlers,actorConsequenceHandlers}.js`; frontend
`services/{actorConsequenceService,silentRoomHydration,effectProcessingService}.js`,
`store/{creatureStore,characterTokenStore,conditionStore,combatStore}.js`,
`store/characterSlices/resourceSlice.js`, `hooks/useCharacterPersistence.js`,
multiplayer socket registration/appliers and manual HUD call sites as necessary.
Focused tests/witnesses under `server/tests`, frontend service/persistence tests,
`verification/p7`; this contract, implementation report and engineering ledger.
No styling/content/rules/class-payment/casting-controller edits are intended.

**Frozen before production changes.** Negative production witnesses execute
against the captured starting bytes before their fixes and retain raw outcomes.
Real-backend/staged gates are distinct from source simulation; all nine P5
environment gates remain outstanding. Independent acceptance, not this freeze
or implementation agent, establishes the P7 verdict.

## 1. Authority, evidence and scope

Read completely: `AGENTS.md`, `CLAUDE.md` and all 1,409 lines of
`MYTHRILL_NEXT_PHASE.md`. Governing roadmap sections: §§11–13, 18, 21 H8/H9/H10,
§26 Projects 7–9, §§27–31. P3's checkpoint freeze and P4's approved H1/H2/H14
policy are dependency contracts, not replaced by this proposal.

Evidence labels throughout:

- **Accepted**: existing independent acceptance or approved roadmap/policy.
- **Source fact**: inspected current source/data, not a live deployment claim.
- **Proposed**: choices offered for coordinator approval, not established law.
- **Unresolved**: demonstrated ambiguity needing an explicit decision.

**Accepted P6**: complete immutable independent PASS report:
[`MYTHRILL_P6_CONTAINER_INDEPENDENT_ACCEPTANCE_20261012.md`](MYTHRILL_P6_CONTAINER_INDEPENDENT_ACCEPTANCE_20261012.md).
Source identity, historical supersession ledger and nine outstanding P5 gates:
[`ENGINEERING_STATE.md`](ENGINEERING_STATE.md). Before documentation changes,
all **12,175** inventoried files matched the independent `after.json`, including
accepted runtime/witness bytes and concurrent styling. Full hashes are retained
under `vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/`.
Those inventories also identify the production paths inspected below. HEAD
alone does not identify the independently accepted uncommitted P6 source.

**Original P7 boundary**: typed instance addressing; authorization; expected
actor revision; one accepted, retry-stable final HP/mana/AP and condition command;
atomic source/target state and receipt; explicit legacy adaptation; correct
turn-resource recipient; silent reconstruction and matching owner reconciliation.

**Dependencies**: P1–P4/P6 for integrated multiplayer claims. After contract
review, pure local adapters/fixtures may be developed without cloud operation.
Source presence of those dependencies does not establish staged readiness.
P8 remains the Feather Slash slice; P9 remains immediate single-target DICE
damage/healing through both cast surfaces. P11–P14 remain provisional; the
original roadmap defines ten projects and this document assigns no new scope
or approval to later numbers.

**Non-goals**: universal combat/entity/effect resolver; dice or attack rules;
AC/standard-save substitution; mitigation law; generic class-resource scalar;
new condition authoring schema; automatic condition ticks/expiry consequences,
reactions, channeling, zones, anatomy, behavior/AI, VFX or historical replay.
ROAD, Prism, initiative/AP modes, active defense, class ownership, inventory
geometry and rendering are protected. No framework/dependency replacement.

## 2. Actual source position and production owner map

Paths beginning `src/` below are under `vtt-react/`. Anchors are inspection-time
line numbers. These are P7 contract gaps, not proof of new P5/P6 regressions.

| Inspected production path | Source fact / contract implication |
|---|---|
| `server/handlers/socketHandlers.js:60–97,694+`; `services/roomAuthorityService.js:88–141` | Registered authoritative room events already pass a fresh backend/local authority guard. Exact lease token binds room, process instance and authority generation; ACTIVE/QUIESCING/FENCED differ. Reuse, do not elect a browser or replace lease ownership. |
| `server/handlers/tokenHandlers.js:133–199,323–373` | Existing map lookup and verified UID owner/GM/exact scoped delegation checks exist. `token_updated` selects `updates || stateUpdates`, then spreads at token **root**. Identity/ownership keys are protected; HP/mana/AP/conditions have no actor revision/receipt contract. |
| `server/handlers/environmentHandlers.js:91–140` | `creature_updated` expects `creatureId`, applies existing token authority and spreads updates at `map.creatures[id]` root. Client emits/consumes `tokenId/stateUpdates`; that sibling envelope is not interchangeable. |
| `src/store/creatureStore.js:231–246,364–418`; `src/components/multiplayer/socketHandlers/tokenHandlers.js:251–280` | Instances have `id`, definition `creatureId`, map and nested `state`; `tokens` mirrors `creatureTokens`. Store/receiver put resource changes under `state` and emit both legacy families. Definition-wide `updateCreature` is distinct and must not damage all instances. |
| `server/handlers/tokenHandlers.js:503–664`; `src/store/characterTokenStore.js:109–126,288–319,326–385` | Server stamps owner UID and session player ID, keeps a `character` snapshot and nested `state`. Character snapshot refresh carries resources. Client local identity heuristics include aliases/socket/name. No mandatory immutable owner+canonical-character+instance binding currently exists. |
| `server/handlers/characterHandlers.js:89–185,223–338` | Resource delta edits sender `player.character`; full resource update permits GM/self and uses session/socket lookup. `character_updated` can replace resource fields. These queue `room.gameState`; the changed player object is not itself a canonical per-instance resource write. P7 must mirror accepted state deliberately, not assume queueing saves player mutations. |
| `src/components/multiplayer/socketHandlers/characterHandlers.js:15–150` | Self and party matching include UID/socket/session IDs and **display name**, without canonical character ID/revision. A matching UID alone cannot mean the currently open sheet is this actor. |
| `src/components/hud/PartyHUD.jsx:2817–2986`; `TargetHUD.jsx:1088–1303,1899–2058` | Manual HUD controls call character/creature resource mutators and emit full resource envelopes; condition edits also call token state mutators. These are actual P7 migration entry points, not just hypothetical future casts. |
| `src/store/combatStore.js:296–585,1249+`; `server/handlers/combatHandlers.js:161–210` | `nextTurn` calculates initiative/AP in the combat domain, then updates whichever local character store is open for any character combatant; party mirror uses `current-player`. It attempts round decrement at outgoing target turn end and invokes local overtime. Server turn change updates index/round but broadcasts its existing turn order. Correct recipient/result application is P7; no new initiative or scheduler policy. |
| `server/services/combatAuthority.js:24–113` | Current turn authority enforcement is optional via `COMBAT_AUTHORITY_ENFORCEMENT`; unset means cooperative member transitions. H9 needs explicit confirmation for new cross-actor commits; this proposal does not toggle/redefine all combat permissions. |
| `server/services/roomCheckpoint.js:66–118,261+`; `syncService.js:504–602` | P3 canonicalizes JSON-safe full global/map snapshots; P2 captures newest full snapshot and allocates checkpoint writer revision separately from confirmation. No actor command ID, per-actor revision or consequence receipt exists in the inspected mutation paths. Checkpoint ordering is not action deduplication. |
| `src/services/silentRoomHydration.js:360–375,477–611`; client `combatHandlers.js:66–73` | Existing recovery directly replaces stores/conditions without start/next-turn replay. Keep this seam. It projects creature `maps.tokens`; `maps.creatures` needs an explicit supported-instance adapter rather than a second actor owner. |
| `src/store/conditionStore.js:65–101,227–263,439–570` | Records include generated ID/source/target/polarity, rounds and absolute clocks. Non-stackable replacement matches name+target; token mirror upserts/removes by name. Round records intentionally lack `endTime`, but local partialize subtracts `endTime` for **all** records and filters by duration: round records can disappear. |
| `server/handlers/characterHandlers.js:346–392`; client `socketHandlers/conditionHandlers.js:7–40,125–168` | Producer sends `{type,data,roomId}`. Server persistence instead expects token+buff/debuff or dictionary. Relay may show an effect without storing the same individual record. A token-keyed singular value cannot represent multiple effects on an actor. |
| `server/services/roomAccessService.js:603–606,789–800,917–969` | Positive privacy projections are intentional. Condition projection omits `remainingRounds`, `endTime`, `effects`, source-entity/target identity and overtime settings. Class projection omits note banks, Martyr ledgers, Pyro Debt Call and other domain structures. New reviewed typed projections must preserve required fields without allowing arbitrary/private blobs. |
| `src/hooks/useCharacterPersistence.js:34–90,123–137`; `src/services/firebase/characterStateService.js:36–119,147+` | Accepted personal hook snapshots resource/class state and entire active condition lists, applies loaded values to the selected owner sheet; runtime service spreads retained payload, serializes writes, and uses `lastWriteToken`. P7 must add a room-projection boundary for selected fields; P6 edit revision/write token is not an actor receipt or authority epoch. |

No current deployed actor data was queried. No broad audit or accepted P5/P6
behavioral replay was required: the independently reviewed bytes match, and no
concrete new regression was demonstrated. Existing graphify output was absent;
inspection used actual producers/consumers. No new external-library API was used.

## 3. Proposed actor identity and canonical placement

The following is contract notation, **not runtime code or a new entity registry**:

```text
CreatureRef = { kind: creature, roomId, mapId, tokenId, instanceId }
CharacterRef = { kind: character, roomId, mapId, tokenId, instanceId,
                 ownerUid, characterId }
ExpectedActor = { ref, expectedRevision }
```

- `tokenId` is the placed instance, never `creatureId` (library definition).
  `instanceId` is server-assigned incarnation metadata: deletion/reuse of a token
  ID cannot make a pending command address a replacement. Lazy registration of
  old instances is explicit/versioned, preserves old bytes and records provenance.
- Character ownership/ID comes from a verified owner-bound character attachment,
  not a supplied name or socket ID. The matching token owner UID, canonical
  character ID and room attachment must agree. A legacy snapshot with no stable
  character ID remains manual/recovery-needed until owner/GM explicitly binds it.
  No name-matching migration or foreign-character adoption.
- New commands require explicit room/map/kind and exact incarnation. No search
  across maps, nearest-token fallback, `player`, `current-player`, `local_player`,
  `local-player`, session ID or UID-only shared address. A local UI alias may be
  resolved before proposal only when the active verified binding is exact.
- **Proposed placement**: creature resources and records at
  `gameState.maps[mapId].tokens[tokenId].state`; PC resources at existing
  `maps[mapId].characterTokens[tokenId].character.{health,mana,actionPoints,...temp}`;
  PC condition records at its `state.conditions`. A small versioned
  `state.actorContract` contains incarnation, owner/character binding where
  applicable, and actor revision. Public outbound projection names these fields
  explicitly. Do not pass the whole raw character or private inventory/notes.
- `map.creatures` instances are lazily classified/adapted to the same creature
  instance seam. Do not mutate a definition or silently merge colliding records.
  Legacy root resource values versus nested `state` conflicts are preserved;
  trusted revision/provenance or an explicit GM choice selects current values.
- `room.players`, GM character, party HUD, combat timeline and root token mirrors
  are derived views of accepted instance fields. Updating them must never create
  another payment, increment a revision again or feed a stale sheet back into
  the actor. Preserve unrelated fields and owning-domain maxima.
- **Proposed first PC boundary**: one active room resource attachment per exact
  owner/character, with tokens as projections of that attachment. A second
  conflicting attachment is refused for mutation, not guessed independent or
  silently shared. Multi-token/room semantics require coordinator choice (§9).
  Off-table canonical editing remains player-owned.

## 4. Proposed authorization and final-value command

```text
ActorConsequenceV1 = {
  version: 1, roomId, commandId, actionEpoch, baseCommitSequence,
  source?: ActorRef, target?: ActorRef,
  actors: [ { ref, expectedRevision,
              finalResources?: { hp?: {current,temp}, mana?: {current,temp},
                                 ap?: {current,temp} },
              conditions?: [add | remove | update] } ],
  adjudication?: { proposalId, definitionId, definitionVersionOrHash,
                   chosenResult, finalAmount, adjustmentReason }
}
```

**Proposed bounds**: one manual actor, or at most source+one target; same-actor
self-heal is one actor entry, one expected revision and one increment. At most
32 condition operations and 64 KiB per command; coordinator confirms limits.
No arbitrary property paths, unrestricted JSON patch, resource names or third
actor. Schema admits only known versioned fields; invalid/unknown executable
command fields produce an error, never sanitizer-based silent success.

| Operation | Proposed admission |
|---|---|
| Single actor manual final resources/conditions | Existing verified owner/delegate/GM controls, exact map-scoped delegation; PC changes bind owner+character; delegate scope never transfers canonical sheet ownership |
| Creature source→target action / uncertain cross-actor effect | Current authorized GM adjudicates; source controller may propose, but delegation alone does not confer authority over a foreign target |
| Character spell source payment | Owning class/cast domain prepares and owner authorizes its own price/result; cross-actor effect requires matching GM adjudication; §9 payment decision precedes P9 wiring |
| Missing GM | No new cross-actor automated acceptance/election; manual cooperative use and permitted self edits follow room policy; H9 is not silently settled for all combat |
| Revoked membership/delegation, fenced authority, foreign room/map/actor | Reject before any mutation, persistence admission or result delivery |

Use current verified socket UID/membership and exact captured P4 authority token.
Add the bounded event to the real registration/schema/sanitization/ack/rate-limit
stack. After any asynchronous authority/admission check, recheck the same room
object, principal, membership, delegation, originating authority token and all
expected actor revisions before publication. Never acquire a successor lease
for old work. Ack is returned exactly once with a typed result/error.

The command contains **already-final** current/temp values. P7 validates finite
nonnegative values against known owning-domain bounds and serializability;
reject invalid values instead of silently clamping, coercing strings or replacing
NaN. Preserve zero, unchanged pools, max values and unrelated actor state.
P7 does not subtract a formula, decide absorption/overheal, consume temp first,
round damage, calculate class gain, impose new AP caps or decide death rules.
Domain/GM prepares the final split. Ordinary maximum/build edits stay in their
owner path and invalidate pending commands if their relevant actor state changes.

**Close alternate protected-field writes** in `token_updated`,
`character_token_updated`, `creature_updated`, `character_resource_delta`,
`character_resource_updated`, `character_updated` and bulk token/map/sync/turn
envelopes where they can replace supported actor fields. Existing controls adapt
documented payloads to this seam with explicit revision/command identity.
Unsupported old clients may display/manual-play but must receive a capability
error for protected writes; never manufacture a fresh command ID on each packet
or bypass ordering because the sender is GM. Unrelated portraits/movement/map
edits retain their existing owner paths. No general map/renderer rewrite.

## 5. Proposed atomicity, revisions, receipts and reconnect

Keep four identities distinct: **actor revision**, **consequence commit sequence**,
**P2/P3 checkpoint revision**, **P4 authority lease generation**. P6 edit revision
and personal write token remain separate. Event sequence and time are not CAS.

1. Capture a retry-stable client command UUID and immutable proposal before first
   submission; UI confirmation/retry reuses it. Accepted receipt records the
   server-authenticated submitter and any owner proposal/GM adjudication binding.
2. Resolve all exact actors and check every expected revision. Calculate the
   staged final state/condition records/mirrors/receipt in memory without applying
   any mutation. Validate snapshot serialization and supported checkpoint budget.
3. Under one bounded room mutation critical section, recheck the originating
   authority and revisions, then install **all actors plus receipt together**.
   No await between source and target assignments, no optimistic spend followed
   by compensating refund. Each affected actor revision increments once; allocate
   one room consequence sequence. Two simultaneous commands against one revision
   cannot both succeed. Unchanged observers never execute the action.
4. Capture the full resulting room snapshot through the existing P2/P3 writer;
   actor fields, conditions and receipt occupy the **same** checkpoint publication.
   No private browser whole-room writer, separate receipt document or event log.
   Before acceptance, unavailable serialization/admission means all-or-none refusal.
   If cloud fails after live acceptance, keep live state and receipt, show
   accepted-live/unsaved status and retry the same snapshot, not the action.
   Writer retention pressure follows its existing visible loss/recovery contract;
   do not pretend it adds a crash-durable log.
5. Receipt includes command identity/content hash, exact actor incarnations,
   before/after revisions and final bounded actor values/condition operations,
   consequence sequence/epoch, adjudication provenance and original live outcome.
   Checkpoint confirmation is separate status; a later cloud save cannot rewrite
   what action occurred. Outbound receipts are explicit privacy projections.
6. For a retained matching command, return the **same receipt** before comparing
   its now-stale expected revisions; no new state/event/cost/roll. Same identity
   with different content is `command_id_conflict`. Read entitlement still applies:
   kicked/foreign callers cannot obtain the old receipt. New authority may serve
   a durable old receipt under current entitlement without re-executing old work.
7. **Proposed bounded replay window**: persisted action epoch, commit high-water
   and pruning floor, maximum 256 receipts / 512 KiB within P3 size limits.
   Commands carry the server-issued epoch/base sequence from their snapshot.
   Pruning advances the floor atomically with the next state/receipt checkpoint;
   an unknown command below it is `retry_window_expired`, even if actor revision
   happens to match. No wall-clock expiry or infinite history. Refuse new work
   if it cannot fit; never evict a pending receipt then claim durable exactly-once.
8. Restart from the last complete checkpoint restores actor revisions, records,
   receipts and floor silently. A fresh admission epoch distinguishes newly
   admitted work from an old unknown unconfirmed command. A known durable retry
   returns its receipt; an unknown old-epoch retry is `outcome_unknown`, preserved
   for GM reconciliation, **never automatically re-executed under a fresh ID**.
   P2's unconfirmed memory may be lost on process crash. This proposal does not
   promise exactly-once survival beyond confirmed checkpoints.

Failures: wrong room/kind/map/attachment/incarnation → `actor_not_found` or
`actor_binding_conflict`; unauthorized → `forbidden`; mismatched revision →
`stale_actor_revision`; invalid data/version → `invalid_consequence` /
`unsupported_actor_contract`; missing/fenced lease → existing authority code.
Stale/rejected results carry only entitled current identity/revision diagnostics,
not foreign/private state. Refresh/re-adjudication is explicit, never an automatic
rebase of old damage onto new HP. Timeout means **unknown**, not rejected/refunded.

Reconnect/read receipt application is state replacement. Discard older projected
actor revisions in the same epoch; equal revision/different content is a conflict;
revision gaps request exact snapshot. A historical receipt may be displayed once
by ID but must not roll back a newer snapshot to its older after-values.
Client projections of both actors settle before rendering an accepted result.

## 6. Proposed condition record and timing compatibility

Keep existing authoring data and distinction between a status marker and an
effect. Contract notation for an individual boundary record:

```text
{ version, recordId, conditionKey?, originalName, polarity,
  kind: marker | effect | legacy-manual,
  source: { actorRef?, definitionId?, commandId?, originalSource },
  target: ActorRef, presentation: {name,description,icon,color},
  clock: manual | rounds{remainingRounds,durationValue,boundary?}
                | absolute{startTime,endTime,durationValue,durationType},
  existingEffectData?, legacyRaw? }
```

- Record ID is instance identity, not condition name/catalog ID. Create it once
  in the proposal; exact-ID add/remove/update is revisioned and receipt-bound.
  Multiple same-name records can survive when authored stackable. For existing
  non-stackable replacement, the owning condition domain supplies explicit
  remove+add in the **same command**; P7 does not invent a stacking law or replace
  all name-matches on all actors. Token icon lists are projections by record ID.
- Initial explicit alias fixtures: `slow/slowed` → `slowed`,
  `haste/hasted/hastened` → one reviewed display key, `defend/defending` →
  `defending`. Preserve original name/ID/text; alias does not select numerical
  mechanics. Unknown names survive as manual records with a diagnostic.
- **Source timing facts**: the modal converts rounds to six seconds for display,
  sets `remainingRounds`; store round records omit `endTime` and combat attempts
  decrement for the **outgoing target's turn end**. Absolute records use epoch
  milliseconds and browser timeout removal. Overtime uses turn_end/turn/round
  or a browser real-time timer; its round interval is 6,000ms. These are different
  clocks, not permission to reinterpret a round as elapsed wall time.
- Serialize round counters directly, including zero. Never subtract absent
  `endTime`, filter all records by calculated duration, reset start/expiry on load
  or default zero back to one. Absolute clocks preserve exact start/end; expired
  records remain reconstructable until an authorized removal is adjudicated.
- Preserve existing effect modifiers, source/provenance, magical flags and
  overtime settings at reviewed supported paths through local, personal and room
  serialization. Unknown effect data is retained as raw/manual, not executed or
  silently stripped from the recovery copy. Public projection is typed/allowlisted;
  private arbitrary blobs remain excluded.
- P7 introduces **no automatic ticks, round decrement or shared expiry execution**.
  Existing offline/local sandbox behavior stays domain-owned. Shared actor records
  are excluded from peer timeout/overtime mutation; the GM can explicitly update
  a counter/remove a record through the same command. Unsupported shared overtime
  is visibly manual/paused. Later approved clock owners may submit consequences;
  hydration cannot start their timers or advance them. Preserve boundary metadata
  where known; ambiguous old timing stays `legacy-manual` until adjudicated.
- Example raw marker is `CreatureToken`'s `defending` (duration 600000ms);
  corresponding store effect is `defending-${tokenId}`, duration 600 seconds,
  `{armor:2}`. Neither similar name nor unit conversion proves these two records
  should be collapsed. Preserve both candidates and reconcile deliberately.
- Representative authored `arc_frost_touch` uses ID `slowed` but describes **−10ft**
  movement for one round; catalog `conditionsData.js` entry `slowed` describes half speed.
  Boundary alias may preserve the key, never overwrite the authored modifier
  with the catalog text. Numerical adjudication remains condition/GM ownership.

## 7. Owner reconciliation and turn-resource seam

**Proposed**: active room attachment owns accepted HP/mana/AP/condition fields;
owner canonical build/inventory/class domain remains owner-controlled. A matching
owner client applies a receipt/snapshot only when verified UID, canonical
character ID, room attachment/incarnation, actor revision and current P5 account
generation agree. Another owner's actor updates its room token/party/combat
projection, never the locally open character store. Same name or same UID with
a different selected character is not a match.

Integrate at the P6 hook's collection/load/apply boundary: prevent old personal
cloud data, selected draft import, cached sheet refresh and full-character sync
from overwriting attached room-owned fields. Preserve conflicting personal drafts
with their original owner and provenance for explicit reconciliation/export.
Non-room fields remain eligible for normal owner hydration. Room conditions
must not become all-party conditions in the selected personal character snapshot.
Persist only the matching owner's relevant projection, with last-applied room
actor identity/revision recorded separately from personal edit/write-token state.

Room live acceptance, room cloud confirmation, canonical save and personal
runtime save remain **four separate truths**. Failed personal reconciliation
leaves the accepted room outcome intact and the matching owner visibly pending/
failed through existing P6 status. Owner reconnect retries persistence of the
settled projection; it does not re-spend or recast. A newer local owner edit
during save remains retained under P6's exact-edit fencing. No direct server
write to owner-private canonical documents and no cross-account adoption.

For existing turn/AP/manual changes, use the actor ref in the combatant and
apply the combat domain's already-decided AP/regen values to that actor and its
mirrors. The P7 adapter performs no initiative roll or AP restoration calculation.
Fix remote-recipient and consistency-repair paths, not only the happy branch.
Do not call `nextTurn`, `addCondition`, payment or gameplay mutators during
snapshot apply. H9 must settle whether current cooperative turn changes may
also authorize these final resource consequences or need GM confirmation.

## 8. Representative consumers — actual fixtures, not invented scope

### P8 Grimmstalk / Branvig Feather Slash

**Source facts**:

- `public/data/creatures.json:232–299`: definition ID `grimmstalk`, current
  display name **Branvig**; HP250/mana30/AP5 maxima. Numeric smashing resistance50
  and ember vulnerability50. Embedded legacy Skull Stare differs from external
  spell-shaped ability data; don't regenerate/convert the bestiary.
- `public/data/abilities.json:448–494`: `grimmstalk_feather_slash`, single enemy,
  melee10ft, immediate, 1AP/0mana, `2d8 + 5`, slicing, DICE.
- `src/utils/initCreatureStore.js:44–64` overlays advanced abilities by definition
  ID on the loaded creature. `CreatureAbilityFanOut.jsx:67–72` exposes the
  original resourceCost as quick-use `apCost/manaCost`; these bindings preserve
  the selected authored cost without requiring generator restoration.
- `CreatureToken.jsx:1388–1479`: current quick-use confirms costs on this token,
  spends temp AP/mana first and logs chat. No target HP consequence.
  `creatureAbilityUtils.js:184–218` is a card compatibility transform; execution
  must read the pinned original ability and actual quick-use cost binding.

**Accepted roadmap**: two placed creature instances first, explicit source and
target, measured/adjudicated range/defense, one roll/physical result and GM final
amount. **P7 commits** final source AP/current-temp split and final target HP/
temp split plus receipt atomically. **P8 owns** target UI, formula/dice, ability
support, affordability, temp-first payment and accepted-result card/chat.
GM owns uncertain legality/defense/mitigation. Retry cannot reroll/recharge.
Source ID retained as `grimmstalk`; current Branvig name resolves the roadmap's
heading/text naming variation without a rename or canon rewrite.

### P9 actual DICE damage/heal and negative examples

| Actual inspected fixture | What can be prepared by owning P9/domain; what P7 receives |
|---|---|
| `classes/arcanoneerData.js:2150–2201`, `arc_spark_bolt` / Marrow-Piercing Slug | Immediate single target60ft, `1d8 + intelligence/4` arcane DICE, mana4/AP1, exact two Arcane spheres. P9 resolves stat substitution/formula and price; GM adjudicates authored durability-bypass claim/final amount. P7 receives final source common pools and target HP, not a damage formula or two generic sphere points. |
| `classes/martyrData.js:927–977`, `martyr_restorative_prayer` | Immediate single ally30ft, root `resolution:DICE`, `healingConfig.formula:1d4 + spirit`, direct/no HOT, mana5/AP1. Dedicated `devotionGain:1` duplicates nested generic gain1; planner must apply once, not twice. Owner/GM resolves legal ally and amplification; P7 does not infer self-heal eligibility or automatic earned damage. |
| `arcanoneerData.js:2283–2335`, `arc_healing_light` | Name/legacy ID is **not healing**: current Back-Blast Spark Shield is defensive absorb2d8. Manual-only for P9's damage/heal subset; do not rewrite it into HP healing. |
| `arcanoneerData.js:2205–2279`, `arc_frost_touch` | Damage **plus debuff/save/next-hit prose**. Mixed branch needs manual-only diagnosis unless a separately approved partial-support policy explains the unexecuted branches. P7 condition bookkeeping does not make P9 control/reaction execution supported. |
| `minstrelData.js:1527–1580`, Minor Cadence | Immediate DICE healing but **area**. Original scope excludes AoE; payment regression fixture only. Exact I1/IV1 requirements override generic cost3 under the existing bank contract. Don't reduce it to one target to obtain a convenient P9 witness. |
| `minstrelData.js:2305+`, Authentic Cadence | Area and multiple healing/buff/damage branches; not the single-target slice. Card `cadenceToSpell` is a presentation adapter, not permission to erase those branches. |

Both production entry points are `components/ui/ActionBar.jsx:1644–1969` and
`components/character-sheet/SpellActionBar.jsx:935–1249`; both consume
`getManagedSpellResourcePlan`. `useCharacterSpells.js:62–115` adds presentation
aliases to class spells; don't compile support from a lossy card. HUD emits
`targetIds:[]`; receiver `socketHandlers/combatHandlers.js:100–115` logs a notice
with TODO, not effect execution. Sheet spends then rolls/logs. P9 must select
target before accepted payment, keep cancellation free, and present a notice
distinctly from an accepted outcome. This document does not wire those flows.

### Payment contracts that must survive

Source owners: `data/classResourceContracts.js`, `classResourceBanks.js`,
`pyrofiendResourceContract.js`, `apexResourceContract.js`,
`lunarchResourceContract.js`, `toxicologistResourceContract.js`; existing
`data/__tests__/classResourceBanks.test.js` and `classResourceContracts.test.js`
provide concrete compatibility fixtures (inspected, not rerun here).

- Minstrel I–VII contents matter: seven five-note banks; exact recipe, no
  same-cast gains financing missing required pitches; summary duplicates don't
  charge twice. Opening Chord and learned/cadence fixtures establish this.
- Arcanoneer eight typed spheres, bank12; pure pair needs two identical spheres,
  aliases/duplicate encodings are owned by its existing migration/price contract.
  Prism mechanics/composition remain there, not in P7.
- Martyr retains damage/earned/spent/bonus ledger. Existing worked test62 damage,
  spend2 → current2/spent2/damage62; later threshold84 → current3/spent2.
  HP damage is not permission for P7 to award Devotion automatically.
- Pyrofiend computes peak **before** vent; 8→9→lower still latches Debt Call.
  Preserve complete `nextResource.debtCall` and processed-own-turn receipts;
  never recompute a net scalar or advance its three-turn clock on load.
- Apex gain requires a resolved eligible pack receipt/quarry/companion and
  own-turn cap3 (Beastmaster4); casting/solo hit is not generic generation.
- Lunarch four phases and phase access/rounds, not a spendable scalar;
  Toxicologist separate prep/rest Vials and Parts, no generic gain/vent plan.
  Chronarch's temporal costs remain its own domain. No P7 reaction/passive clock.

`effectProcessingService` remains local overtime, including numeric-percentage
assumptions and local-player targeting. Character structured resistances and
creature percentages are not interchangeable. P7 commits final amounts only;
P8/P9 may later reuse reviewed calculation pieces with explicit manual fallback.
No `NaN`, unrecognized alias or absent target may silently become unmitigated
damage on the local sheet.

## 9. Demonstrated decisions for coordinator / creator review

No following proposal is silently accepted. These narrow items do not reopen
P5/P6 acceptance or authorize P8/P9 implementation.

| ID | Demonstrated evidence / unresolved choice | Proposed bounded resolution and impact |
|---|---|---|
| C1 — durable PC attachment and multiple tokens | Player resources and token snapshots are different paths; UID/session/name lookup lacks canonical character identity. One character's multiple token/room projections have no reviewed consequence-sharing rule. | Approve token-backed exact owner/character attachment and one active mutable attachment initially; extra tokens explicitly project it or require a reviewed separate-instance rule. Legacy identity conflicts preserve raw/manual data. Blocks PC freeze, not creature fixture drafting. |
| C2 — P9 class payment atomicity | Original P7 admits common pools/conditions while original P9 requires actual class payment+target once. Current class privacy projector drops notes/ledgers/latches; applying payment locally before P7 can charge a rejected action. | Keep initial P7 external mutation allowlist at HP/mana/AP/conditions. In P9, approve a **named source-owned payment adapter** staging the existing domain's complete typed result into the same room commit/receipt; server checks identity/revision/shape, not class math. Freeze exact privacy fields/domain result per supported payment before wiring. This is a future P9 integration choice, not a P7 generic resource patch or current guarantee of class-payment atomicity. Coordinator must confirm this partition or amend the bounded contract explicitly. |
| C3 — temporary pools in character casting | Creature quick-use spends temp first; inspected HUD/sheet spell paths check/deduct base AP/mana. Roadmap P8/P9 explicitly protects temp-pool rules. | P7 accepts explicit final splits and selects no price rule. Preserve creature temp-first. Creator/coordinator must confirm intended supported spell payment and identify exact owner helper before P9 changes; don't claim inspected cast paths already honor temp pools. |
| C4 — H9 authority and turn consequences | Existing combat flag permits cooperative transitions when unset; strict mode permits GM/turn-holder. Roadmap pauses new cross-actor automation without GM. | Approve GM-confirmed cross-actor actions and existing owner/delegate manual actor controls; explicitly choose who authorizes existing turn-resource proposals. Do not silently enable strict combat globally or authorize every peer timer. Blocks integrated permission freeze. |
| C5 — clock/condition mechanics ambiguity | Six-second displays, target-turn-end decrement attempt, missing clock projections; slowed catalog half speed versus authored −10ft. | Approve lossless clock/record codec and paused/manual shared timing for P7. Preserve authored modifiers; GM supplies changes. Wider round boundaries/stacking/mitigation remain H8/H10/domain decisions before later automation. No new scheduler needed. |
| C6 — recovery window/physical layout | Lease epoch, snapshot revision and P6 tokens already have different meanings; no actor receipt retention policy exists. | Coordinator approves §3 canonical placement, incarnation metadata and §5 persisted epoch/floor and numerical limits; explicitly accept last-confirmed-checkpoint crash boundary. Engineering may then freeze schemas/fixtures without pretending cloud unavailable is durable. |

Additional P9 fixture conflict: `arc_arcane_missile` current sphere list
`[Arcane,ember]` disagrees with its `arcane_sphere/holy_sphere` summary and
description (`arcanoneerData.js:2338–2382`). Existing explicit-recipe precedence
is source behavior, not creator confirmation of which recipe is intended.
Do not choose this as a supported canonical fixture until resolved; the inspected
`arc_spark_bolt` uses a consistent explicit pure pair. No source data was changed.

## 10. Required acceptance witnesses after review

These are **planned P7 acceptance scenarios**, not tests passed this session.

| Witness | Concrete producer → authority/storage → consumer proof |
|---|---|
| A1 exact creature/PC/foreign identity | Actual token/HUD controls, two instances of `grimmstalk`, non-default map, two PCs with same display name and two chars under one UID. Only exact ref changes; missing/foreign/stale kind/map/incarnation refuses with zero source/target changes. |
| A2 authorization/epoch races | Real registered middleware/handler composition; owner, exact delegate, GM, random member, revoked member; lease lost or room/membership replaced during awaited check. All denials zero mutation/checkpoint/unauthorized receipt delivery. Preserve P4 tests. |
| A3 atomic final source/target | Precomputed AP/current-temp and HP/current-temp finals, one target; invalid target/condition/revision/serialization/preflight means neither actor changes. Same actor source+target increments once. No refund compensation. |
| A4 duplicate/stale/concurrent | Repeat exact command after later unrelated changes returns same receipt without effects; different content same ID conflicts. Two concurrent expected revisions accept one. Below-floor/old unknown epoch retries refuse; receipt ack timeout/rejoin resolves without new UUID. |
| A5 protected sibling paths | Exercise flat/nested `token_updated`, `creature_updated`, full character/resources, snapshot refresh, bulk map/tokens and turn data. Cannot overwrite protected fields/revision via legacy envelope; authorized adapted manual controls still work. Test direct and delta token capability modes. |
| A6 actual checkpoint/restart | Production P2 writer+P3 encode/classified decode; same snapshot has both actors, conditions, metadata, receipt and floor. False/throw/unavailable/size failure honest; latest live state survives normal rejoin; server restart restores only confirmed checkpoint, unknown unconfirmed command requires reconciliation. |
| A7 record identity/clock fidelity | Modal effect, defending marker/effect candidates, stackable duplicate names, rounds3/zero and exact absolute expiry, unknown names/version/raw legacy. Room/local/owner-personal round trips preserve fields; remove/update one ID leaves other records intact. No NaN/filter/clock reset. |
| A8 correct remote turn recipient | Actual combat turn-resource/repair seam for another account's PC while own sheet is open. Only remote actor and its mirrors change; no local-sheet fallback. Preserve configured initiative/AP semantics; no new roll from result/hydration. |
| A9 personal reconciliation | Accepted PC room result to matching owner/canonical character+P5 generation, switch character/account/same-UID generation mid-save, old cloud/cache/import arrives, newer personal edit, failed/healed save/reconnect. Room result unchanged; private drafts preserved; latest lane status truthful; foreign sheet/condition lists not adopted. |
| A10 silent recovery/local scope | Replay same full/map/section snapshot; spies on RNG, nextTurn/startCombat, payment, condition timers, overtime, outbound emits and resource spend remain zero. Browser timer polling cannot originate shared consequences. Existing local guest/sandbox still functions as local-only. |
| A11 two consumers/physical boundary | P7 pre-adjudicated final-value fixtures derived from original Feather Slash and supported damage/heal examples; no casting controller implemented as part of P7. Physical GM notes same source/target/current-temp/counter outcome and “already resolved” command. P8/P9 execution tests wait for their projects. |

**Verification layers**: meaningful pure codec/identity checks; actual server
registered auth/sanitization/validation/rate-limit/authority composition with
external verification/Firestore fault fixtures; production stores/services and
mounted owner/HUD/condition browser flows checked with Playwright snapshots and
state/network capture; separate isolated real-backend/rules and staged GM+two
accounts/rejoin/restart/restore witnesses before durability/deployment claims.

Simulation must name auth/config, Firestore SDK/backend/admission, lease backend,
transport, fake clock and captured storage substitutions. Do not mock the actor
resolver, authorization, receipt logic, source/target staging, condition codec or
owner reconciliation and then call it production acceptance. Simulated persistence
may prove source composition, not rules/second-device/staged durability. P6 already
has that explicit distinction; no P7 simulation closes P5-05/07/09/10/11/12/13/31/32.

## 11. Bounded implementation handoff — only after contract review

1. Coordinator resolves C1–C6 and freezes exact V1 fixtures/layout/errors,
   accepted limits and authority matrix. Record approvals and open P9 domain
   decisions; do not upgrade this proposal to accepted by implication.
2. Reverify checkout, HEAD, runtime/witness hashes and dirty worktree. Record exact
   intended files. Preserve all concurrent styling, ROAD/Prism and accepted
   P5/P6 bytes. New regression only → bounded corrective evidence, not a broad audit.
3. Implement original P7 only: small actor-reference/final-consequence/condition
   codec and focused registered handler/schema; reuse existing lease/checkpoint/
   privacy/scoped persistence boundaries. Likely focused new modules under
   `server/services/` + `server/handlers/`, `src/services/` or `src/utils/`;
   no global entity registry, general transaction platform or rules DSL.
4. Wire the owner map in §2: covered server token/character/environment/turn/bulk
   paths, manual HUD/token controls, client result/resource/condition appliers,
   `combatStore` recipient seam and `silentRoomHydration`. Keep one authoritative
   instance resource path and explicit derived mirrors; no renderer rule logic.
5. Add exact active-room owner reconciliation at the P6 hook/projection seam,
   preserving its accepted off-table behavior, account-generation/tail/edit-token
   fencing and recovery candidates. Any changed accepted dependency requires
   focused regression selection and independent review of those new bytes;
   today's P6 PASS remains attached to its immutable reviewed identity.
6. Run A1–A10 through real production paths, targeted existing dependency tests,
   mounted browser witnesses and required isolated backend/staging gates. Check
   current framework docs before new library API use. Builds are detached with
   external log/exit redirection per AGENTS.md; no raw synchronous CRACO build.
7. Independent review reports exact manifests, capability/version boundaries,
   simulated/real gates and rollback. Disable new writes on rollback while
   retaining readable actor records/receipts/legacy candidates. No rollback
   refunds or reapplication; unsupported newer records remain preserved/read-only.
8. Stop after P7 verdict. P8 quick-use controller, P9 cast/payment support and
   P10 wording need their own authorization. No automatic P11–P14 work, commit,
   push or deployment.

**This session's verification**: byte/hash preservation and source inspection,
not P7 runtime acceptance. No gameplay test or full build is claimed newly run.
The report, source manifests, focal identities and supporting independent P6
evidence are retained; no accepted gameplay/persistence source was edited.

## 12. Executable implementation profile and independent-review routing

F1–F6 were frozen before production changes. The proposal sections above retain
their historical inspection status; their final paragraph describes the earlier
contract-preparation session, not the subsequent implementation. Current source
implementation and verification are reported in
[MYTHRILL_PROJECT_7_IMPLEMENTATION.md](MYTHRILL_PROJECT_7_IMPLEMENTATION.md).

Engineering clarifications within C1–C6, without new gameplay/payment rules:

- Receipts additionally retain optional typed `source`, `target` and the original
  strict adjudication fields; these are provenance, not executable rules.
- Private raw recovery respects P4: matching token owner, or GM for unowned legacy
  data. GM mutation/adjudication privilege alone is not owned-private-data consent.
  Read-only legacy recovery uses an exact `{kind,mapId,tokenId}` locator in the
  authenticated room; protected mutations still require the complete bound ref.
- One-actor foreign manual/turn proposals may be presented by a current member,
  but require current GM acceptance. They record `member-proposal-gm`, not owner
  approval. Source-controller proposals record `controller-proposal-gm`; this does
  not prove future P9 source-owner class-payment approval or economics.
- Imported browser attachment/receipt metadata is retained privately as recovery
  evidence, not installed as server authority. Unknown/unbound canonical identities
  require explicit supported binding/lifecycle, never name/UID inference.
- The current writer capability admits P7 only for checkpoint-eligible rooms.
  `room_not_persistent` is a refusal before live mutation. Temporary-room protected
  mutation support is not asserted; existing local sandbox behavior remains local.
- PC turn regen lacking owning-domain projected facts remains visibly manual.
  Existing AP/initiative policy is not redesigned, and advancement is not resource
  authorization. No local-sheet or peer-clock fallback supplies foreign regen.
- Competing live/unconfirmed versus restored projections are retained for explicit
  reconciliation. Choosing a server projection replaces a client view and preserves
  the prior owner candidate; it is not a room refund/re-execution transaction.

These limits are included in the independent handoff. P7 is not self-accepted;
new bytes do not inherit P6's historical acceptance, and real-backend/staged gates
remain open. No P8/P9 controller, P11–P14, commit, push or deployment follows.

## 13. B2 correction erratum — temporary shared capability, 2026-10-13

F1–F6 and coordinator C1–C6 above remain byte-preserved. Independent review
identified §12's checkpoint-eligible-only sentence and the implementation report's
temporary-room prohibition as an **unauthorized capability restriction**, not an
approved narrowing of the frozen contract. That historical implementation profile
is superseded on this point by the bounded B2 correction:

- Persistent rooms still require the actual P2 retained-snapshot admission before
  actor/receipt installation. Refused admission installs nothing.
- Supported temporary cooperative/manual rooms have an explicitly classified
  **live-only, nonpersistent** path. Verified membership/GM/owner/delegation,
  originating lease, strict condition/command validation, atomic in-memory
  installation, actor CAS and bounded session receipts remain mandatory.
- Temporary receipts use `checkpointRevision:null`; outcomes remain
  `status:'accepted-live', durability:'live-only'`. They are never checkpoint
  confirmed or pruned as a confirmed prefix. The session limit remains 256
  receipts / 512 KiB. Capacity refusal preserves prior live state.
- This path does not enqueue a persistent snapshot, claim a persistent writer,
  bypass protection with legacy writes, or promise crash/restart durability.

Correction report: [MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md](MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md).
**P7 remains BLOCK pending independent re-review.**
