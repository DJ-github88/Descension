import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { useClassSpellLibrary } from '../../../../hooks/useClassSpellLibrary';
import { useWeaponEnhancedSpells } from '../../../../hooks/useWeaponEnhancedSpells';
import useCharacterStore from '../../../../store/characterStore';
import useAuthStore from '../../../../store/authStore';
import { loadUserSpells } from '../../../../services/firebase/userSpellService';

import { filterSpells, sortSpells } from '../../core/utils/libraryManager';
import { getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import { formatAllEffects } from '../../core/utils/formatSpellEffectsForReview';
import { GENERAL_CATEGORIES } from '../../../../data/generalSpellsData';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import SpellCardWithProcs from '../common/SpellCardWithProcs';
import '../../styles/pathfinder/main.css';
import '../../styles/pathfinder/components/wow-spellbook.css';

import SpellContextMenu from './SpellContextMenu';
import ConfirmationDialog from '../../../item-generation/ConfirmationDialog';
import ShareToCommunityDialog from './ShareToCommunityDialog';
import useSpellbookStore from '../../../../store/spellbookStore';
import { useCommunitySpells } from '../../../../hooks/useCommunitySpells';

// Simple virtualization hook for large lists
const useVirtualScroll = (items, itemHeight = 200, containerHeight = 600) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    const start = Math.floor(newScrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 2, // +2 for buffer
      items.length
    );

    setVisibleRange({ start: Math.max(0, start - 1), end }); // -1 for buffer
  }, [items.length, itemHeight, containerHeight]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      virtualIndex: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const offsetY = visibleRange.start * itemHeight;

  return {
    totalHeight,
    visibleItems,
    offsetY,
    onScroll: handleScroll
  };
};


// Helper function to get spell icon URL
const getSpellIconUrl = (spell) => {
  // Extract icon from various possible locations
  const iconName = spell?.typeConfig?.icon ||
                   spell?.icon ||
                   spell?.damageConfig?.icon ||
                   spell?.healingConfig?.icon ||
                   'inv_misc_questionmark';

  return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
};


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

