# Token Lifecycle Fixes - Implementation Summary

## Fixes Implemented

### 1. Cross-Map Contamination Fix (CRITICAL)

**File:** `vtt-react/src/services/gameStateManager.js` (Lines 138-154)

**Issue:** gameStateManager used `setTokens()` which bypasses map filtering, causing tokens from other maps to appear on the current map.

**Fix:** Changed from `creatureStore.setTokens(tokens)` to iterating and calling `creatureStore.loadToken()` for each token. This ensures map filtering logic (lines 465-469 in creatureStore.js) is applied.

**Before:**
```javascript
creatureStore.setTokens(tokens); // Direct replacement, no map filtering
```

**After:**
```javascript
Object.values(gameState.tokens).forEach(tokenData => {
  const normalizedToken = {
    ...tokenData,
    id: tokenData.id || tokenData.creatureId
  };
  creatureStore.loadToken(normalizedToken); // Map filtering applied
});
```

**Impact:** Prevents cross-map token contamination when loading game state.

---

### 2. Server State Sync Fix

**File:** `server/server.js` (Lines 370-383)

**Issue:** Server `creature_added` event only sent `{ id, creatureId, position, mapId }` without token state, forcing clients to reinitialize from library stats.

**Fix:** Include full `token` and `state` objects in the broadcast.

**Before:**
```javascript
io.to(sid).emit('creature_added', {
  id: tokenId,
  creatureId: data.creatureId,
  position: data.position,
  // NO state included!
  mapId: targetMapId
});
```

**After:**
```javascript
io.to(sid).emit('creature_added', {
  id: tokenId,
  creatureId: data.creatureId,
  token: tokenData,  // Full token data
  state: tokenData.state,  // Explicit state reference
  position: data.position,
  velocity: tokenData.velocity,
  mapId: targetMapId
});
```

**Impact:** Clients receive full token state including HP, Mana, AP, conditions from the creating GM.

---

### 3. Client State Acceptance Fix

**File:** `vtt-react/src/components/multiplayer/MultiplayerApp.jsx` (Lines 2329-2349)

**Issue:** Client ignored state from `creature_added` event and always reinitialized from library.

**Fix:** Check for `token` and `state` in event data, use them if present.

**Before:**
```javascript
// Always used library data, ignoring server state
const creatureData = libraryCreatures.find(c => c.id === creatureId) || { ... };
creatureStore.addCreatureToken(creatureData, position, false, id, true, mapId);
```

**After:**
```javascript
// Use included state if available
let creatureData;
if (token && state) {
  creatureData = token;  // Use full token data from server
} else {
  // Fallback to library lookup
  creatureData = libraryCreatures.find(c => c.id === creatureId) || { ... };
}
creatureStore.addCreatureToken(creatureData, position, false, id, true, mapId);
```

**Impact:** Token state (HP, Mana, AP, conditions) preserved across all clients when GM creates token.

---

### 4. Unified Token State Access

**New File:** `vtt-react/src/utils/tokenStateUtils.js`

**Purpose:** Provide unified interface for accessing token resources across creature and character tokens.

**Functions:**
- `getTokenResources(target, targetType)` - Get HP/Mana/AP with unified structure
- `getTokenConditions(target, targetType)` - Get conditions from token.state
- `getStateKeyForResource(resourceType)` - Map 'health' → 'currentHp', etc.
- `getTempFieldName(resourceType)` - Map 'health' → 'tempHealth', etc.
- `normalizeTokenData(token, targetType)` - Ensure token has proper state structure

**Impact:** Consistent resource access pattern, reduces bugs from divergent structures.

---

### 5. TargetHUD Standardization

**File:** `vtt-react/src/components/hud/TargetHUD.jsx`

**Changes:**

1. **Import unified utilities** (Line 9)
```javascript
import { getTokenResources, getStateKeyForResource, getTempFieldName } from '../../utils/tokenStateUtils';
```

2. **Simplify target data memoization** (Lines 205-257)
```javascript
// Before: Manual state merging
// After: Use unified accessor
const resources = getTokenResources(token || currentTarget, 'creature');
health = resources.health;
mana = resources.mana;
actionPoints = resources.actionPoints;
```

3. **Unify resource updates** (Lines 934-937)
```javascript
// Before: Manual key mapping
const stateKey = resourceType === 'health' ? 'currentHp' : ...;

// After: Use utility
const stateKey = getStateKeyForResource(resourceType);
```

**Impact:** Reduced code duplication, more maintainable, consistent behavior.

---

### 6. Character Token State Consistency

**File:** `vtt-react/src/store/characterTokenStore.js`

**Changes:**

1. **Initialize token.state in addCharacterToken** (Lines 61-77)
```javascript
const newToken = {
  id: uuidv4(),
  isPlayerToken: !playerId,
  playerId: playerId,
  position,
  mapId: resolvedMapId,
  createdAt: Date.now(),
  state: {  // NEW: State for consistency with creature tokens
    conditions: [],
    lastModified: new Date().toISOString()
  }
};
```

2. **Initialize token.state in addCharacterTokenFromServer** (Lines 317-332)
```javascript
const updatedTokens = existingToken
  ? state.characterTokens.map(token => ...)
  : [
    ...state.characterTokens,
    {
      id: tokenId,
      isPlayerToken: false,
      playerId: playerId,
      position,
      mapId: mapId || 'default',
      createdAt: Date.now(),
      state: {  // NEW: State initialization
        conditions: [],
        lastModified: new Date().toISOString()
      }
    }
  ];
```

3. **Initialize token.state in loadCharacterToken** (Lines 345-354)
```javascript
const newToken = {
  ...tokenData,
  id: tokenId,
  position: tokenData.position || { x: 0, y: 0 },
  state: tokenData.state || {  // NEW: Ensure state exists
    conditions: [],
    lastModified: new Date().toISOString()
  }
};
```

