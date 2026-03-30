import React, { useState } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import FirstAidInterface from '../crafting/FirstAidInterface';
import useChatStore from '../../store/chatStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('recipes');
    const store = useCraftingStore();
    const {
        selectedProfession,
        setSelectedProfession,
        getProfessionLevel,
        getProfessionExperience,
        getExperienceForNextLevel,
        getRecipesForProfession,
        learnRecipe,
        professionLevels,
        availableRecipes
    } = store;
    const { addLootNotification } = useChatStore();
    const { addItemFromLibrary } = useInventoryStore();
    const { items: itemLibrary } = useItemStore();

    // Note: Use the "Add Test Materials" button to populate inventory with crafting materials

    const getSkillLevelColor = (level) => {
        if (level === 0) return '#9d9d9d';
        if (level <= 2) return '#ffffff';
        if (level <= 4) return '#1eff00';
        if (level <= 6) return '#0070dd';
        if (level <= 8) return '#a335ee';
        return '#ff8000';
    };

    // Safe wrapper for setSelectedProfession with fallback
    const safeSetSelectedProfession = (professionId) => {
        if (typeof setSelectedProfession === 'function') {
            setSelectedProfession(professionId);
        } else {
            // Fallback: use store.setState directly
            useCraftingStore.setState({ selectedProfession: professionId });
        }
    };

    const handleProfessionSelect = (professionId) => {
        safeSetSelectedProfession(professionId);
    };

    const handleBackToProfessions = () => {
        safeSetSelectedProfession(null);
    };

    const renderContent = () => {
        // If a profession is selected, show its interface
        if (selectedProfession) {
            switch (selectedProfession) {
                case 'alchemy':
                    return <AlchemyInterface onBack={handleBackToProfessions} activeTab={activeTab} onTabChange={setActiveTab} />;
                case 'first-aid':
                    return <FirstAidInterface onBack={handleBackToProfessions} activeTab={activeTab} onTabChange={setActiveTab} />;
                default:
                    return (
                        <div className="profession-not-implemented">
                            <h3>Coming Soon</h3>
                            <p>This profession interface is under development.</p>
                            <button className="wow-button" onClick={handleBackToProfessions}>
                                Back to Professions
                            </button>
                        </div>
                    );
            }
        }

        // Otherwise show profession selection
        return (
            <ProfessionSelection
                onProfessionSelect={handleProfessionSelect}
                selectedProfession={selectedProfession}
            />
        );
    };

    // Handle learning all recipes for current profession
    const handleLearnAllRecipes = () => {
        if (!selectedProfession) {
            console.log('handleLearnAllRecipes: No selected profession');
            return;
        }

        console.log('handleLearnAllRecipes: selectedProfession =', selectedProfession);
        const allRecipes = (typeof getRecipesForProfession === 'function')
            ? getRecipesForProfession(selectedProfession)
            : ((availableRecipes || []).filter(recipe => recipe.profession === selectedProfession));
        console.log('handleLearnAllRecipes: Found recipes:', allRecipes.length, allRecipes.map(r => r.id));
        
        if (allRecipes.length === 0) {
            addLootNotification({
                type: 'crafting_failed',
                message: `No recipes found for ${selectedProfession}.`,
                timestamp: Date.now()
            });
            return;
        }

        let learnedCount = 0;
        allRecipes.forEach(recipe => {
            console.log('handleLearnAllRecipes: Learning recipe', recipe.id, 'for profession', selectedProfession);
            if (typeof learnRecipe === 'function') {
                learnRecipe(selectedProfession, recipe.id);
            } else {
                // Fallback: directly update the store
                const store = useCraftingStore.getState();
                const currentRecipes = store.knownRecipes?.[selectedProfession] || [];
                if (!currentRecipes.includes(recipe.id)) {
                    useCraftingStore.setState(state => ({
                        knownRecipes: {
                            ...state.knownRecipes,
                            [selectedProfession]: [...currentRecipes, recipe.id]
                        }
                    }));
                }
            }
            learnedCount++;
        });

        // Find profession by id since PROFESSIONS uses keys like ALCHEMY, FIRST_AID
        const profession = Object.values(PROFESSIONS).find(p => p.id === selectedProfession);

        console.log('handleLearnAllRecipes: Learned', learnedCount, 'recipes');

        addLootNotification({
            type: 'crafting_success',
            message: `Learned ${learnedCount} ${profession?.name || selectedProfession} recipe${learnedCount !== 1 ? 's' : ''}!`,
            timestamp: Date.now()
        });
    };

    // Add test materials for crafting (context-aware based on profession)
    const handleAddTestMaterials = () => {
        if (!selectedProfession) return;

        let testMaterials = [];
        let message = '';

        if (selectedProfession === 'alchemy') {
            testMaterials = [
                // Basic materials for all potions
                { id: 'peacebloom', quantity: 10 },
                { id: 'silverleaf', quantity: 10 },
                { id: 'earthroot', quantity: 10 },
                { id: 'mageroyal', quantity: 10 },
                { id: 'empty-vial', quantity: 5 },
                { id: 'crystal-vial', quantity: 3 },
                { id: 'distilled-water', quantity: 10 },
                { id: 'alchemical-catalyst', quantity: 2 }
            ];
            message = 'Added test alchemy crafting materials to inventory!';
        } else if (selectedProfession === 'first-aid') {
            testMaterials = [
                // Basic materials for first aid
                { id: 'linen-cloth', quantity: 20 },
                { id: 'healing-herb', quantity: 15 },
                { id: 'aloe-vera', quantity: 10 },
                { id: 'small-jar', quantity: 5 },
                { id: 'wooden-stick', quantity: 10 },
                { id: 'leather-strip', quantity: 8 },
                { id: 'medical-tools', quantity: 3 }
            ];
            message = 'Added test first aid crafting materials to inventory!';
        } else {
            return; // Unknown profession
        }

        testMaterials.forEach(material => {
            const itemData = itemLibrary.find(item => item.id === material.id);
            if (itemData) {
                for (let i = 0; i < material.quantity; i++) {
                    addItemFromLibrary(itemData, 1);
                }
            } else {
                console.log('Test material not found:', material.id);
            }
        });

        addLootNotification({
            type: 'item_received',
            message: message,
            timestamp: Date.now()
        });
    };

    return (
        <WowWindow
            title="Crafting"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 1000, height: 700 }}
            defaultPosition={{ x: 200, y: 100 }}
            className="crafting-window"
            customHeader={
                <div className="crafting-full-header">
                    <div className="crafting-header-left">
                        <div className="crafting-header-title">
                            {selectedProfession ? (
                                (() => {
                                    const profession = Object.values(PROFESSIONS).find(p => p.id === selectedProfession);
                                    const professionLevel = (typeof getProfessionLevel === 'function') 
                                        ? getProfessionLevel(selectedProfession) 
                                        : (professionLevels?.[selectedProfession] ?? SKILL_LEVELS.UNTRAINED.level);
                                    const skillLevelInfo = Object.values(SKILL_LEVELS).find(skill => skill.level === professionLevel);
                                    const skillName = skillLevelInfo?.name || 'Untrained';
                                    return `${profession?.name || 'Profession'} (${skillName})`;
                                })()
                            ) : (
                                'Crafting'
                            )}
                        </div>
                    </div>
                    {selectedProfession && (
                        <div className="crafting-header-actions">
                            <button
                                className="wow-button crafting-action-button"
                                onClick={handleAddTestMaterials}
                                title={`Add test ${Object.values(PROFESSIONS).find(p => p.id === selectedProfession)?.name?.toLowerCase() || 'crafting'} materials to inventory`}
                            >
                                Add Test Materials
                            </button>
                            <button
                                className="wow-button crafting-action-button"
                                onClick={handleLearnAllRecipes}
                            >
                                Learn All Recipes
                            </button>
                            <button
                                className="wow-button crafting-action-button"
                                onClick={handleBackToProfessions}
                            >
                                Back to Professions
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <div className="crafting-window-content">
                {renderContent()}
            </div>
        </WowWindow>
    );
}

export default CraftingWindow;
