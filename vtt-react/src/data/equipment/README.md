# Starting Equipment System - Developer Guide

## Overview

The starting equipment system allows players to purchase gear during character creation using currency determined by their background and path choices. Items are filtered based on character selections (class, race, subrace, path, background).

---

## File Structure

```
vtt-react/src/data/
├── startingCurrencyData.js          # Currency calculations and utilities
├── startingEquipmentData.js         # Main equipment library and filtering
└── equipment/
    ├── classEquipment.js            # Class-specific items (27 classes)
    ├── raceEquipment.js             # Race/subrace-specific items
    ├── pathEquipment.js             # Path-specific items (9 paths)
    └── backgroundEquipment.js       # Background-specific items (8 backgrounds)
```

---

## Adding New Items

### 1. Choose the Right File

- **Universal items** → `startingEquipmentData.js` (UNIVERSAL_STARTING_ITEMS array)
- **Class-specific** → `equipment/classEquipment.js` (add to appropriate class array)
- **Race-specific** → `equipment/raceEquipment.js` (add to appropriate race array)
- **Path-specific** → `equipment/pathEquipment.js` (add to appropriate path array)
- **Background-specific** → `equipment/backgroundEquipment.js` (add to appropriate background array)

### 2. Item Template

```javascript
{
    id: 'unique-item-id',                    // Must be unique across all items
    name: 'Item Display Name',
    type: 'weapon|armor|accessory|container|consumable|miscellaneous',
    subtype: 'SPECIFIC_SUBTYPE',             // e.g., 'SWORD', 'CLOTH', 'RING'
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'Detailed item description shown in tooltip',
    iconId: 'wow_icon_name',                 // WoW icon ID (without .jpg)
    value: { 
        platinum: 0, 
        gold: X,                             // Main currency for starting items
        silver: Y, 
        copper: Z 
    },
    weight: number,                          // In pounds
    width: number,                           // Grid width (1-3)
    height: number,                          // Grid height (1-3)
    
    // For equippable items
    slots: ['mainHand', 'offHand', 'chest', 'head', 'neck', 'ring1', 'ring2', 'trinket1', 'trinket2', 'waist'],
    
    // For weapons
    weaponSlot: 'ONE_HANDED|TWO_HANDED|OFF_HAND',
    hand: 'ONE_HAND|TWO_HAND|OFF_HAND|DUAL_WIELD',
    weaponStats: {
        baseDamage: {
            diceCount: 1,
            diceType: 8,                     // d4, d6, d8, d10, d12
            damageType: 'slashing|piercing|bludgeoning|fire|ice|lightning|arcane|necrotic|radiant|poison|nature|chaos'
        }
    },
    
    // For armor
    combatStats: {
        armorClass: { value: 2, isPercentage: false }
    },
    
    // For stat bonuses
    baseStats: {
        strength: { value: 1, isPercentage: false },
        agility: { value: 1, isPercentage: false },
        constitution: { value: 1, isPercentage: false },
        intelligence: { value: 1, isPercentage: false },
        spirit: { value: 1, isPercentage: false },
        charisma: { value: 1, isPercentage: false }
    },
    
    // For containers
    containerProperties: {
        isLocked: false,
        gridSize: { rows: 4, cols: 4 },
        items: []
    },
    
    // For stackable items
    stackable: true,
    maxStackSize: 5,
    
    // Availability criteria (at least one must be specified)
    availableFor: {
        universal: true,                     // Available to everyone
        classes: ['Pyrofiend', 'Minstrel'],  // Only these classes
        races: ['human', 'elf'],             // Only these races
        subraces: ['highElf', 'woodElf'],    // Only these subraces
        paths: ['mystic', 'zealot'],         // Only these paths
        backgrounds: ['acolyte', 'sage']     // Only these backgrounds
    }
}
```

### 3. Example: Adding a New Weapon

```javascript
// In equipment/classEquipment.js, add to PYROFIEND_ITEMS array:

{
    id: 'pyrofiend-fire-whip',
    name: 'Flame Whip',
    type: 'weapon',
    subtype: 'WHIP',
    quality: 'uncommon',
    description: 'A whip wreathed in flames. Burns enemies with each strike.',
    iconId: 'inv_weapon_whip_01',
    value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
    weight: 2,
    width: 1,
    height: 2,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'ONE_HAND',
    weaponStats: {
        baseDamage: {
            diceCount: 1,
            diceType: 6,
            damageType: 'fire'
        }
    },
    baseStats: {
        agility: { value: 1, isPercentage: false },
        intelligence: { value: 1, isPercentage: false }
    },
    availableFor: {
        classes: ['Pyrofiend']
    }
}
```

---

## Currency System

### Starting Currency Formula

