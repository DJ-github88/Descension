import React, { useState, useEffect } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const { selectedProfession, setSelectedProfession } = useCraftingStore();

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
                    return <AlchemyInterface onBack={handleBackToProfessions} />;
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

    // Get the current tab label based on selected profession
    const getCurrentTabLabel = () => {
        if (selectedProfession) {
            const profession = PROFESSIONS[selectedProfession];
            return profession ? profession.name : 'Profession';
        }
        return 'Overview';
    };

    // Single tab that changes label based on context
    const tabs = [
        { id: 'main', label: getCurrentTabLabel() }
    ];

    return (
        <WowWindow
            title="Crafting"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 1000, height: 700 }}
            defaultPosition={{ x: 200, y: 100 }}
            className="crafting-window"
            customHeader={
                <div className="spellbook-tab-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className="spellbook-tab-button active"
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
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
