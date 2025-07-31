import React, { useRef, useEffect, useCallback } from 'react';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const CanvasWallSystem = () => {
    const canvasRef = useRef(null);
    
    // Get state from stores
    const { 
        cameraX, 
        cameraY, 
        zoomLevel, 
        playerZoom, 
        gridSize, 
        gridOffsetX, 
        gridOffsetY 
    } = useGameStore();
    
    const {
        wallData,
        drawingLayers,
        showWallLayer,
        isEditorMode
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

    // Get wall material style
    const getWallMaterialStyle = (wallTypeId) => {
        const wallType = WALL_TYPES[wallTypeId];
        if (!wallType) return { color: '#8B4513' };
        
        switch (wallTypeId) {
            case 'stone_wall':
                return { color: '#696969' };
            case 'wooden_wall':
                return { color: '#8B4513' };
            case 'metal_wall':
                return { color: '#C0C0C0' };
            case 'brick_wall':
                return { color: '#B22222' };
            default:
                return { color: '#8B4513' };
        }
    };

    // Render walls on canvas
    const renderWalls = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size to match container
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Check if wall layer is visible (support both new layer system and legacy showWallLayer)
        const wallLayer = drawingLayers.find(layer => layer.id === 'walls');
        const isWallLayerVisible = (wallLayer && wallLayer.visible) || showWallLayer;

        if (!isWallLayerVisible || !wallData || Object.keys(wallData).length === 0) {
            return;
        }

        console.log('🧱 CANVAS WALL SYSTEM: Rendering walls', Object.keys(wallData).length);

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

        // Render walls
        Object.entries(wallData).forEach(([wallKey, wallData_item]) => {
            // Handle both old format (string) and new format (object)
            const wallType = typeof wallData_item === 'string' ? wallData_item : wallData_item.type;
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

            // Get screen positions for wall endpoints
            const screenPos1 = gridToScreen(x1, y1, canvas.width, canvas.height);
            const screenPos2 = gridToScreen(x2, y2, canvas.width, canvas.height);

            // Calculate wall thickness based on zoom
            const wallThickness = Math.max(4, gridSize * effectiveZoom * 0.15);
            
            // Get wall material style
            const materialStyle = getWallMaterialStyle(wallType);

            // Set drawing style
            ctx.strokeStyle = materialStyle.color;
            ctx.lineWidth = wallThickness;
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';

            // Draw the wall
            ctx.beginPath();
            ctx.moveTo(screenPos1.x, screenPos1.y);
            ctx.lineTo(screenPos2.x, screenPos2.y);
            ctx.stroke();

            console.log('🧱 Rendered wall:', wallKey, 'from', screenPos1, 'to', screenPos2, 'thickness:', wallThickness);
        });

    }, [wallData, drawingLayers, gridToScreen, effectiveZoom, gridSize, cameraX, cameraY, gridOffsetX, gridOffsetY]);

    // Update canvas when dependencies change
    useEffect(() => {
        renderWalls();
    }, [renderWalls]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            renderWalls();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderWalls]);

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
