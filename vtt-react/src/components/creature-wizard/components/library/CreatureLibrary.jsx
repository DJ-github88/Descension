import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { v4 as generateUniqueId } from 'uuid';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import useCreatureStore from '../../../../store/creatureStore';
import CreatureContextMenu from './CreatureContextMenu';
import CreatureFilters from './CreatureFilters';
import LibraryStyleCreatureCard from '../common/LibraryStyleCreatureCard';
import SimpleCreatureTooltip from '../common/SimpleCreatureTooltip';
import CompactCreatureCard from '../common/CompactCreatureCard';
import EnhancedCreatureInspectView from '../common/EnhancedCreatureInspectView';
import '../../styles/CreatureLibrary.css';

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

    // Filter by level range (if we implement levels)
    // For now, we'll just return true

    return true;
  });
};

// Helper function to sort creatures
const sortCreatures = (creatures, sortOrder) => {
  return [...creatures].sort((a, b) => {
    let valueA, valueB;

    // Extract the values to compare based on the sort field
    switch (sortOrder.field) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'type':
        valueA = a.type.toLowerCase();
        valueB = b.type.toLowerCase();
        break;
      case 'size':
        valueA = a.size.toLowerCase();
        valueB = b.size.toLowerCase();
        break;
      case 'dateCreated':
        valueA = new Date(a.dateCreated);
        valueB = new Date(b.dateCreated);
        break;
      case 'lastModified':
        valueA = new Date(a.lastModified);
        valueB = new Date(b.lastModified);
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }

    // Compare the values based on the sort direction
    if (sortOrder.direction === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });
};

