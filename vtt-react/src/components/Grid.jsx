import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import useItemStore from "../store/itemStore";
import useGridItemStore from "../store/gridItemStore";
import useInventoryStore from "../store/inventoryStore";
import useGameStore from "../store/gameStore";
import useCreatureStore from "../store/creatureStore";
import useCharacterStore from "../store/characterStore";
import useCharacterTokenStore from "../store/characterTokenStore";
import useLevelEditorStore, { TERRAIN_TYPES, WALL_TYPES } from "../store/levelEditorStore";
import useMapStore from "../store/mapStore";
import GridItem from "./grid/GridItem";
import GridContainer from "./grid/GridContainer";
import CreatureToken from "./grid/CreatureToken";
import CharacterToken from "./grid/CharacterToken";
// import TokenTester from "./grid/TokenTester"; // Removed per user request
import CanvasGridRenderer from "./grid/CanvasGridRenderer";
import ProfessionalVTTEditor from "./level-editor/ProfessionalVTTEditor";
import VTTDrawingEngine from "./level-editor/VTTDrawingEngine";
import TerrainSystem from "./level-editor/terrain/TerrainSystem";
import ObjectSystem from "./level-editor/objects/ObjectSystem";
import TileOverlay from "./level-editor/TileOverlay";
import LightSourceOverlay from "./level-editor/LightSourceOverlay";
import ShadowOverlay from "./level-editor/ShadowOverlay";
import CanvasWallSystem from "./level-editor/CanvasWallSystem";
import UnifiedContextMenu from "./level-editor/UnifiedContextMenu";
import StaticFogOverlay from "./level-editor/StaticFogOverlay";
import TextInteractionOverlay from "./grid/TextInteractionOverlay";
import { createGridSystem, getGridSystem } from "../utils/InfiniteGridSystem";
// Removed unused imports: throttle, rafThrottle

import '../styles/Grid.css';

