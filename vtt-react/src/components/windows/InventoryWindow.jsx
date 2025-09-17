import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useCharacterStore from '../../store/characterStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useCraftingStore from '../../store/craftingStore';
import '../../styles/inventory.css';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getItemById } from '../../data/itemLibraryData';
import ContainerWindow from '../item-generation/ContainerWindow';
import UnlockContainerModal from '../item-generation/UnlockContainerModal';
import UnifiedCurrencyWithdrawModal from './UnifiedCurrencyWithdrawModal';
import EquipmentContextMenu from '../equipment/EquipmentContextMenu';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getCompatibleSlots } from '../../utils/equipmentUtils';
import { getInventoryGridDimensions } from '../../utils/characterUtils';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import {
    convertLegacyItemToShape,
    getShapeBounds,
    isCellOccupied as isShapeCellOccupied,
    createRectangularShape,
    getOccupiedCells,
    rotateShape
} from '../../utils/itemShapeUtils';

// Default grid size as fallback
const DEFAULT_GRID_SIZE = {
    WIDTH: 15,
    HEIGHT: 5,
    NORMAL_SECTION: 5,
    ENCUMBERED_SECTION: 5,
    OVERENCUMBERED_SECTION: 5
};

// Helper function to get quality color
const getQualityColor = (quality, rarity) => {
    // Check for both quality and rarity properties
    const itemQuality = quality || rarity || 'common';
    const qualityLower = itemQuality.toLowerCase();
    return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
};

