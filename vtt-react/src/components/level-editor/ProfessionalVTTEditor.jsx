import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import useGridItemStore from '../../store/gridItemStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useMapStore from '../../store/mapStore';
import WowWindow from '../windows/WowWindow';
import { getIconUrl } from '../../utils/assetManager';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { useLevelEditorPersistence } from '../../hooks/useLevelEditorPersistence';
import { rafThrottle } from '../../utils/performanceUtils';

// Import professional tool components
import DrawingTools from './tools/DrawingTools';
import TerrainTools from './tools/TerrainTools';
import ObjectTools from './tools/ObjectTools';
import WallTools from './tools/WallTools';
import FogTools from './tools/FogTools';
import GridTools from './tools/GridTools';
import TerrainHoverPreview from './TerrainHoverPreview';
import { PROFESSIONAL_OBJECTS } from './objects/ObjectSystem';
import AreaRemoveModal from './AreaRemoveModal';

import './styles/ProfessionalVTTEditor.css';

const ProfessionalVTTEditor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('terrain');
    const [selectedTool, setSelectedTool] = useState('terrain_brush');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    const [hoverPreview, setHoverPreview] = useState({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
    const [isLayersPanelCollapsed, setIsLayersPanelCollapsed] = useState(true);
    const [selectionRect, setSelectionRect] = useState(null); // { startX, startY, endX, endY }
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedAreaObjects, setSelectedAreaObjects] = useState(null); // Objects found in selected area
    const [selectedWall, setSelectedWall] = useState(null); // { key, data, x1, y1, x2, y2 }
    const [wallDragStart, setWallDragStart] = useState(null); // For moving walls
    const [selectedWindow, setSelectedWindow] = useState(null); // { key, gridX, gridY, data }
    const [isDraggingWall, setIsDraggingWall] = useState(false);
    const [isObjectLocked, setIsObjectLocked] = useState(false); // When true, we're locked to selected object

    // Refs to track current dragging positions (avoids stale closure issues with state)
    const dragWindowRef = useRef(null); // { gridX, gridY, data } - current window position during drag
    const dragWallRef = useRef(null); // { x1, y1, x2, y2, key } - current wall position during drag
    const lastDragPosRef = useRef(null); // { gridX, gridY } - last mouse position during drag
    const windowDragRafRef = useRef(null); // RAF ref for throttling window drag updates
    const pendingWindowUpdateRef = useRef(null); // Pending window position update
    const doorDragRafRef = useRef(null); // RAF ref for throttling door drag updates
    const pendingDoorUpdateRef = useRef(null); // Pending door position update

    const windowRef = useRef(null);
    const overlayRef = useRef(null);
    const textInputRef = useRef(null);

    // Throttled hover preview updates - store latest position in ref and update state via RAF
    const hoverPreviewRef = useRef({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
    const hoverPreviewRafId = useRef(null);

    // Throttle fog painting calls using RAF for smooth painting
    const fogPaintThrottleRef = useRef(null);
    const pendingFogPaintRef = useRef(null); // Store pending paint call

    // Track last terrain brush position for line interpolation
    const lastTerrainBrushPosRef = useRef(null);

    // Throttled function to update hover preview state
    const updateHoverPreviewState = useCallback(() => {
        setHoverPreview({ ...hoverPreviewRef.current });
        hoverPreviewRafId.current = null;
    }, []);

    // Throttled hover preview updater
    const throttledUpdateHoverPreview = useCallback(() => {
        if (hoverPreviewRafId.current === null) {
            hoverPreviewRafId.current = requestAnimationFrame(updateHoverPreviewState);
        }
    }, [updateHoverPreviewState]);

    // Store connections
    const {
        isEditorMode,
        setEditorMode,
        activeTool,
        setActiveTool,
        toolSettings,
        setToolSettings,
        drawingLayers,
        drawingPaths,
        activeLayer,
        setActiveLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        toggleLayer,
        addDrawingPath,
        removeDrawingPath,
        selectedDrawings,
        clearDrawingSelection,
        saveMapState,
        loadMapState,
        clearAllProfessionalData,
        setTerrainAtPosition,
        paintTerrainBrush,
        paintTerrainLine,
        floodFillTerrain,
        removeTerrainAtPosition,
        removeTerrainLine,
        getTerrainAtPosition,
        removeFogAtPosition,
        finishFogErasePath,
        clearAllFog,
        coverEntireMapWithFog,
        addEnvironmentalObject,
        removeEnvironmentalObject,
        updateEnvironmentalObject,
        selectEnvironmentalObject,
        getObjectAtPosition,
        environmentalObjects,
        terrainData,
        wallData,
        addDndElement,
        showWallLayer,
        setWall,
        getWall,
        updateWall,
        removeWall,
        moveWall,
        selectedWallKey,
        setSelectedWallKey,
        windowOverlays,
        setWindowOverlay,
        removeWindowOverlay,
        selectedWindowKey,
        setSelectedWindowKey,
        clearTerrain,
        setCurrentDrawingPath,
        isCurrentlyDrawing,
        setIsCurrentlyDrawing,
        setCurrentDrawingTool,
        clearCurrentDrawing
    } = useLevelEditorStore();

    const {
        isGMMode,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        showGrid
    } = useGameStore();

    const {
        currentMapId,
        loadMapState: getMapStateFromStore,
        getCurrentMapId
    } = useMapStore();

    // Helper to get current map ID explicitly (prevents stale reads during rapid updates)
    const getExplicitCurrentMapId = () => {
        const mapStoreState = useMapStore.getState();
        return mapStoreState.currentMapId || 'default';
    };

    const { gridItems, removeItemFromGrid } = useGridItemStore();
    const { tokens, removeToken } = useCreatureStore();
    const { characterTokens, removeCharacterToken } = useCharacterTokenStore();

    // Level editor persistence hook
    const {
        saveLevelEditorState,
        loadLevelEditorState,
        copyFromRoom,
        clearRoomState,
        currentRoomId,
        isInRoom,
        hasUnsavedChanges
    } = useLevelEditorPersistence();

    // Professional VTT tool categories inspired by Roll20/Owlbear Rodeo
    const vttTools = {
        terrain: {
            name: 'Terrain',
            icon: 'Nature/World Map',
            tools: [
                { id: 'terrain_brush', name: 'Terrain Brush', icon: 'Utility/Utility Tool', cursor: 'crosshair' },
                { id: 'tile_stamp', name: 'Tile Stamp', icon: 'Utility/Utility', cursor: 'crosshair' },
                { id: 'elevation', name: 'Elevation', icon: 'Nature/World Map', cursor: 'crosshair' },
                { id: 'texture_paint', name: 'Texture Paint', icon: 'Utility/Utility Tool', cursor: 'crosshair' }
            ]
        },
        drawing: {
            name: 'Drawing',
            icon: 'Utility/Utility',
            tools: [
                { id: 'select', name: 'Select', icon: 'Utility/Target Crosshair', cursor: 'default' },
                { id: 'area_remove', name: 'Area Remove', icon: 'Utility/Broken', cursor: 'crosshair' },
                { id: 'freehand', name: 'Freehand', icon: 'Utility/Utility Tool', cursor: 'crosshair' },
                { id: 'line', name: 'Line', icon: 'Piercing/Piercing Shot', cursor: 'crosshair' },
                { id: 'rectangle', name: 'Rectangle', icon: 'Utility/Utility', cursor: 'crosshair' },
                { id: 'circle', name: 'Circle', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
                { id: 'text', name: 'Text', icon: 'Utility/Utility', cursor: 'text' },
                { id: 'eraser', name: 'Eraser', icon: 'Utility/Broken', cursor: 'crosshair' }
            ]
        },
        walls: {
            name: 'Walls',
            icon: 'Utility/Barred Shield',
            tools: [
                { id: 'wall_draw', name: 'Draw Wall', icon: 'Utility/Barred Shield', cursor: 'crosshair' },
                { id: 'door_place', name: 'Place Door', icon: 'Utility/Lockpick', cursor: 'crosshair' },
                { id: 'window_place', name: 'Place Window', icon: 'Utility/All Seeing Eye', cursor: 'crosshair' },
                { id: 'barrier_magic', name: 'Magic Barrier', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
                { id: 'wall_select', name: 'Select', icon: 'Utility/Target Crosshair', cursor: 'pointer' },
                { id: 'wall_erase', name: 'Erase Walls', icon: 'Utility/Broken', cursor: 'crosshair' }
            ]
        },
        fog: {
            name: 'Fog',
            icon: 'Shadow/Shadow Darkness',
            tools: [
                { id: 'fog_erase', name: 'Erase Fog', icon: 'Utility/Broken', cursor: 'crosshair' },
                { id: 'fog_clear_all', name: 'Clear All Fog', icon: 'Radiant/Radiant Sunburst', cursor: 'crosshair' }
            ]
        },
        objects: {
            name: 'Objects',
            icon: 'Utility/Utility Gear',
            tools: [
                { id: 'object_place', name: 'Place Object', icon: 'Utility/Utility', cursor: 'crosshair' },
                { id: 'token_place', name: 'Place Token', icon: 'Social/Golden Crown', cursor: 'crosshair' },
                { id: 'portal_create', name: 'Create Connection', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
                { id: 'marker_place', name: 'Place Marker', icon: 'Utility/Utility', cursor: 'crosshair' },
                { id: 'object_rotate', name: 'Rotate', icon: 'Utility/Swirling Vortex', cursor: 'move' },
                { id: 'object_scale', name: 'Scale', icon: 'Utility/Resize', cursor: 'nw-resize' }
            ]
        },
        grid: {
            name: 'Grid',
            icon: 'Utility/Utility Gear',
            tools: [
                { id: 'grid_settings', name: 'Grid Settings', icon: 'Utility/Utility Gear', cursor: 'default' },
                { id: 'grid_toggle', name: 'Toggle Grid', icon: 'Utility/Utility Gear', cursor: 'default' }
            ]
        }
    };

    // Toggle editor window
    const toggleEditor = () => {
        if (isGMMode) {
            setIsOpen(!isOpen);
            setEditorMode(!isEditorMode);
        }
    };

    // Handle tab change
    const handleTabChange = (tabId) => {
        console.log('🔄 Tab change to:', tabId);
        setActiveTab(tabId);
        const firstTool = vttTools[tabId]?.tools[0];
        if (firstTool) {
            setSelectedTool(firstTool.id);
            setActiveTool(firstTool.id);

            // Don't auto-select any object when switching to objects tab
            // User must explicitly choose which object to place
            if (tabId === 'objects' && firstTool.id === 'object_place') {
                const newSettings = {
                    ...toolSettings,
                    selectedObjectType: undefined,
                    selectedPlacementType: undefined
                };
                setToolSettings(newSettings);
            }
        }

        // Clear terrain-specific settings when switching away from terrain tab
        if (tabId !== 'terrain') {
            const newSettings = { ...toolSettings };
            delete newSettings.selectedTerrainType;
            setToolSettings(newSettings);
            console.log('🧹 Cleared selectedTerrainType from tool settings');
        }
    };

    // Handle tool selection
    const handleToolSelect = (toolId) => {
        setSelectedTool(toolId);
        setActiveTool(toolId);
        clearDrawingSelection();

        // Clear selection when switching away from select tool
        if (toolId !== 'wall_select') {
            setSelectedWallKey(null);
            setSelectedWindowKey(null);
            setSelectedWindow(null);
            setIsObjectLocked(false);
            // Clear drag refs
            dragWindowRef.current = null;
            dragWallRef.current = null;
            lastDragPosRef.current = null;
        }
    };

    // Handle tool settings change
    const handleToolSettingsChange = (newSettings) => {
        setToolSettings({ ...toolSettings, ...newSettings });
    };

    // Convert screen coordinates to grid coordinates using the same system as tokens and grid lines
    const screenToGrid = useCallback((clientX, clientY) => {
        if (!overlayRef.current) return null;

        const rect = overlayRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
        const gs = gridSize || 50;
        const gOX = gridOffsetX || 0;
        const gOY = gridOffsetY || 0;
        const camX = cameraX || 0;
        const camY = cameraY || 0;

        if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return null;

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.screenToWorld(x, y, viewport.width, viewport.height);
            const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

            return {
                gridX: gridCoords.x,
                gridY: gridCoords.y,
                worldX: worldPos.x,
                worldY: worldPos.y,
                screenX: x,
                screenY: y
            };
        } catch (error) {
            // Fallback calculation
            const worldX = (x / effectiveZoom) + camX;
            const worldY = (y / effectiveZoom) + camY;
            const gridX = Math.floor((worldX - gOX) / gs);
            const gridY = Math.floor((worldY - gOY) / gs);
            return { gridX, gridY, worldX, worldY, screenX: x, screenY: y };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

    // Convert grid coordinates to screen coordinates using the same system as tokens and grid lines
    const gridToScreen = useCallback((gridX, gridY) => {
        const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
        const gs = gridSize || 50;
        const gOX = gridOffsetX || 0;
        const gOY = gridOffsetY || 0;
        const camX = cameraX || 0;
        const camY = cameraY || 0;

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return { x: 0, y: 0 };
            const worldX = (gridX * gs) + gOX;
            const worldY = (gridY * gs) + gOY;

            const screenX = (worldX - camX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - camY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

    // Find wall at grid position - checks if a wall passes through or near a grid point
    const findWallAtPosition = useCallback((gridX, gridY) => {
        if (!wallData) return null;

        // Check all walls to find one that passes through this grid position
        for (const [wallKey, wall] of Object.entries(wallData)) {
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Check if this grid position is on the wall line
            // For horizontal walls (y1 === y2)
            if (y1 === y2 && gridY === y1) {
                const minX = Math.min(x1, x2);
                const maxX = Math.max(x1, x2);
                if (gridX >= minX && gridX <= maxX) {
                    return { key: wallKey, data: wall, x1, y1, x2, y2 };
                }
            }
            // For vertical walls (x1 === x2)
            if (x1 === x2 && gridX === x1) {
                const minY = Math.min(y1, y2);
                const maxY = Math.max(y1, y2);
                if (gridY >= minY && gridY <= maxY) {
                    return { key: wallKey, data: wall, x1, y1, x2, y2 };
                }
            }
            // Check endpoints
            if ((gridX === x1 && gridY === y1) || (gridX === x2 && gridY === y2)) {
                return { key: wallKey, data: wall, x1, y1, x2, y2 };
            }
        }
        return null;
    }, [wallData]);

    // Find all walls near a grid position (within 2.0 tile distance, doors get larger threshold)
    const findWallsNearPosition = useCallback((clickX, clickY) => {
        if (!wallData) return [];

        const walls = [];
        for (const [wallKey, wall] of Object.entries(wallData)) {
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Get wall type to determine selection threshold
            const wallType = typeof wall === 'string' ? wall : wall?.type;
            const isDoor = wallType && wallType.includes('door');
            // Doors get a larger selection threshold (2.5 tiles) since they're shorter
            const selectionThreshold = isDoor ? 2.5 : 2.0;

            // Calculate closest point on wall segment to click position
            const dx = x2 - x1;
            const dy = y2 - y1;
            const wallLength = Math.sqrt(dx * dx + dy * dy);

            if (wallLength === 0) {
                // Zero-length wall, check distance to endpoint
                const dist = Math.sqrt(Math.pow(clickX - x1, 2) + Math.pow(clickY - y1, 2));
                if (dist <= selectionThreshold) {
                    walls.push({ key: wallKey, data: wall, x1, y1, x2, y2, distance: dist });
                }
                continue;
            }

            // Project click point onto wall line, clamp to segment
            const t = Math.max(0, Math.min(1,
                ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
            ));

            // Closest point on wall
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;

            // Distance from click to closest point on wall
            const dist = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

            if (dist <= selectionThreshold) {
                walls.push({ key: wallKey, data: wall, x1, y1, x2, y2, distance: dist });
            }
        }

        // Sort by distance to prefer closest wall, but prioritize doors if they're close
        walls.sort((a, b) => {
            const aIsDoor = (typeof a.data === 'string' ? a.data : a.data?.type)?.includes('door');
            const bIsDoor = (typeof b.data === 'string' ? b.data : b.data?.type)?.includes('door');

            // If one is a door and distances are similar (within 0.5 tiles), prefer door
            if (aIsDoor && !bIsDoor && Math.abs(a.distance - b.distance) < 0.5) {
                return -1;
            }
            if (bIsDoor && !aIsDoor && Math.abs(a.distance - b.distance) < 0.5) {
                return 1;
            }

            // Otherwise sort by distance
            return a.distance - b.distance;
        });
        return walls;
    }, [wallData]);

    // Find object at screen position (for lantern selection)
    const getObjectAtScreenPosition = useCallback((screenX, screenY) => {
        const effectiveZoom = zoomLevel * playerZoom;

        for (const obj of environmentalObjects) {
            if (!obj.freePosition || obj.worldX === undefined || obj.worldY === undefined) continue;

            // Convert object world position to screen position
            const screenObjX = (obj.worldX - cameraX) * effectiveZoom;
            const screenObjY = (obj.worldY - cameraY) * effectiveZoom;

            // Calculate object bounds (assuming 0.8 tile size for lanterns)
            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = 0.8 * tileSize * scale;
            const objHeight = 0.8 * tileSize * scale;

            // Check if click is within object bounds
            const left = screenObjX - objWidth / 2;
            const right = screenObjX + objWidth / 2;
            const top = screenObjY - objHeight / 2;
            const bottom = screenObjY + objHeight / 2;

            if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
                return obj;
            }
        }
        return null;
    }, [environmentalObjects, cameraX, cameraY, zoomLevel, playerZoom, gridSize]);

    // Handle text placement
    const handleTextPlacement = useCallback((coords) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (rect) {
            setTextInput({
                show: true,
                x: coords.screenX,
                y: coords.screenY,
                text: '',
                gridX: coords.gridX,
                gridY: coords.gridY
            });
        }
    }, []);

    // Handle text input submission
    const handleTextSubmit = useCallback(() => {
        if (textInput.text.trim()) {
            const pathData = {
                tool: 'text',
                points: [{ gridX: textInput.gridX, gridY: textInput.gridY }],
                text: textInput.text.trim(),
                style: {
                    fontSize: toolSettings.fontSize || 16,
                    fontFamily: toolSettings.fontFamily || 'Arial',
                    textColor: toolSettings.textColor || '#000000',
                    backgroundColor: toolSettings.backgroundColor || '#ffffff',
                    backgroundStyle: toolSettings.backgroundStyle || 'solid',
                    bold: toolSettings.bold || false,
                    italic: toolSettings.italic || false,
                    underline: toolSettings.underline || false,
                    opacity: toolSettings.opacity || 1
                },
                layer: 'overlay', // Text should be on overlay layer for visibility
                timestamp: Date.now()
            };

            const pathId = addDrawingPath(pathData);
        }
        setTextInput({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    }, [textInput, toolSettings, activeLayer, addDrawingPath]);

    // Handle text input cancel
    const handleTextCancel = useCallback(() => {
        setTextInput({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    }, []);

    // Generate preview style for text input
    const getTextPreviewStyle = useCallback(() => {
        const fontSize = toolSettings.fontSize || 16;
        const fontFamily = toolSettings.fontFamily || 'Arial';
        const textColor = toolSettings.textColor || '#000000';
        const backgroundColor = toolSettings.backgroundColor || '#ffffff';
        const backgroundStyle = toolSettings.backgroundStyle || 'solid';
        const bold = toolSettings.bold || false;
        const italic = toolSettings.italic || false;
        const underline = toolSettings.underline || false;

        // Build font string
        let fontWeight = bold ? 'bold' : 'normal';
        let fontStyle = italic ? 'italic' : 'normal';
        let textDecoration = underline ? 'underline' : 'none';

        // Base style
        let style = {
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            color: textColor,
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            lineHeight: '1.2'
        };

        // Apply background style
        if (backgroundStyle !== 'none') {
            switch (backgroundStyle) {
                case 'solid':
                    style.backgroundColor = backgroundColor;
                    style.border = '1px solid #333';
                    break;
                case 'parchment':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #d4af37';
                    style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
                    break;
                case 'scroll':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #8b7355';
                    style.borderRadius = '8px';
                    break;
                case 'stone':
                    style.backgroundColor = backgroundColor;
                    style.border = '3px solid #696969';
                    style.boxShadow = 'inset 1px 1px 2px rgba(169,169,169,0.5)';
                    break;
                case 'wood':
                    style.backgroundColor = backgroundColor;
                    style.border = '4px solid #8b4513';
                    style.backgroundImage = 'linear-gradient(90deg, transparent 0%, rgba(160,82,45,0.2) 25%, transparent 50%, rgba(160,82,45,0.2) 75%, transparent 100%)';
                    break;
                default:
                    style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    style.border = '1px solid #333';
                    break;
            }
        }

        return style;
    }, [toolSettings]);

    // Handle drawing eraser
    const handleDrawingErase = useCallback((clientX, clientY) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const eraseRadius = 15; // Increased pixel radius for easier erasing

        // Find drawings that intersect with the eraser position
        const pathsToRemove = drawingPaths.filter(path => {
            if (!path.points || path.points.length === 0) return false;

            // Check if any point in the path is within eraser radius
            return path.points.some(point => {
                let pointX, pointY;

                if (point.isWorldCoords) {
                    // New freehand drawings use world coordinates - convert to screen
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const screenPos = gridSystem.worldToScreen(point.worldX, point.worldY, viewport.width, viewport.height);
                    pointX = screenPos.x;
                    pointY = screenPos.y;
                } else if (point.isFreehand) {
                    // Legacy freehand coordinates are already screen coordinates
                    pointX = point.x;
                    pointY = point.y;
                } else if (point.gridX !== undefined) {
                    // Grid coordinates need to be converted to screen coordinates
                    const screenPos = gridToScreen(point.gridX, point.gridY);
                    pointX = screenPos.x;
                    pointY = screenPos.y;
                } else {
                    return false;
                }

                const distance = Math.sqrt(
                    Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2)
                );
                return distance <= eraseRadius;
            });
        });

        // Remove the found paths
        pathsToRemove.forEach(path => {
            removeDrawingPath(path.id);
        });
    }, [drawingPaths, removeDrawingPath, gridToScreen]);

    // Find all objects in the selected screen area
    const findObjectsInArea = useCallback((minScreenX, minScreenY, maxScreenX, maxScreenY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const effectiveZoom = zoomLevel * playerZoom;

        // Convert screen area to world coordinates
        const startWorld = gridSystem.screenToWorld(minScreenX, minScreenY, viewport.width, viewport.height);
        const endWorld = gridSystem.screenToWorld(maxScreenX, maxScreenY, viewport.width, viewport.height);

        const minWorldX = Math.min(startWorld.x, endWorld.x);
        const maxWorldX = Math.max(startWorld.x, endWorld.x);
        const minWorldY = Math.min(startWorld.y, endWorld.y);
        const maxWorldY = Math.max(startWorld.y, endWorld.y);

        const foundObjects = {
            tokens: [],
            characterTokens: [],
            items: [],
            environmentalObjects: [],
            walls: [],
            drawings: [],
            terrainTiles: []
        };

        // Check creature tokens
        tokens.forEach(token => {
            if (token.position) {
                const worldX = token.position.x || 0;
                const worldY = token.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.tokens.push(token);
                }
            }
        });

        // Check character tokens
        (characterTokens || []).forEach(token => {
            if (token.position) {
                const worldX = token.position.x || 0;
                const worldY = token.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.characterTokens.push(token);
                }
            }
        });

        // Check grid items
        gridItems.forEach(item => {
            if (item.position) {
                const worldX = item.position.x || 0;
                const worldY = item.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.items.push(item);
                }
            }
        });

        // Check environmental objects (including GM notes)
        environmentalObjects.forEach(obj => {
            let worldX, worldY;
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                worldX = obj.worldX;
                worldY = obj.worldY;
            } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                const worldPos = gridSystem.gridToWorld(obj.gridX, obj.gridY);
                worldX = worldPos.x;
                worldY = worldPos.y;
            }
            if (worldX !== undefined && worldY !== undefined) {
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.environmentalObjects.push(obj);
                }
            }
        });

        // Check walls (approximate check based on wall endpoints)
        Object.keys(wallData).forEach(wallKey => {
            const wall = wallData[wallKey];
            // Wall keys are in format "x1,y1,x2,y2"
            const coords = wallKey.split(',').map(Number);
            if (coords.length === 4) {
                const [x1, y1, x2, y2] = coords;
                const world1 = gridSystem.gridToWorld(x1, y1);
                const world2 = gridSystem.gridToWorld(x2, y2);
                // Check if either endpoint is in the area
                if ((world1.x >= minWorldX && world1.x <= maxWorldX && world1.y >= minWorldY && world1.y <= maxWorldY) ||
                    (world2.x >= minWorldX && world2.x <= maxWorldX && world2.y >= minWorldY && world2.y <= maxWorldY)) {
                    foundObjects.walls.push({ key: wallKey, wall });
                }
            }
        });

        // Check drawings (check if any point in the drawing is in the area)
        drawingPaths.forEach(path => {
            if (path.points && path.points.length > 0) {
                const hasPointInArea = path.points.some(point => {
                    let pointWorldX, pointWorldY;
                    if (point.isWorldCoords && point.worldX !== undefined && point.worldY !== undefined) {
                        pointWorldX = point.worldX;
                        pointWorldY = point.worldY;
                    } else if (point.gridX !== undefined && point.gridY !== undefined) {
                        const worldPos = gridSystem.gridToWorld(point.gridX, point.gridY);
                        pointWorldX = worldPos.x;
                        pointWorldY = worldPos.y;
                    }
                    if (pointWorldX !== undefined && pointWorldY !== undefined) {
                        return pointWorldX >= minWorldX && pointWorldX <= maxWorldX &&
                            pointWorldY >= minWorldY && pointWorldY <= maxWorldY;
                    }
                    return false;
                });
                if (hasPointInArea) {
                    foundObjects.drawings.push(path);
                }
            }
        });

        // Check terrain tiles - convert world bounds to grid coordinates and find all tiles in range
        const startGrid = gridSystem.worldToGrid(minWorldX, minWorldY);
        const endGrid = gridSystem.worldToGrid(maxWorldX, maxWorldY);
        const minGridX = Math.min(startGrid.x, endGrid.x);
        const maxGridX = Math.max(startGrid.x, endGrid.x);
        const minGridY = Math.min(startGrid.y, endGrid.y);
        const maxGridY = Math.max(startGrid.y, endGrid.y);

        // Check all grid positions in the selected area for terrain tiles
        for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
            for (let gridY = minGridY; gridY <= maxGridY; gridY++) {
                const tileKey = `${gridX},${gridY}`;
                if (terrainData[tileKey]) {
                    foundObjects.terrainTiles.push({ gridX, gridY, tileKey });
                }
            }
        }

        return foundObjects;
    }, [tokens, characterTokens, gridItems, environmentalObjects, wallData, drawingPaths, terrainData, zoomLevel, playerZoom]);

    // Handle area removal by object type
    const handleAreaRemove = useCallback((removeType) => {
        if (!selectedAreaObjects) return;

        // Check if in multiplayer and sync removals
        import('../../store/gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            const isInMultiplayer = gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected;

            if (removeType === 'all') {
                // Remove all objects entirely
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
                selectedAreaObjects.walls.forEach(({ key }) => {
                    // Remove wall by key
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null); // Setting to null should remove it
                });
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            } else if (removeType === 'tokens') {
                // Remove only creature tokens
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
            } else if (removeType === 'characterTokens') {
                // Remove only character tokens
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
            } else if (removeType === 'items') {
                // Remove only items
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
            } else if (removeType === 'environmentalObjects') {
                // Remove only environmental objects (GM Notes, etc.)
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
            } else if (removeType === 'walls') {
                // Remove only walls
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
            } else if (removeType === 'drawings') {
                // Remove only drawings
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
            } else if (removeType === 'terrainTiles') {
                // Remove only terrain tiles
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            }

            // Sync area remove to other players in multiplayer
            if (isInMultiplayer) {
                gameStore.multiplayerSocket.emit('area_remove', {
                    removeType,
                    selectedObjects: selectedAreaObjects
                });
                console.log('📤 Emitted area remove to server:', removeType);
            }

            // Reset state
            setSelectedAreaObjects(null);
        }).catch(() => {
            // If not in multiplayer, just remove locally
            if (removeType === 'all') {
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            } else if (removeType === 'tokens') {
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
            } else if (removeType === 'characterTokens') {
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
            } else if (removeType === 'items') {
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
            } else if (removeType === 'environmentalObjects') {
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
            } else if (removeType === 'walls') {
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
            } else if (removeType === 'drawings') {
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
            } else if (removeType === 'terrainTiles') {
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            }
            setSelectedAreaObjects(null);
        });
    }, [selectedAreaObjects, removeToken, removeCharacterToken, removeItemFromGrid, removeEnvironmentalObject, removeDrawingPath, setWall, clearTerrain]);

    // Handle mouse events for drawing
    const handleMouseDown = useCallback((e) => {
        if (!isEditorMode) return;

        // Ignore right-clicks (button 2) - let context menu handlers deal with them
        if (e.button === 2) {
            return;
        }

        // Check if the click is on a background image - ignore it here UNLESS we're in background manipulation mode
        // In background manipulation mode, we want to allow clicks on backgrounds for resizing/moving
        const gameStore = useGameStore.getState();
        const isBackgroundManipulationMode = gameStore.isBackgroundManipulationMode;

        if (!isBackgroundManipulationMode) {
            // Only ignore clicks on actual background layer elements, not the grid overlay
            // Background layers are rendered as divs with specific data attributes or classes
            const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            const isBackgroundImage = allElementsAtPoint.some(el => {
                if (!el) return false;

                // Check if element is within MapLibraryWindow components (map-thumbnail, map-placeholder)
                const isInMapThumbnail = el.closest('.map-thumbnail') || el.closest('.map-placeholder');
                if (isInMapThumbnail) {
                    return true;
                }

                // Check if it's a manipulation handle (resize/rotate handles for backgrounds)
                if (el.hasAttribute('data-manipulation-handle')) {
                    return true;
                }

                // Check if element is within a Resizable component (background layers use this)
                const isInResizable = el.closest('.react-resizable') || el.closest('[data-resizable="true"]');
                if (isInResizable) {
                    // Only ignore if it's actually a background layer, not the grid overlay
                    // Background layers have a data attribute or are children of background containers
                    const backgroundLayer = el.closest('[data-background-id]') || el.closest('[data-background-layer]');
                    if (backgroundLayer) {
                        return true;
                    }
                }

                // Check if it's an img element that's part of a background layer
                if (el.tagName === 'IMG') {
                    const backgroundLayer = el.closest('[data-background-id]') || el.closest('[data-background-layer]');
                    if (backgroundLayer) {
                        return true;
                    }
                }

                // Don't block clicks on the grid overlay or editor overlay
                if (el.id === 'grid-overlay' || el.closest('#grid-overlay') ||
                    el.closest('.vtt-drawing-overlay') || el.closest('.terrain-system-canvas') ||
                    el.closest('.canvas-wall-system')) {
                    return false;
                }

                return false;
            });

            if (isBackgroundImage) {
                console.log('ProfessionalVTTEditor: ignoring click on background image (not in manipulation mode)');
                return; // Let the background image's own event handler deal with it
            }
        }

        // For select tool, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            // Don't prevent default or stop propagation - let ObjectSystem handle it
            return;
        }

        // Handle tools that don't need drawing state
        switch (selectedTool) {
            case 'text':
                // Handle text placement
                const textCoords = screenToGrid(e.clientX, e.clientY);
                if (textCoords) {
                    handleTextPlacement(textCoords);
                }
                return;
            case 'eraser':
                // Handle drawing eraser
                handleDrawingErase(e.clientX, e.clientY);
                setIsDrawing(true); // Enable for continuous erasing
                return;
            case 'area_remove':
                // Start area selection for removal
                const areaRemoveRect = overlayRef.current?.getBoundingClientRect();
                if (areaRemoveRect) {
                    const screenX = e.clientX - areaRemoveRect.left;
                    const screenY = e.clientY - areaRemoveRect.top;
                    setSelectionRect({ startX: screenX, startY: screenY, endX: screenX, endY: screenY });
                    setIsDrawing(true);
                }
                return;
            case 'object_place':
                // Check if we're placing a connection (via settings) or regular object
                if (toolSettings?.selectedPlacementType === 'connection') {
                    // Place connection/portal - NO DRAWING STATE
                    const portalCoords = screenToGrid(e.clientX, e.clientY);
                    if (portalCoords) {
                        // Create connection as dndElement
                        const connectionData = {
                            type: 'connection',
                            position: { x: portalCoords.gridX, y: portalCoords.gridY },
                            properties: {
                                portalName: 'New Connection',
                                destinationMapId: null,
                                destinationPosition: null,
                                isActive: true,
                                isHidden: false,
                                color: '#4a90e2',
                                description: ''
                            }
                        };

                        addDndElement(connectionData);
                        console.log('◉ Connection placed at:', portalCoords);
                    }
                    return;
                }

                // Place object - NO DRAWING STATE
                const objCoords = screenToGrid(e.clientX, e.clientY);

                // Auto-select GM Notes if no object type is selected (fallback)
                let selectedObjectType = toolSettings.selectedObjectType;
                if (!selectedObjectType) {
                    const availableObjects = Object.keys(PROFESSIONAL_OBJECTS);
                    if (availableObjects.length === 1) {
                        selectedObjectType = availableObjects[0];
                        setToolSettings({
                            ...toolSettings,
                            selectedObjectType: selectedObjectType
                        });
                        console.log('🎯 Auto-selected object type as fallback:', selectedObjectType);
                    }
                }

                if (objCoords && selectedObjectType) {
                    const objectType = selectedObjectType;
                    const objectDef = PROFESSIONAL_OBJECTS[objectType];

                    console.log('🎯 Placing object:', {
                        objectType,
                        objectDef,
                        objCoords,
                        toolSettings
                    });

                    const objectData = {
                        gridX: objCoords.gridX,
                        gridY: objCoords.gridY,
                        type: objectType,
                        rotation: toolSettings.objectRotation || 0,
                        scale: toolSettings.objectScale || 1,
                        layer: 'objects'
                    };

                    // Add special properties for objects that need them
                    if (objectDef?.freePosition) {
                        // For free-positioned objects like GM Notes, use exact click coordinates
                        objectData.worldX = objCoords.worldX;
                        objectData.worldY = objCoords.worldY;
                        objectData.freePosition = true;
                        console.log('🎯 Free positioning enabled for:', objectType, {
                            worldX: objCoords.worldX,
                            worldY: objCoords.worldY
                        });
                    }

                    // Initialize GM Notes data
                    if (objectType === 'gmNotes') {
                        objectData.gmNotesData = {
                            title: '',
                            description: '',
                            notes: '', // Keep for backward compatibility
                            structuredNotes: {
                                readAloud: '',
                                sensoryDetails: { smell: '', sound: '', touch: '', additional: '' },
                                dynamicState: '',
                                keyFeatures: '',
                                gmHidden: { clues: '', triggers: '', consequences: '' }
                            },
                            handouts: [],
                            items: [],
                            creatures: []
                        };
                        console.log('🎯 GM Notes placement data:', {
                            gridX: objCoords.gridX,
                            gridY: objCoords.gridY,
                            worldX: objCoords.worldX,
                            worldY: objCoords.worldY,
                            freePosition: objectData.freePosition,
                            objectData
                        });
                    }

                    addEnvironmentalObject(objectData);
                }
                return;
            case 'object_select':
                // Select object - NO DRAWING STATE
                const selectCoords = screenToGrid(e.clientX, e.clientY);
                if (selectCoords) {
                    const objectAtPosition = getObjectAtPosition(selectCoords.gridX, selectCoords.gridY);
                    if (objectAtPosition) {
                        selectEnvironmentalObject(objectAtPosition.id);
                    }
                }
                return;
            case 'object_delete':
                // Delete object - NO DRAWING STATE
                const deleteCoords = screenToGrid(e.clientX, e.clientY);
                if (deleteCoords) {
                    const objectToDelete = getObjectAtPosition(deleteCoords.gridX, deleteCoords.gridY);
                    if (objectToDelete) {
                        removeEnvironmentalObject(objectToDelete.id);
                    }
                }
                return;
            case 'door_place':
                // Don't place doors if we're currently dragging or have a selection active
                if (isDraggingWall || isObjectLocked || selectedWindow || selectedWallKey) {
                    return;
                }

                // Place door on existing wall - find closest point on nearest wall (similar to windows)
                if (toolSettings.selectedWallType) {
                    const doorCoords = screenToGrid(e.clientX, e.clientY);
                    if (doorCoords && doorCoords.worldX !== undefined && doorCoords.worldY !== undefined) {
                        // Use precise world coordinates and convert to grid coordinates (not snapped)
                        // This allows doors to be placed anywhere along the wall, not just on grid lines
                        const clickX = (doorCoords.worldX - gridOffsetX) / gridSize;
                        const clickY = (doorCoords.worldY - gridOffsetY) / gridSize;

                        // Find the nearest wall and closest point on it
                        let nearestWall = null;
                        let nearestDist = Infinity;
                        let closestPointX = 0;
                        let closestPointY = 0;

                        for (const [wallKey, wall] of Object.entries(wallData)) {
                            // Get the wall type
                            const wallType = typeof wall === 'string' ? wall : wall?.type;
                            // Skip existing doors - don't place doors on doors
                            if (wallType && wallType.includes('door')) {
                                continue;
                            }

                            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

                            // Calculate closest point on wall segment to click position
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const wallLength = Math.sqrt(dx * dx + dy * dy);

                            if (wallLength === 0) continue; // Skip zero-length walls

                            // Project click point onto wall line, clamp to segment
                            const t = Math.max(0, Math.min(1,
                                ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                            ));

                            // Closest point on wall - use exact position without snapping
                            const projX = x1 + t * dx;
                            const projY = y1 + t * dy;

                            // Distance from click to closest point on wall
                            const dist = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                            if (dist < nearestDist && dist < 1.5) { // Within 1.5 tiles of wall
                                nearestDist = dist;
                                nearestWall = { key: wallKey, x1, y1, x2, y2 };
                                // Use exact projected point - no snapping to grid
                                closestPointX = projX;
                                closestPointY = projY;
                            }
                        }

                        if (nearestWall) {
                            // Doors should be placed ALONG the wall (replacing a section), not perpendicular
                            // Calculate wall direction
                            const dx = nearestWall.x2 - nearestWall.x1;
                            const dy = nearestWall.y2 - nearestWall.y1;
                            const wallLength = Math.sqrt(dx * dx + dy * dy);

                            // Normalize direction vector
                            const dirX = dx / wallLength;
                            const dirY = dy / wallLength;

                            // Door length (1 tile)
                            const doorLength = 1.0;

                            // Create door segment along the wall at the projected point
                            // Door extends half a tile in each direction along the wall
                            const halfLength = doorLength / 2;
                            const startX = closestPointX - dirX * halfLength;
                            const startY = closestPointY - dirY * halfLength;
                            const endX = closestPointX + dirX * halfLength;
                            const endY = closestPointY + dirY * halfLength;

                            // Place door along the wall at the exact position
                            setWall(startX, startY, endX, endY, toolSettings.selectedWallType);
                        }
                    }
                }
                return;

            case 'window_place':
                // Don't place windows if we're currently dragging or have a selection active
                if (isDraggingWall || isObjectLocked || selectedWindow || selectedWallKey) {
                    return;
                }

                // Place window overlay on existing wall - find closest point on nearest wall
                if (toolSettings.selectedWallType) {
                    const windowCoords = screenToGrid(e.clientX, e.clientY);
                    if (windowCoords && windowCoords.worldX !== undefined && windowCoords.worldY !== undefined) {
                        // Use precise world coordinates and convert to grid coordinates (not snapped)
                        // This allows windows to be placed anywhere along the wall, not just on grid lines
                        const clickX = (windowCoords.worldX - gridOffsetX) / gridSize;
                        const clickY = (windowCoords.worldY - gridOffsetY) / gridSize;

                        // Find the nearest wall and closest point on it
                        let nearestWall = null;
                        let nearestDist = Infinity;
                        let closestPointX = 0;
                        let closestPointY = 0;

                        for (const [wallKey, wall] of Object.entries(wallData)) {
                            // Get the wall type
                            const wallType = typeof wall === 'string' ? wall : wall?.type;
                            // Skip doors - don't place windows on doors
                            if (wallType && wallType.includes('door')) {
                                continue;
                            }

                            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

                            // Calculate closest point on wall segment to click position
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const wallLength = Math.sqrt(dx * dx + dy * dy);

                            if (wallLength === 0) continue; // Skip zero-length walls

                            // Project click point onto wall line, clamp to segment
                            const t = Math.max(0, Math.min(1,
                                ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                            ));

                            // Closest point on wall - use exact position without snapping
                            const projX = x1 + t * dx;
                            const projY = y1 + t * dy;

                            // Distance from click to closest point on wall
                            const dist = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                            if (dist < nearestDist && dist < 1.5) { // Within 1.5 tiles of wall
                                nearestDist = dist;
                                nearestWall = { key: wallKey, x1, y1, x2, y2 };
                                // Use exact projected point - no snapping to grid
                                closestPointX = projX;
                                closestPointY = projY;
                            }
                        }

                        if (nearestWall) {
                            // Place window at the exact closest point on the wall
                            setWindowOverlay(
                                closestPointX,
                                closestPointY,
                                toolSettings.selectedWallType,
                                nearestWall.key // Pass wall key for reference
                            );
                        }
                    }
                }
                return;

            case 'wall_erase':
                // Erase wall or window at clicked position - NO DRAWING STATE
                const eraseWallCoords = screenToGrid(e.clientX, e.clientY);
                if (eraseWallCoords) {
                    const gx = eraseWallCoords.gridX;
                    const gy = eraseWallCoords.gridY;
                    const clickX = gx + 0.5;
                    const clickY = gy + 0.5;

                    // First check for windows near this position
                    let windowRemoved = false;
                    if (windowOverlays) {
                        // Find nearest window within range
                        let nearestWindowKey = null;
                        let nearestDist = 1.5; // Max distance to detect

                        for (const [windowKey, windowData] of Object.entries(windowOverlays)) {
                            const wx = windowData.gridX;
                            const wy = windowData.gridY;
                            const dist = Math.sqrt(Math.pow(clickX - wx, 2) + Math.pow(clickY - wy, 2));
                            if (dist < nearestDist) {
                                nearestDist = dist;
                                nearestWindowKey = windowKey;
                            }
                        }

                        if (nearestWindowKey) {
                            const windowData = windowOverlays[nearestWindowKey];
                            removeWindowOverlay(windowData.gridX, windowData.gridY);
                            windowRemoved = true;
                        }
                    }

                    // If no window removed, try removing walls
                    if (!windowRemoved) {
                        const wallsNear = findWallsNearPosition(clickX, clickY);
                        if (wallsNear.length > 0) {
                            wallsNear.forEach(wall => {
                                removeWall(wall.x1, wall.y1, wall.x2, wall.y2);
                            });
                        }
                    }
                }
                return;

            case 'wall_select': {
                const wallSelectCoords = screenToGrid(e.clientX, e.clientY);
                if (!wallSelectCoords) return;

                const selGx = wallSelectCoords.gridX;
                const selGy = wallSelectCoords.gridY;
                // Use precise coordinates for window selection (not snapped to tile centers)
                const selClickX = wallSelectCoords.worldX !== undefined && wallSelectCoords.worldY !== undefined
                    ? (wallSelectCoords.worldX - gridOffsetX) / gridSize
                    : selGx + 0.5;
                const selClickY = wallSelectCoords.worldX !== undefined && wallSelectCoords.worldY !== undefined
                    ? (wallSelectCoords.worldY - gridOffsetY) / gridSize
                    : selGy + 0.5;

                // First, try to find objects at click position (check for new selection)
                let foundWindow = null;
                let foundWall = null;

                // Check windows first (smaller targets)
                if (windowOverlays) {
                    let nearestDist = 1.5;
                    for (const [windowKey, windowData] of Object.entries(windowOverlays)) {
                        const wx = windowData.gridX;
                        const wy = windowData.gridY;
                        const dist = Math.sqrt(Math.pow(selClickX - wx, 2) + Math.pow(selClickY - wy, 2));
                        if (dist < nearestDist) {
                            nearestDist = dist;
                            foundWindow = {
                                key: windowKey,
                                gridX: wx,
                                gridY: wy,
                                data: windowData
                            };
                        }
                    }
                }

                // Check walls/doors if no window found
                if (!foundWindow) {
                    const wallsNear = findWallsNearPosition(selClickX, selClickY);
                    if (wallsNear.length > 0) {
                        foundWall = wallsNear[0];
                    }
                }

                // If clicking on a different object, change selection
                const clickedDifferentObject =
                    (foundWindow && (!selectedWindow || foundWindow.key !== selectedWindow.key)) ||
                    (foundWall && (!selectedWallKey || foundWall.key !== selectedWallKey));

                if (clickedDifferentObject) {
                    // Cancel any pending window/door drag RAF updates
                    if (windowDragRafRef.current !== null) {
                        cancelAnimationFrame(windowDragRafRef.current);
                        windowDragRafRef.current = null;
                    }
                    if (doorDragRafRef.current !== null) {
                        cancelAnimationFrame(doorDragRafRef.current);
                        doorDragRafRef.current = null;
                    }
                    pendingWindowUpdateRef.current = null;
                    pendingDoorUpdateRef.current = null;
                    setIsDraggingWall(false);
                    setIsDrawing(false);

                    if (foundWindow) {
                        // Select new window
                        dragWindowRef.current = {
                            gridX: foundWindow.gridX,
                            gridY: foundWindow.gridY,
                            data: foundWindow.data
                        };
                        dragWallRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWindow(foundWindow);
                        setSelectedWindowKey(foundWindow.key);
                        setSelectedWallKey(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else if (foundWall) {
                        // Select new wall
                        const [x1, y1, x2, y2] = foundWall.key.split(',').map(Number);
                        dragWallRef.current = { x1, y1, x2, y2, key: foundWall.key };
                        dragWindowRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWallKey(foundWall.key);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    }
                }

                // If clicking on the same object or empty space while locked, start dragging
                if (isObjectLocked && (selectedWallKey || selectedWindow)) {
                    // Check if clicking on the same object
                    const clickedSameObject =
                        (foundWindow && selectedWindow && foundWindow.key === selectedWindow.key) ||
                        (foundWall && selectedWallKey && foundWall.key === selectedWallKey) ||
                        (!foundWindow && !foundWall); // Empty space

                    if (clickedSameObject) {
                        // Initialize drag refs from current state
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };
                        if (selectedWindow) {
                            dragWindowRef.current = {
                                gridX: selectedWindow.gridX,
                                gridY: selectedWindow.gridY,
                                data: selectedWindow.data
                            };
                            dragWallRef.current = null;
                        } else if (selectedWallKey) {
                            const [x1, y1, x2, y2] = selectedWallKey.split(',').map(Number);
                            dragWallRef.current = { x1, y1, x2, y2, key: selectedWallKey };
                            dragWindowRef.current = null;
                        }
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    }
                }

                // If not locked, allow selection
                if (!isObjectLocked) {
                    if (foundWindow) {
                        // Cancel any pending window/door drag RAF updates
                        if (windowDragRafRef.current !== null) {
                            cancelAnimationFrame(windowDragRafRef.current);
                            windowDragRafRef.current = null;
                        }
                        if (doorDragRafRef.current !== null) {
                            cancelAnimationFrame(doorDragRafRef.current);
                            doorDragRafRef.current = null;
                        }
                        pendingWindowUpdateRef.current = null;
                        pendingDoorUpdateRef.current = null;

                        dragWindowRef.current = {
                            gridX: foundWindow.gridX,
                            gridY: foundWindow.gridY,
                            data: foundWindow.data
                        };
                        dragWallRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWindow(foundWindow);
                        setSelectedWindowKey(foundWindow.key);
                        setSelectedWallKey(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else if (foundWall) {
                        const [x1, y1, x2, y2] = foundWall.key.split(',').map(Number);
                        dragWallRef.current = { x1, y1, x2, y2, key: foundWall.key };
                        dragWindowRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWallKey(foundWall.key);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else {
                        // Clicked on empty space - deselect
                        setSelectedWallKey(null);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        dragWindowRef.current = null;
                        dragWallRef.current = null;
                        lastDragPosRef.current = null;
                    }
                }
                return;
            }
            case 'fog_clear_all':
                // Clear all fog - NO DRAWING STATE
                clearAllFog();
                return;
            case 'fog_cover_map':
                // Cover entire map with fog - NO DRAWING STATE
                coverEntireMapWithFog(gridSize);
                return;
        }

        // Handle fog erasing - paint immediately on click (not waiting for mouse release)
        if (selectedTool === 'fog_erase') {
            const fogCoords = screenToGrid(e.clientX, e.clientY);
            if (fogCoords) {
                removeFogAtPosition(fogCoords.worldX, fogCoords.worldY, toolSettings.brushSize || 1, gridSize);
            }
            // Set drawing state for continuous painting while dragging
            setIsDrawing(true);
            setIsCurrentlyDrawing(true);
            setCurrentDrawingTool(selectedTool);
            if (typeof window !== 'undefined') {
                window._isDrawingFog = true;
            }
            return;
        }

        // Set drawing state for tools that need it
        setIsDrawing(true);
        setIsCurrentlyDrawing(true);
        setCurrentDrawingTool(selectedTool);

        // Handle different drawing tool types
        switch (selectedTool) {
            case 'freehand':
                // Start freehand drawing with world coordinates so it sticks to the grid
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenX = e.clientX - rect.left;
                    const screenY = e.clientY - rect.top;

                    // Convert screen coordinates to world coordinates
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const worldCoords = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);

                    const worldPoint = {
                        worldX: worldCoords.x,
                        worldY: worldCoords.y,
                        isWorldCoords: true // Flag to distinguish from grid coords
                    };
                    setCurrentPath([worldPoint]);
                    setCurrentDrawingPath([worldPoint]);
                }
                return; // Don't process grid-based actions for freehand
            case 'line':
            case 'rectangle':
            case 'circle':
                // Start shape drawing with grid coordinates
                const shapeCoords = screenToGrid(e.clientX, e.clientY);
                if (shapeCoords) {
                    setCurrentPath([shapeCoords]);
                    setCurrentDrawingPath([shapeCoords]);
                    setIsDrawing(true);
                    setIsCurrentlyDrawing(true);
                    setCurrentDrawingTool(selectedTool);
                }
                return;
            case 'polygon':
                // Handle polygon point addition
                const polyCoords = screenToGrid(e.clientX, e.clientY);
                if (polyCoords) {
                    if (isDrawing && currentPath.length > 0) {
                        // Check if clicking near the first point to complete polygon
                        const firstPoint = currentPath[0];
                        const distance = Math.sqrt(
                            Math.pow(polyCoords.gridX - firstPoint.gridX, 2) +
                            Math.pow(polyCoords.gridY - firstPoint.gridY, 2)
                        );

                        if (distance < 1.0 && currentPath.length >= 3) {
                            // Complete the polygon by finalizing it
                            const pathData = {
                                tool: 'polygon',
                                points: currentPath,
                                style: {
                                    strokeWidth: toolSettings.strokeWidth || 2,
                                    strokeColor: toolSettings.strokeColor || '#000000',
                                    fillColor: toolSettings.fillColor || 'transparent',
                                    opacity: toolSettings.opacity || 1
                                },
                                layer: 'drawings',
                                timestamp: Date.now()
                            };

                            addDrawingPath(pathData);

                            // Reset drawing state
                            setIsDrawing(false);
                            setCurrentPath([]);
                            clearCurrentDrawing();
                            setIsCurrentlyDrawing(false);
                            setCurrentDrawingTool('');
                        } else {
                            // Add point to existing polygon
                            setCurrentPath(prev => [...prev, polyCoords]);
                            setCurrentDrawingPath(prev => [...prev, polyCoords]);
                        }
                    } else {
                        // Start new polygon
                        setCurrentPath([polyCoords]);
                        setCurrentDrawingPath([polyCoords]);
                        setIsDrawing(true);
                        setIsCurrentlyDrawing(true);
                        setCurrentDrawingTool('polygon');
                    }
                }
                return;
        }

        // For grid-based tools, use grid coordinates
        const coords = screenToGrid(e.clientX, e.clientY);
        if (!coords) return;
        setCurrentPath([coords]);

        // Handle grid-based tool actions
        switch (selectedTool) {
             case 'terrain_brush':
                 // Apply terrain with brush
                 // Use selectedTerrainType or default to 'grass' if not set
                 const terrainType = toolSettings.selectedTerrainType || 'grass';
                 // Convert brushSize to number if it's a string (legacy support)
                 const brushSize = typeof toolSettings.brushSize === 'number'
                     ? toolSettings.brushSize
                     : (typeof toolSettings.brushSize === 'string' && toolSettings.brushSize !== 'medium'
                         ? parseInt(toolSettings.brushSize) || 1
                         : 1);

                // Track last position for line interpolation
                lastTerrainBrushPosRef.current = coords;

                paintTerrainBrush(
                    coords.gridX,
                    coords.gridY,
                    terrainType,
                    brushSize,
                    getExplicitCurrentMapId() // Pass current map ID explicitly
                );
                break;
            case 'terrain_erase':
                // Erase terrain with brush size
                // Track last position for line interpolation
                lastTerrainBrushPosRef.current = coords;
                removeTerrainAtPosition(coords.gridX, coords.gridY, toolSettings.brushSize || 1);
                break;
            case 'wall_draw':
                // Handle different wall drawing modes
                if (toolSettings.selectedWallType) {
                    const wallMode = toolSettings.wallMode || 'continuous';
                    // Start drawing for both continuous and rectangle modes
                    setCurrentPath([coords]);
                    setCurrentDrawingPath([coords]);
                }
                break;
            // Fog painting is handled above before this switch statement
            default:
                break;
        }
    }, [isEditorMode, selectedTool, screenToGrid, toolSettings, paintTerrainBrush, removeTerrainAtPosition, paintTerrainLine, removeTerrainLine, removeFogAtPosition, gridSize, getObjectAtPosition, selectEnvironmentalObject, removeEnvironmentalObject, addEnvironmentalObject, clearAllFog, coverEntireMapWithFog, setIsDrawing, setIsCurrentlyDrawing, setCurrentDrawingTool, setCurrentPath, setCurrentDrawingPath]);

    const handleMouseMove = useCallback((e) => {
        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            return;
        }

        // Update selection rectangle for area_remove tool
        if (selectedTool === 'area_remove' && selectionRect && isDrawing) {
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                const screenX = e.clientX - rect.left;
                const screenY = e.clientY - rect.top;
                setSelectionRect(prev => ({
                    ...prev,
                    endX: screenX,
                    endY: screenY
                }));
            }
            return;
        }

        // Update hover preview for brush tools and eraser (throttled via RAF)
        if (isEditorMode && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_erase')) {
            const coords = screenToGrid(e.clientX, e.clientY);
            const rect = overlayRef.current?.getBoundingClientRect();
            if (coords && rect) {
                const screenX = e.clientX - rect.left;
                const screenY = e.clientY - rect.top;

                const brushSize = Number.isFinite(toolSettings.brushSize) ? toolSettings.brushSize : 1;

                // Update ref immediately for instant calculation, but throttle React state updates
                hoverPreviewRef.current = {
                    show: true,
                    gridX: coords.gridX,
                    gridY: coords.gridY,
                    brushSize: brushSize,
                    screenX: (selectedTool === 'fog_erase') ? screenX : undefined,
                    screenY: (selectedTool === 'fog_erase') ? screenY : undefined
                };

                // Throttle React state update via RAF to avoid lag
                throttledUpdateHoverPreview();
            }
        } else if (isEditorMode && selectedTool === 'eraser') {
            // Show eraser cursor
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                hoverPreviewRef.current = {
                    show: true,
                    screenX: e.clientX - rect.left,
                    screenY: e.clientY - rect.top,
                    isEraser: true,
                    eraserRadius: 15
                };

                // Throttle React state update via RAF
                throttledUpdateHoverPreview();
            }
        } else {
            // Hide hover preview - update immediately (no need to throttle hiding)
            hoverPreviewRef.current = { show: false, gridX: 0, gridY: 0, brushSize: 1 };
            if (hoverPreviewRafId.current !== null) {
                cancelAnimationFrame(hoverPreviewRafId.current);
                hoverPreviewRafId.current = null;
            }
            setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
        }

        if (!isDrawing) return;

        // Handle continuous painting for terrain tools
        switch (selectedTool) {
            case 'freehand':
                // Continue freehand drawing with world coordinates
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenX = e.clientX - rect.left;
                    const screenY = e.clientY - rect.top;

                    // Convert screen coordinates to world coordinates
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const worldCoords = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);

                    const worldPoint = {
                        worldX: worldCoords.x,
                        worldY: worldCoords.y,
                        isWorldCoords: true
                    };

                    // Add point and immediately update drawing path for real-time feedback
                    setCurrentPath(prev => {
                        const newPath = [...prev, worldPoint];
                        // Also update the drawing path immediately
                        setCurrentDrawingPath(newPath);
                        return newPath;
                    });
                }
                break;
            case 'terrain_brush':
                const terrainCoords = screenToGrid(e.clientX, e.clientY);
                if (terrainCoords) {
                    const terrainType = toolSettings.selectedTerrainType || 'grass';
                    const brushSize = typeof toolSettings.brushSize === 'number'
                        ? toolSettings.brushSize
                        : (typeof toolSettings.brushSize === 'string' && toolSettings.brushSize !== 'medium'
                            ? parseInt(toolSettings.brushSize) || 1
                            : 1);

                    // Use optimized line interpolation from store
                    if (lastTerrainBrushPosRef.current) {
                        paintTerrainLine(
                            lastTerrainBrushPosRef.current.gridX,
                            lastTerrainBrushPosRef.current.gridY,
                            terrainCoords.gridX,
                            terrainCoords.gridY,
                            terrainType,
                            brushSize
                        );
                    } else {
                        paintTerrainBrush(
                            terrainCoords.gridX,
                            terrainCoords.gridY,
                            terrainType,
                            brushSize
                        );
                    }
                    lastTerrainBrushPosRef.current = terrainCoords;
                }
                break;
            case 'terrain_erase':
                const eraseCoords = screenToGrid(e.clientX, e.clientY);
                if (eraseCoords) {
                    const brushSize = toolSettings.brushSize || 1;

                    // Use optimized line interpolation from store
                    if (lastTerrainBrushPosRef.current) {
                        removeTerrainLine(
                            lastTerrainBrushPosRef.current.gridX,
                            lastTerrainBrushPosRef.current.gridY,
                            eraseCoords.gridX,
                            eraseCoords.gridY,
                            brushSize
                        );
                    } else {
                        removeTerrainAtPosition(eraseCoords.gridX, eraseCoords.gridY, brushSize);
                    }
                    lastTerrainBrushPosRef.current = eraseCoords;
                }
                break;
            case 'eraser':
                // Handle drawing eraser - continuously erase while dragging
                handleDrawingErase(e.clientX, e.clientY);
                break;

            case 'fog_erase':
                // Continue fog erasing - smooth brush-based erasing
                // PERFORMANCE: Use RAF-only throttling for maximum smoothness
                const fogEraseCoords = screenToGrid(e.clientX, e.clientY);
                if (fogEraseCoords) {
                    // Update drawing state for real-time effects
                    if (!isCurrentlyDrawing) {
                        setIsCurrentlyDrawing(true);
                        setCurrentDrawingTool('fog_erase');
                    }

                    // Store the latest erase call
                    pendingFogPaintRef.current = {
                        worldX: fogEraseCoords.worldX,
                        worldY: fogEraseCoords.worldY,
                        brushSize: toolSettings.brushSize || 1,
                        isErase: true
                    };

                    // Schedule erase using RAF for smooth 60fps+ erasing
                    if (fogPaintThrottleRef.current === null) {
                        fogPaintThrottleRef.current = requestAnimationFrame(() => {
                            if (pendingFogPaintRef.current) {
                                if (pendingFogPaintRef.current.isErase) {
                                    removeFogAtPosition(
                                        pendingFogPaintRef.current.worldX,
                                        pendingFogPaintRef.current.worldY,
                                        pendingFogPaintRef.current.brushSize,
                                        gridSize
                                    );
                                }
                                pendingFogPaintRef.current = null;
                            }
                            fogPaintThrottleRef.current = null;
                        });
                    }
                }
                break;
            case 'wall_draw':
                // Continue wall drawing - update current path for real-time preview
                const wallCoords = screenToGrid(e.clientX, e.clientY);
                if (wallCoords && currentPath.length > 0) {
                    const wallMode = toolSettings.wallMode || 'continuous';
                    if (wallMode === 'rectangle') {
                        // For rectangle mode, show rectangle preview
                        const newPath = [currentPath[0], wallCoords];
                        setCurrentPath(newPath);
                        setCurrentDrawingPath(newPath);
                    } else {
                        // For continuous mode, show line from start to current position
                        const newPath = [currentPath[0], wallCoords];
                        setCurrentPath(newPath);
                        setCurrentDrawingPath(newPath);
                    }
                }
                break;
            case 'wall_select':
                // Handle wall or window dragging using refs to avoid stale state
                if (isDraggingWall && lastDragPosRef.current && isDrawing) {
                    const moveCoords = screenToGrid(e.clientX, e.clientY);
                    if (moveCoords) {
                        const deltaX = moveCoords.gridX - lastDragPosRef.current.gridX;
                        const deltaY = moveCoords.gridY - lastDragPosRef.current.gridY;

                        if (deltaX !== 0 || deltaY !== 0) {
                            if (dragWindowRef.current) {
                                // Store latest mouse position for smooth dragging
                                pendingWindowUpdateRef.current = {
                                    moveCoords,
                                    gridOffsetX,
                                    gridOffsetY,
                                    gridSize,
                                    wallData,
                                    windowOverlays,
                                    findWallsNearPosition,
                                    removeWindowOverlay,
                                    setWindowOverlay,
                                    setSelectedWindow,
                                    setSelectedWindowKey,
                                    setWallDragStart
                                };

                                // Chain RAF updates for smooth dragging - always use latest mouse position
                                if (windowDragRafRef.current === null) {
                                    const updateWindowPosition = () => {
                                        const update = pendingWindowUpdateRef.current;
                                        if (!update || !dragWindowRef.current) {
                                            windowDragRafRef.current = null;
                                            return;
                                        }

                                        const { moveCoords, gridOffsetX, gridOffsetY, gridSize, wallData, windowOverlays, findWallsNearPosition, removeWindowOverlay, setWindowOverlay, setSelectedWindow, setSelectedWindowKey, setWallDragStart } = update;

                                        // Move window along walls - can snap to different walls when dragged near them
                                        const oldX = dragWindowRef.current.gridX;
                                        const oldY = dragWindowRef.current.gridY;
                                        let currentWallKey = dragWindowRef.current.data.wallKey;

                                        // Convert mouse position to precise grid coordinates (not snapped)
                                        const clickX = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                            ? (moveCoords.worldX - gridOffsetX) / gridSize
                                            : moveCoords.gridX + 0.5;
                                        const clickY = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                            ? (moveCoords.worldY - gridOffsetY) / gridSize
                                            : moveCoords.gridY + 0.5;

                                        // Skip if position hasn't changed (very small threshold for smoothness)
                                        const distFromLast = Math.sqrt(Math.pow(clickX - oldX, 2) + Math.pow(clickY - oldY, 2));
                                        if (distFromLast < 0.001) {
                                            // Position hasn't changed, just update drag position and continue
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Optimize: Only search for new walls if we're far from current wall or it doesn't exist
                                        let validWalls = [];
                                        let shouldSearchForWalls = true;

                                        if (currentWallKey && wallData[currentWallKey]) {
                                            const currentWall = wallData[currentWallKey];
                                            const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                            if (!(wallType && wallType.includes('door'))) {
                                                const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                                const dx = x2 - x1;
                                                const dy = y2 - y1;
                                                const wallLength = Math.sqrt(dx * dx + dy * dy);

                                                if (wallLength > 0) {
                                                    const t = Math.max(0, Math.min(1,
                                                        ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                    ));
                                                    const projX = x1 + t * dx;
                                                    const projY = y1 + t * dy;
                                                    const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                                                    // If we're close to current wall, use it directly without searching
                                                    // Use a larger threshold (1.5 tiles) to avoid unnecessary searches during smooth dragging
                                                    if (currentWallDistance <= 1.5) {
                                                        shouldSearchForWalls = false;
                                                        validWalls.push({
                                                            key: currentWallKey,
                                                            data: currentWall,
                                                            x1, y1, x2, y2,
                                                            distance: currentWallDistance
                                                        });
                                                    }
                                                }
                                            }
                                        }

                                        // Only search for walls if needed
                                        if (shouldSearchForWalls) {
                                            const nearbyWalls = findWallsNearPosition(clickX, clickY);
                                            validWalls = nearbyWalls.filter(wall => {
                                                const wallType = typeof wall.data === 'string' ? wall.data : wall.data?.type;
                                                return !(wallType && wallType.includes('door'));
                                            });

                                            // Add current wall if it's within reasonable distance
                                            if (currentWallKey && wallData[currentWallKey] && !validWalls.find(w => w.key === currentWallKey)) {
                                                const currentWall = wallData[currentWallKey];
                                                const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                                if (!(wallType && wallType.includes('door'))) {
                                                    const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                                    const dx = x2 - x1;
                                                    const dy = y2 - y1;
                                                    const wallLength = Math.sqrt(dx * dx + dy * dy);

                                                    if (wallLength > 0) {
                                                        const t = Math.max(0, Math.min(1,
                                                            ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                        ));
                                                        const projX = x1 + t * dx;
                                                        const projY = y1 + t * dy;
                                                        const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                                                        if (currentWallDistance <= 2.0) {
                                                            validWalls.push({
                                                                key: currentWallKey,
                                                                data: currentWall,
                                                                x1, y1, x2, y2,
                                                                distance: currentWallDistance
                                                            });
                                                            validWalls.sort((a, b) => a.distance - b.distance);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (validWalls.length === 0) {
                                            // No valid walls nearby, keep window on current wall if it exists
                                            const currentWall = wallData[currentWallKey];
                                            if (!currentWall) {
                                                // Current wall no longer exists, stop dragging
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                windowDragRafRef.current = null;
                                                return;
                                            }
                                            // Continue with current wall - add it to validWalls for projection
                                            const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                            const dx = x2 - x1;
                                            const dy = y2 - y1;
                                            const wallLength = Math.sqrt(dx * dx + dy * dy);
                                            if (wallLength > 0) {
                                                const t = Math.max(0, Math.min(1,
                                                    ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                ));
                                                const projX = x1 + t * dx;
                                                const projY = y1 + t * dy;
                                                const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));
                                                validWalls.push({
                                                    key: currentWallKey,
                                                    data: currentWall,
                                                    x1, y1, x2, y2,
                                                    distance: currentWallDistance
                                                });
                                            }
                                        } else {
                                            // Check if we should switch to a different wall
                                            const currentWallIndex = validWalls.findIndex(w => w.key === currentWallKey);
                                            const closestWall = validWalls[0];

                                            // Switch to a different wall if:
                                            // 1. Current wall is not in the nearby list, OR
                                            // 2. A different wall is significantly closer (more than 0.2 tiles closer)
                                            if (currentWallIndex === -1 ||
                                                (closestWall.key !== currentWallKey &&
                                                    closestWall.distance < (validWalls[currentWallIndex]?.distance || Infinity) - 0.2)) {
                                                currentWallKey = closestWall.key;
                                                dragWindowRef.current.data = {
                                                    ...dragWindowRef.current.data,
                                                    wallKey: currentWallKey
                                                };
                                            }
                                        }

                                        // Get the wall we're using (either current or newly selected)
                                        const wall = wallData[currentWallKey];
                                        if (!wall) {
                                            // Wall no longer exists, stop dragging
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            windowDragRafRef.current = null;
                                            return;
                                        }

                                        // Parse wall coordinates
                                        const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);

                                        // Calculate closest point on wall segment to mouse position
                                        const dx = x2 - x1;
                                        const dy = y2 - y1;
                                        const wallLength = Math.sqrt(dx * dx + dy * dy);

                                        if (wallLength === 0) {
                                            // Zero-length wall, can't move - but continue checking
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Project mouse point onto wall line, clamp to segment
                                        const t = Math.max(0, Math.min(1,
                                            ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                        ));

                                        // Closest point on wall - use exact position
                                        const newX = x1 + t * dx;
                                        const newY = y1 + t * dy;
                                        const newKey = `${newX.toFixed(3)},${newY.toFixed(3)}`;
                                        const oldKey = `${oldX.toFixed(3)},${oldY.toFixed(3)}`;

                                        // Skip update if position hasn't changed (prevents unnecessary updates)
                                        if (newKey === oldKey) {
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Check if there's already a different window at the target position
                                        const existingWindow = windowOverlays[newKey];
                                        if (existingWindow && newKey !== oldKey) {
                                            // Don't move - there's already a window here, but continue checking
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Use the exact old key format when removing to prevent duplicates
                                        const oldKeyFormats = [
                                            `${oldX.toFixed(3)},${oldY.toFixed(3)}`,
                                            `${oldX.toFixed(1)},${oldY.toFixed(1)}`,
                                            `${Math.round(oldX)},${Math.round(oldY)}`
                                        ];

                                        // Remove from old position using all possible key formats
                                        oldKeyFormats.forEach(key => {
                                            if (windowOverlays[key]) {
                                                removeWindowOverlay(parseFloat(key.split(',')[0]), parseFloat(key.split(',')[1]));
                                            }
                                        });

                                        // Add to new position with updated wallKey
                                        setWindowOverlay(newX, newY, dragWindowRef.current.data.type, currentWallKey);

                                        // Update the ref immediately (sync) for next drag event
                                        dragWindowRef.current.gridX = newX;
                                        dragWindowRef.current.gridY = newY;
                                        dragWindowRef.current.data.wallKey = currentWallKey;
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };

                                        // Also update state for rendering
                                        const newWindowData = {
                                            key: newKey,
                                            gridX: newX,
                                            gridY: newY,
                                            data: {
                                                ...dragWindowRef.current.data,
                                                wallKey: currentWallKey
                                            }
                                        };
                                        setSelectedWindow(newWindowData);
                                        setSelectedWindowKey(newKey);
                                        setWallDragStart({ gridX: moveCoords.gridX, gridY: moveCoords.gridY });

                                        // Continue RAF chain for smooth dragging - check for next update
                                        windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                    };

                                    // Start the RAF chain
                                    windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                }

                                // Always update lastDragPos to track mouse movement
                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                            } else if (dragWallRef.current) {
                                // Check if this is a door - doors should move along walls like windows
                                const { x1, y1, x2, y2, key: oldWallKey } = dragWallRef.current;
                                const currentWall = wallData[oldWallKey];
                                const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                const isDoor = wallType && wallType.includes('door');

                                if (isDoor) {
                                    // Store pending door update for RAF throttling (similar to windows)
                                    pendingDoorUpdateRef.current = {
                                        moveCoords,
                                        gridOffsetX,
                                        gridOffsetY,
                                        gridSize,
                                        wallData,
                                        findWallsNearPosition,
                                        moveWall,
                                        x1, y1, x2, y2, oldWallKey
                                    };

                                    // Chain RAF updates for smooth door dragging
                                    if (doorDragRafRef.current === null) {
                                        const updateDoorPosition = () => {
                                            const update = pendingDoorUpdateRef.current;
                                            if (!update || !dragWallRef.current) {
                                                doorDragRafRef.current = null;
                                                return;
                                            }

                                            const { moveCoords, gridOffsetX, gridOffsetY, gridSize, wallData, findWallsNearPosition, moveWall, x1, y1, x2, y2, oldWallKey } = update;

                                            // Door dragging - constrain to walls like windows
                                            // Convert mouse position to precise grid coordinates
                                            const clickX = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                                ? (moveCoords.worldX - gridOffsetX) / gridSize
                                                : moveCoords.gridX + 0.5;
                                            const clickY = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                                ? (moveCoords.worldY - gridOffsetY) / gridSize
                                                : moveCoords.gridY + 0.5;

                                            // Find all walls near the mouse position (excluding doors)
                                            const nearbyWalls = findWallsNearPosition(clickX, clickY);
                                            const validWalls = nearbyWalls.filter(wall => {
                                                const wt = typeof wall.data === 'string' ? wall.data : wall.data?.type;
                                                return !(wt && wt.includes('door')); // Exclude other doors
                                            });

                                            if (validWalls.length === 0) {
                                                // No valid walls nearby, keep door on current position
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            // Use the closest wall (can snap to different walls when dragged near them)
                                            const targetWall = validWalls[0];
                                            const [twx1, twy1, twx2, twy2] = targetWall.key.split(',').map(Number);

                                            // Calculate wall direction
                                            const twdx = twx2 - twx1;
                                            const twdy = twy2 - twy1;
                                            const twLength = Math.sqrt(twdx * twdx + twdy * twdy);

                                            if (twLength === 0) {
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            // Project mouse point onto target wall
                                            const t = Math.max(0, Math.min(1,
                                                ((clickX - twx1) * twdx + (clickY - twy1) * twdy) / (twLength * twLength)
                                            ));

                                            // Closest point on wall
                                            const projX = twx1 + t * twdx;
                                            const projY = twy1 + t * twdy;

                                            // Calculate door center and endpoints along the wall
                                            const doorLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                                            const halfLength = doorLength / 2;

                                            // Normalize wall direction
                                            const dirX = twdx / twLength;
                                            const dirY = twdy / twLength;

                                            // Place door along the wall at projected point
                                            const newX1 = projX - dirX * halfLength;
                                            const newY1 = projY - dirY * halfLength;
                                            const newX2 = projX + dirX * halfLength;
                                            const newY2 = projY + dirY * halfLength;

                                            // Calculate new key
                                            const newKey = newX1 < newX2 || (newX1 === newX2 && newY1 < newY2)
                                                ? `${newX1},${newY1},${newX2},${newY2}`
                                                : `${newX2},${newY2},${newX1},${newY1}`;

                                            // Check if there's already a different wall at the target position
                                            const existingWall = wallData[newKey];
                                            if (existingWall && newKey !== oldWallKey) {
                                                // Don't move - there's already a wall here
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            moveWall(x1, y1, x2, y2, newX1, newY1, newX2, newY2);

                                            // Update ref for next drag event
                                            dragWallRef.current = { x1: newX1, y1: newY1, x2: newX2, y2: newY2, key: newKey };
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };

                                            setWallDragStart({ gridX: moveCoords.gridX, gridY: moveCoords.gridY });

                                            // Continue RAF chain
                                            doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                        };

                                        // Start the RAF chain
                                        doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                    }

                                    // Always update lastDragPos to track mouse movement
                                    lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                } else {
                                    // Regular wall - move freely by delta
                                    const newX1 = x1 + deltaX;
                                    const newY1 = y1 + deltaY;
                                    const newX2 = x2 + deltaX;
                                    const newY2 = y2 + deltaY;

                                    // Calculate new key
                                    const newKey = newX1 < newX2 || (newX1 === newX2 && newY1 < newY2)
                                        ? `${newX1},${newY1},${newX2},${newY2}`
                                        : `${newX2},${newY2},${newX1},${newY1}`;

                                    // Check if there's already a different wall at the target position
                                    const existingWall = wallData[newKey];
                                    if (existingWall && newKey !== oldWallKey) {
                                        // Don't move - there's already a wall here
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                        break;
                                    }

                                    moveWall(x1, y1, x2, y2, newX1, newY1, newX2, newY2);

                                    // Update ref for next drag event
                                    dragWallRef.current = { x1: newX1, y1: newY1, x2: newX2, y2: newY2, key: newKey };
                                    lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };

                                    setWallDragStart({ gridX: moveCoords.gridX, gridY: moveCoords.gridY });
                                }
                            }
                        }
                    }
                }
                break;
            case 'line':
            case 'rectangle':
            case 'circle':
                // For shape tools, update the end point for real-time preview
                const shapeCoords = screenToGrid(e.clientX, e.clientY);
                if (shapeCoords && currentPath.length > 0) {
                    const newPath = [currentPath[0], shapeCoords];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
            case 'polygon':
                // For polygon, create a triangle from start and end points
                const polyCoords = screenToGrid(e.clientX, e.clientY);
                if (polyCoords && currentPath.length > 0) {
                    const startPoint = currentPath[0];
                    // Calculate third point to form a triangle
                    const dx = polyCoords.gridX - startPoint.gridX;
                    const dy = polyCoords.gridY - startPoint.gridY;
                    const thirdPoint = {
                        gridX: startPoint.gridX + dx * 0.5 - dy * 0.3,
                        gridY: startPoint.gridY + dy * 0.5 + dx * 0.3
                    };
                    const newPath = [startPoint, polyCoords, thirdPoint];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
            default:
                const defaultCoords = screenToGrid(e.clientX, e.clientY);
                if (defaultCoords) {
                    const newPath = [...currentPath, defaultCoords];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
        }
    }, [isDrawing, isEditorMode, screenToGrid, selectedTool, toolSettings, paintTerrainBrush, removeTerrainAtPosition, currentPath, setCurrentPath, setCurrentDrawingPath, handleDrawingErase, removeFogAtPosition, gridSize, windowOverlays, wallData]);

    const handleMouseUp = useCallback(() => {
        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            return;
        }

        // Handle area selection completion
        if (selectedTool === 'area_remove' && selectionRect && isDrawing) {
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                const minX = Math.min(selectionRect.startX, selectionRect.endX);
                const maxX = Math.max(selectionRect.startX, selectionRect.endX);
                const minY = Math.min(selectionRect.startY, selectionRect.endY);
                const maxY = Math.max(selectionRect.startY, selectionRect.endY);

                // Only show modal if selection has meaningful size
                if (Math.abs(maxX - minX) > 10 && Math.abs(maxY - minY) > 10) {
                    const foundObjects = findObjectsInArea(minX, minY, maxX, maxY);
                    setSelectedAreaObjects(foundObjects);
                    setShowRemoveModal(true);
                }
            }
            setIsDrawing(false);
            setSelectionRect(null);
            return;
        }

        if (!isDrawing) return;

        // Handle wall select drag end
        if (selectedTool === 'wall_select') {
            // Cancel any pending window/door drag RAF updates
            if (windowDragRafRef.current !== null) {
                cancelAnimationFrame(windowDragRafRef.current);
                windowDragRafRef.current = null;
            }
            if (doorDragRafRef.current !== null) {
                cancelAnimationFrame(doorDragRafRef.current);
                doorDragRafRef.current = null;
            }
            pendingWindowUpdateRef.current = null;
            pendingDoorUpdateRef.current = null;

            setIsDrawing(false);
            setWallDragStart(null);
            setIsDraggingWall(false);
            // Keep selection active after drag
            return;
        }

        // Finish fog paths if we were drawing fog
        if (selectedTool === 'fog_erase') {
            finishFogErasePath();
        }

        if (typeof window !== 'undefined') {
            window._isDrawingFog = false;
        }

        // Handle wall placement separately from drawing paths
        if (selectedTool === 'wall_draw' && currentPath.length === 2) {
            const startPoint = currentPath[0];
            const endPoint = currentPath[1];
            const wallType = toolSettings.selectedWallType || 'stone_wall';
            const wallMode = toolSettings.wallMode || 'continuous';

            console.log('🧱 WALL PLACEMENT DEBUG:', {
                selectedTool,
                currentPathLength: currentPath.length,
                startPoint,
                endPoint,
                wallType,
                wallMode,
                toolSettings
            });

            if (wallMode === 'continuous') {
                // Continuous mode: place single wall
                console.log('🧱 Placing continuous wall');
                setWall(
                    startPoint.gridX,
                    startPoint.gridY,
                    endPoint.gridX,
                    endPoint.gridY,
                    wallType
                );
            } else if (wallMode === 'rectangle') {
                // Rectangle mode: place walls around a rectangle
                console.log('🧱 Placing rectangle walls');
                const gridSystem = getGridSystem();
                const { gridType } = gridSystem.getGridState();

                const minX = Math.min(startPoint.gridX, endPoint.gridX);
                const maxX = Math.max(startPoint.gridX, endPoint.gridX);
                const minY = Math.min(startPoint.gridY, endPoint.gridY);
                const maxY = Math.max(startPoint.gridY, endPoint.gridY);

                if (gridType === 'hex') {
                    // For hex grids, create walls along the hex boundary
                    // Get all hexes in the rectangle
                    const hexes = [];
                    for (let q = minX; q <= maxX; q++) {
                        for (let r = minY; r <= maxY; r++) {
                            hexes.push({ q, r });
                        }
                    }

                    // Find boundary hexes and create walls along their edges
                    hexes.forEach(hex => {
                        const neighbors = gridSystem.getHexNeighbors(hex.q, hex.r);
                        neighbors.forEach(neighbor => {
                            // If neighbor is outside the rectangle, create a wall
                            if (neighbor.q < minX || neighbor.q > maxX || neighbor.r < minY || neighbor.r > maxY) {
                                // Create wall between this hex and its neighbor
                                setWall(hex.q, hex.r, neighbor.q, neighbor.r, wallType);
                            }
                        });
                    });
                } else {
                    // Square grid: create 4 walls
                    // Top wall
                    setWall(minX, minY, maxX, minY, wallType);
                    // Bottom wall
                    setWall(minX, maxY, maxX, maxY, wallType);
                    // Left wall
                    setWall(minX, minY, minX, maxY, wallType);
                    // Right wall
                    setWall(maxX, minY, maxX, maxY, wallType);
                }
            }
        } else if (currentPath.length > 0 &&
            selectedTool !== 'wall_draw' &&
            selectedTool !== 'object_place' &&
            selectedTool !== 'object_select' &&
            selectedTool !== 'object_delete' &&
            selectedTool !== 'door_place' &&
            selectedTool !== 'fog_clear_all') {
            // Finalize the drawing path for drawing tools only
            // For freehand, require at least 2 points to create a visible line
            if (selectedTool === 'freehand' && currentPath.length < 2) {
                // Don't save single-point freehand drawings (they won't render anyway)
                console.log('Skipping freehand drawing with less than 2 points');
            } else {
                const pathData = {
                    tool: selectedTool,
                    points: currentPath,
                    style: {
                        strokeWidth: toolSettings.strokeWidth || 2,
                        strokeColor: toolSettings.strokeColor || '#000000',
                        fillColor: toolSettings.fillColor || 'transparent',
                        opacity: toolSettings.opacity || 1
                    },
                    layer: selectedTool === 'freehand' || selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'polygon' || selectedTool === 'text' ? 'drawings' : activeLayer,
                    timestamp: Date.now()
                };

                addDrawingPath(pathData);
            }
        }

        // Reset drawing state
        setIsDrawing(false);
        setCurrentPath([]);
        clearCurrentDrawing();

        // Ensure drawing state is fully reset
        setIsCurrentlyDrawing(false);
        setCurrentDrawingTool('');
        lastTerrainBrushPosRef.current = null;
    }, [isDrawing, currentPath, selectedTool, toolSettings, activeLayer, addDrawingPath, setWall, clearCurrentDrawing, selectionRect, findObjectsInArea, finishFogErasePath, setIsCurrentlyDrawing, setCurrentDrawingTool]);

    // Handle right-click context menu (used for completing polygons)
    const handleContextMenu = useCallback((e) => {
        e.preventDefault(); // Prevent default context menu

        // Complete polygon on right-click if currently drawing a polygon
        if (selectedTool === 'polygon' && isDrawing && currentPath.length >= 3) {
            const pathData = {
                tool: 'polygon',
                points: currentPath,
                style: {
                    strokeWidth: toolSettings.strokeWidth || 2,
                    strokeColor: toolSettings.strokeColor || '#000000',
                    fillColor: toolSettings.fillColor || 'transparent',
                    opacity: toolSettings.opacity || 1
                },
                layer: 'drawings',
                timestamp: Date.now()
            };

            addDrawingPath(pathData);

            // Reset drawing state
            setIsDrawing(false);
            setCurrentPath([]);
            clearCurrentDrawing();
            setIsCurrentlyDrawing(false);
            setCurrentDrawingTool('');
        }
    }, [selectedTool, isDrawing, currentPath, toolSettings, addDrawingPath, clearCurrentDrawing, setIsCurrentlyDrawing, setCurrentDrawingTool]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case 'escape':
                    e.preventDefault();
                    // If we have a wall/window selected, deselect it first
                    if (isObjectLocked || selectedWallKey || selectedWindow) {
                        setSelectedWallKey(null);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(false);
                        dragWindowRef.current = null;
                        dragWallRef.current = null;
                        lastDragPosRef.current = null;
                    } else {
                        // Only close editor if nothing is selected
                        setIsOpen(false);
                        setEditorMode(false);
                    }
                    break;
                case '1':
                    e.preventDefault();
                    handleTabChange('terrain');
                    break;
                case '2':
                    e.preventDefault();
                    handleTabChange('drawing');
                    break;
                case '3':
                    e.preventDefault();
                    handleTabChange('walls');
                    break;
                case '4':
                    e.preventDefault();
                    handleTabChange('fog');
                    break;
                case '5':
                    e.preventDefault();
                    handleTabChange('fog');
                    break;
                case '6':
                    e.preventDefault();
                    handleTabChange('objects');
                    break;
                case 'v':
                    e.preventDefault();
                    handleToolSelect('select');
                    break;
                case 'delete':
                case 'backspace':
                    e.preventDefault();
                    // Delete selected wall/window if in wall_select mode
                    if (selectedTool === 'wall_select' && isObjectLocked) {
                        if (selectedWindow) {
                            removeWindowOverlay(selectedWindow.gridX, selectedWindow.gridY);
                            setSelectedWindow(null);
                            setSelectedWindowKey(null);
                        } else if (selectedWallKey) {
                            const [x1, y1, x2, y2] = selectedWallKey.split(',').map(Number);
                            removeWall(x1, y1, x2, y2);
                            setSelectedWallKey(null);
                        }
                        setIsObjectLocked(false);
                        dragWindowRef.current = null;
                        dragWallRef.current = null;
                        lastDragPosRef.current = null;
                    } else if (selectedDrawings.length > 0) {
                        // Delete selected drawings
                        selectedDrawings.forEach(id => {
                            // Remove drawing logic here
                        });
                        clearDrawingSelection();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedDrawings, clearDrawingSelection, handleTabChange, handleToolSelect, isObjectLocked, selectedWallKey, selectedWindow, setSelectedWallKey, setSelectedWindowKey, selectedTool, removeWindowOverlay, removeWall]);

    // Cleanup RAF on unmount or when editor closes
    useEffect(() => {
        return () => {
            if (hoverPreviewRafId.current !== null) {
                cancelAnimationFrame(hoverPreviewRafId.current);
                hoverPreviewRafId.current = null;
            }
        };
    }, []);

    // Auto-open editor when editor mode is enabled
    useEffect(() => {
        if (isGMMode && isEditorMode && !isOpen) {
            setIsOpen(true);
            // Ensure the active tool is set to terrain_brush (matching the default tab)
            setActiveTool('terrain_brush');
        } else if (!isEditorMode && isOpen) {
            setIsOpen(false);
        }
    }, [isGMMode, isEditorMode, isOpen, setActiveTool]);

    // Load current map state when editor opens (only once, and only if map has data)
    useEffect(() => {
        if (isEditorMode && isGMMode) {
            // Load the current map's state when editor opens
            const mapId = getCurrentMapId();
            if (mapId) {
                const mapState = getMapStateFromStore();
                if (mapState) {
                    // Load terrain and other level editor data from the current map
                    // Only load if the map actually has data (not empty arrays/objects)
                    const levelEditorState = useLevelEditorStore.getState();

                    // Only load terrain if map has terrain data
                    if (mapState.terrainData && Object.keys(mapState.terrainData).length > 0 && levelEditorState.setTerrainData) {
                        levelEditorState.setTerrainData(mapState.terrainData);
                    }
                    // Only load environmental objects if map has objects
                    if (mapState.environmentalObjects && Array.isArray(mapState.environmentalObjects) && mapState.environmentalObjects.length > 0 && levelEditorState.setEnvironmentalObjects) {
                        levelEditorState.setEnvironmentalObjects(mapState.environmentalObjects);
                    }
                    // Only load walls if map has wall data
                    if (mapState.wallData && Object.keys(mapState.wallData).length > 0 && levelEditorState.setWallData) {
                        levelEditorState.setWallData(mapState.wallData);
                    }
                    // Only load dnd elements if map has elements
                    if (mapState.dndElements && Array.isArray(mapState.dndElements) && mapState.dndElements.length > 0 && levelEditorState.setDndElements) {
                        levelEditorState.setDndElements(mapState.dndElements);
                    }
                    // CRITICAL FIX: Only load fog data if map state has it, otherwise preserve current fog
                    // This prevents clearing fog when opening editor on the same map
                    if (mapState.fogOfWarData && Object.keys(mapState.fogOfWarData).length > 0 && levelEditorState.setFogOfWarData) {
                        levelEditorState.setFogOfWarData(mapState.fogOfWarData);
                    }
                    // CRITICAL FIX: Only load fog paths if map state has them, otherwise preserve current fog paths
                    // This prevents clearing "cover entire map" fog when opening editor
                    if (mapState.fogOfWarPaths && Array.isArray(mapState.fogOfWarPaths) && mapState.fogOfWarPaths.length > 0 && levelEditorState.setFogOfWarPaths) {
                        // Only load if map has fog paths - otherwise preserve current fog (like "cover entire map")
                        levelEditorState.setFogOfWarPaths(mapState.fogOfWarPaths);
                    }
                    // CRITICAL FIX: Only load erase paths if map state has them, otherwise preserve current erase paths
                    if (mapState.fogErasePaths && Array.isArray(mapState.fogErasePaths) && mapState.fogErasePaths.length > 0 && levelEditorState.setFogErasePaths) {
                        levelEditorState.setFogErasePaths(mapState.fogErasePaths);
                    }
                    // CRITICAL FIX: Preserve explored areas when editor opens - don't clear player's exploration progress
                    // Only load explored areas from map if they exist, otherwise preserve current state
                    if (mapState.exploredAreas && Object.keys(mapState.exploredAreas).length > 0 && levelEditorState.setExploredAreas) {
                        // Merge with existing explored areas to preserve player progress
                        const currentExplored = levelEditorState.exploredAreas || {};
                        const mergedExplored = { ...currentExplored, ...mapState.exploredAreas };
                        levelEditorState.setExploredAreas(mergedExplored);
                    }
                    // If map has no explored areas, preserve current explored areas (don't clear them)
                    // Always load drawings for the new map (clear if empty)
                    if (levelEditorState.setDrawingPaths) {
                        // Always load drawings - clear existing and load new map's drawings
                        levelEditorState.setDrawingPaths(mapState.drawingPaths || []);
                    }
                    // Always set drawing layers (they should always exist)
                    if (mapState.drawingLayers && levelEditorState.setDrawingLayers) {
                        const defaultLayers = [
                            { id: 'background', name: 'Background', visible: true, locked: false },
                            { id: 'terrain', name: 'Terrain', visible: true, locked: false },
                            { id: 'drawings', name: 'Drawings', visible: true, locked: false },
                            { id: 'walls', name: 'Walls', visible: true, locked: false },
                            { id: 'objects', name: 'Objects', visible: true, locked: false },
                            { id: 'lighting', name: 'Lighting', visible: true, locked: false },
                            { id: 'fog', name: 'Fog of War', visible: true, locked: false },
                            { id: 'grid', name: 'Grid', visible: true, locked: false },
                            { id: 'overlay', name: 'Overlay', visible: true, locked: false }
                        ];
                        levelEditorState.setDrawingLayers(
                            mapState.drawingLayers.length > 0
                                ? mapState.drawingLayers
                                : defaultLayers
                        );
                    }
                }
            }
        }
    }, [isEditorMode, isGMMode, currentMapId, getMapStateFromStore, getCurrentMapId]);

    // Auto-focus text input when it appears
    useEffect(() => {
        if (textInput.show && textInputRef.current) {
            // Small delay to ensure the input is rendered
            setTimeout(() => {
                textInputRef.current?.focus();
                textInputRef.current?.select(); // Select any existing text
            }, 50);
        }
    }, [textInput.show]);

    // Force re-render of text input when tool settings change (for live preview)
    useEffect(() => {
        if (textInput.show) {
            // Trigger a re-render by updating the textInput state slightly
            setTextInput(prev => ({ ...prev }));
        }
    }, [toolSettings.fontSize, toolSettings.fontFamily, toolSettings.textColor, toolSettings.backgroundColor, toolSettings.backgroundStyle, toolSettings.bold, toolSettings.italic, toolSettings.underline]);

    // Only render if GM mode is enabled
    if (!isGMMode) {
        return null;
    }

    return (
        <>

            {/* Editor Window */}
            <WowWindow
                title="Editor"
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditorMode(false);
                }}
                defaultSize={{ width: 500, height: 550 }}
                defaultPosition={{ x: 50, y: 50 }}
                customHeader={
                    <div className="spellbook-tab-container">
                        {Object.entries(vttTools).map(([key, category]) => (
                            <button
                                key={key}
                                className={`spellbook-tab-button ${activeTab === key ? 'active' : ''}`}
                                onClick={() => handleTabChange(key)}
                                title={`${category.name} - Professional tools for map creation`}
                            >
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                }
                className="professional-vtt-editor"
            >
                <div className="vtt-editor-content">
                    {/* Tool Settings - Full Width */}
                    <div className="vtt-tool-settings">
                        {/* Layer Panel Toggle Overlay Button */}
                        <button
                            className="layer-panel-overlay-toggle"
                            onClick={() => setIsLayersPanelCollapsed(!isLayersPanelCollapsed)}
                            title={isLayersPanelCollapsed ? 'Show Layers Panel' : 'Hide Layers Panel'}
                        >
                            {isLayersPanelCollapsed ? '◀' : '▶'}
                        </button>

                        {/* Render tool-specific components */}
                        {activeTab === 'drawing' && (
                            <DrawingTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'terrain' && (
                            <TerrainTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'walls' && (
                            <WallTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'fog' && (
                            <FogTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'objects' && (
                            <ObjectTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'grid' && (
                            <GridTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                    </div>



                </div>

                {/* Layer Management - Right Side */}
                {!isLayersPanelCollapsed && (
                    <div className="vtt-layer-panel">
                        <div className="layer-panel-header">
                            <h4>Layers</h4>
                            <button
                                className="layer-panel-toggle"
                                onClick={() => setIsLayersPanelCollapsed(!isLayersPanelCollapsed)}
                                title="Collapse Layers Panel"
                            >
                                ▶
                            </button>
                        </div>
                        <>
                            <button
                                className="action-btn danger"
                                onClick={clearAllProfessionalData}
                                style={{ width: '100%', marginBottom: '12px' }}
                            >
                                Clear All
                            </button>
                            <div className="layer-list">
                                {drawingLayers.map(layer => {
                                    // For grid layer, use actual grid visibility state
                                    const isVisible = layer.id === 'grid' ? showGrid : layer.visible;

                                    return (
                                        <div
                                            key={layer.id}
                                            className={`layer-item ${activeLayer === layer.id ? 'active' : ''}`}
                                            onClick={() => setActiveLayer(layer.id)}
                                        >
                                            <span className="layer-name">{layer.name}</span>
                                            <div className="layer-controls">
                                                <button
                                                    className={`layer-visibility ${isVisible ? 'visible' : 'hidden'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Toggle both the drawing layer and the legacy layer system
                                                        toggleLayerVisibility(layer.id);

                                                        // Also toggle the legacy layer system for compatibility
                                                        if (layer.id === 'terrain') {
                                                            toggleLayer('terrain');
                                                        } else if (layer.id === 'walls') {
                                                            toggleLayer('walls');
                                                        } else if (layer.id === 'objects') {
                                                            toggleLayer('objects');
                                                        } else if (layer.id === 'background') {
                                                            toggleLayer('dnd');
                                                        } else if (layer.id === 'grid') {
                                                            // Toggle grid visibility in gameStore
                                                            const { setShowGrid, showGrid } = useGameStore.getState();
                                                            setShowGrid(!showGrid);
                                                        }
                                                    }}
                                                    title={isVisible ? 'Hide Layer' : 'Show Layer'}
                                                >
                                                    <i className={`fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </button>
                                                <button
                                                    className={`layer-lock ${layer.locked ? 'locked' : 'unlocked'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLayerLock(layer.id);
                                                    }}
                                                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                                                >
                                                    <i className={`fas ${layer.locked ? 'fa-lock' : 'fa-unlock'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {isInRoom && (
                                <div className="layer-actions">
                                    <button
                                        className={`action-btn ${hasUnsavedChanges ? 'warning' : 'primary'}`}
                                        onClick={saveLevelEditorState}
                                        title={`Save to Room: ${currentRoomId}`}
                                    >
                                        {hasUnsavedChanges ? '💾 Save*' : '💾 Save'}
                                    </button>
                                    <button
                                        className="action-btn secondary"
                                        onClick={loadLevelEditorState}
                                        title={`Load from Room: ${currentRoomId}`}
                                    >
                                        📋 Load
                                    </button>
                                    <div className="room-status">
                                        <small>Room: {currentRoomId}</small>
                                        {hasUnsavedChanges && <small className="unsaved">*Unsaved changes</small>}
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                )}

            </WowWindow>

            {/* Grid Overlay for Drawing */}
            {isEditorMode && (
                <div
                    ref={overlayRef}
                    className="vtt-drawing-overlay"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        if (isDrawing) handleMouseUp();
                        setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
                    }}
                    onContextMenu={handleContextMenu}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 100,
                        cursor: vttTools[activeTab]?.tools.find(t => t.id === selectedTool)?.cursor || 'default',
                        pointerEvents: (selectedTool === 'select') ? 'none' : 'auto'
                    }}
                />
            )}

            {/* Hover Preview for Brush Tools */}
            {isEditorMode && hoverPreview.show && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_erase') && (
                <TerrainHoverPreview
                    gridX={hoverPreview.gridX}
                    gridY={hoverPreview.gridY}
                    brushSize={hoverPreview.brushSize}
                    isEraser={selectedTool === 'terrain_erase' || selectedTool === 'fog_erase'}
                    isFog={selectedTool === 'fog_erase'}
                    screenX={hoverPreview.screenX}
                    screenY={hoverPreview.screenY}
                />
            )}

            {/* Eraser Cursor Preview */}
            {isEditorMode && hoverPreview.show && hoverPreview.isEraser && (
                <div
                    style={{
                        position: 'absolute',
                        left: hoverPreview.screenX - hoverPreview.eraserRadius,
                        top: hoverPreview.screenY - hoverPreview.eraserRadius,
                        width: hoverPreview.eraserRadius * 2,
                        height: hoverPreview.eraserRadius * 2,
                        border: '2px solid #ff4444',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 68, 68, 0.2)',
                        pointerEvents: 'none',
                        zIndex: 99
                    }}
                />
            )}



            {/* Text Input Overlay with Live Preview */}
            {textInput.show && (
                <div
                    style={{
                        position: 'absolute',
                        left: textInput.x,
                        top: textInput.y,
                        zIndex: 1000,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        border: '2px solid #4a8eff',
                        borderRadius: '8px',
                        padding: '12px',
                        minWidth: '300px'
                    }}
                >
                    {/* Input Field */}
                    <input
                        ref={textInputRef}
                        type="text"
                        value={textInput.text}
                        onChange={(e) => setTextInput(prev => ({ ...prev, text: e.target.value }))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleTextSubmit();
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                handleTextCancel();
                            }
                        }}
                        placeholder="Enter text..."
                        autoFocus
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #666',
                            color: '#ffffff',
                            fontSize: '14px',
                            outline: 'none',
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            marginBottom: '12px'
                        }}
                    />

                    {/* Live Preview */}
                    {textInput.text && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                fontSize: '12px',
                                color: '#cccccc',
                                marginBottom: '6px'
                            }}>
                                Preview:
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    ...getTextPreviewStyle()
                                }}
                            >
                                {textInput.text}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div style={{
                        fontSize: '11px',
                        color: '#cccccc',
                        textAlign: 'center'
                    }}>
                        Press Enter to place • Esc to cancel
                    </div>
                </div>
            )}

            {/* Selection Rectangle for Area Remove Tool */}
            {isEditorMode && selectedTool === 'area_remove' && selectionRect && overlayRef.current && (
                <div
                    style={{
                        position: 'absolute',
                        left: overlayRef.current.offsetLeft + Math.min(selectionRect.startX, selectionRect.endX),
                        top: overlayRef.current.offsetTop + Math.min(selectionRect.startY, selectionRect.endY),
                        width: Math.abs(selectionRect.endX - selectionRect.startX),
                        height: Math.abs(selectionRect.endY - selectionRect.startY),
                        border: '2px dashed #4a8eff',
                        backgroundColor: 'rgba(74, 142, 255, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 101
                    }}
                />
            )}

            {/* Area Remove Modal */}
            <AreaRemoveModal
                isOpen={showRemoveModal}
                onClose={() => {
                    setShowRemoveModal(false);
                    setSelectedAreaObjects(null);
                }}
                onRemove={handleAreaRemove}
                selectedObjects={selectedAreaObjects}
            />

            {/* Selection Indicator - shows when an object is selected and locked */}
            {selectedTool === 'wall_select' && isObjectLocked && (selectedWallKey || selectedWindow) && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(42, 36, 25, 0.95)',
                        border: '1px solid #d4af37',
                        borderRadius: '20px',
                        padding: '8px 20px',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <span style={{ color: '#f0e6d2', fontSize: '13px' }}>
                        Selected: <strong style={{ color: '#d4af37' }}>
                            {selectedWindow ? 'Window' :
                                (wallData[selectedWallKey]?.type?.includes('door') ? 'Door' : 'Wall')}
                        </strong>
                    </span>
                    <span style={{ color: '#a08c70', fontSize: '11px' }}>
                        Drag to move
                    </span>
                    <button
                        onClick={() => {
                            setSelectedWallKey(null);
                            setSelectedWindowKey(null);
                            setSelectedWindow(null);
                            setIsObjectLocked(false);
                        }}
                        style={{
                            background: '#4a3a25',
                            border: '1px solid #5a4a3a',
                            borderRadius: '12px',
                            padding: '4px 12px',
                            color: '#d4af37',
                            cursor: 'pointer',
                            fontSize: '11px'
                        }}
                    >
                        Unlock
                    </button>
                </div>
            )}

        </>
    );
};

export default ProfessionalVTTEditor;
