import useLevelEditorStore from '../levelEditorStore';

const typeOf = (value) => (typeof value === 'string' ? value : value?.type);

describe('terrain fill actions', () => {
    beforeEach(() => {
        useLevelEditorStore.setState({
            terrainData: {},
            elevationData: {},
            rampData: {}
        });
    });

    describe('floodFillTerrain', () => {
        it('fills the connected region of the clicked type and stops at other terrain', () => {
            useLevelEditorStore.setState({
                terrainData: {
                    '0,0': 'grass', '1,0': 'grass', '2,0': 'grass',
                    '0,1': 'grass', '1,1': 'grass',
                    '2,1': 'stone',
                    // Isolated island of the same type; must stay untouched.
                    '5,0': 'grass'
                }
            });

            const changed = useLevelEditorStore.getState().floodFillTerrain(0, 0, 'sand');
            expect(changed).toBe(5);

            const data = useLevelEditorStore.getState().terrainData;
            expect(typeOf(data['0,0'])).toBe('sand');
            expect(typeOf(data['1,1'])).toBe('sand');
            expect(typeOf(data['2,1'])).toBe('stone');
            expect(typeOf(data['5,0'])).toBe('grass');
        });

        it('refuses to run away when clicked on unpainted ground', () => {
            useLevelEditorStore.setState({ terrainData: { '0,0': 'grass' } });

            const changed = useLevelEditorStore.getState().floodFillTerrain(9, 9, 'sand');

            expect(changed).toBe(0);
            const data = useLevelEditorStore.getState().terrainData;
            expect(Object.keys(data)).toEqual(['0,0']);
        });

        it('leaves the map untouched when the region already has the target type', () => {
            useLevelEditorStore.setState({
                terrainData: { '0,0': 'grass', '1,0': 'grass' }
            });
            // Pre-seed the variation the store would compute so no tile needs a
            // repaint.
            const variation = useLevelEditorStore.getState().getTileVariation(0, 0, 1);
            useLevelEditorStore.setState({
                terrainData: {
                    '0,0': { type: 'sand', variation },
                    '1,0': { type: 'sand', variation }
                }
            });

            const changed = useLevelEditorStore.getState().floodFillTerrain(0, 0, 'sand');

            expect(changed).toBe(0);
        });
    });

    describe('fillTerrainArea', () => {
        it('fills the inclusive rectangle, overwriting other types', () => {
            useLevelEditorStore.setState({
                terrainData: { '1,1': 'stone' }
            });

            const changed = useLevelEditorStore.getState().fillTerrainArea(0, 0, 2, 1, 'sand');
            expect(changed).toBe(6);

            const data = useLevelEditorStore.getState().terrainData;
            expect(typeOf(data['0,0'])).toBe('sand');
            expect(typeOf(data['2,1'])).toBe('sand');
            expect(typeOf(data['1,1'])).toBe('sand');
            expect(typeOf(data['3,1'])).toBeUndefined();
        });

        it('normalises reversed drag coordinates', () => {
            const changed = useLevelEditorStore.getState().fillTerrainArea(3, 3, 2, 2, 'dirt');
            expect(changed).toBe(4);
            const data = useLevelEditorStore.getState().terrainData;
            ['2,2', '3,2', '2,3', '3,3'].forEach((key) => {
                expect(typeOf(data[key])).toBe('dirt');
            });
        });

        it('rejects oversized rectangles instead of freezing the editor', () => {
            const changed = useLevelEditorStore.getState().fillTerrainArea(0, 0, 999, 999, 'grass');
            expect(changed).toBe(0);
            expect(Object.keys(useLevelEditorStore.getState().terrainData)).toHaveLength(0);
        });
    });

    describe('elevationIndicatorsEnabled toggle', () => {
        it('defaults to on and can be switched off and back on', () => {
            expect(useLevelEditorStore.getState().elevationIndicatorsEnabled).toBe(true);
            useLevelEditorStore.getState().setElevationIndicatorsEnabled(false);
            expect(useLevelEditorStore.getState().elevationIndicatorsEnabled).toBe(false);
            useLevelEditorStore.getState().setElevationIndicatorsEnabled(true);
            expect(useLevelEditorStore.getState().elevationIndicatorsEnabled).toBe(true);
        });
    });
});
