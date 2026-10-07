# PROJECT 3 ARCHITECTURE FREEZE

**Project:** 3 — Single-Writer Room Checkpoints and Idempotent Resume  
**Frozen:** 2026-10-05  
**Authority:** current, intentionally dirty local worktree in `D:\VTT`; `docs/MYTHRILL_NEXT_PHASE.md` §§11–12, Project 3, §§28–31.  
**Handoff:** separate DeepSeek implementation followed by senior review. Project 1 and Project 2 are LOCKED.  
**This artifact:** architecture only. No runtime implementation, stored-room conversion, production-data inspection, commit, push or deployment was performed.

## VERDICT

**READY FOR IMPLEMENTATION.**

Engineering decisions below are frozen. H4 is a per-room migration gate, not a reason to postpone the codec, reader, hydration adapter or tests. No actual valuable production-room conflict was encountered: production was not queried. There is no current human decision blocking implementation.

The authority chain is:

1. **Live server `room.gameState`:** current accepted table truth, including unsaved changes.
2. **Highest complete committed checkpoint:** latest durable shared-room truth.
3. **Browser, personal remote documents and local caches:** projections, preferences or explicit local drafts.

Recovery reconstructs a selected snapshot. It never executes the actions that produced that snapshot.

## CURRENT WRITE PATHS

These are source observations, not claims about deployed data. Line anchors refer to the inspected worktree.

| Current path | Actual behavior | P3 responsibility |
|---|---|---|
| `server/services/firebaseService.js:414–499`, `updateRoomGameState` | P2 outcomes; `JSON.stringify(gameState).length > 100 * 1024` selects sequential root timestamp/flag update, `gameState/current` replacement, then per-map replacements. Smaller snapshots replace inline `rooms/{id}.gameState`. Split attempts settle all already-started fragment operations before returning, preserving P2 ordering, but are not atomic. No schema/revision/declared map set. No stale-map cleanup here. | Replace the physical write beneath P2 with the single atomic checkpoint publication below. |
| Same file `saveRoomData:508–550` | Whole room below `900 * 1024` characters is root `set(..., {merge:true})`; converts players Map to object. Above threshold delegates to split writer. | Metadata handling only; no independent authoritative game-state publication. |
| Same file `saveRoomDataSplit:269–346` | Sequential root metadata with `isSplitStorage:true`; global fragment; orphan-map deletes; map and last-100 chat writes. Returns boolean. | Retire from shared checkpoint writing; do not carry orphan cleanup into P3. |
| Same file `updateMapData:355–368` | Per-map `set(mapData, {merge:true})`. No production caller found in the targeted trace. | No standalone canonical fragment writes; route any supported shared caller through live state/P2, or reject. |
| `server/services/syncService.js:344–455,572–704,966–977` | Selected `FirebaseBatchWriter` clones full snapshots, coalesces newest, serializes attempts per room, retains failed work within bounds, exposes unsaved/pressure/shutdown accounting. Allocates process-local revisions, but calls persistence with only room ID and snapshot. Permanent/loaded rooms are eligible; temporary rooms are local-only. | Keep locked behavior. Pass the captured revision to checkpoint persistence and seed its existing allocation/accounting from durable room evidence. |
| `server/handlers/syncHandlers.js:332–400` | GM explicit save uses `saveNow(room.id, room.gameState)`. Fallback directly calls Firebase if writer missing. Emits saved only on confirmed outcome, using actual attempted/confirmed revisions. | Same writer, same honest outcome. Remove the production bypass; no writer means unavailable. |
| `server/handlers/roomHandlers.js:214–368` and lifecycle resume | `createRoom` can save whole room immediately, including on cloud reconstruction; ignores false save result. Resume can subsequently merge supplied `data.gameState`. | Reconstruction must be read-only; first publication and explicit import must use P2. |
| Registered token, character, map, environment, combat, audio, travel and GM handlers; `MovementDebouncer` | Queue full accepted `room.gameState` (sometimes `stripUndefined` copy). Individual gameplay events have their own mutation semantics. | Keep gameplay/delta behavior. Checkpoint captures resulting state, never event arguments. |
| `server/services/optimizedFirebase.js:206–225,282–308`; `realtimeSync.js:469–476` | Alternate queued inline whole-state/dotted-patch writer. Engine is constructed in `server.js`; no production `initializeRoom` caller was found. Registered `request_full_map_sync` can invoke `forceSyncAll`. | Prevent this engine from publishing shared room state; use live state for recovery. Do not activate dormant machinery. |
| Server `addChatMessage`, `setRoomActiveStatus` | Separate chat documents and root activity metadata writes. | Keep separate metadata/chat responsibilities; they cannot modify checkpoint header or fragments. Chat delivery/history is not checkpoint atomicity. |
| Browser `roomService`, `gameStateManager`, personal room-state service | See client table below. | Close second-writer paths at their service and application boundaries. |

P2's 50-room processing trigger is **not** a Firestore operation limit. A single queued room becomes one bounded Firestore batch.

## CURRENT READ PATHS

| Current path | Actual read/selection behavior | Defect or boundary |
|---|---|---|
| `firebaseService.getRoomData:160–261` | Root plus `gameState/current`, entire `gameState` collection and latest-100 chat query. Resets `roomData.gameState = {}` before inline fallback, so inline-only state is lost (R1). Every non-`current` document becomes a map. | No candidate classification; stale maps included; caught read errors return null, same as absent. |
| `loadPersistentRooms:803–903` → `roomHandlers.initializePersistentRooms` | Queries active root rooms. Only loads fragments when `isSplitStorage` truthy; otherwise trusts inline root. With missing current fragment falls back to inline globals minus maps. Fragment failure leaves fallback state and proceeds. Also asynchronously migrates nested characters into account documents and reduces in-memory characters to minimal references. | Different precedence from join; mixed/incomplete reads accepted; recovery has account-write/data-narrowing side effects. |
| `roomLifecycleHandlers:81–169` | Existing memory branch reads cloud and merges it into live state. Absent-memory branch loads cloud, calls saving `createRoom`, then merges browser `data.gameState`. | Rejoin can replace newer live values and resurrect deleted content. |
| `firebaseService.getMapData:376–398` | Reads any named map fragment alone; null on missing/failed. No production caller found. | Must not establish complete checkpoint independently. |
| `syncHandlers.request_full_sync:165–260` | Reads live room; selects requested/current/default map with own-property checks. P1 rejects unknown maps and ambiguous valuable root/per-map mixtures; legacy root-only fallback is default-map scoped. Payload includes tokens/character tokens/grid items/fog, only four editor fields, combat and members. | Preserve P1 routing/errors; extend complete recovery payload through adapter to avoid omitting drawings, objects and optional map fields. |
| `request_combat_sync:319–330` | Live combat projection on `full_game_state_sync`. | Present combat section is snapshot replacement, not gameplay. |
| `sync_map_state`, `request_full_map_sync` in map handlers | Live map projection enumerates selected fields; `sync_map_state` calls `validateMapExists`, a mutating creator; full-map request invokes separate sync engine. | Recovery reads must not create missing maps or use another engine's cached authority. |
| `gmActionHandlers.gm_request_fresh_positions:226–245` and rich map-transfer payloads | Position recovery also calls `validateMapExists`; transfer payloads enumerate maps and can omit optional fields. | Position correction is section-scoped; full map projection must preserve supported fields and never recreate an unavailable/deleted map. |
| `sync_*` targeted/broadcast families | Peer collections are relayed on `full_game_state_sync`, without mutating server room memory. P1 isolates current sender/recipient membership. | Keep P1 transport fixtures. These are partial compatibility projections, not complete checkpoint evidence. |
| Browser `roomService.getRoomData/loadCompleteGameState` | Root-only reads; permission error can become null. `GameStateManager.initialize` reloads this root copy for the GM. | Active multiplayer must not use browser cloud loader to select table truth. |
| Personal `users/{uid}/roomStates/{roomId}` load/listen | Remote-wins subscription and initial load apply enumerated shared fields. | Personal documents cannot select shared recovery state. |
| Local `localRoomService`, non-Firebase `roomStateService`, `App.initializeLocalRoom` | LocalStorage local-room state and older local-key fallback; explicit local entry point. | Legitimate local authority, retained under local scope. |
| `useLevelEditorPersistence:105–141,220–225` → `levelEditorPersistenceService` | Non-local room change can load room-keyed in-memory editor cache through `loadMapState`; not a Firebase read despite service comments. | Cache must not overwrite selected multiplayer snapshot. |

P3 will have **one classified server reader** used by startup, absent-memory resume, selected-room export and map-checkpoint diagnostics. Metadata listing remains a listing, not a snapshot loader. `getMapData` must return a map from a validated selected checkpoint, never a standalone document dressed as room truth.

## CURRENT HYDRATION PATHS

