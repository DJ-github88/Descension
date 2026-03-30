// Item Library Data
// This file contains placeholder data for the item library

export const ITEM_LIBRARY = [
  {
    id: 'arcane-focus-1',
    name: 'Crystal Arcane Focus',
    type: 'Arcane Focus',
    rarity: 'Uncommon',
    description: 'A crystal that focuses arcane energy for spellcasting.',
    icon: 'inv_misc_gem_amethyst_02',
    tags: ['arcane', 'focus', 'crystal'],
    cost: '10 gold',
    weight: '1 lb'
  },
  {
    id: 'component-pouch-1',
    name: 'Component Pouch',
    type: 'Spellcasting Focus',
    rarity: 'Common',
    description: 'A small, watertight leather belt pouch that has compartments to hold all the material components and other special items you need to cast your spells.',
    icon: 'inv_misc_bag_10',
    tags: ['pouch', 'components', 'spellcasting'],
    cost: '25 gold',
    weight: '2 lb'
  },
  {
    id: 'diamond-dust-1',
    name: 'Diamond Dust',
    type: 'Material Component',
    rarity: 'Uncommon',
    description: 'Fine diamond dust worth at least 100 gold pieces, used in various resurrection and protection spells.',
    icon: 'inv_misc_dust_01',
    tags: ['dust', 'diamond', 'resurrection'],
    cost: '100 gold',
    weight: '0.1 lb'
  },
  {
    id: 'ruby-powder-1',
    name: 'Ruby Powder',
    type: 'Material Component',
    rarity: 'Uncommon',
    description: 'Fine ruby powder worth at least 50 gold pieces, used in fire-based spells.',
    icon: 'inv_misc_powder_red',
    tags: ['powder', 'ruby', 'fire'],
    cost: '50 gold',
    weight: '0.1 lb'
  },
  {
    id: 'holy-symbol-1',
    name: 'Holy Symbol',
    type: 'Divine Focus',
    rarity: 'Common',
    description: 'A holy symbol is a representation of a god or pantheon. It might be an amulet depicting a symbol representing a deity, the same symbol carefully engraved or inlaid as an emblem on a shield, or a tiny box holding a fragment of a sacred relic.',
    icon: 'inv_jewelry_talisman_07',
    tags: ['holy', 'symbol', 'divine'],
    cost: '5 gold',
    weight: '1 lb'
  },
  {
    id: 'incense-1',
    name: 'Incense',
    type: 'Material Component',
    rarity: 'Common',
    description: 'Incense used in various divination and protection spells.',
    icon: 'inv_misc_dust_02',
    tags: ['incense', 'divination', 'protection'],
    cost: '1 gold',
    weight: '0.1 lb'
  },
  {
    id: 'rare-herbs-1',
    name: 'Rare Herbs',
    type: 'Material Component',
    rarity: 'Uncommon',
    description: 'A collection of rare herbs used in healing and nature spells.',
    icon: 'inv_misc_herb_03',
    tags: ['herbs', 'healing', 'nature'],
    cost: '25 gold',
    weight: '0.5 lb'
  },
  {
    id: 'phosphorus-1',
    name: 'Phosphorus',
    type: 'Material Component',
    rarity: 'Uncommon',
    description: 'A small amount of phosphorus used in fire-based spells.',
    icon: 'inv_misc_powder_yellow',
    tags: ['phosphorus', 'fire', 'light'],
    cost: '10 gold',
    weight: '0.1 lb'
  },
  {
    id: 'bat-guano-1',
    name: 'Bat Guano',
    type: 'Material Component',
    rarity: 'Common',
    description: 'Bat guano used in the fireball spell.',
    icon: 'inv_misc_dust_04',
    tags: ['guano', 'bat', 'fire'],
    cost: '1 silver',
    weight: '0.1 lb'
  },
  {
    id: 'sulfur-1',
    name: 'Sulfur',
    type: 'Material Component',
    rarity: 'Common',
    description: 'A small amount of sulfur used in fire-based spells.',
    icon: 'inv_misc_powder_purple',
    tags: ['sulfur', 'fire', 'explosive'],
    cost: '1 gold',
    weight: '0.1 lb'
  },
  {
    id: 'copper-wire-1',
    name: 'Copper Wire',
    type: 'Material Component',
    rarity: 'Common',
    description: 'A piece of copper wire used in various communication spells.',
    icon: 'inv_misc_wire',
    tags: ['copper', 'wire', 'communication'],
    cost: '1 gold',
    weight: '0.1 lb'
  },
  {
    id: 'tiny-bell-1',
    name: 'Tiny Bell',
    type: 'Material Component',
    rarity: 'Common',
    description: 'A tiny bell used in various alarm and notification spells.',
    icon: 'inv_misc_bell_01',
    tags: ['bell', 'alarm', 'sound'],
    cost: '1 gold',
    weight: '0.1 lb'
  }
];

// Function to get an item by ID
export const getItemById = (id) => {
  return ITEM_LIBRARY.find(item => item.id === id);
};

// Function to search items by name or tags
export const searchItems = (query) => {
  const lowerQuery = query.toLowerCase();
  return ITEM_LIBRARY.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Function to get items by type
export const getItemsByType = (type) => {
  return ITEM_LIBRARY.filter(item => item.type === type);
};

// Function to get all material components
export const getMaterialComponents = () => {
  return ITEM_LIBRARY.filter(item => item.type === 'Material Component');
};

// Function to get all spellcasting focuses
export const getSpellcastingFocuses = () => {
  return ITEM_LIBRARY.filter(item => 
    item.type === 'Arcane Focus' || 
    item.type === 'Divine Focus' || 
    item.type === 'Spellcasting Focus'
  );
};
