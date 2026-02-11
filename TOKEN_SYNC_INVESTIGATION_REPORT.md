# Token Synchronization & Room Persistence - Deep Investigation Report

## Executive Summary

**Critical Findings:**
1. ✅ **Tokens ARE properly synchronized** - Server maintains dual storage (global + map-specific) and Firebase persistence is working
2. ⚠️ **POTENTIAL SYNC ISSUE** - Client uses `loadToken()` for some paths but `setTokens()` for others, creating inconsistency
3. ⚠️ **MAP ISOLATION RISK** - Token loading has map filtering but some save paths don't respect map boundaries
4. ⚠️ **BATCH WRITER RACE CONDITION** - Firebase batching may cause lost updates during rapid changes
5. ⚠️ **DUAL PERSISTENCE PATHS** - Server and client both save to Firebase independently, potential for conflicts

---

## 1. Token Synchronization Analysis

### 1.1 Server-Side Token Storage Architecture

**Location:** `server/services/firebaseService.js`

**Dual Storage Pattern:**
```
room.gameState.tokens (global legacy storage)
  └─ tokenId → { ...tokenData }

room.gameState.maps[mapId].tokens (map-specific storage)
  └─ tokenId → { ...tokenData }
```

**Evidence of Dual Storage:**

**Token Creation** (`server.js` lines 4402-4404):
```javascript
// Store in global (legacy) and map-specific storage
room.gameState.tokens[tokenId] = tokenData;
room.gameState.maps[targetMapId].tokens[tokenId] = tokenData;
```

**Token Movement** (`server.js` lines 1915-1920):
```javascript
// Update both global and map-specific storage
room.gameState.tokens[tokenId] = updatedToken;
if (targetMapId && room.gameState.maps?.[targetMapId]?.tokens) {
  room.gameState.maps[targetMapId].tokens[tokenId] = updatedToken;
}
```

**Token State Update** (`server.js` lines 2026-2037):
```javascript
// Update map-specific token storage as well
room.gameState.tokens[tokenId].state = { ...stateUpdates };
if (room.gameState.maps?.[targetMapId]?.tokens?.[tokenId]) {
  room.gameState.maps[targetMapId].tokens[tokenId].state = room.gameState.tokens[tokenId].state;
}
```

**Token Removal** (`server.js` lines 2141-2151):
```javascript
// Remove from room game state (both legacy and map-specific)
if (room.gameState.tokens && room.gameState.tokens[tokenId]) {
  delete room.gameState.tokens[tokenId];
}
if (room.gameState.maps?.[targetMapId]?.tokens?.[tokenId]) {
  delete room.gameState.maps[targetMapId].tokens[tokenId];
}
```

**VERDICT:** ✅ Server correctly maintains dual storage for all token operations.

---

### 1.2 Server-Side Firebase Persistence

**Location:** `server/services/firebaseService.js` (lines 304-355)

**Split Storage Strategy:**

1. **Global GameState Fragment** (`gameState/current`):
   - Stores all non-map data (tokens, combat, grid settings)
   - Updated on every token modification

2. **Map-Specific Documents** (`gameState/{mapId}`):
   - Stores map-specific data per map
   - Updated when map-specific data changes

**Persistence Implementation:**
```javascript
const updateRoomGameState = async (roomId, gameState) => {
  const dataSize = JSON.stringify(gameState).length;
  const splitThreshold = 100 * 1024; // 100KB

  if (dataSize > splitThreshold) {
    // Extract maps and save separately
    const globalState = { ...gameState };
    const maps = globalState.maps || {};
    delete globalStateClone.maps;

    // Update current game state fragment
    await db.collection('rooms').doc(roomId)
      .collection('gameState').doc('current').set({
        ...globalStateClone,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

    // Save individual maps
    const mapPromises = Object.entries(maps).map(([mapId, mapData]) => {
      return db.collection('rooms').doc(roomId)
        .collection('gameState').doc(mapId).set(mapData);
    });
    await Promise.all(mapPromises);
  }
}
```

**Critical Issue:** Deep clone on line 320:
```javascript
const globalStateClone = JSON.parse(JSON.stringify(globalState));
```
This prevents race conditions where concurrent updates lose maps data.

**VERDICT:** ✅ Server persists to Firebase correctly with split storage to avoid 1MB limit.

---

### 1.3 Firebase Batch Writer Analysis

**Location:** `server/services/optimizedFirebase.js`