| Current entry point | Classification of current application |
|---|---|
| `mergeRoomGameStateForResume`, `roomHandlers.js:138–195` | Maps **UNION**; token/item/terrain/wall/fog/light dictionaries **MERGE**; drawings/layers/fog paths/objects/DnD arrays **APPEND**; combat turn order **APPEND**; assignments/settings **MERGE**. Other optional globals generally remain base values or are ignored. R3 is directly present. |
| `roomJoinHandler.js:75–169,543–874` | Initial supplied editor fields **REPLACE** when present; item/token loaders **APPEND/ID-upsert**. Map store reset/recreated with mostly metadata, losing full map cache fields. Target token stores clear then add; grid items replace target-map subset but retain other cached maps. Missing collections preserve prior state. Combat is direct **REPLACE** only if active; inactive snapshot does not clear prior combat. |
| `gameStateManager.applyGameStateToStores:184–337` | Tokens **APPEND/skip-existing-ID** via `loadToken`; editor present fields **REPLACE** with setter side effects; character tokens **UPSERT/APPEND**; empty conditions/containers ignored; combat calls some setters not present in current store and only handles active state. |
| `audioGameSessionHandlers.full_game_state_sync:63–207` | Tokens, character tokens, items **UPSERT/APPEND**, only nonempty collections handled; editor present fields **REPLACE**; buffs/debuffs call `addCondition` (**APPEND/semantic application**); combat **REPLAYS GAMEPLAY** using start/turn calls. |
| Client `combatHandlers.combat_state_sync:65–107` | **REPLAYS GAMEPLAY**; inactive restoration effectively unfinished. Ordinary combat_started/turn_changed listeners separately write selected stored fields directly. |
| `gmHandlers.player_map_changed:821–1001` | Mixed snapshot/cache fallback, current token clear/add, target item **REPLACE** plus ID deduplication; missing data preserves cache. Other editor domains omitted. |
| `gmHandlers.fresh_positions_received:655–676` | Character-token **UPSERT**; creature positions updated through a mutator. Position-only correction, not full snapshot. |
| `mapGridHandlers.level_editor_state_synced` | Present fields **REPLACE**; currently expects `data.levelEditor` while server sends `data.state`. |
| `mapGridHandlers.sync_tokens/sync_character_tokens/sync_grid_items:471–539` | Additional compatibility collection listeners **UPSERT/APPEND**, filter by map, and do not remove deleted entries. Route snapshot-section recovery through adapter; do not mistake these for canonical server state. |
| `mapGridHandlers.map_update` | Terrain/elevation/ramp **MERGE** with null-as-delete; other supplied domains often **REPLACE**. This is a live delta path, not a checkpoint loader. |
| `useRoomPersistence` initial load and remote callback | Enumerated arrays/combat/conditions/chat **REPLACE** from personal cloud, competing with accepted multiplayer state; creature `tokens` alias is updated without necessarily updating `creatureTokens`. |
| Local `roomStateService.applyRoomState/applyPlayerState` | Local room present fields **REPLACE**; active-only combat via stale setter names; personal exploration **MERGE**. Local-only callers exist. |
| `App.applyLocalGameState:552–664` | Local token/item loaders **APPEND/ID-upsert**, editor present fields **REPLACE**; older non-local cache fallback can **MERGE** terrain. Preserve explicit local scope; this is not the multiplayer adapter. |
| `useLevelEditorPersistence` load / cache import/copy | Editor **REPLACE** from unversioned local process cache, not cloud confirmation; room-keyed rather than complete map/revision scope. |
| `levelEditorStore.loadMapState/loadCompleteLevelEditorState`, bulk setters | Mostly **REPLACE**, but optional fog-preservation fallback, empty drawing-layer default substitution, render-version increments, map cache writes and outbound batcher calls occur. They are not inherently silent/idempotent adapters. |

No current client listener was found for `map_state_synced` or `state_resolved` in the inspected registered socket-handler modules. Do not treat an emitted but unconsumed event as working recovery.

## CURRENT CLIENT COMPETING WRITERS

| Current source | Storage/application | Status |
|---|---|---|
| `roomJoinHandler:1250–1269` → `GameStateManager.initialize(roomId, isGameMaster)` | GM permanent join loads root cloud state, subscribes stores and starts 30-second autosave. Cleanup can force-save. | Active competing whole-room writer/loader. |
| `roomService.saveCompleteGameState:500–522` | Direct `updateDoc(rooms/{id}, {gameState,...})`. | Active through manager. |
| `roomService.updateRoomGameState:211–227`, `updateGameStateSection:564–582` | Direct whole-state or dotted-section writes. | Public bypass APIs; no additional current caller found. |
| `roomService.updateRoom:402–418` | Arbitrary spread updates to root room document. | Must disallow shared-state/checkpoint fields at this boundary. |
| `RoomLobby:644–684` → `createPersistentRoom` | Browser creates root metadata **and an inline initial gameState**, then socket resumes it; converted local state can be sent as `data.gameState`. | Initial draft creation must stop installing shared snapshot authority. |
| `PersistenceProvider:27–31` → `useRoomPersistence` | Mounted for multiplayer room; 3-second personal cloud autosave, initial load, remote-wins listener. Provider unload/visibility/manual save calls `forceSave`. | Active competing application from personal cloud, even though document is under user scope. |
| `services/firebase/roomStateService.js` | Personal room snapshot service also has map/combat/conditions/chat/position section APIs. | Cache/draft scope only; cannot apply shared state in active multiplayer. |
| `services/roomStateService.js`, `localRoomService.js`, local-room App entry, persisted stores/IndexedDB | `mythrill-room-state-*`, `mythrill-player-state-*`, `mythrill_local_room_state_*`, local map/store caches. | Keep local workflows; no automatic multiplayer recovery authority. |
| `useLevelEditorPersistence`, `levelEditorPersistenceService` | Memory-only editor caching, autosave/unmount and import/copy APIs; no direct cloud writer. Room-change cache load can still clobber shared projection. | KEEP inert cache; DISABLE authoritative cache application in active multiplayer. |

## CURRENT LEGACY FORMATS

Actual physical document names and shapes:

**A. Inline-only:** `rooms/{roomId}` contains `gameState: {...}` and room metadata. There is no `gameState/current` or map document. Server-created state includes `defaultMapId`, `maps` dictionary, `combat`, `characters`, `playerMapAssignments`, `mapData`, root token/item mirrors, `levelEditor`, `gridSettings`. Browser-created/manager-written inline state can instead be root-only: tokens/characterTokens dictionaries, `levelEditor`, `mapData`, `inventory.droppedItems`, combat using `currentTurn`, optional conditions/containers/travel/weather/vision/exploration. Browser creation uses empty arrays for some editor domains where server defaults use dictionaries. These are variants, not one identical schema.

**B. Split-only:** root metadata (often `isSplitStorage:true`); `rooms/{roomId}/gameState/current` contains **flat non-map gameState fields plus `lastUpdated`**; `rooms/{roomId}/gameState/{mapId}` contains **flat map fields**, e.g. `id`, `name`, terrain/walls/objects/drawings/fog/lights/DnD/elevation/ramp/sun/token/item dictionaries. Some paths do not persist `isPermanent/persistentRoomId` in root metadata. Chat is separate `rooms/{roomId}/chat/{messageId}`.

**C. Both:** root inline `gameState` remains alongside current/map fragments. Root `merge:true` split saves never remove old inline state; small updates never remove fragments or reset `isSplitStorage`. Browser always writes inline. Each can contain valuable different content.

**D. Partial split:** any sequential interruption can leave root flag/timestamps but no current fragment, global without maps, some maps absent, maps from different attempts, or stale undeclared maps. There is no historical declared map list, completion marker or per-map revision. A lone `current` document is not proof of an empty room.

**E. P2 large representation:** `updateRoomGameState` uses the same unversioned B/C shape at >100 KiB measured in JS characters. It writes global clone and each map, settles outstanding writes, and reports honest failure. It adds **no checkpoint schema/revision** and deletes no stale maps. `saveRoomData` still switches at 900 KiB characters; these thresholds differ.

**F. Unknown/newer:** no shared checkpoint-version field exists in these current room writers. `version:1` in **personal** room snapshots and canonical **character** metadata versions are not shared-room checkpoint versions. A future checkpoint header/version or unknown fragment envelope must be diagnosed, preserved and never interpreted as empty legacy state.

Common metadata names actually present include `id`, `name` (not consistently `roomName`), `description`, `gmId`, `gmName`, `gm`, `members`, `players`, `settings`, `createdAt`, `lastModified`, `lastActivity`, `isActive`, optional `isPermanent`, `persistentRoomId`, `passwordHash`, `bannedUsers`, `stats`, `isSplitStorage`. They do not supply reliable field-level snapshot precedence.

## CANONICAL CHECKPOINT FORMAT

### One physical convention

Reuse exactly the existing room/global/map document domain. No history collection, extra pointer document, arbitrary chunking or second provider.

1. `rooms/{roomId}` — administrative metadata and **the only publication manifest**:

```json
{
  "id": "room-id",
  "isSplitStorage": true,
  "checkpoint": {
    "schemaVersion": 1,
    "revision": 42,
    "mapIds": ["default", "map-b"],
    "committed": true,
    "committedAt": "Firestore server Timestamp",
    "contentHash": "lowercase SHA-256 hex",
    "provenance": {
      "kind": "native",
      "sourceRoomId": null,
      "sourceRevision": null,
      "selectedCandidateId": null,
      "rollbackArtifactId": null,
      "rollbackArtifactSha256": null,
      "decisionId": null
    }
  }
}
```

Existing administrative fields remain at root. Alongside the header, the batch may write the server-captured `name`, `description` when present, and `settings` as full owned values from that same queued capture; accepted shared gameplay settings must not disappear because P2 previously queued only gameState. Capture this small metadata context with the snapshot, not from a browser or a mutable room reference after an await. `gmId`, membership/access fields, transport presence and unrelated metadata remain administrative context, never imported gameplay authority. No canonical inline `gameState`. Remove that field **only during an explicitly authorized, exported conversion**, in the same publication batch. Root legacy chat data is not rewritten as part of the checkpoint.

2. `rooms/{roomId}/gameState/current` — global fragment, **full replacement**:

```json
{
  "schemaVersion": 1,
  "checkpointRevision": 42,
  "snapshotJson": "JSON encoding of the entire selected global section"
}
```

3. `rooms/{roomId}/gameState/{mapId}` — one map fragment per declared ID, **full replacement**:

```json
{
  "schemaVersion": 1,
  "checkpointRevision": 42,
  "mapId": "map-b",
  "snapshotJson": "JSON encoding of the entire selected map record"
}
```

These are **new frozen P3 fields**, not claimed existing fields. Fragment payloads are JSON strings intentionally: current JSON-safe snapshots can contain nested arrays (e.g. item shapes), which native Firestore arrays cannot faithfully store; current browser sanitizer stringifies inner arrays without a matching general decoder. Encoding the entire owning section once is the smallest lossless room-only boundary. It also avoids indexing each terrain/item property. Do not reuse the lossy personal sanitizer for canonical snapshots, parse arbitrary leaf strings, compress payloads, or add a tagged universal codec.

The global payload is selected gameState minus `maps` and the derived root `tokens`, `characterTokens`, `gridItems` mirrors. All other supported fields remain in their owning sections; see preservation rules. A map payload includes its exact record, including optional fields. `locationScenes` stays global; its IDs are not tactical map fragment declarations.

`mapIds` is a unique, lexicographically sorted array of actual map dictionary keys. IDs must be valid Firestore document IDs, own safe record keys, and not `current`, `__proto__`, `constructor` or `prototype`. A legacy collision is preserved and blocks conversion; do not silently rename it. Map record `id` must match its key; missing legacy `id` can deterministically project from the physical document/key, with that adaptation recorded.

No separate checkpoint identifier is needed: `(roomId, schemaVersion, revision)` identifies a publication. `contentHash` identifies content across scratch restore/revision changes. Define it exactly as SHA-256 of UTF-8:

```text
JSON.stringify([1, globalSnapshotJson, mapIds.map(id => [id, mapSnapshotJson[id]])])
```

Serialize JSON-safe records with recursively sorted object keys and preserved array order. This content hash covers global/map gameplay payloads; outer administrative metadata, revision/timestamp/provenance are not part of it. Capture and restore supported room `name/description/settings` separately from access/transport metadata. Retries reuse captured content, metadata and revision, never recollect stores.

