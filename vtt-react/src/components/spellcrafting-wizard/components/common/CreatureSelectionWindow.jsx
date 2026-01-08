import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useCreatureLibrary } from '../../../creature-wizard/context/CreatureLibraryContext.js';
import useCreatureStore from '../../../../store/creatureStore';
import CompactCreatureCard from '../../../creature-wizard/components/common/CompactCreatureCard';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import '../../styles/pathfinder/creature-selection.css';

// Helper function to filter creatures based on filters
const filterCreatures = (creatures, filters) => {
  return creatures.filter(creature => {
    // Filter by search query
    if (filters.query && !creature.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !creature.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))) {
      return false;
    }

    // Filter by types
    if (filters.types.length > 0 && !filters.types.includes(creature.type)) {
      return false;
    }

    // Filter by sizes
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
  effectType = "summon" // "summon" or "transform"
}) => {
  const library = useCreatureLibrary();
  const creatureStore = useCreatureStore();
  const [filters, setFilters] = useState({
    query: '',
    types: [],
    sizes: []
  });
  const [localSelectedCreatures, setLocalSelectedCreatures] = useState(selectedCreatures);
  const windowRef = useRef(null);

  // Available creature types and sizes for filtering
  const availableTypes = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
  const availableSizes = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'];

  // Track previous selectedCreatures to avoid infinite loops
  const prevSelectedCreaturesRef = useRef();

  useEffect(() => {
    // Only update if selectedCreatures has actually changed
    const prevIds = prevSelectedCreaturesRef.current?.map(c => c.id).sort().join(',') || '';
    const currentIds = selectedCreatures.map(c => c.id).sort().join(',');

    if (prevIds !== currentIds) {
      setLocalSelectedCreatures(selectedCreatures);
      prevSelectedCreaturesRef.current = selectedCreatures;
    }
  }, [selectedCreatures]);

  // Reset filters when window opens
  useEffect(() => {
    if (isOpen) {
      setFilters({
        query: '',
        types: [],
        sizes: []
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use creatures from library context, fallback to store directly if library is empty
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
      // Single select - immediately call onSelect and close
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

  const isCreatureSelected = (creature) => {
    return localSelectedCreatures.some(c => c.id === creature.id);
  };

  return ReactDOM.createPortal(
    <div className="creature-selection-overlay">
      <div className="creature-selection-window" ref={windowRef}>
        <div className="creature-selection-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="creature-selection-content">
          {/* Search and Filters */}
          <div className="creature-filters">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search creatures..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="search-input"
              />
            </div>

            <div className="filter-sections-wrapper">
              <div className="filter-section">
                <h4>Type</h4>
                <div className="filter-buttons">
                  {availableTypes.map(type => (
                    <button
                      key={type}
                      className={`filter-button ${filters.types.includes(type) ? 'active' : ''}`}
                      onClick={() => handleTypeFilter(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Size</h4>
                <div className="filter-buttons">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      className={`filter-button ${filters.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => handleSizeFilter(size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Creature Grid */}
          <div className="creature-grid">
            {filteredCreatures.map(creature => (
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
            ))}
          </div>
        </div>

        {/* Footer with selection info and buttons */}
        <div className="creature-selection-footer">
          <div className="selection-info">
            {multiSelect && (
              <span>{localSelectedCreatures.length} creature{localSelectedCreatures.length !== 1 ? 's' : ''} selected</span>
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
    </div>,
    document.body
  );
};

export default CreatureSelectionWindow;
