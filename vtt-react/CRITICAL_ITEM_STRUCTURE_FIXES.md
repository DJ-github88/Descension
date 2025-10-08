# CRITICAL Item Structure Fixes Required

## Summary of Issues

After thorough review of ItemWizard.jsx and itemStore.js, the following critical errors were found in the starting equipment data:

---

## 1. SHIELDS ARE ARMOR, NOT WEAPONS

### ❌ WRONG:
```javascript
{
    type: 'weapon',
    slots: ['mainHand'],  // SHIELDS CANNOT BE MAIN HAND
    weaponSlot: 'ONE_HANDED'
}
```

### ✅ CORRECT:
```javascript
{
    type: 'armor',
    subtype: 'SHIELD',
    slots: ['offHand'],  // Note: 'offHand' NOT 'off_hand'
    armorClass: 2,  // NOT combatStats.armorClass
    baseStats: {
        constitution: { value: 2, isPercentage: false }
    }
}
```

---

## 2. Armor Subtypes

### ❌ WRONG:
- `subtype: 'LIGHT'`
- `subtype: 'MEDIUM'`
- `subtype: 'HEAVY'`

### ✅ CORRECT:
- `subtype: 'CLOTH'` - For robes, padded armor
- `subtype: 'LEATHER'` - For leather, hide armor
- `subtype: 'MAIL'` - For chainmail
- `subtype: 'PLATE'` - For plate armor

---

## 3. Miscellaneous Items - ALL REQUIRE `rotation: 0`

### ❌ MISSING:
```javascript
{
    type: 'miscellaneous',
    subtype: 'TOOL',
    // NO rotation property
}
```

### ✅ CORRECT:
```javascript
{
    type: 'miscellaneous',
    subtype: 'TOOL',
    rotation: 0  // REQUIRED FOR ALL MISC ITEMS
}
```

---

## 4. Miscellaneous Subtype-Specific Properties

### TOOL Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'TOOL',
    rotation: 0,
    // Optional: stackable, maxStackSize
}
```

### REAGENT Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'REAGENT',
    rotation: 0,
    stackable: true,
    maxStackSize: 5-20,
    reagentType: 'Essence|Scale|Feather|Crystal|Herb|Root|Catalyst',
    magicType: 'fire|ice|lightning|nature|shadow|arcane|holy',
    reagentState: 'Pure|Raw|Refined|Crystalline',
    requiredFor: 'Description of what it\'s used for'
}
```

### CRAFTING Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    rotation: 0,
    stackable: true,
    maxStackSize: 5-20,
    materialType: 'Metal|Wood|Leather|Cloth|Stone|Gem|Crystal|Glass|Powder',
    professions: ['Blacksmithing', 'Leatherworking', etc.],
    gatheringMethod: 'mining|logging|skinning|harvesting|quarrying|crafting|smelting|vendor'
}
```

### TRADE_GOODS Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    rotation: 0,
    stackable: true,
    maxStackSize: 3-5,
    tradeCategory: 'metals|textiles|consumables|luxury|gems|spices|art',
    origin: 'Local|Regional|Imported|Exotic',
    demandLevel: 'Low|Moderate|High|Very High',
    qualityGrade: 'Standard|Fine|Superior|Premium|Exceptional'
}
```

### QUEST Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'QUEST',
    rotation: 0,
    stackable: false,
    value: { gold: 0, silver: 0, copper: 0 },  // Usually 0
    questGiver: 'NPC Name',
    questObjectives: 'What to do',
    requiredLevel: number,
    timeLimit: number_or_null
}
```

### KEY Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'KEY',
    rotation: 0,
    keyType: 'door|chest|container',
    keyId: 'UNIQUE_ID',
    unlocks: 'What it unlocks',
    location: 'Where it\'s used',
    securityLevel: 'basic|advanced|master'
}
```

### JUNK Items:
```javascript
{
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    rotation: 0,
    stackable: true,
    maxStackSize: 5-20,
    junkType: 'Remains|Fragment|Debris|Refuse|Scrap',
    condition: 'Broken|Tattered|Damaged|Ruined|Worn',
    origin: 'Battlefield|Abandoned|Discarded|Salvaged|Roadside',
    estimatedValue: 'Negligible|Minimal'
}
```

