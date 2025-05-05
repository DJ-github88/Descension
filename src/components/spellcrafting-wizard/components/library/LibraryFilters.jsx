import React, { useState, useEffect } from 'react';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import '../../../spellcrafting-wizard/styles/SpellWizard.css'; // Using the main CSS file for now

const LibraryFilters = () => {
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  // State for collapsed sections (load from localStorage if available)
  const [collapsedSections, setCollapsedSections] = useState(() => {
    try {
      const saved = localStorage.getItem('spellLibraryCollapsedSections');
      return saved ? JSON.parse(saved) : {
        categories: false,
        types: false,
        levels: false,
        effects: false,
        damageTypes: false,
        resources: false
      };
    } catch (e) {
      return {
        categories: false,
        types: false,
        levels: false,
        effects: false,
        damageTypes: false,
        resources: false
      };
    }
  });

  // State for filter presets
  const [filterPresets, setFilterPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('spellLibraryFilterPresets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // State for new preset name input
  const [newPresetName, setNewPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  // Save collapsed sections to localStorage
  useEffect(() => {
    localStorage.setItem('spellLibraryCollapsedSections', JSON.stringify(collapsedSections));
  }, [collapsedSections]);

  // Save filter presets to localStorage
  useEffect(() => {
    localStorage.setItem('spellLibraryFilterPresets', JSON.stringify(filterPresets));
  }, [filterPresets]);

  // Toggle section collapse state
  const toggleSection = (section) => {
    setCollapsedSections({
      ...collapsedSections,
      [section]: !collapsedSections[section]
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    dispatch(libraryActionCreators.setFilters({
      [filterType]: value
    }));
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    dispatch(libraryActionCreators.setFilters({
      query: e.target.value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(libraryActionCreators.clearFilters());
  };

  // Handle sort order change
  const handleSortChange = (field) => {
    const newDirection =
      library.sortOrder.field === field && library.sortOrder.direction === 'asc'
        ? 'desc'
        : 'asc';

    dispatch(libraryActionCreators.setSortOrder({
      field,
      direction: newDirection
    }));
  };

  // Save current filters as a preset
  const saveFilterPreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      filters: { ...library.filters }
    };

    setFilterPresets([...filterPresets, newPreset]);
    setNewPresetName('');
    setShowPresetInput(false);
  };

  // Load a filter preset
  const loadFilterPreset = (preset) => {
    dispatch(libraryActionCreators.setFilters(preset.filters));
  };

  // Delete a filter preset
  const deleteFilterPreset = (presetId, e) => {
    e.stopPropagation();
    const updatedPresets = filterPresets.filter(preset => preset.id !== presetId);
    setFilterPresets(updatedPresets);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (library.filters.query) count++;
    if (library.filters.categories && library.filters.categories.length) count++;
    if (library.filters.levels && library.filters.levels.length) count++;
    if (library.filters.effectTypes && library.filters.effectTypes.length) count++;
    if (library.filters.spellTypes && library.filters.spellTypes.length) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="library-filters">
      <div className="library-filters-header">
        <h3>Filters</h3>
        {activeFilterCount > 0 && (
          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter presets */}
      <div className="filter-presets">
        <div className="filter-presets-header">
          <h4>Presets</h4>
          <button
            className="add-preset-btn"
            onClick={() => setShowPresetInput(!showPresetInput)}
          >
            <i className={`fas fa-${showPresetInput ? 'times' : 'plus'}`}></i>
          </button>
        </div>

        {showPresetInput && (
          <div className="new-preset-input">
            <input
              type="text"
              placeholder="Preset name"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveFilterPreset();
                if (e.key === 'Escape') {
                  setShowPresetInput(false);
                  setNewPresetName('');
                }
              }}
            />
            <button
              className="save-preset-btn"
              onClick={saveFilterPreset}
              disabled={!newPresetName.trim()}
            >
              Save
            </button>
          </div>
        )}

        {filterPresets.length > 0 && (
          <div className="preset-list">
            {filterPresets.map(preset => (
              <div
                key={preset.id}
                className="preset-item"
                onClick={() => loadFilterPreset(preset)}
              >
                <span className="preset-name">{preset.name}</span>
                <button
                  className="delete-preset-btn"
                  onClick={(e) => deleteFilterPreset(preset.id, e)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="filter-search">
        <input
          type="text"
          placeholder="Search spells..."
          value={library.filters.query || ''}
          onChange={handleSearchChange}
          aria-label="Search spells"
        />
        {library.filters.query && (
          <button
            className="clear-search-btn"
            onClick={() => handleFilterChange('query', '')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Categories filter */}
      <div className={`filter-section ${collapsedSections.categories ? 'collapsed' : ''}`}>
        <div
          className="filter-section-header"
          onClick={() => toggleSection('categories')}
        >
          <h4>Categories</h4>
          <i className={`fas fa-chevron-${collapsedSections.categories ? 'down' : 'up'}`}></i>
        </div>

        {!collapsedSections.categories && (
          <div className="filter-section-content">
            {library.categories.map(category => (
              <label key={category.id} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={library.filters.categories?.includes(category.id) || false}
                  onChange={(e) => {
                    const currentCategories = library.filters.categories || [];
                    const updatedCategories = e.target.checked
                      ? [...currentCategories, category.id]
                      : currentCategories.filter(id => id !== category.id);

                    handleFilterChange('categories', updatedCategories);
                  }}
                />
                <span className="category-color" style={{ backgroundColor: category.color }}></span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {library.spells.filter(spell =>
                    spell.categoryIds && spell.categoryIds.includes(category.id)
                  ).length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Spell Types filter */}
      <div className={`filter-section ${collapsedSections.types ? 'collapsed' : ''}`}>
        <div
          className="filter-section-header"
          onClick={() => toggleSection('types')}
        >
          <h4>Spell Types</h4>
          <i className={`fas fa-chevron-${collapsedSections.types ? 'down' : 'up'}`}></i>
        </div>

        {!collapsedSections.types && (
          <div className="filter-section-content">
            {['ACTION', 'CHANNELED', 'PASSIVE', 'REACTION'].map(type => (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={library.filters.spellTypes?.includes(type) || false}
                  onChange={(e) => {
                    const currentTypes = library.filters.spellTypes || [];
                    const updatedTypes = e.target.checked
                      ? [...currentTypes, type]
                      : currentTypes.filter(t => t !== type);

                    handleFilterChange('spellTypes', updatedTypes);
                  }}
                />
                <span className="type-name">{type}</span>
                <span className="type-count">
                  {library.spells.filter(spell => spell.spellType === type).length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Levels filter */}
      <div className={`filter-section ${collapsedSections.levels ? 'collapsed' : ''}`}>
        <div
          className="filter-section-header"
          onClick={() => toggleSection('levels')}
        >
          <h4>Spell Level</h4>
          <i className={`fas fa-chevron-${collapsedSections.levels ? 'down' : 'up'}`}></i>
        </div>

        {!collapsedSections.levels && (
          <div className="filter-section-content">
            <div className="level-range">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <button
                  key={level}
                  className={`level-btn ${library.filters.levels?.includes(level) ? 'selected' : ''}`}
                  onClick={() => {
                    const currentLevels = library.filters.levels || [];
                    const updatedLevels = currentLevels.includes(level)
                      ? currentLevels.filter(l => l !== level)
                      : [...currentLevels, level];

                    handleFilterChange('levels', updatedLevels);
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Effect Types filter */}
      <div className={`filter-section ${collapsedSections.effects ? 'collapsed' : ''}`}>
        <div
          className="filter-section-header"
          onClick={() => toggleSection('effects')}
        >
          <h4>Effect Types</h4>
          <i className={`fas fa-chevron-${collapsedSections.effects ? 'down' : 'up'}`}></i>
        </div>

        {!collapsedSections.effects && (
          <div className="filter-section-content">
            {['damage', 'healing', 'buff', 'debuff', 'utility', 'control', 'summoning', 'transformation'].map(effect => (
              <label key={effect} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={library.filters.effectTypes?.includes(effect) || false}
                  onChange={(e) => {
                    const currentEffects = library.filters.effectTypes || [];
                    const updatedEffects = e.target.checked
                      ? [...currentEffects, effect]
                      : currentEffects.filter(ef => ef !== effect);

                    handleFilterChange('effectTypes', updatedEffects);
                  }}
                />
                <span className={`effect-icon ${effect}`}>
                  <i className={`fas fa-${getEffectIcon(effect)}`}></i>
                </span>
                <span className="effect-name">{effect}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Damage Types Filter */}
      <div className={`filter-section ${collapsedSections.damageTypes ? 'collapsed' : ''}`}>
        <div
          className="filter-section-header"
          onClick={() => toggleSection('damageTypes')}
        >
          <h4>Damage Types</h4>
          <i className={`fas fa-chevron-${collapsedSections.damageTypes ? 'down' : 'up'}`}></i>
        </div>

        {!collapsedSections.damageTypes && (
          <div className="filter-section-content">
            {[
              'acid',
              'bludgeoning',
              'cold',
              'fire',
              'force',
              'lightning',
              'necrotic',
              'piercing',
              'poison',
              'psychic',
              'radiant',
              'slashing',
              'thunder'
            ].map(damageType => (
              <label key={damageType} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={library.filters.damageTypes?.includes(damageType) || false}
                  onChange={(e) => {
                    const currentDamageTypes = library.filters.damageTypes || [];
                    const updatedDamageTypes = e.target.checked
                      ? [...currentDamageTypes, damageType]
                      : currentDamageTypes.filter(dt => dt !== damageType);

                    handleFilterChange('damageTypes', updatedDamageTypes);
                  }}
                />
                <span className="damage-type-name">{damageType.charAt(0).toUpperCase() + damageType.slice(1)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <h4>Sort By</h4>
        <div className="sort-buttons">
          {[
            { field: 'name', label: 'Name' },
            { field: 'level', label: 'Level' },
            { field: 'dateCreated', label: 'Date Created' },
            { field: 'lastModified', label: 'Last Modified' }
          ].map(({ field, label }) => (
            <button
              key={field}
              className={`sort-btn ${library.sortOrder.field === field ? 'active' : ''}`}
              onClick={() => handleSortChange(field)}
            >
              {label}
              {library.sortOrder.field === field && (
                <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get icon for effect type
function getEffectIcon(effectType) {
  switch(effectType.toLowerCase()) {
    case 'damage': return 'fire';
    case 'healing': return 'heart';
    case 'buff': return 'arrow-up';
    case 'debuff': return 'arrow-down';
    case 'utility': return 'magic';
    case 'control': return 'hand-paper';
    case 'summoning': return 'skull';
    case 'transformation': return 'exchange-alt';
    default: return 'star';
  }
}

export default LibraryFilters;