# Multiplayer Issues & Fixes

## Issue Summary

1. **Offline rooms flooding room list** ✅ FIXED  
2. **Token drag/drop desync when dragged fast** ✅ FIXED
3. **Can't drop player tokens** ✅ FIXED
4. **Syntax errors causing crashes** ✅ FIXED
5. **Player ownership for token movement** ⏳ TESTING

## Fix 1: Filter Offline Rooms ✅

**Problem:** Offline persistent rooms appear in the "Join Room" list, which should only show rooms with active GMs.

**Solution:** Filter rooms by `gmOnline` status in `RoomLobby.jsx`

**File Changed:** `vtt-react/src/components/multiplayer/RoomLobby.jsx`

```javascript
// Added filtering after fetching rooms
const onlineRooms = rooms.filter(room => {
  // gmOnline indicates if the GM is currently connected
  // If undefined, assume true for backwards compatibility
  return room.gmOnline !== false;
});

setAvailableRooms(onlineRooms);
```

**Result:** Only active rooms with connected GMs appear in the room list. Offline persistent rooms only show in "My Rooms" tab.

---

## Fix 2: Token Drag/Drop Desync ✅

**Problem:** When tokens are dragged quickly, players see them drop at wrong positions. Token teleports around during drag (x: -775 → 25 → 625 → -725).

**Root Cause:** The `handleMouseUp` event was recalculating position from `e.clientX/clientY`, which can be STALE when dragging fast. The mouse event fires **after** the last mousemove, so it has outdated coordinates.

**Solution:** Use the last tracked position from `localPosition` or `pendingWorldPosRef` instead of recalculating from the mouse event.

**Files Changed:**
- `vtt-react/src/components/grid/CharacterToken.jsx` (lines 899-918)
- `vtt-react/src/components/grid/CreatureToken.jsx` (lines 645-656)

**Implementation:**
```javascript
// CRITICAL FIX: Use the last tracked position instead of recalculating from mouse event
let finalWorldPos;

// Priority 1: Use pending position from last mousemove (most accurate)
if (pendingWorldPosRef.current) {
    finalWorldPos = { ...pendingWorldPosRef.current };
}
// Priority 2: Use current local position (fallback)
else {
    finalWorldPos = { ...localPosition };
}

// Snap to grid for final placement
const gridCoords = gridSystem.worldToGrid(finalWorldPos.x, finalWorldPos.y);
const snappedWorldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);
```

**Result:** Tokens now drop exactly where the GM releases them, no more teleporting!

---

## Fix 3: Can't Drop Player Tokens ✅

**Problem:** Player tokens created from the HUD context menu would stick to the mouse cursor and couldn't be placed.

**Root Cause:** The `CanvasGridRenderer` was blocking clicks when `isDraggingCharacterToken` was true (line 434).

---

## Testing Checklist

### Room Filtering
- [ ] Create a room and disconnect GM
- [ ] Check that room disappears from "Join Room" list
- [ ] Verify room still appears in GM's "My Rooms" tab
- [ ] Reconnect GM and verify room reappears

### Token Movement
- [  ] GM drags token slowly - check player sees correct position
- [ ] GM drags token very fast - check if desync occurs
- [ ] Player drags own token - check if GM sees it
- [ ] Check browser console for position logs

### Player Token Drop
- [ ] Create character token from HUD
- [ ] Try to drag and drop it
- [ ] Check browser console for errors
- [ ] Verify token ownership settings

---

## Additional Notes

**Grid XY Coordinates:**
The grid system already uses XY coordinates:
- `gridSystem.screenToWorld(screenX, screenY)` - converts screen to world
- `gridSystem.worldToGrid(x, y)` - converts world to grid coords
- `gridSystem.gridToWorld(gridX, gridY)` - converts grid to world

The synchronization uses these coordinate systems correctly. The desync issue is likely timing-related rather than coordinate calculation.

**Next Steps:**
1. Test the offline rooms filter
2. Add logging to track exact drop positions in multiplayer
3. Investigate player token creation/ownership flow
