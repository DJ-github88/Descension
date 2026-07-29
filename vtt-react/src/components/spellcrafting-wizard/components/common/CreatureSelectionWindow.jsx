import React, { useState, useEffect, useRef } from 'react';
import { useCreatureLibrary } from '../../../creature-wizard/context/CreatureLibraryContext.js';
import useCreatureStore from '../../../../store/creatureStore';
import CompactCreatureCard from '../../../creature-wizard/components/common/CompactCreatureCard';
import { FaSearch, FaCheck, FaFilter, FaChevronDown } from 'react-icons/fa';
import MythrillWindow from '../../../windows/MythrillWindow';

const filterCreatures = (creatures, filters) => {
  return creatures.filter(creature => {
    if (filters.query && !creature.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !creature.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))) {
      return false;
    }

    if (filters.types.length > 0 && !filters.types.includes(creature.type)) {
      return false;
    }

    if (filters.sizes.length > 0 && !filters.sizes.includes(creature.size)) {
      return false;
    }

    return true;
  });
};

const CreatureSelectionWindow = ({
  isOpen,
  onClose,
  onSelect,
  selectedCreatures = [],
  multiSelect = false,
  title = "Select Creature",
  effectType = "summon"
}) => {
  const library = useCreatureLibrary();
  const creatureStore = useCreatureStore();
  const [filters, setFilters] = useState({
    query: '',
    types: [],
    sizes: []
  });
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [localSelectedCreatures, setLocalSelectedCreatures] = useState(selectedCreatures);

  const availableTypes = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
  const availableSizes = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'];

  const prevSelectedCreaturesRef = useRef();

  useEffect(() => {
    const prevIds = prevSelectedCreaturesRef.current?.map(c => c.id).sort().join(',') || '';
    const currentIds = selectedCreatures.map(c => c.id).sort().join(',');

    if (prevIds !== currentIds) {
      setLocalSelectedCreatures(selectedCreatures);
      prevSelectedCreaturesRef.current = selectedCreatures;
    }
  }, [selectedCreatures]);

  useEffect(() => {
    if (isOpen) {
      setFilters({
        query: '',
        types: [],
        sizes: []
      });
    }
  }, [isOpen]);

  const creatures = library.creatures && library.creatures.length > 0
    ? library.creatures
    : (creatureStore.creatures || []);

  const filteredCreatures = filterCreatures(creatures, filters);

  const handleCreatureClick = (creature) => {
    if (multiSelect) {
      const isSelected = localSelectedCreatures.some(c => c.id === creature.id);
      let newSelection;

      if (isSelected) {
        newSelection = localSelectedCreatures.filter(c => c.id !== creature.id);
      } else {
        newSelection = [...localSelectedCreatures, creature];
      }

      setLocalSelectedCreatures(newSelection);
    } else {
      onSelect([creature]);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    onSelect(localSelectedCreatures);
    onClose();
  };

  const handleTypeFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleSizeFilter = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const clearFilters = () => {
    setFilters({ query: '', types: [], sizes: [] });
  };

  const isCreatureSelected = (creature) => {
    return localSelectedCreatures.some(c => c.id === creature.id);
  };

  const hasActiveFilters = filters.types.length > 0 || filters.sizes.length > 0 || filters.query.length > 0;

  return (
    <MythrillWindow
      title=""
      isOpen={isOpen}
      onClose={onClose}
      modal={true}
      backdrop="static"
      centered={true}
      defaultSize={{ width: 1000, height: 700 }}
      minConstraints={[600, 400]}
    >
      <div className="creature-selection-inner">
        <div className="creature-toolbar">
          <div className="toolbar-row toolbar-row-top">
            <div className="toolbar-title-block">
              <span className="toolbar-title">{title}</span>
              <span className="toolbar-count">{filteredCreatures.length} of {creatures.length}</span>
            </div>

            <div className="toolbar-controls">
              {/* Type filter dropdown — 13 options would crowd the row as chips */}
              <div className="type-filter-wrapper">
                <button
                  className={`filter-dropdown-btn ${filters.types.length > 0 ? 'active' : ''}`}
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  title="Filter by creature type"
                >
                  <FaFilter className="dropdown-icon" />
                  <span>Type</span>
                  {filters.types.length > 0 && (
                    <span className="filter-badge">{filters.types.length}</span>
                  )}
                  <FaChevronDown className={`chevron ${typeDropdownOpen ? 'open' : ''}`} />
                </button>
                {typeDropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setTypeDropdownOpen(false)} />
                    <div className="type-dropdown">
                      <div className="dropdown-header">
                        <span>Creature Type</span>
                        {filters.types.length > 0 && (
                          <button className="dropdown-clear" onClick={() => setFilters(prev => ({ ...prev, types: [] }))}>
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="type-grid">
                        {availableTypes.map(type => (
                          <label key={type} className={`type-option ${filters.types.includes(type) ? 'active' : ''}`}>
                            <input
                              type="checkbox"
                              checked={filters.types.includes(type)}
                              onChange={() => handleTypeFilter(type)}
                            />
                            <span className="type-checkbox">
                              {filters.types.includes(type) && <FaCheck />}
                            </span>
                            <span className="type-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Size filter as inline chips (only 6 options) */}
              <div className="size-filter-inline">
                <span className="size-label">Size</span>
                <div className="size-chips">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      className={`size-chip ${filters.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => handleSizeFilter(size)}
                      title={size.charAt(0).toUpperCase() + size.slice(1)}
                    >
                      {size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button className="toolbar-clear" onClick={clearFilters} title="Clear all filters">
                  Clear
                </button>
              )}

              <div className="toolbar-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="search-input"
                  autoFocus
                />
                {filters.query && (
                  <button className="search-clear" onClick={() => setFilters(prev => ({ ...prev, query: '' }))} title="Clear search">
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="creature-grid">
          {filteredCreatures.length === 0 ? (
            <div className="creature-grid-empty">
              <FaSearch className="empty-icon" />
              <p>No creatures match your filters.</p>
              {hasActiveFilters && (
                <button className="empty-clear-btn" onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          ) : (
            filteredCreatures.map(creature => (
              <div
                key={creature.id}
                className={`creature-card-wrapper ${isCreatureSelected(creature) ? 'selected' : ''}`}
                onClick={() => handleCreatureClick(creature)}
              >
                <CompactCreatureCard creature={creature} />
                {isCreatureSelected(creature) && (
                  <div className="selection-indicator">
                    <FaCheck />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="creature-selection-footer">
          <div className="selection-info">
            {multiSelect ? (
              <span>{localSelectedCreatures.length} creature{localSelectedCreatures.length !== 1 ? 's' : ''} selected</span>
            ) : (
              <span>Click a creature to select</span>
            )}
          </div>
          <div className="footer-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            {multiSelect && (
              <button
                className="confirm-button"
                onClick={handleConfirmSelection}
                disabled={localSelectedCreatures.length === 0}
              >
                <FaCheck /> Confirm Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </MythrillWindow>
  );
};

export default CreatureSelectionWindow;
