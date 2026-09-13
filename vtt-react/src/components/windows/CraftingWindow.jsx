import React, { useState } from 'react';
import MythrillWindow from './MythrillWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import FirstAidInterface from '../crafting/FirstAidInterface';
import BlacksmithingInterface from '../crafting/BlacksmithingInterface';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('recipes');
    const {
        selectedProfession,
        setSelectedProfession,
        getProfessionLevel,
        professionLevels
    } = useCraftingStore();

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
                case 'blacksmithing':
                    return <BlacksmithingInterface onBack={handleBackToProfessions} activeTab={activeTab} onTabChange={setActiveTab} />;
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

    return (
        <MythrillWindow
            title="Crafting"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 1000, height: 700 }}
            defaultPosition={{ x: 200, y: 100 }}
            className="crafting-window"
            customHeader={
                <div className="spellbook-tab-container" style={{ width: '100%', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                        {selectedProfession && (
                            <button 
                                className="spellbook-tab-button"
                                style={{ 
                                    flex: '0 0 auto',
                                    minWidth: 'auto',
                                    padding: '0 20px',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    background: 'rgba(255, 255, 255, 0.04)'
                                }}
                                onClick={handleBackToProfessions}
                                title="Back to professions list"
                            >
                                <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                                <span>Back</span>
                            </button>
                        )}
                        <button className="spellbook-tab-button active" style={{ flex: '0 0 auto', minWidth: 'auto', padding: '0 24px' }}>
                            <i className="fas fa-hammer" style={{ marginRight: '8px' }}></i>
                            <span>
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
                                    'CRAFTING'
                                )}
                            </span>
                        </button>
                    </div>
                </div>
                }
        >
            <div className="crafting-window-content">
                {renderContent()}
            </div>
        </MythrillWindow>
    );
}

export default CraftingWindow;