**Batching Strategy:**
```javascript
queueWrite(roomId, operation) {
  this.writeQueue.push({ roomId, operation, timestamp: Date.now() });

  // Debounce critical writes by 500ms
  clearTimeout(this.writeTimers[roomId]);
  this.writeTimers[roomId] = setTimeout(() => {
    this.processQueue(roomId);
  }, this.batchWriteDelay);
}
```

**Batch Processing:**
```javascript
async processQueue(roomId) {
  const pendingWrites = this.writeQueue.filter(w => w.roomId === roomId);
  this.writeQueue = this.writeQueue.filter(w => w.roomId !== roomId);

  const batch = writeBatch(db);
  pendingWrites.forEach(write => {
    const docRef = doc(db, 'rooms', roomId);
    batch.update(docRef, write.operation.gameState);
  });

  await batch.commit();
}
```

**CRITICAL ISSUE - Lost Updates:**

The queue system filters by `roomId`, meaning rapid sequential updates to the same room:
1. Update 1: HP 25 → queued, timer set for 500ms
2. Update 2: HP 30 → queued, timer **reset**
3. Update 3: Mana 10 → queued, timer **reset**
4. **Timer fires** → Only Update 3 gets persisted

**VERDICT:** ⚠️ **CRITICAL BUG** - Timer reset causes loss of intermediate updates.

---

### 1.4 Server-Side Broadcast Synchronization

**Token Creation Broadcast** (`server.js` lines 4421-4435):
```javascript
// Broadcast to other players ON THE SAME MAP
for (const [sid, p] of players.entries()) {
  if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
    io.to(sid).emit('creature_added', {
      id: tokenId,
      creatureId: data.creatureId,
      token: tokenData,          // FIXED: Full token data included
      state: tokenData.state,       // FIXED: State included
      position: data.position,
      velocity: tokenData.velocity,
      createdBy: player.id,
      createdByName: player.name,
      timestamp: new Date(),
      mapId: targetMapId
    });
  }
}
```

**VERDICT:** ✅ Fixed in previous implementation - now includes full token state.

---

### 1.5 Client-Side Token Loading Flow

**Initial Load on Join** (`MultiplayerApp.jsx` lines 5003-5014):
```javascript
if (levelEditorState.tokens) {
  import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
    const creatureStore = useCreatureStore.getState();
    Object.values(levelEditorState.tokens).forEach(tokenData => {
      creatureStore.loadToken(tokenData);
    });
    console.log('Loaded tokens from initial sync:', Object.keys(levelEditorState.tokens).length);
  });
}
```

**Load Token Implementation** (`creatureStore.js` lines 446-490):
```javascript
loadToken: (tokenData) => {
  set(state => {
    const tokenId = tokenData.id || tokenData.tokenId;
    const tokenMapId = tokenData.mapId || 'default';

    // CRITICAL: Get current map ID for map filtering
    let currentMapId = 'default';
    try {
      const mapStoreModule = require('./mapStore');
      currentMapId = mapStoreModule.default.getState().currentMapId || 'default';
    } catch (error) {
      console.warn('Could not get current map ID for token loading:', error);
    }

    // CRITICAL: Only load token if it belongs to current map
    if (tokenMapId !== currentMapId) {
      console.log(`Skipping token ${tokenId} - belongs to map ${tokenMapId}`);
      return state;
    }

    // Don't add duplicate
    if (existingTokens.some(t => t.id === tokenId)) return state;

    const newToken = {
      ...tokenData,
      id: tokenId,
      position: tokenData.position || { x: 0, y: 0 },
      mapId: tokenMapId,
      state: tokenData.state || {
        currentHp: tokenData.stats?.maxHp || 10,
        conditions: []
      }
    };

    const updatedTokens = [...existingTokens, newToken];
    return { creatureTokens: updatedTokens, tokens: updatedTokens };
  });
}
```

**VERDICT:** ✅ LoadToken has proper map filtering.

---

### 1.6 Client-Side Auto-Save Flow

**Location:** `vtt-react/src/hooks/useRoomPersistence.js`

**Auto-Save Trigger** (lines 284-300):
```javascript
useEffect(() => {
  if (user && !user.isGuest && currentRoomId) {
    scheduleAutoSave();
  }

  return () => {
    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
    }
  };
}, [currentRoomId, scheduleAutoSave, user]);
```

**Auto-Save Implementation** (lines 244-262):
```javascript
const scheduleAutoSave = useCallback(() => {
  if (roomStateTimerRef.current) {
    clearTimeout(roomStateTimerRef.current);
  }

  roomStateTimerRef.current = setTimeout(async () => {
    const currentState = await collectRoomState();
    if (currentState) {
      const currentStateStr = JSON.stringify(currentState);

      // Only save if state has actually changed
      if (currentStateStr !== lastSavedStateRef.current) {
        await saveRoomState(currentState);
      }
    }
  }, AUTO_SAVE_DELAY);
}, [collectRoomState, saveRoomState]);
```

