// Loot item utilities for creature management

// Item rarity types
export const ITEM_RARITIES = {
  COMMON: { name: 'Common', color: '#9ca3af', dropChance: 0.7 },
  UNCOMMON: { name: 'Uncommon', color: '#10b981', dropChance: 0.2 },
  RARE: { name: 'Rare', color: '#3b82f6', dropChance: 0.07 },
  EPIC: { name: 'Epic', color: '#8b5cf6', dropChance: 0.025 },
  LEGENDARY: { name: 'Legendary', color: '#f59e0b', dropChance: 0.005 }
};

// Item categories
export const ITEM_CATEGORIES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  JEWELRY: 'jewelry',
  CONSUMABLE: 'consumable',
  MATERIAL: 'material',
  QUEST: 'quest',
  MISC: 'misc'
};

// Generate random loot based on creature level and type
export function generateLoot(creatureLevel = 1, creatureType = 'humanoid', lootTable = null) {
  const loot = [];
  
  if (lootTable && lootTable.length > 0) {
    // Use custom loot table
    lootTable.forEach(entry => {
      if (Math.random() < entry.dropChance) {
        loot.push({
          ...entry.item,
          quantity: entry.quantity || 1
        });
      }
    });
  } else {
    // Generate default loot based on creature level
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    
    for (let i = 0; i < numItems; i++) {
      const item = generateRandomItem(creatureLevel, creatureType);
      if (item) {
        loot.push(item);
      }
    }
  }
  
  return loot;
}

// Generate a random item
export function generateRandomItem(level = 1, creatureType = 'humanoid') {
  const rarityRoll = Math.random();
  let rarity = ITEM_RARITIES.COMMON;
  
  // Determine rarity based on level and roll
  const levelBonus = Math.min(level * 0.01, 0.1); // Up to 10% bonus
  
  if (rarityRoll < ITEM_RARITIES.LEGENDARY.dropChance + levelBonus) {
    rarity = ITEM_RARITIES.LEGENDARY;
  } else if (rarityRoll < ITEM_RARITIES.EPIC.dropChance + levelBonus) {
    rarity = ITEM_RARITIES.EPIC;
  } else if (rarityRoll < ITEM_RARITIES.RARE.dropChance + levelBonus) {
    rarity = ITEM_RARITIES.RARE;
  } else if (rarityRoll < ITEM_RARITIES.UNCOMMON.dropChance + levelBonus) {
    rarity = ITEM_RARITIES.UNCOMMON;
  }
  
  // Generate item based on creature type
  const category = getRandomCategory(creatureType);
  const itemName = generateItemName(category, rarity);
  
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: itemName,
    category: category,
    rarity: rarity.name.toLowerCase(),
    level: level,
    value: calculateItemValue(level, rarity),
    stats: generateItemStats(level, rarity, category),
    description: generateItemDescription(itemName, rarity, category)
  };
}

// Get random item category based on creature type
function getRandomCategory(creatureType) {
  const categoryWeights = {
    humanoid: {
      [ITEM_CATEGORIES.WEAPON]: 0.3,
      [ITEM_CATEGORIES.ARMOR]: 0.3,
      [ITEM_CATEGORIES.JEWELRY]: 0.1,
      [ITEM_CATEGORIES.CONSUMABLE]: 0.2,
      [ITEM_CATEGORIES.MISC]: 0.1
    },
    beast: {
      [ITEM_CATEGORIES.MATERIAL]: 0.4,
      [ITEM_CATEGORIES.CONSUMABLE]: 0.3,
      [ITEM_CATEGORIES.MISC]: 0.3
    },
    undead: {
      [ITEM_CATEGORIES.JEWELRY]: 0.2,
      [ITEM_CATEGORIES.CONSUMABLE]: 0.3,
      [ITEM_CATEGORIES.MATERIAL]: 0.3,
      [ITEM_CATEGORIES.MISC]: 0.2
    }
  };
  
  const weights = categoryWeights[creatureType] || categoryWeights.humanoid;
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [category, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll < cumulative) {
      return category;
    }
  }
  
  return ITEM_CATEGORIES.MISC;
}

