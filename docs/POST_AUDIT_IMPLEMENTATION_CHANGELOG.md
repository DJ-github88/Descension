# POST-AUDIT IMPLEMENTATION CHANGELOG

> **Audience:** the final Mythrill synthesis agent.
> **Type:** factual delta document (audit state → subsequent changes → current state).
> **Not:** a new repository audit, a fix plan, or a claim that anything is fixed because code exists.

This document records implementation changes present in the **current worktree** that
post-date or overlap the repository audits, verifies their actual current behavior against
source, and records where the original audit findings still stand.

**Current source beats the old audit.** Where a change merely *intends* to fix a finding and
the failure condition is still reproducible from source or was not tested, the status is
`PARTIALLY RESOLVED` or `STILL PRESENT`, not `RESOLVED`.

---

## 0. Method, snapshot, and evidence rules

### 0.1 Snapshot

| Item | Value |
| --- | --- |
| Date of this document | 2026-10-04 |
| HEAD commit | `30768454` (`feat(level-editor): add modular road/path tiles...`) |
| Worktree state | Dirty. 516 `git status` entries; 333 tracked files changed (+12,147/−4,636) plus ~200 untracked files. All post-audit implementation changes below are **uncommitted**. |
| Code-change window observed | File mtimes: 2026-10-02 and 2026-10-03 13:47–14:55, 17:12, 18:08, 18:55, 19:31–19:59, 21:35–21:58. No production-code change found on 10-04. |
| Latest production-code change | `server/tests/mapHandlers.test.js` 2026-10-03 21:58; `server/handlers/socketHandlers.js` 2026-10-03 14:55. |
| Latest documentation change | `docs/WORLD_EFFECT_ENGINE.md` 2026-10-04 12:58 (documentation only). |

### 0.2 Audit corpus and ID schemes

Several different findings-ID schemes exist. None of the repository audits use literal `A1–F9`
finding IDs; the only `A–F` lettered scheme in the repo is the **Lore Consistency Audit prompt**
(A. Critical Findings, B. Major, C. Minor, D. Gaps, E. Metrics, F. Priority Order) and the class
overlap matrix (`C1–C6`). Mapping used in this document:

| Key | Source | ID scheme |
| --- | --- | --- |
| **SEC** | Security audit + fixes pass, recorded in Mind memory `security-audit-and-fixes-2026-10-03` (no standalone repo doc) | `C1–C3` (critical), `H1–H9` (high), `M1–M8` (medium), plus "users PII" and "M7 CSP" |
| **CR** | `docs/COMMERCIAL_READINESS.md` (75.9 KB, 2026-10-03 21:27) | Sections `3.1–3.31`; `P0-1..P0-4`, `P1-1..P1-10`, `P2-1..P2-12`, `P3-1..P3-6`; Appendices A–E |
| **MA** | `docs/MYTHRILL_MASTER_AUDIT.md` (82.2 KB, 2026-10-03 21:43) | Sections `1–19`; drift register `D1–D20`; debt register `TD-001..TD-025`; §16 Top-10 investigations |
| **GIP** | `docs/MYTHRILL_GAME_AND_IP_REVIEW.md` (80.0 KB, 2026-10-03 21:51) | Sections `0–13` (prose findings, no IDs) |
| **AA** | `docs/ASSET_ARCHAEOLOGY.md` (45.5 KB, 2026-10-03 21:04) | Prose findings, no IDs |
| **CSE** | `docs/CREATURE_SYSTEM_EVOLUTION.md` (77.7 KB, 2026-10-03 21:39) | Proposal document |
| **WEE** | `docs/WORLD_EFFECT_ENGINE.md` (89.3 KB, 2026-10-04 12:58) | Proposal document (research; no implementation) |
| **LORE** | `LORE_AUDIT_REPORT.md`, `docs/LORE_CONSISTENCY_AUDIT_*`, `docs/LORE_CRITICAL_ASSESSMENT.md`, etc. | `A–F` sections in the prompt; `C1–C3` in the critical assessment |

### 0.3 Important audit-timing fact

A large share of the server/client security work landed **before** the audit documents were
finalized (code 13:47–14:55 and 17:12 on 10-03; commercial readiness finalized 21:27, master
audit 21:43). The audits therefore partially *reflect* the fixes:

- MA already records the dev-auth gating (MA line 194) and the corrected authority table (§5),
  but still lists `TD-001` (ack drop), `TD-002/TD-003` (persistence) and `TD-006` (room reads) as open.
- CR says "AUTHENTICATION — CURRENTLY STRONG", references the `ALLOW_DEV_AUTH` gate, and still
  lists `P0-4` (any authenticated account can read every room) as open — correctly, as shown below.
- SEC work is not duplicated in the repo audits; this document treats the SEC memory as the
  audit record for those items and verifies the code directly.

### 0.4 Status labels used

| Label | Meaning |
| --- | --- |
| `RESOLVED` | Current source + tests demonstrate the failure condition is closed (or the audit target was purely additive). |
| `PARTIALLY RESOLVED` | Some paths fixed/guarded; the original failure condition is still reachable on at least one path, or verification is incomplete. |
| `STILL PRESENT` | The audit finding remains valid in current source. |
| `SUPERSEDED` | The original problem no longer applies because the surrounding system was replaced. |
| `UNKNOWN` | Cannot be established from the worktree (deployment state, external service state, or missing evidence). |

### 0.5 Tests run for this document (fresh, 2026-10-04)

| Command | Result |
| --- | --- |
| `server: npm test` | **250 passing** (6 s). Includes 7 token-authority tests, 6 GM-tools tests, 5 map-authz tests, relay tests, quest tests, session tests, sanitization tests. |
| `vtt-react: CI=true npx react-scripts test --watchAll=false --testPathPattern __tests__` | **174 suites passed / 1 skipped; 2295 tests passed, 3 skipped (2298 total)** in ~37 s. |

Deployment claims below that come from project memory (Firestore rules deployed, userProfiles
backfilled, Storage not provisioned, CSP not preview-validated) are marked and are **not**
independently verified by this pass.

---

## 1. Room authorization / invite-only joining

### 1.1 Permanent-room resume is owner-only

- **AREA**: Multiplayer room lifecycle / authorization.
- **ORIGINAL PROBLEM**: Any authenticated user could "resume" any permanent room by passing its
  (enumerable) `persistentRoomId` through `create_room`, taking over the room's GM slot and state.
  (SEC `C1`; MA §5; CR 3.2/3.4.)
- **WHAT CHANGED**: New `assertPermanentRoomAccess(persistedRoomData, userId)` helper that throws
  unless `persistedRoomData.gmId === socket.data.userId` (legacy rooms without `gmId` are let
  through). Called on both resume branches (existing in-memory room and Firestore-only room).
- **FILES CHANGED**: `server/handlers/roomLifecycleHandlers.js` (helper lines 20–28; calls lines
  105, 129).
- **CURRENT BEHAVIOR**: A non-owner calling `create_room` with `persistentRoomId` receives
  `room_error` ("Not authorized to resume this room"); the room is not created/resumed.
- **TESTS / VERIFICATION**: Source read. **No server test covers this gate** (`grep` of
  `server/tests` finds no `assertPermanentRoomAccess` / permanent-resume test). Heavily implied by
  `socket.data.userId` being set only from verified socket auth.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `C1`; CR 3.2/3.4; MA `TD-006` (adjacent); MA §5.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — code closes the `create_room` resume path; no test
  proves it, and the Firestore parent-doc read hole (CR `P0-4`) is still open (see 15.1).
- **KNOWN LIMITATIONS**:
  - Legacy rooms with no recorded `gmId` bypass the check.
  - `join_room` still accepts a client-supplied `data.userId` as a fallback
    (`roomLifecycleHandlers.js:303`) when `socket.data.userId` is absent (guests). This is used for
    tier checks and `disconnectedPlayers` reclaim; a guest could present a known user's id.
  - Invitation-based joins (`respond_to_room_invitation`) skip capacity/tier checks that
    `join_room` performs (see 1.2).

### 1.2 Invitation-required room invitation response

- **AREA**: Multiplayer join authorization.
- **ORIGINAL PROBLEM**: `respond_to_room_invitation` accepted any `roomId` without verifying an
  invitation existed, so any socket could join any room (bypassing password/invite flow).
  (SEC `C2`; integration-seams audit "remaining" list.)
- **WHAT CHANGED**: Handler now looks up `partyInvitations.get(data.invitationId)`, rejects with
  `join_error` ("A valid invitation is required to join this room") if missing or if
  `invitation.roomId !== data.roomId`, and consumes the invitation regardless of accept/decline.
- **FILES CHANGED**: `server/handlers/sessionHandlers.js` lines 88–102 (gate), 121–124 (join),
  135–165 (room_joined/player_joined emissions); `partyInvitations` map comes from
  `sessionInvitationHandlers.js`.
- **CURRENT BEHAVIOR**: Uninvited sockets cannot use this path to join. Invited sockets join the
  room channel and receive `room_joined`.
- **TESTS / VERIFICATION**: Source read. No dedicated test (no invitation-gating tests in
  `server/tests`). The path is not exercised by the integration suite.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `C2`; CR 3.4; integration-seams remaining list.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — gate exists; untested; direct `join_room` remains an
  independent open path (1.4); invitation join skips capacity/tier checks.
- **KNOWN LIMITATIONS**: A player who obtains a valid invitation fills the room without the
  max-player/tier checks that `join_room` enforces.

### 1.3 Join-request responder must be the leader or GM

- **AREA**: Join-request approval authorization.
- **ORIGINAL PROBLEM**: Any socket holding the `requestId` could accept/decline a session
  join request. (SEC `H1–H5` family; integration-seams.)
- **WHAT CHANGED**: `respond_to_join_request` now derives the responder identity from
  `socket.data.userId` / the server player record and requires `responder.isGM` or
  `responderId === request.leaderId`, emitting `join_error` otherwise.
- **FILES CHANGED**: `server/handlers/sessionInvitationHandlers.js` lines 105–116.
- **CURRENT BEHAVIOR**: Unauthorized responders are rejected and logged; the request remains
  until the legitimate responder acts or it expires.
