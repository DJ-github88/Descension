import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';
import useItemStore from '../../store/itemStore';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import ExternalRecipePreview from './ExternalRecipePreview';
import '../../styles/recipe-wizard.css';

function RecipeWizard({ isOpen, onClose, onSave, onWindowPositionChange, onRecipeDataChange }) {
    const { items: itemLibrary, addItem } = useItemStore();
    const { addAvailableRecipe } = useCraftingStore();
    
    const [recipeData, setRecipeData] = useState({
        name: '',
        profession: '',
        description: '',
        requiredLevel: 0,
        resultItemId: '',
        resultQuantity: 1,
        materials: [],
        craftingTime: 5000,
        experienceGained: 1,
        quality: 'uncommon' // Default quality for recipes
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showItemTooltip, setShowItemTooltip] = useState({ visible: false, x: 0, y: 0, item: null });
    const [windowPosition, setWindowPosition] = useState({ x: 150, y: 50 });
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 }); // Smaller window size

    const steps = [
        'Basic Info',
        'Result Item',
        'Materials',
        'Requirements'
    ];

    const updateRecipeData = (updates) => {
        const newData = { ...recipeData, ...updates };
        setRecipeData(newData);
        if (onRecipeDataChange) {
            onRecipeDataChange(newData);
        }
    };

    // Initialize external preview with current recipe data
    useEffect(() => {
        if (onRecipeDataChange && isOpen) {
            onRecipeDataChange(recipeData);
        }
    }, [isOpen, onRecipeDataChange, recipeData]);

    // Tooltip handlers (matching item library pattern)
    const handleItemMouseEnter = (e, item) => {
        setShowItemTooltip({
            visible: true,
            x: e.clientX + 15,
            y: e.clientY - 10,
            item
        });
    };

    const handleItemMouseMove = (e, item) => {
        if (showItemTooltip.visible && showItemTooltip.item?.id === item.id) {
            setShowItemTooltip({
                ...showItemTooltip,
                x: e.clientX + 15,
                y: e.clientY - 10
            });
        }
    };

    const handleItemMouseLeave = () => {
        setShowItemTooltip({ visible: false, x: 0, y: 0, item: null });
    };

    const addMaterial = (itemId) => {
        const existingMaterial = recipeData.materials.find(m => m.itemId === itemId);
        if (existingMaterial) {
            updateRecipeData({
                materials: recipeData.materials.map(m => 
                    m.itemId === itemId ? { ...m, quantity: m.quantity + 1 } : m
                )
            });
        } else {
            updateRecipeData({
                materials: [...recipeData.materials, { itemId, quantity: 1 }]
            });
        }
    };

    const removeMaterial = (itemId) => {
        updateRecipeData({
            materials: recipeData.materials.filter(m => m.itemId !== itemId)
        });
    };

    const updateMaterialQuantity = (itemId, quantity) => {
        updateRecipeData({
            materials: recipeData.materials.map(m => 
                m.itemId === itemId ? { ...m, quantity: Math.max(1, quantity) } : m
            )
        });
    };

    const getFilteredItems = (filterFn) => {
        return itemLibrary.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch && filterFn(item);
        });
    };

    const saveRecipe = () => {
        const recipeId = `${recipeData.name.toLowerCase().replace(/\s+/g, '-')}-recipe`;
        const recipe = {
            id: recipeId,
            ...recipeData
        };

        // Add the recipe to the crafting system
        addAvailableRecipe(recipe);

        // Create a recipe scroll item that can be learned
        const resultItem = itemLibrary.find(item => item.id === recipeData.resultItemId);
        const recipeScrollItem = {
            id: `${recipeId}-scroll`,
            name: `Recipe: ${recipeData.name}`,
            description: `A scroll containing the formula for brewing ${resultItem?.name || 'Unknown Item'}. Right-click to learn.`,
            type: 'miscellaneous',
            subtype: 'recipe',
            quality: recipeData.quality || 'uncommon',
            iconId: 'inv_scroll_03',
            value: {
                gold: 0,
                silver: Math.max(1, Math.floor(recipeData.requiredLevel * 2.5)),
                copper: 50
            },
            width: 1,
            height: 1,
            maxStackSize: 1,
            isConsumable: true,
            recipeId: recipeId,
            requiredProfession: recipeData.profession,
            requiredLevel: recipeData.requiredLevel,
            itemLevel: (recipeData.requiredLevel * 10) + 10,
            bindOnPickup: false,
            unique: false
        };

        // Add the recipe scroll to the item library
        addItem(recipeScrollItem);

        if (onSave) {
            onSave(recipe);
        }

        // Reset form
        setRecipeData({
            name: '',
            profession: '',
            description: '',
            requiredLevel: 0,
            resultItemId: '',
            resultQuantity: 1,
            materials: [],
            craftingTime: 5000,
            experienceGained: 1
        });
        setCurrentStep(0);
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Basic Info
                return (
                    <div className="recipe-step">
                        <div className="form-row">
                            <div className="spell-wizard-form-group">
                                <label className="spell-wizard-label">Recipe Name</label>
                                <input
                                    type="text"
                                    className="spell-wizard-input"
                                    value={recipeData.name}
                                    onChange={(e) => updateRecipeData({ name: e.target.value })}
                                    placeholder="e.g., Minor Healing Potion"
                                />
                            </div>

                            <div className="spell-wizard-form-group">
                                <label className="spell-wizard-label">Profession</label>
                                <select
                                    className="spell-wizard-input"
                                    value={recipeData.profession}
                                    onChange={(e) => updateRecipeData({ profession: e.target.value })}
                                >
                                    <option value="">Select Profession</option>
                                    {Object.entries(PROFESSIONS).map(([key, prof]) => (
                                        <option key={key} value={key}>{prof.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="spell-wizard-form-group">
                                <label className="spell-wizard-label">Recipe Quality</label>
                                <select
                                    className="spell-wizard-input"
                                    value={recipeData.quality}
                                    onChange={(e) => updateRecipeData({ quality: e.target.value })}
                                >
                                    <option value="common">Common</option>
                                    <option value="uncommon">Uncommon</option>
                                    <option value="rare">Rare</option>
                                    <option value="epic">Epic</option>
                                    <option value="legendary">Legendary</option>
                                </select>
                            </div>
                        </div>

                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Description</label>
                            <textarea
                                className="spell-wizard-textarea"
                                value={recipeData.description}
                                onChange={(e) => updateRecipeData({ description: e.target.value })}
                                placeholder="Describe what this recipe creates..."
                                rows="3"
                            />
                        </div>
                    </div>
                );

            case 1: // Result Item
                const resultItems = getFilteredItems(item => 
                    item.type === 'consumable' || 
                    item.type === 'weapon' || 
                    item.type === 'armor' || 
                    item.type === 'accessory'
                );
                
                return (
                    <div className="recipe-step">
                        <h3>Select Result Item</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Search Items</label>
                            <input
                                type="text"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for items..."
                            />
                        </div>

                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Result Quantity</label>
                            <input
                                type="number"
                                className="spell-wizard-input"
                                value={recipeData.resultQuantity}
                                onChange={(e) => updateRecipeData({ resultQuantity: parseInt(e.target.value) })}
                                min="1"
                            />
                        </div>
                        
                        <div className="items-grid">
                            {resultItems.map(item => (
                                <div
                                    key={item.id}
                                    className={`item-card ${recipeData.resultItemId === item.id ? 'selected' : ''}`}
                                    onClick={() => updateRecipeData({ resultItemId: item.id })}
                                    onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                    onMouseMove={(e) => handleItemMouseMove(e, item)}
                                    onMouseLeave={handleItemMouseLeave}
                                >
                                    <div className="item-icon">
                                        <img 
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-type">{item.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2: // Materials
                const materialItems = getFilteredItems(item => 
                    item.type === 'miscellaneous' && 
                    (item.subtype === 'REAGENT' || item.subtype === 'CRAFTING')
                );
                
                return (
                    <div className="recipe-step">
                        <h3>Select Required Materials</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Search Materials</label>
                            <input
                                type="text"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for materials..."
                            />
                        </div>
                        
                        <div className="selected-materials">
                            <h4>Selected Materials</h4>
                            {recipeData.materials.map(material => {
                                const item = itemLibrary.find(i => i.id === material.itemId);
                                return (
                                    <div key={material.itemId} className="selected-material">
                                        <div className="material-icon">
                                            <img 
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${item?.iconId || 'inv_misc_questionmark'}.jpg`}
                                                alt={item?.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                }}
                                            />
                                        </div>
                                        <span className="material-name">{item?.name}</span>
                                        <input 
                                            type="number"
                                            className="quantity-input"
                                            value={material.quantity}
                                            onChange={(e) => updateMaterialQuantity(material.itemId, parseInt(e.target.value))}
                                            min="1"
                                        />
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeMaterial(material.itemId)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="items-grid">
                            {materialItems.map(item => (
                                <div
                                    key={item.id}
                                    className="item-card"
                                    onClick={() => addMaterial(item.id)}
                                    onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                    onMouseMove={(e) => handleItemMouseMove(e, item)}
                                    onMouseLeave={handleItemMouseLeave}
                                >
                                    <div className="item-icon">
                                        <img 
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-type">{item.subtype}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Requirements
                return (
                    <div className="recipe-step">
                        <h3>Recipe Requirements</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Required Skill Level</label>
                            <select
                                className="spell-wizard-input"
                                value={recipeData.requiredLevel}
                                onChange={(e) => updateRecipeData({ requiredLevel: parseInt(e.target.value) })}
                            >
                                {Object.values(SKILL_LEVELS).map(level => (
                                    <option key={level.level} value={level.level}>{level.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Crafting Time (seconds)</label>
                            <input
                                type="number"
                                className="spell-wizard-input"
                                value={recipeData.craftingTime / 1000}
                                onChange={(e) => updateRecipeData({ craftingTime: parseInt(e.target.value) * 1000 })}
                                min="1"
                            />
                        </div>

                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Experience Gained</label>
                            <input
                                type="number"
                                className="spell-wizard-input"
                                value={recipeData.experienceGained}
                                onChange={(e) => updateRecipeData({ experienceGained: parseInt(e.target.value) })}
                                min="1"
                            />
                        </div>
                    </div>
                );

            case 4: // Review
                const resultItem = itemLibrary.find(i => i.id === recipeData.resultItemId);
                return (
                    <div className="recipe-step">
                        <h3>Review Recipe</h3>
                        <div className="recipe-review">
                            <div className="review-section">
                                <h4>Basic Information</h4>
                                <p><strong>Name:</strong> {recipeData.name}</p>
                                <p><strong>Profession:</strong> {PROFESSIONS[recipeData.profession]?.name}</p>
                                <p><strong>Description:</strong> {recipeData.description}</p>
                            </div>
                            
                            <div className="review-section">
                                <h4>Result</h4>
                                <div className="result-item">
                                    <img 
                                        src={`https://wow.zamimg.com/images/wow/icons/large/${resultItem?.iconId || 'inv_misc_questionmark'}.jpg`}
                                        alt={resultItem?.name}
                                        onError={(e) => {
                                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                        }}
                                    />
                                    <span>{recipeData.resultQuantity}x {resultItem?.name}</span>
                                </div>
                            </div>
                            
                            <div className="review-section">
                                <h4>Materials Required</h4>
                                {recipeData.materials.map(material => {
                                    const item = itemLibrary.find(i => i.id === material.itemId);
                                    return (
                                        <div key={material.itemId} className="material-review">
                                            <img 
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${item?.iconId || 'inv_misc_questionmark'}.jpg`}
                                                alt={item?.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                }}
                                            />
                                            <span>{material.quantity}x {item?.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="review-section">
                                <h4>Requirements</h4>
                                <p><strong>Skill Level:</strong> {Object.values(SKILL_LEVELS).find(s => s.level === recipeData.requiredLevel)?.name}</p>
                                <p><strong>Crafting Time:</strong> {recipeData.craftingTime / 1000} seconds</p>
                                <p><strong>Experience:</strong> {recipeData.experienceGained} points</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return recipeData.name && recipeData.profession && recipeData.description;
            case 1:
                return recipeData.resultItemId && recipeData.resultQuantity > 0;
            case 2:
                return recipeData.materials.length > 0;
            case 3:
                return true;
            case 4:
                return true;
            default:
                return false;
        }
    };



    // Handle window drag to save position
    const handleWindowDrag = (position) => {
        // Only save x and y coordinates to avoid circular references
        const cleanPosition = { x: position.x, y: position.y };
        setWindowPosition(cleanPosition);
        if (onWindowPositionChange) {
            onWindowPositionChange(cleanPosition);
        }
    };



    return (
        <WowWindow
            title="Recipe Wizard"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={windowSize}
            defaultPosition={windowPosition}
            onDrag={handleWindowDrag}

            className="recipe-wizard"
        >
            <div className="recipe-wizard-content">
                {/* Single column layout - Preview is now external */}
                <div className="wizard-main-content">
                    <div className="spell-wizard-step">
                        <div className="spell-wizard-step-content">
                            <div className="spell-wizard-form">
                                {renderStepContent()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="recipe-wizard-footer">
                    <div className="wizard-nav-controls">
                        <button
                            className="wizard-nav-btn wizard-nav-previous"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                        >
                            <span className="nav-btn-icon">‹</span>
                            <span className="nav-btn-text">Previous</span>
                        </button>

                        <div className="wizard-step-info">
                            <div className="step-indicator-dots">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                        onClick={() => setCurrentStep(index)}
                                        title={step}
                                    />
                                ))}
                            </div>
                            <div className="step-text">
                                <span className="step-name">{steps[currentStep]}</span>
                                <span className="step-counter">Step {currentStep + 1} of {steps.length}</span>
                            </div>
                        </div>

                        {currentStep < steps.length - 1 ? (
                            <button
                                className="wizard-nav-btn wizard-nav-next"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={!canProceed()}
                            >
                                <span className="nav-btn-text">Next</span>
                                <span className="nav-btn-icon">›</span>
                            </button>
                        ) : (
                            <button
                                className="wizard-nav-btn wizard-nav-next wizard-nav-create"
                                onClick={saveRecipe}
                                disabled={!canProceed()}
                            >
                                <span className="nav-btn-text">Create Recipe</span>
                                <span className="nav-btn-icon">✓</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Tooltip - Same as item library */}
            {showItemTooltip.visible && showItemTooltip.item && (
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
                        <ItemTooltip item={showItemTooltip.item} />
                    </div>
                </TooltipPortal>
            )}
        </WowWindow>
    );
}

export default RecipeWizard;
