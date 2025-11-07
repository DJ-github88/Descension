import React, { useState } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import useChatStore from '../../store/chatStore';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('recipes');
    const {
        selectedProfession,
        setSelectedProfession,
        getProfessionLevel,
        getRecipesForProfession,
        learnRecipe
    } = useCraftingStore();
    const { addLootNotification } = useChatStore();

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
                    return <AlchemyInterface onBack={handleBackToProfessions} activeTab={activeTab} />;
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
                        {selectedProfession && (
                            <div className="crafting-header-tabs">
                                <button
                                    className={`crafting-overlay-tab ${activeTab === 'recipes' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('recipes')}
                                >
                                    <span>Recipes</span>
                                    <span className="tab-count">({getRecipesForProfession(selectedProfession).length})</span>
                                </button>
                                <button
                                    className={`crafting-overlay-tab ${activeTab === 'queue' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('queue')}
                                >
                                    <span>Queue</span>
                                    <span className="tab-count">(0)</span>
                                </button>
                            </div>
                        )}
                    </div>
                    {selectedProfession && (
                        <div className="crafting-header-actions">
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
