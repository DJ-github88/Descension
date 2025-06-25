import React, { useMemo } from 'react';
import { useSpellLibrary } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { transformSpellForCard, getSpellRollableTable } from '../../../../components/spellcrafting-wizard/core/utils/spellTransformers';
import './AbilityLibrary.css';

/**
 * AbilityLibrary component
 * A specialized version of SpellLibrary for selecting abilities in the creature wizard
 *
 * @param {Object} props
 * @param {Function} props.onSelectAbility - Callback when an ability is selected
 * @param {string} props.filterType - Optional filter for ability types (ACTION, PASSIVE, etc.)
 * @param {string} props.searchQuery - Search query for filtering abilities
 * @param {Function} props.onHoverAbility - Callback when an ability is hovered
 */
const AbilityLibrary = ({
  onSelectAbility,
  filterType = '',
  searchQuery = '',
  onHoverAbility = () => {}
}) => {
  // Get library state from context
  const library = useSpellLibrary();

  // Apply filters to the spells
  const filteredSpells = useMemo(() => {
    return library.spells.filter(spell => {
      // Search filter
      if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !spell.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by spell type
      if (filterType && spell.spellType !== filterType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filterType, library.spells]);

  // Handle selecting a spell
  const handleSelectSpell = (spellId) => {
    const selectedSpell = library.spells.find(s => s.id === spellId);
    if (selectedSpell && onSelectAbility) {
      onSelectAbility(selectedSpell);
    }
  };

  // Handle hovering over a spell
  const handleHoverSpell = (spellId) => {
    const hoveredSpell = library.spells.find(s => s.id === spellId);
    if (hoveredSpell && onHoverAbility) {
      onHoverAbility(hoveredSpell);
    }
  };

  // Group spells by type for better organization
  const spellsByType = useMemo(() => {
    const grouped = {};

    filteredSpells.forEach(spell => {
      const type = spell.spellType || 'OTHER';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(spell);
    });

    return grouped;
  }, [filteredSpells]);

  // Get spell type display name
  const getSpellTypeDisplayName = (type) => {
    const typeMap = {
      'ACTION': 'Action Abilities',
      'PASSIVE': 'Passive Abilities',
      'REACTION': 'Reaction Abilities',
      'CHANNELED': 'Channeled Abilities',
      'TRAP': 'Trap Abilities',
      'STATE': 'State Effects',
      'OTHER': 'Other Abilities'
    };

    return typeMap[type] || type;
  };

  return (
    <div className="ability-library">
      {filteredSpells.length === 0 ? (
        <div className="no-abilities-found">
          <p>No abilities match your search criteria.</p>
          {searchQuery && (
            <button className="clear-search-btn">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="ability-groups">
          {Object.entries(spellsByType).map(([type, spells]) => (
            <div key={type} className="ability-group">
              <h3 className="ability-group-title">{getSpellTypeDisplayName(type)}</h3>
              <div className="ability-grid">
                {spells.map(spell => {
                  // Transform the spell data for the card
                  const transformedSpell = transformSpellForCard(spell);
                  const rollableTableData = getSpellRollableTable(spell);

                  return (
                    <div
                      key={spell.id}
                      className="ability-card"
                      data-type={spell.spellType || 'OTHER'}
                      onClick={() => handleSelectSpell(spell.id)}
                      onMouseEnter={() => handleHoverSpell(spell.id)}
                      onMouseLeave={() => onHoverAbility(null)}
                    >
                      <div className="ability-card-header">
                        <div className="ability-icon">
                          {spell.icon ? (
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
                              alt={spell.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                              }}
                            />
                          ) : (
                            <div className="ability-icon-placeholder">
                              <i className={`fas fa-${getIconForSpellType(spell.spellType)}`}></i>
                            </div>
                          )}
                        </div>
                        <div className="ability-title">
                          <h4 className="ability-name">{spell.name}</h4>
                          <div className="ability-type">{spell.spellType || 'Ability'}</div>
                        </div>
                      </div>
                      <div className="ability-card-content">
                        <p className="ability-description">
                          {spell.description || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get icon for spell type
function getIconForSpellType(type) {
  switch (type) {
    case 'ACTION': return 'bolt';
    case 'PASSIVE': return 'shield-alt';
    case 'REACTION': return 'redo-alt';
    case 'CHANNELED': return 'spinner';
    case 'TRAP': return 'bomb';
    case 'STATE': return 'hourglass-half';
    default: return 'magic';
  }
}

export default AbilityLibrary;
