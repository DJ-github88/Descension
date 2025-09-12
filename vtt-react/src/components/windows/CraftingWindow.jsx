import React, { useState } from 'react';
import WowWindow from './WowWindow';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import ProfessionSelection from '../crafting/ProfessionSelection';
import AlchemyInterface from '../crafting/AlchemyInterface';
import '../../styles/crafting.css';

function CraftingWindow({ isOpen, onClose }) {
    const { selectedProfession, setSelectedProfession } = useCraftingStore();
    const [activeTab, setActiveTab] = useState('overview');

    const handleProfessionSelect = (professionId) => {
        setSelectedProfession(professionId);
        // Stay on overview tab when selecting a profession
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <ProfessionSelection
                        onProfessionSelect={handleProfessionSelect}
                        selectedProfession={selectedProfession}
                    />
                );
            case 'queue':
                return (
                    <div className="crafting-queue">
                        <div className="queue-header">
                            <h3>Crafting Queue</h3>
                            <p>Items currently being crafted or queued for crafting</p>
                        </div>
                        <div className="queue-content">
                            <div className="queue-empty">
                                <p>No items in crafting queue</p>
                                <p>Select a profession from the Overview tab to start crafting</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <ProfessionSelection
                        onProfessionSelect={handleProfessionSelect}
                        selectedProfession={selectedProfession}
                    />
                );
        }
    };



    // Simplified tabs - just Overview and Queue
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'queue', label: 'Queue' }
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Reset profession selection when switching tabs
        if (tabId === 'overview') {
            setSelectedProfession(null);
        }
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
                <div className="spellbook-tab-container">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
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