`provenance.kind` is `native`, `legacy-inline`, `legacy-split`, `legacy-selected`, `local-import` or `restore`. First conversion sets candidate/artifact/decision references; subsequent checkpoints retain that lineage. Restore adds source room/revision and export artifact reference. Native fields are null. All provenance comes from the server's selected-room procedure, never an unvalidated client assertion.

## CHECKPOINT REVISION CONTRACT

**P2's attempted writer revision IS P3's checkpoint revision.** There is no unrelated second revision counter.

- Allocate once when capturing/admitting a full snapshot, before canonical serialization/publication. `pendingRevision`, attempted `revision`, fragment `checkpointRevision` and manifest `revision` all refer to that same number.
- Positive safe integer; 0 means no confirmed canonical checkpoint. Skips are allowed when pending snapshots coalesce, fail or admission consumes a number. Contiguity is not completeness.
- Guarantee monotonicity **per persistent room** across restarts and writer-record eviction. Global monotonicity across rooms/process lifetimes is unnecessary.
- Keep P2's existing process counter. Before allocating for a room, raise it to at least that room's trusted durable revision and live allocation high-water mark, then increment. Track the room high-water on the existing live room, not an unbounded detached revision-history map.
- Reader/reconstruction seeds durable confirmed revision from a **validated complete** canonical checkpoint. Legacy selected state starts at durable canonical revision 0. Do not seed from an incomplete/unknown header or a browser number.
- Writer status-record creation/reactivation must seed `confirmedRevision` from trusted live room checkpoint metadata instead of forgetting it on tombstone eviction. Pending allocation high-water and durable confirmation are distinct values, but the same revision namespace.
- Restart reconstructs only committed truth. Unconfirmed memory is not crash-recovered; it may have been lost. Numbers used only by failed/unconfirmed attempts before restart need not be remembered. First post-restart publication must exceed the durable revision.
- Same revision retries require identical content hash. Equal revision/different content is a conflict, never a last-write-wins update. Revision exhaustion rejects saves; do not wrap/reset.
- These are checkpoint snapshot revisions, not a claim that every gameplay event now has an actor/action revision. P7 is not part of P3.

## ATOMIC PUBLICATION CONTRACT

**All checkpoint documents are written in ONE Firestore Admin `WriteBatch.commit()`.** Exactly `M + 2` write operations: one root update/create, one global `set`, M map `set`s. No deletes of stale map documents, no chat writes and no independent preparation writes.

1. **Authority/admission:** selected P2 writer holds same-room sequencing; capture full accepted live snapshot, small trusted room metadata context and its allocated revision. Apply supported-value validation before P2's JSON clone can erase invalid values into null/empty. Permanent-room eligibility remains P2's rule. Legacy room conversion gate must have succeeded; unknown/incomplete/ambiguous rooms cannot publish.
2. **Read current head:** obtain trusted root metadata/head and update time. Validate existing canonical head through the classified reader when needed. If head revision exceeds attempted revision, return `permanent/CHECKPOINT_REVISION_CONFLICT`; never overwrite it. Equal revision with complete matching hash AND matching captured shared metadata returns confirmed after verification without rewriting; equal revision/different content or shared metadata fails.
3. **Preflight:** canonical structural validation, supported JSON normalization, exact map set, serialization/hash, prospective root metadata size, every fragment size, total request estimate and operation count. Include retained root fields in its document-size calculation. No publication write has started yet.
4. **Prepare batch in memory:** root checkpoint map and captured shared room metadata values are replaced as whole fields, `isSplitStorage:true`, `lastModified/lastActivity` and `checkpoint.committedAt` use server timestamps. Existing root update uses `lastUpdateTime` precondition. New root uses create-if-absent. Global/map documents use non-merge `set`. Explicit first conversion deletes inline `gameState` in this same root operation after export proof.
5. **Commit/publication boundary:** await the one `batch.commit()` promise. Atomic backend commit publishes root manifest and all declared fragments together. `committed:true` is in that batch; it is never installed before fragments and there is no later marker-only phase.
6. **Confirmation:** only successful complete batch commit (or verified identical complete publication after uncertain response) returns `confirmed` for the attempted revision. P2 then advances confirmation/resolves waiters/emits status according to its locked rules. A newer queued snapshot remains pending.
7. **Failure:** construction/preflight failure means zero writes. Backend rejection means no batch publication. A transport error with uncertain commit may mean all documents committed; do not label confirmed until a coherent reread proves that exact revision/hash complete. Retry same revision/content under P2; it must not overwrite a newer head. Never publish a subset, retry individual fragments, clear retained work, or synthesize a marker.

A root update-time conflict triggers a bounded head reread/re-preflight; unchanged checkpoint plus changed activity metadata is retryable, not permission to overwrite new checkpoint content. Do not indefinitely loop or release P2's same-room ordering while the commit promise still runs. Keep P2 independent-room/deadline/shutdown behavior.

Outcome mapping:

| Condition | P2 outcome / status |
|---|---|
| Exact batch committed, or identical complete revision verified | `confirmed`; actual attempted revision only |
| Firebase absent, canonical writes disabled, production writer missing | `unavailable`; never cloud-saved |
| Network/unavailable/quota/transient commit/read failure | `retryable`; retained newest snapshot/backoff |
| Oversize operation/document/request envelope | `permanent`, code `CHECKPOINT_TOO_LARGE`; retained unsaved until smaller/new snapshot |
| Malformed/unsupported JSON or structure | `permanent`, code `CHECKPOINT_INVALID`; retained unsaved, offending path diagnosed |
| Legacy conversion not explicitly authorized/exported | `permanent`, code `MIGRATION_REQUIRED` or `AMBIGUOUS_RECONCILIATION_REQUIRED`; retained unsaved |
| Unsupported schema/head revision conflict | `permanent`, corresponding diagnostic; read-only/recovery needed |

Normalize native SDK numeric/string error codes at this boundary where needed; do not turn P2's bounded outcome contract into a project-wide error framework.

## COMPLETENESS PREDICATE

Read root and declared fragments in **one Admin read-only transaction** (`runTransaction(..., {readOnly:true})`), using `transaction.get`/`getAll`. This supplies a coherent read snapshot; independently timed reads/listeners are not completeness evidence. Legacy classification reads root and its gameState collection in that same coherent read. Startup uses this reader per selected room, not a separate reconstruction algorithm.

Revision R is complete iff ALL hold:

1. Root exists; `checkpoint` is a valid manifest; supported `schemaVersion === 1`; safe positive revision R; `committed === true`; valid committed timestamp/hash/provenance.
2. Declared tactical `mapIds` is valid, unique and sorted, within envelope.
3. `gameState/current` exists with supported schema and revision R; valid JSON record payload has no `maps` or authoritative root entity mirrors.
4. Every and only **declared** map is selected from its exact document path, has schema 1 and revision R, matching `mapId` and payload `id`, and valid map record.
5. Root `id` agrees with document ID, shared name/settings have valid types, and decoded structural fields have valid types/scopes. `defaultMapId` refers to a declared map, or is null when map set is empty. Empty map set is explicitly declared; missing map set is not empty. No malformed collection is silently coerced to empty.
6. Recomputed content hash equals manifest hash. Each supported optional field remains in the decoded selected snapshot.

| Failure/extra state | Reader behavior |
|---|---|
| Missing declared fragment, differing revision/schema, wrong map ID, malformed JSON/structural field/hash | `INCOMPLETE_CHECKPOINT` with exact reason; no hydration, confirmation, fallback-to-empty or rewrite |
| Checkpoint header present but missing/false commit marker | `INCOMPLETE_CHECKPOINT`; do not downgrade to legacy selection |
| Declared set disagrees with selected payload identities/default pointer | Incomplete/invalid; never union extra documents to repair |
| Header or fragment indicates newer/unknown checkpoint schema | `UNKNOWN_NEWER_VERSION`, preserved/read-only; no legacy downgrade |
| Old extra map docs, old inline copy | Not selected; never restored, merged or deleted automatically. Export can retain them as excluded raw evidence. |
| Physically stale docs for deleted maps | Allowed. Manifest absence is authoritative deletion from selected state. |

Atomic publication means the head selects the latest commit; P3 does not retain an infinite historical checkpoint catalog or search fragments for a supposedly highest revision. A damaged head is diagnosed, not repaired by assembling another snapshot.

## FIRESTORE SUPPORTED ENVELOPE

Current docs checked through Context7 `/googleapis/nodejs-firestore` and [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) on 2026-10-05. Node Admin batch commit is atomic. Quotas specify 1 MiB document, 1 MiB minus 89 bytes field value, 10 MiB API request, field nesting 20, 40,000 index entries/document and 8 MiB total index-entry size. Context7's Node batch reference specifies 500 writes. P3 uses 500 as an application cap even if a future SDK/backend permits more; the quotas page's separate 500 field-transform limit must not be mistaken for room-map capacity.

Frozen limits, inclusive:

| Limit | P3 value |
|---|---|
| Write operations/publication | **500**; `M + 2`, so **at most 498 tactical map fragments** |
| Conservative document-size estimate | **900 * 1024 bytes** for root, global and every map doc; retain current safety threshold, measure bytes rather than JS characters |
| Conservative complete request estimate | **8 * 1024 * 1024 bytes**, below 10 MiB backend ceiling |
| Fragment split | Exactly one global and one document per declared map; no subdividing a large map |

There is no accurate current server document-size serializer: existing checks only use JSON character length. P3 must reuse JSON snapshot capture and the existing 900 KiB safety policy, correcting measurement and adding a small room-only estimate. Define the conservative estimate so tests and agent do not choose their own threshold:

```text
documentEstimate = UTF8(JSON.stringify(prospective concrete document))
                 + UTF8(full Firestore document name)
                 + 32 * nodeCount(document)
                 + 4096
requestEstimate  = sum(documentEstimate + UTF8(full document name) + 1024)
nodeCount        = count every record, field entry, array, array element and scalar
```

Server timestamp/delete sentinels are represented by fixed estimate placeholders at least as large as their encoded operation; count the prospective post-update root, not just update patch. Exported legacy inline state removed in the authorized conversion is excluded from the prospective root; other root fields are included. Non-JSON root SDK values need known typed measurement or refusal, never a zero estimate. This intentionally overestimates; it is not an exact provider-size guarantee. SDK validation/backend rejection remains a truthful bounded failure. String fragment payloads avoid native nested-array/depth and terrain-index fan-out; existing administrative metadata must still be valid Firestore data.

