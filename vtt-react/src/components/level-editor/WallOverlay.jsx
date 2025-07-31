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
        gridOffsetY
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

        return baseStyle;
    };

    // Handle door click to toggle state
    const handleWallClick = (wall, event) => {
        if (!wall.type.interactive || !wall.type.states) return;

        event.stopPropagation();

        const currentState = wall.state || wall.type.states[0];
        const currentIndex = wall.type.states.indexOf(currentState);
        const nextIndex = (currentIndex + 1) % wall.type.states.length;
        const nextState = wall.type.states[nextIndex];

        const { x1, y1, x2, y2 } = wall.gridCoords;
        updateWall(x1, y1, x2, y2, { state: nextState });
    };

    // Handle wall interactions with tooltips
    const handleWallMouseEnter = (wall, event) => {
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
        }, 1500); // 1.5 second delay
    };

    const handleWallMouseLeave = () => {
        setHoveredWall(null);
        setShowTooltip(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleWallRightClick = (wall, event) => {
        if (!isEditorMode) return;

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

    // Generate wall tiles using the EXACT same pattern as main grid tiles
    const wallTiles = useMemo(() => {
        console.log('🧱 WALL OVERLAY: Processing walls', {
            showWallLayer,
            wallDataKeys: Object.keys(wallData || {}),
            wallData: wallData
        });

        if (!showWallLayer || !wallData || Object.keys(wallData).length === 0) {
            console.log('🧱 WALL OVERLAY: No walls to display');
            return [];
        }

        const walls = [];
        const gridSystem = getGridSystem();

        // Calculate all wall positions in one batch - same as gridSystem.generateGridTiles()
        Object.entries(wallData).forEach(([wallKey, wallData]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallData === 'string' ? wallData : wallData.type;
            const wallState = typeof wallData === 'object' ? wallData.state : 'default';
            const wallId = typeof wallData === 'object' ? wallData.id : null;

            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData) return;

            // Parse wall coordinates from key: "x1,y1,x2,y2"
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            try {
                // Use the exact same coordinate transformation as main grid tiles
                const worldPos1 = gridSystem.gridToWorldCorner(x1, y1);
                const worldPos2 = gridSystem.gridToWorldCorner(x2, y2);

                // Get viewport dimensions for coordinate conversion
                const viewport = gridSystem.getViewportDimensions();
                const screenPos1 = gridSystem.worldToScreen(worldPos1.x, worldPos1.y, viewport.width, viewport.height);
                const screenPos2 = gridSystem.worldToScreen(worldPos2.x, worldPos2.y, viewport.width, viewport.height);

                // Check visibility using the same method as main grid tiles
                const margin = tileSize * effectiveZoom * 2; // Same margin as grid tiles

                const minX = Math.min(screenPos1.x, screenPos2.x);
                const maxX = Math.max(screenPos1.x, screenPos2.x);
                const minY = Math.min(screenPos1.y, screenPos2.y);
                const maxY = Math.max(screenPos1.y, screenPos2.y);

                if (minX <= viewport.width + margin && maxX >= -margin &&
                    minY <= viewport.height + margin && maxY >= -margin) {

                    // Store pre-calculated screen positions exactly like main grid tiles
                    walls.push({
                        key: wallKey,
                        type: wallTypeData,
                        state: wallState,
                        id: wallId,
                        screenX1: screenPos1.x,
                        screenY1: screenPos1.y,
                        screenX2: screenPos2.x,
                        screenY2: screenPos2.y,
                        isVertical: x1 === x2,
                        isHorizontal: y1 === y2,
                        gridCoords: { x1, y1, x2, y2 }
                    });
                }
            } catch (error) {
                console.warn('Error calculating wall position:', error);
            }
        });

        console.log('🧱 WALL OVERLAY: Calculated walls for rendering:', walls.length, {
            cameraX, cameraY, effectiveZoom,
            sampleWall: walls[0] ? {
                key: walls[0].key,
                screenX1: walls[0].screenX1,
                screenY1: walls[0].screenY1,
                screenX2: walls[0].screenX2,
                screenY2: walls[0].screenY2
            } : null
        });
        return walls;
    }, [
        // EXACT same dependencies as main grid tiles for perfect synchronization
        wallData,
        showWallLayer,
        cameraX,
        cameraY,
        effectiveZoom,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        isEditorMode
    ]);

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
                zIndex: 8 // Above terrain tiles but below UI elements
            }}
        >
            {wallTiles.map((wall) => {
                // Use pre-calculated wall positions exactly like main grid tiles
                const wallThickness = Math.max(8, tileSize * effectiveZoom * 0.15);
                const materialStyle = wall.type.interactive ? getDoorStyle(wall) : getWallMaterialStyle(wall.type.id);
                const isHovered = hoveredWall && hoveredWall.key === wall.key;
                const isInteractive = wall.type.interactive && wall.type.states;

                if (wall.isVertical) {
                    // Vertical wall using pre-calculated screen positions with enhanced gap filling
                    const height = Math.abs(wall.screenY2 - wall.screenY1);
                    const top = Math.min(wall.screenY1, wall.screenY2);
                    const extensionAmount = wallThickness * 0.6; // Same extension as Grid.jsx

                    return (
                        <div
                            key={wall.key}
                            className={`wall-element vertical-wall ${isHovered ? 'hovered' : ''}`}
                            style={{
                                position: 'absolute',
                                left: `${wall.screenX1 - wallThickness / 2}px`,
                                top: `${top - extensionAmount}px`, // Extend beyond endpoints
                                width: `${wallThickness}px`,
                                height: `${height + (extensionAmount * 2)}px`, // Fill gaps on both ends
                                background: materialStyle.background,
                                border: materialStyle.border,
                                borderRadius: '2px',
                                boxShadow: isHovered
                                    ? `${materialStyle.boxShadow}, 0 0 8px rgba(255, 255, 0, 0.6)`
                                    : materialStyle.boxShadow,
                                cursor: isEditorMode ? (isInteractive ? 'pointer' : 'pointer') : 'default',
                                transform: isHovered ? 'scale(1.05) translateZ(0)' : 'translateZ(0)', // Hardware acceleration like grid tiles
                                zIndex: isHovered ? 12 : 9,
                                pointerEvents: 'auto',
                                // Same performance optimizations as main grid tiles
                                willChange: effectiveZoom < 0.5 ? 'auto' : 'transform',
                                backfaceVisibility: 'hidden',
                                contain: 'layout style paint',
                                isolation: 'isolate'
                            }}
                            onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                            onMouseLeave={handleWallMouseLeave}
                            onContextMenu={(e) => handleWallRightClick(wall, e)}
                            onClick={(e) => handleWallClick(wall, e)}
                        >
                        </div>
                    );
                } else if (wall.isHorizontal) {
                    // Horizontal wall using pre-calculated screen positions with enhanced gap filling
                    const width = Math.abs(wall.screenX2 - wall.screenX1);
                    const left = Math.min(wall.screenX1, wall.screenX2);
                    const extensionAmount = wallThickness * 0.6; // Same extension as Grid.jsx

                    return (
                        <div
                            key={wall.key}
                            className={`wall-element horizontal-wall ${isHovered ? 'hovered' : ''}`}
                            style={{
                                position: 'absolute',
                                left: `${left - extensionAmount}px`, // Extend beyond endpoints
                                top: `${wall.screenY1 - wallThickness / 2}px`,
                                width: `${width + (extensionAmount * 2)}px`, // Fill gaps on both ends
                                height: `${wallThickness}px`,
                                background: materialStyle.background,
                                border: materialStyle.border,
                                borderRadius: '2px',
                                boxShadow: isHovered
                                    ? `${materialStyle.boxShadow}, 0 0 8px rgba(255, 255, 0, 0.6)`
                                    : materialStyle.boxShadow,
                                cursor: isEditorMode ? (isInteractive ? 'pointer' : 'pointer') : 'default',
                                transform: isHovered ? 'scale(1.05) translateZ(0)' : 'translateZ(0)', // Hardware acceleration like grid tiles
                                zIndex: isHovered ? 12 : 9,
                                pointerEvents: 'auto',
                                // Same performance optimizations as main grid tiles
                                willChange: effectiveZoom < 0.5 ? 'auto' : 'transform',
                                backfaceVisibility: 'hidden',
                                contain: 'layout style paint',
                                isolation: 'isolate'
                            }}
                            onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                            onMouseLeave={handleWallMouseLeave}
                            onContextMenu={(e) => handleWallRightClick(wall, e)}
                            onClick={(e) => handleWallClick(wall, e)}
                        >
                        </div>
                    );
                }

                return null;
            })}



            {/* Wall Tooltip */}
            {showTooltip && hoveredWall && (
                <div
                    className="tile-tooltip unified-tooltip-style"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x + 15, // Keep wall tooltip on the right side
                        top: tooltipPosition.y - 10, // Back to normal position
                        transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
                        zIndex: 10000
                    }}
                >
                    <div className="tooltip-content">
                        <div className="tooltip-item">
                            <strong>{hoveredWall.type.name}</strong>
                        </div>
                        {hoveredWall.type.interactive && (
                            <div className="tooltip-item">
                                State: {hoveredWall.state || hoveredWall.type.states?.[0] || 'default'}
                            </div>
                        )}
                        <div className="tooltip-item">
                            {hoveredWall.type.description || `A ${hoveredWall.type.name.toLowerCase()}`}
                        </div>
                        {hoveredWall.type.interactive && (
                            <div className="tooltip-item" style={{
                                fontStyle: 'italic',
                                color: '#666',
                                fontSize: '11px'
                            }}>
                                Click to {hoveredWall.state === 'open' ? 'close' : 'open'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Unified Context Menu */}
            <UnifiedContextMenu
                visible={showContextMenu}
                x={contextMenuPosition.x}
                y={contextMenuPosition.y}
                onClose={handleCloseContextMenu}
                title={contextMenu ? `${contextMenu.type.name}` : null}
                items={contextMenu ? [
                    {
                        icon: '✕',
                        label: 'Remove Wall',
                        onClick: handleRemoveWall,
                        className: 'danger-action'
                    },
                    {
                        type: 'separator'
                    },
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
