/**
 * Lighting Calculations for Dynamic Lighting System
 * Professional VTT implementation with realistic light falloff and shadow casting
 */

import { getLineOfSight, hasLineOfSight } from './VisibilityCalculations';

/**
 * Calculate light intensity at a specific point from a light source with advanced features
 * @param {number} lightX - Light source x coordinate
 * @param {number} lightY - Light source y coordinate
 * @param {number} targetX - Target point x coordinate
 * @param {number} targetY - Target point y coordinate
 * @param {Object} lightSource - Light source data
 * @param {Object} wallData - Wall data for shadow calculations
 * @param {Object} settings - Advanced lighting settings
 * @returns {Object} Light data { intensity, shadowFactor, atmosphericFactor }
 */
export function calculateLightIntensity(lightX, lightY, targetX, targetY, lightSource, wallData = {}, settings = {}) {
    if (!lightSource.enabled) return { intensity: 0, shadowFactor: 1, atmosphericFactor: 1 };

    const {
        shadowCasting = true,
        shadowSoftness = 0.5,
        shadowDistance = 10,
        atmosphericEffects = true,
        performanceMode = false,
        lightAnimations = true
    } = settings;

    // Calculate distance
    const dx = targetX - lightX;
    const dy = targetY - lightY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if within light radius
    if (distance > lightSource.radius) return { intensity: 0, shadowFactor: 1, atmosphericFactor: 1 };

    // Calculate base intensity with realistic falloff
    let intensity = lightSource.intensity;

    // Apply distance falloff (quadratic for realism, but clamped for gameplay)
    const falloffFactor = 1 - (distance / lightSource.radius);
    const quadraticFalloff = falloffFactor * falloffFactor;

    // Use a mix of linear and quadratic falloff for better gameplay
    const linearFalloff = falloffFactor;
    const mixedFalloff = (quadraticFalloff * 0.7) + (linearFalloff * 0.3);

    intensity *= mixedFalloff;

    // Calculate shadow factor with advanced shadow system
    let shadowFactor = 1;
    if (shadowCasting && distance <= shadowDistance) {
        shadowFactor = calculateAdvancedShadow(lightX, lightY, targetX, targetY, wallData, shadowSoftness, performanceMode);
    } else if (!hasLineOfSight(lightX, lightY, targetX, targetY, wallData)) {
        shadowFactor = 0; // Complete shadow for basic line-of-sight blocking
    }

    // Apply atmospheric effects
    let atmosphericFactor = 1;
    if (atmosphericEffects) {
        atmosphericFactor = calculateAtmosphericEffect(lightX, lightY, targetX, targetY, distance, lightSource);
    }

    // Apply flickering effect for certain light types
    if (lightSource.flickering && lightAnimations) {
        const time = Date.now() / 1000;
        const baseFlicker = 0.9 + 0.1 * Math.sin(time * 8 + lightSource.x * 0.1 + lightSource.y * 0.1);
        const detailFlicker = 0.98 + 0.02 * Math.sin(time * 15 + lightSource.y * 0.2);
        intensity *= baseFlicker * detailFlicker;
    }

    // Apply shadow and atmospheric factors
    intensity *= shadowFactor * atmosphericFactor;

    return {
        intensity: Math.max(0, Math.min(1, intensity)),
        shadowFactor,
        atmosphericFactor
    };
}

/**
 * Calculate advanced shadow factor with soft shadows
 * @param {number} lightX - Light source x
 * @param {number} lightY - Light source y
 * @param {number} targetX - Target x
 * @param {number} targetY - Target y
 * @param {Object} wallData - Wall data
 * @param {number} shadowSoftness - Shadow softness (0.0 to 1.0)
 * @param {boolean} performanceMode - Use faster but less accurate calculations
 * @returns {number} Shadow factor (0.0 = full shadow, 1.0 = no shadow)
 */
