import React, { useState } from 'react';
import useCraftingStore, { SKILL_LEVELS } from '../../store/craftingStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useChatStore from '../../store/chatStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';

function AlchemyInterface({ onBack }) {
    const [activeTab, setActiveTab] = useState('recipes');
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const {
        getProfessionLevel,
        getKnownRecipesForProfession,
        getRecipesForProfession,
        knowsRecipe,
        addToCraftingQueue,
        setProfessionLevel,
        craftingQueue,
        learnRecipe
    } = useCraftingStore();

    const { items: inventoryItems, removeItem, addItemFromLibrary } = useInventoryStore();
    const { items: itemLibrary } = useItemStore();
    const { addLootNotification } = useChatStore();

    const alchemyLevel = getProfessionLevel('alchemy');
    const skillLevelInfo = Object.values(SKILL_LEVELS).find(skill => skill.level === alchemyLevel);
    const knownRecipes = getKnownRecipesForProfession('alchemy');
    const allAlchemyRecipes = getRecipesForProfession('alchemy');





    // Note: Use the "Add Test Materials" button to populate inventory with crafting materials

    const getSkillLevelColor = (level) => {
        if (level === 0) return '#9d9d9d';
        if (level <= 2) return '#ffffff';
        if (level <= 4) return '#1eff00';
        if (level <= 6) return '#0070dd';
        if (level <= 8) return '#a335ee';
        return '#ff8000';
    };

    const canCraftRecipe = (recipe) => {
        // Check skill level requirement
        if (alchemyLevel < recipe.requiredLevel) {
            return { canCraft: false, reason: 'Insufficient skill level' };
        }

        // Check if player has all required materials
        for (const material of recipe.materials) {
            // Find inventory items that match this material's itemId using originalItemId
            const matchingItems = inventoryItems.filter(item => item.originalItemId === material.itemId);
            const availableQuantity = matchingItems.reduce((total, item) => total + (item.quantity || 1), 0);

            if (availableQuantity < material.quantity) {
                const itemData = itemLibrary.find(item => item.id === material.itemId);
                return {
                    canCraft: false,
                    reason: `Need ${material.quantity} ${itemData?.name || 'Unknown Item'} (have ${availableQuantity})`
                };
            }
        }

        return { canCraft: true, reason: null };
    };

    const craftItem = (recipe) => {
        const craftCheck = canCraftRecipe(recipe);
        if (!craftCheck.canCraft) {
            addLootNotification({
                type: 'crafting_failed',
                message: `Cannot craft ${recipe.name}: ${craftCheck.reason}`,
                timestamp: Date.now()
            });
            return;
        }

        // Consume materials
        for (const material of recipe.materials) {
            // Find all inventory items that match this material's itemId using originalItemId
            const matchingItems = inventoryItems.filter(item => item.originalItemId === material.itemId);
            let remainingToConsume = material.quantity;

            // Sort by quantity (consume smaller stacks first to avoid waste)
            matchingItems.sort((a, b) => (a.quantity || 1) - (b.quantity || 1));

            for (const inventoryItem of matchingItems) {
                if (remainingToConsume <= 0) break;

                const itemQuantity = inventoryItem.quantity || 1;
                const consumeFromThisStack = Math.min(remainingToConsume, itemQuantity);
                const newQuantity = itemQuantity - consumeFromThisStack;

                if (newQuantity <= 0) {
                    // Remove the entire stack
                    removeItem(inventoryItem.id);
                } else {
                    // Update the quantity using the inventory store's removeItem with quantity parameter
                    removeItem(inventoryItem.id, consumeFromThisStack);
                }

                remainingToConsume -= consumeFromThisStack;
            }
        }

        // Add crafted item to inventory
        const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
        if (resultItem) {
            addItemFromLibrary(resultItem, recipe.resultQuantity || 1);
        }

        // Add experience and potentially level up
        const newLevel = Math.min(9, alchemyLevel + (recipe.experienceGained || 1));
        if (newLevel > alchemyLevel) {
            setProfessionLevel('alchemy', newLevel);
            addLootNotification({
                type: 'skill_increase',
                message: `Alchemy skill increased to ${Object.values(SKILL_LEVELS).find(s => s.level === newLevel)?.name}!`,
                timestamp: Date.now()
            });
        }

        // Notify successful crafting
        addLootNotification({
            type: 'item_crafted',
            item: resultItem,
            quantity: recipe.resultQuantity || 1,
            recipe: recipe.name,
            timestamp: Date.now()
        });
    };

    const handleRecipeMouseEnter = (recipe, event) => {
        setTooltipPosition({
            x: event.clientX + 15,
            y: event.clientY - 10
        });
        setHoveredRecipe(recipe);
    };

    const handleRecipeMouseMove = (event) => {
        if (hoveredRecipe) {
            setTooltipPosition({
                x: event.clientX + 15,
                y: event.clientY - 10
            });
        }
    };

    const handleRecipeMouseLeave = () => {
        setHoveredRecipe(null);
    };

    const renderHeader = () => (
        <div className="alchemy-header">
            <div className="alchemy-title">
                <div className="profession-icon">
                    <img
                        src="https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg"
                        alt="Alchemy"
                        onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                    />
                </div>
                <div className="profession-info">
                    <h2>Alchemy</h2>
                    <div className="skill-info">
                        <span
                            className="skill-level"
                            style={{ color: getSkillLevelColor(alchemyLevel) }}
                        >
                            {skillLevelInfo?.name || 'Untrained'}
                        </span>
                        {alchemyLevel > 0 && (
                            <span className="skill-bonus">
                                (+{alchemyLevel} crafting bonus)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="alchemy-actions">
                <button
                    className="wow-button"
                    onClick={() => {
                        // Learn all alchemy recipes
                        allAlchemyRecipes.forEach(recipe => {
                            learnRecipe('alchemy', recipe.id);
                        });
                        addLootNotification({
                            type: 'crafting_success',
                            message: `Learned ${allAlchemyRecipes.length} alchemy recipes!`,
                            timestamp: Date.now()
                        });
                    }}
                    style={{ marginRight: '10px' }}
                >
                    Learn All Recipes
                </button>
                <button className="wow-button" onClick={onBack}>
                    Back to Professions
                </button>
            </div>
        </div>
    );

    const renderTabs = () => (
        <div className="alchemy-tabs">
            <button
                className={`alchemy-tab ${activeTab === 'recipes' ? 'active' : ''}`}
                onClick={() => setActiveTab('recipes')}
            >
                <span>Recipes</span>
                <span className="tab-count">({knownRecipes.length})</span>
            </button>
            <button
                className={`alchemy-tab ${activeTab === 'queue' ? 'active' : ''}`}
                onClick={() => setActiveTab('queue')}
            >
                <span>Queue</span>
                <span className="tab-count">({craftingQueue.length})</span>
            </button>
        </div>
    );

    const renderRecipes = () => (
        <div className="recipes-content">
            {knownRecipes.length === 0 ? (
                <div className="no-recipes">
                    <div className="no-recipes-icon">
                        <img 
                            src="https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg"
                            alt="No Recipes"
                        />
                    </div>
                    <h3>No Recipes Known</h3>
                    <p>You haven't learned any alchemy recipes yet.</p>
                    <p>Find recipe scrolls or learn from other alchemists to expand your knowledge.</p>
                </div>
            ) : (
                <div className="recipes-grid">
                    {knownRecipes.map(recipe => (
                        <div
                            key={recipe.id}
                            className="recipe-card"
                            onMouseEnter={(e) => handleRecipeMouseEnter(recipe, e)}
                            onMouseMove={handleRecipeMouseMove}
                            onMouseLeave={handleRecipeMouseLeave}
                        >
                            <div className="recipe-icon">
                                {(() => {
                                    const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
                                    return (
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${resultItem?.iconId || recipe.resultIcon || 'inv_potion_51'}.jpg`}
                                            alt={recipe.name}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                            }}
                                        />
                                    );
                                })()}
                            </div>
                            <div className="recipe-info">
                                <h4 className="recipe-name">{recipe.name}</h4>
                                {(() => {
                                    const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
                                    return (
                                        <div className="recipe-result-info">
                                            {resultItem?.description && (
                                                <p className="recipe-description">{resultItem.description}</p>
                                            )}
                                            {resultItem?.combatStats?.healthRestore && (
                                                <p className="recipe-effect">
                                                    Restores {resultItem.combatStats.healthRestore.value} Health
                                                </p>
                                            )}
                                            {resultItem?.combatStats?.manaRestore && (
                                                <p className="recipe-effect">
                                                    Restores {resultItem.combatStats.manaRestore.value} Mana
                                                </p>
                                            )}
                                        </div>
                                    );
                                })()}
                                <div className="recipe-requirements">
                                    <span className="required-level">
                                        Requires: {Object.values(SKILL_LEVELS).find(s => s.level === recipe.requiredLevel)?.name || 'Untrained'}
                                    </span>
                                </div>
                                <div className="recipe-materials">
                                    <h5>Materials:</h5>
                                    <div className="materials-list">
                                        {recipe.materials.map((material, index) => {
                                            const itemData = itemLibrary.find(item => item.id === material.itemId);
                                            // Find all inventory items that match this material's itemId using originalItemId
                                            const matchingItems = inventoryItems.filter(item => item.originalItemId === material.itemId);
                                            const availableQuantity = matchingItems.reduce((total, item) => total + (item.quantity || 1), 0);
                                            const hasEnough = availableQuantity >= material.quantity;

                                            return (
                                                <div key={index} className={`material-requirement ${hasEnough ? 'sufficient' : 'insufficient'}`}>
                                                    <div className="material-icon-small">
                                                        <img
                                                            src={`https://wow.zamimg.com/images/wow/icons/large/${itemData?.iconId || 'inv_misc_questionmark'}.jpg`}
                                                            alt={itemData?.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="material-text">
                                                        {itemData?.name || 'Unknown'}
                                                    </span>
                                                    <span className="material-count">
                                                        {availableQuantity}/{material.quantity}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="recipe-actions">
                                {(() => {
                                    const craftCheck = canCraftRecipe(recipe);
                                    return (
                                        <div className="craft-section">
                                            <button
                                                className="wow-button craft-button"
                                                disabled={!craftCheck.canCraft}
                                                onClick={() => craftItem(recipe)}
                                                title={craftCheck.reason || 'Craft this item'}
                                            >
                                                Craft
                                            </button>
                                            {!craftCheck.canCraft && (
                                                <div className="craft-error">
                                                    {craftCheck.reason}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );



    const renderQueue = () => (
        <div className="queue-content">
            <div className="queue-header">
                <h3>Crafting Queue</h3>
                <p>Items currently being crafted or completed.</p>
            </div>
            
            <div className="queue-empty">
                <div className="queue-empty-icon">
                    <img 
                        src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg"
                        alt="Empty Queue"
                    />
                </div>
                <h3>No Items in Queue</h3>
                <p>Start crafting recipes to see them appear here.</p>
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'queue') {
            return renderQueue();
        }
        return renderRecipes();
    };

    return (
        <div className="alchemy-interface">
            {renderHeader()}
            {renderTabs()}
            <div className="alchemy-content">
                {renderContent()}
            </div>

            {/* Recipe Tooltip - Show the actual item tooltip */}
            {hoveredRecipe && (
                <TooltipPortal>
                    <div
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        {(() => {
                            const resultItem = itemLibrary.find(item => item.id === hoveredRecipe.resultItemId);
                            return resultItem ? <ItemTooltip item={resultItem} /> : null;
                        })()}
                    </div>
                </TooltipPortal>
            )}
        </div>
    );
}

export default AlchemyInterface;
