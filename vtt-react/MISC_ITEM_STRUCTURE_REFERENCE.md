# Miscellaneous Item Structure Reference

## Overview
Miscellaneous items have VERY specific structures based on their subtype. Each subtype requires different properties to display correctly in tooltips.

---

## Subtype: TOOL

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'What the tool does',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    width: 1-3,
    height: 1-3,
    rotation: 0,
    // Optional:
    weight: number,
    stackable: true/false,
    maxStackSize: number
}
```

**Example:**
```javascript
{
    id: 'smiths-hammer',
    name: "Smith's Hammer",
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'A well-balanced hammer used by blacksmiths to forge weapons and armor. Essential for any metalworking.',
    iconId: 'inv_hammer_01',
    value: { gold: 1, silver: 2, copper: 0 },
    width: 1,
    height: 2,
    rotation: 0
}
```

---

## Subtype: REAGENT

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'What the reagent is used for',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5-20,
    reagentType: 'Essence|Scale|Feather|Crystal|Herb|Root|Catalyst',
    magicType: 'fire|ice|lightning|nature|shadow|arcane|holy',
    reagentState: 'Pure|Raw|Refined|Crystalline',
    requiredFor: 'What it\'s used for'
}
```

**Example:**
```javascript
{
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'rare',
    description: 'A brilliant feather that glows with inner fire. Said to retain the phoenix\'s power of rebirth.',
    iconId: 'inv_feather_16',
    value: { gold: 2, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    reagentType: 'Feather',
    magicType: 'fire',
    reagentState: 'Raw',
    requiredFor: 'Resurrection and fire magic'
}
```

---

## Subtype: CRAFTING

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'What the material is',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    width: 1-2,
    height: 1-2,
    rotation: 0,
    stackable: true,
    maxStackSize: 5-20,
    materialType: 'Metal|Wood|Leather|Cloth|Stone|Gem|Crystal|Glass|Powder',
    professions: ['Blacksmithing', 'Leatherworking', 'Tailoring', 'Alchemy', 'Enchanting', 'Jewelcrafting', 'Carpentry', 'Engineering'],
    gatheringMethod: 'mining|logging|skinning|harvesting|quarrying|crafting|smelting|vendor'
}
```

**Example:**
```javascript
{
    id: 'steel-ingot',
    name: 'Steel Ingot',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'A refined steel ingot, harder and more durable than iron. Essential for crafting superior weapons and armor.',
    iconId: 'inv_ingot_steel',
    value: { gold: 0, silver: 7, copper: 50 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Metal',
    professions: ['Blacksmithing', 'Engineering'],
    gatheringMethod: 'smelting'
}
```

---

## Subtype: TRADE_GOODS

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'poor|common|uncommon|rare|epic|legendary',
    description: 'What the trade good is',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    stackable: true,
    maxStackSize: 3-5,
    width: 1-2,
    height: 1-2,
    rotation: 0,
    tradeCategory: 'metals|textiles|consumables|luxury|gems|spices|art',
    origin: 'Local|Regional|Imported|Exotic',
    demandLevel: 'Low|Moderate|High|Very High',
    qualityGrade: 'Standard|Fine|Superior|Premium|Exceptional'
}
```

**Example:**
```javascript
{
    id: 'exotic-spices',
    name: 'Exotic Spices',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'rare',
    description: 'A collection of rare spices from distant lands. Highly valued by chefs and alchemists alike.',
    iconId: 'inv_misc_food_15',
    value: { gold: 2, silver: 3, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'consumables',
    origin: 'Exotic',
    demandLevel: 'Very High',
    qualityGrade: 'Premium'
}
```

---

## Subtype: QUEST

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'What the quest item is',
    iconId: 'wow_icon_name',
    value: { gold: 0, silver: 0, copper: 0 }, // Usually 0 for quest items
    width: 1-2,
    height: 1-2,
    rotation: 0,
    stackable: false,
    questGiver: 'NPC Name',
    questObjectives: 'What to do with this item',
    requiredLevel: number,
    timeLimit: number_in_seconds_or_0_for_none
}
```

**Example:**
```javascript
{
    id: 'ancient-tome',
    name: 'Ancient Tome of Secrets',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'rare',
    description: 'A weathered book filled with arcane knowledge. The pages seem to whisper ancient secrets.',
    iconId: 'inv_misc_book_11',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    questGiver: 'Archmage Valdris',
    questObjectives: 'Decipher the ancient runes and unlock the tome\'s secrets',
    requiredLevel: 15,
    timeLimit: 0
}
```

---

## Subtype: KEY

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'common|uncommon|rare|epic|legendary',
    description: 'What the key opens',
    iconId: 'wow_icon_name',
    value: { gold: 0, silver: 0-1, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'door|chest|container',
    keyId: 'UNIQUE_KEY_ID',
    unlocks: 'What it unlocks',
    location: 'Where it\'s used',
    securityLevel: 'basic|advanced|master'
}
```

