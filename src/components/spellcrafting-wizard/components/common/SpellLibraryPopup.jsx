import React, { useState, useEffect } from 'react';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import LibraryStyleSpellCard from './LibraryStyleSpellCard';
import { transformSpellForCard } from '../../core/utils/spellCardTransformer';
import '../../styles/ConsolidatedSpellCard.css';
import '../../styles/SpellLibraryPopup.css';

// Import Cinzel font for WoW-style headers
const cinzelFontLink = document.createElement('link');
cinzelFontLink.rel = 'stylesheet';
cinzelFontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap';
document.head.appendChild(cinzelFontLink);

/**
 * SpellLibraryPopup component
 * Displays a popup window with a grid of spells from the library
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {Function} props.onClose - Callback when the popup is closed
 * @param {Function} props.onSelectSpell - Callback when a spell is selected
 * @param {string} props.title - Title for the popup window
 * @param {string} props.filterType - Optional filter for spell types
 */
const SpellLibraryPopup = ({
  isOpen,
  onClose,
  onSelectSpell,
  title = 'Select Spell from Library',
  filterType = ''
}) => {
  // Get spell library context
  const library = useSpellLibrary();

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [selectedSpellId, setSelectedSpellId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Filter spells based on search query and filter type
  useEffect(() => {
    if (isOpen) {
      let filtered = library.spells || [];

      // Apply type filter if provided
      if (filterType) {
        filtered = filtered.filter(spell => {
          // Filter based on spell type
          if (filterType === 'form' && spell.effectType === 'transformation') {
            return true;
          }
          if (filterType === 'proc' && (spell.effectType === 'damage' || spell.effectType === 'healing' || spell.effectType === 'buff')) {
            return true;
          }
          if (filterType === spell.effectType) {
            return true;
          }
          return false;
        });
      }

      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(spell =>
          spell.name.toLowerCase().includes(query) ||
          (spell.description && spell.description.toLowerCase().includes(query))
        );
      }

      setFilteredSpells(filtered);
    }
  }, [isOpen, searchQuery, library.spells, filterType]);

  // Handle spell selection
  const handleSelectSpell = (spellId) => {
    setSelectedSpellId(spellId);
  };

  // Handle final spell selection
  const handleConfirmSelection = () => {
    if (selectedSpellId && onSelectSpell) {
      onSelectSpell(selectedSpellId);
      onClose();
    }
  };

  // Get spell icon URL
  const getSpellIconUrl = (iconName) => {
    // Use medium size for better quality and faster loading
    return `https://wow.zamimg.com/images/wow/icons/medium/${iconName || 'inv_misc_questionmark'}.jpg`;
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="spell-library-modal-backdrop" onClick={handleBackdropClick}>
      <div className="spell-library-modal">
        {/* Modal header */}
        <div className="spell-library-modal-header">
          <h2>{title}</h2>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        <div className="spell-library-popup-content">
          {/* Search and filter bar */}
          <div className="spell-library-popup-header">
            <div className="search-container">
              <input
                type="text"
                className="spell-search-input"
                placeholder="Search spells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="view-toggle-buttons">
              <button
                className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <i className="fas fa-th"></i>
              </button>
            </div>
          </div>

          {/* Spells grid/list */}
          <div className={`spell-library-popup-spells ${viewMode}-view`}>
            {filteredSpells.length === 0 ? (
              <div className="no-spells-found">
                {library.spells.length === 0
                  ? 'No spells in library. Create some spells first!'
                  : 'No matching spells found.'}
              </div>
            ) : (
              <div className="spell-cards-container">
                {filteredSpells.map(spell => {
                  // Transform the spell data for the LibraryStyleSpellCard
                  // Use the same transformation function as in the review step
                  const transformedSpell = transformSpellForCard(spell);

                  // Add any additional properties needed for proper display

                  // Ensure procConfig is properly formatted for chance-on-hit effects
                  if (!transformedSpell.procConfig) {
                    transformedSpell.procConfig = spell.procConfig || {
                      enabled: false,
                      procType: 'dice',
                      procChance: 15,
                      diceThreshold: 18,
                      spellEffect: null,
                      useRollableTable: false,
                      effectType: spell.effectType || 'damage',
                      effectDetails: null,
                      effectDuration: 2,
                      effectDurationUnit: 'rounds',
                      customEffects: []
                    };
                  }

                  // Ensure criticalConfig is properly formatted for critical hit effects
                  if (!transformedSpell.criticalConfig) {
                    transformedSpell.criticalConfig = spell.criticalConfig || {
                      enabled: true,
                      critType: 'dice',
                      critMultiplier: 2,
                      spellEffect: null,
                      useRollableTable: false,
                      effectType: spell.effectType || 'damage',
                      effectDetails: null,
                      effectDuration: 2,
                      effectDurationUnit: 'rounds'
                    };
                  }

                  // Get rollable table data if available
                  const rollableTableData = spell.rollableTable ? {
                    enabled: true,
                    name: spell.rollableTable.name || 'Random Effects',
                    resolutionType: spell.rollableTable.resolutionType || 'DICE',
                    entries: spell.rollableTable.entries || []
                  } : null;

                  return (
                    <div
                      key={spell.id}
                      className={`spell-item library-style ${selectedSpellId === spell.id ? 'selected' : ''}`}
                      onClick={() => handleSelectSpell(spell.id)}
                    >
                      <div className="review-spell-preview">
                        <LibraryStyleSpellCard
                          spell={transformedSpell}
                          rollableTableData={rollableTableData}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected spell preview */}
          {selectedSpellId && (
            <div className="selected-spell-preview">
              <h3>Selected Spell</h3>
              <div className="selected-spell-card">
                {(() => {
                  const selectedSpell = library.spells.find(s => s.id === selectedSpellId);
                  if (!selectedSpell) return null;

                  // Transform the spell data for the LibraryStyleSpellCard
                  // Use the same transformation function as in the review step
                  const transformedSpell = transformSpellForCard(selectedSpell);

                  // Add any additional properties needed for proper display

                  // Ensure procConfig is properly formatted for chance-on-hit effects
                  if (!transformedSpell.procConfig) {
                    transformedSpell.procConfig = selectedSpell.procConfig || {
                      enabled: false,
                      procType: 'dice',
                      procChance: 15,
                      diceThreshold: 18,
                      spellEffect: null,
                      useRollableTable: false,
                      effectType: selectedSpell.effectType || 'damage',
                      effectDetails: null,
                      effectDuration: 2,
                      effectDurationUnit: 'rounds',
                      customEffects: []
                    };
                  }

                  // Ensure criticalConfig is properly formatted for critical hit effects
                  if (!transformedSpell.criticalConfig) {
                    transformedSpell.criticalConfig = selectedSpell.criticalConfig || {
                      enabled: true,
                      critType: 'dice',
                      critMultiplier: 2,
                      spellEffect: null,
                      useRollableTable: false,
                      effectType: selectedSpell.effectType || 'damage',
                      effectDetails: null,
                      effectDuration: 2,
                      effectDurationUnit: 'rounds'
                    };
                  }

                  // Get rollable table data if available
                  const rollableTableData = selectedSpell.rollableTable ? {
                    enabled: true,
                    name: selectedSpell.rollableTable.name || 'Random Effects',
                    resolutionType: selectedSpell.rollableTable.resolutionType || 'DICE',
                    entries: selectedSpell.rollableTable.entries || []
                  } : null;

                  return (
                    <LibraryStyleSpellCard
                      spell={transformedSpell}
                      rollableTableData={rollableTableData}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="spell-library-popup-actions">
            <button
              className="wow-button secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="wow-button primary"
              onClick={handleConfirmSelection}
              disabled={!selectedSpellId}
            >
              Select Spell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellLibraryPopup;