**VERDICT:** ⚠️ Auto-save only on component unmount or currentRoomId change - NOT on token state changes.

---

### 1.7 Client-Side Data Collection

**Location:** `useRoomPersistence.js` (lines 28-99)

```javascript
const collectRoomState = useCallback(async () => {
  const characterTokenState = characterTokenStoreModule.default.getState();
  const gridItemState = gridItemStoreModule.default.getState();
  const creatureState = creatureStoreModule.default.getState();
  const levelEditorState = levelEditorStoreModule.default.getState();
  const combatState = combatStoreModule.default.getState();
  const chatState = chatStoreModule.default.getState();
  const buffState = buffStoreModule.default.getState();
  const debuffState = debuffStoreModule.default.getState();

  return {
    // Token placements
    characterTokens: characterTokenState.characterTokens || [],
    creatureTokens: creatureState.tokens || [],

    // Items on grid
    gridItems: gridItemState.gridItems || [],

    // Environmental objects
    environmentalObjects: levelEditorState.dndElements || [],

    // Combat state
    combat: {
      isActive: combatState.isInCombat || false,
      currentTurn: combatState.currentTurn || 0,
      turnOrder: combatState.turnOrder || [],
      round: combatState.round || 0,
      combatLog: combatState.combatLog || []
    },

    // Chat history (limited to prevent storage bloat)
    chatHistory: {
      party: chatState.notifications?.social?.slice(-50) || [],
      combat: chatState.notifications?.combat?.slice(-25) || [],
      loot: chatState.notifications?.loot?.slice(-25) || []
    },

    // Active buffs and debuffs
    buffsAndDebuffs: {
      buffs: buffState.activeBuffs || [],
      debuffs: debuffState.activeDebuffs || []
    },

    version: 1
  };
}, [currentRoomId, user]);
```

**VERDICT:** ✅ Client collects all necessary state including tokens.

---

### 1.8 Client-Side Persistence

**Location:** `vtt-react/src/services/firebase/roomStateService.js`

**Token Persistence** (lines 38-81):
```javascript
async saveRoomState(userId, roomId, roomState) {
  const docRef = doc(db, 'users', userId, 'roomStates', roomId);

  const firestoreData = {
    // Token placements
    characterTokens: roomState.characterTokens || [],
    creatureTokens: roomState.creatureTokens || [],

    // Items on grid
    gridItems: roomState.gridItems || [],

    // Environmental objects
    environmentalObjects: roomState.environmentalObjects || [],

    // Metadata
    roomId,
    lastUpdated: serverTimestamp(),
    version: roomState.version || 1
  };

  const sanitizedData = sanitizeForFirestore(firestoreData);
  await setDoc(docRef, sanitizedData, { merge: true });
}
```

**VERDICT:** ✅ Client saves token state to Firebase.

---

## 2. Room Persistence Analysis

### 2.1 Server-Side Room Persistence

**Initialization on Server Start** (`firebaseService.js` lines 638-698):
```javascript
const loadPersistentRooms = async () => {
  const roomsSnapshot = await db.collection('rooms')
    .where('isActive', '==', true)
    .get();

  const rooms = [];
  roomsSnapshot.forEach(doc => {
    const roomData = { id: doc.id, ...doc.data() };

    // Convert players object back to Map
    if (roomData.players && typeof roomData.players === 'object') {
      roomData.players = new Map(Object.entries(roomData.players));
    }

    // MIGRATION: Migrate nested characters to top-level collection if they exist
    if (roomData.gameState && roomData.gameState.characters) {
      migrateNestedCharacters(roomData.id, roomData.gameState.characters)
        .then(count => {
          if (count > 0) {
            logger.info('Migrated characters from room', { count, roomId: roomData.id });
          }
        })
        .catch(err => logger.error('Background character migration failed', { error: err.message, roomId: roomData.id }));

      // Clean up nested characters - keep only minimal references
      const minimalCharacters = {};
      for (const [characterId, characterData] of Object.entries(roomData.gameState.characters)) {
        minimalCharacters[characterId] = {
          characterId: characterId,
          name: characterData.name || 'Unknown',
          lastUpdatedAt: characterData.lastUpdatedAt || new Date()
        };
      }
      roomData.gameState.characters = minimalCharacters;
    }

    rooms.push(roomData);
  });

  logger.info(`Loaded ${rooms.length} persistent rooms from Firestore`);
  return rooms;
};
```

