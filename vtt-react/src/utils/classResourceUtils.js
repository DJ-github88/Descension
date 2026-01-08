// Utility functions for class resource management and testing

import { getClassResourceConfig, initializeClassResource, getAllClassNames } from '../data/classResources';

// Test function to verify all class configurations are valid
export const validateAllClassConfigurations = () => {
    const allClasses = getAllClassNames();
    const results = [];
    
    
    allClasses.forEach(className => {
        const config = getClassResourceConfig(className);
        const testStats = {
            constitution: 14,
            strength: 12,
            agility: 16,
            intelligence: 15,
            spirit: 13,
            charisma: 17,
            level: 5
        };
        
        try {
            const resource = initializeClassResource(className, testStats);
            
            const result = {
                className,
                valid: true,
                config: !!config,
                resource: !!resource,
                hasVisual: !!(config?.visual),
                hasTooltip: !!(config?.tooltip),
                maxValue: resource?.max || 0,
                resourceType: config?.type || 'unknown'
            };
            
            results.push(result);
            // Class resource validated
        } catch (error) {
            const result = {
                className,
                valid: false,
                error: error.message
            };
            results.push(result);
            // Class resource error
        }
    });
    
    // Summary of class configurations
    return results;
};

// Function to test class resource updates
export const testClassResourceUpdates = (characterStore) => {
    
    const testClasses = ['Pyrofiend', 'Minstrel', 'Chronarch', 'Chaos Weaver', 'Gambler'];
    
    testClasses.forEach(className => {
        // Set class
        characterStore.updateCharacterInfo('class', className);

        // Check if class resource was initialized
        const state = characterStore.getState();
        if (state.classResource) {
            // Test gaining resource
            characterStore.gainClassResource(1);

            // Test consuming resource
            const newState = characterStore.getState();
            if (newState.classResource.current > 0) {
                characterStore.consumeClassResource(1);
            }
        }
    });
};

// Function to get class resource summary for display
export const getClassResourceSummary = (classResource, className) => {
    if (!classResource || !className) return null;
    
    const config = getClassResourceConfig(className);
    if (!config) return null;
    
    return {
        name: config.name,
        shortName: config.shortName,
        type: config.type,
        current: classResource.current,
        max: classResource.max,
        percentage: classResource.max > 0 ? (classResource.current / classResource.max) * 100 : 0,
        color: config.visual?.activeColor || '#666',
        icon: config.visual?.icon || '⚡',
        description: config.description
    };
};

// Function to simulate class resource effects based on type
export const simulateClassResourceEffect = (className, resourceValue) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;
    
    switch (config.type) {
        case 'stages':
            if (config.stages && resourceValue < config.stages.length) {
                return {
                    stage: config.stages[resourceValue],
                    bonuses: config.stages[resourceValue].bonuses,
                    drawbacks: config.stages[resourceValue].drawbacks
                };
            }
            break;
            
        case 'gauge':
            if (config.thresholds) {
                const activeThresholds = config.thresholds.filter(t => resourceValue >= t.value);
                return {
                    activeThresholds,
                    effects: activeThresholds.flatMap(t => t.effects)
                };
            }
            break;
            
        case 'notes':
            return {
                notesActive: resourceValue,
                maxNotes: 7,
                canFormChords: resourceValue >= 3
            };
            
        case 'gambling':
            return {
                luckLevel: resourceValue,
                riskLevel: 0, // Would be calculated based on recent actions
                canGamble: resourceValue > 0
            };
            
        default:
            return {
                resourceLevel: resourceValue,
                isActive: resourceValue > 0
            };
    }
    
    return null;
};

// Export test function for console access
window.testClassResources = () => {
    validateAllClassConfigurations();
};

export default {
    validateAllClassConfigurations,
    testClassResourceUpdates,
    getClassResourceSummary,
    simulateClassResourceEffect
};
