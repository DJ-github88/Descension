# Mythrill VTT — Unified Architectural Audit Report

**Date**: April 2026  
**Audited Scope**: 30 Zustand stores, 45 services, 22 hooks, server (4119-line handler file + 14 services), 42 component directories, 3 package.json files  
**Source of Truth Anchors**: `utils/logger.js`, `config/firebase.js`, `config/env.js`, `utils/validationUtils.js`, `styles/shared/variables.css`

---

## Table of Contents

- [How to Use This Document](#how-to-use-this-document)
- [HIGH RISK — Bugs, Security Gaps, Data Loss Risks](#high-risk--bugs-security-gaps-data-loss-risks)
  - [H1. Logger Utility Exists But Is Never Used](#h1-logger-utility-exists-but-is-never-used)
  - [H2. Infinite Re-Render Bugs in 3 Persistence Hooks](#h2-infinite-re-render-bugs-in-3-persistence-hooks)
  - [H3. Rules of Hooks Violation in useJournalPersistence](#h3-rules-of-hooks-violation-in-usejournalpersistence)
  - [H4. 40+ Server Handlers Silently Reject Client Actions](#h4-40-server-handlers-silently-reject-client-actions)
  - [H5. 12 Server Handlers Missing GM Authorization](#h5-12-server-handlers-missing-gm-authorization)
  - [H6. Dual Firebase Write Systems — Race Condition Risk](#h6-dual-firebase-write-systems--race-condition-risk)
  - [H7. Duplicate ping Handler Registration](#h7-duplicate-ping-handler-registration)
  - [H8. CSS Variables Used Globally But Defined in Scoped Component](#h8-css-variables-used-globally-but-defined-in-scoped-component)
  - [H9. Duplicate Event Sequence Counters](#h9-duplicate-event-sequence-counters)
  - [H10. Duplicate STORAGE_LIMITS Constant](#h10-duplicate-storage_limits-constant)
- [MEDIUM RISK — Technical Debt, Pattern Drift, Duplication](#medium-risk--technical-debt-pattern-drift-duplication)
  - [M1. Zero Stores Use immer Middleware](#m1-zero-stores-use-immer-middleware)
  - [M2. Socket Emit Is Fully Decentralized — No Service Layer](#m2-socket-emit-is-fully-decentralized--no-service-layer)
  - [M3. Persist Configuration Is Ad-Hoc (4 Styles)](#m3-persist-configuration-is-ad-hoc-4-styles)
  - [M4. 8 Different Socket Error Event Names](#m4-8-different-socket-error-event-names)
  - [M5. Return Type Inconsistency Across Stores & Services](#m5-return-type-inconsistency-across-stores--services)
  - [M6. Duplicate Services (Same Name, Different Backend)](#m6-duplicate-services-same-name-different-backend)
  - [M7. 5 Unused Server Services (Dead Code)](#m7-5-unused-server-services-dead-code)
  - [M8. 50+ Socket Events Without Joi Validation Schemas](#m8-50-socket-events-without-joi-validation-schemas)
  - [M9. Three Icon Libraries Overlapping](#m9-three-icon-libraries-overlapping)
  - [M10. Unused Heavy Dependencies](#m10-unused-heavy-dependencies)
  - [M11. 2,648 Inline Style Occurrences in Components](#m11-2648-inline-style-occurrences-in-components)
  - [M12. Hooks Missing useEffect Cleanup for Async Operations](#m12-hooks-missing-useeffect-cleanup-for-async-operations)
  - [M13. Dead Code in useClassSpellLibrary Hook](#m13-dead-code-in-useclassspelllibrary-hook)
  - [M14. Export Style Inconsistency](#m14-export-style-inconsistency)
  - [M15. Method Typo in characterSyncService](#m15-method-typo-in-charactersyncservice)
  - [M16. Imperative DOM Manipulation in React Hook](#m16-imperative-dom-manipulation-in-react-hook)
  - [M17. Global Window Flags for Control Flow](#m17-global-window-flags-for-control-flow)
  - [M18. Three Identical Hooks Could Be Unified](#m18-three-identical-hooks-could-be-unified)
  - [M19. Middleware Wrapping Order Issue](#m19-middleware-wrapping-order-issue)
  - [M20. presenceStore Creates Its Own Socket Connection](#m20-presencestore-creates-its-own-socket-connection)
  - [M21. CharacterStore Uses Variable Before Declaration](#m21-characterstore-uses-variable-before-declaration)
- [LOW RISK — Naming & Convention](#low-risk--naming--convention)
  - [L1. No Enforced Action Naming Convention in Stores](#l1-no-enforced-action-naming-convention-in-stores)
  - [L2. snake_case in Otherwise camelCase Codebase](#l2-snake_case-in-otherwise-camelcase-codebase)
  - [L3. 21 Synchronous Handlers Mixed With Async Pattern](#l3-21-synchronous-handlers-mixed-with-async-pattern)
- [VS Code Search Patterns](#vs-code-search-patterns)
- [Recommended Fix Order](#recommended-fix-order)

---

## How to Use This Document

Each issue is structured as:

- **Problem**: What's wrong and why it matters
- **Root Cause**: Why this happened (architectural drift, rapid development, missing enforcement)
- **Affected Files**: Specific file:line references
- **How to Fix**: Step-by-step guidance with code examples
- **Verification**: How to confirm the fix works without breaking anything
- **Caution**: What to watch out for — things that look like bugs but aren't, or changes that could break the app

---

## HIGH RISK — Bugs, Security Gaps, Data Loss Risks

---

### H1. Logger Utility Exists But Is Never Used

**Problem**: The project has a well-designed production-safe logger at `vtt-react/src/utils/logger.js` with level-based filtering, throttled logging, performance tracking, and grouped output. However, **only 2 files in the entire frontend import it** (`characterUtils.js:1`, `GridPreview.jsx:2`). Every other file (all 30 stores, all 45 services, all 22 hooks) uses raw `console.log/warn/error` — over **412+ raw console calls in stores alone**.

This means:
- Verbose diagnostic logging fires in production, impacting performance
- `console.log('📤 Syncing character:', data)` leaks internal state to anyone who opens DevTools
- The throttled logger is never used, so rapid-fire events (token movement, cursor tracking) flood the console
- No structured log levels — debugging requires sifting through noise

**Root Cause**: The logger was created mid-project as a best-practice utility but was never backported to existing code. New files continued copying the `console.*` pattern from existing files.

**Affected Files**:
- All 30 stores in `vtt-react/src/store/`
- All 45 services in `vtt-react/src/services/`
- All 22 hooks in `vtt-react/src/hooks/`
- `vtt-react/src/config/firebase.js:36-37,55-57,66,84,96,99,124-126`
- Server: `socketHandlers.js:59,100-103,324,430,1335,1365-1370`, `server.js:51,55,99-104,304-306`, `firebaseService.js:790`, `optimizedFirebase.js` (12+ locations), `lagCompensation.js` (7+), `memoryManager.js` (12+), `deltaSync.js` (6+), `eventBatcher.js` (6+), `realtimeSync.js` (7+), `rateLimitService.js:177,223`, `validationService.js:242,254,266`, `sanitizationService.js:161`, `errorHandler.js:200-243`

**How to Fix**:

For frontend files, replace raw console calls with the existing logger:

```js
// BEFORE
console.error('❌ Failed to sync:', error);
console.log('📤 Syncing character:', data);
console.warn('⚠️ Could not update:', error);

// AFTER
import { logger } from '../utils/logger';   // or '../../utils/logger'
logger.error('Failed to sync:', error);
logger.info('Syncing character:', data);     // info is filtered in production
logger.warn('Could not update:', error);
```

For multiplayer-specific code:
```js
import { multiplayerLogger } from '../utils/logger';
multiplayerLogger.socket('Socket event:', event);
multiplayerLogger.room('Room update:', data);
multiplayerLogger.sync('State sync:', changes);
multiplayerLogger.error('Multiplayer error:', error);
```

For server-side files, replace raw `console.*` with the existing `services/logger.js`:
```js
// BEFORE (in server files)
console.log('Loaded persistent rooms');
console.error('Error loading persistent rooms:', error);

// AFTER
const logger = require('../services/logger');  // already imported in most files
logger.info('Loaded persistent rooms');
logger.error('Error loading persistent rooms:', { error: error.message });
```

**Migration Strategy**: Do NOT do a global find-and-replace. Approach it module-by-module:

1. Start with `config/firebase.js` — it has 10 console calls that should use the logger
2. Then migrate stores (start with `gameStore.js`, `combatStore.js`, `characterStore.js` as they are the most verbose)
3. Then services, then hooks
4. Server: grep for `console\.` in each service file and replace with the already-imported `logger`

**Verification**:
- After migration, run `npm start` in development — you should still see debug logs
- Run in production mode (`npm run build` then serve) — info/debug logs should be suppressed
- Search for remaining raw console calls: `grep -r "console\.\(log\|warn\|error\|info\)" --include="*.js" --include="*.jsx" src/ | grep -v "logger.js" | grep -v "node_modules"`

**Caution**:
- `console.error` in logger.js itself (lines 28-29) must remain as raw console calls — they ARE the logger's output mechanism
- Some `console.log` calls in config/firebase.js fire during initialization BEFORE the logger module is available — these may need to stay as raw calls or be moved after logger import
- Test that production builds actually suppress logging — verify with `NODE_ENV=production`
- Do NOT remove `console.error` from catch blocks in `config/firebase.js` unless the logger is already initialized at that point in the module

---

### H2. Infinite Re-Render Bugs in 3 Persistence Hooks

**Problem**: Three hooks invoke functions inside `useEffect` dependency arrays instead of passing function references. This causes the effect to re-run on every render because a new value is produced each time.

```js
// BUG — getUserMaps() is CALLED (returns a new array every time)
useEffect(() => { ... }, [getUserMaps(), user, syncNewMaps]);
//                        ^^^^^^^^^^^^ — this is the RETURN VALUE, not the function

// This means:
// 1. getUserMaps() returns a new array []
// 2. useEffect sees a new dependency value
// 3. Effect re-runs
// 4. Effect triggers state update
// 5. Component re-renders
// 6. goto step 1 — infinite loop
```

**Root Cause**: Copy-paste from an earlier version where the intent was to watch the map data for changes. The developer wanted to trigger auto-save when maps change, but instead of watching state, they called the getter function.

**Affected Files**:
- `vtt-react/src/hooks/useUserMapsPersistence.js:198`
- `vtt-react/src/hooks/useUserItemsPersistence.js:197`
- `vtt-react/src/hooks/useUserCreaturesPersistence.js:197`

**How to Fix**:

The intent is to auto-save when user data changes. The fix depends on what data you want to watch:

**Option A — Watch the data via state (recommended if maps/items/creatures are in local state)**:
```js
// If the hook has local state like `const [maps, setMaps] = useState([])`
useEffect(() => {
  if (!user || user.isGuest) return;
  if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  saveTimerRef.current = setTimeout(() => {
    syncNewMaps();
  }, AUTO_SAVE_DELAY);
  return () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  };
}, [maps, user, syncNewMaps]); // Watch the STATE, not a function call
```

**Option B — If data lives in a store, use a store selector**:
```js
const maps = useMapStore(state => state.userMaps);
useEffect(() => { ... }, [maps, user, syncNewMaps]);
```

**Option C — If this is purely a mount-once effect with periodic saves**:
```js
useEffect(() => {
  if (!user || user.isGuest) return;
  const interval = setInterval(() => syncNewMaps(), AUTO_SAVE_DELAY);
  return () => clearInterval(interval);
}, [user, syncNewMaps]); // Remove getUserMaps() entirely
```

Read each hook fully to determine which option applies. The key is: **never call a function inside a dependency array**.

**Verification**:
- After fixing, open React DevTools Profiler
- Navigate to a page that uses these hooks
- Verify the component is NOT re-rendering in a loop
- Add a `console.count('useUserMapsPersistence effect')` temporarily inside the effect — it should fire once on mount, not continuously
- Verify maps/items/creatures still save to Firebase correctly by making a change and checking Firestore console

**Caution**:
- Before changing, confirm the CURRENT behavior — if the app "works fine" with this bug, it may be that `syncNewMaps()` is idempotent (no-op when nothing changed), which is why the infinite loop doesn't visibly break things but still wastes CPU
- The fix might change save timing behavior — test that auto-save still triggers when data actually changes
- Do NOT simply remove `getUserMaps()` from the dep array without understanding what triggers the auto-save — the effect might stop saving entirely

---

### H3. Rules of Hooks Violation in useJournalPersistence

**Problem**: `useJournalPersistence.js:189-201` calls `useShareableStore(state => state.X)` **inside a `useEffect` dependency array**, not at the top level of the hook. React requires hooks to be called in the same order every render — calling them inside arrays/conditionals breaks static analysis and can cause subtle bugs.

```js
// BUG — Hooks called inside array literal, not at top level
useEffect(() => { ... }, [
  useShareableStore(state => state.playerKnowledge),  // RULES VIOLATION
  useShareableStore(state => state.playerNotes),      // RULES VIOLATION
  useShareableStore(state => state.journalFolders),   // RULES VIOLATION
  // ... 5 more
  scheduleAutoSave,
  user
]);
```

**Root Cause**: The developer wanted the effect to re-run when any piece of journal state changes, and put the selectors directly in the dependency array. This works by accident because JavaScript evaluates the array elements eagerly, but it violates the Rules of Hooks and breaks ESLint's React hooks plugin.

**Affected Files**: `vtt-react/src/hooks/useJournalPersistence.js:189-201`

**How to Fix**:

Move all store subscriptions to the top level of the hook:

```js
export const useJournalPersistence = (user) => {
  // Subscribe to store state at TOP LEVEL (correct hook usage)
  const playerKnowledge = useShareableStore(state => state.playerKnowledge);
  const playerNotes = useShareableStore(state => state.playerNotes);
  const journalFolders = useShareableStore(state => state.journalFolders);
  const knowledgeBoards = useShareableStore(state => state.knowledgeBoards);
  const knowledgeOrbs = useShareableStore(state => state.knowledgeOrbs);
  const knowledgeConnections = useShareableStore(state => state.knowledgeConnections);
  const currentFolderId = useShareableStore(state => state.currentFolderId);
  const currentBoardId = useShareableStore(state => state.currentBoardId);

  // Now use the VALUES in the dependency array
  useEffect(() => {
    if (!user || user.isGuest) return;
    if (journalTimerRef.current) clearTimeout(journalTimerRef.current);
    journalTimerRef.current = setTimeout(() => {
      scheduleAutoSave();
    }, AUTO_SAVE_DELAY);
    return () => {
      if (journalTimerRef.current) clearTimeout(journalTimerRef.current);
    };
  }, [
    playerKnowledge, playerNotes, journalFolders,
    knowledgeBoards, knowledgeOrbs, knowledgeConnections,
    currentFolderId, currentBoardId,
    scheduleAutoSave, user
  ]);
  // ...
};
```

**Verification**:
- Run ESLint with React hooks plugin enabled — the Rules of Hooks violation should disappear
- Test that journal auto-save still triggers when any piece of state changes
- Verify journal data saves to Firebase correctly by editing a note and checking Firestore

**Caution**:
- Moving subscriptions to the top level means each one creates a Zustand subscription. This is the correct React pattern and has minimal overhead
- If `useShareableStore` returns objects (not primitives), the dependency comparison will always see "new" values. If this causes excessive saves, use shallow equality: `useShallow(state => state.playerKnowledge)` or extract specific primitive fields

---

### H4. 40+ Server Handlers Silently Reject Client Actions

**Problem**: When server-side validation fails in socket handlers (wrong room, missing data, unauthorized action), many handlers simply `return` without sending any error response to the client. The client has no idea its action was rejected — it appears to "just not work."

**Root Cause**: The validation pattern was designed as a security filter (reject early, don't leak info to attackers). However, for legitimate actions, the client needs feedback to show an error message or retry.

**Affected Files** (`socketHandlers.js`):
- Token handlers: `token_moved:1026`, `token_updated:1047`, `token_control_granted:1094`, `token_control_response:1141`, `character_token_created:1166`, `token_removed:1201`, `character_token_removed:1227`
- Character handlers: `character_moved:1256`, `character_resource_delta:1288`, `character_updated:1334`, `character_equipment_updated:1393`, `character_resource_updated:1419`
- Buff handlers: `buff_update:1532`, `debuff_update:1549`
- Map handlers: `update_current_map:1569`, `sync_level_editor_state:1591`, `map_update:1639`, `request_full_map_sync:1823`, `grid_item_update:1846`, `sync_map_state:1923`
- GM handlers: `gm_switch_view:1957`, `gm_transfer_player:2033`, `gm_request_fresh_positions:2177`, `player_use_connection:2199`, `gm_action:2228`, `sync_gameplay_settings:2280`, `gm_note_update:2301`
- Combat handlers: `combat_started:2323`, `combat_ended:2349`, `combat_turn_changed:2372`
- Environment handlers: `item_looted:2398`, `inventory_update:2438`, `container_update:2622`, `creature_added:2649`, `creature_updated:2679`, `wall_update:2712`, `door_state_changed:2761`, `light_source_update:2788`, `fog_update:2840`, `drawing_update:2877`, `environmental_object_update:2908`
- Sync handlers: `resolve_state_conflict:2986`, `request_full_sync:2963`

**How to Fix**:

Add a standardized error emission after validation failure:

```js
// BEFORE (silent rejection)
socket.on('token_moved', async (data) => {
  try {
    const validation = validateRoomMembership(socket, data.roomId);
    if (!validation.valid) return; // Client never knows what happened
    // ...
  } catch (error) {
    logger.error('[token_moved] Error:', { error: error.message });
  }
});

// AFTER (inform the client)
socket.on('token_moved', async (data) => {
  try {
    const validation = validateRoomMembership(socket, data.roomId);
    if (!validation.valid) {
      socket.emit('action_error', {
        event: 'token_moved',
        code: 'INVALID_ROOM',
        message: 'Not a member of this room'
      });
      return;
    }
    // ...
  } catch (error) {
    logger.error('[token_moved] Error:', { error: error.message });
    socket.emit('action_error', {
      event: 'token_moved',
      code: 'INTERNAL_ERROR',
      message: 'Failed to move token'
    });
  }
});
```

**Verification**:
- Add a client-side listener for `action_error` in the multiplayer socket connection code
- Attempt an invalid action (e.g., move a token while not in a room) and verify the error is received
- Check that valid actions still work normally

**Caution**:
- For security-sensitive handlers, the error message should be generic — don't leak room names, player IDs, or internal state
- Some handlers intentionally don't respond to prevent information leakage (e.g., `request_full_sync` from an unauthenticated user). Use your judgment on which handlers should respond
- The existing `action_error` event name is a SUGGESTION — check if the client already listens for any error events and reuse that pattern
- Do NOT add error responses to `ping`, `health_check`, or `cursor_move` — these are fire-and-forget events

---

### H5. 12 Server Handlers Missing GM Authorization

**Problem**: These handlers mutate game state (environment, fog, walls, combat) but don't check if the caller is the GM. Any connected player can invoke them.

**Root Cause**: These handlers were added later and used `validateRoomMembership(socket, roomId)` instead of `validateRoomMembership(socket, roomId, true)` (the third parameter enables GM-only enforcement).

**Affected Files** (`socketHandlers.js`):
| Handler | Line | What It Does |
|---|---|---|
| `container_update` | 2619 | Adds/modifies containers on map |
| `creature_added` | 2646 | Adds creatures to map |
| `creature_updated` | 2676 | Modifies creature stats |
| `wall_update` | 2709 | Adds/removes walls |
| `door_state_changed` | 2758 | Opens/closes doors |
| `light_source_update` | 2785 | Adds/removes/modifies light sources |
| `fog_update` | 2837 | Modifies fog of war |
| `drawing_update` | 2874 | Modifies drawings |
| `environmental_object_update` | 2905 | Adds/removes environmental objects |
| `combat_started` | 2320 | Initiates combat |
| `combat_ended` | 2346 | Ends combat |
| `combat_turn_changed` | 2369 | Changes combat turns |

**How to Fix**:

For handlers that should be GM-only, change the validation call:

```js
// BEFORE (any player can invoke)
const validation = validateRoomMembership(socket, data.roomId);

// AFTER (GM-only)
const validation = validateRoomMembership(socket, data.roomId, true);
```

However, **NOT ALL of these should be GM-only**. Consider the application design:

- `fog_update` — In some VTTs, players reveal fog as they explore. If Mythrill does this, it should NOT be GM-only for player movement reveals, but SHOULD be GM-only for manual fog painting. This may need a conditional check.
- `combat_started` — Might be intentionally player-accessible if any player can initiate combat
- `door_state_changed` — Players should be able to open doors they interact with

**Recommended approach**:
1. Read the client-side code for each handler to understand who triggers it
2. Handlers that are ONLY triggered from the GM toolbar/tools → add `requireGM: true`
3. Handlers that players also trigger → add a check inside the handler:
   ```js
   // Allow GMs to do anything, players to only affect their own tokens
   const validation = validateRoomMembership(socket, data.roomId);
   if (!validation.valid) return;
   
   const isGM = validation.room.gmId === socket.data.userId || 
                validation.room.players.get(socket.id)?.isGM;
   
   if (requireGM && !isGM) {
     socket.emit('action_error', { event: 'fog_update', code: 'GM_ONLY' });
     return;
   }
   ```

**Verification**:
- Connect as a non-GM player
- Attempt to add a wall, change fog, start combat via browser console:
  ```js
  socket.emit('wall_update', { roomId: '...', wallData: {} });
  ```
- Verify the action is rejected
- Connect as GM and verify these actions still work

**Caution**:
- **CRITICAL**: Do NOT blindly add `requireGM: true` to all 12 handlers without checking client code first. Some handlers may be called by both GMs AND players in different contexts
- `combat_started` and `combat_ended` might be triggered from the player's combat UI, not just GM tools
- `door_state_changed` is almost certainly player-triggered when they click on a door
- When in doubt, add the GM check but also add a fallback that allows specific player actions

---

### H6. Dual Firebase Write Systems — Race Condition Risk

**Problem**: Two independent systems can write to the same Firestore documents:
1. `syncService.js` → `FirebaseBatchWriter` (flushes every 500ms) — used by all socket handlers
2. `optimizedFirebase.js` → `OptimizedFirebaseService` (own write queue + caching) — used by `realtimeSync.js`

If both systems write to the same room document, the last write wins and data can be lost.

**Root Cause**: `optimizedFirebase.js` was likely created as a performance optimization layer with caching and delta merging, but was never fully integrated as THE write layer. The original `FirebaseBatchWriter` in `syncService.js` remained the primary write path.

**Affected Files**:
- `server/services/syncService.js` (FirebaseBatchWriter)
- `server/services/optimizedFirebase.js` (OptimizedFirebaseService)
- `server/services/realtimeSync.js` (bridges the two)
- `server/server.js:23,184-185` (instantiates both)

**How to Fix**:

**Option A — Remove the unused system (safest)**:
1. Check if `optimizedFirebase` is actually called by any handler. Based on the audit, the `realtimeSync` engine is created but its write path may not be triggered by any current handler.
2. If it's unused, remove `optimizedFirebase.js`, `realtimeSync.js`, and their imports from `server.js`
3. Keep `FirebaseBatchWriter` as the single write path

**Option B — Consolidate into one system**:
1. If `optimizedFirebase` has features you need (caching, delta merging), replace `FirebaseBatchWriter` with it
2. Migrate all handler writes from `firebaseBatchWriter.queueWrite()` to `optimizedFirebase.queueWrite()`
3. Remove `FirebaseBatchWriter`

**Verification**:
- Before removing anything, add logging to both systems' write methods to confirm which one is actually being called during normal gameplay
- Create a room, move tokens, modify fog, and check which system logs write activity
- After consolidation, verify that room state persists to Firebase correctly by creating a room, making changes, restarting the server, and checking if the state is restored

**Caution**:
- **CRITICAL**: Do NOT remove `optimizedFirebase.js` until you've confirmed it's not being used. Even though no socket handler directly calls it, `realtimeSync.js` at `server.js:185` connects it to the event batcher
- The `realtimeSync` engine might be triggered by the `eventBatcher` (created at `server.js:184`), which could relay events to `optimizedFirebase` indirectly
- Add temporary logging to `OptimizedFirebaseService.writeToFirestore()` and `FirebaseBatchWriter.flush()` to see which one actually fires during gameplay

---

### H7. Duplicate ping Handler Registration

**Problem**: `socketHandlers.js:478-484` registers `ping` twice. Socket.IO supports multiple listeners per event, so BOTH fire for every `ping`:
- Line 478: callback-based (`callback('pong')`)
- Line 482: emit-based (`socket.emit('pong', { timestamp })`)

This means clients receive two pong responses per ping.

**Root Cause**: Likely the first handler (callback-based) was the original, and the second (emit-based) was added later without removing the first. Or vice versa.

**Affected Files**: `server/handlers/socketHandlers.js:478-484`

**How to Fix**:

Check which pattern the client uses:

```js
// If the client uses callback pattern:
socket.emit('ping', {}, (response) => { /* handle pong */ });
// → Keep line 478-480, remove line 482-484

// If the client uses event listener pattern:
socket.on('pong', (data) => { /* handle pong */ });
socket.emit('ping', {});
// → Keep line 482-484, remove line 478-480

// If BOTH patterns are used by different clients, keep both but document why
```

**Verification**:
- Search the frontend for `ping` and `pong` usage:
  ```
  grep -r "emit('ping'" vtt-react/src/
  grep -r "on('pong'" vtt-react/src/
  ```
- Test that latency checking / heartbeat still works after removing one handler

**Caution**:
- If the `ping` event is used by a health monitoring system that relies on both response types, removing one will break it
- Some load balancers use the callback-based ping for health checks

---

### H8. CSS Variables Used Globally But Defined in Scoped Component

**Problem**: `App.css` uses CSS variables like `--pf-gradient-parchment`, `--pf-text-primary`, `--pf-gold-dark` that are NOT defined in the global `styles/shared/variables.css`. They are only defined inside `.spellbook-layout, .spellbook-window` scope in `spellcrafting-wizard/styles/pathfinder/core/variables.css:1`.

This means:
- These variables only have values when the spellbook component is mounted
- When the spellbook is not rendered, any elements using these variables will have `unset` values
- The UI will break or look wrong on pages that don't include the spellbook

**Root Cause**: The spellbook component was built with its own comprehensive design system, and its CSS variables "leaked" into the global `App.css` during development because the spellbook was always mounted during testing.

**Affected Files**:
- `vtt-react/src/styles/shared/variables.css` (44 lines, incomplete)
- `vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/core/variables.css` (278 lines, comprehensive)
- `vtt-react/src/App.css` (1616 lines, references spellbook-scoped variables)

**How to Fix**:

**Option A — Merge the two variable files**:
1. Copy all `--pf-*` variables from the spellbook's `variables.css` into the global `styles/shared/variables.css`
2. Ensure all variables are defined at `:root` scope
3. The spellbook component can still override them locally if needed

**Option B — Import the spellbook variables globally**:
1. Add `@import '../../components/spellcrafting-wizard/styles/pathfinder/core/variables.css';` to `App.css` or `index.css`
2. Change the spellbook variables from `.spellbook-layout, .spellbook-window { ... }` to `:root { ... }`
3. Keep the spellbook-specific scoped variables as overrides

**Verification**:
- After the fix, navigate to pages that DON'T have the spellbook component mounted
- Check that colors, fonts, and gradients still render correctly
- Use browser DevTools to inspect elements using `--pf-*` variables — they should have values even when the spellbook is not open
- Test on a fresh page load (hard refresh) without opening the spellbook

**Caution**:
- Some `--pf-*` variables might intentionally be spellbook-only and could conflict with global styles if promoted to `:root`
- Review each variable before promoting it — some might use names that clash with other components
- Test that the spellbook component still looks correct after the changes (it shouldn't look different since it defines the same variables at a more specific scope)

---

### H9. Duplicate Event Sequence Counters

**Problem**: `eventSequenceNumber` and `getNextEventSequence()` are defined in TWO places:
- `socketHandlers.js:26-30` — used by all handlers
- `syncService.js:260-264` — exported but never imported by any handler

These are independent counters that will diverge.

**Root Cause**: The counter was originally in `syncService.js` for the sync layer. When handlers needed sequence numbers, a local copy was created in `socketHandlers.js` instead of importing from syncService.

**Affected Files**:
- `server/handlers/socketHandlers.js:26-30`
- `server/services/syncService.js:260-264`

**How to Fix**:

Keep the one in `socketHandlers.js` (since it's the one actually used) and remove the duplicate from `syncService.js`:

```js
// In syncService.js — REMOVE these lines:
let eventSequenceNumber = 0;
function getNextEventSequence() {
  return ++eventSequenceNumber;
}
function resetEventSequence() {
  eventSequenceNumber = 0;
}
```

If `syncService.js` needs the sequence number, import it from `socketHandlers.js` instead.

**Verification**:
- Search for `getNextEventSequence` across all server files to confirm only one definition exists
- Run server tests: `npm test tests/socketHandlers.test.js`

**Caution**:
- Check if `resetEventSequence()` is called anywhere — if so, make sure the remaining counter supports it

---

### H10. Duplicate STORAGE_LIMITS Constant

**Problem**: `STORAGE_LIMITS` is defined identically in two files:
- `services/firebase/persistenceService.js:20-40`
- `services/firebase/storageLimitService.js:17-37`

If one is updated without the other, limits will be inconsistent.

**Root Cause**: `storageLimitService.js` was created as a dedicated service for storage limits but `persistenceService.js` kept its own copy.

**Affected Files**:
- `vtt-react/src/services/firebase/persistenceService.js:20-40`
- `vtt-react/src/services/firebase/storageLimitService.js:17-37`

**How to Fix**:

1. Keep `STORAGE_LIMITS` in `storageLimitService.js` (it's the more appropriate location)
2. Import it in `persistenceService.js`:
   ```js
   import { STORAGE_LIMITS } from './storageLimitService';
   ```
3. Remove the duplicate definition from `persistenceService.js`

**Verification**:
- Search for `STORAGE_LIMITS` across the codebase to find all usages
- Verify all imports resolve correctly after the change
- Test that storage limit checks still work (try uploading a file that should be rejected)

**Caution**:
- Ensure the import path is correct (both files are in `services/firebase/`)
- If `storageLimitService.js` imports from `persistenceService.js`, this could create a circular dependency — if so, move `STORAGE_LIMITS` to a separate `constants.js` file

---

## MEDIUM RISK — Technical Debt, Pattern Drift, Duplication

---

### M1. Zero Stores Use immer Middleware

**Problem**: All 30 Zustand stores use manual spread/merge for state updates. Deep updates require verbose nested spreading that is error-prone and hard to read.

**Root Cause**: Zustand was set up early without immer. By the time the codebase grew, backporting immer would touch every store.

**Why This Matters**: In `partyStore.updatePartyMember:769-821`, a single update requires 30+ lines of manual spreading. A typo in any spread can silently lose data.

**How to Fix** (store by store, NOT all at once):

```js
// BEFORE
import { create } from 'zustand';
const useStore = create((set, get) => ({
  character: { resources: { health: { current: 100, max: 100 } } },
  updateHealth: (current) => set((state) => ({
    character: {
      ...state.character,
      resources: {
        ...state.character.resources,
        health: {
          ...state.character.resources.health,
          current
        }
      }
    }
  }))
}));

// AFTER
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
const useStore = create(immer((set, get) => ({
  character: { resources: { health: { current: 100, max: 100 } } },
  updateHealth: (current) => set((state) => {
    state.character.resources.health.current = current;
    // No spread needed — immer handles it
  })
})));
```

**Caution**:
- `immer` changes how `set()` works — instead of returning a new state object, you mutate a draft
- When combining `immer` with `persist`, the middleware order matters: `create(persist(immer(...)))`
- Stores that use `partialize` with `persist` may need adjustments since immer wraps the state in a Proxy
- **Migrate one store at a time, test thoroughly, then move to the next**
- Start with simpler stores (buffStore, debuffStore, diceStore) before tackling complex ones (partyStore, characterStore)

---

### M2. Socket Emit Is Fully Decentralized — No Service Layer

**Problem**: 17 stores emit socket events directly with 4 different access patterns. There's no centralized socket service.

**Affected Files**: See audit details above — 14 stores via `gameStore.multiplayerSocket`, 2 via `presenceStore.socket`, 1 via `require()` per-call, 1 via own socket.

**Root Cause**: Multiplayer features were added incrementally, with each store managing its own socket access.

**How to Fix** (long-term refactor):

Create a `services/socketService.js`:
```js
// vtt-react/src/services/socketService.js
let socket = null;

export const setSocket = (s) => { socket = s; };
export const getSocket = () => socket;

export const emit = (event, data) => {
  if (!socket) { logger.warn('Socket not connected, cannot emit:', event); return; }
  socket.emit(event, data);
};

export const emitToRoom = (event, data) => {
  if (!socket) return;
  socket.emit(event, { ...data, _roomBroadcast: true });
};
```

Then replace all direct socket access:
```js
// BEFORE (in any store)
const socket = useGameStore.getState().multiplayerSocket;
socket?.emit('character_updated', data);

// AFTER
import { emit } from '../services/socketService';
emit('character_updated', data);
```

**Caution**:
- This is a LARGE refactor — do it incrementally over multiple sessions
- Some stores need the socket for `on` listeners (receiving events), not just `emit`. These should stay as they are until a full socket service is built
- The `presenceStore` managing its own socket connection may be intentional for separate reconnection logic

---

### M3. Persist Configuration Is Ad-Hoc (4 Styles)

**Problem**: 17 persisted stores use different `persist()` configurations.

**How to Fix**: Create a shared `createPersistConfig` utility:

```js
// vtt-react/src/utils/zustandPersistConfig.js
import { createJSONStorage } from 'zustand/middleware';

export const createPersistConfig = (name, options = {}) => ({
  name,
  storage: createJSONStorage(() => localStorage),
  partialize: options.partialize || ((state) => state),
  ...options
});
```

Then use it consistently:
```js
import { createPersistConfig } from '../utils/zustandPersistConfig';
const useStore = create(persist(
  (set, get) => ({ /* ... */ }),
  createPersistConfig('my-store', { partialize: ({ field1, field2 }) => ({ field1, field2 }) })
));
```

---

### M4. 8 Different Socket Error Event Names

**Problem**: Server emits errors using 8+ different event names: `room_error`, `error`, `validation_error`, `rate_limit_exceeded`, `join_error`, `invite_error`, `party_error`, `whisper_failed`, `party_invite_failed`, `item_loot_rejected`.

**How to Fix**: Standardize to a single error event with error codes:

```js
// Server-side helper
const emitError = (socket, event, code, message) => {
  socket.emit('action_error', { event, code, message, timestamp: Date.now() });
};

// Usage
emitError(socket, 'room_create', 'ROOM_NAME_INVALID', 'Room name is required');
emitError(socket, 'combat_start', 'GM_ONLY', 'Only the GM can start combat');
```

**Caution**: Client code must be updated to listen for the new event name before removing old ones. This is a coordinated change.

---

### M5. Return Type Inconsistency Across Stores & Services

**Problem**: Three competing return patterns:
1. `{ success: boolean, error?: string }` — authStore, socialStore, firebase/* services
2. `throw new Error()` — roomService, characterPersistenceService
3. Return `null`/`false` on failure — campaignService, presenceService

**How to Fix**: Adopt the `{ success, error?, data? }` pattern as standard:

```js
// Standard result factory
const Result = {
  ok: (data) => ({ success: true, ...(data !== undefined && { data }) }),
  err: (error) => ({ success: false, error: error.message || String(error) })
};

// Usage in any store/service
async signUp(email, password) {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return Result.ok(user);
  } catch (error) {
    return Result.err(error);
  }
}
```

**Caution**: This requires updating all CALLERS to handle the new return shape. Do this incrementally — start with services that already use `{ success }` and expand.

---

### M6. Duplicate Services (Same Name, Different Backend)

**Problem**: Two pairs of services exist with the same class names but different storage backends:
- `services/campaignService.js` (localStorage) vs `services/firebase/campaignService.js` (Firestore)
- `services/roomStateService.js` (localStorage) vs `services/firebase/roomStateService.js` (Firestore)

**Root Cause**: Local-first development was done with localStorage services, then Firebase versions were created. Both coexist.

**How to Fix**:
1. Identify which service each consumer imports
2. If both are actively used (localStorage for offline/demo, Firebase for production), rename them clearly:
   - `services/localCampaignService.js`
   - `services/firebaseCampaignService.js`
3. If only one is used, remove the other

**Verification**: Search for import paths to see which is actually used:
```
grep -r "from.*campaignService" vtt-react/src/
grep -r "from.*roomStateService" vtt-react/src/
```

---

### M7. 5 Unused Server Services (Dead Code)

**Problem**: These services are imported and/or instantiated in `server.js` but never called by any handler:

| Service | Imported At | Used? |
|---|---|---|
| `ErrorHandler` | `server.js:32,97` | Never called by any handler |
| `requestTracer` | `server.js:31` | Never attached as middleware |
| `broadcastHelpers` | `utils/broadcastHelpers.js` | Never imported by handlers |
| `lagCompensation` | `server.js:25` | Never called |
| `memoryManager` | `server.js:24` | Never called; `global.memoryManager` never set |

**Root Cause**: These were created as architectural scaffolding for future features but never integrated.

**How to Fix**:
1. For each service, search for usage across the entire server:
   ```
   grep -r "errorHandler" server/handlers/ server/services/
   grep -r "requestTracer" server/handlers/
   grep -r "lagCompensation" server/handlers/
   grep -r "memoryManager" server/handlers/
   grep -r "broadcastToPlayers" server/handlers/
   ```
2. If truly unused, remove the import from `server.js` and the file itself
3. Keep the files in a `server/services/archived/` directory if you plan to integrate them later

**Caution**:
- `memoryManager` is referenced in `errorHandler.js:219` via `global.memoryManager` — but `errorHandler` is also unused. Both can be removed together.
- `lagCompensation` might be referenced in tests — check before removing

---

### M8. 50+ Socket Events Without Joi Validation Schemas

**Problem**: `validationService.js` defines Joi schemas for only ~15 events. 50+ events pass through with no structural validation.

**How to Fix**: Add schemas incrementally, starting with the most security-critical:
1. GM actions (`gm_action`, `gm_transfer_player`)
2. State mutation events (`fog_update`, `wall_update`, `map_update`)
3. Combat events (`combat_started`, `combat_turn_changed`)
4. Social events (`create_party`, `send_whisper`)

Example schema:
```js
fog_update: Joi.object({
  roomId: Joi.string().required(),
  mapId: Joi.string().required(),
  fogData: Joi.object().required(),
  operation: Joi.string().valid('reveal', 'hide', 'toggle', 'clear', 'update').required()
})
```

---

### M9. Three Icon Libraries Overlapping

**Problem**: Three icon delivery mechanisms coexist:
- `@fortawesome/fontawesome-free` (CSS, 1,787+ uses) — `className="fas fa-*"`
- `@fortawesome/react-fontawesome` (React component, 39 uses) — `<FontAwesomeIcon icon={...}>`
- `react-icons` (third-party wrapper, 43 uses)

**How to Fix** (long-term):
1. Pick ONE approach: `react-icons` is the most complete (includes FA icons + Material + many more)
2. Create a migration script or do it file-by-file
3. Remove the unused libraries from `package.json`

**Caution**: 1,787+ FA CSS uses is a MASSIVE migration. Consider keeping the CSS approach for existing files and only using `react-icons` for new files.

---

### M10. Unused Heavy Dependencies

| Package | Location | Size | Used? |
|---|---|---|---|
| `axios` | vtt-react + server | ~400KB | Zero imports |
| `openai` | vtt-react | ~1MB | Zero imports (comment says "removed") |
| `interactjs` | vtt-react | ~300KB | Zero imports |
| `firebase` | root package.json | Entire SDK | No root source code |
| `socket.io-client` | root + server | ~300KB | Root has no source; server uses it only in tests |

**How to Fix**:
```bash
# Remove from root
cd D:\VTT
npm uninstall firebase socket.io-client cross-env

# Remove from frontend
cd vtt-react
npm uninstall axios openai interactjs

# Remove from server
cd ../server
npm uninstall axios
# Move socket.io-client to devDependencies
npm uninstall socket.io-client
npm install --save-dev socket.io-client
```

**Verification**: After removal, run `npm start` and verify the app compiles and runs without errors.

---

### M11. 2,648 Inline Style Occurrences in Components

**Problem**: Components use `style={{ color: '#FF9800' }}` instead of CSS classes with design tokens.

**How to Fix**: This is a long-term initiative. Prioritize:
1. Static colors → move to CSS variables (`var(--color-warning)`)
2. Static layout → move to CSS classes or Bootstrap utilities
3. Dynamic styles (computed widths, conditional colors) → keep as inline but use CSS variables for the values

---

### M12. Hooks Missing useEffect Cleanup for Async Operations

**Problem**: 6 hooks start async operations in `useEffect` but don't cancel them on unmount. This can cause "Cannot update state on unmounted component" warnings.

**Affected Hooks**: `useCommunityItems`, `useCommunityCreatures`, `useCommunityPacks`, `useCommunitySpells`, `useClassSpellLibrary`, `useCharacterPersistence`

**How to Fix**:
```js
// Use AbortController for fetch-based operations
useEffect(() => {
  const abortController = new AbortController();
  
  loadItems({ signal: abortController.signal });
  
  return () => abortController.abort();
}, []);

// OR use isMounted flag for simpler cases
useEffect(() => {
  let isMounted = true;
  
  loadData().then((result) => {
    if (isMounted) setItems(result);
  });
  
  return () => { isMounted = false; };
}, []);
```

---

### M13. Dead Code in useClassSpellLibrary Hook

**Problem**: `useClassSpellLibrary.js:29-31` has an empty `useEffect` with "potential future use" comment. `:251-258` has a no-op `useEffect`.

**How to Fix**: Remove the dead useEffect blocks. They add no value and confuse readers.

---

### M14. Export Style Inconsistency

**Problem**: 6 different export patterns across 22 hooks:
- `export const` (primary pattern, ~14 hooks)
- `export function` + `export default` (4 hooks)
- `export const` + `export default` (1 hook)
- `export default function` (1 hook)
- `export default` only (2 hooks)

**How to Fix**: Standardize to `export const useHookName = () => { ... }` with no default export.

---

### M15. Method Typo in characterSyncService

**Problem**: `services/firebase/characterSyncService.js:302` — method named `forcSync()` instead of `forceSync()`.

**How to Fix**: Rename to `forceSync()` and update any callers.

---

### M16. Imperative DOM Manipulation in React Hook

**Problem**: `useSessionManagement.js:147-244` creates a modal with `document.createElement('div')` and manual DOM manipulation instead of using React rendering.

**How to Fix**: Replace with a React component rendered via a portal:
```jsx
import { createPortal } from 'react-dom';
// Use state to show/hide the modal, render via portal
```

---

### M17. Global Window Flags for Control Flow

**Problem**: `useLevelEditorPersistence.js:223-232` reads `window._isReceivingMapUpdate` and `window._isScrolling`.

**How to Fix**: Move these flags to a Zustand store or use refs passed down from the parent component.

---

### M18. Three Identical Hooks Could Be Unified

**Problem**: `useUserMapsPersistence`, `useUserItemsPersistence`, `useUserCreaturesPersistence` are structurally identical, differing only in entity type and service.

**How to Fix**:
```js
export const createUserEntityPersistence = (entityType, service) => () => {
  // ... shared logic (same as any of the three hooks)
  return { items, save, load, sync, forceSave, ... };
};
export const useUserMapsPersistence = createUserEntityPersistence('maps', userMapsService);
export const useUserItemsPersistence = createUserEntityPersistence('items', userItemsService);
export const useUserCreaturesPersistence = createUserEntityPersistence('creatures', userCreaturesService);
```

---

### M19. Middleware Wrapping Order Issue

**Problem**: In `server.js`, three middlewares wrap `socket.on` in this order:
1. Sanitization (line 125)
2. Validation (line 131)
3. Rate limiting (line 138)

But the wrapping means execution order is: Rate limit → Validation → Sanitization → Handler. Sanitization should run BEFORE validation.

**How to Fix**: Reorder the middleware registration in `server.js` so rate limiting wraps first (outermost), then validation, then sanitization (innermost, closest to handler):
```js
// Correct order: Rate limit (outer) → Sanitization → Validation (inner)
io.use(rateLimitService.createMiddleware({ ... }));
io.use(createSanitizationMiddleware({ ... }));
io.use(createValidationMiddleware({ ... }));
```

**Caution**: The wrapping mechanism works by overriding `socket.on`, so the LAST middleware registered is the FIRST to execute. To get Rate limit → Sanitization → Validation → Handler, register in reverse: Validation, Sanitization, Rate limit.

---

### M20. presenceStore Creates Its Own Socket Connection

**Problem**: `presenceStore.js:8-9` imports `io` from `socket.io-client` and creates its own socket. Every other store uses `gameStore.multiplayerSocket`.

**Root Cause**: Presence tracking may have been developed separately and needed its own connection lifecycle.

**How to Fix**: Migrate to use `gameStore.multiplayerSocket` like other stores, OR if a separate connection is needed, document WHY and centralize it through a socket service.

**Caution**: If the separate socket is for presence heartbeat (different reconnection logic), it may be intentional. Understand the requirement before merging.

---

### M21. CharacterStore Uses Variable Before Declaration

**Problem**: `characterStore.js:142` uses `realtimeSyncRef.current` but the variable is declared at line 351. This works due to JavaScript hoisting but is confusing.

**How to Fix**: Move the `useRef` declaration before its first usage.

---

## LOW RISK — Naming & Convention

---

### L1. No Enforced Action Naming Convention in Stores

**Problem**: Within the same store, you'll find `setGridSize`, `updateBackground`, `addBackground`, `startCombat`, `toggleGMMode` — all for state mutation.

**Suggested Convention**:
- `set*` — Replace a single state value (`setGridSize`, `setActiveTab`)
- `update*` — Deep merge / partial update (`updateCharacter`, `updateSettings`)
- `add*` / `remove*` — Array operations (`addCreature`, `removeToken`)
- `toggle*` — Boolean flip (`toggleGMMode`)
- `clear*` — Reset to empty (`clearAllBuffs`)
- Verb — Actions that trigger side effects (`startCombat`, `signUp`)

**How to Fix**: No need to rename existing actions — just follow this convention for new code.

---

### L2. snake_case in Otherwise camelCase Codebase

**Problem**: `characterStore.js:137` uses `class_spells` (snake_case).

**How to Fix**: Rename to `classSpells`. Update all references.

---

### L3. 21 Synchronous Handlers Mixed With Async Pattern

**Problem**: 21 handlers in `socketHandlers.js` are declared without `async` while others use `async`. These handlers don't await anything, so `async` isn't needed, but the inconsistency makes it unclear which pattern to follow.

**How to Fix**: No action needed — these are correct as synchronous handlers. Just be aware of the pattern difference.

---

## VS Code Search Patterns

Copy these into VS Code's search (Ctrl+Shift+H) with regex enabled:

| What to Find | Search Pattern | Files to Include |
|---|---|---|
| Raw console calls (should use logger) | `console\.(log\|warn\|error\|info)\(` | `*.js, *.jsx` |
| Inline styles | `style=\{\{` | `*.jsx` |
| Dynamic require() in frontend | `require\(['"]\.\./` | `*.js, *.jsx` |
| snake_case violations | `[a-z]_[a-z]` | `*.js, *.jsx` |
| Missing GM auth | `validateRoomMembership\(socket,\s*data\.roomId\)(?!,\s*true)` | `*.js` |
| Duplicate STORAGE_LIMITS | `STORAGE_LIMITS\s*=` | `*.js` |
| Duplicate eventSequenceNumber | `eventSequenceNumber\s*=\s*0` | `*.js` |
| useEffect with function invocation in deps | `useEffect\([^)]*\[[^\]]*\w+\(\)` | `*.js, *.jsx` |
| Unused axios import | `import.*from\s+['"]axios` | `*.js, *.jsx` |
| Dead no-op useEffect | `useEffect\(\(\)\s*=>\s*\{\s*\},\s*\[` | `*.js, *.jsx` |

---

## Recommended Fix Order

### Phase 1 — Immediate (Fix Bugs, No Architecture Changes)
1. **H2**: Fix infinite re-render bugs in 3 hooks (10 minutes, high impact)
2. **H3**: Fix Rules of Hooks violation in useJournalPersistence (10 minutes)
3. **H7**: Remove duplicate ping handler (2 minutes)
4. **H9**: Remove duplicate eventSequenceNumber (5 minutes)
5. **H10**: Deduplicate STORAGE_LIMITS (5 minutes)
6. **M15**: Fix `forcSync` typo (2 minutes)
7. **M13**: Remove dead useEffect blocks (5 minutes)

### Phase 2 — Security (Verify Before Changing)
8. **H5**: Add GM authorization to appropriate handlers (requires research per handler)
9. **H4**: Add error responses to silently-failing handlers
10. **M8**: Add Joi validation schemas for critical events

### Phase 3 — Cleanup (Low Risk, High Satisfaction)
11. **M10**: Remove unused dependencies (axios, openai, interactjs)
12. **M7**: Remove unused server services
13. **M6**: Resolve duplicate service names
14. **H1**: Migrate to logger (incremental, start with most verbose files)

### Phase 4 — Architecture (Long-term, Incremental)
15. **H8**: Fix CSS variable scoping
16. **H6**: Consolidate Firebase write systems
17. **M19**: Fix middleware order
18. **M1**: Add immer middleware to stores (one at a time)
19. **M2**: Create centralized socket service
20. **M3**: Standardize persist configuration
21. **M4**: Standardize error event names
22. **M5**: Standardize return types
