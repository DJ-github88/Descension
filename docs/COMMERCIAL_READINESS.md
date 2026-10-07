# Commercial Readiness Audit — Mythrill (Descension)

Status: **READ-ONLY AUDIT. No application code was modified to produce this document.**
Date: 2026-10-03
Auditor role: Release Reliability Engineer
Audience: Engineering owner, future architecture agent, investors/operators evaluating paid launch

> **Read this first (project context).** This repository is simultaneously a functioning
> VTT, an original TTRPG implementation, a structured game-content database, a
> franchise/worldbuilding repository, and a concept archive. `UNUSED BY APPLICATION != SAFE TO DELETE`.
> Current source code beats historical documentation (`AUDIT_REPORT.md`, roadmaps, checklist
> files). All conclusions below are anchored to the current worktree; where the evidence is
> insufficient the finding is explicitly marked **UNKNOWN**.

---

## 0. Method, evidence hierarchy, and reproduction

### 0.1 What was inspected

- The multiplayer server (`server/`), all registered socket handlers, services, tests, and scripts.
- Firestore and Storage security rules (`firestore.rules`, `storage.rules`) and Cloud Functions (`functions/`).
- Client persistence, auth, subscription, offline, upload, and sync services under `vtt-react/src/services`, the Zustand stores they persist, the hooks that drive autosave, and the providers that hydrate per-user data.
- Deployment pipelines (`/.github/workflows/deploy.yml`, `netlify.toml`, `config/netlify.toml`, `deploy-rules.bat`, `server/nixpacks.toml`, `Dockerfile`).
- Test suites (`server/tests/`), and the currently running local frontend on `http://localhost:3000`.

### 0.2 Evidence hierarchy used

1. **Executed evidence** — targeted tests or instrumented reproductions (highest confidence).
2. **Direct source evidence** — exact file and line references for runtime paths.
3. **Documented claims** — comments, README/roadmap files; treated as claims to verify, not facts.
4. **Inference** — labeled as such; never presented as a confirmed defect.

### 0.3 Tests actually executed during this audit

Command (from `server/`):

```
.\node_modules\.bin\mocha.cmd tests/socketAuthMiddleware.test.js tests/tierService.test.js
  tests/roomHandlers.test.js tests/combatAuthority.test.js tests/combatHandlers.test.js
  tests/combatSchemas.test.js tests/tokenHandlers.test.js tests/sessionHandlers.test.js
  tests/relayHandlers.test.js tests/rateLimitService.test.js tests/multiplayer.integration.test.js
  --timeout 15000 --exit
```

Result: **115 passing** against real production handlers over a real socket.io transport
(the integration harness is `server/tests/helpers/integrationServer.js`; it stubs Firebase
I/O, which the report calls out wherever it matters).

Additionally, a throwaway script (outside the repo, in the session temp directory) stubbed
`firebase-admin` and `services/logger` and executed three real code paths. It confirmed:

1. `firebaseService.getRoomData()` **discards** a room document's inline `gameState` and returns `{}` when the split-storage subcollection fragments do not exist — even though the document contained maps and combat state.
2. `FirebaseBatchWriter.flush()` treats `updateRoomGameState() === false` as success: a single attempt, the write is dropped, and the pending queue is cleared.
3. `mergeRoomGameStateForResume(state, state)` duplicates `drawingPaths`, `environmentalObjects`, and `combat.turnOrder` (length 2 for each).

### 0.4 What was NOT done

- No playtesting of game balance or gameplay correctness.
- No live Firestore/Storage writes were made; no production data was touched.
- No rules emulator tests were run (no rules test harness exists in the repo — itself a finding).
- No load/soak testing. Performance labels are static-analysis judgments, not benchmarks.

### 0.5 Status labels

| Label | Meaning |
| --- | --- |
| **CURRENTLY STRONG** | Implemented, defense-in-depth, tested or structurally sound. |
| **ADEQUATE FOR PRIVATE USE** | Works for a trusted table/friends; known gaps acceptable short-term. |
| **NEEDS WORK BEFORE BETA** | Should be fixed before inviting external testers at scale. |
| **NEEDS WORK BEFORE PAID LAUNCH** | Blocks taking money / promising durable campaign storage. |
| **UNKNOWN** | Insufficient evidence; explicitly not guessed. |

### 0.6 Worktree caveat

The worktree was heavily dirty during this audit (pre-existing owner changes plus untracked
files such as `server/handlers/questHandlers.js`, `server/handlers/gmToolsHandlers.js`,
`vtt-react/src/store/persistenceStatusStore.js`, `vtt-react/src/utils/sanitizeHtml.js`).
All findings describe the worktree **as it existed on 2026-10-03**, including those
untracked files. This audit did not revert, clean, stage, or commit anything.

---

## 1. Repository and runtime map

### 1.1 Top-level layout

| Path | Role |
| --- | --- |
| `vtt-react/` | React 18 (CRA + CRACO) frontend: UI, Zustand stores, client persistence, Firebase SDK access |
| `server/` | Node 20 + Express + Socket.IO authoritative multiplayer server, Firebase Admin SDK |
| `functions/` | Firebase Cloud Functions v2 (storage quota triggers, cascade storage cleanup) |
| `firestore.rules`, `storage.rules`, `firebase.json` | Security rules and deployment config |
| `docs/`, `*.md` at root | Lore, design, audits, roadmaps (historical context; verify against source) |
| `.github/workflows/deploy.yml` | CI: frontend build/test + server tests + Netlify deploy |

### 1.2 Server entry points (`server/server.js`)

1. Environment validation (production/Railway only): `scripts/validate-env.js` (root), lines 46–57.
2. Socket.IO middleware order (server.js:126–180):
   - sanitization (`createSanitizationMiddleware`),
   - Joi validation (`createValidationMiddleware`),
   - rate limiting (`rateLimitService.createMiddleware`),
   - optional Redis adapter + Redis rate-limit store (only when `REDIS_URL` is set),
   - authentication (`createSocketAuthMiddleware`).
3. Express routes: `GET /health`, `GET /metrics` (unauthenticated), `GET /debug/logs` (token-gated, fails closed), `GET /api/rooms` (behind `express-rate-limit` 100/15 min).
4. In-memory authoritative stores: `rooms`, `players`, `parties`, `userToParty`, `partyInvitations`, `onlineSocialUsers`, `pendingPartyCreations` (server.js:189–198).
5. Sync services: `FirebaseBatchWriter` (500 ms interval, max 50 rooms) and `MovementDebouncer` (50 ms) created in `server/services/syncService.js`.
6. Handler registration: `server/handlers/socketHandlers.js:603–655` registers 20+ domain handler modules per connection.
7. Startup: `initializePersistentRooms()` hydrates `rooms` from Firestore where `isActive == true` (`server/handlers/roomHandlers.js:378–407`, `server/services/firebaseService.js:692–792`).
8. Shutdown: SIGINT/SIGTERM flush the batch writer (`server/services/syncService.js:281–299`); `uncaughtException` logs and exits after 1 s **without** a final flush (server.js:347–351).

### 1.3 Persistence surfaces (client)

| Surface | Mechanism | Canonical write path |
| --- | --- | --- |
| Character document | `characters/{id}` (nested schema) | `vtt-react/src/services/firebase/characterPersistenceService.js` (`runTransaction` for create/delete, `updateDoc` for save) |
| Character runtime state (HP/inventory/buffs) | `users/{uid}/characterStates/{characterId}` | `persistenceService.saveCharacterState` → `characterStateService` |
| Room runtime state (client mirror) | `users/{uid}/roomStates/{roomId}` | `persistenceService.saveRoomState` → `roomStateService`; synced via `useRealtimeSync` |
| Journal | `users/{uid}/journal/main` | `journalService.saveJournal` |
| Worldbuilding (books, worlds, factions, timelines, family trees, lineages, interactive maps, quests, entity graph, deities, languages) | one document per category: `users/{uid}/worldbuilding/{category}` | each Zustand store's `syncToCloud` (full `setDoc` overwrite of that doc) |
| Campaigns | one document for **all** campaigns: `users/{uid}/worldbuilding/campaigns` | `vtt-react/src/services/campaignService.js` |
| Server-authoritative room state | `rooms/{roomId}` + `gameState/current` fragment + one doc per map + `chat` subcollection | `server/services/firebaseService.js` |
| Assets | Firebase Storage `users/{uid}/{category}/...` | `uploadService.js` (WebP compression, quota pre-check) |

### 1.4 Runtime data-flow (multiplayer)

```
Client (React/Zustand)  --socket.io-->  server handlers mutate in-memory room.gameState
       ^                                          |
       |                                          v
       +---- broadcasts (io.to(room)) <---- FirebaseBatchWriter (500ms, retry x3)
                                                  |
                                                  v
                                        firebaseService.updateRoomGameState()
                                        saveRoomDataSplit() for >100KB
```

Two separate persistence lanes exist and are frequently confused: the **server room lane**
(`rooms/{roomId}`, authoritative for live multiplayer) and the **per-user client lane**
(`users/{uid}/roomStates/...`, a device mirror with `remote-wins` conflict policy). They are
not reconciled with each other.

---

## 2. Executive summary — highest-risk items

| # | Risk | Evidence | Label |
| --- | --- | --- | --- |
| 1 | Firestore write failures are silently swallowed and dropped (no user signal, no alert) | Executed reproduction; `server/services/syncService.js:78–106`; `server/services/firebaseService.js:384–387` | NEEDS WORK BEFORE BETA (data-loss) |
| 2 | Inline saved room state is discarded by the resume loader; next save can overwrite persisted state | Executed reproduction; `server/services/firebaseService.js:130–138` | NEEDS WORK BEFORE BETA (data-loss) |
| 3 | Room resume merge duplicates drawings/objects/turn order on every resume | Executed reproduction; `server/services/firebaseService.js:107–110`; `server/handlers/roomHandlers.js:138–196` | NEEDS WORK BEFORE BETA (corruption) |
| 4 | Any authenticated account can read every room document (incl. inline gameState) | `firestore.rules:124–147` | NEEDS WORK BEFORE BETA (security) |
| 5 | No billing system at all; most tier entitlements enforced client-side only | No payment/webhook code anywhere; `subscriptionService.js`; `firestore.rules` | NEEDS WORK BEFORE PAID LAUNCH |
| 6 | No Firestore backup/restore/DR and no export for campaign-scale data | No scheduled exports/PITR config; `characterBackupService.js` is per-character only | NEEDS WORK BEFORE PAID LAUNCH |
| 7 | Account deletion is partial; user Firestore doc + large content classes survive | `persistenceService.js:449–546`; `firestore.rules` collection inventory | NEEDS WORK BEFORE PAID LAUNCH (privacy) |
| 8 | Offline campaign edits can be overwritten by cloud hydration on next login | `campaignService.js:255–283`; `PersistenceProvider.jsx:152–214` | NEEDS WORK BEFORE PAID LAUNCH (data-loss) |
| 9 | Character autosave failure at quota is silent (journal was fixed; character was not) | `useCharacterPersistence.js:131–157`, `:249–282`; `persistenceService.js:207–223` | NEEDS WORK BEFORE BETA |
| 10 | CI does not deploy/test rules or functions, and the Actions-built frontend bundle receives no Firebase env vars | `deploy.yml:48–59,164–177`; `deploy-rules.bat` | NEEDS WORK BEFORE BETA |