// Generate item name
function generateItemName(category, rarity) {
  const prefixes = {
    common: ['Simple', 'Basic', 'Plain', 'Crude'],
    uncommon: ['Fine', 'Quality', 'Sturdy', 'Polished'],
    rare: ['Masterwork', 'Superior', 'Enchanted', 'Refined'],
    epic: ['Exquisite', 'Magnificent', 'Legendary', 'Mystical'],
    legendary: ['Divine', 'Celestial', 'Godlike', 'Transcendent']
  };
  
  const baseNames = {
    weapon: ['Sword', 'Axe', 'Bow', 'Staff', 'Dagger', 'Mace'],
    armor: ['Helmet', 'Chestplate', 'Boots', 'Gloves', 'Shield'],
    jewelry: ['Ring', 'Amulet', 'Bracelet', 'Earrings'],
    consumable: ['Potion', 'Scroll', 'Elixir', 'Tonic'],
    material: ['Hide', 'Bone', 'Scale', 'Essence', 'Crystal'],
    misc: ['Trinket', 'Ornament', 'Relic', 'Artifact']
  };
  
  const prefix = prefixes[rarity.name.toLowerCase()][Math.floor(Math.random() * prefixes[rarity.name.toLowerCase()].length)];
  const baseName = baseNames[category][Math.floor(Math.random() * baseNames[category].length)];
  
  return `${prefix} ${baseName}`;
}

// Calculate item value
function calculateItemValue(level, rarity) {
  const baseValue = level * 10;
  const rarityMultiplier = {
    common: 1,
    uncommon: 2,
    rare: 5,
    epic: 10,
    legendary: 25
  };
  
  return Math.floor(baseValue * rarityMultiplier[rarity.name.toLowerCase()]);
}

// Generate item stats
function generateItemStats(level, rarity, category) {
  const stats = {};
  
  if (category === ITEM_CATEGORIES.WEAPON || category === ITEM_CATEGORIES.ARMOR) {
    const statBonus = Math.floor(level / 5) + 1;
    const rarityBonus = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 5,
      legendary: 8
    }[rarity.name.toLowerCase()];
    
    const totalBonus = statBonus + rarityBonus;
    
    if (category === ITEM_CATEGORIES.WEAPON) {
      stats.damage = totalBonus;
    } else {
      stats.armorClass = totalBonus;
    }
    
    // Random secondary stats
    if (Math.random() < 0.5) {
      const secondaryStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
      const stat = secondaryStats[Math.floor(Math.random() * secondaryStats.length)];
      stats[stat] = Math.floor(totalBonus / 2) + 1;
    }
  }
  
  return stats;
}

// Generate item description
function generateItemDescription(name, rarity, category) {
  const descriptions = {
    weapon: 'A reliable weapon for combat.',
    armor: 'Protective gear for defense.',
    jewelry: 'An ornate piece of jewelry.',
    consumable: 'A useful consumable item.',
    material: 'Raw material for crafting.',
    misc: 'A miscellaneous item of unknown purpose.'
  };
  
  return descriptions[category] || 'A mysterious item.';
}

// Validate loot table entry
export function validateLootEntry(entry) {
  const errors = [];
  
  if (!entry.item || !entry.item.name) {
    errors.push('Item must have a name');
  }
  
  if (typeof entry.dropChance !== 'number' || entry.dropChance < 0 || entry.dropChance > 1) {
    errors.push('Drop chance must be a number between 0 and 1');
  }
  
  if (entry.quantity && (typeof entry.quantity !== 'number' || entry.quantity < 1)) {
    errors.push('Quantity must be a positive number');
  }
  
  return errors;
}

export default {
  ITEM_RARITIES,
  ITEM_CATEGORIES,
  generateLoot,
  generateRandomItem,
  validateLootEntry
};
