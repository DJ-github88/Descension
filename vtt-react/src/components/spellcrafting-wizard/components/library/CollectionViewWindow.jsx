import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SpellContextMenu from './SpellContextMenu';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import { formatAllEffects } from '../../core/utils/formatSpellEffectsForReview';
// Pathfinder styles imported via main.css
import '../../styles/CollectionMaps.css';

/**
 * CollectionViewWindow - Window to display spells in a collection
 */
const CollectionViewWindow = ({
  isOpen,
  onClose,
  collectionId
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [viewMode, setViewMode] = useState('compact'); // 'compact' or 'grid'
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

    const icon = spell.typeConfig?.icon || extractSpellIcon(spell) || 'inv_misc_questionmark';

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

      // Propagation configuration
      propagation: spell.propagation || {
        method: 'none',
        behavior: '',
        parameters: {}
      },

      // Rarity
      rarity: spell.rarity || 'uncommon'
    };
  };

  // Get the collection
  const collection = library.categories.find(cat => cat.id === collectionId);

  // Get spells in the collection and remove duplicates
  const collectionSpells = React.useMemo(() => {
    const spellsInCollection = library.spells.filter(spell => {
      // Check if the spell belongs to this collection
      if (spell.categoryIds && spell.categoryIds.includes(collectionId)) {
        return true;
      }
      return false;
    });

    // Remove duplicates by spell ID and name (in case there are spells with same name but different IDs)
    const uniqueSpells = [];
    const seenIds = new Set();
    const seenNames = new Set();

    spellsInCollection.forEach(spell => {
      const spellKey = `${spell.id}-${spell.name}`;
      if (!seenIds.has(spell.id) && !seenNames.has(spell.name.toLowerCase())) {
        seenIds.add(spell.id);
        seenNames.add(spell.name.toLowerCase());
        uniqueSpells.push(spell);
      }
    });

    console.log(`Collection ${collectionId}: Found ${spellsInCollection.length} spells, filtered to ${uniqueSpells.length} unique spells`);
    return uniqueSpells;
  }, [library.spells, collectionId]);

  // Handle clicking outside to close
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

  // Handle selecting a spell - in collections, just select the spell, don't edit it
  const handleSelectSpell = (spellId) => {
    // Just select the spell, don't open the editor
    dispatch(libraryActionCreators.selectSpell(spellId));
  };

  // Handle duplicating a spell
  const handleDuplicateSpell = (spellId) => {
    dispatch(libraryActionCreators.duplicateSpell(spellId));
  };

  // Handle removing a spell from the collection
  const handleRemoveFromCollection = (spellId) => {
    const spell = library.spells.find(s => s.id === spellId);
    if (spell && spell.categoryIds) {
      const updatedCategories = spell.categoryIds.filter(id => id !== collectionId);
      dispatch(libraryActionCreators.categorizeSpell(spellId, updatedCategories));
    }
  };

  // Handle editing a spell by transferring its data to the wizard
  const handleEditSpell = (spellId) => {
    dispatch(libraryActionCreators.selectSpell(spellId));
    // Navigate to the spell wizard with the spell ID
    window.location.href = `/spell-wizard?editMode=true&spellId=${spellId}`;
    onClose();
  };

  // Handle adding spell to another collection
  const handleAddToCollection = (spellId, targetCollectionId) => {
    const spell = library.spells.find(s => s.id === spellId);
    if (spell) {
      const currentCategories = spell.categoryIds || [];
      // Check if the spell is already in the target collection
      if (!currentCategories.includes(targetCollectionId)) {
        // Add to the target collection without duplicates
        dispatch(libraryActionCreators.categorizeSpell(spellId, [...currentCategories, targetCollectionId]));
      }
    }
  };

  // Function to clean up duplicate spells in this collection
  const cleanupDuplicateSpells = () => {
    console.log('Starting duplicate cleanup for collection:', collectionId);

    // Get all spells in this collection
    const spellsInCollection = library.spells.filter(spell =>
      spell.categoryIds && spell.categoryIds.includes(collectionId)
    );

    console.log('Found spells in collection before cleanup:', spellsInCollection.length);

    // Create a map to track spells by name (case-insensitive)
    const spellsByName = new Map();
    const duplicateSpellsToRemove = [];

    spellsInCollection.forEach(spell => {
      const normalizedName = spell.name.toLowerCase().trim();

      if (spellsByName.has(normalizedName)) {
        // This is a duplicate - mark for removal
        duplicateSpellsToRemove.push(spell.id);
        console.log('Found duplicate spell:', spell.name, 'ID:', spell.id);
      } else {
        // First occurrence of this spell name
        spellsByName.set(normalizedName, spell);
      }
    });

    // Remove duplicate spells from this collection
    duplicateSpellsToRemove.forEach(spellId => {
      const spell = library.spells.find(s => s.id === spellId);
      if (spell && spell.categoryIds) {
        // Remove this collection from the spell's categories
        const updatedCategories = spell.categoryIds.filter(id => id !== collectionId);
        console.log('Removing duplicate spell from collection:', spell.name);
        dispatch(libraryActionCreators.categorizeSpell(spellId, updatedCategories));
      }
    });

    // Also clean up any duplicate category IDs within remaining spells
    spellsInCollection.forEach(spell => {
      if (spell.categoryIds && !duplicateSpellsToRemove.includes(spell.id)) {
        // Get unique category IDs
        const uniqueCategoryIds = [...new Set(spell.categoryIds)];

        // If there were duplicates, update the spell
        if (uniqueCategoryIds.length !== spell.categoryIds.length) {
          console.log('Cleaning up duplicate category IDs for spell:', spell.name);
          dispatch(libraryActionCreators.categorizeSpell(spell.id, uniqueCategoryIds));
        }
      }
    });

    console.log('Duplicate cleanup completed. Removed', duplicateSpellsToRemove.length, 'duplicate spells');
  };

  // Clean up duplicates when the component mounts
  useEffect(() => {
    // Run cleanup with a slight delay to ensure all data is loaded
    const timer = setTimeout(() => {
      cleanupDuplicateSpells();
    }, 100);

    return () => clearTimeout(timer);
  }, [collectionId]);

  // If collection doesn't exist, don't render
  if (!collection) {
    return null;
  }

  // Use ReactDOM.createPortal to render the window directly to the document body
  // This ensures it's not constrained by any parent containers
  return ReactDOM.createPortal(
    <div
      className="pf-collection-view-window"
      style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10001
      }}
    >
        <div className="pf-collection-view-header">
          <div className="pf-collection-view-title">
            <div className="collection-icon-wrapper">
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${collection.icon || 'inv_misc_questionmark'}.jpg`}
                alt={collection.name}
                className="collection-icon"
              />
            </div>
            <h2 className="pf-collection-view-name">{collection.name}</h2>
          </div>

          {/* View mode toggle buttons */}
          <div className="collection-view-controls">
            <div className="view-mode-toggle">
              <button
                className={`pf-button pf-button-small ${viewMode === 'compact' ? 'pf-button-primary' : 'pf-button-secondary'}`}
                onClick={() => setViewMode('compact')}
                title="Compact view with hover tooltips"
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={`pf-button pf-button-small ${viewMode === 'grid' ? 'pf-button-primary' : 'pf-button-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view with full spell cards"
              >
                <i className="fas fa-th-large"></i>
              </button>
            </div>
            <button
              onClick={onClose}
              className="pf-button pf-button-close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="pf-collection-view-content">
          {collectionSpells.length === 0 ? (
            <div className="pf-collection-empty">
              <i className="fas fa-book-open"></i>
              <p>No spells in this collection.</p>
              <p className="pf-collection-empty-hint">Right-click on spells in the library to add them to this collection.</p>
            </div>
          ) : (
            <div className={`spell-library-spells ${viewMode}-view`}>
              <div className="spell-cards-container">
              {collectionSpells.map((spell, index) => {
                // Use the unified mapping function for consistency
                const transformedSpell = mapSpellToUnifiedFormat(spell);

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
                  transformedSpell.controlEffects = formattedEffects.controlEffects;
                  transformedSpell.procEffects = formattedEffects.procEffects;
                  transformedSpell.criticalEffects = formattedEffects.criticalEffects;
                  transformedSpell.channelingEffects = formattedEffects.channelingEffects;
                }

                // Ensure resource costs are properly formatted
                if (!transformedSpell.resourceCost) {
                  transformedSpell.resourceCost = {
                    mana: 0,
                    health: 0,
                    stamina: 0,
                    focus: 0,
                    resourceValues: {}
                  };
                }

                // Ensure damage/healing configuration is properly formatted ONLY for damage spells
                if (transformedSpell.effectTypes?.includes('damage') &&
                    !transformedSpell.damageConfig &&
                    transformedSpell.primaryDamage?.dice) {
                  transformedSpell.damageConfig = {
                    damageType: 'direct',
                    elementType: transformedSpell.damageTypes?.[0] || 'fire',
                    formula: transformedSpell.primaryDamage.dice
                  };
                }

                if (transformedSpell.effectTypes?.includes('healing') &&
                    !transformedSpell.healingConfig &&
                    transformedSpell.healing?.dice) {
                  transformedSpell.healingConfig = {
                    healingType: 'direct',
                    formula: transformedSpell.healing?.dice || '6d6'
                  };
                }

                // Ensure cooldown configuration is properly formatted
                if (!transformedSpell.cooldownConfig) {
                  transformedSpell.cooldownConfig = {
                    enabled: false,
                    cooldownRounds: 0,
                    cooldownType: 'rounds'
                  };
                }

                // Ensure coin mechanics are properly preserved
                if (spell.resolution === 'COINS' || spell.name?.toLowerCase().includes('fortune') || spell.name?.toLowerCase().includes('coin')) {
                  transformedSpell.resolution = 'COINS';
                  transformedSpell.coinConfig = spell.coinConfig || {
                    flipCount: 5,
                    formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)'
                  };

                  // If it's Fortune Frost, ensure it has the right configuration
                  if (spell.name?.toLowerCase().includes('fortune frost')) {
                    transformedSpell.coinConfig = {
                      flipCount: 5,
                      formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)'
                    };
                    transformedSpell.resourceCost = { mana: '1d10' };
                  }
                }

                // Only apply specific resource cost overrides for special spells
                // Don't randomize resource costs - use the actual spell data
                if (spell.name?.toLowerCase().includes('fortune frost')) {
                  // Fortune Frost uses 1d10 mana
                  transformedSpell.resourceCost = { mana: '1d10' };
                }

                // Render compact view or full card view based on viewMode
                if (viewMode === 'compact') {
                  return (
                    <UnifiedSpellCard
                      key={spell.id}
                      spell={transformedSpell}
                      variant="compact"
                      rollableTableData={rollableTableData}
                      onClick={() => handleSelectSpell(spell.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          x: e.clientX,
                          y: e.clientY,
                          spellId: spell.id
                        });
                      }}
                      isSelected={library.selectedSpell === spell.id}
                      className="collection-compact-item"
                      showActions={false}
                      showDescription={false}
                      showStats={false}
                      showTags={false}
                      isDraggable={true}
                    />
                  );
                }

                // Full card view (grid)
                return (
                  <div
                    key={spell.id}
                    className="spell-card-wrapper"
                    style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectSpell(spell.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        spellId: spell.id
                      });
                    }}
                    draggable={true}
                    onDragStart={(e) => {
                      const spellData = {
                        id: spell.id,
                        name: spell.name,
                        icon: spell.icon || 'spell_holy_holybolt',
                        cooldown: spell.cooldown || 0,
                        level: spell.level || 1,
                        spellType: spell.spellType || 'ACTION'
                      };
                      e.dataTransfer.setData('application/json', JSON.stringify(spellData));
                      e.dataTransfer.effectAllowed = 'copy';
                      console.log('Dragging spell from collection grid view:', spellData);
                    }}
                    title="Drag to action bar to add spell"
                  >
                    {/* Action buttons - positioned in top-right corner for better visibility */}
                    <div className="pf-collection-spell-actions">
                      <button
                        className="pf-button pf-button-small pf-button-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSpell(spell.id);
                        }}
                        title="Duplicate spell"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        className="pf-button pf-button-small pf-button-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCollection(spell.id);
                        }}
                        title="Remove from collection"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    <div className="review-spell-preview">
                      <UnifiedSpellCard
                        spell={transformedSpell}
                        variant="wizard"
                        rollableTableData={rollableTableData}
                        showActions={false}
                        showDescription={true}
                        showStats={true}
                        showTags={true}
                      />
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Context Menu */}
          {contextMenu && ReactDOM.createPortal(
            <SpellContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              spell={library.spells.find(s => s.id === contextMenu.spellId)}
              onClose={() => setContextMenu(null)}
              collections={library.categories}
              inCollection={true}
              onEdit={handleEditSpell}
              onDuplicate={handleDuplicateSpell}
              onDelete={handleRemoveFromCollection}
              onAddToCollection={handleAddToCollection}
            />,
            document.body
          )}
        </div>
      </div>,
    document.body
  );
};

CollectionViewWindow.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired
};

export default CollectionViewWindow;