---

## 3. Area-by-area audit (all requested categories)

### 3.1 AUTHENTICATION — CURRENTLY STRONG (with one deployment caveat)

Evidence:

- Socket auth boundary is centralized and unit-tested: `server/services/socketAuthMiddleware.js:16–99`; tests in `server/tests/socketAuthMiddleware.test.js` (8 passing, including “rejects an invalid token in production”, “treats RAILWAY_ENVIRONMENT as production”).
- Tokenless sockets are guests by design; invalid/error tokens are rejected in production and downgraded to guest only in development (`socketAuthMiddleware.js:36–97`).
- Dev-token/JWT-decode shortcuts are gated by `!isProduction && (ALLOW_DEV_AUTH === 'true' || NODE_ENV === 'development')` (`socketAuthMiddleware.js:18–24`; also `socketHandlers.js:153–176` for the payload-based dev auto-auth).
- Firebase ID tokens verified via Admin SDK (`server/services/firebaseService.js:634–646`).
- Client sends the token via `useSocketConnection.js:32–58`; production never fabricates `dev-token-` values (`!isProduction()` guard).
- Account auth is Firebase Auth (email/password, Google, anonymous) in `vtt-react/src/services/authService.js`; no custom credential handling beyond password-reset emails.

Caveats / gaps:

- The admin dev login (`admin`/`admin`) is compiled only outside production (`authStore.js:21–46`), which is correct, but the sentinel is build-time only. Verified no production exposure in code; runtime verification of the deployed bundle is **UNKNOWN**.
- Firebase Auth email verification is sent (`authService.js:69`) but not enforced anywhere for gameplay/persistence.
- Guests can join password-protected rooms and receive live room state (intended cooperative design; see 3.6).

### 3.2 AUTHORIZATION — MIXED: server socket layer mostly strong; Firestore layer weak on `rooms`

**CURRENTLY STRONG:**

- Room lifecycle guards: permanent-room resume restricted to owner (`roomLifecycleHandlers.js:20–28`, used at :105 and :129); GM reclaim requires matching `gmId` (`roomLifecycleHandlers.js:303–353`).
- Token ownership: create stamps `ownerPlayerId`; move/update/remove/dismiss check owner/GM/delegate (`tokenHandlers.js:100–136`, `:138–188`, `:397–431`; tests in `tokenHandlers.test.js`).
- Character resources: non-GM cannot target another player (`characterHandlers.js:223–235`; test coverage noted in header).
- GM-only surfaces: wall/light/fog/weather/drawing (`environmentHandlers.js:119–166`, `:195–282`, `:303–330`), map create/delete/terrain (`mapHandlers.js:112–171`), level-editor push (`mapHandlers.js:49–99`), journal show-to-players (`journalHandlers.js:23–66`), quest share/rewards (`questHandlers.js:52–82`, `:143+`).

**NEEDS WORK BEFORE BETA (security):**

- `firestore.rules:124–147`: **any authenticated non-anonymous user can read any room document**:
  ```
  allow read: if request.auth != null &&
    request.auth.token.firebase.sign_in_provider != 'anonymous';
  ```
  Member checks apply only to writes and to the `gameState`/`chat` subcollections. For non-split rooms the parent document itself holds `gameState` (written by `updateRoomGameState()` normal path, `firebaseService.js:377–383`), so campaign tokens, fog, maps, and `chatHistory` can be read (and enumerated via a collection query) by any free account.
- `sync_tokens` / `sync_grid_items` / `sync_character_tokens` resolve `recipientPlayerId` against **all** connected players, not against the sender's room (`syncHandlers.js:50–102`). A member of room A can push attacker-controlled token/grid payloads to a client in room B as `full_game_state_sync`. Server state is unaffected, but client state can be spoofed.
- Category collections allow writes by any authenticated user (`firestore.rules:257–260, 293–296, 335–338, 441–444`), enabling taxonomy vandalism; community rating fields are directly writable by any authenticated user (`firestore.rules:244–248` etc.), so aggregate ratings are forgeable.
- `users/{userId}` rules correctly protect `subscriptionTier` (`firestore.rules:20–32`). **However**, an update that *removes* the field is allowed (`!('subscriptionTier' in request.resource.data)`), which self-downgrades only — no escalation, but worth tightening.

**UNKNOWN:** whether any additional authorization exists in a reverse proxy / API gateway outside this repo.

### 3.3 CAMPAIGN OWNERSHIP — NEEDS WORK BEFORE PAID LAUNCH

Evidence:

- All campaigns live in one localStorage list plus one cloud doc (`campaignService.js:7–9, 241–246`). There is no per-campaign document, no ownership transfer, no revision.
- `syncToCloud` is a whole-array merge write; `hydrateFromCloud` **replaces** the local array whenever the cloud doc has any campaigns (`campaignService.js:255–283`).
- Ownership is implicit: `users/{uid}/worldbuilding/campaigns` is owner-only by rules (`firestore.rules:189–191`), so ownership is not transferable and co-GMs cannot share a campaign doc.
- Server-side room ownership is separate (`rooms.gmId`, rules `firestore.rules:150–152`). Deleting a campaign never touches its `rooms`; deleting a GM account removes GM rooms (`persistenceService.js:494–502`) but does not remove the user from other rooms' `members` arrays.

Risks:

- A campaign can only live under one account; “campaign representing hundreds of hours” has no succession/escrow path.
- The single-doc storage imposes a hard 1 MiB Firestore document ceiling with no pre-flight check in `campaignService` (see 3.28 Storage Growth).

### 3.4 ROOM PERMISSIONS — ADEQUATE FOR PRIVATE USE; rules gap is the beta blocker

- Server: password hashing (bcrypt) and verification (`roomHandlers.js:23–67`), membership validation for socket events (`roomHandlers.js:101–130`), tier-capped room counts (`tierService.js:63–79`, `roomLifecycleHandlers.js:69–79`).
- Firestore: member-only subcollections and member-only parent writes; **parent reads are too broad** (3.2).
- `GET /api/rooms` exposes active public rooms without auth (`server.js:310–313`); acceptable as a server browser but combined with the rules gap it is a listing aid.
- Rooms created by the client (`roomService.createPersistentRoom`, `roomService.js:30–175`) are created with `isActive: false` and no password field, then activated through the socket path. This split ownership between client-created doc and server activation is a compatibility seam (see 3.23).

### 3.5 GM/PLAYER BOUNDARIES — PARTIAL BY DESIGN, with documented soft edges

Strong: GM-only walls/lights/fog/weather/drawings/map edits/level editor/combat authority (when enabled)/quests/journal.

Soft edges (cooperative-VTT model, worth explicit operator documentation):

- `container_update`, `creature_added/updated`, `door_state_changed` accept any room member (`environmentHandlers.js:30–117, 168–193`).
- `character_updated` accepts any character object from the owning player with no stat validation (`characterHandlers.js:94–154`); it is display state for the room, persisted separately. A player can claim arbitrary stats in-room.
- `character_resource_delta` self-service (`characterHandlers.js:54–92`) while `character_resource_updated` enforces self-or-GM (`:223–235`). Two paths with different rigor for the same resource family.
- Combat authority is OFF by default: `combatAuthority.isCombatAuthorityEnabled()` returns false unless `COMBAT_AUTHORITY_ENFORCEMENT=true` (`combatAuthority.js:22–26, 71–88, 90–113`). In default mode any member can start/end combat and change turns. Tests exist for both modes (`server/tests/combatAuthority.test.js`).
- `resolve_state_conflict` is GM-only and replaces `room.gameState` from a client-supplied object (`syncHandlers.js:132–156`) — correct for the GM, but it is a full-state injection surface that should be treated as trusted-GM-only.

### 3.6 SERVER AUTHORITY — ADEQUATE FOR PRIVATE USE

Server owns live room state and validates membership before mutation. Confirmed test coverage: `multiplayer.integration.test.js` (rejects guests from `create_room`, rejects foreign-room token creation, verifies convergence and delta-sync policy behavior). Nuances:

- Client is authoritative for its own character sheet; the server relays and stores a room copy. This is a deliberate cooperative model, not a hidden flaw — but it must be part of the paid-tier trust messaging.
- The server does not re-derive game rules for resource changes; it clamps health/mana/AP to [0,max] only in `character_resource_delta` (`characterHandlers.js:61–76`) and stores GM-provided values as-is in `character_resource_updated` (`:241–270`).
- Movement authority honors ownership and GM delegation; unowned/legacy tokens **fail open** (`tokenHandlers.js:111–123`; explicit test “token_moved fails open for unowned/legacy tokens”).

### 3.7 INPUT VALIDATION — ADEQUATE FOR PRIVATE USE

