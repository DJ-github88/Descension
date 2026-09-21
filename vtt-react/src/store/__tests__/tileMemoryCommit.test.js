/**
 * Regression tests for the token-view performance changes in levelEditorStore:
 * - setVisibilityPolygon must not create a new identity for an unchanged polygon
 *   (subscribers re-render on identity, and it is recalculated ~20x/s).
 * - commitTileMemories must apply a whole memory pass in ONE store write instead
 *   of one write per tile (the old path issued 4 writes per visible tile).
 */

import useLevelEditorStore from '../levelEditorStore';

describe('levelEditorStore token-view performance contracts', () => {
    afterEach(() => {
        useLevelEditorStore.setState({
            currentPlayerId: null,
            playerMemories: {},
            memorySnapshots: {},
            exploredAreas: {},
            visibilityPolygon: null
        });
    });

    test('setVisibilityPolygon keeps the previous identity for an unchanged polygon', () => {
        const polygon = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }];
        const store = useLevelEditorStore.getState();
        store.setVisibilityPolygon(polygon);
        const first = useLevelEditorStore.getState().visibilityPolygon;
        expect(first).toBe(polygon);

        // Same shape in a fresh array (what every recalculation produces)
        useLevelEditorStore.getState().setVisibilityPolygon([
            { x: 0.001, y: 0.001 },
            { x: 10.001, y: 0 },
            { x: 10, y: 10 }
        ]);
        expect(useLevelEditorStore.getState().visibilityPolygon).toBe(first);

        // A real change must produce a new identity
        useLevelEditorStore.getState().setVisibilityPolygon([
            { x: 5, y: 5 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        expect(useLevelEditorStore.getState().visibilityPolygon).not.toBe(first);
    });

    test('commitTileMemories writes an entire tile pass in a single store update', () => {
        useLevelEditorStore.setState({ currentPlayerId: 'p1' });

        let memoryUpdates = 0;
        const unsubscribe = useLevelEditorStore.subscribe((state, previous) => {
            if (state.memorySnapshots !== previous.memorySnapshots) memoryUpdates++;
        });

        useLevelEditorStore.getState().commitTileMemories([
            { key: '1,1', snapshot: { terrain: null, walls: [], objects: [], dndElements: [], gridItems: [] } },
            { key: '2,2', snapshot: { terrain: 'grass', walls: [], objects: [], dndElements: [], gridItems: [] } }
        ], { playerId: 'p1' });
        unsubscribe();

        expect(memoryUpdates).toBe(1);

        const state = useLevelEditorStore.getState();
        expect(state.exploredAreas['1,1']).toBe(true);
        expect(state.exploredAreas['2,2']).toBe(true);
        expect(state.memorySnapshots['2,2'].terrain).toBe('grass');
        expect(state.playerMemories.p1.exploredAreas['1,1']).toBe(true);
        expect(state.playerMemories.p1.memorySnapshots['2,2'].terrain).toBe('grass');
    });
});
