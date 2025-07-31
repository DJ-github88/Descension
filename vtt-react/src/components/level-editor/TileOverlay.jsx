import React, { useState, useEffect, useRef, useMemo } from 'react';
import useLevelEditorStore, { TERRAIN_TYPES, OBJECT_TYPES, DND_ELEMENTS } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { isTileVisible } from '../../utils/VisibilityCalculations';
import TileTooltip from './TileTooltip';
import ObjectTooltip from './ObjectTooltip';
import UnifiedContextMenu from './UnifiedContextMenu';
import PortalTransferDialog from './PortalTransferDialog';
import GMNotesWindow from './GMNotesWindow';
import { PROFESSIONAL_OBJECTS } from './objects/ObjectSystem';
import './styles/TileOverlay.css';

const TileOverlay = () => {
    const [hoveredTile, setHoveredTile] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedObject, setSelectedObject] = useState(null);
    const [hoveredObject, setHoveredObject] = useState(null);
    const [showObjectTooltip, setShowObjectTooltip] = useState(false);
    const [showPortalTransferDialog, setShowPortalTransferDialog] = useState(false);
    const [selectedPortal, setSelectedPortal] = useState(null);
    const [showGMNotesWindow, setShowGMNotesWindow] = useState(false);
    const [selectedGMNotes, setSelectedGMNotes] = useState(null);
    const hoverTimeoutRef = useRef(null);
    const objectHoverTimeoutRef = useRef(null);
    const overlayRef = useRef(null);

    // Listen for GM Notes open events from ObjectSystem
    useEffect(() => {
        const handleOpenGMNotes = (e) => {
            const { object } = e.detail;
            setSelectedGMNotes(object);
            setShowGMNotesWindow(true);
        };

        document.addEventListener('openGMNotes', handleOpenGMNotes);
        return () => document.removeEventListener('openGMNotes', handleOpenGMNotes);
    }, []);

    // Level editor store
    const {
        terrainData,
        environmentalObjects,
        dndElements,
        fogOfWarData,
        revealedAreas,
        getTerrain,
        getFogOfWar,
        removeEnvironmentalObject,
        updateEnvironmentalObject,
        showTerrainLayer,
        showObjectLayer,
        showDndLayer
    } = useLevelEditorStore();

    // Game store for GM mode
    const { isGMMode } = useGameStore();

    // Game store for grid settings
    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom
    } = useGameStore();

    // Calculate effective zoom (GM zoom * player zoom) to match main grid system
    const effectiveZoom = zoomLevel * playerZoom;

    // Level editor store for editor mode
    const { isEditorMode } = useLevelEditorStore();

    const tileSize = gridSize || 50;

    // Calculate grid position from mouse coordinates using the same system as tokens and grid lines
    const getGridPosition = (mouseX, mouseY) => {
        if (!overlayRef.current) return null;

        const rect = overlayRef.current.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.screenToWorld(x, y, rect.width, rect.height);
            const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

            return { gridX: gridCoords.x, gridY: gridCoords.y };
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const adjustedX = x - gridOffsetX;
            const adjustedY = y - gridOffsetY;

            const gridX = Math.floor(adjustedX / tileSize);
            const gridY = Math.floor(adjustedY / tileSize);

            return { gridX, gridY };
        }
    };

    // Handle mouse move
    const handleMouseMove = (e) => {
        const gridPos = getGridPosition(e.clientX, e.clientY);
        setMousePosition({ x: e.clientX, y: e.clientY });

        if (gridPos) {
            const { gridX, gridY } = gridPos;
            const tileKey = `${gridX},${gridY}`;

            // Check if we moved to a different tile
            if (hoveredTile !== tileKey) {
                setHoveredTile(tileKey);
                setShowTooltip(false);

                // Clear existing timeout
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                }

                // Set new timeout for tooltip
                hoverTimeoutRef.current = setTimeout(() => {
                    // Always show tooltip - TileTooltip will handle fog detection internally
                    setShowTooltip(true);
                }, 1500); // 1.5 second delay
            }
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setHoveredTile(null);
        setShowTooltip(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    // Handle right click for context menu
    const handleContextMenu = (e) => {
        e.preventDefault();

        // Get screen coordinates relative to the overlay
        const rect = e.currentTarget.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Find objects at this screen position
        const objectsAtPosition = environmentalObjects.filter(obj => {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) return false;

            // Handle free-positioned objects (like GM Notes)
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Calculate screen position of the object
                let objScreenPos;
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    objScreenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    // Fallback calculation
                    const effectiveZoom = zoomLevel * playerZoom;
                    objScreenPos = {
                        x: (obj.worldX - cameraX) * effectiveZoom + window.innerWidth / 2,
                        y: (obj.worldY - cameraY) * effectiveZoom + window.innerHeight / 2
                    };
                }

                // Calculate object bounds
                const tileSize = gridSize * (zoomLevel * playerZoom);
                const scale = obj.scale || 1;
                const objWidth = objectDef.size.width * tileSize * scale;
                const objHeight = objectDef.size.height * tileSize * scale;

                // Check if click is within object bounds (centered)
                const left = objScreenPos.x - objWidth / 2;
                const right = objScreenPos.x + objWidth / 2;
                const top = objScreenPos.y - objHeight / 2;
                const bottom = objScreenPos.y + objHeight / 2;

                return screenX >= left && screenX <= right && screenY >= top && screenY <= bottom;
            } else {
                // Handle grid-aligned objects using grid position
                const gridPos = getGridPosition(e.clientX, e.clientY);
                if (!gridPos) return false;

                const { gridX, gridY } = gridPos;
                const objX = obj.position?.x ?? obj.gridX;
                const objY = obj.position?.y ?? obj.gridY;
                return objX !== undefined && objY !== undefined &&
                       Math.floor(objX) === gridX && Math.floor(objY) === gridY;
            }
        });

        if (objectsAtPosition.length > 0) {
            setSelectedObject(objectsAtPosition[0]); // Select first object if multiple
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    // Handle removing selected object
    const handleRemoveObject = () => {
        if (selectedObject) {
            removeEnvironmentalObject(selectedObject.id);
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    // Handle object interaction (like door toggling)
    const handleObjectClick = (obj, objectType) => {
        console.log('🎯 Object clicked:', { obj, objectType });

        // Handle GM Notes objects
        if (obj.type === 'gmNotes' || objectType?.id === 'gmNotes') {
            console.log('🎯 Opening GM Notes window for object:', obj);
            setSelectedGMNotes(obj);
            setShowGMNotesWindow(true);
            return;
        }

        if (objectType.states && objectType.states.length > 0) {
            // Toggle between states (for doors: closed <-> open)
            const currentState = obj.state || objectType.states[0];
            const currentIndex = objectType.states.indexOf(currentState);
            const nextIndex = (currentIndex + 1) % objectType.states.length;
            const nextState = objectType.states[nextIndex];

            updateEnvironmentalObject(obj.id, { ...obj, state: nextState });
        }
    };

    // Handle GM Notes updates
    const handleGMNotesUpdate = (updatedNotesData) => {
        if (selectedGMNotes) {
            updateEnvironmentalObject(selectedGMNotes.id, {
                ...selectedGMNotes,
                gmNotesData: updatedNotesData
            });
            setSelectedGMNotes({
                ...selectedGMNotes,
                gmNotesData: updatedNotesData
            });
        }
    };

    // Handle portal click
    const handlePortalClick = (portal) => {
        const portalName = portal.properties?.portalName || 'Portal';
        const destinationMapId = portal.properties?.destinationMapId;
        const isActive = portal.properties?.isActive !== false;

        // Check if portal is active and configured
        if (!isActive) {
            alert(`Portal "${portalName}" is currently inactive.`);
            return;
        }

        if (!destinationMapId) {
            alert(`Portal "${portalName}" is not configured. Use the level editor to set destination.`);
            return;
        }

        // Show portal transfer dialog
        setSelectedPortal(portal);
        setShowPortalTransferDialog(true);
    };

    // Handle object hover for individual tooltips
    const handleObjectMouseEnter = (obj, objectType, event) => {
        event.stopPropagation();

        // Check if this object is visible (considering both static fog and dynamic visibility)
        const objX = obj.position?.x ?? obj.gridX;
        const objY = obj.position?.y ?? obj.gridY;
        const objGridX = Math.floor(objX);
        const objGridY = Math.floor(objY);
        const isVisible = isTileVisible(objGridX, objGridY, fogOfWarData, revealedAreas, isGMMode);

        // Don't show object tooltip if not visible - let Grid tooltip handle it
        if (!isVisible) {
            return;
        }

        setHoveredObject({ obj, objectType });
        setShowObjectTooltip(false);

        // Clear existing timeout
        if (objectHoverTimeoutRef.current) {
            clearTimeout(objectHoverTimeoutRef.current);
        }

        // Set new timeout for object tooltip
        objectHoverTimeoutRef.current = setTimeout(() => {
            setShowObjectTooltip(true);
        }, 1500); // 1.5 second delay
    };

    const handleObjectMouseLeave = (event) => {
        event.stopPropagation();
        setHoveredObject(null);
        setShowObjectTooltip(false);
        if (objectHoverTimeoutRef.current) {
            clearTimeout(objectHoverTimeoutRef.current);
        }
    };

    // Close context menu when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = () => {
            setShowContextMenu(false);
        };

        if (showContextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showContextMenu]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (objectHoverTimeoutRef.current) {
                clearTimeout(objectHoverTimeoutRef.current);
            }
        };
    }, []);

    // Get all tiles that have content within the visible area
    const getContentTiles = () => {
        const tiles = [];
        // Use the same bounds calculation as InfiniteGridSystem for consistency
        try {
            const gridSystem = getGridSystem();
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();

            // Use the same generous bounds calculation as the main grid system
            const bounds = gridSystem.getVisibleGridBounds(viewport.width, viewport.height);

            // Use the same padding factor as InfiniteGridSystem (3x viewport)
            const paddingFactor = 3.0;
            const visibleWorldWidth = viewport.width / effectiveZoom;
            const visibleWorldHeight = viewport.height / effectiveZoom;
            const paddedWorldWidth = visibleWorldWidth * paddingFactor;
            const paddedWorldHeight = visibleWorldHeight * paddingFactor;

            // Calculate extended bounds to match main grid coverage
            const worldLeft = cameraX - (paddedWorldWidth / 2);
            const worldTop = cameraY - (paddedWorldHeight / 2);
            const worldRight = cameraX + (paddedWorldWidth / 2);
            const worldBottom = cameraY + (paddedWorldHeight / 2);

            const minX = Math.floor((worldLeft - gridOffsetX) / tileSize);
            const maxX = Math.ceil((worldRight - gridOffsetX) / tileSize);
            const minY = Math.floor((worldTop - gridOffsetY) / tileSize);
            const maxY = Math.ceil((worldBottom - gridOffsetY) / tileSize);

            for (let x = minX; x < maxX; x++) {
                for (let y = minY; y < maxY; y++) {
                    const terrainType = showTerrainLayer ? getTerrain(x, y) : null;
                    const hasObjects = showObjectLayer && environmentalObjects.some(obj => {
                        // Skip objects with free positioning (they're rendered by ObjectSystem)
                        if (obj.freePosition) return false;

                        // Handle both coordinate systems: position.x/y and gridX/gridY
                        const objX = obj.position?.x ?? obj.gridX;
                        const objY = obj.position?.y ?? obj.gridY;
                        return objX !== undefined && objY !== undefined &&
                               Math.floor(objX) === x && Math.floor(objY) === y;
                    });
                    const hasDndElements = showDndLayer && dndElements.some(element => {
                        // Handle both coordinate systems: position.x/y and gridX/gridY
                        const elemX = element.position?.x ?? element.gridX;
                        const elemY = element.position?.y ?? element.gridY;
                        return elemX !== undefined && elemY !== undefined &&
                               Math.floor(elemX) === x && Math.floor(elemY) === y;
                    });
                    const hasFog = showDndLayer && getFogOfWar(x, y);
                    const isVisible = isTileVisible(x, y, fogOfWarData, revealedAreas, isGMMode);

                    // Show objects, D&D elements, and fog (terrain is handled by TerrainSystem)
                    // But only show content if tile is visible (unless it's fog itself)
                    if ((hasObjects || hasDndElements) && (isVisible || isGMMode)) {
                        tiles.push({
                            x,
                            y,
                            terrainType: null, // Disable terrain rendering in TileOverlay
                            hasObjects,
                            hasDndElements,
                            hasFog
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error calculating tile bounds:', error);
            // Fallback to simple bounds if grid system fails
            const fallbackPadding = 50;
            const minX = Math.floor((cameraX - 500) / tileSize) - fallbackPadding;
            const maxX = Math.ceil((cameraX + 500) / tileSize) + fallbackPadding;
            const minY = Math.floor((cameraY - 500) / tileSize) - fallbackPadding;
            const maxY = Math.ceil((cameraY + 500) / tileSize) + fallbackPadding;

            for (let x = minX; x < maxX; x++) {
                for (let y = minY; y < maxY; y++) {
                    const terrainType = showTerrainLayer ? getTerrain(x, y) : null;
                    const hasObjects = showObjectLayer && environmentalObjects.some(obj => {
                        // Skip objects with free positioning (they're rendered by ObjectSystem)
                        if (obj.freePosition) return false;

                        // Handle both coordinate systems: position.x/y and gridX/gridY
                        const objX = obj.position?.x ?? obj.gridX;
                        const objY = obj.position?.y ?? obj.gridY;
                        return objX !== undefined && objY !== undefined &&
                               Math.floor(objX) === x && Math.floor(objY) === y;
                    });
                    const hasDndElements = showDndLayer && dndElements.some(element => {
                        // Handle both coordinate systems: position.x/y and gridX/gridY
                        const elemX = element.position?.x ?? element.gridX;
                        const elemY = element.position?.y ?? element.gridY;
                        return elemX !== undefined && elemY !== undefined &&
                               Math.floor(elemX) === x && Math.floor(elemY) === y;
                    });
                    const hasFog = showDndLayer && getFogOfWar(x, y);
                    const isVisible = isTileVisible(x, y, fogOfWarData, revealedAreas, isGMMode);

                    // Show objects, D&D elements, and fog (terrain is handled by TerrainSystem)
                    // But only show content if tile is visible (unless it's fog itself)
                    if ((hasObjects || hasDndElements) && (isVisible || isGMMode)) {
                        tiles.push({
                            x,
                            y,
                            terrainType: null, // Disable terrain rendering in TileOverlay
                            hasObjects,
                            hasDndElements,
                            hasFog
                        });
                    }
                }
            }
        }

        return tiles;
    };

    const contentTiles = useMemo(() => getContentTiles(), [
        terrainData,
        environmentalObjects,
        dndElements,
        fogOfWarData,
        revealedAreas,
        isGMMode,
        cameraX,
        cameraY,
        effectiveZoom,
        gridOffsetX,
        gridOffsetY,
        gridSize,
        tileSize,
        isEditorMode,
        showTerrainLayer,
        showObjectLayer,
        showDndLayer
    ]);
    const hoveredGridPos = hoveredTile ? hoveredTile.split(',').map(Number) : [null, null];

    // Helper function to get object styling based on type
    const getObjectStyle = (objectType, obj) => {
        const baseStyle = {
            borderRadius: '4px',
            transition: 'all 0.2s ease',
        };

        switch (objectType.id) {
            case 'tree':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                };
            case 'rock':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                };
            case 'bush':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: 'rgba(139, 69, 19, 0.7)',
                    border: '2px solid #8B4513',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                };
        }
    };

    // Helper function to get object content/icon
    const getObjectContent = (objectType, obj) => {
        // Use CSS graphics instead of emojis for better visual consistency
        switch (objectType.id) {
            case 'tree':
                return (
                    <div style={{
                        width: '80%',
                        height: '80%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Tree crown - multiple overlapping circles for organic look */}
                        <div style={{
                            position: 'absolute',
                            width: '70%',
                            height: '60%',
                            background: 'radial-gradient(circle at 30% 30%, #32CD32 0%, #228B22 70%)',
                            borderRadius: '50% 60% 40% 50%',
                            top: '10%',
                            left: '15%',
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            height: '45%',
                            background: 'radial-gradient(circle at 60% 40%, #228B22 0%, #006400 80%)',
                            borderRadius: '60% 40% 50% 60%',
                            top: '20%',
                            right: '10%',
                            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
                        }} />
                        {/* Tree trunk */}
                        <div style={{
                            position: 'absolute',
                            bottom: '0%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '15%',
                            height: '40%',
                            background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
                            borderRadius: '2px',
                            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.4))'
                        }} />
                    </div>
                );
            case 'rock':
                return (
                    <div style={{
                        width: '70%',
                        height: '70%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Main rock body */}
                        <div style={{
                            position: 'absolute',
                            width: '85%',
                            height: '75%',
                            background: 'linear-gradient(135deg, #A9A9A9 0%, #696969 50%, #808080 100%)',
                            borderRadius: '40% 60% 70% 30% / 35% 45% 55% 65%',
                            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.5))',
                            top: '15%',
                            left: '7%'
                        }} />
                        {/* Rock highlight */}
                        <div style={{
                            position: 'absolute',
                            width: '30%',
                            height: '25%',
                            background: 'linear-gradient(135deg, #D3D3D3 0%, #A9A9A9 100%)',
                            borderRadius: '50% 70% 40% 60%',
                            top: '20%',
                            left: '20%',
                            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
                        }} />
                        {/* Small rock detail */}
                        <div style={{
                            position: 'absolute',
                            width: '20%',
                            height: '15%',
                            background: 'linear-gradient(45deg, #808080 0%, #555555 100%)',
                            borderRadius: '60% 40% 50% 70%',
                            bottom: '25%',
                            right: '15%',
                            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.4))'
                        }} />
                    </div>
                );
            case 'bush':
                return (
                    <div style={{
                        width: '85%',
                        height: '85%',
                        background: 'radial-gradient(circle at 40% 40%, #90EE90 0%, #228B22 80%)',
                        borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
                        border: '2px solid #006400',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left: '30%',
                            width: '15%',
                            height: '15%',
                            background: '#32CD32',
                            borderRadius: '50%'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '40%',
                            right: '25%',
                            width: '12%',
                            height: '12%',
                            background: '#90EE90',
                            borderRadius: '50%'
                        }} />
                    </div>
                );
            case 'lantern':
                return (
                    <div style={{
                        width: '80%',
                        height: '80%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Use the custom SVG image if available */}
                        {objectType.image ? (
                            <img
                                src={objectType.image}
                                alt="Lantern"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 204, 0.6))'
                                }}
                                onError={(e) => {
                                    // Fallback to CSS lantern if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        {/* CSS Fallback Lantern */}
                        <div style={{
                            display: objectType.image ? 'none' : 'block',
                            width: '100%',
                            height: '100%',
                            position: 'relative'
                        }}>
                            {/* Lantern body */}
                            <div style={{
                                position: 'absolute',
                                top: '20%',
                                left: '25%',
                                width: '50%',
                                height: '60%',
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                                borderRadius: '10px 10px 5px 5px',
                                border: '2px solid #B8860B',
                                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                            }} />
                            {/* Lantern flame */}
                            <div style={{
                                position: 'absolute',
                                top: '30%',
                                left: '40%',
                                width: '20%',
                                height: '30%',
                                background: 'radial-gradient(circle, #FFFF00 0%, #FF4500 70%)',
                                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                animation: 'flicker 1.5s ease-in-out infinite alternate'
                            }} />
                            {/* Lantern handle */}
                            <div style={{
                                position: 'absolute',
                                top: '15%',
                                left: '35%',
                                width: '30%',
                                height: '8%',
                                background: '#8B4513',
                                borderRadius: '50%',
                                border: '1px solid #654321'
                            }} />
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{
                        width: '60%',
                        height: '60%',
                        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
                        border: '2px solid #654321',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        ?
                    </div>
                );
        }
    };

    return (
        <>
            <div
                ref={overlayRef}
                className="tile-overlay"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onContextMenu={handleContextMenu}
            >
                {/* Render terrain tiles */}
                {contentTiles.map((tile) => {
                    // Use the same coordinate system as the main grid
                    try {
                        const gridSystem = getGridSystem();
                        const viewport = gridSystem.getViewportDimensions();
                        const worldPos = gridSystem.gridToWorldCorner(tile.x, tile.y);
                        const screenPos = gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);

                        const screenX = screenPos.x;
                        const screenY = screenPos.y;

                        const terrain = TERRAIN_TYPES[tile.terrainType];
                        const isHovered = hoveredTile === `${tile.x},${tile.y}`;

                        // Get terrain-specific styling
                        const getTerrainStyle = (terrainType) => {
                            if (!terrainType || !terrain) return {};

                            const baseStyle = {
                                backgroundColor: terrain.color,
                                opacity: 1.0 // Fully opaque for maximum visibility
                            };

                            // If tile is fogged and not in GM mode, darken and disable animations
                            if (tile.hasFog && !isGMMode) {
                                return {
                                    ...baseStyle,
                                    filter: 'brightness(0.2) contrast(0.8)', // Darken significantly but keep visible
                                    animation: 'none', // Disable all animations
                                    boxShadow: 'none', // Remove shadows/glows
                                    backgroundImage: 'none' // Remove patterns
                                };
                            }

                            // Add texture patterns based on terrain type
                            switch (terrainType) {
                                case 'grass':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#4a7c59', // Solid grass green background
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 2px),
                                            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 2px)
                                        `,
                                        backgroundSize: '8px 8px, 12px 12px',
                                        boxShadow: 'inset 0 0 4px rgba(74, 124, 89, 0.3)',
                                        animation: 'grassSway 4s ease-in-out infinite'
                                    };
                                case 'stone':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#6b7280', // Solid stone gray background
                                        backgroundImage: `
                                            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 2px, transparent 3px),
                                            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 1px, transparent 2px)
                                        `,
                                        backgroundSize: '16px 16px, 12px 12px',
                                        boxShadow: 'inset 0 0 6px rgba(107, 114, 128, 0.4)',
                                        animation: 'stoneShimmer 6s ease-in-out infinite'
                                    };
                                case 'dirt':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#8b5a3c', // Solid dirt brown background
                                        backgroundImage: `
                                            radial-gradient(circle at 20% 40%, rgba(160,101,77,0.3) 1px, transparent 2px),
                                            radial-gradient(circle at 80% 60%, rgba(107,69,48,0.3) 1px, transparent 2px)
                                        `,
                                        backgroundSize: '10px 10px, 14px 14px',
                                        boxShadow: 'inset 0 0 5px rgba(139, 90, 60, 0.3)',
                                        animation: 'dirtCrumble 5s ease-in-out infinite'
                                    };
                                case 'cobblestone':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#9ca3af', // Solid cobblestone gray background
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 2px),
                                            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.2) 1px, transparent 2px)
                                        `,
                                        backgroundSize: '12px 12px, 16px 16px',
                                        boxShadow: 'inset 0 0 4px rgba(122, 133, 145, 0.3)'
                                    };
                                case 'shallowWater':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#4a90e2', // More solid blue background
                                        background: `
                                            radial-gradient(ellipse at 30% 20%, #7cc3f7 0%, #3b82f6 60%),
                                            radial-gradient(ellipse at 70% 80%, #59a5fa 0%, #2563eb 50%),
                                            radial-gradient(ellipse at 20% 70%, #93c5fd 0%, #3b82f6 55%),
                                            linear-gradient(135deg, #3b82f6 0%, #7cc3f7 25%, #3b82f6 50%, #2563eb 75%, #60a5fa 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.9) 3px, transparent 4px),
                                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.7) 2px, transparent 3px),
                                            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.5) 1px, transparent 2px),
                                            radial-gradient(circle at 10% 90%, rgba(255,255,255,0.6) 2px, transparent 3px),
                                            linear-gradient(45deg, rgba(255,255,255,0.3) 1px, transparent 1px),
                                            linear-gradient(-45deg, rgba(59,130,246,0.4) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '20px 20px, 15px 15px, 12px 12px, 18px 18px, 8px 8px, 8px 8px',
                                        boxShadow: 'inset 0 0 15px rgba(59, 130, 246, 0.7), 0 0 10px rgba(124, 195, 247, 0.5)',
                                        animation: 'waterRipple 3s ease-in-out infinite, waterShimmer 2s ease-in-out infinite alternate'
                                    };
                                case 'deepWater':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#1e40af', // More solid dark blue background
                                        background: `
                                            radial-gradient(ellipse at 40% 30%, #2563eb 0%, #1e40af 70%),
                                            radial-gradient(ellipse at 60% 70%, #1d4ed8 0%, #1e3a8a 65%),
                                            radial-gradient(ellipse at 20% 80%, #1e40af 0%, #1e3a8a 60%),
                                            linear-gradient(135deg, #1e40af 0%, #2563eb 20%, #1d4ed8 40%, #1e3a8a 60%, #1e40af 80%, #2563eb 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 4px, transparent 5px),
                                            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 3px, transparent 4px),
                                            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.3) 2px, transparent 3px),
                                            radial-gradient(circle at 10% 50%, rgba(37,99,235,0.8) 3px, transparent 4px),
                                            linear-gradient(60deg, rgba(255,255,255,0.2) 1px, transparent 1px),
                                            linear-gradient(-60deg, rgba(29,78,216,0.5) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '25px 25px, 18px 18px, 15px 15px, 22px 22px, 10px 10px, 10px 10px',
                                        boxShadow: 'inset 0 0 20px rgba(30, 64, 175, 0.9), 0 0 15px rgba(37, 99, 235, 0.6)',
                                        animation: 'deepWaterFlow 4s ease-in-out infinite, waterShimmer 3s ease-in-out infinite alternate'
                                    };
                                case 'sand':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#fbbf24', // Solid deep sand background
                                        background: `
                                            #fbbf24,
                                            linear-gradient(45deg, #fbbf24 0%, #fcd34d 25%, #fbbf24 50%, #f59e0b 75%, #fbbf24 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 1px, transparent 2px),
                                            radial-gradient(circle at 60% 60%, rgba(245,158,11,0.5) 1px, transparent 2px),
                                            radial-gradient(circle at 80% 20%, rgba(252,211,77,0.4) 1px, transparent 2px),
                                            radial-gradient(circle at 40% 80%, rgba(251,191,36,0.3) 2px, transparent 3px)
                                        `,
                                        backgroundSize: '6px 6px, 8px 8px, 10px 10px, 12px 12px',
                                        boxShadow: 'inset 0 0 8px rgba(251, 191, 36, 0.4)',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'lava':
                                    return {
                                        ...baseStyle,
                                        background: `
                                            radial-gradient(ellipse at 30% 20%, #ffff00 0%, #dc2626 40%),
                                            radial-gradient(ellipse at 70% 80%, #ffa500 0%, #b91c1c 45%),
                                            radial-gradient(ellipse at 20% 70%, #ff4500 0%, #7f1d1d 50%),
                                            radial-gradient(ellipse at 80% 30%, #dc2626 0%, #991b1b 55%),
                                            linear-gradient(135deg, #dc2626 0%, #ef4444 15%, #ff4500 30%, #ffa500 45%, #dc2626 60%, #b91c1c 75%, #ef4444 90%, #dc2626 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(255,255,0,1) 4px, transparent 5px),
                                            radial-gradient(circle at 75% 75%, rgba(255,165,0,1) 3px, transparent 4px),
                                            radial-gradient(circle at 50% 10%, rgba(255,69,0,0.9) 2px, transparent 3px),
                                            radial-gradient(circle at 10% 90%, rgba(255,255,255,0.8) 1px, transparent 2px),
                                            radial-gradient(circle at 90% 10%, rgba(255,140,0,0.7) 3px, transparent 4px),
                                            linear-gradient(45deg, rgba(255,255,0,0.5) 1px, transparent 1px),
                                            linear-gradient(-45deg, rgba(255,69,0,0.6) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '15px 15px, 20px 20px, 12px 12px, 8px 8px, 18px 18px, 6px 6px, 6px 6px',
                                        boxShadow: 'inset 0 0 20px rgba(220, 38, 38, 1), 0 0 25px rgba(255, 165, 0, 0.8), 0 0 35px rgba(255, 255, 0, 0.6)',
                                        animation: 'lavaFlow 2s ease-in-out infinite, lavaBubble 3s ease-in-out infinite alternate, lavaGlow 1.5s ease-in-out infinite alternate'
                                    };
                                case 'ice':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#bfdbfe', // Solid ice background
                                        background: `
                                            #bfdbfe,
                                            linear-gradient(45deg, #dbeafe 0%, #bfdbfe 25%, #dbeafe 50%, #93c5fd 75%, #dbeafe 100%)
                                        `,
                                        backgroundImage: `
                                            linear-gradient(45deg, rgba(255,255,255,0.6) 25%, transparent 25%),
                                            linear-gradient(-45deg, rgba(255,255,255,0.4) 25%, transparent 25%),
                                            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 2px, transparent 3px),
                                            radial-gradient(circle at 70% 70%, rgba(147,197,253,0.5) 1px, transparent 2px)
                                        `,
                                        backgroundSize: '8px 8px, 8px 8px, 12px 12px, 10px 10px',
                                        boxShadow: 'inset 0 0 15px rgba(255,255,255,0.8), 0 0 8px rgba(147,197,253,0.4)',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'swamp':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#365314', // Solid swampland background
                                        background: `
                                            #365314,
                                            radial-gradient(ellipse at 20% 30%, #4d7c0f 0%, #365314 60%),
                                            radial-gradient(ellipse at 80% 70%, #166534 0%, #365314 50%),
                                            linear-gradient(135deg, #365314 0%, #4d7c0f 25%, #166534 50%, #365314 75%, #4d7c0f 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(139,69,19,0.4) 2px, transparent 3px),
                                            radial-gradient(circle at 75% 75%, rgba(34,197,94,0.3) 1px, transparent 2px),
                                            radial-gradient(circle at 50% 10%, rgba(77,124,15,0.5) 1px, transparent 2px),
                                            radial-gradient(circle at 10% 90%, rgba(22,101,52,0.4) 2px, transparent 3px),
                                            linear-gradient(60deg, rgba(139,69,19,0.2) 1px, transparent 1px),
                                            linear-gradient(-30deg, rgba(34,197,94,0.2) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '14px 14px, 10px 10px, 8px 8px, 16px 16px, 6px 6px, 6px 6px',
                                        boxShadow: 'inset 0 0 12px rgba(54, 83, 20, 0.6), 0 0 8px rgba(77, 124, 15, 0.3)',
                                        animation: 'swampBubble 4s ease-in-out infinite, swampMist 6s ease-in-out infinite alternate',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'mud':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#78350f', // Solid thick mud background
                                        background: `
                                            #78350f,
                                            radial-gradient(ellipse at 30% 20%, #92400e 0%, #78350f 70%),
                                            radial-gradient(ellipse at 70% 80%, #a16207 0%, #78350f 60%),
                                            linear-gradient(45deg, #78350f 0%, #92400e 30%, #a16207 60%, #78350f 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 20% 40%, rgba(161,98,7,0.6) 2px, transparent 3px),
                                            radial-gradient(circle at 80% 60%, rgba(146,64,14,0.5) 1px, transparent 2px),
                                            radial-gradient(circle at 50% 20%, rgba(120,53,15,0.7) 1px, transparent 2px),
                                            radial-gradient(circle at 30% 80%, rgba(161,98,7,0.4) 3px, transparent 4px),
                                            linear-gradient(30deg, rgba(146,64,14,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '12px 12px, 8px 8px, 6px 6px, 18px 18px, 4px 4px',
                                        boxShadow: 'inset 0 0 10px rgba(120, 53, 15, 0.8), 0 0 6px rgba(146, 64, 14, 0.4)',
                                        animation: 'mudStick 5s ease-in-out infinite',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'rubble':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#a3a3a3', // Solid rubble background
                                        background: `
                                            #a3a3a3,
                                            radial-gradient(ellipse at 25% 25%, #d4d4d8 0%, #a3a3a3 50%),
                                            radial-gradient(ellipse at 75% 75%, #71717a 0%, #a3a3a3 60%),
                                            radial-gradient(ellipse at 50% 10%, #9ca3af 0%, #a3a3a3 45%),
                                            linear-gradient(135deg, #a3a3a3 0%, #d4d4d8 20%, #71717a 40%, #9ca3af 60%, #a3a3a3 80%, #d4d4d8 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 15% 15%, rgba(212,212,216,0.8) 3px, transparent 4px),
                                            radial-gradient(circle at 85% 85%, rgba(113,113,122,0.7) 2px, transparent 3px),
                                            radial-gradient(circle at 45% 25%, rgba(156,163,175,0.6) 1px, transparent 2px),
                                            radial-gradient(circle at 25% 75%, rgba(212,212,216,0.5) 4px, transparent 5px),
                                            radial-gradient(circle at 75% 25%, rgba(113,113,122,0.6) 2px, transparent 3px),
                                            linear-gradient(45deg, rgba(212,212,216,0.3) 1px, transparent 1px),
                                            linear-gradient(-45deg, rgba(113,113,122,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '16px 16px, 12px 12px, 8px 8px, 20px 20px, 14px 14px, 6px 6px, 6px 6px',
                                        boxShadow: 'inset 0 0 8px rgba(163, 163, 163, 0.5), 0 0 4px rgba(113, 113, 122, 0.3)',
                                        animation: 'rubbleShift 7s ease-in-out infinite',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'thickVegetation':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#166534', // Solid thick vegetation background
                                        background: `
                                            #166534,
                                            radial-gradient(ellipse at 30% 20%, #16a34a 0%, #166534 65%),
                                            radial-gradient(ellipse at 70% 80%, #15803d 0%, #166534 55%),
                                            radial-gradient(ellipse at 20% 70%, #22c55e 0%, #166534 70%),
                                            linear-gradient(60deg, #166534 0%, #16a34a 25%, #15803d 50%, #22c55e 75%, #166534 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(34,197,94,0.6) 2px, transparent 3px),
                                            radial-gradient(circle at 75% 75%, rgba(21,128,61,0.5) 1px, transparent 2px),
                                            radial-gradient(circle at 50% 10%, rgba(22,163,74,0.7) 1px, transparent 2px),
                                            radial-gradient(circle at 10% 90%, rgba(34,197,94,0.4) 3px, transparent 4px),
                                            radial-gradient(circle at 90% 30%, rgba(21,128,61,0.5) 2px, transparent 3px),
                                            linear-gradient(45deg, rgba(34,197,94,0.3) 1px, transparent 1px),
                                            linear-gradient(-45deg, rgba(21,128,61,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '10px 10px, 8px 8px, 6px 6px, 14px 14px, 12px 12px, 4px 4px, 4px 4px',
                                        boxShadow: 'inset 0 0 12px rgba(22, 101, 52, 0.7), 0 0 8px rgba(34, 197, 94, 0.4)',
                                        animation: 'vegetationRustle 3s ease-in-out infinite, vegetationGrow 8s ease-in-out infinite alternate',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'snow':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#f3f4f6', // Solid deep snow background
                                        background: `
                                            #f3f4f6,
                                            radial-gradient(ellipse at 30% 30%, #ffffff 0%, #f3f4f6 60%),
                                            radial-gradient(ellipse at 70% 70%, #e5e7eb 0%, #f3f4f6 50%),
                                            linear-gradient(135deg, #f3f4f6 0%, #ffffff 25%, #e5e7eb 50%, #f3f4f6 75%, #ffffff 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 2px, transparent 3px),
                                            radial-gradient(circle at 80% 80%, rgba(229,231,235,0.7) 1px, transparent 2px),
                                            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.8) 1px, transparent 2px),
                                            radial-gradient(circle at 10% 70%, rgba(229,231,235,0.6) 3px, transparent 4px),
                                            radial-gradient(circle at 90% 30%, rgba(255,255,255,0.7) 2px, transparent 3px),
                                            linear-gradient(60deg, rgba(255,255,255,0.4) 1px, transparent 1px),
                                            linear-gradient(-30deg, rgba(229,231,235,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '12px 12px, 8px 8px, 6px 6px, 16px 16px, 14px 14px, 5px 5px, 5px 5px',
                                        boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.8), 0 0 10px rgba(229, 231, 235, 0.5)',
                                        animation: 'snowSparkle 4s ease-in-out infinite, snowDrift 6s ease-in-out infinite alternate',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'acid':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#84cc16',
                                        background: `
                                            radial-gradient(ellipse at 25% 25%, #a3e635 0%, #84cc16 50%),
                                            radial-gradient(ellipse at 75% 75%, #65a30d 0%, #84cc16 60%),
                                            radial-gradient(ellipse at 50% 10%, #bef264 0%, #84cc16 45%),
                                            linear-gradient(135deg, #84cc16 0%, #a3e635 20%, #65a30d 40%, #bef264 60%, #84cc16 80%, #a3e635 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 20% 30%, rgba(190,242,100,0.8) 3px, transparent 4px),
                                            radial-gradient(circle at 80% 70%, rgba(163,230,53,0.7) 2px, transparent 3px),
                                            radial-gradient(circle at 50% 20%, rgba(101,163,13,0.6) 1px, transparent 2px),
                                            radial-gradient(circle at 30% 80%, rgba(190,242,100,0.5) 4px, transparent 5px),
                                            radial-gradient(circle at 70% 40%, rgba(163,230,53,0.6) 2px, transparent 3px),
                                            linear-gradient(60deg, rgba(190,242,100,0.4) 1px, transparent 1px),
                                            linear-gradient(-30deg, rgba(101,163,13,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '14px 14px, 10px 10px, 8px 8px, 18px 18px, 12px 12px, 6px 6px, 6px 6px',
                                        boxShadow: 'inset 0 0 15px rgba(132, 204, 22, 0.8), 0 0 12px rgba(163, 230, 53, 0.6), 0 0 20px rgba(190, 242, 100, 0.4)',
                                        animation: 'acidBubble 2s ease-in-out infinite, acidCorrosion 4s ease-in-out infinite alternate'
                                    };
                                case 'poisonGas':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#a3a3a3',
                                        background: `
                                            radial-gradient(ellipse at 30% 20%, #d4d4d8 0%, #a3a3a3 70%),
                                            radial-gradient(ellipse at 70% 80%, #71717a 0%, #a3a3a3 60%),
                                            radial-gradient(ellipse at 20% 70%, #9ca3af 0%, #a3a3a3 65%),
                                            linear-gradient(45deg, #a3a3a3 0%, #d4d4d8 25%, #71717a 50%, #9ca3af 75%, #a3a3a3 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, rgba(212,212,216,0.6) 4px, transparent 8px),
                                            radial-gradient(circle at 75% 75%, rgba(113,113,122,0.5) 3px, transparent 6px),
                                            radial-gradient(circle at 50% 10%, rgba(156,163,175,0.7) 2px, transparent 5px),
                                            radial-gradient(circle at 10% 90%, rgba(212,212,216,0.4) 5px, transparent 10px),
                                            radial-gradient(circle at 90% 30%, rgba(113,113,122,0.5) 3px, transparent 7px),
                                            linear-gradient(30deg, rgba(212,212,216,0.3) 2px, transparent 4px),
                                            linear-gradient(-60deg, rgba(113,113,122,0.2) 1px, transparent 3px)
                                        `,
                                        backgroundSize: '20px 20px, 16px 16px, 12px 12px, 24px 24px, 18px 18px, 8px 8px, 6px 6px',
                                        boxShadow: 'inset 0 0 12px rgba(163, 163, 163, 0.6), 0 0 15px rgba(113, 113, 122, 0.4)',
                                        animation: 'poisonSwirl 3s ease-in-out infinite, poisonDrift 5s ease-in-out infinite alternate'
                                    };
                                case 'magicCircle':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#8b5cf6',
                                        background: `
                                            radial-gradient(ellipse at 50% 50%, #a78bfa 0%, #8b5cf6 40%),
                                            radial-gradient(ellipse at 30% 30%, #c4b5fd 0%, #8b5cf6 60%),
                                            radial-gradient(ellipse at 70% 70%, #7c3aed 0%, #8b5cf6 50%),
                                            linear-gradient(0deg, #8b5cf6 0%, #a78bfa 25%, #7c3aed 50%, #c4b5fd 75%, #8b5cf6 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 50% 50%, rgba(196,181,253,0.9) 8px, transparent 12px),
                                            radial-gradient(circle at 50% 50%, rgba(167,139,250,0.7) 15px, transparent 20px),
                                            radial-gradient(circle at 25% 25%, rgba(124,58,237,0.6) 3px, transparent 4px),
                                            radial-gradient(circle at 75% 75%, rgba(196,181,253,0.5) 2px, transparent 3px),
                                            radial-gradient(circle at 25% 75%, rgba(167,139,250,0.6) 3px, transparent 4px),
                                            radial-gradient(circle at 75% 25%, rgba(124,58,237,0.5) 2px, transparent 3px),
                                            linear-gradient(45deg, rgba(196,181,253,0.4) 1px, transparent 1px),
                                            linear-gradient(-45deg, rgba(124,58,237,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '30px 30px, 40px 40px, 10px 10px, 8px 8px, 12px 12px, 10px 10px, 4px 4px, 4px 4px',
                                        boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.8), 0 0 25px rgba(167, 139, 250, 0.6), 0 0 35px rgba(196, 181, 253, 0.4)',
                                        animation: 'magicPulse 2s ease-in-out infinite, magicRunes 4s ease-in-out infinite alternate'
                                    };
                                case 'holyGround':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#fbbf24',
                                        background: `
                                            radial-gradient(ellipse at 50% 50%, #fde047 0%, #fbbf24 50%),
                                            radial-gradient(ellipse at 30% 30%, #facc15 0%, #fbbf24 60%),
                                            radial-gradient(ellipse at 70% 70%, #f59e0b 0%, #fbbf24 55%),
                                            linear-gradient(45deg, #fbbf24 0%, #fde047 25%, #f59e0b 50%, #facc15 75%, #fbbf24 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 50% 50%, rgba(253,224,71,0.9) 6px, transparent 10px),
                                            radial-gradient(circle at 50% 50%, rgba(250,204,21,0.7) 12px, transparent 16px),
                                            radial-gradient(circle at 25% 25%, rgba(245,158,11,0.6) 2px, transparent 3px),
                                            radial-gradient(circle at 75% 75%, rgba(253,224,71,0.5) 3px, transparent 4px),
                                            radial-gradient(circle at 25% 75%, rgba(250,204,21,0.6) 2px, transparent 3px),
                                            radial-gradient(circle at 75% 25%, rgba(245,158,11,0.5) 3px, transparent 4px),
                                            linear-gradient(0deg, rgba(253,224,71,0.4) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(250,204,21,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '24px 24px, 32px 32px, 8px 8px, 10px 10px, 8px 8px, 10px 10px, 6px 6px, 6px 6px',
                                        boxShadow: 'inset 0 0 18px rgba(251, 191, 36, 0.8), 0 0 20px rgba(253, 224, 71, 0.6), 0 0 30px rgba(250, 204, 21, 0.4)',
                                        animation: 'holyRadiance 3s ease-in-out infinite, holyBless 5s ease-in-out infinite alternate'
                                    };
                                case 'teleportPad':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#06b6d4', // Solid teleport pad background
                                        background: `
                                            #06b6d4,
                                            radial-gradient(ellipse at 50% 50%, #22d3ee 0%, #06b6d4 60%),
                                            linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #06b6d4 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 50% 50%, rgba(34,211,238,0.4) 8px, transparent 12px),
                                            radial-gradient(circle at 25% 25%, rgba(103,232,249,0.3) 2px, transparent 3px),
                                            radial-gradient(circle at 75% 75%, rgba(8,145,178,0.3) 2px, transparent 3px),
                                            linear-gradient(45deg, rgba(34,211,238,0.2) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '20px 20px, 8px 8px, 8px 8px, 4px 4px',
                                        boxShadow: 'inset 0 0 8px rgba(6, 182, 212, 0.4), 0 0 6px rgba(34, 211, 238, 0.3)',
                                        animation: 'teleportSubtle 4s ease-in-out infinite',
                                        opacity: 1.0 // Ensure full opacity
                                    };
                                case 'antiMagic':
                                    return {
                                        ...baseStyle,
                                        backgroundColor: '#374151',
                                        background: `
                                            radial-gradient(ellipse at 40% 40%, #4b5563 0%, #374151 60%),
                                            radial-gradient(ellipse at 60% 60%, #1f2937 0%, #374151 50%),
                                            radial-gradient(ellipse at 20% 80%, #6b7280 0%, #374151 70%),
                                            linear-gradient(90deg, #374151 0%, #4b5563 25%, #1f2937 50%, #6b7280 75%, #374151 100%)
                                        `,
                                        backgroundImage: `
                                            radial-gradient(circle at 50% 50%, rgba(107,114,128,0.7) 12px, transparent 18px),
                                            radial-gradient(circle at 50% 50%, rgba(75,85,99,0.5) 20px, transparent 28px),
                                            radial-gradient(circle at 30% 30%, rgba(31,41,55,0.6) 2px, transparent 3px),
                                            radial-gradient(circle at 70% 70%, rgba(107,114,128,0.4) 3px, transparent 4px),
                                            radial-gradient(circle at 30% 70%, rgba(75,85,99,0.5) 2px, transparent 3px),
                                            radial-gradient(circle at 70% 30%, rgba(31,41,55,0.4) 3px, transparent 4px),
                                            linear-gradient(0deg, rgba(107,114,128,0.3) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(31,41,55,0.2) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '40px 40px, 60px 60px, 10px 10px, 12px 12px, 10px 10px, 12px 12px, 8px 8px, 6px 6px',
                                        boxShadow: 'inset 0 0 16px rgba(55, 65, 81, 0.9), 0 0 12px rgba(75, 85, 99, 0.5)',
                                        animation: 'antiMagicSuppress 4s ease-in-out infinite, antiMagicVoid 6s ease-in-out infinite alternate'
                                    };
                                default:
                                    return baseStyle;
                            }
                        };

                        // Terrain styling disabled - handled by TerrainSystem

                        return (
                        <div
                            key={`${tile.x},${tile.y}`}
                            className={`tile-content ${isHovered ? 'hovered' : ''} ${tile.hasFog && !isGMMode ? 'fogged-player' : ''}`}
                            style={{
                                position: 'absolute',
                                left: screenX,
                                top: screenY,
                                width: tileSize * effectiveZoom,
                                height: tileSize * effectiveZoom,
                                backgroundColor: 'transparent', // No terrain rendering in TileOverlay
                                border: tile.hasFog && !isGMMode
                                    ? 'none' // No border for fogged tiles in player mode
                                    : isHovered ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.1)',
                                borderRadius: '2px',
                                pointerEvents: (tile.hasObjects && !tile.hasFog) ? 'all' : 'none', // Disable object interaction when fogged
                                zIndex: 7,
                                overflow: 'hidden'
                            }}
                        >
                            {/* Environmental Objects - Full tile rendering */}
                            {showObjectLayer && environmentalObjects
                                .filter(obj => {
                                    // Skip objects with free positioning (they're rendered by ObjectSystem)
                                    if (obj.freePosition) return false;

                                    // Skip GM-only objects for players
                                    const objectDef = PROFESSIONAL_OBJECTS[obj.type];
                                    if (objectDef?.gmOnly && !isGMMode) return false;

                                    const objX = obj.position?.x ?? obj.gridX;
                                    const objY = obj.position?.y ?? obj.gridY;
                                    return objX !== undefined && objY !== undefined &&
                                           Math.floor(objX) === tile.x && Math.floor(objY) === tile.y;
                                })
                                .map((obj, index) => {
                                    const objectType = OBJECT_TYPES[obj.type];
                                    if (!objectType) return null;

                                    // Check if this object is under fog of war
                                    const objX = obj.position?.x ?? obj.gridX;
                                    const objY = obj.position?.y ?? obj.gridY;
                                    const objGridX = Math.floor(objX);
                                    const objGridY = Math.floor(objY);
                                    const hasFog = getFogOfWar(objGridX, objGridY);

                                    return (
                                        <div
                                            key={`object-${obj.id}-${index}`}
                                            className={`environmental-object object-${obj.type}`}
                                            data-state={obj.state || objectType.states?.[0] || 'default'}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: `${Math.max(16, tileSize * effectiveZoom * 0.6)}px`,
                                                zIndex: hasFog ? 5 : 8, // Lower z-index when fogged so fog overlay appears on top
                                                pointerEvents: hasFog ? 'none' : 'all', // Disable interaction when fogged
                                                cursor: (hasFog || !objectType.states) ? 'default' : 'pointer',
                                                opacity: hasFog ? (isGMMode ? 0.3 : 0) : 1, // Hide from players, semi-transparent for GM
                                                ...getObjectStyle(objectType, obj)
                                            }}
                                            onClick={(e) => {
                                                if (hasFog) return; // Prevent interaction when fogged
                                                e.stopPropagation();
                                                handleObjectClick(obj, objectType);
                                            }}
                                            onMouseEnter={(e) => handleObjectMouseEnter(obj, objectType, e)}
                                            onMouseLeave={handleObjectMouseLeave}
                                        >
                                            {getObjectContent(objectType, obj)}
                                        </div>
                                    );
                                })
                            }

                            {/* D&D element indicators */}
                            {showDndLayer && tile.hasDndElements &&
                                dndElements
                                    .filter(element => {
                                        const elemX = element.position?.x ?? element.gridX;
                                        const elemY = element.position?.y ?? element.gridY;
                                        return elemX !== undefined && elemY !== undefined &&
                                               Math.floor(elemX) === tile.x && Math.floor(elemY) === tile.y;
                                    })
                                    .map((element, idx) => {
                                        const elementType = DND_ELEMENTS[element.type];
                                        if (!elementType) return null;

                                        // Check if this D&D element is under fog of war
                                        const elemX = element.position?.x ?? element.gridX;
                                        const elemY = element.position?.y ?? element.gridY;
                                        const elemGridX = Math.floor(elemX);
                                        const elemGridY = Math.floor(elemY);
                                        const hasFog = getFogOfWar(elemGridX, elemGridY);

                                        const isPortal = element.type === 'portal';
                                        const isInteractive = elementType.interactive || elementType.clickable;

                                        return (
                                            <div
                                                key={`dnd-${element.id}-${idx}`}
                                                className={`dnd-element ${isPortal ? 'portal-element' : ''} ${isInteractive ? 'interactive' : ''}`}
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    fontSize: '20px',
                                                    zIndex: hasFog ? 5 : 9, // Lower z-index when fogged so fog overlay appears on top
                                                    pointerEvents: (hasFog || !isInteractive) ? 'none' : 'auto', // Disable interaction when fogged
                                                    cursor: (hasFog || !isInteractive) ? 'default' : 'pointer',
                                                    opacity: hasFog ? (isGMMode ? 0.3 : 0) : 1, // Hide from players, semi-transparent for GM
                                                    transition: 'all 0.3s ease',
                                                    filter: isPortal && elementType.properties?.glowEffect && !hasFog
                                                        ? 'drop-shadow(0 0 8px rgba(74, 144, 226, 0.6))'
                                                        : 'none',
                                                    animation: isPortal && elementType.properties?.pulseAnimation && !hasFog
                                                        ? 'portalPulse 2s ease-in-out infinite'
                                                        : 'none'
                                                }}
                                                title={hasFog ? '' : `${elementType.name}: ${elementType.description}${isPortal ? ' (Click to configure)' : ''}`}
                                                onClick={isInteractive && !hasFog ? (e) => {
                                                    e.stopPropagation();
                                                    if (isPortal) {
                                                        handlePortalClick(element);
                                                    }
                                                } : undefined}
                                                onMouseEnter={isInteractive && !hasFog ? (e) => {
                                                    e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
                                                    e.target.style.filter = isPortal
                                                        ? 'drop-shadow(0 0 12px rgba(74, 144, 226, 0.8))'
                                                        : 'brightness(1.2)';
                                                } : undefined}
                                                onMouseLeave={isInteractive && !hasFog ? (e) => {
                                                    e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                                                    e.target.style.filter = isPortal && elementType.properties?.glowEffect
                                                        ? 'drop-shadow(0 0 8px rgba(74, 144, 226, 0.6))'
                                                        : 'none';
                                                } : undefined}
                                            >
                                                {elementType.icon}
                                            </div>
                                        );
                                    })
                            }

                            {/* Fog of war overlay - Complete coverage */}
                            {showDndLayer && tile.hasFog && (
                                <div
                                    className={`fog-overlay ${isGMMode ? 'gm-mode' : 'player-mode'}`}
                                    style={{
                                        position: 'absolute',
                                        top: -2, // Extend beyond tile boundaries to cover borders
                                        left: -2,
                                        width: 'calc(100% + 4px)', // Cover tile borders completely
                                        height: 'calc(100% + 4px)',
                                        backgroundColor: isGMMode
                                            ? 'rgba(0, 0, 0, 0.4)' // Semi-transparent for GM
                                            : '#000000', // Completely opaque black base for Player
                                        backgroundImage: isGMMode
                                            ? 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(212, 175, 55, 0.1) 100%)'
                                            : `
                                                linear-gradient(0deg, #000000 0%, #000000 100%),
                                                radial-gradient(circle at 25% 25%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                radial-gradient(circle at 75% 75%, rgba(15, 15, 25, 0.8) 0%, transparent 40%),
                                                radial-gradient(circle at 50% 10%, rgba(25, 25, 35, 0.7) 0%, transparent 60%),
                                                radial-gradient(circle at 10% 90%, rgba(18, 18, 28, 0.6) 0%, transparent 45%),
                                                linear-gradient(90deg, rgba(30, 30, 40, 0.8) 0%, transparent 15%, transparent 85%, rgba(30, 30, 40, 0.8) 100%),
                                                linear-gradient(0deg, rgba(25, 25, 35, 0.8) 0%, transparent 15%, transparent 85%, rgba(25, 25, 35, 0.8) 100%)
                                            `,
                                        backgroundSize: isGMMode
                                            ? '100% 100%'
                                            : '100% 100%, 60px 60px, 45px 45px, 80px 80px, 55px 55px, 100% 100%, 100% 100%',
                                        border: isGMMode
                                            ? '1px solid rgba(212, 175, 55, 0.6)' // Gold border for GM
                                            : 'none', // No border for Player
                                        borderRadius: isGMMode ? '2px' : '0',
                                        pointerEvents: 'none',
                                        zIndex: isGMMode ? 500 : 300, // Much higher z-index for both modes to cover walls (Grid.jsx walls are z-index 200)
                                        transition: 'none', // Remove transitions that might cause flicker
                                        animation: isGMMode
                                            ? 'none'
                                            : 'mysticalFog 8s ease-in-out infinite',
                                        // Ensure complete coverage
                                        boxShadow: isGMMode
                                            ? 'none'
                                            : 'inset 0 0 20px rgba(0, 0, 0, 1), 0 0 0 2px #000000',
                                        // Force complete opacity
                                        opacity: 1,
                                        filter: isGMMode ? 'none' : 'none',
                                        backdropFilter: 'none'
                                    }}
                                >
                                    {/* Additional overlay layer for player mode to ensure 100% coverage */}
                                    {!isGMMode && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#000000',
                                            opacity: 1,
                                            zIndex: 1
                                        }} />
                                    )}
                                </div>
                            )}

                            {/* Wall fog overlay - covers grid lines between fogged tiles */}
                            {showDndLayer && !isGMMode && (
                                <>
                                    {/* Vertical wall fog - right edge of tile */}
                                    {tile.hasFog && (
                                        <div
                                            className="wall-fog-overlay vertical"
                                            style={{
                                                position: 'absolute',
                                                top: -2,
                                                right: -6, // Cover the right grid line
                                                width: '12px',
                                                height: 'calc(100% + 4px)',
                                                backgroundColor: '#000000',
                                                backgroundImage: `
                                                    linear-gradient(0deg, #000000 0%, #000000 100%),
                                                    radial-gradient(circle at 50% 25%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                    linear-gradient(0deg, rgba(35, 35, 45, 0.9) 0%, transparent 20%, transparent 80%, rgba(35, 35, 45, 0.9) 100%)
                                                `,
                                                backgroundSize: '100% 100%, 20px 20px, 100% 100%',
                                                zIndex: 300,
                                                pointerEvents: 'none',
                                                animation: 'mysticalFog 8s ease-in-out infinite'
                                            }}
                                        />
                                    )}
                                    {/* Horizontal wall fog - bottom edge of tile */}
                                    {tile.hasFog && (
                                        <div
                                            className="wall-fog-overlay horizontal"
                                            style={{
                                                position: 'absolute',
                                                bottom: -6, // Cover the bottom grid line
                                                left: -2,
                                                width: 'calc(100% + 4px)',
                                                height: '12px',
                                                backgroundColor: '#000000',
                                                backgroundImage: `
                                                    linear-gradient(0deg, #000000 0%, #000000 100%),
                                                    radial-gradient(circle at 25% 50%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                    linear-gradient(90deg, rgba(35, 35, 45, 0.9) 0%, transparent 20%, transparent 80%, rgba(35, 35, 45, 0.9) 100%)
                                                `,
                                                backgroundSize: '100% 100%, 20px 20px, 100% 100%',
                                                zIndex: 300,
                                                pointerEvents: 'none',
                                                animation: 'mysticalFog 8s ease-in-out infinite'
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        );
                    } catch (error) {
                        // Fallback to original coordinate calculation if grid system fails
                        console.warn('Grid system not available, using fallback coordinates:', error);
                        const worldX = tile.x * tileSize + gridOffsetX;
                        const worldY = tile.y * tileSize + gridOffsetY;
                        const screenX = (worldX - cameraX) * effectiveZoom;
                        const screenY = (worldY - cameraY) * effectiveZoom;

                        // Terrain is handled by TerrainSystem, not TileOverlay
                        const isHovered = hoveredTile === `${tile.x},${tile.y}`;

                        return (
                            <div
                                key={`${tile.x},${tile.y}`}
                                className={`tile-content ${isHovered ? 'hovered' : ''}`}
                                style={{
                                    position: 'absolute',
                                    left: screenX,
                                    top: screenY,
                                    width: tileSize * effectiveZoom,
                                    height: tileSize * effectiveZoom,
                                    backgroundColor: 'transparent', // No terrain rendering in TileOverlay
                                    opacity: 1,
                                    border: tile.hasFog && !isGMMode
                                        ? 'none' // No border for fogged tiles in player mode
                                        : isHovered ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '2px',
                                    pointerEvents: (tile.hasObjects && !tile.hasFog) ? 'all' : 'none', // Disable object interaction when fogged
                                    zIndex: 7
                                }}
                            >
                                {/* Environmental Objects - Full tile rendering */}
                                {showObjectLayer && environmentalObjects
                                    .filter(obj => {
                                        // Skip objects with free positioning (they're rendered by ObjectSystem)
                                        if (obj.freePosition) return false;

                                        // Skip GM-only objects for players
                                        const objectDef = PROFESSIONAL_OBJECTS[obj.type];
                                        if (objectDef?.gmOnly && !isGMMode) return false;

                                        const objX = obj.position?.x ?? obj.gridX;
                                        const objY = obj.position?.y ?? obj.gridY;
                                        return objX !== undefined && objY !== undefined &&
                                               Math.floor(objX) === tile.x && Math.floor(objY) === tile.y;
                                    })
                                    .map((obj, index) => {
                                        const objectType = OBJECT_TYPES[obj.type];
                                        if (!objectType) return null;

                                        // Check if this object is under fog of war
                                        const objX = obj.position?.x ?? obj.gridX;
                                        const objY = obj.position?.y ?? obj.gridY;
                                        const objGridX = Math.floor(objX);
                                        const objGridY = Math.floor(objY);
                                        const hasFog = getFogOfWar(objGridX, objGridY);

                                        return (
                                            <div
                                                key={`object-${obj.id}-${index}`}
                                                className={`environmental-object object-${obj.type}`}
                                                data-state={obj.state || objectType.states?.[0] || 'default'}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: `${Math.max(16, tileSize * effectiveZoom * 0.6)}px`,
                                                    zIndex: hasFog ? 5 : 8, // Lower z-index when fogged so fog overlay appears on top
                                                    pointerEvents: hasFog ? 'none' : 'all', // Disable interaction when fogged
                                                    cursor: (hasFog || !objectType.states) ? 'default' : 'pointer',
                                                    opacity: hasFog ? (isGMMode ? 0.3 : 0) : 1, // Hide from players, semi-transparent for GM
                                                    ...getObjectStyle(objectType, obj)
                                                }}
                                                onClick={(e) => {
                                                    if (hasFog) return; // Prevent interaction when fogged
                                                    e.stopPropagation();
                                                    handleObjectClick(obj, objectType);
                                                }}
                                                onMouseEnter={(e) => handleObjectMouseEnter(obj, objectType, e)}
                                                onMouseLeave={handleObjectMouseLeave}
                                            >
                                                {getObjectContent(objectType, obj)}
                                            </div>
                                        );
                                    })
                                }
                                {showDndLayer && tile.hasDndElements && (
                                    <div className="dnd-indicator">
                                        {dndElements
                                            .filter(element => {
                                                const elemX = element.position?.x ?? element.gridX;
                                                const elemY = element.position?.y ?? element.gridY;
                                                return elemX !== undefined && elemY !== undefined &&
                                                       Math.floor(elemX) === tile.x && Math.floor(elemY) === tile.y;
                                            })
                                            .map(element => {
                                                const elementType = DND_ELEMENTS[element.type];
                                                // Check if this D&D element is under fog of war
                                                const elemX = element.position?.x ?? element.gridX;
                                                const elemY = element.position?.y ?? element.gridY;
                                                const elemGridX = Math.floor(elemX);
                                                const elemGridY = Math.floor(elemY);
                                                const hasFog = getFogOfWar(elemGridX, elemGridY);

                                                // Don't show D&D elements under fog
                                                if (hasFog && !isGMMode) return '';

                                                return elementType ? elementType.icon : '⚔️';
                                            })
                                            .join('')
                                        }
                                    </div>
                                )}
                                {showDndLayer && tile.hasFog && (
                                    <div
                                        className={`fog-overlay ${isGMMode ? 'gm-mode' : 'player-mode'}`}
                                        style={{
                                            position: 'absolute',
                                            top: -2, // Extend beyond tile boundaries to cover borders
                                            left: -2,
                                            width: 'calc(100% + 4px)', // Cover tile borders completely
                                            height: 'calc(100% + 4px)',
                                            backgroundColor: isGMMode
                                                ? 'rgba(0, 0, 0, 0.4)' // Semi-transparent for GM
                                                : '#000000', // Completely opaque black base for Player
                                            backgroundImage: isGMMode
                                                ? 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(212, 175, 55, 0.1) 100%)'
                                                : `
                                                    linear-gradient(0deg, #000000 0%, #000000 100%),
                                                    radial-gradient(circle at 25% 25%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                    radial-gradient(circle at 75% 75%, rgba(15, 15, 25, 0.8) 0%, transparent 40%),
                                                    radial-gradient(circle at 50% 10%, rgba(25, 25, 35, 0.7) 0%, transparent 60%),
                                                    radial-gradient(circle at 10% 90%, rgba(18, 18, 28, 0.6) 0%, transparent 45%),
                                                    linear-gradient(90deg, rgba(30, 30, 40, 0.8) 0%, transparent 15%, transparent 85%, rgba(30, 30, 40, 0.8) 100%),
                                                    linear-gradient(0deg, rgba(25, 25, 35, 0.8) 0%, transparent 15%, transparent 85%, rgba(25, 25, 35, 0.8) 100%)
                                                `,
                                            backgroundSize: isGMMode
                                                ? '100% 100%'
                                                : '100% 100%, 60px 60px, 45px 45px, 80px 80px, 55px 55px, 100% 100%, 100% 100%',
                                            border: isGMMode
                                                ? '1px solid rgba(212, 175, 55, 0.6)' // Gold border for GM
                                                : 'none', // No border for Player
                                            borderRadius: isGMMode ? '2px' : '0',
                                            pointerEvents: 'none',
                                            zIndex: isGMMode ? 500 : 300, // Much higher z-index for both modes to cover walls (Grid.jsx walls are z-index 200)
                                            transition: 'none', // Remove transitions that might cause flicker
                                            animation: isGMMode
                                                ? 'none'
                                                : 'mysticalFog 8s ease-in-out infinite',
                                            // Ensure complete coverage
                                            boxShadow: isGMMode
                                                ? 'none'
                                                : 'inset 0 0 20px rgba(0, 0, 0, 1), 0 0 0 2px #000000',
                                            // Force complete opacity
                                            opacity: 1,
                                            filter: isGMMode ? 'none' : 'none',
                                            backdropFilter: 'none'
                                        }}
                                    >
                                        {/* Additional overlay layer for player mode to ensure 100% coverage */}
                                        {!isGMMode && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#000000',
                                                opacity: 1,
                                                zIndex: 1
                                            }} />
                                        )}
                                    </div>
                                )}

                                {/* Wall fog overlay - covers grid lines between fogged tiles */}
                                {showDndLayer && !isGMMode && (
                                    <>
                                        {/* Vertical wall fog - right edge of tile */}
                                        {tile.hasFog && (
                                            <div
                                                className="wall-fog-overlay vertical"
                                                style={{
                                                    position: 'absolute',
                                                    top: -2,
                                                    right: -6, // Cover the right grid line
                                                    width: '12px',
                                                    height: 'calc(100% + 4px)',
                                                    backgroundColor: '#000000',
                                                    backgroundImage: `
                                                        linear-gradient(0deg, #000000 0%, #000000 100%),
                                                        radial-gradient(circle at 50% 25%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                        linear-gradient(0deg, rgba(35, 35, 45, 0.9) 0%, transparent 20%, transparent 80%, rgba(35, 35, 45, 0.9) 100%)
                                                    `,
                                                    backgroundSize: '100% 100%, 20px 20px, 100% 100%',
                                                    zIndex: 300,
                                                    pointerEvents: 'none',
                                                    animation: 'mysticalFog 8s ease-in-out infinite'
                                                }}
                                            />
                                        )}
                                        {/* Horizontal wall fog - bottom edge of tile */}
                                        {tile.hasFog && (
                                            <div
                                                className="wall-fog-overlay horizontal"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: -6, // Cover the bottom grid line
                                                    left: -2,
                                                    width: 'calc(100% + 4px)',
                                                    height: '12px',
                                                    backgroundColor: '#000000',
                                                    backgroundImage: `
                                                        linear-gradient(0deg, #000000 0%, #000000 100%),
                                                        radial-gradient(circle at 25% 50%, rgba(20, 20, 30, 0.9) 0%, transparent 50%),
                                                        linear-gradient(90deg, rgba(35, 35, 45, 0.9) 0%, transparent 20%, transparent 80%, rgba(35, 35, 45, 0.9) 100%)
                                                    `,
                                                    backgroundSize: '100% 100%, 20px 20px, 100% 100%',
                                                    zIndex: 300,
                                                    pointerEvents: 'none',
                                                    animation: 'mysticalFog 8s ease-in-out infinite'
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    }
                })}
            </div>

            {/* Tooltip */}
            {showTooltip && hoveredTile && (
                <TileTooltip
                    gridX={hoveredGridPos[0]}
                    gridY={hoveredGridPos[1]}
                    mouseX={mousePosition.x}
                    mouseY={mousePosition.y}
                    visible={showTooltip}
                />
            )}

            {/* Object Tooltip */}
            {showObjectTooltip && hoveredObject && (
                <ObjectTooltip
                    object={hoveredObject.obj}
                    objectType={hoveredObject.objectType}
                    mouseX={mousePosition.x}
                    mouseY={mousePosition.y}
                    visible={showObjectTooltip}
                />
            )}

            {/* Unified Context Menu */}
            <UnifiedContextMenu
                visible={showContextMenu}
                x={contextMenuPosition.x}
                y={contextMenuPosition.y}
                onClose={() => {
                    setShowContextMenu(false);
                    setSelectedObject(null);
                }}
                title={selectedObject ? `${OBJECT_TYPES[selectedObject.type]?.name || selectedObject.type}` : null}
                items={selectedObject ? [
                    ...(selectedObject.type === 'gmNotes' ? [
                        {
                            icon: <i className="fas fa-scroll"></i>,
                            label: 'Open GM Notes',
                            onClick: () => {
                                setSelectedGMNotes(selectedObject);
                                setShowGMNotesWindow(true);
                                setShowContextMenu(false);
                                setSelectedObject(null);
                            },
                            className: 'primary-action'
                        },
                        {
                            type: 'separator'
                        }
                    ] : []),
                    {
                        icon: <i className="fas fa-trash"></i>,
                        label: 'Remove',
                        onClick: handleRemoveObject,
                        className: 'danger-action'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        icon: <i className="fas fa-times"></i>,
                        label: 'Cancel',
                        onClick: () => {
                            setShowContextMenu(false);
                            setSelectedObject(null);
                        }
                    }
                ] : []}
            />

            {/* Portal Transfer Dialog */}
            <PortalTransferDialog
                isOpen={showPortalTransferDialog}
                onClose={() => {
                    setShowPortalTransferDialog(false);
                    setSelectedPortal(null);
                }}
                portal={selectedPortal}
                position={{ x: 400, y: 300 }}
            />

            {/* GM Notes Window */}
            <GMNotesWindow
                isOpen={showGMNotesWindow}
                onClose={() => {
                    setShowGMNotesWindow(false);
                    setSelectedGMNotes(null);
                }}
                gmNotesData={selectedGMNotes?.gmNotesData || { notes: '', items: [], creatures: [] }}
                onUpdateNotes={handleGMNotesUpdate}
                position={{ x: 300, y: 200 }}
            />
        </>
    );
};

export default TileOverlay;