- Joi middleware is installed on every socket connection and wraps `socket.on` handlers (`server.js:132–136`; implementation `validationService.js:259–324`). Schemas cover room lifecycle, chat, characters, tokens, combat, maps, dice (`validationService.js:10–211`). `stripUnknown: true` removes unknown fields for schema-covered events.
- Newer handlers add their own size guards: quests ≤256 KB (`questHandlers.js:20–35`), journal share ≤512 KB (`journalHandlers.js:39–49`).
- Gaps: events without schemas pass through unmodified by design (`validationService.js:222–225`). Large composite payloads for events like `map_update`/`sync_level_editor_state` are bounded only by schema shape, not size (rate limits bound frequency). `cursor_move` accepts arbitrary position objects (`utilityHandlers.js:26–36`). Client-supplied `sequence` values are echoed, not verified (`mapHandlers.js:103, 290`).
- Sanitization middleware skips rich-text fields by design (`server.js:128`), and chat has dedicated sanitization (`chatHandlers.js:43, 98, 159`; `sanitizeChatMessage`). A client-side `sanitizeHtml` utility exists (untracked `vtt-react/src/utils/sanitizeHtml.js`) — **UNKNOWN** whether every rich-text render path uses it; no exhaustive consumer audit was completed.

### 3.8 RATE LIMITING — CURRENTLY STRONG for a single instance

- Per-event limits with GM multiplier and disconnect-after-10-violations middleware (`rateLimitService.js:12–51, 163–237`; `server.js:139–143`; tests in `rateLimitService.test.js` and `rateLimitStore.test.js`).
- Clients are keyed by `uid` when authenticated so reconnects do not reset counters (`rateLimitService.js:190–193`).
- Redis-backed store + socket.io adapter activate automatically when `REDIS_URL` is set (`server.js:150–176`), with in-memory fallback.
- Global chat has a rules-level 1 s cooldown batch mechanism (`firestore.rules:464–488`).
- Express API limited to 100 req/15 min per IP (`server.js:302–307`).
- Gaps: default limits (60/min, 5/s) apply to unmapped events; `chat_message` has no server-side persistence to Firestore (room chat is memory-only until batch writes happen through other events) — acceptable but note chat is not durably persisted per message.

### 3.9 DATA INTEGRITY — NEEDS WORK BEFORE BETA (see P0-1..P0-3)

Key evidence:

- Room writes are not transactional. `saveRoomDataSplit()` performs sequential separate writes: core doc → `gameState/current` → per-map docs → chat docs (`firebaseService.js:200–277`). A failure between steps leaves mixed-version documents.
- `updateRoomGameState()` split path does the same (`firebaseService.js:337–388`).
- The batched writer ignores failures (3.x below / P0-2).
- `mergeRoomGameStateForResume()` concatenates arrays wholesale (`roomHandlers.js:159–167, 182`), which is idempotence-breaking (P0-3).
- Character saves use `updateDoc` on the full nested schema (`characterPersistenceService.js:501`), while create/delete use transactions (`:248, 525`) — save itself is a single-document atomic write, which Firestore guarantees; the risk there is schema narrowing (only known fields round-trip, see 3.23).
- Storage accounting runs through three independent mechanisms that can disagree: Cloud Functions increments/decrements (`functions/storageTriggers.js`), client counters (`storageLimitService.updateStorageUsage`), and fragment-size deltas (`persistenceService.setStorageUsageSize`, `:173–202`). Backups (`character_backups`) are created with `addDoc` and never counted; published `shared/` copies are not counted by `parseStoragePath` (`functions/storageTriggers.js:26–57`); deletion triggers can push counters below zero.

### 3.10 CONFLICT RESOLUTION — ADEQUATE FOR PRIVATE USE; needs product-level rules before paid

- Client realtime sync: per-document listener with conflict modal for character state (`useRealtimeSync.js:105–200`; `CharacterPersistenceProvider.jsx:74–88`) and `remote-wins` for room state (`useRoomPersistence.js:211–219`).
- Write-echo suppression uses write tokens (`useRealtimeSync.js:56–71`; `characterStateService` returns `writeToken`), which is a strong correctness detail.
- Server delta-sync engine includes per-field policies with tests (`server/services/conflictPolicies.js`; `deltaSync.test.js`, `conflictPolicies.test.js`; integration test “concurrent HP updates converge via minValue policy”), but it is **only wired for tokens** and only when `ENABLE_TOKENS_DELTA=true` (`deltaSyncCapabilities.js`; `tokenHandlers.js:12–16`). Everything else is last-write-wins at event granularity.
- Two-device worldbuilding edits are whole-document last-write-wins; the login-time dirty guard only prevents hydration from replacing a locally dirty store (`PersistenceProvider.jsx:127–214`), not cross-device clobbering while both are online because each device writes the entire category document.

### 3.11 PERSISTENCE — NEEDS WORK BEFORE BETA

Covered in detail by P0-1/P0-2/P1-6. Additional evidence: client autosave debounces 2 s (character) / 3 s (room) and flush-on-hide/unload (`useCharacterPersistence.js:33`; `useRoomPersistence.js:29`; `PersistenceProvider.jsx:265–309`); browser unload guarantees are best-effort by design.

### 3.12 BACKUPS — NEEDS WORK BEFORE PAID LAUNCH

- Only character-level backups exist: Firestore `character_backups` capped at 10 per character, 24 h interval, local fallback (`characterBackupService.js:18–24, 39–122, 313–365`). `lastBackupTimes` is in-memory, so every new session may create a fresh “scheduled” backup; the cap still bounds growth.
- No scheduled Firestore export, no PITR configuration, no cross-region copy, no backup of `rooms` for non-character data. No functions or scripts in the repo perform exports.
- Backups are not surfaced in the product: `restoreFromBackup` has no UI consumer found (grep only shows the service itself and character migration’s own localStorage restore). Status: **DORMANT / UNREFERENCED** in the UI.

### 3.13 RESTORE — NEEDS WORK BEFORE PAID LAUNCH

- No documented restore runbook. `server/scripts/deleteAllRooms.js` is a destructive utility with no matching restore tool.
- Character restore exists in code but is dormant (above) and untested at the UI level.

### 3.14 DISASTER RECOVERY — NEEDS WORK BEFORE PAID LAUNCH / partially UNKNOWN

- Single Firebase project (`mythrill-ff7c6` defaults in `server/services/firebaseService.js:19`, `server/.env.example:26`) and a single Railway service (client socket URL `https://descension-mythrill.up.railway.app` in `netlify.toml:16`).
- Server restart behavior: rooms hydrate only when `isActive == true` (`firebaseService.js:699–701`); `setRoomActiveStatus` is exported but never called anywhere (grep: definition + export only), so `isActive` in Firestore is whatever the last full room save wrote. A room that was saved inactive at creation and never re-saved is not reloaded.
- `initializePersistentRooms` swallows load errors and continues with zero rooms (`roomHandlers.js:404–406`); the server then accepts connections with empty memory. Whether Railway restarts on failure or keeps the process is **UNKNOWN** outside the repo.

### 3.15 SCHEMA MIGRATIONS — NEEDS WORK BEFORE BETA

- No schema version field on room documents or `gameState`. State objects carry literal `version: 1` values (`useCharacterPersistence.js:92`, `useRoomPersistence.js:101`, `journalService.js:62`) that nothing reads.
- Migrations are ad hoc and local: `normalizeBook` (`bookStore.js:15–100`), `characterMigrationService.js`, `migrateNestedCharacters` (`firebaseService.js:654–686`), `migrateArcanoneerClassResource` (`useCharacterPersistence.js:171–177`).
- Character round-trip is schema-narrowing: `transformForStorage` (`characterPersistenceService.js:88–177`) and `transformFromStorage` (`:179–204`) explicitly enumerate fields, so fields outside the known set do not survive a save/load cycle. This is tolerable for current clients but is a compatibility trap for “old campaign data encounters new code”.

### 3.16 VERSION COMPATIBILITY — NEEDS WORK BEFORE BETA

- Frontend and server deploy independently (Netlify and Railway). There is no protocol version negotiation beyond a `deltaSyncCapabilities` handshake echoed on join (`roomLifecycleHandlers.js:235, 374`; `sessionHandlers.js:144`).
- Server validation schemas are permissive/`stripUnknown` on known events and pass-through on unknown events, which helps older clients; unknown **new** client events against an old server are silently ignored (no ack), which can manifest as “nothing happens”.
- `vtt-react/public/version.json` exists and headers prevent caching (`netlify.toml:70–75`), but no client logic was found forcing a reload when server/client versions differ (**UNKNOWN** whether an update banner exists elsewhere).

### 3.17 ERROR HANDLING — MIXED; the silent-persistence paths dominate

- Handlers generally wrap in try/catch and log (`*Handlers.js` throughout), and the validation middleware emits `socket_error` plus a client-side full-resync recovery (`connectionHandlers.js:169–198`).
- Client has broad ErrorBoundary coverage (`App.jsx:838–910, 1363–1524`; `components/common/ErrorBoundary.jsx`).
- The critical weakness is persistence: service-level catch → `return false` with no propagation (`firebaseService.js:384–387`, `:433–438`; `campaignService.js:249–252`; `bookStore.js:743–745`), and the batched writer treats false as success (P0-2). Journal now surfaces errors via `persistenceStatusStore` + user notification (`useJournalPersistence.js:81–109`) — character state does **not** (`useCharacterPersistence.js:141–156`).

### 3.18 OBSERVABILITY — ADEQUATE FOR PRIVATE USE

- Structured JSON logger with 7-day rotation, console in dev, optional webhook shipping (`server/services/logger.js:9–215`).
- `/health` and `/metrics` (uptime, RSS/heap, sockets, rooms, players) exist (`server.js:261–281`).
- `/debug/logs` is token-gated and fails closed (`server.js:284–299`).
- Gaps: no error-tracking integration, no alerting on persistence failure counts, no client error reporting beyond console; `/metrics` is unauthenticated (counts only).

### 3.19 LOGGING — ADEQUATE FOR PRIVATE USE

- Server logs include userIds and roomIds; `getRoomData` logs map structure; socket auth logs userIds (not tokens). Emails appear in some log contexts (e.g., auth flows) — the debug endpoint that returns logs is protected (`server.js:284–299`).
- No log-level configuration per environment beyond `NODE_ENV`; no PII redaction policy documented. UNKNOWN: Railway log retention.

### 3.20 PRIVACY — NEEDS WORK BEFORE PAID LAUNCH

