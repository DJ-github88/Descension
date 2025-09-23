import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './CreatureToken.css';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useTargetingStore, { TARGET_TYPES } from '../../store/targetingStore';
import useCombatStore from '../../store/combatStore';
import useBuffStore from '../../store/buffStore';
// Removed useEnhancedMultiplayer import - hook was removed
import TurnTimer from '../combat/TurnTimer';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import MovementVisualization from './MovementVisualization';
import MovementConfirmationDialog from '../combat/MovementConfirmationDialog';
import '../../styles/creature-token.css';
import '../../styles/unified-context-menu.css';
import WowWindow from '../windows/WowWindow';
import CreatureWindow from '../windows/CreatureWindow';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import EnhancedCreatureInspectView from '../creature-wizard/components/common/EnhancedCreatureInspectView';
import ConditionsWindow from '../conditions/ConditionsWindow';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import ShopWindow from '../shop/ShopWindow';


// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

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

const CreatureToken = ({ tokenId, position, onRemove }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging

  // Drag threshold in pixels - token must move this distance before dragging starts
  const DRAG_THRESHOLD = 8;

  // Refs to track current state in event handlers
  const isDraggingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  // Remove local state - use global store state instead

  const contextMenuRef = useRef(null);
  const tokenRef = useRef(null);

  const { tokens, creatures, updateTokenState, removeToken, duplicateToken, updateTokenPosition } = useCreatureStore();
  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { currentTarget, setTarget, clearTarget } = useTargetingStore();
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

  // Update local position when prop position changes (but not during dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(position);
    }
  }, [position, isDragging]);
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

  // Helper function to update token position with enhanced multiplayer sync
  const updateTokenPositionWithSync = (tokenId, position, sendToServer = true) => {
    // Update local position using creatureStore only (avoid dual store updates)
    updateTokenPosition(tokenId, position);

    // Track local movement to prevent race conditions
    if (sendToServer && token) {
      window[`recent_move_${token.creatureId}`] = Date.now();
    }

    // Use regular socket system for token movement (server handles these properly)
    if (sendToServer && isInMultiplayer && multiplayerSocket && token) {
      multiplayerSocket.emit('token_moved', {
        tokenId: token.creatureId,
        position: position
      });
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

  // Get current game state for reactive updates
  const gameState = useGameStore();
  const { cameraX, cameraY, zoomLevel, playerZoom, gridSize, feetPerTile, showMovementVisualization, isGMMode } = gameState;
  const effectiveZoom = zoomLevel * playerZoom;

  // Handle mouse move and up for dragging with pure immediate feedback
  useEffect(() => {
    let lastNetworkUpdate = 0;
    let lastCombatUpdate = 0;
    let dragTimeoutId = null;

    const handleMouseMove = (e) => {
      // Removed excessive logging for performance

      // Check if mouse is down but not yet dragging (threshold check)
      if (isMouseDownRef.current && !isDraggingRef.current && mouseDownPosition) {
        const deltaX = e.clientX - mouseDownPosition.x;
        const deltaY = e.clientY - mouseDownPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Only start dragging if we've moved beyond the threshold
        if (distance >= DRAG_THRESHOLD) {
          // Removed excessive logging for performance
          setIsDragging(true);
          isDraggingRef.current = true;

          // Use the drag offset that was already calculated in handleMouseDown
          // Don't recalculate it here to prevent any jumps or misalignment

          // Track drag state globally to prevent feedback loops in multiplayer
          if (!window.multiplayerDragState) {
            window.multiplayerDragState = new Map();
          }
          window.multiplayerDragState.set(`token_${token.creatureId}`, true);
          // Removed excessive logging for performance

          // Start movement visualization if enabled and in combat
          if (showMovementVisualization && isInCombat) {
            startMovementVisualization(tokenId, { x: position.x, y: position.y });
          }
        } else {
          // Still within threshold, don't start dragging yet
          return;
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
          // Snap to grid during drag to ensure consistency with final position
          const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
          const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

          multiplayerSocket.emit('token_moved', {
            tokenId: token.creatureId,
            position: { x: Math.round(snappedPos.x), y: Math.round(snappedPos.y) }, // Use grid-snapped position
            isDragging: true
          });
          lastNetworkUpdate = now;
        }
      }

      // For combat features, update less frequently
      if (isInCombat && dragStartPosition && now - lastCombatUpdate > 50) { // 20fps for combat updates
        // Update movement visualization if enabled
        if (showMovementVisualization && activeMovement?.tokenId === tokenId) {
          updateMovementVisualization({ x: worldPos.x, y: worldPos.y });
        }

        // Calculate and update temporary movement distance for tooltip
        const dx = worldPos.x - dragStartPosition.x;
        const dy = worldPos.y - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy) * feetPerTile;
        updateTempMovementDistance(tokenId, distance);

        lastCombatUpdate = now;
      }
    };

    const handleMouseUp = (e) => {
      // Removed excessive logging for performance

      // Handle mouse up for both dragging and non-dragging cases
      if (e.button !== 0) return; // Only handle left mouse button

      // If we were just mouse down but never started dragging, this is a simple click
      if (isMouseDownRef.current && !isDraggingRef.current) {
        // Removed excessive logging for performance
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

      // Update token position to snapped grid center (with multiplayer sync)
      updateTokenPositionWithSync(tokenId, finalWorldPos);

      // Handle combat movement validation if in combat
      if (isInCombat && dragStartPosition) {
        const dx = finalWorldPos.x - dragStartPosition.x;
        const dy = finalWorldPos.y - dragStartPosition.y;
        const totalDistance = Math.sqrt(dx * dx + dy * dy) * feetPerTile;

        // Movement distance calculated

        // Validate movement and handle AP costs
        const validation = validateMovement(tokenId, dragStartPosition, finalWorldPos, [creature], feetPerTile);

        if (validation.needsConfirmation) {
          // Movement requires confirmation
          setPendingMovementConfirmation({
            tokenId,
            startPosition: dragStartPosition,
            finalPosition: finalWorldPos,
            requiredAP: validation.additionalAPNeeded,
            totalDistance: totalDistance
          });
        } else if (validation.isValid) {
          // Movement is valid - auto-confirming
          // Auto-confirm valid movement
          confirmMovement(tokenId, validation.additionalAPNeeded, totalDistance);
        } else {
          console.log('❌ MOVEMENT IS INVALID - Reverting');
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
            tokenId: token.creatureId,
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

    if (isDragging || isMouseDown) {
      // Use passive: false for both mousemove and mouseup to allow preventDefault
      document.addEventListener('mousemove', handleMouseMove, { passive: false, capture: true });
      document.addEventListener('mouseup', handleMouseUp, { passive: false, capture: true });

      // Also add a fallback mouseup listener without capture to ensure we catch it
      document.addEventListener('mouseup', handleMouseUp, { passive: false });

      // Safety timeout to reset dragging state if mouse up is missed
      dragTimeoutId = setTimeout(() => {
        // Removed excessive logging for performance
        setIsDragging(false);
        setIsMouseDown(false);
        if (window.multiplayerDragState && token) {
          window.multiplayerDragState.delete(`token_${token.creatureId}`);
        }
        window.tokenInteractionActive = false;
        window.tokenInteractionTimestamp = null;
      }, 5000); // 5 second timeout
    }

    return () => {
      // Removed excessive logging for performance
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp);
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
              console.log('🔄 Token state changed for token:', tokenId, {
                oldHp: prevState.currentHp,
                newHp: updatedToken.state.currentHp,
                oldMana: prevState.currentMana,
                newMana: updatedToken.state.currentMana,
                oldAP: prevState.currentActionPoints,
                newAP: updatedToken.state.currentActionPoints
              });



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
  const screenPosition = useMemo(() => {
    const currentPos = isDragging ? localPosition : position;
    if (!currentPos) return { x: 0, y: 0 };

    // Get viewport dimensions for proper coordinate conversion
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Convert world coordinates to screen coordinates using the grid system with viewport dimensions
    const screenPos = gridSystem.worldToScreen(currentPos.x, currentPos.y, viewportWidth, viewportHeight);
    return screenPos;
  }, [position, localPosition, isDragging, cameraX, cameraY, effectiveZoom]);

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

    console.log('Opening context menu at:', { x, y });
  };

  // State for conditions window
  const [showConditionsWindow, setShowConditionsWindow] = useState(false);

  // Handle opening conditions window
  const handleOpenConditions = () => {
    setShowConditionsWindow(true);
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

  // Handle mouse enter (show tooltip with delay)
  const handleMouseEnter = (e) => {
    if (!tokenRef.current) return;

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

    // Show tooltip after 0.5 second delay (reduced for testing)
    tooltipTimeoutRef.current = setTimeout(() => {
      // Removed excessive logging for performance
      setShowTooltip(true);
    }, 500);
  };

  // Handle mouse leave (hide tooltip)
  const handleMouseLeave = () => {
    // Clear timeout and hide tooltip
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

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
    console.log('Opening details window for creature:', creature.name);
  };

  const handleCloseDetailsWindow = () => {
    setShowDetailsWindow(false);
    console.log('Closing details window');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log('Switching to tab:', tab);
  };

  // Handle duplicate token
  const handleDuplicateToken = () => {
    console.log('Duplicating token:', tokenId);
    duplicateToken(tokenId);
    setShowContextMenu(false);
  };

  // Handle edit creature
  const [showCreatureEditor, setShowCreatureEditor] = useState(false);

  const handleEditCreature = () => {
    setShowCreatureEditor(true);
    setShowContextMenu(false);
    console.log('Opening creature editor for:', creature.name);
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
    console.log('Closing creature editor');
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

      console.log('💰 CONFIRMING MOVEMENT:', {
        requiredAP,
        totalDistance: Math.round(totalDistance)
      });

      // Update token position to final position (should already be there, but ensure it)
      updateTokenPositionWithSync(pendingTokenId, finalPosition);

      // Track the movement and spend the required AP - use total distance, not current movement
      confirmMovement(pendingTokenId, requiredAP, totalDistance);
    }
  };

  const handleCancelMovement = () => {
    if (pendingMovementConfirmation) {
      const { tokenId: pendingTokenId, startPosition } = pendingMovementConfirmation;

      console.log('❌ CANCELING MOVEMENT');

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

    console.log('💥 DAMAGE TOKEN:', {
      tokenId,
      creatureName: creature?.name,
      amount,
      currentHp,
      newHp,
      timestamp: new Date().toLocaleTimeString()
    });

    updateTokenState(tokenId, {
      currentHp: newHp
    });

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

    console.log('💚 HEAL TOKEN:', {
      tokenId,
      creatureName: creature?.name,
      amount,
      currentHp,
      maxHp,
      newHp,
      timestamp: new Date().toLocaleTimeString()
    });

    updateTokenState(tokenId, {
      currentHp: newHp
    });

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
        className="creature-token placeholder"
        style={{
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

    // If in selection mode, toggle selection instead of dragging
    if (isSelectionMode) {
      toggleTokenSelection(tokenId);
      setShowTooltip(false);
      return;
    }

    // If in combat and not this token's turn, prevent movement
    if (isInCombat && !isMyTurn) {
      console.log('Cannot move token - not your turn in combat');
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

    // Only handle click if we're not dragging
    if (!isDragging) {
      // Handle any click-specific logic here if needed
      // For now, just prevent the event from reaching the grid
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

  return (
    <>
      <div
        ref={tokenRef}
        className={`creature-token ${isDragging ? 'dragging' : ''} ${isTargeted ? 'targeted' : ''} ${isSelectedForCombat ? 'selected-for-combat' : ''} ${isMyTurn ? 'my-turn' : ''} ${isHiddenFromPlayers && isGMMode ? 'gm-hidden' : ''}`}
        style={{
          left: screenPosition.x,
          top: screenPosition.y,
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
          borderColor: isMyTurn ? '#FFD700' : isSelectedForCombat ? '#00FF00' : isTargeted ? '#FF9800' : creature.tokenBorder,
          cursor: isSelectionMode ? 'pointer' : (isInCombat && !isMyTurn) ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
          zIndex: isDragging ? 1000 : 150, // Higher z-index to be above ObjectSystem canvas (20) and grid tiles (10)
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          pointerEvents: showRenameInput ? 'none' : 'auto', // Disable pointer events when renaming
          borderRadius: '50%',
          border: `3px solid ${isMyTurn ? '#FFD700' : isSelectedForCombat ? '#00FF00' : isTargeted ? '#FF9800' : creature.tokenBorder}`,
          overflow: 'hidden',
          boxShadow: isMyTurn
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
        onClick={showRenameInput ? undefined : handleTokenClick}
      >
        <div
          className="token-icon"
          style={{
            backgroundImage: `url(${token.state.customIcon || getIconUrl(creature.tokenIcon)})`,
            width: '100%',
            height: '100%',
            backgroundSize: `${token.state.iconScale || 100}%`,
            backgroundPosition: `${token.state.iconPosition?.x || 50}% ${token.state.iconPosition?.y || 50}%`,
            borderRadius: '50%'
          }}
        ></div>

        {/* Shop Indicator */}
        {creature.isShopkeeper && (
          <div className="shop-indicator" title="Shopkeeper">
            <i className="fas fa-store"></i>
          </div>
        )}

        {/* Health bar removed - health is visible in HUD and hover tooltip */}

        {/* Turn Timer */}
        <TurnTimer tokenId={tokenId} />

        {/* Test Button for Tooltip - Removed per user request */}
      </div>

      {/* Compact Context Menu */}
      {showContextMenu && createPortal(
        <div
          ref={contextMenuRef}
          className="unified-context-menu compact"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y
          }}
        >
          {/* Main Actions - Header removed, creature info available in hover tooltip */}
          <div className="context-menu-group">
            <div className="group-header">
              <i className="fas fa-cog"></i>
              <span>Token Actions</span>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="submenu">
                <button className="context-menu-button" onClick={handleViewDetails}>
                  <i className="fas fa-search"></i> Inspect
                </button>
                {creature.isShopkeeper && (
                  <button className="context-menu-button" onClick={handleOpenShop}>
                    <i className="fas fa-store"></i> Open Shop
                  </button>
                )}
                <button
                  className={`context-menu-button ${isTargeted ? 'active' : ''}`}
                  onClick={handleTargetCreature}
                >
                  <i className="fas fa-crosshairs"></i> {isTargeted ? 'Clear Target' : 'Target'}
                </button>
                <button className="context-menu-button" onClick={handleDuplicateToken}>
                  <i className="fas fa-copy"></i> Duplicate
                </button>
                <button className="context-menu-button" onClick={handleRenameToken}>
                  <i className="fas fa-tag"></i> Rename
                </button>
                <button className="context-menu-button" onClick={handleChangeIcon}>
                  <i className="fas fa-image"></i> Change Icon
                </button>
                <button className="context-menu-button" onClick={handleEditCreature}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="context-menu-button danger" onClick={handleRemoveToken}>
                  <i className="fas fa-trash"></i> Remove
                </button>
                {isGMMode && (
                  <button
                    className={`context-menu-button ${token.state.hiddenFromPlayers ? 'active' : ''}`}
                    onClick={() => {
                      updateTokenState(tokenId, {
                        hiddenFromPlayers: !token.state.hiddenFromPlayers
                      });
                      setShowContextMenu(false);
                    }}
                  >
                    <i className={`fas ${token.state.hiddenFromPlayers ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    {token.state.hiddenFromPlayers ? 'Show to Players' : 'Hide from Players'}
                  </button>
                )}
              </div>
            </div>

            <div className="context-menu-group">
              <div className="group-header">
                <i className="fas fa-fist-raised"></i>
                <span>Combat</span>
                <i className="fas fa-chevron-right"></i>
              </div>
              <div className="submenu">
                <button className="context-menu-button" onClick={() => handleDamageToken(5)}>
                  <i className="fas fa-minus-circle"></i> Damage (5)
                </button>
                <button className="context-menu-button" onClick={() => handleDamageToken(10)}>
                  <i className="fas fa-minus-circle"></i> Damage (10)
                </button>
                <button className="context-menu-button" onClick={() => handleHealToken(5)}>
                  <i className="fas fa-plus-circle"></i> Heal (5)
                </button>
                <button className="context-menu-button" onClick={() => handleHealToken(10)}>
                  <i className="fas fa-plus-circle"></i> Heal (10)
                </button>
              </div>
            </div>

            <div className="context-menu-group">
              <div className="group-header">
                <i className="fas fa-magic"></i>
                <span>Status</span>
                <i className="fas fa-chevron-right"></i>
              </div>
              <div className="submenu">
                <button className="context-menu-button" onClick={handleOpenConditions}>
                  <i className="fas fa-bolt"></i> Conditions
                </button>
                <button className="context-menu-button" onClick={() => {
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
                }}>
                  <i className="fas fa-shield-alt"></i> Toggle Defense
                </button>
              </div>
            </div>
        </div>,
        document.body
      )}

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
                  : `url(${getIconUrl(creature.tokenIcon)})`,
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
                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>🗡️ Current Turn</span>
              ) : (
                <span style={{ color: '#666' }}>⏳ Waiting for turn</span>
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
              🎯 Targeted
            </div>
          )}

          {/* Active Conditions */}
          {token.state.conditions && token.state.conditions.length > 0 && (
            <div style={{
              borderTop: '1px solid #a08c70',
              paddingTop: '6px',
              fontSize: '10px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Active Effects:
              </div>
              <div>
                {token.state.conditions.slice(0, 3).map((condition, index) => (
                  <span key={index} style={{ marginRight: '8px', color: condition.color || '#7a3b2e' }}>
                    {condition.name}
                  </span>
                ))}
                {token.state.conditions.length > 3 && (
                  <span style={{ color: '#666' }}>
                    +{token.state.conditions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
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

      {/* Movement Visualization */}
      {showMovementVisualization && activeMovement?.tokenId === tokenId && (
        <MovementVisualization
          startPosition={activeMovement.startPosition}
          currentPosition={activeMovement.currentPosition}
          tokenId={tokenId}
          gridSystem={gridSystem}
        />
      )}

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
    </>
  );
};

export default CreatureToken;
