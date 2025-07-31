import React from 'react';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';
import '../../styles/CreatureFilters.css';

const CreatureFilters = () => {
  const library = useCreatureLibrary();
  const dispatch = useCreatureLibraryDispatch();
  
  // Handle type filter change
  const handleTypeFilterChange = (type) => {
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
  const handleSizeFilterChange = (size) => {
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
  
  // Handle level range change
  const handleLevelRangeChange = (min, max) => {
    dispatch(libraryActionCreators.filterCreatures({
      minLevel: min,
      maxLevel: max
    }));
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(libraryActionCreators.clearFilters());
  };
  
  // Helper function to get display name for type
  const getTypeDisplayName = (type) => {
    const typeKey = Object.keys(CREATURE_TYPES).find(key => CREATURE_TYPES[key] === type);
    if (typeKey) {
      return typeKey.charAt(0) + typeKey.slice(1).toLowerCase();
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Helper function to get display name for size
  const getSizeDisplayName = (size) => {
    const sizeKey = Object.keys(CREATURE_SIZES).find(key => CREATURE_SIZES[key] === size);
    if (sizeKey) {
      return sizeKey.charAt(0) + sizeKey.slice(1).toLowerCase();
    }
    return size.charAt(0).toUpperCase() + size.slice(1);
  };
  
  return (
    <div className="creature-filters">
      <div className="filter-section">
        <h3 className="filter-title">Filters</h3>
        <button 
          className="clear-filters-button"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>
      
      <div className="filter-section">
        <h4 className="filter-subtitle">Type</h4>
        <div className="filter-options">
          {Object.values(CREATURE_TYPES).map(type => (
            <label key={type} className="filter-option">
              <input
                type="checkbox"
                checked={library.filters.types.includes(type)}
                onChange={() => handleTypeFilterChange(type)}
              />
              <span className="filter-option-label">{getTypeDisplayName(type)}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4 className="filter-subtitle">Size</h4>
        <div className="filter-options">
          {Object.values(CREATURE_SIZES).map(size => (
            <label key={size} className="filter-option">
              <input
                type="checkbox"
                checked={library.filters.sizes.includes(size)}
                onChange={() => handleSizeFilterChange(size)}
              />
              <span className="filter-option-label">{getSizeDisplayName(size)}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4 className="filter-subtitle">Challenge Rating</h4>
        <div className="filter-range">
          <div className="range-inputs">
            <input
              type="range"
              min="0"
              max="20"
              value={library.filters.minLevel}
              onChange={(e) => handleLevelRangeChange(parseInt(e.target.value), library.filters.maxLevel)}
              className="range-slider min-range"
            />
            <input
              type="range"
              min="0"
              max="20"
              value={library.filters.maxLevel}
              onChange={(e) => handleLevelRangeChange(library.filters.minLevel, parseInt(e.target.value))}
              className="range-slider max-range"
            />
          </div>
          <div className="range-values">
            <span>{library.filters.minLevel}</span>
            <span>to</span>
            <span>{library.filters.maxLevel}</span>
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <h4 className="filter-subtitle">Sort By</h4>
        <select
          className="sort-select"
          value={`${library.sortOrder.field}-${library.sortOrder.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-');
            dispatch(libraryActionCreators.setSortOrder(field, direction));
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="type-asc">Type (A-Z)</option>
          <option value="type-desc">Type (Z-A)</option>
          <option value="size-asc">Size (Small to Large)</option>
          <option value="size-desc">Size (Large to Small)</option>
          <option value="dateCreated-desc">Newest First</option>
          <option value="dateCreated-asc">Oldest First</option>
          <option value="lastModified-desc">Recently Modified</option>
        </select>
      </div>
    </div>
  );
};

export default CreatureFilters;
