// Simple class resource utilities stub

export const getClassResourceInfo = (characterClass) => {
    // Default resource info for all classes
    return {
        name: 'Mana',
        color: '#4A90E2',
        max: 100
    };
};

export const calculateClassResource = (characterClass, level = 1) => {
    // Simple calculation
    return 100 + (level * 10);
};
