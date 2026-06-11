import React, { useState, useCallback } from 'react';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import CommunityCreaturesTab from '../creature-wizard/components/library/CommunityCreaturesTab';
import CreatureWizardApp from '../creature-wizard/CreatureWizardApp';

const SUB_TABS = [
  { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
  { id: 'wizard', label: 'Create New', icon: 'fas fa-plus-circle' },
  { id: 'community', label: 'Community', icon: 'fas fa-globe' },
];

const CreatureLibraryContent = ({ isGMMode }) => {
  const [activeView, setActiveView] = useState('library');
  const [editingCreatureId, setEditingCreatureId] = useState(null);

  const handleCreateNewCreature = useCallback(() => {
    setEditingCreatureId(null);
    setActiveView('wizard');
  }, []);

  const handleBackToLibrary = useCallback(() => {
    setActiveView('library');
    setEditingCreatureId(null);
  }, []);

  const handleEditCreature = useCallback((creatureId) => {
    setEditingCreatureId(creatureId);
    setActiveView('wizard');
  }, []);

  return (
    <div className="creature-window">
      <CreatureLibraryProvider>
        <CreatureWizardProvider>
          <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', padding: '0 8px' }}>
            {SUB_TABS.map(tab => (
              <button
                key={tab.id}
                className={`spellbook-tab-button ${activeView === tab.id ? 'active' : ''}`}
                onClick={() => tab.id === 'wizard' ? handleCreateNewCreature() : setActiveView(tab.id)}
              >
                <i className={tab.icon} style={{ marginRight: '6px', fontSize: '12px' }}></i>
                <span style={{ fontSize: '12px' }}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="creature-window-content">
            <div style={{ display: activeView === 'library' ? 'flex' : 'none', flex: 1, minHeight: 0, flexDirection: 'column' }}>
              <CreatureLibrary onEdit={handleEditCreature} />
            </div>
            <div style={{ display: activeView === 'wizard' ? 'flex' : 'none', flex: 1, minHeight: 0, flexDirection: 'column' }}>
              <CreatureWizardApp
                editMode={!!editingCreatureId}
                creatureId={editingCreatureId}
                onSave={handleBackToLibrary}
                onCancel={handleBackToLibrary}
                activeView={activeView}
              />
            </div>
            <div style={{ display: activeView === 'community' ? 'block' : 'none' }}>
              <CommunityCreaturesTab />
            </div>
          </div>
        </CreatureWizardProvider>
      </CreatureLibraryProvider>
    </div>
  );
};

export default CreatureLibraryContent;
