import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
import { filterSpells, sortSpells } from '../../core/utils/libraryManager';
import { getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import { formatAllEffects } from '../../core/utils/formatSpellEffectsForReview';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import SpellCardWithProcs from '../common/SpellCardWithProcs';

import SpellContextMenu from './SpellContextMenu';
import SpellLibraryFormatter from './SpellLibraryFormatter';

// Add compact header styling
const compactHeaderStyles = `
  .library-header.compact-header {
    padding: 8px 16px !important;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%) !important;
    border: 2px solid #654321 !important;
    border-radius: 8px !important;
    margin-bottom: 12px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
  }

  .library-title.compact-title {
    font-size: 18px !important;
    margin: 0 !important;
    color: white !important;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;
    font-family: 'Cinzel', serif !important;
  }

  .library-controls.compact-controls {
    gap: 6px !important;
  }

  .library-controls.compact-controls button {
    padding: 6px 12px !important;
    font-size: 12px !important;
    min-width: auto !important;
    height: 32px !important;
  }

  .library-controls.compact-controls .primary-button,
  .library-controls.compact-controls .secondary-button {
    border-radius: 4px !important;
    padding: 6px 10px !important;
    font-size: 12px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    min-width: 0 !important;
    max-width: 120px !important;
  }

  .view-mode-controls {
    margin-left: auto !important;
  }

  .view-mode-button {
    padding: 6px 8px !important;
    font-size: 12px !important;
    height: 32px !important;
    min-width: 32px !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = compactHeaderStyles;
  if (!document.head.querySelector('style[data-compact-header]')) {
    styleElement.setAttribute('data-compact-header', 'true');
    document.head.appendChild(styleElement);
  }
}

// Import Pathfinder-themed styles
import '../../styles/pathfinder/main.css';

const SpellLibrary = ({ onLoadSpell, hideHeader = false }) => {
  // State for view options - force compact view and clear any stored preferences
  const [viewMode, setViewMode] = useState(() => {
    // Clear any existing localStorage preference to force compact view
    localStorage.removeItem('spellLibraryViewMode');
    return 'compact';
  });



  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  const [showFormatter, setShowFormatter] = useState(false);

  // Get library state and dispatch from context
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  // Unified mapping function (same as Step10Review and ExternalLivePreview)
  const mapSpellToUnifiedFormat = (spell) => {
    // Extract icon from spell
    const extractSpellIcon = (spellData) => {
      return spellData.typeConfig?.icon || spellData.icon || 'inv_misc_questionmark';
    };

    const formatCastTime = (spellData) => {
      if (!spellData) return 'Instant';

      // Handle different casting time formats
      if (spellData.actionType === 'channeled') return 'Channeled';
      if (spellData.spellType === 'reaction') return 'Reaction';
      if (spellData.spellType === 'ritual') return 'Ritual';
      if (spellData.spellType === 'passive') return 'Passive';

      const castTime = spellData.castTime ||
                      spellData.castingTime ||
                      (spellData.castingConfig && spellData.castingConfig.castTime) ||
                      (spellData.typeConfig && spellData.typeConfig.castTime) ||
                      'Instant';

      return castTime;
    };

    const icon = extractSpellIcon(spell);

    // Determine damage types - SAME LOGIC AS STEP10REVIEW
    const damageTypes = [];

    // First check if we have a primary type selected in Step 1
    if (spell.typeConfig?.school) {
      damageTypes.push(spell.typeConfig.school);
    }

    // Check for secondary type in Step 1
    if (spell.typeConfig?.secondaryElement) {
      damageTypes.push(spell.typeConfig.secondaryElement);
    }

    // If no types are set in Step 1, check damage config
    if (damageTypes.length === 0 && spell.damageConfig?.damageType) {
      // For direct damage
      if (spell.damageConfig.damageType === 'direct' && spell.damageConfig.elementType) {
        damageTypes.push(spell.damageConfig.elementType);
      }
      // For DoT damage
      else if (spell.damageConfig.damageType === 'dot' && spell.damageConfig.elementType) {
        damageTypes.push(spell.damageConfig.elementType);
      }
      // For combined damage (direct + DoT)
      else if (spell.damageConfig.hasDotEffect && spell.damageConfig.elementType) {
        damageTypes.push(spell.damageConfig.elementType);
      }
      // Fallback if elementType is not set
      else if (spell.damageConfig.elementType) {
        damageTypes.push(spell.damageConfig.elementType);
      }
    }

    // Create a properly structured spell object for the unified card
    return {
      // Basic Information
      id: spell.id || 'unknown',
      name: spell.name || 'Unnamed Spell',
      description: spell.description || '',
      level: spell.level || 1,
      icon: icon,
      spellType: spell.spellType || 'ACTION',
      effectType: spell.effectTypes && spell.effectTypes.length > 0 ? spell.effectTypes[0] : 'utility',
      effectTypes: spell.effectTypes || [],

      // Type configuration
      typeConfig: spell.typeConfig || {},

      // Casting information
      castTime: formatCastTime(spell),
      range: spell.targetingConfig?.rangeDistance ? `${spell.targetingConfig.rangeDistance} ft` : spell.range || '30 ft',
      rangeType: spell.targetingConfig?.rangeType || 'ranged',

      // Targeting information
      targetingMode: spell.targetingConfig?.targetingType || 'single',
      targetRestriction: spell.targetingConfig?.targetRestrictions && spell.targetingConfig.targetRestrictions.length > 0 ?
                         spell.targetingConfig.targetRestrictions[0] :
                         spell.targetingConfig?.targetRestriction || null,
      targetRestrictions: spell.targetingConfig?.targetRestrictions && spell.targetingConfig.targetRestrictions.length > 0 ?
                         spell.targetingConfig.targetRestrictions :
                         spell.targetingConfig?.targetRestriction ? [spell.targetingConfig.targetRestriction] : [],
      maxTargets: spell.targetingConfig?.maxTargets || 1,
      selectionMethod: spell.targetingConfig?.selectionMethod ||
                      spell.targetingConfig?.targetSelectionMethod || 'manual',
      targetSelectionMethod: spell.targetingConfig?.targetSelectionMethod ||
                            spell.targetingConfig?.selectionMethod || 'manual',
      rangeDistance: spell.targetingConfig?.rangeDistance || 30,

      // AOE information
      aoeShape: spell.targetingConfig?.aoeShape || 'circle',
      aoeSize: spell.targetingConfig?.aoeParameters?.radius ||
               spell.targetingConfig?.aoeParameters?.size ||
               spell.targetingConfig?.aoeParameters?.length || 20,
      aoeParameters: spell.targetingConfig?.aoeParameters || {},
      movementBehavior: spell.targetingConfig?.movementBehavior || 'static',
      targetingConfig: spell.targetingConfig || {},

      // Damage/Healing information
      primaryDamage: spell.damageConfig ? {
        dice: spell.damageConfig.formula ||
              spell.damageConfig.diceNotation ||
              spell.effectResolutions?.damage?.config?.formula ||
              '6d6',
        flat: spell.damageConfig.flatBonus || 0,
        type: spell.damageConfig.elementType || spell.typeConfig?.school || 'force'
      } : null,

      // Damage types - CRITICAL: Use the same logic as Step10Review
      damageTypes: damageTypes.length > 0 ? damageTypes : (spell.damageTypes || []),

      // Damage config
      damageConfig: spell.damageConfig || {},

      // Resolution type
      resolution: spell.damageConfig?.resolution || spell.healingConfig?.resolution || spell.resolution || 'DICE',

      // School from typeConfig
      school: spell.typeConfig?.school || spell.school || 'Arcane',

      // Element type from typeConfig
      elementType: spell.typeConfig?.school || spell.damageConfig?.elementType || spell.elementType,

      // Tags
      tags: spell.tags || [],

      // Resource costs
      resourceConfig: spell.resourceConfig || null,
      resourceCost: spell.resourceCost || null,
      manaCost: spell.resourceConfig?.resourceAmount || spell.manaCost || 25,

      // Rarity
      rarity: spell.rarity || 'uncommon',

      // CRITICAL: Preserve all effect configurations for proper formatting
      buffConfig: spell.buffConfig || null,
      debuffConfig: spell.debuffConfig || null,
      controlConfig: spell.controlConfig || null,
      utilityConfig: spell.utilityConfig || null,
      summonConfig: spell.summonConfig || spell.summoningConfig || null,
      transformationConfig: spell.transformationConfig || null,
      purificationConfig: spell.purificationConfig || null,
      restorationConfig: spell.restorationConfig || null,
      healingConfig: spell.healingConfig || null,

      // Advanced mechanics
      mechanicsConfig: spell.mechanicsConfig || null,
      rollableTable: spell.rollableTable || null,
      cardConfig: spell.cardConfig || null,
      coinConfig: spell.coinConfig || null,
      channelingConfig: spell.channelingConfig || null,
      reactionConfig: spell.reactionConfig || null,
      stateConfig: spell.stateConfig || null,
      zoneConfig: spell.zoneConfig || null,
      trapConfig: spell.trapConfig || null,

      // Duration and cooldown formatting
      duration: spell.durationConfig ? formatDuration(spell.durationConfig) : 'Instant',
      cooldown: spell.cooldownConfig ? formatCooldown(spell.cooldownConfig) : getDefaultCooldown(spell),

      // Metadata
      dateCreated: spell.dateCreated,
      lastModified: spell.lastModified,
      categoryIds: spell.categoryIds || [],
      visualTheme: spell.visualTheme || 'neutral'
    };

    // Helper function to format duration
    function formatDuration(durationConfig) {
      const { durationType, durationValue } = durationConfig;
      if (durationType === 'instant') return 'Instant';
      if (durationType === 'concentration') return `Concentration, up to ${durationValue} rounds`;
      if (durationType === 'rounds') return `${durationValue} rounds`;
      if (durationType === 'minutes') return `${durationValue} minutes`;
      if (durationType === 'hours') return `${durationValue} hours`;
      if (durationType === 'permanent') return 'Permanent';
      return 'Instant';
    }

    // Helper function to format cooldown
    function formatCooldown(cooldownConfig) {
      const { cooldownType, cooldownValue } = cooldownConfig;
      if (cooldownType === 'none') return 'No Cooldown';
      if (cooldownType === 'rounds') return `${cooldownValue} rounds`;
      if (cooldownType === 'minutes') return `${cooldownValue} minutes`;
      if (cooldownType === 'encounter') return 'Once per encounter';
      if (cooldownType === 'long_rest') return 'Once per long rest';
      if (cooldownType === 'short_rest') return 'Once per short rest';
      return 'No Cooldown';
    }

    // Helper function to get default cooldown based on spell properties
    function getDefaultCooldown(spell) {
      if (spell.level >= 6) return '1 minute';
      if (spell.level >= 4) return '3 rounds';
      if (spell.spellType === 'REACTION') return 'No Cooldown';
      if (spell.effectTypes?.includes('healing')) return '2 rounds';
      return 'No Cooldown';
    }
  };

  // Apply filters and sorting to get displayed spells
  const filteredSpells = React.useMemo(() => {
    const filtered = filterSpells(library, library.filters);
    return sortSpells(filtered, library.sortOrder);
  }, [library.spells, library.filters, library.sortOrder]);

  // Save view preferences to localStorage (but keep compact as default)
  useEffect(() => {
    // Only save non-compact view modes to localStorage
    if (viewMode !== 'compact') {
      localStorage.setItem('spellLibraryViewMode', viewMode);
    } else {
      localStorage.removeItem('spellLibraryViewMode');
    }
  }, [viewMode]);

  // Handle spell selection
  const handleSelectSpell = (spellId, isEditing = false) => {
    // Just select the spell in the library
    dispatch(libraryActionCreators.selectSpell(spellId));

    // If we're in edit mode and onLoadSpell is provided, load the spell for editing
    if (isEditing && onLoadSpell) {
      const selectedSpell = library.spells.find(spell => spell.id === spellId);
      if (selectedSpell) {
        // Get the original spell data
        const originalSpell = selectedSpell;

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
    e.stopPropagation();

    // Find the spell object by ID
    const spellObj = library.spells.find(s => s.id === spellId);

    if (spellObj) {
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

      // Set the context menu state with adjusted position and spell ID
      setContextMenu({
        x: posX,
        y: posY,
        spellId
      });


    } else {
      console.error("Could not find spell with ID:", spellId);
    }
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

  const handleLoadEnhancedSpells = () => {
    // Clear existing spells
    dispatch(libraryActionCreators.clearLibrary());

    // Add all enhanced spells
    LIBRARY_SPELLS.forEach(spell => {
      dispatch(libraryActionCreators.addSpell(spell));
    });

    alert(`Successfully loaded ${LIBRARY_SPELLS.length} enhanced spells!\n\nNew spells include:\n• Ethereal Flame Manifestation\n• Crystalline Frost Convergence\n• Fate Weaver's Paradigm\n• Serendipity Cascade\n• And many more original spells!`);
  };



  // Render empty state when no spells exist
  if (library.spells.length === 0) {
    return (
      <div className="spell-library-empty" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        background: 'linear-gradient(135deg, #f0e6d2 0%, #e8dcc0 100%)',
        border: '3px solid #8B4513',
        borderRadius: '12px',
        margin: '20px',
        padding: '40px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{
          color: '#8B4513',
          fontFamily: 'Cinzel, serif',
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '16px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>Your Spell Library is Empty</h2>
        <p style={{
          color: '#654321',
          fontFamily: 'Cinzel, serif',
          fontSize: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>Create your first spell to get started!</p>
        <button
          className="primary-button"
          onClick={handleNewSpell}
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
            border: '2px solid #654321',
            borderRadius: '8px',
            color: '#F0E6D2',
            fontFamily: 'Cinzel, serif',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
        >
          Create New Spell
        </button>
      </div>
    );
  }

  return (
    <div className="library-view">
      {/* Library header - conditionally rendered */}
      {!hideHeader && (
        <div className="library-header compact-header">
          <h3 className="library-title compact-title">Spell Library ({filteredSpells.length})</h3>

          <div className="library-controls compact-controls">
            <button
              className="primary-button"
              onClick={handleNewSpell}
            >
              <i className="fas fa-plus"></i> New
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

            <button
              className="secondary-button"
              onClick={() => setShowFormatter(true)}
              title="Format and validate all spells for UnifiedSpellCard compatibility"
            >
              <i className="fas fa-magic"></i> Format
            </button>

            <button
              className="primary-button"
              onClick={handleLoadEnhancedSpells}
              title="Load the enhanced spell library with 50+ original spells"
              style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                border: '2px solid #654321',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              <i className="fas fa-magic"></i> Enhanced
            </button>



            <div className="view-mode-controls">
              <button
                className={`view-mode-button ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                aria-label="Compact view"
                title="Compact view with hover tooltips"
              >
                <i className="fas fa-th-large"></i>
              </button>

              <button
                className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                title="Full card grid view"
              >
                <i className="fas fa-th"></i>
              </button>

              <button
                className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
                title="List view"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="library-content">
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
                  // Use the unified mapping function for consistency
                  const transformedSpell = mapSpellToUnifiedFormat(spell);

                  // Get the rollable table data from the spell
                  const rollableTableData = getSpellRollableTable(spell);

                  // Library spells are already formatted, so we don't need to call formatAllEffects
                  // Just ensure the spell has the basic effect properties for display
                  if (!transformedSpell.damageEffects && transformedSpell.damageConfig) {
                    transformedSpell.damageEffects = [`${transformedSpell.damageConfig.formula || '1d6'} ${transformedSpell.damageConfig.elementType || 'force'} damage`];
                  }
                  if (!transformedSpell.healingEffects && transformedSpell.healingConfig) {
                    transformedSpell.healingEffects = [`${transformedSpell.healingConfig.formula || '1d8'} healing`];
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
                        enabled: false,
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
                        enabled: false,
                        critType: 'dice',
                        critMultiplier: 2
                      }
                    };
                  }

                  // Render compact view or full card view based on viewMode
                  if (viewMode === 'compact') {
                    return (
                      <UnifiedSpellCard
                        key={spell.id}
                        spell={transformedSpell}
                        variant="compact"
                        rollableTableData={rollableTableData}
                        onClick={(e) => {
                          handleSelectSpell(spell.id);
                        }}
                        onContextMenu={(e) => {
                          handleSpellContextMenu(e, spell.id);
                        }}
                        isSelected={library.selectedSpell === spell.id}
                        className="library-compact-item"
                        showActions={false}
                        showDescription={false}
                        showStats={false}
                        showTags={false}
                        isDraggable={true}
                      />
                    );
                  }

                  // Full card view (grid/list)
                  return (
                    <div
                      key={spell.id}
                      className={`spell-card-wrapper has-edit-button ${library.selectedSpell === spell.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        // Handle normal card click - just select the spell
                        handleSelectSpell(spell.id);
                      }}
                      onContextMenu={(e) => {
                        handleSpellContextMenu(e, spell.id);
                      }}
                      style={{
                        position: 'relative',
                        overflow: 'visible'
                      }}
                      data-spell-id={spell.id}
                      title="Click to select, right-click for options"
                    >
                      {/* Clean edit button */}
                      <div className="edit-button-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleSelectSpell(spell.id, true);
                          }}
                          title="Edit Spell"
                          aria-label="Edit Spell"
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                      </div>

                      {/* Spell card */}
                      <div className="review-spell-preview">
                        <SpellCardWithProcs
                          spell={transformedSpell}
                          variant="wizard"
                          rollableTableData={rollableTableData}
                          showActions={false}
                          showDescription={true}
                          showStats={true}
                          showTags={true}
                          procPosition="right"
                          showProcs={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>



      {/* Context Menu */}
      {contextMenu && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999998, pointerEvents: 'none' }}>
          {ReactDOM.createPortal(
            <SpellContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              spell={library.spells.find(s => s.id === contextMenu.spellId)}
              onClose={() => {
                setContextMenu(null);
              }}
              collections={library.categories}
              inCollection={false}
              onEdit={(spellId) => {
                // Find the spell object by ID
                const spellToEdit = library.spells.find(s => s.id === spellId);

                if (spellToEdit) {
                  // Call handleSelectSpell with the spell ID and true for edit mode
                  // This will handle all the navigation and loading logic
                  handleSelectSpell(spellId, true);
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
      )}

      {/* Spell Library Formatter */}
      {showFormatter && (
        <SpellLibraryFormatter onClose={() => setShowFormatter(false)} />
      )}
    </div>
  );
};

export default SpellLibrary;