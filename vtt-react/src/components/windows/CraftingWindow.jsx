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
        professionLevels,
        craftingQueue = []
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
        setActiveTab('recipes');
    };

    const handleBackToProfessions = () => {
        safeSetSelectedProfession(null);
        setActiveTab('recipes');
    };

    const queuedCount = selectedProfession
        ? (craftingQueue || []).filter(item => item.status === 'queued' && item.recipe?.profession === selectedProfession).length
        : 0;

    const getProfessionIcon = (id) => {
        switch (id) {
            case 'alchemy': return 'fas fa-flask';
            case 'blacksmithing': return 'fas fa-hammer';
            case 'first-aid': return 'fas fa-heartbeat';
            default: return 'fas fa-tools';
        }
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
                <div className="crafting-tab-container">
                    {!selectedProfession ? (
                        <button className="crafting-nav-tab active">
                            <i className="fas fa-hammer"></i>
                            <span>Professions</span>
                        </button>
                    ) : (
                        <>
                            <button 
                                className="crafting-nav-tab back"
                                onClick={handleBackToProfessions}
                                title="Back to professions list"
                            >
                                <i className="fas fa-arrow-left"></i>
                                <span>Professions</span>
                            </button>
                            <button 
                                className={`crafting-nav-tab ${activeTab === 'recipes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('recipes')}
                            >
                                <i className={getProfessionIcon(selectedProfession)}></i>
                                <span>
                                    {(() => {
                                        const profession = Object.values(PROFESSIONS).find(p => p.id === selectedProfession);
                                        const professionLevel = (typeof getProfessionLevel === 'function') 
                                            ? getProfessionLevel(selectedProfession) 
                                            : (professionLevels?.[selectedProfession] ?? SKILL_LEVELS.UNTRAINED.level);
                                        const skillLevelInfo = Object.values(SKILL_LEVELS).find(skill => skill.level === professionLevel);
                                        const skillName = skillLevelInfo?.name || 'Untrained';
                                        return `${profession?.name || 'Profession'} (${skillName})`;
                                    })()}
                                </span>
                            </button>
                            <button 
                                className={`crafting-nav-tab ${activeTab === 'queue' ? 'active' : ''}`}
                                onClick={() => setActiveTab('queue')}
                            >
                                <i className="fas fa-list-ol"></i>
                                <span>Queue{queuedCount > 0 ? ` (${queuedCount})` : ''}</span>
                            </button>
                        </>
                    )}
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
