import useSyncStore from '../syncStore';

// Mock requestAnimationFrame for Jest environment
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

describe('useSyncStore', () => {
    beforeEach(() => {
        // Reset Zustand store state before each test
        useSyncStore.setState({
            lastProcessedSequenceId: 0,
            networkFreeze: false,
            offlineQueue: []
        });
        useSyncStore.getState().clearPatchTargets();
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Basic state setters', () => {
        it('sets sequence id correctly', () => {
            useSyncStore.getState().setSequenceId(42);
            expect(useSyncStore.getState().lastProcessedSequenceId).toBe(42);
        });

        it('sets network freeze correctly', () => {
            useSyncStore.getState().setNetworkFreeze(true);
            expect(useSyncStore.getState().networkFreeze).toBe(true);
        });

        it('queues and clears offline actions', () => {
            useSyncStore.getState().queueOfflineAction({ type: 'MOVE', id: 't1' });
            useSyncStore.getState().queueOfflineAction({ type: 'UPDATE', id: 't2' });

            expect(useSyncStore.getState().offlineQueue).toHaveLength(2);
            expect(useSyncStore.getState().offlineQueue[0]).toEqual({ type: 'MOVE', id: 't1' });

            useSyncStore.getState().clearOfflineQueue();
            expect(useSyncStore.getState().offlineQueue).toHaveLength(0);
        });
    });

    describe('Patch Target Registration & Routing', () => {
        it('registers, retrieves, and unregisters patch targets', () => {
            const getDoc = () => ({});
            const commit = jest.fn();

            // Register
            const unregister = useSyncStore.getState().registerPatchTarget('tokens', getDoc, commit);
            expect(useSyncStore.getState()._patchTargets.has('/tokens')).toBe(true);

            // Unregister via returned function
            unregister();
            expect(useSyncStore.getState()._patchTargets.has('/tokens')).toBe(false);

            // Unregister via unregisterPatchTarget
            useSyncStore.getState().registerPatchTarget('/maps', getDoc, commit);
            expect(useSyncStore.getState()._patchTargets.has('/maps')).toBe(true);
            useSyncStore.getState().unregisterPatchTarget('maps');
            expect(useSyncStore.getState()._patchTargets.has('/maps')).toBe(false);
        });

        it('validates registerPatchTarget inputs', () => {
            expect(() => {
                useSyncStore.getState().registerPatchTarget(null, () => {});
            }).toThrow(TypeError);

            expect(() => {
                useSyncStore.getState().registerPatchTarget('test', null);
            }).toThrow(TypeError);
        });
    });

    describe('Delta Patch Application', () => {
        let tokensDoc;
        let mapDoc;
        let commitTokens;
        let commitMap;

        beforeEach(() => {
            tokensDoc = {
                't1': { name: 'Player 1', hp: 10 },
                't2': { name: 'Goblin 1', hp: 8 }
            };

            mapDoc = {
                gridSize: 50,
                fog: []
            };

            commitTokens = jest.fn();
            commitMap = jest.fn();

            useSyncStore.getState().registerPatchTarget('tokens', () => tokensDoc, commitTokens);
            useSyncStore.getState().registerPatchTarget('map/settings', () => mapDoc, commitMap);
        });

        it('applies patches synchronously to the matching registered target', () => {
            const patches = [
                { op: 'replace', path: '/tokens/t1/hp', value: 15 },
                { op: 'replace', path: '/map/settings/gridSize', value: 100 }
            ];

            const result = useSyncStore.getState().applyDeltaPatchSync(patches);

            expect(result.applied).toBe(2);
            expect(result.failed).toBe(0);

            // Check mutations
            expect(tokensDoc['t1'].hp).toBe(15);
            expect(mapDoc.gridSize).toBe(100);

            // Check commit callbacks called with mutated documents
            expect(commitTokens).toHaveBeenCalledWith(tokensDoc);
            expect(commitMap).toHaveBeenCalledWith(mapDoc);
        });

        it('reports failure when patch path does not match any registered target', () => {
            const patches = [
                { op: 'replace', path: '/unregistered/path', value: 42 }
            ];

            const result = useSyncStore.getState().applyDeltaPatchSync(patches);
            expect(result.applied).toBe(0);
            expect(result.failed).toBe(1);
            expect(result.errors[0].reason).toBe('no_target_registered');
        });

        it('applies patches asynchronously using requestAnimationFrame', () => {
            const patches = [
                { op: 'replace', path: '/tokens/t1/hp', value: 2 }
            ];

            useSyncStore.getState().applyDeltaPatch(patches);

            // Mutation has not happened yet because it is deferred via rAF (setTimeout)
            expect(tokensDoc['t1'].hp).toBe(10);

            // Run timers
            jest.runAllTimers();

            // Mutation happened now
            expect(tokensDoc['t1'].hp).toBe(2);
            expect(commitTokens).toHaveBeenCalled();
        });
    });
});