const SpellLibrary = ({ onLoadSpell, hideHeader = false }) => {
  // Always use compact view - no other view modes
  const viewMode = 'compact';

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);

  // State for active category
  const [activeCategory, setActiveCategory] = useState(null);

  // State for pagination (for compact view)
  const [currentPage, setCurrentPage] = useState(1);
  const spellsPerPage = 12; // 6 per column, 2 columns (WoW-style page)

  // State for spell tooltip (hover preview)
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipTimer, setTooltipTimer] = useState(null);

  // State for preview panel position
  const [previewPanelPosition, setPreviewPanelPosition] = useState({ x: 0, y: 0 });
  const libraryContentRef = React.useRef(null);

  // Get library state and dispatch from context
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  // Get auth state
  const { user } = useAuthStore();

  // State for tracking if user spells have been loaded
  const [userSpellsLoaded, setUserSpellsLoaded] = useState(false);

  // Get class-based spell library
  const {
    spellCategories,
    characterClass,
    activeCharacter,
    isLoading: classSpellsLoading,
    error: classSpellsError,
    getAllSpells,
    getSpellsByCategory,
    getCategoryInfo,
    addCustomSpell,
    removeCustomSpell,
    hasActiveCharacter,
    hasClassSpells
  } = useClassSpellLibrary();
  // Reset active category when class changes to avoid stale category filters
  useEffect(() => {
    setActiveCategory(null);
    setCurrentPage(1);
  }, [characterClass]);

  // Get general spells with weapon integration
  const {
    enhancedSpells: generalSpells,
    hasWeaponsEquipped,
    weaponSummary
  } = useWeaponEnhancedSpells();

  // Combine spell categories with general categories
  const allSpellCategories = useMemo(() => {
    const combined = [...spellCategories];

    // Add general categories with spell counts
    GENERAL_CATEGORIES.forEach(generalCategory => {
      const categorySpells = generalSpells.filter(spell =>
        spell.categoryIds && spell.categoryIds.includes(generalCategory.id)
      );

      combined.push({
        ...generalCategory,
        spells: categorySpells,
        isGeneral: true
      });
    });

    return combined;
  }, [spellCategories, generalSpells]);

  // Track deleted spell IDs to prevent reloading them from Firebase
  const getDeletedSpellIds = () => {
    try {
      const deletedIds = localStorage.getItem('mythrill-deleted-spells');
      return deletedIds ? JSON.parse(deletedIds) : [];
    } catch (error) {
      console.error('Error reading deleted spell IDs:', error);
      return [];
    }
  };

  const markSpellAsDeleted = (spellId) => {
    try {
      const deletedIds = getDeletedSpellIds();
      if (!deletedIds.includes(spellId)) {
        deletedIds.push(spellId);
        localStorage.setItem('mythrill-deleted-spells', JSON.stringify(deletedIds));
      }
    } catch (error) {
      console.error('🗑️ [SpellLibrary] Error marking spell as deleted:', error);
    }
  };

  // Load user spells from Firebase when user logs in
  useEffect(() => {
    const loadUserSpellsFromFirebase = async () => {
      if (user?.uid && !userSpellsLoaded) {
        try {
          const userSpells = await loadUserSpells(user.uid);
          const deletedSpellIds = getDeletedSpellIds();

          if (userSpells && userSpells.length > 0) {
            // Filter out deleted spells and spells that already exist
            const spellsToAdd = userSpells.filter(spell => {
              // Don't add if it's been deleted
              if (deletedSpellIds.includes(spell.id)) {
                return false;
              }
              // Don't add if it already exists in the library
              const existingSpell = library.spells.find(s => s.id === spell.id);
              if (existingSpell) {
                return false;
              }
              return true;
            });

            // Add each spell to the library
            spellsToAdd.forEach(spell => {
              console.log('📥 [SpellLibrary] Adding spell from Firebase:', spell.id, spell.name);
              dispatch({ type: 'ADD_SPELL_DIRECT', payload: spell });
            });

            console.log(`📥 [SpellLibrary] Loaded ${spellsToAdd.length} spells from Firebase (${userSpells.length - spellsToAdd.length} filtered out)`);
          }

          setUserSpellsLoaded(true);
        } catch (error) {
          console.error('Error loading user spells from Firebase:', error);
          setUserSpellsLoaded(true); // Mark as loaded even on error to prevent infinite retries
        }
      } else if (!user?.uid && userSpellsLoaded) {
        // User logged out, reset the flag
        setUserSpellsLoaded(false);
      }
    };

    loadUserSpellsFromFirebase();
  }, [user?.uid, userSpellsLoaded, dispatch]);

  // Debug: Log spell library state changes (disabled)
  useEffect(() => {
    // Debug logging disabled
  }, [hasActiveCharacter, hasClassSpells, characterClass, activeCharacter, spellCategories.length, classSpellsLoading, classSpellsError, user?.uid, userSpellsLoaded, library.spells.length, generalSpells.length, allSpellCategories.length]);

  // Calculate preview panel position when a spell is selected
  useEffect(() => {
    if (library.selectedSpell && libraryContentRef.current) {
      const updatePosition = () => {
        const libraryRect = libraryContentRef.current.getBoundingClientRect();
        const previewWidth = 500; // Width of the preview panel
        const previewHeight = Math.min(800, window.innerHeight - 100); // Max height with padding

        // Position to the right of the library window
        let x = libraryRect.right + 10;
        let y = libraryRect.top;

        // If preview would go off right edge, position to the left instead
        if (x + previewWidth > window.innerWidth) {
          x = libraryRect.left - previewWidth - 10;
        }

        // Ensure preview doesn't go off bottom
        if (y + previewHeight > window.innerHeight) {
          y = Math.max(10, window.innerHeight - previewHeight - 10);
        }

        // Ensure preview doesn't go off top
        if (y < 10) {
          y = 10;
        }

        setPreviewPanelPosition({ x, y });
      };

      updatePosition();

      // Update position on window resize
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [library.selectedSpell]);

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

    // Derive effectTypes from available configs/effects (do not default to 'utility')
    const derivedEffectTypes = Array.isArray(spell.effectTypes) ? [...spell.effectTypes] : [];
    if (!derivedEffectTypes.includes('damage') && (spell.damageConfig || spell.effects?.damage)) derivedEffectTypes.push('damage');
    if (!derivedEffectTypes.includes('healing') && (spell.healingConfig || spell.effects?.healing)) derivedEffectTypes.push('healing');
    if (!derivedEffectTypes.includes('buff') && (spell.buffConfig || spell.effects?.buff)) derivedEffectTypes.push('buff');
    if (!derivedEffectTypes.includes('debuff') && (spell.debuffConfig || spell.effects?.debuff)) derivedEffectTypes.push('debuff');
    if (!derivedEffectTypes.includes('control') && (spell.controlConfig || spell.effects?.control)) derivedEffectTypes.push('control');
    if (!derivedEffectTypes.includes('utility') && (spell.utilityConfig || spell.effects?.utility)) derivedEffectTypes.push('utility');
    if (!derivedEffectTypes.includes('summoning') && (spell.summonConfig || spell.summoningConfig || spell.effects?.summoning)) derivedEffectTypes.push('summoning');
    if (!derivedEffectTypes.includes('transformation') && (spell.transformationConfig || spell.effects?.transformation)) derivedEffectTypes.push('transformation');
    if (!derivedEffectTypes.includes('purification') && (spell.purificationConfig)) derivedEffectTypes.push('purification');
    if (!derivedEffectTypes.includes('restoration') && (spell.restorationConfig)) derivedEffectTypes.push('restoration');

    // Create a properly structured spell object for the unified card
    return {
      // Basic Information
      id: spell.id || 'unknown',
      name: spell.name || 'Unnamed Spell',
      description: spell.description || '',
      level: spell.level || 1,
      icon: icon,
      spellType: spell.spellType || 'ACTION',
      effectType: derivedEffectTypes.length > 0 ? derivedEffectTypes[0] : undefined,
      effectTypes: derivedEffectTypes,

      // Type configuration
      typeConfig: spell.typeConfig || {},

      // Casting information
      castTime: formatCastTime(spell),
      // Format range based on rangeType first, then fall back to rangeDistance
      range: (() => {
        const rangeType = spell.targetingConfig?.rangeType;
        const rangeDistance = spell.targetingConfig?.rangeDistance;
        if (rangeType === 'touch') return 'Touch';
        if (rangeType === 'sight') return 'Sight';
        if (rangeType === 'unlimited') return 'Unlimited';
        if (rangeType === 'self_centered' || spell.targetingConfig?.targetingType === 'self') return 'Self';
        if (rangeType === 'ranged' && rangeDistance) return `${rangeDistance} ft`;
        if (rangeDistance) return `${rangeDistance} ft`;
        return spell.range || '30 ft';
      })(),
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
      targetingMode: spell.targetingMode || 'unified',
      effectTargeting: spell.effectTargeting || {},

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
      
      // CRITICAL: Preserve original effects object for legacy format support
      // UnifiedSpellCard checks effects.buff, effects.healing, etc. for legacy formats
      effects: spell.effects || null,

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

      // CRITICAL: Preserve trigger configuration
      triggerConfig: spell.triggerConfig || null,
      conditionalEffects: spell.conditionalEffects || null,
      procConfig: spell.procConfig || null,
      durationConfig: spell.durationConfig || null,
      cooldownConfig: spell.cooldownConfig || null,

      // Duration and cooldown formatting
      duration: spell.durationConfig ? formatDuration(spell.durationConfig) : 'Instant',
      cooldown: spell.cooldownConfig ? formatCooldown(spell.cooldownConfig) : getDefaultCooldown(spell),

      // Metadata
      dateCreated: spell.dateCreated,
      lastModified: spell.lastModified,
      categoryIds: spell.categoryIds || [],
      visualTheme: spell.visualTheme || 'neutral',

      // Class-specific mechanics - Pyrofiend Inferno Veil
      infernoRequired: spell.infernoRequired,
      infernoAscend: spell.infernoAscend,
      infernoDescend: spell.infernoDescend,

      // Class-specific mechanics - Arcanoneer Spheres
      arcaneSphere: spell.arcaneSphere,
      holySphere: spell.holySphere,
      shadowSphere: spell.shadowSphere,
      fireSphere: spell.fireSphere,
      iceSphere: spell.iceSphere,
      natureSphere: spell.natureSphere,
      healingSphere: spell.healingSphere,
      chaosSphere: spell.chaosSphere,

      // Preserve special mechanics for other classes
      specialMechanics: spell.specialMechanics || null
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
  const filteredSpells = useMemo(() => {
    // Debug logging to track spell filtering
    console.log('🔍 [filteredSpells] Starting filteredSpells calculation:', {
      librarySpellsCount: library.spells.length,
      librarySpellIds: library.spells.map(s => s.id),
      librarySpellNames: library.spells.map(s => s.name),
      hasActiveCharacter,
      hasClassSpells,
      activeCategory
    });

    // Use class-based spells if available, otherwise fall back to library spells
    let spellsToFilter = [];

    // ALWAYS include library.spells first (custom spells from wizard should always appear)
    spellsToFilter = [...library.spells];

    console.log('🔍 [filteredSpells] After including library.spells:', {
      spellsToFilterCount: spellsToFilter.length,
      spellIds: spellsToFilter.map(s => s.id)
    });

    if (hasActiveCharacter && hasClassSpells) {
      // If we have an active category, show only spells from that category
      if (activeCategory) {
        // Check if this is a general category
        const isGeneralCategory = GENERAL_CATEGORIES.some(cat => cat.id === activeCategory);

        if (isGeneralCategory) {
          // Filter general spells by category
          const categoryGeneralSpells = generalSpells.filter(spell =>
            spell.categoryIds && spell.categoryIds.includes(activeCategory)
          );
          spellsToFilter = [...spellsToFilter, ...categoryGeneralSpells];
        } else {
          // Use class-based category (but still include library spells)
          const categoryClassSpells = getSpellsByCategory(activeCategory);
          spellsToFilter = [...spellsToFilter, ...categoryClassSpells];
        }
        // library.spells is already included at the top
      } else {
        // Show all spells from all categories (class + general + library spells for custom spells)
        const classSpells = getAllSpells();
        // Include class spells and general spells
        spellsToFilter = [...spellsToFilter, ...classSpells, ...generalSpells];
      }
    } else {
      // Fall back to traditional library spells + general spells
      spellsToFilter = [...spellsToFilter, ...generalSpells];
    }

    // Deduplicate spells by ID (same spell might be in both class spells and library.spells)
    // Keep the first occurrence, which ensures library.spells take priority
    const uniqueSpellsMap = new Map();
    spellsToFilter.forEach(spell => {
      if (!uniqueSpellsMap.has(spell.id)) {
        uniqueSpellsMap.set(spell.id, spell);
      }
    });
    const uniqueSpellsToFilter = Array.from(uniqueSpellsMap.values());

    console.log('🔍 [filteredSpells] After deduplication:', {
      uniqueSpellsCount: uniqueSpellsToFilter.length,
      spellIds: uniqueSpellsToFilter.map(s => s.id)
    });

    // Create a temporary library object for filtering
    const tempLibrary = {
      ...library,
      spells: uniqueSpellsToFilter
    };

    const filtered = filterSpells(tempLibrary, library.filters);
    const sorted = sortSpells(filtered, library.sortOrder);

    console.log('🔍 [filteredSpells] Final result:', {
      filteredCount: filtered.length,
      sortedCount: sorted.length,
      spellIds: sorted.map(s => s.id),
      filterQuery: library.filters?.query,
      filterCategories: library.filters?.categories
    });

    return sorted;
  }, [
    library.spells,
    library.filters,
    library.sortOrder,
    hasActiveCharacter,
    hasClassSpells,
    activeCategory,
    getSpellsByCategory,
    getAllSpells,
    generalSpells
  ]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, library.filters]);

  // Cleanup tooltip timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
      }
    };
  }, [tooltipTimer]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSpells.length / spellsPerPage);
  const paginatedSpells = useMemo(() => {
    const startIndex = (currentPage - 1) * spellsPerPage;
    const endIndex = startIndex + spellsPerPage;
    return filteredSpells.slice(startIndex, endIndex);
  }, [filteredSpells, currentPage, spellsPerPage]);

  // Handle spell selection
  const handleSelectSpell = (spellId, isEditing = false) => {
    // Select the spell in the library state
    dispatch(libraryActionCreators.selectSpell(spellId));

    if (isEditing) {
      const selectedSpell = library.spells.find(spell => spell.id === spellId);
      if (!selectedSpell) {
        console.error('[SpellLibrary] Could not find spell to edit');
        return;
      }

      const originalSpell = selectedSpell;

      // Prefer direct prop if provided (within SpellwizardApp)
      if (onLoadSpell) {
        onLoadSpell(originalSpell, true);
      } else if (typeof window !== 'undefined' && typeof window.handleLoadSpell === 'function') {
        // Use globally exposed handler from SpellwizardApp when available
        window.handleLoadSpell(originalSpell, true);
      } else if (typeof window !== 'undefined') {
        // Fallback: dispatch internal event that SpellwizardApp listens for
        window.dispatchEvent(new CustomEvent('internalLoadSpell', {
          detail: { spell: originalSpell, editMode: true }
        }));
      }

      // If the SpellbookWindow is open, switch to the Wizard tab via Zustand store
      try {
        const { setActiveTab } = useSpellbookStore.getState();
        if (typeof setActiveTab === 'function') setActiveTab('wizard');
      } catch (err) {
        // Silently handle tab switching errors
      }
    }
  };

  // State for confirmation dialog
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // State for share to community dialog
  const [shareDialog, setShareDialog] = useState(null);

  // Handle spell deletion with confirmation
  const handleDeleteSpell = (spellId, spellName) => {
    setDeleteConfirmation({ spellId, spellName });
  };

  // Handle sharing spell to community
  const handleShareToCommunity = (spell) => {
    setShareDialog(spell);
  };

  // Confirm sharing to community
  const confirmShareToCommunity = async (spell) => {
    if (!user?.uid) {
      alert('Please log in to share spells with the community.');
      return;
    }

    try {
      // Use shareSpellToCommunity from userSpellService
      const { shareSpellToCommunity } = await import('../../../../services/firebase/userSpellService');
      
      // The spell should already have an ID from user_spells
      if (!spell.id) {
        throw new Error('Spell must be saved to your account before sharing. Please save the spell first.');
      }

      await shareSpellToCommunity(user.uid, spell.id);
      alert(`Successfully shared "${spell.name}" with the community!`);
      setShareDialog(null);
    } catch (error) {
      console.error('Failed to share spell:', error);
      alert(`Failed to share spell: ${error.message}`);
      throw error;
    }
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (deleteConfirmation) {
      const spellId = deleteConfirmation.spellId;
      const spellName = deleteConfirmation.spellName;


      // Find the spell in filteredSpells or library.spells to check if it's custom
      const spell = filteredSpells.find(s => s.id === spellId) || 
                   library.spells.find(s => s.id === spellId);
      
      const isCustomSpell = spell && (
        spell.isCustom === true ||
        spell.id?.startsWith('custom-') ||
        spell.source === 'wizard'
      );

      console.log('🗑️ [SpellLibrary] Spell details:', {
        found: !!spell,
        isCustomSpell,
        inLibrarySpells: library.spells.some(s => s.id === spellId),
        inFilteredSpells: filteredSpells.some(s => s.id === spellId)
      });

      // ALWAYS remove from library.spells first (all completed spells are stored here)
      const libraryAction = libraryActionCreators.deleteSpell(spellId);
      dispatch(libraryAction);
      console.log('🗑️ [SpellLibrary] Removed from library.spells');

      // ALSO remove from custom spells category if it's a custom spell
      if (isCustomSpell) {
        removeCustomSpell(spellId);
        console.log('🗑️ [SpellLibrary] Removed from custom spells category');
        
        // Remove from localStorage custom spells if it exists there
        try {
          const savedCustomSpells = localStorage.getItem('mythrill-custom-spells');
          if (savedCustomSpells) {
            const customSpells = JSON.parse(savedCustomSpells);
            const updatedCustomSpells = customSpells.filter(s => s.id !== spellId);
            localStorage.setItem('mythrill-custom-spells', JSON.stringify(updatedCustomSpells));
            console.log('🗑️ [SpellLibrary] Removed from localStorage custom spells');
          }
        } catch (error) {
          console.error('🗑️ [SpellLibrary] Error removing from localStorage:', error);
        }
      }

      // Mark spell as deleted in localStorage to prevent reloading from Firebase
      markSpellAsDeleted(spellId);

      // Delete from Firebase if user is logged in and spell exists in Firebase
      if (user?.uid && spellId) {
        try {
          const { deleteUserSpell } = await import('../../../../services/firebase/userSpellService');
          const result = await deleteUserSpell(user.uid, spellId);
          if (result.success) {
            console.log('🗑️ [SpellLibrary] Deleted from Firebase');
          } else {
            console.log('🗑️ [SpellLibrary] Spell not found in Firebase or already deleted');
          }
        } catch (error) {
          console.error('🗑️ [SpellLibrary] Error deleting from Firebase:', error);
          // Continue even if Firebase deletion fails - spell is already removed locally
        }
      }

      setDeleteConfirmation(null);
      console.log('🗑️ [SpellLibrary] Spell deletion complete');
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Handle spell duplication
  const handleDuplicateSpell = (spellId) => {
    dispatch(libraryActionCreators.duplicateSpell(spellId));
  };

  // Handle right-click on spell card
  const handleSpellContextMenu = useCallback((e, spellId) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the spell object by ID
    const spellObj = library.spells.find(s => s.id === spellId);

    if (spellObj) {
      // Calculate position to ensure context menu stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Use clientX/clientY for viewport-fixed positioning (portal renders fixed)
      const x = e.clientX;
      const y = e.clientY;

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
      console.error("[SpellLibrary] Could not find spell with ID:", spellId);
      console.error("[SpellLibrary] This is likely because the spell is not in library.spells");
      // Still open the menu even if we can't find the spell - let the menu component handle it
      const x = e.clientX;
      const y = e.clientY;
      setContextMenu({
        x,
        y,
        spellId
      });
    }
  }, [library.spells]);

  // Handle adding spell to collection
  const handleAddToCollection = (spellId, collectionId) => {
    dispatch(libraryActionCreators.addSpellToCollection(spellId, collectionId));
  };


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

  // Listen for import/export events from tab header
  useEffect(() => {
    const handleImportEvent = () => handleImport();
    const handleExportEvent = () => handleExport();

    window.addEventListener('spellLibraryImport', handleImportEvent);
    window.addEventListener('spellLibraryExport', handleExportEvent);

    return () => {
      window.removeEventListener('spellLibraryImport', handleImportEvent);
      window.removeEventListener('spellLibraryExport', handleExportEvent);
    };
  }, [handleImport, handleExport]);


  // Render empty state when no spells exist
  // Check both class-based spells and traditional library spells
  // Also check if we have general spells available
  const shouldShowEmptyState = !hasActiveCharacter && library.spells.length === 0 && generalSpells.length === 0;

  if (shouldShowEmptyState) {
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
          marginBottom: '16px',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>Your personal spell library is now clean and ready for your creations!</p>
        <p style={{
          color: '#8B4513',
          fontFamily: 'Crimson Text, serif',
          fontSize: '14px',
          marginBottom: '24px',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          • Create spells using the <strong>Spell Wizard</strong><br/>
          • Download spells from the <strong>Community</strong> tab<br/>
          • Import spells from JSON files
        </p>
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
      {/* Library header - conditionally rendered (hide in compact view) */}
      {!hideHeader && viewMode !== 'compact' && (
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

            {/* Character Activation Controls */}
            {!hasActiveCharacter && (() => {
              const characters = useCharacterStore(state => state.characters);
              const setActiveCharacter = useCharacterStore(state => state.setActiveCharacter);

              if (characters.length > 0) {
                return (
                  <div className="character-activation-controls" style={{
                    display: 'flex',
                    gap: '8px',
                    marginLeft: '16px',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#F0E6D2',
                      fontFamily: 'Cinzel, serif',
                      opacity: 0.9
                    }}>
                      Activate:
                    </span>
                    {characters.map(char => (
                      <button
                        key={char.id}
                        onClick={async () => {
                          await setActiveCharacter(char.id);
                        }}
                        className="character-activation-btn"
                        style={{
                          background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 50%, #2E8B57 100%)',
                          border: '1px solid #228B22',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: 'white',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'Cinzel, serif',
                          transition: 'all 0.2s ease'
                        }}
                        title={`Activate ${char.name} (${char.class})`}
                      >
                        {char.name}
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}





            <div className="view-mode-controls">
              <button
                className={`view-mode-button ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                aria-label="Compact view"
                title="WoW Classic spellbook view"
              >
                <i className="fas fa-book"></i>
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

      {/* Category Selection - Light Theme (hide in compact view) */}
      {hasActiveCharacter && allSpellCategories.length > 0 && viewMode !== 'compact' && (
        <div className="spell-categories-container" style={{
          background: 'linear-gradient(135deg, #f0e6d2 0%, #e8dcc0 100%)',
          border: '2px solid #8B4513',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div className="spell-categories" style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                background: !activeCategory ? '#8B4513' : 'transparent',
                border: '2px solid #8B4513',
                borderRadius: '6px',
                padding: '8px 16px',
                color: !activeCategory ? '#F0E6D2' : '#8B4513',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                transition: 'all 0.2s ease',
                textShadow: !activeCategory ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              All Spells
            </button>
            {allSpellCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  background: activeCategory === category.id ? category.color : 'transparent',
                  border: `2px solid ${category.color}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: activeCategory === category.id ? '#F0E6D2' : category.color,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  transition: 'all 0.2s ease',
                  textShadow: activeCategory === category.id ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                }}
                title={category.description}
              >
                {category.name} ({category.spells?.length || 0})
              </button>
            ))}
          </div>

          {classSpellsError && (
            <div style={{
              color: '#D2691E',
              fontSize: '12px',
              marginTop: '8px',
              fontFamily: 'Cinzel, serif'
            }}>
              {classSpellsError}
            </div>
          )}
        </div>
      )}

      {/* Main content area */}
      <div className="library-content" ref={libraryContentRef}>
        {/* Compact WoW-style view */}
        {viewMode === 'compact' ? (
          <div className="wow-spellbook-view">
                {totalPages > 0 && (
                  <div className="wow-spellbook-header">
                    <button
                      className="wow-header-button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous Page"
                      title="Previous Page"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="wow-spellbook-title">Page {currentPage}</div>
                    <button
                      className="wow-header-button"
                      onClick={() => setCurrentPage(p => Math.min(Math.max(totalPages, 1), p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next Page"
                      title="Next Page"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}



              {/* Category Tabs - Only show if character is active */}
              {hasActiveCharacter && allSpellCategories.length > 0 && (
                <div className="wow-category-tabs">
                  <button
                    className={`wow-category-tab ${!activeCategory ? 'active' : ''}`}
                    onClick={() => setActiveCategory(null)}
                  >
                    All Spells
                  </button>
                  {allSpellCategories.map(category => (
                    <button
                      key={category.id}
                      className={`wow-category-tab ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                      title={category.description}
                    >
                      {category.name} ({category.spells?.length || 0})
                    </button>
                  ))}
                </div>
              )}

            {filteredSpells.length === 0 ? (
              <div className="wow-spell-list-container">
                <div className="wow-spellbook-empty">
                  <i className="fas fa-book-open"></i>
                  <p>No spells found</p>
                </div>
              </div>
            ) : (
              <>
                <div className="wow-spell-list-container">
                  {paginatedSpells.map(spell => (
                    <div
                      key={spell.id}
                      className={`wow-spell-row ${library.selectedSpell === spell.id ? 'selected' : ''}`}
                      onClick={() => handleSelectSpell(spell.id)}
                      onMouseDown={(e) => { if (e.button === 2) handleSpellContextMenu(e, spell.id); }}
                      onContextMenu={(e) => handleSpellContextMenu(e, spell.id)}
                      draggable={true}
                      onDragStart={(e) => {
                        const iconName = spell?.typeConfig?.icon ||
                                       spell?.icon ||
                                       spell?.damageConfig?.icon ||
                                       spell?.healingConfig?.icon ||
                                       'inv_misc_questionmark';

                        const spellData = {
                          ...spell,
                          id: spell.id,
                          name: spell.name,
                          icon: iconName,
                          cooldown: spell.cooldown || 0,
                          level: spell.level || 1,
                          spellType: spell.spellType || 'ACTION',
                          type: 'spell'
                        };
                        e.dataTransfer.setData('application/json', JSON.stringify(spellData));
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      onMouseEnter={(e) => {
                        // Clear any existing timer
                        if (tooltipTimer) {
                          clearTimeout(tooltipTimer);
                        }

                        // Set a small delay before showing tooltip (like WoW Classic)
                        const timer = setTimeout(() => {
                          // Check if element still exists
                          if (!e.currentTarget) return;

                          const rect = e.currentTarget.getBoundingClientRect();
                          const tooltipWidth = 600; // max-width from CSS
                          const tooltipHeight = 400; // estimated height

                          // Calculate position - prefer right side, but flip to left if not enough space
                          let x = rect.right + 10;
                          let y = rect.top;

                          // Check if tooltip would go off right edge of screen
                          if (x + tooltipWidth > window.innerWidth) {
                            x = rect.left - tooltipWidth - 10;
                          }

                          // Check if tooltip would go off bottom edge of screen
                          if (y + tooltipHeight > window.innerHeight) {
                            y = window.innerHeight - tooltipHeight - 10;
                          }

                          // Ensure tooltip doesn't go off top edge
                          if (y < 10) {
                            y = 10;
                          }

                          setHoveredSpell(spell);
                          setTooltipPosition({ x, y });
                        }, 300); // 300ms delay

                        setTooltipTimer(timer);
                      }}
                      onMouseLeave={() => {
                        // Clear timer and hide tooltip
                        if (tooltipTimer) {
                          clearTimeout(tooltipTimer);
                          setTooltipTimer(null);
                        }
                        setHoveredSpell(null);
                      }}
                    >
                      <div className="wow-spell-icon">
                        <img
                          src={getSpellIconUrl(spell)}
                          alt={spell.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                          }}
                        />
                      </div>
                      <div className="wow-spell-info">
                        <p className="wow-spell-name">{spell.name}</p>
                        <p className="wow-spell-rank">
                          {spell.description || spell.spellType || 'Action'}
                        </p>
                      </div>
                      {spell.spellType && (
                        <span className="wow-spell-type">{spell.spellType}</span>
                      )}
                    </div>
                  ))}

                      {Array.from({ length: Math.max(0, spellsPerPage - paginatedSpells.length) }).map((_, idx) => (
                        <div key={`empty-slot-${idx}`} className="wow-spell-row empty" aria-hidden="true">
                          <div className="wow-empty-icon" />
                          <div className="wow-empty-name-box" />
                        </div>
                      ))}

                </div>

                {totalPages > 1 && (
                  <div className="wow-spellbook-pagination">
                    <button
                      className="wow-page-button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="wow-page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="wow-page-button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Grid/List view */
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
                  {hasActiveCharacter && hasClassSpells ? (
                    <>
                      Showing {filteredSpells.length} of {getAllSpells().length} spells
                      {activeCategory && (
                        <span style={{ marginLeft: '8px', opacity: 0.8 }}>
                          (from {getCategoryInfo(activeCategory)?.name || 'category'})
                        </span>
                      )}
                    </>
                  ) : (
                    `Showing ${filteredSpells.length} of ${library.spells.length} spells`
                  )}
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

                  // Always render full card view (grid/list)
                  return (
                    <div
                      key={spell.id}
                      className={`spell-card-wrapper has-edit-button ${library.selectedSpell === spell.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        // Handle normal card click - just select the spell
                        handleSelectSpell(spell.id);
                      }}
                      onMouseDown={(e) => { if (e.button === 2) handleSpellContextMenu(e, spell.id); }}
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
        )}
      </div>



      {/* Context Menu */}
      {contextMenu && (() => {
        // Find the spell in filteredSpells (which includes both class and custom spells)
        const spell = filteredSpells.find(s => s.id === contextMenu.spellId);

        // Check if this is a custom spell:
        // 1. Has isCustom property set to true
        // 2. ID starts with "custom-"
        // 3. Exists in library.spells
        const isCustomSpell = spell && (
          spell.isCustom === true ||
          spell.id?.startsWith('custom-') ||
          library.spells.some(s => s.id === contextMenu.spellId)
        );


        return ReactDOM.createPortal(
          <SpellContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            spell={spell || { id: contextMenu.spellId, name: 'Unknown Spell' }}
            onClose={() => setContextMenu(null)}
            collections={library.categories}
            inCollection={false}
            isCustomSpell={isCustomSpell}
            onEdit={isCustomSpell ? (spellId) => {
              const spellToEdit = library.spells.find(s => s.id === spellId);
              if (spellToEdit) {
                handleSelectSpell(spellId, true);
              } else {
                console.error("[SpellLibrary] Could not find spell with ID:", spellId);
              }
            } : null}
            onDelete={isCustomSpell ? (spellId) => {
              const spellToDelete = library.spells.find(s => s.id === spellId);
              handleDeleteSpell(spellId, spellToDelete?.name || 'Unknown Spell');
            } : null}
            onAddToCollection={handleAddToCollection}
            onShareToCommunity={isCustomSpell ? handleShareToCommunity : null}
          />,
          document.body
        );
      })()}

      {/* Share to Community Dialog */}
      {shareDialog && (
        <ShareToCommunityDialog
          isOpen={!!shareDialog}
          spell={shareDialog}
          onClose={() => setShareDialog(null)}
          onShare={confirmShareToCommunity}
        />
      )}

      {/* Spell Tooltip - Shows full spell card on hover (only when no spell is selected) */}
      {hoveredSpell && viewMode === 'compact' && !library.selectedSpell && ReactDOM.createPortal(
        <div
          className={`wow-spell-tooltip ${hoveredSpell ? 'visible' : ''}`}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          <div className="review-spell-preview">
            <SpellCardWithProcs
              spell={mapSpellToUnifiedFormat(hoveredSpell)}
              variant="wizard"
              rollableTableData={getSpellRollableTable(hoveredSpell)}
              showActions={false}
              showDescription={true}
              showStats={true}
              showTags={true}
              procPosition="right"
              showProcs={true}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Spell Preview - Just the spell card floating to the right of library */}
      {library.selectedSpell && (() => {
        const selectedSpell = filteredSpells.find(s => s.id === library.selectedSpell);
        if (!selectedSpell) return null;

        const transformedSpell = mapSpellToUnifiedFormat(selectedSpell);
        const rollableTableData = getSpellRollableTable(selectedSpell);

        return ReactDOM.createPortal(
          <div
            className="spell-preview-panel-floating"
            style={{
              position: 'fixed',
              left: `${previewPanelPosition.x}px`,
              top: `${previewPanelPosition.y}px`,
              zIndex: 9999,
              animation: 'slideInFromRight 0.3s ease-out',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))'
            }}
          >
            <SpellCardWithProcs
              spell={transformedSpell}
              variant="wizard"
              rollableTableData={rollableTableData}
              showActions={false}
              showDescription={true}
              showStats={true}
              showTags={true}
              procPosition="below"
              showProcs={true}
            />
          </div>,
          document.body
        );
      })()}

      {/* Confirmation Dialog for Spell Deletion */}
      {deleteConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${deleteConfirmation.spellName}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

    </div>
  );
};

export default SpellLibrary;