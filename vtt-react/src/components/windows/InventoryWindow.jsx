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
                strModifier: Math.floor((stats.strength - 10) / 2),
                gridDimensions,
                actualGridSize: `${gridDimensions.HEIGHT}x${gridDimensions.WIDTH}`,
                expectedForStrength: `Should be ${5 + Math.max(0, Math.floor((stats.strength - 10) / 2))}x15`
            });
            return gridDimensions;
        }
        // Using default grid size - no carrying capacity found (log removed for performance)
        return DEFAULT_GRID_SIZE;
    }, [derivedStats?.carryingCapacity, stats.strength]);

    // Force re-render when stats change
    useEffect(() => {
        // Character stats changed, updating inventory grid (log removed for performance)
        setRefreshKey(prev => prev + 1);
    }, [stats.strength, derivedStats?.carryingCapacity]);

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
            copper: { silver: 0.01, gold: 0.0001 },
            silver: { copper: 100, gold: 0.01 },
            gold: { copper: 10000, silver: 100 }
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



    // Helper functions for inventory management
    const isValidPosition = (items, row, col, width, height, rotation, itemId = null) => {
        // Calculate effective dimensions based on rotation
        const effectiveWidth = rotation === 1 ? height : width;
        const effectiveHeight = rotation === 1 ? width : height;

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

    // Helper function to get all cells that would be occupied by an item
    const getOccupiedCells = (row, col, width, height, rotation) => {
        const cells = [];

        // Calculate effective dimensions based on rotation
        const effectiveWidth = rotation === 1 ? height : width;
        const effectiveHeight = rotation === 1 ? width : height;

        for (let r = 0; r < effectiveHeight; r++) {
            for (let c = 0; c < effectiveWidth; c++) {
                cells.push(`${row + r}-${col + c}`);
            }
        }

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
            width,
            height,
            rotation
        );

        // Get all cells that would be occupied
        const occupiedCells = getOccupiedCells(row, col, width, height, rotation);

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
                    // Get item dimensions
                    const width = item.width || 1;
                    const height = item.height || 1;
                    const rotation = item.rotation || 0;

                    // Check if the position is valid
                    const isValid = isValidPosition(
                        items.filter(i => i.id !== id),
                        row,
                        col,
                        width,
                        height,
                        rotation
                    );

                    if (isValid) {
                        useInventoryStore.getState().moveItem(id, { row, col });
                    }
                }
            } else if (data.type === 'container-item') {
                // Handle items dragged from containers
                const { item, containerId } = data;

                if (item) {
                    // Get item dimensions
                    const width = item.width || 1;
                    const height = item.height || 1;
                    const rotation = item.rotation || 0;

                    // Check if the position is valid
                    const isValid = isValidPosition(
                        items,
                        row,
                        col,
                        width,
                        height,
                        rotation
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

                // Find an item that occupies this cell
                const item = items.find(item => {
                    // Calculate effective dimensions based on rotation
                    const effectiveWidth = item.rotation === 1 ?
                        (item.height || 1) : (item.width || 1);
                    const effectiveHeight = item.rotation === 1 ?
                        (item.width || 1) : (item.height || 1);

                    // Check if this cell is within the bounds of the item
                    return row >= item.position.row &&
                           row < item.position.row + effectiveHeight &&
                           col >= item.position.col &&
                           col < item.position.col + effectiveWidth;
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

                        {item && isItemOrigin && (
                            <div className="item-wrapper" style={{
                                width: `${item.rotation === 1 ? item.height * 100 : item.width * 100}%`,
                                height: `${item.rotation === 1 ? item.width * 100 : item.height * 100}%`,
                                boxShadow: `0 0 8px ${getQualityColor(item.quality, item.rarity)}80`,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                overflow: 'visible'
                            }}>
                                {/* Non-rotating border with quality color */}
                                <div
                                    className={`item-border ${selectedItemId === item.id ? 'selected' : ''}`}
                                    style={{
                                        borderColor: getQualityColor(item.quality, item.rarity)
                                    }}
                                />

                                {/* Blue indicator removed - rotation functionality preserved */}

                                {/* Container for item - no visual rotation */}
                                <div
                                    className={`inventory-item ${item.width > 1 || item.height > 1 ? 'multi-cell' : ''}`}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    onDragEnd={handleDragEnd}
                                >
                                    {/* Item content */}
                                    <div
                                        className="item-content"
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        onContextMenu={(e) => handleItemContextMenu(e, item.id)}
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
                        )}
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
            {contextMenu.visible && ReactDOM.createPortal(
                <div
                    ref={contextMenuRef}
                    className="item-context-menu"
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 10000 /* Increased z-index to match tooltip */
                    }}
                >
                    <ul>
                        {(() => {
                            const item = items.find(i => i.id === contextMenu.itemId);
                            const isContainer = item?.type === 'container';
                            const isLocked = item?.containerProperties?.isLocked || false;

                            return (
                                <>
                                    <li onClick={() => {
                                        rotateItem(contextMenu.itemId);
                                        setContextMenu({ visible: false });
                                    }}>Rotate</li>

                                    {item && item.quantity > 1 && (
                                        <li onClick={() => {
                                            splitStack(contextMenu.itemId, Math.ceil(item.quantity / 2));
                                            setContextMenu({ visible: false });
                                        }}>Split Stack</li>
                                    )}

                                    {/* Equip/Use option - show based on item type */}
                                    {(() => {
                                        const item = items.find(i => i.id === contextMenu.itemId);

                                        // Show "Use" for consumable items and recipe scrolls
                                        if (item?.type === 'consumable' || item?.subtype === 'recipe') {
                                            const actionText = item?.subtype === 'recipe' ? 'Learn' : 'Use';
                                            return (
                                                <li onClick={() => {
                                                    handleUseConsumable(item);
                                                    setContextMenu({ visible: false });
                                                }}>{actionText}</li>
                                            );
                                        }

                                        // Show "Equip" for equippable items
                                        const compatibleSlots = getCompatibleSlots(item);
                                        if (compatibleSlots.length === 0) {
                                            return null; // Not equippable or consumable
                                        }

                                        // Auto-equip logic for items with obvious slots
                                        const shouldAutoEquip = () => {
                                            // Two-handed weapons always go to main hand
                                            const weaponSlot = item.weaponSlot?.toLowerCase();
                                            if (weaponSlot === 'two_handed' || weaponSlot === 'twohanded' || weaponSlot === 'two-handed') {
                                                return 'mainHand';
                                            }

                                            // Items with only one compatible slot
                                            if (compatibleSlots.length === 1) {
                                                return compatibleSlots[0];
                                            }

                                            // Items that should auto-equip to specific slots
                                            const itemType = item.type?.toLowerCase();
                                            const subtype = item.subtype?.toLowerCase();

                                            // Armor pieces with obvious slots
                                            if (itemType === 'armor') {
                                                if (subtype?.includes('helmet') || subtype?.includes('head')) return 'head';
                                                if (subtype?.includes('chest') || subtype?.includes('breastplate') || subtype?.includes('robe')) return 'chest';
                                                if (subtype?.includes('leg') || subtype?.includes('pants')) return 'legs';
                                                if (subtype?.includes('boot') || subtype?.includes('feet')) return 'feet';
                                                if (subtype?.includes('glove') || subtype?.includes('gauntlet')) return 'gloves';
                                                if (subtype?.includes('belt') || subtype?.includes('waist')) return 'waist';
                                                if (subtype?.includes('shoulder') || subtype?.includes('pauldron')) return 'shoulders';
                                                if (subtype?.includes('cloak') || subtype?.includes('cape') || subtype?.includes('back')) return 'back';
                                                if (subtype?.includes('bracer') || subtype?.includes('wrist')) return 'wrists';
                                                if (subtype?.includes('neck') || subtype?.includes('necklace') || subtype?.includes('amulet')) return 'neck';
                                            }

                                            // Accessories with obvious slots
                                            if (itemType === 'accessory') {
                                                if (subtype?.includes('neck') || subtype?.includes('necklace') || subtype?.includes('amulet')) return 'neck';
                                            }

                                            // Clothing
                                            if (itemType === 'clothing') {
                                                if (subtype?.includes('shirt')) return 'shirt';
                                                if (subtype?.includes('tabard')) return 'tabard';
                                            }

                                            // Ranged weapons
                                            if (item.weaponSlot?.toLowerCase() === 'ranged') {
                                                return 'ranged';
                                            }

                                            return null; // Show context menu for multi-slot items
                                        };

                                        const autoEquipSlot = shouldAutoEquip();

                                        if (autoEquipSlot) {
                                            // Auto-equip directly
                                            return (
                                                <li onClick={() => {
                                                    handleEquipItem(autoEquipSlot, item);
                                                    setContextMenu({ visible: false });
                                                }}>Equip</li>
                                            );
                                        } else {
                                            // Show equipment context menu for multi-slot items
                                            return (
                                                <li onClick={(e) => {
                                                    handleEquipmentContextMenu(e, item);
                                                    setContextMenu({ visible: false });
                                                }}>Equip</li>
                                            );
                                        }
                                    })()}



                                    {isContainer && (
                                        <>
                                            <li onClick={() => {
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
                                            }}>{isLocked ? 'Unlock Container' : 'Open Container'}</li>

                                            <li style={{ color: 'orange' }} onClick={() => {
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
                                            }}>DEBUG: Force Open Container</li>
                                        </>
                                    )}

                                    <li onClick={() => {
                                        removeItem(contextMenu.itemId);
                                        setContextMenu({ visible: false });
                                    }}>Delete</li>
                                </>
                            );
                        })()}
                    </ul>
                </div>,
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
