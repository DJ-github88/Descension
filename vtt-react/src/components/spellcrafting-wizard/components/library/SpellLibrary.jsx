import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { useClassSpellLibrary } from '../../../../hooks/useClassSpellLibrary';
import { useWeaponEnhancedSpells } from '../../../../hooks/useWeaponEnhancedSpells';
import useCharacterStore from '../../../../store/characterStore';
import useAuthStore from '../../../../store/authStore';
import { loadUserSpells } from '../../../../services/firebase/userSpellService';
import { getSkillAbilitiesForSpellbook } from '../../../../utils/skillAbilitiesIntegration';
import { getAbilityIconUrl, getCustomIconUrl } from '../../../../utils/assetManager';

import { filterSpells, sortSpells } from '../../core/utils/libraryManager';
import { getSpellRollableTable } from '../../core/utils/spellCardTransformer';
import { GENERAL_CATEGORIES } from '../../../../data/generalSpellsData';
import { getRacialSpells, getDisciplineSpells, isPassiveStatModifier } from '../../../../utils/raceDisciplineSpellUtils';
import SpellCardWithProcs from '../common/SpellCardWithProcs';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import '../../styles/pathfinder/main.css';
import '../../styles/pathfinder/components/wow-spellbook.css';

import SpellContextMenu from './SpellContextMenu';
import ConfirmationDialog from '../../../item-generation/ConfirmationDialog';
import ShareToCommunityDialog from './ShareToCommunityDialog';
import useSpellbookStore from '../../../../store/spellbookStore';


// Helper function to map WoW icon IDs to local ability icons for spells
const mapSpellIcon = (wowIconId) => {
  const iconMapping = {
    // Combat/Attack icons
    'ability_meleedamage': 'General/Combat Downward Strike',
    'ability_warrior_savageblow': 'General/Combat Downward Strike',
    'ability_warrior_charge': 'General/Combat Downward Strike',
    'ability_warrior_revenge': 'General/Combat Downward Strike',
    'ability_warrior_cleave': 'General/Combat Downward Strike',
    'ability_warrior_riposte': 'Utility/Parry',
    'ability_warrior_shieldbash': 'Utility/Shield',
    'ability_rogue_evasion': 'Utility/Speed Dash',
    'ability_rogue_feint': 'Utility/Parry',
    'ability_rogue_sprint': 'Utility/Speed Dash',
    'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
    'ability_stealth': 'Utility/Hide',
    'ability_hunter_snipershot': 'Utility/Target Crosshair',
    'ability_hunter_markedshot': 'Utility/Target Crosshair',
    'ability_hunter_markedfordeath': 'Utility/Target Crosshair',

    // Defensive icons
    'inv_shield_05': 'Utility/Shield',
    'inv_shield_04': 'Utility/Shield',
    'ability_warrior_defensivestance': 'Utility/Shield',
    'spell_holy_powerwordshield': 'Utility/Shield',
    'spell_holy_devotionaura': 'Radiant/Divine Blessing',

    // Healing/Support icons
    'spell_holy_greaterheal': 'Healing/Golden Heart',
    'spell_holy_heal02': 'Healing/Golden Heart',
    'spell_holy_flashheal': 'Healing/Golden Heart',
    'spell_holy_renew': 'Healing/Renewal',

    // Utility icons
    'spell_arcane_portaldalaran': 'Utility/Utility',
    'spell_arcane_teleportundercity': 'Utility/Utility',
    'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
    'inv_misc_questionmark': 'Utility/Utility',
    'inv_misc_book_07': 'Utility/Utility',
    'inv_misc_bag_08': 'Utility/Utility',

    // Magic/Damage icons
    'spell_fire_fireball02': 'Fire/Swirling Fireball',
    'spell_fire_flamebolt': 'Fire/Flame Burst',
    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
    'spell_arcane_blast': 'Arcane/Magical Sword',
    'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
    'spell_holy_holysmite': 'Radiant/Divine Blessing',
    'spell_nature_lightning': 'Lightning/Lightning Bolt',

    // Control icons
    'spell_frost_chainsofice': 'Frost/Frozen in Ice',
    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',

    // Buff icons
    'spell_holy_divineillumination': 'Radiant/Divine Blessing',
    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',

    // Summoning icons
    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
    'spell_shadow_summoninfernal': 'Utility/Summon Minion',

    // Transformation icons
    'ability_druid_catform': 'Utility/Utility',

    // Trap icons
    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',

    // Wild magic icons
    'spell_arcane_arcane04': 'Arcane/Magical Sword'
  };

  return iconMapping[wowIconId] || null;
};

// Helper function to get spell icon URL using local ability icons
const getSpellIconUrl = (spell) => {
  // Extract icon from various possible locations
  const iconId = spell?.typeConfig?.icon ||
    spell?.icon ||
    spell?.damageConfig?.icon ||
    spell?.healingConfig?.icon ||
    null;

  // If no icon is set, use default
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // If it's already a full URL (ability icon), return as-is
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
    return iconId;
  }

  // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
    if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
      return getCustomIconUrl(iconId, 'abilities');
    }
    // Otherwise try to use it as-is
    return getCustomIconUrl(iconId, 'abilities');
  }

  // If it's a WoW icon ID, try to map it to a local ability icon
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const mappedIcon = mapSpellIcon(iconId);
    if (mappedIcon) {
      return getCustomIconUrl(mappedIcon, 'abilities');
    }
    // If no mapping found, try getAbilityIconUrl as fallback (but it may add creature- prefix)
    // Better to use a sensible default based on icon name
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // Default fallback
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