function calculateAdvancedShadow(lightX, lightY, targetX, targetY, wallData, shadowSoftness = 0.5, performanceMode = false) {
    if (performanceMode) {
        // Fast shadow calculation - just check direct line of sight
        return hasLineOfSight(lightX, lightY, targetX, targetY, wallData) ? 1 : 0;
    }

    // Advanced soft shadow calculation
    const samples = shadowSoftness > 0.7 ? 9 : shadowSoftness > 0.3 ? 5 : 3;
    const radius = shadowSoftness * 0.5; // Shadow penumbra radius

    let visibleSamples = 0;

    // Sample multiple points around the target for soft shadows
    for (let i = 0; i < samples; i++) {
        const angle = (i / samples) * Math.PI * 2;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;

        const sampleX = targetX + offsetX;
        const sampleY = targetY + offsetY;

        if (hasLineOfSight(lightX, lightY, sampleX, sampleY, wallData)) {
            visibleSamples++;
        }
    }

    // Also check the center point
    if (hasLineOfSight(lightX, lightY, targetX, targetY, wallData)) {
        visibleSamples++;
    }

    return visibleSamples / (samples + 1);
}

/**
 * Calculate atmospheric effects on lighting
 * @param {number} lightX - Light source x
 * @param {number} lightY - Light source y
 * @param {number} targetX - Target x
 * @param {number} targetY - Target y
 * @param {number} distance - Distance between light and target
 * @param {Object} lightSource - Light source data
 * @returns {number} Atmospheric factor (0.0 to 1.0)
 */
function calculateAtmosphericEffect(lightX, lightY, targetX, targetY, distance, lightSource) {
    let atmosphericFactor = 1;

    // Atmospheric scattering - light becomes slightly less intense over distance
    const scatteringFactor = 1 - (distance * 0.02); // Very subtle effect
    atmosphericFactor *= Math.max(0.8, scatteringFactor);

    // Light type specific atmospheric effects
    switch (lightSource.type) {
        case 'torch':
        case 'campfire':
            // Fire-based lights have more atmospheric scattering
            atmosphericFactor *= 0.95 - (distance * 0.01);
            break;
        case 'magical':
            // Magical lights are less affected by atmosphere
            atmosphericFactor *= 0.98;
            break;
        case 'sunlight':
            // Sunlight has minimal atmospheric effects at this scale
            atmosphericFactor *= 0.99;
            break;
    }

    return Math.max(0.7, Math.min(1, atmosphericFactor));
}

/**
 * Calculate combined lighting at a point from all light sources with advanced features
 * @param {number} x - Target x coordinate
 * @param {number} y - Target y coordinate
 * @param {Object} lightSources - All light sources
 * @param {Object} wallData - Wall data for shadow calculations
 * @param {number} ambientLight - Ambient light level (0.0 to 1.0)
 * @param {Object} settings - Advanced lighting settings
 * @returns {Object} Combined lighting data { intensity, color, shadowInfo, atmosphericInfo }
 */
export function calculateCombinedLighting(x, y, lightSources, wallData = {}, ambientLight = 0.2, settings = {}) {
    let totalIntensity = ambientLight;
    let totalRed = ambientLight * 255;
    let totalGreen = ambientLight * 255;
    let totalBlue = ambientLight * 255;

    // Advanced lighting info
    let shadowInfo = { averageShadowFactor: 1, lightCount: 0 };
    let atmosphericInfo = { averageAtmosphericFactor: 1, lightCount: 0 };

    // Add contribution from each light source
    Object.values(lightSources).forEach(lightSource => {
        const lightData = calculateLightIntensity(
            lightSource.x,
            lightSource.y,
            x,
            y,
            lightSource,
            wallData,
            settings
        );

        if (lightData.intensity > 0) {
            // Parse light color
            const color = hexToRgb(lightSource.color);
            if (color) {
                totalRed += color.r * lightData.intensity;
                totalGreen += color.g * lightData.intensity;
                totalBlue += color.b * lightData.intensity;
                totalIntensity += lightData.intensity;

                // Accumulate shadow and atmospheric info
                shadowInfo.averageShadowFactor += lightData.shadowFactor;
                atmosphericInfo.averageAtmosphericFactor += lightData.atmosphericFactor;
                shadowInfo.lightCount++;
                atmosphericInfo.lightCount++;
            }
        }
    });

    // Calculate averages for shadow and atmospheric info
    if (shadowInfo.lightCount > 0) {
        shadowInfo.averageShadowFactor /= shadowInfo.lightCount;
        atmosphericInfo.averageAtmosphericFactor /= atmosphericInfo.lightCount;
    }

    // Normalize and clamp values
    totalIntensity = Math.min(1, totalIntensity);
    totalRed = Math.min(255, totalRed);
    totalGreen = Math.min(255, totalGreen);
    totalBlue = Math.min(255, totalBlue);

    return {
        intensity: totalIntensity,
        color: `rgb(${Math.round(totalRed)}, ${Math.round(totalGreen)}, ${Math.round(totalBlue)})`,
        shadowInfo,
        atmosphericInfo
    };
}

