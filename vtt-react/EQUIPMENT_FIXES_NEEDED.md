# Equipment Data Fixes Needed

## Issues Identified

### 1. Armor Subtypes - INCORRECT
**Current (Wrong):**
- `subtype: 'LIGHT'`
- `subtype: 'MEDIUM'`
- `subtype: 'HEAVY'`

**Correct (From itemStore.js):**
- `subtype: 'CLOTH'` - For robes, cloth armor
- `subtype: 'LEATHER'` - For leather armor, studded leather
- `subtype: 'PLATE'` - For chainmail, plate armor

### 2. Consumable Effects - MISSING FUNCTIONAL DATA
**Current (Wrong):**
```javascript
{
    type: 'consumable',
    subtype: 'POTION',
    description: 'Heals you',
    // NO ACTUAL EFFECT DATA
}
```

**Correct (From itemStore.js):**
```javascript
{
    type: 'consumable',
    subtype: 'POTION',
    description: 'A small vial of ruby-red liquid that restores a modest amount of health when consumed.',
    combatStats: {
        healthRestore: { value: 25, isPercentage: false }
    },
    // OR for buff/debuff potions:
    effects: [
        {
            type: 'buff',
            stat: 'strength',
            amount: 8,
            duration: 1800 // in seconds
        },
        {
            type: 'debuff',
            stat: 'spirit',
            amount: -4,
            duration: 3600
        }
    ]
}
```

### 3. Rings/Accessories - MISSING STATS
**Current (Wrong):**
```javascript
{
    type: 'accessory',
    subtype: 'RING',
    description: 'A nice ring',
    // NO STATS - NOT FUNCTIONAL
}
```

**Correct (From itemStore.js):**
```javascript
{
    type: 'accessory',
    subtype: 'RING',
    description: 'A simple copper ring with a small gemstone. Provides a minor magical enhancement.',
    slots: ['ring1', 'ring2'],
    baseStats: {
        constitution: { value: 1, isPercentage: false }
    }
}
```

---

## Files to Fix

### Priority 1: Universal Items
- [ ] `vtt-react/src/data/startingEquipmentData.js`
  - Fix armor subtypes (LIGHT → CLOTH or LEATHER)
  - Add combatStats to healing potions
  - Add effects to buff potions
  - Ensure all items have proper functional data

### Priority 2: Class Equipment
- [ ] `vtt-react/src/data/equipment/classEquipment.js`
  - Fix all armor subtypes
  - Add stats to all rings
  - Add effects to all consumables
  - Verify weapon damage types

### Priority 3: Race Equipment
- [ ] `vtt-react/src/data/equipment/raceEquipment.js`
  - Fix armor subtypes
  - Add stats to accessories
  - Add effects to consumables

### Priority 4: Path Equipment
- [ ] `vtt-react/src/data/equipment/pathEquipment.js`
  - Fix armor subtypes
  - Add stats to accessories
  - Add effects to consumables

### Priority 5: Background Equipment
- [ ] `vtt-react/src/data/equipment/backgroundEquipment.js`
  - Fix armor subtypes
  - Add stats to accessories
  - Add effects to consumables

---

## Consumable Effect Types

### Healing Potions
```javascript
combatStats: {
    healthRestore: { value: 25, isPercentage: false }
}
```

### Mana Potions
```javascript
combatStats: {
    manaRestore: { value: 30, isPercentage: false }
}
```

### Buff/Debuff Potions
```javascript
effects: [
    {
        type: 'buff',  // or 'debuff'
        stat: 'strength',  // strength, agility, constitution, intelligence, spirit, charisma
        amount: 3,  // positive for buff, negative for debuff
        duration: 600  // in seconds
    }
]
```

### Food (Health over time)
```javascript
combatStats: {
    healthRestore: { value: 15, isPercentage: false }
}
```

---

## Armor Subtype Reference

| Item Type | Correct Subtype | Examples |
|-----------|----------------|----------|
| Cloth robes | CLOTH | Apprentice Robe, Scholar's Robes |
| Padded armor | CLOTH | Padded Armor, Quilted Armor |
| Leather armor | LEATHER | Leather Armor, Studded Leather |
| Hide armor | LEATHER | Hide Armor, Dragonhide |
| Chainmail | PLATE | Chainmail, Chain Shirt |
| Plate armor | PLATE | Plate Armor, Full Plate |

---

## Accessory Stats Reference

All accessories (rings, necklaces, trinkets) should have at least one stat bonus:

```javascript
baseStats: {
    strength: { value: 1, isPercentage: false },
    // OR
    agility: { value: 1, isPercentage: false },
    // OR
    constitution: { value: 1, isPercentage: false },
    // OR
    intelligence: { value: 1, isPercentage: false },
    // OR
    spirit: { value: 1, isPercentage: false },
    // OR
    charisma: { value: 1, isPercentage: false }
}
```

---

## Next Steps

1. Fix startingEquipmentData.js (universal items)
2. Fix classEquipment.js (all 27 classes)
3. Fix raceEquipment.js (all races)
4. Fix pathEquipment.js (all 9 paths)
5. Fix backgroundEquipment.js (all 8 backgrounds)
6. Test in-game to verify tooltips show proper effects
7. Verify items are functional when equipped/consumed