// Category helpers to handle legacy/sluggified IDs consistently
const normalizeCategoryId = (id = '') => id.toString().toLowerCase().replace(/\s+/g, '_');
const isRacialCategory = (categoryIds = []) =>
  categoryIds.some(id => {
    const normalized = normalizeCategoryId(id);
    return normalized === 'racial_abilities' || normalized === 'racial';
  });
const isDisciplineCategory = (categoryIds = []) =>
  categoryIds.some(id => {
    const normalized = normalizeCategoryId(id);
    return (
      normalized === 'discipline_abilities' ||
      normalized === 'discipline_passives' ||
      normalized === 'discipline'
    );
  });

// Sanitize discipline resource costs to allowed pools
const sanitizeDisciplineResourceCost = (cost) => {
  if (!cost || typeof cost !== 'object') return cost;
  const allowed = {};
  ['mana', 'health', 'actionPoints'].forEach(key => {
    if (cost[key] !== undefined && cost[key] !== null) {
      allowed[key] = cost[key];
    }
  });
  // If nothing allowed, provide a safe default with zero AP
  return Object.keys(allowed).length > 0 ? allowed : { actionPoints: cost.actionPoints ?? 0 };
};

// Normalize discipline spell resource fields (handles resourceTypes/resourceValues shapes)
const sanitizeDisciplineSpell = (spell) => {
  const costFromTypes = (() => {
    if (spell.resourceTypes && spell.resourceValues) {
      const out = {};
      spell.resourceTypes.forEach((type) => {
        if (['mana', 'health', 'stamina', 'actionPoints'].includes(type)) {
          const val = spell.resourceValues?.[type];
          if (val !== undefined && val !== null) out[type === 'stamina' ? 'stamina' : type] = val;
        }
      });
      return out;
    }
    return null;
  })();

  const baseCost = costFromTypes || spell.resourceCost || {};
  const sanitizedCost = sanitizeDisciplineResourceCost({
    ...baseCost,
    // also surface stamina if present so it can be stripped by sanitizer
    stamina: baseCost.stamina
  });

  return {
    ...spell,
    resourceCost: sanitizedCost,
    // remove legacy fields to avoid UI rendering them
    resourceTypes: undefined,
    resourceValues: undefined
  };
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
  // View mode (default compact)
  const [viewMode, setViewMode] = useState('compact');

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);

  // State for active category
  const [activeCategory, setActiveCategory] = useState(null);

  // State for pagination (for compact view)
  const [currentPage, setCurrentPage] = useState(1);
  const spellsPerPage = 12; // 6 per column, 2 columns (WoW-style page)
  const isManuallyPaginatingRef = useRef(false);
  const paginationTimeoutRef = useRef(null);
  const prevFiltersRef = useRef(null);
  const prevActiveCategoryRef = useRef(null);

  // State for spell popup (click to show)
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [previewPanelPosition, setPreviewPanelPosition] = useState({ x: 0, y: 0 });
  const isShowingPopupRef = useRef(false);

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
    classSpells: rawClassSpells,
    getAllSpells,
    getSpellsByCategory,
    getCategoryInfo,
    removeCustomSpell,
    hasActiveCharacter,
    hasClassSpells
  } = useClassSpellLibrary();

  // Get character store for skill abilities
  const characters = useCharacterStore(state => state.characters);
  const setActiveCharacter = useCharacterStore(state => state.setActiveCharacter);
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const characterLevel = useCharacterStore(state => state.level);
  // Get race/subrace directly from character store for real-time updates during wizard
  const characterStoreRace = useCharacterStore(state => state.race);
  const characterStoreSubrace = useCharacterStore(state => state.subrace);
  const characterStorePath = useCharacterStore(state => state.path);

  // Get active character's level (prefer active character's level if available)
  const activeChar = characters.find(char => char.id === currentCharacterId);

  // Use character store race/subrace if available (for wizard), otherwise use activeChar
  const currentRace = characterStoreRace || activeChar?.race;
  const currentSubrace = characterStoreSubrace || activeChar?.subrace;
  const currentPath = characterStorePath || activeChar?.path;
  const activeCharacterLevel = activeChar?.level || characterLevel || 1;
  // Reset active category when class changes to avoid stale category filters
  useEffect(() => {
    setActiveCategory(null);
    setCurrentPage(1);
  }, [characterClass]);

  // Reset page and category when character changes to show only current character's spells
  useEffect(() => {
    setActiveCategory(null);
    setCurrentPage(1);
    // Clear manual pagination flag when character changes
    isManuallyPaginatingRef.current = false;
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
      paginationTimeoutRef.current = null;
    }
  }, [currentCharacterId]);

  // Get general spells with weapon integration
  const {
    enhancedSpells: generalSpells,
  } = useWeaponEnhancedSpells();

  // Filter out unwanted spells from general spells
  const filteredGeneralSpells = generalSpells.filter(spell => {
    const id = spell.id?.toLowerCase() || '';
    const name = spell.name?.toLowerCase() || '';
    return (
      id !== 'universal_attack' &&
      name !== 'attack (melee or ranged)' &&
      !id.includes('cast_minor') &&
      !id.includes('cast_major') &&
      !name.includes('cast minor') &&
      !name.includes('cast major')
    );
  });

  // Helper function to filter out unwanted spells from any spell list
  // Get known spells from character store
  const knownSpellIds = useCharacterStore(state => state.class_spells?.known_spells || []);
  const activeCharKnownSpells = activeChar?.class_spells?.known_spells || knownSpellIds;

  // Get filtered library spells for category population (before final filtering)
  // This needs to be defined before allSpellCategories uses it
  const filteredLibrarySpellsForCategories = useMemo(() => {
    if (!hasActiveCharacter || !currentCharacterId) {
      return library.spells.filter(spell => {
        const categoryIds = spell.categoryIds || [];
        return !isRacialCategory(categoryIds) && !isDisciplineCategory(categoryIds);
      });
    }

    const currentRacialSpells = currentRace && currentSubrace
      ? getRacialSpells(currentRace, currentSubrace)
      : [];
    const currentRacialSpellIds = new Set(currentRacialSpells.map(s => s.id));

    return library.spells.filter(spell => {
      const categoryIds = spell.categoryIds || [];

      if (!isRacialCategory(categoryIds) && !isDisciplineCategory(categoryIds)) {
        return true;
      }

      if (isRacialCategory(categoryIds)) {
        return currentRacialSpellIds.has(spell.id);
      }

      if (isDisciplineCategory(categoryIds)) {
        return currentPath && currentPath !== '';
      }

      return true;
    });
  }, [library.spells, hasActiveCharacter, currentCharacterId, currentRace, currentSubrace, currentPath]);

  // Combine spell categories with general categories
  // Only show: General Actions, General Reactions, and class name (if class selected)
  const allSpellCategories = useMemo(() => {
    const combined = [];

    // Add general categories with spell counts (excluding Attack spell)
    GENERAL_CATEGORIES.forEach(generalCategory => {
      const categorySpells = filteredGeneralSpells.filter(spell =>
        spell.categoryIds && spell.categoryIds.includes(generalCategory.id)
      );

      combined.push({
        ...generalCategory,
        spells: categorySpells,
        isGeneral: true
      });
    });

    // If a class is selected, add a single class category instead of level-based categories
    if (hasActiveCharacter && hasClassSpells && characterClass) {
      // Use rawClassSpells and filter manually to ensure we get all known spells
      const allClassSpells = rawClassSpells || [];
      const generalSpellIds = new Set(filteredGeneralSpells.map(spell => spell.id));
      const knownSpellIdsSet = new Set(activeCharKnownSpells);

      // Check if all known spells are in rawClassSpells
      const rawSpellIds = new Set(allClassSpells.map(s => s.id));
      const missingKnownSpells = activeCharKnownSpells.filter(id => !rawSpellIds.has(id));


      // If we have missing known spells, log them with details
      if (missingKnownSpells.length > 0) {
        console.warn('⚠️ [Category Creation] Some known spells are not in rawClassSpells:', missingKnownSpells);
      }

      // Filter to only known spells at or below character level (matching the filtering logic)
      const filteredClassSpells = allClassSpells.filter(spell => {
        // Debug logging for known spells
        const isKnown = knownSpellIdsSet.has(spell.id);
        if (isKnown) {
          const spellLevel = spell.level || 1;
          const levelCheck = spellLevel <= activeCharacterLevel;
          const isGeneral = generalSpellIds.has(spell.id);
          const isUniversal = spell.id?.startsWith('universal_');
          const id = spell.id?.toLowerCase() || '';
          const name = spell.name?.toLowerCase() || '';
          const isUnwanted = (
            id === 'universal_attack' ||
            name === 'attack (melee or ranged)' ||
            id.includes('cast_minor') ||
            id.includes('cast_major') ||
            name.includes('cast minor') ||
            name.includes('cast major')
          );

        }

        // Exclude general spells
        if (generalSpellIds.has(spell.id)) {
          return false;
        }
        // Exclude universal spells (especially universal_attack)
        if (spell.id?.startsWith('universal_')) {
          return false;
        }
        // Exclude unwanted spells (Attack, Cast Minor/Major)
        const id = spell.id?.toLowerCase() || '';
        const name = spell.name?.toLowerCase() || '';
        if (
          id === 'universal_attack' ||
          name === 'attack (melee or ranged)' ||
          id.includes('cast_minor') ||
          id.includes('cast_major') ||
          name.includes('cast minor') ||
          name.includes('cast major')
        ) {
          return false;
        }
        // Only show spells the character knows/selected
        if (!knownSpellIdsSet.has(spell.id)) {
          return false;
        }
        // Filter by spell level - only show spells at or below character level
        const spellLevel = spell.level || 1;
        return spellLevel <= activeCharacterLevel;
      });

      // Only show a class tab if there is at least one class spell to display
      if (filteredClassSpells.length > 0) {
        const expectedSpellCount = filteredClassSpells.length;


        // Create a single class category with the filtered spells
        combined.push({
          id: `class_${characterClass.toLowerCase()}`,
          name: characterClass,
          description: `${characterClass} class spells`,
          color: '#8B4513',
          icon: 'spell_holy_magicalsentry',
          spells: filteredClassSpells,
          // Store expected count for display (actual visible spells)
          expectedCount: expectedSpellCount,
          isClassCategory: true,
          className: characterClass
        });
      } else {
      }
    }

    const hasRacialContext = !!(currentRace || currentSubrace);
    const hasDisciplineContext = !!(currentPath && currentPath !== '');

    // Add Racial Abilities category (show tab whenever racial context exists)
    if (hasRacialContext) {
      const racialSpellsInLibrary = filteredLibrarySpellsForCategories.filter(spell => {
        const categoryIds = spell.categoryIds || [];
        return isRacialCategory(categoryIds);
      });

      // Fallback: pull directly from race data if library has none
      const fallbackRacial = currentRace && currentSubrace
        ? getRacialSpells(currentRace, currentSubrace).filter(spell => !isPassiveStatModifier(spell))
        : [];

      const racialSpells = racialSpellsInLibrary.length > 0 ? racialSpellsInLibrary : fallbackRacial;

      combined.push({
        id: 'racial_abilities',
        name: 'Racial',
        description: 'Racial abilities from your race and subrace',
        color: '#8B4513',
        icon: 'spell_holy_devotion',
        spells: racialSpells,
        isRacial: true
      });
    }

    // Add Discipline Abilities category (show tab whenever a path is set)
    if (hasDisciplineContext) {
      const disciplineSpellsInLibrary = filteredLibrarySpellsForCategories.filter(spell => {
        const categoryIds = spell.categoryIds || [];
        return isDisciplineCategory(categoryIds);
      });

      // Fallback: pull directly from path data if library has none
      const fallbackDiscipline = currentPath ? getDisciplineSpells(currentPath) : [];
      const disciplineSpellsRaw = disciplineSpellsInLibrary.length > 0 ? disciplineSpellsInLibrary : fallbackDiscipline;
      // Enforce allowed resource costs (mana, health, actionPoints) and strip stamina
      const disciplineSpells = disciplineSpellsRaw.map(sanitizeDisciplineSpell);

      combined.push({
        id: 'discipline_abilities',
        name: 'Discipline',
        description: 'Discipline abilities from your chosen path',
        color: '#8B4513',
        icon: 'spell_holy_magicalsentry',
        spells: disciplineSpells,
        isDiscipline: true
      });
    }

    return combined;
  }, [spellCategories, filteredGeneralSpells, hasActiveCharacter, hasClassSpells, characterClass, rawClassSpells, activeCharKnownSpells, activeCharacterLevel, currentCharacterId, activeChar, filteredLibrarySpellsForCategories, currentRace, currentSubrace, currentPath]);

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
  // Use ref to prevent concurrent calls and remove library.spells.length from deps
  const isLoadingUserSpellsRef = React.useRef(false);

  useEffect(() => {
    const loadUserSpellsFromFirebase = async () => {
      // Guard against concurrent calls
      if (isLoadingUserSpellsRef.current) {
        return;
      }

      if (user?.uid && !userSpellsLoaded) {
        isLoadingUserSpellsRef.current = true;
        try {
          const userSpells = await loadUserSpells(user.uid);
          const deletedSpellIds = getDeletedSpellIds();

          if (userSpells && userSpells.length > 0) {
            // Filter out deleted spells and spells that already exist
            // We read library.spells inside the callback, not from closure
            const currentSpellIds = new Set(library.spells.map(s => s.id));
            const spellsToAdd = userSpells.filter(spell => {
              // Don't add if it's been deleted
              if (deletedSpellIds.includes(spell.id)) {
                return false;
              }
              // Don't add if it already exists in the library
              if (currentSpellIds.has(spell.id)) {
                return false;
              }
              return true;
            });

            // Add each spell to the library
            spellsToAdd.forEach(spell => {
              dispatch({ type: 'ADD_SPELL_DIRECT', payload: spell });
            });
          }

          setUserSpellsLoaded(true);
        } catch (error) {
          console.error('Error loading user spells from Firebase:', error);
          setUserSpellsLoaded(true); // Mark as loaded even on error to prevent infinite retries
        } finally {
          isLoadingUserSpellsRef.current = false;
        }
      } else if (!user?.uid && userSpellsLoaded) {
        // User logged out, reset the flag
        setUserSpellsLoaded(false);
      }
    };

    loadUserSpellsFromFirebase();
    // Note: Removed library.spells.length - we only need to run once per user login
    // The ref guard prevents any race conditions
  }, [user?.uid, userSpellsLoaded, dispatch]);

  // Debug: Log spell library state changes (disabled)
  useEffect(() => {
    // Debug logging disabled
  }, [hasActiveCharacter, hasClassSpells, characterClass, activeCharacter, spellCategories.length, classSpellsLoading, classSpellsError, user?.uid, userSpellsLoaded, library.spells.length, generalSpells.length, allSpellCategories.length]);

  // Calculate preview panel position when a spell is selected
  useEffect(() => {
    if (library.selectedSpell && libraryContentRef.current) {
      const updatePosition = () => {
        // Safety check: ensure the ref still exists
        if (!libraryContentRef.current) return;

        const libraryRect = libraryContentRef.current.getBoundingClientRect();
        const previewWidth = 400; // More conservative width
        const previewHeight = Math.min(600, window.innerHeight - 120); // More conservative height

        // Position to the right of the library window
        let x = libraryRect.right + 20;
        let y = libraryRect.top;

        // If preview would go off right edge, position to the left instead
        if (x + previewWidth > window.innerWidth) {
          x = Math.max(10, libraryRect.left - previewWidth - 20);
        }

        // Ensure preview doesn't go off bottom
        if (y + previewHeight > window.innerHeight) {
          y = Math.max(10, window.innerHeight - previewHeight - 20);
        }

        // Ensure preview doesn't go off top
        if (y < 10) {
          y = 10;
        }

        // Ensure preview doesn't go off left edge
        if (x < 10) {
          x = 10;
        }

        setPreviewPanelPosition({ x, y });
      };

      // Small delay to ensure DOM is updated
      setTimeout(updatePosition, 10);

      // Update position on window resize
      const handleResize = () => {
        if (libraryContentRef.current) {
          updatePosition();
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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
    // Debug logging removed for production

    // Use class-based spells if available, otherwise fall back to library spells
    let spellsToFilter = [];
    // Keep a shared filtered list for downstream branches (racial/discipline categories)
    let filteredLibrarySpells = [];

    // Check if we're filtering by class category - if so, don't include library spells or skill abilities
    const isClassCategoryActive = activeCategory && activeCategory.startsWith('class_');

    // ALWAYS include library.spells first (custom spells from wizard should always appear)
    // EXCEPT when viewing a class category - then only show class spells
    if (!isClassCategoryActive) {
      // Filter library.spells to only show spells for the current character
      filteredLibrarySpells = [...library.spells];

      if (hasActiveCharacter && currentCharacterId) {
        // Get current character's racial spells - use character store values for real-time updates
        const currentRacialSpells = currentRace && currentSubrace
          ? getRacialSpells(currentRace, currentSubrace)
          : [];
        const currentRacialSpellIds = new Set(currentRacialSpells.map(s => s.id));

        // Filter library spells to only include:
        // 1. Custom spells (not in character-specific categories) - these are user-created
        // 2. Racial spells that match current character's race/subrace AND are not passives
        // 3. Discipline spells that match current character's path (filtered by Equipment component)
        filteredLibrarySpells = library.spells.filter(spell => {
          const categoryIds = spell.categoryIds || [];

          // Always include custom spells (not character-specific categories)
          // These are spells created by the user in the spell wizard
          if (!isRacialCategory(categoryIds) && !isDisciplineCategory(categoryIds)) {
            return true;
          }

          // For Racial Abilities, only include if it matches current character's race/subrace
          // AND it's not a passive stat modifier (passives should only appear in passive section)
          if (isRacialCategory(categoryIds)) {
            // Explicitly filter out known passive traits that shouldn't be spells
            const spellName = (spell.name || '').toLowerCase();
            const spellId = (spell.id || '').toLowerCase();
            if (spellId === 'deep_frost_nordmark' || spellName === 'deep frost') {
              console.warn('🚫 [SpellLibrary] Filtering out Deep Frost - it should be a passive, not a spell');
              return false;
            }

            // Check if this spell is actually a passive stat modifier (shouldn't be in library)
            if (isPassiveStatModifier(spell)) {
              console.warn('🚫 [SpellLibrary] Filtering out passive stat modifier from spell library:', {
                spellId: spell.id,
                spellName: spell.name
              });
              return false;
            }

            // Only show if this spell is in the current character's racial spell list
            const matches = currentRacialSpellIds.has(spell.id);
            if (!matches) {
              console.log('🚫 [SpellLibrary] Filtering out racial spell not matching current character:', {
                spellId: spell.id,
                spellName: spell.name,
                currentRace: currentRace,
                currentSubrace: currentSubrace,
                currentRacialSpellIds: Array.from(currentRacialSpellIds)
              });
            }
            return matches;
          }

          // For Discipline Abilities/Passives, only include if character has a path
          // The Equipment component should have already cleaned up old path spells
          if (isDisciplineCategory(categoryIds)) {
            // Only show if the character has a path set
            // The Equipment component manages adding/removing these, so if they're in the library
            // and the character has a path, they should be valid
            const hasPath = currentPath && currentPath !== '';
            if (!hasPath) {
            }
            return hasPath;
          }

          return true; // Include other spells by default
        });
      } else {
        // If no active character, filter out all character-specific spells
        filteredLibrarySpells = library.spells.filter(spell => {
          const categoryIds = spell.categoryIds || [];
          return !isRacialCategory(categoryIds) && !isDisciplineCategory(categoryIds);
        });
      }

      spellsToFilter = filteredLibrarySpells;

      // Add skill-based abilities if character has skill proficiencies
      if (hasActiveCharacter && currentCharacterId) {
        const activeChar = characters.find(char => char.id === currentCharacterId);

        if (activeChar?.skillRanks) {
          const skillAbilities = getSkillAbilitiesForSpellbook(activeChar.skillRanks);
          if (skillAbilities.length > 0) {
            spellsToFilter = [...spellsToFilter, ...skillAbilities];
          }
        }
      }
    }

    // Handle general category filtering first - this should work regardless of active character or class spells
    const isGeneralCategory = activeCategory ? GENERAL_CATEGORIES.some(cat => cat.id === activeCategory) : false;

    if (isGeneralCategory) {
      // Filter general spells by category (excluding Attack spell)
      const categoryGeneralSpells = filteredGeneralSpells.filter(spell =>
        spell.categoryIds && spell.categoryIds.includes(activeCategory)
      );
      spellsToFilter = categoryGeneralSpells;
    } else if (hasActiveCharacter && hasClassSpells) {
      // If we have an active category, show only spells from that category
      if (activeCategory) {
        // Check if this is a class category (starts with "class_")
        const isClassCategory = activeCategory.startsWith('class_');

        if (activeCategory === 'racial_abilities') {
          // Show only racial spells
          const racialSpells = filteredLibrarySpells.filter(spell => {
            const categoryIds = spell.categoryIds || [];
            return isRacialCategory(categoryIds);
          });
          if (racialSpells.length > 0) {
            spellsToFilter = racialSpells;
          } else {
            // Fallback: pull racial spells directly from race data (filter out passives)
            const fallbackRacial = currentRace && currentSubrace
              ? getRacialSpells(currentRace, currentSubrace).filter(spell => !isPassiveStatModifier(spell))
              : [];
            spellsToFilter = fallbackRacial;
          }
        } else if (activeCategory === 'discipline_abilities') {
          // Show only discipline spells
          const disciplineSpells = filteredLibrarySpells.filter(spell => {
            const categoryIds = spell.categoryIds || [];
            return isDisciplineCategory(categoryIds);
          });
          if (disciplineSpells.length > 0) {
            spellsToFilter = disciplineSpells;
          } else {
            // Fallback: pull discipline spells directly from path data
            const fallbackDiscipline = currentPath ? getDisciplineSpells(currentPath) : [];
            spellsToFilter = fallbackDiscipline;
          }
        } else if (isClassCategory) {
          // Get class spells for the selected class, filtered by character level AND known spells
          // Only show spells the character actually knows/selected
          // Use rawClassSpells and filter manually to ensure we get all known spells
          const generalSpellIds = new Set(filteredGeneralSpells.map(spell => spell.id));
          const knownSpellIdsSet = new Set(activeCharKnownSpells);

          // Check if all known spells are in rawClassSpells
          const rawSpellIds = new Set(rawClassSpells.map(s => s.id));
          const missingKnownSpells = activeCharKnownSpells.filter(id => !rawSpellIds.has(id));

          console.log('🔍 [Class Category Filter - Raw Data]', {
            characterClass,
            activeCharacterLevel,
            rawClassSpellsCount: rawClassSpells.length,
            knownSpellIds: activeCharKnownSpells,
            knownSpellIdsSetSize: knownSpellIdsSet.size,
            missingKnownSpells,
            sampleRawSpellIds: rawClassSpells.map(s => s.id).slice(0, 10)
          });

          if (missingKnownSpells.length > 0) {
            console.warn('⚠️ [Class Category Filter] Some known spells are not in rawClassSpells:', missingKnownSpells);
          }

          // Filter class spells by level, known spells, exclude general spells, and exclude unwanted spells
          const levelFilteredClassSpells = rawClassSpells.filter(spell => {
            // Debug logging for known spells
            const isKnown = knownSpellIdsSet.has(spell.id);
            if (isKnown) {
              const spellLevel = spell.level || 1;
              const levelCheck = spellLevel <= activeCharacterLevel;
              const isGeneral = generalSpellIds.has(spell.id);
              const isUniversal = spell.id?.startsWith('universal_');
              const id = spell.id?.toLowerCase() || '';
              const name = spell.name?.toLowerCase() || '';
              const isUnwanted = (
                id === 'universal_attack' ||
                name === 'attack (melee or ranged)' ||
                id.includes('cast_minor') ||
                id.includes('cast_major') ||
                name.includes('cast minor') ||
                name.includes('cast major')
              );

              console.log(`🔍 [Class Category Filter - Spell Filter Check] ${spell.id}`, {
                name: spell.name,
                level: spellLevel,
                activeCharacterLevel,
                isKnown,
                isGeneral,
                isUniversal,
                isUnwanted,
                levelCheck,
                passes: !isGeneral && !isUniversal && !isUnwanted && isKnown && levelCheck
              });
            }

            // Exclude general spells
            if (generalSpellIds.has(spell.id)) {
              return false;
            }
            // Exclude universal spells (especially universal_attack)
            if (spell.id?.startsWith('universal_')) {
              return false;
            }
            // Exclude unwanted spells (Attack, Cast Minor/Major)
            const id = spell.id?.toLowerCase() || '';
            const name = spell.name?.toLowerCase() || '';
            if (
              id === 'universal_attack' ||
              name === 'attack (melee or ranged)' ||
              id.includes('cast_minor') ||
              id.includes('cast_major') ||
              name.includes('cast minor') ||
              name.includes('cast major')
            ) {
              return false;
            }
            // Only show spells the character knows/selected
            if (!knownSpellIdsSet.has(spell.id)) {
              return false;
            }
            // Filter by spell level - only show spells at or below character level
            const spellLevel = spell.level || 1;
            return spellLevel <= activeCharacterLevel;
          });

          console.log('🔍 [Class Category Filter - Filtered]', {
            characterClass,
            activeCharacterLevel,
            levelFilteredCount: levelFilteredClassSpells.length,
            filteredSpellIds: levelFilteredClassSpells.map(s => s.id),
            filteredSpellNames: levelFilteredClassSpells.map(s => s.name)
          });

          spellsToFilter = levelFilteredClassSpells; // Replace, don't add - only show known class spells at appropriate level
        } else {
          // Fallback: Use class-based category (but still include library spells)
          const categoryClassSpells = getSpellsByCategory(activeCategory);
          spellsToFilter = [...spellsToFilter, ...categoryClassSpells];
        }
        // library.spells is already included at the top
      } else {
        // Show all spells from all categories (class + general + library spells for custom spells)
        // BUT only include known class spells, not all class spells
        const allClassSpells = rawClassSpells || [];
        const generalSpellIds = new Set(filteredGeneralSpells.map(spell => spell.id));
        const knownSpellIdsSet = new Set(activeCharKnownSpells);

        // Filter to only known class spells at or below character level
        const knownClassSpells = allClassSpells.filter(spell => {
          // Exclude general spells
          if (generalSpellIds.has(spell.id)) return false;
          // Exclude universal spells
          if (spell.id?.startsWith('universal_')) return false;
          // Exclude unwanted spells
          const id = spell.id?.toLowerCase() || '';
          const name = spell.name?.toLowerCase() || '';
          if (
            id === 'universal_attack' ||
            name === 'attack (melee or ranged)' ||
            id.includes('cast_minor') ||
            id.includes('cast_major') ||
            name.includes('cast minor') ||
            name.includes('cast major')
          ) return false;
          // Only show spells the character knows/selected
          if (!knownSpellIdsSet.has(spell.id)) return false;
          // Filter by spell level
          const spellLevel = spell.level || 1;
          return spellLevel <= activeCharacterLevel;
        });

        // Include only known class spells and general spells (excluding Attack spell)
        spellsToFilter = [...spellsToFilter, ...knownClassSpells, ...filteredGeneralSpells];
      }
    } else if (!isGeneralCategory) {
      // Fall back to traditional library spells + general spells (excluding Attack spell)
      // Only do this if we're not filtering by a general category
      spellsToFilter = [...spellsToFilter, ...filteredGeneralSpells];
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


    // Create a temporary library object for filtering
    const tempLibrary = {
      ...library,
      spells: uniqueSpellsToFilter
    };

    const filtered = filterSpells(tempLibrary, library.filters);
    const sorted = sortSpells(filtered, library.sortOrder);


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
    filteredGeneralSpells,
    characters,
    currentCharacterId,
    activeCharKnownSpells,
    rawClassSpells,
    currentRace,
    currentSubrace,
    currentPath,
    activeChar
  ]);

  // Reset page when category or filters actually change (but not when manually paginating or showing popup)
  useEffect(() => {
    // Only reset if we're not manually paginating AND the values actually changed
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(library.filters);
    const categoryChanged = prevActiveCategoryRef.current !== activeCategory;

    // Check flags FIRST before doing anything
    if (isManuallyPaginatingRef.current || isShowingPopupRef.current) {
      // User is manually changing category/page or showing popup, don't reset - just update refs
      prevFiltersRef.current = library.filters;
      prevActiveCategoryRef.current = activeCategory;
      // Don't clear or reset the timeout - let the button handlers manage it
      return;
    }

    // Only clear timeout if we're not manually paginating
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
      paginationTimeoutRef.current = null;
    }

    if (filtersChanged || categoryChanged) {
      setCurrentPage(1);
    }

    // Update refs
    prevFiltersRef.current = library.filters;
    prevActiveCategoryRef.current = activeCategory;
  }, [activeCategory, library.filters]);


  // Cleanup pagination timeout on unmount
  useEffect(() => {
    return () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, []);


  // Calculate pagination
  const totalPages = Math.ceil(filteredSpells.length / spellsPerPage);

  // Ensure currentPage is within valid bounds
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.max(1, Math.min(currentPage, totalPages));
  }, [currentPage, totalPages]);

  // Update currentPage if it's out of bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedSpells = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * spellsPerPage;
    const endIndex = startIndex + spellsPerPage;
    return filteredSpells.slice(startIndex, endIndex);
  }, [filteredSpells, validCurrentPage, spellsPerPage]);

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
      // Ignore clicks on pagination buttons and their children
      const target = e.target;
      if (
        target.closest('.wow-header-pagination') ||
        target.closest('.wow-header-button') ||
        target.classList.contains('wow-header-button') ||
        target.classList.contains('wow-header-pagination')
      ) {
        return; // Don't interfere with pagination
      }

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
          • Create spells using the <strong>Spell Wizard</strong><br />
          • Download spells from the <strong>Community</strong> tab<br />
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
            {!hasActiveCharacter && characters.length > 0 && (
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
            )}





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
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Set flag BEFORE state updates
                if (paginationTimeoutRef.current) {
                  clearTimeout(paginationTimeoutRef.current);
                }
                isManuallyPaginatingRef.current = true;
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Commit the state change on mouse up
                setActiveCategory(null);
                setCurrentPage(1);
                // Keep flag true for a while to prevent useEffect reset
                paginationTimeoutRef.current = setTimeout(() => {
                  isManuallyPaginatingRef.current = false;
                  paginationTimeoutRef.current = null;
                }, 2000);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Ensure flag is still set and commit state
                if (paginationTimeoutRef.current) {
                  clearTimeout(paginationTimeoutRef.current);
                }
                isManuallyPaginatingRef.current = true;
                setActiveCategory(null);
                setCurrentPage(1);
                // Keep flag true for a while to prevent useEffect reset
                paginationTimeoutRef.current = setTimeout(() => {
                  isManuallyPaginatingRef.current = false;
                  paginationTimeoutRef.current = null;
                }, 2000);
              }}
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
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Set flag BEFORE state updates
                  if (paginationTimeoutRef.current) {
                    clearTimeout(paginationTimeoutRef.current);
                  }
                  isManuallyPaginatingRef.current = true;
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Commit the state change on mouse up
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                  // Keep flag true for a while to prevent useEffect reset
                  paginationTimeoutRef.current = setTimeout(() => {
                    isManuallyPaginatingRef.current = false;
                    paginationTimeoutRef.current = null;
                  }, 2000);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Ensure flag is still set and commit state
                  if (paginationTimeoutRef.current) {
                    clearTimeout(paginationTimeoutRef.current);
                  }
                  isManuallyPaginatingRef.current = true;
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                  // Keep flag true for a while to prevent useEffect reset
                  paginationTimeoutRef.current = setTimeout(() => {
                    isManuallyPaginatingRef.current = false;
                    paginationTimeoutRef.current = null;
                  }, 2000);
                }}
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
            {/* Header with Category Tabs */}
            <div className="wow-spellbook-header">
              {/* Category Tabs */}
              {allSpellCategories.length > 0 ? (
                <div className="wow-category-tabs-header">
                  <button
                    type="button"
                    className={`wow-category-tab ${!activeCategory ? 'active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Set flag BEFORE state updates
                      if (paginationTimeoutRef.current) {
                        clearTimeout(paginationTimeoutRef.current);
                      }
                      isManuallyPaginatingRef.current = true;
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Commit the state change on mouse up
                      setActiveCategory(null);
                      setCurrentPage(1);
                      // Keep flag true for a while to prevent useEffect reset
                      paginationTimeoutRef.current = setTimeout(() => {
                        isManuallyPaginatingRef.current = false;
                        paginationTimeoutRef.current = null;
                      }, 2000);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Ensure flag is still set and commit state
                      if (paginationTimeoutRef.current) {
                        clearTimeout(paginationTimeoutRef.current);
                      }
                      isManuallyPaginatingRef.current = true;
                      setActiveCategory(null);
                      setCurrentPage(1);
                      // Keep flag true for a while to prevent useEffect reset
                      paginationTimeoutRef.current = setTimeout(() => {
                        isManuallyPaginatingRef.current = false;
                        paginationTimeoutRef.current = null;
                      }, 2000);
                    }}
                  >
                    All Spells
                  </button>
                  {allSpellCategories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      className={`wow-category-tab ${activeCategory === category.id ? 'active' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Set flag BEFORE state updates
                        if (paginationTimeoutRef.current) {
                          clearTimeout(paginationTimeoutRef.current);
                        }
                        isManuallyPaginatingRef.current = true;
                      }}
                      onMouseUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Commit the state change on mouse up
                        setActiveCategory(category.id);
                        setCurrentPage(1);
                        // Keep flag true for a while to prevent useEffect reset
                        paginationTimeoutRef.current = setTimeout(() => {
                          isManuallyPaginatingRef.current = false;
                          paginationTimeoutRef.current = null;
                        }, 2000);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Ensure flag is still set and commit state
                        if (paginationTimeoutRef.current) {
                          clearTimeout(paginationTimeoutRef.current);
                        }
                        isManuallyPaginatingRef.current = true;
                        setActiveCategory(category.id);
                        setCurrentPage(1);
                        // Keep flag true for a while to prevent useEffect reset
                        paginationTimeoutRef.current = setTimeout(() => {
                          isManuallyPaginatingRef.current = false;
                          paginationTimeoutRef.current = null;
                        }, 2000);
                      }}
                      title={category.description}
                    >
                      {category.name} ({category.isClassCategory && category.expectedCount !== undefined
                        ? category.expectedCount
                        : category.spells?.length || 0})
                    </button>
                  ))}
                </div>
              ) : (
                <div className="wow-spellbook-title">Spell Library</div>
              )}

              {/* Pagination Controls in Header */}
              {totalPages > 1 && (
                <div
                  className="wow-header-pagination"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="wow-header-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Clear any existing timeout
                      if (paginationTimeoutRef.current) {
                        clearTimeout(paginationTimeoutRef.current);
                      }
                      isManuallyPaginatingRef.current = true;
                      const newPage = Math.max(1, validCurrentPage - 1);
                      if (newPage !== validCurrentPage) {
                        setCurrentPage(newPage);
                        // Keep flag true for a while
                        paginationTimeoutRef.current = setTimeout(() => {
                          isManuallyPaginatingRef.current = false;
                          paginationTimeoutRef.current = null;
                        }, 1000);
                      }
                    }}
                    disabled={validCurrentPage <= 1}
                    aria-label="Previous Page"
                    title="Previous Page"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="wow-page-info-header">
                    Page {validCurrentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="wow-header-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Clear any existing timeout
                      if (paginationTimeoutRef.current) {
                        clearTimeout(paginationTimeoutRef.current);
                      }
                      isManuallyPaginatingRef.current = true;
                      const newPage = Math.min(totalPages, validCurrentPage + 1);
                      if (newPage !== validCurrentPage) {
                        setCurrentPage(newPage);
                        // Keep flag true for a while
                        paginationTimeoutRef.current = setTimeout(() => {
                          isManuallyPaginatingRef.current = false;
                          paginationTimeoutRef.current = null;
                        }, 1000);
                      }
                    }}
                    disabled={validCurrentPage >= totalPages}
                    aria-label="Next Page"
                    title="Next Page"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>

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
                      className="wow-spell-row"
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
                      onMouseDown={(e) => {
                        // Only handle right-click for context menu
                        if (e.button === 2) {
                          handleSpellContextMenu(e, spell.id);
                        } else if (e.button === 0) {
                          // Track mouse down position for left click
                          e.currentTarget.dataset.mouseDownX = e.clientX;
                          e.currentTarget.dataset.mouseDownY = e.clientY;
                          e.currentTarget.dataset.mouseDownTime = Date.now();
                        }
                      }}
                      onMouseUp={(e) => {
                        // Handle left-click to show popup (only if it wasn't a drag)
                        if (e.button === 0) {
                          const mouseDownX = parseFloat(e.currentTarget.dataset.mouseDownX || '0');
                          const mouseDownY = parseFloat(e.currentTarget.dataset.mouseDownY || '0');
                          const mouseDownTime = parseInt(e.currentTarget.dataset.mouseDownTime || '0');
                          const mouseMoveDistance = Math.sqrt(
                            Math.pow(e.clientX - mouseDownX, 2) + Math.pow(e.clientY - mouseDownY, 2)
                          );
                          const timeDiff = Date.now() - mouseDownTime;

                          // Only show popup if it was a click (not a drag) - small movement and quick
                          if (mouseMoveDistance < 5 && timeDiff < 300) {
                            e.preventDefault();
                            e.stopPropagation();
                            // Set flag IMMEDIATELY and synchronously to prevent page reset
                            isShowingPopupRef.current = true;
                            // Set state immediately - the flag is already set
                            setSelectedSpell(spell);
                          }
                        }
                      }}
                      onClick={(e) => {
                        // Fallback: if mouseUp didn't fire for some reason
                        e.preventDefault();
                        e.stopPropagation();
                        // Set flag IMMEDIATELY and synchronously to prevent page reset
                        isShowingPopupRef.current = true;
                        // Set state immediately - the flag is already set
                        setSelectedSpell(spell);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="wow-spell-icon">
                        <img
                          src={getSpellIconUrl(spell)}
                          alt={spell.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
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

      {/* Spell Popup Modal - Shows full spell card on click */}
      {selectedSpell && ReactDOM.createPortal(
        <div
          className="spellbook-popup-overlay"
          onClick={() => {
            isShowingPopupRef.current = false;
            setSelectedSpell(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            cursor: 'pointer',
            margin: 0,
            padding: 0
          }}
        >
          <div
            className="spellbook-popup-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '20px',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              cursor: 'default'
            }}
          >
            <UnifiedSpellCard
              spell={mapSpellToUnifiedFormat(selectedSpell)}
              variant="wizard"
              showActions={false}
              showDescription={true}
              showStats={true}
              showTags={true}
              rollableTableData={getSpellRollableTable(selectedSpell)}
            />
          </div>
        </div>,
        document.body
      )}


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