- **TESTS / VERIFICATION**: Source read; covered only indirectly by session-handler tests
  (launch/response), not by a join-request test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `H1–H5`; integration-seams.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` (untested).

### 1.4 Direct `join_room` is not invite-only (still present)

- **AREA**: Room authorization.
- **ORIGINAL PROBLEM**: No invite-only room concept exists; joining requires only a room id and
  the password (often empty). CR 3.4 and MA §18 Q3 ask whether room reads/joins should be
  members-only before launch.
- **WHAT CHANGED**: Nothing on this path. `join_room` still verifies only
  `verifyPassword(password, room.passwordHash)` (empty password passes), capacity/tier, then adds
  the player (`roomLifecycleHandlers.js:287–412`). Client-invitation joins use the separate
  `respond_to_room_invitation` path.
- **FILES CHANGED**: none.
- **CURRENT BEHAVIOR**: Open/password rooms are joinable by id; "invite-only joining" exists only
  for the party/session invitation flow, not as a room setting.
- **TESTS / VERIFICATION**: `server/tests/integration.test.js:183` joins a room; no invite-only
  scenario exists to test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR 3.4, `P0-4`; MA §18 Q3.
- **CURRENT STATUS**: `STILL PRESENT` (feature/product decision; not a regression).
- **KNOWN LIMITATIONS**: `data.userId` fallback noted in 1.1.

---

## 2. Verified identity and ownership

### 2.1 Presence and status identity from the socket only

- **AREA**: Social presence identity.
- **ORIGINAL PROBLEM**: `register_presence` accepted `data.userId`; `update_status` looked users up
  by client-supplied `userId`, allowing impersonation/status forgery. (SEC `H6`.)
- **WHAT CHANGED**: `register_presence` uses `socket.data.userId` only (guests get
  `guest-<socketId>`); `originalUserId` is always null. `update_status` looks up the presence entry
  by the socket and broadcasts only that identity.
- **FILES CHANGED**: `server/handlers/partyHandlers.js` lines 171–250.
- **CURRENT BEHAVIOR**: A socket can only register/update its own presence; client `userId` is
  ignored.
- **TESTS / VERIFICATION**: Source read; server suite 250 passing (no dedicated test for these two
  events found).
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `H6`; CR 3.20/3.21 adjacent.
- **CURRENT STATUS**: `RESOLVED` at source level (unit tests do not target it).
- **KNOWN LIMITATIONS**: None found in this path; note `join_room` `data.userId` fallback (1.1).

### 2.2 Character resource writes: self or GM only

- **AREA**: Character authority.
- **ORIGINAL PROBLEM**: `character_resource_updated` accepted a client `playerId`/`senderSocketId`
  and let a non-GM modify another player's character resources. (SEC `H2`; test-coverage workstream.)
- **WHAT CHANGED**: Non-GMs may only target themselves (`targetPlayer.id === senderPlayer.id` or
  matching `userId`); otherwise the event is dropped and logged.
- **FILES CHANGED**: `server/handlers/characterHandlers.js` lines 220–235;
  `server/tests/characterHandlers.test.js` (3 tests: non-GM blocked, self allowed, GM allowed).
- **CURRENT BEHAVIOR**: Non-GM cross-player resource writes are ignored.
- **TESTS / VERIFICATION**: `server/tests/characterHandlers.test.js` passes in the 250-test run.
  Handler-level harness; production middleware is not composed (see 13.2).
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `H2`; MA §5 authority table.
- **CURRENT STATUS**: `RESOLVED`.
- **KNOWN LIMITATIONS**: Other character events (`character_updated`, `character_equipment_updated`,
  `buff_update`, `debuff_update`) still use plain membership checks
  (`characterHandlers.js:94–185, 309–359`); the audit's GM/self boundary was only applied to
  `character_resource_updated`.

### 2.3 Token ownership and delegated control

- **AREA**: Token authority.
- **ORIGINAL PROBLEM**: Any room member could update/move/remove tokens regardless of owner;
  `token_control_response` accepted control without a GM grant, enabling self-grant of another
  player's token. (SEC `M4`; CR `P2-1`; MA §5.)
- **WHAT CHANGED**:
  - `token_created` stamps `ownerPlayerId` from the creating server player (`tokenHandlers.js:64–70`).
  - `token_moved`, `token_updated`, `token_removed`, `token_dismissed`,
    `character_token_removed`, `character_token_updated` now require GM, owner, or a recorded
    delegate (`tokenHandlers.js:100–124, 138–188, 399–505`).
  - `token_control_granted` records `room.pendingTokenControls[tokenId]`; `token_control_response`
    only accepts if that pending grant matches the player (GM exempt).
  - `character_token_created` blocks non-GM creation for a different player.
- **FILES CHANGED**: `server/handlers/tokenHandlers.js`; `server/tests/tokenHandlers.test.js`
  (7 tests, including "blocks a self-grant without a pending GM grant").
- **CURRENT BEHAVIOR**: Ownership is enforced on update/move/remove; delegated control requires a
  GM-issued pending grant.
- **TESTS / VERIFICATION**: `tokenHandlers.test.js` passes in the 250-test run.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M4`; CR `P2-1`; MA §5.
- **CURRENT STATUS**: `PARTIALLY RESOLVED`.
- **KNOWN LIMITATIONS**:
  - **Legacy/unowned tokens fail open** — enforced ownership only applies when `ownerId` exists;
    `tokenHandlers.test.js` keeps an explicit "fails open for unowned/legacy tokens" test. No
    backfill/migration stamps owners on existing room state (CR `P2-1`, MA `TD-012/013`).
  - `token_created` spreads `data.token` before stamping `ownerPlayerId`, so a client could still
    place an arbitrary `playerId` field inside the token object (attribution noise, not privilege
    escalation).
  - Token routing fields (`roomId`/`mapId`/`actionId`) are still stripped by Joi (see 15.3, MA `D2/D3`).

---

## 3. GM kick / mute / settings handlers

### 3.1 GM Tools server half

- **AREA**: GM controls.
- **ORIGINAL PROBLEM**: The GM Tools panel emitted `request_player_list`, `request_room_settings`,
  `update_room_settings`, `mute_player`, `kick_player` with **no server handlers** (integration-seams
  audit "GM Tools have no server handlers at all").
- **WHAT CHANGED**: New `server/handlers/gmToolsHandlers.js` (registered in
  `server/handlers/socketHandlers.js:153`): `request_player_list → player_list_updated`,
  `request_room_settings → room_settings_updated`, `update_room_settings` (merge + broadcast),
  `mute_player` (sets `player.muted`), `kick_player` (emits `player_kicked`, leaves the room,
  removes membership/map assignment, emits `player_left` + refreshed list). Every event is gated by
  `validateRoomMembership(socket, undefined, true)` (GM required).
- **FILES CHANGED**: `server/handlers/gmToolsHandlers.js` (new, 181 lines);
  `server/handlers/socketHandlers.js` (import/registration);
  `server/tests/gmToolsHandlers.test.js` (6 tests); client `GMToolsPanel.jsx` (named listeners +
  "Launch Session" button emitting `launch_game_session`).
- **CURRENT BEHAVIOR**: Full GM-tools round trip works at handler level; non-GM calls are no-ops.
- **TESTS / VERIFICATION**: `gmToolsHandlers.test.js` passes in the 250-test run (GM gating,
  list payload, settings merge, mute flag, kick removal/notifications).
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams "GM Tools server handlers missing";
  CR 3.5 (GM/player boundaries); SEC `H1–H5`.
- **CURRENT STATUS**: `RESOLVED` (handler level).
- **KNOWN LIMITATIONS**:
  - **No unmute event** exists (`mute_player` is one-way; `grep` finds no `unmute` server event).
  - Mute is in-memory on the player record and **is lost on reconnect/rejoin** (rejoin builds a new
    player object).
  - Kick is removal, not a ban: the kicked user can rejoin with the room password.
  - `update_room_settings` merges arbitrary keys with no field whitelist (GM-only, but unvalidated).
  - No moderation audit trail (CR `P3-4`).

### 3.2 Mute enforcement in chat + client feedback

- **AREA**: Chat moderation.
- **ORIGINAL PROBLEM**: Mute flag (once added) had to actually block messages, and the client had
  no listener for the rejection (open item in the GM-tools implementation memory).
- **WHAT CHANGED**: `chatHandlers.js` blocks `chat_message` from `player.muted` and emits
  `chat_muted`; `ChatWindow.jsx` listens `chat_muted` and appends a system message (correct render
  shape: `{playerName, content, isGM, type, timestamp}`).
- **FILES CHANGED**: `server/handlers/chatHandlers.js` lines 33–39; client
  `components/multiplayer/ChatWindow.jsx` (also named-handler cleanup, see 11.1);
  `server/tests/relayHandlers.test.js` ("blocks a muted player").
- **CURRENT BEHAVIOR**: Muted players cannot send room chat and see a system message.
- **TESTS / VERIFICATION**: `relayHandlers.test.js` passes.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR 3.5; SEC `H1–H5` family.
- **CURRENT STATUS**: `RESOLVED` (with the mute-persistence limitation in 3.1).

### 3.3 Client handles being kicked

- **AREA**: Client room lifecycle.
- **ORIGINAL PROBLEM**: No client listener for `player_kicked`; kicked players would linger.
- **WHAT CHANGED**: `socketHandlers/roomLifecycleHandlers.js` handles `player_kicked` (and
  `access_revoked`): runs `handleLeaveRoom()` then navigates to `/`.
- **FILES CHANGED**: `vtt-react/src/components/multiplayer/socketHandlers/roomLifecycleHandlers.js`
  lines 713–745.
- **CURRENT BEHAVIOR**: Kicked clients clean up and return to the landing page.
- **TESTS / VERIFICATION**: Source read; no dedicated client test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams event wiring.
- **CURRENT STATUS**: `RESOLVED` (code level).

---

## 4. Multiplayer relays (cursor / typing / dice / spells)

### 4.1 Spell, dice, and typing relays

- **AREA**: Multiplayer event relays.
- **ORIGINAL PROBLEM**: Client emitted `spell_cast`, `dice_roll`, `user_typing`,
  `user_stopped_typing`, but the server had no relay, so these never reached other players
  (integration-seams remaining list).
- **WHAT CHANGED**:
  - `combatHandlers.js`: `spell_cast` relay stamps server-side `casterName`/`playerId`;
    `dice_roll → dice_roll_result` honoring `room.settings.diceVisibility`
    (`all` broadcast / `gm` targeted to `room.gm.socketId` / `private` drop).
  - `chatHandlers.js`: `user_typing` / `user_stopped_typing` relay with server identity.
