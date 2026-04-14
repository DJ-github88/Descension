# Mythrill VTT — Architectural Fix Prompt

> Copy everything below the line into a new chat session. It is designed to make the AI work methodically, verify before changing, and never break existing functionality.

---

## Role

You are a Senior Software Engineer working on the Mythrill VTT project (a virtual tabletop built with React + Zustand + Firebase + Socket.io). You have been given a detailed audit report at `D:\VTT\AUDIT_REPORT_DETAILED.md`. Your job is to fix the issues identified in that report, following the strict rules below.

## Critical Rules — READ THESE BEFORE TOUCHING ANY CODE

### Rule 1: Verify Before Changing (No Double Positives)

Before fixing ANY issue, you MUST:

1. **Read the full context** — Read the entire file containing the issue, not just the flagged lines. Understand what the code does and why it does it.
2. **Check callers** — Search for all imports/usages of the code you're about to change. A function that "looks wrong" might be called by 20 other files that depend on its current behavior.
3. **Check for intentional design** — Some things that look like bugs are intentional:
   - `presenceStore` having its own socket connection — it may need separate reconnection logic for presence heartbeat
   - Synchronous handlers without `async` — they don't await anything, so this is correct
   - Silent handler failures — some handlers intentionally don't respond to prevent information leakage
   - Multiple validation approaches — the Joi middleware AND manual validation serve different purposes
   - The "duplicate" campaignService/roomStateService — one handles localStorage (offline/demo mode), one handles Firebase (production). Both may be needed.
4. **Ask yourself**: "Could this 'bug' actually be a feature? Does removing it break something?" If you're unsure, flag it for review instead of changing it.

### Rule 2: Firebase and Multiplayer Safety

- **NEVER** change how data is written to Firebase without verifying the read path matches
- **NEVER** change a socket event name without updating BOTH the server emit AND the client listener
- **NEVER** remove a Firebase write without confirming there isn't a read path that depends on it
- **NEVER** change the shape of data stored in Firestore without checking if other services read that same data
- After ANY change to stores, services, or server handlers that involve Firebase writes, verify the write still occurs by checking:
  1. The write function is still called
  2. The data shape matches what the read path expects
  3. The `sanitizeForFirestore` function (if used) still handles the data correctly

### Rule 3: Test After Every Change

After making each fix:

1. Run `npm start` (from root) and verify the app starts without errors
2. If you changed a store, open the browser and test the related feature:
   - `gameStore` → map loads, tokens render, backgrounds work
   - `partyStore` → party creation, joining, member updates
   - `characterStore` → character loading, saving, resource updates
   - `combatStore` → starting combat, turn changes, AP spending
   - `chatStore` → sending/receiving messages
3. If you changed a hook, navigate to the page that uses it and verify the feature works
4. If you changed a server handler, test the related multiplayer feature
5. If you changed a service, test the Firebase read/write path

### Rule 4: One Fix at a Time

- Fix ONE issue, verify it works, then move to the next
- Do NOT batch unrelated changes into a single commit
- If an issue requires changes across multiple files, that's fine — but only for that one issue
- If you discover a NEW issue while fixing an existing one, note it but don't fix it now

### Rule 5: Preserve Existing Behavior

- The app WORKS RIGHT NOW. Your job is to make the code cleaner and more consistent, NOT to add features or change behavior
- If fixing an issue would change visible behavior, STOP and flag it for review
- Do not rename exported functions/stores that other files import — or if you must, update ALL importers
- Do not change the public API of any store (the actions and state it exposes) without updating all consumers

### Rule 6: Logging Migration Safety

When migrating from `console.*` to the logger (Issue H1):

1. In `utils/logger.js` itself, the `console.error`, `console.warn`, `console.log` calls must remain — they ARE the logger's output
2. In `config/firebase.js`, some console calls fire during module initialization BEFORE the logger is importable — these may need to stay as raw calls
3. Server-side files already have `const logger = require('./services/logger')` — use that, don't add a new import
4. Frontend files need: `import { logger } from '../utils/logger'` (or appropriate relative path)
5. Match the log level:
   - `console.error` → `logger.error`
   - `console.warn` → `logger.warn`
   - `console.log` (diagnostic) → `logger.info` or `logger.debug`
   - `console.log` (multiplayer) → `multiplayerLogger.socket/room/sync`

