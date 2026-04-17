import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import WowWindow from '../windows/WowWindow';
import useItemStore from '../../store/itemStore';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import TooltipPortal from '../tooltips/TooltipPortal';
import ExternalRecipePreview from './ExternalRecipePreview';
import { getIconUrl } from '../../utils/assetManager';

const LazyItemTooltip = React.lazy(() => import('../item-generation/ItemTooltip'));

const RecipeItemCard = ({ item, isSelected, onClick, onMouseEnter, onMouseLeave }) => (
    <div
        className={`item-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <div className="item-icon">
            <img src={getIconUrl(item.iconId || 'inv_misc_questionmark', 'items')} alt={item.name} draggable={false} />
        </div>
        <div className="item-name">{item.name}</div>
        <div className="item-type">{item.subtype || item.type}</div>
    </div>
);

const RecipeVirtualizedGrid = ({ items, selectedItem, onSelect, onMouseMove, handleItemMouseEnter, handleItemMouseLeave }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 700, height: 300 });
    const scrollRef = useRef(0);

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

    const CARD_WIDTH = 110;
    const CARD_HEIGHT = 110;
    const GAP = 8;
    const COLS = Math.max(1, Math.floor((dimensions.width - GAP) / (CARD_WIDTH + GAP)));
    const ROWS = Math.ceil(items.length / COLS);
    const VISIBLE_ROWS = Math.ceil(dimensions.height / (CARD_HEIGHT + GAP)) + 2;

    const totalHeight = ROWS * (CARD_HEIGHT + GAP);
    const startRow = Math.floor(scrollRef.current / (CARD_HEIGHT + GAP));
    const endRow = Math.min(ROWS, startRow + VISIBLE_ROWS);
    const visibleItems = [];
    for (let row = startRow; row < endRow; row++) {
        for (let col = 0; col < COLS; col++) {
            const idx = row * COLS + col;
            if (idx < items.length) {
                visibleItems.push({ item: items[idx], row, col, idx });
            }
        }
    }

    const handleScroll = useCallback((e) => {
        scrollRef.current = e.target.scrollTop;
        const el = e.target;
        const startR = Math.floor(scrollRef.current / (CARD_HEIGHT + GAP));
        const endR = Math.min(ROWS, startR + VISIBLE_ROWS);
        const vis = [];
        for (let r = startR; r < endR; r++) {
            for (let c = 0; c < COLS; c++) {
                const i = r * COLS + c;
                if (i < items.length) vis.push({ item: items[i], row: r, col: c, idx: i });
            }
        }
        forceUpdateRef.current(vis);
    }, [items.length, COLS, ROWS, VISIBLE_ROWS]);

    const forceUpdateRef = useRef(null);
    const [, setTick] = useState(0);
    forceUpdateRef.current = (vis) => {
        renderedItemsRef.current = vis;
        setTick(t => t + 1);
    };

    const renderedItemsRef = useRef(visibleItems);
    if (scrollRef.current === 0) renderedItemsRef.current = visibleItems;

    const rendered = renderedItemsRef.current;

    return (
        <div
            ref={containerRef}
            className="items-grid"
            onMouseMove={onMouseMove}
            onScroll={handleScroll}
            style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: dimensions.height, position: 'relative' }}
        >
            <div style={{ height: totalHeight, position: 'relative', width: '100%' }}>
                {rendered.map(({ item, row, col }) => (
                    <div
                        key={item.id}
                        style={{
                            position: 'absolute',
                            left: col * (CARD_WIDTH + GAP) + GAP,
                            top: row * (CARD_HEIGHT + GAP) + GAP,
                            width: CARD_WIDTH,
                        }}
                    >
                        <RecipeItemCard
                            item={item}
                            isSelected={selectedItem === item.id}
                            onClick={() => onSelect(item.id)}
                            onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                            onMouseLeave={handleItemMouseLeave}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

function RecipeWizard({ isOpen, onClose, onSave, onWindowPositionChange, onRecipeDataChange, initialData }) {
    const { items: itemLibrary, addItem } = useItemStore();
    const { addAvailableRecipe, availableRecipes } = useCraftingStore(state => ({
        addAvailableRecipe: state.addAvailableRecipe,
        availableRecipes: state.availableRecipes
    }));

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
        quality: 'uncommon'
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const tooltipRef = useRef({ visible: false, x: 0, y: 0, item: null });
    const tooltipNodeRef = useRef(null);
    const [tooltipState, setTooltipState] = useState({ visible: false, item: null, x: 0, y: 0 });
    const tooltipDelayRef = useRef(null);

    const isEditing = !!initialData;
    const [windowPosition, setWindowPosition] = useState({ x: 150, y: 50 });
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
    const [craftingTimeUnit, setCraftingTimeUnit] = useState('seconds');

    const steps = ['Basic Info', 'Result Item', 'Materials', 'Requirements'];

    const updateRecipeData = useCallback((updates) => {
        setRecipeData(prev => {
            const newData = { ...prev, ...updates };
            if (onRecipeDataChange) onRecipeDataChange(newData);
            return newData;
        });
    }, [onRecipeDataChange]);

    useEffect(() => {
        if (onRecipeDataChange && isOpen) onRecipeDataChange(recipeData);
    }, [isOpen, onRecipeDataChange, recipeData]);

    useEffect(() => {
        if (initialData && isOpen) {
            const recipeId = initialData.recipeId;
            const existingRecipe = availableRecipes.find(recipe => recipe.id === recipeId);
            if (existingRecipe) {
                setRecipeData({
                    name: existingRecipe.name || '',
                    profession: existingRecipe.profession || '',
                    description: existingRecipe.description || '',
                    requiredLevel: existingRecipe.requiredLevel || 0,
                    resultItemId: existingRecipe.resultItemId || '',
                    resultQuantity: existingRecipe.resultQuantity || 1,
                    materials: existingRecipe.materials || [],
                    craftingTime: existingRecipe.craftingTime || 5000,
                    experienceGained: existingRecipe.experienceGained || 1,
                    quality: existingRecipe.quality || initialData.quality || 'uncommon'
                });
            } else {
                setRecipeData({
                    name: initialData.name?.replace('Recipe: ', '') || '',
                    profession: initialData.requiredProfession || '',
                    description: initialData.description || '',
                    requiredLevel: initialData.requiredLevel || 0,
                    resultItemId: initialData.recipeId || '',
                    resultQuantity: 1,
                    materials: [],
                    craftingTime: 5000,
                    experienceGained: 1,
                    quality: initialData.quality || 'uncommon'
                });
            }
            setCurrentStep(0);
        } else if (!initialData && isOpen) {
            setRecipeData({
                name: '', profession: '', description: '', requiredLevel: 0,
                resultItemId: '', resultQuantity: 1, materials: [],
                craftingTime: 5000, experienceGained: 1, quality: 'uncommon'
            });
            setCurrentStep(0);
        }
    }, [initialData, isOpen, availableRecipes]);

    const handleItemMouseEnter = useCallback((e, item) => {
        if (tooltipDelayRef.current) clearTimeout(tooltipDelayRef.current);
        tooltipDelayRef.current = setTimeout(() => {
            tooltipRef.current = { visible: true, x: e.clientX + 15, y: e.clientY - 10, item };
            setTooltipState({ visible: true, item, x: e.clientX + 15, y: e.clientY - 10 });
        }, 200);
    }, []);

    const handleItemMouseMove = useCallback((e) => {
        const tt = tooltipRef.current;
        if (!tt.visible) return;
        const x = e.clientX + 15;
        const y = e.clientY - 10;
        tooltipRef.current.x = x;
        tooltipRef.current.y = y;
        const node = tooltipNodeRef.current;
        if (node) {
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
        }
    }, []);

    const handleItemMouseLeave = useCallback(() => {
        if (tooltipDelayRef.current) {
            clearTimeout(tooltipDelayRef.current);
            tooltipDelayRef.current = null;
        }
        tooltipRef.current.visible = false;
        setTooltipState({ visible: false, item: null, x: 0, y: 0 });
    }, []);

    const addMaterial = useCallback((itemId) => {
        setRecipeData(prev => {
            const existing = prev.materials.find(m => m.itemId === itemId);
            const materials = existing
                ? prev.materials.map(m => m.itemId === itemId ? { ...m, quantity: m.quantity + 1 } : m)
                : [...prev.materials, { itemId, quantity: 1 }];
            const newData = { ...prev, materials };
            if (onRecipeDataChange) onRecipeDataChange(newData);
            return newData;
        });
    }, [onRecipeDataChange]);

    const removeMaterial = useCallback((itemId) => {
        updateRecipeData({ materials: recipeData.materials.filter(m => m.itemId !== itemId) });
    }, [recipeData.materials, updateRecipeData]);

    const updateMaterialQuantity = useCallback((itemId, quantity) => {
        updateRecipeData({
            materials: recipeData.materials.map(m =>
                m.itemId === itemId ? { ...m, quantity: Math.max(1, quantity) } : m
            )
        });
    }, [recipeData.materials, updateRecipeData]);

    const dedupedItems = useMemo(() => {
        const seen = new Set();
        return itemLibrary.filter(item => {
            if (!item || !item.id) return false;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });
    }, [itemLibrary]);

    const resultItems = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return dedupedItems.filter(item => {
            if (!['consumable', 'weapon', 'armor', 'accessory'].includes(item.type)) return false;
            return item.name.toLowerCase().includes(term);
        });
    }, [dedupedItems, searchTerm]);

    const materialItems = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return dedupedItems.filter(item => {
            if (item.type !== 'miscellaneous' || !['REAGENT', 'CRAFTING'].includes(item.subtype)) return false;
            return item.name.toLowerCase().includes(term);
        });
    }, [dedupedItems, searchTerm]);

    const saveRecipe = () => {
        const recipeId = `${recipeData.name.toLowerCase().replace(/\s+/g, '-')}-recipe`;
        const recipe = { id: recipeId, ...recipeData };

        if (addAvailableRecipe && typeof addAvailableRecipe === 'function') {
            addAvailableRecipe(recipe);
        } else {
            const store = useCraftingStore.getState();
            if (store.addAvailableRecipe) store.addAvailableRecipe(recipe);
            else { console.error('addAvailableRecipe is not available'); return; }
        }

        const resultItem = itemLibrary.find(item => item.id === recipeData.resultItemId);
        const recipeScrollItem = {
            id: `${recipeId}-scroll`,
            name: `Recipe: ${recipeData.name}`,
            description: `A scroll containing the formula for brewing ${resultItem?.name || 'Unknown Item'}. Right-click to learn.`,
            type: 'recipe', quality: recipeData.quality || 'uncommon', iconId: 'inv_scroll_03',
            value: { gold: 0, silver: Math.max(1, Math.floor(recipeData.requiredLevel * 2.5)), copper: 50 },
            width: 1, height: 1, maxStackSize: 1, isConsumable: true,
            recipeId, requiredProfession: recipeData.profession, requiredLevel: recipeData.requiredLevel,
            itemLevel: (recipeData.requiredLevel * 10) + 10, bindOnPickup: false, unique: false
        };

        addItem(recipeScrollItem);
        if (onSave) onSave(recipe);

        setRecipeData({ name: '', profession: '', description: '', requiredLevel: 0, resultItemId: '', resultQuantity: 1, materials: [], craftingTime: 5000, experienceGained: 1, quality: 'uncommon' });
        setCurrentStep(0);
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="recipe-step">
                        <div className="form-row">
                            <div className="spell-wizard-form-group">
                                <label className="spell-wizard-label">Recipe Name</label>
                                <input type="text" className="spell-wizard-input" value={recipeData.name} onChange={(e) => updateRecipeData({ name: e.target.value })} placeholder="e.g., Minor Healing Potion" />
                            </div>
                            <div className="spell-wizard-form-group">
                                <label className="spell-wizard-label">Profession</label>
                                <select className="spell-wizard-input" value={recipeData.profession} onChange={(e) => updateRecipeData({ profession: e.target.value })}>
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
                                <select className="spell-wizard-input" value={recipeData.quality} onChange={(e) => updateRecipeData({ quality: e.target.value })}>
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
                            <textarea className="spell-wizard-textarea" value={recipeData.description} onChange={(e) => updateRecipeData({ description: e.target.value })} placeholder="Describe what this recipe creates..." rows="3" />
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="recipe-step">
                        <h3>Select Result Item</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Search Items</label>
                            <input type="text" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for items..." />
                        </div>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Result Quantity</label>
                            <input type="number" className="spell-wizard-input" value={recipeData.resultQuantity || 1} onChange={(e) => { const v = parseInt(e.target.value) || 1; updateRecipeData({ resultQuantity: v >= 1 ? v : 1 }); }} min="1" />
                        </div>
                        <RecipeVirtualizedGrid
                            items={resultItems}
                            selectedItem={recipeData.resultItemId}
                            onSelect={(id) => updateRecipeData({ resultItemId: id })}
                            onMouseMove={handleItemMouseMove}
                            handleItemMouseEnter={handleItemMouseEnter}
                            handleItemMouseLeave={handleItemMouseLeave}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="recipe-step">
                        <h3>Select Required Materials</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Search Materials</label>
                            <input type="text" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for materials..." />
                        </div>
                        <div className="selected-materials">
                            <h4>Selected Materials</h4>
                            {recipeData.materials.map(material => {
                                const item = itemLibrary.find(i => i.id === material.itemId);
                                return (
                                    <div key={material.itemId} className="selected-material">
                                        <div className="material-icon"><img src={getIconUrl(item?.iconId || 'inv_misc_questionmark', 'items')} alt={item?.name} /></div>
                                        <span className="material-name">{item?.name}</span>
                                        <input type="number" className="quantity-input" value={material.quantity} onChange={(e) => updateMaterialQuantity(material.itemId, parseInt(e.target.value))} min="1" />
                                        <button className="remove-btn" onClick={() => removeMaterial(material.itemId)}>×</button>
                                    </div>
                                );
                            })}
                        </div>
                        <RecipeVirtualizedGrid
                            items={materialItems}
                            selectedItem={null}
                            onSelect={(id) => addMaterial(id)}
                            onMouseMove={handleItemMouseMove}
                            handleItemMouseEnter={handleItemMouseEnter}
                            handleItemMouseLeave={handleItemMouseLeave}
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="recipe-step" data-step="requirements">
                        <h3>Recipe Requirements</h3>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Required Skill Level</label>
                            <select className="spell-wizard-input" value={recipeData.requiredLevel} onChange={(e) => updateRecipeData({ requiredLevel: parseInt(e.target.value) })}>
                                {Object.values(SKILL_LEVELS).map(level => (
                                    <option key={level.level} value={level.level}>{level.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Crafting Time</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', minWidth: 0 }}>
                                <input type="number" className="spell-wizard-input" value={(() => { switch(craftingTimeUnit) { case 'seconds': return recipeData.craftingTime / 1000; case 'minutes': return recipeData.craftingTime / 60000; case 'hours': return recipeData.craftingTime / 3600000; case 'days': return recipeData.craftingTime / 86400000; default: return recipeData.craftingTime / 1000; } })()} onChange={(e) => { const v = parseFloat(e.target.value) || 0; let ms = 0; switch(craftingTimeUnit) { case 'seconds': ms = v * 1000; break; case 'minutes': ms = v * 60000; break; case 'hours': ms = v * 3600000; break; case 'days': ms = v * 86400000; break; default: ms = v * 1000; } updateRecipeData({ craftingTime: Math.max(0, ms) }); }} min="0" step={craftingTimeUnit === 'days' ? '0.1' : '1'} style={{ flex: 1, minWidth: 0 }} />
                                <select className="spell-wizard-input" value={craftingTimeUnit} onChange={(e) => { const cv = (() => { switch(craftingTimeUnit) { case 'seconds': return recipeData.craftingTime / 1000; case 'minutes': return recipeData.craftingTime / 60000; case 'hours': return recipeData.craftingTime / 3600000; case 'days': return recipeData.craftingTime / 86400000; default: return recipeData.craftingTime / 1000; } })(); switch(e.target.value) { case 'seconds': updateRecipeData({ craftingTime: cv * 1000 }); break; case 'minutes': updateRecipeData({ craftingTime: cv * 60000 }); break; case 'hours': updateRecipeData({ craftingTime: cv * 3600000 }); break; case 'days': updateRecipeData({ craftingTime: cv * 86400000 }); break; } setCraftingTimeUnit(e.target.value); }} style={{ width: '65px', flexShrink: 0, maxWidth: '65px' }}>
                                    <option value="seconds">Sec</option>
                                    <option value="minutes">Min</option>
                                    <option value="hours">Hour</option>
                                    <option value="days">Day</option>
                                </select>
                            </div>
                        </div>
                        <div className="spell-wizard-form-group">
                            <label className="spell-wizard-label">Experience Gained</label>
                            <input type="number" className="spell-wizard-input" value={recipeData.experienceGained} onChange={(e) => updateRecipeData({ experienceGained: parseInt(e.target.value) })} min="1" />
                        </div>
                    </div>
                );

            case 4: {
                const resultItem = itemLibrary.find(i => i.id === recipeData.resultItemId);
                return (
                    <div className="recipe-step">
                        <h3>Review Recipe</h3>
                        <div className="recipe-review">
                            <div className="review-section"><h4>Basic Information</h4><p><strong>Name:</strong> {recipeData.name}</p><p><strong>Profession:</strong> {PROFESSIONS[recipeData.profession]?.name}</p><p><strong>Description:</strong> {recipeData.description}</p></div>
                            <div className="review-section"><h4>Result</h4><div className="result-item"><img src={getIconUrl(resultItem?.iconId || 'inv_misc_questionmark', 'items')} alt={resultItem?.name} /><span>{recipeData.resultQuantity}x {resultItem?.name}</span></div></div>
                            <div className="review-section"><h4>Materials Required</h4>{recipeData.materials.map(material => { const item = itemLibrary.find(i => i.id === material.itemId); return (<div key={material.itemId} className="material-review"><img src={getIconUrl(item?.iconId || 'inv_misc_questionmark', 'items')} alt={item?.name} /><span>{material.quantity}x {item?.name}</span></div>); })}</div>
                            <div className="review-section"><h4>Requirements</h4><p><strong>Skill Level:</strong> {Object.values(SKILL_LEVELS).find(s => s.level === recipeData.requiredLevel)?.name}</p><p><strong>Crafting Time:</strong> {recipeData.craftingTime / 1000} seconds</p><p><strong>Experience:</strong> {recipeData.experienceGained} points</p></div>
                        </div>
                    </div>
                );
            }
            default: return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return recipeData.name && recipeData.profession && recipeData.description;
            case 1: return recipeData.resultItemId && recipeData.resultQuantity > 0;
            case 2: return recipeData.materials.length > 0;
            default: return true;
        }
    };

    const handleWindowDrag = (position) => {
        const cleanPosition = { x: position.x, y: position.y };
        setWindowPosition(cleanPosition);
        if (onWindowPositionChange) onWindowPositionChange(cleanPosition);
    };

    return (
        <WowWindow title="Recipe Wizard" isOpen={isOpen} onClose={onClose} defaultSize={windowSize} defaultPosition={windowPosition} onDrag={handleWindowDrag} modal={true} className="recipe-wizard">
            <div className="recipe-wizard-content">
                <div className="wizard-main-content">
                    <div className="spell-wizard-step">
                        <div className="spell-wizard-step-content">
                            <div className="spell-wizard-form">{renderStepContent()}</div>
                        </div>
                    </div>
                </div>
                <div className="recipe-wizard-footer">
                    <div className="wizard-nav-controls">
                        <button className="wizard-nav-btn wizard-nav-previous" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
                            <span className="nav-btn-icon">‹</span><span className="nav-btn-text">Previous</span>
                        </button>
                        <div className="wizard-step-info">
                            <div className="step-indicator-dots">
                                {steps.map((step, index) => (
                                    <div key={index} className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`} onClick={() => setCurrentStep(index)} title={step} />
                                ))}
                            </div>
                            <div className="step-text">
                                <span className="step-name">{steps[currentStep]}</span>
                                <span className="step-counter">Step {currentStep + 1} of {steps.length}</span>
                            </div>
                        </div>
                        {currentStep < steps.length - 1 ? (
                            <button className="wizard-nav-btn wizard-nav-next" onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
                                <span className="nav-btn-text">Next</span><span className="nav-btn-icon">›</span>
                            </button>
                        ) : (
                            <button className="wizard-nav-btn wizard-nav-next wizard-nav-create" onClick={saveRecipe} disabled={!canProceed()}>
                                <span className="nav-btn-text">{isEditing ? 'Update Recipe' : 'Create Recipe'}</span><span className="nav-btn-icon">✓</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {tooltipState.visible && tooltipState.item && (
                <TooltipPortal>
                    <div ref={tooltipNodeRef} style={{ position: 'fixed', left: tooltipState.x, top: tooltipState.y, transform: 'translate(10px, -50%)', pointerEvents: 'none', zIndex: 999999999 }}>
                        <React.Suspense fallback={null}>
                            <LazyItemTooltip item={tooltipState.item} />
                        </React.Suspense>
                    </div>
                </TooltipPortal>
            )}
        </WowWindow>
    );
}

export default RecipeWizard;