- **FILES CHANGED**: `server/handlers/combatHandlers.js` lines 282–336;
  `server/handlers/chatHandlers.js` lines 75–88;
  `server/tests/relayHandlers.test.js` (6 tests).
- **CURRENT BEHAVIOR**: All three relay families work with server-authoritative identity; dice
  privacy settings are honored.
- **TESTS / VERIFICATION**: `relayHandlers.test.js` passes in the 250-test run.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams remaining list; SEC `H3/H4` (identity
  stamping); MA §5 (dice/spell authority rows).
- **CURRENT STATUS**: `RESOLVED` (handler level).
- **KNOWN LIMITATIONS**: `dialogue_message` still has **no server handler** (MA `TD-007`, §5 known
  risk 5) — multiplayer dialogue remains client-only.

### 4.2 Cursor relay event-name mismatch

- **AREA**: Multiplayer cursor.
- **ORIGINAL PROBLEM**: Server emits `cursor_moved` (`server/handlers/utilityHandlers.js:26–30`)
  while `CursorTracker.jsx` listened for `cursor_move`; remote cursors never appeared
  (integration-seams name mismatches).
- **WHAT CHANGED**: Client now listens/cleans `cursor_moved`.
- **FILES CHANGED**: `vtt-react/src/components/multiplayer/CursorTracker.jsx` lines 83–89.
- **CURRENT BEHAVIOR**: Remote cursor positions are received on the correct event. The relay itself
  (`cursor_move` in → `cursor_moved` out) predates this change.
- **TESTS / VERIFICATION**: Source read; no dedicated test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams event-name list.
- **CURRENT STATUS**: `RESOLVED` (code level).

### 4.3 Session launch/response, full-sync reply, socket errors

- **AREA**: Multiplayer session events and recovery.
- **ORIGINAL PROBLEM**:
  - Server emitted `game_session_started`/`game_session_accepted`; client listened
    `game_session_launched`/`game_session_response`.
  - `request_full_sync` replied `full_sync`; client listens `full_game_state_sync`.
  - No client handling of `socket_error`.
- **WHAT CHANGED**:
  - `sessionHandlers.js`: `launch_game_session → game_session_launched {gmName,roomName,...}`;
    `respond_to_game_session → game_session_response {playerId,playerName,accepted}` (room broadcast).
  - `syncHandlers.js`: `request_full_sync` emits `full_game_state_sync` with tokens/characterTokens/
    gridItems/fog/mapData/combat/players/gm/room.
  - `connectionHandlers.js`: `socket_error` shows a notification and triggers `request_full_sync`.
- **FILES CHANGED**: `server/handlers/sessionHandlers.js` lines 24–55;
  `server/handlers/syncHandlers.js` lines 26–48;
  client `socketHandlers/connectionHandlers.js` lines 182–199, 279.
- **CURRENT BEHAVIOR**: Session launch/response reach the intended clients; a failed full-sync
  request uses the correct event; server errors attempt recovery.
- **TESTS / VERIFICATION**: `server/tests/sessionHandlers.test.js` (2 tests) passes; client suite
  passes.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams event-name list; MA §5
  (RECONNECTION/RECOVERY).
- **CURRENT STATUS**: `RESOLVED`.

---

## 5. Quest multiplayer flow

### 5.1 Missing quest server subsystem

- **AREA**: Quests / multiplayer.
- **ORIGINAL PROBLEM**: Client had a complete quest emit/listen protocol; the server had **zero
  quest handlers**, so sharing/accepting/completing/denying quests never reached other players
  (integration-seams remaining list; MA §5 quests row).
- **WHAT CHANGED**: New `server/handlers/questHandlers.js` (registered in `socketHandlers.js`)
  implementing:
  - `share_quest` (GM-gated) → `quest_shared` to room + `quest_share_confirmed` to GM;
  - `quest_accepted` / `quest_declined` → `*_notification` to room (client GM-gates);
  - `quest_complete_request` → `quest_completion_pending` + `quest_completion_request_sent`;
  - `quest_rewards_delivered` (GM) → targeted `rewards_received` via `emitToUserId` +
    `rewards_delivery_confirmed`;
  - `quest_completion_denied` (GM) → targeted `completion_denied`.
  Oversized quests (>256 KB serialized) are rejected.
- **FILES CHANGED**: `server/handlers/questHandlers.js` (new, 208 lines);
  `server/handlers/socketHandlers.js`; client
  `socketHandlers/questHandlers.js` (GM self-filter + `sharedBy.name` fix);
  `server/tests/questHandlers.test.js` (9 tests).
- **CURRENT BEHAVIOR**: Full quest flow relays to the correct recipients; canonical quest list
  remains client-side.
- **TESTS / VERIFICATION**: `questHandlers.test.js` passes in the 250-test run.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams "quest multiplayer server subsystem
  entirely missing"; MA §5.
- **CURRENT STATUS**: `RESOLVED` (protocol relay).
- **KNOWN LIMITATIONS**: Shared/offered quests are **ephemeral** — no room persistence, no resync
  after reconnect (recorded in the implementation memory; re-verify against current client store
  before relying on it). No server-side validation of quest content beyond size.

---

## 6. Private / public user data separation

### 6.1 `users/{uid}` is owner-only; `userProfiles/{uid}` is the public projection

- **AREA**: PII / Firestore rules.
- **ORIGINAL PROBLEM**: `users/{uid}` was readable by any authenticated user (friend search read
  the whole user doc, exposing email/PII). (SEC "users PII"; CR 3.20; integration-seams rules
  cluster.)
- **WHAT CHANGED**:
  - `firestore.rules`: `users/{uid}` read is now `request.auth.uid == userId` only; create
    additionally allows `subscriptionTier == 'free'` but protects tier updates.
  - `userProfiles/{uid}` block now allows authenticated read, owner write.
  - `authService.js`: friend-id existence/search use `userProfiles`; new `_writePublicProfile`
    (displayName/photoURL/friendId/friendId_lowercase, merge) is called on create, login, and
    `updateUserData`; new `getUserProfile(uid)`.
  - `friendLists/{userId}` rule added (used by account deletion).
  - Additional scoping in the same rules pass: `roomSessions` read owner-only; `rollSessions`
    read/update owner-or-GM, create owner; `customRollableTables` owner-only;
    `characterRollStats` create fixed (`resource.data` invalid on create); `character_backups`
    owner-only; public rating collections read-public/create-owner.
  - Mind memory claims **114 existing users were backfilled** into `userProfiles` and
    `firestore.rules` was deployed. **Evidence gap:** no backfill script exists anywhere in the
    repo now (`backfill-user-profiles.js` not found), so the backfill is not independently
    verifiable from the worktree.
- **FILES CHANGED**: `firestore.rules` (lines 19–30, 110–120, 174–179, 334–367);
  `vtt-react/src/services/authService.js` (lines 217–236, 341+, 432+).
- **CURRENT BEHAVIOR**: Owner-only reads of the private user doc; any authenticated user can read
  the public projection.
- **TESTS / VERIFICATION**: Source read; **no Firestore rules tests exist** (CR 3.28). Server 250 /
  client 2295 pass but do not exercise rules. Deployment and backfill claimed in project memory;
  not verified here.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC users PII; CR 3.20, `P1-3` (partial); MA `TD-006`
  (adjacent), §16 item 6; integration-seams rules cluster.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — rule/code split is correct; deployment and legacy
  backfill are `UNKNOWN`.
- **KNOWN LIMITATIONS**: Without the projection backfilled, friend search misses legacy users.
  `users/{uid}` is still not deleted by account deletion (see 15.2).

### 6.2 Scoped read rules for sessions/rolls/tables (same rules pass)

- **AREA**: Firestore rules scoping.
- **ORIGINAL PROBLEM**: `roomSessions`, `rollSessions`, `item_comments`, `characterRollStats`,
  `customRollableTables` were readable/writable too broadly (SEC `M2`; integration-seams rules
  cluster).
- **WHAT CHANGED**: Owner/GM-scoped rules as listed in 6.1; `item_ratings` fixed to use a `userId`
  field instead of the invalid `endsWith()`/composite-key parsing.