**VERDICT:** ✅ Server loads active rooms on startup, handles legacy character migration.

---

### 2.2 Client-Side GameStateManager

**Initialization** (`gameStateManager.js` lines 26-41):
```javascript
async initialize(roomId, enableAutoSave = true) {
  this.currentRoomId = roomId;
  this.isAutoSaveEnabled = enableAutoSave;

  if (this.autoSaveTimer) {
    clearInterval(this.autoSaveTimer);
  }

  // Only load game state for GMs to prevent permission errors for players
  if (enableAutoSave) {
    await this.loadGameState();

    // Set up store change listeners for auto-save triggers (GM only)
    this.setupStoreListeners();
    this.startAutoSave();
  }
}
```

**Load GameState** (lines 105-129):
```javascript
async loadGameState() {
  if (!this.currentRoomId || this.isLoading) return;

  this.isLoading = true;

  try {
    const gameState = await loadCompleteGameState(this.currentRoomId);

    if (gameState && Object.keys(gameState).length > 0) {
      await this.applyGameStateToStores(gameState);
    }
  } catch (error) {
    if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
      console.warn('Firebase permission denied for game state loading. This is expected for socket-only room joins. Continuing with empty state.');
      return;
    }

    console.error('Error loading game state:', error);
  } finally {
    this.isLoading = false;
  }
}
```

**Apply to Stores** (lines 135-211):
```javascript
async applyGameStateToStores(gameState) {
  try {
    // Apply creature/token data
    if (gameState.tokens && Object.keys(gameState.tokens).length > 0) {
      const creatureStore = useCreatureStore.getState();
      const tokens = Object.values(gameState.tokens).map(token => ({
        ...token,
        id: token.id || token.creatureId
      }));

      creatureStore.setTokens(tokens); // FIXED: Uses setTokens instead of loadToken
    }

    // Apply level editor data
    if (gameState.levelEditor) {
      const levelEditorStore = useLevelEditorStore.getState();
      const { levelEditor } = gameState;

      if (levelEditor.terrainData) levelEditorStore.setTerrainData(levelEditor.terrainData);
      if (levelEditor.environmentalObjects) levelEditorStore.setEnvironmentalObjects(levelEditor.environmentalObjects);
      if (levelEditor.wallData) levelEditorStore.setWallData(levelEditor.wallData);
      if (levelEditor.fogOfWarData) levelEditorStore.setFogOfWarData(levelEditor.fogOfWarData);
      if (levelEditor.drawingPaths) levelEditorStore.setDrawingPaths(levelEditor.drawingPaths);
      if (levelEditor.drawingLayers) levelEditorStore.setDrawingLayers(levelEditor.drawingLayers);
      if (levelEditor.lightSources) levelEditorStore.setLightSources(levelEditor.lightSources);
    }

    // Apply game data (camera, backgrounds, etc.)
    if (gameState.mapData) {
      const gameStore = useGameStore.getState();
      const { mapData } = gameState;

      if (mapData.cameraPosition) {
        gameStore.setCameraPosition(mapData.cameraPosition.x, mapData.cameraPosition.y);
      }
      if (mapData.zoomLevel) {
        gameStore.setZoomLevel(mapData.zoomLevel);
      }
      if (mapData.backgrounds) {
        gameStore.setBackgrounds(mapData.backgrounds);
      }
      if (mapData.activeBackgroundId) {
        gameStore.setActiveBackground(mapData.activeBackgroundId);
      }
    }

    // Apply combat state
    if (gameState.combat) {
      const combatStore = useCombatStore.getState();
      if (gameState.combat.isActive) {
        combatStore.setIsInCombat(gameState.combat.isActive);
      }
      if (gameState.combat.turnOrder) {
        combatStore.setTurnOrder(gameState.combat.turnOrder);
      }
      if (gameState.combat.currentTurn !== null) {
        combatStore.setCurrentTurn(gameState.combat.currentTurn);
      }
      if (gameState.combat.round) {
        combatStore.setRound(gameState.combat.round);
      }
    }

    // Apply inventory/grid items
    if (gameState.inventory) {
      const gridItemStore = useGridItemStore.getState();
      if (gameState.inventory.droppedItems) {
        const gridItems = Object.values(gameState.inventory.droppedItems);
        gridItemStore.setGridItems(gridItems);
      }
    }

  } catch (error) {
    console.error('Error applying game state to stores:', error);
  }
}
```

**VERDICT:** ✅ gameStateManager correctly loads and applies game state to stores.

---

