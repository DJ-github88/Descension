import React, { useState } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const { selectedProfession, setSelectedProfession } = useCraftingStore();
    const [activeTab, setActiveTab] = useState('professions');

    const handleProfessionSelect = (professionId) => {
        setSelectedProfession(professionId);
        setActiveTab('crafting');
    };

    const handleBackToProfessions = () => {
        setSelectedProfession(null);
        setActiveTab('professions');
    };

    const renderContent = () => {
        if (!selectedProfession || activeTab === 'professions') {
            return (
                <ProfessionSelection 
                    onProfessionSelect={handleProfessionSelect}
                    selectedProfession={selectedProfession}
                />
            );
        }

        // Render specific profession interface
        switch (selectedProfession) {
            case 'alchemy':
                return (
                    <AlchemyInterface 
                        onBack={handleBackToProfessions}
                    />
                );
            default:
                return (
                    <div className="profession-not-implemented">
                        <div className="not-implemented-content">
                            <div className="not-implemented-icon">
                                <img 
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${PROFESSIONS[selectedProfession]?.icon || 'inv_misc_questionmark'}.jpg`}
                                    alt={PROFESSIONS[selectedProfession]?.name}
                                    onError={(e) => {
                                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                    }}
                                />
                            </div>
                            <h3>{PROFESSIONS[selectedProfession]?.name}</h3>
                            <p>This profession is not yet implemented.</p>
                            <p>Check back later for updates!</p>
                            <button 
                                className="wow-button"
                                onClick={handleBackToProfessions}
                            >
                                Back to Professions
                            </button>
                        </div>
                    </div>
                );
        }
    };

    const getWindowTitle = () => {
        if (selectedProfession && activeTab === 'crafting') {
            const profession = Object.values(PROFESSIONS).find(p => p.id === selectedProfession);
            return `${profession?.name || 'Unknown'} - Crafting`;
        }
        return 'Crafting';
    };

    return (
        <WowWindow
            title={getWindowTitle()}
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 1000, height: 700 }}
            defaultPosition={{ x: 200, y: 100 }}
            className="crafting-window"
        >
            <div className="crafting-window-content">
                {renderContent()}
            </div>
        </WowWindow>
    );
}

export default CraftingWindow;
