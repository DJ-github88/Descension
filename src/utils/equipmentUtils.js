// Minimal equipment utilities for development
export const isTwoHandedWeapon = (item) => {
  return item && item.type === 'weapon' && item.twoHanded === true;
};

export const getSlotsToCleanForTwoHanded = (item) => {
  if (isTwoHandedWeapon(item)) {
    return ['mainHand', 'offHand'];
  }
  return [];
};

export const getCompatibleSlots = (item) => {
  if (!item) return [];

  // Basic slot mapping
  const slotMap = {
    'weapon': ['mainHand', 'offHand'],
    'armor': ['chest'],
    'helmet': ['head'],
    'boots': ['feet'],
    'gloves': ['hands'],
    'ring': ['ring1', 'ring2'],
    'necklace': ['neck'],
    'shield': ['offHand']
  };

  return slotMap[item.type] || [];
};

export const isOffHandDisabled = (mainHandItem) => {
  return isTwoHandedWeapon(mainHandItem);
};

export const canEquipToSlot = (item, slot) => {
  const compatibleSlots = getCompatibleSlots(item);
  return compatibleSlots.includes(slot);
};
