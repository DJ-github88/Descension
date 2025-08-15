import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './CreatureToken.css';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useTargetingStore, { TARGET_TYPES } from '../../store/targetingStore';
import useCombatStore from '../../store/combatStore';
import useBuffStore from '../../store/buffStore';
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging
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

  // Helper function to update token position with multiplayer sync
  const updateTokenPositionWithSync = (tokenId, position, sendToServer = true) => {
    // Update local position using creatureStore
    updateTokenPosition(tokenId, position);

    // Only send to server when explicitly requested (e.g., on drag end)
    if (sendToServer && isInMultiplayer && multiplayerSocket && token) {
      multiplayerSocket.emit('token_moved', {
        tokenId: token.creatureId, // Use creatureId for multiplayer sync
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

  // Handle mouse move and up for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      // Calculate new screen position
      const screenX = e.clientX - dragOffset.x;
      const screenY = e.clientY - dragOffset.y;

      // Get viewport dimensions for proper coordinate conversion
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Convert screen position back to world coordinates
      const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);

      // Update local position immediately for smooth visual feedback
      setLocalPosition({ x: worldPos.x, y: worldPos.y });

      // Send real-time position updates to multiplayer server during drag
      if (isInMultiplayer && multiplayerSocket && token) {
        // Throttle updates to avoid overwhelming the server (every 50ms)
        const now = Date.now();
        if (!lastMoveUpdateRef.current || now - lastMoveUpdateRef.current > 50) {
          multiplayerSocket.emit('token_moved', {
            tokenId: token.creatureId,
            position: worldPos,
            isDragging: true // Flag to indicate this is a live drag update
          });
          lastMoveUpdateRef.current = now;
        }
      }

      // For combat features, we still need some real-time updates but less frequently
      if (isInCombat && dragStartPosition) {
        // Update movement visualization if enabled
        if (showMovementVisualization && activeMovement?.tokenId === tokenId) {
          updateMovementVisualization({ x: worldPos.x, y: worldPos.y });
        }

        // Calculate and update temporary movement distance for tooltip
        const dx = worldPos.x - dragStartPosition.x;
        const dy = worldPos.y - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy) * feetPerTile;
        updateTempMovementDistance(tokenId, distance);
      }
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      console.log('🖱️ Mouse up event triggered for token:', tokenId, 'isDragging:', isDragging);

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

      console.log('🖱️ Mouse up - rawWorldPos:', rawWorldPos, 'gridCoords:', gridCoords, 'finalWorldPos:', finalWorldPos);

      // Update token position to snapped grid center (with multiplayer sync)
      updateTokenPositionWithSync(tokenId, finalWorldPos);

      // Handle combat movement validation if in combat
      if (isInCombat && dragStartPosition) {
        const dx = finalWorldPos.x - dragStartPosition.x;
        const dy = finalWorldPos.y - dragStartPosition.y;
        const totalDistance = Math.sqrt(dx * dx + dy * dy) * feetPerTile;

        console.log('🏃 MOVEMENT DISTANCE:', Math.round(totalDistance), 'feet');

        // Validate movement and handle AP costs
        const validation = validateMovement(tokenId, dragStartPosition, finalWorldPos, [creature], feetPerTile);

        if (validation.needsConfirmation) {
          console.log('⚠️ MOVEMENT REQUIRES CONFIRMATION');
          setPendingMovementConfirmation({
            tokenId,
            startPosition: dragStartPosition,
            finalPosition: finalWorldPos,
            requiredAP: validation.additionalAPNeeded,
            totalDistance: totalDistance
          });
        } else if (validation.isValid) {
          console.log('✅ MOVEMENT IS VALID - Auto-confirming');
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
        if (isInMultiplayer && multiplayerSocket && token) {
          multiplayerSocket.emit('token_moved', {
            tokenId: token.creatureId,
            position: finalWorldPos,
            isDragging: false // Flag to indicate drag has ended
          });
        }
      }

        // Clear movement visualization
        clearMovementVisualization();
      }

      // End dragging
      console.log('🖱️ Setting isDragging to false for token:', tokenId);
      setIsDragging(false);
      setDragStartPosition(null);
    };

    if (isDragging) {
      console.log('🖱️ Adding mouse event listeners for token:', tokenId);
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
    }

    return () => {
      if (isDragging) {
        console.log('🖱️ Removing mouse event listeners for token:', tokenId);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset.x, dragOffset.y, tokenId]);
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

    console.log('🖱️ Mouse entered creature token:', creature?.name);

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

    console.log('📍 Tooltip position set:', { x, y });

    // Show tooltip after 0.5 second delay (reduced for testing)
    tooltipTimeoutRef.current = setTimeout(() => {
      console.log('✨ Showing tooltip for:', creature?.name);
      setShowTooltip(true);
    }, 500);
  };

  // Handle mouse leave (hide tooltip)
  const handleMouseLeave = () => {
    console.log('🖱️ Mouse left creature token:', creature?.name);
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

  const handleCloseCreatureEditor = () => {
    setShowCreatureEditor(false);
    console.log('Closing creature editor');
  };

  // Handle targeting
  const handleTargetCreature = () => {
    if (!creature) return;

    // Create minimal target data - only store IDs and basic info, not current stats
    // The Target HUD will fetch current stats from the store in real-time
    const targetData = {
      id: creature.id,
      name: creature.name,
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

    // Check if this creature is already targeted
    if (currentTarget?.id === creature.id) {
      clearTarget();
    } else {
      setTarget(targetData, TARGET_TYPES.CREATURE);
    }

    setShowContextMenu(false);
  };

  // Check if this creature is currently targeted
  const isTargeted = currentTarget?.id === creature?.id;

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

    e.stopPropagation();
    e.preventDefault(); // Prevent text selection during drag

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

    // Calculate the offset from the cursor to the token's current screen position
    // This is the key to making the token follow the cursor correctly
    setDragOffset({
      x: e.clientX - screenPosition.x,
      y: e.clientY - screenPosition.y
    });

    console.log('🖱️ Starting drag for token:', tokenId);
    setIsDragging(true);
    setShowTooltip(false);

    // Store the starting position for movement visualization
    setDragStartPosition({ x: position.x, y: position.y });

    // Start movement visualization if enabled and in combat
    if (showMovementVisualization && isInCombat) {
      startMovementVisualization(tokenId, { x: position.x, y: position.y });
    }


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
        onMouseEnter={(e) => {
          console.log('🖱️ MOUSE ENTER EVENT FIRED for:', creature?.name);
          handleMouseEnter(e);
        }}
        onMouseLeave={(e) => {
          console.log('🖱️ MOUSE LEAVE EVENT FIRED for:', creature?.name);
          handleMouseLeave(e);
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="token-icon"
          style={{
            backgroundImage: `url(${getIconUrl(creature.tokenIcon)})`,
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
          <div className="context-menu-main">
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
          </div>
        </div>,
        document.body
      )}

      {/* Character-style Tooltip */}
      {showTooltip && (() => {
        console.log('🎯 Rendering tooltip for:', creature?.name, 'showTooltip:', showTooltip);
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
                backgroundImage: `url(${getIconUrl(creature.tokenIcon)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: `2px solid ${creature.tokenBorder}`
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {creature.name}
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
    </>
  );
};

export default CreatureToken;
