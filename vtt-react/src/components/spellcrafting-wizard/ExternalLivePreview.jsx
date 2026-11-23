import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSpellWizardState, useSpellWizardDispatch } from './context/spellWizardContext';
import { useSpellLibrary, useSpellLibraryDispatch } from './context/SpellLibraryContext';
import { useClassSpellLibrary } from '../../hooks/useClassSpellLibrary';
import SpellCardWithProcs from './components/common/SpellCardWithProcs';
import { draftSubject } from './utils/executionCompatibility';
import { executeCanonicalSpellSave } from './utils/canonicalSpellSave';
import useSpellbookStore from '../../store/spellbookStore';
import useSettingsStore from '../../store/settingsStore';
import useAuthStore from '../../store/authStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import './styles/ExternalLivePreview.css';

export const PREVIEW_WIDTH = 340;
export const PREVIEW_EDGE_MARGIN = 12;
export const PREVIEW_WINDOW_GAP = 24;
export const DOCK_BAR_HEIGHT = 32;
export const DOCK_EDGE_OFFSET = 2;

export function computeExternalPreviewLayout({
  viewportWidth,
  viewportHeight,
  windowPosition,
  windowSize,
  windowScale = 1,
  measuredSpellbookRect = null
}) {
  const vw = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : 1024;
  const vh = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 768;
  const scale = Number.isFinite(windowScale) && windowScale > 0 ? windowScale : 1;

  const hasMeasuredRect = measuredSpellbookRect
    && Number.isFinite(measuredSpellbookRect.width)
    && Number.isFinite(measuredSpellbookRect.height)
    && measuredSpellbookRect.width > 0
    && measuredSpellbookRect.height > 0;

  const rawWidth = windowSize?.width || 1000;
  const rawHeight = windowSize?.height || 700;
  const spellbookWidth = hasMeasuredRect
    ? measuredSpellbookRect.width
    : rawWidth * scale;
  const spellbookHeight = hasMeasuredRect
    ? measuredSpellbookRect.height
    : rawHeight * scale;
  const spellbookX = hasMeasuredRect
    ? measuredSpellbookRect.left
    : (typeof windowPosition?.x === 'number'
      ? windowPosition.x
      : Math.max(0, (vw - rawWidth) / 2));
  const spellbookY = hasMeasuredRect
    ? measuredSpellbookRect.top
    : (typeof windowPosition?.y === 'number'
      ? windowPosition.y
      : Math.max(0, (vh - rawHeight) / 2));
  const spellbookRight = spellbookX + spellbookWidth;
  const spellbookBottom = spellbookY + spellbookHeight;

  const scaledPreviewW = PREVIEW_WIDTH * scale;
  const rightSideLeft = spellbookRight + PREVIEW_WINDOW_GAP;
  const leftSideLeft = spellbookX - scaledPreviewW - PREVIEW_WINDOW_GAP;

  const fitsRight = (rightSideLeft + scaledPreviewW) <= (vw - PREVIEW_EDGE_MARGIN);
  const fitsLeft = leftSideLeft >= PREVIEW_EDGE_MARGIN;
  const canFloatBeside = fitsRight || fitsLeft;

  const spellbookRect = {
    left: spellbookX,
    top: spellbookY,
    right: spellbookRight,
    bottom: spellbookBottom,
    width: spellbookWidth,
    height: spellbookHeight
  };

  if (canFloatBeside) {
    const side = fitsRight ? 'right' : 'left';
    const left = fitsRight ? rightSideLeft : leftSideLeft;
    const maxTop = Math.max(PREVIEW_EDGE_MARGIN, vh - 420);
    const top = Math.max(PREVIEW_EDGE_MARGIN, Math.min(spellbookY + 60, maxTop));

    return {
      mode: 'floating',
      canFloatBeside: true,
      side,
      dockEdge: null,
      left,
      top,
      right: null,
      bottom: null,
      width: PREVIEW_WIDTH,
      maxCardHeight: Math.max(260, vh - top - 108),
      procPosition: side,
      spellbookRect
    };
  }

  // No room beside the Spellbook without covering the Wizard editor (e.g. 1024x768).
  // Dock to the outer viewport edge outside the Spellbook footprint and collapse by default.
  const spaceBelow = vh - spellbookBottom;
  const spaceAbove = spellbookY;
  const dockEdge = (spaceBelow < DOCK_BAR_HEIGHT + DOCK_EDGE_OFFSET && spaceAbove >= DOCK_BAR_HEIGHT + DOCK_EDGE_OFFSET)
    ? 'top'
    : 'bottom';
  const dockedWidth = Math.min(PREVIEW_WIDTH, Math.max(260, vw - PREVIEW_EDGE_MARGIN * 2));

  return {
    mode: 'docked',
    canFloatBeside: false,
    side: 'docked',
    dockEdge,
    left: null,
    top: dockEdge === 'top' ? DOCK_EDGE_OFFSET : null,
    right: PREVIEW_EDGE_MARGIN,
    bottom: dockEdge === 'bottom' ? DOCK_EDGE_OFFSET : null,
    width: dockedWidth,
    maxCardHeight: Math.max(220, vh - DOCK_BAR_HEIGHT - 84),
    procPosition: 'below',
    spellbookRect
  };
}

// External Live Preview Component that renders outside any window
const ExternalLivePreview = () => {
  const state = useSpellWizardState();
  const wizardDispatch = useSpellWizardDispatch();
  const library = useSpellLibrary();
  const libraryDispatch = useSpellLibraryDispatch();
  const { addCustomSpell } = useClassSpellLibrary();
  const { activeTab, windowPosition, windowSize } = useSpellbookStore();
  const windowScale = useSettingsStore(state => state.windowScale);
  const { user } = useAuthStore();
  const registeredWindows = useWindowManagerStore(s => s.windows);

  const isEditing = Boolean(state.editMode && state.editingSpellId);
  const editingSpellId = state.editingSpellId;

  // State for completion feedback
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // Reactive viewport tracking for responsive docking/floating layout
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  }));
  const [measuredSpellbookRect, setMeasuredSpellbookRect] = useState(null);
  const [toggleState, setToggleState] = useState({ forCanFloat: null, expanded: null });
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      setViewport(prev => (
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      ));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab !== 'wizard' || typeof document === 'undefined') {
      setMeasuredSpellbookRect(prev => (prev === null ? prev : null));
      return undefined;
    }
    const el = document.querySelector('.wow-window[aria-label="Spellbook"]');
    if (!el || typeof el.getBoundingClientRect !== 'function') {
      setMeasuredSpellbookRect(prev => (prev === null ? prev : null));
      return undefined;
    }
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nextRect = {
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
        setMeasuredSpellbookRect(prev => (
          prev
          && prev.left === nextRect.left
          && prev.top === nextRect.top
          && prev.width === nextRect.width
          && prev.height === nextRect.height
            ? prev
            : nextRect
        ));
      } else {
        setMeasuredSpellbookRect(prev => (prev === null ? prev : null));
      }
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }
    return undefined;
  }, [activeTab, viewport.width, viewport.height, windowPosition?.x, windowPosition?.y, windowSize?.width, windowSize?.height, windowScale]);

  // Only show when the wizard tab is active
  if (activeTab !== 'wizard') {
    return null;
  }

  // Handle spell completion via the canonical save path
  const handleCompleteSpell = async () => {
    setIsCompleting(true);
    setCompletionMessage('');

    try {
      const result = await executeCanonicalSpellSave({
        wizardState: state,
        isEditing,
        editingSpellId,
        library,
        libraryDispatch,
        wizardDispatch,
        addCustomSpell,
        user
      });

      if (!result.ok) {
        setCompletionMessage(result.error || 'Please enter a spell name before completing.');
        setTimeout(() => setCompletionMessage(''), 3000);
        return;
      }

      const noun = result.mode === 'update' ? 'updated in' : 'added to';
      if (user?.uid && !user?.isGuest) {
        if (result.cloudResult?.success) {
          setCompletionMessage(`✓ Spell ${noun} library and saved to your account!`);
        } else if (result.cloudResult?.localOnly) {
          setCompletionMessage(`✓ Spell ${noun} library (will sync when online)`);
        } else {
          setCompletionMessage(`✓ Spell ${noun} library!`);
        }
      } else {
        setCompletionMessage(
          result.mode === 'update'
            ? '✓ Spell updated in library!'
            : '✓ Spell added to library! (Login to save to your account)'
        );
      }

      // Clear the message after 3 seconds
      setTimeout(() => setCompletionMessage(''), 3000);

    } catch (error) {
      console.error('Error completing spell:', error);
      setCompletionMessage('� -  Failed to complete spell. Please try again.');
      setTimeout(() => setCompletionMessage(''), 3000);
    } finally {
      setIsCompleting(false);
    }
  };

  // Compute responsive layout: float beside Spellbook on wide viewports; dock and collapse
  // at narrow viewports (such as 1024x768) so the floating preview never covers the Wizard.
  const safeScale = (typeof windowScale === 'number' && windowScale > 0) ? windowScale : 1;
  const layout = computeExternalPreviewLayout({
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    windowPosition,
    windowSize,
    windowScale: safeScale,
    measuredSpellbookRect
  });

  const isDocked = layout.mode === 'docked';
  const dockBarAtBottom = isDocked && layout.dockEdge === 'bottom';
  const isExpanded = (toggleState.forCanFloat === layout.canFloatBeside && toggleState.expanded !== null)
    ? toggleState.expanded
    : layout.canFloatBeside;

  const handleTogglePreview = () => {
    setToggleState({
      forCanFloat: layout.canFloatBeside,
      expanded: !isExpanded
    });
  };

  // Stay above regular windows (1000+) while staying strictly below MythrillWindow
  // modals (2000+) and modal backdrops (1999+) so dialogs like Save Entry stay unobstructed.
  let maxRegularWindowZ = 1000;
  if (registeredWindows && typeof registeredWindows.forEach === 'function') {
    registeredWindows.forEach((win) => {
      if (win && win.type !== 'modal' && typeof win.zIndex === 'number' && win.zIndex > maxRegularWindowZ) {
        maxRegularWindowZ = win.zIndex;
      }
    });
  }
  const previewZIndex = Math.min(1985, Math.max(1500, maxRegularWindowZ + 1));

  const position = isDocked
    ? {
        position: 'fixed',
        right: `${layout.right}px`,
        ...(layout.dockEdge === 'top'
          ? { top: `${layout.top}px` }
          : { bottom: `${layout.bottom}px` }),
        zIndex: previewZIndex,
        width: isExpanded ? `${layout.width}px` : 'auto',
        maxHeight: isExpanded ? `${Math.max(260, viewport.height - 16)}px` : `${DOCK_BAR_HEIGHT}px`,
        overflow: 'visible',
        ...(isExpanded && safeScale !== 1
          ? {
              transform: `scale(${safeScale})`,
              transformOrigin: layout.dockEdge === 'top' ? 'top right' : 'bottom right'
            }
          : {})
      }
    : {
        position: 'fixed',
        left: `${layout.left}px`,
        top: `${layout.top}px`,
        zIndex: previewZIndex,
        width: isExpanded ? `${layout.width}px` : 'auto',
        maxHeight: 'none',
        overflow: 'visible',
        ...(isExpanded && safeScale !== 1
          ? {
              transform: `scale(${safeScale})`,
              transformOrigin: 'top left'
            }
          : {})
      };



  // Create live preview spell data using the SAME transformation as Step10Review
  const createPreviewSpell = () => {
    try {
      // Use the same mapping function as Step10Review for consistency
      const previewSpell = mapWizardStateToPreviewState(state);

      // Debug logging for card/coin configurations and resolution method changes (commented out to avoid browser issues)
      // console.log('ExternalLivePreview Debug - Resolution Method Update:', {
      //   spellName: previewSpell.name,
      //   resolution: previewSpell.resolution,
      //   cardConfig: previewSpell.cardConfig,
      //   coinConfig: previewSpell.coinConfig,
      //   damageConfig: previewSpell.damageConfig,
      //   chanceOnHitConfig: previewSpell.chanceOnHitConfig,
      //   criticalConfig: previewSpell.criticalConfig,
      //   lastModified: state.lastModified,
      //   state: {
      //     damageConfig: state.damageConfig,
      //     healingConfig: state.healingConfig
      //   }
      // });

      return previewSpell;
    } catch (error) {
      console.warn('Error creating preview spell:', error);
      const fallbackSpell = {
        name: state.name || 'Unnamed Spell',
        description: state.description || 'No description yet...',
        level: state.level || 1,
        school: state.school || 'Arcane',
        spellType: state.spellType || 'Action',
        icon: state.typeConfig?.icon || 'inv_misc_questionmark'
      };
      return fallbackSpell;
    }
  };

  // Map wizard state to preview state (same as Step10Review)
  const mapWizardStateToPreviewState = (spellState) => {
    // Extract icon from spell state
    const extractSpellIcon = (state) => {
      return state.typeConfig?.icon || 'inv_misc_questionmark';
    };

    const formatCastTime = (state) => {
      if (!state) return 'Instant';

      // Handle different casting time formats
      if (state.actionType === 'channeled') return 'Channeled';
      if (state.spellType === 'reaction') return 'Reaction';
      if (state.spellType === 'ritual') return 'Ritual';
      if (state.spellType === 'passive') return 'Passive';

      const castTime = state.castTime ||
        state.castingTime ||
        (state.castingConfig && state.castingConfig.castTime) ||
        (state.typeConfig && state.typeConfig.castTime) ||
        'Instant';

      return castTime;
    };

    const icon = spellState.typeConfig?.icon || extractSpellIcon(spellState) || 'inv_misc_questionmark';

    // Determine damage types - SAME LOGIC AS STEP10REVIEW
    const damageTypes = [];

    // First check if we have a primary type selected in Step 1
    if (spellState.typeConfig?.school) {
      damageTypes.push(spellState.typeConfig.school);
    }

    // Check for secondary type in Step 1
    if (spellState.typeConfig?.secondaryElement) {
      damageTypes.push(spellState.typeConfig.secondaryElement);
    }

    // If no types are set in Step 1, check damage config
    if (damageTypes.length === 0 && spellState.damageConfig?.damageType) {
      // For direct damage
      if (spellState.damageConfig.damageType === 'direct' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For DoT damage
      else if (spellState.damageConfig.damageType === 'dot' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For combined damage (direct + DoT)
      else if (spellState.damageConfig.hasDotEffect && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // Fallback if elementType is not set
      else if (spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
    }

    // Create a properly structured spell object for the unified card
    return {
      // Basic Information
      id: 'preview',
      name: spellState.name || 'Unnamed Spell',
      description: spellState.description || '',
      level: spellState.level || 1,
      icon: icon,
      spellType: spellState.spellType || 'ACTION',
      effectType: spellState.effectTypes && spellState.effectTypes.length > 0 ? spellState.effectTypes[0] : 'utility',
      effectTypes: spellState.effectTypes || [],

      // Type configuration
      typeConfig: spellState.typeConfig || {},

      // Casting information
      castTime: formatCastTime(spellState),
      // Format range based on rangeType first, then fall back to rangeDistance
      range: (() => {
        const rangeType = spellState.targetingConfig?.rangeType;
        const rangeDistance = spellState.targetingConfig?.rangeDistance;
        if (rangeType === 'touch') return 'Touch';
        if (rangeType === 'sight') return 'Sight';
        if (rangeType === 'unlimited') return 'Unlimited';
        if (rangeType === 'self_centered' || spellState.targetingConfig?.targetingType === 'self') return 'Self';
        if (Number.isSafeInteger(rangeDistance) && rangeDistance >= 0) return `${rangeDistance} ft`;
        return 'Range unset';
      })(),
      rangeType: spellState.targetingConfig?.rangeType || 'ranged',

      // Targeting information - NOTE: targetingMode is the mode ('unified' or 'effect'), not the targeting type
      // This was incorrectly set to targetingType before - keeping for backward compatibility but will be overridden below
      targetRestriction: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
        spellState.targetingConfig.targetRestrictions[0] :
        spellState.targetingConfig?.targetRestriction || null,
      targetRestrictions: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
        spellState.targetingConfig.targetRestrictions :
        spellState.targetingConfig?.targetRestriction ? [spellState.targetingConfig.targetRestriction] : [],
      maxTargets: spellState.targetingConfig?.maxTargets || 1,
      selectionMethod: spellState.targetingConfig?.selectionMethod ||
        spellState.targetingConfig?.targetSelectionMethod || 'manual',
      targetSelectionMethod: spellState.targetingConfig?.targetSelectionMethod ||
        spellState.targetingConfig?.selectionMethod || 'manual',
      rangeDistance: spellState.targetingConfig?.rangeDistance,

      // AOE information
      aoeShape: spellState.targetingConfig?.aoeShape || 'circle',
      aoeSize: spellState.targetingConfig?.aoeParameters?.radius ||
        spellState.targetingConfig?.aoeParameters?.size ||
        spellState.targetingConfig?.aoeParameters?.length || 20,
      aoeParameters: spellState.targetingConfig?.aoeParameters || {},
      movementBehavior: spellState.targetingConfig?.movementBehavior || 'static',
      // Ensure targetingConfig includes aoeType and all fields
      targetingConfig: {
        ...spellState.targetingConfig,
        aoeType: spellState.targetingConfig?.aoeType || spellState.targetingConfig?.aoeShape || 'sphere',
        targetingType: spellState.targetingConfig?.targetingType || 'single',
        rangeType: spellState.targetingConfig?.rangeType || 'ranged',
        rangeDistance: spellState.targetingConfig?.rangeDistance
      } || {},
      // CRITICAL: Include targetingMode and effectTargeting for effect-specific targeting
      targetingMode: spellState.targetingMode || 'unified',
      effectTargeting: spellState.effectTargeting || {},

      // Damage/Healing information
      primaryDamage: spellState.damageConfig ? {
        dice: spellState.damageConfig.formula ||
          spellState.damageConfig.diceNotation ||
          spellState.effectResolutions?.damage?.config?.formula ||
          '6d6',
        flat: spellState.damageConfig.flatBonus || 0,
        type: spellState.damageConfig.elementType || spellState.typeConfig?.school || 'arcane'
      } : null,

      // Damage types - CRITICAL: Use the same logic as Step10Review
      damageTypes: damageTypes.length > 0 ? damageTypes : ['arcane'],

      // Damage config
      damageConfig: {
        ...spellState.damageConfig,
        // Maintain backward compatibility with old structure
        savingThrow: spellState.damageConfig?.savingThrow || null,
        savingThrowType: spellState.damageConfig?.savingThrowType || 'agility',
        difficultyClass: spellState.damageConfig?.difficultyClass || 15,
        partialEffect: spellState.damageConfig?.partialEffect || false,
        partialEffectFormula: spellState.damageConfig?.partialEffectFormula || 'damage/2',
        partialEffectType: spellState.damageConfig?.partialEffectType || 'half',
        directDamageFormula: spellState.damageConfig?.directDamageFormula || 'damage/2',
        dotDamageFormula: spellState.damageConfig?.dotDamageFormula || 'dot_damage/2',
        // Include the new savingThrowConfig structure for UnifiedSpellCard
        savingThrowConfig: spellState.damageConfig?.savingThrowConfig || (
          spellState.damageConfig?.savingThrow ? {
            enabled: true,
            savingThrowType: spellState.damageConfig.savingThrowType || 'agility',
            difficultyClass: spellState.damageConfig.difficultyClass || 15,
            partialEffect: spellState.damageConfig.partialEffect || false,
            partialEffectFormula: spellState.damageConfig.partialEffectFormula || 'damage/2'
          } : null
        ),
        // Include chance on hit and critical hit configurations
        chanceOnHitConfig: spellState.damageConfig?.chanceOnHitConfig || null,
        criticalConfig: spellState.damageConfig?.criticalConfig || null,
      },

      // Chance on Hit Configuration (also at top level for easier access)
      chanceOnHitConfig: spellState.damageConfig?.chanceOnHitConfig || null,

      // Critical Hit Configuration (also at top level for easier access)
      criticalConfig: spellState.damageConfig?.criticalConfig || null,

      // Healing configuration
      healingConfig: spellState.healingConfig || null,

      // Buff configuration
      buffConfig: spellState.buffConfig || null,

      // Debuff configuration
      debuffConfig: spellState.debuffConfig || null,

      // Utility and Control configurations
      utilityConfig: spellState.utilityConfig || null,
      controlConfig: spellState.controlConfig || null,

      // Summoning configuration
      summonConfig: spellState.summoningConfig || null,
      summoningConfig: spellState.summoningConfig || null, // Also provide as summoningConfig for compatibility

      // Resolution type - include PROPHECY when prophecyOptions are configured and enabled
      resolution: (spellState.prophecyOptions && spellState.prophecyOptions.enabled !== false) ? 'PROPHECY' : (spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE'),

      // Card configuration for card-based spells - ensure proper fallback when switching resolution methods
      cardConfig: (() => {
        const resolution = spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE';
        if (resolution === 'CARDS') {
          return spellState.damageConfig?.cardConfig || spellState.healingConfig?.cardConfig || {
            drawCount: 3,
            formula: 'CARD_VALUE + POKER_HAND_RANK * 3'
          };
        }
        // Always provide cardConfig even for non-card resolutions for consistency
        return spellState.damageConfig?.cardConfig || spellState.healingConfig?.cardConfig || {
          drawCount: 3,
          formula: 'CARD_VALUE + POKER_HAND_RANK * 3'
        };
      })(),

      // Coin configuration for coin-based spells - ensure proper fallback when switching resolution methods
      coinConfig: (() => {
        const resolution = spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE';
        if (resolution === 'COINS') {
          return spellState.damageConfig?.coinConfig || spellState.healingConfig?.coinConfig || {
            flipCount: 4,
            formula: 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
          };
        }
        // Always provide coinConfig even for non-coin resolutions for consistency
        return spellState.damageConfig?.coinConfig || spellState.healingConfig?.coinConfig || {
          flipCount: 4,
          formula: 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
        };
      })(),

      // School from typeConfig
      school: spellState.typeConfig?.school || 'Arcane',

      // Element type - check both typeConfig (Step 1) and damageConfig (damage effects)
      elementType: spellState.damageConfig?.elementType || spellState.typeConfig?.school,

      // Damage types array - check both Step 1 (typeConfig) and damage effects (damageConfig)
      damageTypes: (() => {
        const types = [];

        // Priority 1: Check damageConfig (from damage effects step)
        if (spellState.damageConfig?.elementType) {
          types.push(spellState.damageConfig.elementType);
        }
        if (spellState.damageConfig?.secondaryElementType) {
          types.push(spellState.damageConfig.secondaryElementType);
        }

        // Priority 2: If no damageConfig types, check typeConfig (from Step 1)
        if (types.length === 0) {
          if (spellState.typeConfig?.school) {
            types.push(spellState.typeConfig.school);
          }
          if (spellState.typeConfig?.secondaryElement) {
            types.push(spellState.typeConfig.secondaryElement);
          }
        }

        return types;
      })(),

      // Tags - combine from multiple sources like Step 10 Review does
      tags: [
        ...(spellState.typeConfig?.tags || []),
        ...(spellState.effectTypes || []),
        ...(spellState.tags || [])
      ].filter(Boolean),
      effectTypes: spellState.effectTypes || [],

      // Prophecy configuration (Harbinger) - same transformation as Step10Review
      prophecyConfig: (spellState.prophecyOptions && spellState.prophecyOptions.enabled !== false) ? (() => {
        const po = spellState.prophecyOptions;
        const parseRangeDice = (dice) => {
          if (Array.isArray(dice)) return dice;
          if (typeof dice === 'string' && dice.includes('+')) return dice.split('+').map(d => d.trim());
          return Array.isArray(dice) ? dice : [dice];
        };
        const buildEffect = (outcome) => {
          if (!outcome) return undefined;
          if (outcome.effectName) {
            const effect = { name: outcome.effectName };
            if (outcome.duration > 0) effect.duration = outcome.duration;
            if (outcome.durationUnit && outcome.durationUnit !== 'rounds') effect.unit = outcome.durationUnit;
            if (outcome.damagePerRound) {
              effect.damagePerRound = outcome.damagePerRound;
              if (outcome.damagePerRoundType) effect.damageType = outcome.damagePerRoundType;
            }
            if (outcome.statModifiers && outcome.statModifiers.length > 0) {
              effect.statModifiers = outcome.statModifiers;
            }
            if (outcome.healingBlock) effect.healingBlock = true;
            if (outcome.bonusDamageTaken) {
              effect.bonusDamageTaken = outcome.bonusDamageTaken;
              if (outcome.bonusDamageType) effect.bonusDamageType = outcome.bonusDamageType;
            }
            if (outcome.saveDC > 0) {
              effect.saveDC = outcome.saveDC;
              if (outcome.saveType) effect.saveType = outcome.saveType;
            }
            if (outcome.instantKill) effect.instantKill = true;
            if (outcome.instantKillThreshold > 0) effect.instantKillThreshold = outcome.instantKillThreshold;
            if (outcome.cascadeDamage) {
              effect.cascadeDamage = outcome.cascadeDamage;
              effect.cascadeRange = outcome.cascadeRange || 10;
            }
            if (outcome.description) effect.description = outcome.description;
            return effect;
          }
          return undefined;
        };
        const buildOutcome = (outcome) => {
          if (!outcome) return undefined;
          const result = {};
          if (outcome.damage) result.damage = outcome.damage;
          const effect = buildEffect(outcome);
          if (effect) result.effect = effect;
          if (outcome.havocGain !== undefined) result.havocGain = outcome.havocGain;
          if (outcome.description) result.description = outcome.description;
          return result;
        };
        return {
          rangeDice: parseRangeDice(po.rangeDice),
          resolutionDie: po.resolutionDie,
          prophesied: buildOutcome(po.prophesied) || { havocGain: po.prophesied?.havocGain || 3 },
          base: buildOutcome(po.base) || { havocGain: po.base?.havocGain || 1 },
          outside: (() => {
            const o = po.outside || {};
            const result = {};
            if (o.backlash) result.backlash = o.backlash;
            if (o.havocGain !== undefined) result.havocGain = o.havocGain;
            if (o.description) result.description = o.description;
            return result;
          })()
        };
      })() : null,

      // Resource costs
      resourceConfig: spellState.resourceConfig || null,
      resourceCost: spellState.resourceCost || null,
      manaCost: (() => {
        const candidates = [
          spellState.resourceCost?.resourceValues?.mana,
          spellState.resourceCost?.mana,
          spellState.resourceConfig?.resourceAmount
        ];
        const explicit = candidates.find(v => v !== undefined && v !== null && v !== '' && !(typeof v === 'number' && Number.isNaN(v)));
        if (explicit !== undefined) return explicit;
        return spellState.resourceCost?.resourceTypes ? undefined : 25;
      })(),

      // Pyrofiend Inferno Veil costs - extract from resourceCost.resourceValues
      infernoRequired: spellState.resourceCost?.resourceValues?.inferno_required || 0,
      infernoAscend: spellState.resourceCost?.resourceValues?.inferno_ascend || 0,
      infernoDescend: spellState.resourceCost?.resourceValues?.inferno_descend || 0,

      // Utility configuration
      utilityConfig: spellState.utilityConfig || null,

      // Control configuration
      controlConfig: spellState.controlConfig || null,

      // Summoning configuration
      summonConfig: spellState.summoningConfig || null,
      summoningConfig: spellState.summoningConfig || null,

      // Transformation configuration
      transformConfig: spellState.transformationConfig || null,
      transformationConfig: spellState.transformationConfig || null,

      // Purification configuration
      purificationConfig: spellState.purificationConfig || null,

      // Restoration configuration
      restorationConfig: spellState.restorationConfig || null,

      // Trigger configuration
      triggerConfig: spellState.triggerConfig || null,

      // Trap configuration
      trapConfig: spellState.trapConfig || null,

      // Channeling configuration
      channelingConfig: spellState.channelingConfig || null,

      // Propagation configuration
      propagation: spellState.propagation || {
        method: 'none',
        behavior: '',
        parameters: {}
      },

      // Cooldown configuration
      cooldownConfig: spellState.cooldownConfig || null,

      // Duration configuration (synced from buff/debuff effects)
      durationConfig: spellState.durationConfig || null,
      durationType: spellState.durationConfig?.durationType || spellState.buffConfig?.durationType || spellState.debuffConfig?.durationType,
      durationValue: spellState.durationConfig?.durationValue || spellState.buffConfig?.durationValue || spellState.debuffConfig?.durationValue,

      // Rollable table configuration
      rollableTable: (spellState.rollableTable && spellState.rollableTable.enabled !== false) ? spellState.rollableTable : null,

      // Mechanics configuration
      effectMechanicsConfigs: spellState.effectMechanicsConfigs || {},
      mechanicsConfig: (() => {
        if (!spellState.mechanicsConfig) return null;
        if (Array.isArray(spellState.mechanicsConfig)) {
          let list = spellState.mechanicsConfig;
          if (!spellState.prophecyOptions || spellState.prophecyOptions.enabled === false) {
            list = list.filter(m => m.system !== 'PROPHECY' && m.system !== 'PROPHECY_SYSTEM');
          }
          return list;
        }
        if (typeof spellState.mechanicsConfig === 'object') {
          if (!spellState.prophecyOptions || spellState.prophecyOptions.enabled === false) {
            const { prophecy, ...rest } = spellState.mechanicsConfig;
            return rest;
          }
          return spellState.mechanicsConfig;
        }
        return spellState.mechanicsConfig;
      })(),

      // Spell library for proc system and other mechanics
      library: library,

      // Rarity
      rarity: spellState.rarity || 'uncommon'
    };
  };



  const cardRegionId = 'external-live-preview-card-region';
  const previewTitle = (state.name && state.name.trim()) ? state.name.trim() : 'Unnamed Spell';

  const lastModifiedTimestamp = state.lastModified instanceof Date
    ? state.lastModified.getTime()
    : (typeof state.lastModified === 'number'
      ? state.lastModified
      : (state.lastModified ? new Date(state.lastModified).getTime() : 0));

  const renderCompleteButton = (compact = false) => (
    <button
      type="button"
      className={compact ? 'adventurer-action external-live-preview-action--compact' : 'adventurer-action'}
      onClick={handleCompleteSpell}
      disabled={isCompleting}
      title={isEditing ? 'Finalize & Update Spell' : 'Complete Spell'}
    >
      {isCompleting
        ? (isEditing ? 'Updating Spell...' : 'Completing Spell...')
        : (isEditing ? '✓ Update Spell' : '✓ Complete Spell')}
    </button>
  );

  const completionBanner = completionMessage ? (
    <div
      className={`external-live-preview-message ${
        completionMessage.includes('✓')
          ? 'external-live-preview-message--success'
          : 'external-live-preview-message--error'
      }`}
      role="status"
    >
      {completionMessage}
    </div>
  ) : null;

  const cardRegion = (
    <div
      id={cardRegionId}
      className={`external-live-preview-card-region${isExpanded ? '' : ' external-live-preview-card-region--hidden'}`}
      hidden={!isExpanded}
      style={isExpanded && isDocked ? { maxHeight: `${layout.maxCardHeight}px` } : undefined}
    >
      <SpellCardWithProcs
        key={`preview-${lastModifiedTimestamp}`}
        spell={createPreviewSpell()}
        behaviorRecord={draftSubject(state)}
        variant="wizard"
        showActions={false}
        showDescription={true}
        showStats={true}
        showTags={true}
        rollableTableData={state.rollableTable}
        procPosition={layout.procPosition}
        showProcs={true}
        style={{
          border: 'none',
          outline: 'none'
        }}
      />
    </div>
  );

  const handlePreviewKeyDown = (event) => {
    if (event.key === 'Escape' && isDocked && isExpanded) {
      event.stopPropagation();
      event.preventDefault();
      setToggleState({
        forCanFloat: layout.canFloatBeside,
        expanded: false
      });
      if (toggleButtonRef.current && typeof toggleButtonRef.current.focus === 'function') {
        toggleButtonRef.current.focus();
      }
    }
  };

  const controlBar = (
    <div className="external-live-preview-bar">
      <div className="external-live-preview-bar-label">
        <span className="external-live-preview-heading">Live Preview</span>
        {!isExpanded && (
          <span className="external-live-preview-spell-name" title={previewTitle}>
            {previewTitle}
          </span>
        )}
      </div>
      <div className="external-live-preview-bar-controls">
        {!isExpanded && renderCompleteButton(true)}
        <button
          ref={toggleButtonRef}
          type="button"
          className="external-live-preview-toggle"
          onClick={handleTogglePreview}
          aria-expanded={isExpanded}
          aria-controls={cardRegionId}
          title={isExpanded ? 'Collapse live spell preview' : 'Show live spell preview'}
        >
          <span>{isExpanded ? 'Hide Preview' : 'Show Preview'}</span>
          <span className="external-live-preview-chevron" aria-hidden="true">
            {dockBarAtBottom ? (isExpanded ? '▼' : '▲') : (isExpanded ? '▲' : '▼')}
          </span>
        </button>
      </div>
    </div>
  );

  const rootClassName = [
    'adventurer-preview',
    'external-live-preview',
    `external-live-preview--${layout.mode}`,
    isExpanded ? 'external-live-preview--expanded' : 'external-live-preview--collapsed',
    layout.dockEdge ? `external-live-preview--dock-${layout.dockEdge}` : ''
  ].filter(Boolean).join(' ');

  return ReactDOM.createPortal(
    <div
      className={rootClassName}
      data-preview-layout={layout.mode}
      data-preview-collapsed={String(!isExpanded)}
      data-preview-dock-edge={layout.dockEdge || 'none'}
      role="complementary"
      aria-label="Live Spell Preview"
      onKeyDown={handlePreviewKeyDown}
      style={position}
    >
      {dockBarAtBottom ? (
        <>
          {!isExpanded && completionBanner}
          {cardRegion}
          {isExpanded && (
            <div className="external-live-preview-actions">
              {renderCompleteButton(false)}
              {completionBanner}
            </div>
          )}
          {controlBar}
        </>
      ) : (
        <>
          {controlBar}
          {cardRegion}
          {isExpanded ? (
            <div className="external-live-preview-actions">
              {renderCompleteButton(false)}
              {completionBanner}
            </div>
          ) : completionBanner}
        </>
      )}
    </div>,
    document.body
  );
};

export default ExternalLivePreview;