Reject before constructing/starting any write if any limit is exceeded, if payload string itself could exceed field-value ceiling, or map ID/path is unsupported. Error identifies operation count/limit or offending document/bytes. **Live room continues; P2 reports UNSAVED / CHECKPOINT_TOO_LARGE and retains its bounded newest retry/recovery state.** Do not truncate, omit maps, split batches, delete legacy content to fit, or add chunking.

## LEGACY CLASSIFICATION ALGORITHM

Return a discriminated result, not bare `{}`/null. Required fields: `kind`, `roomId`, `readOnly`, `diagnostics`, labelled raw candidates, and `selectedCandidateId/selectedSnapshot` only when selection is justified. Storage topology and selection status are separate; an inline candidate alongside a partial split stays labelled as such.

1. **Read failures first:** no DB → `READ_FAILED/UNAVAILABLE`; permission/network/query/parse-transport errors → `READ_FAILED` with code/stage. No empty-room construction or save follows. A failing auxiliary chat query must not erase a valid checkpoint; report chat unavailable separately.
2. **Absent:** coherent root-missing AND no gameState documents → `ABSENT_ROOM`. Root missing but fragments exist → `PARTIAL_SPLIT/ORPHANED_FRAGMENTS`. Neither is inferred from a rejected request.
3. **Versioned evidence:** supported manifest → completeness predicate → `CANONICAL_COMPLETE_CHECKPOINT` or `INCOMPLETE_CHECKPOINT`. Unsupported header/fragment envelope → `UNKNOWN_NEWER_VERSION`. A recognizable versioned fragment without manifest is incomplete, not legacy.
4. **No versioned evidence:** capture root inline candidate exactly, and separately the legacy split candidate (current plus non-current docs). `isSplitStorage` is a diagnostic hint only.
5. Inline exists, no split → `LEGACY_INLINE_ONLY`; select only structurally complete candidate. Invalid inline → `INVALID_LEGACY_CANDIDATE` rather than empty. Root-only known inline variants can be complete under the bounded adaptation below.
6. Split exists, no inline → `LEGACY_SPLIT_ONLY_COMPLETE` only if its structural completeness predicate passes; otherwise `PARTIAL_SPLIT` or invalid with reason.
7. Both exist → `LEGACY_BOTH_INLINE_SPLIT`, with each candidate's completeness and a separate selection result: equivalent, trustworthy selection, partial candidate rejected, or `AMBIGUOUS_RECONCILIATION_REQUIRED`. Never combine fragments with inline globals.
8. Root metadata but neither snapshot nor fragments → `ROOM_PRESENT_NO_SNAPSHOT`, not absent/empty. New metadata-only draft is explicitly uninitialized (`checkpoint:null`, no inline/fragments) until server publishes its first checkpoint. Do not infer an arbitrary old root-only record is authorized for an empty overwrite.

**Legacy split structural completeness:** current global document exists; all discovered non-current map docs are valid records; physical IDs and any stored IDs agree; every explicit default-map/assignment/map-scoped entity reference is accounted for; no contradictory root-only entity payload; known collection types are valid. If no maps exist, require positive empty-state evidence (e.g. an explicitly recorded empty map set) rather than inferring emptiness from a lone current fragment. Existing split writers do not record such a set, so their lone-current case is partial.

Legacy split lacks transactional revision/map declarations. `LEGACY_SPLIT_ONLY_COMPLETE` means a structurally complete **legacy candidate**, not proof that its original save was atomic or that every discovered map was intended to survive. Record that limitation. Evidence of missing/contradictory fragments blocks selection. If consistency cannot be established, preserve/read-only; do not fabricate completeness.

**Root-only inline adaptation:** deterministic single-map compatibility projection is allowed when no per-map state exists and all explicit scopes agree with `defaultMapId` or the documented unscoped default. Project editor/mapData fields and entity collections into that map without merging independent candidates. `inventory.droppedItems` is the known grid-item legacy source only when another valuable gridItems representation is absent or equivalent. Keep raw source intact. Conflicting aliases, conflicting scopes, duplicate/missing entity IDs that cannot be projected losslessly, or valuable root-only entries alongside differing per-map state require reconciliation. An empty array in a legacy dictionary slot may adapt to empty dictionary; nonempty incompatible data may not be silently filtered.

## LEGACY PRECEDENCE RULE

There is **no universal split-wins or inline-wins rule**.

Apply in order:

1. Valid committed canonical manifest selects canonical state. Excluded old inline/fragments are retained evidence; they cannot compete. Unsupported/incomplete canonical metadata prevents legacy downgrade.
2. Exactly one structurally complete candidate can be selected for reading; preserve invalid/partial companion and report why it was excluded. Conversion still requires raw export and explicit save.
3. Two complete candidates with exactly equivalent supported content after deterministic representation-only adaptation can be labelled equivalent; select the inline-labelled candidate deterministically and preserve both. This is equality, not deduplication of strokes or union of records.
4. An **explicit prior H4 selection bound to these exact candidate hashes**, or coherent known manifest/revision/provenance that really covers the entire candidate, is trustworthy evidence. Higher fully validated revision within the same supported room lineage can order versioned content. No current unversioned writer supplies this evidence automatically.
5. Otherwise conflicting complete valuable candidates → **AMBIGUOUS_RECONCILIATION_REQUIRED**.

Current `lastActivity`, root `lastModified`, `isSplitStorage`, personal `lastUpdated/version`, one global fragment's `lastUpdated`, map `updatedAt`, and root Firestore `updateTime` are not sufficient precedence evidence. Root updates also happen for membership/chat/activity, and global timestamp is written before maps. Show all timestamps as comparison metadata with their scope; never timestamp-guess away data. Greater record counts/nonempty-vs-empty also cannot prove deletion intent.

The required trustworthy-precedence fixture must use identical complete candidates or a recorded explicit selection matching their hashes, not invent a trustworthy timestamp on the current writer shape.

## AMBIGUITY / H4 PROCEDURE

H4 is required when two complete valuable candidates disagree without the evidence above, including conflicting valuable root/per-map aliases that cannot be projected losslessly. It is not required for an unambiguous valid single candidate or equivalent candidates.

Before showing choices, export both raw candidates and all relevant physical documents/update times. Labels: `A: root-inline`, `B: global-plus-map-fragments`; additional alias conflicts are labelled within the affected candidate, not silently resolved. Show room ID/name, schema/revision if present, candidate/content/raw hashes, completeness/missing fragments, map IDs/names, counts and identities of tokens/items/objects/drawings/fog/turn order, scoped timestamps and differing optional fields. Counts are aids, not precedence.

Offer exactly:

1. **USE CANDIDATE A**, if complete.
2. **USE CANDIDATE B**, if complete.
3. **EXPORT BOTH / KEEP READ-ONLY**.

Record explicit creator selection with `decisionId`, room ID, selected candidate hash, hashes of both captured candidates, decision timestamp and creator identity. If raw candidates have changed, invalidate the choice and recapture/recompare. No automatic merge/deduplication/deletion inference. Manual creative reconciliation is outside automatic P3 conversion; any later reconciled import must be a separately supplied complete selected artifact.

Implementation must stop conversion and authoritative shared activation of that ambiguous snapshot. Existing accepted live memory is preserved and may continue; its migration/save gate stays unsaved until explicit choice/export procedure completes. H4 is not a general approval flow for routine canonical saves.

## MIGRATION PROCEDURE

**Selected room → coherent raw export → select complete candidate → explicit save/restore → one canonical conversion → retained rollback/provenance.**

1. Startup/join classification is read-only. Unambiguous legacy state may reconstruct live memory with `migrationRequired` diagnostic; autosave must not convert it silently.
2. On explicit GM save of that selected legacy room, produce and durably verify its raw pre-conversion artifact. Valuable ambiguous state requires H4 first. If export/selection fails, retain live/queued state unsaved and write nothing canonical.
3. Candidate selection initializes authority once. If authority is already live and has accepted edits, explicit save captures that **current live state**; it must not replace it with the migration source just selected. If human choice would replace accepted live edits, stop that operation and use scratch restore for comparison; no automatic in-place reconciliation.
4. Recheck raw source fingerprints before conversion. Root update precondition prevents root changes; operating boundary has legacy competing writers disabled. Unexpected changed fragments without root evidence is a stop, not a race to overwrite. No concurrent old writer during conversion is supported.
5. Publish first canonical revision through P2 in the one batch. Preserve migration lineage in manifest. Only confirmed conversion clears migration gate; thereafter normal P2 autosave writes canonical snapshots.
6. Retain pre-conversion export and excluded candidates. No mass rewrite, orphan deletion or scheduled cleanup. Unknown schema remains read-only and cannot be converted by schema-1 writer.

New rooms: browser may create **metadata-only inactive draft** with `checkpoint:null`; it must omit `gameState`. Server explicitly recognizes new draft, validates any selected local import (creation only), creates live defaults once, then publishes through P2. Reconstruction of an existing room must not call a whole-room saver. Browser `data.gameState` on ordinary resume is not accepted as authority. Local-to-multiplayer import remains a deliberate operation into a new empty target; export local source first and preserve it.

Remove `loadPersistentRooms`' implicit nested-character migration/narrowing from this recovery path. Preserve `gameState.characters` opaquely. Do not migrate personal account data, recompute character resources or replace character canonical documents during room load.

## RAW-CANDIDATE EXPORT REQUIREMENTS

Export one selected room, with no truncation of candidate data:

- Complete raw `rooms/{id}` document; every physical `gameState` document relevant to legacy classification, including `current`, stale maps and orphan/unknown envelopes.
- Physical path/ID, existence and Firestore `createTime/updateTime/readTime` where exposed; exact field values with lossless tagged representation for SDK-native raw values such as Timestamp, reference or bytes. Do not JSON-stringify them into guessed strings or `{}`.
- Separate raw inline and raw split candidate labels, fragment IDs, missing/invalid diagnostics, full raw checksums, any selection/H4 evidence, and explicit excluded-document labels.
- Export format version, source room ID, export timestamp, consistent capture evidence, selected candidate ID/hash if one exists. Exclude credentials and do not promote copied owner/member/password fields into scratch authority.
- SHA-256 artifact checksum over deterministically serialized artifact payload excluding its checksum field. Artifact ID is stable and recorded in conversion provenance.
- Before destructive replacement, write artifact to an explicitly selected durable file destination and read/verify it. A log line, process-memory object, ephemeral temp directory or unacknowledged browser download is not rollback proof. Existing server Node filesystem/crypto suffices for an operator fixture; no cloud backup product.