- **FILES CHANGED**: `firestore.rules`.
- **CURRENT BEHAVIOR**: Rules compile as part of the known-deployed ruleset (project memory).
- **TESTS / VERIFICATION**: No rules emulator tests; verified by source read only.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M1/M2`; CR `P2-3` (partial), MA `TD-015` (partial).
- **CURRENT STATUS**: `PARTIALLY RESOLVED`. Category/taxonomy collections remain writable by any
  authenticated user (`firestore.rules:258–259, 294–295, 336–337, 342–343`) — CR `P2-3`/MA
  `TD-015` still valid.

---

## 7. Uploaded image privacy and copy-on-publish

- **AREA**: Firebase Storage privacy + community publishing.
- **ORIGINAL PROBLEM**: Every user asset (`users/{uid}/tokens|portraits|battlemaps|...`) was
  readable by **any authenticated user**, and community copies referenced the private original
  URLs. (SEC `M3`; second-integration-sweep storage notes.)
- **WHAT CHANGED**:
  - `storage.rules`: all `users/{uid}/**` read rules are now `isOwner(userId)` (tokens, portraits,
    cards, battlemaps, scenes, custom-maps, banners, journal, lore, misc, audio, legacy paths);
    added missing categories (`maps`, `quests`, `board-backgrounds`, `book-images`) and the
    `shared/{userId}/{fileName=**}` prefix (authenticated read; owner create/update/delete;
    image/audio only; 25 MB cap).
  - `uploadService.js`: `copyAssetToShared(userId, sourceUrl, category)` copies a private asset
    into `shared/{uid}/...` and returns the public URL; `shareEntityImages(userId, entity,
    category, fields)` loops image fields. Both **fail soft** — on any error they keep the
    original URL.
  - Community publish flows call it before upload:
    `userSpellService.shareSpellToCommunity` (image/icon),
    `userItemsService.shareItemToCommunity` (image/icon/tokenImage),
    `userCreaturesService.shareCreatureToCommunity` (tokenImage/image/portrait/icon/avatar),
    `userMapsService.shareMapToCommunity` (image/imageUrl/thumbnail/thumbnailUrl).
  - `deploy-rules.bat` now deploys `firestore.rules,storage` together.
- **FILES CHANGED**: `storage.rules`; `vtt-react/src/services/firebase/uploadService.js` lines
  298–352; the four `user*Service.js` share functions; `deploy-rules.bat`.
- **CURRENT BEHAVIOR**: Private assets are owner-read; published community content references
  `shared/` copies so it stays visible after the private source closes.
- **TESTS / VERIFICATION**: Source read. **No rules tests.** Project memory (second sweep + security
  pass) states **Firebase Storage is not provisioned** on the project — `firebase deploy --only
  storage` fails and uploads fall back — so the tightened storage rules and copy path are
  **not confirmed deployable**. This is the largest verification gap in the security work.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M3`, `M7`-adjacent; CR 3.31/`P2-7` (partial).
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — code correct, deployment/operability unverified.
- **KNOWN LIMITATIONS**:
  - Fail-soft copy means a failed copy publishes an unreachable private URL (broken art) instead
    of blocking publish.
  - Copies are duplicated storage never accounted for (CR `P2-7` storage-accounting drift).
  - Existing community docs published before the rule change may still point at private URLs.

---

## 8. Campaign persistence consolidation

- **AREA**: Campaign persistence.
- **ORIGINAL PROBLEM**: Three coexisting campaign paths: (A) `src/services/campaignService.js`
  localStorage singleton → one doc `users/{uid}/worldbuilding/campaigns` (used by UI), (B)
  `src/services/firebase/campaignService.js` per-campaign docs (used only by
  `useCampaignPersistence`), and a third delete target `userCampaigns`. (MA `D13`, `TD-011`;
  CR 3.9/3.11.)
- **WHAT CHANGED**:
  - `useCampaignPersistence.js` rewritten to delegate to service A: save → `syncToCloud`; load →
    `hydrateFromCloud` **only if the campaign is absent locally**; delete → `campaignService.
    deleteCampaign` + immediate sync; 3 s debounce + 15 s safety poll.
  - Deleted `src/services/firebase/campaignService.js` and removed its registration plus
    `saveCampaign`/`loadCampaign`/`deleteCampaign` from `persistenceService.js`.
  - `persistenceService.getAllUserData`/`deleteAllUserData` now read/delete the single
    worldbuilding campaigns doc (`_getWorldbuildingCampaigns` / `_deleteWorldbuildingCampaigns`).
  - Dead `userCampaigns` Firestore rule removed (rules redeployed per project memory).
  - Also deleted `src/services/firebase/globalChatService.js` (0 importers) and
    `roomService.subscribeToRoom` (unused) in the same cleanup window.
- **FILES CHANGED**: `vtt-react/src/hooks/useCampaignPersistence.js` (rewritten, 199 lines);
  `vtt-react/src/services/firebase/persistenceService.js`;
  deleted `vtt-react/src/services/firebase/campaignService.js`,
  `vtt-react/src/services/firebase/globalChatService.js`; `vtt-react/src/services/roomService.js`;
  `firestore.rules`.
- **CURRENT BEHAVIOR**: One active campaign path; no remaining references to the deleted module
  (verified by import grep at implementation time).
- **TESTS / VERIFICATION**: Client suite 2295 passing; no dedicated campaign-persistence test found.
- **AUDIT FINDINGS THIS MAY ADDRESS**: MA `D13`, `TD-011`; CR 3.11 (partial); integration-seams
  backlog "campaigns use 3 paths".
- **CURRENT STATUS**: `RESOLVED` (consolidation). CR `P1-5` and `P1-7` consequences remain
  (see 9.2 and 15.2).

---

## 9. Offline edit protection

### 9.1 Worldbuilding dirty-flag guard + write-loop fix

- **AREA**: Worldbuilding cloud hydration/autosync.
- **ORIGINAL PROBLEM**: Login hydration replaced newer local (offline) edits with older cloud
  copies; and the provider's auto-sync subscription retriggered itself because `syncToCloud` sets
  `lastCloudSyncAt`, producing an endless ~2 s Firestore write loop (second-sweep backlog item;
  CR `P1-5` family).
- **WHAT CHANGED**: `PersistenceProvider.jsx` now:
  - tracks a `mythrill_wb_dirty_<key>` localStorage flag per worldbuilding store
    (books, interactiveMaps, familyTrees, lineages, factions, timelines, quests, worlds, deities,
    languages),
  - skips hydration for dirty stores and immediately pushes them up (`scheduleSync(0)`),
  - clears the flag when `syncToCloud` resolves,
  - computes changed keys from `(state, prevState)` and ignores `lastCloudSyncAt`-only changes to
    break the loop,
  - unsubscribes all store subscriptions on cleanup.
- **FILES CHANGED**: `vtt-react/src/components/providers/PersistenceProvider.jsx` lines 122–229.
- **CURRENT BEHAVIOR**: Local unsynced edits survive login hydration for those ten stores.
- **TESTS / VERIFICATION**: Client suite passes; the implementation memory records
  "Runtime offline behavior not explicitly tested."
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P1-5` (worldbuilding half), `P1-10` (partially),
  second-sweep backlog.
- **CURRENT STATUS**: `PARTIALLY RESOLVED`.
- **KNOWN LIMITATIONS**:
  - Dirty flags are plain localStorage keys, **not namespaced per uid** (CR `P1-10`), so a second
    account on a shared browser can inherit another user's dirty flag (hydration skipped) or vice
    versa.
  - **Campaigns are not covered by this guard** — `PersistenceProvider` still calls
    `campaignService.hydrateFromCloud(user.uid)` unconditionally on login, and
    `hydrateFromCloud` replaces the whole local array when the cloud doc is non-empty
    (`campaignService.js:255–283`). Only the in-session hook path avoids the clobber (9.2).

### 9.2 Campaign load no longer clobbers in-session edits

- **AREA**: Campaign offline protection.
- **ORIGINAL PROBLEM**: CR `P1-5` — offline campaign edits could be silently overwritten on login.
- **WHAT CHANGED**: `useCampaignPersistence.loadCampaign` only calls
  `campaignService.hydrateFromCloud` when the campaign is **not present locally**; the hook also
  saves on a 3 s debounce and a 15 s safety poll.
- **FILES CHANGED**: `vtt-react/src/hooks/useCampaignPersistence.js` lines 87–108, 150–165.
- **CURRENT BEHAVIOR**: Opening the campaign manager with an existing local campaign does not
  replace it with the cloud copy.
- **TESTS / VERIFICATION**: Source read; no unit test for hydrate-skip.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P1-5`.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — the login-time `PersistenceProvider` hydration path
  still replaces local campaigns (see 9.1 limitation); CR `P1-5` remains valid for that path.

### 9.3 Offline service: idempotent listeners, character write neutralized

- **AREA**: Offline editing / listeners.
- **ORIGINAL PROBLEM**: `initializeOfflineSupport` stacked global `online`/`offline` listeners on
  every auth refresh; `syncOfflineData` wrote the flat offline-cache shape into
  `characters/{id}`, polluting the canonical nested document (second-sweep backlog; CR `P2-5`).
- **WHAT CHANGED**:
  - One-time initialization guard; handlers stored so they are only added once.
  - `processQueuedAction('update_character')` is now an explicit **no-op** (comment: canonical
    writes go through `characterPersistenceService`).
  - `syncOfflineData` no longer writes `characters/{id}`; it just marks cache entries `synced`.
- **FILES CHANGED**: `vtt-react/src/services/offlineService.js` lines 76–95, 303–380.
- **CURRENT BEHAVIOR**: No more schema pollution and no listener stacking, but **offline character
  edits are not uploaded by this service at all**.
- **TESTS / VERIFICATION**: Source read; client suite passes.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P2-5` (partially — the "wrong shape" corruption is
  gone), second-sweep backlog.
- **CURRENT STATUS**: `PARTIALLY RESOLVED` — CR `P2-5` ("offline indicator promises sync that does
  not happen") remains true; offline character work now stays in localStorage only.
- **KNOWN LIMITATIONS**: Product decision needed: implement a real offline queue or relabel the
  offline promise. Combined with CR `P1-10`, a localStorage quota purge can destroy the only copy.

---

## 10. Persistence / save behavior

### 10.1 Journal load no longer clobbers local state; save status surfaced

- **AREA**: Journal persistence.
- **ORIGINAL PROBLEM**: `journalService.loadJournal` returned an empty default structure when no
  cloud doc existed (or on read failure), which could overwrite local/guest journal state on login;
  journal saves had no user-visible status. (Second-sweep backlog; CR `P1-6` comparison.)
- **WHAT CHANGED**:
  - `journalService.loadJournal` returns `null` when the doc does not exist and on read errors.
  - `useJournalPersistence` writes `persistenceStatusStore` statuses
    (`saving`/`saved`/`error`) and raises `notificationStore.showError` on failure.
  - `PersistenceProvider` state includes `masterBoardBackground`; `PlayerJournalWindow` shows a
    Saving/Saved/Not-saved chip.
- **FILES CHANGED**: `vtt-react/src/services/firebase/journalService.js` lines 94–135;
  `vtt-react/src/hooks/useJournalPersistence.js`; new
  `vtt-react/src/store/persistenceStatusStore.js`; `PlayerJournalWindow.jsx/css`.
- **CURRENT BEHAVIOR**: Missing/failed journal reads leave local state alone; failed saves are
  visible to the user.
- **TESTS / VERIFICATION**: Client suite 2295 passing (PlayerJournalWindow suites included).
- **AUDIT FINDINGS THIS MAY ADDRESS**: second-sweep backlog; CR `P1-6` (pattern to replicate, not
  applied to characters), `P2-5`.
- **CURRENT STATUS**: `RESOLVED` for journal.

### 10.2 Room-state hydration now returns combat/chat/buffs

- **AREA**: Room-state persistence.
- **ORIGINAL PROBLEM**: `roomStateService` saved `combat`, `chatHistory`, and `buffsAndDebuffs`
  but `loadRoomState` did not return them, so they were never hydrated (second-sweep backlog).
- **WHAT CHANGED**: Load now returns `combat`, `chatHistory`, `buffsAndDebuffs` (defaults null).
- **FILES CHANGED**: `vtt-react/src/services/firebase/roomStateService.js` lines 126–137.
- **CURRENT BEHAVIOR**: These fields round-trip through the client room-state doc.
- **TESTS / VERIFICATION**: Source read; no dedicated test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: second-sweep backlog; MA §6 persistence map.
- **CURRENT STATUS**: `RESOLVED` (code level).

### 10.3 User item/creature/map edits now persist (not just creates)

- **AREA**: User content persistence.
- **ORIGINAL PROBLEM**: `useUser*Persistence` only synced records missing `createdAt`/`updatedAt`/
  `userId`, so edits to already-synced items/creatures/maps were never written back (second-sweep
  backlog).
- **WHAT CHANGED**: Each hook keeps a `synced*Ref` map of `id → JSON` and writes any record whose
  serialized content changed; marks entries after a successful save; evicts deleted ids. `createdAt`
  is now preserved instead of overwritten.
- **FILES CHANGED**: `vtt-react/src/hooks/useUserCreaturesPersistence.js`,
  `useUserItemsPersistence.js`, `useUserMapsPersistence.js`.
- **CURRENT BEHAVIOR**: Edits to user-created content sync; unchanged records are not rewritten.
- **TESTS / VERIFICATION**: Client suite passes; no dedicated test for these hooks found.
- **AUDIT FINDINGS THIS MAY ADDRESS**: second-sweep backlog "user items/creatures/maps sync
  create-only (never writes back ids → edits never persist)".
- **CURRENT STATUS**: `RESOLVED` (code level).
- **KNOWN LIMITATIONS**: JSON-stringify comparison is order-sensitive; a reordered object triggers
  a write (harmless, extra writes). Deletions are only tracked locally (`liveIds` eviction), not
  propagated.

### 10.4 Character inventory hydration

- **AREA**: Character persistence.
- **ORIGINAL PROBLEM**: `useCharacterPersistence.loadCharacterState` hydrated the character store
  but not `inventoryStore`, which is what the inventory UI reads (second-sweep backlog).
- **WHAT CHANGED**: On load, `useInventoryStore.setState({items, currency, encumbranceState,
  containers})` from `result.inventory`.
- **FILES CHANGED**: `vtt-react/src/hooks/useCharacterPersistence.js` lines 217–227.
- **CURRENT BEHAVIOR**: Inventory UI reflects the loaded character.
- **TESTS / VERIFICATION**: Client inventory suites pass; new
  `characterPersistence.test.js` exists (untracked).
- **AUDIT FINDINGS THIS MAY ADDRESS**: second-sweep backlog.
- **CURRENT STATUS**: `RESOLVED` (code level).

### 10.5 Character autosave failure is still silent (audit finding valid)

- **AREA**: Character persistence.
- **ORIGINAL PROBLEM**: CR `P1-6` — `saveCharacterState` catches errors and only `console.error`s;
  the debounced autosave ignores the result, so quota/network failures are invisible.
- **WHAT CHANGED**: Nothing. Current `useCharacterPersistence.js:131–156` still catches, logs
  `console.error('Failed to save character state:', error)`, and returns a failure result that the
  autosave path does not surface. The only change in this file is inventory hydration (10.4).
- **FILES CHANGED**: none addressing `P1-6`.
- **CURRENT BEHAVIOR**: A failed character save is silent; the user believes the character is
  saved.
- **TESTS / VERIFICATION**: Source read. Contrast with the journal path (10.1), which now stores
  status and toasts.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P1-6` (not addressed).
- **CURRENT STATUS**: `STILL PRESENT`.

### 10.6 Server room persistence reliability (audit findings valid)

- **AREA**: Server persistence.
- **ORIGINAL PROBLEM** (CR `P0-1`, `P0-2`, `P0-3`; MA `TD-002`, `TD-003`):
  1. `firebaseService.getRoomData()` clears inline `gameState` before the fragment fallback
     (returns `{}` when no fragment exists).
  2. `FirebaseBatchWriter` treats `updateRoomGameState() === false` as success; data silently
     dropped; `save_room_state_request` emits `room_state_saved` whenever the promise resolves.
  3. `mergeRoomGameStateForResume` concatenates arrays; resuming the same room duplicates
     drawingPaths/environmentalObjects/turnOrder.
- **WHAT CHANGED**: Nothing. `server/services/firebaseService.js`, `server/services/syncService.js`,
  `server/handlers/roomHandlers.js` are **not modified** in the worktree. Current
  `syncHandlers.js:117–130` still ignores the return value of
  `firebaseService.updateRoomGameState(...)` and emits success.
- **FILES CHANGED**: none.
- **CURRENT BEHAVIOR**: The audited failure conditions remain: resume can load empty state and
  overwrite; failed writes are reported as saved; resumes can duplicate arrays.
- **TESTS / VERIFICATION**: Source re-read against the audit's file:line evidence (all still
  accurate). The 2026-10-04 WEE memory independently re-confirms: "inline-state discard, false
  batch-write success, resume array concatenation … remain in inspected source."
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P0-1/P0-2/P0-3`; MA `TD-002/TD-003`, §16 items 2–3.
- **CURRENT STATUS**: `STILL PRESENT`.

### 10.7 `save_room_state_request` is still not GM-gated (audit finding valid)

- **AREA**: Server persistence authority.
- **ORIGINAL PROBLEM**: CR `P2-12` — any member can trigger a full-state persist.
- **WHAT CHANGED**: Nothing (`syncHandlers.js:117–130` unchanged in this respect).
- **FILES CHANGED**: none.
- **CURRENT BEHAVIOR**: Any member can force a room-state persist.
- **TESTS / VERIFICATION**: Source read.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P2-12`.
- **CURRENT STATUS**: `STILL PRESENT`.

---

## 11. Listener / timer cleanup

### 11.1 Client resource-leak and listener-removal cleanup

- **AREA**: Client lifecycle hygiene.
- **ORIGINAL PROBLEM**: Long-session memory growth and a correctness bug where
  `socket.off(event)` removed **all** listeners for an event (including the central
  `socketHandlers/*`), plus stacked global listeners and unbounded Maps/timers.
- **WHAT CHANGED** (all verified present in current source):
  - `optimisticUpdatesService`: `confirmedUpdates` evicted directly (lines 172–174); added
    `destroy()` clearing the 60 s interval (185–188).
  - `analyticsService.js`: one-time init guard (comment at line 213).
  - `offlineService.js`: idempotent global listeners (9.3).
  - `enhancedDiceService.js`: stores `_diceResultHandler`, `off`s before re-registering, `destroy()`
    (lines 98–114).
  - `travelStore.js`: offs travel handlers before re-init.
  - `effectProcessingService.js`: prunes `lastTickTimes` per tick.
  - `mapImagePreloader.js`: `MAX_CACHE_ENTRIES = 20` FIFO cap (lines 13–21).
  - `presenceStore.js`: cleanup now `removeAllListeners()` + disconnects the socket.
  - `ChatWindow.jsx` / `GMToolsPanel.jsx`: named handlers + `off(event, handler)`.
  - `performanceService.js`: init guard; `useSocketConnection.js`: clears presence socket binding
    on teardown (lines 186–200).
- **FILES CHANGED**: `vtt-react/src/services/{optimisticUpdatesService,analyticsService,
  offlineService,enhancedDiceService,effectProcessingService,performanceService}.js`;
  `vtt-react/src/store/{travelStore,presenceStore}.js`; `vtt-react/src/utils/mapImagePreloader.js`;
  `vtt-react/src/components/multiplayer/{ChatWindow,useSocketConnection}.jsx`;
  `vtt-react/src/components/gm-tools/GMToolsPanel.jsx`.
- **CURRENT BEHAVIOR**: Idempotent initializers, bounded caches, handler-scoped teardown.
- **TESTS / VERIFICATION**: Client suite 2295 passing; the cleanup memory reports 174 suites
  passing at the time. Leak behavior itself is not stress-tested.
- **AUDIT FINDINGS THIS MAY ADDRESS**: none of the five audits enumerated these leaks directly;
  recorded in Mind (`client-resource-leak-cleanup-2026-10-03`). Relevant to CR 3.30 performance.
- **CURRENT STATUS**: `RESOLVED` (code level).
- **KNOWN LIMITATIONS**: `writeThrottle.cooldownUntil` still has no expiry sweep (bounded today;
  latent per the implementation memory).

### 11.2 Server rate-limit keying; **ack drop still present**

- **AREA**: Server rate limiting.
- **ORIGINAL PROBLEM** (MA `TD-001`, §5 known risk 1): the rate-limit wrapper
  `(data) => handler(data)` **drops Socket.IO ack callbacks**, so `map_update`/`token_created`
  confirmations never resolve.
- **WHAT CHANGED**: `rateLimitService.createMiddleware` now keys limits by
  `socket.data?.userId || socket.id` (reconnect does not reset the limit), cleans violation counts
  on disconnect, and `server.js` sets `disconnectOnViolation: true`.
- **FILES CHANGED**: `server/services/rateLimitService.js`, `server/server.js`.
- **CURRENT BEHAVIOR**: **Ack callbacks are still dropped.** Current code:
  `const rateLimitedHandler = async(data) => { ... await handler(data); }` — the rest-args/ack are
  not forwarded (lines 185–233).
- **TESTS / VERIFICATION**: Source read confirms the wrapper signature; the repo's own probe
  finding (MA `TD-001`) is still accurate. No test composes real middleware with handlers
  (MA §5 risk 3).
- **AUDIT FINDINGS THIS MAY ADDRESS**: partial improvement only.
- **CURRENT STATUS**: `STILL PRESENT` (TD-001), with uid-keying improvements layered on top.

---

## 12. Notes and character marginalia persistence

### 12.1 Map annotations (pins/areas) rules, UI, and failure surfacing

- **AREA**: Notes — immersion map annotations.
- **ORIGINAL PROBLEM** (Mind `note-persistence-audit-2026-10-02`): `userMapAnnotations/{uid}/pins|
  areas` and `mapShares` had **no rules** (default deny) so saves failed silently; the
  `AnnotationToolbar` was imported but never rendered; failures were swallowed.
- **WHAT CHANGED**:
  - `firestore.rules`: added owner-only `userMapAnnotations/{userId}/pins|areas` and `mapShares`
    (recipient read via `toUserId`, sender create, both update/delete).
  - `WorldMapImmerse.jsx`: renders `AnnotationToolbar` (gated), passes active share, fixes sender
    name + pin-limit field.
  - `mapAnnotationStore.js`: `notifySaveFailure(...)` raises a `notificationStore` error for pin/
    area/share save failures instead of silently failing.
- **FILES CHANGED**: `firestore.rules` (lines 595–620); `WorldMapImmerse.jsx`;
  `vtt-react/src/store/mapAnnotationStore.js`.
- **CURRENT BEHAVIOR**: Annotation creation is reachable and save failures are visible.
- **TESTS / VERIFICATION**: Client suite passes (map/annotation-related suites included). Rules
  deployment claimed in project memory; no rules tests.
- **AUDIT FINDINGS THIS MAY ADDRESS**: Mind note-persistence audit (not one of the five repo
  audits); adjacent to CR 3.20/3.31.
- **CURRENT STATUS**: `RESOLVED` (code + unit level) with deployment `UNKNOWN` outside memory.
- **KNOWN LIMITATIONS**: The old `InteractiveMapStudio` note UI remains dead (`addPlayerNote`
  undefined) per the audit; not re-checked for changes in this pass.

### 12.2 Character "Marginalia & Notes" autosave

- **AREA**: Character notes.
- **ORIGINAL PROBLEM**: `updateLore` only mutated the store + multiplayer sync; `lore` is not in
  the runtime `characterStates` document and was never persisted to the canonical
  `characters/{id}` doc (Mind note audit).
- **WHAT CHANGED**: `infoSlice.updateLore` now calls
  `triggerCharacterAutoSave(() => get().saveCurrentCharacter())` when a current character exists
  (lines 1018–1024).
- **FILES CHANGED**: `vtt-react/src/store/characterSlices/infoSlice.js`.
- **CURRENT BEHAVIOR**: Marginalia edits flow to the canonical character document (debounced).
- **TESTS / VERIFICATION**: Client suite passes; no dedicated marginalia test.
- **AUDIT FINDINGS THIS MAY ADDRESS**: Mind note-persistence audit.
- **CURRENT STATUS**: `RESOLVED` (code level).
- **KNOWN LIMITATIONS**: No save-failure status for this path (character silent-failure issue,
  10.5, applies).

### 12.3 Journal show-to-players wiring

- **AREA**: Notes / multiplayer hand-outs.
- **ORIGINAL PROBLEM**: Client `showToPlayers` had no emit and the client journal handler was not
  registered; server had a handler but nothing called it (Mind note audit; MA `TD-007` adjacent).
- **WHAT CHANGED**:
  - `shareableStore.showToPlayers` emits `journal_show_to_players` via
    `gameStore.multiplayerSocket` (guarded); added `receiveRemoteKnowledge` (no re-emit).
  - `socketHandlers/registerAllHandlers.js` registers `registerJournalHandlers` and the new
    `registerInventoryHandlers`.
  - Server `journalHandlers.js:23–31` remains GM-gated (`validateRoomMembership(..., true)`).
- **FILES CHANGED**: `vtt-react/src/store/shareableStore.js`;
  `vtt-react/src/components/multiplayer/socketHandlers/registerAllHandlers.js`.
- **CURRENT BEHAVIOR**: GM hand-outs broadcast to the room; recipients display without echoing.
- **TESTS / VERIFICATION**: Client `shareableStore` suite passes.
- **AUDIT FINDINGS THIS MAY ADDRESS**: Mind note-persistence audit "Show to Players multiplayer
  DEAD"; integration-seams handler registration.
- **CURRENT STATUS**: `RESOLVED` (code level).

### 12.4 Privacy-scoped inventory relay

- **AREA**: Inventory multiplayer.
- **ORIGINAL PROBLEM**: `inventory_update` was broadcast with no client listener; the risk of a
  naive listener was leaking other players' inventories (open item in GM-tools memory).
- **WHAT CHANGED**: New client `socketHandlers/inventoryHandlers.js` (registered) applies
  `inventory_update` only when `data.playerId === characterStore.currentCharacterId`
  (same-account cross-device); `inventoryStore.applyRemoteInventory` updates via raw `set()`
  (no re-broadcast, no echo). 2 new inventoryStore tests.
- **FILES CHANGED**: new `socketHandlers/inventoryHandlers.js`;
  `vtt-react/src/store/inventoryStore.js` lines 407–443;
  `vtt-react/src/store/__tests__/inventoryStore.test.js`.
- **CURRENT BEHAVIOR**: Other players' inventories stay private; same-account devices sync.
- **TESTS / VERIFICATION**: inventoryStore tests pass inside the 2295-test run.
- **AUDIT FINDINGS THIS MAY ADDRESS**: CR `P1-3`-adjacent privacy; MA §5 "Inventory: peer broadcast
  only".
- **CURRENT STATUS**: `RESOLVED` (code level).
- **KNOWN LIMITATIONS**: `inventory_update` remains **peer-trusted** on the server (MA §5 known
  risk 6); a hostile member can still fabricate an `inventory_update` for another player id, but a
  normal client ignores it unless it targets its own active character. Server validation is still
  absent.

---

## 13. Combat / progression / math tests

### 13.1 Coverage added for previously untested high-risk modules

- **AREA**: Tests.
- **ORIGINAL PROBLEM**: A coverage audit flagged untested high-risk modules
  (`experienceUtils`, `pointBuySystem`, character slices, `consumableUtils`, `storageLimitService`,
  `mapHandlers`, `characterHandlers`) and one useless test that asserted on literal markup.
- **WHAT CHANGED** (all new/updated files present; all suites green in the fresh run):
  - `vtt-react/src/utils/__tests__/experienceUtils.test.js` (11) — XP clamps/boundaries, level
    thresholds, rewards.
  - `vtt-react/src/utils/__tests__/pointBuySystem.test.js` (11) — costs, pools, increase/decrease
    no-ops.
  - `vtt-react/src/store/characterSlices/__tests__/resourceSlice.test.js` (5) — clamps, temp
    resources, AP/mana partials, recalculation.
  - `vtt-react/src/store/characterSlices/__tests__/statsSlice.test.js` (2) — derived max health
    vs constitution.
  - `vtt-react/src/utils/__tests__/consumableUtils.test.js` (7) — adjustments, overheal, duration
    units.
  - `vtt-react/src/services/firebase/__tests__/storageLimitService.test.js` (4) — size estimate vs
    `Blob`, formatting, tier table.
  - `server/tests/characterHandlers.test.js` (3) — self/GM resource authority.
  - `server/tests/mapHandlers.test.js` (5) — GM-only create/delete, non-GM
    `sync_level_editor_state` blocked.
  - Deleted `vtt-react/src/components/world-map/__tests__/ImmersionTransition.test.jsx` (rendered
    literal markup; zero coverage).
- **FILES CHANGED**: the test files above (see §0.5 results).
- **CURRENT BEHAVIOR**: Server 250 passing; client 174 suites / 2295 tests passing.
- **TESTS / VERIFICATION**: Both suites were re-run for this document on 2026-10-04.
- **AUDIT FINDINGS THIS MAY ADDRESS**: the coverage gaps recorded in the Mind
  `test-coverage-additions-*`, `combat-math-slice-*`, `consumable-and-storage-*`,
  `map-handlers-authz-*` memories; MA §10 testing.
- **CURRENT STATUS**: `RESOLVED` for the flagged gaps.

### 13.2 Test-harness gaps that remain valid

- **AREA**: Tests / CI.
- **ORIGINAL PROBLEM**:
  - MA `TD-014`: frontend lint step is `--if-present` with no `lint` script; server lint not run in
    CI.
  - MA §5 known risk 3: `server/tests/helpers/integrationServer.js` bypasses
    validation/sanitization/rate-limit/auth middleware, so integration tests do not prove the
    production middleware stack (which is why `TD-001` survives).
  - CR 3.28: no Firestore rules tests; CI does not deploy rules/functions.
- **WHAT CHANGED**: New handler tests use stubs (`validateRoomMembership`, captured `socket.on`);
  they lock handler behavior but still do not compose real middleware. `deploy-rules.bat` now
  includes storage, but it is a manual script, not CI.
- **FILES CHANGED**: test files listed in 13.1.
- **CURRENT BEHAVIOR**: Handler contracts are tested; production wiring still is not.
- **TESTS / VERIFICATION**: Read of `server/tests/helpers/integrationServer.js` unchanged; CI
  workflow (`.github/workflows/deploy.yml`) not modified in this worktree.
- **AUDIT FINDINGS THIS MAY ADDRESS**: MA `TD-001`, `TD-014`, §5 risk 3; CR 3.28/`P1-9`.
- **CURRENT STATUS**: `STILL PRESENT`.

---

## 14. Other post-audit changes (not in the focus list)

### 14.1 Central HTML sanitizer wired into markdown sinks

- **AREA**: XSS hardening.
- **ORIGINAL PROBLEM**: SEC `M8` — markdown → `dangerouslySetInnerHTML` sinks were unsanitized
  (including ClassGuideTab, RulesPage, ClassDetailDisplay, TimelineDisplay, RulesSummaryBox,
  RollableTableSummary, Step1/Step9 creation steps, SubraceTab).
- **WHAT CHANGED**: New dependency-free `vtt-react/src/utils/sanitizeHtml.js` (DOM-based; strips
  dangerous tags, `on*` handlers, javascript:/vbscript:/data: URLs; tag-strip fallback without a
  DOM). All identified sinks now call it; 5 unit tests added.
- **FILES CHANGED**: `vtt-react/src/utils/sanitizeHtml.js` (new), 10+ component files, tests.
- **CURRENT BEHAVIOR**: Rendered markdown HTML is sanitized.
- **TESTS / VERIFICATION**: `sanitizeHtml.test.js` passes (5 tests) in the 2295 run.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M8`.
- **CURRENT STATUS**: `RESOLVED` (code + tests).
- **KNOWN LIMITATIONS**: Hand-rolled sanitizer (not DOMPurify); no fuzzing. `data:` is blocked for
  URL attributes, which may break intentional data-URL images if any sink used them.

### 14.2 Community rating/creator rules corrected

- **AREA**: Firestore rules — community collections.
- **ORIGINAL PROBLEM**: SEC `M1` used `hasAny` where `hasOnly` is required (non-owner could edit
  arbitrary fields while only ratings changed); ownership fields mismatched (`authorId`/
  `originalUserId` vs `userId`); rating creates were impossible (`resource.data` on create);
  several collections had no rule. (Integration-seams rules cluster; CR `P2-3`.)
- **WHAT CHANGED**: `hasOnly` for affected-key checks; create/update/delete accept
  `userId`/`authorId`/`originalUserId`; separate create rules for ratings/favorites/
  `characterRollStats`; item_comments create attributed to `userId`; `community_maps` uploads
  acknowledge `originalUserId`.
- **FILES CHANGED**: `firestore.rules`.
- **CURRENT BEHAVIOR**: Rating-only field edits allowed; owner mutations permitted.
- **TESTS / VERIFICATION**: No rules tests; rules compile/deploy per project memory.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M1`; integration-seams; CR `P2-3` (partial — categories
  still any-auth write).
- **CURRENT STATUS**: `PARTIALLY RESOLVED`.

### 14.3 Moderation collections gated on an `admin` custom claim

- **AREA**: Moderation / rules.
- **ORIGINAL PROBLEM**: No moderation gate; earlier rules were a permissive stopgap.
- **WHAT CHANGED**: `isAdmin()` (`request.auth.token.admin == true`); `contentReports`
  read/update/delete admin, create reporter-only; `moderationActions` admin; `filteredWords` public
  read / admin write. Granting requires `admin.auth().setCustomUserClaims(uid, { admin: true })`
  (documented in rules comments).
- **FILES CHANGED**: `firestore.rules`; client admin surfaces rely on the claim.
- **CURRENT BEHAVIOR**: Moderation dashboard inaccessible until the claim is granted/refreshed
  (expected).
- **TESTS / VERIFICATION**: No rules tests; deployment per project memory.
- **AUDIT FINDINGS THIS MAY ADDRESS**: integration-seams "moderation rules are a permissive
  stopgap"; CR `P3-6`.
- **CURRENT STATUS**: `RESOLVED` (code level) with no rules-test evidence.

### 14.4 Dev-auth / debug / CORS hardening

- **AREA**: Server security hardening.
- **ORIGINAL PROBLEM**: SEC `C3`, `H7`, `H8/H9`; second-sweep backlog (env-var mismatches, rate
  limiter mounted after its only route, `/debug/logs` open when token unset).
- **WHAT CHANGED**:
  - `socketAuthMiddleware.js` and `socketHandlers.js` accept unverified dev tokens/JWTs only when
    `!isProduction && (ALLOW_DEV_AUTH==='true' || NODE_ENV==='development')`.
  - Client `useSocketConnection.js` sends dev tokens only when `!isProduction()`; `authStore.js`
    `ADMIN_DEV_LOGIN_ENABLED = !isProduction()` and no longer clobbers an active admin bypass.
  - `server/server.js`: `/debug/logs` fails closed unless a token is configured **and** supplied
    (`DEBUG_API_TOKEN` or `DEBUG_TOKEN`); CORS accepts `ALLOWED_ORIGINS` or `CORS_ORIGIN`; the API
    rate limiter is mounted before `/api/rooms`.
  - `server/.env.example` documents `ALLOW_DEV_AUTH` and `DEBUG_TOKEN`.
- **FILES CHANGED**: `server/services/socketAuthMiddleware.js`, `server/handlers/socketHandlers.js`,
  `server/server.js`, `server/.env.example`, `vtt-react/src/components/multiplayer/
  useSocketConnection.js`, `vtt-react/src/store/authStore.js`.
- **CURRENT BEHAVIOR**: Production paths reject dev tokens; debug endpoint closed by default.
- **TESTS / VERIFICATION**: Source read; server suite passes (no test for `/debug/logs`).
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `C3`, `H7`, `H8/H9`; second-sweep backlog;
  CR 3.1.
- **CURRENT STATUS**: `RESOLVED` (code level).
- **NEW RISK**: `server/.env.example` ships `ALLOW_DEV_AUTH=true`. The code requires
  non-production for it to matter, but a self-hosted deploy with `NODE_ENV` unset and that env file
  copied verbatim would accept forgeable dev tokens. Treat `.env.example` as documentation, and
  set `NODE_ENV=production` explicitly.

### 14.5 CSP tightened (still pending preview validation)

- **AREA**: CSP / deployment.
- **ORIGINAL PROBLEM**: SEC `M7` — `script-src` allowed `'unsafe-eval'`; no `object-src`/
  `base-uri`/`form-action`/`frame-ancestors`; production REST/socket polling was blocked because
  `connect-src` lacked the Railway HTTPS origin (second-sweep).
- **WHAT CHANGED**: both `netlify.toml` and `config/netlify.toml`: removed `'unsafe-eval'`, added
  `object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`, added
  `https://descension-mythrill.up.railway.app` to `connect-src`.
- **FILES CHANGED**: `netlify.toml`, `config/netlify.toml`.
- **CURRENT BEHAVIOR**: Policy headers changed at the repo level.
- **TESTS / VERIFICATION**: **Not runtime-verified.** The security pass memory explicitly lists
  "validate CSP on a Netlify preview deploy (especially Google sign-in)" as remaining, and
  `'unsafe-inline'` remains in `script-src`.
- **AUDIT FINDINGS THIS MAY ADDRESS**: SEC `M7` (partial); second-sweep connect-src.
- **CURRENT STATUS**: `PARTIALLY RESOLVED`.
- **KNOWN LIMITATIONS**: `'unsafe-inline'` script-src remains; Headers may break Google sign-in if
  preview validation fails.

### 14.6 Class acquisition/body-state persistence and character pipeline additions

- **AREA**: Character persistence (product feature, class-evidence workstream).
- **ORIGINAL PROBLEM**: Not a repository-audit finding; new `classAcquisition` and `bodyStates`
  character fields would have been dropped by persistence.
- **WHAT CHANGED**: `characterPersistenceService.transformForStorage/FromStorage` persists
  `basicInfo.classAcquisition`/`bodyStates`; exported transforms for tests; core/info slices carry
  the fields; resource slice uses managed class-resource contracts with auto-save; client tests
  added (`characterPersistence.test.js`, many `*ResourceContract` tests).
- **FILES CHANGED**: `characterPersistenceService.js`, `characterSlices/{coreSlice,infoSlice,
  resourceSlice}.js`, multiple data contract modules and tests (see §0.5).
- **CURRENT BEHAVIOR**: New fields round-trip; class resources normalize through contracts.
- **TESTS / VERIFICATION**: Client 2295 passing.
- **AUDIT FINDINGS THIS MAY ADDRESS**: not in the five audits; related to GIP §5/§6/§7 themes
  (class identity, progression) as product work. GIP's specific inventory/talent divergence items
  are **not** demonstrably addressed by this change set.
- **CURRENT STATUS**: `RESOLVED` for the persistence round-trip; GIP content findings remain
  out of scope of this document.

### 14.7 Content/lore and class-data work (not reconciled here)

- **AREA**: Lore/class/heritage content.
- **ORIGINAL PROBLEM**: Multiple audits/reviews (LORE A–F, GIP, CSE, AA) cover lore consistency,
  class identity, creature systems and assets.
- **WHAT CHANGED**: Very large content diffs (races, subraces, backgrounds, classes, resources,
  languages, timeline, lore.json/rules.json, compendium docs, subrace imagery). These are
  product/content changes concurrent with the audits, not engine fixes.
- **FILES CHANGED**: hundreds under `vtt-react/src/data/**`, `vtt-react/public/data/**`,
  `docs/**`, root lore docs.
- **CURRENT BEHAVIOR**: Content revised; behavior unaffected.
- **TESTS / VERIFICATION**: Content-verification tests added (heritage roster, resource contracts,
  background roster, class heritage registry, etc.) all passing.
- **AUDIT FINDINGS THIS MAY ADDRESS**: selectively, the LORE/GIP/CSE program — **not** reconciled
  item-by-item in this document. Consume `LORE_IMPLEMENTATION_STATUS.md` and
  `docs/GAME_AND_IP_REVIEW` for that program's own tracker.
- **CURRENT STATUS**: `UNKNOWN` relative to those audits (out of scope here).

### 14.8 WORLD_EFFECT_ENGINE.md research (documentation only)

- **AREA**: Effects engine research.
- **ORIGINAL PROBLEM**: Audits/architecture need a decision on future effect/zone execution; the
  WEE document was authored 10-04.
- **WHAT CHANGED**: Documentation only. It explicitly records that the reliability prerequisites
  (`P0-1..P0-3` equivalents: inline-state discard, false batch-write success, resume array
  concatenation, dropped rate-limit acks, routing-field stripping, competing room writes) remain in
  source and were **not** fixed by it.
- **FILES CHANGED**: `docs/WORLD_EFFECT_ENGINE.md`.
- **CURRENT BEHAVIOR**: No runtime change.
- **TESTS / VERIFICATION**: N/A.
- **AUDIT FINDINGS THIS MAY ADDRESS**: N/A (proposal).
- **CURRENT STATUS**: `RESOLVED` as documentation; no implementation.

---

## 15. Consolidated audit findings that remain valid

This section exists so the synthesis agent can trust the audit text where it is still accurate.

### 15.1 COMMERCIAL_READINESS (CR) — still valid

| ID | Finding | Current evidence |
| --- | --- | --- |
| `P0-1` | `getRoomData()` discards inline room `gameState` | `server/services/firebaseService.js` unmodified; audit file:line still accurate |
| `P0-2` | Persistence failures silently discarded; `false` treated as success | `server/services/syncService.js` + `firebaseService.js` unmodified; `syncHandlers.js:117–130` ignores the return value |
| `P0-3` | Resume merge duplicates arrays | `server/handlers/roomHandlers.js` unmodified |
| `P0-4` / `TD-006` | Any authenticated non-anonymous user can read every room doc | `firestore.rules:133–135` still `allow read: if request.auth != null && sign_in_provider != 'anonymous'`; comment says "members-only deferred to Phase 6" |
| `P1-1` | No billing/subscription system | no billing code in worktree |
| `P1-2` | No Firestore backup/restore/DR | no export config/runbook in worktree |
| `P1-3` | Account deletion leaves residual data | `persistenceService.deleteAllUserData` still leaves `users/{uid}`, `userProfiles/{uid}`, worldbuilding (non-campaign), spellbook/actionBar, userSettings, character_backups, community content, member-rooms, localStorage; friend deletion now uses `friendLists`/`friendRequests` doc-id=userId (mismatch with auto-id creation likely remains) |
| `P1-4` | No user-facing data export | `getAllUserData` still has **zero callers** |
| `P1-5` | Offline campaign edits overwritten on login | hook path improved; `PersistenceProvider` still calls `campaignService.hydrateFromCloud` unconditionally on login and `hydrateFromCloud` replaces local (see 9.1/9.2) |
| `P1-6` | Character autosave failure silent | `useCharacterPersistence.js:131–156` unchanged (see 10.5) |
| `P1-7` | Unbounded growth: chat subcollection, 1 MiB single docs | unchanged |
| `P1-8` | Cross-room `sync_*` injection via `recipientPlayerId` | `syncHandlers.js:50–102` still resolves recipients from the **global** `players` map with no room check |
| `P1-9` | Deployment/rollback gaps | CSP + storage deploy script improved; CI workflow, deploy env injection, rollback docs untouched |
| `P1-10` | LocalStorage not account-scoped | unchanged; dirty flags add another non-namespaced key family |
| `P2-1` | Legacy/unowned tokens fail open | explicitly preserved by test (see 2.3) |
| `P2-2` | Non-GM creature/container/door mutations | `environmentHandlers.js`: wall/light/fog/drawing/environmental-object now GM-gated; `container_update`, `creature_added`, `creature_updated`, `door_state_changed`, `weather_update` still member-level |
| `P2-3` | Category collections writable by any auth | `firestore.rules` category blocks still `allow write: if request.auth != null` |
| `P2-4` | Combat authority off by default | `server/services/combatAuthority.js` unmodified |
| `P2-5` | Offline indicator promises sync that does not happen | offline character writes are now an explicit no-op (9.3) |
| `P2-6` | Presence/metrics exposure | `presence` rule still authenticated read; `/metrics` still unauthenticated (`server.js` unchanged there) |
| `P2-7` | Storage-accounting drift | unchanged; `shared/` copies uncounted |
| `P2-8` | `storageLimitService` unit-mismatch branch | code unchanged (new tests test the current behavior) |
| `P2-9` | Dormant modules | `globalChatService.js` deleted and `subscribeToRoom` removed; `lagCompensation.js`, `requestTracer.js`, `memoryManager.js`, `syncRecoveryService.js`, `validateItemSize` remain |
| `P2-10` | Cascade cleanup path mismatches | `functions/cascadeCleanup.js` unmodified |
| `P2-11` | Room-creation lane race | `roomService.js` only lost `subscribeToRoom`; write lanes unchanged |
| `P2-12` | `save_room_state_request` not GM-gated | `syncHandlers.js:117` unchanged |
| `P3-1..P3-6` | schema versioning, dependency audit, load/soak, GM audit log, analytics, marketplace integrity | unchanged |

### 15.2 MYTHRILL_MASTER_AUDIT (MA) — still valid

| ID | Finding | Current status |
| --- | --- | --- |
| `TD-001` | Rate-limit wrapper drops ack callbacks | **STILL PRESENT** (11.2) |
| `TD-002` | Inline vs split room persistence; `getRoomData` ignores inline | **STILL PRESENT** (10.6) |
| `TD-003` | Batch writer treats `false` as success | **STILL PRESENT** (10.6) |
| `TD-004` | Storage quota double-counting | **STILL PRESENT** |
| `TD-005` | Cascade cleanup admin deletion without path-owner guard | **STILL PRESENT** (unmodified; deployment unknown) |
| `TD-006` | `rooms/{id}` readable by any authenticated non-anonymous user | **STILL PRESENT** (15.1 P0-4) |
| `TD-007` | `dialogue_message` has no server handler | **STILL PRESENT** (4.1) |
| `TD-008` | Cross-room relay via `recipientPlayerId` | **STILL PRESENT** (15.1 P1-8) |
| `TD-009` | Joi schemas strip routing/reconnect/action fields | **STILL PRESENT** — `server/services/validationService.js` unmodified |
| `TD-010` | `sharedCampaignService` calls boolean `isFirebaseConfigured()` | **STILL PRESENT** (unmodified) |
| `TD-011` | campaignService dual path | **RESOLVED** (8) |
| `TD-012` | Buff/debuff object-vs-array | **STILL PRESENT** (unmodified) |
| `TD-013` | `creatureStore.tokens` alias contradictions | **STILL PRESENT** |
| `TD-014` | CI lint skipped; server lint not run | **STILL PRESENT** (13.2) |
| `TD-015` | Category collections any-auth write | **PARTIAL** (ratings/moderation fixed; categories remain) |
| `TD-016..TD-020`, `TD-022..TD-025` | duplicate GLB trees, tier write, legacy paths, placeholders, dead rules, debug logs (kept fail-closed), Functions deploy unknown, campaign manager duplication, npcStore | unchanged except `TD-021` improve (fail-closed `/debug/logs`) |
| `D1–D12`, `D14–D20` | design drift register | **STILL PRESENT** except `D13` (resolved by 8) and `D11` partially (client removed the dead `combat_action` listener; server/validation legacy remains) |
| §5 known risk 5 | `dialogue_message` | **STILL PRESENT** |
| §5 known risk 6 | `inventory_update` peer-trusted | **STILL PRESENT** (server side; client now ignores foreign ids — 12.4) |
| §16 item 1 | compose production middleware in integration tests | **STILL PRESENT** (13.2) |
| §16 items 2–10 | persistence shape, batch writer, storage accounting, functions, rules hardening, `sharedCampaignService`, dialogue, token schema, token store contracts | mostly **STILL PRESENT**; rules hardening partially done (`rooms` open) |

### 15.3 Other audit/review items not addressed by this work

- **GIP §6/§7**: talent-point economy divergence and inventory encumbrance/row-column/nested-
  container contradictions — no evidence of a fix in this change set; treat as open.
- **CSE / AA**: creature-system evolution and asset archaeology are proposals/inventory; no
  engine change in this window (aside from unrelated asset/level-editor commits).
- **LORE A–F / LORE_CRITICAL_ASSESSMENT `C1–C3`**: content program; see
  `LORE_IMPLEMENTATION_STATUS.md`; not reconciled here.
- **SEC items that remain open**: Storage deployment (`M3` partially), CSP preview validation
  (`M7` partially), plus any item in §15.1/15.2.

---

## 16. New risks and architectural implications introduced by recent changes

1. **Copy-on-publish duplicates storage and fails soft.** Publishing copies the private asset to
   `shared/` but keeps the original; copies are not counted by the storage-accounting counter
   (CR `P2-7`), and a failed copy publishes a private URL that other users cannot load.
2. **Offline character sync is silently disabled.** `offlineService` no longer writes character
   state at all. The UI still presents offline-editing affordances. Without a product decision,
   this converts "possibly wrong sync" into "no sync", increasing reliance on localStorage
   (combined with CR `P1-10`).
3. **Single-document campaigns concentrate write/limit risk.** Consolidation removed divergence,
   but the whole campaign set now lives in one doc; every change rewrites the whole array and
   approaches the 1 MiB Firestore doc cap (CR `P1-7`).
4. **Dirty flags are shared-browser state.** `mythrill_wb_dirty_<store>` keys are not
   account-scoped; a second user on the same browser profile can inherit dirty flags (skipping
   hydration) or cause the first user's unsynced data to be pushed under the wrong account if they
   log in before a sync completes.
5. **Invitation join bypasses capacity/tier checks.** `respond_to_room_invitation` adds the player
   without the `canJoinRoom` check that `join_room` performs.
6. **Mute/kick have no durable ban semantics.** Mute is in-memory and lost on rejoin; kicked users
   can rejoin. No moderation audit trail (CR `P3-4`).
7. **`ALLOW_DEV_AUTH=true` in `.env.example`.** Safe under the current code's non-production
   gate, but hazardous if copied into an environment without `NODE_ENV=production`.
8. **New rules still lack automated tests.** The rules pass is substantial and deployed only by a
   manual script; a bad rule edit would not be caught by CI (CR 3.28 / MA `TD-014`).
9. **Handler tests do not compose production middleware.** The new authorization tests stub
   `validateRoomMembership`, so middleware-order regressions (`TD-001`) and schema stripping
   (`TD-009`) remain invisible.
10. **`character_token_created` attribution.** The handler blocks creating tokens *for another
    player* by checking `data.playerId`, but `token_created` still spreads client token fields; there
    is no single canonical owner-field contract across the two creation paths.

---

## 17. Verification log (commands and artifacts)

| Check | Command / method | Result |
| --- | --- | --- |
| Server tests | `npm test` in `server/` (2026-10-04) | 250 passing (6 s) |
| Client tests | `CI=true npx react-scripts test --watchAll=false --testPathPattern __tests__` in `vtt-react/` (2026-10-04) | 174 suites passed, 1 skipped; 2295 tests passed, 3 skipped |
| Source re-read for audit findings | `server/services/firebaseService.js`, `syncService.js` (unmodified), `server/handlers/{roomHandlers,tokenHandlers,syncHandlers,environmentHandlers,characterHandlers,partyHandlers,sessionHandlers,sessionInvitationHandlers,roomLifecycleHandlers,gmToolsHandlers,questHandlers,chatHandlers,combatHandlers}.js`, `server/services/rateLimitService.js`, `server/services/socketAuthMiddleware.js` | Recorded inline above |
| Rules re-read | `firestore.rules`, `storage.rules` | Recorded inline above |
| Client re-read | hooks/services/stores/components listed per entry | Recorded inline above |
| Diff capture | `git diff` vs `30768454` for server, client services, hooks, UI, stores | Used throughout |
| Deployment claims | Project-memory only (rules deployed, userProfiles backfill, Storage not provisioned, CSP not preview-validated) | **NOT independently verified** |
| Storage provisioning | Memory says `mythrill-ff7c6` Storage not provisioned | `UNKNOWN` externally; blocks 7 |
| Rules emulator tests | none exist | CR 3.28 / MA `TD-014` remain |

---

## 18. TL;DR for the synthesis agent

- **Fixed and verified enough to trust at code level:** GM tools, spell/dice/typing relays, quest
  relay, cursor event fix, session/full-sync alignment, journal no-clobber + save status,
  room-state field hydration, user content edit sync, inventory hydration & privacy relay,
  client listener/timer cleanup, sanitizeHtml wiring, campaign path consolidation, worldbuilding
  dirty-flag guard, dev-auth/debug/CORS hardening, community rating `hasOnly`, the test-coverage
  batch.
- **Fixed on the safe paths but with live gaps:** room resume owner gate, invitation gate,
  token ownership (legacy fail-open), PII split (backfill/deploy unverifiable), storage privacy
  (unprovisioned), campaign offline protection (login path still clobbers).
- **Still exactly as audited (do not mark resolved):** `CR P0-1/P0-2/P0-3/P0-4`, `CR P1-6/P1-8`,
  `CR P2-12`, `MA TD-001/TD-002/TD-003/TD-006/TD-007/TD-008/TD-009/TD-010`, the `D` drift
  register (minus `D13`), rules/category write exposure, no rules tests, middleware-free
  integration harness, billing/backup/export/rollback gaps.
