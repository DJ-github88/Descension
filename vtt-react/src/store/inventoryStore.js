import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { getInventoryGridDimensions } from '../utils/characterUtils';
import {
    convertLegacyItemToShape,
    getShapeBounds,
    createRectangularShape,
    isCellOccupied,
    getOccupiedCells,
    rotateShape
} from '../utils/itemShapeUtils';

// Helper function to get current character and record changes
const recordCharacterChange = (changeType, changeData) => {
    try {
        // Import character store dynamically to avoid circular dependencies
        const characterStore = require('./characterStore').default;
        const state = characterStore.getState();

        if (state.currentCharacterId) {
            // Record the change asynchronously
            state.recordCharacterChange(state.currentCharacterId, changeType, changeData);
        }
    } catch (error) {
        console.warn('Could not record character change:', error);
    }
};

// Helper function to check if a position is valid for an item with custom shape support
const isValidPosition = (items, row, col, itemToPlace, itemId = null) => {
    // Get current grid size dynamically
    const GRID_SIZE = getCurrentGridSize();

    // Get the shape for the item to place
    let shape = itemToPlace.shape;
    if (!shape) {
        // Legacy item - convert to shape
        const width = itemToPlace.width || 1;
        const height = itemToPlace.height || 1;
        shape = createRectangularShape(width, height);
    }

    // Apply rotation if needed
    if (itemToPlace.rotation === 1) {
        // Use the new rotateShape function for both rectangular and custom shapes
        shape = rotateShape(shape);
    }

    // Get all occupied cells for this shape
    const occupiedCells = getOccupiedCells(shape);

    // Check if any occupied cell would go out of bounds or collide
    for (const cell of occupiedCells) {
        const cellRow = row + cell.row;
        const cellCol = col + cell.col;

        // Check bounds
        if (cellRow < 0 || cellCol < 0 || cellRow >= GRID_SIZE.HEIGHT || cellCol >= GRID_SIZE.WIDTH) {
            return false;
        }

        // Check collision with other items
        const isOccupied = items.some(item => {
            // Skip checking against itself
            if (itemId && item.id === itemId) {
                return false;
            }

            // Get the other item's shape
            let otherShape = item.shape;
            if (!otherShape) {
                // Legacy item - convert to shape
                const width = item.width || 1;
                const height = item.height || 1;
                otherShape = createRectangularShape(width, height);
            }

            // Apply rotation to other item if needed
            if (item.rotation === 1) {
                otherShape = rotateShape(otherShape);
            }

            // Check if this cell collides with any cell of the other item
            const otherOccupiedCells = getOccupiedCells(otherShape);
            return otherOccupiedCells.some(otherCell => {
                const otherCellRow = item.position.row + otherCell.row;
                const otherCellCol = item.position.col + otherCell.col;
                return cellRow === otherCellRow && cellCol === otherCellCol;
            });
        });

        if (isOccupied) {
            return false;
        }
    }

    return true;
};

