# Token Dragging and Combat Timeline Fixes

## Summary
Fixed three critical issues with token dragging and combat timeline functionality:
1. **Animated Stippled Line Positioning and Behavior** - Line now appears at correct position, follows cursor in real-time, and is properly animated
2. **Distance Calculation Grossly Incorrect** - Fixed calculation to properly convert world coordinates to tile-based feet
3. **Player/Party Tokens Not Appearing in Combat Timeline** - Character tokens now properly register in combat

## Additional Fixes
- **Missing `logMovementToCombat` function** - Added function to log movement to combat chat
- **Movement visualization not rendering** - Fixed Grid.jsx to properly check showMovementVisualization from gameStore
- **Movement line misaligned** - Fixed worldToScreen coordinate conversion to include viewport dimensions
- **Combat timeline sizing** - Timeline now auto-adjusts width based on number of combatants

---

## Issue 1: Animated Stippled Line Positioning and Behavior

### Root Cause
CharacterToken component was not calling the movement visualization functions at all, so the stippled line never appeared during drag. Additionally, the line was not animated (static dash pattern).

### Files Changed
1. **vtt-react/src/components/grid/CharacterToken.jsx**
2. **vtt-react/src/components/grid/MovementVisualization.jsx**

### Changes Made

#### CharacterToken.jsx - Added Movement Visualization Support

**1. Import movement visualization functions (lines 68-98)**
```javascript
const { 
    gridSize, 
    zoomLevel, 
    playerZoom, 
    cameraX, 
    cameraY, 
    isInMultiplayer, 
    multiplayerSocket, 
    isGMMode,
    showMovementVisualization,  // ADDED
    feetPerTile                 // ADDED
} = useGameStore();

const { 
    isInCombat, 
    currentTurn, 
    isSelectionMode, 
    selectedTokens, 
    toggleTokenSelection,
    activeMovement,                    // ADDED
    startMovementVisualization,        // ADDED
    updateMovementVisualization,       // ADDED
    clearMovementVisualization,        // ADDED
    updateTempMovementDistance         // ADDED
} = useCombatStore();
```

**2. Start visualization when drag begins (lines 260-265)**
```javascript
// CRITICAL FIX: Start movement visualization when dragging starts
if (showMovementVisualization) {
    startMovementVisualization(tokenId, { x: position.x, y: position.y });
}
```

**3. Update visualization during drag (lines 314-330)**
```javascript
// CRITICAL FIX: Update movement visualization and distance calculation during drag
if (dragStartPosition && now - lastCombatUpdate > 50) { // 20fps for combat updates
    // Update movement visualization if enabled
    if (showMovementVisualization && activeMovement?.tokenId === tokenId) {
        updateMovementVisualization({ x: worldPos.x, y: worldPos.y });
    }

    // Calculate and update temporary movement distance for tooltip
    // CRITICAL FIX: Convert world distance to tile distance before multiplying by feetPerTile
    const dx = worldPos.x - dragStartPosition.x;
    const dy = worldPos.y - dragStartPosition.y;
    const worldDistance = Math.sqrt(dx * dx + dy * dy);
    const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
    const distance = tileDistance * feetPerTile;
    updateTempMovementDistance(tokenId, distance);

    lastCombatUpdate = now;
}
```

**4. Clear visualization when drag ends (line 394-396)**
```javascript
// CRITICAL FIX: Clear movement visualization when drag ends
clearMovementVisualization();
```

**5. Updated useEffect dependencies (lines 451-470)**
Added all new dependencies to prevent stale closures.

#### MovementVisualization.jsx - Added Animation

**1. Added animation state and effect (lines 1-49)**
```javascript
import React, { useMemo, useState, useEffect } from 'react';

// Animation state for stippled line (marching ants effect)
const [dashOffset, setDashOffset] = useState(0);

// Animate the dash offset for marching ants effect
useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();

    const animate = () => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Update dash offset (move 15 pixels per second)
        setDashOffset(prev => (prev + (deltaTime * 0.015)) % 12);

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}, []);
```

**2. Applied animated dash offset to line (line 188)**
```javascript
<line
    x1={relativeStartX}
    y1={relativeStartY}
    x2={relativeCurrentX}
    y2={relativeCurrentY}
    stroke={movementData.lineColor}
    strokeWidth={movementLineWidth}
    strokeDasharray={movementLineDashArray}
    strokeDashoffset={-dashOffset}  // ADDED - Creates marching ants effect
    strokeOpacity={movementData.lineOpacity}
    strokeLinecap="round"
/>
```

---

## Issue 2: Distance Calculation Grossly Incorrect

### Root Cause
The distance calculation was multiplying world coordinates (in pixels) directly by `feetPerTile`, without first converting to tile units. This caused wildly inflated distances (600-5000 feet for small movements).

**Example of the bug:**
- Grid size: 50 pixels per tile
- Movement: 10 pixels
- Wrong calculation: `10 * 5 = 50 feet`
- Correct calculation: `(10 / 50) * 5 = 1 foot`