```javascript
Total = Background Base + Path Modifier
```

### Background Base Currency

| Background | Gold |
|------------|------|
| Acolyte    | 15   |
| Criminal   | 20   |
| Folk Hero  | 10   |
| Noble      | 50   |
| Sage       | 18   |
| Soldier    | 12   |
| Outlander  | 8    |
| Charlatan  | 25   |

### Path Modifiers

| Path       | Bonus Gold |
|------------|------------|
| Mystic     | +5         |
| Zealot     | +3         |
| Trickster  | +10        |
| Harrow     | +2         |
| Arcanist   | +7         |
| Hexer      | +4         |
| Reaver     | +6         |
| Mercenary  | +8         |
| Sentinel   | +5         |

### Currency Conversion

- 100 copper = 1 silver
- 100 silver = 1 gold
- 100 gold = 1 platinum

---

## Item Pricing Guidelines

### Weapons
- **Simple weapons** (dagger, club): 1-3 gold
- **Martial weapons** (longsword, battleaxe): 5-10 gold
- **Exotic weapons** (whip, scimitar): 10-15 gold
- **Class-specific weapons**: 10-18 gold

### Armor
- **Light armor** (padded, leather): 5-10 gold
- **Medium armor** (hide, chain shirt): 10-15 gold
- **Heavy armor** (chainmail, plate): 15-30 gold

### Accessories
- **Simple accessories** (plain ring): 1-5 gold
- **Quality accessories** (signet ring): 10-20 gold

### Consumables
- **Basic potions**: 5-10 gold
- **Food/rations**: 1-3 gold
- **Utility items**: 1-5 gold

### Miscellaneous
- **Tools**: 2-10 gold
- **Containers**: 2-5 gold
- **Books**: 5-15 gold

---

## WoW Icon IDs

Icons are loaded from: `https://wow.zamimg.com/images/wow/icons/large/{iconId}.jpg`

### Finding Icons

1. Visit https://www.wowhead.com/items
2. Search for similar items
3. Inspect the icon URL
4. Extract the icon ID (e.g., `inv_sword_04`)

### Common Icon Patterns

- **Weapons**: `inv_weapon_*`, `inv_sword_*`, `inv_axe_*`, `inv_mace_*`
- **Armor**: `inv_chest_*`, `inv_helmet_*`, `inv_shoulder_*`
- **Accessories**: `inv_jewelry_*`, `inv_misc_*`
- **Potions**: `inv_potion_*`
- **Books**: `inv_misc_book_*`
- **Tools**: `inv_misc_*`

---

## Testing New Items

1. **Add the item** to the appropriate file
2. **Restart the dev server** (Ctrl+C, then `npm start`)
3. **Create a test character** with the required class/race/path/background
4. **Navigate to Equipment Selection** (Step 9)
5. **Verify the item appears** in the correct category
6. **Test purchasing** the item
7. **Check tooltip** displays correctly
8. **Verify currency** deducts properly

---

## Common Issues

### Item Not Appearing

- Check `availableFor` criteria matches your test character
- Verify item is added to the correct array
- Ensure item is exported in the combined array
- Check for typos in class/race/path/background names

### Icon Not Loading

- Verify icon ID is correct (no `.jpg` extension)
- Check icon exists on wowhead.com
- Fallback icon will show if ID is invalid

### Currency Issues

- Ensure `value` object has at least one currency field
- Check currency calculations in `startingCurrencyData.js`
- Verify background and path are set correctly

---

## Best Practices

1. **Unique IDs**: Always use unique, descriptive IDs (e.g., `pyrofiend-flame-staff`)
2. **Consistent Naming**: Follow existing naming conventions
3. **Balanced Pricing**: Keep prices reasonable for starting characters
4. **Thematic Items**: Items should fit the class/race/path theme
5. **Quality Distribution**: Most starting items should be common/uncommon
6. **Weight Matters**: Consider encumbrance when setting weight
7. **Grid Size**: Most items are 1x1, 1x2, or 2x2
8. **Stat Bonuses**: Keep bonuses modest (+1 to +3 for starting gear)
9. **Descriptions**: Write clear, flavorful descriptions
10. **Test Thoroughly**: Always test new items in-game

---

## Future Expansion Ideas

- **Seasonal Items**: Holiday-themed equipment
- **Regional Items**: Items specific to game regions
- **Crafted Items**: Items that can be crafted
- **Quest Rewards**: Items earned through quests
- **Faction Items**: Items tied to factions
- **Legendary Starts**: Rare legendary starting items
- **Item Sets**: Matching equipment sets with bonuses
- **Cursed Items**: Items with drawbacks
- **Magical Variants**: Enhanced versions of basic items
- **Cultural Items**: Items tied to character culture/heritage

