import React, { useEffect, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import { updateRevealedAreas } from '../../utils/VisibilityCalculations';

/**
 * DynamicFogManager - Handles real-time fog of war updates based on token movement
 * This component runs in the background and updates revealed areas when tokens move
 */
const DynamicFogManager = () => {
    // Level editor store
    const {
        dynamicFogEnabled,
        respectLineOfSight,
        fogRevealMode,
        wallData,
        revealedAreas,
        setRevealedArea,
        tokenVisionRanges,
        lightingEnabled,
        lightInteractsWithFog
    } = useLevelEditorStore();

    // Creature and token data
    const { tokens, creatures } = useCreatureStore();
    
    // Game settings
    const { feetPerTile, isGMMode } = useGameStore();

    // Calculate and update revealed areas based on current token positions
    const updateFogVisibility = useCallback(() => {
        if (!dynamicFogEnabled) return;

        // Prepare token data with vision information
        const tokensWithVision = tokens.map(token => {
            const creature = creatures.find(c => c.id === token.creatureId);
            const visionData = tokenVisionRanges[token.creatureId] || {};
            
            // Default vision settings
            let visionRange = 6; // 30ft in tiles (assuming 5ft per tile)
            let visionType = 'normal';

            // Get vision from creature data if available
            if (creature) {
                // Check for darkvision or other special vision
                if (creature.senses?.darkvision) {
                    visionRange = Math.ceil(creature.senses.darkvision / feetPerTile);
                    visionType = 'darkvision';
                } else if (creature.senses?.blindsight) {
                    visionRange = Math.ceil(creature.senses.blindsight / feetPerTile);
                    visionType = 'blindsight';
                } else if (creature.senses?.normalVision) {
                    visionRange = Math.ceil(creature.senses.normalVision / feetPerTile);
                }
            }

            // Override with manual vision settings if set
            if (visionData.range !== undefined) {
                visionRange = visionData.range;
            }
            if (visionData.type) {
                visionType = visionData.type;
            }

            return {
                ...token,
                visionRange,
                visionType,
                creature
            };
        });

        // Calculate new revealed areas
        const newRevealedAreas = updateRevealedAreas(
            tokensWithVision,
            wallData,
            {
                dynamicFogEnabled,
                respectLineOfSight
            }
        );

        // If lighting interacts with fog, also consider illuminated areas
        if (lightingEnabled && lightInteractsWithFog && window.dynamicLightingData) {
            Object.entries(window.dynamicLightingData).forEach(([tileKey, lighting]) => {
                if (lighting.intensity > 0.1) { // Minimum light threshold
                    newRevealedAreas[tileKey] = true;
                }
            });
        }

        // Update revealed areas in store
        // For performance, only update if there are actual changes
        const currentRevealedKeys = new Set(Object.keys(revealedAreas));
        const newRevealedKeys = new Set(Object.keys(newRevealedAreas));
        
        let hasChanges = false;

        // Check for new revealed areas
        newRevealedKeys.forEach(key => {
            if (!currentRevealedKeys.has(key)) {
                hasChanges = true;
                const [x, y] = key.split(',').map(Number);
                setRevealedArea(x, y, true);
            }
        });

        // Check for areas that should no longer be revealed (if temporary mode)
        if (fogRevealMode === 'temporary') {
            currentRevealedKeys.forEach(key => {
                if (!newRevealedKeys.has(key)) {
                    hasChanges = true;
                    const [x, y] = key.split(',').map(Number);
                    setRevealedArea(x, y, false);
                }
            });
        }

        if (hasChanges) {
            // Dynamic fog updated
        }
    }, [
        dynamicFogEnabled,
        respectLineOfSight,
        fogRevealMode,
        wallData,
        revealedAreas,
        tokens,
        creatures,
        tokenVisionRanges,
        feetPerTile,
        setRevealedArea,
        lightingEnabled,
        lightInteractsWithFog
    ]);

    // Update fog when tokens move
    useEffect(() => {
        updateFogVisibility();
    }, [updateFogVisibility]);

    // Set up interval for periodic updates (in case of missed updates)
    useEffect(() => {
        if (!dynamicFogEnabled) return;

        const interval = setInterval(() => {
            updateFogVisibility();
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [dynamicFogEnabled, updateFogVisibility]);

    // Debug information for GM
    useEffect(() => {
        if (isGMMode && dynamicFogEnabled) {
            // Dynamic Fog Manager Status tracking
        }
    }, [dynamicFogEnabled, respectLineOfSight, fogRevealMode, tokens.length, Object.keys(revealedAreas).length, Object.keys(wallData).length, isGMMode]);

    // This component doesn't render anything - it just manages fog state
    return null;
};

export default DynamicFogManager;
