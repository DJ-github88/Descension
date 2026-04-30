import React, { useMemo } from 'react';
import useSpellbookStore from '../../../../store/spellbookStore';
import { transformSpellForCard, getSpellRollableTable } from '../../../../components/spellcrafting-wizard/core/utils/spellTransformers';
import UnifiedSpellCard from '../../../../components/spellcrafting-wizard/components/common/UnifiedSpellCard';
import './AbilityLibrary.css';
import '../../../../components/spellcrafting-wizard/styles/pathfinder/components/compact-spell-view.css';

const AbilityLibrary = ({
  onSelectAbility,
  filterType = '',
  searchQuery = '',
  onHoverAbility = () => {},
  recentlyAddedSpells = new Set(),
  existingAbilities = []
}) => {
  const spells = useSpellbookStore(state => state.spells || []);

  const filteredSpells = useMemo(() => {
    return spells.filter(spell => {
      if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !spell.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (filterType && spell.spellType !== filterType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filterType, spells]);

  const handleSelectSpell = (spellId) => {
    const selectedSpell = spells.find(s => s.id === spellId);
    if (selectedSpell && onSelectAbility) {
      onSelectAbility(selectedSpell);
    }
  };

  const handleHoverSpell = (spellId) => {
    const hoveredSpell = spells.find(s => s.id === spellId);
    if (hoveredSpell && onHoverAbility) {
      onHoverAbility(hoveredSpell);
    }
  };

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
      {spells.length === 0 ? (
        <div className="no-abilities-found">
          <p>No spells found in your spellbook.</p>
          <p>Create spells in your Spellbook first, then add them here.</p>
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
          {Object.entries(spellsByType).map(([type, typeSpells]) => (
            <div key={type} className="ability-group">
              <h3 className="ability-group-title">{getSpellTypeDisplayName(type)}</h3>
              <div className="ability-grid compact-view">
                {typeSpells.map(spell => {
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

export default AbilityLibrary;
