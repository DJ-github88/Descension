# Movement Confirmation System - Testing Instructions

## Overview
The movement confirmation system ensures that tokens in combat must spend Action Points (AP) to move, with popups appearing at the correct times to confirm movement and AP expenditure.

## Expected Behavior

### First Movement of Turn
- When a token moves for the first time in a turn, a popup should appear
- Popup should ask to spend 1 AP to unlock movement up to the creature's speed
- Upon confirmation, AP is deducted and movement is unlocked for the turn
- Token can then move freely within the unlocked movement range

### Subsequent Movement
- After first movement is confirmed, token can move freely within remaining movement
- No popup should appear for movement within the unlocked range
- Movement accumulates across multiple moves in the same turn

### Exceeding Movement Limits
- When total movement exceeds creature's base speed, popup should appear
- Popup asks to spend additional AP for extended movement (typically double speed)
- Upon confirmation, additional AP is deducted

### AP Deduction
- AP should be deducted from both combat timeline and token tooltips
- Changes should be visible immediately after confirmation

## Testing Steps

### Setup
1. Open the application at http://localhost:3001
2. Create or load creatures with different movement speeds
3. Place tokens on the grid
4. Start combat to enter combat mode

### Test 1: First Movement Confirmation
1. Select a token whose turn it is (should have golden border)
2. Drag the token to a new position (within movement range)
3. **Expected**: Popup should appear asking to spend 1 AP
4. Click "Confirm" 
5. **Expected**: AP deducted, token moves, no popup for subsequent moves within range

### Test 2: Free Movement After Unlock
1. After confirming first movement, drag the same token again
2. Stay within remaining movement range
3. **Expected**: No popup, token moves freely

### Test 3: Exceeding Movement Limits
1. Drag token beyond its base movement speed
2. **Expected**: Popup asking for additional AP
3. Confirm movement
4. **Expected**: Additional AP deducted, extended movement unlocked

### Test 4: Turn Transitions
1. End current turn and start next turn
2. Try moving the new active token
3. **Expected**: First movement popup should appear again

## Debug Commands
Open browser console and use these commands for debugging:

```javascript
// Check current combat state
debugCombat.checkState();

// Reset movement state for testing
debugCombat.resetMovement();

// Test specific token movement state
debugCombat.testMovementConfirmation('token-id-here');

// Force unlock movement for testing
debugCombat.forceUnlockMovement('token-id-here');

// Clear movement data for a token
debugCombat.clearMovementData('token-id-here');

// Force show movement dialog for testing
debugCombat.forceShowMovementDialog('token-id-here');

// Simulate first movement (clears movement state)
debugCombat.simulateFirstMovement('token-id-here');
```

## SYSTEMATIC DEBUGGING STEPS

### Step 1: Test System Components
```javascript
// Test the entire movement system
debugCombat.debugMovementSystem();

// Test movement validation directly
debugCombat.testMovementValidation('token-id', {x: 100, y: 100}, {x: 150, y: 150});

// Force show dialog to test UI
debugCombat.forceShowMovementDialog('any-token-id');
```

### Step 2: Test First Movement Detection
```javascript
// Clear movement state for a token
debugCombat.simulateFirstMovement('current-turn-token-id');

// Check state after clearing
debugCombat.checkState();

// Now drag the token - popup MUST appear
```

### Step 3: Test Movement Calculation
```javascript
// Test different directions
debugCombat.testMovementValidation('token-id', {x: 100, y: 100}, {x: 150, y: 100}); // Right
debugCombat.testMovementValidation('token-id', {x: 100, y: 100}, {x: 50, y: 100});  // Left
debugCombat.testMovementValidation('token-id', {x: 100, y: 100}, {x: 100, y: 150}); // Down
debugCombat.testMovementValidation('token-id', {x: 100, y: 100}, {x: 150, y: 150}); // Diagonal
```

### Step 4: Monitor Console Logs
Look for these specific log patterns:
- `🔍 VALIDATE MOVEMENT CALLED` - Validation function is being called
- `🔒 FIRST MOVEMENT CONFIRMED` - First movement logic is working
- `🚨 CONFIRMATION NEEDED` - Dialog should be triggered
- `🚨 Dialog IS OPEN` - Dialog component is rendering
- `💰 SPENDING ACTION POINTS` - AP deduction is working

## Common Issues to Check

1. **Popup not appearing**: Check console for validation logs starting with 🎯 and 🔒
2. **AP not deducting**: Check if confirmation handler is being called
3. **Movement not accumulating**: Check turnMovementUsed map in debug state
4. **Turn start positions**: Ensure positions are recorded when turns begin

## Console Log Patterns

Look for these console messages:
- `🔒 FIRST MOVEMENT DETECTED` - First movement validation
- `⚡ EXCESS MOVEMENT DETECTED` - Movement exceeding limits  
- `🎯 MOVEMENT VALIDATION RESULT` - Validation results
- `💰 CONFIRMING MOVEMENT` - Movement confirmation
- `📍 TURN START POSITION recorded` - Turn position tracking

## Expected Movement Speeds
- Default creature speed: 30 feet
- Default tile size: 5 feet per tile
- First AP unlocks: 30 feet of movement
- Additional AP: +30 feet each (60 feet total with 2 AP)