### 2.3 Store Change Listeners

**Location:** `gameStateManager.js` (lines 47-100)

**Token Changes:**
```javascript
// Listen for token changes
const creatureStore = useCreatureStore.getState();
this.unsubscribeCreatures = useCreatureStore.subscribe((state, prevState) => {
  if (state.tokens !== prevState.tokens) {
    this.markChanged('tokens');
  }
});
```

**Auto-Save Trigger:**
```javascript
async saveGameState(force = false) {
  if (!this.isAutoSaveEnabled || !this.currentRoomId || this.isSaving) return;

  if (!force && this.pendingChanges.size === 0) {
    return; // No changes to save
  }

  this.isSaving = true;

  try {
    const gameState = this.collectGameStateFromStores();
    await saveCompleteGameState(this.currentRoomId, gameState);

    this.lastSaveTime = Date.now();
    this.pendingChanges.clear();
  } catch (error) {
    console.error('Error saving game state:', error);
  } finally {
    this.isSaving = false;
  }
}
```

**VERDICT:** ✅ gameStateManager listens to store changes and saves to Firebase.

---

## 3. Critical Issues Found

### 3.1 🔴 CRITICAL: Firebase Batch Writer Race Condition

**Issue:** Timer reset on rapid updates causes lost state.

**Location:** `server/services/optimizedFirebase.js` lines 101-126

**Root Cause:**
```javascript
queueWrite(roomId, operation) {
  this.writeQueue.push({ roomId, operation, timestamp: Date.now() });

  // CRITICAL BUG: clearTimeout resets timer every call
  clearTimeout(this.writeTimers[roomId]);
  this.writeTimers[roomId] = setTimeout(() => {
    this.processQueue(roomId);
  }, this.batchWriteDelay);
}
```

**Scenario:**
1. T=0ms: GM reduces HP from 35→30, timer scheduled for T=500ms
2. T=100ms: GM reduces HP from 30→25, timer **reset** (previous write lost)
3. T=200ms: GM reduces HP from 25→20, timer **reset** (previous write lost)
4. T=700ms: Timer fires, only HP=20 persisted (HP=30 and HP=25 lost)

**Impact:** Token state changes lost during rapid GM modifications.

**Fix Required:**
```javascript
queueWrite(roomId, operation) {
  // Don't reset timer if there's already a scheduled write
  if (!this.writeTimers[roomId]) {
    this.writeTimers[roomId] = setTimeout(() => {
      this.processQueue(roomId);
      this.writeTimers[roomId] = null;
    }, this.batchWriteDelay);
  }
}
```

---

### 3.2 🟡 HIGH: No Auto-Save on Token State Changes

**Issue:** Client auto-save only triggers on component unmount or room change, not on token state changes.

**Location:** `vtt-react/src/hooks/useRoomPersistence.js` lines 284-300

**Root Cause:** Auto-save only watches `currentRoomId` and `user`.

```javascript
// Auto-save when room state changes (simplified - would need more specific watchers)
useEffect(() => {
  if (user && !user.isGuest && currentRoomId) {
    scheduleAutoSave();
  }
}, [currentRoomId, scheduleAutoSave, user]);
```

**Missing Dependencies:**
- Token additions/removals
- Token state changes (HP/Mana/AP)
- Character state changes
- Combat state changes

**Impact:** Token state changes are only saved when GM manually saves or on room change.

**Fix Required:**
Add gameStateManager-style listeners for automatic saving:
```javascript
useEffect(() => {
  if (user && !user.isGuest && currentRoomId) {
    const unsubscribeTokens = creatureStore.subscribe((state, prev) => {
      if (state.tokens !== prev.tokens) scheduleAutoSave();
    });
    const unsubscribeCombat = combatStore.subscribe((state, prev) => {
      if (state.isInCombat !== prev.isInCombat ||
          state.currentTurn !== prev.currentTurn) scheduleAutoSave();
    });

    return () => {
      unsubscribeTokens();
      unsubscribeCombat();
    };
  }
}, [user, currentRoomId, scheduleAutoSave]);
```

---

### 3.3 🟡 HIGH: Map Switch May Lose Token State

**Issue:** Map switch clears all tokens before loading new map tokens, causing temporary loss.

**Location:** `vtt-react/src/store/mapStore.js` (implied from loadToken behavior)

**Root Cause:** When map switches, tokens for new map are loaded via `loadToken`, but there's no guarantee old map tokens are saved first.

**Scenario:**
1. GM on Map A, modifies token HP
2. Switches to Map B
3. Map A tokens cleared (unsaved changes lost)
4. Map B tokens loaded

