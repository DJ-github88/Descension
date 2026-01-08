/**
 * Item Shape Utilities
 * 
 * This module provides utilities for handling both traditional rectangular item shapes
 * and new custom arbitrary shapes while maintaining backward compatibility.
 */

/**
 * Shape types supported by the system
 */
export const SHAPE_TYPES = {
    RECTANGULAR: 'rectangular',
    CUSTOM: 'custom'
};

/**
 * Default shape for backward compatibility
 */
export const DEFAULT_SHAPE = {
    type: SHAPE_TYPES.RECTANGULAR,
    width: 1,
    height: 1,
    cells: [[true]] // 1x1 grid with single occupied cell
};

/**
 * Create a rectangular shape (backward compatibility)
 * @param {number} width - Width in grid cells
 * @param {number} height - Height in grid cells
 * @returns {Object} Shape object
 */
export function createRectangularShape(width = 1, height = 1) {
    const cells = [];
    for (let row = 0; row < height; row++) {
        const cellRow = [];
        for (let col = 0; col < width; col++) {
            cellRow.push(true); // All cells occupied in rectangle
        }
        cells.push(cellRow);
    }

    return {
        type: SHAPE_TYPES.RECTANGULAR,
        width,
        height,
        cells
    };
}

/**
 * Create a custom shape from a 2D boolean array
 * @param {boolean[][]} cells - 2D array where true = occupied cell
 * @returns {Object} Shape object
 */
export function createCustomShape(cells) {
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
        return DEFAULT_SHAPE;
    }

    // Validate that all rows have the same length
    const width = cells[0].length;
    const height = cells.length;
    
    for (let row of cells) {
        if (!Array.isArray(row) || row.length !== width) {
            console.warn('Invalid custom shape: inconsistent row lengths');
            return DEFAULT_SHAPE;
        }
    }

    // Ensure at least one cell is occupied
    const hasOccupiedCell = cells.some(row => row.some(cell => cell === true));
    if (!hasOccupiedCell) {
        console.warn('Invalid custom shape: no occupied cells');
        return DEFAULT_SHAPE;
    }

    return {
        type: SHAPE_TYPES.CUSTOM,
        width,
        height,
        cells
    };
}

/**
 * Convert legacy item format to new shape format
 * @param {Object} item - Legacy item with width/height properties
 * @returns {Object} Shape object
 */
export function convertLegacyItemToShape(item) {
    if (item.shape && item.shape.type) {
        // Already has shape data
        return item.shape;
    }

    // Convert legacy width/height to rectangular shape
    const width = item.width || 1;
    const height = item.height || 1;
    return createRectangularShape(width, height);
}

/**
 * Get the bounding box of a shape
 * @param {Object} shape - Shape object
 * @returns {Object} Bounding box {width, height}
 */
export function getShapeBounds(shape) {
    if (!shape || !shape.cells) {
        return { width: 1, height: 1 };
    }

    return {
        width: shape.width || shape.cells[0]?.length || 1,
        height: shape.height || shape.cells.length || 1
    };
}

/**
 * Check if a specific cell is occupied in the shape
 * @param {Object} shape - Shape object
 * @param {number} row - Row index (0-based)
 * @param {number} col - Column index (0-based)
 * @returns {boolean} True if cell is occupied
 */
export function isCellOccupied(shape, row, col) {
    if (!shape || !shape.cells) {
        return row === 0 && col === 0; // Default 1x1 shape
    }

    if (row < 0 || col < 0 || row >= shape.cells.length) {
        return false;
    }

    const cellRow = shape.cells[row];
    if (!cellRow || col >= cellRow.length) {
        return false;
    }

    return cellRow[col] === true;
}

/**
 * Get all occupied cell positions relative to shape origin
 * @param {Object} shape - Shape object
 * @returns {Array} Array of {row, col} objects for occupied cells
 */
export function getOccupiedCells(shape) {
    const occupiedCells = [];
    
    if (!shape || !shape.cells) {
        return [{ row: 0, col: 0 }]; // Default 1x1 shape
    }

    for (let row = 0; row < shape.cells.length; row++) {
        const cellRow = shape.cells[row];
        if (cellRow) {
            for (let col = 0; col < cellRow.length; col++) {
                if (cellRow[col] === true) {
                    occupiedCells.push({ row, col });
                }
            }
        }
    }

    return occupiedCells;
}

/**
 * Rotate a shape 90 degrees clockwise
 * @param {Object} shape - Shape object to rotate
 * @returns {Object} New rotated shape object
 */
export function rotateShape(shape) {
    if (!shape || !shape.cells) {
        return shape; // Can't rotate invalid shape
    }

    if (shape.type === 'rectangular') {
        // For rectangular shapes, just swap width and height
        return createRectangularShape(shape.height, shape.width);
    }

    if (shape.type === 'custom') {
        // For custom shapes, rotate the 2D array 90 degrees clockwise
        const oldCells = shape.cells;
        const oldHeight = oldCells.length;
        const oldWidth = oldCells[0] ? oldCells[0].length : 0;

        // Create new rotated cells array
        const newCells = [];
        for (let newRow = 0; newRow < oldWidth; newRow++) {
            newCells[newRow] = [];
            for (let newCol = 0; newCol < oldHeight; newCol++) {
                // Map new position to old position (90 degree clockwise rotation)
                const oldRow = oldHeight - 1 - newCol;
                const oldCol = newRow;
                newCells[newRow][newCol] = oldCells[oldRow] && oldCells[oldRow][oldCol] ? true : false;
            }
        }

        return {
            type: 'custom',
            width: oldHeight,  // Width becomes old height
            height: oldWidth,  // Height becomes old width
            cells: newCells
        };
    }

    return shape; // Unknown shape type, return as-is
}