**Example:**
```javascript
{
    id: 'dungeon-master-key',
    name: 'Dungeon Master Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'rare',
    description: 'An ornate key made of blackened steel, inscribed with ancient runes. Opens the deepest chambers of forgotten dungeons.',
    iconId: 'inv_misc_key_10',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'door',
    keyId: 'DUNGEON01',
    unlocks: 'Ancient Dungeon Chambers',
    location: 'Forgotten Depths',
    securityLevel: 'master'
}
```

---

## Subtype: JUNK

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'What the junk item is',
    iconId: 'wow_icon_name',
    value: { gold: 0, silver: 0, copper: 1-50 }, // Low value
    weight: number,
    stackable: true,
    maxStackSize: 5-20,
    width: 1,
    height: 1-2,
    rotation: 0,
    junkType: 'Remains|Fragment|Debris|Refuse|Scrap',
    condition: 'Broken|Tattered|Damaged|Ruined|Worn',
    origin: 'Battlefield|Abandoned|Discarded|Salvaged|Roadside',
    estimatedValue: 'Negligible|Minimal'
}
```

**Example:**
```javascript
{
    id: 'bent-spoon',
    name: 'Bent Spoon',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A simple eating utensil that has seen better days. Might be worth a few coppers to the right person.',
    iconId: 'inv_misc_fork&knife',
    value: { gold: 0, silver: 0, copper: 3 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    junkType: 'Scrap',
    condition: 'Worn',
    origin: 'tavern',
    estimatedValue: 'Negligible'
}
```

---

## Subtype: UTILITY (Simple misc items)

**Required Properties:**
```javascript
{
    type: 'miscellaneous',
    subtype: 'UTILITY',
    quality: 'common',
    description: 'What the item does',
    iconId: 'wow_icon_name',
    value: { platinum: 0, gold: X, silver: Y, copper: Z },
    weight: number,
    width: 1-2,
    height: 1-2,
    // Optional:
    stackable: true/false,
    maxStackSize: number
}
```

**Example:**
```javascript
{
    id: 'starter-waterskin',
    name: 'Waterskin',
    type: 'miscellaneous',
    subtype: 'UTILITY',
    quality: 'common',
    description: 'A leather waterskin that holds enough water for a day.',
    iconId: 'inv_drink_05',
    value: { platinum: 0, gold: 0, silver: 20, copper: 0 },
    weight: 5,
    width: 1,
    height: 2
}
```

---

## Common Mistakes to Avoid

1. **Missing `rotation: 0`** - Always include this for misc items
2. **Wrong subtype** - Use exact subtypes from above (TOOL, REAGENT, CRAFTING, TRADE_GOODS, QUEST, KEY, JUNK, UTILITY)
3. **Missing required properties** - Each subtype has specific required properties
4. **Wrong value for quest items** - Quest items should have `value: { gold: 0, silver: 0, copper: 0 }`
5. **Missing stackable/maxStackSize** - Crafting materials, reagents, and trade goods should be stackable
6. **Missing imageUrl** - While optional, it's good to include for consistency

---

## Next Steps

Review all miscellaneous items in starting equipment files and ensure they match these structures exactly.

