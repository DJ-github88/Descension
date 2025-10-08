# Equipment Stacking System - Character Creation

## Summary of Changes

Implemented full stacking functionality for consumable items in the character creation equipment selection step, matching the behavior of the main game inventory system.

---

## 1. Trail Rations Update

### Before
- Name: "Trail Rations (5 days)"
- Description: "Enough for 5 days of travel"
- Price: 2g 35s 80c
- Weight: 2
- Max Stack: 3

### After
- Name: "Trail Rations"
- Description: "Enough for one day of travel"
- Price: 5s (silver only)
- Weight: 0.5
- Max Stack: 20

**Rationale:** Changed from a "5-pack" to individual rations that stack properly. Much cheaper per unit and can buy many more.

---

## 2. Stacking System Implementation

### Purchase Behavior (handlePurchaseItem)

**Consumables now stack automatically when purchased:**

1. **First Purchase**: Item added with `quantity: 1`
2. **Subsequent Purchases**: 
   - If same item exists (matching name, type, quality)
   - And stack isn't full (quantity < maxStackSize)
   - Increment existing stack's quantity
3. **Full Stack**: Create new stack when maxStackSize reached

**Code Logic:**
```javascript
// Check if item is stackable (consumables are stackable)
const isStackable = item.type === 'consumable' && item.stackable !== false;

if (isStackable) {
    // Try to find existing stack
    const existingIndex = selectedEquipment.findIndex(
        existing => existing.name === item.name && 
                   existing.type === item.type &&
                   existing.quality === item.quality
    );

    if (existingIndex >= 0) {
        const currentQuantity = existingItem.quantity || 1;
        const maxStackSize = item.maxStackSize || 99;

        if (currentQuantity < maxStackSize) {
            // Add to existing stack
            updatedEquipment[existingIndex] = {
                ...existingItem,
                quantity: currentQuantity + 1
            };
        } else {
            // Create new stack (full)
            const newItem = { ...item, quantity: 1 };
            setSelectedEquipment([...selectedEquipment, newItem]);
        }
    }
}
```

### Refund Behavior (handleRefundItem)

**Clicking a stacked item refunds ONE item from the stack:**

1. **Stack > 1**: Decrement quantity by 1
2. **Stack = 1**: Remove item entirely
3. **Currency**: Refund single item price

**Code Logic:**
```javascript
const quantity = item.quantity || 1;
const newCurrency = addCurrency(currentCurrency, item.value);

if (quantity > 1) {
    // Reduce stack by 1
    updatedEquipment[index] = {
        ...item,
        quantity: quantity - 1
    };
} else {
    // Remove the item entirely
    setSelectedEquipment(selectedEquipment.filter((_, i) => i !== index));
}
```

### Visual Display

**Quantity badge appears on stacked items:**

```javascript
{item.quantity && item.quantity > 1 && (
    <div className="item-quantity" style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontSize: '0.7rem',
        padding: '2px 4px',
        borderRadius: '4px',
        minWidth: '16px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
        fontWeight: 'bold',
        pointerEvents: 'none',
        zIndex: 3
    }}>
        {item.quantity}
    </div>
)}
```

**Matches the inventory system styling exactly.**

### Cost Calculation

**Total cost now accounts for quantities:**

```javascript
const totalCost = useMemo(() => {
    return selectedEquipment.reduce((total, item) => {
        const quantity = item.quantity || 1;
        return total + (calculateTotalCopper(item.value) * quantity);
    }, 0);
}, [selectedEquipment]);
```

### Item Count Display

**Shows total items with stack breakdown:**

```javascript
<span>
    {selectedEquipment.reduce((total, item) => total + (item.quantity || 1), 0)}
    {selectedEquipment.length !== selectedEquipment.reduce((total, item) => total + (item.quantity || 1), 0) && 
        ` (${selectedEquipment.length} stacks)`
    }
</span>
```

**Examples:**
- "5" - 5 individual items (no stacks)
- "15 (3 stacks)" - 15 total items in 3 stacks

---

## 3. Stackable Consumables in Starting Equipment

All consumables are properly configured with stacking:

| Item | Type | Max Stack | Price |
|------|------|-----------|-------|
| **Minor Healing Potion** | consumable/POTION | 5 | 4g 75s 25c |
| **Trail Rations** | consumable/FOOD | 20 | 5s |
| **Antitoxin Vial** | consumable/POTION | 3 | 4g 60s 50c |
| **Oil Flask** | consumable/UTILITY | 5 | 8s 25c |

All have `stackable: true` and appropriate `maxStackSize` values.

---

## 4. Container Removal

**Containers are now excluded from purchasable items:**

### Removed Items
- Leather Backpack (2x2 container)
- Belt Pouch (1x1 container)

### Implementation
```javascript
// Filter out containers - players shouldn't be able to purchase these
const availableItems = useMemo(() => {
    const items = getAvailableStartingItems(characterData);
    return items.filter(item => item.type !== 'container');
}, [characterData]);
```

