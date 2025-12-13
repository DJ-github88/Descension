import React, { useState, useRef, useEffect, useMemo } from 'react';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import UnifiedContextMenu from './UnifiedContextMenu';
import './styles/WallOverlay.css';
import './styles/TileTooltip.css';

const WallOverlay = () => {
    // State for tooltips and interactions
    const [hoveredWall, setHoveredWall] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);

    // Level editor store
    const {
        isEditorMode,
        wallData,
        showWallLayer,
        removeWall,
        updateWall
    } = useLevelEditorStore();

    // Game store for grid settings - same as main grid tiles
    const {
        gridSize,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        gridOffsetX,
        gridOffsetY,
        isGMMode
    } = useGameStore();

    const tileSize = gridSize || 50;
    const effectiveZoom = zoomLevel * playerZoom;

    // Get material styling for walls
    const getWallMaterialStyle = (wallType) => {
        const materials = {
            stone_wall: {
                background: 'linear-gradient(45deg, #8B7355 0%, #A0896B 25%, #8B7355 50%, #6B5B47 75%, #8B7355 100%)',
                border: '2px solid #5D4E37',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)'
            },
            wooden_wall: {
                background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 20%, #8B4513 40%, #654321 60%, #8B4513 80%, #A0522D 100%)',
                border: '2px solid #654321',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)'
            },
            brick_wall: {
                background: 'linear-gradient(0deg, #B22222 0%, #CD5C5C 25%, #B22222 50%, #8B0000 75%, #B22222 100%)',
                border: '2px solid #8B0000',
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5)'
            },
            metal_wall: {
                background: 'linear-gradient(45deg, #708090 0%, #C0C0C0 25%, #708090 50%, #2F4F4F 75%, #708090 100%)',
                border: '2px solid #2F4F4F',
                boxShadow: 'inset 0 0 12px rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.4)'
            },
            magical_barrier: {
                background: 'linear-gradient(45deg, rgba(138,43,226,0.6) 0%, rgba(75,0,130,0.8) 50%, rgba(138,43,226,0.6) 100%)',
                border: '2px solid #4B0082',
                boxShadow: '0 0 15px rgba(138,43,226,0.8), inset 0 0 10px rgba(255,255,255,0.2)'
            },
            force_wall: {
                background: 'linear-gradient(45deg, rgba(0,191,255,0.4) 0%, rgba(30,144,255,0.6) 50%, rgba(0,191,255,0.4) 100%)',
                border: '2px solid #1E90FF',
                boxShadow: '0 0 12px rgba(0,191,255,0.6), inset 0 0 8px rgba(255,255,255,0.3)'
            },
            wooden_door: {
                background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 20%, #8B4513 40%, #654321 60%, #8B4513 80%, #A0522D 100%)',
                border: '2px solid #654321',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)'
            },
            stone_door: {
                background: 'linear-gradient(45deg, #8B7355 0%, #A0896B 25%, #8B7355 50%, #6B5B47 75%, #8B7355 100%)',
                border: '2px solid #5D4E37',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)'
            }
        };
        return materials[wallType] || materials.stone_wall;
    };

    // Get door-specific styling based on state
    const getDoorStyle = (wall) => {
        if (!wall.type.interactive) return {};

        const baseStyle = getWallMaterialStyle(wall.type.id);

        if (wall.state === 'open') {
            return {
                ...baseStyle,
                opacity: 0.3,
                border: '2px dashed ' + baseStyle.border.split(' ')[2], // Extract color from border
                background: baseStyle.background.replace(/rgba?\([^)]+\)/g, (match) => {
                    // Make background more transparent
                    return match.replace(/,\s*[\d.]+\)/, ', 0.2)');
                })
            };
        }

        if (wall.state === 'locked') {
            return {
                ...baseStyle,
                background: `${baseStyle.background}, radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 30%)`,
                boxShadow: `${baseStyle.boxShadow}, 0 0 8px rgba(255,215,0,0.4)`,
                border: '2px solid #FFD700' // Gold border for locked state
            };
        }

        return baseStyle;
    };

    // Handle door click - just open context menu (no state cycling)
    const handleWallClick = (wall, event) => {
        if (!wall.type.interactive || !wall.type.states) return;
        event.stopPropagation();
        // Open context menu on any click
        handleWallRightClick(wall, event);
    };

    // Handle wall interactions with tooltips
    // Works for doors (interactive) for everyone, and all walls in editor mode
    const handleWallMouseEnter = (wall, event) => {
        // Show tooltips for interactive elements (doors) even for players
        if (!isEditorMode && !wall.type.interactive) return;

        setHoveredWall(wall);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
        setShowTooltip(false);

        // Clear existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Set new timeout for tooltip
        hoverTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, 500); // 0.5 second delay
    };

    const handleWallMouseLeave = () => {
        setHoveredWall(null);
        setShowTooltip(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleWallRightClick = (wall, event) => {
        // Allow right-click context menu for doors (even for players to see info)
        // and for all walls in editor mode
        if (!isEditorMode && !wall.type.interactive) return;

        event.preventDefault();
        setContextMenu(wall);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setShowContextMenu(true);
    };

    const handleRemoveWall = () => {
        if (contextMenu) {
            const [x1, y1, x2, y2] = contextMenu.key.split(',').map(Number);
            removeWall(x1, y1, x2, y2);
            setContextMenu(null);
            setShowContextMenu(false);
        }
    };

    const handleToggleDoorLock = () => {
        if (contextMenu && contextMenu.type.interactive) {
            const { x1, y1, x2, y2 } = contextMenu.gridCoords;
            const currentState = contextMenu.state || 'closed';
            // Toggle between locked and closed
            const newState = currentState === 'locked' ? 'closed' : 'locked';
            updateWall(x1, y1, x2, y2, { state: newState });
            setContextMenu(null);
            setShowContextMenu(false);
        }
    };

    const handleToggleDoorOpen = () => {
        if (contextMenu && contextMenu.type.interactive) {
            const { x1, y1, x2, y2 } = contextMenu.gridCoords;
            const currentState = contextMenu.state || 'closed';
            // Toggle between open and closed (not locked)
            const newState = currentState === 'open' ? 'closed' : 'open';
            updateWall(x1, y1, x2, y2, { state: newState });
            setContextMenu(null);
            setShowContextMenu(false);
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
        setShowContextMenu(false);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Helper function to convert grid coordinates to screen coordinates
    // Called at render time for instant updates (same approach as CanvasWallSystem)
    const gridToScreen = (gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback calculation if grid system fails
            const worldX = (gridX * tileSize) + gridOffsetX;
            const worldY = (gridY * tileSize) + gridOffsetY;
            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;
            return { x: screenX, y: screenY };
        }
    };

    // Process wall data into renderable objects (without screen positions - those are calculated at render time)
    const wallTiles = useMemo(() => {
        if (!showWallLayer || !wallData || Object.keys(wallData).length === 0) {
            return [];
        }

        const walls = [];

        // Process wall data - screen positions will be calculated at render time
        Object.entries(wallData).forEach(([wallKey, wallDataItem]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallDataItem === 'string' ? wallDataItem : wallDataItem.type;
            const wallState = typeof wallDataItem === 'object' ? wallDataItem.state : 'default';
            const wallId = typeof wallDataItem === 'object' ? wallDataItem.id : null;

            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData) return;

            // Parse wall coordinates from key: "x1,y1,x2,y2"
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            walls.push({
                key: wallKey,
                type: wallTypeData,
                state: wallState,
                id: wallId,
                isVertical: x1 === x2,
                isHorizontal: y1 === y2,
                gridCoords: { x1, y1, x2, y2 }
            });
        });

        return walls;
    }, [wallData, showWallLayer]);

    // Always show walls if the wall layer is enabled, regardless of editor mode
    if (!showWallLayer) {
        return null;
    }

    return (
        <div
            className="wall-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 50 // Higher z-index to be above canvas but below UI
            }}
        >
            {/* WallOverlay renders hit areas for door interactions */}
            {wallTiles.map((wall) => {
                // Only render interactive elements (doors) - always, not just in editor mode
                const isInteractive = wall.type.interactive && wall.type.states;
                if (!isInteractive) {
                    return null; // Only render doors, not walls
                }

                // Calculate screen positions at render time
                const { x1, y1, x2, y2 } = wall.gridCoords;
                const screenPos1 = gridToScreen(x1, y1);
                const screenPos2 = gridToScreen(x2, y2);
                
                // Skip if outside viewport
                const margin = tileSize * effectiveZoom * 2;
                if (Math.max(screenPos1.x, screenPos2.x) < -margin || 
                    Math.min(screenPos1.x, screenPos2.x) > window.innerWidth + margin ||
                    Math.max(screenPos1.y, screenPos2.y) < -margin || 
                    Math.min(screenPos1.y, screenPos2.y) > window.innerHeight + margin) {
                    return null;
                }

                const wallThickness = Math.max(24, tileSize * effectiveZoom * 0.35); // Large hit area
                const isDoorLocked = wall.state === 'locked';
                const minDimension = Math.max(30, tileSize * effectiveZoom * 0.6);

                // Invisible hit area - only for interaction, no visual
                const hitAreaStyle = {
                    position: 'absolute',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 100,
                    pointerEvents: 'auto'
                };

                if (wall.isVertical) {
                    const height = Math.max(minDimension, Math.abs(screenPos2.y - screenPos1.y));
                    const top = Math.min(screenPos1.y, screenPos2.y);

                    return (
                        <div
                            key={wall.key}
                            className="door-hit-area"
                            style={{
                                ...hitAreaStyle,
                                left: `${screenPos1.x - wallThickness / 2}px`,
                                top: `${top - wallThickness / 4}px`,
                                width: `${wallThickness}px`,
                                height: `${height + wallThickness / 2}px`
                            }}
                            onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                            onMouseLeave={handleWallMouseLeave}
                            onContextMenu={(e) => handleWallRightClick(wall, e)}
                            onClick={(e) => handleWallClick(wall, e)}
                        />
                    );
                } else if (wall.isHorizontal) {
                    const width = Math.max(minDimension, Math.abs(screenPos2.x - screenPos1.x));
                    const left = Math.min(screenPos1.x, screenPos2.x);

                    return (
                        <div
                            key={wall.key}
                            className="door-hit-area"
                            style={{
                                ...hitAreaStyle,
                                left: `${left - wallThickness / 4}px`,
                                top: `${screenPos1.y - wallThickness / 2}px`,
                                width: `${width + wallThickness / 2}px`,
                                height: `${wallThickness}px`
                            }}
                            onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                            onMouseLeave={handleWallMouseLeave}
                            onContextMenu={(e) => handleWallRightClick(wall, e)}
                            onClick={(e) => handleWallClick(wall, e)}
                        />
                    );
                } else {
                    // Diagonal door
                    const dx = screenPos2.x - screenPos1.x;
                    const dy = screenPos2.y - screenPos1.y;
                    const length = Math.max(minDimension, Math.sqrt(dx * dx + dy * dy));
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    const centerX = (screenPos1.x + screenPos2.x) / 2;
                    const centerY = (screenPos1.y + screenPos2.y) / 2;

                    return (
                        <div
                            key={wall.key}
                            className="door-hit-area"
                            style={{
                                ...hitAreaStyle,
                                left: `${centerX - length / 2}px`,
                                top: `${centerY - wallThickness / 2}px`,
                                width: `${length}px`,
                                height: `${wallThickness}px`,
                                transform: `rotate(${angle}deg)`,
                                transformOrigin: 'center'
                            }}
                            onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                            onMouseLeave={handleWallMouseLeave}
                            onContextMenu={(e) => handleWallRightClick(wall, e)}
                            onClick={(e) => handleWallClick(wall, e)}
                        />
                    );
                }
            })}



            {/* Door Tooltip - shown on hover */}
            {showTooltip && hoveredWall && hoveredWall.type.interactive && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x + 15,
                        top: tooltipPosition.y + 10,
                        transform: tooltipPosition.x > window.innerWidth - 200 ? 'translateX(-110%)' : 'none',
                        zIndex: 10000,
                        backgroundColor: '#f0e6d2',
                        border: '2px solid #a08c70',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        fontFamily: 'Georgia, serif',
                        fontSize: '12px',
                        color: '#3d2914',
                        minWidth: '120px',
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px', borderBottom: '1px solid #a08c70', paddingBottom: '4px' }}>
                        {hoveredWall.type.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#5a4a3a' }}>
                        {hoveredWall.state === 'locked' ? 'Locked' : 
                         hoveredWall.state === 'open' ? 'Open' : 'Closed'}
                    </div>
                </div>
            )}

            {/* Unified Context Menu - for doors (always) and walls (editor mode only) */}
            <UnifiedContextMenu
                visible={showContextMenu}
                x={contextMenuPosition.x}
                y={contextMenuPosition.y}
                onClose={handleCloseContextMenu}
                title={contextMenu ? `${contextMenu.type.name}${contextMenu.state ? ` (${contextMenu.state})` : ''}` : null}
                items={contextMenu ? [
                    // Door-specific options
                    ...(contextMenu.type.interactive ? [
                        // Open/Close toggle (available to everyone if not locked)
                        ...(contextMenu.state !== 'locked' || isGMMode ? [{
                            icon: contextMenu.state === 'open' ? '🚪' : '🚪',
                            label: contextMenu.state === 'open' ? 'Close Door' : 'Open Door',
                            onClick: handleToggleDoorOpen
                        }] : []),
                        // Lock/Unlock (GM only)
                        ...(isGMMode ? [{
                            icon: contextMenu.state === 'locked' ? '🔓' : '🔒',
                            label: contextMenu.state === 'locked' ? 'Unlock Door' : 'Lock Door',
                            onClick: handleToggleDoorLock,
                            className: contextMenu.state === 'locked' ? '' : 'warning-action'
                        }] : []),
                        {
                            type: 'separator'
                        }
                    ] : []),
                    // Remove wall (editor mode or GM only)
                    ...(isEditorMode || isGMMode ? [{
                        icon: '✕',
                        label: contextMenu.type.interactive ? 'Remove Door' : 'Remove Wall',
                        onClick: handleRemoveWall,
                        className: 'danger-action'
                    },
                    {
                        type: 'separator'
                    }] : []),
                    {
                        icon: '✕',
                        label: 'Cancel',
                        onClick: handleCloseContextMenu
                    }
                ] : []}
            />
        </div>
    );
};

export default WallOverlay;
