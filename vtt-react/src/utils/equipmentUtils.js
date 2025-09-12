// Equipment utility functions for determining slot compatibility and managing equipment

/**
 * Checks if an item is a two-handed weapon
 * @param {Object} item - The item to check
 * @returns {boolean} True if the item is a two-handed weapon
 */
export function isTwoHandedWeapon(item) {
    if (!item || item.type?.toLowerCase() !== 'weapon') return false;

    const weaponSlot = item.weaponSlot;
    const weaponSlotLower = weaponSlot?.toLowerCase();
    const subtype = item.subtype?.toLowerCase();

    // Check explicit two-handed designation (handle both uppercase and lowercase)
    if (weaponSlot === 'TWO_HANDED' || weaponSlotLower === 'two_handed' ||
        weaponSlotLower === 'twohanded' || weaponSlotLower === 'two-handed') {
        return true;
    }

    // Check subtype for two-handed indicators
    if (subtype?.includes('two') || subtype?.includes('great') ||
        subtype?.includes('staff') || subtype?.includes('polearm') ||
        subtype?.includes('halberd') || subtype?.includes('pike') ||
        subtype?.includes('glaive') || subtype?.includes('scythe') ||
        subtype?.includes('bow') || subtype?.includes('crossbow')) {
        return true;
    }

    // Check name for two-handed indicators
    const name = item.name?.toLowerCase() || '';
    if (name.includes('two-handed') || name.includes('greatsword') ||
        name.includes('greataxe') || name.includes('staff') ||
        name.includes('polearm') || name.includes('halberd') ||
        name.includes('bow') || name.includes('crossbow')) {
        return true;
    }

    return false;
}

/**
 * Determines which equipment slots an item can be equipped to
 * @param {Object} item - The item to check
 * @returns {Array} Array of compatible slot names
 */
