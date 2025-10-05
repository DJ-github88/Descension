# Token Drag Jump & Performance Fix

## Problem Description

Users experienced the following issues when dragging character tokens:

1. **Token jumps back to start position** - During or after dragging, the token would suddenly snap back to where the drag started, leaving the user in a weird state where they had to cancel or confirm movement
2. **Framerate drops during drag** - The drag operation felt laggy and unresponsive
3. **Visual glitches** - Token position would flicker or jump unexpectedly

## Root Causes Identified

### 1. Duplicate Server Emissions (server.js)
**Location**: `server/server.js` lines 985 + 988 (character_moved), lines 900 + 901 (token_moved)

**Problem**: The server was emitting position updates TWICE to the sender:
```javascript
io.to(player.roomId).emit('character_moved', movementData); // Includes sender
socket.emit('character_moved', movementData); // Duplicate to sender
```

**Impact**: 
- Client receives the same position update twice
- Causes race conditions and visual glitches
- Wastes network bandwidth

### 2. Server Confirmations Overwriting Local Position (MultiplayerApp.jsx)
**Location**: `vtt-react/src/components/multiplayer/MultiplayerApp.jsx` lines 542-603

**Problem**: When the player dragged their own token, the server would echo back the position, and the client would apply it even though the client already had the correct position. This created a feedback loop:
1. Client drags token to position B
2. Client sends position B to server
3. Server echoes position B back to client
4. Client updates position to B (redundant)
5. If there's any network delay, the server might send an OLD position, causing the token to jump back

**Impact**:
- Token jumps back to previous positions
- Visual jitter during and after dragging
- Desynchronization between local and server state

### 3. Race Condition in useEffect (CharacterToken.jsx)
**Location**: `vtt-react/src/components/grid/CharacterToken.jsx` lines 46-50

**Problem**: The `useEffect` that updates `localPosition` when the `position` prop changes had no grace period after dragging ended:
```javascript
useEffect(() => {
    if (!isDragging) {
        setLocalPosition(position);
    }
}, [position, isDragging]);
```

**Impact**:
- When drag ends, `isDragging` becomes false
- Any server position update immediately overwrites local position
- Causes token to jump if server has stale data

### 4. Performance Issues
**Multiple locations**:
- Movement visualization animation running at 60fps (MovementVisualization.jsx line 39)
- Network updates sent at 20fps during drag (CharacterToken.jsx line 304)
- Frequent re-renders from state updates

**Impact**:
- Framerate drops during drag
- Laggy, unresponsive feel
- Increased CPU and network usage

## Fixes Applied

### Fix 1: Remove Duplicate Server Emissions
**Files**: `server/server.js`

**Changes**:
- Removed duplicate `socket.emit()` calls for both `character_moved` and `token_moved` events
- `io.to(player.roomId)` already includes the sender, so no need for separate emission

**Before**:
```javascript
io.to(player.roomId).emit('character_moved', movementData);
socket.emit('character_moved', movementData); // DUPLICATE
```

**After**:
```javascript
// Broadcast to room (includes sender since they're in the room)
// NOTE: io.to() already includes the sender, so no need for duplicate socket.emit()
io.to(player.roomId).emit('character_moved', movementData);
```

### Fix 2: Ignore Server Echoes for Own Movements
**File**: `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`

**Changes**:
- For own character movements, ignore server confirmations within 500ms of sending
- Only apply server updates if it's been a while (potential desync correction)
- Removed the complex serverTimestamp logic that was causing issues

**Before**:
```javascript
if (isOwnMovement) {
    if (data.serverTimestamp && !data.isDragging) {
        updateCharacterTokenPosition(data.playerId, data.position); // CAUSES JUMPS
    }
    return;
}
```

**After**:
```javascript
if (isOwnMovement) {
    const timeSinceMove = Date.now() - window[`recent_character_move_${data.playerId}`];
    
    if (timeSinceMove < 500) {
        // Ignore our own recent movement echoed back
        return;
    }
    
    // Apply server correction only if it's been a while (desync fix)
    updateCharacterTokenPosition(data.playerId, data.position);
    return;
}
```

### Fix 3: Add Grace Period to Position Updates
**File**: `vtt-react/src/components/grid/CharacterToken.jsx`

**Changes**:
- Added 200ms grace period after dragging before accepting position prop updates
- Track when position was last updated locally
- Immediately set localPosition when drag ends to prevent jumps

