import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import ReactDOM from 'react-dom';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useCharacterStore from '../../store/characterStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useCraftingStore from '../../store/craftingStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
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
import Button from '../common/Button';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import { getIconUrl } from '../../utils/assetManager';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import {
    collectBuffEffects,
    collectDebuffEffects,
    extractConsumableDuration,
    syncResourceToAll
} from '../../utils/consumableUtils';
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

// Helper function to get quality color - WoW-style colors
const getQualityColor = (quality, rarity) => {
    // Check for both quality and rarity properties
    const itemQuality = quality || rarity || 'common';
    const qualityLower = itemQuality.toLowerCase();
    
    // WoW-style quality border colors
    const qualityBorderColors = {
        poor: '#9d9d9d',
        common: '#ffffff',
        uncommon: '#4a934a',
        rare: '#0070dd',
        epic: '#a335ee',
        legendary: '#ff8000',
        artifact: '#e6cc80'
    };
    return qualityBorderColors[qualityLower] || qualityBorderColors.common;
};

// Helper function to get display name (custom name or original name)
const getDisplayName = (item) => {
    return item.customName || item.name;
};

const InventoryWindow = memo(() => {
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
                setRefreshKey(prev => prev + 1);
            }
        );

        // Listen for custom inventory-updated events
        const handleInventoryUpdated = (event) => {
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
    const { equipItem, updateResource, health, mana, actionPoints, tempHealth, tempMana, tempActionPoints, updateTempResource } = useCharacterStore(state => ({
        equipItem: state.equipItem,
        updateResource: state.updateResource,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        tempHealth: state.tempHealth || 0,
        tempMana: state.tempMana || 0,
        tempActionPoints: state.tempActionPoints || 0,
        updateTempResource: state.updateTempResource
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
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [itemToRename, setItemToRename] = useState(null);
    const [showSplitStackModal, setShowSplitStackModal] = useState(false);
    const [itemToSplit, setItemToSplit] = useState(null);
    
    // Overheal modal state
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, amount, currentValue, maxValue, item }
    
    // Mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Refs

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
        // Container state changed - no debug logging needed
    }, [localOpenContainers]);


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
            }
        } catch (error) {
            console.error('Error equipping item:', error);
        }
    };

    // Handle renaming an item
    const handleRenameItem = () => {
        const input = document.getElementById('rename-input');
        if (!input || !itemToRename) return;

        const newName = input.value.trim();
        if (!newName) return; // Don't allow empty names

        // Update the item in the inventory store
        useInventoryStore.getState().updateItem(itemToRename.id, {
            customName: newName
        });

        // Close the modal
        setShowRenameModal(false);
        setItemToRename(null);
    };

    // Handle splitting a stack
    const handleSplitStack = () => {
        const input = document.getElementById('split-quantity-input');
        if (!input || !itemToSplit) return;

        const quantity = parseInt(input.value, 10);
        if (isNaN(quantity) || quantity <= 0 || quantity >= itemToSplit.quantity) {
            return; // Invalid quantity
        }

        // Split the stack
        splitStack(itemToSplit.id, quantity);

        // Close the modal
        setShowSplitStackModal(false);
        setItemToSplit(null);
    };

    // Apply resource adjustment with overheal detection
    const applyResourceAdjustmentWithOverheal = useCallback((resourceType, amount, item) => {
        // Get FRESH values from store to avoid stale closure issues
        const charState = useCharacterStore.getState();
        const resourceMap = {
            'health': charState.health,
            'mana': charState.mana,
            'actionPoints': charState.actionPoints
        };
        
        const currentResource = resourceMap[resourceType];
        if (!currentResource) {
            console.warn(`[Consumable] No resource found for type: ${resourceType}`);
            return false;
        }
        
        const currentValue = currentResource.current || 0;
        const maxValue = currentResource.max || 0;
        const newValue = currentValue + amount;
        
        console.log(`[Consumable] ${resourceType}: current=${currentValue}, max=${maxValue}, restore=${amount}, new=${newValue}`);
        
        // Check for overheal (positive adjustment that would exceed max)
        if (amount > 0 && newValue > maxValue && maxValue > 0) {
            const overhealAmount = newValue - maxValue;
            console.log(`[Consumable] Overheal detected: ${overhealAmount} excess`);
            setOverhealData({
                resourceType,
                amount,
                overhealAmount,
                currentValue,
                maxValue,
                item
            });
            setShowOverhealModal(true);
            return false; // Don't apply yet, wait for user confirmation
        }
        
        // Normal application (no overheal or negative adjustment)
        const finalValue = Math.max(0, Math.min(maxValue, newValue));
        console.log(`[Consumable] Applying: ${resourceType} = ${finalValue}`);
        useCharacterStore.getState().updateResource(resourceType, finalValue, maxValue);
        
        // Sync to all relevant stores
        syncResourceToAll({
            resourceType,
            characterStore: useCharacterStore,
            partyStore: usePartyStore,
            gameStore: useGameStore
        });
        
        return true;
    }, []);

    // Apply remaining consumable effects (after overheal is handled)
    // MUST be defined before applyResourceWithTemporary to avoid circular dependency
    const applyRemainingConsumableEffects = useCallback((item, skipResourceType = null) => {
        if (!item) {
            console.warn('[Consumable] No item provided to applyRemainingConsumableEffects');
            return;
        }
        
        console.log('[Consumable] Applying remaining effects for:', item.name);
        console.log('[Consumable] Item combatStats:', item.combatStats);
        console.log('[Consumable] Item baseStats:', item.baseStats);
        console.log('[Consumable] Item utilityStats:', item.utilityStats);
        
        const { effects: buffEffects, hasBuffs } = collectBuffEffects(item);
        const { effects: debuffEffects, hasDebuffs } = collectDebuffEffects(item);
        const duration = extractConsumableDuration(item);
        
        console.log('[Consumable] Buff effects:', buffEffects, 'hasBuffs:', hasBuffs);
        console.log('[Consumable] Debuff effects:', debuffEffects, 'hasDebuffs:', hasDebuffs);
        console.log('[Consumable] Duration:', duration);

        const charState = useCharacterStore.getState();
        const gameStore = useGameStore.getState();
        const targetId = gameStore.currentPlayer?.id || charState.currentCharacterId || charState.id || 'player';

        if (hasBuffs) {
            console.log('[Consumable] Adding buff to store...');
            addBuff({
                name: item.name,
                icon: getIconUrl(item.iconId, 'items'),
                description: item.description || `Temporary enhancement from ${item.name}`,
                effects: buffEffects,
                duration: duration,
                source: 'consumable',
                stackable: false,
                targetId: targetId,
                targetType: 'character'
            });
            console.log('[Consumable] Buff added successfully');
        }

        if (hasDebuffs) {
            console.log('[Consumable] Adding debuff to store...');
            addDebuff({
                name: item.name,
                icon: getIconUrl(item.iconId, 'items'),
                description: item.description || `Temporary negative effect from ${item.name}`,
                effects: debuffEffects,
                duration: duration,
                source: 'consumable',
                stackable: false,
                targetId: targetId,
                targetType: 'character'
            });
            console.log('[Consumable] Debuff added successfully');
        }
        
        // Sync to multiplayer if connected
        try {
            const gameStore = useGameStore.getState();
            const characterState = useCharacterStore.getState();
            
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                const socketId = gameStore.multiplayerSocket.id;
                const roomId = gameStore.multiplayerRoom?.id;
                const characterId = characterState.currentCharacterId || characterState.id;
                
                if (roomId && characterId) {
                    gameStore.multiplayerSocket.emit('character_updated', {
                        roomId: roomId,
                        characterId,
                        character: {
                            playerId: socketId,
                            name: characterState.name,
                            health: characterState.health,
                            mana: characterState.mana,
                            actionPoints: characterState.actionPoints,
                            tempHealth: characterState.tempHealth || 0,
                            tempMana: characterState.tempMana || 0,
                            tempActionPoints: characterState.tempActionPoints || 0
                        },
                        senderSocketId: socketId,
                        syncSource: 'consumable'
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to sync consumable usage to multiplayer:', e);
        }
    }, [addBuff, addDebuff]);

    // Apply resource adjustment with temporary resource support
    const applyResourceWithTemporary = useCallback((asTemporary) => {
        if (!overhealData) return;
        
        const { resourceType, amount, currentValue, maxValue, item } = overhealData;
        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        
        // Get FRESH values from store to avoid stale closure issues
        const charState = useCharacterStore.getState();
        const tempField = tempFieldMap[resourceType];
        const currentTemp = charState[tempField] || 0;
        
        console.log(`[Consumable] Processing overheal decision: ${asTemporary ? 'temporary' : 'cap'} for ${resourceType}`);
        
        if (asTemporary) {
            // Add as temporary resource
            const overhealAmount = (currentValue + amount) - maxValue;
            console.log(`[Consumable] Adding ${overhealAmount} as temporary ${resourceType}`);
            
            // Set resource to max
            useCharacterStore.getState().updateResource(resourceType, maxValue, maxValue, undefined, true);
            
            // Update temporary resource
            useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
        } else {
            // Just cap at max, don't add temporary
            console.log(`[Consumable] Capping ${resourceType} at max: ${maxValue}`);
            useCharacterStore.getState().updateResource(resourceType, maxValue, maxValue);
        }
        
        // Sync to all relevant stores
        syncResourceToAll({
            resourceType,
            characterStore: useCharacterStore,
            partyStore: usePartyStore,
            gameStore: useGameStore
        });
        
        // Continue with the rest of consumable effects
        if (item) {
            applyRemainingConsumableEffects(item, resourceType);
        }
        
        // Remove the item from inventory after decision is made
        if (item) {
            removeItem(item.id, 1);
        }
        
        setShowOverhealModal(false);
        setOverhealData(null);
    }, [overhealData, applyRemainingConsumableEffects, removeItem]);

    // Handle using a consumable item
    const handleUseConsumable = useCallback((item) => {
        if (!item) return;

        try {
            // Handle recipe scrolls
            if (item.type === 'recipe' && item.recipeId) {
                // Learn the recipe
                if (typeof learnRecipe === 'function') {
                    learnRecipe(item.requiredProfession || 'alchemy', item.recipeId);
                } else {
                    // Fallback: directly update the store
                    const store = useCraftingStore.getState();
                    const professionId = item.requiredProfession || 'alchemy';
                    const currentRecipes = store.knownRecipes?.[professionId] || [];
                    if (!currentRecipes.includes(item.recipeId)) {
                        useCraftingStore.setState(state => ({
                            knownRecipes: {
                                ...state.knownRecipes,
                                [professionId]: [...currentRecipes, item.recipeId]
                            }
                        }));
                    }
                }

                // Remove the recipe scroll from inventory
                removeItem(item.id, 1);

                return;
            }

            // Handle regular consumables
            if (item.type !== 'consumable') return;

            // Apply consumable effects with overheal detection
            const combatStats = item.combatStats || {};
            let hasInstantEffects = false;
            let pendingOverheal = false;

            // Apply instant healing effects with overheal detection
            if (combatStats.healthRestore) {
                const healAmount = combatStats.healthRestore.value || 0;
                if (healAmount > 0) {
                    const applied = applyResourceAdjustmentWithOverheal('health', healAmount, item);
                    if (applied) {
                        hasInstantEffects = true;
                    } else {
                        pendingOverheal = true;
                    }
                } else if (healAmount < 0) {
                    hasInstantEffects = true;
                    applyResourceAdjustmentWithOverheal('health', healAmount, item);
                }
            }

            // Apply instant mana restoration with overheal detection
            if (combatStats.manaRestore) {
                const manaAmount = combatStats.manaRestore.value || 0;
                if (manaAmount > 0) {
                    const applied = applyResourceAdjustmentWithOverheal('mana', manaAmount, item);
                    if (applied) {
                        hasInstantEffects = true;
                    } else {
                        pendingOverheal = true;
                    }
                } else if (manaAmount < 0) {
                    hasInstantEffects = true;
                    applyResourceAdjustmentWithOverheal('mana', manaAmount, item);
                }
            }

            // Apply action point restoration with overheal detection (if supported)
            if (combatStats.actionPointRestore || combatStats.apRestore) {
                const apAmount = (combatStats.actionPointRestore?.value || combatStats.apRestore?.value || 0);
                if (apAmount > 0) {
                    const applied = applyResourceAdjustmentWithOverheal('actionPoints', apAmount, item);
                    if (applied) {
                        hasInstantEffects = true;
                    } else {
                        pendingOverheal = true;
                    }
                } else if (apAmount < 0) {
                    hasInstantEffects = true;
                    applyResourceAdjustmentWithOverheal('actionPoints', apAmount, item);
                }
            }

            // If there's a pending overheal, don't apply buffs yet (they'll be applied after modal)
            if (pendingOverheal) {
                return; // Don't remove item yet, wait for user decision
            }

            // Apply remaining consumable effects (buffs/debuffs)
            applyRemainingConsumableEffects(item);

            // Remove the item from inventory
            removeItem(item.id, 1);

        } catch (error) {
            console.error('Error using consumable:', error);
        }
    }, [applyResourceAdjustmentWithOverheal, applyRemainingConsumableEffects, removeItem]);













    // Function to toggle container open state
    const toggleContainerOpen = (containerId) => {

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
            setLocalOpenContainers(prev => {
                const newOpenContainers = new Set(prev);
                newOpenContainers.delete(containerId);
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
            } catch (error) {
                console.error('Error updating itemStore openContainers:', error);
            }
        } else {
            // First update the container properties if needed
            if (container) {
                useInventoryStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: containerToUse.containerProperties
                });
            } else if (storeContainer) {
                useItemStore.getState().updateItem(containerId, {
                    type: 'container',
                    containerProperties: containerToUse.containerProperties
                });
            }

            // Then open the container
            setLocalOpenContainers(prev => {
                const newOpenContainers = new Set(prev);
                newOpenContainers.add(containerId);
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
                const collision = otherOccupiedCells.some(otherCell => {
                    const otherCellRow = item.position.row + otherCell.row;
                    const otherCellCol = item.position.col + otherCell.col;
                    return cellRow === otherCellRow && cellCol === otherCellCol;
                });

                if (collision) {
                    // Collision detected
                }

                return collision;
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

    // Helper function to find which item occupies a specific cell (shape-aware)
    const findItemAtCell = (items, row, col, excludeItemId = null) => {
        return items.find(item => {
            // Skip excluded item
            if (excludeItemId && item.id === excludeItemId) {
                return false;
            }

            // Skip items without position
            if (!item.position) {
                return false;
            }

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

        // Set a global flag for Grid.jsx to detect item drags
        // This is needed because event bubbling might be blocked by window components
        window.isDraggingItem = true;

        // Store dragged item info globally for visual feedback in containers
        window.draggedItemInfo = {
            item: item,
            width: item.width || 1,
            height: item.height || 1,
            rotation: item.rotation || 0
        };

        // Create a custom drag image that shows the actual ItemCard (orb)
        if (e.dataTransfer.setDragImage) {
            try {
                // Get the quality colors
                const qualityLower = (item.quality || item.rarity || 'common').toLowerCase();
                const borderColor = RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
                const textColor = RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;

                // Create a temporary div that mimics the ItemCard appearance
                const dragImage = document.createElement('div');
                dragImage.style.cssText = `
                    position: absolute;
                    top: -1000px;
                    left: -1000px;
                    width: 60px;
                    height: 80px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border: 2px solid ${borderColor};
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    font-family: 'Bookman Old Style', 'Garamond', serif;
                    z-index: -1;
                `;

                // Add the icon
                const iconDiv = document.createElement('div');
                iconDiv.style.cssText = `
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 5px;
                    border: 1px solid #d5cbb0;
                    background-color: #fff;
                `;

                const iconImg = document.createElement('img');
                iconImg.src = item.iconId ? getIconUrl(item.iconId, 'items') : getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                iconImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                iconImg.onerror = () => {
                    iconImg.src = getIconUrl('inv_misc_questionmark', 'items');
                };

                iconDiv.appendChild(iconImg);
                dragImage.appendChild(iconDiv);

                // Add the item name
                const nameDiv = document.createElement('div');
                nameDiv.style.cssText = `
                    font-size: 10px;
                    text-align: center;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: ${textColor};
                    font-family: 'Bookman Old Style', 'Garamond', serif;
                `;
                nameDiv.textContent = getDisplayName(item);
                dragImage.appendChild(nameDiv);

                // Add to DOM temporarily
                document.body.appendChild(dragImage);

                // Use as drag image (centered)
                e.dataTransfer.setDragImage(dragImage, 30, 40);

                // Clean up after drag starts (slight delay to ensure it's used)
                setTimeout(() => {
                    if (document.body.contains(dragImage)) {
                        document.body.removeChild(dragImage);
                    }
                }, 0);
            } catch (imgError) {
                console.warn('Failed to set custom drag image:', imgError);
            }
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

        // Clear global drag flags
        window.isDraggingItem = false;
        window.draggedItemInfo = null;
        
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
                    // Find which item (if any) occupies the target cell (shape-aware)
                    const targetItem = findItemAtCell(items, row, col, id);

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
                        // If not stackable, don't allow placement on top of another item
                        return;
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
                    // Find which item (if any) occupies the target cell (shape-aware)
                    const targetItem = findItemAtCell(items, row, col);

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
                    // Find which item (if any) occupies the target cell (shape-aware)
                    const targetItem = findItemAtCell(items, row, col);

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

                // Find item whose bounding box origin is at this cell (for rendering the full item)
                const itemAtOrigin = items.find(i => i.position && i.position.row === row && i.position.col === col);
                const isItemOrigin = !!itemAtOrigin;

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

                        {isItemOrigin && itemAtOrigin && (() => {
                            const renderitem = itemAtOrigin;
                            let shape = renderitem.shape;
                            if (!shape) {
                                const width = renderitem.width || 1;
                                const height = renderitem.height || 1;
                                shape = createRectangularShape(width, height);
                            }

                            if (renderitem.rotation === 1) {
                                shape = rotateShape(shape);
                            }

                            const bounds = getShapeBounds(shape);
                            const isMultiCell = bounds.width > 1 || bounds.height > 1;

                            const qualityColor = getQualityColor(renderitem.quality, renderitem.rarity);
                            const qualityLower = (renderitem.quality || renderitem.rarity || 'common').toLowerCase();

                            let isComplexCustom = false;
                            const occupiedCellsList = getOccupiedCells(shape);
                            if (shape.type === 'custom') {
                                const total = bounds.width * bounds.height;
                                let occupied = 0;
                                shape.cells.forEach(row => row.forEach(cell => { if (cell) occupied++; }));
                                isComplexCustom = occupied < total;
                            }
                            
                            // Heuristic for icon placement on custom shapes (closest to shape centroid)
                            let bestCellForIcon = { row: 0, col: 0 };
                            if (isComplexCustom && shape.cells && occupiedCellsList.length > 0) {
                                const avgR = occupiedCellsList.reduce((sum, c) => sum + c.row, 0) / occupiedCellsList.length;
                                const avgC = occupiedCellsList.reduce((sum, c) => sum + c.col, 0) / occupiedCellsList.length;
                                let minD = Infinity;
                                occupiedCellsList.forEach(c => {
                                    const d = Math.pow(c.row - avgR, 2) + Math.pow(c.col - avgC, 2);
                                    if (d < minD) { minD = d; bestCellForIcon = c; }
                                });
                            }

                            const hasNeighbor = (r, c) => {
                                if (r < 0 || r >= shape.cells.length || c < 0 || c >= shape.cells[0].length) return false;
                                return shape.cells[r][c];
                            };

                             const rarityCfg = RARITY_COLORS[qualityLower] || RARITY_COLORS.common;
                             const strokeColor = '#333'; // Dark border like standard item-border
                             const glowColor = qualityColor;
                             const itemTop = 1;
                             const itemLeft = 1;

                             return (
                                <div className={`item-wrapper ${selectedItemId === renderitem.id ? 'selected' : ''} ${isComplexCustom ? 'complex-shape' : ''}`} style={{
                                    width: bounds.width > 1 ? `calc(${bounds.width * 100}% + ${(bounds.width - 1) * 1}px - 2px)` : `calc(${bounds.width * 100}% - 2px)`,
                                    height: bounds.height > 1 ? `calc(${bounds.height * 100}% + ${(bounds.height - 1) * 1}px - 2px)` : `calc(${bounds.height * 100}% - 2px)`,
                                    position: 'absolute',
                                    top: `${itemTop}px`,
                                    left: `${itemLeft}px`,
                                    overflow: 'visible',
                                    pointerEvents: 'none',
                                    filter: isComplexCustom ? 
                                        `drop-shadow(1px 0 0 ${strokeColor}) drop-shadow(-1px 0 0 ${strokeColor}) drop-shadow(0 1px 0 ${strokeColor}) drop-shadow(0 -1px 0 ${strokeColor})${selectedItemId === renderitem.id ? ' drop-shadow(0 0 6px cyan) drop-shadow(0 0 10px cyan)' : ' drop-shadow(0 0 4px ' + glowColor + '70)'}` : 
                                        'none',
                                    zIndex: isMultiCell ? 20 : 10
                                }}>
                                    {/* Render custom shape cells with outline-only borders on exposed edges */}
                                    {isComplexCustom ? (
                                        shape.cells.map((shapeRow, shapeRowIndex) =>
                                            shapeRow.map((isOccupied, shapeColIndex) => {
                                                if (!isOccupied) return null;

                                                const noTop = !hasNeighbor(shapeRowIndex - 1, shapeColIndex);
                                                const noBottom = !hasNeighbor(shapeRowIndex + 1, shapeColIndex);
                                                const noLeft = !hasNeighbor(shapeRowIndex, shapeColIndex - 1);
                                                const noRight = !hasNeighbor(shapeRowIndex, shapeColIndex + 1);

                                                return (
                                                    <div
                                                        key={`${shapeRowIndex}-${shapeColIndex}`}
                                                        className={`item-shape-cell ${selectedItemId === renderitem.id ? 'selected' : ''}`}
                                                        data-quality={qualityLower}
                                                        style={{
                                                            left: `${(shapeColIndex / bounds.width) * 100}%`,
                                                            top: `${(shapeRowIndex / bounds.height) * 100}%`,
                                                            width: `${(1 / bounds.width) * 100}%`,
                                                            height: `${(1 / bounds.height) * 100}%`,
                                                            borderTop: noTop ? 'none' : '1px solid rgba(0, 0, 0, 0.25)',
                                                            borderBottom: noBottom ? 'none' : '1px solid rgba(0, 0, 0, 0.25)',
                                                            borderLeft: noLeft ? 'none' : '1px solid rgba(0, 0, 0, 0.25)',
                                                            borderRight: noRight ? 'none' : '1px solid rgba(0, 0, 0, 0.25)',
                                                            outline: noTop || noBottom || noLeft || noRight ? `1px solid ${strokeColor}40` : 'none',
                                                            background: rarityCfg.orbColor,
                                                            backgroundSize: `${bounds.width * 100}% ${bounds.height * 100}%`,
                                                            backgroundPosition: `${-shapeColIndex * 100}% ${-shapeRowIndex * 100}%`,
                                                            backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, ${rarityCfg.glow.replace('0.3', '0.6')} 100%)`,
                                                            boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.2)',
                                                            borderRadius: (noTop && noLeft) || (noTop && noRight) || (noBottom && noLeft) || (noBottom && noRight) ? '3px' : '0',
                                                            cursor: 'move',
                                                            pointerEvents: 'auto'
                                                        }}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, renderitem)}
                                                        onDragEnd={handleDragEnd}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleItemContextMenu(e, renderitem.id);
                                                        }}
                                                        onMouseEnter={(e) => handleItemMouseEnter(e, renderitem.id)}
                                                        onMouseMove={(e) => handleItemMouseMove(e, renderitem.id)}
                                                        onMouseLeave={handleItemMouseLeave}
                                                        onClick={(e) => {
                                                            setSelectedItemId(renderitem.id);
                                                            if (e.detail === 2) {
                                                                rotateItem(renderitem.id);
                                                            }
                                                        }}
                                                    />
                                                );
                                            })
                                        )
                                    ) : (
                                        <div
                                            className={`item-border ${selectedItemId === renderitem.id ? 'selected' : ''}`}
                                            style={{
                                                borderColor: qualityColor,
                                                borderWidth: '1px',
                                                boxShadow: `0 0 6px ${qualityColor}50`
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleItemContextMenu(e, renderitem.id);
                                            }}
                                            onClick={(e) => {
                                                setSelectedItemId(renderitem.id);
                                                if (e.detail === 2) {
                                                    rotateItem(renderitem.id);
                                                }
                                            }}
                                        />
                                    )}

                                    {!isComplexCustom && (
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
                                                cursor: 'move',
                                                pointerEvents: 'auto'
                                            }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, renderitem)}
                                            onDragEnd={handleDragEnd}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleItemContextMenu(e, renderitem.id);
                                            }}
                                            onMouseEnter={(e) => handleItemMouseEnter(e, renderitem.id)}
                                            onMouseMove={(e) => handleItemMouseMove(e, renderitem.id)}
                                            onMouseLeave={handleItemMouseLeave}
                                            onClick={(e) => {
                                                setSelectedItemId(renderitem.id);
                                                if (e.detail === 2) {
                                                    rotateItem(renderitem.id);
                                                }
                                            }}
                                        />
                                    )}

                                    {isComplexCustom ? (
                                        <div style={{
                                            position: 'absolute',
                                            top: `${((bestCellForIcon.row + 0.5) / bounds.height) * 100}%`,
                                            left: `${((bestCellForIcon.col + 0.5) / bounds.width) * 100}%`,
                                            width: `${(1 / bounds.width) * 100}%`,
                                            height: `${(1 / bounds.height) * 100}%`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pointerEvents: 'none',
                                            zIndex: 25,
                                            transform: 'translate(-50%, -50%)'
                                        }}>
                                            {renderitem.iconId || renderitem.type === 'currency' ? (
                                                <img
                                                    src={getIconUrl(
                                                        renderitem.type === 'currency'
                                                            ? 'Container/Coins/golden-coin-single-isometric'
                                                            : renderitem.iconId,
                                                        'items'
                                                    )}
                                                    alt={getDisplayName(renderitem)}
                                                    className={`item-icon ${renderitem.type === 'currency' ? `coin-${renderitem.currencyType || 'gold'}` : ''}`}
                                                    style={{
                                                        boxShadow: 'none',
                                                        border: 'none',
                                                        background: 'transparent',
                                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                                                        margin: 0,
                                                        width: '80%',
                                                        height: '80%',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                    }}
                                                />
                                            ) : (
                                                <span className="item-name" style={{ color: qualityColor }}>{getDisplayName(renderitem)}</span>
                                            )}
                                            {renderitem.quantity > 1 && (
                                                <span className="item-quantity">{renderitem.quantity}</span>
                                            )}
                                        </div>
                                    ) : (
                                    <div
                                        className={`inventory-item ${isMultiCell ? 'multi-cell' : ''}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <div
                                            className="item-content"
                                            data-quality={qualityLower}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {renderitem.iconId || renderitem.type === 'currency' ? (
                                                <img
                                                    src={getIconUrl(
                                                        renderitem.type === 'currency'
                                                            ? 'Container/Coins/golden-coin-single-isometric'
                                                            : renderitem.iconId,
                                                        'items'
                                                    )}
                                                    alt={getDisplayName(renderitem)}
                                                    className={`item-icon ${renderitem.type === 'currency' ? `coin-${renderitem.currencyType || 'gold'}` : ''}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                    }}
                                                />
                                            ) : (
                                                <span className="item-name" style={{ color: qualityColor }}>{getDisplayName(renderitem)}</span>
                                            )}
                                            {renderitem.quantity > 1 && (
                                                <span className="item-quantity">{renderitem.quantity}</span>
                                            )}
                                        </div>
                                    </div>
                                    )}
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
                                src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                alt="Platinum"
                                className="coin-icon coin-platinum"
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
                                src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                alt="Gold"
                                className="coin-icon coin-gold"
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
                                src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                alt="Silver"
                                className="coin-icon coin-silver"
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
                                src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                alt="Copper"
                                className="coin-icon coin-copper"
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
                            setItemToSplit(item);
                            setShowSplitStackModal(true);
                            setContextMenu({ visible: false });
                        }
                    });
                }

                // Rename option
                menuItems.push({
                    icon: <i className="fas fa-edit"></i>,
                    label: 'Rename',
                    onClick: () => {
                        setItemToRename(item);
                        setShowRenameModal(true);
                        setContextMenu({ visible: false });
                    }
                });

                                // Equip/Use option - show based on item type
                // Show "Use" for consumable items and recipe scrolls
                if (item?.type === 'consumable' || item?.type === 'recipe') {
                    const actionText = item?.type === 'recipe' ? 'Learn' : 'Use';
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

            {/* Overheal Confirmation Modal */}
            {showOverhealModal && overhealData && ReactDOM.createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        margin: 0,
                        padding: 0
                    }}
                    onClick={() => {
                        setShowOverhealModal(false);
                        setOverhealData(null);
                    }}
                >
                    <div
                        className="overheal-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")',
                            border: '3px solid #8b4513',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(139, 69, 19, 0.1)',
                            fontFamily: "'Cinzel', serif",
                            color: '#1a0f08',
                            minWidth: '400px',
                            maxWidth: '500px',
                            textAlign: 'center',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ 
                            margin: '0 0 20px 0', 
                            fontSize: '22px', 
                            color: '#7a3b2e',
                            borderBottom: '2px solid #8b4513',
                            paddingBottom: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Overheal Detected
                        </h3>
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#4a3728' }}>
                            <strong style={{ fontSize: '18px' }}>{overhealData.item?.name || 'Item'}</strong>
                            <br />
                            This would restore <strong>{overhealData.amount}</strong> {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}, 
                            but the current value is {overhealData.currentValue}/{overhealData.maxValue}.
                            <br />
                            <strong style={{ color: '#7a3b2e' }}>{overhealData.overhealAmount}</strong> would exceed the maximum.
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            justifyContent: 'center', 
                            marginTop: '25px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(139, 69, 19, 0.2)'
                        }}>
                            <Button
                                variant="game-secondary"
                                onClick={() => {
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="game-secondary"
                                onClick={() => applyResourceWithTemporary(false)}
                            >
                                Cap at Max
                            </Button>
                            <Button
                                variant="game-primary"
                                onClick={() => applyResourceWithTemporary(true)}
                            >
                                Add Temporary
                            </Button>
                        </div>
                    </div>
                </div>,
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

            {/* Rename Item Modal */}
            {showRenameModal && itemToRename && ReactDOM.createPortal(
                <div className="modal-overlay" onClick={() => {
                    setShowRenameModal(false);
                    setItemToRename(null);
                }}>
                    <div className="modal-content rename-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Rename Item</h3>
                            <button
                                className="close-button"
                                onClick={() => {
                                    setShowRenameModal(false);
                                    setItemToRename(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rename-item-info">
                                <img
                                    src={getIconUrl(itemToRename.iconId || 'inv_misc_questionmark', 'items')}
                                    alt={itemToRename.name}
                                    className="item-icon-small"
                                    onError={(e) => {
                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                    }}
                                />
                                <div className="item-details">
                                    <div className="item-name">{itemToRename.name}</div>
                                    <div className="item-quantity">
                                        {itemToRename.quantity > 1 ? `Quantity: ${itemToRename.quantity}` : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="rename-input-group">
                                <label htmlFor="rename-input">New Name:</label>
                                <input
                                    id="rename-input"
                                    type="text"
                                    defaultValue={itemToRename.customName || itemToRename.name}
                                    placeholder="Enter new name..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRenameItem();
                                        } else if (e.key === 'Escape') {
                                            setShowRenameModal(false);
                                            setItemToRename(null);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="modal-button cancel"
                                onClick={() => {
                                    setShowRenameModal(false);
                                    setItemToRename(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-button confirm"
                                onClick={handleRenameItem}
                            >
                                Rename
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Split Stack Modal */}
            {showSplitStackModal && itemToSplit && ReactDOM.createPortal(
                <div className="modal-overlay" onClick={() => {
                    setShowSplitStackModal(false);
                    setItemToSplit(null);
                }}>
                    <div className="modal-content rename-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Split Stack</h3>
                            <button
                                className="close-button"
                                onClick={() => {
                                    setShowSplitStackModal(false);
                                    setItemToSplit(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rename-item-info">
                                <img
                                    src={getIconUrl(itemToSplit.iconId || 'inv_misc_questionmark', 'items')}
                                    alt={itemToSplit.name}
                                    className="item-icon-small"
                                    onError={(e) => {
                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                    }}
                                />
                                <div className="item-details">
                                    <div className="item-name">{getDisplayName(itemToSplit)}</div>
                                    <div className="item-quantity">
                                        Current Quantity: {itemToSplit.quantity}
                                    </div>
                                </div>
                            </div>
                            <div className="rename-input-group">
                                <label htmlFor="split-quantity-input">
                                    Amount to Split (Stack: {itemToSplit.quantity}):
                                </label>
                                <input
                                    id="split-quantity-input"
                                    type="number"
                                    min="1"
                                    max={itemToSplit.quantity - 1}
                                    defaultValue={Math.floor(itemToSplit.quantity / 2)}
                                    placeholder={`Enter amount (1-${itemToSplit.quantity - 1})...`}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSplitStack();
                                        } else if (e.key === 'Escape') {
                                            setShowSplitStackModal(false);
                                            setItemToSplit(null);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="modal-button cancel"
                                onClick={() => {
                                    setShowSplitStackModal(false);
                                    setItemToSplit(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-button confirm"
                                onClick={handleSplitStack}
                            >
                                Split
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}


        </div>
    );
});

InventoryWindow.displayName = 'InventoryWindow';

export default InventoryWindow;
