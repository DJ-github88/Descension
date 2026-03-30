# Multiplayer Synchronization Fixes - Implementation Plan

## Overview
This document outlines the fixes being implemented to resolve multiplayer synchronization and performance issues identified during analysis.

## Issues Identified

### Critical (HIGH Priority)
1. **Token Movement Echo & Position Resets**
   - Problem: Server broadcasts to ALL players including sender, causing position jumps
   - Impact: GM sees tokens jumping when dragging, players see teleports
   - Files: `server.js`, `MultiplayerApp.jsx`

2. **Character/Token ID Confusion**
   - Problem: Inconsistent use of `tokenId`, `creatureId`, and `playerId`
   - Impact: Wrong tokens update, state corruption
   - Files: `server.js` (lines ~900-1000), `MultiplayerApp.jsx` (~460-550)

3. **Map/Fog Updates Not Visible to GM**
   - Problem: Server uses `socket.to()` which excludes sender
   - Impact: GM doesn't see their own map changes
   - Files: `server.js` (~700)

4. **Race Conditions on State Updates**
   - Problem: Multiple clients updating HP/Mana simultaneously
   - Impact: "Last write wins" without ordering
   - Files: All socket event handlers

### Medium Priority
5. **Unbounded Socket Events During Drags**
   - Problem: Every mouse move sends event (~10fps throttled)
   - Impact: Network congestion, Firebase spam
   - Files: `CharacterToken.jsx`, `CreatureToken.jsx`

6. **Expensive Re-renders**
   - Problem: Store subscriptions trigger unnecessary re-renders
   - Impact: UI lag, battery drain
   - Files: `MultiplayerApp.jsx` (line ~45-60)

7. **Firebase Persistence on Every Operation**
   - Problem: Every minor state update writes to Firebase
   - Impact: Quota exhaustion, delayed responses
   - Files: `server.js` (multiple locations)

8. **Memory Leaks in Throttling Maps**
   - Problem: Maps grow without cleanup
   - Impact: Memory increases, eventually crashes
   - Files: Global window properties

### Low Priority
9. **Complex State Tracking Creates Deadlocks**
   - Problem: Too many window-level flags
   - Impact: Flags out of sync, events blocked
   - Files: Multiple components

## Implementation Status

### ✅ Completed
1. **Created Optimistic Updates Service** (`vtt-react/src/services/optimisticUpdatesService.js`)
   - Handles optimistic UI updates with conflict resolution
   - Prevents lag-induced position jumps
   - Tracks pending updates and server confirmations
   - Cleans up stale entries

### 🚧 In Progress
1. **Fix Server Token Movement Echo** (HIGH)
   - Modify `server.js` token_moved handler
   - Ensure GM sees their own token movements
   - Use `socket.to()` correctly for other players only

2. **Standardize ID System** (HIGH)
   - Use `tokenId` consistently for creature tokens
   - Use `playerId` consistently for player characters
   - Update server and client handlers

3. **Fix GM Map Update Visibility** (MEDIUM)
   - Broadcast map updates to ALL players including GM
   - Ensure GM sees their own changes immediately

### 📋 Pending
4. **Implement Conflict Resolution** (MEDIUM)
   - Add timestamp-based conflict detection
   - Vector clocks or last-write-wins with versioning

5. **Optimize Rendering** (MEDIUM)
   - Add memoization to components
   - Use selective store subscriptions
   - Reduce re-renders during multiplayer

6. **Batch Firebase Writes** (MEDIUM)
   - Debounce persistence operations
   - Batch multiple updates before writing
   - Use delta sync for efficient updates

7. **Fix GM Map Update Visibility** (MEDIUM)
   - Include sender in map update broadcasts
   - Use separate confirmation event if needed

8. **Clean Up Global State** (LOW)
   - Remove unnecessary window flags
   - Implement proper cleanup on unmount
   - Use refs instead of window properties

## Testing Plan

After implementing fixes:
1. Test GM dragging tokens - verify no position jumps
2. Test players moving tokens - verify GM sees movement
3. Test map painting - verify GM sees updates immediately
4. Test simultaneous HP updates - verify correct values
5. Test long sessions - verify no memory leaks
6. Test with 2-4 players - verify performance
7. Test reconnection - verify state recovery

## Rollback Plan

If any fix causes issues:
1. Git revert to previous commit
2. Document the issue in `MULTIPLAYER_ISSUES.md`
3. Try alternative approach
4. Re-test before committing

## References

- Server: `server/server.js`
- Client: `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`
- Token Components: `vtt-react/src/components/grid/CreatureToken.jsx`, `CharacterToken.jsx`
- Store: `vtt-react/src/store/creatureStore.js`, `characterTokenStore.js`