Chat documents are separate from checkpoint-owned state. Preserve root raw chat values within raw metadata; separately label any included recent chat export as ancillary, never as part of checkpoint completeness. Do not claim full chat/archive/account backup.

## HYDRATION CONTRACT

### One silent adapter, explicit scope

Server reconstruction assigns a validated complete decoded snapshot to `room.gameState` by replacement. It never calls resume merge. Client join, full-room/full-map/full-combat recovery and selected scratch restore route through **one focused silent snapshot adapter**. No scattered asynchronous per-domain applications.

Validate and prepare all data/store dependencies **before** mutation. Apply synchronously under a scoped hydration/echo barrier honored by involved store subscriptions and outbound map/token/combat synchronizers. Wrong-room, stale connection or superseded asynchronous join preparation cannot apply. Clear the barrier with `finally`; do not rely on 100/300 ms timers. Gameplay mutation APIs, event emitters and cloud autosave are not hydration APIs.

Three scopes:

- **Complete room:** replace all snapshot-owned domains and complete map set; clear absent optional domains to their documented empty/default projection, removing prior-room values. Never preserve stale cached entities from deleted maps.
- **Complete map:** replace that map record and every map-owned collection; preserve other maps only within the same current live room cache, then replace the active-map projection. No cache fallback repairs a missing declared fragment.
- **Partial compatibility/recovery section:** omission means do not touch unrelated sections; a present section is complete for its named collection and replaces it even when empty. Existing `sync_*` and combat-only payloads must not wipe unrelated maps. Live deltas remain deltas and never prove checkpoint completeness.

Live map deletion must leave valid accepted references before queuing its checkpoint: retain the existing default when still present; otherwise choose the lexicographically first remaining map, or null for none. Reassign affected live viewers/session assignments to that existing map (or no-map projection), and regenerate root mirrors. This is handling the explicit live delete action, not guessing deletions during legacy migration. Recovery queries never use a map-creating helper to repair unavailable IDs.

Canonical structural map collections are explicitly present, using current types: entity/terrain/wall/fog/light dictionaries and path/object/layer/DnD arrays. Deterministic legacy normalization supplies defaults only for genuinely absent optional fields, never for a failed read/malformed/partial candidate. Store methods/functions stay intact: replace owned **data fields**, not the whole Zustand store object.

| Domain / actual fields | Current application | Frozen P3 application / reason |
|---|---|---|
| `maps`, `defaultMapId` | Server UNION; client reset then metadata-only creation | REPLACE complete map dictionary/list, including full records; deleted maps absent. Do not seed a default map on an empty selected set. |
| Global/root gameState | Resume selectively MERGES/ignores globals | REPLACE selected global data; retain opaque optional fields; derive mirrors after replacement. |
| `map.tokens`, token `.state`, embedded `.creature` | Server dictionary MERGE; client add/load skips existing or regenerates portions | REPLACE exact map entity dictionaries and stable arrays; both `creatureTokens` and `tokens` aliases reflect identical projection. Preserve full record/state, no resource/default recomputation. |
| `map.characterTokens` | MERGE, clear/add/upsert; reduced fields | REPLACE full records, including snapshots/state/owner/player IDs. Runtime membership rebinding is separate from token data; do not generate a new token on resume. |
| `map.gridItems`, legacy `inventory.droppedItems` | MERGE/upsert, target replacement; setters may generate IDs/timestamps | REPLACE stable full collection; deterministic established ID projection only, no random IDs/Date.now on hydration. Empty means deleted. Complete-room apply removes stale other-map items. |
| `terrainData` | Resume MERGE; editor setter replaces and bumps render counter | REPLACE selected data. Live null-as-delete delta path remains separate. |
| `drawingPaths`, `drawingLayers` | Resume APPEND; setters replace/default empty layers | REPLACE exact ordered arrays, including explicitly empty; preserve authored duplicate-looking strokes. Presentation fallback layers must not become stored authored layers. |
| `fogOfWarData`, `fogOfWarPaths`, `fogErasePaths` | Resume MERGE/APPEND; optional preserve-fog fallback | REPLACE exact dictionaries/ordered arrays. Do not call `fog_update` or concatenate recovery paths. |
| `exploredAreas`, optional `exploredCircles/exploredPolygons`, `playerMemories` | MERGE/partial restore or clear on map switch | REPLACE within owner section when shared checkpoint contains them; preserve private historical caches separately, never union them into shared visibility. |
| `wallData`, `windowOverlays`, door `isOpen` inside walls/objects | MERGE or selected setters | REPLACE full wall/overlay/object records including stored door state; no door-toggle action or inferred default. No separate invented doors domain. |
| `lightSources`, optional `lighting` | MERGE; setter REPLACE | REPLACE owning data; no light-placement events or invented illumination calculation. |
| `environmentalObjects`, `dndElements` | Resume APPEND; setter/batcher side effects | REPLACE exact arrays/full object properties; direct silent data assignment. Preserve environmental objects separately from DnD elements. |
| `elevationData`, `rampData`, `sunSettings`, `viewMode` | Uneven restoration; sun setter merges/emits | REPLACE owning fields silently; no lost optional verticality/sun values. Pure rendering invalidation is allowed, not outbound edits. |
| Map `backgrounds`, `activeBackgroundId`, legacy background image, `gridSettings`; global `mapData/gridSettings` | Partial setters, stale cache defaults | REPLACE owned layouts and shared settings. Map-owned value applies when present; global value is documented fallback only when absent. Camera preference is a separate projection. |
| `combat`, `turnOrder`, `currentTurnIndex/currentTurn`, `round` | APPEND; start/next replay; active-only apply | REPLACE combat data directly using silent mapping below. False, null, zero and empty are meaningful. |
| `weather` global; `weatherEffects/atmosphericEffects` where stored | GM/global and browser variants, active-only join | REPLACE present owning snapshot data; disabled/none clears prior weather. Global server weather controls active shared weather; conflicting legacy aliases require diagnosis, not merge. |
| `audioState.playingTracks` | Persisted global; separate sync stops/plays engine | REPLACE durable track descriptors, preserve startedAt/options. Checkpoint hydration does not play/rebroadcast tracks or synthesize elapsed state. Existing audio-sync presentation remains separate and idempotent. |
| `activeSceneMode`, `activeLocationMapId`, `isFreeRoamAllowed`, `locationScenes` with `pins/partyMarker` | Partial join, starter seeding, map subset replacement | REPLACE shared scene state and room-owned scene pin/marker projections; deleted pins/scene records stay gone. Do not merge account world-map seed pins into selected room scene. |
| `travel` export fields | `importState` replaces with truthy fallbacks; server merges live update | REPLACE present stored export fields with nullish/type-aware rules; preserve zero, false and logs. No weather rolls, hour advance, encounter generation or gear/exhaustion effects. |
| `buffs`, `debuffs`; optional map `containers/creatures`; global `characters`, `inventory`, `notes`, other supported optional records | Condition add APIs, partial restoration, account migration | REPLACE owning snapshot section; preserve full JSON-safe records opaquely. Known display projection only; no condition add/tick/expiry/resource application, personal inventory import or promotion of `map.creatures` into another actor authority. |

Idempotence: `hydrate(S, hydrate(S, X))` has the same snapshot-owned data as `hydrate(S, X)` for all valid S. Assert deep equality of owned data, stable IDs and order; unrelated UI/functions are not checkpoint data. A repeat must not create new timestamp/ID/render-generation noise in persistent data. Render-only cache invalidation may occur on actual data change; a no-op identical snapshot must not become another outbound/store-derived save. Do not optimize merely by skipping a matching revision: if the projection was disturbed, reapplication must restore the same data.

## SILENT COMBAT HYDRATION

Current `startCombat(tokens, creatures, notification)` rolls initiative, sorts order, derives AP, writes character/party resources, starts timers and emits sync. Current `nextTurn` rolls again, advances round, changes movement/AP, schedules deferred resource/cooldown effects. Some recovery callers even supply its wrong argument shape. These methods remain valid gameplay operations; they are prohibited recovery mechanisms.

Silent mapping:

- `combat.isActive` → `combatStore.isInCombat` exactly; inactive checkpoint clears previous active projection.
- `turnOrder` → exact ordered snapshot, preserving initiative, `d20Roll`, current/max AP and all supported entry fields.
- `currentTurnIndex` → exact integer/null. Legacy numeric `currentTurn` maps only when index semantics are established by this known legacy producer; retain original field in preserved source/global data. Both supplied and disagreeing → diagnostic/reconciliation, not guessed priority.
- `round` → stored value including 0. Do not advance/recalculate.
- Empty order/inactive/null projection uses safe display index 0 if the UI requires it, while authoritative stored null remains null. Active index must be within order; malformed active state does not clamp into a new invented checkpoint.
- Supported optional JSON-safe `combat` fields, e.g. `currentTurnStartTime`, config/log/timeline/conditions/effects if present, survive unchanged. Only proven display mappings are applied; do not manufacture absent runtime Map/Set movement/timer state into durable data. Reset transient selection/drag state silently; rebuild a display-only timeline purely if needed.

Hydration must call **none** of: `startCombat`, `nextTurn`, `endTurn`, initiative/resource/cooldown processors, AI/RNG, condition-expiry/tick routines, AP spending/restoration, gameplay event emitters, quest rewards or actor consequence execution. No deferred timers from the hydration itself. Suspend affected subscribers for the whole application, not just function call sites.

## LIVE-MEMORY VS CLOUD AUTHORITY

An existing successfully constructed server room owns live authority even if `isActive:false` due to GM disconnect, no GM socket is connected, or persistence is unavailable. `isActive` is presence/listing metadata, not cloud freshness.

```text
if rooms has a usable live-authority room:
    authorize using existing trusted room identity/access context
    rebind current connection/membership as existing lifecycle requires
    send projection of current room.gameState
    never fetch/apply cloud gameplay state to replace it
else:
    classified coherent read
    select a complete supported snapshot or fail with its exact classification
    construct server authority once, without persistence/gameplay side effects
```

Use a per-room in-process single reconstruction promise/gate so simultaneous resumes cannot create two authorities; startup installs validated rooms without overwriting an already established live authority. On reconstruction, persisted sockets are not live membership: reset transport connections and rebuild them through join. Preserve stored stable token/actor references; do not guess new ownership or rewrite personal character identities. Session map-assignment projection can map the reconnecting session to a valid selected map; persisted old socket IDs cannot authorize delivery.

There is no ordinary rejoin/cloud-listener exception, even if cloud advertises a numerically higher revision. Diagnose that discrepancy without replacing live state. Explicit recovery/import in P3 targets scratch/new rooms only. Forced in-place restore of an active valuable production room is not authorized by this contract.

