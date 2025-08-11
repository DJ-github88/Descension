import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useTargetingStore, { TARGET_TYPES } from '../../store/targetingStore';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
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
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStartPosition, setDragStartPosition] = useState(null);
    const [localPosition, setLocalPosition] = useState(position); // Local position for smooth dragging
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);

    // Update local position when prop position changes (but not during dragging)
    useEffect(() => {
        if (!isDragging) {
            setLocalPosition(position);
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
    const { gridSize, zoomLevel, playerZoom, cameraX, cameraY } = useGameStore();
    const effectiveZoom = zoomLevel * playerZoom;
    const tokenSize = gridSize * 0.8 * effectiveZoom; // Similar to CreatureToken sizing
    const { currentTarget, setTarget, clearTarget } = useTargetingStore();
    const { isInCombat, currentTurn } = useCombatStore();

    // Calculate screen position from grid position (use local position during dragging)
    const screenPosition = useMemo(() => {
        const currentPos = isDragging ? localPosition : position;
        if (!gridSystem) return currentPos;

        // Get viewport dimensions for proper coordinate conversion
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return gridSystem.worldToScreen(currentPos.x, currentPos.y, viewportWidth, viewportHeight);
    }, [position, localPosition, isDragging, cameraX, cameraY, effectiveZoom]);

    // Check if this token is targeted
    const isTargeted = currentTarget?.id === tokenId && currentTarget?.type === 'player';
    const isMyTurn = isInCombat && currentTurn === tokenId;

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

        console.log('🖱️ Mouse entered character token:', characterData.name);

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

        console.log('📍 Tooltip position set:', { x: adjustedX, y: adjustedY });

        // Show tooltip after 0.5 second delay
        tooltipTimeoutRef.current = setTimeout(() => {
            console.log('✨ Showing tooltip for:', characterData.name);
            setShowTooltip(true);
        }, 500);
    };

    // Handle mouse leave (hide tooltip)
    const handleMouseLeave = () => {
        console.log('🖱️ Mouse left character token:', characterData.name);
        // Clear timeout and hide tooltip
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(false);
    };

    // Handle mouse down for dragging
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only left mouse button
        if (showContextMenu) return; // Don't start dragging if context menu is open

        e.stopPropagation();
        e.preventDefault(); // Prevent text selection during drag

        // If in combat and not this token's turn, prevent movement
        if (isInCombat && !isMyTurn) {
            console.log('Cannot move character token - not your turn in combat');
            setShowTooltip(false);
            return;
        }

        // Calculate the offset from the cursor to the token's current screen position
        // This is the key to making the token follow the cursor correctly
        setDragOffset({
            x: e.clientX - screenPosition.x,
            y: e.clientY - screenPosition.y
        });

        setIsDragging(true);
        setShowTooltip(false);

        // Store the starting position for movement
        setDragStartPosition({ x: position.x, y: position.y });
    };

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
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;

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

            setIsDragging(false);
            setDragStartPosition(null);
        };

        if (isDragging) {
            // Add the event listeners to the document to ensure they work even if the cursor moves outside the token
            document.addEventListener('mousemove', handleMouseMove, { passive: false });
            document.addEventListener('mouseup', handleMouseUp, { passive: false });
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, gridSystem, updateCharacterTokenPosition, tokenId]);

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
            const targetData = {
                id: tokenId,
                name: characterData.name,
                type: 'player',
                data: characterData,
                health: characterData.health,
                mana: characterData.mana,
                actionPoints: characterData.actionPoints
            };
            setTarget(targetData, TARGET_TYPES.PLAYER);
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
                    border: `3px solid ${isMyTurn ? '#FFD700' : isTargeted ? '#FF9800' : characterData.tokenSettings.borderColor}`,
                    overflow: 'hidden',
                    boxShadow: isMyTurn
                        ? '0 0 20px rgba(255, 215, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : isTargeted
                        ? '0 0 15px rgba(255, 152, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    backgroundImage: `url(${getCharacterImage()})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pointerEvents: 'all', // Ensure it can receive mouse events
                    userSelect: 'none',
                    touchAction: 'none'
                }}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
            >
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

            {/* Context Menu */}
            {showContextMenu && createPortal(
                <div
                    ref={contextMenuRef}
                    className="unified-context-menu compact"
                    style={{
                        left: contextMenuPosition.x,
                        top: contextMenuPosition.y
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-group">
                            <div className="context-menu-section">
                                <button className="context-menu-button" onClick={handleInspectCharacter}>
                                    <i className="fas fa-search"></i> Inspect Character
                                </button>

                                <button
                                    className={`context-menu-button ${isTargeted ? 'active' : ''}`}
                                    onClick={handleTarget}
                                >
                                    <i className="fas fa-crosshairs"></i> {isTargeted ? 'Clear Target' : 'Target'}
                                </button>

                                <button className="context-menu-button danger" onClick={handleRemoveToken}>
                                    <i className="fas fa-trash"></i> Remove Token
                                </button>
                            </div>
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
        </>
    );
};

export default CharacterToken;
