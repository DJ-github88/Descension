import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import useItemStore from '../../store/itemStore';
import useInventoryStore from '../../store/inventoryStore';
import useGameStore from '../../store/gameStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import LockSettingsModal from './LockSettingsModal';
import ItemTooltip from './ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import DraggableWindow from '../windows/DraggableWindow';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import '../../styles/container-window.css';
import '../../styles/draggable-window.css';

// Helper function to get quality color
const getQualityColor = (quality, rarity) => {
    // Check for both quality and rarity properties
    const itemQuality = quality || rarity || 'common';
    const qualityLower = itemQuality.toLowerCase();
    return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
};

const ContainerWindow = ({ container, onClose }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showLockSettings, setShowLockSettings] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showItemTooltip, setShowItemTooltip] = useState({ visible: false, x: 0, y: 0, itemId: null });
    const [draggedItem, setDraggedItem] = useState(null);
    const [itemContextMenu, setItemContextMenu] = useState({ visible: false, x: 0, y: 0, itemId: null });
    const [position, setPosition] = useState({ x: 100, y: 100 });

    // Generate unique window ID
    const windowId = useRef(`container-window-${container.id}-${Date.now()}`).current;
    const [zIndex, setZIndex] = useState(1000);

    // Get window scale from game store
    const windowScale = useGameStore(state => state.windowScale);
    const [forceRender, setForceRender] = useState(0);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const bringToFront = useWindowManagerStore(state => state.bringToFront);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    // Register window with window manager on mount
    useEffect(() => {
        const initialZIndex = registerWindow(windowId, 'window');
        setZIndex(initialZIndex);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow]);

    // Debug: Log window scale changes
    useEffect(() => {
        console.log('ContainerWindow: Current window scale is', windowScale);
    }, [windowScale]);

    // Get store functions
    const updateItem = useItemStore(state => state.updateItem);
    const addItemToInventory = useInventoryStore(state => state.addItemFromLibrary);

    // Subscribe to the item store to get live updates to the container
    const containerFromStore = useItemStore(state =>
        state.items.find(item => item.id === container.id)
    );

    // Use the store version if available, otherwise fall back to the prop
    const currentContainer = containerFromStore || container;

    const containerRef = useRef(null);
    const draggableRef = useRef(null);
    const itemContextMenuRef = useRef(null);

    // Listen for window scale changes to force re-render
    useEffect(() => {
        const handleWindowScaleChange = (event) => {
            console.log('ContainerWindow: Window scale changed to', event.detail?.scale || 'unknown');
            setForceRender(prev => prev + 1);
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
    }, []);

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

    // Ensure container properties are initialized
    useEffect(() => {
        // Force container type to be 'container' if it's not already
        if (currentContainer.type !== 'container') {
            // Update the container type in the store
            updateItem(currentContainer.id, {
                type: 'container'
            });
        }

        if (!currentContainer.containerProperties) {
            // Initialize container properties if missing
            updateItem(currentContainer.id, {
                type: 'container',
                containerProperties: { ...defaultContainerProperties }
            });
        }

        // Mark as initialized immediately
        setIsInitialized(true);
    }, [currentContainer.id, currentContainer.name, currentContainer.type, currentContainer.containerProperties, updateItem]);

    // Handle drag for the container window
    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    // Close context menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showContextMenu && !e.target.closest('.context-menu')) {
                setShowContextMenu(false);
            }

            if (itemContextMenu.visible && !e.target.closest('.unified-context-menu')) {
                setItemContextMenu({ ...itemContextMenu, visible: false });
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showContextMenu, itemContextMenu]);

    // Handle item context menu
    const handleItemContextMenu = (e, itemId) => {
        e.preventDefault();
        e.stopPropagation();

        // Calculate position to ensure menu stays within viewport
        const x = Math.min(e.clientX, window.innerWidth - 200);
        const y = Math.min(e.clientY, window.innerHeight - 150);

        setItemContextMenu({
            visible: true,
            x,
            y,
            itemId
        });
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        // Only show context menu if clicking on the header
        if (e.target.closest('.container-window-header')) {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    // Simple tooltip handlers (matching character sheet pattern)
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

    // Handle drag start for items
    const handleDragStart = (e, item) => {
        console.log('Drag start with item:', item);
        setDraggedItem(item);

        // Create a copy of the item without the position property
        const itemForInventory = { ...item };
        delete itemForInventory.position;

        e.dataTransfer.setData('text/plain', JSON.stringify({
            item: itemForInventory,
            type: 'container-item',
            containerId: currentContainer.id
        }));
        e.dataTransfer.effectAllowed = 'move';

        // Set a drag image to improve the drag visual
        try {
            // Create a temporary element for the drag image
            const dragImage = document.createElement('div');
            dragImage.className = 'drag-image';
            dragImage.style.width = '40px';
            dragImage.style.height = '40px';
            dragImage.style.background = `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg)`;
            dragImage.style.backgroundSize = 'cover';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            dragImage.style.opacity = '0.8';

            // Add to document temporarily
            document.body.appendChild(dragImage);

            // Set as drag image
            e.dataTransfer.setDragImage(dragImage, 20, 20);

            // Remove after a short delay
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 100);
        } catch (error) {
            console.error('Error setting drag image:', error);
        }
    };

    // Handle drag end
    const handleDragEnd = () => {
        console.log('Drag end');
        setDraggedItem(null);

        // Clear all highlights
        document.querySelectorAll('.container-cell').forEach(cell => {
            cell.classList.remove('drag-over');
            cell.classList.remove('drag-invalid');
        });
    };

    // Remove item from container
    const removeItemFromContainer = (itemId) => {
        console.log('Removing item from container:', itemId);

        // Make sure container properties exist
        if (!currentContainer.containerProperties || !currentContainer.containerProperties.items) {
            console.error('Container properties or items array is missing');
            return null;
        }

        // Find the item in the container
        const item = currentContainer.containerProperties.items.find(item => item.id === itemId);

        if (item) {
            console.log('Found item to remove:', item);

            // Create a deep copy of the item to return
            const itemCopy = JSON.parse(JSON.stringify(item));

            // Update the container by filtering out the removed item
            const updatedItems = currentContainer.containerProperties.items.filter(item => item.id !== itemId);

            console.log('Updated items after removal:', updatedItems);

            // Create updated container properties
            const updatedContainerProps = {
                ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                items: updatedItems,
                hasHadItems: true // Set hasHadItems flag to prevent sample items from appearing when emptied
            };

            // Update the container in the store
            updateItem(currentContainer.id, {
                containerProperties: updatedContainerProps
            });

            console.log('Container updated, returning item copy');
            return itemCopy;
        }

        console.log('Item not found in container');
        return null;
    };

    const handleLockSettingsSave = (settings) => {
        // Get existing container properties or initialize with defaults
        const existingProps = currentContainer.containerProperties || { ...defaultContainerProperties };

        // Create updated container properties
        const updatedProps = {
            ...existingProps,
            isLocked: settings.isLocked,
            lockType: settings.isLocked ? settings.lockType : 'none',
            lockDC: settings.isLocked && settings.lockType === 'thievery' ? settings.lockDC : 0,
            lockCode: settings.isLocked && (settings.lockType === 'code' || settings.lockType === 'numeric') ? settings.lockCode : '',
            flavorText: settings.isLocked ? settings.flavorText : '',
            maxAttempts: settings.isLocked ? settings.maxAttempts : 3,
            failureAction: settings.isLocked ? settings.failureAction : 'none',
            failureActionDetails: settings.isLocked ? settings.failureActionDetails : {
                removeItems: false,
                removePercentage: 50,
                destroyContainer: false,
                triggerTrap: false,
                trapDetails: '',
                transformIntoCreature: false,
                creatureType: ''
            }
        };

        // Update the container
        updateItem(currentContainer.id, {
            containerProperties: updatedProps
        });

        setShowLockSettings(false);
    };

    // State for dragging items within the container
    const [draggedContainerItem, setDraggedContainerItem] = useState(null);
    const [dragOverCell, setDragOverCell] = useState(null);

    // Helper function to check if a cell is the origin of an item
    const isItemOrigin = (row, col, item) => {
        return item && item.position &&
            item.position.row === row &&
            item.position.col === col;
    };

    // Helper function to check if a cell is occupied by an item
    const isCellOccupiedByItem = (row, col, item) => {
        if (!item || !item.position) return false;

        // Get item dimensions
        const width = item.width || 1;
        const height = item.height || 1;
        const rotation = item.rotation || 0;

        // Calculate effective dimensions based on rotation
        const effectiveWidth = rotation === 1 ? height : width;
        const effectiveHeight = rotation === 1 ? width : height;

        // Check if this cell is within the bounds of the item
        return row >= item.position.row &&
               row < item.position.row + effectiveHeight &&
               col >= item.position.col &&
               col < item.position.col + effectiveWidth;
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

    // Helper function to format coin value (e.g., 137 copper -> "1s 37c")
    const formatCoinValue = (coinValue) => {
        if (!coinValue) return '0c';

        const platinum = Math.floor(coinValue / 10000);
        const gold = Math.floor((coinValue % 10000) / 100);
        const silver = Math.floor((coinValue % 100) / 10);
        const copper = coinValue % 10;

        const parts = [];
        if (platinum > 0) parts.push(`${platinum}p`);
        if (gold > 0) parts.push(`${gold}g`);
        if (silver > 0) parts.push(`${silver}s`);
        if (copper > 0 || parts.length === 0) parts.push(`${copper}c`);

        return parts.join(' ');
    };

    // Helper function to check if two items can stack
    const canStack = (item1, item2) => {
        console.log('🔍 Checking if items can stack:', {
            item1: { name: item1.name, type: item1.type, iconId: item1.iconId },
            item2: { name: item2.name, type: item2.type, iconId: item2.iconId }
        });

        // Coins always stack with coins
        if (item1.type === 'currency' && item2.type === 'currency') {
            console.log('✅ Both are currency - can stack');
            return true;
        }

        // Consumables, materials, gems, and miscellaneous can stack if they have the same name and iconId
        const stackableTypes = ['consumable', 'material', 'gem', 'miscellaneous'];
        if (stackableTypes.includes(item1.type) && stackableTypes.includes(item2.type)) {
            const canStackResult = item1.name === item2.name && item1.iconId === item2.iconId;
            console.log(`${canStackResult ? '✅' : '❌'} Stackable type check: name match=${item1.name === item2.name}, iconId match=${item1.iconId === item2.iconId}`);
            return canStackResult;
        }

        console.log('❌ Items cannot stack - different types or non-stackable');
        return false;
    };

    // Helper function to find stackable item in container
    const findStackableItem = (items, newItem) => {
        return items.find(item => canStack(item, newItem));
    };

    // Check if a position is valid for an item in the container
    const isValidContainerPosition = (items, row, col, width, height, rotation, excludeItemId = null) => {
        // Get container grid size
        const gridSize = currentContainer.containerProperties?.gridSize || { rows: 4, cols: 6 };
        const rows = gridSize.rows || 4;
        const cols = gridSize.cols || 6;

        // Calculate effective dimensions based on rotation
        const effectiveWidth = rotation === 1 ? height : width;
        const effectiveHeight = rotation === 1 ? width : height;

        // Check if the item fits within the grid
        if (row < 0 || col < 0 || row + effectiveHeight > rows || col + effectiveWidth > cols) {
            return false;
        }

        // Check if the position overlaps with any other item
        for (const item of items) {
            // Skip the item being moved
            if (item.id === excludeItemId) continue;

            const itemWidth = item.width || 1;
            const itemHeight = item.height || 1;
            const itemRotation = item.rotation || 0;

            // Calculate effective dimensions for the existing item
            const itemEffectiveWidth = itemRotation === 1 ? itemHeight : itemWidth;
            const itemEffectiveHeight = itemRotation === 1 ? itemWidth : itemHeight;

            // Check for overlap
            if (item.position &&
                col < item.position.col + itemEffectiveWidth &&
                col + effectiveWidth > item.position.col &&
                row < item.position.row + itemEffectiveHeight &&
                row + effectiveHeight > item.position.row) {
                return false;
            }
        }

        return true;
    };

    // Create grid cells based on container properties
    const renderGrid = () => {
        // Ensure container properties exist
        if (!currentContainer.containerProperties) {
            // Initialize container properties if missing
            updateItem(currentContainer.id, {
                containerProperties: { ...defaultContainerProperties }
            });
            return null; // Return early, will re-render when store updates
        }

        const containerProps = currentContainer.containerProperties;

        // Ensure gridSize exists
        if (!containerProps.gridSize) {
            containerProps.gridSize = { rows: 4, cols: 6 };
        }

        const rows = containerProps.gridSize.rows || 4;
        const cols = containerProps.gridSize.cols || 6;
        const items = containerProps.items || [];

        // Never add sample items to containers
        // Always use the actual items from the container
        const displayItems = items;

        // Set CSS variables for grid layout
        const gridStyle = {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 40px)`,
            gridTemplateRows: `repeat(${rows}, 40px)`,
            gap: '4px',
            padding: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '0 auto',
            width: 'fit-content'
        };

        // Create cells for the grid
        const cells = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Find an item that occupies this cell
                const item = displayItems.find(item => isCellOccupiedByItem(row, col, item));

                // Check if this is the top-left cell of the item (for rendering)
                const isOrigin = item && isItemOrigin(row, col, item);

                cells.push(
                    <div
                        key={`${row}-${col}`}
                        className={`container-cell ${item ? 'occupied' : ''} ${
                            dragOverCell && dragOverCell.row === row && dragOverCell.col === col ?
                            (dragOverCell.isValid ? 'drag-over' : 'drag-invalid') : ''
                        }`}
                        data-row={row}
                        data-col={col}
                        onDragOver={(e) => {
                            e.preventDefault();

                            // Handle internal container drag
                            if (draggedContainerItem) {
                                // Get item dimensions
                                const width = draggedContainerItem.width || 1;
                                const height = draggedContainerItem.height || 1;
                                const rotation = draggedContainerItem.rotation || 0;

                                // Check if this is a valid position for the dragged item
                                const isValid = isValidContainerPosition(
                                    currentContainer.containerProperties?.items.filter(i => i.id !== draggedContainerItem.id) || [],
                                    row,
                                    col,
                                    width,
                                    height,
                                    rotation,
                                    draggedContainerItem.id
                                );

                                // Get all cells that would be occupied
                                const occupiedCells = getOccupiedCells(row, col, width, height, rotation);

                                // Remove highlight from all cells
                                document.querySelectorAll('.container-cell').forEach(cell => {
                                    cell.classList.remove('drag-over');
                                    cell.classList.remove('drag-invalid');
                                });

                                // Add appropriate highlight to occupied cells
                                occupiedCells.forEach(cellId => {
                                    const cellElement = document.querySelector(`.container-cell[data-row="${cellId.split('-')[0]}"][data-col="${cellId.split('-')[1]}"]`);
                                    if (cellElement) {
                                        cellElement.classList.add(isValid ? 'drag-over' : 'drag-invalid');
                                    }
                                });

                                // Set drag over cell state and cursor
                                setDragOverCell({ row, col, isValid });
                                e.dataTransfer.dropEffect = isValid ? 'move' : 'none';
                                return;
                            }

                            // Handle external drags (from inventory or item library)
                            // Both now set window.draggedItemInfo
                            if (window.draggedItemInfo) {
                                const { width, height, rotation, item } = window.draggedItemInfo;

                                // Check if we can stack with an existing item
                                const items = currentContainer.containerProperties?.items || [];
                                const canStackWithExisting = item ? findStackableItem(items, item) : null;

                                console.log('🔍 Drag over - can stack?', !!canStackWithExisting, 'item:', item?.name, 'type:', item?.type);

                                // Check if this is a valid position for the dragged item
                                const isValidPosition = isValidContainerPosition(
                                    items,
                                    row,
                                    col,
                                    width,
                                    height,
                                    rotation
                                );

                                // Item is valid if it can stack OR if the position is valid
                                const isValid = canStackWithExisting || isValidPosition;

                                // Get all cells that would be occupied
                                const occupiedCells = getOccupiedCells(row, col, width, height, rotation);

                                // Remove highlight from all cells
                                document.querySelectorAll('.container-cell').forEach(cell => {
                                    cell.classList.remove('drag-over');
                                    cell.classList.remove('drag-invalid');
                                });

                                // Add appropriate highlight to occupied cells
                                occupiedCells.forEach(cellId => {
                                    const cellElement = document.querySelector(`.container-cell[data-row="${cellId.split('-')[0]}"][data-col="${cellId.split('-')[1]}"]`);
                                    if (cellElement) {
                                        cellElement.classList.add(isValid ? 'drag-over' : 'drag-invalid');
                                    }
                                });

                                // Set drag over cell state and cursor
                                setDragOverCell({ row, col, isValid });
                                e.dataTransfer.dropEffect = isValid ? 'copy' : 'none';
                            }
                        }}
                        onDragLeave={() => {
                            // We don't remove the highlight here as it would flicker
                            // The highlight is managed in handleDragOver
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent event from bubbling
                            console.log('🎯 Drop event triggered on cell:', row, col);

                            // Clear all highlights
                            document.querySelectorAll('.container-cell').forEach(cell => {
                                cell.classList.remove('drag-over');
                                cell.classList.remove('drag-invalid');
                            });

                            try {
                                // Try to parse the data transfer
                                const dataTransfer = e.dataTransfer.getData('text/plain');
                                console.log('🎯 DataTransfer content:', dataTransfer);

                                if (!dataTransfer || dataTransfer.trim() === '') {
                                    console.log('❌ No data found in drop event');
                                    return;
                                }

                                // Parse the JSON data
                                let data;
                                try {
                                    data = JSON.parse(dataTransfer);
                                    console.log('🎯 Parsed drop data:', data);
                                } catch (jsonError) {
                                    console.error('❌ Error parsing JSON data:', jsonError);
                                    return;
                                }

                                // Handle items dragged from inventory
                                if (data.type === 'inventory-item') {
                                    console.log('Inventory item dropped into container:', data);

                                    // Get the item from inventory
                                    const inventoryItem = useInventoryStore.getState().items.find(item => item.id === data.id);

                                    if (inventoryItem) {
                                        // Make a deep copy of the container's items
                                        const items = JSON.parse(JSON.stringify(currentContainer.containerProperties?.items || []));

                                        // Check if we can stack with an existing item FIRST (before checking position)
                                        const stackableItem = findStackableItem(items, inventoryItem);

                                        if (stackableItem) {
                                            // Stack with existing item - no position check needed!
                                            const itemIndex = items.findIndex(i => i.id === stackableItem.id);

                                            if (stackableItem.type === 'currency') {
                                                // For coins, add the values together
                                                const currentValue = stackableItem.coinValue || 0;
                                                const addedValue = inventoryItem.coinValue || 0;
                                                items[itemIndex].coinValue = currentValue + addedValue;
                                            } else {
                                                // For consumables/materials/gems, add quantities
                                                const currentQty = stackableItem.quantity || 1;
                                                const addedQty = inventoryItem.quantity || 1;
                                                items[itemIndex].quantity = currentQty + addedQty;
                                            }

                                            // Create updated container properties
                                            const updatedContainerProps = {
                                                ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                                                items: items,
                                                hasHadItems: true
                                            };

                                            // Update container in the store
                                            updateItem(currentContainer.id, {
                                                containerProperties: updatedContainerProps
                                            });

                                            // Remove the item from inventory
                                            useInventoryStore.getState().removeItem(inventoryItem.id);
                                        } else {
                                            // No stackable item found - check if we can place it in a new position
                                            // Get item dimensions
                                            const width = inventoryItem.width || 1;
                                            const height = inventoryItem.height || 1;
                                            const rotation = inventoryItem.rotation || 0;

                                            // Check if position is valid
                                            const isValid = isValidContainerPosition(
                                                currentContainer.containerProperties?.items || [],
                                                row,
                                                col,
                                                width,
                                                height,
                                                rotation
                                            );

                                            if (isValid) {
                                                // Create a copy of the item for the container
                                                const itemForContainer = {
                                                    ...JSON.parse(JSON.stringify(inventoryItem)),
                                                    position: { row, col }
                                                };

                                                // Add the item to the container
                                                items.push(itemForContainer);

                                                // Create updated container properties
                                                const updatedContainerProps = {
                                                    ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                                                    items: items,
                                                    hasHadItems: true
                                                };

                                                // Update container in the store
                                                updateItem(currentContainer.id, {
                                                    containerProperties: updatedContainerProps
                                                });

                                                // Remove the item from inventory
                                                useInventoryStore.getState().removeItem(inventoryItem.id);
                                            }
                                        }
                                    }
                                }
                                // Handle items dragged from item library
                                else if (data.type === 'item') {
                                    console.log('✅ Item library item dropped into container:', data);

                                    // Get the item from the item library
                                    const libraryItem = useItemStore.getState().items.find(item => item.id === data.id);
                                    console.log('🔍 Found library item:', libraryItem?.name);

                                    if (libraryItem) {
                                        // Don't allow dropping a container into another container
                                        if (libraryItem.type === 'container') {
                                            console.log('❌ Cannot add a container to another container');
                                            return;
                                        }

                                        // Get item dimensions (default to 1x1 if not specified)
                                        let width = libraryItem.width || 1;
                                        let height = libraryItem.height || 1;
                                        const rotation = libraryItem.rotation || 0;

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
                                            }
                                        }

                                        console.log(`📏 Item dimensions: ${width}x${height}, rotation: ${rotation}`);

                                        // Make a deep copy of the container's items
                                        const items = JSON.parse(JSON.stringify(currentContainer.containerProperties?.items || []));

                                        // Check if we can stack with an existing item FIRST (before checking position)
                                        const stackableItem = findStackableItem(items, libraryItem);

                                        if (stackableItem) {
                                            // Stack with existing item - no position check needed!
                                            const itemIndex = items.findIndex(i => i.id === stackableItem.id);

                                            if (stackableItem.type === 'currency') {
                                                // For coins, add the values together
                                                const currentValue = stackableItem.coinValue || 0;
                                                const addedValue = libraryItem.coinValue || 0;
                                                items[itemIndex].coinValue = currentValue + addedValue;
                                            } else {
                                                // For consumables/materials/gems, add quantities
                                                const currentQty = stackableItem.quantity || 1;
                                                const addedQty = libraryItem.quantity || 1;
                                                items[itemIndex].quantity = currentQty + addedQty;
                                            }

                                            // Create updated container properties
                                            const updatedContainerProps = {
                                                ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                                                items: items,
                                                hasHadItems: true
                                            };

                                            console.log('💾 Stacking item with existing:', stackableItem);
                                            console.log('💾 Updated container props:', updatedContainerProps);

                                            // Update container in the store
                                            updateItem(currentContainer.id, {
                                                containerProperties: updatedContainerProps
                                            });

                                            console.log('✅ Container updated successfully!');

                                            // Force a re-render
                                            setTimeout(() => {
                                                setDragOverCell(null);
                                                setDraggedContainerItem(null);
                                            }, 50);
                                        } else {
                                            // No stackable item found - check if we can place it in a new position
                                            // Check if position is valid
                                            const isValid = isValidContainerPosition(
                                                currentContainer.containerProperties?.items || [],
                                                row,
                                                col,
                                                width,
                                                height,
                                                rotation
                                            );

                                            console.log(`✅ Position valid: ${isValid} for position (${row}, ${col})`);

                                            if (isValid) {
                                                // Create a copy of the item for the container with a new ID
                                                const itemForContainer = {
                                                    ...JSON.parse(JSON.stringify(libraryItem)),
                                                    id: Date.now().toString(), // Generate a new ID
                                                    position: { row, col },
                                                    width: width,
                                                    height: height,
                                                    rotation: rotation
                                                };

                                                // Add the item to the container
                                                items.push(itemForContainer);

                                                // Create updated container properties
                                                const updatedContainerProps = {
                                                    ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                                                    items: items,
                                                    hasHadItems: true
                                                };

                                                console.log('💾 Updating container with new item:', itemForContainer);
                                                console.log('💾 Updated container props:', updatedContainerProps);

                                                // Update container in the store
                                                updateItem(currentContainer.id, {
                                                    containerProperties: updatedContainerProps
                                                });

                                                console.log('✅ Container updated successfully!');

                                                // Force a re-render
                                                setTimeout(() => {
                                                    setDragOverCell(null);
                                                    setDraggedContainerItem(null);
                                                }, 50);
                                            } else {
                                                console.log('❌ Invalid position for item');
                                            }
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error('Error handling drop from external source:', error);
                            }

                            // Handle drop for container items (internal movement)
                            if (draggedContainerItem) {
                                console.log('Dragged item within container:', draggedContainerItem);

                                // Make a deep copy of the container's items
                                const items = JSON.parse(JSON.stringify(currentContainer.containerProperties?.items || []));
                                const itemIndex = items.findIndex(i => i.id === draggedContainerItem.id);

                                console.log('Item index in container:', itemIndex);
                                console.log('Current container items:', items);

                                if (itemIndex !== -1) {
                                    // Check if position is valid
                                    const width = draggedContainerItem.width || 1;
                                    const height = draggedContainerItem.height || 1;
                                    const rotation = draggedContainerItem.rotation || 0;

                                    const isValid = isValidContainerPosition(
                                        items.filter(i => i.id !== draggedContainerItem.id),
                                        row,
                                        col,
                                        width,
                                        height,
                                        rotation
                                    );

                                    console.log('Position valid:', isValid);

                                    if (isValid) {
                                        // Update item position
                                        items[itemIndex] = {
                                            ...items[itemIndex],
                                            position: { row, col }
                                        };

                                        console.log('Updated items array:', items);

                                        // Create a deep copy of the container properties
                                        const updatedContainerProps = {
                                            ...JSON.parse(JSON.stringify(currentContainer.containerProperties)),
                                            items: items,
                                            // Set hasHadItems flag to true to prevent sample items from appearing
                                            hasHadItems: true
                                        };

                                        console.log('Updating container with new properties:', updatedContainerProps);

                                        // Update container in the store
                                        updateItem(currentContainer.id, {
                                            containerProperties: updatedContainerProps
                                        });
                                    }
                                }

                                // Clear the dragged item state
                                setDraggedContainerItem(null);
                            }
                        }}
                    >
                        {item && isOrigin && (
                            <div className="item-wrapper" style={{
                                // Use grid positioning to span multiple cells
                                gridColumn: item.rotation === 1
                                    ? `${col + 1} / span ${item.height}`
                                    : `${col + 1} / span ${item.width}`,
                                gridRow: item.rotation === 1
                                    ? `${row + 1} / span ${item.width}`
                                    : `${row + 1} / span ${item.height}`,
                                zIndex: 100,
                                overflow: 'visible',
                                boxShadow: `0 0 8px ${getQualityColor(item.quality, item.rarity)}80`,
                                pointerEvents: 'auto'
                            }}>
                                {/* Non-rotating border with quality color */}
                                <div
                                    className={`item-border ${item.quality || item.rarity || 'common'}`}
                                    style={{
                                        borderColor: getQualityColor(item.quality, item.rarity),
                                        boxShadow: `0 0 5px ${getQualityColor(item.quality, item.rarity)}80`
                                    }}
                                />

                                {/* Non-rotating blue indicator with rotation symbol - only show if rotated */}
                                {item.rotation === 1 && (
                                    <div className="blue-indicator">
                                        ↻
                                    </div>
                                )}

                                {/* Container for item */}
                                <div
                                    className={`container-item ${item.width > 1 || item.height > 1 ? 'multi-cell' : ''}`}
                                    draggable
                                    onDragStart={(e) => {
                                        // For dragging to inventory
                                        handleDragStart(e, item);
                                        // For dragging within container
                                        setDraggedContainerItem(item);
                                    }}
                                    onDragEnd={() => {
                                        handleDragEnd();
                                        setDraggedContainerItem(null);
                                        setDragOverCell(null);
                                    }}
                                >
                                    {/* Item content */}
                                    <div
                                        className="item-content"
                                        style={{
                                            color: getQualityColor(item.quality, item.rarity)
                                        }}
                                        onMouseEnter={(e) => handleItemMouseEnter(e, item.id)}
                                        onMouseMove={(e) => handleItemMouseMove(e, item.id)}
                                        onMouseLeave={handleItemMouseLeave}
                                        onContextMenu={(e) => handleItemContextMenu(e, item.id)}
                                    >
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`}
                                            alt={item.name}
                                            className="item-icon"
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                            }}
                                        />
                                        {/* Show coin value for currency items */}
                                        {item.type === 'currency' && item.coinValue && (
                                            <span className="item-stack-size">
                                                {formatCoinValue(item.coinValue)}
                                            </span>
                                        )}
                                        {/* Show quantity for other stackable items */}
                                        {item.quantity > 1 && (item.type === 'consumable' || item.type === 'gem' || item.type === 'material' || item.type === 'miscellaneous') && (
                                            <span className="item-stack-size">
                                                {item.quantity}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }

        return (
            <div className="container-grid" style={gridStyle}>
                {cells}
            </div>
        );
    };

    // Initialize the container window and ensure it's visible
    useEffect(() => {
        console.log('ContainerWindow mounted for container:', currentContainer.id, currentContainer.name);

        // Force the container window to be visible after rendering
        const timeoutId = setTimeout(() => {
            try {
                // Find the container window element
                const containerWindowElement = document.getElementById(`container-window-${container.id}`);
                if (containerWindowElement) {
                    console.log('Found container window element, ensuring visibility');
                    containerWindowElement.style.display = 'block';
                    containerWindowElement.style.visibility = 'visible';
                    containerWindowElement.style.opacity = '1';
                    containerWindowElement.style.zIndex = '9999';
                } else {
                    console.error('Container window element not found for ID:', container.id);
                }
            } catch (error) {
                console.error('Error ensuring container window visibility:', error);
            }
        }, 100);

        return () => {
            console.log('ContainerWindow unmounted for container:', currentContainer.id, currentContainer.name);
            clearTimeout(timeoutId);
        };
    }, [currentContainer.id, currentContainer.name, container.id]);

    // Force re-render when container items change
    useEffect(() => {
        console.log('Container items changed:', currentContainer.containerProperties?.items);

        // Force a re-render by updating the component state
        if (currentContainer.containerProperties?.items) {
            // This is a trick to force a re-render
            const forceUpdate = () => {
                setDragOverCell(null);
                setDraggedContainerItem(null);
            };

            // Call forceUpdate after a short delay to ensure the UI updates
            setTimeout(forceUpdate, 50);
        }
    }, [currentContainer.containerProperties?.items]);

    // Create a ref for the Draggable component
    const draggableNodeRef = useRef(null);

    // Return the container window component using React Portal
    return (
        <>
            {createPortal(
                <>
            <Draggable
                handle=".container-window-header"
                defaultPosition={position}
                bounds="body"
                onDrag={handleDrag}
                nodeRef={draggableNodeRef}
                scale={1}
                enableUserSelectHack={false}
            >
                <div
                    className="container-window"
                    ref={draggableNodeRef}
                    onContextMenu={handleContextMenu}
                    onClick={() => {
                        const newZIndex = bringToFront(windowId);
                        if (newZIndex) {
                            setZIndex(newZIndex);
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault(); // Allow drops on the window
                        console.log('🪟 Container window dragOver');
                    }}
                    onDrop={(e) => {
                        console.log('🪟 Container window drop event!');
                    }}
                    id={`container-window-${container.id}`}
                    style={{
                        position: 'fixed',
                        zIndex: zIndex, // Use managed z-index
                        display: 'block',
                        visibility: 'visible',
                        opacity: 1,
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)',
                        border: '2px solid #333',
                        background: '#222',
                        color: '#fff',
                        borderRadius: '5px',
                        minWidth: '300px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        top: 0,
                        left: 0,
                        width: 'auto',
                        transformOrigin: 'top left'
                        // DraggableWindow now handles scaling with proper hit detection
                    }}
                >
                    <div
                        className="container-window-header"
                        style={{
                            background: 'linear-gradient(to bottom, #444, #333)',
                            color: '#fff',
                            padding: '8px 12px',
                            cursor: 'move',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #555',
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px',
                            minHeight: '40px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <div className="container-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${currentContainer.iconId || 'inv_box_01'}.jpg`}
                                alt={currentContainer.name}
                                className="container-icon"
                                style={{ width: '24px', height: '24px', borderRadius: '3px' }}
                                onError={(e) => {
                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_box_01.jpg';
                                }}
                            />
                            <span style={{ fontWeight: 'bold' }}>{currentContainer.name}</span>
                            {currentContainer.containerProperties?.isLocked && (
                                <i className="fas fa-lock" style={{ color: '#ffaa00', marginLeft: '5px' }}></i>
                            )}
                        </div>
                        <button
                            className="close-button"
                            onClick={onClose}
                            style={{
                                background: '#d32f2f',
                                border: '1px solid rgba(0,0,0,0.3)',
                                borderRadius: '3px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                flexShrink: 0
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#b71c1c';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#d32f2f';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div
                        className="container-window-content"
                        style={{
                            padding: '15px',
                            background: '#222',
                            minHeight: '200px',
                            minWidth: '300px',
                            maxHeight: 'calc(90vh - 50px)',
                            overflow: 'auto',
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            pointerEvents: 'auto' // Ensure pointer events are enabled
                        }}
                        onDragOver={(e) => {
                            e.preventDefault(); // Allow drop
                            e.stopPropagation();
                        }}
                    >
                        {renderGrid()}
                    </div>
                </div>
            </Draggable>



            {/* Item Context Menu */}
            {itemContextMenu.visible && (() => {
                const item = currentContainer.containerProperties?.items?.find(i => i.id === itemContextMenu.itemId);
                if (!item) return null;

                const menuItems = [
                    {
                        icon: <i className="fas fa-arrow-right"></i>,
                        label: 'Move to Inventory',
                        onClick: () => {
                            console.log('Move to Inventory clicked for item:', itemContextMenu.itemId);

                            // Move to inventory
                            const removedItem = removeItemFromContainer(itemContextMenu.itemId);

                            if (removedItem) {
                                console.log('Item removed from container, adding to inventory:', removedItem);

                                // Add to inventory
                                addItemToInventory(removedItem);
                            } else {
                                console.error('Failed to remove item from container');
                            }

                            // Close the context menu
                            setItemContextMenu({ ...itemContextMenu, visible: false });
                        }
                    },
                    {
                        icon: <i className="fas fa-trash-alt"></i>,
                        label: 'Delete',
                        onClick: () => {
                            console.log('Delete clicked for item:', itemContextMenu.itemId);

                            // Remove from container without adding to inventory
                            removeItemFromContainer(itemContextMenu.itemId);

                            // Close the context menu
                            setItemContextMenu({ ...itemContextMenu, visible: false });
                        },
                        className: 'danger'
                    }
                ];

                return (
                    <UnifiedContextMenu
                        visible={true}
                        x={itemContextMenu.x}
                        y={itemContextMenu.y}
                        onClose={() => setItemContextMenu({ ...itemContextMenu, visible: false })}
                        items={menuItems}
                    />
                );
            })()}
                </>,
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
                            zIndex: 2147483647 // Maximum z-index value to ensure tooltips always appear above windows
                        }}
                    >
                        {(() => {
                            // Find the item in the container's items
                            const item = currentContainer.containerProperties?.items?.find(i => i.id === showItemTooltip.itemId);
                            if (!item) return null;

                            // Use the ItemTooltip component for consistent display
                            return <ItemTooltip item={item} />;
                        })()}
                    </div>
                </TooltipPortal>
            )}
        </>
    );
};

export default ContainerWindow;
