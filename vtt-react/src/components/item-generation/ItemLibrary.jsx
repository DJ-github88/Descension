import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore, { BASE_CATEGORY } from '../../store/itemStore';
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
import UnlockContainerModal from './UnlockContainerModal';
import CommunityItemsTab from './CommunityItemsTab';
import ContainerWindow from './ContainerWindow';
import ShareItemToCommunityDialog from './ShareItemToCommunityDialog';
import useAuthStore from '../../store/authStore';
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
import { getIconUrl } from '../../utils/assetManager';

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

        // Use clientX and clientY for fixed positioning (like creature token)
        const x = e.clientX;
        const y = e.clientY;

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
                                src={`getIconUrl('${category.icon}', 'items')`}
                                alt={category.name}
                                className="category-icon"
                                onError={(e) => {
                                    e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
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
    const [editingContainer, setEditingContainer] = useState(null);
    const [editingContainerId, setEditingContainerId] = useState(null);
    const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
    const [showRecipeWizard, setShowRecipeWizard] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [recipeWizardPosition, setRecipeWizardPosition] = useState({ x: 150, y: 50 });
    const [recipeWizardSize, setRecipeWizardSize] = useState({ width: 800, height: 600 });
    const [recipeData, setRecipeData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [qualityFilter, setQualityFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showCategorizeModal, setShowCategorizeModal] = useState(false);
    const [categorizeModalData, setCategorizeModalData] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockModalItem, setUnlockModalItem] = useState(null);
    const [shareDialog, setShareDialog] = useState(null);

    // Auth store for community sharing
    const { user } = useAuthStore();

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

            // Use clientX and clientY for fixed positioning
            // Note: No need to adjust for window scale since context menu is rendered at document level
            const x = e.clientX;
            const y = e.clientY;

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
            // Check if this is a recipe - if so, open RecipeWizard instead
            if (itemToEdit.type === 'recipe') {
                setEditingRecipe(itemToEdit);
                setShowRecipeWizard(true);
                return;
            }

            // Check if this is a container - if so, open ContainerWizard instead
            if (itemToEdit.type === 'container') {
                // Format container data for editing in ContainerWizard
                const containerData = {
                    name: itemToEdit.name,
                    quality: itemToEdit.quality,
                    description: itemToEdit.description,
                    iconId: itemToEdit.iconId,
                    // Extract container properties
                    isLocked: itemToEdit.containerProperties?.isLocked || false,
                    lockType: itemToEdit.containerProperties?.lockType || 'none',
                    lockDC: itemToEdit.containerProperties?.lockDC || 15,
                    lockCode: itemToEdit.containerProperties?.lockCode || '',
                    gridSize: itemToEdit.containerProperties?.gridSize || { rows: 4, cols: 6 },
                    flavorText: itemToEdit.containerProperties?.flavorText || '',
                    maxAttempts: itemToEdit.containerProperties?.maxAttempts || 3,
                    failureAction: itemToEdit.containerProperties?.failureAction || 'none',
                    failureActionDetails: itemToEdit.containerProperties?.failureActionDetails || {}
                };

                // Set editing state for ContainerWizard
                setEditingContainer(containerData);
                setEditingContainerId(itemToEdit.id);
                setShowContainerWizard(true);
                return;
            }
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

    const handleShowUnlockModal = (item) => {
        setUnlockModalItem(item);
        setShowUnlockModal(true);
    };

    const handleUnlockSuccess = (item) => {
        // Open the container after successful unlock
        toggleContainerOpen(item.id);
        setShowUnlockModal(false);
        setUnlockModalItem(null);
    };

    const handleContainerWizardComplete = (containerData) => {
        if (editingContainer && editingContainerId) {
            // Update the existing container with new data
            const updatedContainer = {
                id: editingContainerId,
                name: containerData.name,
                quality: containerData.quality,
                description: containerData.description,
                type: 'container',
                iconId: containerData.iconId,
                containerProperties: {
                    isLocked: containerData.isLocked,
                    lockType: containerData.lockType,
                    lockDC: containerData.lockDC,
                    lockCode: containerData.lockCode,
                    gridSize: containerData.gridSize,
                    items: items.find(item => item.id === editingContainerId)?.containerProperties?.items || [],
                    flavorText: containerData.flavorText,
                    maxAttempts: containerData.maxAttempts,
                    failureAction: containerData.failureAction,
                    failureActionDetails: containerData.failureActionDetails
                }
            };

            updateItem(editingContainerId, updatedContainer);
            setEditingContainer(null);
            setEditingContainerId(null);
        } else {
            // Create new container
            const containerItem = {
                id: Date.now().toString(),
                name: containerData.name || 'Unnamed Container',
                quality: containerData.quality,
                description: containerData.description,
                type: 'container',
                iconId: containerData.iconId,
                containerProperties: {
                    isLocked: containerData.isLocked,
                    lockType: containerData.lockType,
                    lockDC: containerData.lockDC,
                    lockCode: containerData.lockCode,
                    gridSize: {
                        rows: parseInt(containerData.rows) || 4,
                        cols: parseInt(containerData.cols) || 6
                    },
                    items: [],
                    flavorText: containerData.flavorText,
                    maxAttempts: containerData.maxAttempts,
                    failureAction: containerData.failureAction,
                    failureActionDetails: containerData.failureActionDetails
                }
            };

            // Add to library with appropriate categories
            const baseCategory = categories.find(c => c.isBaseCategory)?.id;
            addItem(containerItem, baseCategory ? [baseCategory] : []);
        }

        setShowContainerWizard(false);
    };

    const handleItemWizardComplete = (newItemData) => {

        if (editingItem) {
            updateItem(editingItem.id, {
                ...editingItem,
                ...newItemData
            });
            setEditingItem(null);
        } else {
            // For new items, find the base "All Items" category
            const baseCategory = categories.find(c => c.isBaseCategory)?.id;

            // Add to both the base category and the selected category if one exists
            const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];

            addItem(newItemData, targetCategories);
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

    // Helper function to render category options with indentation
    const renderCategoryOptions = (categories) => {
        // Build a tree structure
        const categoryMap = new Map();
        const rootCategories = [];

        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach(cat => {
            const category = categoryMap.get(cat.id);
            if (cat.parentId && categoryMap.has(cat.parentId)) {
                categoryMap.get(cat.parentId).children.push(category);
            } else {
                rootCategories.push(category);
            }
        });

        // Recursive function to render options with indentation
        const renderCategory = (category, depth = 0) => {
            // Use non-breaking spaces and dashes for better visual hierarchy
            const indent = '\u00A0\u00A0'.repeat(depth); // Non-breaking spaces
            const prefix = depth > 0 ? '├─ ' : '';
            const option = (
                <option key={category.id} value={category.id}>
                    {indent}{prefix}{category.name}
                </option>
            );

            const children = category.children
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(child => renderCategory(child, depth + 1));

            return [option, ...children];
        };

        // Sort root categories and render
        const sortedRoots = rootCategories.sort((a, b) => {
            // Put BASE_CATEGORY first
            if (a.isBaseCategory) return -1;
            if (b.isBaseCategory) return 1;
            return a.name.localeCompare(b.name);
        });

        return sortedRoots.flatMap(cat => renderCategory(cat));
    };

    const renderContent = () => (
        <div
            ref={containerRef}
            className={`item-library-container ${activeTab === 'designer' ? 'designer-mode' : activeTab === 'community' ? 'community-mode' : 'library-mode'}`}
        >
            <div className="item-library-content">
                {/* Tab Content */}
                {activeTab === 'library' ? (
                    <div className="item-library-main-container">
                        <div className="item-library-main">
                            {/* Compact Library Header */}
                            <div className="library-window-header">
                                <div className="header-content">
                                    {/* Category Dropdown */}
                                    <select
                                        value={selectedCategory || BASE_CATEGORY.id}
                                        onChange={(e) => setSelectedCategory(e.target.value || BASE_CATEGORY.id)}
                                        className="category-dropdown"
                                        title="Select category"
                                    >
                                        {renderCategoryOptions(categories)}
                                    </select>

                                    {/* Compact Filters */}
                                    <div className="compact-filters">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="compact-search"
                                        />
                                        <select
                                            value={qualityFilter}
                                            onChange={(e) => setQualityFilter(e.target.value)}
                                            className="compact-select"
                                        >
                                            <option value="">Quality</option>
                                            {filterOptions.qualities.map(quality => (
                                                <option key={quality} value={quality}>
                                                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            className="compact-select"
                                        >
                                            <option value="">Type</option>
                                            {filterOptions.types.map(type => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {(searchQuery || qualityFilter || typeFilter) && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setQualityFilter('');
                                                    setTypeFilter('');
                                                }}
                                                className="compact-clear"
                                                title="Clear filters"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="header-actions">
                                        <button
                                            onClick={() => setShowQuickItemGenerator(true)}
                                            className="action-btn primary"
                                            title="Quick item creation"
                                        >
                                            <i className="fas fa-magic"></i>
                                        </button>
                                        <button
                                            onClick={() => setShowRecipeWizard(true)}
                                            className="action-btn secondary"
                                            title="Create Recipe"
                                        >
                                            <i className="fas fa-scroll"></i>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const { resetToComprehensiveItems } = useItemStore.getState();
                                                resetToComprehensiveItems();
                                            }}
                                            className="action-btn utility"
                                            title="Reload library"
                                        >
                                            <i className="fas fa-refresh"></i>
                                        </button>
                                    </div>
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
                                            isDraggingGlobal={isDraggingGlobal}
                                            onDragStartGlobal={() => setIsDraggingGlobal(true)}
                                            onDragEndGlobal={() => setIsDraggingGlobal(false)}
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

                                                        // Get the dragged item
                                                        const draggedItem = items.find(item => item.id === data.id);

                                                        // Don't allow dropping a container into itself or another container
                                                        if (draggedItem && draggedItem.type !== 'container') {

                                                            // Only auto-open the container if it's not locked and not already open
                                                            // For locked containers, we want to add items without opening them
                                                            const isContainerLocked = containerProps.isLocked;
                                                            if (!isContainerLocked && !openContainers.has(containerItem.id)) {
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
                ) : activeTab === 'designer' ? (
                    <div className="item-designer-container">
                        <ItemGeneration onContainerCreate={handleContainerCreate} />
                    </div>
                ) : activeTab === 'community' ? (
                    <div className="community-items-container">
                        <CommunityItemsTab />
                    </div>
                ) : null}
            </div>
        </div>
    );

    if (contentOnly) {
        return renderContent();
    }

    const tabs = [
        {
            id: 'library',
            label: 'Library',
            icon: '/icons/book.png'
        },
        {
            id: 'designer',
            label: 'Designer',
            icon: '/icons/hammer.png'
        },
        {
            id: 'community',
            label: 'Community',
            icon: '/icons/globe.png'
        }
    ];

    return (
        <WowWindow
            isOpen={true}
            onClose={onClose}
            defaultPosition={position}
            defaultSize={activeTab === 'designer' ? { width: 1200, height: 800 } : activeTab === 'community' ? { width: 1100, height: 750 } : { width: 1000, height: 700 }}
            title="Item Library"
            zIndex={1000}
            customHeader={
                <div className="spellbook-tab-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            }
        >
            {renderContent()}

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
                    initialData={editingContainer}
                    isEditing={!!editingContainer}
                    onComplete={handleContainerWizardComplete}
                    onCancel={() => {
                        setShowContainerWizard(false);
                        setEditingContainer(null);
                        setEditingContainerId(null);
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

            {contextMenu?.type === 'item' && createPortal(
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
                    onShowUnlockModal={handleShowUnlockModal}
                    onShareToCommunity={(item) => setShareDialog(item)}
                    user={user}
                />,
                document.body
            )}

            {/* Share to Community Dialog */}
            <ShareItemToCommunityDialog
                isOpen={!!shareDialog}
                item={shareDialog}
                onClose={() => setShareDialog(null)}
                onShare={async (item) => {
                    if (!user?.uid) {
                        alert('Please log in to share items with the community.');
                        return;
                    }
                    try {
                        const { uploadItem } = await import('../../services/firebase/communityItemService');
                        await uploadItem(item, user.uid);
                        alert(`Successfully shared "${item.name}" with the community!`);
                        setShareDialog(null);
                    } catch (error) {
                        console.error('Failed to share item:', error);
                        throw error;
                    }
                }}
            />

            {/* Container Windows - Each ContainerWindow component uses its own React Portal */}
            {Array.from(openContainers).map(containerId => {
                const container = items.find(item => item.id === containerId);
                if (!container) {
                    return null;
                }

                return (
                    <ContainerWindow
                        key={containerId}
                        container={container}
                        onClose={() => toggleContainerOpen(containerId)}
                    />
                );
            })}

            {showRecipeWizard && createPortal(
                <RecipeWizard
                    isOpen={showRecipeWizard}
                    onClose={() => {
                        setShowRecipeWizard(false);
                        setEditingRecipe(null);
                        setRecipeData({});
                    }}
                    onSave={(recipeData) => {
                        // Handle saving the recipe
                        console.log('Saving recipe:', recipeData);
                        // For now, just close the wizard
                        setShowRecipeWizard(false);
                        setEditingRecipe(null);
                        setRecipeData({});
                    }}
                    onWindowPositionChange={setRecipeWizardPosition}
                    onRecipeDataChange={setRecipeData}
                    initialData={editingRecipe}
                />,
                document.body
            )}

            {/* External Recipe Preview - renders outside the wizard window */}
            {showRecipeWizard && createPortal(
                <ExternalRecipePreview
                    recipeData={recipeData}
                    windowPosition={recipeWizardPosition}
                    windowSize={recipeWizardSize}
                    onWindowPositionChange={setRecipeWizardPosition}
                    onWindowSizeChange={setRecipeWizardSize}
                />,
                document.body
            )}

            {/* Unlock Container Modal */}
            {showUnlockModal && unlockModalItem && (
                <UnlockContainerModal
                    container={unlockModalItem}
                    onSuccess={handleUnlockSuccess}
                    onClose={() => {
                        setShowUnlockModal(false);
                        setUnlockModalItem(null);
                    }}
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
        </WowWindow>
    );
};

export default ItemLibrary;
