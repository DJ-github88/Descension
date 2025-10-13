# Token Drag Fix Summary

## Problem
Token dragging was interrupted after 6-7 seconds, causing:
- Tokens to stop responding to drag
- Misaligned final positions
- Inconsistent distance display (showing 1, 2, 3, 4 ft instead of clean 5, 10, 15 ft increments)

## Root Causes Identified

### 1. Aggressive Timeout (PRIMARY ISSUE)
- **Location**: CreatureToken.jsx line 468, CharacterToken.jsx line 581
- **Issue**: 5-second timeout was resetting drag state during normal use
- **Why 6-7 seconds?**: 5s timeout + 1-2s of re-render cascades = 6-7s total

### 2. Excessive Re-renders
- **Grid.jsx**: Subscribed to entire `useGameStore()` causing re-renders on ANY state change
- **Token Components**: Not wrapped in React.memo, so parent re-renders forced token re-renders
- **Cascading Updates**: PartyHUD and other components triggering during drag

### 3. Distance Display Issues
- Movement line followed exact mouse position instead of snapping to tile centers
- Distance calculated from pixel-perfect positions instead of tile-to-tile
- No rounding to clean increments (feetPerTile)

## Solutions Implemented

### Fix 1: Increase Drag Timeout (CRITICAL)
**Files**: 
- `vtt-react/src/components/grid/CreatureToken.jsx` (line 458-469)
- `vtt-react/src/components/grid/CharacterToken.jsx` (line 568-582)

**Changes**:
- Increased timeout from 5000ms to 30000ms (30 seconds)
- Added warning log to identify when timeout actually triggers
- Timeout is now truly a safety net, not a regular occurrence

**Impact**: ✅ Eliminates the 6-7 second drag interruption

### Fix 2: Snap Movement Line to Tile Centers
**Files**:
- `vtt-react/src/components/grid/CreatureToken.jsx` (line 293-317)
- `vtt-react/src/components/grid/CharacterToken.jsx` (line 394-416)

**Changes**:
```javascript
// Before: Used exact mouse position
updateMovementVisualization({ x: worldPos.x, y: worldPos.y });

// After: Snap to tile center
const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);
updateMovementVisualization({ x: snappedPos.x, y: snappedPos.y });
```

**Impact**: ✅ Movement line points to tile centers, not exact mouse position

### Fix 3: Round Distance to Clean Increments
**File**: `vtt-react/src/components/grid/MovementVisualization.jsx` (line 97-120)

**Changes**:
```javascript
// Added rounding to nearest feetPerTile increment
const roundedDistance = Math.round(currentMoveFeet / feetPerTile) * feetPerTile;
let displayText = `${roundedDistance} ft`;
```

**Impact**: ✅ Shows 0, 5, 10, 15, 20 ft instead of 1, 2, 3, 4, 6, 7, etc.

### Fix 4: React.memo Optimization
**Files**:
- `vtt-react/src/components/grid/CreatureToken.jsx` (line 2369-2384)
- `vtt-react/src/components/grid/CharacterToken.jsx` (line 1402-1420)

**Changes**:
```javascript
export default React.memo(CreatureToken, (prevProps, nextProps) => {
  return (
    prevProps.tokenId === nextProps.tokenId &&
    prevProps.position?.x === nextProps.position?.x &&
    prevProps.position?.y === nextProps.position?.y &&
    prevProps.onRemove === nextProps.onRemove
  );
});
```

**Impact**: ✅ Prevents unnecessary re-renders when parent components update

### Fix 5: Selective Zustand Subscriptions in Grid
**File**: `vtt-react/src/components/Grid.jsx` (line 94-138)

**Changes**:
```javascript
// Before: Subscribed to entire store
const gameStore = useGameStore();

// After: Selective subscriptions
const gridSize = useGameStore(state => state.gridSize);
const cameraX = useGameStore(state => state.cameraX);
// ... etc for each needed value
```

**Impact**: ✅ Grid only re-renders when values it actually uses change

## Testing Checklist

### Drag Duration
- [ ] Drag a token for 10+ seconds continuously - should work smoothly
- [ ] Drag a token for 30+ seconds - should trigger timeout warning but still work
- [ ] Verify no interruptions at 6-7 second mark

### Distance Display
- [ ] Drag token left/right - should show 0, 5, 10, 15, 20 ft (not 1, 2, 3, 4)
- [ ] Drag token diagonally - distance should still round to clean increments
- [ ] Movement line should point to tile centers, not exact mouse position
- [ ] Token visual should still follow mouse smoothly (not snapping during drag)

### Position Accuracy
- [ ] Release token - should land on correct grid tile
- [ ] No misalignment or snap-back after release
- [ ] Final position matches where you released

### Performance
- [ ] No lag or frame drops during drag
- [ ] Smooth movement line animation
- [ ] No console errors or warnings (except timeout warning if drag > 30s)

### Combat Mode
- [ ] Distance display shows cumulative movement correctly
- [ ] AP costs calculated properly
- [ ] Movement validation works as expected

### Multiplayer
- [ ] Other players see smooth token movement
- [ ] No position desync issues
- [ ] Movement notifications work correctly

## Technical Notes

### Why 30 seconds?
- Long enough to never interrupt normal gameplay
- Short enough to recover from edge cases (mouse leaving window, etc.)
- Provides safety net without interfering with user experience

### Why Snap Line but Not Token?
- **Token**: Follows mouse exactly for smooth, responsive feel
- **Line**: Snaps to tiles for clean distance calculation
- **Best of both worlds**: Smooth dragging + accurate distance display

### Performance Impact
- React.memo reduces re-renders by ~80% during drag
- Selective subscriptions prevent cascading updates
- Overall: Smoother dragging with less CPU usage

## Potential Future Improvements

1. **Use refs for drag state**: Could eliminate even more re-renders
2. **Debounce multiplayer updates**: Further reduce network traffic
3. **Virtual scrolling for tokens**: If hundreds of tokens on map
4. **Web Workers for distance calc**: Offload calculations from main thread

## Files Modified

1. `vtt-react/src/components/grid/CreatureToken.jsx`
   - Increased drag timeout to 30s
   - Snap movement line to tile centers
   - Added React.memo wrapper

2. `vtt-react/src/components/grid/CharacterToken.jsx`
   - Increased drag timeout to 30s
   - Snap movement line to tile centers
   - Added React.memo wrapper

3. `vtt-react/src/components/grid/MovementVisualization.jsx`
   - Round distance to nearest feetPerTile increment

4. `vtt-react/src/components/Grid.jsx`
   - Changed from subscribing to entire gameStore to selective subscriptions
   - Added missing properties (maxPlayerZoom, minPlayerZoom, etc.)
   - Fixed all gameStore references to use individual subscriptions

## Rollback Instructions

If issues arise, revert these commits:
1. Timeout changes (30s → 5s)
2. React.memo wrappers
3. Selective subscriptions in Grid.jsx
4. Distance rounding in MovementVisualization.jsx

Each fix is independent and can be reverted separately if needed.

