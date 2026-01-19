import React, { useState, useEffect } from 'react';
import useCraftingStore, { SKILL_LEVELS } from '../../store/craftingStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import useChatStore from '../../store/chatStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getIconUrl } from '../../utils/assetManager';

function FirstAidInterface({ onBack, activeTab, onTabChange }) {
    const [hoveredRecipe, setHoveredRecipe] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredMaterial, setHoveredMaterial] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [selectedRecipe, setSelectedRecipe] = useState(null);


    // Simple crafting system
    const [craftingTimer, setCraftingTimer] = useState(null);
    const [currentCraftingItem, setCurrentCraftingItem] = useState(null);
    const [, forceUpdate] = useState(0);
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
        craftingQueue = [],
        learnRecipe,
        knownRecipes: storeKnownRecipes = {},
        professionLevels = {},
        professionExperience = {},
        availableRecipes = []
    } = useCraftingStore();

    const { items: inventoryItems, removeItem, addItemFromLibrary } = useInventoryStore();
    const { items: itemLibrary } = useItemStore();
    const { addLootNotification } = useChatStore();

    // Subscribe directly to store values to ensure re-renders when they change
    const firstAidLevel = professionLevels?.['first-aid'] ?? SKILL_LEVELS.UNTRAINED.level;
    const firstAidExperience = professionExperience?.['first-aid'] ?? 0;

    // Calculate experience for next level
    const experienceForNextLevel = (() => {
        if (firstAidLevel >= 9) return null; // Max level reached
        const nextLevel = firstAidLevel + 1;
        const skillLevel = Object.values(SKILL_LEVELS).find(level => level.level === nextLevel);
        return skillLevel ? skillLevel.experienceRequired : null;
    })();
    const skillLevelInfo = Object.values(SKILL_LEVELS).find(skill => skill.level === firstAidLevel);
    // Subscribe to knownRecipes directly to trigger re-renders when it changes
    const knownRecipes = (typeof getKnownRecipesForProfession === 'function')
        ? getKnownRecipesForProfession('first-aid')
        : (() => {
            const knownIds = storeKnownRecipes?.['first-aid'] || [];
            return (availableRecipes || []).filter(recipe =>
                recipe.profession === 'first-aid' && knownIds.includes(recipe.id)
            );
        })();
    const allFirstAidRecipes = (typeof getRecipesForProfession === 'function')
        ? getRecipesForProfession('first-aid')
        : ((availableRecipes || []).filter(recipe => recipe.profession === 'first-aid'));

    // Access knownRecipes from store to create subscription
    const firstAidKnownRecipes = storeKnownRecipes?.['first-aid'] || [];

    // Force re-render when knownRecipes changes
    useEffect(() => {
        // This ensures the component re-renders when knownRecipes changes
        console.log('FirstAidInterface: knownRecipes updated', firstAidKnownRecipes);
    }, [firstAidKnownRecipes]);


    // Removed excessive logging that was firing on every render

    // Clear any invalid items from previous sessions (items with startTime set to their ID)
    useEffect(() => {
        const invalidItems = craftingQueue.filter(item => item.startTime && item.startTime.toString() === item.id);
        if (invalidItems.length > 0) {
            console.log('Crafting: Clearing', invalidItems.length, 'invalid items from queue');
            invalidItems.forEach(item => {
                if (typeof removeFromCraftingQueue === 'function') {
                    removeFromCraftingQueue(item.id);
                } else {
                    // Fallback: directly update the store
                    useCraftingStore.setState(state => ({
                        craftingQueue: state.craftingQueue.filter(queueItem => queueItem.id !== item.id)
                    }));
                }
            });
        }
    }, []); // Only run once on mount

    // Automatically start crafting when items are queued
    useEffect(() => {
        // Only start if we have queued items AND no current crafting is happening
        const queuedItems = craftingQueue.filter(item => item.status === 'queued' && item.recipe?.profession === 'first-aid');
        if (queuedItems.length > 0 && !currentCraftingItem && !craftingTimer) {
            // Add a small delay to prevent rapid-fire starts
            const timeoutId = setTimeout(() => {
                if (!currentCraftingItem && !craftingTimer) {
                    startNextItem();
                }
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [craftingQueue, currentCraftingItem, craftingTimer]);


    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (craftingTimer) {
                clearInterval(craftingTimer);
                setCraftingTimer(null);
            }
        };
    }, [craftingTimer]);

    // Calculate skill progress for the bar
    const getSkillProgress = () => {
        if (firstAidLevel >= 9) return 100; // Max level

        const currentLevelExp = firstAidLevel === 0 ? 0 : Object.values(SKILL_LEVELS).find(level => level.level === firstAidLevel)?.experienceRequired || 0;
        const nextLevelExp = experienceForNextLevel || currentLevelExp + 100;
        const currentExpInLevel = firstAidExperience - currentLevelExp;
        const expNeededForLevel = nextLevelExp - currentLevelExp;

        return Math.min(100, Math.max(0, (currentExpInLevel / expNeededForLevel) * 100));
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
        if (firstAidLevel < recipe.requiredLevel) {
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

        // Add item to crafting queue (startTime will be set when timer starts)
        let newItemId;
        if (typeof addToCraftingQueue === 'function') {
            newItemId = addToCraftingQueue({
                recipe: recipe,
                startTime: null, // Will be set when timer starts
                totalTime: recipe.craftingTime || 5000,
                progress: 0,
                status: 'queued' // Will change to in_progress when timer starts
            });
        } else {
            // Fallback: directly update the store
            newItemId = Date.now().toString();
            const itemToAdd = {
                recipe: recipe,
                id: newItemId,
                startTime: null,
                totalTime: recipe.craftingTime || 5000,
                progress: 0,
                status: 'queued'
            };
            useCraftingStore.setState(state => ({
                craftingQueue: [...state.craftingQueue, itemToAdd]
            }));
        }

        console.log('Crafting: Added item to queue with ID:', newItemId, 'for recipe:', recipe.name);

        // Create the crafting item object
        const craftingItem = {
            id: newItemId,
            recipe: recipe,
            startTime: null, // Will be set when timer starts
            totalTime: recipe.craftingTime || 5000,
            progress: 0,
            status: 'queued'
        };

        // Removed direct call to startCraftingTimer - useEffect will handle starting

        addLootNotification({
            type: 'crafting_started',
            message: `Started crafting ${recipe.name}...`,
            timestamp: Date.now()
        });
    };

    const startCraftingTimer = (craftingItem) => {
        // Simply trigger starting the next item
        setTimeout(() => startNextItem(), 10);
    };


    // Simple function to start the next queued item
    const startNextItem = () => {
        if (currentCraftingItem) return; // Already crafting

        const queuedItems = (craftingQueue || []).filter(item => item.status === 'queued' && item.recipe?.profession === 'first-aid');
        if (queuedItems.length === 0) return; // Nothing to craft

        const item = queuedItems[0];
        const startTime = Date.now();

        console.log('Crafting: STARTING', item.recipe?.name, '(', item.id, ')');

        // Update item status
        if (typeof updateCraftingQueueItem === 'function') {
            updateCraftingQueueItem(item.id, {
                status: 'in_progress',
                startTime: startTime
            });
        } else {
            // Fallback: directly update the store
            useCraftingStore.setState(state => ({
                craftingQueue: state.craftingQueue.map(queueItem =>
                    queueItem.id === item.id ? { ...queueItem, status: 'in_progress', startTime: startTime } : queueItem
                )
            }));
        }

        setCurrentCraftingItem({ ...item, startTime });

        // Start timer
        const craftingTime = item.totalTime || item.recipe?.craftingTime || 5000;

        const timer = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(100, (elapsed / craftingTime) * 100);

            // Removed milestone logs to reduce console spam

            // Force UI update every tick to make progress smooth
            setCurrentCraftingItem(prev => {
                if (prev) {
                    return { ...prev, _update: Date.now(), _progress: progress };
                }
                return null;
            });

            if (elapsed >= craftingTime) {
                console.log('Crafting: COMPLETED', item.recipe?.name, '(', item.id, ')');
                clearInterval(timer);
                setCraftingTimer(null);
                setCurrentCraftingItem(null);
                completeCrafting(item);

                // useEffect will handle starting the next item
            }
        }, 100);

        setCraftingTimer(timer);
    };

    const completeCrafting = (craftingItem) => {
        const recipe = craftingItem.recipe;

        // Remove completed item from queue
        if (typeof removeFromCraftingQueue === 'function') {
            removeFromCraftingQueue(craftingItem.id);
        } else {
            // Fallback: directly update the store
            useCraftingStore.setState(state => ({
                craftingQueue: state.craftingQueue.filter(queueItem => queueItem.id !== craftingItem.id)
            }));
        }

        // Add crafted item to inventory
        const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
        if (resultItem) {
            addItemFromLibrary(resultItem, recipe.resultQuantity || 1);
        }

        // Add experience and potentially level up
        const xpGained = recipe.experienceGained || 1;
        let experienceResult = null;
        if (typeof gainExperience === 'function') {
            experienceResult = gainExperience('first-aid', xpGained);
        } else {
            // Fallback: manually calculate experience and level up
            const store = useCraftingStore.getState();
            const currentLevel = store.professionLevels?.['first-aid'] ?? SKILL_LEVELS.UNTRAINED.level;
            const currentExperience = store.professionExperience?.['first-aid'] ?? 0;

            if (currentLevel >= 9) {
                experienceResult = { newLevel: currentLevel, leveledUp: false };
            } else {
                const newExperience = currentExperience + xpGained;
                const nextLevelExpRequired = Object.values(SKILL_LEVELS).find(level => level.level === currentLevel + 1)?.experienceRequired;
                let newLevel = currentLevel;
                let leveledUp = false;

                if (nextLevelExpRequired !== null && newExperience >= nextLevelExpRequired) {
                    newLevel = currentLevel + 1;
                    leveledUp = true;
                }

                useCraftingStore.setState(state => ({
                    professionExperience: {
                        ...state.professionExperience,
                        'first-aid': newExperience
                    },
                    professionLevels: {
                        ...state.professionLevels,
                        'first-aid': newLevel
                    }
                }));

                experienceResult = { newLevel, leveledUp };
            }
        }

        if (experienceResult && experienceResult.leveledUp) {
            addLootNotification({
                type: 'skill_increase',
                message: `First Aid skill increased to ${Object.values(SKILL_LEVELS).find(s => s.level === experienceResult.newLevel)?.name}!`,
                timestamp: Date.now()
            });
        } else {
            // Show experience gained notification
            addLootNotification({
                type: 'experience_gained',
                message: `Gained ${xpGained} First Aid experience.`,
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


        // No need to start next item - all items start immediately when queued
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
                    {/* Active Crafting Progress - Always visible */}
                    <div className="tabs-crafting-progress">
                        {(() => {
                            const activeItem = currentCraftingItem;
                            return (
                                <div className="active-crafting-compact">
                                    <div className="crafting-progress-icon">
                                        <img
                                            src={getIconUrl(activeItem?.recipe.resultIcon || 'inv_misc_bandage_01', 'items')}
                                            alt={activeItem?.recipe.name || 'No Active Crafting'}
                                            onError={(e) => {
                                                e.target.src = getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items');
                                            }}
                                        />
                                    </div>
                                    <div className="crafting-progress-meter">
                                        <div className="crafting-progress-header-compact">
                                            <span className="crafting-item-name-compact">
                                                {activeItem?.recipe.name || 'No Active Crafting'}
                                            </span>
                                            <span className="crafting-time-remaining-compact">
                                                {activeItem ?
                                                    Math.max(0, Math.ceil((activeItem.totalTime - (Date.now() - activeItem.startTime)) / 1000)) + 's' :
                                                    '--'
                                                }
                                            </span>
                                        </div>
                                        <div className="crafting-progress-bar-compact">
                                            {(() => {
                                                let progressValue = 0;
                                                if (activeItem && activeItem.startTime) {
                                                    const elapsed = Date.now() - activeItem.startTime;
                                                    const craftingTime = activeItem.totalTime || activeItem.recipe?.craftingTime || 5000;
                                                    progressValue = Math.min(100, (elapsed / craftingTime) * 100);
                                                }
                                                const timeRemaining = activeItem && activeItem.startTime ?
                                                    Math.max(0, Math.ceil((activeItem.totalTime - (Date.now() - activeItem.startTime)) / 1000)) : 0;
                                                return (
                                                    <div
                                                        className="crafting-progress-fill-compact"
                                                        style={{
                                                            width: `${progressValue}%`,
                                                            background: activeItem ?
                                                                `linear-gradient(90deg, ${getSkillLevelColor(firstAidLevel)}, ${getSkillLevelColor(Math.min(9, firstAidLevel + 1))})` :
                                                                '#666'
                                                        }}
                                                    ></div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Crafting Queue Icons */}
                    {(() => {
                        const queuedItems = (craftingQueue || []).filter(item => item.status === 'queued' && item.recipe?.profession === 'first-aid');
                        return queuedItems.length > 0 ? (
                            <div className="tabs-queue-icons">
                                {queuedItems.slice(0, 3).map((queuedItem, index) => (
                                    <div key={queuedItem.id || index} className="queue-icon" title={queuedItem.recipe.name}>
                                        <img
                                            src={getIconUrl(queuedItem.recipe.resultIcon || 'inv_misc_bandage_01', 'items')}
                                            alt={queuedItem.recipe.name}
                                            onError={(e) => {
                                                e.target.src = getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items');
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


                    {/* Skill Progress Bar */}
                    <div className="tabs-skill-bar">
                        <div className="skill-progress-container">
                            <div className="skill-progress-bar">
                                <div
                                    className="skill-progress-fill"
                                    style={{
                                        width: `${getSkillProgress()}%`,
                                        background: `linear-gradient(90deg, ${getSkillLevelColor(firstAidLevel)}, ${getSkillLevelColor(Math.min(9, firstAidLevel + 1))})`
                                    }}
                                ></div>
                                <div className="skill-progress-text">
                                    {firstAidLevel >= 9 ? (
                                        <span className="skill-maxed">Master Medic</span>
                                    ) : experienceForNextLevel !== null && experienceForNextLevel !== undefined ? (
                                        <>
                                            <span className="skill-exp-current">{firstAidExperience}</span>
                                            <span className="skill-exp-separator"> / </span>
                                            <span className="skill-exp-required">{experienceForNextLevel}</span>
                                            <span className="skill-exp-label"> XP</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="skill-exp-current">{firstAidExperience}</span>
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
                            src="getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items')"
                            alt="No Recipes"
                        />
                    </div>
                    <h3>No Recipes Known</h3>
                    <p>You haven't learned any first aid recipes yet.</p>
                    <p>Find recipe scrolls or learn from other medics to expand your knowledge.</p>
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
                            onClick={() => {
                                setSelectedRecipe(recipe);
                            }}
                            title={`Click to view: ${recipe.name}`}
                        >
                            <div className="recipe-icon-wrapper">
                                {(() => {
                                    const resultItem = itemLibrary.find(item => item.id === recipe.resultItemId);
                                    const craftCheck = canCraftRecipe(recipe);
                                    return (
                                        <div className={`recipe-icon-frame ${craftCheck.canCraft ? 'craftable' : 'not-craftable'}`}>
                                            <img
                                                src={getIconUrl(resultItem?.iconId || recipe.resultIcon || 'inv_misc_bandage_01', 'items')}
                                                alt={recipe.name}
                                                onError={(e) => {
                                                    e.target.src = getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items');
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
                                src={`https://wow.zamimg.com/images/wow/icons/large/${resultItem?.iconId || selectedRecipe.resultIcon || 'inv_misc_bandage_01'}.jpg`}
                                alt={selectedRecipe.name}
                                onError={(e) => {
                                    e.target.src = getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items');
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
                                    color: firstAidLevel >= selectedRecipe.requiredLevel ? '#4caf50' : '#f44336'
                                }}>
                                    {Object.values(SKILL_LEVELS).find(s => s.level === firstAidLevel)?.name || 'Untrained'}
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
                                                src={getIconUrl(itemData?.iconId || 'inv_misc_questionmark', 'items')}
                                                alt={itemData?.name}
                                                onError={(e) => {
                                                    e.target.src = getIconUrl('inv_misc_questionmark', 'items');
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
                                    <span className="xp-value">+{selectedRecipe.experienceGained} First Aid</span>
                                </div>
                            )}
                        </div>

                        <div className="crafting-buttons">
                            <button
                                className="wow-button craft-button-large"
                                disabled={!craftCheck.canCraft}
                                onClick={() => {
                                    console.log('Crafting: Craft Recipe button clicked for', selectedRecipe.name);
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

    const renderQueue = () => {
        const queuedItems = (craftingQueue || []).filter(item => item.status === 'queued' && item.recipe?.profession === 'first-aid');

        return (
            <div className="queue-content">
                {queuedItems.length === 0 ? (
                    <div className="queue-empty">
                        <div className="queue-empty-icon">
                            <img
                                src="getIconUrl('brown-backpack-sleeping-bag', 'items')"
                                alt="Empty Queue"
                            />
                        </div>
                        <h3>No Items in Queue</h3>
                        <p>Start crafting recipes to see them appear here.</p>
                    </div>
                ) : (
                    <div className="queue-active">
                        <h3>Queued Crafting Operations</h3>
                        <div className="queue-items">
                            {queuedItems.map((craftingItem, index) => {
                                let progress = 0;
                                let timeRemaining = 0;
                                if (craftingItem.status === 'in_progress' && craftingItem.startTime) {
                                    const elapsed = Date.now() - craftingItem.startTime;
                                    const craftingTime = craftingItem.totalTime || craftingItem.recipe?.craftingTime || 5000;
                                    progress = Math.min(100, (elapsed / craftingTime) * 100);
                                    timeRemaining = Math.max(0, Math.ceil((craftingTime - elapsed) / 1000));
                                }

                                return (
                                    <div key={craftingItem.id || index} className="queue-item">
                                        <div className="queue-item-header">
                                            <div className="queue-item-info">
                                                <div className="queue-item-icon">
                                                    <img
                                                        src={getIconUrl(craftingItem.recipe.resultIcon || 'inv_misc_bandage_01', 'items')}
                                                        alt={craftingItem.recipe.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('animal-fabric-bandage-folded-orange-tan-red-details', 'items');
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
                                                    background: `linear-gradient(90deg, ${getSkillLevelColor(firstAidLevel)}, ${getSkillLevelColor(Math.min(9, firstAidLevel + 1))})`
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
    };

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

export default FirstAidInterface;