- Good: owner-only `users/{uid}` including email; public projection limited to displayName/photoURL/friendId (`authService.js:346–366`; `firestore.rules:662–666`); owner-only presence writes; community content is opt-in public.
- Gaps:
  - `presence/{userId}` readable by any authenticated user (`firestore.rules:36–41`).
  - Room documents readable by any authenticated user (3.2).
  - Account deletion leaves the `users/{uid}` document (all of `deleteAllUserData` only resets `storageUsage` via merge — `persistenceService.js:464–477`) with email/display name/friendId, and leaves most content classes (see P1-3).
  - LocalStorage retains `mythrill-campaigns`, persisted Zustand stores, and per-user data after sign-out and after account deletion (`authStore.js:312–410` clears only guest keys; `campaignService.js:7–9` has no teardown).
  - No privacy policy text review was part of this audit; the landing/Privacy route exists (`App.jsx:1460–1462`).

### 3.21 ACCOUNT DELETION — NEEDS WORK BEFORE PAID LAUNCH

`AccountDashboard.jsx:358–385` calls `persistenceService.deleteAllUserData(uid)` then Firebase `deleteUser`. What `deleteAllUserData` actually removes (`persistenceService.js:449–546`):

Deleted: characterStates, roomStates, journal, `worldbuilding/campaigns` (only), top-level `characters` (by query), GM rooms (by query), presence, `friendLists/{uid}`, one `friendRequests/{uid}` doc.

Not deleted (evidence: rules collection inventory + code paths): `users/{uid}` doc itself; `worldbuilding/{books,worlds,factions,timelines,familyTrees,lineages,interactiveMaps,quests,entityGraph,deities,languages}`; `users/{uid}/spellbook/**`, `actionBar/**`, `audio/**`, `audioPlaylists/**`, `libraries/**`; `userSettings/{uid}`; `character_backups`; `characters` soft-deleted docs? (they match the query and are hard-deleted — fine); member-rooms (only membership entries remain for other players); `sharedCampaigns` published by the user; all `community_*`/`user_spells`/`userItems`/`userCreatures`/`userMaps`/`userCustomMaps`/`user_folders`/`user_libraries`/`diceRolls`/`characterRollStats`/`customRollableTables`/`rollSessions`/`characterSessions`; `mapShares`; `userMapAnnotations`; `userProfiles/{uid}` projection (README-adjacent comment in rules says public projection; delete leaves it).

Also note the friend-request deletion targets `friendRequests/{uid}`, but requests are created with auto-generated ids (`firestore.rules:44–61`), so the delete is effectively a no-op except in coincidences.

### 3.22 DATA EXPORT — NEEDS WORK BEFORE PAID LAUNCH

- `persistenceService.getAllUserData(userId)` exists (`:414–444`) but has **no UI consumer** (grep: definition only).
- `userProfileService.exportUserProfile` / `importUserProfile` exist (`exportUserProfile` at `userProfileService.js:338`) with no consumer found; same for `exportUserSettings`.
- No campaign/room/journal/worldbuilding export UI was found. The community sharing flow publishes campaigns, which is not the same as export.

### 3.23 SUBSCRIPTION/TIER BOUNDARIES — NEEDS WORK BEFORE PAID LAUNCH

- **No billing integration exists in the repository.** No Stripe/Paddle/checkout/webhook code was found (grep across `vtt-react/src`, `server`, `functions`, `.github`). `updateUserTier` writes `subscriptionTier` directly to Firestore and is **blocked by rules** (`firestore.rules:27–31`), so tier changes currently require manual Admin SDK action. There is no purchase, renewal, cancellation, refund, dunning, or receipt-verification flow.
- Entitlement enforcement is split:
  - Server-enforced: room creation/limits (`tierService.js:63–79`), join capacity (`canJoinRoom` ignores tier by design), permanent-room resume bypasses tier checks (`roomLifecycleHandlers.js:67–79`).
  - Rules-enforced: custom maps `userMaps`/`userCustomMaps` via `isUltimateTier` (`firestore.rules:8–15, 578–596`).
  - **Client-enforced only:** character count caps, storage total caps, feature flags (`subscriptionService.js:7–46, 545–564`), campaign manager gating (`CampaignManager.jsx:47`). A modified client can bypass all of these; storage rules enforce per-file type/size only, not cumulative quota.
- Failure mode: if Firestore is unreadable, both `server/services/tierService.js:57–60` and `vtt-react/src/services/subscriptionService.js:410–413` fall back to FREE — fail-closed (no free upgrade) but a paying GM may be told their room limit is exhausted during an outage. The server tier cache is 5 minutes (`tierService.js:20–21`).
- Plan text already advertises paid tiers ($7.99/$14.99/$22.00 in `subscriptionService.js:228, 267, 308`) with no way to pay. `subscriptionUpdatedAt` cannot be client-written (`firestore.rules:30–31`).

### 3.24 SERVICE FAILURE — NEEDS WORK BEFORE BETA

- Firebase Admin init failure returns `null` and the server continues (`firebaseService.js:64–67, 72–75`), with `isPersistenceAvailable()` exposed but unused by startup gating. Under Firestore outage, socket play continues; all room persistence silently fails (P0-2).
- Client persistence status check uses an 8 s timeout and marks itself offline but explicitly lets saves proceed (`PersistenceProvider.jsx:63–100`).
- No circuit breakers/backoff-with-visibility beyond the batch writer’s 3 retries (which discard). No queue persistence across restarts.

### 3.25 OFFLINE/RECONNECT — NEEDS WORK BEFORE BETA (misleading behavior)

- `offlineService.js` advertises “unbroken offline editing with automatic sync”, but:
  - `processQueuedAction('update_character')` is an explicit **no-op by design** (`offlineService.js:304–311`).
  - `syncOfflineData` marks cached characters `synced` without writing them (`:360–370`).
  - Only 6 action types are supported (`:16–23`), and `create_room` is also a no-op (`:312–313`).
- Reconnect is otherwise solid: automatic `join_room` with `isReconnect` on socket connect (`useSocketConnection.js:60–117`), GM reclaim broadcasts `gm_reconnected` (`roomLifecycleHandlers.js:385–390`), client requests full sync + combat sync (`connectionHandlers.js:213–273`).
- Disconnected players are remembered for reclaim for 30 minutes (`roomLifecycleHandlers.js:511–518`; cleanup `roomHandlers.js:415–441`).

### 3.26 DEPLOYMENT — NEEDS WORK BEFORE BETA

- Frontend: Netlify (`netlify.toml` + duplicate `config/netlify.toml`) with a strong header/CSP set and `REACT_APP_SOCKET_URL=https://descension-mythrill.up.railway.app`. **Contradiction:** there are two Netlify configs (root and `config/`) — only the root one is read by Netlify; the duplicate can drift.
- CI (`/.github/workflows/deploy.yml`) has two competing deploy paths:
  1. Netlify’s own Git integration (runs `npm run build:netlify` per `netlify.toml`, presumably with Netlify UI env vars), and
  2. GitHub Actions job `deploy-to-netlify` that uploads a build produced in `build-and-test` — whose env block (`deploy.yml:48–59`) includes **no `REACT_APP_FIREBASE_*` variables**. If that job is the live path, the deployed bundle has `isFirebaseConfigured === false` (`vtt-react/src/config/firebase.js:44–51`) and runs in Demo Mode. Which path is authoritative is **UNKNOWN** from the repo (Netlify site settings live outside it).
- Server: Railway via `server/nixpacks.toml` (`npm ci` → `npm start`); no CI job builds/tests/deploys the server beyond running its mocha suite; the root `Dockerfile` builds the frontend only (likely legacy/UNAFFECTED).
- Rules: deployed manually via `deploy-rules.bat` (`firebase deploy --only firestore:rules,storage`). Functions are not deployed by any repo script or CI.
- Environment validation exists for the server (`server.js:46–57`; `scripts/validate-env.js`) but it warns rather than fails on a weak `DEBUG_TOKEN`; missing `FIREBASE_SERVICE_ACCOUNT_KEY` in production **does** exit.

### 3.27 ROLLBACK — NEEDS WORK BEFORE PAID LAUNCH

- No documented rollback runbook for frontend, server, rules, functions, or schema.
- Netlify has immutable asset hashing and no-cache `index.html` (`netlify.toml:38–89`), so a rollback is a previous-site-deploy action; GitHub Actions keeps build artifacts 7 days (`deploy.yml:109–114`).
- Rules/functions have no versioned rollback story in-repo; schema/data changes have none at all.

### 3.28 CI — ADEQUATE FOR PRIVATE USE, insufficient for paid

- Strengths: frontend `npm ci --force`, lint-if-present, jest with coverage, production build, bundle-budget enforcement (`deploy.yml:32–107` — 25 MB total / 8.5 MB per chunk), server mocha suite (Node 20), artifact upload, post-deploy curl health check.
- Gaps: server lint never runs in CI (`server/package.json` has `lint` but the workflow doesn’t call it); functions have no tests; rules have no tests; no dependency audit; no smoke test of the socket server; the post-deploy check only curls the static site.

### 3.29 DEPENDENCIES — UNKNOWN / NEEDS WORK BEFORE PAID LAUNCH

- Frontend is CRA 5 (`react-scripts: 5.0.1`) with `overrides` pinning patched transitive versions (`glob`, `postcss`, `node-forge`, `nth-check`, `js-yaml`) — evidence someone has done security hygiene.
- Server deps are current-ish and conventional (express 4, socket.io 4, firebase-admin 12, joi 17).
- No Dependabot/renovate config, no `npm audit` gate in CI, no SCA tooling. Age/vulnerability status of the installed trees is **UNKNOWN** in this audit (not measured).

### 3.30 PERFORMANCE — ADEQUATE FOR PRIVATE USE / partially UNKNOWN

- Client: bundle budgets enforced in CI; model caching (`ModelCacheService.js`), virtualized lists (react-window), throttled cursor updates (12–33 ms), movement debounce (50 ms), room batch writes (500 ms). No rendering benchmarks were run.
- Server: `GET /metrics` exposes memory/socket counts; `memoryManager.js` and `requestTracer.js` exist but are **UNREFERENCED** except `errorHandler.js:219–220` reading `global.memoryManager`, which is never assigned anywhere (grep). No heap-limit guardrails were verified.
- Large-map behavior: room gameState is deep-cloned (`JSON.parse(JSON.stringify(...))` in `firebaseService.updateRoomGameState` split path, `:353`) and fully merged on each write — O(state) per flush. Performance at very large states is **UNKNOWN** (no load tests).

### 3.31 STORAGE GROWTH — NEEDS WORK BEFORE BETA