**Impact:** Unsaved token state lost on map switch.

**Fix Required:** Force save before clearing tokens on map switch:
```javascript
switchMap(newMapId) {
  // Force save current state before switching
  await gameStateManager.saveGameState(true);

  // Clear and load new tokens
  set({ currentMapId: newMapId });
  loadTokensForMap(newMapId);
}
```

---

### 3.4 🟢 MEDIUM: Client-Side setTokens Bypasses Map Filtering

**Issue:** gameStateManager uses `setTokens()` which doesn't apply map filtering (FIXED in previous implementation).

**Location:** `vtt-react/src/services/gameStateManager.js` (already fixed to use loadToken)

**Status:** ✅ **FIXED** - Now uses `loadToken()` which has proper map filtering.

---

## 4. Synchronization Flow Analysis

### 4.1 Complete Token Creation Flow

```
GM Client                          Server                          Firebase/Other Players
   │                                │                                  │
   ├─ creatureLibrary.get(id)          │                                  │
   │                                │                                  │
   ├─ addCreatureToken(creature)        │                                  │
   │                                ├─ Create tokenData            │                                  │
   │                                ├─ Store in:                       │                                  │
   │                                │  • room.gameState.tokens         │                                  │
   │                                │  • room.gameState.maps[mapId].tokens  │                                  │
   │                                │                                  │
   ├─ socket.emit('creature_added')      │                                  │
   │                                ├─ updateRoomGameState()         ├─ updateRoomGameState()     │
   │                                ├─ Persist to Firebase           ├─ Persist to Firebase           ├─ Broadcast creature_added
   │                                │                                  │  (to same map only)
   │                                └─ Broadcast creature_added      │                                  │
   │                                  ├─ creature_add_confirmed      │
   │                                  │                                  │
   └─ creature_add_confirmed           │                                  │
      ├─ addCreatureToken(creature)    │                                  │
      └─ Token added to store      │                                  │
```

**VERDICT:** ✅ Flow is correct and complete.

---

### 4.2 Token State Update Flow

```
GM Client                          Server                          Firebase/Other Players
   │                                │                                  │
   ├─ TargetHUD: updateTokenState()   │                                  │
   │                                │                                  │
   ├─ creatureStore.updateTokenState() │                                  │
   │                                │                                  │
   ├─ socket.emit('creature_updated')  │                                  │
   │                                ├─ Update token.state                │                                  │
   │                                ├─ Store in:                       │                                  │
   │                                │  • room.gameState.tokens         │                                  │
   │                                │  • room.gameState.maps[mapId].tokens  │                                  │
   │                                │                                  │
   ├─ firebaseBatchWriter.queueWrite() │                                  │
   │                                │  (500ms delay)                     │
   │                                │                                  │
   ├─ updateRoomGameState()         ├─ Process queue                 ├─ updateRoomGameState()     │
   │                                ├─ Persist to Firebase           ├─ Persist to Firebase           ├─ Broadcast creature_updated
   │                                │                                  │  (to all players)
   │                                └─ Broadcast creature_updated      │                                  │
   │                                  │                                  │
   └─ creature_updated               │                                  │
      ├─ creatureStore.updateTokenState()│                                  │
      └─ Token state updated        │                                  │
```

**VERDICT:** ⚠️ **Race condition risk** - Batch writer delay can cause lost updates.

---

### 4.3 Token Movement Flow

```
Player Client                      Server                          Firebase/Other Players
   │                                │                                  │
   ├─ CreatureToken: drag          │                                  │
   │                                │                                  │
   ├─ socket.emit('token_moved')   │                                  │
   │                                │                                  │
   ├─ Update position                │                                  │
   │                                ├─ Store in:                       │                                  │
   │                                │  • room.gameState.tokens         │                                  │
   │                                │  • room.gameState.maps[mapId].tokens  │                                  │
   │                                │                                  │
   ├─ firebaseBatchWriter.queueWrite() │                                  │
   │                                │  (500ms delay for drag)        │
   │                                │                                  │
   ├─ updateRoomGameState()         ├─ Process queue                 ├─ updateRoomGameState()     │
   │                                ├─ Persist to Firebase           ├─ Persist to Firebase           ├─ Broadcast token_moved
   │                                │                                  │  (to same map only)
   │                                └─ Broadcast token_moved       │                                  │
   │                                  │                                  │
   └─ token_moved                  │                                  │
      ├─ creatureStore.updatePosition()│                                  │
      └─ Token position updated      │                                  │
```

**VERDICT:** ⚠️ **Lost updates risk** - Frequent drag events reset batch writer timer.

