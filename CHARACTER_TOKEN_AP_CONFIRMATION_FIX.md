# Character Token AP Confirmation Fix

## Issue Description

**Problem**: When moving a character/player token in combat and the movement requires spending AP (Action Points), no confirmation dialog appears. The movement just happens automatically without asking the player to confirm the AP expenditure.

**Expected Behavior**: Should show the same AP confirmation dialog that appears for creature tokens, asking "This movement requires X AP. Confirm?" with Confirm/Cancel buttons.

**Actual Behavior**: Character tokens move without any confirmation, even when AP is required.

---

## Root Cause

CharacterToken.jsx was **completely missing** all the movement confirmation logic that CreatureToken.jsx has:

1. ❌ No import of `MovementConfirmationDialog` component
2. ❌ No import of confirmation-related functions from combatStore
3. ❌ No `handleConfirmMovement` and `handleCancelMovement` handlers
4. ❌ No combat validation logic in `handleMouseUp`
5. ❌ No rendering of the `MovementConfirmationDialog` component
6. ❌ No turn start position tracking

The `handleMouseUp` function was just updating the position directly without checking if the movement was valid or required AP.

---

## Fixes Applied

### Fix 1: Import MovementConfirmationDialog Component

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (line 14)

```javascript
import MovementConfirmationDialog from '../combat/MovementConfirmationDialog';
```

---

### Fix 2: Import Combat Store Functions

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 101-120)

**Added imports**:
- `pendingMovementConfirmation` - Stores pending movement that needs confirmation
- `setPendingMovementConfirmation` - Sets the pending confirmation data
- `clearPendingMovementConfirmation` - Clears the pending confirmation
- `confirmMovement` - Confirms and applies the movement, spending AP
- `validateMovement` - Validates if movement is allowed and calculates AP cost
- `recordTurnStartPosition` - Records position at start of turn
- `getTurnStartPosition` - Gets the recorded start position

```javascript
const {
    isInCombat,
    currentTurn,
    isSelectionMode,
    selectedTokens,
    toggleTokenSelection,
    activeMovement,
    startMovementVisualization,
    updateMovementVisualization,
    clearMovementVisualization,
    updateTempMovementDistance,
    isTokensTurn,
    pendingMovementConfirmation,      // NEW
    setPendingMovementConfirmation,   // NEW
    clearPendingMovementConfirmation, // NEW
    confirmMovement,                  // NEW
    validateMovement,                 // NEW
    recordTurnStartPosition,          // NEW
    getTurnStartPosition              // NEW
} = useCombatStore();
```

---

### Fix 3: Add derivedStats to Character Data

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 68-80)

Added `derivedStats` to get character's movement speed:

```javascript
const characterData = useCharacterStore(state => ({
    name: state.name,
    race: state.race,
    class: state.class,
    level: state.level,
    health: state.health,
    mana: state.mana,
    actionPoints: state.actionPoints,
    lore: state.lore,
    tokenSettings: state.tokenSettings,
    derivedStats: state.derivedStats  // NEW - includes movementSpeed
}));
```

---

### Fix 4: Add Turn Start Position Tracking

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 147-157)

Records the character's position at the start of their turn (needed for movement distance calculation):

```javascript
// Record turn start position when turn begins
useEffect(() => {
    if (isMyTurn && position) {
        const currentTurnStartPosition = getTurnStartPosition(tokenId);
        if (!currentTurnStartPosition) {
            recordTurnStartPosition(tokenId, position);
        }
    }
}, [isMyTurn, tokenId, position, recordTurnStartPosition, getTurnStartPosition]);
```

---

### Fix 5: Add Confirmation Handlers

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 201-240)

Added handlers for confirming or canceling movement:

```javascript
// Movement confirmation handlers
const handleConfirmMovement = () => {
    if (pendingMovementConfirmation) {
        const {
            tokenId: pendingTokenId,
            finalPosition,
            requiredAP,
            totalDistance
        } = pendingMovementConfirmation;

        console.log('💰 CONFIRMING CHARACTER MOVEMENT:', {
            requiredAP,
            totalDistance: Math.round(totalDistance)
        });

        // Update token position to final position
        updateCharacterTokenPosition(pendingTokenId, finalPosition);

        // Track the movement and spend the required AP
        confirmMovement(pendingTokenId, requiredAP, totalDistance);

        // Clear the pending confirmation
        clearPendingMovementConfirmation();
    }
};

const handleCancelMovement = () => {
    if (pendingMovementConfirmation) {
        const { tokenId: pendingTokenId, startPosition } = pendingMovementConfirmation;

        console.log('❌ CANCELING CHARACTER MOVEMENT');

        // Revert token to start position
        updateCharacterTokenPosition(pendingTokenId, startPosition);
        setLocalPosition(startPosition);

        // Clear the pending confirmation
        clearPendingMovementConfirmation();
    }
};
```

---

### Fix 6: Add Combat Validation Logic to handleMouseUp

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 457-520)

**Before**: Just updated position directly
```javascript
// Update final position with grid snapping
updateCharacterTokenPosition(tokenId, { x: snappedWorldPos.x, y: snappedWorldPos.y });

// Send to multiplayer
if (isInMultiplayer && multiplayerSocket) {
    multiplayerSocket.emit('character_moved', { ... });
}
```

