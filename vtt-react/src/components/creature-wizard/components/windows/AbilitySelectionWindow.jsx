import React, { useState, useEffect, Suspense, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SpellLibraryProvider } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { transformSpellForCard, getSpellRollableTable } from '../../../../components/spellcrafting-wizard/core/utils/spellTransformers';
import AbilityLibrary from './AbilityLibrary';
import PreviewSpellCard from './PreviewSpellCard';
import AllSpellsLoader from './AllSpellsLoader';
import './AbilitySelectionWindow.css';
import './PreviewSpellCard.css';

// Import the WowWindow component
const WowWindow = React.lazy(() => import('../../../../components/windows/WowWindow'));

// Spell types for filtering
const SPELL_TYPES = [
  { id: 'ACTION', name: 'Action', icon: 'fas fa-bolt' },
  { id: 'PASSIVE', name: 'Passive', icon: 'fas fa-shield-alt' },
  { id: 'REACTION', name: 'Reaction', icon: 'fas fa-redo-alt' },
  { id: 'CHANNELED', name: 'Channeled', icon: 'fas fa-spinner' },
  { id: 'TRAP', name: 'Trap', icon: 'fas fa-bomb' },
  { id: 'STATE', name: 'State', icon: 'fas fa-hourglass-half' }
];

/**
 * AbilitySelectionWindow component
 * A popup window for selecting abilities/spells from the library
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {Function} props.onClose - Callback when the window is closed
 * @param {Function} props.onSelectAbility - Callback when an ability is selected
 */
const AbilitySelectionWindow = ({ isOpen, onClose, onSelectAbility, recentlyAddedSpells = new Set(), existingAbilities = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hoveredAbility, setHoveredAbility] = useState(null);

  // Reset state when window opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedType('');
      setHoveredAbility(null);

      // Reset the window ref to ensure it's clean
      if (windowRef.current) {
        console.log('Window ref is available on open');
      } else {
        console.log('Window ref is not yet available on open');
      }
    }
  }, [isOpen]);

  // Add event listener for clearing search
  useEffect(() => {
    const handleClearSearch = () => {
      setSearchQuery('');
      setSelectedType('');
    };

    window.addEventListener('clear-ability-search', handleClearSearch);

    return () => {
      window.removeEventListener('clear-ability-search', handleClearSearch);
    };
  }, []);

  // We've removed the preview panel and now use tooltips instead
  // This prevents the window from jumping when hovering over spells

  // Handle selecting an ability
  const handleSelectAbility = (ability) => {
    console.log("AbilitySelectionWindow: handleSelectAbility called with ability:", ability);
    if (onSelectAbility) {
      console.log("AbilitySelectionWindow: Calling onSelectAbility prop");
      onSelectAbility(ability);
    } else {
      console.log("AbilitySelectionWindow: No onSelectAbility prop provided");
    }
  };

  // Handle type filter click
  const handleTypeFilterClick = (typeId) => {
    setSelectedType(selectedType === typeId ? '' : typeId);
  };

  // Create ref for the window element
  const windowRef = useRef(null);

  // Log when the component mounts/unmounts to help with debugging
  useEffect(() => {
    console.log('AbilitySelectionWindow mounted');
    return () => {
      console.log('AbilitySelectionWindow unmounted');
    };
  }, []);

  // Prevent scrolling when the window is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Center the window only once when it first opens
  useEffect(() => {
    if (isOpen && windowRef.current) {
      // Use a timeout to ensure the window is fully rendered
      const timer = setTimeout(() => {
        // Set initial position directly instead of using centerWindow
        // This prevents any repositioning after the initial render
        if (windowRef.current.getElement) {
          console.log('Setting initial window position');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // We've removed window drag tracking since we're using tooltips now

  if (!isOpen) return null;

  return (
    <Suspense fallback={<div className="loading-window">Loading...</div>}>
      <WowWindow
        isOpen={true}
        onClose={onClose}
        title="Select Ability"
        defaultSize={{ width: 1200, height: 800 }}
        defaultPosition={{ x: Math.max(50, window.innerWidth / 2 - 600), y: Math.max(50, window.innerHeight / 2 - 400) }}
        centered={false} /* Disable centering to prevent window jumping */
        ref={windowRef}
        bounds="body"
      >
          <div className="ability-selection-window">
            {/* Header with search and filters */}
            <div className="ability-selection-header">
              <div className="ability-search-container">
                <div className="ability-search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  className="ability-search-input"
                  placeholder="Search abilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="ability-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="ability-type-filters">
                {SPELL_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`ability-type-filter ${selectedType === type.id ? 'active' : ''}`}
                    onClick={() => handleTypeFilterClick(type.id)}
                  >
                    <i className={type.icon}></i>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content area with ability grid */}
            <div className="ability-selection-content">
              <SpellLibraryProvider>
                {/* Load all spells into the library */}
                <AllSpellsLoader />
                <Suspense fallback={<div className="loading-library">Loading spell library...</div>}>
                  <AbilityLibrary
                    onSelectAbility={handleSelectAbility}
                    filterType={selectedType}
                    searchQuery={searchQuery}
                    onHoverAbility={setHoveredAbility}
                    recentlyAddedSpells={recentlyAddedSpells}
                    existingAbilities={existingAbilities}
                  />
                </Suspense>
              </SpellLibraryProvider>
            </div>

            {/* Footer with action buttons */}
            <div className="ability-selection-footer">
              <button className="ability-cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>

            {/* We've removed the ability preview panel to prevent window jumping */}
            {/* Instead, we'll show spell details in a tooltip when hovering */}
          </div>
        </WowWindow>
      </Suspense>
  );
};

export default AbilitySelectionWindow;
