import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import usePartyStore from '../../store/partyStore';
import useTargetingStore from '../../store/targetingStore';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useLevelEditorStore from '../../store/levelEditorStore';
// Removed useEnhancedMultiplayer import - hook was removed
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import ConditionsWindow from '../conditions/ConditionsWindow';
import BuffDebuffCreatorModal from '../modals/BuffDebuffCreatorModal';
import MovementConfirmationDialog from '../combat/MovementConfirmationDialog';
import '../../styles/unified-context-menu.css';
import '../../styles/creature-token.css';
import useLongPressContextMenu from '../../hooks/useLongPressContextMenu';

const CharacterToken = ({
    tokenId,
    position,
    onPositionChange,
    onRemove,
    onInspect
}) => {
    const tokenRef = useRef(null);
    const lastPointerTypeRef = useRef('mouse');
    const longPressHandlers = useLongPressContextMenu();
    const [isDragging, setIsDragging] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStartPosition, setDragStartPosition] = useState(null);
    const [mouseDownPosition, setMouseDownPosition] = useState(null);
    const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging

    // Refs to track current state in event handlers (like CreatureToken)
    const isMouseDownRef = useRef(false);
    const isDraggingRef = useRef(false);
    const currentPosRef = useRef(position);
    const totalDragDistanceRef = useRef(0);

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
    const [customAmountType, setCustomAmountType] = useState(''); // 'damage', 'heal', 'mana-damage', 'mana-heal'
    const contextMenuRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);

    const lastPositionUpdateRef = useRef(0);
    const rafIdRef = useRef(null); // For requestAnimationFrame batching
    const pendingWorldPosRef = useRef(null); // Store pending world position for batched updates

    // Get character token data to find playerId
    const characterTokens = useCharacterTokenStore(state => state.characterTokens);
    const token = (characterTokens || []).find(t => t.id === tokenId);
    const tokenPlayerId = token?.playerId;

    // Update local position when prop position changes (but not during dragging or shortly after)
    useEffect(() => {
        // CRITICAL FIX: NEVER update position from props while dragging
        // This prevents ANY external updates from interfering with smooth dragging
        if (isDragging || isMouseDown) {
            return;
        }

        const timeSinceLastUpdate = Date.now() - lastPositionUpdateRef.current;

        // After dragging ends, wait for grace period before accepting external position updates
        // This prevents server echoes and stale updates from causing jumps
        if (timeSinceLastUpdate > 100) { // Reduced from 1000ms to 100ms
            console.log(`📍 Updating character token localPosition from prop (${timeSinceLastUpdate}ms since last update)`);
            setLocalPosition(position);
            currentPosRef.current = position;
        } else {
            console.log(`🚫 Skipping position update - within grace period (${timeSinceLastUpdate}ms < 100ms)`);
        }
    }, [position, isDragging, isMouseDown]);

    // Get character data - use party member data if this is another player's token
    const currentCharacterData = useCharacterStore(state => ({
        name: state.name,
        race: state.race,
        raceDisplayName: state.raceDisplayName,
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
    // PERFORMANCE FIX: Use selective subscriptions to prevent re-renders on camera changes
    // Camera position is handled via imperative updates in useEffect subscription
    const zoomLevel = useGameStore(state => state.zoomLevel);
    const playerZoom = useGameStore(state => state.playerZoom);
    const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
    const multiplayerSocket = useGameStore(state => state.multiplayerSocket);
    const isGMMode = useGameStore(state => state.isGMMode);
    const showMovementVisualization = useGameStore(state => state.showMovementVisualization);
    const feetPerTile = useGameStore(state => state.feetPerTile);
    const setCameraPosition = useGameStore(state => state.setCameraPosition);

    // In multiplayer, if this token belongs to another player, get their character data from party store
    const partyMembers = usePartyStore(state => state.partyMembers);
    const partyMember = tokenPlayerId && isInMultiplayer
        ? partyMembers.find(m => m.id === tokenPlayerId)
        : null;

    // Use party member's character data if available, otherwise use current player's data
    const characterData = partyMember?.character ? {
        name: partyMember.name,
        race: partyMember.character.race || currentCharacterData.race,
        raceDisplayName: partyMember.character.raceDisplayName || currentCharacterData.raceDisplayName,
        class: partyMember.character.class || currentCharacterData.class,
        level: partyMember.character.level || currentCharacterData.level,
        health: partyMember.character.health || currentCharacterData.health,
        mana: partyMember.character.mana || currentCharacterData.mana,
        actionPoints: partyMember.character.actionPoints || currentCharacterData.actionPoints,
        lore: partyMember.character.lore || currentCharacterData.lore,
        tokenSettings: partyMember.character.tokenSettings || currentCharacterData.tokenSettings
    } : currentCharacterData;

    // Check if this token is being viewed from and get visibility data
    // PERFORMANCE FIX: Only subscribe to what we actually need to prevent re-renders
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const fovAngle = useLevelEditorStore(state => state.fovAngle);
    const getTokenFacingDirection = useLevelEditorStore(state => state.getTokenFacingDirection);
    const setTokenFacingDirection = useLevelEditorStore(state => state.setTokenFacingDirection);
    const [isHovering, setIsHovering] = useState(false);
    // PERFORMANCE FIX: Selective subscriptions
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const tokenGridSize = useGameStore(state => state.gridSize);
    const isViewingFrom = viewingFromToken && (
        (viewingFromToken.type === 'character' && (viewingFromToken.characterId === tokenId || viewingFromToken.id === tokenId || viewingFromToken.playerId === tokenId)) ||
        (viewingFromToken.id === tokenId)
    );

    // Convert visibleArea array back to Set for efficient lookup (if it's an array)
    const visibleAreaSet = useMemo(() => {
        if (!visibleArea) return null;
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // Track viewing token movement to invalidate visibility cache
    const viewingTokenMovementRef = useRef({ count: 0, lastPos: null });
    useEffect(() => {
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
    // PERFORMANCE FIX: Cache visibility result and only recalculate when token actually moves
    const lastVisibilityCheckRef = useRef({ cacheKey: null, result: true });
    const isTokenVisible = useMemo(() => {
        // If this is the viewing token, always visible
        if (isViewingFrom) return true;

        // If viewing from a token AND dynamic fog is enabled, check FOV visibility
        // GM mode should NOT restrict token visibility - GM can always see all tokens
        if (viewingFromToken && dynamicFogEnabled && !isGMMode) {
            // Check if token position is in visible area
            // Use position (stored position) for visibility, not localPosition (drag position)
            // This ensures consistent visibility behavior
            if (!position || position.x === undefined || position.y === undefined) return false;

            // Get visibility polygon from store for accurate point-in-polygon check
            const levelEditorStore = useLevelEditorStore.getState();
            const visibilityPolygon = levelEditorStore.visibilityPolygon;

            // Create a comprehensive cache key that includes all factors affecting visibility
            // Position alone is not enough - visibility depends on viewing token position and visibility area
            // FIXED: Include viewing token position to detect movement changes
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

            return visible;
        }

        // If not viewing from a token, always visible (normal view)
        return true;
    }, [viewingFromToken, dynamicFogEnabled, isViewingFrom, position, tokenGridSize, gridOffsetX, gridOffsetY, isGMMode, visibleAreaSet]);
    const effectiveZoom = zoomLevel * playerZoom;
    const tokenSize = tokenGridSize * 0.8 * effectiveZoom; // Similar to CreatureToken sizing
    const { currentTarget, setTarget, clearTarget } = useTargetingStore();
    const {
        isInCombat,
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

    // Check if this token is selected for combat
    const isSelectedForCombat = selectedTokens.has(tokenId);

    // Removed enhanced multiplayer hook - was causing conflicts

    // Calculate screen position (imperative approach like CreatureToken)
    // Use localPosition always - it helps prevent visual jumping from server echoes
    // because localPosition is protected by the grace period logic in useEffect
    const currentPos = localPosition;

    const initialScreenPosition = useMemo(() => {
        if (!currentPos) return { x: 0, y: 0 };
        return gridSystem ? gridSystem.worldToScreen(
            currentPos.x,
            currentPos.y,
            window.innerWidth,
            window.innerHeight
        ) : { x: 0, y: 0 };
    }, [currentPos, gridSystem]);

    const screenPositionRef = useRef(initialScreenPosition);
    const cameraUpdateRafRef = useRef(null);
    const pendingCameraUpdateRef = useRef(false);

    const updateScreenPosition = useCallback((worldPosition) => {
        if (!worldPosition || !gridSystem) return;

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

    // Update screen position when camera changes (imperative like CreatureToken)
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

    // Handle click outside to close context menu
    // Removed duplicate handleClickOutside - using the one below with better timing (click instead of mousedown)

    // Get character image or use default
    const getCharacterImage = () => {
        if (characterData.tokenSettings?.customIcon) {
            return characterData.tokenSettings.customIcon;
        }
        if (characterData.lore?.characterImage) {
            return characterData.lore.characterImage;
        }
        // CRITICAL FIX: Check for characterIcon and convert to URL
        if (characterData.lore?.characterIcon) {
            return `https://wow.zamimg.com/images/wow/icons/large/${characterData.lore.characterIcon}.jpg`;
        }
        // Return null instead of default icon - let CSS handle the default
        return null;
    };

    // Handle mouse enter (show tooltip with delay)
    const handleMouseEnter = (e) => {
        if (!tokenRef.current) return;

        setIsHovering(true);

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

    const showTooltipNow = useCallback(() => {
        if (!tokenRef.current) return;
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }

        const rect = tokenRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top - 10;
        const adjustedX = x > window.innerWidth - 200 ? x - 200 : x;
        const adjustedY = y < 100 ? rect.bottom + 10 : y;
        setTooltipPosition({ x: adjustedX, y: adjustedY });
        setShowTooltip(true);
    }, []);

    // Handle wheel/scroll to rotate token facing direction
    const handleWheel = useCallback((e) => {
        // Only rotate if:
        // 1. We're hovering over the token
        // 2. We're not dragging
        // 3. We're in 100-degree FOV mode
        // 4. We're viewing from this token

        // Early check - if we're in the right conditions, stop event propagation immediately
        // to prevent Grid's global wheel handler from interfering
        if (isHovering && !isDragging && !isMouseDown && fovAngle === 100 && isViewingFrom) {
            // Stop propagation and prevent default BEFORE the Grid's handler gets it
            e.preventDefault();
            e.stopPropagation();

            // Get current facing direction (default to 0 if not set)
            const currentFacing = getTokenFacingDirection(tokenId) || 0;

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
            setTokenFacingDirection(tokenId, normalizedFacing);
        }
    }, [isHovering, isDragging, isMouseDown, tokenId, fovAngle, isViewingFrom, getTokenFacingDirection, setTokenFacingDirection]);

    // Add wheel event listener with passive: false to allow preventDefault
    // Use capture phase to ensure it fires before Grid's document-level handler
    useEffect(() => {
        const tokenElement = tokenRef.current;
        if (!tokenElement) return;

        // Use capture phase to intercept the event before it bubbles to document
        tokenElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });

        return () => {
            tokenElement.removeEventListener('wheel', handleWheel, { capture: true });
        };
    }, [handleWheel]);

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

        // CRITICAL FIX: Check token ownership - players can only move their own tokens, GM can move any
        if (isInMultiplayer && !isGMMode) {
            const { currentPlayer } = useGameStore.getState();
            const { name: characterName } = useCharacterStore.getState();

            // Check multiple ways the token could be identified as the player's token:
            // 1. tokenPlayerId matches currentPlayer.id
            // 2. tokenPlayerId matches characterName (used when placing from HUD)
            // 3. tokenPlayerId is 'current-player'
            // 4. token.isPlayerToken is true (single-player compatibility)
            const isOwnToken = tokenPlayerId === currentPlayer?.id ||
                tokenPlayerId === characterName ||
                tokenPlayerId === 'current-player' ||
                token?.isPlayerToken === true ||
                // Fallback: if tokenPlayerId matches valid character name even if auth mismatch
                (characterName && tokenPlayerId === characterName);

            if (!isOwnToken) {
                console.warn('Cannot move character token - NOT OWNER. detailed check:', {
                    tokenPlayerId,
                    currentPlayerId: currentPlayer?.id,
                    characterName,
                    isPlayerToken: token?.isPlayerToken,
                    tokenName: token?.name,
                    tokenId: tokenId,
                    matchPlayerId: tokenPlayerId === currentPlayer?.id,
                    matchCharacterName: tokenPlayerId === characterName,
                    matchCurrentPlayerString: tokenPlayerId === 'current-player',
                    matchIsPlayerToken: token?.isPlayerToken === true,
                    matchFallback: (characterName && tokenPlayerId === characterName)
                });
                setShowTooltip(false);
                return;
            }
        }

        // If in combat and not this token's turn, prevent movement
        if (isInCombat && !isMyTurn) {
            console.log('Cannot move character token - not your turn in combat');
            setShowTooltip(false);
            return;
        }

        // Set mouse down state and store initial mouse position
        setIsMouseDown(true);
        isMouseDownRef.current = true;
        setMouseDownPosition({ x: e.clientX, y: e.clientY });
        totalDragDistanceRef.current = 0; // Reset drag distance tracking
        setShowTooltip(false);

        // Calculate screen position directly at drag start for accuracy
        // Use currentPos (localPosition) to ensure we drag from where the token VISUALLY is
        const dragStartPos = currentPos;
        const currentScreenPos = gridSystem ? gridSystem.worldToScreen(
            dragStartPos.x,
            dragStartPos.y,
            window.innerWidth,
            window.innerHeight
        ) : { x: 0, y: 0 };

        // Calculate the offset from the cursor to the token's current screen position
        const calculatedOffset = {
            x: e.clientX - currentScreenPos.x,
            y: e.clientY - currentScreenPos.y
        };

        setDragOffset(calculatedOffset);

        // Store the starting position for potential movement
        setDragStartPosition({ x: dragStartPos.x, y: dragStartPos.y });

        // Removed excessive logging for performance
    };

    // Handle click events on the character token (separate from mousedown for dragging)
    const handleTokenClick = (e) => {
        // CRITICAL FIX: Prevent click events from bubbling to grid
        e.stopPropagation();
        e.preventDefault();

        // Only handle click if we're not dragging
        if (!isDragging) {
            // Mobile: tap toggles tooltip (hover doesn't exist)
            if (lastPointerTypeRef.current === 'touch') {
                setShowTooltip(prev => {
                    const next = !prev;
                    if (next) {
                        showTooltipNow();
                    }
                    return next;
                });
                return;
            }

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
        let lastLocalPositionUpdate = 0;

        // PERFORMANCE: Batch DOM updates using requestAnimationFrame
        const updateDOMPosition = (screenX, screenY) => {
            if (tokenRef.current) {
                tokenRef.current.style.left = `${screenX}px`;
                tokenRef.current.style.top = `${screenY}px`;
            }
        };

        // PERFORMANCE: Batch React state updates to reduce re-renders
        const scheduleStateUpdate = (worldPos) => {
            pendingWorldPosRef.current = worldPos;

            if (rafIdRef.current === null) {
                rafIdRef.current = requestAnimationFrame(() => {
                    if (pendingWorldPosRef.current) {
                        const now = Date.now();
                        // Only update React state periodically (every 50ms = ~20fps) to reduce re-renders
                        if (now - lastLocalPositionUpdate > 50) {
                            setLocalPosition({
                                x: pendingWorldPosRef.current.x,
                                y: pendingWorldPosRef.current.y
                            });
                            lastLocalPositionUpdate = now;
                        }
                        pendingWorldPosRef.current = null;
                    }
                    rafIdRef.current = null;
                });
            }
        };

        const handleMouseMove = (e) => {
            // Track total drag distance for click vs drag detection
            if (isMouseDownRef.current && mouseDownPosition) {
                const deltaX = e.clientX - mouseDownPosition.x;
                const deltaY = e.clientY - mouseDownPosition.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                totalDragDistanceRef.current = Math.max(totalDragDistanceRef.current, distance);
            }

            // Calculate screen position for potential dragging
            const screenX = e.clientX - dragOffset.x;
            const screenY = e.clientY - dragOffset.y;

            // Start dragging immediately if mouse is down and we're not dragging yet
            if (isMouseDownRef.current && !isDraggingRef.current) {
                // Removed excessive logging for performance
                setIsDragging(true);
                isDraggingRef.current = true;
                // PERFORMANCE: Set global flag to prevent expensive fog recalculations during token drag
                window._isDraggingToken = true;

                // Position token immediately at current mouse position for instant responsiveness
                updateDOMPosition(screenX, screenY);

                // Do initialization asynchronously to not block the first drag update
                setTimeout(() => {
                    // Track drag state globally to prevent feedback loops in multiplayer
                    if (!window.multiplayerDragState) {
                        window.multiplayerDragState = new Map();
                    }
                    window.multiplayerDragState.set('character', true);

                    // Start movement visualization
                    if (showMovementVisualization) {
                        startMovementVisualization(tokenId, { x: position.x, y: position.y });
                    }
                }, 0);
            }

            if (!isDraggingRef.current) return;

            // PERFORMANCE: Prevent all default behaviors and stop propagation immediately
            // This prevents parent components from re-rendering during drag
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Get viewport dimensions for proper coordinate conversion
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Convert screen position back to world coordinates
            const worldPos = gridSystem.screenToWorld(screenX, screenY, viewportWidth, viewportHeight);

            // Handle expensive operations with simple time-based throttling (no RAF)
            const now = Date.now();

            // PERFORMANCE: Update DOM position immediately for smooth dragging (batched via RAF internally)
            updateDOMPosition(screenX, screenY);

            // PERFORMANCE: Batch React state updates to reduce re-renders
            scheduleStateUpdate(worldPos);

            // PERFORMANCE: Don't update viewing token position during drag - only on drop
            // This prevents expensive fog calculations from running during drag
            // The fog calculations will run once when the drag ends, which is what we want
            // We still track the position in a ref for use on drop
            if (isViewingFrom) {
                // Store the position in a ref for use when drag ends, but don't update the store
                // This prevents expensive fog recalculations during drag
                pendingWorldPosRef.current = worldPos;
            }

            // CRITICAL FIX: Update timestamp periodically to keep grace period active during long drags
            // This prevents server echoes from slipping through during extended drag sessions
            if (now - lastPositionUpdateRef.current > 1000) { // Only update every second
                window[`recent_character_move_${tokenId}`] = now;
            }

            // Send real-time position updates to multiplayer server during drag (throttled for performance)
            if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
                if (now - lastNetworkUpdate > 100) { // Throttle to ~10fps during drag for better performance
                    // Snap to grid during drag to ensure consistency with final position
                    const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);
                    const snappedPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

                    multiplayerSocket.emit('character_moved', {
                        characterId: tokenPlayerId,
                        position: { x: Math.round(snappedPos.x), y: Math.round(snappedPos.y) }, // Use grid-snapped position
                        isDragging: true
                    });
                    lastNetworkUpdate = now;
                    // Removed logging for performance
                }
            }

            // CRITICAL FIX: Update movement visualization and distance calculation during drag
            if (dragStartPosition && now - lastCombatUpdate > 100) { // 10fps for combat updates (reduced for performance)
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

            // If we're not dragging, check if this should be treated as a click
            if (!isDragging) {
                // Check if this was a click (very little movement) vs a drag that never started
                const wasClick = totalDragDistanceRef.current < 3; // 3 pixels threshold for click vs drag

                if (wasClick) {
                    // This was a click, not a drag
                    // Removed excessive logging for performance
                    setIsMouseDown(false);
                    isMouseDownRef.current = false;
                    setMouseDownPosition(null);
                    setDragStartPosition(null);
                    return;
                } else {
                    // Movement was significant but dragging never started - this shouldn't happen
                    // but handle it gracefully by doing nothing (reset state)
                    setIsMouseDown(false);
                    setMouseDownPosition(null);
                    setDragStartPosition(null);
                    return;
                }
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

            // Capture afterimage and explored area from old position before moving
            const levelEditorStore = useLevelEditorStore.getState();
            if (dragStartPosition && characterData) {
                levelEditorStore.captureTokenMovementAfterimage(
                    tokenId,
                    characterData,
                    dragStartPosition,
                    snappedWorldPos
                );
            }

            // Update final position with grid snapping
            updateCharacterTokenPosition(tokenId, { x: snappedWorldPos.x, y: snappedWorldPos.y });

            // Update local position immediately to prevent visual jumps
            setLocalPosition({ x: snappedWorldPos.x, y: snappedWorldPos.y });

            // PERFORMANCE: If this is the viewing token, update its position ONLY on drop (not during drag)
            // This ensures fog calculations run once when drag ends, not continuously during drag
            // FIXED: Force visibility recalculation when token is dropped
            if (isViewingFrom) {
                const levelEditorStore = useLevelEditorStore.getState();
                const currentViewingToken = levelEditorStore.viewingFromToken;
                if (currentViewingToken) {
                    // Update position - this will trigger visibility recalculation
                    // The StaticFogOverlay will detect the drag end and clear cache
                    levelEditorStore.setViewingFromToken({
                        ...currentViewingToken,
                        position: { x: snappedWorldPos.x, y: snappedWorldPos.y }
                    });
                }
            }

            // Reset drag refs
            isDraggingRef.current = false;
            isMouseDownRef.current = false;

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
                            characterId: tokenPlayerId,
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
                        characterId: tokenPlayerId,
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
            // PERFORMANCE: Clear global token drag flag
            window._isDraggingToken = false;

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
                // Trigger mouseup to properly finalize the position
                handleMouseUp(e);
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
            // Add the event listeners to the document to ensure they work even if the cursor moves outside the token
            // Use passive: false for both mousemove and mouseup to allow preventDefault
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });
            document.addEventListener('pointermove', handlePointerMove, { passive: false });
            document.addEventListener('pointerup', handlePointerUp, { passive: false });
            document.addEventListener('pointercancel', handlePointerUp, { passive: false });

            // CRITICAL FIX: Handle mouse leaving the window to prevent position jumps
            document.addEventListener('mouseleave', handleMouseLeave, { passive: false });

            // Safety timeout to reset dragging state if mouse up is missed (e.g., cursor leaves window)
            // CRITICAL FIX: Increased from 5s to 30s to prevent interrupting long drags
            // This is now a last resort since we handle mouseleave properly
            dragTimeoutId = setTimeout(() => {
                console.warn('⏰ Character drag timeout triggered after 30s - this should rarely happen');
                setIsDragging(false);
                setIsMouseDown(false);
                setMouseDownPosition(null);
                setDragStartPosition(null);
                // PERFORMANCE: Clear global token drag flag
                window._isDraggingToken = false;
                if (window.multiplayerDragState) {
                    window.multiplayerDragState.delete('character');
                }
                window.tokenInteractionActive = false;
                window.tokenInteractionTimestamp = null;
            }, 30000); // 30 second timeout (safety net only)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerUp);
            if (dragTimeoutId) {
                clearTimeout(dragTimeoutId);
            }
            // PERFORMANCE: Cancel any pending RAF updates
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            pendingWorldPosRef.current = null;
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
            // Don't close if clicking on context menu or its children
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                // Use a small delay to allow onClick handlers to execute first
                setTimeout(() => {
                    setShowContextMenu(false);
                }, 10);
            }
        };

        if (showContextMenu) {
            // Use click instead of mousedown to allow onClick handlers to execute first
            document.addEventListener('click', handleClickOutside, true);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
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
            // Check if this is another player's token
            const isOtherPlayer = tokenPlayerId && tokenPlayerId !== 'current-player' && isInMultiplayer;
            onInspect(characterData, !isOtherPlayer); // false if it's another player's token
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

        // Update character health through character store - pass current value, keep max unchanged
        useCharacterStore.getState().updateResource('health', newHp, undefined);

        // CRITICAL FIX: Sync HP to combat timeline if in combat
        if (isInCombat) {
            const { updateCombatantHP } = useCombatStore.getState();
            updateCombatantHP(tokenId, newHp);
        }

        // Show floating combat text at token's screen position
        if (window.showFloatingCombatText && screenPosition) {
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
        if (window.showFloatingCombatText && screenPosition) {
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
        if (window.showFloatingCombatText && screenPosition) {
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
        if (window.showFloatingCombatText && screenPosition) {
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
        if (window.showFloatingCombatText && screenPosition) {
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

        // Set health to 0
        useCharacterStore.getState().updateResource('health', 0, undefined);

        // Show floating combat text
        if (window.showFloatingCombatText && screenPosition) {
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
        if (window.showFloatingCombatText && screenPosition) {
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

    // State for buff/debuff creator modal
    const [showBuffDebuffCreator, setShowBuffDebuffCreator] = useState(false);
    const [buffDebuffInitialType, setBuffDebuffInitialType] = useState(null);

    // Handle opening conditions window
    const handleOpenConditions = useCallback(() => {
        console.log('Opening conditions window for token:', tokenId);
        setShowConditionsWindow(true);
        setShowContextMenu(false);
    }, [tokenId]);

    // Handle opening buff/debuff creator
    const handleOpenBuffDebuffCreator = useCallback((type = null) => {
        console.log('Opening buff/debuff creator for token:', tokenId, 'type:', type);
        setBuffDebuffInitialType(type);
        setShowBuffDebuffCreator(true);
        setShowContextMenu(false);
    }, [tokenId]);

    // Active condition effects mapped to visual overlays (token state + buff/debuff stores)
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
            exhausted: 'exhausted',
            exhaust: 'exhausted',
            frightened: 'frightened',
            fear: 'frightened',
            terrified: 'frightened',
            stunned: 'stunned',
            stun: 'stunned',
            paralyzed: 'paralyzed',
            paralyse: 'paralyzed',
            blinded: 'blinded',
            blind: 'blinded',
            invisible: 'invisible',
            invisibility: 'invisible',
            restrained: 'restrained',
            restraint: 'restrained',
            grappled: 'grappled',
            grapple: 'grappled',
            petrified: 'petrified',
            petrify: 'petrified',
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
        (token.state?.conditions || []).forEach(c => {
            const key = mapName(c.id || c.name) || normalize(c.id || c.name);
            const label = c.name || c.id || key;
            pushCondition(key, label);
        });

        const seen = new Set();
        const unique = [];
        for (const item of collect) {
            if (item.key && !seen.has(item.key)) {
                seen.add(item.key);
                unique.push(item);
            }
        }

        return unique;
    }, [token.state?.conditions, tokenId]);

    // Calculate health percentage for health bar
    const healthPercentage = (characterData.health.current / characterData.health.max) * 100;

    // Get health bar color based on percentage
    const getHealthBarColor = (percentage) => {
        if (percentage > 75) return '#4CAF50'; // Green
        if (percentage > 50) return '#FFC107'; // Yellow
        if (percentage > 25) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    // Don't render if not visible (unless in GM mode or not viewing from a token)
    if (!isTokenVisible) {
        return null;
    }

    return (
        <>
            <div
                ref={tokenRef}
                className={`character-token ${isDragging ? 'dragging' : ''} ${isTargeted ? 'targeted' : ''} ${isMyTurn ? 'my-turn' : ''} ${isViewingFrom ? 'viewing-from' : ''}`}
                style={{
                    // CRITICAL: Always include position in React style to prevent jumping during re-renders
                    left: screenPosition.x,
                    top: screenPosition.y,
                    width: `${tokenSize}px`,
                    height: `${tokenSize}px`,
                    borderColor: isViewingFrom ? '#00BFFF' : (isMyTurn ? '#FFD700' : isTargeted ? '#FF9800' : characterData.tokenSettings.borderColor),
                    zIndex: isDragging ? 1000 : 150, // Higher z-index to be above ObjectSystem canvas (20) and grid tiles (10)
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    border: `3px solid ${isViewingFrom ? '#00BFFF' : (isMyTurn ? '#FFD700' : isSelectedForCombat ? '#00FF00' : isTargeted ? '#FF9800' : characterData.tokenSettings.borderColor)}`,
                    overflow: 'visible',
                    boxShadow: isViewingFrom
                        ? '0 0 25px rgba(0, 191, 255, 1), 0 0 15px rgba(0, 191, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : isMyTurn
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
                onPointerDown={(e) => {
                    lastPointerTypeRef.current = e.pointerType || 'mouse';
                    longPressHandlers.onPointerDown(e);
                    if (e.pointerType === 'touch') {
                        handleMouseDown(e);
                    }
                }}
                onPointerMove={longPressHandlers.onPointerMove}
                onPointerUp={longPressHandlers.onPointerUp}
                onPointerCancel={longPressHandlers.onPointerCancel}
                onClick={handleTokenClick}
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

                {/* Character Image with Transformations */}
                <div
                    className="token-icon"
                    style={{
                        backgroundImage: getCharacterImage() ? `url(${getCharacterImage()})` : 'none',
                        width: '100%',
                        height: '100%',
                        backgroundSize: characterData.lore?.imageTransformations
                            ? `${(characterData.lore.imageTransformations.scale || 1) * 120}%`
                            : 'cover',
                        backgroundPosition: characterData.lore?.imageTransformations
                            ? `${50 + (characterData.lore.imageTransformations.positionX || 0) / 2}% ${50 - (characterData.lore.imageTransformations.positionY || 0) / 2}%`
                            : 'center center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '50%',
                        transform: characterData.lore?.imageTransformations
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
            {showContextMenu && (() => {
                // Build context menu items
                const menuItems = [];

                // Token Actions submenu
                menuItems.push({
                    icon: <i className="fas fa-cog"></i>,
                    label: 'Token Actions',
                    submenu: [
                        {
                            icon: <i className="fas fa-search"></i>,
                            label: 'Inspect',
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowContextMenu(false);
                                handleInspectCharacter();
                            }
                        },
                        {
                            icon: <i className="fas fa-crosshairs"></i>,
                            label: isTargeted ? 'Clear Target' : 'Target',
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowContextMenu(false);
                                handleTarget();
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
                        {
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
                                    // Reset the disabled flag since player is explicitly enabling it
                                    levelEditorStore.playerViewFromTokenDisabled = false;
                                    // Set this token as the viewing token (restricts fog reveal to token's vision)
                                    const tokenData = {
                                        type: 'character',
                                        id: tokenId,
                                        characterId: tokenId,
                                        position: position
                                    };
                                    levelEditorStore.setViewingFromToken(tokenData);
                                    // Center camera on token initially (but don't lock it)
                                    setCameraPosition(position.x, position.y);
                                }
                            },
                            className: isViewingFrom ? 'active' : ''
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
                    ]
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

                // Mana submenu
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
                            icon: <i className="fas fa-battery-empty"></i>,
                            label: 'Drain All',
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowContextMenu(false);
                                handleDrainMana();
                            },
                            className: 'danger'
                        }
                    ]
                });

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
                                setShowContextMenu(false);
                                handleOpenBuffDebuffCreator();
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
                            padding: '0',
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
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
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
                                                    e.preventDefault();
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
                                backgroundImage: getCharacterImage() ? `url(${getCharacterImage()})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: `2px solid ${characterData.tokenSettings?.borderColor || '#8b4513'}`
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {characterData.name}
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.7 }}>
                                Level {characterData.level} {characterData.raceDisplayName || characterData.race} {characterData.class}
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
                                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Your Turn</span>
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

                    {/* Active Effects */}
                    {(() => {
                        const tokenBuffs = (activeBuffs || []).filter(b => b.targetId === tokenId);
                        const tokenDebuffs = (activeDebuffs || []).filter(d => d.targetId === tokenId);
                        const allEffects = [...tokenBuffs, ...tokenDebuffs];

                        if (allEffects.length === 0) return null;

                        return (
                            <div style={{
                                borderTop: '1px solid #a08c70',
                                paddingTop: '6px',
                                fontSize: '10px'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Active Effects:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {allEffects.slice(0, 4).map((effect, index) => {
                                        const isBuff = tokenBuffs.includes(effect);
                                        const effectColor = effect.color || (isBuff ? '#32CD32' : '#DC143C');

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    color: '#333',
                                                    fontWeight: 500,
                                                    lineHeight: '1.3',
                                                    borderLeft: `3px solid ${effectColor}`,
                                                    paddingLeft: '6px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {effect.icon && <i className={effect.icon} style={{ color: effectColor, fontSize: '10px' }}></i>}
                                                    <span style={{ fontWeight: 'bold' }}>{effect.name}</span>
                                                </div>
                                                {effect.effectSummary && (
                                                    <div style={{ fontSize: '9px', color: '#7a3b2e', marginTop: '1px', fontWeight: '600' }}>
                                                        {effect.effectSummary}
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

            {/* Buff/Debuff Creator Modal */}
            <BuffDebuffCreatorModal
                isOpen={showBuffDebuffCreator}
                onClose={() => {
                    setShowBuffDebuffCreator(false);
                    setBuffDebuffInitialType(null);
                }}
                tokenId={tokenId}
                creature={{
                    name: characterData.name,
                    stats: {
                        maxHp: characterData.health.max,
                        maxMana: characterData.mana.max,
                        maxActionPoints: characterData.actionPoints.max
                    }
                }}
                initialType={buffDebuffInitialType}
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