### Files Changed
1. **vtt-react/src/components/grid/CreatureToken.jsx**
2. **vtt-react/src/components/grid/CharacterToken.jsx**
3. **vtt-react/src/components/grid/MovementVisualization.jsx**

### Changes Made

#### CreatureToken.jsx (lines 259-266)
**Before:**
```javascript
const dx = worldPos.x - dragStartPosition.x;
const dy = worldPos.y - dragStartPosition.y;
const distance = Math.sqrt(dx * dx + dy * dy) * feetPerTile;
```

**After:**
```javascript
const dx = worldPos.x - dragStartPosition.x;
const dy = worldPos.y - dragStartPosition.y;
const worldDistance = Math.sqrt(dx * dx + dy * dy);
const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
const distance = tileDistance * feetPerTile;
```

#### CharacterToken.jsx (lines 320-327)
Same fix applied as above.

#### MovementVisualization.jsx (lines 35-42)
Already had correct calculation, just added clarifying comment.

---

## Issue 3: Player/Party Tokens Not Appearing in Combat Timeline

### Root Cause
The `startCombat` function in combatStore.js only checked for `token.playerId` to identify character tokens. However, local single-player character tokens have `isPlayerToken: true` but no `playerId` (only multiplayer tokens have playerId).

### File Changed
**vtt-react/src/store/combatStore.js**

### Changes Made (lines 60-83)

**Before:**
```javascript
// Handle character tokens (have playerId but no creatureId)
if (!creature && token.playerId) {
    isCharacterToken = true;
    const useCharacterStore = require('./characterStore').default;
    const char = useCharacterStore.getState();
    creature = {
        id: `character_${token.playerId}`,
        name: char.name || 'Character',
        // ... rest of creature object
    };
}
```

**After:**
```javascript
// CRITICAL FIX: Handle character tokens (have playerId OR isPlayerToken flag)
// Local player tokens have isPlayerToken=true but no playerId
// Multiplayer player tokens have playerId
if (!creature && (token.playerId || token.isPlayerToken)) {
    isCharacterToken = true;
    const useCharacterStore = require('./characterStore').default;
    const char = useCharacterStore.getState();
    creature = {
        id: token.playerId ? `character_${token.playerId}` : 'character_local',
        name: char.name || 'Character',
        // ... rest of creature object
    };
}
```

---

## Testing Checklist

### Issue 1: Stippled Line
- [ ] Drag a creature token - stippled line appears from start position
- [ ] Drag a character/player token - stippled line appears from start position
- [ ] Line follows cursor in real-time during drag
- [ ] Line is animated (marching ants effect)
- [ ] Line adheres to grid properly
- [ ] Distance label updates in real-time
- [ ] Line disappears when drag ends
- [ ] Works in multiplayer with real-time visibility

### Issue 2: Distance Calculation
- [ ] Drag token 1 tile - shows ~5 feet (or configured feetPerTile value)
- [ ] Drag token 5 tiles - shows ~25 feet
- [ ] No more wildly inflated distances (600-5000 feet)
- [ ] Distance tooltip shows correct values
- [ ] Combat movement validation uses correct distances

### Issue 3: Combat Timeline
- [ ] Toggle local player token for combat - appears in timeline
- [ ] Toggle multiplayer player token for combat - appears in timeline
- [ ] Player tokens show correct initiative, AP, and stats
- [ ] Player tokens can take turns in combat
- [ ] Player token portraits display correctly in timeline

---

## Additional Fixes Applied

### Fix 4: Missing `logMovementToCombat` Function

**File**: `vtt-react/src/components/grid/CreatureToken.jsx`

**Problem**: Function was called but not defined, causing runtime error.

**Solution**: Added helper function and imported chatStore:

```javascript
// Import chatStore
import useChatStore from '../../store/chatStore';

// Helper function to log movement to combat chat
const logMovementToCombat = (tokenId, creatures, distance, startPos, endPos) => {
  const useChatStore = require('../../store/chatStore').default;
  const useCreatureStore = require('../../store/creatureStore').default;

  const { addCombatNotification } = useChatStore.getState();
  const { tokens } = useCreatureStore.getState();

  const token = tokens.find(t => t.id === tokenId);
  const creature = token ? creatures.find(c => c.id === token.creatureId) : null;

  if (creature && addCombatNotification) {
    addCombatNotification({
      type: 'movement',
      creature: creature.name,
      distance: Math.round(distance),
      from: startPos,
      to: endPos,
      content: `${creature.name} moved ${Math.round(distance)} feet`,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Fix 5: Movement Visualization Not Rendering (CRITICAL)

**File**: `vtt-react/src/components/Grid.jsx`

**Problem**: Grid component was using `.getState()` in an IIFE, which is NOT reactive. When `activeMovement` changed during drag, the Grid component didn't re-render, so the visualization never appeared.

**Root Cause**: Using `useCombatStore.getState()` and `useGameStore.getState()` directly reads the state once but doesn't subscribe to changes. The component needs to use Zustand hooks properly to be reactive.

**Before** (Non-reactive):
```javascript
{(() => {
    const { activeMovement } = useCombatStore.getState();
    const { showMovementVisualization } = useGameStore.getState();

    if (showMovementVisualization && activeMovement?.tokenId && ...) {
        return <MovementVisualization ... />
    }
})()}
```

**After** (Reactive):
```javascript
// At component level - subscribes to state changes
const { showMovementVisualization } = gameStore;
const activeMovement = useCombatStore(state => state.activeMovement);

