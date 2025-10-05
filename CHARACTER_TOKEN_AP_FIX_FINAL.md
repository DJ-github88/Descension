# Character Token AP Confirmation - Final Fix

## Issue

Character/player tokens were not showing the AP confirmation dialog properly. After the first movement requiring AP, subsequent movements within the unlocked pool were incorrectly asking for confirmation again.

**Example of the bug:**
1. Move 5 feet → Pay 1 AP → Should unlock 30 feet total
2. Move another 25 feet (total 30) → **BUG**: Asked for confirmation again instead of being FREE

## Root Cause

The `getTotalUnlockedMovement` and `getRemainingMovement` functions in combatStore.js were not handling character tokens. They tried to find the creature in the creatures array, failed, and returned 0.

**Code path:**
1. CharacterToken calls `validateMovement(tokenId, start, end, [mockCreature], feetPerTile)`
2. `validateMovement` works fine (already had character token support)
3. On second movement, `validateMovement` calls `getTotalUnlockedMovement(tokenId, creatures)`
4. `getTotalUnlockedMovement` tries to find creature by ID → **FAILS** (character not in creatures array)
5. Returns 0 → System thinks no movement is unlocked
6. Asks for confirmation again → **BUG**

---

## Fixes Applied

### Fix 1: Add Character Token Support to `getTotalUnlockedMovement`

**File**: `vtt-react/src/store/combatStore.js` (lines 754-786)

**Before:**
```javascript
getTotalUnlockedMovement: (tokenId, creatures) => {
    const combatant = state.turnOrder.find(c => c.tokenId === tokenId);
    if (!combatant) return 0;

    const creature = creatures.find(c => c.id === combatant.creatureId);
    if (!creature) return 0; // ❌ Returns 0 for character tokens!
    
    // ... rest of logic
}
```

**After:**
```javascript
getTotalUnlockedMovement: (tokenId, creatures) => {
    const combatant = state.turnOrder.find(c => c.tokenId === tokenId);
    if (!combatant) return 0;

    // Find creature data - handle character tokens
    let creature = creatures.find(c => c.id === combatant.creatureId);

    if (!creature && combatant.isCharacterToken) {
        const useCharacterStore = require('./characterStore').default;
        const char = useCharacterStore.getState();
        creature = {
            id: combatant.creatureId,
            name: char.name || 'Character',
            stats: { speed: char.derivedStats?.movementSpeed || 30 }
        };
    }

    if (!creature) return 0;
    
    // ... rest of logic
}
```

---

### Fix 2: Add Character Token Support to `getRemainingMovement`

**File**: `vtt-react/src/store/combatStore.js` (lines 725-764)

Same fix as above - added character token handling to get creature data from character store.

---

### Fix 3: Simplify CharacterToken.jsx (Remove Bloat)

**File**: `vtt-react/src/components/grid/CharacterToken.jsx`

**Removed:**
- Mock creature creation (no longer needed)
- `derivedStats` from characterData selector (no longer needed)
- Redundant console.log statements

**Before (BLOATED):**
```javascript
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
```

**After (CLEAN):**
```javascript
// Validate movement - combatStore handles character tokens internally
const validation = validateMovement(tokenId, dragStartPosition, snappedWorldPos, [], feetPerTile);
```

---

## How It Works Now

### Movement Pool System

The system uses a "pay to unlock" model:

1. **First movement** → Pay 1 AP → Unlocks 30 feet (or character's movement speed)
2. **Subsequent movements within 30 feet** → FREE (no confirmation)
3. **Movement beyond 30 feet** → Pay 1 AP → Unlocks another 30 feet (total 60 feet)
4. **Subsequent movements within 60 feet** → FREE
5. And so on...

### Example Flow

**Character has 30 ft movement speed, 3 AP**

1. **Move 5 feet**
   - `movementUsedThisTurn = 0` → First movement
   - `needsConfirmation = true`, `additionalAPNeeded = 1`
   - Dialog appears: "This movement requires 1 AP"
   - User confirms → Spend 1 AP
   - `movementUsedThisTurn = 5`, `movementUnlocked = true`
   - `totalUnlockedMovement = Math.ceil(5/30) * 30 = 30`

2. **Move 25 more feet (total 30)**
   - `movementUsedThisTurn = 5`, `movementUnlocked = true`
   - `totalUnlockedMovement = 30`
   - `totalMovementAfterThis = 30`
   - `30 <= 30` → Within unlocked pool
   - `needsConfirmation = false`, `additionalAPNeeded = 0`
   - **No dialog, movement is FREE** ✅

3. **Move 10 more feet (total 40)**
   - `movementUsedThisTurn = 30`, `movementUnlocked = true`
   - `totalUnlockedMovement = 30`
   - `totalMovementAfterThis = 40`
   - `40 > 30` → Exceeds unlocked pool
   - `excessMovement = 10`, `additionalSegments = Math.ceil(10/30) = 1`
   - `needsConfirmation = true`, `additionalAPNeeded = 1`
   - Dialog appears: "This movement requires 1 AP"
   - User confirms → Spend 1 AP
   - `movementUsedThisTurn = 40`
   - `totalUnlockedMovement = Math.ceil(40/30) * 30 = 60`

4. **Move 20 more feet (total 60)**
   - `movementUsedThisTurn = 40`, `movementUnlocked = true`
   - `totalUnlockedMovement = 60`
   - `totalMovementAfterThis = 60`
   - `60 <= 60` → Within unlocked pool
   - `needsConfirmation = false`, `additionalAPNeeded = 0`
   - **No dialog, movement is FREE** ✅

---

## Files Modified

1. **vtt-react/src/store/combatStore.js**
   - Added character token support to `getTotalUnlockedMovement` (lines 754-786)
   - Added character token support to `getRemainingMovement` (lines 725-764)

2. **vtt-react/src/components/grid/CharacterToken.jsx**
   - Removed mock creature creation (bloat reduction)
   - Removed `derivedStats` from characterData selector
   - Simplified `validateMovement` call to pass empty array

---

## Testing Checklist

### Test 1: First Movement Within Base Speed
1. ✅ Start combat with character (30 ft speed, 3 AP)
2. ✅ Move 25 feet
3. ✅ **Expected**: Dialog appears asking for 1 AP
4. ✅ Confirm → AP spent, movement completes

### Test 2: Second Movement Within Unlocked Pool
1. ✅ After Test 1, move another 5 feet (total 30)
2. ✅ **Expected**: NO dialog, movement is FREE
3. ✅ Check AP → Should still have 2 AP (only spent 1)

### Test 3: Movement Exceeding Unlocked Pool
1. ✅ After Test 2, move 15 feet (total 45)
2. ✅ **Expected**: Dialog appears asking for 1 AP
3. ✅ Confirm → AP spent, movement completes
4. ✅ Check AP → Should have 1 AP remaining

### Test 4: Movement Within New Unlocked Pool
1. ✅ After Test 3, move 15 feet (total 60)
2. ✅ **Expected**: NO dialog, movement is FREE
3. ✅ Check AP → Should still have 1 AP

### Test 5: Multiple Small Movements
1. ✅ Start fresh turn
2. ✅ Move 5 feet → Dialog (1 AP)
3. ✅ Move 5 feet → FREE
4. ✅ Move 5 feet → FREE
5. ✅ Move 5 feet → FREE
6. ✅ Move 5 feet → FREE
7. ✅ Move 5 feet → FREE (total 30 feet, still FREE)
8. ✅ Move 5 feet → Dialog (1 AP, total 35 feet)

---

## Summary

✅ **Character tokens now properly track movement pools**  
✅ **First movement costs 1 AP to unlock base movement speed**  
✅ **Subsequent movements within unlocked pool are FREE**  
✅ **Exceeding pool triggers confirmation for additional AP**  
✅ **Code bloat reduced by removing redundant mock creature logic**  

The AP confirmation system now works **identically** for both creature tokens and character tokens! 🎯

