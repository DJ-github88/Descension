# Combat Initiator & HUD Fixes

## Issues Fixed

### 1. Combat Initiator Toggle Issue
**Problem**: The combat initiator button was permanently toggled/active once combat started, even after combat ended.

**Root Cause**: The button's active state was checking `(isSelectionMode || isInCombat)`, meaning it stayed active during combat.

**Fix**: Changed the active state logic to only check `isSelectionMode`. The button should only be active during token selection, not during actual combat.

**Files Changed**:
- `src/components/Navigation.jsx` (line 565)

### 2. Missing HUDs on Port 3001
**Problem**: HUDs (Party HUD, Target HUD) were not showing on localhost:3001 but were visible on localhost:3000.

**Root Cause**: The PartyHUD component only renders when `isInParty` is true, but by default users are not in a party. Different ports had different localStorage states.

**Fix**: Added auto-party creation in PartyHUD component so HUDs always display.

**Files Changed**:
- `src/components/hud/PartyHUD.jsx` (lines 656-661)

### 3. Port Configuration Differences
**Explanation**: 
- Port 3000: Uses `start-legacy.bat` → `npx react-scripts start` (default port 3000)
- Port 3001: Uses `start-port-3001.bat` → `npx react-scripts start --port 3001`
- The `package.json` has `"start": "start-port-3001.bat"` so `npm start` defaults to port 3001

## Debugging Tools

### Clear Combat State Script
If you get stuck in combat or have other state issues:

1. Open browser console (F12)
2. Copy and paste the contents of `clear-combat-state.js`
3. Run the script to clear stuck combat state
4. For nuclear option, run `clearAllGameState()` to clear all game data
5. Refresh the page

### Manual localStorage Clearing
You can also manually clear localStorage:
```javascript
// Clear specific stores
localStorage.removeItem('combat-store');
localStorage.removeItem('party-store');

// Or clear everything
localStorage.clear();
```

## Testing

1. **Combat Toggle**: Click the combat initiator (X button) - it should only be active during token selection
2. **HUDs**: Party HUD should now auto-appear on both ports
3. **Combat Flow**: Start combat → button becomes inactive → end combat → button becomes clickable again

## Notes

- The auto-party creation ensures HUDs are always visible for single-player use
- Combat state is persisted in localStorage, so clearing it may be needed if you get stuck
- Both ports should now behave identically regarding HUDs and combat state