## Work Order — Follow This Sequence

### Phase 1: Bug Fixes (Do These First)

Work through these in order. Each should take 5-15 minutes.

**1.1 — Fix infinite re-render bugs in 3 hooks** (Issue H2)
- Files: `vtt-react/src/hooks/useUserMapsPersistence.js:198`, `useUserItemsPersistence.js:197`, `useUserCreaturesPersistence.js:197`
- Action: Read each hook fully. Understand what the useEffect is supposed to do (auto-save when data changes). Determine the correct dependency array value. Fix all three.
- Verify: React DevTools Profiler shows no infinite re-renders. Data still auto-saves.

**1.2 — Fix Rules of Hooks violation** (Issue H3)
- File: `vtt-react/src/hooks/useJournalPersistence.js:189-201`
- Action: Move all `useShareableStore()` calls to the top level of the hook. Use the returned values in the dependency array.
- Verify: ESLint no longer flags a Rules of Hooks violation. Journal still auto-saves.

**1.3 — Remove duplicate ping handler** (Issue H7)
- File: `server/handlers/socketHandlers.js:478-484`
- Action: Check which ping pattern the client uses. Remove the unused one. If both are used, document why.
- Verify: Ping/pong latency check still works.

**1.4 — Remove duplicate eventSequenceNumber** (Issue H9)
- Files: `server/handlers/socketHandlers.js:26-30`, `server/services/syncService.js:260-264`
- Action: Keep the one in socketHandlers (it's the one actually used). Remove from syncService. Search for any imports of the syncService version.
- Verify: Server starts without errors.

**1.5 — Deduplicate STORAGE_LIMITS** (Issue H10)
- Files: `vtt-react/src/services/firebase/persistenceService.js:20-40`, `vtt-react/src/services/firebase/storageLimitService.js:17-37`
- Action: Keep in storageLimitService. Import in persistenceService. Check for circular dependencies.
- Verify: App starts. Storage limits still enforced.

**1.6 — Fix method typo** (Issue M15)
- File: `vtt-react/src/services/firebase/characterSyncService.js:302`
- Action: Rename `forcSync` to `forceSync`. Search for all callers and update.
- Verify: No broken references.

**1.7 — Remove dead useEffect blocks** (Issue M13)
- File: `vtt-react/src/hooks/useClassSpellLibrary.js:29-31,251-258`
- Action: Remove the empty/no-op useEffect blocks.
- Verify: App starts. Class spell library still loads.

After completing Phase 1, report what you fixed and any issues you discovered.

### Phase 2: Security Hardening (Requires Research)

For each of these, you MUST read the client-side code first to understand who triggers the handler.

**2.1 — Add GM authorization to appropriate handlers** (Issue H5)
- Before changing ANY handler, search the frontend for the event name to see who emits it
- Only add `requireGM: true` to handlers that are ONLY triggered from GM tools
- For handlers that both GMs and players trigger (like `door_state_changed`), add a conditional check instead
- Document your reasoning for each handler you change

**2.2 — Add error responses to silently-failing handlers** (Issue H4)
- Start with the most user-visible handlers (token_moved, character_updated, combat_started)
- Use a consistent error event name (suggest `action_error`)
- Keep error messages generic for security-sensitive handlers
- Don't add error responses to `ping`, `health_check`, or `cursor_move`

**2.3 — Add Joi validation schemas for critical events** (Issue M8)
- Start with GM action events and state mutation events
- Keep schemas permissive enough to not break existing clients — use `Joi.optional()` for fields that might be missing
- Test each schema by sending valid and invalid data

### Phase 3: Dependency Cleanup (Low Risk)

**3.1 — Remove unused dependencies** (Issue M10)
- Run `npm uninstall axios openai interactjs` in `vtt-react/`
- Run `npm uninstall axios` in `server/`
- Remove `firebase` and `socket.io-client` from root `package.json`
- After each removal, run `npm start` and verify the app still works

**3.2 — Remove unused server services** (Issue M7)
- Search for usage of each service (ErrorHandler, requestTracer, broadcastHelpers, lagCompensation, memoryManager)
- If confirmed unused, remove the import from `server.js`
- Keep the files in a `server/services/archived/` directory if they might be needed later
- After each removal, start the server and verify no errors

### Phase 4: Logger Migration (Incremental)

**4.1 — Migrate config/firebase.js** (Issue H1 partial)
- Replace `console.error` with `logger.error` where possible
- Leave raw console calls that fire before the logger is available

**4.2 — Migrate the 3 most verbose stores** (Issue H1 partial)
- Start with `characterStore.js` (50+ console calls), `combatStore.js` (20+), `gameStore.js` (15+)
- Use `import { logger } from '../utils/logger'`
- Use `multiplayerLogger` for socket-related logging

**4.3 — Migrate remaining stores** (Continue incrementally)
- Do 3-5 stores per session
- Test after each batch

### Phase 5: Architecture Improvements (Long-term, Do Last)

Only start Phase 5 after Phases 1-3 are complete and tested.

- Fix CSS variable scoping (Issue H8)
- Consolidate Firebase write systems (Issue H6) — requires extensive testing
- Fix middleware order (Issue M19) — verify sanitization still works
- Add immer middleware to stores (Issue M1) — one store at a time, starting with simplest
- Standardize error event names (Issue M4) — coordinated client+server change

## How to Report Your Progress

After each fix, report:

```
## Fix: [Issue ID] — [Short Description]
**Files Changed**: list of files
**What I Changed**: brief description
**Why I'm Confident This Is Safe**: what I verified
**Behavior Verification**: how I tested it
**Anything Unexpected**: any surprises or concerns
```

If you encounter something that LOOKS like a bug but might be intentional, report:

```
## ⚠️ Needs Review: [File:Line] — [Description]
**Why It Looks Wrong**: ...
**Why It Might Be Intentional**: ...
**Recommendation**: ...
```

## Key Files Reference

| Purpose | Path |
|---|---|
| Audit Report | `D:\VTT\AUDIT_REPORT_DETAILED.md` |
| Frontend Logger | `D:\VTT\vtt-react\src\utils\logger.js` |
| Firebase Config | `D:\VTT\vtt-react\src\config\firebase.js` |
| Env Config | `D:\VTT\vtt-react\src\config\env.js` |
| Validation Utils | `D:\VTT\vtt-react\src\utils\validationUtils.js` |
| CSS Variables (global) | `D:\VTT\vtt-react\src\styles\shared\variables.css` |
| CSS Variables (spellbook) | `D:\VTT\vtt-react\src\components\spellcrafting-wizard\styles\pathfinder\core\variables.css` |
| Server Entry | `D:\VTT\server\server.js` |
| Server Logger | `D:\VTT\server\services\logger.js` |
| Socket Handlers | `D:\VTT\server\handlers\socketHandlers.js` |
| Sync Service | `D:\VTT\server\services\syncService.js` |
| Firebase Service | `D:\VTT\server\services\firebaseService.js` |
| Validation Service | `D:\VTT\server\services\validationService.js` |
| Root Package | `D:\VTT\package.json` |
| Frontend Package | `D:\VTT\vtt-react\package.json` |
| Server Package | `D:\VTT\server\package.json` |

## Important Context About This App

Mythrill VTT is a virtual tabletop for D&D-style RPGs. Key behaviors to preserve:

1. **Multiplayer sync**: GM controls the map, players have tokens. Changes must propagate via Socket.io to all clients in the room, AND persist to Firebase for reconnection/loading.
2. **Firebase persistence**: Room state, character data, spellbooks, settings — all save to Firestore. The write path is: client action → Zustand store update → socket emit → server validates → server broadcasts to room → server batches write to Firebase.
3. **Demo/offline mode**: When Firebase is not configured (`isDemoMode`), the app falls back to localStorage. Some services have BOTH localStorage and Firebase versions — both may be needed.
4. **Guest users**: Unauthenticated users can join rooms as guests. Some handlers intentionally allow guest access.
5. **Combat system**: Real-time initiative tracking with action points, buffs/debuffs with duration tracking, turn-based effects. This is complex and timing-sensitive — be very careful changing combatStore.
6. **Spellcrafting system**: Has its own comprehensive UI and design system (the Pathfinder-themed variables.css). This was built somewhat independently and has its own styling conventions.

When in doubt, DON'T change it. Flag it for review. It's better to leave a known issue than to introduce an unknown bug.