Join still carries owner character/profile payload under existing cooperative rules; it is not permission to apply browser/personal full-room snapshots or overwrite selected shared actor resources. P3 does not redesign P4 access policy or P7 personal-character reconciliation.

## CLIENT WRITER REMOVAL PLAN

| Path | Frozen disposition |
|---|---|
| GM join manager initialization; manager reload/autosave/cleanup force-save | **DISABLE IN ACTIVE MULTIPLAYER**. Stop timer/subscriptions before joining; cleanup cannot perform a last shared write. Server snapshot alone hydrates room. |
| `roomService.saveCompleteGameState`, `updateRoomGameState`, `updateGameStateSection` | **REMOVE shared-cloud write capability** from current room-state use. Explicit active GM save emits existing server save request, with no browser state replacement. Local saves go to local storage. |
| Arbitrary `roomService.updateRoom` | **KEEP metadata-only** with explicit field boundary; reject `gameState`, checkpoint fields and dotted equivalents. For any canonical room (including an inactive one), shared `name/description/settings` changes must be accepted by the server and checkpointed through P2, not applied as a browser-authoritative room snapshot. Metadata-only new drafts can still be edited before initialization. No hidden bypass. |
| `createPersistentRoom` | **KEEP metadata-only inactive draft**; first canonical state server/P2-written. Do not store browser-generated inline defaults. |
| Local conversion `RoomLobby.data.gameState` | **KEEP explicit NEW-TARGET import only**, complete validated selected draft; never merge on rejoin. Preserve original local export. |
| `useRoomPersistence` current shared collection/autosave/listener application | **DISABLE shared restoration/writes in active multiplayer**; any retained personal cache is inert. Provider unload/manual forceSave cannot restore or publish shared data. |
| Personal roomState map/combat/condition/position APIs | **CACHE/LOCAL DRAFT ONLY**, never authoritative store application during active multiplayer. Preserve existing personal docs; no account migration/deletion. |
| LocalRoomService/non-Firebase RoomStateService/App local entry/persisted maps | **LOCAL SANDBOX ONLY / CACHE ONLY**. Keep usability; entering multiplayer cannot carry them into shared state implicitly. |
| LevelEditorPersistenceService cache/hook load, import/copy and App cache fallback | **CACHE ONLY** in multiplayer; no automatic cache load/copy/import into authoritative shared projection. Cache writes may remain inert, labelled local, and cannot report checkpoint durability. Local editor use remains supported. |
| Settings/UI/actionbar/account character/journal services | **KEEP their existing personal scope**; no room-wide authority inferred. |
| OptimizedFirebase/RealtimeSync alternate room state lane | **DISABLE shared persistence**; metadata/chat-only operations may remain. No recovery from its alternate room-state cache. |
| `resolve_state_conflict` unrestricted browser full-state replacement | **DISABLE for active shared-room snapshot replacement**. This is not H4; selected artifact workflow is the only P3 replacement/import boundary. |

Guard service APIs as well as call sites, using explicit room scope; absence of a connected socket does not turn a multiplayer cache into a local sandbox. Cancel pending personal load/subscription callbacks when scope/room changes. No changes to broad Firestore access rules/P4 in P3: this freeze establishes supported application writer ownership, not hostile-client security certification. Old browser builds with whole-room writer code must not coexist during conversion; unexpected writer evidence stops affected conversion.

## PERSONAL STATE ALLOWLIST

From the actual current personal room doc:

- **Permitted presentation restoration:** `mapData.cameraX`, `mapData.cameraY`, `mapData.zoomLevel`, when finite/in range and explicitly scoped to the current room/map. Apply only as local preference after authoritative map selection; never defeat a pending server map transfer/initial camera lock. These fields exist in personal `saveMapData/loadMapData`; the current `useRoomPersistence` collector itself contains no camera preferences.
- **Permitted bookkeeping/cache display, not table application:** `roomId`, `lastUpdated`, `lastWriteToken`, `version`; retained raw shared sections may be available for explicit export/draft comparison. Their presence confers no authority.
- **No other personal room-state field may restore an active shared store.** Specifically deny `characterTokens`, `creatureTokens/tokens`, `gridItems`, `environmentalObjects`, `combat`, `buffsAndDebuffs`, `chatHistory` into shared/live notifications, `levelEditor`, backgrounds/background images, `activeBackgroundId`, grid layout, fog/exploration/memory, scene pins and shared actor data.

Existing separate settings store/UI/window preferences and local character actionbar remain personal through their own existing services. Do not invent new preference fields or apply personal inventory/quests/resources through the room snapshot listener. Local `applyPlayerState` including exploration merge remains local-only; it cannot be invoked as multiplayer room reconstruction.

## LEGACY ROOT-MIRROR POLICY

Keep `gameState.tokens`, `characterTokens`, `gridItems` as **derived in-memory/wire compatibility projections** until exact consumers migrate. Do not store duplicate authoritative collections inside canonical global payload.