/**
 * Calculate lighting for an entire area (for performance optimization)
 * @param {number} minX - Minimum x coordinate
 * @param {number} minY - Minimum y coordinate
 * @param {number} maxX - Maximum x coordinate
 * @param {number} maxY - Maximum y coordinate
 * @param {Object} lightSources - All light sources
 * @param {Object} wallData - Wall data for shadow calculations
 * @param {number} ambientLight - Ambient light level
 * @param {Object} settings - Advanced lighting settings
 * @returns {Object} Lighting data for each tile { "x,y": { intensity, color, shadowInfo, atmosphericInfo } }
 */
export function calculateAreaLighting(minX, minY, maxX, maxY, lightSources, wallData = {}, ambientLight = 0.2, settings = {}) {
    const lightingData = {};

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const lighting = calculateCombinedLighting(x, y, lightSources, wallData, ambientLight, settings);
            lightingData[`${x},${y}`] = lighting;
        }
    }

    return lightingData;
}

/**
 * Check if a tile is illuminated enough to be visible
 * @param {number} x - Tile x coordinate
 * @param {number} y - Tile y coordinate
 * @param {Object} lightSources - All light sources
 * @param {Object} wallData - Wall data for shadow calculations
 * @param {number} ambientLight - Ambient light level
 * @param {number} threshold - Minimum light level for visibility (default 0.1)
 * @returns {boolean} True if tile is illuminated enough to see
 */
export function isTileIlluminated(x, y, lightSources, wallData = {}, ambientLight = 0.2, threshold = 0.1) {
    const lighting = calculateCombinedLighting(x, y, lightSources, wallData, ambientLight);
    return lighting.intensity >= threshold;
}

/**
 * Calculate shadows cast by walls from a light source
 * @param {number} lightX - Light source x coordinate
 * @param {number} lightY - Light source y coordinate
 * @param {number} lightRadius - Light source radius
 * @param {Object} wallData - Wall data
 * @returns {Set} Set of shadowed tile keys "x,y"
 */
export function calculateShadows(lightX, lightY, lightRadius, wallData) {
    const shadowedTiles = new Set();
    
    // Find all walls within light radius
    const nearbyWalls = Object.entries(wallData).filter(([wallKey, wall]) => {
        const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
        const wallCenterX = (x1 + x2) / 2;
        const wallCenterY = (y1 + y2) / 2;
        const distance = Math.sqrt(
            (wallCenterX - lightX) ** 2 + (wallCenterY - lightY) ** 2
        );
        return distance <= lightRadius && wall.type.blocksVision !== false;
    });

    // For each wall, calculate shadow projection
    nearbyWalls.forEach(([wallKey, wall]) => {
        const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
        
        // Calculate shadow projection beyond the wall
        const shadowTiles = projectShadow(lightX, lightY, x1, y1, x2, y2, lightRadius);
        shadowTiles.forEach(tile => shadowedTiles.add(tile));
    });

    return shadowedTiles;
}

/**
 * Project shadow from a wall segment
 * @param {number} lightX - Light source x
 * @param {number} lightY - Light source y
 * @param {number} wallX1 - Wall start x
 * @param {number} wallY1 - Wall start y
 * @param {number} wallX2 - Wall end x
 * @param {number} wallY2 - Wall end y
 * @param {number} maxDistance - Maximum shadow distance
 * @returns {Array} Array of shadowed tile keys
 */