- Chat: `addChatMessage` writes every message to `rooms/{roomId}/chat` with no retention/pruning (`firebaseService.js:447–475`); reads are capped at 100 (`:116–119`). In-memory room chat is capped at 500 (`chatHandlers.js:61–64`). Durable growth is unbounded.
- Fog/drawing paths accumulate arrays (fog_update appends, `environmentHandlers.js:263–268`; drawing_update replaces whole arrays — pruning only via client state). No compaction.
- Worldbuilding/campaigns: one Firestore document per category/all campaigns with a hard 1 MiB limit. Nothing pre-checks document size; failed saves land in catches (`bookStore.js:743–746`, `campaignService.js:249–252`). The storage widget measures actual bytes on demand (`storageLimitService.getCloudDataUsage`, `:286–340`) but is not a write gate.
- Character backups: capped per character, not counted in quota.
- `apiLimiter` confines REST noise; room docs handled by split storage (`saveRoomDataSplit`) which deletes orphaned map docs but only on full split saves (`firebaseService.js:239–252`).

---

## 4. Prioritized findings

Each finding lists: **EVIDENCE**, **FAILURE SCENARIO**, **USER CONSEQUENCE**, **LIKELIHOOD**, **RECOMMENDED MITIGATION**, **TEST NEEDED**.
Severity categories used: P0 = data-loss/security risk; P1 = paid-launch blocker; P2 = beta improvement; P3 = post-launch improvement.

### P0-1 — `getRoomData()` discards inline room `gameState`

- **EVIDENCE**
  - Executed reproduction: a mocked room document containing `gameState.maps.default.terrainData` and `gameState.combat.round` loaded via `firebaseService.getRoomData()` returned `gameState === {}`.
  - Code: `server/services/firebaseService.js:130–138` sets `roomData.gameState = {}` unconditionally, then only repopulates from the `gameState/current` fragment; the `else` branch references the already-cleared variable (`roomData.gameState = roomData.gameState || {}` — always `{}`).
  - The inline path is a real writer: `updateRoomGameState()` normal path (`firebaseService.js:377–383`) stores `gameState` inline whenever the state is ≤100 KB; `saveRoomData()` single-document path (`:397–439`) includes `gameState` inline. `isSplitStorage` is only set by split writes (`:224, 360`).
  - Consumers of `getRoomData`: `roomLifecycleHandlers.js:100, 123` (permanent-room resume) and `optimizedFirebase.getRoomData()` (`optimizedFirebase.js:251`).
- **FAILURE SCENARIO**
  1. A room's state was persisted inline (small rooms/early sessions) and the server restarts with Firestore briefly unreachable during `initializePersistentRooms` (errors are caught and swallowed — `roomHandlers.js:404–406`), leaving rooms unloaded; or a room otherwise absent from memory is resumed.
  2. GM resumes the room via `create_room` → `getRoomData()` returns empty `gameState` → room is rebuilt empty; `mergeRoomGameStateForResume` merges the empty persisted state (no-op).
  3. The next successful batch write persists the now-empty/partial room state over the document that still contained the original state.
- **USER CONSEQUENCE** Loss of maps, terrain, walls, tokens, fog, and combat state for a campaign whose gm expected persistence; overwrite may be irreversible without provider-level recovery.
- **LIKELIHOOD** Medium at current small scale; rises as usage/persistence grows. The discard is deterministic when the path is hit — only the triggering condition is probabilistic.
- **RECOMMENDED MITIGATION** Preserve the inline `gameState` as the fallback rather than clearing first; only prefer the `gameState/current` fragment. Never write a state built from an empty load (`isSplitStorage`/loaded flags), and add a startup “room could not be loaded” health signal.
- **TEST NEEDED** Unit test: room doc with inline state and no subcollection fragments → `getRoomData()` returns the inline state. Integration test: simulate boot-time Firestore failure + subsequent resume + save; assert no overwrite of non-empty stored state.

### P0-2 — Persistence failures are silently discarded (batch writer + false returns)

- **EVIDENCE**
  - Executed reproduction: with `firebaseService.updateRoomGameState` forced to return `false`, `FirebaseBatchWriter.flush()` made **one** attempt, then cleared `pendingWrites` entirely; no retry, no error surfaced.
  - Code: `server/services/syncService.js:78–106` awaits `updateRoomGameState()` but inspects nothing; “retry” only occurs when the promise throws — it never does, because `updateRoomGameState` catches every error and returns `false` (`firebaseService.js:384–387`). After 3 outer attempts the code logs `All retry attempts exhausted` and drops the data (`syncService.js:104–106`).
  - Every handler funnels through this writer for authoritative room state (`tokenHandlers.js`, `characterHandlers.js`, `mapHandlers.js`, `environmentHandlers.js`, `combatHandlers.js`, `syncHandlers.js`).
  - No client notification exists for `false`; `save_room_state_request` emits `room_state_saved` even if the write returned false (`syncHandlers.js:117–130` — it emits success only if the call resolves, which it always does).
- **FAILURE SCENARIO** Firestore hits a quota/permission/transient outage mid-session; clients keep playing; every subsequent persistence attempt fails silently; the room state diverges from what is stored. A crash/restart then loads the last successful snapshot (or the empty state per P0-1).
- **USER CONSEQUENCE** Hours of session progress silently lost; no warning until restart.
- **LIKELIHOOD** Medium at scale (quota/network errors are routine); certain during a provider incident.
- **RECOMMENDED MITIGATION** Treat `false` as failure: bounded re-queue with exponential backoff and a size cap, surface “cloud save degraded” to the GM and into `/metrics`, alert on persistent failure, and take a periodic full snapshot with checksum verification.
- **TEST NEEDED** Unit test asserting the queue retains data on `false` and exposes failure state; fault-injection test (mock Firestore throwing `unavailable`) proving no silent drop and a visible degraded state.

### P0-3 — Resume merge is not idempotent and duplicates arrays

- **EVIDENCE**
  - Executed reproduction: `mergeRoomGameStateForResume(state, state)` produced `drawingPaths.length === 2`, `environmentalObjects.length === 2`, `combat.turnOrder.length === 2`.
  - Code: `server/handlers/roomHandlers.js:159–167` concatenates `environmentalObjects`, `drawingPaths`, `drawingLayers`, `fogOfWarPaths`, `fogErasePaths`, `dndElements`; line 182 concatenates `turnOrder`.
  - Called on every permanent-room resume when the persisted data exists: `roomLifecycleHandlers.js:108` (existing room) and `:163` (rebuilt room).
- **FAILURE SCENARIO** A GM closes and reopens the same permanent room (or reconnects after a server restart) with persisted map state present. Each resume appends the full persisted arrays onto the in-memory state, duplicating drawings, environmental objects/doors, fog strokes, and combat turn order. The room state grows monotonically across resumes and behavior degrades (duplicate turns, stacked drawings).
- **USER CONSEQUENCE** Corrupted visual state, duplicated combatants/turns, growing payloads; hard to diagnose and not user-fixable.
- **LIKELIHOOD** High — it occurs on the normal permanent-room resume path whenever arrays are present.
- **RECOMMENDED MITIGATION** Replace last-writer snapshot merge for these collections (persisted snapshot is the full state); if merging is required, key items by stable id and deduplicate. Make the merge function explicitly non-duplicating and unit-tested.
- **TEST NEEDED** Unit: merging identical snapshots is a no-op for every affected field. Integration: resume the same room twice and assert state size is stable.

### P0-4 — Any authenticated account can read every room document (incl. inline gameState)

- **EVIDENCE** `firestore.rules:124–147`:
  - `allow read: if request.auth != null && request.auth.token.firebase.sign_in_provider != 'anonymous';`
  - Membership is required only for updates/deletes and for the `gameState`/`chat` subcollections (`:143–166`).
  - Non-split rooms store `gameState` inline (P0-1 evidence). Anonymous auth is a first-class feature (`authService.signInAsAnonymous`, `socketAuthMiddleware.js`), and rules exclude only `anonymous` providers — a free email/Google account is enough. A collection query over `rooms` passes the rule for every document, so enumeration is trivial.
- **FAILURE SCENARIO** A competitor or curious user with any free account lists all rooms and reads campaign names, members, settings, and (for non-split rooms) live game state including tokens, fog, maps, and chat history.
- **USER CONSEQUENCE** Confidential campaign content exposure; trust and privacy violation for paying customers.
- **LIKELIHOOD** High if ever priced/launched without rules changes (the rule is explicit and current).
- **RECOMMENDED MITIGATION** Restrict parent-doc reads to GM/members (matching writes), and/or keep authored/sensitive state out of the parent document (projection doc + member-only subcollection). Verify with rules tests.
- **TEST NEEDED** Rules tests (emulator): non-member authenticated read of `rooms/{id}` denied; member/GM allowed; anonymous denied; query over `rooms` rejected for non-members. (No rules test harness exists yet — see 3.28.)

### P1-1 — No subscription/billing system; entitlements largely client-side

- **EVIDENCE** No billing/webhook/checkout code anywhere (repo-wide grep). `subscriptionService.updateUserTier` writes Firestore but is blocked by rules (`firestore.rules:27–31`), so tiers are changed only by Admin SDK/manual action. Feature gating is a client-side table (`subscriptionService.js:7–46`) plus client count checks; cumulative storage limits are client checks only (`storageLimitService.canStoreData`, used by uploads/items/spells/creatures/audio; rules enforce per-file size/type only — `storage.rules:56–182`). Server enforces only room counts and join capacity (`tierService.js`).
- **FAILURE SCENARIO** Pricing is enabled without a payment integration → cannot collect; or integrations are added but enforcement stays client-side → users on free plans use paid features by modifying the client; storage growth costs accrue beyond plan limits.
- **USER CONSEQUENCE** Cannot actually buy; or plan promises diverge from what the system enforces; operator bears unbounded storage costs.
- **LIKELIHOOD** Certain for launch (feature absent).
- **RECOMMENDED MITIGATION** Choose a processor, implement checkout + webhook-driven entitlement writes (Admin SDK only), enforce quotas server-side (rules/Cloud Functions) for the expensive dimensions (storage bytes, doc counts), add receipt-verification and dunning/grace states; define “subscription verification down” behavior explicitly (fail-closed to FREE is current behavior).
- **TEST NEEDED** End-to-end sandbox purchase → entitlement write → enforcement; webhook replay/forgery tests; quota exceeded attempts from a manipulated client.

