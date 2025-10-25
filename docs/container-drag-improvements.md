# Container Drag & Drop Improvements

## Overview
Enhanced the drag-and-drop functionality for containers to provide better visual feedback when dragging items from the item library into containers.

## Changes Made

### 1. ItemCard.jsx - Global Drag State Tracking
**File**: `vtt-react/src/components/item-generation/ItemCard.jsx`

**Changes**:
- Added global `window.draggedItemInfo` to track currently dragged item
- Stores item dimensions (width, height, rotation) during drag start
- Clears global state on drag end

**Code Added**:
```javascript
// In handleDragStart:
window.draggedItemInfo = {
    item: item,
    width: item.width || 1,
    height: item.height || 1,
    rotation: item.rotation || 0
};

// In handleDragEnd:
if (window.draggedItemInfo) {
    window.draggedItemInfo = null;
}
```

**Purpose**: Allows ContainerWindow to access item dimensions during dragOver events for proper visual feedback.

---

### 2. ContainerWindow.jsx - Multi-Cell Visual Feedback
**File**: `vtt-react/src/components/item-generation/ContainerWindow.jsx`

**Changes**:
- Enhanced `onDragOver` handler to use global drag state
- Highlights ALL cells that would be occupied by multi-cell items
- Shows green highlight for valid positions, red for invalid
- Validates position in real-time during drag

**Code Added**:
```javascript
// Handle external drags (from inventory or item library)
if (window.draggedItemInfo) {
    const { width, height, rotation } = window.draggedItemInfo;

    // Check if this is a valid position
    const isValid = isValidContainerPosition(
        container.containerProperties?.items || [],
        row, col, width, height, rotation
    );

    // Get all cells that would be occupied
    const occupiedCells = getOccupiedCells(row, col, width, height, rotation);

    // Highlight all occupied cells
    occupiedCells.forEach(cellId => {
        const cellElement = document.querySelector(`.container-cell[data-row="${cellId.split('-')[0]}"][data-col="${cellId.split('-')[1]}"]`);
        if (cellElement) {
            cellElement.classList.add(isValid ? 'drag-over' : 'drag-invalid');
        }
    });
}
```

**Purpose**: Provides clear visual feedback showing exactly which cells will be occupied and whether the item will fit.

---

## How It Works

### Drag Flow:
1. **User starts dragging** an item from the item library
   - ItemCard sets `window.draggedItemInfo` with item dimensions
   - Drag data is set in dataTransfer for drop handling

2. **User drags over container cells**
   - ContainerWindow reads `window.draggedItemInfo`
   - Calculates which cells would be occupied (e.g., 2x2 for Studded Leather Armor)
   - Highlights all affected cells:
     - **Green** = valid position (item fits, no overlap)
     - **Red** = invalid position (out of bounds or overlaps existing items)

3. **User drops the item**
   - Drop handler validates position
   - If valid, adds item to container with proper dimensions
   - Item renders spanning the correct number of cells

4. **Drag ends**
   - Global drag state is cleared
   - Visual highlights are removed

---

## Visual Feedback Examples

### Single Cell Item (1x1)
```
Before drag:  [  ][  ][  ]
During drag:  [🟢][  ][  ]  ← Hovering over top-left
After drop:   [📦][  ][  ]
```

### Multi-Cell Item (2x2 - Studded Leather Armor)
```
Before drag:  [  ][  ][  ]
              [  ][  ][  ]
              
During drag:  [🟢][🟢][  ]  ← Hovering over top-left
              [🟢][🟢][  ]  ← All 4 cells highlighted
              
After drop:   [📦📦][  ]
              [📦📦][  ]
```

### Invalid Position (Overlaps existing item)
```
Before drag:  [📦][  ][  ]
              [  ][  ][  ]
              
During drag:  [🔴][🔴][  ]  ← Red = invalid (overlaps existing item)
              [🔴][🔴][  ]
```

---

## Item Dimensions

Items have explicit dimensions defined in `itemStore.js`:

### Armor Examples:
- **Cloth Armor**: 1x1 or 2x2
- **Leather Armor**: 2x2 (including Studded Leather Armor)
- **Mail Armor**: 2x2
- **Plate Armor**: 2x2 or 2x3

### Weapon Examples:
- **Daggers**: 1x1
- **Swords/Axes/Maces**: 1x2
- **Greatswords/Greataxes**: 2x4
- **Staves**: 1x4
- **Bows/Crossbows**: 2x3

### Fallback Logic:
If an item doesn't have explicit dimensions, the drop handler determines them based on type/subtype (lines 683-726 in ContainerWindow.jsx).

---

## Container Grid System

### Default Container Size:
- **Rows**: 4
- **Cols**: 6
- **Cell Size**: 40px × 40px
- **Gap**: 4px

### Position Validation:
The `isValidContainerPosition` function checks:
1. Item fits within grid bounds
2. No overlap with existing items
3. Respects item rotation (if rotated, width/height are swapped)

---

## Testing

### Test Cases:
1. ✅ Drag 1x1 item (e.g., dagger) into container
2. ✅ Drag 2x2 item (e.g., Studded Leather Armor) into container
3. ✅ Drag 2x4 item (e.g., greatsword) into container
4. ✅ Try to place item in invalid position (should show red highlight)
5. ✅ Try to place item that doesn't fit (should show red highlight)
6. ✅ Drag item around within container to reorganize
7. ✅ Drag item from container to inventory

### Expected Behavior:
- Multi-cell items should highlight ALL cells they will occupy
- Green highlight = valid position
- Red highlight = invalid position
- Items should render with correct size after drop
- Items should be draggable within container to reorganize

---

## Known Limitations

1. **Rotation**: Items are currently placed with rotation=0. Future enhancement could allow rotating items before placement.

2. **Auto-placement**: If user drops on invalid position, item is rejected. Future enhancement could auto-find nearest valid position.

3. **Visual Feedback Delay**: There may be a slight delay in highlight updates on slower systems due to DOM manipulation.

---

## Future Enhancements

1. **Rotation Support**: Allow right-click or keyboard shortcut to rotate item during drag
2. **Auto-placement**: Automatically find valid position if drop location is invalid
3. **Drag Preview**: Show semi-transparent preview of item during drag
4. **Snap to Grid**: Snap item to nearest valid position during drag
5. **Undo/Redo**: Allow undoing item placement in containers

---

## Files Modified

1. `vtt-react/src/components/item-generation/ItemCard.jsx`
   - Added global drag state tracking
   - Lines 100-107: Set window.draggedItemInfo
   - Lines 135-138: Clear window.draggedItemInfo

2. `vtt-react/src/components/item-generation/ContainerWindow.jsx`
   - Enhanced dragOver handler with multi-cell feedback
   - Lines 527-575: New multi-cell highlight logic

---

## Related Documentation

- [Container System](./container-system.md)
- [Inventory Grid System](./inventory-grid-system.md)
- [Item Library](./item-library.md)

