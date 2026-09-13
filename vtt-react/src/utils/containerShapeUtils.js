import { createCustomShape, createRectangularShape } from './itemShapeUtils';

export function isContainerCellFloor(shape, row, col) {
    if (!shape || !Array.isArray(shape.cells)) return true;

    const shapeRow = shape.cells[row];
    if (!shapeRow) return true;

    const value = shapeRow[col];
    if (value === undefined) return true;

    return value !== false;
}

export function getContainerShapeCells(shape, rows, cols) {
    const cells = [];
    for (let row = 0; row < rows; row++) {
        const cellRow = [];
        for (let col = 0; col < cols; col++) {
            cellRow.push(isContainerCellFloor(shape, row, col));
        }
        cells.push(cellRow);
    }
    return cells;
}

export function buildContainerShapeCells(preset, rows, cols) {
    if (!preset) return getContainerShapeCells(null, rows, cols);

    const cells = [];
    for (let row = 0; row < rows; row++) {
        const line = preset[row];
        const cellRow = [];
        for (let col = 0; col < cols; col++) {
            const char = line ? line[col] : undefined;
            cellRow.push(char === undefined ? true : char === '#');
        }
        cells.push(cellRow);
    }
    return cells;
}

export function resizeContainerShapeCells(cells, rows, cols) {
    const resized = [];
    for (let row = 0; row < rows; row++) {
        const cellRow = [];
        for (let col = 0; col < cols; col++) {
            const existing = cells && cells[row] ? cells[row][col] : undefined;
            cellRow.push(existing === undefined ? true : existing !== false);
        }
        resized.push(cellRow);
    }
    return resized;
}

export function countContainerFloorCells(cells) {
    if (!Array.isArray(cells)) return 0;
    return cells.reduce((total, row) => total + row.filter(Boolean).length, 0);
}

export function containerShapeFromCells(cells) {
    const rows = cells.length;
    const cols = rows > 0 ? cells[0].length : 0;
    const isFull = cells.every(row => row.every(cell => cell !== false));

    if (isFull) return createRectangularShape(cols, rows);

    return createCustomShape(cells.map(row => row.map(cell => cell === true)));
}