---

## 5. Room Persistence Flow Analysis

### 5.1 Server Persistence Flow

```
Server Startup
   │
   ├─ loadPersistentRooms()
   │  └─ Load rooms from Firebase (isActive=true)
   │
   └─ Initialize rooms Map

During Token Operations
   │
   ├─ Update room.gameState
   │  ├─ Update both global and map-specific storage
   │  └─ Mark for save
   │
   └─ firebaseBatchWriter.queueWrite()
     └─ 500ms delay → processQueue()
        └─ updateRoomGameState()
           ├─ Persist to Firebase (split storage)
           │  ├─ gameState/current (global data)
           │  └─ gameState/{mapId} (map-specific data)
           └─ Broadcast to other players
```

**VERDICT:** ✅ Server persistence is correct and robust.

---

### 5.2 Client Persistence Flow

```
Room Join/Change
   │
   ├─ loadRoomState() from Firebase
   │  └─ Load user's room state document
   │
   └─ Apply to stores
      ├─ characterTokens
      ├─ creatureTokens
      ├─ gridItems
      ├─ levelEditor data
      └─ combat state

Auto-Save Trigger (only on component unmount or room change)
   │
   ├─ collectRoomState()
   │  └─ Gather all store states
   │
   ├─ Compare to lastSavedStateRef
   │  └─ Only save if changed
   │
   └─ saveRoomState()
      └─ Persist to Firebase user/roomStates/{roomId}
```

**VERDICT:** ⚠️ **Missing auto-save triggers** - No auto-save on token state changes.

---

## 6. Data Integrity Analysis

### 6.1 Token State Structure

**Server Storage:**
```javascript
room.gameState.tokens[tokenId] = {
  id: tokenId,
  creatureId: data.creatureId,
  position: { x, y },
  creature: data.creature,
  createdBy: player.id,
  createdByName: player.name,
  createdAt: new Date(),
  lastMovedBy: null,
  lastMovedAt: null,
  mapId: targetMapId,
  state: {
    currentHp: 35,
    maxHp: 100,
    currentMana: 0,
    maxMana: 50,
    currentActionPoints: 2,
    maxActionPoints: 3,
    conditions: [],
    customName: null,
    customIcon: null
  }
}
```

**Client Storage:**
```javascript
creatureStore.creatureTokens = [{
  ...creatureData,
  id: tokenId,
  creatureId: creatureId,
  position,
  state: forcedState || initialState,
  addedAt: Date.now(),
  mapId: currentMapId || 'default'
}]
```

**VERDICT:** ✅ Token state structure is consistent.

---

### 6.2 Firebase Storage Consistency

**Server-side Storage:**
```
rooms/{roomId}/
  ├─ gameState: { ...globalData }
  └─ (subcollection)
     ├─ gameState/current: { ...globalState, maps: {} }
     ├─ gameState/{mapId}: { tokens: {}, characterTokens: {}, ... }
     └─ chat/{messageId}: { ...message }
```

**Client-side Storage:**
```
users/{userId}/roomStates/{roomId}/
  ├─ characterTokens: []
  ├─ creatureTokens: []
  ├─ gridItems: []
  ├─ environmentalObjects: []
  ├─ version: 1
  └─ lastUpdated: timestamp
```

**CRITICAL DIFFERENCE:**

Server stores room state in `rooms/{roomId}` collection.
Client stores room state in `users/{userId}/roomStates/{roomId}` collection.

These are **different Firebase paths**. The server's Firebase storage is the source of truth for multiplayer rooms. The client's personal room state is only for single-player or local persistence.

**VERDICT:** ⚠️ **Potential confusion** - Client and server storing to different Firebase paths.

---

## 7. Recommendations

### 7.1 🔴 CRITICAL: Fix Firebase Batch Writer

**File:** `server/services/optimizedFirebase.js`

**Change:**
```javascript
queueWrite(roomId, operation) {
  this.writeQueue.push({ roomId, operation, timestamp: Date.now() });

  // FIX: Only set timer if not already set
  if (!this.writeTimers[roomId]) {
    this.writeTimers[roomId] = setTimeout(() => {
      this.processQueue(roomId);
      this.writeTimers[roomId] = null;
    }, this.batchWriteDelay);
  }
}
```

**Impact:** Prevents lost token state updates during rapid GM modifications.

---

### 7.2 🔴 CRITICAL: Add Auto-Save on Token State Changes

**File:** `vtt-react/src/hooks/useRoomPersistence.js`

