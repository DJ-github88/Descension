import React, { useState, useEffect, useMemo } from 'react';
import {
    useCharacterWizardState,
    useCharacterWizardDispatch,
    wizardActionCreators
} from '../context/CharacterWizardContext';
import {
    calculateStartingCurrency,
    subtractCurrency,
    addCurrency,
    formatCurrency,
    calculateTotalCopper
} from '../../../data/startingCurrencyData';
import {
    getAvailableStartingItems,
    getItemsByCategory,
    STARTING_EQUIPMENT_LIBRARY
} from '../../../data/startingEquipmentData';
import { getBackgroundData } from '../../../data/backgroundData';
import { ALL_BACKGROUND_EQUIPMENT } from '../../../data/equipment/backgroundEquipment';
import ItemTooltip from '../../item-generation/ItemTooltip';
import '../styles/EquipmentSelection.css';

// Helper function to get background equipment as selected items
const getBackgroundEquipmentAsSelected = (characterData) => {
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    if (!backgroundData?.equipment) return [];

    return backgroundData.equipment.map(itemName => {
        // First try to find the item by its full original name (including quantity)
        let foundItem = ALL_BACKGROUND_EQUIPMENT.find(item =>
            item.name.toLowerCase() === itemName.toLowerCase()
        );

        let cleanName = itemName;
        let quantity = 1;

        if (foundItem) {
            // Item found with full name, use its data
            return {
                ...foundItem, // Include all properties from the found item
                quantity: 1, // Background items are typically single unless specified
                isBackgroundItem: true, // Mark as background item
                // No value since it's free background equipment
            };
        } else {
            // Try some common name variations
            const variations = [
                itemName,
                itemName.toLowerCase(),
                itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase(),
                itemName.replace(/\b\w/g, l => l.toUpperCase()) // Title case
            ];

            for (const variation of variations) {
                foundItem = ALL_BACKGROUND_EQUIPMENT.find(item =>
                    item.name === variation
                );
                if (foundItem) break;
            }

            if (foundItem) {
                return {
                    ...foundItem, // Include all properties from the found item
                    quantity: 1,
                    isBackgroundItem: true, // Mark as background item
                    // No value since it's free background equipment
                };
            } else {
                // Item not found, try parsing quantity from name
                const quantityMatch = itemName.match(/(.+?)\s*\((\d+)\s*(?:feet?|lbs?|gp|sp|cp|gold|silver|copper)?\)/i);
                if (quantityMatch) {
                    cleanName = quantityMatch[1].trim();
                    quantity = parseInt(quantityMatch[2]);

                    // Try to find the base item without quantity with variations
                    const cleanVariations = [
                        cleanName,
                        cleanName.toLowerCase(),
                        cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase(),
                        cleanName.replace(/\b\w/g, l => l.toUpperCase())
                    ];

                    for (const variation of cleanVariations) {
                        foundItem = ALL_BACKGROUND_EQUIPMENT.find(item =>
                            item.name === variation
                        );
                        if (foundItem) break;
                    }

                    if (foundItem) {
                        return {
                            ...foundItem, // Include all properties from the found item
                            quantity: quantity,
                            isBackgroundItem: true, // Mark as background item
                            // Override name to use the clean name without quantity
                            name: cleanName,
                        };
                    }
                }

                // Fallback: try STARTING_EQUIPMENT_LIBRARY as last resort
                foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                    item.name.toLowerCase() === itemName.toLowerCase()
                );

                if (foundItem) {
                    return {
                        ...foundItem,
                        quantity: 1,
                        isBackgroundItem: true, // Mark as background item
                    };
                }

                // Parse gold amount from item name (e.g., "purse with 25g" -> 25 gold)
                const goldMatch = itemName.match(/(\d+)\s*g/i);
                const goldValue = goldMatch ? parseInt(goldMatch[1]) : 0;

                // Final fallback: create minimal item object with tooltip-compatible properties
                return {
                    name: cleanName,
                    quantity: quantity,
                    type: 'miscellaneous',
                    subtype: 'TOOL',
                    quality: 'common',
                    description: `${cleanName} - Included with your background`,
                    iconId: 'inv_misc_questionmark',
                    value: goldValue > 0
                        ? { platinum: 0, gold: goldValue, silver: 0, copper: 0 }
                        : { platinum: 0, gold: 0, silver: 45, copper: 75 }, // Default sell price
                    weight: 1,
                    width: 1,
                    height: 1,
                    requiredLevel: 1,
                    isBackgroundItem: true, // Mark as background item
                };
            }
        }
    });
};

