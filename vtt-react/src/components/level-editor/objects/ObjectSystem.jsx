import React, { useRef, useEffect, useCallback, useState } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import UnifiedContextMenu from '../UnifiedContextMenu';

// Professional object types for VTT
export const PROFESSIONAL_OBJECTS = {
    // GM Tools
    gmNotes: {
        id: 'gmNotes',
        name: 'GM Notes',
        category: 'gm',
        icon: 'inv_misc_note_02',
        image: '/assets/objects/gm-notes.png',
        size: { width: 0.8, height: 0.8 }, // Grid-aligned size
        description: 'GM prepared notes with items and creatures',
        freePosition: true, // Allow free positioning - place exactly where clicked
        draggable: true,
        resizable: false,
        clickable: true, // Can be clicked to open
        gmOnly: true, // Only visible to GM
        interactive: true
    },

};

const ObjectSystem = () => {
    const canvasRef = useRef(null);
    const imageCache = useRef(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null); // 'tl', 'tr', 'bl', 'br'
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialScale, setInitialScale] = useState(1);
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [hoveredHandle, setHoveredHandle] = useState(null);
    const dragStateRef = useRef({ isDragging: false, dragObjectId: null, dragOffsetX: 0, dragOffsetY: 0 });
    const [isOverConnection, setIsOverConnection] = useState(false);
    const connectionElementRef = useRef(null);

    // Context menu state
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedObject, setSelectedObject] = useState(null);

    // GM Notes hover state
    const [hoveredGMNote, setHoveredGMNote] = useState(null);
    const [gmNoteTooltipPosition, setGmNoteTooltipPosition] = useState({ x: 0, y: 0 });

    // Store connections
    const {
        environmentalObjects,
        isEditorMode,
        activeLayer,
        drawingLayers,
        updateEnvironmentalObject,
        selectEnvironmentalObject,
        removeEnvironmentalObject
    } = useLevelEditorStore();

    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        isGMMode,
        isBackgroundManipulationMode
    } = useGameStore();

    const { getCurrentMapId } = useMapStore();

    // Helper to get current map ID explicitly (prevents stale reads during rapid updates)
    const getExplicitCurrentMapId = () => {
        const mapStoreState = useMapStore.getState();
        return mapStoreState.currentMapId || 'default';
    };

    // Calculate effective zoom and grid positioning
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
    const gridToScreen = useCallback((gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Render objects on canvas
    const renderObjects = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Set canvas size to match container
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if objects layer is visible
        const objectsLayer = drawingLayers.find(layer => layer.id === 'objects');
        if (!objectsLayer || !objectsLayer.visible) return;

        // Always render objects if we have them
        if (!environmentalObjects || environmentalObjects.length === 0) return;

        // Calculate visible bounds for performance using grid system (supports both square and hex)
        const gridSystem = getGridSystem();
        const viewportLeft = cameraX - canvas.width / effectiveZoom / 2;
        const viewportRight = cameraX + canvas.width / effectiveZoom / 2;
        const viewportTop = cameraY - canvas.height / effectiveZoom / 2;
        const viewportBottom = cameraY + canvas.height / effectiveZoom / 2;

        const topLeftGrid = gridSystem.worldToGrid(viewportLeft, viewportTop);
        const bottomRightGrid = gridSystem.worldToGrid(viewportRight, viewportBottom);

        const startX = topLeftGrid.x - 5;
        const endX = bottomRightGrid.x + 5;
        const startY = topLeftGrid.y - 5;
        const endY = bottomRightGrid.y + 5;

        // Render objects
        environmentalObjects.forEach(obj => {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) return;

            // Skip GM-only objects for players
            if (objectDef.gmOnly && !isGMMode) return;

            let screenPos;

            // Handle free positioning vs grid-aligned positioning
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Use world coordinates for free positioning - place exactly where clicked
                // Use the same coordinate system as the grid system for consistency
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    // Fallback to manual calculation
                    const canvasWidth = canvas?.width || window.innerWidth;
                    const canvasHeight = canvas?.height || window.innerHeight;
                    const screenX = (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2;
                    const screenY = (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2;
                    screenPos = { x: screenX, y: screenY };
                }

                // For free-positioned objects, check if they're visible on screen instead of grid bounds
                const objWidth = objectDef.size.width * gridSize * effectiveZoom * (obj.scale || 1);
                const objHeight = objectDef.size.height * gridSize * effectiveZoom * (obj.scale || 1);

                // Skip if object is completely outside the visible canvas area
                // Use more generous bounds to ensure objects are visible
                if (screenPos.x + objWidth < -100 || screenPos.x - objWidth > canvas.width + 100 ||
                    screenPos.y + objHeight < -100 || screenPos.y - objHeight > canvas.height + 100) {
                    return;
                }
            } else {
                // Check if object is in visible area for grid-aligned objects
                if (obj.gridX < startX || obj.gridX > endX || obj.gridY < startY || obj.gridY > endY) {
                    return;
                }
                screenPos = gridToScreen(obj.gridX, obj.gridY);
            }

            const tileSize = gridSize * effectiveZoom;

            // Calculate object size with custom scaling
            const scale = obj.scale || 1;
            const objWidth = objectDef.size.width * tileSize * scale;
            const objHeight = objectDef.size.height * tileSize * scale;

            // Render object based on category
            renderObjectByCategory(ctx, obj, objectDef, screenPos, objWidth, objHeight);

            // Render light radius if object has lighting - use object properties if available
            const lightRadius = obj.lightRadius || objectDef.lightRadius;
            const lightColor = obj.lightColor || objectDef.lightColor;
            if (lightRadius && (isEditorMode || obj.showLight)) {
                renderLightRadius(ctx, screenPos, lightRadius * tileSize, lightColor);
            }

            // Render selection highlight if selected
            if (obj.selected) {
                renderSelectionHighlight(ctx, screenPos, objWidth, objHeight);
            }

            // Render drag handles if selected and draggable
            if (obj.selected && objectDef.draggable && isEditorMode) {
                renderDragHandles(ctx, screenPos, objWidth, objHeight);
            }
        });
    }, [environmentalObjects, effectiveZoom, gridToScreen, isEditorMode, gridSize, cameraX, cameraY, isGMMode, drawingLayers]);

    // Render object based on its category
    const renderObjectByCategory = (ctx, obj, objectDef, screenPos, width, height) => {
        ctx.save();

        switch (objectDef.category) {
            case 'gm':
                renderGMObject(ctx, objectDef, screenPos, width, height, obj);
                break;
            default:
                renderGenericObject(ctx, objectDef, screenPos, width, height);
                break;
        }

        ctx.restore();
    };





    const FA_ICON_UNICODES = {
        'scroll': '\uf70e', 'location': '\uf3c5', 'npc': '\uf0c0',
        'encounter': '\uf714', 'trap': '\uf071', 'quest': '\uf024',
        'puzzle': '\uf12e', 'treasure': '\uf3a5', 'lore': '\uf518',
        'shop': '\uf54e', 'secret': '\uf070', 'monster': '\uf6d1',
        'puzzle-door': '\uf6d5', 'event': '\uf0e7', 'read-aloud': '\uf5da',
        'safe-rest': '\uf6bb',
    };

    const renderGMObject = (ctx, objectDef, screenPos, width, height, obj) => {
        const left = screenPos.x - width / 2;
        const top = screenPos.y - height / 2;

        ctx.fillStyle = '#f8f4e6';
        ctx.fillRect(left, top, width, height);

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, width, height);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        const lineSpacing = height / 5;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(left + width * 0.1, top + lineSpacing * i);
            ctx.lineTo(left + width * 0.9, top + lineSpacing * i);
            ctx.stroke();
        }

        const noteIcon = (obj?.gmNotesData?.noteIcon) || 'scroll';
        const unicode = FA_ICON_UNICODES[noteIcon] || FA_ICON_UNICODES['scroll'];
        const iconSize = Math.min(width, height) * 0.45;

        ctx.save();
        ctx.fillStyle = '#5a1e12';
        ctx.font = `900 ${iconSize}px "Font Awesome 6 Free"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unicode, screenPos.x, screenPos.y);
        ctx.restore();
    };

    const renderGenericObject = (ctx, objectDef, screenPos, width, height) => {
        ctx.fillStyle = '#888888';
        ctx.fillRect(screenPos.x, screenPos.y, width, height);
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenPos.x, screenPos.y, width, height);
    };

    const renderLightRadius = (ctx, screenPos, radius, color) => {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = color || '#ffaa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    };

    const renderSelectionHighlight = (ctx, screenPos, width, height) => {
        ctx.save();
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(screenPos.x - width / 2 - 2, screenPos.y - height / 2 - 2, width + 4, height + 4);
        ctx.restore();
    };

    const renderDragHandles = (ctx, screenPos, width, height) => {
        ctx.save();

        // Calculate handle positions around the object
        const handleSize = 12; // Increased for easier clicking
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const handles = [
            { x: screenPos.x - halfWidth, y: screenPos.y - halfHeight }, // Top-left
            { x: screenPos.x + halfWidth, y: screenPos.y - halfHeight }, // Top-right
            { x: screenPos.x - halfWidth, y: screenPos.y + halfHeight }, // Bottom-left
            { x: screenPos.x + halfWidth, y: screenPos.y + halfHeight }, // Bottom-right
        ];

        // Draw handles
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        handles.forEach(handle => {
            ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
            ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });

        ctx.restore();
    };


    // Convert screen coordinates to world coordinates
    const screenToWorld = useCallback((screenX, screenY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);
        } catch (error) {
            const canvasWidth = canvasRef.current?.width || window.innerWidth;
            const canvasHeight = canvasRef.current?.height || window.innerHeight;
            return {
                x: ((screenX - canvasWidth / 2) / effectiveZoom) + cameraX,
                y: ((screenY - canvasHeight / 2) / effectiveZoom) + cameraY
            };
        }
    }, [effectiveZoom, cameraX, cameraY]);

    // Find object at screen position
    const getObjectAtScreenPosition = useCallback((screenX, screenY) => {
        for (const obj of environmentalObjects) {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) continue;

            let screenPos;
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Use the same coordinate system as rendering for free-positioned objects
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    // Fallback to manual calculation
                    const canvasWidth = canvasRef.current?.width || window.innerWidth;
                    const canvasHeight = canvasRef.current?.height || window.innerHeight;
                    const screenObjX = (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2;
                    const screenObjY = (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2;
                    screenPos = { x: screenObjX, y: screenObjY };
                }
            } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                // Handle grid-aligned objects
                screenPos = gridToScreen(obj.gridX, obj.gridY);
            } else {
                continue;
            }

            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = objectDef.size.width * tileSize * scale;
            const objHeight = objectDef.size.height * tileSize * scale;

            // Make clickable area slightly larger for easier interaction
            const padding = Math.max(10, tileSize * 0.1); // 10px minimum padding
            const left = screenPos.x - objWidth / 2 - padding;
            const right = screenPos.x + objWidth / 2 + padding;
            const top = screenPos.y - objHeight / 2 - padding;
            const bottom = screenPos.y + objHeight / 2 + padding;

            if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
                return obj;
            }
        }
        return null;
    }, [environmentalObjects, cameraX, cameraY, effectiveZoom, gridSize]);

    // Check if click is on a resize handle
    const getResizeHandle = useCallback((screenX, screenY, obj) => {
        if (!obj || !obj.selected) return null;

        const objectDef = PROFESSIONAL_OBJECTS[obj.type];
        if (!objectDef || !objectDef.resizable) return null;

        const screenObjX = (obj.worldX - cameraX) * effectiveZoom;
        const screenObjY = (obj.worldY - cameraY) * effectiveZoom;
        const screenPos = { x: screenObjX, y: screenObjY };

        const tileSize = gridSize * effectiveZoom;
        const scale = obj.scale || 1;
        const objWidth = objectDef.size.width * tileSize * scale;
        const objHeight = objectDef.size.height * tileSize * scale;

        const handleSize = 12; // Increased from 8 for easier clicking
        const halfWidth = objWidth / 2;
        const halfHeight = objHeight / 2;

        const handles = [
            { id: 'tl', x: screenPos.x - halfWidth, y: screenPos.y - halfHeight },
            { id: 'tr', x: screenPos.x + halfWidth, y: screenPos.y - halfHeight },
            { id: 'bl', x: screenPos.x - halfWidth, y: screenPos.y + halfHeight },
            { id: 'br', x: screenPos.x + halfWidth, y: screenPos.y + halfHeight },
        ];

        for (const handle of handles) {
            const distance = Math.sqrt(
                Math.pow(screenX - handle.x, 2) + Math.pow(screenY - handle.y, 2)
            );
            if (distance <= handleSize) {
                console.log(`🎯 Handle clicked: ${handle.id} at distance ${distance}`);
                return handle.id;
            }
        }

        return null;
    }, [environmentalObjects, cameraX, cameraY, effectiveZoom, gridSize]);

    // Get cursor style based on resize handle
    const getCursorForHandle = useCallback((handle) => {
        switch (handle) {
            case 'tl': return 'nw-resize';
            case 'tr': return 'ne-resize';
            case 'bl': return 'sw-resize';
            case 'br': return 'se-resize';
            default: return 'pointer';
        }
    }, []);

    // Helper function to check if an element is a connection element
    const isConnectionElement = (el) => {
        if (!el) return false;
        return (
            el.classList?.contains('connection-point') ||
            el.classList?.contains('portal-element') ||
            el.closest?.('.connection-point') ||
            el.closest?.('.portal-element') ||
            el.closest?.('.dnd-element.portal-element')
        );
    };

    // Handle mouse events
    const handleMouseDown = useCallback((e) => {
        // Allow mouse interactions in editor mode OR for GM notes objects when in GM mode
        if (!isEditorMode && !isGMMode) return;

        // Check if the click is on a connection element - if so, let it handle the event
        const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));
        if (connectionElement) {
            // Let the connection handle its own mouse events (for hover tooltips and clicks)
            return;
        }

        // Check if the click is on a token, HUD element, or background image - if so, ignore it here
        const elementAtPoint = allElementsAtPoint[0];
        if (elementAtPoint && (
            elementAtPoint.classList.contains('creature-token') ||
            elementAtPoint.classList.contains('character-token') ||
            elementAtPoint.closest('.creature-token') ||
            elementAtPoint.closest('.character-token') ||
            elementAtPoint.closest('.target-hud-frame') ||
            elementAtPoint.closest('.party-hud-frame') ||
            elementAtPoint.closest('.target-frame') ||
            elementAtPoint.closest('.party-member-frame')
        )) {
            console.log('ObjectSystem: ignoring click on token or HUD element');
            return; // Let the token's or HUD's own event handler deal with it
        }

        // Check if the click is on a background image - ignore it here UNLESS we're in background manipulation mode
        // In background manipulation mode, we want to allow clicks on backgrounds for resizing/moving
        if (!isBackgroundManipulationMode) {
            // Background images can be rendered as divs with backgroundImage style or as img elements
            // Also check for images in MapLibraryWindow (map-thumbnail, map-placeholder)
            const isBackgroundImage = allElementsAtPoint.some(el => {
                if (!el) return false;

                // Check if element is within MapLibraryWindow components (map-thumbnail, map-placeholder)
                const isInMapThumbnail = el.closest('.map-thumbnail') || el.closest('.map-placeholder');
                if (isInMapThumbnail) {
                    return true;
                }

                // Check if it's an img element (could be a background image)
                if (el.tagName === 'IMG') {
                    // Check if the img is within a Resizable component or background container
                    let parent = el.parentElement;
                    while (parent) {
                        // Check for Resizable component indicators
                        if (parent.classList && (
                            parent.classList.contains('react-resizable') ||
                            parent.getAttribute('data-resizable') === 'true'
                        )) {
                            return true;
                        }
                        // Check if parent has background image style
                        const parentStyle = window.getComputedStyle(parent);
                        if (parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none') {
                            return true;
                        }
                        // Check if parent is a map thumbnail/placeholder
                        if (parent.classList && (
                            parent.classList.contains('map-thumbnail') ||
                            parent.classList.contains('map-placeholder')
                        )) {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                }

                const style = window.getComputedStyle(el);
                // Check if element has a background image
                const hasBackgroundImage = style.backgroundImage && style.backgroundImage !== 'none';
                // Check if it's a manipulation handle (resize/rotate handles for backgrounds)
                const isManipulationHandle = el.hasAttribute('data-manipulation-handle');
                // Check if element is within a Resizable component
                const isInResizable = el.closest('.react-resizable') || el.closest('[data-resizable="true"]');
                // Check if element is within a background container (check parent elements)
                let parent = el.parentElement;
                while (parent) {
                    const parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none') {
                        return true;
                    }
                    // Check if parent is a map thumbnail/placeholder
                    if (parent.classList && (
                        parent.classList.contains('map-thumbnail') ||
                        parent.classList.contains('map-placeholder')
                    )) {
                        return true;
                    }
                    parent = parent.parentElement;
                }
                return hasBackgroundImage || isManipulationHandle || isInResizable;
            });

            if (isBackgroundImage) {
                // console.log('ObjectSystem: ignoring click on background image (not in manipulation mode)');
                return; // Let the background image's own event handler deal with it
            }
        }

        // Also check if any token is currently being dragged - if so, ignore all ObjectSystem interactions
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            console.log('ObjectSystem: ignoring interaction - token is being dragged');
            return;
        }

        // Only handle left clicks for dragging/selection
        if (e.button !== 0) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;

        const clickedObject = getObjectAtScreenPosition(screenX, screenY);

        if (clickedObject) {
            // In editor mode, allow all interactions
            // In GM mode (but not editor mode), only allow interactions with GM notes
            if (isEditorMode || (isGMMode && clickedObject.type === 'gmNotes')) {
                // Select the object
                selectEnvironmentalObject(clickedObject.id);

                // Only allow dragging/resizing in editor mode (or dragging GM notes in GM mode)
                const canDrag = isEditorMode || (isGMMode && clickedObject.type === 'gmNotes');
                if (canDrag) {
                    // Check if clicking on a resize handle (editor mode only)
                    const handle = isEditorMode ? getResizeHandle(screenX, screenY, clickedObject) : null;
                    console.log(`🖱️ Mouse down on object: ${clickedObject.id}, handle: ${handle}`);

                    if (handle) {
                        // Start resizing
                        console.log(`🔄 Starting resize with handle: ${handle}`);
                        setIsResizing(true);
                        setResizeHandle(handle);
                        setInitialScale(clickedObject.scale || 1);
                        setInitialMousePos({ x: screenX, y: screenY });
                        e.stopPropagation();
                    } else {
                        // Start dragging if object is draggable
                        const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
                        if (objectDef && objectDef.draggable) {
                            setIsDragging(true);
                            const worldPos = screenToWorld(screenX, screenY);
                            const offsetX = worldPos.x - clickedObject.worldX;
                            const offsetY = worldPos.y - clickedObject.worldY;
                            setDragOffset({ x: offsetX, y: offsetY });
                            dragStateRef.current = {
                                isDragging: true,
                                dragObjectId: clickedObject.id,
                                dragOffsetX: offsetX,
                                dragOffsetY: offsetY
                            };
                            e.preventDefault();

                            const handleDocMouseMove = (moveEvent) => {
                                const canvasRect = canvasRef.current?.getBoundingClientRect();
                                if (!canvasRect) return;
                                const mx = moveEvent.clientX - canvasRect.left;
                                const my = moveEvent.clientY - canvasRect.top;

                                let moveWorldPos;
                                try {
                                    const gridSystem = getGridSystem();
                                    const viewport = gridSystem.getViewportDimensions();
                                    moveWorldPos = gridSystem.screenToWorld(mx, my, viewport.width, viewport.height);
                                } catch (error) {
                                    const zoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
                                    const cx = useGameStore.getState().cameraX;
                                    const cy = useGameStore.getState().cameraY;
                                    const cw = canvasRect.width || window.innerWidth;
                                    const ch = canvasRect.height || window.innerHeight;
                                    moveWorldPos = {
                                        x: ((mx - cw / 2) / zoom) + cx,
                                        y: ((my - ch / 2) / zoom) + cy
                                    };
                                }

                                const newWorldX = moveWorldPos.x - dragStateRef.current.dragOffsetX;
                                const newWorldY = moveWorldPos.y - dragStateRef.current.dragOffsetY;
                                const mapId = useMapStore.getState().currentMapId || 'default';
                                const currentObjects = useLevelEditorStore.getState().environmentalObjects;
                                const targetObj = currentObjects.find(o => o.id === dragStateRef.current.dragObjectId);
                                if (targetObj) {
                                    useLevelEditorStore.getState().updateEnvironmentalObject(
                                        dragStateRef.current.dragObjectId,
                                        { ...targetObj, worldX: newWorldX, worldY: newWorldY },
                                        mapId
                                    );
                                }
                            };

                            const handleDocMouseUp = () => {
                                document.removeEventListener('mousemove', handleDocMouseMove);
                                document.removeEventListener('mouseup', handleDocMouseUp);
                                dragStateRef.current.isDragging = false;
                                dragStateRef.current.dragObjectId = null;
                                setIsDragging(false);
                                setDragOffset({ x: 0, y: 0 });
                            };

                            document.addEventListener('mousemove', handleDocMouseMove);
                            document.addEventListener('mouseup', handleDocMouseUp);
                        }
                        e.stopPropagation();
                    }
                }
            }
        } else {
            // Only deselect objects in editor mode
            if (isEditorMode) {
                environmentalObjects.forEach(obj => {
                    if (obj.selected) {
                        updateEnvironmentalObject(obj.id, { ...obj, selected: false }, getExplicitCurrentMapId());
                    }
                });
            }
        }
    }, [isEditorMode, isGMMode, getObjectAtScreenPosition, getResizeHandle, selectEnvironmentalObject, screenToWorld, environmentalObjects, updateEnvironmentalObject]);

    // Handle context menu (right-click)
    const handleContextMenu = useCallback((e) => {
        console.log('🎯 ObjectSystem context menu triggered:', { isEditorMode, isGMMode });

        // Allow context menu in editor mode OR for GM notes objects when in GM mode
        if (!isEditorMode && !isGMMode) {
            console.log('🎯 Context menu blocked: not in editor or GM mode');
            return;
        }

        // Check if the right-click is on a token, HUD element, or connection - if so, ignore it here
        // Use elementsFromPoint to get ALL elements at the click position (including those under the canvas)
        const target = e.target;
        const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        const elementAtPoint = allElementsAtPoint[0];

        const isTokenOrHUD = (el) => {
            if (!el) return false;
            return (
                el.classList?.contains('creature-token') ||
                el.classList?.contains('character-token') ||
                el.closest?.('.creature-token') ||
                el.closest?.('.character-token') ||
                el.closest?.('.target-hud-frame') ||
                el.closest?.('.party-hud-frame') ||
                el.closest?.('.target-frame') ||
                el.closest?.('.party-member-frame')
            );
        };

        // Check ALL elements at the point (not just the top one) to find connections underneath the canvas
        const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));
        const hasTokenOrHUD = allElementsAtPoint.some(el => isTokenOrHUD(el));

        if (connectionElement) {
            console.log('🔗 ObjectSystem: detected connection element, triggering its context menu', {
                connectionElement: {
                    tag: connectionElement.tagName,
                    classes: connectionElement.classList ? Array.from(connectionElement.classList) : [],
                    dataset: connectionElement.dataset
                },
                allElementsAtPoint: allElementsAtPoint.map(el => ({
                    tag: el.tagName,
                    classes: el.classList ? Array.from(el.classList) : [],
                    dataset: el.dataset
                }))
            });

            // Manually trigger the connection's context menu since the canvas intercepted the event
            // Create a new context menu event and dispatch it to the connection element
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX: e.clientX,
                clientY: e.clientY,
                button: 2,
                buttons: 2
            });

            // Dispatch to the connection element so its handler runs
            connectionElement.dispatchEvent(contextMenuEvent);

            // Prevent default to stop our handler from continuing
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (hasTokenOrHUD) {
            console.log('ObjectSystem: ignoring right-click on token or HUD element');
            return; // Let the token's or HUD's own event handler deal with it
        }

        e.preventDefault();

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;

        console.log('🎯 Context menu coordinates:', { screenX, screenY });

        const clickedObject = getObjectAtScreenPosition(screenX, screenY);
        console.log('🎯 Clicked object:', clickedObject);

        if (clickedObject) {
            // In editor mode, allow context menu for all objects
            // In GM mode (but not editor mode), only allow context menu for GM notes
            if (isEditorMode || (isGMMode && clickedObject.type === 'gmNotes')) {
                console.log('🎯 Showing context menu for object:', clickedObject);
                // Select the object and show context menu directly
                selectEnvironmentalObject(clickedObject.id);
                setSelectedObject(clickedObject);
                setContextMenuPosition({ x: e.clientX, y: e.clientY });
                setShowContextMenu(true);
            } else {
                console.log('🎯 Context menu blocked: object type not allowed in current mode');
            }
        } else {
            console.log('🎯 No object found at click position');
        }
    }, [isEditorMode, isGMMode, getObjectAtScreenPosition, selectEnvironmentalObject]);

    // Handle removing selected object
    const handleRemoveObject = () => {
        if (selectedObject) {
            removeEnvironmentalObject(selectedObject.id, getExplicitCurrentMapId());
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    // Handle opening GM Notes
    const handleOpenGMNotes = () => {
        if (selectedObject && selectedObject.type === 'gmNotes') {
            // Trigger the same event that TileOverlay uses to open GM Notes
            const openGMNotesEvent = new CustomEvent('openGMNotes', {
                detail: { object: selectedObject }
            });
            document.dispatchEvent(openGMNotesEvent);
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    const handleMouseMove = useCallback((e) => {
        // If we're over a connection, the global listener has already disabled canvas pointer-events
        // So this handler won't even fire. But just in case, check and return early.
        if (isOverConnection) {
            return;
        }

        // Handle mouse move in editor mode OR GM mode (for GM notes hover)
        if (!isEditorMode && !isGMMode) {
            return;
        }

        // Don't handle mouse move if a token is being dragged
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            return;
        }

        const mouseRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - mouseRect.left;
        const screenY = e.clientY - mouseRect.top;

        // Check for hover over GM notes (works in both editor and GM mode)
        if (!isDragging && !isResizing) {
            const hoveredObject = getObjectAtScreenPosition(screenX, screenY);

            // Check if hovering over a GM note
            if (hoveredObject && hoveredObject.type === 'gmNotes' && (isEditorMode || isGMMode)) {
                if (hoveredGMNote?.id !== hoveredObject.id) {
                    setHoveredGMNote(hoveredObject);
                    setGmNoteTooltipPosition({ x: e.clientX, y: e.clientY });

                    // Dispatch event for TileOverlay to show tooltip
                    const hoverEvent = new CustomEvent('gmNoteHover', {
                        detail: {
                            gmNote: hoveredObject,
                            position: { x: e.clientX, y: e.clientY }
                        }
                    });
                    document.dispatchEvent(hoverEvent);
                } else {
                    // Update tooltip position
                    setGmNoteTooltipPosition({ x: e.clientX, y: e.clientY });
                    const hoverEvent = new CustomEvent('gmNoteHover', {
                        detail: {
                            gmNote: hoveredObject,
                            position: { x: e.clientX, y: e.clientY }
                        }
                    });
                    document.dispatchEvent(hoverEvent);
                }
            } else if (hoveredGMNote) {
                // No longer hovering over GM note
                setHoveredGMNote(null);
                const leaveEvent = new CustomEvent('gmNoteHoverLeave');
                document.dispatchEvent(leaveEvent);
            }

            // Check for hover over resize handles when not dragging/resizing (editor mode only)
            if (isEditorMode) {
                const selectedObject = environmentalObjects.find(obj => obj.selected);
                if (selectedObject) {
                    const handle = getResizeHandle(screenX, screenY, selectedObject);
                    setHoveredHandle(handle);
                } else {
                    setHoveredHandle(null);
                }
            }

            if (!isEditorMode && !isDragging) {
                return; // Don't continue with editor-specific logic (but allow dragging in GM mode)
            }
        }



        const selectedObject = environmentalObjects.find(obj => obj.selected);
        if (!selectedObject) return;

        if (isResizing && resizeHandle) {
            // Handle resizing
            const deltaX = screenX - initialMousePos.x;
            const deltaY = screenY - initialMousePos.y;

            // Calculate scale change based on distance from center
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const scaleChange = distance / 100; // Adjust sensitivity

            let newScale = initialScale;

            // Determine if we're scaling up or down based on handle direction
            switch (resizeHandle) {
                case 'br': // Bottom-right: positive movement = scale up
                    newScale = initialScale + (deltaX + deltaY) / 200;
                    break;
                case 'tl': // Top-left: negative movement = scale up
                    newScale = initialScale - (deltaX + deltaY) / 200;
                    break;
                case 'tr': // Top-right: mixed movement
                    newScale = initialScale + (deltaX - deltaY) / 200;
                    break;
                case 'bl': // Bottom-left: mixed movement
                    newScale = initialScale + (-deltaX + deltaY) / 200;
                    break;
            }

            // Clamp scale between 0.5 and 3.0
            newScale = Math.max(0.5, Math.min(3.0, newScale));

            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                scale: newScale
            }, getExplicitCurrentMapId());
        } else if (isDragging) {
            // Handle dragging
            e.stopPropagation();
            const worldPos = screenToWorld(screenX, screenY);
            const newWorldX = worldPos.x - dragOffset.x;
            const newWorldY = worldPos.y - dragOffset.y;

            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                worldX: newWorldX,
                worldY: newWorldY
            }, getExplicitCurrentMapId());
        }
    }, [isDragging, isResizing, resizeHandle, initialScale, initialMousePos, isEditorMode, isGMMode, isOverConnection, screenToWorld, environmentalObjects, dragOffset, updateEnvironmentalObject, getResizeHandle, getObjectAtScreenPosition, hoveredGMNote]);

    const handleMouseUp = useCallback(() => {
        // Don't handle mouse up if a token is being dragged
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            return;
        }

        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
        setDragOffset({ x: 0, y: 0 });
        setInitialScale(1);
        setInitialMousePos({ x: 0, y: 0 });
        dragStateRef.current.isDragging = false;
        dragStateRef.current.dragObjectId = null;

        // Reset connection tracking
        setIsOverConnection(false);
        connectionElementRef.current = null;
    }, []);

    // Global mouse move listener to detect connections and disable canvas pointer-events
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));

            if (connectionElement) {
                // Over a connection - disable canvas pointer events so connection can receive events
                if (canvasRef.current && !isOverConnection) {
                    canvasRef.current.style.pointerEvents = 'none';
                    setIsOverConnection(true);
                    connectionElementRef.current = connectionElement;
                }
            } else {
                // Not over a connection - re-enable canvas pointer events
                if (canvasRef.current && isOverConnection) {
                    canvasRef.current.style.pointerEvents = (isEditorMode || isGMMode) ? 'auto' : 'none';
                    setIsOverConnection(false);
                    connectionElementRef.current = null;
                }
            }
        };

        // Use capture phase to check before canvas receives the event
        document.addEventListener('mousemove', handleGlobalMouseMove, true);
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove, true);
        };
    }, [isOverConnection, isEditorMode, isGMMode, isConnectionElement, hoveredGMNote, getObjectAtScreenPosition]);

    // Document-level mouse listeners for GM note dragging in play mode
    // This ensures dragging works even when overlays or z-index issues prevent
    // the canvas from receiving mouse events directly
    useEffect(() => {
        if (!isGMMode) return;

        const handleDocMouseDown = (e) => {
            if (e.button !== 0) return;
            if (window.multiplayerDragState && window.multiplayerDragState.size > 0) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const canvasRect = canvas.getBoundingClientRect();
            const screenX = e.clientX - canvasRect.left;
            const screenY = e.clientY - canvasRect.top;

            const currentZoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
            const camX = useGameStore.getState().cameraX;
            const camY = useGameStore.getState().cameraY;
            const objects = useLevelEditorStore.getState().environmentalObjects;

            let clickedObject = null;
            for (const obj of objects) {
                const objectDef = PROFESSIONAL_OBJECTS[obj.type];
                if (!objectDef) continue;
                if (obj.type !== 'gmNotes') continue;
                if (objectDef.gmOnly && !useGameStore.getState().isGMMode) continue;

                let screenPos;
                if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                    try {
                        const gridSystem = getGridSystem();
                        const viewport = gridSystem.getViewportDimensions();
                        screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                    } catch (error) {
                        const cw = canvas.width || window.innerWidth;
                        const ch = canvas.height || window.innerHeight;
                        screenPos = {
                            x: (obj.worldX - camX) * currentZoom + cw / 2,
                            y: (obj.worldY - camY) * currentZoom + ch / 2
                        };
                    }
                } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                    continue;
                } else {
                    continue;
                }

                const gridSize = useGameStore.getState().gridSize;
                const tileSize = gridSize * currentZoom;
                const scale = obj.scale || 1;
                const objWidth = objectDef.size.width * tileSize * scale;
                const objHeight = objectDef.size.height * tileSize * scale;
                const padding = Math.max(10, tileSize * 0.1);
                const left = screenPos.x - objWidth / 2 - padding;
                const right = screenPos.x + objWidth / 2 + padding;
                const top = screenPos.y - objHeight / 2 - padding;
                const bottom = screenPos.y + objHeight / 2 + padding;

                if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
                    clickedObject = obj;
                    break;
                }
            }

            if (!clickedObject) return;

            e.preventDefault();
            e.stopPropagation();

            useLevelEditorStore.getState().selectEnvironmentalObject(clickedObject.id);

            const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
            if (!objectDef || !objectDef.draggable) return;

            let worldPos;
            try {
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                worldPos = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);
            } catch (error) {
                const cw = canvas.width || window.innerWidth;
                const ch = canvas.height || window.innerHeight;
                worldPos = {
                    x: ((screenX - cw / 2) / currentZoom) + camX,
                    y: ((screenY - ch / 2) / currentZoom) + camY
                };
            }

            const offsetX = worldPos.x - clickedObject.worldX;
            const offsetY = worldPos.y - clickedObject.worldY;

            setIsDragging(true);
            dragStateRef.current = {
                isDragging: true,
                dragObjectId: clickedObject.id,
                dragOffsetX: offsetX,
                dragOffsetY: offsetY
            };

            const handleDocMouseMove = (moveEvent) => {
                if (!dragStateRef.current.isDragging) return;
                moveEvent.preventDefault();

                const cr = canvasRef.current?.getBoundingClientRect();
                if (!cr) return;
                const mx = moveEvent.clientX - cr.left;
                const my = moveEvent.clientY - cr.top;

                let moveWorldPos;
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    moveWorldPos = gridSystem.screenToWorld(mx, my, viewport.width, viewport.height);
                } catch (error) {
                    const zoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
                    const cx = useGameStore.getState().cameraX;
                    const cy = useGameStore.getState().cameraY;
                    const cw = cr.width || window.innerWidth;
                    const ch = cr.height || window.innerHeight;
                    moveWorldPos = {
                        x: ((mx - cw / 2) / zoom) + cx,
                        y: ((my - ch / 2) / zoom) + cy
                    };
                }

                const newWorldX = moveWorldPos.x - dragStateRef.current.dragOffsetX;
                const newWorldY = moveWorldPos.y - dragStateRef.current.dragOffsetY;
                const mapId = useMapStore.getState().currentMapId || 'default';
                const currentObjects = useLevelEditorStore.getState().environmentalObjects;
                const targetObj = currentObjects.find(o => o.id === dragStateRef.current.dragObjectId);
                if (targetObj) {
                    useLevelEditorStore.getState().updateEnvironmentalObject(
                        dragStateRef.current.dragObjectId,
                        { ...targetObj, worldX: newWorldX, worldY: newWorldY },
                        mapId
                    );
                }
            };

            const handleDocMouseUp = () => {
                document.removeEventListener('mousemove', handleDocMouseMove);
                document.removeEventListener('mouseup', handleDocMouseUp);
                dragStateRef.current.isDragging = false;
                dragStateRef.current.dragObjectId = null;
                setIsDragging(false);
                setDragOffset({ x: 0, y: 0 });
            };

            document.addEventListener('mousemove', handleDocMouseMove);
            document.addEventListener('mouseup', handleDocMouseUp);
        };

        document.addEventListener('mousedown', handleDocMouseDown, true);
        return () => {
            document.removeEventListener('mousedown', handleDocMouseDown, true);
        };
    }, [isGMMode]);

    // FIXED: Use RAF for smooth object rendering - no throttling to prevent floating
    const scheduledRenderRef = useRef(null);

    // Update canvas when dependencies change using RAF (no artificial throttling)
    useEffect(() => {
        // Cancel any pending render
        if (scheduledRenderRef.current) {
            cancelAnimationFrame(scheduledRenderRef.current);
        }

        // Schedule render for next frame - this naturally caps at 60fps
        scheduledRenderRef.current = requestAnimationFrame(() => {
            renderObjects();
            scheduledRenderRef.current = null;
        });

        return () => {
            if (scheduledRenderRef.current) {
                cancelAnimationFrame(scheduledRenderRef.current);
                scheduledRenderRef.current = null;
            }
        };
    }, [renderObjects, cameraX, cameraY, effectiveZoom]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            renderObjects();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderObjects]);


    return (
        <>
            <canvas
                ref={canvasRef}
                className="object-system-canvas"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 20,
                    // Enable interaction in editor mode OR when GM mode is active (for GM notes access)
                    // Connections (z-index 150) will be on top and receive their own events
                    // We check for connections in all event handlers to avoid blocking them
                    pointerEvents: (isEditorMode || isGMMode) ? 'auto' : 'none',
                    cursor: isDragging ? 'grabbing' :
                        isResizing ? getCursorForHandle(resizeHandle) :
                            hoveredHandle ? getCursorForHandle(hoveredHandle) : 'pointer'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={(e) => {
                    // Reset connection tracking when mouse leaves canvas
                    if (isOverConnection && connectionElementRef.current) {
                        const mouseLeaveEvent = new MouseEvent('mouseleave', {
                            bubbles: true,
                            cancelable: true,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            view: window
                        });
                        connectionElementRef.current.dispatchEvent(mouseLeaveEvent);
                        setIsOverConnection(false);
                        connectionElementRef.current = null;
                    }
                    // Clear GM note hover
                    if (hoveredGMNote) {
                        setHoveredGMNote(null);
                        const leaveEvent = new CustomEvent('gmNoteHoverLeave');
                        document.dispatchEvent(leaveEvent);
                    }
                    handleMouseUp();
                }}
                onContextMenu={handleContextMenu}
            />

            {/* Context Menu */}
            {showContextMenu && selectedObject && (
                <UnifiedContextMenu
                    visible={showContextMenu}
                    x={contextMenuPosition.x}
                    y={contextMenuPosition.y}
                    onClose={() => {
                        setShowContextMenu(false);
                        setSelectedObject(null);
                    }}
                    title={PROFESSIONAL_OBJECTS[selectedObject.type]?.name || selectedObject.type}
                    items={[
                        ...(selectedObject.type === 'gmNotes' ? [
                            {
                                icon: <i className="fas fa-scroll"></i>,
                                label: 'Open GM Notes',
                                onClick: handleOpenGMNotes,
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
                    ]}
                />
            )}
        </>
    );
};

export default ObjectSystem;
