import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { filterSpells, sortSpells } from '../../core/utils/libraryManager';
import { transformSpellForCard, getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import { formatAllEffects } from '../../core/utils/formatSpellEffectsForReview';
import LibraryStyleSpellCard from '../common/LibraryStyleSpellCard';
import LibraryFilters from './LibraryFilters';
import SpellContextMenu from './SpellContextMenu';
// Import CSS files for consistent styling
import '../../styles/ConsolidatedSpellCard.css';
import '../../styles/Step10Review.css';
import '../../styles/LibraryStyleRollableTable.css';
import '../../styles/buff-config-review.css';
import '../../styles/trigger-display-review.css';

const SpellLibrary = ({ onLoadSpell }) => {
  // State for view options
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('spellLibraryViewMode') || 'grid';
  });

  const [isFiltersVisible, setIsFiltersVisible] = useState(() => {
    const savedState = localStorage.getItem('spellLibraryFiltersVisible');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);

  // Get library state and dispatch from context
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  // Apply filters and sorting to get displayed spells
  const filteredSpells = React.useMemo(() => {
    const filtered = filterSpells(library, library.filters);
    return sortSpells(filtered, library.sortOrder);
  }, [library.spells, library.filters, library.sortOrder]);

  // Save view preferences to localStorage
  useEffect(() => {
    localStorage.setItem('spellLibraryViewMode', viewMode);
    localStorage.setItem('spellLibraryFiltersVisible', JSON.stringify(isFiltersVisible));
  }, [viewMode, isFiltersVisible]);

  // Handle spell selection
  const handleSelectSpell = (spellId, isEditing = false) => {
    dispatch(libraryActionCreators.selectSpell(spellId));

    // If onLoadSpell is provided and we're in edit mode, load the spell for editing
    if (onLoadSpell && isEditing) {
      const selectedSpell = library.spells.find(spell => spell.id === spellId);
      if (selectedSpell) {
        console.log('Loading spell for editing:', selectedSpell.name);

        // Get the original spell data
        const originalSpell = selectedSpell;

        // Log the spell data for debugging
        console.log('Original spell data:', JSON.stringify(originalSpell, null, 2));

        // Call onLoadSpell with the original spell and true for edit mode
        onLoadSpell(originalSpell, true);

        // Dispatch a custom event to notify the SpellWizard component
        const loadSpellEvent = new CustomEvent('loadSpellIntoWizard', {
          detail: { spell: originalSpell, editMode: true }
        });
        window.dispatchEvent(loadSpellEvent);

        // Try to switch to the wizard tab
        try {
          // Try to access the spellbook store to switch tabs
          const spellbookStore = window.require ? window.require('../../store/spellbookStore').default : null;
          if (spellbookStore) {
            spellbookStore.getState().setActiveTab('wizard');
          } else {
            // Fallback: try to find the wizard tab button and click it
            const wizardTabButton = document.querySelector('button[aria-label="Spell Wizard"]') ||
                                   document.querySelector('button:contains("Spell Wizard")') ||
                                   Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Spell Wizard'));

            if (wizardTabButton) {
              wizardTabButton.click();
            }
          }
        } catch (error) {
          console.error("Error switching to wizard tab:", error);
        }
      }
    }
  };

  // Handle spell deletion with confirmation
  const handleDeleteSpell = (spellId, spellName) => {
    if (window.confirm(`Are you sure you want to delete "${spellName}"?`)) {
      dispatch(libraryActionCreators.deleteSpell(spellId));
    }
  };

  // Handle spell duplication
  const handleDuplicateSpell = (spellId) => {
    dispatch(libraryActionCreators.duplicateSpell(spellId));
  };

  // Handle right-click on spell card
  const handleSpellContextMenu = (e, spellId) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      spellId
    });
  };

  // Handle adding spell to collection
  const handleAddToCollection = (spellId, collectionId) => {
    dispatch(libraryActionCreators.addSpellToCollection(spellId, collectionId));
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu && !e.target.closest('.spell-context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  // Add event listener for the pseudo-element edit button
  useEffect(() => {
    const handlePseudoElementClick = (e) => {
      // Check if the click is on the top-right corner of a spell card wrapper
      if (e.target.classList.contains('spell-card-wrapper')) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // If the click is in the top-right corner (where the ::after pseudo-element is)
        if (x >= rect.width - 60 && y <= 40) {
          e.stopPropagation();
          const spellId = e.target.getAttribute('data-spell-id');
          if (spellId) {
            console.log('Edit button (pseudo-element) clicked for spell:', spellId);

            // Find the spell object by ID
            const spellToEdit = library.spells.find(s => s.id === spellId);

            if (spellToEdit) {
              // Call handleSelectSpell with the spell ID and true for edit mode
              handleSelectSpell(spellId, true);
            } else {
              console.error("Could not find spell with ID:", spellId);
            }
          }
        }
      }
    };

    document.addEventListener('click', handlePseudoElementClick, true);

    return () => {
      document.removeEventListener('click', handlePseudoElementClick, true);
    };
  }, [library.spells, onLoadSpell]);

  // Handle new spell creation
  const handleNewSpell = () => {
    // This would typically navigate to the spell wizard or creation form
    console.log('Creating new spell');
    // Implementation depends on your app's routing
  };

  // Handle library import/export
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            dispatch(libraryActionCreators.importLibrary(data.data));
          } catch (error) {
            console.error('Error importing library:', error);
            alert('Failed to import library. The file may be invalid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        spells: library.spells,
        categories: library.categories
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spell-library-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate active filter count
  const activeFilterCount = Object.values(library.filters).reduce((count, filter) => {
    if (Array.isArray(filter) && filter.length > 0) return count + 1;
    if (typeof filter === 'string' && filter.trim() !== '') return count + 1;
    return count;
  }, 0);

  // Render empty state when no spells exist
  if (library.spells.length === 0) {
    return (
      <div className="spell-library-empty">
        <div className="spell-library-empty-icon">
          <i className="fas fa-book"></i>
        </div>
        <h2>Your Spell Library is Empty</h2>
        <p>Create your first spell to get started!</p>
        <button
          className="primary-button"
          onClick={handleNewSpell}
        >
          <i className="fas fa-plus"></i> Create New Spell
        </button>
      </div>
    );
  }

  return (
    <div className="spell-library-container">
      {/* Library toolbar */}
      <div className="spell-library-toolbar">
        <div className="spell-library-actions">
          <button
            className="primary-button"
            onClick={handleNewSpell}
          >
            <i className="fas fa-plus"></i> New Spell
          </button>

          <button
            className="secondary-button"
            onClick={handleImport}
          >
            <i className="fas fa-file-import"></i> Import
          </button>

          <button
            className="secondary-button"
            onClick={handleExport}
          >
            <i className="fas fa-file-export"></i> Export
          </button>
        </div>

        <div className="spell-library-view-options">
          <button
            className="filter-toggle-button"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            aria-label={isFiltersVisible ? "Hide filters" : "Show filters"}
          >
            <i className="fas fa-filter"></i>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          <button
            className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <i className="fas fa-list"></i>
          </button>

          <button
            className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <i className="fas fa-th"></i>
          </button>
        </div>
      </div>

      {/* Filters and content area */}
      <div className="spell-library-content">
        {/* Sidebar with filters */}
        {isFiltersVisible && (
          <aside className="spell-library-sidebar">
            <LibraryFilters />
          </aside>
        )}

        {/* Main content area with spell cards */}
        <main className={`spell-library-spells ${viewMode}-view`}>
          {filteredSpells.length === 0 ? (
            <div className="spell-library-no-results">
              <p>No spells match your current filters.</p>
              <button
                className="secondary-button"
                onClick={() => dispatch(libraryActionCreators.clearFilters())}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="spell-count-info">
                Showing {filteredSpells.length} of {library.spells.length} spells
              </div>

              <div className="spell-cards-container">
                {filteredSpells.map(spell => {
                  // Transform the spell data to match the format expected by LibraryStyleSpellCard
                  // This is the same transformation used in the review step
                  const transformedSpell = transformSpellForCard(spell);

                  // Get the rollable table data from the spell
                  const rollableTableData = getSpellRollableTable(spell);

                  // Format the effects for display
                  const formattedEffects = formatAllEffects(transformedSpell);

                  // Add the formatted effects to the transformed spell
                  if (formattedEffects) {
                    transformedSpell.damageEffects = formattedEffects.damageEffects;
                    transformedSpell.healingEffects = formattedEffects.healingEffects;
                    transformedSpell.buffEffects = formattedEffects.buffEffects;
                    transformedSpell.debuffEffects = formattedEffects.debuffEffects;
                  }

                  // Ensure range is in the header
                  if (spell.range && !transformedSpell.range) {
                    transformedSpell.range = `${spell.range} ft`;
                  } else if (spell.targetingConfig?.range && !transformedSpell.range) {
                    transformedSpell.range = `${spell.targetingConfig.range} ft`;
                  }

                  // Ensure spell type is properly formatted
                  transformedSpell.spellType = transformedSpell.spellType || spell.spellType || 'ACTION';

                  // Ensure cast time is properly formatted
                  transformedSpell.castTime = transformedSpell.castTime || spell.castTime || 'Instant';

                  // Ensure targeting configuration is properly formatted
                  if (!transformedSpell.targetingConfig) {
                    transformedSpell.targetingConfig = spell.targetingConfig || {
                      targetType: spell.targetingMode || 'single',
                      range: spell.range || 30,
                      areaType: spell.areaType || 'sphere',
                      areaSize: spell.areaSize || 10
                    };
                  }

                  // Ensure resource configuration is properly formatted
                  if (!transformedSpell.resourceCost) {
                    transformedSpell.resourceCost = spell.resourceCost || {
                      mana: spell.manaCost || 20,
                      rage: 0,
                      energy: 0,
                      focus: 0,
                      runic: 0
                    };
                  }

                  // Ensure cooldown configuration is properly formatted
                  if (!transformedSpell.cooldownConfig) {
                    transformedSpell.cooldownConfig = spell.cooldownConfig || {
                      enabled: true,
                      cooldownRounds: spell.cooldown || 0,
                      cooldownType: 'rounds',
                      charges: spell.charges || 1
                    };
                  }

                  // Ensure damage configuration is properly formatted
                  if (!transformedSpell.damageConfig && (transformedSpell.effectType === 'damage' || transformedSpell.damageTypes?.length > 0)) {
                    transformedSpell.damageConfig = spell.damageConfig || {
                      damageType: 'direct',
                      elementType: (spell.damageTypes && spell.damageTypes[0]) || 'fire',
                      formula: spell.primaryDamage?.dice || '1d6',
                      criticalConfig: {
                        enabled: true,
                        critType: 'dice',
                        critMultiplier: 2,
                        explodingDice: false
                      }
                    };
                  }

                  // Ensure healing configuration is properly formatted
                  if (!transformedSpell.healingConfig && transformedSpell.effectType === 'healing') {
                    transformedSpell.healingConfig = spell.healingConfig || {
                      healingType: 'direct',
                      formula: spell.healing?.dice || '1d6',
                      criticalConfig: {
                        enabled: true,
                        critType: 'dice',
                        critMultiplier: 2
                      }
                    };
                  }

                  console.log('Rendering spell card for:', transformedSpell.name);

                  return (
                    <div
                      key={spell.id}
                      className={`spell-card-wrapper has-edit-button ${library.selectedSpell === spell.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        // Check if the click is in the top-right corner (where the edit button is)
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        if (x >= rect.width - 60 && y <= 40) {
                          // If clicked on the edit button area, just edit the spell
                          e.stopPropagation();

                          // Find the spell object by ID
                          const spellToEdit = library.spells.find(s => s.id === spell.id);

                          if (spellToEdit) {
                            // Call handleSelectSpell with the spell ID and true for edit mode
                            handleSelectSpell(spell.id, true);

                            console.log("Edit area clicked for spell:", spell.id);
                          }
                        } else {
                          // Otherwise, handle normal card click - just select the spell
                          handleSelectSpell(spell.id);
                        }
                      }}
                      onContextMenu={(e) => handleSpellContextMenu(e, spell.id)}
                      style={{ position: 'relative', overflow: 'visible' }} /* Ensure relative positioning and visible overflow for edit button */
                      data-spell-id={spell.id} /* Add data attribute for the edit button to access */
                    >
                      {/* Edit button positioned BEFORE the card to ensure it's not covered */}
                      <div
                        className="edit-button-container"
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          zIndex: 9999999,
                          pointerEvents: 'all'
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card click
                            e.preventDefault();

                            // Find the spell object by ID
                            const spellToEdit = library.spells.find(s => s.id === spell.id);

                            if (spellToEdit) {
                              console.log("Edit button clicked for spell:", spell.id);

                              // Directly navigate to the wizard tab
                              try {
                                // Try to find the wizard tab button and click it
                                const wizardTabButton = document.querySelector('button[aria-label="Spell Wizard"]') ||
                                                       document.querySelector('button:contains("Spell Wizard")') ||
                                                       Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Spell Wizard'));

                                if (wizardTabButton) {
                                  wizardTabButton.click();
                                }

                                // Wait a short time for the tab to switch, then load the spell
                                setTimeout(() => {
                                  if (onLoadSpell) {
                                    // Log the spell data before passing it
                                    console.log('Passing spell data to onLoadSpell:', spellToEdit);

                                    // Try to directly access the SpellwizardApp component's handleLoadSpell function
                                    if (window.handleLoadSpell) {
                                      console.log('Using global handleLoadSpell function');
                                      window.handleLoadSpell(spellToEdit, true);
                                    } else {
                                      console.log('Using onLoadSpell prop');
                                      onLoadSpell(spellToEdit, true);
                                    }

                                    // Also try to directly set the name and description in the SpellWizardContext
                                    try {
                                      // Dispatch a custom event to set the name and description
                                      const setNameEvent = new CustomEvent('setSpellName', {
                                        detail: { name: spellToEdit.name }
                                      });
                                      window.dispatchEvent(setNameEvent);

                                      const setDescriptionEvent = new CustomEvent('setSpellDescription', {
                                        detail: { description: spellToEdit.description }
                                      });
                                      window.dispatchEvent(setDescriptionEvent);

                                      // Try the direct update method as well
                                      const directUpdateNameEvent = new CustomEvent('directUpdateSpellWizard', {
                                        detail: { field: 'name', value: spellToEdit.name }
                                      });
                                      window.dispatchEvent(directUpdateNameEvent);

                                      const directUpdateDescriptionEvent = new CustomEvent('directUpdateSpellWizard', {
                                        detail: { field: 'description', value: spellToEdit.description }
                                      });
                                      window.dispatchEvent(directUpdateDescriptionEvent);
                                    } catch (error) {
                                      console.error('Error trying to set name and description:', error);
                                    }
                                  }
                                }, 100);
                              } catch (error) {
                                console.error("Error switching to wizard tab:", error);
                              }
                            } else {
                              console.error("Could not find spell with ID:", spell.id);
                            }
                          }}
                          title="Edit Spell"
                          aria-label="Edit Spell"
                          style={{
                            backgroundColor: '#f8b700',
                            color: '#000000',
                            border: '1px solid #ffffff',
                            borderRadius: '0 0 0 4px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 1,
                            pointerEvents: 'all'
                          }}
                        >
                          <i className="fas fa-edit" style={{ marginRight: '4px' }}></i>
                          Edit
                        </button>
                      </div>

                      <div
                        className="review-spell-preview"
                        style={{ pointerEvents: 'none' }} /* Make the card non-interactive to allow clicks to pass through to the edit button */
                      >
                        <LibraryStyleSpellCard
                          spell={transformedSpell}
                          rollableTableData={rollableTableData}
                        />
                      </div>

                      {/* Standalone edit button overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 9999,
                          pointerEvents: 'none', /* Allow clicks to pass through to the card */
                          transform: 'scale(0.9)', /* Make the button container smaller */
                          transformOrigin: 'center center' /* Scale from the center */
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card click
                            e.preventDefault();

                            // Find the spell object by ID
                            const spellToEdit = library.spells.find(s => s.id === spell.id);

                            if (spellToEdit) {
                              console.log("Center edit button clicked for spell:", spell.id);

                              // Directly navigate to the wizard tab
                              try {
                                // Try to find the wizard tab button and click it
                                const wizardTabButton = document.querySelector('button[aria-label="Spell Wizard"]') ||
                                                       document.querySelector('button:contains("Spell Wizard")') ||
                                                       Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Spell Wizard'));

                                if (wizardTabButton) {
                                  wizardTabButton.click();
                                }

                                // Wait a short time for the tab to switch, then load the spell
                                setTimeout(() => {
                                  if (onLoadSpell) {
                                    // Log the spell data before passing it
                                    console.log('Passing spell data to onLoadSpell:', spellToEdit);

                                    // Try to directly access the SpellwizardApp component's handleLoadSpell function
                                    if (window.handleLoadSpell) {
                                      console.log('Using global handleLoadSpell function');
                                      window.handleLoadSpell(spellToEdit, true);
                                    } else {
                                      console.log('Using onLoadSpell prop');
                                      onLoadSpell(spellToEdit, true);
                                    }

                                    // Also try to directly set the name and description in the SpellWizardContext
                                    try {
                                      // Dispatch a custom event to set the name and description
                                      const setNameEvent = new CustomEvent('setSpellName', {
                                        detail: { name: spellToEdit.name }
                                      });
                                      window.dispatchEvent(setNameEvent);

                                      const setDescriptionEvent = new CustomEvent('setSpellDescription', {
                                        detail: { description: spellToEdit.description }
                                      });
                                      window.dispatchEvent(setDescriptionEvent);

                                      // Try the direct update method as well
                                      const directUpdateNameEvent = new CustomEvent('directUpdateSpellWizard', {
                                        detail: { field: 'name', value: spellToEdit.name }
                                      });
                                      window.dispatchEvent(directUpdateNameEvent);

                                      const directUpdateDescriptionEvent = new CustomEvent('directUpdateSpellWizard', {
                                        detail: { field: 'description', value: spellToEdit.description }
                                      });
                                      window.dispatchEvent(directUpdateDescriptionEvent);
                                    } catch (error) {
                                      console.error('Error trying to set name and description:', error);
                                    }
                                  }
                                }, 100);
                              } catch (error) {
                                console.error("Error switching to wizard tab:", error);
                              }
                            } else {
                              console.error("Could not find spell with ID:", spell.id);
                            }
                          }}
                          title="Edit Spell"
                          aria-label="Edit Spell"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'auto' /* Make this button clickable */
                          }}
                          className="center-edit-button"
                        >
                          <i className="fas fa-edit" style={{ marginRight: '4px' }}></i>
                          Edit Spell
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile filter toggle button */}
      <button
        className="mobile-filter-toggle"
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        aria-label={isFiltersVisible ? "Hide filters" : "Show filters"}
      >
        <i className="fas fa-filter"></i>
        {activeFilterCount > 0 && (
          <span className="filter-badge">{activeFilterCount}</span>
        )}
      </button>

      {/* Context Menu */}
      {contextMenu && ReactDOM.createPortal(
        <SpellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          spell={library.spells.find(s => s.id === contextMenu.spellId)}
          onClose={() => setContextMenu(null)}
          collections={library.categories}
          inCollection={false}
          onEdit={(spellId) => {
            // Find the spell object by ID
            const spellToEdit = library.spells.find(s => s.id === spellId);

            if (spellToEdit) {
              console.log("Context menu edit button clicked for spell:", spellId);

              // Directly navigate to the wizard tab
              try {
                // Try to find the wizard tab button and click it
                const wizardTabButton = document.querySelector('button[aria-label="Spell Wizard"]') ||
                                       document.querySelector('button:contains("Spell Wizard")') ||
                                       Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Spell Wizard'));

                if (wizardTabButton) {
                  wizardTabButton.click();
                }

                // Wait a short time for the tab to switch, then load the spell
                setTimeout(() => {
                  if (onLoadSpell) {
                    // Log the spell data before passing it
                    console.log('Passing spell data to onLoadSpell:', spellToEdit);

                    // Try to directly access the SpellwizardApp component's handleLoadSpell function
                    if (window.handleLoadSpell) {
                      console.log('Using global handleLoadSpell function');
                      window.handleLoadSpell(spellToEdit, true);
                    } else {
                      console.log('Using onLoadSpell prop');
                      onLoadSpell(spellToEdit, true);
                    }

                    // Also try to directly set the name and description in the SpellWizardContext
                    try {
                      // Dispatch a custom event to set the name and description
                      const setNameEvent = new CustomEvent('setSpellName', {
                        detail: { name: spellToEdit.name }
                      });
                      window.dispatchEvent(setNameEvent);

                      const setDescriptionEvent = new CustomEvent('setSpellDescription', {
                        detail: { description: spellToEdit.description }
                      });
                      window.dispatchEvent(setDescriptionEvent);

                      // Try the direct update method as well
                      const directUpdateNameEvent = new CustomEvent('directUpdateSpellWizard', {
                        detail: { field: 'name', value: spellToEdit.name }
                      });
                      window.dispatchEvent(directUpdateNameEvent);

                      const directUpdateDescriptionEvent = new CustomEvent('directUpdateSpellWizard', {
                        detail: { field: 'description', value: spellToEdit.description }
                      });
                      window.dispatchEvent(directUpdateDescriptionEvent);
                    } catch (error) {
                      console.error('Error trying to set name and description:', error);
                    }
                  }
                }, 100);
              } catch (error) {
                console.error("Error switching to wizard tab:", error);
              }
            } else {
              console.error("Could not find spell with ID:", spellId);
            }
          }}
          onDuplicate={handleDuplicateSpell}
          onDelete={(spellId) => handleDeleteSpell(spellId, library.spells.find(s => s.id === spellId)?.name)}
          onAddToCollection={handleAddToCollection}
        />,
        document.body
      )}
    </div>
  );
};

export default SpellLibrary;