const CreatureLibrary = ({ onEdit }) => {
  const library = useCreatureLibrary();
  const dispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();

  const [contextMenu, setContextMenu] = useState(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const libraryRef = useRef(null);
  const [inspectingCreature, setInspectingCreature] = useState(null);

  // Debug: Log the library state - only on mount
  useEffect(() => {
    console.log('CreatureLibrary mounted');
    // Avoid excessive logging that could cause performance issues
  }, []);

  // Filter and sort creatures - memoize to prevent recalculation on every render
  const filteredCreatures = React.useMemo(() => {
    return sortCreatures(
      filterCreatures(library.creatures, library.filters),
      library.sortOrder
    );
  }, [library.creatures, library.filters, library.sortOrder]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when tooltip is visible
  useEffect(() => {
    const handleWheel = (e) => {
      if (hoveredCreature) {
        e.preventDefault();
        e.stopPropagation();

        // Find the scrollable tooltip content and scroll it directly
        const scrollableContent = document.querySelector('.creature-card-hover-preview-portal .creature-tooltip-scrollable');
        if (scrollableContent) {
          scrollableContent.scrollTop += e.deltaY;
        }
      }
    };

    if (libraryRef.current) {
      libraryRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (libraryRef.current) {
        libraryRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [hoveredCreature]);

  // Handle creature selection
  const handleSelectCreature = (creatureId, editMode = false) => {
    dispatch(libraryActionCreators.selectCreature(creatureId));

    if (editMode && onEdit) {
      onEdit(creatureId);
    }
  };

  // Handle creature deletion
  const handleDeleteCreature = (creatureId, creatureName) => {
    if (window.confirm(`Are you sure you want to delete "${creatureName}"?`)) {
      // First update the store
      creatureStore.deleteCreature(creatureId);

      // Then update the library
      dispatch(libraryActionCreators.deleteCreature(creatureId));
    }
  };

  // Handle creature duplication
  const handleDuplicateCreature = (creatureId) => {
    const creatureToDuplicate = library.creatures.find(c => c.id === creatureId);

    if (creatureToDuplicate) {
      // Generate a new ID here to avoid race conditions
      const newId = generateUniqueId();

      const duplicatedCreature = {
        ...creatureToDuplicate,
        id: newId,
        name: `${creatureToDuplicate.name} (Copy)`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // First add to the store
      creatureStore.addCreature(duplicatedCreature);

      // Then update the library
      dispatch(libraryActionCreators.addCreature(duplicatedCreature));
    }
  };

  // Handle adding creature to a category
  const handleAddToCategory = (creatureId, categoryId) => {
    dispatch(libraryActionCreators.addToCategory(creatureId, categoryId));
  };

  // Handle mouse enter for tooltip
  const handleMouseEnter = (creature, event) => {
    setHoveredCreature(creature);
    updateTooltipPosition(event);
  };

  // Handle mouse move for tooltip
  const handleMouseMove = (event) => {
    if (hoveredCreature) {
      updateTooltipPosition(event);
    }
  };

  // Handle mouse leave for tooltip
  const handleMouseLeave = () => {
    setHoveredCreature(null);
  };

  // Update tooltip position
  const updateTooltipPosition = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Tooltip dimensions (approximate, accounting for scale(0.85))
    const tooltipWidth = 240 * 0.85; // 204px
    const tooltipHeight = 450 * 0.85; // 382px (estimated full content height)

    // Default offset from cursor
    const offsetX = 15;
    const offsetY = -10;
    const margin = 10; // Minimum margin from screen edges

    // Calculate initial position
    let x = mouseX + offsetX;
    let y = mouseY + offsetY;

    // Adjust horizontal position if tooltip would go off screen
    if (x + tooltipWidth > viewportWidth - margin) {
      // Position to the left of cursor
      x = mouseX - tooltipWidth - offsetX;

      // If still off screen on the left, clamp to margin
      if (x < margin) {
        x = margin;
      }
    }

    // Adjust vertical position if tooltip would go off screen
    if (y + tooltipHeight > viewportHeight - margin) {
      // Position above cursor
      y = mouseY - tooltipHeight - Math.abs(offsetY);

      // If still off screen at the top, clamp to margin
      if (y < margin) {
        y = margin;
      }
    }

    // Final safety check - ensure tooltip is always within viewport
    x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
    y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

    setTooltipPosition({ x, y });
  };

  // Handle context menu
  const handleContextMenu = (e, creatureId) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent other handlers

    // Calculate position to ensure context menu stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Use pageX and pageY for absolute positioning
    const x = e.pageX;
    const y = e.pageY;

    // Default menu dimensions
    const menuWidth = 200;
    const menuHeight = 150;

    // Calculate position to ensure menu stays within viewport
    let posX = x;
    let posY = y;

    // Adjust if menu would go off right edge
    if (posX + menuWidth > viewportWidth) {
      posX = Math.max(0, x - menuWidth);
    }

    // Adjust if menu would go off bottom edge
    if (posY + menuHeight > viewportHeight) {
      posY = Math.max(0, y - menuHeight);
    }

    setContextMenu({
      x: posX,
      y: posY,
      creatureId
    });
  };

  return (
    <div
      ref={libraryRef}
      className="creature-library"
    >
      {/* Header with controls */}
      <div className="creature-library-header">
        <div className="creature-library-title">
          <h1>Creature Library</h1>
          <div className="creature-library-controls">
            <button
              className="toggle-filters-button"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              title={isFiltersVisible ? "Hide Filters" : "Show Filters"}
            >
              <i className={`fas fa-filter ${isFiltersVisible ? 'active' : ''}`}></i>
            </button>

            <div className="view-mode-controls">
              <button
                className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="creature-library-search">
          <input
            type="text"
            placeholder="Search creatures..."
            value={library.filters.query || ''}
            onChange={(e) => dispatch(libraryActionCreators.filterCreatures({ query: e.target.value }))}
          />
          <button
            className="clear-search-button"
            onClick={() => dispatch(libraryActionCreators.filterCreatures({ query: '' }))}
            title="Clear Search"
            style={{ visibility: library.filters.query ? 'visible' : 'hidden' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Filters and content area */}
      <div className="creature-library-content">
        {/* Sidebar with filters */}
        {isFiltersVisible && (
          <aside className="creature-library-sidebar">
            <CreatureFilters />
          </aside>
        )}

        {/* Main content area with creature cards */}
        <main className={`creature-library-creatures ${viewMode}-view`}>
          {filteredCreatures.length === 0 ? (
            <div className="creature-library-no-results">
              <p>No creatures match your current filters.</p>
              <button
                className="secondary-button"
                onClick={() => dispatch(libraryActionCreators.clearFilters())}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="creature-count-info">
                Showing {filteredCreatures.length} of {library.creatures.length} creatures
              </div>

              <div className="creature-cards-container">
                {filteredCreatures.map(creature => {
                  // Create a memoized handler for each creature to prevent recreating functions on every render
                  const handleDragStart = (e) => {
                    // Set the creature ID directly
                    e.dataTransfer.setData('creature/id', creature.id);

                    // Also set JSON data as text/plain for compatibility
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                      type: 'creature',
                      id: creature.id
                    }));

                    e.dataTransfer.effectAllowed = 'copy';

                    // Create a drag image
                    const dragImage = document.createElement('div');
                    dragImage.className = 'creature-drag-image';
                    dragImage.style.backgroundImage = `url(https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg)`;
                    dragImage.style.width = '40px';
                    dragImage.style.height = '40px';
                    dragImage.style.borderRadius = '50%';
                    dragImage.style.border = `2px solid ${creature.tokenBorder}`;
                    dragImage.style.backgroundSize = 'cover';
                    dragImage.style.position = 'absolute';
                    dragImage.style.top = '-1000px';
                    document.body.appendChild(dragImage);

                    e.dataTransfer.setDragImage(dragImage, 20, 20);

                    // Remove the drag image after a short delay
                    setTimeout(() => {
                      document.body.removeChild(dragImage);
                    }, 100);

                    // Log the drag start for debugging
                    console.log('🚀 Drag started for creature:', creature.name, 'with ID:', creature.id, 'type:', typeof creature.id);
                    console.log('📦 DataTransfer set with creature/id:', creature.id);
                    console.log('📦 DataTransfer set with JSON:', JSON.stringify({ type: 'creature', id: creature.id }));
                  };

                  return (
                    <div
                      key={creature.id}
                      className={`creature-card-wrapper ${library.selectedCreature === creature.id ? 'selected' : ''}`}
                      onClick={() => handleSelectCreature(creature.id)}
                      onContextMenu={(e) => handleContextMenu(e, creature.id)}
                      onMouseEnter={(e) => handleMouseEnter(creature, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      draggable
                      onDragStart={handleDragStart}
                    >
                      <CompactCreatureCard creature={creature} />
                      <div className="drag-handle-overlay">
                        <i className="fas fa-grip-lines"></i>
                        <span>Drag to Grid</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Context menu */}
      {contextMenu && ReactDOM.createPortal(
        <div style={{ position: 'fixed', zIndex: 99999999 }}>
          <CreatureContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            creatureId={contextMenu.creatureId}
            onClose={() => setContextMenu(null)}
            categories={library.categories}
            onInspect={(creatureId) => {
              const creatureToInspect = library.creatures.find(c => c.id === creatureId);
              if (creatureToInspect) {
                setInspectingCreature(creatureToInspect);
              }
            }}
            onEdit={(creatureId) => {
              // Find the creature object by ID
              const creatureToEdit = library.creatures.find(c => c.id === creatureId);

              if (creatureToEdit) {
                console.log("Context menu edit button clicked for creature:", creatureId);

                // Call handleSelectCreature with the creature ID and true for edit mode
                handleSelectCreature(creatureId, true);
              } else {
                console.error("Could not find creature with ID:", creatureId);
              }
            }}
            onDuplicate={handleDuplicateCreature}
            onDelete={(creatureId) => handleDeleteCreature(creatureId, library.creatures.find(c => c.id === creatureId)?.name)}
            onAddToCategory={handleAddToCategory}
          />
        </div>,
        document.body
      )}

      {/* Enhanced Creature Inspect View */}
      <EnhancedCreatureInspectView
        creature={inspectingCreature}
        isOpen={!!inspectingCreature}
        onClose={() => setInspectingCreature(null)}
      />

      {/* Tooltip rendered at document level using createPortal */}
      {hoveredCreature && ReactDOM.createPortal(
        <div
          className="creature-card-hover-preview-portal"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 999999999
          }}
          onWheel={(e) => {
            // Stop propagation to prevent background scrolling when scrolling tooltip
            e.stopPropagation();
          }}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            setHoveredCreature(hoveredCreature);
          }}
          onMouseLeave={() => {
            // Hide tooltip when leaving it
            setHoveredCreature(null);
          }}
        >
          <SimpleCreatureTooltip creature={hoveredCreature} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default CreatureLibrary;
