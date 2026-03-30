import React, { useState, useRef, useEffect, useMemo } from 'react';
import WowWindow from './WowWindow';
import { useSpellLibrary } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { getSpellRollableTable } from '../spellcrafting-wizard/core/utils/spellCardTransformer';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';

// Pathfinder styles imported via spellbook main.css
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../styles/spell-selection.css';

// Define simple icon components
const SearchIcon = () => <span style={{ fontSize: '14px' }}>Search</span>;

/**
 * SpellSelectionWindow component
 * A simplified window for selecting spells
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {Function} props.onClose - Callback when the window is closed
 * @param {Function} props.onSelectSpell - Callback when a spell is selected
 * @param {string} props.title - Title for the window
 * @param {string} props.filterType - Optional filter for spell types
 */
const SpellSelectionWindow = ({
  isOpen = true,
  onClose = () => {},
  onSelectSpell = () => {},
  title = "Select Spell",
  filterType = ""
}) => {
  // Get library state from context
  const library = useSpellLibrary();

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

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

  // Apply filters to the spells
  const filteredSpells = useMemo(() => {
    return library.spells.filter(spell => {
      // Search filter
      if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !spell.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter type from props (if provided)
      if (filterType) {
        // Special handling for "proc" filter type
        if (filterType === 'proc') {
          // For proc effects, include damage, healing, and buff spells
          return ['damage', 'healing', 'buff'].includes(spell.effectType);
        }
        // Special handling for "form" filter type
        else if (filterType === 'form' && spell.effectType === 'transformation') {
          return true;
        }
        // Default filter by exact effect type
        else if (spell.effectType !== filterType) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterType, library.spells]);

  // Handle selecting a spell
  const handleSelectSpell = (spellId) => {
    const selectedSpell = library.spells.find(s => s.id === spellId);
    if (selectedSpell) {
      onSelectSpell(selectedSpell);
      onClose();
    }
  };

  // Create a ref for the window
  const windowRef = useRef(null);

  // Effect to ensure the window is properly centered
  useEffect(() => {
    if (windowRef.current && windowRef.current.centerWindow) {
      // Use a timeout to ensure the window is fully rendered
      const timer = setTimeout(() => {
        windowRef.current.centerWindow();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <WowWindow
      ref={windowRef}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      defaultSize={{ width: 1000, height: 700 }}
      centered={true}
    >
      <div className="spellbook-layout" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--pf-gradient-parchment)',
        padding: 'var(--pf-space-3)'
      }}>
        {/* Search input */}
        <div style={{
          position: 'relative',
          marginBottom: '15px',
          width: '100%'
        }}>
          <input
            type="text"
            placeholder="Search spells..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pf-input"
            style={{
              width: '100%',
              padding: 'var(--pf-space-2) var(--pf-space-3) var(--pf-space-2) 32px',
              background: 'var(--pf-gradient-input)',
              border: 'var(--pf-border-width) solid var(--pf-brown-medium)',
              borderRadius: 'var(--pf-border-radius)',
              color: 'var(--pf-text-primary)',
              fontSize: 'var(--pf-text-sm)',
              fontFamily: 'var(--pf-font-body)'
            }}
          />
          <span style={{
            position: 'absolute',
            left: 'var(--pf-space-2)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--pf-text-muted)'
          }}>
            <SearchIcon />
          </span>
        </div>

        {/* Spell cards container */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '5px'
        }}>
          {filteredSpells.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--pf-text-muted)',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: 'var(--pf-text-lg)',
                marginBottom: 'var(--pf-space-3)',
                fontFamily: 'var(--pf-font-body)'
              }}>No spells match your search criteria.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="pf-button"
                style={{
                  background: 'var(--pf-gradient-button)',
                  border: 'var(--pf-border-width) solid var(--pf-brown-medium)',
                  borderRadius: 'var(--pf-border-radius)',
                  color: 'var(--pf-text-primary)',
                  padding: 'var(--pf-space-2) var(--pf-space-3)',
                  fontSize: 'var(--pf-text-sm)',
                  fontFamily: 'var(--pf-font-body)',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--pf-space-4)',
              padding: 'var(--pf-space-3)'
            }}>
              {filteredSpells.map(spell => {
                // Use the unified mapping function for consistency
                const transformedSpell = mapSpellToUnifiedFormat(spell);
                const rollableTableData = getSpellRollableTable(spell);

                return (
                  <div
                    key={spell.id}
                    className="spell-card-hover"
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onClick={() => handleSelectSpell(spell.id)}
                  >
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellSelectionWindow;
