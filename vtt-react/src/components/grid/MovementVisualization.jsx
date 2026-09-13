import React, { useMemo, useEffect, useRef } from 'react';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCharacterStore from '../../store/characterStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import { getTileElevation } from '../../utils/ElevationUtils';
import { useShallow } from 'zustand/react/shallow';

const MovementVisualization = ({
    startPosition,
    currentPosition,
    tokenId,
    gridSystem,
    wallData: propWallData
}) => {
    const {
        showMovementVisualization,
        movementLineColor,
        movementLineWidth,
        movementLineDashArray,
        feetPerTile
    } = useGameStore(useShallow((state) => ({
        showMovementVisualization: state.showMovementVisualization,
        movementLineColor: state.movementLineColor,
        movementLineWidth: state.movementLineWidth,
        movementLineDashArray: state.movementLineDashArray,
        feetPerTile: state.feetPerTile
    })));

    // Walls live in the level editor store (gameStore has no wall data)
    const editorWallData = useLevelEditorStore(state => state.wallData);
    const editorElevationData = useLevelEditorStore(state => state.elevationData) || {};
    const wallData = propWallData || editorWallData;

    // Project world points onto their elevated plane so the path hugs raised ground
    const projectElevated = (worldX, worldY) => {
        const tile = gridSystem.worldToGrid(worldX, worldY);
        const level = getTileElevation(editorElevationData, tile.x, tile.y);
        const cellSize = gridSystem.getGridState().gridSize || 50;
        return gridSystem.worldToScreen3D(worldX, worldY, level * cellSize, window.innerWidth, window.innerHeight);
    };

    // Re-render the SVG path when the camera projection changes (yaw/tilt/mode)
    const viewTransformKey = useGameStore(state => `${state.viewMode}|${state.viewRotation}|${state.viewTilt}`);

    const {
        isInCombat,
        validateMovement,
        getTotalUnlockedMovement
    } = useCombatStore(useShallow((state) => ({
        isInCombat: state.isInCombat,
        validateMovement: state.validateMovement,
        getTotalUnlockedMovement: state.getTotalUnlockedMovement
    })));
    const { tokens, creatures } = useCreatureStore(useShallow((state) => ({
        tokens: state.tokens,
        creatures: state.creatures
    })));
    const characterTokens = useCharacterTokenStore(state => state.characterTokens);
    const characterData = useCharacterStore(useShallow((state) => ({
        name: state.name,
        derivedStats: state.derivedStats
    })));

    // Animated stippled line (marching ants) - driven imperatively via ref so the
    // component does not re-render at animation frequency
    const lineRef = useRef(null);

    useEffect(() => {
        let animationFrameId;

        const animate = (now) => {
            if (lineRef.current) {
                lineRef.current.setAttribute('stroke-dashoffset', String(-((now * 0.015) % 12)));
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    // Calculate movement data (hook must be called before early return)
    const movementData = useMemo(() => {
        // Don't calculate if visualization is disabled or no positions provided
        if (!showMovementVisualization || !startPosition || !currentPosition || !gridSystem) {
            return null;
        }
        // Support both creature tokens AND character tokens
        const token = tokens.find(t => t.id === tokenId);
        let creature = token ? creatures.find(c => c.id === token.creatureId) : null;

        if (!creature) {
            const characterToken = (characterTokens || []).find(t => t.id === tokenId);
            if (characterToken) {
                creature = {
                    id: tokenId,
                    name: characterData.name || 'Character',
                    stats: {
                        speed: characterData.derivedStats?.movementSpeed || 30
                    }
                };
            }
        }

        if (!creature) return null;

        // Pathfinding calculation: find obstacle-avoiding path around walls with 5/10/5 diagonals
        // Elevation-aware: cliffs block steps > 1 level unless a ramp/stairs connects.
        // Multi-tile aware: large creatures respect footprint wall clearance and cliffs.
        const sizeMapping = getCreatureSizeMapping(creature?.size);
        const creatureTokenSize = Math.max(sizeMapping?.width || 1, sizeMapping?.height || 1);
        const creatureFootprint = { width: sizeMapping?.width || 1, height: sizeMapping?.height || 1 };

        let pathResult = null;
        if (typeof gridSystem.findPath === 'function') {
            try {
                const editorState = useLevelEditorStore.getState();
                pathResult = gridSystem.findPath(startPosition, currentPosition, wallData, {}, {
                    feetPerTile,
                    diagonalRule: '5105',
                    elevationData: editorState.elevationData,
                    rampData: editorState.rampData,
                    tokenSize: creatureTokenSize,
                    footprint: creatureFootprint
                });
            } catch (err) {
                console.warn('Pathfinding error in MovementVisualization:', err);
            }
        }

        const movementValidation = isInCombat ?
            validateMovement(tokenId, startPosition, currentPosition, creatures, feetPerTile) :
            null;

        let currentMoveFeet;
        let isPathBlocked = pathResult?.blocked ?? false;

        if (pathResult && pathResult.totalFeet !== undefined) {
            currentMoveFeet = pathResult.totalFeet;
        } else if (isInCombat && movementValidation) {
            currentMoveFeet = movementValidation.currentMovementFeet;
        } else {
            const dx = currentPosition.x - startPosition.x;
            const dy = currentPosition.y - startPosition.y;
            const worldDistance = Math.hypot(dx, dy);
            const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
            currentMoveFeet = tileDistance * feetPerTile;
        }

        const roundedDistance = Math.round(currentMoveFeet / feetPerTile) * feetPerTile;
        let lineColor = movementLineColor;
        let lineOpacity = 1.0;
        let displayText = `${roundedDistance} ft`;

        if (isPathBlocked) {
            lineColor = '#FF4444';
            displayText = `${roundedDistance} ft (Blocked)`;
        } else if (isInCombat && movementValidation) {
            const {
                isValid,
                needsConfirmation,
                creatureSpeed,
                additionalAPNeeded
            } = movementValidation;

            const baseSpeed = creatureSpeed;
            const currentUnlockedMovement = getTotalUnlockedMovement(tokenId, creatures);

            // Calculate total after this move using path distance
            const movementUsedThisTurn = useCombatStore.getState().turnMovementUsed?.get(tokenId) || 0;
            const totalMovementAfterThis = movementUsedThisTurn + currentMoveFeet;

            let movementLimit;
            if (totalMovementAfterThis > currentUnlockedMovement) {
                const segmentsNeeded = Math.ceil(totalMovementAfterThis / creatureSpeed);
                movementLimit = segmentsNeeded * creatureSpeed;
            } else {
                movementLimit = Math.max(baseSpeed, currentUnlockedMovement);
            }

            displayText = `${Math.round(totalMovementAfterThis)}/${movementLimit}ft`;

            if (!isValid) {
                lineColor = '#FF4444';
            } else if (needsConfirmation || totalMovementAfterThis > currentUnlockedMovement) {
                lineColor = '#FFA500';
                displayText += ` (+${additionalAPNeeded || Math.ceil((totalMovementAfterThis - currentUnlockedMovement) / creatureSpeed)} AP)`;
            } else if (totalMovementAfterThis <= creatureSpeed) {
                lineColor = '#32CD32';
            } else {
                lineColor = '#FFD700';
            }
        }

        return {
            feetDistance: currentMoveFeet,
            lineColor,
            lineOpacity,
            displayText,
            isValidMovement: !isPathBlocked && (!isInCombat || !movementValidation || movementValidation.isValid),
            worldPath: pathResult?.worldPath || null
        };
    }, [startPosition, currentPosition, tokenId, tokens, creatures, characterTokens, characterData, feetPerTile, isInCombat, gridSystem, movementLineColor, wallData, viewTransformKey]);

    if (!movementData) return null;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const startScreen = projectElevated(startPosition.x, startPosition.y);
    const currentScreen = projectElevated(currentPosition.x, currentPosition.y);

    // Build screen waypoints for the path
    let screenPoints = [startScreen, currentScreen];
    if (movementData.worldPath && movementData.worldPath.length > 2) {
        screenPoints = movementData.worldPath.map((wp, idx) => {
            if (idx === 0) return startScreen;
            if (idx === movementData.worldPath.length - 1) return currentScreen;
            return projectElevated(wp.x, wp.y);
        });
    }

    // SVG viewBox containing all waypoints plus padding
    const xs = screenPoints.map(p => p.x);
    const ys = screenPoints.map(p => p.y);
    const minX = Math.min(...xs) - 50;
    const minY = Math.min(...ys) - 50;
    const maxX = Math.max(...xs) + 50;
    const maxY = Math.max(...ys) + 50;
    const width = maxX - minX;
    const height = maxY - minY;

    const relativePoints = screenPoints.map(p => ({
        x: p.x - minX,
        y: p.y - minY
    }));

    // Waypoint midpoint for label placement
    const midIdx = Math.floor(relativePoints.length / 2);
    const midX = relativePoints.length === 2
        ? (relativePoints[0].x + relativePoints[1].x) / 2
        : relativePoints[midIdx].x;
    const midY = relativePoints.length === 2
        ? (relativePoints[0].y + relativePoints[1].y) / 2
        : relativePoints[midIdx].y;

    const pointsString = relativePoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div
            style={{
                position: 'absolute',
                left: `${minX}px`,
                top: `${minY}px`,
                width: `${width}px`,
                height: `${height}px`,
                pointerEvents: 'none',
                zIndex: 100 // Above grid, below UI
            }}
        >
            <svg
                width={width}
                height={height}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            >
                {/* Movement line or polyline with animated stippled effect */}
                <polyline
                    ref={lineRef}
                    points={pointsString}
                    fill="none"
                    stroke={movementData.lineColor}
                    strokeWidth={movementLineWidth}
                    strokeDasharray={movementLineDashArray}
                    strokeDashoffset={0}
                    strokeOpacity={movementData.lineOpacity}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Intermediate waypoint dots */}
                {relativePoints.length > 2 && relativePoints.slice(1, -1).map((pt, idx) => (
                    <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={3}
                        fill={movementData.lineColor}
                        fillOpacity={0.7}
                    />
                ))}

                {/* Current position marker */}
                <circle
                    cx={relativePoints[relativePoints.length - 1].x}
                    cy={relativePoints[relativePoints.length - 1].y}
                    r={4}
                    fill={movementData.lineColor}
                    fillOpacity={0.9}
                />

                {/* Distance label - positioned along the movement line */}
                {movementData.feetDistance > 0 && (
                    <g>
                        {(() => {
                            const offsetX = 10;
                            const offsetY = -10;

                            return (
                                <>
                                    <rect
                                        x={midX + offsetX}
                                        y={midY + offsetY - 8}
                                        width={Math.max(80, movementData.displayText.length * 7)}
                                        height={18}
                                        fill="rgba(0, 0, 0, 0.8)"
                                        rx={4}
                                        stroke="rgba(255, 255, 255, 0.3)"
                                        strokeWidth={1}
                                    />
                                    <text
                                        x={midX + offsetX + 5}
                                        y={midY + offsetY + 4}
                                        fill="white"
                                        fontSize="11"
                                        fontWeight="bold"
                                        fontFamily="'Cinzel', 'Bookman Old Style', serif"
                                        textAnchor="start"
                                    >
                                        {movementData.displayText}
                                    </text>
                                </>
                            );
                        })()}
                    </g>
                )}
            </svg>
        </div>
    );
};

export default MovementVisualization;