- Canonical reader builds them from selected map fragments, never from stale root inline documents. Map fragments win by ownership, not an arbitrary legacy storage preference.
- Mirror dictionaries contain the current union of map entities keyed by stable entity IDs, carrying correct `mapId`. Rebuild after complete hydration and map deletion; never copy deleted map entities from old mirror/cache.
- Current token protocol uses globally addressed root IDs (`tokens_delta` builder and character-token lookup in `server/handlers/tokenHandlers.js`; movement flush in `syncService.js`; client join's embedded creature-definition discovery). Preserve that representation and map-scoped recovery checks.
- Duplicate IDs across maps that make root projection non-injective are invalid for canonical publication; legacy cases require explicit repair/selection, not overwrite-one-in-enumeration-order. No new composite-ID protocol in P3.
- Root/per-map recovery ambiguity checks must treat these derived canonical mirrors as projections. P1's rejection of genuinely valuable legacy-only content and cross-map relabelling stays intact.
- Root `levelEditor/fogOfWar/mapData` historical aliases may be preserved opaquely when selected; they are not fallback authoritative map data once canonical map fragments exist. Root-only legacy adaptation handles them explicitly before first conversion.
- Removal requires a separately scoped migration of identified consumers and compatibility fixtures. Not authorized here.

## OPTIONAL / UNKNOWN FIELD PRESERVATION

Separate **preservation** from **interpretation**:

1. Validate known structural boundaries explicitly: room/global/map records, declared IDs, entity dictionaries, collection arrays, full combat order/index and map scopes. Preserve actual unknown fields on validated owning records.
2. Supported opaque values are JSON null/boolean/string/finite number, arrays (including nested arrays) and safe-key plain records. Record-only undefined optional properties may be omitted as existing JSON capture does; undefined array elements, sparse arrays, NaN/Infinity, functions, symbols, BigInt, cycles, unrecognized SDK objects and executable/reserved unsafe keys must be diagnosed/rejected, not converted silently into authoritative null/empty.
3. Known legacy Date/Timestamp fields may normalize to documented ISO/epoch representations only at named boundary mappings, with raw originals exported. Raw candidate exporter preserves SDK types losslessly. No generic eval/reviver, prototype merge or property-path execution.
4. Canonical snapshotJson round trip preserves every supported field at the same owning path. Unknown fields are not spread into store methods, accepted as arbitrary gameplay patch operations, recomputed or given mechanics.
5. Keep opaque fields in server accepted snapshot/full room projection and map cache so reserialization does not enumerate them away. Browser projections are not re-collected as server save authority. An explicit known edit may replace its owned section; hydration itself cannot strip optional siblings.
6. Newer **structural schema** is not opaque optional data: unknown header/envelope → read-only, raw export, no rewrite.

P3 does not repair all condition/actor gameplay schemas. Preserve current `buffs/debuffs`, map `creatures/containers`, notes, accepted optional fields, and explicitly diagnose unsupported shape rather than silently narrowing them. No personal-character migration, HP/AP heuristic merge or speculative new zone/effect state.

## EXPORT / RESTORE FIXTURE

Provide a narrow operator/test fixture using existing Node/Admin/crypto/filesystem; one selected room per invocation. It must support `export selected room/candidate`, `validate artifact`, `restore artifact into explicitly named scratch room`. No account enumeration/backup UX required.

Artifact fields:

```text
artifactFormat: "mythrill-room-checkpoint-export"
artifactVersion: 1
artifactId, exportedAt, sourceRoomId
classification, selectedCandidateId, diagnostics
checkpoint: {schemaVersion, revision, mapIds, contentHash, provenance} | null
roomMetadata: {name, description when present, settings} # selected shared metadata
globalData, mapFragments: [{mapId, data}]                 # selected decoded data
rawCandidates, rawDocuments                             # lossless tagged evidence
selectionDecision                                      # H4 evidence or null
ancillary                                               # clearly non-checkpoint data
sha256                                                  # artifact integrity
```

Unknown/incomplete/ambiguous export may have no decoded selected data. It is exportable evidence, **not restorable authority**. Validate checksum, supported versions, complete selected map set, structural scopes, optional JSON values and supported publication envelope before applying/writing anything.

Scratch restore:

1. Explicit emulator/staging/scratch destination; new `scratch_...` ID, different from source. Reject existing destination by default, all active live targets and casual source-ID overwrite. No production target authorization is implied.
2. Build new target metadata under test operator identity; copy selected name/description/shared settings, but do not import source members, socket IDs, password/access fields as authority. Preserve original access/transport values inside artifact only.
3. Use same reader/codec/P2 publisher, normal target revision allocation. Source revision is provenance, not target revision reuse. Content hash remains equal when owning snapshot content is unchanged.
4. Re-read target through completeness predicate; silently hydrate target; compare owning data/hash/declarations. Repeated hydration is identical. A repeat of the exact same restore artifact into its same known scratch target may return the already verified restore receipt/revision without rewriting; different artifact/existing target is refused.

No broad production restore endpoint. No restoration into the source room simply because its ID is in the file.

## ROLLBACK CONTRACT

- Retain verified pre-migration raw export, excluded candidates, conversion decision and provenance. Never automatically delete the only readable candidate, old extra fragments, local draft, raw artifact or valuable optional field.
- Disable canonical writes through a bounded server feature gate returning unavailable/unsaved while live room remains authoritative. Do not revert to browser/inline/optimized writers.
- A safe code rollback retains supported classified reader and silent hydration; versions it cannot read are read-only with explicit unsupported status. Pre-P3 binaries have no schema-aware reader and must not serve converted rooms: do not assume they will safely detect newer format.
- Code rollback **does not rewind accepted table state** or undo committed checkpoints. To inspect/recover earlier content, restore the selected retained artifact into scratch, compare and obtain explicit separate in-place recovery authorization if ever needed.
- Retain in-memory unsaved/recovery state under P2 bounds and expose its existing pressure/deadline limits honestly. This is not a WAL/crash-recovery guarantee for unconfirmed changes.

## P2 INTEGRATION

Keep P2's full-snapshot coalescing, one in-flight attempt per room, bounded retries/retention/waiters, independent-room progress, exact outcome/status delivery, final deadline, lost-durability tombstone/overflow accounting and temporary-room eligibility.

Minimal adapter integration:

- Pass captured attempted revision and small immutable metadata capture as persistence context, e.g. `persist(roomId, capturedSnapshot, {revision, roomMetadata})`; existing two-argument test injections remain valid JS callers. Production persistence must require trusted revision context; no second internally allocated checkpoint number. Capture metadata from current server room during admission; keep standalone test injections compatible.
- Trusted room metadata/seed/high-water comes from existing live server context. No client-supplied writer revision accepted.
- Initial metadata save, explicit save, automatic save, migration conversion and scratch restore all reach the selected writer. A metadata helper may not write gameState/fragments directly.
- `confirmedRevision` advances only when complete publication R is confirmed. Older R confirmation while R+K is queued preserves P2's newer pending state and reports highest true confirmation; unsaved newer state is never labelled cloud-saved.
- No direct Firebase fallback in registered explicit-save path. No transient bool `true` from a preparation/global/fragment write. `normalizeRoomWriteOutcome` compatibility can remain for P2's injected boundaries, but canonical publisher returns explicit outcomes.
- Existing P2 split-order tests must retain their **behavioral assertions** while updating only storage-boundary fakes to one delayed/rejected atomic commit and revision context. Do not remove tests or dilute assertions because physical shape changed.

## REQUIRED IMPLEMENTATION FILES

Current files likely to change; responsibility only, not a mass refactor mandate:

| File | Bounded responsibility |
|---|---|
| `server/services/firebaseService.js` | Classified coherent reader, canonical atomic publication, metadata-only helpers; retire split/inline room-state writes and recovery account migration. |
| `server/services/syncService.js` | Pass captured revision, seed/high-water from trusted room, preserve P2 invariants; refresh root mirrors where needed for movement compatibility. |
| `server/handlers/roomHandlers.js` | Read-only construction, replacement reconstruction, startup classified load; no resume merge or startup save. |
| `server/handlers/roomLifecycleHandlers.js` | Live-room-first resume, single absent-memory reconstruction, bounded classifications, creation-only validated local import. |
| `server/handlers/syncHandlers.js` | Same-writer explicit save, full recovery projection/adapter envelope, P1-compatible partial events; disable browser unrestricted conflict replacement. |
| `server/handlers/mapHandlers.js` | Complete map recovery from existing live record; no map creation on read; correct `state`/editor recovery envelope and stale mirror removal after map deletion. |
| `server/handlers/gmActionHandlers.js` | Position-recovery nonmutating map lookup and complete map transfer projection only; no GM gameplay redesign. |
| `server/handlers/tokenHandlers.js` | Only if needed to keep derived root projections aligned; preserve both P1 token capability modes. |
| `server/services/optimizedFirebase.js`, `realtimeSync.js` | Block alternative shared state persistence; no new activation or engine refactor. |
| `vtt-react/src/components/multiplayer/roomJoinHandler.js` | One silent complete snapshot apply; no GM cloud reload/autosave; no async domain-by-domain race. |
| `vtt-react/src/components/multiplayer/socketHandlers/{audioGameSessionHandlers,combatHandlers,mapGridHandlers,gmHandlers}.js` | Route full/section/map recovery through adapter, preserve delta paths/room scoping, silent combat. |
| `vtt-react/src/services/{gameStateManager,roomService}.js` | Close browser whole-room writer/loader; metadata-only draft creation and local/server-save scope. |
| `vtt-react/src/components/multiplayer/RoomLobby.jsx` | Metadata-only new room and explicit new-target local import; no ordinary resume snapshot override. |
| `vtt-react/src/hooks/useRoomPersistence.js`; `components/providers/PersistenceProvider.jsx` | Personal allowlist/cache-only application and force-save/unload guards, cancelled stale async callbacks. Guard only room/active shared scene overlap; no P5 worldbuilding migration. |
| `vtt-react/src/services/firebase/roomStateService.js` | Personal cache/draft scope and camera-only projection support if retained; no shared store restore. |
| `vtt-react/src/hooks/useLevelEditorPersistence.js`; `services/levelEditorPersistenceService.js` | Explicit cache-only behavior and no active-multiplayer automatic load/copy/import; preserve local cache usability. |
| `vtt-react/src/store/{combatStore,levelEditorStore,mapStore}.js` | Narrow silent data entry/barrier and full cache preservation only where required; no gameplay/editor rewrite. Other stores already expose direct setState/collection replacement. |
| Existing `server/server.js`, socket registration/test helpers | Wiring only where needed to supply selected writer/reader/context; no transport/middleware redesign. |

New small files permitted: one server room-checkpoint codec/classifier helper, one client silent room-snapshot adapter, one selected-room export/restore operator fixture, focused tests/fixtures. LocalRoomService/App local paths require changes only if a named scope guard or silent combat adapter is necessary to preserve existing local usability. No speculative store/service framework, new dependency, broad giant-file extraction or Project 4 file work.

## REQUIRED TEST MATRIX

Meaningful executable fixtures must fail against the named current defects. Use in-memory boundaries for classifier/fault tests, actual installed Admin SDK with isolated Firestore emulator for atomic publication/consistent reads, real registered server stack for save/join/recovery, and real frontend stores for hydration. No production credentials/data. Unit mocks alone do not prove Firestore atomicity.

| ID / concrete test name | Required assertion |
|---|---|
| 01 `canonical_inline_equivalent_round_trip` | Root-only legacy-equivalent content normalizes into canonical single-map split and returns identical supported data. |
| 02 `canonical_split_multimap_round_trip` | Two+ maps/global reconstruct entirely at one schema/revision/hash, including inactive combat. |
| 03 `legacy_inline_only_R1_preserves_maps_combat` | Loader returns actual inline maps/combat without fragments; no `{}` replacement. |
| 04 `legacy_split_only_structural_candidate` | Current flat current/map physical fixture reads as labelled legacy candidate without pretending it is versioned. |
| 05 `legacy_both_equivalent_or_hash_bound_selection` | Equivalent candidates or exact recorded selection provide trustworthy selection; retain raw companion. |
| 06 `legacy_both_conflicting_unversioned_H4` | Ambiguous status, both raw candidates intact, zero conversion; arbitrary newer lastActivity does not pick winner. |
| 07 `partial_split_is_not_empty_or_complete` | Missing current/required map, lone current, malformed map are distinct errors; no hydration/write. |
| 08 `stale_fragments_outside_manifest_ignored` | Old deleted map/old inline survives physically but never joins selected checkpoint. |
| 09 `unknown_schema_preserved_read_only` | Newer root/fragment version cannot fall back/rewrite; raw export lossless. |
| 10 `absent_permission_network_unavailable_distinct` | True root/subcollection absence, orphan fragments, metadata-only draft and failed reads have distinct results; no destructive default save. |
| 11 `same_checkpoint_1_2_10_hydrations_identical` | Deep equality of all snapshot-owned data with stable IDs/order; disturb projection then reapply same revision restores it. |
| 12 `drawing_arrays_no_append_or_dedupe` | Repeated apply preserves count/order, including deliberately identical-looking strokes and empty layers. |
| 13 `fog_paths_and_erase_paths_replace` | No concatenation/union; explicitly empty clears previous paths. |
| 14 `deleted_token_and_character_token_stay_deleted` | New checkpoint excludes entity; repeat/restart/mirror regeneration never resurrects it. |
| 15 `deleted_map_and_objects_stay_deleted` | Map/object/item deletion persists despite stale docs/root caches; empty declared set handled explicitly. |
| 16 `optional_fields_nested_arrays_lossless` | Unknown JSON-safe fields on global/map/combat/entity records, nested item shape arrays, elevation/ramp/sun, travel zero/null and location/audio fields survive unchanged. |
| 17 `silent_combat_no_rng_events_resources_timers` | Spies on RNG, gameplay methods, socket emits, AP/HP/mana/class-resource/cooldown/conditions/AI show zero; inactive/null/round0/index0 restore correctly. |
| 18 `live_unsaved_authority_wins_all_rejoins` | GM create-resume, ordinary join/reclaim and simultaneous joins never apply older cloud; disconnected/inactive live room retained; cloud outage does not erase it. |
| 19 `gm_join_autosave_cleanup_no_shared_firestore_write` | Join/time advance/cleanup/manual save cannot write shared state from browser; manual request reaches P2 only. |
| 20 `personal_remote_wins_cannot_clobber_room` | Initial load/remote/conflict/unload/delayed old-room callback cannot change any shared domain; only validated camera preference projection allowed. |
| 21 `batch_operation_preflight_500_boundary` | M=498 fits operation cap if bytes fit; M=499 rejected before any write; count root/global. |
| 22 `document_utf8_preflight_900KiB_boundary` | Root/global/map over safety estimate fail before writing; non-ASCII and long paths/retained root fields counted; one oversized map not chunked. |
| 23 `atomic_fragment_construction_and_commit_failure` | Inject failure preparing one fragment and backend atomic commit rejection: zero new committed head/subset; previous complete checkpoint still readable. |
| 24 `P2_confirmed_only_after_complete_commit` | Deferred commit leaves unsaved/pending; global prep alone cannot confirm. Newer queued snapshot remains pending after older real commit. |
| 25 `selected_export_restore_scratch` | Export/validate/new scratch publication/reread compare owning data/hash; source/access metadata not overwritten. |
| 26 `same_restore_artifact_idempotent` | Same scratch restore receipt/revision reused, repeated hydration equal; different/existing/live/source target refused. |
| 27 `old_new_recovery_payload_compatibility` | Full-room/full-map plus tokens-only/grid-only/character-only/combat-only payloads: present empty clears owned section; omitted section preserved; P1 requested-map routing/error fixtures unchanged. |
| 28 `P1_focused_regression` | `server/tests/productionSocketContract.test.js` all green including real middleware, ambiguity/scoping, both token modes. |
| 29 `P2_focused_regressions` | All four roomSave focused suites remain behaviorally green; no loss of bounds/ordering/deadline/status/overflow invariants. |
| 30 `request_size_8MiB_preflight` | Many individually valid docs exceeding aggregate estimate reject with zero writes. |
| 31 `mixed_revision_hash_marker_mapset_rejected` | N globals plus N-1 map, missing marker, bad hash, duplicate map ID, conflicting payload ID each fails deterministically. |
| 32 `coherent_read_during_atomic_publication` | Emulator reader concurrent with publication observes old complete or new complete, never a mixed accepted snapshot; no lazy fragments outside read snapshot. |
| 33 `revision_restart_eviction_retry_lineage` | Seed from saved R, first allocation >R, record eviction keeps high-water, failed retries same R/hash, skips allowed, equal/different hash refuses. |
| 34 `uncertain_commit_ack_verified_once` | Lost commit response is not false success; coherent identical publication proves confirmation on retry, no newer head overwrite. |
| 35 `large_small_large_never_changes_canonical_lane` | Legacy dual/partial variants preserved; after selected conversion every size uses canonical split, no inline fallback/stale-map resurrection. |
| 36 `migration_export_failure_and_stale_choice_stop` | Export failure/hash mismatch/changed raw candidates produce zero conversion; startup/autosave never migrate or write account characters. |
| 37 `hydration_barrier_no_echo_or_stale_async_apply` | Drawings/DnD/sun/token/condition stores produce no outbound edit/autosave; superseded room callback cannot overwrite current projection. |
| 38 `root_mirrors_derived_and_lossless` | Consumers continue, correct map scope/deletions; conflicting root-only content/duplicate IDs diagnosed rather than silently dropped. |
| 39 `local_sandbox_persistence_usable` | Existing local save/load and explicit new-target import continue; multiplayer cache cannot impersonate local mode. |
| 40 `alternate_writer_and_browser_conflict_bypasses_closed` | Metadata updater, optimized state lane, direct fragment APIs, resolve_state_conflict cannot publish/apply another shared snapshot. |
| 41 `invalid_unknown_values_fail_without_narrowing` | Unsupported functions/cycles/NaN/unsafe keys/sparse arrays rejected with path; raw artifact remains available; valid unknown fields preserved. |
| 42 `single_concurrent_reconstruction_no_save` | Startup/GM resume race installs one authority, sends its projection, no whole-room/account writes merely to load. |
| 43 `room_metadata_captured_with_revision` | Queued shared name/description/settings are immutable and published in the same root batch operation; later metadata edit does not change an older in-flight capture; scratch restore preserves shared settings without importing access identity. |
| 44 `editor_cache_cannot_overwrite_checkpoint_projection` | Room-change hook, cache fallback/copy/import and delayed callback cannot restore older terrain/fog/drawings/objects over active server-selected state. |

Baseline run during this freeze (no P3 changes):

```powershell
node --require "D:\AppData\Temp\opencode\p1-senior-preload.cjs" "node_modules\mocha\bin\mocha.js" "tests/productionSocketContract.test.js" "tests/roomSavePersistence.test.js" "tests/roomSavePersistenceBlockers.test.js" "tests/roomSaveFinalClosure.test.js" "tests/roomSaveLostDurabilityAccounting.test.js" --timeout 10000 --exit
```

Working directory `D:\VTT\server`; **89 passing (10s)**, exit 0. Existing external preload stubs credential loading and disk logger; no cloud contacted. This is regression baseline evidence, not P3 acceptance. Implementation must run these focused suites, new P3 server/frontend suites, relevant combat/map/token/local regression suites and lint for touched files. Broaden tests only for failures/new concerns. Existing tests asserting resume concatenation must be replaced with the new explicit P3 replacement contract; do not retain the defect to keep such tests green.

## REQUIRED MANUAL REHEARSAL

Isolated local emulator or explicitly designated staging room only. Use Playwright for GM + observer interaction/state assertions, accessibility snapshots for save/error surfaces, and store/network/server data assertions for actual counts and revisions. No production data.

1. Create test room with maps A/B; place stable-ID creature/character tokens, grid items, environmental objects/DnD elements, walls/door/light, drawings, fog/erase paths on each. Start combat once as gameplay; retain chosen turn order/AP/round/index and optional fixture fields.
2. Explicit save. Record complete manifest R/hash/map IDs, serialized global/maps and per-domain counts; GM and observer show cloud confirmation R only after commit.
3. Disconnect clients; stop and restart test server. Resume; compare actual data, IDs/order/counts, R/hash and combat resources; zero gameplay/RNG/event effects during recovery.
4. Resume same room again. Counts/data/revision identical; no GM browser/cloud competing write. Check both map projections and observer.
5. Delete a token, object and one authored map element; remove map B after recording contents if desired. Save R2>R. Leave its stale physical map document in the test database to test exclusion.
6. Restart/resume. Prove each deletion remains in server state, browser stores and derived mirrors; no stale map/element recreated.
7. Export R2 to a verified selected artifact. Restore into new scratch room with operator-owned metadata. Re-read/validate; compare data/hash/declarations (target revision/source provenance may differ). Repeat hydration/restore receipt and compare again.
8. Prepare a further changed snapshot, inject one fragment-construction or atomic backend-write failure. Verify retained UNSAVED with old confirmed R2, no `room_state_saved`, and no falsely complete head/new subset. If testing uncertain transport acknowledgement separately, classify unknown until coherent proof rather than assume backend rejection.
9. Remove fault and retry; only complete successful publication advances confirmed revision. Record exact environment, faults, artifacts, count/data comparisons, browser/server evidence and test revisions.

Do not claim rehearsal complete from mock tests or screenshots of unchanged UI. The architecture task did not perform this future implementation rehearsal.

## BACKWARD COMPATIBILITY

- Current inline/split legacy candidates remain readable under classified selection; preserve their raw forms. No routine small/large threshold flip after conversion.
- P1 acknowledgements, trusted identity/membership, requested-map routing, same-room targeted sync, optional legacy routing fallback and both token capability modes remain.
- Partial old recovery packets preserve unrelated sections; present empty is meaningful. They cannot manufacture checkpoint completeness or overwrite server authority.
- Keep root mirrors in memory/wire until consumers migrate. Preserve local/offline/sandbox workflows as explicit local scope.
- Browser metadata-only drafts are supported; metadata listings do not decode checkpoints as live state. Existing consumers such as `sharedCampaignService.loadCompleteGameState` must use supported decoded read/export or remain explicitly unsupported, never publish malformed envelope as content. Repair only the changed read boundary, not the unrelated campaign feature.
- Canonical format requires a compatible client/server reader/writer rollout. Old whole-room-writing clients and pre-P3 readers are not safe participants in converted rooms. P3 does not authorize rules/deployment work to hide that incompatibility.

## MIGRATION SAFETY

One selected room at a time, verified raw rollback artifact first, explicit complete candidate, no deletion inference and no mass migration. Export and choices are bound to exact captured data. Conversion publication is atomic; failed conversion preserves previous storage and accepted live state. Legacy ambiguity/incompleteness/unsupported versions stay distinguishable and read-only where necessary. Cloud-saved never means personal/local cache saved.

Strongest/senior review of codec, publication limits, migration, raw export and rollback is required before **any live valuable-room conversion**, as the roadmap specifies. No live conversion is authorized by this architecture task.

## HUMAN DECISIONS STILL REQUIRED

**None currently block implementation.** H4 will be required only for an actually encountered specific conflicting valuable legacy room without trustworthy precedence, or a proposed selected candidate that would discard accepted live edits. Freeze the procedure; do not manufacture a creator choice now. Canon/gameplay/security/product decisions outside P3 stay outside P3.

## IMPLEMENTATION STOP CONDITIONS

Stop the affected operation/project amendment at the smallest relevant scope if:

- It would guess a legacy winner, merge/dedupe valuable candidates, infer authored deletion, or discard the only rollback copy.
- A selected room/map exceeds frozen envelope. Report unsaved/too-large; do not expand to chunking or partial publication. This blocks that room's save, not unrelated supported implementation/tests.
- Atomicity demands multiple publication batches, independent map writes, an early marker, a new provider/history platform or unbounded queues.
- Unknown/newer/incomplete format would become empty, absent or rewritten through legacy fallback.
- Rejoin/cloud/personal state would replace usable accepted live room memory; a hydration path calls gameplay or emits edits.
- Revision seed/context is unavailable, conflicting or unsafe; source data cannot be normalized losslessly; raw export/selection fingerprints changed; old competing writers are still observed during conversion.
- P1/P2 invariants regress, testing is diluted, or work expands into P4 access/security, P5 account migration, P7 actors, class/creature rules, zones, editor/render rewrite or broad refactor.

Capture exact evidence, retained data, affected files and bounded proposed amendment; do not reinterpret the freeze inside implementation. No commit/push/deploy or next-project start without explicit separate authorization.

## DEEPSEEK IMPLEMENTATION INSTRUCTIONS

1. Implement **Project 3 only** against current dirty source; read this contract and roadmap first. List exact intended files before edits. Preserve locked P1/P2 behavior and owner work.
2. One server checkpoint writer; one room-only format; root committed manifest + current + declared map documents; one batch `M+2`, no arbitrary chunks/history.
3. P2 attempted revision equals checkpoint revision; seed from complete durable/live high-water; only complete atomic commit confirms; retain bounded failures honestly.
4. One coherent classified reader; no bare-null read failure, no mixed candidate/fragment assembly, no unknown-version downgrade.
5. Legacy conversion only after explicit selection/save and verified raw export; H4 stops specific ambiguous room conversion. Never guess/merge/dedupe candidates.
6. Replace snapshot-owned collections, including empty/deleted state; preserve supported opaque optional fields. Root entity mirrors derive from selected maps.
7. One silent adapter for join/recovery/restore; no gameplay/RNG/resource/event/timer replay, no outbound hydration echo, no late async overwrite.
8. Usable live room wins every ordinary rejoin. Browser/personal snapshots cannot become shared authority; local workflows stay explicitly local.
9. Selected-room export/validate/scratch-restore fixture only. No casual production overwrite or bulk migration.
10. Pass the frozen tests and real staging/local rehearsal, then stop for senior review. Report actual evidence, remaining gates and unsupported cases; do not claim deployment or begin P4.

## FINAL ARCHITECTURE DECISION

The smallest supported architecture is the existing server live room, locked P2 writer with revision context, one atomic versioned global/map checkpoint, one classified coherent reader, and one silent replacement hydration boundary. Legacy ambiguity is preserved and delegated to the creator only when real room evidence requires it. Limits reject honestly rather than introducing another persistence platform.

PROJECT 3 ARCHITECTURE IS FROZEN; DEEPSEEK IMPLEMENTATION MAY BEGIN.
