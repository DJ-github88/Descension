import React, { useMemo } from 'react';
import { useSpellLibrary } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { transformSpellForCard, getSpellRollableTable, getSpellTypeIcon } from '../../../../components/spellcrafting-wizard/core/utils/spellTransformers';
import UnifiedSpellCard from '../../../../components/spellcrafting-wizard/components/common/UnifiedSpellCard';
import './AbilityLibrary.css';
// Import compact spell view styles
import '../../../../components/spellcrafting-wizard/styles/pathfinder/components/compact-spell-view.css';
// Pathfinder styles imported via spellbook main.css

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
  onHoverAbility = () => {},
  recentlyAddedSpells = new Set(),
  existingAbilities = []
}) => {
  // Get library state from context
  const library = useSpellLibrary();

  // Apply filters to the spells
  const filteredSpells = useMemo(() => {
    console.log(`AbilityLibrary: Total spells in library: ${library.spells.length}`);

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
    console.log("AbilityLibrary: handleSelectSpell called with spellId:", spellId);
    const selectedSpell = library.spells.find(s => s.id === spellId);
    console.log("AbilityLibrary: Found spell:", selectedSpell);
    if (selectedSpell && onSelectAbility) {
      console.log("AbilityLibrary: Calling onSelectAbility with spell:", selectedSpell.name);
      onSelectAbility(selectedSpell);
    } else {
      console.log("AbilityLibrary: No spell found or no onSelectAbility callback");
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
      {library.spells.length === 0 ? (
        <div className="no-abilities-found">
          <p>No spells found in the library.</p>
          <p>Please wait while the spells are being loaded...</p>
        </div>
      ) : filteredSpells.length === 0 ? (
        <div className="no-abilities-found">
          <p>No abilities match your search criteria.</p>
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => window.dispatchEvent(new CustomEvent('clear-ability-search'))}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="ability-groups">
          {Object.entries(spellsByType).map(([type, spells]) => (
            <div key={type} className="ability-group">
              <h3 className="ability-group-title">{getSpellTypeDisplayName(type)}</h3>
              <div className="ability-grid compact-view">
                {spells.map(spell => {
                  // Transform the spell data for the card
                  const transformedSpell = transformSpellForCard(spell);
                  const rollableTableData = getSpellRollableTable(spell);

                  // Check if this spell is already added or recently added
                  const isAlreadyAdded = existingAbilities.some(ability => ability.spellId === spell.id);
                  const isRecentlyAdded = recentlyAddedSpells.has(spell.id);

                  // Determine the appropriate class names
                  let className = "ability-compact-item";
                  if (isRecentlyAdded) {
                    className += " recently-added";
                  } else if (isAlreadyAdded) {
                    className += " already-added";
                  }

                  return (
                    <UnifiedSpellCard
                      key={spell.id}
                      spell={transformedSpell}
                      variant="compact"
                      rollableTableData={rollableTableData}
                      onClick={() => handleSelectSpell(spell.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        // Handle context menu if needed
                      }}
                      isSelected={isRecentlyAdded}
                      className={className}
                      showActions={false}
                      showDescription={false}
                      showStats={false}
                      showTags={false}
                      isDraggable={true}
                    />
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

// Use the imported getSpellTypeIcon function

export default AbilityLibrary;
