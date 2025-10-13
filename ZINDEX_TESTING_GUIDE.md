# Z-Index Management Testing Guide

## Quick Test: Container Wizard Issue

This is the PRIMARY test case that was failing before:

1. **Open Item Library**
   - Navigate to the Item Library window
   - Note its position on screen

2. **Open Container Wizard**
   - Click the "Create Container" button in Item Library
   - **EXPECTED:** Container Wizard appears ON TOP of Item Library
   - **BEFORE FIX:** Container Wizard appeared BELOW Item Library (BUG)

3. **Verify Stacking**
   - Container Wizard should be fully visible
   - You should be able to interact with the wizard
   - Item Library should be partially obscured behind the wizard

4. **Test Click-to-Front**
   - Click on the Item Library window (visible part)
   - **EXPECTED:** Item Library comes to front
   - Click on Container Wizard
   - **EXPECTED:** Container Wizard comes to front

## Comprehensive Testing

### Test 1: Multiple Windows
1. Open Item Library
2. Open Character Sheet
3. Open Spellbook
4. Click each window in random order
5. **VERIFY:** Clicked window always comes to front

### Test 2: Window Dragging
1. Open any window (e.g., Item Library)
2. Start dragging the window by its header
3. **VERIFY:** Window comes to front when drag starts
4. Release the drag
5. **VERIFY:** Window remains on top

### Test 3: Modal Priority
1. Open Item Library (regular window)
2. Open Item Wizard (modal)
3. **VERIFY:** Item Wizard appears above Item Library
4. Try clicking Item Library
5. **VERIFY:** Item Library comes to front but modal should still be above it
6. Close Item Wizard
7. Open Quick Item Generator (modal)
8. **VERIFY:** Modal appears above all windows

### Test 4: Multiple Modals
1. Open Item Library
2. Open Item Wizard
3. Open Container Wizard from Item Library
4. **VERIFY:** Container Wizard appears above Item Wizard
5. **VERIFY:** Both modals appear above Item Library

### Test 5: Tooltips
1. Open any window
2. Hover over an item to show tooltip
3. **VERIFY:** Tooltip appears above the window
4. Open a modal
5. Hover over an item in the modal
6. **VERIFY:** Tooltip appears above the modal

### Test 6: Context Menus
1. Open Item Library
2. Right-click an item to show context menu
3. **VERIFY:** Context menu appears above the window
4. Open a modal
5. Right-click in the modal
6. **VERIFY:** Context menu appears above the modal

### Test 7: New Window Behavior
1. Open Item Library
2. Open Character Sheet
3. **VERIFY:** Character Sheet appears on top (newest window)
4. Open Spellbook
5. **VERIFY:** Spellbook appears on top (newest window)

### Test 8: Container Window
1. Open Item Library
2. Double-click a container item
3. **VERIFY:** Container Window opens on top
4. Click Item Library
5. **VERIFY:** Item Library comes to front
6. Click Container Window
7. **VERIFY:** Container Window comes to front

## Visual Inspection

### Check Z-Index Values (Browser DevTools)
1. Open browser DevTools (F12)
2. Inspect a window element
3. Check the computed z-index value
4. **VERIFY:** 
   - Regular windows: 1000-1999 range
   - Modals: 2000-2999 range
   - No values like 99999 or 999999999

### Check Console for Errors
1. Open browser console
2. Perform all tests above
3. **VERIFY:** No errors related to z-index or window management
4. **VERIFY:** No warnings about missing window IDs

## Performance Testing

### Test Window Registration/Cleanup
1. Open and close 10 windows rapidly
2. Check browser console
3. **VERIFY:** No memory leaks
4. **VERIFY:** Windows properly unregister on close

### Test Z-Index Growth
1. Open and close windows 20 times
2. Inspect the z-index of the latest window
3. **VERIFY:** Z-index values are reasonable (not exceeding 3000 for windows)
4. **VERIFY:** System doesn't run out of z-index values

## Edge Cases

### Test 1: Rapid Window Opening
1. Rapidly open 5 windows in quick succession
2. **VERIFY:** Each window appears on top of the previous
3. **VERIFY:** All windows are accessible

### Test 2: Modal from Modal
1. Open Item Wizard
2. Open a sub-modal (if applicable)
3. **VERIFY:** Sub-modal appears above parent modal
4. Close sub-modal
5. **VERIFY:** Parent modal is still accessible

### Test 3: Window Scale
1. Change window scale in settings
2. Open windows and modals
3. **VERIFY:** Z-index management still works correctly
4. **VERIFY:** Windows scale properly without z-index issues

## Regression Testing

### Verify No Breaking Changes
1. **Character Sheet:** Opens and functions normally
2. **Spellbook:** Opens and functions normally
3. **Quest Log:** Opens and functions normally
4. **Combat Timeline:** Opens and functions normally
5. **All Modals:** Open and close without errors
6. **Tooltips:** Display correctly everywhere
7. **Context Menus:** Display correctly everywhere

## Success Criteria

✅ Container Wizard appears ABOVE Item Library (PRIMARY FIX)
✅ Clicking any window brings it to front
✅ New windows automatically appear on top
✅ Modals ALWAYS appear above regular windows
✅ Tooltips appear above everything
✅ No z-index values exceed 3000 (except TooltipPortal)
✅ No console errors related to window management
✅ All existing functionality still works
✅ Dragging windows brings them to front
✅ Multiple windows can be managed simultaneously

## Known Limitations

1. **Z-Index Growth:** Z-index values will grow over time as windows are opened/closed. This is acceptable as the values stay within reasonable ranges (1000-2999).

2. **TooltipPortal Exception:** TooltipPortal uses max z-index (2147483647) and is not managed by the store. This is intentional to ensure tooltips always appear on top.

3. **No Z-Index Reset:** Currently no mechanism to reset z-index values when they get high. This could be added in the future if needed.

## Debugging Tips

### If a window appears below another when it shouldn't:

1. Check browser DevTools:
   - Inspect both elements
   - Compare their z-index values
   - Check if they're in the same stacking context

2. Check console for errors:
   - Look for window registration errors
   - Check if window ID is unique

3. Verify component implementation:
   - Ensure component calls `registerWindow` on mount
   - Ensure component calls `unregisterWindow` on unmount
   - Ensure component calls `bringToFront` on click/drag

4. Check CSS:
   - Ensure no hardcoded z-index values override the managed values
   - Ensure no !important rules interfere

### If modals appear below windows:

1. Check modal structure:
   - Verify overlay and modal are rendered as SIBLINGS
   - Verify both use managed z-index values
   - Verify modal is registered as type 'modal', not 'window'

2. Check stacking context:
   - Ensure modal is not nested inside overlay
   - Ensure both are direct children of portal

## Reporting Issues

If you find any issues with the z-index management system:

1. Note which windows/modals are involved
2. Note the expected vs actual stacking order
3. Check browser console for errors
4. Inspect z-index values in DevTools
5. Note the steps to reproduce
6. Report with all above information

