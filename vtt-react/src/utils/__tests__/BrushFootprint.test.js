import { computeBrushTiles, createGridSystem } from '../InfiniteGridSystem';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';

createGridSystem(useGameStore);

const sortedKeys = (tiles) => tiles.map(tile => `${tile.x},${tile.y}`).sort();
const sortedObjectKeys = (data) => Object.keys(data).sort();

describe('computeBrushTiles', () => {
  it('returns a single cell for size 1 on square grids', () => {
    expect(sortedKeys(computeBrushTiles(4, 7, 1, 'square'))).toEqual(['4,7']);
  });

  it('returns the legacy size x size block on square grids', () => {
    const tiles = computeBrushTiles(0, 0, 3, 'square');
    expect(tiles).toHaveLength(9);
    expect(sortedKeys(tiles)).toEqual([
      '-1,-1', '-1,0', '-1,1',
      '0,-1', '0,0', '0,1',
      '1,-1', '1,0', '1,1'
    ]);
  });

  it('returns a hex ring on hex grids (size 3 -> distance <= 1)', () => {
    const tiles = computeBrushTiles(0, 0, 3, 'hex');
    expect(tiles).toHaveLength(7);
    expect(sortedKeys(tiles)).toEqual(['-1,0', '-1,1', '0,-1', '0,0', '0,1', '1,-1', '1,0']);
  });

  it('returns a two-ring hex cluster on size 5', () => {
    expect(computeBrushTiles(2, -3, 5, 'hex')).toHaveLength(19);
  });

  it('falls back to a single cell for non-numeric brush sizes', () => {
    expect(sortedKeys(computeBrushTiles(0, 0, 'medium', 'hex'))).toEqual(['0,0']);
    expect(sortedKeys(computeBrushTiles(0, 0, undefined, 'square'))).toEqual(['0,0']);
  });
});

describe('grid-system brush footprints', () => {
  it('delegates to the current grid type', () => {
    useGameStore.setState({ gridType: 'hex' });
    const gridSystem = createGridSystem(useGameStore);
    expect(gridSystem.getBrushTiles(0, 0, 3)).toHaveLength(7);

    useGameStore.setState({ gridType: 'square' });
    expect(gridSystem.getBrushTiles(0, 0, 3)).toHaveLength(9);
  });
});

describe('terrain store brush footprints match the hover preview', () => {
  beforeEach(() => {
    useLevelEditorStore.getState().setTerrainData({});
  });

  it('paintTerrainBrush stamps the hex ring, not a square block', () => {
    useGameStore.setState({ gridType: 'hex' });
    useLevelEditorStore.getState().paintTerrainBrush(0, 0, 'grass', 3);
    expect(sortedObjectKeys(useLevelEditorStore.getState().terrainData)).toEqual([
      '-1,0', '-1,1', '0,-1', '0,0', '0,1', '1,-1', '1,0'
    ]);
  });

  it('removeTerrainAtPosition erases the same hex ring', () => {
    useGameStore.setState({ gridType: 'hex' });
    const store = useLevelEditorStore.getState();
    store.paintTerrainBrush(0, 0, 'grass', 5);
    expect(Object.keys(useLevelEditorStore.getState().terrainData)).toHaveLength(19);

    store.removeTerrainAtPosition(0, 0, 3);
    expect(sortedObjectKeys(useLevelEditorStore.getState().terrainData)).toEqual([
      '-2,0', '-2,1', '-2,2', '-1,-1', '-1,2', '0,-2',
      '0,2', '1,-2', '1,1', '2,-2', '2,-1', '2,0'
    ].sort());
  });

  it('paintTerrainLine stamps hex rings along the line', () => {
    useGameStore.setState({ gridType: 'hex' });
    useLevelEditorStore.getState().paintTerrainLine(0, 0, 2, 0, 'grass', 3);
    expect(sortedObjectKeys(useLevelEditorStore.getState().terrainData)).toEqual([
      '-1,0', '-1,1', '0,-1', '0,0', '0,1', '1,-1', '1,0',
      '1,1', '2,-1', '2,0', '2,1', '3,-1', '3,0'
    ]);
  });

  it('square grids keep the legacy block footprint', () => {
    useGameStore.setState({ gridType: 'square' });
    useLevelEditorStore.getState().paintTerrainBrush(0, 0, 'grass', 2);
    expect(sortedObjectKeys(useLevelEditorStore.getState().terrainData)).toEqual([
      '-1,-1', '-1,0', '0,-1', '0,0'
    ]);
  });
});