// Helper function to find first valid position for an item with custom shape support
const findEmptyPosition = (items, gridSize, itemToPlace) => {
    // Get the shape for the item
    let shape = itemToPlace.shape;
    if (!shape) {
        // Legacy item - convert to shape
        const width = itemToPlace.width || 1;
        const height = itemToPlace.height || 1;
        shape = createRectangularShape(width, height);
    }

    // Apply rotation if needed
    if (itemToPlace.rotation === 1) {
        shape = rotateShape(shape);
    }

    const bounds = getShapeBounds(shape);
    console.log(`🔍 FIND EMPTY POSITION: Looking for ${bounds.width}x${bounds.height} space in ${gridSize.WIDTH}x${gridSize.HEIGHT} grid`);

    for (let row = 0; row <= gridSize.HEIGHT - bounds.height; row++) {
        for (let col = 0; col <= gridSize.WIDTH - bounds.width; col++) {
            const isValid = isValidPosition(items, row, col, itemToPlace);
            if (isValid) {
                console.log(`🔍 FOUND VALID POSITION: row ${row}, col ${col}`);
                return { row, col };
            }
        }
    }

    console.log(`🔍 NO VALID POSITION FOUND for ${bounds.width}x${bounds.height} item`);
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

        // Get the item's shape and apply rotation
        let shape = item.shape;
        if (!shape) {
            // Legacy item - convert to shape
            const width = item.width || 1;
            const height = item.height || 1;
            shape = createRectangularShape(width, height);
        }

        // Apply rotation if needed
        if (item.rotation === 1) {
            shape = rotateShape(shape);
        }

        // Get all occupied cells for this shape
        const occupiedCells = getOccupiedCells(shape);

        // Check each cell the item occupies
        for (const cell of occupiedCells) {
            const cellCol = item.position.col + cell.col;

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
        if (isOverencumbered) return; // No need to check further items if already overencumbered
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
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: 0
    },
    encumbranceState: 'normal', // normal, encumbered, overencumbered

    // Automatic currency conversion function
    convertCurrencyUpward: (currency) => {
        let { platinum = 0, gold = 0, silver = 0, copper = 0 } = currency;

        // Convert copper to silver (100 copper = 1 silver)
        if (copper >= 100) {
            const newSilver = Math.floor(copper / 100);
            silver += newSilver;
            copper = copper % 100;
        }

        // Convert silver to gold (100 silver = 1 gold)
        if (silver >= 100) {
            const newGold = Math.floor(silver / 100);
            gold += newGold;
            silver = silver % 100;
        }

        // Convert gold to platinum (100 gold = 1 platinum)
        if (gold >= 100) {
            const newPlatinum = Math.floor(gold / 100);
            platinum += newPlatinum;
            gold = gold % 100;
        }

        return { platinum, gold, silver, copper };
    },

    updateCurrency: (currencyData) => set((state) => {
        const oldCurrency = { ...state.currency };
        const newCurrency = { ...state.currency, ...currencyData };
        // Apply automatic conversion
        const convertedCurrency = get().convertCurrencyUpward(newCurrency);

        // Calculate the difference to determine if currency was gained or spent
        const currencyDiff = {};
        let hasGains = false;
        let hasSpending = false;

        Object.keys(convertedCurrency).forEach(currencyType => {
            const diff = convertedCurrency[currencyType] - oldCurrency[currencyType];
            if (diff !== 0) {
                currencyDiff[currencyType] = Math.abs(diff);
                if (diff > 0) hasGains = true;
                if (diff < 0) hasSpending = true;
            }
        });

        // Record character change for persistence
        if (hasGains) {
            recordCharacterChange('currency_gain', currencyDiff);
        }
        if (hasSpending) {
            recordCharacterChange('currency_spend', currencyDiff);
        }

        return { currency: convertedCurrency };
    }),

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
    addItem: (itemData) => {
        const currentState = get();
        const updateResult = get().processAddItem(currentState, itemData);

        if (updateResult.result.success) {
            set(updateResult.newState);

            // Record character change for persistence
            recordCharacterChange('inventory_add', {
                item: itemData,
                addedItemId: updateResult.result.addedItemId,
                timestamp: new Date()
            });
        }

        return updateResult.result;
    },

    // Process add item logic
    processAddItem: (state, itemData) => {
        // Generate a unique ID if not provided
        const newItem = {
            ...itemData,
            id: itemData.id || uuidv4(),
            quantity: itemData.quantity || 1,
            rotation: itemData.rotation || 0
        };

        // Handle shape data - convert legacy items or ensure shape exists
        if (!newItem.shape) {
            // Legacy item - convert width/height to shape
            const width = itemData.width || 1;
            const height = itemData.height || 1;
            newItem.shape = createRectangularShape(width, height);
        }

        // Ensure width/height are set for backward compatibility
        const bounds = getShapeBounds(newItem.shape);
        newItem.width = bounds.width;
        newItem.height = bounds.height;

        // Check if the item is stackable and if we already have it
        // Allow stacking for consumable, miscellaneous, and material items
        const isStackableType = newItem.type === 'consumable' || newItem.type === 'miscellaneous' || newItem.type === 'material';

        // For stackable types, default to stackable unless explicitly set to false
        // If stackable is undefined for stackable types, treat as true
        let effectiveStackable = itemData.stackable;
        if (isStackableType && itemData.stackable === undefined) {
            effectiveStackable = true;
            newItem.stackable = true;
        }

        const isStackable = isStackableType && (effectiveStackable !== false);

        if (isStackable) {
            const existingItemIndex = state.items.findIndex(item =>
                item.name === newItem.name &&
                item.type === newItem.type
            );

            if (existingItemIndex >= 0) {
                // Stack with existing item, but preserve properties from new item
                const updatedItems = [...state.items];
                const existingItem = updatedItems[existingItemIndex];

                // Ensure quantities are numbers, not objects
                const existingQuantity = typeof existingItem.quantity === 'number' ? existingItem.quantity : 1;
                const addingQuantity = typeof newItem.quantity === 'number' ? newItem.quantity : 1;
                const newQuantity = existingQuantity + addingQuantity;

                // Merge properties from new item to ensure we have all properties
                // This is important for items that might have been added before property preservation was fixed
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    ...newItem, // Merge new item properties
                    id: existingItem.id, // Keep the existing ID
                    quantity: newQuantity, // Add quantities
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

                // Return the existing item's ID to indicate success
                return {
                    newState: { items: updatedItems },
                    result: { success: true, addedItemId: existingItem.id }
                };
            }
        }

        // Find an empty position for the new item
        if (!newItem.position) {
            const currentGridSize = getCurrentGridSize();
            const emptyPosition = findEmptyPosition(
                state.items,
                currentGridSize,
                newItem
            );

            if (!emptyPosition) {
                // No empty position found - inventory is full for this item size
                console.warn(`🚫 INVENTORY FULL: No room in inventory for item: ${newItem.name} (${newItem.width}x${newItem.height})`);
                console.warn(`🚫 Grid size: ${currentGridSize.width}x${currentGridSize.height}, Total cells: ${currentGridSize.width * currentGridSize.height}`);

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
                newItem
            );

            if (!isValid) {
                // Provided position is invalid, try to find a new position
                const currentGridSize = getCurrentGridSize();
                const emptyPosition = findEmptyPosition(
                    state.items,
                    currentGridSize,
                    newItem
                );

                if (!emptyPosition) {
                    // No valid position found - inventory is full for this item size
                    console.warn(`🚫 INVENTORY FULL: No room in inventory for item: ${newItem.name} (${newItem.width}x${newItem.height})`);
                    console.warn(`🚫 Current inventory has ${state.items.length} items`);

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
                    return {
                        newState: { items: state.items },
                        result: { success: false, reason: 'inventory_full' }
                    };
                }

                // Position found, assign it
                newItem.position = emptyPosition;
            }
        }

        // If we reach here, the item has a valid position and can be added
        // Update encumbrance after adding item
        setTimeout(() => get().updateEncumbranceState(), 0);

        return {
            newState: { items: [...state.items, newItem] },
            result: { success: true, addedItemId: newItem.id }
        };
    },

    // Add item from library
    addItemFromLibrary: (libraryItem, options = {}) => {
        const store = get();

        // Set default dimensions based on item type and subtype
        let width = libraryItem.width || 1;
        let height = libraryItem.height || 1;

        // If dimensions aren't explicitly set, determine them based on item type
        if (!libraryItem.width || !libraryItem.height) {
            console.log(`🔧 DIMENSIONS: Setting default dimensions for ${libraryItem.name} (type: ${libraryItem.type}, subtype: ${libraryItem.subtype})`);

            if (libraryItem.type === 'weapon') {
                const subtype = (libraryItem.subtype || '').toLowerCase();
                if (subtype === 'greatsword' || subtype === 'greataxe' ||
                    subtype === 'maul' || subtype === 'polearm') {
                    // Two-handed weapons are longer and wider
                    width = 2;
                    height = 4;
                } else if (subtype === 'staff') {
                    // Staves are long but thin
                    width = 1;
                    height = 4;
                } else if (subtype === 'sword' || subtype === 'axe' || subtype === 'mace') {
                    // One-handed weapons are medium length
                    width = 1;
                    height = 2;
                } else if (subtype === 'dagger') {
                    // Daggers are small
                    width = 1;
                    height = 1;
                } else if (subtype === 'bow' || subtype === 'crossbow') {
                    // Bows are wider
                    width = 2;
                    height = 3;
                } else {
                    // Default weapon size
                    width = 1;
                    height = 2;
                }
            } else if (libraryItem.type === 'armor') {
                const subtype = (libraryItem.subtype || '').toLowerCase();
                if (subtype === 'plate') {
                    // Plate armor takes more space
                    width = 2;
                    height = 2;
                } else if (subtype === 'mail') {
                    // Mail armor is slightly smaller
                    width = 2;
                    height = 2;
                } else if (subtype === 'leather') {
                    // Leather armor is more compact
                    width = 1;
                    height = 2;
                } else if (subtype === 'cloth') {
                    // Cloth armor is the most compact
                    width = 1;
                    height = 1;
                } else {
                    // Default armor size
                    width = 1;
                    height = 2;
                }
            } else if (libraryItem.type === 'container') {
                // Containers are larger
                width = 2;
                height = 2;
            } else if (libraryItem.type === 'material') {
                // Materials are usually small
                width = 1;
                height = 1;
            } else if (libraryItem.type === 'consumable') {
                // Consumables are usually small
                width = 1;
                height = 1;
            } else if (libraryItem.type === 'accessory') {
                // Accessories are usually small
                width = 1;
                height = 1;
            } else if (libraryItem.type === 'quest') {
                // Quest items vary, default to medium
                width = 1;
                height = 2;
            } else {
                // Default size for unknown types
                width = 1;
                height = 1;
            }

            console.log(`🔧 DIMENSIONS: Set ${libraryItem.name} to ${width}x${height} (type: ${libraryItem.type}, subtype: ${libraryItem.subtype})`);
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
        const addResult = store.addItem(inventoryItem);

        // Check the result from addItem
        if (addResult && addResult.success) {
            return addResult.addedItemId;
        } else {
            return null;
        }
    },

    // Remove item with quantity support
    removeItem: (itemId, quantity = 0) => set((state) => {
        console.log(`🗑️ REMOVING ITEM FROM INVENTORY: ${itemId} (quantity: ${quantity})`);
        console.log(`🗑️ Current inventory items before removal:`, state.items.length);

        const itemIndex = state.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            console.log(`🗑️ Item ${itemId} not found in inventory`);
            return { items: state.items };
        }

        const item = state.items[itemIndex];
        console.log(`🗑️ Found item to remove:`, item.name);

        // If quantity is specified and less than total quantity, reduce quantity
        if (quantity > 0 && item.quantity > quantity) {
            console.log(`🗑️ Reducing quantity: ${item.quantity} -> ${item.quantity - quantity}`);
            const updatedItems = [...state.items];
            updatedItems[itemIndex] = {
                ...item,
                quantity: item.quantity - quantity
            };

            // Record character change for persistence
            recordCharacterChange('inventory_modify', {
                itemId: itemId,
                changes: { quantity: item.quantity - quantity },
                previousQuantity: item.quantity,
                timestamp: new Date()
            });

            // Update encumbrance after removing item
            setTimeout(() => get().updateEncumbranceState(), 0);

            return { items: updatedItems };
        }

        // Otherwise remove the item completely
        console.log(`🗑️ Removing entire item: ${item.name}`);
        const updatedItems = state.items.filter(item => item.id !== itemId);
        console.log(`🗑️ Inventory items after removal: ${updatedItems.length} (was ${state.items.length})`);

        // Record character change for persistence
        recordCharacterChange('inventory_remove', {
            itemId: itemId,
            item: item,
            timestamp: new Date()
        });

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

        if (!isValidPosition(state.items, newPosition.row, newPosition.col, item, itemId)) {
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

        // Get the item's shape
        let shape = item.shape;
        if (!shape) {
            const width = item.width || 1;
            const height = item.height || 1;
            shape = createRectangularShape(width, height);
        }

        // Check if the shape is rotationally symmetric (same when rotated)
        const rotatedShape = rotateShape(shape);
        const isRotationallySymmetric = JSON.stringify(shape.cells) === JSON.stringify(rotatedShape.cells);

        // For rotationally symmetric items, just rotate in place without any checks
        if (isRotationallySymmetric) {
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

        // Create a temporary item with the new rotation for validation
        const tempItem = { ...item, rotation: newRotation };
        const otherItems = state.items.filter(i => i.id !== itemId);

        // First, try to rotate in place
        if (isValidPosition(otherItems, row, col, tempItem, itemId)) {
            // Rotation in place is valid, update the item
            const updatedItems = state.items.map(i =>
                i.id === itemId
                    ? { ...i, rotation: newRotation }
                    : i
            );

            // Update encumbrance state after rotating
            setTimeout(() => get().updateEncumbranceState(), 0);

            return { items: updatedItems };
        }

        // If rotation in place isn't valid, try to find a nearby position where it would fit
        // Search in a spiral pattern starting from the current position
        const currentGridSize = getCurrentGridSize();
        const maxSearchRadius = Math.max(currentGridSize.WIDTH, currentGridSize.HEIGHT);

        // Helper function to generate positions in a spiral pattern
        const getSpiralPositions = (centerRow, centerCol, maxRadius) => {
            const positions = [];

            // Start with positions closest to the original position
            for (let radius = 1; radius <= maxRadius; radius++) {
                // Top row (left to right)
                for (let c = centerCol - radius; c <= centerCol + radius; c++) {
                    positions.push({ row: centerRow - radius, col: c });
                }
                // Right column (top to bottom, excluding corners)
                for (let r = centerRow - radius + 1; r <= centerRow + radius - 1; r++) {
                    positions.push({ row: r, col: centerCol + radius });
                }
                // Bottom row (right to left)
                for (let c = centerCol + radius; c >= centerCol - radius; c--) {
                    positions.push({ row: centerRow + radius, col: c });
                }
                // Left column (bottom to top, excluding corners)
                for (let r = centerRow + radius - 1; r >= centerRow - radius + 1; r--) {
                    positions.push({ row: r, col: centerCol - radius });
                }
            }

            return positions;
        };

        // Search for a valid position in spiral pattern
        const spiralPositions = getSpiralPositions(row, col, maxSearchRadius);

        for (const pos of spiralPositions) {
            if (isValidPosition(otherItems, pos.row, pos.col, tempItem, itemId)) {
                // Found a valid position! Rotate and move the item
                const updatedItems = state.items.map(i =>
                    i.id === itemId
                        ? { ...i, rotation: newRotation, position: { row: pos.row, col: pos.col } }
                        : i
                );

                // Update encumbrance state after rotating
                setTimeout(() => get().updateEncumbranceState(), 0);

                console.log(`🔄 Rotated item and moved from (${row}, ${col}) to (${pos.row}, ${pos.col})`);
                return { items: updatedItems };
            }
        }

        // If no valid position found anywhere, don't rotate
        console.warn(`⚠️ Cannot rotate item - no valid position found in inventory`);
        return { items: state.items };
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
        const emptyPosition = findEmptyPosition(state.items, currentGridSize, item);
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
    }),

    // Merge two stacks of the same item
    mergeStacks: (sourceItemId, targetItemId) => set((state) => {
        const sourceIndex = state.items.findIndex(item => item.id === sourceItemId);
        const targetIndex = state.items.findIndex(item => item.id === targetItemId);

        if (sourceIndex === -1 || targetIndex === -1) {
            return { items: state.items };
        }

        const sourceItem = state.items[sourceIndex];
        const targetItem = state.items[targetIndex];

        // Check if items can be stacked
        const canStack = sourceItem.name === targetItem.name &&
                        sourceItem.type === targetItem.type &&
                        sourceItem.quality === targetItem.quality &&
                        sourceItem.stackable !== false &&
                        targetItem.stackable !== false;

        if (!canStack) {
            return { items: state.items };
        }

        const sourceQuantity = sourceItem.quantity || 1;
        const targetQuantity = targetItem.quantity || 1;
        const maxStackSize = targetItem.maxStackSize || 99;

        // Calculate how much can be merged
        const availableSpace = maxStackSize - targetQuantity;
        const amountToMerge = Math.min(sourceQuantity, availableSpace);

        if (amountToMerge <= 0) {
            // Target stack is full
            return { items: state.items };
        }

        const updatedItems = [...state.items];

        // Update target item quantity
        updatedItems[targetIndex] = {
            ...targetItem,
            quantity: targetQuantity + amountToMerge
        };

        // Update or remove source item
        if (sourceQuantity > amountToMerge) {
            // Source still has items left
            updatedItems[sourceIndex] = {
                ...sourceItem,
                quantity: sourceQuantity - amountToMerge
            };
        } else {
            // Source is completely merged, remove it
            updatedItems.splice(sourceIndex, 1);
        }

        // Update encumbrance after merging
        setTimeout(() => get().updateEncumbranceState(), 0);

        return { items: updatedItems };
    }),

    // Clear all items from inventory
    clearInventory: () => set(() => {
        console.log('🗑️ Clearing all items from inventory');
        return {
            items: [],
            encumbranceState: 'normal'
        };
    })
}), { name: 'inventory' }));

export default useInventoryStore;
