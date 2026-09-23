import React, { useEffect, useRef } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { rafThrottle } from '../../utils/performanceUtils';
import { getTileElevation } from '../../utils/ElevationUtils';
import {
  RIM_EDGE_SEGMENTS,
  formatElevationBadge,
  getRimEdges,
  shouldBadgeTile
} from '../../utils/elevationIndicators';

const RIM_DROP_COLOR = 'rgba(255, 214, 140, 0.92)';
const RIM_DROP_SHADOW = 'rgba(28, 20, 10, 0.5)';
const BADGE_POSITIVE = { fill: 'rgba(32, 23, 10, 0.78)', stroke: 'rgba(255, 214, 130, 0.8)', text: '#ffd777' };
const BADGE_NEGATIVE = { fill: 'rgba(9, 16, 30, 0.78)', stroke: 'rgba(140, 184, 255, 0.75)', text: '#9cc4ff' };

/**
 * ElevationIndicators - in-world elevation readability layer.
 *
 * Draws on every map view (2D, 2.5D, 3D, canvas-only or 3D terrain):
 *  - cliff/pit rims along every boundary where ground drops to a lower level,
 *    stroked at the higher tile's top;
 *  - level badges (+N / -N) on the rim of plateaus and pits.
 *
 * Ramps/stairs get no arrows: the stair/slope geometry itself is the intuitive
 * cue. The overlay sits above the 3D world layer and objects but below the fog
 * canvases, so fog of war hides markers the players have not discovered yet.
 */
