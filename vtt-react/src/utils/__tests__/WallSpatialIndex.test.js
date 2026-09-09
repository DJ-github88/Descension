import { WallSpatialIndex, getOrBuildWallSpatialIndex } from '../WallSpatialIndex';

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
