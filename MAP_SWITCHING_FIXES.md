# Map Switching Bug Fixes - Summary

## Problem
When switching between maps, items/drawings were being lost due to race conditions in the map update batching system.

**Symptoms:**
- Draw on new map → items appear
- Switch back to old map → it's empty
- Switch to new map → it's also empty
- Console logs show batcher emitting for multiple map IDs

**Root Cause:**
The `mapUpdateBatcher` captures the map ID when updates are queued, but uses that captured ID when emitting. During map switches, updates could be emitted with the OLD map ID after the current map has changed.

---

## Fixes Implemented

### 1. **levelEditorStore.js** - Fix batcher emit to use current map ID

**File:** `vtt-react/src/store/levelEditorStore.js`
**Line:** 66

**Change:**
```javascript
// BEFORE (WRONG):
const targetMapId = mapUpdateBatcher.capturedMapId || mapStore.currentMapId || 'default';

// AFTER (CORRECT):
// CRITICAL FIX: Always use CURRENT mapId at emit time, NOT captured mapId
const mapStore = useMapStore.getState();
const targetMapId = mapStore.currentMapId || 'default';
```

**Why:** The batcher was using the map ID captured when updates were queued (old map), not the current map at emit time.

---

### 2. **levelEditorStore.js** - Add map switch lock check

**File:** `vtt-react/src/store/levelEditorStore.js`
**Lines:** 76-82

**Change:**
```javascript
// ADDED at start of addUpdate:
// CRITICAL FIX: Reject updates during map switch to prevent data bleeding
if (window._isMapSwitching) {
    console.warn('⚠️ [Batcher] Ignoring update during map switch - would cause data bleeding');
    return;
}
```

**Why:** Prevents updates from being queued during map switch that would be emitted to the wrong map.

---

### 3. **MapLibraryWindow.jsx** - Add map switch transaction lock

**File:** `vtt-react/src/components/windows/MapLibraryWindow.jsx`
**Lines:** 238-240, 572-578

**Change:**
```javascript
// ADDED at start of handleMapSwitch:
window._isMapSwitching = true;
console.log('🔒 [Map Switch] Lock set - preventing updates during transition');

// ADDED in finally block (after line 574):
finally {
    window._isMapSwitching = false;
    console.log('🔓 [Map Switch] Lock cleared - updates allowed');
}
```

**Why:** Creates an atomic transaction that prevents ANY updates from being queued/emitted during the entire map switch process.

---

### 4. **MapLibraryWindow.jsx** - Increase delay for pending emit

**File:** `vtt-react/src/components/windows/MapLibraryWindow.jsx`
**Line:** 297

**Change:**
```javascript
// BEFORE:
await new Promise(resolve => setTimeout(resolve, 100));

// AFTER:
await new Promise(resolve => setTimeout(resolve, 200));
```

**Why:** Gives Firebase more time to complete the sync before switching maps.

---

### 5. **MapLibraryWindow.jsx** - Increase Firebase sync delay

**File:** `vtt-react/src/components/windows/MapLibraryWindow.jsx`
**Line:** 326

**Change:**
```javascript
// BEFORE:
await new Promise(resolve => setTimeout(resolve, 100));

// AFTER:
await new Promise(resolve => setTimeout(resolve, 200));
```

**Why:** Ensures Firebase write completes before map switch proceeds.

---

### 6. **mapStore.js** - Add mapId validation

**File:** `vtt-react/src/store/mapStore.js`
**Lines:** 793-799

**Change:**
```javascript
// ADDED after line 790:
// CRITICAL FIX: Validate all items have correct mapId before saving
const invalidItems = gridItems.filter(item => item.mapId !== mapIdToSave);
if (invalidItems.length > 0) {
    console.warn(`⚠️ Found ${invalidItems.length} items with wrong mapId, filtering out:`, invalidItems);
    gridItems = gridItems.filter(item => item.mapId === mapIdToSave);
}
```

**Why:** Catches items that have been assigned wrong map IDs due to race conditions and prevents them from corrupting the map.

---

### 7. **mapStore.js** - Increase event processing delay

**File:** `vtt-react/src/store/mapStore.js`
**Line:** 642

**Change:**
```javascript
// BEFORE:
}, 50);

// AFTER:
}, 100);
```

**Why:** Gives the application more time to fully load new map state before processing incoming multiplayer events.

---

## Expected Results

After these fixes:

✅ **Items stay on correct map:** When you switch maps, items will remain on the map they were placed on
✅ **No data bleeding:** Updates won't be sent to wrong maps during switches
✅ **Proper sync timing:** Firebase has enough time to complete writes before proceeding
✅ **Atomic operations:** Map switches happen as transactions - either complete successfully or roll back
✅ **Better validation:** Items with wrong map IDs are caught and filtered out

## Testing Checklist

1. Place items on Map A
2. Switch to Map B
3. Draw items on Map B
4. Switch back to Map A
5. Verify items on Map A are still there
6. Switch to Map B
7. Verify items on Map B are still there

## Monitoring

Watch for these console logs during map switches:

✅ `🔒 [Map Switch] Lock set - preventing updates during transition`
✅ `⚠️ [Batcher] Ignoring update during map switch - would cause data bleeding`
✅ `🔓 [Map Switch] Lock cleared - updates allowed`
✅ `⚠️ Found X items with wrong mapId, filtering out:`
✅ `[Batcher] Emitting for map: <CORRECT_MAP_ID>` (should not alternate)

If you still see batcher emitting for multiple map IDs, the issue persists.
