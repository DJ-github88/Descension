import React, { useState } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import useChatStore from '../../store/chatStore';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('recipes');
    const {
        selectedProfession,
        setSelectedProfession,
        getProfessionLevel,
        getProfessionExperience,
        getExperienceForNextLevel,
        getRecipesForProfession,
        learnRecipe
    } = useCraftingStore();
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


    const handleProfessionSelect = (professionId) => {
        setSelectedProfession(professionId);
    };

    const handleBackToProfessions = () => {
        setSelectedProfession(null);
    };

    const renderContent = () => {
        // If a profession is selected, show its interface
        if (selectedProfession) {
            switch (selectedProfession) {
                case 'alchemy':
                    return <AlchemyInterface onBack={handleBackToProfessions} activeTab={activeTab} onTabChange={setActiveTab} />;
                // Add other profession interfaces here as they're implemented
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
        if (!selectedProfession) return;

        const allRecipes = getRecipesForProfession(selectedProfession);
        allRecipes.forEach(recipe => {
            learnRecipe(selectedProfession, recipe.id);
        });

        addLootNotification({
            type: 'crafting_success',
            message: `Learned ${allRecipes.length} ${PROFESSIONS[selectedProfession]?.name} recipes!`,
            timestamp: Date.now()
        });
    };

    // Add test materials for crafting (currently alchemy-specific)
    const handleAddTestMaterials = () => {
        if (selectedProfession !== 'alchemy') return;

        const testMaterials = [
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
            message: 'Added test potion crafting materials to inventory!',
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
                                    const profession = PROFESSIONS[selectedProfession];
                                    const professionLevel = getProfessionLevel(selectedProfession);
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
                                title="Add test potion crafting materials to inventory"
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
