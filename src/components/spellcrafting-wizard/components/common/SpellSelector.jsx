import React, { useState, useEffect } from 'react';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import '../../styles/SpellSelector.css';
import SpellDetailPopup from './SpellDetailPopup';

/**
 * SpellSelector component
 * Allows selecting a spell from the spell library
 *
 * @param {Object} props
 * @param {string} props.selectedSpellId - Currently selected spell ID
 * @param {Function} props.onSpellSelect - Callback when a spell is selected (preferred)
 * @param {Function} props.onSelectSpell - Legacy callback when a spell is selected
 * @param {string} props.filterType - Optional filter for spell types (e.g., 'form', 'proc', 'damage')
 * @param {string} props.label - Label text for the search input
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {boolean} props.compact - Whether to use compact styling
 */
const SpellSelector = ({
  selectedSpellId,
  onSpellSelect,
  onSelectSpell,
  filterType = '',
  label = '',
  placeholder = 'Search spells...',
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedSpellForDetail, setSelectedSpellForDetail] = useState(null);

  // Get library state from context
  const library = useSpellLibrary();

  // Selected spell object
  const selectedSpell = selectedSpellId
    ? library.spells.find(spell => spell.id === selectedSpellId)
    : null;

  // Log selected spell information for debugging
  useEffect(() => {
    console.log('SpellSelector - Selected Spell ID:', selectedSpellId);
    console.log('SpellSelector - Found Spell:', selectedSpell);
    console.log('SpellSelector - Library Spells:', library.spells);
  }, [selectedSpellId, selectedSpell, library.spells]);

  // Filter spells based on search query and filter type
  useEffect(() => {
    if (isDropdownOpen) {
      let filtered = library.spells;

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
  }, [isDropdownOpen, searchQuery, library.spells, filterType]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.spell-selector-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle spell selection
  const handleSelectSpell = (spell) => {
    // Show the detail popup instead of immediately selecting
    setSelectedSpellForDetail(spell.id);
    setShowDetailPopup(true);
    setIsDropdownOpen(false);
  };

  // Handle final spell selection from the popup
  const handleFinalSpellSelection = (spellId) => {
    // Find the spell in the library
    const spell = library.spells.find(s => s.id === spellId);

    if (!spell) return;

    // Support both callback naming conventions
    if (onSpellSelect) {
      // Pass the full spell object ID with additional metadata to help with identification
      const spellData = {
        id: spell.id,
        name: spell.name,
        description: spell.description,
        effectType: spell.effectType
      };
      console.log('SpellSelector - Passing spell data:', spellData);
      onSpellSelect(spell.id, spellData);
    } else if (onSelectSpell) {
      onSelectSpell(spell.id);
    }
    setSearchQuery('');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Get spell icon URL
  const getSpellIconUrl = (iconName) => {
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName || 'inv_misc_questionmark'}.jpg`;
  };

  return (
    <div className={`spell-selector-container ${compact ? 'compact-spell-selector' : ''}`}>
      <div
        className="spell-selector-input-container"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedSpell ? (
          <div className="selected-spell">
            <div className="selected-spell-icon">
              <img
                src={getSpellIconUrl(selectedSpell.icon)}
                alt={selectedSpell.name}
              />
            </div>
            <div className="selected-spell-info">
              <div className="selected-spell-name">{selectedSpell.name}</div>
              {selectedSpell.effectType && (
                <div className="selected-spell-type">{selectedSpell.effectType}</div>
              )}
            </div>
            <div className="selected-spell-actions">
              {/* View details button */}
              <button
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpellForDetail(selectedSpell.id);
                  setShowDetailPopup(true);
                }}
                title="View spell details"
              >
                👁️
              </button>

              {/* Clear selection button */}
              <button
                className="clear-selection-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Support both callback naming conventions
                  if (onSpellSelect) {
                    onSpellSelect(null);
                  } else if (onSelectSpell) {
                    onSelectSpell(null);
                  }
                }}
                title="Clear selection"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <input
            type="text"
            className="spell-search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <div className="dropdown-arrow">
          {isDropdownOpen ? '▲' : '▼'}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="spell-dropdown">
          {filteredSpells.length === 0 ? (
            <div className="no-spells-found">
              {library.spells.length === 0
                ? 'No spells in library. Create some spells first!'
                : 'No matching spells found.'}
            </div>
          ) : (
            <div className="spell-list">
              {filteredSpells.map(spell => (
                <div
                  key={spell.id}
                  className={`spell-item ${selectedSpellId === spell.id ? 'selected' : ''}`}
                  onClick={() => handleSelectSpell(spell)}
                >
                  <div className="spell-icon">
                    <img
                      src={getSpellIconUrl(spell.icon)}
                      alt={spell.name}
                    />
                  </div>
                  <div className="spell-info">
                    <div className="spell-name">{spell.name}</div>
                    <div className="spell-description">{spell.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spell Detail Popup */}
      <SpellDetailPopup
        isOpen={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
        spellId={selectedSpellForDetail}
        onSelectSpell={handleFinalSpellSelection}
      />
    </div>
  );
};

export default SpellSelector;
