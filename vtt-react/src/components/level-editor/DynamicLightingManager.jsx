import React, { useEffect, useCallback, useRef } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { calculateAreaLighting, isTileIlluminated } from '../../utils/LightingCalculations';

/**
 * DynamicLightingManager - Handles real-time lighting calculations and updates
 * This component runs in the background and manages lighting effects
 */
const DynamicLightingManager = () => {
    const lightingDataRef = useRef({});
    const lastUpdateRef = useRef(0);
    
    // Level editor store
    const {
        lightSources,
        lightingEnabled,
        ambientLightLevel,
        lightInteractsWithFog,
        wallData,
        revealedAreas,
        setRevealedArea,
        shadowQuality,
        atmosphericEffects,
        lightAnimations,
        performanceMode,
        shadowCasting,
        shadowSoftness,
        shadowDistance
    } = useLevelEditorStore();

    // Game settings
    const { cameraX, cameraY, zoomLevel, playerZoom, gridSize, isGMMode } = useGameStore();

    // Calculate visible area bounds for lighting calculations
    const getVisibleBounds = useCallback(() => {
        const effectiveZoom = zoomLevel * playerZoom;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate world coordinates of visible area
        const worldWidth = viewportWidth / effectiveZoom;
        const worldHeight = viewportHeight / effectiveZoom;
        
        // Add padding for smooth lighting at edges
        const padding = 10;
        const minX = Math.floor((cameraX - worldWidth / 2) / gridSize) - padding;
        const maxX = Math.ceil((cameraX + worldWidth / 2) / gridSize) + padding;
        const minY = Math.floor((cameraY - worldHeight / 2) / gridSize) - padding;
        const maxY = Math.ceil((cameraY + worldHeight / 2) / gridSize) + padding;
        
        return { minX, minY, maxX, maxY };
    }, [cameraX, cameraY, zoomLevel, playerZoom, gridSize]);

    // Update lighting calculations
    const updateLighting = useCallback(() => {
        if (!lightingEnabled) {
            lightingDataRef.current = {};
            return;
        }

        const now = Date.now();
        // Throttle updates to 30fps for performance
        if (now - lastUpdateRef.current < 33) return;
        lastUpdateRef.current = now;

        const bounds = getVisibleBounds();
        
        // Prepare advanced lighting settings
        const lightingSettings = {
            shadowCasting,
            shadowSoftness,
            shadowDistance,
            atmosphericEffects,
            performanceMode,
            lightAnimations
        };

        // Calculate lighting for visible area with advanced settings
        const newLightingData = calculateAreaLighting(
            bounds.minX,
            bounds.minY,
            bounds.maxX,
            bounds.maxY,
            lightSources,
            wallData,
            ambientLightLevel,
            lightingSettings
        );

        lightingDataRef.current = newLightingData;

        // If lighting interacts with fog, update revealed areas
        if (lightInteractsWithFog && !isGMMode) {
            Object.entries(newLightingData).forEach(([tileKey, lighting]) => {
                const [x, y] = tileKey.split(',').map(Number);
                const isIlluminated = lighting.intensity > 0.1; // Minimum light threshold
                
                if (isIlluminated) {
                    setRevealedArea(x, y, true);
                }
            });
        }

        // Debug logging for GM
        if (isGMMode && Object.keys(lightSources).length > 0) {
            // Dynamic Lighting Update tracking
        }
    }, [
        lightingEnabled,
        lightSources,
        wallData,
        ambientLightLevel,
        lightInteractsWithFog,
        isGMMode,
        getVisibleBounds,
        setRevealedArea,
        shadowQuality,
        atmosphericEffects,
        lightAnimations,
        performanceMode,
        shadowCasting,
        shadowSoftness,
        shadowDistance
    ]);

    // Update lighting when dependencies change
    useEffect(() => {
        updateLighting();
    }, [updateLighting]);

    // Set up animation frame loop for flickering lights - OPTIMIZED for performance
    useEffect(() => {
        if (!lightingEnabled) return;

        let animationId;
        let lastFlickerUpdate = 0;
        const FLICKER_THROTTLE = 100; // Limit flicker updates to 10fps instead of 60fps

        const animate = (currentTime) => {
            // Throttle flicker updates for better performance
            if (currentTime - lastFlickerUpdate < FLICKER_THROTTLE) {
                animationId = requestAnimationFrame(animate);
                return;
            }

            // Check if any lights are flickering
            const hasFlickeringLights = Object.values(lightSources).some(light =>
                light.enabled && light.flickering
            );

            if (hasFlickeringLights) {
                updateLighting();
                lastFlickerUpdate = currentTime;
                animationId = requestAnimationFrame(animate);
            } else {
                // Stop animation loop if no flickering lights
                animationId = null;
            }
        };

        // Only start animation loop if there are flickering lights
        const hasFlickeringLights = Object.values(lightSources).some(light =>
            light.enabled && light.flickering
        );

        if (hasFlickeringLights) {
            animationId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [lightingEnabled, lightSources, updateLighting]);

    // DISABLED: Periodic update for performance monitoring - causing performance issues
    // The lighting system already updates based on dependencies, this redundant interval was causing freezing
    // useEffect(() => {
    //     if (!lightingEnabled) return;

    //     const interval = setInterval(() => {
    //         updateLighting();
    //     }, 1000); // Update every second

    //     return () => clearInterval(interval);
    // }, [lightingEnabled, updateLighting]);

    // Expose lighting data globally for other components to use
    useEffect(() => {
        // Store lighting data in a global location for access by rendering components
        window.dynamicLightingData = lightingDataRef.current;
    }, [lightingDataRef.current]);

    // Debug information for GM
    useEffect(() => {
        if (isGMMode && lightingEnabled) {
            // Dynamic Lighting Manager Status tracking
        }
    }, [
        lightingEnabled,
        Object.keys(lightSources).length,
        ambientLightLevel,
        lightInteractsWithFog,
        Object.keys(lightingDataRef.current).length,
        isGMMode
    ]);

    // This component doesn't render anything - it just manages lighting state
    return null;
};

export default DynamicLightingManager;
