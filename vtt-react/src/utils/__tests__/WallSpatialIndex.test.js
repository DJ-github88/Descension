import { WallSpatialIndex, getOrBuildWallSpatialIndex } from '../WallSpatialIndex';
import { InfiniteGridSystem } from '../InfiniteGridSystem';

describe('WallSpatialIndex with rbush', () => {
  const wallData = {
    '0,0,10,0': { type: 'stone_wall', state: 'closed' },
    '10,0,10,10': { type: 'stone_wall', state: 'closed' },
    '10,10,0,10': { type: 'wooden_door', state: 'open' },
    '0,10,0,0': { type: 'stone_wall', state: 'closed' },
    '50,50,60,50': { type: 'stone_wall', state: 'closed' } // Far away wall
  };

  test('loads wall segments and indexes them into R-Tree', () => {
    const index = new WallSpatialIndex();
    index.load(wallData, 50, 0, 0);

    expect(index.count).toBe(5);
  });

  test('searchBoundingBox returns only intersecting walls in O(log N)', () => {
    const index = new WallSpatialIndex();
    index.load(wallData, 50, 0, 0);

    // Box around first room (world 0 to 500)
    // Wall 50,50,60,50 is at world coords 2500 to 3000
    const results = index.searchBoundingBox(-50, -50, 550, 550);
    expect(results.length).toBe(4);

    const keys = results.map(r => r.wallKey);
    expect(keys).toContain('0,0,10,0');
    expect(keys).toContain('10,0,10,10');
    expect(keys).toContain('10,10,0,10');
    expect(keys).toContain('0,10,0,0');
    expect(keys).not.toContain('50,50,60,50');
  });

  test('searchRadius locates walls near a point', () => {
    const index = new WallSpatialIndex();
    index.load(wallData, 50, 0, 0);

    // Search around world point (2750, 2500), radius 200 (near the 50,50,60,50 wall)
    const results = index.searchRadius(2750, 2500, 200);
    expect(results.length).toBe(1);
    expect(results[0].wallKey).toBe('50,50,60,50');
  });

  test('getOrBuildWallSpatialIndex reuses cached instance for same wallData', () => {
    const index1 = getOrBuildWallSpatialIndex(wallData, 50, 0, 0);
    const index2 = getOrBuildWallSpatialIndex(wallData, 50, 0, 0);

    expect(index1).toBe(index2);
    expect(index1.count).toBe(5);
  });
});

describe('WallSpatialIndex hex grids', () => {
  const gridSize = 50;

  const makeHexGrid = () => new InfiniteGridSystem({
    getState: () => ({
      gridSize,
      gridType: 'hex',
      gridOffsetX: 0,
      gridOffsetY: 0,
      cameraX: 0,
      cameraY: 0,
      zoomLevel: 1,
      playerZoom: 1,
      viewMode: '2d',
      viewRotation: 0,
      viewTilt: 90
    })
  });

  test('indexes hex walls by their resolved world endpoints', () => {
    const gridSystem = makeHexGrid();
    const edge = gridSystem.getHexEdge(0, 0, 1, 0);
    const parts = gridSystem.hexVertexKeyParts(edge.start);
    const other = gridSystem.hexVertexKeyParts(edge.end);
    const wallData = {
      [`${parts.x},${parts.y},${other.x},${other.y}`]: {
        type: 'stone_wall',
        state: 'closed',
        hexEndpoints: [
          { x: edge.start.x, y: edge.start.y },
          { x: edge.end.x, y: edge.end.y }
        ]
      }
    };

    const index = new WallSpatialIndex();
    index.load(wallData, gridSize, 0, 0, 'hex', gridSystem);
    expect(index.count).toBe(1);

    const results = index.searchBoundingBox(24, -14, 26, 14);
    expect(results.length).toBe(1);
    expect(results[0].worldCoords[0]).toBeCloseTo(edge.start.x, 5);
    expect(results[0].worldCoords[1]).toBeCloseTo(edge.start.y, 5);

    // A box on the far side of the map must not match (regression: keys are
    // world*100 for hex, not grid corners)
    expect(index.searchBoundingBox(2000, 2000, 3000, 3000).length).toBe(0);
  });

  test('resolves legacy cell-pair hex walls through getHexEdge', () => {
    const gridSystem = makeHexGrid();
    const edge = gridSystem.getHexEdge(0, 0, 1, 0);
    const index = new WallSpatialIndex();
    index.load({ '0,0,1,0': { type: 'stone_wall', state: 'closed' } }, gridSize, 0, 0, 'hex', gridSystem);

    const results = index.searchBoundingBox(24, -14, 26, 14);
    expect(results.length).toBe(1);
    expect(results[0].worldCoords[2]).toBeCloseTo(edge.end.x, 5);
  });
});