### UI Changes
- Removed "Containers" category tab from equipment selection
- Only shows: All, Weapons, Armor, Accessories, Consumables, Misc

**Rationale:** Containers should be given as starting equipment or found/earned, not purchased during character creation.

---

## 5. Files Modified

### vtt-react/src/data/startingEquipmentData.js
- Updated Trail Rations item (name, description, price, weight, maxStackSize)

### vtt-react/src/components/character-creation-wizard/steps/Step10EquipmentSelection.jsx
- Modified `handlePurchaseItem()` to stack consumables
- Modified `handleRefundItem()` to handle stack quantities
- Added quantity badge display to purchased items
- Updated total cost calculation to account for quantities
- Updated item count display to show total items + stack count
- Filtered out containers from available items
- Removed "Containers" category tab

---

## 6. User Experience

### Purchasing Consumables
1. Click a consumable (e.g., Trail Rations)
2. First click: Item appears with no quantity badge (quantity = 1)
3. Second click: Quantity badge appears showing "2"
4. Continue clicking: Quantity increments up to maxStackSize
5. After maxStackSize: New stack created

### Refunding Consumables
1. Click a stacked item in purchased equipment
2. Quantity decrements by 1
3. Currency refunded for 1 item
4. When quantity reaches 0, item removed from grid

### Visual Feedback
- Quantity badge appears in bottom-right corner (just like inventory)
- Badge only shows when quantity > 1
- Black background with white text for readability
- Bold font for emphasis

---

## 7. Testing Checklist

### Stacking Behavior
- [ ] Purchase Trail Rations multiple times - should stack
- [ ] Purchase Minor Healing Potion multiple times - should stack
- [ ] Purchase Antitoxin Vial multiple times - should stack
- [ ] Purchase Oil Flask multiple times - should stack
- [ ] Verify quantity badge appears when quantity > 1
- [ ] Verify quantity badge shows correct number

### Stack Limits
- [ ] Trail Rations stops stacking at 20, creates new stack
- [ ] Minor Healing Potion stops stacking at 5, creates new stack
- [ ] Antitoxin Vial stops stacking at 3, creates new stack
- [ ] Oil Flask stops stacking at 5, creates new stack

### Refunding
- [ ] Click stacked item - quantity decrements by 1
- [ ] Currency refunded correctly (single item price)
- [ ] Item removed when quantity reaches 0
- [ ] Can refund entire stack one by one

### Cost Calculation
- [ ] Total cost reflects quantity × price for stacked items
- [ ] Remaining currency updates correctly with each purchase
- [ ] Refunds restore correct amount

### Item Count
- [ ] Shows total items (sum of all quantities)
- [ ] Shows stack count when items are stacked
- [ ] Example: "15 (3 stacks)" for 15 items in 3 stacks

### Non-Stackable Items
- [ ] Weapons don't stack (each purchase creates new item)
- [ ] Armor doesn't stack (each purchase creates new item)
- [ ] Accessories don't stack (each purchase creates new item)

### Container Exclusion
- [ ] Leather Backpack not in available items
- [ ] Belt Pouch not in available items
- [ ] "Containers" tab removed from category filter
- [ ] No containers appear in "All" category

---

## 8. Comparison with Main Inventory System

The character creation stacking system now matches the main game inventory:

| Feature | Main Inventory | Character Creation |
|---------|---------------|-------------------|
| **Stack Detection** | name + type + quality | name + type + quality ✓ |
| **Stackable Types** | consumable, miscellaneous, material | consumable ✓ |
| **Max Stack Size** | item.maxStackSize or 99 | item.maxStackSize or 99 ✓ |
| **Quantity Display** | Bottom-right badge | Bottom-right badge ✓ |
| **Badge Styling** | Black bg, white text, bold | Black bg, white text, bold ✓ |
| **Merge on Drag** | Yes (inventory) | N/A (shop purchase) |
| **Auto-stack on Add** | Yes | Yes ✓ |

---

## 9. Future Enhancements

Potential improvements for the future:

1. **Shift-Click to Buy Multiple**: Hold Shift and click to buy 5 at once
2. **Right-Click for Quantity**: Right-click to specify exact quantity to purchase
3. **Drag to Merge**: Drag one stack onto another to combine (if space allows)
4. **Split Stacks**: Right-click purchased stack to split into smaller stacks
5. **Quick Buy Buttons**: +1, +5, +10 buttons for consumables
6. **Bulk Discount**: Discount for buying multiple of the same item

---

## Conclusion

✅ **Trail Rations** changed to single stackable items (max 20)
✅ **Stacking system** implemented for all consumables
✅ **Quantity badges** display on stacked items
✅ **Refund system** handles stack quantities properly
✅ **Cost calculation** accounts for quantities
✅ **Item count** shows total items + stack breakdown
✅ **Containers** excluded from purchasable items
✅ **UI consistency** matches main inventory system

The equipment selection now provides a smooth, intuitive experience for purchasing consumables with proper stacking behavior!

