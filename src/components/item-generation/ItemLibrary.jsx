import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import ItemWizard from './ItemWizard';
import CategoryDialog from './CategoryDialog';
import ItemTooltip from './ItemTooltip';
import ItemContextMenu from './ItemContextMenu';
import CategoryContextMenu from './CategoryContextMenu';
import QuickItemWizard from './QuickItemWizard';
import ContainerWizard from './ContainerWizard';
import ItemGeneration from './ItemGeneration';
import ContainerWindow from './ContainerWindow';
import '../../styles/item-library.css';
import '../../styles/quick-item-wizard.css';
import { STEPS, getStepOrder } from './wizardSteps';
import { WEAPON_SUBTYPES } from './weaponTypes';

const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
        case 'poor': return '#9d9d9d';
        case 'common': return '#ffffff';
        case 'uncommon': return '#1eff00';
        case 'rare': return '#0070dd';
        case 'epic': return '#a335ee';
        case 'legendary': return '#ff8000';
        case 'artifact': return '#e6cc80';
        default: return '#ffffff';
    }
};

const CategoryTree = ({ categories, selectedCategory, onSelect, onAddSubcategory, onDelete, onDrop }) => {
    const [contextMenu, setContextMenu] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    
    const getChildCategories = (parentId) => 
        categories.filter(c => c.parentId === parentId);

    const handleContextMenu = (e, category) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
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

const ItemCard = ({ item, isSelected, onClick, onContextMenu, categoryId }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const tooltipRef = useRef(null);

    const updateTooltipPosition = () => {
        if (!cardRef.current || !tooltipRef.current) return;

        const cardRect = cardRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = cardRect.right + 10;
        let y = cardRect.top;

        if (x + tooltipRect.width > viewportWidth) {
            x = cardRect.left - tooltipRect.width - 10;
        }

        if (y + tooltipRect.height > viewportHeight) {
            y = viewportHeight - tooltipRect.height - 10;
        }

        if (y < 10) {
            y = 10;
        }

        setTooltipPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setShowTooltip(true);
        const rect = cardRef.current.getBoundingClientRect();
        setTooltipPosition({
            x: rect.right + 10,
            y: rect.top
        });
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    useEffect(() => {
        if (showTooltip) {
            updateTooltipPosition();
            window.addEventListener('resize', updateTooltipPosition);
            return () => window.removeEventListener('resize', updateTooltipPosition);
        }
    }, [showTooltip]);

    return (
        <>
            <div 
                ref={cardRef}
                className={`item-card ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: getQualityColor(item.quality) }}
                onClick={onClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu(e, item.id);
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'item', id: item.id }));
                }}
            >
                <div className="item-icon">
                    <img 
                        src={item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')}
                        alt={item.name}
                        onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                    />
                </div>
            </div>
            {showTooltip && createPortal(
                <div 
                    ref={tooltipRef}
                    className="item-tooltip-wrapper"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        zIndex: 9999
                    }}
                >
                    <ItemTooltip item={item} />
                </div>,
                document.body
            )}
        </>
    );
};

const ItemLibrary = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('library');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [newCategoryParentId, setNewCategoryParentId] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [showItemWizard, setShowItemWizard] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showQuickItemWizard, setShowQuickItemWizard] = useState(false);
    const [showContainerWizard, setShowContainerWizard] = useState(false);

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
    
    const [position, setPosition] = useState(() => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const width = Math.min(800, windowWidth * 0.9);
        const height = Math.min(600, windowHeight * 0.8);
        return {
            x: (windowWidth - width) / 2,
            y: (windowHeight - height) / 4
        };
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && containerRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                
                // Add some padding to prevent the window from getting stuck at edges
                const padding = 20;
                const maxX = window.innerWidth - containerRef.current.offsetWidth + padding;
                const maxY = window.innerHeight - containerRef.current.offsetHeight + padding;
                
                setPosition({
                    x: Math.max(-padding, Math.min(newX, maxX)),
                    y: Math.max(-padding, Math.min(newY, maxY))
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'move';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e) => {
        if (e.target.closest('.item-library-header')) {
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            e.preventDefault(); // Prevent text selection while dragging
        }
    };

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

    const handleItemContextMenu = (e, itemId) => {
        e.preventDefault();
        setContextMenu({
            type: 'item',
            x: e.clientX,
            y: e.clientY,
            itemId,
            categoryId: selectedCategory
        });
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
                    critChance: { value: parseInt(itemToEdit.combatStats?.critChance?.value) || 0, isPercentage: true },
                    critDamage: { value: parseInt(itemToEdit.combatStats?.critDamage?.value) || 0, isPercentage: true },
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
        console.log('=== getCurrentItems called ===');
        console.log('Selected category:', selectedCategory);
        console.log('All items:', items);
        console.log('Item categories:', itemCategories);
        
        // If no category is selected, show all items
        if (!selectedCategory) {
            console.log('No category selected, showing all items');
            return items;
        }

        const filteredItems = items.filter(item => {
            console.log(`Checking item ${item.id}: ${item.name}`);
            const itemCats = itemCategories[item.id];
            console.log('Categories for item:', itemCats);
            
            if (!itemCats) {
                console.log('No categories found for item, defaulting to All Items');
                return selectedCategory === categories.find(c => c.isBaseCategory)?.id;
            }
            
            // Check if the item belongs to the selected category
            const isInCategory = Array.isArray(itemCats) ? itemCats.includes(selectedCategory) : false;
            console.log(`Item ${item.id} in current category (${selectedCategory}):`, isInCategory);
            return isInCategory;
        });
        
        console.log('Filtered items:', filteredItems);
        return filteredItems;
    };

    const handleMoveToCategory = (itemId, targetCategoryId) => {
        if (targetCategoryId) {
            moveItem(itemId, targetCategoryId);
            setContextMenu(null);
        }
    };

    return createPortal(
        <div 
            ref={containerRef}
            className="item-library-container"
            onMouseDown={handleMouseDown}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="item-library-header">
                <div className="item-library-title">Item Library</div>
                <button className="item-library-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            
            <div className="item-library-tabs">
                <div 
                    className={`item-library-tab ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    Item Library
                </div>
                <div 
                    className={`item-library-tab ${activeTab === 'generation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generation')}
                >
                    Item Generation
                </div>
            </div>
            
            <div className="item-library-content">
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
                            <div className="section-header">
                                <h2>
                                    {selectedCategory ? 
                                        categories.find(c => c.id === selectedCategory)?.name : 
                                    'All Items'}
                                </h2>
                                <button 
                                    onClick={() => setShowQuickItemWizard(true)}
                                    className="quick-create-button"
                                    title="AI-powered quick item creation"
                                >
                                    <i className="fas fa-magic"></i> Quick Create
                                </button>
                            </div>
                            <div className="item-actions">
                            </div>
                            <div className={`item-grid ${activeView === 'list' ? 'list-view' : ''}`}>
                                {items.length === 0 ? (
                                    <div className="item-library-empty">
                                        <div className="item-library-empty-icon">
                                            <i className="fas fa-box-open"></i>
                                        </div>
                                        <div className="item-library-empty-text">No items yet</div>
                                        <div className="item-library-empty-subtext">
                                            Create your first item using Quick Create or the Item Generation tab
                                        </div>
                                    </div>
                                ) : (
                                    getCurrentItems().map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedItem === item.id}
                                            onClick={() => setSelectedItem(item.id)}
                                            onContextMenu={handleItemContextMenu}
                                            categoryId={itemCategories[item.id]}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="item-generation-content">
                        <ItemGeneration onContainerCreate={() => {
                            console.log('ItemLibrary: onContainerCreate called');
                            setShowContainerWizard(true);
                        }} />
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

            {showQuickItemWizard && (
                <QuickItemWizard
                    onComplete={(newItem) => {
                        console.log('QuickItemWizard completed with item:', newItem);
                        // Use the same logic as handleItemWizardComplete
                        const baseCategory = categories.find(c => c.isBaseCategory)?.id;
                        const targetCategories = selectedCategory ? [baseCategory, selectedCategory] : [baseCategory];
                        console.log('Adding quick item with categories:', targetCategories);
                        addItem(newItem, targetCategories);
                        setShowQuickItemWizard(false);
                    }}
                    onCancel={() => setShowQuickItemWizard(false)}
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
                    item={items.find(item => item.id === contextMenu.itemId)}
                    onEdit={handleEditItem}
                />
            )}

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
        </div>,
        document.body
    );
};

export default ItemLibrary;
