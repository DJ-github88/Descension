import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import MythrillWindow from './MythrillWindow';
import useSpellbookStore from '../../store/spellbookStore';
import useGameStore from '../../store/gameStore';
import {    SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { SpellWizardProvider } from '../spellcrafting-wizard/context/spellWizardContext';
import SpellLibrary from '../spellcrafting-wizard/components/library/SpellLibrary';
import CommunitySpellsTab from '../spellcrafting-wizard/components/library/CommunitySpellsTab';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';

// Pathfinder-themed styles are now imported globally in App.jsx

import SpellWizard from '../spellcrafting-wizard/SpellWizardWrapper';

// Icons removed for cleaner tab design

// Pre-load SpellWizard for better development experience

// Simple wrapper that uses UnifiedSpellCard for spellbook display

import TabDropdownButton from '../../components/common/TabDropdownButton';

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

// Spell Library Tab Component - now includes filtering functionality
const SpellLibraryTab = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SpellLibrary />
    </div>
  );
};

const SpellbookWindow = ({ isOpen = true, onClose = () => { } }) => {
  const {
    activeTab,
    setActiveTab,
    windowPosition,
    windowSize,
    setWindowPosition
  } = useSpellbookStore();
  const { isGMMode } = useGameStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  // Redirect players away from wizard tab if they somehow access it
  useEffect(() => {
    if (!isGMMode && activeTab === 'wizard') {
      setActiveTab('library');
    }
  }, [isGMMode, activeTab, setActiveTab]);

  // Define tabs for consistent formatting - conditionally show Spell Wizard tab only for GMs
  const tabs = [
    ...(isGMMode ? [{ id: 'wizard', label: 'Spell Wizard' }] : []),
    { id: 'library', label: 'Spell Library' },
    { id: 'collections', label: 'Community' }
  ];

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading spellbook...</div>
        </div>
      );
    }

    // Only render the active tab to prevent duplicate instances
    switch (activeTab) {
      case 'wizard':
        return <SpellWizardTab />;
      case 'library':
        return <SpellLibraryTab />;
      case 'collections':
        return <CommunitySpellsTab />;
      default:
        return <SpellWizardTab />;
    }
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
    <MythrillWindow
      ref={windowRef}
      isOpen={isOpen}
      onClose={onClose}
      defaultPosition={getDefaultPosition()}
      defaultSize={windowSize}
      title="Spellbook"
      centered={false} // Handle centering manually
      onDrag={handleWindowDrag}
      customHeader={
                    <TabDropdownButton
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                        onDropdownTabClick={setActiveTab}
                    />
                }
    >
      <div className={`spellbook-content ${activeTab !== 'collections' ? 'spellbook-layout' : ''}`} style={{ position: 'relative', height: '100%' }}>
        {renderContent()}
      </div>
    </MythrillWindow>
  );
};

const ExternalLivePreview = lazy(() => import('../spellcrafting-wizard/ExternalLivePreview'));

const SpellbookWindowWrapper = (props) => {
  return (
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellbookWindow {...props} />
        {props.isOpen && (
          <Suspense fallback={null}>
            <ExternalLivePreview />
          </Suspense>
        )}
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
};

export default SpellbookWindowWrapper;
