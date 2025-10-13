# Window Z-Index Management System Implementation

## Overview
Implemented a centralized z-index management system using Zustand to fix window stacking issues, particularly the Container Wizard appearing below the Item Library window.

## Problem
- Hardcoded z-index values scattered throughout the codebase (9999, 10000, 15000, 16000, 99999, etc.)
- Modals with overlays had the modal nested inside the overlay, making z-index relative to the overlay's stacking context
- Container Wizard appeared BELOW Item Library window when it should be on top
- No consistent system for managing window/modal stacking order

## Solution

### 1. Created Centralized Window Manager Store
**File:** `vtt-react/src/store/windowManagerStore.js`

**Z-Index Ranges:**
- Regular windows (WowWindow, ContainerWindow): 1000-1999
- Modals (ItemWizard, ContainerWizard, etc.): 2000-2999
- Tooltips/Context menus: 3000+
- TooltipPortal (reserved): 2147483647 (max z-index)

**Key Features:**
- `registerWindow(id, type)` - Register a window/modal and get assigned z-index
- `bringToFront(id)` - Bring window/modal to front by assigning new z-index
- `unregisterWindow(id)` - Cleanup when window closes
- Automatic z-index assignment from appropriate range based on type
- Windows and modals maintain separate z-index sequences

### 2. Updated Components

#### Regular Windows
**Files Updated:**
- `vtt-react/src/components/windows/WowWindow.jsx`
- `vtt-react/src/components/windows/DraggableWindow.jsx`
- `vtt-react/src/components/item-generation/ContainerWindow.jsx`

**Changes:**
- Import and use `useWindowManagerStore`
- Generate unique window ID using `useRef`
- Register window on mount, unregister on unmount
- Call `bringToFront` on click and drag start
- Pass managed z-index to DraggableWindow via props
- Removed hardcoded z-index values (99999, 14500, etc.)

#### Modal Components
**Files Updated:**
- `vtt-react/src/components/item-generation/ItemWizard.jsx`
- `vtt-react/src/components/item-generation/ContainerWizard.jsx`
- `vtt-react/src/components/item-generation/QuickItemGeneratorModal.jsx`
- `vtt-react/src/components/item-generation/CategorizeModal.jsx`

**Critical Architectural Change:**
Modals now render overlay and modal content as **SIBLINGS** (both direct children of portal), NOT parent-child.

**BEFORE (broken):**
```jsx
<div className="overlay" style={{zIndex: 2000}}>
  <div className="modal" style={{zIndex: 2001}}> // relative to overlay!
  </div>
</div>
```

**AFTER (correct):**
```jsx
<>
  <div className="overlay" style={{zIndex: 2000}} />
  <div className="modal" style={{zIndex: 2001}} /> // relative to portal root
</>
```

This ensures modal z-index is NOT relative to the overlay's stacking context.

### 3. CSS Cleanup

**Files Updated:**
- `vtt-react/src/styles/container-wizard.css`
- `vtt-react/src/styles/quick-item-generator-modal.css`
- `vtt-react/src/styles/item-library.css`
- `vtt-react/src/styles/item-wizard.css`
- `vtt-react/src/styles/container-window.css`
- `vtt-react/src/styles/draggable-window.css`
- `vtt-react/src/components/item-generation/CategorizeModal.css`
- `vtt-react/src/utils/portalUtils.js`

**Changes:**
- Removed hardcoded z-index values from overlays and modals
- Removed excessive z-index values (999999, 999999999)
- Removed !important z-index overrides from portalUtils.js
- Added comments indicating z-index is managed by windowManagerStore
- Kept internal relative z-index values (z-index: 1, z-index: 10) as they're relative within components

## Testing Checklist

1. ✅ Open Item Library window
2. ✅ Open Container Wizard from Item Library
3. ✅ Verify Container Wizard appears ON TOP of Item Library
4. ✅ Click Item Library window - verify it comes to front
5. ✅ Click Container Wizard - verify it comes to front
6. ✅ Open multiple windows (Item Library, Character Sheet, etc.)
7. ✅ Verify clicking any window brings it to front
8. ✅ Open Quick Item Generator modal
9. ✅ Verify modal appears above all windows
10. ✅ Open Item Wizard modal
11. ✅ Verify modal appears above all windows
12. ✅ Verify tooltips appear above everything (except TooltipPortal)
13. ✅ Verify no z-index values exceed reasonable limits
14. ✅ Verify dragging windows brings them to front
15. ✅ Verify new windows automatically appear on top

## Key Benefits

1. **Centralized Management:** All z-index values managed in one place
2. **Predictable Stacking:** Clear z-index ranges for different element types
3. **Automatic Ordering:** New windows/modals automatically appear on top
4. **Click-to-Front:** Clicking any window brings it to front
5. **Modal Priority:** Modals ALWAYS appear above regular windows
6. **No Excessive Values:** No more 99999 or 999999999 z-index values
7. **Proper Stacking Context:** Modals render as siblings to overlays, not children
8. **Easy Debugging:** Clear system for understanding window stacking order

## Architecture Notes

### Why Siblings Matter
When a modal is nested inside an overlay, the modal's z-index becomes relative to the overlay's stacking context. This means:
- If overlay has z-index: 2000
- And modal (child of overlay) has z-index: 2001
- The modal's effective z-index is still within the overlay's stacking context
- A window with z-index: 2500 will appear ABOVE the modal

By rendering as siblings:
- Overlay has z-index: 2000
- Modal has z-index: 2001 (relative to same parent as overlay)
- Both are in the same stacking context
- Modal correctly appears above overlay and above windows with lower z-index

### Z-Index Increment Strategy
- Each window/modal registration increments the appropriate counter
- Windows increment from 1000 (1000, 1001, 1002, ...)
- Modals increment from 2000 (2000, 2001, 2002, ...)
- Bringing to front assigns the next available z-index in the range
- This ensures newly opened or clicked windows/modals appear on top

## Files Changed Summary

**Created:**
- `vtt-react/src/store/windowManagerStore.js` (new)

**Updated Components (8 files):**
- `vtt-react/src/components/windows/WowWindow.jsx`
- `vtt-react/src/components/windows/DraggableWindow.jsx`
- `vtt-react/src/components/item-generation/ContainerWindow.jsx`
- `vtt-react/src/components/item-generation/ItemWizard.jsx`
- `vtt-react/src/components/item-generation/ContainerWizard.jsx`
- `vtt-react/src/components/item-generation/QuickItemGeneratorModal.jsx`
- `vtt-react/src/components/item-generation/CategorizeModal.jsx`

**Updated CSS (8 files):**
- `vtt-react/src/styles/container-wizard.css`
- `vtt-react/src/styles/quick-item-generator-modal.css`
- `vtt-react/src/styles/item-library.css`
- `vtt-react/src/styles/item-wizard.css`
- `vtt-react/src/styles/container-window.css`
- `vtt-react/src/styles/draggable-window.css`
- `vtt-react/src/components/item-generation/CategorizeModal.css`
- `vtt-react/src/utils/portalUtils.js`

**Total:** 17 files changed, 1 file created

## Future Enhancements

1. Add z-index debugging tool to visualize stacking order
2. Add max z-index limits to prevent infinite growth
3. Add z-index reset mechanism when values get too high
4. Add window grouping (e.g., all character-related windows)
5. Add z-index persistence across sessions
6. Add keyboard shortcuts for window management (Alt+Tab style)

