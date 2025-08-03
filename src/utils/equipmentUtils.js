// Equipment utilities for character management

// Equipment slot types
export const EQUIPMENT_SLOTS = {
  HEAD: 'head',
  NECK: 'neck',
  SHOULDERS: 'shoulders',
  CHEST: 'chest',
  WAIST: 'waist',
  LEGS: 'legs',
  FEET: 'feet',
  WRISTS: 'wrists',
  HANDS: 'hands',
  FINGER_1: 'finger1',
  FINGER_2: 'finger2',
  TRINKET_1: 'trinket1',
  TRINKET_2: 'trinket2',
  MAIN_HAND: 'mainHand',
  OFF_HAND: 'offHand',
  RANGED: 'ranged'
};

// Equipment types and their valid slots
export const EQUIPMENT_TYPES = {
  HELMET: { slots: [EQUIPMENT_SLOTS.HEAD], category: 'armor' },
  AMULET: { slots: [EQUIPMENT_SLOTS.NECK], category: 'jewelry' },
  PAULDRONS: { slots: [EQUIPMENT_SLOTS.SHOULDERS], category: 'armor' },
  CHESTPLATE: { slots: [EQUIPMENT_SLOTS.CHEST], category: 'armor' },
  BELT: { slots: [EQUIPMENT_SLOTS.WAIST], category: 'armor' },
  LEGGINGS: { slots: [EQUIPMENT_SLOTS.LEGS], category: 'armor' },
  BOOTS: { slots: [EQUIPMENT_SLOTS.FEET], category: 'armor' },
  BRACERS: { slots: [EQUIPMENT_SLOTS.WRISTS], category: 'armor' },
  GLOVES: { slots: [EQUIPMENT_SLOTS.HANDS], category: 'armor' },
  RING: { slots: [EQUIPMENT_SLOTS.FINGER_1, EQUIPMENT_SLOTS.FINGER_2], category: 'jewelry' },
  TRINKET: { slots: [EQUIPMENT_SLOTS.TRINKET_1, EQUIPMENT_SLOTS.TRINKET_2], category: 'trinket' },
  SWORD: { slots: [EQUIPMENT_SLOTS.MAIN_HAND, EQUIPMENT_SLOTS.OFF_HAND], category: 'weapon' },
  SHIELD: { slots: [EQUIPMENT_SLOTS.OFF_HAND], category: 'armor' },
  BOW: { slots: [EQUIPMENT_SLOTS.RANGED], category: 'weapon' },
  STAFF: { slots: [EQUIPMENT_SLOTS.MAIN_HAND], category: 'weapon', twoHanded: true }
};

// Calculate total stats from equipped items
export function calculateEquippedStats(equippedItems) {
  const stats = {
    strength: 0,
    agility: 0,
    constitution: 0,
    intelligence: 0,
    spirit: 0,
    charisma: 0,
    armorClass: 0,
    maxHp: 0,
    maxMana: 0,
    speed: 0
  };

  Object.values(equippedItems).forEach(item => {
    if (item && item.stats) {
      Object.keys(stats).forEach(stat => {
        if (item.stats[stat]) {
          stats[stat] += item.stats[stat];
        }
      });
    }
  });

  return stats;
}

// Check if an item can be equipped in a specific slot
export function canEquipInSlot(item, slot) {
  if (!item || !item.equipmentType) return false;
  
  const equipmentType = EQUIPMENT_TYPES[item.equipmentType.toUpperCase()];
  if (!equipmentType) return false;
  
  return equipmentType.slots.includes(slot);
}

// Get available slots for an item
export function getAvailableSlots(item) {
  if (!item || !item.equipmentType) return [];
  
  const equipmentType = EQUIPMENT_TYPES[item.equipmentType.toUpperCase()];
  return equipmentType ? equipmentType.slots : [];
}

// Check if item is two-handed
export function isTwoHanded(item) {
  if (!item || !item.equipmentType) return false;

  const equipmentType = EQUIPMENT_TYPES[item.equipmentType.toUpperCase()];
  return equipmentType ? equipmentType.twoHanded : false;
}

// Alias for compatibility
export const isTwoHandedWeapon = isTwoHanded;

// Get equipment category
export function getEquipmentCategory(item) {
  if (!item || !item.equipmentType) return 'misc';
  
  const equipmentType = EQUIPMENT_TYPES[item.equipmentType.toUpperCase()];
  return equipmentType ? equipmentType.category : 'misc';
}

// Validate equipment setup (check for conflicts)
export function validateEquipment(equippedItems) {
  const errors = [];
  
  // Check for two-handed weapon conflicts
  const mainHand = equippedItems[EQUIPMENT_SLOTS.MAIN_HAND];
  const offHand = equippedItems[EQUIPMENT_SLOTS.OFF_HAND];
  
  if (mainHand && isTwoHanded(mainHand) && offHand) {
    errors.push('Cannot equip off-hand item with two-handed weapon');
  }
  
  return errors;
}

// Get slots that need to be cleared when equipping a two-handed weapon
export function getSlotsToCleanForTwoHanded(item) {
  if (!isTwoHanded(item)) return [];
  return [EQUIPMENT_SLOTS.OFF_HAND];
}

// Get equipment slot display name
export function getSlotDisplayName(slot) {
  const names = {
    [EQUIPMENT_SLOTS.HEAD]: 'Head',
    [EQUIPMENT_SLOTS.NECK]: 'Neck',
    [EQUIPMENT_SLOTS.SHOULDERS]: 'Shoulders',
    [EQUIPMENT_SLOTS.CHEST]: 'Chest',
    [EQUIPMENT_SLOTS.WAIST]: 'Waist',
    [EQUIPMENT_SLOTS.LEGS]: 'Legs',
    [EQUIPMENT_SLOTS.FEET]: 'Feet',
    [EQUIPMENT_SLOTS.WRISTS]: 'Wrists',
    [EQUIPMENT_SLOTS.HANDS]: 'Hands',
    [EQUIPMENT_SLOTS.FINGER_1]: 'Ring 1',
    [EQUIPMENT_SLOTS.FINGER_2]: 'Ring 2',
    [EQUIPMENT_SLOTS.TRINKET_1]: 'Trinket 1',
    [EQUIPMENT_SLOTS.TRINKET_2]: 'Trinket 2',
    [EQUIPMENT_SLOTS.MAIN_HAND]: 'Main Hand',
    [EQUIPMENT_SLOTS.OFF_HAND]: 'Off Hand',
    [EQUIPMENT_SLOTS.RANGED]: 'Ranged'
  };

  return names[slot] || slot;
}

export default {
  EQUIPMENT_SLOTS,
  EQUIPMENT_TYPES,
  calculateEquippedStats,
  canEquipInSlot,
  getAvailableSlots,
  isTwoHanded,
  isTwoHandedWeapon,
  getEquipmentCategory,
  validateEquipment,
  getSlotsToCleanForTwoHanded,
  getSlotDisplayName
};
