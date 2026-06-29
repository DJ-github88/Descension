import React, { useState, useMemo, useCallback } from 'react';
import { List } from 'react-window';
import MythrillWindow from '../../../windows/MythrillWindow';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { transformSpellForCard, getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import UnifiedSpellCard from './UnifiedSpellCard';
// Pathfinder styles imported via main.css

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
  const handleSelectSpell = useCallback((spellId) => {
    const selectedSpell = library.spells.find(s => s.id === spellId);
    if (selectedSpell) {
      if (onSelectSpell) {
        onSelectSpell(selectedSpell);
      }
      onClose();
    }
  }, [library.spells, onSelectSpell, onClose]);

  // Row renderer for react-window
  const Row = useCallback(({ index, style }) => {
    const spell = filteredSpells[index];
    if (!spell) return null;
    const transformedSpell = transformSpellForCard(spell);
    const rollableTableData = getSpellRollableTable(spell);

    return (
      <div style={{ ...style, padding: '4px 8px', boxSizing: 'border-box' }}>
        <div
          className="spell-item library-style"
          onClick={() => handleSelectSpell(spell.id)}
          style={{ cursor: 'pointer', height: '100%', overflow: 'hidden' }}
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
      </div>
    );
  }, [filteredSpells, handleSelectSpell]);

  if (!isOpen) return null;

  return (
    <MythrillWindow
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      modal={true}
      centered={true}
      defaultSize={{ width: 880, height: 720 }}
    >
      <div className="spell-library-popup-content" style={{ flex: '1 1 auto', minHeight: 0, boxSizing: 'border-box' }}>
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
        <div className="spell-library-popup-spells grid-view" style={{ overflow: 'hidden', padding: 0 }}>
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
            <div className="spell-cards-container" style={{ overflow: 'hidden', maxHeight: 'none', height: '540px', padding: 0 }}>
              <List
                height={540}
                itemCount={filteredSpells.length}
                itemSize={380}
                width="100%"
              >
                {Row}
              </List>
            </div>
          )}
        </div>
      </div>
    </MythrillWindow>
  );
};

export default SpellLibraryPopup;
