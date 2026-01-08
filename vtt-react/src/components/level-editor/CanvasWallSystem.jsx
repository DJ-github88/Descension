import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';

const CanvasWallSystem = () => {
    const canvasRef = useRef(null);
    
    // Get state from stores
    const { 
        cameraX, 
        cameraY, 
        zoomLevel, 
        playerZoom, 
        gridSize,
        gridType,
        gridOffsetX, 
        gridOffsetY 
    } = useGameStore();
    
    const {
        wallData,
        drawingLayers,
        showWallLayer,
        isEditorMode,
        viewingFromToken,
        visibleArea,
        getExploredArea,
        selectedWallKey,
        windowOverlays,
        selectedWindowKey
    } = useLevelEditorStore();
    
    // Calculate effective zoom
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as terrain
    const gridToScreen = useCallback((gridX, gridY, canvasWidth, canvasHeight) => {
        try {
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, canvasWidth || window.innerWidth, canvasHeight || window.innerHeight);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            // Use viewport-centered coordinate system for consistency
            const screenX = (worldX - cameraX) * effectiveZoom + (canvasWidth || window.innerWidth) / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + (canvasHeight || window.innerHeight) / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Convert grid coordinates to screen coordinates for windows (supports fractional positions)
    // This function treats grid coordinates as continuous values, not snapping to tile boundaries
    const gridToScreenForWindow = useCallback((gridX, gridY, canvasWidth, canvasHeight) => {
        try {
            const gridSystem = getGridSystem();
            const { gridSize: gs, gridOffsetX: gox, gridOffsetY: goy } = gridSystem.getGridState();
            // Convert fractional grid coordinates directly to world coordinates
            // This allows windows to be placed anywhere along walls, not just on grid lines
            const worldX = (gridX * gs) + gox;
            const worldY = (gridY * gs) + goy;
            return gridSystem.worldToScreen(worldX, worldY, canvasWidth || window.innerWidth, canvasHeight || window.innerHeight);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            // Use viewport-centered coordinate system for consistency
            const screenX = (worldX - cameraX) * effectiveZoom + (canvasWidth || window.innerWidth) / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + (canvasHeight || window.innerHeight) / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Wall and door color palettes
    const getWallPalette = (wallTypeId) => {
        const palettes = {
            stone_wall: {
                main: '#6B6358',
                dark: '#4A453D',
                light: '#8B8578',
                mortar: '#555047'
            },
            wooden_wall: {
                main: '#7B5230',
                dark: '#4A3120',
                light: '#9B7250',
                mortar: '#3A2515'
            },
            brick_wall: {
                main: '#8B4A4A',
                dark: '#5A2A2A',
                light: '#AB6A6A',
                mortar: '#3A3535'
            },
            metal_wall: {
                main: '#6A7580',
                dark: '#3A4550',
                light: '#8A95A0',
                mortar: '#2A3540'
            },
            magical_barrier: {
                main: '#8040B0',
                dark: '#5020A0',
                light: '#A060D0',
                mortar: '#4010A0'
            },
            force_wall: {
                main: '#3090D0',
                dark: '#1060A0',
                light: '#50B0F0',
                mortar: '#0050A0'
            },
            wooden_door: {
                main: '#6B4020',
                dark: '#3A2010',
                light: '#8B6040',
                frame: '#4A3015'
            },
            stone_door: {
                main: '#5A5550',
                dark: '#3A3530',
                light: '#7A7570',
                frame: '#2A2520'
            },
            // Window palettes
            glass_window: {
                main: '#87CEEB',
                dark: '#5B9BD5',
                light: '#B0E0E6',
                frame: '#4A3015',
                glass: 'rgba(135, 206, 235, 0.4)'
            },
            barred_window: {
                main: '#708090',
                dark: '#4A5568',
                light: '#A0AEC0',
                frame: '#2D3748',
                bars: '#1A202C'
            },
            arrow_slit: {
                main: '#4A4A4A',
                dark: '#2D2D2D',
                light: '#6A6A6A',
                frame: '#1A1A1A',
                slit: '#000000'
            },
            open_window: {
                main: '#F5F5DC',
                dark: '#D4C4A8',
                light: '#FFFFF0',
                frame: '#8B7355'
            }
        };
        return palettes[wallTypeId] || palettes.stone_wall;
    };

    // Render walls on canvas
    const renderWalls = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Get valid dimensions - use window size as fallback if rect is invalid
        const width = rect.width > 0 ? rect.width : (window.innerWidth || 1920);
        const height = rect.height > 0 ? rect.height : (window.innerHeight || 1080);
        
        // Don't render if canvas dimensions are still invalid
        if (width <= 0 || height <= 0) {
            return;
        }
        
        // Set canvas size to match container
        canvas.width = width;
        canvas.height = height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if wall layer is visible (support both new layer system and legacy showWallLayer)
        const wallLayer = drawingLayers.find(layer => layer.id === 'walls');
        const isWallLayerVisible = (wallLayer && wallLayer.visible) || showWallLayer;

        if (!isWallLayerVisible || !wallData || Object.keys(wallData).length === 0) {
            return;
        }

        // Render walls (logging removed for performance)

        // Calculate visible bounds for performance
        let startX, endX, startY, endY;
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const bounds = gridSystem.getVisibleGridBounds(viewport.width, viewport.height);
            startX = bounds.minX - 2;
            endX = bounds.maxX + 2;
            startY = bounds.minY - 2;
            endY = bounds.maxY + 2;
        } catch (error) {
            // Fallback calculation
            startX = Math.floor((cameraX - gridOffsetX) / gridSize) - 5;
            endX = Math.ceil((cameraX + canvas.width / effectiveZoom - gridOffsetX) / gridSize) + 5;
            startY = Math.floor((cameraY - gridOffsetY) / gridSize) - 5;
            endY = Math.ceil((cameraY + canvas.height / effectiveZoom - gridOffsetY) / gridSize) + 5;
        }

        // Get visibility data for FOV-based rendering
        const levelEditorStore = useLevelEditorStore.getState();
        const { isGMMode } = levelEditorStore;
        
        // Convert visibleArea array back to Set for efficient lookup (if it's an array)
        // Use subscribed values for better reactivity
        const visibleAreaSet = visibleArea ? (visibleArea instanceof Set ? visibleArea : new Set(visibleArea)) : null;
        
        // Only apply FOV filtering if:
        // 1. We're viewing from a token (not just editing)
        // 2. We have a visible area set
        // 3. We're NOT in GM mode
        // 4. We're NOT in editor mode (walls should always be visible when editing)
        // Note: In multiplayer, players should see walls even if not in visible area (greyed out)
        const shouldFilterByFOV = viewingFromToken && visibleAreaSet && !isGMMode && !isEditorMode;
        
        // First pass: collect all corner points where walls meet
        // For hex grids, track actual edge vertices; for square grids, track grid centers
        const cornerPoints = new Map(); // key: "x,y" or "worldX,worldY" -> { count, wallTypes: Set, worldPos }
        
        Object.entries(wallData).forEach(([wallKey, wallData_item]) => {
            const wallType = typeof wallData_item === 'string' ? wallData_item : wallData_item.type;
            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData || wallTypeData.interactive) return; // Skip doors
            
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
            
            if (gridType === 'hex') {
                // For hex grids, track actual edge vertices
                const gridSystem = getGridSystem();
                const edge = gridSystem.getHexEdge(x1, y1, x2, y2);
                if (edge) {
                    // Track both edge endpoints
                    const key1 = `${edge.start.x.toFixed(2)},${edge.start.y.toFixed(2)}`;
                    const key2 = `${edge.end.x.toFixed(2)},${edge.end.y.toFixed(2)}`;
                    
                    if (!cornerPoints.has(key1)) {
                        cornerPoints.set(key1, { count: 0, wallTypes: new Set(), worldPos: { x: edge.start.x, y: edge.start.y } });
                    }
                    if (!cornerPoints.has(key2)) {
                        cornerPoints.set(key2, { count: 0, wallTypes: new Set(), worldPos: { x: edge.end.x, y: edge.end.y } });
                    }
                    
                    cornerPoints.get(key1).count++;
                    cornerPoints.get(key1).wallTypes.add(wallType);
                    cornerPoints.get(key2).count++;
                    cornerPoints.get(key2).wallTypes.add(wallType);
                }
            } else {
                // Square grid: track grid centers
                const key1 = `${x1},${y1}`;
                const key2 = `${x2},${y2}`;
                
                if (!cornerPoints.has(key1)) {
                    cornerPoints.set(key1, { count: 0, wallTypes: new Set(), worldPos: null });
                }
                if (!cornerPoints.has(key2)) {
                    cornerPoints.set(key2, { count: 0, wallTypes: new Set(), worldPos: null });
                }
                
                cornerPoints.get(key1).count++;
                cornerPoints.get(key1).wallTypes.add(wallType);
                cornerPoints.get(key2).count++;
                cornerPoints.get(key2).wallTypes.add(wallType);
            }
        });
        
        // Render walls
        Object.entries(wallData).forEach(([wallKey, wallData_item]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallData_item === 'string' ? wallData_item : wallData_item.type;
            const wallState = typeof wallData_item === 'object' ? wallData_item.state : 'default';
            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData) return;

            // Parse wall coordinates from key: "x1,y1,x2,y2"
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Check if wall is in visible bounds
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            if (maxX < startX || minX > endX || maxY < startY || minY > endY) {
                return; // Skip walls outside visible area
            }
            
            // Check FOV visibility: only apply when actually viewing from a token (not during editing)
            // A wall is visible if:
            // 1. At least one of its endpoint tiles or tiles it crosses are in visibleArea, OR
            // 2. The wall blocks line of sight to any visible tile (walls obstructing vision should be visible)
            // Note: In GM mode or editor mode, walls should always be visible regardless of FOV
            let isWallVisible = true; // Default to visible (for GM mode or when not filtering)
            if (shouldFilterByFOV) {
                // Check if any tile the wall passes through is in the visible area
                isWallVisible = false;
                
                // Check endpoint tiles
                const tile1Key = `${x1},${y1}`;
                const tile2Key = `${x2},${y2}`;
                if (visibleAreaSet.has(tile1Key) || visibleAreaSet.has(tile2Key)) {
                    isWallVisible = true;
                } else {
                    // Check intermediate tiles along the wall
                    // For horizontal walls, check tiles between x1 and x2
                    // For vertical walls, check tiles between y1 and y2
                    if (x1 === x2) {
                        // Vertical wall
                        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                            const tileKey = `${x1},${y}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                        }
                    } else if (y1 === y2) {
                        // Horizontal wall
                        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                            const tileKey = `${x},${y1}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                        }
                    } else {
                        // Diagonal wall - check all tiles along the line
                        const dx = x2 > x1 ? 1 : -1;
                        const dy = y2 > y1 ? 1 : -1;
                        let x = x1;
                        let y = y1;
                        while (x !== x2 || y !== y2) {
                            const tileKey = `${x},${y}`;
                            if (visibleAreaSet.has(tileKey)) {
                                isWallVisible = true;
                                break;
                            }
                            if (x !== x2) x += dx;
                            if (y !== y2) y += dy;
                        }
                    }
                }
                
                // If wall is not directly in visible area, check if it's adjacent to visible tiles
                // Walls that are adjacent to visible tiles are likely blocking line of sight and should be visible
                // This ensures walls obstructing vision are shown even if they're outside the visible area
                if (!isWallVisible) {
                    const wallMinX = Math.min(x1, x2);
                    const wallMaxX = Math.max(x1, x2);
                    const wallMinY = Math.min(y1, y2);
                    const wallMaxY = Math.max(y1, y2);
                    
                    // Check tiles adjacent to the wall - these are tiles that the wall borders
                    const tilesAdjacentToWall = [];
                    
                    if (x1 === x2) {
                        // Vertical wall - check tiles on both sides (left and right)
                        for (let y = wallMinY; y <= wallMaxY; y++) {
                            tilesAdjacentToWall.push(`${x1 - 1},${y}`); // Left side
                            tilesAdjacentToWall.push(`${x1},${y}`);     // Right side
                        }
                    } else if (y1 === y2) {
                        // Horizontal wall - check tiles on both sides (top and bottom)
                        for (let x = wallMinX; x <= wallMaxX; x++) {
                            tilesAdjacentToWall.push(`${x},${y1 - 1}`); // Top side
                            tilesAdjacentToWall.push(`${x},${y1}`);     // Bottom side
                        }
                    } else {
                        // Diagonal wall - check tiles around it
                        const dx = x2 > x1 ? 1 : -1;
                        const dy = y2 > y1 ? 1 : -1;
                        for (let i = 0; i <= Math.abs(x2 - x1); i++) {
                            const x = x1 + (i * dx);
                            const y = y1 + (i * dy);
                            // Check all 8 surrounding tiles
                            for (let dx2 = -1; dx2 <= 1; dx2++) {
                                for (let dy2 = -1; dy2 <= 1; dy2++) {
                                    tilesAdjacentToWall.push(`${x + dx2},${y + dy2}`);
                                }
                            }
                        }
                    }
                    
                    // If wall is adjacent to any visible tile, show it (it's blocking or bordering vision)
                    for (const adjacentTileKey of tilesAdjacentToWall) {
                        if (visibleAreaSet.has(adjacentTileKey)) {
                            isWallVisible = true;
                            break;
                        }
                    }
                }
                
                // Check if wall is in explored area (for greyed out state)
                let isWallInExploredArea = false;
                if (!isWallVisible && !isGMMode && getExploredArea) {
                    // Check if any tile the wall passes through is in explored area
                    if (x1 === x2) {
                        // Vertical wall
                        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                            if (getExploredArea(x1, y)) {
                                isWallInExploredArea = true;
                                break;
                            }
                        }
                    } else if (y1 === y2) {
                        // Horizontal wall
                        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                            if (getExploredArea(x, y1)) {
                                isWallInExploredArea = true;
                                break;
                            }
                        }
                    } else {
                        // Diagonal wall
                        const dx = x2 > x1 ? 1 : -1;
                        const dy = y2 > y1 ? 1 : -1;
                        let x = x1;
                        let y = y1;
                        while (x !== x2 || y !== y2) {
                            if (getExploredArea(x, y)) {
                                isWallInExploredArea = true;
                                break;
                            }
                            if (x !== x2) x += dx;
                            if (y !== y2) y += dy;
                        }
                    }
                }
                
                // In multiplayer, always show walls to players (even if not in visible area) - they'll be greyed out
                // Only skip walls if they're not in visible area AND not in explored area AND we're filtering by FOV
                // But in multiplayer, players should see all walls (greyed out if not visible)
                if (shouldFilterByFOV && !isWallVisible && !isWallInExploredArea) {
                    // Don't skip - show all walls to players, they'll be greyed out if not visible
                    // This ensures players can see walls even if they're not in the visible area
                }
            }

            // Get screen positions for wall endpoints
            // For hex grids, draw along hex edges; for square grids, draw between centers
            let screenPos1, screenPos2;
            const gridSystem = getGridSystem();
            
            if (gridType === 'hex') {
                // For hex grids, get the edge between the two hex coordinates
                const edge = gridSystem.getHexEdge(x1, y1, x2, y2);
                if (edge) {
                    // Convert edge points to screen coordinates
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos1 = gridSystem.worldToScreen(edge.start.x, edge.start.y, viewport.width, viewport.height);
                    screenPos2 = gridSystem.worldToScreen(edge.end.x, edge.end.y, viewport.width, viewport.height);
                } else {
                    // Fallback to center-to-center if edge calculation fails
                    screenPos1 = gridToScreen(x1, y1, window.innerWidth, window.innerHeight);
                    screenPos2 = gridToScreen(x2, y2, window.innerWidth, window.innerHeight);
                }
            } else {
                // Square grid: draw between grid centers
                screenPos1 = gridToScreen(x1, y1, window.innerWidth, window.innerHeight);
                screenPos2 = gridToScreen(x2, y2, window.innerWidth, window.innerHeight);
            }

            // Calculate properties
            const wallThickness = Math.max(8, gridSize * effectiveZoom * 0.15);
            const palette = getWallPalette(wallType);
            const isGreyedOut = shouldFilterByFOV && !isWallVisible && !isGMMode;
            const isInteractive = wallTypeData.interactive;
            const isDoorOpen = isInteractive && wallState === 'open';
            
            // Calculate geometry
            const dx = screenPos2.x - screenPos1.x;
            const dy = screenPos2.y - screenPos1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const midX = (screenPos1.x + screenPos2.x) / 2;
            const midY = (screenPos1.y + screenPos2.y) / 2;

            ctx.save();

            if (isInteractive) {
                // === DOOR RENDERING ===
                if (isDoorOpen) {
                    // Open door - transparent/faded to show it's passable
                    ctx.globalAlpha = isGreyedOut ? 0.15 : 0.3;
                    
                    // Door frame posts at endpoints
                    const postSize = wallThickness * 0.9;
                    ctx.fillStyle = isGreyedOut ? '#3A3530' : (palette.frame || palette.dark);
                    ctx.fillRect(screenPos1.x - postSize/2, screenPos1.y - postSize/2, postSize, postSize);
                    ctx.fillRect(screenPos2.x - postSize/2, screenPos2.y - postSize/2, postSize, postSize);
                    
                    // Dashed line indicating open doorway
                    ctx.strokeStyle = isGreyedOut ? '#444' : palette.dark;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 6]);
                    ctx.beginPath();
                    ctx.moveTo(screenPos1.x, screenPos1.y);
                    ctx.lineTo(screenPos2.x, screenPos2.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                } else {
                    // Closed/Locked door - solid door appearance
                    ctx.globalAlpha = isGreyedOut ? 0.4 : 1.0;
                    ctx.save();
                    ctx.translate(midX, midY);
                    ctx.rotate(angle);
                    
                    const doorWidth = length;
                    const doorHeight = wallThickness * 1.4;
                    
                    // Door frame shadow
                    ctx.fillStyle = '#1A1510';
                    ctx.fillRect(-doorWidth/2 + 2, -doorHeight/2 + 2, doorWidth + 4, doorHeight + 4);
                    
                    // Door frame (outer border)
                    ctx.fillStyle = isGreyedOut ? '#3A3530' : (palette.frame || palette.dark);
                    ctx.fillRect(-doorWidth/2 - 2, -doorHeight/2 - 2, doorWidth + 4, doorHeight + 4);
                    
                    // Main door panel
                    ctx.fillStyle = isGreyedOut ? '#5A5550' : palette.main;
                    ctx.fillRect(-doorWidth/2, -doorHeight/2, doorWidth, doorHeight);
                    
                    // Door panel inset (wood grain effect)
                    const insetMargin = doorHeight * 0.18;
                    ctx.fillStyle = isGreyedOut ? '#4A4540' : palette.dark;
                    ctx.fillRect(-doorWidth/2 + insetMargin, -doorHeight/2 + insetMargin, 
                                 doorWidth - insetMargin*2, doorHeight - insetMargin*2);
                    
                    // Inner panel (lighter center)
                    ctx.fillStyle = isGreyedOut ? '#6A6560' : palette.light;
                    ctx.fillRect(-doorWidth/2 + insetMargin*2, -doorHeight/2 + insetMargin*2, 
                                 doorWidth - insetMargin*4, doorHeight - insetMargin*4);
                    
                    // Horizontal wood grain lines
                    ctx.strokeStyle = isGreyedOut ? '#555' : palette.dark;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.3;
                    for (let i = 1; i < 3; i++) {
                        const yOffset = -doorHeight/2 + (doorHeight * i / 3);
                        ctx.beginPath();
                        ctx.moveTo(-doorWidth/2 + 4, yOffset);
                        ctx.lineTo(doorWidth/2 - 4, yOffset);
                        ctx.stroke();
                    }
                    ctx.globalAlpha = isGreyedOut ? 0.4 : 1.0;
                    
                    // Door handle plate
                    const handleX = doorWidth/2 - doorHeight * 0.5;
                    const handlePlateH = doorHeight * 0.5;
                    const handlePlateW = doorHeight * 0.25;
                    ctx.fillStyle = isGreyedOut ? '#666' : '#8B7355';
                    ctx.fillRect(handleX - handlePlateW/2, -handlePlateH/2, handlePlateW, handlePlateH);
                    
                    // Door handle (round knob)
                    const handleRadius = Math.max(3, doorHeight * 0.15);
                    ctx.fillStyle = isGreyedOut ? '#888' : '#C9A227';
                    ctx.beginPath();
                    ctx.arc(handleX, 0, handleRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Handle highlight
                    ctx.fillStyle = isGreyedOut ? '#AAA' : '#E8C547';
                    ctx.beginPath();
                    ctx.arc(handleX - handleRadius*0.3, -handleRadius*0.3, handleRadius*0.35, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            } else {
                // === WALL RENDERING ===
                ctx.globalAlpha = isGreyedOut ? 0.4 : 1.0;
                ctx.save();
                ctx.translate(midX, midY);
                ctx.rotate(angle);
                
                const wallWidth = length + 2; // Slight overlap for better corner joins
                const wallHeight = wallThickness;
                
                // Wall shadow
                ctx.fillStyle = '#1A1510';
                ctx.fillRect(-wallWidth/2 + 2, -wallHeight/2 + 2, wallWidth, wallHeight);
                
                // Main wall body
                ctx.fillStyle = isGreyedOut ? '#555' : palette.main;
                ctx.fillRect(-wallWidth/2, -wallHeight/2, wallWidth, wallHeight);
                
                // Top edge highlight (3D effect)
                ctx.fillStyle = isGreyedOut ? '#777' : palette.light;
                ctx.fillRect(-wallWidth/2, -wallHeight/2, wallWidth, Math.max(2, wallHeight * 0.15));
                
                // Bottom edge shadow
                ctx.fillStyle = isGreyedOut ? '#333' : palette.dark;
                ctx.fillRect(-wallWidth/2, wallHeight/2 - Math.max(2, wallHeight * 0.15), wallWidth, Math.max(2, wallHeight * 0.15));
                
                // Stone/brick texture pattern
                if (wallHeight > 5 && !isGreyedOut) {
                    ctx.fillStyle = palette.mortar || palette.dark;
                    ctx.globalAlpha = 0.4;
                    
                    // Horizontal mortar line
                    ctx.fillRect(-wallWidth/2, -0.5, wallWidth, 1);
                    
                    // Vertical mortar lines (stone blocks)
                    const blockWidth = wallHeight * 2;
                    let offset = 0;
                    for (let x = -wallWidth/2 + blockWidth/2; x < wallWidth/2; x += blockWidth) {
                        ctx.fillRect(x + offset - 0.5, -wallHeight/2, 1, wallHeight);
                        offset = offset === 0 ? blockWidth/2 : 0; // Stagger blocks
                    }
                    ctx.globalAlpha = isGreyedOut ? 0.4 : 1.0;
                }
                
                ctx.restore();
            }
            
            ctx.restore();
            
            // Draw selection highlight if this wall is selected
            if (wallKey === selectedWallKey && isEditorMode) {
                ctx.save();
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(screenPos1.x, screenPos1.y);
                ctx.lineTo(screenPos2.x, screenPos2.y);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Selection handles at endpoints
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 0;
                
                const handleSize = 6;
                ctx.beginPath();
                ctx.arc(screenPos1.x, screenPos1.y, handleSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(screenPos2.x, screenPos2.y, handleSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                ctx.restore();
            }

            // Wall rendered (logging removed for performance)
        });
        
        // Second pass: render corner joints where multiple walls meet
        cornerPoints.forEach((data, key) => {
            if (data.count < 2) return; // Only draw corners where 2+ walls meet
            
            let screenPos;
            if (gridType === 'hex' && data.worldPos) {
                // For hex grids, use the actual world position of the vertex
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                screenPos = gridSystem.worldToScreen(data.worldPos.x, data.worldPos.y, viewport.width, viewport.height);
            } else {
                // Square grid: use grid coordinates
                const [gx, gy] = key.split(',').map(Number);
                
                // Check if corner is in visible bounds
                if (gx < startX || gx > endX || gy < startY || gy > endY) return;
                
                screenPos = gridToScreen(gx, gy, window.innerWidth, window.innerHeight);
            }
            
            const wallThickness = Math.max(8, gridSize * effectiveZoom * 0.15);
            
            // Get the primary wall type for coloring
            const primaryType = data.wallTypes.values().next().value;
            const palette = getWallPalette(primaryType);
            
            ctx.save();
            
            const size = wallThickness + 2;
            const halfSize = size / 2;
            
            // Corner block shadow
            ctx.fillStyle = '#1A1510';
            ctx.fillRect(screenPos.x - halfSize + 2, screenPos.y - halfSize + 2, size, size);
            
            // Main corner block
            ctx.fillStyle = palette.main;
            ctx.fillRect(screenPos.x - halfSize, screenPos.y - halfSize, size, size);
            
            // Top edge highlight
            ctx.fillStyle = palette.light;
            ctx.fillRect(screenPos.x - halfSize, screenPos.y - halfSize, size, 2);
            
            // Left edge highlight  
            ctx.fillRect(screenPos.x - halfSize, screenPos.y - halfSize, 2, size);
            
            // Bottom edge shadow
            ctx.fillStyle = palette.dark;
            ctx.fillRect(screenPos.x - halfSize, screenPos.y + halfSize - 2, size, 2);
            
            // Right edge shadow
            ctx.fillRect(screenPos.x + halfSize - 2, screenPos.y - halfSize, 2, size);
            
            // Inner detail - small cross pattern for stone look
            ctx.fillStyle = palette.mortar || palette.dark;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(screenPos.x - 0.5, screenPos.y - halfSize + 2, 1, size - 4);
            ctx.fillRect(screenPos.x - halfSize + 2, screenPos.y - 0.5, size - 4, 1);
            ctx.globalAlpha = 1.0;
            
            ctx.restore();
        });
        
        // Third pass: render window overlays on top of walls
        if (windowOverlays && Object.keys(windowOverlays).length > 0) {
            Object.entries(windowOverlays).forEach(([key, windowData]) => {
                // Support both integer and fractional coordinates
                const gx = windowData.gridX !== undefined ? windowData.gridX : parseFloat(key.split(',')[0]);
                const gy = windowData.gridY !== undefined ? windowData.gridY : parseFloat(key.split(',')[1]);
                
                // Check if window is in visible bounds
                if (gx < startX || gx > endX || gy < startY || gy > endY) return;
                
                // Get screen position - use the exact fractional position for centering on walls
                // Use gridToScreenForWindow to support arbitrary positions along walls (not just grid lines)
                const screenPos = gridToScreenForWindow(gx, gy, window.innerWidth, window.innerHeight);
                const windowType = windowData.type;
                const windowTypeData = WALL_TYPES[windowType];
                if (!windowTypeData) return;
                
                const windowSize = Math.max(14, gridSize * effectiveZoom * 0.35);
                const frameThickness = Math.max(2, windowSize * 0.15);
                
                ctx.save();
                
                if (windowType === 'glass_window') {
                    // Glass window - frame with transparent blue glass
                    // Outer frame
                    ctx.fillStyle = '#5C4A35';
                    ctx.fillRect(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness, 
                                 windowSize + frameThickness*2, windowSize + frameThickness*2);
                    
                    // Glass pane
                    ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                    ctx.fillRect(screenPos.x - windowSize/2, screenPos.y - windowSize/2, windowSize, windowSize);
                    
                    // Reflection
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.beginPath();
                    ctx.moveTo(screenPos.x - windowSize/2 + 2, screenPos.y - windowSize/2 + 2);
                    ctx.lineTo(screenPos.x - windowSize/2 + windowSize*0.4, screenPos.y - windowSize/2 + 2);
                    ctx.lineTo(screenPos.x - windowSize/2 + 2, screenPos.y + windowSize/2 - 2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Cross divider
                    ctx.strokeStyle = '#5C4A35';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(screenPos.x, screenPos.y - windowSize/2);
                    ctx.lineTo(screenPos.x, screenPos.y + windowSize/2);
                    ctx.moveTo(screenPos.x - windowSize/2, screenPos.y);
                    ctx.lineTo(screenPos.x + windowSize/2, screenPos.y);
                    ctx.stroke();
                    
                } else if (windowType === 'barred_window') {
                    // Barred window - dark opening with iron bars
                    ctx.fillStyle = '#5A5550';
                    ctx.fillRect(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness, 
                                 windowSize + frameThickness*2, windowSize + frameThickness*2);
                    
                    // Dark opening
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                    ctx.fillRect(screenPos.x - windowSize/2, screenPos.y - windowSize/2, windowSize, windowSize);
                    
                    // Vertical bars
                    ctx.strokeStyle = '#2A2A2A';
                    ctx.lineWidth = 2;
                    for (let i = 1; i <= 3; i++) {
                        const barX = screenPos.x - windowSize/2 + (i * windowSize / 4);
                        ctx.beginPath();
                        ctx.moveTo(barX, screenPos.y - windowSize/2);
                        ctx.lineTo(barX, screenPos.y + windowSize/2);
                        ctx.stroke();
                    }
                    // Horizontal bar
                    ctx.beginPath();
                    ctx.moveTo(screenPos.x - windowSize/2, screenPos.y);
                    ctx.lineTo(screenPos.x + windowSize/2, screenPos.y);
                    ctx.stroke();
                    
                } else if (windowType === 'arrow_slit') {
                    // Arrow slit - narrow vertical opening
                    ctx.fillStyle = '#5A5550';
                    ctx.fillRect(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness, 
                                 windowSize + frameThickness*2, windowSize + frameThickness*2);
                    
                    // Narrow dark slit
                    ctx.fillStyle = '#000';
                    const slitWidth = Math.max(4, windowSize * 0.25);
                    ctx.fillRect(screenPos.x - slitWidth/2, screenPos.y - windowSize/2, slitWidth, windowSize);
                    
                } else if (windowType === 'open_window') {
                    // Open window - just frame around empty space
                    ctx.fillStyle = '#6B5545';
                    ctx.fillRect(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness, 
                                 windowSize + frameThickness*2, windowSize + frameThickness*2);
                    
                    // Empty opening
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                    ctx.fillRect(screenPos.x - windowSize/2, screenPos.y - windowSize/2, windowSize, windowSize);
                }
                
                // Frame highlight
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness);
                ctx.lineTo(screenPos.x + windowSize/2 + frameThickness, screenPos.y - windowSize/2 - frameThickness);
                ctx.moveTo(screenPos.x - windowSize/2 - frameThickness, screenPos.y - windowSize/2 - frameThickness);
                ctx.lineTo(screenPos.x - windowSize/2 - frameThickness, screenPos.y + windowSize/2 + frameThickness);
                ctx.stroke();
                
                // Selection highlight if this window is selected
                if (key === selectedWindowKey && isEditorMode) {
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 8;
                    ctx.strokeRect(
                        screenPos.x - windowSize/2 - frameThickness - 3,
                        screenPos.y - windowSize/2 - frameThickness - 3,
                        windowSize + frameThickness*2 + 6,
                        windowSize + frameThickness*2 + 6
                    );
                    ctx.setLineDash([]);
                    ctx.shadowBlur = 0;
                }
                
                ctx.restore();
            });
        }

    }, [wallData, drawingLayers, gridToScreen, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY, showWallLayer, viewingFromToken, visibleArea, isEditorMode, selectedWallKey, windowOverlays, selectedWindowKey]);

    // Throttle wall rendering with RAF for smooth performance during camera movement
    const throttledRenderWallsRef = useRef(null);
    
    // Update throttled function when renderWalls changes
    useEffect(() => {
        throttledRenderWallsRef.current = rafThrottle(renderWalls);
    }, [renderWalls]);
    
    // Trigger render when dependencies change (throttled)
    useEffect(() => {
        // Use requestAnimationFrame to ensure canvas is properly sized
        const rafId = requestAnimationFrame(() => {
            if (throttledRenderWallsRef.current) {
                throttledRenderWallsRef.current();
            }
        });
        return () => cancelAnimationFrame(rafId);
    }, [wallData, drawingLayers, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY, showWallLayer, viewingFromToken, visibleArea, isEditorMode, selectedWallKey, windowOverlays, selectedWindowKey]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (throttledRenderWallsRef.current) {
                throttledRenderWallsRef.current();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="canvas-wall-system"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 8, // Above terrain tiles but below UI elements
                pointerEvents: 'none'
            }}
        />
    );
};

export default CanvasWallSystem;
