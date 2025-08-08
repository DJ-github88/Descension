import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useInventoryStore from '../../store/inventoryStore';
import WowWindow from '../windows/WowWindow';
import ItemWizard from './ItemWizard';
import CategoryDialog from './CategoryDialog';
import ItemTooltip from './ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemCard from './ItemCard';
import ItemContextMenu from './ItemContextMenu';
import CategoryContextMenu from './CategoryContextMenu';
import CategorizeModal from './CategorizeModal';
import QuickItemGeneratorModal from './QuickItemGeneratorModal';
import ContainerWizard from './ContainerWizard';
import ContainerWindow from './ContainerWindow';
import ItemGeneration from './ItemGeneration';
import RecipeWizard from '../crafting/RecipeWizard';
import ExternalRecipePreview from '../crafting/ExternalRecipePreview';
import '../../styles/item-library.css';
import '../../styles/quick-item-wizard.css';
import '../../styles/enhanced-quick-item-wizard.css';
import '../../styles/item-card.css';
import { STEPS, getStepOrder } from './wizardSteps';
import { WEAPON_SUBTYPES } from './weaponTypes';
import { RARITY_COLORS } from '../../constants/itemConstants';

const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const CategoryTree = ({ categories, selectedCategory, onSelect, onAddSubcategory, onDelete, onDrop }) => {
    const [contextMenu, setContextMenu] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const getChildCategories = (parentId) =>
        categories.filter(c => c.parentId === parentId);

    const handleContextMenu = (e, category) => {
        e.preventDefault();

        // Calculate position to ensure context menu stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Use pageX and pageY for absolute positioning
        const x = e.pageX;
        const y = e.pageY;

        // Default menu dimensions
        const menuWidth = 200;
        const menuHeight = 150;

        // Calculate position to ensure menu stays within viewport
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

        setContextMenu({
            x: posX,
            y: posY,
            category
        });
    };

    const toggleExpand = (categoryId, e) => {
        e.stopPropagation();
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = () => closeContextMenu();
        if (contextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu]);

    const renderCategory = (category) => {
        const children = getChildCategories(category.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedCategories.has(category.id);

        return (
            <div
                key={category.id}
                className={`category ${selectedCategory === category.id ? 'selected' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(category.id);
                }}
                onContextMenu={(e) => handleContextMenu(e, category)}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    onDrop(data, category.id);
                }}
                style={{ cursor: 'pointer' }}
            >
                <div className="category-header">
                    <div className="category-icon-name">
                        {hasChildren && (
                            <button
                                className={`category-expand-button ${isExpanded ? 'expanded' : ''}`}
                                onClick={(e) => toggleExpand(category.id, e)}
                            >
                                <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                            </button>
                        )}
                        {category.icon && (
                            <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${category.icon}.jpg`}
                                alt={category.name}
                                className="category-icon"
                                onError={(e) => {
                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                }}
                            />
                        )}
                        <span className="category-name">{category.name}</span>
                    </div>
                    <div className="category-tooltip">{category.name}</div>
                    {!category.isBaseCategory && (
                        <div className="category-actions">
                            <button
                                className="category-action-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddSubcategory(category.id);
                                }}
                                title="Add Subcategory"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                            <button
                                className="category-action-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(category.id);
                                }}
                                title="Delete Category"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <div className="category-children">
                        {children.map(child => renderCategory(child))}
                    </div>
                )}
            </div>
        );
    };

    const rootCategories = categories.filter(c => !c.parentId);

    return (
        <div className="categories-section">
            <div className="categories-header">Categories</div>
            <button
                className="new-category-button"
                onClick={() => onAddSubcategory(null)}
            >
                <i className="fas fa-plus"></i>
                New Category
            </button>
            <div className="categories-list">
                {rootCategories.map(category => renderCategory(category))}
            </div>
            {contextMenu && createPortal(
                <CategoryContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    category={contextMenu.category}
                    onClose={closeContextMenu}
                />,
                document.body
            )}
        </div>
    );
};

// Using the imported ItemCard component instead of defining it inline

