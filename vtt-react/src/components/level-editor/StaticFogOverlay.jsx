import React, { useCallback, useRef, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { calculateVisibilityPolygon } from '../../utils/VisibilityCalculations';

/**
 * Helper function for consistent fog colors across the component
 * Returns localized colors for different fog states (covered, explored, etc.)
 */
const getFogColorLocal = (state, isGMMode) => {
    switch (state) {
        case 'covered':
            return isGMMode ? 'rgba(10, 10, 25, 0.7)' : 'rgba(10, 10, 25, 0.97)'; // Deep midnight-blue for full fog (less dark for GM)
        case 'explored':
            return isGMMode ? 'rgba(25, 20, 45, 0.45)' : 'rgba(25, 20, 45, 0.65)'; // Slightly translucent dark purple for explored areas
        case 'viewable':
        case 'cleared':
            return 'rgba(0, 0, 0, 0)'; // Transparent for visible areas
        default:
            return isGMMode ? 'rgba(10, 10, 25, 0.7)' : 'rgba(10, 10, 25, 0.97)'; // Default to covered
    }
};

/**
 * StaticFogOverlay - Renders path-based and tile-based fog of war on a canvas
 * Optimized with offscreen caching and viewport culling
 */
const StaticFogOverlay = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const tempCanvasRef = useRef(null);
    const isDraggingCameraRef = useRef(false);

    // PERFORMANCE: Pooled canvases to avoid per-frame allocation/GC
    const primaryShapeCanvasRef = useRef(null);
    const primaryMaskCanvasRef = useRef(null);
    const creatureShapeCanvasRef = useRef(null);
    const creatureMaskCanvasRef = useRef(null);

    // PERFORMANCE: Cache the blurred shape canvas; only re-blur when polygon changes
    const blurredShapeCacheRef = useRef({ key: null, canvas: null });

    const ensurePooledCanvas = (ref, width, height) => {
        let c = ref.current;
        if (!c) {
            c = document.createElement('canvas');
            ref.current = c;
        }
        if (c.width !== width || c.height !== height) {
            c.width = width;
            c.height = height;
        }
        return c;
    };

    // PERFORMANCE: Track last render state to skip redundant redraws
    const lastRenderStateRef = useRef({
        cameraKey: null,
        visibilityKey: null,
        lastRenderTime: 0
    });

    // Store Subscriptions - Game State
    const gridSize = useGameStore(state => state.gridSize) || 50;
    const gridOffsetX = useGameStore(state => state.gridOffsetX) || 0;
    const gridOffsetY = useGameStore(state => state.gridOffsetY) || 0;
    const { cameraX, cameraY, zoomLevel, playerZoom, isGMMode: storeIsGMMode } = useGameStore(state => ({
        cameraX: state.cameraX ?? 0,
        cameraY: state.cameraY ?? 0,
        zoomLevel: state.zoomLevel ?? 1,
        playerZoom: state.playerZoom ?? 1,
        isGMMode: state.isGMMode
    }));

    const isGMMode = storeIsGMMode;

    // PERFORMANCE: RAF-based camera tracking ref — avoids React re-render on every camera move
    const cameraRafRef = useRef(null);

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
    const additionalVisibilityPolygons = useLevelEditorStore(state => state.additionalVisibilityPolygons) || [];
    const controlledCreatureVisionDetails = useLevelEditorStore(state => state.controlledCreatureVisionDetails) || [];
    const tokenVisionRanges = useLevelEditorStore(state => state.tokenVisionRanges) || {};
    const getFogState = useLevelEditorStore(state => state.getFogState);

    // Per-player memory subscriptions for explored areas
    const currentPlayerId = useLevelEditorStore(state => state.currentPlayerId);
    const playerMemories = useLevelEditorStore(state => state.playerMemories);
    const wallData = useLevelEditorStore(state => state.wallData) || {};

    const creatureTokens = useCreatureStore(state => state.tokens) || [];
    const characterTokens = useCharacterTokenStore(state => state.characterTokens) || [];

    // Helper functions for coordinate conversion
    const worldToScreen = useCallback((worldX, worldY, customCameraX, customCameraY, customZoom) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        
        const cx = customCameraX ?? cameraX;
        const cy = customCameraY ?? cameraY;
        const cz = customZoom ?? (zoomLevel * playerZoom);
        
        return {
            x: (worldX - cx) * cz + canvas.width / 2,
            y: (worldY - cy) * cz + canvas.height / 2
        };
    }, [cameraX, cameraY, zoomLevel, playerZoom]);

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

    // Vision polygons for all tokens (used by GM to see what players/creatures can see)
    const allTokensVisibilityPolygons = useMemo(() => {
        if (!isGMMode || viewingFromToken) return [];

        const allTokens = [...creatureTokens, ...characterTokens];
        return allTokens.map(token => {
            if (!token.position) return null;
            const tokenId = token.creatureId || token.characterId || token.id;
            const vision = tokenVisionRanges[tokenId] || { range: 6 };
            const polygon = calculateVisibilityPolygon(
                token.position.x, token.position.y,
                vision.range, wallData, gridSize, gridOffsetX, gridOffsetY
            );
            return { token, polygon, visionRange: vision.range };
        }).filter(p => p && p.polygon && p.polygon.length > 0);
    }, [isGMMode, viewingFromToken, creatureTokens, characterTokens, tokenVisionRanges, wallData, gridSize, gridOffsetX, gridOffsetY]);

    // Main render function - OPTIMIZED with change detection
    const renderFog = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !fogOfWarEnabled || !isFogLayerVisible) return;

        const effectiveZoom = zoomLevel * playerZoom;
        if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return;

        // PERFORMANCE: Check if anything significant changed before rendering
        const currentCameraKey = `${cameraX.toFixed(2)},${cameraY.toFixed(2)},${effectiveZoom.toFixed(3)}`;
        const currentVisibilityKey = visibilityPolygon ? visibilityPolygon.length : 0;
        
        const cameraChanged = lastRenderStateRef.current.cameraKey !== currentCameraKey;
        const visibilityChanged = lastRenderStateRef.current.visibilityKey !== currentVisibilityKey;
        
        const now = Date.now();
        if (!cameraChanged && !visibilityChanged && (now - lastRenderStateRef.current.lastRenderTime) < 16) {
            return;
        }

        // Update cache
        lastRenderStateRef.current = {
            cameraKey: currentCameraKey,
            visibilityKey: currentVisibilityKey,
            lastRenderTime: now
        };

        if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offscreenCanvas = offscreenCanvasRef.current;

        if (!tempCanvasRef.current) {
            tempCanvasRef.current = document.createElement('canvas');
        }
        const tempCanvas = tempCanvasRef.current;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const starTime = Math.floor(Date.now() / 500) % 1000;

        const drawStars = (ctx, canvasWidth, canvasHeight, camX, camY, zoom) => {
            const maxStars = 100;
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (let i = 0; i < maxStars; i++) {
                const seed = 12345 + i * 7919;
                const baseX = ((seed * 137) % 10000) / 10000 * canvasWidth;
                const baseY = ((seed * 271) % 10000) / 10000 * canvasHeight;
                let x = (baseX - (camX * zoom * 0.95)) % canvasWidth;
                let y = (baseY - (camY * zoom * 0.95)) % canvasHeight;
                if (x < 0) x += canvasWidth;
                if (y < 0) y += canvasHeight;
                const twinkle = Math.sin(starTime * 0.02 + i) * 0.3 + 0.7;
                ctx.globalAlpha = Math.max(0.3, Math.min(1.0, twinkle));
                ctx.fillRect(x, y, 1, 1);
            }
            ctx.restore();
        };

        const hasFogContent = visibleFogPaths.length > 0 || Object.keys(fogOfWarData).length > 0;
        if (!isGMMode && !viewingFromToken && hasFogContent) {
            ctx.fillStyle = getFogColorLocal('covered', false);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawStars(ctx, canvas.width, canvas.height, cameraX, cameraY, effectiveZoom);
            return;
        }

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
        const coveredFogColor = getFogColorLocal('covered', isGMMode);
        const softEdgeRatio = 0.3;

        const maskCanvas = tempCanvas;
        const mCtx = maskCanvas.getContext('2d');
        mCtx.save();
        mCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        mCtx.globalCompositeOperation = 'source-over';

        const renderPathToMask = (targetCtx, path, isErase = false) => {
            const points = path.points;
            if (!points || points.length === 0) return;
            const baseRadius = (points[0].brushRadius || 20);
            const shadowBlurAmount = baseRadius * softEdgeRatio;
            const solidRadius = baseRadius * (1 - softEdgeRatio * 0.5);
            targetCtx.save();
            targetCtx.globalCompositeOperation = isErase ? 'destination-out' : 'source-over';
            targetCtx.shadowColor = '#000000';
            targetCtx.shadowBlur = shadowBlurAmount;
            targetCtx.fillStyle = '#000000';
            targetCtx.strokeStyle = '#000000';
            if (points.length === 1) {
                const p = points[0];
                const screenPos = worldToScreen(p.worldX, p.worldY);
                targetCtx.beginPath();
                targetCtx.arc(screenPos.x, screenPos.y, solidRadius, 0, Math.PI * 2);
                targetCtx.fill();
            } else {
                targetCtx.lineWidth = solidRadius * 2;
                targetCtx.lineCap = 'round';
                targetCtx.lineJoin = 'round';
                targetCtx.beginPath();
                const startPos = worldToScreen(points[0].worldX, points[0].worldY, cameraX, cameraY, effectiveZoom);
                targetCtx.moveTo(startPos.x, startPos.y);
                for (let i = 1; i < points.length; i++) {
                    const s = worldToScreen(points[i].worldX, points[i].worldY, cameraX, cameraY, effectiveZoom);
                    targetCtx.lineTo(s.x, s.y);
                }
                targetCtx.stroke();
            }
            targetCtx.restore();
        };

        const renderExploredToMask = (targetCtx) => {
            if (!viewingFromToken) return;
            const levelEditorState = useLevelEditorStore.getState();
            const currentPlayerIdLocal = levelEditorState.currentPlayerId;
            const playerMemoriesLocal = currentPlayerIdLocal ? levelEditorState.playerMemories[currentPlayerIdLocal] : null;
            const exploredPolygons = playerMemoriesLocal?.exploredPolygons || levelEditorState.exploredPolygons || [];
            const exploredCircles = playerMemoriesLocal?.exploredCircles || levelEditorState.exploredCircles || [];
            if (exploredPolygons.length === 0 && exploredCircles.length === 0) return;
            targetCtx.save();
            targetCtx.globalCompositeOperation = 'destination-out';
            targetCtx.globalAlpha = 0.33;
            exploredPolygons.forEach(polygon => {
                if (!polygon.points || polygon.points.length < 3) return;
                const screenPoints = polygon.points.map(p => worldToScreen(p.x, p.y, cameraX, cameraY, effectiveZoom));
                targetCtx.beginPath();
                targetCtx.moveTo(screenPoints[0].x, screenPoints[0].y);
                for (let i = 1; i < screenPoints.length; i++) targetCtx.lineTo(screenPoints[i].x, screenPoints[i].y);
                targetCtx.closePath();
                targetCtx.fill();
            });
            exploredCircles.forEach(circle => {
                const screenPos = worldToScreen(circle.x, circle.y, cameraX, cameraY, effectiveZoom);
                const radius = circle.radius * effectiveZoom * 1.12;
                targetCtx.beginPath();
                targetCtx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                targetCtx.fill();
            });
            targetCtx.restore();
        };

        allItems.forEach(item => {
            if (item.type === 'fog') {
                const path = item;
                const isExplicitCover = path.id && path.id.startsWith('fog_cover_entire_map_');
                const isFullCoverage = path.isFullCoverage || isExplicitCover || (path.points && path.points.length > 20000);
                if (isFullCoverage) {
                    mCtx.globalCompositeOperation = 'source-over';
                    mCtx.fillStyle = '#000000';
                    mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
                    renderExploredToMask(mCtx);
                } else {
                    renderPathToMask(mCtx, path, false);
                }
            } else if (item.type === 'erase') {
                const path = item;
                const isExplicitCover = path.id && path.id.startsWith('erase_cover_entire_map_');
                const isFullCoverage = path.isFullCoverage || isExplicitCover;
                if (isFullCoverage) {
                    mCtx.globalCompositeOperation = 'destination-out';
                    mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
                } else {
                    renderPathToMask(mCtx, path, true);
                }
            }
        });

        offscreenCtx.save();
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.globalCompositeOperation = 'source-over';
        offscreenCtx.drawImage(maskCanvas, 0, 0);
        offscreenCtx.globalCompositeOperation = 'source-in';
        offscreenCtx.fillStyle = coveredFogColor;
        offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.restore();

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(offscreenCanvas, 0, 0);

        ctx.save();
        let visibilityMask = null;
        if (isGMMode && !viewingFromToken && allTokensVisibilityPolygons.length > 0) {
            visibilityMask = document.createElement('canvas');
            visibilityMask.width = canvas.width;
            visibilityMask.height = canvas.height;
            const maskCtx = visibilityMask.getContext('2d');
            maskCtx.clearRect(0, 0, visibilityMask.width, visibilityMask.height);

            const getTokenColor = (index) => {
                const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B', '#795548'];
                return colors[index % colors.length];
            };

            allTokensVisibilityPolygons.forEach(({ token, polygon, visionRange }, index) => {
                if (!polygon || polygon.length === 0) return;
                const tokenScreenPos = worldToScreen(token.position.x, token.position.y);
                const visionRangeInPixels = visionRange * gridSize * effectiveZoom;
                maskCtx.globalCompositeOperation = 'source-over';
                maskCtx.beginPath();
                const firstPoint = worldToScreen(polygon[0].x, polygon[0].y, cameraX, cameraY, effectiveZoom);
                maskCtx.moveTo(firstPoint.x, firstPoint.y);
                for (let i = 1; i < polygon.length; i++) {
                    const point = worldToScreen(polygon[i].x, polygon[i].y, cameraX, cameraY, effectiveZoom);
                    maskCtx.lineTo(point.x, point.y);
                }
                maskCtx.closePath();
                const gradient = maskCtx.createRadialGradient(tokenScreenPos.x, tokenScreenPos.y, 0, tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.40, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.60, 'rgba(255, 255, 255, 0.85)');
                gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.55)');
                gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.25)');
                gradient.addColorStop(0.96, 'rgba(255, 255, 255, 0.08)');
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

            ctx.globalCompositeOperation = 'source-over';
            allTokensVisibilityPolygons.forEach(({ token, polygon, visionRange }, index) => {
                if (!polygon || polygon.length === 0) return;
                const color = getTokenColor(index);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.7;
                ctx.setLineDash([5, 5]);
                ctx.save();
                ctx.filter = 'blur(2px)';
                ctx.beginPath();
                const firstPoint = worldToScreen(polygon[0].x, polygon[0].y, cameraX, cameraY, effectiveZoom);
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (let i = 1; i < polygon.length; i++) {
                    const point = worldToScreen(polygon[i].x, polygon[i].y, cameraX, cameraY, effectiveZoom);
                    ctx.lineTo(point.x, point.y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();

                const tokenScreenPos = worldToScreen(token.position.x, token.position.y);
                const tokenName = token.name || token.creatureId || token.characterId || `Token ${index + 1}`;
                ctx.font = '10px Arial';
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.9;
                ctx.textAlign = 'center';
                ctx.fillText(tokenName, tokenScreenPos.x, tokenScreenPos.y - 10);
            });
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }
        else if ((!isGMMode || viewingFromToken) && currentViewingToken && visibleArea && visibilityPolygon && visibilityPolygon.length > 0) {
            const tokenPosition = currentViewingToken.position;
            let visionRange = 6;
            const tokenId = currentViewingToken.type === 'creature'
                ? (currentViewingToken.creatureId || currentViewingToken.id)
                : (currentViewingToken.characterId || currentViewingToken.id || currentViewingToken.playerId);
            if (tokenVisionRanges[tokenId]) visionRange = tokenVisionRanges[tokenId].range ?? visionRange;
            const tokenScreenPos = worldToScreen(tokenPosition.x, tokenPosition.y, cameraX, cameraY, effectiveZoom);
            let visionRangeInPixels = visionRange * gridSize * effectiveZoom;
            if (Number.isFinite(tokenScreenPos.x) && Number.isFinite(tokenScreenPos.y) && visionRangeInPixels > 0) {
                const polyKey = visibilityPolygon.length + '_' +
                    (visibilityPolygon[0] ? `${visibilityPolygon[0].x.toFixed(1)},${visibilityPolygon[0].y.toFixed(1)}` : '') +
                    (visibilityPolygon.length > 1 ? `_${visibilityPolygon[visibilityPolygon.length-1].x.toFixed(1)},${visibilityPolygon[visibilityPolygon.length-1].y.toFixed(1)}` : '');

                const shapeCanvas = ensurePooledCanvas(primaryShapeCanvasRef, canvas.width, canvas.height);
                const shapeCtx = shapeCanvas.getContext('2d');

                const blurCache = blurredShapeCacheRef.current;
                if (blurCache.key !== polyKey || blurCache.canvas?.width !== canvas.width || blurCache.canvas?.height !== canvas.height) {
                    shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                    shapeCtx.filter = 'blur(40px)';
                    shapeCtx.fillStyle = 'rgba(255,255,255,1)';
                    shapeCtx.beginPath();
                    const firstPointS = worldToScreen(visibilityPolygon[0].x, visibilityPolygon[0].y, cameraX, cameraY, effectiveZoom);
                    shapeCtx.moveTo(firstPointS.x, firstPointS.y);
                    for (let i = 1; i < visibilityPolygon.length; i++) {
                        const point = worldToScreen(visibilityPolygon[i].x, visibilityPolygon[i].y, cameraX, cameraY, effectiveZoom);
                        shapeCtx.lineTo(point.x, point.y);
                    }
                    shapeCtx.closePath();
                    shapeCtx.fill();
                    shapeCtx.filter = 'none';

                    if (!blurredShapeCacheRef.current._cacheRef) {
                        blurredShapeCacheRef.current._cacheRef = { current: null };
                    }
                    const cachedBlur = ensurePooledCanvas(blurredShapeCacheRef.current._cacheRef, canvas.width, canvas.height);
                    const cachedCtx = cachedBlur.getContext('2d');
                    cachedCtx.clearRect(0, 0, cachedBlur.width, cachedBlur.height);
                    cachedCtx.drawImage(shapeCanvas, 0, 0);
                    blurredShapeCacheRef.current = { key: polyKey, canvas: cachedBlur, _cacheRef: blurredShapeCacheRef.current._cacheRef };
                } else {
                    shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                    shapeCtx.drawImage(blurCache.canvas, 0, 0);
                }

                visibilityMask = ensurePooledCanvas(primaryMaskCanvasRef, canvas.width, canvas.height);
                const maskCtx = visibilityMask.getContext('2d');
                maskCtx.clearRect(0, 0, visibilityMask.width, visibilityMask.height);
                maskCtx.drawImage(shapeCanvas, 0, 0);
                maskCtx.globalCompositeOperation = 'source-in';
                const gradient = maskCtx.createRadialGradient(
                    tokenScreenPos.x, tokenScreenPos.y, 0,
                    tokenScreenPos.x, tokenScreenPos.y, visionRangeInPixels
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.20, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.90)');
                gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.65)');
                gradient.addColorStop(0.80, 'rgba(255, 255, 255, 0.35)');
                gradient.addColorStop(0.92, 'rgba(255, 255, 255, 0.12)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                maskCtx.fillStyle = gradient;
                maskCtx.fillRect(0, 0, visibilityMask.width, visibilityMask.height);

                ctx.globalCompositeOperation = 'destination-out';
                ctx.globalAlpha = 1;
                ctx.drawImage(visibilityMask, 0, 0);
            }

            if (additionalVisibilityPolygons.length > 0) {
                additionalVisibilityPolygons.forEach((poly, idx) => {
                    if (!poly || poly.length < 3) return;
                    const detail = controlledCreatureVisionDetails[idx];
                    let creatureScreenPos;
                    if (detail) {
                        creatureScreenPos = worldToScreen(detail.position.x, detail.position.y, cameraX, cameraY, effectiveZoom);
                    } else {
                        const screenPts = poly.map(p => worldToScreen(p.x, p.y, cameraX, cameraY, effectiveZoom));
                        let cx = 0, cy = 0;
                        screenPts.forEach(p => { cx += p.x; cy += p.y; });
                        creatureScreenPos = { x: cx / screenPts.length, y: cy / screenPts.length };
                    }
                    const creatureVisionRange = detail?.visionRange || 6;
                    const creatureVisionPixels = creatureVisionRange * gridSize * effectiveZoom;
                    const shapeCanvas = ensurePooledCanvas(creatureShapeCanvasRef, canvas.width, canvas.height);
                    const shapeCtx = shapeCanvas.getContext('2d');
                    shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                    shapeCtx.filter = 'blur(20px)';
                    shapeCtx.fillStyle = 'rgba(255,255,255,1)';
                    shapeCtx.beginPath();
                    const fp = worldToScreen(poly[0].x, poly[0].y, cameraX, cameraY, effectiveZoom);
                    shapeCtx.moveTo(fp.x, fp.y);
                    for (let i = 1; i < poly.length; i++) {
                        const pt = worldToScreen(poly[i].x, poly[i].y, cameraX, cameraY, effectiveZoom);
                        shapeCtx.lineTo(pt.x, pt.y);
                    }
                    shapeCtx.closePath();
                    shapeCtx.fill();
                    shapeCtx.filter = 'none';
                    const maskC = ensurePooledCanvas(creatureMaskCanvasRef, canvas.width, canvas.height);
                    const maskCtx = maskC.getContext('2d');
                    maskCtx.clearRect(0, 0, maskC.width, maskC.height);
                    maskCtx.drawImage(shapeCanvas, 0, 0);
                    maskCtx.globalCompositeOperation = 'source-in';
                    const gradient = maskCtx.createRadialGradient(
                        creatureScreenPos.x, creatureScreenPos.y, 0,
                        creatureScreenPos.x, creatureScreenPos.y, creatureVisionPixels
                    );
                    gradient.addColorStop(0,    'rgba(255, 255, 255, 1)');
                    gradient.addColorStop(0.20, 'rgba(255, 255, 255, 1)');
                    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.90)');
                    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.65)');
                    gradient.addColorStop(0.80, 'rgba(255, 255, 255, 0.35)');
                    gradient.addColorStop(0.92, 'rgba(255, 255, 255, 0.12)');
                    gradient.addColorStop(1,    'rgba(255, 255, 255, 0)');
                    maskCtx.fillStyle = gradient;
                    maskCtx.fillRect(0, 0, maskC.width, maskC.height);
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.globalAlpha = 1;
                    ctx.drawImage(maskC, 0, 0);
                });
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
            }

            if (!isGMMode && viewingFromToken) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = 2;
                if (visibilityPolygon && visibilityPolygon.length > 0) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    const fp0 = worldToScreen(visibilityPolygon[0].x, visibilityPolygon[0].y, cameraX, cameraY, effectiveZoom);
                    ctx.moveTo(fp0.x, fp0.y);
                    for (let i = 1; i < visibilityPolygon.length; i++) {
                        const pt = worldToScreen(visibilityPolygon[i].x, visibilityPolygon[i].y, cameraX, cameraY, effectiveZoom);
                        ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.closePath();
                    ctx.save();
                    ctx.filter = 'blur(2px)';
                    ctx.stroke();
                    ctx.restore();
                }
                controlledCreatureVisionDetails.forEach(detail => {
                    if (!detail.polygon || detail.polygon.length < 3) return;
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    const fp0 = worldToScreen(detail.polygon[0].x, detail.polygon[0].y, cameraX, cameraY, effectiveZoom);
                    ctx.moveTo(fp0.x, fp0.y);
                    for (let i = 1; i < detail.polygon.length; i++) {
                        const pt = worldToScreen(detail.polygon[i].x, detail.polygon[i].y, cameraX, cameraY, effectiveZoom);
                        ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.closePath();
                    ctx.save();
                    ctx.filter = 'blur(2px)';
                    ctx.stroke();
                    ctx.restore();
                });
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            }
        }
        ctx.restore();

        ctx.globalCompositeOperation = 'source-over';
        visibleFogTiles.forEach(({ worldX, worldY }) => {
            const screenPos = worldToScreen(worldX, worldY, cameraX, cameraY, effectiveZoom);
            const tileSize = 50 * effectiveZoom;
            const fogState = getFogState(worldX, worldY);
            const fillColor = getFogColorLocal(fogState, isGMMode);
            ctx.fillStyle = fillColor;
            ctx.fillRect(screenPos.x - tileSize / 2, screenPos.y - tileSize / 2, tileSize, tileSize);
        });

        if ((!isGMMode || allTokensVisibilityPolygons.length > 0) && !isDraggingCameraRef.current) {
            drawStars(ctx, canvas.width, canvas.height, cameraX, cameraY, effectiveZoom);
        }

        if (visibilityMask && isGMMode && !viewingFromToken) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = 1;
            ctx.drawImage(visibilityMask, 0, 0);
        }
    }, [visibleFogPaths, visibleErasePaths, visibleFogTiles, fogOfWarEnabled, isFogLayerVisible, zoomLevel, playerZoom, isGMMode, worldToScreen, currentViewingToken, visibleArea, visibilityPolygon, allTokensVisibilityPolygons, viewingFromToken, tokenVisionRanges, getFogState, visibleAreaSet, screenToWorld, currentPlayerId, playerMemories, wallData, gridSize, gridOffsetX, gridOffsetY, additionalVisibilityPolygons, controlledCreatureVisionDetails, cameraX, cameraY]);

    useLayoutEffect(() => {
        renderFog();
    }, [renderFog, cameraX, cameraY, zoomLevel, playerZoom, visibilityPolygon, fogOfWarPaths]);

    // Cleanup RAF and subscription
    useEffect(() => {
        return () => {
            if (cameraRafRef.current) cancelAnimationFrame(cameraRafRef.current);
        };
    }, []);

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