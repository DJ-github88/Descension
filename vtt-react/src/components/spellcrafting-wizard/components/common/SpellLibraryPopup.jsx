import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { transformSpellForCard, getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import UnifiedSpellCard from './UnifiedSpellCard';
import '../../styles/SpellLibraryPopup.css';

/**
 * SpellLibraryPopup component
 * A standalone modal popup for selecting spells from the library
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
  // Get library state from context
  const library = useSpellLibrary();

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when component unmounts or modal closes
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Apply filters to the spells
  const filteredSpells = useMemo(() => {
    return library.spells.filter(spell => {
      // Search filter
      if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !spell.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter type from props (if provided)
      if (filterType) {
        // Special handling for "proc" filter type
        if (filterType === 'proc') {
          // For proc effects, include damage, healing, and buff spells
          return ['damage', 'healing', 'buff'].includes(spell.effectType);
        }
        // Special handling for "form" filter type
        else if (filterType === 'form' && spell.effectType === 'transformation') {
          return true;
        }
        // Default filter by exact effect type
        else if (spell.effectType !== filterType) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterType, library.spells]);

  // Handle selecting a spell
  const handleSelectSpell = (spellId) => {
    const selectedSpell = library.spells.find(s => s.id === spellId);
    if (selectedSpell) {
      if (onSelectSpell) {
        onSelectSpell(selectedSpell);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use ReactDOM.createPortal to render the modal directly to the document body
  return ReactDOM.createPortal(
    <div className="spell-library-modal-backdrop" onClick={onClose}>
      <div
        className="spell-library-modal"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Modal header */}
        <div className="spell-library-modal-header">
          <h2>{title}</h2>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        {/* Modal content */}
        <div className="spell-library-popup-content">
          {/* Search input */}
          <div className="spell-library-popup-header">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search spells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="spell-search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Spell cards */}
          <div className="spell-library-popup-spells grid-view">
            {filteredSpells.length === 0 ? (
              <div className="no-spells-found">
                <p>No spells match your search criteria.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="spell-cards-container">
                {filteredSpells.map(spell => {
                  // Transform the spell data for the card
                  const transformedSpell = transformSpellForCard(spell);
                  const rollableTableData = getSpellRollableTable(spell);

                  return (
                    <div
                      key={spell.id}
                      className="spell-item library-style"
                      onClick={() => handleSelectSpell(spell.id)}
                    >
                      <UnifiedSpellCard
                        spell={transformedSpell}
                        variant="wizard"
                        rollableTableData={rollableTableData}
                        showActions={false}
                        showDescription={true}
                        showStats={true}
                        showTags={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SpellLibraryPopup;
