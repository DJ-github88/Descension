import React, { useState, useRef, useEffect } from 'react';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';
import '../../styles/CreatureFilters.css';

// Thematic color badges and icons matching the creature card badges
export const CREATURE_TYPE_THEMES = {
  aberration: { color: '#8a3ab9', icon: 'fas fa-eye' },
  beast: { color: '#8b4513', icon: 'fas fa-paw' },
  celestial: { color: '#bfa134', icon: 'fas fa-sun' },
  construct: { color: '#5f6f81', icon: 'fas fa-gear' },
  dragon: { color: '#b82626', icon: 'fas fa-dragon' },
  elemental: { color: '#1a8a82', icon: 'fas fa-wind' },
  fey: { color: '#8c5bb5', icon: 'fas fa-wand-magic-sparkles' },
  fiend: { color: '#9e2424', icon: 'fas fa-skull-crossbones' },
  giant: { color: '#9c5932', icon: 'fas fa-mountain' },
  humanoid: { color: '#44729b', icon: 'fas fa-user' },
  monstrosity: { color: '#4a6728', icon: 'fas fa-biohazard' },
  ooze: { color: '#5a9320', icon: 'fas fa-droplet' },
  plant: { color: '#277d27', icon: 'fas fa-leaf' },
  shopkeeper: { color: '#b08828', icon: 'fas fa-coins' },
  undead: { color: '#582b7b', icon: 'fas fa-skull' },
};

export const CREATURE_SIZE_HINTS = {
  tiny: '0.5 × 0.5',
  small: '1 × 1',
  medium: '1 × 1',
  large: '2 × 2',
  huge: '3 × 3',
  gargantuan: '4 × 4+'
};

