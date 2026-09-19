/**
 * Regression tests for the explored-position lookup cache in levelEditorStore.
 *
 * These lookups run per object/tile/afterimage every rendered frame, so they
 * memoize results per world position and must invalidate whenever the explored
 * polygons/areas change (zustand writes new identities on every update).
 */

import useLevelEditorStore from '../levelEditorStore';
import useGameStore from '../gameStore';
import { createGridSystem } from '../../utils/InfiniteGridSystem';

const makeSquare = (cx, cy, half, stepsPerSide = 12) => {
    const points = [];
    for (let i = 0; i < stepsPerSide; i++) {
        points.push({ x: cx - half + (2 * half * i) / stepsPerSide, y: cy - half });
    }
    for (let i = 0; i < stepsPerSide; i++) {
        points.push({ x: cx + half, y: cy - half + (2 * half * i) / stepsPerSide });
    }
    for (let i = 0; i < stepsPerSide; i++) {
        points.push({ x: cx + half - (2 * half * i) / stepsPerSide, y: cy + half });
    }
    for (let i = 0; i < stepsPerSide; i++) {
        points.push({ x: cx - half, y: cy + half - (2 * half * i) / stepsPerSide });
    }
    return points;
};

const makeMemory = (overrides = {}) => ({
    exploredAreas: {},
    exploredCircles: [],
    exploredPolygons: [],
    memorySnapshots: {},
    tokenAfterimages: {},
    ...overrides
});

describe('levelEditorStore explored-position lookup cache', () => {
    beforeAll(() => {
        createGridSystem(useGameStore);
    });

    afterEach(() => {
        useLevelEditorStore.setState({
            currentPlayerId: null,
            playerMemories: {},
            exploredPolygons: [],
            exploredAreas: {}
        });
    });

    test('isPlayerPositionExplored hits per-player polygons and memoizes until data changes', () => {
        useLevelEditorStore.setState({
            currentPlayerId: 'p1',
            playerMemories: {
                p1: makeMemory({
                    exploredPolygons: [{ points: makeSquare(500, 500, 100), timestamp: 1 }]
                })
            }
        });

        const store = useLevelEditorStore.getState();

        expect(store.isPlayerPositionExplored(500, 500)).toBe(true);
        expect(store.isPlayerPositionExplored(500, 500)).toBe(true);
        expect(store.isPlayerPositionExplored(900, 900)).toBe(false);

        // Changing explored data must invalidate the memoized result.
        useLevelEditorStore.setState({
            playerMemories: {
                p1: makeMemory({
                    exploredPolygons: [{ points: makeSquare(5000, 5000, 100), timestamp: 2 }]
                })
            }
        });

        expect(useLevelEditorStore.getState().isPlayerPositionExplored(500, 500)).toBe(false);
        expect(useLevelEditorStore.getState().isPlayerPositionExplored(5000, 5000)).toBe(true);
    });

    test('isPlayerPositionExplored uses per-player and legacy tile maps', () => {
        useLevelEditorStore.setState({
            currentPlayerId: 'p1',
            playerMemories: {
                p1: makeMemory({ exploredAreas: { '0,0': true } })
            }
        });

        const store = useLevelEditorStore.getState();

        // Anchor (10, 10) falls into tile 0,0 for the default 50px grid.
        expect(store.isPlayerPositionExplored(10, 10)).toBe(true);
        expect(store.isPlayerPositionExplored(10, 10000)).toBe(false);

        useLevelEditorStore.setState({
            playerMemories: { p1: makeMemory() },
            exploredAreas: { '3,3': true }
        });

        expect(useLevelEditorStore.getState().isPlayerPositionExplored(160, 160)).toBe(true);
    });

    test('isPositionExplored uses legacy polygons and areas with invalidation', () => {
        useLevelEditorStore.setState({
            exploredPolygons: [{ points: makeSquare(1000, 1000, 50), timestamp: 1 }],
            exploredAreas: {}
        });

        expect(useLevelEditorStore.getState().isPositionExplored(1000, 1000)).toBe(true);
        expect(useLevelEditorStore.getState().isPositionExplored(1200, 1200)).toBe(false);

        useLevelEditorStore.setState({ exploredPolygons: [] });

        expect(useLevelEditorStore.getState().isPositionExplored(1000, 1000)).toBe(false);
    });
});