// Helper function to format item price with currency icons
const formatItemPrice = (price) => {
    const parts = [];
    if (price.platinum > 0) {
        parts.push(
            <span key="platinum" className="currency-part">
                <span className="currency-number">{price.platinum}</span>
                <img
                    src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_04.jpg"
                    alt="Platinum"
                    className="currency-coin-small"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23e5e4e2"/></svg>';
                    }}
                />
            </span>
        );
    }
    if (price.gold > 0) {
        parts.push(
            <span key="gold" className="currency-part">
                <span className="currency-number">{price.gold}</span>
                <img
                    src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg"
                    alt="Gold"
                    className="currency-coin-small"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
                    }}
                />
            </span>
        );
    }
    if (price.silver > 0) {
        parts.push(
            <span key="silver" className="currency-part">
                <span className="currency-number">{price.silver}</span>
                <img
                    src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_03.jpg"
                    alt="Silver"
                    className="currency-coin-small"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
                    }}
                />
            </span>
        );
    }
    if (price.copper > 0) {
        parts.push(
            <span key="copper" className="currency-part">
                <span className="currency-number">{price.copper}</span>
                <img
                    src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
                    alt="Copper"
                    className="currency-coin-small"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
                    }}
                />
            </span>
        );
    }

    if (parts.length === 0) {
        return (
            <span className="currency-part">
                <span className="currency-number">0</span>
                <img
                    src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
                    alt="Copper"
                    className="currency-coin-small"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
                    }}
                />
            </span>
        );
    }

    return parts;
};

