import React, { useState, lazy, Suspense, useEffect } from 'react';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import useCreatureStore from '../../store/creatureStore';
import '../creature-wizard/styles/CreatureWindow.css';

// Lazy load the wizard components
const CreatureWizardApp = lazy(() => import('../creature-wizard/CreatureWizardApp'));

const CreatureWindow = () => {
  const [activeView, setActiveView] = useState('library');
  const [editingCreatureId, setEditingCreatureId] = useState(null);
  const creatureStore = useCreatureStore();

  // Debug: Log the creature store state and initialize with sample creatures if empty
  useEffect(() => {
    console.log('CreatureWindow mounted');
    console.log('Creature store state:', creatureStore);
    console.log('Number of creatures:', creatureStore.creatures.length);
    console.log('Creatures:', creatureStore.creatures);

    // Initialize the creature store with sample creatures if it's empty
    if (creatureStore.creatures.length === 0) {
      console.log('Initializing creature store with sample creatures...');

      // Import the sample creatures
      import('../../data/creatureLibraryData').then(({ LIBRARY_CREATURES }) => {
        console.log('Sample creatures:', LIBRARY_CREATURES);

        // Add sample creatures to the store
        LIBRARY_CREATURES.forEach(creature => {
          console.log('Adding creature to store:', creature.name);
          creatureStore.addCreature(creature);
        });

        console.log(`Added ${LIBRARY_CREATURES.length} sample creatures to the store.`);
        console.log('Updated creature store state:', creatureStore);
        console.log('Updated number of creatures:', creatureStore.creatures.length);
      });
    }
  }, [creatureStore]);

  // Handle switching to wizard view for editing a creature
  const handleEditCreature = (creatureId) => {
    console.log('Editing creature:', creatureId);
    setEditingCreatureId(creatureId);
    setActiveView('wizard');
  };

  // Handle switching back to library view
  const handleBackToLibrary = () => {
    console.log('Back to library');
    setActiveView('library');
    setEditingCreatureId(null);
  };

  // Handle creating a new creature
  const handleCreateNewCreature = () => {
    console.log('Creating new creature');
    setEditingCreatureId(null);
    setActiveView('wizard');
  };

  return (
    <div className="creature-window">
      <CreatureLibraryProvider>
        <CreatureWizardProvider>
          {/* Header with navigation */}
          <div className="creature-window-header">
            <div className="creature-window-tabs">
              <button
                className={`creature-window-tab ${activeView === 'library' ? 'active' : ''}`}
                onClick={() => setActiveView('library')}
              >
                <i className="fas fa-book"></i>
                Library
              </button>
              <button
                className={`creature-window-tab ${activeView === 'wizard' ? 'active' : ''}`}
                onClick={handleCreateNewCreature}
              >
                <i className="fas fa-magic"></i>
                Create New
              </button>
            </div>

            {activeView === 'wizard' && (
              <button
                className="back-to-library-button"
                onClick={handleBackToLibrary}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Library
              </button>
            )}
          </div>

          {/* Main content area */}
          <div className="creature-window-content">
            {activeView === 'library' ? (
              <CreatureLibrary onEdit={handleEditCreature} />
            ) : (
              <Suspense fallback={<div className="loading-wizard">Loading Creature Wizard...</div>}>
                <CreatureWizardApp
                  editMode={!!editingCreatureId}
                  creatureId={editingCreatureId}
                  onSave={handleBackToLibrary}
                  onCancel={handleBackToLibrary}
                />
              </Suspense>
            )}
          </div>
        </CreatureWizardProvider>
      </CreatureLibraryProvider>
    </div>
  );
};

export default CreatureWindow;
