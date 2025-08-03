import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import WowWindow from './WowWindow';
import useSpellbookStore from '../../store/spellbookStore';
import { LIBRARY_SPELLS } from '../../data/spellLibraryData';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../spellcrafting-wizard/context/SpellLibraryContext';
import CollectionContextMenu from '../spellcrafting-wizard/components/library/CollectionContextMenu';
import CollectionViewWindow from '../spellcrafting-wizard/components/library/CollectionViewWindow';
import SpellLibrary from '../spellcrafting-wizard/components/library/SpellLibrary';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { formatFormulaToPlainEnglish } from '../spellcrafting-wizard/components/common/SpellCardUtils';

// Pathfinder-themed styles are now imported globally in App.jsx
import { clearAllSpellCache } from '../../utils/clearSpellCache';

// Define simple icon components instead of using react-icons/fa
const SearchIcon = () => <span style={{ fontSize: '12px' }}></span>;
const FilterIcon = () => <span style={{ fontSize: '12px' }}></span>;
const BookIcon = () => <span style={{ fontSize: '12px' }}></span>;
const MagicIcon = () => <span style={{ fontSize: '12px' }}></span>;
const BoltIcon = () => <span style={{ fontSize: '12px' }}></span>;
const PlusIcon = () => <span style={{ fontSize: '12px' }}></span>;

// Pre-load SpellWizard for better development experience
import SpellWizard from '../spellcrafting-wizard/SpellWizardWrapper';

// Simple wrapper that uses UnifiedSpellCard for spellbook display
const SpellCardWrapper = ({ spell, onClick }) => {
  return (
    <UnifiedSpellCard
      spell={spell}
      variant="spellbook"
      onClick={onClick}
      showActions={false}
      showDescription={true}
      showStats={true}
      showTags={true}
    />
  );
};

const SpellWizardTab = () => {
  // No local state, just render the wizard (pre-loaded)
  return (
    <div style={{ width: '100%', height: '100%', padding: 0, overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <SpellWizard hideHeader={true} />
      </div>
    </div>
  );
};

const SpellbookWindow = ({ isOpen = true, onClose = () => {} }) => {
  const {
    activeTab,
    setActiveTab,
    windowPosition,
    windowSize,
    setWindowPosition,
    setWindowSize
  } = useSpellbookStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading spellbook...</div>
        </div>
      );
    }

    // Conditional rendering since CSS is preloaded
    switch (activeTab) {
      case 'wizard':
        return <SpellWizardTab />;
      case 'library':
        return <SpellLibraryTab />;
      case 'collections':
        return <SpellCollectionTab />;
      default:
        return <SpellWizardTab />;
    }
  };

  // Spell Library Tab Component - now includes filtering functionality
  const SpellLibraryTab = () => {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <SpellLibrary />
      </div>
    );
  };

  // Spell Collection Tab Component
  const SpellCollectionTab = () => {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <SpellLibrary />
      </div>
    );
  };

  // Create a ref for the window
  const windowRef = useRef(null);

  // Handle window drag to save position
  const handleWindowDrag = useCallback((position) => {
    // Only save x and y coordinates to avoid circular references
    setWindowPosition({ x: position.x, y: position.y });
  }, [setWindowPosition]);

  // Calculate proper default position (centered)
  const getDefaultPosition = useCallback(() => {
    if (windowPosition) {
      return windowPosition;
    }
    // Center the window on screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const windowWidth = windowSize?.width || 1200;
    const windowHeight = windowSize?.height || 800;

    return {
      x: Math.max(0, (screenWidth - windowWidth) / 2),
      y: Math.max(0, (screenHeight - windowHeight) / 2)
    };
  }, [windowPosition, windowSize]);

  return (
    <WowWindow
      ref={windowRef}
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={getDefaultPosition()}
      defaultSize={windowSize}
      title="Spellbook"
      centered={false} // Handle centering manually
      onDrag={handleWindowDrag}
      customHeader={
        <div className="spellbook-tab-headers">
          <button
            className={`spellbook-tab ${activeTab === 'wizard' ? 'active' : ''}`}
            onClick={() => setActiveTab('wizard')}
          >
            <MagicIcon />
            Spell Wizard
          </button>
          <button
            className={`spellbook-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <BookIcon />
            Spell Library
          </button>
          <button
            className={`spellbook-tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            <FilterIcon />
            Collections
          </button>
        </div>
      }
    >
      <div className="spellbook-content" style={{ position: 'relative', height: '100%' }}>
        {renderContent()}
      </div>
    </WowWindow>
  );
};

export default SpellbookWindow;