### P1-2 — No Firestore backup, restore, or disaster-recovery program

- **EVIDENCE** No scheduled export/PITR configuration in repo; `functions/` contains only storage quota + cascade cleanup triggers (`functions/index.js`); backups exist only per character (`characterBackupService.js`, cap 10, same project, in-memory scheduling state) and are not surfaced in UI. No restore runbook; `server/scripts/` has only `deleteAllRooms.js` and a persistence-logic test script.
- **FAILURE SCENARIO** Operator error, bad migration, or an app bug overwrites/deletes campaign documents; recovery depends entirely on Google’s default durability and whatever undocumented retention exists. Deleting a Firestore document is permanent within the app’s own tooling.
- **USER CONSEQUENCE** Irrecoverable loss of hundreds of hours of campaign work — the exact trust asset a paid subscription is selling.
- **LIKELIHOOD** Low frequency, catastrophic impact.
- **RECOMMENDED MITIGATION** Enable scheduled Firestore exports to a separate bucket/project (and/or PITR), document and rehearse restore, add per-campaign/room export+import in-product, and surface character backup/restore in the UI.
- **TEST NEEDED** Quarterly restore drill into a scratch project; automated export verification (freshness + checksum); product test exporting and re-importing a campaign.

### P1-3 — Account deletion is partial; residual user data remains

- **EVIDENCE** See 3.21 inventory. `persistenceService.deleteAllUserData` (`:449–546`) does not delete the `users/{uid}` document, `userProfiles/{uid}`, worldbuilding docs other than campaigns, spellbook/actionBar/audio/libraries, `userSettings`, `character_backups`, community content published by the user, rolls/sessions/custom tables/shares/annotations, or member-rooms. The friend-request deletion targets a doc id (`userId`) that does not match the auto-id scheme used at creation (`firestore.rules:44–61`), so it is effectively a no-op.
- **FAILURE SCENARIO** A user deletes their account expecting erasure; PII (email, display name, friend id) and substantial content remain in Firestore indefinitely, invisible to the user and possibly still usable by others (community copies, room membership lists).
- **USER CONSEQUENCE** Privacy/GDPR/CCPA exposure; user trust breach; potential legal obligation unmet.
- **LIKELIHOOD** Certain per deletion event; regulatory exposure grows with paying EU/CA users.
- **RECOMMENDED MITIGATION** Centralize deletion in an Admin-SDK Cloud Function/endpoint with a maintained collection inventory and integration tests that assert zero residual documents for a scratch user; anonymize or delete users doc and projection; handle community content per policy; clear client-side LocalStorage on sign-out/deletion.
- **TEST NEEDED** Automated deletion test over a seeded account touching every collection, asserting emptiness afterward; UI-level test that localStorage keys are purged.

### P1-4 — No user-facing data export

- **EVIDENCE** `getAllUserData` and profile/settings export helpers are unused (grep). No campaign/room/journal/book export route found; the only “export” is publishing to the community marketplace.
- **FAILURE SCENARIO** A GM wants to leave, archive, or audit their data; there is no supported path. A user cannot verify what is stored about them.
- **USER CONSEQUENCE** Lock-in perception (and reality) for a product whose value is user-authored content; blocks privacy requests and churn handling.
- **LIKELIHOOD** Certain when asked (support/refunds).
- **RECOMMENDED MITIGATION** Implement export in the existing format (JSON bundle per account plus asset URLs or zipped assets), with a job-based flow for large accounts; document import compatibility.
- **TEST NEEDED** Export → import round-trip fidelity test on a seeded account; large-account export job test.

### P1-5 — Offline campaign edits can be silently overwritten on login

- **EVIDENCE**
  - Campaigns are a single localStorage array plus one cloud doc (`campaignService.js:7–9, 238–253`). `triggerAutoSync` debounces 1.2 s and skips guests/dev (`:228–236`).
  - `PersistenceProvider` hydrates worldbuilding on login and tracks a `mythrill_wb_dirty_*` flag per store to avoid overwriting unsynced local edits (`PersistenceProvider.jsx:127–214`) — but `campaignService.hydrateFromCloud` is called unconditionally (`:179`) and the campaign store has no dirty-flag mechanism.
  - `hydrateFromCloud` replaces the whole local array whenever the cloud doc has any campaigns (`campaignService.js:262–268`).
  - Offline campaign edits occur because `triggerAutoSync` runs only on mutations while signed in; edits made offline or while sync fails stay local (write failures are swallowed, `:249–252`).
- **FAILURE SCENARIO** User edits campaigns offline or during a sync failure; next login (or reconnect with `persistenceStatus.isOnline`) hydrates the older cloud copy and replaces the newer local array; the next autosync then uploads the older data, completing the loss.
- **USER CONSEQUENCE** Loss of campaign planning work with no warning or recovery copy.
- **LIKELIHOOD** Medium-high for laptop/tablet users; deterministic when the race occurs.
- **RECOMMENDED MITIGATION** Add dirty tracking + merge semantics for campaigns (per-campaign documents or lastModified-aware merge), refuse hydration when local is newer, and surface sync failures.
- **TEST NEEDED** Unit: offline mutation then `hydrateFromCloud` must not discard newer local data. Integration: simulate failed sync, reload, verify local content survives.

### P1-6 — Character autosave failure is silent (journal is not)

- **EVIDENCE** `useCharacterPersistence.saveCharacterState` catches errors and only `console.error`s (`:153–156`); the debounced autosave invokes it without checking the result (`:257–269`). `persistenceService.validateDataSize` throws a descriptive storage-limit error (`:207–223`), and `characterPersistenceService.saveCharacter` throws on any Firebase error (`:506–509`). Compare with the journal path, which now sets status and shows a user error (`useJournalPersistence.js:81–109`) using `vtt-react/src/store/persistenceStatusStore.js` (untracked, current worktree).
- **FAILURE SCENARIO** A Free-tier user hits the storage cap (or Firestore errors); every character autosave fails; the UI shows no error; the user closes the tab believing the character is saved. Local Zustand persistence may also fail under browser quota, leaving only in-memory state.
- **USER CONSEQUENCE** Silent loss of character progress (HP, inventory, buffs), exactly the data players track live.
- **LIKELIHOOD** Medium (quota/network), impact high.
- **RECOMMENDED MITIGATION** Route character saves through the same status/notification mechanism as journal, block/flag “unsaved changes”, and add retry/backoff plus export-as-fallback when quota is hit.
- **TEST NEEDED** Fault-injection test forcing `saveCharacterState` failure and asserting a visible error; quota-boundary test.

### P1-7 — Unbounded growth: chat subcollection and single-document worldbuilding/campaigns

- **EVIDENCE** Chat docs are written per message with no deletion (`firebaseService.js:447–475`); only reads are capped (`:116–119`). Worldbuilding categories and all campaigns are single documents (`bookStore.js:732–747`, `worldStore.js:736–752`, `campaignService.js:241–246`); Firestore caps documents at 1 MiB; failures are swallowed (`bookStore.js:743–746`, `campaignService.js:249–252`). `ITEM_SIZE_LIMITS`/`validateItemSize` exist (`storageLimitService.js:89–241`) but have no callers, so the declared per-item limits are **not enforced** for campaigns/rooms/journals.
- **FAILURE SCENARIO** A worldbuilder's book or a long campaign crosses 1 MiB; every `setDoc` fails silently; on next-device load, hydration never receives the missing updates. Meanwhile room chat keeps growing, increasing backup/quota costs and load time.
- **USER CONSEQUENCE** Content silently stops syncing while appearing saved on the authoring device; operator storage costs grow without bound.
- **LIKELIHOOD** Medium (doc-size) but increasing with content value; certain (chat growth).
- **RECOMMENDED MITIGATION** Pre-flight size checks with clear errors and subdocument sharding for large collections (per-book/per-campaign docs); chat retention policy (keep last N per room, archive or delete older); actually wire `validateItemSize` or remove it; add monitoring on write failures.
- **TEST NEEDED** Write a >1 MiB category document in an emulator and assert a user-visible error; retention job test.

### P1-8 — Cross-room sync injection via targeted `sync_*` events

- **EVIDENCE** `syncHandlers.js:58–65, 76–83, 94–101` look up `data.recipientPlayerId` across the global `players` map and emit `full_game_state_sync` to that socket without checking the recipient is in the sender's room or that the sender is a GM.
- **FAILURE SCENARIO** A malicious member of any room opens the app, crafts `sync_tokens` with a victim's player id (discoverable in shared/public rooms or via social features), and pushes fabricated token/grid/fog-friendly payloads into the victim's client.
- **USER CONSEQUENCE** Client-side spoofing at another table (fake tokens, hidden tokens); no server persistence, so it is transient and confusing rather than data loss.
- **LIKELIHOOD** Low-medium (requires a hostile user and id discovery), but the fix is small.
- **RECOMMENDED MITIGATION** Constrain recipient lookup to the sender's room, require GM for broadcasts to others, and stamp payloads with server-verified sender identity.
- **TEST NEEDED** Integration tests: cross-room targeted sync is rejected; same-room peer sync still works.

### P1-9 — Deployment integrity and rollback gaps

- **EVIDENCE** `deploy.yml:48–59` build env lacks `REACT_APP_FIREBASE_*`; a second Netlify pipeline is implied by `netlify.toml` itself. `config/netlify.toml` duplicates the root config. `deploy-rules.bat` is the only rules deployment path (manual); functions have no deployment path. The post-deploy check only curls `https://mythrill.netlify.app` (`deploy.yml:187–192`). No rollback documentation exists.
- **FAILURE SCENARIO** A production deploy ships a demo-mode bundle (if the Actions path is live), or rules drift from the repo because a manual deploy was skipped; a bad schema change has no automated gate and no rehearsed rollback.
- **USER CONSEQUENCE** Site appears broken/demo, data inaccessible; recovery is manual and slow.
- **LIKELIHOOD** Medium (pipeline ambiguity already exists).
- **RECOMMENDED MITIGATION** Pick one authoritative deploy pipeline, inject Firebase config via CI/secret or runtime config, add rules/functions tests + deploy to CI with staged environments, document rollback for each component, and extend smoke tests to include a server/socket handshake.
- **TEST NEEDED** CI dry-run verifying the built bundle contains a configured Firebase project id; staged rules test; rollback drill.

### P1-10 — LocalStorage is the only local safety net for some data, and it is not account-scoped

- Evidence: `storageUtils.js` implements a memory fallback on quota and an emergency cleanup that deletes the largest non-critical keys (`localStorageManager.js:169–227`; disposable prefixes at `:88–103`), including `mythrill_subregion_*`/`mythrill_map_*` caches. Campaigns live only in `mythrill-campaigns` (`campaignService.js:7`). Sign-out clears only guest-scoped keys (`authStore.js:336–368`); authenticated user data remains in LocalStorage, visible to the next account on the same browser profile.
- Scenario: User A signs out on a shared computer; User B signs in; User B's UI hydrates from cloud but localStorage drafts from User A can leak into views that read local state before/without cloud hydration; alternatively a quota event purges cached data while the user believes it is persisted.
- Consequence: privacy leakage between accounts on shared devices; local cache eviction can destroy the only copy of unsynced edits (combined with P1-5/P1-6).
- Likelihood: Medium (shared devices, quota events).
- Mitigation: namespace all persisted keys per uid and purge on sign-out; promote “unsynced changes” to a visible state; avoid destructive emergency cleanup for keys not owned by the current session.
- Test: sign-out/sign-in test asserting zero cross-account keys; quota-simulation test asserting user data survives or is explicitly reported.

### P2 findings (beta improvements)

- **P2-1 Token ownership fails open for unowned/legacy tokens** — `tokenHandlers.js:111–123`; explicit test “fails open” (`tokenHandlers.test.js`). Add a migration to stamp ownership or make default-deny with GM override. **TEST:** legacy token without owner cannot be moved by random players after migration.
- **P2-2 Non-GM creature/container/door mutations** — `environmentHandlers.js:30–117, 168–193` accept any member. Decide intentionally: cooperative or GM-controlled; document + gate.
- **P2-3 Category collections writable by any authenticated user** — `firestore.rules:257–260, 293–296, 335–338, 441–444`; community ratings forgeable (`:244–248` etc.). Restrict to admin/deduplicate per user.
- **P2-4 Combat authority OFF by default** — `combatAuthority.js:22–26`. Keep cooperative default but require an explicit room setting for public games and document the choice.
- **P2-5 Offline indicator promises sync that does not happen** — `offlineService.js:304–313, 360–370`. Either implement real queued writes or relabel the feature; add tests that character edits made offline are either synced or explicitly listed as unsaved.
- **P2-6 Presence and metrics exposure** — presence readable by all authenticated (`firestore.rules:36–41`), `/metrics` unauthenticated (`server.js:266–281`). Minor; restrict if privacy-sensitive.
- **P2-7 Storage-accounting drift** — three writers (§3.9); backups and `shared/` copies uncounted; negative counters possible (`functions/storageTriggers.js:120–125`). Implement a reconciliation job + floor at zero.
- **P2-8 Latent unit-mismatch trap** — `storageLimitService.canStoreData` compares byte counters against count limits when `dataType` is `characters`/`rooms`/`campaigns` (`:177–197` vs `STORAGE_LIMITS`). Not currently reachable (no caller passes those types), but a future call would block saves almost immediately. Fix or remove the branch.
- **P2-9 Dormant/unreferenced safety modules** — `lagCompensation.js`, `requestTracer.js`, `memoryManager.js` (only `global.memoryManager` lookups, never assigned), `syncRecoveryService.js` (no handler/engine imports), `validateItemSize`, `realtimeSync` update methods (no production callers; only `forceSyncAll` via GM `request_full_map_sync`). Document status or remove from the deployment narrative so they are not mistaken for active protections.
- **P2-10 Cascade cleanup path mismatches** — `functions/cascadeCleanup.js` triggers on top-level `campaigns/{id}` (user campaigns live at `users/{uid}/worldbuilding/campaigns`), and room cleanup looks for fields (`backgroundImage`, `mapImage`) that the server stores inside `gameState` maps. Status: partly **DORMANT**. Reconcile or remove to avoid false confidence in storage cleanup.
- **P2-11 Race between room creation lanes** — client `roomService.createPersistentRoom` writes the doc first with `isActive:false` and no password (`roomService.js:30–175`); server `createRoom`/`saveRoomData` later overwrites fields with `isActive:true` (`roomHandlers.js:214–371`). Duplicate/`arrayUnion` member updates exist at `roomService.js:341+`. Document the canonical path and remove dead branches.
- **P2-12 `save_room_state_request` is not GM-gated** — any member can trigger a full-state persist (`syncHandlers.js:117–130`); rate-limited but noisy. Gate to GM for cleanliness.

### P3 findings (post-launch improvements)

- **P3-1 Formal schema versioning and migration tooling** (see 3.15): add `schemaVersion` to room/character/worldbuilding docs; write forward migrations; keep a compatibility matrix. Test matrix: N-2 client + N server and vice versa.
- **P3-2 Dependency automation and audit gate** (3.29): Dependabot/Renovate + `npm audit`/SCA in CI.
- **P3-3 Load and soak testing** for large rooms/maps and long sessions (3.30); memory ceilings for the in-memory room store.
- **P3-4 Audit log for GM actions and moderation** — currently only file logs (3.18/3.19); a user-visible moderation/audit trail is a marketplace-scale need.
- **P3-5 Analytics for product decisions** — `analyticsService.js` exists but consent-gated (`config/firebase.js:94–105`); define a privacy-respecting event set for paid operators.
- **P3-6 Community marketplace integrity** — ratings can be written directly (P2-3); add server-side aggregation and abuse controls before monetizing community content.

---

## 5. Required failure-scenario deep dives

Each scenario below states the observed trace and a verdict grounded in the evidence above.

### 5.1 Server crashes mid-action

- **Trace:** Live room mutations are applied in memory first and queued to `FirebaseBatchWriter` (500 ms flush, 50-room batch). Movement queues flush every 50 ms (`syncService.js:112–116, 236–242`). Graceful paths: SIGINT/SIGTERM flush then exit (`:281–299`). `uncaughtException` logs and exits after 1 s **without flushing** (`server.js:347–351`); OOM/kill sends no signal at all. Client autosaves are debounced 2–3 s.
- **Verdict:** Crash loses the last ≤500 ms of batched room writes (plus unflushed client edits), and — via P0-2 — any failed write is already gone. On restart, `initializePersistentRooms` rebuilds from Firestore `isActive == true` docs; the P0-1 inline-state bug can turn recovery into an empty room. **NEEDS WORK BEFORE BETA (test the crash path explicitly).**

### 5.2 Client disconnects

- **Trace:** Player disconnects → retained in `room.disconnectedPlayers` for 30 min (`roomLifecycleHandlers.js:510–518`); GM disconnect marks the room inactive in memory only and broadcasts `gm_disconnected` (`:500–509`). `setRoomActiveStatus` (the only Firestore `isActive` writer) is exported but **never called**, so in-memory inactivity is not persisted until some other full room save occurs. Temporary rooms with no players are deleted after 30 min (`roomHandlers.js:415–441`); permanent rooms are never auto-deleted. Client auto-rejoin on reconnect (`useSocketConnection.js:60–117`).
- **Verdict:** ADEQUATE FOR PRIVATE USE; the persisted-`isActive` seam and crash combination are the open risks.

### 5.3 Firebase write partially fails

- **Trace:** Split save is a sequence of independent writes (`firebaseService.js:200–277`): core doc, `gameState/current`, N maps (`Promise.all`), chat (`Promise.all`). A mid-sequence failure leaves a room whose core doc and fragments disagree. The batch writer (P0-2) drops failed writes silently after logging.
- **Verdict:** NEEDS WORK BEFORE BETA. Mitigation: batch/transaction where possible, version + checksum per fragment, and reconcile on load (prefer the highest-version fragment, never mix silently).

### 5.4 Two clients modify the same state

- **Trace:** Server handlers mutate in-memory state on each event and broadcast; ordering is per-arrival (last-write-wins). `combat_turn_changed` broadcasts the full `turnOrder` from the server copy (`combatHandlers.js:197–201`). Client-side, character state has an explicit conflict modal (`useRealtimeSync.js`, `CharacterPersistenceProvider`); room state is `remote-wins` (`useRoomPersistence.js:211–219`); worldbuilding/campaign docs are whole-doc LWW. Per-field policies exist but only for token delta mode, currently off (`deltaSyncCapabilities.js`).
- **Verdict:** ADEQUATE FOR PRIVATE USE; before paid, define which entities have merge semantics (HP current is arguably a shared resource) and make LWW policy an explicit product decision with tests.

### 5.5 Deployment contains a bad schema change

- **Trace:** There is no schema in the deployment sense — Firestore collections are schemaless, clients tolerate missing fields with defaults (`transformFromStorage` uses optional chaining), and there is no `schemaVersion`. Rules/functions are manually deployed; the server has no migration step. The character round-trip drops unknown fields (3.15). There is no staged-environment definition in the repo.
- **Verdict:** NEEDS WORK BEFORE PAID LAUNCH: adopt additive-change discipline + versioned migrations + a rollback plan; test old-data/new-code against a snapshot before each release.

### 5.6 User loses connection

- **Trace:** Sockets auto-reconnect; on `connect` the client re-emits `join_room` with `isReconnect` (`useSocketConnection.js:92–98`), then requests `request_full_sync`/`request_combat_sync` (`connectionHandlers.js:213–273`). Offline editing of character/room state is effectively local-only: `offlineService` queues a small set of socket actions and explicitly no-ops character updates (`offlineService.js:304–313, 360–370`). localStorage persistence may hold local state (depending on store), but cloud reconciliation does not happen for character docs outside `useRealtimeSync` + autosave.
- **Verdict:** Reconnect ADEQUATE; the offline story is **not** what the UI promises. NEEDS WORK BEFORE BETA (labeling or implementation).

### 5.7 GM reconnects

- **Trace:** `join_room` reclaims the GM seat when `room.gmId === joiningUserId` (`roomLifecycleHandlers.js:303–353`), re-activates the room, emits `gm_reconnected`, and clients continue from server memory. If the server restarted, the room comes from `initializePersistentRooms`/`getRoomData` — subject to P0-1 and P0-3.
- **Verdict:** Works in the common single-process case; server-restart recovery needs P0-1/P0-3 fixed before it can be trusted.

