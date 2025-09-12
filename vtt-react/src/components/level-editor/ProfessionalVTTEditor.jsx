import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import WowWindow from '../windows/WowWindow';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

// Import professional tool components
import DrawingTools from './tools/DrawingTools';
import TerrainTools from './tools/TerrainTools';
import ObjectTools from './tools/ObjectTools';
import WallTools from './tools/WallTools';
import LightingTools from './tools/LightingTools';
import FogTools from './tools/FogTools';
import GridTools from './tools/GridTools';
import TerrainHoverPreview from './TerrainHoverPreview';
import { PROFESSIONAL_OBJECTS } from './objects/ObjectSystem';

import './styles/ProfessionalVTTEditor.css';

const ProfessionalVTTEditor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('terrain');
    const [selectedTool, setSelectedTool] = useState('select');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    const [hoverPreview, setHoverPreview] = useState({ show: false, gridX: 0, gridY: 0, brushSize: 1 });


    const windowRef = useRef(null);
    const overlayRef = useRef(null);
    const textInputRef = useRef(null);

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
        floodFillTerrain,
        removeTerrainAtPosition,
        getTerrainAtPosition,
        paintFogBrush,
        removeFogAtPosition,
        clearAllFog,
        addEnvironmentalObject,
        removeEnvironmentalObject,
        selectEnvironmentalObject,
        getObjectAtPosition,
        environmentalObjects,
        wallData,
        showWallLayer,
        setWall,
        setCurrentDrawingPath,
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

    // Professional VTT tool categories inspired by Roll20/Owlbear Rodeo
    const vttTools = {
        terrain: {
            name: 'Terrain',
            icon: 'spell_nature_earthquake',
            tools: [
                { id: 'terrain_brush', name: 'Terrain Brush', icon: 'inv_misc_brush_01', cursor: 'crosshair' },
                { id: 'tile_stamp', name: 'Tile Stamp', icon: 'inv_misc_tile_01', cursor: 'crosshair' },
                { id: 'elevation', name: 'Elevation', icon: 'spell_nature_earthquake', cursor: 'crosshair' },
                { id: 'texture_paint', name: 'Texture Paint', icon: 'inv_misc_paintbrush_01', cursor: 'crosshair' }
            ]
        },
        drawing: {
            name: 'Drawing',
            icon: 'inv_inscription_scroll',
            tools: [
                { id: 'select', name: 'Select', icon: 'ability_hunter_markedfordeath', cursor: 'default' },
                { id: 'freehand', name: 'Freehand', icon: 'inv_misc_pen_02', cursor: 'crosshair' },
                { id: 'line', name: 'Line', icon: 'inv_misc_arrowdown', cursor: 'crosshair' },
                { id: 'rectangle', name: 'Rectangle', icon: 'inv_misc_bag_08', cursor: 'crosshair' },
                { id: 'circle', name: 'Circle', icon: 'spell_arcane_portalstormwind', cursor: 'crosshair' },
                { id: 'text', name: 'Text', icon: 'inv_misc_book_09', cursor: 'text' },
                { id: 'eraser', name: 'Eraser', icon: 'inv_misc_bandage_12', cursor: 'crosshair' }
            ]
        },
        walls: {
            name: 'Walls',
            icon: 'spell_holy_sealofprotection',
            tools: [
                { id: 'wall_draw', name: 'Draw Wall', icon: 'inv_misc_wall_01', cursor: 'crosshair' },
                { id: 'door_place', name: 'Place Door', icon: 'inv_misc_key_03', cursor: 'crosshair' },
                { id: 'window_place', name: 'Place Window', icon: 'inv_misc_gem_crystal_01', cursor: 'crosshair' },
                { id: 'barrier_magic', name: 'Magic Barrier', icon: 'spell_holy_prayerofhealing', cursor: 'crosshair' },
                { id: 'wall_erase', name: 'Erase Walls', icon: 'ability_warrior_cleave', cursor: 'crosshair' }
            ]
        },
        lighting: {
            name: 'Light',
            icon: 'spell_fire_fireball',
            tools: [
                { id: 'light_torch', name: 'Torch', icon: 'spell_fire_fire', cursor: 'crosshair' },
                { id: 'light_lantern', name: 'Lantern', icon: 'inv_misc_lantern_01', cursor: 'crosshair' },
                { id: 'light_candle', name: 'Candle', icon: 'inv_misc_candle_01', cursor: 'crosshair' },
                { id: 'light_magical', name: 'Magical Light', icon: 'spell_holy_surgeoflight', cursor: 'crosshair' },
                { id: 'light_ambient', name: 'Ambient Zone', icon: 'spell_holy_holynova', cursor: 'crosshair' },
                { id: 'shadow_caster', name: 'Shadow Caster', icon: 'spell_shadow_shadowbolt', cursor: 'crosshair' }
            ]
        },
        fog: {
            name: 'Fog',
            icon: 'spell_shadow_mindsteal',
            tools: [
                { id: 'fog_paint', name: 'Paint Fog', icon: 'spell_frost_frostbolt', cursor: 'crosshair' },
                { id: 'fog_erase', name: 'Erase Fog', icon: 'spell_holy_dispelmagic', cursor: 'crosshair' },
                { id: 'fog_clear_all', name: 'Clear All Fog', icon: 'spell_holy_holynova', cursor: 'crosshair' }
            ]
        },
        objects: {
            name: 'Objects',
            icon: 'inv_misc_gem_variety_01',
            tools: [
                { id: 'object_place', name: 'Place Object', icon: 'inv_misc_bag_08', cursor: 'crosshair' },
                { id: 'token_place', name: 'Place Token', icon: 'inv_misc_coin_01', cursor: 'crosshair' },
                { id: 'portal_create', name: 'Create Portal', icon: 'spell_arcane_portalstormwind', cursor: 'crosshair' },
                { id: 'marker_place', name: 'Place Marker', icon: 'inv_misc_note_02', cursor: 'crosshair' },
                { id: 'object_rotate', name: 'Rotate', icon: 'ability_warrior_cleave', cursor: 'move' },
                { id: 'object_scale', name: 'Scale', icon: 'spell_nature_polymorph', cursor: 'nw-resize' }
            ]
        },
        grid: {
            name: 'Grid',
            icon: 'spell_arcane_teleportundercity',
            tools: [
                { id: 'grid_settings', name: 'Grid Settings', icon: 'inv_misc_gear_01', cursor: 'default' },
                { id: 'grid_toggle', name: 'Toggle Grid', icon: 'spell_arcane_teleportundercity', cursor: 'default' }
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

            // Auto-select GM Notes when switching to objects tab and Place Object is the first tool
            if (tabId === 'objects' && firstTool.id === 'object_place') {
                const availableObjects = Object.keys(PROFESSIONAL_OBJECTS);
                if (availableObjects.length === 1) {
                    const newSettings = {
                        ...toolSettings,
                        selectedObjectType: availableObjects[0]
                    };
                    setToolSettings(newSettings);
                    console.log('🎯 Auto-selected object type on tab change:', availableObjects[0]);
                }
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

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            // Get viewport dimensions that match the wall overlay coordinate system
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.screenToWorld(x, y, viewport.width, viewport.height);
            const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

            console.log('🧱 SCREEN TO GRID DEBUG:', {
                clientX, clientY,
                rectLeft: rect.left, rectTop: rect.top,
                localX: x, localY: y,
                viewportWidth: viewport.width, viewportHeight: viewport.height,
                worldPos, gridCoords
            });

            return {
                gridX: gridCoords.x,
                gridY: gridCoords.y,
                worldX: worldPos.x,
                worldY: worldPos.y,
                screenX: x,
                screenY: y
            };
        } catch (error) {
            console.warn('Grid system failed, using fallback:', error);
            // Fallback to original calculation if grid system fails
            const effectiveZoom = zoomLevel * playerZoom;
            const worldX = (x / effectiveZoom) + cameraX;
            const worldY = (y / effectiveZoom) + cameraY;

            // Convert to grid coordinates
            const gridX = Math.floor((worldX - gridOffsetX) / gridSize);
            const gridY = Math.floor((worldY - gridOffsetY) / gridSize);

            return { gridX, gridY, worldX, worldY, screenX: x, screenY: y };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

    // Convert grid coordinates to screen coordinates using the same system as tokens and grid lines
    const gridToScreen = useCallback((gridX, gridY) => {
        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const effectiveZoom = zoomLevel * playerZoom;
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

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

                if (point.isFreehand) {
                    // Freehand coordinates are already screen coordinates
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



    // Handle mouse events for drawing
    const handleMouseDown = useCallback((e) => {
        if (!isEditorMode) return;

        // For select tool and light_select tool, let ObjectSystem handle the events
        if (selectedTool === 'select' || selectedTool === 'light_select') {
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
            case 'light_place':
            case 'light_torch':
            case 'light_lantern':
            case 'light_candle':
                // Place light source or lantern object - NO DRAWING STATE
                const lightCoords = screenToGrid(e.clientX, e.clientY);
                if (lightCoords && toolSettings.selectedLightType) {
                    if (toolSettings.selectedLightType === 'lantern_object') {
                        // Place physical lantern object with free positioning
                        addEnvironmentalObject({
                            id: `lantern_${Date.now()}`,
                            type: 'lantern',
                            gridX: lightCoords.gridX,
                            gridY: lightCoords.gridY,
                            worldX: lightCoords.worldX, // Store world coordinates for free positioning
                            worldY: lightCoords.worldY,
                            freePosition: true,
                            showLight: true
                        });
                    } else {
                        // Place regular light source
                        // Light placement logic here - to be implemented
                    }
                }
                return; // Don't set drawing state for light tools
            case 'light_select':
                // Select light source or lantern object - NO DRAWING STATE

                // Get screen coordinates relative to the overlay
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const relativeX = e.clientX - rect.left;
                    const relativeY = e.clientY - rect.top;

                    // Check for lantern objects at this screen position
                    const clickedLantern = getObjectAtScreenPosition(relativeX, relativeY);
                    if (clickedLantern && clickedLantern.type === 'lantern') {
                        selectEnvironmentalObject(clickedLantern.id);
                    } else {
                        // Deselect all objects if nothing was clicked
                        environmentalObjects.forEach(obj => {
                            if (obj.selected) {
                                selectEnvironmentalObject(null); // This should deselect all
                            }
                        });
                    }
                }
                return; // Don't set drawing state for light tools
            case 'object_place':
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
                            notes: '',
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
                // Place door - NO DRAWING STATE
                if (toolSettings.selectedWallType) {
                    // Door placement logic here
                }
                return;
            case 'fog_clear_all':
                // Clear all fog - NO DRAWING STATE
                clearAllFog();
                return;
        }

        // Set drawing state for tools that need it
        setIsDrawing(true);
        setIsCurrentlyDrawing(true);
        setCurrentDrawingTool(selectedTool);

        // Handle different drawing tool types
        switch (selectedTool) {
            case 'freehand':
                // Start freehand drawing with screen coordinates for true freehand
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenCoords = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        isFreehand: true // Flag to distinguish from grid coords
                    };
                    setCurrentPath([screenCoords]);
                    setCurrentDrawingPath([screenCoords]);
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
                console.log('🎨 Terrain brush triggered - selectedTerrainType:', toolSettings.selectedTerrainType);
                if (toolSettings.selectedTerrainType) {
                    console.log('🎨 Painting terrain at:', coords, 'type:', toolSettings.selectedTerrainType);
                    paintTerrainBrush(
                        coords.gridX,
                        coords.gridY,
                        toolSettings.selectedTerrainType,
                        toolSettings.brushSize || 1
                    );
                }
                break;
            case 'terrain_erase':
                // Erase terrain with brush size
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
            case 'fog_paint':
                // Apply fog with brush size
                paintFogBrush(coords.gridX, coords.gridY, toolSettings.brushSize || 1);
                break;
            case 'fog_erase':
                // Remove fog with brush size
                removeFogAtPosition(coords.gridX, coords.gridY, toolSettings.brushSize || 1);
                break;
            default:
                break;
        }
    }, [isEditorMode, selectedTool, screenToGrid]);

    const handleMouseMove = useCallback((e) => {
        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select' || selectedTool === 'light_select') {
            return;
        }

        // Update hover preview for brush tools and eraser
        if (isEditorMode && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_paint' || selectedTool === 'fog_erase')) {
            const coords = screenToGrid(e.clientX, e.clientY);
            if (coords) {
                setHoverPreview({
                    show: true,
                    gridX: coords.gridX,
                    gridY: coords.gridY,
                    brushSize: toolSettings.brushSize || 1
                });
            }
        } else if (isEditorMode && selectedTool === 'eraser') {
            // Show eraser cursor
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                setHoverPreview({
                    show: true,
                    screenX: e.clientX - rect.left,
                    screenY: e.clientY - rect.top,
                    isEraser: true,
                    eraserRadius: 15
                });
            }
        } else {
            setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
        }

        if (!isDrawing) return;

        // Handle continuous painting for terrain tools
        switch (selectedTool) {
            case 'freehand':
                // Continue freehand drawing with screen coordinates
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenCoords = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        isFreehand: true
                    };

                    // Add point and immediately update drawing path for real-time feedback
                    setCurrentPath(prev => {
                        const newPath = [...prev, screenCoords];
                        // Also update the drawing path immediately
                        setCurrentDrawingPath(newPath);
                        return newPath;
                    });
                }
                break;
            case 'terrain_brush':
                const coords = screenToGrid(e.clientX, e.clientY);
                if (coords && toolSettings.selectedTerrainType) {
                    paintTerrainBrush(
                        coords.gridX,
                        coords.gridY,
                        toolSettings.selectedTerrainType,
                        toolSettings.brushSize || 1
                    );
                }
                break;
            case 'terrain_erase':
                const eraseCoords = screenToGrid(e.clientX, e.clientY);
                if (eraseCoords) {
                    removeTerrainAtPosition(eraseCoords.gridX, eraseCoords.gridY, toolSettings.brushSize || 1);
                }
                break;
            case 'eraser':
                // Handle drawing eraser - continuously erase while dragging
                handleDrawingErase(e.clientX, e.clientY);
                break;
            case 'fog_paint':
                // Continue fog painting
                const fogCoords = screenToGrid(e.clientX, e.clientY);
                if (fogCoords) {
                    paintFogBrush(fogCoords.gridX, fogCoords.gridY, toolSettings.brushSize || 1);
                }
                break;
            case 'fog_erase':
                // Continue fog erasing
                const fogEraseCoords = screenToGrid(e.clientX, e.clientY);
                if (fogEraseCoords) {
                    removeFogAtPosition(fogEraseCoords.gridX, fogEraseCoords.gridY, toolSettings.brushSize || 1);
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
            default:
                const defaultCoords = screenToGrid(e.clientX, e.clientY);
                if (defaultCoords) {
                    const newPath = [...currentPath, defaultCoords];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
        }
    }, [isDrawing, isEditorMode, screenToGrid, selectedTool, toolSettings, paintTerrainBrush, removeTerrainAtPosition, currentPath, setCurrentPath, setCurrentDrawingPath, handleDrawingErase, paintFogBrush, removeFogAtPosition]);

    const handleMouseUp = useCallback(() => {
        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select' || selectedTool === 'light_select') {
            return;
        }

        if (!isDrawing) return;

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
                const minX = Math.min(startPoint.gridX, endPoint.gridX);
                const maxX = Math.max(startPoint.gridX, endPoint.gridX);
                const minY = Math.min(startPoint.gridY, endPoint.gridY);
                const maxY = Math.max(startPoint.gridY, endPoint.gridY);

                // Top wall
                setWall(minX, minY, maxX, minY, wallType);
                // Bottom wall
                setWall(minX, maxY, maxX, maxY, wallType);
                // Left wall
                setWall(minX, minY, minX, maxY, wallType);
                // Right wall
                setWall(maxX, minY, maxX, maxY, wallType);
            }
        } else if (currentPath.length > 0 &&
                   selectedTool !== 'wall_draw' &&
                   selectedTool !== 'light_place' &&
                   selectedTool !== 'light_torch' &&
                   selectedTool !== 'light_lantern' &&
                   selectedTool !== 'light_candle' &&
                   selectedTool !== 'object_place' &&
                   selectedTool !== 'object_select' &&
                   selectedTool !== 'object_delete' &&
                   selectedTool !== 'door_place' &&
                   selectedTool !== 'fog_clear_all') {
            // Finalize the drawing path for drawing tools only
            const pathData = {
                tool: selectedTool,
                points: currentPath,
                style: {
                    strokeWidth: toolSettings.strokeWidth || 2,
                    strokeColor: toolSettings.strokeColor || '#000000',
                    fillColor: toolSettings.fillColor || 'transparent',
                    opacity: toolSettings.opacity || 1
                },
                layer: selectedTool === 'freehand' || selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'text' ? 'drawings' : activeLayer,
                timestamp: Date.now()
            };

            addDrawingPath(pathData);
        }

        setIsDrawing(false);
        setCurrentPath([]);
        clearCurrentDrawing();
    }, [isDrawing, currentPath, selectedTool, toolSettings, activeLayer, addDrawingPath, setWall, clearCurrentDrawing]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case 'escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setEditorMode(false);
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
                    handleTabChange('lighting');
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
                    if (selectedDrawings.length > 0) {
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
    }, [isOpen, selectedDrawings, clearDrawingSelection, handleTabChange, handleToolSelect]);

    // Auto-open editor when editor mode is enabled
    useEffect(() => {
        if (isGMMode && isEditorMode && !isOpen) {
            setIsOpen(true);
        } else if (!isEditorMode && isOpen) {
            setIsOpen(false);
        }
    }, [isGMMode, isEditorMode, isOpen]);

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
                defaultSize={{ width: 1200, height: 800 }}
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
                ref={windowRef}
                className="professional-vtt-editor"
            >
                <div className="vtt-editor-content">
                    {/* Tool Settings - Full Width */}
                    <div className="vtt-tool-settings">
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
                        {activeTab === 'lighting' && (
                            <LightingTools
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



                    {/* Layer Management - Right Side */}
                    <div className="vtt-layer-panel">
                        <h4>Layers</h4>
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
                                                {isVisible ? 'Show' : 'Hide'}
                                            </button>
                                        <button
                                            className={`layer-lock ${layer.locked ? 'locked' : 'unlocked'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLayerLock(layer.id);
                                            }}
                                            title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                                        >
                                            {layer.locked ? 'Lock' : 'Unlock'}
                                        </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="layer-actions">
                            <button className="action-btn primary" onClick={saveMapState}>
                                Save Map
                            </button>
                            <button className="action-btn secondary">
                                Load Map
                            </button>
                            <button className="action-btn danger" onClick={clearAllProfessionalData}>
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>


            </WowWindow>

            {/* Grid Overlay for Drawing */}
            {isEditorMode && (
                <div
                    ref={overlayRef}
                    className="vtt-drawing-overlay"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 })}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 100,
                        cursor: vttTools[activeTab]?.tools.find(t => t.id === selectedTool)?.cursor || 'default',
                        pointerEvents: (selectedTool === 'select' || selectedTool === 'light_select') ? 'none' : 'auto'
                    }}
                />
            )}

            {/* Hover Preview for Brush Tools */}
            {isEditorMode && hoverPreview.show && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_paint' || selectedTool === 'fog_erase') && (
                <TerrainHoverPreview
                    gridX={hoverPreview.gridX}
                    gridY={hoverPreview.gridY}
                    brushSize={hoverPreview.brushSize}
                    isEraser={selectedTool === 'terrain_erase' || selectedTool === 'fog_erase'}
                    isFog={selectedTool === 'fog_paint' || selectedTool === 'fog_erase'}
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

        </>
    );
};

export default ProfessionalVTTEditor;
