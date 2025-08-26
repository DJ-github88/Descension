import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { getInventoryGridDimensions } from '../utils/characterUtils';

// Helper function to check if a position is valid for an item with given dimensions
const isValidPosition = (items, row, col, width, height, rotation, itemId = null) => {
    // If rotated, swap width and height for collision detection
    const effectiveWidth = rotation === 1 ? height : width;
    const effectiveHeight = rotation === 1 ? width : height;

    // Get current grid size dynamically
    const GRID_SIZE = getCurrentGridSize();

    // Check if the item would go out of bounds
    if (row < 0 || col < 0 || row + effectiveHeight > GRID_SIZE.HEIGHT || col + effectiveWidth > GRID_SIZE.WIDTH) {
        return false;
    }

    // Check if any cell the item would occupy is already occupied by another item
    for (let r = 0; r < effectiveHeight; r++) {
        for (let c = 0; c < effectiveWidth; c++) {
            const cellRow = row + r;
            const cellCol = col + c;

            const isOccupied = items.some(item => {
                // Skip checking against itself
                if (itemId && item.id === itemId) {
                    return false;
                }

                // Calculate item dimensions based on rotation
                const otherEffectiveWidth = item.rotation === 1 ?
                    (item.height || 1) : (item.width || 1);
                const otherEffectiveHeight = item.rotation === 1 ?
                    (item.width || 1) : (item.height || 1);

                // Check if this cell is within the bounds of the other item
                return cellRow >= item.position.row &&
                       cellRow < item.position.row + otherEffectiveHeight &&
                       cellCol >= item.position.col &&
                       cellCol < item.position.col + otherEffectiveWidth;
            });

            if (isOccupied) {
                return false;
            }
        }
    }

    return true;
};

// Helper function to find first valid position for an item with given dimensions
const findEmptyPosition = (items, gridSize, width = 1, height = 1, rotation = 0) => {
    // Calculate effective dimensions based on rotation
    const effectiveWidth = rotation === 1 ? height : width;
    const effectiveHeight = rotation === 1 ? width : height;

    for (let row = 0; row < gridSize.HEIGHT - effectiveHeight + 1; row++) {
        for (let col = 0; col < gridSize.WIDTH - effectiveWidth + 1; col++) {
            if (isValidPosition(items, row, col, width, height, rotation)) {
                return { row, col };
            }
        }
    }

    // If no valid position found, return null
    return null;
};

// Grid size constants - default fallback
const DEFAULT_GRID_SIZE = {
    WIDTH: 15,
    HEIGHT: 5,
    NORMAL_SECTION: 5,
    ENCUMBERED_SECTION: 5,
    OVERENCUMBERED_SECTION: 5
};

// Function to get current grid size based on character carrying capacity
const getCurrentGridSize = () => {
    // Try to get character store data
    try {
        // Import character store dynamically to avoid circular dependencies
        const characterStore = require('./characterStore').default;
        const state = characterStore.getState();

        if (state && state.derivedStats && state.derivedStats.carryingCapacity) {
            return getInventoryGridDimensions(state.derivedStats.carryingCapacity);
        }
    } catch (error) {
        // Could not get character carrying capacity, using default grid size
    }

    return DEFAULT_GRID_SIZE;
};

// Calculate total weight of items
const calculateTotalWeight = (items) => {
    return items.reduce((total, item) => {
        const weight = parseFloat(item.weight) || 0;
        const quantity = item.quantity || 1;
        return total + (weight * quantity);
    }, 0);
};