function projectShadow(lightX, lightY, wallX1, wallY1, wallX2, wallY2, maxDistance) {
    const shadowTiles = [];
    
    // Calculate wall endpoints relative to light
    const wall1X = wallX1 - lightX;
    const wall1Y = wallY1 - lightY;
    const wall2X = wallX2 - lightX;
    const wall2Y = wallY2 - lightY;
    
    // Project shadow rays from wall endpoints
    const projectionDistance = maxDistance * 2;
    
    // Project from first endpoint
    const proj1X = lightX + (wall1X / Math.sqrt(wall1X ** 2 + wall1Y ** 2)) * projectionDistance;
    const proj1Y = lightY + (wall1Y / Math.sqrt(wall1X ** 2 + wall1Y ** 2)) * projectionDistance;
    
    // Project from second endpoint
    const proj2X = lightX + (wall2X / Math.sqrt(wall2X ** 2 + wall2Y ** 2)) * projectionDistance;
    const proj2Y = lightY + (wall2Y / Math.sqrt(wall2X ** 2 + wall2Y ** 2)) * projectionDistance;
    
    // Fill shadow polygon (simplified - just the area behind the wall)
    const minX = Math.floor(Math.min(wallX1, wallX2, proj1X, proj2X));
    const maxX = Math.ceil(Math.max(wallX1, wallX2, proj1X, proj2X));
    const minY = Math.floor(Math.min(wallY1, wallY2, proj1Y, proj2Y));
    const maxY = Math.ceil(Math.max(wallY1, wallY2, proj1Y, proj2Y));
    
    // Check each tile in the potential shadow area
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            // Simple check: if tile is behind wall relative to light
            if (isPointInShadow(lightX, lightY, wallX1, wallY1, wallX2, wallY2, x, y)) {
                const distance = Math.sqrt((x - lightX) ** 2 + (y - lightY) ** 2);
                if (distance <= maxDistance) {
                    shadowTiles.push(`${x},${y}`);
                }
            }
        }
    }
    
    return shadowTiles;
}

/**
 * Check if a point is in shadow behind a wall
 * @param {number} lightX - Light x
 * @param {number} lightY - Light y
 * @param {number} wallX1 - Wall start x
 * @param {number} wallY1 - Wall start y
 * @param {number} wallX2 - Wall end x
 * @param {number} wallY2 - Wall end y
 * @param {number} pointX - Point x
 * @param {number} pointY - Point y
 * @returns {boolean} True if point is in shadow
 */
function isPointInShadow(lightX, lightY, wallX1, wallY1, wallX2, wallY2, pointX, pointY) {
    // Use line-of-sight check - if blocked by wall, it's in shadow
    return !hasLineOfSight(lightX, lightY, pointX, pointY, {
        [`${Math.min(wallX1, wallX2)},${Math.min(wallY1, wallY2)},${Math.max(wallX1, wallX2)},${Math.max(wallY1, wallY2)}`]: {
            type: { blocksVision: true },
            state: 'closed'
        }
    });
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {Object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Light source presets for easy configuration
 */
export const LIGHT_PRESETS = {
    torch: {
        name: 'Torch',
        radius: 4,
        color: '#ff6b35',
        intensity: 0.8,
        flickering: true,
        description: 'Standard torch - 20ft radius, warm orange glow'
    },
    lantern: {
        name: 'Lantern',
        radius: 6,
        color: '#ffeb3b',
        intensity: 1.0,
        flickering: false,
        description: 'Steady lantern - 30ft radius, bright yellow'
    },
    candle: {
        name: 'Candle',
        radius: 1,
        color: '#fff3e0',
        intensity: 0.4,
        flickering: true,
        description: 'Small candle - 5ft radius, dim warm light'
    },
    magical: {
        name: 'Magical Light',
        radius: 8,
        color: '#9c27b0',
        intensity: 1.2,
        flickering: false,
        description: 'Magical illumination - 40ft radius, purple glow'
    },
    campfire: {
        name: 'Campfire',
        radius: 5,
        color: '#ff5722',
        intensity: 1.0,
        flickering: true,
        description: 'Campfire - 25ft radius, dancing flames'
    },
    sunlight: {
        name: 'Sunlight',
        radius: 12,
        color: '#fff59d',
        intensity: 1.5,
        flickering: false,
        description: 'Bright sunlight - 60ft radius, natural daylight'
    }
};