const ItemLibrary = ({ onClose, contentOnly = false }) => {
    const [activeTab, setActiveTab] = useState('library');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [newCategoryParentId, setNewCategoryParentId] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [showItemWizard, setShowItemWizard] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showQuickItemGenerator, setShowQuickItemGenerator] = useState(false);
    const [showContainerWizard, setShowContainerWizard] = useState(false);
    const [showRecipeWizard, setShowRecipeWizard] = useState(false);
    const [recipeWizardPosition, setRecipeWizardPosition] = useState({ x: 150, y: 50 });
    const [recipeWizardSize, setRecipeWizardSize] = useState({ width: 800, height: 600 });
    const [recipeData, setRecipeData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [qualityFilter, setQualityFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showCategorizeModal, setShowCategorizeModal] = useState(false);
    const [categorizeModalData, setCategorizeModalData] = useState(null);

    const {
        items,
        categories,
        itemCategories,
        selectItem,
        selectCategory,
        removeItem,
        addCategory,
        deleteCategory,
        moveItem,
        moveCategory,
        addItem,
        updateItem,
        activeView,
        setActiveView,
        openContainers,
        toggleContainerOpen
    } = useItemStore();

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const [position] = useState(() => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const width = Math.min(800, windowWidth * 0.9);
        const height = Math.min(600, windowHeight * 0.8);
        return {
            x: (windowWidth - width) / 2,
            y: (windowHeight - height) / 4
        };
    });
    const containerRef = useRef(null);

    // Drag handling is now managed by WowWindow

    const handleDeleteItem = (itemId) => {
        removeItem(itemId);
        setContextMenu(null);
        if (selectedItem === itemId) {
            setSelectedItem(null);
        }
    };

    const handleAddCategory = (parentId) => {
        setNewCategoryParentId(parentId);
        setShowCategoryDialog(true);
    };

    const handleCreateCategory = (categoryData) => {
        const newCategory = {
            name: categoryData.name,
            parentId: categoryData.parentId,
            icon: categoryData.icon
        };
        addCategory(newCategory);
        setShowCategoryDialog(false);
    };

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(categoryId);
            if (selectedCategory === categoryId) {
                setSelectedCategory(null);
            }
        }
    };

    const handleDrop = (data, targetCategoryId) => {
        if (data.type === 'item') {
            moveItem(data.id, targetCategoryId);
        }
    };

    const handleAddToInventory = (itemId, quantity) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            const inventoryStore = useInventoryStore.getState();
            inventoryStore.addItemFromLibrary(item, { quantity: quantity });
        }
    };

    const handleItemContextMenu = (e, itemId) => {
        e.preventDefault();

        try {
            // Verify the item exists before showing the context menu
            const item = items.find(item => item.id === itemId);
            if (!item) {
                console.error('Item not found for context menu:', itemId);
                return; // Don't show context menu if item doesn't exist
            }

            // Calculate position to ensure context menu stays within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Use pageX and pageY for absolute positioning
            const x = e.pageX;
            const y = e.pageY;

            // Default menu dimensions
            const menuWidth = 200;
            const menuHeight = 150;

            // Calculate position to ensure menu stays within viewport
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

            // Pre-validate the item to ensure it has all required properties
            const validatedItem = {
                ...item,
                id: item.id || crypto.randomUUID(),
                name: item.name || 'Unnamed Item',
                type: item.type || 'miscellaneous',
                quality: item.quality || 'common',
                baseStats: item.baseStats || {},
                combatStats: item.combatStats || {},
                utilityStats: item.utilityStats || {}
            };

            setContextMenu({
                type: 'item',
                x: posX,
                y: posY,
                itemId,
                categoryId: selectedCategory,
                validatedItem // Store the validated item in the context menu state
            });
        } catch (error) {
            console.error('Error showing context menu:', error);
            // Don't show context menu if there's an error
        }
    };

    const handleEditItem = (itemId) => {
        const itemToEdit = items.find(item => item.id === itemId);
        if (itemToEdit) {
            // Format weapon data for editing
            const formattedItem = {
                ...itemToEdit,
                // For weapons, determine slot type and hand
                weaponSlot: itemToEdit.type === 'weapon' ? (
                    itemToEdit.slots?.includes('mainHand') && itemToEdit.slots?.includes('offHand')
                        ? 'TWO_HANDED'
                        : itemToEdit.slots?.includes('ranged')
                            ? 'RANGED'
                            : 'ONE_HANDED'
                ) : null,
                hand: itemToEdit.type === 'weapon' ? (
                    itemToEdit.slots?.includes('mainHand')
                        ? 'MAIN_HAND'
                        : itemToEdit.slots?.includes('offHand')
                            ? 'OFF_HAND'
                            : itemToEdit.slots?.includes('ranged')
                                ? null
                                : 'ONE_HAND'
                ) : null,
                // Ensure slots array exists and contains all slots
                slots: itemToEdit.slots || [],
                // Ensure subtype is properly formatted
                subtype: itemToEdit.type === 'weapon' ? (
                    // Convert subtype to uppercase for matching with WEAPON_SUBTYPES
                    Object.keys(WEAPON_SUBTYPES).find(key =>
                        WEAPON_SUBTYPES[key].name.toLowerCase() === (itemToEdit.subtype || '').toLowerCase()
                    ) || Object.keys(WEAPON_SUBTYPES)[0] // Default to first weapon type if not found
                ) : itemToEdit.subtype,
                // For weapons, ensure weaponStats are properly structured
                weaponStats: itemToEdit.type === 'weapon' ? {
                    baseDamage: {
                        diceCount: parseInt(itemToEdit.weaponStats?.baseDamage?.diceCount) || 1,
                        diceType: (itemToEdit.weaponStats?.baseDamage?.diceType || 'd6').toString().toLowerCase(),
                        damageType: itemToEdit.weaponStats?.baseDamage?.damageType || 'slashing',
                        bonusDamage: parseInt(itemToEdit.weaponStats?.baseDamage?.bonusDamage) || 0,
                        bonusDamageType: itemToEdit.weaponStats?.baseDamage?.bonusDamageType || ''
                    }
                } : undefined,
                // Ensure all stats have proper structure
                baseStats: {
                    constitution: { value: parseInt(itemToEdit.baseStats?.constitution?.value) || 0, isPercentage: itemToEdit.baseStats?.constitution?.isPercentage || false },
                    strength: { value: parseInt(itemToEdit.baseStats?.strength?.value) || 0, isPercentage: itemToEdit.baseStats?.strength?.isPercentage || false },
                    agility: { value: parseInt(itemToEdit.baseStats?.agility?.value) || 0, isPercentage: itemToEdit.baseStats?.agility?.isPercentage || false },
                    intelligence: { value: parseInt(itemToEdit.baseStats?.intelligence?.value) || 0, isPercentage: itemToEdit.baseStats?.intelligence?.isPercentage || false },
                    spirit: { value: parseInt(itemToEdit.baseStats?.spirit?.value) || 0, isPercentage: itemToEdit.baseStats?.spirit?.isPercentage || false },
                    charisma: { value: parseInt(itemToEdit.baseStats?.charisma?.value) || 0, isPercentage: itemToEdit.baseStats?.charisma?.isPercentage || false }
                },
                combatStats: {
                    healthRestore: { value: parseInt(itemToEdit.combatStats?.healthRestore?.value) || 0, isPercentage: itemToEdit.combatStats?.healthRestore?.isPercentage || false },
                    manaRestore: { value: parseInt(itemToEdit.combatStats?.manaRestore?.value) || 0, isPercentage: itemToEdit.combatStats?.manaRestore?.isPercentage || false },
                    piercingDamage: { value: parseInt(itemToEdit.combatStats?.piercingDamage?.value) || 0, isPercentage: itemToEdit.combatStats?.piercingDamage?.isPercentage || false },
                    bludgeoningDamage: { value: parseInt(itemToEdit.combatStats?.bludgeoningDamage?.value) || 0, isPercentage: itemToEdit.combatStats?.bludgeoningDamage?.isPercentage || false },
                    slashingDamage: { value: parseInt(itemToEdit.combatStats?.slashingDamage?.value) || 0, isPercentage: itemToEdit.combatStats?.slashingDamage?.isPercentage || false },
                    healingReceived: { value: parseInt(itemToEdit.combatStats?.healingReceived?.value) || 0, isPercentage: itemToEdit.combatStats?.healingReceived?.isPercentage || false },
                    healingPower: { value: parseInt(itemToEdit.combatStats?.healingPower?.value) || 0, isPercentage: itemToEdit.combatStats?.healingPower?.isPercentage || false },
                    maxAP: { value: parseInt(itemToEdit.combatStats?.maxAP?.value) || 0, isPercentage: itemToEdit.combatStats?.maxAP?.isPercentage || false },
                    maxHealth: { value: parseInt(itemToEdit.combatStats?.maxHealth?.value) || 0, isPercentage: itemToEdit.combatStats?.maxHealth?.isPercentage || false },
                    healthRegen: { value: parseInt(itemToEdit.combatStats?.healthRegen?.value) || 0, isPercentage: itemToEdit.combatStats?.healthRegen?.isPercentage || false },
                    maxMana: { value: parseInt(itemToEdit.combatStats?.maxMana?.value) || 0, isPercentage: itemToEdit.combatStats?.maxMana?.isPercentage || false },
                    manaRegen: { value: parseInt(itemToEdit.combatStats?.manaRegen?.value) || 0, isPercentage: itemToEdit.combatStats?.manaRegen?.isPercentage || false },
                    initiative: { value: parseInt(itemToEdit.combatStats?.initiative?.value) || 0, isPercentage: itemToEdit.combatStats?.initiative?.isPercentage || false },
                    armorClass: { value: parseInt(itemToEdit.combatStats?.armorClass?.value) || 0, isPercentage: itemToEdit.combatStats?.armorClass?.isPercentage || false },

                    spellDamage: {
                        types: itemToEdit.combatStats?.spellDamage?.types || {}
                    },
                    resistances: itemToEdit.combatStats?.resistances || {}
                },
                utilityStats: {
                    movementSpeed: { value: parseInt(itemToEdit.utilityStats?.movementSpeed?.value) || 0, isPercentage: itemToEdit.utilityStats?.movementSpeed?.isPercentage || false },
                    carryingCapacity: { enabled: itemToEdit.utilityStats?.carryingCapacity?.enabled || false, slots: parseInt(itemToEdit.utilityStats?.carryingCapacity?.slots) || 1 },
                    duration: {
                        type: itemToEdit.utilityStats?.duration?.type || 'ROUNDS',
                        value: parseInt(itemToEdit.utilityStats?.duration?.value) || 1
                    }
                }
            };

            // For weapons, ensure the slots array matches the weapon type
            if (itemToEdit.type === 'weapon') {
                if (formattedItem.weaponSlot === 'TWO_HANDED') {
                    formattedItem.slots = ['mainHand', 'offHand'];
                } else if (formattedItem.weaponSlot === 'RANGED') {
                    formattedItem.slots = ['ranged'];
                } else if (formattedItem.hand === 'MAIN_HAND') {
                    formattedItem.slots = ['mainHand'];
                } else if (formattedItem.hand === 'OFF_HAND') {
                    formattedItem.slots = ['offHand'];
                }
            }

            setEditingItem(formattedItem);
            setShowItemWizard(true);
        }
    };

    const handleShowCategorizeModal = (itemId, categoryId, x, y) => {
        setCategorizeModalData({ itemId, categoryId, x, y });
        setShowCategorizeModal(true);
    };

    const handleItemWizardComplete = (newItemData) => {
        console.log('=== ItemLibrary: handleItemWizardComplete called ===');
        console.log('New item data:', newItemData);
        console.log('Current categories:', categories);
        console.log('Selected category:', selectedCategory);

        if (editingItem) {
            console.log('Editing existing item:', editingItem.id);
            updateItem(editingItem.id, {
                ...editingItem,
                ...newItemData
            });
            setEditingItem(null);
        } else {
            // For new items, find the base "All Items" category
            const baseCategory = categories.find(c => c.isBaseCategory)?.id;
            console.log('Base "All Items" category:', baseCategory);

            // Add to both the base category and the selected category if one exists
            const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];
            console.log('Target categories for new item:', targetCategories);

            addItem(newItemData, targetCategories);
            console.log('Called addItem with categories:', targetCategories);
        }
        setShowItemWizard(false);
    };

    const getCurrentItems = () => {

        let filteredItems = items.filter(item => {
            // Category filter
            if (selectedCategory) {
                const itemCats = itemCategories[item.id];
                if (!itemCats) {
                    const isInBaseCategory = selectedCategory === categories.find(c => c.isBaseCategory)?.id;
                    if (!isInBaseCategory) return false;
                } else {
                    const isInCategory = Array.isArray(itemCats) ? itemCats.includes(selectedCategory) : false;
                    if (!isInCategory) return false;
                }
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const nameMatch = item.name.toLowerCase().includes(query);
                const descMatch = item.description?.toLowerCase().includes(query);
                const typeMatch = item.type?.toLowerCase().includes(query);
                const subtypeMatch = item.subtype?.toLowerCase().includes(query);

                // Check stats for search
                let statsMatch = false;
                if (item.baseStats) {
                    statsMatch = Object.keys(item.baseStats).some(stat =>
                        stat.toLowerCase().includes(query)
                    );
                }

                if (!nameMatch && !descMatch && !typeMatch && !subtypeMatch && !statsMatch) {
                    return false;
                }
            }

            // Quality filter
            if (qualityFilter && item.quality !== qualityFilter) {
                return false;
            }

            // Type filter
            if (typeFilter && item.type !== typeFilter) {
                return false;
            }

            return true;
        });

        // Remove duplicates based on item ID
        const uniqueItems = filteredItems.filter((item, index, self) =>
            index === self.findIndex(i => i.id === item.id)
        );


        return uniqueItems;
    };

    // Get unique item types and qualities for filter options
    const getFilterOptions = () => {
        const types = new Set();
        const qualities = new Set();

        items.forEach(item => {
            if (item.type) types.add(item.type);
            if (item.quality) qualities.add(item.quality);
        });

        return {
            types: Array.from(types).sort(),
            qualities: Array.from(qualities).sort()
        };
    };

    const filterOptions = getFilterOptions();

    const handleMoveToCategory = (itemId, targetCategoryId) => {
        if (targetCategoryId) {
            moveItem(itemId, targetCategoryId);
            setContextMenu(null);
        }
    };

    const handleContainerCreate = () => {
        setShowContainerWizard(true);
    };

    const renderContent = () => (
        <div className="item-library-main-container">
            {/* Navigation sidebar like character sheet */}
            <div className="item-library-navigation">
                <button
                    className={`item-library-nav-button ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    <img src="/icons/book.png" alt="" className="item-library-nav-icon" />
                    <span className="item-library-nav-text">Library</span>
                </button>
                <button
                    className={`item-library-nav-button ${activeTab === 'designer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('designer')}
                >
                    <img src="/icons/hammer.png" alt="" className="item-library-nav-icon" />
                    <span className="item-library-nav-text">Designer</span>
                </button>
            </div>

            {/* Content area */}
            <div
                ref={containerRef}
                className={`item-library-container ${activeTab === 'designer' ? 'designer-mode' : 'library-mode'}`}
            >

            <div className="item-library-content">

                {/* Tab Content */}
                {activeTab === 'library' ? (
                    <div className="item-library-main-container">
                        <div className="item-library-sidebar">
                            <CategoryTree
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelect={setSelectedCategory}
                                onAddSubcategory={handleAddCategory}
                                onDelete={handleDeleteCategory}
                                onDrop={handleDrop}
                            />
                        </div>
                        <div className="item-library-main">
                            {/* Library Header - matching shop window style */}
                            <div className="library-window-header">
                                <div className="library-info">
                                    <span className="library-title">
                                        {selectedCategory ?
                                            categories.find(c => c.id === selectedCategory)?.name :
                                        'All Items'}
                                    </span>
                                </div>

                                {/* Header Filters */}
                                <div className="header-filters">
                                    <input
                                        type="text"
                                        placeholder="Search all items..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="header-filter-input"
                                    />
                                    <select
                                        value={qualityFilter}
                                        onChange={(e) => setQualityFilter(e.target.value)}
                                        className="header-filter-select"
                                    >
                                        <option value="">All Qualities</option>
                                        {filterOptions.qualities.map(quality => (
                                            <option key={quality} value={quality}>
                                                {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="header-filter-select"
                                    >
                                        <option value="">All Types</option>
                                        {filterOptions.types.map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setQualityFilter('');
                                            setTypeFilter('');
                                        }}
                                        className="header-reset-btn"
                                        title="Reset filters"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowRecipeWizard(true)}
                                        className="header-action-btn recipe-wizard-btn"
                                        title="Create Recipe"
                                    >
                                        <i className="fas fa-scroll"></i>
                                        Recipe
                                    </button>
                                </div>

                                <div className="action-buttons">
                                    <button
                                        onClick={() => {
                                            const { resetToComprehensiveItems } = useItemStore.getState();
                                            resetToComprehensiveItems();
                                        }}
                                        className="action-btn"
                                        title="Load comprehensive item library"
                                    >
                                        <i className="fas fa-refresh"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowQuickItemGenerator(true)}
                                        className="action-btn primary"
                                        title="Quick item creation"
                                    >
                                        <i className="fas fa-magic"></i>
                                    </button>
                                </div>
                            </div>
                            <div className={`item-grid ${activeView === 'list' ? 'list-view' : ''}`}>
                                {getCurrentItems().length === 0 ? (
                                    <div className="item-library-empty">
                                        <div className="item-library-empty-icon">
                                            <i className="fas fa-box-open"></i>
                                        </div>
                                        <div className="item-library-empty-text">No items in this category</div>
                                        <div className="item-library-empty-subtext">
                                            Try selecting a different category or create new items using Quick Create
                                        </div>
                                    </div>
                                ) : (
                                    getCurrentItems().map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedItem === item.id}
                                            onClick={() => setSelectedItem(item.id)}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                handleItemContextMenu(e, item.id);
                                            }}
                                            onDragOver={(e, containerItem) => {
                                                // Only handle drag over for container items
                                                if (containerItem.type !== 'container') return;

                                                // Add visual feedback for drag over
                                                e.currentTarget.classList.add('container-drag-over');
                                            }}
                                            onDrop={(e, containerItem) => {
                                                // Only handle drop for container items
                                                if (containerItem.type !== 'container') return;

                                                // Remove visual feedback
                                                e.currentTarget.classList.remove('container-drag-over');

                                                try {
                                                    // Get the dragged item data
                                                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

                                                    // Only handle drops of items from the library
                                                    if (data.type === 'item') {
                                                        console.log('Item dropped onto container:', data);

                                                        // Get the dragged item
                                                        const draggedItem = items.find(item => item.id === data.id);

                                                        // Don't allow dropping a container into itself or another container
                                                        if (draggedItem && draggedItem.type !== 'container') {
                                                            console.log('Adding item to container:', draggedItem.name);

                                                            // Open the container if it's not already open
                                                            if (!openContainers.has(containerItem.id)) {
                                                                toggleContainerOpen(containerItem.id);
                                                            }

                                                            // Get container properties or initialize with defaults
                                                            const containerProps = containerItem.containerProperties || {
                                                                gridSize: { rows: 4, cols: 6 },
                                                                items: [],
                                                                isLocked: false
                                                            };

                                                            // Find a valid position for the item in the container
                                                            const findValidPosition = (items, width, height, rotation, gridSize) => {
                                                                const rows = gridSize.rows || 4;
                                                                const cols = gridSize.cols || 6;

                                                                // Calculate effective dimensions based on rotation
                                                                const effectiveWidth = rotation === 1 ? height : width;
                                                                const effectiveHeight = rotation === 1 ? width : height;

                                                                // Try each position in the grid
                                                                for (let row = 0; row < rows; row++) {
                                                                    for (let col = 0; col < cols; col++) {
                                                                        // Check if the item fits within the grid
                                                                        if (row + effectiveHeight > rows || col + effectiveWidth > cols) {
                                                                            continue;
                                                                        }

                                                                        // Check if the position overlaps with any other item
                                                                        let isValid = true;
                                                                        for (const item of items) {
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
                                                                                isValid = false;
                                                                                break;
                                                                            }
                                                                        }

                                                                        if (isValid) {
                                                                            return { row, col };
                                                                        }
                                                                    }
                                                                }

                                                                // If no valid position found, return default position
                                                                return { row: 0, col: 0 };
                                                            };

                                                            // Get item dimensions
                                                            let width = draggedItem.width || 1;
                                                            let height = draggedItem.height || 1;
                                                            const rotation = draggedItem.rotation || 0;

                                                            // If dimensions aren't explicitly set, determine them based on item type
                                                            if (!draggedItem.width || !draggedItem.height) {
                                                                if (draggedItem.type === 'weapon') {
                                                                    if (draggedItem.subtype === 'GREATSWORD' || draggedItem.subtype === 'GREATAXE' ||
                                                                        draggedItem.subtype === 'MAUL' || draggedItem.subtype === 'POLEARM') {
                                                                        // Two-handed weapons are longer and wider
                                                                        width = 2;
                                                                        height = 4;
                                                                    } else if (draggedItem.subtype === 'STAFF') {
                                                                        // Staves are long but thin
                                                                        width = 1;
                                                                        height = 4;
                                                                    } else if (draggedItem.subtype === 'SWORD' || draggedItem.subtype === 'AXE' || draggedItem.subtype === 'MACE') {
                                                                        // One-handed weapons are medium length
                                                                        width = 1;
                                                                        height = 2;
                                                                    } else if (draggedItem.subtype === 'DAGGER') {
                                                                        // Daggers are small
                                                                        width = 1;
                                                                        height = 1;
                                                                    } else if (draggedItem.subtype === 'BOW' || draggedItem.subtype === 'CROSSBOW') {
                                                                        // Bows are wider
                                                                        width = 2;
                                                                        height = 3;
                                                                    }
                                                                } else if (draggedItem.type === 'armor') {
                                                                    if (draggedItem.subtype === 'PLATE') {
                                                                        // Plate armor takes more space
                                                                        width = 2;
                                                                        height = 2;
                                                                    } else if (draggedItem.subtype === 'MAIL') {
                                                                        // Mail armor is slightly smaller
                                                                        width = 2;
                                                                        height = 2;
                                                                    } else if (draggedItem.subtype === 'LEATHER') {
                                                                        // Leather armor is more compact
                                                                        width = 1;
                                                                        height = 2;
                                                                    } else if (draggedItem.subtype === 'CLOTH') {
                                                                        // Cloth armor is the most compact
                                                                        width = 1;
                                                                        height = 1;
                                                                    }
                                                                }
                                                            }

                                                            // Find a valid position for the item
                                                            const position = findValidPosition(
                                                                containerProps.items || [],
                                                                width,
                                                                height,
                                                                rotation,
                                                                containerProps.gridSize || { rows: 4, cols: 6 }
                                                            );

                                                            // Create a copy of the item for the container with a new ID
                                                            const itemForContainer = {
                                                                ...JSON.parse(JSON.stringify(draggedItem)),
                                                                id: Date.now().toString(), // Generate a new ID
                                                                position: position, // Use the found position
                                                                width: width, // Set the width
                                                                height: height, // Set the height
                                                                rotation: rotation // Set the rotation
                                                            };

                                                            // Make a deep copy of the container's items
                                                            const containerItems = JSON.parse(JSON.stringify(containerProps.items || []));

                                                            // Add the item to the container
                                                            containerItems.push(itemForContainer);

                                                            // Create updated container properties
                                                            const updatedContainerProps = {
                                                                ...JSON.parse(JSON.stringify(containerProps)),
                                                                items: containerItems,
                                                                hasHadItems: true
                                                            };

                                                            // Update container in the store
                                                            updateItem(containerItem.id, {
                                                                containerProperties: updatedContainerProps
                                                            });
                                                        }
                                                    }
                                                } catch (error) {
                                                    console.error('Error handling drop onto container:', error);
                                                }
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="item-designer-container">
                        <ItemGeneration onContainerCreate={handleContainerCreate} />
                    </div>
                )}
            </div>

            {showCategoryDialog && (
                <CategoryDialog
                    parentId={newCategoryParentId}
                    onComplete={handleCreateCategory}
                    onCancel={() => setShowCategoryDialog(false)}
                />
            )}

            {showItemWizard && (
                <ItemWizard
                    onComplete={(item) => {
                        console.log('ItemWizard onComplete called with item:', item);
                        handleItemWizardComplete(item);
                        setShowItemWizard(false);
                        setEditingItem(null);
                    }}
                    onCancel={() => {
                        setShowItemWizard(false);
                        setEditingItem(null);
                    }}
                    initialData={editingItem}
                    isEditing={!!editingItem}
                    initialStep={editingItem ? STEPS.BASIC_INFO : STEPS.ITEM_TYPE}
                    stepOrder={editingItem ? getStepOrder(true, editingItem.type) : undefined}
                />
            )}

            {showContainerWizard && createPortal(
                <ContainerWizard
                    onComplete={(containerData) => {
                        console.log('ContainerWizard onComplete called with:', containerData);
                        // Add to both the base category and the selected category if one exists
                        const baseCategory = categories.find(c => c.isBaseCategory)?.id;
                        const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];

                        addItem(containerData, targetCategories);
                        setShowContainerWizard(false);
                    }}
                    onCancel={() => {
                        console.log('ContainerWizard onCancel called');
                        setShowContainerWizard(false);
                    }}
                />,
                document.body
            )}

            {showQuickItemGenerator && (
                <QuickItemGeneratorModal
                    onComplete={(newItem) => {
                        console.log('QuickItemGeneratorModal completed with item:', newItem);
                        // Use the same logic as handleItemWizardComplete
                        const baseCategory = categories.find(c => c.isBaseCategory)?.id;
                        const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];
                        console.log('Adding quick item with categories:', targetCategories);
                        addItem(newItem, targetCategories);
                        setShowQuickItemGenerator(false);
                    }}
                    onCancel={() => setShowQuickItemGenerator(false)}
                />
            )}

            {contextMenu?.type === 'item' && (
                <ItemContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    categories={categories}
                    onMoveToCategory={(itemId, categoryId) => handleMoveToCategory(itemId, categoryId)}
                    currentCategoryId={contextMenu.categoryId}
                    itemId={contextMenu.itemId}
                    item={contextMenu.validatedItem || items.find(item => item.id === contextMenu.itemId)}
                    onEdit={handleEditItem}
                    onShowCategorizeModal={handleShowCategorizeModal}
                />
            )}

            {/* Container Windows - Each ContainerWindow component uses its own React Portal */}
            {Array.from(openContainers).map(containerId => {
                const container = items.find(item => item.id === containerId);
                if (!container) return null;

                return (
                    <ContainerWindow
                        key={containerId}
                        container={container}
                        onClose={() => toggleContainerOpen(containerId)}
                    />
                );
            })}

            {showRecipeWizard && (
                <RecipeWizard
                    isOpen={showRecipeWizard}
                    onClose={() => setShowRecipeWizard(false)}
                    onSave={(recipe) => {
                        console.log('Recipe created:', recipe);
                        // Recipe is automatically added to the crafting store
                        setShowRecipeWizard(false);
                    }}
                    onWindowPositionChange={setRecipeWizardPosition}
                    onRecipeDataChange={setRecipeData}
                />
            )}

            {/* External Recipe Preview - renders outside the wizard window */}
            {showRecipeWizard && (
                <ExternalRecipePreview
                    recipeData={recipeData}
                    windowPosition={recipeWizardPosition}
                    windowSize={recipeWizardSize}
                    isOpen={showRecipeWizard}
                />
            )}

            {/* Categorize Modal */}
            {showCategorizeModal && categorizeModalData && (
                <CategorizeModal
                    categories={categories}
                    currentCategoryId={categorizeModalData.categoryId}
                    x={categorizeModalData.x}
                    y={categorizeModalData.y}
                    onMoveToCategory={(categoryId) => {
                        handleMoveToCategory(categorizeModalData.itemId, categoryId);
                        setShowCategorizeModal(false);
                        setCategorizeModalData(null);
                    }}
                    onClose={() => {
                        setShowCategorizeModal(false);
                        setCategorizeModalData(null);
                    }}
                />
            )}
            </div>
        </div>
    );

    if (contentOnly) {
        return renderContent();
    }

    return (
        <WowWindow
            isOpen={true}
            onClose={onClose}
            defaultPosition={position}
            defaultSize={activeTab === 'designer' ? { width: 1200, height: 800 } : { width: 1000, height: 700 }}
            title="Item Library"
            zIndex={1000}
            customHeader={null}
        >
            {renderContent()}
        </WowWindow>
    );
};

export default ItemLibrary;