const ElevationIndicators = () => {
    const canvasRef = useRef(null);
    const renderRef = useRef(() => {});

    const elevationData = useLevelEditorStore(state => state.elevationData);
    const indicatorsEnabled = useLevelEditorStore(state => state.elevationIndicatorsEnabled);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);

    const gridSize = useGameStore(state => state.gridSize);
    const zoomLevel = useGameStore(state => state.zoomLevel);
    const playerZoom = useGameStore(state => state.playerZoom);
    const viewMode = useGameStore(state => state.viewMode);
    const viewRotation = useGameStore(state => state.viewRotation);
    const viewTilt = useGameStore(state => state.viewTilt);
    const isGMMode = useGameStore(state => state.isGMMode);

    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelWidth = Math.round(width * dpr);
        const pixelHeight = Math.round(height * dpr);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const editor = useLevelEditorStore.getState();
        if (editor.elevationIndicatorsEnabled === false) return;
        const elevation = editor.elevationData || {};
        if (Object.keys(elevation).length === 0) return;

        const game = useGameStore.getState();
        const gs = getGridSystem();
        if (!gs) return;
        const size = game.gridSize || 50;
        const zoom = (game.zoomLevel || 1) * (game.playerZoom || 1);
        if (!Number.isFinite(zoom) || zoom <= 0) return;
        const offsetX = game.gridOffsetX || 0;
        const offsetY = game.gridOffsetY || 0;
        const gridType = gs.getGridState().gridType || 'square';
        const isHex = gridType === 'hex';

        const visibleAreaSet = (!game.isGMMode && editor.viewingFromToken && editor.visibleArea)
            ? (editor.visibleArea instanceof Set ? editor.visibleArea : new Set(editor.visibleArea))
            : null;
        const exploredAreasMap = editor.exploredAreas || {};

        const project = (worldX, worldY, worldZ) => gs.worldToScreen3D(worldX, worldY, worldZ, width, height);
        const levelAt = (x, y) => getTileElevation(elevation, x, y);

        const isTileVisible = (x, y, worldX, worldY) => {
            if (!visibleAreaSet) return true;
            const key = `${x},${y}`;
            if (visibleAreaSet.has(key)) return true;
            if (exploredAreasMap[key]) return true;
            return Boolean(editor.isPositionExplored?.(worldX, worldY));
        };

        const fontSize = Math.max(9, Math.min(13, 9 + zoom * 2));
        const badgeOffset = Math.max(7, size * zoom * 0.22);

        const drawRimLine = (p1, p2, lineWidth) => {
            ctx.lineCap = 'round';
            ctx.lineWidth = lineWidth + 2;
            ctx.strokeStyle = RIM_DROP_SHADOW;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = RIM_DROP_COLOR;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        };

        const drawBadge = (anchor, level) => {
            const label = formatElevationBadge(level);
            if (!label) return;
            const palette = level > 0 ? BADGE_POSITIVE : BADGE_NEGATIVE;
            const centerY = anchor.y - badgeOffset;
            ctx.save();
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textWidth = ctx.measureText(label).width;
            const padX = 5;
            const pillHeight = fontSize + 6;
            const pillWidth = textWidth + padX * 2;
            const left = anchor.x - pillWidth / 2;
            const top = centerY - pillHeight / 2;
            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(left, top, pillWidth, pillHeight, pillHeight / 2);
            } else {
                ctx.rect(left, top, pillWidth, pillHeight);
            }
            ctx.fillStyle = palette.fill;
            ctx.fill();
            ctx.strokeStyle = palette.stroke;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = palette.text;
            ctx.fillText(label, anchor.x, centerY + 0.5);
            ctx.restore();
        };

        const rimLineWidth = Math.max(1.5, zoom * 1.5);

        if (!isHex) {
            // Rims + badges (square grid). Only the higher side strokes the
            // shared edge, so each boundary is drawn exactly once.
            Object.keys(elevation).forEach((key) => {
                const [x, y] = key.split(',').map(Number);
                if (!Number.isFinite(x) || !Number.isFinite(y)) return;
                const level = levelAt(x, y);
                if (level === 0) return;
                const edges = getRimEdges(levelAt, x, y);
                if (edges.length === 0) return;

                const worldX = x * size + offsetX;
                const worldY = y * size + offsetY;
                if (!isTileVisible(x, y, worldX + size / 2, worldY + size / 2)) return;
                const topZ = level * size;

                edges.forEach(edge => {
                    if (!edge.lower) return;
                    const segment = RIM_EDGE_SEGMENTS[edge.dir];
                    if (!segment) return;
                    const p1 = project(worldX + segment[0][0] * size, worldY + segment[0][1] * size, topZ);
                    const p2 = project(worldX + segment[1][0] * size, worldY + segment[1][1] * size, topZ);
                    drawRimLine(p1, p2, rimLineWidth);
                });

                if (shouldBadgeTile(levelAt, x, y)) {
                    drawBadge(project(worldX + size / 2, worldY + size / 2, topZ), level);
                }
            });
        } else {
            // Hex rims + badges via the hex neighbour/edge helpers.
            Object.keys(elevation).forEach((key) => {
                const [q, r] = key.split(',').map(Number);
                if (!Number.isFinite(q) || !Number.isFinite(r)) return;
                const level = levelAt(q, r);
                if (level === 0) return;
                const center = gs.hexToWorld(q, r);
                if (!isTileVisible(q, r, center.x, center.y)) return;
                const neighbors = gs.getHexNeighbors(q, r);
                const topZ = level * size;
                let isRim = false;

                neighbors.forEach(neighbor => {
                    const neighborLevel = levelAt(neighbor.q, neighbor.r);
                    if (neighborLevel === level) return;
                    isRim = true;
                    if (neighborLevel >= level) return;
                    const edge = gs.getHexEdge(q, r, neighbor.q, neighbor.r);
                    if (!edge) return;
                    drawRimLine(
                        project(edge.start.x, edge.start.y, topZ),
                        project(edge.end.x, edge.end.y, topZ),
                        rimLineWidth
                    );
                });

                if (isRim) {
                    drawBadge(project(center.x, center.y, topZ), level);
                }
            });
        }
    };

    renderRef.current = render;

    const throttledRenderRef = useRef(null);
    if (!throttledRenderRef.current) {
        throttledRenderRef.current = rafThrottle(() => renderRef.current());
    }

    // Redraw on data/toggle/visibility changes.
    useEffect(() => {
        throttledRenderRef.current();
    }, [elevationData, indicatorsEnabled, visibleArea, viewingFromToken, gridSize, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt, isGMMode]);

    // Camera pan/zoom during drags: subscribe to the game store (rAF-throttled)
    // instead of re-rendering React on every frame.
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe((state, prevState) => {
            if (!prevState) return;
            if (state.cameraX !== prevState.cameraX ||
                state.cameraY !== prevState.cameraY ||
                state.zoomLevel !== prevState.zoomLevel ||
                state.playerZoom !== prevState.playerZoom ||
                state.gridOffsetX !== prevState.gridOffsetX ||
                state.gridOffsetY !== prevState.gridOffsetY) {
                throttledRenderRef.current();
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const handleResize = () => throttledRenderRef.current();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                // Above the 3D world (10) and objects (20); below fog (40) so
                // undiscovered areas keep their markers hidden.
                zIndex: 25
            }}
        />
    );
};

export default ElevationIndicators;