---

## 5. Consumable Effects

### ❌ WRONG:
```javascript
{
    type: 'consumable',
    subtype: 'POTION',
    consumableEffect: {  // WRONG PROPERTY NAME
        type: 'healing',
        amount: '2d4+2'  // WRONG FORMAT
    }
}
```

### ✅ CORRECT (Healing):
```javascript
{
    type: 'consumable',
    subtype: 'POTION',
    combatStats: {
        healthRestore: { value: 25, isPercentage: false }
    }
}
```

### ✅ CORRECT (Mana):
```javascript
{
    type: 'consumable',
    subtype: 'POTION',
    combatStats: {
        manaRestore: { value: 30, isPercentage: false }
    }
}
```

### ✅ CORRECT (Buff/Debuff):
```javascript
{
    type: 'consumable',
    subtype: 'ELIXIR',
    effects: [
        {
            type: 'buff',
            stat: 'strength',
            amount: 3,
            duration: 600  // seconds
        }
    ]
}
```

---

## 6. Armor Properties

### ❌ WRONG:
```javascript
{
    type: 'armor',
    combatStats: {
        armorClass: { value: 2, isPercentage: false }
    }
}
```

### ✅ CORRECT:
```javascript
{
    type: 'armor',
    armorClass: 2  // Direct property, NOT in combatStats
}
```

---

## 7. Weapon Slots

### Correct slot values:
- `slots: ['mainHand']` - Main hand only
- `slots: ['offHand']` - Off hand only (daggers, shields as armor)
- `slots: ['mainHand', 'offHand']` - Can be used in either hand

### Correct weaponSlot values:
- `weaponSlot: 'ONE_HANDED'` - One-handed weapons
- `weaponSlot: 'TWO_HANDED'` - Two-handed weapons
- `weaponSlot: 'RANGED'` - Ranged weapons

### Correct hand values (for ONE_HANDED weapons):
- `hand: 'ONE_HAND'` - Can be used in either hand
- `hand: 'MAIN_HAND'` - Main hand only
- `hand: 'OFF_HAND'` - Off hand only

---

## 8. Required Properties for ALL Items

```javascript
{
    id: 'unique-id',
    name: 'Item Name',
    type: 'weapon|armor|accessory|consumable|container|miscellaneous',
    subtype: 'SPECIFIC_SUBTYPE',
    quality: 'poor|common|uncommon|rare|epic|legendary',
    description: 'Item description',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    width: 1-3,
    height: 1-3,
    // Optional but common:
    weight: number,
    stackable: true/false,
    maxStackSize: number
}
```

---

## 9. Image URL (Optional but Recommended)

```javascript
{
    iconId: 'inv_sword_04',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg'
}
```

---

## Files That Need Fixing

1. ✅ `startingEquipmentData.js` - Partially fixed (armor subtypes, consumables, rings)
2. ❌ `equipment/classEquipment.js` - Needs complete review
3. ❌ `equipment/raceEquipment.js` - Needs complete review
4. ❌ `equipment/pathEquipment.js` - Needs complete review
5. ❌ `equipment/backgroundEquipment.js` - Needs complete review

---

## Action Plan

1. Remove ALL custom tooltip code (already done)
2. Fix ALL armor subtypes (LIGHT/MEDIUM/HEAVY → CLOTH/LEATHER/MAIL/PLATE)
3. Fix ALL shields (weapon → armor with subtype SHIELD)
4. Add `rotation: 0` to ALL miscellaneous items
5. Add subtype-specific properties to ALL miscellaneous items
6. Fix ALL consumable effects (use combatStats or effects array)
7. Fix armor armorClass property (direct, not in combatStats)
8. Add imageUrl to all items for consistency
9. Remove bloat/duplicate code

---

## Testing Checklist

After fixes:
- [ ] All tooltips display correctly with ItemTooltip component
- [ ] Shields appear as armor in off-hand slot
- [ ] Consumables show proper effects in tooltip
- [ ] Miscellaneous items show subtype-specific information
- [ ] No console errors
- [ ] Items can be purchased and added to inventory
- [ ] Items display correct icons and quality colors