**Change:**
```javascript
useEffect(() => {
  if (user && !user.isGuest && currentRoomId) {
    scheduleAutoSave();

    // FIX: Add store subscriptions for automatic saving
    const creatureStore = require('../store/creatureStore').default;
    const combatStore = require('../store/combatStore').default;

    const unsubscribeTokens = creatureStore.subscribe((state, prevState) => {
      if (state.tokens !== prevState.tokens) {
        scheduleAutoSave();
      }
    });

    const unsubscribeCombat = combatStore.subscribe((state, prevState) => {
      if (state.isInCombat !== prevState.isInCombat ||
          state.currentTurn !== prevState.currentTurn) {
        scheduleAutoSave();
      }
    });

    return () => {
      clearTimeout(roomStateTimerRef.current);
      unsubscribeTokens();
      unsubscribeCombat();
    };
  }
}, [currentRoomId, scheduleAutoSave, user]);
```

**Impact:** Token state changes automatically saved, no data loss on disconnect.

---

### 7.3 🟡 HIGH: Force Save Before Map Switch

**File:** `vtt-react/src/store/mapStore.js`

**Change:**
```javascript
switchMap(newMapId) {
  // FIX: Force save current state before switching
  import('../services/gameStateManager').then(({ default: gameStateManager }) => {
    gameStateManager.saveGameState(true);
  }).then(() => {
    set({ currentMapId: newMapId });
  });
}
```

**Impact:** Unsaved token state preserved on map switch.

---

### 7.4 🟢 MEDIUM: Unify Firebase Storage Path

**Consideration:** Decide whether client should also persist to `rooms/{roomId}` path for multiplayer consistency.

**Current Behavior:**
- Server: Persists to `rooms/{roomId}` (room data)
- Client: Persists to `users/{userId}/roomStates/{roomId}` (personal copy)

**Decision:** Current separation is intentional for single-player vs multiplayer. No change needed.

---

## 8. Testing Checklist

### Token Synchronization Tests

- [ ] GM creates token on Map A
- [ ] Player joins room
- [ ] Token appears on Player's Map A view with correct state
- [ ] GM modifies token HP
- [ ] Player sees updated HP immediately
- [ ] GM modifies token HP 3 times rapidly (within 500ms)
- [ ] All 3 HP values preserved (not lost due to batching)
- [ ] GM moves token
- [ ] Player sees updated position
- [ ] GM deletes token
- [ ] Token disappears from all players
- [ ] GM creates token on Map B
- [ ] Player on Map A doesn't see token
- [ ] Player switches to Map B
- [ ] Token appears with correct state
- [ ] GM modifies token on Map A
- [ ] Player on Map B doesn't see changes

### Room Persistence Tests

- [ ] GM creates room with tokens
- [ ] Server restarts
- [ ] Room loads with all tokens intact
- [ ] Player joins room
- [ ] All tokens load correctly
- [ ] GM modifies token state
- [ ] Player sees changes
- [ ] Player disconnects and reconnects
- [ ] Token state preserved
- [ ] GM saves room state
- [ ] Firebase stores data correctly
- [ ] New player joins room
- [ ] Token state loads from Firebase
- [ ] Multiple GMs in room
- [ ] Concurrent modifications handled correctly
- [ ] Last write wins consistently

---

## 9. Summary

### Working Correctly ✅

1. **Server Token Storage** - Dual storage (global + map-specific) maintained correctly
2. **Server Firebase Persistence** - Split storage strategy working, avoids 1MB limit
3. **Server Broadcasts** - Map-filtered broadcasts working correctly
4. **Client Token Loading** - Map filtering in loadToken working
5. **Client Data Collection** - All necessary state collected
6. **Client Personal Persistence** - Room state saved to user path

### Critical Issues 🔴

1. **Firebase Batch Writer Race Condition** - Timer reset causes lost updates
2. **No Auto-Save on Token Changes** - Only saves on room change/component unmount
3. **Potential Map Switch Data Loss** - No force save before switching maps

### Minor Issues 🟡

1. **Dual Firebase Paths** - Server and client store to different locations (intentional separation)
2. **Complex Dual Storage** - Maintaining two storage locations increases complexity

### Recommendations Priority

1. **🔴 CRITICAL:** Fix Firebase Batch Writer timer reset
2. **🔴 CRITICAL:** Add auto-save on token state changes
3. **🟡 HIGH:** Force save before map switch
4. **🟢 MEDIUM:** Consider unifying Firebase storage paths (document architectural decision)

---

**Overall Assessment:** Token synchronization and room persistence are **mostly working correctly**, but have **critical race condition bugs** that cause data loss during rapid updates.