**Before**:
```javascript
useEffect(() => {
    if (!isDragging) {
        setLocalPosition(position); // Immediate update causes jumps
    }
}, [position, isDragging]);
```

**After**:
```javascript
const lastPositionUpdateRef = useRef(Date.now());

useEffect(() => {
    const timeSinceLastUpdate = Date.now() - lastPositionUpdateRef.current;
    
    // Don't update if currently dragging or within 200ms grace period
    if (!isDragging && timeSinceLastUpdate > 200) {
        setLocalPosition(position);
    }
}, [position, isDragging]);

// In handleMouseUp:
setLocalPosition({ x: snappedWorldPos.x, y: snappedWorldPos.y });
lastPositionUpdateRef.current = Date.now();
```

### Fix 4: Performance Optimizations

#### A. Throttle Movement Visualization Animation
**File**: `vtt-react/src/components/grid/MovementVisualization.jsx`

**Changes**:
- Reduced animation updates from 60fps to 30fps
- Added throttling to state updates while keeping smooth requestAnimationFrame loop

**Before**:
```javascript
const animate = () => {
    setDashOffset(prev => (prev + (deltaTime * 0.015)) % 12); // Every frame
    animationFrameId = requestAnimationFrame(animate);
};
```

**After**:
```javascript
const animate = () => {
    const timeSinceUpdate = currentTime - lastUpdateTime;
    
    if (timeSinceUpdate >= 33) { // ~30fps
        setDashOffset(prev => (prev + (deltaTime * 0.015)) % 12);
        lastUpdateTime = currentTime;
    }
    
    animationFrameId = requestAnimationFrame(animate);
};
```

#### B. Reduce Network Update Frequency
**File**: `vtt-react/src/components/grid/CharacterToken.jsx`

**Changes**:
- Reduced network updates during drag from 20fps to 10fps
- Changed throttle from 50ms to 100ms

**Before**:
```javascript
if (now - lastNetworkUpdate > 50) { // 20fps
```

**After**:
```javascript
if (now - lastNetworkUpdate > 100) { // 10fps - better performance
```

## Expected Results

After these fixes:

1. ✅ **No more token jumps** - Token stays where you drag it, no snapping back to start
2. ✅ **Smoother dragging** - Reduced framerate drops and lag during drag
3. ✅ **No weird confirm/cancel states** - Token position is stable when movement confirmation appears
4. ✅ **Better multiplayer sync** - No duplicate updates or feedback loops
5. ✅ **Improved performance** - Reduced CPU usage and network traffic

## Testing Recommendations

1. **Single Player**: Drag character token around, verify no jumps or glitches
2. **Multiplayer**: 
   - Drag your own character token, verify smooth movement
   - Watch other players drag their tokens, verify smooth updates
   - Test with network latency (throttle connection in dev tools)
3. **Combat Mode**: Drag token during combat, verify movement visualization works smoothly
4. **Performance**: Monitor framerate during drag, should be stable 60fps

## Additional Fix: Character Token Can't Move in Combat

### Problem
Character tokens couldn't move during combat because `isMyTurn` was always false.

### Root Cause
CharacterToken.jsx was using direct comparison `currentTurn === tokenId` instead of the proper `isTokensTurn(tokenId)` function from combatStore.

### Fix Applied
**File**: `vtt-react/src/components/grid/CharacterToken.jsx`

**Changes**:
1. Import `isTokensTurn` from combatStore (line 102)
2. Use `isTokensTurn(tokenId)` instead of direct comparison (line 129)

**Before**:
```javascript
const {
    isInCombat,
    currentTurn,
    // ... other imports
} = useCombatStore();

const isMyTurn = isInCombat && currentTurn === tokenId; // WRONG - always false
```

**After**:
```javascript
const {
    isInCombat,
    currentTurn,
    isTokensTurn,  // ADDED
    // ... other imports
} = useCombatStore();

const isMyTurn = isInCombat && isTokensTurn(tokenId); // CORRECT
```

### Grace Period Increased
Also increased the grace period from 200ms to 1000ms to better handle network latency and prevent position jumps.

## Files Modified

1. `server/server.js` - Removed duplicate emissions
2. `vtt-react/src/components/multiplayer/MultiplayerApp.jsx` - Fixed server echo handling
3. `vtt-react/src/components/grid/CharacterToken.jsx` - Added grace period, optimizations, and fixed isMyTurn
4. `vtt-react/src/components/grid/MovementVisualization.jsx` - Throttled animation updates

