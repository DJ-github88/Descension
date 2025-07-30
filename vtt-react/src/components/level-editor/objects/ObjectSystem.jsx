import React, { useRef, useEffect, useCallback, useState } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
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

    // Context menu state
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedObject, setSelectedObject] = useState(null);

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
        isGMMode
    } = useGameStore();

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

        // Calculate visible bounds for performance
        const startX = Math.floor((cameraX - gridOffsetX) / gridSize) - 5;
        const endX = Math.ceil((cameraX + canvas.width / effectiveZoom - gridOffsetX) / gridSize) + 5;
        const startY = Math.floor((cameraY - gridOffsetY) / gridSize) - 5;
        const endY = Math.ceil((cameraY + canvas.height / effectiveZoom - gridOffsetY) / gridSize) + 5;

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
                renderGMObject(ctx, objectDef, screenPos, width, height);
                break;
            default:
                renderGenericObject(ctx, objectDef, screenPos, width, height);
                break;
        }

        ctx.restore();
    };





    const renderGMObject = (ctx, objectDef, screenPos, width, height) => {
        // Center the object at the screen position (like other objects)
        const left = screenPos.x - width / 2;
        const top = screenPos.y - height / 2;

        // Render GM Notes as a parchment-style note with quill
        ctx.fillStyle = '#f8f4e6'; // Parchment color
        ctx.fillRect(left, top, width, height);

        // Add parchment border
        ctx.strokeStyle = '#8B4513'; // Brown border
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, width, height);

        // Add note lines
        ctx.strokeStyle = '#d4af37'; // Gold lines
        ctx.lineWidth = 1;
        const lineSpacing = height / 5;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(left + width * 0.1, top + lineSpacing * i);
            ctx.lineTo(left + width * 0.9, top + lineSpacing * i);
            ctx.stroke();
        }

        // Add quill icon in corner
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenPos.x + width * 0.7, screenPos.y + height * 0.1, width * 0.2, height * 0.1);
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
        ctx.strokeRect(screenPos.x - width/2 - 2, screenPos.y - height/2 - 2, width + 4, height + 4);
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
            ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
        });

        ctx.restore();
    };

    // Convert screen coordinates to world coordinates
    const screenToWorld = useCallback((screenX, screenY) => {
        const worldX = (screenX / effectiveZoom) + cameraX;
        const worldY = (screenY / effectiveZoom) + cameraY;
        return { x: worldX, y: worldY };
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

    // Handle mouse events
    const handleMouseDown = useCallback((e) => {
        // Allow mouse interactions in editor mode OR for GM notes objects when in GM mode
        if (!isEditorMode && !isGMMode) return;

        // Check if the click is on a token - if so, ignore it here
        const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
        if (elementAtPoint && (
            elementAtPoint.classList.contains('creature-token') ||
            elementAtPoint.classList.contains('character-token') ||
            elementAtPoint.closest('.creature-token') ||
            elementAtPoint.closest('.character-token')
        )) {
            console.log('ObjectSystem: ignoring click on token');
            return; // Let the token's own event handler deal with it
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

                // Only allow dragging/resizing in editor mode
                if (isEditorMode) {
                    // Check if clicking on a resize handle
                    const handle = getResizeHandle(screenX, screenY, clickedObject);
                    console.log(`🖱️ Mouse down on object: ${clickedObject.id}, handle: ${handle}`);

                    if (handle) {
                        // Start resizing
                        console.log(`🔄 Starting resize with handle: ${handle}`);
                        setIsResizing(true);
                        setResizeHandle(handle);
                        setInitialScale(clickedObject.scale || 1);
                        setInitialMousePos({ x: screenX, y: screenY });
                    } else {
                        // Start dragging if object is draggable
                        const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
                        if (objectDef && objectDef.draggable) {
                            setIsDragging(true);
                            const worldPos = screenToWorld(screenX, screenY);
                            setDragOffset({
                                x: worldPos.x - clickedObject.worldX,
                                y: worldPos.y - clickedObject.worldY
                            });
                        }
                    }
                }
            }
        } else {
            // Only deselect objects in editor mode
            if (isEditorMode) {
                environmentalObjects.forEach(obj => {
                    if (obj.selected) {
                        updateEnvironmentalObject(obj.id, { ...obj, selected: false });
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

        // Check if the right-click is on a token - if so, ignore it here
        const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
        if (elementAtPoint && (
            elementAtPoint.classList.contains('creature-token') ||
            elementAtPoint.classList.contains('character-token') ||
            elementAtPoint.closest('.creature-token') ||
            elementAtPoint.closest('.character-token')
        )) {
            console.log('ObjectSystem: ignoring right-click on token');
            return; // Let the token's own event handler deal with it
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
            removeEnvironmentalObject(selectedObject.id);
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
        if (!isEditorMode) return;

        const mouseRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - mouseRect.left;
        const screenY = e.clientY - mouseRect.top;

        // Check for hover over resize handles when not dragging/resizing
        if (!isDragging && !isResizing) {
            const selectedObject = environmentalObjects.find(obj => obj.selected);
            if (selectedObject) {
                const handle = getResizeHandle(screenX, screenY, selectedObject);
                setHoveredHandle(handle);
            } else {
                setHoveredHandle(null);
            }
            return;
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
            });
        } else if (isDragging) {
            // Handle dragging
            const worldPos = screenToWorld(screenX, screenY);
            const newWorldX = worldPos.x - dragOffset.x;
            const newWorldY = worldPos.y - dragOffset.y;

            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                worldX: newWorldX,
                worldY: newWorldY
            });
        }
    }, [isDragging, isResizing, resizeHandle, initialScale, initialMousePos, isEditorMode, screenToWorld, environmentalObjects, dragOffset, updateEnvironmentalObject, getResizeHandle]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
        setDragOffset({ x: 0, y: 0 });
        setInitialScale(1);
        setInitialMousePos({ x: 0, y: 0 });
    }, []);

    // Update canvas when dependencies change
    useEffect(() => {
        renderObjects();
    }, [renderObjects]);

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
                    pointerEvents: (isEditorMode || isGMMode) ? 'auto' : 'none',
                    cursor: isDragging ? 'grabbing' :
                            isResizing ? getCursorForHandle(resizeHandle) :
                            hoveredHandle ? getCursorForHandle(hoveredHandle) : 'pointer'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves canvas
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
