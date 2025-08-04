// Simple equipment utilities stub

export const calculateEquipmentStats = (equipment) => {
    // Return empty stats object
    return {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        armor: 0,
        damage: 0
    };
};

export const getEquipmentSlotType = (item) => {
    return item?.slot || 'miscellaneous';
};

export const canEquipItem = (item, slot) => {
    return true; // Allow all items for now
};

export const getSlotsToCleanForTwoHanded = (item) => {
    return []; // Return empty array for now
};

export const isTwoHandedWeapon = (item) => {
    return false; // Return false for now
};