// Calculate encumbrance based on item positions in the grid
const calculateEncumbranceState = (items) => {
    let isOverencumbered = false;
    let isEncumbered = false;

    // Get current grid size for encumbrance calculations
    const GRID_SIZE = getCurrentGridSize();

    items.forEach(item => {
        // Skip items without position (shouldn't happen, but safety check)
        if (!item.position) {
            return;
        }

        // Calculate effective dimensions based on rotation
        const effectiveWidth = item.rotation === 1 ?
            (item.height || 1) : (item.width || 1);
        const effectiveHeight = item.rotation === 1 ?
            (item.width || 1) : (item.height || 1);

        // Check each cell the item occupies
        for (let r = 0; r < effectiveHeight; r++) {
            for (let c = 0; c < effectiveWidth; c++) {
                const cellCol = item.position.col + c;

                // Check if any part of the item is in the overencumbered section
                if (cellCol >= GRID_SIZE.NORMAL_SECTION + GRID_SIZE.ENCUMBERED_SECTION) {
                    isOverencumbered = true;
                    break;
                }
                // Check if any part of the item is in the encumbered section
                else if (cellCol >= GRID_SIZE.NORMAL_SECTION) {
                    isEncumbered = true;
                }
            }
            if (isOverencumbered) break; // No need to check further if already overencumbered
        }
    });

    // Determine encumbrance state based on item placement
    if (isOverencumbered) {
        return 'overencumbered';
    } else if (isEncumbered) {
        return 'encumbered';
    } else {
        return 'normal';
    }
};

