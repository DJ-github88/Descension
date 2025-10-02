import React, { useMemo, useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';

const MovementVisualization = ({
    startPosition,
    currentPosition,
    tokenId,
    gridSystem
}) => {
    const {
        showMovementVisualization,
        movementLineColor,
        movementLineWidth,
        movementLineDashArray,
        feetPerTile
    } = useGameStore();

    const { isInCombat, validateMovement, turnMovementUsed, getTotalUnlockedMovement } = useCombatStore();
    const { tokens, creatures } = useCreatureStore();

    // Animation state for stippled line (marching ants effect)
    const [dashOffset, setDashOffset] = useState(0);

    // Animate the dash offset for marching ants effect
    useEffect(() => {
        let animationFrameId;
        let lastTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Update dash offset (move 15 pixels per second)
            setDashOffset(prev => (prev + (deltaTime * 0.015)) % 12);

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
        // Find the token and creature data
        const token = tokens.find(t => t.id === tokenId);
        const creature = token ? creatures.find(c => c.id === token.creatureId) : null;
        
        if (!creature) return null;

        // Calculate distance for this specific move
        // CRITICAL FIX: Properly convert world distance to tile distance before multiplying by feetPerTile
        const dx = currentPosition.x - startPosition.x;
        const dy = currentPosition.y - startPosition.y;
        const worldDistance = Math.sqrt(dx * dx + dy * dy);
        // Convert world distance to tiles using grid size
        const tileDistance = worldDistance / gridSystem.getGridState().gridSize;
        const currentMoveFeet = tileDistance * feetPerTile;

        // Get movement validation data
        const movementValidation = isInCombat ?
            validateMovement(tokenId, startPosition, currentPosition, creatures, feetPerTile) :
            null;

        // Determine line color based on movement validity
        let lineColor = movementLineColor;
        let lineOpacity = 1.0;
        let displayText = `${Math.round(currentMoveFeet)} ft`;

        if (isInCombat && movementValidation) {
            const {
                isValid,
                needsConfirmation,
                totalMovementAfterThis,
                movementUsedThisTurn,
                creatureSpeed,
                additionalAPNeeded
            } = movementValidation;

            // Calculate movement limits based on how much movement has been unlocked
            const baseSpeed = creatureSpeed;

            // Get the current total unlocked movement from the store
            const currentUnlockedMovement = getTotalUnlockedMovement(tokenId, creatures);

            // Determine the appropriate limit to display
            let movementLimit;
            if (totalMovementAfterThis > currentUnlockedMovement) {
                // Will exceed current unlocked movement, show what the limit would be after paying additional AP
                const segmentsNeeded = Math.ceil(totalMovementAfterThis / creatureSpeed);
                movementLimit = segmentsNeeded * creatureSpeed;
            } else {
                // Within current unlocked movement, show current limit
                movementLimit = Math.max(baseSpeed, currentUnlockedMovement);
            }

            // Format display text as "total after this move/limit ft"
            displayText = `${Math.round(totalMovementAfterThis)}/${movementLimit}ft`;

            if (!isValid) {
                // Invalid movement - red
                lineColor = '#FF4444';
            } else if (needsConfirmation) {
                // Requires extra AP - orange
                lineColor = '#FFA500';
                displayText += ` (+${additionalAPNeeded} AP)`;
            } else if (totalMovementAfterThis <= creatureSpeed) {
                // Within base movement - green
                lineColor = '#32CD32';
            } else {
                // Using already paid AP - yellow
                lineColor = '#FFD700';
            }
        }

        return {
            feetDistance: currentMoveFeet,
            lineColor,
            lineOpacity,
            displayText,
            isValidMovement: !isInCombat || !movementValidation || movementValidation.isValid
        };
    }, [startPosition, currentPosition, tokenId, tokens, creatures, feetPerTile, isInCombat, gridSystem, movementLineColor]);

    // Don't render if no movement data or visualization is disabled
    if (!movementData) return null;

    // CRITICAL FIX: Convert world coordinates to screen coordinates with viewport dimensions
    // This ensures proper centering and positioning
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const startScreen = gridSystem.worldToScreen(startPosition.x, startPosition.y, viewportWidth, viewportHeight);
    const currentScreen = gridSystem.worldToScreen(currentPosition.x, currentPosition.y, viewportWidth, viewportHeight);

    // Calculate SVG viewBox to contain the line with some padding
    const minX = Math.min(startScreen.x, currentScreen.x) - 50;
    const minY = Math.min(startScreen.y, currentScreen.y) - 50;
    const maxX = Math.max(startScreen.x, currentScreen.x) + 50;
    const maxY = Math.max(startScreen.y, currentScreen.y) + 50;
    const width = maxX - minX;
    const height = maxY - minY;

    // Adjust coordinates relative to SVG viewBox
    const relativeStartX = startScreen.x - minX;
    const relativeStartY = startScreen.y - minY;
    const relativeCurrentX = currentScreen.x - minX;
    const relativeCurrentY = currentScreen.y - minY;

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
                {/* Movement line with animated stippled effect */}
                <line
                    x1={relativeStartX}
                    y1={relativeStartY}
                    x2={relativeCurrentX}
                    y2={relativeCurrentY}
                    stroke={movementData.lineColor}
                    strokeWidth={movementLineWidth}
                    strokeDasharray={movementLineDashArray}
                    strokeDashoffset={-dashOffset}
                    strokeOpacity={movementData.lineOpacity}
                    strokeLinecap="round"
                />
                
                {/* Start position marker */}
                <circle
                    cx={relativeStartX}
                    cy={relativeStartY}
                    r={6}
                    fill={movementData.lineColor}
                    fillOpacity={0.8}
                    stroke="white"
                    strokeWidth={2}
                />
                
                {/* Current position marker */}
                <circle
                    cx={relativeCurrentX}
                    cy={relativeCurrentY}
                    r={4}
                    fill={movementData.lineColor}
                    fillOpacity={0.9}
                />
                
                {/* Distance label - positioned along the movement line */}
                {movementData.feetDistance > 0 && (
                    <g>
                        {/* Calculate midpoint of the line for label positioning */}
                        {(() => {
                            const midX = (relativeStartX + relativeCurrentX) / 2;
                            const midY = (relativeStartY + relativeCurrentY) / 2;

                            // Offset the label slightly to avoid overlapping the line
                            const offsetX = 10;
                            const offsetY = -10;

                            return (
                                <>
                                    {/* Background for text */}
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
                                    {/* Distance text */}
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
