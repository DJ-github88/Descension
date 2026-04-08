import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { Grid as VirtualGrid } from 'react-window';
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
import { shareItemToCommunity } from '../../services/firebase/userItemsService';
import ItemGeneration from './ItemGeneration';
import RecipeWizard from '../crafting/RecipeWizard';
import ExternalRecipePreview from '../crafting/ExternalRecipePreview';
import SmartTabButton from '../common/SmartTabButton';
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

const CategoryTree = memo(({ categories, selectedCategory, onSelect, onAddSubcategory, onDelete, onDrop }) => {
    const [contextMenu, setContextMenu] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const getChildCategories = (parentId) =>
        categories.filter(c => c.parentId === parentId);

    const handleContextMenu = (e, category) => {
        e.preventDefault();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const x = e.clientX;
        const y = e.clientY;

        const menuWidth = 200;
        const menuHeight = 150;

        let posX = x;
        let posY = y;

        if (posX + menuWidth > viewportWidth) {
            posX = Math.max(0, x - menuWidth);
        }

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
                                src={getIconUrl(category.icon, 'items')}
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
});

const ItemCell = memo(({ columnIndex, rowIndex, style, items, COLUMN_COUNT, selectedItem, isDraggingGlobal, onDragStartGlobal, onDragEndGlobal, onClick, onContextMenu, onDragOver, onDrop }) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    const item = items[index];
    
    if (!item) return <div style={style} />;

    return (
        <div style={{
            ...style,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '5px'
        }}>
            <ItemCard
                item={item}
                isSelected={selectedItem === item.id}
                isDraggingGlobal={isDraggingGlobal}
                onDragStartGlobal={onDragStartGlobal}
                onDragEndGlobal={onDragEndGlobal}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onDragOver={onDragOver}
                onDrop={onDrop}
            />
        </div>
    );
});

