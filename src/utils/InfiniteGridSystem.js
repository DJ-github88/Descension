// Simple grid system stub for basic functionality

let gridSystemInstance = null;

export const createGridSystem = (useGameStore) => {
    if (!gridSystemInstance) {
        gridSystemInstance = {
            getViewportDimensions: () => ({
                width: window.innerWidth,
                height: window.innerHeight
            }),
            // Add other methods as needed
        };
    }
    return gridSystemInstance;
};

export const getGridSystem = () => {
    if (!gridSystemInstance) {
        gridSystemInstance = {
            getViewportDimensions: () => ({
                width: window.innerWidth,
                height: window.innerHeight
            }),
            // Add other methods as needed
        };
    }
    return gridSystemInstance;
};
