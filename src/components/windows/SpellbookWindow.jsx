import React, { lazy, Suspense } from 'react';
import WowWindow from './WowWindow';
import useSpellbookStore from '../../store/spellbookStore';
import '../spell-wizard/styles/spell-wizard.css';

// Lazy load SpellWizard to avoid circular dependencies
const SpellWizard = lazy(() => import('../spell-wizard/SpellWizard'));

// SpellbookTab component to display spells
const SpellbookTab = () => {
  const { spells, collections, selectedCollection, selectSpell } = useSpellbookStore();
  const spellsToShow = selectedCollection 
    ? collections.find(c => c.id === selectedCollection)?.spells.map(id => spells.find(s => s.id === id))
    : spells;

  if (!spellsToShow || spellsToShow.length === 0) {
    return (
      <div className="spellbook-content empty-state">
        <h2>Your Spellbook is Empty</h2>
        <p>Create new spells using the Spell Wizard tab!</p>
      </div>
    );
  }

  return (
    <div className="spellbook-content">
      <div className="spells-grid">
        {spellsToShow.map(spell => (
          <div key={spell.id} className="spell-card" onClick={() => selectSpell(spell.id)}>
            <h3>{spell.name}</h3>
            <div className="spell-info">
              <span>{spell.class}</span>
              <span>Level {spell.level}</span>
            </div>
            <p>{spell.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// SpellCollectionTab component to display collections
const SpellCollectionTab = () => {
  const { collections, selectCollection, selectedCollection } = useSpellbookStore();

  return (
    <div className="collection-content">
      <div className="collections-grid">
        {collections.map(collection => (
          <div 
            key={collection.id} 
            className={`collection-card ${selectedCollection === collection.id ? 'selected' : ''}`}
            onClick={() => selectCollection(collection.id)}
          >
            <h3>{collection.name}</h3>
            <p>{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SpellWizardTab = () => {
  return (
    <Suspense fallback={<div>Loading Spell Wizard...</div>}>
      <SpellWizard />
    </Suspense>
  );
};

const SpellbookWindow = ({ isOpen = true, onClose = () => {} }) => {
  const { activeTab, setActiveTab } = useSpellbookStore();
  
  const renderContent = () => {
    switch (activeTab) {
      case 'spellbook':
        return <SpellbookTab />;
      case 'collections':
        return <SpellCollectionTab />;
      case 'wizard':
        return <SpellWizardTab />;
      default:
        return <SpellbookTab />;
    }
  };
  
  return (
    <WowWindow 
      title="Spellbook" 
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 500, height: 500 }}
      minWidth={400}
      minHeight={400}
      maxWidth={600}
      maxHeight={600}
      defaultPosition={{ x: 120, y: 120 }}
    >
      <div className="spellbook-window">
        <div className="spellbook-tabs">
          <button 
            className={`tab-button ${activeTab === 'spellbook' ? 'active' : ''}`}
            onClick={() => setActiveTab('spellbook')}
          >
            Spellbook
          </button>
          <button 
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
          <button 
            className={`tab-button ${activeTab === 'wizard' ? 'active' : ''}`}
            onClick={() => setActiveTab('wizard')}
          >
            Spell Wizard
          </button>
        </div>
        <div className="spellbook-content">
          {renderContent()}
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellbookWindow;