import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './CreatureToken.css';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useTargetingStore, { TARGET_TYPES } from '../../store/targetingStore';
import useCombatStore from '../../store/combatStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useChatStore from '../../store/chatStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCharacterStore from '../../store/characterStore';
// Removed useEnhancedMultiplayer import - hook was removed
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import MovementConfirmationDialog from '../combat/MovementConfirmationDialog';
import optimisticUpdatesService from '../../services/optimisticUpdatesService';
import '../../styles/creature-token.css';
import '../../styles/unified-context-menu.css';
import WowWindow from '../windows/WowWindow';
import CreatureWindow from '../windows/CreatureWindow';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import EnhancedCreatureInspectView from '../creature-wizard/components/common/EnhancedCreatureInspectView';
import ConditionsWindow from '../conditions/ConditionsWindow';
import BuffDebuffCreatorModal from '../modals/BuffDebuffCreatorModal';
import '../../styles/creature-token.css';
import ShopWindow from '../shop/ShopWindow';
import useLongPressContextMenu from '../../hooks/useLongPressContextMenu';
import { getCreatureTokenIconUrl } from '../../utils/assetManager';
import { calculateEffectiveMovementSpeed } from '../../utils/conditionUtils';

// Helper function to calculate ability modifier (D&D style)
const calculateModifier = (abilityScore) => {
  return Math.floor((abilityScore - 10) / 2);
};

// Helper function to format modifier for display
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// Helper function to get quality color
const getQualityColor = (quality) => {
  const qualityColors = {
    poor: '#9d9d9d',
    common: '#ffffff',
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000',
    artifact: '#e6cc80'
  };

  return qualityColors[quality?.toLowerCase()] || '#ffffff';
};

// Helper function to log movement to combat chat
const logMovementToCombat = (tokenId, creatures, distance, startPos, endPos) => {
  const useChatStore = require('../../store/chatStore').default;
  const useCreatureStore = require('../../store/creatureStore').default;

  const { addCombatNotification } = useChatStore.getState();
  const { tokens } = useCreatureStore.getState();

  const token = tokens.find(t => t.id === tokenId);
  const creature = token ? creatures.find(c => c.id === token.creatureId) : null;

  if (creature && addCombatNotification) {
    addCombatNotification({
      type: 'movement',
      creature: creature.name,
      distance: Math.round(distance),
      from: startPos,
      to: endPos,
      content: `${creature.name} moved ${Math.round(distance)} feet`,
      timestamp: new Date().toISOString()
    });
  }
};

const CreatureToken = ({ tokenId, position, onRemove }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const contextMenuRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Custom amount modal state
  const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
  const [customAmountType, setCustomAmountType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging


  // Refs to track current state in event handlers
  const isDraggingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  // Remove local state - use global store state instead

  const tokenRef = useRef(null);
  const lastPointerTypeRef = useRef('mouse');
  const longPressHandlers = useLongPressContextMenu();
  const lastPositionUpdateRef = useRef(Date.now());

  const { tokens, creatures, updateTokenState, removeToken, duplicateToken, updateTokenPosition } = useCreatureStore();
  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { currentTarget, setTarget, clearTarget } = useTargetingStore();
  const { addCombatNotification } = useChatStore();
  const {
    isSelectionMode,
    selectedTokens,
    toggleTokenSelection,
    isInCombat,
    isTokensTurn,
    activeMovement,
    pendingMovementConfirmation,
    startMovementVisualization,
    updateMovementVisualization,
    clearMovementVisualization,
    validateMovement,
    setPendingMovementConfirmation,
    clearPendingMovementConfirmation,
    confirmMovement,
    addMovementUsed,
    getRemainingMovement,
    updateTempMovementDistance,
    recordTurnStartPosition,
    getTurnStartPosition,
    initializeStore
  } = useCombatStore();

  // Removed enhanced multiplayer hook - was causing conflicts

  // Ensure store is properly initialized
  React.useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Update local position when prop position changes (but not during dragging or shortly after)
  useEffect(() => {
    // CRITICAL FIX: NEVER update position from props while dragging or mouse is down
    // This prevents ANY external updates (including auto-save) from interfering with smooth interactions
    if (isDragging || isMouseDown) {
      return;
    }

    const timeSinceLastUpdate = Date.now() - lastPositionUpdateRef.current;

    // After dragging ends, wait for grace period before accepting external position updates
    // This prevents auto-save and server echoes from causing jumps
    if (timeSinceLastUpdate > 100) { // Reduced from 1000ms to 100ms
      setLocalPosition(position);
    }
  }, [position, isDragging, isMouseDown]);
  const gridSystem = getGridSystem();

  // Expose grid system to window for combat store access
  React.useEffect(() => {
    window.gridSystem = gridSystem;
  }, [gridSystem]);

  // Store previous token state for comparison
  const prevTokenStateRef = useRef(null);

  // Throttle multiplayer updates during drag
  const lastMoveUpdateRef = useRef(null);

  // Find the token and creature data
  const token = tokens.find(t => t.id === tokenId);
  const creature = token ? creatures.find(c => c.id === token.creatureId) : null;

  // Active condition effects mapped to visual overlays (MUST be above any early returns)
  const activeBuffs = useBuffStore(state => state.activeBuffs);
  const activeDebuffs = useDebuffStore(state => state.activeDebuffs);

  const conditionEffects = useMemo(() => {
    const supported = new Set([
      'burning',
      'poisoned',
      'cursed',
      'diseased',
      'hexed',
      'frightened',
      'stunned',
      'paralyzed',
      'blinded',
      'invisible',
      'restrained',
      'grappled',
      'petrified',
      'hastened',
      'hasted',
      'slowed',
      'bleeding',
      'blessed',
      'defending',
      'silenced',
      'dispelled',
      'charmed',
      'confused',
      'exhausted'
    ]);

    const normalize = (value) =>
      (value || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-z]/g, '');

    const aliases = {
      burning: 'burning',
      burn: 'burning',
      fire: 'burning',
      poisoned: 'poisoned',
      poison: 'poisoned',
      cursed: 'cursed',
      curse: 'cursed',
      diseased: 'diseased',
      disease: 'diseased',
      hexed: 'hexed',
      hex: 'hexed',
      hastened: 'hastened',
      hasted: 'hastened',
      haste: 'hastened',
      quickened: 'hastened',
      accelerated: 'hastened',
      slowed: 'slowed',
      slow: 'slowed',
      bleeding: 'bleeding',
      bleed: 'bleeding',
      blessed: 'blessed',
      bless: 'blessed',
      defending: 'defending',
      defend: 'defending',
      silenced: 'silenced',
      silence: 'silenced',
      dispelled: 'dispelled',
      dispel: 'dispelled',
      charmed: 'charmed',
      charm: 'charmed',
      confused: 'confused',
      confuse: 'confused',
      exhausted: 'exhausted'
    };

    const mapName = (raw) => {
      const norm = normalize(raw);
      if (aliases[norm]) return aliases[norm];
      return supported.has(norm) ? norm : null;
    };

    const collect = [];

    const pushCondition = (key, label) => {
      if (!key) return;
      collect.push({ key, label: label || key.toUpperCase() });
    };

    // Only from token state (authoritative) - conditions only, not buffs/debuffs
    (token?.state?.conditions || []).forEach(c => {
      const key = mapName(c.id || c.name) || normalize(c.id || c.name);
      const label = c.name || c.id || key;
      pushCondition(key, label);
    });

    // Dedup by key, keep first label
    const seen = new Set();
    const unique = [];
    for (const item of collect) {
      if (item.key && !seen.has(item.key)) {
        seen.add(item.key);
        unique.push(item);
      }
    }

    return unique;
  }, [token?.state?.conditions, tokenId]);

  // Remaining time helper for tooltips - re-renders each second
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getConditionRemaining = useCallback((condition) => {
    const findMatch = () => {
      const matchBuff = (activeBuffs || []).find(b => b.targetId === tokenId && (b.name === condition.name || b.id === condition.id));
      if (matchBuff) return matchBuff;
      const matchDebuff = (activeDebuffs || []).find(d => d.targetId === tokenId && (d.name === condition.name || d.id === condition.id));
      return matchDebuff || null;
    };

    const fromStore = findMatch();
    const durationType = fromStore?.durationType || condition.durationType;

    // Round-based
    if (durationType === 'rounds') {
      const rounds = fromStore?.remainingRounds ?? fromStore?.durationValue ?? condition.remainingRounds ?? condition.durationValue;
      return { label: rounds ? `${rounds} rounds` : '' };
    }

    const endTime = fromStore?.endTime
      || (fromStore?.duration ? (fromStore.startTime || fromStore.startTime === 0 ? fromStore.startTime + fromStore.duration * 1000 : Date.now() + fromStore.duration * 1000) : null)
      || (condition.appliedAt && condition.duration ? condition.appliedAt + condition.duration : null);

    if (!endTime) return { label: '' };

    const remainingMs = Math.max(0, endTime - now);
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const label = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
    return { label };
  }, [activeBuffs, activeDebuffs, tokenId, now]);

  // Helper function to update token position with enhanced multiplayer sync
  const updateTokenPositionWithSync = (tokenId, position, sendToServer = true) => {
    // Use optimistic updates for immediate feedback in multiplayer
    if (sendToServer && isInMultiplayer && multiplayerSocket && token) {
      // Apply optimistic update immediately
      const actionId = optimisticUpdatesService.optimisticTokenMove(tokenId, position, (actionId) => {
        // Track local movement to prevent race conditions
        window[`recent_move_${token.creatureId}`] = Date.now();

        // Send to server with actionId for tracking
        multiplayerSocket.emit('token_moved', {
          tokenId: token.id,
          position: position,
          actionId: actionId // For server confirmation tracking
        });
      });
    } else {
      // Not multiplayer - just update locally
      updateTokenPosition(tokenId, position);
    }
  };

  // Initialize previous state reference when token is first found
  useEffect(() => {
    if (token && !prevTokenStateRef.current) {
      prevTokenStateRef.current = { ...token.state };
    }
  }, [token]);

  // Force re-render when token state changes for real-time updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // PERFORMANCE FIX: Only subscribe to what's needed for rendering decisions
  // Camera position is handled via imperative updates in useEffect subscription - DON'T subscribe here!
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const gridSize = useGameStore(state => state.gridSize);
  const feetPerTile = useGameStore(state => state.feetPerTile);
  const showMovementVisualization = useGameStore(state => state.showMovementVisualization);
  const isGMMode = useGameStore(state => state.isGMMode);
  const effectiveZoom = zoomLevel * playerZoom;

  // Check if this token is being viewed from and get visibility data
  const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
  const visibleArea = useLevelEditorStore(state => state.visibleArea);
  const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
  const fovAngle = useLevelEditorStore(state => state.fovAngle);
  const getTokenFacingDirection = useLevelEditorStore(state => state.getTokenFacingDirection);
  const setTokenFacingDirection = useLevelEditorStore(state => state.setTokenFacingDirection);
  const getExploredArea = useLevelEditorStore(state => state.getExploredArea);
  const fogOfWarEnabled = useLevelEditorStore(state => state.fogOfWarEnabled);
  const [isHovering, setIsHovering] = useState(false);
  const gridOffsetX = useGameStore(state => state.gridOffsetX);
  const gridOffsetY = useGameStore(state => state.gridOffsetY);
  const tokenGridSize = gridSize;
  const isViewingFrom = viewingFromToken && (
    (viewingFromToken.type === 'creature' && (viewingFromToken.creatureId === token.creatureId || viewingFromToken.id === token.id)) ||
    (viewingFromToken.id === token.id)
  );

  // Convert visibleArea array back to Set for efficient lookup (if it's an array)
  const visibleAreaSet = React.useMemo(() => {
    if (!visibleArea) return null;
    return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
  }, [visibleArea]);

  // Track viewing token movement to invalidate visibility cache
  const viewingTokenMovementRef = React.useRef({ count: 0, lastPos: null });
  React.useEffect(() => {
    if (viewingFromToken?.position) {
      const currentPos = viewingFromToken.position;
      const lastPos = viewingTokenMovementRef.current.lastPos;
      if (!lastPos ||
        Math.abs(currentPos.x - lastPos.x) > 10 ||
        Math.abs(currentPos.y - lastPos.y) > 10) {
        viewingTokenMovementRef.current.count += 1;
        viewingTokenMovementRef.current.lastPos = currentPos;
      }
    }
  }, [viewingFromToken?.position]);

  // Check if this token is visible based on FOV (only if viewing from a token)
  // Returns: true = fully visible, false = hidden
  // Note: Afterimages handle showing tokens at their remembered positions in explored areas
  // Tokens should only be visible if they're currently in the visible area
  // PERFORMANCE FIX: Cache visibility result and only recalculate when token actually moves
  const lastVisibilityCheckRef = useRef({ cacheKey: null, result: true });
  const tokenVisibilityState = React.useMemo(() => {
    // If this is the viewing token, always visible
    if (isViewingFrom) return true;

    // If viewing from a token AND dynamic fog is enabled, check FOV visibility
    // GM mode should NOT restrict token visibility - GM can always see all tokens
    if (viewingFromToken && dynamicFogEnabled && !isGMMode) {
      // Check if token position is in visible area
      if (!position || position.x === undefined || position.y === undefined) {
        return false; // No position - hide token
      }

      // Get visibility polygon from store for accurate point-in-polygon check
      const levelEditorStore = useLevelEditorStore.getState();
      const visibilityPolygon = levelEditorStore.visibilityPolygon;

      // Create a comprehensive cache key that includes all factors affecting visibility
      // Position alone is not enough - visibility depends on viewing token position and visibility area
      // FIXED: Include a sample of visibleAreaSet to detect content changes (not just size)
      const movementCount = viewingTokenMovementRef.current.count || 0;
      const viewingPosKey = viewingFromToken?.position
        ? `${Math.floor(viewingFromToken.position.x)},${Math.floor(viewingFromToken.position.y)}`
        : 'none';
      const cacheKey = `${Math.floor(position.x)},${Math.floor(position.y)}_${viewingFromToken?.id || 'none'}_${movementCount}_${visibilityPolygon ? 'polygon' : 'tile'}_${visibleAreaSet?.size || 0}_${viewingPosKey}`;
      if (lastVisibilityCheckRef.current.cacheKey === cacheKey) {
        return lastVisibilityCheckRef.current.result;
      }

      let visible = false;

      // Calculate token's grid position for tile-based visibility check
      // FIXED: Use grid system for accurate coordinate conversion (matches other components)
      const gridSystem = getGridSystem();
      const tokenGridCoords = gridSystem.worldToGrid(position.x, position.y);
      const tokenTileKey = `${tokenGridCoords.x},${tokenGridCoords.y}`;

      // PRIMARY CHECK: Use visibleAreaSet for consistency with fog and afterimage systems
      // This ensures tokens are visible IFF their tile is in the visible area
      // FIXED: Clear cache when visibleAreaSet changes to force immediate update
      if (visibleAreaSet && visibleAreaSet.size > 0) {
        visible = visibleAreaSet.has(tokenTileKey);

        // FIXED: Also check adjacent tiles in case the token is on a tile boundary
        // This helps with tokens that should be visible but aren't due to coordinate rounding
        if (!visible) {
          // Check adjacent tiles (8-directional)
          const adjacentTiles = [
            `${tokenGridCoords.x - 1},${tokenGridCoords.y}`,
            `${tokenGridCoords.x + 1},${tokenGridCoords.y}`,
            `${tokenGridCoords.x},${tokenGridCoords.y - 1}`,
            `${tokenGridCoords.x},${tokenGridCoords.y + 1}`,
            `${tokenGridCoords.x - 1},${tokenGridCoords.y - 1}`,
            `${tokenGridCoords.x + 1},${tokenGridCoords.y - 1}`,
            `${tokenGridCoords.x - 1},${tokenGridCoords.y + 1}`,
            `${tokenGridCoords.x + 1},${tokenGridCoords.y + 1}`
          ];

          // If any adjacent tile is visible, consider the token visible
          // This helps with edge cases where the token is between tiles
          for (const adjacentTile of adjacentTiles) {
            if (visibleAreaSet.has(adjacentTile)) {
              visible = true;
              break;
            }
          }
        }

        // FIXED: Clear visibility cache when visibleAreaSet changes to force recalculation
        // This ensures tokens appear immediately when they enter the visible area
        if (visible && lastVisibilityCheckRef.current.result !== visible) {
          lastVisibilityCheckRef.current.cacheKey = null; // Invalidate cache
        }
      }

      // Distance-based fallback ONLY when visibleAreaSet is not yet calculated
      // This prevents tokens from being hidden during initialization
      if (!visible && viewingFromToken && viewingFromToken.position &&
        (!visibleAreaSet || visibleAreaSet.size === 0)) {
        const viewingPos = viewingFromToken.position;
        const dx = position.x - viewingPos.x;
        const dy = position.y - viewingPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Get vision range for viewing token
        const viewingTokenId = viewingFromToken.type === 'creature'
          ? (viewingFromToken.creatureId || viewingFromToken.id)
          : (viewingFromToken.characterId || viewingFromToken.id || viewingFromToken.playerId);
        const viewingTokenVision = levelEditorStore.tokenVisionRanges[viewingTokenId];
        const visionRange = viewingTokenVision?.range || 6; // Default 6 tiles (30ft)
        const visionRangeInWorld = visionRange * tokenGridSize;

        // If token is within vision range, show it (only as fallback when no proper visibility data)
        if (distance <= visionRangeInWorld) {
          visible = true;
        }
      }

      // Cache the result
      lastVisibilityCheckRef.current = { cacheKey: cacheKey, result: visible };

      // Only show token if it's currently visible
      // Afterimages will show tokens at their remembered positions in explored areas
      return visible;
    }

    // If not viewing from a token or in GM mode, always visible (normal view)
    return true;
  }, [viewingFromToken, dynamicFogEnabled, isViewingFrom, position, tokenGridSize, gridOffsetX, gridOffsetY, isGMMode, visibleAreaSet]);

  // Legacy compatibility - check if token should be visible at all
  const isTokenVisible = React.useMemo(() => {
    return tokenVisibilityState === true;
  }, [tokenVisibilityState]);

  // Tokens are never greyed out - they're either fully visible or hidden
  // Afterimages show tokens at their remembered positions
  const isGreyedOut = false;

  // Handle mouse move and up for dragging with pure immediate feedback
  useEffect(() => {
    let lastNetworkUpdate = 0;
    let lastCombatUpdate = 0;
    let dragTimeoutId = null;

    const handleMouseMove = (e) => {
      // Removed excessive logging for performance

      // Start dragging immediately if mouse is down and we're not dragging yet
      if (isMouseDownRef.current && !isDraggingRef.current) {
        setIsDragging(true);
        isDraggingRef.current = true;
        // PERFORMANCE: Set global flag to prevent expensive fog recalculations during token drag
        window._isDraggingToken = true;

        // Track drag state globally to prevent feedback loops in multiplayer
        if (!window.multiplayerDragState) {
          window.multiplayerDragState = new Map();
        }
        window.multiplayerDragState.set(`token_${token.creatureId}`, true);
        // Removed excessive logging for performance

        // Start movement visualization if enabled (works in and out of combat)
        if (showMovementVisualization) {
          startMovementVisualization(tokenId, { x: position.x, y: position.y });
        }
      }

      if (!isDraggingRef.current) return;

      // Prevent all default behaviors and stop propagation immediately
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Calculate new screen position IMMEDIATELY for responsive visual feedback
      const screenX = e.clientX - dragOffset.x;
      const screenY = e.clientY - dragOffset.y;

      // Get viewport dimensions for proper coordinate conversion
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Convert screen position back to world coordinates
      const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);

      // Update local position for React state (this will trigger re-render with new position)
      setLocalPosition({ x: worldPos.x, y: worldPos.y });

      // Handle expensive operations with simple time-based throttling (no RAF)
      const now = Date.now();

      // Send real-time position updates to multiplayer server during drag (reduced throttling for smoother experience)
      if (isInMultiplayer && token && multiplayerSocket) {
        if (now - lastNetworkUpdate > 33) { // Increased to 30fps for smoother experience
          // CRITICAL FIX: Use the current world position for real-time dragging
          // This ensures other players see exactly where the token is being moved to
          const currentTokenPosition = { x: worldPos.x, y: worldPos.y };

          // Snap to grid for network consistency
          const gridCoords = gridSystem.worldToGrid(currentTokenPosition.x, currentTokenPosition.y);
          const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

          multiplayerSocket.emit('token_moved', {
            tokenId: token.id,
            position: { x: Math.round(snappedPos.x), y: Math.round(snappedPos.y) },
            isDragging: true
          });
          lastNetworkUpdate = now;
        }
      }

      // CRITICAL FIX: Update movement visualization and distance calculation during drag (works in and out of combat)
      if (dragStartPosition && now - lastCombatUpdate > 50) { // 20fps for combat updates
        // CRITICAL FIX: Snap position to tile center for clean distance display
        // This makes the movement line point to tile centers and shows clean distance increments
        const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
        const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

        // Update movement visualization if enabled - use SNAPPED position for clean line
        if (showMovementVisualization && activeMovement?.tokenId === tokenId) {
          updateMovementVisualization({ x: snappedPos.x, y: snappedPos.y });
        }

        // Calculate movement distance (used for both combat distance and facing direction)
        const dx = snappedPos.x - dragStartPosition.x;
        const dy = snappedPos.y - dragStartPosition.y;
        const worldDistance = Math.sqrt(dx * dx + dy * dy);

        // Calculate and update temporary movement distance for tooltip (only needed in combat)
        if (isInCombat) {
          // CRITICAL FIX: Use snapped positions for tile-based distance calculation
          const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
          const distance = tileDistance * feetPerTile;
          updateTempMovementDistance(tokenId, distance);
        }

        lastCombatUpdate = now;
      }
    };

    const handleMouseUp = (e) => {
      // Removed excessive logging for performance

      // Handle mouse up for both dragging and non-dragging cases
      if (e.button !== 0) return; // Only handle left mouse button

      // If we were just mouse down but never started dragging, this is a simple click
      if (isMouseDownRef.current && !isDraggingRef.current) {
        setIsMouseDown(false);
        isMouseDownRef.current = false;
        setMouseDownPosition(null);
        setDragStartPosition(null);
        return;
      }

      // If we're not dragging, nothing to do
      if (!isDraggingRef.current) {
        // Removed excessive logging for performance
        setIsMouseDown(false);
        isMouseDownRef.current = false;
        setMouseDownPosition(null);
        setDragStartPosition(null);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Calculate final position
      const screenX = e.clientX - dragOffset.x;
      const screenY = e.clientY - dragOffset.y;

      // Get viewport dimensions for proper coordinate conversion
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Convert screen position back to world coordinates
      const rawWorldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);

      // Snap to grid center for proper alignment
      const gridCoords = gridSystem.worldToGrid(rawWorldPos.x, rawWorldPos.y);
      const finalWorldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

      // Removed excessive logging for performance

      // Capture afterimage and explored area from old position before moving
      const levelEditorStore = useLevelEditorStore.getState();
      if (dragStartPosition && token && creature) {
        levelEditorStore.captureTokenMovementAfterimage(
          token.creatureId || tokenId,
          { ...creature, ...token },
          dragStartPosition,
          finalWorldPos
        );
      }

      // Update token position to snapped grid center (with multiplayer sync)
      updateTokenPositionWithSync(tokenId, finalWorldPos);

      // Update local position immediately to prevent visual jumps
      setLocalPosition({ x: finalWorldPos.x, y: finalWorldPos.y });

      // If this is the viewing token, update its position in the level editor store for vision calculations
      // FIXED: Force visibility recalculation when token is dropped
      if (isViewingFrom) {
        const levelEditorStore = useLevelEditorStore.getState();
        const currentViewingToken = levelEditorStore.viewingFromToken;
        if (currentViewingToken) {
          // Update position - this will trigger visibility recalculation
          // The StaticFogOverlay will detect the drag end and clear cache
          levelEditorStore.setViewingFromToken({
            ...currentViewingToken,
            position: { x: finalWorldPos.x, y: finalWorldPos.y }
          });
        }
      }

      // Track when we last updated position (for grace period in useEffect)
      lastPositionUpdateRef.current = Date.now();

      // Handle combat movement validation if in combat
      if (isInCombat && dragStartPosition) {
        // Validate movement and handle AP costs
        const validation = validateMovement(tokenId, dragStartPosition, finalWorldPos, [creature], feetPerTile);

        if (validation.needsConfirmation) {
          // Movement requires confirmation
          const combatant = useCombatStore.getState().turnOrder.find(c => c.tokenId === tokenId);
          // Get token conditions for speed calculation
          const conditions = token?.state?.conditions || [];
          const baseSpeed = creature.stats?.speed || 30;
          const effectiveSpeed = calculateEffectiveMovementSpeed(baseSpeed, conditions);
          setPendingMovementConfirmation({
            tokenId,
            startPosition: dragStartPosition,
            finalPosition: finalWorldPos,
            requiredAP: validation.additionalAPNeeded,
            totalDistance: validation.totalMovementAfterThis,
            baseMovement: effectiveSpeed,
            currentAP: combatant?.currentActionPoints || 0,
            creatureName: creature.name || 'Creature',
            movementUsedThisTurn: validation.movementUsedThisTurn,
            feetPerTile: feetPerTile,
            currentMovementDistance: validation.currentMovementFeet
          });
        } else if (validation.isValid) {
          // Movement is valid - auto-confirm
          // CRITICAL FIX: Pass totalMovementAfterThis (cumulative) instead of currentMovementFeet (just this move)
          // This ensures movement tracking accumulates properly instead of resetting
          confirmMovement(tokenId, validation.additionalAPNeeded, validation.totalMovementAfterThis);
          logMovementToCombat(tokenId, creatures, validation.currentMovementFeet, dragStartPosition, finalWorldPos);

          if (isInMultiplayer && multiplayerSocket) {
            multiplayerSocket.emit('token_movement_complete', {
              tokenId: token.creatureId,
              creatureName: creature.name,
              distance: Math.round(validation.currentMovementFeet),
              from: dragStartPosition,
              to: finalWorldPos
            });
          }
        } else {
          // Revert to start position
          updateTokenPositionWithSync(tokenId, dragStartPosition);
          updateTempMovementDistance(tokenId, 0);
        }
      } else {
        // Not in combat - send final position update to multiplayer
        if (isInMultiplayer && token && multiplayerSocket) {
          // Track local movement to prevent race conditions
          window[`recent_move_${token.creatureId}`] = Date.now();

          multiplayerSocket.emit('token_moved', {
            tokenId: tokenId, // Correctly send tokenId as recognized by server
            position: finalWorldPos,
            isDragging: false
          });
        }
      }

      // Clear movement visualization
      clearMovementVisualization();

      // End dragging and reset all states
      // Removed excessive logging for performance
      setIsDragging(false);
      isDraggingRef.current = false;
      // PERFORMANCE: Clear global token drag flag
      window._isDraggingToken = false;
      setIsMouseDown(false);
      isMouseDownRef.current = false;
      setMouseDownPosition(null);
      setDragStartPosition(null);

      // CRITICAL FIX: Clear global token interaction flag
      window.tokenInteractionActive = false;
      window.tokenInteractionTimestamp = null;

      // Clear drag state globally to allow network updates again
      if (window.multiplayerDragState) {
        window.multiplayerDragState.delete(`token_${token.creatureId}`);
        // Removed excessive logging for performance
      }
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') {
        handleMouseMove(e);
      }
    };

    const handlePointerUp = (e) => {
      if (e.pointerType === 'touch') {
        handleMouseUp(e);
      }
    };

    if (isDragging || isMouseDown) {
      // Use passive: false for both mousemove and mouseup to allow preventDefault
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.addEventListener('pointermove', handlePointerMove, { passive: false });
      document.addEventListener('pointerup', handlePointerUp, { passive: false });
      document.addEventListener('pointercancel', handlePointerUp, { passive: false });

      // Safety timeout to reset dragging state if mouse up is missed
      // CRITICAL FIX: Increased from 5s to 30s to prevent interrupting long drags
      dragTimeoutId = setTimeout(() => {
        console.warn('⏰ Drag timeout triggered after 30s - this should rarely happen');
        setIsDragging(false);
        // PERFORMANCE: Clear global token drag flag
        window._isDraggingToken = false;
        setIsMouseDown(false);
        if (window.multiplayerDragState && token) {
          window.multiplayerDragState.delete(`token_${token.creatureId}`);
        }
        window.tokenInteractionActive = false;
        window.tokenInteractionTimestamp = null;
      }, 30000); // 30 second timeout (safety net only)
    }

    return () => {
      // Removed excessive logging for performance
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
      if (dragTimeoutId) {
        clearTimeout(dragTimeoutId);
      }
    };
  }, [isDragging, isMouseDown, isInMultiplayer, multiplayerSocket, token, isInCombat, dragStartPosition, showMovementVisualization, tokenId, position]);
  // Subscribe to token state changes for real-time health/mana/AP updates
  useEffect(() => {
    const unsubscribe = useCreatureStore.subscribe(
      (state) => state.tokens,
      (tokens) => {
        const updatedToken = tokens.find(t => t.id === tokenId);
        if (updatedToken) {
          const prevState = prevTokenStateRef.current;

          if (prevState) {
            // Check if health, mana, or AP changed
            const healthChanged = updatedToken.state.currentHp !== prevState.currentHp;
            const manaChanged = updatedToken.state.currentMana !== prevState.currentMana;
            const apChanged = updatedToken.state.currentActionPoints !== prevState.currentActionPoints;

            if (healthChanged || manaChanged || apChanged) {
              // Token state changed - update handled
              setForceUpdate(prev => prev + 1);
            }
          }

          // Update the previous state reference
          prevTokenStateRef.current = { ...updatedToken.state };
        }
      }
    );

    return unsubscribe;
  }, [tokenId]);

  // Convert world coordinates to screen coordinates for proper positioning
  // PERFORMANCE FIX: Read camera from store when calculating, don't subscribe
  // This prevents token re-render on every camera movement during drag
  const currentPos = isDragging ? localPosition : position;

  // PERFORMANCE FIX: Calculate initial position without depending on camera state
  // Camera changes are handled by the imperative subscription, not React re-renders
  const initialScreenPosition = useMemo(() => {
    if (!currentPos) return { x: 0, y: 0 };
    return gridSystem.worldToScreen(
      currentPos.x,
      currentPos.y,
      window.innerWidth,
      window.innerHeight
    );
  }, [currentPos, gridSystem, zoomLevel, playerZoom]);

  const screenPositionRef = useRef(initialScreenPosition);
  const currentPosRef = useRef(currentPos);
  const cameraUpdateRafRef = useRef(null);
  const pendingCameraUpdateRef = useRef(false);

  const updateScreenPosition = useCallback((worldPosition) => {
    if (!worldPosition) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const newPosition = gridSystem.worldToScreen(
      worldPosition.x,
      worldPosition.y,
      viewportWidth,
      viewportHeight
    );

    screenPositionRef.current = newPosition;

    const element = tokenRef.current;
    if (element) {
      element.style.left = `${newPosition.x}px`;
      element.style.top = `${newPosition.y}px`;
    }
  }, [gridSystem]);

  useEffect(() => {
    currentPosRef.current = currentPos;
    updateScreenPosition(currentPos);
  }, [currentPos, updateScreenPosition]);

  // CRITICAL FIX: Batch position updates during camera drag to match camera RAF timing
  // This prevents tokens from "hovering" during grid drag
  useEffect(() => {
    const handleCameraChange = () => {
      // Check if camera is being dragged
      const isDraggingCamera = window._isDraggingCamera || false;

      if (isDraggingCamera) {
        // During camera drag, batch updates via RAF to match camera update timing
        // This prevents tokens from updating with intermediate camera values
        pendingCameraUpdateRef.current = true;

        if (cameraUpdateRafRef.current === null) {
          cameraUpdateRafRef.current = requestAnimationFrame(() => {
            if (pendingCameraUpdateRef.current) {
              updateScreenPosition(currentPosRef.current);
              pendingCameraUpdateRef.current = false;
            }
            cameraUpdateRafRef.current = null;
          });
        }
      } else {
        // When not dragging, update immediately for responsiveness
        updateScreenPosition(currentPosRef.current);
      }
    };

    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (
        state.cameraX !== prevState.cameraX ||
        state.cameraY !== prevState.cameraY ||
        state.zoomLevel !== prevState.zoomLevel ||
        state.playerZoom !== prevState.playerZoom
      ) {
        handleCameraChange();
      }
    });

    return () => {
      unsubscribe();
      // Clean up RAF on unmount
      if (cameraUpdateRafRef.current !== null) {
        cancelAnimationFrame(cameraUpdateRafRef.current);
        cameraUpdateRafRef.current = null;
      }
    };
  }, [updateScreenPosition]);

  // Handle window resize to update screen positions
  useEffect(() => {
    const handleResize = () => {
      updateScreenPosition(currentPosRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateScreenPosition]);

  const screenPosition = screenPositionRef.current;

  // Calculate token size based on creature size and zoom
  const tokenSize = useMemo(() => {
    if (!creature) return gridSize * 0.8 * effectiveZoom;

    const sizeMapping = getCreatureSizeMapping(creature.size);
    const baseSize = gridSize * 0.8; // 80% of tile size for some padding

    // For creatures larger than 1x1, we use the width to determine the base size
    // but still apply the scale factor for visual consistency
    const scaledSize = baseSize * sizeMapping.scale * Math.max(sizeMapping.width, sizeMapping.height);

    return scaledSize * effectiveZoom;
  }, [gridSize, effectiveZoom, creature]);

  // Calculate health percentage for the health bar with real-time updates
  const healthPercentage = useMemo(() => {
    if (!token || !creature) return 0;
    // Force recalculation when forceUpdate changes
    const _ = forceUpdate;
    return (token.state.currentHp / creature.stats.maxHp) * 100;
  }, [token?.state.currentHp, creature?.stats.maxHp, forceUpdate]);
  // Handle context menu
  const handleContextMenu = (e) => {
    // Prevent the default browser context menu
    e.preventDefault();
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;

    setContextMenuPosition({ x, y });
    setShowContextMenu(true);

  };

  // State for conditions window
  const [showConditionsWindow, setShowConditionsWindow] = useState(false);

  // State for buff/debuff creator modal
  const [showBuffDebuffCreator, setShowBuffDebuffCreator] = useState(false);
  const [buffDebuffInitialType, setBuffDebuffInitialType] = useState(null);

  // Handle opening conditions window
  const handleOpenConditions = () => {
    setShowConditionsWindow(true);
    setShowContextMenu(false);
  };

  // Handle opening buff/debuff creator
  const handleOpenBuffDebuffCreator = (type = null) => {
    setBuffDebuffInitialType(type);
    setShowBuffDebuffCreator(true);
    setShowContextMenu(false);
  };

  // State for shop window
  const [showShopWindow, setShowShopWindow] = useState(false);

  // Handle opening shop window
  const handleOpenShop = () => {
    setShowShopWindow(true);
    setShowContextMenu(false);
  };

  // Tooltip hover delay ref
  const tooltipTimeoutRef = useRef(null);

  const showTooltipNow = useCallback(() => {
    if (!tokenRef.current) return;
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    const rect = tokenRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate tooltip position closer to the token
    let x = rect.right + 8;
    let y = rect.top - 5;

    // Adjust if tooltip would go off-screen horizontally
    if (x + 280 > viewportWidth) {
      x = rect.left - 288;
    }

    // Adjust if tooltip would go off-screen vertically
    if (y + 150 > viewportHeight) {
      y = viewportHeight - 160;
    }

    if (y < 10) {
      y = 10;
    }

    setTooltipPosition({ x, y });
    setShowTooltip(true);
  }, []);

  // Handle mouse enter (show tooltip with delay)
  const handleMouseEnter = (e) => {
    if (!tokenRef.current) return;

    setIsHovering(true);

    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    const rect = tokenRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate tooltip position closer to the token
    let x = rect.right + 8; // Much closer to token
    let y = rect.top - 5; // Slightly above token center

    // Adjust if tooltip would go off-screen horizontally
    if (x + 280 > viewportWidth) {
      x = rect.left - 288; // Show on left side instead
    }

    // Adjust if tooltip would go off-screen vertically
    if (y + 150 > viewportHeight) {
      y = viewportHeight - 160; // Move up to stay visible
    }

    // Ensure tooltip doesn't go above screen
    if (y < 10) {
      y = 10;
    }

    setTooltipPosition({ x, y });

    // Removed excessive logging for performance

    // Show tooltip after 1.5 second delay
    tooltipTimeoutRef.current = setTimeout(() => {
      // Removed excessive logging for performance
      setShowTooltip(true);
    }, 1500);
  };

  // Handle mouse leave (hide tooltip)
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Clear timeout and hide tooltip
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  // Handle wheel/scroll to rotate token facing direction
  const handleWheel = React.useCallback((e) => {
    // Only rotate if:
    // 1. We're hovering over the token
    // 2. We're not dragging
    // 3. We're in 100-degree FOV mode
    // 4. We're viewing from this token

    // Early check - if we're in the right conditions, stop event propagation immediately
    // to prevent Grid's global wheel handler from interfering
    if (isHovering && !isDraggingRef.current && !isMouseDownRef.current && fovAngle === 100 && isViewingFrom) {
      // Stop propagation and prevent default BEFORE the Grid's handler gets it
      e.preventDefault();
      e.stopPropagation();

      // Get token ID for this creature token
      const tokenIdToUse = token ? (token.creatureId || token.id) : tokenId;

      // Get current facing direction (default to 0 if not set)
      const currentFacing = getTokenFacingDirection(tokenIdToUse) || 0;

      // Rotate based on scroll delta - much more responsive rotation speed
      // Convert deltaY to radians with smooth, fluid rotation
      // Higher rotation speed (0.002) provides more responsive rotation per pixel scrolled
      const rotationSpeed = 0.002; // Smooth and fluid rotation
      const deltaAngle = -e.deltaY * rotationSpeed;
      const newFacing = currentFacing + deltaAngle;

      // Normalize angle to -PI to PI range efficiently
      let normalizedFacing = newFacing;
      if (normalizedFacing > Math.PI) normalizedFacing -= 2 * Math.PI;
      if (normalizedFacing < -Math.PI) normalizedFacing += 2 * Math.PI;

      // Update facing direction in store immediately for smooth, fluid rotation
      setTokenFacingDirection(tokenIdToUse, normalizedFacing);
    }
  }, [isHovering, token, tokenId, fovAngle, isViewingFrom, getTokenFacingDirection, setTokenFacingDirection]);

  // Add wheel event listener with passive: false to allow preventDefault
  // Use capture phase to ensure it fires before Grid's document-level handler
  React.useEffect(() => {
    const tokenElement = tokenRef.current;
    if (!tokenElement) return;

    // Use capture phase to intercept the event before it bubbles to document
    tokenElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      tokenElement.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [handleWheel]);

  // Handle click outside to close context menu and cleanup tooltip timeout
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup tooltip timeout on unmount
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Handle token removal
  const handleRemoveToken = () => {
    if (onRemove) {
      onRemove(tokenId);
    } else {
      removeToken(tokenId);
    }
    setShowContextMenu(false);
  };

  // Handle view creature details (Inspect)
  const [showDetailsWindow, setShowDetailsWindow] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  const handleViewDetails = () => {
    // Close the context menu first
    setShowContextMenu(false);

    // Immediately set the flag to show the details window
    setShowDetailsWindow(true);
    setActiveTab('stats');
  };

  const handleCloseDetailsWindow = () => {
    setShowDetailsWindow(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle duplicate token
  const handleDuplicateToken = () => {
    duplicateToken(tokenId);
    setShowContextMenu(false);
  };

  // Handle edit creature
  const [showCreatureEditor, setShowCreatureEditor] = useState(false);

  const handleEditCreature = () => {
    setShowCreatureEditor(true);
    setShowContextMenu(false);
  };

  // Handle rename token
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newName, setNewName] = useState('');
  const renameInputRef = useRef(null);

  // Handle change icon
  const [showIconEditor, setShowIconEditor] = useState(false);
  const [newIconUrl, setNewIconUrl] = useState('');
  const [iconPosition, setIconPosition] = useState({ x: 50, y: 50 }); // Center position as percentage
  const [iconScale, setIconScale] = useState(100); // Scale as percentage
  const fileInputRef = useRef(null);

  const handleRenameToken = () => {
    const currentName = token.state.customName || creature.name;
    setNewName(currentName);
    setShowRenameInput(true);
    setShowContextMenu(false);

    // Focus the input after it renders
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus();
        renameInputRef.current.select();
      }
    }, 10);
  };

  const handleConfirmRename = () => {
    if (newName.trim()) {
      updateTokenState(tokenId, {
        customName: newName.trim()
      });
    }
    setShowRenameInput(false);
    setNewName('');
  };

  const handleCancelRename = () => {
    setShowRenameInput(false);
    setNewName('');
  };

  // Handle change icon
  const handleChangeIcon = () => {
    const currentIcon = token.state.customIcon || creature.tokenIcon;
    setNewIconUrl(currentIcon);
    setIconPosition(token.state.iconPosition || { x: 50, y: 50 });
    setIconScale(token.state.iconScale || 100);
    setShowIconEditor(true);
    setShowContextMenu(false);
  };

  const handleConfirmIconChange = () => {
    updateTokenState(tokenId, {
      customIcon: newIconUrl,
      iconPosition: iconPosition,
      iconScale: iconScale
    });
    setShowIconEditor(false);
    setNewIconUrl('');
    setIconPosition({ x: 50, y: 50 });
    setIconScale(100);
  };

  const handleCancelIconChange = () => {
    setShowIconEditor(false);
    setNewIconUrl('');
    setIconPosition({ x: 50, y: 50 });
    setIconScale(100);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewIconUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCloseCreatureEditor = () => {
    setShowCreatureEditor(false);
  };

  // Handle targeting
  const handleTargetCreature = () => {
    if (!creature) return;

    // Create minimal target data - use tokenId to target specific token instance
    // The Target HUD will fetch current stats from the store in real-time
    const displayName = token.state.customName || creature.name;
    const targetData = {
      id: tokenId, // Use tokenId to target specific token, not creature type
      name: displayName,
      type: creature.type,
      size: creature.size,
      level: creature.level || 1,
      faction: creature.faction || 'neutral',
      race: creature.race,
      alignment: creature.alignment,
      // Store base stats for max values, but not current values
      stats: {
        maxHp: creature.stats.maxHp,
        maxMana: creature.stats.maxMana || 0,
        maxActionPoints: creature.stats.maxActionPoints || 2,
        speed: creature.stats.speed || 30,
        armor: creature.stats.armor || 10
      }
    };

    // Check if this creature token is already targeted
    if (currentTarget?.id === tokenId) {
      clearTarget();
    } else {
      setTarget(targetData, TARGET_TYPES.CREATURE);
    }

    setShowContextMenu(false);
  };

  // Check if this specific token is currently targeted (not just the creature type)
  const isTargeted = currentTarget?.id === tokenId;

  // Check if this token is selected for combat
  const isSelectedForCombat = selectedTokens.has(tokenId);

  // Check if it's this token's turn in combat
  const isMyTurn = isInCombat && isTokensTurn(tokenId);

  // Record turn start position when it becomes this token's turn
  useEffect(() => {
    if (isMyTurn && position) {
      const currentTurnStartPosition = getTurnStartPosition(tokenId);
      if (!currentTurnStartPosition) {
        recordTurnStartPosition(tokenId, position);
      }
    }
  }, [isMyTurn, tokenId, position, recordTurnStartPosition, getTurnStartPosition]);

  // Movement confirmation handlers
  const handleConfirmMovement = () => {
    if (pendingMovementConfirmation) {
      const {
        tokenId: pendingTokenId,
        finalPosition,
        requiredAP,
        totalDistance
      } = pendingMovementConfirmation;


      // Update token position to final position (should already be there, but ensure it)
      updateTokenPositionWithSync(pendingTokenId, finalPosition);

      // Track the movement and spend the required AP - use total distance, not current movement
      confirmMovement(pendingTokenId, requiredAP, totalDistance);
    }
  };

  const handleCancelMovement = () => {
    if (pendingMovementConfirmation) {
      const { tokenId: pendingTokenId, startPosition } = pendingMovementConfirmation;


      // Revert token to start position
      updateTokenPositionWithSync(pendingTokenId, startPosition);

      // Clear temporary movement distance
      updateTempMovementDistance(pendingTokenId, 0);

      // Clear all movement states
      clearMovementVisualization();
      clearPendingMovementConfirmation();
    }
  };

  // Handle damage token
  const handleDamageToken = (amount) => {
    if (!token) return;

    const currentHp = token.state.currentHp;
    const newHp = Math.max(0, currentHp - amount);

    updateTokenState(tokenId, {
      currentHp: newHp
    });

    // CRITICAL FIX: Sync HP to combat timeline if in combat
    if (isInCombat) {
      const { updateCombatantHP } = useCombatStore.getState();
      updateCombatantHP(tokenId, newHp);
    }

    // Show floating combat text at token's screen position
    if (window.showFloatingCombatText) {
      window.showFloatingCombatText(
        amount.toString(),
        'damage',
        { x: screenPosition.x, y: screenPosition.y }
      );
    }

    setShowContextMenu(false);
  };

  // Handle heal token
  const handleHealToken = (amount) => {
    if (!token || !creature) return;

    const currentHp = token.state.currentHp;
    const maxHp = creature.stats.maxHp;
    const newHp = Math.min(maxHp, currentHp + amount);


    updateTokenState(tokenId, {
      currentHp: newHp
    });

    // CRITICAL FIX: Sync HP to combat timeline if in combat
    if (isInCombat) {
      const { updateCombatantHP } = useCombatStore.getState();
      updateCombatantHP(tokenId, newHp);
    }

    // Show floating combat text at token's screen position
    if (window.showFloatingCombatText) {
      window.showFloatingCombatText(
        amount.toString(),
        'heal',
        { x: screenPosition.x, y: screenPosition.y }
      );
    }

    setShowContextMenu(false);
  };

  // Handle custom amount damage/heal
  const handleCustomAmount = (type) => {
    setCustomAmountType(type);
    setShowCustomAmountModal(true);
    setShowContextMenu(false);
  };

  // Handle custom amount submission
  const handleCustomAmountSubmit = (amount) => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    switch (customAmountType) {
      case 'damage':
        handleDamageToken(numAmount);
        break;
      case 'heal':
        handleHealToken(numAmount);
        break;
      case 'mana-damage':
        handleManaDamage(numAmount);
        break;
      case 'mana-heal':
        handleManaHeal(numAmount);
        break;
    }

    setShowCustomAmountModal(false);
    setCustomAmountType('');
  };

  // Handle full heal
  const handleFullHeal = () => {
    if (!token || !creature) return;
    const maxHp = creature.stats.maxHp;
    const healAmount = maxHp - token.state.currentHp;
    if (healAmount > 0) {
      handleHealToken(healAmount);
    }
    setShowContextMenu(false);
  };

  // Handle kill (set health to 0)
  const handleKill = () => {
    if (!token || !creature) return;
    const damageAmount = token.state.currentHp;
    if (damageAmount > 0) {
      handleDamageToken(damageAmount);
    }
    setShowContextMenu(false);
  };

  // Handle mana damage
  const handleManaDamage = (amount) => {
    if (!token || !creature) return;
    const currentMana = token.state.currentMana || 0;
    const newMana = Math.max(0, currentMana - amount);


    updateTokenState(tokenId, {
      currentMana: newMana
    });

    // CRITICAL FIX: Sync Mana to combat timeline if in combat
    if (isInCombat) {
      const { updateCombatantMana } = useCombatStore.getState();
      updateCombatantMana(tokenId, newMana);
    }
  };

  // Handle mana heal
  const handleManaHeal = (amount) => {
    if (!token || !creature) return;
    const currentMana = token.state.currentMana || 0;
    const maxMana = creature.stats.maxMana || 0;
    const newMana = Math.min(maxMana, currentMana + amount);


    updateTokenState(tokenId, {
      currentMana: newMana
    });
  };

  // Handle full mana restore
  const handleFullManaRestore = () => {
    if (!token || !creature) return;
    const maxMana = creature.stats.maxMana || 0;
    const currentMana = token.state.currentMana || 0;
    const restoreAmount = maxMana - currentMana;

    if (restoreAmount > 0) {
      handleManaHeal(restoreAmount);
    }
    setShowContextMenu(false);
  };

  // Handle drain all mana (set mana to 0)
  const handleDrainAllMana = () => {
    if (!token || !creature) return;
    const currentMana = token.state.currentMana || 0;

    if (currentMana > 0) {
      handleManaDamage(currentMana);
    }
    setShowContextMenu(false);
  };

  // Handle click outside to close context menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
        setHoveredMenuItem(null);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  // If token not found, don't render anything
  if (!token) {
    console.error('Token not found with ID:', tokenId);
    return null;
  }

  // If creature not found, render a placeholder token
  if (!creature) {
    console.error('Creature not found with ID:', token.creatureId);
    return (
      <div
        ref={tokenRef}
        className="creature-token placeholder"
        style={{
          // CRITICAL: Always include position in React style to prevent jumping during re-renders
          left: screenPosition.x,
          top: screenPosition.y,
          backgroundColor: 'red',
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          fontSize: `${tokenSize * 0.3}px` // Scale font with token size
        }}
      >
        ?
      </div>
    );
  }



  // Determine health bar color based on percentage
  const getHealthBarColor = (percentage) => {
    if (percentage > 60) return '#4CAF50'; // Green
    if (percentage > 30) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  // Handle mouse down for dragging or combat selection
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    if (showContextMenu) return; // Don't start dragging if context menu is open

    // CRITICAL FIX: Set global flag to prevent grid click handling in production builds
    window.tokenInteractionActive = true;
    window.tokenInteractionTimestamp = Date.now();

    // CRITICAL FIX: Ensure event is properly stopped to prevent grid click handling
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection during drag

    // Removed excessive logging for performance

    // CRITICAL FIX: Players (non-GM) cannot move creature tokens - only GM can move them
    // Players can only move their own character tokens
    if (!isGMMode) {
      // In player mode, check if this is a creature token (not a character token)
      // Creature tokens don't have playerId or isPlayerToken flag
      const isCreatureToken = !token.playerId && !token.isPlayerToken;

      if (isCreatureToken) {
        // Players cannot move creature tokens - only GM can
        setShowTooltip(false);
        return;
      }

      // For character tokens in multiplayer, check ownership
      if (isInMultiplayer && token) {
        const { currentPlayer } = useGameStore.getState();
        const tokenPlayerId = token.playerId;

        // Allow movement if:
        // 1. Token's playerId matches current player's ID
        // 2. Token's playerId is 'current-player'
        // Block movement if token has a playerId that doesn't match
        if (tokenPlayerId && tokenPlayerId !== currentPlayer?.id && tokenPlayerId !== 'current-player') {
          // Cannot move - not your token
          setShowTooltip(false);
          return;
        }

        // Also check if this is a character token by checking creatureId
        if (token.creatureId) {
          const { currentCharacterId } = useCharacterStore.getState();
          if (token.creatureId !== currentCharacterId && tokenPlayerId && tokenPlayerId !== currentPlayer?.id) {
            // Cannot move - creature does not belong to you
            setShowTooltip(false);
            return;
          }
        }
      }
    }

    // If in selection mode, toggle selection instead of dragging
    if (isSelectionMode) {
      toggleTokenSelection(tokenId);
      setShowTooltip(false);
      return;
    }

    // If in combat and not this token's turn, prevent movement
    if (isInCombat && !isMyTurn) {
      setShowTooltip(false);
      return;
    }

    // Set mouse down state and store initial mouse position
    setIsMouseDown(true);
    isMouseDownRef.current = true;
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(false);

    // Calculate the offset from the cursor to the token's current screen position
    // This is the key to making the token follow the cursor correctly
    // Note: screenPosition is the center of the token (due to transform: translate(-50%, -50%))
    const calculatedOffset = {
      x: e.clientX - screenPosition.x,
      y: e.clientY - screenPosition.y
    };

    // Removed excessive logging for performance

    setDragOffset(calculatedOffset);

    // Store the starting position for potential movement
    setDragStartPosition({ x: position.x, y: position.y });

    // Removed excessive logging for performance
  };

  // Handle click events on the token (separate from mousedown for dragging)
  const handleTokenClick = (e) => {
    // CRITICAL FIX: Set global flag to prevent grid click handling (production build safety)
    window.tokenInteractionActive = true;
    window.tokenInteractionTimestamp = Date.now();

    // CRITICAL FIX: Prevent click events from bubbling to grid
    e.stopPropagation();
    e.preventDefault();

    // Removed excessive logging for performance

    // Mobile: tap to toggle tooltip (hover doesn't exist)
    if (!isDragging && lastPointerTypeRef.current === 'touch') {
      setShowTooltip(prev => {
        const next = !prev;
        if (next) {
          showTooltipNow();
        }
        return next;
      });
    }

    // Clear the flag after a short delay to allow normal grid interactions
    setTimeout(() => {
      window.tokenInteractionActive = false;
      window.tokenInteractionTimestamp = null;
    }, 100);
  };
  // Check if token should be hidden from players
  const isHiddenFromPlayers = token.state.hiddenFromPlayers;
  const shouldHideToken = isHiddenFromPlayers && !isGMMode;

  // Don't render the token if it should be hidden
  if (shouldHideToken) {
    return null;
  }

  // Don't render if not visible based on FOV (unless in GM mode or not viewing from a token)
  if (!isTokenVisible) {
    return null;
  }

  return (
    <>
      <div
        ref={tokenRef}
        className={`creature-token ${isDragging ? 'dragging' : ''} ${isTargeted ? 'targeted' : ''} ${isSelectedForCombat ? 'selected-for-combat' : ''} ${isMyTurn ? 'my-turn' : ''} ${isHiddenFromPlayers && isGMMode ? 'gm-hidden' : ''} ${isViewingFrom ? 'viewing-from' : ''}`}
        style={{
          // CRITICAL: Always include position in React style to prevent jumping during re-renders
          left: screenPosition.x,
          top: screenPosition.y,
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
          cursor: isSelectionMode ? 'pointer' : (isInCombat && !isMyTurn) ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
          zIndex: isDragging ? 1000 : 150, // Higher z-index to be above ObjectSystem canvas (20) and grid tiles (10)
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          pointerEvents: showRenameInput ? 'none' : 'auto', // Disable pointer events when renaming
          touchAction: 'none',
          borderRadius: '50%',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: creature.isShopkeeper ? '#FFD700' : isViewingFrom ? '#00BFFF' : (isMyTurn ? '#FFD700' : isSelectedForCombat ? '#00FF00' : isTargeted ? '#FF9800' : creature.tokenBorder),
          overflow: 'visible',
          opacity: isGreyedOut ? 0.4 : 1, // Greyed out when in explored but not visible
          filter: isGreyedOut ? 'grayscale(0.8) brightness(0.6)' : 'none', // Grey filter for explored areas
          boxShadow: creature.isShopkeeper
            ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
            : isViewingFrom
              ? '0 0 25px rgba(0, 191, 255, 1), 0 0 15px rgba(0, 191, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
              : isMyTurn
                ? '0 0 20px rgba(255, 215, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
                : isSelectedForCombat
                  ? '0 0 15px rgba(0, 255, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
                  : isTargeted
                    ? '0 0 15px rgba(255, 152, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={showRenameInput ? undefined : handleMouseEnter}
        onMouseLeave={showRenameInput ? undefined : handleMouseLeave}
        onMouseDown={showRenameInput ? undefined : handleMouseDown}
        onPointerDown={showRenameInput ? undefined : (e) => {
          lastPointerTypeRef.current = e.pointerType || 'mouse';
          longPressHandlers.onPointerDown(e);
          if (e.pointerType === 'touch') {
            handleMouseDown(e);
          }
        }}
        onPointerMove={showRenameInput ? undefined : longPressHandlers.onPointerMove}
        onPointerUp={showRenameInput ? undefined : longPressHandlers.onPointerUp}
        onPointerCancel={showRenameInput ? undefined : longPressHandlers.onPointerCancel}
        onClick={showRenameInput ? undefined : handleTokenClick}
      >
        {/* Condition rings with text - staggered outward for multiple conditions */}
        {conditionEffects.map((effect, index) => {
          const pathId = `${tokenId}-${effect.key}-ring-path`;
          const label = (effect.label || effect.key || '').toString().toUpperCase();
          const separator = ' \u2022 ';

          // Calculate ring radius - each subsequent ring is pushed outward
          // Base radius starts at 52 (in a 140x140 viewBox), increment by 14 per ring
          const baseRadius = 52;
          const radiusIncrement = 14;
          const radius = baseRadius + (index * radiusIncrement);
          const startY = 70 - radius; // Center is at 70,70

          // Calculate circumference and how many times to repeat text
          // Circumference = 2 * PI * radius
          const circumference = 2 * Math.PI * radius;
          // Estimate text width per repetition (label + separator)
          // Each char is roughly 6px with letter-spacing at font-size 10px
          const labelWithSep = label + separator;
          const estCharWidth = 6;
          const estTextWidth = labelWithSep.length * estCharWidth;
          // Calculate exact fit - use floor to avoid overlap, minimum 3 repetitions
          const repeatCount = Math.max(3, Math.floor(circumference / estTextWidth));
          const wrappedText = Array(repeatCount).fill(labelWithSep).join('');

          // Animation delay for visual variety (stagger rotation start)
          const animationDelay = index * -5; // seconds offset

          // Calculate percentage-based sizing so rings scale with token zoom
          // Base extension is 30% beyond token, each ring adds 20% more
          const baseExtension = 30 + (index * 20);

          return (
            <div
              className={`condition-ring-wrapper condition-ring-${index}`}
              key={effect.key}
              style={{
                '--ring-index': index,
                '--ring-radius': radius,
                animationDelay: `${animationDelay}s`,
                // Use percentage-based sizing so rings scale with token
                inset: `${-baseExtension}%`,
                width: `${100 + (baseExtension * 2)}%`,
                height: `${100 + (baseExtension * 2)}%`,
              }}
            >
              <svg
                className={`condition-ring-svg ${effect.key}`}
                viewBox="0 0 140 140"
                aria-hidden="true"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <path
                    id={pathId}
                    d={`M70,${startY} a${radius},${radius} 0 1,1 0,${radius * 2} a${radius},${radius} 0 1,1 0,-${radius * 2}`}
                  />
                </defs>
                <text
                  className={`condition-ring-text condition-text-${effect.key}`}
                  textLength={circumference * 0.98}
                  lengthAdjust="spacing"
                >
                  <textPath href={`#${pathId}`} startOffset="0%">
                    {wrappedText}
                  </textPath>
                </text>
              </svg>
            </div>
          );
        })}

        <div
          className="token-icon"
          style={{
            backgroundImage: `url(${token.state.customIcon || getCreatureTokenIconUrl(creature.tokenIcon, creature.type)})`,
            width: '100%',
            height: '100%',
            backgroundSize: `${token.state.iconScale || 100}%`,
            backgroundPosition: `${token.state.iconPosition?.x || 50}% ${token.state.iconPosition?.y || 50}%`,
            borderRadius: '50%'
          }}
        ></div>


        {/* Health bar removed - health is visible in HUD and hover tooltip */}

        {/* Test Button for Tooltip - Removed per user request */}
      </div>

      {/* Compact Context Menu */}
      {showContextMenu && (() => {
        // Build context menu items
        const menuItems = [];

        // Token Actions submenu
        const tokenActionsSubmenu = [
          {
            icon: <i className="fas fa-search"></i>,
            label: 'Inspect',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleViewDetails();
            }
          }
        ];

        if (creature.isShopkeeper) {
          tokenActionsSubmenu.push({
            icon: <i className="fas fa-store"></i>,
            label: 'Open Shop',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleOpenShop();
            }
          });
        }

        tokenActionsSubmenu.push(
          {
            icon: <i className="fas fa-crosshairs"></i>,
            label: isTargeted ? 'Clear Target' : 'Target',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleTargetCreature();
            },
            className: isTargeted ? 'active' : ''
          },
          {
            icon: <i className="fas fa-copy"></i>,
            label: 'Duplicate',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleDuplicateToken();
            }
          },
          // CRITICAL: Only allow GM to view from creature tokens - players can only view from their own character tokens
          ...(isGMMode ? [{
            icon: <i className="fas fa-eye"></i>,
            label: isViewingFrom ? 'Deselect View from Token' : 'View from Token',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              const levelEditorStore = useLevelEditorStore.getState();
              if (isViewingFrom) {
                // Deselect view from token
                levelEditorStore.setViewingFromToken(null);
              } else if (position) {
                // Enable dynamic fog if not already enabled
                const { dynamicFogEnabled, setDynamicFogEnabled } = levelEditorStore;
                if (!dynamicFogEnabled) {
                  setDynamicFogEnabled(true);
                }
                // Reset the disabled flag since GM is explicitly enabling it
                levelEditorStore.playerViewFromTokenDisabled = false;
                // Set this token as the viewing token (restricts fog reveal to token's vision)
                const tokenData = {
                  type: 'creature',
                  id: token.id,
                  creatureId: token.creatureId,
                  position: position
                };
                levelEditorStore.setViewingFromToken(tokenData);
                // Center camera on token initially (but don't lock it)
                const gameStore = useGameStore.getState();
                gameStore.setCameraPosition(position.x, position.y);
              }
            },
            className: isViewingFrom ? 'active' : ''
          }] : []),
          {
            icon: <i className="fas fa-tag"></i>,
            label: 'Rename',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleRenameToken();
            }
          },
          {
            icon: <i className="fas fa-image"></i>,
            label: 'Change Icon',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleChangeIcon();
            }
          },
          {
            icon: <i className="fas fa-edit"></i>,
            label: 'Edit',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleEditCreature();
            }
          },
          {
            icon: <i className="fas fa-trash"></i>,
            label: 'Remove',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowContextMenu(false);
              handleRemoveToken();
            },
            className: 'danger'
          }
        );

        if (isGMMode) {
          tokenActionsSubmenu.push({
            icon: <i className={`fas ${token.state.hiddenFromPlayers ? 'fa-eye' : 'fa-eye-slash'}`}></i>,
            label: token.state.hiddenFromPlayers ? 'Show to Players' : 'Hide from Players',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              updateTokenState(tokenId, {
                hiddenFromPlayers: !token.state.hiddenFromPlayers
              });
              setShowContextMenu(false);
            },
            className: token.state.hiddenFromPlayers ? 'active' : ''
          });
        }

        menuItems.push({
          icon: <i className="fas fa-cog"></i>,
          label: 'Token Actions',
          submenu: tokenActionsSubmenu
        });

        // Health submenu
        menuItems.push({
          icon: <i className="fas fa-heart"></i>,
          label: 'Health',
          submenu: [
            {
              icon: <i className="fas fa-minus-circle"></i>,
              label: 'Damage (5)',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleDamageToken(5);
              }
            },
            {
              icon: <i className="fas fa-minus-circle"></i>,
              label: 'Damage (10)',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleDamageToken(10);
              }
            },
            {
              icon: <i className="fas fa-edit"></i>,
              label: 'Custom Damage',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleCustomAmount('damage');
              }
            },
            { type: 'separator' },
            {
              icon: <i className="fas fa-plus-circle"></i>,
              label: 'Heal (5)',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleHealToken(5);
              }
            },
            {
              icon: <i className="fas fa-plus-circle"></i>,
              label: 'Heal (10)',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleHealToken(10);
              }
            },
            {
              icon: <i className="fas fa-edit"></i>,
              label: 'Custom Heal',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleCustomAmount('heal');
              }
            },
            { type: 'separator' },
            {
              icon: <i className="fas fa-heart"></i>,
              label: 'Full Heal',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleFullHeal();
              },
              className: 'heal'
            },
            {
              icon: <i className="fas fa-skull"></i>,
              label: 'Kill',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleKill();
              },
              className: 'danger'
            }
          ]
        });

        // Mana submenu - Only show if creature has mana
        if (creature && creature.stats.maxMana > 0) {
          menuItems.push({
            icon: <i className="fas fa-magic"></i>,
            label: 'Mana',
            submenu: [
              {
                icon: <i className="fas fa-minus-circle"></i>,
                label: 'Drain (5)',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleManaDamage(5);
                }
              },
              {
                icon: <i className="fas fa-minus-circle"></i>,
                label: 'Drain (10)',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleManaDamage(10);
                }
              },
              {
                icon: <i className="fas fa-edit"></i>,
                label: 'Custom Drain',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleCustomAmount('mana-damage');
                }
              },
              { type: 'separator' },
              {
                icon: <i className="fas fa-plus-circle"></i>,
                label: 'Restore (5)',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleManaHeal(5);
                }
              },
              {
                icon: <i className="fas fa-plus-circle"></i>,
                label: 'Restore (10)',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleManaHeal(10);
                }
              },
              {
                icon: <i className="fas fa-edit"></i>,
                label: 'Custom Restore',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleCustomAmount('mana-heal');
                }
              },
              { type: 'separator' },
              {
                icon: <i className="fas fa-magic"></i>,
                label: 'Full Restore',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleFullManaRestore();
                },
                className: 'heal'
              },
              {
                icon: <i className="fas fa-ban"></i>,
                label: 'Drain All',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowContextMenu(false);
                  handleDrainAllMana();
                },
                className: 'danger'
              }
            ]
          });
        }

        // Status submenu
        menuItems.push({
          icon: <i className="fas fa-magic"></i>,
          label: 'Status',
          submenu: [
            {
              icon: <i className="fas fa-bolt"></i>,
              label: 'Conditions',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContextMenu(false);
                handleOpenConditions();
              }
            },
            {
              icon: <i className="fas fa-plus-circle"></i>,
              label: 'Add Buff/Debuff',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenBuffDebuffCreator();
              }
            },
            {
              icon: <i className="fas fa-shield-alt"></i>,
              label: 'Toggle Defense',
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Toggle defensive stance
                const currentConditions = token.state.conditions || [];
                const hasDefending = currentConditions.some(c => c.id === 'defending');

                if (hasDefending) {
                  // Remove defending condition
                  const updatedConditions = currentConditions.filter(c => c.id !== 'defending');
                  updateTokenState(tokenId, { conditions: updatedConditions });

                  // Remove from buff store
                  const { activeBuffs, removeBuff } = useBuffStore.getState();
                  const buffToRemove = activeBuffs.find(b =>
                    b.name === 'Defending' && b.targetId === tokenId
                  );
                  if (buffToRemove) {
                    removeBuff(buffToRemove.id);
                  }
                } else {
                  // Add defending condition
                  const defendingCondition = {
                    id: 'defending',
                    name: 'Defending',
                    description: 'Increased armor and damage resistance',
                    type: 'buff',
                    color: '#4682B4',
                    icon: 'fas fa-shield-alt',
                    severity: 'beneficial',
                    appliedAt: Date.now(),
                    duration: 600000,
                    source: 'manual'
                  };
                  const updatedConditions = [...currentConditions, defendingCondition];
                  updateTokenState(tokenId, { conditions: updatedConditions });

                  // Add to buff store
                  const { addBuff } = useBuffStore.getState();
                  addBuff({
                    name: 'Defending',
                    description: 'Increased armor and damage resistance',
                    duration: 600,
                    effects: { armor: 2 },
                    source: 'condition',
                    targetId: tokenId,
                    targetType: 'token',
                    icon: 'fas fa-shield-alt',
                    color: '#4682B4'
                  });
                }
                setShowContextMenu(false);
              }
            }
          ]
        });

        return createPortal(
          <div
            ref={contextMenuRef}
            className="context-menu-container"
            style={{
              position: 'fixed',
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              zIndex: 10000,
              backgroundColor: '#f0e6d2',
              border: '2px solid #a08c70',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              fontFamily: "'Bookman Old Style', 'Garamond', serif",
              color: '#7a3b2e',
              padding: '8px',
              display: 'flex',
              gap: '0',
              minWidth: hoveredMenuItem !== null && menuItems[hoveredMenuItem]?.submenu ? '280px' : '160px'
            }}
            onMouseLeave={() => {
              // Close menu when mouse leaves entire container
              setHoveredMenuItem(null);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main menu items */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.type === 'separator' ? (
                    <hr style={{
                      border: 'none',
                      borderTop: '1px solid #a08c70',
                      margin: '4px 0',
                      width: '100%'
                    }} />
                  ) : (
                    <button
                      className="context-menu-button"
                      style={{
                        pointerEvents: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        border: '1px solid #a08c70',
                        borderRadius: '4px',
                        backgroundColor: hoveredMenuItem === index ? '#e8dcc0' : (item.className === 'danger' ? '#ffebee' : '#d4c4a8'),
                        color: '#7a3b2e',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: "'Bookman Old Style', 'Garamond', serif",
                        width: '100%',
                        textAlign: 'left',
                        margin: '2px 0',
                        minWidth: '140px'
                      }}
                      onMouseEnter={() => {
                        setHoveredMenuItem(index);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.submenu) {
                          // Don't close on submenu items, just keep submenu open
                          return;
                        }
                        if (item.onClick) {
                          item.onClick(e);
                        }
                      }}
                      disabled={item.disabled}
                      title={item.title}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.submenu && <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '10px' }} />}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Submenu - always rendered but only visible when hovering */}
            {menuItems[hoveredMenuItem]?.submenu && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#f0e6d2',
                  border: '1px solid #a08c70',
                  borderLeft: 'none',
                  borderRadius: '0 4px 4px 0',
                  padding: '8px 4px',
                  minWidth: '130px',
                  marginLeft: '4px',
                  opacity: hoveredMenuItem !== null ? 1 : 0,
                  visibility: hoveredMenuItem !== null ? 'visible' : 'hidden',
                  transition: 'opacity 0.1s ease, visibility 0.1s ease'
                }}
              >
                {menuItems[hoveredMenuItem].submenu.map((subItem, subIndex) => (
                  <React.Fragment key={subIndex}>
                    {subItem.type === 'separator' ? (
                      <hr style={{
                        border: 'none',
                        borderTop: '1px solid #a08c70',
                        margin: '2px 0',
                        width: '100%'
                      }} />
                    ) : (
                      <button
                        className="context-menu-button"
                        style={{
                          pointerEvents: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          border: '1px solid #a08c70',
                          borderRadius: '3px',
                          backgroundColor: subItem.className === 'danger' ? '#ffebee' : '#d4c4a8',
                          color: '#7a3b2e',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontFamily: "'Bookman Old Style', 'Garamond', serif",
                          width: '100%',
                          textAlign: 'left',
                          margin: '1px 0'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (subItem.onClick) {
                            subItem.onClick(e);
                          }
                        }}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>,
          document.body
        );
      })()}

      {/* Character-style Tooltip */}
      {showTooltip && (() => {
        // Rendering tooltip
        return createPortal(
          <div
            className="pf-character-tooltip"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              position: 'fixed',
              zIndex: 10000,
              backgroundColor: '#f0e6d2',
              border: '2px solid #a08c70',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              fontFamily: "'Bookman Old Style', 'Garamond', serif",
              fontSize: '12px',
              color: '#7a3b2e',
              pointerEvents: 'none',
              maxWidth: '280px',
              minWidth: '200px',
              transform: tooltipPosition.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none'
            }}
          >
            {/* Creature Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              borderBottom: '1px solid #a08c70',
              paddingBottom: '6px'
            }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundImage: token.state.customIcon
                    ? `url(${token.state.customIcon})`
                    : `url(${getCreatureTokenIconUrl(creature.tokenIcon, creature.type)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: `2px solid ${creature.tokenBorder}`
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {token.state.customName || creature.name}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.7 }}>
                  {creature.race && `${creature.race} `}
                  {creature.size} {creature.type}
                  {creature.class && ` • ${creature.class}`}
                </div>
              </div>
            </div>

            {/* Health and Resources */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Health:</span>
                <span style={{ color: (token.state.currentHp / creature.stats.maxHp) > 0.5 ? '#4CAF50' : (token.state.currentHp / creature.stats.maxHp) > 0.25 ? '#FF9800' : '#F44336' }}>
                  {token.state.currentHp}/{creature.stats.maxHp}
                </span>
              </div>
              {creature.stats.maxMana > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>Mana:</span>
                  <span style={{ color: '#2196F3' }}>
                    {token.state.currentMana || 0}/{creature.stats.maxMana}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Action Points:</span>
                <span style={{ color: '#9C27B0' }}>
                  {(() => {
                    const combatState = useCombatStore.getState();
                    const combatant = combatState.turnOrder.find(c => c.tokenId === tokenId);
                    if (combatant && combatState.isInCombat) {
                      return `${combatant.currentActionPoints}/${combatant.maxActionPoints}`;
                    }
                    // Fallback to token state or creature stats if not in combat
                    const currentAP = token.state.currentActionPoints || creature.stats.currentActionPoints || creature.stats.maxActionPoints;
                    const maxAP = creature.stats.maxActionPoints;
                    return `${currentAP}/${maxAP}`;
                  })()}
                </span>
              </div>
              {/* Movement info during combat */}
              {isInCombat && (() => {
                const combatState = useCombatStore.getState();
                const movementInfo = combatState.getMovementInfo ? combatState.getMovementInfo(tokenId, [creature]) : null;
                if (!movementInfo) return null;

                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>Movement:</span>
                    <span style={{ color: '#059669' }}>
                      {Math.round(movementInfo.movementUsed)}/{movementInfo.unlockedMovement || movementInfo.creatureSpeed}ft
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Combat Status */}
            {isInCombat && (
              <div style={{
                borderTop: '1px solid #a08c70',
                paddingTop: '6px',
                fontSize: '10px',
                fontStyle: 'italic'
              }}>
                {isMyTurn ? (
                  <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Current Turn</span>
                ) : (
                  <span style={{ color: '#666' }}>Waiting for turn</span>
                )}
              </div>
            )}

            {/* Target Status */}
            {isTargeted && (
              <div style={{
                borderTop: '1px solid #a08c70',
                paddingTop: '6px',
                fontSize: '10px',
                fontStyle: 'italic',
                color: '#FF9800',
                fontWeight: 'bold'
              }}>
                Targeted
              </div>
            )}

            {/* Active Conditions - Combined from token state and buff/debuff stores */}
            {(() => {
              // Combine all active effects from different sources
              const tokenConditions = token.state.conditions || [];
              const tokenBuffs = (activeBuffs || []).filter(b => b.targetId === tokenId);
              const tokenDebuffs = (activeDebuffs || []).filter(d => d.targetId === tokenId);

              // Build combined list, avoiding duplicates by name
              const seenNames = new Set();
              const allEffects = [];

              // Add from buff/debuff stores first (they have more data)
              [...tokenBuffs, ...tokenDebuffs].forEach(effect => {
                if (!seenNames.has(effect.name)) {
                  seenNames.add(effect.name);
                  allEffects.push({
                    name: effect.name,
                    description: effect.description,
                    effectSummary: effect.effectSummary,
                    type: effect.type || (tokenBuffs.includes(effect) ? 'buff' : 'debuff'),
                    color: effect.color,
                    icon: effect.icon,
                    durationType: effect.durationType,
                    durationValue: effect.durationValue,
                    remainingRounds: effect.remainingRounds,
                    endTime: effect.endTime,
                    startTime: effect.startTime,
                    duration: effect.duration
                  });
                }
              });

              // Add remaining conditions from token state
              tokenConditions.forEach(condition => {
                if (!seenNames.has(condition.name)) {
                  seenNames.add(condition.name);
                  allEffects.push(condition);
                }
              });

              if (allEffects.length === 0) return null;

              const conditionDescriptions = {
                'Confused': 'Target must roll d10 each turn: 1-move random, 2-6-do nothing, 7-8-attack random, 9-10-act normal',
                'Stunned': 'Target can\'t move, speak, or take actions/reactions',
                'Paralyzed': 'Target can\'t move or speak, auto-fails STR/AGI saves, adv. attacks vs target, crit on hit within 5ft',
                'Frightened': 'Disadv. on checks/attacks while source in sight, can\'t move closer to source',
                'Charmed': 'Can\'t attack charmer, charmer has adv. on social checks, charmer chooses target\'s movement',
                'Poisoned': 'Disadv. on attack rolls and ability checks',
                'Blinded': 'Can\'t see, auto-fails sight checks, adv. attacks vs target, target\'s attacks disadv.',
                'Deafened': 'Can\'t hear, auto-fails hearing checks',
                'Restrained': 'Speed 0, can\'t benefit from speed bonuses, disadv. on Agility saves, adv. attacks vs target',
                'Grappled': 'Speed 0, ends if grappler incapacitated or effect removed from grappler\'s reach',
                'Prone': 'Can only crawl, disadv. on attacks, adv. attacks vs target within 5ft (disadv. beyond 5ft)',
                'Incapacitated': 'Can\'t take actions or reactions',
                'Unconscious': 'Incapacitated, unaware, auto-fails STR/AGI saves, prone, adv. attacks vs target, crit within 5ft'
              };

              return (
                <div style={{
                  borderTop: '1px solid #a08c70',
                  paddingTop: '6px',
                  fontSize: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    Active Effects:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {allEffects.slice(0, 4).map((effect, index) => {
                      const remaining = getConditionRemaining(effect).label;
                      const detailedDesc = conditionDescriptions[effect.name] || effect.effectSummary || effect.description || 'Effect active';
                      const effectColor = effect.type === 'buff' ? '#32CD32' : effect.type === 'debuff' ? '#DC143C' : '#666';

                      return (
                        <div
                          key={index}
                          style={{
                            color: '#333',
                            fontWeight: 500,
                            lineHeight: '1.3',
                            borderLeft: `3px solid ${effect.color || effectColor}`,
                            paddingLeft: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {effect.icon && <i className={effect.icon} style={{ color: effect.color || effectColor, fontSize: '10px' }}></i>}
                            <span style={{ fontWeight: 'bold' }}>{effect.name}</span>
                            {remaining && (
                              <span style={{ color: '#666', fontSize: '9px' }}>
                                ({remaining})
                              </span>
                            )}
                          </div>
                          {effect.effectSummary && (
                            <div style={{ fontSize: '9px', color: '#7a3b2e', marginTop: '1px', fontWeight: '600' }}>
                              {effect.effectSummary}
                            </div>
                          )}
                          {effect.description && effect.description !== effect.effectSummary && (
                            <div style={{ fontSize: '9px', color: '#555', marginTop: '1px', fontStyle: 'italic' }}>
                              {effect.description}
                            </div>
                          )}
                          {!effect.effectSummary && !effect.description && conditionDescriptions[effect.name] && (
                            <div style={{ fontSize: '9px', color: '#555', marginTop: '1px', fontStyle: 'italic' }}>
                              {conditionDescriptions[effect.name]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {allEffects.length > 4 && (
                      <span style={{ color: '#666', fontWeight: 600, fontSize: '9px' }}>
                        +{allEffects.length - 4} more effects...
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>,
          document.body
        );
      })()}

      {/* Enhanced Creature Inspect View */}
      <EnhancedCreatureInspectView
        creature={creature}
        token={token}
        isOpen={showDetailsWindow}
        onClose={handleCloseDetailsWindow}
      />

      {/* Creature Editor Window */}
      {showCreatureEditor && createPortal(
        <WowWindow
          title={`Edit Creature: ${creature.name}`}
          isOpen={true}
          onClose={handleCloseCreatureEditor}
          defaultSize={{ width: 1200, height: 800 }}
          defaultPosition={{ x: 100, y: 100 }}
        >
          <div className="creature-editor-wrapper">
            <CreatureWindow
              initialCreatureId={creature.id}
              initialView="wizard"
              onClose={handleCloseCreatureEditor}
            />
          </div>
        </WowWindow>,
        document.body
      )}

      {/* Movement Visualization - Now rendered at Grid level for correct positioning */}

      {/* Movement Confirmation Dialog */}
      <MovementConfirmationDialog
        isOpen={!!pendingMovementConfirmation}
        onConfirm={handleConfirmMovement}
        onCancel={handleCancelMovement}
        movementData={pendingMovementConfirmation}
        position={{ x: 400, y: 300 }}
      />

      {/* Conditions Window */}
      <ConditionsWindow
        isOpen={showConditionsWindow}
        onClose={() => setShowConditionsWindow(false)}
        tokenId={tokenId}
        creature={creature}
      />

      {/* Buff/Debuff Creator Modal */}
      <BuffDebuffCreatorModal
        isOpen={showBuffDebuffCreator}
        onClose={() => {
          setShowBuffDebuffCreator(false);
          setBuffDebuffInitialType(null);
        }}
        tokenId={tokenId}
        creature={creature}
        initialType={buffDebuffInitialType}
      />

      {/* Shop Window */}
      {creature.isShopkeeper && (
        <ShopWindow
          isOpen={showShopWindow}
          onClose={() => setShowShopWindow(false)}
          creature={creature}
        />
      )}

      {/* Inline Rename Input */}
      {showRenameInput && (
        <div
          className="token-rename-input"
          style={{
            position: 'absolute',
            left: screenPosition.x,
            top: screenPosition.y - 80, // Position further above the token to avoid overlap
            transform: 'translateX(-50%)',
            zIndex: 2000,
            pointerEvents: 'auto', // Ensure this element can receive pointer events
            background: 'linear-gradient(135deg, #f4e4bc 0%, #e8d5a6 100%)',
            border: '2px solid #8b4513',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <input
            ref={renameInputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmRename();
              } else if (e.key === 'Escape') {
                handleCancelRename();
              }
            }}
            onBlur={(e) => {
              // Don't cancel if clicking on buttons
              if (!e.relatedTarget || !e.relatedTarget.closest('.token-rename-input')) {
                handleCancelRename();
              }
            }}
            style={{
              background: '#fff8e7',
              border: '1px solid #8b4513',
              borderRadius: '3px',
              color: '#2c1810',
              padding: '4px 6px',
              fontSize: '12px',
              width: '120px',
              outline: 'none',
              fontFamily: 'serif'
            }}
            placeholder="Enter name..."
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur
              handleConfirmRename();
            }}
            style={{
              background: 'linear-gradient(135deg, #6b8e23 0%, #556b2f 100%)',
              border: '1px solid #2f4f2f',
              borderRadius: '3px',
              color: '#fff',
              padding: '4px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              minWidth: '20px',
              fontWeight: 'bold',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            title="Confirm"
          >
            ✓
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent input blur
              handleCancelRename();
            }}
            style={{
              background: 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
              border: '1px solid #4a2c17',
              borderRadius: '3px',
              color: '#fff',
              padding: '4px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              minWidth: '20px',
              fontWeight: 'bold',
              textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            title="Cancel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Icon Editor Modal */}
      {showIconEditor && createPortal(
        <div className="modal-overlay" onClick={handleCancelIconChange}>
          <div
            className="modal-content icon-editor-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #f4e4bc 0%, #e8d5a6 100%)',
              border: '3px solid #8b4513',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="modal-header" style={{
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '10px',
              borderBottom: '2px solid #8b4513'
            }}>
              <h3 style={{
                color: '#2c1810',
                fontFamily: 'serif',
                fontSize: '20px',
                margin: '0',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                fontWeight: 'bold'
              }}>
                Change Token Icon
              </h3>
              <button
                className="modal-close"
                onClick={handleCancelIconChange}
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
                  border: '1px solid #4a2c17',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '14px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* URL Input Section */}
              <div className="form-section" style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(255, 248, 231, 0.5)',
                border: '1px solid #d4b896',
                borderRadius: '6px'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c1810',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'serif'
                }}>
                  <i className="fas fa-link" style={{ marginRight: '6px', color: '#8b4513' }}></i>
                  Image URL:
                </label>
                <input
                  type="text"
                  value={newIconUrl}
                  onChange={(e) => setNewIconUrl(e.target.value)}
                  placeholder="Paste image URL here..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #8b4513',
                    borderRadius: '6px',
                    background: '#fff',
                    color: '#2c1810',
                    fontSize: '13px',
                    fontFamily: 'serif',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'border-color 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6b8e23'}
                  onBlur={(e) => e.target.style.borderColor = '#8b4513'}
                />
              </div>

              {/* File Upload Section */}
              <div className="form-section" style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(255, 248, 231, 0.5)',
                border: '1px solid #d4b896',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  color: '#2c1810',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'serif'
                }}>
                  <i className="fas fa-upload" style={{ marginRight: '6px', color: '#8b4513' }}></i>
                  Or Upload File:
                </label>
                <button
                  onClick={triggerFileUpload}
                  style={{
                    background: 'linear-gradient(135deg, #6b8e23 0%, #556b2f 100%)',
                    border: '2px solid #2f4f2f',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'serif'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                  Choose Image File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Preview Section */}
              {newIconUrl && (
                <div className="preview-section" style={{
                  background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc6 100%)',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #8b4513',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{
                    color: '#2c1810',
                    margin: '0 0 15px 0',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'serif',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                  }}>
                    <i className="fas fa-eye" style={{ marginRight: '8px', color: '#8b4513' }}></i>
                    Preview
                  </h4>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '25px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #d4b896'
                  }}>
                    {/* Token Preview */}
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        border: '3px solid #8b4513',
                        backgroundImage: `url(${newIconUrl})`,
                        backgroundSize: `${iconScale}%`,
                        backgroundPosition: `${iconPosition.x}% ${iconPosition.y}%`,
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                        flexShrink: 0
                      }}
                    />

                    {/* Controls */}
                    <div style={{ flex: 1 }}>
                      {/* Position Controls */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{
                          color: '#2c1810',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: '10px',
                          fontFamily: 'serif'
                        }}>
                          <i className="fas fa-arrows-alt" style={{ marginRight: '6px', color: '#8b4513' }}></i>
                          Position:
                        </label>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '4px'
                        }}>
                          <span style={{
                            color: '#2c1810',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '20px',
                            fontFamily: 'serif'
                          }}>X:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={iconPosition.x}
                            onChange={(e) => setIconPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                            style={{
                              flex: 1,
                              height: '6px',
                              background: '#d4b896',
                              borderRadius: '3px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{
                            color: '#8b4513',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '35px',
                            textAlign: 'right',
                            fontFamily: 'serif'
                          }}>{iconPosition.x}%</span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '4px'
                        }}>
                          <span style={{
                            color: '#2c1810',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '20px',
                            fontFamily: 'serif'
                          }}>Y:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={iconPosition.y}
                            onChange={(e) => setIconPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                            style={{
                              flex: 1,
                              height: '6px',
                              background: '#d4b896',
                              borderRadius: '3px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{
                            color: '#8b4513',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '35px',
                            textAlign: 'right',
                            fontFamily: 'serif'
                          }}>{iconPosition.y}%</span>
                        </div>
                      </div>

                      {/* Scale Control */}
                      <div>
                        <label style={{
                          color: '#2c1810',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: '10px',
                          fontFamily: 'serif'
                        }}>
                          <i className="fas fa-expand-arrows-alt" style={{ marginRight: '6px', color: '#8b4513' }}></i>
                          Scale:
                        </label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '4px'
                        }}>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={iconScale}
                            onChange={(e) => setIconScale(parseInt(e.target.value))}
                            style={{
                              flex: 1,
                              height: '6px',
                              background: '#d4b896',
                              borderRadius: '3px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{
                            color: '#8b4513',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            width: '45px',
                            textAlign: 'right',
                            fontFamily: 'serif'
                          }}>{iconScale}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginTop: '25px',
              paddingTop: '20px',
              borderTop: '2px solid #8b4513'
            }}>
              <button
                onClick={handleCancelIconChange}
                style={{
                  background: 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
                  border: '2px solid #4a2c17',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '12px 24px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'serif',
                  minWidth: '120px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                Cancel
              </button>
              <button
                onClick={handleConfirmIconChange}
                style={{
                  background: 'linear-gradient(135deg, #6b8e23 0%, #556b2f 100%)',
                  border: '2px solid #2f4f2f',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '12px 24px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'serif',
                  minWidth: '120px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
              >
                <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                Apply Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Amount Modal */}
      {showCustomAmountModal && createPortal(
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001
          }}
          onClick={() => {
            setShowCustomAmountModal(false);
            setCustomAmountType('');
          }}
        >
          <div
            className="custom-amount-modal"
            style={{
              backgroundColor: '#f0e6d2',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              padding: '20px',
              minWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#8B4513' }}>
              Enter {
                customAmountType === 'damage' ? 'Damage' :
                  customAmountType === 'heal' ? 'Heal' :
                    customAmountType === 'mana-damage' ? 'Mana Drain' :
                      customAmountType === 'mana-heal' ? 'Mana Restore' :
                        'Amount'
              } Amount
            </h3>
            <input
              type="number"
              min="1"
              placeholder="Enter amount..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #8B4513',
                borderRadius: '4px',
                fontSize: '16px',
                textAlign: 'center'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomAmountSubmit(e.target.value);
                } else if (e.key === 'Escape') {
                  setShowCustomAmountModal(false);
                  setCustomAmountType('');
                }
              }}
            />
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4a8a4a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                onClick={(e) => {
                  const input = e.target.parentElement.parentElement.querySelector('input');
                  handleCustomAmountSubmit(input.value);
                }}
              >
                Apply
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                onClick={() => {
                  setShowCustomAmountModal(false);
                  setCustomAmountType('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// CRITICAL FIX: Wrap in React.memo to prevent unnecessary re-renders
// This prevents parent component re-renders from forcing token re-renders
// Only re-render when tokenId, position, or onRemove actually change
export default React.memo(CreatureToken, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  // Return false if props changed (do re-render)
  return (
    prevProps.tokenId === nextProps.tokenId &&
    prevProps.position?.x === nextProps.position?.x &&
    prevProps.position?.y === nextProps.position?.y &&
    prevProps.onRemove === nextProps.onRemove
  );
});