export default function InventoryWindow() {
    // Force refresh mechanism
    const [refreshKey, setRefreshKey] = useState(0);

    // Get character stats for dynamic grid sizing
    const { stats, derivedStats, equipmentBonuses } = useCharacterStore(state => ({
        stats: state.stats,
        derivedStats: state.derivedStats,
        equipmentBonuses: state.equipmentBonuses
    }));

    // Calculate current grid size based on carrying capacity - make it reactive
    const GRID_SIZE = useMemo(() => {
        if (derivedStats && derivedStats.carryingCapacity) {
            const gridDimensions = getInventoryGridDimensions(derivedStats.carryingCapacity);
            console.log('📦 Inventory grid dimensions calculated:', {
                carryingCapacity: derivedStats.carryingCapacity,
                strength: stats.strength,
                equipmentBonuses: equipmentBonuses,
                totalStrength: (stats.strength || 0) + (equipmentBonuses?.str || 0),
                strModifier: Math.floor(((stats.strength || 0) + (equipmentBonuses?.str || 0) - 10) / 2),
                gridDimensions,
                actualGridSize: `${gridDimensions.HEIGHT}x${gridDimensions.WIDTH}`,
                expectedForStrength: `Should be ${5 + Math.max(0, Math.floor(((stats.strength || 0) + (equipmentBonuses?.str || 0) - 10) / 2))}x15`
            });
            return gridDimensions;
        }
        // Using default grid size - no carrying capacity found (log removed for performance)
        return DEFAULT_GRID_SIZE;
    }, [derivedStats?.carryingCapacity, stats.strength, equipmentBonuses?.str]);

    // Force re-render when stats change
    useEffect(() => {
        // Character stats changed, updating inventory grid (log removed for performance)
        setRefreshKey(prev => prev + 1);
    }, [stats.strength, derivedStats?.carryingCapacity, equipmentBonuses?.str]);

    // Listen for inventory updates
    useEffect(() => {
        // Subscribe to inventory store changes
        const unsubscribe = useInventoryStore.subscribe(
            (state) => state.items,
            (items) => {
                console.log('Inventory items changed, forcing refresh');
                setRefreshKey(prev => prev + 1);
            }
        );

        // Listen for custom inventory-updated events
        const handleInventoryUpdated = (event) => {
            console.log('Received inventory-updated event:', event.detail);
            setRefreshKey(prev => prev + 1);
        };

        window.addEventListener('inventory-updated', handleInventoryUpdated);

        return () => {
            unsubscribe();
            window.removeEventListener('inventory-updated', handleInventoryUpdated);
        };
    }, []);

    // Subscribe to inventory store with a selector function to ensure re-renders
    const {
        currency,
        items,
        encumbranceState,
        updateCurrency,
        addItem,
        addItemFromLibrary,
        removeItem,
        splitStack,
        rotateItem
    } = useInventoryStore(state => ({
        currency: state.currency,
        items: state.items,
        encumbranceState: state.encumbranceState,
        updateCurrency: state.updateCurrency,
        addItem: state.addItem,
        addItemFromLibrary: state.addItemFromLibrary,
        removeItem: state.removeItem,
        splitStack: state.splitStack,
        rotateItem: state.rotateItem
    }));

    const { items: itemStoreItems } = useItemStore(state => ({
        items: state.items
    }));

    // Character store for equipment management and resource updates
    const { equipItem, updateResource, health, mana } = useCharacterStore(state => ({
        equipItem: state.equipItem,
        updateResource: state.updateResource,
        health: state.health,
        mana: state.mana
    }));

    // Crafting store for learning recipes
    const { learnRecipe } = useCraftingStore(state => ({
        learnRecipe: state.learnRecipe
    }));

    // Buff store for consumable effects
    const { addBuff } = useBuffStore(state => ({
        addBuff: state.addBuff
    }));

    // Debuff store for negative consumable effects
    const { addDebuff } = useDebuffStore(state => ({
        addDebuff: state.addDebuff
    }));

    // Use local state for open containers instead of the item store
    const [localOpenContainers, setLocalOpenContainers] = useState(new Set());

    const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, itemId: null });
    const [equipmentContextMenu, setEquipmentContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
    const [showItemTooltip, setShowItemTooltip] = useState({ visible: false, x: 0, y: 0, itemId: null });
    const [totalWeight, setTotalWeight] = useState({ normal: 0, encumbered: 0, overencumbered: 0, total: 0 });
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [containerToUnlock, setContainerToUnlock] = useState(null);
    const [showCurrencyWithdrawModal, setShowCurrencyWithdrawModal] = useState(false);


    // Refs
    const contextMenuRef = useRef(null);

    // Removed excessive re-rendering logic for better performance

    // Calculate item counts in each section
    useEffect(() => {
        let normalCount = 0;
        let encumberedCount = 0;
        let overencumberedCount = 0;

        items.forEach(item => {
            const col = item.position.col;
            if (col < GRID_SIZE.NORMAL_SECTION) {
                normalCount++;
            } else if (col < GRID_SIZE.NORMAL_SECTION + GRID_SIZE.ENCUMBERED_SECTION) {
                encumberedCount++;
            } else {
                overencumberedCount++;
            }
        });

        setTotalWeight({
            normal: normalCount,
            encumbered: encumberedCount,
            overencumbered: overencumberedCount,
            total: items.length
        });
    }, [items, GRID_SIZE.NORMAL_SECTION, GRID_SIZE.ENCUMBERED_SECTION]);

    // Monitor localOpenContainers changes
    useEffect(() => {
        console.log('localOpenContainers changed:', Array.from(localOpenContainers));
    }, [localOpenContainers]);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu({ visible: false });
                setEquipmentContextMenu({ visible: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Add keyboard shortcut for Escape key to close context menu
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedItemId(null);
                setContextMenu({ visible: false });
                setEquipmentContextMenu({ visible: false });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Handle context menu for items
    const handleItemContextMenu = (e, itemId) => {
        e.preventDefault();

        // Get mouse position
        const x = e.pageX || e.clientX;
        const y = e.pageY || e.clientY;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Estimate context menu dimensions
        const menuWidth = 200;
        const menuHeight = 150;

        // Calculate position to ensure context menu stays within viewport
        // Start by positioning directly at cursor
        let posX = x;
        let posY = y;

        // Adjust if menu would go off right edge
        if (posX + menuWidth > viewportWidth) {
            posX = Math.max(0, x - menuWidth);
        }

        // Adjust if menu would go off bottom edge
        if (posY + menuHeight > viewportHeight) {
            posY = Math.max(0, y - menuHeight);
        }

        // Position the context menu directly at the mouse cursor
        setContextMenu({
            visible: true,
            x: posX,
            y: posY,
            itemId
        });
    };

    // Handle item tooltip (simplified to match character sheet pattern)
    const handleItemMouseEnter = (e, itemId) => {
        setShowItemTooltip({
            visible: true,
            x: e.clientX + 15,
            y: e.clientY - 10,
            itemId
        });
    };

    // Handle mouse move on item to update tooltip position
    const handleItemMouseMove = (e, itemId) => {
        if (showItemTooltip.visible && showItemTooltip.itemId === itemId) {
            setShowItemTooltip({
                ...showItemTooltip,
                x: e.clientX + 15,
                y: e.clientY - 10
            });
        }
    };

    const handleItemMouseLeave = () => {
        setShowItemTooltip({ visible: false });
    };

    // Handle equipment context menu
    const handleEquipmentContextMenu = (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if item can be equipped
        const compatibleSlots = getCompatibleSlots(item);
        if (compatibleSlots.length === 0) {
            return; // Don't show menu for non-equippable items
        }

        // Calculate position to ensure menu stays within viewport
        const x = Math.min(e.clientX, window.innerWidth - 250);
        const y = Math.min(e.clientY, window.innerHeight - 200);

        setEquipmentContextMenu({
            visible: true,
            x,
            y,
            item
        });
    };

    // Handle equipping an item
    const handleEquipItem = (slotName, itemToEquip = null) => {
        const item = itemToEquip || equipmentContextMenu.item;
        if (!item) return;

        try {
            // Equip the item to the character
            const result = equipItem(item, slotName);

            // Remove the item from inventory
            removeItem(item.id);

            // Handle items returned from two-handed weapon conflicts
            if (result && result.itemsToReturn && result.itemsToReturn.length > 0) {
                result.itemsToReturn.forEach(returnedItem => {
                    addItem(returnedItem);
                });
                console.log(`Equipped ${item.name} to ${slotName} and returned ${result.itemsToReturn.length} conflicting items to inventory`);
            } else {
                console.log(`Equipped ${item.name} to ${slotName}`);
            }
        } catch (error) {
            console.error('Error equipping item:', error);
        }
    };

    // Handle using a consumable item
    const handleUseConsumable = (item) => {
        if (!item) return;

        try {
            console.log('Using item from inventory:', item.name);

            // Handle recipe scrolls
            if (item.subtype === 'recipe' && item.recipeId) {
                console.log('Learning recipe:', item.recipeId);

                // Learn the recipe
                learnRecipe(item.requiredProfession || 'alchemy', item.recipeId);

                // Remove the recipe scroll from inventory
                removeItem(item.id, 1);

                console.log(`Learned recipe: ${item.name}`);
                return;
            }

            // Handle regular consumables
            if (item.type !== 'consumable') return;

            console.log('Using consumable from inventory:', item.name);

            // Apply consumable effects (same logic as ActionBar)
            const combatStats = item.combatStats || {};
            let hasInstantEffects = false;
            let hasBuffEffects = false;
            let hasDebuffEffects = false;
            const effects = {};

            // Apply instant healing effects
            if (combatStats.healthRestore) {
                const healAmount = combatStats.healthRestore.value || 0;
                if (healAmount > 0) {
                    const newHealthValue = Math.min(health.max, health.current + healAmount);
                    updateResource('health', newHealthValue, health.max);
                    hasInstantEffects = true;
                }
            }

            // Apply instant mana restoration
            if (combatStats.manaRestore) {
                const manaAmount = combatStats.manaRestore.value || 0;
                if (manaAmount > 0) {
                    const newManaValue = Math.min(mana.max, mana.current + manaAmount);
                    updateResource('mana', newManaValue, mana.max);
                    hasInstantEffects = true;
                }
            }

            // Collect stat buff effects from combatStats
            ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'].forEach(stat => {
                if (combatStats[stat] && combatStats[stat].value > 0) {
                    effects[stat] = combatStats[stat].value;
                    hasBuffEffects = true;
                }
            });

            // Collect other combat stat effects (armor, damage, etc.)
            ['armor', 'damage', 'spellDamage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'].forEach(stat => {
                if (combatStats[stat] && combatStats[stat].value > 0) {
                    effects[stat] = combatStats[stat].value;
                    hasBuffEffects = true;
                }
            });

            // Handle spell damage types
            if (combatStats.spellDamage && combatStats.spellDamage.types) {
                Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
                    const value = typeof spellData === 'object' ? spellData.value : spellData;
                    if (value > 0) {
                        effects[`${spellType}SpellPower`] = value;
                        hasBuffEffects = true;
                    }
                });
            }

            // Handle individual spell damage types (fire, frost, etc.)
            const spellDamageTypes = ['fire', 'frost', 'arcane', 'shadow', 'holy', 'nature', 'lightning', 'cold', 'acid', 'force', 'thunder'];
            spellDamageTypes.forEach(type => {
                const typeKey = `${type}Damage`;
                const spellPowerKey = `${type}SpellPower`;

                if (combatStats[typeKey] && combatStats[typeKey].value > 0) {
                    effects[spellPowerKey] = combatStats[typeKey].value;
                    hasBuffEffects = true;
                }

                if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value > 0) {
                    effects[spellPowerKey] = combatStats[spellPowerKey].value;
                    hasBuffEffects = true;
                }
            });

            // Handle resistances
            if (combatStats.resistances) {
                Object.entries(combatStats.resistances).forEach(([resistanceType, resData]) => {
                    const value = typeof resData === 'object' ? resData.value : resData;
                    if (value > 0) {
                        effects[`${resistanceType}Resistance`] = value;
                        hasBuffEffects = true;
                    }
                });
            }

            // Also check baseStats for buff/debuff effects (this is where elixirs store their stat bonuses)
            const baseStats = item.baseStats || {};
            const buffEffects = { ...effects }; // Start with effects from combatStats
            const debuffEffects = {};

            Object.keys(baseStats).forEach(statName => {
                const statData = baseStats[statName];
                if (statData) {
                    const value = typeof statData === 'object' ? statData.value : statData;
                    if (value > 0) {
                        buffEffects[statName] = value;
                        hasBuffEffects = true;
                        console.log(`Adding buff effect from baseStats: ${statName} +${value}`);
                    } else if (value < 0) {
                        debuffEffects[statName] = Math.abs(value); // Store as positive value, debuff store will make it negative
                        hasDebuffEffects = true;
                        console.log(`Adding debuff effect from baseStats: ${statName} ${value}`);
                    }
                }
            });

            // Check utilityStats for additional effects
            const utilityStats = item.utilityStats || {};
            Object.keys(utilityStats).forEach(statName => {
                const statData = utilityStats[statName];
                if (statData) {
                    const value = typeof statData === 'object' ? statData.value : statData;
                    if (value > 0) {
                        // Map utility stat names
                        const statMap = {
                            movementSpeed: 'moveSpeed',
                            carryingCapacity: 'carryingCapacity'
                        };
                        const mappedStat = statMap[statName] || statName;
                        buffEffects[mappedStat] = value;
                        hasBuffEffects = true;
                        console.log(`Adding buff effect from utilityStats: ${mappedStat} +${value}`);
                    } else if (value < 0) {
                        const statMap = {
                            movementSpeed: 'moveSpeed',
                            carryingCapacity: 'carryingCapacity'
                        };
                        const mappedStat = statMap[statName] || statName;
                        debuffEffects[mappedStat] = Math.abs(value);
                        hasDebuffEffects = true;
                        console.log(`Adding debuff effect from utilityStats: ${mappedStat} ${value}`);
                    }
                }
            });

            // Apply buff effects if any exist
            if (hasBuffEffects) {
                addBuff({
                    name: item.name,
                    icon: `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg`,
                    description: item.description || `Temporary enhancement from ${item.name}`,
                    effects: buffEffects,
                    duration: 180, // 3 minutes (3 rounds)
                    source: 'consumable',
                    stackable: false
                });
            }

            // Apply debuff effects if any exist
            if (hasDebuffEffects) {
                addDebuff({
                    name: item.name,
                    icon: `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg`,
                    description: item.description || `Negative effects from ${item.name}`,
                    effects: debuffEffects,
                    duration: 180, // 3 minutes (3 rounds)
                    source: 'consumable',
                    stackable: false
                });
            }

            // Remove one item from inventory
            removeItem(item.id, 1);

            // Log effect application
            if (hasInstantEffects) {
                console.log(`Applied instant effects from ${item.name}`);
            }
            if (hasBuffEffects) {
                console.log(`Applied buff effects from ${item.name}`);
            }

        } catch (error) {
            console.error('Error using consumable:', error);
        }
    };













    // Function to toggle container open state
    const toggleContainerOpen = (containerId) => {
        console.log('toggleContainerOpen called for container ID:', containerId);

        // Find the container in inventory items
        const container = items.find(item => item.id === containerId);

        // If not found in inventory, check item store
        let storeContainer = null;
        if (!container) {
            storeContainer = itemStoreItems.find(item => item.id === containerId);
        }

        // Get the actual container object to work with
        const containerToUse = container || storeContainer;

        // Check if container exists
        if (!containerToUse) {
            console.error('Container not found for ID:', containerId);
            return; // Exit if container not found
        }

        console.log('Found container:', containerToUse.name, containerToUse.id);

        // CRITICAL: Force container type to be 'container' if it's not already
        if (containerToUse.type !== 'container') {
            containerToUse.type = 'container';

            // Update the type in the appropriate store
            if (container) {
                useInventoryStore.getState().updateItem(containerId, {
                    type: 'container'
                });
            } else if (storeContainer) {
                useItemStore.getState().updateItem(containerId, {
                    type: 'container'
                });
            }
        }

        // Check if container properties exist
        if (!containerToUse.containerProperties) {
            // Initialize container properties if missing
            const defaultContainerProperties = {
                gridSize: { rows: 4, cols: 6 },
                items: [],
                isLocked: false,
                lockType: 'none',
                lockDC: 0,
                lockCode: '',
                flavorText: '',
                maxAttempts: 3,
                failureAction: 'none',
                failureActionDetails: {
                    removeItems: false,
                    removePercentage: 50,
                    destroyContainer: false,
                    triggerTrap: false,
                    trapDetails: '',
                    transformIntoCreature: false,
                    creatureType: ''
                }
            };

            // Update the item in the store to persist the container properties
            if (container) {
                useInventoryStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: defaultContainerProperties
                });
            } else if (storeContainer) {
                useItemStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: defaultContainerProperties
                });
            }

            // Also update the local container object for immediate use
            containerToUse.containerProperties = defaultContainerProperties;
        }

        // Check if the container is already open
        const isCurrentlyOpen = localOpenContainers.has(containerId);

        // If it's already open, close it; otherwise, open it
        if (isCurrentlyOpen) {
            console.log('Closing container:', containerToUse.name, containerId);
            setLocalOpenContainers(prev => {
                const newOpenContainers = new Set(prev);
                newOpenContainers.delete(containerId);
                console.log('Updated localOpenContainers after closing:', Array.from(newOpenContainers));
                return newOpenContainers;
            });

            // Also update the item store's openContainers set
            try {
                const itemStoreOpenContainers = useItemStore.getState().openContainers;
                const newItemStoreOpenContainers = new Set(
                    itemStoreOpenContainers instanceof Set
                        ? itemStoreOpenContainers
                        : new Set(Array.isArray(itemStoreOpenContainers) ? itemStoreOpenContainers : [])
                );

                newItemStoreOpenContainers.delete(containerId);
                useItemStore.setState({ openContainers: newItemStoreOpenContainers });
                console.log('Updated itemStore openContainers after closing:', Array.from(newItemStoreOpenContainers));
            } catch (error) {
                console.error('Error updating itemStore openContainers:', error);
            }
        } else {
            console.log('Opening container:', containerToUse.name, containerId);

            // First update the container properties if needed
            if (container) {
                console.log('Updating inventory item:', containerId);
                useInventoryStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: containerToUse.containerProperties
                });
            } else if (storeContainer) {
                console.log('Updating item store item:', containerId);
                useItemStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: containerToUse.containerProperties
                });
            }

            // Then open the container
            setLocalOpenContainers(prev => {
                const newOpenContainers = new Set(prev);
                newOpenContainers.add(containerId);
                console.log('Updated localOpenContainers after opening:', Array.from(newOpenContainers));
                return newOpenContainers;
            });

            // Also update the item store's openContainers set
            try {
                const itemStoreOpenContainers = useItemStore.getState().openContainers;
                const newItemStoreOpenContainers = new Set(
                    itemStoreOpenContainers instanceof Set
                        ? itemStoreOpenContainers
                        : new Set(Array.isArray(itemStoreOpenContainers) ? itemStoreOpenContainers : [])
                );

                newItemStoreOpenContainers.add(containerId);
                useItemStore.setState({ openContainers: newItemStoreOpenContainers });
                console.log('Updated itemStore openContainers after opening:', Array.from(newItemStoreOpenContainers));
            } catch (error) {
                console.error('Error updating itemStore openContainers:', error);
            }
        }
    };

    // Function to check if a container is open
    const isContainerOpen = (containerId) => {
        return localOpenContainers.has(containerId);
    };

    // Currency conversion functions
    const convertCurrency = (from, to, amount) => {
        if (amount <= 0) return;

        const rates = {
            copper: { silver: 0.01, gold: 0.0001, platinum: 0.000001 },
            silver: { copper: 100, gold: 0.01, platinum: 0.0001 },
            gold: { copper: 10000, silver: 100, platinum: 0.01 },
            platinum: { copper: 1000000, silver: 10000, gold: 100 }
        };

        const fromValue = currency[from];
        if (fromValue < amount) return; // Not enough currency

        const toValue = currency[to] + (amount * rates[from][to]);
        const newFromValue = fromValue - amount;

        updateCurrency({
            [from]: newFromValue,
            [to]: toValue
        });
    };

    // Helper functions for inventory management with shape support
    const isValidPosition = (items, row, col, itemToPlace, itemId = null) => {
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
            // Use the rotateShape function for both rectangular and custom shapes
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

    // Helper function to get all cells that would be occupied by an item with shape support
    const getItemOccupiedCells = (item) => {
        const cells = [];

        // Get the item's shape
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

        // Convert to absolute grid positions
        occupiedCells.forEach(cell => {
            const cellRow = item.position.row + cell.row;
            const cellCol = item.position.col + cell.col;
            cells.push(`${cellRow}-${cellCol}`);
        });

        return cells;
    };

    // Handle drag start for items
    const handleDragStart = (e, item) => {
        setDraggedItem(item);

        // Create a deep copy of the item to ensure all properties are included
        const itemCopy = JSON.parse(JSON.stringify(item));

        // Ensure quality is set
        itemCopy.quality = itemCopy.quality || itemCopy.rarity || 'common';

        // Ensure currency properties are preserved
        if (item.isCurrency) {
            itemCopy.isCurrency = true;
            itemCopy.currencyType = item.currencyType || null;
            itemCopy.currencyValue = item.currencyValue || null;
            itemCopy.type = item.type || 'currency';


        }

        // Add originalItemStoreId to reference back to the item store if needed
        itemCopy.originalItemStoreId = item.originalItemId || item.originalItemStoreId || null;

        // Set data for both inventory movement and grid placement
        const dragData = {
            id: item.id,
            type: 'inventory-item',
            // Include the full item data for grid placement
            item: itemCopy
        };

        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));

        // Create a custom drag image if needed
        if (item.iconId) {
            const img = new Image();
            img.src = `${WOW_ICON_BASE_URL}${item.iconId}.jpg`;
            e.dataTransfer.setDragImage(img, 25, 25);
        }

        // Allow both move and copy operations
        e.dataTransfer.effectAllowed = 'copyMove';


    };

    // Handle drag over for cells
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!draggedItem) return;

        // Get the cell coordinates
        const cell = e.currentTarget;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Get item dimensions
        const width = draggedItem.width || 1;
        const height = draggedItem.height || 1;
        const rotation = draggedItem.rotation || 0;

        // Check if the position is valid
        const isValid = isValidPosition(
            items.filter(i => i.id !== draggedItem.id),
            row,
            col,
            draggedItem,
            draggedItem.id
        );

        // Get all cells that would be occupied
        const tempItem = { ...draggedItem, position: { row, col } };
        const occupiedCells = getItemOccupiedCells(tempItem);

        // Remove highlight from all cells
        document.querySelectorAll('.inventory-cell').forEach(cell => {
            cell.classList.remove('drag-over');
            cell.classList.remove('drag-invalid');
        });

        // Add appropriate highlight to occupied cells
        occupiedCells.forEach(cellId => {
            const cellElement = document.querySelector(`.inventory-cell[data-row="${cellId.split('-')[0]}"][data-col="${cellId.split('-')[1]}"]`);
            if (cellElement) {
                cellElement.classList.add(isValid ? 'drag-over' : 'drag-invalid');
            }
        });
    };

    // Handle drag leave for cells
    const handleDragLeave = (e) => {
        // We don't remove the highlight here as it would flicker
        // The highlight is managed in handleDragOver
    };

    // Handle drag end - optimized to reduce DOM queries
    const handleDragEnd = () => {
        // Clear all highlights using cached elements if available
        const cells = document.querySelectorAll('.inventory-cell');
        cells.forEach(cell => {
            cell.classList.remove('drag-over', 'drag-invalid'); // Combined for performance
        });
        setDraggedItem(null);
    };

    // Handle drop for cells
    const handleDrop = (e, row, col) => {
        e.preventDefault();

        // Clear all highlights - optimized
        const cells = document.querySelectorAll('.inventory-cell');
        cells.forEach(cell => {
            cell.classList.remove('drag-over', 'drag-invalid'); // Combined for performance
        });

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (data.type === 'inventory-item') {
                const { id } = data;
                const item = items.find(item => item.id === id);

                if (item) {
                    // Check if there's an item at the target position
                    const targetItem = items.find(i =>
                        i.id !== id &&
                        i.position &&
                        i.position.row === row &&
                        i.position.col === col
                    );

                    if (targetItem) {
                        // Check if we can merge stacks
                        const canStack = item.name === targetItem.name &&
                                        item.type === targetItem.type &&
                                        item.quality === targetItem.quality &&
                                        item.stackable !== false &&
                                        targetItem.stackable !== false;

                        if (canStack) {
                            // Attempt to merge stacks
                            useInventoryStore.getState().mergeStacks(id, targetItem.id);
                            return;
                        }
                    }

                    // Get item dimensions
                    const width = item.width || 1;
                    const height = item.height || 1;
                    const rotation = item.rotation || 0;

                    // Check if the position is valid
                    const isValid = isValidPosition(
                        items.filter(i => i.id !== id),
                        row,
                        col,
                        item,
                        id
                    );

                    if (isValid) {
                        useInventoryStore.getState().moveItem(id, { row, col });
                    }
                }
            } else if (data.type === 'container-item') {
                // Handle items dragged from containers
                const { item, containerId } = data;

                if (item) {
                    // Check if there's an item at the target position that we can stack with
                    const targetItem = items.find(i =>
                        i.position &&
                        i.position.row === row &&
                        i.position.col === col
                    );

                    if (targetItem) {
                        // Check if we can merge stacks
                        const canStack = item.name === targetItem.name &&
                                        item.type === targetItem.type &&
                                        item.quality === targetItem.quality &&
                                        item.stackable !== false &&
                                        targetItem.stackable !== false;

                        if (canStack) {
                            // Calculate merge amounts
                            const sourceQuantity = item.quantity || 1;
                            const targetQuantity = targetItem.quantity || 1;
                            const maxStackSize = targetItem.maxStackSize || 99;
                            const availableSpace = maxStackSize - targetQuantity;
                            const amountToMerge = Math.min(sourceQuantity, availableSpace);

                            if (amountToMerge > 0) {
                                // Update target item quantity
                                useInventoryStore.getState().updateItem(targetItem.id, {
                                    quantity: targetQuantity + amountToMerge
                                });

                                // Remove from container or update container item quantity
                                const container = items.find(i => i.id === containerId) ||
                                                 itemStoreItems.find(i => i.id === containerId);

                                if (container && container.containerProperties) {
                                    const containerItems = container.containerProperties.items;
                                    const itemIndex = containerItems.findIndex(i => i.id === item.id);

                                    if (itemIndex !== -1) {
                                        let updatedItems;

                                        if (sourceQuantity > amountToMerge) {
                                            // Update quantity in container
                                            updatedItems = [...containerItems];
                                            updatedItems[itemIndex] = {
                                                ...updatedItems[itemIndex],
                                                quantity: sourceQuantity - amountToMerge
                                            };
                                        } else {
                                            // Remove item completely from container
                                            updatedItems = containerItems.filter(i => i.id !== item.id);
                                        }

                                        // Update the container
                                        if (items.find(i => i.id === containerId)) {
                                            useInventoryStore.getState().updateItem(containerId, {
                                                containerProperties: {
                                                    ...container.containerProperties,
                                                    items: updatedItems
                                                }
                                            });
                                        } else {
                                            useItemStore.getState().updateItem(containerId, {
                                                containerProperties: {
                                                    ...container.containerProperties,
                                                    items: updatedItems
                                                }
                                            });
                                        }
                                    }
                                }
                                return;
                            }
                        }
                    }

                    // Get item dimensions
                    const width = item.width || 1;
                    const height = item.height || 1;
                    const rotation = item.rotation || 0;

                    // Check if the position is valid
                    const isValid = isValidPosition(
                        items,
                        row,
                        col,
                        item
                    );

                    if (isValid) {
                        // Add the item to inventory with the specified position
                        const itemWithPosition = {
                            ...item,
                            position: { row, col }
                        };

                        // Add to inventory
                        addItemFromLibrary(itemWithPosition);

                        // Remove from container
                        const container = items.find(i => i.id === containerId) ||
                                         itemStoreItems.find(i => i.id === containerId);

                        if (container && container.containerProperties) {
                            // Update the container by filtering out the removed item
                            const updatedItems = container.containerProperties.items.filter(i => i.id !== item.id);

                            // Update the container in the appropriate store
                            if (items.find(i => i.id === containerId)) {
                                // Container is in inventory
                                useInventoryStore.getState().updateItem(containerId, {
                                    containerProperties: {
                                        ...container.containerProperties,
                                        items: updatedItems
                                    }
                                });
                            } else {
                                // Container is in item store
                                useItemStore.getState().updateItem(containerId, {
                                    containerProperties: {
                                        ...container.containerProperties,
                                        items: updatedItems
                                    }
                                });
                            }
                        }
                    }
                }
            } else if (data.type === 'item') {
                // Handle items dragged from item library
                const { id } = data;
                const libraryItem = itemStoreItems.find(item => item.id === id);

                if (libraryItem) {
                    // Check if there's an item at the target position that we can stack with
                    const targetItem = items.find(i =>
                        i.position &&
                        i.position.row === row &&
                        i.position.col === col
                    );

                    if (targetItem) {
                        // Check if we can merge stacks
                        const canStack = libraryItem.name === targetItem.name &&
                                        libraryItem.type === targetItem.type &&
                                        libraryItem.quality === targetItem.quality &&
                                        libraryItem.stackable !== false &&
                                        targetItem.stackable !== false;

                        if (canStack) {
                            // Calculate merge amounts
                            const sourceQuantity = 1; // Library items are added with quantity 1
                            const targetQuantity = targetItem.quantity || 1;
                            const maxStackSize = targetItem.maxStackSize || 99;
                            const availableSpace = maxStackSize - targetQuantity;

                            if (availableSpace > 0) {
                                // Update target item quantity
                                useInventoryStore.getState().updateItem(targetItem.id, {
                                    quantity: targetQuantity + sourceQuantity
                                });
                                return;
                            }
                        }
                    }

                    // Get item dimensions
                    const width = libraryItem.width || 1;
                    const height = libraryItem.height || 1;
                    const rotation = 0;

                    // Check if the position is valid
                    const tempItem = { ...libraryItem, width, height, rotation: 0 };
                    const isValid = isValidPosition(
                        items,
                        row,
                        col,
                        tempItem
                    );

                    if (isValid) {
                        // Add the item to inventory with the specified position
                        const itemWithPosition = {
                            ...libraryItem,
                            position: { row, col }
                        };

                        // Add to inventory
                        addItemFromLibrary(itemWithPosition);
                    }
                }
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }

        setDraggedItem(null);
    };

    // Render grid with section headers
    const renderGrid = () => {


        // Create section headers
        const sectionHeaders = (
            <div className="inventory-section-headers">
                <div className="section-header normal">Normal</div>
                <div className="section-header encumbered">Encumbered</div>
                <div className="section-header overencumbered">Overencumbered</div>
            </div>
        );

        // Create grid
        const grid = [];
        for (let row = 0; row < GRID_SIZE.HEIGHT; row++) {
            const gridRow = [];
            for (let col = 0; col < GRID_SIZE.WIDTH; col++) {
                let cellType = 'normal';
                if (col >= GRID_SIZE.NORMAL_SECTION) {
                    cellType = 'encumbered';
                }
                if (col >= GRID_SIZE.NORMAL_SECTION + GRID_SIZE.ENCUMBERED_SECTION) {
                    cellType = 'overencumbered';
                }

                // Find an item that occupies this cell (with custom shape support)
                const item = items.find(item => {
                    // Get the item's shape
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

                    // Calculate relative position within the item's shape
                    const relativeRow = row - item.position.row;
                    const relativeCol = col - item.position.col;

                    // Check if this cell is occupied by the item's shape
                    return relativeRow >= 0 && relativeCol >= 0 &&
                           isShapeCellOccupied(shape, relativeRow, relativeCol);
                });

                // Check if this is the top-left cell of the item (for rendering)
                const isItemOrigin = item && item.position.row === row && item.position.col === col;

                gridRow.push(
                    <div
                        key={`${row}-${col}`}
                        className={`inventory-cell ${cellType} ${item ? 'occupied' : ''}`}
                        data-row={row}
                        data-col={col}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, row, col)}
                        onClick={() => setSelectedItemId(null)}
                    >

                        {item && isItemOrigin && (() => {
                            // Get the item's shape and bounds
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

                            const bounds = getShapeBounds(shape);
                            const isMultiCell = bounds.width > 1 || bounds.height > 1;



                            // Determine if this is a simple rectangular shape or a complex custom shape
                            let isSimpleRectangle = false;
                            let iconCellRow = 0, iconCellCol = 0;

                            if (shape.type === 'rectangular') {
                                isSimpleRectangle = true;
                            } else if (shape.type === 'custom') {
                                // Check if the custom shape is actually a filled rectangle
                                let totalCells = bounds.width * bounds.height;
                                let occupiedCells = 0;
                                let firstOccupiedRow = -1, firstOccupiedCol = -1;

                                shape.cells.forEach((shapeRow, rowIndex) => {
                                    shapeRow.forEach((isOccupied, colIndex) => {
                                        if (isOccupied) {
                                            occupiedCells++;
                                            if (firstOccupiedRow === -1) {
                                                firstOccupiedRow = rowIndex;
                                                firstOccupiedCol = colIndex;
                                            }
                                        }
                                    });
                                });

                                // If all cells in the bounds are occupied, it's a simple rectangle
                                isSimpleRectangle = (occupiedCells === totalCells);

                                // For complex shapes, use the first occupied cell for icon placement
                                if (!isSimpleRectangle) {
                                    iconCellRow = firstOccupiedRow;
                                    iconCellCol = firstOccupiedCol;
                                }
                            }

                            return (
                                <div className="item-wrapper" style={{
                                    width: `${bounds.width * 100}%`,
                                    height: `${bounds.height * 100}%`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    overflow: 'visible'
                                }}>
                                    {/* Render custom shape cells */}
                                    {shape.type === 'custom' ? (
                                        shape.cells.map((shapeRow, shapeRowIndex) =>
                                            shapeRow.map((isOccupied, shapeColIndex) => {
                                                if (!isOccupied) return null;

                                                return (
                                                    <div
                                                        key={`${shapeRowIndex}-${shapeColIndex}`}
                                                        className={`item-shape-cell ${selectedItemId === item.id ? 'selected' : ''}`}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${(shapeColIndex / bounds.width) * 100}%`,
                                                            top: `${(shapeRowIndex / bounds.height) * 100}%`,
                                                            width: `${(1 / bounds.width) * 100}%`,
                                                            height: `${(1 / bounds.height) * 100}%`,
                                                            borderColor: getQualityColor(item.quality, item.rarity),
                                                            border: `2px solid ${getQualityColor(item.quality, item.rarity)}`,
                                                            boxShadow: `0 0 8px ${getQualityColor(item.quality, item.rarity)}80`,
                                                            backgroundColor: 'transparent', // Remove dark overlay
                                                            borderRadius: '4px'
                                                        }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleItemContextMenu(e, item.id);
                                                        }}
                                                        onClick={(e) => {
                                                            // Single click to select
                                                            setSelectedItemId(item.id);

                                                            // Double click to rotate
                                                            if (e.detail === 2) {
                                                                rotateItem(item.id);
                                                            }
                                                        }}
                                                    />
                                                );
                                            })
                                        )
                                    ) : (
                                        /* Rectangular shape - use traditional border */
                                        <div
                                            className={`item-border ${selectedItemId === item.id ? 'selected' : ''}`}
                                            style={{
                                                borderColor: getQualityColor(item.quality, item.rarity),
                                                boxShadow: `0 0 8px ${getQualityColor(item.quality, item.rarity)}80`
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleItemContextMenu(e, item.id);
                                            }}
                                            onClick={(e) => {
                                                // Single click to select
                                                setSelectedItemId(item.id);

                                                // Double click to rotate
                                                if (e.detail === 2) {
                                                    rotateItem(item.id);
                                                }
                                            }}
                                        />
                                    )}

                                    {/* Invisible overlay for context menu and interactions - covers entire item bounds */}
                                    <div
                                        className="item-interaction-overlay"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            zIndex: 5,
                                            backgroundColor: 'transparent',
                                            cursor: 'move'
                                        }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        onDragEnd={handleDragEnd}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleItemContextMenu(e, item.id);
                                        }}
                                        onMouseEnter={(e) => handleItemMouseEnter(e, item.id)}
                                        onMouseMove={(e) => handleItemMouseMove(e, item.id)}
                                        onMouseLeave={handleItemMouseLeave}
                                        onClick={(e) => {
                                            // Single click to select
                                            setSelectedItemId(item.id);

                                            // Double click to rotate
                                            if (e.detail === 2) {
                                                rotateItem(item.id);
                                            }
                                        }}
                                    />

                                    {/* Container for item - no visual rotation */}
                                    <div
                                        className={`inventory-item ${isMultiCell ? 'multi-cell' : ''}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none' // Let the overlay handle interactions
                                        }}
                                    >
                                    {/* Item content */}
                                    <div
                                        className="item-content"
                                        style={isSimpleRectangle ? {
                                            // Simple rectangle - use full bounds like normal
                                            width: '100%',
                                            height: '100%'
                                        } : {
                                            // Complex custom shape - position icon in a single cell
                                            position: 'absolute',
                                            left: `${(iconCellCol / bounds.width) * 100}%`,
                                            top: `${(iconCellRow / bounds.height) * 100}%`,
                                            width: `${(1 / bounds.width) * 100}%`,
                                            height: `${(1 / bounds.height) * 100}%`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {item.iconId ? (
                                            <img
                                                src={`${WOW_ICON_BASE_URL}${item.iconId}.jpg`}
                                                alt={item.name}
                                                className="item-icon"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
                                                }}
                                            />
                                        ) : (
                                            <span className="item-name" style={{ color: getQualityColor(item.quality, item.rarity) }}>{item.name}</span>
                                        )}
                                        {item.quantity > 1 && (
                                            <span className="item-quantity">{item.quantity}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                        })()}
                    </div>
                );
            }
            grid.push(
                <div key={row} className="inventory-row">
                    {gridRow}
                </div>
            );
        }

        return (
            <>
                {sectionHeaders}
                {grid}
            </>
        );
    };

    return (
        <div className="window-content inventory-window-content">
            <div className="inventory-container">


                <div className="inventory-grid">
                    {renderGrid()}
                </div>

                <div className="inventory-bottom-bar">
                    <div className="currency-display-simple">
                        <div
                            className="currency-coin clickable-coin"
                            onClick={() => setShowCurrencyWithdrawModal(true)}
                            title="Click to withdraw platinum"
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_04.jpg`}
                                alt="Platinum"
                                className="coin-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23e5e4e2"/></svg>';
                                }}
                            />
                            <span className="currency-number">{currency.platinum}</span>
                        </div>
                        <div
                            className="currency-coin clickable-coin"
                            onClick={() => setShowCurrencyWithdrawModal(true)}
                            title="Click to withdraw gold"
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_01.jpg`}
                                alt="Gold"
                                className="coin-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
                                }}
                            />
                            <span className="currency-number">{currency.gold}</span>
                        </div>
                        <div
                            className="currency-coin clickable-coin"
                            onClick={() => setShowCurrencyWithdrawModal(true)}
                            title="Click to withdraw silver"
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_03.jpg`}
                                alt="Silver"
                                className="coin-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
                                }}
                            />
                            <span className="currency-number">{currency.silver}</span>
                        </div>
                        <div
                            className="currency-coin clickable-coin"
                            onClick={() => setShowCurrencyWithdrawModal(true)}
                            title="Click to withdraw copper"
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_05.jpg`}
                                alt="Copper"
                                className="coin-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
                                }}
                            />
                            <span className="currency-number">{currency.copper}</span>
                        </div>
                    </div>

                    <div className={`encumbrance-text ${encumbranceState}`}>
                        {encumbranceState.charAt(0).toUpperCase() + encumbranceState.slice(1)}
                        {encumbranceState !== 'normal' && (
                            <span className="encumbrance-penalty-text">
                                {encumbranceState === 'encumbered' ? (
                                    ' - Speed -25%, Most Stats -5%, Strength & Constitution +5%'
                                ) : (
                                    ' - Speed -75%, Most Stats -15%, Strength & Constitution +15%, Disadvantage on Attacks & Saves'
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Context Menu - Render at document level for proper positioning */}
            {contextMenu.visible && ReactDOM.createPortal((() => {
                const item = items.find(i => i.id === contextMenu.itemId);
                const isContainer = item?.type === 'container';
                const isLocked = item?.containerProperties?.isLocked || false;

                if (!item) return null;

                const menuItems = [];

                // Rotate option
                menuItems.push({
                    icon: <i className="fas fa-redo"></i>,
                    label: 'Rotate',
                    onClick: () => {
                        rotateItem(contextMenu.itemId);
                        setContextMenu({ visible: false });
                    }
                });

                // Split Stack option
                if (item.quantity > 1) {
                    menuItems.push({
                        icon: <i className="fas fa-cut"></i>,
                        label: 'Split Stack',
                        onClick: () => {
                            splitStack(contextMenu.itemId, Math.ceil(item.quantity / 2));
                            setContextMenu({ visible: false });
                        }
                    });
                }

                                // Equip/Use option - show based on item type
                // Show "Use" for consumable items and recipe scrolls
                if (item?.type === 'consumable' || item?.subtype === 'recipe') {
                    const actionText = item?.subtype === 'recipe' ? 'Learn' : 'Use';
                    menuItems.push({
                        icon: <i className="fas fa-hand-paper"></i>,
                        label: actionText,
                        onClick: () => {
                            handleUseConsumable(item);
                            setContextMenu({ visible: false });
                        }
                    });
                }

                // Show "Equip" for equippable items
                const compatibleSlots = getCompatibleSlots(item);
                if (compatibleSlots.length > 0) {

                                    // Auto-equip logic for items with obvious slots
                    const shouldAutoEquip = () => {
                        // Items with only one compatible slot should auto-equip
                        if (compatibleSlots.length === 1) {
                            return compatibleSlots[0];
                        }

                        // Check if this item should show expanded context menu
                        // These items have multiple slots and user should choose:
                        // - One-handed weapons (mainHand/offHand)
                        // - Rings (ring1/ring2)
                        // - Trinkets (trinket1/trinket2)
                        const itemType = item.type?.toLowerCase();
                        const subtype = item.subtype?.toLowerCase();
                        const weaponSlot = item.weaponSlot?.toLowerCase();

                        // One-handed weapons that can go in either hand
                        if (itemType === 'weapon' &&
                            (weaponSlot === 'one_handed' || weaponSlot === 'onehanded' || weaponSlot === 'one-handed') &&
                            compatibleSlots.includes('mainHand') && compatibleSlots.includes('offHand')) {
                            return null; // Show expanded context menu
                        }

                        // Rings - always show expanded menu
                        if (itemType === 'accessory' && subtype?.includes('ring')) {
                            return null; // Show expanded context menu
                        }

                        // Trinkets - always show expanded menu
                        if (itemType === 'accessory' && (subtype?.includes('trinket') || subtype?.includes('charm'))) {
                            return null; // Show expanded context menu
                        }

                        // For all other multi-slot items, auto-equip to first available slot
                        // This handles cases like armor that might fit multiple slots but has a preferred slot
                        if (compatibleSlots.length > 1) {
                            return compatibleSlots[0];
                        }

                        return null; // Fallback - show context menu
                    };

                    const autoEquipSlot = shouldAutoEquip();

                    if (autoEquipSlot) {
                        // Auto-equip directly
                        menuItems.push({
                            icon: <i className="fas fa-shield-alt"></i>,
                            label: 'Equip',
                            onClick: () => {
                                handleEquipItem(autoEquipSlot, item);
                                setContextMenu({ visible: false });
                            }
                        });
                    } else {
                        // Show equipment context menu for multi-slot items
                        menuItems.push({
                            icon: <i className="fas fa-shield-alt"></i>,
                            label: 'Equip',
                            onClick: () => {
                                // Create a mock event object for handleEquipmentContextMenu
                                const mockEvent = {
                                    preventDefault: () => {},
                                    stopPropagation: () => {},
                                    clientX: contextMenu.x,
                                    clientY: contextMenu.y
                                };
                                handleEquipmentContextMenu(mockEvent, item);
                                setContextMenu({ visible: false });
                            }
                        });
                    }
                }



                                // Container options
                if (isContainer) {
                    const containerOpenHandler = () => {
                        if (!isLocked) {
                            // Force container type to be 'container' if it's not already
                            if (item.type !== 'container') {
                                item.type = 'container';

                                // Update the type in the inventory store
                                useInventoryStore.getState().updateItem(item.id, {
                                    type: 'container'
                                });
                            }

                            // Check if container properties exist
                            if (!item.containerProperties) {
                                // Initialize container properties if missing
                                item.containerProperties = {
                                    gridSize: { rows: 4, cols: 6 },
                                    items: [],
                                    isLocked: false,
                                    lockType: 'none',
                                    lockDC: 0,
                                    lockCode: '',
                                    flavorText: '',
                                    maxAttempts: 3,
                                    failureAction: 'none',
                                    failureActionDetails: {
                                        removeItems: false,
                                        removePercentage: 50,
                                        destroyContainer: false,
                                        triggerTrap: false,
                                        trapDetails: '',
                                        transformIntoCreature: false,
                                        creatureType: ''
                                    }
                                };

                                // Update the container properties in the inventory store
                                useInventoryStore.getState().updateItem(item.id, {
                                    type: 'container',
                                    containerProperties: item.containerProperties
                                });
                            }

                            // Update the item store's openContainers set for consistency
                            try {
                                const itemStoreOpenContainers = useItemStore.getState().openContainers;
                                const newItemStoreOpenContainers = new Set(
                                    itemStoreOpenContainers instanceof Set
                                        ? itemStoreOpenContainers
                                        : new Set(Array.isArray(itemStoreOpenContainers) ? itemStoreOpenContainers : [])
                                );

                                newItemStoreOpenContainers.add(item.id);
                                useItemStore.setState({ openContainers: newItemStoreOpenContainers });
                            } catch (error) {
                                // Silent error handling
                            }

                            // Toggle the container open state in the local state
                            toggleContainerOpen(item.id);
                        } else {
                            // Show unlock modal for locked containers
                            setContainerToUnlock(item);
                            setShowUnlockModal(true);
                        }
                        setContextMenu({ visible: false });
                    };

                    menuItems.push({
                        icon: isLocked ? <i className="fas fa-unlock"></i> : <i className="fas fa-box-open"></i>,
                        label: isLocked ? 'Unlock Container' : 'Open Container',
                        onClick: containerOpenHandler
                    });

                                    // Debug container option
                    menuItems.push({
                        icon: <i className="fas fa-bug"></i>,
                        label: 'DEBUG: Force Open Container',
                        onClick: () => {
                            // Debug function to manually create a container window
                            console.log('DEBUG: Manually creating container window for:', item.name, item.id);

                            // Force container type to be 'container'
                            item.type = 'container';

                            // Ensure container properties exist
                            if (!item.containerProperties) {
                                item.containerProperties = {
                                    gridSize: { rows: 4, cols: 6 },
                                    items: [],
                                    isLocked: false,
                                    lockType: 'none',
                                    lockDC: 0,
                                    lockCode: '',
                                    flavorText: '',
                                    maxAttempts: 3,
                                    failureAction: 'none',
                                    failureActionDetails: {
                                        removeItems: false,
                                        removePercentage: 50,
                                        destroyContainer: false,
                                        triggerTrap: false,
                                        trapDetails: '',
                                        transformIntoCreature: false,
                                        creatureType: ''
                                    }
                                };
                            }

                            // Update the container in the inventory store
                            useInventoryStore.getState().updateItem(item.id, {
                                type: 'container',
                                containerProperties: item.containerProperties
                            });

                            // Add to localOpenContainers
                            setLocalOpenContainers(prev => {
                                const newSet = new Set(prev);
                                newSet.add(item.id);
                                return newSet;
                            });

                            // Also update itemStore openContainers
                            const newItemStoreOpenContainers = new Set(
                                Array.from(useItemStore.getState().openContainers || [])
                            );
                            newItemStoreOpenContainers.add(item.id);
                            useItemStore.setState({ openContainers: newItemStoreOpenContainers });

                            setContextMenu({ visible: false });
                        },
                        className: 'debug'
                    });
                }

                // Delete option
                menuItems.push(
                    { type: 'separator' },
                    {
                        icon: <i className="fas fa-trash"></i>,
                        label: 'Delete',
                        onClick: () => {
                            removeItem(contextMenu.itemId);
                            setContextMenu({ visible: false });
                        },
                        className: 'danger'
                    }
                );

                return (
                    <UnifiedContextMenu
                        visible={true}
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu({ visible: false })}
                        items={menuItems}
                    />
                );
            })(),
                document.body
            )}

            {/* Equipment Context Menu - Render at document level for proper positioning */}
            {equipmentContextMenu.visible && ReactDOM.createPortal(
                <EquipmentContextMenu
                    x={equipmentContextMenu.x}
                    y={equipmentContextMenu.y}
                    item={equipmentContextMenu.item}
                    onClose={() => setEquipmentContextMenu({ visible: false })}
                    onEquip={handleEquipItem}
                />,
                document.body
            )}

            {/* Item Tooltip - Using TooltipPortal for consistent positioning */}
            {showItemTooltip.visible && (
                <TooltipPortal>
                    <div
                        style={{
                            position: 'fixed',
                            left: showItemTooltip.x,
                            top: showItemTooltip.y,
                            transform: 'translate(10px, -50%)',
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        {(() => {
                            const item = items.find(i => i.id === showItemTooltip.itemId);
                            if (!item) return null;

                            // Use the ItemTooltip component for consistent display
                            return <ItemTooltip item={item} />;
                        })()}
                    </div>
                </TooltipPortal>
            )}

            {/* Unlock Container Modal */}
            {showUnlockModal && containerToUnlock && (
                <UnlockContainerModal
                    container={containerToUnlock}
                    onSuccess={() => {
                        // On successful unlock, open the container
                        toggleContainerOpen(containerToUnlock.id);
                        setShowUnlockModal(false);
                        setContainerToUnlock(null);
                    }}
                    onClose={() => {
                        setShowUnlockModal(false);
                        setContainerToUnlock(null);
                    }}
                />
            )}

            {/* Container Windows - Each ContainerWindow component uses its own React Portal */}
            {Array.from(localOpenContainers).map(containerId => {
                // First try to find the container in the inventory items
                let container = items.find(item => item.id === containerId);

                // If not found in inventory, try to find it in the item store
                if (!container) {
                    container = itemStoreItems.find(item => item.id === containerId);
                }

                if (!container) {
                    // Remove this container ID from the open containers set
                    setLocalOpenContainers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(containerId);
                        return newSet;
                    });
                    return null;
                }

                // Force container type to be 'container' if it's not already
                if (container.type !== 'container') {
                    container.type = 'container';
                }

                // Check if container properties exist
                if (!container.containerProperties) {
                    // Initialize container properties if missing
                    container.containerProperties = {
                        gridSize: { rows: 4, cols: 6 },
                        items: [],
                        isLocked: false,
                        lockType: 'none',
                        lockDC: 0,
                        lockCode: '',
                        flavorText: '',
                        maxAttempts: 3,
                        failureAction: 'none',
                        failureActionDetails: {
                            removeItems: false,
                            removePercentage: 50,
                            destroyContainer: false,
                            triggerTrap: false,
                            trapDetails: '',
                            transformIntoCreature: false,
                            creatureType: ''
                        }
                    };
                }

                // Return the ContainerWindow component
                console.log('Rendering ContainerWindow for container:', container.name, container.id);
                return (
                    <ContainerWindow
                        key={containerId}
                        container={container}
                        onClose={() => toggleContainerOpen(containerId)}
                    />
                );
            })}

            {/* Currency Withdraw Modal */}
            {showCurrencyWithdrawModal && (
                <UnifiedCurrencyWithdrawModal
                    onClose={() => setShowCurrencyWithdrawModal(false)}
                />
            )}


        </div>
    );
}