const CreatureFilters = ({ filteredCount, totalCount }) => {
  const library = useCreatureLibrary();
  const dispatch = useCreatureLibraryDispatch();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  const typeOptions = Object.values(CREATURE_TYPES || {});
  const sizeOptions = Object.values(CREATURE_SIZES || {});

  // Handle type filter change
  const handleTypeChange = (type) => {
    const currentTypes = [...library.filters.types];
    const typeIndex = currentTypes.indexOf(type);

    if (typeIndex === -1) {
      dispatch(libraryActionCreators.filterCreatures({
        types: [...currentTypes, type]
      }));
    } else {
      currentTypes.splice(typeIndex, 1);
      dispatch(libraryActionCreators.filterCreatures({
        types: currentTypes
      }));
    }
  };

  const handleSelectAllTypes = () => {
    dispatch(libraryActionCreators.filterCreatures({
      types: [...typeOptions]
    }));
  };

  const handleClearAllTypes = () => {
    dispatch(libraryActionCreators.filterCreatures({
      types: []
    }));
  };

  // Handle size filter change
  const handleSizeChange = (size) => {
    const currentSizes = [...library.filters.sizes];
    const sizeIndex = currentSizes.indexOf(size);

    if (sizeIndex === -1) {
      dispatch(libraryActionCreators.filterCreatures({
        sizes: [...currentSizes, size]
      }));
    } else {
      currentSizes.splice(sizeIndex, 1);
      dispatch(libraryActionCreators.filterCreatures({
        sizes: currentSizes
      }));
    }
  };

  const handleSelectAllSizes = () => {
    dispatch(libraryActionCreators.filterCreatures({
      sizes: [...sizeOptions]
    }));
  };

  const handleClearAllSizes = () => {
    dispatch(libraryActionCreators.filterCreatures({
      sizes: []
    }));
  };

  // Handle sort order change
  const handleSortChange = (field) => {
    const currentSortField = library.sortOrder.field;
    const currentSortDirection = library.sortOrder.direction;

    if (field === currentSortField) {
      dispatch(libraryActionCreators.sortCreatures({
        field,
        direction: currentSortDirection === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      dispatch(libraryActionCreators.sortCreatures({
        field,
        direction: 'asc'
      }));
    }
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size ? size.charAt(0).toUpperCase() + size.slice(1) : '';
  };

  // Format sort field name for display
  const formatSortFieldName = (field) => {
    const names = {
      name: 'Name',
      type: 'Type',
      size: 'Size',
      dateCreated: 'Date'
    };
    return names[field] || field;
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setIsSizeDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSortDropdownOpen(false);
        setIsTypeDropdownOpen(false);
        setIsSizeDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen || isTypeDropdownOpen || isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortDropdownOpen, isTypeDropdownOpen, isSizeDropdownOpen]);

  // Handle sort option click
  const handleSortOptionClick = (field) => {
    const isSameField = library.sortOrder.field === field;
    handleSortChange(field);
    if (!isSameField) {
      setIsSortDropdownOpen(false);
    }
  };

  const hasActiveFilters = library.filters.types.length > 0 || library.filters.sizes.length > 0;
  
  const sortOptions = [
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'size', label: 'Size' },
    { field: 'dateCreated', label: 'Date' }
  ];

  // Get display text for filter buttons
  const getTypeButtonText = () => {
    const count = library.filters.types.length;
    if (count === 0) return 'Type: All';
    if (count === 1) return `Type: ${formatTypeName(library.filters.types[0])}`;
    return `Type: ${count}`;
  };

  const getSizeButtonText = () => {
    const count = library.filters.sizes.length;
    if (count === 0) return 'Size: All';
    if (count === 1) return `Size: ${formatSizeName(library.filters.sizes[0])}`;
    return `Size: ${count}`;
  };

  return (
    <div className="creature-filters-row">
      {/* Type filters dropdown */}
      <div className="filter-group filter-dropdown-group" ref={typeDropdownRef}>
        <div className="filter-dropdown-container">
          <button
            className={`filter-dropdown-button ${library.filters.types.length > 0 ? 'active' : ''}`}
            onClick={() => {
              setIsTypeDropdownOpen(!isTypeDropdownOpen);
              setIsSizeDropdownOpen(false);
              setIsSortDropdownOpen(false);
            }}
            title="Filter by creature type"
            aria-expanded={isTypeDropdownOpen}
          >
            <span>{getTypeButtonText()}</span>
            <i className={`fas fa-chevron-${isTypeDropdownOpen ? 'up' : 'down'} filter-dropdown-arrow`}></i>
          </button>

          {isTypeDropdownOpen && (
            <div className="filter-dropdown-menu type-dropdown-menu" role="menu">
              {/* Header with Title and Quick Actions */}
              <div className="dropdown-menu-header">
                <span className="dropdown-menu-title">
                  <i className="fas fa-paw"></i>
                  <span>Creature Types</span>
                  {library.filters.types.length > 0 && (
                    <span className="dropdown-selection-count">
                      {library.filters.types.length} selected
                    </span>
                  )}
                </span>
                <div className="dropdown-quick-actions">
                  <button
                    type="button"
                    className="dropdown-action-btn"
                    onClick={handleSelectAllTypes}
                    title="Select all creature types"
                  >
                    All
                  </button>
                  {library.filters.types.length > 0 && (
                    <button
                      type="button"
                      className="dropdown-action-btn clear-btn"
                      onClick={handleClearAllTypes}
                      title="Clear type filters"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Grid of Type Items */}
              <div className="dropdown-items-grid">
                {typeOptions.map(type => {
                  const isSelected = library.filters.types.includes(type);
                  const theme = CREATURE_TYPE_THEMES[type.toLowerCase()] || { color: '#8b4513', icon: 'fas fa-paw' };

                  return (
                    <button
                      key={type}
                      type="button"
                      className={`filter-dropdown-item type-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTypeChange(type)}
                      title={`${isSelected ? 'Remove' : 'Add'} ${formatTypeName(type)} filter`}
                      role="menuitemcheckbox"
                      aria-checked={isSelected}
                    >
                      <span className="filter-checkbox">
                        {isSelected && <i className="fas fa-check"></i>}
                      </span>
                      <span
                        className="type-color-pip"
                        style={{ backgroundColor: theme.color }}
                        aria-hidden="true"
                      >
                        <i className={theme.icon}></i>
                      </span>
                      <span className="type-label">{formatTypeName(type)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size filters dropdown */}
      <div className="filter-group filter-dropdown-group" ref={sizeDropdownRef}>
        <div className="filter-dropdown-container">
          <button
            className={`filter-dropdown-button ${library.filters.sizes.length > 0 ? 'active' : ''}`}
            onClick={() => {
              setIsSizeDropdownOpen(!isSizeDropdownOpen);
              setIsTypeDropdownOpen(false);
              setIsSortDropdownOpen(false);
            }}
            title="Filter by creature size"
            aria-expanded={isSizeDropdownOpen}
          >
            <span>{getSizeButtonText()}</span>
            <i className={`fas fa-chevron-${isSizeDropdownOpen ? 'up' : 'down'} filter-dropdown-arrow`}></i>
          </button>

          {isSizeDropdownOpen && (
            <div className="filter-dropdown-menu size-dropdown-menu" role="menu">
              {/* Header with Title and Quick Actions */}
              <div className="dropdown-menu-header">
                <span className="dropdown-menu-title">
                  <i className="fas fa-expand"></i>
                  <span>Creature Sizes</span>
                  {library.filters.sizes.length > 0 && (
                    <span className="dropdown-selection-count">
                      {library.filters.sizes.length} selected
                    </span>
                  )}
                </span>
                <div className="dropdown-quick-actions">
                  <button
                    type="button"
                    className="dropdown-action-btn"
                    onClick={handleSelectAllSizes}
                    title="Select all creature sizes"
                  >
                    All
                  </button>
                  {library.filters.sizes.length > 0 && (
                    <button
                      type="button"
                      className="dropdown-action-btn clear-btn"
                      onClick={handleClearAllSizes}
                      title="Clear size filters"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="dropdown-items-list">
                {sizeOptions.map(size => {
                  const isSelected = library.filters.sizes.includes(size);
                  const hint = CREATURE_SIZE_HINTS[size.toLowerCase()];

                  return (
                    <button
                      key={size}
                      type="button"
                      className={`filter-dropdown-item size-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSizeChange(size)}
                      title={`${isSelected ? 'Remove' : 'Add'} ${formatSizeName(size)} filter`}
                      role="menuitemcheckbox"
                      aria-checked={isSelected}
                    >
                      <span className="filter-checkbox">
                        {isSelected && <i className="fas fa-check"></i>}
                      </span>
                      <span className="size-label">{formatSizeName(size)}</span>
                      {hint && <span className="size-dim-hint">{hint}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sort options dropdown */}
      <div className="filter-group sort-dropdown-group" ref={sortDropdownRef}>
        <div className="sort-dropdown-container">
          <button
            className="sort-dropdown-button"
            onClick={() => {
              setIsSortDropdownOpen(!isSortDropdownOpen);
              setIsTypeDropdownOpen(false);
              setIsSizeDropdownOpen(false);
            }}
            title="Sort options"
            aria-expanded={isSortDropdownOpen}
          >
            <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'} sort-direction-icon`}></i>
            <span>{formatSortFieldName(library.sortOrder.field)}</span>
            <i className={`fas fa-chevron-${isSortDropdownOpen ? 'up' : 'down'} sort-dropdown-arrow`}></i>
          </button>

          {isSortDropdownOpen && (
            <div className="sort-dropdown-menu" role="menu">
              <div className="dropdown-menu-header">
                <span className="dropdown-menu-title">
                  <i className="fas fa-arrow-down-a-z"></i>
                  <span>Sort Order</span>
                </span>
              </div>
              <div className="dropdown-items-list">
                {sortOptions.map(option => {
                  const isActive = library.sortOrder.field === option.field;
                  return (
                    <button
                      key={option.field}
                      type="button"
                      className={`sort-dropdown-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSortOptionClick(option.field)}
                      title={`Sort by ${option.label} (${isActive && library.sortOrder.direction === 'asc' ? 'Descending' : 'Ascending'})`}
                      role="menuitem"
                    >
                      <span className="sort-label">{option.label}</span>
                      {isActive && (
                        <span className="sort-direction-badge">
                          <i className={`fas fa-arrow-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
                          <span>{library.sortOrder.direction === 'asc' ? 'Asc' : 'Desc'}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          className="clear-filters-button-header"
          onClick={() => dispatch(libraryActionCreators.clearFilters())}
          title="Clear all filters"
        >
          <i className="fas fa-times-circle"></i>
        </button>
      )}

      {/* Creature count info */}
      <div className="creature-count-info-badge">
        {filteredCount || 0} / {totalCount || 0}
      </div>
    </div>
  );
};

export default CreatureFilters;
