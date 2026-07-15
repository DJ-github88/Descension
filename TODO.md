# Mythrill VTT - TODO

## Current State (Frontend)
- **vtt-react frontend: 0 errors, 0 warnings** (was 647 warnings, all fixed)
- All lint issues resolved across 200+ files

---

## Completed

### 1. Server-side lint (`D:\VTT\server`) ✅
- **573 → 0 errors** (`npx eslint .`)
- Added `mocha` env + globals override for `tests/**` so test globals (`describe`/`it`/etc.) are recognized
- Ran `eslint --fix` to auto-resolve 260 fixable issues (indent, space-before-function-paren, curly, comma-dangle, prefer-const)
- Manually fixed 13 remaining `no-unused-vars` issues:
  - `audioHandlers.js:189` — renamed unused `data` arg to `_data`
  - `partyHandlers.js` — removed 4 dead helpers (`getPartyMemberCount`, `emitPartyUpdated`, `createSocialParty`, `autoDisbandIfTooSmall`) + their now-unused imports (`getUserDisplayName`, `emitToUserId`); removed dead `userName` assignment in `join_party`; renamed destructured `socketId` to `_socketId`
  - `scripts/verify-persistence-logic.js` — removed unused `logger` mock
  - `tests/combatAuthority.test.js` — renamed unused `turnOverride` arg to `_turnOverride`
  - `tests/rateLimitService.test.js` — removed unused `now` var
  - `tests/socketAuthMiddleware.test.js` — simplified unused `nextArg` tracking callback
  - `utils/validators.js` — removed unused `validateRoom`/`validatePlayer` from destructure

### 2. Verify roomStateService.js refactor ✅
- `collectRoomState` — uses gameStore, creatureStore, gridItemStore, levelEditorStore, combatStore (no inventory/quest, correct)
- `collectPlayerState` — uses inventoryStore, questStore, characterStore (line 191, still needed for `character` lookup), levelEditorStore (actionBar loaded from localStorage, not a module — correct)
- `applyPlayerState` — uses inventoryStore, questStore, levelEditorStore (no `characterStoreModule` — correctly removed since unused here)
- All 3 stores (inventory, quest, levelEditor) are wired in `applyPlayerState`. State is consistent.

### 3. Build/test smoke ✅
- `npm run build` (vtt-react) — **Compiled successfully** (Verified clean build with 0 errors and 0 warnings following the fix of the remaining 85 ESLint warnings across 30+ files: default-case, no-useless-escape, no-mixed-operators, etc.)
- `npm test` (vtt-react) — **839 passed / 11 suites**, 0 failures

### 4. Suppressed warnings review ✅
- `src/polyfills.js` — `no-extend-native` — **intentional/kept** (browser compat polyfills for `Array.prototype.includes`/`String.prototype.includes`)
- `src/utils/validationUtils.js` — `no-control-regex` — **intentional/kept** (security sanitization stripping control chars)
- `src/components/spellcrafting-wizard/core/mechanics/resolutionEngine.js:452` — `no-new-func` — **intentional/kept** (safe formula eval with character allowlist guard at line 446)
- `src/components/multiplayer/roomJoinHandler.js` — `no-unused-vars` block — **removed** (see task 5)

### 5. Refactor roomJoinHandler.js destructuring ✅
- Removed the `/* eslint-disable no-unused-vars */ … /* eslint-enable */` block
- Trimmed the 55-item `ctx` destructure down to the **28 actually-used properties** (verified via grep + eslint)
- `ctx.isGM` was only used as object-literal keys; the function uses the `isGameMaster` param instead, so it was dropped
- Updated the caller in `MultiplayerApp.jsx` to pass only the used properties
- `roomJoinHandler.js` now lints clean (0 errors, 0 warnings); build still compiles successfully
- Note: `RoomLobby.jsx` has its own local `handleJoinRoom(targetRoomId, targetPassword)` — unaffected

### 6. Multiplayer Terrain Sync Fixes ✅
- **Fix #4 (Improve Merge Logic)** & **Fix #5 (Add Update Queuing)**: Implemented sequential `outgoingQueue` and `processQueue` inside `mapUpdateBatcher` using standard socket callback acknowledgments to ensure sequential, ordered map updates without packet loss.
- **Socket Acknowledgment on Server**: Added callback support to the server's `map_update` socket handler in `mapHandlers.js` to acknowledge successful edits.
- **Fix #6 (Fix Race Conditions)**: Integrated checks for `window._isReceivingMapUpdate` in `addUpdate`, `paintTerrainBrush`, `paintTerrainLine`, and `removeTerrainLine` to prevent rendering sync loops while receiving data.

---

## Notes
- Completed ESLint warning cleanup: 0 errors, 0 warnings.
- Server: 573 → 0 eslint errors
- Frontend: build + 839 tests still green and fully verified after queuing and race condition refactoring.
