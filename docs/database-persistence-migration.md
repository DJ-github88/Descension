# Database Persistence Migration

## Overview
This document describes the migration from localStorage-based persistence to database-based persistence for game state. This ensures that game state is tied to rooms and characters in the database, not to the local browser.

## Problem Statement
Previously, game state (maps, level editor data, tokens, combat state, etc.) was persisted to localStorage using Zustand's `persist` middleware. This caused issues where:
- Different computers showed different game states for the same room
- State was not synchronized across devices
- State was not properly tied to multiplayer rooms

## Solution
All game state is now stored in the database via the room's `gameState` object. The application loads state from the database when entering a room and saves changes back to the database in real-time.

## Changes Made

### 1. Removed localStorage Persistence from Stores ✅

The following stores had their `persist` middleware removed:

#### `vtt-react/src/store/mapStore.js` ✅
- **Before**: Used `persist` middleware to save maps to localStorage
- **After**: Maps are stored in memory only during session
- **Impact**: Maps are now loaded from room database on room entry
- **Status**: COMPLETE

#### `vtt-react/src/store/levelEditorStore.js` ✅
- **Before**: Used `persist` middleware to save level editor data to localStorage
- **After**: Level editor data is stored in memory only during session
- **Impact**: Terrain, drawings, fog of war, etc. are now loaded from room database
- **Status**: COMPLETE

#### `vtt-react/src/store/gameStore.js` ✅
- **Before**: Used `persist` middleware to save game state to localStorage
- **After**: Game state is stored in memory only during session
- **Impact**: Backgrounds, tokens, combat state are now loaded from room database
- **Status**: COMPLETE

#### `vtt-react/src/store/combatStore.js` ✅
- **Before**: Used `persist` middleware to save combat state to localStorage
- **After**: Combat state is stored in memory only during session
- **Impact**: Combat timeline, turn order, movement tracking are now loaded from room database
- **Status**: COMPLETE

#### `vtt-react/src/store/characterTokenStore.js` ✅
- **Before**: Used `persist` middleware to save character tokens to localStorage
- **After**: Character tokens are stored in memory only during session
- **Impact**: Character token positions are now loaded from room database
- **Status**: COMPLETE

#### `vtt-react/src/store/gridItemStore.js` ✅
- **Before**: Used `persist` middleware to save dropped items to localStorage
- **After**: Grid items are stored in memory only during session
- **Impact**: Dropped items are now loaded from room database on room entry
- **Status**: COMPLETE

### 2. Updated Level Editor Persistence Service ✅

#### `vtt-react/src/services/levelEditorPersistenceService.js` ✅
- **Before**: Saved level editor state to localStorage with room-specific keys
- **After**: Only maintains an in-memory cache; actual persistence happens via database sync
- **Impact**: Service is kept for API compatibility but delegates to database sync mechanisms
- **Status**: COMPLETE
- **Changes Made**:
  - Removed all `localStorage.setItem()` and `localStorage.getItem()` calls
  - Removed `LEVEL_EDITOR_STORAGE_PREFIX` constant
  - Changed `saveLevelEditorState()` to only update in-memory cache
  - Changed `loadLevelEditorState()` to only read from in-memory cache
  - Changed `deleteLevelEditorState()` to only clear in-memory cache
  - Made `cleanupOldStates()` a no-op with deprecation message
  - Updated `getStorageStats()` to return cache statistics only
  - Updated `getAllRoomStates()` to return cached states only

## Database Schema

The room `gameState` object in Firebase already supports all necessary data:

```javascript
{
  gameState: {
    // Map data
    mapData: {
      backgrounds: [],
      activeBackgroundId: null,
      cameraPosition: { x: 0, y: 0 },
      zoomLevel: 1.0,
      gridSettings: { size: 50, offsetX: 0, offsetY: 0, color: '...', thickness: 2 }
    },
    
    // Level editor data
    levelEditor: {
      terrainData: [],
      environmentalObjects: [],
      wallData: [],
      dndElements: [],
      fogOfWarData: [],
      drawingPaths: [],
      drawingLayers: [],
      lightSources: []
    },
    
    // Game entities
    tokens: {},
    characters: {},
    
    // Combat state
    combat: {
      isActive: false,
      currentTurn: null,
      turnOrder: [],
      round: 0
    },
    
    // Other game state
    fogOfWar: {},
    lighting: { globalIllumination: 0.3, lightSources: [] },
    inventory: { droppedItems: {}, lootBags: {} }
  }
}
```

## What Still Needs to Be Done

### 1. Room Entry/Exit State Management

**Current State**: Stores no longer persist to localStorage, but they don't automatically load from database on room entry or clear on room exit.

**What's Needed**:
- Add logic to load all game state from database when entering a room
- Add logic to clear all game state when leaving a room
- Ensure state is properly synchronized with the database

**Files to Modify**:
- `vtt-react/src/App.jsx` - Room entry/exit logic
- `vtt-react/src/services/gameStateManager.js` - State loading/clearing
- `vtt-react/src/contexts/RoomContext.jsx` - Room context management

### 2. Real-Time Database Sync

**Current State**: Some database sync exists via socket.io and Firebase, but it may not cover all state changes.

**What's Needed**:
- Ensure all state changes trigger database updates
- Implement debouncing for frequent updates (e.g., drawing, token movement)
- Handle offline scenarios gracefully

**Files to Check**:
- `server/server.js` - Socket.io event handlers
- `server/services/firebaseService.js` - Firebase persistence
- `vtt-react/src/services/roomService.js` - Client-side room service

### 3. Character-Specific State

**Current State**: Character data is already persisted to database via `characterPersistenceService`.

**What's Needed**:
- Ensure character state changes during gameplay are saved to character record
- Implement character session tracking (already exists in `characterSessionService`)
- Apply character changes at end of session

**Files to Check**:
- `vtt-react/src/services/firebase/characterPersistenceService.js`
- `vtt-react/src/services/firebase/characterSessionService.js`

### 4. Migration for Existing Users

**What's Needed**:
- Provide a way for users to migrate their localStorage data to the database
- Clear old localStorage data after migration
- Show migration prompt on first load after update

**Suggested Approach**:
- Create a migration utility that reads localStorage data
- Upload it to the appropriate room in the database
- Clear localStorage after successful migration

## Testing Checklist

- [ ] Create a room on one device
- [ ] Add maps, drawings, tokens, etc.
- [ ] Join the same room from a different device
- [ ] Verify all state is synchronized
- [ ] Make changes on second device
- [ ] Verify changes appear on first device
- [ ] Leave and rejoin room
- [ ] Verify state persists correctly
- [ ] Test offline scenarios
- [ ] Test with multiple players in same room

## Benefits

1. **Cross-Device Consistency**: Same state on all devices
2. **Multiplayer Support**: All players see the same game state
3. **Persistence**: State survives browser refresh and device changes
4. **Scalability**: Database can handle larger game states than localStorage
5. **Backup**: State is backed up in the database
6. **Roll20-like Experience**: Matches the expected behavior of professional VTT platforms

## Notes

- User preferences (UI settings, theme, etc.) should still use localStorage
- Item library and quest library can remain in localStorage as they are shared catalogs
- Authentication state should remain in localStorage for quick access