4. **Add getTokenResources helper** (Lines 296-313)
```javascript
// Helper for unified resource access (identification only)
getTokenResources: (tokenId) => {
  const state = get();
  const token = state.characterTokens.find(t => t.id === tokenId);
  if (!token) return null;
  return { token };  // Resources fetched from characterStore externally
}
```

**Impact:** Character tokens now have consistent state structure with creature tokens, enabling unified condition handling.

---

### 7. Creature Token Normalization

**File:** `vtt-react/src/store/creatureStore.js`

**Changes:**

1. **Import normalization utility** (Line 13)
```javascript
import { normalizeTokenData } from '../utils/tokenStateUtils';
```

2. **Normalize in addCreatureToken** (Lines 164-184)
```javascript
// Before: Manual state initialization with fallbacks
const initialState = creatureData.state || {
  currentHp: creatureData.stats?.currentHp || ...,
  // ... many fallbacks
};

// After: Unified normalization
const normalizedCreature = normalizeTokenData(creatureData, 'creature');
const newToken = {
  ...normalizedCreature,
  state: forcedState || normalizedCreature.state,
  // ...
};
```

3. **Normalize in loadToken** (Lines 472-486)
```javascript
// Before: Manual state initialization
const newToken = {
  ...tokenData,
  state: tokenData.state || {
    currentHp: tokenData.stats?.maxHp || 10,
    conditions: []
  }
};

// After: Unified normalization
const normalizedToken = normalizeTokenData(tokenData, 'creature');
const newToken = {
  ...normalizedToken,
  state: normalizedToken.state,
  // ...
};
```

**Impact:** Consistent token state structure across all token creation/loading paths.

---

## Testing Checklist

### 1. Cross-Map Contamination
- [ ] GM creates token on Map A
- [ ] Switch to Map B
- [ ] Verify token from Map A does NOT appear on Map B
- [ ] Switch back to Map A
- [ ] Verify token from Map A still exists with correct state

### 2. Server State Sync
- [ ] GM modifies creature library creature (changes HP to 50)
- [ ] GM places token on grid
- [ ] Token appears with HP=50 (from library)
- [ ] GM modifies token HP to 30 in TargetHUD
- [ ] Player joins room
- [ ] Player sees token with HP=30 (not 50 from library)

### 3. Character Token Conditions
- [ ] Player places character token
- [ ] GM adds condition to token (e.g., "Poisoned")
- [ ] Condition appears in TargetHUD
- [ ] Player switches maps
- [ ] Condition persists after map switch
- [ ] GM removes condition
- [ ] Condition disappears from TargetHUD

### 4. Token Loading on Join
- [ ] GM creates multiple tokens across multiple maps
- [ ] Player joins room
- [ ] Verify only tokens on current map appear
- [ ] Switch to another map
- [ ] Verify tokens for that map appear correctly
- [ ] Verify token state (HP, Mana, AP, conditions) is correct

### 5. Resource Updates via TargetHUD
- [ ] Target creature token
- [ ] Modify HP via +/- buttons
- [ ] Verify change reflects immediately
- [ ] Modify Mana via +/- buttons
- [ ] Verify change reflects immediately
- [ ] Modify AP via +/- buttons
- [ ] Verify change reflects immediately

### 6. Auto-Save Not Overriding
- [ ] GM creates token and modifies state
- [ ] Wait for auto-save (30 seconds)
- [ ] Modify token state again
- [ ] Verify latest state is preserved (not overwritten)

---

## Known Limitations

1. **Character Token Resources Still Split**
   - HP/Mana/AP stored in `characterStore` for characters
   - HP/Mana/AP stored in `token.state` for creatures
   - Unified access via `tokenStateUtils.getTokenResources()` abstracts this difference
   - Full unification would require migrating character resources to `token.state`

2. **Backward Compatibility**
   - Existing tokens without `state` object will be normalized on load
   - Old server broadcasts without `token` field still work (library fallback)

---

## Migration Notes

### Database Migration (Optional)

If tokens in Firebase are missing `state` object, they will be auto-normalized on load. No manual migration needed.

### Server Update Required

All instances of the server must be updated to broadcast `token` and `state` in `creature_added` event. Old clients will ignore these fields gracefully.

---

## Performance Impact

- **gameStateManager:** Iterating tokens instead of bulk set - negligible impact (<100 tokens typical)
- **Token normalization:** Single pass through object with spread - minimal overhead
- **State access:** Utility function adds one function call - negligible overhead

---

## Breaking Changes

**None** - All changes are backward compatible:
- Old broadcasts work with library fallback
- Old tokens without state are normalized on load
- Character tokens without state get initialized

---

## Future Improvements

1. **Full Character State Migration**
   - Move character HP/Mana/AP from `characterStore` to `token.state`
   - Enables complete unification of token handling
   - Requires careful data migration

2. **State Change History**
   - Track state changes for audit trail
   - Enable undo/redo for token modifications
   - Requires additional data structure

3. **Optimized State Sync**
   - Send only changed state properties, not full state
   - Reduce bandwidth usage
   - Requires state diffing algorithm

---

## Files Modified

1. `vtt-react/src/services/gameStateManager.js`
2. `server/server.js`
3. `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`
4. `vtt-react/src/components/hud/TargetHUD.jsx`
5. `vtt-react/src/store/characterTokenStore.js`
6. `vtt-react/src/store/creatureStore.js`

## Files Created

1. `vtt-react/src/utils/tokenStateUtils.js`
2. `TOKEN_LIFECYCLE_FIXES.md` (this file)