### 5.8 Subscription status cannot be verified

- **Trace:** Server: `tierService.getUserTier` catches any Firestore error and returns FREE (`tierService.js:57–60`) with a 5-minute cache; permanent-room resume skips the tier check entirely (`roomLifecycleHandlers.js:67–79`). Client: `subscriptionService.getUserTier` falls back to FREE (`:410–413`). No billing provider exists to be unavailable.
- **Verdict:** Current behavior is fail-closed for entitlements but fail-open for *availability* (a paying GM can be told they are at their free limit during an outage). Before paid launch, define grace behavior + status messaging, and never rely on the client for entitlement.

### 5.9 Storage limit is reached

- **Trace:** Upload path pre-checks and attempts smart compression, then returns a user-visible error (`uploadService.js:134–159`). Journal/room/character state saves go through `persistenceService.validateDataSize`, which throws (`:207–223`); the journal surfaces the error, the character hook does not (P1-6). Worldbuilding/campaign stores do not pre-check at all. Firestore rules do not enforce cumulative quotas.
- **Verdict:** Mixed UX; NEEDS WORK BEFORE BETA (consistent quota errors and non-silent failures).

### 5.10 Old campaign data encounters new code

- **Trace:** Character round-trip enumerates fields (`transformForStorage` / `transformFromStorage`), so fields outside the known set do not survive a save cycle; room `gameState.maps` are created lazily (`validateMapExists`, `socketHandlers.js:54–107`) and unknown keys pass through; worldbuilding has ad-hoc normalizers (`normalizeBook`, and similar patterns in other stores). There is no version field to branch on.
- **Verdict:** Mostly graceful for known shapes, but the absence of versioning and the narrowing round-trip make silent degradation possible. NEEDS WORK BEFORE BETA to formalize; before paid, migration tests are mandatory.

---

## 6. Minimum trust gates

### 6.1 MINIMUM TRUSTWORTHY BETA

Assume invited, cooperative testers and no money changing hands. Required before beta:

1. Fix P0-1 (inline state loss), P0-2 (silent write loss), P0-3 (merge duplication). These are the data-integrity core.
2. Restrict room reads to GM/members (P0-4) or explicitly document that rooms are semi-public and remove sensitive state from the parent doc.
3. Make persistence failures visible: degraded-save banner/GM alert, `/metrics` counter, and log-based alert.
4. Implement consistent “save failed / storage full” UX for character, journal, and worldbuilding saves.
5. Correct the offline messaging or implement the promised queue (P2-5), and add the campaign dirty-guard (P1-5) to avoid overwrite-on-login.
6. Add rules/function test harnesses and deploy rules from one documented path; run them in CI (P1-9).
7. Decide and document GM/player authority model (combat flag default, creature/container edits, token-ownership migration).
8. Add a crash/restart recovery test and a basic restore drill for character data.

Beta OK to ship without: billing, marketplace integrity, load testing, dependency automation.

### 6.2 MINIMUM TRUSTWORTHY PAID LAUNCH

Assume real money and campaigns representing hundreds of hours. Required in addition to beta:

1. Billing integration with server-verified entitlements; server-side enforcement of storage/plan limits; explicit behavior when verification is down.
2. Firestore backup/exports + tested restore + documented DR runbook (and product-level import/export).
3. Complete account deletion across every collection and LocalStorage, verified by an automated seeded-account test; privacy policy alignment.
4. User-facing export for account content (campaigns, characters, journals, worldbuilding, rooms).
5. Campaign ownership architecture that does not concentrate all campaigns in one 1 MiB document; size guards with clear errors; chat retention.
6. Single authoritative deployment pipeline with rollback procedures for frontend, server, rules, and functions; smoke tests that include a socket handshake.
7. Schema-versioning policy + migration tests against a production snapshot.
8. A support-grade audit trail (who changed what in a room) and abuse/moderation controls for shipped community features.

### 6.3 WHAT CAN WAIT UNTIL AFTER LAUNCH

- Analytics expansion beyond consent-gated basics; deeper performance dashboards.
- Load/soak automation beyond a scheduled baseline test.
- Marketplace rating integrity hardening beyond anti-forgery minimums.
- Dependency automation (nice before launch, not a blocker if the SCA baseline is run).
- Formal audit logs for every player action (GM actions first).
- Multi-region serving and Redis scaling until concurrency requires it (the in-memory default is currently correct for one instance).

---

## Appendix A — Module status register (SHIPPED / PARTIAL / CONFIG-ONLY / DORMANT / LEGACY / UNKNOWN)

| Module | Status | Evidence |
| --- | --- | --- |
| `server/services/syncService.js` (batch writer, movement debouncer) | SHIPPED (defect P0-2) | used by all handlers; tests exist for handlers only |
| `server/services/realtimeSync.js` | PARTIAL / mostly DORMANT | constructed in server.js:185; only `forceSyncAll` reachable via GM `request_full_map_sync` (mapHandlers.js:312–325); its `update*` methods have no callers |
| `server/services/deltaSync.js` + `conflictPolicies.js` | PARTIAL | tested (`deltaSync.test.js`, `conflictPolicies.test.js`, integration policies) but only wired for tokens behind `ENABLE_TOKENS_DELTA` |
| `server/services/syncRecoveryService.js` | DORMANT | no imports outside itself |
| `server/services/lagCompensation.js` | DORMANT | no imports found |
| `server/services/requestTracer.js` | DORMANT | no imports found (referenced only in `server/docs/ARCHITECTURE.md`) |
| `server/services/memoryManager.js` | DORMANT | `errorHandler.js:219–220` reads `global.memoryManager`, never assigned |
| `server/services/optimizedFirebase.js` | PARTIAL | used only as a `RealtimeSyncEngine` constructor arg and delegate `getRoomData` |
| `vtt-react/src/services/offlineService.js` | PARTIAL / misleading | exposed in `OfflineIndicator.jsx`; core updates are no-ops |
| `vtt-react/src/services/firebase/characterBackupService.js` | SHIPPED (no UI) | invoked from `characterPersistenceService.saveCharacter`; restore has no consumer |
| `vtt-react/src/services/firebase/persistenceService.js` `getAllUserData` | DORMANT | no callers |
| `functions/cascadeCleanup.js` | PARTIAL | character/custom-map triggers match live paths; campaign trigger targets top-level `campaigns` while user campaigns live in `users/{uid}/worldbuilding/campaigns` |
| `functions/storageTriggers.js` | SHIPPED | matches `storage.rules` user paths; does not cover `shared/` |
| `server/services/tierService.js` | SHIPPED | room create/join enforcement; `clearTierCache` has no production callers |
| `firestore.rules` `chat_cooldowns`/`globalChat` | SHIPPED | 1 s cooldown enforced by batch rules |
| `vtt-react/src/services/campaignService.js` | SHIPPED (hazard P1-5) | active consumer in CampaignManager/Window, PersistenceProvider hydration |

## Appendix B — Contradiction register

1. **“SECURITY” comments vs rules reality**: `firestore.rules:133` says “Block anonymous (guest) reads — full members-only restriction deferred to Phase 6”. The comment is honest, but room reads remain open to all authenticated users — a gap, not a completed control.
2. **Offline promise vs implementation**: `offlineService.js` header claims “unbroken offline editing with automatic sync”; character updates are explicit no-ops (`:304–313`).
3. **Backup presence vs recoverability**: backup service exists and runs; no restore surface, no room/campaign backup, no export.
4. **`setRoomActiveStatus` vs use**: exported as the only persistence for active state, never called; in-memory `isActive` is authoritative at runtime, Firestore lags.
5. **Real-time sync engine vs usage**: a large tested engine exists but most of its capabilities are unreachable from production handlers.
6. **Bundle env vs Netlify env**: two build paths exist; the Actions path lacks Firebase env and would produce Demo Mode (`config/firebase.js:44–51`).
7. **Two `netlify.toml` files** (root and `config/`), identical intent, drift risk.
8. **`ITEM_SIZE_LIMITS` declared but never enforced**; `validateItemSize` has no callers.
9. **Storage accounting three-way split** (Cloud Functions increments, client counters, fragment deltas) with uncounted artifacts (backups, `shared/`).
10. **Presence rules comment** claims friend-search support while actual public projection is `userProfiles`; presence remains broadly readable.

## Appendix C — UNKNOWN register (not guessed)

- Whether the deployed bundle is built by Netlify (with env vars) or by GitHub Actions (without); whether Demo Mode has ever reached production.
- Whether production Firestore has PITR/backups enabled at the provider level (not in repo).
- Railway/Railway volume behavior on restart; log retention.
- Whether any rich-text render path misses `sanitizeHtml` (no exhaustive consumer audit).
- Whether `firestore.rules` is in sync with what is actually deployed (manual deploy).
- Actual production performance numbers, Firebase quota usage, and current collection sizes.
- Whether any external service (Analytics, hosting) is paid/active.

## Appendix D — Verification checklist for the reviewing architecture agent

1. Re-run the server suite:
   `cd server; .\node_modules\.bin\mocha.cmd tests/**/*.test.js --timeout 15000 --exit` (the full glob is approximate; the 11-file targeted run above passes 115 tests).
2. Re-run the three-path reproduction script logic (getRoomData inline discard; batch-writer false-drop; merge duplication) — the script is not committed; rebuild it from §0.3 in <100 lines using `require.cache` stubs for `firebase-admin` and `services/logger`.
3. Inspect the live rules in the Firebase console against `firestore.rules` before treating any authorization conclusion as current.
4. Run a rules-emulator test for P0-4 before/after any fix.
5. Confirm which CI/Netlify path is authoritative before changing deployment.
6. Do not delete or “clean up” any file listed as DORMANT — this repository intentionally archives concepts and unused systems (see the project operating instructions).

## Appendix E — What this audit did not change

- No application files were created, edited, deleted, renamed, or moved.
- The only new file is this document (`docs/COMMERCIAL_READINESS.md`).
- A temporary verification script was created outside the repository (`D:\AppData\Temp\opencode\verify-readiness.js`).
- The pre-existing dirty worktree (including untracked handlers, stores, and tests listed in §0.6) is preserved exactly as it was.
