import React, { useState } from 'react';
import useCraftingStore, { SKILL_LEVELS } from '../../store/craftingStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useChatStore from '../../store/chatStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';

function AlchemyInterface({ onBack, activeTab, onTabChange }) {
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredMaterial, setHoveredMaterial] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Crafting progress state
    const [craftingProgress, setCraftingProgress] = useState(new Map());
    const {
        getProfessionLevel,
        getProfessionExperience,
        getExperienceForNextLevel,
        gainExperience,
        getKnownRecipesForProfession,
        getRecipesForProfession,
        knowsRecipe,
        addToCraftingQueue,
        removeFromCraftingQueue,
        updateCraftingQueueItem,
        completeCraftingItem,
        setProfessionLevel,
        craftingQueue,
        learnRecipe
    } = useCraftingStore();

    const { items: inventoryItems, removeItem, addItemFromLibrary } = useInventoryStore();
    const { items: itemLibrary } = useItemStore();
    const { addLootNotification } = useChatStore();

    const alchemyLevel = getProfessionLevel('alchemy');
    const alchemyExperience = getProfessionExperience('alchemy');
    const experienceForNextLevel = getExperienceForNextLevel('alchemy');
    const skillLevelInfo = Object.values(SKILL_LEVELS).find(skill => skill.level === alchemyLevel);
    const knownRecipes = getKnownRecipesForProfession('alchemy');
    const allAlchemyRecipes = getRecipesForProfession('alchemy');

    // Calculate skill progress for the bar
    const getSkillProgress = () => {
        if (alchemyLevel >= 9) return 100; // Max level

        const currentLevelExp = alchemyLevel === 0 ? 0 : Object.values(SKILL_LEVELS).find(level => level.level === alchemyLevel)?.experienceRequired || 0;
        const nextLevelExp = experienceForNextLevel || currentLevelExp + 100;
        const currentExpInLevel = alchemyExperience - currentLevelExp;
        const expNeededForLevel = nextLevelExp - currentLevelExp;

        return Math.min(100, Math.max(0, (currentExpInLevel / expNeededForLevel) * 100));
    };





    // Add test materials for crafting
    const addTestMaterials = () => {
        const testMaterials = [
            { id: 'peacebloom', quantity: 10 },
            { id: 'silverleaf', quantity: 10 },
            { id: 'empty-vial', quantity: 5 },
            { id: 'distilled-water', quantity: 5 },
            { id: 'earthroot', quantity: 5 },
            { id: 'mageroyal', quantity: 5 },
            { id: 'crystal-vial', quantity: 3 },
            { id: 'alchemical-catalyst', quantity: 2 }
        ];

        testMaterials.forEach(material => {
            const itemData = itemLibrary.find(item => item.id === material.id);
            if (itemData) {
                for (let i = 0; i < material.quantity; i++) {
                    addItemFromLibrary(itemData, 1);
                }
            }
        });

        addLootNotification({
            type: 'item_received',
            message: 'Added test crafting materials to inventory!',
            timestamp: Date.now()
        });
    };

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

        // Add item to crafting queue and get the new item ID
        const newItemId = addToCraftingQueue({
            recipe: recipe,
            startTime: null, // Will be set when crafting starts
            totalTime: recipe.craftingTime || 5000,
            progress: 0,
            status: 'queued'
        });

        // Check if there's already an active crafting item
        const activeCrafting = craftingQueue.find(item => item.status === 'in_progress');

        // If nothing is currently crafting, start this item immediately
        if (!activeCrafting) {
            // Start crafting immediately since this is the first/only item
            setTimeout(() => {
                // Mark the item we just added as in progress
                updateCraftingQueueItem(newItemId, {
                    status: 'in_progress',
                    startTime: Date.now()
                });

                // Find the updated item to pass to the timer
                const craftingItem = craftingQueue.find(item => item.id === newItemId);
                if (craftingItem) {
                    startCraftingTimer(craftingItem);
                }
            }, 100); // Small delay to ensure state updates
        }

        addLootNotification({
            type: 'crafting_started',
            message: `Started crafting ${recipe.name}...`,
            timestamp: Date.now()
        });
    };

    const startCraftingTimer = (craftingItem) => {
        const craftingTime = craftingItem.totalTime || craftingItem.recipe.craftingTime || 5000;
        const updateInterval = 100; // Update every 100ms for smooth progress
        const totalSteps = craftingTime / updateInterval;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = (currentStep / totalSteps) * 100;

            setCraftingProgress(prev => {
                const newProgress = new Map(prev);
                newProgress.set(craftingItem.recipe.id, Math.min(100, progress));
                return newProgress;
            });

            if (currentStep >= totalSteps) {
                clearInterval(timer);
                completeCrafting(craftingItem);
            }
        }, updateInterval);

        // Store the timer reference (though we don't use it currently)
        // This could be useful for cleanup if needed
    };

    const completeCrafting = (craftingItem) => {
        const recipe = craftingItem.recipe;

        // Remove completed item from queue
        removeFromCraftingQueue(craftingItem.id);

        // Add crafted item to inventory
        const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
        if (resultItem) {
            addItemFromLibrary(resultItem, recipe.resultQuantity || 1);
        }

        // Add experience and potentially level up
        const experienceResult = gainExperience('alchemy', recipe.experienceGained || 1);
        if (experienceResult && experienceResult.leveledUp) {
            addLootNotification({
                type: 'skill_increase',
                message: `Alchemy skill increased to ${Object.values(SKILL_LEVELS).find(s => s.level === experienceResult.newLevel)?.name}!`,
                timestamp: Date.now()
            });
        } else {
            // Show experience gained notification
            addLootNotification({
                type: 'experience_gained',
                message: `Gained ${recipe.experienceGained || 1} Alchemy experience.`,
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

        // Clean up progress
        setCraftingProgress(prev => {
            const newProgress = new Map(prev);
            newProgress.delete(recipe.id);
            return newProgress;
        });

        // Start next queued item if available
        setTimeout(() => {
            // Get the updated queue after the current item was removed
            const queuedItems = craftingQueue.filter(item => item.status === 'queued');

            if (queuedItems.length > 0) {
                // Start the next item in queue
                const nextItem = queuedItems[0];
                updateCraftingQueueItem(nextItem.id, {
                    status: 'in_progress',
                    startTime: Date.now()
                });
                startCraftingTimer(nextItem);
            }
        }, 500); // Small delay to ensure state updates
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

    const handleItemMouseEnter = (item, event) => {
        setTooltipPosition({
            x: event.clientX + 15,
            y: event.clientY - 10
        });
        setHoveredItem(item);
    };

    const handleItemMouseMove = (event) => {
        if (hoveredItem) {
            setTooltipPosition({
                x: event.clientX + 15,
                y: event.clientY - 10
            });
        }
    };

    const handleItemMouseLeave = () => {
        setHoveredItem(null);
    };

    const handleMaterialMouseEnter = (material, event) => {
        setTooltipPosition({
            x: event.clientX + 15,
            y: event.clientY - 10
        });
        setHoveredMaterial(material);
    };

    const handleMaterialMouseMove = (event) => {
        if (hoveredMaterial) {
            setTooltipPosition({
                x: event.clientX + 15,
                y: event.clientY - 10
            });
        }
    };

    const handleMaterialMouseLeave = () => {
        setHoveredMaterial(null);
    };


    const renderRecipes = () => (
        <div className="recipes-content">
            <div className="recipes-header">
                {/* Recipes Tabs with Skill Bar */}
                <div className="recipes-header-tabs">
                    {/* Active Crafting Progress */}
                    <div className="tabs-crafting-progress">
                        {(() => {
                            const activeItem = craftingQueue.find(item => item.status === 'in_progress');
                            return activeItem ? (
                                <div className="active-crafting-compact">
                                    <div className="crafting-progress-icon">
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${activeItem.recipe.resultIcon || 'inv_potion_51'}.jpg`}
                                            alt={activeItem.recipe.name}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="crafting-progress-meter">
                                        <div className="crafting-progress-header-compact">
                                            <span className="crafting-item-name-compact">{activeItem.recipe.name}</span>
                                            <span className="crafting-time-remaining-compact">
                                                {Math.max(0, Math.ceil((activeItem.totalTime - (Date.now() - activeItem.startTime)) / 1000))}s
                                            </span>
                                        </div>
                                        <div className="crafting-progress-bar-compact">
                                            <div
                                                className="crafting-progress-fill-compact"
                                                style={{
                                                    width: `${craftingProgress.get(activeItem.recipe.id) || 0}%`,
                                                    background: `linear-gradient(90deg, ${getSkillLevelColor(alchemyLevel)}, ${getSkillLevelColor(Math.min(9, alchemyLevel + 1))})`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>

                    {/* Crafting Queue Icons */}
                    {(() => {
                        const queuedItems = craftingQueue.filter(item => item.status === 'queued');
                        return queuedItems.length > 0 ? (
                            <div className="tabs-queue-icons">
                                {queuedItems.slice(0, 3).map((queuedItem, index) => (
                                    <div key={queuedItem.id || index} className="queue-icon" title={queuedItem.recipe.name}>
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${queuedItem.recipe.resultIcon || 'inv_potion_51'}.jpg`}
                                            alt={queuedItem.recipe.name}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                            }}
                                        />
                                        <div className="queue-position">{index + 1}</div>
                                    </div>
                                ))}
                                {queuedItems.length > 3 && (
                                    <div className="queue-overflow" title={`${queuedItems.length - 3} more items queued`}>
                                        +{queuedItems.length - 3}
                                    </div>
                                )}
                            </div>
                        ) : null;
                    })()}

                    {/* Add Test Materials Button */}
                    <div className="tabs-test-materials">
                        <button
                            className="wow-button crafting-test-button"
                            onClick={addTestMaterials}
                            title="Add test crafting materials to inventory"
                        >
                            Add Test Materials
                        </button>
                    </div>

                    {/* Skill Progress Bar */}
                    <div className="tabs-skill-bar">
                        <div className="skill-progress-container">
                            <div className="skill-progress-bar">
                                <div
                                    className="skill-progress-fill"
                                    style={{
                                        width: `${getSkillProgress()}%`,
                                        background: `linear-gradient(90deg, ${getSkillLevelColor(alchemyLevel)}, ${getSkillLevelColor(Math.min(9, alchemyLevel + 1))})`
                                    }}
                                ></div>
                                <div className="skill-progress-text">
                                    {alchemyLevel >= 9 ? (
                                        <span className="skill-maxed">Master Alchemist</span>
                                    ) : (
                                        <>
                                            <span className="skill-exp-current">{alchemyExperience}</span>
                                            <span className="skill-exp-separator"> / </span>
                                            <span className="skill-exp-required">{experienceForNextLevel}</span>
                                            <span className="skill-exp-label"> XP</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                <div className="recipes-icon-grid">
                    {knownRecipes.map(recipe => (
                        <div
                            key={recipe.id}
                            className="recipe-icon-container"
                            onMouseEnter={(e) => handleRecipeMouseEnter(recipe, e)}
                            onMouseMove={handleRecipeMouseMove}
                            onMouseLeave={handleRecipeMouseLeave}
                            onClick={() => setSelectedRecipe(recipe)}
                            title={`Click to view: ${recipe.name}`}
                        >
                            <div className="recipe-icon-wrapper">
                                {(() => {
                                    const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
                                    const craftCheck = canCraftRecipe(recipe);
                                    return (
                                        <div className={`recipe-icon-frame ${craftCheck.canCraft ? 'craftable' : 'not-craftable'}`}>
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${resultItem?.iconId || recipe.resultIcon || 'inv_potion_51'}.jpg`}
                                                alt={recipe.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                                }}
                                            />
                                            {!craftCheck.canCraft && (
                                                <div className="craft-overlay">
                                                    <span>✗</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                                <div className="recipe-icon-name">
                                    {recipe.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );



    const renderRecipeCrafting = () => {
        const resultItem = itemLibrary.find(item => item.id === selectedRecipe.resultItemId);
        const craftCheck = canCraftRecipe(selectedRecipe);

        return (
            <div className="recipe-crafting-content">
                <div className="recipe-crafting-header">
                    <button
                        className="back-to-recipes-btn"
                        onClick={() => setSelectedRecipe(null)}
                        title="Back to Recipes"
                    >
                        ← Back to Recipes
                    </button>
                    <div className="recipe-crafting-title">
                        <h2>{selectedRecipe.name}</h2>
                        <div
                            className="recipe-crafting-icon hoverable"
                            onMouseEnter={(e) => resultItem && handleItemMouseEnter(resultItem, e)}
                            onMouseMove={handleItemMouseMove}
                            onMouseLeave={handleItemMouseLeave}
                        >
                            <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${resultItem?.iconId || selectedRecipe.resultIcon || 'inv_potion_51'}.jpg`}
                                alt={selectedRecipe.name}
                                onError={(e) => {
                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="recipe-crafting-details">
                    <div className="recipe-description-section">
                        {resultItem?.description && (
                            <div className="recipe-description">
                                <h4>Item Description</h4>
                                <p>{resultItem.description}</p>
                            </div>
                        )}

                        <div className="recipe-requirements">
                            <div className="requirement-item">
                                <span className="requirement-label">Skill Required:</span>
                                <span className="requirement-value">
                                    {Object.values(SKILL_LEVELS).find(s => s.level === selectedRecipe.requiredLevel)?.name || 'Untrained'}
                                </span>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-label">Your Skill:</span>
                                <span className="requirement-value" style={{
                                    color: alchemyLevel >= selectedRecipe.requiredLevel ? '#4caf50' : '#f44336'
                                }}>
                                    {Object.values(SKILL_LEVELS).find(s => s.level === alchemyLevel)?.name || 'Untrained'}
                                </span>
                            </div>
                            <div className="requirement-item">
                                <span className="requirement-label">Crafting Time:</span>
                                <span className="requirement-value">
                                    {selectedRecipe.craftingTimeDisplay || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="recipe-materials-section">
                        <h4>Materials Required</h4>
                        <div className="materials-grid">
                            {selectedRecipe.materials.map((material, index) => {
                                const itemData = itemLibrary.find(item => item.id === material.itemId);
                                const matchingItems = inventoryItems.filter(item => item.originalItemId === material.itemId);
                                const availableQuantity = matchingItems.reduce((total, item) => total + (item.quantity || 1), 0);
                                const hasEnough = availableQuantity >= material.quantity;

                                return (
                                    <div key={index} className={`material-item-large ${hasEnough ? 'sufficient' : 'insufficient'}`}>
                                        <div
                                            className="material-icon-large hoverable"
                                            onMouseEnter={(e) => itemData && handleMaterialMouseEnter(itemData, e)}
                                            onMouseMove={handleMaterialMouseMove}
                                            onMouseLeave={handleMaterialMouseLeave}
                                        >
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${itemData?.iconId || 'inv_misc_questionmark'}.jpg`}
                                                alt={itemData?.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="material-info">
                                            <div className="material-name">{itemData?.name || 'Unknown Item'}</div>
                                            <div className="material-count">
                                                {availableQuantity}/{material.quantity}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="recipe-crafting-actions">
                        <div className="crafting-info">
                            <div className="crafting-result">
                                <span className="result-label">Creates:</span>
                                <span
                                    className="result-value hoverable"
                                    onMouseEnter={(e) => resultItem && handleItemMouseEnter(resultItem, e)}
                                    onMouseMove={handleItemMouseMove}
                                    onMouseLeave={handleItemMouseLeave}
                                >
                                    {selectedRecipe.resultQuantity > 1 ? `${selectedRecipe.resultQuantity}x ` : ''}
                                    {resultItem?.name || selectedRecipe.name}
                                </span>
                            </div>
                            {selectedRecipe.experienceGained && (
                                <div className="crafting-xp">
                                    <span className="xp-label">Experience Gained:</span>
                                    <span className="xp-value">+{selectedRecipe.experienceGained} Alchemy</span>
                                </div>
                            )}
                        </div>

                        <div className="crafting-buttons">
                            <button
                                className="wow-button craft-button-large"
                                disabled={!craftCheck.canCraft}
                                onClick={() => {
                                    craftItem(selectedRecipe);
                                }}
                                title={craftCheck.reason || 'Craft this item'}
                            >
                                Craft Recipe
                            </button>
                            {!craftCheck.canCraft && (
                                <div className="craft-error-large">
                                    {craftCheck.reason}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderQueue = () => (
        <div className="queue-content">
            {craftingQueue.length === 0 ? (
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
            ) : (
                <div className="queue-active">
                    <h3>Active Crafting Operations</h3>
                    <div className="queue-items">
                        {craftingQueue.map((craftingItem, index) => {
                            const progress = craftingProgress.get(craftingItem.recipe.id) || 0;
                            const remainingTime = craftingItem.totalTime - (Date.now() - craftingItem.startTime);
                            const timeRemaining = Math.max(0, Math.ceil(remainingTime / 1000));

                            return (
                                <div key={craftingItem.id || index} className="queue-item">
                                    <div className="queue-item-header">
                                        <div className="queue-item-info">
                                            <div className="queue-item-icon">
                                                <img
                                                    src={`https://wow.zamimg.com/images/wow/icons/large/${craftingItem.recipe.resultIcon || 'inv_potion_51'}.jpg`}
                                                    alt={craftingItem.recipe.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="queue-item-details">
                                                <div className="queue-item-name">{craftingItem.recipe.name}</div>
                                                <div className="queue-item-time">{timeRemaining}s remaining</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="queue-progress-bar">
                                        <div
                                            className="queue-progress-fill"
                                            style={{
                                                width: `${progress}%`,
                                                background: `linear-gradient(90deg, ${getSkillLevelColor(alchemyLevel)}, ${getSkillLevelColor(Math.min(9, alchemyLevel + 1))})`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'queue') {
            return renderQueue();
        }
        if (selectedRecipe) {
            return renderRecipeCrafting();
        }
        return renderRecipes();
    };

    return (
        <div className="alchemy-interface">
            <div className="alchemy-content">
                {renderContent()}
            </div>

            {/* Item and Material Tooltips */}
            {(hoveredItem || hoveredMaterial) && (
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
                        {hoveredItem && <ItemTooltip item={hoveredItem} />}
                        {hoveredMaterial && <ItemTooltip item={hoveredMaterial} />}
                    </div>
                </TooltipPortal>
            )}

            {/* Recipe Tooltip - Show the actual item tooltip only when not in crafting view */}
            {hoveredRecipe && !selectedRecipe && (
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