const SimpleItemGrid = memo(({ 
    items, 
    selectedItem, 
    isDraggingGlobal, 
    onDragStartGlobal, 
    onDragEndGlobal, 
    onClick, 
    onContextMenu, 
    onDragOver, 
    onDrop
}) => {
    if (items.length === 0) {
        return (
            <div className="item-library-empty">
                <div className="item-library-empty-icon">
                    <i className="fas fa-box-open"></i>
                </div>
                <div className="item-library-empty-text">No items in this category</div>
                <div className="item-library-empty-subtext">
                    Try selecting a different category or create new items using Quick Create
                </div>
            </div>
        );
    }

    return (
        <div className="item-grid-inner">
            {items.map((item) => (
                <MemoizedItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItem === item.id}
                    isDraggingGlobal={isDraggingGlobal}
                    onDragStartGlobal={onDragStartGlobal}
                    onDragEndGlobal={onDragEndGlobal}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if items actually changed or drag state changed
    return (
        prevProps.items === nextProps.items &&
        prevProps.selectedItem === nextProps.selectedItem &&
        prevProps.isDraggingGlobal === nextProps.isDraggingGlobal &&
        prevProps.onClick === nextProps.onClick &&
        prevProps.onContextMenu === nextProps.onContextMenu
    );
});

const MemoizedItemCard = memo(ItemCard, (prevProps, nextProps) => {
    // Only re-render if this specific item's selection state or the item itself changed
    if (prevProps.item !== nextProps.item) return false;
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.isDraggingGlobal !== nextProps.isDraggingGlobal) return false;
    return true;
});

const VirtualizedItemGrid = memo(({ 
    items, 
    selectedItem, 
    isDraggingGlobal, 
    onDragStartGlobal, 
    onDragEndGlobal, 
    onClick, 
    onContextMenu, 
    onDragOver, 
    onDrop
}) => {
    const gridRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setDimensions({ width: Math.floor(width), height: Math.floor(height) });
                }
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const COLUMN_WIDTH = 92;
    const ROW_HEIGHT = 115;
    const COLUMN_COUNT = dimensions ? Math.max(1, Math.floor(dimensions.width / COLUMN_WIDTH)) : 1;
    const ROW_COUNT = dimensions ? Math.ceil(items.length / COLUMN_COUNT) : 1;

    const cellProps = useMemo(() => ({
        items,
        COLUMN_COUNT,
        selectedItem,
        isDraggingGlobal,
        onDragStartGlobal,
        onDragEndGlobal,
        onClick,
        onContextMenu,
        onDragOver,
        onDrop
    }), [items, COLUMN_COUNT, selectedItem, isDraggingGlobal, onDragStartGlobal, onDragEndGlobal, onClick, onContextMenu, onDragOver, onDrop]);

    if (items.length === 0) {
        return (
            <div className="item-library-empty">
                <div className="item-library-empty-icon">
                    <i className="fas fa-box-open"></i>
                </div>
                <div className="item-library-empty-text">No items in this category</div>
                <div className="item-library-empty-subtext">
                    Try selecting a different category or create new items using Quick Create
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="item-grid" style={{ position: 'relative' }}>
            {dimensions && (
                <VirtualGrid
                    gridRef={gridRef}
                    columnCount={COLUMN_COUNT}
                    columnWidth={COLUMN_WIDTH}
                    rowCount={ROW_COUNT}
                    rowHeight={ROW_HEIGHT}
                    cellComponent={ItemCell}
                    cellProps={cellProps}
                    style={{ 
                        width: dimensions.width,
                        height: dimensions.height,
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}
                />
            )}
        </div>
    );
});

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
    const [ownFilter, setOwnFilter] = useState(false);

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

    const handleEditItem = (itemId) => {
        const itemToEdit = items.find(item => item.id === itemId);
        if (itemToEdit) {
            if (itemToEdit.type === 'recipe') {
                setEditingRecipe(itemToEdit);
                setShowRecipeWizard(true);
                return;
            }

            if (itemToEdit.type === 'container') {
                const containerData = {
                    name: itemToEdit.name,
                    quality: itemToEdit.quality,
                    description: itemToEdit.description,
                    iconId: itemToEdit.iconId,
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

                setEditingContainer(containerData);
                setEditingContainerId(itemToEdit.id);
                setShowContainerWizard(true);
                return;
            }
            const formattedItem = {
                ...itemToEdit,
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
                slots: itemToEdit.slots || [],
                subtype: itemToEdit.type === 'weapon' ? (
                    Object.keys(WEAPON_SUBTYPES).find(key =>
                        WEAPON_SUBTYPES[key].name.toLowerCase() === (itemToEdit.subtype || '').toLowerCase()
                    ) || Object.keys(WEAPON_SUBTYPES)[0]
                ) : itemToEdit.subtype,
                weaponStats: itemToEdit.type === 'weapon' ? {
                    baseDamage: {
                        diceCount: parseInt(itemToEdit.weaponStats?.baseDamage?.diceCount) || 1,
                        diceType: (itemToEdit.weaponStats?.baseDamage?.diceType || 'd6').toString().toLowerCase(),
                        damageType: itemToEdit.weaponStats?.baseDamage?.damageType || 'slashing',
                        bonusDamage: parseInt(itemToEdit.weaponStats?.baseDamage?.bonusDamage) || 0,
                        bonusDamageType: itemToEdit.weaponStats?.baseDamage?.bonusDamageType || ''
                    }
                } : undefined,
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
        toggleContainerOpen(item.id);
        setShowUnlockModal(false);
        setUnlockModalItem(null);
    };

    const handleContainerWizardComplete = (containerData) => {
        if (editingContainer && editingContainerId) {
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
            const baseCategory = categories.find(c => c.isBaseCategory)?.id;

            const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];

            addItem(newItemData, targetCategories);
        }
        setShowItemWizard(false);
    };

    const currentItems = useMemo(() => {
        let filteredItems = items.filter(item => {
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

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const nameMatch = item.name.toLowerCase().includes(query);
                const descMatch = item.description?.toLowerCase().includes(query);
                const typeMatch = item.type?.toLowerCase().includes(query);
                const subtypeMatch = item.subtype?.toLowerCase().includes(query);

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

            if (qualityFilter && item.quality !== qualityFilter) {
                return false;
            }

            if (typeFilter && item.type !== typeFilter) {
                return false;
            }

            if (ownFilter && item.createdBy !== user?.uid) {
                return false;
            }

            return true;
        });

        return filteredItems.filter((item, index, self) =>
            index === self.findIndex(i => i.id === item.id)
        );
    }, [items, selectedCategory, itemCategories, searchQuery, qualityFilter, typeFilter, categories, ownFilter, user]);

    const handleItemContextMenu = useCallback((e, item) => {
        if (!e) return;
        e.preventDefault();

        try {
            if (!item) {
                console.error('Item not found for context menu');
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const x = e.clientX;
            const y = e.clientY;

            const menuWidth = 200;
            const menuHeight = 150;

            let posX = x;
            let posY = y;

            if (posX + menuWidth > viewportWidth) {
                posX = Math.max(0, x - menuWidth);
            }

            if (posY + menuHeight > viewportHeight) {
                posY = Math.max(0, y - menuHeight);
            }

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
                itemId: item.id,
                categoryId: selectedCategory,
                validatedItem
            });
        } catch (error) {
            console.error('Error showing context menu:', error);
        }
    }, [selectedCategory]);

    const categoryOptions = useMemo(() => {
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

        const renderCategory = (category, depth = 0) => {
            const indent = '\u00A0\u00A0'.repeat(depth);
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

        const sortedRoots = rootCategories.sort((a, b) => {
            if (a.isBaseCategory) return -1;
            if (b.isBaseCategory) return 1;
            return a.name.localeCompare(b.name);
        });

        return sortedRoots.flatMap(cat => renderCategory(cat));
    }, [categories]);

    const filterOptions = useMemo(() => {
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
    }, [items]);

    const handleMoveToCategory = useCallback((itemId, targetCategoryId) => {
        if (targetCategoryId) {
            moveItem(itemId, targetCategoryId);
            setContextMenu(null);
        }
    }, [moveItem]);

    const handleShareToCommunity = useCallback(async (item) => {
        if (!user?.uid || !item?.id) return;
        try {
            await shareItemToCommunity(user.uid, item.id);
            updateItem(item.id, { isShared: true, sharedAt: new Date().toISOString() });
        } catch (error) {
            console.error('Failed to share item to community:', error);
            throw error;
        }
    }, [user, updateItem]);

    const handleContainerCreate = useCallback(() => {
        setShowContainerWizard(true);
    }, []);

    const handleDragStartGlobal = useCallback(() => {
        setIsDraggingGlobal(true);
    }, []);

    const handleDragEndGlobal = useCallback(() => {
        setIsDraggingGlobal(false);
    }, []);

    const handleItemClick = useCallback((e, item) => {
        setSelectedItem(item.id);
    }, []);

    const handleItemDragOver = useCallback((e, containerItem) => {
        if (containerItem.type !== 'container') return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        e.currentTarget.classList.add('container-drag-over');
    }, []);

    const handleItemDrop = useCallback((e, containerItem) => {
        if (containerItem.type !== 'container') return;

        e.preventDefault();
        e.currentTarget.classList.remove('container-drag-over');

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (data.type === 'item') {

                const draggedItem = items.find(item => item.id === data.id);

                if (draggedItem && draggedItem.type !== 'container') {

                    const containerProps = containerItem.containerProperties || {
                        gridSize: { rows: 4, cols: 6 },
                        items: [],
                        isLocked: false
                    };

                    const isContainerLocked = containerProps.isLocked;
                    if (!isContainerLocked && !openContainers.has(containerItem.id)) {
                        toggleContainerOpen(containerItem.id);
                    }

                    const findValidPosition = (items, width, height, rotation, gridSize) => {
                        const rows = gridSize.rows || 4;
                        const cols = gridSize.cols || 6;

                        const effectiveWidth = rotation === 1 ? height : width;
                        const effectiveHeight = rotation === 1 ? width : height;

                        for (let row = 0; row < rows; row++) {
                            for (let col = 0; col < cols; col++) {
                                if (row + effectiveHeight > rows || col + effectiveWidth > cols) {
                                    continue;
                                }

                                let isValid = true;
                                for (const item of items) {
                                    const itemWidth = item.width || 1;
                                    const itemHeight = item.height || 1;
                                    const itemRotation = item.rotation || 0;

                                    const itemEffectiveWidth = itemRotation === 1 ? itemHeight : itemWidth;
                                    const itemEffectiveHeight = itemRotation === 1 ? itemWidth : itemHeight;

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

                        return { row: 0, col: 0 };
                    };

                    let width = draggedItem.width || 1;
                    let height = draggedItem.height || 1;
                    const rotation = draggedItem.rotation || 0;

                    if (!draggedItem.width || !draggedItem.height) {
                        if (draggedItem.type === 'weapon') {
                            if (draggedItem.subtype === 'GREATSWORD' || draggedItem.subtype === 'GREATAXE' ||
                                draggedItem.subtype === 'MAUL' || draggedItem.subtype === 'POLEARM') {
                                width = 2;
                                height = 4;
                            } else if (draggedItem.subtype === 'STAFF') {
                                width = 1;
                                height = 4;
                            } else if (draggedItem.subtype === 'SWORD' || draggedItem.subtype === 'AXE' || draggedItem.subtype === 'MACE') {
                                width = 1;
                                height = 2;
                            } else if (draggedItem.subtype === 'DAGGER') {
                                width = 1;
                                height = 1;
                            } else if (draggedItem.subtype === 'BOW' || draggedItem.subtype === 'CROSSBOW') {
                                width = 2;
                                height = 3;
                            }
                        } else if (draggedItem.type === 'armor') {
                            if (draggedItem.subtype === 'PLATE') {
                                width = 2;
                                height = 2;
                            } else if (draggedItem.subtype === 'MAIL') {
                                width = 2;
                                height = 2;
                            } else if (draggedItem.subtype === 'LEATHER') {
                                width = 1;
                                height = 2;
                            } else if (draggedItem.subtype === 'CLOTH') {
                                width = 1;
                                height = 1;
                            }
                        }
                    }

                    const position = findValidPosition(
                        containerProps.items || [],
                        width,
                        height,
                        rotation,
                        containerProps.gridSize || { rows: 4, cols: 6 }
                    );

                    const itemForContainer = {
                        ...JSON.parse(JSON.stringify(draggedItem)),
                        id: Date.now().toString(),
                        position: position,
                        width: width,
                        height: height,
                        rotation: rotation
                    };

                    const containerItems = JSON.parse(JSON.stringify(containerProps.items || []));

                    containerItems.push(itemForContainer);

                    const updatedContainerProps = {
                        ...JSON.parse(JSON.stringify(containerProps)),
                        items: containerItems,
                        hasHadItems: true
                    };

                    updateItem(containerItem.id, {
                        containerProperties: updatedContainerProps
                    });
                }
            }
        } catch (error) {
            console.error('Error handling drop onto container:', error);
        }
    }, [items, openContainers, toggleContainerOpen, updateItem]);

    const renderContent = () => (
        <div
            ref={containerRef}
            className={`item-library-container ${activeTab === 'designer' ? 'designer-mode' : activeTab === 'community' ? 'community-mode' : 'library-mode'}`}
        >
            <div className="item-library-content">
                {activeTab === 'library' ? (
                        <div className="item-library-main">

                            <div className="library-window-header">
                                <div className="header-content">
                                    <select
                                        value={selectedCategory || BASE_CATEGORY.id}
                                        onChange={(e) => setSelectedCategory(e.target.value || BASE_CATEGORY.id)}
                                        className="category-dropdown"
                                        title="Select category"
                                    >
                                        {categoryOptions}
                                    </select>

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
                                        {user && !user.isGuest && (
                                            <label className="compact-own-filter" title="Show only my items">
                                                <input
                                                    type="checkbox"
                                                    checked={ownFilter}
                                                    onChange={(e) => setOwnFilter(e.target.checked)}
                                                />
                                                <span>Own</span>
                                            </label>
                                        )}
                                        {(searchQuery || qualityFilter || typeFilter || ownFilter) && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setQualityFilter('');
                                                    setTypeFilter('');
                                                    setOwnFilter(false);
                                                }}
                                                className="compact-clear"
                                                title="Clear filters"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

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
                            <VirtualizedItemGrid
                                items={currentItems}
                                selectedItem={selectedItem}
                                isDraggingGlobal={isDraggingGlobal}
                                onDragStartGlobal={handleDragStartGlobal}
                                onDragEndGlobal={handleDragEndGlobal}
                                onClick={handleItemClick}
                                onContextMenu={handleItemContextMenu}
                                onDragOver={handleItemDragOver}
                                onDrop={handleItemDrop}
                            />
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
            zIndex={1000}
            customHeader={
                <div className="spellbook-tab-container">
                    {tabs.map((tab) => (
                        <SmartTabButton
                            key={tab.id}
                            title={tab.label}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            }
        >
            {renderContent()}
            {showItemWizard && (
                <ItemWizard
                    onComplete={handleItemWizardComplete}
                    initialData={editingItem || {}}
                    isEditing={!!editingItem}
                    onClose={() => {
                        setShowItemWizard(false);
                        setEditingItem(null);
                    }}
                />
            )}

            {showCategoryDialog && (
                <CategoryDialog
                    onSave={handleCreateCategory}
                    onClose={() => setShowCategoryDialog(false)}
                    parentId={newCategoryParentId}
                />
            )}

            {showQuickItemGenerator && (
                <QuickItemGeneratorModal
                    onCancel={() => setShowQuickItemGenerator(false)}
                    onComplete={(item) => {
                        handleItemWizardComplete(item);
                        setShowQuickItemGenerator(false);
                    }}
                />
            )}

            {showContainerWizard && (
                <ContainerWizard
                    onComplete={handleContainerWizardComplete}
                    editingContainer={editingContainer}
                    onClose={() => {
                        setShowContainerWizard(false);
                        setEditingContainer(null);
                        setEditingContainerId(null);
                    }}
                />
            )}

            {showCategorizeModal && categorizeModalData && (
                <CategorizeModal
                    x={categorizeModalData.x}
                    y={categorizeModalData.y}
                    itemId={categorizeModalData.itemId}
                    categoryId={categorizeModalData.categoryId}
                    categories={categories}
                    onMove={handleMoveToCategory}
                    onClose={() => {
                        setShowCategorizeModal(false);
                        setCategorizeModalData(null);
                    }}
                />
            )}

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

            {contextMenu && createPortal(
                <ItemContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    item={contextMenu.validatedItem}
                    itemId={contextMenu.validatedItem?.id || contextMenu.itemId}
                    currentCategoryId={contextMenu.categoryId}
                    categories={categories}
                    onClose={() => setContextMenu(null)}
                    onDelete={handleDeleteItem}
                    onEdit={handleEditItem}
                    onAddToInventory={handleAddToInventory}
                    onShowCategorizeModal={handleShowCategorizeModal}
                    onShowUnlockModal={handleShowUnlockModal}
                    onMoveToCategory={handleMoveToCategory}
                    user={user}
                    onShareToCommunity={(item) => setShareDialog(item)}
                />,
                document.body
            )}

            {shareDialog && createPortal(
                <ShareItemToCommunityDialog
                    isOpen={true}
                    item={shareDialog}
                    onClose={() => setShareDialog(null)}
                    onShare={handleShareToCommunity}
                />,
                document.body
            )}

            {showRecipeWizard && createPortal(
                <RecipeWizard
                    isOpen={true}
                    onClose={() => {
                        setShowRecipeWizard(false);
                        setEditingRecipe(null);
                    }}
                    onSave={(recipe) => {
                        if (editingRecipe) {
                            updateItem(editingRecipe.id, recipe);
                        } else {
                            const baseCategory = categories.find(c => c.isBaseCategory)?.id;
                            addItem(recipe, baseCategory ? [baseCategory] : []);
                        }
                        setShowRecipeWizard(false);
                        setEditingRecipe(null);
                    }}
                    initialData={editingRecipe}
                    onWindowPositionChange={setRecipeWizardPosition}
                    onRecipeDataChange={setRecipeData}
                />,
                document.body
            )}
        </WowWindow>
    );
};

export default ItemLibrary;
