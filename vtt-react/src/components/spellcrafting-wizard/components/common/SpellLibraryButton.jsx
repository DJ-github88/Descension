import React, { useState } from 'react';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import SpellLibraryPopup from './SpellLibraryPopup';
import '../../styles/SpellLibraryButton.css';

/**
 * SpellLibraryButton component
 * A button that opens a popup to select spells from the library
 *
 * @param {Object} props
 * @param {string} props.selectedSpellId - Currently selected spell ID
 * @param {Function} props.onSpellSelect - Callback when a spell is selected
 * @param {string} props.filterType - Optional filter for spell types
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.popupTitle - Title for the popup window
 */
const SpellLibraryButton = ({
  selectedSpellId,
  onSpellSelect,
  filterType = '',
  buttonText = 'Select Spell from Library',
  popupTitle = 'Select Spell from Library'
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const library = useSpellLibrary();

  // Find the selected spell in the library
  const selectedSpell = selectedSpellId
    ? library.spells.find(spell => spell.id === selectedSpellId)
    : null;

  // Get spell icon URL
  const getSpellIconUrl = (iconName) => {
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName || 'inv_misc_questionmark'}.jpg`;
  };

  // Handle spell selection
  const handleSpellSelect = (spell) => {
    if (onSpellSelect) {
      onSpellSelect(spell.id);
    }
    setIsPopupOpen(false);
  };

  // Handle clearing the selection
  const handleClearSelection = (e) => {
    e.stopPropagation();
    if (onSpellSelect) {
      onSpellSelect(null);
    }
  };

  return (
    <div className="spell-library-button-container">
      {selectedSpell ? (
        <div className="selected-spell-display" onClick={() => setIsPopupOpen(true)}>
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
            <button
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopupOpen(true);
              }}
              title="Change selection"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>

            <button
              className="clear-selection-btn"
              onClick={handleClearSelection}
              title="Clear selection"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <button
          className="spell-library-button"
          onClick={() => setIsPopupOpen(true)}
        >
          <i className="fas fa-book-open"></i>
          <span>{buttonText}</span>
        </button>
      )}

      <SpellLibraryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelectSpell={handleSpellSelect}
        title={popupTitle}
        filterType={filterType}
      />
    </div>
  );
};

export default SpellLibraryButton;
