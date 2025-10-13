import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useTargetingStore, { TARGET_TYPES } from '../../store/targetingStore';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
// Removed useEnhancedMultiplayer import - hook was removed
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ConditionsWindow from '../conditions/ConditionsWindow';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import MovementConfirmationDialog from '../combat/MovementConfirmationDialog';
import '../../styles/unified-context-menu.css';

const CharacterToken = ({
    tokenId,
    position,
    onPositionChange,
    onRemove,
    onInspect
}) => {
    const tokenRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStartPosition, setDragStartPosition] = useState(null);
    const [mouseDownPosition, setMouseDownPosition] = useState(null);
    const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging

    // Drag threshold in pixels - token must move this distance before dragging starts
    const DRAG_THRESHOLD = 8;
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
    const [customAmountType, setCustomAmountType] = useState(''); // 'damage', 'heal', 'mana-damage', 'mana-heal'
    const contextMenuRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);

    // Throttle multiplayer updates during drag
    const lastMoveUpdateRef = useRef(null);
    const lastPositionUpdateRef = useRef(Date.now());

    // Update local position when prop position changes (but not during dragging or shortly after)
    useEffect(() => {
        // CRITICAL FIX: NEVER update position from props while dragging
        // This prevents ANY external updates from interfering with smooth dragging
        if (isDragging) {
            console.log(`🚫 Skipping position update - currently dragging`);
            return;
        }

        const timeSinceLastUpdate = Date.now() - lastPositionUpdateRef.current;

        // After dragging ends, wait for grace period before accepting external position updates
        // This prevents server echoes and stale updates from causing jumps
        if (timeSinceLastUpdate > 1000) {
            console.log(`📍 Updating character token localPosition from prop (${timeSinceLastUpdate}ms since last update)`);
            setLocalPosition(position);
        } else {
            console.log(`🚫 Skipping position update - within grace period (${timeSinceLastUpdate}ms < 1000ms)`);
        }
    }, [position, isDragging]);

    // Get character data
    const characterData = useCharacterStore(state => ({
        name: state.name,
        race: state.race,
        class: state.class,
        level: state.level,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        lore: state.lore,
        tokenSettings: state.tokenSettings
    }));

    // Get character token store functions
    const { updateCharacterTokenPosition } = useCharacterTokenStore();

    // Get grid and combat state
    const gridSystem = getGridSystem();
    const {
        gridSize,
        zoomLevel,
        playerZoom,
        cameraX,
        cameraY,
        isInMultiplayer,
        multiplayerSocket,
        isGMMode,
        showMovementVisualization,
        feetPerTile
    } = useGameStore();
    const effectiveZoom = zoomLevel * playerZoom;
    const tokenSize = gridSize * 0.8 * effectiveZoom; // Similar to CreatureToken sizing
    const { currentTarget, setTarget, clearTarget } = useTargetingStore();
    const {
        isInCombat,
        currentTurn,
        isSelectionMode,
        selectedTokens,
        toggleTokenSelection,
        activeMovement,
        startMovementVisualization,
        updateMovementVisualization,
        clearMovementVisualization,
        updateTempMovementDistance,
        isTokensTurn,  // CRITICAL FIX: Import isTokensTurn to properly check turn status
        pendingMovementConfirmation,
        setPendingMovementConfirmation,
        clearPendingMovementConfirmation,
        confirmMovement,
        validateMovement,
        recordTurnStartPosition,
        getTurnStartPosition
    } = useCombatStore();
    const { addBuff } = useBuffStore();
    const { addDebuff } = useDebuffStore();

    // Check if this token is selected for combat
    const isSelectedForCombat = selectedTokens.has(tokenId);

    // Removed enhanced multiplayer hook - was causing conflicts

    // Calculate screen position from grid position (use local position during dragging)
    const screenPosition = useMemo(() => {
        const currentPos = isDragging ? localPosition : position;
        if (!gridSystem) return currentPos;

        // Get viewport dimensions for proper coordinate conversion
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return gridSystem.worldToScreen(currentPos.x, currentPos.y, viewportWidth, viewportHeight);
    }, [position, localPosition, isDragging, cameraX, cameraY, effectiveZoom]);

    // Check if this token is targeted (use consistent ID for current player)
    const isTargeted = currentTarget?.id === 'current-player' && (currentTarget?.type === 'party_member' || currentTarget?.type === 'player');

    // CRITICAL FIX: Use isTokensTurn function instead of direct comparison
    // This properly checks if it's this token's turn in combat
    const isMyTurn = isInCombat && isTokensTurn(tokenId);

    // Record turn start position when turn begins
    useEffect(() => {
        if (isMyTurn && position) {
            const currentTurnStartPosition = getTurnStartPosition(tokenId);
            if (!currentTurnStartPosition) {
                recordTurnStartPosition(tokenId, position);
            }
        }
    }, [isMyTurn, tokenId, position, recordTurnStartPosition, getTurnStartPosition]);

    // Get character image or use default
    const getCharacterImage = () => {
        if (characterData.tokenSettings.customIcon) {
            return characterData.tokenSettings.customIcon;
        }
        if (characterData.lore.characterImage) {
            return characterData.lore.characterImage;
        }
        // Default character icon
        return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';
    };

    // Handle mouse enter (show tooltip with delay)
    const handleMouseEnter = (e) => {
        if (!tokenRef.current) return;

        // Removed excessive logging for performance

        // Clear any existing timeout
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }

        // Calculate tooltip position
        const rect = tokenRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top - 10; // Position above the token

        // Adjust position if tooltip would go off-screen
        const adjustedX = x > window.innerWidth - 200 ? x - 200 : x;
        const adjustedY = y < 100 ? rect.bottom + 10 : y;

        setTooltipPosition({ x: adjustedX, y: adjustedY });

        // Removed excessive logging for performance

        // Show tooltip after 0.5 second delay
        tooltipTimeoutRef.current = setTimeout(() => {
            // Removed excessive logging for performance
            setShowTooltip(true);
        }, 500);
    };

    // Handle mouse leave (hide tooltip)
    const handleMouseLeave = () => {
        // Removed excessive logging for performance
        // Clear timeout and hide tooltip
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(false);
    };

    // Movement confirmation handlers
    const handleConfirmMovement = () => {
        if (pendingMovementConfirmation) {
            const {
                tokenId: pendingTokenId,
                finalPosition,
                requiredAP,
                totalDistance
            } = pendingMovementConfirmation;

            console.log('💰 CONFIRMING CHARACTER MOVEMENT:', {
                requiredAP,
                totalDistance: Math.round(totalDistance)
            });

            // Update token position to final position (should already be there, but ensure it)
            updateCharacterTokenPosition(pendingTokenId, finalPosition);

            // Track the movement and spend the required AP
            confirmMovement(pendingTokenId, requiredAP, totalDistance);

            // Clear the pending confirmation
            clearPendingMovementConfirmation();
        }
    };

    const handleCancelMovement = () => {
        if (pendingMovementConfirmation) {
            const { tokenId: pendingTokenId, startPosition } = pendingMovementConfirmation;

            console.log('❌ CANCELING CHARACTER MOVEMENT');

            // Revert token to start position
            updateCharacterTokenPosition(pendingTokenId, startPosition);
            setLocalPosition(startPosition);

            // Clear the pending confirmation
            clearPendingMovementConfirmation();
        }
    };

    // Handle mouse down for dragging
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

        // If in combat and not this token's turn, prevent movement
        if (isInCombat && !isMyTurn) {
            console.log('Cannot move character token - not your turn in combat');
            setShowTooltip(false);
            return;
        }

        // Set mouse down state and store initial mouse position
        setIsMouseDown(true);
        setMouseDownPosition({ x: e.clientX, y: e.clientY });
        setShowTooltip(false);

        // Calculate the offset from the cursor to the token's current screen position
        // This is the key to making the token follow the cursor correctly
        setDragOffset({
            x: e.clientX - screenPosition.x,
            y: e.clientY - screenPosition.y
        });

        // Store the starting position for potential movement
        setDragStartPosition({ x: position.x, y: position.y });

        // Removed excessive logging for performance
    };

    // Handle click events on the character token (separate from mousedown for dragging)
    const handleTokenClick = (e) => {
        // CRITICAL FIX: Prevent click events from bubbling to grid
        e.stopPropagation();
        e.preventDefault();

        // Only handle click if we're not dragging
        if (!isDragging) {
            // Handle combat selection mode
            if (isSelectionMode) {
                toggleTokenSelection(tokenId);
            }
        }
    };

    // Handle mouse move and up for dragging with pure immediate feedback
    useEffect(() => {
        let lastNetworkUpdate = 0;
        let lastCombatUpdate = 0;
        let dragTimeoutId = null;

        const handleMouseMove = (e) => {
            // Check if mouse is down but not yet dragging (threshold check)
            if (isMouseDown && !isDragging && mouseDownPosition) {
                const deltaX = e.clientX - mouseDownPosition.x;
                const deltaY = e.clientY - mouseDownPosition.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // Only start dragging if we've moved beyond the threshold
                if (distance >= DRAG_THRESHOLD) {
                    // Removed excessive logging for performance
                    setIsDragging(true);

                    // Recalculate drag offset based on current mouse position and token's current screen position
                    // This ensures the token doesn't jump when dragging starts
                    const currentScreenPos = gridSystem.worldToScreen(position.x, position.y, window.innerWidth, window.innerHeight);
                    setDragOffset({
                        x: e.clientX - currentScreenPos.x,
                        y: e.clientY - currentScreenPos.y
                    });

                    // Track drag state globally to prevent feedback loops in multiplayer
                    if (!window.multiplayerDragState) {
                        window.multiplayerDragState = new Map();
                    }
                    window.multiplayerDragState.set('character', true);

                    // CRITICAL FIX: Start movement visualization when dragging starts
                    if (showMovementVisualization) {
                        startMovementVisualization(tokenId, { x: position.x, y: position.y });
                    }
                    // Removed excessive logging for performance
                } else {
                    // Still within threshold, don't start dragging yet
                    return;
                }
            }

            if (!isDragging) return;

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

            // CRITICAL FIX: Update timestamp on EVERY mousemove to keep grace period active during long drags
            // This prevents server echoes from slipping through during extended drag sessions
            window[`recent_character_move_${tokenId}`] = now;

            // Send real-time position updates to multiplayer server during drag (throttled for performance)
            if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
                if (now - lastNetworkUpdate > 100) { // Throttle to ~10fps during drag for better performance
                    // Snap to grid during drag to ensure consistency with final position
                    const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
                    const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

                    multiplayerSocket.emit('character_moved', {
                        position: { x: Math.round(snappedPos.x), y: Math.round(snappedPos.y) }, // Use grid-snapped position
                        isDragging: true
                    });
                    lastNetworkUpdate = now;
                    console.log(`📡 Sent character drag position:`, { x: Math.round(snappedPos.x), y: Math.round(snappedPos.y) });
                }
            }

            // CRITICAL FIX: Update movement visualization and distance calculation during drag
            if (dragStartPosition && now - lastCombatUpdate > 50) { // 20fps for combat updates
                // CRITICAL FIX: Snap position to tile center for clean distance display
                // This makes the movement line point to tile centers and shows clean distance increments
                const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
                const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

                // Update movement visualization if enabled - use SNAPPED position for clean line
                if (showMovementVisualization && activeMovement?.tokenId === tokenId) {
                    updateMovementVisualization({ x: snappedPos.x, y: snappedPos.y });
                }

                // Calculate and update temporary movement distance for tooltip
                // CRITICAL FIX: Use snapped positions for tile-based distance calculation
                const dx = snappedPos.x - dragStartPosition.x;
                const dy = snappedPos.y - dragStartPosition.y;
                const worldDistance = Math.sqrt(dx * dx + dy * dy);
                const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
                const distance = tileDistance * feetPerTile;
                updateTempMovementDistance(tokenId, distance);

                lastCombatUpdate = now;
            }
        };

        const handleMouseUp = (e) => {
            // Removed excessive logging for performance

            // Handle mouse up for both dragging and non-dragging cases
            if (e.button !== 0) return; // Only handle left mouse button

            // If we were just mouse down but never started dragging, this is a simple click
            if (isMouseDown && !isDragging) {
                // Removed excessive logging for performance
                setIsMouseDown(false);
                setMouseDownPosition(null);
                setDragStartPosition(null);
                return;
            }

            // If we're not dragging, nothing to do
            if (!isDragging) {
                // Removed excessive logging for performance
                setIsMouseDown(false);
                setMouseDownPosition(null);
                setDragStartPosition(null);
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Calculate final screen position
            const screenX = e.clientX - dragOffset.x;
            const screenY = e.clientY - dragOffset.y;

            // Get viewport dimensions for proper coordinate conversion
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Convert screen position to world coordinates
            const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);

            // Convert world coordinates to grid coordinates
            const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

            // Snap to grid center in world coordinates
            const snappedWorldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

            // Update final position with grid snapping
            updateCharacterTokenPosition(tokenId, { x: snappedWorldPos.x, y: snappedWorldPos.y });

            // Update local position immediately to prevent visual jumps
            setLocalPosition({ x: snappedWorldPos.x, y: snappedWorldPos.y });

            // Track when we last updated position (for grace period in useEffect)
            lastPositionUpdateRef.current = Date.now();

            // CRITICAL FIX: Handle combat movement validation if in combat
            if (isInCombat && dragStartPosition) {
                // Validate movement - combatStore handles character tokens internally
                const validation = validateMovement(tokenId, dragStartPosition, snappedWorldPos, [], feetPerTile);

                if (validation.needsConfirmation) {
                    // Movement requires confirmation - show dialog
                    const combatant = useCombatStore.getState().turnOrder.find(c => c.tokenId === tokenId);
                    setPendingMovementConfirmation({
                        tokenId,
                        startPosition: dragStartPosition,
                        finalPosition: snappedWorldPos,
                        requiredAP: validation.additionalAPNeeded,
                        totalDistance: validation.totalMovementAfterThis,
                        baseMovement: validation.creatureSpeed,
                        currentAP: combatant?.currentActionPoints || 0,
                        creatureName: characterData.name || 'Character',
                        movementUsedThisTurn: validation.movementUsedThisTurn,
                        feetPerTile: feetPerTile,
                        currentMovementDistance: validation.currentMovementFeet
                    });
                } else if (validation.isValid) {
                    // Movement is valid - auto-confirm
                    // CRITICAL FIX: Pass totalMovementAfterThis (cumulative) instead of currentMovementFeet (just this move)
                    // This ensures movement tracking accumulates properly instead of resetting
                    confirmMovement(tokenId, validation.additionalAPNeeded, validation.totalMovementAfterThis);

                    // Send to multiplayer
                    if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
                        window[`recent_character_move_${tokenId}`] = Date.now();
                        multiplayerSocket.emit('character_moved', {
                            position: { x: Math.round(snappedWorldPos.x), y: Math.round(snappedWorldPos.y) },
                            isDragging: false
                        });
                    }
                } else {
                    // Movement is invalid - revert to start position
                    console.log('❌ CHARACTER MOVEMENT IS INVALID - Reverting');
                    updateCharacterTokenPosition(tokenId, dragStartPosition);
                    setLocalPosition(dragStartPosition);
                    updateTempMovementDistance(tokenId, 0);
                }
            } else {
                // Not in combat - send final position to multiplayer
                if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
                    window[`recent_character_move_${tokenId}`] = Date.now();
                    multiplayerSocket.emit('character_moved', {
                        position: { x: Math.round(snappedWorldPos.x), y: Math.round(snappedWorldPos.y) },
                        isDragging: false
                    });
                }
            }

            // CRITICAL FIX: Clear movement visualization when drag ends
            clearMovementVisualization();

            // End dragging and reset all states
            setIsDragging(false);
            setIsMouseDown(false);
            setMouseDownPosition(null);
            setDragStartPosition(null);

            // CRITICAL FIX: Clear global token interaction flag
            window.tokenInteractionActive = false;
            window.tokenInteractionTimestamp = null;

            // Clear drag state globally to allow network updates again
            if (window.multiplayerDragState) {
                window.multiplayerDragState.delete('character');
                // Removed excessive logging for performance
            }

            // Clear the drag timeout since we successfully handled mouse up
            if (dragTimeoutId) {
                clearTimeout(dragTimeoutId);
                dragTimeoutId = null;
            }
        };

        // CRITICAL FIX: Handle mouse leaving window during drag
        const handleMouseLeave = (e) => {
            // Only trigger if we're actively dragging
            if (isDragging) {
                console.log('🖱️ Mouse left window during drag - finalizing position');
                // Trigger mouseup to properly finalize the position
                handleMouseUp(e);
            }
        };

        if (isDragging || isMouseDown) {
            // Add the event listeners to the document to ensure they work even if the cursor moves outside the token
            // Use passive: false for both mousemove and mouseup to allow preventDefault
            document.addEventListener('mousemove', handleMouseMove, { passive: false, capture: true });
            document.addEventListener('mouseup', handleMouseUp, { passive: false, capture: true });

            // CRITICAL FIX: Handle mouse leaving the window to prevent position jumps
            document.addEventListener('mouseleave', handleMouseLeave, { passive: false });

            // Also add a fallback mouseup listener without capture to ensure we catch it
            document.addEventListener('mouseup', handleMouseUp, { passive: false });

            // Safety timeout to reset dragging state if mouse up is missed (e.g., cursor leaves window)
            // CRITICAL FIX: Increased from 5s to 30s to prevent interrupting long drags
            // This is now a last resort since we handle mouseleave properly
            dragTimeoutId = setTimeout(() => {
                console.warn('⏰ Character drag timeout triggered after 30s - this should rarely happen');
                setIsDragging(false);
                setIsMouseDown(false);
                setMouseDownPosition(null);
                setDragStartPosition(null);
                if (window.multiplayerDragState) {
                    window.multiplayerDragState.delete('character');
                }
                window.tokenInteractionActive = false;
                window.tokenInteractionTimestamp = null;
            }, 30000); // 30 second timeout (safety net only)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove, { capture: true });
            document.removeEventListener('mouseup', handleMouseUp, { capture: true });
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (dragTimeoutId) {
                clearTimeout(dragTimeoutId);
            }
        };
    }, [
        isDragging,
        isMouseDown,
        isInMultiplayer,
        multiplayerSocket,
        position,
        dragOffset,
        mouseDownPosition,
        gridSystem,
        tokenId,
        showMovementVisualization,
        startMovementVisualization,
        updateMovementVisualization,
        clearMovementVisualization,
        updateTempMovementDistance,
        activeMovement,
        dragStartPosition,
        feetPerTile
    ]);

    // Handle context menu
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    // Close context menu when clicking outside and cleanup tooltip timeout
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setShowContextMenu(false);
            }
        };

        if (showContextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showContextMenu]);

    // Cleanup tooltip timeout on unmount
    useEffect(() => {
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
        };
    }, []);

    // Handle targeting
    const handleTarget = () => {
        if (isTargeted) {
            clearTarget();
        } else {
            // Use the same structure as PartyHUD for consistency
            const targetData = {
                id: 'current-player', // Use consistent ID for current player
                name: characterData.name,
                type: 'party_member', // Use party_member type for consistency
                data: {
                    id: 'current-player',
                    name: characterData.name,
                    role: 'member',
                    status: 'online',
                    character: {
                        level: characterData.level,
                        race: characterData.race,
                        class: characterData.class,
                        alignment: characterData.alignment || 'Neutral',
                        exhaustionLevel: characterData.exhaustionLevel || 0,
                        health: characterData.health,
                        mana: characterData.mana,
                        actionPoints: characterData.actionPoints,
                        classResource: characterData.classResource
                    }
                }
            };
            setTarget(targetData, 'party_member');
        }
        setShowContextMenu(false);
    };

    // Handle inspect
    const handleInspectCharacter = () => {
        if (onInspect) {
            onInspect(characterData, true); // true indicates it's the player's own character
        }
        setShowContextMenu(false);
    };

    // Handle remove token
    const handleRemoveToken = () => {
        if (onRemove) {
            onRemove(tokenId);
        }
        setShowContextMenu(false);
    };

    // Handle duplicate token
    const handleDuplicateToken = () => {
        console.log('Duplicating character token:', tokenId);
        // For character tokens, we might want to create a new token at a nearby position
        // This would need to be implemented in the character token store
        setShowContextMenu(false);
    };

    // Handle damage token
    const handleDamageToken = (amount) => {
        const currentHp = characterData.health.current;
        const newHp = Math.max(0, currentHp - amount);

        console.log('💥 DAMAGE CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            amount,
            currentHp,
            newHp,
            timestamp: new Date().toLocaleTimeString()
        });

        // Update character health through character store - pass current value, keep max unchanged
        useCharacterStore.getState().updateResource('health', newHp, undefined);

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
        const currentHp = characterData.health.current;
        const maxHp = characterData.health.max;
        const newHp = Math.min(maxHp, currentHp + amount);

        console.log('💚 HEAL CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            amount,
            currentHp,
            maxHp,
            newHp,
            timestamp: new Date().toLocaleTimeString()
        });

        // Update character health through character store - pass current value, keep max unchanged
        useCharacterStore.getState().updateResource('health', newHp, undefined);

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

    // Handle mana damage
    const handleManaDamage = (amount) => {
        const currentMp = characterData.mana.current;
        const newMp = Math.max(0, currentMp - amount);

        console.log('💙 MANA DAMAGE CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            amount,
            currentMp,
            newMp,
            timestamp: new Date().toLocaleTimeString()
        });

        // Update character mana through character store
        useCharacterStore.getState().updateResource('mana', newMp, undefined);

        // CRITICAL FIX: Sync Mana to combat timeline if in combat
        if (isInCombat) {
            const { updateCombatantMana } = useCombatStore.getState();
            updateCombatantMana(tokenId, newMp);
        }

        // Show floating combat text at token's screen position
        if (window.showFloatingCombatText) {
            window.showFloatingCombatText(
                amount.toString(),
                'mana-damage',
                { x: screenPosition.x, y: screenPosition.y }
            );
        }
    };

    // Handle mana heal
    const handleManaHeal = (amount) => {
        const currentMp = characterData.mana.current;
        const maxMp = characterData.mana.max;
        const newMp = Math.min(maxMp, currentMp + amount);

        console.log('💙 MANA HEAL CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            amount,
            currentMp,
            maxMp,
            newMp,
            timestamp: new Date().toLocaleTimeString()
        });

        // Update character mana through character store
        useCharacterStore.getState().updateResource('mana', newMp, undefined);

        // Show floating combat text at token's screen position
        if (window.showFloatingCombatText) {
            window.showFloatingCombatText(
                amount.toString(),
                'mana-heal',
                { x: screenPosition.x, y: screenPosition.y }
            );
        }
    };

    // Handle full heal
    const handleFullHeal = () => {
        const maxHp = characterData.health.max;
        const maxMp = characterData.mana.max;

        console.log('💚 FULL HEAL CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            timestamp: new Date().toLocaleTimeString()
        });

        // Update both health and mana to max
        useCharacterStore.getState().updateResource('health', maxHp, undefined);
        useCharacterStore.getState().updateResource('mana', maxMp, undefined);

        // Show floating combat text
        if (window.showFloatingCombatText) {
            window.showFloatingCombatText(
                'FULL HEAL',
                'heal',
                { x: screenPosition.x, y: screenPosition.y }
            );
        }

        setShowContextMenu(false);
    };

    // Handle kill (set health to 0)
    const handleKill = () => {
        console.log('💀 KILL CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            timestamp: new Date().toLocaleTimeString()
        });

        // Set health to 0
        useCharacterStore.getState().updateResource('health', 0, undefined);

        // Show floating combat text
        if (window.showFloatingCombatText) {
            window.showFloatingCombatText(
                'KILLED',
                'damage',
                { x: screenPosition.x, y: screenPosition.y }
            );
        }

        setShowContextMenu(false);
    };

    // Handle drain mana (set mana to 0)
    const handleDrainMana = () => {
        console.log('🔵 DRAIN MANA CHARACTER TOKEN:', {
            tokenId,
            characterName: characterData.name,
            timestamp: new Date().toLocaleTimeString()
        });

        // Set mana to 0
        useCharacterStore.getState().updateResource('mana', 0, undefined);

        // Show floating combat text
        if (window.showFloatingCombatText) {
            window.showFloatingCombatText(
                'DRAINED',
                'mana-damage',
                { x: screenPosition.x, y: screenPosition.y }
            );
        }

        setShowContextMenu(false);
    };

    // State for conditions window
    const [showConditionsWindow, setShowConditionsWindow] = useState(false);

    // Handle opening conditions window
    const handleOpenConditions = () => {
        setShowConditionsWindow(true);
        setShowContextMenu(false);
    };

    // Calculate health percentage for health bar
    const healthPercentage = (characterData.health.current / characterData.health.max) * 100;

    // Get health bar color based on percentage
    const getHealthBarColor = (percentage) => {
        if (percentage > 75) return '#4CAF50'; // Green
        if (percentage > 50) return '#FFC107'; // Yellow
        if (percentage > 25) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    return (
        <>
            <div
                ref={tokenRef}
                className={`character-token ${isDragging ? 'dragging' : ''} ${isTargeted ? 'targeted' : ''} ${isMyTurn ? 'my-turn' : ''}`}
                style={{
                    left: screenPosition.x,
                    top: screenPosition.y,
                    width: `${tokenSize}px`,
                    height: `${tokenSize}px`,
                    borderColor: isMyTurn ? '#FFD700' : isTargeted ? '#FF9800' : characterData.tokenSettings.borderColor,
                    cursor: isInCombat && !isMyTurn ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    zIndex: isDragging ? 1000 : 150, // Higher z-index to be above ObjectSystem canvas (20) and grid tiles (10)
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    border: `3px solid ${isMyTurn ? '#FFD700' : isSelectedForCombat ? '#00FF00' : isTargeted ? '#FF9800' : characterData.tokenSettings.borderColor}`,
                    overflow: 'hidden',
                    boxShadow: isMyTurn
                        ? '0 0 20px rgba(255, 215, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : isSelectedForCombat
                        ? '0 0 15px rgba(0, 255, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : isTargeted
                        ? '0 0 15px rgba(255, 152, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    cursor: isSelectionMode ? 'pointer' : (isInCombat && !isMyTurn) ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    pointerEvents: 'all', // Ensure it can receive mouse events
                    userSelect: 'none',
                    touchAction: 'none'
                }}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onClick={handleTokenClick}
            >
                {/* Character Image with Transformations */}
                <div
                    className="token-icon"
                    style={{
                        backgroundImage: `url(${getCharacterImage()})`,
                        width: '100%',
                        height: '100%',
                        backgroundSize: characterData.lore.imageTransformations
                            ? `${(characterData.lore.imageTransformations.scale || 1) * 120}%`
                            : 'cover',
                        backgroundPosition: characterData.lore.imageTransformations
                            ? `${50 + (characterData.lore.imageTransformations.positionX || 0) / 2}% ${50 - (characterData.lore.imageTransformations.positionY || 0) / 2}%`
                            : 'center center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '50%',
                        transform: characterData.lore.imageTransformations
                            ? `rotate(${characterData.lore.imageTransformations.rotation || 0}deg)`
                            : 'none'
                    }}
                ></div>

                {/* Health bar removed - health is visible in HUD and hover tooltip */}

                {/* Character Name Label */}
                <div className="token-name-label" style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                }}>
                    {characterData.name}
                </div>
            </div>

            {/* Advanced Context Menu */}
            {showContextMenu && createPortal(
                <div
                    ref={contextMenuRef}
                    className="unified-context-menu compact"
                    style={{
                        left: contextMenuPosition.x,
                        top: contextMenuPosition.y
                    }}
                >
                    {/* Main Actions */}
                    <div className="context-menu-group">
                        <div className="group-header">
                            <i className="fas fa-cog"></i>
                            <span>Token Actions</span>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                        <div className="submenu">
                            <button className="context-menu-button" onClick={handleInspectCharacter}>
                                <i className="fas fa-search"></i> Inspect
                            </button>
                            <button
                                className={`context-menu-button ${isTargeted ? 'active' : ''}`}
                                onClick={handleTarget}
                            >
                                <i className="fas fa-crosshairs"></i> {isTargeted ? 'Clear Target' : 'Target'}
                            </button>
                            <button className="context-menu-button" onClick={handleDuplicateToken}>
                                <i className="fas fa-copy"></i> Duplicate
                            </button>
                            <button className="context-menu-button danger" onClick={handleRemoveToken}>
                                <i className="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>

                    <div className="context-menu-group">
                        <div className="group-header">
                            <i className="fas fa-heart"></i>
                            <span>Health</span>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                        <div className="submenu">
                            <button className="context-menu-button" onClick={() => handleDamageToken(5)}>
                                <i className="fas fa-minus-circle"></i> Damage (5)
                            </button>
                            <button className="context-menu-button" onClick={() => handleDamageToken(10)}>
                                <i className="fas fa-minus-circle"></i> Damage (10)
                            </button>
                            <button className="context-menu-button" onClick={() => handleCustomAmount('damage')}>
                                <i className="fas fa-edit"></i> Custom Damage
                            </button>
                            <div className="context-menu-separator"></div>
                            <button className="context-menu-button" onClick={() => handleHealToken(5)}>
                                <i className="fas fa-plus-circle"></i> Heal (5)
                            </button>
                            <button className="context-menu-button" onClick={() => handleHealToken(10)}>
                                <i className="fas fa-plus-circle"></i> Heal (10)
                            </button>
                            <button className="context-menu-button" onClick={() => handleCustomAmount('heal')}>
                                <i className="fas fa-edit"></i> Custom Heal
                            </button>
                            <div className="context-menu-separator"></div>
                            <button className="context-menu-button heal" onClick={handleFullHeal}>
                                <i className="fas fa-heart"></i> Full Heal
                            </button>
                            <button className="context-menu-button danger" onClick={handleKill}>
                                <i className="fas fa-skull"></i> Kill
                            </button>
                        </div>
                    </div>

                    <div className="context-menu-group">
                        <div className="group-header">
                            <i className="fas fa-magic"></i>
                            <span>Mana</span>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                        <div className="submenu">
                            <button className="context-menu-button" onClick={() => handleManaDamage(5)}>
                                <i className="fas fa-minus-circle"></i> Drain (5)
                            </button>
                            <button className="context-menu-button" onClick={() => handleManaDamage(10)}>
                                <i className="fas fa-minus-circle"></i> Drain (10)
                            </button>
                            <button className="context-menu-button" onClick={() => handleCustomAmount('mana-damage')}>
                                <i className="fas fa-edit"></i> Custom Drain
                            </button>
                            <div className="context-menu-separator"></div>
                            <button className="context-menu-button" onClick={() => handleManaHeal(5)}>
                                <i className="fas fa-plus-circle"></i> Restore (5)
                            </button>
                            <button className="context-menu-button" onClick={() => handleManaHeal(10)}>
                                <i className="fas fa-plus-circle"></i> Restore (10)
                            </button>
                            <button className="context-menu-button" onClick={() => handleCustomAmount('mana-heal')}>
                                <i className="fas fa-edit"></i> Custom Restore
                            </button>
                            <div className="context-menu-separator"></div>
                            <button className="context-menu-button danger" onClick={handleDrainMana}>
                                <i className="fas fa-battery-empty"></i> Drain All
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
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            minWidth: '300px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            {customAmountType === 'damage' && 'Custom Damage Amount'}
                            {customAmountType === 'heal' && 'Custom Heal Amount'}
                            {customAmountType === 'mana-damage' && 'Custom Mana Drain Amount'}
                            {customAmountType === 'mana-heal' && 'Custom Mana Restore Amount'}
                        </h3>
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter amount..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #a08c70',
                                borderRadius: '4px',
                                fontSize: '14px',
                                marginBottom: '15px',
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
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
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
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8dcc0',
                                    color: '#7a3b2e',
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

            {/* Character Tooltip */}
            {showTooltip && createPortal(
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
                    {/* Character Header */}
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
                                backgroundImage: `url(${getCharacterImage()})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: `2px solid ${characterData.tokenSettings.borderColor}`
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {characterData.name}
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.7 }}>
                                Level {characterData.level} {characterData.race} {characterData.class}
                            </div>
                        </div>
                    </div>

                    {/* Health and Resources */}
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Health:</span>
                            <span style={{ color: healthPercentage > 50 ? '#4CAF50' : healthPercentage > 25 ? '#FF9800' : '#F44336' }}>
                                {characterData.health.current}/{characterData.health.max}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Mana:</span>
                            <span style={{ color: '#2196F3' }}>
                                {characterData.mana.current}/{characterData.mana.max}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>Action Points:</span>
                            <span style={{ color: '#9C27B0' }}>
                                {characterData.actionPoints.current}/{characterData.actionPoints.max}
                            </span>
                        </div>
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
                                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>🗡️ Your Turn</span>
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
                </div>,
                document.body
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
                creature={{
                    name: characterData.name,
                    stats: {
                        maxHp: characterData.health.max,
                        maxMana: characterData.mana.max,
                        maxActionPoints: characterData.actionPoints.max
                    }
                }}
            />
        </>
    );
};

// CRITICAL FIX: Wrap in React.memo to prevent unnecessary re-renders
// This prevents parent component re-renders from forcing token re-renders
// Only re-render when tokenId, position, or callbacks actually change
export default React.memo(CharacterToken, (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props changed (do re-render)
    return (
        prevProps.tokenId === nextProps.tokenId &&
        prevProps.position?.x === nextProps.position?.x &&
        prevProps.position?.y === nextProps.position?.y &&
        prevProps.onPositionChange === nextProps.onPositionChange &&
        prevProps.onRemove === nextProps.onRemove &&
        prevProps.onInspect === nextProps.onInspect
    );
});
