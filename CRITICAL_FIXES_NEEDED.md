# Critical Bugs - Need Immediate Fix

## ✅ Fixed Today:
1. Offline rooms filtering
2. Token drag/drop desync
3. Player token placement
4. Syntax errors (gridCoords, finalWorldPos)

## 🔴 CRITICAL ERRORS (Blocking):

### 1. Store Undefined Errors
**Error:** `Cannot read properties of undefined (reading 'characterTokens')`
**Location:** Multiple stores (characterTokenStore, combatStore)
**Impact:** App crashes, infinite error loop

**Likely Cause:** 
- Stores being accessed before initialization
- Circular dependency issues
- Store not properly exported/imported

**Fix Needed:**
- Add defensive checks: `?.characterTokens` or `|| []`
- Ensure stores are initialized before use
- Check import statements

### 2. removeUser Function Missing  
**Error:** `removeUser is not a function`
**Location:** `MultiplayerApp.jsx:3925`
**Impact:** Can't handle player disconnects

**Fix Needed:**
- Import `removeUser` from the correct store
- Or implement the function if missing

### 3. New Rooms Show Old Tokens
**Error:** Tokens from previous sessions appear in new rooms
**Impact:** Data persistence bug, confusing UX

**Fix Needed:**
- Clear all game state when creating/joining new room
- Reset stores: characterTokenStore, creatureStore, gridItemStore
- Implement room state isolation

### 4. Player Can't Move Own Token
**Error:** "Cannot move character token - NOT OWNER"  
**Impact:** Players can't interact with their tokens

**Fix Needed:**
- Debug ownership check logic
- Ensure `tokenPlayerId` matches `characterName`
- Log ownership details to console for debugging

## Recommended Actions:

1. **IMMEDIATE:** Fix store undefined errors (add defensive checks)
2. **HIGH:** Add `removeUser` function or import
3. **HIGH:** Clear state on room create/join
4. **MEDIUM:** Debug player token ownership

## Notes:
- Railway doesn't need updating yet - these are frontend-only issues
- Stores need initialization guards
- Consider adding error boundaries to prevent cascade failures
