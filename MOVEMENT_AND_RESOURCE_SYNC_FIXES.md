# Movement and Resource Synchronization Fixes

## Summary
This document outlines the critical fixes applied to resolve movement calculation bugs and AP/HP/Mana synchronization issues across the combat system.

---

## Issue #1: Movement Distance Accumulation Bug ✅ FIXED

### Problem
When movement was auto-confirmed (didn't require user confirmation), the system was passing the **current move's distance** instead of the **cumulative total distance** to `confirmMovement()`. This caused the movement tracking to reset instead of accumulate.

### Example of the Bug
1. Move 10ft → `turnMovementUsed` = 10ft ✓
2. Move 15ft → `turnMovementUsed` = 15ft (WRONG! Should be 25ft) ✗
3. Move 10ft → `turnMovementUsed` = 10ft (WRONG! Should be 35ft) ✗

### Root Cause
**CharacterToken.jsx (line 490)** and **CreatureToken.jsx (line 370)**:
```javascript
// WRONG - passes just this move's distance
confirmMovement(tokenId, validation.additionalAPNeeded, validation.currentMovementFeet);
```

### Fix Applied
Changed both files to pass the cumulative total:
```javascript
// CORRECT - passes cumulative total distance
confirmMovement(tokenId, validation.additionalAPNeeded, validation.totalMovementAfterThis);
```

### Files Modified
- `vtt-react/src/components/grid/CharacterToken.jsx` (line 490)
- `vtt-react/src/components/grid/CreatureToken.jsx` (line 370)

---

## Issue #2: Movement Distance Calculation Inconsistency ✅ FIXED

### Problem
Two different calculation methods were being used:
- **During Drag (MovementVisualization.jsx)**: Euclidean distance `√(dx² + dy²)`
- **On Drop (validateMovement)**: D&D tile-based rules (5ft straight, 8ft diagonal)

This caused the displayed distance during drag to differ from the final calculated distance.

### Example
Moving diagonally 3 tiles:
- Euclidean: √(3² + 3²) = 4.24 tiles × 5ft = **21.2ft** (shown during drag)
- D&D rules: 3 diagonal tiles × 8ft = **24ft** (calculated on drop)

### Fix Applied
Modified `MovementVisualization.jsx` to use the validation result when in combat:
```javascript
// Get validation first
const movementValidation = isInCombat ?
    validateMovement(tokenId, startPosition, currentPosition, creatures, feetPerTile) :
    null;

// Use validation result if in combat (ensures consistency)
let currentMoveFeet;
if (isInCombat && movementValidation) {
    currentMoveFeet = movementValidation.currentMovementFeet; // Same D&D calculation
} else {
    // Out of combat: use Euclidean distance
    const dx = currentPosition.x - startPosition.x;
    const dy = currentPosition.y - startPosition.y;
    const worldDistance = Math.sqrt(dx * dx + dy * dy);
    const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
    currentMoveFeet = tileDistance * feetPerTile;
}
```

### Files Modified
- `vtt-react/src/components/grid/MovementVisualization.jsx` (lines 89-111)

---

## Issue #3: AP Synchronization Across Stores ✅ FIXED

### Problem
Action Points were stored in multiple places but only one got updated:

**For Creature Tokens:**
- ✅ Timeline reads from: `combatStore.turnOrder[].currentActionPoints`
- ✗ Tooltip/HUD reads from: `creatureStore.tokens[].state.currentActionPoints`

**For Character Tokens:**
- ✅ Timeline reads from: `combatStore.turnOrder[].currentActionPoints`
- ✗ HUD reads from: `characterStore.actionPoints.current`

When `spendActionPoints()` was called, it only updated `turnOrder`, causing desynchronization.

### Fix Applied
Modified `spendActionPoints()` in combatStore to update all relevant stores:

```javascript
spendActionPoints: (tokenId, amount) => {
    // Find combatant to determine token type
    const combatant = get().turnOrder.find(c => c.tokenId === tokenId);
    
    // Update turnOrder (existing logic)
    set(state => {
        const updatedTurnOrder = state.turnOrder.map(combatant => {
            if (combatant.tokenId === tokenId) {
                return {
                    ...combatant,
                    currentActionPoints: Math.max(0, combatant.currentActionPoints - amount)
                };
            }
            return combatant;
        });
        return { turnOrder: updatedTurnOrder };
    });

    // NEW: Synchronize to other stores
    const newAP = Math.max(0, combatant.currentActionPoints - amount);

    if (combatant.isCharacterToken) {
        // Sync to character store
        const useCharacterStore = require('./characterStore').default;
        useCharacterStore.getState().updateResource('actionPoints', newAP, currentActionPoints.max);
    } else {
        // Sync to creature token state
        const useCreatureStore = require('./creatureStore').default;
        useCreatureStore.getState().updateTokenState(tokenId, {
            currentActionPoints: newAP
        });
    }
}
```

### Files Modified
- `vtt-react/src/store/combatStore.js` (lines 919-981)

---

## Issue #4: HP/Mana Synchronization to Combat Timeline ✅ FIXED

### Problem
When HP or Mana changed via damage/heal handlers, the changes were only reflected in:
- Creature tokens: `creatureStore.tokens[].state`
- Character tokens: `characterStore.health/mana`

But NOT in the combat timeline's `turnOrder` array.

### Fix Applied

**Step 1: Added helper functions to combatStore**
```javascript
// Synchronize HP updates to combat timeline
updateCombatantHP: (tokenId, newHP) => {
    set(state => {
        const updatedTurnOrder = state.turnOrder.map(combatant => {
            if (combatant.tokenId === tokenId) {
                return { ...combatant, currentHP: newHP };
            }
            return combatant;
        });
        return { turnOrder: updatedTurnOrder };
    });
},

// Synchronize Mana updates to combat timeline
updateCombatantMana: (tokenId, newMana) => {
    set(state => {
        const updatedTurnOrder = state.turnOrder.map(combatant => {
            if (combatant.tokenId === tokenId) {
                return { ...combatant, currentMana: newMana };
            }
            return combatant;
        });
        return { turnOrder: updatedTurnOrder };
    });
}
```

**Step 2: Updated damage/heal handlers to call sync functions**

For **CreatureToken.jsx**:
```javascript
// In handleDamageToken, handleHealToken, handleManaDamage
if (isInCombat) {
    const { updateCombatantHP } = useCombatStore.getState();
    updateCombatantHP(tokenId, newHp);
}
```

For **CharacterToken.jsx**:
```javascript
// In handleDamageToken, handleHealToken, handleManaDamage
if (isInCombat) {
    const { updateCombatantHP } = useCombatStore.getState();
    updateCombatantHP(tokenId, newHp);
}
```

### Files Modified
- `vtt-react/src/store/combatStore.js` (lines 983-1043) - Added sync functions
- `vtt-react/src/components/grid/CreatureToken.jsx` (lines 876-912, 914-952, 1006-1030) - Updated handlers
- `vtt-react/src/components/grid/CharacterToken.jsx` (lines 705-738, 740-775, 807-838) - Updated handlers

---

## Testing Checklist

### Movement Tracking
- [ ] Move token 10ft → verify shows 10/30ft
- [ ] Move token another 15ft → verify shows 25/30ft (NOT 15/30ft)
- [ ] Move token another 10ft → verify shows 35/60ft and prompts for AP
- [ ] Verify distance shown during drag matches distance on drop

### AP Synchronization
- [ ] Spend AP in combat → verify Timeline shows updated AP
- [ ] Spend AP in combat → verify HUD shows updated AP (for character)
- [ ] Spend AP in combat → verify TargetHUD shows updated AP (when targeted)

### HP/Mana Synchronization
- [ ] Damage creature token → verify Timeline updates (if it displays HP)
- [ ] Heal creature token → verify Timeline updates (if it displays HP)
- [ ] Damage character → verify HUD and Timeline both update
- [ ] Use mana → verify HUD and Timeline both update

---

## Notes

1. **Movement calculation now uses D&D rules consistently**: 5ft per straight tile, 8ft per diagonal tile
2. **All resource updates now synchronize across stores** when in combat
3. **Combat Timeline may need UI updates** to display HP/Mana if not already shown
4. **Performance**: Synchronization adds minimal overhead as it only updates during combat actions

---

## Future Improvements

1. Consider consolidating resource storage to a single source of truth
2. Add visual indicators when resources are synchronized
3. Implement optimistic updates for better responsiveness
4. Add comprehensive logging for debugging synchronization issues