// In render - now reactive!
{showMovementVisualization && activeMovement?.tokenId && activeMovement?.startPosition && activeMovement?.currentPosition && (
    <MovementVisualization
        startPosition={activeMovement.startPosition}
        currentPosition={activeMovement.currentPosition}
        tokenId={activeMovement.tokenId}
        gridSystem={gridSystem}
    />
)}
```

**Key Changes**:
1. Added `showMovementVisualization` to gameStore destructuring at component level
2. Added reactive subscription: `const activeMovement = useCombatStore(state => state.activeMovement)`
3. Removed IIFE and replaced with simple conditional render
4. Now re-renders automatically when `activeMovement` changes during drag

---

## Additional Fixes Applied (Round 2)

### Fix 6: Movement Line Misalignment

**File**: `vtt-react/src/components/grid/MovementVisualization.jsx`

**Problem**: The stippled line was appearing in the wrong position, not at the token's location.

**Root Cause**: The `worldToScreen()` function requires viewport dimensions to properly center coordinates. Without them, it uses a fallback calculation that doesn't account for the centered coordinate system.

**Before**:
```javascript
const startScreen = gridSystem.worldToScreen(startPosition.x, startPosition.y);
const currentScreen = gridSystem.worldToScreen(currentPosition.x, currentPosition.y);
```

**After**:
```javascript
// CRITICAL FIX: Convert world coordinates to screen coordinates with viewport dimensions
// This ensures proper centering and positioning
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const startScreen = gridSystem.worldToScreen(startPosition.x, startPosition.y, viewportWidth, viewportHeight);
const currentScreen = gridSystem.worldToScreen(currentPosition.x, currentPosition.y, viewportWidth, viewportHeight);
```

**Technical Details**:
- `worldToScreen(x, y)` without viewport dimensions: `{ x: (worldX - cameraX) * zoom, y: (worldY - cameraY) * zoom }`
- `worldToScreen(x, y, vw, vh)` with viewport dimensions: `{ x: (worldX - cameraX) * zoom + vw/2, y: (worldY - cameraY) * zoom + vh/2 }`
- The viewport centering offset (`+ vw/2`, `+ vh/2`) is critical for proper positioning

### Fix 7: Combat Timeline Auto-Sizing

**Files**:
- `vtt-react/src/components/combat/CombatTimeline.jsx`
- `vtt-react/src/styles/combat-system.css`

**Problem**: Combat timeline had fixed width that didn't adjust to fit all tokens properly.

**Solution**:

**CombatTimeline.jsx** - Added dynamic width calculation:
```javascript
// Calculate optimal width based on number of combatants
const tokenWidth = 90;
const tokenGap = 10;
const padding = 32;
const controlsWidth = 300;
const calculatedWidth = Math.max(
    400, // Minimum width
    Math.min(
        1200, // Maximum width
        (turnOrder.length * (tokenWidth + tokenGap)) + padding + controlsWidth
    )
);

const effectiveWidth = timelineSize.width || calculatedWidth;
```

**combat-system.css** - Updated token styling:
```css
.timeline-combatants {
    flex-wrap: nowrap; /* Prevent wrapping */
    min-height: 60px; /* Ensure minimum height for tokens */
}

.timeline-token {
    max-width: 90px; /* Prevent tokens from getting too wide */
    flex-shrink: 0; /* Prevent tokens from shrinking */
}
```

**Benefits**:
- Timeline automatically expands to fit all combatants
- Tokens maintain consistent size
- Horizontal scrolling available if needed
- Respects min/max constraints (300px - 1200px)

---

## Technical Notes

### Distance Calculation Formula
```
worldDistance = sqrt(dx² + dy²)           // Euclidean distance in world pixels
tileDistance = worldDistance / gridSize   // Convert to tile units
feetDistance = tileDistance * feetPerTile // Convert to feet
```

### Movement Visualization Flow
1. **Drag Start**: `startMovementVisualization(tokenId, startPosition)`
2. **During Drag**: `updateMovementVisualization(currentPosition)` (throttled to 20fps)
3. **Drag End**: `clearMovementVisualization()`

### Character Token Identification
- **Local player**: `isPlayerToken === true`, `playerId === undefined`
- **Multiplayer player**: `isPlayerToken === false`, `playerId === "player123"`
- **Creature token**: `creatureId` exists, both flags false