const Step10EquipmentSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    // Initialize starting currency and selected equipment
    const [currentCurrency, setCurrentCurrency] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });

    // Calculate starting currency when relevant character data changes - reset completely
    useEffect(() => {
        if (characterData.background && characterData.path) {
            const startingCurrency = calculateStartingCurrency(
                characterData.background,
                characterData.path
            );
            setCurrentCurrency(startingCurrency);

            // Only preserve remaining currency if it's from the same character build
            // For now, we'll reset currency when any choice changes to ensure consistency
        }
    }, [characterData.background, characterData.path, characterData.class, characterData.race, characterData.subrace]);

    // Handle equipment when relevant character data changes - reset completely
    useEffect(() => {
        if (characterData.background) {
            // Add new background equipment - start fresh when any choice changes
            const backgroundEquipment = getBackgroundEquipmentAsSelected(characterData);
            setSelectedEquipment(backgroundEquipment);
        }
    }, [characterData.background, characterData.class, characterData.race, characterData.subrace, characterData.path]);

    // Get available items based on character selections (excluding containers)
    const availableItems = useMemo(() => {
        const items = getAvailableStartingItems(characterData);
        // Filter out containers - players shouldn't be able to purchase these
        return items.filter(item => item.type !== 'container');
    }, [characterData.class, characterData.race, characterData.subrace, characterData.path, characterData.background]);

    // Get items organized by category
    const itemsByCategory = useMemo(() => {
        return getItemsByCategory(characterData);
    }, [characterData.class, characterData.race, characterData.subrace, characterData.path, characterData.background]);

    // Filter items based on selected category and search
    const filteredItems = useMemo(() => {
        let items = selectedCategory === 'all' 
            ? availableItems 
            : itemsByCategory[selectedCategory] || [];

        if (searchTerm) {
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return items;
    }, [availableItems, itemsByCategory, selectedCategory, searchTerm]);

    // Calculate total cost of selected items (accounting for quantities)
    const totalCost = useMemo(() => {
        return selectedEquipment.reduce((total, item) => {
            // Skip background equipment (free items) or items without value
            if (!item.value) return total;
            const quantity = item.quantity || 1;
            return total + (calculateTotalCopper(item.value) * quantity);
        }, 0);
    }, [selectedEquipment]);

    // Handle purchasing an item
    const handlePurchaseItem = (item) => {
        if (!currentCurrency) {
            alert('Currency not yet calculated!');
            return;
        }

        // Check if item has a value (not free background equipment)
        if (!item.value) {
            alert('This item is already included with your background!');
            return;
        }

        const newCurrency = subtractCurrency(currentCurrency, item.value);

        if (newCurrency === null) {
            // Insufficient funds
            alert('Insufficient funds!');
            return;
        }

        // Check if item is stackable (check the stackable property directly)
        const isStackable = item.stackable === true;

        if (isStackable) {
            // Try to find existing stack of the same item
            const existingIndex = selectedEquipment.findIndex(
                existing => existing.name === item.name &&
                           existing.type === item.type &&
                           existing.quality === item.quality
            );

            if (existingIndex >= 0) {
                // Stack with existing item
                const updatedEquipment = [...selectedEquipment];
                const existingItem = updatedEquipment[existingIndex];
                const currentQuantity = existingItem.quantity || 1;
                const maxStackSize = item.maxStackSize || 99;

                if (currentQuantity < maxStackSize) {
                    // Add to existing stack
                    updatedEquipment[existingIndex] = {
                        ...existingItem,
                        quantity: currentQuantity + 1
                    };
                    setCurrentCurrency(newCurrency);
                    setSelectedEquipment(updatedEquipment);
                    return;
                } else {
                    // Stack is full, create new stack
                    const newItem = { ...item, quantity: 1 };
                    setCurrentCurrency(newCurrency);
                    setSelectedEquipment([...selectedEquipment, newItem]);
                    return;
                }
            } else {
                // First purchase of this item, add with quantity 1
                const newItem = { ...item, quantity: 1 };
                setCurrentCurrency(newCurrency);
                setSelectedEquipment([...selectedEquipment, newItem]);
                return;
            }
        }

        // Non-stackable items are added as separate instances
        setCurrentCurrency(newCurrency);
        setSelectedEquipment([...selectedEquipment, item]);
    };

    // Handle refunding an item
    const handleRefundItem = (index) => {
        if (!currentCurrency) return;

        const item = selectedEquipment[index];

        // Don't allow refunding background equipment (free items)
        if (!item.value) {
            alert('Background equipment cannot be refunded!');
            return;
        }

        const quantity = item.quantity || 1;

        // Refund only one item from the stack
        const newCurrency = addCurrency(currentCurrency, item.value);

        if (quantity > 1) {
            // Reduce stack by 1
            const updatedEquipment = [...selectedEquipment];
            updatedEquipment[index] = {
                ...item,
                quantity: quantity - 1
            };
            setCurrentCurrency(newCurrency);
            setSelectedEquipment(updatedEquipment);
        } else {
            // Remove the item entirely
            setCurrentCurrency(newCurrency);
            setSelectedEquipment(selectedEquipment.filter((_, i) => i !== index));
        }
    };

    // Check if item is affordable
    const canAfford = (item) => {
        if (!currentCurrency) return false;
        // Free items (background equipment) are always "affordable"
        if (!item.value) return false; // But don't show as purchasable
        return subtractCurrency(currentCurrency, item.value) !== null;
    };

    // Tooltip handlers
    const handleItemMouseEnter = (e, item) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = 300; // Item tooltip width
        const tooltipHeight = 400; // Item tooltip height (approximate)
        const margin = 15;

        // Start at mouse position
        let x = e.clientX + 15;
        let y = e.clientY - 10;

        // Check if tooltip fits at mouse position
        const fitsRight = (x + tooltipWidth) <= viewportWidth;
        const fitsBelow = (y + tooltipHeight) <= viewportHeight;

        if (!fitsRight) {
            x = e.clientX - tooltipWidth - 15;
            if (x < margin) {
                x = (viewportWidth - tooltipWidth) / 2;
            }
        }

        if (!fitsBelow) {
            y = e.clientY - tooltipHeight - 15;
            if (y < margin) {
                y = Math.max(margin, viewportHeight - tooltipHeight - margin);
            }
        }

        x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

        setTooltip({
            show: true,
            item: item,
            x: x,
            y: y
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const tooltipWidth = 300; // Item tooltip width
            const tooltipHeight = 400; // Item tooltip height (approximate)
            const margin = 15;

            // Start at mouse position
            let x = e.clientX + 15;
            let y = e.clientY - 10;

            // Check if tooltip fits at mouse position
            const fitsRight = (x + tooltipWidth) <= viewportWidth;
            const fitsBelow = (y + tooltipHeight) <= viewportHeight;

            if (!fitsRight) {
                x = e.clientX - tooltipWidth - 15;
                if (x < margin) {
                    x = (viewportWidth - tooltipWidth) / 2;
                }
            }

            if (!fitsBelow) {
                y = e.clientY - tooltipHeight - 15;
                if (y < margin) {
                    y = Math.max(margin, viewportHeight - tooltipHeight - margin);
                }
            }

            x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
            y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

            setTooltip(prev => ({
                ...prev,
                x: x,
                y: y
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    // Save to character data
    useEffect(() => {
        dispatch(wizardActionCreators.updateBasicInfo({
            selectedEquipment,
            remainingCurrency: currentCurrency
        }));
    }, [selectedEquipment, currentCurrency, dispatch]);

    return (
        <div className="equipment-selection-container">
            <div className="equipment-selection-main">
                {/* Left Panel - Available Items (Shop) */}
                <div className="equipment-shop-panel">
                    <div className="shop-panel-header">
                        <h3>Available Equipment</h3>

                        {/* Search Bar */}
                        <input
                            type="text"
                            className="equipment-search"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Category Filter */}
                        <div className="equipment-category-filter">
                            <button
                                className={selectedCategory === 'all' ? 'active' : ''}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </button>
                            <button
                                className={selectedCategory === 'weapons' ? 'active' : ''}
                                onClick={() => setSelectedCategory('weapons')}
                            >
                                Weapons
                            </button>
                            <button
                                className={selectedCategory === 'armor' ? 'active' : ''}
                                onClick={() => setSelectedCategory('armor')}
                            >
                                Armor
                            </button>
                            <button
                                className={selectedCategory === 'accessories' ? 'active' : ''}
                                onClick={() => setSelectedCategory('accessories')}
                            >
                                Accessories
                            </button>
                            <button
                                className={selectedCategory === 'consumables' ? 'active' : ''}
                                onClick={() => setSelectedCategory('consumables')}
                            >
                                Consumables
                            </button>
                            <button
                                className={selectedCategory === 'miscellaneous' ? 'active' : ''}
                                onClick={() => setSelectedCategory('miscellaneous')}
                            >
                                Misc
                            </button>
                        </div>
                    </div>

                    {/* Item Grid - Inventory Style */}
                    <div className="equipment-shop-grid">
                        {(() => {
                            const COLS = 16; // Reduced from 20 to better fit the panel
                            const grid = [];
                            const occupiedCells = new Map(); // Track occupied cells by "row,col" key

                            let currentRow = 0;
                            let currentCol = 0;

                            // Place each item in the grid
                            filteredItems.forEach((item, itemIndex) => {
                                const itemWidth = item.width || 1;
                                const itemHeight = item.height || 1;

                                // Find next available position
                                let placed = false;
                                while (!placed) {
                                    // Check if item fits at current position
                                    let fits = true;
                                    for (let r = 0; r < itemHeight; r++) {
                                        for (let c = 0; c < itemWidth; c++) {
                                            const checkRow = currentRow + r;
                                            const checkCol = currentCol + c;
                                            if (checkCol >= COLS || occupiedCells.has(`${checkRow},${checkCol}`)) {
                                                fits = false;
                                                break;
                                            }
                                        }
                                        if (!fits) break;
                                    }

                                    if (fits) {
                                        // Place the item
                                        for (let r = 0; r < itemHeight; r++) {
                                            for (let c = 0; c < itemWidth; c++) {
                                                const placeRow = currentRow + r;
                                                const placeCol = currentCol + c;
                                                occupiedCells.set(`${placeRow},${placeCol}`, {
                                                    item,
                                                    isOrigin: r === 0 && c === 0
                                                });
                                            }
                                        }
                                        placed = true;
                                    }

                                    // Move to next position
                                    currentCol++;
                                    if (currentCol >= COLS) {
                                        currentCol = 0;
                                        currentRow++;
                                    }
                                }
                            });

                            // Calculate total rows needed (minimum 10 rows to fill the space)
                            const maxRow = Math.max(...Array.from(occupiedCells.keys()).map(key => parseInt(key.split(',')[0])), -1);
                            const totalRows = Math.max(maxRow + 1, 10);

                            // Render the grid with minimum rows to fill space
                            for (let row = 0; row < totalRows; row++) {
                                const gridRow = [];
                                for (let col = 0; col < COLS; col++) {
                                    const cellData = occupiedCells.get(`${row},${col}`);
                                    const item = cellData?.item;
                                    const isOrigin = cellData?.isOrigin;

                                    const itemWidth = item?.width || 1;
                                    const itemHeight = item?.height || 1;

                                    gridRow.push(
                                        <div
                                            key={`${row}-${col}`}
                                            className={`inventory-cell ${item ? 'occupied' : ''} ${item && !canAfford(item) ? 'unaffordable' : ''}`}
                                        >
                                            {item && isOrigin && (
                                                <div
                                                    className="item-icon-wrapper"
                                                    style={{
                                                        width: `calc(${itemWidth * 100}% + ${itemWidth - 1}px)`,
                                                        height: `calc(${itemHeight * 100}% + ${itemHeight - 1}px)`,
                                                        zIndex: 2,
                                                        cursor: canAfford(item) ? 'pointer' : 'not-allowed',
                                                        opacity: canAfford(item) ? 1 : 0.5
                                                    }}
                                                    onClick={() => canAfford(item) && handlePurchaseItem(item)}
                                                    onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                                    onMouseMove={handleItemMouseMove}
                                                    onMouseLeave={handleItemMouseLeave}
                                                >
                                                    <div
                                                        className="equipment-item-icon"
                                                        style={{
                                                            backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`,
                                                            width: '100%',
                                                            height: '100%',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat',
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0
                                                        }}
                                                    />
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
                            return grid;
                        })()}
                    </div>
                </div>

                {/* Right Panel - Selected Items (Cart) */}
                <div className="equipment-cart-panel">
                    <div className="cart-panel-header">
                        <h3>Selected Equipment</h3>
                        <div className="cart-currency-display">
                            <div className="currency-label">Remaining:</div>
                            <div className="currency-amount">{formatCurrency(currentCurrency)}</div>
                        </div>
                    </div>


                    {/* Cart Grid - Inventory Style */}
                    <div className={`equipment-cart-grid ${selectedEquipment.length === 0 ? 'empty' : ''}`}>
                        {selectedEquipment.length === 0 ? (
                            <div className="cart-empty-message">
                                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.7 }}>📦</div>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>No items selected yet</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Click items on the left to purchase them</div>
                            </div>
                        ) : (
                            (() => {
                                const COLS = 12;
                                const grid = [];
                                const occupiedCells = new Map(); // Track occupied cells by "row,col" key

                                let currentRow = 0;
                                let currentCol = 0;

                                // Place each item in the grid
                                selectedEquipment.forEach((item, itemIndex) => {
                                    const itemWidth = item.width || 1;
                                    const itemHeight = item.height || 1;

                                    // Find next available position
                                    let placed = false;
                                    while (!placed) {
                                        // Check if item fits at current position
                                        let fits = true;
                                        for (let r = 0; r < itemHeight; r++) {
                                            for (let c = 0; c < itemWidth; c++) {
                                                const checkRow = currentRow + r;
                                                const checkCol = currentCol + c;
                                                if (checkCol >= COLS || occupiedCells.has(`${checkRow},${checkCol}`)) {
                                                    fits = false;
                                                    break;
                                                }
                                            }
                                            if (!fits) break;
                                        }

                                        if (fits) {
                                            // Place the item
                                            for (let r = 0; r < itemHeight; r++) {
                                                for (let c = 0; c < itemWidth; c++) {
                                                    const placeRow = currentRow + r;
                                                    const placeCol = currentCol + c;
                                                    occupiedCells.set(`${placeRow},${placeCol}`, {
                                                        item,
                                                        isOrigin: r === 0 && c === 0,
                                                        itemIndex
                                                    });
                                                }
                                            }
                                            placed = true;
                                        }

                                        // Move to next position
                                        currentCol++;
                                        if (currentCol >= COLS) {
                                            currentCol = 0;
                                            currentRow++;
                                        }
                                    }
                                });

                                // Calculate total rows needed (minimum 10 rows to fill the space)
                                const maxRow = Math.max(...Array.from(occupiedCells.keys()).map(key => parseInt(key.split(',')[0])), -1);
                                const totalRows = Math.max(maxRow + 1, 10);

                                // Render the grid with minimum rows to fill space
                                for (let row = 0; row < totalRows; row++) {
                                    const gridRow = [];
                                    for (let col = 0; col < COLS; col++) {
                                        const cellData = occupiedCells.get(`${row},${col}`);
                                        const item = cellData?.item;
                                        const isOrigin = cellData?.isOrigin;
                                        const originalIndex = cellData?.itemIndex;

                                        const itemWidth = item?.width || 1;
                                        const itemHeight = item?.height || 1;

                                        gridRow.push(
                                            <div
                                                key={`${row}-${col}`}
                                                className={`inventory-cell ${item ? 'occupied' : ''}`}
                                            >
                                                {item && isOrigin && (
                                                    <div
                                                        className="item-icon-wrapper"
                                                        style={{
                                                            width: `calc(${itemWidth * 100}% + ${itemWidth - 1}px)`,
                                                            height: `calc(${itemHeight * 100}% + ${itemHeight - 1}px)`,
                                                            zIndex: 2,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleRefundItem(originalIndex)}
                                                        onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                                        onMouseMove={handleItemMouseMove}
                                                        onMouseLeave={handleItemMouseLeave}
                                                    >
                                                        <div
                                                            className="equipment-item-icon"
                                                            style={{
                                                                backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`,
                                                                width: '100%',
                                                                height: '100%',
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                backgroundRepeat: 'no-repeat',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0
                                                            }}
                                                        />
                                                        {/* Quantity display for stacked items */}
                                                        {item.quantity && item.quantity > 1 && (
                                                            <div
                                                                className="item-quantity"
                                                                style={{
                                                                    position: 'absolute',
                                                                    bottom: '2px',
                                                                    right: '2px',
                                                                    background: 'rgba(0, 0, 0, 0.8)',
                                                                    color: 'white',
                                                                    fontSize: '0.7rem',
                                                                    padding: '2px 4px',
                                                                    borderRadius: '4px',
                                                                    minWidth: '16px',
                                                                    textAlign: 'center',
                                                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                                                                    fontWeight: 'bold',
                                                                    pointerEvents: 'none',
                                                                    zIndex: 3
                                                                }}
                                                            >
                                                                {item.quantity}
                                                            </div>
                                                        )}
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
                                return grid;
                            })()
                        )}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-summary-row">
                            <span>Items Selected:</span>
                            <span>
                                {selectedEquipment.reduce((total, item) => total + (item.quantity || 1), 0)}
                                {selectedEquipment.length !== selectedEquipment.reduce((total, item) => total + (item.quantity || 1), 0) &&
                                    ` (${selectedEquipment.length} stacks)`
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip.show && tooltip.item && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(10px, -50%)',
                        pointerEvents: 'none',
                        zIndex: 999999999
                    }}
                >
                    <ItemTooltip item={tooltip.item} />
                </div>
            )}
        </div>
    );
};

export default Step10EquipmentSelection;