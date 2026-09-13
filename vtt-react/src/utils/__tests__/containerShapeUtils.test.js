import {
    buildContainerShapeCells,
    containerShapeFromCells,
    countContainerFloorCells,
    getContainerShapeCells,
    isContainerCellFloor,
    resizeContainerShapeCells
} from '../containerShapeUtils';

describe('containerShapeUtils', () => {
    test('treats missing shapes as fully usable rectangles', () => {
        expect(isContainerCellFloor(null, 10, 10)).toBe(true);
        expect(isContainerCellFloor({}, 10, 10)).toBe(true);
        expect(countContainerFloorCells(getContainerShapeCells(null, 3, 4))).toBe(12);
    });

    test('builds cells from an ASCII preset', () => {
        const cells = buildContainerShapeCells(['.##', '###'], 2, 3);

        expect(cells).toEqual([
            [false, true, true],
            [true, true, true]
        ]);
        expect(countContainerFloorCells(cells)).toBe(5);
    });

    test('pads grown grids with usable cells', () => {
        const cells = buildContainerShapeCells(['.#', '##'], 3, 4);

        expect(cells[0]).toEqual([false, true, true, true]);
        expect(cells[2]).toEqual([true, true, true, true]);
    });

    test('round-trips irregular cells into a custom shape', () => {
        const cells = [
            [true, false, true],
            [true, true, true]
        ];
        const shape = containerShapeFromCells(cells);

        expect(shape.type).toBe('custom');
        expect(getContainerShapeCells(shape, 2, 3)).toEqual(cells);
    });

    test('normalizes full grids into a rectangular shape', () => {
        const shape = containerShapeFromCells([
            [true, true],
            [true, true]
        ]);

        expect(shape.type).toBe('rectangular');
        expect(isContainerCellFloor(shape, 0, 0)).toBe(true);
    });

    test('preserves cells when resizing and fills new cells', () => {
        const resized = resizeContainerShapeCells([
            [true, false],
            [true, true]
        ], 3, 3);

        expect(resized).toEqual([
            [true, false, true],
            [true, true, true],
            [true, true, true]
        ]);
    });
});