// Character Token Preview Component
const CharacterTokenPreview = ({ mousePosition, tokenSize }) => {
    const characterData = useCharacterStore(state => ({
        name: state.name,
        lore: state.lore,
        tokenSettings: state.tokenSettings
    }));

    const getCharacterImage = () => {
        if (characterData.tokenSettings?.customIcon) {
            return characterData.tokenSettings.customIcon;
        }
        if (characterData.lore?.characterImage) {
            return characterData.lore.characterImage;
        }
        return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';
    };

    return (
        <div
            style={{
                position: 'fixed',
                left: mousePosition.x - (tokenSize / 2),
                top: mousePosition.y - (tokenSize / 2),
                width: `${tokenSize}px`,
                height: `${tokenSize}px`,
                borderRadius: '50%',
                border: `3px solid ${characterData.tokenSettings?.borderColor || '#4CAF50'}`,
                backgroundImage: `url(${getCharacterImage()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
                zIndex: 10000,
                opacity: 0.8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
        >
            {/* Character name label */}
            <div style={{
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
    );
};

export default function Grid() {
    // Get state from game store first to access zoom values
    const gameStore = useGameStore();
    const {
        gridSize,
        backgroundImage,
        backgroundImageUrl,
        backgrounds,
        activeBackgroundId,
        gridOffsetX,
        gridOffsetY,
        gridLineColor,
        gridLineThickness,
        gridMovesWithBackground,
        backgroundSticksToGrid,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        showGrid,
        showFogLayer,
        showTileLayer,
        showLightLayer,
        showShadowLayer,
        showDrawingLayer,
        showPortalLayer,
        showAtmosphericLayer,
        showCreatureLayer,
        showItemLayer,
        showGMNotesLayer,
        showCharacterLayer,
        showEffectLayer,
        showUILayer,
        showDebugLayer,
        tileSize,
        moveCameraBy,
        setPlayerZoom,
        setGridSize,
        setGridOffset,
        gridAlignmentStep,
        setGridAlignmentStep,
        gridAlignmentRectangles,
        addGridAlignmentRectangle,
        clearGridAlignmentRectangles
    } = gameStore;

    // Calculate effective zoom early (GM zoom * player zoom)
    const effectiveZoom = zoomLevel * playerZoom;

    // Grid rendering mode - use canvas for better performance, especially at low zoom
    const [useCanvasGrid] = useState(true);

    // Force canvas rendering at low zoom levels for better performance
    const shouldUseCanvas = useCanvasGrid || effectiveZoom < 0.5;

    // Smooth zoom state (removed unused variables)
    const zoomAnimationRef = useRef(null);

    // Simple panning state - no momentum, just direct response
    const [isDraggingCamera, setIsDraggingCamera] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    // Track when items are being dragged to enable pointer events
    const [isDraggingItem, setIsDraggingItem] = useState(false);

    // Additional state from game store (continuing from earlier destructuring)
    const {
        isGridAlignmentMode,
        isBackgroundManipulationMode,
        isGMMode,
        playerZoomIn,
        playerZoomOut,
        updateBackground
    } = gameStore;

    // Initialize viewport size state first (needed by instantZoom function)
    const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // ANIMATION FUNCTIONS - DEFINED AFTER VIEWPORT SIZE STATE

    // Instant zoom function for true mouse-centered zooming
    const instantZoom = useCallback((targetZoom, mouseX, mouseY) => {
        // Cancel any ongoing zoom animation
        if (zoomAnimationRef.current) {
            cancelAnimationFrame(zoomAnimationRef.current);
            setIsZooming(false);
        }

        const startZoom = playerZoom;
        const startEffectiveZoom = zoomLevel * startZoom;
        const targetEffectiveZoom = zoomLevel * targetZoom;

        // Get viewport dimensions for proper coordinate conversion
        const viewportWidth = viewportSize.width;
        const viewportHeight = viewportSize.height;

        // Calculate the world position that the mouse is pointing to BEFORE zoom
        // Convert mouse position to world coordinates using the current zoom
        const worldPointX = ((mouseX - viewportWidth / 2) / startEffectiveZoom) + cameraX;
        const worldPointY = ((mouseY - viewportHeight / 2) / startEffectiveZoom) + cameraY;

        // Apply the new zoom instantly
        useGameStore.getState().setPlayerZoom(targetZoom);

        // Calculate where the camera needs to be so that the same world point
        // is still under the mouse cursor after the zoom change
        const newCameraX = worldPointX - ((mouseX - viewportWidth / 2) / targetEffectiveZoom);
        const newCameraY = worldPointY - ((mouseY - viewportHeight / 2) / targetEffectiveZoom);

        // Calculate the camera movement needed
        const deltaX = newCameraX - cameraX;
        const deltaY = newCameraY - cameraY;

        // Move camera to keep the exact world point under the mouse
        moveCameraBy(deltaX, deltaY);
    }, [playerZoom, cameraX, cameraY, zoomLevel, moveCameraBy, viewportSize]);

    // Calculate token size for character token preview (same as CreatureToken)
    const tokenSize = useMemo(() => {
        const baseSize = gridSize * 0.8; // 80% of tile size for some padding
        return baseSize * effectiveZoom;
    }, [gridSize, effectiveZoom]);

    // Initialize grid system
    const gridSystem = useMemo(() => createGridSystem(useGameStore), []);

    // Make gameStore, gridSystem, and levelEditorStore available globally for components that need it
    // This is a workaround for components that don't have direct access to the store
    window.gameStore = useGameStore;
    window.gridSystem = gridSystem;
    window.useLevelEditorStore = useLevelEditorStore;

    // tileSize is already available from gameStore destructuring above
    const [hoveredTile, setHoveredTile] = useState(null);
    const [isDraggingCreature, setIsDraggingCreature] = useState(false);
    const [draggedCreatureId, setDraggedCreatureId] = useState(null);
    const [isDraggingCharacterToken, setIsDraggingCharacterToken] = useState(false);
    const gridRef = useRef(null);

    // Grid alignment dragging state
    const [isGridAlignmentDragging, setIsGridAlignmentDragging] = useState(false);
    const [gridAlignmentStart, setGridAlignmentStart] = useState({ x: 0, y: 0 });
    const [gridAlignmentEnd, setGridAlignmentEnd] = useState({ x: 0, y: 0 });

    // Background manipulation state
    const [isDraggingBackground, setIsDraggingBackground] = useState(false);
    const [isResizingBackground, setIsResizingBackground] = useState(false);
    const [isRotatingBackground, setIsRotatingBackground] = useState(false);
    const [backgroundDragStart, setBackgroundDragStart] = useState({ x: 0, y: 0 });
    const [backgroundResizeStart, setBackgroundResizeStart] = useState({ x: 0, y: 0, scale: 1 });
    const [backgroundRotateStart, setBackgroundRotateStart] = useState({ x: 0, y: 0, rotation: 0 });
    const [resizeHandle, setResizeHandle] = useState(null);

    // Tooltip state for grid tiles
    const [hoveredGridTile, setHoveredGridTile] = useState(null);
    const [showGridTooltip, setShowGridTooltip] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);

    // State for wall tooltips and interactions
    const [hoveredWall, setHoveredWall] = useState(null);
    const [showWallTooltip, setShowWallTooltip] = useState(false);
    const [wallTooltipPosition, setWallTooltipPosition] = useState({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const wallHoverTimeoutRef = useRef(null);

    // Get grid items from the store
    const gridItems = useGridItemStore(state => state.gridItems);
    const addItemToGrid = useGridItemStore(state => state.addItemToGrid);
    const clearGridItems = () => useGridItemStore.setState({ gridItems: [] });

    // Make clearGridItems available globally for debugging
    React.useEffect(() => {
        window.clearGridItems = clearGridItems;
        window.debugGridItems = () => {
            const items = useGridItemStore.getState().gridItems;
            return items;
        };
    }, [clearGridItems]);

    // Debug grid items state
    useEffect(() => {
        console.log('Grid items changed:', gridItems.length, 'items');
        gridItems.forEach((item, index) => {
            console.log(`Grid item ${index}:`, {
                id: item.id,
                itemId: item.itemId,
                name: item.name,
                type: item.type,
                hasOriginalItemStoreId: !!item.originalItemStoreId,
                addedAt: item.addedAt
            });
        });
    }, [gridItems]);

    // Force re-render when grid items are updated
    const [forceRenderKey, setForceRenderKey] = useState(0);
    useEffect(() => {
        const handleGridItemsUpdated = () => {
            console.log('Force re-rendering Grid due to grid items update');
            setForceRenderKey(prev => prev + 1);
        };

        window.addEventListener('grid-items-updated', handleGridItemsUpdated);
        return () => window.removeEventListener('grid-items-updated', handleGridItemsUpdated);
    }, []);





    // Get creature tokens from the store
    const { tokens, creatures, addToken, removeToken } = useCreatureStore();

    // Get character tokens from the store
    const {
        characterTokens,
        addCharacterToken,
        updateCharacterTokenPosition,
        removeCharacterToken
    } = useCharacterTokenStore();

    // Get level editor state
    const {
        isEditorMode,
        activeTool,
        activeTerrainType,
        activeObjectType,
        activeDndElement,
        brushSize,
        setTerrain,
        getTerrain,
        clearTerrain,
        addEnvironmentalObject,
        addDndElement,
        setFogOfWar,
        getFogOfWar,
        environmentalObjects,
        dndElements,
        wallData,
        showWallLayer,
        removeWall,
        updateWall,
        drawingLayers
    } = useLevelEditorStore();

    // Get map store for initialization
    const { initializeWithCurrentState } = useMapStore();

    // Generate grid tiles using the infinite grid system with optimized updates
    const [gridTiles, setGridTiles] = useState([]);

    // Debounced camera position for grid updates to reduce lag during movement
    const [debouncedCameraX, setDebouncedCameraX] = useState(cameraX);
    const [debouncedCameraY, setDebouncedCameraY] = useState(cameraY);
    const [debouncedZoom, setDebouncedZoom] = useState(effectiveZoom);

    // Debounce camera position updates
    useEffect(() => {
        const debounceDelay = effectiveZoom < 0.3 ? 150 : effectiveZoom < 0.5 ? 100 : effectiveZoom < 1.0 ? 50 : 25;

        const timeoutId = setTimeout(() => {
            setDebouncedCameraX(cameraX);
            setDebouncedCameraY(cameraY);
            setDebouncedZoom(effectiveZoom);
        }, debounceDelay);

        return () => clearTimeout(timeoutId);
    }, [cameraX, cameraY, effectiveZoom]);

    // Throttled grid tile generation for better performance during movement
    useEffect(() => {
        if (!showGrid) {
            setGridTiles([]);
            return;
        }

        // Use debounced camera position for grid tile generation
        const updateTiles = () => {
            const tiles = gridSystem.generateGridTiles(viewportSize.width, viewportSize.height);
            setGridTiles(tiles);
        };

        // Immediate update for non-camera changes, throttled for camera changes
        const isViewportChange = viewportSize.width !== 0 && viewportSize.height !== 0;
        if (isViewportChange) {
            updateTiles();
        }

    }, [
        gridSystem,
        viewportSize.width,
        viewportSize.height,
        debouncedCameraX,
        debouncedCameraY,
        debouncedZoom,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        showGrid,

    ]);

    // Generate wall decorations for grid tiles - walls are attached to tiles, not positioned independently
    const wallDecorations = useMemo(() => {
        if (!showWallLayer || !wallData || Object.keys(wallData).length === 0) {
            return new Map();
        }

        const decorations = new Map();

        // Process each wall and attach it to the appropriate grid tiles
        Object.entries(wallData).forEach(([wallKey, wallData]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallData === 'string' ? wallData : wallData.type;
            const wallState = typeof wallData === 'object' ? wallData.state : 'default';
            const wallId = typeof wallData === 'object' ? wallData.id : null;

            const wallTypeData = WALL_TYPES[wallType];
            if (!wallTypeData) return;

            // Parse wall coordinates from key: "x1,y1,x2,y2"
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            const wallDecoration = {
                key: wallKey,
                type: wallTypeData,
                state: wallState,
                id: wallId,
                isVertical: x1 === x2,
                isHorizontal: y1 === y2,
                gridCoords: { x1, y1, x2, y2 }
            };

            // Attach wall to the appropriate tile(s)
            if (wallDecoration.isVertical) {
                // Vertical wall - attach to tiles on both sides
                const leftTileKey = `${x1-1},${y1}`;
                const rightTileKey = `${x1},${y1}`;

                if (!decorations.has(leftTileKey)) decorations.set(leftTileKey, []);
                if (!decorations.has(rightTileKey)) decorations.set(rightTileKey, []);

                decorations.get(leftTileKey).push({ ...wallDecoration, side: 'right' });
                decorations.get(rightTileKey).push({ ...wallDecoration, side: 'left' });
            } else if (wallDecoration.isHorizontal) {
                // Horizontal wall - attach to tiles on both sides
                const topTileKey = `${x1},${y1-1}`;
                const bottomTileKey = `${x1},${y1}`;

                if (!decorations.has(topTileKey)) decorations.set(topTileKey, []);
                if (!decorations.has(bottomTileKey)) decorations.set(bottomTileKey, []);

                decorations.get(topTileKey).push({ ...wallDecoration, side: 'bottom' });
                decorations.get(bottomTileKey).push({ ...wallDecoration, side: 'top' });
            }
        });

        return decorations;
    }, [
        wallData,
        showWallLayer
    ]);

    // Initialize map store with current state on first load
    useEffect(() => {
        // Initialize the map store with the current game state
        const levelEditorData = useLevelEditorStore.getState();
        initializeWithCurrentState(gameStore, levelEditorData);
    }, []); // Only run once on mount

    // Update viewport size on window resize and when editor mode changes
    useEffect(() => {
        const updateViewportSize = () => {
            try {
                // Store current camera position before viewport update
                const currentState = useGameStore.getState();
                const preservedCameraX = currentState.cameraX;
                const preservedCameraY = currentState.cameraY;
                const preservedGridOffsetX = currentState.gridOffsetX;
                const preservedGridOffsetY = currentState.gridOffsetY;



                // Update viewport size state
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                setViewportSize({ width: viewport.width, height: viewport.height });

                // Immediately restore camera position and grid offset to prevent shifting
                // Use multiple frames to ensure the update is complete
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const newState = useGameStore.getState();
                        newState.setCameraPosition(preservedCameraX, preservedCameraY);
                        newState.setGridOffset(preservedGridOffsetX, preservedGridOffsetY);


                    });
                });

            } catch (error) {
                // Failed to update viewport size with grid preservation

                // Fallback to basic viewport update
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                setViewportSize({ width: viewport.width, height: viewport.height });
            }
        };

        updateViewportSize();
        window.addEventListener("resize", updateViewportSize);

        return () => {
            window.removeEventListener("resize", updateViewportSize);
        };
    }, []);

    // Separate effect to handle editor mode changes immediately
    useEffect(() => {


        // Update viewport immediately when editor mode changes
        const updateViewportForEditor = () => {
            try {
                // Store current camera position before viewport update
                const currentState = useGameStore.getState();
                const preservedCameraX = currentState.cameraX;
                const preservedCameraY = currentState.cameraY;
                const preservedGridOffsetX = currentState.gridOffsetX;
                const preservedGridOffsetY = currentState.gridOffsetY;



                // Update viewport size state
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                setViewportSize({ width: viewport.width, height: viewport.height });

                // Immediately restore camera position and grid offset to prevent shifting
                // Use multiple frames to ensure the update is complete
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const newState = useGameStore.getState();
                        newState.setCameraPosition(preservedCameraX, preservedCameraY);
                        newState.setGridOffset(preservedGridOffsetX, preservedGridOffsetY);


                    });
                });

            } catch (error) {
                // Failed to update viewport for editor mode change
            }
        };

        // Small delay to allow the editor window to render
        const timeoutId = setTimeout(updateViewportForEditor, 50);

        return () => clearTimeout(timeoutId);
    }, [isEditorMode]);

    // Listen for character token creation events
    useEffect(() => {
        const handleCreateCharacterToken = (event) => {
            console.log('🎭 Received createCharacterToken event:', event.detail);
            const { character, isSelf } = event.detail;
            if (isSelf) {
                console.log('🎭 Starting character token placement mode');
                // Start character token dragging mode - token will follow mouse until clicked
                setIsDraggingCharacterToken(true);
            } else {
                console.log('🎭 Not self character, ignoring token creation');
            }
        };

        window.addEventListener('createCharacterToken', handleCreateCharacterToken);
        return () => window.removeEventListener('createCharacterToken', handleCreateCharacterToken);
    }, []);

    // Listen for escape key to cancel character token placement
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isDraggingCharacterToken) {
                setIsDraggingCharacterToken(false);
            }
        };

        if (isDraggingCharacterToken) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isDraggingCharacterToken]);

    // Background manipulation handlers
    const handleBackgroundMouseDown = useCallback((e, backgroundId) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingBackground(true);
        const rect = gridRef.current?.getBoundingClientRect();
        if (rect) {
            setBackgroundDragStart({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    }, []);

    const handleResizeMouseDown = useCallback((e, backgroundId, handle) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizingBackground(true);
        setResizeHandle(handle);
        const rect = gridRef.current?.getBoundingClientRect();
        const activeBackground = backgrounds.find(bg => bg.id === backgroundId);
        if (rect && activeBackground) {
            setBackgroundResizeStart({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                scale: activeBackground.scale || 1
            });
        }
    }, [backgrounds]);

    const handleRotateMouseDown = useCallback((e, backgroundId) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRotatingBackground(true);
        const rect = gridRef.current?.getBoundingClientRect();
        const activeBackground = backgrounds.find(bg => bg.id === backgroundId);
        if (rect && activeBackground) {
            setBackgroundRotateStart({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                rotation: activeBackground.rotation || 0
            });
        }
    }, [backgrounds]);

    // Camera controls, grid alignment, and background manipulation
    const handleMouseDown = useCallback((e) => {
        // Check if the click is on a manipulation handle - if so, ignore it here
        if (e.target.dataset && e.target.dataset.manipulationHandle) {
            return; // Let the handle's own event handler deal with it
        }

        // Check if the click is on a grid item - if so, ignore it here
        if (e.target.classList.contains('grid-item-orb')) {
            console.log('Grid handleMouseDown: ignoring click on grid item');
            return; // Let the GridItem's own event handler deal with it
        }

        // Check if the click is on a token - if so, ignore it here
        if (e.target.classList.contains('creature-token') ||
            e.target.classList.contains('character-token') ||
            e.target.closest('.creature-token') ||
            e.target.closest('.character-token')) {
            console.log('Grid handleMouseDown: ignoring click on token');
            return; // Let the token's own event handler deal with it
        }

        if (isGridAlignmentMode && e.button === 0) {
            // Grid alignment mode - start dragging to define grid area
            e.preventDefault();
            setIsGridAlignmentDragging(true);
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect) {
                const startPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                setGridAlignmentStart(startPos);
                setGridAlignmentEnd(startPos);
            }
        } else if (isBackgroundManipulationMode && e.button === 0) {
            // Background manipulation mode
            e.preventDefault();
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect) {
                const mousePos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                if (e.shiftKey) {
                    // Shift+click for resizing
                    setIsResizingBackground(true);
                    const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
                    setBackgroundResizeStart({
                        x: mousePos.x,
                        y: mousePos.y,
                        scale: activeBackground?.scale || 1
                    });
                } else {
                    // Regular click for moving
                    setIsDraggingBackground(true);
                    setBackgroundDragStart(mousePos);
                }
            }
        } else if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left click
            e.preventDefault();
            setIsDraggingCamera(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    }, [isGridAlignmentMode, isBackgroundManipulationMode, backgrounds, activeBackgroundId]);

    const handleMouseMove = useCallback((e) => {
        if (isGridAlignmentDragging) {
            // Update grid alignment end position
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect) {
                const endPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                setGridAlignmentEnd(endPos);
            }
        } else if (isDraggingBackground) {
            // Move background
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect && activeBackgroundId) {
                const currentPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                const deltaX = (currentPos.x - backgroundDragStart.x) / effectiveZoom;
                const deltaY = (currentPos.y - backgroundDragStart.y) / effectiveZoom;

                const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
                if (activeBackground) {
                    updateBackground(activeBackgroundId, {
                        position: {
                            x: activeBackground.position.x + deltaX,
                            y: activeBackground.position.y + deltaY
                        }
                    });
                }

                setBackgroundDragStart(currentPos);
            }
        } else if (isResizingBackground) {
            // Resize background based on corner handle movement
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect && activeBackgroundId && resizeHandle) {
                const currentPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                // Calculate movement from start position
                const deltaX = currentPos.x - backgroundResizeStart.x;
                const deltaY = currentPos.y - backgroundResizeStart.y;

                // Determine scale change based on which corner is being dragged
                // Much less sensitive - need to drag further for changes
                let scaleChange = 0;

                switch (resizeHandle) {
                    case 'nw': // Top-left corner
                        scaleChange = -(deltaX + deltaY) / 800; // Moving away = bigger (4x less sensitive)
                        break;
                    case 'ne': // Top-right corner
                        scaleChange = (deltaX - deltaY) / 800; // Moving right/up = bigger
                        break;
                    case 'sw': // Bottom-left corner
                        scaleChange = (-deltaX + deltaY) / 800; // Moving left/down = bigger
                        break;
                    case 'se': // Bottom-right corner
                        scaleChange = (deltaX + deltaY) / 800; // Moving away = bigger
                        break;
                    default:
                        scaleChange = 0;
                }

                // Apply scale change
                const newScale = Math.max(0.1, Math.min(5.0, backgroundResizeStart.scale + scaleChange));
                updateBackground(activeBackgroundId, { scale: newScale });
            }
        } else if (isRotatingBackground) {
            // Rotate background
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect && activeBackgroundId) {
                const currentPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };

                // Get the background center position on screen
                const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
                if (activeBackground) {
                    const viewportCenterX = viewportSize.width / 2;
                    const viewportCenterY = viewportSize.height / 2;
                    const backgroundCenterX = viewportCenterX + (activeBackground.position.x - cameraX) * effectiveZoom;
                    const backgroundCenterY = viewportCenterY + (activeBackground.position.y - cameraY) * effectiveZoom;

                    const startAngle = Math.atan2(
                        backgroundRotateStart.y - backgroundCenterY,
                        backgroundRotateStart.x - backgroundCenterX
                    );
                    const currentAngle = Math.atan2(
                        currentPos.y - backgroundCenterY,
                        currentPos.x - backgroundCenterX
                    );

                    const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
                    const newRotation = (backgroundRotateStart.rotation + deltaAngle) % 360;

                    updateBackground(activeBackgroundId, { rotation: newRotation });
                }
            }
        } else if (isDraggingCamera) {
            // Simple, direct camera movement - no momentum tracking
            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;

            // Move camera in opposite direction to simulate panning (use effective zoom)
            moveCameraBy(-deltaX / effectiveZoom, -deltaY / effectiveZoom);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }

        // Update mouse position for character token placement preview
        if (isDraggingCharacterToken) {
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    }, [
        isGridAlignmentDragging,
        isDraggingBackground,
        isResizingBackground,
        isRotatingBackground,
        isDraggingCamera,
        isDraggingCharacterToken,
        lastMousePos,
        moveCameraBy,
        effectiveZoom,
        activeBackgroundId,
        backgrounds,
        updateBackground,
        backgroundDragStart,
        backgroundResizeStart,
        backgroundRotateStart,
        viewportSize,
        cameraX,
        cameraY
    ]);

    const handleMouseUp = useCallback(() => {
        if (isGridAlignmentDragging) {
            // Calculate rectangle dimensions
            const width = Math.abs(gridAlignmentEnd.x - gridAlignmentStart.x);
            const height = Math.abs(gridAlignmentEnd.y - gridAlignmentStart.y);

            if (width > 10 && height > 10) { // Minimum size check
                // Store the rectangle for multi-step alignment
                const rectangle = {
                    start: gridAlignmentStart,
                    end: gridAlignmentEnd,
                    width,
                    height
                };

                addGridAlignmentRectangle(rectangle);

                // Check if we have enough rectangles to proceed
                if (gridAlignmentRectangles.length === 0) {
                    // First rectangle - ask for second one
                    setGridAlignmentStep(2);
                } else {
                    // Second rectangle - calculate grid alignment using both rectangles
                    const firstRect = gridAlignmentRectangles[0];
                    const secondRect = rectangle;

                    // Calculate average grid size from both rectangles
                    const firstGridSize = Math.min(firstRect.width, firstRect.height) / effectiveZoom;
                    const secondGridSize = Math.min(secondRect.width, secondRect.height) / effectiveZoom;
                    const avgGridSize = (firstGridSize + secondGridSize) / 2;

                    // Calculate world positions for both rectangles
                    const firstWorld = gridSystem.screenToWorld(firstRect.start.x, firstRect.start.y);
                    const secondWorld = gridSystem.screenToWorld(secondRect.start.x, secondRect.start.y);

                    // Calculate what the offset should be for each rectangle to align to grid
                    const firstOffsetX = firstWorld.x % avgGridSize;
                    const firstOffsetY = firstWorld.y % avgGridSize;
                    const secondOffsetX = secondWorld.x % avgGridSize;
                    const secondOffsetY = secondWorld.y % avgGridSize;

                    // Use the average of both offsets for better alignment
                    const avgOffsetX = (firstOffsetX + secondOffsetX) / 2;
                    const avgOffsetY = (firstOffsetY + secondOffsetY) / 2;

                    // Apply the new grid settings
                    setGridSize(avgGridSize);
                    setGridOffset(avgOffsetX, avgOffsetY);

                    // Exit grid alignment mode
                    clearGridAlignmentRectangles();
                    setGridAlignmentStep(0);
                    useGameStore.getState().setGridAlignmentMode(false);
                }
            }

            setIsGridAlignmentDragging(false);
            setGridAlignmentStart({ x: 0, y: 0 });
            setGridAlignmentEnd({ x: 0, y: 0 });
        }

        // Reset background manipulation states
        setIsDraggingBackground(false);
        setIsResizingBackground(false);
        setIsRotatingBackground(false);
        setBackgroundDragStart({ x: 0, y: 0 });
        setBackgroundResizeStart({ x: 0, y: 0, scale: 1 });
        setBackgroundRotateStart({ x: 0, y: 0, rotation: 0 });
        setResizeHandle(null);

        // Simply stop camera dragging - no momentum
        setIsDraggingCamera(false);
    }, [
        isGridAlignmentDragging,
        gridAlignmentStart,
        gridAlignmentEnd,
        gridAlignmentRectangles,
        gridSystem,
        setGridSize,
        setGridOffset,
        effectiveZoom,
        addGridAlignmentRectangle,
        clearGridAlignmentRectangles,
        setGridAlignmentStep,
        isDraggingCamera
    ]);

    // Real-time wheel handler for smooth zoom and interaction
    const handleWheelEvent = useCallback((e) => {
        // In editor mode, let the level editor overlay handle all wheel events
        if (isEditorMode) {
            return; // Don't handle wheel events in editor mode
        }

        // Background manipulation mode - scale background with scroll wheel
        if (isBackgroundManipulationMode && activeBackgroundId) {
            e.preventDefault();
            e.stopPropagation();

            const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
            if (activeBackground) {
                const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
                const newScale = Math.max(0.1, Math.min(5.0, activeBackground.scale * scaleFactor));
                updateBackground(activeBackgroundId, { scale: newScale });
            }
            return;
        }

        // Only handle player zoom if Ctrl is held down
        if (e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            // Get mouse position for zoom-to-cursor functionality
            const rect = gridRef.current?.getBoundingClientRect();
            if (rect) {
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Calculate target zoom with smooth scaling
                const zoomFactor = 1.15; // Slightly more aggressive zoom for better feel
                const currentZoom = playerZoom;
                const targetZoom = e.deltaY < 0 ?
                    Math.min(currentZoom * zoomFactor, gameStore.maxPlayerZoom) :
                    Math.max(currentZoom / zoomFactor, gameStore.minPlayerZoom);

                // Apply instant zoom if zoom actually changes
                if (Math.abs(targetZoom - currentZoom) > 0.001) {
                    instantZoom(targetZoom, mouseX, mouseY);
                }
            }

            return false;
        }

        // If Ctrl is not held down, prevent default to avoid page scrolling
        // but don't handle the event
        e.preventDefault();
    }, [
        playerZoom,
        gameStore,
        instantZoom,
        isEditorMode,
        isBackgroundManipulationMode,
        activeBackgroundId,
        backgrounds,
        updateBackground
    ]);

    // Handle wheel events for player zoom navigation and background scaling
    const handleWheel = useCallback((e) => {
        handleWheelEvent(e);
    }, [handleWheelEvent]);

    // Add mouse event listeners
    useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        gridElement.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // Add wheel event listener to prevent default scroll behavior
        gridElement.addEventListener('wheel', handleWheel, { passive: false });
        // Also add global wheel listener to prevent page scrolling
        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            gridElement.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            gridElement.removeEventListener('wheel', handleWheel);
            document.removeEventListener('wheel', handleWheel);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {

        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Track item dragging to enable pointer events on grid overlay
    useEffect(() => {
        const handleDragStart = (e) => {
            // Check if this is an item drag by looking at the source element
            const target = e.target;
            const isItemDrag = target.closest('.item-card') ||
                              target.closest('.inventory-item') ||
                              target.closest('.container-item') ||
                              target.draggable;

            if (isItemDrag) {
                setIsDraggingItem(true);
            }
        };

        const handleDragEnd = (e) => {
            setIsDraggingItem(false);
        };

        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragend', handleDragEnd);

        return () => {
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('dragend', handleDragEnd);
        };
    }, []);



    // Cleanup timeout and animations on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (wallHoverTimeoutRef.current) {
                clearTimeout(wallHoverTimeoutRef.current);
            }
            if (zoomAnimationRef.current) {
                cancelAnimationFrame(zoomAnimationRef.current);
            }
        };
    }, []);

    // Handle drag over for grid tiles
    const handleDragOver = (e, tile) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setHoveredTile(tile);
    };

    // Handle drag leave for grid tiles
    const handleDragLeave = () => {
        setHoveredTile(null);
    };

    // Handle mouse enter for grid tile tooltips
    const handleGridTileMouseEnter = useCallback((e, tile) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setHoveredGridTile(tile);
        setShowGridTooltip(false);

        // Clear existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Set new timeout for tooltip
        hoverTimeoutRef.current = setTimeout(() => {
            setShowGridTooltip(true);
        }, 1500); // 1.5 second delay
    }, []);

    // Handle mouse leave for grid tile tooltips
    const handleGridTileMouseLeave = useCallback(() => {
        setHoveredGridTile(null);
        setShowGridTooltip(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    }, []);

    // Handle mouse move for grid tile tooltips
    const handleGridTileMouseMove = useCallback((e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    }, []);

    // Wall interaction handlers
    const handleWallMouseEnter = useCallback((wall, event) => {
        setHoveredWall(wall);
        setWallTooltipPosition({ x: event.clientX, y: event.clientY });
        setShowWallTooltip(false);

        // Clear existing timeout
        if (wallHoverTimeoutRef.current) {
            clearTimeout(wallHoverTimeoutRef.current);
        }

        // Set new timeout for tooltip
        wallHoverTimeoutRef.current = setTimeout(() => {
            setShowWallTooltip(true);
        }, 1500); // 1.5 second delay
    }, []);

    const handleWallMouseLeave = useCallback(() => {
        setHoveredWall(null);
        setShowWallTooltip(false);
        if (wallHoverTimeoutRef.current) {
            clearTimeout(wallHoverTimeoutRef.current);
        }
    }, []);

    const handleWallRightClick = useCallback((wall, event) => {
        if (!isEditorMode) return;

        event.preventDefault();
        setContextMenu(wall);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setShowContextMenu(true);
    }, [isEditorMode]);

    const handleWallClick = useCallback((wall, event) => {
        if (!wall.type.interactive || !wall.type.states) return;

        event.stopPropagation();

        const currentState = wall.state || wall.type.states[0];
        const currentIndex = wall.type.states.indexOf(currentState);
        const nextIndex = (currentIndex + 1) % wall.type.states.length;
        const nextState = wall.type.states[nextIndex];

        const { x1, y1, x2, y2 } = wall.gridCoords;
        updateWall(x1, y1, x2, y2, { state: nextState });
    }, []);

    const handleRemoveWall = useCallback(() => {
        if (contextMenu) {
            const [x1, y1, x2, y2] = contextMenu.key.split(',').map(Number);
            removeWall(x1, y1, x2, y2);
            setContextMenu(null);
            setShowContextMenu(false);
        }
    }, [contextMenu]);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
        setShowContextMenu(false);
    }, []);

    // Get grid coordinate from mouse event using the grid system
    const getGridCoordinateFromMouse = (e) => {
        return gridSystem.getGridCoordinateFromEvent(e, gridRef.current);
    };

    // Set up drag and drop event listeners for creatures
    useEffect(() => {
        // Handle drag start event
        const handleDragStart = (e) => {
            // Check if this is a creature drag by looking at the dataTransfer types
            const isCreatureDrag = e.dataTransfer.types.includes('creature/id');


            // Only set isDraggingCreature for actual creature drags
            if (isCreatureDrag) {
                setIsDraggingCreature(true);
            }
        };

        // Handle drag end event
        const handleDragEnd = () => {
            setIsDraggingCreature(false);
            setDraggedCreatureId(null);
        };

        // Handle drop event for document-level drops
        const handleDocumentDrop = (e) => {
            // Check if this is an item drop (not just creature drops)
            const dataText = e.dataTransfer.getData('text/plain');

            // Only handle creature drops here, let canvas handle item drops
            if (!isDraggingCreature) {
                return;
            }

            e.preventDefault();

            try {
                // Try to get creature ID directly
                const creatureId = e.dataTransfer.getData('creature/id');
                if (creatureId) {
                    // Use the infinite grid system to get proper coordinates
                    const gridCoords = gridSystem.getGridCoordinateFromEvent(e, gridRef.current);
                    const worldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);
                    // Add the creature token to the grid
                    addToken(creatureId, { x: worldPos.x, y: worldPos.y });
                } else {
                    // If no direct creature ID, check for JSON data
                    const dataText = e.dataTransfer.getData('text/plain');
                    if (dataText && dataText.trim() !== '') {
                        const data = JSON.parse(dataText);
                        if (data && data.type === 'creature' && data.id) {
                            // Use the infinite grid system to get proper coordinates
                            const gridCoords = gridSystem.getGridCoordinateFromEvent(e, gridRef.current);
                            const worldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);
                            // Add the creature token to the grid
                            addToken(data.id, { x: worldPos.x, y: worldPos.y });
                        }
                    }
                }
            } catch (error) {
                // Error handling document-level drop
            }

            setIsDraggingCreature(false);
            setDraggedCreatureId(null);
        };

        // Handle drag over event for document
        const handleDocumentDragOver = (e) => {
            // Only handle creature drags at document level


            if (isDraggingCreature) {
                e.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragend', handleDragEnd);
        document.addEventListener('drop', handleDocumentDrop);
        document.addEventListener('dragover', handleDocumentDragOver);

        return () => {
            // Remove event listeners
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('dragend', handleDragEnd);
            document.removeEventListener('drop', handleDocumentDrop);
            document.removeEventListener('dragover', handleDocumentDragOver);
        };
    }, [isDraggingCreature, addToken, tileSize]);

    // Handle removing a token
    const handleRemoveToken = (tokenId) => {
        removeToken(tokenId);
    };

    // Handle removing a character token
    const handleRemoveCharacterToken = (tokenId) => {
        removeCharacterToken(tokenId);
    };



    // Handle character inspection from token
    const handleCharacterTokenInspect = (characterData, isSelf) => {
        // Dispatch event to open character sheet
        const event = new KeyboardEvent('keydown', {
            key: 'C',
            code: 'KeyC',
            keyCode: 67,
            which: 67,
            bubbles: true
        });
        window.dispatchEvent(event);
    };

    // Helper function to check if there's a GM notes object at the clicked position
    const getGMNotesObjectAtPosition = (screenX, screenY) => {
        if (!isEditorMode || !environmentalObjects) return null;

        // Find GM notes objects at the clicked position
        for (const obj of environmentalObjects) {
            if (obj.type !== 'gmNotes') continue;

            // Calculate object screen position
            let screenPos;
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Use the same coordinate system as ObjectSystem
                try {
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    // Fallback calculation
                    const canvasWidth = window.innerWidth;
                    const canvasHeight = window.innerHeight;
                    const screenObjX = (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2;
                    const screenObjY = (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2;
                    screenPos = { x: screenObjX, y: screenObjY };
                }
            } else {
                // Grid-aligned objects
                screenPos = gridSystem.gridToScreen(obj.gridX || 0, obj.gridY || 0);
            }

            // Check if click is within object bounds (same logic as ObjectSystem)
            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = 0.8 * tileSize * scale; // GM notes size is 0.8x0.8
            const objHeight = 0.8 * tileSize * scale;

            const padding = Math.max(10, tileSize * 0.1);
            const left = screenPos.x - objWidth / 2 - padding;
            const right = screenPos.x + objWidth / 2 + padding;
            const top = screenPos.y - objHeight / 2 - padding;
            const bottom = screenPos.y + objHeight / 2 + padding;

            if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
                return obj;
            }
        }
        return null;
    };

    // Handle click for character token placement
    const handleGridClick = (e, tile) => {
        // For context menu events, check if there's a GM notes object at the clicked position
        if (e.type === 'contextmenu') {
            // Convert event coordinates to screen coordinates relative to the grid
            const gridElement = gridRef.current;
            // Allow GM notes access in both editor mode AND GM mode
            if (gridElement && (isEditorMode || isGMMode)) {
                const rect = gridElement.getBoundingClientRect();
                const screenX = e.clientX - rect.left;
                const screenY = e.clientY - rect.top;

                const gmNotesObject = getGMNotesObjectAtPosition(screenX, screenY);
                if (gmNotesObject) {
                    console.log('🎯 Grid: Found GM notes object, letting ObjectSystem handle it');
                    // There's a GM notes object here, let the ObjectSystem handle it
                    // Don't prevent default - let the event bubble up to ObjectSystem
                    return;
                }
            }

            // No GM notes object, prevent default browser context menu
            e.preventDefault();
            e.stopPropagation();
        }

        // If we're in character token placement mode, place the token
        if (isDraggingCharacterToken) {
            console.log('🎭 Character token placement mode - handling click:', {
                eventType: e.type,
                button: e.button,
                tile: tile,
                gridX: tile?.gridX,
                gridY: tile?.gridY
            });

            e.preventDefault();
            e.stopPropagation();

            // Right-click cancels placement
            if (e.button === 2) {
                console.log('🎭 Canceling character token placement (right-click)');
                setIsDraggingCharacterToken(false);
                return;
            }

            // Left-click places the token
            if (e.button === 0) {
                console.log('🎭 Placing character token (left-click)');

                // Check if tile data is valid
                if (!tile || tile.gridX === undefined || tile.gridY === undefined) {
                    console.error('🎭 Invalid tile data for character token placement:', tile);
                    return;
                }

                // Use the infinite grid system to get proper world coordinates
                const worldPos = gridSystem.gridToWorld(tile.gridX, tile.gridY);
                console.log('🎭 World position for character token:', worldPos);

                // Place the character token
                addCharacterToken(worldPos);
                console.log('🎭 Character token placed successfully');

                // Exit placement mode
                setIsDraggingCharacterToken(false);
            }
            return;
        }
    };

    // Handle drop for grid tiles
    const handleDrop = (e, tile) => {
        e.preventDefault();
        setHoveredTile(null);

        // Drop event on tile

        try {
            // Check for portal template drops first
            const portalTemplateData = e.dataTransfer.getData('portal/template');
            if (portalTemplateData) {
                const template = JSON.parse(portalTemplateData);

                // Import level editor store to create portal as D&D element
                const { addDndElement } = useLevelEditorStore.getState();

                // Create portal as D&D element (not map portal) so it appears on the grid
                const portalData = {
                    type: 'portal',
                    position: { x: tile.gridX, y: tile.gridY },
                    properties: {
                        destinationMapId: template.destinationMapId,
                        destinationPosition: template.destinationPosition || { x: 0, y: 0 },
                        portalName: template.name,
                        isActive: template.isActive,
                        color: template.color,
                        description: template.description
                    }
                };

                // Add as D&D element so it renders on the grid like other objects
                addDndElement(portalData);
                return;
            }

            const dataText = e.dataTransfer.getData('text/plain');

            // Check if dataText is empty or undefined before parsing
            if (!dataText || dataText.trim() === '') {
                return;
            }

            // Parse the JSON data
            const data = JSON.parse(dataText);

            // Handle creature drops
            if (data.type === 'creature') {
                // Use the infinite grid system to get proper world coordinates from the tile
                const worldPos = gridSystem.gridToWorld(tile.gridX, tile.gridY);

                // Add the creature token to the grid
                addToken(data.id, { x: worldPos.x, y: worldPos.y });
                return;
            }

            // Handle drops from item library
            if (data.type === 'item') {
                const itemId = data.id;
                // Use the item data from drag event if available, otherwise get from store
                const item = data.item || useItemStore.getState().items.find(item => item.id === itemId);

                if (item) {
                    // Use the actual tile coordinates where the item was dropped
                    const gridCoords = { x: tile.gridX, y: tile.gridY };
                    const worldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

                    // All items (including containers) should be positioned at the center of the tile
                    // The GridContainer component uses transform: translate(-50%, -50%) to center itself
                    const position = {
                        x: worldPos.x,
                        y: worldPos.y,
                        gridPosition: {
                            row: gridCoords.y,
                            col: gridCoords.x
                        }
                    };

                    // Ensure position data is properly set
                    // Make a deep copy of the position object to prevent any reference issues
                    const positionCopy = {
                        x: position.x,
                        y: position.y,
                        gridPosition: {
                            row: position.gridPosition.row,
                            col: position.gridPosition.col
                        }
                    };

                    // Create a clean version of the item without any position properties
                    // This prevents the item's own position properties from overriding the grid position
                    const cleanItem = { ...item };
                    delete cleanItem.position;
                    delete cleanItem.gridPosition;

                    // Add the item to the grid with the clean position data
                    addItemToGrid(cleanItem, positionCopy);
                } else {
                    // Item not found in store
                }
            }
            // Handle drops from inventory
            else if (data.type === 'inventory-item') {
                const itemId = data.id;
                const inventoryStore = useInventoryStore.getState();
                const inventoryItems = inventoryStore.items;

                // Use the full item data from the drag event if available
                const item = data.item || inventoryStore.items.find(item => item.id === itemId);

                if (item) {
                    // Use the actual tile coordinates where the item was dropped
                    const gridCoords = { x: tile.gridX, y: tile.gridY };
                    const worldPos = gridSystem.gridToWorld(gridCoords.x, gridCoords.y);

                    // All items (including containers) should be positioned at the center of the tile
                    // The GridContainer component uses transform: translate(-50%, -50%) to center itself
                    const position = {
                        x: worldPos.x,
                        y: worldPos.y,
                        gridPosition: {
                            row: gridCoords.y,
                            col: gridCoords.x
                        }
                    };

                    // Get the item from the item store if it exists there
                    const itemStoreItem = useItemStore.getState().items.find(i => i.id === item.originalItemId);

                    // Use the original item from the item store if available, otherwise use the inventory item
                    // IMPORTANT: Always preserve the quantity from the inventory item
                    const itemToAdd = itemStoreItem ? {
                        ...itemStoreItem,
                        quantity: item.quantity || 1  // Preserve quantity from inventory
                    } : item;

                    // If we're using the inventory item but it has an originalItemId,
                    // store that as a separate property to help with rendering
                    if (!itemStoreItem && item.originalItemId) {
                        itemToAdd.originalItemStoreId = item.originalItemId;
                    }

                    // IMPORTANT: Make sure currency properties are explicitly set
                    if (item.type === 'currency') {
                        itemToAdd.isCurrency = true;
                        itemToAdd.type = 'currency';

                        // Make sure currencyType is set
                        if (!itemToAdd.currencyType) {
                            if (typeof itemToAdd.currencyValue === 'object') {
                                // Determine primary type based on highest value
                                if (itemToAdd.currencyValue.gold > 0) {
                                    itemToAdd.currencyType = 'gold';
                                } else if (itemToAdd.currencyValue.silver > 0) {
                                    itemToAdd.currencyType = 'silver';
                                } else {
                                    itemToAdd.currencyType = 'copper';
                                }
                            } else {
                                // Default to gold if no type is specified
                                itemToAdd.currencyType = 'gold';
                            }
                        }

                    }

                    // Ensure position data is properly set
                    // Make a deep copy of the position object to prevent any reference issues
                    const positionCopy = {
                        x: position.x,
                        y: position.y,
                        gridPosition: {
                            row: position.gridPosition.row,
                            col: position.gridPosition.col
                        }
                    };

                    // Create a clean version of the item without any position properties
                    // This prevents the item's own position properties from overriding the grid position
                    const cleanItem = { ...itemToAdd };
                    delete cleanItem.position;
                    delete cleanItem.gridPosition;

                    // Add the item to the grid with the clean position data
                    addItemToGrid(cleanItem, positionCopy);

                    // Remove the item from inventory
                    inventoryStore.removeItem(itemId);
                }
            }
        } catch (error) {
            // Error handling drop
        }
    };

    // Canvas grid interaction handler - unified handler for all canvas grid events
    const handleCanvasGridInteraction = useCallback((event, tileData) => {

        // Route to appropriate handlers based on event type
        switch (event.type) {
            case 'click':
            case 'contextmenu':
                handleGridClick(event, tileData);
                break;
            case 'mouseenter':
                handleGridTileMouseEnter(event, tileData);
                break;
            case 'mouseleave':
                handleGridTileMouseLeave(event);
                break;
            case 'mousemove':
                handleGridTileMouseMove(event);
                break;
            case 'dragenter':
                handleDragOver(event, tileData);
                break;
            case 'dragover':
                handleDragOver(event, tileData);
                break;
            case 'drop':
                handleDrop(event, tileData);
                break;
            case 'dragleave':
                handleDragLeave(event);
                break;
            default:
                break;
        }
    }, [
        handleGridClick,
        handleGridTileMouseEnter,
        handleGridTileMouseLeave,
        handleGridTileMouseMove,
        handleDragOver,
        handleDrop,
        handleDragLeave
    ]);

    // Render multiple backgrounds - support both static and grid-aligned positioning
    const renderBackgrounds = () => {
        // Check if background layer is visible
        const backgroundLayer = drawingLayers.find(layer => layer.id === 'background');
        if (!backgroundLayer || !backgroundLayer.visible) return [];

        const sortedBackgrounds = [...backgrounds].sort((a, b) => a.zIndex - b.zIndex);

        return sortedBackgrounds.map(bg => {
            // Use individual background sticksToGrid setting
            const sticksToGrid = bg.sticksToGrid || false;
            if (sticksToGrid) {
                // Grid-aligned background: moves with camera and zoom
                // Center the background on screen initially, then apply camera offset
                const viewportCenterX = viewportSize.width / 2;
                const viewportCenterY = viewportSize.height / 2;

                const backgroundX = viewportCenterX + (bg.position.x - cameraX) * effectiveZoom;
                const backgroundY = viewportCenterY + (bg.position.y - cameraY) * effectiveZoom;

                // Use viewport-based sizing that scales properly with zoom
                // This ensures the background covers a reasonable area
                const baseSize = Math.max(viewportSize.width, viewportSize.height) * 1.5; // 1.5x viewport size
                const scaledWidth = baseSize * bg.scale * effectiveZoom;
                const scaledHeight = baseSize * bg.scale * effectiveZoom;

                // Apply rotation if specified
                const rotation = bg.rotation || 0;
                const transform = `rotate(${rotation}deg)`;

                const isActiveBackground = bg.id === activeBackgroundId && isBackgroundManipulationMode;

                return (
                    <div key={bg.id}>
                        {/* Main background image */}
                        <div
                            style={{
                                position: 'absolute',
                                left: `${backgroundX - scaledWidth / 2}px`,
                                top: `${backgroundY - scaledHeight / 2}px`,
                                width: `${scaledWidth}px`,
                                height: `${scaledHeight}px`,
                                backgroundImage: `url(${bg.url})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                opacity: bg.opacity,
                                zIndex: bg.zIndex - 10,
                                pointerEvents: isActiveBackground ? 'auto' : 'none',
                                transformOrigin: 'center center',
                                transform: transform,
                                cursor: isActiveBackground ? 'move' : 'default',
                                border: isActiveBackground ? '2px dashed #FFD700' : 'none'
                            }}
                            onMouseDown={isActiveBackground ? (e) => handleBackgroundMouseDown(e, bg.id) : undefined}
                        />

                        {/* Manipulation handles - only show for active background in manipulation mode */}
                        {isActiveBackground && (
                            <>
                                {/* Corner resize handles */}
                                <div
                                    data-manipulation-handle="resize"
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX - scaledWidth / 2 - 8}px`,
                                        top: `${backgroundY - scaledHeight / 2 - 8}px`,
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#FFD700',
                                        border: '2px solid #000',
                                        cursor: 'nw-resize',
                                        zIndex: bg.zIndex + 10
                                    }}
                                    onMouseDown={(e) => handleResizeMouseDown(e, bg.id, 'nw')}
                                />
                                <div
                                    data-manipulation-handle="resize"
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX + scaledWidth / 2 - 8}px`,
                                        top: `${backgroundY - scaledHeight / 2 - 8}px`,
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#FFD700',
                                        border: '2px solid #000',
                                        cursor: 'ne-resize',
                                        zIndex: bg.zIndex + 10
                                    }}
                                    onMouseDown={(e) => handleResizeMouseDown(e, bg.id, 'ne')}
                                />
                                <div
                                    data-manipulation-handle="resize"
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX - scaledWidth / 2 - 8}px`,
                                        top: `${backgroundY + scaledHeight / 2 - 8}px`,
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#FFD700',
                                        border: '2px solid #000',
                                        cursor: 'sw-resize',
                                        zIndex: bg.zIndex + 10
                                    }}
                                    onMouseDown={(e) => handleResizeMouseDown(e, bg.id, 'sw')}
                                />
                                <div
                                    data-manipulation-handle="resize"
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX + scaledWidth / 2 - 8}px`,
                                        top: `${backgroundY + scaledHeight / 2 - 8}px`,
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#FFD700',
                                        border: '2px solid #000',
                                        cursor: 'se-resize',
                                        zIndex: bg.zIndex + 10
                                    }}
                                    onMouseDown={(e) => handleResizeMouseDown(e, bg.id, 'se')}
                                />

                                {/* Rotation handle */}
                                <div
                                    data-manipulation-handle="rotate"
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX - 8}px`,
                                        top: `${backgroundY - scaledHeight / 2 - 40}px`,
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#00FF00',
                                        border: '2px solid #000',
                                        borderRadius: '50%',
                                        cursor: 'grab',
                                        zIndex: bg.zIndex + 10
                                    }}
                                    onMouseDown={(e) => handleRotateMouseDown(e, bg.id)}
                                />

                                {/* Rotation line */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${backgroundX - 1}px`,
                                        top: `${backgroundY - scaledHeight / 2 - 32}px`,
                                        width: '2px',
                                        height: '32px',
                                        backgroundColor: '#00FF00',
                                        zIndex: bg.zIndex + 5,
                                        transformOrigin: 'bottom center',
                                        transform: transform
                                    }}
                                />
                            </>
                        )}
                    </div>
                );
            } else {
                // Static background: fixed position, doesn't move with grid
                return (
                    <div
                        key={bg.id}
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundImage: `url(${bg.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed',
                            opacity: bg.opacity,
                            zIndex: bg.zIndex - 10, // Ensure backgrounds are behind everything
                            pointerEvents: 'none'
                        }}
                    />
                );
            }
        });
    };

    // Legacy background support - only use when no new backgrounds exist
    const getLegacyBackgroundStyle = () => {
        // Only use legacy background if no new backgrounds exist
        if (backgrounds.length > 0) {
            return {};
        }

        if (backgroundImage) {
            return {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            };
        } else if (backgroundImageUrl) {
            return {
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            };
        }
        return {};
    };

    // Wall styling functions (updated to match WallOverlay material IDs)
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
                background: 'linear-gradient(45deg, #8B4513 0%, #CD853F 25%, #A0522D 50%, #8B4513 75%, #CD853F 100%)',
                border: '2px solid #654321',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)'
            },
            metal_wall: {
                background: 'linear-gradient(45deg, #708090 0%, #2F4F4F 50%, #696969 100%)',
                border: '2px solid #2F4F4F',
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.4)'
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

    const getDoorStyle = (wall) => {
        const baseStyle = getWallMaterialStyle(wall.type.id);
        const doorStyles = {
            closed: {
                ...baseStyle,
                // Add door panel lines to distinguish from walls
                background: `${baseStyle.background}, repeating-linear-gradient(90deg, transparent 0%, transparent 45%, rgba(0,0,0,0.15) 50%, transparent 55%, transparent 100%)`,
                boxShadow: `${baseStyle.boxShadow}, inset 0 0 10px rgba(0,0,0,0.2)`,
                // Add a subtle door handle indicator
                position: 'relative'
            },
            open: {
                ...baseStyle,
                opacity: 0.3,
                background: 'linear-gradient(135deg, rgba(139,115,85,0.3) 0%, rgba(107,91,71,0.3) 50%, rgba(90,74,58,0.3) 100%)',
                border: '2px dashed #4A3A2A'
            },
            locked: {
                ...baseStyle,
                background: `${baseStyle.background}, radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 30%)`,
                boxShadow: `${baseStyle.boxShadow}, 0 0 8px rgba(255,215,0,0.4)`,
                // Add lock indicator
                position: 'relative'
            }
        };
        return doorStyles[wall.state] || doorStyles.closed;
    };

    return (
        <>
            {/* Professional VTT Editor */}
            <ProfessionalVTTEditor />

            <div
                id="grid-overlay"
                ref={gridRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: (isGridAlignmentMode || isBackgroundManipulationMode || isDraggingItem) ? "all" : "none",
                    overflow: "hidden",
                    zIndex: 0,
                    cursor: isGridAlignmentMode ? 'crosshair' :
                           isBackgroundManipulationMode ? 'move' :
                           (isDraggingCamera ? 'grabbing' : 'grab'),
                    touchAction: 'none', // Prevent touch scrolling
                    ...getLegacyBackgroundStyle()
                }}
            >
                {/* Temporary test button */}


                {/* Multiple backgrounds */}
                {backgrounds.length > 0 && renderBackgrounds()}

                {/* High-performance canvas-based grid renderer */}
                {shouldUseCanvas && (
                    <CanvasGridRenderer
                        viewportSize={viewportSize}
                        onGridInteraction={handleCanvasGridInteraction}
                        showGrid={showGrid}
                        gridLineColor="rgba(77, 155, 230, 0.15)"
                        gridLineThickness={1}
                        isDraggingItem={isDraggingItem}
                        isDraggingCharacterToken={isDraggingCharacterToken}
                    />
                )}

                {/* Fallback DOM-based grid tiles (for compatibility) */}
                {!shouldUseCanvas && showGrid && gridTiles.map((tile) => {
                    // Skip rendering tiles that are too small to be meaningful at low zoom levels
                    const actualTileSize = tileSize * effectiveZoom;
                    if (actualTileSize < 2) {
                        return null; // Don't render tiles smaller than 2 pixels
                    }

                    const tileKey = `${tile.gridX},${tile.gridY}`;
                    const tileWalls = wallDecorations.get(tileKey) || [];

                    // Check if walls exist on specific sides to conditionally remove borders
                    const hasLeftWall = tileWalls.some(wall => wall.side === 'left');
                    const hasRightWall = tileWalls.some(wall => wall.side === 'right');
                    const hasTopWall = tileWalls.some(wall => wall.side === 'top');
                    const hasBottomWall = tileWalls.some(wall => wall.side === 'bottom');

                    // Build border style conditionally to prevent grid lines from showing through walls
                    const borderWidth = `${Math.max(0.5, gridLineThickness * effectiveZoom)}px`;
                    const borderColor = gridLineColor.replace('0.3', '0.15');
                    const borderStyle = {
                        borderLeft: hasLeftWall ? 'none' : `${borderWidth} solid ${borderColor}`,
                        borderRight: hasRightWall ? 'none' : `${borderWidth} solid ${borderColor}`,
                        borderTop: hasTopWall ? 'none' : `${borderWidth} solid ${borderColor}`,
                        borderBottom: hasBottomWall ? 'none' : `${borderWidth} solid ${borderColor}`
                    };

                    return (
                        <div
                            key={tile.key}
                            className={`grid-tile ${hoveredTile === tile ? 'hovered' : ''}`}
                            style={{
                                position: "absolute",
                                width: `${tileSize * effectiveZoom}px`,
                                height: `${tileSize * effectiveZoom}px`,
                                left: `${tile.screenX}px`,
                                top: `${tile.screenY}px`,
                                ...borderStyle, // Apply conditional borders instead of uniform border
                                boxSizing: "border-box",
                                pointerEvents: "all",
                                zIndex: tileWalls.length > 0 ? 10 : 1, // Higher z-index for tiles with walls to ensure walls appear above terrain
                                background: 'transparent', // Ensure no background patterns or dots
                                // Enhanced performance optimizations
                                willChange: effectiveZoom < 0.5 ? 'auto' : 'transform', // Reduce willChange at low zoom
                                backfaceVisibility: 'hidden',
                                transform: 'translateZ(0)', // Force hardware acceleration
                                contain: 'layout style paint', // CSS containment for better performance
                                isolation: 'isolate' // Create new stacking context
                            }}
                            onDragOver={(e) => handleDragOver(e, tile)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, tile)}
                            onClick={(e) => handleGridClick(e, tile)}
                            onContextMenu={(e) => handleGridClick(e, tile)}
                            onMouseEnter={(e) => handleGridTileMouseEnter(e, tile)}
                            onMouseLeave={handleGridTileMouseLeave}
                            onMouseMove={handleGridTileMouseMove}
                        >
                            {/* Wall decorations positioned relative to this tile - like objects inside tiles */}
                            {showWallLayer && tileWalls.map((wall) => {
                                const wallThickness = Math.max(12, tileSize * effectiveZoom * 0.2);
                                const materialStyle = wall.type.interactive ? getDoorStyle(wall) : getWallMaterialStyle(wall.type.id);

                                // Check if any adjacent tiles have fog of war to determine wall visibility
                                const { x1, y1, x2, y2 } = wall.gridCoords;
                                const adjacentTiles = [
                                    { x: x1, y: y1 },
                                    { x: x1 - 1, y: y1 },
                                    { x: x2, y: y2 },
                                    { x: x2 - 1, y: y2 }
                                ];
                                const hasAdjacentFog = adjacentTiles.some(pos => getFogOfWar(pos.x, pos.y));

                                // Position wall relative to tile based on which side it's on
                                let wallStyle = {
                                    position: 'absolute',
                                    background: materialStyle.background,
                                    border: materialStyle.border,
                                    borderRadius: '1px',
                                    boxShadow: materialStyle.boxShadow,
                                    zIndex: hasAdjacentFog ? 5 : 200, // Lower z-index when adjacent to fog so fog overlay appears on top
                                    pointerEvents: hasAdjacentFog ? 'none' : 'auto', // Disable interaction when adjacent to fog
                                    cursor: wall.type.interactive ? 'pointer' : 'default',
                                    opacity: hasAdjacentFog ? (isGMMode ? 0.3 : 0) : 1 // Hide from players, semi-transparent for GM when adjacent to fog
                                };

                                // Check for adjacent walls to determine corner connections
                                const hasAdjacentWalls = {
                                    topLeft: wallData[`${x1-1},${y1-1},${x1},${y1-1}`] || wallData[`${x1},${y1-1},${x1-1},${y1-1}`],
                                    topRight: wallData[`${x1},${y1-1},${x1+1},${y1-1}`] || wallData[`${x1+1},${y1-1},${x1},${y1-1}`],
                                    bottomLeft: wallData[`${x1-1},${y1},${x1},${y1}`] || wallData[`${x1},${y1},${x1-1},${y1}`],
                                    bottomRight: wallData[`${x1},${y1},${x1+1},${y1}`] || wallData[`${x1+1},${y1},${x1},${y1}`],
                                    leftTop: wallData[`${x1-1},${y1-1},${x1-1},${y1}`] || wallData[`${x1-1},${y1},${x1-1},${y1-1}`],
                                    leftBottom: wallData[`${x1-1},${y1},${x1-1},${y1+1}`] || wallData[`${x1-1},${y1+1},${x1-1},${y1}`],
                                    rightTop: wallData[`${x1},${y1-1},${x1},${y1}`] || wallData[`${x1},${y1},${x1},${y1-1}`],
                                    rightBottom: wallData[`${x1},${y1},${x1},${y1+1}`] || wallData[`${x1},${y1+1},${x1},${y1}`]
                                };

                                // Enhanced gap filling with better corner connections
                                const extensionAmount = wallThickness * 0.6; // Larger extension for better coverage

                                if (wall.side === 'left') {
                                    // Vertical wall on left side of tile - extend to fill gaps
                                    wallStyle = {
                                        ...wallStyle,
                                        left: `${-wallThickness / 2}px`,
                                        top: `${-extensionAmount}px`, // Extend more beyond tile
                                        width: `${wallThickness}px`,
                                        height: `calc(100% + ${extensionAmount * 2}px)` // Fill gaps on both ends
                                    };
                                } else if (wall.side === 'right') {
                                    // Vertical wall on right side of tile - extend to fill gaps
                                    wallStyle = {
                                        ...wallStyle,
                                        right: `${-wallThickness / 2}px`,
                                        top: `${-extensionAmount}px`, // Extend more beyond tile
                                        width: `${wallThickness}px`,
                                        height: `calc(100% + ${extensionAmount * 2}px)` // Fill gaps on both ends
                                    };
                                } else if (wall.side === 'top') {
                                    // Horizontal wall on top side of tile - extend to fill gaps
                                    wallStyle = {
                                        ...wallStyle,
                                        left: `${-extensionAmount}px`, // Extend more beyond tile
                                        top: `${-wallThickness / 2}px`,
                                        width: `calc(100% + ${extensionAmount * 2}px)`, // Fill gaps on both ends
                                        height: `${wallThickness}px`
                                    };
                                } else if (wall.side === 'bottom') {
                                    // Horizontal wall on bottom side of tile - extend to fill gaps
                                    wallStyle = {
                                        ...wallStyle,
                                        left: `${-extensionAmount}px`, // Extend more beyond tile
                                        bottom: `${-wallThickness / 2}px`,
                                        width: `calc(100% + ${extensionAmount * 2}px)`, // Fill gaps on both ends
                                        height: `${wallThickness}px`
                                    };
                                }

                                return (
                                    <div
                                        key={`${wall.key}-${wall.side}`}
                                        className="wall-decoration"
                                        style={wallStyle}
                                        onMouseEnter={(e) => handleWallMouseEnter(wall, e)}
                                        onMouseLeave={handleWallMouseLeave}
                                        onContextMenu={(e) => handleWallRightClick(wall, e)}
                                        onClick={(e) => handleWallClick(wall, e)}
                                    />
                                );
                            })}
                        </div>
                    );
                })}

                {/* Grid Alignment Overlay */}
                {isGridAlignmentMode && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}
                    >
                        {/* Instructions */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                zIndex: 1001,
                                textAlign: 'center'
                            }}
                        >
                            🎯 Grid Alignment Mode<br/>
                            <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
                                {gridAlignmentStep === 1 ? 'Step 1/2: Draw first grid cell' :
                                 gridAlignmentStep === 2 ? 'Step 2/2: Draw second grid cell for better accuracy' :
                                 'Drag to define grid cell size and position'}
                            </span>
                            {gridAlignmentStep === 2 && gridAlignmentRectangles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            pointerEvents: 'all'
                                        }}
                                        onClick={() => {
                                            // Apply with just the first rectangle
                                            const firstRect = gridAlignmentRectangles[0];
                                            const gridSize = Math.min(firstRect.width, firstRect.height) / effectiveZoom;
                                            const startWorld = gridSystem.screenToWorld(firstRect.start.x, firstRect.start.y);
                                            const newOffsetX = startWorld.x % gridSize;
                                            const newOffsetY = startWorld.y % gridSize;

                                            setGridSize(gridSize);
                                            setGridOffset(newOffsetX, newOffsetY);

                                            clearGridAlignmentRectangles();
                                            setGridAlignmentStep(0);
                                            useGameStore.getState().setGridAlignmentMode(false);
                                        }}
                                    >
                                        Apply with One Rectangle
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Previous rectangles */}
                        {gridAlignmentRectangles.map((rect, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${Math.min(rect.start.x, rect.end.x)}px`,
                                    top: `${Math.min(rect.start.y, rect.end.y)}px`,
                                    width: `${rect.width}px`,
                                    height: `${rect.height}px`,
                                    border: '2px solid #00FF00',
                                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                                    boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                                    zIndex: 1001
                                }}
                            />
                        ))}

                        {/* Current alignment rectangle */}
                        {isGridAlignmentDragging && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${Math.min(gridAlignmentStart.x, gridAlignmentEnd.x)}px`,
                                    top: `${Math.min(gridAlignmentStart.y, gridAlignmentEnd.y)}px`,
                                    width: `${Math.abs(gridAlignmentEnd.x - gridAlignmentStart.x)}px`,
                                    height: `${Math.abs(gridAlignmentEnd.y - gridAlignmentStart.y)}px`,
                                    border: '3px solid #FFD700',
                                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                                    zIndex: 1002
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Background Manipulation Overlay */}
                {isBackgroundManipulationMode && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1000
                        }}
                    >
                        {/* Instructions */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                zIndex: 1001,
                                textAlign: 'center'
                            }}
                        >
                            🖼️ Background Manipulation Mode<br/>
                            {activeBackgroundId && (() => {
                                const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
                                return activeBackground ? (
                                    <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
                                        Editing: {activeBackground.name} (Scale: {activeBackground.scale.toFixed(2)})<br/>
                                        Drag to move • Shift+Drag to resize • Scroll to scale
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ff6b6b' }}>
                                        No background selected for editing
                                    </span>
                                );
                            })()}
                            {!activeBackgroundId && (
                                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ff6b6b' }}>
                                    No background selected for editing
                                </span>
                            )}
                        </div>
                    </div>
                )}

            {/* Tile Overlay - Always visible tiles */}
            <TileOverlay />

            {/* Light Source Overlay - Dynamic lighting system */}
            <LightSourceOverlay />

            {/* Shadow Overlay - Dynamic shadow casting */}
            <ShadowOverlay />

            {/* Canvas Wall System - High-performance canvas-based wall rendering */}
            <CanvasWallSystem />

            {/* Render grid items */}
            {gridItems.map(gridItem => {
                // Get the original item to check if it's a container
                // First try using originalItemStoreId if available
                let originalItem = null;
                if (gridItem.originalItemStoreId) {
                    originalItem = useItemStore.getState().items.find(item => item.id === gridItem.originalItemStoreId);
                }

                // If not found, try the regular itemId
                if (!originalItem) {
                    originalItem = useItemStore.getState().items.find(item => item.id === gridItem.itemId);
                }

                // Create a unique key that includes more properties to ensure proper re-rendering
                const uniqueKey = `${gridItem.id}-${gridItem.itemId || 'no-item'}-${gridItem.addedAt || Date.now()}-${forceRenderKey}`;

                // If it's a container, render it as a container
                if (originalItem && originalItem.type === 'container') {
                    return <GridContainer key={uniqueKey} gridItem={gridItem} />;
                }

                // Always render the item, even if the original item is not found
                // This ensures currency items and other items will appear on the grid
                return <GridItem key={uniqueKey} gridItem={gridItem} />;
            })}

            {/* Render creature tokens */}
            {tokens.map(token => {
                return (
                    <CreatureToken
                        key={token.id}
                        tokenId={token.id}
                        position={token.position}
                        onRemove={handleRemoveToken}
                    />
                );
            })}

            {/* Render character tokens */}
            {characterTokens.map(token => {
                return (
                    <CharacterToken
                        key={token.id}
                        tokenId={token.id}
                        position={token.position}
                        onRemove={handleRemoveCharacterToken}
                        onInspect={handleCharacterTokenInspect}
                    />
                );
            })}

            {/* Character Token Placement Preview */}
            {isDraggingCharacterToken && <CharacterTokenPreview mousePosition={mousePosition} tokenSize={tokenSize} />}

            {/* Character Token Placement Instructions */}
            {isDraggingCharacterToken && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        zIndex: 10001,
                        textAlign: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    🎭 Character Token Placement<br/>
                    <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
                        Left-click to place • Right-click or ESC to cancel
                    </span>
                </div>
            )}

            {/* Token Tester for testing tooltips - Removed per user request */}
            {/* <TokenTester /> */}

            {/* Professional Terrain System - Renders terrain on the grid */}
            <TerrainSystem />

            {/* Professional Object System - Renders objects like lights, trees, etc */}
            <ObjectSystem />

            {/* VTT Drawing Engine - Renders all drawings on the grid */}
            <VTTDrawingEngine />

            {/* Grid Tile Tooltip */}
            {showGridTooltip && hoveredGridTile && (() => {
                // Check for fog of war first - if present, only show fog tooltip
                const hasFogOfWar = getFogOfWar(hoveredGridTile.gridX, hoveredGridTile.gridY);

                if (hasFogOfWar) {
                    // Only show fog of war tooltip - hide all other information
                    return (
                        <div
                            className="tile-tooltip unified-tooltip-style"
                            style={{
                                position: 'fixed',
                                left: mousePosition.x + 15,
                                top: mousePosition.y - 10,
                                transform: mousePosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
                                zIndex: 1000
                            }}
                        >
                            <div className="tooltip-content">
                                <div className="tooltip-item">
                                    <strong>Fog of War</strong>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                        Hidden from players
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                // No fog of war - show normal tooltip information
                // Get terrain information for this tile
                const terrainType = getTerrain(hoveredGridTile.gridX, hoveredGridTile.gridY);
                const terrain = terrainType ? TERRAIN_TYPES[terrainType] : null;

                // Check for objects on this tile
                const objectsOnTile = environmentalObjects.filter(obj => {
                    // Handle different positioning systems
                    if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                        // Free-positioned objects use worldX/worldY
                        return Math.floor(obj.worldX) === hoveredGridTile.gridX &&
                               Math.floor(obj.worldY) === hoveredGridTile.gridY;
                    } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                        // Grid-aligned objects use gridX/gridY
                        return obj.gridX === hoveredGridTile.gridX &&
                               obj.gridY === hoveredGridTile.gridY;
                    } else if (obj.position && obj.position.x !== undefined && obj.position.y !== undefined) {
                        // Legacy objects with position property
                        return Math.floor(obj.position.x) === hoveredGridTile.gridX &&
                               Math.floor(obj.position.y) === hoveredGridTile.gridY;
                    }
                    return false;
                });

                // Check for D&D elements on this tile
                const dndOnTile = dndElements.filter(element => {
                    // Handle different positioning systems for D&D elements
                    if (element.freePosition && element.worldX !== undefined && element.worldY !== undefined) {
                        // Free-positioned elements use worldX/worldY
                        return Math.floor(element.worldX) === hoveredGridTile.gridX &&
                               Math.floor(element.worldY) === hoveredGridTile.gridY;
                    } else if (element.gridX !== undefined && element.gridY !== undefined) {
                        // Grid-aligned elements use gridX/gridY
                        return element.gridX === hoveredGridTile.gridX &&
                               element.gridY === hoveredGridTile.gridY;
                    } else if (element.position && element.position.x !== undefined && element.position.y !== undefined) {
                        // Legacy elements with position property
                        return Math.floor(element.position.x) === hoveredGridTile.gridX &&
                               Math.floor(element.position.y) === hoveredGridTile.gridY;
                    }
                    return false;
                });

                // Only show tooltip if there's actual content (terrain, objects, or elements)
                const hasContent = terrain || objectsOnTile.length > 0 || dndOnTile.length > 0;

                if (!hasContent) {
                    return null; // Don't show tooltip for empty tiles
                }

                const displayTerrain = terrain;

                return (
                    <div
                        style={{
                            position: 'fixed',
                            left: mousePosition.x + 15,
                            top: mousePosition.y - 10,
                            transform: mousePosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '4px',
                            padding: '10px 12px',
                            zIndex: 10000,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            fontSize: '12px',
                            color: '#7a3b2e',
                            pointerEvents: 'none',
                            maxWidth: '280px',
                            minWidth: '200px'
                        }}
                    >
                        {/* Header - only show terrain info if terrain exists */}
                        {displayTerrain ? (
                            <>
                                <div style={{ fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid #a08c70', paddingBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: displayTerrain.color,
                                                border: '1px solid #7a3b2e',
                                                borderRadius: '2px'
                                            }}
                                        />
                                        <span>{displayTerrain.name}</span>
                                    </div>
                                    <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
                                        ({hoveredGridTile.gridX}, {hoveredGridTile.gridY})
                                    </div>
                                </div>

                                {/* Terrain Description */}
                                <div style={{ marginBottom: '6px' }}>
                                    <div style={{ fontSize: '11px', fontStyle: 'italic', marginBottom: '3px' }}>
                                        {displayTerrain.description}
                                    </div>
                                </div>

                                {/* Game Mechanics */}
                                <div style={{ marginBottom: '6px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>
                                        Movement Cost: {displayTerrain.movementCost === 999 ? 'Impassable' : `${displayTerrain.movementCost}x`}
                                    </div>
                                    {displayTerrain.mechanics && (
                                        <div style={{ fontSize: '10px', marginBottom: '2px' }}>
                                            <strong>Mechanics:</strong> {displayTerrain.mechanics}
                                        </div>
                                    )}
                                    {displayTerrain.tacticalNotes && (
                                        <div style={{ fontSize: '10px', color: '#8b5a3c' }}>
                                            <strong>Tactical:</strong> {displayTerrain.tacticalNotes}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // If no terrain but has objects/elements, show a simple header
                            <div style={{ fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid #a08c70', paddingBottom: '4px' }}>
                                <div style={{ fontSize: '10px', opacity: 0.7 }}>
                                    ({hoveredGridTile.gridX}, {hoveredGridTile.gridY})
                                </div>
                            </div>
                        )}

                        {/* Objects and Elements */}
                        {(objectsOnTile.length > 0 || dndOnTile.length > 0) && (
                            <div style={{ borderTop: '1px solid #a08c70', paddingTop: '4px', fontSize: '10px' }}>
                                {objectsOnTile.length > 0 && (
                                    <div style={{ marginBottom: '2px' }}>
                                        <strong>Objects:</strong> {objectsOnTile.map(obj => obj.type).join(', ')}
                                    </div>
                                )}
                                {dndOnTile.length > 0 && (
                                    <div>
                                        <strong>Elements:</strong> {dndOnTile.map(elem => elem.type).join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Wall Tooltip */}
            {showWallTooltip && hoveredWall && (
                <div
                    className="tile-tooltip unified-tooltip-style"
                    style={{
                        position: 'fixed',
                        left: wallTooltipPosition.x + 15,
                        top: wallTooltipPosition.y - 10,
                        transform: wallTooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none',
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

            {/* Wall Context Menu */}
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

            {/* Text Interaction Overlay - Handle text selection and movement when editor is closed */}
            <TextInteractionOverlay gridRef={gridRef} />

            {/* Fog Systems - Available for both GM and Player modes */}
            <StaticFogOverlay />


        </div>
        </>
    );
}