const useInventoryStore = create(persist((set, get) => ({
    items: [],
    currency: {
        gold: 0,
        silver: 0,
        copper: 0
    },
    encumbranceState: 'normal', // normal, encumbered, overencumbered

    updateCurrency: (currencyData) => set((state) => ({
        currency: { ...state.currency, ...currencyData }
    })),

    // Update encumbrance state based on item positions
    updateEncumbranceState: () => set((state) => {
        const oldState = state.encumbranceState;
        const newState = calculateEncumbranceState(state.items);

        // If encumbrance state changed, notify character store
        if (oldState !== newState) {
            // Use setTimeout to avoid circular dependency issues
            setTimeout(() => {
                try {
                    const characterStore = require('./characterStore').default;
                    const recalculateStats = characterStore.getState().recalculateStatsWithEncumbrance;
                    if (recalculateStats) {
                        recalculateStats();
                    }
                } catch (error) {
                    // Could not notify character store of encumbrance change
                }
            }, 0);
        }

        return { encumbranceState: newState };
    }),

    // Add item with stacking support
    addItem: (itemData) => set((state) => {
        // Generate a unique ID if not provided
        const newItem = {
            ...itemData,
            id: itemData.id || uuidv4(),
            quantity: itemData.quantity || 1,
            width: itemData.width || 1,
            height: itemData.height || 1,
            rotation: itemData.rotation || 0
        };

        // Check if the item is stackable and if we already have it
        // Only allow stacking for consumable and miscellaneous items
        const isStackableType = newItem.type === 'consumable' || newItem.type === 'miscellaneous';
        if (itemData.stackable !== false && isStackableType) {
            const existingItemIndex = state.items.findIndex(item =>
                item.name === newItem.name &&
                item.type === newItem.type
            );

            if (existingItemIndex >= 0) {
                // Stack with existing item, but preserve properties from new item
                const updatedItems = [...state.items];
                const existingItem = updatedItems[existingItemIndex];

                // Merge properties from new item to ensure we have all properties
                // This is important for items that might have been added before property preservation was fixed
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    ...newItem, // Merge new item properties
                    id: existingItem.id, // Keep the existing ID
                    quantity: (existingItem.quantity || 1) + (newItem.quantity || 1), // Add quantities
                    position: existingItem.position, // Keep existing position
                    rotation: existingItem.rotation, // Keep existing rotation

                    // Ensure trade goods properties are preserved
                    subtype: newItem.subtype || existingItem.subtype,
                    tradeCategory: newItem.tradeCategory || existingItem.tradeCategory,
                    origin: newItem.origin || existingItem.origin,
                    demandLevel: newItem.demandLevel || existingItem.demandLevel,
                    qualityGrade: newItem.qualityGrade || existingItem.qualityGrade,
                    merchantNotes: newItem.merchantNotes || existingItem.merchantNotes
                };

                // Update encumbrance after adding item
                setTimeout(() => get().updateEncumbranceState(), 0);

                return { items: updatedItems };
            }
        }

        // Find an empty position for the new item
        if (!newItem.position) {
            const currentGridSize = getCurrentGridSize();
            const emptyPosition = findEmptyPosition(
                state.items,
                currentGridSize,
                newItem.width,
                newItem.height,
                newItem.rotation
            );

            if (!emptyPosition) {
                // No empty position found - inventory is full for this item size
                console.warn(`🚫 INVENTORY FULL FIX ACTIVE: No room in inventory for item: ${newItem.name} (${newItem.width}x${newItem.height})`);

                // Show "no room" notification
                if (typeof window !== 'undefined') {
                    const notification = document.createElement('div');
                    notification.className = 'inventory-full-notification';
                    notification.textContent = `No room in inventory for ${newItem.name}`;
                    notification.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(139, 69, 19, 0.95);
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        border: 2px solid #8b4513;
                        font-family: 'Cinzel', serif;
                        font-size: 16px;
                        font-weight: 600;
                        z-index: 10000;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                        animation: fadeInOut 3s ease-in-out forwards;
                    `;

                    // Add CSS animation if not already present
                    if (!document.querySelector('#inventory-notification-styles')) {
                        const style = document.createElement('style');
                        style.id = 'inventory-notification-styles';
                        style.textContent = `
                            @keyframes fadeInOut {
                                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    document.body.appendChild(notification);

                    // Remove notification after animation
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 3000);
                }

                // Return state unchanged - item was not added
                return { items: state.items };
            }

            // Position found, assign it
            newItem.position = emptyPosition;
        } else {
            // If position is provided, verify it's valid
            const isValid = isValidPosition(
                state.items,
                newItem.position.row,
                newItem.position.col,
                newItem.width,
                newItem.height,
                newItem.rotation
            );

            if (!isValid) {
                // Provided position is invalid, try to find a new position
                const currentGridSize = getCurrentGridSize();
                const emptyPosition = findEmptyPosition(
                    state.items,
                    currentGridSize,
                    newItem.width,
                    newItem.height,
                    newItem.rotation
                );

                if (!emptyPosition) {
                    // No valid position found - inventory is full for this item size
                    console.warn(`No room in inventory for item: ${newItem.name} (${newItem.width}x${newItem.height})`);

                    // Show "no room" notification
                    if (typeof window !== 'undefined') {
                        const notification = document.createElement('div');
                        notification.className = 'inventory-full-notification';
                        notification.textContent = `No room in inventory for ${newItem.name}`;
                        notification.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(139, 69, 19, 0.95);
                            color: white;
                            padding: 12px 20px;
                            border-radius: 8px;
                            border: 2px solid #8b4513;
                            font-family: 'Cinzel', serif;
                            font-size: 16px;
                            font-weight: 600;
                            z-index: 10000;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                            animation: fadeInOut 3s ease-in-out forwards;
                        `;

                        document.body.appendChild(notification);

                        // Remove notification after animation
                        setTimeout(() => {
                            if (document.body.contains(notification)) {
                                document.body.removeChild(notification);
                            }
                        }, 3000);
                    }

                    // Return state unchanged - item was not added
                    return { items: state.items };
                }

                // Position found, assign it
                newItem.position = emptyPosition;
            }
        }

        // If we reach here, the item has a valid position and can be added
        // Update encumbrance after adding item
        setTimeout(() => get().updateEncumbranceState(), 0);

        return { items: [...state.items, newItem], itemAdded: true };
    }),

    // Add item from library
    addItemFromLibrary: (libraryItem, options = {}) => {
        const store = get();

        // Set default dimensions based on item type and subtype
        let width = libraryItem.width || 1;
        let height = libraryItem.height || 1;

        // If dimensions aren't explicitly set, determine them based on item type
        if (!libraryItem.width || !libraryItem.height) {
            if (libraryItem.type === 'weapon') {
                if (libraryItem.subtype === 'GREATSWORD' || libraryItem.subtype === 'GREATAXE' ||
                    libraryItem.subtype === 'MAUL' || libraryItem.subtype === 'POLEARM') {
                    // Two-handed weapons are longer and wider
                    width = 2;
                    height = 4;
                } else if (libraryItem.subtype === 'STAFF') {
                    // Staves are long but thin
                    width = 1;
                    height = 4;
                } else if (libraryItem.subtype === 'SWORD' || libraryItem.subtype === 'AXE' || libraryItem.subtype === 'MACE') {
                    // One-handed weapons are medium length
                    width = 1;
                    height = 2;
                } else if (libraryItem.subtype === 'DAGGER') {
                    // Daggers are small
                    width = 1;
                    height = 1;
                } else if (libraryItem.subtype === 'BOW' || libraryItem.subtype === 'CROSSBOW') {
                    // Bows are wider
                    width = 2;
                    height = 3;
                }
            } else if (libraryItem.type === 'armor') {
                if (libraryItem.subtype === 'PLATE') {
                    // Plate armor takes more space
                    width = 2;
                    height = 2;
                } else if (libraryItem.subtype === 'MAIL') {
                    // Mail armor is slightly smaller
                    width = 2;
                    height = 2;
                } else if (libraryItem.subtype === 'LEATHER') {
                    // Leather armor is more compact
                    width = 1;
                    height = 2;
                } else if (libraryItem.subtype === 'CLOTH') {
                    // Cloth armor is the most compact
                    width = 1;
                    height = 1;
                }
            } else if (libraryItem.type === 'container') {
                // Containers are larger
                width = 2;
                height = 2;
            }
        }

        // For containers, we want to preserve the original ID to maintain container functionality
        const isContainer = libraryItem.type === 'container';
        const shouldPreserveId = isContainer && options.preserveId === true;

        // Adding item to inventory

        // Check if we should preserve all properties
        const shouldPreserveProperties = options.preserveProperties === true;

        // If preserveProperties is true, start with a copy of the original item
        // This ensures ALL properties are preserved, even ones we don't explicitly list
        let inventoryItem;

        if (shouldPreserveProperties) {
            // Start with a deep copy of the original item
            inventoryItem = JSON.parse(JSON.stringify(libraryItem));

            // Override only the necessary properties
            inventoryItem.id = shouldPreserveId ? libraryItem.id : uuidv4();
            inventoryItem.quantity = options.quantity || 1;
            inventoryItem.stackable = libraryItem.stackable !== false;

            // IMPORTANT: Preserve the original item dimensions if they exist
            // Only use the calculated dimensions if the original doesn't have them
            inventoryItem.width = libraryItem.width || width;
            inventoryItem.height = libraryItem.height || height;

            inventoryItem.rotation = libraryItem.rotation || 0;
            inventoryItem.position = libraryItem.position; // Use provided position if available

            // Preserving original item dimensions

            // Ensure quality/rarity is set correctly
            inventoryItem.quality = libraryItem.quality || libraryItem.rarity || 'common';
            inventoryItem.rarity = libraryItem.rarity || libraryItem.quality || 'common';

            // Ensure currency properties are set correctly
            if (libraryItem.type === 'currency') {
                inventoryItem.isCurrency = true;
                inventoryItem.currencyType = libraryItem.currencyType || 'gold';
                inventoryItem.currencyValue = libraryItem.currencyValue || libraryItem.value || { gold: 1, silver: 0, copper: 0 };
            }

            // Preserve original item references
            inventoryItem.originalItemId = libraryItem.id;

            // IMPORTANT: Preserve originalItemStoreId if it exists
            // This ensures items that came from inventory and were dropped on the grid
            // can be properly linked back to their original item store entry
            if (libraryItem.originalItemStoreId) {
                inventoryItem.originalItemStoreId = libraryItem.originalItemStoreId;
            }

            // Preserving ALL properties for item
        } else {
            // Standard conversion with only explicitly listed properties
            inventoryItem = {
                // For containers, preserve the original ID if specified
                id: shouldPreserveId ? libraryItem.id : uuidv4(),
                name: libraryItem.name,
                type: libraryItem.type,
                subtype: libraryItem.subtype,
                quality: libraryItem.quality || libraryItem.rarity || 'common',
                rarity: libraryItem.quality || libraryItem.rarity, // Support both quality and rarity fields
                description: libraryItem.description,
                iconId: libraryItem.iconId || libraryItem.icon,
                imageUrl: libraryItem.imageUrl,
                weight: parseFloat(libraryItem.weight) || 0.1,
                value: libraryItem.value || libraryItem.cost,
                quantity: options.quantity || 1,
                stackable: libraryItem.stackable !== false,
                width: width,
                height: height,
                rotation: libraryItem.rotation || 0,
                position: libraryItem.position, // Use provided position if available

                // Preserve important item stats
                baseStats: libraryItem.baseStats,
                combatStats: libraryItem.combatStats,
                utilityStats: libraryItem.utilityStats,
                weaponStats: libraryItem.weaponStats,
                slots: libraryItem.slots,

                // Preserve trade goods properties
                tradeCategory: libraryItem.tradeCategory,
                origin: libraryItem.origin,
                demandLevel: libraryItem.demandLevel,
                qualityGrade: libraryItem.qualityGrade,
                merchantNotes: libraryItem.merchantNotes,

                // Preserve other miscellaneous properties
                junkType: libraryItem.junkType,
                condition: libraryItem.condition,
                estimatedValue: libraryItem.estimatedValue,
                questGiver: libraryItem.questGiver,
                questObjectives: libraryItem.questObjectives,
                questChain: libraryItem.questChain,
                requiredLevel: libraryItem.requiredLevel,
                timeLimit: libraryItem.timeLimit,

                // Preserve container properties if this is a container
                containerProperties: isContainer ? libraryItem.containerProperties : undefined,

                // Preserve original item references
                originalItemId: libraryItem.id,

                // IMPORTANT: Preserve originalItemStoreId if it exists
                // This ensures items that came from inventory and were dropped on the grid
                // can be properly linked back to their original item store entry
                originalItemStoreId: libraryItem.originalItemStoreId || null
            };

            // Handle currency items
            if (libraryItem.type === 'currency') {
                inventoryItem.isCurrency = true;
                inventoryItem.currencyType = libraryItem.currencyType || 'gold';
                inventoryItem.currencyValue = libraryItem.currencyValue || libraryItem.value;
            }
        }

        // Try to add the item to inventory
        const initialItemCount = store.items.length;
        store.addItem(inventoryItem);
        const finalItemCount = store.items.length;

        // Check if the item was actually added
        if (finalItemCount > initialItemCount) {
            console.log(`✅ INVENTORY FIX: Item ${inventoryItem.name} successfully added to inventory`);
            return inventoryItem.id; // Return the new ID for reference
        } else {
            // Item was not added (inventory full)
            console.log(`🚫 INVENTORY FIX: Item ${inventoryItem.name} was NOT added - inventory full`);
            return null;
        }
    },

    // Remove item with quantity support
    removeItem: (itemId, quantity = 0) => set((state) => {
        const itemIndex = state.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return { items: state.items };
        }

        const item = state.items[itemIndex];

        // If quantity is specified and less than total quantity, reduce quantity
        if (quantity > 0 && item.quantity > quantity) {
            const updatedItems = [...state.items];
            updatedItems[itemIndex] = {
                ...item,
                quantity: item.quantity - quantity
            };

            // Update encumbrance after removing item
            setTimeout(() => get().updateEncumbranceState(), 0);

            return { items: updatedItems };
        }

        // Otherwise remove the item completely
        const updatedItems = state.items.filter(item => item.id !== itemId);

        // Update encumbrance after removing item
        setTimeout(() => get().updateEncumbranceState(), 0);

        return { items: updatedItems };
    }),

    // Move item with collision detection for multi-cell items
    moveItem: (itemId, newPosition) => set((state) => {
        const item = state.items.find(i => i.id === itemId);
        if (!item) return { items: state.items };

        // Check if the new position is valid for this item
        const width = item.width || 1;
        const height = item.height || 1;
        const rotation = item.rotation || 0;

        if (!isValidPosition(state.items, newPosition.row, newPosition.col, width, height, rotation, itemId)) {
            return { items: state.items };
        }

        const updatedItems = state.items.map(i =>
            i.id === itemId
                ? { ...i, position: newPosition }
                : i
        );

        // Update encumbrance state after moving
        setTimeout(() => get().updateEncumbranceState(), 0);

        return { items: updatedItems };
    }),

    // Rotate item - just toggle between 0 and 1 (not rotated/rotated)
    rotateItem: (itemId) => set((state) => {
        const item = state.items.find(i => i.id === itemId);
        if (!item) return { items: state.items };

        // Calculate new rotation - only toggle between 0 and 1 (not rotated/rotated)
        const currentRotation = item.rotation || 0;
        const newRotation = currentRotation === 0 ? 1 : 0;

        const width = item.width || 1;
        const height = item.height || 1;
        const isSquare = width === height;

        // For square items, just rotate in place without any checks
        if (isSquare) {
            const updatedItems = state.items.map(i =>
                i.id === itemId
                    ? { ...i, rotation: newRotation }
                    : i
            );

            // Update encumbrance state after rotating
            setTimeout(() => get().updateEncumbranceState(), 0);

            return { items: updatedItems };
        }

        // Current position
        const { row, col } = item.position;

        // For simplicity and predictability, we'll just check if the item can rotate in place
        // This avoids issues with items jumping around the grid
        if (!isValidPosition(
            state.items.filter(i => i.id !== itemId),
            row,
            col,
            width,
            height,
            newRotation,
            itemId
        )) {
            // If rotation in place isn't valid, don't rotate
            return { items: state.items };
        }

        // Rotation is valid, update the item
        const updatedItems = state.items.map(i =>
            i.id === itemId
                ? { ...i, rotation: newRotation }
                : i
        );

        // Update encumbrance state after rotating
        setTimeout(() => get().updateEncumbranceState(), 0);

        return { items: updatedItems };
    }),

    // Split stack into two
    splitStack: (itemId, quantity) => set((state) => {
        const itemIndex = state.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1 || quantity <= 0) {
            return { items: state.items };
        }

        const item = state.items[itemIndex];

        // Ensure we're not trying to split more than we have
        if (item.quantity <= quantity) {
            return { items: state.items };
        }

        // Create a new item with the split quantity
        const newItem = {
            ...item,
            id: uuidv4(),
            quantity: quantity
        };

        // Find an empty position for the new item
        const width = item.width || 1;
        const height = item.height || 1;
        const rotation = item.rotation || 0;

        const currentGridSize = getCurrentGridSize();
        const emptyPosition = findEmptyPosition(state.items, currentGridSize, width, height, rotation);
        if (!emptyPosition) {
            // Inventory is full, cannot split stack
            return { items: state.items };
        }

        newItem.position = emptyPosition;

        // Update the original item's quantity
        const updatedItems = [...state.items];
        updatedItems[itemIndex] = {
            ...item,
            quantity: item.quantity - quantity
        };

        return { items: [...updatedItems, newItem] };
    }),

    // Get total weight of inventory
    getTotalWeight: () => {
        return calculateTotalWeight(get().items);
    },

    // Update item properties
    updateItem: (itemId, updates) => set((state) => {
        const itemIndex = state.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return { items: state.items };

        // Updating inventory item

        const updatedItems = [...state.items];
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            ...updates,
            // Special handling for containerProperties to ensure deep merge
            containerProperties: updates.containerProperties ? {
                ...updatedItems[itemIndex].containerProperties,
                ...updates.containerProperties
            } : updatedItems[itemIndex].containerProperties
        };

        // Updated item

        return { items: updatedItems };
    })
}), { name: 'inventory' }));

export default useInventoryStore;
