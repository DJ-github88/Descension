import React, { useState } from 'react';
import WowWindow from './WowWindow';
import ItemLibrary from '../item-generation/ItemLibrary';
import ItemWizard from '../item-generation/ItemWizard';

const ItemLibraryWindow = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('library');

    const tabs = [
        { id: 'library', label: 'Item Library' },
        { id: 'designer', label: 'Item Designer' }
    ];

    const getDefaultPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const width = activeTab === 'designer' ? 800 : 1000;
        const height = activeTab === 'designer' ? 600 : 700;
        return {
            x: (windowWidth - width) / 2,
            y: (windowHeight - height) / 4
        };
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'library':
                return <ItemLibrary contentOnly={true} />;
            case 'designer':
                return <ItemWizard contentOnly={true} />;
            default:
                return <ItemLibrary contentOnly={true} />;
        }
    };

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Item Library"
            defaultSize={activeTab === 'designer' ? { width: 800, height: 600 } : { width: 1000, height: 700 }}
            defaultPosition={getDefaultPosition()}
            customHeader={
                <div className="spellbook-tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            }
        >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                {renderContent()}
            </div>
        </WowWindow>
    );
};

export default ItemLibraryWindow;
