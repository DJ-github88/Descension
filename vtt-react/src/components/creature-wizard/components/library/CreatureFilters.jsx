import React from 'react';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';
import '../../styles/CreatureFilters.css';

const CreatureFilters = () => {
  const library = useCreatureLibrary();
  const dispatch = useCreatureLibraryDispatch();

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

  return (
    <div className="creature-filters">
      <h2>Filters</h2>

      <div className="creature-filters-content">
        {/* Type filters */}
        <div className="filter-section">
          <h3>Creature Type</h3>
          <div className="creature-filter-options">
            {Object.values(CREATURE_TYPES).map(type => (
              <label
                key={type}
                className={`pf-checkbox-container creature-checkbox-container ${library.filters.types.includes(type) ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={library.filters.types.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                <span className="pf-checkbox-label">{formatTypeName(type)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Size filters */}
        <div className="filter-section">
          <h3>Size</h3>
          <div className="creature-filter-options">
            {Object.values(CREATURE_SIZES).map(size => (
              <label
                key={size}
                className={`pf-checkbox-container creature-checkbox-container ${library.filters.sizes.includes(size) ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={library.filters.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                <span className="pf-checkbox-label">{formatSizeName(size)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort options */}
        <div className="filter-section">
          <h3>Sort By</h3>
          <div className="sort-options">
            <button
              className={`sort-button ${library.sortOrder.field === 'name' ? 'active' : ''}`}
              onClick={() => handleSortChange('name')}
            >
              Name
              {library.sortOrder.field === 'name' && (
                <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              )}
            </button>
            <button
              className={`sort-button ${library.sortOrder.field === 'type' ? 'active' : ''}`}
              onClick={() => handleSortChange('type')}
            >
              Type
              {library.sortOrder.field === 'type' && (
                <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              )}
            </button>
            <button
              className={`sort-button ${library.sortOrder.field === 'size' ? 'active' : ''}`}
              onClick={() => handleSortChange('size')}
            >
              Size
              {library.sortOrder.field === 'size' && (
                <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              )}
            </button>
            <button
              className={`sort-button ${library.sortOrder.field === 'dateCreated' ? 'active' : ''}`}
              onClick={() => handleSortChange('dateCreated')}
            >
              Date Created
              {library.sortOrder.field === 'dateCreated' && (
                <i className={`fas fa-sort-${library.sortOrder.direction === 'asc' ? 'up' : 'down'}`}></i>
              )}
            </button>
          </div>
        </div>

        {/* Clear filters button */}
        <button
          className="clear-filters-button"
          onClick={() => dispatch(libraryActionCreators.clearFilters())}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default CreatureFilters;
