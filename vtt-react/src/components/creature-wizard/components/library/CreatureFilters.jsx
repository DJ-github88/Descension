import React, { useState, useRef, useEffect } from 'react';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';
import '../../styles/CreatureFilters.css';

const CreatureFilters = ({ filteredCount, totalCount }) => {
  const library = useCreatureLibrary();
  const dispatch = useCreatureLibraryDispatch();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  // Handle type filter change
  const handleTypeChange = (type) => {
    const currentTypes = [...library.filters.types];
    const typeIndex = currentTypes.indexOf(type);

    if (typeIndex === -1) {
      // Add type to filter
      dispatch(libraryActionCreators.filterCreatures({
        types: [...currentTypes, type]
      }));
    } else {
      // Remove type from filter
      currentTypes.splice(typeIndex, 1);
      dispatch(libraryActionCreators.filterCreatures({
        types: currentTypes
      }));
    }
  };

  // Handle size filter change
  const handleSizeChange = (size) => {
    const currentSizes = [...library.filters.sizes];
    const sizeIndex = currentSizes.indexOf(size);

    if (sizeIndex === -1) {
      // Add size to filter
      dispatch(libraryActionCreators.filterCreatures({
        sizes: [...currentSizes, size]
      }));
    } else {
      // Remove size from filter
      currentSizes.splice(sizeIndex, 1);
      dispatch(libraryActionCreators.filterCreatures({
        sizes: currentSizes
      }));
    }
  };

  // Handle sort order change
  const handleSortChange = (field) => {
    const currentSortField = library.sortOrder.field;
    const currentSortDirection = library.sortOrder.direction;

    // If clicking the same field, toggle direction
    if (field === currentSortField) {
      dispatch(libraryActionCreators.sortCreatures({
        field,
        direction: currentSortDirection === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      // If clicking a different field, set to ascending
      dispatch(libraryActionCreators.sortCreatures({
        field,
        direction: 'asc'
      }));
    }
  };

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
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

  // Close dropdowns when clicking outside
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

    if (isSortDropdownOpen || isTypeDropdownOpen || isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortDropdownOpen, isTypeDropdownOpen, isSizeDropdownOpen]);

  // Handle sort option click
  const handleSortOptionClick = (field) => {
    const isSameField = library.sortOrder.field === field;
    handleSortChange(field);
    // If clicking the same field, keep dropdown open so user can see direction toggle
    // Otherwise close it
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

  const typeOptions = Object.values(CREATURE_TYPES);
  const sizeOptions = Object.values(CREATURE_SIZES);

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
    <div className="creature-filters-header">
      <div className="filters-row">
        {/* Type filters dropdown */}
        <div className="filter-group filter-dropdown-group" ref={typeDropdownRef}>
          <div className="filter-dropdown-container">
            <button
              className={`filter-dropdown-button ${library.filters.types.length > 0 ? 'active' : ''}`}
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              title="Filter by creature type"
            >
              {getTypeButtonText()}
              <i className={`fas fa-chevron-${isTypeDropdownOpen ? 'up' : 'down'} filter-dropdown-arrow`}></i>
            </button>
            {isTypeDropdownOpen && (
              <div className="filter-dropdown-menu">
                {typeOptions.map(type => {
                  const isSelected = library.filters.types.includes(type);
                  return (
                    <button
                      key={type}
                      className={`filter-dropdown-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTypeChange(type)}
                      title={`${isSelected ? 'Remove' : 'Add'} ${formatTypeName(type)} filter`}
                    >
                      <span className="filter-checkbox">
                        {isSelected && <i className="fas fa-check"></i>}
                      </span>
                      <span>{formatTypeName(type)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Size filters dropdown */}
        <div className="filter-group filter-dropdown-group" ref={sizeDropdownRef}>
          <div className="filter-dropdown-container">
            <button
              className={`filter-dropdown-button ${library.filters.sizes.length > 0 ? 'active' : ''}`}
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
              title="Filter by creature size"
            >
              {getSizeButtonText()}
              <i className={`fas fa-chevron-${isSizeDropdownOpen ? 'up' : 'down'} filter-dropdown-arrow`}></i>
            </button>
            {isSizeDropdownOpen && (
              <div className="filter-dropdown-menu">
                {sizeOptions.map(size => {
                  const isSelected = library.filters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      className={`filter-dropdown-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSizeChange(size)}
                      title={`${isSelected ? 'Remove' : 'Add'} ${formatSizeName(size)} filter`}
                    >
                      <span className="filter-checkbox">
                        {isSelected && <i className="fas fa-check"></i>}
                      </span>
                      <span>{formatSizeName(size)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sort options dropdown */}
        <div className="filter-group sort-dropdown-group" ref={sortDropdownRef}>
          <div className="sort-dropdown-container">
            <button
              className="sort-dropdown-button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              title="Sort options"
            >
              Sort: {formatSortFieldName(library.sortOrder.field)}
              <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              <i className={`fas fa-chevron-${isSortDropdownOpen ? 'up' : 'down'} sort-dropdown-arrow`}></i>
            </button>
            {isSortDropdownOpen && (
              <div className="sort-dropdown-menu">
                {sortOptions.map(option => (
                  <button
                    key={option.field}
                    className={`sort-dropdown-item ${library.sortOrder.field === option.field ? 'active' : ''}`}
                    onClick={() => handleSortOptionClick(option.field)}
                    title={`Sort by ${option.label}`}
                  >
                    <span>{option.label}</span>
                    {library.sortOrder.field === option.field && (
                      <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Creature count info */}
        <div className="creature-count-info-header">
          Showing {filteredCount || 0} of {totalCount || 0} creatures
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            className="clear-filters-button-header"
            onClick={() => dispatch(libraryActionCreators.clearFilters())}
            title="Clear all filters"
          >
            <i className="fas fa-times"></i> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatureFilters;