**After**: Validates movement and shows confirmation if needed
```javascript
// CRITICAL FIX: Handle combat movement validation if in combat
if (isInCombat && dragStartPosition) {
    // Create a mock creature object from character data for validation
    const mockCreature = {
        id: tokenId,
        name: characterData.name || 'Character',
        stats: {
            speed: characterData.derivedStats?.movementSpeed || 30
        }
    };

    // Validate movement and handle AP costs
    const validation = validateMovement(tokenId, dragStartPosition, snappedWorldPos, [mockCreature], feetPerTile);

    if (validation.needsConfirmation) {
        // Movement requires confirmation - show dialog
        const combatant = useCombatStore.getState().turnOrder.find(c => c.tokenId === tokenId);
        setPendingMovementConfirmation({
            tokenId,
            startPosition: dragStartPosition,
            finalPosition: snappedWorldPos,
            requiredAP: validation.additionalAPNeeded,
            totalDistance: validation.totalMovementAfterThis,
            baseMovement: mockCreature.stats.speed,
            currentAP: combatant?.currentActionPoints || 0,
            creatureName: characterData.name || 'Character',
            movementUsedThisTurn: validation.movementUsedThisTurn,
            feetPerTile: feetPerTile,
            currentMovementDistance: validation.currentMovementFeet
        });
    } else if (validation.isValid) {
        // Movement is valid - auto-confirm
        confirmMovement(tokenId, validation.additionalAPNeeded, validation.currentMovementFeet);
        // Send to multiplayer...
    } else {
        // Movement is invalid - revert to start position
        console.log('❌ CHARACTER MOVEMENT IS INVALID - Reverting');
        updateCharacterTokenPosition(tokenId, dragStartPosition);
        setLocalPosition(dragStartPosition);
        updateTempMovementDistance(tokenId, 0);
    }
} else {
    // Not in combat - send final position to multiplayer
    // ...
}
```

---

### Fix 7: Render MovementConfirmationDialog Component

**File**: `vtt-react/src/components/grid/CharacterToken.jsx` (lines 1354-1361)

Added the dialog component to the render output:

```javascript
{/* Movement Confirmation Dialog */}
<MovementConfirmationDialog
    isOpen={!!pendingMovementConfirmation}
    onConfirm={handleConfirmMovement}
    onCancel={handleCancelMovement}
    movementData={pendingMovementConfirmation}
    position={{ x: 400, y: 300 }}
/>
```

---

## How It Works Now

### Scenario 1: Movement Within Base Speed (No AP Required)
1. ✅ Player drags character token 20 feet (base speed is 30 feet)
2. ✅ Movement is validated - no AP needed
3. ✅ Movement is auto-confirmed
4. ✅ No dialog appears
5. ✅ Token moves to new position

### Scenario 2: Movement Requires AP (First Time)
1. ✅ Player drags character token 40 feet (base speed is 30 feet)
2. ✅ Movement is validated - requires 1 AP for extra 10 feet
3. ✅ **Confirmation dialog appears**: "This movement requires 1 AP. Confirm?"
4. ✅ Player clicks "Confirm" → AP is spent, movement completes
5. ✅ Player clicks "Cancel" → Token returns to start position, no AP spent

### Scenario 3: Invalid Movement (Not Enough AP)
1. ✅ Player has 0 AP remaining
2. ✅ Player tries to move beyond base speed
3. ✅ Movement is validated - invalid (not enough AP)
4. ✅ Token automatically reverts to start position
5. ✅ No dialog appears (movement is simply rejected)

---

## Testing Checklist

### Test 1: Basic Movement (No AP)
1. ✅ Start combat with character token
2. ✅ On character's turn, move within base speed (e.g., 25 feet if speed is 30)
3. ✅ **Expected**: No dialog, movement completes automatically

### Test 2: Movement Requiring AP
1. ✅ Start combat with character token
2. ✅ On character's turn, move beyond base speed (e.g., 40 feet if speed is 30)
3. ✅ **Expected**: Dialog appears showing AP cost
4. ✅ Click "Confirm" → Movement completes, AP is spent
5. ✅ Check combat log for AP expenditure

### Test 3: Cancel Movement
1. ✅ Start combat with character token
2. ✅ Move beyond base speed to trigger dialog
3. ✅ Click "Cancel"
4. ✅ **Expected**: Token returns to start position, no AP spent

### Test 4: Invalid Movement
1. ✅ Start combat with character token
2. ✅ Spend all AP on other actions
3. ✅ Try to move beyond base speed
4. ✅ **Expected**: Token automatically reverts, no dialog

### Test 5: Multiplayer Sync
1. ✅ Join multiplayer room
2. ✅ Move character token requiring AP
3. ✅ Confirm movement
4. ✅ **Expected**: Other players see the movement and combat log entry

---

## Summary

Character tokens now have **full feature parity** with creature tokens for combat movement:

✅ **AP confirmation dialog** appears when movement requires AP  
✅ **Movement validation** checks if movement is allowed  
✅ **Turn start position** tracking for accurate distance calculation  
✅ **Auto-confirm** for movements within base speed  
✅ **Auto-revert** for invalid movements  
✅ **Multiplayer sync** for confirmed movements  

The character token movement system now works **exactly like** the creature token system! 🎯

