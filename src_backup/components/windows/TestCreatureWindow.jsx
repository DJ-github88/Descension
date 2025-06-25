import React, { useState, useEffect } from 'react';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import useCreatureStore from '../../store/creatureStore';
import '../creature-wizard/styles/CreatureWindow.css';

const TestCreatureWindow = () => {
  console.log('TestCreatureWindow rendered');
  const [activeView, setActiveView] = useState('library');
  const creatureStore = useCreatureStore();

  // Debug: Log the creature store state
  useEffect(() => {
    console.log('TestCreatureWindow mounted');
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
                onClick={() => setActiveView('wizard')}
              >
                <i className="fas fa-magic"></i>
                Create New
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className="creature-window-content">
            {activeView === 'library' ? (
              <CreatureLibrary onEdit={() => console.log('Edit creature')} />
            ) : (
              <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                padding: '20px'
              }}>
                <h1>Creature Wizard</h1>
                <p>This is a placeholder for the creature wizard.</p>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                  onClick={() => setActiveView('library')}
                >
                  Back to Library
                </button>
              </div>
            )}
          </div>
        </CreatureWizardProvider>
      </CreatureLibraryProvider>
    </div>
  );
};

export default TestCreatureWindow;
