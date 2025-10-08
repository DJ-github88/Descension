# Equipment Selection Tooltip Update

## Issue
The equipment selection step was using a simplified custom tooltip instead of the comprehensive ItemTooltip component used throughout the rest of the application.

## Solution
Replaced the custom tooltip with the proper `ItemTooltip` component to ensure consistency across the entire application.

---

## Changes Made

### 1. Updated `Step10EquipmentSelection.jsx`

**Added Imports:**
```javascript
import { createPortal } from 'react-dom';
import ItemTooltip from '../../item-generation/ItemTooltip';
```

**Replaced Custom Tooltip:**
```javascript
// OLD - Simple custom tooltip
{hoveredItem && (
    <div className="equipment-tooltip" style={{...}}>
        <div className="tooltip-header">{hoveredItem.name}</div>
        <div className="tooltip-type">{hoveredItem.type} - {hoveredItem.subtype}</div>
        <div className="tooltip-description">{hoveredItem.description}</div>
        {/* ... simplified stats ... */}
    </div>
)}

// NEW - Comprehensive ItemTooltip component
{hoveredItem && createPortal(
    <div style={{
        position: 'fixed',
        left: `${tooltipPosition.x + 15}px`,
        top: `${tooltipPosition.y - 10}px`,
        pointerEvents: 'none',
        zIndex: 999999999
    }}>
        <ItemTooltip item={hoveredItem} />
    </div>,
    document.body
)}
```

### 2. Updated `EquipmentSelection.css`

**Removed:**
- All custom tooltip CSS (75+ lines)
- `.equipment-tooltip` class
- `.tooltip-header`, `.tooltip-type`, `.tooltip-description` classes
- `.tooltip-stats`, `.tooltip-stat` classes
- `.tooltip-price`, `.tooltip-weight` classes

**Replaced with:**
```css
/* Tooltip styling is handled by ItemTooltip component */
```

---

## ItemTooltip Component Features

The `ItemTooltip` component provides comprehensive item information display:

### Visual Features:
- **Quality-based borders** with glowing effects
- **Item icon** (32x32) with quality-colored border
- **Item name** with quality-colored text and glow effect
- **Dark themed background** with gradient
- **Proper spacing and typography**

### Information Displayed:

#### For All Items:
- Item name (quality-colored)
- Item icon
- Item type and subtype
- Level requirement (if applicable)
- Item description (italicized, green text)

#### For Weapons:
- Weapon slot (One-Handed, Two-Handed, Ranged, Off Hand)
- Weapon type (Sword, Axe, Mace, etc.)
- Base damage (dice notation with damage type)
- Attack speed
- DPS calculation
- Weapon stats (crit, hit, etc.)

#### For Armor:
- Armor slot (Chest, Head, Legs, etc.)
- Armor type (Cloth, Leather, Mail, Plate)
- Armor class value
- Durability

#### For Accessories:
- Accessory slot (Ring, Necklace, Trinket, etc.)
- Accessory type

#### For Consumables:
- Consumable type (Potion, Food, Elixir, etc.)
- Effect description
- Duration
- Cooldown
- Charges/uses

#### For Miscellaneous Items:
- Subtype-specific information:
  - **Quest items**: Quest giver, objectives, rewards
  - **Reagents**: Reagent type, magic type, potency
  - **Keys**: Key type, unlocks, location, security level
  - **Recipes**: Creates item, required profession, skill level
  - **Trade goods**: Stack size, vendor value
  - **Junk**: Vendor value

#### Stats Display:
- **Base stats** (Strength, Agility, Constitution, Intelligence, Spirit, Charisma)
- **On Equip effects**:
  - Resistances (Fire, Ice, Lightning, Nature, Shadow, Arcane)
  - Combat stats (Armor, Dodge, Parry, Block)
  - Utility stats (Movement Speed, Carrying Capacity)
  - Spell damage bonuses
  - Proc effects (Chance on hit/being hit)

#### Additional Information:
- **Sell value** (in platinum/gold/silver/copper)
- **Weight** (for encumbrance)
- **Durability** (current/max)
- **Soulbound status**
- **Unique status**
- **Set information** (if part of a set)
- **Special instructions** (for quest items, etc.)

---

## Quality Colors

The tooltip uses WoW-style quality colors:

| Quality    | Border Color | Text Color | Glow Effect |
|------------|--------------|------------|-------------|
| Poor       | #9d9d9d      | #9d9d9d    | Gray        |
| Common     | #ffffff      | #ffffff    | White       |
| Uncommon   | #1eff00      | #1eff00    | Green       |
| Rare       | #0070dd      | #0070dd    | Blue        |
| Epic       | #a335ee      | #a335ee    | Purple      |
| Legendary  | #ff8000      | #ff8000    | Orange      |
| Artifact   | #e6cc80      | #e6cc80    | Gold        |

---

## Tooltip Positioning

The tooltip is rendered using React Portal to ensure it appears above all other elements:

- **Position**: Fixed
- **Offset**: 15px right, 10px up from cursor
- **Z-index**: 999999999 (maximum)
- **Pointer events**: None (doesn't interfere with mouse)
- **Portal target**: document.body

---

## Benefits of Using ItemTooltip

### 1. **Consistency**
- Same tooltip appearance across entire application
- Inventory, shop, quest log, and equipment selection all use identical tooltips

### 2. **Comprehensive Information**
- Shows all item properties, not just basic info
- Displays weapon damage, armor class, stat bonuses, etc.
- Shows special effects, proc chances, and set bonuses

### 3. **Professional Appearance**
- WoW-style quality colors and borders
- Proper typography and spacing
- Glowing effects for quality tiers

### 4. **Maintainability**
- Single source of truth for tooltip rendering
- Changes to ItemTooltip automatically apply everywhere
- No duplicate CSS or logic

### 5. **Future-Proof**
- New item properties automatically display
- Set bonuses, enchantments, gems all supported
- Recipe tooltips show crafting requirements

---

## Testing

To verify the tooltip works correctly:

1. Navigate to character creation
2. Complete steps 1-8
3. Reach Equipment Selection (Step 9)
4. Hover over any item in the shop
5. Verify tooltip shows:
   - Item icon with quality border
   - Item name with quality color
   - Item type and subtype
   - Full description
   - All stats and bonuses
   - Sell value and weight

---

## Files Modified

1. `vtt-react/src/components/character-creation-wizard/steps/Step10EquipmentSelection.jsx`
   - Added ItemTooltip import
   - Added createPortal import
   - Replaced custom tooltip with ItemTooltip component

2. `vtt-react/src/components/character-creation-wizard/styles/EquipmentSelection.css`
   - Removed 75+ lines of custom tooltip CSS
   - Added comment referencing ItemTooltip component

---

## Status

✅ **Complete** - Equipment selection now uses the comprehensive ItemTooltip component for consistent, professional item display across the entire application.

The tooltip system is now fully aligned with the rest of the application, providing players with detailed item information in a familiar, WoW-style format.