export function getCompatibleSlots(item) {
    if (!item) return [];

    const itemType = item.type?.toLowerCase();
    const subtype = item.subtype?.toLowerCase();
    const weaponSlot = item.weaponSlot; // Don't convert to lowercase - keep original case
    const hand = item.hand; // Don't convert to lowercase - keep original case

    // Handle weapons
    if (itemType === 'weapon') {
        // First check if it's a two-handed weapon - this takes priority
        if (isTwoHandedWeapon(item)) {
            return ['mainHand'];
        }

        // Check explicit weapon slot specification (handle both cases)
        const weaponSlotLower = weaponSlot?.toLowerCase();

        // Handle TWO_HANDED weapons
        if (weaponSlot === 'TWO_HANDED' || weaponSlotLower === 'two_handed' || weaponSlotLower === 'twohanded') {
            return ['mainHand'];
        }

        // Handle RANGED weapons
        if (weaponSlot === 'RANGED' || weaponSlotLower === 'ranged') {
            return ['ranged'];
        }

        // Handle MAIN_HAND weapons (new direct slot type)
        if (weaponSlot === 'MAIN_HAND' || weaponSlotLower === 'main_hand' || weaponSlotLower === 'mainhand') {
            return ['mainHand'];
        }

        // Handle OFF_HAND weapons (new direct slot type)
        if (weaponSlot === 'OFF_HAND' || weaponSlotLower === 'off_hand' || weaponSlotLower === 'offhand') {
            return ['offHand'];
        }

        // Handle ONE_HANDED weapons - check hand preference
        if (weaponSlot === 'ONE_HANDED' || weaponSlotLower === 'one_handed' || weaponSlotLower === 'onehanded') {
            // Check hand preference for one-handed weapons
            if (hand === 'MAIN_HAND' || hand?.toLowerCase() === 'main_hand' || hand?.toLowerCase() === 'mainhand') {
                return ['mainHand'];
            } else if (hand === 'OFF_HAND' || hand?.toLowerCase() === 'off_hand' || hand?.toLowerCase() === 'offhand') {
                return ['offHand'];
            } else if (hand === 'ONE_HAND' || hand?.toLowerCase() === 'one_hand') {
                // Can go in either hand
                return ['mainHand', 'offHand'];
            } else {
                // Default for one-handed weapons without specific hand preference
                return ['mainHand', 'offHand'];
            }
        }

        // Default weapon slot logic based on subtype
        if (subtype?.includes('bow') || subtype?.includes('crossbow') ||
            subtype?.includes('wand') || subtype?.includes('thrown')) {
            return ['ranged'];
        } else if (subtype?.includes('shield')) {
            return ['offHand'];
        } else if (subtype?.includes('staff') || subtype?.includes('polearm') ||
                  subtype?.includes('greatsword') || subtype?.includes('greataxe') ||
                  subtype?.includes('maul') || subtype?.includes('halberd')) {
            return ['mainHand']; // Two-handed weapons
        } else {
            // One-handed weapons can go in either hand by default
            return ['mainHand', 'offHand'];
        }
    }
    
    // Handle armor
    else if (itemType === 'armor') {
        if (subtype?.includes('helmet') || subtype?.includes('head') || subtype?.includes('hat')) {
            return ['head'];
        } else if (subtype?.includes('shoulder') || subtype?.includes('pauldron')) {
            return ['shoulders'];
        } else if (subtype?.includes('chest') || subtype?.includes('breastplate') ||
                  subtype?.includes('robe') || subtype?.includes('tunic') || subtype?.includes('vest')) {
            return ['chest'];
        } else if (subtype?.includes('leg') || subtype?.includes('pants') ||
                  subtype?.includes('greaves') || subtype?.includes('leggings')) {
            return ['legs'];
        } else if (subtype?.includes('boot') || subtype?.includes('feet') ||
                  subtype?.includes('shoes') || subtype?.includes('sandals')) {
            return ['feet'];
        } else if (subtype?.includes('glove') || subtype?.includes('gauntlet') ||
                  subtype?.includes('hand')) {
            return ['gloves'];
        } else if (subtype?.includes('belt') || subtype?.includes('waist') || subtype?.includes('girdle')) {
            return ['waist'];
        } else if (subtype?.includes('bracer') || subtype?.includes('wrist') || subtype?.includes('bracelet')) {
            return ['wrists'];
        } else if (subtype?.includes('cloak') || subtype?.includes('cape') ||
                  subtype?.includes('back') || subtype?.includes('mantle')) {
            return ['back'];
        } else if (subtype?.includes('neck') || subtype?.includes('necklace') || subtype?.includes('amulet')) {
            return ['neck'];
        } else if (subtype?.includes('ring')) {
            return ['ring1', 'ring2'];
        } else {
            // Default armor slot based on name
            const name = item.name?.toLowerCase() || '';
            if (name.includes('helmet') || name.includes('hat') || name.includes('crown')) {
                return ['head'];
            } else if (name.includes('chest') || name.includes('armor') || name.includes('breastplate')) {
                return ['chest'];
            } else if (name.includes('cloak') || name.includes('cape')) {
                return ['back'];
            } else if (name.includes('belt') || name.includes('waist')) {
                return ['waist'];
            } else if (name.includes('boot') || name.includes('shoes')) {
                return ['feet'];
            } else if (name.includes('glove') || name.includes('gauntlet')) {
                return ['gloves'];
            } else if (name.includes('ring')) {
                return ['ring1', 'ring2'];
            } else if (name.includes('necklace') || name.includes('amulet')) {
                return ['neck'];
            }
        }
    }
    
    // Handle accessories
    else if (itemType === 'accessory') {
        if (subtype?.includes('ring')) {
            return ['ring1', 'ring2'];
        } else if (subtype?.includes('necklace') || subtype?.includes('amulet') ||
                  subtype?.includes('neck')) {
            return ['neck'];
        } else if (subtype?.includes('trinket') || subtype?.includes('charm')) {
            return ['trinket1', 'trinket2'];
        } else {
            // Default accessory logic based on name
            const name = item.name?.toLowerCase() || '';
            if (name.includes('ring')) {
                return ['ring1', 'ring2'];
            } else if (name.includes('necklace') || name.includes('amulet')) {
                return ['neck'];
            } else {
                return ['trinket1', 'trinket2'];
            }
        }
    }

    // Handle clothing
    else if (itemType === 'clothing') {
        if (subtype?.includes('shirt')) {
            return ['shirt'];
        } else if (subtype?.includes('tabard')) {
            return ['tabard'];
        }
    }

    // Handle items with explicit slot specification
    if (item.slot) {
        return [item.slot.toLowerCase()];
    }

    // Handle items with slots array
    if (Array.isArray(item.slots)) {
        return item.slots.map(slot => slot.toLowerCase());
    }

    // Default fallback
    return [];
}

/**
 * Checks if an item can be equipped to a specific slot
 * @param {Object} item - The item to check
 * @param {string} slotName - The slot to check
 * @returns {boolean} True if the item can be equipped to the slot
 */
export function canEquipToSlot(item, slotName) {
    const compatibleSlots = getCompatibleSlots(item);
    return compatibleSlots.includes(slotName);
}

