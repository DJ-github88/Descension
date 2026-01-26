import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

/**
 * StaticFogOverlay - Renders path-based and tile-based fog of war on a canvas
 * Optimized with offscreen caching and viewport culling
 */
const StaticFogOverlay = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const tempCanvasRef = useRef(null);
    const isDraggingCameraRef = useRef(false);

    // Store Subscriptions - Game State
    const gridSize = useGameStore(state => state.gridSize) || 50;
    const gridOffsetX = useGameStore(state => state.gridOffsetX) || 0;
    const gridOffsetY = useGameStore(state => state.gridOffsetY) || 0;
    const cameraX = useGameStore(state => state.cameraX) || 0;
    const cameraY = useGameStore(state => state.cameraY) || 0;
    const zoomLevel = useGameStore(state => state.zoomLevel) || 1;
    const playerZoom = useGameStore(state => state.playerZoom) || 1;
    const isGMMode = useGameStore(state => state.isGMMode);

    // Store Subscriptions - Level Editor State
    const fogOfWarEnabled = useLevelEditorStore(state => state.fogOfWarEnabled);
    const drawingLayers = useLevelEditorStore(state => state.drawingLayers);
    const isFogLayerVisible = useMemo(() => {
        const fogLayer = drawingLayers?.find(l => l.id === 'fog');
        return fogLayer ? fogLayer.visible : true;
    }, [drawingLayers]);

    const fogOfWarPaths = useLevelEditorStore(state => state.fogOfWarPaths) || [];
    const fogErasePaths = useLevelEditorStore(state => state.fogErasePaths) || [];
    const fogOfWarData = useLevelEditorStore(state => state.fogOfWarData) || {};

    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const visibilityPolygon = useLevelEditorStore(state => state.visibilityPolygon);
    const tokenVisionRanges = useLevelEditorStore(state => state.tokenVisionRanges) || {};
    const getFogState = useLevelEditorStore(state => state.getFogState);

    const creatureTokens = useCreatureStore(state => state.tokens) || [];
    const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];

    // Helper functions for coordinate conversion
    const worldToScreen = useCallback((worldX, worldY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        return gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height);
    }, []);

    const screenToWorld = useCallback((screenX, screenY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        return gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);
    }, []);

    // Derived visibility state
    const visibleAreaSet = useMemo(() => {
        if (!visibleArea) return new Set();
        return visibleArea instanceof Set ? visibleArea : new Set(visibleArea);
    }, [visibleArea]);

    // Fog path filtering (viewport culling is also performed inside renderFog for performance)
    const visibleFogPaths = useMemo(() => fogOfWarPaths, [fogOfWarPaths]);
    const visibleErasePaths = useMemo(() => fogErasePaths, [fogErasePaths]);

    const visibleFogTiles = useMemo(() => {
        return Object.entries(fogOfWarData)
            .filter(([_, value]) => value === true)
            .map(([key]) => {
                const [worldX, worldY] = key.split(',').map(Number);
                return { worldX, worldY };
            });
    }, [fogOfWarData]);

    const currentViewingToken = useMemo(() => {
        if (!viewingFromToken) return null;
        const allTokens = [...creatureTokens, ...characterTokens];
        return allTokens.find(t =>
            t.id === viewingFromToken.id ||
            t.creatureId === viewingFromToken.id ||
            t.characterId === viewingFromToken.id
        );
    }, [viewingFromToken, creatureTokens, characterTokens]);

    // Vision polygons for all tokens (used by GM to see what players see)
    const allTokensVisibilityPolygons = useMemo(() => [], []);

    // Main render function
    const renderFog = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !fogOfWarEnabled || !isFogLayerVisible) return;

        // Initialize or resize offscreen canvas for smooth painted fog
        if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offscreenCanvas = offscreenCanvasRef.current;

        if (!tempCanvasRef.current) {
            tempCanvasRef.current = document.createElement('canvas');
        }
        const tempCanvas = tempCanvasRef.current;

        const effectiveZoom = zoomLevel * playerZoom;

        if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // PERFORMANCE: Always ensure canvases match main canvas dimensions
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        if (offscreenCanvas.width !== canvas.width || offscreenCanvas.height !== canvas.height) {
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
        }

        if (tempCanvas.width !== canvas.width || tempCanvas.height !== canvas.height) {
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Star flickering animation time (for performance, update every 500ms)
        const starTime = Math.floor(Date.now() / 500) % 1000;

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // FOG COLOR SYSTEM:
        const getFogColorLocal = (fogState = 'covered') => {
            if (isGMMode) {
                switch (fogState) {
                    case 'viewable': return 'rgba(25, 25, 50, 0.05)';
                    case 'explored': return 'rgba(60, 40, 90, 0.25)';
                    case 'covered':
                    default: return 'rgba(20, 15, 45, 0.4)';
                }
            }
            switch (fogState) {
                case 'viewable': return 'rgba(25, 25, 50, 0.0)';
                case 'explored': return 'rgba(30, 25, 50, 0.75)';
                case 'covered':
                default: return 'rgba(10, 10, 25, 1.0)';
            }
        };

        // Draw stars on fog (optimized for performance)
        const drawStars = (ctx, canvasWidth, canvasHeight) => {
            const maxStars = 100;
            const starsToDraw = maxStars;

            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

            const starsPerCheck = 5;
            let checkCounter = 0;

            for (let i = 0; i < starsToDraw; i++) {
                const seed = (i * 7919) % 10000;
                const x = (seed * 137) % canvasWidth;
                const y = (seed * 271) % canvasHeight;

                const flicker = Math.sin(starTime * 0.01 + seed) * 0.3 + 0.7;
                const starOpacity = Math.max(0.4, Math.min(1.0, flicker));

                checkCounter++;
                if (checkCounter >= starsPerCheck) {
                    checkCounter = 0;
                    const worldPos = screenToWorld(x, y);
                    const fogState = getFogState(worldPos.x, worldPos.y);
                    if (fogState !== 'covered' && fogState !== 'explored') {
                        continue;
                    }
                }

                ctx.globalAlpha = starOpacity;
                ctx.fillRect(x, y, 1, 1);
            }

            ctx.restore();
        };

        const maxPathsToProcess = 200;
        const isFullCoverageFog = (path) => path.isFullCoverage || (path.id && path.id.startsWith('fog_cover_entire_map_')) || (path.points && path.points.length > 20000);
        const isFullCoverageErase = (path) => path.isFullCoverage || (path.id && path.id.startsWith('erase_cover_entire_map_')) || (path.points && path.points.length > 20000);

        const fullCoverageFogPaths = visibleFogPaths.filter(isFullCoverageFog);
        const regularFogPaths = visibleFogPaths.filter(path => !isFullCoverageFog(path));
        const fullCoverageErasePaths = visibleErasePaths.filter(isFullCoverageErase);
        const regularErasePaths = visibleErasePaths.filter(path => !isFullCoverageErase(path));

        const allItems = [
            ...regularFogPaths.slice(-maxPathsToProcess).map(path => ({ type: 'fog', ...path })),
            ...regularErasePaths.slice(-maxPathsToProcess).map(path => ({ type: 'erase', ...path })),
            ...fullCoverageErasePaths.map(path => ({ type: 'erase', ...path })),
            ...fullCoverageFogPaths.map(path => ({ type: 'fog', ...path }))
        ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.lineCap = 'round';
        offscreenCtx.lineJoin = 'round';

        allItems.forEach(item => {
            if (item.type === 'fog') {
                const path = item;
                if (!path.points || path.points.length === 0) return;
                const isExplicitCoverEntireMap = path.id && path.id.startsWith('fog_cover_entire_map_');
                const hasFullCoverageFlag = path.isFullCoverage === true;
                const isFullCoveragePath = hasFullCoverageFlag || isExplicitCoverEntireMap || (path.points && path.points.length > 5000);

                if (isFullCoveragePath) {
                    ctx.globalCompositeOperation = 'source-over';
                    const coveredFogColor = getFogColorLocal('covered');
                    ctx.fillStyle = coveredFogColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    const levelEditorState = useLevelEditorStore.getState();
                    const exploredPolygons = levelEditorState.exploredPolygons || [];
                    const exploredCircles = levelEditorState.exploredCircles || [];

                    if (viewingFromToken && !isGMMode && (exploredPolygons.length > 0 || exploredCircles.length > 0)) {
                        const exploredFogColor = getFogColorLocal('explored');
                        ctx.globalCompositeOperation = 'source-over';
                        exploredPolygons.forEach(polygon => {
                            if (!polygon.points || polygon.points.length < 3) return;
                            const screenPoints = polygon.points.map(p => worldToScreen(p.x, p.y));
                            ctx.beginPath();
                            ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
                            for (let i = 1; i < screenPoints.length; i++) ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
                            ctx.closePath();
                            ctx.fillStyle = exploredFogColor;
                            ctx.fill();
                        });
                        exploredCircles.forEach(circle => {
                            const screenPos = worldToScreen(circle.x, circle.y);
                            const radius = circle.radius * effectiveZoom;
                            ctx.beginPath();
                            ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                            ctx.fillStyle = exploredFogColor;
                            ctx.fill();
                        });
                    }
                } else {
                    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                    offscreenCtx.fillStyle = '#000000';
                    offscreenCtx.strokeStyle = '#000000';

                    let pointsToRender = path.points;
                    if (pointsToRender.length === 0) return;

                    // Set up soft brush look using shadowBlur instead of global filter
                    // This is much more performant and constrained to the brush size
                    const baseRadius = (pointsToRender[0].brushRadius || 20);
                    const softEdgeRatio = 0.3; // 30% of the radius is soft
                    const shadowBlurAmount = baseRadius * softEdgeRatio;

                    offscreenCtx.shadowColor = '#000000';
                    offscreenCtx.shadowBlur = shadowBlurAmount;

                    // Use a slightly smaller solid core so the total visual size matches the intended brush size
                    const solidRadius = baseRadius * (1 - softEdgeRatio * 0.5);

                    if (pointsToRender.length === 1) {
                        const p = pointsToRender[0];
                        const screenPos = worldToScreen(p.worldX, p.worldY);
                        offscreenCtx.beginPath();
                        offscreenCtx.arc(screenPos.x, screenPos.y, solidRadius, 0, Math.PI * 2);
                        offscreenCtx.fill();
                    } else {
                        offscreenCtx.lineWidth = solidRadius * 2;
                        offscreenCtx.beginPath();
                        const startPos = worldToScreen(pointsToRender[0].worldX, pointsToRender[0].worldY);
                        offscreenCtx.moveTo(startPos.x, startPos.y);

                        for (let i = 1; i < pointsToRender.length; i++) {
                            const p = pointsToRender[i];
                            const s = worldToScreen(p.worldX, p.worldY);
                            offscreenCtx.lineTo(s.x, s.y);
                        }
                        offscreenCtx.stroke();
                    }

                    // Reset shadow for next operations
                    offscreenCtx.shadowBlur = 0;
                    ctx.save();
                    ctx.globalCompositeOperation = 'source-over';
                    const coveredColor = getFogColorLocal('covered');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                    tempCtx.fillStyle = coveredColor;
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    tempCtx.globalCompositeOperation = 'destination-in';
                    tempCtx.drawImage(offscreenCanvas, 0, 0);
                    ctx.drawImage(tempCanvas, 0, 0);
                    ctx.restore();
                }
            } else if (item.type === 'erase') {
                const path = item;
                if (!path.points || path.points.length === 0) return;
                offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                offscreenCtx.fillStyle = '#000000';
                offscreenCtx.strokeStyle = '#000000';

                let pointsToRender = path.points;
                if (pointsToRender.length === 0) return;

                const baseRadius = (pointsToRender[0].brushRadius || 20);
                const softEdgeRatio = 0.3;
                const shadowBlurAmount = baseRadius * softEdgeRatio;

                offscreenCtx.shadowColor = '#000000';
                offscreenCtx.shadowBlur = shadowBlurAmount;
                const solidRadius = baseRadius * (1 - softEdgeRatio * 0.5);

                if (pointsToRender.length === 1) {
                    const p = pointsToRender[0];
                    const screenPos = worldToScreen(p.worldX, p.worldY);
                    offscreenCtx.beginPath();
                    offscreenCtx.arc(screenPos.x, screenPos.y, solidRadius, 0, Math.PI * 2);
                    offscreenCtx.fill();
                } else {
                    offscreenCtx.lineWidth = solidRadius * 2;
                    offscreenCtx.beginPath();
                    const startPos = worldToScreen(pointsToRender[0].worldX, pointsToRender[0].worldY);
                    offscreenCtx.moveTo(startPos.x, startPos.y);

                    for (let i = 1; i < pointsToRender.length; i++) {
                        const p = pointsToRender[i];
                        const s = worldToScreen(p.worldX, p.worldY);
                        offscreenCtx.lineTo(s.x, s.y);
                    }
                    offscreenCtx.stroke();
                }

                offscreenCtx.shadowBlur = 0;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.drawImage(offscreenCanvas, 0, 0);
                ctx.restore();
            }
        });

        ctx.globalCompositeOperation = 'source-over';
        drawStars(ctx, canvas.width, canvas.height);
        ctx.restore();

        let visibilityMask = null;
        if (isGMMode && !viewingFromToken && allTokensVisibilityPolygons.length > 0) {
            visibilityMask = document.createElement('canvas');
            visibilityMask.width = canvas.width;
            visibilityMask.height = canvas.height;
            const maskCtx = visibilityMask.getContext('2d');
            maskCtx.clearRect(0, 0, visibilityMask.width, visibilityMask.height);
            allTokensVisibilityPolygons.forEach(({ token, polygon, visionRange }) => {
                if (!polygon || polygon.length === 0) return;
                const tokenScreenPos = worldToScreen(token.position.x, token.position.y);
                const visionRangeInPixels = visionRange * 50 * effectiveZoom;
                maskCtx.globalCompositeOperation = 'source-over';
                maskCtx.beginPath();
                const firstPoint = worldToScreen(polygon[0].x, polygon[0].y);
                maskCtx.moveTo(firstPoint.x, firstPoint.y);
                for (let i = 1; i < polygon.length; i++) {
                    const point = worldToScreen(polygon[i].x, polygon[i].y);
                    maskCtx.lineTo(point.x, point.y);
                }
                maskCtx.closePath();
                const gradient = maskCtx.createRadialGradient(tokenScreenPos.x, tokenScreenPos.y, 0, tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.65, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.7)');
                gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                maskCtx.save();
                maskCtx.clip();
                maskCtx.fillStyle = gradient;
                maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);
                maskCtx.restore();
            });
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.drawImage(visibilityMask, 0, 0);
        }
        else if ((!isGMMode || viewingFromToken) && currentViewingToken && visibleArea && visibilityPolygon && visibilityPolygon.length > 0) {
            const tokenPosition = currentViewingToken.position;
            let visionRange = 6;
            const tokenId = currentViewingToken.type === 'creature'
                ? (currentViewingToken.creatureId || currentViewingToken.id)
                : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
            if (tokenVisionRanges[tokenId]) visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            const tokenScreenPos = worldToScreen(tokenPosition.x, tokenPosition.y);
            let visionRangeInPixels = visionRange * 50 * effectiveZoom;
            if (Number.isFinite(tokenScreenPos.x) && Number.isFinite(tokenScreenPos.y) && visionRangeInPixels > 0) {
                visibilityMask = document.createElement('canvas');
                visibilityMask.width = canvas.width;
                visibilityMask.height = canvas.height;
                const maskCtx = visibilityMask.getContext('2d');
                maskCtx.beginPath();
                const firstPoint = worldToScreen(visibilityPolygon[0].x, visibilityPolygon[0].y);
                maskCtx.moveTo(firstPoint.x, firstPoint.y);
                for (let i = 1; i < visibilityPolygon.length; i++) {
                    const point = worldToScreen(visibilityPolygon[i].x, visibilityPolygon[i].y);
                    maskCtx.lineTo(point.x, point.y);
                }
                maskCtx.closePath();
                maskCtx.save();
                maskCtx.clip();
                const gradient = maskCtx.createRadialGradient(tokenScreenPos.x, tokenScreenPos.y, 0, tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                maskCtx.fillStyle = gradient;
                maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);
                maskCtx.restore();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.globalAlpha = 1;
                ctx.drawImage(visibilityMask, 0, 0);
            }
        }

        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
        visibleFogTiles.forEach(({ worldX, worldY }) => {
            const screenPos = worldToScreen(worldX, worldY);
            const tileSize = 50 * effectiveZoom;
            const fogState = getFogState(worldX, worldY);
            const fillColor = getFogColorLocal(fogState);
            ctx.fillStyle = fillColor;
            ctx.fillRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
        });

        if (visibilityMask) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.drawImage(visibilityMask, 0, 0);
        }

        if (!isGMMode && !isDraggingCameraRef.current) {
            drawStars(ctx, canvas.width, canvas.height);
        }
    }, [visibleFogPaths, visibleErasePaths, visibleFogTiles, fogOfWarEnabled, isFogLayerVisible, zoomLevel, playerZoom, cameraX, cameraY, isGMMode, worldToScreen, currentViewingToken, visibleArea, visibilityPolygon, allTokensVisibilityPolygons, viewingFromToken, tokenVisionRanges, getFogState, visibleAreaSet, screenToWorld]);

    useEffect(() => {
        renderFog();
    }, [renderFog]);

    return (
        <canvas
            ref={canvasRef}
            className="grid-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 40
            }}
        />
    );
};

export default StaticFogOverlay;