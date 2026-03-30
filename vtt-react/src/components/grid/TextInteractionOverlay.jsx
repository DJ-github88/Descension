import React, { useCallback, useState, useRef, useEffect } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const TextInteractionOverlay = ({ gridRef }) => {
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const dragTimeoutRef = useRef(null);


    const {
        drawingPaths,
        updateDrawingPath,
        isEditorMode
    } = useLevelEditorStore();

    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom
    } = useGameStore();

    // Calculate effective zoom
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates
    const gridToScreen = useCallback((gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback calculation
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;
            return {
                x: (worldX - cameraX) * effectiveZoom,
                y: (worldY - cameraY) * effectiveZoom
            };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    // Convert screen coordinates to world coordinates (for free positioning)
    const screenToWorld = useCallback((screenX, screenY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);
        } catch (error) {
            // Fallback calculation
            const worldX = (screenX / effectiveZoom) + cameraX;
            const worldY = (screenY / effectiveZoom) + cameraY;
            return { x: worldX, y: worldY };
        }
    }, [cameraX, cameraY, effectiveZoom]);

    // Convert world coordinates to grid coordinates (for storage compatibility)
    const worldToGrid = useCallback((worldX, worldY) => {
        return {
            x: (worldX - gridOffsetX) / gridSize,
            y: (worldY - gridOffsetY) / gridSize
        };
    }, [gridSize, gridOffsetX, gridOffsetY]);

    // Get text paths only
    const textPaths = drawingPaths.filter(path => path.tool === 'text');

    // Check if a point is inside a text bounding box
    const isPointInText = useCallback((screenX, screenY, textPath) => {
        if (!textPath.points || textPath.points.length === 0 || !textPath.text) return false;

        const point = textPath.points[0];
        const screenPos = gridToScreen(point.gridX, point.gridY);

        // Calculate text dimensions (more accurate estimate)
        const fontSize = textPath.style.fontSize || 16;
        const textWidth = textPath.text.length * fontSize * 0.65; // Slightly more accurate estimate
        const textHeight = fontSize * 1.2; // Account for line height
        const padding = 4;

        const left = screenPos.x - padding;
        const top = screenPos.y - padding;
        const right = left + textWidth + (padding * 2);
        const bottom = top + textHeight + (padding * 2);

        return screenX >= left && screenX <= right && screenY >= top && screenY <= bottom;
    }, [gridToScreen]);

    // Find text at screen position
    const getTextAtPosition = useCallback((screenX, screenY) => {
        for (let i = textPaths.length - 1; i >= 0; i--) {
            const textPath = textPaths[i];
            if (isPointInText(screenX, screenY, textPath)) {
                return textPath;
            }
        }
        return null;
    }, [textPaths, isPointInText]);

    // Handle mouse down for text selection and dragging
    const handleMouseDown = useCallback((e) => {
        // Only handle if editor is closed and left mouse button
        if (isEditorMode || e.button !== 0) return;

        const rect = gridRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const clickedText = getTextAtPosition(screenX, screenY);

        if (clickedText) {
            e.preventDefault();
            e.stopPropagation();

            setSelectedTextId(clickedText.id);
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });

            // Set dragging cursor
            if (gridRef.current) {
                gridRef.current.style.cursor = 'grabbing';
            }

            // Calculate drag offset from text position
            const textScreenPos = gridToScreen(clickedText.points[0].gridX, clickedText.points[0].gridY);
            setDragOffset({
                x: screenX - textScreenPos.x,
                y: screenY - textScreenPos.y
            });

            // Safety timeout to auto-release if stuck (10 seconds)
            dragTimeoutRef.current = setTimeout(() => {

                setIsDragging(false);
                setDragOffset({ x: 0, y: 0 });
                setSelectedTextId(null);
                if (gridRef.current) {
                    gridRef.current.style.cursor = 'default';
                }
            }, 10000);
        } else {
            // Clicked empty space, deselect text
            setSelectedTextId(null);
        }
    }, [isEditorMode, gridRef, getTextAtPosition, gridToScreen]);

    // Handle mouse move for dragging and hover effects
    const handleMouseMove = useCallback((e) => {
        if (isEditorMode) return;

        const rect = gridRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        if (isDragging && selectedTextId) {
            // Handle free dragging - position text at exact mouse location
            const adjustedScreenX = screenX - dragOffset.x;
            const adjustedScreenY = screenY - dragOffset.y;
            const newWorldPos = screenToWorld(adjustedScreenX, adjustedScreenY);
            const newGridPos = worldToGrid(newWorldPos.x, newWorldPos.y);

            // Update the text position with precise grid coordinates (allows fractional positions)
            updateDrawingPath(selectedTextId, {
                points: [{ gridX: newGridPos.x, gridY: newGridPos.y }]
            });

            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else {
            // Update cursor style for text hovering
            const hoveredText = getTextAtPosition(screenX, screenY);
            if (gridRef.current) {
                if (isDragging) {
                    gridRef.current.style.cursor = 'grabbing';
                } else {
                    gridRef.current.style.cursor = hoveredText ? 'grab' : 'default';
                }
            }
        }
    }, [isDragging, selectedTextId, isEditorMode, gridRef, dragOffset, screenToWorld, worldToGrid, updateDrawingPath, getTextAtPosition]);

    // Handle mouse up to stop dragging
    const handleMouseUp = useCallback((e) => {


        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();

            // Clear safety timeout
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
                dragTimeoutRef.current = null;
            }

            // Stop dragging immediately
            setIsDragging(false);
            setDragOffset({ x: 0, y: 0 });

            // Deselect text after dropping
            setSelectedTextId(null);

            // Reset cursor
            if (gridRef.current) {
                gridRef.current.style.cursor = 'default';
            }


        }
    }, [isDragging, gridRef]);

    // Handle escape key to force release text if it gets stuck
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && isDragging) {


            // Clear safety timeout
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
                dragTimeoutRef.current = null;
            }

            setIsDragging(false);
            setDragOffset({ x: 0, y: 0 });
            setSelectedTextId(null);
            if (gridRef.current) {
                gridRef.current.style.cursor = 'default';
            }
        }
    }, [isDragging, gridRef]);

    // Add event listeners
    useEffect(() => {
        if (!gridRef.current) return;

        const gridElement = gridRef.current;

        // Add passive: false to ensure we can prevent default
        const mouseDownHandler = (e) => {
    
            handleMouseDown(e);
        };
        const mouseMoveHandler = (e) => handleMouseMove(e);
        const mouseUpHandler = (e) => {

            handleMouseUp(e);
        };

        // Mouse down only on grid element
        gridElement.addEventListener('mousedown', mouseDownHandler, { passive: false });

        // Mouse move and up on document to catch events outside grid
        document.addEventListener('mousemove', mouseMoveHandler, { passive: false });
        document.addEventListener('mouseup', mouseUpHandler, { passive: false });

        // Also add mouseup to window as backup
        window.addEventListener('mouseup', mouseUpHandler, { passive: false });

        // Add keyboard listener for escape key
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            gridElement.removeEventListener('mousedown', mouseDownHandler);
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown]);

    // Render selection indicator for text (no hover highlight)
    const renderTextSelectionIndicator = useCallback((textPath) => {
        if (!textPath.points || textPath.points.length === 0 || !textPath.text) return null;

        const point = textPath.points[0];
        const screenPos = gridToScreen(point.gridX, point.gridY);

        // Calculate text dimensions
        const fontSize = textPath.style.fontSize || 16;
        const textWidth = textPath.text.length * fontSize * 0.65;
        const textHeight = fontSize * 1.2;
        const padding = 4;

        return (
            <div
                key={`selection-${textPath.id}`}
                style={{
                    position: 'absolute',
                    left: screenPos.x - padding - 2,
                    top: screenPos.y - padding - 2,
                    width: textWidth + (padding * 2) + 4,
                    height: textHeight + (padding * 2) + 4,
                    border: '2px dashed #D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    borderRadius: '2px'
                }}
            />
        );
    }, [gridToScreen]);

    // Don't render anything if editor is open
    if (isEditorMode) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 999
            }}
        >
            {/* Render selection indicators for selected text only (but not while dragging) */}
            {selectedTextId && !isDragging && textPaths.map(textPath =>
                textPath.id === selectedTextId ? renderTextSelectionIndicator(textPath) : null
            )}
        </div>
    );
};

export default TextInteractionOverlay;