/**
 * Gets the display name for an equipment slot
 * @param {string} slotName - The slot name
 * @returns {string} Human-readable slot name
 */
export function getSlotDisplayName(slotName) {
    const slotNames = {
        head: 'Head',
        neck: 'Neck',
        shoulders: 'Shoulders',
        back: 'Back',
        chest: 'Chest',
        shirt: 'Shirt',
        tabard: 'Tabard',
        wrists: 'Wrists',
        hands: 'Hands',
        waist: 'Waist',
        legs: 'Legs',
        feet: 'Feet',
        ring1: 'Ring 1',
        ring2: 'Ring 2',
        trinket1: 'Trinket 1',
        trinket2: 'Trinket 2',
        mainHand: 'Main Hand',
        offHand: 'Off Hand',
        ranged: 'Ranged'
    };

    return slotNames[slotName] || slotName;
}

/**
 * Gets the display name for an equipment slot when equipping a specific item
 * For two-handed weapons going to main hand, shows "Two-Handed" instead of "Main Hand"
 * @param {string} slotName - The slot name
 * @param {Object} item - The item being equipped
 * @returns {string} Human-readable slot name
 */
export function getEquipSlotDisplayName(slotName, item) {
    // For two-handed weapons going to main hand, show "Two-Handed"
    if (slotName === 'mainHand' && item && isTwoHandedWeapon(item)) {
        return 'Two-Handed';
    }

    // For all other cases, use the standard slot display name
    return getSlotDisplayName(slotName);
}

/**
 * Creates an equipment-ready version of an inventory item
 * This normalizes the item for display in equipment slots (1x1 size)
 * @param {Object} item - The inventory item
 * @returns {Object} Equipment-ready item
 */
export function createEquipmentItem(item) {
    if (!item) return null;

    return {
        ...item,
        // Preserve original dimensions for when item is unequipped
        originalWidth: item.width,
        originalHeight: item.height,
        originalRotation: item.rotation,
        // Set equipment display size to 1x1
        width: 1,
        height: 1,
        rotation: 0,
        // Mark as equipped
        isEquipped: true,
        // Preserve inventory position for potential return
        inventoryPosition: item.position
    };
}

/**
 * Creates an inventory-ready version of an equipped item
 * This restores the item's original dimensions for inventory placement
 * @param {Object} item - The equipped item
 * @returns {Object} Inventory-ready item
 */
export function createInventoryItem(item) {
    if (!item) return null;

    return {
        ...item,
        // Restore original dimensions
        width: item.originalWidth || item.width || 1,
        height: item.originalHeight || item.height || 1,
        rotation: item.originalRotation || item.rotation || 0,
        // Remove equipment-specific properties
        isEquipped: false,
        originalWidth: undefined,
        originalHeight: undefined,
        originalRotation: undefined,
        inventoryPosition: undefined
    };
}



/**
 * Gets slots that should be cleared when equipping a two-handed weapon
 * @param {string} slotName - The slot being equipped to
 * @returns {Array} Array of slot names to clear
 */
export function getSlotsToCleanForTwoHanded(slotName) {
    if (slotName === 'mainHand') {
        return ['offHand']; // Clear off-hand when equipping two-handed to main hand
    }
    return [];
}

/**
 * Validates if an item can be equipped to a slot given current equipment
 * @param {Object} item - The item to equip
 * @param {string} slotName - The slot to equip to
 * @param {Object} currentEquipment - Current equipment state
 * @returns {Object} Validation result with isValid and reason
 */
export function validateEquipment(item, slotName, currentEquipment) {
    // Check if item is compatible with the slot
    if (!canEquipToSlot(item, slotName)) {
        return {
            isValid: false,
            reason: `${item.name} cannot be equipped to ${getSlotDisplayName(slotName)}`
        };
    }

    // Check two-handed weapon conflicts
    if (slotName === 'offHand') {
        const mainHandItem = currentEquipment.mainHand;
        if (mainHandItem && isTwoHandedWeapon(mainHandItem)) {
            return {
                isValid: false,
                reason: `Cannot equip to off-hand while wielding two-handed weapon: ${mainHandItem.name}`
            };
        }
    }

    return { isValid: true };
}

/**
 * Checks if the off-hand slot should be disabled due to two-handed weapon
 * @param {Object} currentEquipment - Current equipment state
 * @returns {boolean} True if off-hand should be disabled
 */
export function isOffHandDisabled(currentEquipment) {
    const mainHandItem = currentEquipment?.mainHand;
    return mainHandItem && isTwoHandedWeapon(mainHandItem);
}
